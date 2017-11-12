import React, { Component } from 'react';
import { 
	Animated, 
	View, 
	Text, 
	FlatList,
	TextInput,
	Button,
	Image,
} from 'react-native';

export default class ReportAbuse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: ''
		}
	}

	render = () => {
    return (
    	<Animated.View
    		style={{
    			width: "70%",
    			height: '100%',
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
	                outputRange: [ 300, 0 ],
	              })
            	}
            ],
    		}}>
    		<Animated.View
    			style={{
    				width:'100%',
    				justifyContent: 'center',
    				alignItems: 'center',
    			}}>
    			<View
    				style={{
    					width: '100%',
    					justifyContent: 'center',
    					alignItems: 'center',
    					borderBottomColor: '#C9D2DA',
		    			borderBottomWidth: 1
    				}}>
    				<Text
		    			style={{
		    				marginTop: 30,
		    				backgroundColor: '#E3EBF0',
		    				width: '95%',
		    				maxWidth: 270,
		    				fontSize: 18,
		    				textAlign:'center',
		    				color: '#E94A5C',
		    				marginBottom: 15,
		    				fontWeight: '400',
		    			}}>Select a friend who you would like to no longer be able to contact you
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
		    			value={this.state.text}
				    	placeholder="Find Someone"
				    	onChangeText={(text) => this.setState({text})}
		    			value={this.state.text} />
    			</View>
    			<FlatList
    				style={{
    					width: '100%',
    					maxWidth: '100%',
    					marginBottom: 140,
    				}}
					  data={[{key: 'Joe Schmoe'}, {key: 'Squidward'}, {key: 'Joe Schmoe'}, {key: 'Squidward'}, {key: 'Joe Schmoe'}, {key: 'Squidward'},{key: 'Joe Schmoe'}, {key: 'Squidward'},{key: 'Joe Schmoe'}, {key: 'Squidward'}, {key: 'Joe Schmoe'}, {key: 'Squidward'}, {key: 'Joe Schmoe'}, {key: 'Squidward'}, {key: 'Joe Schmoe'}, {key: 'Squidward'}, {key: 'Joe Schmoe'}, {key: 'Squidward'}, {key: 'Joe Schmoe'}, {key: 'Squidward'},{key: 'Joe Schmoe'}, {key: 'Squidward'}, {key: 'Joe Schmoe'}, {key: 'Squidward'}, {key: 'Joe Schmoe'}, {key: 'Squidward'}, {key: 'Joe Schmoe'}, {key: 'Squidward'}]}
					  renderItem={({item}) => (
					  	<View
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
					  			style={{
					  				width: 40,
					  				height: 40,
					  				borderRadius: 40/2,
					  				marginLeft: 20,
					  				alignSelf: 'center'
					  			}} 
					  			source={require('../../public/cityweb-small.jpg')}/>
					  		<Text
					  			style={{
					  				marginRight: 20,
					  				alignSelf: 'center',
					  				overflow: 'hidden',
					  				color: '#8C8E93',
					  				fontSize: 16,
					  				textAlign: 'left',
					  			}}>{item.key}</Text>
					  	</View> 
					  )}
					/>
    		</Animated.View>
    	</Animated.View>
    );
	}
}
