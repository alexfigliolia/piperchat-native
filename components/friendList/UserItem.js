import React, { Component } from 'react';
import {
	TouchableOpacity,
	Image,
	Text,
	View,
	StyleSheet,
	Platform
} from 'react-native';
import Meteor from 'react-native-meteor';

class UserItem extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		inAction: false,
  		hasNew: false
  	}
  	this.styles = StyleSheet.create({
  		avatar: {
				width: 35,
				height: 35,
				borderRadius: 35/2,
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

  sendRequest = (e) => {
  	this.setState({inAction: true});
  	Meteor.call('user.sendRequest', this.props.id, (error, result) => {
  		if(error) { console.log(error) } else { this.setState({inAction: false}) }
  	});
  }

  acceptRequest = (e) => {
  	this.setState({inAction: true});
  	Meteor.call('user.acceptRequest', this.props.id, (error, result) => {
  		if(error) { console.log(error) } else { this.setState({inAction: false}) }
  	});
  }

  denyRequest = (e) => {
  	this.setState({inAction: true});
  	Meteor.call('user.denyRequest', this.props.id, (error, result) => {
  		if(error) { console.log(error) } else { this.setState({inAction: false}) }
  	});
  }

  render = () => {
    return (
    	<TouchableOpacity
	  		onPress={this.props.toggleChatOptions !== undefined ? (e) => this.props.toggleChatOptions(e, this.props.item) : null}
	  		style={{
					width: this.props.width,
					minWidth: this.props.width,
					maxWidth: this.props.width,
					height: 50,
					borderBottomColor: '#C9D2DA',
					borderBottomWidth: 1,
					borderTopColor: 'transparent',
					borderTopWidth: 0,
					justifyContent: 'space-between',
					alignItems:'center',
					flexDirection: 'row',
					backgroundColor: this.props.hasUnread ? '#fff' : 'transparent'
				}}>
	  		<Image
	  			style={this.styles.avatar} 
	  			source={this.props.image === null ? require('../../public/person.png') : {uri: this.props.image} } />
	  		<Text 
	  			style={{
						marginRight: 0,
						alignSelf: 'center',
						overflow: 'hidden',
						color: '#8C8E93',
						fontSize: 16,
						textAlign: 'center',
						width: this.props.for === 'requests' ? this.props.width - 115 : this.props.width - 95
					}}>{this.props.name}</Text>
	  		{
	  			this.props.for === 'friends' &&
	  			<View
	  				style={{
	  					height: 10,
	  					width: 10,
	  					borderRadius: 10/2,
	  					backgroundColor: this.props.checkPresent(this.props.item) ? '#74E172' : '#B8C2B8',
	  					marginRight: 10
	  				}}></View>
	  		}
	  		{
	  			this.props.for === 'requests' &&
	  			<View
	  				style={{
	  					justifyContent: 'center',
	  					alignItems: 'center',
	  					flexDirection: 'row',
	  					marginRight: 5
	  				}}>
	  				{
	  					this.props.label === 'received' ? 
	  					<View style={{
		  					justifyContent: 'center',
		  					alignItems: 'center',
		  					flexDirection: 'row',
	  					}}>
	  						<TouchableOpacity
	  							onPress={this.denyRequest}
			  					style={{
			  						height: 30,
			  						width: 30,
			  						borderRadius: 30/2,
			  						backgroundColor: '#D52C40',
			  						justifyContent: 'center',
			  						alignItems: 'center',
			  						marginRight: 2.5
			  					}}>
			  					<Image 
			  						style={{
			  							height: 20,
			  							width: 20
			  						}}
			  						source={this.state.inAction ? require('../../public/loader.gif') : require('../../public/close.png')} />
			  				</TouchableOpacity>
			  				<TouchableOpacity
			  					onPress={this.acceptRequest}
			  					style={{
			  						height: 30,
			  						width: 30,
			  						borderRadius: 30/2,
			  						backgroundColor: '#5EDC6E',
			  						justifyContent: 'center',
			  						alignItems: 'center',
			  						marginLeft: 2.5
			  					}}>
			  					<Image 
			  						style={{
			  							height: 20,
			  							width: 20
			  						}}
			  						source={this.state.inAction ? require('../../public/loader.gif') : require('../../public/check.png')} />
			  				</TouchableOpacity> 
	  					</View>
		  				:
		  				<View
		  					style={{
		  						height: 30,
		  						width: 30,
		  						borderRadius: 30/2,
		  						backgroundColor: '#9A7FD8',
		  						justifyContent: 'center',
		  						alignItems: 'center',
		  						marginRight: 5
		  					}}>
		  					<Image 
		  						style={{
		  							height: 15,
		  							width: 15,
		  							marginLeft: 2
		  						}}
		  						source={require('../../public/sent.png')}/>
		  				</View>
	  				}
	  			</View>
	  		}
	  		{
	  			this.props.for === 'users' &&
	  			<TouchableOpacity
	  				onPress={this.sendRequest}
						style={{
							height: 30,
							width: 30,
							borderRadius: 30/2,
							backgroundColor: '#17B9AD',
							justifyContent: 'center',
							alignItems: 'center',
							marginRight: 10
						}}>
						<Image 
							style={{
								height: 22.5,
								width: 22.5,
							}}
							source={this.state.inAction ? require('../../public/loader.gif') : require('../../public/add.png')} />
					</TouchableOpacity> 
	  		}
	  	</TouchableOpacity>
    );
  }
}

export default UserItem;
