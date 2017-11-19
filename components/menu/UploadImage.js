import React, { Component } from 'react';
import {
	Image,
	View,
	TouchableOpacity,
	Animated,
	StyleSheet,
	ImagePickerIOS
} from 'react-native';
import axios from 'axios';
import Meteor from 'react-native-meteor';
import { CloudConfig, AxiosConfig } from './CloudConfig';

export default class UploadImage extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		profileImage: null
  	}
  	this.styles = {
  		imageContainer: {
				justifyContent: 'center',
				alignItems: 'center',
				borderRadius: 100/2,
				position: 'relative',
				shadowColor: '#000',
	      shadowOffset:{ width: 0,  height: 5 },
	      shadowRadius: 5,
	      shadowColor: 'black',
	      shadowOpacity: 0.3,
	      marginTop: 40,
	      backgroundColor: '#C5CDD1',
				transform: 
		      [
		      	{ rotateY: this.props.imageAnim.interpolate({
		            inputRange: [0, 1],
		            outputRange: [ '0deg', '180deg' ],
		          })
		      	},
		      	{ perspective: 1000 }
		      ],
			},
		  image: {
		  	marginTop: 2,
		  	borderRadius: 100/2,
        height: 100,
        width: 100,
        backfaceVisibility: 'hidden',
        transform: 
	        [
	        	{ rotateY: this.props.imageAnim.interpolate({
	              inputRange: [0, 1],
	              outputRange: [ '0deg', '180deg' ],
	            })
	        	}
	        ],
		  },
  	}
  }

  componentWillReceiveProps = (nextProps) => {
  	if(nextProps !== this.props) {
  		this.setState({
  			profileImage: nextProps.user === null || nextProps.user.image === null  || nextProps.user.image === undefined ? null : nextProps.user.image
  		});
  	}
  }

  pickImage = () => {
    ImagePickerIOS.openSelectDialog({}, img => {
      this.setState({ profileImage: img }, this.uploadToCloudinary(img));
    }, error => console.log(error));
  }

  uploadToCloudinary = (img) => {
  	this.props.editProfile();
  	const match = /\.(\w+)$/.exec(img);
		const type = match ? `image/${match[1]}` : `image`;
    const photo = { uri: img, type: type, name: img.split('/').pop() };
    const fd = new FormData();
    fd.append('upload_preset', CloudConfig.preset);
	  fd.append('file', photo);
    axios.post(CloudConfig.url, fd, AxiosConfig)
	  .then( res => {
	    let url = res.data.secure_url.split('/');
      url.splice(-2, 0, 'q_auto/f_auto/w_200,h_200,c_fill');
      url = url.join('/');
	    Meteor.call('user.addImage', url, (error, result) => {
	    	if(error) {
	    		console.log(error);
	    	} else {
	    		Meteor.call('user.cleanImage', url, (error, result) => {
	    			if(error) console.log(error);
	    		}); 
	    	}
	    });
	  }).catch( err => console.log(err) );
  }

  render = () => {
    return (
    	<Animated.View
				style={this.styles.imageContainer}>
				<Animated.Image
					style={this.styles.image}
					source={this.state.profileImage === null ?
									require('../../public/person.png') :
									{uri: this.state.profileImage} } />
				<Animated.View
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 100,
						width: 100,
						justifyContent: 'center',
						alignItems: 'center',
						backfaceVisibility: 'hidden',
						transform: 
				      [
				      	{ rotateY: this.props.imageAnim.interpolate({
				            inputRange: [0, 1],
				            outputRange: [ '180deg', '0deg' ],
				          })
				      	}
				      ],
					}}>
					<TouchableOpacity
	  				onPress={this.props.showProfile ? this.pickImage : null}
						style={{
							height: 100,
							width: 100,
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: '#139A8F',
							borderRadius: 100/2,
						}}>
						<Image	
	  					style={{
	  						height: 50,
	  						width: 50
	  					}}
	  					source={require('../../public/upload.png')} />
					</TouchableOpacity>
				</Animated.View>
			</Animated.View>
    );
  }
}
