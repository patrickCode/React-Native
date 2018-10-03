import { self } from "react-native-threads";
self.onmessage = (message) => {
    let runParameters = JSON.parse(message);
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
        .catch((err) => {
        let errorMessage = {
            "MessageType": "POOL_ERROR"
        };
        self.postMessage(JSON.stringify(errorMessage));
    });
};
let jobCompletionNotification = (jobId, jobName, jobRunStatus) => {
    let notificationMessage = {
        "MessageType": "JOB_COMPLETED",
        "JobId": jobId,
        "JobName": jobName,
        "RunStatus": jobRunStatus
    };
    self.postMessage(JSON.stringify(notificationMessage));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudGhyZWFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5kZXgudGhyZWFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUU1QyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUU7SUFDekIsSUFBSSxhQUFhLEdBQTZCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEUsSUFBSSxXQUFXLEdBQUcsYUFBYSxDQUFDLGNBQWMsQ0FBQztJQUMvQyxJQUFJLGVBQWUsR0FBRyxhQUFhLENBQUMsbUJBQW1CLENBQUM7SUFDeEQsZUFBZSxDQUFDLE1BQU0sR0FBRyx5QkFBeUIsQ0FBQztJQUVuRCxJQUFJLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO0lBQzlCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFaEQsV0FBVyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7U0FDL0IsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNQLElBQUksaUJBQWlCLEdBQUc7WUFDcEIsYUFBYSxFQUFFLGdCQUFnQjtTQUNsQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDLENBQUM7U0FDRCxLQUFLLENBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNaLElBQUksWUFBWSxHQUFHO1lBQ2YsYUFBYSxFQUFFLFlBQVk7U0FDOUIsQ0FBQztRQUNGLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxDQUFDO0FBQ1gsQ0FBQyxDQUFBO0FBRUQsSUFBSSx5QkFBeUIsR0FBRyxDQUFDLEtBQWEsRUFBRSxPQUFlLEVBQUUsWUFBMEIsRUFBRSxFQUFFO0lBQzNGLElBQUksbUJBQW1CLEdBQUc7UUFDdEIsYUFBYSxFQUFFLGVBQWU7UUFDOUIsT0FBTyxFQUFFLEtBQUs7UUFDZCxTQUFTLEVBQUUsT0FBTztRQUNsQixXQUFXLEVBQUUsWUFBWTtLQUM1QixDQUFDO0lBQ0YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztBQUMxRCxDQUFDLENBQUEifQ==