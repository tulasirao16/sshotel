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
import classnames from 'classnames'
import { saveLocale } from '../../../i18nInit'
import APICallManager from '../../../services/callmanager'
import { t } from 'ttag'

const myApi = axios.create()

class HeaderWithoutLogin extends React.Component {

  constructor (props) {
    super(props)
    let language = localStorage.getItem('language')
    this.state = {
      location: this.props.location ? this.props.location : '',
      startDate: new Date(),
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
    this.handleDateChange = this.handleDateChange.bind(this)
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
    this.handleClickOutside = this.handleClickOutside.bind(this)
    this.handleSupport1 = this.handleSupport1.bind(this)
  }
  componentWillMount () {
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    this.setState({ authObj: authObj })
    this.setState({ location: this.props.location })
    let obj = {
      unBlockStatus: true,
      url: config.baseUrl + config.getEUNotificationsUnReadCount }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ notificationsUnReadCount: resObj.data.statusResult })
      } else {
        _this.setState({ notificationsUnReadCount: 0 })
      }
    })
  }
  componentDidMount () {
    document.addEventListener('mousedown', this.handleClickOutside)
  }
  handleClickOutside (event) {
    this.setState({ open: false })
  }
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
  handleDateChange (date) {
    this.setState({
      startDate: date
    })
  }

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
      const apiurl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${config.googleMapsAPIKey}&input=${destination}&location=${this.state.latitude},${this.state.longitude}&radius=2000`
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
    const apiurl = `https://maps.googleapis.com/maps/api/geocode/json?key=${config.googleMapsAPIKey}&address=${description}`
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
            {this.state.isUserLogedin
              ? <div>
                <button
                  className='drawerTogglebtn'
                  onClick={this.toggleDrawer}
                  disabled={this.state.open && !this.state.noOverlay}
                  >
                  {!this.state.open ? <span><i className='fas fa-bars' /></span> : <span><i className='fas fa-times' /></span>}
                </button>
              </div>
              : ''}
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
              {!this.state.isUserLogedin
              ? <ul className='navbar-nav mr-auto'>
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
              : <ul className='navbar-nav align-items-center ml-md-0 mr-auto'>
                <li className='nav-item dropdown'>
                  <div className='dropdown'>
                    <a className='nav-link' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' id='navbarDropdownMenuLink2'>
                      <img src={require('../../serviceproviders/images/language.png')} className='lan-icon' /> <strong>{this.state.language}</strong>
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
                          <strong>{t`lanEUButtonHindi`}</strong>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className='nav-item'>
                  <a onClick={this.handleBecomeHost} className='nav-link'>
                    <span className='nav-link-inner--text'>{ t`lanEUButtonBecomeHost` } </span>
                  </a>
                </li>
                <li className='nav-item'>
                  <a className='nav-link'>
                    <span className='nav-link-inner--text'>{ t`lanEULabelSupport` }</span>
                  </a>
                </li>
                <li className='nav-item'>
                  <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Notifications' })} onClick={this.handleNotifications} >
                    <i className='far fa-bell text-green' />
                    <span className='badge badge-md notify badge-circle badge-floating badge-danger border-white'>{this.state.notificationsUnReadCount}</span>
                  </a>
                </li>
                <li className='nav-item dropdown'>
                  <a className='nav-link pr-3' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                    <div className='media align-items-center'>
                      <span className='avatar avatar-sm rounded-circle'>
                        <img src={(this.state.authObj && this.state.authObj.userIconPath) ? config.baseUrl + this.state.authObj.userIconPath
                        : require('../../../../assets/avatar_01.jpg')} />
                      </span>
                      <div className='media-body ml-2 d-none d-lg-block'>
                        <span className='mb-0 text-sm font-weight-bold'>{this.state.authObj.name ? this.state.authObj.name : this.state.authObj.displayName}</span>
                      </div>
                    </div>
                  </a>
                  <div className='dropdown-menu dropdown-menu-right'>
                    <div className='dropdown-header noti-title'>
                      <h6 className='text-overflow m-0'>{ t`lanEULabelWelcome` }!</h6>
                    </div>
                    <a onClick={this.handleEUProfile} className='dropdown-item'>
                      <i className='fas fa-user' />
                      <span>{ t`lanEUButtonMyprofile` }</span>
                    </a>
                    <a onClick={this.handleSupport} className='dropdown-item'>
                      <i className='far fa-life-ring' />
                      <span>{ t`lanEUButtonSupport` }</span>
                    </a>
                    <div className='dropdown-divider' />
                    <a onClick={this.handleLogout} className='dropdown-item'>
                      <i className='fas fa-power-off' />
                      <span>{ t`lanEUButtonLogOut` }</span>
                    </a>
                  </div>
                </li>
              </ul>
              }
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
