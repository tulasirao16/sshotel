import React from 'react';
import { Platform, BackHandler, TouchableOpacity, Dimensions, Animated, Image, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Button, Icon, View, Text, Label } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';
import styles from './css/SignupScreenCss';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { inject, observer } from 'mobx-react';
import Toast, { DURATION } from 'react-native-easy-toast';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import { GOOGLE_MAPS_API_KEY } from '../../../constants';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
import i18n from 'i18n-js';

@inject(['UserStore'])
@observer
export default class SignupAddress extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      header: null,
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      address: '',
      landmark: '',
      area: '',
      areaLocality: '',
      city: '',
      state: '',
      zip: '',
      signupButton: false,
      shift: new Animated.Value(0),
      isloading: false,
      errorMessage: '',
      loading: false,
      reload: false,
      reloadFunction: ''
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    this.handleSignUp = this.handleSignUp.bind(this)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
  }
  focusNextField(id) {
    this.inputs[id].focus();
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  handleBackButtonClick() {
    const navigation = this.props.navigation
    navigation.goBack()
    return true
  }
  handleLocation = () => {
    this.setState({ isloading: true })
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        let _this = this; var isArea= false;
        this.getLocation(position.coords.latitude, position.coords.longitude, function (data) {
          if (data.statusCode == '0000') {
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
            _this.setState({ isloading: false });
            // alert(i18n.t('lanLabelNotGettingLocationPleaseEnterManually'));
            _this.refs.toast.show(i18n.t('lanLabelNotGettingLocationPleaseEnterManually'))
          }
        });
      },
      (error) => this.setState({ errorMessage: error.message, isloading: false }),
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
  handleSignUp() {
    const navigation = this.props.navigation;
    const data = navigation.state.params.data;
    const UserStore = this.props.UserStore;
    if (!this.state.address.trim()) {
      this.refs.toast.show(i18n.t('lanErrorAddressIsRequired'))
      // this.setState({ errorMessage: 'Address is Required' });
    } else if (!this.state.area.trim()) {
      this.refs.toast.show(i18n.t('lanErrorAreaIsRequired'))
      // this.setState({ errorMessage: 'Area is Required' });
    } else if (!this.state.city.trim()) {
      this.refs.toast.show(i18n.t('lanErrorCityIsRequired'))
      // this.setState({ errorMessage: 'City is Required' });
    } else if (!this.state.state.trim()) {
      this.refs.toast.show(i18n.t('lanErrorStateIsRequired'))
      // this.setState({ errorMessage: 'State is Required' });
    } else if (!this.state.zip.trim()) {
      this.refs.toast.show(i18n.t('lanErrorPINIsRequired'))
      // this.setState({ errorMessage: 'PIN is Required' });
    } else {
      this.setState({ loading: true, signupButton: true });
      let post_json = {
        bussinessName: data.bussinessName,
        contactPerson: data.contactPerson,
        userID: data.contactMobileNumber, // data.userAccount,
        contactMobileNumber: data.contactMobileNumber,
        contactEmail: data.contactEmail,
        // dob: data.dob,
        password: data.password,
        deviceToken: data.deviceToken,
        address: this.state.address,
        landmark: this.state.landmark,
        area: this.state.area,
        areaLocality: this.state.areaLocality,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zip
      };
      let _this = this;
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reload: true });
      }, 20000);
      UserStore.supplierSignup(post_json, function (resObj) {
        clearTimeout(isLoading)
        if (resObj.statusCode == '0000') {
          _this.refs.toastsuccess.show(i18n.t('lanLabelSuccessfullyRegistered'))
          setTimeout(function () {
            navigation.navigate('SigninScreen');
          }, 2000);
        } else if (resObj.statusCode == '1003') {
          _this.refs.toast.show(i18n.t('lanLabelYouAlreadyHaveAnAccountWithThisMobileNumberOrEmail'))
          // _this.setState({ errorMessage: 'You have an account with this Mobile Number or Email' });
        } else if (resObj.statusCode == '9959') {
          _this.refs.toast.show(i18n.t('lanLabelUserIdAlreadyExistPleaseUseDifferentUserId'))
          // _this.setState({ errorMessage: 'User ID already exist please user different User ID' });
        } else if (resObj.statusCode == '9955') {
          _this.refs.toast.show(i18n.t('lanLabelPleaseVerifyYourMobileNumberAndEmailBeforeYouSignUp'))
          // _this.setState({ errorMessage: 'Please verify your Mobile Number and Email before you signup' });
        } else if (resObj.statusCode == '9956') {
          _this.refs.toast.show(i18n.t('lanLabelMobileNumberAlreadyExistsUseDifferentOne'))
          // _this.setState({ errorMessage: 'Mobile Number is already exist use different one' });
        } else if (resObj.statusCode == '9957') {
          _this.refs.toast.show(i18n.t('lanLabelEmailAlreadyExistsUseDifferentOne'))
          // _this.setState({ errorMessage: 'Email is already exist use different one' });
        } else {
          _this.refs.toast.show(i18n.t('lanLabelRegistrationFailed'))
          // _this.setState({ errorMessage: 'Registration failed' });
        }
        _this.setState({ loading: false, signupButton: false });
      });
    }
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
  render() {
    const navigation = this.props.navigation;
    const { shift } = this.state;
    return (
      <View style={{ flex: 1, }}>
        <Animated.View style={{ flex: 1, transform: [{ translateY: shift }] }}>
          <LinearGradient colors={['#019fa0', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <View style={styles.headerMainView} >
              <View style={styles.headerBody} >
                <Text style={styles.headerTitleStyle} >{i18n.t('lanButtonBecomeHost')}</Text>
              </View>
            </View>
            <View style={styles.landingView} >
              <View style={styles.imageBox}>
                <Image source={require('../../../assets/landing.png')} style={styles.imgStyle} />
              </View>
            </View>
          </LinearGradient>
          {this.state.loading
            ? <View style={styles.activeIndicatorView}><ActivityIndicator color="#FFFFFF" size='large' style={styles.activeIndicatorStyle} /></View>
            : null}
          <ScrollView>
            <View style={styles.contentOne}>
              {navigation.state.params && navigation.state.params.statusCode === '0000'
                ? <View>
                  <Text>{i18n.t('lanLabelThankyouForPartneringWithUs')}</Text>
                  <Text>{i18n.t('lanLabelOurTeamWillGetBackToYouSoon')}</Text>
                </View>
                : navigation.state.params && navigation.state.params.statusCode === '9956'
                  ? <View>
                    <Text>{i18n.t('lanLabelMobileNumberAlreadyExistsPleaseLogin')}</Text>
                  </View>
                  : navigation.state.params && navigation.state.params.statusCode === '9957'
                    ? <View>
                      <Text>{i18n.t('lanLabelEmailAlreadyExistsPleaseLogin')}</Text>
                    </View>
                    : navigation.state.params && navigation.state.params.statusCode === '9951'
                      ? <View>
                        <Text>{i18n.t('lanLabelYourRequestIsUnderProgressOurTeamWillGetBackToYouSoon')}</Text>
                      </View>
                      : <View></View>}
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 17 }} >
                <LinearGradient colors={['#01A4A2', '#025D8C']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                  <AwesomeButton block success
                    onPress={() => navigation.navigate('SigninScreen')}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                    <Text style={styles.BtnText}>{i18n.t('lanButtonDone')} </Text>
                  </AwesomeButton>
                </LinearGradient>
              </View>

            </View>
          </ScrollView>
          <Toast
            ref='toastsuccess'
            style={{ backgroundColor: 'green', width: '100%', borderRadius: 0, padding: 10, }}
            position='top'
            positionValue={240}
            fadeInDuration={750}
            fadeOutDuration={1000}
            // opacity={0.8}
            borderRadius={0}
            textStyle={{ color: 'white', fontFamily: 'Roboto_medium', }}
          />
          <Toast
            ref='toast'
            style={{ backgroundColor: '#ff0000', width: '100%', borderRadius: 0, padding: 10, }}
            position='top'
            positionValue={240}
            fadeInDuration={750}
            fadeOutDuration={1000}
            // opacity={0.8}
            borderRadius={0}
            textStyle={{ color: 'white', fontFamily: 'Roboto_medium', }}
          />
          {/* <Text style={{ color: 'red',fontFamily: 'Roboto_medium', fontSize:14, }}>{this.state.errorMessage}</Text> */}
          <KeyboardSpacer />
        </Animated.View>
      </View>
    );
  }
}


