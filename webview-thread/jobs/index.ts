import { DummyAsyncStorageJob } from './dummyAsyncStorageJob';
import { Job, TimeUnit, JobType } from '../data/job.interface';
import { GetQuestion } from './getQuestionsJob';

export const Jobs: Array<Job> = [{
    Name: "DummyAsyncStorageJob",
    Id: "1",
    JobDefinition: new DummyAsyncStorageJob().Execute,
    Partner: "Self",
    Payload: { "Max": 1000, "Text": "Data - 1." },
    Priority: 1,
    RuntimeSettings: {
        RetryAttempt: 3,
        Schedule: {
            Unit: TimeUnit.Minute,
            Value: 15
        },
        Timeout: 10000
    },
    CreatedOn: new Date(),
    JobType: JobType.Normal,
    Status: null
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
            Unit: TimeUnit.Hour,
            Value: 15
        },
        Timeout: 15000
    },
    CreatedOn: new Date(),
    JobType: JobType.Normal,
    Status: null
}, {
    Id: "CONTORL_1",
    Name: "RE_SCHEDULE_JOB",
    JobDefinition: null,
    Partner: "MXP",
    Payload: {},
    Priority: 100,
    RuntimeSettings: {
        RetryAttempt: 1,
        Schedule: {
            Unit: TimeUnit.Minute,
            Value: 15
        },
        Timeout: 10000
    },
    CreatedOn: new Date(),
    JobType: JobType.Control,
    Status: null
}];