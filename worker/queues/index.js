var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import queueFactory from 'react-native-queue';
import { AsyncStorage } from 'react-native';
export class Queue {
    constructor() {
        this._queue = {};
    }
    Init() {
        return __awaiter(this, void 0, void 0, function* () {
            this._queue = yield queueFactory();
        });
    }
    //In real world the worker function needs to be passed here
    CreateProcessingJob() {
        return __awaiter(this, void 0, void 0, function* () {
            this._queue.addWorker('get-questions-job', (id, payload) => __awaiter(this, void 0, void 0, function* () {
                console.log(`Queue executin job with ID ${id} and payload ${JSON.stringify(payload)}`);
                let pageNumber = payload["pagenumber"];
                let availableQuestionsStr = yield AsyncStorage.getItem("questionList");
                var response = yield fetch('https://questhunt.azurewebsites.net/api/questions');
                var questions = (yield response.json());
                if (availableQuestionsStr !== undefined && availableQuestionsStr !== null) {
                    if (JSON.parse(availableQuestionsStr) !== questions) {
                        yield AsyncStorage.setItem("questionList", JSON.stringify(questions));
                    }
                }
                yield AsyncStorage.setItem("randomSeed", this.createRandomNumber(10000).toString());
                yield AsyncStorage.setItem("OperationInProgress", "False");
            }));
        });
    }
    AddJob(pageNumber, startImmediately = true) {
        this._queue.createJob('get-questions-job', {
            pagenumber: pageNumber
        }, {}, startImmediately);
    }
    StartProcessing(timeout = 30000) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._queue.start(timeout);
        });
    }
    sleep(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => setTimeout(resolve, ms));
        });
    }
    createRandomNumber(maximumNumber) {
        return Math.floor((Math.random() * maximumNumber) + 1);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sWUFBWSxNQUFNLG9CQUFvQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFNUMsTUFBTSxPQUFPLEtBQUs7SUFFZDtRQURRLFdBQU0sR0FBUSxFQUFFLENBQUM7SUFDVCxDQUFDO0lBRVgsSUFBSTs7WUFDTixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sWUFBWSxFQUFFLENBQUM7UUFDdkMsQ0FBQztLQUFBO0lBRUQsMkRBQTJEO0lBQzlDLG1CQUFtQjs7WUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUU7Z0JBQzdELE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUUsZ0JBQWdCLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN2RixJQUFJLFVBQVUsR0FBVyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBRS9DLElBQUkscUJBQXFCLEdBQUcsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUV2RSxJQUFJLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO2dCQUNoRixJQUFJLFNBQVMsR0FBUSxDQUFDLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBRTdDLElBQUkscUJBQXFCLEtBQUssU0FBUyxJQUFJLHFCQUFxQixLQUFLLElBQUksRUFBRTtvQkFDdkUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLEtBQUssU0FBUyxFQUFFO3dCQUNqRCxNQUFNLFlBQVksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztxQkFDekU7aUJBQ0o7Z0JBRUQsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDcEYsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQy9ELENBQUMsQ0FBQSxDQUFDLENBQUM7UUFDUCxDQUFDO0tBQUE7SUFFTSxNQUFNLENBQUMsVUFBa0IsRUFBRSxtQkFBNEIsSUFBSTtRQUM5RCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRTtZQUN2QyxVQUFVLEVBQUUsVUFBVTtTQUN6QixFQUFFLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFWSxlQUFlLENBQUMsVUFBa0IsS0FBSzs7WUFDaEQsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQyxDQUFDO0tBQUE7SUFFYSxLQUFLLENBQUMsRUFBVTs7WUFDMUIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQzVELENBQUM7S0FBQTtJQUVPLGtCQUFrQixDQUFDLGFBQXFCO1FBQzVDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMzRCxDQUFDO0NBQ0oifQ==