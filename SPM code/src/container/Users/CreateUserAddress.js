import React from 'react';
import { ActivityIndicator, Button, AsyncStorage, View, StatusBar, TextInput, TouchableHighlight, TouchableOpacity, Animated, Keyboard, Dimensions, ScrollView, BackHandler, UIManager } from 'react-native';
import { Icon, Text, Picker } from 'native-base';
import { observer, inject } from 'mobx-react';
import styles from './css/SupplierCreateUserAddressCss';
import { LinearGradient } from 'expo-linear-gradient';
import DatePicker from 'react-native-datepicker';
import AwesomeButton from 'react-native-really-awesome-button';
import i18n from 'i18n-js';
const Device_Height = Dimensions.get('window').height;
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;

@inject(['UserStore'])
@observer
class FloatingLabelInput extends React.Component {
  constructor(props) {
    super()
    this.state = {
      isFocused: false,
    };
  }
  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
  }

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: (this.state.isFocused || this.props.value !== '') ? 1 : 0,
      duration: 200,
    }).start();
  }

  render() {
    const { label, ...props } = this.props;
    const labelStyle = {
      position: 'absolute',
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [17, 14],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#8a8786', '#454545'],
      }),
      fontFamily: 'Roboto_light'
    };
    return (
      <View style={{ paddingTop: 18, }}>
        <Animated.Text style={labelStyle}>
          {label}
        </Animated.Text>
        <TextInput
          {...props}
          style={this.state.isFocused ? { height: 26, fontSize: 17, color: '#333', fontFamily: 'Roboto_light', borderBottomWidth: 2, borderBottomColor: '#025d8c' } : { height: 26, fontFamily: 'Roboto_light', fontSize: 17, color: '#000', borderBottomWidth: 1, borderBottomColor: '#009688' }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          underlineColorAndroid='transparent'
          blurOnSubmit
        />
      </View>
    );
  }
}

