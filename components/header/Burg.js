import React, { Component } from 'react';
import {
	TouchableWithoutFeedback,
	View,
	Animated
} from 'react-native';

export default class Burg extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		active: false,
  		active2: false,
  		top: new Animated.Value(0),
  		middle: new Animated.Value(0),
  		bottom: new Animated.Value(0),
  		tbScale: new Animated.Value(0),
  		tbX: new Animated.Value(0),
  		cMove: new Animated.Value(0)
  	}
  	this.styles = {
	  	container: {
	  		height: 50,
	  		width: 50,
        zIndex: 5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        transform: [
        	{ scale: 0.9 },
        	{ translateY: 2 },
        	{
	  				translateX: this.state.cMove.interpolate({
	  					inputRange: [0, 1, 2],
	  					outputRange: [2.5, -5, -15]
	  				})
	  			},
	  			{
	  				rotateY: this.state.tbX.interpolate({
	  					inputRange: [0, 1],
	  					outputRange: ['0deg', '180deg']
	  				})
	  			},
        ]
	  	},
	  	top: {
	  		position: 'absolute',
	  		bottom: 27.5,
	  		left: 5,
	  		height: 2,
	  		width: 27.5,
	  		backgroundColor: '#fff',
	  		transform: [
	  			{
	  				rotate: this.state.top.interpolate({
	  					inputRange: [0, 1, 2],
	  					outputRange: ['0deg', '-45deg', '-45deg']
	  				})
	  			},
	  			{
	  				translateY: this.state.top.interpolate({
	  					inputRange: [0, 1, 2],
	  					outputRange: [0, 11, -10]
	  				})
	  			},
	  			{
	  				translateX: this.state.tbX.interpolate({
	  					inputRange: [0, 1],
	  					outputRange: [0, -15]
	  				})
	  			},
	  			{
	  				scaleX: this.state.tbScale.interpolate({
	  					inputRange: [0, 1],
	  					outputRange: [1, 0.5]
	  				})
	  			}
	  		]
	  	},
	  	middle: {
	  		position: 'absolute',
	  		bottom: 20,
	  		left: 5,
	  		height: 2,
	  		width: 27.5,
	  		backgroundColor: '#fff',
	  		opacity: this.state.middle.interpolate({
					inputRange: [0, 1],
					outputRange: [1, 0]
				}),
	  		transform: [
	  			{
	  				scaleX: this.state.middle.interpolate({
	  					inputRange: [0, 1],
	  					outputRange: [1, 0]
	  				})
	  			},
	  			{
	  				translateX: this.state.tbX.interpolate({
	  					inputRange: [0, 1],
	  					outputRange: [0, -6.5]
	  				})
	  			},
	  		]
	  	},
	  	bottom: {
	  		position: 'absolute',
	  		bottom: 12.5,
	  		left: 5,
	  		height: 2,
	  		width: 27.5,
	  		backgroundColor: '#fff',
	  		transform: [
	  			{
	  				rotate: this.state.bottom.interpolate({
	  					inputRange: [0, 1, 2],
	  					outputRange: ['0deg', '45deg', '45deg']
	  				})
	  			},
	  			{
	  				translateY: this.state.bottom.interpolate({
	  					inputRange: [0, 1, 2],
	  					outputRange: [0, -10.5, 10]
	  				})
	  			},
	  			{
	  				translateX: this.state.tbX.interpolate({
	  					inputRange: [0, 1],
	  					outputRange: [0, -15]
	  				})
	  			},
	  			{
	  				scaleX: this.state.tbScale.interpolate({
	  					inputRange: [0, 1],
	  					outputRange: [1, 0.5]
	  				})
	  			}
	  		]
	  	}
	  }
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps !== this.props) {
      if(this.state.active) {
        if(nextProps.raActive !== this.props.raActive || 
        nextProps.rfActive !== this.props.rfActive) {
          if(nextProps.raActive === 1 || nextProps.rfActive === 1) {
            this.makeArrow();
          } 
        }
      }
    }
    if(nextProps.raActive === 0 && nextProps.rfActive === 0 && this.state.active) {
      this.makeX();
    }
    if(nextProps.menuActive === 0) {
      this.unmakeX();
      this.setState({ active: false, active2: false });
    }
  }

  toggleBurger = () => {
  	this.props.openMenu();
  	this.setState(prevState => {
  		if(!prevState.active && !prevState.active2) {
  			this.makeX();
  			return {active: !prevState.active}
  		}
  		if(!prevState.active && prevState.active2) {
  			this.makeX();
  			return {active2: !prevState.active}
  		}
  		if(prevState.active && prevState.active2) {
  			this.unmakeX();
  			return {active: !prevState.active, active2: !prevState.active}
  		}
  		
  	});
  }

  makeX = () => {
  	Animated.parallel([
  		Animated.spring(this.state.top, {toValue: 1, useNativeDriver: true}),
  		Animated.timing(this.state.middle, {toValue: 1, duration: 200, useNativeDriver: true}),
  		Animated.spring(this.state.bottom, {toValue: 1, useNativeDriver: true}),
  		Animated.spring(this.state.tbX, {toValue: 0, useNativeDriver: true}),
  		Animated.spring(this.state.tbScale, {toValue: 0, useNativeDriver: true}),
  		Animated.spring(this.state.cMove, {toValue: 1, useNativeDriver: true}),
  	]).start();
  }

  unmakeX = () => {
  	Animated.parallel([
  		Animated.spring(this.state.top, {toValue: 0, useNativeDriver: true}),
  		Animated.timing(this.state.middle, {toValue: 0, duration: 200, useNativeDriver: true}),
  		Animated.spring(this.state.bottom, {toValue: 0, useNativeDriver: true}),
  		Animated.spring(this.state.tbScale, {toValue: 0, useNativeDriver: true}),
  		Animated.spring(this.state.tbX, {toValue: 0, useNativeDriver: true}),
  		Animated.spring(this.state.cMove, {toValue: 0, useNativeDriver: true}),
  	]).start();
  }

  makeArrow = () => {
  	Animated.parallel([
  		Animated.spring(this.state.top, {toValue: 2, useNativeDriver: true}),
  		Animated.timing(this.state.middle, {toValue: 0, duration: 200, useNativeDriver: true}),
  		Animated.spring(this.state.bottom, {toValue: 2, useNativeDriver: true}),
  		Animated.spring(this.state.tbScale, {toValue: 1, useNativeDriver: true}),
  		Animated.spring(this.state.tbX, {toValue: 1, useNativeDriver: true}),
  		Animated.spring(this.state.cMove, {toValue: 2, useNativeDriver: true}),
  	]).start();
  }

  render = () => {
    return (
    	<TouchableWithoutFeedback
    		onPress={this.toggleBurger} 
    		style={this.styles.container}>
    		<Animated.View style={this.styles.container}>
    			<Animated.View style={this.styles.top}></Animated.View>
    			<Animated.View style={this.styles.middle}></Animated.View>
    			<Animated.View style={this.styles.bottom}></Animated.View>
    		</Animated.View>
    	</TouchableWithoutFeedback>   
    );
  }
}
