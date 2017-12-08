import React, { Component, PropTypes } from 'react';
import { Animated, View } from 'react-native';
import You from './You';
import Me from './Me';
import Connecting from './Connecting';
import ConnectionError from './ConnectionError';

export default class Dashboard extends Component {
  
  componentDidMount = () => {
    this.props.getLocalStream();
    this.props.initPeer();
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
          stream={this.props.remote} />
        <Me
          height={this.props.height}
          width={this.props.width} 
          stream={this.props.local} />
        <Connecting
          accept={this.props.accept}
          scale={this.props.scale}
          dim={this.props.dim}
          hangUpAnim={this.props.hangUpAnim}
          acceptAnim={this.props.acceptAnim}
          with={this.props.with}
          endCall={this.props.endCall}
          acceptCall={this.props.acceptCall}
          hideConnecting={this.props.hideConnecting}
          initializingCall={this.props.initializingCall}
          currentFriend={this.props.currentFriend} />
        <ConnectionError 
          error={this.props.connectionError}
          translate={this.props.errorTranslate}
          scale={this.props.errorScale}
          height={this.props.height}
          dismissConnectionError={this.props.dismissConnectionError} />
    	</Animated.View>
    );
  }
}
