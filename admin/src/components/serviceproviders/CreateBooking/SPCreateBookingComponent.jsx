/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import Switch from 'react-switch'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import '../BookingsHistory/css/Bookings.css'
import { t } from 'ttag'
import moment from 'moment'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPCreateBooking extends React.Component {
  constructor () {
    super()
    const propertyInfoData = JSON.parse(localStorage.getItem('propertyInfoViewObj'))

    let currMin = moment().add(30, 'm').format('mm')
    let meridiem = moment().add(30, 'm').format('A')
    let min = Math.round(currMin / 15) * 15
    let minutes = min && min !== 60 ? min.toString() : '00'
    let hours = min && min !== 60 ? moment().add(30, 'm').format('hh').toString() : moment().add(1, 'h').format('hh').toString()
    let chekinTime = hours + ':' + minutes + ' ' + meridiem
    let chekinDate = moment().format('YYYY-MM-DD')

    let chekinDateTime = moment(chekinDate + ' ' + hours + ':' + minutes + ' ' + meridiem).format('YYYY-MM-DD hh:mm A')
    let checkOutMin = moment(chekinDateTime).add(22, 'h').format('mm')
    let checkOutMeridiem = moment(chekinDateTime).add(22, 'h').format('A')
    let checkOutMinRound = Math.round(checkOutMin / 15) * 15
    let checkOutMinutes = checkOutMinRound ? checkOutMinRound.toString() : '00'
    let checkOutHours = moment(chekinDateTime).add(22, 'h').format('hh').toString()
    let chekOutTime = checkOutHours + ':' + checkOutMinutes + ' ' + checkOutMeridiem
    // let checkOutDate = moment().add(22, 'h').format('YYYY-MM-DD')

    const defaultcheckInDate = moment().format('YYYY-MM-DD')
    const defaultChckInTime = moment(defaultcheckInDate + ' ' + propertyInfoData.pricing.checkInTime, 'YYYY-MM-DD hh:mm A').valueOf()
    const defaultCurrTime = moment(defaultcheckInDate + ' ' + chekinTime, 'YYYY-MM-DD hh:mm A').valueOf()
    const spCheckInTime = propertyInfoData.pricing.checkInTime
    const spSplitMeridiem = spCheckInTime.split(' ')
    const spSplitHours = spCheckInTime.split(':')
    const spSplitMinutes = spSplitMeridiem[0].split(':')
    const spHours = spSplitHours[0]
    const spMinutes = spSplitMinutes[1]
    const spMeridiem = spSplitMeridiem[1]
    this.state = {
      basePrice: '',
      MinBasePrice: '',
      mobileNumber: '',
      email: '',
      name: '',
      euUserId: '',
      bookingType: 'Base Price',
      checkInDate: moment().format('YYYY-MM-DD'),
      checkOutDate: moment().add(1, 'days').format('YYYY-MM-DD'),
      minDay: moment().format('YYYY-MM-DD'),
      maxDay: moment().add(3, 'month').endOf('month').format('YYYY-MM-DD'),
      propertyData: JSON.parse(localStorage.getItem('propertyData')),
      propertyInfoData: JSON.parse(localStorage.getItem('propertyInfoViewObj')),
      amount: propertyInfoData.pricing.basePrice,
      checkInCredentials: propertyInfoData.pricing.checkInCredentials,
      noOfDays: 1,
      numOfPeople: 2,
      numOfAdults: 2,
      numOfChilds: 0,
      numOfRooms: 1,
      checkInTime: propertyInfoData.pricing.checkInCredentials === 'Specific Time' ? propertyInfoData.pricing.checkInTime : defaultChckInTime < defaultCurrTime ? chekinTime : propertyInfoData.pricing.checkInTime,
      checkOutTime: propertyInfoData.pricing.checkInCredentials === 'Specific Time' ? propertyInfoData.pricing.checkOutTime : defaultChckInTime < defaultCurrTime ? chekOutTime : propertyInfoData.pricing.checkOutTime,
      currCheckInTime: chekinTime,
      currCheckOutTime: chekOutTime,
      amenitiesData: [],
      servicesData: [],
      guestRulesData: [],
      searchString: '',
      errorMessage: '',
      hours: propertyInfoData.pricing.checkInCredentials === 'Specific Time' ? '01' : hours,
      minutes: propertyInfoData.pricing.checkInCredentials === 'Specific Time' ? '00' : minutes,
      checkInMeridiem: propertyInfoData.pricing.checkInCredentials === 'Specific Time' ? 'PM' : meridiem,
      selectHours: propertyInfoData.pricing.checkInCredentials === 'Specific Time' ? spHours : defaultChckInTime < defaultCurrTime ? hours : spHours,
      selectMinutes: propertyInfoData.pricing.checkInCredentials === 'Specific Time' ? spMinutes : defaultChckInTime < defaultCurrTime ? minutes : spMinutes,
      selectMeridiem: propertyInfoData.pricing.checkInCredentials === 'Specific Time' ? spMeridiem : defaultChckInTime < defaultCurrTime ? meridiem : spMeridiem,
      checked: false,
      reload: false,
      roomSubButton: false,
      buttonDisabled: true,
      buttonEnabled: false,
      validUser: false,
      handleBookNowButtonMobile: false,
      handleBookNowButtonEmail: false
    }
    this.handleCreateBooking = this.handleCreateBooking.bind(this)
    this.handleCheckInDate = this.handleCheckInDate.bind(this)
    this.handleCheckOutDate = this.handleCheckOutDate.bind(this)
    this.handleAdultIncrement = this.handleAdultIncrement.bind(this)
    this.handleAdultDecrement = this.handleAdultDecrement.bind(this)
    this.handleChildIncrement = this.handleChildIncrement.bind(this)
    this.handleChildDecrement = this.handleChildDecrement.bind(this)
    this.handleRooms = this.handleRooms.bind(this)
  }
  componentWillMount () {
    let getSpPropertyInfoAmenities = {
      url: config.baseUrl + config.getSPPropertyInfoAmenitiesListAPI + this.state.propertyData._id + '/' + this.state.propertyInfoData._id + '/' + this.state.searchString
    }
    let _this = this
    APICallManager.getCall(getSpPropertyInfoAmenities, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        resObj.data.statusResult.map((data, i) => {
          if (data.amenityStatus === 'Available') {
            _this.state.amenitiesData.push(data)
            _this.setState({ reload: true })
          }
        })
      }
    })
    let getSpPropertyInfoGuestRulesList = {
      url: config.baseUrl + config.getSPPropertyInfoGuestRulesListAPI + this.state.propertyData._id + '/' + this.state.propertyInfoData._id + '/' + this.state.searchString
    }
    APICallManager.getCall(getSpPropertyInfoGuestRulesList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        resObj.data.statusResult.map((data, i) => {
          if (data.ruleStatus === 'Active') {
            _this.state.guestRulesData.push(data)
            _this.setState({ reload: true })
          }
        })
      }
    })
    let getSpPropertyInfoServices = {
      url: config.baseUrl + config.getSPPropertyInfoServicesListAPI + this.state.propertyData._id + '/' + this.state.propertyInfoData._id
    }
    APICallManager.getCall(getSpPropertyInfoServices, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        resObj.data.statusResult.map((data, i) => {
          if (data.serviceStatus === 'Available') {
            _this.state.servicesData.push(data)
          }
        })
        _this.setState({ reload: true })
      }
    })
  }

  handleCreateBooking () {
    // const reg = /^[0]?[6789]\d{9}$/
    const reg = /^\d{10}$/
    const emailreg =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const propertyData = this.state.propertyData
    let checkInHours = moment(this.state.checkInTime, ['hh:mm A']).format('HH:mm')
    let checkOutHours = moment(this.state.checkOutTime, ['hh:mm A']).format('HH:mm')
    let cidt = moment(this.state.checkInDate + ' ' + checkInHours, 'YYYY-MM-DD HH:mm')
    let codt = moment(this.state.checkOutDate + ' ' + checkOutHours, 'YYYY-MM-DD HH:mm')

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
      spLocationId: propertyData.spLocationId._id,
      contactPerson: propertyData.spLocationObj.contactPerson,
      mobileNumber: propertyData.spLocationObj.mobileNumber,
      spemail: propertyData.spLocationObj.email,
      address: propertyData.spLocationObj.address,
      totalDays: this.state.noOfDays,
      checkInDate: this.state.checkInDate + ' ' + checkInHours,
      checkOutDate: this.state.checkOutDate + ' ' + checkOutHours,
      noOfChilds: this.state.numOfChilds.toString(),
      noOfAdults: this.state.numOfAdults.toString(),
      noOfRooms: this.state.numOfRooms,
      spPropertyId: propertyData._id,
      spPropertyTitle: this.state.propertyInfoData.propertyTitle,
      spPropertyType:  this.state.propertyInfoData.propertyType,
      spPropertyInfoId: this.state.propertyInfoData._id,
      totalPrice: (this.state.numOfRooms) * (this.state.noOfDays) * (this.state.amount),
      validUser: this.state.validUser,
      bookingType: this.state.bookingType
    }
    if (this.state.checkInDate === null || this.state.checkInDate === undefined || this.state.checkInDate === '') {
      this.setState({ errorMessage: t`lanSPLabelErrorCheckInDateRequired` })
    } else if (this.state.checkOutDate === null || this.state.checkOutDate === undefined || this.state.checkOutDate === '') {
      this.setState({ errorMessage: t`lanSPLabelErrorCheckOutDateRequired` })
    } else if (codt < cidt) {
      this.setState({ errorMessage: t`lanSPLabelErrorCheckOutGreaterCheckIn` })
    } else if (this.state.mobileNumber === '' || this.state.mobileNumber === 'undefined' || reg.test(this.state.mobileNumber) === false) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidMobile` })
    } else if (this.state.email === '' || this.state.email === 'undefined' || emailreg.test(this.state.email) === false) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidEmail` })
    } else if (this.state.validUser === false && this.state.handleBookNowButtonMobile === false) {
      // alert('Please click on mobile number get details to get user details')
      toast.warn('Please click on mobile number get details to get user details', {
        position: toast.POSITION.TOP_CENTER
      });
    } else if (this.state.validUser === false && this.state.handleBookNowButtonEmail === false) {
      // alert('Please click on email get details to get user details')
      toast.warn('Please click on email get details to get user details', {
        position: toast.POSITION.TOP_CENTER
      });
    } else if (this.state.name.trim() === '' || this.state.name.trim() === 'undefined') {
      this.setState({ errorMessage: t`lanSPLabelErrorNameRequired` })
    } else {
      let obj = { url: config.baseUrl + config.postSPEndUserBookingAPI, body: postJson }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          toast.success('Booking Successfully', {
            position: toast.POSITION.TOP_CENTER
          });
          setTimeout(() => {
            hashHistory.push('/host/bookings-history')
          }, 2000)
        } else if (resObj.data.statusCode === '1017') {
          alert(resObj.data.statusMessage)
        } else {
          toast.error('Booking failed try again', {
            position: toast.POSITION.TOP_CENTER
          });
          // alert('Booking failed try again')
        }
      })
    }
  }
  handleCheckOutDate (e) {
    let checkIn = moment.utc(this.state.checkInDate + ' ' + this.state.checkInTime)
    let checkOutDate = moment.utc(e.target.value + ' ' + this.state.checkOutTime)
    let duration = moment.duration(checkOutDate.diff(checkIn))
    let Hours = duration.asHours()
    if (Hours > this.state.propertyInfoData.pricing.minBasePriceUnitValue) {
      this.setState({ checkOutDate: e.target.value, errorMessage: '' })
      this.handleBookingtypeBasePrice()
      this.getNumOfDays(this.state.checkInDate, e.target.value)
    } else {
      this.setState({ checkOutDate: e.target.value, errorMessage: '' })
      this.getNumOfDays(this.state.checkInDate, e.target.value)
    }
  }
  handleCheckInDate (e) {
    this.setState({ checkInDate: e.target.value, errorMessage: '' })
    if (e.target.value) {
      this.getNumOfDays(e.target.value, this.state.checkOutDate)
      const spCheckInTime = this.state.propertyInfoData.pricing.checkInTime
      const spSplitMeridiem = spCheckInTime.split(' ')
      const spSplitHours = spCheckInTime.split(':')
      const spSplitMinutes = spSplitMeridiem[0].split(':')

      let checkInDateValue = moment.utc(e.target.value, 'YYYY-MM-DD').valueOf()
      let checkOutDateValue = moment.utc(this.state.checkOutDate, 'YYYY-MM-DD').valueOf()
      let currentDay = moment().format('YYYY-MM-DD')
      let currentDayValue = moment.utc(currentDay, 'YYYY-MM-DD').valueOf()
      let currentTime = moment().format('YYYY-MM-DD hh:mm A').valueOf()
      let currTimeValue = moment.utc(currentTime).valueOf()
      let defaultTime = moment(currentDay + ' ' + this.state.propertyInfoData.pricing.checkInTime).format('YYYY-MM-DD hh:mm A').valueOf()
      let defaultTimeValue = moment.utc(defaultTime).valueOf()

      if (checkInDateValue > checkOutDateValue) {
        this.setState({ checkOutDate: moment(e.target.value).add(1, 'days').format('YYYY-MM-DD') })
        this.getNumOfDays(e.target.value, moment(e.target.value).add(1, 'days').format('YYYY-MM-DD'))
        this.handleBookingtypeBasePrice()
        if (checkInDateValue > currentDayValue) {
          this.setState({ selectHours: spSplitHours[0],
            selectMinutes: spSplitMinutes[1],
            selectMeridiem: spSplitMeridiem[1],
            checkInTime: this.state.propertyInfoData.pricing.checkInTime,
            checkOutTime:  this.state.propertyInfoData.pricing.checkOutTime
          })
        }
      } else if (checkInDateValue > currentDayValue) {
        this.setState({ checkOutDate: moment(e.target.value).add(1, 'days').format('YYYY-MM-DD') })
        this.getNumOfDays(e.target.value, moment(e.target.value).add(1, 'days').format('YYYY-MM-DD'))
        this.setState({ selectHours: spSplitHours[0],
          selectMinutes: spSplitMinutes[1],
          selectMeridiem: spSplitMeridiem[1],
          checkInTime: this.state.propertyInfoData.pricing.checkInTime,
          checkOutTime:  this.state.propertyInfoData.pricing.checkOutTime
        })
      } else if (checkInDateValue === currentDayValue && currTimeValue > defaultTimeValue) {
        this.setState({ checkOutDate: moment(e.target.value).add(1, 'days').format('YYYY-MM-DD') })
        this.getNumOfDays(e.target.value, moment(e.target.value).add(1, 'days').format('YYYY-MM-DD'))
        this.setState({ checkInTime: this.state.currCheckInTime, checkOutTime: this.state.currCheckOutTime, selectHours: this.state.hours, selectMinutes: this.state.minutes, selectMeridiem: this.state.checkInMeridiem })
      } else {
        this.setState({ checkOutDate: moment(e.target.value).add(1, 'days').format('YYYY-MM-DD') })
        this.getNumOfDays(e.target.value, moment(e.target.value).add(1, 'days').format('YYYY-MM-DD'))
      }
    } else {
      this.setState({ checkOutDate: '', noOfDays: 0 })
    }
  }
  handleBookingtypeBasePrice = () => {
    let checkOutDateTime = moment(this.state.checkInDate + ' ' + this.state.checkInTime, 'YYYY-MM-DD hh:mm A').add(22, 'h')
    // let checkOutDateBasePrice = moment(checkOutDateTime).format('YYYY-MM-DD')
    let checkOutTimeBasePrice = moment(checkOutDateTime).format('hh:mm A')
    this.setState({ bookingType: 'Base Price', amount: this.state.propertyInfoData.pricing.basePrice, checkOutTime: checkOutTimeBasePrice })
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
  getNumOfDays = (checkInDate, checkOutDate) => {
    var checkIn = moment.utc(checkInDate)
    var checkOut = moment.utc(checkOutDate)
    var duration = moment.duration(checkOut.diff(checkIn))
    var days = duration.asDays()
    this.setState({ noOfDays: days === 0 ? 1 : days })
  }

  handleMobileGetDetails = () => {
    const reg = /^[0]?[6789]\d{9}$/
    if (this.state.mobileNumber === '' || this.state.mobileNumber === 'undefined') {
      toast.warn('please provide mobile Number', {
        position: toast.POSITION.TOP_CENTER
      });
      // alert('please provide mobile Number')
    } else if (reg.test(this.state.mobileNumber) === false) {
      toast.warn('Invalid number please provide a valid mobile Number', {
        position: toast.POSITION.TOP_CENTER
      });
      // alert('Invalid number please provide a valid mobile Number')
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
  handleEmailGetDetails = () => {
    let checkText = this.state.email.includes('@')
    if (checkText === true) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      if (this.state.email === '' || this.state.email === 'undefined') {
        toast.warn('Please enter a email', {
          position: toast.POSITION.TOP_CENTER
        });
        // alert('Please enter a email')
      } else if (reg.test(this.state.email) === false) {
        toast.warn('Please enter a valid email', {
          position: toast.POSITION.TOP_CENTER
        });
        // alert('Please enter a valid email')
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
      // alert('Please enter a email')
      toast.warn('Please enter a email', {
        position: toast.POSITION.TOP_CENTER
      });
    }
  }
  handleBookingtype = (e) => {
    const propertyInfoData = this.state.propertyInfoData
    if (e.target.value === 'Minimum Base Price') {
      let checkOutDateTime = moment(this.state.checkInDate + ' ' + this.state.checkInTime, 'YYYY-MM-DD hh:mm A').add(propertyInfoData.pricing.minBasePriceUnitValue, 'h')
      let checkOutDate = moment(checkOutDateTime).format('YYYY-MM-DD')
      let checkOutTime = moment(checkOutDateTime).format('hh:mm A')
      this.setState({ amount: propertyInfoData.pricing.minBasePrice, checkOutTime: checkOutTime, bookingType: e.target.value, checkOutDate: checkOutDate })
      this.getNumOfDays(this.state.checkInDate, checkOutDate)
    } else {
      let checkOutDateTime = moment(this.state.checkInDate + ' ' + this.state.checkInTime, 'YYYY-MM-DD hh:mm A').add(22, 'h')
      let checkOutDate = moment(checkOutDateTime).format('YYYY-MM-DD')
      let checkOutTime = moment(checkOutDateTime).format('hh:mm A')
      this.setState({ bookingType: e.target.value, amount: propertyInfoData.pricing.basePrice, checkOutTime: checkOutTime, checkOutDate: checkOutDate })
      this.getNumOfDays(this.state.checkInDate, checkOutDate)
    }
  }
  handleEditCheckIn = () => {
    let currCheckInTime = this.state.hours + ':' + this.state.minutes + ' ' + this.state.checkInMeridiem
    let stateCheckInTime = this.state.selectHours + ':' + this.state.selectMinutes + ' ' + this.state.selectMeridiem
    let currCheckInDate = moment().format('YYYY-MM-DD')
    let currCheckInTimeValue = moment(currCheckInDate + ' ' + currCheckInTime, 'YYYY-MM-DD hh:mm A').valueOf()
    let stateCheckInTimeValue = moment(this.state.checkInDate + ' ' + stateCheckInTime, 'YYYY-MM-DD hh:mm A').valueOf()
    if (stateCheckInTimeValue < currCheckInTimeValue) {
      if (this.state.bookingType === 'Minimum Base Price') {
        let checkOutDateTime = moment(this.state.checkInDate + ' ' + currCheckInTime, 'YYYY-MM-DD hh:mm A').add(this.state.propertyInfoData.pricing.minBasePriceUnitValue, 'h')
        let checkOutDate = moment(checkOutDateTime).format('YYYY-MM-DD')
        let checkOutTime = moment(checkOutDateTime).format('hh:mm A')
        this.setState({ checkInTime: currCheckInTime,
          checkOutTime: checkOutTime,
          checkOutDate: checkOutDate,
          selectHours: this.state.hours,
          selectMinutes: this.state.minutes,
          selectMeridiem: this.state.checkInMeridiem
        })
      } else {
        let checkOutDateTime = moment(this.state.checkInDate + ' ' + currCheckInTime, 'YYYY-MM-DD hh:mm A').add(22, 'h')
        let checkOutDate = moment(checkOutDateTime).format('YYYY-MM-DD')
        let checkOutTime = moment(checkOutDateTime).format('hh:mm A')
        this.setState({ checkInTime: currCheckInTime,
          checkOutTime: checkOutTime,
          checkOutDate: checkOutDate,
          selectHours: this.state.hours,
          selectMinutes: this.state.minutes,
          selectMeridiem: this.state.checkInMeridiem
        })
      }
    } else {
      var checkInTime = this.state.selectHours + ':' + this.state.selectMinutes + ' ' + this.state.selectMeridiem
      if (this.state.bookingType === 'Minimum Base Price') {
        let checkOutDateTime = moment(this.state.checkInDate + ' ' + checkInTime, 'YYYY-MM-DD hh:mm A').add(this.state.propertyInfoData.pricing.minBasePriceUnitValue, 'h')
        let checkOutDate = moment(checkOutDateTime).format('YYYY-MM-DD')
        let checkOutTime = moment(checkOutDateTime).format('hh:mm A')
        this.setState({ checkInTime: checkInTime, checkOutTime: checkOutTime, checkOutDate: checkOutDate })
      } else {
        this.setState({ checkInTime: checkInTime })
        var time = moment(checkInTime, 'hh:mm A').add(22, 'h')
        var checkOutTime = moment(time).format('hh:mm A')
        this.setState({ checkOutTime: checkOutTime })
      }
    }
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  {/* <h6 className='h2 text-white d-inline-block mb-0'>{t`lanCommonButtonCreateBooking`}</h6> */}
                  <nav aria-label='breadcrumb' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a>Booking History</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>Create Booking</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6 '>
          <div className='row justify-content-center booking-view'>
            <div className='col-md-12 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-body'>
                  <div className='accordion' id='accordionExample'>
                    <div className='card'>
                      <div className='card-header' id='headingOne' data-toggle='collapse' data-target='#collapseOne' aria-expanded='true' aria-controls='collapseOne'>
                        <h5 className='mb-0'>Create Booking</h5>
                      </div>
                      <div id='collapseOne' className='collapse show' aria-labelledby='headingOne' data-parent='#accordionExample'>
                        <div className='card-body'>
                          <div className='row'>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelSelectPriceType`} <span className='error'>*</span></label>
                                <select value={this.state.bookingType} onChange={(value) => this.handleBookingtype(value)} multiple='' className='form-control' id='exampleFormControlSelect2'>
                                  <option>Base Price</option>
                                  <option>Minimum Base Price</option>
                                </select>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelAmountPerDay`} (₹)<span className='error'>*</span></label>
                                <input type='text' value={this.state.bookingType === 'Base Price' ? this.state.propertyInfoData.pricing.basePrice : this.state.propertyInfoData.pricing.minBasePrice}
                                  className='form-control' id='TicketSubject' />
                              </div>
                            </div>
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
                                    <button type='button' disabled={parseInt(this.state.numOfAdults) > ((this.state.propertyInfoData.activeRoomsCount) * (this.state.propertyInfoData.membersCapacity) - 1) ||
                                      (parseInt(this.state.numOfAdults) + parseInt(this.state.numOfChilds) >
                                      ((this.state.propertyInfoData.activeRoomsCount) * (parseInt(this.state.propertyInfoData.membersCapacity) + parseInt(this.state.propertyInfoData.childsCapacity)) - 1))
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
                                    <button type='button' disabled={(parseInt(this.state.numOfChilds) > (this.state.propertyInfoData.activeRoomsCount) * (this.state.propertyInfoData.childsCapacity) - 1) &&
                                      (parseInt(this.state.numOfAdults) > (this.state.propertyInfoData.activeRoomsCount) * (this.state.propertyInfoData.membersCapacity) - 1) ||
                                      (parseInt(this.state.numOfAdults) + parseInt(this.state.numOfChilds) >
                                      ((this.state.propertyInfoData.activeRoomsCount) * (parseInt(this.state.propertyInfoData.membersCapacity) + parseInt(this.state.propertyInfoData.childsCapacity)) - 1))
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
                                    <button type='button' disabled={this.state.propertyInfoData.activeRoomsCount <= this.state.numOfRooms}
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
                                <label className='form-control-label'>{t`lanCommonLabelCheckIn`} {t`lanCommonLabelDate`}<span className='error'>*</span></label>
                                <input className='form-control' type='date' value={this.state.checkInDate} onChange={(e) => this.handleCheckInDate(e)} min={this.state.minDay} max={this.state.maxDay} />
                                <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 13 } : { opacity: 0 }} /></span>
                                <p className='text-muted'><small style={{ color: 'red', fontSize:13 }}>{this.state.tSubjectError}</small> </p>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanCommonLabelCheckOut`} {t`lanCommonLabelDate`}<span className='error'>*</span></label>
                                <input type='date' value={this.state.checkOutDate} onChange={(e) => this.handleCheckOutDate(e)} min={this.state.checkInDate} max={this.state.maxDay}
                                  className='form-control' id='ticketOn' />
                                <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.ticketOnError ? { color: 'red', fontSize:13 } : { opacity: 0 }} /></span>
                                <p className='text-muted'><small style={{ color: 'red', fontSize:13 }}>{this.state.ticketOnError}</small> </p>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelCheckInTime`}<span className='error'>*</span></label>
                                <input type='text' value={this.state.checkInTime} className='form-control' id='TicketSubject' />
                                <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize:13 } : { opacity: 0 }} /></span>
                                <p className='text-muted'><small style={{ color: 'red', fontSize:13 }}>{this.state.tSubjectError}</small> </p>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelCheckOutTime`}<span className='error'>*</span></label>
                                <input type='text' value={this.state.checkOutTime} className='form-control' id='ticketOn' />
                                <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.ticketOnError ? { color: 'red', fontSize:13 } : { opacity: 0 }} /></span>
                                <p className='text-muted'><small style={{ color: 'red', fontSize:13 }}>{this.state.ticketOnError}</small> </p>
                              </div>
                            </div>
                          </div>
                          {this.state.checkInCredentials === 'Around the Clock'
                          ? <div className='row'>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelHours`}<span className='error'>*</span></label>
                                <select value={this.state.selectHours} onChange={(e) => this.setState({ selectHours: e.target.value })} multiple='' className='form-control' id='exampleFormControlSelect2'>
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
                                <select value={this.state.selectMinutes} onChange={(e) => this.setState({ selectMinutes: e.target.value })} multiple='' className='form-control' id='exampleFormControlSelect2'>
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
                                <select value={this.state.selectMeridiem} onChange={(e) => this.setState({ selectMeridiem: e.target.value })} multiple='' className='form-control' id='exampleFormControlSelect2'>
                                  <option>AM</option>
                                  <option>PM</option>
                                </select>
                              </div>
                            </div>
                            <div className='col-md-3 pt-4'>
                              <button className='btn btn-icon btn-primary' type='button' onClick={this.handleEditCheckIn}>
                                <span className='btn-inner--icon'><small>{t`lanCommonButtonSet`} {t`lanSPLabelCheckInTime`}</small></span>
                              </button>
                            </div>
                          </div> : null }
                          <div className='row'>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelTotalDays`} (#)<span className='error'>*</span></label>
                                <input type='text' value={this.state.noOfDays} className='form-control' id='TicketSubject' />
                                <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize:13 } : { opacity: 0 }} /></span>
                                <p className='text-muted'><small style={{ color: 'red', fontSize:13 }}>{this.state.tSubjectError}</small> </p>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelTotal`} {t`lanCommonLabelBookingAmount`} (₹)<span className='error'>*</span></label>
                                <input type='text' value={(this.state.numOfRooms) * (this.state.noOfDays) * (this.state.amount)} className='form-control' id='ticketOn'  />
                                <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.ticketOnError ? { color: 'red', fontSize:13 } : { opacity: 0 }} /></span>
                                <p className='text-muted'><small style={{ color: 'red', fontSize:13 }}>{this.state.ticketOnError}</small> </p>
                              </div>
                            </div>
                          </div>
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
                                  className='form-control' id='TicketSubject'  />
                                <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize:13 } : { opacity: 0 }} /></span>
                                <p className='text-muted'><small style={{ color: 'red', fontSize:13 }}>{this.state.tSubjectError}</small> </p>
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
                                <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.ticketOnError ? { color: 'red', fontSize:13 } : { opacity: 0 }} /></span>
                                <p className='text-muted'><small style={{ color: 'red', fontSize:13 }}>{this.state.ticketOnError}</small> </p>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanCommonLabelName`}<span className='error'>*</span></label>
                                <input type='text' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value, errorMessage: '' })} className='form-control' id='TicketSubject' />
                                <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 13 } : { opacity: 0 }} /></span>
                                <p className='text-muted'><small style={{ color: 'red', fontSize:13 }}>{this.state.tSubjectError}</small> </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-header' id='headingTwo' data-toggle='collapse' data-target='#collapseTwo' aria-expanded='false' aria-controls='collapseTwo'>
                        <h5 className='mb-0'>{t`lanSPTitleAmenities`}</h5>
                      </div>
                      <div id='collapseTwo' className='collapse' aria-labelledby='headingTwo' data-parent='#accordionExample'>
                        <div className='card-body'>
                          {/* <h3>{t`lanSPTitleAmenities`}</h3> */}
                          <div className='table-responsive'>
                            <table className='table align-items-center table-flush table-striped'>
                              <thead className='thead-light'>
                                <tr>
                                  <th>{t`lanSPTitleAmenity`}</th>
                                  <th>{t`lanSPLabelAmenityType`}</th>
                                  <th>{t`lanSPLabelPropertyInfoPrice`} (₹)</th>
                                  <th>{t`lanCommonLabelStatus`}</th>
                                </tr>
                              </thead>
                              { this.state.amenitiesData.length > 0
                              ? this.state.amenitiesData.map((data, i) =>
                                <tbody key={i}>
                                  <tr>
                                    <td className='table-user'>
                                      <img src={data.amenityIconPath ? config.baseUrl + data.amenityIconPath : require('../images/amenities/wifi.png')} className='icon-calendar' />
                                      <a className='ml-3'><strong>{data.amenityName}</strong></a>
                                    </td>
                                    <td>
                                      <span className='text-muted'>{data.amenityType}</span>
                                    </td>
                                    <td>
                                      <span className='text-muted'>{data.amenityCharge}</span>
                                    </td>
                                    <td className='table-actions'>
                                      <Switch
                                        className='react-switch'
                                        checked={data.amenityStatus === 'Available'}
                                        aria-labelledby='neat-label'
                                      />
                                    </td>
                                  </tr>
                                </tbody>) : null
                            }
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-header' id='headingThree' data-toggle='collapse' data-target='#collapseThree' aria-expanded='false' aria-controls='collapseThree'>
                        <h5 className='mb-0'>{t`lanSPTitleGuestRules`}</h5>
                      </div>
                      <div id='collapseThree' className='collapse' aria-labelledby='headingThree' data-parent='#accordionExample'>
                        <div className='card-body'>
                          {/* <h3>{t`lanSPTitleGuestRules`} </h3> */}
                          <div>
                            <div className='table-responsive'>
                              <table className='table align-items-center table-flush table-striped'>
                                <thead className='thead-light'>
                                  <tr>
                                    <th>{t`lanSPTitleGuestRules`} </th>
                                    <th>{t`lanSPTitleGuestRules`} {t`lanCommonLabelName`}</th>
                                    <th>{t`lanCommonLabelStatus`}</th>
                                  </tr>
                                </thead>
                                {this.state.guestRulesData.length > 0
                              ? this.state.guestRulesData.map((data, i) =>
                                <tbody key={i}>
                                  <tr>
                                    <td className='table-user' style={{ width: '20px' }}>
                                      <img src={data.ruleIconPath ? config.baseUrl + data.ruleIconPath : require('../images/guestrules/noalcohol.png')} className='icon-calendar' />
                                    </td>
                                    <td>
                                      <span className='text-muted'>{data.ruleName}</span>
                                    </td>
                                    <td className='table-actions'>
                                      <Switch
                                        className='react-switch'
                                        checked={data.ruleStatus === 'Active'}
                                        aria-labelledby='neat-label'
                                      />
                                    </td>
                                  </tr>
                                </tbody>) : null
                              }
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-header' id='headingFour' data-toggle='collapse' data-target='#collapseFour' aria-expanded='false' aria-controls='collapseFour'>
                        <h5 className='mb-0'>{t`lanSPTitleServices`}</h5>
                      </div>
                      <div id='collapseFour' className='collapse' aria-labelledby='headingFour' data-parent='#accordionExample'>
                        <div className='card-body'>
                          {/* <h3>{t`lanSPTitleServices`}</h3> */}
                          <div>
                            <div className='table-responsive'>
                              <table className='table align-items-center table-flush table-striped'>
                                <thead className='thead-light'>
                                  <tr>
                                    <th>{t`lanSPTitleServices`}</th>
                                    <th>{t`lanSPLabelServiceType`}</th>
                                    <th>{t`lanSPLabelPropertyInfoPrice`} (₹)</th>
                                    <th>{t`lanCommonLabelStatus`}</th>
                                  </tr>
                                </thead>
                                {this.state.servicesData.length > 0
                                ? this.state.servicesData.map((data, i) =>
                                  <tbody key={i}>
                                    <tr>
                                      <td className='table-user'>
                                        <img src={(data && data.serviceIconPath) ? config.baseUrl + data.serviceIconPath : require('../images/services/car.png')} className='icon-calendar' />
                                        <a className='ml-3'><strong>{data.serviceName}</strong></a>
                                      </td>
                                      <td>
                                        <span className='text-muted'>{data.serviceType}</span>
                                      </td>
                                      <td>
                                        <span className='text-muted'>{data.serviceCharge} </span>
                                      </td>
                                      <td className='table-actions'>
                                        <Switch
                                          className='react-switch'
                                          checked={data.serviceStatus === 'Available'}
                                          aria-labelledby='neat-label'
                                        />
                                      </td>
                                    </tr>
                                  </tbody>) : null
                              }
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className='row' data-spy='scroll' data-target='.navbar' data-offset='50' style={{ position: 'relative' }}>
                      {/* <nav className='navbar navbar-scroll-id'>
                        <div className='container'>
                          <ul className='nav navbar-nav'>
                            <li><a href='#section1'>{t`lanSPTitleAmenities`}</a></li>
                            <li><a href='#section2'>{t`lanSPTitleGuestRules`}</a></li>
                            <li><a href='#section3'>{t`lanSPTitleServices`}</a></li>
                          </ul>
                        </div>
                      </nav> */}
                      <div className='col-md-12'>
                        <div style={{ color:'red' }}>{this.state.errorMessage}</div>
                      </div>
                    </div>
                    <button className='btn btn-primary update-edit' onClick={this.handleCreateBooking}>{t`lanCommonButtonCreateBooking`}</button>
                    <ToastContainer rtl />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SPCreateBooking
