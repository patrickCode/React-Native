var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Jobs } from './jobs';
import { JobPoolManager } from "./data/job.pool.manager";
import { RealmDatabase } from "./data/realm.database";
import { JobStatusSchema, JobSchema, JobPoolSchema } from "./data/job.realm.schema";
import { JobTranslator } from "./data/translators/job.translator";
import { JobPoolTranslator } from "./data/translators/job.pool.translator";
import { CacheLogger } from "./data/cache.logger";
import { Timer } from "./data/timer";
export class UIWorker {
    constructor() {
        this.postmessage = (message, handler) => {
            let runParameters = JSON.parse(message);
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
                this.ProcessThread(runParameters, jobPoolManager, handler),
                timer.Run(threadTimeout)
            ]).then(() => {
                jobPoolManager.Terminate()
                    .then(() => {
                    //alert("Coming here to terminate");
                    CacheLogger.Log("[Thread] Thread completed");
                    let completionMessage = {
                        "MessageType": "THREAD_COMPLETED"
                    };
                    this.postMessage(JSON.stringify(completionMessage), handler);
                });
            });
            // jobPoolManager.Create()
            //     .then(() => {
            //         let runtimeSettings = runParameters.PoolRuntimeSettings;
            //         runtimeSettings.Notify = (jobId: string, jobName: string, jobRunStatus: JobRunStatus) => {
            //             let notificationMessage = {
            //                 "MessageType": "JOB_COMPLETED",
            //                 "JobId": jobId,
            //                 "JobName": jobName,
            //                 "RunStatus": jobRunStatus
            //             };
            //             this.postMessage(JSON.stringify(notificationMessage), handler);
            //         }
            //         Jobs.forEach(job => jobPoolManager.DefineJob(job));
            //         jobPoolManager.Execute(runtimeSettings)
            //             .then(() => {
            //                 let completionMessage = {
            //                     "MessageType": "POOL_SUSPENDED"
            //                 };
            //                 this.postMessage(JSON.stringify(completionMessage), handler);
            //             })
            //             .catch((err) => {
            //                 let errorMessage = {
            //                     "MessageType": "POOL_ERROR"
            //                 };
            //                 this.postMessage(JSON.stringify(errorMessage), handler);
            //             });
            //     });
        };
        this.postMessage = (val, handler) => {
            handler(val);
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
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWkudGhyZWFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidWkudGhyZWFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUEsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFFBQVEsQ0FBQTtBQUM3QixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDekQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRXBGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNsRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUMzRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbEQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUVyQyxNQUFNLE9BQU8sUUFBUTtJQUFyQjtRQUNJLGdCQUFXLEdBQUcsQ0FBQyxPQUFlLEVBQUUsT0FBc0IsRUFBRSxFQUFFO1lBQ3RELElBQUksYUFBYSxHQUE2QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRWxFLElBQUksd0JBQXdCLEdBQXlCO2dCQUNqRCxZQUFZLEVBQUUsWUFBWTtnQkFDMUIsVUFBVSxFQUFFLElBQUksYUFBYSxFQUFFO2dCQUMvQixPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDO2dCQUNyQyxhQUFhLEVBQUUsQ0FBQzthQUNuQixDQUFDO1lBQ0YsSUFBSSw0QkFBNEIsR0FBeUI7Z0JBQ3JELFlBQVksRUFBRSxlQUFlO2dCQUM3QixVQUFVLEVBQUUsSUFBSSxpQkFBaUIsRUFBRTtnQkFDbkMsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFDO2dCQUN4QixhQUFhLEVBQUUsQ0FBQzthQUNuQixDQUFBO1lB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