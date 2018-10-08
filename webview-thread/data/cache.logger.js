var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AsyncStorage } from "react-native";
export class CacheLogger {
    static Log(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let logMessage = {
                "Message": message,
                "Date": new Date().toString()
            };
            let loggedString = yield AsyncStorage.getItem("Logs");
            if (loggedString === undefined || loggedString === null) {
                let logData = [logMessage];
                loggedString = JSON.stringify(logData);
            }
            else {
                let logData = JSON.parse(loggedString);
                logData.push(logMessage);
                loggedString = JSON.stringify(logData);
            }
            yield AsyncStorage.setItem("Logs", loggedString);
        });
    }
    static GetAllLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            let loggedString = yield AsyncStorage.getItem("Logs");
            if (loggedString === undefined || loggedString === null)
                return [];
            return JSON.parse(loggedString);
        });
    }
    static DeleteLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            yield AsyncStorage.setItem("Logs", null);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUubG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2FjaGUubG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUU1QyxNQUFNLE9BQU8sV0FBVztJQUNwQixNQUFNLENBQU8sR0FBRyxDQUFDLE9BQWU7O1lBQzVCLElBQUksVUFBVSxHQUFHO2dCQUNiLFNBQVMsRUFBRSxPQUFPO2dCQUNsQixNQUFNLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUU7YUFDaEMsQ0FBQztZQUNGLElBQUksWUFBWSxHQUFHLE1BQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0RCxJQUFJLFlBQVksS0FBSyxTQUFTLElBQUksWUFBWSxLQUFLLElBQUksRUFBRTtnQkFDckQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDM0IsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDMUM7aUJBQU07Z0JBQ0gsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQWUsQ0FBQztnQkFDckQsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDekIsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDMUM7WUFDRCxNQUFNLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3JELENBQUM7S0FBQTtJQUVELE1BQU0sQ0FBTyxVQUFVOztZQUNuQixJQUFJLFlBQVksR0FBRyxNQUFNLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEQsSUFBSSxZQUFZLEtBQUssU0FBUyxJQUFJLFlBQVksS0FBSyxJQUFJO2dCQUNuRCxPQUFPLEVBQUUsQ0FBQztZQUNkLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQWUsQ0FBQztRQUNsRCxDQUFDO0tBQUE7SUFFRCxNQUFNLENBQU8sVUFBVTs7WUFDbkIsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3QyxDQUFDO0tBQUE7Q0FDSiJ9