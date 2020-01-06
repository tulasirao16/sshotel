import React from 'react';
import async from 'async';
import { BackHandler, View, Animated, TouchableHighlight, TouchableOpacity, ScrollView, Image, StatusBar, Dimensions } from 'react-native';
import { Icon, Text } from 'native-base';
import { inject, observer } from 'mobx-react';
import styles from './css/CreatePropertyCss';
import { Video } from 'expo';
import { LinearGradient } from 'expo-linear-gradient';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['PropertyStore'])
@observer
export default class PropertyImages extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    this.state = {
      shift: new Animated.Value(0),
      indexPositions: [],
      propertyTitle: navigation.state.params && navigation.state.params.propertyData && navigation.state.params.propertyData.propertyTitle ? navigation.state.params.propertyData.propertyTitle : 'Create Property',
      photos: navigation.state.params && navigation.state.params.propertyData && navigation.state.params.propertyData.propertyImages ? navigation.state.params.propertyData.propertyImages : [],
      errorMessage: '',
      loading: false,
      shouldPlay: false
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }

  handleBackButtonClick = () => {
    const navigation = this.props.navigation
    navigation.state.params.onNavigateBack(this.state.photos)
    navigation.goBack()
    return true
  }

  handleSelect(i) {
    let value = this.state.indexPositions;
    // let getIndex = value.find(data => (data == i));
    // if(getIndex == '0' || getIndex ) {
    let j = value.indexOf(i);
    if (j !== -1) {
      value.splice(j, 1);
    } else {
      value.push(i);
    }
    this.setState({ indexPositions: value });
  }

  handleDelete() {
    let imageData = this.state.photos;
    let indexs = this.state.indexPositions;
    let _this = this;
    async.series([
      function (callback) {
        indexs.sort(function (a, b) { return b - a });
        callback(null, indexs);
      },
      function (callback) {
        indexs.forEach(function (i) {
          imageData.splice(i, 1);
        });
        callback(null, imageData);
      }
    ], function (err, results) {
      _this.setState({ photos: imageData, indexPositions: [] });
    });
  }

  hanldeGoBack = () => {
    const navigation = this.props.navigation;
    navigation.state.params.onNavigateBack(this.state.photos)
    navigation.goBack();
  }
  render() {
    const { shift } = this.state;
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
          <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <StatusBar barStyle='light-content' />
            <View style={styles.status} />
            <View style={styles.headerMainView} >
              <View style={styles.headerLeft} >
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={this.hanldeGoBack}>
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
                </TouchableHighlight>
              </View>
              <View style={styles.headerBody} >
                <Text style={styles.headerTitleStyle}> {this.state.propertyTitle} </Text>
              </View>
              <View style={styles.headerRight}>
                <TouchableHighlight style={styles.menu_button} onPress={() => this.handleDelete()}>
                  <Icon name='md-trash' style={styles.trashIconStyle} />
                </TouchableHighlight>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.bodyContainer}>
            <View style={styles.scrollInfoImagesView}>
              <ScrollView>
                {this.state.photos && this.state.photos.length > 0 ? this.state.photos.map((item, i) =>
                  <TouchableOpacity onLongPress={() => this.handleSelect(i)} onPress={() => this.handleSelect(i)} key={i}>
                  {this.state.indexPositions.indexOf(i) >= 0
                  ? <View style={styles.selectedId}>
                      {item.localUri
                        ? <Image source={{ uri: item.localUri }} style={styles.imageStyle} />
                        : <View style={styles.videoStyles}>
                          <Video
                            source={{ uri: item.video }}
                            shouldPlay={this.state.shouldPlay}
                            isLooping={true}
                            resizeMode="cover"
                            style={{ height: 250 }}
                          />
                          <View style={{position: 'absolute', bottom:25, left:10, zIndex:999, width:40, height:40, borderRadius:50, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(255, 255, 255, 0.8)' }}><Icon name={this.state.shouldPlay ? 'ios-pause' : 'ios-videocam'} style={{ color: '#025d8c', fontSize:32,  }} onPress={() => this.setState({ shouldPlay: !this.state.shouldPlay })} /></View>
                        </View>
                      }
                    </View>
                  : <View style={styles.imageViewPropertyImages}>
                  {item.localUri
                    ? <Image source={{ uri: item.localUri }} style={styles.imageStyle} />
                    : <View style={styles.videoStyles}>
                      <Video
                        source={{ uri: item.video }}
                        shouldPlay={this.state.shouldPlay}
                        isLooping={true}
                        resizeMode="cover"
                        style={{ height: 240 }}
                      />
                      <View style={{position: 'absolute', bottom:25, left:10, zIndex:999, width:40, height:40, borderRadius:50, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(255, 255, 255, 0.8)' }}><Icon name={this.state.shouldPlay ? 'ios-pause' : 'ios-videocam'} style={{ color: '#025d8c', fontSize:32,  }} onPress={() => this.setState({ shouldPlay: !this.state.shouldPlay })} /></View>
                    </View>
                  }
                </View> }  
                  </TouchableOpacity>
                ) : null}
              </ScrollView>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }
}
