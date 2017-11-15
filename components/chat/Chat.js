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
	Image,
	FlatList
} from 'react-native';

export default class Chat extends Component {
  constructor(props) {
  	super(props);
  	this.styles = StyleSheet.create({
  		container: {
  			position: 'absolute',
  			top: 60,
  			left: 0,
  			height: this.props.height -60,
  			width: '100%',
  			backgroundColor: '#fff',
  			zIndex: 80,
  			justifyContent: 'center',
  			alignItems: 'center'
  		},
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
				flexDirection: 'row'
			},
			headerButtonLeft: {
				height: 30,
				width: 30,
				backgroundColor: '#fff',
				borderRadius: 30/2,
				marginLeft: 10,
			},
			headerButtonRight: {
				height: 30,
				width: 30,
				backgroundColor: '#fff',
				borderRadius: 30/2,
				marginRight: 10,
			},
			messager: {
				width: '100%',
				height: 60,
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'row',
				backgroundColor: '#16B0A5'
			},
			input: {
				height: 60,
				flex: 1,
				backgroundColor: '#EFF4F4',
				padding: 2.5,
				fontSize: 16
			},
			send: {
				height: 60,
				width: 60,
				backgroundColor: '#16B0A5' 
			}
  	});
  }

  render = () => {
    return (
    	<Animated.View
    		style={this.styles.container}>
    		<TouchableWithoutFeedback
    			onPress={Keyboard.dismiss}
    			style={this.styles.dismissContainer}>
    			<View
    				style={this.styles.center}>
    				<View style={this.styles.header}>
    					<TouchableOpacity
    						style={this.styles.headerButtonLeft}>
    						<Image source={{}} />
    					</TouchableOpacity>
    					<Text
    						style={{
    							color: '#fff',
    							fontSize: 18,
    							fontWeight: '200'
    						}}>Someone's Name</Text>
    					<TouchableOpacity
    						style={this.styles.headerButtonRight}>
    						<Image source={{}} />
    					</TouchableOpacity>
    				</View>
    				<FlatList />
						<View style={this.styles.messager}>
							<TextInput 
								style={this.styles.input}
								placeholder="Message" 
								multiline={true}
								onChangeText={(text) => this.setState({text})} />
							<TouchableOpacity
								style={this.styles.send}></TouchableOpacity>
						</View>	
    			</View>
    		</TouchableWithoutFeedback>
    	</Animated.View>
    );
  }
}
