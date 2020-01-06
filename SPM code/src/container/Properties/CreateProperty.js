import React from 'react';
import { View, TextInput, Animated, Keyboard, AsyncStorage, Dimensions, TouchableHighlight, TouchableOpacity, ScrollView, ActivityIndicator, Image, BackHandler, UIManager, StatusBar } from 'react-native';
import { Icon, Text, Picker, Left, Right } from 'native-base';
import { inject, observer } from 'mobx-react';
import styles from './css/CreatePropertyCss';
import Swiper from 'react-native-swiper';
import { ImagePicker, ImageManipulator, Video } from 'expo';
import * as Permissions from 'expo-permissions';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
// import ImageBrowser from './ImageBrowser';
// import { ImageBrowser } from 'expo-multiple-imagepicker';
import { ImageBrowser } from 'expo-multiple-media-imagepicker';
import Toast, { DURATION } from 'react-native-easy-toast';
import * as FileSystem from 'expo-file-system';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import i18n from 'i18n-js';

import { PUBLIC_DOMAIN } from '../../../constants';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;

@inject(['PropertyStore'])
@observer
export default class CreateProperty extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    const PropertyStore = this.props.PropertyStore;
    this.state = {
      shift: new Animated.Value(0),
      propertyTitle: '',
      aboutProperty: '',
      propertyType: 'Hotel',
      propertyArea: PropertyStore.createPropertyLocation && PropertyStore.createPropertyLocation.area ? PropertyStore.createPropertyLocation.area : '',
      imageBrowserOpen: false,
      image: '',
      photos: PropertyStore.PropertyImages && PropertyStore.PropertyImages.length > 0 ? PropertyStore.PropertyImages : [],
      errorMessage: '',
      loading: false,
      videoPath: '',
      isShowVideoIcon: true,
      errorCreateLocation: false,
      propImageError: false,
      errorPropInfo: false,
      submitDisabled: false,
      createLocEnable: '',
      propInfoEnable: '',
      aboutError: false,
      aboutSuccess: '',
      propTitleError: '',
      propTitleSuccess: '',
      enableNearestArea: '',
      enableBlocked: ''
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    this.handlePropertyCreate = this.handlePropertyCreate.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.handleNearestArea = this.handleNearestArea.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
  }
  async componentWillMount() {
    await AsyncStorage.getItem('authObj').then((value) => {
      let authObj = JSON.parse(value);
      this.setState({ propertyTitle: authObj.spServiceProviderId && authObj.spServiceProviderId.serviceProvider ? authObj.spServiceProviderId.serviceProvider : '' })
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
  }

  componentWillReceiveProps (newProps) {
    if(newProps.navigation.state.params.createLocEnable == true && this.state.createLocEnable !== 'false' ) {
      this.setState({ createLocEnable: 'false' })
    } else if (newProps.navigation.state.params.enableNearestArea == true && this.state.enableNearestArea !== 'true') {
      this.setState({ enableNearestArea: 'true' })
    } else if (newProps.navigation.state.params.propInfoEnable == true && this.state.propInfoEnable !== 'false') {
      this.setState({ propInfoEnable: 'false' })
    } else if (newProps.navigation.state.params.enableBlocked == true && this.state.enableBlocked !== 'true') {
      this.setState({ enableBlocked: 'true' })
    }
  }

  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight + 40);
      if (gap >= 0) {
        return;
      }
      Animated.timing(
        this.state.shift,
        {
          toValue: gap,
          duration: 200,
          useNativeDriver: true,
        }
      ).start();
    });
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  handleBackButtonClick = () => {
    const navigation = this.props.navigation
    if (this.state.imageBrowserOpen) {
      this.setState({ imageBrowserOpen: false })
    } else {
      navigation.goBack()
    }
    return true
  }
  handleKeyboardDidHide = () => {
    Animated.timing(
      this.state.shift,
      {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }
    ).start();
  }
  onValueChange(value) {
    this.setState({
      selected: value
    });
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  handlePermissions = async () => {
    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (cameraRollPerm === 'granted') {
      this.setState({ imageBrowserOpen: true, propImageError: false })
    }
  }
  imageBrowserCallback = (callback) => {
    callback.then((photos) => {
      if (this.state.photos.length > 0 && this.state.photos[0].video) {
        let video = this.state.photos[0]
        let newPhotos = this.state.photos
        newPhotos.splice(0, 1)
        photos.map((item, i) =>
        newPhotos.push(item)
        )
        newPhotos.indexOf(video) >= 0 ? null : newPhotos.push(video) 
        this.setState({
          imageBrowserOpen: false,
          photos: newPhotos,
          errorMessage: ''
        })
      } else {
        let pickPhoto = this.state.photos;
        photos.map((item, i) =>
          pickPhoto.push(item)
        )
        this.setState({
          imageBrowserOpen: false,
          photos: pickPhoto,
          errorMessage: ''
        })
      }  
    }).catch((e) => console.log(e))
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
      });

      this._handleImagePicked(pickerResult);
    }
  };

  _pickVideo = async () => {
    if (!this.state.isShowVideoIcon) {
      this.setState({ errorMessage: i18n.t('lanErrorToUploadNewVideoDeleteExistingVideo') })
      } else {
        this.setState({ isShowVideoIcon: false, loading: false })
        let pickPhoto = this.state.photos;
    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (cameraRollPerm === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
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
              this.setState({
                errorMessage: '', photos: pickPhoto, isShowVideoIcon: false, loading: false
              });
            } else {
              // alert(i18n.t('lanErrorVideoDurationShouldBeLessThanSixtySeconds'));
              this.refs.toast.show(i18n.t('lanErrorVideoDurationShouldBeLessThanSixtySeconds'));
              this.setState({ isShowVideoIcon: true, loading: false })
            }
          } else {
            this.setState({ isShowVideoIcon: true, loading: false })
          }
        }  else {
          // alert(i18n.t('lanErrorVideoShouldBeLessThanFiftyMB'));
          this.refs.toast.show(i18n.t('lanErrorVideoShouldBeLessThanFiftyMB'));
          this.setState({ isShowVideoIcon: true, loading: false });
        }
      } else {
        this.setState({ isShowVideoIcon: true, loading: false });
      }
    }
  }
}

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
  async handleCompressImage(uri) {
    if (this.state.photos.length > 0 && this.state.photos[0].video) {
      let video = this.state.photos[0]
      let newPhotos = this.state.photos
      newPhotos.splice(0, 1)
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { compress: 0.5 }
      );
      newPhotos.push({ localUri: manipResult.uri }, video)
      this.setState({
        image: manipResult.uri, errorMessage: '', photos: newPhotos
      });
    } else {
      let pickPhoto = this.state.photos;
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { compress: 0.5 }
      );
      pickPhoto.push({ localUri: manipResult.uri })
      this.setState({
        image: manipResult.uri, errorMessage: '', photos: pickPhoto
      });
    }
  }

  async handlePropertyCreate() {
    const PropertyStore = this.props.PropertyStore;
    const navigation = this.props.navigation;
    let authToken = await AsyncStorage.getItem('authToken');
    let ImageValidation = (this.state.photos.length <= 1 && this.state.photos.length > 0 && !this.state.photos[0].localUri) ? true : false
    if (this.state.photos.length < 1) {
      this.refs.toast.show(i18n.t('lanErrorPropertyImageIsRequired'));
      this.setState({ propImageError: true})
    } else if (ImageValidation) {
      this.refs.toast.show(i18n.t('lanErrorPropertyImageIsRequired'));
    } else if (this.state.photos.length > 11) {
      this.refs.toast.show(i18n.t('lanErrorMaximumOfTenImages'));
    } else if (!this.state.propertyTitle.trim()) {
      this.refs.toast.show(i18n.t('lanErrorPropertyTitleIsRequired'));
      this.setState({ propTitleError: true, propTitleSuccess: false });
    } else if (!this.state.aboutProperty.trim()) {
      this.refs.toast.show(i18n.t('lanErrorAboutThePropertyIsRequired'));
      this.setState({ aboutError: true, aboutSuccess: false });
    } else if (!this.state.propertyType) {
      this.refs.toast.show(i18n.t('lanErrorAboutThePropertyIsRequired'));
    } else if (!PropertyStore.createPropertyLocation.area) {
      this.refs.toast.show(i18n.t('lanErrorPleaseAddLocationDetails'));
      this.setState({ createLocEnable: 'true' });
    } else if (!PropertyStore.createPropertyInfo.roomType) {
      this.refs.toast.show(i18n.t('lanErrorPleaseAddPropertyInfoDetails')); 
      this.setState({ propInfoEnable: 'true' });
    } else {
      this.setState({ loading: true, errorPropInfo: false })
      let uri = this.state.photos;
      const data = new FormData()
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
      data.append('propertyTitle', this.state.propertyTitle);
      data.append('aboutProperty', this.state.aboutProperty);
      data.append('propertyType', this.state.propertyType);
      data.append('status', 'Active');
      data.append('nearestAreas', JSON.stringify(PropertyStore.NearestAreas));
      data.append('spLocationObj', JSON.stringify(PropertyStore.createPropertyLocation));
      data.append('blockedObj', JSON.stringify(PropertyStore.createBlockedDates));
      data.append('propertyInfo', JSON.stringify(PropertyStore.createPropertyInfo));
      let _this = this;
      let options = {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'token': authToken
        },
      };
      let isLoading = setTimeout(function () {
        _this.refs.toast.show(i18n.t('lanLabelServerNotResponding'))
        setTimeout(function () {
          _this.setState({ loading: false });
          navigation.navigate('PropertiesList', { refresh: 'refresh' });
        }, 3000);
      }, 20000);
      let apiUrl = PUBLIC_DOMAIN + 'api/v1/sp/property/create';
      fetch(apiUrl, options).then((response) => {
        response.json().then((responseJson) => {
          clearTimeout(isLoading)
          _this.setState({ loading: false })
          PropertyStore.PricingView = {}
          PropertyStore.Pricing = {};
          PropertyStore.GuestRules = [];
          PropertyStore.AvailableGuests = [];
          PropertyStore.Amenities = [];
          PropertyStore.AmenitiesAvailable = [];
          PropertyStore.Services = [];
          PropertyStore.ServicesAvailable = [];
          PropertyStore.createPropertyLocation = {};
          PropertyStore.createBlockedDates = {};
          PropertyStore.createPropertyInfo = {};
          PropertyStore.PropertyImages = [];
          PropertyStore.NearestAreas = [];
          PropertyStore.selectedPricing = false;
          PropertyStore.selectedService = false;
          PropertyStore.selectedAminities = false;
          PropertyStore.selectedGuestRules = false;
          if (responseJson.statusCode == '0000') {
            PropertyStore.locationItem = -1;
            PropertyStore.refresh = 'refresh';
            navigation.navigate('PropertiesList', { refresh: 'refresh' });
          } else {
            _this.refs.toast.show(i18n.t('lanErrorPropertyCreateFailed'));
          }
        })
      }).catch((error) => {
        clearTimeout(isLoading)
        _this.setState({ loading: false })
        navigation.navigate('InformationScreen');
      });
    }
  }
  handleCreateLocation() {
    this.setState({ errorMessage: '' })
    if (!this.state.propertyTitle.trim()) {
      this.refs.toast.show(i18n.t('lanErrorPropertyTitleIsRequired'));
      this.setState({ propTitleError: true, propTitleSuccess: false });
    } else if (!this.state.aboutProperty.trim()) {
      this.refs.toast.show(i18n.t('lanErrorAboutThePropertyIsRequired'));
      this.setState({ aboutError: true, aboutSuccess: false });
    } else if (!this.state.propertyType) {
      this.refs.toast.show(i18n.t('lanErrorPropertyTypeIsRequired'));
      // this.setState({ errorMessage: 'Property Type is Required' });
    } else {
      const navigation = this.props.navigation;
      let property = {
        property: 'create',
        propertyTitle: this.state.propertyTitle,
        propertyType: this.state.propertyType,
        propertyArea: this.state.propertyArea
      }
      navigation.navigate('PropertyLocationCreate', { propertyData: property });
    }
  }

  handleNearestArea() {
    const PropertyStore = this.props.PropertyStore;
    let area = PropertyStore.createPropertyLocation && PropertyStore.createPropertyLocation.area ? PropertyStore.createPropertyLocation.area : '';
    const navigation = this.props.navigation;
    this.setState({ errorMessage: '' })
    if (!this.state.propertyTitle) {
      this.refs.toast.show(i18n.t('lanErrorPropertyTitleIsRequired'));
      this.setState({ propTitleError: true, propTitleSuccess: false });
    } else if (!this.state.aboutProperty) {
      this.refs.toast.show(i18n.t('lanErrorAboutThePropertyIsRequired'));
      this.setState({ aboutError: true, aboutSuccess: false });
    } else if (!this.state.propertyType) {
      this.refs.toast.show(i18n.t('lanErrorPropertyTypeIsRequired'));
      // this.setState({ errorMessage: 'Property Type is Required' });
    } else if (!area) {
      this.refs.toast.show(i18n.t('lanErrorAddPropertyLocationDetails'));
      this.setState({ createLocEnable: 'true' });
    } else {
      let property = {
        propertyAction: 'create',
        propertyTitle: this.state.propertyTitle,
        propertyType: this.state.propertyType,
        propertyArea: PropertyStore.createPropertyLocation && PropertyStore.createPropertyLocation.area ? PropertyStore.createPropertyLocation.area : '',
      }
      navigation.navigate('PropertyNearestLocations', { propertyData: property });
    }
  }

  handleCreateBlocking() {
    this.setState({ errorMessage: '' })
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    if (!this.state.propertyTitle) {
      this.refs.toast.show(i18n.t('lanErrorPropertyTitleIsRequired'));
      this.setState({ propTitleError: true, propTitleSuccess: false });
    } else if (!this.state.aboutProperty) {
      this.refs.toast.show(i18n.t('lanErrorAboutThePropertyIsRequired'));
      this.setState({ aboutError: true, aboutSuccess: false });
    } else if (!this.state.propertyType) {
      this.refs.toast.show(i18n.t('lanErrorPropertyTypeIsRequired'));
      // this.setState({ errorMessage: 'Property Type is Required' });
    } else {
      let property = {
        property: 'create',
        propertyTitle: this.state.propertyTitle,
        propertyType: this.state.propertyType,
        propertyArea: PropertyStore.createPropertyLocation && PropertyStore.createPropertyLocation.area ? PropertyStore.createPropertyLocation.area : ''
      }
      navigation.navigate('CreateBlockedDates', { propertyObj: property })
    }
  }
  handleCreateInfo() {
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    this.setState({ errorMessage: '' })
    if (!this.state.propertyTitle) {
      this.refs.toast.show(i18n.t('lanErrorPropertyTitleIsRequired'));
      this.setState({ propTitleError: true, propTitleSuccess: false });
    } else if (!this.state.aboutProperty) {
      this.refs.toast.show(i18n.t('lanErrorAboutThePropertyIsRequired'));
      this.setState({ aboutError: true, aboutSuccess: false });
    } else if (!this.state.propertyType) {
      this.refs.toast.show(i18n.t('lanErrorPropertyTypeIsRequired'));
      // this.setState({ errorMessage: 'Property Type is Required' });
    } else {
      let property = {
        property: 'create',
        propertyTitle: this.state.propertyTitle,
        propertyType: this.state.propertyType,
        propertyArea: PropertyStore.createPropertyLocation && PropertyStore.createPropertyLocation.area ? PropertyStore.createPropertyLocation.area : ''
      }
      navigation.navigate('CreatePropertyInfo', { propertyData: property, PropertyCreate: 'create' })
    }
  }
  handleImage() {
    const navigation = this.props.navigation;
    let propertyObj = {
      propertyTitle: this.state.propertyTitle,
      propertyImages: this.state.photos
    };
    navigation.navigate('PropertyImages', { onNavigateBack: this.handleOnNavigateBack, propertyData: propertyObj })
  }
  handleOnNavigateBack = (photos, videoPath) => {
    if (photos.length > 0) {
      let video = 0
      let videoIcon = photos.map((data,i) => {
        if (data.video) {
          this.setState({ isShowVideoIcon: false })
          video = 1
        } else if (video != 1) {
        this.setState({ isShowVideoIcon: true })
        }
      })
      this.setState({ photos: photos, videoPath: videoPath, errorMessage: '' })
    } else {
      this.setState({ isShowVideoIcon: true, errorMessage: '' })
    }
  }
  render() {
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    const { shift } = this.state;
    let data = this.state.photos.find((item => item.video));
    if (this.state.imageBrowserOpen) {
      return (<ImageBrowser max={10} callback={this.imageBrowserCallback} />);
    }
    const abtPPL = <Text style={[styles.pickerLabel]}>{i18n.t('lanLabelAboutYourProperty')}<Text style={styles.required}>*</Text></Text>
    const titlePPL = <Text style={[styles.pickerLabel]}>{i18n.t('lanTitlePropertyTitle')}<Text style={styles.required}>*</Text></Text>
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
          <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <StatusBar barStyle='light-content' />
            <View style={styles.status} />
            <View style={styles.headerMainView} >
              <View style={styles.headerLeft} >
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()}>
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
                </TouchableHighlight>
              </View>
              <View style={styles.headerBody} >
                <Text style={styles.headerTitleStyle}>{i18n.t('lanLabelCreateProperty')}</Text>
              </View>
            </View>
          </LinearGradient>
          {this.state.loading
          ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#ffffff' size='large' style={styles.activeIndicatorStyle} /></View>
          : null}
          <View style={styles.bodyContainer} >
            <TouchableOpacity onPress={!this.state.photos.length < 1 ? () => this.handleImage() : () => this.handlePermissions()}>
              <View style={!this.state.propImageError ? styles.imageView : styles.imageViewValid }>
                <Swiper style={styles.wrapper} showsButtons={false} showsPagination={true} autoplay={true} autoplayTimeout={1.1}>

                  {this.state.photos && this.state.photos.length ? this.state.photos.map((item, i) =>
                    item.localUri ? <Image source={{ uri: item.localUri }} style={styles.imageStyle} key={i} />
                      : <Video
                        key={i}
                        source={{ uri: item.video }}
                        shouldPlay={false}
                        isLooping={false}
                        resizeMode='cover'
                        style={{ height: 300 }}
                      />
                  ) :
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={!this.state.propImageError ? { fontFamily: 'Roboto_medium', marginTop: 80, color: '#025d8c' } : {color: 'red', fontFamily: 'Roboto_medium', marginTop: 80,}}>{i18n.t('lanLabelPleaseAddPropertyImages')}</Text>
                    </View>
                  }
                </Swiper>
                <View style={styles.plusCircle}>
                  <Icon name='camera' style={styles.plusIcon} onPress={this._takePhoto} />
                </View>
                <View style={styles.galleryCircle}>
                  <Icon name='ios-images' style={styles.plusIcon} onPress={() => this.handlePermissions()} />
                </View>
                  <View style={styles.videoCircle}>
                    <Icon name='videocam' style={styles.plusIcon} onPress={this._pickVideo} />
                  </View>
              </View>
            </TouchableOpacity>
            <View style={styles.scrollInfoView} >
              <ScrollView>
                <View style={styles.floatingInputView} >
                  <FloatingLabelInput
                    label={titlePPL}
                    value={this.state.propertyTitle}
                    onChangeText={(text) => this.setState({ propertyTitle: text, errorMessage: '', propTitleError: text ? false : true, propTitleSuccess: text ? true : false })}
                    returnKeyType = { 'next' }
                    onRef={(ref) => {
                      this.inputs['Property Title'] = ref;
                    }}
                    onSubmitEditing={() => {
                        this.focusNextField('About Property');
                    }}  
                  />
                  {this.state.propTitleError
                  ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                  : <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                  }
                </View>
                <View style={styles.floatingInputView} >
                  <FloatingLabelInput
                    label={abtPPL}
                    value={this.state.aboutProperty}
                    isError={this.state.aboutError}
                    onChangeText={(text) => this.setState({ aboutProperty: text, errorMessage: '', aboutError:text ? false : true, aboutSuccess: true })}
                    onRef={(ref) => {
                      this.inputs['About Property'] = ref;
                    }}
                    onSubmitEditing={() => {}}  
                  />
                  {this.state.aboutError
                  ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                  : this.state.aboutSuccess && !this.state.aboutError
                    ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                    : null
                  }
                </View>
                <View style={styles.floatingInputView} >
                  <Text style={[styles.pickerLabel]} >{i18n.t('lanLabelSelectPropertyType')}</Text>
                  <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', marginTop: -5.5 }} >
                    <Picker
                      iosHeader='Select one'
                      iosIcon={<Icon name='arrow-down' />}
                      mode='dropdown'
                      style={{ width:DEVICE_WIDTH-20 }}
                      selectedValue={this.state.propertyType}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({ propertyType: itemValue, errorMessage: '' })
                      }
                    >
                      {/* <Picker.Item label='Select Property Type' value='' /> */}
                      <Picker.Item label='Hotel' value='Hotel' />
                      <Picker.Item label='Individual House' value='Individual House' />
                    </Picker>
                  </View>
                </View>
                <TouchableOpacity onPress={() => this.handleCreateLocation()}>
                  <View style={styles.listItem}>
                    <Left style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                      <View>
                        <Text style={this.state.createLocEnable !== 'true' ? styles.routingTitleStyle : styles.routingTitleValidateStyle }>{i18n.t('lanLabelCreateLocation')}<Text style={styles.required}>*</Text></Text>
                      </View>
                      <View>
                        {!PropertyStore.createPropertyLocation.area
                        ? <View><Icon name='md-arrow-forward' style={!this.state.createLocEnable ? styles.routingTitleIconStyle : styles.routingTitleIconValidateStyle } /></View>
                        : <View><Icon name='ios-checkmark-circle' style={styles.routingTitleSuccessStyle } /></View>}
                      </View>
                    </Left>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleNearestArea()}>
                  <View style={styles.listItem}>
                    <Left style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                      <View>
                        <Text style={styles.routingTitleStyle}>{i18n.t('lanLabelAddNearestAreas')}<Text style={styles.required}>*</Text></Text>
                      </View>
                      <View>
                        {PropertyStore.NearestAreas.length === 0
                        ? <Icon name='md-arrow-forward' style={ styles.routingTitleIconStyle } />
                        : <Icon name='ios-checkmark-circle' style={styles.routingTitleSuccessStyle } />
                        }
                      </View>
                    </Left>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleCreateBlocking()} >
                  <View style={styles.listItem}>
                    <Left style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                      <View>
                        <Text style={styles.routingTitleStyle}>{i18n.t('lanLabelCreateBlockedDates')}<Text style={styles.required}>*</Text> </Text>
                      </View>
                      <View>
                      {!PropertyStore.createBlockedDates.blockingType
                      ? <Icon name='md-arrow-forward' style={ styles.routingTitleIconStyle } />
                      : <Icon name='ios-checkmark-circle' style={styles.routingTitleSuccessStyle } />
                      }
                      </View>
                    </Left>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleCreateInfo()}>
                  <View style={styles.listItem}>
                    <Left style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                      <View>
                        <Text style={this.state.propInfoEnable !== 'true' ? styles.routingTitleStyle : styles.routingTitleValidateStyle }>{i18n.t('lanLabelCreatePropertyInfos')}<Text style={styles.required}>*</Text></Text>
                      </View>
                      <View>
                        {!PropertyStore.createPropertyInfo.roomType
                        ? <View><Icon name='md-arrow-forward' style={!this.state.propInfoEnable ? styles.routingTitleIconStyle : styles.routingTitleIconValidateStyle } /></View>
                        : <View><Icon name='ios-checkmark-circle' style={styles.routingTitleSuccessStyle } /></View>}
                      </View>
                    </Left>
                  </View>
                </TouchableOpacity>
                {/* <Text style={{ color: 'red', fontSize: 11, fontFamily: 'Roboto_medium', paddingHorizontal: 12 }}>* All fields are Mandatory.</Text> */}
                <View style={{justifyContent:'center', alignItems:'center' }}><Text style={{ color: 'red', fontSize: 12, fontFamily: 'Roboto_medium', }}>{this.state.errorMessage}</Text></View>
                {!this.state.submitDisabled
                ? <View style={styles.btnModal} >
                  <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                    <AwesomeButton block success
                      onPress={() => this.handlePropertyCreate()}
                      width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} marginTop={20} >
                      <Text style={styles.BtnText}> {i18n.t('lanButtonCreate')} </Text>
                    </AwesomeButton>
                  </LinearGradient>
                </View>
                :<View style={styles.btnModal} >
                  <LinearGradient colors={['#ddd', '#ddd']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                    <AwesomeButton block success
                      disabled={this.state.submitDisabled}
                      onPress={() => this.handlePropertyCreate()}
                      width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} marginTop={20} >
                      <Text style={styles.BtnText}> {i18n.t('lanButtonCreate')} </Text>
                    </AwesomeButton>
                  </LinearGradient>
                </View>
                }
              </ScrollView>
              <KeyboardSpacer  />
            </View>
          </View>
        </Animated.View>
        <Toast
          ref='toast'
          style={{backgroundColor:'red', width: '96%', borderRadius:0,padding: 10, }}
          position='bottom'
          positionValue={120}
          fadeInDuration={750}
          fadeOutDuration={1000}
          // opacity={0.8}
          borderRadius={0}
          textStyle={{color:'white', fontFamily: 'Roboto_medium', }}
        />
      </View>
    );
  }
}
