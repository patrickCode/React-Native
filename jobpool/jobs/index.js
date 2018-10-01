import { DummyAsyncStorageJob } from './dummyAsyncStorageJob';
import { TimeUnit } from 'infra/job.interface';
import { GetQuestion } from './getQuestionsJob';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM5RCxPQUFPLEVBQU8sUUFBUSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDcEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRWhELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBZSxDQUFDO1FBQzdCLElBQUksRUFBRSxzQkFBc0I7UUFDNUIsRUFBRSxFQUFFLEdBQUc7UUFDUCxhQUFhLEVBQUUsSUFBSSxvQkFBb0IsRUFBRSxDQUFDLE9BQU87UUFDakQsT0FBTyxFQUFFLE1BQU07UUFDZixPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO1FBQ3hCLFFBQVEsRUFBRSxDQUFDO1FBQ1gsZUFBZSxFQUFFO1lBQ2IsWUFBWSxFQUFFLENBQUM7WUFDZixRQUFRLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNO2dCQUNyQixLQUFLLEVBQUUsRUFBRTthQUNaO1lBQ0QsT0FBTyxFQUFFLEtBQUs7U0FDakI7UUFDRCxTQUFTLEVBQUUsSUFBSSxJQUFJLEVBQUU7S0FDeEIsRUFBRTtRQUNDLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsRUFBRSxFQUFFLEdBQUc7UUFDUCxhQUFhLEVBQUUsSUFBSSxXQUFXLEVBQUUsQ0FBQyxPQUFPO1FBQ3hDLE9BQU8sRUFBRSxNQUFNO1FBQ2YsT0FBTyxFQUFFLEVBQUU7UUFDWCxRQUFRLEVBQUUsQ0FBQztRQUNYLGVBQWUsRUFBRTtZQUNiLFlBQVksRUFBRSxDQUFDO1lBQ2YsUUFBUSxFQUFFO2dCQUNOLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTtnQkFDbkIsS0FBSyxFQUFFLEVBQUU7YUFDWjtZQUNELE9BQU8sRUFBRSxLQUFLO1NBQ2pCO1FBQ0QsU0FBUyxFQUFFLElBQUksSUFBSSxFQUFFO0tBQ3hCLENBQUMsQ0FBQyJ9