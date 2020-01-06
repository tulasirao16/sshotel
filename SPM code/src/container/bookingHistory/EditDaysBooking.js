import React from 'react';
import { observer, inject } from 'mobx-react';
import { View, Image, TextInput, ScrollView, StatusBar, Dimensions, TouchableOpacity, ActivityIndicator, BackHandler, TouchableHighlight } from 'react-native';
import { Button, Text, Picker, LabelList, ListItem, Item, Input, Icon, Tab, Tabs, Left, Right, borderRadius } from 'native-base';
// import styles from './css/BookingHistoryViewCss';
import styles from './css/BookingEditCss';
import { LinearGradient } from 'expo-linear-gradient';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import AwesomeButton from 'react-native-really-awesome-button';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import { PUBLIC_DOMAIN } from '../../../constants';
import Modal from 'react-native-modal';
import i18n from 'i18n-js';
import Toast, { DURATION } from 'react-native-easy-toast';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const { State: TextInputState } = TextInput;

@inject(['UserStore'], ['BookingStore'], ['PropertyStore'])
@observer
export default class EditDaysBooking extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    const bookingData = navigation.state.params.bookingData;
    const BookingStore = this.props.BookingStore;
    let checkInHours = moment(bookingData.checkInDate).format('hh')
    let checkOutHours = moment(bookingData.checkOutDate).format('hh')
    let checkInMinutes = moment(bookingData.checkInDate).format('mm')
    let checkOutMinutes = moment(bookingData.checkOutDate).format('mm')
    let checkInMeridiem = moment(bookingData.checkInDate).format('A')
    let checkOutMeridiem = moment(bookingData.checkOutDate).format('A')
    let checkInDate = moment(bookingData.checkInDate).format('YYYY-MM-DD')
    let checkOutDate = moment(bookingData.checkOutDate).format('YYYY-MM-DD')
    this.state = {
      bookingData: bookingData ? bookingData : {},
      errorMessage: '',
      isloading: false,    
      reload: false,
      reloadFunction: '', 
      euName: bookingData && bookingData.euName ? bookingData.euName : '',
      euMobileNumber: bookingData && bookingData.euMobileNumber ? bookingData.euMobileNumber : '',
      adults: bookingData && bookingData.noOfAdults ? bookingData.noOfAdults : 2,
      childs: bookingData && bookingData.noOfChilds ? bookingData.noOfChilds : 0,
      rooms: bookingData && bookingData.noOfRooms ? bookingData.noOfRooms : 1,
      totalDays: bookingData && bookingData.totalDays ? bookingData.totalDays : 1,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      bookingStatus: bookingData && bookingData.bookingStatus ? bookingData.bookingStatus : '',
      lifeCyclebookingStatus: bookingData && bookingData.bookingStatus ? bookingData.bookingStatus : '',
      paymentMode: bookingData && bookingData.paymentMode ? bookingData.paymentMode : 'Please Select',
      previousPrice: bookingData.totalPrice,
      totalPrice: 0,
      paymentStatus: bookingData && bookingData.paymentStatus ? bookingData.paymentStatus : '',
      roomSubButton: false,
      bookingType: 'Days',
      checkInTime: checkInHours+ ':' + checkInMinutes+ ' '+ checkInMeridiem,
      checkOutTime: checkOutHours+ ':' + checkOutMinutes+ ' '+ checkOutMeridiem,
      isVisible: false,
      checkInHours: checkInHours,
      checkInMinutes: checkInMinutes,
      meridiem: checkInMeridiem,
      dummybookingStatus: bookingData && bookingData.bookingStatus ? bookingData.bookingStatus : '',
      totalHours: 0,
      buttonDisable: false
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    this.handleAdultsIncrease = this.handleAdultsIncrease.bind(this)
    this.handleAdultsDecrease = this.handleAdultsDecrease.bind(this)
    this.handleChildsIncrease = this.handleChildsIncrease.bind(this)
    this.handleChildsDecrease = this.handleChildsDecrease.bind(this)
    this.handleRooms = this.handleRooms.bind(this)
    this.handleDaysAmount = this.handleDaysAmount.bind(this)
    this.handleCheckInDate = this.handleCheckInDate.bind(this)
    this.handleCheckOutDate = this.handleCheckOutDate.bind(this)
    this.getNumOfDays = this.getNumOfDays.bind(this)
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  handleBackButtonClick() {
    const navigation = this.props.navigation
    navigation.goBack()
    return true
  }
  handleAdultsIncrease (membersCapacity, childsCapacity) {
    let addValue = (this.state.adults + 1) + (this.state.childs)
    let numOfAdults = (this.state.adults) + 1
    this.setState({ adults: numOfAdults })
    let totalCapacity = parseInt(membersCapacity) + parseInt(childsCapacity)
    let RoomCount = (numOfAdults / membersCapacity)
    let TotalRoomCount = (addValue / totalCapacity)
    let index = RoomCount % 1
    let totalIndex = TotalRoomCount % 1
    if (RoomCount > TotalRoomCount) {
      if (index === 0) {
        this.setState({ rooms: RoomCount })
      } else {
        let addRoomCount = (RoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: addValue })
      }
    } else {
      if (totalIndex === 0) {
        this.setState({ rooms: TotalRoomCount })
      } else {
        let addRoomCount = (TotalRoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: addValue })
      }
    }
    this.handleDaysAmount(this.state.checkInDate)
  }
  handleAdultsDecrease (membersCapacity, childsCapacity) {
    let addValue = (this.state.adults - 1) + (this.state.childs)
    let numOfAdults = (this.state.adults) - 1
    this.setState({ adults: numOfAdults })
    let totalCapacity = parseInt(membersCapacity) + parseInt(childsCapacity)
    let RoomCount = (numOfAdults / membersCapacity)
    let TotalRoomCount = (addValue / totalCapacity)
    let totalIndex = TotalRoomCount % 1
    let index = RoomCount % 1
    if (RoomCount > TotalRoomCount) {
      if (index === 0) {
        this.setState({ rooms: RoomCount })
      } else {
        let addRoomCount = (RoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: addValue })
      }
    } else {
      if (totalIndex === 0) {
        this.setState({ rooms: TotalRoomCount })
      } else {
        let addRoomCount = (TotalRoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: addValue })
      }
    }
    this.handleDaysAmount(this.state.checkInDate)
  }
  handleChildsIncrease (membersCapacity, childsCapacity) {
    let adultsCapacity = this.state.adults
    let addValue = (this.state.childs + 1) + this.state.adults
    let numOfChildren = (this.state.childs) + 1
    this.setState({ childs: numOfChildren })
    let totalCapacity = parseInt(membersCapacity) + parseInt(childsCapacity)
    let RoomCount = (adultsCapacity / membersCapacity)
    let TotalRoomCount = (addValue / totalCapacity)
    let totalIndex = TotalRoomCount % 1
    let index = RoomCount % 1
    if (RoomCount > TotalRoomCount) {
      if (index === 0) {
        this.setState({ rooms: RoomCount })
      } else {
        let addRoomCount = (RoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: addValue })
      }
    } else {
      if (totalIndex === 0) {
        this.setState({ noOfRooms: TotalRoomCount })
      } else {
        let addRoomCount = (TotalRoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: addValue })
      }
    }
    this.handleDaysAmount(this.state.checkInDate)
  }
  handleChildsDecrease (membersCapacity, childsCapacity) {
    let addValue = (this.state.childs - 1) + (this.state.adults)
    let numOfChildren = (this.state.childs) - 1
    this.setState({ childs: numOfChildren })
    let totalCapacity = parseInt(membersCapacity) + parseInt(childsCapacity)
    let RoomCount = (this.state.adults / membersCapacity)
    let TotalRoomCount = (addValue / totalCapacity)
    let totalIndex = TotalRoomCount % 1
    let index = RoomCount % 1

    if (RoomCount > TotalRoomCount) {
      if (index === 0) {
        this.setState({ rooms: RoomCount })
      } else {
        let addRoomCount = (RoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: addValue })
      }
    } else {
      if (totalIndex === 0) {
        this.setState({ rooms: TotalRoomCount })
      } else {
        let addRoomCount = (TotalRoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: addValue })
      }
    }
    this.handleDaysAmount(this.state.checkInDate)
  }
  handleRooms (status, membersCapacity, childsCapacity) {
    let numOfPeople = this.state.adults + this.state.childs
    let noOfAdults = this.state.adults
    let totalCapacity = parseInt(membersCapacity) + parseInt(childsCapacity)
    let RoomCount = (noOfAdults / parseInt(membersCapacity))
    let TotalRoomCount = (numOfPeople / totalCapacity)
    let totalIndex = TotalRoomCount % 1
    let index = RoomCount % 1
    let roomsCount = (index === 0) ? RoomCount : parseInt(RoomCount.toString().split('.')[0]) + 1
    let totalRoomsCount = (totalIndex === 0) ? TotalRoomCount : parseInt(TotalRoomCount.toString().split('.')[0]) + 1
    if (status === 'add') {
      var addRoom = (this.state.rooms) + (1)
      this.setState({ rooms: addRoom })
    } else {
      let subRoom = (this.state.rooms) - (1)
      if (subRoom < roomsCount || subRoom < totalRoomsCount) {
      } else {
        let subRoom = (this.state.rooms) - (1)
        this.setState({ rooms: subRoom })
      }
    }
    this.handleDaysAmount(this.state.checkInDate)
  }
  handleDaysAmount (checkInDate) {
    let propertyInfoData = this.state.bookingData
    let pricing = propertyInfoData.spPropertyInfoId.pricing
    let checkInDateFormat = moment(checkInDate).format('YYYY-MM-DD')
    let dt = moment(checkInDateFormat, 'YYYY-MM-DD HH:mm:ss')
    let dateName = dt.format('dddd')
    let weekEnd = dateName === 'Saturday' || dateName === 'Sunday'
    if (weekEnd) {
      this.setState({ totalPrice: pricing.weekEndTotalPrice })
    } else {
      this.setState({ totalPrice: pricing.totalPrice })
    }
  }
  handleCheckInDate (checkInDate) {
    let checkInDateValue = moment(checkInDate, 'YYYY-MM-DD').valueOf()
    let checkOutDate = moment(this.state.checkOutDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
    let checkOutDateValue = moment(checkOutDate, 'YYYY-MM-DD').valueOf()
    if (checkInDateValue >= checkOutDateValue) {
      this.setState({ checkInDate: new Date(checkInDate), checkOutDate: new Date(moment(checkInDate).add(1, 'day').format('YYYY-MM-DD')) })
      this.getNumOfDays(checkInDate, new Date(moment(checkInDate).add(1, 'day').format('YYYY-MM-DD')))
      this.handleDaysAmount(new Date(checkInDate))
    } else {
      this.setState({ checkInDate: new Date(checkInDate) })
      this.getNumOfDays(checkInDate, this.state.checkOutDate)
      this.handleDaysAmount(new Date(checkInDate))
    }
  }
  handleCheckOutDate (checkOutDate) {
    let checkInDateValue = moment(this.state.checkInDate, 'YYYY-MM-DD').valueOf()
    let checkOutDateValue = moment(checkOutDate, 'YYYY-MM-DD').valueOf()
    if (checkOutDateValue < checkInDateValue) {
      // alert(i18n.t('lanErrorCheckOutDateShouldNotBeLessThanCheckInDate'))
      this.refs.toast.show(i18n.t('lanErrorCheckOutDateShouldNotBeLessThanCheckInDate'));
    } else {
      this.setState({ checkOutDate: new Date(checkOutDate) })
      this.getNumOfDays(this.state.checkInDate, new Date(checkOutDate))
      this.handleDaysAmount(this.state.checkInDate)
    }
  }
  getNumOfDays (checkInDate, checkOutDate) {
    var checkIn = moment.utc(checkInDate)
    var checkOut = moment.utc(checkOutDate)
    var duration = moment.duration(checkOut.diff(checkIn))
    var days = duration.asDays()
    var hours = duration.asHours()
    this.setState({ totalDays: days === 0 ? 1 : days, totalHours: hours })
  }
  handleUpdate = () => {
    this.setState({ buttonDisable: true })
    const navigation = this.props.navigation;
    const bookingData = this.state.bookingData;
    const BookingStore = this.props.BookingStore;
    const PropertyStore = this.props.PropertyStore;
    let checkInHours = moment(this.state.checkInTime, ['h:mm A']).format('HH:mm')
    let checkOutHours = moment(this.state.checkOutTime, ['h:mm A']).format('HH:mm')
    // const reg = /^[0]?[6789]\d{9}$/;
    const reg = /^\d{10}$/;
    // let bookingData = this.state.bookingData
    let bookingDataCheckInDate = moment(bookingData.checkInDate).format('YYYY-MM-DD')
    let bookingDataCheckOutDate = moment(bookingData.checkOutDate).format('YYYY-MM-DD')
    let checkInDate = moment(this.state.checkInDate).format('YYYY-MM-DD')
    let checkOutDate = moment(this.state.checkOutDate).format('YYYY-MM-DD')
    if (bookingData.noOfAdults == this.state.adults && bookingData.noOfChilds == this.state.childs && bookingData.noOfRooms == this.state.rooms && bookingData.totalDays == this.state.totalDays
      && bookingDataCheckInDate == checkInDate && bookingDataCheckOutDate == checkOutDate && bookingData.bookingStatus == this.state.bookingStatus
      && bookingData.totalPrice == this.state.previousPrice && bookingData.paymentStatus == this.state.paymentStatus && bookingData.paymentMode == this.state.paymentMode) {
      navigation.navigate('BookingHistoryListScreen')
    } else if (this.state.paymentStatus === 'Paid' && this.state.paymentMode === 'Please Select') {
      this.setState({ buttonDisable: false })
      // alert(i18n.t('lanErrorPleaseSelectPaymentMode'))
      this.refs.toast.show(i18n.t('lanErrorPleaseSelectPaymentMode'));
    } else if (this.state.paymentStatus === 'Pending' && this.state.paymentMode !== 'Please Select') {
      this.setState({ buttonDisable: false })
      // alert(i18n.t('lanErrorSelectPaymentMode'))
      this.refs.toast.show(i18n.t('lanErrorSelectPaymentMode'));
    } else {
      // this.setState({ buttonDisable: true })
      let checkInHours = moment(this.state.checkInTime, ['h:mm A']).format('HH:mm')
      let checkOutHours = moment(this.state.checkOutTime, ['h:mm A']).format('HH:mm')
      let cidt = moment(this.state.checkInDate).format('YYYY-MM-DD')
      let codt = moment(this.state.checkOutDate).format('YYYY-MM-DD')
      let put_json = {
        bookingCode: bookingData.bookingCode,
        euName: bookingData.euUserId.name,
        euMobileNumber: bookingData.euUserId.mobileNumber,
        noOfAdults: this.state.adults,
        noOfChilds: this.state.childs.toString(),
        noOfRooms: this.state.rooms,
        totalDays: this.state.totalDays,
        checkInDate: cidt + ' ' + checkInHours,
        checkOutDate: codt + ' ' + checkOutHours,
        bookingStatus: this.state.bookingStatus,
        paymentMode: this.state.paymentMode,
        totalPrice: this.state.totalPrice == 0 ? this.state.previousPrice : (this.state.rooms) * (this.state.totalDays) * (this.state.totalPrice),
        paymentStatus: this.state.paymentStatus,
        lifeCyclebookingStatus: this.state.bookingStatus,
        bookingType: 'Days',
        totalHours: this.state.totalHours,
        pricing: bookingData.spPropertyInfoId.pricing
      }
      let _this = this;
      this.setState({ isloading: true });      
      let loading = setTimeout(function () {
        _this.setState({ isloading: false });
      }, 20000);
      BookingStore.putEndUserBooking(put_json, function (resObj) {
        if (resObj.statusCode == '0000') {
          PropertyStore.getSPBookings(1,  'all', '', function (resObj) {
            clearTimeout(loading)
            _this.setState({ isloading: false })
            if (resObj.statusCode == '0000') {
               PropertyStore.BookingData = resObj.statusResult.bookingData;
               PropertyStore.BookingListingDataCount = resObj.statusResult.totalDocs; 
               _this.setState({ buttonDisable: false })
               _this.props.navigation.navigate('BookingHistoryListScreen')  
             };
            //  _this.props.navigation.navigate('BookingHistoryListScreen') 
           });
        } else {
          clearTimeout(loading)
          _this.setState({ isloading: false, buttonDisable: false })
          // alert(i18n.t('lanErrorBookingUpdateFailedTryAgain'))
          _this.refs.toast.show(i18n.t('lanErrorBookingUpdateFailedTryAgain'));
        }
      })
    }
  }
  render() {
    const navigation = this.props.navigation;
    const bookingData = navigation.state.params && navigation.state.params.bookingData ? navigation.state.params.bookingData : [];
    const BookingStore = this.props.BookingStore;
    const PropertyStore = this.props.PropertyStore;
    return (
      <View style={styles.container}>
      {!this.state.reload
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
              <Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitleStyle}>{i18n.t('lanTitleEditBooking')}</Text>
            </View>
          </View>
        </LinearGradient>
          {this.state.isloading 
            ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#ffffff' size='large' style={ styles.activeIndicatorStyle } /></View>
            : null}  
        <View style={styles.content} >
          <ScrollView>
            {/* <View className={styles.content}> */}
              <View style={styles.floatingInputView}>
                <View style={{flex:2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelBookingCode')}</Text>
                </View>
                <View style={{flex:3 }}>
                  <Text style={[styles.textGap, styles.regularTextFontSize, styles.regularFontStyle]}>{bookingData.bookingCode}</Text>
                </View>
              </View>
              <View style={styles.floatingInputView}>
                <View style={{flex:2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelBookedBy')}</Text>
                </View>
                <View style={{flex:3 }}>
                  <Text style={[styles.textGap, styles.regularTextFontSize, styles.regularFontStyle]}>{bookingData.euName}</Text>
                </View>
              </View>
              <View style={styles.floatingInputView}>
                <View style={{flex:2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelMobile')}</Text>
                </View>
                <View style={{flex:3 }}>
                  <Text style={[styles.textGap, styles.regularTextFontSize, styles.regularFontStyle]}>{bookingData.euMobileNumber}</Text>
                </View>
              </View>
              <View style={styles.parentView} >
                <View style={styles.labelView}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelNoOfAdults')}</Text>
                </View>
                <View style={styles.minusView}>
                  <TouchableOpacity style={styles.minusCircle}
                    disabled={this.state.adults <= 1 ? true : false} onPress={() => this.handleAdultsDecrease(bookingData.spPropertyInfoId.membersCapacity, bookingData.spPropertyInfoId.childsCapacity)}
                    ><Icon name='ios-remove' style={styles.plusIcon} />
                  </TouchableOpacity>
                </View>
                <View style={styles.ValueView}>
                  <Text style={[styles.textGap, styles.mediumTextFontSize, styles.regularFontStyle]}>{this.state.adults}</Text>
                </View>
                <View style={styles.plusView}>
                  <TouchableOpacity style={styles.plusCircle}
                    disabled={parseInt(this.state.adults) > ((bookingData.spPropertyInfoId.activeRoomsCount) * (bookingData.spPropertyInfoId.membersCapacity) - 1) || (parseInt(this.state.adults) + parseInt(this.state.childs) > ((bookingData.spPropertyInfoId.activeRoomsCount) * (parseInt(bookingData.spPropertyInfoId.membersCapacity) + parseInt(bookingData.spPropertyInfoId.childsCapacity)) - 1)) ? true : false}
                    onPress={() => this.handleAdultsIncrease(bookingData.spPropertyInfoId.membersCapacity, bookingData.spPropertyInfoId.childsCapacity)}
                    ><Icon name='ios-add' style={styles.plusIcon} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.parentView} >
                <View style={styles.labelView}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelNoOfChilds')}</Text>
                </View>
                <View style={styles.minusView}>
                  <TouchableOpacity style={styles.minusCircle}
                    disabled={this.state.childs <= 0 ? true : false} onPress={() => this.handleChildsDecrease(bookingData.spPropertyInfoId.membersCapacity, bookingData.spPropertyInfoId.childsCapacity)}
                  ><Icon name='ios-remove' style={styles.plusIcon} /></TouchableOpacity>
                </View>
                <View style={styles.ValueView}>
                  <Text style={[styles.textGap, styles.mediumTextFontSize, styles.regularFontStyle]}>{this.state.childs}</Text>
                </View>
                <View style={styles.plusView}>
                  <TouchableOpacity style={styles.plusCircle}
                    disabled={(parseInt(this.state.childs) > (bookingData.spPropertyInfoId.activeRoomsCount) * (bookingData.spPropertyInfoId.childsCapacity) - 1) && (parseInt(this.state.adults) > (bookingData.spPropertyInfoId.activeRoomsCount) * (bookingData.spPropertyInfoId.membersCapacity) - 1) || (parseInt(this.state.adults) + parseInt(this.state.childs) > ((bookingData.spPropertyInfoId.activeRoomsCount) * (parseInt(bookingData.spPropertyInfoId.membersCapacity) + parseInt(bookingData.spPropertyInfoId.childsCapacity)) - 1)) ? true : false}
                    onPress={() => this.handleChildsIncrease(bookingData.spPropertyInfoId.membersCapacity, bookingData.spPropertyInfoId.childsCapacity)}
                  ><Icon name='ios-add' style={styles.plusIcon} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.parentView} >
                <View style={styles.labelView}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelNoOfRooms')}</Text>
                </View>
                <View style={styles.minusView}>
                  <TouchableOpacity
                    style={styles.minusCircle}
                    disabled={this.state.roomSubButton || this.state.rooms <= 1 ? true : false} onPress={() => this.handleRooms('sub', bookingData.spPropertyInfoId.membersCapacity, bookingData.spPropertyInfoId.childsCapacity)}
                  >
                    <Icon name='ios-remove' style={styles.plusIcon} />
                  </TouchableOpacity>
                </View>
                <View style={styles.ValueView}>
                  <Text style={[styles.textGap, styles.mediumTextFontSize, styles.regularFontStyle]}>{this.state.rooms}</Text>
                </View>
                <View style={styles.plusView} >
                  <TouchableOpacity style={styles.plusCircle}
                    disabled={bookingData.spPropertyInfoId.activeRoomsCount <= this.state.rooms ? true : false} onPress={() => this.handleRooms('add', bookingData.spPropertyInfoId.membersCapacity, bookingData.spPropertyInfoId.childsCapacity)}
                  ><Icon name='ios-add' style={styles.plusIcon} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.floatingInputView}>
                <View style={{flex:2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelTotalDays')}</Text>
                </View>
                <View style={{flex:3 }}>
                  <Text style={[styles.textGap, styles.mediumTextFontSize, styles.regularFontStyle]}>  {this.state.totalDays}</Text>
                </View>
              </View>
              <View style={styles.floatingInputView}>
                <View style={{flex:2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelCheckIn')}</Text>
                </View>
                <View style={{flex:3 }}>
                  <DatePicker
                    style={styles.DatePickerView}
                    date={moment(this.state.checkInDate).format('YYYY-MM-DD')}
                    mode='date'
                    placeholder='18, May2019'
                    placeholderColor='#333'
                    format='YYYY-MM-DD'
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
                        marginLeft: 36,
                        alignItems: 'flex-start',
                        borderWidth: 0,
                        color: '#9a9a9a',
                        fontSize: 14,
                        fontFamily: 'Roboto_medium',
                      },
                      dateText: {
                        color: '#333',
                        fontSize: 16,
                        fontFamily: 'Roboto_medium',
                      }
                    }}
                    onDateChange={(date) => { this.handleCheckInDate(date) }}
                  />
                </View>
              </View>
              <View style={styles.floatingInputView}>
                <View style={{flex:2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelCheckOut')}</Text>
                </View>
                <View style={{flex:3 }}>
                  <DatePicker
                    style={styles.DatePickerView}
                    date={moment(this.state.checkOutDate).format('YYYY-MM-DD')}
                    mode='date'
                    minDate={moment(this.state.checkInDate).add(1, 'days').format('YYYY-MM-DD')}
                    placeholder='18, May2019'
                    placeholderColor='#333'
                    format='YYYY-MM-DD'
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
                        marginLeft: 36,
                        alignItems: 'flex-start',
                        borderWidth: 0,
                        color: '#9a9a9a',
                        fontSize: 14,
                        fontFamily: 'Roboto_medium',
                      },
                      dateText: {
                        color: '#333',
                        fontSize: 16,
                        fontFamily: 'Roboto_medium',
                      }
                    }}
                    onDateChange={(date) => { this.handleCheckOutDate(date) }}
                  />
                </View>
              </View>
              <View style={styles.floatingInputView}>
                <View style={{flex:2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelCheckInTime')}</Text>
                </View>
                <View style={{flex:3 }}>
                  <TouchableOpacity> 
                    <Text style={{color: '#333', fontSize: 14, fontFamily: 'Roboto_medium', marginLeft:36, paddingVertical:8, }}>{this.state.checkInTime}</Text>
                    {/* <View style={styles.clockIcon}>
                      <Icon name='ios-clock' />
                    </View> */}
                  </TouchableOpacity>
                  </View>
              </View>
              <View style={styles.floatingInputView}>
                <View style={{flex:2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelCheckOutTime')}</Text>
                </View>
                <View style={{flex:3 }}>
                  <Text style={{color: '#333', fontSize: 14, fontFamily: 'Roboto_medium', marginLeft:36, paddingVertical:8, }}>{this.state.checkOutTime}</Text>
                  {/* <View style={styles.clockIcon}>
                    <Icon name='ios-clock' />
                  </View> */}
                </View>
              </View>
              <View style={styles.floatingInputView}>
                <View style={{flex:2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelStatus')}</Text>
                </View>
                <View style={{flex:3, marginTop:-8 }}>
                <Picker
                    mode='dropdown'
                    iosIcon={<Icon name='ios-arrow-down' />}
                    style={{ width: '100%', height:50,  }}
                    selectedValue={this.state.bookingStatus}
                    onValueChange={(itemValue, itemIndex) =>
                    this.setState({ bookingStatus: itemValue })
                  }>
                    <Picker.Item label='Booked' value='Booked' />
                    <Picker.Item label='Confirmed' value='Confirmed' />
                    <Picker.Item label='Checked-In' value='Checked-In' />
                    <Picker.Item label='Checked-Out' value='Checked-Out' />
                    <Picker.Item label='Completed' value='Completed' />
                  </Picker>
                </View>
              </View>
              <View style={styles.floatingInputView}>
                <View style={{flex:2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelPaymentMode')}</Text>
                </View>
                <View style={{flex:3, marginTop:-8  }}>
                  <Picker
                    mode='dropdown'
                    iosIcon={<Icon name='ios-arrow-down' />}
                    style={{ height: 50, width: '100%',   }}
                    selectedValue={this.state.paymentMode}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ paymentMode: itemValue })
                    }>
                    <Picker.Item label='Please Select' value='Please Select' />
                    <Picker.Item label='Payed At Hotel' value='Payed At Hotel' />
                    <Picker.Item label='Credit/Debit' value='Credit/Debit' />
                    <Picker.Item label='PAYTM' value='PAYTM' />
                    <Picker.Item label='Mobile Wallet' value='Mobile Wallet' />
                  </Picker>
                </View>
              </View>
              <View style={styles.floatingInputView}>
                <View style={{flex:2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelGrandTotal')}</Text>
                </View>
                <View style={{flex:3 }}>
                {this.state.totalPrice === 0
                  ? <Text style={[styles.textGap, styles.amountTextFontSize]}>{'\u20B9'} {this.state.previousPrice}</Text>
                  : <Text style={[styles.textGap, styles.amountTextFontSize]}>{'\u20B9'} {(this.state.rooms) * (this.state.totalDays) * (this.state.totalPrice)}</Text>}
                </View>
              </View>
              <View style={styles.floatingInputView}>
                <View style={{flex:2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelPaymentStatus')}</Text>
                </View>
                <View style={{flex:3, marginTop:-8  }}>
                  <Picker
                    mode='dropdown'
                    iosIcon={<Icon name='ios-arrow-down' />}
                    style={{ height: 50, width:'100%' }}
                    selectedValue={this.state.bookingStatus == 'Checked-Out' || this.state.bookingStatus == 'Completed' ? 'Paid' : this.state.paymentStatus}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ paymentStatus: itemValue })
                    }>
                    <Picker.Item label='Pending' value='Pending' />
                    <Picker.Item label='Paid' value='Paid' />
                  </Picker>
                </View>
              </View>
              <Text style={{ color: 'red', fontSize: 20 }}>{this.state.errorMessage}</Text>
              <View style={styles.btnModal} >
                <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                  <AwesomeButton block success
                    onPress={this.handleUpdate}
                    disabled={this.state.buttonDisable}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} marginTop={20} >
                    <Text style={styles.BtnText}>{i18n.t('lanCommonButtonUpdate')} </Text>
                  </AwesomeButton>
                </LinearGradient>
              </View>
            {/* </View> */}
          </ScrollView>
          </View>
          <Toast
            ref='toast'
            style={{ backgroundColor: '#ff0000', width: '100%', borderRadius:0, marginTop: 10, }}
            position='top'
            positionValue={70}
            fadeInDuration={50}
            fadeOutDuration={500}
            // opacity={0.8}
            textStyle={{ color: 'white', fontFamily:'Roboto_medium', }}
          />
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
           {/* <Button onPress={() => this.handleReload()}  style={ styles.btnStyle }>
             <Text style={ styles.btnTxt } >Reload </Text>
           </Button> */}
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
   }
 </View>
  );
  }
}