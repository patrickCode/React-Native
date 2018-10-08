import { CacheLogger } from './cache.logger';
import { IDatabase } from "./database.interface";
import { JobPoolWorker, ExecutionStatus } from "./job.pool.worker";
import { Job, JobStatus, JobRunStatus, IJobPoolManager, RuntimeSetting, JobPool, PooledJob, RunMode, JobType, PoolStatus } from "./job.interface";
import { Timer } from './timer';


const RE_SCHEDULE_JOB = "RE_SCHEDULE_JOB";
const DELETE_JOB = "DELETE_JOB";

export class JobPoolManager implements IJobPoolManager {
    private PoolStatus: PoolStatus = PoolStatus.Idle;
    constructor(
        private _poolName: string,
        private _jobDatabase: IDatabase<Job>,
        private _jobPoolDatabase: IDatabase<JobPool>,
        private _worker: JobPoolWorker = new JobPoolWorker()
    ) { }

    async Create(): Promise<void> {
        await this._jobDatabase.Connect();
        await this._jobPoolDatabase.Connect();
    }

    async AddJob(job: Job): Promise<void> {
        let existingJob = await this._jobDatabase.Get(job.Id);
        if (existingJob === undefined || existingJob === null) {
            let initialJobStatus: JobStatus = {
                RunHistory: [],
                IsActive: false
            }
            job.Status = initialJobStatus;
        } else {
            if (existingJob.Status &&
                job.Status && job.Status.RunHistory &&
                job.Status.RunHistory.length === 0) {
                job.Status == existingJob.Status;
            }
        }
        await this._jobDatabase.Upsert(job);
    }


    DefineJob(job: Job): void {
        this._worker.AssignJob(job);
    }

    async RemoveJob(jobId: string): Promise<void> {
        await this._jobDatabase.Delete(jobId);

        let pool = await this._jobPoolDatabase.Get(this._poolName);
        if (pool !== undefined && pool !== null) {
            let deletedJobIndex = pool.JobQueue.findIndex(p => p.Id === jobId);
            if (deletedJobIndex >= 0) {
                pool.JobQueue = [...pool.JobQueue.slice(0, deletedJobIndex), ...pool.JobQueue.slice(deletedJobIndex + 1)]
            }
            await this._jobPoolDatabase.Upsert(pool);
        }
    }

    async CompleteJobExecutionFromPool(jobId: string, jobRunStatus: JobRunStatus): Promise<JobPool> {
        let jobPool = await this._jobPoolDatabase.Get(this._poolName);
        if (!(jobPool && jobPool.JobQueue))
            throw new Error("No jobs present in the queue");

        let jobPositionAtQueue = jobPool.JobQueue.findIndex(jq => jq.Id === jobId);
        jobPool.JobQueue = [...jobPool.JobQueue.slice(0, jobPositionAtQueue), ...jobPool.JobQueue.slice(jobPositionAtQueue + 1)]; //If there are duplicate jobs in the queue then the first occurrence of the job will be removed
        jobPool.ActiveJobId = jobPool.JobQueue.length > 0 ? jobPool.JobQueue[0].Id : "";
        await this._jobPoolDatabase.Upsert(jobPool);

        await this.UpdateJobRunHistory(jobId, jobRunStatus);

        return jobPool;
    }

    async UpdateJobRunHistory(jobId: string, runStatus: JobRunStatus) {
        let job = await this._jobDatabase.Get(jobId);
        if (job === undefined || job === null) {
            throw new Error(`Job with ID ${jobId} is not present in the database`);
        }
        if (job.Status && job.Status.RunHistory) {
            job.Status.RunHistory.push(runStatus);
        } else {
            if (!job.Status)
                job.Status = { IsActive: false, RunHistory: null }
            job.Status.RunHistory = [runStatus]
        }
        await this._jobDatabase.Upsert(job);
    }

