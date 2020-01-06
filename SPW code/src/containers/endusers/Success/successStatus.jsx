/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import MainHeader from '../../../components/endusers/HeaderCompnt/MainHeader'
import FooterComponent from '../../../components/endusers/FooterCompnt/Footer'
import './Css/SuccessPageCss.css'

class SuccessStatus extends React.Component {

  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        <MainHeader />
        <div>
          <div className='pb-6'>{ /*  */ }</div>
        </div>
        <div className='container mt--6 success-page '>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-8 card-wrapper'>
              <div className='card my-4'>
                <div className='card-body'>
                  <section className='notifications'>
                    <div className='row clearfix'>
                      <div className='col-md-12 col-lg-12 col-xl-12 text-center'>
                        <p><i className='fas fa-check-circle' /></p>
                        <label>Your payment is successful </label>
                        {/* <p><i className='fas fa-times-circle' /></p>
                        <label>Your payment is failed </label> */}
                        <hr />
                        <div className='row'>
                          <div className='col-sm-6 text-right'><label>Booking Code: </label></div>
                          <div className='col-sm-6 text-left'><p>BK0001</p></div>
                        </div>
                        <div className='row'>
                          <div className='col-sm-6 text-right'><label>Booking Date: </label></div>
                          <div className='col-sm-6 text-left'><p>29Jul,2019</p></div>
                        </div>
                        <div className='row'>
                          <div className='col-sm-6 text-right'><label>Payment Method: </label></div>
                          <div className='col-sm-6 text-left'><p>Online DebitCard</p></div>
                        </div>
                        <div className='row'>
                          <div className='col-sm-6 text-right'><label>Amount: </label></div>
                          <div className='col-sm-6 text-left'><p>₹ 3000 / <small>night</small></p></div>
                        </div>
                      </div>
                    </div>
                  </section>
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

export default SuccessStatus
