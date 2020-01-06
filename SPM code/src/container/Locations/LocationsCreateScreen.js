import React from 'react';
import { observer, inject } from 'mobx-react';
import { BackHandler, ScrollView, Dimensions, TouchableHighlight, TouchableOpacity, Animated, Keyboard, StatusBar, UIManager, TextInput, AsyncStorage, Image, ActivityIndicator, Platform } from 'react-native';
import { View, Icon, Text, Item, Picker, Label, Left, Body, Card, CardItem } from 'native-base';
import styles from './css/LocationCreateCss';
import AwesomeButton from "react-native-really-awesome-button";
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import { LinearGradient } from 'expo-linear-gradient';
import { GOOGLE_MAPS_API_KEY } from '../../../constants';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import i18n from 'i18n-js';
import Toast, { DURATION } from 'react-native-easy-toast';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;
const Device_Height = Dimensions.get('window').height;

@inject(['SPStore'], ['PropertyStore'])
@observer
export default class LocationsCreateScreen extends React.Component {

  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };

  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    let pdata = PropertyStore.createPropertyLocation ? PropertyStore.createPropertyLocation : {};
    let data = navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData : {};
    this.state = {
      shift: new Animated.Value(0),
      authObj: {},
      value: '',
      area: pdata && pdata.area ? pdata.area : '',
      address: pdata && pdata.address ? pdata.address : '',
      landmark: pdata && pdata.landmark ? pdata.landmark : '',
      city: pdata && pdata.city ? pdata.city : '',
      zip: pdata && pdata.zip ? pdata.zip : '',
      state: pdata && pdata.state ? pdata.state : 'Telangana',
      country: pdata && pdata.country ? pdata.country : 'India',
      contactPerson: pdata && pdata.contactPerson ? pdata.contactPerson : '',
      mobileNumber: pdata && pdata.mobileNumber ? pdata.mobileNumber : '',
      alternateMobileNumber: pdata && pdata.alternateMobileNumber ? pdata.alternateMobileNumber : '',
      email: pdata && pdata.email ? pdata.email : '',
      latitude: pdata && pdata.latitude ? pdata.latitude : '',
      longitude: pdata && pdata.longitude ? pdata.longitude : '',
      locationStatus: pdata && pdata.locationStatus ? pdata.locationStatus : 'Active',
      firstName: pdata && pdata.firstName ? pdata.firstName : '',
      spServiceProvider: pdata && pdata.spServiceProvider ? pdata.spServiceProvider : '',
      errorMessage: '',
      createproperty: data && data.property ? data.property : '',
      // showIndicator: false,
      isloading: false,
      isDisabled: false,
      submitDisabled: false,
      areaError: '', areaSuccess: '',
      landMarkSuccess: '',
      pincodeError: '', pincodeSuccess: '',
      cityError: '', citySuccess: '',
      latError: '', latSuccess: '',
      longError: '', longSuccess: '',
      contactPersonSuccess: '',
      mobileError: '', mobileSuccess: '',
      emailError: '', emailSuccess: '',
      reload: false,
      reloadFunction: '',
    }
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    this.handleBackButton = this.handleBackButton.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  async componentWillMount() {
    const SPStore = this.props.SPStore;
    await AsyncStorage.getItem('authObj').then((value) => {
      let authObj = JSON.parse(value);
      this.setState({
        authObj: authObj,
        firstName: authObj.firstName,
        mobileNumber: authObj.mobileNumber,
        alternateMobileNumber: authObj.alternateMobileNumber,
        email: authObj.email,
        spServiceProvider: authObj.spServiceProvider
      });
    });
  }
  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleBackButton() {
    const navigation = this.props.navigation;
    navigation.navigate('LocationsList');
    return true;
  }

  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight + 130);
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
  handleKeyboardDidHide = () => {
    Animated.timing(
      this.state.shift,
      {
        toValue: 0,
        duration: 0,
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
    this.setState({ isloading: true });
    let _this = this; var isArea= false;
    let isLoading = setTimeout(function () {
      _this.setState({ isloading: false });
    }, 15000);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        this.getLocation(position.coords.latitude, position.coords.longitude, function (data) {
          if (data.statusCode == '0000') {
            clearTimeout(isLoading)
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
              // if (value.types.indexOf('sublocality_level_1') != -1) {
              //   _this.setState({ area: value.long_name });
              // }
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
            clearTimeout(isLoading)
            _this.setState({ isloading: false });
            // alert(i18n.t('lanLabelNotGettingLocationPleaseEnterManually'));
            _this.refs.toast.show(i18n.t('lanLabelNotGettingLocationPleaseEnterManually'));
          }
        });
      },
      (error) => {
        clearTimeout(isLoading)
        _this.setState({ errorMessage: error.message, isloading: false })
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

  handleSubmitDetails() {
    this.setState({ isDisabled: true })
    const SPStore = this.props.SPStore;
    const PropertyStore = this.props.PropertyStore;
    const navigation = this.props.navigation
    const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phValidation = /^((\(\d{3}\))|\d{3,4})(\-|\s)?(\d{3})(\-|\s)?(\d{1,4})(\-|\s)?(\d{1,3})$/
    if (!this.state.area.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorAreaIsRequired'), isDisabled: false, areaError: true, areaSuccess: false })
    } else if (!this.state.zip.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorPincodeIsRequired'), isDisabled: false, pincodeError: true, pincodeSuccess: 'false' })
    } else if (!this.state.city.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorCityIsRequired'), isDisabled: false, cityError: true, citySuccess: false })
    } else if (!this.state.state) {
      this.setState({ errorMessage: i18n.t('lanErrorStateIsRequired'), isDisabled: false })
    } else if (!this.state.country) {
      this.setState({ errorMessage: i18n.t('lanErrorCountryIsRequired'), isDisabled: false })
    } else if (!this.state.latitude) {
      this.setState({ errorMessage: i18n.t('lanErrorLatitudeIsRequired'), isDisabled: false, latError: true, latSuccess: false });
    } else if (!this.state.longitude) {
      this.setState({ errorMessage: i18n.t('lanErrorLongitudeIsRequired'), isDisabled: false, longError: true, longSuccess: false });
    } else if (!this.state.locationStatus) {
      this.setState({ errorMessage: i18n.t('lanErrorLocationStatusIsRequired'), isDisabled: false });
    } else if (!this.state.firstName.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorContactPersonIsRequired'), isDisabled: false })
    } else if (!this.state.mobileNumber.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorMobileNumberIsRequired'), isDisabled: false, mobileError: true, mobileSuccess: false })
    } else if (this.state.mobileNumber.trim() && !phValidation.test(this.state.mobileNumber.trim())) {
      this.setState({ errorMessage: i18n.t('lanErrorInvalidMobileNumber'), isDisabled: false })
      // } else if (!this.state.alternateMobileNumber) {
      //   this.setState({ errorMessage: 'AlternateMobileNumber is required', isDisabled: false })
    } else if (this.state.alternateMobileNumber && !phValidation.test(this.state.alternateMobileNumber)) {
      this.setState({ errorMessage: i18n.t('lanErrorInvalidAlternateMobileNumber'), isDisabled: false })
    } else if (!this.state.email.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorEmailIsRequired'), isDisabled: false })
    } else if (!emailValidation.test(this.state.email)) {
      this.setState({ errorMessage: i18n.t('lanErrorInvalidEmail'), isDisabled: false })
    } else if (!this.state.address.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorAddressIsRequired'), isDisabled: false })
    } else {
      this.setState({ submitDisabled: true, isloading: true })
      let locationData = {
        'address': this.state.address,
        'area': this.state.area,
        'zip': this.state.zip,
        'city': this.state.city,
        'state': this.state.state,
        'landmark': this.state.landmark,
        'country': this.state.country,
        'contactPerson': this.state.firstName,
        'mobileNumber': this.state.mobileNumber,
        'alternateMobileNumber': this.state.alternateMobileNumber,
        'email': this.state.email,
        'latitude': this.state.latitude,
        'longitude': this.state.longitude,
        'locationStatus': this.state.locationStatus
      }
      if (this.state.createproperty == 'create') {
        _this.setState({ isloading: false, submitDisabled: false });
        PropertyStore.createPropertyLocation = locationData;
        navigation.goBack();
      } else {
        let _this = this;
        let isLoading = setTimeout(function () {
          _this.setState({ isloading: false, reload: true, reloadFunction: 'handleSubmitDetails' });
        }, 20000);
        SPStore.postLocations(locationData, function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ isloading: false, submitDisabled: false });
          if (resObj.statusCode == '0000') {
            navigation.navigate('LocationsList', { location: 'location' });
          }
        });
      }
    }
  }

  handleReload = () => {
    switch (this.state.reloadFunction) {
      case 'handleSubmitDetails':
        this.setState({ reload: false, reloadFunction: '' });
        const navigation = this.props.navigation
        navigation.navigate('LocationsList', { location: 'location' });
        break;
      case 'handleLocation':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleLocation()
        break;
      default:
        break;
    }
  }
  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    const areaLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelArea')}<Text style={styles.required}>*</Text></Text>
    const pincodeLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelPinCode')}<Text style={styles.required}>*</Text></Text>
    const cityLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelCity')}<Text style={styles.required}>*</Text></Text>
    const latitudeLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelLatitude')}<Text style={styles.required}>*</Text></Text>
    const longitudeLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelLongitude')}<Text style={styles.required}>*</Text></Text>
    const mobileNoLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelMobileNumber')}<Text style={styles.required}>*</Text></Text>
    const emailLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelEmail')}<Text style={styles.required}>*</Text></Text>
    const contactPersonLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelContactPerson')}</Text>
    const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return (
      !this.state.reload
        ? <View style={styles.container}>
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
                <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleLocationCreate')} </Text>
              </View>
              {/* <View style={styles.headerRight} >
              <TouchableOpacity activeOpacity={0.8}>
                <Icon name='pin' style={styles.iconMenuStyle} />
              </TouchableOpacity>
            </View> */}
              <View style={styles.headerRight} >
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={this.handleLocation}>
                  <Icon name='md-locate' style={styles.iconLocationStyle} />
                </TouchableHighlight>
              </View>
            </View>
          </LinearGradient>
          {this.state.isloading
            ? <View style={ styles.activeIndicatorView }><ActivityIndicator color="#FFFFFF" size='large' style={ styles.activeIndicatorStyle } /></View>
            : null}
          <View style={styles.businessNameView} >
            <Card style={styles.cardBusiness}>
              <CardItem style={styles.cardItemBusinessStyle}>
                <Left style={[styles.leftImageView, styles.listItemView]}>
                  {/* <View style={styles.imageBusinessBox} >
                    <Image source={require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
                  </View> */}
                  <Body>
                    <View style={styles.floatingInputBusinessView} >
                      <Text style={styles.propertyTitle}> {this.state.spServiceProvider} </Text>
                      {/* <Text style={styles.titleLocationType}> Tarnaka </Text> */}
                      <Text style={styles.titleType}>{i18n.t('lanLabelHotelCreateLocation')} </Text>
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
                    label={areaLbl}
                    isError={this.state.areaError}
                    value={this.state.area}
                    onChangeText={(text) => this.setState({ area: text, errorMessage: '', areaError: text ? false : true, areaSuccess: true })}
                    minLength={2} maxLength={30}
                    returnKeyType={'next'}
                    onRef={(ref) => {
                      this.inputs['Area'] = ref;
                    }}
                    onSubmitEditing={() => {
                      this.focusNextField('Landmark');
                    }}
                  />
                  {this.state.areaError
                    ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={styles.errorIcon} /></View>
                    : this.state.areaSuccess && !this.state.areaError
                      ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                      : null
                  }
                </View>
                <View style={styles.input}>
                  <FloatingLabelInput
                    label={i18n.t('lanLabelLandmark')}
                    value={this.state.landmark}
                    onChangeText={(text) => this.setState({ landmark: text, errorMessage: '', landMarkSuccess: text ? true : false })}
                    minLength={2} maxLength={30}
                    returnKeyType={'next'}
                    onRef={(ref) => {
                      this.inputs['Landmark'] = ref;
                    }}
                    onSubmitEditing={() => {
                      this.focusNextField('PIN Code');
                    }}
                  />
                  {this.state.landMarkSuccess
                    ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                    : null}
                </View>
                <View style={styles.dropdownView}>
                  <View style={styles.pincodestyle}>
                    <FloatingLabelInput
                      label={pincodeLbl}
                      isError={this.state.pincodeError}
                      value={this.state.zip}
                      keyboardType={'numeric'}
                      onChangeText={(text) => this.setState({ zip: text, errorMessage: '', pincodeError: text.length >= 6 ? false : true, pincodeSuccess: text.length >= 6 ? true : false })}
                      maxLength={6}
                      returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                      onRef={(ref) => {
                        this.inputs['PIN Code'] = ref;
                      }}
                      onSubmitEditing={() => {
                        this.focusNextField('City');
                      }}
                    />
                    {this.state.pincodeError
                      ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={styles.errorIcon} /></View>
                      : this.state.pincodeSuccess && !this.state.pincodeError
                        ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                        : null
                    }
                  </View>
                  <View style={styles.rightView}>
                    <Picker
                      mode="dropdown"
                      iosHeader="Select Location Status"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: DEVICE_WIDTH / 2.1, marginTop: -10 }}
                      selectedValue={this.state.locationStatus}
                      onValueChange={this.onStatusChange.bind(this)}
                    >
                      <Picker.Item label="Active" value="Active" />
                      <Picker.Item label="Inactive" value="Inactive" />
                    </Picker>
                  </View>
                </View>
                <View style={styles.input}>
                  <FloatingLabelInput
                    label={cityLbl}
                    isError={this.state.cityError}
                    value={this.state.city}
                    onChangeText={(text) => this.setState({ city: text, errorMessage: '', cityError: text ? false : true, citySuccess: true })}
                    minLength={2} maxLength={20}
                    returnKeyType={'next'}
                    onRef={(ref) => {
                      this.inputs['City'] = ref;
                    }}
                    onSubmitEditing={() => {
                      this.focusNextField('Latitude');
                    }}
                  />
                  {this.state.cityError
                    ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={styles.errorIcon} /></View>
                    : this.state.citySuccess && !this.state.cityError
                      ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                      : null
                  }
                </View>
                <View style={styles.dropdownView}>
                  <View style={styles.leftView}>
                    <Picker
                      mode="dropdown"
                      iosHeader="Select Country"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: DEVICE_WIDTH / 2.1 }}
                      selectedValue={this.state.country}
                      onValueChange={this.onValueChange.bind(this)}
                    >
                      <Picker.Item label="India" value="India" />
                      <Picker.Item label="USA" value="USA" />
                      <Picker.Item label="Canada" value="Canada" />
                      <Picker.Item label="Australia" value="Australia" />
                    </Picker>
                  </View>
                  <View style={styles.rightView}>
                    <Picker
                      mode="dropdown"
                      iosHeader="Select State"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: DEVICE_WIDTH / 2.1 }}
                      selectedValue={this.state.state}
                      onValueChange={this.onStateChange.bind(this)}
                    >
                      <Picker.Item label="Telangana" value="Telangana" />
                      <Picker.Item label="Andhra Pradesh" value="Andhra Pradesh" />
                    </Picker>
                  </View>
                </View>
                <View style={styles.floatingInputView}>
                  <View style={styles.leftinputView}>
                    <FloatingLabelInput
                      label={latitudeLbl}
                      value={this.state.latitude.toString()}
                      isError={this.state.latError}
                      onChangeText={(text) => this.setState({ latitude: text, errorMessage: '', latError: text ? false : true, latSuccess: true })}
                      minLength={2} maxLength={15}
                      returnKeyType={'next'}
                      onRef={(ref) => {
                        this.inputs['Latitude'] = ref;
                      }}
                      onSubmitEditing={() => {
                        this.focusNextField('Longitude');
                      }}
                    />
                    {this.state.latError
                      ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={styles.errorIcon} /></View>
                      : this.state.latSuccess && !this.state.latError
                        ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                        : null
                    }
                  </View>
                  <View style={styles.rightinputView}>
                    <FloatingLabelInput
                      label={longitudeLbl}
                      isError={this.state.longError}
                      value={this.state.longitude.toString()}
                      onChangeText={(text) => this.setState({ longitude: text, errorMessage: '', longError: text ? false : true, longSuccess: true })}
                      minLength={2} maxLength={15}
                      returnKeyType={'next'}
                      onRef={(ref) => {
                        this.inputs['Longitude'] = ref;
                      }}
                      onSubmitEditing={() => {
                        this.focusNextField('Contact Person');
                      }}
                    />
                    {this.state.longError
                      ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={styles.errorIcon} /></View>
                      : this.state.longSuccess && !this.state.longError
                        ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                        : null
                    }
                  </View>
                </View>
                <View style={styles.input}>
                  <FloatingLabelInput
                    label={contactPersonLbl}
                    value={this.state.firstName}
                    onChangeText={(text) => this.setState({ firstName: text, errorMessage: '', contactPersonSuccess: text ? true : false })}
                    minLength={2} maxLength={20}
                    returnKeyType={'next'}
                    onRef={(ref) => {
                      this.inputs['Contact Person'] = ref;
                    }}
                    onSubmitEditing={() => {
                      this.focusNextField('Mobile Number');
                    }}
                  />
                  {this.state.contactPersonSuccess
                    ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                    : null}
                </View>
                <View style={styles.input}>
                  <FloatingLabelInput
                    label={mobileNoLbl}
                    isError={this.state.mobileError}
                    value={this.state.mobileNumber}
                    keyboardType='numeric'
                    onChangeText={(text) => this.setState({ mobileNumber: text, errorMessage: '', mobileError: text ? false : true, mobileSuccess: text.length == 10 ? true : false })}
                    maxLength={10}
                    returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                    onRef={(ref) => {
                      this.inputs['Mobile Number'] = ref;
                    }}
                    onSubmitEditing={() => {
                      this.focusNextField('Alternate Mobile Number');
                    }}
                  />
                  {this.state.mobileError
                    ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={styles.errorIcon} /></View>
                    : this.state.mobileSuccess && !this.state.mobileError
                      ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                      : null
                  }
                </View>
                <View style={styles.input}>
                  <FloatingLabelInput
                    label={i18n.t('lanLabelAlternateMobileNumber')}
                    value={this.state.alternateMobileNumber}
                    onChangeText={(text) => this.setState({ alternateMobileNumber: text, errorMessage: '', altMobileNum: text.length == 10 ? true : false })}
                    keyboardType='numeric'
                    maxLength={10}
                    returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                    onRef={(ref) => {
                      this.inputs['Alternate Mobile Number'] = ref;
                    }}
                    onSubmitEditing={() => {
                      this.focusNextField('Email');
                    }}
                  />
                  {this.state.altMobileNum
                    ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                    : null}
                </View>
                <View style={styles.input}>
                  <FloatingLabelInput
                    label={emailLbl}
                    isError={this.state.emailError}
                    value={this.state.email}
                    onChangeText={(text) => this.setState({ email: text, errorMessage: '', emailError: !emailValidation.test(text), emailSuccess: emailValidation.test(text) })}
                    maxlength={30}
                    returnKeyType={'next'}
                    onRef={(ref) => {
                      this.inputs['Email'] = ref;
                    }}
                    onSubmitEditing={() => { this.addressfield.focus() }}
                  />
                  {this.state.emailError
                    ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={styles.errorIcon} /></View>
                    : this.state.emailSuccess && !this.state.emailError
                      ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                      : null
                  }
                </View>
                <View style={styles.textAreaContainer} >
                  <Label style={styles.labels}>{i18n.t('lanLabelAddress')}</Label>
                  <View style={{ flex: 5 }}>
                    <TextInput
                      style={!this.state.addressError ? styles.textArea : styles.textAreaError}
                      value={this.state.address}
                      onChangeText={(text) => this.setState({ address: text, errorMessage: '', addressError: text ? false : true, addressSuccess: true })}
                      underlineColorAndroid="transparent"
                      numberOfLines={10}
                      multiline={true}
                      editable={true}
                      returnKeyType={'next'}
                      ref={(input) => { this.addressfield = input }}
                      onSubmitEditing={() => { this.handleSubmitDetails() }}
                    />
                    {this.state.addressError
                      ? <View style={styles.errorIconViewAddress}><Icon name='ios-close-circle' style={styles.errorIcon} /></View>
                      : this.state.addressSuccess && !this.state.addressError
                        ? <View style={styles.errorIconViewAddress}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                        : null
                    }
                  </View>
                </View>
                <View style={styles.centerLine}>
                  <Text style={styles.mediumFont}>{i18n.t('lanLabelIfNotMapedTypeTheAddressManualy')}</Text>
                </View>
                <Text style={{ color: 'red', marginTop: 4 }}>{this.state.errorMessage}</Text>

                <View style={styles.btnModal} >
                  <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                    {/* <AwesomeButton block success
                    disabled={this.state.isDisabled}
                    onPress={() => this.handleSubmitDetails()}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                    <Text style={styles.BtnText}> Submit </Text>
                  </AwesomeButton> */}
                    {!this.state.submitDisabled
                      ? <AwesomeButton block success
                        onPress={() => this.handleSubmitDetails()}
                        width={DEVICE_WIDTH / 3} height={44} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={22} marginTop={20}>
                        <Text style={styles.BtnText} >{this.state.idProofSatus ? i18n.t('lanCommonButtonClose') : i18n.t('lanCommonButtonCreate')}</Text>
                      </AwesomeButton>
                      : <AwesomeButton block success
                        disabled={true}
                        onPress={() => this.handleSubmitDetails()}
                        width={DEVICE_WIDTH / 3} height={44} backgroundColor='#ddd' backgroundShadow='#ddd' backgroundDarker='#ddd' paddingHorizontal={50} borderRadius={22} marginTop={20}>
                        <Text style={styles.BtnText} >{this.state.idProofSatus ? i18n.t('lanCommonButtonClose') : i18n.t('lanCommonButtonCreate')}</Text>
                      </AwesomeButton>
                    }
                  </LinearGradient>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
          <Toast
            ref='toast'
            style={{ backgroundColor: '#ff0000', width: '100%', borderRadius:0, marginTop: 10, }}
            position='top'
            positionValue={70}
            fadeInDuration={50}
            fadeOutDuration={500}
            // opacity={0.8}
            textStyle={{ color: 'white', fontFamily:'Roboto_medium', }}
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

