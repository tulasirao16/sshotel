import React from 'react'
import PropTypes from 'prop-types'
import { hashHistory } from 'react-router'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import MainHeader from '../../../components/endusers/HeaderCompnt/MainHeader'
import FooterComponent from '../../../components/endusers/FooterCompnt/Footer'
// import { t } from 'ttag'
class EndUsersPaymentSuccess extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      amount: '',
      authObj: {},
      bookingInfo: {},
      paymentMode: ''
    }
    this.handleRedirect = this.handleRedirect.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }
  componentWillMount () {
    let _this = this
    let paymentResHash = this.props && this.props.params ? this.props.params.id : ''
    let obj = { url: config.baseUrl + config.getEUBookingPaymentGatewayResponseStatusAPI + paymentResHash }
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusResult && resObj.data.statusResult._id) {
        let pgrsObj = resObj.data.statusResult
        if (pgrsObj.uiToken) {
          localStorage.setItem('token', pgrsObj.uiToken)
        }
        if (pgrsObj.uiAuthObj) {
          _this.setState({ authObj: pgrsObj.uiAuthObj })
          localStorage.setItem('authObj', JSON.stringify(pgrsObj.uiAuthObj))
        }
        _this.setState({ amount: pgrsObj.totalAmount, bookingInfo: pgrsObj.bookingId, paymentMode: pgrsObj.paymentResMode })
      }
    })
  }
  handleRedirect () {
    hashHistory.push('/bookings')
  }
  handleHome (e) {
    hashHistory.push('/hotels')
    e.preventDefault()
  }
  render () {
    return (
      <div className=' enduser' id='panel'>
        {/* ------- Navbar --------- */}
        <MainHeader drawerValue='inbox' />
        <div className='main-content' id='panel'>
          <div className='header bg-primary pb-6'>
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='row align-items-center pt-7 pb-5'>
                  <div className='col-lg-6 col-12'>
                    {/* <h6 className='h2 text-white d-inline-block mb-0'>{t`lanEUTitleInbox`}</h6> */}
                    <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item eu-font'><a onClick={this.handleRedirect} >Bookings</a></li>
                        <li className='breadcrumb-item active eu-font' aria-current='page'><a >Payment Success</a></li>
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
                <div className='card mb-2'>
                  <div className='card-header py-2'>
                    <div className='row  '>
                      <div className='col-sm-12'>
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
                        <div className='col-md-6 col-lg-6 col-sm-6 border border-success rounded-lg  col-xl-6 col-12 text-center'>
                          <div className='row row-data-style justify-content-center py-2'>
                            <div className='col-sm-6 text-right'><small>Booking Code</small></div>
                            <div className='col-sm-6 text-left'>
                              <h5 className='mb-0 text-sm'>{(this.state.bookingInfo.bookingCode) ? this.state.bookingInfo.bookingCode : ''}</h5>
                            </div>
                          </div>
                          <div className='row row-data-style justify-content-center py-2'>
                            <div className='col-sm-6 text-right'><small>Amount</small></div>
                            <div className='col-sm-6 text-left'>
                              <h5 className='mb-0 text-sm'><i className='fa fa-inr' /> {this.state.amount} </h5>
                            </div>
                          </div>
                          <div className='row row-data-style justify-content-center py-2'>
                            <div className='col-sm-6 text-right'><small>Payment Method</small></div>
                            <div className='col-sm-6 text-left'>
                              <h5 className='mb-0 text-sm'>{this.state.paymentMode}</h5>
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
        <FooterComponent />
        {/* <div className='container'>
          <div className='row justify-content-center my-5'>
            <div className='col-sm-8'>
              <div className='card'>
                <div className='card-header text-center py-5'>
                  <div>
                    <label><i className='fas fa-check pb-2' style={{ color:'green', fontSize:35 }} /> <br />Thank you, <br />Payment of ₹ {this.state.amount} is successful... </label>
                  </div>
                </div>
                <div className='card-body'>
                  <div className='row justify-content-center pl-6'>
                    <div className='col-sm-12 text-center'>
                      <div className='seller-contact-info'>
                        <dl className='dl-horizontal '>
                          <div className='row'>
                            <div className='col-sm-3'> <dt ><small>Booking Code</small></dt></div>
                            <div className='col-sm-2'> <dt > : </dt></div>
                            <div className='col-sm-4'><dt className='contact-sensitive'><b>{(this.state.bookingInfo.bookingCode) ? this.state.bookingInfo.bookingCode : ''}</b></dt></div>
                          </div>
                          <div className='row'>
                            <div className='col-sm-3'> <dt ><b>Amount</b></dt></div>
                            <div className='col-sm-2'> <dt > : </dt></div>
                            <div className='col-sm-4'><dt className='contact-sensitive'><i className='fa fa-inr' /><b> {this.state.amount}</b></dt></div>
                          </div>
                          <div className='row'>
                            <div className='col-sm-3'> <dt ><b>Payment Method</b></dt></div>
                            <div className='col-sm-2'> <dt > : </dt></div>
                            <div className='col-sm-4'>
                              <dt className='contact-sensitive'><b>{this.state.paymentMode}</b></dt>
                            </div>
                          </div>
                        </dl>
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
        </div> */}
      </div>
    )
  }
}
EndUsersPaymentSuccess.propTypes = {
  params: PropTypes.any
}
export default EndUsersPaymentSuccess
