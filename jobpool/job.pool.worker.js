var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class JobPoolWorker {
    AssignJob(job) {
        JobPoolWorker.AssignedJobs[job.Id] = job.JobDefinition;
    }
    UnassignJob(job) {
        delete JobPoolWorker.AssignedJobs[job.Id];
    }
    Execute(job) {
        return __awaiter(this, void 0, void 0, function* () {
            let jobDefinition = JobPoolWorker.AssignedJobs[job.Id];
            if (jobDefinition === undefined || jobDefinition === null)
                throw new Error(`Job with ID ${job.Id} has not been defined. Exeute jobPool.DefineJob(...) before triggering the pool.`);
            let timeout = job.RuntimeSettings.Timeout;
            let payload = job.Payload;
            var result = yield Promise.race([this.runTimer(timeout), this.executeJob(jobDefinition, payload)]);
            return result;
        });
    }
    runTimer(timeout) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    IsFailed: true,
                    IsTimeout: true,
                    Error: new Error("Timeout Exception."),
                    TimeTaken: timeout
                });
            }, timeout);
        });
    }
    executeJob(jobDefinition, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield jobDefinition(payload);
                return {
                    IsFailed: false,
                    IsTimeout: false,
                    TimeTaken: 0,
                    Error: null
                };
            }
            catch (exception) {
                return {
                    IsFailed: true,
                    IsTimeout: false,
                    TimeTaken: 0,
                    Error: exception
                };
            }
        });
    }
}
JobPoolWorker.AssignedJobs = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9iLnBvb2wud29ya2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiam9iLnBvb2wud29ya2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUEsTUFBTSxPQUFPLGFBQWE7SUFJdEIsU0FBUyxDQUFDLEdBQVE7UUFDZCxhQUFhLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDO0lBQzNELENBQUM7SUFFRCxXQUFXLENBQUMsR0FBUTtRQUNoQixPQUFPLGFBQWEsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFSyxPQUFPLENBQUUsR0FBUTs7WUFDbkIsSUFBSSxhQUFhLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdkQsSUFBSSxhQUFhLEtBQUssU0FBUyxJQUFJLGFBQWEsS0FBSyxJQUFJO2dCQUNyRCxNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsR0FBRyxDQUFDLEVBQUUsa0ZBQWtGLENBQUMsQ0FBQztZQUU3SCxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQztZQUMxQyxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO1lBRTFCLElBQUksTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25HLE9BQU8sTUFBTSxDQUFDO1FBQ2xCLENBQUM7S0FBQTtJQUVPLFFBQVEsQ0FBRSxPQUFlO1FBQzdCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbkMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDWixPQUFPLENBQUM7b0JBQ0osUUFBUSxFQUFFLElBQUk7b0JBQ2QsU0FBUyxFQUFFLElBQUk7b0JBQ2YsS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDO29CQUN0QyxTQUFTLEVBQUUsT0FBTztpQkFDckIsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVhLFVBQVUsQ0FBQyxhQUFrQixFQUFFLE9BQVk7O1lBQ3JELElBQUk7Z0JBQ0EsTUFBTSxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzdCLE9BQU87b0JBQ0gsUUFBUSxFQUFFLEtBQUs7b0JBQ2YsU0FBUyxFQUFFLEtBQUs7b0JBQ2hCLFNBQVMsRUFBRSxDQUFDO29CQUNaLEtBQUssRUFBRSxJQUFJO2lCQUNkLENBQUE7YUFDSjtZQUFDLE9BQU8sU0FBUyxFQUFFO2dCQUNoQixPQUFPO29CQUNILFFBQVEsRUFBRSxJQUFJO29CQUNkLFNBQVMsRUFBRSxLQUFLO29CQUNoQixTQUFTLEVBQUUsQ0FBQztvQkFDWixLQUFLLEVBQUUsU0FBUztpQkFDbkIsQ0FBQTthQUNKO1FBQ0wsQ0FBQztLQUFBOztBQXBETSwwQkFBWSxHQUFRLEVBQUUsQ0FBQyJ9