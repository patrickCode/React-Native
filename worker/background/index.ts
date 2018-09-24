import { Queue } from '../queues';
import { AsyncStorage } from 'react-native';
const BackgroundTask = require('react-native-background-task')

export class BackgroundSync {

    constructor(private _queue: Queue = new Queue()) { }

    public Schedule(): void {
        BackgroundTask.schedule();
        alert("BG Sync scheduled");
    }

    public async SetupSync(): Promise<void> {
        BackgroundTask.define(async () => {
            await this._queue.CreateProcessingJob();
            this._queue.AddJob(0, false);
            this._queue.AddDummyJob({"Some_Data_1": "Some_Value_1"}, false);
            this._queue.AddDummyJob({"Some_Data_2": "Some_Value_2"}, false);
            this._queue.AddDummyJob({"Some_Data_3": "Some_Value_3"}, false);
            this._queue.AddDummyJob({"Some_Data_4": "Some_Value_4"}, false);
            this._queue.AddDummyJob({"Some_Data_5": "Some_Value_5"}, false);

            await this._queue.StartProcessing(25000);
            
            let currentBgStatusStr = await AsyncStorage.getItem("BackgroundJobStatus");
            let currentBgStatus = currentBgStatusStr ? JSON.parse(currentBgStatusStr) : { count: 0, LastRunOn: null };
            currentBgStatus.count += 1;
            currentBgStatus.LastRunOn = new Date().toDateString();
            await AsyncStorage.setItem("BackgroundJobStatus", JSON.stringify(currentBgStatus));
            
            BackgroundTask.finish();
        });
    }
}