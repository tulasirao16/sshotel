import React from 'react'
import PropTypes from 'prop-types'

import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

class EUBookingMobilePaymentSuccess extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      amount: '',
      bookingInfo: {},
      paymentMode: '',
      mobileAppUri: 'exp://wg-qka.notbrent.app.exp.direct',
      paymentResHash: '',
      paymentResGatewayStatus: ''
    }

    this.handleRedirect = this.handleRedirect.bind(this)
  }

  componentWillMount () {
    let _this = this
    let paymentResHash = this.props && this.props.params ? this.props.params.id : ''
    let obj = { url: config.baseUrl + config.getEUBookingPaymentGatewayResponseStatusAPI + paymentResHash }
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusResult && resObj.data.statusResult._id) {
        let pgrsObj = resObj.data.statusResult
        _this.setState({
          amount: pgrsObj.totalAmount,
          mobileAppUri: pgrsObj.mobileAppUri,
          paymentResHash: paymentResHash,
          paymentResGatewayStatus: pgrsObj.paymentResGatewayStatus,
          bookingInfo: pgrsObj.bookingId,
          paymentMode: pgrsObj.paymentResMode
        })
      }
    })
  }

  handleRedirect (event) {
    window.location.href = this.state.mobileAppUri + 'RESHASH=' + this.state.paymentResGatewayStatus + 'RESHASH=' + this.state.paymentResHash
    event.preventDefault()
  }

  render () {
    return (
      <div>
        <div className='main-index-main'>
          <div className='' id='top'>
            <main className='main-content enduser_payment' style={{ paddingTop:'2%' }} >
              <section className='wb-section ' id='products'>
                <div className='container'>
                  <div className='row mobileView_paymentsuccess'>
                    <div className='col-md-12 page-content'>
                      <div className='inner-box category-content' style={{ height:'83vh', marginBottom:5 }} >
                        <div className='row' >
                          <div className='col-sm-12 col-12 text-center' >
                            <div className='card mb-2'>
                              <div className='card-header py-2'>
                                <div className='row  '>
                                  <div className='col-sm-12 col-12'>
                                    <h6 className='h2 text-primary d-inline-block pt-2'> Payment Successful</h6>
                                  </div>
                                </div>
                              </div>
                              <div className='card-body'>
                                <div className='container payment-success'>
                                  <div className='row '>
                                    <div className='col-sm-12 col-12 text-center pb-5 pt-0'>
                                      <div>
                                        <p className='eu-font'><i className='fas fa-check pb-2' style={{ color:'green', fontSize:35 }} /> <br />Thank you, <br />Payment of ₹ {this.state.amount} is successful... </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='row justify-content-center'>
                                    <div className='col-md-6 col-lg-6 col-sm-6 border border-success rounded-lg  col-xl-6 col-12'>
                                      <div className='row row-data-style py-2'>
                                        <div className='col-sm-6 col-12 text-left '><small>Booking Code</small></div>
                                        <div className='col-sm-6 col-12 text-left'>
                                          <h5 className='mb-0 text-sm'>{(this.state.bookingInfo && this.state.bookingInfo.bookingCode) ? this.state.bookingInfo.bookingCode : ''}</h5>
                                        </div>
                                      </div>
                                      <div className='row row-data-style py-2'>
                                        <div className='col-sm-6 col-12 text-left'><small>Payment Method</small></div>
                                        <div className='col-sm-6 col-12 text-left'>
                                          <h5 className='mb-0 text-sm'>{this.state.paymentMode}</h5>
                                        </div>
                                      </div>
                                      <div className='row row-data-style py-2'>
                                        <div className='col-sm-6 col-5 text-left'><small>Amount</small></div>
                                        <div className='col-sm-6 col-6 text-left'>
                                          <h5 className='mb-0 text-sm'><i className='fa fa-inr' /> {this.state.amount} </h5>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='card-footer'>
                                <div className='row justify-content-center'>
                                  <button className='btn btn-primary' onClick={this.handleRedirect}>Done</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    )
  }
}
EUBookingMobilePaymentSuccess.propTypes = {
  params: PropTypes.any
}
export default EUBookingMobilePaymentSuccess