    async GetJobRunHistory(jobId: string): Promise<Array<JobRunStatus>> {
        let job = await this._jobDatabase.Get(jobId);
        if (job === undefined || job === null) {
            return null;
        }
        if (job.Status && job.Status.RunHistory) {
            return job.Status.RunHistory;
        }
        return null;
    }

    async GetJobLastRunStatus(jobId: string): Promise<JobRunStatus> {
        let job = await this._jobDatabase.Get(jobId);
        if (job === undefined || job === null) {
            return null;
        }
        if (job.Status && job.Status.RunHistory) {
            return job.Status.RunHistory[job.Status.RunHistory.length - 1];
        }
        return null;
    }

    async ScheduleJobs(shouldAppend: boolean = false): Promise<void> {
        let currentJobs = await this._jobDatabase.GetAll();
        let sortedJobs = currentJobs.sort((a, b) => {
            if (a.Priority > b.Priority)
                return 1;
            else if (b.Priority > a.Priority)
                return -1;
            else {
                if (a.CreatedOn > b.CreatedOn)
                    return 1;
                else if (b.CreatedOn > a.CreatedOn)
                    return -1;
            }
            return 0;
        });
        let pooledJobs: Array<PooledJob> = [];
        sortedJobs.forEach(job => {
            pooledJobs.push(this.CreatePooledJob(job));
        });

        let currentJobPool = await this._jobPoolDatabase.Get(this._poolName);
        if (currentJobPool === null) {
            currentJobPool = {
                JobQueue: [],
                ActiveJobId: "",
                Id: this._poolName,
                Name: this._poolName
            }
        }
        currentJobPool.JobQueue = shouldAppend ? [...currentJobPool.JobQueue, ...pooledJobs] : pooledJobs;
        await this._jobPoolDatabase.Upsert(currentJobPool);
        let updatedPool = await this._jobPoolDatabase.Get(this._poolName);
        //alert("POOL " + JSON.stringify(updatedPool));
        await CacheLogger.Log("[Scheduler] " + JSON.stringify(updatedPool));
    }

    private CreatePooledJob(job: Job): PooledJob {
        return {
            Id: job.Id,
            FailedAttempts: job.RuntimeSettings.RetryAttempt
        }
    }

    async DeleteJob(jobId: string): Promise<void> {
        let job = this._jobDatabase.Get(jobId);
        if (job === undefined || job === null)
            return;
    }

    async Terminate(): Promise<void> {
        if (this.PoolStatus === PoolStatus.Active) {
            this.PoolStatus = PoolStatus.Cancelled;
        }
    }

    async Execute(settings: RuntimeSetting): Promise<void> {
        await CacheLogger.Log("[Pool Manager] Pool execution started");
        let currentJobPool = await this._jobPoolDatabase.Get(this._poolName);
        await CacheLogger.Log("[Pool Manager] Pool taken from DB");
        let jobs = await this._jobDatabase.GetAll();
        await CacheLogger.Log("[Pool Manager] Job taken from DB");
        await this.ValidatePool(currentJobPool, jobs);
        await CacheLogger.Log("[Pool Manager] Pool Validated");
        await CacheLogger.Log("[Pool Manager] Execution started");
        this.PoolStatus = PoolStatus.Active;
        let timer = new Timer();
        await Promise.race([
            timer.Run(settings.Timeout),
            this.ExecuteJobPool(currentJobPool, jobs, settings)
        ]);
        await this.Terminate();
        //alert("Pool terminating");
    }

    private async ValidatePool(jobPool: JobPool, jobs: Array<Job>): Promise<void> {
        try {
            if (jobPool.JobQueue === undefined || jobPool.JobQueue === null)
                throw new Error("Job Queue not iniitalized");
            if (jobPool.JobQueue.length < 1)
                throw new Error("Job Queue not iniitalized");
            let invalidPooledJobs = jobPool.JobQueue.filter(jp => jobs.findIndex(j => j.Id === jp.Id) < 0);
            if (invalidPooledJobs && invalidPooledJobs.length > 0)
                throw new Error("Some jobs are not defined in the pool");
        } catch (exception) {
            await CacheLogger.Log("[Pool Validation] Error");
            await CacheLogger.Log("[Pool Validation] " + JSON.stringify(exception));
            await CacheLogger.Log("[Pool Validation] jobPool" + JSON.stringify(jobPool));
            await CacheLogger.Log("[Pool Validation] jobs" + JSON.stringify(jobs));
            throw exception;
        }

    }

