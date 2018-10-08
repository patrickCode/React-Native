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
import { Thread } from 'react-native-threads';
import { UIWorker as Worker } from '../ui.thread';
import { RealmDatabase } from './realm.database';
import { JobSchema, JobPoolSchema, JobStatusSchema } from './job.realm.schema';
import { CacheLogger } from './cache.logger';
import { Jobs } from '../jobs';
const ShouldUseThread = false;
export class ForegrounScheduler {
    constructor() {
        this.isActive = false;
        this.workerThread = null;
    }
    Intialize() {
        return __awaiter(this, void 0, void 0, function* () {
            CacheLogger.Log("Foreground thread is getting initialized");
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
            //alert("Scheduling done");
            yield CacheLogger.Log("[Scheduler] Foreground thread has been initialized");
            if (this.workerThread)
                this.workerThread.terminate();
            this.isActive = false;
        });
    }
    Start(interval) {
        CacheLogger.Log("Attempting to start foreground scheduler");
        let foregroundJob = (interval) => {
            return new Promise((res, rej) => {
                if (!this.isActive) {
                    CacheLogger.Log("[Scheduler] Triggering the worker");
                    if (ShouldUseThread)
                        this.startWorkerOnANewThread();
                    else
                        this.startWorker();
                    setTimeout(() => { foregroundJob(interval); }, interval);
                }
                else {
                    CacheLogger.Log("Worker still active, going on wait");
                    setTimeout(() => {
                        this.TerminateWorker();
                        foregroundJob(interval);
                    }, interval); //This interval should be a probe (lower it)
                }
            });
        };
        foregroundJob(interval);
    }
    startWorker() {
        this.isActive = true;
        let worker = new Worker();
        let settings = {
            Jobs: Jobs,
            JobPoolManager: this.jobPoolManager,
            PoolRuntimeSettings: {
                Concurrency: 1,
                Mode: RunMode.Foreground,
                Timeout: 5000,
                Notify: null
            }
        };
        let onmessage = (message) => {
            //console.warn(JSON.stringify(message));
            let messageObj = JSON.parse(message);
            if (messageObj.MessageType === "JOB_COMPLETED") {
                CacheLogger.Log(`Job with ID-Name (${messageObj.JobId}-${messageObj.JobName}) is completed`);
            }
            else {
                this.isActive = false;
            }
        };
        worker.postmessage(JSON.stringify(settings), onmessage);
    }
    startWorkerOnANewThread() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isActive = true;
            if (this.workerThread)
                this.workerThread.terminate();
            this.workerThread = new Thread('./worker.thread.js');
            let settings = {
                Jobs: Jobs,
                JobPoolManager: this.jobPoolManager,
                PoolRuntimeSettings: {
                    Concurrency: 1,
                    Mode: RunMode.Foreground,
                    Timeout: 20000,
                    Notify: null
                }
            };
            this.workerThread.onmessage = (message) => {
                CacheLogger.Log("[Scheduler] Posting message to the worker thread");
                CacheLogger.Log("[Scheduler] Message received from worker thread: " + JSON.stringify(message));
                let messageObj = JSON.parse(message);
                if (messageObj.MessageType === "JOB_COMPLETED") {
                    CacheLogger.Log(`Job with ID-Name (${messageObj.JobId}-${messageObj.JobName}) is completed`);
                }
                else {
                    this.TerminateWorker();
                    this.isActive = false;
                }
            };
            yield CacheLogger.Log("[Scheduler] Posting message to the worker thread");
            this.workerThread.postMessage(JSON.stringify(settings));
        });
    }
    TerminateWorker() {
        CacheLogger.Log("[Scheduler] Terminating the worker");
        if (this.workerThread) {
            this.workerThread.terminate();
            this.workerThread = null;
        }
        this.isActive = false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yZWdyb3VuZC5zY2hlZHVsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmb3JlZ3JvdW5kLnNjaGVkdWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDN0QsT0FBTyxFQUFtQixPQUFPLEVBQWlCLE1BQU0saUJBQWlCLENBQUM7QUFFMUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxRQUFRLElBQUksTUFBTSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ2xELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUVqRCxPQUFPLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMvRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUUvQixNQUFNLGVBQWUsR0FBWSxLQUFLLENBQUM7QUFFdkMsTUFBTSxPQUFPLGtCQUFrQjtJQUEvQjtRQUVZLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFDMUIsaUJBQVksR0FBRyxJQUFJLENBQUM7SUEySGhDLENBQUM7SUF6SFMsU0FBUzs7WUFDWCxXQUFXLENBQUMsR0FBRyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7WUFDNUQsSUFBSSx3QkFBd0IsR0FBeUI7Z0JBQ2pELFlBQVksRUFBRSxZQUFZO2dCQUMxQixVQUFVLEVBQUUsSUFBSSxhQUFhLEVBQUU7Z0JBQy9CLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUM7Z0JBQ3JDLGFBQWEs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