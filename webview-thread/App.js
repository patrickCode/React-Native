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
    InitializeBackgrounJob() {
        BackgroundTask.schedule({
            period: 900
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFlLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbEQsT0FBTyxjQUFjLE1BQU0sOEJBQThCLENBQUE7QUFFekQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFTLEVBQUU7SUFDL0IsTUFBTSxXQUFXLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7SUFDN0QsSUFBSSxJQUFJLEdBQUcsaUNBQWlDLENBQUM7SUFDN0MsTUFBTSxZQUFZLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDO1NBQy9DLElBQUksQ0FBQyxDQUFPLFVBQWUsRUFBRSxFQUFFO1FBQzlCLFdBQVcsQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUMsQ0FBQztRQUMxRCxJQUFJLElBQUksR0FBRyxDQUFDLFVBQVUsS0FBSyxTQUFTLElBQUksVUFBVSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDbEksSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FB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