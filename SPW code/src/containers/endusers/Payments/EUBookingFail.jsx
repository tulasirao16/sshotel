
import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import MainHeader from '../../../components/endusers/HeaderCompnt/MainHeader'
import FooterComponent from '../../../components/endusers/FooterCompnt/Footer'
// import { t } from 'ttag'
class EndUsersBookingFail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mounted: false
    }
    this.handleRedirect = this.handleRedirect.bind(this)
  }
  componentDidMount () {
    let _isMounted = true
    window.onpopstate = (event) => {
    //   const { hash } = location
      if (_isMounted) {
        hashHistory.push('/hotels')
        _isMounted = false
      }
    }
  }
  handleRedirect () {
    hashHistory.push('/hotels')
  }
  render () {
    return (
      <div>
        <div className=' enduser' id='panel'>
          {/* ------- Navbar --------- */}
          <MainHeader drawerValue='inbox' />
          <div className='main-content' id='panel'>
            <div className='header bg-primary pb-6'>
              <div className='container-fluid'>
                <div className='header-body'>
                  <div className='row align-items-center pt-7 pb-5'>
                    <div className='col-lg-6 col-12'>
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
                          <h6 className='h2 text-primary d-inline-block pt-2'>{t`lanSPLabelPaymentStatus`}</h6>
                        </div>
                      </div>
                    </div>
                    <div className='card-body'>
                      <div className='container payment-success'>
                        <div className='row '>
                          <div className='col-sm-12 col-12 text-center pb-5 pt-0'>
                            <div>
                              <p className='eu-font'><i className='fas fa-times-circle pb-2' style={{ color:'red', fontSize:35 }} />{t`lanEULabelErrorBookingFailedTryAgain`}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card-footer'>
                      <div className='row justify-content-center'>
                        <button className='btn btn-primary' onClick={() => this.handleRedirect()}>{t`lanCommonButtonTooltipBookAgain`}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <FooterComponent />
        </div>
      </div>
    )
  }
}

export default EndUsersBookingFail
