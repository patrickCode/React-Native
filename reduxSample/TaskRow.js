import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    Text,
    TouchableHighlight,
    Animated
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E7E7E7',
        padding: 20,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20
    },
    label:{
        fontSize: 20,
        fontWeight: '300'
    },
    button: {
        borderRadius: 5,
        backgroundColor: '#EAEAEA',
        padding: 5
    }
});

export default class TaskRow extends Component {
    doneAnimation = new Animated.ValueXY();
    
    deleteTask() {
        this.props.deleteTask(this.props.todo);
    }

    animateDelete() {
        Animated.spring(this.doneAnimation, {
            tension: 2,
            friction: 3,
            toValue: {
                x: -500,
                y: 0
            }
        }).start();
        
        setTimeout(() => {  //A timeout is being set so that the removal is done only after the animation
            this.deleteTask.bind(this);
        }, 1000);
        
    }


    render() {
        const animationStyle = StyleSheet.create({
            row: {
                transform: this.doneAnimation.getTranslateTransform()
            }
        });

        return (
            <Animated.View style = {[styles.container, animationStyle.row]} >
                <Text style = {styles.label}>{this.props.todo.task}</Text>
                <TouchableHighlight
                    onPress = {this.animateDelete.bind(this)}
                    style = {styles.button}>
                    <Text>Delete</Text>
                </TouchableHighlight>
            </Animated.View>
        )
    }
}