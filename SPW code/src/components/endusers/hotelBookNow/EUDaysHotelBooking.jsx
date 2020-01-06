/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import './Css/HotelsListItemView.css'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import classnames from 'classnames'
import DatePicker from 'react-datepicker'
import { addDays } from 'date-fns'
import moment from 'moment'
import 'rc-time-picker/assets/index.css'
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
import Amenities from '../../../../assets/amenities/amenities.json'
import GuestRules from '../../../../assets/guestrules/guestRules.json'
import Services from '../../../../assets/services/services.json'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor       : 'transparent',
    border                : 'none'
  }
}

class EUDaysHotelBooking extends React.Component {
  _isMounted = false;
  constructor () {
    super()
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    let propertyInfoData = JSON.parse(localStorage.getItem('EUPropertyInfoData'))
    this.myRef = React.createRef()
    this.locationRef = React.createRef()
    this.reviewRef = React.createRef()
    this.aboutRef = React.createRef()

    this.state = {
      propertyInfoData: JSON.parse(localStorage.getItem('EUPropertyInfoData')),
      authObj: JSON.parse(localStorage.getItem('authObj')),
      checkInDate: homePageData.checkInDate ? new Date(homePageData.checkInDate) : new Date(moment().format('YYYY-MM-DD')),
      checkOutDate: homePageData.checkOutDate ? new Date(homePageData.checkOutDate) : new Date(moment().add(1, 'day').format('YYYY-MM-DD')),
      checkIntime: propertyInfoData.pricing.checkInTime,
      checkOutTime: propertyInfoData.pricing.checkOutTime,
      bookingType: propertyInfoData.pricing.minBasePriceUnit === 'Per Day' ? 'Days' : 'Hours',
      amount: propertyInfoData.pricing.basePrice,
      totalDays: 1,
      adults: homePageData ? homePageData.guestAdultValue : 2,
      childs: homePageData ? homePageData.child : 0,
      rooms: homePageData ? homePageData.guestRooms : 1,
      postBooking: {},
      propertyDocs: [],
      selectPropertyInfo: [],
      amenities: propertyInfoData.amenities,
      guestRules: propertyInfoData.guestRules,
      services: propertyInfoData.services,
      BookingBlocked: '',
      videoFile: '',
      propertyBlocked: false,
      avaliableRoomCount: 0,
      isFavourite: true,
      videoPlay: false,
      propertyId: propertyInfoData.propertyId._id ? propertyInfoData.propertyId._id : propertyInfoData.propertyId,
      propertyTitle: propertyInfoData.propertyId.propertyTitle ? propertyInfoData.propertyId.propertyTitle : propertyInfoData.propertyTitle,
      activeAbout: false,
      activePhotos: false,
      activeLocation: false,
      activeReview: false,
      activeHost: false,
      favouriteProperties: [],
      reviewRatingList: [],
      searchString: '',
      matchesData: false,
      imgsrc: [],
      modalIsOpen: false,
      errorMessage: '',
      autoPlay: true,
      loop: true
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
    this.scrollToMyRef = this.scrollToMyRef.bind(this)
    this.handleDaysAmount = this.handleDaysAmount.bind(this)
    this.handleApiCalls = this.handleApiCalls.bind(this)
    this.setRoomsCount = this.setRoomsCount.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleOnKeyPress = this.handleOnKeyPress.bind(this)

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal () {
    this.setState({ modalIsOpen: true })
  }

  closeModal () {
    this.setState({ modalIsOpen: false })
  }

  componentWillMount () {
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('scroll', this.handleAboutPropertyScroll)
    this.setRoomsCount()
    this.getNumOfDays(this.state.checkInDate, this.state.checkOutDate)
    this.handleDaysAmount(this.state.checkInDate, this.state.checkOutDate)
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.preferences) {
      let favouriteProperties = (authObj && authObj.preferences && authObj.preferences.favouriteProperties) ? authObj.preferences.favouriteProperties : []
      this.setState({ authObj: authObj, favouriteProperties: favouriteProperties })
    }
    let propertyId = this.state.propertyInfoData.propertyId._id ? this.state.propertyInfoData.propertyId._id : this.state.propertyInfoData.propertyId
    let getSPPropertyDocsObj = {
      unBlockStatus: true,
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
      unBlockStatus: true,
      url: config.baseUrl + config.getSPPropertyInfosAPI + propertyId
    }
    APICallManager.getCall(getSPPropertyInfoObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ selectPropertyInfo: resObj.data.statusResult })
      } else {
        _this.setState({ selectPropertyInfo: [] })
      }
    })
    // this.getNumberOfRoomsCount()
    let obj = {}
    obj = {
      unBlockStatus: true,
      url: config.baseUrl + config.getEUReviewRatingsListAPI }
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
    this.getNumberOfRoomsCount()
  }
  getNumberOfRoomsCount (checkInDate, checkOutDate, checkInTime, checkOutTime) {
    let propertyInfoData = JSON.parse(localStorage.getItem('EUPropertyInfoData'))
    let cidt = moment(checkInDate ? checkInDate : this.state.checkInDate).format('YYYY-MM-DD')
    let codt = moment(checkOutDate ? checkOutDate : this.state.checkOutDate).format('YYYY-MM-DD')
    let checkInHours = moment(this.state.checkIntime, ['hh:mm A']).format('HH:mm')
    let checkOutHours = moment(this.state.checkOutTime, ['hh:mm A']).format('HH:mm')
    let body = {
      noOfRooms: this.state.rooms,
      checkInDate: cidt + ' ' + checkInHours,
      checkOutDate: codt + ' ' + checkOutHours,
      spPropertyInfoId: propertyInfoData._id,
      spServiceProviderId: propertyInfoData.spServiceProviderId,
      propertyId: propertyInfoData.propertyId._id ? propertyInfoData.propertyId._id : propertyInfoData.propertyId
    }
    let obj = { url: config.baseUrl + config.postEUBookingRoomsCountAPI, routing: '/hotels', body: body }
    let _this = this
    APICallManager.postCall(obj, function (resObj) {
      if (resObj.data.statusCode === '1017') {
        _this.setState({ BookingBlocked: t`lanEULabelErrorServiceIsNotAvailableOnSelectedDates`, propertyBlocked: true })
      } else if (resObj.data.statusCode === '0000') {
        if (resObj.data.statusResult.bookingCount >= resObj.data.statusResult.activeRoomsCount) {
          _this.setState({ BookingBlocked: t`lanEULabelErrorNoRoomsAreAvailable`, propertyBlocked: true })
        } else {
          _this.setState({ avaliableRoomCount: resObj.data.statusResult.activeRoomsCount - resObj.data.statusResult.bookingCount, propertyBlocked: false, BookingBlocked: '' })
        }
      }
    })
  }

  componentDidMount () {
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false
    if (this.state.propertyDocs.length > 0) {
      window.removeEventListener('scroll', this.handleScroll)
      window.removeEventListener('scroll', this.handleAboutPropertyScroll)
    }
  }
  handleDaysAmount (checkInDate) {
    let propertyInfoData = JSON.parse(localStorage.getItem('EUPropertyInfoData'))
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
  handleScroll (e) {
    const currentScrollPos = window.pageYOffset
    this._isMounted = true
    if (this._isMounted) {
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
  }
  handleAboutPropertyScroll (e) {
    this._isMounted = true
    const currentScrollPos = window.pageYOffset
    if (this._isMounted) {
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
  }
  handleVideoPlay () {
    if (this.state.videoFile) {
      this.setState({ videoPlay: true })
    } else {
      ToastsStore.error(t`lanEULabelErrorSorryNoVideosAreAvailable`)
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
  getNumOfDays = (checkInDate, checkOutDate) => {
    let getNumcheckIn = moment(checkInDate).format('YYYY-MM-DD')
    let getNumcheckOut = moment(checkOutDate).format('YYYY-MM-DD')
    var checkIn = moment.utc(getNumcheckIn)
    var checkOut = moment.utc(getNumcheckOut)
    var duration = moment.duration(checkOut.diff(checkIn))
    var days = duration.asDays()
    this.setState({ totalDays: days === 0 ? 1 : days })
  }
  handleCheckInDate (checkInDate) {
    let checkInDateValue = moment(checkInDate, 'YYYY-DD-MM').valueOf()
    // let checkOutDateValue = moment(this.state.checkOutDate, 'YYYY-DD-MM').valueOf()
    let currentDay = moment().format('YYYY-MM-DD')
    let currentDayValue = moment.utc(currentDay, 'YYYY-MM-DD').valueOf()
    if (checkInDateValue > currentDayValue) {
      this.setState({ checkInDate: new Date(checkInDate), checkOutDate: new Date(moment(checkInDate).add(this.state.totalDays, 'day').format('YYYY-MM-DD')) })
      this.getNumberOfRoomsCount(new Date(checkInDate), new Date(moment(checkInDate).add(this.state.totalDays, 'day').format('YYYY-MM-DD')))
      this.getNumOfDays(checkInDate, new Date(moment(checkInDate).add(this.state.totalDays, 'day').format('YYYY-MM-DD')))
      this.handleDaysAmount(new Date(checkInDate))
    } else {
      this.setState({ checkInDate: new Date(checkInDate) })
      this.getNumberOfRoomsCount(checkInDate, this.state.checkOutDate)
      this.getNumOfDays(checkInDate, this.state.checkOutDate)
      this.handleDaysAmount(new Date(checkInDate))
    }
  }
  handleCheckOutDate (checkOutDate) {
    let checkInDateValue = moment(this.state.checkInDate, 'YYYY-DD-MM').valueOf()
    let checkOutDateValue = moment(checkOutDate, 'YYYY-DD-MM').valueOf()
    if (checkOutDateValue < checkInDateValue) {
      // alert(t`lanEULabelErrorCheckOutDateShouldNotBeLessThanCheckInDate`)
      ToastsStore.error(t`lanEULabelErrorCheckOutDateShouldNotBeLessThanCheckInDate`)
    } else {
      this.setState({ checkOutDate: new Date(checkOutDate) })
      this.getNumberOfRoomsCount(this.state.checkInDate, new Date(checkOutDate))
      this.getNumOfDays(this.state.checkInDate, new Date(checkOutDate))
    }
  }
  getRoomsCount () {
    let cidt = moment(this.state.checkInDate).format('YYYY-MM-DD')
    let codt = moment(this.state.checkOutDate).format('YYYY-MM-DD')
    let checkInHours = moment(this.state.checkIntime, ['hh:mm A']).format('HH:mm')
    let checkOutHours = moment(this.state.checkOutTime, ['hh:mm A']).format('HH:mm')
    let body = {
      noOfRooms: this.state.rooms,
      checkInDate: cidt + ' ' + checkInHours,
      checkOutDate: codt + ' ' + checkOutHours,
      spPropertyInfoId: this.state.propertyInfoData._id,
      spServiceProviderId: this.state.propertyInfoData.spServiceProviderId,
      propertyId: this.state.propertyInfoData.propertyId._id ? this.state.propertyInfoData.propertyId._id : this.state.propertyInfoData.propertyId
    }
    let obj = { url: config.baseUrl + config.postEUBookingRoomsCountAPI, routing: '/hotels', body: body }
    let _this = this
    APICallManager.postCall(obj, function (resObj) {
      if (resObj && resObj.data && resObj.data.statusCode === '1017') {
      } else if (resObj && resObj.data && resObj.data.statusCode === '0000') {
        _this.handleBooking()
      } else {
        // alert(t`lanEULabelErrorSomethingWentWrongPleaseTryAgain`)
        ToastsStore.error(t`lanEULabelErrorSomethingWentWrongPleaseTryAgain`)
      }
    })
  }
  handleBooking () {
    let userLogedIn = JSON.parse(localStorage.getItem('authObj'))
    // let EUBookingType = JSON.parse(localStorage.getItem('EUBookingType'))
    let spData = this.state.propertyInfoData
    let checkInHours = moment(this.state.checkIntime, ['hh:mm A']).format('HH:mm')
    let checkOutHours = moment(this.state.checkOutTime, ['hh:mm A']).format('HH:mm')
    let cidt = moment(this.state.checkInDate).format('YYYY-MM-DD')
    let codt = moment(this.state.checkOutDate).format('YYYY-MM-DD')
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
      bookingType: 'Days',
      roomPrice: this.state.amount,
      noOfAdults: this.state.adults,
      noOfChilds: this.state.childs,
      noOfRooms: this.state.rooms,
      checkInDate: cidt + ' ' + checkInHours,
      checkOutDate: codt + ' ' + checkOutHours,
      totalPrice: (this.state.rooms) * (this.state.totalDays) * (this.state.amount),
      noOfDays: this.state.totalDays,
      dateType: weekEnd
    }
    let checkInDateTime = moment(cidt + ' ' + checkInHours, 'YYYY-MM-DD hh:mm A').valueOf()
    let checkOutDateTime = moment(codt + ' ' + checkOutHours, 'YYYY-MM-DD hh:mm A').valueOf()
    if (checkOutDateTime < checkInDateTime) {
      // alert(t`lanEULabelErrorCheckOutDateAndTimeShouldBeGreaterThanCheckInDateTime`)
      ToastsStore.error(t`lanEULabelErrorCheckOutDateAndTimeShouldBeGreaterThanCheckInDateTime`)
    } else {
      if (userLogedIn === null) {
        localStorage.setItem('postBooking', JSON.stringify(postBooking))
        localStorage.setItem('propertyDocs', JSON.stringify(this.state.propertyDocs))
        this.openModal()
        // hashHistory.push('/login')
      } else {
        localStorage.setItem('postBooking', JSON.stringify(postBooking))
        localStorage.setItem('propertyDocs', JSON.stringify(this.state.propertyDocs))
        this.setState({ confirmBooking: true, postBooking: postBooking })
        hashHistory.push('/hotels/booknow/confirm')
      }
    }
    // event.preventdefault()
  }
  confirmBooking () {
    this.setState({ confirmBooking: false })
  }
  handleUnfavouriteProperty (data) {
    var newAuthObj = this.state.authObj
    let favouriteProperties = this.state.favouriteProperties
    let propertyID = data.propertyId._id ? data.propertyId._id : data.propertyId
    var userData = {
      spPropertyId: propertyID,
      spID: data.spServiceProviderId
    }
    let _this = this
    let obj = { url: config.baseUrl + config.putEUUnfavouritePropertyAPI, body: userData }
    APICallManager.putCall(obj, function (resObj) {
      if (resObj && resObj.data.statusCode === '0000') {
        let index = favouriteProperties.findIndex(x => x === propertyID)
        favouriteProperties.splice(index, 1)
        newAuthObj.preferences.favouriteProperties = favouriteProperties
        localStorage.setItem('authObj', JSON.stringify(newAuthObj))
        _this.setState({ favouriteProperties: favouriteProperties })
      }
    })
  }
  handleFavouriteProperty (data) {
    let authObj = this.state.authObj
    if (!this.state.authObj.name) {
      // alert(t`lanEULabelErrorYouCanFavoritreThisAfterBookingThisProperty`)
      ToastsStore.error(t`lanEULabelErrorYouCanFavoritreThisAfterBookingThisProperty`)
    } else if (authObj && authObj.mobileNumber) {
      let newAuthObj = authObj
      let postJson = {
        customer: authObj.name,
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
      let obj = { url: config.baseUrl + config.postEUFavouritePropertyAPI, routing: '/hotels', body: postJson }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj && resObj.data.statusCode === '0000') {
          _this.setState({ isFavourite: true })
          let favouriteProperties = _this.state.favouriteProperties
          let propertyID = data.propertyId._id ? data.propertyId._id : data.propertyId
          favouriteProperties.push(propertyID)
          newAuthObj.preferences.favouriteProperties = favouriteProperties
          localStorage.setItem('authObj', JSON.stringify(newAuthObj))
          _this.setState({ favouriteProperties: favouriteProperties })
        }
      })
    } else {
      hashHistory.push('/login')
    }
  }
  handlePropertyInfo (data) {
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    homePageData.checkInDate = this.state.checkInDate
    homePageData.checkOutDate = this.state.checkOutDate
    homePageData.child = this.state.childs
    homePageData.guestAdultValue = this.state.adults
    let dt = moment(this.state.checkInDate, 'YYYY-MM-DD HH:mm:ss')
    let dateName = dt.format('dddd')
    let weekEnd = dateName === 'Saturday' || dateName === 'Sunday' ? 'Weekend' : 'Weekday'
    localStorage.setItem('homePageData', JSON.stringify(homePageData))
    localStorage.setItem('EUPropertyInfoData', JSON.stringify(data))
    if (data.pricing.minBasePriceUnit === 'Per Day') {
      this.setState({ propertyInfoData: data,
        amount: weekEnd === 'Weekend' ? data.pricing.weekEndTotalPrice : data.pricing.totalPrice,
        amenities: data.amenities,
        guestRules: data.guestRules,
        services: data.services,
        checkIntime: data.pricing.checkInTime,
        checkOutTime: data.pricing.checkOutTime,
        propertyId: data.propertyId._id
      })
      // this.handleApiCalls()
      this.setRoomsCount()
      this.componentWillMount()
    } else {
      this.props.handlePropertyInfo(data)
    }
  }
  handleApiCalls () {
    let propertyInfoData = JSON.parse(localStorage.getItem('EUPropertyInfoData'))
    let cidt = moment(this.state.checkInDate).format('YYYY-MM-DD')
    let codt = moment(this.state.checkOutDate).format('YYYY-MM-DD')
    let checkInHours = moment(this.state.checkIntime, ['hh:mm A']).format('HH:mm')
    let checkOutHours = moment(this.state.checkOutTime, ['hh:mm A']).format('HH:mm')
    // Start -- API to get room count
    let body = {
      noOfRooms: this.state.rooms,
      checkInDate: cidt + ' ' + checkInHours,
      checkOutDate: codt + ' ' + checkOutHours,
      spPropertyInfoId: propertyInfoData._id,
      spServiceProviderId: propertyInfoData.spServiceProviderId,
      propertyId: propertyInfoData.propertyId._id ? propertyInfoData.propertyId._id : propertyInfoData.propertyId
    }
    let obj = { url: config.baseUrl + config.postEUBookingRoomsCountAPI, routing: '/hotels', body: body }
    let _this = this
    APICallManager.postCall(obj, function (resObj) {
      if (resObj.data.statusCode === '1017') {
        _this.setState({ BookingBlocked: t`lanEULabelErrorServiceIsNotAvailableOnSelectedDates`, propertyBlocked: true })
      } else if (resObj.data.statusCode === '0000') {
        if (resObj.data.statusResult.bookingCount >= resObj.data.statusResult.activeRoomsCount) {
          _this.setState({ BookingBlocked: t`lanEULabelErrorNoRoomsAreAvailable`, propertyBlocked: true })
        } else {
          _this.setState({ avaliableRoomCount: resObj.data.statusResult.activeRoomsCount - resObj.data.statusResult.bookingCount, propertyBlocked: false, BookingBlocked: '' })
        }
      }
    })
    // End -- API to get room count
    // Start -- API to get property docs
    let propertyId = propertyInfoData.propertyId._id ? propertyInfoData.propertyId._id : propertyInfoData.propertyId
    let getSPPropertyDocsObj = {
      unBlockStatus: true,
      url: config.baseUrl + config.getPropertyDocsAPI + propertyId
    }
    APICallManager.getCall(getSPPropertyDocsObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        let videoFile = resObj.data.statusResult.find(data => data.fileType === 'Video')
        _this.setState({
          propertyDocs : resObj.data.statusResult,
          videoFile: videoFile.imagePath
        })
      }
    })
    // End -- API to get property docs
    // Start -- API to get property infos
    let getSPPropertyInfoObj = {
      unBlockStatus: true,
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
    let cc = this.state.propertyInfoData ? parseInt(propertyInfoData.childsCapacity) : 0
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
      unBlockStatus: true,
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
  handleOnKeyPress (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
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
            <Carousel className='mb-7' infiniteLoop useKeyboardArrows dynamicHeight showArrows
              autoPlay={this.state.autoPlay} loop={this.state.loop} onChange={this.onChange} onClickItem={this.onClickItem} onClickThumb={this.onClickThumb}>
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
                                    {this.state.authObj && this.state.authObj.mobileNumber
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
                                <div className='location-sq font-weight-600 '>
                                  <i className='fas fa-map-marker-alt pr-0' />
                                  {this.state.propertyInfoData.spLocationObj.address}
                                </div>
                                <div className='location-sq pt-0 pb-7'>
                                  {this.state.videoFile
                                  ? <a onClick={this.handleVideoPlay} className='text-white' >
                                    <i className='fas fa-video pr-2' />
                                    {t`lanEULabelWatchVideo`}
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
                      <div className='property-sticky-box day-booking'>
                        <div className='price-tag-sq'>
                          <span className='per-sq text-white font-weight-500'> {t`lanEULabelTotalAmount`} </span>
                          <span className='price-sq'> ₹ {(this.state.rooms) * (this.state.totalDays) * (this.state.amount)} /-</span>
                          {/* <span className='per-sq text-white font-weight-500' data-text-mobile='/ ' data-text='Total Days'> {this.state.totalDays} </span> */}
                        </div>
                        <div className='button-sq font-weight-extrabold-sq mobile-fixed-trigger hidden-desktop hidden-large-desktop hidden-tablet modal-trigger'
                          data-trigger-for='menu04' onClick={() => this.setState({ mobileBooknow : !this.state.mobileBooknow })}>{t`lanEULabelInstantBooking`}</div>
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
                                  <label className='placeholder'>{t`lanEULabelAdults`}</label>
                                  <a onClick={() => this.setState({ guestDropdownActive:true })} >
                                    <div className='relative guests-Adults-dropdown'>
                                      <label>{this.state.adults}</label>
                                    </div>
                                  </a>
                                </div>
                                <div className='check-out calendar-sq' id='sticky-box-rangeend'>
                                  <label className='placeholder'>{t`lanEULabelChilds`}</label>
                                  <a onClick={() => this.setState({ guestDropdownActive:true })} >
                                    <div className='childs-Adults-dropdown'>
                                      <label>{this.state.childs}</label>
                                    </div>
                                  </a>
                                </div>
                                <div className='days' style={{ top: 0 }} >
                                  <label className='placeholder' >{t`lanEULabelRooms`}</label>
                                  <a onClick={() => this.setState({ guestDropdownActive:true })} >
                                    <div className='rooms-Adults-dropdown'>
                                      <label>{this.state.rooms}</label>
                                    </div>
                                  </a>
                                </div>
                              </div>
                              <div className='main-infos inline-check-in mt-2'>
                                <div className='check-in calendar-sq' id='sticky-box-rangestart'>
                                  <label className='placeholder' >{t`lanEULabelCheckIn`}</label>
                                  <div className='relative'>
                                    <DatePicker
                                      onKeyDown={e => e.preventDefault()}
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
                                  <label className='placeholder' >{t`lanEULabelCheckOut`}</label>
                                  <DatePicker
                                    onKeyDown={e => e.preventDefault()}
                                    dateFormat='MMM dd, yyyy'
                                    selected={this.state.checkOutDate}
                                    minDate={addDays(this.state.checkInDate, 1)}
                                    maxDate={addDays(new Date(), this.state.maxDate)}
                                    onChange={(checkOutDate) => this.handleCheckOutDate(checkOutDate)}
                                  />
                                </div>
                                <div className='guests'>
                                  <label className='placeholder pr-2'>{t`lanEULabelDays`}</label>
                                  <input type='text' value={this.state.totalDays} className='days-cal' readOnly />
                                </div>
                              </div>
                              {/* <div className='main-infos inline-check-in mt-2'>
                                <div className='check-in calendar-sq' id='sticky-box-rangestart'>
                                  <label className='placeholder' data-placeholder={t`lanEULabelCheckIn`} />
                                  <div className='relative time-picker'>
                                    <TimePicker
                                      showSecond={false}
                                      value={moment(this.state.checkIntime, format)}
                                      className='xxx'
                                      onChange={(checkInTime) => this.onCheckInTimeChange(checkInTime)}
                                      minuteStep={15}
                                      format={format}
                                      use12Hours
                                      disabled
                                      inputReadOnly
                                    />
                                    <i className='fas fa-long-arrow-alt-right' style={{ right: 10 }} />
                                  </div>
                                </div>
                                <div className='check-out-time calendar-sq' id='sticky-box-rangeend'>
                                  <label className='placeholder' data-placeholder={t`lanEULabelCheckOut`} />
                                  <TimePicker
                                    showSecond={false}
                                    value={moment(this.state.checkOutTime, format)}
                                    className='xxx'
                                    disabled
                                    format={format}
                                    use12Hours
                                    inputReadOnly
                                  />
                                </div>
                              </div> */}

                              {this.state.guestDropdownActive === true
                              ? <div className=' book-now overlay-guest-dropdown'>
                                <div className='guest-dropdown-div'>
                                  <div className='card-body'>
                                    <div className='row mb-2'>
                                      <div className='col-sm-3 py-2'>{t`lanEULabelAdults`}</div>
                                      <div className='col-sm-3'>
                                        <button type='button' className={classnames('circle-class', { 'circle-class-disable': this.state.adults <= 1 })} disabled={this.state.adults <= 1}
                                          onClick={() => this.handleAdultsDecrease(this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)} >
                                          <i className='fas fa-minus mr-0' style={this.state.adults <= 1 ? { color: '#ddd' } : { color: 'black' }} />
                                        </button>
                                      </div>
                                      <div className='col-sm-3  py-2 text-center '><strong> {this.state.adults} </strong></div>
                                      <div className='col-sm-3'>
                                        <button type='button'
                                          className={classnames('circle-class', { 'circle-class-disable': parseInt(this.state.adults) > ((this.state.avaliableRoomCount) * (this.state.propertyInfoData.membersCapacity) - 1) ||
                                          (parseInt(this.state.adults) + parseInt(this.state.childs) >
                                          ((this.state.avaliableRoomCount) * (parseInt(this.state.propertyInfoData.membersCapacity) + parseInt(this.state.propertyInfoData.childsCapacity)) - 1)) })}

                                          disabled={parseInt(this.state.adults) > ((this.state.avaliableRoomCount) * (this.state.propertyInfoData.membersCapacity) - 1) ||
                                          (parseInt(this.state.adults) + parseInt(this.state.childs) >
                                          ((this.state.avaliableRoomCount) * (parseInt(this.state.propertyInfoData.membersCapacity) + parseInt(this.state.propertyInfoData.childsCapacity)) - 1))}

                                          onClick={() => this.handleAdultsIncrease(this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)} >

                                          <i className='fas fa-plus mr-0' style={parseInt(this.state.adults) > ((this.state.avaliableRoomCount) * (this.state.propertyInfoData.membersCapacity) - 1) ||
                                          (parseInt(this.state.adults) + parseInt(this.state.childs) >
                                          ((this.state.avaliableRoomCount) * (parseInt(this.state.propertyInfoData.membersCapacity) + parseInt(this.state.propertyInfoData.childsCapacity)) - 1)) ? { color: '#ddd' } : { color: 'black' }} />

                                        </button>
                                      </div>
                                    </div>
                                    <div className='row mb-2'>
                                      <div className='col-sm-3 py-2'>{t`lanEULabelChilds`}</div>
                                      <div className='col-sm-3'>
                                        <button type='button' className={classnames('circle-class', { 'circle-class-disable': this.state.childs <= 0 })} disabled={this.state.childs <= 0}
                                          onClick={() => this.handleChildsDecrease(this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)} >
                                          <i className='fas fa-minus mr-0' style={this.state.childs <= 0 ? { color: '#ddd' } : { color: 'black' }} />
                                        </button>
                                      </div>
                                      <div className='col-sm-3  py-2 text-center '><strong> {this.state.childs} </strong></div>
                                      <div className='col-sm-3'>
                                        <button type='button'
                                          className={classnames('circle-class', { 'circle-class-disable': (parseInt(this.state.childs) > (this.state.avaliableRoomCount) * (this.state.propertyInfoData.childsCapacity) - 1) &&
                                          (parseInt(this.state.adults) > (this.state.avaliableRoomCount) * (this.state.propertyInfoData.membersCapacity) - 1) ||
                                          (parseInt(this.state.adults) + parseInt(this.state.childs) >
                                          ((this.state.avaliableRoomCount) * (parseInt(this.state.propertyInfoData.membersCapacity) + parseInt(this.state.propertyInfoData.childsCapacity)) - 1)) })}

                                          disabled={(parseInt(this.state.childs) > (this.state.avaliableRoomCount) * (this.state.propertyInfoData.childsCapacity) - 1) &&
                                          (parseInt(this.state.adults) > (this.state.avaliableRoomCount) * (this.state.propertyInfoData.membersCapacity) - 1) ||
                                          (parseInt(this.state.adults) + parseInt(this.state.childs) >
                                          ((this.state.avaliableRoomCount) * (parseInt(this.state.propertyInfoData.membersCapacity) + parseInt(this.state.propertyInfoData.childsCapacity)) - 1))}

                                          onClick={() => this.handleChildsIncrease(this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)} >
                                          <i className='fas fa-plus mr-0' style={(parseInt(this.state.childs) > (this.state.avaliableRoomCount) * (this.state.propertyInfoData.childsCapacity) - 1) &&
                                          (parseInt(this.state.adults) > (this.state.avaliableRoomCount) * (this.state.propertyInfoData.membersCapacity) - 1) ||
                                          (parseInt(this.state.adults) + parseInt(this.state.childs) >
                                          ((this.state.avaliableRoomCount) * (parseInt(this.state.propertyInfoData.membersCapacity) + parseInt(this.state.propertyInfoData.childsCapacity)) - 1)) ? { color: '#ddd' } : { color: 'black' }} />
                                        </button>
                                      </div>
                                    </div>
                                    <div className='row mb-2'>
                                      <div className='col-sm-3 py-2'>{t`lanEULabelRooms`}</div>
                                      <div className='col-sm-3'>
                                        <button type='button' className={classnames('circle-class', { 'circle-class-disable': this.state.rooms <= 1 })} disabled={this.state.rooms <= 1}
                                          onClick={() => this.handleRooms('sub', this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)} >
                                          <i className='fas fa-minus mr-0' style={this.state.rooms <= 1 ? { color: '#ddd' } : { color: 'black' }} />
                                        </button>
                                      </div>
                                      <div className='col-sm-3  py-2 text-center '><strong> {this.state.rooms} </strong></div>
                                      <div className='col-sm-3'>
                                        <button type='button' className={classnames('circle-class', { 'circle-class-disable': this.state.avaliableRoomCount <= this.state.rooms })} disabled={this.state.avaliableRoomCount <= this.state.rooms}
                                          onClick={() => this.handleRooms('add', this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)} >
                                          <i className='fas fa-plus mr-0' style={this.state.avaliableRoomCount <= this.state.rooms ? { color: '#eee' } : { color: 'black' }} />
                                        </button>
                                      </div>
                                    </div>
                                    {(this.state.adults) > ((this.state.avaliableRoomCount) * (this.state.propertyInfoData.membersCapacity) - 1) || ((this.state.adults) + (this.state.childs) > ((this.state.avaliableRoomCount) * (parseInt(this.state.propertyInfoData.membersCapacity) + parseInt(this.state.propertyInfoData.childsCapacity)) - 1))
                                      ? <label className='error'>{t`lanEULabelErrorReachedMaximumLimitOfAdults`}</label>
                                      : ((this.state.childs) > (this.state.avaliableRoomCount) * (this.state.propertyInfoData.childsCapacity) - 1) && ((this.state.adults) > (this.state.avaliableRoomCount) * (this.state.propertyInfoData.membersCapacity) - 1) || ((this.state.adults) + (this.state.childs) > ((this.state.avaliableRoomCount) * (parseInt(this.state.propertyInfoData.membersCapacity) + parseInt(this.state.propertyInfoData.childsCapacity)) - 1))
                                        ? <label className='error' >{t`lanEULabelErrorReachedMaximumLimitOfChilds`}</label>
                                        : this.state.avaliableRoomCount <= this.state.rooms
                                        ? <label className='error'>{t`lanEULabelErrorReachedMaximumLimitOfRooms`}</label>
                                      : null
                                      }
                                    <div className='row mt-3'>
                                      <div className='col-sm-6 text-right'>
                                        <button type='button' className='btn btn-danger' onClick={() => this.setState({ guestDropdownActive:false })} > {t`lanEUButtonClose`}</button>
                                      </div>
                                      <div className='col-sm-6 text-left'>
                                        <button type='button' className='btn btn-primary' onClick={() => this.setState({ guestDropdownActive:false })} > {t`lanEUButtonApply`}</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              : null }
                              <div className='calculations mt-1'>
                                <div className='calc-row'>
                                  <div className='calc-column'>
                                    <p className='desc mb-0'>{t`lanEULabelCheckIn`}</p>
                                  </div>
                                  <div className='calc-column'>
                                    <p className='price-sq mb-0'>{moment(this.state.checkIntime, 'hh:mm A').format('hh:mm A')}</p>
                                  </div>
                                </div>
                                <div className='calc-row'>
                                  <div className='calc-column'>
                                    <p className='desc mb-0'>{t`lanEULabelCheckOut`}</p>
                                  </div>
                                  <div className='calc-column'>
                                    <p className='price-sq mb-0'>{moment(this.state.checkOutTime, 'hh:mm A').format('hh:mm A')}</p>
                                  </div>
                                </div>
                                <div className='calc-row'>
                                  <div className='calc-column'>
                                    <p className='desc mb-0'>{t`lanCommonLabelBookingAmount`}</p>
                                  </div>
                                  <div className='calc-column'>
                                    <p className='price-sq mb-0'>₹ {this.state.amount} / {t`lanEULabelDay`}</p>
                                  </div>
                                </div>
                                <div className='calc-row'>
                                  <div className='calc-column'>
                                    <p className='desc mb-0'>{t`lanEULabelNoOfDays`}</p>
                                  </div>
                                  <div className='calc-column'>
                                    <p className='price-sq mb-0'> {this.state.totalDays}</p>
                                  </div>
                                </div>
                                <div className='calc-row'>
                                  <div className='calc-column'>
                                    <p className='desc mb-0'>{t`lanEULabelTotal`}</p>
                                  </div>
                                  <div className='calc-column mb-2'>
                                    <p className='price-sq my-1'>₹ {(this.state.rooms) * (this.state.totalDays) * (this.state.amount)}</p>
                                    {/* <p className='price-sq mt-1' style={{ color: '#aba7a7' }}> {(this.state.rooms)} * {(this.state.totalDays)} * {(this.state.amount)}</p> */}
                                  </div>
                                </div>
                              </div>
                              <button type='button' disabled={this.state.propertyBlocked || this.state.rooms > this.state.avaliableRoomCount} onClick={() => this.getRoomsCount()}
                                className={classnames('button-sq fullwidth-sq font-weight-extrabold-sq', { 'disabled': this.state.propertyBlocked || this.state.rooms > this.state.avaliableRoomCount })}>{t`lanEUButtonBookNow`}</button>
                              { this.state.propertyBlocked ? null : <p style={{ fontSize: 12 }} className='desc mb-0 text-success font-weight-600 py-2 text-center'>{t`lanEULabelHurryUpOnly`} {this.state.avaliableRoomCount} {t`lanEULabelRoomsLeft`}</p> }
                              {/* { this.state.propertyBlocked ? null : <p className='desc mb-0 text-success'>{`Hurry up!!! Only ${this.state.avaliableRoomCount} Rooms Left`}</p> } */}
                              <p className='desc mb-0 text-danger font-weight-600 py-2 text-center' style={{ fontSize: 12 }}>{this.state.BookingBlocked}</p>
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
                    <ul className='nav nav-pills px-4'>
                      <li className='nav-item'>
                        <a className={classnames('nav-link', { 'activeStyle': this.state.activeAbout })} onClick={this.scrollToAboutRef} >{t`lanEULabelAboutProperty`}</a>
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
                              <h3>{t`lanEULabelAboutThisProperty`}</h3>
                              <h5>{t`lanCommonLabelDescription`}</h5>
                              <p>{this.state.propertyInfoData.propertyId.aboutProperty}</p>
                            </div>
                            <div className='typo-section-sq pb-2 bottom-default'>
                              <h5>{this.state.propertyInfoData.spServiceProvider}</h5>
                              <div className='ui grid moved ml-0'>
                                <div className='twelve wide mobile six wide tablet six wide computer column pl-0'>
                                  <ul className='description-list'>
                                    <li>
                                      <i className='fas fa-users' />
                                      <div>
                                        <p>{t`lanEULabelGuests`}:</p>
                                        <strong>{this.state.propertyInfoData.membersCapacity} {t`lanEULabelAdults`}, {this.state.propertyInfoData.childsCapacity} {t`lanEULabelChilds`}</strong>
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
                                <div className='twelve wide mobile six wide tablet six wide computer column pl-0'>
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
                                        <strong>{this.state.propertyInfoData.pricing.checkInTime}</strong> / <strong>{this.state.propertyInfoData.pricing.checkOutTime}</strong>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            {/* {this.state.selectPropertyInfo.length > 1
                          ? <div className='typo-section-sq bottom-default'>
                            <h5>{t`lanEULabelPropertyInfos`}</h5>
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
                                            <div className='col- text-left'> <p>{t`lanEULabelPerDayPrice`} :</p> </div>
                                            <div className='col- text-right'><strong>{data.pricing.totalPrice}</strong></div>
                                          </div>
                                        </li>
                                        <li>
                                          <div className='row row-data-style '>
                                            <div className='col- text-left'> <p>{t`lanEULabelMembersCapacity`} :</p> </div>
                                            <div className='col- text-right'><strong>{data.membersCapacity}</strong></div>
                                          </div>
                                        </li>
                                        <li>
                                          <div className='row row-data-style '>
                                            <div className='col- text-left'> <p>{t`lanEULabelSingleBedsCount`} :</p> </div>
                                            <div className='col- text-right'><strong>{data.singleBedsCount}</strong></div>
                                          </div>
                                        </li>
                                        <li>
                                          <div className='row row-data-style '>
                                            <div className='col- text-left'> <p>{t`lanEULabelDoubleBedsCount`} :</p> </div>
                                            <div className='col- text-right'><strong>{data.doubleBedsCount}</strong></div>
                                          </div>
                                        </li>
                                        <li>
                                          <div className='row row-data-style '>
                                            <div className='col- text-left'> <p>{t`lanEULabelShower`} :</p> </div>
                                            <div className='col- text-right'><strong>{data.privateBathRooms}</strong></div>
                                          </div>
                                        </li>
                                      </div>)}
                                  </div>
                                </ul>
                              </div>
                            </div>
                          </div> : null } */}
                            <div className='typo-section-sq pb-2 bottom-default'>
                              <h5>{t`lanEULabelTheSpace`}</h5>
                              <div className='ui grid moved ml-0'>
                                <div className='twelve wide column pl-0'>
                                  <ul className='description-list'>
                                    <li>
                                      <div>
                                        <p>{t`lanEULabelFullRefundCancelTime`}</p>
                                        <strong>{this.state.propertyInfoData.pricing.fullRefundCancelTime} {t`lanEULabelHours`}</strong>
                                      </div>
                                    </li>
                                    <li>
                                      <div>
                                        <p>{t`lanEULabelRefundCancelTime`}</p>
                                        <strong>{this.state.propertyInfoData.pricing.refundCancelTime} {t`lanEULabelHours`}</strong>
                                      </div>
                                    </li>
                                    <li>
                                      <div>
                                        <p>{t`lanEULabelRefundCancelPercentage`}</p>
                                        <strong>{this.state.propertyInfoData.pricing.refundCancelPercentage} %</strong>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className='typo-section-sq pb-2 bottom-default '>
                              <h5>{t`lanEULabelAmenities`}</h5>
                              <div className='ui grid moved ml-0'>
                                <div className='ui column pl-0'>
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
                              <div className='ui grid moved ml-0'>
                                <div className='ui column pl-0'>
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
                              <div className='ui grid moved ml-0'>
                                <div className='ui column pl-0'>
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
                              <h3>{t`lanEUTitleReviews`}</h3>
                              <div className='reviews-search'>
                                <form className=''>
                                  <input id='reviews-search' type='text' placeholder={t`lanEULabelSearchReviews`} value={this.state.searchString} onKeyPress={this.handleOnKeyPress} onChange={this.handleInputChange} />
                                  <label><i className='fas fa-search' style={{ color: '#747a80' }} /></label>
                                </form>
                              </div>
                              <div className='col-sm-12'>
                                {this.state.reviewRatingList.length > 0
                                ? this.state.reviewRatingList.map((item, i) =>
                                  <div className='reviews-row' key={i} >
                                    <div className='review-meta'>
                                      <a className='avatar-sq verified-sq' >
                                        <img src={this.state.imgsrc.length ? this.state.imgsrc : (item.euUserId.userIconPath
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
          <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
          <Modal isOpen={this.state.modalIsOpen} ariaHideApp={false} style={customStyles}>
            <div className='container text-center'>
              <div className='row'>
                <div className='col-sm-12'>
                  <div className='card'>
                    <div className='card-body'>
                      <p className='p-modal-text' >{t`lanEULabelAreYouSureWantTo`}
                        <strong style={{ color:'#3aa3a2' }}>{t`lanEUButtonLogin`}</strong> <small>{t`lanEULabelOr`}</small> <strong style={{ color:'#3aa3a2' }}>{t`lanEUButtonSignup`}</strong> </p>
                    </div>
                    <div className='card-footer'>
                      <div className='row justify-content-center'>
                        <button className='btn btn-primary mr-3 px-4' onClick={() => hashHistory.push('/login')}>{t`lanEUButtonOk`}</button>
                        <button className='btn btn-danger' onClick={this.closeModal}>{t`lanCommonButtonCancel`}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </main>
      </div>
    )
  }
}
EUDaysHotelBooking.propTypes = {
  google: PropTypes.any,
  handlePropertyInfo: PropTypes.func
}
export default GoogleApiWrapper({
  apiKey: (config.googleMapsAPIKey)
})(EUDaysHotelBooking)

