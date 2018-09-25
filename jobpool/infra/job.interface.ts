export interface Job {
    Name: string,
    Id: string,
    Partner: string,
    Priority: number,
    RuntimeSettings: IRuntimeConfig,
    Payload: any,
    JobDefinition: (payload: any) => {}
}

export interface IRuntimeConfig {
    RetryAttempty: number,
    Timeout: number
}

export interface JobStatus {
    Id : string,
    RunHistory: Array<JobRunStatus>
}

export interface JobRunStatus {
    IsPassed: boolean,
    Timestamp: Date,
    TimeTaken: number,
    Attempts: number,
    Mode: RunMode
}

export enum RunMode {
    Foreground = 1,
    Background = 2
}

export interface JobPool {
    Id: string,
    JobQueue: Array<string>,
    ActiveJobId: string
}