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
import TimePicker from 'rc-time-picker'
import 'rc-time-picker/assets/index.css'
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
import EUConfirmBooking from '../BookingHistory/ConfirmBooking'
import Amenities from '../../../../assets/amenities/amenities.json'
import GuestRules from '../../../../assets/guestrules/guestRules.json'
import Services from '../../../../assets/services/services.json'
import PropTypes from 'prop-types'

const format = 'hh:mm A'

class HotelBookNowPage extends React.Component {
  constructor () {
    super()
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    let propertyInfoData = JSON.parse(localStorage.getItem('EUPropertyInfoData'))
    let currMin = moment().add(30, 'm').format('mm')
    let meridiem = moment().add(30, 'm').format('A')
    let min = Math.round(currMin / 15) * 15
    let minutes = min && min !== 60 ? min.toString() : '00'
    let hours = min && min !== 60 ? moment().add(30, 'm').format('hh').toString() : moment().add(1, 'h').format('hh').toString()
    let chekinTime = hours + ':' + minutes + ' ' + meridiem

    let chekinDate = moment().format('YYYY-MM-DD')

    let chekinDateTime = moment(chekinDate + ' ' + hours + ':' + minutes + ' ' + meridiem, 'YYYY-MM-DD hh:mm A')
    let checkOutMin = moment(chekinDateTime).add(22, 'h').format('mm')
    let checkOutMeridiem = moment(chekinDateTime).add(22, 'h').format('A')
    let checkOutMinRound = Math.round(checkOutMin / 15) * 15
    let checkOutMinutes = checkOutMinRound ? checkOutMinRound.toString() : '00'
    let checkOutHours = moment(chekinDateTime).add(22, 'h').format('hh').toString()
    let chekOutTime = checkOutHours + ':' + checkOutMinutes + ' ' + checkOutMeridiem

    const defaultcheckInDate = moment().format('YYYY-MM-DD')
    const defaultChckInTime = moment(defaultcheckInDate + ' ' + propertyInfoData.pricing.checkInTime, 'YYYY-MM-DD hh:mm A').valueOf()
    const defaultCurrTime = moment(defaultcheckInDate + ' ' + chekinTime, 'YYYY-MM-DD hh:mm A').valueOf()

    var currentDate = moment.utc(moment().format('YYYY-MM-DD'))
    var checkOut = moment.utc(moment().add(3, 'month').endOf('month').format('YYYY-MM-DD'))
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
      propertyInfoData: JSON.parse(localStorage.getItem('EUPropertyInfoData')),
      authObj: JSON.parse(localStorage.getItem('authObj')),
      checkInDate: new Date(moment().format('YYYY-MM-DD')),
      checkOutDate: new Date(moment().add(1, 'day').format('YYYY-MM-DD')),
      checkIntime: propertyInfoData.pricing.checkInCredentials === 'Specific Time' ? propertyInfoData.pricing.checkInTime : defaultChckInTime < defaultCurrTime ? chekinTime : propertyInfoData.pricing.checkInTime,
      checkOutTime: propertyInfoData.pricing.checkInCredentials === 'Specific Time' ? propertyInfoData.pricing.checkOutTime : defaultChckInTime < defaultCurrTime ? chekOutTime : propertyInfoData.pricing.checkOutTime,
      bookingType: 'Base Price',
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
      isFavourite: true,
      sliderImages:[
          { maximg:require('../../../../assets/hero_big_32.jpg') },
          { maximg:require('../../../../assets/hero_big_31.jpg') },
          { maximg:require('../../../../assets/hero_big_30.jpg') },
          { maximg:require('../../../../assets/hero_big_29.jpg') },
          { maximg:require('../../../../assets/hero_big_28.jpg') },
          { maximg:require('../../../../assets/rm6.jpg') },
          { maximg:require('../../../../assets/property_big_01.jpg') },
          { maximg:require('../../../../assets/hero_big_32.jpg') },
          { maximg:require('../../../../assets/hero_big_31.jpg') },
          { maximg:require('../../../../assets/hero_big_30.jpg') },
          { maximg:require('../../../../assets/hero_big_29.jpg') },
          { maximg:require('../../../../assets/hero_big_28.jpg') },
          { maximg:require('../../../../assets/rm6.jpg') },
          { maximg:require('../../../../assets/property_big_01.jpg') },
          { maximg:require('../../../../assets/hero_big_32.jpg') },
          { maximg:require('../../../../assets/hero_big_31.jpg') },
          { maximg:require('../../../../assets/hero_big_30.jpg') },
          { maximg:require('../../../../assets/hero_big_29.jpg') },
          { maximg:require('../../../../assets/hero_big_28.jpg') },
          { maximg:require('../../../../assets/rm6.jpg') },
          { maximg:require('../../../../assets/property_big_01.jpg') }
      ],
      videoPlay: false,
      startDate: new Date(),
      moreActive: false,
      guestDropdownActive: false,
      videoFile: '',
      maxDate: days,
      avaliableRoomCount: 0,
      BookingBlocked: '',
      propertyBlocked: false,
      confirmBooking: false,
      compareCheckIntime: propertyInfoData.pricing.checkInCredentials === 'Specific Time' ? propertyInfoData.pricing.checkInTime
      : defaultChckInTime < defaultCurrTime ? chekinTime : propertyInfoData.pricing.checkInTime,
      compareCheckOutTime: propertyInfoData.pricing.checkInCredentials === 'Specific Time' ? propertyInfoData.pricing.checkOutTime
      : defaultChckInTime < defaultCurrTime ? chekOutTime : propertyInfoData.pricing.checkOutTime,
      compareCheckInDate: moment().format('YYYY-MM-DD'),
      propertyId: propertyInfoData.propertyId._id ? propertyInfoData.propertyId._id : propertyInfoData.propertyId,
      propertyTitle: propertyInfoData.propertyId.propertyTitle ? propertyInfoData.propertyId.propertyTitle : propertyInfoData.propertyTitle
    }
    this.handleScroll = this.handleScroll.bind(this)
    this.handleAboutPropertyScroll = this.handleAboutPropertyScroll.bind(this)
    this.handleActiveAbout = this.handleActiveAbout.bind(this)
    this.handleActivePhotos = this.handleActivePhotos.bind(this)
    this.handleActiveLocation = this.handleActiveLocation.bind(this)
    this.handleActiveReview = this.handleActiveReview.bind(this)
    this.handleActiveHost = this.handleActiveHost.bind(this)
    this.handleVideoPlay = this.handleVideoPlay.bind(this)
    this.handleVideoClose = this.handleVideoClose.bind(this)
    this.handleViewgalleryPage = this.handleViewgalleryPage.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.onTimeChange = this.onTimeChange.bind(this)
    this.handleTriggerMore = this.handleTriggerMore.bind(this)
    this.handleTriggerLess = this.handleTriggerLess.bind(this)
    this.handleGuestsDropdown = this.handleGuestsDropdown.bind(this)
    this.handleApply = this.handleApply.bind(this)

