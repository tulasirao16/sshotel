import React from 'react';
import { View, ActivityIndicator, StatusBar, TextInput, Animated, Keyboard, Dimensions, TouchableHighlight, TouchableOpacity, ScrollView, BackHandler, Platform, UIManager } from 'react-native';
import { Icon, Text, Button, Picker } from 'native-base';
import { observer, inject } from 'mobx-react';
import styles from './css/CreateUserCss';
import { LinearGradient } from 'expo-linear-gradient';
import DatePicker from 'react-native-datepicker';
import AwesomeButton from 'react-native-really-awesome-button';
import moment from 'moment';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;


const { State: TextInputState } = TextInput;
import i18n from 'i18n-js';

@inject(['UserStore'])
@observer
export default class CreateUser extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      shift: new Animated.Value(0),
      value: '',
      dob: '',
      firstName: '',
      lastName: '',
      mobileNumber: '',
      password: '',
      alternateContactNumber: '',
      email: '',
      alternateEmail: '',
      // userID: '',
      userRole: '',
      userStatus: '',
      gender: '',
      errorMessage: '',
      fNameError: '', fNameSuccess: '',
      lNameError: '', lNameSuccess: '',
      mobileError: '', mobileSuccess: '',
      emailError: '', emailSuccess: '',
      userRoleError: '',
      passwordError: '', passwordSuccess: '',
      userStatusError: '',
      altMobileNum: '',
      emailAltSuccess: '',
      reload: false,
      reloadFunction: '',
      loading: false,
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    this.handleNext = this.handleNext.bind(this);
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
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
  handleGenderChange(value) {
    this.setState({
      gender: value,
      errorMessage: ''
    });
  }

  handleStatusChange(value) {
    this.setState({
      userStatus: value,
      errorMessage: '',
      userStatusError: value ? false : true
    });
  }

  handleUserRoleChange(value) {
    this.setState({
      userRole: value,
      errorMessage: '',
      userRoleError: value ? false : true
    });
  }

  handleNext() {
    const UserStore = this.props.UserStore;
    const navigation = this.props.navigation
    const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phValidation = /^((\(\d{3}\))|\d{3,4})(\-|\s)?(\d{3})(\-|\s)?(\d{1,4})(\-|\s)?(\d{1,3})$/
    if (!this.state.firstName.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorFirstNameIsRequired'), fNameError: true, fNameSuccess: false });
    } else if (!this.state.lastName.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorLastNameIsRequired'), lNameError: true, lNameSuccess: false });
    } else if (!this.state.mobileNumber.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorMobileNumberIsRequired'), mobileError: true, mobileSuccess: false });
    } else if (!phValidation.test(this.state.mobileNumber)) {
      this.setState({ errorMessage: i18n.t('lanErrorInvalidMobileNumber'), mobileError: true, mobileSuccess: false })
    } else if (!this.state.email) {
      this.setState({ errorMessage: i18n.t('lanErrorEmailIsRequired'), emailError: true, emailSuccess: false })
    } else if (!emailValidation.test(this.state.email)) {
      this.setState({ errorMessage: i18n.t('lanErrorInvalidEmail') })
      // } else if(!this.state.userID.trim()) {
      //   this.setState({ errorMessage: 'User ID is Required' });
    } else if (!this.state.password.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorPasswordIsRequired'), passwordError: true, passwordSuccess: false });
    } else if (this.state.password && this.state.password.length < 6) {
      this.setState({ errorMessage: i18n.t('lanErrorPasswordValidation') })
    } else if (!this.state.userRole.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorUserRoleIsRequired'), userRoleError: true });
    } else if (!this.state.userStatus.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorUserStatusIsRequired'), userStatusError: 'true' });
    } else {
      var dateNumber = '';
      if (this.state.dob) {
        dateNumber = moment.utc(this.state.dob).valueOf()
      }
      let data = {
        mobileNumber: this.state.mobileNumber,
        email: this.state.email,
        // userID: this.state.userID
      }
      this.setState({ loading: true, errorMessage: '' });
      let _this = this;
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, errorMessage: i18n.t('lanErrorUnknownError') });
      }, 20000);
      UserStore.verifyUniqueness(data, function (resObj) {
        clearTimeout(isLoading)
        if (resObj.statusCode == '0000') {
          let userData = {
            firstName: _this.state.firstName,
            lastName: _this.state.lastName,
            mobileNumber: _this.state.mobileNumber,
            alternateContactNumber: _this.state.alternateContactNumber,
            email: _this.state.email,
            alternateEmail: _this.state.alternateEmail,
            // userID: _this.state.userID,
            password: _this.state.password,
            dob: _this.state.dob,
            dobNumber: dateNumber,
            gender: _this.state.gender,
            userRole: _this.state.userRole,
            userStatus: _this.state.userStatus
          }
          _this.setState({ loading: false, errorMessage: '' });
          navigation.navigate('CreateUserAddress', { data: userData });
        } else if (resObj.statusCode == '9989') {
          _this.setState({ loading: false, errorMessage: i18n.t('lanErrorMobileNumberExisting') });
        } else if (resObj.statusCode == '9988') {
          _this.setState({ loading: false, errorMessage: i18n.t('lanErrorEmailExisting') });
        } else {
          _this.setState({ loading: false, errorMessage: i18n.t('lanErrorUnknownError') });
        }
        // } else if(resObj.statusCode == '9987') {
        //   _this.setState({ errorMessage: 'User ID is already taken' })
        // }
      });
    }
  }

  render() {
    const navigation = this.props.navigation;
    const { shift } = this.state;
    const fName = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelFirstName')}<Text style={styles.required}>*</Text></Text>
    const lName = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelLastName')}<Text style={styles.required}>*</Text></Text>
    const mobileLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelMobile')}<Text style={styles.required}>*</Text></Text>
    const emailLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelEmail')}<Text style={styles.required}>*</Text></Text>
    const passwordLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelPassword')}<Text style={styles.required}>*</Text></Text>
    const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return (
      <View>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft} >
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()} >
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
              </TouchableHighlight>
            </View>
            <View style={styles.headerBody} >
              <Text style={styles.headerTitleStyle}>{i18n.t('lanLabelCreateUser')}</Text>
            </View>
          </View>
        </LinearGradient>
        {this.state.loading
          ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#FFFFFF' size='large' style={styles.activeIndicatorStyle} /></View>
          : null}
        <View style={styles.bodyContainer}>
          <ScrollView>
            <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
              <View style={[styles.floatingInputView, styles.floatingInputViewOne]} >
                <FloatingLabelInput
                  label={fName}
                  value={this.state.firstName}
                  isError={this.state.fNameError}
                  onChangeText={(text) => this.setState({ firstName: text, errorMessage: '', fNameError: text ? false : true, fNameSuccess: text.length >= 3 ? true : false })}
                  returnKeyType={'next'}
                  onRef={(ref) => {
                    this.inputs['First Name'] = ref;
                  }}
                  onSubmitEditing={() => {
                    this.focusNextField('Last Name');
                  }}
                />
                {this.state.fNameError
                  ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={styles.errorIcon} /></View>
                  : this.state.fNameSuccess && !this.state.fNameError
                    ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                    : null
                }
              </View>
              <View style={[styles.floatingInputView, styles.floatingInputViewOne]} >
                <FloatingLabelInput
                  label={lName}
                  value={this.state.lastName}
                  isError={this.state.lNameError}
                  onChangeText={(text) => this.setState({ lastName: text, errorMessage: '', lNameError: text ? false : true, lNameSuccess: text.length >= 1 ? true : false })}
                  returnKeyType={'next'}
                  onRef={(ref) => {
                    this.inputs['Last Name'] = ref;
                  }}
                  onSubmitEditing={() => {
                    this.focusNextField('Mobile');
                  }}
                />
                {this.state.lNameError
                  ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={styles.errorIcon} /></View>
                  : this.state.lNameSuccess && !this.state.lNameError
                    ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                    : null
                }
              </View>
              <View style={[styles.floatingInputView, styles.floatingInputViewOne]} >
                <FloatingLabelInput
                  label={mobileLbl}
                  keyboardType='numeric'
                  value={this.state.mobileNumber}
                  isError={this.state.mobileError}
                  onChangeText={(text) => this.setState({ mobileNumber: text, errorMessage: '', mobileError: text ? false : true, mobileSuccess: text.length == 10 ? true : false })}
                  minLength={2} maxLength={10}
                  returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                  onRef={(ref) => {
                    this.inputs['Mobile'] = ref;
                  }}
                  onSubmitEditing={() => {
                    this.focusNextField('Alternate Mobile');
                  }}
                />
                {this.state.mobileError
                  ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={styles.errorIcon} /></View>
                  : this.state.mobileSuccess && !this.state.mobileError
                    ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                    : null
                }
              </View>
              <View style={[styles.floatingInputView, styles.floatingInputViewOne]} >
                <FloatingLabelInput
                  label={i18n.t('lanLabelAlternateMobile')}
                  keyboardType='numeric'
                  value={this.state.alternateContactNumber}
                  onChangeText={(text) => this.setState({ alternateContactNumber: text, errorMessage: '', altMobileNum: text.length == 10 ? true : false })}
                  minLength={2} maxLength={10}
                  returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                  onRef={(ref) => {
                    this.inputs['Alternate Mobile'] = ref;
                  }}
                  onSubmitEditing={() => {
                    this.focusNextField('Email');
                  }}
                />
                {this.state.altMobileNum
                  ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                  : null}
              </View>
              <View style={[styles.floatingInputView, styles.floatingInputViewOne]} >
                <FloatingLabelInput
                  label={emailLbl}
                  autoCapitalize={'none'}
                  value={this.state.email}
                  isError={this.state.emailError}
                  onChangeText={(text) => this.setState({ email: text, errorMessage: '', emailError: !emailValidation.test(text), emailSuccess: emailValidation.test(text) })}
                  returnKeyType={'next'}
                  onRef={(ref) => {
                    this.inputs['Email'] = ref;
                  }}
                  onSubmitEditing={() => {
                    this.focusNextField('Alternate Email');
                  }}
                />
                {this.state.emailError
                  ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={styles.errorIcon} /></View>
                  : this.state.emailSuccess && !this.state.emailError
                    ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                    : null
                }
              </View>
              <View style={[styles.floatingInputView, styles.floatingInputViewOne]} >
                <FloatingLabelInput
                  label={i18n.t('lanLabelAlternateEmail')}
                  autoCapitalize={'none'}
                  value={this.state.alternateEmail}
                  onChangeText={(text) => this.setState({ alternateEmail: text, errorMessage: '', emailAltSuccess: emailValidation.test(text) })}
                  returnKeyType={'next'}
                  onRef={(ref) => {
                    this.inputs['Alternate Email'] = ref;
                  }}
                  onSubmitEditing={() => {
                    this.focusNextField('Password');
                  }}
                />
                {this.state.emailAltSuccess
                  ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                  : null}
              </View>

              <View style={styles.DateGenderView}>
                {/* <View style={[styles.floatingInputView, styles.DatePicker]} >
                <FloatingLabelInput
                  label='User ID*'
                  value={this.state.userID}
                  onChangeText={(text) => this.setState({ userID: text, errorMessage: '' })}
                />
              </View> */}
                <View style={[styles.floatingInputView, styles.DatePicker]} >
                  <FloatingLabelInput
                    label={passwordLbl}
                    value={this.state.password}
                    secureTextEntry={true}
                    isError={this.state.passwordError}
                    onChangeText={(text) => this.setState({ password: text, errorMessage: '', passwordError: text ? false : true, passwordSuccess: text.length >= 6 ? true : false })}
                    onRef={(ref) => {
                      this.inputs['Password'] = ref;
                    }}
                    onSubmitEditing={() => {
                      // this.focusNextField('Password');
                    }}
                  />
                  {this.state.passwordError
                    ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={styles.errorIcon} /></View>
                    : this.state.passwordSuccess && !this.state.passwordError
                      ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                      : null
                  }
                </View>
              </View>
              <View style={styles.DateGenderView}>
                <View style={[styles.floatingInputView, styles.DatePicker]} >
                  <View style={!this.state.userRoleError ? { borderBottomWidth: 1, borderBottomColor: '#01a4a2' } : { borderBottomWidth: 1, borderBottomColor: 'red' }} >
                    <Text style={!this.state.userRoleError ? styles.pickerLabel : styles.pickerLabelError} >{i18n.t('lanLabelUserCreateSelectUserRole')}<Text style={styles.required}>*</Text></Text>
                    <Picker
                      mode='dropdown'
                      iosHeader={i18n.t('lanLabelSelectUserRole')}
                      iosIcon={<Icon name='arrow-down' />}
                      style={{ width: DEVICE_WIDTH / 2.5, left: -5 }}
                      selectedValue={this.state.userRole}
                      onValueChange={this.handleUserRoleChange.bind(this)}
                    >
                      <Picker.Item label={i18n.t('lanLabelSelectUserRole')} value='' />
                      <Picker.Item label='Admin' value='Admin' />
                      <Picker.Item label='Manager' value='Manager' />
                      <Picker.Item label='Receptionist' value='Receptionist' />
                    </Picker>
                  </View>
                </View>
                <View style={[styles.floatingInputView, styles.DatePicker]} >
                  <View style={!this.state.userStatusError ? { borderBottomWidth: 1, borderBottomColor: '#01a4a2' } : { borderBottomWidth: 1, borderBottomColor: 'red' }} >
                    <Text style={!this.state.userStatusError ? styles.pickerLabel : styles.pickerLabelError} >{i18n.t('lanLabelUserCreateSelectStatus')}<Text style={styles.required}>*</Text></Text>
                    <Picker
                      mode='dropdown'
                      iosHeader={i18n.t('lanLabelSelectOne')}
                      iosIcon={<Icon name='arrow-down' />}
                      style={{ width: DEVICE_WIDTH / 2.5, left: -5 }}
                      selectedValue={this.state.userStatus}
                      onValueChange={this.handleStatusChange.bind(this)}
                    >
                      <Picker.Item label={i18n.t('lanLabelSelectStatus')} value='' />
                      <Picker.Item label='Active' value='Active' />
                      <Picker.Item label='InActive' value='InActive' />
                    </Picker>
                  </View>
                </View>
              </View>
              <View style={styles.DateGenderView}>
                <View style={[styles.floatingInputView, styles.DatePicker, styles.horizontalMarginDatePicker]} >
                  <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', marginTop: 10, }} >
                    <DatePicker
                      style={styles.datePickerView}
                      date={this.state.dob}
                      mode='date'
                      placeholder={i18n.t('lanLabelUserEditSelectDOB')}
                      format='YYYY-MM-DD'
                      minDate='1940-01-01'
                      maxDate={moment().format('YYYY-MM-DD')}
                      confirmBtnText='Confirm'
                      cancelBtnText='Cancel'
                      customStyles={{
                        dateIcon: {
                          position: 'absolute',
                          left: 0,
                          top: 4,
                          marginLeft: 0
                        },
                        placeholderText: {
                          color: '#9a9a9a',
                          fontSize: 14,
                          fontFamily: 'Roboto_medium',
                        },
                        dateInput: {
                          borderWidth: 0,
                          color: '#9a9a9a',
                          fontSize: 14,
                          paddingLeft: 15,
                          fontFamily: 'Roboto_medium',
                        },
                        dateText: {
                          color: '#333',
                          fontSize: 16,
                          fontFamily: 'Roboto_medium',
                        }

                        // dateInput: {
                        //   marginLeft: 36
                        // }
                        // ... You can check the source to find the other keys.
                      }}
                      onDateChange={(date) => { this.setState({ dob: date, errorMessage: '' }) }}
                    />
                  </View>
                </View>
                <View style={[styles.floatingInputView, styles.genderView]}>
                  <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', }} >
                    {/* <Text>Select Gender</Text> */}
                    <Picker
                      mode='dropdown'
                      iosHeader={i18n.t('lanLabelSelectGender')}
                      iosIcon={<Icon name='arrow-down' />}
                      style={{ width: DEVICE_WIDTH / 2.5, left: -5 }}
                      selectedValue={this.state.gender}
                      onValueChange={this.handleGenderChange.bind(this)}
                    >
                      <Picker.Item label={i18n.t('lanLabelSelectGender')} value='' />
                      <Picker.Item label='Male' value='Male' />
                      <Picker.Item label='Female' value='Female' />
                    </Picker>
                  </View>
                </View>
              </View>

              <View style={styles.errorView} >
                <Text style={styles.errorTxt}>{this.state.errorMessage}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 17 }} >
                <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                  <AwesomeButton block success
                    onPress={() => this.handleNext()}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                    <Text style={styles.BtnText}>{i18n.t('lanCommonButtonNext')}</Text>
                  </AwesomeButton>
                </LinearGradient>
              </View>
            </Animated.View>
          </ScrollView>
        </View>

      </View>
    );
  }
}
