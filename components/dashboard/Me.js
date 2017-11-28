import React, { Component } from 'react';
import { 
	Animated, 
	View,
	PanResponder
} from 'react-native';
import { RTCView } from 'react-native-webrtc';

export default class Me extends Component {
	constructor(props) {
		super(props);
		this.state = {
        pan: new Animated.ValueXY(),
        scale: new Animated.Value(1)
    }
    this.panResponder = null;
	}

  componentWillMount = () => {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e, gesture) => {
        const x = this.getXBound();
        const y = this.getYBound();
        this.state.pan.setOffset({
          x: x, 
          y: y
        });
        this.state.pan.setValue({x: 0, y: 0});
        Animated.spring(this.state.scale, { toValue: 1.1 }).start();
      },
      onPanResponderMove: Animated.event([null,{
          dx : this.state.pan.x,
          dy : this.state.pan.y
      }]),
      onPanResponderRelease: (e, {vx, vy}) => {
        this.state.pan.flattenOffset();
        const x = this.getXBound();
        const y = this.getYBound();
        Animated.spring(this.state.scale, { toValue: 1 }).start();
        Animated.spring(
          this.state.pan,
          {
            toValue: {
              x: x,
              y: y
            }
          }
        ).start();
      }
    });
  }

  componentWillReceiveProps = (nextProps) => {
    if(this.props.stream === null && nextProps.stream !== this.props.stream) {
      Animated.timing(this.state.pan, {
        toValue: {
          x: 0, 
          y: ((this.props.height - 55) - ((this.props.height - 57.5) * 0.3333)) * -1
        }
      }).start();
    }
  }

  getXBound = () => {
    const xMax = (this.props.width - (this.props.width * 0.285714)) * -1;
    const x1 = this.state.pan.x._value > 0 ? 0 : this.state.pan.x._value;
    const x2 = x1 < xMax ? xMax : x1;
    return x2;
  }

  getYBound = () => {
    const yMax = ((this.props.height - 55) - ((this.props.height - 57.5) * 0.3333)) * -1;
    const y1 = this.state.pan.y._value > 0 ? 0 : this.state.pan.y._value;
    const y2 = y1 < yMax ? yMax : y1;
    return y2;
  }

	render = () => {
    return (
    	<Animated.View
    		style={this.state.pan.getLayout(), {
    			height: this.props.height / 3.5,
          width: '28.57142%',
    			position: 'absolute',
    			bottom: 0,
    			right: 0,
    			backgroundColor: '#139A8F',
    			borderRadius: 5,
          transform: [
            {translateX: this.state.pan.x },
            {translateY: this.state.pan.y},
            {scale: this.state.scale}
          ],
          shadowColor: '#000',
          shadowOffset:{ width: 0,  height: 5 },
          shadowColor: 'black',
          shadowOpacity: 0.3,
          shadowRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10
    		}}
    		{...this.panResponder.panHandlers}>
    		<RTCView
      		style={{
      			height: '100%',
          	width: '100%',
            borderRadius: 5
      		}}
      		streamURL={this.props.stream} />
    	</Animated.View>
    );
	}
}
