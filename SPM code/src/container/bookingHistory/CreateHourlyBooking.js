import React from 'react'
import { Button, Icon, View, Text, Left, Right, List, ListItem, Picker } from 'native-base';
import ToggleSwitch from 'toggle-switch-react-native';
import { Platform, TextInput, Image, ScrollView,TouchableHighlight, AsyncStorage, Dimensions, StatusBar, TouchableOpacity, ActivityIndicator, CheckBox, BackHandler } from 'react-native';
import { observer, inject } from 'mobx-react';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import AwesomeButton from 'react-native-really-awesome-button';
import async from 'async'
import Swiper from 'react-native-swiper';
import Modal from 'react-native-modal';
import styles from './css/CreateBookingCss';
import styles1 from './css/styles1css'
import i18n from 'i18n-js'
import BookingCalendarScreen from './BookingCalendar'

import { PUBLIC_DOMAIN } from '../../../constants';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['UserStore'], ['PropertyStore'], ['BookingStore'])
@observer
export default class CreateHourlyBookingComponent extends React.Component {
  constructor(props) {
    super(props);
    const data = this.props.data
    let cidt = moment().format('YYYY-MM-DD')
    let dt = moment(cidt, 'YYYY-MM-DD HH:mm:ss')
    let dateName = dt.format('dddd')
    let weekEnd = dateName === 'Saturday' || dateName === 'Sunday' ? 'Weekend' : 'Weekday'
    this.state = {
      checkInDate: moment().format('YYYY-MM-DD'),
      checkOutDate:moment().add(1, 'days').format('YYYY-MM-DD'),
      checkInMinDate: moment().format('YYYY-MM-DD'),
      checkOutMinDate: moment().format('YYYY-MM-DD'),
      checkInTime:  '12:00 AM',
      checkOutTime: '05:00 AM',
      checkInTimeArray: ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM'],
      checkOutTimeArray: ['05:00 AM', '11:00 AM', '05:00 PM', '11:00 PM'],
      amenitiesData: [],
      servicesData: [],
      guestRulesArray: [],
      adults: 2,
      childs: 0,
      rooms: 1,
      numberOfDays: 1,
      amount: weekEnd=='Weekend' ? data.pricing.weekEndMinBaseTotalPrice : data.pricing.minBaseTotalPrice,
      // amountPerDay: data.pricing.totalPrice ? data.pricing.totalPrice : 0,
      avaliableRoomCount: 0,
      propertyId: (data && data.propertyId) ? (data.propertyId._id ? data.propertyId._id : data.propertyId) : '',
      propertyInfoId: data && data._id ? data._id : '',
      propertyInfo: data,
      totalDays: 1,
      numOfPeople: 2,
      hours: 0,
      days: 0,
      totalHours: 0,
      bookingType: 'Hours',
      bookingCalendarScreen: false
    }
    this.setRoomsCount = this.setRoomsCount.bind(this)
    this.getCheckInTimes = this.getCheckInTimes.bind(this)
    this.getCheckOutTimes = this.getCheckOutTimes.bind(this)
    this.handleHoursAmount = this.handleHoursAmount.bind(this)
    this.getNumberOfRoomsCount = this.getNumberOfRoomsCount.bind(this)
    this.handleAdultsIncrease = this.handleAdultsIncrease.bind(this)
    this.handleAdultsDecrease = this.handleAdultsDecrease.bind(this)
    this.handleChildsIncrease = this.handleChildsIncrease.bind(this)
    this.handleChildsDecrease = this.handleChildsDecrease.bind(this)
    this.handleRooms = this.handleRooms.bind(this)
    this.handleDates = this.handleDates.bind(this)
    this.handleCheckInTime = this.handleCheckInTime.bind(this)
    this.handleCheckOutTime = this.handleCheckOutTime.bind(this)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
  }
  componentWillMount () {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
    this.setRoomsCount()
    this.getCheckInTimes()
  }
  componentWillReceiveProps (newProps) {
    this.setState ({ amenitiesData: newProps.amenitiesArray, servicesData: newProps.servicesArray })
  }
  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  handleBackButtonClick () {
    const navigation = this.props.navigation
    navigation.goBack()
    return true
  }
  setRoomsCount () {
    let propertyInfoData = this.state.propertyInfo
    let guestRooms = this.state.rooms
    let numOfAdults = this.state.adults
    let actualMembers = numOfAdults + this.state.childs
    let mc = propertyInfoData ? parseInt(propertyInfoData.membersCapacity) : 1
    let cc = propertyInfoData ? parseInt(propertyInfoData.childsCapacity) : 0
    let totalCapacity = mc + cc
    let RoomCount = (numOfAdults / mc)
    let TotalRoomCount = (actualMembers / totalCapacity)
    let index = RoomCount % 1
    let totalIndex = TotalRoomCount % 1
    if (RoomCount > TotalRoomCount) {
      if (index === 0) {
        this.setState({ rooms: guestRooms <= RoomCount ? RoomCount : guestRooms })
      } else {
        let addRoomCount = (RoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: guestRooms <= addValue ? addValue : guestRooms })
      }
    } else {
      if (totalIndex === 0) {
        this.setState({ rooms: guestRooms <= TotalRoomCount ? TotalRoomCount : guestRooms })
      } else {
        let addRoomCount = (TotalRoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: guestRooms <= addValue ? addValue : guestRooms })
      }
    }
  }
  getCheckInTimes () {
    let propertyInfoData = this.state.propertyInfo
    let pricing = propertyInfoData.pricing
    let userCheckInDateValue = moment(this.state.checkInDate).format('YYYY-MM-DD').valueOf()
    let userCheckInDate = moment(this.state.checkInDate).format('YYYY-MM-DD')
    let userCheckOutDateValue = moment(this.state.checkOutDate).format('YYYY-MM-DD').valueOf()
    let currentDateValue = moment().format('YYYY-MM-DD')
    let _this = this

    let currDayTime = moment().format('YYYY-MM-DD HH:mm')
    let currDt = moment(currDayTime, 'YYYY-MM-DD HH:mm').valueOf()
    let currDay = currDt >= moment(moment().format('YYYY-MM-DD') + ' 21:00', 'YYYY-MM-DD HH:mm').valueOf() ? moment().add(1, 'day').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
    let value = (currDt >= moment(currDay + ' 21:00', 'YYYY-MM-DD HH:mm').valueOf() || currDt < moment(currDay + ' 03:00', 'YYYY-MM-DD HH:mm').valueOf())
      ? '12:00 AM' : ((currDt >= moment(currDay + ' 03:00', 'YYYY-MM-DD HH:mm').valueOf() && currDt < moment(currDay + ' 09:00', 'YYYY-MM-DD HH:mm').valueOf())
        ? '06:00 AM' : (currDt >= moment(currDay + ' 09:00', 'YYYY-MM-DD HH:mm').valueOf() && currDt < moment(currDay + ' 15:00', 'YYYY-MM-DD HH:mm').valueOf())
          ? '12:00 PM' : (currDt >= moment(currDay + ' 15:00', 'YYYY-MM-DD HH:mm').valueOf() && currDt < moment(currDay + ' 21:00', 'YYYY-MM-DD HH:mm').valueOf())
            ? '06:00 PM' : '12:00 PM')
    let checkInDate = (userCheckInDate === currentDateValue) ? currDay + ' ' + value
      : moment(this.state.checkInDate).format('YYYY-MM-DD') + ' 12:00 PM'
    let checkOutMinDate = (pricing.isMidnightCheckOutAllowed || value !== '06:00 PM') ? moment(checkInDate).add(5, 'h').format('YYYY-MM-DD') : moment(checkInDate).add(11, 'h').format('YYYY-MM-DD')
    let checkOutDate = userCheckInDateValue === userCheckOutDateValue
      ? (pricing.isMidnightCheckOutAllowed || value !== '06:00 PM')
        ? moment(checkInDate, 'YYYY-MM-DD hh:mm A').add(5, 'h').format('YYYY-MM-DD')
        : moment(checkInDate, 'YYYY-MM-DD hh:mm A').add(11, 'h').format('YYYY-MM-DD')
      : moment(this.state.checkOutDate).format('YYYY-MM-DD') + ' 11:00 AM'
    if (userCheckInDate === currentDateValue) {
        this.getCheckOutTimes(value, moment(checkInDate, 'YYYY-MM-DD').format('YYYY-MM-DD') === moment(checkOutDate, 'YYYY-MM-DD').format('YYYY-MM-DD'), function (resObj) {
          _this.handleHoursAmount(moment(checkInDate, 'YYYY-MM-DD').format('YYYY-MM-DD'), moment(checkOutDate, 'YYYY-MM-DD').format('YYYY-MM-DD'), value, resObj.checkOutTime)
          _this.getNumberOfRoomsCount(moment(checkInDate, 'YYYY-MM-DD').format('YYYY-MM-DD'), moment(checkOutDate, 'YYYY-MM-DD').format('YYYY-MM-DD'), value, resObj.checkOutTime)
        })
        this.setState({
          checkInTime: value,
          checkInTimeArray: value === '12:00 AM'
            ? ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM'] : (value === '06:00 AM'
              ? ['06:00 AM', '12:00 PM', '06:00 PM'] : value === '12:00 PM'
                ? ['12:00 PM', '06:00 PM'] : ['06:00 PM']
            ), 
          checkInMinDate: moment(currDay, 'YYYY-MM-DD').format('YYYY-MM-DD'),
          checkInDate: moment(checkInDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
          checkOutMinDate: moment(checkOutMinDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
          checkOutDate: moment(checkOutDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
        })   
    } else {
      this.getCheckOutTimes('12:00 PM', moment(checkInDate, 'YYYY-MM-DD').format('YYYY-MM-DD') === moment(checkOutDate, 'YYYY-MM-DD').format('YYYY-MM-DD'), function (resObj) {
        _this.handleHoursAmount(moment(checkInDate, 'YYYY-MM-DD').format('YYYY-MM-DD'), moment(checkOutDate, 'YYYY-MM-DD').format('YYYY-MM-DD'), '12:00 PM', resObj.checkOutTime)
        _this.getNumberOfRoomsCount(moment(checkInDate, 'YYYY-MM-DD').format('YYYY-MM-DD'), moment(checkOutDate, 'YYYY-MM-DD').format('YYYY-MM-DD'), '12:00 PM', resObj.checkOutTime)
      })
      this.setState({
        checkInTime: '12:00 PM',
        checkInMinDate: moment(currDay, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        checkInDate: moment(checkInDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        checkOutMinDate: moment(checkOutMinDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        checkOutDate: moment(checkOutDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        checkInTimeArray: ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM']
      })
    }
  }
  getNumberOfRoomsCount (checkInDate, checkOutDate, checkInTime, checkOutTime) {
    const BookingStore = this.props.BookingStore;
    let cidt = moment(checkInDate ? checkInDate : this.state.checkInDate).format('YYYY-MM-DD')
    let codt = moment(checkOutDate ? checkOutDate : this.state.checkOutDate).format('YYYY-MM-DD')
    let checkInHours = moment(checkInTime ? checkInTime : this.state.checkInTime, ['hh:mm A']).format('HH:mm')
    let checkOutHours = moment(checkOutTime ? checkOutTime : this.state.checkOutTime, ['hh:mm A']).format('HH:mm')
    let data = {
      checkInDate: cidt + ' ' + checkInHours,
      checkOutDate: codt + ' ' + checkOutHours,
      propertyId: this.state.propertyId,
      spPropertyInfoId: this.state.propertyInfoId,
      spServiceProviderId: this.state.propertyInfo.spServiceProviderId,
      noOfRooms: this.state.rooms
    };
    let _this = this;
    BookingStore.getBookingRoomsCount(data, function (resObj) {
      if (resObj.statusCode == '1017') {
        _this.setState({errorMessage:  ((i18n.t('lanErrorServiceNotAvailableOnThisDateChooseDifferentOne'))), propertyBlocked: true});
      } else if (resObj.statusCode === '0000') {
          if (resObj.statusResult.bookingCount >= resObj.statusResult.activeRoomsCount) {
            _this.setState({ errorMessage: ((i18n.t('lanErrorNoRoomsAvailable'))), propertyBlocked: true })
          } else {
            _this.setState({ avaliableRoomCount: resObj.statusResult.activeRoomsCount - resObj.statusResult.bookingCount, propertyBlocked: false, errorMessage: '' })
          }
      }   
    })
  }
  handleHoursAmount (checkInDate, checkOutDate, checkInTime, checkOutTime) {
    let propertyInfoData = this.state.propertyInfo
    let pricing = propertyInfoData.pricing
    let checkInHours = moment(checkInTime, ['hh:mm A']).format('HH:mm')
    let checkOutHours = moment(checkOutTime, ['hh:mm A']).format('HH:mm')
    let cidt = moment(checkInDate).format('YYYY-MM-DD')
    let codt = moment(checkOutDate).format('YYYY-MM-DD')
    let checkInDateFormat = moment(checkInDate).format('YYYY-MM-DD')
    let dt = moment(checkInDateFormat, 'YYYY-MM-DD HH:mm:ss')
    let dateName = dt.format('dddd')
    let weekEnd = dateName === 'Saturday' || dateName === 'Sunday'
    let totalAmount = 0
    let hoursAmount = 0
    let checkInTimeValue = moment.utc(cidt + ' ' + checkInHours)
    let checkOuTimeValue = moment.utc(codt + ' ' + checkOutHours)
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
    this.setState({ amount: totalAmount + hoursAmount, days: extraHours < 23 ? days : days + 1, hours: extraHours < 23 ? extraHours : 0, totalHours: Hours })
  }
  getCheckOutTimes (value, checkOutDate, done) {
    let propertyInfoData = this.state.propertyInfo
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
      if (err) {}
      done(resObj)
    })
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
        this.setState({ rooms: TotalRoomCount })
      } else {
        let addRoomCount = (TotalRoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: addValue })
      }
    }
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
      this.setState({ rooms: addRoom, errorMessage: '' })
    } else {
      let subRoom = (this.state.rooms) - (1)
      if (subRoom < roomsCount || subRoom < totalRoomsCount) {
      } else {
        let subRoom = (this.state.rooms) - (1)
        this.setState({ rooms: subRoom, errorMessage: '' })
      }
    }
  }
  handleCheckInTime (value) {
    let checkInDateString = moment(this.state.checkInDate, 'YYYY-DD-MM').format('YYYY-DD-MM')
    let checkOutDateString = moment(this.state.checkOutDate, 'YYYY-DD-MM').format('YYYY-DD-MM')
    let propertyInfoData = this.state.propertyInfo
    let _this = this
    let checkOutDate = (value === '06:00 PM' && checkInDateString === checkOutDateString && !propertyInfoData.pricing.isMidnightCheckOutAllowed)
      ? moment(this.state.checkInDate).add(1, 'day').format('YYYY-MM-DD') : this.state.checkOutDate
    let checkOutMinDate = (value === '06:00 PM' && checkInDateString === checkOutDateString && !propertyInfoData.pricing.isMidnightCheckOutAllowed)
      ? moment(this.state.checkInDate).add(1, 'day').format('YYYY-MM-DD') : this.state.checkOutMinDate
    this.setState({ checkInTime: value, checkOutDate: checkOutDate, checkOutMinDate: checkOutMinDate })
    this.getCheckOutTimes(value, checkInDateString === checkOutDateString, function (resObj) {
      _this.handleHoursAmount(_this.state.checkInDate, checkOutDate, value, resObj.checkOutTime)
      _this.getNumberOfRoomsCount(_this.state.checkInDate, checkOutDate, value, resObj.checkOutTime)
    })
  }
  handleCheckOutTime (value) {
    this.setState({ checkOutTime: value })
    this.handleHoursAmount(this.state.checkInDate, this.state.checkOutDate, this.state.checkInTime, value)
    this.getNumberOfRoomsCount(this.state.checkInDate, this.state.checkOutDate, this.state.checkInTime, value)
  }
  handleBooking () {
    const navigation = this.props.navigation;
    const propertyData = this.state.propertyInfo
    let checkInHours = moment(this.state.checkInTime, ['hh:mm A']).format('HH:mm')
    let checkOutHours = moment(this.state.checkOutTime, ['hh:mm A']).format('HH:mm')
    let cidt = moment(this.state.checkInDate).format('YYYY-MM-DD')
    let codt = moment(this.state.checkOutDate).format('YYYY-MM-DD')

    let postJson = {
      area: propertyData.spLocationObj.area,
      city: propertyData.spLocationObj.city,
      state: propertyData.spLocationObj.state,
      country: propertyData.spLocationObj.country,
      latitude: propertyData.spLocationObj.latitude,
      longitude: propertyData.spLocationObj.longitude,
      zip: propertyData.spLocationObj.zip,
      spServiceProviderId: propertyData.spServiceProviderId,
      spServiceProvider: propertyData.spServiceProvider,
      spLocationId: propertyData.spLocationId,
      contactPerson: propertyData.spLocationObj.contactPerson,
      mobileNumber: propertyData.spLocationObj.mobileNumber,
      spemail: propertyData.spLocationObj.email,
      address: propertyData.spLocationObj.address,
      noOfDays: this.state.days,
      totalHours: this.state.hours,
      checkInDate: cidt + ' ' + checkInHours,
      checkOutDate: codt + ' ' + checkOutHours,
      noOfChilds: this.state.childs.toString(),
      noOfAdults: this.state.adults,
      noOfRooms: this.state.rooms,
      spPropertyId: propertyData.propertyId._id ? propertyData.propertyId._id : propertyData.propertyId,
      spPropertyTitle: propertyData.propertyTitle,
      spPropertyType:  propertyData.propertyType,
      spPropertyInfoId: propertyData._id,
      totalPrice: (this.state.rooms) * (this.state.amount),
      bookingType: 'Hours'
    }
    navigation.navigate('ConfirmBooking', {data: propertyData, bookingData: postJson})
  }
  handleDates () {
    const UserStore = this.props.UserStore;
    
    let checkOutDate =  moment(UserStore.checkOut).format('YYYY-MM-DD')
    let checkInDateTime = moment(UserStore.checkIn).format('YYYY-MM-DD') + ' ' + this.state.checkInTime
    let checkInDateFormat = moment(UserStore.checkIn).format('YYYY-MM-DD')
    let propertyInfoData = this.state.propertyInfo
    let pricing = propertyInfoData.pricing
    let currentDay = moment().format('YYYY-MM-DD')
    let _this = this

    let currDayTime = moment().format('YYYY-MM-DD HH:mm')
    let currDt = moment(currDayTime, 'YYYY-MM-DD HH:mm').valueOf()
    let currDay = currDt >= moment(moment().format('YYYY-MM-DD') + ' 21:00', 'YYYY-MM-DD HH:mm').valueOf() ? moment().add(1, 'day').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
    let value = (currDt >= moment(currDay + ' 21:00', 'YYYY-MM-DD HH:mm').valueOf() || currDt < moment(currDay + ' 03:00', 'YYYY-MM-DD HH:mm').valueOf())
    ? '12:00 AM' : ((currDt >= moment(currDay + ' 03:00', 'YYYY-MM-DD HH:mm').valueOf() && currDt < moment(currDay + ' 09:00', 'YYYY-MM-DD HH:mm').valueOf())
      ? '06:00 AM' : (currDt >= moment(currDay + ' 09:00', 'YYYY-MM-DD HH:mm').valueOf() && currDt < moment(currDay + ' 15:00', 'YYYY-MM-DD HH:mm').valueOf())
        ? '12:00 PM' : (currDt >= moment(currDay + ' 15:00', 'YYYY-MM-DD HH:mm').valueOf() && currDt < moment(currDay + ' 21:00', 'YYYY-MM-DD HH:mm').valueOf())
          ? '06:00 PM' : '12:00 PM')
    if (currentDay !== checkInDateFormat) {
      let newCheckInDate = checkInDateFormat
      let newCheckOutDate = checkOutDate
      if (checkInDateFormat === checkOutDate) {
        let checkOutMinDate = (pricing.isMidnightCheckOutAllowed || this.state.checkInTime !== '06:00 PM') ? moment(checkInDateTime, 'YYYY-MM-DD hh:mm A').add(5, 'h').format('YYYY-MM-DD') : moment(checkInDateTime, 'YYYY-MM-DD hh:mm A').add(11, 'h').format('YYYY-MM-DD')
        this.setState({
          checkInDate: newCheckInDate,
          checkInMinDate: currDay,
          checkOutMinDate: checkOutMinDate,
          checkInTimeArray: ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM'],
          checkOutDate: checkOutMinDate
        })
        this.getCheckOutTimes(this.state.checkInTime, checkInDateFormat === checkOutMinDate, function (resObj) {
          _this.handleHoursAmount(newCheckInDate, checkOutMinDate, _this.state.checkInTime, resObj.checkOutTime)
          _this.getNumberOfRoomsCount(newCheckInDate, checkOutMinDate, _this.state.checkInTime, resObj.checkOutTime)
        })
      } else {
        let checkOutMinDate = (pricing.isMidnightCheckOutAllowed || this.state.checkInTime !== '06:00 PM') ? moment(checkInDateTime, 'YYYY-MM-DD hh:mm A').add(5, 'h').format('YYYY-MM-DD') : moment(checkInDateTime, 'YYYY-MM-DD hh:mm A').add(11, 'h').format('YYYY-MM-DD')
        this.setState({
          checkInDate: newCheckInDate,
          checkInMinDate: currDay,
          checkOutMinDate: checkOutMinDate,
          checkInTimeArray: ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM'],
          checkOutDate: newCheckOutDate
        })
        this.handleHoursAmount(newCheckInDate, newCheckOutDate, this.state.checkInTime, this.state.checkOutTime)
        this.getNumberOfRoomsCount(newCheckInDate, newCheckOutDate, this.state.checkInTime, this.state.checkOutTime)
      }
    } else {
      let checkInTime = moment(value, 'hh:mm A') > moment(this.state.checkInTime, 'hh:mm A') ? value : this.state.checkInTime
      let checkOutMinDate = (pricing.isMidnightCheckOutAllowed || value !== '06:00 PM') ? moment(currDay + ' ' + value, 'YYYY-MM-DD hh:mm A').add(5, 'h').format('YYYY-MM-DD') : moment(currDay + ' ' + value, 'YYYY-MM-DD hh:mm A').add(11, 'h').format('YYYY-MM-DD')
      let newCheckOutDate = checkOutDate
      let checkOutDateValue = moment(newCheckOutDate, 'YYYY-DD-MM').format('YYYY-DD-MM')
      if (checkInDateFormat === checkOutDate) {
        this.setState({
          checkInDate: currDay,
          checkInMinDate: currDay,
          checkOutMinDate: checkOutMinDate,
          checkOutDate: checkOutMinDate,
          checkInTime: checkInTime,
          checkInTimeArray: checkInTime === '12:00 AM'
            ? ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM'] : (checkInTime === '06:00 AM'
              ? ['06:00 AM', '12:00 PM', '06:00 PM'] : checkInTime === '12:00 PM'
                ? ['12:00 PM', '06:00 PM'] : ['06:00 PM']
            )
        })
        this.getCheckOutTimes(checkInTime, currDay === checkOutMinDate, function (resObj) {
          _this.handleHoursAmount(currDay, checkOutMinDate, checkInTime, resObj.checkOutTime)
          _this.getNumberOfRoomsCount(currDay, checkOutMinDate, checkInTime, resObj.checkOutTime)
        })
      } else {
        this.setState({
          checkInDate: currDay,
          checkInMinDate: currDay,
          checkOutMinDate: checkOutMinDate,
          checkOutDate: newCheckOutDate,
          checkInTime: checkInTime,
          checkInTimeArray: checkInTime === '12:00 AM'
            ? ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM'] : (checkInTime === '06:00 AM'
              ? ['06:00 AM', '12:00 PM', '06:00 PM'] : checkInTime === '12:00 PM'
                ? ['12:00 PM', '06:00 PM'] : ['06:00 PM']
            )
        })
        this.getCheckOutTimes(checkInTime, currDay === checkOutDateValue, function (resObj) {
          _this.handleHoursAmount(currDay, newCheckOutDate, checkInTime, resObj.checkOutTime)
          _this.getNumberOfRoomsCount(currDay, newCheckOutDate, checkInTime, resObj.checkOutTime)
        })
      }
      
    }
    this.setState({ bookingCalendarScreen: false})
  }
  render() {
    const navigation = this.props.navigation;
    const data = this.props.data
    return (
      !this.state.bookingCalendarScreen  
        ? <View >
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
                  <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.headerTitleStyle}> {this.state.propertyInfo && this.state.propertyInfo.propertyTitle ? this.state.propertyInfo.propertyTitle : this.state.propertyInfo.spPropertyInfoId.propertyTitle}</Text>
                </View>
              </View>
            </LinearGradient>
            {this.state.loading
              ? <View style={ styles.activeIndicatorView }><ActivityIndicator color="#ffffff" size='large' style={ styles.activeIndicatorStyle } /></View>
              : null}
            <View style={styles.imageView}>
              <Image source={data.propertyId.imagePath ? { uri: PUBLIC_DOMAIN + data.propertyId.imagePath } : require('../../../assets/dummy_property.jpg')} style={styles.imageStyle} />
            </View>
          <View style={styles.editableContainer}>
            <TouchableOpacity onPress={()=> this.setState({ bookingCalendarScreen: true })} style={{ flex:3, justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text style={styles.editablelabel}><Icon name='md-calendar' style={styles.editablelabelIcon} /> {' '}{i18n.t('lanButtonCheckIn')}</Text>
              <Text style={styles.editableValues}>{`${this.state.checkInTime},${moment(this.state.checkInDate, 'YYYY-MM-DD').format('MMM-DD')}`}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.setState({ bookingCalendarScreen: true })} style={{ flex:3, justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text style={styles.editablelabel}><Icon name='md-calendar' style={styles.editablelabelIcon} /> {' '}{i18n.t('lanButtonCheckOut')}</Text>
              <Text style={styles.editableValues}>{`${this.state.checkOutTime},${moment(this.state.checkOutDate, 'YYYY-MM-DD').format('MMM-DD')}`}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.setState({ guestModal: true })} style={{ flex:3, justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text style={styles.editablelabel}><Icon name='ios-contacts' style={styles.editablelabelIcon} /> {' '}{i18n.t('lanButtonRoomsGuests')}</Text>
              <Text style={styles.editableValues}>{`${this.state.rooms} Rooms / ${this.state.adults} Guests`}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 5, marginHorizontal:16, borderBottomColor: '#d1d1d1', borderBottomWidth: 0.5 }} ></View>
          <View style={styles.productDetailsView} >
            <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
              <View style={styles.content}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex:3, justifyContent: 'center', alignItems: 'flex-start', borderBottomColor: '#d1d1d1', borderBottomWidth: 0.5 }}>
                    <Text style={styles.editablelabel}>{i18n.t('lanButtonCheckInTime')}</Text>
                    <Picker
                      selectedValue={this.state.checkInTime}
                      style={{ width: DEVICE_WIDTH/2.9, left:-5, fontSize: 12, borderColor: 'grey', borderWidth:0.5, borderColor: 'red' }}
                      onValueChange={(value) => this.handleCheckInTime(value)}
                      itemTextStyle={{ fontSize:12}}
                      itemStyle={{ fontSize: 12 }}
                      >
                      {this.state.checkInTimeArray.map((data, i) => {
                        return (
                          <Picker.Item label={data} value={data} key={i}/>
                        )
                      })} 
                    </Picker>
                  </View>
                  <View style={{ flex:3, justifyContent: 'center', alignItems: 'flex-start', borderBottomColor: '#d1d1d1', borderBottomWidth: 0.5  }}>
                    <Text style={styles.editablelabel}>{i18n.t('lanButtonCheckOutTime')}</Text>
                    <Picker
                      selectedValue={this.state.checkOutTime}
                      style={{ width: DEVICE_WIDTH/2.9, left:-5, fontSize: 12}}
                      onValueChange={(value) => this.handleCheckOutTime(value)}
                      itemTextStyle={{fontSize: 12}}
                      activeItemTextStyle={{fontSize: 12, fontWeight: 'bold'}}
                      >
                      {this.state.checkOutTimeArray.map((data, i) => {
                        return (
                          <Picker.Item label={data} value={data} key={i} />
                        )
                      })} 
                    </Picker>
                  </View>
                  <View style={{ flex:3, justifyContent :'flex-start', alignItems: 'flex-end', borderBottomColor: '#d1d1d1', borderBottomWidth: 0.5 }}>
                    <Text style={styles.editablelabel}>{i18n.t('lanButtonDaysHrs')}</Text>
                    {this.state.days === 0
                      ? <Text style={styles.editableValuesDaysHrs}>{`${this.state.hours} hours`}</Text>
                        : this.state.days >= 2
                      ? <Text style={styles.editableValuesDaysHrs}>{`${this.state.days} days / ${this.state.hours} hours`}</Text>
                        : <Text style={styles.editableValuesDaysHrs}>{`${this.state.days} day / ${this.state.hours} hours`}</Text>
                    }
                  </View>
                  </View>
                <View style={{ paddingBottom: 10, borderColor: '#d1d1d1', borderBottomWidth: 0.5, }} >
                  <Text style={styles.titleHotel}>{data && data.propertyTitle ? data.propertyTitle : data.spPropertyInfoId.propertyTitle}</Text>
                  <Text style={styles.addressValues} >{data.spLocationObj.address}.</Text>
                </View>
                <View style={{ marginTop: (Platform.OS === 'android' ? 8 : 18), marginBottom: 5, height: 60, borderColor: '#d1d1d1', borderBottomWidth: 0.5, }}>
                  <Text style={[styles.textmedium, styles.Title]}>{i18n.t('lanLabelAmenities')}</Text>
                  <Swiper style={styles.wrapper} showsButtons={false} showsPagination={false} autoplay={true} autoplayTimeout={3.5}>
                    <View style={styles.slide1}>
                      <View style={{ flexDirection: 'row', marginVertical: 0 }} >
                        <View style={styles.aminitiesStyles}>
                          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                          {this.state.amenitiesData && this.state.amenitiesData.length > 0 ? this.state.amenitiesData.map((item, i) =>
                            item.amenityStatus == 'Available'
                            ? <View style={{ flex: 1, marginRight:10 }} key={i}>
                                <View style={{width: 30, height: 20}} >
                                  <Image source={item.amenityIconPath ? {uri: PUBLIC_DOMAIN + item.amenityIconPath} : null} style={styles.imageStyleAmen} />
                                </View>
                              </View> : null ) : 
                            <Text style={styles.textSmall}>{i18n.t('lanLabelNoAmenities')}</Text>}
                            </ScrollView>
                        </View>
                      </View>
                    </View>
                  </Swiper>
                </View>
                <View>
                {this.state.servicesData && this.state.servicesData.length > 0 ?    
                <View style={{ marginTop: (Platform.OS === 'android' ? 8 : 18), marginBottom: 5, height: 60, borderColor: '#d1d1d1', borderBottomWidth: 0.5, }}>
                  <Text style={[styles.textmedium, styles.Title]}>Services</Text>
                  <Swiper style={styles.wrapper} showsButtons={false} showsPagination={false} autoplay={true} autoplayTimeout={3.5}>
                    <View style={styles.slide1}>
                      <View style={{ flexDirection: 'row', marginVertical: 0 }} >
                        <View style={styles.aminitiesStyles}>
                          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                          {this.state.servicesData && this.state.servicesData.length > 0 ? this.state.servicesData.map((item, i) =>
                            item.serviceStatus === 'Available'
                            ?  <View style={{ flex: 1, margin:5 }} key={i}>
                                  <View >
                                  <Text style={{ color: '#000', fontSize:12, fontFamily: 'Roboto_medium', }} >{item.serviceName},</Text>
                                    {/* <Image source={item.serviceIconPath ? {uri: PUBLIC_DOMAIN + item.serviceIconPath} : null} style={styles.imageStyleAmen} /> */}
                                </View>
                            </View> : null ) : null}
                            </ScrollView>
                        </View>
                      </View>
                    </View>
                  </Swiper>
                </View> : null }
                </View>
                </View>
            </ScrollView>
            <View style={styles.fixedContainer}>
              <View style={{ justifyContent:'center', alignItems: 'center'}}> 
                <Text style={{ color: 'red', fontSize:13, fontFamily: 'Roboto_medium', }}>{this.state.errorMessage}</Text>
                {!this.state.propertyBlocked && this.state.avaliableRoomCount !== 0
                  ? <Text style={{ color: 'green', fontSize:12, fontFamily: 'Roboto_medium', justifyContent:'center' }}>
                       {`${i18n.t('lanLabelHurryUpOnly')} ${this.state.avaliableRoomCount} ${i18n.t('lanLabelRoomsLeft')}`}
                    </Text>
                  : null }
              </View>
              <View style={styles.fixedContainerTwo}>
                <View style={{flex:2, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={styles.fixedValuesPrice} >₹ {(this.state.rooms) * (this.state.totalDays) * (this.state.amount)}</Text>
                </View>
                <View style={{flex:2, alignItems: 'flex-end', justifyContent: 'center'}}>
                  {!this.state.propertyBlocked
                  ?  <TouchableOpacity style={styles.activeButton} onPress={() => this.handleBooking()}><Text style={styles.fixedValues}>{i18n.t('lanButtonBookNow')}</Text></TouchableOpacity>
                  :  <TouchableOpacity style={styles.deActiveButton}><Text style={styles.fixedValues}>{i18n.t('lanButtonBookNow')}</Text></TouchableOpacity>}
                </View>
              </View>
            </View>
          </View>

          <Modal isVisible={this.state.guestModal} style={styles1.modalView}>
            <View style={styles1.modalContainer}>
              <View style={styles1.mainView} >
                <View>
                  <Text style={styles1.bigTxt}> {i18n.t('lanLabelGuests')} </Text>
                </View>
                <View>
                  <List style={styles1.list}>
                    <ListItem style={styles1.GuestlistItem}>
                      <View style={styles1.guestTypeTitleView} >
                        <Text style={styles1.guestTypeTxt}>{i18n.t('lanLabelAdults')}</Text>
                      </View>
                      <View style={styles1.minusIconView} >
                        <View style={styles1.circle} >
                          <TouchableOpacity
                            disabled={this.state.adults <= 1}
                            onPress={() => this.handleAdultsDecrease(data.membersCapacity, data.childsCapacity)}
                          >
                            <Icon name='ios-remove' style={styles1.removeIcon} />
                          </TouchableOpacity> 
                        </View>
                      </View>
                      <View style={styles1.guestNumberView} >
                        <View style={styles1.guestNumberTxtView}>
                          <Text style={styles1.guestNumberTxt}>{this.state.adults}</Text>
                        </View>
                      </View>
                      <View style={styles1.plusIconView} >
                        <View style={styles1.circle} >
                          <TouchableOpacity
                            disabled={(this.state.adults) > ( (this.state.avaliableRoomCount) * (data.membersCapacity) - 1 ) || ( (this.state.adults) + (this.state.childs) >  ( (this.state.avaliableRoomCount) * ( parseInt(data.membersCapacity) + parseInt(data.childsCapacity) )  - 1 ) ) ? true : false}
                            onPress={() => this.handleAdultsIncrease(data.membersCapacity, data.childsCapacity)}
                          >
                            <Icon name='ios-add' style={styles1.addIcon} />
                          </TouchableOpacity>  
                        </View>
                      </View>
                    </ListItem>
                    <ListItem style={styles1.GuestlistItem}>
                      <View style={styles1.guestInfoView} >
                        <View style={styles1.guestTypeTitleView} >
                          <Text style={styles1.guestTypeTxt}>{i18n.t('lanLabelChildren')}</Text>
                          <Text style={styles1.ageinfoTxt} >{i18n.t('lanLabelUptoTwelveYears')}</Text>
                        </View>
                        <View style={styles1.minusIconView} >
                          <View style={styles1.circle} >
                            <TouchableOpacity
                              disabled={this.state.childs <= 0}
                              onPress={() => this.handleChildsDecrease(data.membersCapacity, data.childsCapacity)}
                            >
                            <Icon name='ios-remove' style={styles1.removeIcon} />
                            </TouchableOpacity>  
                          </View>
                        </View>
                        <View style={styles1.guestNumberView} >
                          <View style={styles1.guestNumberTxtView}>
                            <Text style={styles1.guestNumberTxt}> {this.state.childs} </Text>
                          </View>
                        </View>
                        <View style={styles1.plusIconView} >
                          <View style={styles1.circle} >
                            <TouchableOpacity
                              disabled={( (this.state.childs) > (this.state.avaliableRoomCount) * (data.childsCapacity) -1 ) && ( (this.state.adults) > (this.state.avaliableRoomCount) * (data.membersCapacity) - 1  ) || ( (this.state.adults) + (this.state.childs) >  ( (this.state.avaliableRoomCount) * ( parseInt(data.membersCapacity) + parseInt(data.childsCapacity) )  - 1 ) ) ? true : false}
                              onPress={() => this.handleChildsIncrease(data.membersCapacity, data.childsCapacity)}
                            >
                              <Icon name='ios-add' style={styles1.addIcon} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </ListItem>
                    <ListItem style={styles1.GuestlistItem}>
                      <View style={styles1.guestInfoView} >
                        <View style={styles1.guestTypeTitleView} >
                          <Text style={styles1.guestTypeTxt}>{i18n.t('lanLabelRooms')}</Text>
                        </View>
                        <View style={styles1.minusIconView} >
                          <View style={styles1.circle} >
                            <TouchableOpacity
                              disabled={this.state.roomSubButton || this.state.rooms <= 1}
                              onPress={() => this.handleRooms('sub', data.membersCapacity, data.childsCapacity)}
                            >
                              <Icon name='ios-remove' style={styles1.removeIcon} />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={styles1.guestNumberView} >
                          <View style={styles1.guestNumberTxtView}>
                            <Text style={styles1.guestNumberTxt}> {this.state.rooms} </Text>
                          </View>
                        </View>
                        <View style={styles1.plusIconView} >
                          <View style={styles1.circle} >
                            <TouchableOpacity
                              disabled={this.state.avaliableRoomCount <= this.state.rooms ? true : false} 
                              onPress={() => this.handleRooms('add', data.membersCapacity, data.childsCapacity)}
                            >
                              <Icon name='ios-add' style={styles1.removeIcon} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </ListItem>
                  </List>
                </View>
                {(this.state.numOfAdults) > ((this.state.avaliableRoomCount) * (data.membersCapacity) - 1) || ((this.state.numOfAdults) + (this.state.numOfChilds) > ((this.state.avaliableRoomCount) * (parseInt(data.membersCapacity) + parseInt(data.childsCapacity)) - 1))
                ? <Text style={styles1.errorMessage}>{i18n.t('lanErrorReachedMaximumLimitOfAdults')}</Text>
                : ((this.state.numOfChilds) > (this.state.avaliableRoomCount) * (data.childsCapacity) - 1) && ((this.state.numOfAdults) > (this.state.avaliableRoomCount) * (data.membersCapacity) - 1) || ((this.state.numOfAdults) + (this.state.numOfChilds) > ((this.state.avaliableRoomCount) * (parseInt(data.membersCapacity) + parseInt(data.childsCapacity)) - 1))
                  ? <Text style={styles1.errorMessage}>{i18n.t('lanErrorReachedMaximumLimitOfChilds')}</Text>
                  : this.state.avaliableRoomCount <= this.state.rooms
                  ? <Text style={styles1.errorMessage}>{i18n.t('lanErrorReachedMaximumLimitOfRooms')}</Text>
                : null
                }
                <View style={styles1.btnModal} >
                  <AwesomeButton block success
                  onPress={() => this.setState({ guestModal: !this.state.guestModal })}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={22} >
                    <Text style={styles1.BtnText}> {i18n.t('lanButtonDone')}</Text>
                  </AwesomeButton>
                </View>
              </View>
            </View>
          </Modal>
        </View>
       : <BookingCalendarScreen handleDates={this.handleDates} bookingType={this.state.bookingType} navigation={navigation} />
    )
  }
}