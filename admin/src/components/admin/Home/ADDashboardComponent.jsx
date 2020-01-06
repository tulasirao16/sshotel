/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import 'react-drawer/lib/react-drawer.css'
import '../../../components/admin/css/all.min.css'
import '../../../components/admin/css/argon.min.css'
import '../../../components/admin/css/nucleo.css'
import APICallManager from '../../../services/callmanager'
import { hashHistory } from 'react-router'
// import PropTypes from 'prop-types'

import config from '../../../../public/config.json'
// import ADUsersListComponent from '../../../components/admin/Users/ADUsersLIstComponent'

class ADDashboard extends React.Component {
  constructor () {
    super()
    this.state = {
      checkInsCount: 0,
      cancelledCount: 0,
      confirmedCount: 0,
      checkInBookedCount: 0,
      checkInConfirmedCount: 0,
      checkInCheckInsCount: 0,
      checkOutCheckInsCount: 0,
      checkOutCheckOutsCount: 0,
      bookingsCount: 0,
      bookingsBookedCount: 0,
      bookingsCheckInsCount: 0,
      bookingsCheckOutsCount: 0,
      bookingsConfirmedCount: 0,
      bookingsCancelledCount: 0,
      bookingsCompletedCount: 0,
      BookedAmount: 0,
      ConfirmedAmount: 0,
      CheckInsAmount: 0,
      CheckOutsAmount: 0,
      CancelledAmount: 0,
      CompletedAmount: 0,
      messagesCount: 0,
      reviewsCount: 0,
      propertysCount: 0,
      blockedDatesCount: 0,
      notificationsUnreadCount: 0,
      adminEndUsersActiveUsers: 0,
      adminEndusersInActiveUsers: 0,
      adminHostusersActiveUsers: 0,
      adminHostUsersInActiveUsers: 0,
      inActivePropertiesCount: 0,
      activePropertiesCount: 0,
      homeCounts: [],
      usersList: [],
      ActiveUsers: 0,
      inActiveUsers: 0,
      view: '',
      hostStatus: '',
      totalBookingsCount: 0,
      totalAppAmountCount: 0,
      totalSpAmountCount: 0

    }
    this.handleUsersListByStatus = this.handleUsersListByStatus.bind(this)
    this.handleBookingList = this.handleBookingList.bind(this)
    this.handleBlockDatesCountLIst = this.handleBlockDatesCountList.bind(this)
    this.handleReviewRatingsCountList = this.handleReviewRatingsCountList.bind(this)
    this.handleMessageCountList = this.handleMessageCountList.bind(this)
    this.handlePropertysCountList = this.handlePropertysCountList.bind(this)
    this.handleEndUsersList = this.handleEndUsersList.bind(this)
    this.handleHostUsersList = this.handleHostUsersList.bind(this)
    this.handleHostUsersListByStatus = this.handleHostUsersListByStatus.bind(this)
    this.handlePropertysCountListByStatus = this.handlePropertysCountListByStatus.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
  }
  componentWillMount () {
    localStorage.removeItem('hostData')
    localStorage.removeItem('propertyStatus')
    localStorage.removeItem('hostStatus')
    localStorage.removeItem('reviewRatingsBy')
    localStorage.removeItem('messagesBy')
    let homeCounts = {
      url: config.baseUrl + config.getADUserCountsAPI
    }
    let _this = this
    APICallManager.getCall(homeCounts, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        if (resObj.data.statusResult.MessagesCount && resObj.data.statusResult.MessagesCount.result.length) {
          _this.setState({ messagesCount: resObj.data.statusResult.MessagesCount.result[0].count })
        }
        if (resObj.data.statusResult.ReviewsCount && resObj.data.statusResult.ReviewsCount.result.length) {
          _this.setState({ reviewsCount: resObj.data.statusResult.ReviewsCount.result[0].count })
        }
        if (resObj.data.statusResult.BlockingDatesCount && resObj.data.statusResult.BlockingDatesCount.result.length) {
          _this.setState({ blockedDatesCount: resObj.data.statusResult.BlockingDatesCount.result[0].count })
        }
        if (resObj.data.statusResult.NotificationsCount && resObj.data.statusResult.NotificationsCount.result.length) {
          _this.setState({ notificationsUnreadCount: resObj.data.statusResult.NotificationsCount.result[0].count })
        }
        resObj.data.statusResult.adUsersByStatusCount.result.forEach(element => {
          if (element._id === 'Active') {
            _this.setState({ ActiveUsers: element.count })
          } else {
            _this.setState({ inActiveUsers: element.count })
          }
        })
        resObj.data.statusResult.AdminEndUsersCounts.result.forEach(element => {
          if (element._id === 'Active') {
            _this.setState({ adminEndUsersActiveUsers: element.count })
          } else {
            _this.setState({ adminEndusersInActiveUsers: element.count })
          }
        })
        resObj.data.statusResult.AdminHostUsersCounts.result.forEach(element => {
          if (element._id === 'Active') {
            _this.setState({ adminHostusersActiveUsers: element.count })
          } else {
            _this.setState({ adminHostUsersInActiveUsers: element.count })
          }
        })
        resObj.data.statusResult.PropertiesCount.result.forEach(element => {
          if (element._id === 'Active') {
            _this.setState({ activePropertiesCount: element.count })
          } else {
            _this.setState({ inActivePropertiesCount: element.count })
          }
        })
        resObj.data.statusResult.adUsersBookingStatusCount.result.forEach(element => {
          if (element._id === 'Booked') {
            _this.setState({ bookingsBookedCount: element.count })
          }
          if (element._id === 'Confirmed') {
            _this.setState({ bookingsConfirmedCount: element.count })
          }
          if (element._id === 'Checked-In') {
            _this.setState({ bookingsCheckInsCount: element.count })
          }
          if (element._id === 'Checked-Out') {
            _this.setState({ bookingsCheckOutsCount: element.count })
          }
          if (element._id === 'Cancelled') {
            _this.setState({ bookingsCancelledCount: element.count })
          }
          if (element._id === 'Completed') {
            _this.setState({ bookingsCompletedCount: element.count })
          }
        })
        resObj.data.statusResult.CheckInCount.result.forEach(element => {
          if (element._id === 'Booked') {
            _this.setState({ checkInBookedCount: element.count })
          }
          if (element._id === 'Checked-In') {
            _this.setState({ checkInCheckInsCount: element.count })
          }
          if (element._id === 'Confirmed') {
            _this.setState({ checkInConfirmedCount: element.count })
          }
        })
        resObj.data.statusResult.CheckOutCount.result.forEach(element => {
          if (element._id === 'Checked-In') {
            _this.setState({ checkOutCheckInsCount: element.count })
          }
          if (element._id === 'Checked-Out') {
            _this.setState({ checkOutCheckOutsCount: element.count })
          }
        })
        resObj.data.statusResult.BookingsAmount.result.forEach(element => {
          if (element._id === 'Booked') {
            _this.setState({ BookedAmount: element.total })
          }
          if (element._id === 'Confirmed') {
            _this.setState({ ConfirmedAmount: element.total })
          }
          if (element._id === 'Checked-In') {
            _this.setState({ CheckInsAmount: element.total })
          }
          if (element._id === 'Checked-Out') {
            _this.setState({ CheckOutsAmount: element.total })
          }
          if (element._id === 'Cancelled') {
            _this.setState({ CancelledAmount: element.total })
          }
          if (element._id === 'Completed') {
            _this.setState({ CompletedAmount: element.total })
          }
        })
        resObj.data.statusResult.AdminBookingCounts.result.forEach(element => {
          _this.setState({ totalBookingsCount: element.count })
        })
        resObj.data.statusResult.AdminAppTotaAmountCounts.result.forEach(element => {
          _this.setState({ totalAppAmountCount: element.total })
        })
        resObj.data.statusResult.AdminSPTotalAmountCounts.result.forEach(element => {
          _this.setState({ totalSpAmountCount: element.total })
        })
      }
    })
  }
  handlePropertysCountList () {
    localStorage.setItem('propertiesBy', 'Dashboard')
    hashHistory.push('/admin/host/properties')
    event.preventDefault()
  }
  handleUsersListByStatus (status) {
    localStorage.setItem('adminUserStatus', status)
    hashHistory.push('/admin/dashboard/users-bystatus')
  }
  handleHostUsersListByStatus (hostStatus) {
    localStorage.setItem('hostStatus', hostStatus)
    localStorage.setItem('hostslistby', 'Dashboard')
    hashHistory.push('/admin/hosts')
  }
  handlePropertysCountListByStatus (propertyStatus) {
    localStorage.setItem('propertyStatus', propertyStatus)
    hashHistory.push('/admin/host/properties')
  }
  handleMessageCountList () {
    localStorage.setItem('messagesBy', 'Dashboard')
    hashHistory.push('/admin/host-inbox')
    event.preventDefault()
  }

  handleReviewRatingsCountList () {
    localStorage.setItem('reviewRatingsBy', 'Dashboard')
    localStorage.setItem('homeReviewRating', 'True')
    hashHistory.push('/admin/hosts/review-ratings')
    event.preventDefault()
  }

  handleBlockDatesCountList () {
    hashHistory.push('/admin/dashboard/blockeddates')
    event.preventDefault()
  }
  handleBookingList (bookingStatus) {
    localStorage.setItem('bookingStatus', bookingStatus)
    hashHistory.push('/admin/dashboard/bookings')
  }
  handleEndUsersList () {
    localStorage.setItem('EUListyby', 'Dashboard')
    hashHistory.push('/admin/eu-users')
    event.preventDefault()
  }
  handleHostUsersList () {
    localStorage.setItem('hostslistby', 'Dashboard')
    hashHistory.push('/admin/hosts')
    event.preventDefault()
  }
  handleRefresh () {
    this.componentWillMount()
    event.preventDefault()
  }

  render () {
    return (
      <div>
        {/* ------- Navbar --------- */}
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h3 text-white d-inline-block mb-0'>{t`lanADTitleDashboard`}</h6>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  <a onClick={this.handleRefresh} className='btn btn-default btn-refresh' >
                    <i className='fa fa-refresh' /> {t`lanADButtonRefresh`}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6'>
          <div className='card mb-2'>
            <div className='card-header'>
              {/* <h3 className='mb-0'>{t`lanSPSubTitleTodayStats`}</h3> */}
              <h3 className='mb-0'>{t`lanSPTitleDashboard`}</h3>
            </div>
            {/* <div className='card-header'>
              <h3 className='mb-0'>Short Views</h3>
            </div> */}
            <div className='home-top-view mx-4 mt-3' >
              <div className='row justify-content-center'>
                <div className='col-xl-4 col-md-6'>
                  <div className='card card-stats main-card'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col'>
                          <h5 className='text-uppercase text-muted mb-0'>{t`lanADLabelDashboardTotalBookings`}</h5>
                          <span className='h1 font-weight-bold mb-0'>{this.state.totalBookingsCount}</span>
                        </div>
                        <div className='col-auto'>
                          <div className='icon icon-shape bg-gradient-red text-white rounded-circle shadow'>
                            <i className='ni ni-active-40' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-4 col-md-6'>
                  <div className='card card-stats'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col'>
                          <h5 className='text-uppercase text-muted mb-0'>{t`lanADLabelDashboardAppAmount`}</h5>
                          <span className='h1 font-weight-bold mb-0'>{Math.round(this.state.totalAppAmountCount)}</span>
                        </div>
                        <div className='col-auto'>
                          <div className='icon icon-shape bg-gradient-orange text-white rounded-circle shadow'>
                            <i className='ni ni-chart-pie-35' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-4 col-md-6'>
                  <div className='card card-stats main-card'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col'>
                          <h5 className='text-uppercase text-muted mb-0'>{t`lanADLabelDashboardHostAmount`}</h5>
                          <span className='h1 font-weight-bold mb-0'>{Math.round(this.state.totalSpAmountCount)}</span>
                        </div>
                        <div className='col-auto'>
                          <div className='icon icon-shape bg-gradient-green text-white rounded-circle shadow'>
                            <i className='ni ni-money-coins' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='card-body Dashboard'>
              <div className='row'>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-primary'>
                    {/* Card body */}
                    <a onClick={() => { this.handleBookingList(this.setState.bookingStatus = 'CheckIn') }}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/checkin.png')} className='icon-calendar' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardCheckIn`}</p>
                              <p className='card-title'>{this.state.checkInCheckInsCount}/{this.state.checkInCheckInsCount + this.state.checkInConfirmedCount + this.state.checkInBookedCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-info'>
                    {/* Card body */}
                    <a onClick={() => { this.handleBookingList(this.setState.bookingStatus = 'CheckOut') }}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/checkout.png')} className='icon-calendar' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardCheckOut`}</p>
                              <p className='card-title'>{this.state.checkOutCheckOutsCount}/{this.state.checkOutCheckOutsCount + this.state.checkOutCheckInsCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-danger'>
                    {/* Card body */}
                    <a onClick={() => { this.handleBookingList(this.setState.bookingStatus = 'Bookings') }}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/booking-blue.png')} className='icon-calendar' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardBookings`}</p>
                              <p className='card-title'> {(this.state.bookingsBookedCount + this.state.bookingsConfirmedCount + this.state.bookingsCheckInsCount) +
                                (this.state.bookingsCheckOutsCount + this.state.bookingsCompletedCount)}</p>
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
                    <a onClick={() => { this.handleBookingList(this.setState.bookingStatus = 'Cancelled') }}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/booking-blue.png')} className='icon-calendar' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardCancelled`}</p>
                              <p className='card-title'> {this.state.bookingsCancelledCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-property'>
                    {/* Card body */}
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-auto'>
                          <div className='images'>
                            <img src={require('../../../components/admin/images/envelope.png')} className='icon-three' />
                          </div>
                        </div>
                        <div className='col'>
                          <div className='numbers'>
                            <p className='card-category'>{t`lanADLabelDashboardMessages`}</p>
                            <p className='card-title'>{this.state.messagesCount}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-success'>
                    {/* Card body */}
                    <a onClick={this.handleReviewRatingsCountList}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/star.png')} className='icon-three' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardRatings`}</p>
                              <p className='card-title'>{this.state.reviewsCount}</p>
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
                    <a onClick={() => { this.handleBookingList(this.setState.bookingStatus = 'Amounts') }}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/money.png')} className='icon-three' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardAmount`}</p>
                              <p className='card-title'>{Math.round(this.state.BookedAmount + this.state.ConfirmedAmount + this.state.CheckInsAmount + this.state.CheckOutsAmount + this.state.CompletedAmount)}</p>
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
                    <a onClick={this.handleBlockDatesCountLIst}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/blocked-dates.png')} className='icon-three' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardBlockDates`}</p>
                              <p className='card-title'>{this.state.blockedDatesCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-blocked'>
                    {/* Card body */}
                    <a onClick={() => { this.handleUsersListByStatus(this.setState.status = 'Active') }}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/active_users.png')} className='icon-calendar' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardActiveAdminUsers`}</p>
                              <p className='card-title'>{this.state.ActiveUsers}/{this.state.ActiveUsers + this.state.inActiveUsers}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-offers'>
                    {/* Card body */}
                    <a onClick={() => { this.handleUsersListByStatus(this.setState.status = 'Inactive') }}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/in-active-user.png')} className='icon-calendar' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardInactiveAdminUsers`}</p>
                              {/* <p className='card-title'>0 / 0</p> */}
                              <p className='card-title'>{this.state.inActiveUsers}/{this.state.inActiveUsers + this.state.ActiveUsers}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-services'>
                    {/* Card body */}
                    <a onClick={this.handlePropertysCountList}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/check-list.png')} className='icon-three' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardPropertyList`}</p>
                              <p className='card-title'>{this.state.activePropertiesCount + this.state.inActivePropertiesCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-primary'>
                    {/* Card body */}
                    <a onClick={() => { this.handlePropertysCountListByStatus(this.setState.propertyStatus = 'Active') }}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/check-list.png')} className='icon-three' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardActivePropertiesList`}</p>
                              <p className='card-title'>{this.state.activePropertiesCount}/{this.state.activePropertiesCount + this.state.inActivePropertiesCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>

                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-info'>
                    {/* Card body */}
                    <a onClick={() => { this.handlePropertysCountListByStatus(this.setState.propertyStatus = 'Inactive') }}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/check-list.png')} className='icon-three' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardInactivePropertiesList`}</p>
                              <p className='card-title'>{this.state.inActivePropertiesCount}/{this.state.activePropertiesCount + this.state.inActivePropertiesCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>

                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-danger'>
                    {/* Card body  */}
                    <a onClick={this.handleEndUsersList}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/user.png')} className='icon-calendar' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardEndUsers`}</p>
                              {/* <p className='card-title'>0 / 0</p> */}
                              <p className='card-title'>{this.state.adminEndUsersActiveUsers + this.state.adminEndusersInActiveUsers}</p>
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
                    <a onClick={this.handleHostUsersList}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/user.png')} className='icon-calendar' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardHostsList`}</p>
                              {/* <p className='card-title'>0 / 0</p> */}
                              <p className='card-title'>{this.state.adminHostusersActiveUsers + this.state.adminHostUsersInActiveUsers}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-property'>
                    {/* Card body */}
                    <a onClick={() => { this.handleHostUsersListByStatus(this.setState.hostStatus = 'Active') }}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/user.png')} className='icon-calendar' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardActiveHosts`}</p>
                              {/* <p className='card-title'>0 / 0</p> */}
                              <p className='card-title'>{this.state.adminHostusersActiveUsers}/{this.state.adminHostusersActiveUsers + this.state.adminHostUsersInActiveUsers}</p>
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
                    <a onClick={() => { this.handleHostUsersListByStatus(this.setState.hostStatus = 'Inactive') }}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/in-active-user.png')} className='icon-calendar' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardInactiveHosts`}</p>
                              {/* <p className='card-title'>0 / 0</p> */}
                              <p className='card-title'>{this.state.adminHostUsersInActiveUsers}/{this.state.adminHostusersActiveUsers + this.state.adminHostUsersInActiveUsers}</p>
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
      </div>
    )
  }
}
export default ADDashboard

