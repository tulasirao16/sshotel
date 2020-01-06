/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import 'react-drawer/lib/react-drawer.css'
import { hashHistory } from 'react-router'
import PieChart from 'react-minimal-pie-chart'

import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import '../../../components/admin/css/all.min.css'
import '../../../components/admin/css/argon.min.css'
import '../../../components/admin/css/nucleo.css'

class ADServiceProviderDashboard extends React.Component {
  constructor () {
    super()
    this.state = {
      bookingsBookedCounts: 0,
      bookingsCheckInsCount: 0,
      bookingsCheckOutsCount: 0,
      bookingsConfirmedCount: 0,
      bookingsCancelledCount: 0,
      bookingsCompletedCount: 0,
      spBookingsBookedCount: 0,
      spBookingsConfirmedCount: 0,
      spBookingsCheckInsCount: 0,
      BookedAmount: 0,
      ConfirmedAmount: 0,
      CheckInsAmount: 0,
      CheckOutsAmount: 0,
      CancelledAmount: 0,
      CompletedAmount: 0,
      messagesCount: 0,
      reviewsCount: 0,
      homeCounts: [],
      usersList: [],
      view: '',
      hostStatus: '',
      hostData: JSON.parse(localStorage.getItem('hostData')),
      mouseOverData: {},
      mouseOver: false,
      spExpiredBookingsCount: 0,
      bookings: 'count',
      bookingClosed: 0

    }

    this.handleReviewRatingsCountList = this.handleReviewRatingsCountList.bind(this)
    this.handleMessageCountList = this.handleMessageCountList.bind(this)
    this.handleBookingList = this.handleBookingList.bind(this)
    this.handlePieChart = this.handlePieChart.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleHosts = this.handleHosts.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
  }
  componentWillMount () {
    let homeCounts = {
      url: config.baseUrl + config.getADServiceProviderDashboardAPI + this.state.hostData._id + '/'
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
        resObj.data.statusResult.bookingsBookedCount.result.forEach(element => {
          if (element._id === 'Booked') {
            _this.setState({ bookingsBookedCounts: element.count })
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
          if (element._id === 'Closed') {
            _this.setState({ bookingClosed: element.count })
          }
        })
        resObj.data.statusResult.SPExpieredBookings.result.forEach(element => {
          if (element._id === 'Booked') {
            _this.setState({ spBookingsBookedCount: element.count })
          }
          if (element._id === 'Confirmed') {
            _this.setState({ spBookingsConfirmedCount: element.count })
          }
          if (element._id === 'Checked-In') {
            _this.setState({ spBookingsCheckInsCount: element.count })
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
      }
    })
  }
  handleHome () {
    localStorage.removeItem('hostData')
    hashHistory.push('/admin/home')
  }
  handleHosts () {
    localStorage.removeItem('hostData')
    hashHistory.push('/admin/hosts')
  }
  handlePieChart (data, dataIndex) {
    this.setState({ mouseOver: true, mouseOverData: data[dataIndex] })
  }
  handleMessageCountList () {
    localStorage.removeItem('messagesBy')
    localStorage.setItem('messagesBy', 'hostdashboard')
    hashHistory.push('/admin/host-inbox')
    event.preventDefault()
  }
  handleBookingList (bookingStatus) {
    localStorage.setItem('bookingStatus', bookingStatus)
    hashHistory.push('/admin/host-dashboard/bookings')
  }

  handleReviewRatingsCountList () {
    localStorage.setItem('hostreviewRatings', 'hostdashboard')
    localStorage.removeItem('reviewRatingsBy')
    hashHistory.push('/admin/hosts/review-ratings')
    event.preventDefault()
  }
  handleRefresh () {
    this.componentWillMount()
    event.preventDefault()
  }
  render () {
    var total = (this.state.bookingsBookedCounts + this.state.bookingsConfirmedCount + this.state.bookingsCheckInsCount +
      this.state.bookingsCheckOutsCount + this.state.bookingsCompletedCount)
    var ActualAmount = (this.state.BookedAmount + this.state.ConfirmedAmount + this.state.CheckInsAmount + this.state.CheckOutsAmount + this.state.CompletedAmount)
    var Amount = (this.state.BookedAmount + this.state.ConfirmedAmount + this.state.CheckInsAmount + this.state.CheckOutsAmount +
      this.state.CompletedAmount + this.state.CancelledAmount)
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        {/* <DrawerWithHeader /> */}
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item active eu-font'><a onClick={this.handleHosts}>{t`lanADLabelDashboardHostsList`}</a></li>
                      <li className='breadcrumb-item active eu-font' aria-current='page'>{t`lanADLabelDashboardHostDashboard`}</li>
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
            <div className='card-body'>
              <div className='row'>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-primary'>
                    {/* Card body */}
                    <a onClick={() => { this.handleBookingList(this.setState.bookingStatus = 'all') }}>
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
                              <p className='card-title'> {((this.state.bookingsBookedCounts + this.state.bookingsConfirmedCount + this.state.bookingsCheckInsCount) +
                                (this.state.bookingsCheckOutsCount + this.state.bookingsCompletedCount + this.state.bookingsCancelledCount))}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    {/* <div className='card-footer'>
                      <div className='stats'>
                        <a ><i className='far fa-clock' /> In the last hour</a>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-info'>
                    {/* Card body */}
                    <a onClick={() => { this.handleBookingList(this.setState.bookingStatus = 'Expired') }}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/money.png')} className='icon-three' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardExpiredBookings`}</p>
                              <p className='card-title'> {this.state.spBookingsBookedCount + this.state.spBookingsConfirmedCount + this.state.spBookingsCheckInsCount}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    {/* <div className='card-footer'>
                      <div className='stats'>
                        <a ><i className='far fa-clock' /> In the last hour</a>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-danger'>
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
                              <p className='card-category'>{t`lanADLabelDashboardCancelledBookings`}</p>
                              <p className='card-title'> {this.state.bookingsCancelledCount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    {/* <div className='card-footer'>
                      <div className='stats'>
                        <a ><i className='fas fa-sync-alt' /> Update Now</a>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-default'>
                    {/* Card body */}
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-auto'>
                          <div className='images'>
                            <img src={require('../../../components/admin/images/booking-blue.png')} className='icon-calendar' />
                          </div>
                        </div>
                        <div className='col'>
                          <div className='numbers'>
                            <p className='card-category'>{t`lanADLabelDashboardClosedBooking`}</p>
                            <p className='card-title'> {this.state.bookingClosed}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className='card-footer'>
                      <div className='stats'>
                        <a ><i className='far fa-clock' /> In the last hour</a>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-property'>
                    {/* Card body */}
                    <a onClick={() => { this.handleBookingList(this.setState.bookingStatus = 'all') }}>
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
                              <p className='card-title'>{Math.round(Amount)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    {/* <div className='card-footer'>
                      <div className='stats'>
                        <a ><i className='far fa-clock' /> In the last hour</a>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-success'>
                    {/* Card body */}
                    <a onClick={() => { this.handleBookingList(this.setState.bookingStatus = 'actual amount') }}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/money.png')} className='icon-three' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardActualAmount`}</p>
                              <p className='card-title'>{Math.round(ActualAmount)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    {/* <div className='card-footer'>
                      <div className='stats'>
                        <a ><i className='far fa-clock' /> In the last hour</a>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-reviews'>
                    {/* Card body */}
                    <a onClick={() => { this.handleBookingList(this.setState.bookingStatus = 'Cancelled') }}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-auto'>
                            <div className='images'>
                              <img src={require('../../../components/admin/images/money.png')} className='icon-three' />
                            </div>
                          </div>
                          <div className='col'>
                            <div className='numbers'>
                              <p className='card-category'>{t`lanADLabelDashboardCancelledAmount`}</p>
                              <p className='card-title'>{Math.round(this.state.CancelledAmount)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    {/* <div className='card-footer'>
                      <div className='stats'>
                        <a ><i className='far fa-clock' /> In the last hour</a>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-booked'>
                    {/* Card body */}
                    <a onClick={this.handleMessageCountList}>
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
                    </a>
                    {/* <div className='card-footer'>
                      <div className='stats'>
                        <a ><i className='far fa-clock' /> In the last hour</a>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats bg-gradient-blocked'>
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
                    {/* <div className='card-footer'>
                      <div className='stats'>
                        <a ><i className='fas fa-sync-alt' /> Update Now</a>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats mb-0'>
                    <div className='card-header'>
                      <h5 className='card-title'>{t`lanADLabelDashboardgBookingsByStatus`}</h5>
                    </div>
                    {/* Card body */}
                    <div className='card-body'>
                      { total !== 0
                     ? <PieChart
                       onMouseOver={(event, data, dataIndex) => this.handlePieChart(data, dataIndex)}
                       onMouseOut={() => this.setState({ mouseOver: false })}
                       style={{ height: 150 }}
                       data={[
                         {
                           value: (this.state.bookingsBookedCounts) * 100 / total,
                           key: 1,
                           count: this.state.bookingsBookedCounts,
                           BookingStatus: 'Booked',
                           color: '#8c6e50',
                           bookings: 'count'

                         },
                         {
                           value: (this.state.bookingsCheckInsCount) * 100 / total,
                           key: 2,
                           count: this.state.bookingsCheckInsCount,
                           BookingStatus: 'Checked-In',
                           color: '#e38627',
                           bookings: 'count'

                         },
                         {
                           value: (this.state.bookingsCheckOutsCount) * 100 / total,
                           key: 3,
                           count: this.state.bookingsCheckOutsCount,
                           BookingStatus: 'Checked-Out',
                           color: '#2d27e3',
                           bookings: 'count'

                         },
                         {
                           value: (this.state.bookingsCompletedCount) * 100 / total,
                           key: 4,
                           count: this.state.bookingsCompletedCount,
                           BookingStatus: 'Completed',
                           color: '#e327d3',
                           bookings: 'count'

                         },
                         {
                           value: (this.state.bookingsConfirmedCount) * 100 / total,
                           key: 5,
                           count: this.state.bookingsConfirmedCount,
                           BookingStatus: 'Confirmed',
                           color: '#27cae3',
                           bookings: 'count'
                         }
                       ]}
                      />
                      : <PieChart
                        style={{ height: 150 }}
                        data={[
                          {
                            value: 100,
                            color: '#e2e2e2'
                          }
                        ]}
                      />
                      }
                    </div>
                    {this.state.mouseOver
                        ? <div className='overlay-div-pie-chart'>
                          <div className='pie-chart-div'>
                            <div className='pie-chart-content'>
                              <p className='text-black'>
                                <b className='text-black'>
                                  {this.state.mouseOverData.BookingStatus}({Math.round(this.state.mouseOverData.value)}%) - {this.state.mouseOverData.bookings}({this.state.mouseOverData.count})
                                </b>
                              </p>
                            </div>
                          </div>
                        </div>
                        : null}
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
export default ADServiceProviderDashboard

