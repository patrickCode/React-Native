var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//import { Jobs } from 'jobs';
import { JobPoolManager } from 'job.pool.manager';
import { JobPoolTranslator } from 'translators/job.pool.translator';
import { JobTranslator } from 'translators/job.translator';
import { JobStatusTranslator } from 'translators/job.status.translator';
import { RunMode } from 'job.interface';
import { Thread as Worker } from "react-native-threads";
import { DummyAsyncStorageJob } from 'jobs/dummyAsyncStorageJob';
import { GetQuestion } from 'jobs/getQuestionsJob';
export class ForegrounScheduler {
    constructor() {
        this.isActive = false;
    }
    Intialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.jobPoolManager = new JobPoolManager("BackgroundSyncPool", { DatabaseName: "jobPool.realm", Translator: new JobPoolTranslator() }, { DatabaseName: "jobs.realm", Translator: new JobTranslator() }, { DatabaseName: "jobStatus.realm", Translator: new JobStatusTranslator() });
                yield this.jobPoolManager.Create();
                // Jobs.forEach(async (job) => {
                //     await this.jobPoolManager.AddJob(job);
                // });
            }
            catch (err) {
                //alert("1." + JSON.stringify(err));
            }
            try {
                yield this.jobPoolManager.ScheduleJobs();
            }
            catch (err) {
                alert("2. " + JSON.stringify(err));
            }
        });
    }
    Start(interval) {
        let foregroundJob = new Promise((res, rej) => {
            if (!this.isActive) {
                this.startWorker();
                setTimeout(foregroundJob, interval);
            }
            else {
                setTimeout(foregroundJob, interval);
            }
        });
        setTimeout(foregroundJob, interval);
    }
    startWorker() {
        this.isActive = true;
        let worker = new Worker('index.thread.js');
        let settings = {
            Jobs: Jobs,
            JobPoolManager: this.jobPoolManager,
            PoolRuntimeSettings: {
                Concurrency: 1,
                Mode: RunMode.Foreground,
                Timeout: 60000,
                Notify: null
            }
        };
        worker.postMessage(JSON.stringify(settings));
        worker.onmessage = (message) => {
            let messageObj = JSON.parse(message);
            if (messageObj.MessageType === "JOB_COMPLETED") {
                alert(`Job with ID-Name (${messageObj.JobId}-${messageObj.JobName}) is completed`);
                alert(JSON.stringify(messageObj.RunStatus));
            }
            else {
                alert(message);
                this.isActive = false;
            }
        };
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yZWdyb3VuZC5zY2hlZHVsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmb3JlZ3JvdW5kLnNjaGVkdWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLDhCQUE4QjtBQUM5QixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDbEQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDcEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3hFLE9BQU8sRUFBbUIsT0FBTyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpELE9BQU8sRUFBRSxNQUFNLElBQUksTUFBTSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDeEQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDakUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRW5ELE1BQU0sT0FBTyxrQkFBa0I7SUFBL0I7UUFFWSxhQUFRLEdBQVksS0FBSyxDQUFDO0lBNER0QyxDQUFDO0lBM0RTLFNBQVM7O1lBQ1gsSUFBSTtnQkFDQSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxDQUFDLG9CQUFvQixFQUN6RCxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLElBQUksaUJBQWlCLEVBQUUsRUFBRSxFQUN0RSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLElBQUksYUFBYSxFQUFFLEVBQUUsRUFDL0QsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLElBQUksbUJBQW1CLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBRWhGLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDbkMsZ0NBQWdDO2dC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