import React from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncStorage, Platform, Image, TouchableHighlight, TouchableOpacity, BackHandler, Dimensions, Animated, Keyboard, UIManager, TextInput, StyleSheet } from 'react-native';
import { Container, Button, View, Icon, Text, Content, Label, Left, Right } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './css/SigninNewScreenCss';
import AwesomeButton from "react-native-really-awesome-button";
import { PUBLIC_DOMAIN } from '../../../constants';
import { ScrollView } from 'react-native-gesture-handler';
import i18n from 'i18n-js';


const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;

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
      fontSize: 16,
      fontFamily: 'Roboto_medium'
    };
    return (
      <View style={{ paddingTop: 18, }}>
        <Animated.Text style={labelStyle}>
          {label}
        </Animated.Text>
        <TextInput
          {...props}
          style={this.state.isFocused ? { height: 30, fontSize: 17, fontFamily: 'Roboto_medium', color: '#000', borderBottomWidth: 2, borderBottomColor: '#bfbfbf' }
            : { height: 30, fontSize: 17, color: '#000', fontFamily: 'Roboto_medium', borderBottomWidth: 1, borderBottomColor: '#bfbfbf' }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          underlineColorAndroid='transparent'
          blurOnSubmit
        />
      </View>
    );
  }
}

// @inject(['UserStore'])
// @observer

export default class SigninNewScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      title: i18n.t('lanTitleSignIn'),
      header: null,
      headerStyle: {
        backgroundColor: 'transparent',
        elevation: 0
      },
      headerTitleStyle: {
        textAlign: 'center',
        flex: 1,
        color: '#25c5df',
        fontSize: 16,
        fontFamily: 'Roboto_medium'
      },
      headerLeft: <Button transparent onPress={this._onButtonNextPress}><Icon name='ios-arrow-back' style={{ color: '#25c5df', marginLeft: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>,

    }
  };
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      password: '',
      errorMessage: ''
    }
    this.handleData = this.handleData.bind(this)

  }

  handleData() {
    const navigation = this.props.navigation;
    const data = navigation.state.params && navigation.state.params ? navigation.state.params.bookingData : {};
    if (!this.state.userID) {
      this.setState({ errorMessage: (i18n.t('lanErrorPleaseEnterUserId'))})
    } else if (!this.state.password) {
      this.setState({ errorMessage: (i18n.t('lanErrorPleaseEnterPassword'))})
    } else {
      const UserStore = this.props.UserStore;
      const navigation = this.props.navigation;
      let post_json = {
        'userID': this.state.userID,
        'password': this.state.password,
      };
      let _this = this;
      UserStore.userSignin(post_json, function (resObj) {
        AsyncStorage.setItem('authObj', JSON.stringify(resObj.statusResult));
        // if(resObj.statusCode == '1000') {
        //   navigation.navigate('HomeScreen');
        // } else {
        //   _this.setState({errorMessage: 'Invalid Login Credentials'});
        // }
        if (data) {
          navigation.navigate('ProductReviewScreen', { data: data });
        } else {
          navigation.navigate('HomeScreen');
        }
      });
    }
  }

  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    return (
      <View style={{ flex: 1, }}>
        <View>
          <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <View style={styles.headerMainView} >
              <Image source={require('../../../assets/logo.png')} style={styles.logImg} />
            </View>
          </LinearGradient>
        </View>
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.signinMain}>
                <Text style={styles.mainTxt}>{i18n.t('lanButtonSignIn')}</Text>
            </View>
            <View style={styles.input}>
              <TextInput
                style={styles.textInput}
                placeholder={i18n.t('lanLabelUserId')}
                onChangeText={(text) => this.setState({text})}
              />
            </View>
            <View style={styles.input}>
              <TextInput
                  style={styles.textInput}
                  placeholder={i18n.t('lanLabelPassword')}
                  onChangeText={(text) => this.setState({text})}
                />
              <View style={styles.forget} >
                <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('ResetPasswordScreen')} >
                  <Text uppercase={false} style={styles.forgetBtn}>{i18n.t('lanButtonForgotPassword')}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.button_main}>
              <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('SignupOtpScreen')} >
                <LinearGradient colors={['#025d8c', '#019fa0']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={{ padding: 15, alignItems: 'center', borderRadius: 5 }}>
                  <Text style={styles.gradientBtn}>{i18n.t('lanButtonSignIn')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={styles.orView}>
              <Button transparent style={styles.orBtn}>
                <Text style={styles.ORText}>{i18n.t('lanLabelOr')}</Text>
              </Button>
            </View>
            {/* <Text style={{ color: 'red' }}>{this.state.errorMessage}</Text> */}
            <View style={styles.FBbutton}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',  }}>
                <Button style={styles.fbBtn}>
                  <Image source={require('../../../assets/facebook-logo.png')} style={styles.FBIcon} />
                  {/* <Text style={styles.fbText} uppercase={false}>Continue with facebook</Text> */}
                </Button>
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                <Button style={styles.goBtn}>
                  <Image source={require('../../../assets/google.png')} style={styles.goIcon} />
                  {/* <Text style={styles.goText} uppercase={false}>Continue with Google</Text> */}
                </Button>
              </View>
            </View>
              <View style={styles.dont}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', }}>
                  <Text style={styles.dontText}>{i18n.t('lanLabelDontHaveAnAccount')} </Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', }}>
                  <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('SignupScreen')} >
                    <Text style={styles.signupText}> {i18n.t('lanButtonSignUp')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}

