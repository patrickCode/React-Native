import { DummyAsyncStorageJob } from './dummyAsyncStorageJob';
import { Job, TimeUnit } from 'infra/job.interface';
import { GetQuestion } from './getQuestionsJob';

export const Jobs: Array<Job> = [{
    Name: "DummyAsyncStorageJob",
    Id: "1",
    JobDefinition: new DummyAsyncStorageJob().Execute,
    Partner: "Self",
    Payload: { "Max": 1000 },
    Priority: 1,
    RuntimeSettings: {
        RetryAttempt: 3,
        Schedule: {
            Unit: TimeUnit.Minute,
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
            Unit: TimeUnit.Hour,
            Value: 15
        },
        Timeout: 15000
    },
    CreatedOn: new Date()
}];