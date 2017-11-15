import React, { Component } from 'react';
import {
	Animated,
	FlatList
} from 'react-native';
import UserItem from './UserItem';

export default class UserList extends Component {
  constructor(props) {
  	super(props);
  }

  checkPresent = (item) => {
  	let isOn = false;
  	const states = this.props.states;
  	for(let i = 0; i<states.length; i++) {
  		if(item._id === states[i].userId) {
  			isOn = true;
  			break;
  		}
  	}
  	return isOn;
  }

  render = () => {
    return (
    	<Animated.View style={{height: this.props.height, width: '33.33333%'}}>
    		<FlatList
					style={{
						width: this.props.width,
						maxWidth: this.props.width,
						height: this.props.height,
						marginBottom: 55,
					}}
				  data={this.props.listData}
				  renderItem={({item}) => (
				  	<UserItem 
				  		width={this.props.width}
				  		for={this.props.for} 
				  		image={item.image}
				  		name={item.name}
				  		label={item.label}
				  		id={item._id}
				  		item={item}
				  		checkPresent={this.checkPresent} /> 
				  )}
				  keyExtractor={(item, index) => index}
				/>
    	</Animated.View>
    );
  }
}
