import queueFactory from 'react-native-queue';
import { AsyncStorage } from 'react-native';

export class Queue {
    private _queue: any = {};
    constructor() { }

    async Init(): Promise<void> {
        this._queue = await queueFactory();
    }

    public async CreateDummyProcessingJob(): Promise<void> {
        this._queue.addWorker('create-dummy-entry', async (id, payload) => {
            let currentDate = new Date();
            let dataToBeAdded = `Date - ${currentDate.toString()}. ID - ${id.toString()}. Payload - ${JSON.stringify(payload)}`;
            await this.sleep(15000);
            let currentJobStatus = await AsyncStorage.getItem("dummyJobStatus");
            if (currentJobStatus === undefined || currentJobStatus === null) {
                currentJobStatus = dataToBeAdded;
            } else {
                currentJobStatus = dataToBeAdded + " " + currentJobStatus;
            }
            await AsyncStorage.setItem("dummyJobStatus", currentJobStatus);
        });
    }

    //In real world the worker function needs to be passed here
    public async CreateProcessingJob(): Promise<void> {
        this._queue.addWorker('get-questions-job', async (id, payload) => {
            console.log(`Queue executin job with ID ${id} and payload ${JSON.stringify(payload)}`);
            let pageNumber: number = payload["pagenumber"];

            let availableQuestionsStr = await AsyncStorage.getItem("questionList");

            var response = await fetch('https://questhunt.azurewebsites.net/api/questions');
            var questions: any = (await response.json());

            await AsyncStorage.setItem("questionList", JSON.stringify(questions));
            // if (availableQuestionsStr === undefined || availableQuestionsStr === null) {
            //     await AsyncStorage.setItem("questionList", JSON.stringify(questions));
            // } else {
            //     if (JSON.parse(availableQuestionsStr) !== questions) {
            //         await AsyncStorage.setItem("questionList", JSON.stringify(questions));
            //     }
            // }
            
            await AsyncStorage.setItem("randomSeed", this.createRandomNumber(10000).toString());
            await AsyncStorage.setItem("OperationInProgress", "False");
        });
    }

    public AddJob(pageNumber: number, startImmediately: boolean = true): void {
        this._queue.createJob('get-questions-job', {
            pagenumber: pageNumber
        }, {}, startImmediately);
    }

    public AddDummyJob(payload:any, startImmediately: boolean = false): void {
        this._queue.createJob('create-dummy-entry', payload, {}, startImmediately);
    }

    public async StartProcessing(timeout: number = 30000): Promise<void> {
        await this._queue.start(timeout);
    }

    private async sleep(ms: number): Promise<any> {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    private createRandomNumber(maximumNumber: number): number {
        return Math.floor((Math.random() * maximumNumber) + 1);
    }
}