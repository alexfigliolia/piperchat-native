import React from 'react';
import {
	Animated,
	View,
	TouchableWithoutFeedback,
	Text,
	Image,
	StyleSheet
} from 'react-native';

const SubmitButton = (props) => {
  return (
  	<Animated.View
      style={{
        marginTop: 25,
        marginBottom: 20,
        backgroundColor: 'transparent',
        height: 38,
        width: '85%',
        maxWidth: props.buttonAnim,
        borderColor: '#fff',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: props.borderRadius,
        overflow: 'hidden',
        opacity: props.entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1]
        }),
        transform: [
          {translateY: props.entrance.interpolate({
              inputRange: [0, 1],
              outputRange: [props.width / 2, 0]
            })
          }
        ]
      }}>
      <TouchableWithoutFeedback
        onPress={props.submit}
        style={{
			    width: "100%", 
			    height: 38, 
			    backgroundColor: 'transparent',
			    justifyContent: 'center',
			    alignItems: 'center',
			    position: 'relative'
			  }}>
        <View
        	style={{
				    width: "100%", 
				    height: 38, 
				    backgroundColor: 'transparent',
				    justifyContent: 'center',
				    alignItems: 'center',
				    position: 'relative'
				  }}>
        	<Animated.Image 
	          source={require('../../public/loader.gif')}
	          style={{
	            position: 'absolute',
	            top: 4,
	            left: 3,
	            width: 30,
	            height: 30,
	            transform: [
	              { scale: props.scale.interpolate({
	                  inputRange: [0, 1],
	                  outputRange: [0, 1]
	                }) 
	              }
	            ]
	          }} />
	        <Animated.Image 
	          source={require('../../public/check.png')}
	          style={{
	            position: 'absolute',
	            top: 4,
	            left: 3,
	            width: 30,
	            height: 30,
	            zIndex: 2,
	            transform: [
	              { scale: props.check.interpolate({
	                  inputRange: [0, 1],
	                  outputRange: [0, 1]
	                }) 
	              }
	            ]
	          }} />
	        <Animated.Text
	          onTouch={props.submit}
	          style={{
	            color: '#fff',
	            fontSize: 16,
	            fontWeight: '800',
	            opacity: props.opacity,
	          }}>{props.newUser ? "SIGN UP" : "LOGIN"}</Animated.Text>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

export default SubmitButton;
