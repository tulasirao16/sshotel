import React from 'react';
import { StatusBar, TouchableOpacity, Image, View, AsyncStorage, TouchableHighlight, TextInput, Animated, Keyboard, Dimensions, ScrollView, BackHandler, UIManager, Platform } from 'react-native';
import { Icon, Text, Picker } from 'native-base';
import { observer, inject } from 'mobx-react';
import styles from './css/ProfileAddressCss';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from 'i18n-js';
import AwesomeButton from "react-native-really-awesome-button";
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;

@inject(['UserStore'])
@observer
export default class ProfileAddress extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    const data = navigation.state.params && navigation.state.params.data ? navigation.state.params.data : {} 
    this.state = {
      shift: new Animated.Value(0),
      address: data && data.address ? data.address : '',
      area: data && data.area ? data.area : '',
      landMark: data && data.landMark ? data.landMark : '',
      city: data && data.city ? data.city : '',
      zip: data && data.zip ? data.zip : '',
      state: data && data.state ? data.state : '',
      country: data && data.country ? data.country : 'India',
      errorMessage: ''
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  componentWillReceiveProps(newProps) {
    if(newProps.navigation.state.params && newProps.navigation.state.params.data) {
      const data = newProps.navigation.state.params && newProps.navigation.state.params.data ? newProps.navigation.state.params.data : {}
      this.setState({
        address: data && data.address ? data.address : '',
        area: data && data.area ? data.area : '',
        landMark: data && data.landMark ? data.landMark : '',
        city: data && data.city ? data.city : '',
        zip: data && data.zip ? data.zip : '',
        state: data && data.state ? data.state : '',
        country: data && data.country ? data.country : 'India'
      });
    }
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
    if (!this.state.address.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorAddressIsRequired') });
    } else {
      this.setState({ showIndicator: true })
      let userAddress = {
        address: this.state.address,
        area: this.state.area,
        landMark: this.state.landMark,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zip,
        country: this.state.country
      }
      navigation.navigate('ProfileEditScreen', { data: userAddress });
    }
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
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()}>
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle}  />
                </TouchableHighlight>
              </View>
              <View style={styles.headerBody} >
                <View>
                <Text style={styles.headerTitleStyle}> {i18n.t('lanTitleProfileAddress')} </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          <View style={styles.bodyContainer}>
            <ScrollView>
              <View style={styles.floatingInputView} >
                <FloatingLabelInput
                  label={i18n.t('lanLabelProfileAddress')}
                  value={this.state.address}
                  onChangeText={(text) => this.setState({ address: text, errorMessage: '', })}
                  returnKeyType = { 'next' }
                  onRef={(ref) => {
                    this.inputs['Address'] = ref;
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
                      this.focusNextField('Area');
                  }}  
                />
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
                      this.focusNextField('PIN Code');
                  }}
                />
              </View>
              <View style={styles.floatingInputView} >
              <Text style={ styles.dropdownLabels }>{i18n.t('lanLabelSelectCountry')} <Text style={{color: 'red'}}>*</Text></Text>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', marginTop: -5.5 }} >
                  <Picker
                    // label="Country"
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    placeholder={i18n.t('lanLabelSelectYourCountry')}
                    style={{ width: DEVICE_WIDTH-20, left: -5 }}
                    selectedValue={this.state.country}
                    onValueChange={() => {}}
                  >
                    <Picker.Item label="India" value="India" />
                  </Picker>
                </View>
              </View>
              <View style={styles.floatingInputView} >
              <Text style={ styles.dropdownLabels }>{i18n.t('lanLabelSelectState')} <Text style={{color: 'red'}}>*</Text></Text>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', marginTop: -5.5 }} >
                  <Picker
                    // label="State"
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    placeholder={i18n.t('lanLabelSelectYourState')}
                    style={{ width: DEVICE_WIDTH-20, left: -5 }}
                    selectedValue={this.state.state}
                    onValueChange={this.onStateChange.bind(this)}
                  >
                    <Picker.Item label="Andhra Pradesh" value="Andhra Pradesh" />
                    <Picker.Item label="Telangana" value="Telangana" />
                  </Picker>
                </View>
              </View>
              <View style={styles.floatingInputView} >
                <FloatingLabelInput
                  label={i18n.t('lanLabelPinCode')}
                  keyboardType='numeric'
                  maxLength={6}
                  value={this.state.zip}
                  onChangeText={(text) => this.setState({ zip: text, errorMessage: '', })}
                  returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                  onRef={(ref) => {
                    this.inputs['PIN Code'] = ref;
                  }}
                  onSubmitEditing={() => {}}
                />
              </View>
              <Text style={{ color: 'red', fontFamily: 'Roboto_medium', fontSize:13 }}>{this.state.errorMessage}</Text>
              <View style={styles.getCenterView} >
                <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                  <AwesomeButton block success
                    onPress={() => this.handleSubmit()}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} marginTop={20}>
                    <Text style={styles.BtnText} > {i18n.t('lanCommonButtonSubmit')} </Text>
                  </AwesomeButton>
                </LinearGradient>
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    );
  }
}
