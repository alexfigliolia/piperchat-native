import React, { Component } from 'react';
import {
	Animated,
	View,
	TextInput,
	Image,
  Text,
	TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import LoginInput from './LoginInput';
import LinearGradient from 'react-native-linear-gradient';
import Meteor, { Accounts } from 'react-native-meteor';
import { validateEmail, validateName } from './helpers';

export default class Login extends Component {
  constructor(props) {
  	super(props);
    this.state = {
      newUser: false,
      error: ""
    }
    this.loginAnim = new Animated.Value(0);
    this.buttonAnim = new Animated.Value(300);
    this.borderRadius = new Animated.Value(2);
    this.opacity = new Animated.Value(1);
    this.scale = new Animated.Value(0);
    this.height = null;
    this.width = null;
    this.styles = StyleSheet.create({
      container2: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      },
      bigText: {
        fontSize: 50,
        backgroundColor: 'transparent',
        color: '#fff',
        fontWeight: '200',
        marginTop: -20,
        marginBottom: 20
      },
      error: {
        backgroundColor: 'transparent',
        fontSize: 16,
        fontWeight: '800',
        color: '#4FE7FF',
        marginBottom: 10,
        width: '85%',
        textAlign: 'center',
      },
    });
  }

  componentDidMount = () => {
    const {height, width} = Dimensions.get('window');
    this.width = width;
    this.height = height;
  }

  componentWillReceiveProps = (nextProps) => {
    if(!nextProps.loggedIn) {
      this.showLogin();
    } else {
      this.hideLogin();
    }
  }

  showLogin = () => {
    Animated.timing(this.loginAnim, { toValue: 0, duration: 500, userNativeDriver: true }).start();
  }

  hideLogin = () => {
    Animated.timing(this.loginAnim, { toValue: 1, duration: 500, userNativeDriver: true }).start();
  }

  toggleNewUser = () => {
    this.setState(prevState => {
      return { newUser: !prevState.newUser }
    })
  }

  submit = () => {
    this.makeCircle();
    this.setState({error: ""});
    const fd = {};
    let num = 0;
    for(let ref in this.refs) {
      const r = this.refs[ref];
      if(r.state.text === "") {
        this.setState({error: "Please check your inputs and try again!"});
        this.unmakeCircle();
        break;
        num --;
      } else {
        fd[r.props.objId] = r.state.text;
        num ++;
      }
    }
    if(this.state.newUser) {
      this.validateSignUp(fd);
    } else {
      this.validateLogin(fd);
    }
  }

  validateLogin(obj) {
    const e = obj.Email || "";
    const p = obj.Password || "";
    if(!validateEmail(e) || p.length < 5) {
      this.setState({ error: "Please try again!"});
      this.unmakeCircle();
    } else {
      this.setState({ error: "" });
      this.login(e, p);
    }
  }

  validateSignUp(obj) {
    const e = obj.Email;
    const p = obj.Password;
    const n = obj.fullName;
    if(n === "" || !validateName(n)) {
      this.setState({error: "Please enter your full name"});
      this.unmakeCircle();
    } else if(!validateEmail(e)) {
      this.setState({error: "Please enter a valid email"});
      this.unmakeCircle();
    } else if(p.length < 5) {
      this.setState({error: "Your password must be at least 5 characters"});
      this.unmakeCircle();
    } else {
      this.setState({error: ""});
      this.signUp(n, e, p);
    }
  }

  login = (e, p) => {
    Meteor.loginWithPassword(e.toLowerCase(), p, (err) => {
      if(err){
        this.setState({ error: err.reason });
        this.unmakeCircle();
      } else {
        this.setState({ error: "" });
      }
    });
  }

  signUp = (n, e, p) => {
    Accounts.createUser({name: n, email: e.toLowerCase(), password: p}, (err) => {
      if(err){
        this.setState({ error: err.reason });
        this.unmakeCircle();
      } else {
        Meteor.loginWithPassword(e, p, (err) => {
          if(err) {
            this.setState({ error: err.reason });
            this.unmakeCircle();
          } else {
            this.setState({ error: "" });
            Meteor.call('user.createBuddyList', (error, result) => {
              if(error) {
                console.log(error);
              } else {
                console.log(result);
              }
            });
          }
        });
      }
    });
  }

  makeCircle = () => {
    Animated.timing(this.buttonAnim, { toValue: 38, duration: 300, userNativeDriver: true }).start();
    Animated.timing(this.borderRadius, { toValue: 38/2, duration: 300, userNativeDriver: true }).start();
    Animated.timing(this.opacity, { toValue: 0, duration: 150, userNativeDriver: true }).start();
    Animated.timing(this.scale, { toValue: 1, duration: 150, delay: 150, userNativeDriver: true }).start();
  }

  unmakeCircle = () => {
    Animated.timing(this.buttonAnim, { toValue: 300, duration: 300, userNativeDriver: true }).start();
    Animated.timing(this.borderRadius, { toValue: 2, duration: 300, userNativeDriver: true }).start();
    Animated.timing(this.opacity, { toValue: 1, duration: 150, delay: 300, userNativeDriver: true }).start();
    Animated.timing(this.scale, { toValue: 0, duration: 150, delay: 0, userNativeDriver: true }).start();
  }

  render = () => {
    return (
    	<Animated.View
    		style={{
          position: 'absolute',
          top: 0,
          left: 0,
          flex: 1,
          height: '100%',
          width: '100%',
          zIndex: 20934857,
          justifyContent: 'center',
          alignItems: 'center',
          transform: 
            [
              { translateY: this.loginAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, this.height * -1]
                })
              }
            ]
        }}>
    		<LinearGradient
    			style={this.styles.container2}
    			colors={['#139A8F', '#0F776E']}>
          <Image 
            style={{height: 70, width: 70, marginBottom: 0}}
            source={require('../../public/pp.png')} />
          <Text 
            style={this.styles.bigText}>
            {this.state.newUser ? 'Sign Up' : 'Login'}
          </Text>
          {
            this.state.error !== "" &&
            <Text style={this.styles.error}>{this.state.error}</Text>
          }
          {
            this.state.newUser &&
            <LoginInput
              ref="fullName" 
              keyboard="default"
              for="Full Name"
              secure={false}
              objId="fullName" />
          }
          <LoginInput 
            ref="email"
            keyboard="email-address"
            for="Email"
            objId="Email"
            secure={false} />
          <LoginInput 
            ref="password"
            secure={true}
            keyboard="default"
            for="Password"
            objId="Password" />
          <Animated.View
            style={{
              marginTop: 25,
              marginBottom: 20,
              backgroundColor: 'transparent',
              height: 38,
              width: '85%',
              maxWidth: this.buttonAnim,
              borderColor: '#fff',
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: this.borderRadius,
              overflow: 'hidden'
            }}>
            <TouchableOpacity
              onPress={this.submit}
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
                    { scale: this.scale.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1]
                      }) 
                    }
                  ]
                }} />
              <Animated.Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: '800',
                  opacity: this.opacity,
                }}>{this.state.newUser ? "SIGN UP" : "LOGIN"}</Animated.Text>
            </TouchableOpacity>
          </Animated.View>
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
                color: '#2BEBF0',
              }}>
                { this.state.newUser ? " Login!" : " Sign Up!" }
            </Text>
          </Text>
        </LinearGradient>
    	</Animated.View>
    );
  }
}
