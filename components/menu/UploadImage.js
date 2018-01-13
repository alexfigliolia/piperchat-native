import React, { Component } from 'react';
import {
	Image,
	View,
	TouchableOpacity,
	Animated,
	StyleSheet,
	ImagePickerIOS,
	Text
} from 'react-native';
import Axios from 'axios';
import Meteor from 'react-native-meteor';
import { CloudConfig } from './CloudConfig';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default class UploadImage extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		profileImage: null,
  		uploading: false,
  		progress: 0,
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
  	const { profileImage } = this.state; 
  	if(nextProps.user === null && profileImage !== null) {
  		this.setState({ profileImage: null });
  	}
  	if(nextProps.image !== profileImage) {
  		this.setState({ profileImage: nextProps.image });
  	}
  }

  uploadToCloudinary = (img) => {
		const match = /\.(\w+)$/.exec(img);
		const type = match ? `image/${match[1]}` : `image`;
	  const photo = { uri: img, type: type, name: img.split('/').pop() };
	  const fd = new FormData();
	  fd.append('upload_preset', CloudConfig.preset);
	  fd.append('file', photo);
	  Axios.post(CloudConfig.url, fd, { onUploadProgress: progressEvent => this.calcProgress(progressEvent) })
	  .then( res => {
	    let url = res.data.secure_url.split('/');
	    url.splice(-2, 0, 'q_auto/f_auto/w_200,h_200,c_fill');
	    url = url.join('/');
	    Meteor.call('user.addImage', url, (error, result) => {
	    	if(error) console.log(error);
	    });
	  }).catch( err => console.log(err) );
	}

  pickImage = () => {
    ImagePickerIOS.openSelectDialog({}, img => {
      this.setState({ profileImage: img, uploading: true }, () => {
      	this.uploadToCloudinary(img);
      });
    }, error => console.log(error));
  }

  calcProgress = (progressEvent) => {
  	const progress = Math.round( (progressEvent.loaded * 100) / progressEvent.total);
  	this.setState({ progress });
  	if(progress == 100) this.uploaded();
  }

  uploaded = () => this.setState({ uploading: false }, this.props.closeProfile);

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
							overflow: 'hidden'
						}}>
							{
								this.state.uploading ?
								<AnimatedCircularProgress
								  size={100}
								  width={5}
								  fill={parseInt(this.state.progress)}
								  tintColor='#1CDCCD'
								  backgroundColor='#139A8F'>
								 	{
								    (fill) => (
								      <Animated.Text style={{
								      	color: '#fff',
								      	fontSize: 30,
								      	fontWeight: '300',
								      	transform: [{ rotateY: '180deg'}],
								      	backfaceVisibility: 'visible'
								      }}>
								        { `${this.state.progress}%` }
								      </Animated.Text>
								    )
								  }
								</AnimatedCircularProgress>
								: 
								<Image	
			  					style={{ height: 50, width: 50 }}
			  					source={require('../../public/upload.png')} />
							}
					</TouchableOpacity>
				</Animated.View>
			</Animated.View>
    );
  }
}
