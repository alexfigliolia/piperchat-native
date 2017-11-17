import React, { Component } from 'react';
import {
	Animated,
	View,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Keyboard,
	Text,
	TextInput,
	StyleSheet,
	KeyboardAvoidingView,
	Image,
	FlatList
} from 'react-native';
import ChatBubble from './ChatBubble';
import StatusBarSizeIOS from 'react-native-status-bar-size';
import Meteor from 'react-native-meteor';

export default class Chat extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		messages: [],
  		inCall: false,
  		isHidden: false,
  		text: ''
  	}
  	this.styles = StyleSheet.create({
  		dismissContainer: {
				height: '100%',
				width: '100%',
				justifyContent: 'center',
				alignItems: 'center'
			},
			center: {
				height: '100%',
				width: '100%',
				justifyContent: 'flex-start',
				alignItems: 'center',
			},
			header: {
				backgroundColor: '#139A8F',
				height: 50,
				width: '100%',
				justifyContent: 'space-between',
				alignItems: 'center',
				flexDirection: 'row',
				shadowColor: '#000',
        shadowOffset:{  width: 0,  height: 5,  },
        shadowColor: 'black',
        shadowOpacity: 0.3,
        zIndex: 2
			},
			headerButtonLeft: {
				height: 30,
				width: 30,
				borderRadius: 30/2,
				marginLeft: 10,
				justifyContent: 'center',
				alignItems: 'center'
			},
			headerButtonRight: {
				height: 30,
				width: 30,
				borderRadius: 30/2,
				marginRight: 10,
				justifyContent: 'center',
				alignItems: 'center'
			},
			input: {
				height: 50,
				flex: 1,
				backgroundColor: '#EFF4F4',
				paddingRight: 10,
				paddingLeft: 10,
				paddingTop: 5,
				paddingBottom: 5,
				fontSize: 16,
				borderRadius: 50/2,
				marginRight: 2.5,
				marginLeft: 2.5,
			},
			send: {
				height: 50,
				width: 50,
				borderRadius: 50/2,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#16B0A5',
				marginLeft: 2.5,
				marginRight: 2.5
			}
  	});
  	this.chat = new Animated.Value(0);
  	this.hideChat = new Animated.Value(0);
  }

  componentDidMount = () => {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    StatusBarSizeIOS.addEventListener('willChange', this.adjustHeight);
    setTimeout(() => {if(this.flatList) this.flatList.scrollToEnd()}, 500);
  }

  componentWillUnmount = () => {
  	StatusBarSizeIOS.removeEventListener('willChange', this.adjustHeight);
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  componentWillReceiveProps = (nextProps) => {
  	if(nextProps.id !== null && nextProps.id !== undefined && nextProps.messages.length > 0) {
  		this.getMessages(nextProps.messages, nextProps.id);
  		setTimeout(() => {if(this.flatList) this.flatList.scrollToEnd()}, 10);
  	}	
  	if(this.props.openChats.length < nextProps.openChats.length && this.hideChat._value === this.props.height - 110) {
  		this.toggleChat();
  	}
  }

  getMessages = (messages, id) => {
  	const m = [];
  	for(let i = 0; i<messages.length; i++) {
  		const mes = messages[i];
  		if(mes.from._id === id || mes.to._id === id) m.push(mes);
  	}
  	this.setState({messages: m});
  	setTimeout(() => {if(this.flatList) this.flatList.scrollToEnd()}, 10);
  }

  keyboardWillShow = (event) => {
    Animated.timing(this.chat, { duration: event.duration, toValue: 1, }).start();
    setTimeout(() => {if(this.flatList) this.flatList.scrollToEnd()}, 10);
  }

  keyboardWillHide = (event) => {
    Animated.timing(this.chat, { duration: event.duration, toValue: 0, }).start();
  }

 	adjustHeight = (nSBH) => {
    if(nSBH !== null) {
    	if(nSBH > 20) {
    		this.setState({inCall: true});
    	} else {
    		this.setState({inCall: false});
    	}
    }
  }

  toggleChat = () => {
  	if(this.hideChat._value > 0) {
  		Animated.spring(this.hideChat, {toValue: 0}).start();
  		this.setState({isHidden: false});
  	} else {
  		Animated.spring(this.hideChat, {toValue: this.props.height - 110}).start();
  		this.setState({isHidden: true});
  	}
  	Keyboard.dismiss();
  }

  sendMessage = () => {
  	if(this.state.text !== '') {
  		Meteor.call('message.send', this.props.id, this.state.text, (error, result) => {
	      if(error) {
	        console.log(error);
	      } else {
	        this.setState({text: ''})
	      }
	    });
  	}
  }

  render = () => {
    return (
    	<Animated.View
    		style={{
	  			position: 'absolute',
	  			top: 60,
	  			left: 0,
	  			height: this.props.height -60,
	  			width: '100%',
	  			backgroundColor: '#fff',
	  			zIndex: 80,
	  			justifyContent: 'center',
	  			alignItems: 'center',
	  			transform: [
	  				{ translateY: this.hideChat }
	  			]
	  		}}>
    		<KeyboardAvoidingView
    			behavior="padding"
    			resetScrollToCoords={{ x: 0, y: 0 }}
    			style={this.styles.dismissContainer}>
    			<View
    				style={this.styles.center}>
    				<View style={this.styles.header}>
    					<TouchableOpacity
    						onPress={this.props.closeChat}
    						style={this.styles.headerButtonLeft}>
    						<Image 
    							style={{
    								height: 17.5,
    								width: 17.5,
    							}}
    							source={require('../../public/close1.png')} />
    					</TouchableOpacity>
    					<Text
    						style={{
    							color: '#fff',
    							fontSize: 18,
    							fontWeight: '200'
    						}}>{this.props.name}</Text>
    					<TouchableOpacity
    						onPress={this.toggleChat}
    						style={this.styles.headerButtonRight}>
    						<Image 
    							style={{
    								height: 22.5,
    								width: 22.5,
    							}}
    							source={this.state.isHidden ? require('../../public/up.png') : require('../../public/down-arrow.png')} />
    					</TouchableOpacity>
    				</View>
    				<Animated.View
    					style={{
								flex: 1,
								height: this.chat.interpolate({
		        			inputRange: [0, 1],
		        			outputRange: [this.props.height - 165, this.props.height - 215]
		        		}),
								width: '100%',
								transform: [
				        	{translateY: this.chat.interpolate({
				        			inputRange: [0, 1],
				        			outputRange: [this.state.inCall ? -20 : 0, this.state.inCall ? -80 : -60]
				        		})
				        	}
				        ]
							}}>
    					<FlatList
    						ref={(r) => { this.flatList = r; }}
	    					style={{
									flex: 1,
									height: '100%',
									width: '100%'
								}}
	    					data={this.state.messages}
	    					renderItem={({item}) => (
							  	<ChatBubble 
							  		text={item.text}
							  		from={item.from._id} />
							  )}
						  	keyExtractor={(item, index) => index} />
    				</Animated.View>
						<Animated.View 
							style={{
								width: '100%',
								height: 50,
								justifyContent: 'center',
								alignItems: 'center',
								flexDirection: 'row',
								backgroundColor: 'transparent',
								shadowColor: '#000',
				        shadowOffset:{ width: 0,  height: -3 },
				        shadowColor: 'black',
				        shadowOpacity: 0.2,
				        marginTop: 5,
				        transform: [
				        	{translateY: this.chat.interpolate({
				        			inputRange: [0, 1],
				        			outputRange: [this.state.inCall ? -20 : 0, this.state.inCall ? -80 : -60]
				        		})
				        	}
				        ]
							}}>
							<TextInput 
								style={this.styles.input}
								placeholder="Message" 
								multiline={true}
								value={this.state.text}
								onChangeText={(text) => this.setState({text})} />
							<TouchableOpacity
								onPress={this.sendMessage}
								style={this.styles.send}>
									<Image 
										style={{
											height: 22.5,
											width: 22.5
										}}
										source={require('../../public/sent.png')} />
								</TouchableOpacity>
						</Animated.View>	
    			</View>
    		</KeyboardAvoidingView>
    	</Animated.View>
    );
  }
}
