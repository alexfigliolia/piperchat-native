import React, { Component } from 'react';
import { View, Image, TouchableWithoutFeedback, Animated, Text } from 'react-native';
// import Burger from './Burger';
import Burg from './Burg';

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
            width: 47.5,
            position: 'relative'
          }}>
          <View>
            <Image
              style={{
                height: 32.5,
                width: 32.5,
                marginLeft: 10,
                marginBottom: 5,
                marginRight: 7.5
              }}
              source={require('../../public/people.png')} />
            {
              this.props.unread.length > 0 &&
              <Animated.View
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  height: 20,
                  width: 20,
                  backgroundColor: '#FC3A4C',
                  borderRadius: 20/2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{ 
                    color: '#fff', 
                    fontSize: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}>{this.props.unread.length}</Text>
                </Animated.View>
            }
          </View>
        </TouchableWithoutFeedback>
    		<Image
          style={{
            height: 30,
            width: 95,
            marginBottom: 7.5
          }}
          source={require('../../public/piper.jpg')} />
{/*        <Burger
          openMenu={this.props.openMenu}
          raActive={this.props.raActive}
          rfActive={this.props.rfActive}
          menuActive={this.props.menuActive} />*/}
        <Burg
          openMenu={this.props.openMenu}
          raActive={this.props.raActive}
          rfActive={this.props.rfActive}
          menuActive={this.props.menuActive} />
    	</View>
    );
  }
}
