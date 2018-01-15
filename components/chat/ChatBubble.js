import React, { PureComponent } from 'react';
import { View, Text, Animated } from 'react-native';
import Meteor from 'react-native-meteor';

export default class ChatBubble extends PureComponent {
  constructor(props) {
  	super(props);
    this.state = {
      enter: new Animated.Value(0)
    }
  }

  componentDidMount = () => {
    setTimeout(() => {
      Animated.spring(this.state.enter, { toValue: 1, useNativeDriver: true }).start();
    }, 500);
  }

  render = () => {
    return (
    	<Animated.View
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
	        minHeight: 10,
          opacity: this.state.enter,
          transform: [
            { 
              translateX: this.state.enter.interpolate({
                inputRange: [0, 1],
                outputRange: [this.props.from === Meteor.userId() ? 50 : -50, 0]
              })
            }
          ]
    		}}>
    		<Text
    			style={{
    				color: this.props.from === Meteor.userId() ? '#fff' : '#000',
    				fontSize: 16
    			}}>{this.props.text}</Text>
    	</Animated.View>    
    );
  }
}
