import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
  } from 'react-native';
import TaskList from './TaskList';
import { withNavigation } from 'react-navigation';

  class TodoComponent extends Component {
      constructor(props, context) {
            super(props, context);
            this.state = {
                todos:[{
                    "task": "Integrate with AAD"
                },{
                    "task": "Work Acocunts"
                },{
                    "task": "Create Login Experience"
                },{
                    "task": "Onboard Sample Application"
                },{
                    "task": "Create Logging package"
                }]
            };
        
            this.addNewTask = this.addNewTask.bind(this);
            this.newTaskAdded = this.newTaskAdded.bind(this);
            this.deleteTask = this.deleteTask.bind(this);
        }

    addNewTask () {
        this.props.navigation.navigate('AddTask', {
            newTaskAdded: this.newTaskAdded
        });
    }

    newTaskAdded(task) {
        this.state.todos.push({
            "task": task
        });
        this.setState({todos: this.state.todos});
        this.props.navigation.pop();
    }

    deleteTask(todo) {
        const refinedTodos = this.state.todos.filter((currentTodo) => {
            return currentTodo !== todo;
        });
        this.setState({todos: refinedTodos});
    }

    render() {
        return (
            <TaskList
                addNewTask = {this.addNewTask}
                todos={this.state.todos}
                deleteTask={this.deleteTask}/>
        )
    }
}

export default withNavigation(TodoComponent); //Since TODO component is nested inside Home, the navigation oject is not injected into it directly. Hence we are using withNavigation to inject the navigation property.