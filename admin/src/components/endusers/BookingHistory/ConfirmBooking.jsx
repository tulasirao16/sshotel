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
      lastName: '',
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
      let obj = { url: config.baseUrl + config.postEUBookingCreateAPI, body: postData }
      let _this = this
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
          let paymentObj = { url: config.baseUrl + config.postEUBookingPaymentURLSetupAPI, body: localData }
          APICallManager.postCall(paymentObj, function (pResObj) {
            if (pResObj.data.statusResult && pResObj.data.statusResult.paymentTxnID) {
              localStorage.setItem('paymentTxnID', pResObj.data.statusResult.paymentTxnID)
              hashHistory.push('/booking/payment')
            }
          })
        } else {
          alert('Booking failed try again')
        }
      })
    } else {
      if (!this.state.euName && !this.state.firstName.trim()) {
        alert('First Name is Required')
      } else if (!this.state.euName && !this.state.lastName.trim()) {
        alert('Last Name is Required')
      } else if (!this.state.mobileNumber.trim()) {
        alert('Mobile Number is Required')
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

            let obj = { url: config.baseUrl + config.postEUBookingCreateAPI, body: postData }
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
                let paymentObj = { url: config.baseUrl + config.postEUBookingPaymentURLSetupAPI, body: localData }
                APICallManager.postCall(paymentObj, function (pResObj) {
                  if (pResObj.data.statusResult && pResObj.data.statusResult.paymentTxnID) {
                    localStorage.setItem('paymentTxnID', pResObj.data.statusResult.paymentTxnID)
                    hashHistory.push('/booking/payment')
                  }
                })
              } else {
                alert('Booking failed try again')
              }
            })
          } else if (resObj.data.statusCode === '9956') {
            alert('This Mobile Number is Already Exists Please Try With Other Number (or) Login With The Same Number')
          } else {
            alert('Something went wrong please try again')
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
                      <li className='breadcrumb-item active eu-font' aria-current='page'><a >Confirm Booking Details</a></li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container  mt--6 pb-4'>
          <div className='row justify-content-center inbox'>
            <div className='col-md-12'>
              <div className='card'>
                <div className='card-header py-2'>
                  <div className='row '>
                    <div className='col-sm-7'>
                      <h6 className='h2 text-primary d-inline-block pt-2 eu-font'>{t`lanEUTitleBookingDetails`}</h6>
                    </div>
                  </div>
                </div>
                <div className='card-body'>
                  <div className='container-fluid'>
                    <div className='row'>
                      <div className='col-sm-4'>
                        <div className='confirm-booking-page property-pic'>
                          <img src={require('../../../../assets/r2.jpg')} />
                          {/* <Carousel infiniteLoop useKeyboardArrows dynamicHeight showArrows autoPlay onChange={this.onChange} onClickItem={this.onClickItem} onClickThumb={this.onClickThumb}>
                            {this.state.propertyDocs && this.state.propertyDocs.length > 0 ? this.state.propertyDocs.map((item, i) =>
                              <div className='slide-1'>
                                {item.fileType !== 'Video'
                                ? <img src={config.baseUrl + item.imagePath} />
                                : <img src={require('../../../../assets/videos/player-3311600__340.png')} />}
                              </div>
                            ) : null}
                          </Carousel> */}
                        </div>
                      </div>
                      <div className='col-sm-8'>
                        <div className='row row-data-style pb-3' >
                          <div className='col-sm-5'>
                            <h5 className='mb-0 text-sm'>Address:</h5>
                          </div>
                          <div className='col-sm-8'>
                            <small>{this.state.bookingData.spPropertyTitle}</small>
                            <address className='mb-0 text-sm eu-font'>{this.state.bookingData.address}</address>
                          </div>

                          {/* <div className='col- text-left'>
                            <small>{this.state.bookingData.spPropertyTitle}</small>
                            <address className='mb-0 text-sm eu-font'>{this.state.bookingData.address}</address>
                          </div> */}
                        </div>
                        <div className='row row-data-style py-1 '>
                          <div className='col-12 col-sm-3 '>
                            <small>{t`lanEULabelRoomType`}</small>
                          </div>
                          <div className='col-12 col-sm-9 '>
                            <h5 className='mb-0 text-sm'>{t`lanEULabelHotel`}</h5>
                          </div>
                        </div>
                        <div className='row row-data-style py-1 '>
                          <div className='col-12 col-sm-3 '>
                            <small>{t`lanCommonLabelCheckIn`}-{t`lanCommonLabelDate`}</small>
                          </div>
                          <div className='col-sm-9 col-12 '>
                            <h5 className='mb-0 text-sm'>{ moment(this.state.bookingData.checkInDate).format('YYYY-MM-DD hh:mm A')}</h5>
                          </div>
                        </div>
                        <div className='row row-data-style py-1 '>
                          <div className='col-12 col-sm-3 text-left'>
                            <small>{t`lanCommonLabelCheckOut`}-{t`lanCommonLabelDate`}</small>
                          </div>
                          <div className='col-sm-9 col-12 '>
                            <h5 className='mb-0 text-sm'>{moment(this.state.bookingData.checkOutDate).format('YYYY-MM-DD hh:mm A')}</h5>
                          </div>
                        </div>
                        <div className='row row-data-style py-1 '>
                          <div className='col-12 col-sm-3 text-left'>
                            <small>{t`lanEULabelGuests`}</small>
                          </div>
                          <div className='col-12 col-sm-9 '>
                            <h5 className='mb-0 text-sm'>{this.state.bookingData.noOfAdults} {t`lanEULabelAdults`}, {this.state.bookingData.noOfChilds} {t`lanEULabelChilds`} </h5>
                          </div>
                        </div>
                        <div className='row row-data-style py-1 '>
                          <div className='col-12 col-sm-3 text-left'>
                            <small>{t`lanEULabelRooms`}</small>
                          </div>
                          <div className='col-12 col-sm-9'>
                            <h5 className='mb-0 text-sm'>{this.state.bookingData.noOfRooms}</h5>
                          </div>
                        </div>
                        <div className='row row-data-style py-1 '>
                          <div className='col-12 col-sm-3 text-left'>
                            <small>{t`lanEULabelTotal`} {t`lanCommonLabelBookingAmount`}</small><br />
                          </div>
                          <div className='col-12 col-sm-9 '>
                            <h5 className='mb-0 text-sm'>₹ {this.state.bookingData.totalPrice} </h5>
                          </div>
                        </div>
                        <div className='row row-data-style py-1 '>
                          <div className='col-12 col-sm-3 text-left'>
                            <small>{t`lanEULabelTotalDays`}</small>
                          </div>
                          <div className='col-12 col-sm-9 '>
                            <h5 className='mb-0 text-sm'>{this.state.bookingData.noOfDays}</h5>
                          </div>
                        </div>
                        {this.state.euName
                        ? <div className='row row-data-style py-1 '>
                          <div className='col-12 col-sm-3 text-left'>
                            <small>Name</small>
                          </div>
                          <div className='col-12 col-sm-9 '>
                            <h5 className='mb-0 text-sm'>{this.state.euName} </h5>
                          </div>
                        </div>
                        : <div>
                          <div className='row py-1 '>
                            <div className='col-12 col-sm-3 text-left'>
                              <small> First Name <span className='error'>*</span></small>
                            </div>
                            <div className='col-12 col-sm-6 '>
                              <input type='text' className='eu-font form-control' onChange={(e) => this.setState({ firstName: e.target.value })} />
                            </div>
                          </div>
                          <div className='row py-1 '>
                            <div className='col-12 col-sm-3 text-left'>
                              <small>Last Name <span className='error'>*</span></small>
                            </div>
                            <div className='col-12 col-sm-6'>
                              <input type='text' className='eu-font form-control' onChange={(e) => this.setState({ lastName: e.target.value })} />
                            </div>
                          </div>
                        </div>
                      }
                        {this.state.authObj.mobileNumber
                        ? <div className='row row-data-style py-1 '>
                          <div className='col-12 col-sm-3 text-left'>
                            <small>Mobile Number</small><br />
                          </div>
                          <div className='col-12 col-sm-9'>
                            <h5 className='mb-0 text-sm'>{this.state.mobileNumber} </h5>
                          </div>
                        </div>
                        : <div className='row py-1 '>
                          <div className='col-12 col-sm-3 text-left'>
                            <small>Mobile Number</small><br />
                          </div>
                          <div className='col-12 col-sm-6 '>
                            <input type='text' className='eu-font form-control' maxLength='10' onChange={(e) => this.setState({ mobileNumber: e.target.value })} />
                          </div>
                        </div>
                        }
                        <div className='row py-1 '>
                          {/* <div className='col-12 pt-3 text-right'>
                            <button type='button' onClick={this.handleBack} className='btn btn-primary'>{t`lanCommonButtonBack`}</button>
                          </div> */}
                          <div className='col-12 pt-3 text-left'>
                            <button type='button' onClick={this.handleBooking} className='btn btn-primary px-5 eu-font'>Pay</button>
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
        {this.props.isHeader === 'false' ? null : <FooterComponent />}
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
