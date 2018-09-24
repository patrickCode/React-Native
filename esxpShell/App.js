import React, { Component } from 'react';
import Analytics from 'appcenter-analytics';
import Crashes from 'appcenter-crashes';
import codePush from 'react-native-code-push';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const crashRecoveryMessage = 'We appologize for the inconvinience. We are working on fixing the issue, please contact the support center for more information.';

let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  deploymentKey: '7S616K4KWRhJzzo8-HCrCDNTl8RzBkgriN8cz'
};

type Props = {};
class App extends Component<Props> {
    didApplicationCrash = false;
    crashReport = '';

    constructor(props) {
      super(props);
      
      this.state = {
        counter: 0,
        didApplicationCrash: false
      }
      Analytics.isEnabled()
        .then(async (isAnalyticsEnabled) => {
          if (isAnalyticsEnabled == false)
            await Analytics.setEnabled(true);
        });
        this.configureCrashSettings();

        var that = this;
        Crashes.hasCrashedInLastSession() 
          .then(function (crashStatus) {
            this.didApplicationCrash = crashStatus;
            that.setState({
              didApplicationCrash: crashStatus
            });
            if (crashStatus) {
              Crashes.lastSessionCrashReport()
              .then(function (report) {
                this.crashReport = report;
              })  
            }
          });
        
        this.onCounterIncrease = this.onCounterIncrease.bind(this);
        this.crashApplication = this.crashApplication.bind(this);
    }

    configureCrashSettings() {
      Crashes.isEnabled()
        .then(async (isCrashEnabled) => {
          if (isCrashEnabled == false)
            await Crashes.setEnabled(true);
        })

      Crashes.setListener({
        onBeforeSending: function(report) {
          Analytics.trackEvent("Application Crashed",{
            "Report": JSON.stringify(report)
          });
        }
      });
    }

    onCounterIncrease() {
      Analytics.trackEvent("Counter Increased", 
      {
        "Category": "Button Press",
      });

      this.setState((previousState, props) => ({
        counter: previousState.counter + 1
      }));
    }

    //Only for testing
    crashApplication(){
      //Only for local testing
      // Crashes.generateTestCrash();
      throw new Error("Dummy crash test");
    }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          ESXP Shell
        </Text>
        <Text style={styles.instructions}>
          I am giving Live Demo.
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>

        { 
          this.state.didApplicationCrash && 
          <Text>
            {crashRecoveryMessage}
          </Text>
        }
        
        
        <TouchableOpacity onPress={this.onCounterIncrease}>
          <Text>Increase Counter</Text>
        </TouchableOpacity>
        <Text style={styles.container}>
          Counter: {this.state.counter}
        </Text>

        <TouchableOpacity onPress={this.crashApplication}>
          <Text>Simulate a crash</Text>
        </TouchableOpacity>
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
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

App = codePush(codePushOptions)(App);
export default App;