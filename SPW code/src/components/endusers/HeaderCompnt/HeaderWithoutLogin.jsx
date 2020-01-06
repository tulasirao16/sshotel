/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
// import APICallManager from '../../../services/callmanager'
// import { t } from 'ttag'
import '../home/Css/EULandingPage.css'
import '../../../css/carousel.css'
import '../../../css/theme.min.css'
import PropTypes from 'prop-types'
import './css/HeaderStyles.css'
import config from '../../../../public/config.json'
import axios from 'axios'
import { saveLocale } from '../../../i18nInit'
import APICallManager from '../../../services/callmanager'
import { t } from 'ttag'

const myApi = axios.create()

class HeaderWithoutLogin extends React.Component {
  _isMounted = false;
  // console.log(_isMounted)
  constructor (props) {
    super(props)
    let language = localStorage.getItem('language')
    this.state = {
      location: this.props.location ? this.props.location : '',
      startDate: new Date(),
      latitude: 17.432178,
      longitude: 78.123478,
      isOpen: true,
      hidden: false,
      predictions: [],
      isEnable: false,
      open: false,
      position: 'left',
      menuItem: 'Home',
      noOverlay: true,
      isUserLogedin: false,
      notificationsUnReadCount: 0,
      language: (language && language.length) ? language : 'English'
    }
    this.handleBecomeHost = this.handleBecomeHost.bind(this)
    this.handleAllHotelsList = this.handleAllHotelsList.bind(this)
    this.handleChange = this.handleChange.bind(this)
    // this.handleDateChange = this.handleDateChange.bind(this)
    this.handleEnduserSignup = this.handleEnduserSignup.bind(this)
    this.handleEndUserLogin = this.handleEndUserLogin.bind(this)
    this.handleEndUserHome = this.handleEndUserHome.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleLocationData = this.handleLocationData.bind(this)
    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.onDrawerClose = this.onDrawerClose.bind(this)
    this.handleHomePage = this.handleHomePage.bind(this)
    this.handleEUInbox = this.handleEUInbox.bind(this)
    this.handleEUBookings = this.handleEUBookings.bind(this)
    this.handleEUReviews = this.handleEUReviews.bind(this)
    this.handleEUNotifications = this.handleEUNotifications.bind(this)
    this.handleFavourites = this.handleFavourites.bind(this)
    this.handleSupport = this.handleSupport.bind(this)
    this.handleEUProfile = this.handleEUProfile.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleHostLogin = this.handleHostLogin.bind(this)
    this.handleNotifications = this.handleNotifications.bind(this)
    // this.handleClickOutside = this.handleClickOutside.bind(this)
    this.handleSupport1 = this.handleSupport1.bind(this)
  }
  componentWillMount () {
    this._isMounted = true
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    // this.setState({ authObj: authObj })
    // this.setState({ location: this.props.location })
    if (authObj && authObj.userAccount && this._isMounted) {
      this.setState({ authObj: authObj })
      this.setState({ location: this.props.location })
      let obj = {
        unBlockStatus: true,
        url: config.baseUrl + config.getEUNotificationsUnReadCount }
      let _this = this
      APICallManager.getCall(obj, function (resObj) {
        if (resObj && resObj.data && resObj.data.statusCode === '0000' && _this._isMounted) {
          _this.setState({ notificationsUnReadCount: resObj.data.statusResult })
        } else {
          if (_this._isMounted) {
            _this.setState({ notificationsUnReadCount: 0 })
          }
        }
      })
    }
  }
  // componentDidMount () {
  //   document.addEventListener('mousedown', this.handleClickOutside)
  // }
  componentWillUnmount () {
    this._isMounted = false
  }
  // handleClickOutside (event) {
  //   this.setState({ open: false })
  // }
  handleHostLogin () {
    hashHistory.push('/host/signin')
    event.preventDefault()
  }
  handleBecomeHost () {
    hashHistory.push('/host')
    event.preventDefault()
  }
  handleSupport1 (e) {
    hashHistory.push('/eu-support')
    e.preventDefault()
  }
  handleAllHotelsList () {
    hashHistory.push('/hotels')
    event.preventDefault()
  }
  handleChange (event) {
    this.setState({ location: event.target.value, startDate: event.target.value })
  }
  // handleDateChange (date) {
  //   this.setState({
  //     startDate: date
  //   })
  // }

