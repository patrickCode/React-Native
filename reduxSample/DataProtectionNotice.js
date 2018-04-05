import React, { Component } from 'react';
import {
    Text,
    Button,
    View
} from 'react-native';

const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 30
    }
};

export default class DataProtectionModal extends Component {
    render() { return(
        <View style = {styles.container}>
            <Text style = {styles.text}>
                Data Protection Notice
            </Text>
        <Button
            title = "Go Back"
            onPress = {() => this.props.navigation.goBack()} />
        </View>);
    }
}