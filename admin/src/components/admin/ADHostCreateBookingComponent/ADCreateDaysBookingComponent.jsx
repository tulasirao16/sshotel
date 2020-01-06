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
import TimePicker from 'rc-time-picker'
import { hashHistory } from 'react-router'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import '../css/Bookings.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

const format = 'hh:mm A'
class ADCreateDaysBookingComponent extends React.Component {
  constructor (props) {
    super(props)
    const propertyInfoData = JSON.parse(localStorage.getItem('propertyInfoViewObj'))
    let checkInDate = new Date(moment().format('YYYY-MM-DD'))
    let checkInDateFormat = moment(checkInDate).format('YYYY-MM-DD')
    let dt = moment(checkInDateFormat, 'YYYY-MM-DD HH:mm:ss')
    let dateName = dt.format('dddd')
    let weekEnd = dateName === 'Saturday' || dateName === 'Sunday'
    this.state = {
      propertyInfoData: JSON.parse(localStorage.getItem('propertyInfoViewObj')),
      mobileNumber: '',
      email: '',
      name: '',
      euUserId: '',
      checkInDate:  new Date(moment().format('YYYY-MM-DD')),
      checkOutDate:  new Date(moment().add(1, 'day').format('YYYY-MM-DD')),
      checkInTime: propertyInfoData.pricing.checkInTime ? propertyInfoData.pricing.checkInTime : '12:00 PM',
      checkOutTime: propertyInfoData.pricing.checkOutTime ? propertyInfoData.pricing.checkOutTime : '11:00 AM',
      maxDate: new Date(moment().add(3, 'month').endOf('month').format('YYYY-MM-DD')),
      amountPerDay: weekEnd ? propertyInfoData.pricing.weekEndTotalPrice : propertyInfoData.pricing.totalPrice,
      amount: weekEnd ? propertyInfoData.pricing.weekEndTotalPrice : propertyInfoData.pricing.totalPrice,
      totalDays: 1,
      noOfDays: 1,
      numOfPeople: 2,
      numOfAdults: 2,
      numOfChilds: 0,
      numOfRooms: 1,
      errorMessage: '',
      roomSubButton: false,
      buttonDisabled: true,
      buttonEnabled: false,
      BookingBlocked: '',
      propertyBlocked: false,
      avaliableRoomCount: 0,
      validUser: false,
      handleBookNowButtonMobile: false,
      handleBookNowButtonEmail: false
    }
    this.handleCheckInDate = this.handleCheckInDate.bind(this)
    this.handleCheckOutDate = this.handleCheckOutDate.bind(this)
    this.getNumberOfRoomsCount = this.getNumberOfRoomsCount.bind(this)
    this.handleDaysAmount = this.handleDaysAmount.bind(this)
    this.handleAdultDecrement = this.handleAdultDecrement.bind(this)
    this.handleAdultIncrement = this.handleAdultIncrement.bind(this)
    this.handleChildIncrement = this.handleChildIncrement.bind(this)
    this.handleChildDecrement = this.handleChildDecrement.bind(this)
    this.handleRooms = this.handleRooms.bind(this)
    this.handleMobileGetDetails = this.handleMobileGetDetails.bind(this)
    this.handleEmailGetDetails = this.handleEmailGetDetails.bind(this)
    this.handleCreateBooking = this.handleCreateBooking.bind(this)
  }
  componentWillMount () {
    this.getNumberOfRoomsCount(this.state.checkInDate, this.state.checkOutDate, this.state.checkInTime, this.state.checkOutTime)
    this.handleDaysAmount(this.state.checkInDate, this.state.checkOutDate)
    this.getNumOfDays(this.state.checkInDate, this.state.checkOutDate)
  }
  handleCheckInDate (checkInDate) {
    let checkInDateValue = moment(checkInDate, 'YYYY-MM-DD').valueOf()
    let currentDay = moment().format('YYYY-MM-DD')
    let currentDayValue = moment.utc(currentDay, 'YYYY-MM-DD').valueOf()
    if (checkInDateValue > currentDayValue) {
      this.setState({ checkInDate: new Date(checkInDate), checkOutDate: new Date(moment(checkInDate).add(this.state.totalDays, 'day').format('YYYY-MM-DD')) })
      this.getNumberOfRoomsCount(new Date(checkInDate), new Date(moment(checkInDate).add(this.state.totalDays, 'day').format('YYYY-MM-DD')), this.state.checkInTime, this.state.checkOutTime)
      this.getNumOfDays(new Date(checkInDate), new Date(moment(checkInDate).add(this.state.totalDays, 'day').format('YYYY-MM-DD')))
      this.handleDaysAmount(new Date(checkInDate))
    } else {
      this.setState({ checkInDate: new Date(checkInDate) })
      this.getNumberOfRoomsCount(new Date(checkInDate), this.state.checkOutDate, this.state.checkInTime, this.state.checkOutTime)
      this.getNumOfDays(new Date(checkInDate), this.state.checkOutDate)
      this.handleDaysAmount(new Date(checkInDate))
    }
  }
  handleCheckOutDate (checkOutDate) {
    let checkInDateValue = moment(this.state.checkInDate, 'YYYY-DD-MM').valueOf()
    let checkOutDateValue = moment(checkOutDate, 'YYYY-DD-MM').valueOf()
    if (checkOutDateValue < checkInDateValue) {
      ToastsStore.error(t`lanSPLabelErrorCheckOutDateShouldNotBeLessThanCheckInDate`)
    } else {
      this.setState({ checkOutDate: new Date(checkOutDate) })
      this.getNumberOfRoomsCount(this.state.checkInDate, new Date(checkOutDate), this.state.checkInTime, this.state.checkOutTime)
      this.getNumOfDays(this.state.checkInDate, new Date(checkOutDate))
    }
  }
  getNumberOfRoomsCount (checkInDate, checkOutDate, checkInTime, checkOutTime) {
    let cidt = moment(checkInDate || this.state.checkInDate).format('YYYY-MM-DD')
    let codt = moment(checkOutDate || this.state.checkOutDate).format('YYYY-MM-DD')
    let checkInHours = moment(checkInTime || this.state.checkInTime, ['hh:mm A']).format('HH:mm')
    let checkOutHours = moment(checkOutTime || this.state.checkOutTime, ['hh:mm A']).format('HH:mm')
    let body = {
      noOfRooms: this.state.numOfRooms,
      checkInDate: cidt + ' ' + checkInHours,
      checkOutDate: codt + ' ' + checkOutHours,
      spPropertyInfoId: this.state.propertyInfoData._id,
      spServiceProviderId: this.state.propertyInfoData.spServiceProviderId,
      propertyId: this.state.propertyInfoData.propertyId._id ? this.state.propertyInfoData.propertyId._id : this.state.propertyInfoData.propertyId
    }
    let obj = { url: config.baseUrl + config.postEUBookingRoomsCountAPI, body: body }
    let _this = this
    APICallManager.postCall(obj, function (resObj) {
      if (resObj.data.statusCode === '1017') {
        _this.setState({ BookingBlocked: t`lanSPLabelErrorServiceIsNotAvailableOnSelectedDates`, propertyBlocked: true })
      } else if (resObj.data.statusCode === '0000') {
        if (resObj.data.statusResult.bookingCount >= resObj.data.statusResult.activeRoomsCount) {
          _this.setState({ BookingBlocked: t`lanSPLabelErrorNoRoomsAreAvailable`, propertyBlocked: true })
        } else {
          _this.setState({ avaliableRoomCount: resObj.data.statusResult.activeRoomsCount - resObj.data.statusResult.bookingCount, propertyBlocked: false, BookingBlocked: '' })
        }
      }
    })
  }
  getNumOfDays = (checkInDate, checkOutDate) => {
    var checkIn = moment.utc(checkInDate)
    var checkOut = moment.utc(checkOutDate)
    var duration = moment.duration(checkOut.diff(checkIn))
    var days = duration.asDays()
    this.setState({ noOfDays: days === 0 ? 1 : days })
  }
  handleDaysAmount (checkInDate) {
    let propertyInfoData = JSON.parse(localStorage.getItem('propertyInfoViewObj'))
    let pricing = propertyInfoData.pricing
    let checkInDateFormat = moment(checkInDate).format('YYYY-MM-DD')
    let dt = moment(checkInDateFormat, 'YYYY-MM-DD HH:mm:ss')
    let dateName = dt.format('dddd')
    let weekEnd = dateName === 'Saturday' || dateName === 'Sunday'
    if (weekEnd) {
      this.setState({ amount: pricing.weekEndTotalPrice })
    } else {
      this.setState({ amount: pricing.totalPrice })
    }
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
      ToastsStore.error(t`lanSPLabelErrorPleaseProvideMobileNumber`)
    } else if (reg.test(this.state.mobileNumber) === false) {
      ToastsStore.error(t`lanSPLabelErrorInvalidNumberPleaseProvideAValidMobileNumber`)
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
      // eslint-disable-next-line no-useless-escape
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
    // eslint-disable-next-line no-useless-escape
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
      noOfDays: this.state.noOfDays,
      checkInDate: cidt + ' ' + checkInHours,
      checkOutDate: codt + ' ' + checkOutHours,
      noOfChilds: this.state.numOfChilds.toString(),
      noOfAdults: this.state.numOfAdults,
      noOfRooms: this.state.numOfRooms,
      spPropertyId: propertyData.propertyId._id ? propertyData.propertyId._id : propertyData.propertyId,
      spPropertyTitle: propertyData.propertyTitle,
      spPropertyType:  propertyData.propertyType,
      spPropertyInfoId: propertyData._id,
      totalPrice: (this.state.numOfRooms) * (this.state.noOfDays) * (this.state.amount),
      validUser: this.state.validUser,
      bookingType: 'Days'
    }
    if (this.state.checkInDate === null || this.state.checkInDate === undefined || this.state.checkInDate === '') {
      this.setState({ errorMessage: t`lanSPLabelErrorCheckInDateRequired` })
    } else if (this.state.checkOutDate === null || this.state.checkOutDate === undefined || this.state.checkOutDate === '') {
      this.setState({ errorMessage: t`lanSPLabelErrorCheckOutDateRequired` })
    } else if (codt < cidt) {
      this.setState({ errorMessage: t`lanSPLabelErrorCheckOutGreaterCheckIn` })
    } else if (this.state.mobileNumber === '' || this.state.mobileNumber === 'undefined') {
      ToastsStore.error('Please Enter Mobile number')
    } else if (reg.test(this.state.mobileNumber) === false) {
      ToastsStore.error(t`lanSPLabelErrorInvalidMobile`)
    } else if (!this.state.validUser && !this.state.handleBookNowButtonMobile) {
      ToastsStore.error(t`lanSPLabelErrorPleaseClickOnMobileNumberGetDetailsToGetUserDetails`)
    } else if (this.state.email === '' || this.state.email === 'undefined') {
      ToastsStore.error('Please Enter Email')
    } else if (emailreg.test(this.state.email) === false) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidEmail` })
    } else if (!this.state.validUser && !this.state.handleBookNowButtonEmail) {
      ToastsStore.error(t`lanSPLabelErrorPleaseClickOnEmailGetDetailsToGetUserDetails`)
    } else if (!this.state.name.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorNameRequired` })
    } else {
      this.setState({ propertyBlocked: true })
      let _this = this
      let obj = { url: config.baseUrl + config.postSPEndUserBookingAPI, body: postJson }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          ToastsStore.success(t`lanSPLabelSuccessBookingSuccessfully`)
          setTimeout(() => {
            hashHistory.push('/admin/host/property/bookings')
          }, 2000)
        } else if (resObj.data.statusCode === '1017') {
          ToastsStore.error(resObj.data.statusMessage)
          _this.setState({ propertyBlocked: false })
        } else {
          ToastsStore.error(t`lanSPLabelErrorBookingFailedTryAgain`)
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
                minDate={addDays(this.state.checkInDate, 1)}
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
              <label className='form-control-label'>{t`lanSPLabelCheckInTime`}<span className='error'>*</span></label>
              <TimePicker
                showSecond={false}
                value={moment(this.state.checkInTime, format)}
                className='xxx'
                minuteStep={15}
                format={format}
                use12Hours
                disabled
                inputReadOnly
              />
              <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 13 } : { opacity: 0 }} /></span>
              <p className='text-muted'><small style={{ color: 'red', fontSize: 13 }}>{this.state.tSubjectError}</small> </p>
            </div>
          </div>
          <div className='col-md-3'>
            <div className='form-group'>
              <label className='form-control-label'>{t`lanSPLabelCheckOutTime`}<span className='error'>*</span></label>
              <TimePicker
                showSecond={false}
                value={moment(this.state.checkOutTime, format)}
                className='xxx'
                disabled
                format={format}
                use12Hours
                inputReadOnly
              />
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
              <label className='form-control-label'>{t`lanSPLabelTotalDays`} (#)<span className='error'>*</span></label>
              <input type='text' readOnly value={this.state.noOfDays} className='form-control' id='TicketSubject' />
              <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 13 } : { opacity: 0 }} /></span>
              <p className='text-muted'><small style={{ color: 'red', fontSize: 13 }}>{this.state.tSubjectError}</small> </p>
            </div>
          </div>
          <div className='col-md-3'>
            <div className='form-group'>
              <label className='form-control-label'>{t`lanSPLabelTotal`} {t`lanCommonLabelBookingAmount`} (₹)<span className='error'>*</span></label>
              <input type='text' readOnly value={(this.state.numOfRooms) * (this.state.noOfDays) * (this.state.amount)} className='form-control' id='ticketOn' />
              <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.ticketOnError ? { color: 'red', fontSize: 13 } : { opacity: 0 }} /></span>
              <p className='text-muted'><small style={{ color: 'red', fontSize: 13 }}>{this.state.ticketOnError}</small> </p>
            </div>
          </div>
        </div>
        {this.state.propertyBlocked ? null : <p className='desc mb-0 text-success'>{t`lanSPLabelHurryUpOnly`} {this.state.avaliableRoomCount} {t`lanSPLabelRoomsLeft`}</p>}
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
              <input type='number' value={this.state.mobileNumber} onChange={(e) => this.setState({ mobileNumber: e.target.value, errorMessage: '' })} maxLength={10}
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
              <input type='email' value={this.state.email} onChange={(e) => this.setState({ email: e.target.value, errorMessage: '' })} className='form-control' id='ticketOn' />
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
export default ADCreateDaysBookingComponent
