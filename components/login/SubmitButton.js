import React, { Component } from 'react';
import {
	Animated,
	View,
	TouchableOpacity,
	Text,
	Image,
	StyleSheet
} from 'react-native';

export default class SubmitButton extends Component {
  render = () => {
    return (
    	<Animated.View
	      style={{
	        marginTop: 25,
	        marginBottom: 20,
	        backgroundColor: 'transparent',
	        height: 38,
	        width: '85%',
	        maxWidth: this.props.buttonAnim,
	        borderColor: '#fff',
	        borderWidth: 1,
	        justifyContent: 'center',
	        alignItems: 'center',
	        borderRadius: this.props.borderRadius,
	        overflow: 'hidden'
	      }}>
	      <TouchableOpacity
	        onPress={this.props.submit}
	        style={styles.submitButton}>
	        <Animated.Image 
	          source={require('../../public/loader.gif')}
	          style={{
	            position: 'absolute',
	            top: 4,
	            left: 3,
	            width: 30,
	            height: 30,
	            transform: [
	              { scale: this.props.scale.interpolate({
	                  inputRange: [0, 1],
	                  outputRange: [0, 1]
	                }) 
	              }
	            ]
	          }} />
	        <Animated.Image 
	          source={require('../../public/check.png')}
	          style={{
	            position: 'absolute',
	            top: 4,
	            left: 3,
	            width: 30,
	            height: 30,
	            transform: [
	              { scale: this.props.check.interpolate({
	                  inputRange: [0, 1],
	                  outputRange: [0, 1]
	                }) 
	              }
	            ]
	          }} />
	        <Animated.Text
	          onTouch={this.props.submit}
	          style={{
	            color: '#fff',
	            fontSize: 16,
	            fontWeight: '800',
	            opacity: this.props.opacity,
	          }}>{this.props.newUser ? "SIGN UP" : "LOGIN"}</Animated.Text>
	      </TouchableOpacity>
	    </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
	submitButton: {
    width: "100%", 
    height: 38, 
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  }
});
