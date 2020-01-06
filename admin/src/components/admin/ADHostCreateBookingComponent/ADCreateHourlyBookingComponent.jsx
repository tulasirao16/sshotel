/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import { t } from 'ttag'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { addDays } from 'date-fns'
import { hashHistory } from 'react-router'
import async from 'async'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

import '../css/Bookings.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

class ADCreateHourlyBookingComponent extends React.Component {
  constructor (props) {
    super(props)
    const propertyInfoData = JSON.parse(localStorage.getItem('propertyInfoViewObj'))
    let checkInDate = new Date(moment().format('YYYY-MM-DD'))
    let checkInDateFormat = moment(checkInDate).format('YYYY-MM-DD')
    let dt = moment(checkInDateFormat, 'YYYY-MM-DD HH:mm:ss')
    let dateName = dt.format('dddd')
    let weekEnd = dateName === 'Saturday' || dateName === 'Sunday'

    this.state = {
      mobileNumber: '',
      email: '',
      name: '',
      euUserId: '',
      bookingType: 'Hours',
      minDay: new Date(moment().format('YYYY-MM-DD')),
      maxDay: new Date(moment().add(3, 'month').endOf('month').format('YYYY-MM-DD')),
      amountPerDay: weekEnd ? propertyInfoData.pricing.weekEndTotalPrice : propertyInfoData.pricing.totalPrice,
      propertyData: JSON.parse(localStorage.getItem('propertyData')),
      propertyInfoData: JSON.parse(localStorage.getItem('propertyInfoViewObj')),
      amount: (propertyInfoData && propertyInfoData.pricing) ? propertyInfoData.pricing.basePrice : 0,
      checkInCredentials: propertyInfoData.pricing.checkInCredentials,
      totalDays: 1,
      noOfDays: 1,
      numOfPeople: 2,
      numOfAdults: 2,
      numOfChilds: 0,
      numOfRooms: 1,
      checkInMinDate: new Date(moment().format('YYYY-MM-DD')),
      checkOutMinDate: new Date(moment().format('YYYY-MM-DD')),
      checkInDate: new Date(moment().format('YYYY-MM-DD')),
      checkOutDate: new Date(moment().add(1, 'day').format('YYYY-MM-DD')),
      checkInTime: '12:00 PM',
      checkOutTime: '11:00 AM',
      checkInTimeArray: ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM'],
      checkOutTimeArray: ['05:00 AM', '11:00 AM', '05:00 PM', '11:00 PM'],
      hours: 0,
      days: 0,
      rooms: 1,
      errorMessage: '',
      roomSubButton: false,
      buttonDisabled: true,
      buttonEnabled: false,
      validUser: false,
      handleBookNowButtonMobile: false,
      handleBookNowButtonEmail: false,
      BookingBlocked: '',
      propertyBlocked: false,
      avaliableRoomCount: 0,
      totalHours: 0
    }
    this.getCheckInTimes = this.getCheckInTimes.bind(this)
    this.getCheckOutTimes = this.getCheckOutTimes.bind(this)
    this.handleHoursAmount = this.handleHoursAmount.bind(this)
    this.getNumberOfRoomsCount = this.getNumberOfRoomsCount.bind(this)
    this.handleCheckInDate = this.handleCheckInDate.bind(this)
    this.handleCheckOutDate = this.handleCheckOutDate.bind(this)
    this.handleCheckInTime = this.handleCheckInTime.bind(this)
    this.handleCheckOutTime = this.handleCheckOutTime.bind(this)
    this.handleAdultIncrement = this.handleAdultIncrement.bind(this)
    this.handleAdultDecrement = this.handleAdultDecrement.bind(this)
    this.handleChildIncrement = this.handleChildIncrement.bind(this)
    this.handleChildDecrement = this.handleChildDecrement.bind(this)
    this.handleRooms = this.handleRooms.bind(this)
    this.handleMobileGetDetails = this.handleMobileGetDetails.bind(this)
    this.handleEmailGetDetails = this.handleEmailGetDetails.bind(this)
    this.handleCreateBooking = this.handleCreateBooking.bind(this)
  }
  componentWillMount () {
    this.getCheckInTimes()
  }
  getCheckInTimes () {
    let EUBookingType = 'Hours'
    let propertyInfoData = JSON.parse(localStorage.getItem('propertyInfoViewObj'))
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

    let checkInTime = EUBookingType === 'Days' ? '12:00 PM' : value
    let checkInDate = (userCheckInDate === currentDateValue) ? currDay + ' ' + checkInTime
      : moment(new Date(this.state.checkInDate)).format('YYYY-MM-DD') + ' 12:00 PM'
    let checkOutMinDate = (pricing.isMidnightCheckOutAllowed || value !== '06:00 PM')
      ? moment(checkInDate, 'YYYY-MM-DD hh:mm A').add(5, 'h').format('YYYY-MM-DD')
      : moment(checkInDate, 'YYYY-MM-DD hh:mm A').add(11, 'h').format('YYYY-MM-DD')
    let checkOutDate = userCheckInDateValue === userCheckOutDateValue
      ? (pricing.isMidnightCheckOutAllowed || value !== '06:00 PM')
        ? moment(new Date(moment(checkInDate, 'YYYY-MM-DD hh:mm A'))).add(5, 'h').format('YYYY-MM-DD hh:mm A')
        : moment(new Date(moment(checkInDate, 'YYYY-MM-DD hh:mm A'))).add(11, 'h').format('YYYY-MM-DD hh:mm A')
      : moment(new Date(this.state.checkOutDate)).format('YYYY-MM-DD') + ' 11:00 AM'

    if (userCheckInDate === currentDateValue) {
      this.getCheckOutTimes(checkInTime, moment(checkInDate, 'YYYY-MM-DD').format('YYYY-MM-DD') === moment(checkOutDate, 'YYYY-MM-DD').format('YYYY-MM-DD'), function (resObj) {
        _this.handleHoursAmount(new Date(moment(checkInDate, 'YYYY-MM-DD hh:mm A')), new Date(moment(checkOutDate, 'YYYY-MM-DD hh:mm A')), checkInTime, resObj.checkOutTime)
        _this.getNumberOfRoomsCount(new Date(moment(checkInDate, 'YYYY-MM-DD hh:mm A')), new Date(moment(checkOutDate, 'YYYY-MM-DD hh:mm A')), checkInTime, resObj.checkOutTime)
      })
      this.setState({
        checkInTime: checkInTime,
        checkInTimeArray: value === '12:00 AM'
          ? ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM'] : (value === '06:00 AM'
            ? ['06:00 AM', '12:00 PM', '06:00 PM'] : (value === '12:00 PM'
              ? ['12:00 PM', '06:00 PM'] : (checkInTime === '12:00 PM' ? ['12:00 PM', '06:00 PM'] : ['06:00 PM']))
          ),
        checkInMinDate: new Date(moment(currDay, 'YYYY-MM-DD')),
        checkInDate: new Date(moment(checkInDate, 'YYYY-MM-DD')),
        checkOutMinDate: new Date(moment(checkOutMinDate, 'YYYY-MM-DD')),
        checkOutDate: new Date(moment(checkOutDate, 'YYYY-MM-DD'))
      })
    } else {
      this.getCheckOutTimes('12:00 PM', moment(checkInDate, 'YYYY-MM-DD').format('YYYY-MM-DD') === moment(checkOutDate, 'YYYY-MM-DD').format('YYYY-MM-DD'), function (resObj) {
        _this.handleHoursAmount(new Date(moment(checkInDate, 'YYYY-MM-DD hh:mm A')), new Date(moment(checkOutDate, 'YYYY-MM-DD hh:mm A')), '12:00 PM', resObj.checkOutTime)
        _this.getNumberOfRoomsCount(new Date(moment(checkInDate, 'YYYY-MM-DD hh:mm A')), new Date(moment(checkOutDate, 'YYYY-MM-DD hh:mm A')), '12:00 PM', resObj.checkOutTime)
      })
      this.setState({
        checkInTime: '12:00 PM',
        checkInMinDate: new Date(moment(currDay, 'YYYY-MM-DD')),
        checkInDate: new Date(moment(checkInDate, 'YYYY-MM-DD')),
        checkOutMinDate: new Date(moment(checkOutMinDate, 'YYYY-MM-DD')),
        checkOutDate: new Date(moment(checkOutDate, 'YYYY-MM-DD')),
        checkInTimeArray: ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM']
      })
    }
  }
  getCheckOutTimes (value, checkOutDate, done) {
    let propertyInfoData = JSON.parse(localStorage.getItem('propertyInfoViewObj'))
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
  handleHoursAmount (checkInDate, checkOutDate, checkIntime, checkOutTime) {
    let propertyInfoData = JSON.parse(localStorage.getItem('propertyInfoViewObj'))
    let pricing = propertyInfoData.pricing
    let checkInDateFormat = moment(checkInDate).format('YYYY-MM-DD')
    let dt = moment(checkInDateFormat + ' ' + checkIntime, 'YYYY-MM-DD HH:mm:ss')
    let dateName = dt.format('dddd')
    let weekEnd = dateName === 'Saturday' || dateName === 'Sunday'
    let totalAmount = 0
    let hoursAmount = 0
    let checkInTimeValue = moment(checkInDateFormat + ' ' + checkIntime, 'YYYY-MM-DD hh:mm A')
    let checkOuTimeValue = moment(moment(checkOutDate).format('YYYY-MM-DD') + ' ' + checkOutTime, 'YYYY-MM-DD hh:mm A')
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
    } else {
      let defaultCharge = (weekEnd ? pricing.weekEndTotalPrice : pricing.totalPrice)
      hoursAmount = defaultCharge
    }
    this.setState({ amount: totalAmount + hoursAmount, days: extraHours < 23 ? days : days + 1, hours: extraHours < 23 ? extraHours : 0, totalHours: Hours })
  }
  getNumberOfRoomsCount (checkInDate, checkOutDate, checkInTime, checkOutTime) {
    let propertyInfoData = JSON.parse(localStorage.getItem('propertyInfoViewObj'))
    let cidt = moment(checkInDate || this.state.checkInDate).format('YYYY-MM-DD')
    let codt = moment(checkOutDate || this.state.checkOutDate).format('YYYY-MM-DD')
    let checkInHours = moment(checkInTime || this.state.checkInTime, ['hh:mm A']).format('HH:mm')
    let checkOutHours = moment(checkOutTime || this.state.checkOutTime, ['hh:mm A']).format('HH:mm')
    let body = {
      noOfRooms: this.state.rooms,
      checkInDate: cidt + ' ' + checkInHours,
      checkOutDate: codt + ' ' + checkOutHours,
      spPropertyInfoId: propertyInfoData._id,
      spServiceProviderId: propertyInfoData.spServiceProviderId,
      propertyId: propertyInfoData.propertyId._id ? propertyInfoData.propertyId._id : propertyInfoData.propertyId
    }
    let obj = { url: config.baseUrl + config.postEUBookingRoomsCountAPI, body: body }
    let _this = this
    APICallManager.postCall(obj, function (resObj) {
      if (resObj.data.statusCode === '1017') {
        _this.setState({ BookingBlocked: 'Service is not available on selected dates', propertyBlocked: true })
      } else if (resObj.data.statusCode === '0000') {
        if (resObj.data.statusResult.bookingCount >= resObj.data.statusResult.activeRoomsCount) {
          _this.setState({ BookingBlocked: 'No rooms are available', propertyBlocked: true })
        } else {
          _this.setState({ avaliableRoomCount: resObj.data.statusResult.activeRoomsCount - resObj.data.statusResult.bookingCount, propertyBlocked: false, BookingBlocked: '' })
        }
      }
    })
  }
  handleCheckInDate (checkInDate) {
    let checkInDateTime = moment(checkInDate).format('YYYY-MM-DD') + ' ' + this.state.checkInTime
    let checkInDateFormat = moment(checkInDate).format('YYYY-MM-DD')
    let EUBookingType = 'Hours'
    let propertyInfoData = JSON.parse(localStorage.getItem('propertyInfoViewObj'))
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
      let newCheckInDate = new Date(moment(checkInDate).format('YYYY-MM-DD'))
      let newCheckOutDate = new Date(moment(checkInDateTime, 'YYYY-MM-DD hh:mm A').add(this.state.totalHours, 'hours').format('YYYY-MM-DD'))
      let checkOutMinDate = (pricing.isMidnightCheckOutAllowed || this.state.checkInTime !== '06:00 PM')
        ? moment(checkInDateTime, 'YYYY-MM-DD hh:mm A').add(5, 'h').format('YYYY-MM-DD')
        : moment(checkInDateTime, 'YYYY-MM-DD hh:mm A').add(11, 'h').format('YYYY-MM-DD')
      this.setState({
        checkInDate: newCheckInDate,
        checkInMinDate: new Date(moment(currDay, 'YYYY-MM-DD')),
        checkOutMinDate: new Date(moment(checkOutMinDate, 'YYYY-MM-DD')),
        checkInTimeArray: ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM'],
        checkOutDate: newCheckOutDate
      })
      this.handleHoursAmount(newCheckInDate, newCheckOutDate, this.state.checkInTime, this.state.checkOutTime)
      this.getNumberOfRoomsCount(newCheckInDate, newCheckOutDate, this.state.checkInTime, this.state.checkOutTime)
    } else {
      let checkInTime = (EUBookingType === 'Hours' && moment(value, 'hh:mm A') > moment(this.state.checkInTime, 'hh:mm A')) ? value : this.state.checkInTime
      let checkOutMinDate = (pricing.isMidnightCheckOutAllowed || value !== '06:00 PM') ? moment(currDay + ' ' + value, 'YYYY-MM-DD hh:mm A').add(5, 'h').format('YYYY-MM-DD')
        : moment(currDay + ' ' + value, 'YYYY-MM-DD hh:mm A').add(11, 'h').format('YYYY-MM-DD')
      let newCheckOutDate = new Date(moment(currDay + ' ' + checkInTime, 'YYYY-MM-DD hh:mm A').add(this.state.totalHours, 'hours').format('YYYY-MM-DD'))
      let checkOutDateValue = moment(newCheckOutDate, 'YYYY-DD-MM').format('YYYY-DD-MM')

      this.setState({
        checkInDate: new Date(moment(checkInDateFormat, 'YYYY-MM-DD')),
        checkInMinDate: new Date(moment(currDay, 'YYYY-MM-DD')),
        checkOutMinDate: new Date(moment(checkOutMinDate, 'YYYY-MM-DD')),
        checkOutDate: newCheckOutDate,
        checkInTime: checkInTime,
        checkInTimeArray: checkInTime === '12:00 AM'
          ? ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM'] : (checkInTime === '06:00 AM'
            ? ['06:00 AM', '12:00 PM', '06:00 PM'] : checkInTime === '12:00 PM'
              ? ['12:00 PM', '06:00 PM'] : EUBookingType === 'Days'
                ? ['12:00 PM', '06:00 PM'] : ['06:00 PM']
          )
      })
      this.getCheckOutTimes(checkInTime, checkInDateFormat === checkOutDateValue, function (resObj) {
        _this.handleHoursAmount(new Date(moment(checkInDateFormat, 'YYYY-MM-DD')), newCheckOutDate, checkInTime, resObj.checkOutTime)
        _this.getNumberOfRoomsCount(new Date(moment(checkInDateFormat, 'YYYY-MM-DD')), newCheckOutDate, checkInTime, resObj.checkOutTime)
      })
    }
  }
  handleCheckOutDate (checkOutDate) {
    let checkInDateValue = moment(this.state.checkInDate, 'YYYY-DD-MM').format('YYYY-MM-DD')
    let checkOutDateValue = moment(checkOutDate, 'YYYY-DD-MM').format('YYYY-MM-DD')
    let _this = this
    let newCheckInDate = new Date(moment(this.state.checkInDate, 'YYYY-DD-MM'))
    let newCheckOutDate = new Date(moment(checkOutDate, 'YYYY-DD-MM'))
    this.setState({ checkOutDate: newCheckOutDate })
    this.getCheckOutTimes(this.state.checkInTime, checkOutDateValue === checkInDateValue, function (resObj) {
      _this.handleHoursAmount(newCheckInDate, newCheckOutDate, _this.state.checkInTime, resObj.checkOutTime)
      _this.getNumberOfRoomsCount(newCheckInDate, newCheckOutDate, _this.state.checkInTime, resObj.checkOutTime)
    })
  }
  handleCheckInTime (event) {
    let checkInDateString = moment(this.state.checkInDate, 'YYYY-DD-MM').format('YYYY-DD-MM')
    let checkOutDateString = moment(this.state.checkOutDate, 'YYYY-DD-MM').format('YYYY-DD-MM')
    let propertyInfoData = JSON.parse(localStorage.getItem('propertyInfoViewObj'))
    let _this = this
    let checkOutDate = (event.target.value === '06:00 PM' && checkInDateString === checkOutDateString && !propertyInfoData.pricing.isMidnightCheckOutAllowed)
      ? new Date(moment(this.state.checkInDate).add(1, 'day').format('YYYY-MM-DD')) : this.state.checkOutDate
    let checkOutMinDate = (event.target.value === '06:00 PM' && checkInDateString === checkOutDateString && !propertyInfoData.pricing.isMidnightCheckOutAllowed)
      ? new Date(moment(this.state.checkInDate).add(1, 'day').format('YYYY-MM-DD')) : new Date(moment(this.state.checkInDate).format('YYYY-MM-DD'))
    this.setState({ checkInTime: event.target.value, checkOutDate: checkOutDate, checkOutMinDate: checkOutMinDate })
    this.getCheckOutTimes(event.target.value, checkInDateString === checkOutDateString, function (resObj) {
      _this.handleHoursAmount(_this.state.checkInDate, checkOutDate, event.target.value, resObj.checkOutTime)
      _this.getNumberOfRoomsCount(_this.state.checkInDate, checkOutDate, event.target.value, resObj.checkOutTime)
    })
  }
  handleCheckOutTime (event) {
    this.setState({ checkOutTime: event.target.value })
    this.handleHoursAmount(this.state.checkInDate, this.state.checkOutDate, this.state.checkInTime, event.target.value)
    this.getNumberOfRoomsCount(this.state.checkInDate, this.state.checkOutDate, this.state.checkInTime, event.target.value)
  }
  handleAdultIncrement (membersCapacity, childsCapacity) {
    let addValue = (this.state.numOfPeople) + (1)
    let numOfAdults = (this.state.numOfAdults) + 1
    this.setState({ numOfPeople: addValue, roomSubButton: false, numOfAdults: numOfAdults })
    let totalCapacity = parseInt(membersCapacity) + parseInt(childsCapacity)
    let RoomCount = (numOfAdults / membersCapacity)
    let TotalRoomCount = (addValue / totalCapacity)
    let index = RoomCount % 1
    let totalIndex = TotalRoomCount % 1
    if (RoomCount > TotalRoomCount) {
      if (index === 0) {
        this.setState({ numOfRooms: RoomCount })
      } else {
        let addRoomCount = (RoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ numOfRooms: addValue })
      }
    } else {
      if (totalIndex === 0) {
        this.setState({ numOfRooms: TotalRoomCount })
      } else {
        let addRoomCount = (TotalRoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ numOfRooms: addValue })
      }
    }
  }
  handleAdultDecrement (membersCapacity, childsCapacity) {
    let addValue = (this.state.numOfPeople) - (1)
    let numOfAdults = (this.state.numOfAdults) - 1
    this.setState({ numOfPeople: addValue, roomSubButton: false, numOfAdults: numOfAdults })
    let totalCapacity = parseInt(membersCapacity) + parseInt(childsCapacity)
    let RoomCount = (numOfAdults / membersCapacity)
    let TotalRoomCount = (addValue / totalCapacity)
    let totalIndex = TotalRoomCount % 1
    let index = RoomCount % 1
    if (RoomCount > TotalRoomCount) {
      if (index === 0) {
        this.setState({ numOfRooms: RoomCount })
      } else {
        let addRoomCount = (RoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ numOfRooms: addValue })
      }
    } else {
      if (totalIndex === 0) {
        this.setState({ numOfRooms: TotalRoomCount })
      } else {
        let addRoomCount = (TotalRoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ numOfRooms: addValue })
      }
    }
  }
  handleChildIncrement (membersCapacity, childsCapacity) {
    let adultsCapacity = this.state.numOfAdults
    let addValue = (this.state.numOfPeople) + (1)
    let numOfChildren = (this.state.numOfChilds) + 1
    this.setState({ numOfPeople: addValue, roomSubButton: false, numOfChilds: numOfChildren })
    let totalCapacity = parseInt(membersCapacity) + parseInt(childsCapacity)
    let RoomCount = (adultsCapacity / membersCapacity)
    let TotalRoomCount = (addValue / totalCapacity)
    let totalIndex = TotalRoomCount % 1
    let index = RoomCount % 1
    if (RoomCount > TotalRoomCount) {
      if (index === 0) {
        this.setState({ numOfRooms: RoomCount })
      } else {
        let addRoomCount = (RoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ numOfRooms: addValue })
      }
    } else {
      if (totalIndex === 0) {
        this.setState({ numOfRooms: TotalRoomCount })
      } else {
        let addRoomCount = (TotalRoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ numOfRooms: addValue })
      }
    }
  }
  handleChildDecrement (membersCapacity, childsCapacity) {
    let adultsCapacity = this.state.numOfAdults
    let addValue = (this.state.numOfPeople) - (1)
    let numOfChildren = (this.state.numOfChilds) - 1
    this.setState({ numOfPeople: addValue, roomSubButton: false, numOfChilds: numOfChildren })
    let totalCapacity = parseInt(membersCapacity) + parseInt(childsCapacity)
    let RoomCount = (adultsCapacity / membersCapacity)
    let TotalRoomCount = (addValue / totalCapacity)
    let totalIndex = TotalRoomCount % 1
    let index = RoomCount % 1
    if (RoomCount > TotalRoomCount) {
      if (index === 0) {
        this.setState({ numOfRooms: RoomCount })
      } else {
        let addRoomCount = (RoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ numOfRooms: addValue })
      }
    } else {
      if (totalIndex === 0) {
        this.setState({ numOfRooms: TotalRoomCount })
      } else {
        let addRoomCount = (TotalRoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ numOfRooms: addValue })
      }
    }
  }
  handleRooms (value, membersCapacity, childsCapacity) {
    let numOfPeople = this.state.numOfPeople
    let noOfAdults = this.state.numOfAdults
    let totalCapacity = parseInt(membersCapacity) + parseInt(childsCapacity)
    let RoomCount = (noOfAdults / parseInt(membersCapacity))
    let TotalRoomCount = (numOfPeople / totalCapacity)
    let totalIndex = TotalRoomCount % 1
    let index = RoomCount % 1
    let roomsCount = (index === 0) ? RoomCount : parseInt(RoomCount.toString().split('.')[0]) + 1
    let totalRoomsCount = (totalIndex === 0) ? TotalRoomCount : parseInt(TotalRoomCount.toString().split('.')[0]) + 1

    if (value === 'add') {
      var addRoom = (this.state.numOfRooms) + (1)
      this.setState({ numOfRooms: addRoom })
    } else {
      let subRoom = (this.state.numOfRooms) - (1)
      if (subRoom < roomsCount || subRoom < totalRoomsCount) {
      } else {
        let subRoom = (this.state.numOfRooms) - (1)
        this.setState({ numOfRooms: subRoom })
      }
    }
  }
  handleMobileGetDetails () {
    const reg = /^[0]?[6789]\d{9}$/
    if (!this.state.mobileNumber) {
      ToastsStore.error('please provide mobile Number')
    } else if (reg.test(this.state.mobileNumber) === false) {
      ToastsStore.error('Invalid number please provide a valid mobile Number')
    } else {
      let getEUDetails = {
        url: config.baseUrl + config.getSPEndUserDetailsAPI + this.state.mobileNumber
      }
      let _this = this
      APICallManager.getCall(getEUDetails, function (resObj) {
        if (resObj.data.statusCode === '9987') {
          _this.setState({ euUserId: resObj.data.statusResult._id,
            name: resObj.data.statusResult.name,
            mobileNumber: resObj.data.statusResult.mobileNumber,
            email: resObj.data.statusResult.email,
            validUser: true,
            handleBookNowButtonMobile: true,
            handleBookNowButtonEmail: true
          })
        } else {
          _this.setState({ handleBookNowButtonMobile: true })
        }
      })
    }
  }
  handleEmailGetDetails () {
    let checkText = this.state.email.includes('@')
    if (checkText === true) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      if (this.state.email === '' || this.state.email === 'undefined') {
        ToastsStore.error('Please enter a email')
      } else if (reg.test(this.state.email) === false) {
        ToastsStore.error('Please enter a valid email')
      } else {
        let getEUDetails = {
          url: config.baseUrl + config.getSPEndUserDetailsAPI + this.state.email
        }
        let _this = this
        APICallManager.getCall(getEUDetails, function (resObj) {
          if (resObj.data.statusCode === '9987') {
            _this.setState({ euUserId: resObj.data.statusResult._id,
              name: resObj.data.statusResult.name,
              mobileNumber: resObj.data.statusResult.mobileNumber,
              email: resObj.data.statusResult.email,
              validUser: true,
              handleBookNowButtonEmail: true,
              handleBookNowButtonMobile: true
            })
          } else {
            _this.setState({ handleBookNowButtonEmail: true })
          }
        })
      }
    } else {
      ToastsStore.error('Please enter a email')
    }
  }
  handleCreateBooking () {
    const reg = /^\d{10}$/
    const emailreg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const propertyData = this.state.propertyInfoData
    let checkInHours = moment(this.state.checkInTime, ['hh:mm A']).format('HH:mm')
    let checkOutHours = moment(this.state.checkOutTime, ['hh:mm A']).format('HH:mm')
    let cidt = moment(this.state.checkInDate).format('YYYY-MM-DD')
    let codt = moment(this.state.checkOutDate).format('YYYY-MM-DD')
    let postJson = {
      euUserId: this.state.euUserId,
      name: this.state.name,
      contactEuNumber: this.state.mobileNumber,
      euEmail: this.state.email,
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
      noOfChilds: this.state.numOfChilds.toString(),
      noOfAdults: this.state.numOfAdults,
      noOfRooms: this.state.numOfRooms,
      spPropertyId: this.state.propertyInfoData.propertyId._id ? this.state.propertyInfoData.propertyId._id : this.state.propertyInfoData.propertyId,
      spPropertyTitle: propertyData.propertyTitle,
      spPropertyType:  propertyData.propertyType,
      spPropertyInfoId: propertyData._id,
      totalPrice: (this.state.numOfRooms) * (this.state.amount),
      validUser: this.state.validUser,
      bookingType: 'Hours'
    }
    if (!this.state.checkInDate) {
      this.setState({ errorMessage: t`lanSPLabelErrorCheckInDateRequired` })
    } else if (!this.state.checkOutDate) {
      this.setState({ errorMessage: t`lanSPLabelErrorCheckOutDateRequired` })
    } else if (codt < cidt) {
      this.setState({ errorMessage: t`lanSPLabelErrorCheckOutGreaterCheckIn` })
    } else if (!this.state.mobileNumber || reg.test(this.state.mobileNumber) === false) {
      ToastsStore.error(t`lanSPLabelErrorInvalidMobile`)
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidMobile` })
    } else if (!this.state.email || emailreg.test(this.state.email) === false) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidEmail` })
    } else if (!this.state.validUser && !this.state.handleBookNowButtonMobile) {
      ToastsStore.error('Please click on mobile number get details to get user details')
    } else if (!this.state.validUser && !this.state.handleBookNowButtonEmail) {
      ToastsStore.error('Please click on email get details to get user details')
    } else if (!this.state.name.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorNameRequired` })
    } else {
      this.setState({ propertyBlocked: true })
      let _this = this
      let obj = { url: config.baseUrl + config.postSPEndUserBookingAPI, body: postJson }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          ToastsStore.success('Booking Successfully')
          setTimeout(() => {
            hashHistory.push('/admin/host/property/bookings')
          }, 2000)
        } else if (resObj.data.statusCode === '1017') {
          ToastsStore.error(resObj.data.statusMessage)
          _this.setState({ propertyBlocked: false })
        } else {
          ToastsStore.error('Booking failed try again')
          _this.setState({ propertyBlocked: false })
        }
      })
    }
  }
  render () {
    return (
      <div className='CreateDay'>
        <div className='row'>
          <div className='col-md-3'>
            <div className='form-group'>
              <label className='form-control-label'>{t`lanCommonLabelCheckIn`} {t`lanCommonLabelDate`}<span className='error'>*</span></label>
              <DatePicker
                dateFormat='MMM dd, yyyy'
                selected={this.state.checkInDate}
                minDate={new Date()}
                maxDate={addDays(new Date(), this.state.maxDate)}
                onChange={(checkInDate) => this.handleCheckInDate(checkInDate)}
                onKeyDown={(event) => event.preventDefault()}
              />
              <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 13 } : { opacity: 0 }} /></span>
              <p className='text-muted'><small style={{ color: 'red', fontSize: 13 }}>{this.state.tSubjectError}</small> </p>
            </div>
          </div>
          <div className='col-md-3'>
            <div className='form-group'>
              <label className='form-control-label'>{t`lanCommonLabelCheckOut`} {t`lanCommonLabelDate`}<span className='error'>*</span></label>
              <DatePicker
                dateFormat='MMM dd, yyyy'
                selected={this.state.checkOutDate}
                minDate={this.state.checkOutMinDate}
                maxDate={addDays(new Date(), this.state.maxDate)}
                onChange={(checkOutDate) => this.handleCheckOutDate(checkOutDate)}
                onKeyDown={(event) => event.preventDefault()}
              />
              <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.ticketOnError ? { color: 'red', fontSize: 13 } : { opacity: 0 }} /></span>
              <p className='text-muted'><small style={{ color: 'red', fontSize: 13 }}>{this.state.ticketOnError}</small> </p>
            </div>
          </div>
          <div className='col-md-3'>
            <div className='form-group'>
              <label className='form-control-label'>{t`lanSPLabelCheckInTime`}{this.state.checkInTime}<span className='error'>*</span></label>
              <select value={this.state.checkInTime} onChange={(event) => this.handleCheckInTime(event)} multiple='' className='form-control'>
                { this.state.checkInTimeArray.length > 0
                ? this.state.checkInTimeArray.map((data, i) => {
                  return <option value={data} key={i}>{data}</option>
                }) : '12:00 PM' }
              </select>
              <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 13 } : { opacity: 0 }} /></span>
              <p className='text-muted'><small style={{ color: 'red', fontSize: 13 }}>{this.state.tSubjectError}</small> </p>
            </div>
          </div>
          <div className='col-md-3'>
            <div className='form-group'>
              <label className='form-control-label'>{t`lanSPLabelCheckOutTime`}<span className='error'>*</span></label>
              <select value={this.state.checkOutTime} onChange={(event) => this.handleCheckOutTime(event)} multiple='' className='form-control'>
                {this.state.checkOutTimeArray.length > 0
                ? this.state.checkOutTimeArray.map((data, i) => {
                  return <option value={data} key={i}>{data}</option>
                })
                : '11:00 AM'}
              </select>
              <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.ticketOnError ? { color: 'red', fontSize: 13 } : { opacity: 0 }} /></span>
              <p className='text-muted'><small style={{ color: 'red', fontSize: 13 }}>{this.state.ticketOnError}</small> </p>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-2'>
            <div className='form-group'>
              <label className='form-control-label'>{t`lanSPLabelAdults`}</label>
              <div className='row'>
                <div className='col-md-3 col-auto page-item'>
                  <button type='button' disabled={this.state.numOfAdults <= 1
                    ? this.state.buttonDisabled : this.state.buttonEnabled} onClick={() => this.handleAdultDecrement(this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)}
                    className='btn-minus'><i className='fas fa-minus' />
                  </button>
                </div>
                <div className='col-md-3 col-auto'>
                  <p className='text-center'>{this.state.numOfAdults}</p>
                </div>
                <div className='col-md-3 col-auto page-item'>
                  <button type='button' disabled={parseInt(this.state.numOfAdults) > ((this.state.avaliableRoomCount) * (this.state.propertyInfoData.membersCapacity) - 1) ||
                    (parseInt(this.state.numOfAdults) + parseInt(this.state.numOfChilds) >
                      ((this.state.avaliableRoomCount) * (parseInt(this.state.propertyInfoData.membersCapacity) + parseInt(this.state.propertyInfoData.childsCapacity)) - 1))
                    ? this.state.buttonDisabled : this.state.buttonEnabled}
                    onClick={() => this.handleAdultIncrement(this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)}
                    className='btn-plus'><i className='fas fa-plus' />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-2'>
            <div className='form-group'>
              <label className='form-control-label'>{t`lanSPLabelChilds`}</label>
              <div className='row'>
                <div className='col-md-3 col-auto page-item'>
                  <button type='button' disabled={this.state.numOfChilds <= 0 ? this.state.buttonDisabled : this.state.buttonEnabled}
                    onClick={() => this.handleChildDecrement(this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)}
                    className='btn-minus'><i className='fas fa-minus' />
                  </button>
                </div>
                <div className='col-md-3 col-auto'>
                  <p className='text-center'>{this.state.numOfChilds}</p>
                </div>
                <div className='col-md-3 col-auto page-item'>
                  <button type='button' disabled={(parseInt(this.state.numOfChilds) > (this.state.avaliableRoomCount) * (this.state.propertyInfoData.childsCapacity) - 1) &&
                    (parseInt(this.state.numOfAdults) > (this.state.avaliableRoomCount) * (this.state.propertyInfoData.membersCapacity) - 1) ||
                    (parseInt(this.state.numOfAdults) + parseInt(this.state.numOfChilds) >
                      ((this.state.avaliableRoomCount) * (parseInt(this.state.propertyInfoData.membersCapacity) + parseInt(this.state.propertyInfoData.childsCapacity)) - 1))
                    ? this.state.buttonDisabled : this.state.buttonEnabled} onClick={() => this.handleChildIncrement(this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)}
                    className='btn-plus'><i className='fas fa-plus' />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-2'>
            <div className='form-group'>
              <label className='form-control-label'>{t`lanSPLabelRooms`}</label>
              <div className='row'>
                <div className='col-md-3 col-auto page-item'>
                  <button type='button' disabled={this.state.roomSubButton || this.state.numOfRooms <= 1}
                    onClick={() => this.handleRooms('sub', this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)}
                    className='btn-minus'><i className='fas fa-minus' />
                  </button>
                </div>
                <div className='col-md-3 col-auto'>
                  <p className='text-center'>{this.state.numOfRooms}</p>
                </div>
                <div className='col-md-3 col-auto page-item'>
                  <button type='button' disabled={this.state.avaliableRoomCount <= this.state.numOfRooms}
                    onClick={() => this.handleRooms('add', this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)}
                    className='btn-plus'><i className='fas fa-plus' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-3'>
            <div className='form-group'>
              <label className='form-control-label'>No of Days/Hours(#)<span className='error'>*</span></label>
              {this.state.days === 0
                ? <p className='price-sq mb-0'> {`${this.state.hours} hours`}</p>
                : this.state.days >= 2
                ? <p className='price-sq mb-0'> {`${this.state.days} days / ${this.state.hours} hours` }</p>
                : <p className='price-sq mb-0'> {`${this.state.days} day / ${this.state.hours} hours` }</p> }
            </div>
          </div>
          <div className='col-md-3'>
            <div className='form-group'>
              <label className='form-control-label'>{t`lanSPLabelTotal`} {t`lanCommonLabelBookingAmount`} (₹)<span className='error'>*</span></label>
              <input type='text' readOnly value={(this.state.numOfRooms) * (this.state.amount)} className='form-control' id='ticketOn' />
              <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.ticketOnError ? { color: 'red', fontSize: 13 } : { opacity: 0 }} /></span>
              <p className='text-muted'><small style={{ color: 'red', fontSize: 13 }}>{this.state.ticketOnError}</small> </p>
            </div>
          </div>
        </div>
        {this.state.propertyBlocked ? null : <p className='desc mb-0 text-success'>{`Hurry up!!! Only ${this.state.avaliableRoomCount} Rooms Left`}</p>}
        <p className='desc mb-0 text-danger'>{this.state.BookingBlocked}</p>
        <h3>{t`lanSPLabelUserDetails`}</h3>
        <div className='row'>
          <div className='col-md-3'>
            <div className='form-group'>
              <div className='row'>
                <div className='col-sm-9 col-7'>
                  <label className='form-control-label'>{t`lanCommonLabelMobileNumber`} (#)<span className='error'>*</span></label>
                </div>
                <a onClick={this.handleMobileGetDetails}><small style={{ color: 'green' }} >{t`lanCommonButtonGetDetails`}</small></a>
              </div>
              <input type='text' value={this.state.mobileNumber} onChange={(e) => this.setState({ mobileNumber: e.target.value, errorMessage: '' })} maxLength={10}
                className='form-control' id='TicketSubject' />
              <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 13 } : { opacity: 0 }} /></span>
              <p className='text-muted'><small style={{ color: 'red', fontSize: 13 }}>{this.state.tSubjectError}</small> </p>
            </div>
          </div>
          <div className='col-md-3'>
            <div className='form-group'>
              <div className='row'>
                <div className='col-sm-9 col-7'>
                  <label className='form-control-label'>{t`lanCommonLabelEmail`}<span className='error'>*</span></label>
                </div>
                <a onClick={this.handleEmailGetDetails}><small style={{ color: 'green' }} >{t`lanCommonButtonGetDetails`}</small></a>
              </div>
              <input type='text' value={this.state.email} onChange={(e) => this.setState({ email: e.target.value, errorMessage: '' })} className='form-control' id='ticketOn' />
              <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.ticketOnError ? { color: 'red', fontSize: 13 } : { opacity: 0 }} /></span>
              <p className='text-muted'><small style={{ color: 'red', fontSize: 13 }}>{this.state.ticketOnError}</small> </p>
            </div>
          </div>
          <div className='col-md-3'>
            <div className='form-group'>
              <label className='form-control-label'>{t`lanCommonLabelName`}<span className='error'>*</span></label>
              <input type='text' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value, errorMessage: '' })} className='form-control' id='TicketSubject' />
              <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 13 } : { opacity: 0 }} /></span>
              <p className='text-muted'><small style={{ color: 'red', fontSize: 13 }}>{this.state.tSubjectError}</small> </p>
            </div>
          </div>
        </div>
        <div className='row' data-spy='scroll' data-target='.navbar' data-offset='50' style={{ position: 'relative' }}>
          <div className='col-md-12'>
            <div style={{ color:'red' }}>{this.state.errorMessage}</div>
          </div>
        </div>
        <button className='btn btn-primary update-edit' disabled={this.state.propertyBlocked} onClick={this.handleCreateBooking}>{t`lanCommonButtonCreateBooking`}</button>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}

export default ADCreateHourlyBookingComponent
