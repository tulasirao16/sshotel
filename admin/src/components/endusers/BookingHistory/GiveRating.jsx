/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import MainHeader from '../HeaderCompnt/MainHeader'
import FooterComponent from '../FooterCompnt/Footer'
import './css/Bookings.css'

class EUGiveRating extends React.Component {
  constructor () {
    super()
    this.state = {
      tNumber: '',
      tSubject: '',
      ticketBy: '',
      ticketOn: '',
      tQuery: '',
      tNumberError: '',
      tSubjectError: '',
      ticketByError: '',
      ticketOnError:'',
      tQueryError: ''
    }
    this.handleAddManually = this.handleAddManually.bind(this)
  }
  handleAddManually (event) {
    hashHistory.push('/AddProperty')
    event.preventDefault()
  }
  render () {
    return (
      <div>
        <div className='main-content-create-review' id='panel'>
          {/* ------- Navbar --------- */}
          {/* page header start */}
          <MainHeader />
          {/* page header end */}
          <div className='header bg-primary pb-6'>
            <div className='container'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    <h6 className='h2 text-white d-inline-block mb-0'>Give Your Review </h6>
                  </div>
                  <div className='col-lg-6 col-5 text-right'>
                    {/* <a className='btn btn-sm btn-neutral'>Edit Ticket</a> */}
                    {/* <a href='#' className='btn btn-sm btn-neutral'>Filters</a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container mt--6 '>
            <div className='row justify-content-center notifictions'>
              <div className='col-lg-9 card-wrapper'>
                <div className='card mb-2'>
                  <div className='card-body-create-review'>
                    <section className='notifications card-body '>
                      <div className='row pb-2'>
                        <div className='col-lg-12'>
                          <div className='row pt-0 align-items-center'>
                            <div className='col-lg-2'>
                              <label className='mb-0'>Hotel Name</label>
                            </div>
                            <div className='col-lg-8'>
                              <p className='mb-0 card-text'>Test Hotels, Tarnaka</p>
                            </div>
                          </div>
                          <div className='row pt-2 align-items-center'>
                            <div className='col-lg-2'>
                              <label className='mb-0' >Booking ID</label>
                            </div>
                            <div className='col-lg-8'>
                              <p className='mb-0'>NGSBNBB001</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <label className='form-control-label'>Rating <span className='error' >*</span></label>
                            <input type='text' value='' onChange={this.handleOnChange} className='form-control' id='ticketBy' />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <label className='form-control-label'>Review Title <span className='error' >*</span></label>
                            <input type='text' value='' onChange={this.handleOnChange} className='form-control' id='ticketOn' />
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-12'>
                          <div className='form-group'>
                            <label className='form-control-label'>Review Comment <span className='error' >*</span></label>
                            <textarea className='form-control' onChange={this.handleOnChange} id='ticketQuery' rows='3' />
                          </div>
                        </div>
                      </div>
                      <button className='btn btn-primary' onClick={this.handleGiveRatings}>Give Rating</button>
                    </section>
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

export default EUGiveRating
