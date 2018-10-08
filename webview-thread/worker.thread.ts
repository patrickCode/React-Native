import { Jobs } from './jobs'
import { self } from 'react-native-threads';
import { Timer } from './data/timer';
import { CacheLogger } from './data/cache.logger';
import { RealmDatabase } from "./data/realm.database";
import { JobPoolManager } from "./data/job.pool.manager";
import { RealmDbConfiguration } from "./data/database.interface";
import { JobTranslator } from "./data/translators/job.translator";
import { JobRunStatus, IJobPoolManager } from "./data/job.interface";
import { SchedulerRuntimeSettings } from "./data/scheduler.interface";
import { JobPoolTranslator } from "./data/translators/job.pool.translator";
import { JobStatusSchema, JobSchema, JobPoolSchema } from "./data/job.realm.schema";

self.onmessage = (message: string) => {
  CacheLogger.Log("[Thread]: Message received from Scheduler. Starting thread");
  let runParameters: SchedulerRuntimeSettings = JSON.parse(message);

  let runtimeSettings = runParameters.PoolRuntimeSettings;
  let threadTimeout = runtimeSettings.Timeout;

  let timer = new Timer();

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
}

const ProcessThread = async (runParameters: SchedulerRuntimeSettings, jobPoolManager: IJobPoolManager): Promise<void> => {
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
    self.postMessage(JSON.stringify(notificationMessage));
  }

  Jobs.forEach(job => jobPoolManager.DefineJob(job));

  await CacheLogger.Log("[Thread] Starting the Pool Manager");

  try {
    await jobPoolManager.Execute({ ...runtimeSettings, Timeout: runtimeSettings.Timeout - 1000 }) //The reduction in timeout is due to the cleanup and setup time taken by the thread
    await CacheLogger.Log("[Thread] Pool suspended");
    let completionMessage = {
      "MessageType": "POOL_SUSPENDED"
    };
    self.postMessage(JSON.stringify(completionMessage));
  } catch (exception) {
    await CacheLogger.Log("[Thread] Error in pool");
    await CacheLogger.Log("[Thread] Error : " + JSON.stringify(exception));
    let errorMessage = {
      "MessageType": "POOL_ERROR"
    };
    self.postMessage(JSON.stringify(errorMessage));
  }
}