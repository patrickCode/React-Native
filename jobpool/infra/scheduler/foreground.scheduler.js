var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Jobs } from '../../jobs';
import { JobPoolManager } from '../job.pool.manager';
import { JobPoolTranslator } from '../translators/job.pool.translator';
import { JobTranslator } from '../translators/job.translator';
import { JobStatusTranslator } from '../translators/job.status.translator';
import { RunMode } from '../job.interface';
import { Thread as Worker } from "react-native-threads";
export class ForegrounScheduler {
    constructor() {
        this.isActive = false;
    }
    Intialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.jobPoolManager = new JobPoolManager("BackgroundSyncPool", { DatabaseName: "jobPool.realm", Translator: new JobPoolTranslator() }, { DatabaseName: "jobs.realm", Translator: new JobTranslator() }, { DatabaseName: "jobStatus.realm", Translator: new JobStatusTranslator() });
            yield this.jobPoolManager.Create();
            Jobs.forEach((job) => __awaiter(this, void 0, void 0, function* () {
                yield this.jobPoolManager.AddJob(job);
            }));
            yield this.jobPoolManager.ScheduleJobs();
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
        let worker = new Worker('foregroundWorker.js');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yZWdyb3VuZC5zY2hlZHVsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmb3JlZ3JvdW5kLnNjaGVkdWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDbEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUM5RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQW1CLE9BQU8sRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRTVELE9BQU8sRUFBRSxNQUFNLElBQUksTUFBTSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFeEQsTUFBTSxPQUFPLGtCQUFrQjtJQUEvQjtRQUVZLGFBQVEsR0FBWSxLQUFLLENBQUM7SUFtRHRDLENBQUM7SUFsRFMsU0FBUzs7WUFDWCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxDQUFDLG9CQUFvQixFQUM3RCxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLElBQUksaUJBQWlCLEVBQUUsRUFBRSxFQUN0RSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLElBQUksYUFBYSxFQUFFLEVBQUUsRUFDL0QsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLElBQUksbUJBQW1CLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFNUUsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBTyxHQUFHLEVBQUUsRUFBRTtnQkFDdkIsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUEsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzdDLENBQUM7S0FBQTtJQUVELEtBQUssQ0FBQyxRQUFnQjtRQUNsQixJQUFJLGFBQWEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNuQixVQUFVLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQ3ZDO2lCQUFNO2dCQUNILFVBQVUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDdkM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILFVBQVUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVPLFdBQVc7UUFDZixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQy9DLElBQUksUUFBUSxHQUE2QjtZQUNyQyxJQUFJLEVBQUUsSUFBSTtZQUNWLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYztZQUNuQyxtQkFBbUIsRUFBRTtnQkFDakIsV0FBVyxFQUFFLENBQUM7Z0JBQ2QsSUFBSSxFQUFFLE9BQU8sQ0FBQyxVQUFVO2dCQUN4QixPQUFPLEVBQUUsS0FBSztnQkFDZCxNQUFNLEVBQUUsSUFBSTthQUNmO1NBQ0osQ0FBQztRQUNGLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUMzQixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3JDLElBQUksVUFBVSxDQUFDLFdBQVcsS0FBSyxlQUFlLEVBQUU7Z0JBQzVDLEtBQUssQ0FBQyxxQkFBcUIsVUFBVSxDQUFDLEtBQUssSUFBSSxVQUFVLENBQUMsT0FBTyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUNuRixLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzthQUMvQztpQkFBTTtnQkFDSCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7YUFDekI7UUFDTCxDQUFDLENBQUE7SUFDTCxDQUFDO0NBQ0oifQ==