import { AsyncStorage } from "react-native";
export class DummyAsyncStorageJob {
    constructor() {
        this.Execute = (payload) => {
            let maxNumber = payload.MaxNumber;
            let randomNumber = this.GenerateRandomNumber(maxNumber);
            AsyncStorage.getItem("Dummy-Cache-Entry")
                .then((cachedData) => {
                let data = (cachedData !== undefined && cachedData !== null) ? JSON.parse(cachedData) : { timestamp: null, version: 0, random: 0 };
                data.timestamp = new Date().toUTCString();
                data.version = data.version + 1;
                data.random = randomNumber;
                AsyncStorage.setItem("Dummy-Cache-Entry", JSON.stringify(data));
            });
        };
    }
    GenerateRandomNumber(maxNumber) {
        return Math.floor(Math.random() * maxNumber);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtbXlBc3luY1N0b3JhZ2VKb2IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkdW1teUFzeW5jU3RvcmFnZUpvYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRTVDLE1BQU0sT0FBTyxvQkFBb0I7SUFDN0I7UUFFQSxZQUFPLEdBQUcsQ0FBQyxPQUFZLEVBQUUsRUFBRTtZQUN2QixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO1lBQ2xDLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN4RCxZQUFZLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDO2lCQUNwQyxJQUFJLENBQUMsQ0FBQyxVQUFlLEVBQUUsRUFBRTtnQkFDdEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxVQUFVLEtBQUssU0FBUyxJQUFJLFVBQVUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNuSSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQzFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDO2dCQUMzQixZQUFZLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNwRSxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQTtJQWJlLENBQUM7SUFlVCxvQkFBb0IsQ0FBQyxTQUFpQjtRQUMxQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7Q0FDSiJ9