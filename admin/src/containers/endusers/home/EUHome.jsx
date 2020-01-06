/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import DatePicker from 'react-datepicker'
import { addDays } from 'date-fns'
import 'react-day-picker/lib/style.css'
import Modal from 'react-modal'
import moment from 'moment'
import { t } from 'ttag'

// import HeaderWithoutLogin from '../../../components/endusers/HeaderCompnt/HeaderWithoutLogin'
// import MainHeader from '../../../components/endusers/HeaderCompnt/MainHeader'
// import DrawerWithHeader from '../../../components/serviceproviders/Drawer/DrawerComponent'
// import FooterComponent from '../../../components/endusers/FooterCompnt/Footer'
// import EUHomePropertiesListComponent from '../../../components/endusers/home/EUHomePropertiesListComponent'
import '../home/Css/EULandingPage.css'
import '../../../css/carousel.css'
import '../../../css/theme.min.css'
import classnames from 'classnames'
import './Css/EUStickyFilter.css'
import './Css/EUVideoTheme.css'
import './Css/calendar-css.css'
import './Css/landing-responsive.css'
var ip = require('ip')

const Amenities = require('../../../../assets/amenities/amenities.json')

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
}

class EUHomelandingPage extends React.Component {
  constructor () {
    super()
    var currentDate = moment.utc(moment().format('YYYY-MM-DD'))
    var checkOut = moment.utc(moment().add(3, 'month').endOf('month').format('YYYY-MM-DD'))
    var duration = moment.duration(checkOut.diff(currentDate))
    var days = duration.asDays()
    this.state = {
      latitude: 0,
      longitude: 0,
      area: '',
      city: '',
      state: '',
      location: '',
      guestAdultValue: 2,
      guestRooms: 1,
      sortBy: 'Recommended',
      filterBy: {},
      SPPropertyList: [],
      activePage: 1,
      checkInDate: new Date(moment().format('YYYY-MM-DD')),
      checkOutDate: new Date(moment().add(1, 'day').format('YYYY-MM-DD')),
      startDate: new Date(),
      isOpen: true,
      prevScrollpos: window.pageYOffset,
      visible: true,
      child: 0,
      searchString: '',
      predictions: [],
      isEnable: false,
      guestDropdownActive: false,
      isActionDone: false,
      authObj: {},
      favouriteProperties: [],
      mountains: [
        { placeImg: require('../../../../assets/all/m1.jpg') },
        { placeImg: require('../../../../assets/all/m2.jpg') }
      ],
      beachPlaces: false,
      mountainPlaces: false,
      typeSelect: true,
      typeSelectRemote: false,
      typeSelectTemple: false,
      typeSelectResort: false,
      typeSelectCity: false,
      typeSelectHill: false,
      from: undefined,
      to: undefined,
      moreImages: [
        { simg: require('../../../../assets/r1.jpg') },
        { simg: require('../../../../assets/r2.jpg') },
        { simg: require('../../../../assets/r4.jpg') },
        { simg: require('../../../../assets/r5.jpg') },
        { simg: require('../../../../assets/r1.jpg') }
      ],
      spPropertyIDs: [],
      spPropertyInfo: [],
      modalIsOpen: false,
      isEnableTopbar: false,
      topbarGuests: false,
      maxDate: days
    }
    this.handleDefaultData = this.handleDefaultData.bind(this)
    this.handleBecomeHost = this.handleBecomeHost.bind(this)
    this.handleAllHotelsList = this.handleAllHotelsList.bind(this)
    this.handleCheckInDate = this.handleCheckInDate.bind(this)
    this.handleCheckOutDate = this.handleCheckOutDate.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleEnduserSignup = this.handleEnduserSignup.bind(this)
    this.handleEndUserLogin = this.handleEndUserLogin.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.handleBeachPlacesTab = this.handleBeachPlacesTab.bind(this)
    this.handleMountainPlacesTab = this.handleMountainPlacesTab.bind(this)
    this.handleAllTypeSelected = this.handleAllTypeSelected.bind(this)
    this.handleResortTypeSelected = this.handleResortTypeSelected.bind(this)
    this.handleTraditionalTabSelected = this.handleTraditionalTabSelected.bind(this)
    this.handleCityTypeSelected = this.handleCityTypeSelected.bind(this)
    this.handleFromChange = this.handleFromChange.bind(this)
    this.handleToChange = this.handleToChange.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleTopbarSearchChange = this.handleTopbarSearchChange.bind(this)
    this.handleGuestsDropdown = this.handleGuestsDropdown.bind(this)
    this.handleTopbarGuestsDropdown = this.handleTopbarGuestsDropdown.bind(this)
    this.handleApply = this.handleApply.bind(this)
    this.handleLocationData = this.handleLocationData.bind(this)
    this.handleGuestInc = this.handleGuestInc.bind(this)
    this.handleGuestDec = this.handleGuestDec.bind(this)
    this.handleGuestChildDec = this.handleGuestChildDec.bind(this)
    this.handleGuestChildInc = this.handleGuestChildInc.bind(this)
    this.handleGuestRoomsInc = this.handleGuestRoomsInc.bind(this)
    this.handleGuestRoomsDec = this.handleGuestRoomsDec.bind(this)
    this.handleCompare = this.handleCompare.bind(this)
    this.handleComparePopup = this.handleComparePopup.bind(this)
    this.handleComparePage = this.handleComparePage.bind(this)
    this.handleHotelInfoView = this.handleHotelInfoView.bind(this)
    this.handleLoginClickInHeader = this.handleLoginClickInHeader.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  componentWillMount () {
    window.addEventListener('scroll', this.handleScroll)
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.preferences) {
      let favouriteProperties = (authObj && authObj.preferences && authObj.preferences.favouriteProperties) ? authObj.preferences.favouriteProperties : []
      this.setState({ authObj: authObj, favouriteProperties: favouriteProperties })
    }
  }

