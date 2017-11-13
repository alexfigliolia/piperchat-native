import React, { Component } from 'react';
import {
	Animated,
	View,
	TextInput,
	Text,
	StyleSheet
} from 'react-native';

export default class LoginInput extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		text: ""
  	}
  	this.inputAnim = new Animated.Value(0);
  	this.styles = StyleSheet.create({
	  	inputContainer: {
	      justifyContent: 'center',
	      alignItems: 'center',
	      width: '85%',
	      marginBottom: 5,
	      maxWidth: 300,
	      position: 'relative',
	    },
	    placeholder: {
	      fontSize: 18,
	      backgroundColor: 'transparent',
	      color: '#fff',
	      marginBottom: 0,
	      width: '97.5%',
	      maxWidth: 300,
	      textAlign: 'left',
	      transform: [
	        { translateY: this.inputAnim.interpolate({
	            inputRange: [0, 1],
	            outputRange: [ 25, 0 ],
	          })
	        },
	        { scale: this.inputAnim.interpolate({
	            inputRange: [0, 1],
	            outputRange: [ 1, 0.85 ],
	          })
	        },
	        { translateX: this.inputAnim.interpolate({
	            inputRange: [0, 1],
	            outputRange: [ 0, -27.5 ],
	          })
	        }
	      ]
	    },
	    input: {
	      width: '100%',
	      maxWidth: 300,
	      backgroundColor: 'transparent',
	      color: '#fff',
	      fontSize: 18,
	      overflow: 'hidden',
	      height: 30,
	      paddingBottom: 5,
	    },
	    bottomBar: {
     		position: 'absolute',
     		bottom: 1,
     		left: 0,
     		width: '100%',
     		maxWidth: 300,
     		height: 2,
     		backgroundColor: '#FFF',
     		borderRadius: 2/2,
     		transform: [
     			{scaleX: this.inputAnim.interpolate({
     				inputRange: [0, 1],
     				outputRange: [0, 1]
     			})}
     		]
     	},
     	bottomBarFixed: {
     		position: 'absolute',
     		bottom: 0,
     		left: 0,
     		width: '100%',
     		maxWidth: 300,
     		opacity: 1,
     		height: 1,
     		borderRadius: 1/2,
     		backgroundColor: '#fff'
     	}
	  });
  }

  handleFocus = () => {
    Animated.spring(this.inputAnim, { toValue: 1, useNativeDriver: true}).start();
  }

  handleBlur = () => {
    if(this.state.text === "") {
    	Animated.spring(this.inputAnim, { toValue: 0, useNativeDriver: true}).start();
    }
  }

  render = () => {
    return (
    	<View style={this.styles.inputContainer}>
        <Animated.Text 
          keyboardType={this.props.keyboard}
          style={this.styles.placeholder}>{this.props.for}</Animated.Text>
        <TextInput
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          selectionColor="#fff" 
          secureTextEntry={this.props.secure}
          style={this.styles.input}
          value={this.state.text}
          onChangeText={(text) => this.setState({text})} />
         <Animated.View
         	style={this.styles.bottomBar}></Animated.View>
         <View
         	style={this.styles.bottomBarFixed}></View>
      </View>
    );
  }
}
