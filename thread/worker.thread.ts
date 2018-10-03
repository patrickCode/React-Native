import { self } from 'react-native-threads';
import { AsyncStorage } from 'react-native';
import { MyData } from './dummyOp';
import { RealmDbConfiguration } from './data/database.interface';
import { SampleObjTranslator } from './data/translators/sampleObj.translator';
import { SampleObjSchema } from './data/job.realm.schema';
import { RealmDatabase } from './data/realm.database';
import { SampleObj } from './data/job.interface';

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
      let config: RealmDbConfiguration = {
        DatabaseName: "SampleObj",
        Schemas: [SampleObjSchema],
        SchemaVersion: 0,
        Translator: new SampleObjTranslator()
      }
      let database = new RealmDatabase(config);
      database.Connect()
        .then(() => {
          let obj: SampleObj = {
            Id: "Device Thread: " + count.toString(),
            Name: "Some alternate name"
          }
          try {
            database.Upsert(obj)
              .then(() => {
                self.postMessage(`${count} Data added`);
              })
              .catch((err) => {
                self.postMessage(JSON.stringify(err));
              });
          } catch (err) {
            self.postMessage(JSON.stringify(err));
          }
        });
    } catch (err) {
      self.postMessage(`An error ocurred - ${JSON.stringify(err)}`);
    }

  }
}

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