import React from 'react';
import { View, StatusBar, TextInput, ActivityIndicator, Platform, TouchableHighlight, TouchableOpacity, Animated, Keyboard, Dimensions, ScrollView, BackHandler, UIManager } from 'react-native';
import { Icon, Text, Picker, Label } from 'native-base';
import { observer, inject } from 'mobx-react';
import styles from './css/EditUserCss';
import { LinearGradient } from 'expo-linear-gradient';
import DatePicker from 'react-native-datepicker';
import AwesomeButton from 'react-native-really-awesome-button';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import moment from 'moment';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;

@inject(['UserStore'])
@observer
export default class EditUser extends React.Component {
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
      _id: '',
      firstName: '',
      lastName: '',
      displayName:'',
      mobileNumber: '',
      password: '',
      alternateContactNumber: '',
      email: '',
      alternateEmail: '',
      userID: '',
      userType: '',
      userRole: '',
      userStatus: '',
      gender: '', 
      area: '',
      address: '',
      landMark: '',
      city: '',
      pinCode: '',
      state: '',
      country: 'India',
      showPasswordField: false,
      errorMessage: '',
      currentUserObj : {},
      oldUserObj: {},
      submitDisabled: false,
      isloading: false
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    this.handleUpdateUserData = this.handleUpdateUserData.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleApiCall = this.handleApiCall.bind(this);
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  componentWillMount() {
    const navigation = this.props.navigation;
    var userObj = navigation.state.params.data;
    var newUserObj = {
      _id: userObj._id,
      firstName: userObj.firstName,
      lastName: userObj.lastName ? userObj.lastName : '',
      displayName: userObj.displayName,
      mobileNumber: userObj.mobileNumber,
      alternateContactNumber: userObj.alternateContactNumber ? userObj.alternateContactNumber : '',
      email: userObj.email,
      alternateEmail: userObj.alternateEmail ? userObj.alternateEmail : '',
      dob: userObj.dob ? userObj.dob : '',
      gender:  userObj.gender ? userObj.gender : '',
      // userID:  userObj.userAccount,
      userRole: userObj.userRole,
      userStatus: userObj.userStatus,
      area: userObj.area ? userObj.area : '',
      address: userObj.address,
      landMark: userObj.landMark ? userObj.landMark : '',
      city: userObj.city ? userObj.city : '',
      pinCode: userObj.zip ? userObj.zip : '',
      state: userObj.state ? userObj.state : '',
    }
    this.setState({currentUserObj: newUserObj, oldUserObj: newUserObj});
    this.setState({
      _id: navigation.state.params.data._id,
      firstName: navigation.state.params.data.firstName,
      lastName: navigation.state.params.data.lastName ? navigation.state.params.data.lastName : '',
      displayName: navigation.state.params.data.displayName,
      mobileNumber: navigation.state.params.data.mobileNumber,
      alternateContactNumber: navigation.state.params.data.alternateContactNumber ? navigation.state.params.data.alternateContactNumber : '',
      email: navigation.state.params.data.email,
      alternateEmail: navigation.state.params.data.alternateEmail ? navigation.state.params.data.alternateEmail : '',
      dob: navigation.state.params.data.dob ? navigation.state.params.data.dob : '',
      gender:  navigation.state.params.data.gender ? navigation.state.params.data.gender : '',
      userID:  navigation.state.params.data.userAccount,
      userType: navigation.state.params.data.userType,
      userRole: navigation.state.params.data.userRole,
      userStatus: navigation.state.params.data.userStatus,
      area: navigation.state.params.data.area ? navigation.state.params.data.area : '',
      address: navigation.state.params.data.address,
      landMark: navigation.state.params.data.landMark ? navigation.state.params.data.landMark : '',
      city: navigation.state.params.data.city ? navigation.state.params.data.city : '',
      pinCode: navigation.state.params.data.zip ? navigation.state.params.data.zip : '',
      state: navigation.state.params.data.state ? navigation.state.params.data.state : '',
    })
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    const navigation = this.props.navigation;
    navigation.goBack();
    return true;
  }

  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight +100);
      if(gap >= 0) {
        return;
      }
      Animated.timing(
        this.state.shift,
        {
          toValue: gap,
          duration: 100,
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

  handleGenderChange(value) {
    this.setState({
      gender: value,
      errorMessage: ''
    });
  }

  handleStatusChange (value) {
    this.setState({
      userStatus: value,
      errorMessage: ''
    });
  }

  handleUserRoleChange (value) {
    this.setState({
      userRole: value,
      errorMessage: ''
    });
  }

  onStateChange(value) {
    this.setState({
      state: value
    });
  }

  handleChangePassword () {
    this.setState({ showPasswordField: !this.state.showPasswordField })
  }

  handleUpdateUserData() {
    const UserStore = this.props.UserStore;
    const navigation = this.props.navigation
    const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phValidation = /^((\(\d{3}\))|\d{3,4})(\-|\s)?(\d{3})(\-|\s)?(\d{1,4})(\-|\s)?(\d{1,3})$/
    if(!this.state.firstName.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorFirstNameIsRequired')});
    } else if(!this.state.lastName.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorLastNameIsRequired')});
    } else if(!this.state.displayName.trim()){
      this.setState({ errorMessage: i18n.t('lanErrorDisplayNameIsRequired')});
    } else if(!this.state.mobileNumber.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorMobileNumberIsRequired')});
    } else if(!phValidation.test(this.state.mobileNumber)) {
      this.setState({ errorMessage: i18n.t('lanErrorInvalidMobileNumber')})
    } else if(!this.state.email) {
      this.setState({ errorMessage: i18n.t('lanErrorEmailIsRequired')})
    } else if(!emailValidation.test(this.state.email)) {
      this.setState({ errorMessage: i18n.t('lanErrorInvalidEmail')})
    // }  else if(!this.state.userID.trim()) {
    //   this.setState({ errorMessage: 'userID is Required' });
    } else if(!this.state.userRole.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorUserRoleIsRequired')});
    } else if(!this.state.userStatus.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorUserStatusIsRequired')});
    } else if(!this.state.address.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorAddressIsRequired')});
    } else if (this.state.password.trim() && this.state.password.length < 6) {
      this.setState({ errorMessage: i18n.t('lanErrorPasswordValidation')});
    } else {
      this.setState({ submitDisabled: true, isloading: true })
      if(this.state.password.trim() == '') {
        let currentUserObj = {
          _id: this.state._id,
          firstName: this.state.firstName,
          lastName: this.state.lastName ? this.state.lastName : '',
          displayName: this.state.displayName,
          mobileNumber: this.state.mobileNumber,
          alternateContactNumber: this.state.alternateContactNumber ? this.state.alternateContactNumber : '',
          email: this.state.email,
          alternateEmail: this.state.alternateEmail ? this.state.alternateEmail : '',
          dob: this.state.dob ? this.state.dob : '',
          gender:  this.state.gender ? this.state.gender : '',
          // userID:  this.state.userID,
          userRole: this.state.userRole,
          userStatus: this.state.userStatus,
          area: this.state.area ? this.state.area : '',
          address: this.state.address,
          landMark: this.state.landMark ? this.state.landMark : '',
          city: this.state.city ? this.state.city : '',
          pinCode: this.state.pinCode ? this.state.pinCode : '',
          state: this.state.state ? this.state.state : '',
        }
        var isUpdate = JSON.stringify(this.state.oldUserObj) === JSON.stringify(currentUserObj);
        if(isUpdate) {
          navigation.navigate('UsersList');
        } else {
          this.handleApiCall();
        }
      } else {
        this.handleApiCall();
      }
    }
  }

  handleApiCall() {
    const UserStore = this.props.UserStore;
    const navigation = this.props.navigation
    var dateNumber = '';
    if(this.state.dob) {
      dateNumber = moment.utc(this.state.dob).valueOf()
    }
    let userData = {
      _id: this.state._id,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      displayName: this.state.displayName,
      mobileNumber: this.state.mobileNumber,
      alternateContactNumber: this.state.alternateContactNumber,
      email: this.state.email,
      alternateEmail: this.state.alternateEmail,
      // userID: this.state.userID,
      password: this.state.password,
      dob: this.state.dob,
      dobNumber: dateNumber,
      gender: this.state.gender,
      userRole: this.state.userRole,
      userStatus: this.state.userStatus,
      area: this.state.area,
      landMark: this.state.landMark,
      address: this.state.address,
      city: this.state.city,
      state: this.state.state,
      pinCode: this.state.pinCode,
      country: this.state.country
    };
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ isloading: false, submitDisabled: false, errorMessage: i18n.t('lanLabelServerNotResponding') });
    }, 15000);
    UserStore.updateSPUserData(userData, function(resObj) {
      if(resObj.statusCode == '0000') {
        UserStore.getSPUsersListingData(1, '', function(resObj) {
          clearTimeout(isLoading)
          _this.setState({ isloading: false, submitDisabled: false });
          navigation.navigate('UsersList');
        });
      // } else if(resObj.statusCode == '9987') {
      //   _this.setState({errorMessage: 'User ID is already taken'})
      } else if(resObj.statusCode == '9988') {
        clearTimeout(isLoading)
        _this.setState({ isloading: false, submitDisabled: false, errorMessage: i18n.t('lanErrorEmailExisting')});
      } else if(resObj.statusCode == '9989') {
        clearTimeout(isLoading)
        _this.setState({ isloading: false, submitDisabled: false, errorMessage: i18n.t('lanErrorMobileNumberExisting')});
      } else {
        clearTimeout(isLoading)
        _this.setState({ isloading: false, submitDisabled: false });
        navigation.navigate('InformationScreen');
      }
    });
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
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()} >
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
                </TouchableHighlight>
              </View>
              <View style={styles.headerBody} >
                <Text style={styles.headerTitleStyle}>{i18n.t('lanErrorEditUser')} </Text>
              </View>
            </View>
          </LinearGradient>
          {this.state.isloading
          ? <View style={styles.activeIndicatorView}><ActivityIndicator color="#ffffff" size='large' style={styles.activeIndicatorStyle} /></View>
          : null}
          <View style={styles.bodyContainer}>
            <ScrollView>
              <View style={styles.floatingInputView} >
                <FloatingLabelInput
                  label={i18n.t('lanLabelFirstName')}
                  value={this.state.firstName}
                  onChangeText={(text) => this.setState({ firstName: text, errorMessage: '', })}
                  returnKeyType = { 'next' }
                  onRef={(ref) => {
                      this.inputs['First Name'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('Last Name');
                  }}
                />
              </View>
              <View style={styles.floatingInputView} >
                <FloatingLabelInput
                  label={i18n.t('lanLabelLastName')}
                  value={this.state.lastName}
                  onChangeText={(text) => this.setState({ lastName: text, errorMessage: '' })}
                  returnKeyType = { 'next' }
                  onRef={(ref) => {
                      this.inputs['Last Name'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('Display Name');
                  }}
                />
              </View>
              <View style={styles.floatingInputView} >
                <FloatingLabelInput
                  label={i18n.t('lanLabelDisplayName')}
                  value={this.state.displayName}
                  onChangeText={(text) => this.setState({ displayName: text, errorMessage: '' })}
                  returnKeyType = { 'next' }
                  onRef={(ref) => {
                      this.inputs['Display Name'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('Mobile');
                  }}
                />
              </View>
              <View style={styles.floatingInputView} >
                <FloatingLabelInput
                  label={i18n.t('lanLabelMobile')}
                  keyboardType='numeric'
                  value={this.state.mobileNumber}
                  onChangeText={(text) => this.setState({ mobileNumber: text, errorMessage: '' })}
                  minLength={2} maxLength={10}
                  returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                  onRef={(ref) => {
                      this.inputs['Mobile'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('Alternate Mobile');
                  }}
                />
              </View>
              <View style={styles.floatingInputView} >
                <FloatingLabelInput
                  label={i18n.t('lanLabelAlternateMobile')}
                  keyboardType='numeric'
                  value={this.state.alternateContactNumber}
                  onChangeText={(text) => this.setState({ alternateContactNumber: text, errorMessage: '' })}
                  minLength={2} maxLength={10}
                  returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                  onRef={(ref) => {
                      this.inputs['Alternate Mobile'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('Email');
                  }}
                />
              </View>
              <View style={styles.floatingInputView} >
                <FloatingLabelInput
                  label={i18n.t('lanLabelEmail')}
                  autoCapitalize={'none'}
                  value={this.state.email}
                  onChangeText={(text) => this.setState({ email: text, errorMessage: '' })}
                  returnKeyType = { 'next' }
                  onRef={(ref) => {
                      this.inputs['Email'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('Alternate Email');
                  }}
                />
              </View>
              <View style={styles.floatingInputView} >
                <FloatingLabelInput
                  label={i18n.t('lanLabelAlternateEmail')}
                  autoCapitalize={'none'}
                  value={this.state.alternateEmail}
                  onChangeText={(text) => this.setState({ alternateEmail: text, errorMessage: '' })}
                  returnKeyType = { 'next' }
                  onRef={(ref) => {
                      this.inputs['Alternate Email'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('User ID');
                  }}
                />
              </View>
              <View style={styles.DateGenderView}>
                <View style={[styles.floatingInputView, styles.DatePicker, styles.horizontalMarginDatePicker]} >
                  <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2' }} >
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
                          paddingLeft:15,
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
                <View style={[styles.floatingInputView, styles.DatePicker,  styles.horizontalMarginGender]}>
                  <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2',  }} >
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: DEVICE_WIDTH / 2.2, left:-2, marginTop:Platform.OS === 'ios' ? -2 : -6, }}
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
              <View style={styles.DateGenderView}>
                <View style={[styles.floatingInputView, styles.DatePicker, styles.horizontalMarginDatePicker]} >
                  <FloatingLabelInput
                    label={i18n.t('lanLabelUserId')}
                    value={this.state.userID}
                    editable={false}
                    // onChangeText={(text) => this.setState({ userID: text, errorMessage: '' })}
                    returnKeyType = { 'next' }
                    onRef={(ref) => {
                        this.inputs['User ID'] = ref;
                    }}
                    onSubmitEditing={() => {
                        this.focusNextField('Area');
                    }}
                  />
                </View>
                <View style={[styles.floatingInputView, styles.DatePicker,  styles.horizontalMarginGender]} >
                  <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', }} >
                    <Picker
                      mode="dropdown"
                      iosHeader={i18n.t('lanLabelSelectOne')}
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: DEVICE_WIDTH / 2.2, left:-2, marginTop:Platform.OS === 'ios' ? -2 : -6, }}
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
              </View>
                <View style={[styles.floatingInputView,]} >
                  <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2',  }} >
                    <Picker
                      mode="dropdown"
                      iosHeader={i18n.t('lanLabelSelectOne')}
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: DEVICE_WIDTH - 20, left:-2, marginTop:Platform.OS === 'ios' ? -2 : -6, }}
                      selectedValue={this.state.userStatus}
                      onValueChange={this.handleStatusChange.bind(this)}
                    >
                      <Picker.Item label={i18n.t('lanLabelSelectStatus')} value='' />
                      <Picker.Item label='Active' value='Active' />
                      <Picker.Item label='Inactive' value='Inactive' />
                    </Picker>
                  </View>
                  {/* <View style={[styles.floatingInputView, styles.DatePicker]} >
                    <FloatingLabelInput
                      label='User Type'
                      editable={false}
                      value={this.state.userType}
                    />
                  </View> */}
                </View>

              <View style={styles.floatingInputView} >
                <View style={styles.textAreaContainer} >
                  <Label style={styles.labels}>{i18n.t('lanLabelAddress')}</Label>
                  <View>
                    <TextInput
                      style={styles.textArea}
                      value={this.state.address}
                      onChangeText={(text) => this.setState({ address: text, errorMessage: '', })}
                      underlineColorAndroid='transparent'
                      numberOfLines={10}
                      multiline={true}
                      editable={true}
                    />
                  </View>
                </View>
                {/* <FloatingLabelInput
                  label='Address'
                  value={this.state.address}
                  onChangeText={(text) => this.setState({ address: text, errorMessage: '', })}
                /> */}
              </View>
              <View style={styles.floatingInputView} >
                <FloatingLabelInput
                  label={i18n.t('lanLabelArea')}
                  value={this.state.area}
                  onChangeText={(text) => this.setState({ area: text, errorMessage: '', })}
                  returnKeyType = { 'next' }
                  onRef={(ref) => {
                      this.inputs['Area'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('Landmark');
                  }}
                />
              </View>
              <View style={styles.floatingInputView} >
                <FloatingLabelInput
                  label={i18n.t('lanLabelLandmark')}
                  value={this.state.landMark}
                  onChangeText={(text) => this.setState({ landMark: text, errorMessage: '', })}
                  returnKeyType = { 'next' }
                  onRef={(ref) => {
                      this.inputs['Landmark'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('City');
                  }}
                />
              </View>
              <View style={styles.floatingInputView} >
                <FloatingLabelInput
                  label={i18n.t('lanLabelCity')}
                  value={this.state.city}
                  onChangeText={(text) => this.setState({ city: text, errorMessage: '', })}
                  returnKeyType = { 'next' }
                  onRef={(ref) => {
                      this.inputs['City'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('Pincode');
                  }}
               />
              </View>
              <View style={styles.floatingInputView} >
                <FloatingLabelInput
                  label={i18n.t('lanLabelPinCode')}
                  keyboardType='numeric'
                  maxLength={6}
                  value={this.state.pinCode}
                  onChangeText={(text) => this.setState({ pinCode: text, errorMessage: '', })}
                  returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                  onRef={(ref) => {
                      this.inputs['Pincode'] = ref;
                  }}
                  onSubmitEditing={() => {
                      // this.focusNextField('');
                  }}
                />
              </View>
              <View style={styles.floatingInputView} >
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', marginTop: -5.5 }} >
                  <Picker
                    mode="dropdown"
                    iosHeader={i18n.t('lanLabelSelectOne')}
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: DEVICE_WIDTH - 20, left:-5 }}
                    selectedValue={this.state.state}
                    onValueChange={this.onStateChange.bind(this)}
                  >
                    <Picker.Item label={i18n.t('lanLabelSelectState')} value='' />
                    <Picker.Item label='Andhra Pradesh' value='Andhra Pradesh' />
                    <Picker.Item label='Telangana' value='Telangana' />
                  </Picker>
                </View>
              </View>
              <View style={styles.floatingInputView} >
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', marginTop: -5.5 }} >
                  <Picker
                    mode="dropdown"
                    iosHeader={i18n.t('lanLabelSelectOne')}
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: DEVICE_WIDTH - 20, left:-5 }}
                    selectedValue={this.state.country}
                    onValueChange={() => {}}
                  >
                    <Picker.Item label='India' value='India' />
                  </Picker>
                </View>
              </View>
              <View style={[ styles.DateGenderView ]} >
              <View style={[styles.floatingInputView, styles.DatePicker]} >
                {/* <FloatingLabelInput
                  label='Password'
                  value={this.state.password}
                  onChangeText={(text) => this.setState({ password: text, errorMessage: '' })}
                /> */}
              </View>
              <View style={[styles.floatingInputView, styles.DatePicker, styles.rowDirection]} >
                 <TouchableOpacity onPress={this.handleChangePassword}><Text style={{fontFamily: 'Roboto_medium', fontSize:13, color:'#8a8786' }}>{i18n.t('lanLabelChangePassword')}<Icon name= 'md-create' style={{ color: '#01a4a2', fontSize:15 }} /></Text></TouchableOpacity>
              </View>
              </View>
              {this.state.showPasswordField ? 
              <View style={ styles.floatingInputView }>
                <Text style={styles.titleTextInput}>{i18n.t('lanLabelEnterNewpassword')}</Text>
                <TextInput
                  style={styles.textInputStyle}
                  value={this.state.password}  
                  secureTextEntry={true}
                  max={30}
                  min={3}
                  onChangeText={(text) => this.setState({ password: text, errorMessage: '' })} />
              </View> : null}
              <View style={ styles.errorView } >
                <Text style={styles.errorTxt}>{this.state.errorMessage}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 17 }} >
                <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                  {/* <AwesomeButton block success
                    onPress={() => this.handleUpdateUserData()}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                    <Text style={styles.BtnText}> Update </Text>
                  </AwesomeButton> */}
                  {!this.state.submitDisabled
                  ? <AwesomeButton block success
                    onPress={() => this.handleUpdateUserData()}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={22} marginTop={20}>
                    <Text style={styles.BtnText} >{i18n.t('lanCommonButtonUpdate')}</Text>
                  </AwesomeButton>
                  : <AwesomeButton block success
                    disabled={true}
                    onPress={() => this.handleUpdateUserData()}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='#ddd' backgroundShadow='#ddd' backgroundDarker='#ddd' paddingHorizontal={50} borderRadius={22} marginTop={20}>
                    <Text style={styles.BtnText} >{i18n.t('lanCommonButtonUpdate')}</Text>
                  </AwesomeButton>
                }
                </LinearGradient>
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    );
  }
}
