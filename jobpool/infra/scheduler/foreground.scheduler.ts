import { Jobs } from '../../jobs';
import { JobPoolManager } from '../job.pool.manager';
import { JobPoolTranslator } from '../translators/job.pool.translator';
import { JobTranslator } from '../translators/job.translator';
import { JobStatusTranslator } from '../translators/job.status.translator';
import { IJobPoolManager, RunMode } from '../job.interface';
import { SchedulerRuntimeSettings } from './scheduler.interface';
import { Thread as Worker } from "react-native-threads";
 
export class ForegrounScheduler {
    private jobPoolManager: IJobPoolManager;
    private isActive: boolean = false;
    async Intialize(): Promise<void> {
        this.jobPoolManager = new JobPoolManager("BackgroundSyncPool",
        { DatabaseName: "jobPool.realm", Translator: new JobPoolTranslator() },
        { DatabaseName: "jobs.realm", Translator: new JobTranslator() },
        { DatabaseName: "jobStatus.realm", Translator: new JobStatusTranslator() });

        await this.jobPoolManager.Create();
        Jobs.forEach(async (job) => {
            await this.jobPoolManager.AddJob(job);
        });
        await this.jobPoolManager.ScheduleJobs();
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
        let worker = new Worker('foregroundWorker.js');
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
        worker.onmessage = (message) =>{
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