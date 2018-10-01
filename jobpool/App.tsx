import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, TouchableHighlight, FlatList, AppRegistry } from 'react-native';
import { ForegrounScheduler } from './infra/scheduler/foreground.scheduler';
import { CacheLogger } from 'infra/cache.logger';

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
      "updateStatus": "Initalized"
    }
    this.Initialize();
  }

  Initialize() {
    this.foregroundScheduler.Intialize()
      .then(() => {
        this.foregroundScheduler.Start(60000);
        this.startChecking();
      }).catch ((err) => {
        alert("There was error in initializing the foreground scheduler");
      })

  }

  updateQuestions() {
    return AsyncStorage.getItem("questions")
      .then((questionsStr) => {
        if (questionsStr) {
          let questions = JSON.parse(questionsStr);
          this.setState({"questions": questions})
        }
      });
  }

  updateLogs() {
    return CacheLogger.GetAllLogs()
      .then((logs) => {
          this.setState({"logs": logs})
      });
  }

  deleteLogs() {
    return CacheLogger.DeleteLogs()
      .then(() => {
        this.updateLogs();
      })
  }

  udpateDummyData() {
    AsyncStorage.getItem("Dummy-Cache-Entry")
    .then((dummyData) => {
      this.setState({"dummyData": dummyData});
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
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Job Pool</Text>
        
        <Text style={styles.instructions}>Logs</Text>
        <FlatList
          data={this.state.logs}
          keyExtractor={(item: any) => item.Date}
          renderItem={({ item }) => <Text>{item.Message}</Text>}
        />

        <Text style={styles.instructions}>Questions</Text>
        <FlatList
          data={this.state.questions}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => <Text>{item.value}</Text>}
        />
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
