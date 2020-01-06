/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import { t } from 'ttag'
import ReactStars from 'react-stars'
import { hashHistory } from 'react-router'

class SPReviewRatingsViewComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      authObj: JSON.parse(localStorage.getItem('authObj')),
      reviewRatingObj: [],
      spServiceProvider: '',
      area: '',
      bookingCode: '',
      rating: '',
      reviewHeadline: '',
      reviewStatus: ''
    }
    this.handleBack = this.handleBack.bind(this)
  }
  componentWillMount () {
    let reviewRatingObj = JSON.parse(localStorage.getItem('reviewRatingObj'))
    this.setState({
      spServiceProvider: reviewRatingObj.spServiceProvider,
      area: reviewRatingObj.spLocationId ? reviewRatingObj.spLocationId.area : '',
      bookingCode: reviewRatingObj.bookingCode,
      rating: reviewRatingObj.rating,
      reviewHeadline: reviewRatingObj.reviewHeadline,
      reviewComments: reviewRatingObj.reviewComments,
      reviewStatus: reviewRatingObj.reviewStatus
    })
  }
  handleBack () {
    hashHistory.push('/host/reviewratings')
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        <div className='header bg-primary pb-6'>
          <div className='container'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-9 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitleReviewRatings`}</h6>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a href='#'><i className='fas fa-home' /></a></li>
                      {/* <li className='breadcrumb-item'><a href='#'>Dashboard</a></li> */}
                      <li className='breadcrumb-item active' aria-current='page'>Reviews & Ratings Page</li>
                      <li className='breadcrumb-item active' aria-current='page'>{t`lanSPTitleReviewRatingView`}</li>
                    </ol>
                  </nav>
                </div>
              </div>
              {/* <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitleReviewRatingView`}</h6>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div className='container mt--6 pb-4'>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-8 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header bg-transparent px-5 pb-3'>
                  <h5 className='card-title'>{t`lanSPTitleReviewRatingDetails`}</h5>
                </div>
                <div className='card-body'>
                  <section className='Review-view'>
                    <div className='row clearfix'>
                      <div className='col-md-12 col-lg-12 col-xl-12'>
                        {/* List group */}
                        <div className='card-body'>
                          <ul className='list-group list-group-flush list my--3'>
                            <li className='list-group-item-one py-1'>
                              <div className='row align-items-center'>
                                <div className='col-lg-3'>
                                  <small className='notification-label' >{t`lanCommonLabelProperty`}</small>
                                </div>
                                <div className='col-lg-8'>
                                  <h5 className='mb-0'>{this.state.spServiceProvider},{this.state.area}</h5>
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item-one py-1'>
                              <div className='row align-items-center'>
                                <div className='col-lg-3'>
                                  <small className='notification-label' >{t`lanCommonLabelBookingCode`}</small>
                                </div>
                                <div className='col-lg-8'>
                                  <h5 className='mb-0'>{this.state.bookingCode}</h5>
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item-one py-1'>
                              <div className='row align-items-center'>
                                <div className='col-lg-3'>
                                  <small className='notification-label' >{t`lanSPLabelRating`}</small>
                                </div>
                                <div className='col-sm-8'>
                                  <section className='rating-widget '>
                                    <div className='rating-stars' style={{ marginBottom: 0, marginTop: 0 }}>
                                      <ReactStars
                                        value={this.state.rating}
                                        count={5}
                                        size={24}
                                        color2={'#ffd700'}
                                        edit={false}
                                      />
                                    </div>
                                  </section>
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item-one py-1'>
                              <div className='row align-items-center'>
                                <div className='col-lg-3'>
                                  <small className='notification-label' >{t`lanSPLabelReviewHeader`}</small>
                                </div>
                                <div className='col-lg-8'>
                                  <h5 className='mb-0'>{this.state.reviewHeadline}</h5>
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item-one py-1'>
                              <div className='row'>
                                <div className='col-lg-3'>
                                  <small className='notification-label' >{t`lanSPLabelReviewComment`}</small>
                                </div>
                                <div className='col-lg-8'>
                                  <h5 className='mb-0'>{this.state.reviewComments}</h5>
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item-one py-1'>
                              <div className='row'>
                                <div className='col-lg-3'>
                                  <small className='notification-label' >{t`lanCommonLabelStatus`}</small>
                                </div>
                                <div className='col-lg-8'>
                                  <h5 className='mb-0'>{this.state.reviewStatus}</h5>
                                </div>
                              </div>
                            </li>
                            <div className='row'>
                              <div className='col-sm-12 text-center mt-4'>
                                <button className='btn btn-primary' type='button' onClick={this.handleBack}>{t`lanCommonButtonDone`}</button>
                              </div>
                            </div>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default SPReviewRatingsViewComponent
