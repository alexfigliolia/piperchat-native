import React, { Component } from 'react';
import { Animated, View } from 'react-native';
import {
  RTCView,
  MediaStream,
  MediaStreamTrack,
  getUserMedia
} from 'react-native-webrtc';

export default class You extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		stream: null
  	}
  }

  componentDidMount = () => {
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
		      // audio: true,
		      // video: {
		      //   mandatory: {
		      //     minWidth: this.props.width, // Provide your own width, height and frame rate here
		      //     minHeight: this.props.height - 60,
		      //     minFrameRate: 30
		      //   },
		      //   facingMode: 'user',
		      //   optional: (videoSourceId ? [{sourceId: videoSourceId}] : [])
		      // }
		      video: true
		    });
		  })
		  .then(stream => {
		    console.log(stream);
		    this.setState({stream: stream.toURL()});
		  })
		  .catch(err => console.log(err));
  }

  render = () => {
    return (
        <View 
        	style={{
            height: this.props.height - 60,
            width: '100%'
          }}>
        	<RTCView streamURL={this.state.stream} />
        </View>
    );
  }
}
