var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage, TouchableHighlight, FlatList, AppRegistry } from 'react-native';
import { Queue } from './queues';
import { BackgroundSync } from './background';
export class Application extends Component {
    constructor(props) {
        super(props);
        this.currentPageNumber = 1;
        this.queue = new Queue();
        this.bgSync = new BackgroundSync(this.queue);
        this._isBgSyncSetup = false;
        this.onPageNumberChange = (event) => {
            this.currentPageNumber = event.nativeEvent.text;
        };
        this.scheduleSync = () => {
            if (this._isBgSyncSetup)
                return;
            this.bgSync.SetupSync()
                .then(() => {
                this.bgSync.Schedule();
                this._isBgSyncSetup = true;
            });
        };
        this.queueJob = () => {
            this.setState({
                queueState: "New job queued"
            });
            AsyncStorage.setItem("OperationInProgress", "True")
                .then(() => __awaiter(this, void 0, void 0, function* () {
                this.queue.AddJob(this.currentPageNumber, true);
                yield this.CheckData(25000);
            }));
        };
        this.queueCompleted = () => {
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
        };
        this.state = {
            questions: [],
            queueState: "No job queued",
            queueNumber: 0,
        };
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
            });
        });
        AsyncStorage.getItem("questionList")
            .then((questions) => {
            this.setState({
                questions: JSON.parse(questions),
            });
        });
    }
    showDummyBgJobStatus() {
        AsyncStorage.getItem("dummyJobStatus")
            .then((status) => {
            alert(status);
        });
    }
    showBgStatus() {
        this.bgSync.CheckStatus();
    }
    CheckData(timeout = 25000) {
        return __awaiter(this, void 0, void 0, function* () {
            let probe = 200;
            let waitForData = (timeout) => {
                new Promise((resolve, reject) => {
                    var check = () => {
                        AsyncStorage.getItem("OperationInProgress")
                            .then((operationStatus) => {
                            if (operationStatus === "False") {
                                this.queueCompleted();
                                resolve("Completed");
                            }
                            else if ((timeout -= probe) < 0) {
                                this.setState({
                                    queueState: "Queue operation timeout"
                                });
                                reject("Not received");
                            }
                            else {
                                setTimeout(check, probe);
                            }
                        });
                    };
                    setTimeout(check, probe);
                });
            };
            return waitForData(timeout);
        });
    }
    render() {
        return (<View style={styles.container}>
        <Text style={styles.welcome}>React Native Workers (BG and Foreground Sync)</Text>
        
        <TouchableHighlight onPress={this.queueJob.bind(this)}>
          <Text>Queue new Job</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.scheduleSync.bind(this)}>
          <Text>Start BG Sync</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.showDummyBgJobStatus.bind(this)}>
          <Text>Show BG Status of Dummy Jobs</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.showBgStatus.bind(this)}>
          <Text>Check BG Status</Text>
        </TouchableHighlight>
        <Text>Queue State - {this.state.queueState}</Text>
        <Text>Queue Seed - {this.state.queueNumber}</Text>
        <Text>BG Status - {this.state.bgState}</Text>

        <FlatList data={this.state.questions} keyExtractor={(item) => item.id} renderItem={({ item }) => <Text>{item.value}</Text>}/>
      </View>);
    }
}
export const registerComponent = () => {
    AppRegistry.registerComponent("worker", () => Application);
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBYSxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUMxSCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ2pDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFHOUMsTUFBTSxPQUFPLFdBQVksU0FBUSxTQUFxQjtJQU1wRCxZQUFZLEtBQUs7UUFDZixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFOUCxzQkFBaUIsR0FBVyxDQUFDLENBQUM7UUFDOUIsVUFBSyxHQUFVLElBQUksS0FBSyxFQUFFLENBQUM7UUFDM0IsV0FBTSxHQUFtQixJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEQsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFtQ2hDLHVCQUFrQixHQUFHLENBQUMsS0FBVSxFQUFRLEVBQUU7WUFDaEQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1FBQ2xELENBQUMsQ0FBQTtRQUVPLGlCQUFZLEdBQUcsR0FBUyxFQUFFO1lBQ2hDLElBQUksSUFBSSxDQUFDLGNBQWM7Z0JBQ3JCLE9BQU87WUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtpQkFDcEIsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN2QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztZQUM3QixDQUFDLENBQUMsQ0FBQztRQUNQ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