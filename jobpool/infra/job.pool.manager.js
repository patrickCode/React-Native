var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RealmDatabase } from "./realm.database";
import { JobPoolWorker } from "./job.pool.worker";
export class JobPoolManager {
    constructor(_poolName, _jobPoolDatabaseConfiguration, _jobDatabaseConfiguration, _jobStatusDatabaseConfiguration, _jobDatabase = new RealmDatabase(), _jobPoolDatabase = new RealmDatabase(), _jobStatusDatabase = new RealmDatabase(), _worker = new JobPoolWorker()) {
        this._poolName = _poolName;
        this._jobPoolDatabaseConfiguration = _jobPoolDatabaseConfiguration;
        this._jobDatabaseConfiguration = _jobDatabaseConfiguration;
        this._jobStatusDatabaseConfiguration = _jobStatusDatabaseConfiguration;
        this._jobDatabase = _jobDatabase;
        this._jobPoolDatabase = _jobPoolDatabase;
        this._jobStatusDatabase = _jobStatusDatabase;
        this._worker = _worker;
    }
    Create() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._jobDatabase.Connect(this._jobDatabaseConfiguration);
            yield this._jobPoolDatabase.Connect(this._jobPoolDatabaseConfiguration);
            yield this._jobStatusDatabase.Connect(this._jobStatusDatabaseConfiguration);
        });
    }
    AddJob(job) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._jobDatabase.Upsert(job);
            let initialJobStatus = {
                Id: job.Id,
                RunHistory: [],
                IsActive: false
            };
            yield this._jobStatusDatabase.Upsert(initialJobStatus);
        });
    }
    DefineJob(job) {
        this._worker.AssignJob(job);
    }
    RemoveJob(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._jobDatabase.Delete(jobId);
            yield this._jobStatusDatabase.Delete(jobId);
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
            jobPool.JobQueue = [...jobPool.JobQueue.slice(1)];
            jobPool.ActiveJobId = jobPool.JobQueue[0].Id;
            yield this._jobPoolDatabase.Upsert(jobPool);
            let jobStatus = yield this._jobStatusDatabase.Get(jobId);
            jobStatus.RunHistory.push(jobRunStatus);
            yield this._jobStatusDatabase.Upsert(jobStatus);
        });
    }
    UpdateJobRunHistory(jobId, runStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            let jobStatus = yield this._jobStatusDatabase.Get(jobId);
            jobStatus.RunHistory.push(runStatus);
            yield this._jobStatusDatabase.Upsert(jobStatus);
        });
    }
    GetJobRunHistory(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let jobStatus = yield this._jobStatusDatabase.Get(jobId);
            if (jobStatus !== undefined && jobStatus !== null) {
                return jobStatus.RunHistory;
            }
            return null;
        });
    }
    GetJobLastRunStatus(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            let jobStatus = yield this._jobStatusDatabase.Get(jobId);
            if (jobStatus !== undefined && jobStatus !== null) {
                return jobStatus.RunHistory[jobStatus.RunHistory.length - 1];
            }
            return null;
        });
    }
    ScheduleJobs() {
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
            currentJobPool.JobQueue = pooledJobs;
            yield this._jobPoolDatabase.Upsert(currentJobPool);
        });
    }
    CreatePooledJob(job) {
        return {
            Id: job.Id,
            FailedAttempts: job.RuntimeSettings.RetryAttempt
        };
    }
    Execute(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            let currentJobPool = yield this._jobPoolDatabase.Get(this._poolName);
            let jobs = yield this._jobDatabase.GetAll();
            let jobStatusList = yield this._jobStatusDatabase.GetAll();
            this.ValidatePool(currentJobPool, jobs, jobStatusList);
            Promise.race([
                this.runTimer(settings.Timeout),
                this.ExecuteJobPool(currentJobPool, jobs, jobStatusList, settings)
            ]);
        });
    }
    ValidatePool(jobPool, jobs, jobStatusList) {
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
    ExecuteJobPool(currentJobPool, jobs, jobStatusList, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            do {
                let activeJobId = currentJobPool.JobQueue[0].Id;
                let job = jobs.find(j => j.Id === activeJobId);
                let currentJobStatus = jobStatusList.find(js => js.Id === activeJobId);
                let lastRunStatus = currentJobStatus.RunHistory[currentJobStatus.RunHistory.length - 1];
                let maxAttemptAllowed = job.RuntimeSettings.RetryAttempt;
                let result = yield this._worker.Execute(job);
                if (result.IsFailed) {
                    let runStatus = { IsFailed: true, Timestamp: new Date(), Attempts: lastRunStatus.Attempts + 1, Mode: settings.Mode, TimeTaken: result.TimeTaken, Error: JSON.stringify(result.Error) };
                    if ((lastRunStatus.Attempts + 1) >= maxAttemptAllowed) {
                        yield this.CompleteJobExecutionFromPool(job.Id, runStatus);
                        settings.Notify(job.Id, job.Name, runStatus);
                    }
                    else {
                        yield this.UpdateJobRunHistory(job.Id, runStatus);
                    }
                }
                else {
                    let runStatus = { IsFailed: false, Timestamp: new Date(), Attempts: lastRunStatus.Attempts, Mode: settings.Mode, TimeTaken: result.TimeTaken, Error: "" };
                    yield this.CompleteJobExecutionFromPool(job.Id, runStatus);
                    settings.Notify(job.Id, job.Name, runStatus);
                }
            } while (currentJobPool.JobQueue.length > 0);
        });
    }
    runTimer(timeout) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, timeout);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9iLnBvb2wubWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImpvYi5wb29sLm1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBSWxELE1BQU0sT0FBTyxjQUFjO0lBRXZCLFlBQ1ksU0FBaUIsRUFDakIsNkJBQW9ELEVBQ3BELHlCQUFnRCxFQUNoRCwrQkFBc0QsRUFDdEQsZUFBK0IsSUFBSSxhQUFhLEVBQU8sRUFDdkQsbUJBQXVDLElBQUksYUFBYSxFQUFXLEVBQ25FLHFCQUEyQyxJQUFJLGFBQWEsRUFBYSxFQUN6RSxVQUF5QixJQUFJLGFBQWEsRUFBRTtRQVA1QyxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2pCLGtDQUE2QixHQUE3Qiw2QkFBNkIsQ0FBdUI7UUFDcEQsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUF1QjtRQUNoRCxvQ0FBK0IsR0FBL0IsK0JBQStCLENBQXVCO1FBQ3RELGlCQUFZLEdBQVosWUFBWSxDQUEyQztRQUN2RCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQW1EO1FBQ25FLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBdUQ7UUFDekUsWUFBTyxHQUFQLE9BQU8sQ0FBcUM7SUFDcEQsQ0FBQztJQUVDLE1BQU07O1lBQ1IsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUNoRSxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDeEUsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQ2hGLENBQUM7S0FBQTtJQUVLLE1BQU0sQ0FBQyxHQUFR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