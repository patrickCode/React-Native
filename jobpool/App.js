import React, { Component } from 'react';
import { StyleSheet, Text, View, AsyncStorage, FlatList } from 'react-native';
import { ForegrounScheduler } from './infra/scheduler/foreground.scheduler';
import { CacheLogger } from 'infra/cache.logger';
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
            alert("There was error in initializing the foreground scheduler");
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
    updateLogs() {
        return CacheLogger.GetAllLogs()
            .then((logs) => {
            this.setState({ "logs": logs });
        });
    }
    deleteLogs() {
        return CacheLogger.DeleteLogs()
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssRUFBRSxFQUFDLFNBQVMsRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUN2QyxPQUFPLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQWEsWUFBWSxFQUFzQixRQUFRLEVBQWUsTUFBTSxjQUFjLENBQUM7QUFDMUgsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDNUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBR2pELE1BQU0sQ0FBQyxPQUFPLE9BQU8sR0FBSSxTQUFRLFNBQXFCO0lBR3BELFlBQVksS0FBSztRQUNmLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7UUFDcEQsSUFBSSxDQUFDLEtBQUssR0FBRztZQUNYLFdBQVcsRUFBRSxFQUFFO1lBQ2YsTUFBTSxFQUFFLEVBQUU7WUFDVixXQUFXLEVBQUUsRUFBRTtZQUNmLGNBQWMsRUFBRSxZQUFZO1NBQzdCLENBQUE7UUFDRCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELFVBQVU7UUFDUixJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFO2FBQ2pDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDVCxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNoQixLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQztRQUNwRSxDQUFDLENBQUMsQ0FBQTtJQUVOLENBQUM7SUFFRCxlQUFlO1FBQ2IsT0FBTyxZQUFZ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