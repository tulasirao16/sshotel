import React from 'react';
import { observer, inject } from 'mobx-react'; 
import { AsyncStorage, Platform, Image, TouchableOpacity, BackHandler, Dimensions, Animated, Keyboard, UIManager, TextInput, StyleSheet } from 'react-native';
import { Container, Button, View, Icon, Text, Content, Label, Left, Right } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './css/ResetPasswordScreenCss';
import AwesomeButton from "react-native-really-awesome-button";
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
      fontFamily:'Roboto_medium'
    };
    return (
      <View style={{ paddingTop: 18, }}>
        <Animated.Text style={labelStyle}>
          {label}
        </Animated.Text>
        <TextInput
          {...props}
          style={this.state.isFocused ? { height: 30, fontSize: 17, fontFamily:'Roboto_medium', color: '#000', borderBottomWidth: 2, borderBottomColor: '#bfbfbf' }
            : { height: 30, fontSize: 17, color: '#000', fontFamily:'Roboto_medium', borderBottomWidth: 1, borderBottomColor: '#bfbfbf' }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          underlineColorAndroid='transparent'
          blurOnSubmit
        />
      </View>
    );
  }
}

export default class ResetPasswordScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      title:  i18n.t('lanTitleForgotPasswordScreen'),
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
        fontFamily:'Roboto_medium'
      },
      headerLeft: <Button transparent onPress={this._onButtonNextPress}><Icon name='ios-arrow-back' style={{ color: '#25c5df', marginLeft: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>,

    }
  };
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    return (
      <View style={{flex:1, }}>
      <View>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft} >
              <View>
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => this.handleBackScreen} />
              </View>
            </View>
            <View style={styles.headerBody} >
              <View>
                <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleResetPassword')}</Text>
              </View>
            </View>
            <View style={styles.headerRight} >
              {/* <View>
                <TouchableOpacity>
                  <View style={styles.headermapIcon} >
                    <Image source={require('../../../assets/map_icon_white.png')} style={styles.mapImg} />
                  </View>
                </TouchableOpacity>
              </View> */}
            </View>
          </View>
        </LinearGradient>
        </View>
        <View style={styles.container}>
            <View style={styles.mobouter} >
                <View style={styles.mobile}>
                    <Image source={require('../../../assets/sand-clock.png')} style={{ resizeMode:'contain', width:40,height:40, }} />
                </View>
            </View>
          <View style={styles.input}>
            <FloatingLabelInput
              label={i18n.t('lanLabelEnterYourNewPassword')}
              value=''
              minLength={6} maxLength={20}
            />
          </View>
          <View style={styles.button_main}>
              <TouchableOpacity activeOpacity={.8} onPress={() => this.handleData()}>
                <LinearGradient colors={['#025d8c', '#019fa0']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={{ padding: 15, alignItems: 'center', borderRadius: 5 }}>
                  <Text style={styles.gradientBtn}>{i18n.t('lanButtonNext')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    )
  }
}

