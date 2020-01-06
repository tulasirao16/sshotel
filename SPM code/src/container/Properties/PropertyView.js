import React from 'react';
import { Image, Platform, TextInput, UIManager, TouchableHighlight, Dimensions, Animated, Keyboard, TouchableOpacity, BackHandler, ActivityIndicator, ScrollView, AsyncStorage, StatusBar } from 'react-native';
import { Button, Icon, View, Left, Right, Text, Picker } from 'native-base';
import styles from './css/PropertyViewCss';
import Swiper from 'react-native-swiper';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AwesomeButton from 'react-native-really-awesome-button';
import { ImagePicker, ImageManipulator, Video, DocumentPicker } from 'expo';
import * as Permissions from 'expo-permissions';
import { LinearGradient } from 'expo-linear-gradient';
import { inject, observer } from 'mobx-react';
import { ImageBrowser } from 'expo-multiple-media-imagepicker';
import * as FileSystem from 'expo-file-system';
const Device_Height = Dimensions.get('window').height;
import { PUBLIC_DOMAIN } from '../../../constants';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import base64 from 'base-64';
import utf8 from 'utf8';
import i18n from 'i18n-js';
import Toast, { DURATION } from 'react-native-easy-toast';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;

@inject(['PropertyStore'])
@observer
export default class PropertyView extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    const navigation = props.navigation;
    const data = navigation.state.params && navigation.state.params.data ? navigation.state.params.data : {}
    this.state = {
      shift: new Animated.Value(0),
      propertyDocs: [],
      propertyDocsImages: [],
      propertyDocsDummy: 0,
      newImages: [],
      propertyID: data && data._id ? data._id : '',
      propertyTitle: data && data.propertyTitle ? data.propertyTitle : '',
      oldPropertyTitle: data && data.propertyTitle ? data.propertyTitle : '',
      propertyType: data && data.propertyType ? data.propertyType : '',
      imageOriginalName: data && data.imageOriginalName ? data.imageOriginalName : '',
      imagePath: data && data.imagePath ? data.imagePath : '',
      aboutProperty: data && data.aboutProperty ? data.aboutProperty : '',
      propertyTitleDummy: data && data.propertyTitle ? data.propertyTitle : '',
      propertyTypeDummy: data && data.propertyType ? data.propertyType : '',
      aboutPropertyDummy: data && data.aboutProperty ? data.aboutProperty : '',
      spLocationId: data && data.spLocationId ? data.spLocationId._id : '',
      nearestAreas: data && data.nearestAreas ? data.nearestAreas : '',
      nearestAreasDummy: data && data.nearestAreas ? data.nearestAreas : '',
      propertyAction: 'View',
      oldImagesCount: 0,
      videoPath: '',
      disabledValue: false,
      loading: false,
      errorMessage: '',
      imageBrowserOpen: false,
      isShowVideoIcon: true,
      param1: null,
      reload: false,
      reloadFunction: ''
    };
    this.handleLocationDetails = this.handleLocationDetails.bind(this);
    this.handlePropertyInfo = this.handlePropertyInfo.bind(this);
    this.handleEditProperty = this.handleEditProperty.bind(this);
    this.handlePropertyUpdate = this.handlePropertyUpdate.bind(this);
    this.handleNearestAreas = this.handleNearestAreas.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
  }
  componentWillMount() {
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    PropertyStore.getSPPropertyDocs(navigation.state.params.data._id, function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '0000') {
        let oldImagesCount = 0
        resObj.statusResult.map((item) => {
          if (item.fileType === 'Video') {
            _this.setState({ loading: false, videoPath: item.imagePath, isShowVideoIcon: false })
          }
          else {
            _this.setState({ loading: false })
            oldImagesCount++
          }
          // if (item.fileType === 'Video') { _this.setState({ videoPath: item.imagePath }) } else { oldImagesCount++ }
        })
        _this.setState({ propertyDocs: resObj.statusResult, propertyDocsImages: resObj.statusResult, propertyDocsDummy: resObj.statusResult.length, oldImagesCount: oldImagesCount });
      } else {
        _this.setState({ loading: false, propertyDocs: [], propertyDocsImages: [], propertyDocsDummy: 0 });
      }
    });
  }
  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
    this.backHandler.remove()
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      const navigation = this.props.navigation;
      if (this.state.imageBrowserOpen) {
        this.setState({ imageBrowserOpen: false })
      } else {
        navigation.goBack()
      }
      return true
    })
  }
  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
      if (gap >= 0) {
        return;
      }
      Animated.timing(
        this.state.shift,
        {
          toValue: gap,
          duration: 1000,
          useNativeDriver: true,
        }
      ).start();
    });
  }
  handleKeyboardDidHide = () => {
    Animated.timing(
      this.state.shift,
      {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }
    ).start();
  }
  handleBackButtonClick = () => {
    const navigation = this.props.navigation;
    if (this.state.propertyAction == 'View') {
      navigation.goBack();
    } else {
      let docs = this.state.propertyDocs;
      if (this.state.propertyDocs.length == 0) {
        // alert (i18n.t('lanErrorPleaseAddPropertyImage'));
        this.refs.toast.show(i18n.t('lanErrorPleaseAddPropertyImage'));
      } else {
        docs.forEach(element => {
          if (element._id) {
            navigation.goBack();
          } else {
            this.setState({ errorMessage: i18n.t('lanErrorPleaseUpdateTheAddedImage') });
          }
        });
      }
    }
  }
  handleLocationDetails(data) {
    const navigation = this.props.navigation;
    var propertyData = {
      propertyData: data,
      propertyID: data._id,
      spLocationId: data.spLocationId._id,
      spServiceProviderId: data.spServiceProviderId,
      propertyTitle: data.propertyTitle,
      propertyArea: data.spLocationObj.area,
      propertyType: data.propertyType,
      propertyImage: data.imagePath,
    };
    let x = data.spLocationId;
    x.propertyAction = this.state.propertyAction;
    navigation.navigate('LocationsViewScreen', { locationObj: x, propertyData: propertyData })
  }
  handleNearestAreas(data) {
    const navigation = this.props.navigation;
    var propertyObj = {
      propertyID: data._id,
      propertyTitle: data.propertyTitle,
      propertyArea: data.spLocationObj.area,
      propertyType: data.propertyType,
      propertyImage: data.imagePath,
      propertyAction: this.state.propertyAction,
      nearestAreas: this.state.nearestAreas,
      nearestType: this.state.propertyAction == 'View' ? i18n.t('lanTitleNearestAreasList') : i18n.t('lanTitleNearestAreasUpdate')
    };
    navigation.navigate('PropertyNearestLocationsEdit', { propertyData: propertyObj })
  }
  handlePropertyInfo(data) {
    const navigation = this.props.navigation;
    data.propertyAction = this.state.propertyAction;
    navigation.navigate('PropertyInfoList', { propertyData: data });
  }

  handleBlocking(data) {
    const navigation = this.props.navigation;
    var propertyData = {
      propertyID: data._id,
      spLocationId: data.spLocationId._id,
      spServiceProviderId: data.spServiceProviderId,
      propertyTitle: data.propertyTitle,
      propertyArea: data.spLocationObj.area,
      propertyType: data.propertyType,
      propertyImage: data.imagePath,
      propertyAction: this.state.propertyAction
    };
    navigation.navigate('BlockDatesScreen', { propertyObj: propertyData });
  }
  handleEditProperty() {
    this.setState({ disabledValue: true, propertyAction: 'Edit' });
  }
  _takePhoto = async () => {
    const {
      status: cameraPerm
    } = await Permissions.askAsync(Permissions.CAMERA);

    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      this._handleImagePicked(pickerResult);
    }
  };
  _handleImagePicked = async pickerResult => {
    try {
      this.setState({
        uploading: true
      });

      if (!pickerResult.cancelled) {
        this.handleCompressImage(pickerResult.uri);
      }
    } catch (e) {
      // alert (i18n.t('lanErrorUploadFailedSorry'));
      this.refs.toast.show(i18n.t('lanErrorUploadFailedSorry'));
    } finally {
      this.setState({
        uploading: false
      });
    }
  };
  componentWillReceiveProps(newProps) {
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    if (newProps.navigation.state.params && newProps.navigation.state.params.data) {
      let data = newProps.navigation.state.params.data;
      this.setState({
        propertyID: data && data._id ? data._id : '',
        propertyTitle: data && data.propertyTitle ? data.propertyTitle : '',
        propertyType: data && data.propertyType ? data.propertyType : '',
        aboutProperty: data && data.aboutProperty ? data.aboutProperty : '',
        propertyTitleDummy: data && data.propertyTitle ? data.propertyTitle : '',
        propertyTypeDummy: data && data.propertyType ? data.propertyType : '',
        aboutPropertyDummy: data && data.aboutProperty ? data.aboutProperty : '',
        spLocationId: data && data.spLocationId ? data.spLocationId._id : '',
        nearestAreas: data && data.nearestAreas ? data.nearestAreas : '',
        nearestAreasDummy: data && data.nearestAreas ? data.nearestAreas : '',
      })
      this.setState({ loading: true });
      let _this = this;
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillReceiveProps', param1: newProps });
      }, 15000);
      PropertyStore.getSPPropertyDocs(navigation.state.params.data._id, function (resObj) {
        clearTimeout(isLoading)
        if (resObj.statusCode == '0000') {
          let oldImagesCount = 0
          resObj.statusResult.map((item) => {
            if (item.fileType === 'Video') {
              _this.setState({ loading: false, videoPath: item.imagePath })
            } else {
              _this.setState({ loading: false })
              oldImagesCount++
            }
          })
          _this.setState({ propertyDocs: resObj.statusResult, propertyDocsImages: resObj.statusResult, propertyDocsDummy: resObj.statusResult.length, oldImagesCount: oldImagesCount });
        } else {
          _this.setState({ loading: false, propertyDocs: [], propertyDocsImages: [], propertyDocsDummy: 0 });
        }
      });
    }
  }
  async handleCompressImage(uri) {
    let pickPhoto = this.state.propertyDocs;
    let photo = this.state.newImages;
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [],
      { compress: 0.5 }
    );
    pickPhoto.push({ localUri: manipResult.uri })
    photo.push({ localUri: manipResult.uri })
    this.setState({
      image: manipResult.uri, errorMessage: '', propertyDocs: pickPhoto, newImages: photo
    });
  }
  _pickVideo = async () => {
    if (!this.state.isShowVideoIcon) {
      this.setState({ errorMessage: i18n.t('lanErrorToUploadNewVideoDeleteExistingVideo') })
    } else {
      this.setState({ isShowVideoIcon: false, loading: false })
      let pickPhoto = this.state.propertyDocs;
      let photo = this.state.newImages;
      const {
        status: cameraRollPerm
      } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (cameraRollPerm === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
          base64: true,
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
          aspect: [4, 3],
        });
        const file = await FileSystem.getInfoAsync(result.uri);
        if (file.size) {
          var bytes = file.size
          if(bytes <= 52428800) {
            if (!result.cancelled) {
              if (result.duration <= 60000) {
                pickPhoto.push({ video: result.uri })
                photo.push({ video: result.uri })
                this.setState({
                  errorMessage: '', propertyDocs: pickPhoto, newImages: photo, videoPath: 'set', isShowVideoIcon: false, loading: false
                });
              } else {
                // alert(i18n.t('LanErrorPleaseChooseVideoLessThanSixtySeconds'));
                this.refs.toast.show(i18n.t('lanErrorPleaseChooseVideoLessThanSixtySeconds'));
                this.setState({ isShowVideoIcon: true, loading: false });
              }
            } else {
              this.setState({ isShowVideoIcon: true })
            }
          } else {
            // alert(i18n.t('lanErrorVideoShouldBeLessThanFiftyMB'));
            this.refs.toast.show(i18n.t('lanErrorVideoShouldBeLessThanFiftyMB'));
            this.setState({ isShowVideoIcon: true, loading: false });
          }
        } else {
          this.setState({ isShowVideoIcon: true, loading: false });
        }
      }
    }
  };

  imageBrowserCallback = (callback) => {
    callback.then((photos) => {
      let pickPhoto = this.state.propertyDocs;
      let photo = this.state.newImages;
      photos.map((item, i) => {
        pickPhoto.push(item)
        photo.push(item)
      })
      this.setState({
        imageBrowserOpen: false,
        propertyDocs: pickPhoto,
        newImages: photo
      })
    }).catch((e) => console.log(e))
  }
  async handlePropertyUpdate() {
    const PropertyStore = this.props.PropertyStore;
    const navigation = this.props.navigation;
    let authToken = await AsyncStorage.getItem('authToken');
    if (this.state.propertyDocs.length < 1) {
      this.setState({ errorMessage: i18n.t('lanErrorPropertyImageisRequired') });
    } else if (this.state.propertyDocs.length > 11) {
      this.setState({ errorMessage: i18n.t('lanErrorMaximumOfTenImages') });
    } else if (!this.state.propertyTitle.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorPropertyTitleIsRequired') });
    } else if (!this.state.aboutProperty.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorAboutThePropertyIsRequired') });
    } else if (!this.state.propertyType) {
      this.setState({ errorMessage: i18n.t('lanErrorPropertyTypeIsRequired') });
      // } else if(this.state.propertyTitle == this.state.propertyTitleDummy && this.state.aboutProperty == this.state.aboutPropertyDummy
      //   && this.state.propertyType == this.state.propertyTypeDummy && this.state.propertyDocs.length == this.state.propertyDocsDummy ) {
      //     navigation.goBack();
    } else {
      this.setState({ loading: true });
      const data = new FormData();
      var uri = this.state.newImages;
      if (uri.length > 0) {
        uri.forEach((item, i) => {
          data.append('propertyImages', {
            uri: item.localUri ? item.localUri : item.video,
            type: item.localUri ? 'image/jpeg' : 'video/mp4',
            name: item.localUri ? item.localUri : item.video,
          });
          if (item.video) {
            data.append('fileType', 'Video');
          }
        });
      }
      data.append('oldPropertyTitle', this.state.oldPropertyTitle);
      data.append('propertyTitle', this.state.propertyTitle);
      data.append('aboutProperty', this.state.aboutProperty);
      data.append('propertyType', this.state.propertyType);
      data.append('spLocationId', this.state.spLocationId);
      data.append('nearestAreas', JSON.stringify(this.state.nearestAreas));
      data.append('imagesCount', parseInt(this.state.propertyDocsDummy));
      let _this = this;
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reloadFunction: 'handlePropertyUpdate', errorMessage: i18n.t('lanLabelServerNotResponding') });
      }, 15000);
      let options = {
        method: 'PUT',
        body: data,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'token': authToken
        },
      };
      let apiUrl = PUBLIC_DOMAIN + 'api/v1/sp/property/update/' + this.state.propertyID;
      fetch(apiUrl, options).then((response) => {
        response.json().then((responseJson) => {
          clearTimeout(isLoading)
          PropertyStore.NearestAreas = [];
          if (responseJson.statusCode == '0000') {
            _this.setState({ loading: false });
            PropertyStore.refresh = 'refresh';
            navigation.navigate('PropertiesList', { refresh: 'refresh' });
          } else {
            _this.setState({ loading: false, errorMessage: i18n.t('lanErrorPropertyCreateFailed') });
          }
        })
      }).catch((error) => {
        clearTimeout(isLoading)
        _this.setState({ loading: false });
        navigation.navigate('InformationScreen');
      });
    }
  }
  handleImage() {
    const navigation = this.props.navigation;
    let propertyObj = {
      propertyTitle: this.state.propertyTitle,
      propertyID: this.state.propertyID,
      imagePath: this.state.imagePath,
      propertyImages: this.state.propertyDocs,
      newImages: this.state.newImages,
      oldImagesCount: this.state.oldImagesCount,
      videoPath: this.state.videoPath
    };
    if (this.state.videoPath) {
      this.setState({ isShowVideoIcon: false })
    } else {
      this.setState({ isShowVideoIcon: true })
    }
    navigation.navigate('PropertyImagesEdit', { onNavigateBack: this.handleOnNavigateBack, propertyData: propertyObj })
  }
  handleOnNavigateBack = (photos, videoPath, oldImagesCount, video) => {
    let newImages = [];
    photos.forEach(item => {
      if (!item._id) {
        newImages.push(item);
      }
    });
    if (video) {
      this.setState({ isShowVideoIcon: false })
    } else {
      this.setState({ isShowVideoIcon: true })
    }
    this.setState({ propertyDocs: photos, videoPath: videoPath, newImages: newImages, oldImagesCount: oldImagesCount, errorMessage: '', loading: false })
  }
  handleBack = () => {
    const navigation = this.props.navigation;
    if (this.state.propertyAction == 'View') {
      navigation.goBack();
    } else {
      let docs = this.state.propertyDocs;
      if (this.state.propertyDocs.length == 0) {
        // alert (i18n.t('lanErrorPleaseAddPropertyImage'));
        this.refs.toast.show(i18n.t('lanErrorPleaseAddPropertyImage'));
      } else {
        docs.forEach(element => {
          if (element._id) {
            navigation.goBack();
          } else {
            this.setState({ errorMessage: i18n.t('lanErrorPleaseUpdateTheAddedImage') });
          }
        });
      }
    }
    // if(this.state.propertyDocs.length == 0) {
    //   alert('Please add Property Image');
    // } else {
    //   navigation.goBack();
    // }
  }
  handleReload = () => {
    switch (this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      case 'componentWillReceiveProps':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillReceiveProps(this.state.param1)
        break;
      default:
        break;
    }
  }
  render() {
    if (this.state.imageBrowserOpen) {
      return (<ImageBrowser max={10} callback={this.imageBrowserCallback} />);
    }
    const { shift } = this.state;
    const navigation = this.props.navigation;
    const data = navigation.state.params && navigation.state.params.data ? navigation.state.params.data : {}
    return (
      !this.state.reload
        ? <View style={styles.container}>
          <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
            <LinearGradient colors={['#019fa0', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.headerStyle}>
              <StatusBar barStyle='light-content' />
              <View style={styles.status} />
              <View style={styles.headerMainView}>
                <View style={styles.headerLeft} >
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={this.handleBack}>
                    <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
                  </TouchableHighlight>
                </View>
                <View style={styles.headerBody} >
                  <Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitleStyle} >{data && data.propertyTitle ? data.propertyTitle : 'List Your Property'}</Text>
                </View>
                <View style={styles.headerRight} >
                  {this.state.propertyAction == 'View' ?
                    <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.handleEditProperty()} >
                      <Icon name='create' style={styles.iconEditStyle} />
                    </TouchableHighlight> 
                  : null}
                </View> 
              </View>
            </LinearGradient>
            {this.state.loading
              ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#ffffff' size='large' style={styles.activeIndicatorStyle} /></View>
              : null}
            <View style={styles.bodyContainer} >
              <TouchableOpacity onPress={() => this.state.propertyAction == 'Edit' ? this.handleImage() : ''}>
                <View style={styles.imageView}>
                  {/* <Image source= {data && data.imagePath ? {uri: PUBLIC_DOMAIN + data.imagePath}: null} style={{ resizeMode: 'cover', width: '100%', height: '100%' }} /> */}
                  <Swiper style={styles.wrapper} showsButtons={false} showsPagination={true} autoplay={true} autoplayTimeout={1.1}>
                    {this.state.propertyDocs ? this.state.propertyDocs.map((item, i) => {
                      return (
                        item.fileType === 'Video' || item.video
                          // ? <Text>VIDEO {PUBLIC_DOMAIN + item.imagePath}</Text>
                          // : <Text>Image {PUBLIC_DOMAIN + item.imagePath}</Text>
                          ? <Video
                            source={{ uri: item.imagePath ? PUBLIC_DOMAIN + item.imagePath : item.localUri }}
                            shouldPlay={false}
                            isLooping={false}
                            resizeMode='cover'
                            style={{ height: 300 }}
                            key={i}
                          />
                          : <Image source={{ uri: item.imagePath ? PUBLIC_DOMAIN + item.imagePath : item.localUri }} style={styles.imgStyle} key={i} />
                      )
                    }) : null}
                  </Swiper>
                  {this.state.propertyAction == 'Edit' ?
                    <View style={styles.plusCircle}>
                      <Icon name='camera' style={styles.plusIcon} onPress={this._takePhoto} />
                    </View> : null}
                  {this.state.propertyAction == 'Edit' ?
                    <View style={styles.galleryCircle}>
                      <Icon name='ios-images' style={styles.plusIcon} onPress={() => this.setState({ imageBrowserOpen: true })} />
                    </View> : null}
                  {this.state.propertyAction != 'Edit'
                    ? null
                    : <View style={styles.videoCircle}>
                      <Icon name='videocam' style={styles.plusIcon} onPress={this._pickVideo} />
                    </View>}
                  {/* <View style={styles.thumbmailsView} >
                {this.state.propertyDocs && this.state.propertyDocs ? this.state.propertyDocs.map((item, i) =>
                  <View style={styles.thumbnail} key={i}>
                    {item.imagePath && item.imagePath.indexOf('.mp4') !== -1 || item.video ?
                      <Video
                        source={{ uri: item.imagePath ? PUBLIC_DOMAIN + item.imagePath : item.video }}
                        shouldPlay={false}
                        isLooping={false}
                        resizeMode='cover'
                        style={{ height: 300 }}
                      />
                      : <Image source={{ uri: item.imagePath ? PUBLIC_DOMAIN + item.imagePath : item.file }} style={styles.imgStyle} />}
                  </View>
                ) : null}
              </View> */}
                </View>
              </TouchableOpacity>
              <View style={styles.scrollInfoView} >
                <ScrollView >
                  <View>
                    <View style={styles.floatingInputView} >
                      <FloatingLabelInput
                        label={i18n.t('lanLabelPropertyTitle')}
                        value={this.state.propertyTitle}
                        editable={this.state.disabledValue}
                        onChangeText={(text) => this.setState({ propertyTitle: text, errorMessage: '' })}
                      />
                    </View>
                    <View style={styles.floatingInputView} >
                      <FloatingLabelInput
                        label={i18n.t('lanLabelAboutYourProperty')}
                        value={this.state.aboutProperty}
                        editable={this.state.disabledValue}
                        onChangeText={(text) => this.setState({ aboutProperty: text, errorMessage: '' })}
                      />
                    </View>

                    <View style={[styles.floatingInputView, styles.floatingInputViewOne]} >
                      <Text style={[styles.pickerLabel]} >{i18n.t('lanLabelSelectPropertyType')}<Text style={styles.required}>*</Text></Text>
                      <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', marginTop: -5.5, left:-5 }} >
                        <Picker
                          mode='dropdown'
                          iosIcon={<Icon name='arrow-down' />}
                          style={{ width: DEVICE_WIDTH-20, }}
                          selectedValue={this.state.propertyType}
                          enabled={this.state.disabledValue}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({ propertyType: itemValue, errorMessage: '' })
                          }>
                          <Picker.Item label='Select Property Type' value='' />
                          <Picker.Item label='Hotel' value='Hotel' />
                          <Picker.Item label='Individual House' value='Individual House' />
                        </Picker>
                      </View>
                    </View>
                    <View style={[styles.DateGenderView, styles.listItemOne]}>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <View>
                          <Text style={styles.titleRooms}>{i18n.t('lanLabelPropertyCapacity')}</Text>
                          <Text style={[styles.textBig, styles.txtFont, styles.regularTxt, styles.roomsTextColor]} >{data.propertyCapacity}</Text>
                        </View>
                      </View>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <View>
                          <Text style={styles.titleRooms}>{i18n.t('lanLabelTotalRooms')}</Text>
                          <Text style={[styles.textBig, styles.txtFont, styles.regularTxt, styles.roomsTextColor]} >{data.numRooms}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.DateGenderView, styles.listItemOne]}>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <View>
                          <Text style={styles.titleRooms}>{i18n.t('lanLabelActiveRooms')}</Text>
                          <Text style={[styles.textBig, styles.txtFont, styles.regularTxt, styles.roomsTextColor]} >{data.activeNumRooms}</Text>
                        </View>
                      </View>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <View>
                          <Text style={styles.titleRooms}>{i18n.t('lanLabelOnHoldRooms')}</Text>
                          <Text style={[styles.textBig, styles.txtFont, styles.regularTxt, styles.roomsTextColor]} >{data.onHoldNumRooms}</Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => this.handleLocationDetails(data)}>
                      <View style={styles.listItem}>
                        <Left>
                          <View>
                            <Text style={styles.routingTitleStyle}>{i18n.t('lanButtonLocationDetails')}</Text>
                            {/* <Text style={[styles.textBig, styles.txtFont, styles.regularTxt]} >{data.spLocationObj.area}{', '}{data.spLocationObj.city}{', '}{data.spLocationObj.state}</Text> */}
                          </View>
                        </Left>
                        {/* <Right>
                      <View>
                        <Button transparent><Icon name='pin' style={styles.mapIconStyle} /></Button>
                      </View>
                    </Right> */}
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.handleNearestAreas(data)}>
                      <View style={styles.listItem}>
                        <Left>
                          <View>
                            <Text style={styles.routingTitleStyle}>{i18n.t('lanButtonNearestAreas')}</Text>
                          </View>
                        </Left>
                        <Right>
                        </Right>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.handleBlocking(data)}>
                      <View style={styles.listItem}>
                        <Left>
                          <View>
                            <Text style={styles.routingTitleStyle}>{i18n.t('lanButtonBlockedDates')} </Text>
                          </View>
                        </Left>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.handlePropertyInfo(data)} >
                      <View style={styles.listItem}>
                        <Left>
                          <View>
                            <Text style={styles.routingTitleStyle}>{i18n.t('lanButtonPropertyInfos')}</Text>
                          </View>
                        </Left>
                      </View>
                    </TouchableOpacity>
                    <View style={[styles.DateGenderView, styles.listItemOne]}>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <View>
                          <Text style={styles.titleRooms}>{i18n.t('lanLabelSingleBedrooms')}</Text>
                          <Text style={[styles.textBig, styles.txtFont, styles.regularTxt, styles.roomsTextColor]} >{data.singleBedsCount ? data.singleBedsCount : 0}</Text>
                        </View>
                      </View>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <View>
                          <Text style={styles.titleRooms}>{i18n.t('lanLabelDoubleBedrooms')}</Text>
                          <Text style={[styles.textBig, styles.txtFont, styles.regularTxt, styles.roomsTextColor]} >{data.doubleBedsCount ? data.doubleBedsCount : 0}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={[styles.DateGenderView, styles.listItemOne]}>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <View>
                          <Text style={styles.titleRooms}>{i18n.t('lanLabelBathrooms')}</Text>
                          <Text style={[styles.textBig, styles.txtFont, styles.regularTxt, styles.roomsTextColor]} >{data.privateBathRooms ? data.privateBathRooms : 0}</Text>
                        </View>
                      </View>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <View>
                          <Text style={styles.titleRooms}>{i18n.t('lanLabelACs')}</Text>
                          <Text style={[styles.textBig, styles.txtFont, styles.regularTxt, styles.roomsTextColor]} >{data.acsCount ? data.acsCount : 0}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={[styles.DateGenderView, styles.listItemOne]}>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <View>
                          <Text style={styles.titleRooms}>{i18n.t('lanLabelKitchens')}</Text>
                          <Text style={[styles.textBig, styles.txtFont, styles.regularTxt, styles.roomsTextColor]} >{data.kitchensCount ? data.kitchensCount : 0}</Text>
                        </View>
                      </View>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <View>
                          <Text style={styles.titleRooms}>{i18n.t('lanLabelHalls')}</Text>
                          <Text style={[styles.textBig, styles.txtFont, styles.regularTxt, styles.roomsTextColor]} >{data.hallsCount ? data.hallsCount : 0}</Text>
                        </View>
                      </View>
                    </View>
                    <Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>
                    <View style={styles.btnModal} >
                      {this.state.propertyAction == 'View' ?
                        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                          <AwesomeButton block success
                            onPress={() => navigation.goBack()}
                            width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} marginTop={20} >
                            <Text style={styles.BtnText}> {i18n.t('lanButtonDone')} </Text>
                          </AwesomeButton>
                        </LinearGradient>
                        :
                        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                          <AwesomeButton block success
                            onPress={() => this.handlePropertyUpdate()}
                            width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} marginTop={20} >
                            <Text style={styles.BtnText}> {i18n.t('lanButtonUpdate')} </Text>
                          </AwesomeButton>
                        </LinearGradient>}
                    </View>
                  </View>
                </ScrollView>
                <KeyboardSpacer/>
              </View>
            </View>
          </Animated.View>
          <Toast
              ref='toast'
              style={{backgroundColor:'red', width: '100%', borderRadius:0,padding: 10, }}
              position='bottom'
              positionValue={120}
              fadeInDuration={750}
              fadeOutDuration={1000}
              // opacity={0.8}
              borderRadius={0}
              textStyle={{color:'white', fontFamily: 'Roboto_medium', }}
            />
        </View>
        : <View>
          <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <View style={styles.headerMainViewReload} >
              <View style={styles.headerLeftReload} >
                <TouchableOpacity>
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle1} onPress={() => navigation.goBack()} />
                </TouchableOpacity>
              </View>
              <View style={styles.headerBodyReload} >
                <TouchableOpacity>
                  <Text style={styles.headerTitleStyle1}>{i18n.t('lanAppTitle')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
          <View style={{ jflex: 1, justifyContent: 'center', alignItems: 'center', width: DEVICE_WIDTH - 20, height: Device_Height - 150 }} >
            <View style={styles.eachBtnView} >
              <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                <AwesomeButton block success
                  onPress={() => this.handleReload()}
                  width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                  <Text style={styles.BtnText}>{i18n.t('lanButtonReload')}</Text>
                </AwesomeButton>
              </LinearGradient>
            </View>
            <Text style={styles.serverNotText} >{i18n.t('lanLabelServerNotResponding')}</Text>
          </View>
        </View>
    );
  }
}

