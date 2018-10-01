import { RealmDatabase } from "./realm.database";
import { JobPoolWorker } from "./job.pool.worker";
import { IDatabase, DatabaseConfiguration } from "./database.interface";
import { Job, JobStatus, JobRunStatus, IJobPoolManager, RuntimeSetting, JobPool, PooledJob } from "./job.interface";

export class JobPoolManager implements IJobPoolManager {

    constructor(
        private _poolName: string,
        private _jobPoolDatabaseConfiguration: DatabaseConfiguration,
        private _jobDatabaseConfiguration: DatabaseConfiguration,
        private _jobStatusDatabaseConfiguration: DatabaseConfiguration,
        private _jobDatabase: IDatabase<Job> = new RealmDatabase<Job>(),
        private _jobPoolDatabase: IDatabase<JobPool> = new RealmDatabase<JobPool>(),
        private _jobStatusDatabase: IDatabase<JobStatus> = new RealmDatabase<JobStatus>(),
        private _worker: JobPoolWorker = new JobPoolWorker()
    ) { }

    async Create(): Promise<void> {
        await this._jobDatabase.Connect(this._jobDatabaseConfiguration);
        await this._jobPoolDatabase.Connect(this._jobPoolDatabaseConfiguration);
        await this._jobStatusDatabase.Connect(this._jobStatusDatabaseConfiguration);
    }

    async AddJob(job: Job): Promise<void> {
        await this._jobDatabase.Upsert(job);
        let initialJobStatus: JobStatus = {
            Id: job.Id,
            RunHistory: [],
            IsActive: false
        }
        await this._jobStatusDatabase.Upsert(initialJobStatus);
    }


    DefineJob(job: Job): void {
        this._worker.AssignJob(job);
    }

    async RemoveJob(jobId: string): Promise<void> {
        await this._jobDatabase.Delete(jobId);
        await this._jobStatusDatabase.Delete(jobId);

        let pool = await this._jobPoolDatabase.Get(this._poolName);
        if (pool !== undefined && pool !== null) {
            let deletedJobIndex = pool.JobQueue.findIndex(p => p.Id === jobId);
            if (deletedJobIndex >= 0) {
                pool.JobQueue = [...pool.JobQueue.slice(0, deletedJobIndex), ...pool.JobQueue.slice(deletedJobIndex + 1)]
            }
            await this._jobPoolDatabase.Upsert(pool);
        }
    }

    async CompleteJobExecutionFromPool(jobId: string, jobRunStatus: JobRunStatus): Promise<void> {
        let jobPool = await this._jobPoolDatabase.Get(this._poolName);
        jobPool.JobQueue = [...jobPool.JobQueue.slice(1)];
        jobPool.ActiveJobId = jobPool.JobQueue[0].Id;
        await this._jobPoolDatabase.Upsert(jobPool);

        let jobStatus = await this._jobStatusDatabase.Get(jobId);
        jobStatus.RunHistory.push(jobRunStatus);
        await this._jobStatusDatabase.Upsert(jobStatus);
    }

    async UpdateJobRunHistory(jobId: string, runStatus: JobRunStatus) {
        let jobStatus = await this._jobStatusDatabase.Get(jobId);
        jobStatus.RunHistory.push(runStatus);
        await this._jobStatusDatabase.Upsert(jobStatus);
    }

    async GetJobRunHistory(jobId: string): Promise<Array<JobRunStatus>> {
        let jobStatus = await this._jobStatusDatabase.Get(jobId);
        if (jobStatus !== undefined && jobStatus !== null) {
            return jobStatus.RunHistory;
        }
        return null;
    }

    async GetJobLastRunStatus(jobId: string): Promise<JobRunStatus> {
        let jobStatus = await this._jobStatusDatabase.Get(jobId);
        if (jobStatus !== undefined && jobStatus !== null) {
            return jobStatus.RunHistory[jobStatus.RunHistory.length - 1];
        }
        return null;
    }

    async ScheduleJobs(): Promise<void> {
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
        currentJobPool.JobQueue = pooledJobs;
        await this._jobPoolDatabase.Upsert(currentJobPool);
    }

    private CreatePooledJob(job: Job): PooledJob {
        return {
            Id: job.Id,
            FailedAttempts: job.RuntimeSettings.RetryAttempt
        }
    }

    async Execute(settings: RuntimeSetting): Promise<void> {
        let currentJobPool = await this._jobPoolDatabase.Get(this._poolName);
        let jobs = await this._jobDatabase.GetAll();
        let jobStatusList = await this._jobStatusDatabase.GetAll();
        this.ValidatePool(currentJobPool, jobs, jobStatusList);

        Promise.race([
            this.runTimer(settings.Timeout),
            this.ExecuteJobPool(currentJobPool, jobs, jobStatusList, settings)
        ]);
    }

    private ValidatePool(jobPool: JobPool, jobs: Array<Job>, jobStatusList: Array<JobStatus>): void {
        if (jobPool.JobQueue === undefined || jobPool.JobQueue === null)
            throw new Error("Job Queue not iniitalized");
        if (jobPool.JobQueue.length < 1)
            throw new Error("Job Queue not iniitalized");
        let invalidPooledJobs = jobPool.JobQueue.filter(jp => jobs.findIndex(j => j.Id === jp.Id) < 0);
        if (invalidPooledJobs && invalidPooledJobs.length > 0)
            throw new Error("Some jobs are not defined in the pool");
        let invalidPooledJobsWithNoStatus = jobPool.JobQueue.filter(jp => jobStatusList.findIndex(j => j.Id === jp.Id) < 0);
        if (invalidPooledJobsWithNoStatus && invalidPooledJobsWithNoStatus.length > 0)
            throw new Error("Some jobs in the pool doesnt have any initial statusd defined");
    }

    private async ExecuteJobPool(currentJobPool: JobPool, jobs: Array<Job>, jobStatusList: Array<JobStatus>, settings: RuntimeSetting) {
        do {
            let activeJobId = currentJobPool.JobQueue[0].Id;
            let job = jobs.find(j => j.Id === activeJobId);
            let currentJobStatus = jobStatusList.find(js => js.Id === activeJobId);
            let lastRunStatus = currentJobStatus.RunHistory[currentJobStatus.RunHistory.length - 1];
            let maxAttemptAllowed = job.RuntimeSettings.RetryAttempt;

            let result = await this._worker.Execute(job);
            if (result.IsFailed) {
                let runStatus: JobRunStatus = { IsFailed: true, Timestamp: new Date(), Attempts: lastRunStatus.Attempts + 1, Mode: settings.Mode, TimeTaken: result.TimeTaken, Error: JSON.stringify(result.Error) };
                if ((lastRunStatus.Attempts + 1) >= maxAttemptAllowed) {
                    await this.CompleteJobExecutionFromPool(job.Id, runStatus);
                    settings.Notify(job.Id, job.Name, runStatus);
                } else {
                    await this.UpdateJobRunHistory(job.Id, runStatus);
                }
            } else {
                let runStatus: JobRunStatus = { IsFailed: false, Timestamp: new Date(), Attempts: lastRunStatus.Attempts, Mode: settings.Mode, TimeTaken: result.TimeTaken, Error: "" };
                await this.CompleteJobExecutionFromPool(job.Id, runStatus);
                settings.Notify(job.Id, job.Name, runStatus);
            }
        } while (currentJobPool.JobQueue.length > 0);
    }

    private runTimer(timeout: number): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, timeout);
        })
    }
}