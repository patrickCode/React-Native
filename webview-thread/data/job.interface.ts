export interface Job {
    Name: string,
    Id: string,
    Partner: string,
    Priority: number,
    RuntimeSettings: IJobRuntimeConfig,
    Payload: any,
    CreatedOn: Date,
    JobType: JobType
    JobDefinition: (payload: any) => void,
    Status: JobStatus
}

export interface IJobRuntimeConfig {
    RetryAttempt: number,
    Timeout: number,
    Schedule: Schedule
}

export interface Schedule {
    Value: number,
    Unit:TimeUnit
}

export enum TimeUnit {
    Millisecond = 0,
    Second,
    Minute,
    Hour,
    Day,
    Week
}

export enum JobType {
    Normal = 0,
    Control = 1,
    Elevated = 2
}

export enum PoolStatus {
    Idle = 0,
    Active = 1,
    Cancelled = 2,
    Faulted = 3
}

export interface JobStatus {
    //Id : string,
    RunHistory: Array<JobRunStatus>,
    IsActive: boolean
}

export interface JobRunStatus {
    IsFailed: boolean,
    Timestamp: Date,
    TimeTaken: number,
    Attempts: number,
    Mode: RunMode,
    Error: string
}

export enum RunMode {
    Foreground = 1,
    Background = 2
}

export interface JobPool {
    Id: string,
    Name: string,
    JobQueue: Array<PooledJob>,
    ActiveJobId: string
}

export interface PooledJob {
    Id: string,
    FailedAttempts: number
}

export interface IJobPoolManager {
    Create():  Promise<void>
    AddJob(job: Job): Promise<void>
    DefineJob(job: Job): void
    RemoveJob(jobId: string): Promise<void>
    GetJobRunHistory(jobId: string): Promise<Array<JobRunStatus>>
    GetJobLastRunStatus(jobId: string): Promise<JobRunStatus>,
    ScheduleJobs(shouldAppend?: boolean): Promise<void>,
    Execute(settings: RuntimeSetting): Promise<void>,
    Terminate(): Promise<void>
}

export interface RuntimeSetting {
    Timeout: number,
    Concurrency: number,
    Mode: RunMode,
    Notify: (jobId:string, jobName: string, runStatus: JobRunStatus) => void
}

export interface SampleObj {
    Id: string,
    Name: string
}