var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, TouchableHighlight, FlatList, AppRegistry } from 'react-native';
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
    CheckData(timeout = 25000) {
        return __awaiter(this, void 0, void 0, function* () {
            let probe = 1000;
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
        <Text style={styles.welcome}>React Native Workers</Text>
        <TextInput placeholder="Enter page number" keyboardType="number-pad" onChange={this.onPageNumberChange.bind(this)}/>
        <TouchableHighlight onPress={this.queueJob.bind(this)}>
          <Text>Queue new Job</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.scheduleSync.bind(this)}>
          <Text>Start BG Sync</Text>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDMUgsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNqQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRzlDLE1BQU0sT0FBTyxXQUFZLFNBQVEsU0FBcUI7SUFNcEQsWUFBWSxLQUFLO1FBQ2YsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBTlAsc0JBQWlCLEdBQVcsQ0FBQyxDQUFDO1FBQzlCLFVBQUssR0FBVSxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQzNCLFdBQU0sR0FBbUIsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hELG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBbUNoQyx1QkFBa0IsR0FBRyxDQUFDLEtBQVUsRUFBUSxFQUFFO1lBQ2hELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztRQUNsRCxDQUFDLENBQUE7UUFFTyxpQkFBWSxHQUFHLEdBQVMsRUFBRTtZQUNoQyxJQUFJLElBQUksQ0FBQyxjQUFjO2dCQUNyQixPQUFPO1lBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7aUJBQ3BCLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7WUFDN0IsQ0FBQyxDQUFD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