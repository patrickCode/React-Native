var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage, FlatList, AppRegistry } from 'react-native';
import { ForegrounScheduler } from './foreground.scheduler';
export default class App extends Component {
    constructor(props) {
        super(props);
        this.foregroundScheduler = new ForegrounScheduler();
        this.state = {
            "questions": [],
            "logs": [],
            "dummyData": "",
            "updateStatus": "Initalized"
        };
        this.Initialize();
    }
    Initialize() {
        this.foregroundScheduler.Intialize()
            .then(() => {
            this.foregroundScheduler.Start(60000);
            this.startChecking();
        }).catch((err) => {
            //alert("There was error in initializing the foreground scheduler: " + JSON.stringify(err));
        });
    }
    updateQuestions() {
        return AsyncStorage.getItem("questions")
            .then((questionsStr) => {
            if (questionsStr) {
                let questions = JSON.parse(questionsStr);
                this.setState({ "questions": questions });
            }
        });
    }
    GetAllLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            let loggedString = yield AsyncStorage.getItem("Logs");
            if (loggedString === undefined || loggedString === null)
                return [];
            return JSON.parse(loggedString);
        });
    }
    DeleteLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            yield AsyncStorage.setItem("Logs", null);
        });
    }
    updateLogs() {
        return this.GetAllLogs()
            .then((logs) => {
            this.setState({ "logs": logs });
        });
    }
    deleteLogs() {
        return this.DeleteLogs()
            .then(() => {
            this.updateLogs();
        });
    }
    udpateDummyData() {
        AsyncStorage.getItem("Dummy-Cache-Entry")
            .then((dummyData) => {
            this.setState({ "dummyData": dummyData });
        });
    }
    startChecking() {
        let check = new Promise((res, rej) => {
            this.checkData()
                .then(() => {
                setTimeout(check, 120000);
            });
        });
        setTimeout(check, 10);
    }
    checkData() {
        this.setState({
            "updateStatus": "Updating"
        });
        return Promise.all([this.updateLogs(), this.updateQuestions(), this.udpateDummyData()])
            .then((result) => {
            this.setState({
                "updateStatus": "Data Updated last at " + new Date().toString()
            });
            alert("Data refreshed");
        });
    }
    render() {
        return (<View style={styles.container}>
        <Text style={styles.heading}>Job Pool</Text>

        <Text style={styles.instructions}>Logs</Text>
        <FlatList data={this.state.logs} keyExtractor={(item) => item.Date} renderItem={({ item }) => <Text>{item.Message}</Text>}/>

        <Text style={styles.instructions}>Questions</Text>
        <FlatList data={this.state.questions} keyExtractor={(item) => item.id} renderItem={({ item }) => <Text>{item.value}</Text>}/>
      </View>);
    }
}
export const registerComponent = () => {
    AppRegistry.registerComponent("jobpool", () => App);
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    heading: {
        fontSize: 30,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBYSxZQUFZLEVBQXNCLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDMUgsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFHNUQsTUFBTSxDQUFDLE9BQU8sT0FBTyxHQUFJLFNBQVEsU0FBcUI7SUFHcEQsWUFBWSxLQUFLO1FBQ2YsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsS0FBSyxHQUFHO1lBQ1gsV0FBVyxFQUFFLEVBQUU7WUFDZixNQUFNLEVBQUUsRUFBRTtZQUNWLFdBQVcsRUFBRSxFQUFFO1lBQ2YsY0FBYyxFQUFFLFlBQVk7U0FDN0IsQ0FBQTtRQUNELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsVUFBVTtRQUNSLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUU7YUFDakMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNULElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2YsNEZBQTRGO1FBQzlGLENBQUMsQ0FBQyxDQUFBO0lBRU4sQ0FBQztJQUVELGVBQWU7UUFDYixPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO2FBQ3JDLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFO1lBQ3JCLElBQUksWUFBWSxFQUFFO2dCQUNoQixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUE7YUFDMUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFSyxVQUFVOztZQUNkLElBQUksWUFBWSxHQUFHLE1BQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0RCxJQUFJLFlBQVksS0FBSyxTQUFTLElBQUksWUFBWSxLQUFLLElBQUk7Z0JBQ3JELE9BQU8sRUFBRSxDQUFDO1lBQ1osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBZSxDQUFDO1FBQ2hELENBQUM7S0FBQTtJQUVLLFVBQVU7O1lBQ2QsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMzQyxDQUFDO0tBQUE7SUFFRCxVQUFVO1FBQ1IsT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFO2FBQ3JCLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFVBQVU7UUFDUixPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUU7YUFDckIsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNULElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCxlQUFlO1FBQ2IsWUFBWSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQzthQUN0QyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsYUFBYTtRQUNYLElBQUksS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ25DLElBQUksQ0FBQyxTQUFTLEVBQUU7aUJBQ2IsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDVCxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDSCxVQUFVLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNaLGNBQWMsRUFBRSxVQUFVO1NBQzNCLENBQUMsQ0FBQztRQUNILE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7YUFDcEYsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDZixJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNaLGNBQWMsRUFBRSx1QkFBdUIsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTthQUNoRSxDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCxNQUFNO1FBQ0osT0FBTyxDQUNMLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FDNUI7UUFBQSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLElBQUksQ0FFM0M7O1FBQUEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQzVDO1FBQUEsQ0FBQyxRQUFRLENBQ1AsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FDdEIsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDdkMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUd4RDs7UUFBQSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksQ0FDakQ7UUFBQSxDQUFDLFFBQVEsQ0FDUCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUMzQixZQUFZLENBQUMsQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNyQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBRXhEO01BQUEsRUFBRSxJQUFJLENBQUMsQ0FDUixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsR0FBRyxFQUFFO0lBQ3BDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEQsQ0FBQyxDQUFBO0FBRUQsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUMvQixTQUFTLEVBQUU7UUFDVCxJQUFJLEVBQUUsQ0FBQztRQUNQLGNBQWMsRUFBRSxRQUFRO1FBQ3hCLFVBQVUsRUFBRSxRQUFRO1FBQ3BCLGVBQWUsRUFBRSxTQUFTO0tBQzNCO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsUUFBUSxFQUFFLEVBQUU7UUFDWixTQUFTLEVBQUUsUUFBUTtRQUNuQixNQUFNLEVBQUUsRUFBRTtLQUNYO0lBQ0QsWUFBWSxFQUFFO1FBQ1osU0FBUyxFQUFFLFFBQVE7UUFDbkIsS0FBSyxFQUFFLFNBQVM7UUFDaEIsWUFBWSxFQUFFLENBQUM7S0FDaEI7Q0FDRixDQUFDLENBQUMifQ==