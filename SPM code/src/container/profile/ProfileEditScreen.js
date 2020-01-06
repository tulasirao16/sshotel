import React from 'react';
import { observer, inject } from 'mobx-react';
import { TouchableWithoutFeedback, AsyncStorage, ActivityIndicator, TouchableOpacity, TouchableHighlight, BackHandler, ScrollView, Image, StatusBar, Dimensions, Animated, Keyboard, UIManager, TextInput, StyleSheet, Platform } from 'react-native';
import { Container, Button, View, Icon, Text, Content, Thumbnail, Label, Left, Right } from 'native-base';
import { ImagePicker, ImageManipulator, Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import styles from './css/ProfileEditCss';
import DatePicker from 'react-native-datepicker';
import AwesomeButton from 'react-native-really-awesome-button';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from 'i18n-js';
import { PUBLIC_DOMAIN } from '../../../constants';
import moment from 'moment';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import Toast, { DURATION } from 'react-native-easy-toast';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;

@inject(['UserStore'])
@observer
export default class ProfileEditScreen extends React.Component {

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
      data: {},
      authObj: {},
      image: '',
      address: '',
      area: '',
      landMark: '',
      city: '',
      state: '',
      country: '',
      errorMessage: '',
      submitDisabled: false,
      isloading: false,
      maxDate: moment().subtract(18, 'years').format('YYYY-MM-DD')
    }
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    this.handleData = this.handleData.bind(this)
    this.handleProfileAddressScreen = this.handleProfileAddressScreen.bind(this)
    this.handleBackButton = this.handleBackButton.bind(this)
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);

  }
  _handleOnSelect(value) {
    const navigation = this.props.navigation;
    const UserStore = this.props.UserStore;
    AsyncStorage.clear();
  }

  async componentWillMount() {
    await AsyncStorage.getItem('authObj').then((value) => {
      let authObj = JSON.parse(value);
      this.setState({
        authObj: authObj,
        firstName: authObj.firstName,
        lastName: authObj.lastName,
        displayName: authObj.displayName,
        mobileNumber: authObj.mobileNumber,
        userAccount: authObj.userAccount,
        userType: authObj.userType,
        userRole: authObj.userRole,
        dob: authObj.dob ? authObj.dob : '',
        email: authObj.email ? authObj.email : '',
        address: authObj.address,
        area: authObj.area ? authObj.area : '',
        landMark: authObj.landMark ? authObj.landMark : '',
        city: authObj.city ? authObj.city : '',
        zip: authObj.zip ? authObj.zip : '',
        state: authObj.state ? authObj.state : '',
        country: authObj.country ? authObj.country : '',
        iconPath: authObj.userIconPath ? authObj.userIconPath : '',
        iconOriginalName: authObj.userIconOriginalName ? authObj.userIconOriginalName : ''
      })
    })
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
  }
  componentWillReceiveProps(newProps) {
    if (newProps.navigation.state.params && newProps.navigation.state.params.data) {
      this.setState({
        address: newProps.navigation.state.params.data.address,
        area: newProps.navigation.state.params.data.area,
        landMark: newProps.navigation.state.params.data.landMark,
        city: newProps.navigation.state.params.data.city,
        state: newProps.navigation.state.params.data.state,
        zip: newProps.navigation.state.params.data.zip,
        country: newProps.navigation.state.params.data.country
      });
    }
  }
  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleBackButton() {
    const navigation = this.props.navigation;
    navigation.navigate('ProfileScreen');
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
          duration: 500,
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
      // alert(i18n.t('lanErrorUploadFailedSorry'));
      this.refs.toast.show(i18n.t('lanErrorUploadFailedSorry'));
    } finally {
      this.setState({
        uploading: false
      });
    }
  };
  async handleCompressImage(uri) {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [],
      { compress: 0.5 }
    );
    this.setState({
      image: manipResult.uri, errorMessage: ''
    });
  }
  _pickImage = async () => {
    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
      });
      this._handleImagePicked(pickerResult);
    }
  };
  handleProfileAddressScreen() {
    const navigation = this.props.navigation;
    let addressObj = {
      address: this.state.address,
      area: this.state.area,
      landMark: this.state.landMark,
      city: this.state.city,
      zip: this.state.zip,
      state: this.state.state,
      country: this.state.country
    }
    navigation.navigate('ProfileAddress', { data: addressObj })
  }
  async handleData(uri) {
    let newAuthObj = this.state.authObj
    const UserStore = this.props.UserStore;
    const navigation = this.props.navigation;
    var authToken = await AsyncStorage.getItem('authToken');
    const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phValidation = /^((\(\d{3}\))|\d{3,4})(\-|\s)?(\d{3})(\-|\s)?(\d{1,4})(\-|\s)?(\d{1,3})$/
    if (!this.state.firstName.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorFirstNameIsRequired') })
    } else if (!this.state.lastName.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorLastNameIsRequired') });
    } else if (!this.state.displayName.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorDisplayNameIsRequired') });
    } else if (!this.state.userAccount.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorUserAccountIsRequired') });
    } else if (!this.state.mobileNumber.trim() || this.state.mobileNumber.trim().length < 10) {
      this.setState({ errorMessage: i18n.t('lanErrorMobileNumberIsRequired') });
    } else if (!phValidation.test(this.state.mobileNumber)) {
      this.refs.toast.show(i18n.t('lanErrorInvalidMobileNumber'));
    } else if (!this.state.email.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorEmailIsRequired') })
    } else if (!emailValidation.test(this.state.email)) {
      this.setState({ errorMessage: i18n.t('lanErrorInvalidEmail') })
    } else if (!this.state.address.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorAddressIsRequired') });
    } else {
      this.setState({ submitDisabled: true, isloading: true })
      const data = new FormData()
      if (uri) {
        let uriParts = uri.split('.');
        let fileType = uriParts[uriParts.length - 1];
        data.append('profileImage', {
          uri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }
      data.append('profilefirstName', this.state.firstName)
      data.append('profilelastName', this.state.lastName)
      data.append('profiledisplayName', this.state.displayName)
      data.append('profileuserAccount', this.state.userAccount)
      data.append('profilemobileNumber', this.state.mobileNumber)
      data.append('profileemail', this.state.email)
      data.append('profiledob', this.state.dob)
      data.append('profileaddress', this.state.address)
      data.append('profilearea', this.state.area)
      data.append('profilelandMark', this.state.landMark)
      data.append('profilecity', this.state.city)
      data.append('profilestate', this.state.state)
      data.append('profilezip', this.state.zip)
      data.append('profilecountry', this.state.country)
      data.append('customerImageFilePath', this.state.iconPath);
      data.append('customerImageFilePath', this.state.iconOriginalName);
      let _this = this;
      let loading = setTimeout(function () {
        _this.setState({ isloading: false, errorMessage: i18n.t('lanLabelServerNotResponding') });
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
      let apiUrl = PUBLIC_DOMAIN + 'api/v1/sp/profile/:id';
      fetch(apiUrl, options).then((response) => {
        response.json().then((responseJson) => {
          clearTimeout(loading)
          _this.setState({ isloading: false, submitDisabled: false });
          if (responseJson.statusCode == '0000') {
            newAuthObj.firstName = responseJson.statusResult.firstName;
            newAuthObj.lastName = responseJson.statusResult.lastName;
            newAuthObj.displayName = responseJson.statusResult.displayName;
            newAuthObj.mobileNumber = responseJson.statusResult.mobileNumber;
            newAuthObj.email = responseJson.statusResult.email;
            newAuthObj.userAccount = responseJson.statusResult.userAccount;
            newAuthObj.address = responseJson.statusResult.address;
            newAuthObj.area = responseJson.statusResult.area;
            newAuthObj.landMark = responseJson.statusResult.landMark;
            newAuthObj.city = responseJson.statusResult.city;
            newAuthObj.state = responseJson.statusResult.state;
            newAuthObj.zip = responseJson.statusResult.zip;
            newAuthObj.country = responseJson.statusResult.country;
            newAuthObj.dob = responseJson.statusResult.dob;
            newAuthObj.userIconPath = responseJson.statusResult.userIconPath;
            newAuthObj.userIconOriginalName = responseJson.statusResult.userIconOriginalName;
            newAuthObj.userIcon = responseJson.statusResult.userIcon;
            AsyncStorage.setItem('authObj', JSON.stringify(newAuthObj));
            _this.setState({ errorMessage: i18n.t('lanSuccessProfileUpdatedSuccessfully') });
            navigation.navigate('ProfileScreen', { profile: 'profile' })
          } else {
            _this.setState({ errorMessage: i18n.t('lanErrorProfileUpdateFailed') })
          }
        });
      }).catch((error) => {
        clearTimeout(loading)
        console.log('=======Update profile Error: ' + error);
        _this.setState({ isloading: false, submitDisabled: false, errorMessage: i18n.t('lanErrorProfileUpdateFailed') })
      });
    }
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    return (
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
            <Text style={styles.headerTitleStyle}> {i18n.t('lanTitleEditProfile')} </Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.navigate('SPHomeScreen')} >
                <Icon name='md-home' style={styles.iconHomeStyle} />
              </TouchableHighlight>
            </View>
          </View>
        </LinearGradient>
        {this.state.isloading
          ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#ffffff' size='large' style={styles.activeIndicatorStyle} /></View>
          : null}
        <View style={styles.profileContent}>
          <View style={styles.profileImageView} >
            <Image source={this.state.image ? { uri: this.state.image } : (this.state.authObj && this.state.authObj.userIconPath) ? { uri: PUBLIC_DOMAIN + this.state.authObj.userIconPath } : require('../../../assets/profile-icon.png')}
              style={styles.fitImage} />
            <View style={styles.camicon}>
              <Icon onPress={this._takePhoto} style={{ fontSize: 70, color: '#fff' }} name='md-camera' />
              <View style={styles.plusIcon}>
                <Icon onPress={this._pickImage} style={{ fontSize: 30, color: '#fff' }} name='ios-add' />
              </View>
            </View>
          </View>
        </View>
        <ScrollView>
          <View style={{ margin: 15 }}>
            <View style={styles.input}>
              <FloatingLabelInput
                label={i18n.t('lanLabelFirstName')}
                value={this.state.firstName}
                onChangeText={(text) => this.setState({ firstName: text, errorMessage: '' })}
                minLength={2} maxLength={40}
                returnKeyType={'next'}
                onRef={(ref) => {
                  this.inputs['First Name'] = ref;
                }}
                onSubmitEditing={() => {
                  this.focusNextField('Last Name');
                }}
              />
            </View>
            <View style={styles.input}>
              <FloatingLabelInput
                label={i18n.t('lanLabelLastName')}
                value={this.state.lastName}
                onChangeText={(text) => this.setState({ lastName: text, errorMessage: '' })}
                minLength={2} maxLength={40}
                returnKeyType={'next'}
                onRef={(ref) => {
                  this.inputs['Last Name'] = ref;
                }}
                onSubmitEditing={() => {
                  this.focusNextField('Display Name');
                }}
              />
            </View>
            <View style={styles.input}>
              <FloatingLabelInput
                label={i18n.t('lanLabelDisplayName')}
                value={this.state.displayName}
                onChangeText={(text) => this.setState({ displayName: text, errorMessage: '' })}
                maxLength={15}
                returnKeyType={'next'}
                onRef={(ref) => {
                  this.inputs['Display Name'] = ref;
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
                // editable={false}
                keyboardType='numeric'
                // onChangeText={(text) => this.setState({ mobileNumber: text, errorMessage: '' })}
                maxLength={10}
                returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                onRef={(ref) => {
                  this.inputs['Mobile Number'] = ref;
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
                // editable={false}
                autoCapitalize='none'
                // onChangeText={(text) => this.setState({ email: text, errorMessage: '' })}
                minLength={2} maxLength={40}
                returnKeyType={'next'}
                onRef={(ref) => {
                  this.inputs['Email'] = ref;
                }}
                onSubmitEditing={() => {
                  this.focusNextField('User ID');
                }}
              />
            </View>
            <View style={styles.input}>
              <FloatingLabelInput
                label={i18n.t('lanLabelUserID')}
                value={this.state.userAccount}
                // editable={false}
                // onChangeText={(text) => this.setState({ userAccount: text, errorMessage: '' })}
                maxLength={10}
                returnKeyType={'next'}
                onRef={(ref) => {
                  this.inputs['User ID'] = ref;
                }}
                onSubmitEditing={() => {
                  this.focusNextField('User Role');
                }}
              />
            </View>
            <View style={styles.input}>
              <FloatingLabelInput
                label={i18n.t('lanLabelUserRole')}
                value={this.state.userRole}
                // editable={false}
                maxLength={15}
                onRef={(ref) => {
                  this.inputs['User Role'] = ref;
                }}
                onSubmitEditing={() => { }}
              />
            </View>
            <View style={styles.inputFieldStyle} >
              <View style={styles.dobLeft} >
              <Text style={styles.labels} >{i18n.t('lanLabelDOB')}</Text>
              </View>
              <View style={styles.dobRight}>
                <DatePicker
                  style={styles.DatePickerView}
                  date={this.state.dob}
                  mode='date'
                  placeholder={i18n.t('lanLabelSelectDOB')}
                  format='YYYY-MM-DD'
                  minDate='1940-01-01'
                  maxDate={this.state.maxDate}
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

                  }}
                  onDateChange={(date) => { this.setState({ dob: date, errorMessage: '' }) }}
                />
              </View>
            </View>
            <View style={styles.addressContainer}>
              <View style={styles.address}>
                <Text style={styles.addressTxt}>{this.state.address}</Text>
              </View>
              <View style={styles.addressEditIcon} >
                <TouchableWithoutFeedback onPress={() => this.handleProfileAddressScreen()}>
                  <View style={styles.editIcon}>
                    <Icon name='ios-create' style={styles.editIConStyle} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <Text style={{ color: 'red', fontFamily: 'Roboto_light', fontSize: 13 }}>{this.state.errorMessage}</Text>
            <View style={styles.getCenterView} >
              <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                {!this.state.submitDisabled
                  ? <AwesomeButton block success
                    onPress={() => this.handleData(this.state.image)}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={22} marginTop={20}>
                    <Text style={styles.BtnText} > {i18n.t('lanCommonButtonUpdate')} </Text>
                  </AwesomeButton>
                  : <AwesomeButton block success
                    disabled={true}
                    onPress={() => this.handleData(this.state.image)}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='#ddd' backgroundShadow='#ddd' backgroundDarker='#ddd' paddingHorizontal={50} borderRadius={22} marginTop={20}>
                    <Text style={styles.BtnText} > {i18n.t('lanCommonButtonUpdate')} </Text>
                  </AwesomeButton>
                }
              </LinearGradient>
            </View>
          </View>
        </ScrollView>
        <Toast
          ref='toast'
          style={{backgroundColor:'red', width: '100%', borderRadius:0,padding: 10, }}
          position='top'
          positionValue={80}
          fadeInDuration={50}
          fadeOutDuration={500}
          // opacity={0.8}
          borderRadius={0}
          textStyle={{color:'white', fontFamily: 'Roboto_medium', }}
        />
      </Animated.View>

    );
  }
}
