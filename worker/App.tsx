import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, TouchableHighlight, FlatList, AppRegistry } from 'react-native';
import { Queue } from './queues';
import { BackgroundSync } from './background';

type Props = {};
export class Application extends Component<Props, any> {
  private currentPageNumber: number = 1;
  private queue: Queue = new Queue();
  private bgSync: BackgroundSync = new BackgroundSync(this.queue);
  private _isBgSyncSetup: boolean = false;

  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      queueState: "No job queued",
      queueNumber: 0,
    }
    this.queue.Init()
      .then(() => {
        this.queue.CreateProcessingJob()
          .then(() => {
            this.state = {
              questions: [],
              queueState: "No job queued",
              queueNumber: 0,
              bgState: "No status"
            };
          });
      });
      AsyncStorage.getItem("BackgroundJobStatus")
        .then((state) => {
          this.setState({
            bgState: state 
          })
        });
        AsyncStorage.getItem("questionList")
        .then((questions) => {
          this.setState({
            questions: JSON.parse(questions),
          });
        });
  }

  private onPageNumberChange = (event: any): void => {
    this.currentPageNumber = event.nativeEvent.text;
  }

  private scheduleSync = (): void => {
    if (this._isBgSyncSetup)
      return;
    this.bgSync.SetupSync()
      .then(() => {
        this.bgSync.Schedule();
        this._isBgSyncSetup = true;
      });
  }

  private queueJob = (): void => {
    this.setState({
      queueState: "New job queued"
    });
    AsyncStorage.setItem("OperationInProgress", "True")
      .then(async () => {
        this.queue.AddJob(this.currentPageNumber, true);
        await this.CheckData(25000);
      });
  }

  private queueCompleted = (): void => {
    var questionListPromise = AsyncStorage.getItem("questionList");
    var randomSeedPromise = AsyncStorage.getItem("randomSeed");

    Promise.all([questionListPromise, randomSeedPromise])
      .then((values) => {
        let questions = values[0];
        let randomSeed = [1];
        this.setState({
          questions: JSON.parse(questions),
          queueState: "Job Completed",
          queueNumber: randomSeed
        });
      });
  }

  private async CheckData(timeout: number = 25000) {
    let probe = 1000;

    let waitForData = (timeout: number) => {
      new Promise((resolve, reject) => {
        var check = () => {
          AsyncStorage.getItem("OperationInProgress")
            .then((operationStatus) => {
              if (operationStatus === "False") {
                this.queueCompleted();
                resolve("Completed")
              } else if ((timeout -= probe) < 0) {
                this.setState({
                  queueState: "Queue operation timeout"
                });
                reject("Not received");
              } else {
                setTimeout(check, probe);
              }
            });
        };
        setTimeout(check, probe);
      });
    }
    return waitForData(timeout);
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>React Native Workers</Text>
        <TextInput placeholder="Enter page number" keyboardType="number-pad" onChange={this.onPageNumberChange.bind(this)} />
        <TouchableHighlight onPress={this.queueJob.bind(this)}>
          <Text>Queue new Job</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.scheduleSync.bind(this)}>
          <Text>Start BG Sync</Text>
        </TouchableHighlight>
        <Text>Queue State - {this.state.queueState}</Text>
        <Text>Queue Seed - {this.state.queueNumber}</Text>
        <Text>BG Status - {this.state.bgState}</Text>
        <FlatList
          data={this.state.questions}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => <Text>{item.value}</Text>}
        />
      </View>
    );
  }
}
export const registerComponent = () => {
  AppRegistry.registerComponent("worker", () => Application);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
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
