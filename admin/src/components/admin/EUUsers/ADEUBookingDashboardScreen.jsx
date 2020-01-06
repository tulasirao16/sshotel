/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
// import PropTypes from 'prop-types'

import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
import APICallManager from '../../../services/callmanager'
import '../../../components/admin/css/all.min.css'
import '../../../components/admin/css/argon.min.css'
import '../../../components/admin/css/nucleo.css'
import config from '../../../../public/config.json'
// import ADUsersListComponent from '../../../components/admin/Users/ADUsersLIstComponent'

class ADEUBookingDashboardScreen extends React.Component {
  constructor () {
    super()
    this.state = {
      status: '',
      ActiveUsers: 0,
      inActiveUsers: 0,
      homeCounts:[],
      usersList: [],
      bookingsBookedCount: 0,
      bookingsConfirmedCount: 0,
      bookingsCheckInsCount: 0,
      bookingsCheckOutsCount: 0,
      bookingsCancelledCount: 0,
      bookingsexpiredBookedCount: 0,
      bookingsexpiredConfirmedCount: 0,
      bookingsexpiredCheckInsCount: 0,
      bookingsexpiredCheckOutsCount: 0,
      bookingsexpiredCancelledCount: 0,
      bookingsCompletedCount: 0,
      BookedAmount: 0,
      ConfirmedAmount: 0,
      CheckInsAmount: 0,
      CheckOutsAmount: 0,
      CompletedAmount: 0,
      CancelledAmount: 0,
      messagesCount: 0,
      reviewsCount: 0,
      notificationsUnreadCount: 0
    }
    this.handleUsersListByStatus = this.handleUsersListByStatus.bind(this)
    this.handleBookingsCount = this.handleBookingsCount.bind(this)
    this.handleCancelledCount = this.handleCancelledCount.bind(this)
    this.handleExpiredCount = this.handleExpiredCount.bind(this)
    this.handleAmountsCount = this.handleAmountsCount.bind(this)
    this.handleRefundAmountsCount = this.handleRefundAmountsCount.bind(this)
    this.handleSpentAmountsCount = this.handleSpentAmountsCount.bind(this)
    this.handleMessageCount = this.handleMessageCount.bind(this)
    this.handleReviewRatingsCount = this.handleReviewRatingsCount.bind(this)
    this.handleNotificationCount = this.handleNotificationCount.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  componentWillMount () {
    let userData = JSON.parse(localStorage.getItem('userData'))
    let homeCounts = {
      url: config.baseUrl + config.getADEUBookingcountAPI + userData._id
    }
    let _this = this
    APICallManager.getCall(homeCounts, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        if (resObj.data.statusResult.messagesCount && resObj.data.statusResult.messagesCount.length) {
          _this.setState({ messagesCount: resObj.data.statusResult.messagesCount[0].count })
        }
        if (resObj.data.statusResult.reviewsCount && resObj.data.statusResult.reviewsCount.length) {
          _this.setState({ reviewsCount: resObj.data.statusResult.reviewsCount[0].count })
        }
        if (resObj.data.statusResult.notificationsUnreadCount && resObj.data.statusResult.notificationsUnreadCount.length) {
          _this.setState({ notificationsUnreadCount: resObj.data.statusResult.notificationsUnreadCount[0].count })
        }
        resObj.data.statusResult.bookingsCount.forEach(data => {
          if (data._id === 'Booked') {
            _this.setState({ bookingsBookedCount: data.myCount })
          }
          if (data._id === 'Confirmed') {
            _this.setState({ bookingsConfirmedCount: data.myCount })
          }
          if (data._id === 'Checked-In') {
            _this.setState({ bookingsCheckInsCount: data.myCount })
          }
          if (data._id === 'Checked-Out') {
            _this.setState({ bookingsCheckOutsCount: data.myCount })
          }
          if (data._id === 'Cancelled') {
            _this.setState({ bookingsCancelledCount: data.myCount })
          }
          if (data._id === 'Completed') {
            _this.setState({ bookingsCompletedCount: data.myCount })
          }
        })
        resObj.data.statusResult.expiredCount.forEach(data => {
          if (data._id === 'Booked') {
            _this.setState({ bookingsexpiredBookedCount: data.myCount })
          }
          if (data._id === 'Confirmed') {
            _this.setState({ bookingsexpiredConfirmedCount: data.myCount })
          }
          if (data._id === 'Checked-In') {
            _this.setState({ bookingsexpiredCheckInsCount: data.myCount })
          }
          if (data._id === 'Checked-Out') {
            _this.setState({ bookingsexpiredCheckOutsCount: data.myCount })
          }
          if (data._id === 'Cancelled') {
            _this.setState({ bookingsexpiredCancelledCount: data.myCount })
          }
        })
        resObj.data.statusResult.bookingsAmount.forEach(data => {
          if (data._id === 'Booked') {
            _this.setState({ BookedAmount: data.total })
          }
          if (data._id === 'Confirmed') {
            _this.setState({ ConfirmedAmount: data.total })
          }
          if (data._id === 'Checked-In') {
            _this.setState({ CheckInsAmount: data.total })
          }
          if (data._id === 'Checked-Out') {
            _this.setState({ CheckOutsAmount: data.total })
          }
          if (data._id === 'Cancelled') {
            _this.setState({ CancelledAmount: data.total })
          }
          if (data._id === 'Completed') {
            _this.setState({ CompletedAmount: data.total })
          }
        })
        resObj.data.statusResult.RefundAmount.forEach(data => {
          if (data._id === 'Booked') {
            _this.setState({ BookedAmount: data.total })
          }
          if (data._id === 'Confirmed') {
            _this.setState({ ConfirmedAmount: data.total })
          }
          if (data._id === 'Checked-In') {
            _this.setState({ CheckInsAmount: data.total })
          }
          if (data._id === 'Checked-Out') {
            _this.setState({ CheckOutsAmount: data.total })
          }
          if (data._id === 'Cancelled') {
            _this.setState({ CancelledAmount: data.total })
          }
          if (data._id === 'Completed') {
            _this.setState({ CompletedAmount: data.total })
          }
        })
      }
    })
  }
  handleUsersListByStatus (status) {
    localStorage.setItem('adminUserStatus', status)
    hashHistory.push('/admin/dashboard/users-bystatus')
  }
  handleBookingsCount () {
    localStorage.setItem('bookingsby', 'EU-dashboard')
    localStorage.setItem('adminUserStatus', 'Bookings')
    hashHistory.push('/admin/eu/bookings')
    event.preventDefault()
  }
  handleCancelledCount () {
    localStorage.setItem('adminUserStatus', 'Cancelled')
    hashHistory.push('/admin/eu/bookings')
    event.preventDefault()
  }
  handleExpiredCount () {
    localStorage.setItem('adminUserStatus', 'Expired')
    hashHistory.push('/admin/eu/bookings')
    event.preventDefault()
  }
  handleAmountsCount () {
    localStorage.setItem('adminUserStatus', 'TotalAmount')
    hashHistory.push('/admin/eu/bookings')
    event.preventDefault()
  }
  handleRefundAmountsCount () {
    localStorage.setItem('adminUserStatus', 'RefundAmount')
    hashHistory.push('/admin/eu/bookings')
    event.preventDefault()
  }
  handleSpentAmountsCount () {
    localStorage.setItem('adminUserStatus', 'SpentAmount')
    hashHistory.push('/admin/eu/bookings')
    event.preventDefault()
  }
  handleMessageCount () {
    localStorage.setItem('adminUserStatus', 'message')
    hashHistory.push('/admin/eu/inbox')
    event.preventDefault()
  }
  handleReviewRatingsCount () {
    hashHistory.push('/admin/eu/review-rating')
    event.preventDefault()
  }
  handleNotificationCount () {
    localStorage.setItem('adminUserStatus', 'notifications')
    hashHistory.push('/admin/eu/notifications')
    event.preventDefault()
  }
  handleBack () {
    hashHistory.push('/admin/eu-users')
  }
  handleRefresh () {
    this.componentWillMount()
    event.preventDefault()
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        <DrawerWithHeader />
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleBack}>EU Users List</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>Dashboard</li>
                    </ol>
                  </nav>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  <a onClick={this.handleRefresh} className='btn btn-default btn-refresh'>
                    <i className='fa fa-refresh' /> {t`lanADButtonRefresh`}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6'>
          <div className='card mb-2'>
            <div className='card-header'>
              <h3 className='mb-0'>Short Views</h3>
            </div>
            <div className='card-body'>
              <div className='row'>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-danger'>
                    {/* Card body */}
                    <a onClick={this.handleBookingsCount}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../images/booking-blue.png')} className='img-calendar' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanCommonTitleBookings`}</p>
                              <p className='card-title'>{this.state.bookingsBookedCount + this.state.bookingsConfirmedCount + this.state.bookingsCheckInsCount + this.state.bookingsCheckOutsCount + this.state.bookingsCancelledCount + this.state.bookingsCompletedCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-default'>
                    {/* Card body */}
                    <a onClick={this.handleCancelledCount}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../images/booking-blue.png')} className='img-calendar' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanSPLabelCancelled`}</p>
                              <p className='card-title'>{this.state.bookingsCancelledCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-info'>
                    {/* Card body */ }
                    <a onClick={this.handleExpiredCount}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../images/checkout.png')} className='img-calendar' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>Expired</p>
                              <p className='card-title'>{this.state.bookingsexpiredBookedCount + this.state.bookingsexpiredConfirmedCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-booked'>
                    {/* Card body */}
                    <a onClick={this.handleAmountsCount}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../images/money.png')} className='icon-three' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>Total Amount</p>
                              <p className='card-title'>{this.state.BookedAmount + this.state.ConfirmedAmount + this.state.CheckInsAmount + this.state.CheckOutsAmount + this.state.CompletedAmount + this.state.CancelledAmount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-booked'>
                    {/* Card body */}
                    <a onClick={this.handleRefundAmountsCount}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../images/money.png')} className='icon-three' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>Refund Amount</p>
                              <p className='card-title'>{this.state.CancelledAmount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-booked'>
                    {/* Card body */}
                    <a onClick={this.handleSpentAmountsCount}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../images/money.png')} className='icon-three' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>Spent Amount</p>
                              <p className='card-title'>{this.state.BookedAmount + this.state.ConfirmedAmount + this.state.CheckInsAmount + this.state.CheckOutsAmount + this.state.CompletedAmount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-success'>
                    {/* Card body */}
                    <a onClick={this.handleMessageCount}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../images/envelope.png')} className='icon-three' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanSPLabelMessages`}</p>
                              <p className='card-title'>{this.state.messagesCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-reviews'>
                    {/* Card body */}
                    <a onClick={this.handleReviewRatingsCount}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../images/star.png')} className='icon-three' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanSPTitleReviewRatings`}</p>
                              <p className='card-title'>{this.state.reviewsCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className='card-footer'>
                        <div className='stats'>
                          <a href='#'><i className='fas fa-sync-alt' /> Update Now</a>
                        </div>
                      </div> */}
                    </a>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-success'>
                    {/* Card body */}
                    <a onClick={this.handleNotificationCount}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../images/envelope.png')} className='icon-three' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>Notifications</p>
                              <p className='card-title'>{this.state.notificationsUnreadCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterComponent />
      </div>
    )
  }
}
export default ADEUBookingDashboardScreen

