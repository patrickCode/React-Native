import { AsyncStorage } from "react-native";

export class DummyAsyncStorageJob {
    constructor() { }

    Execute = (payload: any) => {
        let maxNumber = payload.MaxNumber;
        let randomNumber = this.GenerateRandomNumber(maxNumber);
        AsyncStorage.getItem("Dummy-Cache-Entry")
            .then((cachedData: any) => {
                let data = (cachedData !== undefined && cachedData !== null) ? JSON.parse(cachedData) : { timestamp: null, version: 0, random: 0 };
                data.timestamp = new Date().toUTCString();
                data.version = data.version + 1;
                data.random = randomNumber;
                AsyncStorage.setItem("Dummy-Cache-Entry", JSON.stringify(data));
            });
    }

    private GenerateRandomNumber(maxNumber: number): number {
        return Math.floor(Math.random() * maxNumber);
    }
}