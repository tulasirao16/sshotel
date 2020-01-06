/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import moment from 'moment'
import { t } from 'ttag'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class ADEUEditBookingComponent extends React.Component {
  constructor (props) {
    super(props)
    let bookingData = JSON.parse(localStorage.getItem('bookingData'))
    let checkInTime = moment(bookingData.checkInDate).format('hh:mm A')
    let checkInTimeSplit = checkInTime.split(' ')
    let checkInTimeHoursSplit = checkInTimeSplit[0].split(':')
    let checkOutTime = moment(bookingData.checkOutDate).format('hh:mm A')
    let checkOutTimeSplit = checkOutTime.split(' ')
    let checkOutTimeHoursSplit = checkOutTimeSplit[0].split(':')
    this.state = {
      bookingDate: bookingData,
      euName:bookingData.euName,
      euMobileNumber:bookingData.euMobileNumber,
      bookingType: bookingData.bookingType,
      bookingStatus: bookingData.bookingStatus,
      dummybookingStatus: bookingData.bookingStatus,
      checkInDate: moment(bookingData.checkInDate).format('YYYY-MM-DD'),
      currBaseCheckOutDate: moment(bookingData.checkOutDate).format('YYYY-MM-DD'),
      checkOutDate: moment(bookingData.checkOutDate).format('YYYY-MM-DD'),
      checkInTime: moment(bookingData.checkInDate).format('hh:mm A'),
      currBaseCheckOutTime: moment(bookingData.checkOutDate).format('hh:mm A'),
      checkOutTime: moment(bookingData.checkOutDate).format('hh:mm A'),
      totalDays: bookingData.totalDays,
      paymentStatus: bookingData.paymentStatus,
      paymentMode: bookingData && bookingData.paymentMode ? bookingData.paymentMode : 'Payed At Hotel',
      adults: bookingData.noOfAdults,
      childs: bookingData.noOfChilds,
      rooms: bookingData.noOfRooms,
      grandTotal: bookingData.bookingType === 'Base Price' ? bookingData.spPropertyInfoId.pricing.basePrice : bookingData.spPropertyInfoId.pricing.minBasePrice,
      checkInHours: checkInTimeHoursSplit[0],
      checkOutHours: checkOutTimeHoursSplit[0],
      checkInMinutes: checkInTimeHoursSplit[1],
      checkOutMinutes: checkOutTimeHoursSplit[1],
      checkInMeridiem: checkInTimeSplit[1],
      checkOutMeridiem: checkOutTimeSplit[1],
      errorMessage: '',
      checked: false,
      bookingsby: localStorage.getItem('bookingsby')
    }
    this.handleBookingtype = this.handleBookingtype.bind(this)
    this.handleBookingStatus = this.handleBookingStatus.bind(this)
    this.handleAdultIncrement = this.handleAdultIncrement.bind(this)
    this.handleAdultDecrement = this.handleAdultDecrement.bind(this)
    this.handleChildIncrement = this.handleChildIncrement.bind(this)
    this.handleChildDecrement = this.handleChildDecrement.bind(this)
    this.handleRooms = this.handleRooms.bind(this)
    this.handleCheckInDate = this.handleCheckInDate.bind(this)
    this.handleCheckOutDate = this.handleCheckOutDate.bind(this)
    this.handleCheckInTime = this.handleCheckInTime.bind(this)
    this.handleEditBooking = this.handleEditBooking.bind(this)
    this.handleUsers = this.handleUsers.bind(this)
    this.handleHome = this.handleHome.bind(this)
    // this.handleBack = this.handleBack.bind(this)
    this.handleHostDashboard = this.handleHostDashboard.bind(this)
    this.handleHostDashbaordBookings = this.handleHostDashbaordBookings.bind(this)
    this.handleDashbaordBookings = this.handleDashbaordBookings.bind(this)
    this.handleBookings = this.handleBookings.bind(this)
  }

  handleBookingtype (e) {
    if (e.target.value === 'Base Price') {
      let checkOutTime = this.state.currBaseCheckOutTime
      this.setState({
        bookingType: e.target.value,
        checkOutDate: this.state.currBaseCheckOutDate,
        checkOutHours: checkOutTime.substring(0, 2),
        checkOutMinutes: checkOutTime.substring(3, 5),
        checkOutMeridiem: checkOutTime.slice(-2),
        grandTotal: this.state.bookingDate.spPropertyInfoId.pricing.basePrice
      })
      this.getNumOfDays(this.state.checkInDate, this.state.currBaseCheckOutDate)
    } else {
      let checkInDateTime = moment(this.state.checkInDate + ' ' + this.state.checkInHours + ':' + this.state.checkInMinutes + ' ' + this.state.checkInMeridiem).format('YYYY-MM-DD hh:mm A')
      let checkOutDate = moment(checkInDateTime).add(this.state.bookingDate.spPropertyInfoId.pricing.minBasePriceUnitValue, 'hours').format('YYYY-MM-DD')
      let checkOutHours = moment(checkInDateTime).add(this.state.bookingDate.spPropertyInfoId.pricing.minBasePriceUnitValue, 'hours').format('hh:mm A')
      this.setState({
        bookingType: e.target.value,
        grandTotal: this.state.bookingDate.spPropertyInfoId.pricing.minBasePrice,
        checkOutDate: checkOutDate,
        checkOutHours: checkOutHours.substring(0, 2),
        checkOutMinutes: checkOutHours.substring(3, 5),
        checkOutMeridiem: checkOutHours.slice(-2)
      })
      this.getNumOfDays(this.state.checkInDate, checkOutDate)
    }
  }
  handleBookingStatus (e) {
    this.setState({ bookingStatus: e.target.value })
  }
  handleAdultIncrement (membersCapacity, childsCapacity) {
    let addValue = (this.state.adults + this.state.childs) + (1)
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
  handleAdultDecrement (membersCapacity, childsCapacity) {
    let addValue = (this.state.adults + this.state.childs) - (1)
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
  handleChildIncrement (membersCapacity, childsCapacity) {
    let adultsCapacity = this.state.adults
    let addValue = (this.state.adults + this.state.childs) + (1)
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
  handleChildDecrement (membersCapacity, childsCapacity) {
    let adultsCapacity = this.state.adults
    let addValue = (this.state.adults + this.state.childs) - (1)
    let numOfChildren = (this.state.childs) - 1
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
  handleRooms (value, membersCapacity, childsCapacity) {
    let numOfPeople = this.state.adults + this.state.childs
    let noOfAdults = this.state.adults
    let totalCapacity = parseInt(membersCapacity) + parseInt(childsCapacity)
    let RoomCount = (noOfAdults / parseInt(membersCapacity))
    let TotalRoomCount = (numOfPeople / totalCapacity)
    let totalIndex = TotalRoomCount % 1
    let index = RoomCount % 1
    let roomsCount = (index === 0) ? RoomCount : parseInt(RoomCount.toString().split('.')[0]) + 1
    let totalRoomsCount = (totalIndex === 0) ? TotalRoomCount : parseInt(TotalRoomCount.toString().split('.')[0]) + 1

    if (value === 'add') {
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
  handleCheckInDate (e) {
    this.setState({ checkInDate: e.target.value, errorMessage: '' })
    this.getNumOfDays(e.target.value, this.state.checkOutDate)
  }
  handleCheckOutDate (e) {
    let checkIn = moment(this.state.checkInDate + ' ' + this.state.checkInHours + ':' + this.state.checkInMinutes + ' ' + this.state.checkInMeridiem)
    let checkOutDate = moment(e.target.value + ' ' + this.state.checkOutHours + ':' + this.state.checkOutMinutes + ' ' + this.state.checkOutMeridiem)
    let duration = moment.duration(checkOutDate.diff(checkIn))
    let Hours = duration.asHours()
    if (Hours > this.state.bookingDate.spPropertyInfoId.pricing.minBasePriceUnitValue) {
      let checkOutDateTime = moment(this.state.checkInDate + ' ' + this.state.checkInHours + ':' + this.state.checkInMinutes + ' ' + this.state.checkInMeridiem, 'YYYY-MM-DD hh:mm A').add(22, 'h')
      let checkOutTime = moment(checkOutDateTime).format('hh:mm A')
      this.setState({
        checkOutDate: e.target.value,
        checkOutHours: checkOutTime.substring(0, 2),
        checkOutMinutes: checkOutTime.substring(3, 5),
        checkOutMeridiem: checkOutTime.slice(-2),
        bookingType: 'Base Price',
        currBaseCheckOutDate: e.target.value,
        errorMessage: ''
      })
    } else {
      this.setState({ checkOutDate: e.target.value, currBaseCheckOutDate: e.target.value, errorMessage: '' })
    }
    this.getNumOfDays(this.state.checkInDate, e.target.value)
  }
  getNumOfDays = (checkInDate, checkOutDate) => {
    var checkIn = moment.utc(checkInDate)
    var checkOut = moment.utc(checkOutDate)
    var duration = moment.duration(checkOut.diff(checkIn))
    var days = duration.asDays()
    this.setState({ totalDays: days === 0 ? 1 : days })
  }
  handleCheckInTime (value, e) {
    let checkInDate = moment(this.state.checkInDate).format('YYYY-MM-DD')
    if (value === 'hours') {
      let checkInDateTime = moment(checkInDate + ' ' + e.target.value + ':' + this.state.checkInMinutes + ' ' + this.state.checkInMeridiem).format('YYYY-MM-DD hh:mm A')
      let checkOutDate = moment(checkInDateTime).add(this.state.bookingDate.spPropertyInfoId.pricing.minBasePriceUnitValue, 'hours').format('YYYY-MM-DD')
      let checkOutHours = moment(checkInDateTime).add(this.state.bookingDate.spPropertyInfoId.pricing.minBasePriceUnitValue, 'hours').format('hh:mm A')
      this.setState({ checkInHours: e.target.value, checkOutHours: checkOutHours.substring(0, 2), checkOutMinutes: checkOutHours.substring(3, 5), checkOutMeridiem: checkOutHours.slice(-2), checkOutDate: checkOutDate })
    } else if (value === 'minutes') {
      let checkInDateTime = moment(checkInDate + ' ' + this.state.checkInHours + ':' + e.target.value + ' ' + this.state.checkInMeridiem).format('YYYY-MM-DD hh:mm A')
      let checkOutDate = moment(checkInDateTime).add(this.state.bookingDate.spPropertyInfoId.pricing.minBasePriceUnitValue, 'hours').format('YYYY-MM-DD')
      let checkOutHours = moment(checkInDateTime).add(this.state.bookingDate.spPropertyInfoId.pricing.minBasePriceUnitValue, 'hours').format('hh:mm A')
      this.setState({ checkInMinutes: e.target.value, checkOutHours: checkOutHours.substring(0, 2), checkOutMinutes: checkOutHours.substring(3, 5), checkOutMeridiem: checkOutHours.slice(-2), checkOutDate: checkOutDate })
    } else {
      let checkInDateTime = moment(checkInDate + ' ' + this.state.checkInHours + ':' + this.state.checkInMinutes + ' ' + e.target.value).format('YYYY-MM-DD hh:mm A')
      let checkOutDate = moment(checkInDateTime).add(this.state.bookingDate.spPropertyInfoId.pricing.minBasePriceUnitValue, 'hours').format('YYYY-MM-DD')
      let checkOutHours = moment(checkInDateTime).add(this.state.bookingDate.spPropertyInfoId.pricing.minBasePriceUnitValue, 'hours').format('hh:mm A')
      this.setState({ checkInMeridiem: e.target.value,
        checkOutHours: checkOutHours.substring(0, 2),
        checkOutMinutes: checkOutHours.substring(3, 5),
        checkOutMeridiem: checkOutHours.slice(-2),
        checkOutDate: checkOutDate
      })
    }
  }
  handleCheckInHours (e) {
    if (this.state.bookingType === 'Minimum Base Price') {
      let checkInDateTime = moment(this.state.checkInDate + ' ' + e.target.value + ':' + this.state.checkInMinutes + ' ' + this.state.checkInMeridiem).format('YYYY-MM-DD hh:mm A')
      let checkOutDate = moment(checkInDateTime).add(this.state.bookingDate.spPropertyInfoId.pricing.minBasePriceUnitValue, 'hours').format('YYYY-MM-DD')
      let checkOutTime = moment(checkInDateTime).add(this.state.bookingDate.spPropertyInfoId.pricing.minBasePriceUnitValue, 'hours').format('hh:mm A')
      this.setState({
        checkInHours: e.target.value,
        grandTotal: this.state.bookingDate.spPropertyInfoId.pricing.minBasePrice,
        checkOutDate: checkOutDate,
        checkOutHours: checkOutTime.substring(0, 2),
        checkOutMinutes: checkOutTime.substring(3, 5),
        checkOutMeridiem: checkOutTime.slice(-2)
      })
      this.getNumOfDays(this.state.checkInDate, checkOutDate)
    } else {
    }
  }
  handleEditBooking () {
    let bookingData = this.state.bookingDate
    let checkInTime = this.state.checkInTime
    let checkOutTime = this.state.checkOutTime
    let checkInDateValue = moment(this.state.checkInDate).valueOf()
    let checkOutDateValue = moment(this.state.checkOutDate).valueOf()
    let bookingCheckInDate = moment(bookingData.checkInDate).format('YYYY-MM-DD')
    let bookingCheckOutDate = moment(bookingData.checkOutDate).format('YYYY-MM-DD')
    let DataCheckInvalue = moment(bookingCheckInDate).valueOf()
    let DataCheckOutvalue = moment(bookingCheckOutDate).valueOf()
    let CheckInDateTimeVale = moment(this.state.checkInDate + ' ' + this.state.checkInHours + ':' + this.state.checkInMinutes + ' ' + this.state.checkInMeridiem).valueOf()
    let CheckOutDateTimeVale = moment(this.state.checkOutDate + ' ' + this.state.checkOutHours + ':' + this.state.checkOutMinutes + ' ' + this.state.checkOutMeridiem).valueOf()
    if (CheckOutDateTimeVale < CheckInDateTimeVale) {
      this.setState({ errorMessage: t`lanSPLabelErrorCheckOutGreaterCheckIn` })
    } else if (this.state.checkInDate === null || this.state.checkInDate === undefined || this.state.checkInDate === '') {
      this.setState({ errorMessage: t`lanSPLabelErrorCheckInDateRequired` })
    } else if (this.state.checkOutDate === null || this.state.checkOutDate === undefined || this.state.checkOutDate === '') {
      this.setState({ errorMessage: t`lanSPLabelErrorCheckOutDateRequired` })
    } else if (this.state.bookingType === bookingData.bookingType && this.state.bookingStatus === bookingData.bookingStatus && this.state.totalDays === bookingData.totalDays &&
      this.state.paymentStatus === bookingData.paymentStatus && this.state.adults === bookingData.noOfAdults && this.state.childs === bookingData.noOfChilds && this.state.rooms === bookingData.noOfRooms &&
      this.state.checkInHours === checkInTime.substring(0, 2) && this.state.checkInMinutes === checkInTime.substring(3, 5) && this.state.checkInMeridiem === checkInTime.slice(-2) &&
      this.state.checkOutHours === checkOutTime.substring(0, 2) && this.state.checkOutMinutes === checkOutTime.substring(3, 5) && this.state.checkOutMeridiem === checkOutTime.slice(-2) &&
      checkInDateValue === DataCheckInvalue && checkOutDateValue === DataCheckOutvalue && this.state.paymentMode === bookingData.paymentMode) {
      let _this = this
      _this.props.handleBack()
    } else {
      let checkInHours = moment(this.state.checkInHours + ':' + this.state.checkInMinutes + ' ' + this.state.checkInMeridiem, ['h:mm A']).format('HH:mm')
      let checkOutHours = moment(this.state.checkOutHours + ':' + this.state.checkOutMinutes + ' ' + this.state.checkOutMeridiem, ['h:mm A']).format('HH:mm')
      let putJson = {
        bookingCode: bookingData.bookingCode,
        euName: this.state.euName,
        euMobileNumber: this.state.euMobileNumber,
        noOfAdults: this.state.adults,
        noOfChilds: this.state.childs.toString(),
        noOfRooms: this.state.rooms,
        totalDays: this.state.totalDays,
        checkInDate: this.state.checkInDate + ' ' + checkInHours,
        checkOutDate: this.state.checkOutDate + ' ' + checkOutHours,
        bookingStatus: this.state.bookingStatus,
        paymentMode: this.state.paymentMode,
        totalPrice: (this.state.rooms) * (this.state.totalDays) * (this.state.bookingType === 'Minimum Base Price' ? bookingData.spPropertyInfoId.pricing.minBasePrice : bookingData.spPropertyInfoId.pricing.basePrice),
        paymentStatus: this.state.paymentStatus,
        lifeCyclebookingStatus: this.state.bookingStatus,
        bookingType: this.state.bookingType
      }
      let _this = this
      let obj = { url: config.baseUrl + config.putADEUBookingsHistoryUpdateAPI + _this.state.bookingDate._id, body: putJson }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj) {
          if (_this.state.bookingsby === 'hostdashboard') {
            if (resObj.data.statusCode === '0000') {
              toast.success('Booking Updated Successfully', {
                position: toast.POSITION.TOP_CENTER
              })
              setTimeout(() => {
                hashHistory.push('admin/host-dashboard/bookings')
              }, 1000)
            }
          } else if (_this.state.bookingsby === 'dashboard') {
            if (resObj.data.statusCode === '0000') {
              toast.success('Booking Updated Successfully', {
                position: toast.POSITION.TOP_CENTER
              })
              setTimeout(() => {
                hashHistory.push('admin/home')
              }, 1000)
            }
          } else {
            if (resObj.data.statusCode === '0000') {
              toast.success('Booking Updated Successfully', {
                position: toast.POSITION.TOP_CENTER
              })
              setTimeout(() => {
                _this.props.handleBack(resObj.data.statusResult)
              }, 1000)
            }
          }
        } else {
          toast.error('Booking Update failed try again', {
            position: toast.POSITION.TOP_CENTER
          })
        }
      })
    }
  }
  handleUsers () {
    hashHistory.push('/admin/eu-users')
    event.preventDefault()
  }
  handleHome () {
    hashHistory.push('admin/home')
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
  componentWillUnmount () {
    localStorage.removeItem('bookingsby')
  }

  render () {
    let bookingDate = this.state.bookingDate
    return (
      <div className='main-content' id='panel'>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  {this.state.bookingsby === 'dashboard' || this.state.bookingsby === 'hostdashboard'
                  ? ''
                  : <h6 className='h2 text-white d-inline-block mb-0'>{t`lanADEUTitleAdminEUUsers`}</h6>
                }
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        {this.state.bookingsby === 'dashboard'
                      ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item' />
                        <li className='breadcrumb-item'><a onClick={this.handleDashbaordBookings}>Bookings List</a></li>
                        <li className='breadcrumb-item active' aria-current='page'>BookingsEdit</li>
                      </ol>
                       : this.state.bookingsby === 'hostdashboard'
                       ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                         <li className='breadcrumb-item' />
                         <li className='breadcrumb-item'><a onClick={this.handleHostDashboard}>HostDashboards</a></li>
                         <li className='breadcrumb-item'><a onClick={this.handleHostDashbaordBookings}>Bookings List</a></li>
                         <li className='breadcrumb-item active' aria-current='page'>BookingsEdit</li>
                       </ol>
                      : <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item' />
                        <li className='breadcrumb-item'><a onClick={this.handleUsers}>EU Users</a></li>
                        <li className='breadcrumb-item' aria-current='page'><a onClick={this.handleBookings}>{t`lanCommonTitleBookings`}</a></li>
                        <li className='breadcrumb-item active' aria-current='page'>BookingsEdit</li>
                      </ol>
                       }
                      </ol>
                    </ol>
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
                            <label className='form-control-label'>{t`lanSPLabelSelectPriceType`} <span className='error'>*</span></label>
                            <select value={this.state.bookingType} onChange={(value) => this.handleBookingtype(value)}className='form-control' id='exampleFormControlSelect2'>
                              <option>Base Price</option>
                              <option>Minimum Base Price</option>
                            </select>
                          </div>
                        </div>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>BookedFor<span className='error'>*</span></label>
                            <input type='text' value={this.state.euName} onChange={(e) => this.setState({ euName : e.target.value })} className='form-control' id='TicketSubject' />
                            <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                            <p className='text-muted'><small style={{ color: 'red' }}>{this.state.tSubjectError}</small> </p>
                          </div>
                        </div>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanCommonLabelMobileNumber`}<span className='error'>*</span></label>
                            <input type='text' value={this.state.euMobileNumber} onChange={(e) => this.setState({ euMobileNumber : e.target.value })} className='form-control' id='ticketOn' maxLength={10} />
                            <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.ticketOnError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                            <p className='text-muted'><small style={{ color: 'red' }}>{this.state.ticketOnError}</small> </p>
                          </div>
                        </div>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanCommonLabelBookingCode`}<span className='error'>*</span></label>
                            <input type='text' value={this.state.bookingDate.bookingCode} className='form-control' id='TicketSubject' />
                            <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                            <p className='text-muted'><small style={{ color: 'red' }}>{this.state.tSubjectError}</small> </p>
                          </div>
                        </div>
                      </div>
                      {this.state.dummybookingStatus === 'Cancelled'
                      ? <div className='row'><div className='col-md-3'>
                        <div className='form-group'>
                          <label className='form-control-label'>Current Booking Status<span className='error'>*</span></label>
                          <input className='form-control error' type='text' value={this.state.dummybookingStatus} id='TicketSubject' />
                          <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                          <p className='text-muted'><small style={{ color: 'red' }}>{this.state.tSubjectError}</small> </p>
                        </div>
                      </div></div> : null }
                      <div className='row'>
                        {this.state.dummybookingStatus === 'Cancelled'
                          ? <div className='col-md-3'>
                            <div className='form-group'>
                              <label className='form-control-label'>{t`lanCommonLabelStatus`}<span className='error'>*</span></label>
                              <select value={this.state.bookingStatus} onChange={(value) => this.handleBookingStatus(value)}className='form-control' id='exampleFormControlSelect2'>
                                <option>Please select booking status</option>
                                <option>Booked</option>
                                <option>Confirmed</option>
                                <option>Checked-In</option>
                                <option>Checked-Out</option>
                                <option>Completed</option>
                              </select>
                            </div>
                          </div>
                          : <div className='col-md-3'>
                            <div className='form-group'>
                              <label className='form-control-label'>{t`lanCommonLabelStatus`}<span className='error'>*</span></label>
                              <select value={this.state.bookingStatus} onChange={(value) => this.handleBookingStatus(value)}className='form-control' id='exampleFormControlSelect2'>
                                <option>Booked</option>
                                <option>Confirmed</option>
                                <option>Checked-In</option>
                                <option>Checked-Out</option>
                                <option>Completed</option>
                              </select>
                            </div>
                          </div>
                        }
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanSPLabelAdults`}</label>
                            <div className='row'>
                              <div className='col-md-2'>
                                <button type='button' className='btn-minus'
                                  disabled={this.state.adults <= 1}
                                  onClick={() => this.handleAdultDecrement(bookingDate.spPropertyInfoId.membersCapacity, bookingDate.spPropertyInfoId.childsCapacity)}
                                >
                                  <i className='fas fa-minus' />
                                </button>
                              </div>
                              <div className='col-md-2'>
                                <p className='text-center'>{this.state.adults}</p>
                              </div>
                              <div className='col-md-2'>
                                <button type='button' className='btn-plus'
                                  onClick={() => this.handleAdultIncrement(bookingDate.spPropertyInfoId.membersCapacity, bookingDate.spPropertyInfoId.childsCapacity)}
                                  disabled={parseInt(this.state.adults) > ((bookingDate.spPropertyInfoId.activeRoomsCount) * (bookingDate.spPropertyInfoId.membersCapacity) - 1) ||
                                    (parseInt(this.state.adults) + parseInt(this.state.childs) >
                                    ((bookingDate.spPropertyInfoId.activeRoomsCount) * (parseInt(bookingDate.spPropertyInfoId.membersCapacity) + parseInt(bookingDate.spPropertyInfoId.childsCapacity)) - 1))}
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
                                  onClick={() => this.handleChildDecrement(bookingDate.spPropertyInfoId.membersCapacity, bookingDate.spPropertyInfoId.childsCapacity)}
                                >
                                  <i className='fas fa-minus' />
                                </button>
                              </div>
                              <div className='col-md-2'>
                                <p className='text-center'>{this.state.childs}</p>
                              </div>
                              <div className='col-md-2'>
                                <button type='button' className='btn-plus'
                                  onClick={() => this.handleChildIncrement(bookingDate.spPropertyInfoId.membersCapacity, bookingDate.spPropertyInfoId.childsCapacity)}
                                  disabled={(parseInt(this.state.childs) > (bookingDate.spPropertyInfoId.activeRoomsCount) * (bookingDate.spPropertyInfoId.childsCapacity) - 1) &&
                                    (parseInt(this.state.adults) > (bookingDate.spPropertyInfoId.activeRoomsCount) * (bookingDate.spPropertyInfoId.membersCapacity) - 1) ||
                                    (parseInt(this.state.adults) + parseInt(this.state.childs) >
                                    ((bookingDate.spPropertyInfoId.activeRoomsCount) * (parseInt(bookingDate.spPropertyInfoId.membersCapacity) + parseInt(bookingDate.spPropertyInfoId.childsCapacity)) - 1))}
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
                                <button type='button' className='btn-minus' onClick={() => this.handleRooms('sub', bookingDate.spPropertyInfoId.membersCapacity, bookingDate.spPropertyInfoId.childsCapacity)}
                                  disabled={this.state.rooms <= 1}
                                >
                                  <i className='fas fa-minus' />
                                </button>
                              </div>
                              <div className='col-md-2'>
                                <p className='text-center'>{this.state.rooms}</p>
                              </div>
                              <div className='col-md-2'>
                                <button type='button' className='btn-plus' onClick={() => this.handleRooms('add', bookingDate.spPropertyInfoId.membersCapacity, bookingDate.spPropertyInfoId.childsCapacity)}
                                  disabled={bookingDate.spPropertyInfoId.activeRoomsCount <= this.state.rooms}
                                >
                                  <i className='fas fa-plus' />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanCommonLabelCheckIn`} {t`lanCommonLabelDate`}<span className='error'>*</span></label>
                            <input type='date' value={this.state.checkInDate} onChange={(e) => this.handleCheckInDate(e)} className='form-control' id='TicketSubject' />
                            <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                            <p className='text-muted'><small style={{ color: 'red' }}>{this.state.tSubjectError}</small> </p>
                          </div>
                        </div>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanCommonLabelCheckOut`} {t`lanCommonLabelDate`}<span className='error'>*</span></label>
                            <input type='date' value={this.state.checkOutDate} onChange={(e) => this.handleCheckOutDate(e)} className='form-control' id='ticketOn' />
                            <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.ticketOnError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                            <p className='text-muted'><small style={{ color: 'red' }}>{this.state.ticketOnError}</small> </p>
                          </div>
                        </div>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanSPLabelHours`}<span className='error'>*</span></label>
                            <select value={this.state.checkInHours} onChange={this.state.bookingType === 'Minimum Base Price'
                            ? (e) => this.handleCheckInTime('hours', e)
                            : (e) => this.setState({ checkInHours: e.target.value })} multiple='' className='form-control' id='exampleFormControlSelect2'>
                              <option>01</option>
                              <option>02</option>
                              <option>03</option>
                              <option>04</option>
                              <option>05</option>
                              <option>06</option>
                              <option>07</option>
                              <option>08</option>
                              <option>09</option>
                              <option>10</option>
                              <option>11</option>
                              <option>12</option>
                            </select>
                          </div>
                        </div>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanSPLabelMinutes`}<span className='error'>*</span></label>
                            <select value={this.state.checkInMinutes} onChange={this.state.bookingType === 'Minimum Base Price' ? (e) => this.handleCheckInTime('minutes', e)
                            : (e) => this.setState({ checkInMinutes: e.target.value })} multiple='' className='form-control' id='exampleFormControlSelect2'>
                              <option>00</option>
                              <option>15</option>
                              <option>30</option>
                              <option>45</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanSPLabelMeridiem`}<span className='error'>*</span></label>
                            <select value={this.state.checkInMeridiem} onChange={this.state.bookingType === 'Minimum Base Price' ? (e) => this.handleCheckInTime('meridiem', e)
                            : (e) => this.setState({ checkInMeridiem: e.target.value })} multiple='' className='form-control' id='exampleFormControlSelect2'>
                              <option>AM</option>
                              <option>PM</option>
                            </select>
                          </div>
                        </div>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanSPLabelHours`}<span className='error'>*</span></label>
                            <select value={this.state.checkOutHours} onChange={this.state.bookingType === 'Minimum Base Price' ? null
                            : (e) => this.setState({ checkOutHours: e.target.value })} multiple='' className='form-control' id='exampleFormControlSelect2'>
                              <option>01</option>
                              <option>02</option>
                              <option>03</option>
                              <option>04</option>
                              <option>05</option>
                              <option>06</option>
                              <option>07</option>
                              <option>08</option>
                              <option>09</option>
                              <option>10</option>
                              <option>11</option>
                              <option>12</option>
                            </select>
                          </div>
                        </div>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanSPLabelMinutes`}<span className='error'>*</span></label>
                            <select value={this.state.checkOutMinutes} onChange={this.state.bookingType === 'Minimum Base Price' ? null
                            : (e) => this.setState({ checkOutMinutes: e.target.value })} multiple='' className='form-control' id='exampleFormControlSelect2'>
                              <option>00</option>
                              <option>15</option>
                              <option>30</option>
                              <option>45</option>
                            </select>
                          </div>
                        </div>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanSPLabelMeridiem`}<span className='error'>*</span></label>
                            <select value={this.state.checkOutMeridiem} onChange={this.state.bookingType === 'Minimum Base Price' ? null
                            : (e) => this.setState({ checkOutMeridiem: e.target.value })} multiple='' className='form-control' id='exampleFormControlSelect2'>
                              <option>AM</option>
                              <option>PM</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanSPLabelPaymentMode`}<span className='error'>*</span></label>
                            <select value={this.state.paymentMode} onChange={(e) => this.setState({ paymentMode: e.target.value })}className='form-control' id='exampleFormControlSelect2'>
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
                            <label className='form-control-label'>{t`lanSPLabelTotalDays`} (#)<span className='error'>*</span></label>
                            <input type='text' value={this.state.totalDays} onChange={(e) => this.setState({ totalDays : e.target.value })} className='form-control' id='TicketSubject' />
                            <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                            <p className='text-muted'><small style={{ color: 'red' }}>{this.state.tSubjectError}</small> </p>
                          </div>
                        </div>
                        <div className='col-md-3'>
                          <div className='form-group'>
                            <label className='form-control-label'>{t`lanCommonLabelBookingAmount`} (₹)<span className='error'>*</span></label>
                            <input type='text' value={(this.state.rooms) * (this.state.totalDays) * (this.state.grandTotal)} className='form-control' id='ticketOn' />
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
                      <button className='btn btn-primary update-edit' onClick={this.handleEditBooking}>{t`lanCommonButtonUpdate`}</button>
                      <ToastContainer rtl />
                    </div>
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

ADEUEditBookingComponent.propTypes = {
  handleBack: PropTypes.any
}
export default ADEUEditBookingComponent
