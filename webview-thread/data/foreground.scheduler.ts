import { JobPoolManager } from './job.pool.manager';
import { JobPoolTranslator } from './translators/job.pool.translator';
import { JobTranslator } from './translators/job.translator';
import { IJobPoolManager, RunMode, TimeUnit, Job } from './job.interface';
import { SchedulerRuntimeSettings } from './scheduler.interface';
import { Thread } from 'react-native-threads';
import { UIWorker as Worker } from '../ui.thread';
import { RealmDatabase } from './realm.database';
import { RealmDbConfiguration } from './database.interface';
import { JobSchema, JobPoolSchema, JobStatusSchema } from './job.realm.schema';
import { CacheLogger } from './cache.logger';
import { Jobs } from '../jobs';

const ShouldUseThread: boolean = false;

export class ForegrounScheduler {
    private jobPoolManager: IJobPoolManager;
    private isActive: boolean = false;
    private workerThread = null;

    async Intialize(): Promise<void> {
        CacheLogger.Log("Foreground thread is getting initialized");
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

        this.jobPoolManager = new JobPoolManager("BackgroundSyncPool",
            new RealmDatabase(jobDatabaseConfiguration),
            new RealmDatabase(jobPoolDatabaseConfiguration));

        await this.jobPoolManager.Create();

        Jobs.forEach(async (job: Job) => {
            await this.jobPoolManager.AddJob(job);
        });
        await this.jobPoolManager.ScheduleJobs();
        //alert("Scheduling done");
        await CacheLogger.Log("[Scheduler] Foreground thread has been initialized");
        if (this.workerThread)
            this.workerThread.terminate();
        
            this.isActive = false;
    }

    Start(interval: number): void {
        CacheLogger.Log("Attempting to start foreground scheduler");
        let foregroundJob = (interval: number) => {
            return new Promise((res, rej) => {
                if (!this.isActive) {
                    CacheLogger.Log("[Scheduler] Triggering the worker");
                    if (ShouldUseThread)
                        this.startWorkerOnANewThread();
                    else
                        this.startWorker();
                    setTimeout(() => { foregroundJob(interval) }, interval);
                } else {
                    CacheLogger.Log("Worker still active, going on wait");
                    setTimeout(() => { 
                        this.TerminateWorker();
                        foregroundJob(interval);
                    }, interval); //This interval should be a probe (lower it)
                }
            });
        }
        foregroundJob(interval);
    }

    private startWorker() {
        this.isActive = true;
        let worker = new Worker();
        let settings: SchedulerRuntimeSettings = {
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
            } else {
                this.isActive = false;
            }
        }
        worker.postmessage(JSON.stringify(settings), onmessage);
    }

    private async startWorkerOnANewThread() {
        this.isActive = true;
        if (this.workerThread)
            this.workerThread.terminate();
        this.workerThread = new Thread('./worker.thread.js');
        let settings: SchedulerRuntimeSettings = {
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
            } else {
                this.TerminateWorker();
                this.isActive = false;
            }
        }
        await CacheLogger.Log("[Scheduler] Posting message to the worker thread");
        this.workerThread.postMessage(JSON.stringify(settings));
    }

    public TerminateWorker() {
        CacheLogger.Log("[Scheduler] Terminating the worker");
        if (this.workerThread) {
            this.workerThread.terminate();
            this.workerThread = null;
        }
        this.isActive = false;
    }
}