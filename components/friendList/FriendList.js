import React, { Component } from 'react';
import {
	Animated,
	View,
	Text,
	Image,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	FlatList,
	StyleSheet,
	Keyboard,
	Platform
} from 'react-native';
import UserList from './UserList';

export default class FriendList extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		LCW: null,
  		requests: [],
  		search: [],
  		text: ''
  	}
  	this.styles = StyleSheet.create({
  		center: {
  			alignItems: 'center',
  			width: '100%',
  			height: this.props.height,
  			justifyContent: 'flex-start',
        overflow: 'hidden',
  		},
  		header: {
  			alignItems: 'center',
  			width: '100%',
  			justifyContent: 'flex-start',
  			borderBottomWidth: 1,
  			borderBottomColor: '#BDD0CC',
  		},
  		horizontalCenter: {
  			justifyContent: 'center',
  			alignItems: 'center',
  			width: '100%',
  			flexDirection: 'row',
  			marginTop: 20,
  		}
  	});
  	this.slider = new Animated.Value(1);
  	this.curList = [];
  }

  componentDidMount = () => {
  	this.filterRequests(this.props);
  }

  componentWillReceiveProps = (nextProps) => {
  	if(nextProps.friends !== this.props.friends ||
  		 nextProps.sentRequests !== this.props.sentRequests ||
  		 nextProps.requests !== this.props.requests) this.filterRequests(nextProps);
  }

  measureLCW(e) {
  	this.setState({ LCW: e.nativeEvent.layout.width/3 });
  }

  selectTab = (e, tab) => {
  	if(tab === 'friends') Animated.spring(this.slider, { toValue: 1, useNativeDriver: true, tension: 150, friction: 12.5}).start();
  	if(tab === 'requests') Animated.spring(this.slider, { toValue: 0, useNativeDriver: true, tension: 150, friction: 12.5}).start();
  	if(tab === 'users') Animated.spring(this.slider, { toValue: -1, useNativeDriver: true, tension: 150, friction: 12.5}).start();
  	this.setState({text: ''});
  	this.curList = null;
  	Keyboard.dismiss();
  }

  filterRequests = (path) => {
  	const sr = path.sentRequests.map(item => {
  		item.label = 'sent';
  		return item;
  	});
  	const r = path.requests.map(item => {
  		item.label = 'received';
  		return item;
  	});
  	this.setState({requests: r.concat(sr)});
  }

  focus = () => {
  	if(this.slider._value > 0.5) {
  		this.curList = this.props.friends;
  	} else if(this.slider._value < 0){
  	 this.curList = this.props.users;
  	} else {
  		this.curList = this.state.requests;
  	}
  }

  blur = () => {
  	this.curList = null;
  }

  search = (text) => {
  	this.setState({text});
  	if(text === '') {
  		this.setState({search: []});
  	} else {
  		if(this.curList !== null) {
  			let res = [];
	  		for(let i = 0; i<this.curList.length; i++) {
	  			if(this.curList[i].name.toLowerCase().indexOf(text.toLowerCase()) !== -1) res.push(this.curList[i]);
	  		}
	  		this.setState({search: res});
  		}
  	}
  }

  render() {
    return (
    	<Animated.View 
    		style={{
	  			backgroundColor: '#E3EBF0',
					width: "70%",
					height: this.props.height - 60,
					position: 'absolute',
					top: 60,
					left: 0,
					justifyContent: 'flex-start',
					alignItems: 'center',
					shadowColor: '#000',
			    shadowOffset:{ width: 5,  height: 0 },
			    shadowColor: 'black',
			    shadowOpacity: 0.3,
			    zIndex: 98,
			    transform: 
			      [
			      	{ translateX: this.props.anim.interpolate({
			            inputRange: [0, 1],
			            outputRange: [ (this.state.LCW + 10)/-1, 0 ],
			          })
			      	}
			      ],
	  		}}>
    		<View style={this.styles.center}>
    			<TouchableWithoutFeedback 
    				onPress={Keyboard.dismiss}
    				style={this.styles.center}>
    				<View
    					style={this.styles.center}>
    					<View style={this.styles.header}>
    						<View style={{
			    					justifyContent: 'space-between',
						  			alignItems: 'center',
						  			width: '100%',
						  			flexDirection: 'row',
						  			marginTop: 0,
			    				}}>
		    					<TouchableOpacity
		    						onPress={(e) => this.selectTab(e, 'friends')}
		    						tab='friends' 
		    						style={{ width: '33.333333334%', height: 55, justifyContent: 'center', alignItems: 'center', backgroundColor: '#75D39C'}}>
		    						<Text style={{ color: '#fff'}}>Friends</Text>
                    {
                      this.props.unread.length > 0 &&
                      <View 
                        style={{
                          height: 20,
                          width: 20,
                          backgroundColor: '#EE3B3B',
                          borderRadius: 20/2,
                          alignSelf: 'center',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            padding: 0,
                            fontSize: 10,
                            textAlign: 'center'
                          }}>{this.props.unread.length}</Text>
                      </View>
                    }
		    					</TouchableOpacity>
		    					<TouchableOpacity
		    						onPress={(e) => this.selectTab(e, 'requests')}
		    						tab='requests' 
		    						style={{ width: '33.333333334%', height: 55, justifyContent: 'center', alignItems: 'center', backgroundColor: '#A4ABF3'}}>

    								<View 
    									style={{
    										justifyContent: 'center',
    										alignItems: 'center',
    										flexDirection: 'row',
    										width: '100%',
    										maxWidth: '100%',
    										flexWrap: 'wrap'
    									}}>
    									<Text style={{color: '#fff'}}>Requests </Text>
    									{
    										this.props.requests.length > 0 &&
    										<View 
    											style={{
    												height: 20,
    												width: 20,
    												backgroundColor: '#EE3B3B',
    												borderRadius: 20/2,
    												alignSelf: 'center',
    												justifyContent: 'center',
    												alignItems: 'center'
    											}}>
    											<Text
    												style={{
    													color: '#fff',
    													padding: 0,
    													fontSize: 10,
    													textAlign: 'center'
    												}}>{this.props.requests.length}</Text>
    										</View>
    									}
    								</View>

		    					</TouchableOpacity>
		    					<TouchableOpacity
		    						onPress={(e) => this.selectTab(e, 'users')}
		    						tab='users' 
		    						style={{ width: '33.333333334%', height: 55, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8BCFF1'}}>
		    						<Text style={{ color: '#fff'}}>Users</Text>
		    					</TouchableOpacity>
		    				</View>
		    				<TextInput 
		    					style={{
		    						marginTop: 15,
		    						backgroundColor: "#fff",
		    						width: '82.5%',
		    						borderRadius: 35/2,
		    						height: 25,
		    						textAlign: 'center',
		    						fontSize: 14,
		    						marginBottom: 15
		    					}}
		    					placeholder="Find Someone"
		    					onFocus={this.focus}
		    					onBlur={this.blur}
						    	onChangeText={(text) => this.search(text)}
				    			value={this.state.text} />
    					</View>
	    				<Animated.View 
	    					onLayout={(e) => this.measureLCW(e)}
	    					style={{
	    						flexDirection: 'row', 
	    						width: '300%', 
	    						transform: [ 
	    								{translateX: this.slider.interpolate({
	    										inputRange: [-1, 0, 1],
	    										outputRange: [this.state.LCW * -1, this.state.LCW * 0, this.state.LCW * 1 ]
	    									})
	    								}
	    							]
	    						}}>
	    					<UserList
		    					listData={this.state.text !== '' && this.slider._value === 1 ? this.state.search : this.props.friends}
		    					height={this.props.height - 115}
		    					active={true}
		    					for="friends"
		    					width={this.state.LCW}
		    					states={this.props.states}
                  unread={this.props.unread}
                  toggleChatOptions={this.props.toggleChatOptions} />
		    				<UserList
		    					listData={this.state.text !== '' && this.slider._value === 0 ? this.state.search : this.state.requests}
		    					height={this.props.height - 115}
		    					active={true}
		    					width={this.state.LCW}
		    					for="requests" />
		    				<UserList
		    					listData={this.state.text !== '' && this.slider._value === -1 ? this.state.search : this.props.users}
		    					height={this.props.height - 115}
		    					active={true}
		    					width={this.state.LCW}
		    					for="users" />
	    				</Animated.View>
    				</View>
    			</TouchableWithoutFeedback>
    		</View>
    	</Animated.View>
    );
  }
}
