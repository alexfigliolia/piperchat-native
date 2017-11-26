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
  	this.state = {
  		with: null
  	}
  	this.styles = {
  		container: {
  			position: 'absolute',
  			top: 0,
  			left: 0,
  			height: '100%',
  			width: '100%',
  			backgroundColor: 'rgba(0,0,0,0.5)',
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
  			transform: [
  				{ scale: this.props.with.interpolate({
  						inputRange: [0, 1],
  						outputRange: [0, 1]
  					})
  				}
  			]
  		},
  		buttonsContainer: {
  			justifyContent: 'center',
  			alignItems: 'center',
  			flexDirection: 'row',
  			position: 'absolute',
  			bottom: '10%',
  			left: 0,
  			width: '100%'
  		},
  		button1: {
  			height: 70,
  			width: 70,
  			borderRadius: 70/2,
  			backgroundColor: '#CD3B48',
  			justifyContent: 'center',
  			alignItems: 'center',
  			marginRight: 30,
  			transform: [
  				{ translateY: this.props.hangUp.interpolate({
  						inputRange: [0, 1],
  						outputRange: [400, 0]
  					})
  				}
  			]
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
  			height: 40,
  			width: 40
  		}
  	}
  }

  render = () => {
    return (
    	<Animated.View
    		style={this.styles.container}>
    		<View
    			style={this.styles.inner}>
    			{
    				this.state.with === null ?
    				<Animated.Image
		    			style={this.styles.loader}
		    			source={require('../../public/loader.gif')}></Animated.Image>
		    		:
		    		<Animated.Image
		    			style={this.styles.loader}
		    			source={{uri: this.state.with.image}}></Animated.Image>
    			}
	    		<View
	    			style={this.styles.buttonsContainer}>
	    			<Animated.View>
	    				<TouchableOpacity
	    					onPress={this.props.hideConnected}
		    				style={this.styles.button1}>
		    				<Image
				    			style={this.styles.buttonIcon}
				    			source={require('../../public/loader.gif')}></Image>
	    				</TouchableOpacity>
	    			</Animated.View>
	    			<Animated.View>
	    				<TouchableOpacity
		    				style={this.styles.button2}>
		    				<Image
				    			style={this.styles.buttonIcon}
				    			source={require('../../public/loader.gif')}></Image>
	    				</TouchableOpacity>
	    			</Animated.View>
	    		</View>
    		</View>
    	</Animated.View>
    );
  }
}
