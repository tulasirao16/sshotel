import React from 'react';
import { Dimensions, BackHandler, Animated, ScrollView, TextInput, Image, TouchableHighlight, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { View, Text, Button, Label, Item, Picker, Icon } from 'native-base';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment'
import AwesomeButton from 'react-native-really-awesome-button';
import DatePicker from 'react-native-datepicker';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import Modal from 'react-native-modal';
import styles from './css/SignupScreenCss';
import { inject, observer } from 'mobx-react';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
import Toast, { DURATION } from 'react-native-easy-toast';
import i18n from 'i18n-js';


@inject(['UserStore'])
@observer
export default class SPSignupScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      header: null,
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      bussinessName: '',
      contactPerson: '',
      contactMobileNumber: '',
      verifiedMobileNumber: '',
      mobileVerifyValue: 'Verify',
      propertyType: 'Property Type',
      city: '',
      address: '',
      contactEmail: '',
      verifiedEmail: '',
      emailVerifyValue: 'Verify',
      password: '',
      otpType: '',
      otpNumber: '',
      otpValue: '',
      isModalVisible: false,
      token: '',
      loading: false,
      popupErrorMsg: '',
      hidePassword: true,
      errorMessage: '',
      shift: new Animated.Value(0),
      reload: false,
      reloadFunction: ''
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    this.handleNext = this.handleNext.bind(this);
    this.handleMobileVerify = this.handleMobileVerify.bind(this);
    this.validateOTP = this.validateOTP.bind(this);
    this.handleEmailVerify = this.handleEmailVerify.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
  }
  focusNextField(id) {
    this.inputs[id].focus();
  }

  componentWillMount() {
    this.registerForPushNotifications();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  async registerForPushNotifications() {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        return;
      }
    }
    const token = await Notifications.getExpoPushTokenAsync();
    this.setState({
      token,
    });
  }
  componentWillReceiveProps() {
    this.setState({ bussinessName: '', contactPerson: '', contactEmail: '', contactMobileNumber: '', password: '' })
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  handleBackButtonClick() {
    const navigation = this.props.navigation
    navigation.goBack()
    return true
  }
  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }
  handlePasswordChange(text) {
    let value = text.replace(/\s/g, '');
    this.setState({ password: value, errorMessage: '' })
  }
  handleMobileVerify() {
    const UserStore = this.props.UserStore;
    const phValidation = /^(\d{10})$/;
    if (this.state.mobileVerifyValue == 'Verify') {
      this.setState({ otpType: 'Mobile' });
      if (!this.state.contactMobileNumber.trim()) {
        this.refs.toast.show(i18n.t('lanErrorContactMobileNumberIsRequired'));
        // this.setState({ errorMessage: 'Contact Mobile Number is Required' });
      } else if (!phValidation.test(this.state.contactMobileNumber)) {
        this.refs.toast.show(i18n.t('lanErrorInvalidContactMobileNumber'));
        // this.setState({ errorMessage: 'Invalid Contact Mobile Number' });
      } else {
        this.setState({ loading: true });
        let post_json = {
          otpType: 'Mobile',
          mobileNumber: this.state.contactMobileNumber
        };
        let _this = this;
        let isLoading = setTimeout(function () {
          _this.setState({ loading: false });
        }, 20000);
        UserStore.supplierSignupSendOTP(post_json, function (resObj) {
          clearTimeout(isLoading)
          if (resObj.statusCode == '1001') {
            _this._toggleModal();
            _this.setState({ loading: false, otpValue: resObj.statusResult.otpNumber });
          } else if (resObj.statusCode == '9989') {
            _this.refs.toast.show(i18n.t('lanErrorMobileNumberIsAlreadyVerified'));
            _this.setState({ loading: false, verifiedMobileNumber: _this.state.contactMobileNumber, mobileVerifyValue: 'Verified' });
          } else if (resObj.statusCode == '1009') {
            _this.refs.toast.show(i18n.t('lanErrorMobileNumberIsAlreadyVerified'));
            _this.setState({ loading: false, verifiedMobileNumber: _this.state.contactMobileNumber, mobileVerifyValue: 'Verified' });
          } else {
            _this.refs.toast.show(i18n.t('lanErrorOTPSentFailed'));
            _this.setState({ loading: false });
            // _this.setState({ errorMessage: 'OTP sent failed' });
          }
        });
      }
    }
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

  closePopup() {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      otpType: '',
      errorMessage: i18n.t('lanErrorOTPVerificationFailed')
    });
  }
  validateOTP() {
    const UserStore = this.props.UserStore;
    if (!this.state.otpNumber) {
      this.setState({ popupErrorMsg: i18n.t('lanErrorEnterOTP') });
    } else {
      let post_json = { otpNumber: this.state.otpNumber, otpType: this.state.otpType };
      this.setState({ loading: true });
      let _this = this;
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reload: true, reloadFunction: 'validateOTP' });
      }, 10000);
      UserStore.supplierSignupValidateOTP(post_json, function (resObj) {
        clearTimeout(isLoading)
        if (resObj.statusCode == '1002') {
          if (_this.state.otpType == 'Mobile') {
            _this.setState({ loading: false, mobileVerifyValue: 'Verified', verifiedMobileNumber: _this.state.contactMobileNumber, popupErrorMsg: '', otpValue: '', isModalVisible: !_this.state.isModalVisible });
          } else {
            _this.setState({ loading: false, emailVerifyValue: 'Verified', verifiedEmail: _this.state.contactEmail, popupErrorMsg: '', otpValue: '', isModalVisible: !_this.state.isModalVisible });
          }
        } else {
          _this.setState({ loading: false, popupErrorMsg: i18n.t('lanErrorOTPVerificationFailed') });
        }
      });
    }
  }
  handleEmailVerify() {
    if (this.state.emailVerifyValue == 'Verify') {
      const UserStore = this.props.UserStore;
      const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      this.setState({ otpType: 'Email' });
      if (!this.state.contactEmail) {
        this.refs.toast.show(i18n.t('lanErrorContactEmailIsRequired'));
        // this.setState({ errorMessage: 'Contact Email is Required' })
      } else if (!emailValidation.test(this.state.contactEmail)) {
        this.refs.toast.show(i18n.t('lanErrorInvalidContactEmail'));
        // this.setState({ errorMessage: 'Invalid Contact Email' })
      } else {
        this.setState({ loading: true })
        let post_json = {
          otpType: 'Email',
          email: this.state.contactEmail
        };
        let _this = this;
        let isLoading = setTimeout(function () {
          _this.setState({ loading: false });
        }, 10000);
        UserStore.supplierSignupSendOTP(post_json, function (resObj) {
          clearTimeout(isLoading)
          if (resObj.statusCode == '1001') {
            _this._toggleModal();
            _this.setState({ loading: false, otpValue: resObj.statusResult.otpNumber });
          } else if (resObj.statusCode == '9988') {
            _this.refs.toast.show(i18n.t('lanErrorEmailIsAlreadyVerified'));
            _this.setState({ loading: false, verifiedEmail: _this.state.contactEmail, emailVerifyValue: 'Verified' });
          } else if (resObj.statusCode == '1010') {
            _this.refs.toast.show(i18n.t('lanErrorEmailIsAlreadyVerified'));
            _this.setState({ loading: false, verifiedEmail: _this.state.contactEmail, emailVerifyValue: 'Verified' });
          } else {
            _this.refs.toast.show(i18n.t('lanErrorOTPSentFailed'));
            _this.setState({ loading: false })
            // _this.setState({ errorMessage: 'OTP sent failed' });
          }
        });
      }
    }
  }

  _toggleModal = () => {
    this.setState({ popupErrorMsg: '', isModalVisible: !this.state.isModalVisible});
  }

  handleNext() {
    const navigation = this.props.navigation;
    const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phValidation = /^(\d{10})$/
    if (!this.state.bussinessName.trim()) {
      this.refs.toast.show(i18n.t('lanErrorBussinessNameIsRequired'));
      // this.setState({ errorMessage: 'Bussiness Name is Required' });
    } else if (this.state.bussinessName.length < 3) {
      this.refs.toast.show(i18n.t('lanErrorBussinessNameShouldHaveMinimumThreeCharacters'));
      // this.setState({ errorMessage: 'Bussiness Name should have minimum 3 characters' });
    } else if (!this.state.contactPerson.trim()) {
      this.refs.toast.show(i18n.t('lanErrorContactPersonIsRequired'));
      // this.setState({ errorMessage: 'Contact Person is Required' });
    } else if (!this.state.contactMobileNumber.trim()) {
      this.refs.toast.show(i18n.t('lanErrorContactMobileNumberIsRequired'));
      // this.setState({ errorMessage: 'Contact Mobile Number is Required' });
    } else if (!phValidation.test(this.state.contactMobileNumber)) {
      this.refs.toast.show(i18n.t('lanErrorInvalidContactMobileNumber'));
      // this.setState({ errorMessage: 'Invalid Contact Mobile Number' });
    } else if (this.state.mobileVerifyValue == 'Verify') {
      this.refs.toast.show(i18n.t('lanErrorPleaseVerifyContactMobileNumber'));
      // this.setState({ errorMessage: 'Please verify contact mobile number' });
    } else if (!this.state.contactEmail.trim()) {
      this.refs.toast.show(i18n.t('lanErrorContactEmailIsRequired'));
      // this.setState({ errorMessage: 'Contact Email is Required' });
    } else if (!emailValidation.test(this.state.contactEmail)) {
      this.refs.toast.show(i18n.t('lanErrorInvalidContactEmail'));
      // this.setState({ errorMessage: 'Invalid Contact Email' });
    } else if (this.state.emailVerifyValue == 'Verify') {
      this.refs.toast.show(i18n.t('lanErrorPleaseVerifyContactEmail'));
      // this.setState({ errorMessage: 'Please verify contact email' });
    } else if (!this.state.propertyType || this.state.propertyType == 'Property Type') {
      this.refs.toast.show(i18n.t('lanErrorPropertyTypeIsRequired'));
    } else if (!this.state.city) {
      this.refs.toast.show(i18n.t('lanErrorCityIsRequired'));
    } else if (!this.state.address) {
      this.refs.toast.show(i18n.t('lanErrorAddressIsRequired'));
      // this.setState({ errorMessage: 'Please verify contact mobile number' });
    } else {
      let data = {
        serviceProvider: this.state.bussinessName,
        contactPerson: this.state.contactPerson,
        contactNumber: this.state.contactMobileNumber,
        contactEmail: this.state.contactEmail,
        contactAddress: this.state.address,
        city: this.state.city,
        propertyType: this.state.propertyType
      }
      const UserStore = this.props.UserStore;
      this.setState({ loading: true });
      let _this = this;
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false});
      }, 20000);
      UserStore.supplierSignupOnboarding(data, function (resObj) {
        clearTimeout(isLoading)
        _this.setState({ loading: false })
        if (resObj.statusCode === '0000') {
          navigation.navigate('SignupAddress', { statusCode: resObj.statusCode });
        } else if (resObj.statusCode === '9957') {
          navigation.navigate('SignupAddress', { statusCode: resObj.statusCode });
        } else if (resObj.statusCode === '9956') {
          navigation.navigate('SignupAddress', { statusCode: resObj.statusCode });
        } else if (resObj.statusCode === '9951') {
          navigation.navigate('SignupAddress', { statusCode: resObj.statusCode });
        } else {
          _this.refs.toast.show(i18n.t('lanErrorSomethingWentWrongPleaseTryAgain'));
        }
      });
    }
  }

  render() {
    const navigation = this.props.navigation;
    const { shift } = this.state;
    return (
          <View style={{ flex: 1, }}>
            <Animated.View style={{ flex: 1, transform: [{ translateY: shift }] }}>
              <View>
                <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
                  <View style={styles.headerMainView} >
                    <View style={styles.headerBody} >
                      <Text style={styles.headerTitleStyle} >{i18n.t('lanTitleBecomeHost')} </Text>
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
              </View>
              <ScrollView>
                <View style={styles.container}>
                  <View style={styles.input}>
                    <FloatingLabelInput
                      label={i18n.t('lanLabelBussinessName')}
                      value={this.state.bussinessName}
                      onChangeText={(text) => this.setState({ bussinessName: text, errorMessage: '' })}
                      minLength={3} maxLength={80}
                      returnKeyType={'next'}
                      onRef={(ref) => {
                        this.inputs['bussinessName'] = ref;
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
                      onChangeText={(text) => this.setState({ contactPerson: text, errorMessage: '' })}
                      minLength={3} maxLength={40}
                      returnKeyType={'next'}
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
                      label={i18n.t('lanLabelContactMobileNumber')}
                      keyboardType={'numeric'}
                      value={this.state.contactMobileNumber}
                      onChangeText={(text) => this.setState({ contactMobileNumber: text, mobileVerifyValue: text == this.state.verifiedMobileNumber ? 'Verified' : 'Verify', errorMessage: '' })}
                      minLength={3} maxLength={10}
                      // returnKeyType={'next'}
                      returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                      onRef={(ref) => {
                        this.inputs['Mobile Number'] = ref;
                      }}
                      onSubmitEditing={() => {
                        this.focusNextField('Email');
                      }}
                    />
                    <TouchableOpacity style={styles.verifyTxt} onPress={() => this.handleMobileVerify()}><Text style={styles.textSmall}>{this.state.mobileVerifyValue}</Text></TouchableOpacity>
                  </View>
                  <View style={styles.input}>
                    <FloatingLabelInput
                      label={i18n.t('lanLabelEmail')}
                      value={this.state.contactEmail}
                      onChangeText={(text) => this.setState({ contactEmail: text, errorMessage: '', emailVerifyValue: text == this.state.verifiedEmail ? 'Verified' : 'Verify' })}
                      autoCapitalize='none'
                      // minLength={3} maxLength={80}
                      returnKeyType={'next'}
                      onRef={(ref) => {
                        this.inputs['Email'] = ref;
                      }}
                      onSubmitEditing={() => {
                        this.focusNextField('City');
                      }}
                    />
                    <TouchableOpacity style={styles.verifyTxt} onPress={() => this.handleEmailVerify()}><Text style={styles.textSmall}>{this.state.emailVerifyValue}</Text></TouchableOpacity>
                  </View>
                  <View style={styles.input}>
                    <View style={styles.pickerView} >
                      <Picker
                        mode='dropdown'
                        iosIcon={<Icon name='arrow-down' />}
                        style={{ width: DEVICE_WIDTH - 20, left: -5 }}
                        selectedValue={this.state.propertyType}
                        onValueChange={(value) => this.setState({ propertyType: value, errorMessage: '' })} >
                        <Picker.Item label='Property Type' value='Property Type' />
                        <Picker.Item label='Hotel' value='Hotel' />
                        <Picker.Item label='Individual' value='Individual' />
                      </Picker>
                    </View>
                  </View>
                  <View style={styles.input}>
                    <FloatingLabelInput
                      label={i18n.t('lanLabelCity')}
                      value={this.state.city}
                      onChangeText={(text) => this.setState({ city: text, errorMessage: '' })}
                      returnKeyType={'next'}
                      onRef={(ref) => {
                        this.inputs['City'] = ref;
                      }}
                      onSubmitEditing={() => {
                        this.address.focus();
                      }}
                    />

                  </View>
                  <View style={styles.input}>
                    <View>
                      <Label style={styles.labels}>{i18n.t('lanLabelAddress')}</Label>
                      <View>
                        <TextInput
                          style={styles.textArea}
                          value={this.state.address} maxLength={200} minLength={3} multiline={true}
                          onChangeText={(text) => this.setState({ address: text, errorMessage: '' })}
                          underlineColorAndroid='transparent'
                          numberOfLines={10}
                          multiline={true}
                          editable={true}
                          ref={(input) => { this.address = input; }}
                          onSubmitEditing={() => {
                            this.handleNext()
                          }}
                        />
                      </View>
                    </View>
                  </View>
                  {/* <Text style={styles.errorMessage}>{this.state.errorMessage}</Text> */}
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 17 }} >
                    <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                      <AwesomeButton block success
                        onPress={() => this.handleNext()}
                        width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                        <Text style={styles.BtnText} >{i18n.t('lanCommonButtonSubmit')} </Text>
                      </AwesomeButton>
                    </LinearGradient>
                  </View>
                  <View style={styles.dont}>
                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'flex-end' }}>
                      <Text style={styles.dontText}>{i18n.t('lanLabelAlreadyHaveAnAccount')} </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                      <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('SigninScreen')} >
                        <Text style={styles.signupText}>{i18n.t('lanCommonButtonSignIn')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </Animated.View>
            <KeyboardSpacer topSpacing={40} />
            <Modal isVisible={this.state.isModalVisible} style={styles.modalView}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.firstName}>{i18n.t('lanLabelHi')} {this.state.contactPerson ? this.state.contactPerson : i18n.t('lanLabelGuest')} </Text>
                    <Text style={styles.otpText}>{i18n.t('lanLabelPleaseEnterTheFourDigitOTPNumberBelow')} </Text>
                  </View>
                  <View style={styles.modalinput}>
                    <View style={styles.styleOne} >
                      <TextInput
                        style={{
                          height: 50,
                          textAlign: 'center',
                          fontSize: 40,
                          fontWeight: 'bold',
                          fontFamily: 'Roboto_medium',
                          color: 'black',
                          // position: 'absolute',
                          // left: 0,
                          // right: 0,
                        }}
                        underlineColorAndroid={'transparent'}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        onChangeText={(text) => this.setState({ otpNumber: text, errorMessage: '', popupErrorMsg: '' })}
                        placeholder='__ __ __ __'
                        keyboardType={'phone-pad'}
                        returnKeyType='go'
                        autoFocus
                        selectionColor='white'
                        maxLength={4}
                      />
                    </View>
                  </View>
                  <View style={styles.centerAlignment}><Text style={styles.errorMessage}>{this.state.popupErrorMsg}</Text></View>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ marginRight: 10, }}>
                      <Button transparent onPress={() => this.validateOTP()} uppercase={false} style={styles.doneBtn}>
                        <Text style={{ color: '#fff', fontSize: 14 }}>{i18n.t('lanCommonButtonSubmit')}</Text>
                      </Button>
                    </View>
                    <View>
                      <Button transparent onPress={() => this.closePopup()} uppercase={false} style={styles.closeBtn}>
                        <Text style={{ color: '#025d8c', fontSize: 14 }}>{i18n.t('lanCommonButtonClose')}</Text>
                      </Button>
                    </View>
                  </View>
                  <View>
                    <Text style={{ color: '#333', fontSize: 14, fontFamily: 'Roboto_medium', marginTop: 10, }}>{i18n.t('lanLabelOTP:')} {this.state.otpValue}</Text>
                  </View>
                </View>
              </View>
            </Modal>
            <Toast
                ref='toast'
                style={{ backgroundColor: 'red', width: '100%', borderRadius: 0, padding: 10, }}
                position='top'
                positionValue={220}
                fadeInDuration={750}
                fadeOutDuration={1000}
                // opacity={0.8}
                borderRadius={0}
                textStyle={{ color: 'white', fontFamily: 'Roboto_medium', }}
              />
          </View>
    );
  }
}
