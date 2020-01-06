import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import MainHeader from '../../../components/endusers/HeaderCompnt/MainHeader'
import FooterComponent from '../../../components/endusers/FooterCompnt/Footer'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import { t } from 'ttag'
import './css/Payment.css'

class EUBookingPayment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      mobile: '',
      email: '',
      errorMessage: '',
      bookingInfo: {},
      bookingPaymentInfo: ''
    }

    this.handlePayments = this.handlePayments.bind(this)
    this.handleGoback = this.handleGoback.bind(this)
  }

  componentWillMount () {
    let paymentTxnID = localStorage.getItem('paymentTxnID')
    let obj = { url: config.baseUrl + config.getEUBookingPaymentSetupAPI + paymentTxnID }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusResult && resObj.data.statusResult._id) {
        _this.setState({
          bookingPaymentInfo: resObj.data.statusResult,
          name: resObj.data.statusResult.bookingId ? resObj.data.statusResult.bookingId.euName : '',
          mobile: resObj.data.statusResult.bookingId ? resObj.data.statusResult.bookingId.euMobileNumber : '',
          email: resObj.data.statusResult.bookingId ? resObj.data.statusResult.bookingId.euEmail : ''
        })
      }
    })
  }

  handlePayments (event) {
    if (this.state.bookingPaymentInfo && this.state.bookingPaymentInfo.paymentUrl) {
      window.location.href = this.state.bookingPaymentInfo.paymentUrl
    }
    event.preventDefault()
  }

  handleGoback (event) {
    hashHistory.push('/hotels/booknow/confirm')
    event.preventDefault()
  }

  handleNumberKeys (event) {
    if (event.charCode < 48 || event.charCode > 57) {
      event.preventDefault()
    }
  }

  render () {
    return (
      <div className='enduser' >
        <MainHeader />
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
                      <li className='breadcrumb-item eu-font'><a onClick={this.handleGoback} >Confirm Booking Details</a></li>
                      <li className='breadcrumb-item active eu-font' aria-current='page'><a >Payment</a></li>
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
              <div className='card mb-0'>
                <div className='card-header'>
                  <h6 className='h2 text-primary d-inline-block'>Billing Details</h6>
                </div>
                <div className='card-body'>
                  <div className='row payment_webView'>
                    <div className='col-md-8 col-sm-8 '>
                      <div className='wb-product-bo6x mb-4 paymentSection'>
                        <div className='row'>
                          <div className='col-md-6 mb-3'>
                            <label className='label-lg'>Contact Person<span className='require'>*</span></label>
                            <input type='text' value={this.state.name} onChange={(event) => this.setState({ name: event.target.value, errorMessage: '' })}
                              className='form-control eu-font' id='cc-name' placeholder='' minLength={3} maxLength={20} disabled />
                          </div>
                          <div className='col-md-6 mb-3'>
                            <label className='label-lg'>Contact Mobile #<span className='require'>*</span></label>
                            <input type='text' value={this.state.mobile}
                              onChange={(event) => this.setState({ mobile: event.target.value, errorMessage: '' })} onKeyPress={this.handleNumberKeys}
                              className='form-control eu-font' id='cc-number' placeholder='' maxLength={10} pattern='\d{10}' disabled />
                          </div>
                          <div className='col-md-6 mb-3'>
                            <label className='label-lg' >Email</label>
                            <input type='text' value={this.state.email}
                              onChange={(event) => this.setState({ email: event.target.value, errorMessage: '' })} className='eu-font form-control' id='cc-name' placeholder='' maxLength={60} disabled />
                          </div>
                        </div>
                        <hr className='mb-4'>{/* /.hr */}</hr>
                        <label className='warning'>{this.state.errorMessage}</label>
                        <div className='row'>
                          <div className='col-md-12 text-center'>
                            <button className='btn btn-primary btn-text-white ' type='' onClick={this.handlePayments} >Continue to Pay</button>
                            <button className='btn btn-outline-info' style={{ width:110 }} type='' onClick={this.handleGoback} >Back</button>
                          </div>
                        </div>
                      </div>{/* /.wb-about-box */}
                    </div>{/* /.col-md-6 col-lg-6 */}
                    <div className='col-md-4 col-sm-4'>
                      <div className='card sidebar-card card-payment mb-0'>
                        <div className='card-header'>
                          <h6 className='h2 text-primary d-inline-block'>Booking Summury</h6></div>
                        <div className='card-content user-info'>
                          <div className='card-body text-center'>
                            <div className='seller-info'>
                              <ul className='list-group mb-3'>
                                <li className='list-group-item d-flex justify-content-between lh-condensed'>
                                  <div>
                                    <p className='my-0 eu-font'>Sub Total</p>
                                  </div>
                                  <span className='eu-font'>₹ {(this.state.bookingPaymentInfo && this.state.bookingPaymentInfo.amount) ? this.state.bookingPaymentInfo.amount + '.00' : '0.00'}</span>
                                </li>
                                <li className='list-group-item d-flex justify-content-between lh-condensed'>
                                  <div>
                                    <p className='my-0 eu-font'>+ Online Charges</p>
                                  </div>
                                  <span className='eu-font'>₹ {(this.state.bookingPaymentInfo && this.state.bookingPaymentInfo.totalAmount && this.state.bookingPaymentInfo.amount)
                                    ? parseInt(this.state.bookingPaymentInfo.totalAmount) - parseInt(this.state.bookingPaymentInfo.amount) : '0'}.00</span>
                                </li>
                                <li className='list-group-item d-flex justify-content-between'>
                                  <p className='eu-font font-weight-600'>Amount Payable</p>
                                  <strong className='eu-font'>₹ {(this.state.bookingPaymentInfo && this.state.bookingPaymentInfo.totalAmount) ? this.state.bookingPaymentInfo.totalAmount + '.00' : '0.00'}</strong>
                                </li>
                              </ul>
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
        <FooterComponent />
      </div>
    )
  }
}

export default EUBookingPayment

