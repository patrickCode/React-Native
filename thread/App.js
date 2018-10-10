var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { Component } from 'react';
import { ForegrounScheduler } from './data/foreground.scheduler';
import { StyleSheet, Text, View, AsyncStorage, FlatList, Button } from 'react-native';
import { CacheLogger } from './data/cache.logger';
import BackgroundTask from 'react-native-background-task';
import { BackgroundScheduler } from './data/background.scheduler';
export default class App extends Component {
    constructor(props) {
        super(props);
        this.foregroundScheduler = new ForegrounScheduler();
        this.state = {
            "questions": [],
            "logs": [],
            "dummyData": "",
            "dummyDataBG": "",
            "updateStatus": "Initalized"
        };
        this.checkData = this.checkData.bind(this);
        this.DeleteLogs = this.DeleteLogs.bind(this);
    }
    Initialize() {
        this.foregroundScheduler.Intialize()
            .then(() => {
            this.foregroundScheduler.Start(35000);
            this.startChecking();
        });
    }
    InitializeBackgroundJob() {
        // BackgroundTask.schedule({
        //   period: 900
        // });
        BackgroundTask.schedule();
        var bgScheduler = new BackgroundScheduler();
        bgScheduler.Initialize()
            .then(() => {
            alert("BG scheduler has been initialized");
            this.checkBgStatus();
        });
    }
    checkBgStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield BackgroundTask.statusAsync();
            if (status.available) {
                return;
            }
            const reason = status.unavailableReason;
            if (reason === BackgroundTask.UNAVAILABLE_DENIED) {
                alert("Please enable background Background App Refresh for this app");
            }
            else if (reason === BackgroundTask.UNAVAILABLE_RESTRICTED) {
                alert('Background tasks are restricted on your device');
            }
        });
    }
    componentDidMount() {
        //this.Initialize();
        this.InitializeBackgroundJob();
    }
    componentWillUnmount() {
        if (this.foregroundScheduler)
            this.foregroundScheduler.TerminateWorker();
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
            return CacheLogger.GetAllLogs();
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
        return AsyncStorage.getItem("Dummy-Cache-Entry")
            .then((dummyData) => {
            this.setState({ "dummyData": dummyData });
        });
    }
    udpateBgDummyData() {
        return AsyncStorage.getItem("Dummy-BG-Cache-Entry")
            .then((dummyData) => {
            alert("Data for BG - " + dummyData);
            this.setState({ "dummyDataBG": dummyData });
        });
    }
    startChecking() {
        let check = () => {
            return new Promise((res, rej) => {
                this.checkData()
                    .then(() => {
                    setTimeout(check, 10000);
                });
            });
        };
        check();
    }
    checkData() {
        this.setState({
            "updateStatus": "Checking Data"
        });
        try {
            return Promise.all([this.updateLogs(), this.updateQuestions(), this.udpateBgDummyData(), this.udpateDummyData()])
                .then((result) => {
                this.setState({
                    "updateStatus": "Data Updated last at " + new Date().toString()
                });
            })
                .catch((err) => {
                alert("Err in checking");
            });
        }
        catch (Err) {
            alert("Err in checking 2");
        }
    }
    render() {
        return (<View style={styles.container}>
        <Text style={styles.heading}>Job Pool</Text>
        <Button title="Check Data" onPress={() => {
            this.checkData();
        }}/>

        

        <Button title="Delete Logs" onPress={() => {
            this.DeleteLogs();
        }}/>

        <Text style={styles.instructions}>Status - {this.state.updateStatus}</Text>
        <Text style={styles.instructions}>Dummy Cache Data [FG] - {this.state.dummyData}</Text>
        <Text style={styles.instructions}>Dummy Cache Data [BG] - {this.state.dummyDataBG}</Text>

        <Text style={styles.instructions}>Logs</Text>
        <FlatList data={this.state.logs} keyExtractor={(item) => item.Date} renderItem={({ item }) => <Text>{item.Message}</Text>}/>

        
      </View>);
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFlLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbEQsT0FBTyxjQUFjLE1BQU0sOEJBQThCLENBQUM7QUFDMUQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUF1QmxFLE1BQU0sQ0FBQyxPQUFPLE9BQU8sR0FBSSxTQUFRLFNBQXFCO0lBR3BELFlBQVksS0FBSztRQUNmLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7UUFDcEQsSUFBSSxDQUFDLEtBQUssR0FBRztZQUNYLFdBQVcsRUFBRSxFQUFFO1lBQ2YsTUFBTSxFQUFFLEVBQUU7WUFDVixXQUFXLEVBQUUsRUFBRTtZQUNmLGFBQWEsRUFBRSxFQUFFO1lBQ2pCLGNBQWMsRUFBRSxZQUFZO1NBQzdCLENBQUE7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELFVBQVU7UUFDUixJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFO2FBQ2pDLElBQUksQ0FBQyxHQUFH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