import React, { Component } from 'react';
import {
	Animated,
	View,
	TextInput,
	Image,
  Text,
	TouchableOpacity,
  StyleSheet
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class Login extends Component {
  constructor(props) {
  	super(props);
    this.state = {
      newUser: false
    }
    this.input1Anim = new Animated.Value(0);
    this.input2Anim = new Animated.Value(0);
    this.input3Anim = new Animated.Value(0);
    this.styles = StyleSheet.create({
      container: {
        position: 'absolute',
        top: 0,
        left: 0,
        flex: 1,
        height: '100%',
        width: '100%',
        zIndex: 20934857,
        justifyContent: 'center',
        alignItems: 'center'
      },
      container2: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      },
      bigText: {
        fontSize: 80,
        backgroundColor: 'transparent',
        color: '#fff',
        fontWeight: '200',
        marginTop: -20,
        marginBottom: 20
      },
      inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
      },
      placeholder: {
        fontSize: 20,
        backgroundColor: 'transparent',
        color: '#fff',
        marginBottom: 0,
        width: '85%',
        maxWidth: 300,
        transform: [
          { translateY: this.input1Anim.interpolate({
              inputRange: [0, 1],
              outputRange: [ 20, 0 ],
            })
          }
        ]
      },
      input: {
        marginTop: 0,
        width: '85%',
        maxWidth: 300,
        backgroundColor: 'transparent',
        borderBottomColor: '#fff',
        borderBottomWidth: 1.5,
        color: '#fff'
      },
      button: {
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: 'transparent',
        height: 45,
        width: '85%',
        maxWidth: 300,
        borderColor: '#fff',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2.5,
      },
    });
  }

  toggleNewUser = () => {
    this.setState(prevState => {
      return { newUser: !prevState.newUser }
    })
  }

  handleFocus = () => {
    Animated.spring(this.input1Anim, { toValue: 1}).start();
    Animated.spring(this.input2Anim, { toValue: 1}).start();
    Animated.spring(this.input3Anim, { toValue: 1}).start();
  }

  handleBlur = () => {
    Animated.spring(this.input1Anim, { toValue: 0}).start();
    Animated.spring(this.input2Anim, { toValue: 0}).start();
    Animated.spring(this.input3Anim, { toValue: 0}).start();
  }

  render = () => {
    return (
    	<Animated.View
    		style={this.styles.container}>
    		<LinearGradient
    			style={this.styles.container2}
    			colors={['#139A8F', '#0F776E']}>
          <Image 
            style={{height: 100, width: 100, marginBottom: 0}}
            source={require('../../public/pp.png')} />
          <Text style={this.styles.bigText}>Login</Text>
          {
            this.state.newUser &&
            <View style={this.styles.inputContainer}>
              <Animated.Text 
                style={this.styles.placeholder}>Full Name</Animated.Text>
              <TextInput
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                selectionColor="#fff" 
                style={this.styles.input} />
            </View>
          }
          <View style={this.styles.inputContainer}>
            <Animated.Text 
              keyboardType="email-address"
              style={this.styles.placeholder}>Email</Animated.Text>
            <TextInput
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              selectionColor="#fff" 
              style={this.styles.input} />
          </View>
          <View style={this.styles.inputContainer}>
            <Animated.Text 
              style={this.styles.placeholder}>Password</Animated.Text>
            <TextInput
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              selectionColor="#fff" 
              secureTextEntry="true"
              style={this.styles.input} />
          </View>
          <TouchableOpacity
            style={this.styles.button}>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: '800'
              }}>{this.state.newUser ? "Sign Up" : "Login"}</Text>
          </TouchableOpacity>
          <Text
            style={{
              color: '#fff',
              backgroundColor: 'transparent',
              fontSize: 20,
              fontWeight: '600'
            }}>{ this.state.newUser ? "Been here before?" : "Are you new here?"}
            <Text
              onPress={this.toggleNewUser}
              style={{
                color: '#2BEBF0'
              }}> { this.state.newUser ? "Login!" : "Sign Up!" }</Text>
          </Text>
        </LinearGradient>
    	</Animated.View>
    );
  }
}
