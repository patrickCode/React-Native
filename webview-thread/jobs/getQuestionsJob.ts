import { AsyncStorage } from "react-native";
import { CacheLogger } from '../data/cache.logger';
import { ProxyService } from "../data/httpService";

export class GetQuestion {
    Execute = async (payload): Promise<void> => {
        CacheLogger.Log("[Get Questions Job] Job started");
        let proxyService = new ProxyService();
        let url = "https://questhunt.azurewebsites.net/api/questions";
        await proxyService.Get(url)
            .then(async (questions) => {
                CacheLogger.Log("[Get Questions Job] Data receied");
                await AsyncStorage.setItem("questions", JSON.stringify(questions));
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
            });
            CacheLogger.Log("[Get Questions Job] Job Completed");
    }
}
