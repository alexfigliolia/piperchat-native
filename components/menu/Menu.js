import React, { Component } from 'react';
import { 
	View, 
	Image, 
	TextInput, 
	Text, 
	Animated,
	TouchableOpacity,
	StyleSheet
} from 'react-native';
import UploadImage from './UploadImage';
import Meteor from 'react-native-meteor';

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = { 
    	text: '',
    	showProfile: false
   	}
   	this.inputAnim = new Animated.Value(0);
   	this.textAnim = new Animated.Value(0);
   	this.imageAnim = new Animated.Value(0);
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
		    shadowOffset:{ width: 5,  height: 0 },
		    shadowColor: 'black',
		    shadowOpacity: 0.6,
		    zIndex: 99,
		    transform: 
		      [
		      	{ translateX: this.props.menuAnim.interpolate({
		            inputRange: [0, 1],
		            outputRange: [ 300, 0 ],
		          })
		      	}
		      ],
		  },
		  container2: {
		  	width: '100%',
				height: '100%',
				justifyContent: 'flex-start',
				alignItems: 'center',
				overflow: 'hidden',
				position: 'relative'
		  },
		  container3: {
		  	width: '100%',
				height: '100%',
				justifyContent: 'flex-start',
				alignItems: 'center',
				overflow: 'hidden',
				transform: 
        [
        	{ translateX: this.props.menuMove.interpolate({
              inputRange: [0, 1],
              outputRange: [ 0, -300 ],
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
						this.textAnim.interpolate({
							inputRange: [0, 1],
              outputRange: [ 0, -230 ],
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
						this.inputAnim.interpolate({
							inputRange: [0, 1],
              outputRange: [ 280, 0 ],
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
  			height: 40,
		  },
		  reportButton: {
		  	justifyContent: 'center',
  			alignItems: 'center',
  			borderTopColor: '#CACCD0',
  			borderTopWidth: 0.5,
  			borderBottomColor: '#CACCD0',
  			borderBottomWidth: 1,
  			width: '100%',
  			height: 40,
		  },
		  loginButton: {
		  	marginTop: 15,
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
  		if(prevState.showProfile) {
  			Animated.spring(this.inputAnim, { toValue: 0}).start();
    		Animated.spring(this.textAnim, { toValue: 0}).start();
    		Animated.spring(this.imageAnim, { toValue: 0}).start();
  		} else {
  			Animated.spring(this.inputAnim, { toValue: 1}).start();
    		Animated.spring(this.textAnim, { toValue: 1}).start();
    		Animated.spring(this.imageAnim, { toValue: 1}).start();
  		}
  		return { showProfile: !prevState.showProfile }
  	});
  }

  logout = () => {
  	Meteor.logout();
  }

  render = () => {
    return (
    	<Animated.View
    		style={this.styles.container}>
    		<Animated.View
    			style={this.styles.container2}>
    			<Animated.View
    				style={this.styles.container3}>
    				<UploadImage
    					user={this.props.user}
    					imageAnim={this.imageAnim}
    					editProfile={this.editProfile} />
		    		<Animated.Text 
		    			style={this.styles.animatedText}>
		    			Alex Figliolia
		    		</Animated.Text>
		    		<Animated.View
		    			style={this.styles.container4}>
		    			<TextInput 
			    			style={this.styles.textInput} 
				    		value={this.state.text}
				    		placeholder="Alex Figliolia"
				    		placeholderTextColor="#139A8F"
				    		onChangeText={(text) => this.setState({text})} />
		    		</Animated.View>
			    	<TouchableOpacity
			    		onPress={this.editProfile}
			    		style={{
			    			justifyContent: 'center',
			    			alignItems: 'center',
			    			borderTopColor: '#CACCD0',
			    			borderTopWidth: 1,
			    			borderBottomWidth: 0,
			    			width: '100%',
			    			height: 40,
			    			backgroundColor: this.state.showProfile ? '#139A8F' : 'transparent'
			    		}}>
		    			<Text
				    		style={{
				    			color: this.state.showProfile ? '#fff' : '#859092',
				    			fontSize: 16,
				    			width: '100%',
				    			textAlign: 'center'
				    		}}>
				    		{ this.state.showProfile ? 'Close' : 'Profile' }
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
				    			color: '#859092',
				    			fontSize: 16,
				    			width: '100%',
				    			textAlign: 'center'
				    		}}>
				    		ReportAbuse
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
    	</Animated.View>
    );
  }
}
