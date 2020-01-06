import React from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncStorage, TouchableOpacity, TouchableHighlight, Dimensions, Image, TextInput, Animated, Keyboard, UIManager, ActivityIndicator, Platform } from 'react-native';
import { View, Text, Icon, Content } from 'native-base';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './css/SigninScreenCss';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import { ScrollView } from 'react-native-gesture-handler';
import AwesomeButton from 'react-native-really-awesome-button';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;
import Toast, { DURATION } from 'react-native-easy-toast';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import i18n from 'i18n-js';

@inject(['UserStore'])
@observer
export default class SigninScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null
      // headerLeft: <Button transparent onPress={this._onButtonNextPress}><Icon name='ios-arrow-back' style={{ color: '#25c5df', marginLeft: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      password: '',
      expoToken: '',
      errorMessage: '',
      shift: new Animated.Value(0),
      loading: false,
      hidePassword: true,
      reload: false,
      reloadFunction: ''
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    // this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    // this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    this.handleData = this.handleData.bind(this);
  }
  componentWillMount() {
    AsyncStorage.removeItem('authObj');
    AsyncStorage.removeItem('authToken');
    this.registerForPushNotifications();
  }
  async registerForPushNotifications() {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        return;
      }
    }
    const expoToken = await Notifications.getExpoPushTokenAsync();
    this.setState({
      expoToken,
    });
  }
  // handleKeyboardDidShow = (event) => {
  //   const { height: windowHeight } = Dimensions.get('window');
  //   const keyboardHeight = event.endCoordinates.height;
  //   const currentlyFocusedField = TextInputState.currentlyFocusedField();
  //   UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
  //     const fieldHeight = height;
  //     const fieldTop = pageY;
  //     const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
  //     if (gap >= 0) {
  //       return;
  //     }
  //     Animated.timing(
  //       this.state.shift,
  //       {
  //         toValue: gap,
  //         duration: 1000,
  //         useNativeDriver: true,
  //       }
  //     ).start();
  //   });
  // }
  // handleKeyboardDidHide = () => {
  //   Animated.timing(
  //     this.state.shift,
  //     {
  //       toValue: 0,
  //       duration: 1000,
  //       useNativeDriver: true,
  //     }
  //   ).start();
  // }
  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }
  handlePasswordChange(text) {
    let value = text.replace(/\s/g, '');
    this.setState({ password: value, errorMessage: '' })
  }
  handleData() {
    const navigation = this.props.navigation;
    const UserStore = this.props.UserStore;
    if (!this.state.userID) {
      // this.setState({ errorMessage: 'Please enter user id' });
      this.refs.toast.show(i18n.t('lanErrorPleaseEnterUserId'));
    } else if (!this.state.password) {
      // this.setState({ errorMessage: 'Please enter password' });
      this.refs.toast.show(i18n.t('lanErrorPleaseEnterPassword'));
    } else {
      this.setState({ loading: true });
      let post_json = {
        'userID': this.state.userID,
        'password': this.state.password,
        'deviceToken': this.state.expoToken,
        'appType': 'Mobile App',
        'deviceOS': Platform.OS
      };
      this.setState({ loading: true });
      let _this = this;
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reload: true });
      }, 10000);
      UserStore.supplierSignin(post_json, function (resObj) {
        clearTimeout(isLoading)
        _this.setState({ loading: false });
        if (resObj.statusCode == '1000') {
          AsyncStorage.setItem('authObj', JSON.stringify(resObj.statusResult));
          if (resObj.statusResult.userType === 'Owner') {
            navigation.navigate('SPHomeScreen');
          } else {
            navigation.navigate('PropertiesList');
          }
        } else if (resObj.statusCode == '404') {
          _this.refs.toast.show(i18n.t('lanErrorNoInternetConnection'));
          // _this.setState({ errorMessage: 'No Internet Connection' })
        } else {
          _this.refs.toast.show(i18n.t('lanErrorInvalidLoginCredentials'));
          // _this.setState({ errorMessage: 'Invalid Login Credentials' })
          AsyncStorage.removeItem('authObj');
        }
      });
    }
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  render() {
    const navigation = this.props.navigation;
    const { shift } = this.state;
    return (
      <View style={{ flex: 1, }}>
        <Content style={{ flex: 1 }}>
          <View>
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
              <View style={styles.headerMainView} >
                <View style={styles.headerBody} >
                  <Text style={styles.headerTitleStyle} >{i18n.t('lanTitleSignIn')}</Text>
                </View>
              </View>
              <View style={styles.landingView} >
                <View style={styles.imageBox}>
                  <Image source={require('../../../assets/landing.png')} style={styles.imgStyle} />
                </View>
              </View>
            </LinearGradient>
            {/* <View style={styles.landingViewOne}>
              <View style={styles.welcomeFieldStyle} >
                <Text style={[ styles.fontFamilyStyle,  styles.welcomeText ]} >Hi, Welcome to CozySpace</Text>
              </View>
            </View> */}
            {this.state.loading
              ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#ffffff' size='large' style={styles.activeIndicatorStyle} /></View>
              : null}
          </View>
          <View style={styles.container}>
            <ScrollView>
              {/* <View style={styles.FBbutton}>
              <Button style={styles.fbBtn}>
                <Image source={require('../../../assets/facebook.png')} style={styles.FBIcon} />
                <Text style={styles.fbText} uppercase={false}>Continue with facebook</Text>
              </Button>
            </View>
            <View style={styles.gobutton}>
              <Button style={styles.goBtn}>
                <Image source={require('../../../assets/google.png')} style={styles.goIcon} />
                <Text style={styles.goText} uppercase={false}>Continue with Google</Text>
              </Button>
            </View> */}

              <View style={styles.input}>
                <FloatingLabelInput
                  label={i18n.t('lanLabelEnterUserID')}
                  value={this.state.userID}
                  onChangeText={(text) => this.setState({ userID: text, errorMessage: '' })}
                  minLength={3} maxLength={100}
                  returnKeyType={'next'}
                  onRef={(ref) => {
                    this.inputs['userID'] = ref;
                  }}
                  onSubmitEditing={() => {
                    this.focusNextField('password');
                  }}
                />
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  label={i18n.t('lanLabelEnterYourPassword')}
                  secureTextEntry={this.state.hidePassword}
                  // secureTextEntry={true}
                  value={this.state.password}
                  style={styles.textInputStyles}
                  onChangeText={(text) => this.handlePasswordChange(text)}
                  // onChangeText={(text) => this.setState({ password: text, errorMessage: '' })}
                  minLength={6} maxLength={20}
                  onRef={(ref) => {
                    this.inputs['password'] = ref;
                  }}
                  onSubmitEditing={() => { }}
                />
                <TouchableOpacity activeOpacity={0.8} style={styles.visibilityBtn} onPress={this.managePasswordVisibility}>
                  <Icon name={(this.state.hidePassword) ? name = 'eye-off' : name = 'eye'} style={{ color: 'grey', fontSize: 25, }} />
                </TouchableOpacity>
                <View style={styles.forget} >
                  <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')} >
                    <Text style={[styles.fontFamilyStyle, styles.fbLoginBtnTxt, styles.signupLinkTxt]} >{i18n.t('lanCommonButtonForgotPassword')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 17 }} >
                <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                  <AwesomeButton block success
                    onPress={() => this.handleData()}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                    <Text style={styles.BtnText}>{i18n.t('lanCommonButtonLogin')}</Text>
                  </AwesomeButton>
                </LinearGradient>
              </View>

              {/* <View style={{  flexDirection: 'row', justifyContent: 'center' }} >
              <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={{borderRadius:5}}>
                <AwesomeButton block success activeOpacity={0.8}
                  onPress={() => this.handleData()}
                  width={DEVICE_WIDTH - 30} height={50} backgroundColor='transparent' backgroundShadow='transparent'
                  backgroundDarker='transparent' paddingHorizontal={50} borderRadius={5}>
                  <Text style={{ color: 'white', fontSize:18, fontFamily:'Roboto_light' }}> Login </Text>
                </AwesomeButton> 
              </LinearGradient> 
            </View> 
              <View style={styles.centerAlignment}><Text style={styles.orStyle} >or</Text></View>*/}
              <View style={styles.dont}>
                <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Text style={styles.dontText}>{i18n.t('lanLabelDontHaveAnAccount')} </Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('SPSignupScreen')} >
                    <Text style={styles.signupText}>{i18n.t('lanCommonButtonBecomeHost')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* <View style={{justifyContent:'center', alignItems:'center'}}><Text style={styles.errorMessage}>{this.state.errorMessage}</Text></View> */}
            </ScrollView>
          </View>
          <Toast
            ref='toast'
            style={{ backgroundColor: 'red', width: '100%', borderRadius: 0, padding: 10, }}
            position='top'
            positionValue={250}
            fadeInDuration={750}
            fadeOutDuration={1000}
            opacity={0.8}
            borderRadius={0}
            textStyle={{ color: 'white', fontFamily: 'Roboto_medium', }}
          />
        </Content>
        {Platform.OS !== 'ios'
          ? <KeyboardSpacer />
          : null
        }
      </View>
    )
  }
}
