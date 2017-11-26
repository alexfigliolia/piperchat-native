import React, { Component } from 'react';
import { View, Image, TouchableWithoutFeedback } from 'react-native';
import Burger from './Burger';

export default class Header extends Component {
  render = () => {
    return (
    	<View 
        style={{
          height: 60,
          width: '100%',
      		backgroundColor: '#0F776E',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexDirection: 'row',
          shadowColor: '#000',
          shadowOffset:{  width: 0,  height: 5,  },
          shadowColor: 'black',
          shadowOpacity: 0.6,
          zIndex: 500
      	}}>
        <TouchableWithoutFeedback
          onPress={this.props.openFriendList}
          style={{
            height: 47.5,
            width: 47.5
          }}>
          <Image
            style={{
              height: 32.5,
              width: 32.5,
              marginLeft: 10,
              marginBottom: 5,
              marginRight: 7.5
            }}
            source={require('../../public/people.png')} />
        </TouchableWithoutFeedback>
    		<Image
          style={{
            height: 30,
            width: 95,
            marginBottom: 7.5
          }}
          source={require('../../public/piper.jpg')} />
        <Burger
          openMenu={this.props.openMenu}
          raActive={this.props.raActive}
          rfActive={this.props.rfActive}
          menuActive={this.props.menuActive} />
    	</View>
    );
  }
}
