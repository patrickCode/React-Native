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
    Schedule() {
        BackgroundTask.schedule();
        alert("BG Sync scheduled");
    }
    SetupSync() {
        return __awaiter(this, void 0, void 0, function* () {
            BackgroundTask.define(() => __awaiter(this, void 0, void 0, function* () {
                yield this._queue.CreateProcessingJob();
                this._queue.AddJob(0, false);
                yield this._queue.StartProcessing(20000);
                let currentBgStatusStr = yield AsyncStorage.getItem("BackgroundJobStatus");
                let currentBgStatus = currentBgStatusStr ? JSON.parse(currentBgStatusStr) : { count: 0, LastRunOn: null };
                currentBgStatus.count += 1;
                currentBgStatus.LastRunOn = new Date().toDateString();
                yield AsyncStorage.setItem("BackgroundJobStatus", JSON.stringify(currentBgStatus));
                BackgroundTask.finish();
            }));
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM1QyxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQTtBQUU5RCxNQUFNLE9BQU8sY0FBYztJQUV2QixZQUFvQixTQUFnQixJQUFJLEtBQUssRUFBRTtRQUEzQixXQUFNLEdBQU4sTUFBTSxDQUFxQjtJQUFJLENBQUM7SUFFN0MsUUFBUTtRQUNYLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMxQixLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRVksU0FBUzs7WUFDbEIsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFTLEVBQUU7Z0JBQzdCLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2dCQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzdCLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRXpDLElBQUksa0JBQWtCLEdBQUcsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBQzNFLElBQUksZUFBZSxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7Z0JBQzFHLGVBQWUsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO2dCQUMzQixlQUFlLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3RELE1BQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBRW5GLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM1QixDQUFDLENBQUEsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztLQUFBO0NBQ0oifQ==