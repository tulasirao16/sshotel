/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import PropTypes from 'prop-types'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'

import moment from 'moment'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import ApiCallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'

class ADBookingsViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      recordId: this.props.recordId ? this.props.recordId : '',
      bookingData: {},
      bookingType: '',
      propertiesBookings:localStorage.getItem('propertiesBookings'),
      propertiesBookingsHost:localStorage.getItem('propertiesBookingsHost'),
      propertiesBy:localStorage.getItem('propertiesBy')
    }
    this.handleBack = this.handleBack.bind(this)
  }
  componentWillMount () {
    if (this.state.recordId) {
      let obj = { url: config.baseUrl + config.getADBookingDataAPI + this.state.recordId }
      let _this = this
      ApiCallManager.getCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ bookingData: resObj.data.statusResult, bookingType: resObj.data.statusResult.bookingType })
        } else {
          _this.setState({ bookingData: {} })
        }
      })
    } else {
      let bookingData = JSON.parse(localStorage.getItem('bookingData'))
      this.setState({
        bookingData: bookingData,
        bookingType: bookingData.bookingType
      })
    }
  }
  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handlePropertiesList () {
    localStorage.setItem('propertiesBy', 'Dashboard')
    hashHistory.push('/admin/host/properties')
  }
  handleBack () {
    if (this.state.propertiesBookings === 'properties' && this.state.propertiesBy === 'Dashboard') {
      hashHistory.push('/admin/host/property/bookings')
    } else if (this.state.propertiesBookingsHost === 'propertiesHost') {
      hashHistory.push('/admin/host/property/bookings')
    } else {
      hashHistory.push('/admin/bookinghistory')
    }
    event.preventDefault()
  }
  handleHostsList () {
    hashHistory.push('/admin/hosts')
  }

  componentWillUnmount () {
    localStorage.removeItem('propertiesBookings')
    localStorage.removeItem('propertiesBookingsHost')
    localStorage.removeItem('bookingView')
  }
  render () {
    return (
      <div>
        <DrawerWithHeader />
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-md-6 col-12'>
                  <nav aria-label='breadcrumb' className='d-md-inline-block ml-md-4'>
                    {this.state.propertiesBookings === 'properties' && this.state.propertiesBy === 'Dashboard'
                    ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={this.handlePropertiesList} >{t`lanSPTitlePropertiesList`}</a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleBack}>Bookings-Page</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>Bookings-Page-View</li>
                    </ol>
                    : this.state.propertiesBookingsHost === 'propertiesHost'
                     ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                       <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                       <li className='breadcrumb-item'><a onClick={this.handleHostsList} >{t`lanADTitleHostsHostsList`}</a></li>
                       <li className='breadcrumb-item'><a onClick={this.handlePropertiesList}>{t`lanSPTitlePropertiesList`}</a></li>
                       <li className='breadcrumb-item'><a onClick={this.handleBack}>{t`lanCommonTitleBookings`}</a></li>
                       <li className='breadcrumb-item active' aria-current='page'>{ t`lanSPTitleBookingsHistoryView` }</li>
                     </ol>
                    : <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleBack}>Bookings History</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>{ t`lanSPTitleBookingsHistoryView` }</li>
                    </ol>}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6 pb-4'>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-12 card-wrapper'>
              <div className='row'>
                <div className='col-sm-8 col-xs-12 col-lg-8'>
                  <div className='card mb-2'>
                    <div className='row card-header bg-transparent pb-3'>
                      <div className='col-10'>
                        <h5 className='card-title'>{t`lanSPLabelBookingDetails`}</h5>
                      </div>
                      <div className='col-2'>
                        <button className='btn btn-info' onClick={this.handleBack}>{t`lanCommonButtonBack`}</button>
                      </div>
                    </div>
                    <div className='card-body booking-view'>
                      <section className='notifications'>
                        <div className='row clearfix'>
                          <div className='col-md-12 col-lg-12 col-xl-12'>
                            {/* List group */}
                            <ul className='list-group list-group-flush list my--3'>
                              <li className='list-group-item px-0'>
                                <div className='row align-items-center'>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{t`lanCommonLabelBookingCode`}</small>
                                    <h5 className='mb-0'>{this.state.bookingData && this.state.bookingData.bookingCode ? this.state.bookingData.bookingCode : ''}</h5>
                                  </div>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{t`lanCommonLabelBookedBy`}</small>
                                    <h5 className='mb-0'>{this.state.bookingData && this.state.bookingData.euName ? this.state.bookingData.euName : ''}</h5>
                                  </div>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{t`lanCommonLabelMobileNumber`}</small>
                                    <h5 className='mb-0'>{this.state.bookingData && this.state.bookingData.euMobileNumber ? this.state.bookingData.euMobileNumber : ''}</h5>
                                  </div>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{t`lanSPLabelNumberOfPersons`}</small>
                                    <h5 className='mb-0'>{this.state.bookingData && this.state.bookingData.noOfAdults ? this.state.bookingData.noOfAdults : ''}
                                      {t`lanSPLabelAdults`}, {this.state.bookingData && this.state.bookingData.noOfChilds ? this.state.bookingData.noOfChilds : '0'} {t`lanSPLabelChilds`}</h5>
                                  </div>
                                </div>
                              </li>
                              <li className='list-group-item px-0'>
                                <div className='row align-items-center'>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{t`lanCommonLabelNumberOfRooms`}</small>
                                    <h5 className='mb-0'>{this.state.bookingData && this.state.bookingData.noOfRooms ? this.state.bookingData.noOfRooms : ''}</h5>
                                  </div>
                                  {this.state.bookingType === 'Days'
                                  ? <div className='col-md-3 col-6'>
                                    <small className='view-title'>{t`lanSPLabelTotalDays`}</small>
                                    <h5 className='mb-0'>{this.state.bookingData && this.state.bookingData.totalDays ? this.state.bookingData.totalDays : 0}</h5>
                                  </div>
                                  : <div className='col-md-3 col-6'>
                                    <small className='view-title'>{t`lanSPLabelTotalDays`} / Hour(s)</small>
                                    {this.state.bookingData.totalDays && this.state.bookingData.totalDays > 1
                                    ? <h5 className='mb-0'>{this.state.bookingData.totalDays} days / {this.state.bookingData.totalHours} hours</h5>
                                    : <h5 className='mb-0'>{this.state.bookingData.totalDays} day / {this.state.bookingData.totalHours} hours</h5>}
                                  </div>}
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{t`lanCommonLabelCheckIn`}</small>
                                    <h5 className='mb-0'>{this.state.bookingData && this.state.bookingData.checkInDate ? moment(this.state.bookingData.checkInDate).format('MMM DD,YY(hh:mm A)') : ''}</h5>
                                  </div>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{t`lanCommonLabelCheckOut`}</small>
                                    <h5 className='mb-0'>{this.state.bookingData && this.state.bookingData.checkOutDate ? moment(this.state.bookingData.checkOutDate).format('MMM DD,YY(hh:mm A)') : ''}</h5>
                                  </div>
                                </div>
                              </li>
                              <li className='list-group-item px-0'>
                                <div className='row align-items-center'>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{t`lanSPLabelPaymentMode`}</small>
                                    <h5 className='mb-0'>{this.state.bookingData && this.state.bookingData.paymentMode ? this.state.bookingData.paymentMode : ''}</h5>
                                  </div>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{t`lanCommonLabelBookingAmount`}</small>
                                    <h5 className='mb-0'>{this.state.bookingData && this.state.bookingData.totalPrice ? this.state.bookingData.totalPrice : ''}</h5>
                                  </div>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{t`lanSPLabelPaymentStatus`}</small>
                                    <h5 className='mb-0'>{this.state.bookingData && this.state.bookingData.paymentStatus ? this.state.bookingData.paymentStatus : ''}</h5>
                                  </div>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{t`lanCommonLabelStatus`}</small>
                                    <h5 className='mb-0'>{this.state.bookingData && this.state.bookingData.bookingStatus ? this.state.bookingData.bookingStatus : ''}</h5>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
                <div className='col-sm-4 col-xs-12 col-lg-4'>
                  <div className='card mb-2'>
                    <div className='card-header bg-transparent pb-3'>
                      <h5 className='card-title'>{this.state.bookingData && this.state.bookingData.spServiceProvider ? this.state.bookingData.spServiceProvider : ''}</h5>
                    </div>
                    <div className='card-body booking-view'>
                      <section className='notifications'>
                        <div className='row clearfix'>
                          <div className='col-md-12 col-lg-12 col-xl-12'>
                            <ul className='list-group list-group-flush list my--3'>
                              <li className='list-group-item-one'>
                                <div className='row each-row align-items-center py-1'>
                                  <div className='col-lg-6'>
                                    <small className='view-title'>{t`lanCommonLabelContactPerson`}</small>
                                  </div>
                                  <div className='col-lg-12'>
                                    <h5 className='mb-0'>{this.state.bookingData.spLocationObj && this.state.bookingData.spLocationObj.contactPerson ? this.state.bookingData.spLocationObj.contactPerson : ''}</h5>
                                  </div>
                                </div>
                                <div className='row each-row align-items-center py-1'>
                                  <div className='col-lg-6'>
                                    <small className='view-title'>{t`lanCommonLabelMobileNumber`}</small>
                                  </div>
                                  <div className='col-lg-12'>
                                    <h5 className='mb-0'>{this.state.bookingData.spLocationObj && this.state.bookingData.spLocationObj.mobileNumber ? this.state.bookingData.spLocationObj.mobileNumber : ''}</h5>
                                  </div>
                                </div>
                                <div className='row each-row align-items-center py-1'>
                                  <div className='col-lg-6'>
                                    <small className='view-title'>{t`lanCommonLabelEmail`}</small>
                                  </div>
                                  <div className='col-lg-12'>
                                    <h5 className='mb-0'>{this.state.bookingData.spLocationObj && this.state.bookingData.spLocationObj.email ? this.state.bookingData.spLocationObj.email : ''}</h5>
                                  </div>
                                </div>
                                <div className='row each-row align-items-center py-1'>
                                  <div className='col-lg-6'>
                                    <small className='view-title'>{t`lanCommonLabelAddress`}</small>
                                  </div>
                                  <div className='col-lg-12'>
                                    <h5 className='mb-0'>{this.state.bookingData.spLocationObj && this.state.bookingData.spLocationObj.address ? this.state.bookingData.spLocationObj.address : ''}</h5>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </section>
                    </div>
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
ADBookingsViewComponent.propTypes = {
  recordId: PropTypes.any
}
export default ADBookingsViewComponent
