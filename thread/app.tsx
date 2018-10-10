import React, { Component } from 'react';
import { ForegrounScheduler } from './data/foreground.scheduler';
import { StyleSheet, Text, View, AsyncStorage, FlatList, AppRegistry, Button } from 'react-native';
import { CacheLogger } from './data/cache.logger';
import BackgroundTask from 'react-native-background-task';
import { BackgroundScheduler } from './data/background.scheduler';

// alert(BackgroundTask.define);

// BackgroundTask.define(async () => {
//   await CacheLogger.Log("[Dummy Storage BG Job]: Job Started");
//   let text = "Cache updated in the background";
//   await AsyncStorage.getItem("Dummy-BG-Cache-Entry")
//     .then(async (cachedData: any) => {
//       CacheLogger.Log("[Dummy BG Storage Job]: Cache updating");
//       let data = (cachedData !== undefined && cachedData !== null) ? JSON.parse(cachedData) : { timestamp: null, version: 0, text: "" };
//       data.timestamp = new Date().toUTCString();
//       data.version = data.version + 1;
//       data.text = text;
//       await AsyncStorage.setItem("Dummy-BG-Cache-Entry", JSON.stringify(data));
//       await CacheLogger.Log("[Dummy Storage BG Job]: Cache updated");
//     });
//   await CacheLogger.Log("[Dummy Storage BG Job]: Job completed");

//   BackgroundTask.finish();
// });

type Props = {};
export default class App extends Component<Props, any> {
  private foregroundScheduler: ForegrounScheduler;

  constructor(props) {
    super(props);
    this.foregroundScheduler = new ForegrounScheduler();
    this.state = {
      "questions": [],
      "logs": [],
      "dummyData": "",
      "dummyDataBG": "",
      "updateStatus": "Initalized"
    }
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

  async checkBgStatus() {
    const status = await BackgroundTask.statusAsync()

    if (status.available) {
      return
    }

    const reason = status.unavailableReason
    if (reason === BackgroundTask.UNAVAILABLE_DENIED) {
      alert("Please enable background Background App Refresh for this app")
    } else if (reason === BackgroundTask.UNAVAILABLE_RESTRICTED) {
      alert('Background tasks are restricted on your device');
    }
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
          this.setState({ "questions": questions })
        }
      });
  }

  async GetAllLogs(): Promise<Array<any>> {
    return CacheLogger.GetAllLogs();
  }

  async DeleteLogs(): Promise<void> {
    await AsyncStorage.setItem("Logs", null);
  }

  updateLogs() {
    return this.GetAllLogs()
      .then((logs) => {
        this.setState({ "logs": logs })
      });
  }

  deleteLogs() {
    return this.DeleteLogs()
      .then(() => {
        this.updateLogs();
      })
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
    }
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
        })
    } catch (Err) {
      alert("Err in checking 2");
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Job Pool</Text>
        <Button title="Check Data" onPress={() => {
          this.checkData();
        }} />

        {/* <Button title="Re-Run Foreground Job" onPress={() => {
          this.Initialize();
        }} /> */}

        <Button title="Delete Logs" onPress={() => {
          this.DeleteLogs();
        }} />

        <Text style={styles.instructions}>Status - {this.state.updateStatus}</Text>
        <Text style={styles.instructions}>Dummy Cache Data [FG] - {this.state.dummyData}</Text>
        <Text style={styles.instructions}>Dummy Cache Data [BG] - {this.state.dummyDataBG}</Text>

        <Text style={styles.instructions}>Logs</Text>
        <FlatList
          data={this.state.logs}
          keyExtractor={(item: any) => item.Date}
          renderItem={({ item }) => <Text>{item.Message}</Text>}
        />

        {/* <Text style={styles.instructions}>Questions</Text>
        <FlatList
          data={this.state.questions}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => <Text>{item.value}</Text>}
        /> */}
      </View>
    );
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
