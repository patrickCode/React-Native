import { Job, RuntimeSetting } from "job.interface";

export class JobPoolWorker {

    static AssignedJobs: any = {};

    AssignJob(job: Job) {
        JobPoolWorker.AssignedJobs[job.Id] = job.JobDefinition;
    }

    UnassignJob(job: Job) {
        delete JobPoolWorker.AssignedJobs[job.Id];
    }

    async Execute (job: Job): Promise<ExecutionStatus> {
        let jobDefinition = JobPoolWorker.AssignedJobs[job.Id];
        if (jobDefinition === undefined || jobDefinition === null)
            throw new Error(`Job with ID ${job.Id} has not been defined. Exeute jobPool.DefineJob(...) before triggering the pool.`);
        
        let timeout = job.RuntimeSettings.Timeout;
        let payload = job.Payload;

        var result = await Promise.race([this.runTimer(timeout), this.executeJob(jobDefinition, payload)]);
        return result;
    }

    private runTimer (timeout: number): Promise<ExecutionStatus> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    IsFailed: true,
                    IsTimeout: true,
                    Error: new Error("Timeout Exception."),
                    TimeTaken: timeout
                });
            }, timeout);
        })
    }

    private async executeJob(jobDefinition: any, payload: any): Promise<ExecutionStatus> {
        try {
            await jobDefinition(payload);
            return {
                IsFailed: false,
                IsTimeout: false,
                TimeTaken: 0,
                Error: null
            }
        } catch (exception) {
            return {
                IsFailed: true,
                IsTimeout: false,
                TimeTaken: 0,
                Error: exception
            }
        }
    }
}

export interface ExecutionStatus {
    IsTimeout: boolean,
    IsFailed: boolean,
    TimeTaken: number,
    Error: Error
}