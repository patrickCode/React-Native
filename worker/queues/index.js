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
    CreateDummyProcessingJob() {
        return __awaiter(this, void 0, void 0, function* () {
            this._queue.addWorker('create-dummy-entry', (id, payload) => __awaiter(this, void 0, void 0, function* () {
                let currentDate = new Date();
                let dataToBeAdded = `Date - ${currentDate.toString()}. ID - ${id.toString()}. Payload - ${JSON.stringify(payload)}`;
                yield this.sleep(10000);
                let currentJobStatus = yield AsyncStorage.getItem("dummyJobStatus");
                if (currentJobStatus === undefined || currentJobStatus === null) {
                    currentJobStatus = dataToBeAdded;
                }
                else {
                    currentJobStatus = dataToBeAdded + " " + currentJobStatus;
                }
                yield AsyncStorage.setItem("dummyJobStatus", currentJobStatus);
            }));
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
                yield AsyncStorage.setItem("questionList", JSON.stringify(questions));
                // if (availableQuestionsStr === undefined || availableQuestionsStr === null) {
                //     await AsyncStorage.setItem("questionList", JSON.stringify(questions));
                // } else {
                //     if (JSON.parse(availableQuestionsStr) !== questions) {
                //         await AsyncStorage.setItem("questionList", JSON.stringify(questions));
                //     }
                // }
                yield AsyncStorage.setItem("randomSeed", this.createRandomNumber(10000).toString());
                yield AsyncStorage.setItem("OperationInProgress", "False");
            }));
        });
    }
    AddJob(pageNumber, startImmediately = true) {
        this._queue.createJob('get-questions-job', {
            pagenumber: pageNumber
        }, { attempts: 5, timeout: 15000 }, startImmediately);
    }
    AddDummyJob(payload, startImmediately = false) {
        this._queue.createJob('create-dummy-entry', payload, { attempts: 5, timeout: 15000 }, startImmediately);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sWUFBWSxNQUFNLG9CQUFvQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFNUMsTUFBTSxPQUFPLEtBQUs7SUFFZDtRQURRLFdBQU0sR0FBUSxFQUFFLENBQUM7SUFDVCxDQUFDO0lBRVgsSUFBSTs7WUFDTixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sWUFBWSxFQUFFLENBQUM7UUFDdkMsQ0FBQztLQUFBO0lBRVksd0JBQXdCOztZQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsRUFBRSxDQUFPLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRTtnQkFDOUQsSUFBSSxXQUFXLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDN0IsSUFBSSxhQUFhLEdBQUcsVUFBVSxXQUFXLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxDQUFDLFFBQVEsRUFBRSxlQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDcEgsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN4QixJQUFJLGdCQUFnQixHQUFHLE1BQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUNwRSxJQUFJLGdCQUFnQixLQUFLLFNBQVMsSUFBSSxnQkFBZ0IsS0FBSyxJQUFJLEVBQUU7b0JBQzdELGdCQUFnQixHQUFHLGFBQWEsQ0FBQztpQkFDcEM7cUJBQU07b0JBQ0gsZ0JBQWdCLEdBQUcsYUFBYSxHQUFHLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQztpQkFDN0Q7Z0JBQ0QsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDbkUsQ0FBQyxDQUFB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