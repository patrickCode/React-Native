import { Queue } from '../queues';
import { AsyncStorage } from 'react-native';
const BackgroundTask = require('react-native-background-task')

export class BackgroundSync {

    constructor(private _queue: Queue = new Queue()) { }

    public Schedule(period: number = 900): void {
        BackgroundTask.schedule({
            period: 900
        });
        alert("BG Sync scheduled");
    }

    public async SetupSync(): Promise<void> {
        BackgroundTask.define(async () => {
            let currentBgStatusStr = await AsyncStorage.getItem("BackgroundJobStatus");
            let currentBgStatus = currentBgStatusStr ? JSON.parse(currentBgStatusStr) : { count: 0, LastRunOn: null };
            currentBgStatus.count += 1;
            currentBgStatus.LastRunOn = new Date().toDateString();
            await AsyncStorage.setItem("BackgroundJobStatus", JSON.stringify(currentBgStatus));

            await this._queue.StartProcessing(25000);

            BackgroundTask.finish();
        });

        alert("BG sync setup completed");
    }

    public async CheckStatus(): Promise<void> {
        let status = await BackgroundTask.statusAsync();

        if (status.available) {
            alert("BG sync is running as expected");
            return;
        }

        let reason = status.unavailableReason;
        if (reason === BackgroundTask.UNAVAILABLE_DENIED)
            alert('BG status is denied');
        if (reason === BackgroundTask.UNAVAILABLE_RESTRICTED)
            alert('BG sync is restricted in this device');

        alert(status + ' ' + reason);
    }
}