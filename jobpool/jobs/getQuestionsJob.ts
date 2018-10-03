import { AsyncStorage } from "react-native";

export class GetQuestion {
    Execute = (payload) => {
        let proxyService = new ProxyService();
        let url = "https://questhunt.azurewebsites.net/api/questions";

        proxyService.Get(url)
            .then((questions) => {
                AsyncStorage.setItem("questions", JSON.stringify(questions));

                // AsyncStorage.getItem("Questions")
                //     .then((cachedQuestions) => {
                //         AsyncStorage.setItem("questions", cachedQuestions);
                //         if (cachedQuestions) {
                //             if (cachedQuestions !== JSON.stringify(questions)) {
                //                 AsyncStorage.setItem("questions", cachedQuestions);
                //             }
                //         }
                //     });
            })
            .catch((err) => {

            })
    }
}

export class ProxyService {
    
    async Get(url): Promise<any> {
        let response = await fetch(url);
        let responseObj = await response.json();
        return responseObj;
    }

    async Post(url): Promise<any> {
        throw new Error("Not Implemented");
    }
}