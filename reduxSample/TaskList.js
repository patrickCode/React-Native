import React, {Component} from 'react'
import {
    View,
    Text,
    ListView, 
    StyleSheet, 
    TouchableHighlight
  } from 'react-native';
import TaskRow from './TaskRow';

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'flex-start'
    },
    button: {
        height: 60,
        borderColor: '#05A5D1',
        borderWidth: 2,
        backgroundColor: '#333',
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#FAFAFA',
        fontSize: 20,
        fontWeight: '600'
    }
});

export default class TaskList extends Component {

    constructor(props, context) {
        super(props, context);

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2 //Tells the data source how to differentiate between objects in a list
        });

        this.state = {
            dataSource: ds.cloneWithRows(props.todos)
        };

        this.renderRow = this.renderRow.bind(this);
    }

    componentWillReceiveProps(nextProps) { //This method is needed so that the datasource is updated when todos array updated by Todo Component
        const dataSource = this.state.dataSource.cloneWithRows(nextProps.todos);
        this.setState({dataSource});
    }

    renderRow(todo) {
        return(
            //<Text>{todo.task}</Text> //Instead of directly rendering a text we are rendering a component which is rendering the text for us
            <TaskRow 
                todo={todo} 
                deleteTask = {this.props.deleteTask}
            />
        );
    }

    render(){
        return (
            <View style={styles.container}>
                <ListView
                    key = {this.props.todos}
                    dataSource = {this.state.dataSource}
                    renderRow = {this.renderRow} />

                <TouchableHighlight style = {styles.button} onPress = {this.props.addNewTask}>
                    <Text style = {styles.buttonText}>
                        + Task
                    </Text>
                </TouchableHighlight>
            </View>
        )
    }
}