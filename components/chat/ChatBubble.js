import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Meteor from 'react-native-meteor';

export default class ChatBubble extends Component {
  constructor(props) {
  	super(props);
  }

  render = () => {
    return (
    	<View
    		style={{
    			backgroundColor: this.props.from === Meteor.userId() ? '#51BFAF' : '#ECF0F0',
    			padding: 10,
    			alignSelf: this.props.from === Meteor.userId() ? 'flex-end' : 'flex-start',
    			marginTop: 5,
    			marginBottom: 5,
    			marginRight : this.props.from === Meteor.userId() ? 10 : 0,
    			marginLeft : this.props.from === Meteor.userId() ? 0 : 10,
    			borderRadius: 5,
    			maxWidth: '95%',
    			shadowColor: '#000',
	        shadowOffset:{  width: 0,  height: 2,  },
	        shadowColor: 'black',
	        shadowOpacity: 0.15,
	        minHeight: 10
    		}}>
    		<Text
    			style={{
    				color: this.props.from === Meteor.userId() ? '#fff' : '#000',
    				fontSize: 16
    			}}>{this.props.text}</Text>
    	</View>    
    );
  }
}
