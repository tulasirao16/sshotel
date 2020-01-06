/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
// import ReactDrawer from 'react-drawer'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import { t } from 'ttag'
// import DrawerWithHeader from '../Drawer/DrawerComponent'
// import FooterComponent from '../FooterCompnt/Footer'
import APICallManager from '../../../services/callmanager'

import config from '../../../../public/config.json'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPDashboardComponent extends React.Component {
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
      notificationsUnreadCount: 0
    }
    this.handlePropertyList = this.handlePropertyList.bind(this)
    this.handleCheckInCount = this.handleCheckInCount.bind(this)
    this.handleCheckOutCount = this.handleCheckOutCount.bind(this)
    this.handleBookingsCount = this.handleBookingsCount.bind(this)
    this.handleCancelledCount = this.handleCancelledCount.bind(this)
    this.handleMessageCount = this.handleMessageCount.bind(this)
    this.handleAmountsCount = this.handleAmountsCount.bind(this)
    this.handleReviewRatingsCount = this.handleReviewRatingsCount.bind(this)
    this.handleBlockDatesCount = this.handleBlockDatesCount.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }
  componentWillMount () {
    let homeCounts = {
      url: config.baseUrl + config.getSPHomeCountsAPI
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
        if (resObj.data.statusResult.propertysCount && resObj.data.statusResult.propertysCount.length) {
          _this.setState({ propertysCount: resObj.data.statusResult.propertysCount[0].count })
        }
        if (resObj.data.statusResult.blockedDatesCount && resObj.data.statusResult.blockedDatesCount.length) {
          _this.setState({ blockedDatesCount: resObj.data.statusResult.blockedDatesCount[0].count })
        }
        if (resObj.data.statusResult.notificationsUnreadCount && resObj.data.statusResult.notificationsUnreadCount.length) {
          _this.setState({ notificationsUnreadCount: resObj.data.statusResult.notificationsUnreadCount[0].count })
        }
        resObj.data.statusResult.checkInsCount.forEach(data => {
          if (data._id === 'Booked') {
            _this.setState({ checkInBookedCount: data.myCount })
          }
          if (data._id === 'Checked-In') {
            _this.setState({ checkInCheckInsCount: data.myCount })
          }
          if (data._id === 'Confirmed') {
            _this.setState({ checkInConfirmedCount: data.myCount })
          }
        })
        resObj.data.statusResult.checkOutsCount.forEach(data => {
          if (data._id === 'Checked-In') {
            _this.setState({ checkOutCheckInsCount: data.myCount })
          }
          if (data._id === 'Checked-Out') {
            _this.setState({ checkOutCheckOutsCount: data.myCount })
          }
        })
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
      }
    })
  }

  handlePropertyList () {
    hashHistory.push('/host/properties')
    event.preventDefault()
  }

  handleCheckInCount () {
    localStorage.setItem('homeBookingType', 'CheckIn')
    hashHistory.push('/host/home/bookings')
    event.preventDefault()
  }

  handleCheckOutCount () {
    localStorage.setItem('homeBookingType', 'CheckOut')
    hashHistory.push('/host/home/bookings')
    event.preventDefault()
  }

  handleBookingsCount () {
    localStorage.setItem('homeBookingType', 'Bookings')
    hashHistory.push('/host/home/bookings')
    event.preventDefault()
  }

  handleCancelledCount () {
    localStorage.setItem('homeBookingType', 'Cancelled')
    hashHistory.push('/host/home/bookings')
    event.preventDefault()
  }

  handleAmountsCount () {
    localStorage.setItem('homeBookingType', 'Amounts')
    hashHistory.push('/host/home/bookings')
    event.preventDefault()
  }

  handleMessageCount () {
    hashHistory.push('/host/inbox')
    event.preventDefault()
  }

  handleReviewRatingsCount () {
    localStorage.setItem('homeReviewRating', 'True')
    hashHistory.push('/host/reviewratings')
    event.preventDefault()
  }

  handleBlockDatesCount () {
    hashHistory.push('/host/home/blockeddates')
    event.preventDefault()
  }
  handleHome () {
    hashHistory.push('/host/home')
    event.preventDefault()
  }
  render () {
    return (
      <div >
        {/* ------- Navbar --------- */}
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  {/* <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitleDashboard`}</h6> */}
                  <nav aria-label='breadcrumb' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      {/* <li className='breadcrumb-item'><a href='#'>Dashboards</a></li> */}
                      <li className='breadcrumb-item active' aria-current='page'>{t`lanSPTitleDashboard`}</li>
                    </ol>
                  </nav>
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
            <div className='card-body SPDashboard'>
              <div className='row'>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-primary'>
                    {/* Card body */}
                    <a onClick={this.handleCheckInCount}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../images/checkin.png')} className='img-calendar' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanCommonLabelCheckIn`}</p>
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
                    {/* Card body */ }
                    <a onClick={this.handleCheckOutCount}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../images/checkout.png')} className='img-calendar' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanCommonLabelCheckOut`}</p>
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
                              <p className='card-title'>{this.state.bookingsBookedCount + this.state.bookingsConfirmedCount + this.state.bookingsCheckInsCount + this.state.bookingsCheckOutsCount}</p>
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
              </div>
              <div className='row'>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-property'>
                    {/* Card body */}
                    <a onClick={this.handlePropertyList}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../images/check-list.png')} className='icon-three' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanSPTitlePropertiesList`}</p>
                              <p className='card-title'>{this.state.propertysCount}</p>
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
                              <p className='card-category'>{t`lanCommonLabelBookingAmount`}</p>
                              <p className='card-title'>{this.state.BookedAmount + this.state.ConfirmedAmount + this.state.CheckInsAmount + this.state.CheckOutsAmount + this.state.CompletedAmount}</p>
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
                  <div className='card card-stats bg-gradient-blocked'>
                    {/* Card body */}
                    <a onClick={this.handleBlockDatesCount}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../images/blocked-dates.png')} className='icon-three' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanSPSubTitleBlockedDates`}</p>
                              <p className='card-title'>{this.state.blockedDatesCount}</p>
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
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-auto'>
                          <div className='images'>
                            <img src={require('../images/services.png')} className='icon-three' />
                          </div>
                        </div>
                        <div className='col'>
                          <div className='numbers'>
                            <p className='card-category'>{t`lanSPTitleServices`}</p>
                            <p className='card-title'>0</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-offers'>
                    {/* Card body */}
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-auto'>
                          <div className='images'>
                            <img src={require('../images/offers.png')} className='icon-three' />
                          </div>
                        </div>
                        <div className='col'>
                          <div className='numbers'>
                            <p className='card-category'>{t`lanSPLabelOffers`}</p>
                            <p className='card-title'>0</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className='card-footer'>
                      <div className='stats'>
                        <a href='#'><i className='far fa-clock' /> In the last hour</a>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats'>
                    {/* Card body */}
                    <a onClick={this.handleAmountsCount}>
                      <div className='card-body' style={{height:130, textAlign:'center', paddingTop:50, paddingBottom:50, paddingLeft:20, paddingRight:20 }}>
                        <p>Coming Soon</p>
                        {/* <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../images/money.png')} className='icon-three' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='row'>
                              <div className='col-md-12'>
                                <div className='pull-left'><p className='card-category'>{t`lanSPLabelBookingTotal`}</p></div>
                                <div className='pull-right'><label>{this.state.BookedAmount + this.state.ConfirmedAmount + this.state.CheckInsAmount + this.state.CheckOutsAmount + this.state.CancelledAmount}</label></div>                    { /* Card body
                      <a onClick={this.handleAmountsCount}>
                        <div className='card-body'>
                          <div className='row'>
                            <div className='col-auto'>
                              <div className='images'>
                                <img src={require('../images/money.png')} className='icon-three' />
                              </div>
                            </div>
                            <div className='col'>
                              <div className='row'>
                                <div className='col-md-12'>
                                  <div className='pull-left'><p className='card-category'>{t`lanSPLabelBookingTotal`}</p></div>
                                  <div className='pull-right'>
                                    <label>{this.state.BookedAmount + this.state.ConfirmedAmount + this.state.CheckInsAmount + this.state.CheckOutsAmount + this.state.CancelledAmount}</label></div>
                                </div>
                                <div className='col-md-12'>
                                  <div className='pull-left'><p className='card-category'>{t`lanSPLabelBookingCancelled`}</p></div>
                                  <div className='pull-right'><label>{this.state.CancelledAmount}</label></div>
                                </div>
                                <div className='col-md-12'>
                                  <div className='pull-left'><p className='card-category'>{t`lanSPLabelSPAmount`}</p></div>
                                  <div className='pull-right'><label>{this.state.BookedAmount + this.state.ConfirmedAmount + this.state.CheckInsAmount + this.state.CheckOutsAmount}</label></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}
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

export default SPDashboardComponent
