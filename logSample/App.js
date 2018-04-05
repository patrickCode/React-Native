import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput
} from 'react-native';

import Microsoft from "./ai.0";
import * as DeviceInfo from 'react-native-device-info';

type Props = {};
export default class App extends Component<Props> {
  message = 'Data 3';
  AppInsights = null;
  constructor(props) {
    super(props);
    this.bindMethods();
    var snippet = {
      config: {
        instrumentationKey: "9d6b3473-a97e-4798-a5cf-7696dc29988e"
      }
    };
    var init = new Microsoft.ApplicationInsights.Initialization(snippet);
    this.AppInsights = init.loadAppInsights();
    this.addTelemetryInitializer();
    this.addDeviceProperties();
    this.AppInsights.trackPageView("First Page", null, {Comp: "App"},{hit:"1"}, 100);
  }

  bindMethods() {
    this.logMessage = this.logMessage.bind(this);
    this.messageChanged = this.messageChanged.bind(this);
    this.logError = this.logError.bind(this);
  }

  addTelemetryInitializer() {
      this.AppInsights.context.addTelemetryInitializer(function(envelope) {
        var telemetryItem = envelope.data.baseData;
        telemetryItem.properties = telemetryItem.properties || {};
        telemetryItem.properties["Environment"] = "Development";
        telemetryItem.properties["ICTO"] = "ICTO-11595";
        telemetryItem.properties["Custom_property_1"] = "This is a custom property";
        telemetryItem.properties["Custom_property_2"] = "This is another custom property";
      });
  }

  addDeviceProperties() {
    this.AppInsights.context.addTelemetryInitializer(function(envelope) {
      var telemetryItem = envelope.data.baseData;
        telemetryItem.properties = telemetryItem.properties || {};
        telemetryItem.properties["Device.Id"] = DeviceInfo.getDeviceId();;
        telemetryItem.properties["Device.Model"] = DeviceInfo.getModel();
        telemetryItem.properties["Operation system"] = DeviceInfo.getDeviceName();
        telemetryItem.properties["Network"] = DeviceInfo.getCarrier();
    });
  }

  messageChanged(text) {
    this.message = text;
  }

  logMessage() {
    this.AppInsights.trackTrace(this.message);
  }

  logError() {
    var exception = new Error(this.message);
    this.AppInsights.trackException(exception);
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Logging using Application Insight Sample
        </Text>
        <TextInput onChangeText={this.messageChanged}/>
        <TouchableHighlight onPress={this.logMessage}>
          <Text>Log Message</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.logError}>
          <Text>Log Error</Text>
        </TouchableHighlight>
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