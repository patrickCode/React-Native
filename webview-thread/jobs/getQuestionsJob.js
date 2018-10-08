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
import { ProxyService } from "../data/httpService";
export class GetQuestion {
    constructor() {
        this.Execute = (payload) => __awaiter(this, void 0, void 0, function* () {
            CacheLogger.Log("[Get Questions Job] Job started");
            let proxyService = new ProxyService();
            let url = "https://questhunt.azurewebsites.net/api/questions";
            yield proxyService.Get(url)
                .then((questions) => __awaiter(this, void 0, void 0, function* () {
                CacheLogger.Log("[Get Questions Job] Data receied");
                yield AsyncStorage.setItem("questions", JSON.stringify(questions));
                CacheLogger.Log("[Get Questions Job] Data updated in cache");
                // AsyncStorage.getItem("Questions")
                //     .then((cachedQuestions) => {
                //         AsyncStorage.setItem("questions", cachedQuestions);
                //         if (cachedQuestions) {
                //             if (cachedQuestions !== JSON.stringify(questions)) {
                //                 AsyncStorage.setItem("questions", cachedQuestions);
                //             }
                //         }
                //     });
            }));
            CacheLogger.Log("[Get Questions Job] Job Completed");
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UXVlc3Rpb25zSm9iLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2V0UXVlc3Rpb25zSm9iLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM1QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRW5ELE1BQU0sT0FBTyxXQUFXO0lBQXhCO1FBQ0ksWUFBTyxHQUFHLENBQU8sT0FBTyxFQUFpQixFQUFFO1lBQ3ZDLFdBQVcsQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQztZQUNuRCxJQUFJLFlBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1lBQ3RDLElBQUksR0FBRyxHQUFHLG1EQUFtRCxDQUFDO1lBQzlELE1BQU0sWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7aUJBQ3RCLElBQUksQ0FBQyxDQUFPLFNBQVMsRUFBRSxFQUFFO2dCQUN0QixXQUFXLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7Z0JBQ3BELE1BQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNuRSxXQUFXLENBQUMsR0FBRyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7Z0JBRTdELG9DQUFvQztnQkFDcEMsbUNBQW1DO2dCQUNuQyw4REFBOEQ7Z0JBQzlELGlDQUFpQztnQkFDakMsbUVBQW1FO2dCQUNuRSxzRUFBc0U7Z0JBQ3RFLGdCQUFnQjtnQkFDaEIsWUFBWTtnQkFDWixVQUFVO1lBQ2QsQ0FBQyxDQUFBLENBQUMsQ0FBQztZQUNILFdBQVcsQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUM3RCxDQUFDLENBQUEsQ0FBQTtJQUNMLENBQUM7Q0FBQSJ9