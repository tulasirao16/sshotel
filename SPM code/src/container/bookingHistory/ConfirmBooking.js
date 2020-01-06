import React from 'react';
import { observer, inject } from 'mobx-react';
import { View, Image, TextInput, ScrollView, StatusBar, TouchableHighlight, Dimensions, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Button, Text, Item, Input, Icon, Picker, Tab, Tabs, Left, Right, borderRadius } from 'native-base';
import styles from './css/CreateBookingCss';
import { LinearGradient } from 'expo-linear-gradient';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import AwesomeButton from 'react-native-really-awesome-button';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import { PUBLIC_DOMAIN } from '../../../constants';
import Toast, { DURATION } from 'react-native-easy-toast';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const { State: TextInputState } = TextInput;

@inject(['UserStore'], ['BookingStore'], ['PropertyStore'])
@observer
export default class ConfirmBooking extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    const navigation = props.navigation;
    this.state = {
      mobileNumber: '',
      email: '',
      name: '',
      errorMessage: '',
      euUserId: '',
      loading: false,
      reload: false,
      reloadFunction: '',
      sucuss:false,
      validUser: false,
      data: navigation.state.params && navigation.state.params.data ? navigation.state.params.data : {},
      bookingData: navigation.state.params && navigation.state.params.bookingData ? navigation.state.params.bookingData : {},
      bookingType:  navigation.state.params && navigation.state.params.bookingData ? navigation.state.params.bookingData.bookingType : '',
      handleBookNowButtonMobile: false,
      handleBookNowButtonEmail: false
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  handleMobile = () => {
    const UserStore = this.props.UserStore;
    // const reg = /^[0]?[56789]\d{9}$/;
    const reg = /^\d{10}$/;
    if (this.state.mobileNumber == '' || this.state.mobileNumber == 'undefined') {
      this.refs.toast.show(i18n.t('lanErrorPleaseProvideMobileNumber'));
    } else if (reg.test(this.state.mobileNumber) === false) {
      this.refs.toast.show(i18n.t('lanErrorInvalidNumberPleaseProvideAValidMobileNumber'));
    } else {
      let _this = this;
      this.setState({ loading: true });
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reload: true, reloadFunction: 'handleMobile' });
      }, 10000);
      UserStore.getUserDetails(_this.state.mobileNumber, function (resObj) {
        clearTimeout(isLoading)
        if (resObj.statusCode == '9987') {
          _this.setState({ loading: false ,euUserId: resObj.statusResult._id,  name: resObj.statusResult.name, email: resObj.statusResult.email, validUser: true, handleBookNowButtonMobile: true, handleBookNowButtonEmail: true })
        }  else {
          _this.setState({ handleBookNowButtonMobile: true, loading: false  })
        }
      })
    }
  }

  handleEmail = () => {
    const UserStore = this.props.UserStore;
    let checkText = this.state.email.includes('@')
    if (checkText === true) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (this.state.email == '' || this.state.email == 'undefined') {
        this.refs.toast.show(i18n.t('lanErrorPleaseEnterEmail'));
      } else if (reg.test(this.state.email) === false) {
        this.refs.toast.show(i18n.t('lanErrorPleaseEnterAValidEmail'));
      } else {
        let _this = this;
        this.setState({ loading: true });
        let isLoading = setTimeout(function () {
          _this.setState({ loading: false, reload: true, reloadFunction: 'handleEmail' });
        }, 10000);
        UserStore.getUserDetails(_this.state.email, function (resObj) {
          clearTimeout(isLoading)
          if (resObj.statusCode == '9987') {
            _this.setState({loading: false, euUserId: resObj.statusResult._id, name: resObj.statusResult.name, mobileNumber: resObj.statusResult.mobileNumber, validUser: true, handleBookNowButtonEmail: true, handleBookNowButtonMobile: true })
          } else {
            _this.setState({loading: false, handleBookNowButtonEmail: true })
          }
        })
      }
    } else {
      this.refs.toast.show(i18n.t('lanErrorPleaseEnterEmail'));
    }
  }

  handleBooking = () => {
    const BookingStore = this.props.BookingStore;
    const PropertyStore = this.props.PropertyStore;
    const reg = /^[0]?[6789]\d{9}$/;
    const emailreg =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let post_json = JSON.parse((JSON.stringify(this.state.bookingData) +
    JSON.stringify({ euUserId: this.state.euUserId, name: this.state.name, contactEuNumber: this.state.mobileNumber, euEmail: this.state.email, validUser: this.state.validUser }))
    .replace(/}{/g, ','))
    if(!this.state.mobileNumber || reg.test(this.state.mobileNumber) === false) {
      this.refs.toast.show(i18n.t('lanErrorPleaseProvideAValidMobileNumber'));
      // this.setState({ errorMessage: 'Please provide a valid mobile number' })
    } else if(!this.state.email || emailreg.test(this.state.email) === false) {
      this.refs.toast.show(i18n.t('lanErrorPleaseProvideAValidEmail'));
      // this.setState({ errorMessage: 'Please provide a valid email' })
    } else if(!this.state.validUser && !this.state.handleBookNowButtonMobile) {
      this.refs.toast.show(i18n.t('lanErrorPleaseClickOnMobileNumberGetDetailsToGetUserDetails'));
      // alert('Please click on mobile number get details to get user details');
    } else if(!this.state.validUser && !this.state.handleBookNowButtonEmail) {
      this.refs.toast.show(i18n.t('lanErrorPleaseClickOnEmailGetDetailsToGetUserDetails'));
      // alert('Please click on email get details to get user details');
    } else if(!this.state.name.trim()) {
      this.refs.toast.show(i18n.t('lanErrorPleaseProvideAName'));
      // this.setState({ errorMessage: 'Please provide a name' })
    } else if (this.state.validUser === true) {
      let _this = this;
      this.setState({ loading: true });
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reload: true, reloadFunction: 'handleBooking' });
      }, 20000);
      BookingStore.setEndUserBooking(post_json, function (resObj) {
        if (resObj.statusCode == '0000') {
          PropertyStore.getSPBookings(1,  'all', '', function (resObj) {
            clearTimeout(isLoading)
            if (resObj.statusCode == '0000') {
              PropertyStore.BookingData = resObj.statusResult.bookingData;
              PropertyStore.BookingListingDataCount = resObj.statusResult.totalDocs; 
              _this.setState({ sucuss: true, loading: false })
              _this.refs.toast.show(i18n.t('lanErrorRoomBookedSuccessfully'));
              _this.props.navigation.navigate('BookingHistoryListScreen')  
            } else {
              _this.setState({ loading: false });
            }
          });
        } else if (resObj.statusCode == '1017') {
          clearTimeout(isLoading)
          _this.setState({ loading: false });
          alert(resObj.statusMessage)
        } else {
          clearTimeout(isLoading)
          _this.setState({ loading: false });
          _this.refs.toast.show(i18n.t('lanErrorBookingFailedTryAgain'));
        }
      })

    } else if(this.state.validUser === false) {
      let _this = this;
      this.setState({ loading: true });
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reload: true, reloadFunction: 'handleBooking' });
      }, 20000);
      BookingStore.setEndUserBooking(post_json, function (resObj) {
        if (resObj.statusCode == '0000') {
          PropertyStore.getSPBookings(1,  'all', '', function (resObj) {
            clearTimeout(isLoading)
            _this.setState({ loading: false })
            if (resObj.statusCode == '0000') {
              PropertyStore.BookingData = resObj.statusResult.bookingData;
              PropertyStore.BookingListingDataCount = resObj.statusResult.totalDocs; 
              _this.props.navigation.navigate('BookingHistoryListScreen')  
            }
           });
        } else if (resObj.statusCode == '1017') {
          clearTimeout(isLoading)
          _this.setState({ loading: false })
          alert(resObj.statusMessage)
        } else {
          clearTimeout(isLoading)
          _this.setState({ loading: false })
          _this.refs.toast.show(i18n.t('lanErrorBookingFailedTryAgain'));
        }
      })
    } else {
      this.refs.toast.show(i18n.t('lanErrorPleaseProvideUserNameAndMobileNumberToBook'));
    }
  } 
  setMobileNumber = (mobileNumber) => {
      this.setState({ mobileNumber: mobileNumber, errorMessage: '' })
    if(this.state.mobileNumber.length >= 9) {
      this.refs.toast.show(i18n.t('lanErrorPleaseClickOnGetDetailsToGetUserDetails'));
      // alert('Please click on get details to get user details')
    }
  }
  setEmail = (email) => {
    if(this.state.handleBookNowButtonMobile == false) {
      this.refs.toast.show(i18n.t('lanErrorPleaseClickOnMobileNumberGetDetailsToGetUserDetails'));
      // alert('Please click on mobile number get details to get user details');
      this.setState({ email: email, errorMessage: '' })
    } else {
      this.setState({ email: email, errorMessage: '' })
    }
  }
  setName = (name) => {
    if(this.state.validUser == false && this.state.handleBookNowButtonMobile == false) {
      this.refs.toast.show(i18n.t('lanErrorPleaseClickOnMobileNumberGetDetailsToGetUserDetails'));
      // alert('Please click on mobile number get details to get user details');
      this.setState({ name: name, errorMessage: '' });
    } else if(this.state.validUser == false && this.state.handleBookNowButtonEmail == false) {
      this.refs.toast.show(i18n.t('lanErrorPleaseClickOnEmailGetDetailsToGetUserDetails'));
      // alert('Please click on email get details to get user details');
      this.setState({ name: name, errorMessage: '' });
    } else {
      this.setState({ name: name, errorMessage: '' })
    }
  }
  handleReload = () => {
    switch(this.state.reloadFunction) {
      case 'handleMobile':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleMobile()
        break;
      case 'handleEmail':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleEmail()
        break;
      case 'handleBooking':
        this.setState({ reload: false, reloadFunction: ''})
        this.handleBooking()
        break;
      default:
        break;
    }
  }

  render() {
    const navigation = this.props.navigation;
    const data = navigation.state.params && navigation.state.params.data ? navigation.state.params.data : [];
    const BookingStore = this.props.BookingStore;
    const UserStore = this.props.UserStore;
    const PropertyStore = this.props.PropertyStore;
    return (
    !this.state.reload
      ?<View style={styles.container}>
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
              <Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitleStyle}>{i18n.t('lanTitleConfirmBooking')} </Text>
            </View>
          </View>
        </LinearGradient>
        {this.state.loading
        ? <View style={styles.activeIndicatorView}><ActivityIndicator size='large' color='#fff' style={ styles.activeIndicatorStyle } /></View>
        : null }
        <View style={styles.bodyContainer} >
          <ScrollView>
            <View style={styles.content}>
              <View style={styles.details} >
                <TouchableOpacity onPress={this.handleMobile}><Text style={styles.details_text}>{i18n.t('lanButtonGetDetails')}</Text></TouchableOpacity>
              </View>
              <View style={styles.floatingInputOneView} >
                <FloatingLabelInput
                  label={i18n.t('lanLabelMobileNumber')}
                  keyboardType='numeric'
                  maxLength={10}
                  value={this.state.mobileNumber}
                  onChangeText={(Mobile) => this.setMobileNumber(Mobile)}
                  returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                  onRef={(ref) => {
                    this.inputs['Mobile Number'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('Email');
                  }} 
                />
              </View>

              <View style={styles.floatingInputOneView} >
                <View style={styles.details} >
                  <TouchableOpacity onPress={this.handleEmail}><Text style={styles.details_text}>{i18n.t('lanButtonGetDetails')}</Text></TouchableOpacity>
                </View>
                <FloatingLabelInput
                  label={i18n.t('lanLabelEmail')}
                  keyboardType='email-address'
                  value={this.state.email}
                  onChangeText={(email) => this.setEmail(email)}
                  returnKeyType = { 'next' }
                  onRef={(ref) => {
                    this.inputs['Email'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('Name');
                  }} 
                />
              </View>

              <View style={styles.floatingInputOneView} >
                <FloatingLabelInput
                  label={i18n.t('lanLabelName')}
                  keyboardType='default'
                  value={this.state.name}
                  onChangeText={(name) => this.setName(name)}
                  onRef={(ref) => {
                    this.inputs['Name'] = ref;
                  }}
                  onSubmitEditing={() => {
                      // this.focusNextField('Name');
                  }} 
                />
              </View>
            </View>
            <Text style={{color: 'red', fontSize: 20}}>{this.state.errorMessage}</Text>
            {!this.state.name && !this.state.errorMessage && this.state.validUser == false && this.state.handleBookNowButtonMobile == true && this.state.handleBookNowButtonEmail == true
             ? <Text style={{color: 'red', fontFamily: 'Roboto_medium', fontSize: 12, textAlign:'center'}}>{i18n.t('lanUserDetailsNotFoundToCreateANewUserAndConfirmThisBookingClickOnBookNow')}</Text>
             : null
            }
            <View style={styles.btnModal} >
              <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                <AwesomeButton block success
                  onPress={this.handleBooking}
                  width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} marginTop={20} >
                  <Text style={styles.BtnText}> {i18n.t('lanButtonBookNow')} </Text>
                </AwesomeButton>
              </LinearGradient>
            </View>
            <Toast
              ref='toast'
              style= {this.state.sucuss ? { backgroundColor: '#008000', width: '100%', borderRadius:0, padding: 10, } : { backgroundColor: '#ff0000', width: '100%', borderRadius:0, padding: 10, }}
              position='top'
              positionValue={170}
              fadeInDuration={750}
              fadeOutDuration={1000}
              // opacity={0.8}
              textStyle={{ color:'white', fontFamily: 'Roboto_medium' }}
            />
          </ScrollView>
        </View>
      </View>
       : <View>
        <LinearGradient colors={['#01A4A2', '#025D8C']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <View style={styles.headerMainViewReload} >
            <View style={styles.headerLeftReload} >
              <TouchableOpacity>
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => navigation.goBack()} />
              </TouchableOpacity>
            </View>
            <View style={styles.headerBodyReload} >
              <TouchableOpacity>
                <Text style={styles.headerTitleStyle1}>{i18n.t('lanAppTitle')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        <View style={{ jflex:1, justifyContent:'center', alignItems:'center', width:DEVICE_WIDTH - 20, height:Device_Height - 150}} >
          <View style={ styles.eachBtnView } >
            <LinearGradient colors={['#01A4A2', '#025D8C']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
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