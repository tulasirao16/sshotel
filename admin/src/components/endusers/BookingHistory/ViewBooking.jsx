/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
// import ReactDrawer from 'react-drawer'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
// import Switch from 'react-switch'
import MainHeader from '../HeaderCompnt/MainHeader'
import FooterComponent from '../FooterCompnt/Footer'

class EUBookingView extends React.Component {
  constructor () {
    super()
    this.state = {
    }
    this.handleBack = this.handleBack.bind(this)
    this.handleBookAgain = this.handleBookAgain.bind(this)
    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.handleBookingReview = this.handleBookingReview.bind(this)
  }
  handleBack (e) {
    hashHistory.push('/eubookings')
    event.preventDefault()
  }
  handleBookAgain (e) {
    hashHistory.push('/hotels/booknow')
    event.preventDefault()
  }
  handleSendMessage (e) {
    // hashHistory.push('/sendMessage')
    event.preventDefault()
  }
  handleBookingReview (e) {
    hashHistory.push('/EUreviews')
    event.preventDefault()
  }

  render () {
    return (
      <div>
        <div className='main-content' id='panel'>
          {/* ------- Navbar --------- */}
          <MainHeader />
          <div className='header bg-primary pb-6'>
            <div className='container'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    <h6 className='h2 text-white d-inline-block mb-0'>Booking View</h6>
                  </div>
                  <div className='col-lg-6 col-5 text-right'>
                    <a onClick={this.handleBack} className='btn btn-sm btn-neutral'>Back</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container mt--6 pb-4'>
            <div className='row justify-content-center notifictions'>
              <div className='col-lg-10 card-wrapper'>
                <div className='card mb-2'>
                  <div className='card-header'>
                    <h5 className='card-title'>Booking Details</h5>
                  </div>
                  <div className='card-body'>
                    <section className='notifications'>
                      <div className='row clearfix'>
                        <div className='col-md-12 col-lg-12 col-sm-12 col-xl-12'>
                          <div className='row'>
                            <div className='col-sm-6'>
                              <div className='row py-2'>
                                <div className='col-sm-4'><small>Booking ID</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>BKCODE001</h5></div>
                              </div>
                              <div className='row py-2'>
                                <div className='col-sm-4'><small>Name</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>Bahunya</h5></div>
                              </div>
                              <div className='row py-2'>
                                <div className='col-sm-4'><small>Check-In-Time</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>25Feb, 2018, 1:00 pm</h5></div>
                              </div>
                              <div className='row py-2' >
                                <div className='col-sm-4'><small>Days/Nights</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>2 Days, 1 Night</h5></div>
                              </div>
                            </div>
                            <div className='col-sm-6'>
                              <div className='row py-2'>
                                <div className='col-sm-4'><small>Status</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>Completed</h5></div>
                              </div>
                              <div className='row py-2'>
                                <div className='col-sm-4'><small>Hotel Name</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>Celebrity Hotels</h5></div>
                              </div>
                              <div className='row py-2'>
                                <div className='col-sm-4'><small>Check-Out-Time</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>26Feb, 2018, 4:00 pm </h5></div>
                              </div>
                              <div className='row py-2'>
                                <div className='col-sm-4'><small>Total Amount</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>₹ 1200/- </h5></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                  <div className='card-footer'>
                    <h5 className='card-title'>Hotel Contact Information</h5>
                    <div className='card-body-hotel-contact'>
                      <div className='row clearfix'>
                        <div className='col-md-12 col-lg-12 col-sm-12 col-xl-12'>
                          <div className='row'>
                            <div className='col-sm-6'>
                              <div className='row pb-1'>
                                <div className='col-sm-4'><small>Contact Person</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>Nagaraju</h5></div>
                              </div>
                              <div className='row pb-1'>
                                <div className='col-sm-4'><small>Mobile Number</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>9999999999</h5></div>
                              </div>
                              <div className='row pb-1'>
                                <div className='col-sm-4'><small>Email</small></div>
                                <div className='col-sm-6'><h5 className='mb-0 text-sm'>ngstek@gmail.com</h5></div>
                              </div>
                            </div>
                            <div className='col-sm-6'>
                              <div className='col-sm-4'><small>Address</small></div>
                              <div className='col-sm-6'><h5 className='mb-0 text-sm'>Nagarjuna Nagar,Tarnaka, Hyderabad,500007</h5></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='row clearfix my-3 text-center'>
                      <div className='col-md-2 col-lg-2 col-sm-2 col-xs-6 text-center'>
                        <button className='btn btn-primary update-edit my-2' title='Book Again'>
                          <a onClick={this.handleBookAgain} className='update-edit ' >
                            <span className='btn-inner--icon'>Book Again</span>
                          </a>
                        </button>
                      </div>
                      <div className='col-md-3 col-lg-3 col-sm-3 col-xs-6 text-center'>
                        <button className='btn btn-info update-edit my-2' title='Book Again'>
                          <a onClick={this.handleSendMessage} className='update-edit ' >
                            <span className='btn-inner--icon'>Send Message</span>
                          </a>
                        </button>
                      </div>
                      <div className='col-md-2 col-lg-2 col-sm-2 col-xs-6 text-center'>
                        <button className='btn btn-success update-edit my-2' title='Book Again'>
                          <a onClick={this.handleBookingReview} className='update-edit ' >
                            <span className='btn-inner--icon'>Review</span>
                          </a>
                        </button>
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

export default EUBookingView
