var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { JobPoolManager } from './job.pool.manager';
import { JobPoolTranslator } from './translators/job.pool.translator';
import { JobTranslator } from './translators/job.translator';
import { RunMode } from './job.interface';
import { RealmDatabase } from './realm.database';
import { JobSchema, JobPoolSchema, JobStatusSchema } from './job.realm.schema';
import { CacheLogger } from './cache.logger';
import { Jobs } from '../jobs';
import BackgroundTask from 'react-native-background-task';
import { Timer } from './timer';
//alert(BackgroundTask.define);
export class BackgroundScheduler {
    constructor() {
        this.isActive = false;
        this.postMessage = (val, handler) => {
            handler(val);
        };
        this.handleMessage = (msg) => {
            CacheLogger.Log("[Background Message] " + msg);
        };
        this.ProcessThread = (runParameters, jobPoolManager, handler) => __awaiter(this, void 0, void 0, function* () {
            let runtimeSettings = runParameters.PoolRuntimeSettings;
            yield jobPoolManager.Create();
            yield CacheLogger.Log("[Thread]: Pool Manager Created");
            runtimeSettings.Notify = (jobId, jobName, jobRunStatus) => {
                let notificationMessage = {
                    "MessageType": "JOB_COMPLETED",
                    "JobId": jobId,
                    "JobName": jobName,
                    "RunStatus": jobRunStatus
                };
                CacheLogger.Log("[Thread] Posting notification");
                this.postMessage(JSON.stringify(notificationMessage), handler);
            };
            Jobs.forEach(job => jobPoolManager.DefineJob(job));
            yield CacheLogger.Log("[Thread] Starting the Pool Manager");
            try {
                yield jobPoolManager.Execute(Object.assign({}, runtimeSettings, { Timeout: runtimeSettings.Timeout - 1000 })); //The reduction in timeout is due to the cleanup and setup time taken by the thread
                CacheLogger.Log("[Thread] Pool suspended");
                let completionMessage = {
                    "MessageType": "POOL_SUSPENDED"
                };
                this.postMessage(JSON.stringify(completionMessage), handler);
            }
            catch (exeption) {
                CacheLogger.Log("[Thread] Error in pool");
                let errorMessage = {
                    "MessageType": "POOL_ERROR"
                };
                this.postMessage(JSON.stringify(errorMessage), handler);
            }
        });
    }
    Initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield CacheLogger.Log("Background thread is getting initialized");
            let jobDatabaseConfiguration = {
                DatabaseName: "jobs.realm",
                Translator: new JobTranslator(),
                Schemas: [JobSchema, JobStatusSchema],
                SchemaVersion: 0
            };
            let jobPoolDatabaseConfiguration = {
                DatabaseName: "jobPool.realm",
                Translator: new JobPoolTranslator(),
                Schemas: [JobPoolSchema],
                SchemaVersion: 0
            };
            this.jobPoolManager = new JobPoolManager("BackgroundSyncPool", new RealmDatabase(jobDatabaseConfiguration), new RealmDatabase(jobPoolDatabaseConfiguration));
            yield this.jobPoolManager.Create();
            Jobs.forEach((job) => __awaiter(this, void 0, void 0, function* () {
                yield this.jobPoolManager.AddJob(job);
            }));
            yield this.jobPoolManager.ScheduleJobs();
            yield CacheLogger.Log("[Scheduler] Background thread has been initialized");
            this.isActive = false;
            this.Start(0);
            BackgroundTask.schedule();
        });
    }
    Start(interval) {
        BackgroundTask.define(() => __awaiter(this, void 0, void 0, function* () {
            yield CacheLogger.Log("Attempting to start background scheduler");
            let runParameters = {
                Jobs: Jobs,
                JobPoolManager: this.jobPoolManager,
                PoolRuntimeSettings: {
                    Concurrency: 1,
                    Mode: RunMode.Foreground,
                    Timeout: 5000,
                    Notify: null
                }
            };
            let jobDatabaseConfiguration = {
                DatabaseName: "jobs.realm",
                Translator: new JobTranslator(),
                Schemas: [JobSchema, JobStatusSchema],
                SchemaVersion: 0
            };
            let jobPoolDatabaseConfiguration = {
                DatabaseName: "jobPool.realm",
                Translator: new JobPoolTranslator(),
                Schemas: [JobPoolSchema],
                SchemaVersion: 0
            };
            let jobPoolManager = new JobPoolManager("BackgroundSyncPool", new RealmDatabase(jobDatabaseConfiguration), new RealmDatabase(jobPoolDatabaseConfiguration));
            let runtimeSettings = runParameters.PoolRuntimeSettings;
            let threadTimeout = runtimeSettings.Timeout;
            let timer = new Timer();
            Promise.race([
                this.ProcessThread(runParameters, jobPoolManager, this.handleMessage),
                timer.Run(threadTimeout)
            ]).then(() => {
                jobPoolManager.Terminate()
                    .then(() => {
                    //alert("Coming here to terminate");
                    CacheLogger.Log("[Thread] Thread completed");
                    let completionMessage = {
                        "MessageType": "THREAD_COMPLETED"
                    };
                    this.postMessage(JSON.stringify(completionMessage), this.handleMessage);
                    BackgroundTask.finish();
                });
            });
        }));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5zY2hlZHVsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYWNrZ3JvdW5kLnNjaGVkdWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNBLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDN0QsT0FBTyxFQUFtQixPQUFPLEVBQStCLE1BQU0saUJBQWlCLENBQUM7QUFJeEYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRWpELE9BQU8sRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQy9FLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQy9CLE9BQU8sY0FBYyxNQUFNLDhCQUE4QixDQUFDO0FBQzFELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFaEMsK0JBQStCO0FBSS9CLE1BQU0sT0FBTyxtQkFBbUI7SUFBaEM7UUFFWSxhQUFRLEdBQVksS0FBSyxDQUFDO1FBc0YxQixnQkFBVyxHQUFHLENBQUMsR0FBVyxFQUFFLE9BQThCLEVBQUUsRUFBRTtZQUNsRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsQ0FBQyxDQUFBO1FBRU8sa0JBQWEsR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFO1lBQ3BDLFdBQVcsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFBO1FBRU8sa0JBQWEsR0FBRyxDQUFPLGFBQXVDLEVBQUUsY0FBK0IsRUFBRSxPQUE4QixFQUFpQixFQUFFO1lB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