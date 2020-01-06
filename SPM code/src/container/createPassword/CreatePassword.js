import React from 'react';
import { Platform, ActivityIndicator, Image, Dimensions, Animated, Keyboard, TextInput, TouchableOpacity } from 'react-native';
import { Button, View, Icon, Text } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../container/signin/css/ForgotPasswordScreenCss';
import AwesomeButton from 'react-native-really-awesome-button';
import { observer, inject } from 'mobx-react';
import Toast, { DURATION } from 'react-native-easy-toast';
import i18n from 'i18n-js';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;
const Device_Height = Dimensions.get('window').height;
@inject(['UserStore'])
@observer
export default class CreatePassword extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header:null,
      // title: 'Reset Password',
      // headerStyle: {
      //   backgroundColor: 'transparent',
      //   elevation: 0
      // },
      // headerTitleStyle: {
      //   textAlign: 'center',
      //   flex: 1,
      //   color: '#25c5df',
      //   fontSize: 18,
      // },
      // headerLeft: <Button transparent onPress={() => navigation.goBack()}><Icon name='ios-arrow-back' style={{ color: '#25c5df', marginLeft: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      newPassword: '',
      sucuss: false,
      hidePassword: true,
      reload: false,
      reloadFunction: '',
      loading: false,
    };
  }
  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }
  handlePasswordChange (text) {
    let value = text.replace(/\s/g, '');
      this.setState({newPassword: value, errorMessage: ''})
  }
  submitNewPassword = (newPassword) => {
    Keyboard.dismiss();
    const UserStore = this.props.UserStore;
    navigation = this.props.navigation
    if (newPassword.length < 6) {
       this.refs.toast.show(i18n.t('lanErrorPasswordShouldBeAtleastSixCharacters'));
    } else {
      let post_json = {
        'newPassword': this.state.newPassword
      }
      this.setState({ loading: true });
      let _this = this;
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reload: true });
      }, 20000);
      UserStore.updateSpPassword(post_json, function (resObj) {
        clearTimeout(isLoading)
        if (resObj.statusCode == '1012') {
          _this.setState({ loading: false, sucuss: true })
          _this.refs.toast.show(i18n.t('lanSuccessPasswordSuccessfullyChanged'))
          _this.props.navigation.navigate('SigninScreen');
        } else {
          _this.refs.toast.show(i18n.t('lanErrorFailedToCreatePassword'));
          _this.setState({ loading: false })
        }
      });
    }
  }
  handleReload = () => {
    const navigation = this.props.navigation
    navigation.navigate('SigninScreen');
  }
  render() {
    return (
      !this.state.reload
        ? <View style={{ flex: 1 }}> 
          <View>
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
              <View style={styles.headerMainView} >
                <View style={styles.headerLeft} >
                  <View>
                    <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => navigation.goBack()} />
                  </View>
                </View>
                <View style={styles.headerBody} >
                  <View>
                    <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleResetPassword')}</Text>
                  </View>
                </View>
                <View style={styles.headerRight} >
                </View>
              </View>
            </LinearGradient>
            {this.state.loading
            ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#FFFFFF' size='large' style={ styles.activeIndicatorStyle } /></View>
            : null}
          </View>
          <View style={styles.container}>
            <View style={styles.mobouter} >
              <View style={styles.mobile}>
                <Image source={require('../../../assets/sand-clock.png')} style={{ resizeMode: 'contain', width: 40, height: 40, }} />
              </View>
            </View>
            <View style={styles.input}>
              <FloatingLabelInput
                label={i18n.t('lanLabelResetPassword')}
                value={this.state.newPassword}
                secureTextEntry={this.state.hidePassword}
                // secureTextEntry={true}
                minLength={3} maxLength={20}
                onChangeText={(text) => this.handlePasswordChange(text)}
              // onChangeText={(text) => this.setState({ newPassword: text, errorMessage: '' })}
              />
              <TouchableOpacity activeOpacity={0.8} style={styles.visibilityBtn} onPress={this.managePasswordVisibility}>
                <Icon name={(this.state.hidePassword) ? name = 'eye-off' : name = 'eye'} style={{ color: 'grey', fontSize: 20, top: 8 }} />
              </TouchableOpacity>
              {/* <TextInput
              placeholder='Reset Password'
              secureTextEntry={true}
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={(text) => this.setState({ newPassword: text, errorMessage: '' })}
              maxLength={20}
              value={this.state.newPassword}
            /> */}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 17 }} >
              <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                <AwesomeButton block success
                  onPress={() => this.submitNewPassword(this.state.newPassword)}
                  width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                  <Text style={styles.BtnText} > {i18n.t('lanCommonButtonSubmit')}  </Text>
                </AwesomeButton>
              </LinearGradient>
            </View>

            {/* <View style={styles.nextBtnView}>
            <AwesomeButton block success
              onPress={() => this.submitNewPassword(this.state.newPassword)}
              width={DEVICE_WIDTH - 30} height={50} backgroundColor='#01a5a2' backgroundShadow='#025d8c'
              backgroundDarker='#025d8c' paddingHorizontal={50} borderRadius={1525}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}> {'Submit'.toUpperCase()} </Text>
            </AwesomeButton>
          </View> */}
          </View>
        <Toast
          ref='toast'
          style= {this.state.sucuss ? { backgroundColor: '#008000', width: '100%', borderRadius:0, padding: 10, } : { backgroundColor: '#ff0000', width: '100%', borderRadius:0, padding: 10, }}
          position='top'
          positionValue={80}
          fadeInDuration={750}
          fadeOutDuration={1000}
          // opacity={0.8}
          textStyle={{ color:'white', fontFamily: 'Roboto_medium' }}
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

// FloatingLabelInput Code Start
class FloatingLabelInput extends React.Component {
  state = {
    isFocused: false,
  };

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
      color: '#9a9a9a',
      fontWeight: '400',
      fontFamily: (Platform.OS === 'ios') ? 'Roboto_medium' : 'Roboto_medium'
    };
    return (
      <View style={{ paddingTop: 18, }}>
        <Animated.Text style={labelStyle}>
          {label}
        </Animated.Text>
        <TextInput
          {...props}
          style={this.state.isFocused ? { height: 30, fontSize: 17, fontWeight: '400', fontFamily: (Platform.OS === 'ios') ? 'Roboto_medium' : 'Roboto_medium', color: '#000', borderBottomWidth: 2, borderBottomColor: '#bfbfbf' }
            : { height: 30, fontSize: 17, color: '#000', fontWeight: '400', fontFamily: (Platform.OS === 'ios') ? 'Roboto_medium' : 'Roboto_medium', borderBottomWidth: 1, borderBottomColor: '#bfbfbf' }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          underlineColorAndroid='transparent'
          blurOnSubmit
        />
      </View>
    );
  }
}
// FloatingLabelInput Code End