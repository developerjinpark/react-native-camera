import React from 'react';
import { StyleSheet, Text, ScrollView, View, Image, Button, TouchableHighlight } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import * as ImageManipulator from 'expo-image-manipulator'
import {Camera} from 'expo-camera'
import Constants from 'expo-constants'
import {vw} from 'react-native-expo-viewport-units'

export default class App extends React.Component {
  state = {
    chosenImage: null,
    takenImage: null,
    customCameraReady: false,
    cameraType: Camera.Constants.Type.back
  }

  _launchCameraRollAsync = async () => {
    let {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (status !== 'granted') {
      console.error('Camera roll perms not granted')
      return
    }

    let img = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    })
    
    this.setState({chosenImage: img})
  }

  _launchCameraAsync = async () => {
    let {status} = await Permissions.askAsync(Permissions.CAMERA)
    if (status !== 'granted') {
      console.error('Camera perms not granted')
      return
    }

    let img = await ImagePicker.launchCameraAsync({allowsEditing: true})
    let flippedImage = await ImageManipulator.manipulateAsync(img.uri, [
      {flip: {vertical: false, horizontal: true}}
    ])
    this.setState({takenImage: flippedImage})
  }

  _launchCustomCameraAsync = async () => {
    let {status} = await Permissions.askAsync(Permissions.CAMERA)
    if (status !== 'granted') {
      console.error('Camera perms not granted')
      return
    }

    this.setState({customCameraReady: true})

  }

  _flipCamera = () => {
    if (this.state.cameraType == Camera.Constants.Type.back) {
      this.setState({cameraType: Camera.Constants.Type.front})
    } else {
      this.setState({cameraType: Camera.Constants.Type.back})
    }
  }

  componentDidMount() {
    this._launchCustomCameraAsync()
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>Photos</Text>
        <View style={{flexDirection: 'row'}}>
          <Image source={require('./assets/1.jpg')} style={{height: vw(50), width: vw(50)}} />
          <Image source={require('./assets/2.jpg')} style={{height: vw(50), width: vw(50)}} />
        </View>
        <Button title="Launch Camera Roll" onPress={() => this._launchCameraRollAsync()} />
        <Button title="Launch Camera" onPress={() => this._launchCameraAsync()} />
        {this.state.customCameraReady && 
          <TouchableHighlight onPress={() => {this._flipCamera()}}>
            <Camera
              style={{
                height: vw(100),
                width: vw(100)
              }}
              type={this.state.cameraType}
            />
          </TouchableHighlight>
        }
        {this.state.chosenImage && 
          <Image 
            source={{uri: this.state.chosenImage.uri}}
            style={{
              height: 200,
              width: 200,
            }}
          />
        }
        {this.state.takenImage &&
          <Image
            source={{uri: this.state.takenImage.uri}}
            style={{
              height: 200,
              width: 200,
            }}
          />
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
});
