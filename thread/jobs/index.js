import { DummyAsyncStorageJob } from './dummyAsyncStorageJob';
import { TimeUnit, JobType } from '../data/job.interface';
import { GetQuestion } from './getQuestionsJob';
export const Jobs = [{
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
export const BgJobs = [{
        Name: "DummyAsyncStorageJob",
        Id: "1",
        JobDefinition: new DummyAsyncStorageJob().Execute,
        Partner: "Self",
        Payload: { "Max": 1000, "Text": "Data from background" },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM5RCxPQUFPLEVBQU8sUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVoRCxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQWUsQ0FBQztRQUM3QixJQUFJLEVBQUUsc0JBQXNCO1FBQzVCLEVBQUUsRUFBRSxHQUFHO1FBQ1AsYUFBYSxFQUFFLElBQUksb0JBQW9CLEVBQUUsQ0FBQyxPQUFPO1FBQ2pELE9BQU8sRUFBRSxNQUFNO1FBQ2YsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFO1FBQzdDLFFBQVEsRUFBRSxDQUFDO1FBQ1gsZUFBZSxFQUFFO1lBQ2IsWUFBWSxFQUFFLENBQUM7WUFDZixRQUFRLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNO2dCQUNyQixLQUFLLEVBQUUsRUFBRTthQUNaO1lBQ0QsT0FBTyxFQUFFLEtBQUs7U0FDakI7UUFDRCxTQUFTLEVBQUUsSUFBSSxJQUFJLEVBQUU7UUFDckIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxNQUFNO1FBQ3ZCLE1BQU0sRUFBRSxJQUFJO0tBQ2YsRUFBRTtRQUNDLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsRUFBRSxFQUFFLEdBQUc7UUFDUCxhQUFhLEVBQUUsSUFBSSxXQUFXLEVBQUUsQ0FBQyxPQUFPO1FBQ3hDLE9BQU8sRUFBRSxNQUFNO1FBQ2YsT0FBTyxFQUFFLEVBQUU7UUFDWCxRQUFRLEVBQUUsQ0FBQztRQUNYLGVBQWUsRUFBRTtZQUNiLFlBQVksRUFBRSxDQUFDO1lBQ2YsUUFBUSxFQUFFO2dCQUNOLElBQUksRUFBRSxRQUFRLENB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