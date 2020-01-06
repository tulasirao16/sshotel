/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
// import { Carousel } from 'react-responsive-carousel'
import { t } from 'ttag'
import PropTypes from 'prop-types'
import moment from 'moment'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import MainHeader from '../HeaderCompnt/MainHeader'
import FooterComponent from '../FooterCompnt/Footer'
import './css/BookingHistoryResponsive.css'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import classnames from 'classnames'

class EUConfirmBookingView extends React.Component {
  constructor (props) {
    super(props)
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    this.state = {
      bookingData: props.postBooking ? props.postBooking : JSON.parse(localStorage.getItem('postBooking')),
      propertyDocs: props.propertyDocs ? props.propertyDocs : JSON.parse(localStorage.getItem('propertyDocs')),
      authObj: JSON.parse(localStorage.getItem('authObj')),
      authToken: localStorage.getItem('token'),
      euName: authObj.name ? authObj.name : '',
      mobileNumber: authObj.mobileNumber ? authObj.mobileNumber : '',
      firstName: '',
      fNError: '',
      lastName: '',
      lNError: '',
      submitDisabled: false,
      back: props.postBooking ? true : false
    }
    this.handleBack = this.handleBack.bind(this)
    this.handleBookAgain = this.handleBookAgain.bind(this)
    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.handleBookingReview = this.handleBookingReview.bind(this)
    this.handleBooking = this.handleBooking.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }
  handleBack () {
    if (this.state.back) {
      this.props.confirmBooking()
    } else {
      hashHistory.push('/hotels/booknow')
    }
    event.preventDefault()
  }
  handleBookAgain (e) {
    hashHistory.push('/hotels/booknow')
    event.preventDefault()
  }
  handleSendMessage (e) {
    hashHistory.push('/sendMessage')
    event.preventDefault()
  }
  handleBookingReview (e) {
    hashHistory.push('/EUreviews')
    event.preventDefault()
  }
  handleBooking () {
    if (this.state.euName && this.state.authObj.mobileNumber) {
      let postData = JSON.parse((JSON.stringify(this.state.bookingData) + JSON.stringify({ name: this.state.authObj.name, contactEuNumber: this.state.authObj.mobileNumber })).replace(/}{/g, ','))
      let obj = { url: config.baseUrl + config.postEUBookingCreateAPI, routing: '/hotels', body: postData }
      let _this = this
      _this.setState({ submitDisabled: true })
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          let localData = {
            token: _this.state.authToken,
            authObj: _this.state.authObj,
            bookingInfo: resObj.data.statusResult,
            contactPerson: resObj.data.statusResult.euName,
            contactNumber: resObj.data.statusResult.euMobileNumber,
            contactEmail: resObj.data.statusResult.euEmail
          }
          let paymentObj = { url: config.baseUrl + config.postEUBookingPaymentURLSetupAPI, routing: '/hotels', body: localData }
          APICallManager.postCall(paymentObj, function (pResObj) {
            _this.setState({ submitDisabled: false })
            if (pResObj.data.statusResult && pResObj.data.statusResult.paymentTxnID) {
              localStorage.setItem('paymentTxnID', pResObj.data.statusResult.paymentTxnID)
              hashHistory.push('/booking/payment')
            }
          })
        } else {
          ToastsStore.error(t`lanEULabelErrorBookingFailedTryAgain`)
        }
      })
    } else {
      if (!this.state.euName && !this.state.firstName.trim()) {
        ToastsStore.error(t`lanCommonLabelErrorFirstNameRequired`)
        this.setState({ fNError: true })
      } else if (!this.state.euName && !this.state.lastName.trim()) {
        ToastsStore.error(t`lanCommonLabelErrorLastNameRequired`)
        this.setState({ lNError: true })
      } else if (!this.state.mobileNumber.trim()) {
        ToastsStore.error(t`lanEULabelErrorMobileNumberRequired`)
      } else {
        let postData = {
          firstName: this.state.authObj.firstName ? this.state.authObj.firstName : this.state.firstName,
          lastName: this.state.authObj.lastName ? this.state.authObj.lastName : this.state.lastName,
          mobileNumber: this.state.authObj.mobileNumber ? this.state.authObj.mobileNumber : this.state.mobileNumber
        }
        let obj = { url: config.baseUrl + config.putEUBookingUserInfoAPI, body: postData }
        let _this = this
        APICallManager.putCall(obj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            _this.setState({ name: resObj.data.statusResult.name, mobileNumber: resObj.data.statusResult.mobileNumber })
            let authObj = JSON.parse(localStorage.getItem('authObj'))
            let authObjName = JSON.parse((JSON.stringify(authObj) +
              JSON.stringify({ name: resObj.data.statusResult.name, firstName: resObj.data.statusResult.firstName, lastName: resObj.data.statusResult.lastName, mobileNumber: resObj.data.statusResult.mobileNumber }))
              .replace(/}{/g, ','))
            localStorage.setItem('authObj', JSON.stringify(authObjName))
            let postData = JSON.parse((JSON.stringify(_this.state.bookingData) + JSON.stringify({ name: resObj.data.statusResult.name, contactEuNumber: resObj.data.statusResult.mobileNumber })).replace(/}{/g, ','))

            let obj = { url: config.baseUrl + config.postEUBookingCreateAPI, routing: '/hotels', body: postData }
            APICallManager.postCall(obj, function (resObj) {
              if (resObj.data.statusCode === '0000') {
                let localData = {
                  token: _this.state.authToken,
                  authObj: authObjName,
                  bookingInfo: resObj.data.statusResult,
                  contactPerson: resObj.data.statusResult.euName,
                  contactNumber: resObj.data.statusResult.euMobileNumber,
                  contactEmail: resObj.data.statusResult.euEmail
                }
                let paymentObj = { url: config.baseUrl + config.postEUBookingPaymentURLSetupAPI, routing: '/hotels', body: localData }
                APICallManager.postCall(paymentObj, function (pResObj) {
                  if (pResObj.data.statusResult && pResObj.data.statusResult.paymentTxnID) {
                    localStorage.setItem('paymentTxnID', pResObj.data.statusResult.paymentTxnID)
                    hashHistory.push('/booking/payment')
                  }
                })
              } else {
                ToastsStore.error(t`lanEULabelErrorBookingFailedTryAgain`)
              }
            })
          } else if (resObj.data.statusCode === '9956') {
            ToastsStore.error(t`lanEULabelErrorMobileNumberAlreadyExistsTryOtherNumorLoginWithSameNum`)
          } else {
            ToastsStore.error(t`lanEULabelErrorSomethingWentWrongPleaseTryAgain`)
          }
        })
      }
    }
  }
  handleHome (event) {
    hashHistory.push('/hotels')
    event.preventDefault()
  }
  render () {
    return (
      <div className='enduser'>
        {this.props.isHeader === 'false' ? null : <MainHeader />}
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center pt-7 pb-5'>
                <div className='col-lg-6 col-7'>
                  {/* <h6 className='h2 text-white d-inline-block mb-0'>{t`lanEUTitleInbox`}</h6> */}
                  <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item eu-font'><a onClick={this.handleBack}>{t`lanEUTitleBookingDetails`}</a></li>
                      <li className='breadcrumb-item active eu-font' aria-current='page'>{t`lanEUTitleConfirmBookingDetails`}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container  mt--6 pb-4'>
          <div className='row justify-content-center inbox'>
            <div className='col-md-10'>
              <div className='card'>
                <div className='card-header py-2'>
                  <div className='row '>
                    <div className='col-sm-7'>
                      <h6 className='h2 text-primary d-inline-block pt-2 eu-font'>{t`lanEUTitleBookingDetails`}</h6>
                    </div>
                  </div>
                </div>
                <div className='card-body'>
                  <div className='container'>
                    <div className='row py-1'>
                      <div className='col-sm-12'>
                        <div className='row'>
                          <div className='col-sm-2'><small>{t`lanCommonLabelAddress`}</small></div>
                          <div className='col-sm-10'><h5 className='mb-0 text-sm'>{this.state.bookingData.spPropertyTitle}, {this.state.bookingData.address}</h5></div>
                        </div>
                      </div>
                    </div>
                    <div className='row py-1'>
                      <div className='col-sm-6'>
                        <div className='row'>
                          <div className='col-sm-4'><small>{t`lanCommonLabelCheckIn`}-{t`lanCommonLabelDate`}</small></div>
                          <div className='col-sm-6'><h5 className='mb-0 text-sm'>{ moment(this.state.bookingData.checkInDate).format('YYYY-MM-DD hh:mm A')}</h5></div>
                        </div>
                      </div>
                      <div className='col-sm-6'>
                        <div className='row'>
                          <div className='col-sm-4'><small>{t`lanCommonLabelCheckOut`}-{t`lanCommonLabelDate`}</small></div>
                          <div className='col-sm-6'><h5 className='mb-0 text-sm'>{moment(this.state.bookingData.checkOutDate).format('YYYY-MM-DD hh:mm A')}</h5></div>
                        </div>
                      </div>
                    </div>
                    <div className='row py-1'>
                      <div className='col-sm-6'>
                        <div className='row'>
                          <div className='col-sm-4'><small>{t`lanEULabelRoomType`}</small></div>
                          <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.spPropertyType}</h5></div>
                        </div>
                      </div>
                      <div className='col-sm-6'>
                        <div className='row'>
                          <div className='col-sm-4'><small>{t`lanEULabelRooms`}</small></div>
                          <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.noOfRooms}</h5></div>
                        </div>
                      </div>
                    </div>
                    <div className='row py-1'>
                      <div className='col-sm-6'>
                        <div className='row'>
                          <div className='col-sm-4'><small>{t`lanEULabelGuests`}</small></div>
                          <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.noOfAdults} {t`lanEULabelAdults`}, {this.state.bookingData.noOfChilds} {t`lanEULabelChilds`}</h5></div>
                        </div>
                      </div>
                      <div className='col-sm-6'>
                        {this.state.bookingData.bookingType === 'Days'
                        ? <div className='row'>
                          <div className='col-sm-4'><small>{t`lanEULabelTotalDays`}</small></div>
                          <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.noOfDays}</h5></div>
                        </div>
                        : <div className='row'>
                          <div className='col-sm-4'><small>{t`lanEULabelTotalDays`}/{t`lanSPLabelHours`}</small></div>
                          {this.state.bookingData.noOfDays > 1
                          ? <div className='col-sm-6'>
                            <h5 className='mb-0 text-sm'>{`${this.state.bookingData.noOfDays} days / ${this.state.bookingData.totalHours} hours`}</h5>
                          </div>
                          : <div className='col-sm-6'>
                            <h5 className='mb-0 text-sm'>{`${this.state.bookingData.noOfDays} day / ${this.state.bookingData.totalHours} hours`}</h5>
                          </div>
                          }
                        </div>
                        }
                      </div>
                    </div>
                    <div className='row py-1'>
                      <div className='col-sm-12'>
                        <div className='row'>
                          <div className='col-sm-2'><small>{t`lanEULabelTotal`} {t`lanCommonLabelBookingAmount`}</small></div>
                          <div className='col-sm-10'><h5 className='mb-0 price-text-confirm-booking text-sm'>₹ {this.state.bookingData.totalPrice} /-</h5></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card-footer hotelDetails mx-4 mb-2 '>
                  <h5 className='card-title'>User Details:</h5>
                  <div className='card-body-footer'>
                    <div className='row py-1'>
                      {this.state.euName
                      ? <div className='col-sm-6'>
                        <div className='row'>
                          <div className='col-sm-4'><small>{t`lanCommonLabelName`}</small></div>
                          <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.euName}</h5></div>
                        </div>
                      </div>
                      : null }
                      {this.state.authObj.mobileNumber
                      ? <div className='col-sm-6'>
                        <div className='row'>
                          <div className='col-sm-4'><small>{t`lanCommonLabelMobileNumber`}</small></div>
                          <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.mobileNumber}</h5></div>
                        </div>
                      </div>
                      : null }
                    </div>

                    {!this.state.euName
                    ? <div className='row py-1'>
                      <div className='col-sm-6'>
                        <div className='row'>
                          <div className='col-sm-4'><small>{t`lanCommonLabelFirstName`}<span className='error'>*</span></small></div>
                          <div className='col-sm-8'>
                            <input type='text' className={classnames('eu-font form-control', { 'input_error' : this.state.fNError })} onChange={(e) => this.setState({ firstName: e.target.value, fNError: false })} />
                          </div>
                        </div>
                      </div>
                      <div className='col-sm-6'>
                        <div className='row'>
                          <div className='col-sm-4'><small>{t`lanCommonLabelLastName`}<span className='error'>*</span></small></div>
                          <div className='col-sm-8'>
                            <input type='text' className={classnames('eu-font form-control', { 'input_error' : this.state.lNError })} onChange={(e) => this.setState({ lastName: e.target.value, lNError: false })} />
                          </div>
                        </div>
                      </div>
                    </div>
                    : null }

                    {!this.state.authObj.mobileNumber
                    ? <div className='row py-1'>
                      <div className='col-sm-6'>
                        <div className='row'>
                          <div className='col-sm-4'><small>{t`lanCommonLabelMobileNumber`}</small></div>
                          <div className='col-sm-8'>
                            <input type='text' className='eu-font form-control' maxLength='10' onChange={(e) => this.setState({ mobileNumber: e.target.value })} />
                          </div>
                        </div>
                      </div>
                    </div>
                    : null }
                  </div>
                </div>
                <div className='row mb-4 '>
                  <div className='col-12 pt-3 text-center'>
                    <button type='button' disabled={this.state.submitDisabled} onClick={this.handleBooking} className='btn btn-primary px-5 eu-font'>{t`lanEUButtonPay`}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.props.isHeader === 'false' ? null : <FooterComponent />}
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}
EUConfirmBookingView.propTypes = {
  confirmBooking: PropTypes.func,
  postBooking: PropTypes.object,
  propertyDocs: PropTypes.array
}

export default EUConfirmBookingView
