import React, { Component } from 'react';
import { 
	Animated, 
	View, 
	Text, 
	TextInput,
	TouchableOpacity 
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
    			top: 60,
    			right: 0,
    			justifyContent: 'flex-start',
    			alignItems: 'center',
    			zIndex: 100,
    			backgroundColor: '#E3EBF0',
    			transform: 
            [
            	{ translateX: this.props.raAnim.interpolate({
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
				    	onPress={this.props.openRA}
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
    		</Animated.View>
    	</Animated.View>
    );
	}
}
