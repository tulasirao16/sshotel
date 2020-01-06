import React from 'react';
import { observer, inject } from 'mobx-react';
import { View, TextInput,Animated, TouchableOpacity, TouchableHighlight, Keyboard,UIManager ,Dimensions, StatusBar, BackHandler,ActivityIndicator } from 'react-native';
import { Text, Icon } from 'native-base';
import Toast, {DURATION} from 'react-native-easy-toast';
import styles from './css/ChangePasswordCss';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;

@inject(['UserStore'])
@observer
export default class ChangePassword extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    header:null,
  });
  constructor(props) {
    super(props);
    this.state = {
      CurrentPassword: '',
      NewPassword:'',
      errorMessage: '',
      hidePassword: true,
      hidePassword1: true,
      disableValue: false,
      submitDisabled: false,
      shift: new Animated.Value(0),
      reload: false,
      reloadFunction: '',
      loading: false
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }


  focusNextField(id) {
    this.inputs[id].focus();
  }
  
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
  }
  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
  }
  handleBackButton = () => {
    const navigation = this.props.navigation;
    navigation.goBack()
    return true;
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

handleUpdatePassword() {
    const UserStore = this.props.UserStore;
    const navigation = this.props.navigation;
    if (!this.state.CurrentPassword) {
      this.setState({ errorMessage: i18n.t('lanErrorCurrentPasswordisRequired') })
    } else if (!this.state.NewPassword) {
      this.setState({ errorMessage: i18n.t('lanErrorNewPasswordisRequired') })
    } else if (this.state.NewPassword.length < 6) {
      this.setState({ errorMessage: i18n.t('lanErrorNewPasswordShouldContainMinimumSixcharacters') })
    } else {
      this.setState({ submitDisabled: true, loading: true })
      let loginData = {
        'currentPassword': this.state.CurrentPassword,
        'newPassword': this.state.NewPassword
      }
      let _this = this;
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, submitDisabled: false, errorMessage: i18n.t('lanLabelServerNotResponding') });
        setTimeout(function () {
          navigation.navigate('SigninScreen');
        }, 3000);
      }, 10000);
      UserStore.handleUpdatePassword(loginData, function (resObj) {
        clearTimeout(isLoading)
        if (resObj.statusCode == '1012') {
          _this.setState({errorMessage: i18n.t('lanErrorPasswordUpdatedSuccessfully'), submitDisabled: false, loading: false});
          navigation.navigate('SigninScreen');
        } else if(resObj.statusCode == '9979') {
          _this.setState({errorMessage: i18n.t('lanErrorInvalidCurrentPassword'), submitDisabled: false, loading: false});
        } else {
          _this.setState({errorMessage:  i18n.t('lanErrorPasswordUpdateFailed'), submitDisabled: false, loading: false});
        }
      })
    }
  }
  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }
  managePasswordVisibility1 = () => {
    this.setState({ hidePassword1: !this.state.hidePassword1 });
  }
  handlePasswordChange (text) {
    let value = text.replace(/\s/g, '');
      this.setState({CurrentPassword: value, errorMessage: ''})
  }
  handleNewPassword (text) {
    let value = text.replace(/\s/g, '');
    this.setState({NewPassword: value, errorMessage: ''})
  }
  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    return (
      <View style={ styles.container}>
        <Animated.View style={[styles.container, { transform: [{translateY: shift}] }]}>
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
                    <Text style={styles.headerTitleStyle}> {i18n.t('lanTitleChangePassword')} </Text>
                </View>
            </View>
          </LinearGradient>
          {this.state.loading
          ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#ffffff' size='large' style={styles.activeIndicatorStyle} /></View>
          : null}
          <View style={{ margin: 15 }}>
            <View style={styles.inputTopGap } >
              <FloatingLabelInput
                label={i18n.t('lanLabelCurrentPassword')}
                value={this.state.CurrentPassword}
                secureTextEntry={this.state.hidePassword}
                autoCapitalize = 'none'
                onChangeText={(text) => this.handlePasswordChange(text)}
                minLength = {3}
                maxLength = {15}
                returnKeyType = { 'next' }
                onRef={(ref) => {
                    this.inputs['Current Password'] = ref;
                }}
                onSubmitEditing={() => {
                    this.focusNextField('New Password');
                }}
              />
              <TouchableOpacity activeOpacity={0.8} style={styles.visibilityBtn} onPress={this.managePasswordVisibility}>
                <Icon name={(this.state.hidePassword) ? name='eye-off': name='eye'} style={{color:'grey', fontSize:20,top:8}}  />
              </TouchableOpacity>
            </View>
            <View style={styles.inputTopGap } >
              <FloatingLabelInput
                label={i18n.t('lanLabelNewPassword')}
                value={this.state.NewPassword}
                secureTextEntry={this.state.hidePassword1}
                autoCapitalize = 'none'
                onChangeText={(text) => this.handleNewPassword(text)}
                minLength = {3}
                maxLength = {15}
                onRef={(ref) => {
                    this.inputs['New Password'] = ref;
                }}
                onSubmitEditing={() => {}}
              />
              <TouchableOpacity activeOpacity={0.8} style={styles.visibilityBtn} onPress={this.managePasswordVisibility1}>
                <Icon name={(this.state.hidePassword1) ? name='eye-off': name='eye'} style={{color:'grey', fontSize:20,top:8}}  />
              </TouchableOpacity>
            </View>
            <Text style={{ color: 'red', fontSize: 13, fontFamily: 'Roboto_medium' }}>{this.state.errorMessage}</Text>
            <View style={styles.getCenterView} >
              <LinearGradient colors={['#025d8c', '#01a4a2']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                {!this.state.submitDisabled
                ? <AwesomeButton block success
                    onPress={() => this.handleUpdatePassword()}
                    width={DEVICE_WIDTH/3} height={44} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={22} marginTop={20}>
                    <Text style={styles.BtnText} >{i18n.t('lanButtonUpdate')}</Text>
                  </AwesomeButton>
                : <AwesomeButton block success
                    disabled={true}
                    onPress={() => this.handleUpdatePassword()}
                    width={DEVICE_WIDTH/3} height={44} backgroundColor='#ddd' backgroundShadow='#ddd' backgroundDarker='#ddd' paddingHorizontal={50} borderRadius={22} marginTop={20}>
                  <Text style={styles.BtnText} >{i18n.t('lanButtonUpdate')} </Text>
                  </AwesomeButton>
                  }
              </LinearGradient>
            </View>                  
            <Toast
              ref='toast'
              style={{backgroundColor:'#ff0000',width:'100%',marginBottom:5}}
              position='bottom'
              positionValue={100}
              fadeInDuration={50}
              fadeOutDuration={500}
              opacity={0.8}
              textStyle={{color:'white'}} 
              />
          </View>
        </Animated.View>
      </View>
    );
  }
}
