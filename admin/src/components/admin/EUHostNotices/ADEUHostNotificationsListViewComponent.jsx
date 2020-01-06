/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import PropTypes from 'prop-types'
import { t } from 'ttag'

class ADHostNotificationsListViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      notificationObj: this.props.notificationData,
      notificationData: {},
      notificationMessage: '',
      notificationTitle: '',
      notificationStatus: '',
      notification: '',
      notificationList: []
    }
    this.handleHome = this.handleHome.bind(this)
    this.handleNotifications = this.handleNotifications.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleEUUsers = this.handleEUUsers.bind(this)
  }

  componentWillMount () {
    let notificationObj = this.state.notificationObj
    this.setState({
      notificationMessage: notificationObj.notificationMessage,
      notificationTitle: notificationObj.notificationTitle
    })
  }
  handleBack () {
    this.props.handleViewUser()
    event.preventDefault()
  }
  handleHome (event) {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleNotifications () {
    hashHistory.push('/admin/eu/notifications')
  }
  handleEUUsers () {
    localStorage.setItem('menuItem', 'EUUsers')
    hashHistory.push('admin/eu-users')
  }

  render () {
    return (
      <div className='main-content view-rating-page enduser' id='panel'>
        {/* ------- Navbar --------- */}
        <div className='header bg-primary pt-4 pb-5'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center  pb-5'>
                <div className='col-lg-6 col-7'>
                  {/* <h6 className='h2 text-white d-inline-block mb-0'>EndUsers-List</h6> */}
                  <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item active eu-font'><a onClick={this.handleEUUsers}>{t`lanEndUsersTitleList`}</a></li>
                      <li className='breadcrumb-item active eu-font'><a onClick={() => this.props.handleViewUser()}> Notifications List </a></li>
                      <li className='breadcrumb-item active' aria-current='page'>{t`lanADEUNotificationsView`}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container mt--6 pb-4'>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-10 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header bg-transparent px-5 pb-3 row'>
                  <h5 className='card-title col-sm-10'>{t`lanADEUNotificationsView`}</h5>
                </div>
                <div className='card-body'>
                  <section className='notifications'>
                    <div className='row clearfix'>
                      <div className='col-md-12 col-lg-12 col-xl-12'>
                        {/* List group */}
                        <div className='card-body'>
                          <ul className='list-group list-group-flush list my--3'>
                            <li className='list-group-item-one py-1'>
                              <div className='row align-items-center'>
                                <div className='col-lg-3'>
                                  <small>Notification Title</small>
                                </div>
                                <div className='col-lg-8'>
                                  <p className='mb-0 card-text'>
                                    {this.state.notificationTitle}
                                  </p>
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item-one py-1'>
                              <div className='row align-items-center'>
                                <div className='col-lg-3'>
                                  <small>Notification Message</small>
                                </div>
                                <div className='col-lg-8'>
                                  <p className='mb-0 card-text'>{this.state.notificationMessage}</p>
                                </div>
                              </div>
                            </li>
                          </ul>
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
    )
  }
}
ADHostNotificationsListViewComponent.propTypes = {
  notificationData: PropTypes.any,
  handleViewUser: PropTypes.any
}

export default ADHostNotificationsListViewComponent