  handleEnduserSignup (e) {
    hashHistory.push('/signup')
    e.preventDefault()
  }

  handleEndUserLogin (e) {
    hashHistory.push('/login')
    e.preventDefault()
  }
  handleEndUserHome () {
    hashHistory.push('/')
    event.preventDefault()
  }
  async handleSearchChange (event) {
    let destination = event.target.value
    if (event.target.value.trim().length) {
      this.setState({
        isEnable: true, location: destination, destination: destination
      })
      const apiurl = `${config.googleMapsPlaceAutoCompleteAPI}${config.googleMapsAPIKey}&input=${destination}&location=${this.state.latitude},${this.state.longitude}&radius=2000`
      try {
        const result = await fetch(config.corsUrl + apiurl)
        const json = await result.json()
        this.setState({
          predictions: json.predictions
        })
      } catch (err) {
        console.log('===Error:', err)
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
    const apiurl = `${config.googleMapsGeocodeAPI}${config.googleMapsAPIKey}&address=${description}`
    try {
      const result = await fetch(apiurl)
      const json = await result.json()
      _this.setState({
        latitude: json.results[0].geometry.location.lat,
        longitude: json.results[0].geometry.location.lng
      })
      this.props.getAddressComponents(json.results[0].geometry.location.lat, json.results[0].geometry.location.lng)
    } catch (err) {
      console.log('===Error:', err)
    }
  }
  toggleDrawer () {
    this.setState({ open: !this.state.open })
  }
  closeDrawer () {
    this.setState({ open: false })
  }
  onDrawerClose () {
    this.setState({ open: false })
  }
  handleHomePage () {
    localStorage.setItem('menuItem', 'Home')
    hashHistory.push('/hotels')
    event.preventDefault()
  }
  handleEUInbox () {
    localStorage.setItem('menuItem', 'Inbox')
    hashHistory.push('/inbox-list')
    event.preventDefault()
  }
  handleEUBookings () {
    localStorage.setItem('menuItem', 'Bookings')
    hashHistory.push('/bookings')
    event.preventDefault()
  }
  handleEUReviews () {
    localStorage.setItem('menuItem', 'Reviews')
    hashHistory.push('/reviewratings')
    event.preventDefault()
  }
  handleEUNotifications (event) {
    localStorage.setItem('menuItem', 'Notifications')
    if (this.props.drawerValue === 'notifications') {
      this.setState({ open: false })
    } else {
      hashHistory.push('/notifications-list')
    }
    event.preventDefault()
  }
  handleFavourites () {
    localStorage.setItem('menuItem', 'Favourites')
    hashHistory.push('/favourites')
    event.preventDefault()
  }
  handleEUProfile () {
    localStorage.setItem('menuItem', 'Profile')
    hashHistory.push('/profile')
    event.preventDefault()
  }
  handleSupport () {
    localStorage.setItem('menuItem', 'Support')
    hashHistory.push('/support')
    event.preventDefault()
  }
  handleLogout () {
    localStorage.clear()
    myApi.defaults.headers.token = null
    hashHistory.push('/login')
    event.preventDefault()
  }
  handleNotifications (e) {
    hashHistory.push('/notifications-list')
    event.preventDefault()
  }

  handleSelectLanguage = (val) => {
    let lang = val === 'te' ? 'Telugu' : val === 'en' ? 'English' : val === 'hn' ? 'Hindi' : ''
    this.setState({ language: lang })
    saveLocale(val)
    localStorage.setItem('language', lang)
    window.location.reload()
  }

  render () {
    return (
      <div className='eu-header'>
        <nav id='navbar-main' className='navbar navbar-horizontal navbar-transparent navbar-main navbar-expand-lg navbar-light'>
          <div className='container-fluid'>
            <a onClick={this.handleEndUserHome} >
              <div className='logo-text'>
                <img src={require('../../../../assets/logo-white.png')} className='logo-image' />
              </div>
            </a>
            {/* {this.state.isUserLogedin
              ? <div>
                <button
                  className='drawerTogglebtn'
                  onClick={this.toggleDrawer}
                  disabled={this.state.open && !this.state.noOverlay}
                  >
                  {!this.state.open ? <span><i className='fas fa-bars' /></span> : <span><i className='fas fa-times' /></span>}
                </button>
              </div>
              : ''} */}
            <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbar-collapse' aria-controls='navbar-collapse' aria-expanded='false' aria-label='Toggle navigation'>
              <span className='navbar-toggler-icon' />
            </button>
            <div className='navbar-collapse navbar-custom-collapse collapse ml-auto mr-0' id='navbar-collapse'>
              <div className='navbar-collapse-header'>
                <div className='row'>
                  <div className='col-9 collapse-brand'>
                    <div className='logo-text'>
                      <img src={require('../../../../assets/logo-white.png')} className='logo-image' />
                    </div>
                  </div>
                  <div className='col-3 pt-2 collapse-close'>
                    <button type='button' className='navbar-toggler' data-toggle='collapse' data-target='#navbar-collapse' aria-controls='navbar-collapse' aria-expanded='false' aria-label='Toggle navigation'>
                      <span />
                      <span />
                    </button>
                  </div>
                </div>
              </div>
              <ul className='navbar-nav mr-auto'>
                <li className='nav-item dropdown'>
                  <div className='dropdown'>
                    <a className='nav-link' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' id='navbarDropdownMenuLink2'>
                      <img src={require('../../serviceproviders/images/language.png')} className='lan-icon' /> {this.state.language}
                    </a>
                    <ul className='dropdown-menu' aria-labelledby='navbarDropdownMenuLink2'>
                      <li>
                        <a className='dropdown-item' onClick={() => this.handleSelectLanguage('te')}>
                          <strong>{t`lanEUButtonTelugu`}</strong>
                        </a>
                      </li>
                      <li>
                        <a className='dropdown-item' onClick={() => this.handleSelectLanguage('en')}>
                          <strong>{t`lanEUButtonEnglish`}</strong>
                        </a>
                      </li>
                      <li>
                        <a className='dropdown-item' onClick={() => this.handleSelectLanguage('hn')}>
                          <strong>{ t`lanEUButtonHindi` }</strong>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className='nav-item'>
                  <a onClick={this.handleHostLogin} className='nav-link' >
                    <span className='nav-link-inner--text'>{ t`lanEUButtonHostLogin` } </span>
                  </a>
                </li>
                <li className='nav-item'>
                  <a onClick={this.handleBecomeHost} className='nav-link'>
                    <span className='nav-link-inner--text'>{ t`lanEUButtonBecomeHost` } </span>
                  </a>
                </li>
                <li className='nav-item'>
                  <a onClick={this.handleSupport1} className='nav-link'>
                    <span className='nav-link-inner--text'>{ t`lanEUButtonSupport` }</span>
                  </a>
                </li>
                <li className='nav-item'>
                  <a onClick={this.handleEnduserSignup} className='nav-link'>
                    <span className='nav-link-inner--text'>{ t`lanEUButtonSignup` }</span>
                  </a>
                </li>
                <li className='nav-item'>
                  <a onClick={this.handleEndUserLogin} className='nav-link'>
                    <span className='nav-link-inner--text'>{ t`lanEUButtonLogin` }</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

HeaderWithoutLogin.propTypes = {
  location: PropTypes.any,
  getAddressComponents: PropTypes.any,
  drawerValue: PropTypes.any
}

export default HeaderWithoutLogin
