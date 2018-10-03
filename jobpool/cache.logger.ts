import { AsyncStorage } from "react-native";

export class CacheLogger {
    static async Log(message: string): Promise<void> {
        let logMessage = {
            "Message": message,
            "Date": new Date().toString()
        };
        let loggedString = await AsyncStorage.getItem("Logs");
        if (loggedString === undefined || loggedString === null) {
            let logData = [logMessage];
            loggedString = JSON.stringify(logData);
        } else {
            let logData = JSON.parse(loggedString) as Array<any>;
            logData.push(logMessage);
            loggedString = JSON.stringify(logData);
        }
        await AsyncStorage.setItem("Log", loggedString);
    }

    static async GetAllLogs(): Promise<Array<any>> {
        let loggedString = await AsyncStorage.getItem("Logs");
        if (loggedString === undefined || loggedString === null)
            return [];
        return JSON.parse(loggedString) as Array<any>;
    }

    static async DeleteLogs(): Promise<void> {
        await AsyncStorage.setItem("Logs", null);
    }
}