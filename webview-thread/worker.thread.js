var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Jobs } from './jobs';
import { self } from 'react-native-threads';
import { Timer } from './data/timer';
import { CacheLogger } from './data/cache.logger';
import { RealmDatabase } from "./data/realm.database";
import { JobPoolManager } from "./data/job.pool.manager";
import { JobTranslator } from "./data/translators/job.translator";
import { JobPoolTranslator } from "./data/translators/job.pool.translator";
import { JobStatusSchema, JobSchema, JobPoolSchema } from "./data/job.realm.schema";
self.onmessage = (message) => {
    CacheLogger.Log("[Thread]: Message received from Scheduler. Starting thread");
    let runParameters = JSON.parse(message);
    let runtimeSettings = runParameters.PoolRuntimeSettings;
    let threadTimeout = runtimeSettings.Timeout;
    let timer = new Timer();
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
    Promise.race([
        ProcessThread(runParameters, jobPoolManager),
        timer.Run(threadTimeout)
    ]).then(() => {
        jobPoolManager.Terminate()
            .then(() => {
            CacheLogger.Log("[Thread] Thread completed");
            let completionMessage = {
                "MessageType": "THREAD_COMPLETED"
            };
            self.postMessage(JSON.stringify(completionMessage));
        });
    });
};
const ProcessThread = (runParameters, jobPoolManager) => __awaiter(this, void 0, void 0, function* () {
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
        self.postMessage(JSON.stringify(notificationMessage));
    };
    Jobs.forEach(job => jobPoolManager.DefineJob(job));
    yield CacheLogger.Log("[Thread] Starting the Pool Manager");
    try {
        yield jobPoolManager.Execute(Object.assign({}, runtimeSettings, { Timeout: runtimeSettings.Timeout - 1000 })); //The reduction in timeout is due to the cleanup and setup time taken by the thread
        yield CacheLogger.Log("[Thread] Pool suspended");
        let completionMessage = {
            "MessageType": "POOL_SUSPENDED"
        };
        self.postMessage(JSON.stringify(completionMessage));
    }
    catch (exception) {
        yield CacheLogger.Log("[Thread] Error in pool");
        yield CacheLogger.Log("[Thread] Error : " + JSON.stringify(exception));
        let errorMessage = {
            "MessageType": "POOL_ERROR"
        };
        self.postMessage(JSON.stringify(errorMessage));
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyLnRocmVhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndvcmtlci50aHJlYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sUUFBUSxDQUFBO0FBQzdCLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRXpELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUdsRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUMzRSxPQUFPLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUVwRixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsT0FBZSxFQUFFLEVBQUU7SUFDbkMsV0FBVyxDQUFDLEdBQUcsQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO0lBQzlFLElBQUksYUFBYSxHQUE2QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRWxFLElBQUksZUFBZSxHQUFHLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQztJQUN4RCxJQUFJLGFBQWEsR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDO0lBRTVDLElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7SUFFeEIsSUFBSSx3QkFBd0IsR0FBeUI7UUFDbkQsWUFBWSxFQUFFLFlBQVk7UUFDMUIsVUFBVSxFQUFFLElBQUksYUFBYSxFQUFFO1FBQy9CLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxl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