  // componentDidMount () {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       this.setState({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //         error: null
  //       })
  //       this.getAddressComponents(position.coords.latitude, position.coords.longitude)
  //     },
  //     (error) => {
  //       this.setState({ error: error.message })
  //       // this.handleDefaultData()
  //     },
  //     { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
  //   )
  // }
  componentDidMount () {
    let locationSearchObj = JSON.parse(localStorage.getItem('locationSearchObj'))
    if (locationSearchObj && locationSearchObj.area && locationSearchObj.city && locationSearchObj.state) {
      this.handleDataByLocation(locationSearchObj.area, locationSearchObj.city, locationSearchObj.state, locationSearchObj.guestAdultValue, locationSearchObj.guestRooms)
      this.setState({
        latitude: locationSearchObj.latitude,
        longitude: locationSearchObj.longitude,
        location: locationSearchObj.area + ',' + locationSearchObj.city + ',' + locationSearchObj.state,
        area: locationSearchObj.area,
        city: locationSearchObj.city,
        state: locationSearchObj.state,
        // mapOptions: {
        //   zoom: 13,
        //   center: { lat: locationSearchObj.latitude, lng: locationSearchObj.longitude }
        // },
        guestAdultValue: locationSearchObj.guestAdultValue ? locationSearchObj.guestAdultValue : 2,
        child: locationSearchObj.child ? locationSearchObj.child : 0,
        guestRooms: locationSearchObj.guestRooms
      })
      // setTimeout(() => {
      //   this.handleSetUserLocation(locationSearchObj.latitude, locationSearchObj.longitude)
      // }, 500)
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null
          })
          this.getAddressComponents(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          this.setState({ error: error.message })
          this.handleDefaultData()
        },
        { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
      )
    }
  }
  getAddressComponents (lat, long) {
    let area = ''
    let city = ''
    let state = ''
    fetch(config.googleGeoLocationLatLng + lat + ',' + long + '&key=' + config.googleMapsAPIKey)
    .then((response) => response.json())
    .then((responseJson) => {
      responseJson.results[0].address_components.forEach(data => {
        if (data.types.indexOf('sublocality_level_1') !== -1) {
          area = data.long_name
          this.setState({ area: data.long_name })
        }
        if (data.types.indexOf('administrative_area_level_2') !== -1) {
          city = data.long_name
          this.setState({ city: data.long_name })
        }
        if (data.types.indexOf('administrative_area_level_1') !== -1) {
          state = data.long_name
          this.setState({ state: data.long_name })
        }
      })
      if (area && city && state) {
        this.setState({ location: area + ', ' + city + ', ' + state })
        this.handleDataByLocation(area, city, state)
        let locationSearchObj = {
          area: this.state.area,
          city: this.state.city,
          state: this.state.state,
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          checkInDate: this.state.checkInDate,
          checkOutDate: this.state.checkOutDate,
          guestAdultValue: this.state.guestAdultValue,
          child: this.state.child,
          guestRooms: this.state.guestRooms
        }
        localStorage.setItem('locationSearchObj', JSON.stringify(locationSearchObj))
      }
    }).catch((error) => {
      console.log('error', error)
      // this.handleDefaultData()
    })
  }
  componentWillUnmount () {
    // If this component is unmounted, stop listening
    window.removeEventListener('scroll', this.handleScroll)
  }
  handleDataByLocation (area, city, state) {
    let num = 1
    let postJson = {
      'dataType': 'byLocation',
      'noOfPersons': this.state.guestAdultValue,
      'noOfRooms': this.state.guestRooms,
      'sortBy': this.state.sortBy,
      'filterBy': this.state.filterBy,
      'activePage': num,
      'area': area,
      'city': city,
      'state': state
    }
    let propertiesList = { url: config.baseUrl + config.postEUHomePropertyGetAPI, body: postJson }
    let _this = this
    APICallManager.postCall(propertiesList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ SPPropertyList: resObj.data.statusResult.homeData })
      } else {
        _this.setState({ SPPropertyList: [] })
      }
    })
  }
  handleDefaultData () {
    let ipAddress = ip.address()
    let num = 1
    let postJson = {
      'dataType': 'default',
      'noOfPersons': this.state.guestAdultValue,
      'noOfRooms': this.state.guestRooms,
      'sortBy': this.state.sortBy,
      'filterBy': this.state.filterBy,
      'activePage': num,
      'ip': ipAddress
    }
    let propertiesList = { url: config.baseUrl + config.postEUHomePropertyGetAPI, body: postJson }
    let _this = this
    APICallManager.postCall(propertiesList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ SPPropertyList: resObj.data.statusResult.homeData })
      } else {
        _this.setState({ SPPropertyList: [] })
      }
    })
  }
  handleScroll (e) {
    const { prevScrollpos } = this.state
    const currentScrollPos = window.pageYOffset
    const visible = prevScrollpos > currentScrollPos
    if (currentScrollPos > 300) {
      this.setState({
        prevScrollpos: currentScrollPos,
        visible
      })
    }
  }
  handleBecomeHost (e) {
    hashHistory.push('/host')
    e.preventDefault()
  }
  handleCheckInDate (date) {
    this.setState({
      checkInDate: date,
      checkOutDate: date
    })
  }
  handleCheckOutDate (date) {
    this.setState({
      checkOutDate: date
    })
  }
  handleDateChange (date) {
    this.setState({
      startDate: date
    })
  }
  handleEnduserSignup (e) {
    hashHistory.push('/usersignup')
    e.preventDefault()
  }
  handleEndUserLogin (e) {
    hashHistory.push('/home/login')
    e.preventDefault()
  }
  handleBeachPlacesTab (e) {
    this.setState({
      beachPlaces: true,
      typeSelectRemote: true,
      typeSelect: false,
      typeSelectTemple: false,
      typeSelectResort: false,
      typeSelectCity: false,
      typeSelectHill: false
    })
  }
  handleMountainPlacesTab (e) {
    this.setState({
      mountainPlaces: true,
      typeSelectHill: true,
      typeSelect: false,
      typeSelectRemote: false,
      typeSelectTemple: false,
      typeSelectResort: false,
      typeSelectCity: false
    })
  }
  handleAllTypeSelected () {
    this.setState({
      typeSelect: true, typeSelectRemote: false, typeSelectTemple: false, typeSelectResort: false, typeSelectCity: false, typeSelectHill: false
    })
  }
  handleResortTypeSelected () {
    this.setState({
      typeSelectResort: true, typeSelectRemote: false, typeSelectTemple: false, typeSelect: false, typeSelectCity: false, typeSelectHill: false
    })
  }
  handleTraditionalTabSelected () {
    this.setState({
      typeSelectTemple: true, typeSelectRemote: false, typeSelectResort: false, typeSelect: false, typeSelectCity: false, typeSelectHill: false
    })
  }
  handleCityTypeSelected () {
    this.setState({
      typeSelectCity: true, typeSelectRemote: false, typeSelectResort: false, typeSelect: false, typeSelectTemple: false, typeSelectHill: false
    })
  }
  showFromMonth () {
    const { from, to } = this.state
    if (!from) {
      return
    }
    if (moment(to).diff(moment(from), 'months') < 2) {
      this.to.getDayPicker().showMonth(from)
    }
  }
  handleFromChange (from) {
    // Change the from date and focus the 'to' input field
    this.setState({ from })
  }
  handleToChange (to) {
    this.setState({ to })
  }
  handleGuestsDropdown () {
    this.setState({
      guestDropdownActive:true
    })
  }
  handleTopbarGuestsDropdown () {
    this.setState({
      guestDropdownActive:true,
      topbarGuests: true
    })
  }
  handleApply () {
    this.setState({
      guestDropdownActive:false
    })
  }
  async handleSearchChange (event) {
    let destination = event.target.value
    if (event.target.value.trim().length) {
      this.setState({
        isEnable: true, location: destination, destination: destination
      })
      const apiurl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${config.googleMapsAPIKey}&input=${destination}&location=${this.state.latitude},${this.state.longitude}&radius=2000`
      try {
        const result = await fetch(config.corsUrl + apiurl)
        const json = await result.json()
        this.setState({
          predictions: json.predictions
        })
      } catch (err) {
        console.log('error', err)
      }
    } else {
      this.setState({
        isEnable: false, location: destination, destination: destination
      })
    }
  }
  async handleTopbarSearchChange () {
    let destination = event.target.value
    if (event.target.value.trim().length) {
      this.setState({
        isEnable: true, isEnableTopbar: true, location: destination, destination: destination
      })
      const apiurl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${config.googleMapsAPIKey}&input=${destination}&location=${this.state.latitude},${this.state.longitude}&radius=2000`
      try {
        const result = await fetch(config.corsUrl + apiurl)
        const json = await result.json()
        this.setState({
          predictions: json.predictions
        })
      } catch (err) {
        console.log('error', err)
      }
    } else {
      this.setState({
        isEnable: false, location: destination, destination: destination
      })
    }
  }
  async handleLocationData (description) {
    this.setState({
      isEnable: false,
      destination: description
    })
    let _this = this
    const apiurl = `https://maps.googleapis.com/maps/api/geocode/json?key=${config.googleMapsAPIKey}&address=${description}`
    try {
      const result = await fetch(apiurl)
      const json = await result.json()
      _this.setState({
        latitude: json.results[0].geometry.location.lat,
        longitude: json.results[0].geometry.location.lng
      })
      this.getAddressComponents(json.results[0].geometry.location.lat, json.results[0].geometry.location.lng)
    } catch (err) {
      // this.handleDataByLocation()
      console.log('err=====:', err)
    }
  }
  handleAllHotelsList (e) {
    let locationSearchObj = {
      area: this.state.area,
      city: this.state.city,
      state: this.state.state,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      checkInDate: this.state.checkInDate,
      checkOutDate: this.state.checkOutDate,
      guestAdultValue: this.state.guestAdultValue,
      child: this.state.child,
      guestRooms: this.state.guestRooms
    }
    let homePageData = {
      checkInDate: this.state.checkInDate,
      checkOutDate: this.state.checkOutDate,
      guestAdultValue: this.state.guestAdultValue,
      child: this.state.child,
      guestRooms: this.state.guestRooms
    }
    localStorage.setItem('homePageData', JSON.stringify(homePageData))
    localStorage.setItem('locationSearchObj', JSON.stringify(locationSearchObj))
    hashHistory.push('/hotels')
    e.preventDefault()
  }
  handleLoginClickInHeader (e) {
    let locationSearchObj = {
      area: this.state.area,
      city: this.state.city,
      state: this.state.state,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      checkInDate: this.state.checkInDate,
      checkOutDate: this.state.checkOutDate,
      guestAdultValue: this.state.guestAdultValue,
      child: this.state.child,
      guestRooms: this.state.guestRooms
    }
    let homePageData = {
      checkInDate: this.state.checkInDate,
      checkOutDate: this.state.checkOutDate,
      guestAdultValue: this.state.guestAdultValue,
      child: this.state.child,
      guestRooms: this.state.guestRooms
    }
    localStorage.setItem('homePageData', JSON.stringify(homePageData))
    localStorage.setItem('locationSearchObj', JSON.stringify(locationSearchObj))
    e.preventDefault()
  }
  handleGuestInc () {
    this.setState({ guestAdultValue: this.state.guestAdultValue + 1 })
  }
  handleGuestDec () {
    if (this.state.guestAdultValue !== 1 && this.state.guestAdultValue !== 0) {
      this.setState({ guestAdultValue: this.state.guestAdultValue - 1 })
    } else {
      this.setState({ guestAdultValue: 1 })
    }
  }
  handleGuestChildInc () {
    this.setState({ child: this.state.child + 1 })
  }
  handleGuestChildDec () {
    if (this.state.child === 0) {
    } else {
      this.setState({ child: this.state.child - 1 })
    }
  }

  handleGuestRoomsInc () {
    this.setState({ guestRooms: this.state.guestRooms + 1 })
  }
  handleGuestRoomsDec () {
    if (this.state.guestRooms !== 1 && this.state.guestRooms !== 0) {
      this.setState({ guestRooms: this.state.guestRooms - 1 })
    } else {
      this.setState({ guestRooms: 1 })
    }
  }
  handleCompare (item) {
    let info = this.state.spPropertyInfo
    let infoIDs = this.state.spPropertyIDs
    let i = infoIDs.indexOf(item._id)
    if (i === -1) {
      if (infoIDs.length >= 3) {
        alert(t`lanEULabelErrorCompareHostsLimit`)
      } else {
        infoIDs.push(item._id)
        info.push(item)
      }
    } else {
      infoIDs.splice(i, 1)
      info.splice(i, 1)
    }
    this.setState({ spPropertyIDs: infoIDs, spPropertyInfo: info })
    this.handleComparePopup()
  }
  handleComparePopup () {
    if (this.state.spPropertyIDs.length > 1 && this.state.spPropertyIDs.length <= 3) {
      this.setState({ modalIsOpen: true })
    } else if (this.state.spPropertyIDs.length === 1) {
      this.setState({ modalIsOpen: true })
    } else {
      this.setState({ modalIsOpen: false })
    }
  }
  closeModal () {
    this.setState({ modalIsOpen: false })
  }
  handleComparePage () {
    localStorage.setItem('spPropertyIDs', JSON.stringify(this.state.spPropertyIDs))
    localStorage.setItem('spPropertyInfo', JSON.stringify(this.state.spPropertyInfo))
    localStorage.setItem('backHome', 'homeScreen')
    hashHistory.push('/properties/compare')
  }
  handleCheckInDate = (checkInDate) => {
    let checkInDateValue = moment(checkInDate, 'YYYY-DD-MM').valueOf()
    let checkOutDateValue = moment(this.state.checkOutDate, 'YYYY-DD-MM').valueOf()
    if (checkInDateValue >= checkOutDateValue) {
      this.setState({ checkInDate: new Date(checkInDate), checkOutDate: new Date(moment(checkInDate).add(1, 'day').format('YYYY-MM-DD')) })
    } else {
      this.setState({ checkInDate: new Date(checkInDate) })
    }
  }
  handleHotelInfoView (e) {
    let homePageData = {
      checkInDate: this.state.checkInDate,
      checkOutDate: this.state.checkOutDate,
      guestAdultValue: this.state.guestAdultValue,
      child: this.state.child,
      guestRooms: this.state.guestRooms
    }
    localStorage.setItem('homePageData', JSON.stringify(homePageData))
    localStorage.setItem('EUPropertyInfoData', JSON.stringify(e))
    hashHistory.push('/hotels/booknow')
    event.preventDefault()
  }
  render () {
    // const { from, to } = this.state
    // const modifiers = { start: from, end: to }
    return (
      <div className='cozyspace' >
        {/* scroll down opening sticky navbar */}
        <div className='hidden-nav'>
          <div className={classnames('navbar navbar-top navbar-expand navbar-dark bg-primary border-bottom', { 'navbar--hidden': this.state.visible })} >
            <div className='container'>
              <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                <div className='logo-text'>
                  <img src={require('../../../../assets/logo-white.png')} className='logo-image' />
                  {/* <h1>AM to PM</h1> */}
                </div>
                {/* Navbar links */}
                <ul className='navbar-nav align-items-center ml-auto ml-md-auto'>
                  <li className='nav-item dropdown'>
                    <a onClick={this.handleBecomeHost} className='nav-link' href='' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                      Become Host
                      </a>
                  </li>
                  <li className='nav-item dropdown'>
                    <a onClick={this.handleSupport} className='nav-link' href='' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                      Support
                      </a>
                  </li>
                  <li className='nav-item dropdown'>
                    <a onClick={this.handleEnduserSignup} className='nav-link' href='' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                      Sign Up
                      </a>
                  </li>
                  <li className='nav-item dropdown'>
                    <a style={{ cursor: 'pointer' }} onClick={this.handleEndUserLogin} className='nav-link' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                      Login
                      </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={classnames('container-fluid sticky-filter', { 'navbar--hidden': this.state.visible })}>
            <div className='container'>
              <div className='card mb-0'>
                <div className='row'>
                  <div className='col-md-4 m-auto'>
                    <form>
                      <div className='form-group mb-0 pl-2'>
                        <div className='input-group col-sm-12 input-group-lg input-group-flush bg-white'>
                          <input type='search' className='form-control' placeholder='Search location ' value={this.state.location} onChange={this.handleTopbarSearchChange} required />
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className='col-md-2 text-left'>
                    <div className='landing-search-checkIn pt-1 pl-3'>
                      <label className='mb-0' >Check In</label>
                      <DatePicker
                        selected={this.state.checkInDate}
                        onChange={this.handleCheckInDate}
                        minDate={new Date()}
                        maxDate={addDays(new Date(), this.state.maxDate)}
                        className='filter'
                      />
                    </div>
                  </div>
                  <div className='col-md-2 text-left'>
                    <div className='landing-search-checkOut pt-1 pl-3'>
                      <label className='mb-0'>Check Out</label>
                      <DatePicker
                        selected={this.state.checkOutDate}
                        onChange={this.handleCheckOutDate}
                        minDate={new Date(this.state.checkInDate)}
                        maxDate={addDays(new Date(), this.state.maxDate)}
                        className='filter'
                      />
                    </div>
                  </div>
                  <div className='col-md-3 m-auto text-left'>
                    <a onClick={this.handleTopbarGuestsDropdown} >
                      <label value='large' className='guest-label pl-3'>{this.state.guestAdultValue} Guest, {this.state.guestRooms} Room</label>
                    </a>
                  </div>
                  <div className='col-sm-1 text-right'>
                    <div className='serch-big-btn'>
                      <button className='btn btn-lg landing-search-button' onClick={this.handleAllHotelsList}>
                        <i className='fa fa-search' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* scoll down sticky navbar closed */}
        {/* <MainHeader handleLoginClickInHeader={this.handleLoginClickInHeader} /> */}
        {/* {this.state.authObj && this.state.authObj.userRole === 'Customer' ? <MainHeader /> : this.state.authObj && this.state.authObj.userType ? <DrawerWithHeader /> : <HeaderWithoutLogin />} */}
        <main role='main' className='inner cover'>
          {/* social Icons start */}
          <nav className='social'>
            <ul>
              <li><a href='https://gmail.com/'> <i className='far fa-envelope' /></a></li>
              <li><a href='https://facebook.com/'> <i className='fa fa-facebook' /></a></li>
              <li><a href='https://twitter.com/'> <i className='fa fa-twitter' /></a></li>
              <li><a href='http://youtube.com/'> <i className='fab fa-youtube' /></a></li>
              <li><a href='http://googleplus.com/'> <i className='fab fa-linkedin-in' /></a></li>
            </ul>
          </nav>
          {/* social icons end */}
          <header>
            <video playsInline autoPlay='autoplay' muted='muted' loop='loop'>
              <source src={require('../../../../assets/videos/landing-video.mp4')} type='video/mp4' />
            </video>
            <div className='container h-100'>
              <div className='d-flex h-100 text-center align-items-center'>
                <div className='w-100 text-white'>
                  <h1 className='font-weight-extrabold-sq pb-3 mt-4'>HOTELS, RESORTS, HOMES & MORE </h1>
                  <div className='container'>
                    <div className='card mx-5 bg-self'>
                      <div className='row'>
                        <div className='col-md-4 m-auto'>
                          <form>
                            <div className='form-group mb-0 pl-2'>
                              <div className='input-group col-sm-12 bg-self input-group-lg input-group-flush'>
                                <input type='search' className='form-control text-white' placeholder='Search location ' value={this.state.location} onChange={this.handleSearchChange} required />
                              </div>
                            </div>
                          </form>
                        </div>
                        <div className='col-md-2 text-left'>
                          <div className='landing-search-checkIn pt-1 pl-3'>
                            <label className='mb-0 text-white' >Check In</label>
                            <DatePicker
                              selected={this.state.checkInDate}
                              onChange={this.handleCheckInDate}
                              minDate={new Date()}
                              maxDate={addDays(new Date(), this.state.maxDate)}
                              className='filter text-white'
                            />
                          </div>
                        </div>
                        <div className='col-md-2 text-left'>
                          <div className='landing-search-checkOut pt-1 pl-3'>
                            <label className='mb-0 text-white'>Check Out</label>
                            <DatePicker
                              selected={this.state.checkOutDate}
                              onChange={this.handleCheckOutDate}
                              minDate={new Date(this.state.checkInDate)}
                              maxDate={addDays(new Date(), this.state.maxDate)}
                              className='filter text-white'
                            />
                          </div>
                        </div>
                        <div className='col-md-3 m-auto text-left'>
                          <a onClick={this.handleGuestsDropdown} >
                            <label value='large' className='guest-label text-white pl-3'>{this.state.guestAdultValue} Guest, {this.state.guestRooms} Room</label>
                          </a>
                        </div>
                        <div className='col-sm-1 text-right'>
                          <div className='serch-big-btn'>
                            <button className='btn btn-lg landing-search-button' style={{ backgroundColor: '#025d8c' }} onClick={this.handleAllHotelsList}>
                              <i className='fa fa-search' />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          {/* dropdown for guests and rooms */}
          {this.state.guestDropdownActive === true
          ? <div className={classnames('overlay-guest-dropdown', { 'topbarGuestsDiv' : this.state.topbarGuests })}>
            <div className='guest-dropdown-div'>
              <div className='card-body'>
                <div className='row mb-2'>
                  <div className='col-sm-3 py-2 col-3'>Adults</div>
                  <div className='col-sm-3 col-3'>
                    <button className='circle-class' onClick={this.handleGuestDec} ><i className='fas fa-minus' style={{ color: 'black' }} /></button>
                  </div>
                  <div className='col-sm-3 col-3 py-2 text-center '><strong>{this.state.guestAdultValue} </strong></div>
                  <div className='col-sm-3 col-3'>
                    <button className='circle-class' onClick={this.handleGuestInc} ><i className='fas fa-plus' style={{ color: 'black' }} /></button>
                  </div>
                </div>
                <div className='row mb-2'>
                  <div className='col-sm-3 py-2 col-3'>Children</div>
                  <div className='col-sm-3 col-3'>
                    <button className='circle-class' onClick={this.handleGuestChildDec} ><i className='fas fa-minus' style={{ color: 'black' }} /></button>
                  </div>
                  <div className='col-sm-3 py-2 col-3 text-center '><strong>{this.state.child}</strong></div>
                  <div className='col-sm-3 col-3'>
                    <button className='circle-class' onClick={this.handleGuestChildInc} ><i className='fas fa-plus' style={{ color: 'black' }} /></button>
                  </div>
                </div>
                <div className='row mb-2'>
                  <div className='col-sm-3 py-2 col-3'>Rooms</div>
                  <div className='col-sm-3 col-3'>
                    <button className='circle-class' onClick={this.handleGuestRoomsDec} ><i className='fas fa-minus' style={{ color: 'black' }} /></button>
                  </div>
                  <div className='col-sm-3 py-2 text-center col-3'><strong>{this.state.guestRooms} </strong></div>
                  <div className='col-sm-3 col-3'>
                    <button className='circle-class' onClick={this.handleGuestRoomsInc} ><i className='fas fa-plus' style={{ color: 'black' }} /></button>
                  </div>
                </div>
                <div className='row mt-3'>
                  <div className='col-sm-12 text-right'>
                    <button className='btn btn-danger' onClick={() => this.setState({ guestDropdownActive: false })} > close</button>
                    <button className='btn btn-primary' onClick={this.handleApply} > Apply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        : null}
          {/* dropdown for search filter */}
          {this.state.isEnable
          ? <div className={classnames('overlay-search-bg animated bounce delay-2s', { 'topbarSeachDiv' : this.state.isEnableTopbar })}>
            <div className='search-bg-div'>
              <div className='card-body pt-1'>
                <div className='row mb-2'>
                  <div className='col-sm-12 text-right'>
                    <a onClick={() => this.setState({ isEnable: false })}><span><i className='fa fa-times' /></span></a>
                  </div>
                  <div className='col-sm-12'>
                    {this.state.predictions.map((predictions, index) => (
                      <a key={index} onClick={() => this.handleLocationData(predictions.description)}>
                        <div><label style={{ color: '#555' }} >{predictions.description}</label><br /></div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        : ''}
          {/* end of video theme landing section */}
          { /* =============All Places Tabs start ========================== */ }
          <section id='oe_tabs' className=''> <a className='tab-nav next-tab mobile-only-tabs'><i className='icon-font icon-arrow-right' /></a>
            <a className='tab-nav prev-tab mobile-only-tabs'><i className='icon-font icon-arrow-left' /></a>
            <div className='mobileTabs'>
              <ul className='slides'>
                <li onClick={this.handleAllTypeSelected} className={classnames('', { 'selected': this.state.typeSelect })}><a data-web-extend-tag='oe_p_all'>all</a>
                </li>
                <li onClick={this.handleCityTypeSelected} className={classnames('', { 'selected': this.state.typeSelectCity })} >
                  <a className='tab-city' data-web-extend-tag='City' data-web-extend-tag-method='3' data-web-extend-tag-prefix='oe_p'>City</a>
                </li>
                <li onClick={this.handleMountainPlacesTab} className={classnames('', { 'selected': this.state.typeSelectHill })} >
                  <a className='tab-mountain' data-web-extend-tag='Mountain' data-web-extend-tag-method='3' data-web-extend-tag-prefix='oe_p'>Hill Stations</a>
                </li>
                <li onClick={this.handleTraditionalTabSelected} className={classnames('', { 'selected': this.state.typeSelectTemple })} >
                  <a className='tab-alternative' data-web-extend-tag='Alternative' data-web-extend-tag-method='3' data-web-extend-tag-prefix='oe_p'>Temple Towns</a>
                </li>
                <li onClick={this.handleResortTypeSelected} className={classnames('', { 'selected': this.state.typeSelectResort })} >
                  <a className='tab-rejuvenate' data-web-extend-tag='Rejuvenate' data-web-extend-tag-method='3' data-web-extend-tag-prefix='oe_p'>Resorts</a>
                </li>
                <li onClick={this.handleBeachPlacesTab} className={classnames('', { 'selected': this.state.typeSelectRemote })} >
                  <a className='tab-beach' data-web-extend-tag='Beach' data-web-extend-tag-method='3' data-web-extend-tag-prefix='oe_p'>Remote Places</a>
                </li>
              </ul>
            </div>
          </section>
          {/* =============All Places Tabs end========================== */}
          {/* <!-- /.container --> */}
          {/* =============Most popular places ========================== */}
          <section className='pt-5 pb-2 bg-white most_landing'>
            {this.state.beachPlaces === true
              ? <div className='container'>
                <div className='row mb-2'>
                  <div className='col-md-12'>
                    <div className='typo-section-header-sq'>
                      <h2 className='text-align-center-sq'>Beach Places</h2>
                    </div>
                  </div>
                  <div className='col-md-12 d-lg-flex align-items-center justify-content-end'>
                    <a onClick={this.handleAllHotelsList} className='text-muted text-sm'>See all popular places<i className='fas fa-angle-double-right ml-2' />
                    </a>
                  </div>
                </div>
                <div className='row most-popular '>
                  <div id='myCarousel' className='carousel slide mb-2' data-ride='carousel'>
                    <ol className='carousel-indicators'>
                      <li data-target='#myCarousel' data-slide-to='0' className='active' />
                    </ol>
                    <div className='carousel-inner'>
                      <div className='carousel-item active'>
                        <div className='container'>
                          <div className='row'>
                            <div className='col-lg-3 col-sm-4 pb-2'>
                              <div className='img-div'>
                                <img className='img rounded' src={require('../../../../assets/all/b1.jpg')} alt='new-york' />
                                <div className='card-body overlay-content'>
                                  <div className='overlay-img-content'>
                                    <h6 className='card-title text-shadow text-uppercase'>New York</h6>
                                    <p className='card-text text-sm'>The big apple</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-lg-3 col-sm-4 pb-2 '>
                              <div className='img-div'>
                                <img className='img rounded' src={require('../../../../assets/all/b2.jpg')} alt='new-york' />
                                <div className='card-body overlay-content'>
                                  <div className='overlay-img-content'>
                                    <h6 className='card-title text-shadow text-uppercase'>Paris</h6>
                                    <p className='card-text text-sm'>The big apple</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-lg-3 col-sm-4 pb-2'>
                              <div className='img-div'>
                                <img className='img rounded' src={require('../../../../assets/all/b3.jpg')} alt='new-york' />
                                <div className='card-body overlay-content'>
                                  <div className='overlay-img-content'>
                                    <h6 className='card-title text-shadow text-uppercase'>New York</h6>
                                    <p className='card-text text-sm'>The big apple</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-lg-3 col-sm-4 pb-2'>
                              <div className='img-div'>
                                <img className='img rounded' src={require('../../../../assets/all/b4.jpg')} alt='new-york' />
                                <div className='card-body overlay-content'>
                                  <div className='overlay-img-content'>
                                    <h6 className='card-title text-shadow text-uppercase'>Hyderabad</h6>
                                    <p className='card-text text-sm'>The big apple</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <a className='carousel-control-prev' href='#myCarousel' role='button' data-slide='prev'>
                      <span className='carousel-control-prev-icon' aria-hidden='true' />
                      <span className='sr-only'>Previous</span>
                    </a>
                    <a className='carousel-control-next' href='#myCarousel' role='button' data-slide='next'>
                      <span className='carousel-control-next-icon' aria-hidden='true' />
                      <span className='sr-only'>Next</span>
                    </a>
                  </div>
                </div>
              </div>
              : this.state.mountainPlaces === true
                ? <div className='container'>
                  <div className='row mb-2'>
                    <div className='col-md-12'>
                      <div className='typo-section-header-sq'>
                        <h2 className='text-align-center-sq'>Mountain Places</h2>
                      </div>
                    </div>
                    <div className='col-md-12 d-lg-flex align-items-center justify-content-end'>
                      <a onClick={this.handleAllHotelsList} className='text-muted text-sm'>See all popular places<i className='fas fa-angle-double-right ml-2' />
                      </a>
                    </div>
                  </div>
                  <div className='row most-popular '>
                    <div id='myCarousel' className='carousel slide mb-2' data-ride='carousel'>
                      <ol className='carousel-indicators'>
                        <li data-target='#myCarousel' data-slide-to='0' className='active' />
                      </ol>
                      <div className='carousel-inner'>
                        <div className='carousel-item active'>
                          <div className='container'>
                            <div className='row'>
                              <div className='col-lg-3 col-sm-4 pb-2'>
                                <div className='img-div'>
                                  <img className='img rounded' src={require('../../../../assets/all/m1.jpg')} alt='new-york' />
                                  <div className='card-body overlay-content'>
                                    <div className='overlay-img-content'>
                                      <h6 className='card-title text-shadow text-uppercase'>New York</h6>
                                      <p className='card-text text-sm'>The big apple</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='col-lg-3 col-sm-4 pb-2'>
                                <div className='img-div'>
                                  <img className='img rounded' src={require('../../../../assets/all/m2.jpg')} alt='new-york' />
                                  <div className='card-body overlay-content'>
                                    <div className='overlay-img-content'>
                                      <h6 className='card-title text-shadow text-uppercase'>Paris</h6>
                                      <p className='card-text text-sm'>The big apple</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <a className='carousel-control-prev' href='#myCarousel' role='button' data-slide='prev'>
                        <span className='carousel-control-prev-icon' aria-hidden='true' />
                        <span className='sr-only'>Previous</span>
                      </a>
                      <a className='carousel-control-next' href='#myCarousel' role='button' data-slide='next'>
                        <span className='carousel-control-next-icon' aria-hidden='true' />
                        <span className='sr-only'>Next</span>
                      </a>
                    </div>
                  </div>
                </div>
                : <div className='container'>
                  <div className='row mb-2'>
                    <div className='col-md-12'>
                      <div className='typo-section-header-sq'>
                        <h2 className='text-align-center-sq'>Most Popular Places</h2>
                      </div>
                    </div>
                    <div className='col-md-12 d-lg-flex align-items-center justify-content-end'>
                      <a onClick={this.handleAllHotelsList} className='more-trigger pb-3 '>See all popular places<i className='fas fa-angle-double-right ml-2' />
                      </a>
                    </div>
                  </div>
                  <div className='row most-popular '>
                    <div id='myCarousel' className='carousel slide mb-2' data-ride='carousel'>
                      <ol className='carousel-indicators'>
                        <li data-target='#myCarousel' data-slide-to='0' className='active' />
                        <li data-target='#myCarousel' data-slide-to='1' />
                        <li data-target='#myCarousel' data-slide-to='2' />
                      </ol>
                      <div className='carousel-inner'>
                        <div className='carousel-item active'>
                          <div className='container'>
                            <div className='row'>
                              <div className='col-lg-3 col-sm-4 pb-2'>
                                <div className='img-div'>
                                  <img className='img rounded' src={require('../../../../assets/popular-cities/new-york.jpg')} alt='new-york' />
                                  <div className='card-body overlay-content'>
                                    <div className='overlay-img-content'>
                                      <h6 className='card-title text-shadow text-uppercase'>New York</h6>
                                      <p className='card-text text-sm'>The big apple</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='col-lg-3 col-sm-4 pb-2'>
                                <div className='img-div'>
                                  <img className='img rounded' src={require('../../../../assets/popular-cities/paris.jpg')} alt='new-york' />
                                  <div className='card-body overlay-content'>
                                    <div className='overlay-img-content'>
                                      <h6 className='card-title text-shadow text-uppercase'>Paris</h6>
                                      <p className='card-text text-sm'>The big apple</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='col-lg-3 col-sm-4 pb-2'>
                                <div className='img-div'>
                                  <img className='img rounded' src={require('../../../../assets/popular-cities/barcelona.jpg')} alt='new-york' />
                                  <div className='card-body overlay-content'>
                                    <div className='overlay-img-content'>
                                      <h6 className='card-title text-shadow text-uppercase'>New York</h6>
                                      <p className='card-text text-sm'>The big apple</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='col-lg-3 col-sm-4 pb-2'>
                                <div className='img-div'>
                                  <img className='img rounded' src={require('../../../../assets/popular-cities/charminar.jpg')} alt='new-york' />
                                  <div className='card-body overlay-content'>
                                    <div className='overlay-img-content'>
                                      <h6 className='card-title text-shadow text-uppercase'>Hyderabad</h6>
                                      <p className='card-text text-sm'>The big apple</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='carousel-item'>
                          <div className='container'>
                            <div className='row'>
                              <div className='col-lg-3 col-sm-4 pb-2'>
                                <div className='img-div'>
                                  <img className='img rounded' src={require('../../../../assets/popular-cities/banglore.jpg')} alt='new-york' />
                                  <div className='card-body overlay-content'>
                                    <div className='overlay-img-content'>
                                      <h6 className='card-title text-shadow text-uppercase'>New York</h6>
                                      <p className='card-text text-sm'>The big apple</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='col-lg-3 col-sm-4 pb-2'>
                                <div className='img-div'>
                                  <img className='img rounded' src={require('../../../../assets/popular-cities/bankok.jpg')} alt='new-york' />
                                  <div className='card-body overlay-content'>
                                    <div className='overlay-img-content'>
                                      <h6 className='card-title text-shadow text-uppercase'>New York</h6>
                                      <p className='card-text text-sm'>The big apple</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='col-lg-3 col-sm-4 pb-2'>
                                <div className='img-div'>
                                  <img className='img rounded' src={require('../../../../assets/popular-cities/new-delhi.jpg')} alt='new-york' />
                                  <div className='card-body overlay-content'>
                                    <div className='overlay-img-content'>
                                      <h6 className='card-title text-shadow text-uppercase'>New York</h6>
                                      <p className='card-text text-sm'>The big apple</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='col-lg-3 col-sm-4 pb-2'>
                                <div className='img-div'>
                                  <img className='img rounded' src={require('../../../../assets/popular-cities/new-york.jpg')} alt='new-york' />
                                  <div className='card-body overlay-content'>
                                    <div className='overlay-img-content'>
                                      <h6 className='card-title text-shadow text-uppercase'>New York</h6>
                                      <p className='card-text text-sm'>The big apple</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='carousel-item'>
                          <div className='container'>
                            <div className='row'>
                              <div className='col-lg-3 col-sm-4 pb-2'>
                                <div className='img-div'>
                                  <img className='img rounded' src={require('../../../../assets/popular-cities/new-york.jpg')} alt='new-york' />
                                  <div className='card-body overlay-content'>
                                    <div className='overlay-img-content'>
                                      <h6 className='card-title text-shadow text-uppercase'>New York</h6>
                                      <p className='card-text text-sm'>The big apple</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='col-lg-3 col-sm-4 pb-2'>
                                <div className='img-div'>
                                  <img className='img rounded' src={require('../../../../assets/popular-cities/paris.jpg')} alt='new-york' />
                                  <div className='card-body overlay-content'>
                                    <div className='overlay-img-content'>
                                      <h6 className='card-title text-shadow text-uppercase'>Paris</h6>
                                      <p className='card-text text-sm'>The big apple</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='col-lg-3 col-sm-4 pb-2'>
                                <div className='img-div'>
                                  <img className='img rounded' src={require('../../../../assets/popular-cities/barcelona.jpg')} alt='new-york' />
                                  <div className='card-body overlay-content'>
                                    <div className='overlay-img-content'>
                                      <h6 className='card-title text-shadow text-uppercase'>New York</h6>
                                      <p className='card-text text-sm'>The big apple</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='col-lg-3 col-sm-4 pb-2'>
                                <div className='img-div'>
                                  <img className='img rounded' src={require('../../../../assets/popular-cities/charminar.jpg')} alt='new-york' />
                                  <div className='card-body overlay-content'>
                                    <div className='overlay-img-content'>
                                      <h6 className='card-title text-shadow text-uppercase'>Hyderabad</h6>
                                      <p className='card-text text-sm'>The big apple</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <a className='carousel-control-prev' href='#myCarousel' role='button' data-slide='prev'>
                        <span className='carousel-control-prev-icon' aria-hidden='true' />
                        <span className='sr-only'>Previous</span>
                      </a>
                      <a className='carousel-control-next' href='#myCarousel' role='button' data-slide='next'>
                        <span className='carousel-control-next-icon' aria-hidden='true' />
                        <span className='sr-only'>Next</span>
                      </a>
                    </div>
                  </div>
                </div>
            }
          </section>
          {/* ===================== end most popular places ======================== */}
          {/* <EUHomePropertiesListComponent area={this.state.area} city={this.state.city} state={this.state.state}
             latitude={this.state.latitude} longitude={this.state.longitude} guestAdultValue={this.state.guestAdultValue} guestRooms={this.state.guestRooms} isActionDone={this.state.isActionDone} /> */}
          <div className='cozyspace' >
            {/* ======================= Best Deals section ================================ */}
            <div className=' container landing-hotel-list pt-4'>
              <div className='row mb-2'>
                <div className='col-md-12'>
                  <div className='typo-section-header-sq'>
                    <h2 className='text-align-center-sq'>{t`lanEULabelBestDeals`}</h2>
                  </div>
                </div>
                {this.state.SPPropertyList.length > 0
                ? <div className='col-md-12 d-lg-flex align-items-center justify-content-end'>
                  <a onClick={this.handleAllHotelsList} className='more-trigger pb-3  '>{t`lanEULabelSeeAllBestDeals`}<i className='fas fa-angle-double-right ml-2' />
                  </a>
                </div>
                : null }
              </div>
              <div className='row'>
                {this.state.SPPropertyList.length > 0 ? this.state.SPPropertyList.map((item, i) =>
                i < 6
                ? <div className='col-lg-4' key={i}>
                  <div className='room-wrapper'>
                    <div className='room-inner'>
                      <div className='room'>
                        <figure>
                          {/* <a className='avatar rounded-circle avatar-sm fav-icon' title='liked' style={{ backgroundColor: '#ffffff' }}>
                            <i className='fas fa-heart' />
                          </a> */}
                          <a onClick={() => this.handleHotelInfoView(item)} >
                            <img src={(item.propertyId && item.propertyId.imagePath) ? config.baseUrl + item.propertyId.imagePath : require('../../../../assets/property_big_05.jpg')} className='img-fluid' />
                            <div className='list-overlay' />
                          </a>
                          { this.state.SPPropertyList.length >= 2
                          ? this.state.spPropertyIDs && this.state.spPropertyIDs.length > 0 ? this.state.spPropertyIDs.map((data, i) =>
                            <a key={i} className='avatar rounded-circle avatar-sm compare-icon' style={{ backgroundColor: '#ffffff' }} onClick={() => this.handleCompare(item)}>
                              <img src={require('../../../../assets/compare.png')} title='compare' alt='compare' style={{ width: '20px', height: '20px' }} />
                            </a>
                          ) : <a className='avatar rounded-circle avatar-sm compare-icon' style={{ backgroundColor: '#ffffff' }} onClick={() => this.handleCompare(item)}>
                            <img src={require('../../../../assets/compare.png')} title='compare' alt='compare' style={{ width: '20px', height: '20px' }} />
                          </a>
                         : null }
                        </figure>
                        <div className='caption'>
                          <div className='txt1 hotelName'>{item.propertyTitle}</div>
                          {item.rating ? <div className='txt2'>
                            {/* {item.rating} */}
                            <div className='small-stars'>
                              <i className='fa fa-star' />
                              <i className='fa fa-star' />
                              <i className='fa fa-star' />
                              <i className='fa fa-star' />
                              <i className='fa fa-star' />
                            </div>
                          </div>
                          : <div className='txt2'>
                            {/* {item.rating} */}
                            <div className='no-stars-home'>
                              <i className='fa fa-star' />
                              <i className='fa fa-star' />
                              <i className='fa fa-star' />
                              <i className='fa fa-star' />
                              <i className='fa fa-star' />
                            </div>
                          </div>}
                          <div className='txt3 availables row'>
                            <div className='col-sm-6 col-6 py-1'>
                              <i className='fa fa-users pr-3' />
                              <span>{(item.propertyId && item.propertyId.propertyCapacity) ? item.propertyId.propertyCapacity : 0}</span>
                            </div>
                            <div className='col-sm-6 col-6 py-1' >
                              <div className='avatar avatar-xs pr-3'>
                                <img src={require('../../../../assets/available/doublebed.png')} />
                              </div>
                              <span>{(item.propertyId && item.propertyId.doubleBedsCount) ? item.propertyId.doubleBedsCount : 0}</span>
                            </div>
                            <div className='col-sm-6 col-6 py-1' >
                              <i className='fa fa-bath pr-3' />
                              <span>{(item.propertyId && item.propertyId.privateBathRooms) ? item.propertyId.privateBathRooms : 0}</span>
                            </div>
                            <div className='col-sm-6 col-6 py-1' >
                              <i className='fa fa-bed pr-3' />
                              <span>{(item.propertyId && item.propertyId.singleBedsCount) ? item.propertyId.singleBedsCount : 0}</span>
                            </div>
                          </div>
                          <div className='txt4'>
                            <a onClick={this.handleAllHotelsList}>VIEW DETAIL<i className='fa fa-caret-right' aria-hidden='true' /></a>
                          </div>
                        </div>
                        <div className='select-txt'>
                          <a onClick={() => this.handleHotelInfoView(item)}><span>SELECT THIS ROOM<i className='fa fa-angle-right' aria-hidden='true' /></span></a>
                        </div>
                        <div className='room-icons'>
                          {(item.amenities && item.amenities.length > 0)
                            ? item.amenities.map((data, i) => {
                              let amen = Amenities.find(amen => amen.name === data)
                              return (
                                i < 5
                                  ? <div className='room-ic room-ic-wifi' key={i}>
                                    <img src={config.baseUrl + amen.amenityIconPath} />
                                    <div className='txt1'>{amen.name}</div>
                                  </div> : ''
                              )
                            }) : null}
                          <div className='room-price'>
                            <div className='txt1'>₹<span>{item.pricing.basePrice}</span></div>
                            <div className='txt2'>PER NIGHT</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> : ''
                ) : <div className='container'>
                  <div className='row justify-content-center'>
                    <div className='col-sm-12 text-center my-3' >
                      <div className='no-data'><p>{t`lanCommonLabelNoResultsFound`}</p></div>
                    </div>
                  </div>
                </div>
                } {/* col end */}
              </div> {/* row end */}
              {this.state.SPPropertyList.length > 0
              ? <a href='' className='more-trigger pb-5' data-more={t`lanEULabelDiscoverAll`} onClick={this.handleAllHotelsList}>
                <i className='fas fa-chevron-circle-down' />
              </a>
              : ' '}
            </div>
          </div>
        </main>
        {/* <FooterComponent /> */}
        <Modal
          isOpen={this.state.modalIsOpen}
          style={customStyles}
        >
          <div className='container'>
            <div className='row py-2 modal-close' style={{ justifyContent: 'flex-end' }}>
              <a onClick={this.closeModal}><span><i className='fas fa-times' /></span></a>
            </div>
            <div className='col-sm-12 hotel-names-compare'>
              <p className='pb-0 eu-font'>You can Compare Up To Three Hotels </p>
              {this.state.spPropertyInfo && this.state.spPropertyInfo.length > 0 ? this.state.spPropertyInfo.map((item, i) =>
                <p className='eu-font' key={i}>
                  {item.propertyTitle },
                </p>
              ) : null}
            </div>
            {this.state.spPropertyIDs.length < 3
              ? <div className='col-sm-12 pb-3 add-hotel-to-compare' >
                <button className='circle-class-compare-add mr-2 eu-font' onClick={() => this.setState({ modalIsOpen: false })}>
                  <i className='fas fa-plus' style={{ color: 'green' }} />
                </button><span>{t`lanEUButtonAddHotelsToCompare`}</span>
              </div> : null}
            {this.state.spPropertyIDs.length === 1
            ? null
              : <div className='col-sm-12 text-left pb-5'>
                <button className='btn btn-primary eu-font' onClick={this.handleComparePage}>{t`lanEUButtonCompare`}</button>
              </div>
            }
          </div>
        </Modal>
      </div>
    )
  }
}

export default EUHomelandingPage
