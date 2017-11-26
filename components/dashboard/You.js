import React, { Component } from 'react';
import { Animated, View } from 'react-native';
import {
  RTCView
} from 'react-native-webrtc';

export default class You extends Component {
  render = () => {
    return (
      <View
      	style={{
      		height: this.props.height,
          width: '100%'
      	}}>
      	<RTCView
      		style={{
      			height: '100%',
          	width: '100%'
      		}}
      		streamURL={this.props.stream} />
      </View>
    );
  }
}
