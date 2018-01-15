import React, { Component } from 'react';
import { 
	View, 
	Image, 
	TextInput, 
	Text, 
	Animated,
	TouchableOpacity,
	TouchableWithoutFeedback,
	StyleSheet,
	Keyboard
} from 'react-native';
import UploadImage from './UploadImage';
import Meteor from 'react-native-meteor';

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = { 
    	text: '',
    	showProfile: false,
    	MCW: 300,
    	inputAnim: new Animated.Value(0),
    	textAnim: new Animated.Value(0),
    	imageAnim: new Animated.Value(0)
   	}
   	this.styles = StyleSheet.create({
		  container: {
		    backgroundColor: '#E3EBF0',
				width: "70%",
				height: '100%',
				position: 'absolute',
				top: 60,
				right: 0,
				justifyContent: 'flex-start',
				alignItems: 'center',
				shadowColor: '#000',
		    shadowOffset:{ width: -5,  height: 0 },
		    shadowColor: 'black',
		    shadowOpacity: 0.5,
		    zIndex: 99,
		    transform: 
		      [
		      	{ translateX: this.props.menuAnim.interpolate({
		            inputRange: [0, 1],
		            outputRange: [ this.state.MCW, 0 ],
		          })
		      	}
		      ],
		  },
		  container2: {
		  	width: '100%',
				height: this.props.height - 60,
				justifyContent: 'flex-start',
				alignItems: 'center',
				overflow: 'hidden',
				position: 'relative'
		  },
		  container3: {
		  	width: '100%',
				height: this.props.height - 60,
				justifyContent: 'flex-start',
				alignItems: 'center',
				overflow: 'hidden',
				transform: 
        [
        	{ translateX: this.props.menuMove.interpolate({
              inputRange: [0, 1],
              outputRange: [ 0, this.state.MCW * -1 ],
            })
        	}
        ],
		  },
		  animatedText: {
		  	borderBottomColor: '#139A8F',
				color: '#74767E',
				fontSize: 22,
				borderBottomWidth: 2,
				marginTop: 20,
				marginBottom: 15,
				transform: [
					{translateX: 
						this.state.textAnim.interpolate({
							inputRange: [0, 1],
              outputRange: [ 0, this.state.MCW * -1 ],
            })
        	}
				]
		  },
		  container4: {
		  	position:'absolute',
				top: 135,
				left: 0,
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
				transform: [
					{translateX: 
						this.state.inputAnim.interpolate({
							inputRange: [0, 1],
              outputRange: [ this.state.MCW, 0 ],
            })
        	}
				]
		  },
		  textInput: {
		  	width: "80%",
  			height: 30, 
  			borderBottomColor: '#139A8F',
  			color: '#139A8F',
				borderBottomWidth: 2,
				marginTop: 25,
				marginBottom: 35,
				paddingLeft: 5,
		  },
		  privacyButton: {
		  	justifyContent: 'center',
  			alignItems: 'center',
  			borderTopColor: '#CACCD0',
  			borderTopWidth: 1,
  			width: '100%',
  			height: 45,
		  },
		  reportButton: {
		  	justifyContent: 'center',
  			alignItems: 'center',
  			borderTopColor: '#CACCD0',
  			borderTopWidth: 0.5,
  			borderBottomColor: '#CACCD0',
  			borderBottomWidth: 1,
  			width: '100%',
  			height: 45,
		  },
		  loginButton: {
		  	marginTop: 25,
  			backgroundColor: '#EC4760',
  			width: '80%',
  			height: 40,
  			justifyContent: 'center',
  			alignItems: 'center',
  			borderRadius: 5,
				shadowColor: '#000',
        shadowOffset: { width: 0,  height: 2.5, },
        shadowColor: 'black',
        shadowOpacity: 0.2,
		  }
		});
  }

  editProfile = () => {
  	this.setState(prevState => {
  		let val;
  		if(prevState.showProfile) { val = 0 } else { val = 1 }
			Animated.parallel([
				Animated.spring(this.state.inputAnim, { toValue: val, useNativeDriver: true }),
    		Animated.spring(this.state.textAnim, { toValue: val, useNativeDriver: true }),
    		Animated.spring(this.state.imageAnim, { toValue: val, useNativeDriver: true })
			]).start();
			if(val === 1) Keyboard.dismiss();
  		return { showProfile: !prevState.showProfile }
  	});
  }

  closeProfile = () => {
  	Animated.parallel([
  		Animated.spring(this.state.inputAnim, { toValue: 0, useNativeDriver: true }),
    	Animated.spring(this.state.textAnim, { toValue: 0, useNativeDriver: true }),
    	Animated.spring(this.state.imageAnim, { toValue: 0, useNativeDriver: true })
  	]).start(() => {
  		this.setState({ showProfile: false }, Keyboard.dismiss);
  	});
  }

  changeName = () => {
  	if(this.state.text.length > 5 && this.state.text !== this.props.user.name) {
  		Meteor.call('user.changeName', this.state.text, (error, result) => {
 				if(error) { 
 					console.log(error) 
 				} else { 
 					this.editProfile();
 					this.setState({text: ''});
 					Keyboard.dismiss();
 				}
 			});
  	}
  	if(this.state.text === this.props.user.name) {
  		this.editProfile();
  		this.setState({text: ''});
  		Keyboard.dismiss();
  	}
  }

  logout = () => {
  	this.props.openMenu();
  	setTimeout(() => { 
  		Meteor.logout(); 
  		Meteor.call('user.removePresence');
  	}, 300);
  }

  measureMCW = (e) => this.setState({ MCW: e.nativeEvent.layout.width });

  render = () => {
    return (
    	<Animated.View
    		style={this.styles.container}
    		onLayout={(e) => this.measureMCW(e)}>
    		<TouchableWithoutFeedback
    			onPress={Keyboard.dismiss}>
    			<Animated.View
	    			style={this.styles.container2}>
	    			<Animated.View
	    				style={this.styles.container3}>
	    				<UploadImage
	    					user={this.props.user}
	    					image={this.props.user.image}
	    					imageAnim={this.state.imageAnim}
	    					editProfile={this.editProfile}
	    					showProfile={this.state.showProfile}
	    					closeProfile={this.closeProfile} />
			    		<Animated.Text 
			    			style={this.styles.animatedText}>
			    			{this.props.user !== null ? this.props.user.name : ''}
			    		</Animated.Text>
			    		<Animated.View
			    			style={this.styles.container4}>
			    			<TextInput 
				    			style={this.styles.textInput} 
					    		value={this.state.text}
					    		placeholder={this.props.user !== null ? this.props.user.name : ''}
					    		placeholderTextColor="#139A8F"
					    		onChangeText={(text) => this.setState({text})} />
			    		</Animated.View>
				    	<TouchableOpacity
				    		onPress={this.state.text === '' ? this.editProfile : this.changeName }
				    		style={{
				    			justifyContent: 'center',
				    			alignItems: 'center',
				    			borderTopColor: '#CACCD0',
				    			borderTopWidth: 1,
				    			borderBottomWidth: 0,
				    			width: '100%',
				    			height: 45,
				    			backgroundColor: this.state.showProfile ? '#139A8F' : 'transparent'
				    		}}>
			    			<Text
					    		style={{
					    			color: this.state.showProfile ? '#fff' : '#859092',
					    			fontSize: 16,
					    			width: '100%',
					    			textAlign: 'center'
					    		}}>
					    		{ !this.state.showProfile ? 'Profile' :  this.state.text !== '' ? 'Save' : 'Close' }
					    	</Text>
					    </TouchableOpacity>
				    	<TouchableOpacity
				    		onPress={this.props.openRF}
				    		style={this.styles.privacyButton}>
					    	<Text
					    		style={{
					    			color:'#859092',
					    			fontSize: 16,
					    			width: '100%',
					    			textAlign: 'center'
					    		}}>
					    		Privacy
					    	</Text>
					    </TouchableOpacity>
				    	<TouchableOpacity
				    		onPress={this.props.openRA}
				    		style={this.styles.reportButton}>
			    			<Text
					    		style={{
					    			color: '#EC4760',
					    			fontSize: 16,
					    			width: '100%',
					    			textAlign: 'center'
					    		}}>
					    		Report Abuse
					    	</Text>
					    </TouchableOpacity>
				    	<TouchableOpacity
				    		onPress={this.logout}
				    		style={this.styles.loginButton}>
				    		<Text
					    		style={{
					    			color: '#fff',
					    			fontSize: 17,
					    			width: '100%',
					    			textAlign: 'center'
					    		}}>
					    		Log Out
					    	</Text>
				    	</TouchableOpacity>
	    			</Animated.View>
	    		</Animated.View>
    		</TouchableWithoutFeedback>
    	</Animated.View>
    );
  }
}