    private async ExecuteJobPool(currentJobPool: JobPool, jobs: Array<Job>, settings: RuntimeSetting) {
        if (currentJobPool.JobQueue === undefined || currentJobPool.JobQueue === null || currentJobPool.JobQueue.length === 0)
            return;

        do {
            let activeJobId = currentJobPool.JobQueue[0].Id;
            let job = jobs.find(j => j.Id === activeJobId);
            CacheLogger.Log("[Pool Manager] Execution starting for " + job.Name);
            let lastRunStatus: JobRunStatus = job.Status && job.Status.RunHistory && job.Status.RunHistory.length > 0
                ? job.Status.RunHistory[job.Status.RunHistory.length - 1]
                : { Attempts: 0, Error: null, IsFailed: false, Mode: RunMode.Background, Timestamp: new Date(), TimeTaken: 0 };


            let jobExecutionResult: ExecutionStatus;
            if (job.JobType == JobType.Control) {
                jobExecutionResult = await this.ExecuteControlJob(job);
            } else {
                jobExecutionResult = await this._worker.Execute(job);
            }

            CacheLogger.Log(`[Pool Manager] Execution completed for ${job.Name} with error status - ${jobExecutionResult.Error}`);

            currentJobPool = await this.UpdateJobPool(job, lastRunStatus, currentJobPool, jobExecutionResult, settings);
        } while (currentJobPool.JobQueue.length > 0 && this.PoolStatus === PoolStatus.Active);
        this.PoolStatus = PoolStatus.Idle;
    }

    private async UpdateJobPool(job: Job, lastRunStatus: JobRunStatus, currentJobPool: JobPool, jobExecutionStatus: ExecutionStatus, settings: RuntimeSetting): Promise<JobPool> {
        let maxAttemptAllowed = job.RuntimeSettings.RetryAttempt;
        if (jobExecutionStatus.IsFailed) {
            let runStatus: JobRunStatus = { IsFailed: true, Timestamp: new Date(), Attempts: lastRunStatus.Attempts + 1, Mode: settings.Mode, TimeTaken: jobExecutionStatus.TimeTaken, Error: JSON.stringify(jobExecutionStatus.Error) };
            if ((lastRunStatus.Attempts + 1) >= maxAttemptAllowed) {
                currentJobPool = await this.CompleteJobExecutionFromPool(job.Id, runStatus);
                settings.Notify(job.Id, job.Name, runStatus);
            } else {
                await this.UpdateJobRunHistory(job.Id, runStatus);
            }
        } else {
            let runStatus: JobRunStatus = { IsFailed: false, Timestamp: new Date(), Attempts: lastRunStatus.Attempts, Mode: settings.Mode, TimeTaken: jobExecutionStatus.TimeTaken, Error: "" };
            currentJobPool = await this.CompleteJobExecutionFromPool(job.Id, runStatus);
            settings.Notify(job.Id, job.Name, runStatus);
        }
        return currentJobPool;
    }

    private async ExecuteControlJob(job: Job): Promise<ExecutionStatus> {
        try {
            switch (job.Name) {
                case RE_SCHEDULE_JOB: await this.ScheduleJobs(true); //We must append to the existing jobs, in case there are other jobs in the queue that needs to be executed
                    break;
                case DELETE_JOB: await this.RemoveJob(job.Id);
                    break;
                default: throw new Error("Control job is not defined");
            }
            return {
                Error: null,
                IsFailed: false,
                IsTimeout: false,
                TimeTaken: 0
            }
        } catch (error) {
            return {
                Error: error,
                IsFailed: true,
                IsTimeout: false,
                TimeTaken: 0
            }
        }
    }
}