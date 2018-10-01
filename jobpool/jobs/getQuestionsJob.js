import { ProxyService } from "infra/proxy.service";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UXVlc3Rpb25zSm9iLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2V0UXVlc3Rpb25zSm9iLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRTVDLE1BQU0sT0FBTyxXQUFXO0lBQXhCO1FBQ0ksWUFBTyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDbEIsSUFBSSxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztZQUN0QyxJQUFJLEdBQUcsR0FBRyxtREFBbUQsQ0FBQztZQUU5RCxZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztpQkFDaEIsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBQ2hCLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFFN0Qsb0NBQW9DO2dCQUNwQyxtQ0FBbUM7Z0JBQ25DLDhEQUE4RDtnQkFDOUQsaUNBQWlDO2dCQUNqQyxtRUFBbUU7Z0JBQ25FLHNFQUFzRTtnQkFDdEUsZ0JBQWdCO2dCQUNoQixZQUFZO2dCQUNaLFVBQVU7WUFDZCxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFFZixDQUFDLENBQUMsQ0FBQTtRQUNWLENBQUMsQ0FBQTtJQUNMLENBQUM7Q0FBQSJ9