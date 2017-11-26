import React, { Component, PropTypes } from 'react';
import { Animated, View } from 'react-native';
import {
  MediaStream,
  MediaStreamTrack,
  getUserMedia
} from 'react-native-webrtc';
import You from './You';
import Me from './Me';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      local: null,
      remote: null
    }
  }

  componentDidMount = () => {
    this.getLocalStream();
  }

  getLocalStream = () => {
    MediaStreamTrack
      .getSources()
      .then(sourceInfos => {
        // console.log(sourceInfos);
        let videoSourceId;
        for (let i = 0; i < sourceInfos.length; i++) {
          const sourceInfo = sourceInfos[i];
          if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
            videoSourceId = sourceInfo.id;
          }
        }
        return getUserMedia({
          audio: true,
          video: {
            mandatory: {
              minWidth: this.props.width,
              minHeight: this.props.height,
              minFrameRate: 30
            },
            facingMode: 'user',
            optional: (videoSourceId ? [{sourceId: videoSourceId}] : [])
          }
        });
      })
      .then(stream => {
        console.log(stream);
        this.setState({ local: stream.toURL(), remote: stream.toURL() });
      })
      .catch(err => console.log(err));
  }

  render = () => {
    return (
    	<Animated.View
    		style={{
    			backgroundColor: '#2F3034',
    			height: this.props.height - 60,
    			width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [
            {translateX: this.props.anim.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [
                  this.props.width * -0.7,
                  0,
                  this.props.width * 0.7
                ]
              })
            }
          ],
          position: 'relative'
    		}}>
        <You
          height={this.props.height}
          width={this.props.width} 
          stream={this.state.remote} />
        <Me
          height={this.props.height}
          width={this.props.width} 
          stream={this.state.local} />
    	</Animated.View>
    );
  }
}