@inject(['UserStore'])
@observer
export default class CreateUserAddress extends React.Component {
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
      selected: 'key0',
      area: '',
      address: '',
      landMark: '',
      city: '',
      pinCode: '',
      state: 'Telangana',
      country: 'India',
      errorMessage: '',
      isloading: false,
      submitDisabled: false,
      addressError: '', addressSuccess: '',
      areaError: '', areaSuccess: '',
      cityError: '', citySuccess: '',
      pinError: '', pinSuccess: '',
      reload: false,
      reloadFunction: '',
      loading: false,

    };
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    this.handleSubmit = this.handleSubmit.bind(this);
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
  onStateChange(value) {
    this.setState({
      state: value
    });
  }
  handleSubmit() {
    const UserStore = this.props.UserStore;
    const navigation = this.props.navigation
    let userData = navigation.state.params.data;
    if (!this.state.address.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorAddressIsRequired'), addressError: true, addressSuccess: false });
    } else if (!this.state.area.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorAreaIsRequired'), areaError: true, areaSuccess: false });
    } else if (!this.state.city.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorCityIsRequired'), cityError: true, citySuccess: false });
    } else if (!this.state.pinCode.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorPincodeIsRequired'), pinError: true, pinSuccess: '' });
    } else if ((this.state.pinCode.length < 6) || (this.state.pinCode.length > 6)) {
      this.setState({ errorMessage: i18n.t('lanErrorPinCodeValidation') });
    } else {
      this.setState({ submitDisabled: true })
      let userDataObj = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        mobileNumber: userData.mobileNumber,
        alternateContactNumber: userData.alternateContactNumber,
        email: userData.email,
        alternateEmail: userData.alternateEmail,
        // userID: userData.userID,
        password: userData.password,
        dob: userData.dob,
        dobNumber: userData.dobNumber,
        gender: userData.gender ? userData.gender : '',
        userRole: userData.userRole,
        userStatus: userData.userStatus,
        area: this.state.area,
        landMark: this.state.landMark,
        address: this.state.address,
        city: this.state.city,
        state: this.state.state,
        pinCode: this.state.pinCode,
        country: this.state.country
      };
      this.setState({ loading: true });
      let _this = this;
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reload: true });
      }, 20000);
      UserStore.postSPUserData(userDataObj, function (resObj) {
        clearTimeout(isLoading)
        if (resObj.statusCode == '0000') {
          UserStore.getSPUsersListingData(1, '', function (resObj) {
            _this.setState({ loading: false, submitDisabled: false });
            navigation.navigate('UsersList');
          });
        } else if (resObj.statusCode == '9987') {
          _this.setState({ loading: false, errorMessage: i18n.t('lanErrorUserIdExisting') });
        } else if (resObj.statusCode == '9988') {
          _this.setState({ loading: false, errorMessage: i18n.t('lanErrorEmailExisting') });
        } else if (resObj.statusCode == '9989') {
          _this.setState({ loading: false, errorMessage: i18n.t('lanErrorMobileNumberExisting') });
        } else if (resObj.statusCode == '9999') {
          _this.setState({ loading: false })
          navigation.navigate('InformationScreen');
        }
      });
    }
  }

  handleReload = () => {
    const navigation = this.props.navigation
    navigation.navigate('UsersList');
  }

  render() {
    const navigation = this.props.navigation;
    const { shift } = this.state;
    const addressLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelAddress')}<Text style={styles.required}>*</Text></Text>
    const areaLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelArea')}<Text style={styles.required}>*</Text></Text>
    const cityLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelCity')}<Text style={styles.required}>*</Text></Text>
    const pincodeLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelPinCode')}<Text style={styles.required}>*</Text></Text>
    return (
      !this.state.reload
          ? <View style={styles.container}>
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
                    <Text style={styles.headerTitleStyle}>{i18n.t('lanLabelCreateUser')}</Text>
                  </View>
                </View>
              </LinearGradient>
              {this.state.loading
                  ? <View style={styles.activeIndicatorView}><ActivityIndicator color="#FFFFFF" size='large' style={styles.activeIndicatorStyle} /></View>
                  : null}
              <View style={styles.bodyContainer}>
                <ScrollView>
                  <View style={[styles.floatingInputView, styles.floatingInputViewOne]} >
                    <FloatingLabelInput
                      label={addressLbl}
                      // placeholder='House/Plot #, House/Plot Name, Street #, Street Name'
                      isError={this.state.addressError}
                      value={this.state.address}
                      onChangeText={(text) => this.setState({ address: text, errorMessage: '', addressError: text ? false : true, addressSuccess: true })}
                    />
                    {this.state.addressError
                      ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={styles.errorIcon} /></View>
                      : this.state.addressSuccess && !this.state.addressError
                        ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                        : null
                    }
                  </View>
                  <View style={[styles.floatingInputView, styles.floatingInputViewOne]} >
                    <FloatingLabelInput
                      label={areaLbl}
                      value={this.state.area}
                      onChangeText={(text) => this.setState({ area: text, errorMessage: '', areaError: text ? false : true, areaSuccess: true })}
                      isError={this.state.areaError}
                    />
                    {this.state.areaError
                      ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={styles.errorIcon} /></View>
                      : this.state.areaSuccess && !this.state.areaError
                        ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                        : null
                    }
                  </View>
                  <View style={[styles.floatingInputView, styles.floatingInputViewOne]} >
                    <FloatingLabelInput
                      label={i18n.t('lanLabelLandmark')}
                      value={this.state.landMark}
                      onChangeText={(text) => this.setState({ landMark: text, errorMessage: '', })}
                    />
                  </View>
                  <View style={[styles.floatingInputView, styles.floatingInputViewOne]} >
                    <FloatingLabelInput
                      label={cityLbl}
                      value={this.state.city}
                      onChangeText={(text) => this.setState({ city: text, errorMessage: '', cityError: text ? false : true, citySuccess: true })}
                      isError={this.state.cityError}
                    />
                    {this.state.cityError
                      ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={styles.errorIcon} /></View>
                      : this.state.citySuccess && !this.state.cityError
                        ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                        : null
                    }
                  </View>
                  <View style={[styles.floatingInputView, styles.floatingInputViewOne]} >
                    <FloatingLabelInput
                      label={pincodeLbl}
                      value={this.state.pinCode}
                      keyboardType={'numeric'}
                      minLength={6} maxLength={6}
                      onChangeText={(text) => this.setState({ pinCode: text, errorMessage: '', pinError: text ? false : true, pinSuccess: text == 6 ? true : false })}
                    />
                    {this.state.pinError
                      ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={styles.errorIcon} /></View>
                      : this.state.pinSuccess && !this.state.pinError
                        ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon} /></View>
                        : null
                    }
                  </View>
                  <View style={[styles.floatingInputView, styles.floatingInputViewOne]} >
                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', marginTop: -5.5 }} >
                      <Picker
                        mode='dropdown'
                        iosIcon={<Icon name='arrow-down' />}
                        style={{ width: DEVICE_WIDTH - 20, left: -10 }}
                        selectedValue={this.state.state}
                        onValueChange={this.onStateChange.bind(this)}
                      >
                        {/* <Picker.Item label='Select State' value='' /> */}
                        <Picker.Item label='Andhra Pradesh' value='Andhra Pradesh' />
                        <Picker.Item label='Telangana' value='Telangana' />
                      </Picker>
                    </View>
                  </View>
                  <View style={[styles.floatingInputView, styles.floatingInputViewOne]} >
                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', marginTop: -5.5 }} >
                      <Picker
                        mode='dropdown'
                        iosIcon={<Icon name='arrow-down' />}
                        style={{ width: DEVICE_WIDTH - 20, left: -10 }}
                        selectedValue={this.state.country}
                      >
                        <Picker.Item label='India' value='India' />
                      </Picker>
                    </View>
                  </View>
                  <View style={styles.errorView} >
                    <Text style={styles.errorTxt}>{this.state.errorMessage}</Text>
                  </View>
                  <View style={styles.getCenterView} >
                    <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                      {/* <AwesomeButton block success
                    onPress={() => this.handleSubmit()}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                    <Text style={styles.BtnText}> Submit </Text>
                  </AwesomeButton> */}
                      {!this.state.submitDisabled
                        ? <AwesomeButton block success
                          onPress={() => this.handleSubmit()}
                          width={DEVICE_WIDTH / 3} height={44} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={22} marginTop={20}>
                          <Text style={styles.BtnText} >{i18n.t('lanCommonButtonSubmit')}</Text>
                        </AwesomeButton>
                        : <AwesomeButton block success
                          disabled={true}
                          onPress={() => this.handleSubmit()}
                          width={DEVICE_WIDTH / 3} height={44} backgroundColor='#ddd' backgroundShadow='#ddd' backgroundDarker='#ddd' paddingHorizontal={50} borderRadius={22} marginTop={20}>
                          <Text style={styles.BtnText} >{i18n.t('lanCommonButtonSubmit')}</Text>
                        </AwesomeButton>
                      }
                    </LinearGradient>
                  </View>
                </ScrollView>
              </View>
            </Animated.View>
          </View>
          : <View>
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
              <View style={styles.headerMainViewReload} >
                <View style={styles.headerLeftReload} >
                  <TouchableOpacity>
                    <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => navigation.goBack()} />
                  </TouchableOpacity>
                </View>
                <View style={styles.headerBodyReload} >
                  <TouchableOpacity>
                    <Text style={styles.headerTitleStyle}>{i18n.t('lanAppTitle')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
            <View style={{ jflex: 1, justifyContent: 'center', alignItems: 'center', width: DEVICE_WIDTH - 20, height: Device_Height - 150 }} >
              <View style={styles.eachBtnView} >
                {/* <Button onPress={() => this.handleReload()}  style={ styles.btnStyle }>
                       <Text style={ styles.btnTxt } >Reload </Text>
                     </Button> */}
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
