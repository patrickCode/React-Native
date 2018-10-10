import React, { Component } from 'react';
import { JobPoolManager } from './job.pool.manager';
import { JobPoolTranslator } from './translators/job.pool.translator';
import { JobTranslator } from './translators/job.translator';
import { IJobPoolManager, RunMode, TimeUnit, Job, JobRunStatus } from './job.interface';
import { SchedulerRuntimeSettings } from './scheduler.interface';
import { Thread } from 'react-native-threads';
import { UIWorker as Worker } from '../ui.thread';
import { RealmDatabase } from './realm.database';
import { RealmDbConfiguration } from './database.interface';
import { JobSchema, JobPoolSchema, JobStatusSchema } from './job.realm.schema';
import { CacheLogger } from './cache.logger';
import { Jobs } from '../jobs';
import BackgroundTask from 'react-native-background-task';
import { Timer } from './timer';

//alert(BackgroundTask.define);



export class BackgroundScheduler {
    private jobPoolManager: IJobPoolManager;
    private isActive: boolean = false;

    async Initialize(): Promise<void> {
        await CacheLogger.Log("Background thread is getting initialized");
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
        await CacheLogger.Log("[Scheduler] Background thread has been initialized");
        this.isActive = false;
        this.Start(0);
        BackgroundTask.schedule();
    }

    Start(interval: number): void {
        BackgroundTask.define(async () => {
            await CacheLogger.Log("Attempting to start background scheduler");
            let runParameters: SchedulerRuntimeSettings = {
                Jobs: Jobs,
                JobPoolManager: this.jobPoolManager,
                PoolRuntimeSettings: {
                    Concurrency: 1,
                    Mode: RunMode.Foreground,
                    Timeout: 5000,
                    Notify: null
                }
            };

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
                this.ProcessThread(runParameters, jobPoolManager, this.handleMessage),
                timer.Run(threadTimeout)
            ]).then(() => {
                jobPoolManager.Terminate()
                    .then(() => {
                        //alert("Coming here to terminate");
                        CacheLogger.Log("[Thread] Thread completed");
                        let completionMessage = {
                            "MessageType": "THREAD_COMPLETED"
                        };
                        this.postMessage(JSON.stringify(completionMessage), this.handleMessage);
                        BackgroundTask.finish();
                    });
            });
        });
    }

    private postMessage = (val: string, handler: (msg: string) => void) => {
        handler(val);
    }

    private handleMessage = (msg: string) => {
        CacheLogger.Log("[Background Message] " + msg);
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
