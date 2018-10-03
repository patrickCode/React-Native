import { self } from 'react-native-threads';
import { AsyncStorage } from 'react-native';
import { SampleObjTranslator } from './data/translators/sampleObj.translator';
import { SampleObjSchema } from './data/job.realm.schema';
import { RealmDatabase } from './data/realm.database';
let count = 0;
self.onmessage = message => {
    count++;
    let command = JSON.parse(message);
    if (command.type == "CACHE") {
        AsyncStorage.setItem("Some_Data", `[Cache] Message #${count} from worker thread!`)
            .then(() => {
            self.postMessage(`${count} Cache updated`);
        });
    }
    else if (command.type == "DATABASE") {
        self.postMessage(`Trying to add data in database`);
        try {
            let config = {
                DatabaseName: "SampleObj",
                Schemas: [SampleObjSchema],
                SchemaVersion: 0,
                Translator: new SampleObjTranslator()
            };
            let database = new RealmDatabase(config);
            database.Connect()
                .then(() => {
                let obj = {
                    Id: "Device Thread: " + count.toString(),
                    Name: "Some alternate name"
                };
                try {
                    database.Upsert(obj)
                        .then(() => {
                        self.postMessage(`${count} Data added`);
                    })
                        .catch((err) => {
                        self.postMessage(JSON.stringify(err));
                    });
                }
                catch (err) {
                    self.postMessage(JSON.stringify(err));
                }
            });
        }
        catch (err) {
            self.postMessage(`An error ocurred - ${JSON.stringify(err)}`);
        }
    }
};
// else if (command.type == "DATABASE") {
//   self.postMessage(`Trying to add to DB 301`);
//   try {
//     let config: RealmDbConfiguration = {
//       DatabaseName: "SampleObj",
//       Schemas: [SampleObjSchema],
//       SchemaVersion: 0,
//       Translator: new SampleObjTranslator()
//     }
//     self.postMessage(`Trying to add to DB 2`);
//     let database = new RealmDatabase(config);
//     self.postMessage(`Trying to add to DB 3`);
//     database.Connect()
//       .then(() => {
//         self.postMessage(`Trying to add to DB 4`);
//         let obj: SampleObj = {
//           Id: "Device Thread: 100",
//           Name: "Some alternate name"
//         }
//         self.postMessage(`Trying to add to DB 5`);
//         this.count++;
//         self.postMessage(`Trying to add to DB 6`);
//         try {
//           database.Upsert(obj)
//             .then(() => {
//               self.postMessage(`Trying to add to DB 7`);
//               self.postMessage(`${count} Data added`);
//               self.postMessage(`Trying to add to DB 8`);
//             })
//             .catch((err) => {
//               self.postMessage(`Trying to add to DB failed - 11`);
//               self.postMessage(JSON.stringify(err));
//               self.postMessage(`Trying to add to DB failed - 11`);
//             });
//         } catch (err) {
//           self.postMessage(`Trying to add to DB failed - 21`);
//           self.postMessage(JSON.stringify(err));
//           self.postMessage(`Trying to add to DB failed - 22`);
//         }
//       });
//   } catch (err) {
//     self.postMessage(`An error ocurred - ${JSON.stringify(err)}`);
//   }
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyLnRocmVhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndvcmtlci50aHJlYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFHNUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDOUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzFELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUd0RCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFFZCxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxFQUFFO0lBQ3pCLEtBQUssRUFBRSxDQUFDO0lBQ1IsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxFQUFFO1FBQzNCLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLG9CQUFvQixLQUFLLHNCQUFzQixDQUFDO2FBQy9FLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsS0FBSyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO0tBQ047U0FDSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksVUFBVSxFQUFFO1FBQ25DLElBQUksQ0FBQyxXQUFXLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUNuRCxJQUFJO1lBQ0YsSUFBSSxNQUFNLEdBQXlCO2dCQUNqQyxZQUFZLEVBQUUsV0FBVztnQkFDekIsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDO2dCQUMxQixhQUFhLEVBQUUsQ0FBQztnQkFDaEIsVUFBVSxFQUFFLElBQUksbUJBQW1CLEVBQUU7YUFDdEMsQ0FBQTtZQUNELElBQUksUUFBUSxHQUFHLElBQUksYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7aUJBQ2YsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDVCxJQUFJLEdBQUcsR0FBYztvQkFDbkIsRUFBRSxFQUFFLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUU7b0JBQ3hDLElBQUksRUFBRSxxQkFBcUI7aUJBQzVCLENBQUE7Z0JBQ0QsSUFBSTtvQkFDRixRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQzt5QkFDakIsSUFBSSxDQUFDLEdBQUcsRUFBRTt3QkFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsS0FBSyxhQUFhLENBQUMsQ0FBQztvQkFDMUMsQ0FBQyxDQUFDO3lCQUNELEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO3dCQUNiLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxDQUFDLENBQUMsQ0FBQztpQkFDTjtnQkFBQyxPQUFPLEdBQUcsRUFBRTtvQkFDWixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDdkM7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNOO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsV0FBVyxDQUFDLHNCQUFzQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUMvRDtLQUVGO0FBQ0gsQ0FBQyxDQUFBO0FBRUQseUNBQXlDO0FBQ3pDLGlEQUFpRDtBQUNqRCxVQUFVO0FBQ1YsMkNBQTJDO0FBQzNDLG1DQUFtQztBQUNuQyxvQ0FBb0M7QUFDcEMsMEJBQTBCO0FBQzFCLDhDQUE4QztBQUM5QyxRQUFRO0FBQ1IsaURBQWlEO0FBQ2pELGdEQUFnRDtBQUNoRCxpREFBaUQ7QUFDakQseUJBQXlCO0FBQ3pCLHNCQUFzQjtBQUN0QixxREFBcUQ7QUFDckQsaUNBQWlDO0FBQ2pDLHNDQUFzQztBQUN0Qyx3Q0FBd0M7QUFDeEMsWUFBWTtBQUNaLHFEQUFxRDtBQUNyRCx3QkFBd0I7QUFDeEIscURBQXFEO0FBQ3JELGdCQUFnQjtBQUNoQixpQ0FBaUM7QUFDakMsNEJBQTRCO0FBQzVCLDJEQUEyRDtBQUMzRCx5REFBeUQ7QUFDekQsMkRBQTJEO0FBQzNELGlCQUFpQjtBQUNqQixnQ0FBZ0M7QUFDaEMscUVBQXFFO0FBQ3JFLHVEQUF1RDtBQUN2RCxxRUFBcUU7QUFDckUsa0JBQWtCO0FBQ2xCLDBCQUEwQjtBQUMxQixpRUFBaUU7QUFDakUsbURBQW1EO0FBQ25ELGlFQUFpRTtBQUNqRSxZQUFZO0FBRVosWUFBWTtBQUNaLG9CQUFvQjtBQUNwQixxRUFBcUU7QUFDckUsTUFBTTtBQUVOLElBQUkifQ==