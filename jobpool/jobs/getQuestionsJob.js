var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AsyncStorage } from "react-native";
export class GetQuestion {
    constructor() {
        this.Execute = (payload) => {
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
            });
        };
    }
}
export class ProxyService {
    Get(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield fetch(url);
            let responseObj = yield response.json();
            return responseObj;
        });
    }
    Post(url) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not Implemented");
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UXVlc3Rpb25zSm9iLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2V0UXVlc3Rpb25zSm9iLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUU1QyxNQUFNLE9BQU8sV0FBVztJQUF4QjtRQUNJLFlBQU8sR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ2xCLElBQUksWUFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7WUFDdEMsSUFBSSxHQUFHLEdBQUcsbURBQW1ELENBQUM7WUFFOUQsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7aUJBQ2hCLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO2dCQUNoQixZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBRTdELG9DQUFvQztnQkFDcEMsbUNBQW1DO2dCQUNuQyw4REFBOEQ7Z0JBQzlELGlDQUFpQztnQkFDakMsbUVBQW1FO2dCQUNuRSxzRUFBc0U7Z0JBQ3RFLGdCQUFnQjtnQkFDaEIsWUFBWTtnQkFDWixVQUFVO1lBQ2QsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBRWYsQ0FBQyxDQUFDLENBQUE7UUFDVixDQUFDLENBQUE7SUFDTCxDQUFDO0NBQUE7QUFFRCxNQUFNLE9BQU8sWUFBWTtJQUVmLEdBQUcsQ0FBQyxHQUFHOztZQUNULElBQUksUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLElBQUksV0FBVyxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3hDLE9BQU8sV0FBVyxDQUFDO1FBQ3ZCLENBQUM7S0FBQTtJQUVLLElBQUksQ0FBQyxHQUFHOztZQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUN2QyxDQUFDO0tBQUE7Q0FDSiJ9