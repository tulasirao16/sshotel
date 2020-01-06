/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import ReactDrawer from 'react-drawer'
import { hashHistory } from 'react-router'
// import classnames from 'classnames'
import 'react-drawer/lib/react-drawer.css'

class DrawerWithHeader extends React.Component {
  constructor () {
    super()
    this.state = {
      open: false,
      position: 'left',
      menuItem: 'Home',
      noOverlay: true
    }
    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.onDrawerClose = this.onDrawerClose.bind(this)
    this.setPosition = this.setPosition.bind(this)
    this.setNoOverlay = this.setNoOverlay.bind(this)
    this.handleAddManually = this.handleAddManually.bind(this)
    this.handleSupport = this.handleSupport.bind(this)
    this.handleHomePage = this.handleHomePage.bind(this)
    this.handlePropertyList = this.handlePropertyList.bind(this)
    this.handleServiceLocations = this.handleServiceLocations.bind(this)
    this.handleSPInbox = this.handleSPInbox.bind(this)
    this.handleSPBookings = this.handleSPBookings.bind(this)
    this.handleSPReviews = this.handleSPReviews.bind(this)
    this.handleUsers = this.handleUsers.bind(this)
    this.handleNotifications = this.handleNotifications.bind(this)
    this.handleFavourites = this.handleFavourites.bind(this)
    this.handleSPProfile = this.handleSPProfile.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
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

  handleLogout () {
    localStorage.clear()
    hashHistory.push('/login')
    event.preventDefault()
  }

  handleAddManually (event) {
    hashHistory.push('/AddProperty')
    event.preventDefault()
  }
  handleSupport (e) {
    hashHistory.push('/support')
    event.preventDefault()
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
    hashHistory.push('/host/locations')
    event.preventDefault()
  }
  handleSPInbox () {
    hashHistory.push('/inbox-list')
    event.preventDefault()
  }
  handleSPBookings () {
    hashHistory.push('/host/bookings-history')
    event.preventDefault()
  }
  handleSPReviews (e) {
    hashHistory.push('/host/reviewratings')
    event.preventDefault()
  }
  handleUsers (e) {
    hashHistory.push('/host/users')
    event.preventDefault()
  }
  handleNotifications (e) {
    hashHistory.push('/Notifications')
    event.preventDefault()
  }
  handleFavourites (e) {
    hashHistory.push('/spfavourites')
    event.preventDefault()
  }
  handleSPProfile (e) {
    hashHistory.push('/SPProfile')
    event.preventDefault()
  }

  render () {
    return (
      <div className='eu-drawer'>
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
                      {/* <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Home' })} onClick={this.handleHomePage} > */}
                      <a className='nav-link active' onClick={this.handleHomePage} href='' >
                        <i className='fas fa-home text-primary' />
                        <span className='nav-link-text'>Home</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      {/* <a className={classnames('nav-link', { 'active': this.state.menuItem === 'Properties' })} onClick={this.handlePropertyList} > */}
                      <a className='nav-link' onClick={this.handlePropertyList} href='' >
                        <i className='ni ni-building text-green' />
                        <span className='nav-link-text'>Property Listing</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' onClick={this.handleServiceLocations} href='' >
                        <i className='ni ni-pin-3 text-primary' />
                        <span className='nav-link-text'>Service Locations</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' onClick={this.handleSPInbox} href='' >
                        <i className='ni ni-email-83 text-green' />
                        <span className='nav-link-text'>Inbox</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' onClick={this.handleSPBookings} href='' >
                        <i className='ni ni-bullet-list-67 text-info' />
                        <span className='nav-link-text'>Bookings</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' onClick={this.handleSPReviews} href='' >
                        <i className='far fa-star text-primary' />
                        <span className='nav-link-text'>Ratings & Reviews</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' onClick={this.handleUsers} href='' >
                        <i className='fas fa-users text-info' />
                        <span className='nav-link-text'>Users</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' onClick={this.handleNotifications} href='' >
                        <i className='far fa-bell text-green' />
                        <span className='nav-link-text'>Notifications</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' onClick={this.handleFavourites} href='' >
                        <i className='far fa-heart text-red' />
                        <span className='nav-link-text'>Favourites</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' onClick={this.handleSPProfile} href='' >
                        <i className='ni ni-circle-08 text-primary' />
                        <span className='nav-link-text'>Profile</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' onClick={this.handleSupport}>
                        <i className='ni ni-headphones text-info' />
                        <span className='nav-link-text'>Support</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' onClick={this.handleLogout} >
                        <i className='ni ni-button-power text-red' />
                        <span className='nav-link-text'>Logout</span>
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
            <div className='container'>
              <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                <div className='logo-text'>
                  <img src={require('../../../../assets/logo-white.png')} className='logo-image' />
                  {/* <h1>AM to PM</h1> */}
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
                    <a className='nav-link' href='#' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                      <i className='fas fa-bell' />
                    </a>
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
                              <img src={require('../../../../assets/team-1.jpg')} className='avatar rounded-circle' />
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
                              <img src={require('../../../../assets/team-2.jpg')} className='avatar rounded-circle' />
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
                              <img src={require('../../../../assets/profile-icon.png')} className='avatar rounded-circle' />
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
                              <img src={require('../../../../assets/team-4.jpg')} className='avatar rounded-circle' />
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
                              <img src={require('../../../../assets/team-1.jpg')} className='avatar rounded-circle' />
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
                          <img src={require('../../../../assets/team-4.jpg')} />
                        </span>
                        <div className='media-body ml-2 d-none d-lg-block'>
                          <span className='mb-0 text-sm font-weight-bold'>John Snow</span>
                        </div>
                      </div>
                    </a>
                    <div className='dropdown-menu dropdown-menu-right'>
                      <div className='dropdown-header noti-title'>
                        <h6 className='text-overflow m-0'>Welcome!</h6>
                      </div>
                      <a href='#!' className='dropdown-item'>
                        <i className='fas fa-user' />
                        <span>My profile</span>
                      </a>
                      <a href='#!' className='dropdown-item'>
                        <i className='fas fa-cog' />
                        <span>Settings</span>
                      </a>
                      <a href='#!' className='dropdown-item'>
                        <i className='far fa-calendar-alt' />
                        <span>Activity</span>
                      </a>
                      <a href='#!' className='dropdown-item'>
                        <i className='far fa-life-ring' />
                        <span>Support</span>
                      </a>
                      <div className='dropdown-divider' />
                      <a className='dropdown-item' onClick={this.handleLogout}>
                        <i className='fas fa-power-off' />
                        <span>Logout</span>
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
