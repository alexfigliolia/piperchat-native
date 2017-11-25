import React, { Component, PropTypes } from 'react';
import { Animated, View } from 'react-native';
import You from './You';

export default class Dashboard extends Component {
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
          ]
    		}}>
        <You
          height={this.props.height}
          width={this.props.width} 
          stream={this.props.local} />
    	</Animated.View>
    );
  }
}
