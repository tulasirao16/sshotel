import React, { Component } from 'react'
import PropTypes from 'prop-types'

import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

import './css/Payment.css'

class EUBookingMobilePaymentSetup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      authObj: JSON.parse(localStorage.getItem('authObj')),
      bookingPaymentInfo: {}
    }

    this.handlePayments = this.handlePayments.bind(this)
    this.handleGoback = this.handleGoback.bind(this)
  }

  componentDidMount () {
    let baseUri = 'exp://wg-qka.notbrent.app.exp.direct'
    let qs = decodeURIComponent(this.props.location.search)
    if (qs) {
      let baseUri2 = qs.split('?linkingUri=')[1]
      let paramID = (this.props && this.props.params) ? this.props.params.id : ''
      let trxID = paramID.split('/?linkingUri=')[0]
      let postObj = {
        paymentTxnID: trxID,
        mobileAppUri: baseUri2
      }
      let obj = { url: config.baseUrl + config.postEUMobileBookingPaymentSetupAPI, body: postObj }
      let _this = this
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000' && resObj.data.statusResult) {
          _this.setState({
            bookingPaymentInfo: resObj.data.statusResult
          })
        }
      })
    } else {
      window.location.href = baseUri + 'message=404 Error'
    }
  }

  handlePayments (event) {
    if (this.state.bookingPaymentInfo && this.state.bookingPaymentInfo.paymentUrl) {
      window.location.href = this.state.bookingPaymentInfo.paymentUrl
    }
    event.preventDefault()
  }

  handleGoback (event) {
    let baseUri = 'exp://wg-qka.notbrent.app.exp.direct'
    let qs = decodeURIComponent(this.props.location.search)
    if (qs) {
      let baseUri2 = qs.split('?linkingUri=')[1]
      window.location.href = baseUri2
    } else {
      window.location.href = baseUri
    }
    event.preventDefault()
  }

  handleNumberKeys (event) {
    if (event.charCode < 48 || event.charCode > 57) {
      event.preventDefault()
    }
  }

  render () {
    return (
      <div >
        <div className='main-index-main' >
          <div className='main-slider'>
            <div className='container'>{/* /.container */}</div>
          </div>
          <div className='' id='top'>
            <main className='main-content enduser_orderpage'>
              <section className='wb-section' id='products'>
                <div className='container'>
                  <div className='row payment_mobileView'>
                    <div className='col-md-4 col-sm-4'>
                      <div className='card sidebar-card card-payment'>
                        <div className='card-header'>BOOKING SUMMARY </div>
                        <div className='card-content user-info'>
                          <div className='card-body text-center'>
                            <div className='seller-info'>
                              <ul className='list-group mb-0'>
                                <li className='list-group-item d-flex justify-content-between lh-condensed'>
                                  <div>
                                    <h6 className='my-0 mobile-font'>Sub Total</h6>
                                  </div>
                                  <span>₹ {(this.state.bookingPaymentInfo && this.state.bookingPaymentInfo.amount) ? this.state.bookingPaymentInfo.amount + '.00' : '0.00'}</span>
                                </li>
                                <li className='list-group-item d-flex justify-content-between lh-condensed'>
                                  <div>
                                    <h6 className='my-0 mobile-font'>+ Online Charges</h6>
                                  </div>
                                  <span>₹ {(this.state.bookingPaymentInfo && this.state.bookingPaymentInfo.totalAmount && this.state.bookingPaymentInfo.amount) ? parseInt(this.state.bookingPaymentInfo.totalAmount) - parseInt(this.state.bookingPaymentInfo.amount) : '0'}.00</span>
                                </li>
                                <li className='list-group-item d-flex justify-content-between'>
                                  <h6 className='mobile-font'>Amount Payable</h6>
                                  <strong className='mobile-font' >₹ {(this.state.bookingPaymentInfo && this.state.bookingPaymentInfo.totalAmount) ? this.state.bookingPaymentInfo.totalAmount + '.00' : '0.00'}</strong>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-md-8 col-sm-8 '>
                      <div className='wb-product-bo6x mb-4 paymentSection'>
                        <div className='card sidebar-card card-payment'>
                          {/* <h4 className='mb-3'>Billing Details</h4> */}
                          <div className='card-header' style={{ paddingLeft: -5 }}>BILLING DETAILS</div>
                          <div className='row' style={{ padding:15 }} >
                            <div className='col-md-4 mb-3'>
                              <label>Contact Person<span className='require'>*</span></label>
                              <input type='text' value={(this.state.bookingPaymentInfo && this.state.bookingPaymentInfo.bookingId && this.state.bookingPaymentInfo.bookingId.euName) ? this.state.bookingPaymentInfo.bookingId.euName : ''} className='form-control' id='cc-name' disabled={true} />
                            </div>
                            <div className='col-md-4 mb-3'>
                              <label>Contact Mobile #<span className='require'>*</span></label>
                              <input type='text' value={(this.state.bookingPaymentInfo && this.state.bookingPaymentInfo.bookingId && this.state.bookingPaymentInfo.bookingId.euMobileNumber) ? this.state.bookingPaymentInfo.bookingId.euMobileNumber : ''} className='form-control' id='cc-number' disabled={true} />
                            </div>
                            <div className='col-md-4 mb-3'>
                              <label>Email</label>
                              <input type='text' value={(this.state.bookingPaymentInfo && this.state.bookingPaymentInfo.bookingId && this.state.bookingPaymentInfo.bookingId.euEmail) ? this.state.bookingPaymentInfo.bookingId.euEmail : ''} className='form-control' id='cc-name' disabled={true} />
                            </div>
                          </div>
                          <hr className='mb-4'>{/* /.hr */}</hr>
                          <label className='warning'>{this.state.errorMessage}</label>
                          <div className='row' style={{ padding:15 }}>
                            <div className='col-md-4'>
                              <button className='btn btn-primary btn-block' type='' onClick={this.handlePayments} >Continue to Pay</button>
                              <button className='btn btn-primary btn-block' type='' onClick={this.handleGoback} >Back</button>
                            </div>
                          </div>
                        </div>
                      </div>{/* /.wb-about-box */}
                    </div>{/* /.col-md-6 col-lg-6 */}
                  </div>{/* /.row */}
                </div>{/* /.container */}
              </section>
              {/* _____________________________ products section End  _______________________________ */}
              <footer className='app-footer'> <div className='container'> <p><a target='_blank' href='https://ngstek.com/'>NextGen Solutions</a> © 2018</p> </div></footer>
            </main>
            {/* _____________________________ main End  _______________________________ */}

          </div>{/* /.wb-page-wrapper */}

        </div>
      </div>
    )
  }
}
EUBookingMobilePaymentSetup.propTypes = {
  location: PropTypes.any,
  params: PropTypes.any
}
export default EUBookingMobilePaymentSetup

