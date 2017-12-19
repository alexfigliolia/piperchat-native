import React from 'react';
import { Animated, View } from 'react-native';
import {
  RTCView
} from 'react-native-webrtc';

const You = (props) => {
  return (
    <View
    	style={{ height: props.height, width: '100%' }}>
    	<RTCView
    		style={{ height: '100%', width: '100%' }}
    		streamURL={props.stream} />
    </View>
  );
}

export default You;
