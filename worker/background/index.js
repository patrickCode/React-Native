var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Queue } from '../queues';
import { AsyncStorage } from 'react-native';
const BackgroundTask = require('react-native-background-task');
export class BackgroundSync {
    constructor(_queue = new Queue()) {
        this._queue = _queue;
    }
    Schedule(period = 900) {
        BackgroundTask.schedule({
            period: 900
        });
        alert("BG Sync scheduled");
    }
    SetupSync() {
        return __awaiter(this, void 0, void 0, function* () {
            BackgroundTask.define(() => __awaiter(this, void 0, void 0, function* () {
                let currentBgStatusStr = yield AsyncStorage.getItem("BackgroundJobStatus");
                let currentBgStatus = currentBgStatusStr ? JSON.parse(currentBgStatusStr) : { count: 0, LastRunOn: null };
                currentBgStatus.count += 1;
                currentBgStatus.LastRunOn = new Date().toDateString();
                yield AsyncStorage.setItem("BackgroundJobStatus", JSON.stringify(currentBgStatus));
                yield this._queue.StartProcessing(25000);
                BackgroundTask.finish();
            }));
            alert("BG sync setup completed");
        });
    }
    CheckStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            let status = yield BackgroundTask.statusAsync();
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
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM1QyxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQTtBQUU5RCxNQUFNLE9BQU8sY0FBYztJQUV2QixZQUFvQixTQUFnQixJQUFJLEtBQUssRUFBRTtRQUEzQixXQUFNLEdBQU4sTUFBTSxDQUFxQjtJQUFJLENBQUM7SUFFN0MsUUFBUSxDQUFDLFNBQWlCLEdBQUc7UUFDaEMsY0FBYyxDQUFDLFFBQVEsQ0FBQztZQUNwQixNQUFNLEVBQUUsR0FBRztTQUNkLENBQUMsQ0FBQztRQUNILEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFWSxTQUFTOztZQUNsQixjQUFjLENBQUMsTUFBTSxDQUFDLEdBQVMsRUFBRTtnQkFDN0IsSUFBSSxrQkFBa0IsR0FBRyxNQUFNLFlBQVksQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztnQkFDM0UsSUFBSSxlQUFlLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQztnQkFDMUcsZUFBZSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7Z0JBQzNCLGVBQWUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDdEQsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFFbkYsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFekMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzVCLENBQUMsQ0FBQSxDQUFDLENBQUM7WUFFSCxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUNyQyxDQUFDO0tBQUE7SUFFWSxXQUFXOztZQUNwQixJQUFJLE1BQU0sR0FBRyxNQUFNLGNBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUVoRCxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Z0JBQ2xCLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO2dCQUN4QyxPQUFPO2FBQ1Y7WUFFRCxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUM7WUFDdEMsSUFBSSxNQUFNLEtBQUssY0FBYyxDQUFDLGtCQUFrQjtnQkFDNUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDakMsSUFBSSxNQUFNLEtBQUssY0FBYyxDQUFDLHNCQUFzQjtnQkFDaEQsS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7WUFFbEQsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDakMsQ0FBQztLQUFBO0NBQ0oifQ==