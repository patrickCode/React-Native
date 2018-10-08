var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AsyncStorage } from "react-native";
import { CacheLogger } from '../data/cache.logger';
export class DummyAsyncStorageJob {
    constructor() {
        this.Execute = (payload) => __awaiter(this, void 0, void 0, function* () {
            yield CacheLogger.Log("[Dummy Storage Job]: Job Started");
            let maxNumber = payload.MaxNumber;
            let text = payload.Text ? payload.Text : "";
            let randomNumber = this.GenerateRandomNumber(maxNumber);
            yield AsyncStorage.getItem("Dummy-Cache-Entry")
                .then((cachedData) => __awaiter(this, void 0, void 0, function* () {
                CacheLogger.Log("[Dummy Storage Job]: Cache updating");
                let data = (cachedData !== undefined && cachedData !== null) ? JSON.parse(cachedData) : { timestamp: null, version: 0, random: 0, text: "" };
                data.timestamp = new Date().toUTCString();
                data.version = data.version + 1;
                data.random = randomNumber;
                data.text = text;
                yield AsyncStorage.setItem("Dummy-Cache-Entry", JSON.stringify(data));
                CacheLogger.Log("[Dummy Storage Job]: Cache updated");
            }));
            yield CacheLogger.Log("[Dummy Storage Job]: Job completed");
        });
    }
    GenerateRandomNumber(maxNumber) {
        return Math.floor(Math.random() * maxNumber);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtbXlBc3luY1N0b3JhZ2VKb2IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkdW1teUFzeW5jU3RvcmFnZUpvYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDNUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRW5ELE1BQU0sT0FBTyxvQkFBb0I7SUFDN0I7UUFFQSxZQUFPLEdBQUcsQ0FBTyxPQUFZLEVBQWlCLEVBQUU7WUFDNUMsTUFBTSxXQUFXLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7WUFDMUQsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztZQUNsQyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDNUMsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztpQkFDMUMsSUFBSSxDQUFDLENBQU8sVUFBZSxFQUFFLEVBQUU7Z0JBQzVCLFdBQVcsQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxVQUFVLEtBQUssU0FBUyxJQUFJLFVBQVUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUM7Z0JBQzdJLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDMUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUNqQixNQUFNLFlBQVksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN0RSxXQUFXLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7WUFDMUQsQ0FBQyxDQUFBLENBQUMsQ0FBQztZQUNQLE1BQU0sV0FBVyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQSxDQUFBO0lBbkJlLENBQUM7SUFxQlQsb0JBQW9CLENBQUMsU0FBaUI7UUFDMUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQztJQUNqRCxDQUFDO0NBQ0oifQ==