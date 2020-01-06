import React from 'react';
import { observer, inject } from 'mobx-react';
import { View, Image, TextInput, TouchableHighlight, ScrollView, StatusBar, Dimensions, TouchableOpacity, ActivityIndicator, BackHandler } from 'react-native';
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
import async from 'async';
import Toast, { DURATION } from 'react-native-easy-toast';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const { State: TextInputState } = TextInput;

@inject(['UserStore'], ['BookingStore'], ['PropertyStore'])
@observer
export default class EditHoursBooking extends React.Component {
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
      adults: bookingData.noOfAdults,
      childs: bookingData.noOfChilds,
      rooms: bookingData.noOfRooms,
      totalDays: bookingData.totalDays,
      hours: bookingData.totalHours,
      totalHours: bookingData.totalHours,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      checkInMinDate: checkInDate,
      checkOutMinDate: moment(bookingData.checkInDate).format('YYYY-MM-DD'),
      bookingStatus: bookingData && bookingData.bookingStatus ? bookingData.bookingStatus : '',
      lifeCyclebookingStatus: bookingData && bookingData.bookingStatus ? bookingData.bookingStatus : '',
      paymentMode: bookingData && bookingData.paymentMode ? bookingData.paymentMode : 'Please Select',
      previousPrice: bookingData.totalPrice,
      totalPrice: 0,
      paymentStatus: bookingData && bookingData.paymentStatus ? bookingData.paymentStatus : '',
      roomSubButton: false,
      bookingType: bookingData && bookingData.bookingType ? bookingData.bookingType : '',
      checkInTime: moment(bookingData.checkInDate).format('hh:mm A'),
      checkOutTime: moment(bookingData.checkOutDate).format('hh:mm A'),
      checkInTimeArray: ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM'],
      checkOutTimeArray: [],
      isVisible: false,
      dummybookingStatus: bookingData && bookingData.bookingStatus ? bookingData.bookingStatus : ''
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    this.getCheckOutTimes = this.getCheckOutTimes.bind(this)
    this.handlecheckOutMinDate = this.handlecheckOutMinDate.bind(this)
    this.handleHoursAmount = this.handleHoursAmount.bind(this)
    this.handleAdultsIncrease = this.handleAdultsIncrease.bind(this)
    this.handleAdultsDecrease = this.handleAdultsDecrease.bind(this)
    this.handleChildsIncrease = this.handleChildsIncrease.bind(this)
    this.handleChildsDecrease = this.handleChildsDecrease.bind(this)
    this.handleRooms = this.handleRooms.bind(this)
    this.handleCheckInDate = this.handleCheckInDate.bind(this)
    this.handleCheckInTime = this.handleCheckInTime.bind(this)
    this.handleCheckOutDate = this.handleCheckOutDate.bind(this)
    this.handleCheckOutTime = this.handleCheckOutTime.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
    let checkInDate = moment(this.state.checkInDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
    let checkOutDate = moment(this.state.checkOutDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
    let _this = this
    this.getCheckOutTimes(this.state.checkInTime, checkInDate === checkOutDate, function (resObj) {
      _this.setState({ checkOutTime: moment(_this.state.bookingData.checkOutDate).format('hh:mm A') })
    })
    this.handlecheckOutMinDate(this.state.checkInTime)
  }
  handlecheckOutMinDate(checkInTime) {
    let propertyInfoData = this.state.bookingData.spPropertyInfoId
    let checkOutMinDate = (checkInTime === '06:00 PM' && !propertyInfoData.pricing.isMidnightCheckOutAllowed)
      ? new Date(moment(this.state.checkInDate).add(1, 'day').format('YYYY-MM-DD')) : new Date(moment(this.state.checkInDate).format('YYYY-MM-DD'))
    this.setState({ checkOutMinDate: checkOutMinDate })
  }
  handleHoursAmount(checkInDate, checkOutDate, checkIntime, checkOutTime) {
    let propertyInfoData = this.state.bookingData
    let pricing = propertyInfoData.spPropertyInfoId.pricing
    let checkInDateFormat = moment(checkInDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
    let dt = moment(checkInDateFormat + ' ' + checkIntime, 'YYYY-MM-DD HH:mm:ss')
    let dateName = dt.format('dddd')
    let weekEnd = dateName === 'Saturday' || dateName === 'Sunday'
    let totalAmount = 0
    let hoursAmount = 0
    let checkInTimeValue = moment(checkInDateFormat + ' ' + checkIntime, 'YYYY-MM-DD hh:mm A')
    let checkOuTimeValue = moment(moment(checkOutDate, 'YYYY-MM-DD').format('YYYY-MM-DD') + ' ' + checkOutTime, 'YYYY-MM-DD hh:mm A')
    let duration = moment.duration(checkOuTimeValue.diff(checkInTimeValue))
    let Hours = duration.asHours()
    let days = Math.floor(Hours / 24)
    let extraHours = Hours % 24
    totalAmount = (days) * (weekEnd ? pricing.weekEndTotalPrice : pricing.totalPrice)
    if (extraHours <= 6) {
      let belowSixHoursCharge = (weekEnd ? pricing.weekEndMinBaseTotalPrice : pricing.minBaseTotalPrice)
      hoursAmount = belowSixHoursCharge
    } else if (extraHours > 6 && extraHours <= 12) {
      let belowTwelveHoursCharge = (weekEnd ? pricing.weekEndMinBaseTotalPrice2 : pricing.minBaseTotalPrice2)
      hoursAmount = belowTwelveHoursCharge
      // } else if (extraHours > 12 && extraHours <= 24) {
      //   let belowTwentyFourHoursCharge = (weekEnd ? pricing.weekEndMinBasePrice3 : pricing.minBasePrice3)
      //   hoursAmount = belowTwentyFourHoursCharge
    } else {
      let defaultCharge = (weekEnd ? pricing.weekEndTotalPrice : pricing.totalPrice)
      hoursAmount = defaultCharge
    }
    this.setState({ totalPrice: totalAmount + hoursAmount, totalDays: extraHours < 23 ? days : days + 1, hours: extraHours < 23 ? extraHours : 0, totalHours: Hours })
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  handleBackButtonClick() {
    const navigation = this.props.navigation
    navigation.goBack()
    return true
  }
  getCheckOutTimes(value, checkOutDate, done) {
    let propertyInfoData = this.state.bookingData.spPropertyInfoId
    let pricing = propertyInfoData.pricing
    let checkOutTimeArray = []
    let resObj = {}
    let _this = this
    async.series([
      function (callback) {
        switch (value) {
          case '12:00 AM':
            checkOutTimeArray = pricing.isMidnightCheckOutAllowed ? ['05:00 AM', '11:00 AM', '11:00 PM'] : ['05:00 AM', '11:00 AM']
            resObj = { checkOutTimeArray: checkOutTimeArray, checkOutTime: !checkOutDate ? '11:00 AM' : '05:00 AM' }
            _this.setState({ checkOutTimeArray: checkOutTimeArray, checkOutTime: !checkOutDate ? '11:00 AM' : '05:00 AM' })
            callback(null, resObj)
            break
          case '06:00 AM':
            checkOutTimeArray = !checkOutDate ? ['05:00 AM', '11:00 AM', '05:00 PM'] : ['11:00 AM', '05:00 PM']
            resObj = { checkOutTimeArray: checkOutTimeArray, checkOutTime: !checkOutDate ? '05:00 AM' : '11:00 AM' }
            _this.setState({ checkOutTimeArray: checkOutTimeArray, checkOutTime: !checkOutDate ? '05:00 AM' : '11:00 AM' })
            callback(null, resObj)
            break
          case '12:00 PM':
            checkOutTimeArray = pricing.isMidnightCheckOutAllowed
              ? (!checkOutDate ? ['11:00 AM', '05:00 PM', '11:00 PM'] : ['05:00 PM', '11:00 PM'])
              : (!checkOutDate ? ['11:00 AM', '05:00 PM'] : ['05:00 PM'])
            resObj = { checkOutTimeArray: checkOutTimeArray, checkOutTime: !checkOutDate ? '11:00 AM' : '05:00 PM' }
            _this.setState({ checkOutTimeArray: checkOutTimeArray, checkOutTime: !checkOutDate ? '11:00 AM' : '05:00 PM' })
            callback(null, resObj)
            break
          case '06:00 PM':
            // !pricing.isMidnightCheckOutAllowed ? _this.setState({ checkOutDate: new Date(moment(_this.state.checkInDate).add(1, 'day').format('YYYY-MM-DD')) }) : null
            checkOutTimeArray = pricing.isMidnightCheckOutAllowed
              ? (!checkOutDate ? ['05:00 AM', '05:00 PM', '11:00 PM'] : ['11:00 PM'])
              : ['05:00 AM', '05:00 PM']
            resObj = { checkOutTimeArray: checkOutTimeArray, checkOutTime: !checkOutDate ? '05:00 PM' : pricing.isMidnightCheckOutAllowed ? '11:00 PM' : '05:00 AM' }
            _this.setState({ checkOutTimeArray: checkOutTimeArray, checkOutTime: !checkOutDate ? '05:00 PM' : pricing.isMidnightCheckOutAllowed ? '11:00 PM' : '05:00 AM' })
            callback(null, resObj)
            break
          default:
            checkOutTimeArray = pricing.isMidnightCheckOutAllowed
              ? (!checkOutDate ? ['11:00 AM', '05:00 PM', '11:00 PM'] : ['05:00 PM', '11:00 PM'])
              : (!checkOutDate ? ['11:00 AM', '05:00 PM'] : ['05:00 PM'])
            resObj = { checkOutTimeArray: checkOutTimeArray, checkOutTime: !checkOutDate ? '11:00 AM' : '05:00 PM' }
            _this.setState({ checkOutTimeArray: checkOutTimeArray, checkOutTime: !checkOutDate ? '11:00 AM' : '05:00 PM' })
            callback(null, resObj)
            break
        }
      }
    ], function (err, results) {
      if (err) { }
      done(resObj)
    })
  }
  handleAdultsIncrease(membersCapacity, childsCapacity) {
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
    this.handleHoursAmount(this.state.checkInDate, this.state.checkOutDate, this.state.checkInTime, this.state.checkOutTime)
  }
  handleAdultsDecrease(membersCapacity, childsCapacity) {
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
    this.handleHoursAmount(this.state.checkInDate, this.state.checkOutDate, this.state.checkInTime, this.state.checkOutTime)
  }
  handleChildsIncrease(membersCapacity, childsCapacity) {
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
    this.handleHoursAmount(this.state.checkInDate, this.state.checkOutDate, this.state.checkInTime, this.state.checkOutTime)
  }
  handleChildsDecrease(membersCapacity, childsCapacity) {
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
    this.handleHoursAmount(this.state.checkInDate, this.state.checkOutDate, this.state.checkInTime, this.state.checkOutTime)
  }
  handleRooms(status, membersCapacity, childsCapacity) {
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
    this.handleHoursAmount(this.state.checkInDate, this.state.checkOutDate, this.state.checkInTime, this.state.checkOutTime)
  }
  handleCheckInDate(checkInDate) {
    let checkInDateTime = moment(checkInDate, 'YYYY-MM-DD').format('YYYY-MM-DD') + ' ' + this.state.checkInTime
    let propertyInfoData = this.state.bookingData.spPropertyInfoId
    let pricing = propertyInfoData.pricing

    let currDayTime = moment().format('YYYY-MM-DD HH:mm')
    let currDt = moment(currDayTime, 'YYYY-MM-DD HH:mm').valueOf()
    let currDay = currDt >= moment(moment().format('YYYY-MM-DD') + ' 21:00', 'YYYY-MM-DD HH:mm').valueOf() ? moment().add(1, 'day').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')

    let newCheckInDate = moment(checkInDate).format('YYYY-MM-DD')
    let newCheckOutDate = moment(checkInDateTime, 'YYYY-MM-DD hh:mm A').add(this.state.totalHours, 'hours').format('YYYY-MM-DD')
    let checkOutMinDate = (pricing.isMidnightCheckOutAllowed || this.state.checkInTime !== '06:00 PM')
      ? moment(checkInDateTime, 'YYYY-MM-DD hh:mm A').add(5, 'h').format('YYYY-MM-DD')
      : moment(checkInDateTime, 'YYYY-MM-DD hh:mm A').add(11, 'h').format('YYYY-MM-DD')
    this.setState({
      checkInDate: newCheckInDate,
      checkInMinDate: moment(currDay, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      checkOutMinDate: moment(checkOutMinDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      checkInTimeArray: ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM'],
      checkOutDate: newCheckOutDate
    })
    let checkInDateString = moment(newCheckInDate).format('YYYY-MM-DD')
    let checkOutDateString = moment(newCheckOutDate).format('YYYY-MM-DD')
    let _this = this
    this.getCheckOutTimes(this.state.checkInTime, checkInDateString === checkOutDateString, function (resObj) {
      _this.handleHoursAmount(checkInDateString, checkOutDateString, _this.state.checkInTime, resObj.checkOutTime)
    })
  }
  handleCheckOutDate(checkOutDate) {
    this.setState({ checkOutDate: checkOutDate })
    let _this = this
    let checkInDateString = moment(this.state.checkInDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
    let checkOutDateString = moment(checkOutDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
    this.getCheckOutTimes(this.state.checkInTime, checkInDateString === checkOutDateString, function (resObj) {
      _this.handleHoursAmount(checkInDateString, checkOutDateString, _this.state.checkInTime, resObj.checkOutTime)
      //   _this.getNumberOfRoomsCount(newCheckInDate, newCheckOutDate, _this.state.checkInTime, resObj.checkOutTime)
    })
  }
  handleCheckInTime(value) {
    let checkInDateString = moment(this.state.checkInDate).format('YYYY-DD-MM')
    let checkOutDateString = moment(this.state.checkOutDate).format('YYYY-DD-MM')
    let propertyInfoData = this.state.bookingData.spPropertyInfoId
    let _this = this
    let checkOutDate = (value === '06:00 PM' && checkInDateString === checkOutDateString && !propertyInfoData.pricing.isMidnightCheckOutAllowed)
      ? moment(this.state.checkInDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD') : this.state.checkOutDate
    let checkOutMinDate = (value === '06:00 PM' && checkInDateString === checkOutDateString && !propertyInfoData.pricing.isMidnightCheckOutAllowed)
      ? moment(this.state.checkInDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD') : moment(this.state.checkInDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
    this.setState({ checkInTime: value, checkOutDate: checkOutDate, checkOutMinDate: checkOutMinDate })
    this.getCheckOutTimes(value, checkInDateString === checkOutDateString, function (resObj) {
      _this.handleHoursAmount(_this.state.checkInDate, checkOutDate, value, resObj.checkOutTime)
      //   _this.getNumberOfRoomsCount(_this.state.checkInDate, checkOutDate, event.target.value, resObj.checkOutTime)
    })
  }
  handleCheckOutTime(value) {
    this.setState({ checkOutTime: value })
    this.handleHoursAmount(this.state.checkInDate, this.state.checkOutDate, this.state.checkInTime, value)
  }
  handleUpdate() {
    this.setState({ buttonDisable: true })
    const navigation = this.props.navigation;
    const bookingData = this.state.bookingData;
    const BookingStore = this.props.BookingStore;
    const PropertyStore = this.props.PropertyStore;
    // const reg = /^[0]?[6789]\d{9}$/;
    const reg = /^\d{10}$/;
    // let bookingData = this.state.bookingData
    let bookingDataCheckInDate = moment(bookingData.checkInDate).format('YYYY-MM-DD')
    let bookingDataCheckOutDate = moment(bookingData.checkOutDate).format('YYYY-MM-DD')
    let checkInDate = moment(this.state.checkInDate).format('YYYY-MM-DD')
    let checkOutDate = moment(this.state.checkOutDate).format('YYYY-MM-DD')
    let bookingCheckInTime = moment(bookingData.checkInDate).format('hh:mm A')
    let bookingCheckOutTime = moment(bookingData.checkOutDate).format('hh:mm A')

    let checkInHours = moment(this.state.checkInTime, ['h:mm A']).format('HH:mm')
    let checkOutHours = moment(this.state.checkOutTime, ['h:mm A']).format('HH:mm')
    let cidt = moment(this.state.checkInDate).format('YYYY-MM-DD')
    let codt = moment(this.state.checkOutDate).format('YYYY-MM-DD')
    let checkInDateTime = moment(cidt + ' ' + checkInHours, 'YYYY-MM-DD hh:mm A').valueOf()
    let checkOutDateTime = moment(codt + ' ' + checkOutHours, 'YYYY-MM-DD hh:mm A').valueOf()

    if (bookingData.noOfAdults == this.state.adults && bookingData.noOfChilds == this.state.childs && bookingData.noOfRooms == this.state.rooms && bookingData.totalDays == this.state.totalDays
      && bookingDataCheckInDate == checkInDate && bookingDataCheckOutDate == checkOutDate && bookingData.bookingStatus == this.state.bookingStatus && bookingData.totalPrice == this.state.previousPrice
      && bookingData.paymentStatus == this.state.paymentStatus && bookingCheckInTime == this.state.checkInTime && bookingCheckOutTime == this.state.checkOutTime && bookingData.paymentMode == this.state.paymentMode) {
      navigation.navigate('BookingHistoryListScreen')
    } else if (this.state.paymentStatus === 'Paid' && this.state.paymentMode === 'Please Select') {
      this.setState({ buttonDisable: false })
      // alert(i18n.t('lanErrorPleaseSelectPaymentMode'));
      this.refs.toast.show(i18n.t('lanErrorPleaseSelectPaymentMode'));
    } else if (this.state.paymentStatus === 'Pending' && this.state.paymentMode !== 'Please Select') {
      this.setState({ buttonDisable: false })
      // alert(i18n.t('lanErrorSelectPaymentMode'))
      this.refs.toast.show(i18n.t('lanErrorSelectPaymentMode'));
    } else if (checkOutDateTime < checkInDateTime) {
      this.setState({ buttonDisable: false })
      // alert(i18n.t('lanErrorCheckOutDateShouldNotBeLessThanCheckInDate'));
      this.refs.toast.show(i18n.t('lanErrorCheckOutDateShouldNotBeLessThanCheckInDate'));
    } else {
      // this.setState({ buttonDisable: true })
      let put_json = {
        bookingCode: bookingData.bookingCode,
        euName: bookingData && bookingData.euName ? bookingData.euName : '',
        euMobileNumber: bookingData && bookingData.euMobileNumber ? bookingData.euMobileNumber : '',
        noOfAdults: this.state.adults,
        noOfChilds: this.state.childs.toString(),
        noOfRooms: this.state.rooms,
        totalDays: this.state.totalDays.toString(),
        checkInDate: cidt + ' ' + checkInHours,
        checkOutDate: codt + ' ' + checkOutHours,
        bookingStatus: this.state.bookingStatus,
        paymentMode: this.state.paymentMode,
        totalPrice: this.state.totalPrice == 0 ? this.state.previousPrice : (this.state.rooms) * (this.state.totalPrice),
        hours: this.state.hours,
        paymentStatus: this.state.paymentStatus,
        lifeCyclebookingStatus: this.state.bookingStatus,
        bookingType: 'Hours',
        // totalHours: this.state.totalHours,
        pricing: bookingData.spPropertyInfoId.pricing
      }
      let _this = this;
      this.setState({ isloading: true });
      let loading = setTimeout(function () {
        _this.setState({ isloading: false });
      }, 20000);
      BookingStore.putEndUserBooking(put_json, function (resObj) {
        if (resObj.statusCode == '0000') {

          PropertyStore.getSPBookings(1, 'all', '', function (resObj) {
            clearTimeout(loading)
            _this.setState({ isloading: false, buttonDisable: false })
            if (resObj.statusCode == '0000') {
              PropertyStore.BookingData = resObj.statusResult.bookingData;
              PropertyStore.BookingListingDataCount = resObj.statusResult.totalDocs;
              _this.props.navigation.navigate('BookingHistoryListScreen')
            }
            //  _this.props.navigation.navigate('BookingHistoryListScreen') 
          });
        } else {
          clearTimeout(loading)
          _this.setState({ isloading: false, buttonDisable: false })
          // alert('Booking update failed try again')
          _this.refs.toast.show(i18n.t('Booking update failed try again'));
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
      !this.state.reload
        ? <View style={styles.container}>
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
              ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#ffffff' size='large' style={styles.activeIndicatorStyle} /></View>
              : null}
          <View style={styles.content} >
            <ScrollView>
              {/* <View className={styles.content}> */}
              <View style={styles.floatingInputView}>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelBookingCode')}</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <Text style={[styles.textGap, styles.regularTextFontSize, styles.regularFontStyle]}>{bookingData.bookingCode}</Text>
                </View>
              </View>
              <View style={styles.floatingInputView}>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelBookedBy')}</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <Text style={[styles.textGap, styles.regularTextFontSize, styles.regularFontStyle]}>{bookingData.euName}</Text>
                </View>
              </View>
              <View style={styles.floatingInputView}>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelMobile')}</Text>
                </View>
                <View style={{ flex: 3 }}>
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
                <View style={{ flex: 2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelTotalDays')} / Hour(s)</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <Text style={[styles.textGap, styles.mediumTextFontSize, styles.regularFontStyle]}>  {`${this.state.totalDays} days / ${this.state.hours} hours`}</Text>
                </View>
              </View>
              <View style={styles.floatingInputView}>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelCheckIn')}</Text>
                </View>
                <View style={{ flex: 3 }}>
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
                <View style={{ flex: 2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelCheckOut')}</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <DatePicker
                    style={styles.DatePickerView}
                    date={moment(this.state.checkOutDate).format('YYYY-MM-DD')}
                    mode='date'
                    minDate={moment(this.state.checkOutMinDate).format('YYYY-MM-DD')}
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
                    onDateChange={(date) => this.handleCheckOutDate(date)}
                  />
                </View>
              </View>
              <View style={styles.floatingInputView}>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelCheckInTime')}</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <TouchableOpacity>
                    <Picker
                      selectedValue={this.state.checkInTime}
                      style={{ width: DEVICE_WIDTH / 2.9, left: -5, fontSize: 12, borderColor: 'grey', borderWidth: 0.5, borderColor: 'red' }}
                      onValueChange={(value) => this.handleCheckInTime(value)}
                      itemTextStyle={{ fontSize: 12 }}
                      itemStyle={{ fontSize: 12 }}
                    >
                      {this.state.checkInTimeArray.map((data, i) => {
                        return (
                          <Picker.Item label={data} value={data} key={i} />
                        )
                      })}
                    </Picker>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.floatingInputView}>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelCheckOutTime')}</Text>
                </View>
                <View style={{ flex: 3 }}>
                  <Picker
                    selectedValue={this.state.checkOutTime}
                    style={{ width: DEVICE_WIDTH / 2.9, left: -5, fontSize: 12 }}
                    onValueChange={(value) => this.handleCheckOutTime(value)}
                    itemTextStyle={{ fontSize: 12 }}
                    activeItemTextStyle={{ fontSize: 12, fontWeight: 'bold' }}
                  >
                    {this.state.checkOutTimeArray.map((data, i) => {
                      return (
                        <Picker.Item label={data} value={data} key={i} />
                      )
                    })}
                  </Picker>
                </View>
              </View>
              <View style={styles.floatingInputView}>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelStatus')}</Text>
                </View>
                <View style={{ flex: 3, marginTop: -8 }}>
                  <Picker
                    mode='dropdown'
                    iosIcon={<Icon name='ios-arrow-down' />}
                    style={{ width: '100%', height: 50, }}
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
                <View style={{ flex: 2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelPaymentMode')}</Text>
                </View>
                <View style={{ flex: 3, marginTop: -8 }}>
                  <Picker
                    mode='dropdown'
                    iosIcon={<Icon name='ios-arrow-down' />}
                    style={{ height: 50, width: '100%', }}
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
                <View style={{ flex: 2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelGrandTotal')}</Text>
                </View>
                <View style={{ flex: 3 }}>
                  {this.state.totalPrice === 0
                    ? <Text style={[styles.textGap, styles.amountTextFontSize]}>{'\u20B9'} {this.state.previousPrice}</Text>
                    : <Text style={[styles.textGap, styles.amountTextFontSize]}>{'\u20B9'} {(this.state.rooms) * (this.state.totalPrice)}</Text>}
                </View>
              </View>
              <View style={styles.floatingInputView}>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.labelGap, styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelPaymentStatus')}</Text>
                </View>
                <View style={{ flex: 3, marginTop: -8 }}>
                  <Picker
                    mode='dropdown'
                    iosIcon={<Icon name='ios-arrow-down' />}
                    style={{ height: 50, width: '100%' }}
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
                  <Text style={styles.headerTitleStyle}>{i18n.t('lanAppTitle')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
          <View style={{ jflex: 1, justifyContent: 'center', alignItems: 'center', width: DEVICE_WIDTH - 20, height: Device_Height - 150 }} >
            <View style={styles.eachBtnView} >
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
