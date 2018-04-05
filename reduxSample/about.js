import React, {Component} from 'react';
import {View, Text, Button, AdSupportIOS} from 'react-native';

export default class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headerClicker: 0
        };
    }

    static navigationOptions = ({ navigation }) => { //Showing navigation header title from state params
        const { params } = navigation.state;    //this.props cannot be used here since it's a static method, so we are making navigationOptions a function. React will call it by navigation, navigationOptions, screenProps.
        const title = params && params.title ? params.title : 'About';
        const version = params ? params.version : null;

        return {
            title: title + " Version: " + version,
            headerRight: (
                <Button onPress={params.increaseHeaderClicker} title="+ Header" />
            )
        }
    };

    componentWillMount() {
        this.props.navigation.setParams({increaseHeaderClicker: this._increaseHeaderClicker });
    }

    _increaseHeaderClicker = () => {
        this.setState( {headerClicker: this.state.headerClicker + 1} );
    }

    render() {
        const { params } = this.props.navigation.state;
        const version = params ? params.version : null;
        return(
            <View>
                <Text>Version - {version}</Text>
                <Text>This is a sample partner application</Text>
                <Text>Header Clicker - {this.state.headerClicker}</Text>
                {/* Changes the state of the navigation property */}
                <Button 
                    title = "Update header version"
                    onPress = {() => this.props.navigation.setParams({version: '2.0'})} />
                <Button 
                    title="Home"   
                    onPress = {() => this.props.navigation.navigate('Home')} />
                <Button 
                    title="Back"
                    onPress = {() => this.props.navigation.goBack()} />
            </View>
        );
    }
}