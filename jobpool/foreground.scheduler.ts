//import { Jobs } from 'jobs';
import { JobPoolManager } from 'job.pool.manager';
import { JobPoolTranslator } from 'translators/job.pool.translator';
import { JobTranslator } from 'translators/job.translator';
import { JobStatusTranslator } from 'translators/job.status.translator';
import { IJobPoolManager, RunMode } from 'job.interface';
import { SchedulerRuntimeSettings } from 'scheduler.interface';
import { Thread as Worker } from "react-native-threads";
import { DummyAsyncStorageJob } from 'jobs/dummyAsyncStorageJob';
import { GetQuestion } from 'jobs/getQuestionsJob';

export class ForegrounScheduler {
    private jobPoolManager: IJobPoolManager;
    private isActive: boolean = false;
    async Intialize(): Promise<void> {
        try {
            this.jobPoolManager = new JobPoolManager("BackgroundSyncPool",
                { DatabaseName: "jobPool.realm", Translator: new JobPoolTranslator() },
                { DatabaseName: "jobs.realm", Translator: new JobTranslator() },
                { DatabaseName: "jobStatus.realm", Translator: new JobStatusTranslator() });

            await this.jobPoolManager.Create();
            // Jobs.forEach(async (job) => {
            //     await this.jobPoolManager.AddJob(job);
            // });
        } catch (err) {
            //alert("1." + JSON.stringify(err));
        }
        try {
            await this.jobPoolManager.ScheduleJobs();
        } catch (err) {
            alert("2. " + JSON.stringify(err));
        }

    }

    Start(interval: number): void {
        let foregroundJob = new Promise((res, rej) => {
            if (!this.isActive) {
                this.startWorker();
                setTimeout(foregroundJob, interval);
            } else {
                setTimeout(foregroundJob, interval);
            }
        });
        setTimeout(foregroundJob, interval);
    }

    private startWorker() {
        this.isActive = true;
        let worker = new Worker('index.thread.js');
        let settings: SchedulerRuntimeSettings = {
            Jobs: Jobs,
            JobPoolManager: this.jobPoolManager,
            PoolRuntimeSettings: {
                Concurrency: 1,
                Mode: RunMode.Foreground,
                Timeout: 60000,
                Notify: null
            }
        };
        worker.postMessage(JSON.stringify(settings));
        worker.onmessage = (message) => {
            let messageObj = JSON.parse(message);
            if (messageObj.MessageType === "JOB_COMPLETED") {
                alert(`Job with ID-Name (${messageObj.JobId}-${messageObj.JobName}) is completed`);
                alert(JSON.stringify(messageObj.RunStatus));
            } else {
                alert(message);
                this.isActive = false;
            }
        }
    }
}

export const Jobs: Array<any> = [{
    Name: "DummyAsyncStorageJob",
    Id: "1",
    JobDefinition: new DummyAsyncStorageJob().Execute,
    Partner: "Self",
    Payload: { "Max": 1000 },
    Priority: 1,
    RuntimeSettings: {
        RetryAttempt: 3,
        Schedule: {
            //Unit: TimeUnit.Minute,
            Unit: 1,
            Value: 15
        },
        Timeout: 10000
    },
    CreatedOn: new Date()
}, {
    Name: "RefreshQuestions",
    Id: "2",
    JobDefinition: new GetQuestion().Execute,
    Partner: "Self",
    Payload: {},
    Priority: 1,
    RuntimeSettings: {
        RetryAttempt: 3,
        Schedule: {
            //Unit: TimeUnit.Hour,
            Unit: 1,
            Value: 15
        },
        Timeout: 15000
    },
    CreatedOn: new Date()
}];