import { DummyAsyncStorageJob } from './dummyAsyncStorageJob';
//import { Job, TimeUnit } from 'job.interface';
import { GetQuestion } from './getQuestionsJob';

//export const Jobs: Array<Job> = [{
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