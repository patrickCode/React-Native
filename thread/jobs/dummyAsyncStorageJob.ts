import { AsyncStorage } from "react-native";
import { CacheLogger } from '../data/cache.logger';

export class DummyAsyncStorageJob {
    constructor() { }

    Execute = async (payload: any): Promise<void> => {
        await CacheLogger.Log("[Dummy Storage Job]: Job Started");
        let maxNumber = payload.MaxNumber;
        let text = payload.Text ? payload.Text : "";
        let randomNumber = this.GenerateRandomNumber(maxNumber);
        await AsyncStorage.getItem("Dummy-Cache-Entry")
            .then(async (cachedData: any) => {
                CacheLogger.Log("[Dummy Storage Job]: Cache updating");
                let data = (cachedData !== undefined && cachedData !== null) ? JSON.parse(cachedData) : { timestamp: null, version: 0, random: 0, text: "" };
                data.timestamp = new Date().toUTCString();
                data.version = data.version + 1;
                data.random = randomNumber;
                data.text = text;
                await AsyncStorage.setItem("Dummy-Cache-Entry", JSON.stringify(data));
                CacheLogger.Log("[Dummy Storage Job]: Cache updated");
            });
        await CacheLogger.Log("[Dummy Storage Job]: Job completed");
    }

    private GenerateRandomNumber(maxNumber: number): number {
        return Math.floor(Math.random() * maxNumber);
    }
}