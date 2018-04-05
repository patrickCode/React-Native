import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import About from './about';
import DataProtectionModal from './DataProtectionNotice'
import TodoComponent from './TodoComponent';
import AddTask from './AddTask'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

class HomeLogo extends Component {
  render(){
    return (
      <View>
        <Image 
          source = {require('./home-icon.png')} 
          style = {{width: 30, height: 30, marginLeft: 10}}
        />
      </View>
    )
  }
}

class Home extends Component<Props> {
  static navigationOptions = {
    //title: 'Home' //For showing the title (static title) in the navigation header
    headerTitle: <HomeLogo /> //For rendering a component as the title, instead of static text
  };

  render() {
    return (
      <View style={styles.container}>
        <TodoComponent />
        
        <Text style={styles.instructions}>
          {instructions}
        </Text>

        <Button 
          title="About"
          onPress = {() => this.props.navigation.navigate('About', {
            version: "1.0"
          })} />
          {/* The navigation property is prop is passed to every screen component in StackNavigator. Version is a route parameter. */}
        <Button 
          title="Back"
          onPress = {() => this.props.navigation.goBack()} />
        <Button
          title = "Data Protection Notice"
          onPress = {() => this.props.navigation.navigate('DataProtectionModal')} />
      </View>
    );
  }
}

const AppStack = StackNavigator ({
  Home: {
    screen: Home
  },
  About: {
    screen: About
  },
  AddTask: {
    screen: AddTask
  }
},{
  initialRouteName: 'Home',
  navigationOptions: {  //This navaigations options is shared across all the screens. Each screen can override and customize the navigation options as it sees fit
    headerStyle: {
      backgroundColor: '#F4511E'
    },
    headerTintColor: '#FFF',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }
});

const RootStack = StackNavigator ({
  AppStack: {
    screen: AppStack
  },
  DataProtectionModal: {
    screen: DataProtectionModal
  }
}, {
  mode: 'modal',
  headerMode: 'none'
});

export default class App extends Component {
  render() {
    return(
      <RootStack />
    )
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