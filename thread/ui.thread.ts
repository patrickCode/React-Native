import { JobRunStatus, IJobPoolManager } from "./data/job.interface";
import { SchedulerRuntimeSettings } from "./data/scheduler.interface";
import { Jobs } from './jobs'
import { JobPoolManager } from "./data/job.pool.manager";
import { RealmDatabase } from "./data/realm.database";
import { JobStatusSchema, JobSchema, JobPoolSchema } from "./data/job.realm.schema";
import { RealmDbConfiguration } from "./data/database.interface";
import { JobTranslator } from "./data/translators/job.translator";
import { JobPoolTranslator } from "./data/translators/job.pool.translator";
import { CacheLogger } from "./data/cache.logger";
import { Timer } from "./data/timer";

export class UIWorker {
    postmessage = (message: string, handler: (msg) => void) => {
        let runParameters: SchedulerRuntimeSettings = JSON.parse(message);

        let jobDatabaseConfiguration: RealmDbConfiguration = {
            DatabaseName: "jobs.realm",
            Translator: new JobTranslator(),
            Schemas: [JobSchema, JobStatusSchema], //Ensure that JobSchema is always passed as the first parameter. 
            SchemaVersion: 0
        };
        let jobPoolDatabaseConfiguration: RealmDbConfiguration = {
            DatabaseName: "jobPool.realm",
            Translator: new JobPoolTranslator(),
            Schemas: [JobPoolSchema],
            SchemaVersion: 0
        }

        let jobPoolManager = new JobPoolManager("BackgroundSyncPool",
            new RealmDatabase(jobDatabaseConfiguration),
            new RealmDatabase(jobPoolDatabaseConfiguration));

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
    }

    private postMessage = (val: string, handler: (msg: string) => void) => {
        handler(val);
    }

    private ProcessThread = async (runParameters: SchedulerRuntimeSettings, jobPoolManager: IJobPoolManager, handler: (msg: string) => void): Promise<void> => {
        let runtimeSettings = runParameters.PoolRuntimeSettings;

        await jobPoolManager.Create();
        await CacheLogger.Log("[Thread]: Pool Manager Created");
        runtimeSettings.Notify = (jobId: string, jobName: string, jobRunStatus: JobRunStatus) => {
            let notificationMessage = {
                "MessageType": "JOB_COMPLETED",
                "JobId": jobId,
                "JobName": jobName,
                "RunStatus": jobRunStatus
            };
            CacheLogger.Log("[Thread] Posting notification");
            this.postMessage(JSON.stringify(notificationMessage), handler);
        }

        Jobs.forEach(job => jobPoolManager.DefineJob(job));

        await CacheLogger.Log("[Thread] Starting the Pool Manager");
        try {
            await jobPoolManager.Execute({ ...runtimeSettings, Timeout: runtimeSettings.Timeout - 1000 }) //The reduction in timeout is due to the cleanup and setup time taken by the thread
            CacheLogger.Log("[Thread] Pool suspended");
            let completionMessage = {
                "MessageType": "POOL_SUSPENDED"
            };
            this.postMessage(JSON.stringify(completionMessage), handler);
        } catch (exeption) {
            CacheLogger.Log("[Thread] Error in pool");
            let errorMessage = {
                "MessageType": "POOL_ERROR"
            };
            this.postMessage(JSON.stringify(errorMessage), handler);
        }
    }
}
