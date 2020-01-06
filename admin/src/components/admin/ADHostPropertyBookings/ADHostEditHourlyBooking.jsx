import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import moment from 'moment'
import { t } from 'ttag'
import DatePicker from 'react-datepicker'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import PropTypes from 'prop-types'
import async from 'async'

import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class ADHostEditHourlyBooking extends React.Component {
  constructor (props) {
    let bookingData = props.bookingData ? props.bookingData : JSON.parse(localStorage.getItem('bookingData'))
    super(props)
    this.state = {
      bookingData: bookingData || {},
      bookingStatus: bookingData.bookingStatus ? bookingData.bookingStatus : '',
      adults: bookingData.noOfAdults,
      childs: bookingData.noOfChilds,
      rooms: bookingData.noOfRooms,
      checkInDate: new Date(moment(bookingData.checkInDate).format('YYYY-MM-DD')),
      checkOutDate: new Date(moment(bookingData.checkOutDate).format('YYYY-MM-DD')),
      checkOutMinDate: new Date(moment(bookingData.checkInDate).format('YYYY-MM-DD')),
      checkInTime: moment(bookingData.checkInDate).format('hh:mm A'),
      checkOutTime: moment(bookingData.checkOutDate).format('hh:mm A'),
      totalDays: bookingData.totalDays,
      paymentStatus: bookingData.paymentStatus,
      checkInTimeArray:  ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM'],
      checkOutTimeArray: [],
      paymentMode: bookingData && bookingData.paymentMode ? bookingData.paymentMode : 'Please Select',
      totalPrice: bookingData.totalPrice,
      totalHours: bookingData.totalHours,
      hours: bookingData.totalHours,
      buttonDisable: false,
      bookingHistory: localStorage.getItem('bookingView'),
      bookingsby: localStorage.getItem('bookingsby'),
      propertiesBy:localStorage.getItem('propertiesBy')
    }
    this.handleAdultIncrement = this.handleAdultIncrement.bind(this)
    this.handleAdultsDecrease = this.handleAdultsDecrease.bind(this)
    this.handleChildsIncrease = this.handleChildsIncrease.bind(this)
    this.handleChildsDecrease = this.handleChildsDecrease.bind(this)
    this.handleRooms = this.handleRooms.bind(this)
    this.handleCheckInDate = this.handleCheckInDate.bind(this)
    this.getNumOfDays = this.getNumOfDays.bind(this)
    this.handleHoursAmount = this.handleHoursAmount.bind(this)
    this.handleCheckOutDate = this.handleCheckOutDate.bind(this)
    this.handleEditBooking = this.handleEditBooking.bind(this)
    this.handleCheckInTime = this.handleCheckInTime.bind(this)
    this.handleCheckOutTime = this.handleCheckOutTime.bind(this)
    this.handlecheckOutMinDate = this.handlecheckOutMinDate.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleHostDashboard = this.handleHostDashboard.bind(this)
    this.handleHostDashbaordBookings = this.handleHostDashbaordBookings.bind(this)
    this.handleDashbaordBookings = this.handleDashbaordBookings.bind(this)
    this.handleBookings = this.handleBookings.bind(this)
    this.handlePropertiesList = this.handlePropertiesList.bind(this)
    this.handleUsers = this.handleUsers.bind(this)
    this.handleHostsList = this.handleHostsList.bind(this)
    this.handleEuDashboard = this.handleEuDashboard.bind(this)
    this.handleEUBookings = this.handleEUBookings.bind(this)
  }
  componentWillMount () {
    let checkInDate = moment(this.state.checkInDate).format('YYYY-MM-DD')
    let checkOutDate = moment(this.state.checkOutDate).format('YYYY-MM-DD')
    let _this = this
    this.getCheckOutTimes(this.state.checkInTime, checkInDate === checkOutDate, function (resObj) {
      _this.setState({ checkOutTime: moment(_this.state.bookingData.checkOutDate).format('hh:mm A') })
    })
    this.handlecheckOutMinDate(this.state.checkInTime)
    this.handleHoursAmount(checkInDate, checkOutDate, this.state.checkInTime, this.state.checkOutTime)
  }
  componentWillUnmount () {
    localStorage.removeItem('bookingView')
    localStorage.removeItem('bookingsby')
  }
  handlecheckOutMinDate (checkInTime) {
    let propertyInfoData = this.state.bookingData.spPropertyInfoId
    let checkOutMinDate = (checkInTime === '06:00 PM' && !propertyInfoData.pricing.isMidnightCheckOutAllowed)
      ? new Date(moment(this.state.checkInDate).add(1, 'day').format('YYYY-MM-DD')) : new Date(moment(this.state.checkInDate).format('YYYY-MM-DD'))
    this.setState({ checkOutMinDate: checkOutMinDate })
  }
  handleCheckInTime (event) {
    let checkInDateString = moment(this.state.checkInDate, 'YYYY-DD-MM').format('YYYY-DD-MM')
    let checkOutDateString = moment(this.state.checkOutDate, 'YYYY-DD-MM').format('YYYY-DD-MM')
    let propertyInfoData = this.state.bookingData.spPropertyInfoId
    let _this = this
    let checkOutDate = (event.target.value === '06:00 PM' && checkInDateString === checkOutDateString && !propertyInfoData.pricing.isMidnightCheckOutAllowed)
      ? new Date(moment(this.state.checkInDate).add(1, 'day').format('YYYY-MM-DD')) : this.state.checkOutDate
    let checkOutMinDate = (event.target.value === '06:00 PM' && checkInDateString === checkOutDateString && !propertyInfoData.pricing.isMidnightCheckOutAllowed)
      ? new Date(moment(this.state.checkInDate).add(1, 'day').format('YYYY-MM-DD')) : new Date(moment(this.state.checkInDate).format('YYYY-MM-DD'))
    this.setState({ checkInTime: event.target.value, checkOutDate: checkOutDate, checkOutMinDate: checkOutMinDate })
    this.getCheckOutTimes(event.target.value, checkInDateString === checkOutDateString, function (resObj) {
      _this.handleHoursAmount(_this.state.checkInDate, checkOutDate, event.target.value, resObj.checkOutTime)
    //   _this.getNumberOfRoomsCount(_this.state.checkInDate, checkOutDate, event.target.value, resObj.checkOutTime)
    })
  }
  handleCheckOutTime (event) {
    this.setState({ checkOutTime: event.target.value })
    this.handleHoursAmount(this.state.checkInDate, this.state.checkOutDate, this.state.checkInTime, event.target.value)
    // this.getNumberOfRoomsCount(this.state.checkInDate, this.state.checkOutDate, this.state.checkInTime, event.target.value)
  }
  getCheckOutTimes (value, checkOutDate, done) {
    // let EUBookingType = JSON.parse(localStorage.getItem('EUBookingType'))
    let propertyInfoData = this.state.bookingData
    let pricing = propertyInfoData.spPropertyInfoId.pricing
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
  handleAdultIncrement (membersCapacity, childsCapacity) {
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
        this.setState({ noOfRooms: TotalRoomCount })
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
      this.setState({ rooms: addRoom })
    } else {
      let subRoom = (this.state.rooms) - (1)
      if (subRoom < roomsCount || subRoom < totalRoomsCount) {
      } else {
        let subRoom = (this.state.rooms) - (1)
        this.setState({ rooms: subRoom })
      }
    }
  }
  getNumOfDays (checkInDate, checkOutDate) {
    let getNumcheckIn = moment(checkInDate).format('YYYY-MM-DD')
    let getNumcheckOut = moment(checkOutDate).format('YYYY-MM-DD')
    var checkIn = moment.utc(getNumcheckIn)
    var checkOut = moment.utc(getNumcheckOut)
    var duration = moment.duration(checkOut.diff(checkIn))
    var days = duration.asDays()
    var hours = duration.asHours()
    this.setState({ totalDays: days === 0 ? 1 : days, totalHours: hours })
  }
  handleCheckInDate (checkInDate) {
    let checkInDateTime = moment(checkInDate).format('YYYY-MM-DD') + ' ' + this.state.checkInTime
    // let checkInDateFormat = moment(checkInDate).format('YYYY-MM-DD')
    // let EUBookingType = 'Hours'
    let propertyInfoData = this.state.bookingData.spPropertyInfoId
    let pricing = propertyInfoData.pricing
    // let currentDay = moment().format('YYYY-MM-DD')
    // let _this = this

    let currDayTime = moment().format('YYYY-MM-DD HH:mm')
    let currDt = moment(currDayTime, 'YYYY-MM-DD HH:mm').valueOf()
    let currDay = currDt >= moment(moment().format('YYYY-MM-DD') + ' 21:00', 'YYYY-MM-DD HH:mm').valueOf() ? moment().add(1, 'day').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
    // let value = (currDt >= moment(currDay + ' 21:00', 'YYYY-MM-DD HH:mm').valueOf() || currDt < moment(currDay + ' 03:00', 'YYYY-MM-DD HH:mm').valueOf())
    // ? '12:00 AM' : ((currDt >= moment(currDay + ' 03:00', 'YYYY-MM-DD HH:mm').valueOf() && currDt < moment(currDay + ' 09:00', 'YYYY-MM-DD HH:mm').valueOf())
    //   ? '06:00 AM' : (currDt >= moment(currDay + ' 09:00', 'YYYY-MM-DD HH:mm').valueOf() && currDt < moment(currDay + ' 15:00', 'YYYY-MM-DD HH:mm').valueOf())
    //     ? '12:00 PM' : (currDt >= moment(currDay + ' 15:00', 'YYYY-MM-DD HH:mm').valueOf() && currDt < moment(currDay + ' 21:00', 'YYYY-MM-DD HH:mm').valueOf())
    //       ? '06:00 PM' : '12:00 PM')

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
    //   this.getNumberOfRoomsCount(newCheckInDate, newCheckOutDate, this.state.checkInTime, this.state.checkOutTime)
      // this.getNumOfDays(newCheckInDate, newCheckOutDate)
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
    //   _this.getNumberOfRoomsCount(newCheckInDate, newCheckOutDate, _this.state.checkInTime, resObj.checkOutTime)
    })
  }
  handleHoursAmount (checkInDate, checkOutDate, checkIntime, checkOutTime) {
    let propertyInfoData = this.state.bookingData
    let pricing = propertyInfoData.spPropertyInfoId.pricing
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
    // } else if (extraHours > 12 && extraHours <= 24) {
    //   let belowTwentyFourHoursCharge = (weekEnd ? pricing.weekEndMinBasePrice3 : pricing.minBasePrice3)
    //   hoursAmount = belowTwentyFourHoursCharge
    } else {
      let defaultCharge = (weekEnd ? pricing.weekEndTotalPrice : pricing.totalPrice)
      hoursAmount = defaultCharge
    }
    this.setState({ totalPrice: totalAmount + hoursAmount, totalDays: extraHours < 23 ? days : days + 1, hours: extraHours < 23 ? extraHours : 0, totalHours: Hours })
  }
  handleEditBooking () {
    let bookingData = this.state.bookingData
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
    if (this.state.bookingStatus === bookingData.bookingStatus && this.state.totalDays === bookingData.totalDays && this.state.paymentStatus === bookingData.paymentStatus &&
        this.state.adults === bookingData.noOfAdults && this.state.childs === bookingData.noOfChilds && this.state.rooms === bookingData.noOfRooms && bookingDataCheckInDate === checkInDate &&
      bookingDataCheckOutDate === checkOutDate && bookingCheckInTime === this.state.checkInTime && bookingCheckOutTime === this.state.checkOutTime) {
      if (this.state.bookingsby === 'hostdashboard') {
        hashHistory.push('admin/host-dashboard/bookings')
      } else if (this.state.bookingsby === 'EU-dashboard') {
        hashHistory.push('/admin/eu/bookings')
      } else if (this.state.bookingsby === 'eu-bookings') {
        hashHistory.push('/admin/eu/booking-history')
      } else if (this.state.bookingsby === 'dashboard') {
        hashHistory.push('admin/dashboard/bookings')
      } else if (this.state.bookingHistory) {
        hashHistory.push('/admin/bookinghistory')
      } else {
        hashHistory.push('/admin/host/property/bookings')
      }
    } else if (this.state.paymentStatus === 'Paid' && this.state.paymentMode === 'Please Select') {
      ToastsStore.error('Please Select Payment Mode')
    } else if (checkOutDateTime < checkInDateTime) {
      ToastsStore.error(t`lanEULabelErrorCheckOutDateAndTimeShouldBeGreaterThanCheckInDateTime`)
    } else {
      this.setState({ buttonDisable: true })
    //   let checkInHours = moment(this.state.checkInTime, ['h:mm A']).format('HH:mm')
    //   let checkOutHours = moment(this.state.checkOutTime, ['h:mm A']).format('HH:mm')
    //   let cidt = moment(this.state.checkInDate).format('YYYY-MM-DD')
    //   let codt = moment(this.state.checkOutDate).format('YYYY-MM-DD')
      let totalAmount = (this.state.rooms) * (this.state.totalPrice)
      let putJson = {
        bookingCode: bookingData.bookingCode,
        euName: bookingData.euUserId.name,
        euMobileNumber: bookingData.euUserId.mobileNumber,
        noOfAdults: this.state.adults,
        noOfChilds: this.state.childs.toString(),
        noOfRooms: this.state.rooms,
        totalDays: this.state.totalDays.toString(),
        checkInDate: cidt + ' ' + checkInHours,
        checkOutDate: codt + ' ' + checkOutHours,
        bookingStatus: this.state.bookingStatus,
        paymentMode: this.state.paymentMode,
        totalPrice: totalAmount.toString(),
        hours: this.state.hours,
        paymentStatus: this.state.paymentStatus,
        lifeCyclebookingStatus: this.state.bookingStatus,
        bookingType: 'Hours',
        totalHours: this.state.totalHours,
        pricing: bookingData.spPropertyInfoId.pricing
      }
      let _this = this
      let obj = { url: config.baseUrl + config.putADBookingUpdateAPI, body: putJson }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          ToastsStore.success('Booking Updated Successfully')
          setTimeout(() => {
            if (_this.state.bookingsby === 'hostdashboard') {
              hashHistory.push('admin/host-dashboard/bookings')
            } else if (_this.state.bookingsby === 'EU-dashboard') {
              hashHistory.push('/admin/eu/bookings')
            } else if (_this.state.bookingsby === 'eu-bookings') {
              hashHistory.push('/admin/eu/booking-history')
            } else if (_this.state.bookingsby === 'dashboard') {
              hashHistory.push('admin/dashboard/bookings')
            } else if (_this.state.bookingHistory) {
              hashHistory.push('/admin/bookinghistory')
            } else {
              hashHistory.push('/admin/host/property/bookings')
            }
          }, 2000)
        } else {
          ToastsStore.error('Booking Update failed try again')
        }
      })
    }
  }
  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handlePropertiesList () {
    localStorage.setItem('propertiesBy', 'Dashboard')
    hashHistory.push('/admin/host/property/bookings')
  }
  handleBack () {
    hashHistory.push('/admin/host/property/bookings')
    event.preventDefault()
  }
  handleHostsList () {
    hashHistory.push('/admin/hosts')
  }
  handleUsers () {
    hashHistory.push('/admin/eu-users')
    event.preventDefault()
  }
  handleHostDashboard () {
    hashHistory.push('admin/host-dashboard')
    event.preventDefault()
  }
  handleHostDashbaordBookings () {
    hashHistory.push('admin/host-dashboard/bookings')
    event.preventDefault()
  }
  handleDashbaordBookings () {
    hashHistory.push('admin/dashboard/bookings')
    event.preventDefault()
  }
  handleBookings () {
    hashHistory.push('/admin/eu/bookings')
    event.preventDefault()
  }
  handleEUBookings () {
    hashHistory.push('/admin/eu/booking-history')
    event.preventDefault()
  }
  handleEuDashboard () {
    hashHistory.push('/admin/eu/dashboard')
    event.preventDefault()
  }
  render () {
    let bookingData = this.state.bookingData
    return (
      <div className='main-content' id='panel'>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    {this.state.propertiesBy === 'Dashboard'
                    ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={this.handlePropertiesList} >{t`lanSPTitlePropertiesList`}</a></li>
                      <li className='breadcrumb-item'><a onClick={this.handlePropertiesList}>Bookings-Page</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>Bookings-Page-Edit</li>
                    </ol>
                      : this.state.bookingsby === 'dashboard'
                      ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item'><a onClick={this.handleDashbaordBookings}>Bookings List</a></li>
                        <li className='breadcrumb-item active' aria-current='page'>BookingsEdit</li>
                      </ol>
                       : this.state.bookingsby === 'hostdashboard'
                       ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                         <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                         <li className='breadcrumb-item'><a onClick={this.handleHostDashboard}>Host Dashboard</a></li>
                         <li className='breadcrumb-item'><a onClick={this.handleHostDashbaordBookings}>Bookings List</a></li>
                         <li className='breadcrumb-item active' aria-current='page'>BookingsEdit</li>
                       </ol>
                      : this.state.bookingsby === 'EU-dashboard'
                      ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item'><a onClick={this.handleUsers}>EU Users</a></li>
                        <li className='breadcrumb-item'><a onClick={this.handleEuDashboard}>EU Dashboard</a></li>
                        <li className='breadcrumb-item' aria-current='page'><a onClick={this.handleBookings}>{t`lanCommonTitleBookings`}</a></li>
                        <li className='breadcrumb-item active' aria-current='page'>BookingsEdit</li>
                      </ol>
                       : this.state.bookingsby === 'eu-bookings'
                       ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                         <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                         <li className='breadcrumb-item'><a onClick={this.handleUsers}>EU Users</a></li>
                         <li className='breadcrumb-item' aria-current='page'><a onClick={this.handleEUBookings}>{t`lanCommonTitleBookings`}</a></li>
                         <li className='breadcrumb-item active' aria-current='page'>BookingsEdit</li>
                       </ol>
                        : this.state.bookingHistory
                        ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                          <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                          <li className='breadcrumb-item'><a onClick={() => hashHistory.push('/admin/bookingHistory')}>Bookings History</a></li>
                          <li className='breadcrumb-item active' aria-current='page'>{ t`lanSPTitleBookingsEdit` }</li>
                        </ol>
                        : <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                          <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                          <li className='breadcrumb-item'><a onClick={this.handleHostsList} >{t`lanADTitleHostsHostsList`}</a></li>
                          <li className='breadcrumb-item'><a onClick={this.handlePropertiesList}>{t`lanSPTitlePropertiesList`}</a></li>
                          <li className='breadcrumb-item'><a onClick={this.handleBack}>{t`lanCommonTitleBookings`}</a></li>
                          <li className='breadcrumb-item active' aria-current='page'>{ t`lanSPTitleBookingsEdit` }</li>
                        </ol>}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6 '>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-12 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header'>
                  <div className='row'>
                    <div className='col-md-7'><h3 className='mb-0'>{t`lanCommonButtonTooltipEditBooking`}</h3></div>
                    <div className='col-md-5' />
                  </div>
                </div>
                <div className='card-body'>
                  <section className='notifications'>
                    <div>
                      <div className='row'>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanCommonLabelBookedBy`}<span className='error'>*</span></label>
                            <input type='text' value={this.state.bookingData.euUserId.name} className='form-control' id='TicketSubject' readOnly />
                            <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                            <p className='text-muted'><small style={{ color: 'red' }}>{this.state.tSubjectError}</small> </p>
                          </div>
                        </div>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanCommonLabelMobileNumber`}<span className='error'>*</span></label>
                            <input type='text' value={this.state.bookingData.euUserId.mobileNumber} className='form-control' id='ticketOn' readOnly disabled />
                            <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.ticketOnError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                            <p className='text-muted'><small style={{ color: 'red' }}>{this.state.ticketOnError}</small> </p>
                          </div>
                        </div>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanCommonLabelBookingCode`}<span className='error'>*</span></label>
                            <input type='text' value={this.state.bookingData.bookingCode} className='form-control' id='TicketSubject' readOnly disabled />
                            <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                            <p className='text-muted'><small style={{ color: 'red' }}>{this.state.tSubjectError}</small> </p>
                          </div>
                        </div>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanCommonLabelStatus`}<span className='error'>*</span></label>
                            <select value={this.state.bookingStatus} onChange={(event) => this.setState({ bookingStatus: event.target.value })}className='form-control' id='exampleFormControlSelect2'>
                              <option>Booked</option>
                              <option>Confirmed</option>
                              <option>Checked-In</option>
                              <option>Checked-Out</option>
                              <option>Completed</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanSPLabelAdults`}</label>
                            <div className='row'>
                              <div className='col-md-2'>
                                <button type='button' className='btn-minus'
                                  disabled={this.state.adults <= 1}
                                  onClick={() => this.handleAdultsDecrease(bookingData.spPropertyInfoId.membersCapacity, bookingData.spPropertyInfoId.childsCapacity)}
                                >
                                  <i className='fas fa-minus' />
                                </button>
                              </div>
                              <div className='col-md-2'>
                                <p className='text-center'>{this.state.adults}</p>
                              </div>
                              <div className='col-md-2'>
                                <button type='button' className='btn-plus'
                                  onClick={() => this.handleAdultIncrement(bookingData.spPropertyInfoId.membersCapacity, bookingData.spPropertyInfoId.childsCapacity)}
                                  disabled={parseInt(this.state.adults) > ((bookingData.spPropertyInfoId.activeRoomsCount) * (bookingData.spPropertyInfoId.membersCapacity) - 1) ||
                                  (parseInt(this.state.adults) + parseInt(this.state.childs) >
                                  ((bookingData.spPropertyInfoId.activeRoomsCount) * (parseInt(bookingData.spPropertyInfoId.membersCapacity) + parseInt(bookingData.spPropertyInfoId.childsCapacity)) - 1))}
                                >
                                  <i className='fas fa-plus' />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanSPLabelChilds`}</label>
                            <div className='row'>
                              <div className='col-md-2'>
                                <button type='button' className='btn-minus' disabled={this.state.childs <= 0}
                                  onClick={() => this.handleChildsDecrease(bookingData.spPropertyInfoId.membersCapacity, bookingData.spPropertyInfoId.childsCapacity)}
                                >
                                  <i className='fas fa-minus' />
                                </button>
                              </div>
                              <div className='col-md-2'>
                                <p className='text-center'>{this.state.childs}</p>
                              </div>
                              <div className='col-md-2'>
                                <button type='button' className='btn-plus'
                                  onClick={() => this.handleChildsIncrease(bookingData.spPropertyInfoId.membersCapacity, bookingData.spPropertyInfoId.childsCapacity)}
                                  disabled={(parseInt(this.state.childs) > (bookingData.spPropertyInfoId.activeRoomsCount) * (bookingData.spPropertyInfoId.childsCapacity) - 1) &&
                                      (parseInt(this.state.adults) > (bookingData.spPropertyInfoId.activeRoomsCount) * (bookingData.spPropertyInfoId.membersCapacity) - 1) ||
                                      (parseInt(this.state.adults) + parseInt(this.state.childs) >
                                      ((bookingData.spPropertyInfoId.activeRoomsCount) * (parseInt(bookingData.spPropertyInfoId.membersCapacity) + parseInt(bookingData.spPropertyInfoId.childsCapacity)) - 1))}
                                >
                                  <i className='fas fa-plus' />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanSPLabelRooms`}</label>
                            <div className='row'>
                              <div className='col-md-2'>
                                <button type='button' className='btn-minus' onClick={() => this.handleRooms('sub', bookingData.spPropertyInfoId.membersCapacity, bookingData.spPropertyInfoId.childsCapacity)}
                                  disabled={this.state.rooms <= 1}
                                >
                                  <i className='fas fa-minus' />
                                </button>
                              </div>
                              <div className='col-md-2'>
                                <p className='text-center'>{this.state.rooms}</p>
                              </div>
                              <div className='col-md-2'>
                                <button type='button' className='btn-plus' onClick={() => this.handleRooms('add', bookingData.spPropertyInfoId.membersCapacity, bookingData.spPropertyInfoId.childsCapacity)}
                                  disabled={bookingData.spPropertyInfoId.activeRoomsCount <= this.state.rooms}
                                >
                                  <i className='fas fa-plus' />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanCommonLabelCheckIn`} {t`lanCommonLabelDate`}<span className='error'>*</span></label>
                          <DatePicker
                            dateFormat='MMM dd, yyyy'
                            selected={this.state.checkInDate}
                          //   minDate={new Date()}
                            onChange={(checkInDate) => this.handleCheckInDate(checkInDate)}
                            onKeyDown={(event) => event.preventDefault()}
                          />
                          <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          <p className='text-muted'><small style={{ color: 'red' }}>{this.state.tSubjectError}</small> </p>
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanCommonLabelCheckOut`} {t`lanCommonLabelDate`}<span className='error'>*</span></label>
                          {/* <input type='date' value={this.state.checkOutDate} onChange={(e) => this.handleCheckOutDate(e)} className='form-control' id='ticketOn' /> */}
                          <DatePicker
                            dateFormat='MMM dd, yyyy'
                            selected={this.state.checkOutDate}
                            minDate={this.state.checkOutMinDate}
                            onChange={(checkInDate) => this.handleCheckOutDate(checkInDate)}
                            onKeyDown={(event) => event.preventDefault()}
                          />
                          <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.ticketOnError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          <p className='text-muted'><small style={{ color: 'red' }}>{this.state.ticketOnError}</small> </p>
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>Check-In Time<span className='error'>*</span></label>
                          {/* <input type='text' value={this.state.checkInTime} className='form-control' id='ticketOn' /> */}
                          <select value={this.state.checkInTime} onChange={(event) => this.handleCheckInTime(event)} multiple='' className='form-control'>
                            { this.state.checkInTimeArray.length > 0
                            ? this.state.checkInTimeArray.map((data, i) => {
                              return <option key={i} value={data}>{data}</option>
                            }) : '12:00 PM' }
                          </select>
                          <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.ticketOnError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          <p className='text-muted'><small style={{ color: 'red' }}>{this.state.ticketOnError}</small> </p>
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>Check-Out Time<span className='error'>*</span></label>
                          {/* <input type='text' value={this.state.checkOutTime} className='form-control' id='TicketSubject' /> */}
                          <select value={this.state.checkOutTime} onChange={(event) => this.handleCheckOutTime(event)} multiple='' className='form-control'>
                            {this.state.checkOutTimeArray.length > 0
                            ? this.state.checkOutTimeArray.map((data, i) => {
                              return <option key={i} value={data}>{data}</option>
                            })
                            : '11:00 AM'}
                          </select>
                          <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          <p className='text-muted'><small style={{ color: 'red' }}>{this.state.tSubjectError}</small> </p>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanSPLabelPaymentMode`}<span className='error'>*</span></label>
                          <select value={this.state.paymentMode} onChange={(e) => this.setState({ paymentMode: e.target.value })}className='form-control' id='exampleFormControlSelect2'>
                            <option>Please Select</option>
                            <option>Payed At Hotel</option>
                            <option>Credit/Debit</option>
                            <option>PAYTM</option>
                            <option>Mobile Wallet</option>
                            <option>Checked-Out</option>
                            <option>Completed</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanSPLabelPaymentStatus`}<span className='error'>*</span></label>
                          <select value={this.state.paymentStatus} onChange={(e) => this.setState({ paymentStatus: e.target.value })}className='form-control' id='exampleFormControlSelect2'>
                            <option>Pending</option>
                            <option>Paid</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>No Of Days/Hours<span className='error'>*</span></label>
                          <input type='text' value={`${this.state.totalDays} days / ${this.state.hours} hours`} className='form-control' id='TicketSubject' readOnly />
                          <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          <p className='text-muted'><small style={{ color: 'red' }}>{this.state.tSubjectError}</small> </p>
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanCommonLabelBookingAmount`} (₹)<span className='error'>*</span></label>
                          <input type='text' value={(this.state.rooms) * (this.state.totalPrice)} className='form-control' id='ticketOn' readOnly />
                          <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.ticketOnError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          <p className='text-muted'><small style={{ color: 'red' }}>{this.state.ticketOnError}</small> </p>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-12'>
                        <p style={{ color: 'red' }}>{this.state.errorMessage} </p>
                      </div>
                    </div>
                    <button disabled={this.state.buttonDisable} className='btn btn-primary update-edit' onClick={this.handleEditBooking}>{t`lanCommonButtonUpdate`}</button>
                    <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
ADHostEditHourlyBooking.propTypes = {
  bookingData: PropTypes.any
}
export default ADHostEditHourlyBooking
