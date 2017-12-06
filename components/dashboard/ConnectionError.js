import React from 'react';
import {
	Animated,
	View,
	Text,
	TouchableOpacity
} from 'react-native';

const ConnectionError = (props) => {
  return (
  	<Animated.View
			style={{
				height: '100%',
				width: '100%',
				position: 'absolute',
				top: 0,
				left: 0,
				justifyContent: 'center',
				alignItems: 'center',
		    transform: [
		    	{
		    		translateY: props.translate.interpolate({
		    			inputRange: [0, 1],
		    			outputRange: [props.height, 0]
		    		})
		    	},
		    	{
		    		scale: props.scale.interpolate({
		    			inputRange: [0, 1],
		    			outputRange: [0.5, 1]
		    		})
		    	}
		    ]
			}}>
  		<View
  			style={{
  				width: '90%',
  				maxWidth: 300,
  				backgroundColor: '#fff',
  				justifyContent: 'center',
  				alignItems: 'center',
  				padding: 20,
  				borderRadius: 5,
  				shadowColor: '#000',
			    shadowOffset:{ width: 0,  height: 5 },
			    shadowColor: 'black',
			    shadowOpacity: 0.6,
			    shadowRadius: 15,
  			}}>
  			<Text
  				style={{
  					fontSize: 20,
  					fontWeight: '700',
  					color: '#0F776E',
  					marginBottom: 15
  				}}>We are very sorry</Text>
  			<Text
  				style={{
  					textAlign: 'center',
  					fontSize: 15,
  					marginBottom: 20
  				}}>{props.error}</Text>
  			<TouchableOpacity
  				onPress={props.dismissConnectionError}
  				style={{
  					backgroundColor: '#0F776E',
  					borderRadius: 2.5,
  					height: 40,
  					width: 120,
  					justifyContent: 'center',
  					alignItems: 'center'
  				}}>
  				<Text
  					style={{
  						color: '#fff'
  					}}>Dismiss</Text>
  			</TouchableOpacity>
  		</View>
  	</Animated.View>
  );
}

export default ConnectionError;
