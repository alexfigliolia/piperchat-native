import React, { Component } from 'react';
import { 
	Animated, 
	View, 
	Text, 
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Keyboard
} from 'react-native';
import Meteor from 'react-native-meteor';

export default class ReportAbuse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			RACW: 300
		}
		this.thanks = new Animated.Value(0);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.raAnim._value === 1) {
			this.closeThankyou();
		}
	}

	submit = () => {
		Keyboard.dismiss();
		if(this.state.text !== '') {
			Meteor.call('user.reportAbuse', this.state.text, (error, result) => {
				if(error){
					console.log(error);
				} else {
					this.setState({text: ''});
					this.thankyou();
				}
			});
		} 
	}

	thankyou = () => {
		Animated.spring(this.thanks, { toValue: 1, useNativeDriver: true }).start();
	}

	closeThankyou = () => {
		Animated.spring(this.thanks, { toValue: 0, useNativeDriver: true }).start();
	}

	measureRACW = (e) => {
		this.setState({ RACW: e.nativeEvent.layout.width });
	}

	cancel = () => {
		this.setState({text: ''}, () => {
			Keyboard.dismiss();
			this.props.openRA();
		});
	}

	render = () => {
    return (
    	<Animated.View
    		onLayout={(e) => this.measureRACW(e)}
    		style={{
    			width: "70%",
    			height: this.props.height - 60,
    			position: 'absolute',
    			top: 60,
    			right: 0,
    			justifyContent: 'flex-start',
    			alignItems: 'center',
    			zIndex: 100,
    			backgroundColor: '#E3EBF0',
    			overflow: 'hidden',
    			transform: 
            [
            	{ translateX: this.props.raAnim.interpolate({
	                inputRange: [0, 1],
	                outputRange: [ this.state.RACW, 0 ],
	              })
            	}
            ],
    		}}>
    		<Animated.View
    			style={{
    				width:'100%',
    				height: '100%',
    				justifyContent: 'center',
    				alignItems: 'center',
    				transform: [
    						{translateX: this.thanks.interpolate({
    								inputRange: [0,1],
    								outputRange: [0, this.state.RACW * -1]
    							})
    						}
    					]
    			}}>
    			<TouchableWithoutFeedback
    				onPress={Keyboard.dismiss}
    				style={{
    					width: '100%',
    					height: '100%',
    					justifyContent: 'center',
    					alignItems: 'center',
    				}}>
    				<View
    					style={{
    						width: '100%',
	    					height: '100%',
	    					justifyContent: 'flex-start',
	    					alignItems: 'center',
	    					position: 'relative'
    					}}>
    					<Animated.View
		    				style={{
		    					width: '100%',
		    					position:'absolute',
		    					top: 150,
		    					left: 0,
		    					justifyContent: 'center',
		    					alignItems: 'center',
		    					transform: [
		    						{translateX: this.state.RACW }
		    					]
		    				}}>
		    				<Text 
		    					style={{
		    						fontSize: 24,
		    						fontWeight: '700',
		    						color: '#139A8F',
		    						width: '92.5%',
		    						textAlign: 'center',
		    						marginBottom: 15,
		    					}}>Thank You!</Text>
		    				<Text
		    					style={{
		    						width: '92.5%',
		    						textAlign: 'center',
		    						fontSize: 15,
		    						fontWeight: '200',
		    						marginBottom: 20
		    					}}>We at Piper Chat appreciate the time you've taken to make our platform a better place</Text>
		    				<TouchableOpacity
		    					onPress={this.closeThankyou}
		    					style={{
		    						backgroundColor: '#139A8F',
		    						height: 35,
		    						width: '40%',
		    						borderRadius: 5,
		    						shadowColor: '#000',
					          shadowOffset: { width: 0,  height: 2.5, },
					          shadowColor: 'black',
					          shadowOpacity: 0.2,
					          justifyContent: 'center',
					          alignItems: 'center'
		    					}}>
		    					<Text 
		    						style={{
		    							color: '#fff', 
		    							fontSize: 16, 
		    							fontWeight: '600'
		    						}}>Go Back</Text>
		    				</TouchableOpacity>
		    			</Animated.View>
		    			<Text
			    			style={{
			    				backgroundColor: 'transparent',
			    				marginTop: 40,
			    				width: '92.5%',
			    				fontSize: 26,
			    				textAlign:'center',
			    				color: '#DC4D57',
			    				marginBottom: 10,
			    				fontWeight: '600',
			    			}}>Report Abuse</Text>
		    			<Text
			    			style={{
			    				backgroundColor: '#E3EBF0',
			    				width: '95%',
			    				fontSize: 16,
			    				textAlign:'center',
			    				marginBottom: 15,
			    				fontWeight: '200',
			    				color: '#0F776E'
			    			}}>Please use this area to report any misuse of our platform</Text>
			    		<TextInput
			    			style={{
			    				height: 150,
			    				width: '90%',
			    				backgroundColor: '#fff',
			    				overflow: 'hidden',
			    				marginBottom: 20,
			    				borderRadius: 5,
									shadowColor: '#000',
				          shadowOffset: { width: 0,  height: 2.5, },
				          shadowColor: 'black',
				          shadowOpacity: 0.2,
				          padding: 5,
				          fontSize: 14
			    			}}
			    			multiline={true}
		    				numberOfLines={4}
		    				placeholder="Please include the names of any users involved"
		    				placeholderTextColor="#2D2F31"
			    			value={this.state.text}
					    	onChangeText={(text) => this.setState({text})} />
					    <View
					    	style={{
					    		width: '100%',
					    		justifyContent: 'center',
					    		flexDirection: 'row',
					    		alignItems: 'center'
					    	}}>
					    	<TouchableOpacity
						    	onPress={this.cancel}
					    		style={{
					    			width: '40%',
					    			marginRight: '2.5%',
					    			borderRadius: 5,
										shadowColor: '#000',
					          shadowOffset: { width: 0,  height: 2.5, },
					          shadowColor: 'black',
					          shadowOpacity: 0.2,
					    			backgroundColor: '#fff',
					    			justifyContent: 'center',
					    			alignItems: 'center',
					    			height: 35
					    		}}>
						    	<Text style={{ color: '#139A8F', fontSize: 16, fontWeight: '600' }}>Cancel</Text>
						    </TouchableOpacity>
						    <TouchableOpacity
						    	onPress={this.submit}
						    	style={{
					    			width: '40%',
					    			marginLeft: '2.5%',
					    			backgroundColor: '#139A8F',
					    			borderRadius: 5,
										shadowColor: '#000',
					          shadowOffset: { width: 0,  height: 2.5, },
					          shadowColor: 'black',
					          shadowOpacity: 0.2,
					          justifyContent: 'center',
					    			alignItems: 'center',
					    			height: 35
					    		}}>
						    	<Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Submit</Text>
						    </TouchableOpacity>
					    </View>
    				</View>
    			</TouchableWithoutFeedback>
    		</Animated.View>
    	</Animated.View>
    );
	}
}
