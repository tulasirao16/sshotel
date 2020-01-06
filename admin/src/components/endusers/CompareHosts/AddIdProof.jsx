/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import ReactDrawer from 'react-drawer'
import { hashHistory } from 'react-router'
import './css/Profile.css'

class CompareHost extends React.Component {
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

  render () {
    return (
      <div style={{ fontFamily: 'Lato' }}>
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
                        <i className='ni ni-bullet-list-67 text-primary' />
                        <span className='nav-link-text'>Add ID Proof</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' href='#navbar-dashboards' >
                        <i className='ni ni ni-bell-55 text-green' />
                        <span className='nav-link-text'>Prefertence</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' href='#navbar-dashboards' >
                        <i className='ni ni ni-email-83 text-primary' />
                        <span className='nav-link-text'>Feedback</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' href='#'>
                        <i className='ni ni-calendar-grid-58 text-green' />
                        <span className='nav-link-text'>Get Support</span>
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a className='nav-link' href='#'>
                        <i className='ni ni-money-coins text-info' />
                        <span className='nav-link-text'>Log Out</span>
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
                      Become Host
                    </a>
                  </li>
                  <li className='nav-item dropdown'>
                    <a className='nav-link' href='#' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                      Support
                    </a>
                  </li>
                </ul>
                <ul className='navbar-nav align-items-center ml-md-0'>
                  <li className='nav-item dropdown'>
                    <a className='nav-link pr-0' href='#' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                      <div className='media align-items-center'>
                        <span className='avatar avatar-sm rounded-circle'>
                          <img src={require('../../../../assets/avatar_01.jpg')} />
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
          <div className='container-fluid mt-5 pb-5'>
            <div className='row'>
              <div className='col-lg-12'>
                <div className='compare-host'>
                  <div className='card'>
                    <div className='card-header card-header-danger'>
                      <h4 className='card-title'>Compare Host</h4>
                      <p className='card-category'>You can compare up to 3 hosts</p>
                    </div>
                    <div className='card-body'>
                      <table className='table table-bordered'>
                        <thead>
                          <tr>
                            <th scope='col'>AMENITIES</th>
                            <th scope='col'>Host One</th>
                            <th scope='col'>Host Two</th>
                            <th scope='col'>Host Three</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope='row'>1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                          </tr>
                          <tr>
                            <th scope='row'>2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                          </tr>
                          <tr>
                            <th scope='row'>3</th>
                            <td colSpan='2'>Larry the Bird</td>
                            <td>@twitter</td>
                          </tr>
                        </tbody>
                      </table>
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
      </div>
    )
  }
}

export default CompareHost
