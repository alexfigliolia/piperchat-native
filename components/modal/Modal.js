import React, { Component } from 'react';
import {
	Animated,
	View,
	Text,
	TouchableOpacity
} from 'react-native';

export default class Modal extends Component {
  constructor(props) {
  	super(props);
  }

  render = () => {
    return (
    	<Animated.View
    		style={{
    			height: '25%',
    			width: '95%',
    			position: 'absolute',
    			bottom: 10,
    			left: '2.5%',
    			backgroundColor: '#fff',
    			borderRadius: 5,
    			zIndex: 1234,
    			justifyContent: 'center',
    			alignItems: 'center',
    			shadowColor: '#000',
			    shadowOffset:{ width: 0,  height: -5 },
			    shadowColor: 'black',
			    shadowOpacity: 0.6,
			    shadowRadius: 15,
			    transform: [
			    	{ translateY: this.props.anim.interpolate({
			    			inputRange: [ 0, 1 ],
			    			outputRange: [ 250, 0 ]
			    		})
			    	}
			    ]
    		}}>
    		<TouchableOpacity
          onPress={this.props.openCall}
    			style={{
    				height: '33.33333%',
    				width: '100%',
    				justifyContent: 'center',
    				alignItems: 'center'
    			}}>
    			<Text 
    				style={{
    					fontSize: 18,
    					color: '#51BFAF'
    				}}>Video Chat</Text>
    		</TouchableOpacity>
    		<TouchableOpacity
    			onPress={this.props.openChat}
    			style={{
    				height: '33.33333%',
    				width: '100%',
    				justifyContent: 'center',
    				alignItems: 'center'
    			}}>
    			<Text 
    				style={{
    					fontSize: 18,
    					color: '#51BFAF'
    				}}>Messenger</Text>
    		</TouchableOpacity>
    		<TouchableOpacity
    			onPress={this.props.toggleChatOptions}
    			style={{
    				height: '33.33333%',
    				width: '100%',
    				justifyContent: 'center',
    				alignItems: 'center'
    			}}>
    			<Text 
    				style={{
    					fontSize: 18,
    					color: '#51BFAF'
    				}}>Cancel</Text>
    		</TouchableOpacity>
    	</Animated.View>
    );
  }
}
