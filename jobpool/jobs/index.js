import { DummyAsyncStorageJob } from './dummyAsyncStorageJob';
//import { Job, TimeUnit } from 'job.interface';
import { GetQuestion } from './getQuestionsJob';
//export const Jobs: Array<Job> = [{
export const Jobs = [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM5RCxnREFBZ0Q7QUFDaEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRWhELG9DQUFvQztBQUNwQyxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQWUsQ0FBQztRQUM3QixJQUFJLEVBQUUsc0JBQXNCO1FBQzVCLEVBQUUsRUFBRSxHQUFHO1FBQ1AsYUFBYSxFQUFFLElBQUksb0JBQW9CLEVBQUUsQ0FBQyxPQUFPO1FBQ2pELE9BQU8sRUFBRSxNQUFNO1FBQ2YsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtRQUN4QixRQUFRLEVBQUUsQ0FBQztRQUNYLGVBQWUsRUFBRTtZQUNiLFlBQVksRUFBRSxDQUFDO1lBQ2YsUUFBUSxFQUFFO2dCQUNOLHdCQUF3QjtnQkFDeEIsSUFBSSxFQUFFLENBQUM7Z0JBQ1AsS0FBSyxFQUFFLEVBQUU7YUFDWjtZQUNELE9BQU8sRUFBRSxLQUFLO1NBQ2pCO1FBQ0QsU0FBUyxFQUFFLElBQUksSUFBSSxFQUFFO0tBQ3hCLEVBQUU7UUFDQyxJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLEVBQUUsRUFBRSxHQUFHO1FBQ1AsYUFBYSxFQUFFLElBQUksV0FBVyxFQUFFLENBQUMsT0FBTztRQUN4QyxPQUFPLEVBQUUsTUFBTTtRQUNmLE9BQU8sRUFBRSxFQUFFO1FBQ1gsUUFBUSxFQUFFLENBQUM7UUFDWCxlQUFlLEVBQUU7WUFDYixZQUFZLEVBQUUsQ0FBQztZQUNmLFFBQVEsRUFBRTtnQkFDTixzQkFBc0I7Z0JBQ3RCLElBQUksRUFBRSxDQUFDO2dCQUNQLEtBQUssRUFBRSxFQUFFO2FBQ1o7WUFDRCxPQUFPLEVBQUUsS0FBSztTQUNqQjtRQUNELFNBQVMsRUFBRSxJQUFJLElBQUksRUFBRTtLQUN4QixDQUFDLENBQUMifQ==