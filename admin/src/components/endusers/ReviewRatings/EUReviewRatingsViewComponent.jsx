/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import ReactStars from 'react-stars'
import PropTypes from 'prop-types'

class EUReviewRatingsViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      authObj: JSON.parse(localStorage.getItem('authObj')),
      reviewRatingObj: [],
      spServiceProvider: '',
      handleViewBack: this.props.handleViewBack,
      area: '',
      bookingCode: '',
      rating: '',
      reviewHeadline: '',
      reviewStatus: ''
    }

    this.handleBack = this.handleBack.bind(this)
    this.handleHome = this.handleHome.bind(this)
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
  handleHome (event) {
    hashHistory.push('/hotels')
    event.preventDefault()
  }
  handleBack () {
    this.props.handleViewBack()
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center pt-7 pb-5'>
                <div className='col-lg-6 col-7'>
                  <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item eu-font'><a onClick={this.handleBack} >{t`lanEUTitleReviewRatings`}</a></li>
                      <li className='breadcrumb-item active eu-font' aria-current='page'><a >{t`lanEUTitleReviewRatingDetails`}</a></li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container mt--6 pb-4'>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-8 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header bg-transparent px-5 pb-3'>
                  <h5 className='card-title'>{t`lanEUTitleReviewRatingDetails`}</h5>
                </div>
                <div className='card-body'>
                  <section className='notifications'>
                    <div className='row clearfix'>
                      <div className='col-md-12 col-lg-12 col-xl-12'>
                        {/* List group */}
                        <div className='card-body'>
                          <ul className='list-group list-group-flush list my--3'>
                            <li className='list-group-item-one py-1'>
                              <div className='row align-items-center'>
                                <div className='col-lg-3'>
                                  <small>{t`lanCommonLabelProperty`}</small>
                                </div>
                                <div className='col-lg-8'>
                                  <h5 className='mb-1 text-sm'>{this.state.spServiceProvider},{this.state.area}</h5>
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item-one py-1'>
                              <div className='row align-items-center'>
                                <div className='col-lg-3'>
                                  <small>{t`lanCommonLabelBookingCode`}</small>
                                </div>
                                <div className='col-lg-8'>
                                  <h5 className='mb-1 text-sm'>{this.state.bookingCode}</h5>
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item-one py-1'>
                              <div className='row align-items-center'>
                                <div className='col-lg-3'>
                                  <small>{t`lanEULabelRating`}</small>
                                </div>
                                <section className='rating-widget pl-2 '>
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
                            </li>
                            <li className='list-group-item-one py-1'>
                              <div className='row align-items-center'>
                                <div className='col-lg-3'>
                                  <small>{t`lanEULabelReviewHeader`}</small>
                                </div>
                                <div className='col-lg-8'>
                                  <h5 className='mb-1 text-sm'>{this.state.reviewHeadline}</h5>
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item-one py-1'>
                              <div className='row'>
                                <div className='col-lg-3'>
                                  <small>{t`lanEULabelReviewComment`}</small>
                                </div>
                                <div className='col-lg-8'>
                                  <h5 className='mb-1 text-sm'>{this.state.reviewComments}</h5>
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
EUReviewRatingsViewComponent.propTypes = {
  handleViewBack: PropTypes.any

}

export default EUReviewRatingsViewComponent
