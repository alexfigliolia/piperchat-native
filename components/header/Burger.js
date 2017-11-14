import React, { Component } from 'react';
import { TouchableWithoutFeedback, View, Animated } from 'react-native';

export default class Burger extends Component {
	constructor(props) {
    super(props);
    this.state = {
      active: false,
      active2: false
    }
    this.containerAnim = new Animated.Value(0);
    this.topBar = new Animated.Value(0);
    this.bottomBar = new Animated.Value(0);
    this.middleBarOpacity = new Animated.Value(1);
    this.bottomBarMargin = new Animated.Value(4);
    this.topBarMargin = new Animated.Value(-0.5);
    this.marginLeft = new Animated.Value(0);
    this.width = new Animated.Value(20);
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

  spinCross = () => {
    if(this.props.raActive === 1 || this.props.rfActive === 1 && this.state.active) {
      this.makeX();
    } else {
      this.setState(prevState => {
        if(!prevState.active) { this.makeX() } else { this.unmakeX() }
        return { active: !prevState.active } 
      });
    }
    this.props.openMenu();
  }

  spinArrow = () => {
    this.setState(prevState => {
      if(!prevState.active2) { this.makeArrow(); } else { this.unmakeArrow(); }
      return { active2: !prevState.active2, active: prevState.active ? !prevState.active : prevState.active } 
    });
  }

  makeX = () => {
    Animated.spring(this.containerAnim, { toValue: 1}).start();
    Animated.spring(this.topBar, { toValue: .9}).start();
    Animated.spring(this.bottomBar, { toValue: .9}).start();
    Animated.spring(this.bottomBarMargin, { toValue: -7.9}).start();
    Animated.timing(this.middleBarOpacity, { toValue: 0, duration: 100 }).start();
    Animated.spring(this.marginLeft, { toValue: 0}).start();
    Animated.spring(this.width, { toValue: 20}).start();
    Animated.spring(this.topBarMargin, { toValue: -0.5 }).start();
  }

  unmakeX = () => {
    Animated.spring(this.containerAnim, { toValue: 0}).start();
    Animated.spring(this.topBar, { toValue: 0}).start();
    Animated.spring(this.bottomBar, { toValue: 0}).start();
    Animated.timing(this.bottomBarMargin, { toValue: 4, duration: 300}).start();
    Animated.timing(this.middleBarOpacity, { toValue: 1, duration: 300 }).start();
  }

  makeArrow = () => {
    Animated.spring(this.containerAnim, { toValue: 3 }).start();
    Animated.spring(this.topBar, { toValue: 1}).start();
    Animated.spring(this.bottomBar, { toValue: 1}).start();
    Animated.spring(this.width, { toValue: 14}).start();
    Animated.spring(this.marginLeft, { toValue: -13}).start();
    Animated.spring(this.bottomBarMargin, { toValue: 2}).start();
    Animated.spring(this.topBarMargin, { toValue: -2 }).start();
    Animated.timing(this.middleBarOpacity, { toValue: 1, duration: 300 }).start();
  }

  unmakeArrow = () => {
    Animated.spring(this.containerAnim, { toValue: 0 }).start();
    Animated.spring(this.topBar, { toValue: 0}).start();
    Animated.spring(this.bottomBar, { toValue: 0}).start();
    Animated.spring(this.width, { toValue: 20}).start();
    Animated.spring(this.marginLeft, { toValue: 0}).start();
    Animated.spring(this.bottomBarMargin, { toValue: 4}).start();
    Animated.spring(this.topBarMargin, { toValue: 0 }).start();
    Animated.spring(this.bottomBarMargin, { toValue: 4}).start();
  }

  render = () => {
    return (
      <TouchableWithoutFeedback onPress={this.spinCross}>
        <Animated.View 
          style={{
            width: 35,
            justifyContent: 'center',
            alignItems: 'center',
            height: 35,
            marginRight: 7.5,
            marginBottom: 2,
            marginLeft: 0,
            borderRadius: 50,
  			    borderWidth: 1,
  			    borderColor: this.state.active || this.state.active2 ? 'rgba(255,255,255, 1)' : 'rgba(255,255,255, 0)',
            transform: 
              [
                {rotate: this.containerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [ '0deg', '180deg' ],
                })},
                { translateX: this.state.active ? 1 : 0},
                { scale: this.state.active ? 0.9 : 1}
              ],
          }}>
          <Animated.View style={{
            height: 2,
            marginLeft: this.marginLeft,
            width: this.width,
            marginBottom: this.topBarMargin,
            backgroundColor: '#fff',
            transform: [
              {rotate: this.topBar.interpolate({
                  inputRange: [0, 1],
                  outputRange: [ '0deg', '-50deg' ],
              })}
            ]
          }} />
          <Animated.View style={{
            height: 2,
            width: 20,
            backgroundColor: '#fff',
            marginTop: 4,
            // transformOrigin: "100% 50%",
            transform: [
              {scaleX: this.middleBarOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [ 0, 1 ],
              })}
            ]}} />
          <Animated.View style={{
            height: 2,
            marginLeft: this.marginLeft,
            width: this.width,
            backgroundColor: '#fff',
            marginTop: this.bottomBarMargin,
            transform: [
              {rotate: this.bottomBar.interpolate({
                inputRange: [0, 1],
                outputRange: [ '0deg', '50deg' ],
              })}
            ]
          }} />
        </Animated.View>
      </TouchableWithoutFeedback>
	  );
  }
}
