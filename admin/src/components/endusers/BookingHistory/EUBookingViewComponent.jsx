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
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import { Button } from 'react-bootstrap'

class EUBookingViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      recordId: this.props.recordId ? this.props.recordId : '',
      bookingData: this.props.data ? this.props.data : {}
    }
    this.handleViewClose = this.handleViewClose.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleRating = this.handleRating.bind(this)
  }
  componentWillMount () {
    if (this.state.recordId) {
      let obj = { url: config.baseUrl + config.getEUBookingDataAPI + this.state.recordId }
      let _this = this
      APICallManager.getCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ bookingData: resObj.data.statusResult })
        } else {
          _this.setState({ bookingData: [] })
        }
      })
    }
  }
  handleViewClose () {
    if (this.state.recordId) {
      hashHistory.push('/notifications-list')
    } else {
      this.props.handleViewClose()
      event.preventDefault()
    }
  }
  handleHome () {
    hashHistory.push('/hotels')
    event.preventDefault()
  }
  handleRating (data) {
    this.props.handleRating(data)
  }

  render () {
    // const data = this.props.data
    return (
      <div>
        <div className='main-content view-booking enduser' id='panel'>
          {/* ------- Navbar --------- */}
          <div className='header bg-primary pb-6'>
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='row align-items-center pt-7 pb-3'>
                  <div className='col-lg-6 col-7'>
                    <nav aria-label='breadcrumb eu' className='d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item'><a onClick={this.handleViewClose} >Bookings</a></li>
                        <li className='breadcrumb-item active' aria-current='page'>{t`lanCommonButtonTooltipViewBooking`}</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container-fluid mt--6 pb-4'>
            <div className='row justify-content-center notifictions'>
              <div className='col-lg-10 card-wrapper'>
                <div className='card mb-2'>
                  <div className='card-header'>
                    <div className='row'>
                      <div className='col-sm-10'>
                        <h5 className='card-title'>{t`lanSPLabelBookingDetails`}</h5>
                      </div>
                      <div className='col-sm-2 text-right'>
                        {this.state.bookingData.bookingStatus === 'Completed' || this.state.bookingData.bookingStatus === 'Checked-Out'
                      ? <a onClick={() => this.handleRating(this.state.bookingData)} className='update-edit mr-1 ' title='Give Review' >
                        <span className='avatar avatar-md mr-0 bg-info rounded-circle'>
                          <span className='media-object d-flex justify-content-center align-items-center'><i className='fas fa-star' /></span>
                        </span>
                      </a>
                      : null
                      }
                      </div>
                    </div>
                  </div>
                  <div className='card-body'>
                    <section className='notifications'>
                      <div className='row clearfix'>
                        <div className='col-md-12 col-lg-12 col-sm-12 col-xl-12'>
                          <div className='row'>
                            <div className='col-sm-6'>
                              <div className='row py-2'>
                                <div className='col-sm-3'><small>{t`lanCommonLabelBookingCode`}</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.bookingCode}</h5></div>
                              </div>
                              <div className='row py-2'>
                                <div className='col-sm-3'><small>{t`lanCommonLabelName`}</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.euName}</h5></div>
                              </div>
                              <div className='row py-2'>
                                <div className='col-sm-3'><small>{t`lanCommonLabelCheckIn`}</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.checkInDate}</h5></div>
                              </div>
                              <div className='row py-2' >
                                <div className='col-sm-3'><small>{t`lanSPLabelTotalDays`}</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.totalDays}</h5></div>
                              </div>
                            </div>
                            <div className='col-sm-6'>
                              <div className='row py-2'>
                                <div className='col-sm-3'><small>{t`lanCommonLabelStatus`}</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.bookingStatus}</h5></div>
                              </div>
                              <div className='row py-2'>
                                <div className='col-sm-3'><small>{t`lanEULabelHotel`} {t`lanCommonLabelName`}</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.spPropertyTitle}</h5></div>
                              </div>
                              <div className='row py-2'>
                                <div className='col-sm-3'><small>{t`lanCommonLabelCheckOut`}</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.checkOutDate}</h5></div>
                              </div>
                              <div className='row py-2'>
                                <div className='col-sm-3'><small>{t`lanCommonLabelBookingAmount`}</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.totalPrice}</h5></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                  <div className='card-footer hotelDetails mx-4 mb-4 '>
                    <h5 className='card-title'>{t`lanEULabelHotel`} {t`lanEULabelContactInformation`}</h5>
                    <div className='card-body-footer'>
                      <div className='row clearfix'>
                        <div className='col-md-12 col-lg-12 col-sm-12 col-xl-12'>
                          <div className='row'>
                            <div className='col-sm-6'>
                              <div className='row py-2'>
                                <div className='col-sm-4'><small>{t`lanCommonLabelContactPerson`}</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.spLocationObj ? this.state.bookingData.spLocationObj.contactPerson : ''}</h5></div>
                              </div>
                              <div className='row py-2'>
                                <div className='col-sm-4'><small>{t`lanCommonLabelMobileNumber`}</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.spLocationObj ? this.state.bookingData.spLocationObj.mobileNumber : ''}</h5></div>
                              </div>
                              <div className='row py-2'>
                                <div className='col-sm-4'><small>{t`lanCommonLabelEmail`}</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.spLocationObj ? this.state.bookingData.spLocationObj.email : ''}</h5></div>
                              </div>
                            </div>
                            <div className='col-sm-6'>
                              <div className='col-sm-4'><small>{t`lanCommonLabelAddress`}</small></div>
                              <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.spLocationObj ? this.state.bookingData.spLocationObj.address : ''}</h5></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
EUBookingViewComponent.propTypes = {
  data: PropTypes.any,
  recordId: PropTypes.any,
  handleViewClose: PropTypes.func,
  handleRating: PropTypes.func
}
export default EUBookingViewComponent
