import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  AdSupportIOS
} from 'react-native';
import { Thread } from 'react-native-threads';
import { RealmDatabase } from './data/realm.database';
import { IDatabase, RealmDbConfiguration } from 'data/database.interface';
import { SampleObj } from 'data/job.interface';
import { SampleObjTranslator } from './data/translators/sampleObj.translator';
import { SampleObjSchema } from './data/job.realm.schema';

export default class App extends Component {
  state = { messages: [], cachedMessages: [] }

  constructor(props) {
    super(props);
    this.addNewObj = this.addNewObj.bind(this);
    this.showAllData = this.showAllData.bind(this);
  }

  workerThread = null;
  database: IDatabase<SampleObj> = null;
  count: number = 1;

  componentDidMount() {
    this.workerThread = new Thread('./worker.thread.js');
    this.workerThread.onmessage = this.handleMessage;

    
    let config: RealmDbConfiguration = {
      DatabaseName: "SampleObj",
      Schemas: [SampleObjSchema],
      SchemaVersion: 0,
      Translator: new SampleObjTranslator()
    }
    this.database = new RealmDatabase(config);
    this.database.Connect()
      .then(() => {
        alert("Database is ready");
      });
  }

  componentWillUnmount() {
    this.workerThread.terminate();
    this.workerThread = null;
  }

  handleMessage = message => {
    this.setState({messages: [this.state.messages, message]});
    AsyncStorage.getItem("Some_Data")
      .then((data) => {
        this.setState({cachedMessages: [this.state.cachedMessages, data]});
      });
  }

  addNewObj() {
    try {
      alert("Here");
      let obj: SampleObj = {
        Id: "UI Thread: " + this.count.toString(),
        Name: "Some random name"
      }
      this.count++;
      this.database.Upsert(obj)
        .then(() => {
          alert("Data has been added");
        });
    } catch (eee) {
      alert(JSON.stringify(eee));
      throw eee;
    }
    
  }

  showAllData() {
    this.database.GetAll()
      .then((data) => {
        alert(JSON.stringify(data))
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native Threads!
        </Text>

        <Button title="Update cache from thread" onPress={() => {
          this.workerThread.postMessage(JSON.stringify({type: 'CACHE'}))
        }} />
        <Button title="Add data from thread" onPress={() => {
          this.workerThread.postMessage(JSON.stringify({type: 'DATABASE'}))
        }} />

        <Button title="Add a new object" onPress={() => {
          this.addNewObj();
        }} />

        <Button title="Show all objects" onPress={() => {
          this.showAllData();
        }} />

        <View>
          <Text>Messages:</Text>
          {this.state.messages.map((message, i) => <Text key={i}>{message}</Text>)}

          <Text>Cached Messages:</Text>
          {this.state.cachedMessages.map((message, i) => <Text key={i}>{message}</Text>)}
        </View>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});