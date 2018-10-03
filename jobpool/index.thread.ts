import { JobRunStatus } from "job.interface";
import { SchedulerRuntimeSettings } from "scheduler.interface";
import { self } from "react-native-threads";

self.onmessage = (message) => {
    let runParameters: SchedulerRuntimeSettings = JSON.parse(message);
    let poolManager = runParameters.JobPoolManager;
    let runtimeSettings = runParameters.PoolRuntimeSettings;
    runtimeSettings.Notify = jobCompletionNotification;

    let jobs = runParameters.Jobs;
    jobs.forEach(job => poolManager.DefineJob(job));

    poolManager.Execute(runtimeSettings)
        .then(() => {
            let completionMessage = {
                "MessageType": "POOL_SUSPENDED"
            };
            self.postMessage(JSON.stringify(completionMessage));
        })
        .catch ((err) => {
            let errorMessage = {
                "MessageType": "POOL_ERROR"
            };
            self.postMessage(JSON.stringify(errorMessage));
        });
}

let jobCompletionNotification = (jobId: string, jobName: string, jobRunStatus: JobRunStatus) => {
    let notificationMessage = {
        "MessageType": "JOB_COMPLETED",
        "JobId": jobId,
        "JobName": jobName,
        "RunStatus": jobRunStatus
    };
    self.postMessage(JSON.stringify(notificationMessage));
}