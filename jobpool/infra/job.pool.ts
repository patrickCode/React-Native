import { Job, JobStatus, JobRunStatus } from "./job.interface";

export interface IJobPool {
    AddJob(job: Job): Promise<void>
    RemoveJob(jobId: string): Promise<void>
    GetJobStatus(jobId: string): Promise<JobStatus>
    GetJobLastRunStatus(jobId: string): Promise<JobRunStatus>
}

export class JobPool {

}