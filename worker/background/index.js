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
            yield this._queue.CreateDummyProcessingJob();
            yield this._queue.CreateProcessingJob();
            this._queue.AddJob(0, false);
            this._queue.AddDummyJob({ "Some_Data_1": "Some_Value_1" }, false);
            this._queue.AddDummyJob({ "Some_Data_2": "Some_Value_2" }, false);
            this._queue.AddDummyJob({ "Some_Data_3": "Some_Value_3" }, false);
            this._queue.AddDummyJob({ "Some_Data_4": "Some_Value_4" }, false);
            this._queue.AddDummyJob({ "Some_Data_5": "Some_Value_5" }, false);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM1QyxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQTtBQUU5RCxNQUFNLE9BQU8sY0FBYztJQUV2QixZQUFvQixTQUFnQixJQUFJLEtBQUssRUFBRTtRQUEzQixXQUFNLEdBQU4sTUFBTSxDQUFxQjtJQUFJLENBQUM7SUFFN0MsUUFBUSxDQUFDLFNBQWlCLEdBQUc7UUFDaEMsY0FBYyxDQUFDLFFBQVEsQ0FBQztZQUNwQixNQUFNLEVBQUUsR0FBRztTQUNkLENBQUMsQ0FBQztRQUNILEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFWSxTQUFTOztZQUNsQixNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztZQUM3QyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFbEUsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFTLEVBQUU7Z0JBQzdCLElBQUksa0JBQWtCLEdBQUcsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBQzNFLElBQUksZUFBZSxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7Z0JBQzFHLGVBQWUsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO2dCQUMzQixlQUFlLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3RELE1BQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBR25GLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRXpDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM1QixDQUFDLENBQUEsQ0FBQyxDQUFDO1lBRUgsS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDckMsQ0FBQztLQUFBO0lBRVksV0FBVzs7WUFDcEIsSUFBSSxNQUFNLEdBQUcsTUFBTSxjQUFjLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFaEQsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUNsQixLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztnQkFDeEMsT0FBTzthQUNWO1lBRUQsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1lBQ3RDLElBQUksTUFBTSxLQUFLLGNBQWMsQ0FBQyxrQkFBa0I7Z0JBQzVDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ2pDLElBQUksTUFBTSxLQUFLLGNBQWMsQ0FBQyxzQkFBc0I7Z0JBQ2hELEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1lBRWxELEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLENBQUM7S0FBQTtDQUNKIn0=