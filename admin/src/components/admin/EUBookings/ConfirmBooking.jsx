import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import PropTypes from 'prop-types'
import moment from 'moment'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import 'react-drawer/lib/react-drawer.css'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'

class ADEUConfirmBookingView extends React.Component {
  constructor (props) {
    super(props)
    let userData = JSON.parse(localStorage.getItem('userData'))
    this.state = {
      bookingData: props.postBooking ? props.postBooking : JSON.parse(localStorage.getItem('postBooking')),
      propertyDocs: props.propertyDocs ? props.propertyDocs : JSON.parse(localStorage.getItem('propertyDocs')),
      authObj: JSON.parse(localStorage.getItem('authObj')),
      authToken: localStorage.getItem('token'),
      euUserId:userData && userData._id ? userData._id : '',
      userMobileNumber: userData && userData.mobileNumber ? userData.mobileNumber : '',
      mobileNumber: userData && userData.mobileNumber ? userData.mobileNumber : '',
      email: userData && userData.email.includes('@') ? userData.email : '',
      userEmail: userData && userData.email.includes('@') ? userData.email : '',
      euName: userData && userData.name ? userData.name : '',
      name: userData && userData.name ? userData.name : '',
      firstName: '',
      lastName: '',
      back: !!props.postBooking,
      gotMobileDetails: !!(userData && userData.mobileNumber),
      gotEmailDetails: !!(userData && userData.email),
      validUser: !!userData,
      btnDisabled: false,
      booknow: localStorage.getItem('booknow')
    }
    this.handleBack = this.handleBack.bind(this)
    this.handleBooking = this.handleBooking.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleMobileGetDetails = this.handleMobileGetDetails.bind(this)
    this.handleEmailGetDetails = this.handleEmailGetDetails.bind(this)
  }
  componentWillMount () {
    document.addEventListener('keypress', this.boundEnter)
  }
  componentWillUnmount () {
    document.removeEventListener('keypress', this.boundEnter)
    localStorage.removeItem('booknow')
  }
  boundEnter = target => {
    if (target.charCode === 13) {
      this.handleBooking()
    }
  }
  handleBack () {
    if (this.state.back) {
      this.props.confirmBooking()
    } else {
      hashHistory.push('/admin/eu/booking')
    }
    event.preventDefault()
  }
  handleBooking () {
    if (!this.state.mobileNumber.trim()) {
      ToastsStore.error('Mobile Number is Required')
    } else if (!this.state.gotMobileDetails) {
      ToastsStore.error('Please click on mobile Get Details to get user details')
    } else if (!this.state.email.trim()) {
      ToastsStore.error('Email is Required')
      this.email.focus()
    } else if (!this.state.gotEmailDetails) {
      ToastsStore.error('Please click on Email Get Details to get user details')
      this.email.focus()
    } else if (!this.state.euName) {
      ToastsStore.error('Name is Required')
      this.name.focus()
    } else if (!this.state.btnDisabled) {
      this.setState({ btnDisabled: true })
      let postData = JSON.parse((JSON.stringify(this.state.bookingData) +
       JSON.stringify({ euUserId: this.state.euUserId, name: this.state.euName, euEmail: this.state.email, contactEuNumber: this.state.mobileNumber, validUser: this.state.validUser })).replace(/}{/g, ','))
      let obj = { url: config.baseUrl + config.postSPEndUserBookingAPI, body: postData }
      let _this = this
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          setTimeout(() => {
            if (_this.state.booknow === 'admin-bookingHistory') {
              hashHistory.push('/admin/bookinghistory')
            } else if (_this.state.booknow === 'ad-hostbookings') {
              hashHistory.push('/admin/host/property/bookings')
            } else if (_this.state.booknow === 'eu-bookingHistory') {
              hashHistory.push('/admin/eu/booking-history')
            } else if (_this.state.booknow === 'favourates') {
              hashHistory.push('/admin/eu/favourites')
            } else if (_this.state.booknow === 'eu-bookingData') {
              hashHistory.push('admin/eu/booking-history')
            } else {
              hashHistory.push('/admin/eu/home')
            }
          }, 2000)
          ToastsStore.success('successfully booked')
        } else {
          ToastsStore.error('Booking failed try again')
          _this.setState({ btnDisabled: false })
        }
      })
    }
  }
  handleHome (event) {
    hashHistory.push('/admin/eu/home')
    event.preventDefault()
  }
  handleMobileGetDetails = () => {
    const reg = /^[0]?[6789]\d{9}$/
    if (this.state.mobileNumber === '' || this.state.mobileNumber === 'undefined') {
      ToastsStore.error('Please provide mobile Number')
    } else if (reg.test(this.state.mobileNumber) === false) {
      ToastsStore.error('Invalid number please provide a valid mobile Number')
    } else {
      let getEUDetails = {
        url: config.baseUrl + config.getSPEndUserDetailsAPI + this.state.mobileNumber
      }
      let _this = this
      APICallManager.getCall(getEUDetails, function (resObj) {
        if (resObj.data.statusCode === '9987') {
          _this.setState({ euUserId: resObj.data.statusResult._id,
            euName: resObj.data.statusResult.name,
            email: resObj.data.statusResult.email,
            gotMobileDetails: true,
            validUser: true
          })
        } else {
          _this.setState({ gotMobileDetails: true })
        }
      })
    }
    !this.state.email ? this.setState({ gotEmailDetails: true }) : this.setState({ gotEmailDetails: false })
  }
  handleEmailGetDetails = () => {
    const reg = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
    if (this.state.email === '' || this.state.email === 'undefined') {
      ToastsStore.error('Please provide Email Id')
    } else if (reg.test(this.state.email) === false) {
      ToastsStore.error('Invalid Email please provide a valid Email Address')
    } else {
      let getEUDetails = {
        url: config.baseUrl + config.getSPEndUserDetailsAPI + this.state.email
      }
      let _this = this
      APICallManager.getCall(getEUDetails, function (resObj) {
        if (resObj.data.statusCode === '9987') {
          _this.setState({ euUserId: resObj.data.statusResult._id,
            euName: resObj.data.statusResult.name,
            mobileNumber: resObj.data.statusResult.mobileNumber,
            gotEmailDetails: true,
            validUser: true
          })
        } else {
          _this.setState({ gotEmailDetails: true })
        }
      })
    }
  }
  render () {
    return (
      <div className='enduser'>
        {/* {this.props.isHeader === 'false' ? null : <MainHeader />} */}
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center pt-4 pb-4'>
                <div className='col-lg-6 col-7'>
                  {/* <h6 className='h2 text-white d-inline-block mb-0'>{t`lanEUTitleInbox`}</h6> */}
                  <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item eu-font'><a onClick={this.handleBack}>{t`lanEUTitleBookingDetails`}</a></li>
                      <li className='breadcrumb-item active eu-font' aria-current='page'>{t`lanCommonButtonConfirm`} {t`lanCommonLabelBooking`}</li>
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
                        <div className='row pb-2' >
                          <div className='col-sm-3'>
                            <small className='mb-0 text-sm'>{t`lanCommonLabelPropertyTitle`}:</small>
                          </div>
                          <div className='col-sm-9'>
                            <h5>{this.state.bookingData.spPropertyTitle}</h5>
                          </div>
                        </div>
                        <div className='row pb-2' >
                          <div className='col-sm-3'>
                            <small className='mb-0 text-sm'>{t`lanCommonLabelAddress`}:</small>
                          </div>
                          <div className='col-sm-9'>
                            <h5><address className='mb-0 text-sm eu-font'>{this.state.bookingData.address}</address></h5>
                          </div>
                        </div>
                        <div className='row row-data-style py-1 '>
                          <div className='col-12 col-sm-3 '>
                            <small>{t`lanEULabelRoomType`}</small>
                          </div>
                          <div className='col-12 col-sm-9 '>
                            <h5 className='mb-0 text-sm'>{this.state.bookingData.spPropertyType}</h5>
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
                            {this.state.bookingData.bookingType === 'Hours'
                             ? <small>{t`lanEULabelTotalHours`}</small>
                             : <small>{t`lanEULabelTotalDays`}</small>}
                          </div>
                          <div className='col-12 col-sm-9 '>
                            {this.state.bookingData.bookingType === 'Hours'
                             ? <h5 className='mb-0 text-sm'>{this.state.bookingData.noOfDays} {this.state.bookingData.noOfDays > 1 ? 'days' : 'day'} / {this.state.bookingData.totalHours} hours</h5>
                             : <h5 className='mb-0 text-sm'>{this.state.bookingData.noOfDays} {this.state.bookingData.noOfDays > 1 ? 'days' : 'day'}</h5>}
                          </div>
                        </div>
                        <div>
                          <div className='row py-1 '>
                            <div className='col-12 col-sm-3 text-left'>
                              <small>{t`lanCommonLabelMobileNumber`}</small>{this.state.userMobileNumber ? '' : <span className='text-danger'> *</span>}
                            </div>
                            {this.state.userMobileNumber
                              ? <div className='col-12 col-sm-6 '>
                                <h5 className='mb-0 text-sm'>{this.state.mobileNumber}</h5>
                              </div>
                              : <div className='col-12 col-sm-6 '>
                                <input type='text' autoFocus className='eu-font form-control' maxLength='10' value={this.state.mobileNumber}
                                  onChange={(e) => this.setState({ mobileNumber: e.target.value, gotMobileDetails: false })} />
                                <a className='getMobile' style={{ float: 'right', position: 'relative', bottom: 33, right:10 }} onClick={this.handleMobileGetDetails} >
                                  <small className='text-success'>{t`lanCommonButtonGetDetails`}</small><span className='text-danger'> *</span></a>
                              </div>}
                          </div>
                          <div className='row py-1 '>
                            <div className='col-12 col-sm-3 text-left'>
                              <small>{t`lanCommonLabelEmail`}</small>{this.state.userEmail ? '' : <span className='text-danger'> *</span>}
                            </div>
                            {this.state.userEmail
                            ? <div className='col-12 col-sm-6 '>
                              <h5 className='mb-0 text-sm'>{this.state.email}</h5>
                            </div>
                            : <div className='col-12 col-sm-6 '>
                              <input type='text' className='eu-font form-control' ref={(input) => { this.email = input }} value={this.state.email}
                                onChange={(e) => this.setState({ email: e.target.value, gotEmailDetails:false })} />
                              <a className='getMobile' style={{ float: 'right', position: 'relative', bottom: 33, right:10 }} onClick={this.handleEmailGetDetails} >
                                <small className='text-success'>{t`lanCommonButtonGetDetails`}</small><span className='text-danger'> *</span></a>
                            </div>}
                          </div>
                          <div className='row py-1 '>
                            <div className='col-12 col-sm-3 text-left'>
                              <small>{t`lanCommonLabelName`}</small>{this.state.name ? '' : <span className='text-danger'> *</span>}
                            </div>
                            {this.state.name
                            ? <div className='col-12 col-sm-6'>
                              <h5 className='mb-0 text-sm'>{this.state.euName}</h5>
                            </div>
                            : <div className='col-12 col-sm-6'>
                              <input type='text' className='eu-font form-control' ref={(input) => { this.name = input }} value={this.state.euName} onChange={(e) => this.setState({ euName: e.target.value })} />
                            </div>}
                          </div>
                        </div>
                        <div className='row py-1 '>
                          <div className='col-2 pt-3 text-left'>
                            <button type='button' onClick={this.handleBack} className='btn btn-info'>{t`lanCommonButtonBack`}</button>
                          </div>
                          <div className='col-6 pt-3'>
                            <button type='button' onClick={this.handleBooking} disabled={this.state.btnDisabled} style={this.state.btnDisabled
                               ? { cursor: 'not-allowed' } : null} className='btn btn-primary px-5 eu-font'>{t`lanCommonButtonConfirm`} {t`lanCommonLabelBooking`}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
        </div>
      </div>
    )
  }
}
ADEUConfirmBookingView.propTypes = {
  confirmBooking: PropTypes.func,
  postBooking: PropTypes.object,
  propertyDocs: PropTypes.array
}

export default ADEUConfirmBookingView
