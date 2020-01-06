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
// import Switch from 'react-switch'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class ServiceProviderEditTicket extends React.Component {
  constructor () {
    super()
    this.state = {
      open: false,
      position: 'left',
      noOverlay: true
    }
    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.onDrawerClose = this.onDrawerClose.bind(this)
    this.setPosition = this.setPosition.bind(this)
    this.setNoOverlay = this.setNoOverlay.bind(this)
    this.handleAddManually = this.handleAddManually.bind(this)
    this.handleViewTicket = this.handleViewTicket.bind(this)
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

  handleAddManually (event) {
    hashHistory.push('/AddProperty')
    event.preventDefault()
  }
  handleViewTicket (e) {
    hashHistory.push('/viewticket')
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
                      <a className='nav-link active' href='#navbar-dashboards' >
                        <i className='fas fa-home text-primary' />
                        <span className='nav-link-text'>Home</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' href='#navbar-dashboards' >
                        <i className='ni ni-building text-green' />
                        <span className='nav-link-text'>Property Listing</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' href='#navbar-dashboards' >
                        <i className='ni ni-pin-3 text-primary' />
                        <span className='nav-link-text'>Service Locations</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' href='#'>
                        <i className='ni ni-email-83 text-green' />
                        <span className='nav-link-text'>Inbox</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' href='#'>
                        <i className='ni ni-bullet-list-67 text-info' />
                        <span className='nav-link-text'>Bookings</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' href='#'>
                        <i className='far fa-star text-primary' />
                        <span className='nav-link-text'>Ratings & Reviews</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' href='#'>
                        <i className='fas fa-users text-info' />
                        <span className='nav-link-text'>Users</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' href='#'>
                        <i className='far fa-bell text-green' />
                        <span className='nav-link-text'>Notifications</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' href='#'>
                        <i className='far fa-heart text-red' />
                        <span className='nav-link-text'>Favourites</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' href='#'>
                        <i className='ni ni-circle-08 text-primary' />
                        <span className='nav-link-text'>Profile</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' href='#'>
                        <i className='ni ni-headphones text-info' />
                        <span className='nav-link-text'>Support</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' href='#'>
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
                  <h1>AM to PM</h1>
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
                      <a href='#!' className='dropdown-item text-center text-primary  py-3'>View all</a>
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
                          <img src={require('../images/team-4.jpg')} />
                        </span>
                        <div className='media-body ml-2 d-none d-lg-block'>
                          <span className='mb-0 text-sm '>John Snow</span>
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
                      <a href='#!' className='dropdown-item'>
                        <i className='fas fa-power-off' />
                        <span>Logout</span>
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div className='header bg-primary pb-6'>
            <div className='container'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    <h6 className='h2 text-white d-inline-block mb-0'>Edit Ticket</h6>
                  </div>
                  <div className='col-lg-6 col-5 text-right'>
                    {/* <a className='btn btn-sm btn-neutral'>Edit Ticket</a> */}
                    {/* <a href='#' className='btn btn-sm btn-neutral'>Filters</a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container mt--6 pb-3'>
            <div className='row justify-content-center notifictions'>
              <div className='col-lg-10 card-wrapper'>
                <div className='card mb-2'>
                  <div className='card-header'>
                    {/* List group */}
                    <ul className='list-group list-group-flush list my--3'>
                      <li className='list-group-item px-3 py-3'>
                        <div className='row align-items-center'>
                          <div className='col'>
                            <small>Ticket Number:</small>
                            <h5 className='mb-0'>NGSBNBT01</h5>
                          </div>
                          <div className='col'>
                            <small>Created By:</small>
                            <h5 className='mb-0'>Bahunya</h5>
                          </div>
                          <div className='col'>
                            <small>Created On:</small>
                            <h5 className='mb-0'>25Jun, 2019</h5>
                          </div>
                          <div className='col'>
                            <small>Status:</small>
                            <h5 className='mb-0'>Open</h5>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className='card-body'>
                    <section className='notifications'>
                      <div className='row clearfix'>
                        <div className='col-md-12 col-lg-12 col-xl-12'>
                          {/* List group */}
                          <div className='list-group list-group-flush'>
                            <form>
                              <div className='form-group'>
                                <label htmlFor='exampleFormControlTextarea1'>Ticket Query</label>
                                <textarea className='form-control' id='exampleFormControlTextarea1' rows='6'>
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                   quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                   quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </textarea>
                              </div>
                              <button className='btn btn-primary update-edit'>Update</button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className='footer mt-5'>
          <div className='container'>
            <div className='row align-items-center justify-content-lg-between'>
              <div className='col-lg-6'>
                <div className='copyright text-center text-lg-left'>AMtoPM © 2019 - All rights reserved.</div>
              </div>
              <div className='col-lg-6'>
                <ul className='nav nav-footer justify-content-center justify-content-lg-end'>
                  <li className='nav-item'>
                    <a href='#' className='nav-link' target='_blank'>About</a>
                  </li>
                  <li className='nav-item'>
                    <a href='#' className='nav-link' target='_blank'>Terms & Conditions</a>
                  </li>
                  <li className='nav-item'>
                    <a href='#' className='nav-link' target='_blank'>Privacy Policy</a>
                  </li>
                  <li className='nav-item'>
                    <a href='#' className='nav-link' target='_blank'>Site map</a>
                  </li>
                  <li className='nav-item'>
                    <a href='#' className='nav-link' target='_blank'>Trust & Safety</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}

export default ServiceProviderEditTicket
