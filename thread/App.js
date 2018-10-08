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
BackgroundTask.define(() => __awaiter(this, void 0, void 0, function* () {
    yield CacheLogger.Log("[Dummy Storage BG Job]: Job Started");
    let text = "Cache updated in the background";
    yield AsyncStorage.getItem("Dummy-BG-Cache-Entry")
        .then((cachedData) => __awaiter(this, void 0, void 0, function* () {
        CacheLogger.Log("[Dummy BG Storage Job]: Cache updating");
        let data = (cachedData !== undefined && cachedData !== null) ? JSON.parse(cachedData) : { timestamp: null, version: 0, text: "" };
        data.timestamp = new Date().toUTCString();
        data.version = data.version + 1;
        data.text = text;
        yield AsyncStorage.setItem("Dummy-BG-Cache-Entry", JSON.stringify(data));
        CacheLogger.Log("[Dummy Storage BG Job]: Cache updated");
    }));
    yield CacheLogger.Log("[Dummy Storage BG Job]: Job completed");
    BackgroundTask.finish();
}));
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
        this.checkBgStatus();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFlLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbEQsT0FBTyxjQUFjLE1BQU0sOEJBQThCLENBQUM7QUFFMUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFTLEVBQUU7SUFDL0IsTUFBTSxXQUFXLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7SUFDN0QsSUFBSSxJQUFJLEdBQUcsaUNBQWlDLENBQUM7SUFDN0MsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDO1NBQy9DLElBQUksQ0FBQyxDQUFPLFVBQWUsRUFBRSxFQUFFO1FBQzlCLFdBQVcsQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUMsQ0FBQztRQUMxRCxJQUFJLElBQUksR0FBRyxDQUFDLFVBQVUsS0FBSyxTQUFTLElBQUksVUFBVSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDbEksSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FB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