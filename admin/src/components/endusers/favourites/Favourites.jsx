/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
// import APICallManager from '../../../services/callmanager'
// import config from '../../../../public/config.json'
import MainHeader from '../HeaderCompnt/MainHeader'
import FooterComponent from '../FooterCompnt/Footer'
// import { t } from 'ttag'
import './Css/Favourites.css'

export default class FavouritesList extends React.Component {
  constructor () {
    super()
    this.state = {
      data: [
        { 'hotel': 'Sanman Hotel', persons: 8, bed: 5, doublebed: 5, baths: 2, Price: 450, hotelImg: require('../../../../assets/r1.jpg') },
        { 'hotel': 'Marigold Hotels', persons: 8, bed: 5, doublebed: 5, baths: 2, Price: 450, hotelImg: require('../../../../assets/r2.jpg') },
        { 'hotel': 'Hotel Dwaraka', persons: 8, bed: 5, doublebed: 5, baths: 2, Price: 650, hotelImg: require('../../../../assets/r4.jpg') },
        { 'hotel': 'One Place Hotels, Tarnaka', persons: 8, bed: 5, doublebed: 5, baths: 2, Price: 950, hotelImg: require('../../../../assets/r5.jpg') },
        { 'hotel': 'Bluwale Hotel', persons: 8, bed: 5, doublebed: 5, baths: 2, Price: 1450, hotelImg: require('../../../../assets/r6.jpg') },
        { 'hotel': 'Taj Hotel', persons: 8, bed: 5, doublebed: 5, baths: 2, Price: 2450, hotelImg: require('../../../../assets/property_little_12.jpg') }
      ]
    }
    this.handleFavHotelView = this.handleFavHotelView.bind(this)
  }
  handleFavHotelView (e) {
    hashHistory.push('/hotels/booknow')
    e.preventDefault()
  }
  render () {
    return (
      <div id='page-wrapper'>
        {/* page header start */}
        <MainHeader />
        {/* page header end */}
        <main role='main' className='inner cover fav-hotel-list'>
          <div className='album py-5 bg-light'>
            <div className='container'>
              <div className='row'>
                {this.state.data.map((item, i) =>
                  <div className='col-lg-4' key={i}>
                    <a onClick={this.handleFavHotelView} >
                      <div className='room-wrapper'>
                        <div className='room-inner'>
                          <div className='room'>
                            <figure>
                              <a className='avatar rounded-circle avatar-sm fav-icon' title='liked' style={{ backgroundColor: '#ffffff' }}>
                                <i className='fas fa-heart' />
                              </a>
                              <a onClick={this.handleHotelListItemView} >
                                <img src={item.hotelImg} alt='' className='img-fluid' />
                              </a>
                              <a className='avatar rounded-circle avatar-sm compare-icon' style={{ backgroundColor: '#ffffff' }}>
                                <img src={require('../../../../assets/compare.png')} title='compare' alt='compare' style={{ width: '20px', height: '20px' }} />
                              </a>
                              {/* <figcaption>
                              <div className='txt1'>{item.hotel}</div>
                              <div className='txt2'>START FROM $450.00</div>
                            </figcaption> */}
                            </figure>
                            <div className='caption'>
                              <div className='txt1 hotelName'>{item.hotel}</div>
                              <div className='txt2'>
                                39 REVEW
                                <div className='small-stars'>
                                  <i className='fa fa-star' />
                                  <i className='fa fa-star' />
                                  <i className='fa fa-star' />
                                  <i className='fa fa-star' />
                                  <i className='fa fa-star' />
                                </div>
                              </div>
                              <div className='txt3 availables row'>
                                <div className='col-sm-6 py-1'>
                                  <i className='fa fa-users pr-3' />
                                  <span>{item.persons}</span>
                                </div>
                                <div className='col-sm-6 py-1' >
                                  <div className='avatar avatar-xs pr-3'>
                                    <img src={require('../../../../assets/available/doublebed.png')} />
                                  </div>
                                  <span>{item.doublebed}</span>
                                </div>
                                <div className='col-sm-6 py-1' >
                                  <i className='fa fa-bath pr-3' />
                                  <span>{item.baths}</span>
                                </div>
                                <div className='col-sm-6 py-1' >
                                  <i className='fa fa-bed pr-3' />
                                  <span>{item.bed}</span>
                                </div>

                              </div>
                              <div className='txt4'>
                                <a href='details.html'>VIEW DETAIL</a>
                              </div>
                            </div>
                            <div className='select-txt'>
                              <a href='details.html'><span>SELECT THIS ROOM<i className='fa fa-angle-right' aria-hidden='true' /></span></a>
                            </div>
                            <div className='room-icons'>
                              <div className='room-ic room-ic-wifi'>
                                <i className='fa fa-wifi' aria-hidden='true' />
                                <div className='txt1'>FREE WIFI</div>
                              </div>
                              <div className='room-ic room-ic-person'>
                                <i className='fa fa-television' aria-hidden='true' />
                                <div className='txt1'>TV</div>
                              </div>
                              <div className='room-ic room-ic-breakfast'>
                                <i className='fa fa-coffee' aria-hidden='true' />
                                <div className='txt1'>BREAKFAST<br />INCLUDED</div>
                              </div>
                              <div className='room-ic room-ic-left'>
                                <img src={require('../../../../assets/available/elevator.png')} style={{ width: 18, height: 23 }} />
                                <div className='txt1'>LIFT</div>
                              </div>
                              <div className='room-ic room-ic-refund'>
                                <i className='fa fa-tags' aria-hidden='true' />
                                <div className='txt1'>NO REFUND</div>
                              </div>
                              <div className='room-price'>
                                <div className='txt1'>$<span>{item.Price}</span></div>
                                <div className='txt2'>PER NIGHT</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                )} {/* col end */}
              </div> {/* row end */}
            </div> {/* container end */}
          </div>
        </main>
        <FooterComponent />
      </div>
    )
  }
}
