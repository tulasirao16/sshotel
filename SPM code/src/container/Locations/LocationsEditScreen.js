import React from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncStorage, TouchableOpacity, TouchableHighlight, BackHandler, ScrollView, Image, Dimensions, Animated, Keyboard, UIManager, TextInput, StatusBar, ActivityIndicator, Platform } from 'react-native';
import { View, Icon, Text, Label, Picker, Left, Body, Card, CardItem } from 'native-base';
import styles from './css/LocationEditCss';
import AwesomeButton from 'react-native-really-awesome-button';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import { LinearGradient } from 'expo-linear-gradient';
import { PUBLIC_DOMAIN, GOOGLE_MAPS_API_KEY } from '../../../constants';
import Toast, { DURATION } from 'react-native-easy-toast';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;

@inject(['SPStore'])
@observer
export default class LocationsEditScreen extends React.Component {

  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };

  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    let data = navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData : {};
    this.state = {
      shift: new Animated.Value(0),
      value: '',
      _id: '',
      area: '',
      address: '',
      landmark: '',
      city: '',
      zip: '',
      state: 'Telangana',
      country: 'India',
      contactPerson: '',
      mobileNumber: '',
      alternateMobileNumber: '',
      email: '',
      latitude: '',
      longitude: '',
      locationStatus: 'Active',
      firstName: '',
      errorMessage: '',
      isloading: false,
      propertyData: data && data.propertyData ? data.propertyData : {},
      propertyID: data && data.propertyID ? data.propertyID : '',
      propertyTitle: data && data.propertyTitle ? data.propertyTitle : '',
      propertyType: data && data.propertyType ? data.propertyType : '',
      propertyImage: data && data.propertyImage ? data.propertyImage : '',
      propertyArea: data && data.propertyArea && data.propertyArea.area ? data.propertyArea.area : '',
      propertyAction: data && data.propertyAction ? data.propertyAction : 'View',
      submitDisabled: false
    }
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    this.handleBackButton = this.handleBackButton.bind(this)
    this.handleUpdateDetails = this.handleUpdateDetails.bind(this)
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  componentWillMount() {
    const navigation = this.props.navigation;
    AsyncStorage.getItem('authObj').then((value) => {
      let authObj = JSON.parse(value);
      this.setState({
        spServiceProvider: authObj.spServiceProvider,
      });
    });
    this.setState({
      _id: navigation.state.params.data._id,
      address: navigation.state.params.data.address,
      area: navigation.state.params.data.area,
      landmark: navigation.state.params.data.landmark,
      zip: navigation.state.params.data.zip,
      city: navigation.state.params.data.city,
      state: navigation.state.params.data.state,
      country: navigation.state.params.data.country,
      locationStatus: navigation.state.params.data.locationStatus,
      longitude: navigation.state.params.data.longitude,
      latitude: navigation.state.params.data.latitude,
      contactPerson: navigation.state.params.data.contactPerson,
      mobileNumber: navigation.state.params.data.mobileNumber,
      email: navigation.state.params.data.email,
      alternateMobileNumber: navigation.state.params.data.alternateMobileNumber,
      shift: new Animated.Value(0)
    });
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleBackButton() {
    const navigation = this.props.navigation;
    navigation.navigate('LocationsViewScreen');
    return true;
  }
  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight + 100);
      if (gap >= 0) {
        return;
      }
      Animated.timing(
        this.state.shift,
        {
          toValue: gap,
          duration: 10,
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
        duration: 10,
        useNativeDriver: true,
      }
    ).start();
  }

  onValueChange(value) {
    this.setState({
      country: value,
      errorMessage: ''
    });
  }

  onStateChange(value) {
    this.setState({
      state: value,
      errorMessage: ''
    });
  }

  onStatusChange(value) {
    this.setState({
      locationStatus: value,
      errorMessage: ''
    });
  }
  handleLocation = () => {
    this.setState({ isloading: true })
    let _this = this; var isArea= false;
    let isLoading = setTimeout(function () {
      _this.setState({ isloading: false });
    }, 10000);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        this.getLocation(position.coords.latitude, position.coords.longitude, function (data) {
          if (data.statusCode == '0000') {
            clearTimeout(isLoading);
            _this.setState({ isloading: false, address: data.address });
            data.result.forEach(value => {
              if (value.types.indexOf('premise') != -1) {
                _this.setState({ houseNumber: value.long_name });
              }
              if (value.types.indexOf('administrative_area_level_2') != -1) {
                _this.setState({ city: value.long_name });
              }
              if (value.types.indexOf('administrative_area_level_1') != -1) {
                _this.setState({ state: value.long_name });
              }
              // if (value.types.indexOf('sublocality') != -1) {
              //   _this.setState({ address: _this.state.houseNumber + ', ' + _this.state.lineName + ', ' + _this.state.street + ', ' + value.long_name });
              // }
              if (value.types.indexOf('sublocality_level_2') != -1) {
                _this.setState({ street: value.long_name });
              }
              if (value.types.indexOf('sublocality_level_3') != -1) {
                _this.setState({ lineName: value.long_name });
              }
              if (value.types.indexOf('sublocality_level_1') != -1) {
                isArea = true
                _this.setState({ area: value.long_name });
              } else if (!isArea && value.types.indexOf('locality') != -1) {
                _this.setState({ area: value.long_name });
              }
              if (value.types.indexOf('postal_code') != -1) {
                _this.setState({ zip: value.long_name });
              }
              if (value.types.indexOf('locality') != -1) {
                _this.setState({ areaLocality: value.long_name });
              }
              if (value.types.indexOf('country') != -1) {
                _this.setState({ country: value.long_name });
              }
            });
          } else {
            clearTimeout(isLoading);
            _this.setState({ isloading: false });
            // alert(i18n.t('lanLabelNotGettingLocationPleaseEnterManually'));
            _this.refs.toast.show(i18n.t('lanLabelNotGettingLocationPleaseEnterManually'));
          }
        });
      },
      (error) => {
        clearTimeout(isLoading);
        this.setState({ errorMessage: error.message, isloading: false })
      },
      { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
    );
  }

  getLocation(lat, long, callback) {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=' + GOOGLE_MAPS_API_KEY)
      .then((response) => response.json())
      .then((responseJson) => {
        callback({ statusCode: '0000', result: responseJson.results[0].address_components, address: responseJson.results[0].formatted_address });
      }).catch((error) => {
        callback({ statusCode: '9999', result: {}, address: '' });
      });
  }

  handleUpdateDetails() {
    const SPStore = this.props.SPStore;
    navigation = this.props.navigation
    const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phValidation = /^((\(\d{3}\))|\d{3,4})(\-|\s)?(\d{3})(\-|\s)?(\d{1,4})(\-|\s)?(\d{1,3})$/
    if (!this.state.address.trim()) {
      this.refs.toast.show(i18n.t('lanErrorAddressIsRequired'));
      // this.setState({ errorMessage: 'Address is required' })
    } else if (!this.state.area.trim()) {
      this.refs.toast.show(i18n.t('lanErrorAreaIsRequired'));
      // this.setState({ errorMessage: 'Area is required' })
    } else if (!this.state.zip.trim()) {
      this.refs.toast.show(i18n.t('lanErrorPincodeIsRequired'));
      // this.setState({ errorMessage: 'Pincode is required' })
    } else if (!this.state.city.trim()) {
      this.refs.toast.show(i18n.t('lanErrorCityIsRequired'));
      // this.setState({ errorMessage: 'City is required' })
    } else if (!this.state.state.trim()) {
      this.refs.toast.show(i18n.t('lanErrorStateIsRequired'));
      // this.setState({ errorMessage: 'State is required' })
    } else if (!this.state.country.trim()) {
      this.refs.toast.show(i18n.t('lanErrorCountryIsRequired'));
      // this.setState({ errorMessage: 'Country is required' })
    } else if (!this.state.mobileNumber.trim()) {
      this.refs.toast.show(i18n.t('lanErrorMobileNumberIsRequired'));
      // this.setState({ errorMessage: 'Mobile Number is required' })
    } else if (this.state.mobileNumber.trim() && !phValidation.test(this.state.mobileNumber.trim())) {
      // this.setState({ errorMessage: 'Invalid MobileNumber' })
      this.refs.toast.show(i18n.t('lanErrorInvalidMobileNumber'));
      // } else if (!this.state.alternateMobileNumber.trim()) {
      //   this.setState({ errorMessage: 'AlternateMobileNumber is required' })
    } else if (this.state.alternateMobileNumber.trim() && !phValidation.test(this.state.alternateMobileNumber.trim())) {
      // this.setState({ errorMessage: 'Invalid AlternateMobileNumber' })
      this.refs.toast.show(i18n.t('lanErrorInvalidAlternateMobileNumber'));
    } else if (!this.state.email.trim()) {
      this.refs.toast.show(i18n.t('lanErrorEmailIsRequired'));
      // this.setState({ errorMessage: 'Email is Required' })
    } else if (!emailValidation.test(this.state.email)) {
      this.refs.toast.show(i18n.t('lanErrorInvalidEmail'));
      // this.setState({ errorMessage: 'Invalid Email' })
    } else if (!this.state.latitude) {
      this.refs.toast.show(i18n.t('lanErrorLatitudeIsRequired'));
      // this.setState({ errorMessage: 'Latitude is Required' });
    } else if (!this.state.longitude) {
      this.refs.toast.show(i18n.t('lanErrorLongitudeIsRequired'));
      // this.setState({ errorMessage: 'Longitude is Required' });
    } else if (!this.state.locationStatus) {
      this.refs.toast.show(i18n.t('lanErrorLocationStatusIsRequired'));
      // this.setState({ errorMessage: 'LocationStatus is Required' });
    } else if (!this.state.contactPerson.trim()) {
      this.refs.toast.show(i18n.t('lanErrorContactPersonIsRequired'));
      // this.setState({ errorMessage: 'ContactPerson is Required' });
    } else {
      this.setState({ submitDisabled: true, isloading: true })
      let propertyData = this.state.propertyData
      let updateLocationData = {
        _id: this.state._id,
        address: this.state.address,
        area: this.state.area,
        zip: this.state.zip,
        city: this.state.city,
        state: this.state.state,
        landmark: this.state.landmark,
        country: this.state.country,
        contactPerson: this.state.contactPerson,
        mobileNumber: this.state.mobileNumber,
        alternateMobileNumber: this.state.alternateMobileNumber,
        email: this.state.email,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        locationStatus: this.state.locationStatus,
        propertyID: this.state.propertyID
      }
      let _this = this;
      let isLoading = setTimeout(function () {
        _this.setState({ submitDisabled: false, isloading: false });
         _this.refs.toast.show(i18n.t('lanLabelServerNotResponding'));
      }, 20000);
      SPStore.updateLocations(updateLocationData, function (resObj) {
        if (resObj.statusCode == '0000') {
          propertyData.spLocationId = resObj.statusResult
          _this.refs.toastsuccess.show(i18n.t('lanSuccessLocationUpdatedSuccessfully'));
          if (_this.state.propertyID) {
            navigation.navigate('PropertyView', { data: propertyData });
            clearTimeout(isLoading)
          } else {
            SPStore.getSpLocationsList(1, '', function (resObj) {
              clearTimeout(isLoading)
              _this.setState({ isloading: false, submitDisabled: false });
              navigation.navigate('LocationsList', { location: 'location' });
            });
          }
        } else {
          clearTimeout(isLoading)
          _this.setState({ isloading: false, submitDisabled: false });
          _this.refs.toast.show(i18n.t('lanErrorLocationUpdatedFailed'));
        }
        // _this.setState({ errorMessage: 'Location Updated Successfully', disableValue: false });
      });
    }
  }
  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    return (
      <View style={styles.container}>
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
              <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleLocationEdit')}</Text>
            </View>
            <View style={styles.headerRight} >
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={this.handleLocation}>
                <Icon name='md-locate' style={styles.iconLocationStyle} />
              </TouchableHighlight>
            </View>
          </View>
        </LinearGradient>
        {this.state.isloading
          ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#FFFFFF' size='large' style={ styles.activeIndicatorStyle } /></View>
          : null}
          <View style={styles.businessNameView} >
            <Card style={styles.cardBusiness}>
              <CardItem style={styles.cardItemBusinessStyle}>
                <Left style={[styles.leftImageView, styles.listItemView]}>
                  {/* <View style={styles.imageBusinessBox} >
                    <Image source={this.state.propertyImage ? { uri: PUBLIC_DOMAIN + this.state.propertyImage } : require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
                  </View> */}
                  <Body>
                    <View style={styles.floatingInputBusinessView} >
                      <Text style={styles.propertyTitle}> {this.state.propertyTitle ? this.state.propertyTitle : this.state.spServiceProvider} </Text>
                      <Text style={styles.titleType}> {this.state.propertyType ? this.state.propertyType : this.state.contactPerson} </Text>
                    </View>
                  </Body>
                </Left>
              </CardItem>
            </Card>
          </View>
          <ScrollView>
          <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
            <View style={styles.content}>
              <View style={styles.input}>
                <FloatingLabelInput
                  label={i18n.t('lanLabelArea')}
                  value={this.state.area}
                  onChangeText={(text) => this.setState({ area: text, errorMessage: '' })}
                  minLength={2} maxLength={30}
                  returnKeyType = { 'next' }
                  onRef={(ref) => {
                    this.inputs['Area'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('Landmark');
                  }} 
                />
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  label={i18n.t('lanLabelLandmark')}
                  value={this.state.landmark}
                  onChangeText={(text) => this.setState({ landmark: text, errorMessage: '' })}
                  minLength={2} maxLength={30}
                  returnKeyType = { 'next' }
                  onRef={(ref) => {
                    this.inputs['Landmark'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('Pin Code');
                  }} 
                />
              </View>
              <View style={styles.dropdownView}>
                <View style={styles.pincodestyle}>
                  <FloatingLabelInput
                    label={i18n.t('lanLabelPinCode')}
                    value={this.state.zip}
                    keyboardType={'numeric'}
                    onChangeText={(text) => this.setState({ zip: text, errorMessage: '' })}
                    maxLength={6}
                    returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                      onRef={(ref) => {
                        this.inputs['Pin Code'] = ref;
                      }}
                      onSubmitEditing={() => {
                          this.focusNextField('City');
                      }} 
                  />
                </View>
                <View style={styles.rightView}>
                  <Picker
                    mode='dropdown'
                    iosHeader='Select one'
                    iosIcon={<Icon name='arrow-down' />}
                    style={{width:DEVICE_WIDTH/2.1, marginTop:-10}}
                    selectedValue={this.state.locationStatus}
                    onValueChange={this.onStatusChange.bind(this)}
                  >
                    <Picker.Item label='Active' value='Active' />
                    <Picker.Item label='Inactive' value='Inactive' />
                  </Picker>
                </View>
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  label={i18n.t('lanLabelCity')}
                  value={this.state.city}
                  onChangeText={(text) => this.setState({ city: text, errorMessage: '' })}
                  minLength={2} maxLength={20}
                  returnKeyType = { 'next' }
                      onRef={(ref) => {
                        this.inputs['City'] = ref;
                      }}
                      onSubmitEditing={() => {
                          this.focusNextField('Latitude');
                      }} 
                />
              </View>
              <View style={styles.dropdownView}>
                <View style={styles.leftView}>
                  <Picker
                    mode='dropdown'
                    iosHeader='Select one'
                    iosIcon={<Icon name='arrow-down' />}
                    style={{width:DEVICE_WIDTH/2.1}}
                    selectedValue={this.state.country}
                    onValueChange={this.onValueChange.bind(this)}
                  >
                    <Picker.Item label='India' value='India' />
                    {/* <Picker.Item label='USA' value='USA' />
                    <Picker.Item label='Canada' value='Canada' />
                    <Picker.Item label='Australia' value='Australia' /> */}
                  </Picker>
                </View>
                <View style={styles.rightView}>
                  <Picker
                    mode='dropdown'
                    iosHeader='Select one'
                    iosIcon={<Icon name='arrow-down' />}
                    style={{width:DEVICE_WIDTH/2.1}}
                    selectedValue={this.state.state}
                    onValueChange={this.onStateChange.bind(this)}
                  >
                    <Picker.Item label='Telangana' value='Telangana' />
                    <Picker.Item label='Andhra Pradesh' value='Andhra Pradesh' />
                  </Picker>
                </View>
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  label={i18n.t('lanLabelLatitude')}
                  value={this.state.latitude.toString()}
                  onChangeText={(text) => this.setState({ latitude: text, errorMessage: '' })}
                  minLength={2} maxLength={15}
                  returnKeyType = { 'next' }
                      onRef={(ref) => {
                        this.inputs['Latitude'] = ref;
                      }}
                      onSubmitEditing={() => {
                          this.focusNextField('Longitude');
                      }}
                />
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  label={i18n.t('lanLabelLongitude')}
                  value={this.state.longitude.toString()}
                  onChangeText={(text) => this.setState({ longitude: text, errorMessage: '' })}
                  minLength={2} maxLength={15}
                  returnKeyType = { 'next' }
                  onRef={(ref) => {
                    this.inputs['Longitude'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('Contact Person');
                  }}
                />
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  label={i18n.t('lanLabelContactPerson')}
                  value={this.state.contactPerson}
                  onChangeText={(text) => this.setState({ contactPerson: text, errorMessage: '', })}
                  minLength={2} maxLength={20}
                  returnKeyType = { 'next' }
                  onRef={(ref) => {
                    this.inputs['Contact Person'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('Mobile Number');
                  }}
                />
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  label={i18n.t('lanLabelMobileNumber')}
                  value={this.state.mobileNumber}
                  onChangeText={(text) => this.setState({ mobileNumber: text, errorMessage: '' })}
                  maxLength={10}
                  keyboardType='numeric'
                  returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                  onRef={(ref) => {
                    this.inputs['Mobile Number'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('Alternate Mobile Number');
                  }}
                />
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  label={i18n.t('lanLabelAlternateMobileNumber')}
                  value={this.state.alternateMobileNumber}
                  onChangeText={(text) => this.setState({ alternateMobileNumber: text, errorMessage: '' })}
                  maxLength={10}
                  keyboardType='numeric'
                  returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                  onRef={(ref) => {
                    this.inputs['Alternate Mobile Number'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('Email');
                  }}
                />
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  label={i18n.t('lanLabelEmail')}
                  value={this.state.email}
                  onChangeText={(text) => this.setState({ email: text, errorMessage: '' })}
                  maxlength={30}
                  returnKeyType = { 'next' }
                  onRef={(ref) => {
                    this.inputs['Email'] = ref;
                  }}
                  onSubmitEditing={() => { this.addressField.focus()}}
                />
              </View>
              <View style={styles.textAreaContainer} >
                <Label style={styles.labels}>{i18n.t('lanLabelAddress')}</Label>
                <View>
                  <TextInput
                    style={styles.textArea}
                    value={this.state.address}
                    onChangeText={(text) => this.setState({ address: text, errorMessage: '' })}
                    underlineColorAndroid='transparent'
                    numberOfLines={10}
                    multiline={true}
                    editable={true}
                    returnKeyType = { 'next' }
                    ref={(input) => {this.addressField = input}}
                  />
                </View>
              </View>
              <Text style={{ color: 'green', fontFamily: 'Roboto_medium' }}>{this.state.errorMessage}</Text>
              <View style={styles.btnModal} >
                <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                  {/* <AwesomeButton block success
                    onPress={() => this.handleUpdateDetails()}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} marginTop={20} >
                    <Text style={styles.BtnText}> Update </Text>
                  </AwesomeButton> */}
                  {!this.state.submitDisabled
                    ? <AwesomeButton block success
                        onPress={() => this.handleUpdateDetails()}
                        width={DEVICE_WIDTH/3} height={44} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={22} marginTop={20}>
                        <Text style={styles.BtnText} >{i18n.t('lanCommonButtonUpdate')}</Text>
                        </AwesomeButton>
                    : <AwesomeButton block success
                        disabled={true}
                        onPress={() => this.handleUpdateDetails()}
                        width={DEVICE_WIDTH/3} height={44} backgroundColor='#ddd' backgroundShadow='#ddd' backgroundDarker='#ddd' paddingHorizontal={50} borderRadius={22} marginTop={20}>
                        <Text style={styles.BtnText} >{i18n.t('lanCommonButtonUpdate')}</Text>
                        </AwesomeButton>
                    }
                </LinearGradient>
              </View>
            </View>
            </Animated.View>
          </ScrollView>
        
        <Toast
          ref='toast'
          style={{backgroundColor:'red', width: '100%', borderRadius:0,padding: 10, }}
          position='top'
          positionValue={120}
          fadeInDuration={750}
          fadeOutDuration={1000}
          // opacity={0.8}
          borderRadius={0}
          textStyle={{color:'white', fontFamily: 'Roboto_medium', }}
        />
         <Toast
          ref='toastsuccess'
          style={{backgroundColor:'green', width: '100%', borderRadius:0,padding: 10,  }}
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
