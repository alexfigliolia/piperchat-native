import React, { Component } from 'react';
import {
	Animated,
	View,
	Text,
	Image, 
	TouchableOpacity,
	StyleSheet
} from 'react-native';

export default class Connecting extends Component {
  constructor(props) {
  	super(props);
  	this.styles = {
  		container: {
  			position: 'absolute',
  			top: 0,
  			left: 0,
  			height: '100%',
  			width: '100%',
  			backgroundColor: 'rgba(0,0,0,0.75)',
  			justifyContent: 'center',
  			alignItems: 'center',
  			transform: [
  				{ scale: this.props.scale.interpolate({
  						inputRange: [0, 1],
  						outputRange: [0, 1]
  					})
  				}
  			],
  			opacity: this.props.dim
  		},
  		inner: {
  			height: '100%',
  			width: '100%',
  			justifyContent: 'center',
  			alignItems: 'center',
  			position: 'relative'
  		},
  		loader: {
  			height: 50,
  			width: 50,
        marginBottom: 50,
  			transform: [
  				{ scale: this.props.with.interpolate({
  						inputRange: [0, 1],
  						outputRange: [0, 1]
  					})
  				}
  			]
  		},
      friendImage: {
        height: 90,
        width: 90,
        marginBottom: 50,
        transform: [
          { scale: this.props.with.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
            })
          }
        ],
        borderRadius: 90/2,
        overflow: 'hidden'
      },
  		buttonsContainer: {
  			justifyContent: 'center',
  			alignItems: 'center',
  			flexDirection: 'row',
  			position: 'absolute',
  			bottom: '15%',
  			left: 0,
  			width: '100%'
  		},
  		button2: {
  			height: 70,
  			width: 70,
  			borderRadius: 70/2,
  			backgroundColor: '#6FD379',
  			justifyContent: 'center',
  			alignItems: 'center',
  			marginLeft: 30,
  			transform: [
  				{ translateY: this.props.accept.interpolate({
  						inputRange: [0, 1],
  						outputRange: [400, 0]
  					})
  				}
  			]
  		},
  		buttonIcon: {
  			height: 35,
  			width: 35
  		},
      buttonIcon2: {
        height: 40,
        width: 40,
        marginBottom: 5
      }
  	}
  }

  render = () => {
    const friendImage = this.props.currentFriend.image === undefined ? null : this.props.currentFriend.image;
    return (
    	<Animated.View
    		style={this.styles.container}>
    		<View
    			style={this.styles.inner}>
    			<Animated.Image
            style={this.styles.loader}
            source={require('../../public/loader.gif')}></Animated.Image>
	    		<View
	    			style={this.styles.buttonsContainer}>
	    			<Animated.View>
	    				<TouchableOpacity
	    					onPress={this.props.hideConnecting}
		    				style={{
                  height: 70,
                  width: 70,
                  borderRadius: 70/2,
                  backgroundColor: '#CD3B48',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: this.props.initializingCall ? 0 : 30,
                  transform: [
                    { translateY: this.props.hangUp.interpolate({
                        inputRange: [0, 1],
                        outputRange: [400, 0]
                      })
                    }
                  ]
                }}>
		    				<Image
				    			style={this.styles.buttonIcon2}
				    			source={require('../../public/hangup.png')}></Image>
	    				</TouchableOpacity>
	    			</Animated.View>
	    			{
              !this.props.initializingCall &&
              <Animated.View>
                <TouchableOpacity
                  onPress={this.props.acceptCall}
                  style={this.styles.button2}>
                  <Image
                    style={this.styles.buttonIcon}
                    source={require('../../public/call.png')}></Image>
                </TouchableOpacity>
              </Animated.View>
            }
	    		</View>
    		</View>
    	</Animated.View>
    );
  }
}
