import React from 'react';
import async from 'async';
import { View, Animated, TouchableOpacity, ActivityIndicator, TouchableHighlight, ScrollView, Image, StatusBar, BackHandler } from 'react-native';
import { Icon, Text } from 'native-base';
import { inject, observer } from 'mobx-react';
import styles from './css/CreatePropertyCss';
import { Video } from 'expo';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from 'i18n-js';
import { PUBLIC_DOMAIN } from '../../../constants';
import Toast, { DURATION } from 'react-native-easy-toast';
import AwesomeButton from 'react-native-really-awesome-button';

@inject(['PropertyStore'])
@observer
export default class PropertyImagesEdit extends React.Component {
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
      deleteIDs: [],
      positions: [],
      imagesPath: [],
      propertyID: navigation.state.params && navigation.state.params.propertyData && navigation.state.params.propertyData.propertyID ? navigation.state.params.propertyData.propertyID : '',
      imagePath: navigation.state.params && navigation.state.params.propertyData && navigation.state.params.propertyData.imagePath ? navigation.state.params.propertyData.imagePath : '',
      propertyTitle: navigation.state.params && navigation.state.params.propertyData && navigation.state.params.propertyData.propertyTitle ? navigation.state.params.propertyData.propertyTitle : 'Create Property',
      photos: navigation.state.params && navigation.state.params.propertyData && navigation.state.params.propertyData.propertyImages ? navigation.state.params.propertyData.propertyImages : [],
      videoPath: navigation.state.params && navigation.state.params.propertyData && navigation.state.params.propertyData.videoPath ? navigation.state.params.propertyData.videoPath : '',
      videoSelected: false,
      oldImagesCount: navigation.state.params && navigation.state.params.propertyData && navigation.state.params.propertyData.oldImagesCount ? navigation.state.params.propertyData.oldImagesCount : 0,
      newImagesCount: navigation.state.params && navigation.state.params.propertyData && navigation.state.params.propertyData.newImages && navigation.state.params.propertyData.newImages.length ? navigation.state.params.propertyData.newImages.length : 0,
      imagesCount: 0,
      errorMessage: '',
      shouldPlay: false,
      loading: false,
      video: navigation.state.params && navigation.state.params.propertyData && navigation.state.params.propertyData.videoPath ? true : false,
      id: [],
      newDeleteIds: []
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }
  componentWillUnmount() {
    this.backHandler.remove()
  }
  handleBackPress = () => {
    const navigation = this.props.navigation;
    navigation.goBack()
    return true;
  }
  handleSelect(item, position) {
    let positionValues = this.state.positions;
    let ids = this.state.deleteIDs;
    let newIds = this.state.newDeleteIds
    let imagePath = this.state.imagesPath;
    let imagesCount = this.state.imagesCount
    let videoSelected = item.video ? true : false
    let fileType = (item.fileType && item.fileType == 'Video') ? true : (item.video ? true : false)
    let j = positionValues.indexOf(position);
    if (!fileType) {
      if (j !== -1) {
        positionValues.splice(j, 1);
      } else {
        positionValues.push(position);
      }
      if (item._id) {
        let index2 = ids.indexOf(item._id);
        if (index2 === -1) {
          ids.push(item._id);
          imagePath.push(item.imagePath);
          this.setState({ imagesCount: imagesCount + 1 })
          imagesCount = imagesCount + 1
        } else {
          ids.splice(index2, 1);
          imagePath.splice(index2, 1);
          this.setState({ imagesCount: imagesCount - 1 })
          imagesCount = imagesCount - 1
        }
      } else {
        let index3 = newIds.indexOf(item.localUri);
        if (index3 === -1) {
          newIds.push(item.localUri);
          this.setState({ newImagesCount: this.state.newImagesCount + 1 })
        } else {
          newIds.splice(index3, 1);
          this.setState({ newImagesCount: this.state.newImagesCount - 1 })
        }
      }
    } else {
      if (j !== -1) {
        positionValues.splice(j, 1);
        this.setState({ video: true })
      } else {
        positionValues.push(position);
        this.setState({ video: false })
      }
      if (item._id) {
        let index2 = ids.indexOf(item._id);
        if (index2 === -1) {
          videoSelected = true
          ids.push(item._id);
          imagePath.push(item.imagePath);
        } else {
          videoSelected = false
          ids.splice(index2, 1);
          imagePath.splice(index2, 1);
        }
      }
    }
    if (imagesCount >= this.state.oldImagesCount) {
      // alert (i18n.t('lanErrorYouHaveToMaitainAtleastOneExistingImage'))
      this.refs.toast.show(i18n.t('lanErrorYouHaveToMaitainAtleastOneExistingImage'));
    } else {
      this.setState({ deleteIDs: ids, newDeleteIds: newIds, positions: positionValues, imagesPath: imagePath, videoSelected: videoSelected });
    }
  }
  handleDelete() {
    let oldImagesCount = this.state.oldImagesCount
    let imagesCount = this.state.imagesCount
    let remainImages = oldImagesCount - imagesCount
    if (imagesCount <= 0 && !this.state.videoSelected && this.state.newImagesCount <= 0) {
      // alert (i18n.t('lanErrorPleaseSelectImagesToDelete'))
      this.refs.toast.show(i18n.t('lanErrorPleaseSelectImagesToDelete'));
    } else if (imagesCount >= oldImagesCount) {
      // alert (i18n.t('lanErrorYouHaveToMaitainAtleastOneExistingImage'))
      this.refs.toast.show(i18n.t('lanErrorYouHaveToMaitainAtleastOneExistingImage'));
    } else {
      const PropertyStore = this.props.PropertyStore;
      const navigation = this.props.navigation;
      var imageData = this.state.photos;
      var positionValues = this.state.positions;
      let updateObj = {
        propertyID: this.state.propertyID,
        imagePath: this.state.imagePath,
        imageIDs: this.state.deleteIDs,
        imagesPath: this.state.imagesPath
      };
      let _this = this;
      this.setState({ loading: true });
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false });
      }, 10000);
      PropertyStore.deletePropertyImages(updateObj, function (resObj) {
        clearTimeout(isLoading)
        _this.setState({ loading: false })
        if (resObj.statusCode == '0000') { }
      });
      async.series([
        function (callback) {
          positionValues.sort(function (a, b) { return b - a });
          callback(null, positionValues);
        }, function (callback) {
          positionValues.forEach(function (i) {
            imageData.splice(i, 1);
          });
          callback(null, imageData);
        }
      ], function (err, results) {
        let videoPath = _this.state.videoSelected ? '' : _this.state.videoPath
        let video = _this.state.video ? true : false
        _this.setState({ photos: imageData, positions: [], deleteIDs: [], videoPath: videoPath });
        navigation.state.params.onNavigateBack(imageData, videoPath, remainImages, video);
        navigation.goBack();
      });
    }
  }
  hanldeGoBack = () => {
    const navigation = this.props.navigation;
    let video = this.state.video ? true : false
    navigation.state.params.onNavigateBack(this.state.photos, this.state.videoPath, this.state.oldImagesCount, video);
    navigation.goBack();
  }
  render() {
    const navigation = this.props.navigation;
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
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.handleDelete()}>
                  <Icon name='md-trash' style={styles.trashIconStyle} />
                </TouchableHighlight>
              </View>
            </View>
          </LinearGradient>
          {this.state.loading
            ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#ffffff' size='large' style={styles.activeIndicatorStyle} /></View>
            : null}
          <View style={styles.bodyContainer} >
            <View style={styles.scrollInfoImagesView} >
              <ScrollView>
                {this.state.photos && this.state.photos.length > 0 ? this.state.photos.map((item, i) =>
                  <TouchableOpacity onPress={() => this.handleSelect(item._id ? item : item, i)} key={i}>
                    {this.state.positions.indexOf(i) >= 0
                      ? <View style={styles.selectedId}>
                        {item.fileType === 'Video' || item.video ?
                          <View style={styles.videoStyles}>
                            <Video
                              source={{ uri: item.imagePath ? PUBLIC_DOMAIN + item.imagePath : item.video }}
                              shouldPlay={this.state.shouldPlay}
                              isLooping={true}
                              resizeMode='cover'
                              style={{ height: 300 }}
                            />
                            <View style={{ position: 'absolute', bottom: 20, left: 10, zIndex: 999, width: 40, height: 40, borderRadius: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}><Icon name={this.state.shouldPlay ? 'ios-pause' : 'ios-videocam'} style={{ color: '#025d8c', fontSize: 32, }} onPress={() => this.setState({ shouldPlay: !this.state.shouldPlay })} /></View>
                          </View>
                          : <Image source={{ uri: item.imagePath ? PUBLIC_DOMAIN + item.imagePath : item.localUri }} key={i} style={styles.imageStyle} />}
                      </View>
                      : <View style={styles.imageViewPropertyImages}>
                        {item.fileType === 'Video' || item.video ?
                          <View style={styles.videoStyles}>
                            <Video
                              source={{ uri: item.imagePath ? PUBLIC_DOMAIN + item.imagePath : item.video }}
                              shouldPlay={this.state.shouldPlay}
                              isLooping={true}
                              resizeMode='cover'
                              style={{ height: 300 }}
                            />
                            <View style={{ position: 'absolute', bottom: 20, left: 10, zIndex: 999, width: 40, height: 40, borderRadius: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}><Icon name={this.state.shouldPlay ? 'ios-pause' : 'ios-videocam'} style={{ color: '#025d8c', fontSize: 32, }} onPress={() => this.setState({ shouldPlay: !this.state.shouldPlay })} /></View>
                          </View>
                          : <Image source={{ uri: item.imagePath ? PUBLIC_DOMAIN + item.imagePath : item.localUri }} key={i} style={styles.imageStyle} />}
                      </View>}
                  </TouchableOpacity>
                ) : null}
              </ScrollView>
            </View>
          </View>
          <Toast
            ref='toast'
            style={{ backgroundColor: '#ff0000', width: '100%', marginTop: 8, }}
            position='top'
            positionValue={70}
            fadeInDuration={500}
            fadeOutDuration={1000}
            borderRadius={0}
            // opacity={0.8}
            textStyle={{ color: 'white', fontFamily: 'Roboto_medium', }}
          />
        </Animated.View>
      </View>
    );
  }
}
