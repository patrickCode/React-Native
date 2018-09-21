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
            await this._queue.StartProcessing(20000);
            
            let currentBgStatusStr = await AsyncStorage.getItem("BackgroundJobStatus");
            let currentBgStatus = currentBgStatusStr ? JSON.parse(currentBgStatusStr) : { count: 0, LastRunOn: null };
            currentBgStatus.count += 1;
            currentBgStatus.LastRunOn = new Date().toDateString();
            await AsyncStorage.setItem("BackgroundJobStatus", JSON.stringify(currentBgStatus));
            
            BackgroundTask.finish();
        });
    }
}