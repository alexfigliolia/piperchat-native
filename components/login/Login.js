import React, { Component } from 'react';
import {
	Animated,
	View,
	Image,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard, 
  KeyboardAvoidingView
} from 'react-native';
import LoginInput from './LoginInput';
import SubmitButton from './SubmitButton';
import LinearGradient from 'react-native-linear-gradient';
import Meteor, { Accounts } from 'react-native-meteor';
import { validateEmail, validateName } from './helpers';

export default class Login extends Component {
  constructor(props) {
  	super(props);
    this.state = {
      newUser: false,
      error: "",
      animatingEntrance: false,
      loginAnim: new Animated.Value(0),
      buttonAnim: new Animated.Value(300),
      borderRadius: new Animated.Value(2),
      opacity: new Animated.Value(1),
      scale: new Animated.Value(0),
      fontSize: new Animated.Value(0),
      check: new Animated.Value(0),
      collapse: new Animated.Value(0),
      hatPosY: new Animated.Value(1),
      hatPosX: new Animated.Value(0),
      hatScale: new Animated.Value(0.5),
      hatRotate: new Animated.Value(0),
      textPosX: new Animated.Value(0),
      inputPosX: new Animated.Value(0),
      buttonPosX: new Animated.Value(0),
      toggleOptionPosX: new Animated.Value(0)
    }
    this.styles = StyleSheet.create({
      container2: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      },
      uiWrapper: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      },
      error: {
        backgroundColor: 'transparent',
        fontSize: 16,
        fontWeight: '800',
        color: '#4FE7FF',
        marginBottom: 10,
        width: '85%',
        textAlign: 'center',
      }
    });
  }

  componentDidMount = () => {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    if(this.props.user === null) {
      setTimeout(() => { this.animateEntrance() }, 200);
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if(!this.state.isLoading) this.setState({isLoading: false});
    if(nextProps.user !== null && nextProps.user !== undefined && this.props.user === null) {
      setTimeout(() => { this.hideLogin() }, 1000);
    }
    if(nextProps.user === null && this.props.user !== null) this.showLogin();
    if(nextProps.user === undefined && this.props.user !== undefined) this.showLogin();
  }

  componentWillUnmount = () => {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = async (event) => {
    Animated.parallel([
      Animated.timing(this.state.fontSize, { duration: event.duration, toValue: 1, useNativeDriver: true }),
      Animated.timing(this.state.hatPosY, { duration: event.duration, toValue: 0.3, useNativeDriver: true }),
      Animated.timing(this.state.hatScale, { duration: event.duration, toValue: 0, useNativeDriver: true })
    ]).start();
  }

  keyboardWillHide = async (event) => {
    Animated.parallel([
      Animated.timing(this.state.fontSize, { duration: event.duration, toValue: 0, useNativeDriver: true }),
      Animated.timing(this.state.hatPosY, { duration: event.duration, toValue: 0, useNativeDriver: true }),
      Animated.timing(this.state.hatScale, { duration: event.duration, toValue: 0.5, useNativeDriver: true })
    ]).start();
  }

  showLogin = async () => {
    if(!this.state.animatingEntrance) {
      this.setState({ animatingEntrance: true });
      Animated.sequence([
        Animated.timing(this.state.collapse, { toValue: 0, duration: 0, delay: 0, useNativeDriver: true }),
        Animated.timing(this.state.loginAnim, { toValue: 0, duration: 350, useNativeDriver: true })
      ]).start(() => {
        this.setState({ animatingEntrance: false });
      });
    }
  }

  hideLogin = async () => {
    Animated.sequence([
      Animated.timing(this.state.loginAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(this.state.collapse, { toValue: 1, duration: 0, useNativeDriver: true })
    ]).start();
  }

  animateEntrance = async () => {
    Animated.sequence([
      Animated.spring(this.state.hatPosX, {toValue: 1, tension: 100, useNativeDriver: true }),
      Animated.spring(this.state.hatScale, {toValue: 1, tension: 100, useNativeDriver: true }),
      Animated.spring(this.state.hatScale, {toValue: 0.5, tension: 100, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(this.state.hatScale, {toValue: 1, tension: 100, useNativeDriver: true }),
        Animated.spring(this.state.hatRotate, {toValue: 1, tension: 100, useNativeDriver: true }),
        Animated.spring(this.state.textPosX, {toValue: 1 })
      ]),
      Animated.parallel([
        Animated.spring(this.state.hatScale, {toValue: 0.5, useNativeDriver: true }),
        Animated.spring(this.state.hatRotate, {toValue: 0, useNativeDriver: true }),
        Animated.spring(this.state.hatPosY, {toValue: 0, useNativeDriver: true }),
        Animated.spring(this.state.inputPosX, {toValue: 1, useNativeDriver: true }),
        Animated.spring(this.state.buttonPosX, {toValue: 1 }),
        Animated.spring(this.state.toggleOptionPosX, {toValue: 1 }),
      ]),
    ]).start();
  }

  enterApp = async () => {
    Animated.parallel([
      Animated.spring(this.state.hatScale, {toValue: 10, tension: 100, useNativeDriver: true }),
      Animated.spring(this.state.hatRotate, {toValue: 1, tension: 100, useNativeDriver: true }),
    ]).start();
  }

  toggleNewUser = () => {
    this.setState(prevState => {
      return { newUser: !prevState.newUser }
    })
  }

  submit = async () => {
    Keyboard.dismiss();
    this.makeCircle();
    this.setState({error: ""});
    const fd = {};
    for(let ref in this.refs) {
      const r = this.refs[ref];
      if(r.state.text === "") {
        this.setState({error: "Please check your inputs and try again!"});
        this.unmakeCircle();
        break;
      } else {
        fd[r.props.objId] = r.state.text;
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
    const { Email, Password, fullName } = obj;
    if(fullName === "" || !validateName(fullName)) {
      this.setState({error: "Please enter your full name"});
      this.unmakeCircle();
    } else if(!validateEmail(Email)) {
      this.setState({error: "Please enter a valid email"});
      this.unmakeCircle();
    } else if(Password.length < 5) {
      this.setState({error: "Your password must be at least 5 characters"});
      this.unmakeCircle();
    } else {
      this.setState({error: ""});
      this.signUp(fullName, Email, Password);
    }
  }

  login = (e, p) => {
    Meteor.loginWithPassword(e.toLowerCase(), p, (err) => {
      if(err){
        this.setState({ error: err.reason });
        this.unmakeCircle();
      } else {
        this.makeCheck();
        this.setState({ error: "" });
        setTimeout(() => { 
          this.unmakeCircle();
          this.clearInputs(); 
        }, 2000)
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
            this.makeCheck();
            this.setState({ error: "" });
            Meteor.call('user.createBuddyList', (error, result) => {
              if(error) console.log(error);
            });
            setTimeout(() => {
              this.unmakeCircle();
              this.clearInputs();
            }, 2000)
          }
        });
      }
    });
  }

  clearInputs = () => {
    for(let ref in this.refs) {
      this.refs[ref].state.text = '';
      this.refs[ref].handleBlur();
    }
  }

  makeCircle = async () => {
    Animated.parallel([
      Animated.timing(this.state.buttonAnim, { toValue: 38, duration: 300 }),
      Animated.timing(this.state.borderRadius, { toValue: 38/2, duration: 300 }),
      Animated.timing(this.state.opacity, { toValue: 0, duration: 150, useNativeDriver: true  }),
      Animated.timing(this.state.scale, { toValue: 1, duration: 150, delay: 150, useNativeDriver: true })
    ]).start();
  }

  unmakeCircle = async () => {
    Animated.parallel([
      Animated.timing(this.state.buttonAnim, { toValue: 300, duration: 300 }),
      Animated.timing(this.state.borderRadius, { toValue: 2, duration: 300 }),
      Animated.timing(this.state.opacity, { toValue: 1, duration: 150, delay: 300, useNativeDriver: true }),
      Animated.timing(this.state.scale, { toValue: 0, duration: 300, delay: 0, useNativeDriver: true }),
      Animated.timing(this.state.check, { toValue: 0, duration: 300, delay: 0, useNativeDriver: true })
    ]).start();
  }

  makeCheck = async () => {
    Animated.parallel([
      Animated.timing(this.state.scale, { toValue: 0, duration: 300, delay: 0, useNativeDriver: true }),
      Animated.timing(this.state.check, { toValue: 1, duration: 300, delay: 150, useNativeDriver: true })
    ]).start();
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
          zIndex: 20957,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#139A8F',
          opacity: this.state.loginAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
          }),
          transform: 
          [
            { 
              scale: this.state.collapse.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
              })
            }
          ]
        }}>
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
          style={this.styles.uiWrapper}>
      		<LinearGradient
      			style={this.styles.container2}
      			colors={['#139A8F', '#0F776E']}>
            <KeyboardAvoidingView
              behavior="padding"
              style={this.styles.uiWrapper}>
              <Animated.View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                <Animated.Image 
                  style={{
                    height: 70, 
                    width: 70, 
                    marginBottom: -20,
                    opacity: this.props.height <= 568 && this.state.newUser ?
                    this.state.fontSize.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0]
                    }) : 1,
                    transform: [
                      {scale: this.state.hatScale.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0.75, 1, 1.3]
                        })
                      },
                      {translateY: this.state.hatPosY.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 120]
                        })
                      },
                      {translateX: this.state.hatPosX.interpolate({
                          inputRange: [0, 1],
                          outputRange: [this.props.width / -1.5, 0]
                        })
                      }, 
                      {rotate: this.state.hatRotate.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg']
                        })
                      }
                    ]
                  }}
                  source={require('../../public/pp.png')} />
                <Animated.Text 
                  style={{
                    fontSize: 65,
                    backgroundColor: 'transparent',
                    color: '#fff',
                    fontWeight: '200',
                    marginBottom: 10,
                    opacity: this.state.textPosX.interpolate({
                      inputRange: [0,1],
                      outputRange: [0, 1]
                    }),
                    transform: [
                      {scale: this.state.fontSize.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0.75]
                        })
                      },
                      {translateY: this.state.fontSize.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 20]
                        })
                      },
                      {translateX: this.state.textPosX.interpolate({
                          inputRange: [0, 1],
                          outputRange: [this.props.width / 2, 0]
                        })
                      }
                    ]
                  }}>
                  {this.state.newUser ? 'Sign Up' : 'Login'}
                </Animated.Text>
                {
                  this.state.error !== "" &&
                  <Text style={this.styles.error}>{this.state.error}</Text>
                }
                {
                  this.state.newUser &&
                  <LoginInput
                    returnType="next"
                    ref="fullName" 
                    keyboard="default"
                    for="Full Name"
                    secure={false}
                    onEnter={null}
                    objId="fullName"
                    entrance={this.state.inputPosX}
                    width={this.props.width} />
                }
                <LoginInput
                  returnType="next" 
                  ref="email"
                  keyboard="email-address"
                  for="Email"
                  onEnter={null}
                  objId="Email"
                  secure={false}
                  entrance={this.state.inputPosX}
                  width={this.props.width} />
                <LoginInput
                  returnType="go" 
                  ref="password"
                  secure={true}
                  keyboard="default"
                  for="Password"
                  onEnter={this.submit}
                  objId="Password"
                  entrance={this.state.inputPosX}
                  width={this.props.width} />
                <SubmitButton
                  scale={this.state.scale}
                  check={this.state.check}
                  opacity={this.state.opacity}
                  submit={this.submit}
                  borderRadius={this.state.borderRadius}
                  buttonAnim={this.state.buttonAnim}
                  newUser={this.state.newUser}
                  entrance={this.state.buttonPosX}
                  width={this.props.width} />
                <Animated.Text
                  style={{
                    color: '#fff',
                    backgroundColor: 'transparent',
                    fontSize: 20,
                    fontWeight: '600',
                    opacity: this.state.toggleOptionPosX.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1]
                    }),
                    transform: [
                      { 
                        translateY: this.state.toggleOptionPosX.interpolate({
                          inputRange: [0, 1],
                          outputRange: [this.props.width / 2, 0]
                        })
                      }
                    ]
                  }}>{ this.state.newUser ? "Been here before?" : "Are you new here?"}
                  <Text
                    onPress={this.toggleNewUser}
                    style={{ color: '#2BEBF0', }}>
                    { this.state.newUser ? " Login!" : " Sign Up!" }
                  </Text>
                </Animated.Text>
              </Animated.View>
            </KeyboardAvoidingView>
          </LinearGradient>
        </TouchableWithoutFeedback>
    	</Animated.View>
    );
  }
}
