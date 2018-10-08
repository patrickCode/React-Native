var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CacheLogger } from './cache.logger';
import { JobPoolWorker } from "./job.pool.worker";
import { RunMode, JobType, PoolStatus } from "./job.interface";
import { Timer } from './timer';
const RE_SCHEDULE_JOB = "RE_SCHEDULE_JOB";
const DELETE_JOB = "DELETE_JOB";
export class JobPoolManager {
    constructor(_poolName, _jobDatabase, _jobPoolDatabase, _worker = new JobPoolWorker()) {
        this._poolName = _poolName;
        this._jobDatabase = _jobDatabase;
        this._jobPoolDatabase = _jobPoolDatabase;
        this._worker = _worker;
        this.PoolStatus = PoolStatus.Idle;
    }
    Create() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._jobDatabase.Connect();
            yield this._jobPoolDatabase.Connect();
        });
    }
    AddJob(job) {
        return __awaiter(this, void 0, void 0, function* () {
            let existingJob = yield this._jobDatabase.Get(job.Id);
            if (existingJob === undefined || existingJob === null) {
                let initialJobStatus = {
                    RunHistory: [],
                    IsActive: false
                };
                job.Status = initialJobStatus;
            }
            else {
                if (existingJob.Status &&
                    job.Status && job.Status.RunHistory &&
                    job.Status.RunHistory.length === 0) {
                    job.Status == existingJob.Status;
                }
            }
            yield this._jobDatabase.Upsert(job);
        });
    }
    DefineJob(job) {
        this._worker.AssignJob(job);
    }
    RemoveJob(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._jobDatabase.Delete(jobId);
            let pool = yield this._jobPoolDatabase.Get(this._poolName);
            if (pool !== undefined && pool !== null) {
                let deletedJobIndex = pool.JobQueue.findIndex(p => p.Id === jobId);
                if (deletedJobIndex >= 0) {
                    pool.JobQueue = [...pool.JobQueue.slice(0, deletedJobIndex), ...pool.JobQueue.slice(deletedJobIndex + 1)];
                }
                yield this._jobPoolDatabase.Upsert(pool);
            }
        });
    }
    CompleteJobExecutionFromPool(jobId, jobRunStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            let jobPool = yield this._jobPoolDatabase.Get(this._poolName);
            if (!(jobPool && jobPool.JobQueue))
                throw new Error("No jobs present in the queue");
            let jobPositionAtQueue = jobPool.JobQueue.findIndex(jq => jq.Id === jobId);
            jobPool.JobQueue = [...jobPool.JobQueue.slice(0, jobPositionAtQueue), ...jobPool.JobQueue.slice(jobPositionAtQueue + 1)]; //If there are duplicate jobs in the queue then the first occurrence of the job will be removed
            jobPool.ActiveJobId = jobPool.JobQueue.length > 0 ? jobPool.JobQueue[0].Id : "";
            yield this._jobPoolDatabase.Upsert(jobPool);
            yield this.UpdateJobRunHistory(jobId, jobRunStatus);
            return jobPool;
        });
    }
    UpdateJobRunHistory(jobId, runStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            let job = yield this._jobDatabase.Get(jobId);
            if (job === undefined || job === null) {
                throw new Error(`Job with ID ${jobId} is not present in the database`);
            }
            if (job.Status && job.Status.RunHistory) {
                job.Status.RunHistory.push(runStatus);
            }
            else {
                if (!job.Status)
                    job.Status = { IsActive: false, RunHistory: null };
                job.Status.RunHistory = [runStatus];
            }
            yield this._jobDatabase.Upsert(job);
        });
    }
    GetJobRunHistory(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let job = yield this._jobDatabase.Get(jobId);
            if (job === undefined || job === null) {
                return null;
            }
            if (job.Status && job.Status.RunHistory) {
                return job.Status.RunHistory;
            }
            return null;
        });
    }
    GetJobLastRunStatus(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let job = yield this._jobDatabase.Get(jobId);
            if (job === undefined || job === null) {
                return null;
            }
            if (job.Status && job.Status.RunHistory) {
                return job.Status.RunHistory[job.Status.RunHistory.length - 1];
            }
            return null;
        });
    }
    ScheduleJobs(shouldAppend = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentJobs = yield this._jobDatabase.GetAll();
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
            let pooledJobs = [];
            sortedJobs.forEach(job => {
                pooledJobs.push(this.CreatePooledJob(job));
            });
            let currentJobPool = yield this._jobPoolDatabase.Get(this._poolName);
            if (currentJobPool === null) {
                currentJobPool = {
                    JobQueue: [],
                    ActiveJobId: "",
                    Id: this._poolName,
                    Name: this._poolName
                };
            }
            currentJobPool.JobQueue = shouldAppend ? [...currentJobPool.JobQueue, ...pooledJobs] : pooledJobs;
            yield this._jobPoolDatabase.Upsert(currentJobPool);
            let updatedPool = yield this._jobPoolDatabase.Get(this._poolName);
            //alert("POOL " + JSON.stringify(updatedPool));
            yield CacheLogger.Log("[Scheduler] " + JSON.stringify(updatedPool));
        });
    }
    CreatePooledJob(job) {
        return {
            Id: job.Id,
            FailedAttempts: job.RuntimeSettings.RetryAttempt
        };
    }
    DeleteJob(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let job = this._jobDatabase.Get(jobId);
            if (job === undefined || job === null)
                return;
        });
    }
    Terminate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.PoolStatus === PoolStatus.Active) {
                this.PoolStatus = PoolStatus.Cancelled;
            }
        });
    }
    Execute(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            yield CacheLogger.Log("[Pool Manager] Pool execution started");
            let currentJobPool = yield this._jobPoolDatabase.Get(this._poolName);
            yield CacheLogger.Log("[Pool Manager] Pool taken from DB");
            let jobs = yield this._jobDatabase.GetAll();
            yield CacheLogger.Log("[Pool Manager] Job taken from DB");
            yield this.ValidatePool(currentJobPool, jobs);
            yield CacheLogger.Log("[Pool Manager] Pool Validated");
            yield CacheLogger.Log("[Pool Manager] Execution started");
            this.PoolStatus = PoolStatus.Active;
            let timer = new Timer();
            yield Promise.race([
                timer.Run(settings.Timeout),
                this.ExecuteJobPool(currentJobPool, jobs, settings)
            ]);
            yield this.Terminate();
            //alert("Pool terminating");
        });
    }
    ValidatePool(jobPool, jobs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (jobPool.JobQueue === undefined || jobPool.JobQueue === null)
                    throw new Error("Job Queue not iniitalized");
                if (jobPool.JobQueue.length < 1)
                    throw new Error("Job Queue not iniitalized");
                let invalidPooledJobs = jobPool.JobQueue.filter(jp => jobs.findIndex(j => j.Id === jp.Id) < 0);
                if (invalidPooledJobs && invalidPooledJobs.length > 0)
                    throw new Error("Some jobs are not defined in the pool");
            }
            catch (exception) {
                yield CacheLogger.Log("[Pool Validation] Error");
                yield CacheLogger.Log("[Pool Validation] " + JSON.stringify(exception));
                yield CacheLogger.Log("[Pool Validation] jobPool" + JSON.stringify(jobPool));
                yield CacheLogger.Log("[Pool Validation] jobs" + JSON.stringify(jobs));
                throw exception;
            }
        });
    }
    ExecuteJobPool(currentJobPool, jobs, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            if (currentJobPool.JobQueue === undefined || currentJobPool.JobQueue === null || currentJobPool.JobQueue.length === 0)
                return;
            do {
                let activeJobId = currentJobPool.JobQueue[0].Id;
                let job = jobs.find(j => j.Id === activeJobId);
                CacheLogger.Log("[Pool Manager] Execution starting for " + job.Name);
                let lastRunStatus = job.Status && job.Status.RunHistory && job.Status.RunHistory.length > 0
                    ? job.Status.RunHistory[job.Status.RunHistory.length - 1]
                    : { Attempts: 0, Error: null, IsFailed: false, Mode: RunMode.Background, Timestamp: new Date(), TimeTaken: 0 };
                let jobExecutionResult;
                if (job.JobType == JobType.Control) {
                    jobExecutionResult = yield this.ExecuteControlJob(job);
                }
                else {
                    jobExecutionResult = yield this._worker.Execute(job);
                }
                CacheLogger.Log(`[Pool Manager] Execution completed for ${job.Name} with error status - ${jobExecutionResult.Error}`);
                currentJobPool = yield this.UpdateJobPool(job, lastRunStatus, currentJobPool, jobExecutionResult, settings);
            } while (currentJobPool.JobQueue.length > 0 && this.PoolStatus === PoolStatus.Active);
            this.PoolStatus = PoolStatus.Idle;
        });
    }
    UpdateJobPool(job, lastRunStatus, currentJobPool, jobExecutionStatus, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            let maxAttemptAllowed = job.RuntimeSettings.RetryAttempt;
            if (jobExecutionStatus.IsFailed) {
                let runStatus = { IsFailed: true, Timestamp: new Date(), Attempts: lastRunStatus.Attempts + 1, Mode: settings.Mode, TimeTaken: jobExecutionStatus.TimeTaken, Error: JSON.stringify(jobExecutionStatus.Error) };
                if ((lastRunStatus.Attempts + 1) >= maxAttemptAllowed) {
                    currentJobPool = yield this.CompleteJobExecutionFromPool(job.Id, runStatus);
                    settings.Notify(job.Id, job.Name, runStatus);
                }
                else {
                    yield this.UpdateJobRunHistory(job.Id, runStatus);
                }
            }
            else {
                let runStatus = { IsFailed: false, Timestamp: new Date(), Attempts: lastRunStatus.Attempts, Mode: settings.Mode, TimeTaken: jobExecutionStatus.TimeTaken, Error: "" };
                currentJobPool = yield this.CompleteJobExecutionFromPool(job.Id, runStatus);
                settings.Notify(job.Id, job.Name, runStatus);
            }
            return currentJobPool;
        });
    }
    ExecuteControlJob(job) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                switch (job.Name) {
                    case RE_SCHEDULE_JOB:
                        yield this.ScheduleJobs(true); //We must append to the existing jobs, in case there are other jobs in the queue that needs to be executed
                        break;
                    case DELETE_JOB:
                        yield this.RemoveJob(job.Id);
                        break;
                    default: throw new Error("Control job is not defined");
                }
                return {
                    Error: null,
                    IsFailed: false,
                    IsTimeout: false,
                    TimeTaken: 0
                };
            }
            catch (error) {
                return {
                    Error: error,
                    IsFailed: true,
                    IsTimeout: false,
                    TimeTaken: 0
                };
            }
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9iLnBvb2wubWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImpvYi5wb29sLm1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFN0MsT0FBTyxFQUFFLGFBQWEsRUFBbUIsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRSxPQUFPLEVBQXFGLE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDbEosT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUdoQyxNQUFNLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQztBQUMxQyxNQUFNLFVBQVUsR0FBRyxZQUFZLENBQUM7QUFFaEMsTUFBTSxPQUFPLGNBQWM7SUFFdkIsWUFDWSxTQUFpQixFQUNqQixZQUE0QixFQUM1QixnQkFBb0MsRUFDcEMsVUFBeUIsSUFBSSxhQUFhLEVBQUU7UUFINUMsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNqQixpQkFBWSxHQUFaLFlBQVksQ0FBZ0I7UUFDNUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFvQjtRQUNwQyxZQUFPLEdBQVAsT0FBTyxDQUFxQztRQUxoRCxlQUFVLEdBQWUsVUFBVSxDQUFDLElBQUksQ0FBQztJQU03QyxDQUFDO0lBRUMsTUFBTTs7WUFDUixNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbEMsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDMUMsQ0FBQztLQUFBO0lBRUssTUFBTSxDQUFDLEdBQVE7O1lBQ2pCLElBQUksV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RELElBQUksV0FBVyxLQUFLLFNBQVMsSUFBSSxXQUFXLEtBQUssSUFBSSxFQUFF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