/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import ReactDrawer from 'react-drawer'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import classnames from 'classnames'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
// import '../css/all.min.css'
// import '../css/argon.min.css'
// import '../css/nucleo.css'
import { t } from 'ttag'

// import { t } from 'ttag'
import { saveLocale } from '../../../i18nInit'

const setLocale = (locale) => (ev) => {
  ev.preventDefault()
  saveLocale(locale)
  window.location.reload()
}

// const LangSwitcher = () => (
//   <div className='Lang-switch'>
//     {/* <h2>{ t`Switch lang`}</h2> */}
//     <a href='/' onClick={setLocale('te')}>te</a>
//     <a href='/' onClick={setLocale('hn')}>hn</a>
//     <a href='/' onClick={setLocale('en')}>en</a>
//   </div>
// )

class DrawerWithHeader extends React.Component {
  constructor () {
    super()
    this.state = {
      open: false,
      authObj: JSON.parse(localStorage.getItem('authObj')),
      notificationsUnReadCount: 0,
      position: 'left',
      noOverlay: true,
      active: false,
      menuItem: 'Home'
    }
    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.onDrawerClose = this.onDrawerClose.bind(this)
    this.setPosition = this.setPosition.bind(this)
    this.setNoOverlay = this.setNoOverlay.bind(this)
    this.handleSupport = this.handleSupport.bind(this)
    this.handleHomePage = this.handleHomePage.bind(this)
    this.handlePropertyList = this.handlePropertyList.bind(this)
    this.handleServiceLocations = this.handleServiceLocations.bind(this)
    this.handleSPInbox = this.handleSPInbox.bind(this)
    this.handleSPBookings = this.handleSPBookings.bind(this)
    this.handleSPReviews = this.handleSPReviews.bind(this)
    this.handleUsers = this.handleUsers.bind(this)
    this.handleNotifications = this.handleNotifications.bind(this)
    // this.handleFavourites = this.handleFavourites.bind(this)
    this.handleSPProfile = this.handleSPProfile.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleNotification = this.handleNotification.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }
  componentWillMount () {
    const authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.userRole === 'Customer') {
      hashHistory.push('/fileNotFound')
    } else if (authObj && authObj.userType) {
      this.setState({ menuItem: localStorage.getItem('menuItem') })
      let obj = { url: config.baseUrl + config.getSPNotificationsUnReadCountAPI }
      let _this = this
      APICallManager.getCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({
            notificationsUnReadCount: resObj.data.statusResult
          })
        } else {
          _this.setState({
            notificationsUnReadCount: 0
          })
        }
      })
    } else {
      hashHistory.push('/host/signin')
    }
  }
  componentWillReceiveProps () {
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    this.setState({ authObj: authObj })
    let obj = { url: config.baseUrl + config.getSPNotificationsUnReadCountAPI }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          notificationsUnReadCount: resObj.data.statusResult
        })
      } else {
        _this.setState({
          notificationsUnReadCount: 0
        })
      }
    })
  }
  componentDidMount () {
    document.addEventListener('mousedown', this.handleClickOutside)
  }
  handleClickOutside () {
    this.setState({ open: false })
  }
  setPosition (e) {
    this.setState({ position: e.target.value })
  }
  setNoOverlay (e) {
    this.setState({ noOverlay: e.target.checked })
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

  handleHome () {
    hashHistory.push('/')
  }
  handleHomePage (e) {
    localStorage.setItem('menuItem', 'Home')
    hashHistory.push('/host/home')
    event.preventDefault()
  }
  handlePropertyList (e) {
    localStorage.setItem('menuItem', 'Properties')
    hashHistory.push('/host/properties')
    event.preventDefault()
  }
  handleServiceLocations (e) {
    localStorage.setItem('menuItem', 'Locations')
    hashHistory.push('/host/locations')
    event.preventDefault()
  }
  handleSPInbox (e) {
    localStorage.setItem('menuItem', 'Inbox')
    hashHistory.push('/host/inbox')
    event.preventDefault()
  }
  handleSPBookings (e) {
    localStorage.setItem('menuItem', 'Bookings')
    hashHistory.push('/host/bookings-history')
    event.preventDefault()
  }
  handleSPReviews (e) {
    localStorage.setItem('menuItem', 'Reviews')
    localStorage.setItem('homeReviewRating', 'False')
    hashHistory.push('/host/reviewratings')
    event.preventDefault()
  }
  handleUsers (e) {
    localStorage.setItem('menuItem', 'Users')
    hashHistory.push('/host/users')
    event.preventDefault()
  }
  handleNotifications (e) {
    localStorage.setItem('menuItem', 'Notifications')
    hashHistory.push('/host/notifications')
    event.preventDefault()
  }
  handleSupport (e) {
    localStorage.setItem('menuItem', 'Support')
    hashHistory.push('/host/support')
    event.preventDefault()
  }
  // handleFavourites (e) {
  //   localStorage.setItem('menuItem', 'Favourites')
  //   hashHistory.push('/host/favourites')
  //   event.preventDefault()
  // }
  handleSPProfile (e) {
    localStorage.setItem('menuItem', 'Profile')
    hashHistory.push('/host/user/profile')
    event.preventDefault()
  }
  handleLogout (event) {
    localStorage.clear()
    hashHistory.push('/host/signin')
    event.preventDefault()
  }
  handleNotification () {
    hashHistory.push('/host/notifications')
  }
  render () {
    return (
      <div>
        <ReactDrawer
          open={this.state.open}
          position={this.state.position}
          onClose={this.onDrawerClose}
          noOverlay={this.state.noOverlay}>
          <div className='close-drawer'>
            <span onClick={this.closeDrawer} className=''> <i className='fas fa-times' /> </span>
          </div>
          <nav className='sidenav navbar navbar-vertical fixed-left navbar-expand-xs navbar-light bg-white' id='sidenav-main'>
            <div className='scrollbar-inner'>
              <div className='navbar-inner'>
                {/* Collapse */}
                <div className='collapse navbar-collapse' id='sidenav-collapse-main'>
                  {/* Nav items */}
                  <ul className='navbar-nav'>
                    <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Home' })} onClick={this.handleHomePage} >
                        <i className='fas fa-home text-primary' />
                        <span className='nav-link-text'>{t`lanSPButtonHome`}</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Properties' })} onClick={this.handlePropertyList} >
                        <i className='ni ni-building text-green' />
                        <span className='nav-link-text'>{t`lanSPButtonProperties`}</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Locations' })} onClick={this.handleServiceLocations} >
                        <i className='ni ni-pin-3 text-primary' />
                        <span className='nav-link-text'>{t`lanSPButtonServiceLocations`}</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Inbox' })} onClick={this.handleSPInbox} >
                        <i className='ni ni-email-83 text-green' />
                        <span className='nav-link-text'>{t`lanSPButtonInbox`}</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Bookings' })} onClick={this.handleSPBookings} >
                        <i className='ni ni-bullet-list-67 text-info' />
                        <span className='nav-link-text'>{t`lanSPButtonBookings`}</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Reviews' })} onClick={this.handleSPReviews} >
                        <i className='far fa-star text-primary' />
                        <span className='nav-link-text'>{t`lanSPButtonRatings&Reviews`}</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Users' })} onClick={this.handleUsers} >
                        <i className='fas fa-users text-info' />
                        <span className='nav-link-text'>{t`lanSPButtonUsers`}</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Notifications' })} onClick={this.handleNotifications} >
                        <i className='far fa-bell text-green' />
                        <span className='nav-link-text'>{t`lanSPButtonNotifications`}</span>
                      </a>
                    </li>
                    {/* <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Favourites' })} onClick={this.handleFavourites} >
                        <i className='far fa-heart text-red' />
                        <span className='nav-link-text'>Favourites</span>
                      </a>
                    </li> */}
                    <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Profile' })} onClick={this.handleSPProfile} >
                        <i className='ni ni-circle-08 text-primary' />
                        <span className='nav-link-text'>{t`lanSPButtonProfile`}</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Support' })} onClick={this.handleSupport} >
                        <i className='ni ni-headphones text-info' />
                        <span className='nav-link-text'>{t`lanSPButtonSupport`}</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link'onClick={this.handleLogout} >
                        <i className='ni ni-button-power text-red' />
                        <span className='nav-link-text'>{t`lanSPButtonLogOut`}</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </ReactDrawer>
        <div className='main-content' id='panel'>
          {/* ------- Navbar --------- */}
          <nav className='sticky-top navbar navbar-top navbar-expand navbar-dark bg-primary border-bottom'>
            <div className='container-fluid'>
              <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                <div className='logo-text'>
                  <a onClick={this.handleHome}><h1>AM to PM</h1></a>
                </div>
                <div>
                  <button
                    className='leftnavbtn'
                    onClick={this.toggleDrawer}
                    disabled={this.state.open && !this.state.noOverlay}
                    >
                    {!this.state.open ? <span><i className='fas fa-bars' /></span> : <span><i className='fas fa-times' /></span>}
                  </button>
                </div>
                {/* Navbar links */}
                <ul className='navbar-nav align-items-center ml-auto ml-md-auto'>
                  <li className='nav-item dropdown'>
                    <div className='dropdown'>
                      <a className='nav-link' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' id='navbarDropdownMenuLink2'>
                        <img src={require('../../serviceproviders/images/US.png')} />
                      </a>
                      <ul className='dropdown-menu' aria-labelledby='navbarDropdownMenuLink2'>
                        <li>
                          <a className='dropdown-item' onClick={setLocale('te')}>
                            <img src={require('../../serviceproviders/images/DE.png')} /> Telugu
                          </a>
                        </li>
                        <li>
                          <a className='dropdown-item' onClick={setLocale('en')}>
                            <img src={require('../../serviceproviders/images/GB.png')} /> English(UK)
                          </a>
                        </li>
                        <li>
                          <a className='dropdown-item' onClick={setLocale('hn')}>
                            <img src={require('../../serviceproviders/images/FR.png')} /> Hindi
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className='nav-item dropdown'>
                    <a className='nav-link' role='button' onClick={this.handleNotification} >
                      <span> <i className='fas fa-bell' /></span>
                      <span className='badge badge-md notify badge-circle badge-floating badge-danger border-white'>{this.state.notificationsUnReadCount}</span>
                    </a>
                    {/* <button type='button' className='btn btn-primary' onClick={this.handleNotification}>
                      <span> <i className='fas fa-bell' /></span>
                      <span className='badge badge-md badge-circle badge-floating badge-danger border-white'>{this.state.notificationsUnReadCount}</span>
                    </button> */}
                    <div className='dropdown-menu dropdown-menu-xl dropdown-menu-right py-0 overflow-hidden'>
                      {/* Dropdown header */}
                      <div className='px-3 py-3'>
                        <h6 className='text-sm text-muted m-0'>You have <strong className='text-primary'>13</strong> notifications.</h6>
                      </div>
                      {/* List group */}
                      <div className='list-group list-group-flush'>
                        <a href='#!' className='list-group-item list-group-item-action'>
                          <div className='row align-items-center'>
                            <div className='col-auto'>
                              {/* Avatar */}
                              <img src={require('../images/team-1.jpg')} className='avatar rounded-circle' />
                            </div>
                            <div className='col-auto'>
                              <div className='d-flex justify-content-between align-items-center'>
                                <div>
                                  <h4 className='mb-0 text-sm'>John Snow </h4>
                                </div>
                                <div className='text-right text-muted'>
                                  <small>2 hrs ago</small>
                                </div>
                              </div>
                              <p className='text-sm mb-0'>Let's meet at Starbucks at 11:30. Wdyt?</p>
                            </div>
                          </div>
                        </a>
                        <a href='#!' className='list-group-item list-group-item-action'>
                          <div className='row align-items-center'>
                            <div className='col-auto'>
                              {/* Avatar */}
                              <img src={require('../images/team-2.jpg')} className='avatar rounded-circle' />
                            </div>
                            <div className='col-auto'>
                              <div className='d-flex justify-content-between align-items-center'>
                                <div>
                                  <h4 className='mb-0 text-sm'>John Snow</h4>
                                </div>
                                <div className='text-right text-muted'>
                                  <small>3 hrs ago</small>
                                </div>
                              </div>
                              <p className='text-sm mb-0'>A new issue has been reported for Argon.</p>
                            </div>
                          </div>
                        </a>
                        <a href='#!' className='list-group-item list-group-item-action'>
                          <div className='row align-items-center'>
                            <div className='col-auto'>
                              {/* Avatar */}
                              <img src={require('../images/profile-icon.png')} className='avatar rounded-circle' />
                            </div>
                            <div className='col-auto'>
                              <div className='d-flex justify-content-between align-items-center'>
                                <div>
                                  <h4 className='mb-0 text-sm'>John Snow</h4>
                                </div>
                                <div className='text-right text-muted'>
                                  <small>5 hrs ago</small>
                                </div>
                              </div>
                              <p className='text-sm mb-0'>Your posts have been liked a lot.</p>
                            </div>
                          </div>
                        </a>
                        <a href='#!' className='list-group-item list-group-item-action'>
                          <div className='row align-items-center'>
                            <div className='col-auto'>
                              {/* Avatar */}
                              <img src={require('../images/team-4.jpg')} className='avatar rounded-circle' />
                            </div>
                            <div className='col-auto'>
                              <div className='d-flex justify-content-between align-items-center'>
                                <div>
                                  <h4 className='mb-0 text-sm'>John Snow</h4>
                                </div>
                                <div className='text-right text-muted'>
                                  <small>2 hrs ago</small>
                                </div>
                              </div>
                              <p className='text-sm mb-0'>Let's meet at Starbucks at 11:30. Wdyt?</p>
                            </div>
                          </div>
                        </a>
                        <a href='#!' className='list-group-item list-group-item-action'>
                          <div className='row align-items-center'>
                            <div className='col-auto'>
                              {/* Avatar */}
                              <img src={require('../images/team-5.jpg')} className='avatar rounded-circle' />
                            </div>
                            <div className='col-auto'>
                              <div className='d-flex justify-content-between align-items-center'>
                                <div>
                                  <h4 className='mb-0 text-sm'>John Snow</h4>
                                </div>
                                <div className='text-right text-muted'>
                                  <small>3 hrs ago</small>
                                </div>
                              </div>
                              <p className='text-sm mb-0'>A new issue has been reported for Argon.</p>
                            </div>
                          </div>
                        </a>
                      </div>
                      {/* View all */}
                      <a href='#!' className='dropdown-item text-center text-primary font-weight-bold py-3'>View all</a>
                    </div>
                  </li>
                  <li className='nav-item dropdown'>
                    <a className='nav-link' href='#' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                      <i className='fas fa-object-ungroup' />
                    </a>
                    <div className='dropdown-menu dropdown-menu-lg dropdown-menu-dark bg-default dropdown-menu-right'>
                      <div className='row shortcuts px-4'>
                        <a href='#!' className='col-4 shortcut-item'>
                          <span className='shortcut-media avatar rounded-circle bg-gradient-red'>
                            <i className='far fa-calendar-alt' />
                          </span>
                          <small>Calendar</small>
                        </a>
                        <a href='#!' className='col-4 shortcut-item'>
                          <span className='shortcut-media avatar rounded-circle bg-gradient-orange'>
                            <i className='far fa-envelope' />
                          </span>
                          <small>Email</small>
                        </a>
                        <a href='#!' className='col-4 shortcut-item'>
                          <span className='shortcut-media avatar rounded-circle bg-gradient-info'>
                            <i className='far fa-credit-card' />
                          </span>
                          <small>Payments</small>
                        </a>
                        <a href='#!' className='col-4 shortcut-item'>
                          <span className='shortcut-media avatar rounded-circle bg-gradient-green'>
                            <i className='fas fa-books' />
                          </span>
                          <small>Reports</small>
                        </a>
                        <a href='#!' className='col-4 shortcut-item'>
                          <span className='shortcut-media avatar rounded-circle bg-gradient-purple'>
                            <i className='fas fa-map-marker-alt' />
                          </span>
                          <small>Maps</small>
                        </a>
                        <a href='#!' className='col-4 shortcut-item'>
                          <span className='shortcut-media avatar rounded-circle bg-gradient-yellow'>
                            <i className='fas fa-shopping-basket' />
                          </span>
                          <small>Shop</small>
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
                <ul className='navbar-nav align-items-center ml-md-0'>
                  <li className='nav-item dropdown'>
                    <a className='nav-link pr-0' href='#' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                      <div className='media align-items-center'>
                        <span className='avatar avatar-sm rounded-circle'>
                          <img src={(this.state.authObj && this.state.authObj.userIconPath) ? config.baseUrl + this.state.authObj.userIconPath
                            : require('../images/profile-icon.png')} />
                        </span>
                        <div className='media-body ml-2 d-none d-lg-block'>
                          <span className='mb-0 text-sm font-weight-bold'>{(this.state.authObj && this.state.authObj.displayName) ? this.state.authObj.displayName : 'Guest'}</span>
                        </div>
                      </div>
                    </a>
                    <div className='dropdown-menu dropdown-menu-right'>
                      <div className='dropdown-header noti-title'>
                        <h6 className='text-overflow m-0'>{t`lanSPTitleWelcome`}!</h6>
                      </div>
                      <a onClick={this.handleSPProfile} className='dropdown-item'>
                        <i className='fas fa-user' />
                        <span>{t`lanSPButtonMyprofile`}</span>
                      </a>
                      <a href='#' className='dropdown-item'>
                        <i className='fas fa-cog' />
                        <span>{t`lanSPButtonSettings`}</span>
                      </a>
                      <a href='#' className='dropdown-item'>
                        <i className='far fa-calendar-alt' />
                        <span>{t`lanSPButtonActivity`}</span>
                      </a>
                      <a onClick={this.handleSupport} className='dropdown-item'>
                        <i className='far fa-life-ring' />
                        <span>{t`lanSPButtonSupport`}</span>
                      </a>
                      <div className='dropdown-divider' />
                      <a className='dropdown-item' onClick={this.handleLogout}>
                        <i className='fas fa-power-off' />
                        <span>{t`lanSPButtonLogOut`}</span>
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    )
  }
}

export default DrawerWithHeader
