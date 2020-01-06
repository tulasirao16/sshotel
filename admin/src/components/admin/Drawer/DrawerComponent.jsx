/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import ReactDrawer from 'react-drawer'
import { hashHistory } from 'react-router'
import config from '../../../../public/config.json'
import 'react-drawer/lib/react-drawer.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import PropTypes from 'prop-types'

class DrawerWithHeader extends React.Component {
  constructor () {
    super()
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    this.state = {
      authObj: authObj,
      open: false,
      position: 'left',
      noOverlay: true,
      menuItem: 'Home'
    }
    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.onDrawerClose = this.onDrawerClose.bind(this)
    this.setPosition = this.setPosition.bind(this)
    this.setNoOverlay = this.setNoOverlay.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleAdminUsers = this.handleAdminUsers.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleEUUsers = this.handleEUUsers.bind(this)
    this.handleNavigateToInbox = this.handleNavigateToInbox.bind(this)
    this.handleNotifications = this.handleNotifications.bind(this)
    this.handleReview = this.handleReview.bind(this)
    this.handleHosts = this.handleHosts.bind(this)
    this.handleProfile = this.handleProfile.bind(this)
    this.handleCreateBooking = this.handleCreateBooking.bind(this)
    this.handleTickets = this.handleTickets.bind(this)
  }
  componentWillMount () {
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    let menuItem = localStorage.getItem('menuItem')
    if (menuItem) {
      this.setState({ menuItem })
    }
    if (!authObj || (authObj && (authObj.userRole === 'Customer' || authObj.userType))) {
      hashHistory.push('/admin')
    }
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.onDrawerClose)
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
    if (this.state.open) {
      this.setState({ open: false })
    }
  }
  handleHome () {
    localStorage.setItem('menuItem', 'Home')
    localStorage.removeItem('adminUserStatus')
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleAdminUsers () {
    localStorage.setItem('menuItem', 'AdminUsers')
    localStorage.removeItem('adminUserStatus')
    hashHistory.push('admin/users')
    event.preventDefault()
  }
  handleHosts () {
    localStorage.setItem('menuItem', 'Hosts')
    hashHistory.push('/admin/hosts')
  }
  handleProfile () {
    localStorage.setItem('menuItem', 'Profile')
    hashHistory.push('/admin/profile')
    event.preventDefault()
  }
  handleEUUsers () {
    localStorage.setItem('menuItem', 'EUUsers')
    hashHistory.push('admin/eu-users')
  }
  handleCreateBooking () {
    localStorage.removeItem('userData')
    localStorage.setItem('menuItem', 'CreateBooking')
    hashHistory.push('/admin/eu/home')
  }
  handleBookingHistory () {
    localStorage.setItem('menuItem', 'BookingHistory')
    hashHistory.push('/admin/bookinghistory')
  }
  handleNavigateToInbox () {
    localStorage.setItem('menuItem', 'NavigateToInbox')
    hashHistory.push('admin/host-inbox')
  }
  handleReview () {
    localStorage.setItem('menuItem', 'Review')
    hashHistory.push('/admin/hosts/review-ratings')
  }
  handleNotifications () {
    localStorage.setItem('menuItem', 'Notifications')
    // localStorage.removeItem('adminUserStatus')
    hashHistory.push('/admin/hosts/notifications')
    // event.preventDefault()
  }
  handleTickets () {
    localStorage.setItem('menuItem', 'Tickets')
    hashHistory.push('/admin/tickets')
    event.preventDefault()
  }
  handleLogout () {
    localStorage.clear()
    hashHistory.push('/admin')
  }
  handleTicketsDashboard () {
    localStorage.setItem('menuItem', 'Tickets Dashboard')
    hashHistory.push('/admin/tickets/dashboard')
    event.preventDefault()
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
                      <a onClick={this.handleHome} className={this.state.menuItem === 'Home' ? 'nav-link active' : 'nav-link'} >
                        <i className='fas fa-home text-primary' />
                        <span className='nav-link-text'>Home</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a onClick={this.handleAdminUsers} className={this.state.menuItem === 'AdminUsers' ? 'nav-link active' : 'nav-link'}>
                        <i className='fa fa-users text-green' />
                        <span className='nav-link-text'>Admin Users</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className={this.state.menuItem === 'Tickets Dashboard' ? 'nav-link active' : 'nav-link'} onClick={this.handleTicketsDashboard}>
                        <i className='fa fa-ticket text-info' />
                        <span className='nav-link-text'>Tickets Dashboard</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className={this.state.menuItem === 'Tickets' ? 'nav-link active' : 'nav-link'} onClick={this.handleTickets}>
                        <i className='fa fa-ticket text-warning' />
                        <span className='nav-link-text'>Tickets</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className={this.state.menuItem === 'Hosts' ? 'nav-link active' : 'nav-link'} onClick={this.handleHosts}>
                        <i className='fas fa-users-cog text-primary' />
                        <span className='nav-link-text'>Hosts</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a onClick={this.handleEUUsers} className={this.state.menuItem === 'EUUsers' ? 'nav-link active' : 'nav-link'}>
                        <i className='fas fa-users text-info' />
                        <span className='nav-link-text'>End Users</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a onClick={this.handleCreateBooking} className={this.state.menuItem === 'CreateBooking' ? 'nav-link active' : 'nav-link'}>
                        <i className='fa fa-plus-circle text-green' />
                        <span className='nav-link-text'>Create Booking</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a onClick={this.handleBookingHistory} className={this.state.menuItem === 'BookingHistory' ? 'nav-link active' : 'nav-link'}>
                        <i className='ni ni-bullet-list-67 text-info' />
                        <span className='nav-link-text'>Booking History</span>
                      </a>
                    </li>
                    {/* <li className='nav-item'>
                      <a className={this.state.menuItem === 'NavigateToInbox' ? 'nav-link active' : 'nav-link'} onClick={this.handleNavigateToInbox}>
                        <i className='ni ni-email-83 text-green' />
                        <span className='nav-link-text'>Inbox</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className={this.state.menuItem === 'Review' ? 'nav-link active' : 'nav-link'} onClick={this.handleReview}>
                        <i className='far fa-star text-primary' />
                        <span className='nav-link-text'>Ratings & Reviews</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className={this.state.menuItem === 'Notifications' ? 'nav-link active' : 'nav-link'} onClick={this.handleNotifications}>
                        <i className='far fa-bell text-green' />
                        <span className='nav-link-text'>Notifications</span>
                      </a>
                    </li> */}
                    <li className='nav-item'>
                      <a className={this.state.menuItem === 'Profile' ? 'nav-link active' : 'nav-link'} onClick={this.handleProfile}>
                        <i className='ni ni-circle-08 text-primary' />
                        <span className='nav-link-text'>Profile</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a onClick={this.handleLogout} className='nav-link' >
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
            <div className='container-fluid'>
              <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                <div className='logo-text'>
                  <a onClick={this.handleHome}>
                    <img src={require('../../../../assets/logo.png')} className='logo-image' />
                  </a>
                </div>
                <div>
                  <button
                    className='leftnavbtn'
                    onClick={this.toggleDrawer}
                    disabled={this.state.open && !this.state.noOverlay}
                    >
                    {!this.state.open ? <span><i className='fas fa-bars text-white' /></span> : <span><i className='fas fa-times' /></span>}
                  </button>
                </div>
                {/* Navbar links */}
                <ul className='navbar-nav align-items-center ml-auto ml-md-auto'>
                  <li className='nav-item'>
                    {/* <a className='nav-link' href='#' >
                      <i className='fas fa-bell' />
                    </a> */}
                  </li>
                </ul>
                <ul className='navbar-nav align-items-center ml-md-0'>
                  <li className='nav-item dropdown'>
                    <a className='nav-link pr-0' href='#' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                      <div className='media align-items-center'>
                        <span className='avatar avatar-sm rounded-circle'>
                          <img src={this.props.updatePic ? this.props.updatePic : (this.state.authObj && this.state.authObj.userIconPath) ? config.baseUrl + this.state.authObj.userIconPath
                           : require('../images/profile-icon.png')} />
                        </span>
                        <div className='media-body ml-2 d-none d-lg-block'>
                          <span className='mb-0 text-sm font-weight-bold'>{this.state.authObj && this.state.authObj.name ? this.state.authObj.name : 'Guest User'}</span>
                        </div>
                      </div>
                    </a>
                    <div className='dropdown-menu dropdown-menu-right'>
                      <div className='dropdown-header noti-title'>
                        <h6 className='text-overflow m-0'>Welcome!</h6>
                      </div>
                      <a href='#' className='dropdown-item' onClick={this.handleProfile} >
                        <i className='fas fa-user' />
                        <span>My profile</span>
                      </a>
                      <a href='#' className='dropdown-item' onClick={this.handleTicketsDashboard} >
                        <i className='far fa-life-ring' />
                        <span>Support</span>
                      </a>
                      <div className='dropdown-divider' />
                      <a onClick={this.handleLogout} className='dropdown-item'>
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
DrawerWithHeader.propTypes = {
  updatePic:PropTypes.any
}
export default DrawerWithHeader