    this.handleAdultsIncrease = this.handleAdultsIncrease.bind(this)
    this.handleAdultsDecrease = this.handleAdultsDecrease.bind(this)
    this.handleChildsIncrease = this.handleChildsIncrease.bind(this)
    this.handleChildsDecrease = this.handleChildsDecrease.bind(this)
    this.handleRooms = this.handleRooms.bind(this)
    this.handleCheckInDate = this.handleCheckInDate.bind(this)
    this.handleCheckOutDate = this.handleCheckOutDate.bind(this)
    this.getNumOfDays = this.getNumOfDays.bind(this)
    this.handleBookingtype = this.handleBookingtype.bind(this)
    this.onCheckInTimeChange = this.onCheckInTimeChange.bind(this)
    this.handleBooking = this.handleBooking.bind(this)
    this.confirmBooking = this.confirmBooking.bind(this)
    this.handleUnfavouriteProperty = this.handleUnfavouriteProperty.bind(this)
    this.handleFavouriteProperty = this.handleFavouriteProperty.bind(this)
    this.getRoomsCount = this.getRoomsCount.bind(this)
    this.handlePropertyInfo = this.handlePropertyInfo.bind(this)
    this.reloadFunction = this.reloadFunction.bind(this)
  }
  componentWillMount () {
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('scroll', this.handleAboutPropertyScroll)
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    let currentDate = moment().format('YYYY-MM-DD').valueOf()
    if (homePageData) {
      let userCheckInDate = moment(new Date(homePageData.checkInDate)).format('YYYY-MM-DD').valueOf()
      this.setState({ checkInDate: new Date(homePageData.checkInDate), checkOutDate: new Date(homePageData.checkOutDate) })
      if (userCheckInDate > currentDate) {
        this.setState({ checkIntime: this.state.propertyInfoData.pricing.checkInTime, checkOutTime: this.state.propertyInfoData.pricing.checkOutTime })
      }
      if (homePageData.guestAdultValue > 1 && homePageData.child === 0) {
        let addValue = (homePageData.guestAdultValue ? homePageData.guestAdultValue : 2) + (homePageData.child ? homePageData.child : 0)
        let numOfAdults = (homePageData.guestAdultValue ? homePageData.guestAdultValue : 2)
        let totalCapacity = parseInt(this.state.propertyInfoData.membersCapacity) + parseInt(this.state.propertyInfoData.childsCapacity)
        let RoomCount = (numOfAdults / parseInt(this.state.propertyInfoData.membersCapacity))
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
      } else {
        let numOfPeople = homePageData.guestAdultValue ? homePageData.guestAdultValue : 2 + homePageData.child ? homePageData.child : 0
        let totalCapacity = parseInt(this.state.propertyInfoData.membersCapacity) + parseInt(this.state.propertyInfoData.childsCapacity)
        let TotalRoomCount = (numOfPeople / totalCapacity)
        let totalIndex = TotalRoomCount % 1
        let totalRoomsCount = (totalIndex === 0) ? TotalRoomCount : parseInt(TotalRoomCount.toString().split('.')[0]) + 1
        this.setState({ rooms: totalRoomsCount })
      }
      this.getNumOfDays(new Date(homePageData.checkInDate), new Date(homePageData.checkOutDate))
    }
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.preferences) {
      let favouriteProperties = (authObj && authObj.preferences && authObj.preferences.favouriteProperties) ? authObj.preferences.favouriteProperties : []
      this.setState({ authObj: authObj, favouriteProperties: favouriteProperties })
    }
    let propertyId = this.state.propertyInfoData.propertyId._id ? this.state.propertyInfoData.propertyId._id : this.state.propertyInfoData.propertyId
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
    this.getNumberOfRoomsCount()
  }
  getNumberOfRoomsCount (checkInDate, checkOutDate, checkInTime, checkOutTime) {
    let cidt = moment(checkInDate ? checkInDate : this.state.checkInDate).format('YYYY-MM-DD')
    let codt = moment(checkOutDate ? checkOutDate : this.state.checkOutDate).format('YYYY-MM-DD')
    let checkInHours = moment(checkInTime ? checkInTime : this.state.checkIntime, ['hh:mm A']).format('HH:mm')
    let checkOutHours = moment(checkOutTime ? checkOutTime : this.state.checkOutTime, ['hh:mm A']).format('HH:mm')
    let body = {
      noOfRooms: this.state.rooms,
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
    // If this component is unmounted, stop listening
    if (this.state.propertyDocs.length > 0) {
      window.removeEventListener('scroll', this.handleScroll)
      window.addEventListener('scroll', this.handleAboutPropertyScroll)
    }
  }
  handleScroll (e) {
    // const { prevScrollpos } = this.state
    const currentScrollPos = window.pageYOffset
    // const visible = prevScrollpos > currentScrollPos
    if (currentScrollPos > 270) {
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
    // const { prevScrollposition } = this.state
    const currentScrollPos = window.pageYOffset
    // const visible = prevScrollposition > currentScrollPos
    if (currentScrollPos > 750) {
      this.setState({
        prevScrollposition: currentScrollPos,
        aboutVisible: true
      })
    } else if (currentScrollPos < 750) {
      this.setState({
        aboutVisible: false
      })
    }
  }
  handleActiveAbout () {
    this.setState({
      activeAbout: true, activePhotos: false, activeLocation: false, activeReview: false, activeHost: false
    })
  }
  handleActivePhotos () {
    this.setState({
      activePhotos: true, activeLocation: false, activeReview: false, activeHost: false, activeAbout: false
    })
  }
  handleActiveLocation () {
    this.setState({
      activeLocation: true, activeReview: false, activeHost: false, activeAbout: false, activePhotos: false
    })
  }
  handleActiveReview () {
    this.setState({
      activeReview: true, activeHost: false, activeAbout: false, activePhotos: false, activeLocation: false
    })
  }
  handleActiveHost () {
    this.setState({
      activeHost: true, activePhotos: false, activeLocation: false, activeReview: false, activeAbout: false
    })
  }
  handleVideoPlay () {
    if (this.state.videoFile) {
      this.setState({ videoPlay: true })
    } else {
      alert('Sorry no videos are avaliable')
    }
  }
  handleVideoClose () {
    this.setState({
      videoPlay: false
    })
  }
  handleViewgalleryPage (e) {
    hashHistory.push('/gallery')
    e.preventDefault()
  }
  handleDateChange (date) {
    this.setState({
      startDate: date
    })
  }
  onTimeChange (value) {
  }
  handleTriggerMore (e) {
    this.setState({
      moreActive: true
    })
  }
  handleTriggerLess () {
    this.setState({
      moreActive: false
    })
  }
  handleGuestsDropdown () {
    this.setState({
      guestDropdownActive:true
    })
  }
  handleApply () {
    this.setState({
      guestDropdownActive:false
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
    event.preventdefault()
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
    event.preventdefault()
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
    event.preventdefault()
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
    event.preventdefault()
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
    var checkIn = moment.utc(getNumcheckIn)
    var checkOut = moment.utc(getNumcheckOut)
    var duration = moment.duration(checkOut.diff(checkIn))
    var days = duration.asDays()
    this.setState({ totalDays: days === 0 ? 1 : days })
  }
  handleCheckInDate (checkInDate) {
    let checkInDateValue = moment(checkInDate, 'YYYY-DD-MM').valueOf()
    let checkOutDateValue = moment(this.state.checkOutDate, 'YYYY-DD-MM').valueOf()
    let currentDay = moment().format('YYYY-MM-DD')
    let currentDayValue = moment.utc(currentDay, 'YYYY-MM-DD').valueOf()
    if (checkInDateValue > currentDayValue) {
      this.setState({ checkInDate: new Date(checkInDate),
        checkOutDate: new Date(moment(checkInDate).add(this.state.totalDays, 'day').format('YYYY-MM-DD')),
        checkIntime: this.state.propertyInfoData.pricing.checkInTime,
        checkOutTime: this.state.propertyInfoData.pricing.checkOutTime })
      this.getNumberOfRoomsCount(new Date(checkInDate),
                                 new Date(moment(checkInDate).add(this.state.totalDays, 'day').format('YYYY-MM-DD')),
                                 this.state.propertyInfoData.pricing.checkInTime,
                                 this.state.propertyInfoData.pricing.checkOutTime)
      this.getNumOfDays(checkInDate, new Date(moment(checkInDate).add(this.state.totalDays, 'day').format('YYYY-MM-DD')))
    } else if (currentDayValue === moment.utc(currentDay, 'YYYY-MM-DD').valueOf()) {
      this.setState({ checkInDate: new Date(checkInDate),
        checkOutDate: new Date(moment(checkInDate).add(this.state.totalDays, 'day').format('YYYY-MM-DD')),
        checkIntime: this.state.compareCheckIntime,
        checkOutTime: this.state.compareCheckOutTime
      })
      this.getNumberOfRoomsCount(new Date(checkInDate), new Date(moment(checkInDate).add(this.state.totalDays, 'day').format('YYYY-MM-DD')), this.state.compareCheckIntime, this.state.compareCheckOutTime)
      this.getNumOfDays(checkInDate, new Date(moment(checkInDate).add(this.state.totalDays, 'day').format('YYYY-MM-DD')))
    } else if (checkInDateValue > checkOutDateValue) {
      this.setState({ checkInDate: new Date(checkInDate), checkOutDate: new Date(moment(checkInDate).add(this.state.totalDays, 'day').format('YYYY-MM-DD')) })
      this.getNumberOfRoomsCount(new Date(checkInDate), new Date(moment(checkInDate).add(this.state.totalDays, 'day').format('YYYY-MM-DD')))
      this.getNumOfDays(checkInDate, new Date(moment(checkInDate).add(this.state.totalDays, 'day').format('YYYY-MM-DD')))
    } else if (checkInDateValue < moment(this.state.checkInDate, 'YYYY-DD-MM').valueOf()) {
      this.setState({ checkInDate: new Date(checkInDate), checkOutDate: new Date(moment(checkInDate).add(this.state.totalDays, 'day').format('YYYY-MM-DD')) })
      this.getNumberOfRoomsCount(new Date(checkInDate), new Date(moment(checkInDate).add(this.state.totalDays, 'day').format('YYYY-MM-DD')))
    } else {
      this.setState({ checkInDate: new Date(checkInDate) })
      this.getNumberOfRoomsCount(checkInDate, this.state.checkOutDate)
      this.getNumOfDays(checkInDate, this.state.checkOutDate)
    }
  }
  handleCheckOutDate (checkOutDate) {
    let checkInDateValue = moment(this.state.checkInDate, 'YYYY-DD-MM').valueOf()
    let checkOutDateValue = moment(checkOutDate, 'YYYY-DD-MM').valueOf()

    let checkInTimeValue = moment.utc(moment(this.state.checkInDate).format('YYYY-MM-DD') + ' ' + this.state.checkIntime)
    let checkOuTimeValue = moment.utc(moment(checkOutDate).format('YYYY-MM-DD') + ' ' + this.state.checkOutTime)
    let duration = moment.duration(checkOuTimeValue.diff(checkInTimeValue))
    let Hours = duration.asHours()

    if (Hours > this.state.propertyInfoData.pricing.minBasePriceUnitValue) {
      let checkInDate = moment(checkInDate).format('YYYY-MM-DD')
      let checkOutDateTime = moment(checkInDate + ' ' + this.state.checkIntime, 'YYYY-MM-DD hh:mm A').add(22, 'h')
      // let checkOutDate = moment(checkOutDateTime).format('YYYY-MM-DD')
      let checkOutTime = moment(checkOutDateTime).format('hh:mm A')
      this.setState({ bookingType: 'Base Price', checkOutTime: checkOutTime, checkOutDate: new Date(checkOutDate), amount: this.state.propertyInfoData.pricing.basePrice })
      this.getNumberOfRoomsCount(this.state.checkInDate, checkOutDate, '', moment(checkOutDateTime).format('hh:mm A'))
      this.getNumOfDays(this.state.checkInDate, checkOutDate)
    } else if (checkOutDateValue < checkInDateValue) {
      alert('Check-Out Date Should not be less than Check-In Date')
    } else {
      this.setState({ checkOutDate: new Date(checkOutDate) })
      this.getNumberOfRoomsCount(this.state.checkInDate, new Date(checkOutDate))
      this.getNumOfDays(this.state.checkInDate, new Date(checkOutDate))
    }
  }
  handleBookingtype (e) {
    let checkInDate = moment(this.state.checkInDate).format('YYYY-MM-DD')
    if (e.target.value === 'Minimum Base Price') {
      let checkOutDateTime = moment(checkInDate + ' ' + this.state.checkIntime, 'YYYY-MM-DD hh:mm A').add(this.state.propertyInfoData.pricing.minBasePriceUnitValue, 'hours')
      let checkOutDate = moment(checkOutDateTime).format('YYYY-MM-DD')
      let checkOutTime = moment(checkOutDateTime).format('hh:mm A')
      this.setState({ amount: this.state.propertyInfoData.pricing.minBasePrice, checkOutTime: checkOutTime, bookingType: e.target.value, checkOutDate: new Date(checkOutDate) })
      this.getNumOfDays(this.state.checkInDate, checkOutDate)
      this.getNumberOfRoomsCount(this.state.checkInDate, checkOutDate)
    } else {
      let checkOutDateTime = moment(checkInDate + ' ' + this.state.checkIntime, 'YYYY-MM-DD hh:mm A').add(22, 'h')
      let checkOutDate = moment(checkOutDateTime).format('YYYY-MM-DD')
      let checkOutTime = moment(checkOutDateTime).format('hh:mm A')
      this.setState({ amount: this.state.propertyInfoData.pricing.basePrice, bookingType: e.target.value, checkOutTime: checkOutTime, checkOutDate: new Date(checkOutDate) })
      this.getNumOfDays(this.state.checkInDate, checkOutDate)
      this.getNumberOfRoomsCount(this.state.checkInDate, checkOutDate)
    }
    event.preventDefault()
  }
  onCheckInTimeChange (checkInTime) {
    let checkInDate = moment(this.state.checkInDate).format('YYYY-MM-DD')
    let onChangeCheckInTime = moment(checkInTime).format('hh:mm A')

    let currCheckInTime = this.state.compareCheckIntime
    let currCheckInDate = this.state.compareCheckInDate
    let currCheckInTimeValue = moment(currCheckInDate + ' ' + currCheckInTime, 'YYYY-MM-DD hh:mm A').valueOf()
    let stateCheckInTimeValue = moment(checkInDate + ' ' + onChangeCheckInTime, 'YYYY-MM-DD hh:mm A').valueOf()

    if (stateCheckInTimeValue < currCheckInTimeValue) {
      this.setState({ checkInTime: this.state.compareCheckIntime })
      this.getNumberOfRoomsCount(new Date(this.state.checkInDate), new Date(this.state.checkOutDate), this.state.compareCheckIntime)
    } else if (this.state.bookingType === 'Base Price') {
      let checkOutTime = moment(checkInDate + ' ' + this.state.checkIntime, 'YYYY-MM-DD hh:mm A').add(22, 'h')
      let checkOutDate = moment(checkOutTime).format('YYYY-MM-DD')
      let onChangeCheckOutTime = moment(checkOutTime).format('hh:mm A')
      this.setState({ checkIntime: onChangeCheckInTime, amount: this.state.propertyInfoData.pricing.basePrice, checkOutTime: onChangeCheckOutTime, checkOutDate: new Date(checkOutDate) })
      this.getNumberOfRoomsCount(new Date(this.state.checkInDate), new Date(checkOutDate), onChangeCheckInTime, onChangeCheckOutTime)
      this.getNumOfDays(this.state.checkInDate, checkOutDate)
    } else {
      let checkOutDateTime = moment(checkInDate + ' ' + this.state.checkIntime, 'YYYY-MM-DD hh:mm A').add(this.state.propertyInfoData.pricing.minBasePriceUnitValue, 'hours')
      let checkOutDate = moment(checkOutDateTime).format('YYYY-MM-DD')
      let checkOutTime = moment(checkOutDateTime).format('hh:mm A')
      this.setState({ checkIntime: onChangeCheckInTime, amount: this.state.propertyInfoData.pricing.minBasePrice, checkOutTime: checkOutTime, checkOutDate: new Date(checkOutDate) })
      this.getNumberOfRoomsCount(new Date(this.state.checkInDate), new Date(checkOutDate), onChangeCheckInTime, checkOutTime)
      this.getNumOfDays(this.state.checkInDate, checkOutDate)
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
    let obj = { url: config.baseUrl + config.postEUBookingRoomsCountAPI, body: body }
    let _this = this
    APICallManager.postCall(obj, function (resObj) {
      if (resObj.data.statusCode === '1017') {
        alert(resObj.data.statusMessage)
      } else if (resObj.data.statusCode === '0000') {
        _this.handleBooking()
      } else {
        alert('Something Went Wrong Please Try Again')
      }
    })
  }
  handleBooking () {
    let userLogedIn = JSON.parse(localStorage.getItem('authObj'))
    let spData = this.state.propertyInfoData
    let checkInHours = moment(this.state.checkIntime, ['hh:mm A']).format('HH:mm')
    let checkOutHours = moment(this.state.checkOutTime, ['hh:mm A']).format('HH:mm')
    let cidt = moment(this.state.checkInDate).format('YYYY-MM-DD')
    let codt = moment(this.state.checkOutDate).format('YYYY-MM-DD')
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
      // name: this.state.authObj.name,
      bookingType: this.state.bookingType,
      // roomPrice: this.state.minBasePrice,
      roomPrice: this.state.amount,
      // contactEuNumber: this.state.authObj.mobileNumber,
      noOfAdults: this.state.adults,
      noOfChilds: this.state.childs,
      noOfRooms: this.state.rooms,
      checkInDate: cidt + ' ' + checkInHours,
      checkOutDate: codt + ' ' + checkOutHours,
      totalPrice: (this.state.rooms) * (this.state.totalDays) * (this.state.amount),
      noOfDays: this.state.totalDays
    }
    let checkInDateTime = moment(cidt + ' ' + checkInHours, 'YYYY-MM-DD hh:mm A').valueOf()
    let checkOutDateTime = moment(codt + ' ' + checkOutHours, 'YYYY-MM-DD hh:mm A').valueOf()
    if (checkOutDateTime < checkInDateTime) {
      alert('CheckOut date and time should be greater than checkin date time')
    } else {
      if (userLogedIn === null) {
        localStorage.setItem('postBooking', JSON.stringify(postBooking))
        localStorage.setItem('propertyDocs', JSON.stringify(this.state.propertyDocs))
        hashHistory.push('/login')
      } else {
        localStorage.setItem('postBooking', JSON.stringify(postBooking))
        localStorage.setItem('propertyDocs', JSON.stringify(this.state.propertyDocs))
        this.setState({ confirmBooking: true, postBooking: postBooking })
      }
    }
    event.preventdefault()
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
      alert('You can favoritre this after booking this property')
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
      let obj = { url: config.baseUrl + config.postEUFavouritePropertyAPI, body: postJson }
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
  handleHeaderLogin () {
    localStorage.setItem('navigateTo', 'HotelBookNowPage')
  }
  handlePropertyInfo (data) {
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    homePageData.checkInDate = this.state.checkInDate
    homePageData.checkOutDate = this.state.checkOutDate
    homePageData.child = this.state.childs
    homePageData.guestAdultValue = this.state.adults
    localStorage.setItem('homePageData', JSON.stringify(homePageData))
    localStorage.setItem('EUPropertyInfoData', JSON.stringify(data))
    this.setState({ propertyInfoData: data,
      amount: data.pricing.basePrice,
      amenities: data.amenities,
      guestRules: data.guestRules,
      services: data.services })
    this.reloadFunction()
  }
  reloadFunction () {
    let propertyInfoData = JSON.parse(localStorage.getItem('EUPropertyInfoData'))
    let currMin = moment().add(30, 'm').format('mm')
    let meridiem = moment().add(30, 'm').format('A')
    let min = Math.round(currMin / 15) * 15
    let minutes = min && min !== 60 ? min.toString() : '00'
    let hours = min && min !== 60 ? moment().add(30, 'm').format('hh').toString() : moment().add(1, 'h').format('hh').toString()
    let chekinTime = hours + ':' + minutes + ' ' + meridiem

    let chekinDate = moment().format('YYYY-MM-DD')

    let chekinDateTime = moment(chekinDate + ' ' + hours + ':' + minutes + ' ' + meridiem, 'YYYY-MM-DD hh:mm A')
    let checkOutMin = moment(chekinDateTime).add(22, 'h').format('mm')
    let checkOutMeridiem = moment(chekinDateTime).add(22, 'h').format('A')
    let checkOutMinRound = Math.round(checkOutMin / 15) * 15
    let checkOutMinutes = checkOutMinRound ? checkOutMinRound.toString() : '00'
    let checkOutHours = moment(chekinDateTime).add(22, 'h').format('hh').toString()
    let chekOutTime = checkOutHours + ':' + checkOutMinutes + ' ' + checkOutMeridiem

    const defaultcheckInDate = moment().format('YYYY-MM-DD')
    const defaultChckInTime = moment(defaultcheckInDate + ' ' + propertyInfoData.pricing.checkInTime, 'YYYY-MM-DD hh:mm A').valueOf()
    const defaultCurrTime = moment(defaultcheckInDate + ' ' + chekinTime, 'YYYY-MM-DD hh:mm A').valueOf()
    this.setState({
      checkIntime: propertyInfoData.pricing.checkInCredentials === 'Specific Time' ? propertyInfoData.pricing.checkInTime : defaultChckInTime < defaultCurrTime ? chekinTime
        : propertyInfoData.pricing.checkInTime,
      checkOutTime: propertyInfoData.pricing.checkInCredentials === 'Specific Time' ? propertyInfoData.pricing.checkOutTime : defaultChckInTime < defaultCurrTime ? chekOutTime : propertyInfoData.pricing.checkOutTime,
      compareCheckIntime: propertyInfoData.pricing.checkInCredentials === 'Specific Time' ? propertyInfoData.pricing.checkInTime
        : defaultChckInTime < defaultCurrTime ? chekinTime : propertyInfoData.pricing.checkInTime,
      compareCheckOutTime: propertyInfoData.pricing.checkInCredentials === 'Specific Time' ? propertyInfoData.pricing.checkOutTime
        : defaultChckInTime < defaultCurrTime ? chekOutTime : propertyInfoData.pricing.checkOutTime,
      compareCheckInDate: moment().format('YYYY-MM-DD'),
      propertyId: propertyInfoData.propertyId._id
    })

    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    let currentDate = moment().format('YYYY-MM-DD').valueOf()
    if (homePageData) {
      let userCheckInDate = moment(new Date(homePageData.checkInDate)).format('YYYY-MM-DD').valueOf()
      this.setState({ checkInDate: new Date(homePageData.checkInDate), checkOutDate: new Date(homePageData.checkOutDate) })
      if (userCheckInDate > currentDate) {
        this.setState({ checkIntime: this.state.propertyInfoData.pricing.checkInTime, checkOutTime: this.state.propertyInfoData.pricing.checkOutTime })
      }
      if (homePageData.guestAdultValue > 1 && homePageData.child === 0) {
        let addValue = (homePageData.guestAdultValue) + (homePageData.child)
        let numOfAdults = (homePageData.guestAdultValue)
        let totalCapacity = parseInt(propertyInfoData.membersCapacity) + parseInt(propertyInfoData.childsCapacity)
        let RoomCount = (numOfAdults / parseInt(propertyInfoData.membersCapacity))
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
      } else {
        let numOfPeople = homePageData.guestAdultValue + homePageData.child
        let totalCapacity = parseInt(propertyInfoData.membersCapacity) + parseInt(propertyInfoData.childsCapacity)
        let TotalRoomCount = (numOfPeople / totalCapacity)
        let totalIndex = TotalRoomCount % 1
        let totalRoomsCount = (totalIndex === 0) ? TotalRoomCount : parseInt(TotalRoomCount.toString().split('.')[0]) + 1
        this.setState({ rooms: totalRoomsCount })
      }
      this.getNumOfDays(new Date(homePageData.checkInDate), new Date(homePageData.checkOutDate))
    }
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.preferences) {
      let favouriteProperties = (authObj && authObj.preferences && authObj.preferences.favouriteProperties) ? authObj.preferences.favouriteProperties : []
      this.setState({ authObj: authObj, favouriteProperties: favouriteProperties })
    }
    let propertyId = this.state.propertyInfoData.propertyId._id ? this.state.propertyInfoData.propertyId._id : this.state.propertyInfoData.propertyId
    let getSPPropertyDocsObj = {
      url: config.baseUrl + config.getPropertyDocsAPI + propertyId
    }
    let _this = this
    APICallManager.getCall(getSPPropertyDocsObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        let videoFile = resObj.data.statusResult.find(data => data.fileType === 'Video')
        _this.setState({
          propertyDocs : resObj.data.statusResult,
          videoFile: videoFile.imagePath
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
        {/* {this.state.authObj && this.state.authObj.userRole === 'Customer' ? <MainHeader handleHeaderLogin={this.handleHeaderLogin} /> : <HeaderWithoutLogin />} */}
        {this.state.confirmBooking === false
        ? <main role='main' className='inner cover hotelView-wrapper'>
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
                      <a className='video-close' onClick={this.handleVideoClose} ><span><i className='fas fa-close' /></span></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          : <div>
            <Carousel className='mb-7' infiniteLoop useKeyboardArrows dynamicHeight showArrows autoPlay onChange={this.onChange} onClickItem={this.onClickItem} onClickThumb={this.onClickThumb}>
              {/* {this.state.sliderImages.map((item, i) => */}
              {this.state.propertyDocs.length > 0 ? this.state.propertyDocs.map((item, i) =>
                <div className='slide-1' key={i}>
                  {/* <img src={item.maximg} /> */}
                  {item.fileType !== 'Video'
                  ? <img src={config.baseUrl + item.imagePath} />
                  : <img src={require('../../../../assets/videos/player-3311600__340.png')} />}
                  {/* : <video playsinline='playsinline' controls muted='muted' loop='loop'>
                    <source src={config.baseUrl + item.imagePath} type='video/mp4' />
                  </video>} */}
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
                                <div className='location-sq font-weight-600'>
                                  <i className='fas fa-map-marker-alt' />
                                  {this.state.propertyInfoData.spLocationObj.address}
                                </div>
                                <div className='location-sq pt-0 pb-7'>
                                  {this.state.videoFile
                                  ? <a onClick={this.handleVideoPlay} className='text-white' >
                                    <i className='fas fa-video' /><br />
                                      Watch Video
                                    </a>
                                  : null }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> {/* col-lg-9 end  */}
                      </div>{/* row end */}
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
                      <a data-trigger-for='menu04'
                        className='modal-trigger close-sq hamburger hamburger-spin item hidden-tablet hidden-desktop hidden-large-desktop'
                      >
                        <span className='hamburger-box'>
                          <span className='hamburger-inner' />
                        </span>
                      </a>
                      <div className='property-sticky-box'>
                        <div className='price-tag-sq'>
                          <span className='price-sq'> ₹ {(this.state.rooms) * (this.state.totalDays) * (this.state.amount)}</span>
                          <span className='per-sq text-white font-weight-500' data-text-mobile='/ ' data-text='Total Days'> {this.state.totalDays} </span>
                        </div>
                        <div className='mobile-fixed-section'>
                          <div className='sticky-box-content'>
                            <form>
                              <div className='main-infos inline-check-in'>
                                <div className='check-in calendar-sq' id='sticky-box-rangestart'>
                                  <label className='placeholder' data-placeholder='Booking Type' />
                                  <div className='relative'>
                                    <select value={this.state.bookingType} onChange={(value) => this.handleBookingtype(value)} multiple='' className='form-control'>
                                      <option>Base Price</option>
                                      <option>Minimum Base Price</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className='main-infos inline-check-in'>
                                <div className='check-in calendar-sq' id='sticky-box-rangestart'>
                                  <label className='placeholder' >Check In</label>
                                  <div className='relative'>
                                    <DatePicker
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
                                  <label className='placeholder' >Check Out</label>
                                  <DatePicker
                                    dateFormat='MMM dd, yyyy'
                                    selected={this.state.checkOutDate}
                                    minDate={this.state.checkInDate}
                                    maxDate={addDays(new Date(), this.state.maxDate)}
                                    onChange={(checkOutDate) => this.handleCheckOutDate(checkOutDate)}
                                  />
                                </div>
                                <div className='guests'>
                                  <label className='placeholder pr-2'>Days</label>
                                  <input type='text' value={this.state.totalDays} className='days-cal' readOnly />
                                </div>
                              </div>
                              <div className='main-infos inline-check-in mt-2'>
                                <div className='check-in calendar-sq' id='sticky-box-rangestart'>
                                  <label className='placeholder' data-placeholder='Check In ' />
                                  <div className='relative time-picker'>
                                    <TimePicker
                                      showSecond={false}
                                      value={moment(this.state.checkIntime, format)}
                                      className='xxx'
                                      onChange={(checkInTime) => this.onCheckInTimeChange(checkInTime)}
                                      minuteStep={15}
                                      format={format}
                                      use12Hours
                                      inputReadOnly
                                    />
                                    <i className='fas fa-long-arrow-alt-right' style={{ right: 10 }} />
                                  </div>
                                </div>
                                <div className='check-out-time calendar-sq' id='sticky-box-rangeend'>
                                  <label className='placeholder' data-placeholder='Check Out ' />
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
                              </div>
                              <div className='main-infos inline-check-in mt-2'>
                                <div className='check-in calendar-sq' id='sticky-box-rangestart'>
                                  <label className='placeholder'>Adults</label>
                                  <a onClick={() => this.handleGuestsDropdown()} >
                                    <div className='relative guests-Adults-dropdown'>
                                      <label>{this.state.adults}</label>
                                    </div>
                                  </a>
                                </div>
                                <div className='check-out calendar-sq' id='sticky-box-rangeend'>
                                  <label className='placeholder'>Childs</label>
                                  <a onClick={() => this.handleGuestsDropdown()} >
                                    <div className='childs-Adults-dropdown'>
                                      <label>{this.state.childs}</label>
                                    </div>
                                  </a>
                                </div>
                                <div className='days' style={{ top: 0 }} >
                                  <label className='placeholder' >Rooms</label>
                                  <a onClick={() => this.handleGuestsDropdown()} >
                                    <div className='rooms-Adults-dropdown'>
                                      <label>{this.state.rooms}</label>
                                    </div>
                                  </a>
                                </div>
                              </div>
                              {this.state.guestDropdownActive === true
                              ? <div className=' book-now overlay-guest-dropdown'>
                                <div className='guest-dropdown-div'>
                                  <div className='card-body'>
                                    <div className='row mb-2'>
                                      <div className='col-sm-3 py-2'>{t`lanEULabelAdults`}</div>
                                      <div className='col-sm-3'>
                                        <button type='button' className='circle-class'
                                          disabled={parseInt(this.state.adults) > ((this.state.avaliableRoomCount) * (this.state.propertyInfoData.membersCapacity) - 1) ||
                                          (parseInt(this.state.adults) + parseInt(this.state.childs) >
                                          ((this.state.avaliableRoomCount) * (parseInt(this.state.propertyInfoData.membersCapacity) + parseInt(this.state.propertyInfoData.childsCapacity)) - 1))}
                                          onClick={() => this.handleAdultsIncrease(this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)} >
                                          <i className='fas fa-plus mr-0' style={{ color: 'black' }} />
                                        </button>
                                      </div>
                                      <div className='col-sm-3  py-2 text-center '><strong> {this.state.adults} </strong></div>
                                      <div className='col-sm-3'>
                                        <button type='button' className='circle-class' disabled={this.state.adults <= 1}
                                          onClick={() => this.handleAdultsDecrease(this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)} >
                                          <i className='fas fa-minus mr-0' style={{ color: 'black' }} />
                                        </button>
                                      </div>
                                    </div>
                                    <div className='row mb-2'>
                                      <div className='col-sm-3 py-2'>{t`lanEULabelChilds`}</div>
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
                                      <div className='col-sm-3  py-2 text-center '><strong> {this.state.childs} </strong></div>
                                      <div className='col-sm-3'>
                                        <button type='button' className='circle-class' disabled={this.state.childs <= 0}
                                          onClick={() => this.handleChildsDecrease(this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)} >
                                          <i className='fas fa-minus' style={{ color: 'black' }} />
                                        </button>
                                      </div>
                                    </div>
                                    <div className='row mb-2'>
                                      <div className='col-sm-3 py-2'>{t`lanEULabelRooms`}</div>
                                      <div className='col-sm-3'>
                                        <button type='button' className='circle-class' disabled={this.state.avaliableRoomCount <= this.state.rooms}
                                          onClick={() => this.handleRooms('add', this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)} >
                                          <i className='fas fa-plus' style={{ color: 'black' }} />
                                        </button>
                                      </div>
                                      <div className='col-sm-3  py-2 text-center '><strong> {this.state.rooms} </strong></div>
                                      <div className='col-sm-3'>
                                        <button type='button' className='circle-class' disabled={this.state.rooms <= 1}
                                          onClick={() => this.handleRooms('sub', this.state.propertyInfoData.membersCapacity, this.state.propertyInfoData.childsCapacity)} >
                                          <i className='fas fa-minus' style={{ color: 'black' }} />
                                        </button>
                                      </div>
                                    </div>
                                    <div className='row mt-3'>
                                      <div className='col-sm-12 text-right'>
                                        <button type='button' className='btn btn-primary' onClick={this.handleApply} > {t`lanEUButtonApply`}</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              : null }
                              <div className='calculations mt-3'>
                                <div className='calc-row'>
                                  <div className='calc-column'>
                                    <p className='desc mb-0'>Amount/night</p>
                                  </div>
                                  <div className='calc-column'>
                                    <p className='price-sq mb-0'>₹ {this.state.amount}</p>
                                  </div>
                                </div>
                                <div className='calc-row'>
                                  <div className='calc-column'>
                                    <p className='desc mb-0'>No.of days</p>
                                  </div>
                                  <div className='calc-column'>
                                    <p className='price-sq mb-0'> {this.state.totalDays}</p>
                                  </div>
                                </div>
                                <div className='calc-row'>
                                  <div className='calc-column'>
                                    <p className='desc mb-0'>{t`lanEULabelTotal`}</p>
                                  </div>
                                  <div className='calc-column'>
                                    <p className='price-sq mb-0'>₹ {(this.state.rooms) * (this.state.totalDays) * (this.state.amount)}</p>
                                  </div>
                                </div>
                              </div>
                              <button type='button' disabled={this.state.propertyBlocked} onClick={() => this.getRoomsCount()}
                                className={classnames('button-sq fullwidth-sq font-weight-extrabold-sq', { 'disabled': this.state.propertyBlocked })}>{t`lanEUButtonBookNow`}</button>
                              { this.state.propertyBlocked ? null : <p className='desc mb-0 text-success'>{`Hurry up!!! Only ${this.state.avaliableRoomCount} Rooms Left`}</p> }
                              <p className='desc mb-0 text-danger'>{this.state.BookingBlocked}</p>
                            </form>
                          </div>
                          {/* <div className='sticky-box-wishlist'>
                            <div className='wishlist-sq'>
                              <a ><i className='fab fa-gratipay' />Save Property</a>
                            </div>
                            <div className='aux-info-sq'>
                              <p>1060 travelers saved this place</p>
                            </div>
                            <div className='share-sq'>
                              <a ><i className='icon icon-share' />Share</a>
                            </div>
                          </div> */}
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
                        <a className={classnames('nav-link', { 'bahunya': this.state.activeAbout })} onClick={this.handleActiveAbout} >About Property</a>
                      </li>
                      <li className='nav-item'>
                        <a className={classnames('nav-link', { 'bahunya': this.state.activePhotos })} onClick={this.handleActivePhotos} >{t`lanEULabelPhotos`}</a>
                      </li>
                      <li className='nav-item'>
                        <a className={classnames('nav-link', { 'bahunya': this.state.activeLocation })} onClick={this.handleActiveLocation} >{t`lanEULabelLocation`}</a>
                      </li>
                      <li className='nav-item'>
                        <a className={classnames('nav-link', { 'bahunya': this.state.activeReview })} onClick={this.handleActiveReview} >{t`lanCommonButtonTooltipReviews`}</a>
                      </li>
                    </ul>
                  </nav>
                  <div data-spy='scroll' data-target='#navbar-example2' data-offset='0'>
                    {/* <!-- property details grid About starts--> */}
                    <div className=' container'>
                      <div className='row'>
                        <div className='col-lg-9 col-sm-10 col-xs-12' role='main'>
                          <div className='section-container' id='section-01'>
                            <div className='typo-section-sq top-default bottom-default'>
                              <h3>About This Property</h3>
                              <h5>Description</h5>
                              <p>{this.state.propertyInfoData.propertyId.aboutProperty}</p>
                              <div className='button-sq small-sq see-through-sq modal-ui-trigger' data-trigger-for='contact'> message us</div>
                              <div className='button-sq link-sq small-sq float-right-sq'>
                                <i className='fas fa-share-alt' />
                              </div>
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
                                        <strong>{(this.state.propertyInfoData.propertyId.privateBathRooms + this.state.propertyInfoData.propertyId.commonBathRooms)}</strong>
                                      </div>
                                    </li>
                                    <li>
                                      <i className='fas fa-bed' />
                                      <div>
                                        <p>{t`lanEULabelBeds`}</p>
                                        <strong>{(this.state.propertyInfoData.propertyId.doubleBedsCount + this.state.propertyInfoData.propertyId.kingBedsCount +
                                          this.state.propertyInfoData.propertyId.queenBedsCount + this.state.propertyInfoData.propertyId.singleBedsCount)}</strong>
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
                                        <strong>{this.state.propertyInfoData.pricing.checkInTime}</strong> / <strong>{this.state.propertyInfoData.pricing.checkOutTime}</strong>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            {this.state.selectPropertyInfo.length > 1
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
                                            <div className='col- text-left'> <p>Base Price :</p> </div>
                                            <div className='col- text-right'><strong>{data.pricing.basePrice}</strong></div>
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
                                        <strong>{this.state.propertyInfoData.pricing.fullRefundCancelTime} Hours</strong>
                                      </div>
                                    </li>
                                    <li>
                                      <div>
                                        <p>Refund Cancel Time</p>
                                        <strong>{this.state.propertyInfoData.pricing.refundCancelTime} Hours</strong>
                                      </div>
                                    </li>
                                    <li>
                                      <div>
                                        <p>Refund Cancel Percentage</p>
                                        <strong>{this.state.propertyInfoData.pricing.refundCancelPercentage} %</strong>
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
                                                    {x ? <p className='available-aminity' >{item.name}</p> : <p className='disable-aminity'>{item.name}</p>}
                                                    {/* {this.state.amenities.map((data, i) =>
                                                    data === item.name ? <p style={{ backgroundColor: 'green' }}>{data}</p> : <p>{item.name}</p>
                                                    )} */}
                                                    {/* <p>{item.name}</p> */}
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
                                                    {x ? <p className='available-service' >{item.ruleName}</p> : <p className='disable-service' >{item.ruleName}</p>}
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
                          <div className='section-container top-default bottom-default' id='photos-section'>
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
                        </div>
                        <div className='ui column side-column'> {/* empty */} </div>
                      </div>
                    </div>
                    <div className='section-container' id='location-section'>
                      <div className='ui grid container stackable app layout right side'>
                        <div className='stretched row'>
                          <div className='ui column main-column' role='main'>
                            <div className='typo-section-sq top-default'>
                              <h3>{t`lanEULabelLocation`}</h3>
                            </div>
                          </div>
                          <div className='ui column side-column' />
                        </div>
                      </div>
                      <div className='container'>
                        <div className='row'>
                          <div className='col-lg-8 col-sm-12 col-12'>
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
                    <div className=' container '>
                      <div className='stretched row'>
                        <div className='ui column main-column col-lg-9 col-sm-12 col-xs-12' role='main'>
                          <div className='section-container' id='reviews-section' >
                            <div className='typo-section-sq top-default bottom-default'>
                              <h3>Reviews</h3>
                              <div className='reviews-search'>
                                <form className=''>
                                  <input id='reviews-search' type='text' placeholder='Search reviews' />
                                  <label><i className='fas fa-search' style={{ color: '#747a80' }} /></label>
                                </form>
                              </div>

                              <div className='col-sm-12'>
                                <div className='reviews-row'>

                                  <div className='review-meta'>
                                    <a className='avatar-sq verified-sq' >
                                      <img src={require('../../../../assets/avatar_01.jpg')} alt='' />
                                    </a>
                                    <a className='name-sq'>Danny Martinez</a>
                                  </div>

                                  <div className='comment-sq'>
                                    <span className='date-sq'>12 september 2017</span>

                                    <p className='font-weight-400'>As the saying goes: “Hospitality is making your guests feel at home, even
                                        though you wish they were'. So please treat the place and the building
                                        neighbours as you would do your own.</p>
                                  </div>
                                </div>

                                <div className='reviews-row'>
                                  <div className='review-meta'>
                                    <a className='avatar-sq verified-sq' >
                                      <img src='image/avatar_03.jpg' alt='' />
                                    </a>
                                    <a className='name-sq' >Nathaniel Brown</a>
                                  </div>
                                  <div className='comment-sq'>
                                    <span className='date-sq'>24 august 2017</span>

                                    <p className='font-weight-400' >With your budget in mind, it is easy to plan a chartered yacht vacation.
                                        Companies often have a fleet of sailing vessels that can accommodate parties
                                        of various sizes. You may want to make it a more intimate trip with only
                                        close family. There are charters that can be rented for as few as two
                                        people.</p>
                                  </div>
                                </div>
                                {/*
                                <div className='reviews-row'>
                                  <div className='review-meta'>
                                    <a className='avatar-sq verified-sq' >
                                      <img src={require('../../../../assets/avatar_02.jpg')} alt='' />
                                    </a>
                                    <a className='name-sq'>Adele Burke</a>
                                  </div>

                                  <div className='comment-sq'>
                                    <span className='date-sq'>06 May 2017</span>

                                    <div className='ui accordion more-sq'>
                                      <div className='title'>
                                        <a className='accordion-trigger more-trigger right-sq' data-more='More'
                                          data-less='Less'>
                                          <i className='far fa-arrow-alt-circle-down' />
                                        </a>
                                        <p className='font-weight-400' >It is important to choose a hotel that makes you feel comfortable –
                                            contemporary or traditional furnishings, local decor or
                                            international, formal or relaxed. The ideal hotel directory should
                                            let you know of the options available.
                                        </p>
                                      </div>
                                      <div className='content'>
                                        <p>If it matters that your hotel is, for example, on the beach, close to
                                            the theme park, or convenient for the airport, then location is
                                            paramount. Any decent directory should offer a location map of the
                                            hotel and its surroundings. There should be distance charts to the
                                            airport offered as well as some form of interactive map.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div> */}
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
        </main> : <EUConfirmBooking isHeader='false' confirmBooking={this.confirmBooking} postBooking={this.state.postBooking} propertyDocs={this.state.propertyDocs} /> }
      </div>
    )
  }
}
HotelBookNowPage.propTypes = {
  google: PropTypes.any
}
export default GoogleApiWrapper({
  apiKey: ('AIzaSyAzRLF3zrXoLF9E0VxCJUQcesO0Z9qqkb0')
})(HotelBookNowPage)

