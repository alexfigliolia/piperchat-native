import React, { Component } from 'react';
import { 
	Animated, 
	View, 
	Text, 
	FlatList,
	TextInput,
	Button,
	Image,
	StyleSheet,
	Platform,
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
			selected: '',
			friends: this.props.friends,
			RFCW: 300
		}
		this.push = new Animated.Value(0);
		this.styles = StyleSheet.create({
			avatar: {
				width: 40,
				height: 40,
				borderRadius: 40/2,
				marginLeft: 10,
				alignSelf: 'center',
				backgroundColor: '#D7E3E3',
				...Platform.select({
	        ios: {
	          shadowColor: '#000',
	          shadowOffset: { width: 0, height: 5 },
	          shadowOpacity: 0.8,
	          shadowRadius: 5,    
	        },
	        android: {
	          elevation: 5,
	        },
	      })
			}
		});
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.friends !== this.props.friends) {
			this.setState({friends: nextProps.friends});
		}
	}

	selectFriend = (e, item) => {
		this.setState({selected: item});
		Animated.spring(this.push, { toValue: 1 }).start();
	}

	closeConfirmation = () => {
		this.setState({selected: ''});
		Animated.spring(this.push, { toValue: 0 }).start();
	}

	removeFriend = () => {
		this.closeConfirmation();
		const id = this.state.selected._id
		Meteor.call('user.removeFriend', id, (error, result) => {
			if(error) console.log(error);
		});
	}

	search = (text) => {
		this.setState({text});
		if(text === '') {
			this.setState({friends: this.props.friends});
		} else {
			const friends = this.state.friends;
			const res = [];
			for(let i = 0; i<friends.length; i++) {
				if(friends[i].name.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
					res.push(friends[i]);
				}
			}
			this.setState({friends: res});
		}
	}

	measureRFCW = (e) => {
		this.setState({ RFCW: e.nativeEvent.layout.width });
	}

	render = () => {
    return (
    	<Animated.View
    		style={{
    			width: "70%",
    			height: this.props.height - 50,
    			position: 'absolute',
    			backgroundColor: '#E3EBF0',
    			top: 60,
    			right: 0,
    			justifyContent: 'flex-start',
    			alignItems: 'center',
    			zIndex: 100,
    			transform: 
            [
            	{ translateX: this.props.rfAnim.interpolate({
	                inputRange: [0, 1],
	                outputRange: [ this.state.RFCW, 0 ],
	              })
            	}
            ],
    		}}
    		onLayout={(e) => this.measureRFCW(e)}>
    		<TouchableWithoutFeedback
    			onPress={Keyboard.dismiss}>
    			<Animated.View
	    			style={{
	    				width:'100%',
	    				justifyContent: 'center',
	    				alignItems: 'center',
	    				transform: 
	            [
	            	{ translateY: this.push.interpolate({
		                inputRange: [0, 1],
		                outputRange: [ 0, 150 ],
		              })
	            	}
	            ],
	            position: 'relative'
	    			}}>
	    			<View style={{
	    				position: 'absolute',
	    				top: -150,
	    				left: 0,
	    				width: '100%',
	    				height: 150,
	    				backgroundColor: '#139A8F',
	    				justifyContent: 'center',
	    				alignItems: 'center'
	    			}}>
	    				<Text
	    					style={{
	    						color: '#fff',
	    						fontSize: 18,
	    						fontWeight: '400',
	    						marginBottom: 20,
	    						width: '95%',
	    						textAlign: 'center'
	    					}}>Are you sure you want to remove&nbsp;
	    						{this.state.selected.name === undefined ? '' : this.state.selected.name.split(' ')[0]}?
	    					</Text>
	    					<View style={{
	    						flexDirection: 'row',
	    						width: '90%',
	    						justifyContent: 'center',
	    						alignItems: 'center'
	    					}}>
	    						<TouchableOpacity 
	    							onPress={this.closeConfirmation}
	    							style={{
	    								width: '45%',
	    								height: 30,
	    								borderRadius: 2.5,
	    								backgroundColor: "#fff",
	    								marginRight: '2.5%',
	    								justifyContent: 'center',
	    								alignItems: 'center',
	    								shadowColor: '#000',
						          shadowOffset: { width: 0, height: 2 },
						          shadowOpacity: 0.3,
	    							}}>
	    							<Text
	    								style={{
	    									fontSize: 14,
	    									color: '#139A8F',
	    									fontWeight: '600'
	    								}}>Cancel</Text>
	    						</TouchableOpacity>
	    						<TouchableOpacity
	    							onPress={this.removeFriend} 
	    							style={{
	    								width: '45%',
	    								height: 30,
	    								borderRadius: 2.5,
	    								backgroundColor: "#F53D4B",
	    								marginLeft: '2.5%',
	    								justifyContent: 'center',
	    								alignItems: 'center',
	    								shadowColor: '#000',
						          shadowOffset: { width: 0, height: 2 },
						          shadowOpacity: 0.3,
	    							}}>
	    							<Text
	    								style={{
	    									color: '#fff',
	    									fontSize: 14,
	    									fontWeight: '600'
	    								}}>Confirm</Text>
	    						</TouchableOpacity>
	    					</View>
	    			</View>
	    			<View
	    				style={{
	    					width: '100%',
	    					justifyContent: 'center',
	    					alignItems: 'center',
	    					borderBottomColor: '#C9D2DA',
			    			borderBottomWidth: 1,
			    			flexDirection: 'column'
	    				}}>
	    				<Text
			    			style={{
			    				marginTop: 30,
			    				backgroundColor: '#E3EBF0',
			    				width: '95%',
			    				maxWidth: 270,
			    				fontSize: 20,
			    				textAlign:'center',
			    				color: '#E94A5C',
			    				marginBottom: 15,
			    				fontWeight: '400',
			    			}}>Select a friend to be removed 
			    		</Text>
			    		<TextInput
			    			style={{
			    				width: '80%',
			    				height: 30,
			    				borderRadius: 30,
			    				backgroundColor: '#EBF6FF',
			    				color: '#5A5D62',
			    				textAlign: 'center',
			    				fontSize: 14,
			    				marginBottom: 12.5,
			    			}}
					    	placeholder="Find Someone"
					    	onChangeText={(text) => this.search(text)}
			    			value={this.state.text} />
	    			</View>
	    			<FlatList
	    				style={{
	    					width: '100%',
	    					maxWidth: '100%',
	    					height: this.props.height - 197.5
	    				}}
						  data={this.state.friends}
						  renderItem={({item}) => (
						  	<TouchableOpacity
						  		onPress={(e) => this.selectFriend(e, item)}
						  		style={{
						  			width: '100%',
						  			minWidth: '100%',
						  			maxWidth: '100%',
						  			height: 50,
						  			borderBottomColor: '#C9D2DA',
			    					borderBottomWidth: 1,
			    					borderTopColor: 'transparent',
			    					borderTopWidth: 0,
			    					justifyContent: 'space-between',
			    					alignItems:'center',
			    					flexDirection: 'row',
						  		}}>
						  		<Image
						  			style={this.styles.avatar} 
						  			source={item.image === null ? 
						  							require('../../public/person.png') : 
						  							{uri: item.image} } />
						  		<Text
						  			style={{
						  				marginRight: 10,
						  				alignSelf: 'center',
						  				overflow: 'hidden',
						  				color: '#8C8E93',
						  				fontSize: 16,
						  				textAlign: 'left',
						  			}}>{item.name}</Text>
						  	</TouchableOpacity> 
						  )}
						  keyExtractor={(item, index) => index}
						/>
	    		</Animated.View>
    		</TouchableWithoutFeedback>
    	</Animated.View>
    );
	}
}
