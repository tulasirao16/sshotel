/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
import moment from 'moment'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import { Carousel } from 'react-responsive-carousel'
import classnames from 'classnames'
import DatePicker from 'react-datepicker'
import { addDays } from 'date-fns'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import PropTypes from 'prop-types'
import async from 'async'

import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import './Css/ADHotelsListItemView.css'
import Amenities from '../../../../assets/amenities/amenities.json'
import GuestRules from '../../../../assets/guestrules/guestRules.json'
import Services from '../../../../assets/services/services.json'

class ADHourlyHotelBooking extends React.Component {
  constructor () {
    super()
    this.myRef = React.createRef()
    this.locationRef = React.createRef()
    this.reviewRef = React.createRef()
    this.aboutRef = React.createRef()
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    let propertyInfoData = JSON.parse(localStorage.getItem('EUPropertyInfoData'))

    var currentDate = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD')
    var checkOut = moment(moment().add(3, 'month').endOf('month').format('YYYY-MM-DD'), 'YYYY-MM-DD')
    var duration = moment.duration(checkOut.diff(currentDate))
    var days = duration.asDays()

    this.state = {
      visible: false,
      aboutVisible: false,
      prevScrollpos: window.pageYOffset,
      prevScrollposition: window.pageYOffset,
      activeAbout: true,
      activePhotos: false,
      activeLocation: false,
      activeReview: false,
      activeHost: false,
      propertyInfoData: propertyInfoData,
      userData: JSON.parse(localStorage.getItem('userData')),
      checkInMinDate: new Date(moment().format('YYYY-MM-DD')),
      checkInDate: new Date(moment().format('YYYY-MM-DD')),
      checkOutMinDate: new Date(moment().format('YYYY-MM-DD')),
      checkOutDate: new Date(moment().add(1, 'day').format('YYYY-MM-DD')),
      checkInTime: '12:00 AM',
      checkOutTime: '11:00 PM',
      bookingType: (propertyInfoData && propertyInfoData.pricing) ? propertyInfoData.pricing.minBasePriceUnit === 'Per Day' ? 'Days' : 'Hours' : 'Days',
      amount: (propertyInfoData && propertyInfoData.pricing) ? propertyInfoData.pricing.basePrice : 0,
      totalDays: 1,
      totalHours: 0,
      adults: homePageData && homePageData.guestAdultValue ? homePageData.guestAdultValue : 2,
      childs: homePageData && homePageData.child ? homePageData.child : 0,
      rooms: homePageData && homePageData.guestRooms ? homePageData.guestRooms : 1,
      postBooking: {},
      propertyDocs: [],
      selectPropertyInfo: [],
      amenities: propertyInfoData && propertyInfoData.amenities ? propertyInfoData.amenities : propertyInfoData && propertyInfoData.spPropertyInfoId.amenities ? propertyInfoData.spPropertyInfoId.amenities : [],
      guestRules: propertyInfoData && propertyInfoData.guestRules ? propertyInfoData.guestRules : propertyInfoData && propertyInfoData.spPropertyInfoId.guestRules ? propertyInfoData.spPropertyInfoId.guestRules : [],
      services: propertyInfoData && propertyInfoData.services ? propertyInfoData.services : propertyInfoData && propertyInfoData.spPropertyInfoId.services ? propertyInfoData.spPropertyInfoId.services : [],
      isFavourite: true,
      videoPlay: false,
      guestDropdownActive: false,
      videoFile: '',
      maxDate: days,
      avaliableRoomCount: 0,
      BookingBlocked: '',
      propertyBlocked: false,
      confirmBooking: false,
      mobileBooknow: false,
      propertyId: (propertyInfoData && propertyInfoData.propertyId && propertyInfoData.propertyId._id) ? propertyInfoData.propertyId._id
       : (propertyInfoData && propertyInfoData.spPropertyId && propertyInfoData.spPropertyId._id ? propertyInfoData.spPropertyId._id : propertyInfoData.propertyId),
      propertyTitle: (propertyInfoData && propertyInfoData.propertyId && propertyInfoData.propertyId.propertyTitle) ? propertyInfoData.propertyId.propertyTitle
       : propertyInfoData.propertyTitle ? propertyInfoData.propertyTitle : '',
      checkInTimeArray: ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM'],
      checkOutTimeArray: ['05:00 AM', '11:00 AM', '05:00 PM', '11:00 PM'],
      hours: 0,
      days: 0,
      reviewRatingList: [],
      searchString: '',
      matchesData: false,
      imgsrc: [],
      pricing: propertyInfoData && propertyInfoData.pricing ? propertyInfoData.pricing : propertyInfoData && propertyInfoData.spPropertyInfoId.pricing ? propertyInfoData.spPropertyInfoId.pricing : '',
      doubleBedsCount: propertyInfoData && propertyInfoData.doubleBedsCount ? propertyInfoData.doubleBedsCount : 0,
      singleBedsCount: propertyInfoData && propertyInfoData.singleBedsCount ? propertyInfoData.singleBedsCount : 0,
      kingBedsCount: propertyInfoData && propertyInfoData.kingBedsCount ? propertyInfoData.kingBedsCount : 0,
      queenBedsCount: propertyInfoData && propertyInfoData.queenBedsCount ? propertyInfoData.queenBedsCount : 0,
      privateBathRooms: propertyInfoData && propertyInfoData.privateBathRooms ? propertyInfoData.privateBathRooms : 0,
      commonBathRooms: propertyInfoData && propertyInfoData.commonBathRooms ? propertyInfoData.commonBathRooms : 0
    }
    this.handleScroll = this.handleScroll.bind(this)
    this.handleAboutPropertyScroll = this.handleAboutPropertyScroll.bind(this)
    this.handleVideoPlay = this.handleVideoPlay.bind(this)
    this.handleAdultsIncrease = this.handleAdultsIncrease.bind(this)
    this.handleAdultsDecrease = this.handleAdultsDecrease.bind(this)
    this.handleChildsIncrease = this.handleChildsIncrease.bind(this)
    this.handleChildsDecrease = this.handleChildsDecrease.bind(this)
    this.handleRooms = this.handleRooms.bind(this)
    this.handleCheckInDate = this.handleCheckInDate.bind(this)
    this.handleCheckOutDate = this.handleCheckOutDate.bind(this)
    this.getNumOfDays = this.getNumOfDays.bind(this)
    this.handleBooking = this.handleBooking.bind(this)
    this.confirmBooking = this.confirmBooking.bind(this)
    this.handleUnfavouriteProperty = this.handleUnfavouriteProperty.bind(this)
    this.handleFavouriteProperty = this.handleFavouriteProperty.bind(this)
    this.getRoomsCount = this.getRoomsCount.bind(this)
    this.handlePropertyInfo = this.handlePropertyInfo.bind(this)
    this.reloadFunction = this.reloadFunction.bind(this)
    this.handleCheckInTime = this.handleCheckInTime.bind(this)
    this.handleCheckOutTime = this.handleCheckOutTime.bind(this)
    this.handleApiCalls = this.handleApiCalls.bind(this)
    this.setRoomsCount = this.setRoomsCount.bind(this)
    this.getCheckOutTimes = this.getCheckOutTimes.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }
  componentWillMount () {
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('scroll', this.handleAboutPropertyScroll)
    this.setRoomsCount()
    // let currentDate = moment().format('YYYY-MM-DD').valueOf()
    let userData = JSON.parse(localStorage.getItem('userData'))
    if (userData && userData.preferences) {
      let favouriteProperties = (userData && userData.preferences && userData.preferences.favouriteProperties) ? userData.preferences.favouriteProperties : []
      this.setState({ userData: userData, favouriteProperties: favouriteProperties })
    }
    let propertyId = this.state.propertyId
    let getSPPropertyDocsObj = {
      url: config.baseUrl + config.getPropertyDocsAPI + propertyId
    }
    let _this = this
    APICallManager.getCall(getSPPropertyDocsObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        let videoFile = resObj.data.statusResult.find(data => data.fileType === 'Video')
        _this.setState({
          propertyDocs : resObj.data.statusResult
        })
        if (videoFile) {
          _this.setState({
            videoFile: videoFile.imagePath
          })
        }
      }
    })
    let getSPPropertyInfoObj = {
      url: config.baseUrl + config.getSPPropertyInfosAPI + propertyId
    }
    APICallManager.getCall(getSPPropertyInfoObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ selectPropertyInfo: resObj.data.statusResult })
      } else {
        _this.setState({ selectPropertyInfo: [] })
      }
    })
    let obj = {}
    obj = { url: config.baseUrl + config.getEUReviewRatingsListAPI }
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          reviewRatingList: resObj.data.statusResult, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          reviewRatingList: [], matchesData: false
        })
      }
    })
    this.getCheckInTimes()
  }
  getCheckInTimes () {
    let EUBookingType = JSON.parse(localStorage.getItem('EUBookingType'))
    let propertyInfoData = JSON.parse(localStorage.getItem('EUPropertyInfoData'))
    let pricing = propertyInfoData.pricing ? propertyInfoData.pricing : propertyInfoData.spPropertyInfoId.pricing
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    let userCheckInDateValue = moment(new Date(homePageData.checkInDate)).format('YYYY-MM-DD').valueOf()
    let userCheckInDate = moment(new Date(homePageData.checkInDate)).format('YYYY-MM-DD')
    let userCheckOutDateValue = moment(new Date(homePageData.checkOutDate)).format('YYYY-MM-DD').valueOf()
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
      : moment(new Date(homePageData.checkInDate)).format('YYYY-MM-DD') + ' 12:00 PM'
    let checkOutMinDate = (pricing.isMidnightCheckOutAllowed || value !== '06:00 PM')
      ? moment(checkInDate, 'YYYY-MM-DD hh:mm A').add(5, 'h').format('YYYY-MM-DD')
      : moment(checkInDate, 'YYYY-MM-DD hh:mm A').add(11, 'h').format('YYYY-MM-DD')
    let checkOutDate = userCheckInDateValue === userCheckOutDateValue
      ? (pricing.isMidnightCheckOutAllowed || value !== '06:00 PM')
        ? moment(new Date(moment(checkInDate, 'YYYY-MM-DD hh:mm A'))).add(5, 'h').format('YYYY-MM-DD hh:mm A')
        : moment(new Date(moment(checkInDate, 'YYYY-MM-DD hh:mm A'))).add(11, 'h').format('YYYY-MM-DD hh:mm A')
      : moment(new Date(homePageData.checkOutDate)).format('YYYY-MM-DD') + ' 11:00 AM'

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
    // let EUBookingType = JSON.parse(localStorage.getItem('EUBookingType'))
    let propertyInfoData = JSON.parse(localStorage.getItem('EUPropertyInfoData'))
    let pricing = propertyInfoData.pricing ? propertyInfoData.pricing : propertyInfoData.spPropertyInfoId.pricing
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
  handleHoursAmount (checkInDate, checkOutDate, checkIntime, checkOutTime) {
    let propertyInfoData = JSON.parse(localStorage.getItem('EUPropertyInfoData'))
    let pricing = propertyInfoData.pricing ? propertyInfoData.pricing : propertyInfoData.spPropertyInfoId.pricing
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
    this.setState({ amount: totalAmount + hoursAmount, days: extraHours < 23 ? days : days + 1, hours: extraHours < 23 ? extraHours : 0, totalHours: Hours })
  }
  getNumberOfRoomsCount (checkInDate, checkOutDate, checkInTime, checkOutTime) {
    let propertyInfoData = JSON.parse(localStorage.getItem('EUPropertyInfoData'))
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
      propertyId: this.state.propertyId
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
  componentWillUnmount () {
    if (this.state.propertyDocs.length > 0) {
      window.removeEventListener('scroll', this.handleScroll)
      window.removeEventListener('scroll', this.handleAboutPropertyScroll)
    }
  }
  handleScroll (e) {
    const currentScrollPos = window.pageYOffset
    if (currentScrollPos > 260) {
      this.setState({
        prevScrollpos: currentScrollPos,
        visible: true
      })
    } else if (currentScrollPos < 270) {
      this.setState({
        visible: false
      })
    }
  }
  handleAboutPropertyScroll (e) {
    const currentScrollPos = window.pageYOffset
    if (currentScrollPos > 750) {
      this.setState({
        prevScrollposition: currentScrollPos,
        aboutVisible: true
      })
    } else if (currentScrollPos < 500) {
      this.setState({
        aboutVisible: false
      })
    }
  }
  handleVideoPlay () {
    if (this.state.videoFile) {
      this.setState({ videoPlay: true })
    } else {
      ToastsStore.warning('Sorry no videos are avaliable')
    }
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
    // event.preventdefault()
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
    // event.preventdefault()
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
    // event.preventdefault()
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
    // event.preventdefault()
  }
  handleRooms (status, membersCapacity, childsCapacity) {
    let numOfPeople = this.state.adults + this.state.childs
    let noOfAdults = this.state.adults
    // let noOfChildren = this.state.childs
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
  getNumOfDays = (checkInDate, checkOutDate) => {
    let getNumcheckIn = moment(checkInDate).format('YYYY-MM-DD')
    let getNumcheckOut = moment(checkOutDate).format('YYYY-MM-DD')
    let checkIn = moment.utc(getNumcheckIn)
    let checkOut = moment.utc(getNumcheckOut)
    let duration = moment.duration(checkOut.diff(checkIn))
    let days = duration.asDays()
    let hours = duration.asHours()
    this.setState({ totalDays: days, totalHours: hours })
  }
  handleCheckInDate (checkInDate) {
    let checkInDateTime = moment(checkInDate).format('YYYY-MM-DD') + ' ' + this.state.checkInTime
    let checkInDateFormat = moment(checkInDate).format('YYYY-MM-DD')
    let EUBookingType = JSON.parse(localStorage.getItem('EUBookingType'))
    let propertyInfoData = JSON.parse(localStorage.getItem('EUPropertyInfoData'))
    let pricing = propertyInfoData.pricing ? propertyInfoData.pricing : propertyInfoData.spPropertyInfoId.pricing
    // let checkInDateValue = moment(checkInDateFormat, 'YYYY-DD-MM').valueOf()
    // let checkOutDateValue = moment(this.state.checkOutDate, 'YYYY-DD-MM').valueOf()
    let currentDay = moment().format('YYYY-MM-DD')
    // let currentDayValue = moment(currentDay, 'YYYY-MM-DD').valueOf()
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
      // let checkInDateValue = moment(newCheckInDate).format('YYYY-DD-MM')
      // let checkOutDateValue = moment(newCheckOutDate).format('YYYY-DD-MM')
      this.setState({
        checkInDate: newCheckInDate,
        checkInMinDate: new Date(moment(currDay, 'YYYY-MM-DD')),
        checkOutMinDate: new Date(moment(checkOutMinDate, 'YYYY-MM-DD')),
        checkInTimeArray: ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM'],
        checkOutDate: newCheckOutDate
      })
      this.handleHoursAmount(newCheckInDate, newCheckOutDate, this.state.checkInTime, this.state.checkOutTime)
      this.getNumberOfRoomsCount(newCheckInDate, newCheckOutDate, this.state.checkInTime, this.state.checkOutTime)
      // this.getNumOfDays(newCheckInDate, newCheckOutDate)
    } else {
      let checkInTime = (EUBookingType === 'Hours' && moment(value, 'hh:mm A') > moment(this.state.checkInTime, 'hh:mm A')) ? value : this.state.checkInTime
      // let checkInDateValue = moment(checkInDate, 'YYYY-DD-MM').format('YYYY-DD-MM')
      let checkOutMinDate = (pricing.isMidnightCheckOutAllowed || value !== '06:00 PM') ? moment(currDay + ' ' + value, 'YYYY-MM-DD hh:mm A').add(5, 'h').format('YYYY-MM-DD')
        : moment(currDay + ' ' + value, 'YYYY-MM-DD hh:mm A').add(11, 'h').format('YYYY-MM-DD')
      // let checkOutDateValue = moment(this.state.checkOutDate, 'YYYY-DD-MM').format('YYYY-DD-MM')
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
      // this.getNumOfDays(checkInDate, this.state.checkOutDate)
    }
  }
  handleCheckOutDate (checkOutDate) {
    let checkInDateValue = moment(this.state.checkInDate, 'YYYY-DD-MM').format('YYYY-MM-DD')
    let checkOutDateValue = moment(checkOutDate, 'YYYY-DD-MM').format('YYYY-MM-DD')
    let _this = this
    let newCheckInDate = new Date(moment(this.state.checkInDate, 'YYYY-DD-MM'))
    let newCheckOutDate = new Date(moment(checkOutDate, 'YYYY-DD-MM'))
    let EUBookingType = JSON.parse(localStorage.getItem('EUBookingType'))
    // if (checkOutDateValue !== checkInDateValue) {
    //   this.setState({ checkOutDate: newCheckOutDate })
    //   this.getCheckOutTimes(this.state.checkInTime, false, function (resObj) {
    //     _this.handleHoursAmount(newCheckInDate, newCheckOutDate, _this.state.checkInTime, resObj.checkOutTime)
    //     _this.getNumberOfRoomsCount(newCheckInDate, newCheckOutDate, _this.state.checkInTime, resObj.checkOutTime)
    //   })
    // } else {
    if (EUBookingType === 'Days' && checkOutDateValue === checkInDateValue) {
      localStorage.setItem('EUBookingType', JSON.stringify('Hours'))
    }
    this.setState({ checkOutDate: newCheckOutDate })
    this.getCheckOutTimes(this.state.checkInTime, checkOutDateValue === checkInDateValue, function (resObj) {
      _this.handleHoursAmount(newCheckInDate, newCheckOutDate, _this.state.checkInTime, resObj.checkOutTime)
      _this.getNumberOfRoomsCount(newCheckInDate, newCheckOutDate, _this.state.checkInTime, resObj.checkOutTime)
    })
    // }
    // this.getNumOfDays(newCheckInDate, newCheckOutDate)
  }
  handleCheckInTime (event) {
    let checkInDateString = moment(this.state.checkInDate, 'YYYY-DD-MM').format('YYYY-DD-MM')
    let checkOutDateString = moment(this.state.checkOutDate, 'YYYY-DD-MM').format('YYYY-DD-MM')
    let propertyInfoData = JSON.parse(localStorage.getItem('EUPropertyInfoData'))
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
  getRoomsCount () {
    let cidt = moment(this.state.checkInDate).format('YYYY-MM-DD')
    let codt = moment(this.state.checkOutDate).format('YYYY-MM-DD')
    let checkInHours = moment(this.state.checkInTime, ['hh:mm A']).format('HH:mm')
    let checkOutHours = moment(this.state.checkOutTime, ['hh:mm A']).format('HH:mm')
    let body = {
      noOfRooms: this.state.rooms,
      checkInDate: cidt + ' ' + checkInHours,
      checkOutDate: codt + ' ' + checkOutHours,
      spPropertyInfoId: this.state.propertyInfoData._id,
      spServiceProviderId: this.state.propertyInfoData.spServiceProviderId,
      propertyId: this.state.propertyId
    // propertyId: this.state.propertyInfoData.propertyId._id ? this.state.propertyInfoData.propertyId._id : this.state.propertyInfoData.propertyId
    }
    let obj = { url: config.baseUrl + config.postEUBookingRoomsCountAPI, body: body }
    let _this = this
    APICallManager.postCall(obj, function (resObj) {
      setTimeout(() => {
        if (resObj && resObj.data && resObj.data.statusCode === '1017') {
          ToastsStore.warning(resObj && resObj.data && resObj.data.statusMessage)
        } else if (resObj && resObj.data && resObj.data.statusCode === '0000') {
          _this.handleBooking()
        } else {
          ToastsStore.warning('Something Went Wrong Please Try Again')
        }
      }, 100)
    })
  }
  handleBooking () {
    // let userLogedIn = JSON.parse(localStorage.getItem('userData'))
    // let EUBookingType = JSON.parse(localStorage.getItem('EUBookingType'))
    let spData = this.state.propertyInfoData
    let checkInHours = moment(this.state.checkInTime, ['hh:mm A']).format('HH:mm')
    let checkOutHours = moment(this.state.checkOutTime, ['hh:mm A']).format('HH:mm')
    let cidt = moment(this.state.checkInDate).format('YYYY-MM-DD')
    let codt = moment(this.state.checkOutDate).format('YYYY-MM-DD')
    // let totalDays = toString(this.state.days)
    // let totalHours = toString(this.state.hours)
    let dt = moment(cidt, 'YYYY-MM-DD HH:mm:ss')
    let dateName = dt.format('dddd')
    let weekEnd = dateName === 'Saturday' || dateName === 'Sunday' ? 'Weekend' : 'Weekday'
    let postBooking = {
      spServiceProviderId: spData.spServiceProviderId,
      spServiceProvider: spData.spServiceProvider,
      spLocationId: spData.spLocationId,
      contactPerson: spData.spLocationObj.contactPerson,
      mobileNumber: spData.spLocationObj.mobileNumber,
      alternateMobileNumber: spData.spLocationObj.alternateMobileNumber ? spData.spLocationObj.alternateMobileNumber : '',
      spemail: spData.spLocationObj.email,
      address: spData.spLocationObj.address,
      landmark: spData.spLocationObj.landmark ? spData.spLocationObj.landmark : '',
      area: spData.spLocationObj.area,
      areaLocality: spData.spLocationObj.areaLocality,
      zip: spData.spLocationObj.zip,
      city: spData.spLocationObj.city,
      state: spData.spLocationObj.state,
      country: spData.spLocationObj.country,
      latitude: spData.spLocationObj.latitude,
      longitude: spData.spLocationObj.longitude,
      spPropertyId: spData.propertyId._id ? spData.propertyId._id : spData.propertyId,
      spPropertyTitle: spData && spData.spPropertyInfoId && spData.spPropertyInfoId.propertyTitle ? spData.spPropertyInfoId.propertyTitle : spData.propertyTitle,
      spPropertyType: spData && spData.spPropertyInfoId && spData.spPropertyInfoId.propertyType ? spData.spPropertyInfoId.propertyType : spData.propertyType,
      spPropertyInfoId: spData._id,
      bookingType: 'Hours',
      roomPrice: this.state.amount,
      noOfAdults: this.state.adults,
      noOfChilds: this.state.childs.toString(),
      noOfRooms: this.state.rooms,
      checkInDate: cidt + ' ' + checkInHours,
      checkOutDate: codt + ' ' + checkOutHours,
      totalPrice: (this.state.rooms) * (this.state.amount),
      noOfDays: this.state.days,
      totalHours: this.state.hours,
      dateType: weekEnd
    }
    let checkInDateTime = moment(cidt + ' ' + checkInHours, 'YYYY-MM-DD hh:mm A').valueOf()
    let checkOutDateTime = moment(codt + ' ' + checkOutHours, 'YYYY-MM-DD hh:mm A').valueOf()
    if (checkOutDateTime < checkInDateTime) {
      ToastsStore.warning('CheckOut date and time should be greater than checkin date time')
    } else {
      // if (userLogedIn === null) {
      //   localStorage.setItem('postBooking', JSON.stringify(postBooking))
      //   localStorage.setItem('propertyDocs', JSON.stringify(this.state.propertyDocs))
      //   hashHistory.push('/login')
      // } else {
      localStorage.setItem('postBooking', JSON.stringify(postBooking))
      localStorage.setItem('propertyDocs', JSON.stringify(this.state.propertyDocs))
      this.setState({ confirmBooking: true, postBooking: postBooking })
      hashHistory.push('/admin/eu/booking/confirm')
      // }
    }
    // event.preventdefault()
  }
  confirmBooking () {
    this.setState({ confirmBooking: false })
  }
  handleUnfavouriteProperty (data) {
    var userDataObj = this.state.userData
    let favouriteProperties = this.state.favouriteProperties
    let propertyID = data.propertyId._id ? data.propertyId._id : data.propertyId
    var userData = {
      spPropertyId: propertyID,
      spID: data.spServiceProviderId
    }
    let _this = this
    let obj = { url: config.baseUrl + config.putADEUUnfavouritePropertyAPI + this.state.userData._id, body: userData }
    APICallManager.putCall(obj, function (resObj) {
      if (resObj && resObj.data.statusCode === '0000') {
        let index = favouriteProperties.findIndex(x => x === propertyID)
        favouriteProperties.splice(index, 1)
        userDataObj.preferences.favouriteProperties = favouriteProperties
        localStorage.setItem('userData', JSON.stringify(userDataObj))
        _this.setState({ favouriteProperties: favouriteProperties })
      }
    })
  }
  handleFavouriteProperty (data) {
    let userData = this.state.userData
    if (!this.state.userData.name) {
      ToastsStore.warning('You can favoritre this after booking this property')
    } else if (userData && userData.mobileNumber) {
      let userDataObj = userData
      let postJson = {
        customer: userData.name,
        serviceProviderID: data.spServiceProviderId,
        serviceProvider: data.spServiceProvider,
        spPropertyTitle: this.state.propertyTitle,
        spPropertyId: this.state.propertyId,
        spPropertyInfoId: data._id,
        spLocationId: data.spLocationId,
        contactPerson: data.spLocationObj.contactPerson,
        mobileNumber: data.spLocationObj.mobileNumber,
        alternateMobileNumber: data.spLocationObj.alternateMobileNumber ? data.spLocationObj.alternateMobileNumber : '',
        email: data.spLocationObj.email,
        address: data.spLocationObj.address,
        landmark: data.spLocationObj.landmark,
        area: data.spLocationObj.area,
        areaLocality: data.spLocationObj.areaLocality,
        zip: data.spLocationObj.zip,
        city: data.spLocationObj.city,
        state: data.spLocationObj.state,
        country: data.spLocationObj.country,
        latitude: data.spLocationObj.latitude,
        longitude: data.spLocationObj.longitude
      }
      let _this = this
      let obj = { url: config.baseUrl + config.postADEUFavouritePropertyAPI + this.state.userData._id, body: postJson }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj && resObj.data.statusCode === '0000') {
          _this.setState({ isFavourite: true })
          let favouriteProperties = _this.state.favouriteProperties
          let propertyID = data.propertyId._id ? data.propertyId._id : data.propertyId
          favouriteProperties.push(propertyID)
          userDataObj.preferences.favouriteProperties = favouriteProperties
          localStorage.setItem('userData', JSON.stringify(userDataObj))
          _this.setState({ favouriteProperties: favouriteProperties })
        }
      })
    } else {
      hashHistory.push('/login')
    }
  }
  handlePropertyInfo (data) {
    localStorage.setItem('EUPropertyInfoData', JSON.stringify(data))
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    homePageData.checkInDate = this.state.checkInDate
    homePageData.checkOutDate = this.state.checkOutDate
    homePageData.child = this.state.childs
    homePageData.guestAdultValue = this.state.adults
    localStorage.setItem('homePageData', JSON.stringify(homePageData))
    if (data.pricing.minBasePriceUnit !== 'Per Day') {
      this.setState({ propertyInfoData: data, amenities: data.amenities, guestRules: data.guestRules, services: data.services })
      // this.handleApiCalls()
      this.setRoomsCount()
      this.reloadFunction()
    } else {
      this.props.handlePropertyInfo(data)
    }
  }
  handleApiCalls () {
    let propertyInfoData = JSON.parse(localStorage.getItem('EUPropertyInfoData'))
    let cidt = moment(this.state.checkInDate).format('YYYY-MM-DD')
    let codt = moment(this.state.checkOutDate).format('YYYY-MM-DD')
    let checkInHours = moment(this.state.checkInTime, ['hh:mm A']).format('HH:mm')
    let checkOutHours = moment(this.state.checkOutTime, ['hh:mm A']).format('HH:mm')
    // Start -- API to get room count
    let body = {
      noOfRooms: this.state.rooms,
      checkInDate: cidt + ' ' + checkInHours,
      checkOutDate: codt + ' ' + checkOutHours,
      spPropertyInfoId: propertyInfoData._id,
      spServiceProviderId: propertyInfoData.spServiceProviderId,
      propertyId: this.state.propertyId
      // propertyId: propertyInfoData.propertyId._id ? propertyInfoData.propertyId._id : propertyInfoData.propertyId
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
    // End -- API to get room count
    // Start -- API to get property docs
    let propertyId = this.state.propertyId
      // let propertyId = propertyInfoData.propertyId._id ? propertyInfoData.propertyId._id : propertyInfoData.propertyId
    let getSPPropertyDocsObj = {
      url: config.baseUrl + config.getPropertyDocsAPI + propertyId
    }
    APICallManager.getCall(getSPPropertyDocsObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        let videoFile = resObj.data.statusResult.find(data => data.fileType === 'Video')
        _this.setState({
          propertyDocs : resObj.data.statusResult
        })
        if (videoFile) {
          _this.setState({
            videoFile: videoFile.imagePath
          })
        }
      }
    })
    // End -- API to get property docs
    // Start -- API to get property infos
    let getSPPropertyInfoObj = {
      url: config.baseUrl + config.getSPPropertyInfosAPI + propertyId
    }
    APICallManager.getCall(getSPPropertyInfoObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ selectPropertyInfo: resObj.data.statusResult })
      } else {
        _this.setState({ selectPropertyInfo: [] })
      }
    })
  }
  setRoomsCount () {
    let propertyInfoData = JSON.parse(localStorage.getItem('EUPropertyInfoData'))
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
  reloadFunction () {
    this.getCheckInTimes()
    // let EUBookingType = JSON.parse(localStorage.getItem('EUBookingType'))
    // let propertyInfoData = JSON.parse(localStorage.getItem('EUPropertyInfoData'))
    // let pricing = propertyInfoData.pricing
    // // let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    // let userCheckInDateValue = moment(this.state.checkInDate).format('YYYY-MM-DD').valueOf()
    // let userCheckOutDateValue = moment(this.state.checkOutDate).format('YYYY-MM-DD').valueOf()
    // let currentDateValue = moment().format('YYYY-MM-DD').valueOf()
    // let _this = this

    // let currDayTime = moment().format('YYYY-MM-DD HH:mm')
    // let currDt = moment(currDayTime, 'YYYY-MM-DD HH:mm').valueOf()
    // let currDay = currDt >= moment(moment().format('YYYY-MM-DD') + ' 21:00', 'YYYY-MM-DD HH:mm').valueOf() ? moment().add(1, 'day').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
    // let value = (currDt >= moment(currDay + ' 21:00', 'YYYY-MM-DD HH:mm').valueOf() || currDt < moment(currDay + ' 03:00', 'YYYY-MM-DD HH:mm').valueOf())
    //   ? '12:00 AM' : ((currDt >= moment(currDay + ' 03:00', 'YYYY-MM-DD HH:mm').valueOf() && currDt < moment(currDay + ' 09:00', 'YYYY-MM-DD HH:mm').valueOf())
    //     ? '06:00 AM' : (currDt >= moment(currDay + ' 09:00', 'YYYY-MM-DD HH:mm').valueOf() && currDt < moment(currDay + ' 15:00', 'YYYY-MM-DD HH:mm').valueOf())
    //       ? '12:00 PM' : (currDt >= moment(currDay + ' 15:00', 'YYYY-MM-DD HH:mm').valueOf() && currDt < moment(currDay + ' 21:00', 'YYYY-MM-DD HH:mm').valueOf())
    //         ? '06:00 PM' : '12:00 PM')
    // let checkInDate = userCheckInDateValue > currentDateValue ? moment(this.state.checkInDate).format('YYYY-MM-DD') + ' ' + this.state.checkInTime
    //   : moment(this.state.checkInDate).format('YYYY-MM-DD') + ' ' + value
    // let checkOutMinDate = (pricing.isMidnightCheckOutAllowed || value !== '06:00 PM') ? moment(checkInDate).add(5, 'h').format('YYYY-MM-DD') : moment(checkInDate).add(11, 'h').format('YYYY-MM-DD')
    // let checkOutDate = (pricing.isMidnightCheckOutAllowed || value !== '06:00 PM')
    //   ? moment(checkInDate).add(5, 'h').format('YYYY-MM-DD')
    //   : moment(checkInDate).add(11, 'h').format('YYYY-MM-DD')
    // if (userCheckInDateValue > currentDateValue) {
    //   this.getCheckOutTimes(this.state.checkInTime, userCheckInDateValue === userCheckOutDateValue, function (resObj) {
    //     _this.handleHoursAmount(new Date(checkInDate), new Date(checkOutDate), _this.state.checkInTime, resObj.checkOutTime)
    //   })
    //   this.setState({
    //     checkInDate: new Date(checkInDate), checkOutMinDate: new Date(checkOutMinDate), checkOutDate: new Date(checkOutDate) })
    // } else if (EUBookingType !== 'Days') {
    //   // let checkInDate = currDay + ' ' + value
    //   // let checkOutDate = (pricing.isMidnightCheckOutAllowed || value !== '06:00 PM') ? moment(checkInDate).add(5, 'h').format('YYYY-MM-DD') : moment(checkInDate).add(11, 'h').format('YYYY-MM-DD')
    //   this.setState({ checkInTime: value,
    //     checkInTimeArray: value === '12:00 AM'
    //       ? ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM'] : (value === '06:00 AM'
    //         ? ['06:00 AM', '12:00 PM', '06:00 PM'] : value === '12:00 PM'
    //           ? ['12:00 PM', '06:00 PM'] : ['06:00 PM']
    //       ),
    //     checkInDate: new Date(checkInDate),
    //     checkOutMinDate: new Date(checkOutMinDate),
    //     checkOutDate: new Date(checkOutDate)
    //   })
    //   this.getNumOfDays(checkInDate, checkOutDate)
    //   this.getCheckOutTimes(value, currDay === checkOutDate, function (resObj) {
    //     _this.handleHoursAmount(checkInDate, checkOutDate, value, resObj.checkOutTime)
    //   })
    // } else {
    //   this.getCheckOutTimes('12:00 PM', false, function (resObj) {})
    //   this.setState({ checkInTime: '12:00 PM',
    //     checkInTimeArray: value === '12:00 AM' ? ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM'] : (value === '06:00 AM' ? ['06:00 AM', '12:00 PM', '06:00 PM'] : ['12:00 PM', '06:00 PM']),
    //     checkInDate: new Date(checkInDate),
    //     checkOutMinDate: new Date(checkOutMinDate),
    //     checkOutDate: new Date(checkOutDate)
    //   })
    //   this.handleHoursAmount(this.state.checkInDate, this.state.checkOutDate, '12:00 PM', '11:00 AM')
    // }
  }
  scrollToMyRef = (event) => {
    if (this.myRef.current) {
      this.myRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
      this.setState({
        activePhotos: true, activeLocation: false, activeReview: false, activeHost: false, activeAbout: false
      })
    }
  }
  scrollTolocationRef = (event) => {
    if (this.locationRef.current) {
      this.locationRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
      this.setState({
        activeLocation: true, activeReview: false, activeHost: false, activeAbout: false, activePhotos: false
      })
    }
  }
  scrollToReviewRef = (event) => {
    if (this.reviewRef.current) {
      this.reviewRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
      this.setState({
        activeReview: true, activeHost: false, activeAbout: false, activePhotos: false, activeLocation: false
      })
    }
  }
  scrollToAboutRef = () => {
    if (this.aboutRef.current) {
      this.aboutRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
      this.setState({
        activeAbout: true, activePhotos: false, activeLocation: false, activeReview: false, activeHost: false
      })
    }
  }
  handleInputChange (event) {
    let _this = this
    _this.setState({ searchString: event.target.value })
    let obj = {
      url: config.baseUrl + config.getEUReviewRatingsListAPI + event.target.value
    }
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          reviewRatingList: resObj.data.statusResult, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          reviewRatingList: [], totalCount: 0, matchesData: true
        })
      }
    })
  }
  render () {
    let favourite = ''
    if (this.state.favouriteProperties && this.state.favouriteProperties.length) {
      favourite = this.state.favouriteProperties.find(fp => fp === this.state.propertyId)
    }
    return (
      <div id='eu-page-wrapper '>
        <main role='main' className='inner cover hotelView-wrapper'>
          {this.state.videoPlay === true
          ? <section className='video-playing-section white-bg ' style={{ backgroundColor: '#ffffff' }}>
            <div className='container'>
              <div className='row'>
                <div className='col-sm-11 text-center mt-6'>
                  <div className='card mb-1 mt-3' style={{ backgroundColor: '#eef5fb' }} >
                    <div className='card-body ml-6'>
                      <div className='video-playing-max'>
                        <video playsInline controls muted='muted' loop='loop'>
                          <source src={config.baseUrl + this.state.videoFile} type='video/mp4' />
                        </video>
                      </div>
                      <a className='video-close' onClick={() => this.setState({ videoPlay: false })} ><span><i className='fas fa-close' /></span></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          : <div>
            <Carousel className='mb-7 admin-listItem' infiniteLoop useKeyboardArrows dynamicHeight showArrows autoPlay onChange={this.onChange} onClickItem={this.onClickItem} onClickThumb={this.onClickThumb}>
              {this.state.propertyDocs.length > 0 ? this.state.propertyDocs.map((item, i) =>
                <div className='slide-1' key={i}>
                  {item.fileType !== 'Video'
                  ? <img src={config.baseUrl + item.imagePath} />
                  : <img src={require('../../../../assets/videos/player-3311600__340.png')} />}
                  <div className='content'>
                    <div className='container'>
                      <div className='row'>
                        <div className='col-lg-9 col-sm-9 col-xs-12'>
                          <div className='prop-information-content'>
                            <div>
                              <div className='property-info'>
                                <h1 className='title-sq'>{this.state.propertyInfoData.propertyTitle}
                                  <span>
                                    {this.state.userData && this.state.userData.mobileNumber
                                      ? favourite === this.state.propertyId
                                      ? <a onClick={() => this.handleUnfavouriteProperty(this.state.propertyInfoData)}>
                                        <i className='fas fa-heart ml-3' title='you liked hotel' style={{ color: 'white', fontSize: 25 }} /></a>
                                        : <a onClick={() => this.handleFavouriteProperty(this.state.propertyInfoData)}>
                                          <i className='far fa-heart ml-3' title='like hotel' style={{ color: 'white', fontSize: 25 }} />
                                        </a> : null}
                                  </span>
                                </h1>
                                <div className='rating-sq'>
                                  {this.state.propertyInfoData.rating
                                    ? <div><span> {this.state.propertyInfoData.rating} </span>
                                      <a><i className='fas fa-star' style={{ color: 'white' }} /></a>
                                    </div>
                                    : null}
                                </div>
                                <div className='location-sq font-weight-600'>
                                  <i className='fas fa-map-marker-alt' />
                                  {this.state.propertyInfoData.spLocationObj.address}
                                </div>
                                <div className='location-sq pt-0 pb-7'>
                                  {this.state.videoFile
                                  ? <a onClick={this.handleVideoPlay} className='text-white' >
                                    <i className='fas fa-video pr-2' />
                                      Watch Video
                                    </a>
                                  : null }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </Carousel>
            <div className='ui column side-column'>
              <div className=' instant-booking-content'>
                <div>
                  <div className='property-sticky-box-wrapper'>
                    <div
                      className={classnames('sticky-element sticky-desktop sticky-large-desktop under-ths burger-mobile-modal search-visible', { 'ths-is-slide-up': this.state.visible })}
                      data-burger='menu04' style={{ height: '417px' }}>
                      <div className='property-sticky-box'>
                        <div className='price-tag-sq'>
                          <span className='price-sq'> ₹ {(this.state.rooms) * (this.state.amount)}</span>
                          {/* <span className='per-sq text-white font-weight-500' data-text-mobile='/ ' data-text='Total Days'> {this.state.totalDays} </span> */}
                        </div>
                        <div className='button-sq font-weight-extrabold-sq mobile-fixed-trigger hidden-desktop hidden-large-desktop hidden-tablet modal-trigger'
                          data-trigger-for='menu04' onClick={() => this.setState({ mobileBooknow : !this.state.mobileBooknow })}>Instant Booking</div>
                        <div className={classnames('mobile-fixed-section', { 'mobile-booknow-open': this.state.mobileBooknow })}>
                          <div className='sticky-box-content'>
                            {this.state.mobileBooknow
                            ? <div className='col-12 text-right pt-3 pb-4'>
                              <div className='close-div'>
                                <a onClick={() => this.setState({ mobileBooknow : !this.state.mobileBooknow })}><span><i className='fa fa-times' style={{ fontSize: 30 }} /></span></a>
                              </div>
                            </div>
                            : null }
                            <form>
                              <div className='main-infos inline-check-in'>
                                <div className='check-in calendar-sq' id='sticky-box-rangestart'>
                                  <label className='placeholder'>Check In</label>
                                  <div className='relative'>
                                    <DatePicker
                                      onKeyDown={(e) => e.preventDefault()}
                                      dateFormat='MMM dd, yyyy'
                                      selected={this.state.checkInDate}
                                      minDate={new Date()}
                                      maxDate={addDays(new Date(), this.state.maxDate)}
                                      onChange={(checkInDate) => this.handleCheckInDate(checkInDate)}
                                    />
                                    <i className='fas fa-long-arrow-alt-right' />
                                  </div>
                                </div>
                                <div className='check-out calendar-sq' id='sticky-box-rangeend'>
                                  <label className='placeholder'>Check Out</label>
                                  <DatePicker
                                    onKeyDown={(e) => e.preventDefault()}
                                    dateFormat='MMM dd, yyyy'
                                    selected={this.state.checkOutDate}
                                    minDate={this.state.checkOutMinDate}
                                    maxDate={addDays(new Date(), this.state.maxDate)}
                                    onChange={(checkOutDate) => this.handleCheckOutDate(checkOutDate)}
                                  />
                                </div>
                              </div>
                              <div className='main-infos inline-check-in'>
                                <div className='check-in calendar-sq' id='sticky-box-rangestart'>
                                  <label className='placeholder' data-placeholder='CheckIn Times' />
                                  <div className='relative'>
                                    <select value={this.state.checkInTime} onChange={(event) => this.handleCheckInTime(event)} multiple='' className='form-control'>
                                      {this.state.checkInTimeArray.map((data, i) => {
                                        return <option key={i} value={data}>{data}</option>
                                      })}
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className='main-infos inline-check-in'>
                                <div className='check-in calendar-sq' id='sticky-box-rangestart'>
                                  <label className='placeholder' data-placeholder='CheckOut Times' />
                                  <div className='relative'>
                                    <select value={this.state.checkOutTime} onChange={(event) => this.handleCheckOutTime(event)} multiple='' className='form-control'>
                                      {this.state.checkOutTimeArray.length > 0
                                      ? this.state.checkOutTimeArray.map((data, i) => {
                                        return <option key={i} value={data}>{data}</option>
                                      })
                                      : '11:00 AM'}
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className='main-infos inline-check-in mt-2'>
                                <div className='check-in calendar-sq' id='sticky-box-rangestart'>
                                  <label className='placeholder'>Adults</label>
                                  <a onClick={() => this.setState({ guestDropdownActive:true })} >
                                    <div className='relative guests-Adults-dropdown'>
                                      <label>{this.state.adults}</label>
                                    </div>
                                  </a>
                                </div>
                                <div className='check-out calendar-sq' id='sticky-box-rangeend'>
                                  <label className='placeholder'>Childs</label>
                                  <a onClick={() => this.setState({ guestDropdownActive:true })} >
                                    <div className='childs-Adults-dropdown'>
                                      <label>{this.state.childs}</label>
                                    </div>
                                  </a>
                                </div>
                                <div className='days' style={{ top: 0 }} >
                                  <label className='placeholder' >Rooms</label>
                                  <a onClick={() => this.setState({ guestDropdownActive:true })} >
                                    <div className='rooms-Adults-dropdown'>
                                      <label>{this.state.rooms}</label>
                                    </div>
                                  </a>
                                </div>
                              </div>
                              {this.state.guestDropdownActive === true
                              ? <div className='book-now overlay-guest-dropdown'>
                                <div className='guest-dropdown-div'>
                                  <div className='card-body'>
                                    <div className='row mb-2'>
                                      <div className='col-sm-3 py-2'>{t`lanEULabelAdults`}</div>
                                      <div className='col-sm-3'>
                                        <button type='button' className='circle-class' disabled={this.state.adults <= 1}
                                          onClick={() => this.handleAdultsDecrease(this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)} >
                                          <i className='fas fa-minus mr-0' style={{ color: 'black' }} />
                                        </button>
                                      </div>
                                      <div className='col-sm-3  py-2 text-center '><strong> {this.state.adults} </strong></div>
                                      <div className='col-sm-3'>
                                        <button type='button' className='circle-class'
                                          disabled={parseInt(this.state.adults) > ((this.state.avaliableRoomCount) * (this.state.propertyInfoData.membersCapacity) - 1) ||
                                          (parseInt(this.state.adults) + parseInt(this.state.childs) >
                                          ((this.state.avaliableRoomCount) * (parseInt(this.state.propertyInfoData.membersCapacity) + parseInt(this.state.propertyInfoData.childsCapacity)) - 1))}
                                          onClick={() => this.handleAdultsIncrease(this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)} >
                                          <i className='fas fa-plus mr-0' style={{ color: 'black' }} />
                                        </button>
                                      </div>
                                    </div>
                                    <div className='row mb-2'>
                                      <div className='col-sm-3 py-2'>{t`lanEULabelChilds`}</div>
                                      <div className='col-sm-3'>
                                        <button type='button' className='circle-class' disabled={this.state.childs <= 0}
                                          onClick={() => this.handleChildsDecrease(this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)} >
                                          <i className='fas fa-minus' style={{ color: 'black' }} />
                                        </button>
                                      </div>
                                      <div className='col-sm-3  py-2 text-center '><strong> {this.state.childs} </strong></div>
                                      <div className='col-sm-3'>
                                        <button type='button' className='circle-class'
                                          disabled={(parseInt(this.state.childs) > (this.state.avaliableRoomCount) * (this.state.propertyInfoData.childsCapacity) - 1) &&
                                          (parseInt(this.state.adults) > (this.state.avaliableRoomCount) * (this.state.propertyInfoData.membersCapacity) - 1) ||
                                          (parseInt(this.state.adults) + parseInt(this.state.childs) >
                                          ((this.state.avaliableRoomCount) * (parseInt(this.state.propertyInfoData.membersCapacity) + parseInt(this.state.propertyInfoData.childsCapacity)) - 1))}
                                          onClick={() => this.handleChildsIncrease(this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)} >
                                          <i className='fas fa-plus' style={{ color: 'black' }} />
                                        </button>
                                      </div>
                                    </div>
                                    <div className='row mb-2'>
                                      <div className='col-sm-3 py-2'>{t`lanEULabelRooms`}</div>
                                      <div className='col-sm-3'>
                                        <button type='button' className='circle-class' disabled={this.state.rooms <= 1}
                                          onClick={() => this.handleRooms('sub', this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)} >
                                          <i className='fas fa-minus' style={{ color: 'black' }} />
                                        </button>
                                      </div>
                                      <div className='col-sm-3  py-2 text-center '><strong> {this.state.rooms} </strong></div>
                                      <div className='col-sm-3'>
                                        <button type='button' className='circle-class' disabled={this.state.avaliableRoomCount <= this.state.rooms}
                                          onClick={() => this.handleRooms('add', this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)} >
                                          <i className='fas fa-plus' style={{ color: 'black' }} />
                                        </button>
                                      </div>
                                    </div>
                                    <div className='row mt-3'>
                                      <div className='col-sm-12 text-right'>
                                        <button type='button' className='btn btn-primary' onClick={() => this.setState({ guestDropdownActive:false })} > {t`lanEUButtonApply`}</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              : null }
                              <div className='calculations mt-3'>
                                <div className='calc-row'>
                                  <div className='calc-column'>
                                    <p className='desc mb-0'>Amount</p>
                                  </div>
                                  <div className='calc-column'>
                                    <p className='price-sq mb-0'>₹ {this.state.amount}</p>
                                  </div>
                                </div>
                                <div className='calc-row'>
                                  <div className='calc-column'>
                                    <p className='desc mb-0'>No.of days/Hours</p>
                                  </div>
                                  <div className='calc-column'>
                                    {this.state.days === 0
                                      ? <p className='price-sq mb-0'> {`${this.state.hours} hours`}</p>
                                      : this.state.days >= 2
                                      ? <p className='price-sq mb-0'> {`${this.state.days} days / ${this.state.hours} hours` }</p>
                                      : <p className='price-sq mb-0'> {`${this.state.days} day / ${this.state.hours} hours` }</p> }
                                  </div>
                                </div>
                                <div className='calc-row'>
                                  <div className='calc-column'>
                                    <p className='desc mb-0'>{t`lanEULabelTotal`}</p>
                                  </div>
                                  <div className='calc-column'>
                                    <p className='price-sq mb-0'>₹ {(this.state.rooms) * (this.state.amount)}</p>
                                  </div>
                                </div>
                              </div>
                              <button type='button' disabled={this.state.propertyBlocked || this.state.rooms > this.state.avaliableRoomCount} onClick={() => this.getRoomsCount(this.state.avaliableRoomCount)}
                                className={classnames('button-sq fullwidth-sq font-weight-extrabold-sq', { 'disabled': this.state.propertyBlocked || this.state.rooms > this.state.avaliableRoomCount })}>
                                {t`lanEUButtonBookNow`}</button>
                              { this.state.propertyBlocked ? null : <p className='desc mb-0 text-success'>{`Hurry up!!! Only ${this.state.avaliableRoomCount} Rooms Left`}</p> }
                              <p className='desc mb-0 text-danger'>{this.state.BookingBlocked}</p>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
          <div className='container-fluid about-property-section'>
            <div className='row'>
              <div className='col-lg-12 col-sm-12 pl-0 pr-0 col-xs-12'>
                <div className='jumbotron section-about-property'>
                  <nav id='navbar-example2' className={classnames('all-about-propertynavbar py-3 navbar-light w-100 bg-white', { 'all-about-property-sticky bg-white py-3' : this.state.aboutVisible })} >
                    <ul className='nav nav-pills px-6'>
                      <li className='nav-item'>
                        <a className={classnames('nav-link', { 'activeStyle': this.state.activeAbout })} onClick={this.scrollToAboutRef} >About Property</a>
                      </li>
                      <li className='nav-item'>
                        <a className={classnames('nav-link', { 'activeStyle': this.state.activePhotos })} onClick={this.scrollToMyRef} >{t`lanEULabelPhotos`}</a>
                      </li>
                      <li className='nav-item'>
                        <a className={classnames('nav-link', { 'activeStyle': this.state.activeLocation })} onClick={this.scrollTolocationRef} >{t`lanEULabelLocation`}</a>
                      </li>
                      <li className='nav-item'>
                        <a className={classnames('nav-link', { 'activeStyle': this.state.activeReview })} onClick={this.scrollToReviewRef} >{t`lanCommonButtonTooltipReviews`}</a>
                      </li>
                    </ul>
                  </nav>
                  <div data-spy='scroll' data-target='#navbar-example2' data-offset='0'>
                    {/* <!-- property details grid About starts--> */}
                    <div className=' container'>
                      <div className='row'>
                        <div className='col-lg-9 col-sm-10 col-xs-12' role='main'>
                          <div ref={this.aboutRef} className='section-container' id='section-01'>
                            <div className='typo-section-sq top-default bottom-default'>
                              <h3>About This Property</h3>
                              <h5>Description</h5>
                              <p>{this.state.propertyId.aboutProperty}</p>
                              {/* <p>{this.state.propertyInfoData.propertyId && this.state.propertyInfoData.propertyId.aboutProperty ? this.state.propertyInfoData.propertyId.aboutProperty
                                 : this.state.propertyInfoData.spPropertyId && this.state.propertyInfoData.spPropertyId.aboutProperty}</p> */}
                            </div>
                            <div className='typo-section-sq pb-2 bottom-default'>
                              <h5>{this.state.propertyInfoData.spServiceProvider}</h5>
                              <div className='ui grid moved'>
                                <div className='twelve wide mobile six wide tablet six wide computer column'>
                                  <ul className='description-list'>
                                    <li>
                                      <i className='fas fa-users' />
                                      <div>
                                        <p>{t`lanEULabelGuests`}:</p>
                                        <strong>{this.state.propertyInfoData.membersCapacity} Adults, {this.state.propertyInfoData.childsCapacity} Childs</strong>
                                      </div>
                                    </li>
                                    <li>
                                      <i className='fas fa-shower' />
                                      <div>
                                        <p>{t`lanEULabelBathRooms`}</p>
                                        <strong>{(this.state.propertyInfoData.privateBathRooms
                                          ? this.state.propertyInfoData.privateBathRooms : 0 + this.state.propertyInfoData.commonBathRooms
                                          ? this.state.propertyInfoData.commonBathRooms : 0)}</strong>
                                      </div>
                                    </li>
                                    <li>
                                      <i className='fas fa-bed' />
                                      <div>
                                        <p>{t`lanEULabelBeds`}</p>
                                        <strong>{(this.state.propertyInfoData.doubleBedsCount
                                          ? this.state.propertyInfoData.doubleBedsCount : 0 + this.state.propertyInfoData.kingBedsCount
                                          ? this.state.propertyInfoData.kingBedsCount : 0 + this.state.propertyInfoData.queenBedsCount
                                          ? this.state.propertyInfoData.queenBedsCount : 0 + this.state.propertyInfoData.singleBedsCount
                                          ? this.state.propertyInfoData.singleBedsCount : 0)}</strong>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                                <div className='twelve wide mobile six wide tablet six wide computer column'>
                                  <ul className='description-list'>
                                    <li>
                                      <i className='far fa-building' />
                                      <div>
                                        <p >{t`lanCommonLabelProperty`}:</p>
                                        <strong>{this.state.propertyInfoData.propertyType}</strong>
                                      </div>
                                    </li>
                                    <li>
                                      <i className='fas fa-door-open' />
                                      <div>
                                        <p>{t`lanEULabelRoomType`}:</p>
                                        <strong>{this.state.propertyInfoData.rentType}</strong>
                                      </div>
                                    </li>
                                    <li>
                                      <i className='fas fa-home' />
                                      <div>
                                        <p>{t`lanSPLabelCheckInTime`} / {t`lanSPLabelCheckOutTime`}:</p><br />
                                        <strong>{this.state.pricing.checkInTime}</strong> / <strong>{this.state.pricing.checkOutTime}</strong>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            {this.state.selectPropertyInfo && this.state.selectPropertyInfo.length > 1
                          ? <div className='typo-section-sq bottom-default'>
                            <h5>Property Infos</h5>
                            <div className='ui grid moved'>
                              <div className='twelve wide column'>
                                <ul className='description-list'>
                                  <div className='row'>
                                    { this.state.selectPropertyInfo.map((data, i) =>
                                      <div className='col-12 col-sm-4' key={i}>
                                        <li>
                                          <div className='row row-data-style py-1'>
                                            <input type='checkbox' style={{ alignSelf: 'center' }} onChange={() => this.handlePropertyInfo(data)} checked={data._id === this.state.propertyInfoData._id} />
                                            <p className='eu-font font-weight-600 m-0 pl-3'>{data.roomType}</p>
                                          </div>
                                        </li>
                                        <li>
                                          <div className='row row-data-style '>
                                            <div className='col- text-left'> <p>Per Day Price :</p> </div>
                                            <div className='col- text-right'><strong>{data.pricing.totalPrice}</strong></div>
                                          </div>
                                        </li>
                                        <li>
                                          <div className='row row-data-style '>
                                            <div className='col- text-left'> <p>Members Capacity :</p> </div>
                                            <div className='col- text-right'><strong>{data.membersCapacity}</strong></div>
                                          </div>
                                        </li>
                                        <li>
                                          <div className='row row-data-style '>
                                            <div className='col- text-left'> <p>Single beds count :</p> </div>
                                            <div className='col- text-right'><strong>{data.singleBedsCount}</strong></div>
                                          </div>
                                        </li>
                                        <li>
                                          <div className='row row-data-style '>
                                            <div className='col- text-left'> <p>Double beds count :</p> </div>
                                            <div className='col- text-right'><strong>{data.doubleBedsCount}</strong></div>
                                          </div>
                                        </li>
                                        <li>
                                          <div className='row row-data-style '>
                                            <div className='col- text-left'> <p>Shower :</p> </div>
                                            <div className='col- text-right'><strong>{data.privateBathRooms}</strong></div>
                                          </div>
                                        </li>
                                      </div>)}
                                  </div>
                                </ul>
                              </div>
                            </div>
                          </div> : null }
                            <div className='typo-section-sq pb-2 bottom-default'>
                              <h5>The Space</h5>
                              <div className='ui grid moved'>
                                <div className='twelve wide column'>
                                  <ul className='description-list'>
                                    <li>
                                      <div>
                                        <p>Full Refund Cancel Time</p>
                                        <strong>{this.state.pricing.fullRefundCancelTime} Hours</strong>
                                      </div>
                                    </li>
                                    <li>
                                      <div>
                                        <p>Refund Cancel Time</p>
                                        <strong>{this.state.pricing.refundCancelTime} Hours</strong>
                                      </div>
                                    </li>
                                    <li>
                                      <div>
                                        <p>Refund Cancel Percentage</p>
                                        <strong>{this.state.pricing.refundCancelPercentage} %</strong>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className='typo-section-sq pb-2 bottom-default '>
                              <h5>Aminities</h5>
                              <div className='ui grid moved'>
                                <div className='ui column'>
                                  <div className='ui accordion more-sq'>
                                    <div className='title'>
                                      <div className='ui grid Aminities-grid'>
                                        {Amenities.map((item, i) => {
                                          let x = this.state.amenities.find(amenity => amenity === item.name)
                                          return (
                                            <div className='twelve wide mobile six wide tablet four wide computer column' key={i}>
                                              <ul className='description-list'>
                                                <li>
                                                  <img src={config.baseUrl + item.amenityIconPath} style={{ width: 20, height: 20 }} />
                                                  <div>
                                                    {/* {x ? <p className='available-aminity' >{item.name}</p> : <p className='disable-aminity'>{item.name}</p>} */}
                                                    {x ? <p className='available-service' >{item.name} <span><i className='fas fa-check text-success' /></span></p>
                                                    : <p className='disable-service' >{item.name} <span><i className='fas fa-times text-danger' /></span></p>}
                                                  </div>
                                                </li>
                                              </ul>
                                            </div>
                                          )
                                        }
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='typo-section-sq pb-2 bottom-default '>
                              <h5>{t`lanEUTitleServices`}</h5>
                              <div className='ui grid moved'>
                                <div className='ui column'>
                                  <div className='ui accordion more-sq'>
                                    <div className='title'>
                                      <div className='ui grid Aminities-grid'>
                                        {Services.map((item, i) => {
                                          let x = this.state.services.find(service => service === item.serviceName)
                                          return (
                                            <div className='twelve wide mobile six wide tablet four wide computer column' key={i}>
                                              <ul className='description-list'>
                                                <li>
                                                  <img src={config.baseUrl + item.serviceIconPath} style={{ width: 20, height: 20 }} />
                                                  <div>
                                                    {x ? <p className='available-service' >{item.serviceName} <span><i className='fas fa-check text-success' /></span></p>
                                                    : <p className='disable-service' >{item.serviceName} <span><i className='fas fa-times text-danger' /></span></p>}
                                                  </div>
                                                </li>
                                              </ul>
                                            </div>
                                          )
                                        }
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='typo-section-sq pb-2 bottom-default '>
                              <h5>{t`lanEUTitleGuestRules`}</h5>
                              <div className='ui grid moved'>
                                <div className='ui column'>
                                  <div className='ui accordion more-sq'>
                                    <div className='title'>
                                      <div className='ui grid Aminities-grid'>
                                        {GuestRules.map((item, i) => {
                                          let x = this.state.guestRules.find(guestRule => guestRule === item.ruleName)
                                          return (
                                            <div className='twelve wide mobile six wide tablet four wide computer column' key={i}>
                                              <ul className='description-list'>
                                                <li>
                                                  <img src={config.baseUrl + item.ruleIconPath} style={{ width: 20, height: 20 }} />
                                                  <div>
                                                    {/* {x ? <p className='available-service' >{item.ruleName}</p> : <p className='disable-service' >{item.ruleName}</p>} */}
                                                    {x ? <p className='available-service' >{item.ruleName} <span><i className='fas fa-check text-success' /></span></p>
                                                    : <p className='disable-service' >{item.ruleName} <span><i className='fas fa-times text-danger' /></span></p>}
                                                  </div>
                                                </li>
                                              </ul>
                                            </div>
                                          )
                                        }
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div ref={this.myRef} className='section-container top-default bottom-default' id='photos-section'>
                            <div className='typo-section-sq top-default bottom-default'>
                              <h3>{t`lanEULabelPhotos`}</h3>
                              <div className='container'>
                                <div className='row'>
                                  {this.state.propertyDocs.length > 0 ? this.state.propertyDocs.map((item, i) =>
                                    <div className='col-sm-4 p-2' key={i}>
                                      <div className='image-div-in-pgotogrid'>
                                        <img className='image-sq slick-img' src={config.baseUrl + item.imagePath}
                                          alt='' data-gallery='gallery' data-caption='Photo 01' />
                                      </div>
                                    </div>
                                  ) : null }
                                </div>
                              </div>
                            </div>
                          </div>
                          <div ref={this.locationRef} className='section-container' id='location-section'>
                            <div className='ui grid container stackable app layout right side'>
                              <div className='stretched row'>
                                <div className='ui column main-column ' role='main'>
                                  <div className='typo-section-sq top-default'>
                                    <h3>{t`lanEULabelLocation`}</h3>
                                  </div>
                                </div>
                                <div className='ui column side-column' />
                              </div>
                            </div>
                            <div className='container'>
                              <div className='row'>
                                <div className='col-lg-11 col-sm-12 col-12'>
                                  <div className='map-wrapper'>
                                    <div id='map'>
                                      <Map google={this.props.google} zoom={16} initialCenter={{ lat: this.state.propertyInfoData.spLocationObj.latitude, lng: this.state.propertyInfoData.spLocationObj.longitude }} >
                                        <Marker title={this.state.propertyInfoData.propertyTitle}
                                          name={'SOMA'} position={{ lat: this.state.propertyInfoData.spLocationObj.latitude, lng: this.state.propertyInfoData.spLocationObj.longitude }} />
                                      </Map>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='ui column side-column'> {/* empty */} </div>
                      </div>
                    </div>
                    <div className=' container mt-2' ref={this.reviewRef}>
                      <div className='stretched row'>
                        <div className='ui column main-column col-lg-9 col-sm-12 col-xs-12' role='main'>
                          <div className='section-container' id='reviews-section' >
                            <div className='typo-section-sq top-default bottom-default'>
                              <h3>Reviews</h3>
                              <div className='reviews-search'>
                                <form className=''>
                                  <input id='reviews-search' type='text' placeholder='Search reviews' value={this.state.searchString} onChange={this.handleInputChange} />
                                  <label><i className='fas fa-search' style={{ color: '#747a80' }} /></label>
                                </form>
                              </div>
                              <div className='col-sm-12'>
                                {this.state.reviewRatingList.length > 0
                                ? this.state.reviewRatingList.map((item, i) =>
                                  <div className='reviews-row'>
                                    <div className='review-meta'>
                                      <a className='avatar-sq verified-sq' >
                                        <img key={i} src={this.state.imgsrc.length ? this.state.imgsrc : (item.euUserId.userIconPath
                                        ? config.baseUrl + item.euUserId.userIconPath : require('../../../../assets/profile-icon.png'))} className='rounded-circle' />
                                      </a>
                                      <a className='name-sq'>{item.euName}</a>
                                    </div>
                                    <div className='comment-sq'>
                                      <span className='date-sq'>{item.createdOn}</span>
                                      <p className='font-weight-400'>{item.reviewComments}</p>
                                    </div>
                                  </div>
                                )
                                  : this.state.matchesData
                                  ? <div className='col-sm-12 text-center my-0' >
                                    <div className='no-data'><p>{t`lanCommonLabelNoMatchesFound`}</p></div>
                                  </div>
                                  : <div className='col-sm-12 text-center my-0' >
                                    <div className='no-data'><p>{t`lanSPLabelNoReviewRatings`}</p></div>
                                  </div>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='ui column side-column' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}
ADHourlyHotelBooking.propTypes = {
  google: PropTypes.any,
  handlePropertyInfo: PropTypes.func
}
export default GoogleApiWrapper({
  apiKey: ('AIzaSyAzRLF3zrXoLF9E0VxCJUQcesO0Z9qqkb0')
})(ADHourlyHotelBooking)
