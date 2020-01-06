import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Container, Content, Form, Item, Icon, Picker, Button, Text } from 'native-base';
import { View, Platform, TouchableOpacity, TouchableHighlight, Image, Dimensions, AsyncStorage, BackHandler, StatusBar } from 'react-native';
import styles from './css/PreferenceCss';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['UserStore'])
@observer
export default class PreferenceScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
      title: i18n.t('lanTitlePreference'),
      headerLeft: <Button transparent onPress={() => navigation.goBack()} ><Icon name='ios-arrow-back' style={{ marginLeft: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>,
      headerRight: <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      </View>,
    }
  };
  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    this.state = {
      authObj: {},
      defaultLanguage: '',
      defaultTimezone: '',
      defaultCurrency: '',
      dateFormat: '',
      errorMessage: '',
      submitDisabled: false,
      disableValue: false
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  async componentWillMount() {
    await AsyncStorage.getItem('authObj').then((value) => {
      let authObj = JSON.parse(value);
      this.setState({
        authObj: authObj,
        defaultLanguage: authObj.preferences.defaultLanguage,
        defaultTimezone: authObj.preferences.defaultTimezone,
        defaultCurrency: authObj.preferences.defaultCurrency,
        dateFormat: authObj.preferences.dateFormat
      });
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  onValueChange(value) {
    this.setState({
      selected: value
    });
  }
  onValueChange2(value) {
    this.setState({
      defaultLanguage: value,
      errorMessage: '',
      disableValue: true
    });
  }
  onValueChange3(value) {
    this.setState({
      defaultTimezone: value,
      errorMessage: '',
      disableValue: true
    });
  }
  onValueChange4(value) {
    this.setState({
      defaultCurrency: value,
      errorMessage: '',
      disableValue: true
    });
  }
  onValueChange5(value) {
    this.setState({
      dateFormat: value,
      errorMessage: '',
      disableValue: true
    });
  }
  handleBackButton() {
    const navigation = this.props.navigation;
    navigation.goBack()
    return true;
  }
  handleUpdate() {
    let newAuthObj = this.state.authObj
    const navigation = this.props.navigation;
    const UserStore = this.props.UserStore;
    this.setState({ submitDisabled: true })
    let postData = {
      defaultLanguage: this.state.defaultLanguage,
      defaultTimezone: this.state.defaultTimezone,
      defaultCurrency: this.state.defaultCurrency,
      dateFormat: this.state.dateFormat
    }
    let _this = this;
    _this.setState({loading: true});
    UserStore.updateProfilePreference(postData, function (resObj) {
      _this.setState({loading: false});
      if (resObj.statusCode == '0000') {
        _this.setState({ errorMessage:  i18n.t('lanErrorUpdatedSuccessfully') });
        navigation.navigate('ProfileScreen')
        newAuthObj.preferences.defaultLanguage = resObj.statusResult.preferences.defaultLanguage;
        newAuthObj.preferences.defaultTimezone = resObj.statusResult.preferences.defaultTimezone;
        newAuthObj.preferences.defaultCurrency = resObj.statusResult.preferences.defaultCurrency;
        newAuthObj.preferences.dateFormat = resObj.statusResult.preferences.dateFormat;
        AsyncStorage.setItem('authObj', JSON.stringify(newAuthObj));
      } else if (resObj.statusCode == '404') {
        _this.setState({ errorMessage:  i18n.t('lanErrorNoInternetConnection') });
      } else {
        _this.setState({ errorMessage: i18n.t('lanErrorUpdateFailed') });
      }
    })
  }
  render() {
    const navigation = this.props.navigation;
    return (
      <View>
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
              <Text style={styles.headerTitleStyle}>{i18n.t('lanTitlePreference')} </Text>
            </View>
            {/* <View style={styles.headerRight} >
              <TouchableOpacity>
                <View style={styles.headermapIcon} >
                  <Image source={require('../../../assets/map_icon_white.png')} style={styles.mapImg} />
                </View>
              </TouchableOpacity>
            </View> */}
          </View>
        </LinearGradient>
        <View style={styles.bodyContainer}>
          <View>
            <Text style={styles.pickerLabel}>{i18n.t('lanLabelLanguage')}<Text style={{ color: 'red' }}>*</Text>:</Text>
            <Form>
              <Item picker>
                <Picker
                  mode='dropdown'
                  iosIcon={<Icon name='arrow-down' />}
                  style={{ width: DEVICE_WIDTH-20 }}
                  placeholder= {i18n.t('lanLabelSelectyourLanguage')}
                  // placeholderStyle={{ color: '#bfc6ea' }}
                  placeholderIconColor='#007aff'
                  selectedValue={this.state.defaultLanguage}
                  onValueChange={this.onValueChange2.bind(this)}
                  onChangeText={(text) => this.setState({ defaultLanguage: text, errorMessage: '' })}
                >
                  {/* <Picker.Item label='Please select language' value={this.state.defaultLanguage} /> */}
                  <Picker.Item label='English' value='English' />
                  <Picker.Item label='Telugu' value='Telugu' />
                  <Picker.Item label='Hindi' value='Hindi' />
                </Picker>
              </Item>
            </Form>
          </View>
          <View>
            <Text style={styles.pickerLabel}>{i18n.t('lanLabelTimezone')}<Text style={{ color: 'red' }}>*</Text>:</Text>
            <Form>
              <Item picker>
                <Picker
                  mode='dropdown'
                  iosIcon={<Icon name='arrow-down' />}
                  style={{ width: DEVICE_WIDTH-20 }}
                  placeholder={i18n.t('lanLabelSelectyourTimezone')}
                  // placeholderStyle={{ color: '#bfc6ea' }}
                  placeholderIconColor='#007aff'
                  selectedValue={this.state.defaultTimezone}
                  onValueChange={this.onValueChange3.bind(this)}
                  onChangeText={(text) => this.setState({ defaultTimezone: text, errorMessage: '' })}
                >
                  {/* <Picker.Item label='Please select timezone' value={this.state.defaultTimezone} /> */}
                  <Picker.Item label='IST - Indian Standard Time(UTC+05:30)' value='IST' />
                  <Picker.Item label='EST - Eastern Standard Time(UTC-05:00)' value='EST' />
                  <Picker.Item label='EDT - Eastern Daylight Time(UTC-04:00)' value='EDT' />
                </Picker>
              </Item>
            </Form>
          </View>
          <View>
            <Text style={styles.pickerLabel}>{i18n.t('lanLabelCurrency')}<Text style={{ color: 'red' }}>*</Text>:</Text>
            <Form>
              <Item picker>
                <Picker
                  mode='dropdown'
                  iosIcon={<Icon name='arrow-down' />}
                  style={{ width: DEVICE_WIDTH-20 }}
                  placeholder= {i18n.t('lanLabelSelectyourCurrency')}
                  // placeholderStyle={{ color: '#bfc6ea' }}
                  placeholderIconColor='#007aff'
                  selectedValue={this.state.defaultCurrency}
                  onValueChange={this.onValueChange4.bind(this)}
                  onChangeText={(text) => this.setState({ defaultCurrency: text, errorMessage: '' })}
                >
                  {/* <Picker.Item label='Please select currency' value={this.state.defaultCurrency} /> */}
                  <Picker.Item label='INR - Indian Rupee(₹)' value='INR' />
                  <Picker.Item label='USD - US Dollar($)' value='USD' />
                  <Picker.Item label='EUR - Euro(€)' value='EUR' />
                </Picker>
              </Item>
            </Form>
          </View>
          <View>
            <Text style={styles.pickerLabel}>{i18n.t('lanLabelDateFormat')}<Text style={{ color: 'red' }}>*</Text>:</Text>
            <Form>
              <Item picker>
                <Picker
                  mode='dropdown'
                  iosIcon={<Icon name='arrow-down' />}
                  style={{ width: DEVICE_WIDTH-20 }}
                  placeholder= {i18n.t('lanLabelSelectyourDateFormat')}
                  // placeholderStyle={{ color: '#bfc6ea' }}
                  placeholderIconColor='#007aff'
                  selectedValue={this.state.dateFormat}
                  onValueChange={this.onValueChange5.bind(this)}
                  onChangeText={(text) => this.setState({ dateFormat: text, errorMessage: '' })}
                >
                  {/* <Picker.Item label='Please select dateFormat' value={this.state.dateFormat} /> */}
                  <Picker.Item label='DD-MM-YY' value='DD-MM-YY' />
                  <Picker.Item label='DD-MM-YYYY' value='DD-MM-YYYY' />
                  <Picker.Item label='DD/MM/YY' value='DD/MM/YY' />
                  <Picker.Item label='DD/MM/YYYY' value='DD/MM/YYYY' />
                  <Picker.Item label='MMM DD, YY' value='MMM DD, YY' />
                  <Picker.Item label='MMM DD, YYYY' value='MMM DD, YYYY' />
                </Picker>
              </Item>
            </Form>
            <Text style={{ color: 'red', fontSize: 13, fontFamily: 'Roboto_medium' }}>{this.state.errorMessage}</Text>
          </View>
          <View style={styles.getCenterView} >
            <LinearGradient colors={['#025d8c', '#01a4a2']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
              {/* <AwesomeButton block success
                onPress={() => this.handleUpdate()}
                width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                <Text style={styles.BtnText} > Update </Text>
              </AwesomeButton> */}
              {!this.state.submitDisabled
          ? <AwesomeButton block success
              onPress={() => this.handleUpdate()}
              width={DEVICE_WIDTH/3} height={44} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={22} marginTop={20}>
              <Text style={styles.BtnText} > {i18n.t('lanButtonUpdate')}</Text>
            </AwesomeButton>
          : <AwesomeButton block success
              disabled={true}
              onPress={() => this.handleUpdate()}
              width={DEVICE_WIDTH/3} height={44} backgroundColor='#ddd' backgroundShadow='#ddd' backgroundDarker='#ddd' paddingHorizontal={50} borderRadius={22} marginTop={20}>
            <Text style={styles.BtnText} > {i18n.t('lanButtonUpdate')} </Text>
            </AwesomeButton>
            }
            </LinearGradient>
          </View>
        </View>
      </View>
    );
  }
}