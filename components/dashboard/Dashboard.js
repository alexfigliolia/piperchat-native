import React, { Component, PropTypes } from 'react';
import { View } from 'react-native'

export default class Dashboard extends Component {
  render = () => {
    return (
    	<View
    		style={{
    			backgroundColor: '#2F3034',
    			height: this.props.height - 60,
    			width: '100%',
                flex: 1
    		}}>
    	</View>
    );
  }
}
