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
    this.state = {
      online: false
    }
  }

  checkOnline = (id) => {
    if(this.props.states !== undefined && this.props.states.length !== 0) {
      let online = false;
      for(let i = 0; i<this.props.states.length; i++) {
        if(this.props.states[i].userId === id) {
          online = true;
          break;
        }
      }
      this.setState({online});
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.states !== this.props.states ||
       nextProps.currentFriend._id !== this.props.currentFriend._id) {
      this.checkOnline(nextProps.currentFriend._id);
    }
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
    		{
          this.state.online ?
          <TouchableOpacity
            onPress={this.props.openCall}
            style={{
              height: '33.33333%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 1
            }}>
            <Text 
              style={{
                fontSize: 18,
                color: '#51BFAF'
              }}>Video Chat</Text>
          </TouchableOpacity>
          :
          <View
            style={{
              height: '33.33333%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.35,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: '#51BFAF',
                fontSize: 18,
              }}>
              Video Chat
            </Text>
          </View>
        }
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
