/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import { t } from 'ttag'
import './css/Reviews.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import PropTypes from 'prop-types'
import StarRatings from 'react-star-ratings'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

class ADHostsReviewRatingsListViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      reviewRatingObj: this.props.reviewData,
      spServiceProvider: '',
      errMessage: '',
      successMessage: '',
      editDisable: true
    }
    this.handleEdit = this.handleEdit.bind(this)
    this.changeRating = this.changeRating.bind(this)
    this.handleEditSubmit = this.handleEditSubmit.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleHosts = this.handleHosts.bind(this)
  }

  componentWillMount () {
    let reviewRatingObj = this.state.reviewRatingObj
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

  handleEdit () {
    this.setState({ editDisable: false })
  }

  changeRating (rating) {
    this.setState({ rating: rating, errMessage: '' })
  }
  handleBack () {
    this.props.handleViewUser()
    event.preventDefault()
  }
  handleHome (event) {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleHosts () {
    localStorage.removeItem('hostData')
    hashHistory.push('/admin/hosts')
  }
  handleEditSubmit () {
    if (this.state.rating === 0) {
      this.setState({ errMessage: 'Please give star rating' })
    } else if (this.state.reviewHeadline.trim() === null || this.state.reviewHeadline.trim() === undefined || this.state.reviewHeadline.trim() === '') {
      this.setState({ errMessage: 'Please give review headline' })
    } else if (this.state.reviewComments.trim() === null || this.state.reviewComments.trim() === undefined || this.state.reviewComments.trim() === '') {
      this.setState({ errMessage: 'Please give review comments' })
    } else if (this.state.rating === this.state.reviewRatingObj.rating && this.state.reviewHeadline === this.state.reviewRatingObj.reviewHeadline &&
      this.state.reviewHeadline === this.state.reviewRatingObj.reviewHeadline) {
      this.props.handleViewUser()
    } else {
      let reviewRatingBody = {
        rating: this.state.rating,
        reviewHeadline: this.state.reviewHeadline,
        reviewComments: this.state.reviewComments
      }
      let putADHostUserRatingUpdate = {
        url: config.baseUrl + config.putADHostUserRatingUpdateAPI + this.state.reviewRatingObj._id,
        body: reviewRatingBody
      }
      let _this = this
      APICallManager.putCall(putADHostUserRatingUpdate, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          let outputData = _this.props.reviewRatingList
          let index = outputData.findIndex(x => x._id === _this.state.reviewRatingObj._id)
          outputData[index] = resObj.data.statusResult
          ToastsStore.success('Updated successfully')
          setTimeout(() => {
            _this.props.handleViewUser()
          }, 2000)
        } else {
          ToastsStore.error('Updated Failed')
        }
      })
    }
  }
  render () {
    return (
      <div className='main-content view-rating-page enduser' id='panel'>
        {/* ------- Navbar --------- */}
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center pt-4 pb-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>Hosts-list</h6>
                  <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item active eu-font'><a onClick={() => this.props.handleViewUser()}>{t`lanADTitleHostsReviewRatingsList`}</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>{t`lanADTitleHostsReviewratingsView`}</li>
                      {/* <li className='breadcrumb-item active' aria-current='page'>Notification Details</li> */}
                    </ol>
                  </nav>
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
                  <div className='row'>
                    <div className='col-md-8'>
                      <h5 className='card-title'>{t`lanEUTitleReviewRatingDetails`}</h5>
                    </div>
                    <div className='col-md-4 text-right'>
                      <a onClick={this.handleEdit}> {t`lanCommonButtonEdit`} <span><i className='fas fa-edit' /></span></a>
                    </div>
                  </div>
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
                                  <small>{t`lanEULabelHotel`}</small>
                                </div>
                                <div className='col-lg-8'>
                                  <p className='mb-0 card-text'>
                                    {this.state.spServiceProvider},{this.state.area}
                                  </p>
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item-one py-1'>
                              <div className='row align-items-center'>
                                <div className='col-lg-3'>
                                  <small>{t`lanCommonLabelBookingCode`}</small>
                                </div>
                                <div className='col-lg-8'>
                                  <p className='mb-0 card-text'>{this.state.bookingCode}</p>
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item-one py-1'>
                              <div className='row align-items-center'>
                                <div className='col-lg-3'>
                                  <small>{t`lanEULabelRating`}</small>
                                </div>
                                <div className='col-lg-8'>
                                  <StarRatings
                                    rating={this.state.rating}
                                    starRatedColor='#FFDF00'
                                    changeRating={this.state.editDisable === false ? this.changeRating : null}
                                    numberOfStars={5}
                                    starWidthAndHeight={'5px'}
                                    starDimension='20px'
                                    starSpacing='5px'
                                    starHoverColor='grey'
                                  />
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item-one py-1'>
                              <div className='row align-items-center'>
                                <div className='col-lg-3'>
                                  <small>{t`lanEULabelReviewHeadline`}</small>
                                </div>
                                <div className='col-lg-4'>
                                  <input type='text' disabled={this.state.editDisable} value={this.state.reviewHeadline} onChange={(e) => this.setState({ reviewHeadline: e.target.value, errMessage: '' })} />
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item-one py-1'>
                              <div className='row'>
                                <div className='col-lg-3'>
                                  <small>{t`lanEULabelReviewComment`}</small>
                                </div>
                                <div className='col-lg-4'>
                                  <input type='text' disabled={this.state.editDisable} value={this.state.reviewComments} onChange={(e) => this.setState({ reviewComments: e.target.value, errMessage: '' })} />
                                </div>
                              </div>
                            </li>
                          </ul>
                          <div style={{ color: 'red' }}>
                            {this.state.errMessage}
                          </div>
                          <div style={{ color: 'green' }}>
                            {this.state.successMessage}
                          </div>
                          <ul className='list-group list-group-flush list mt-3'>
                            <li className='list-group-item-one py-1'>
                              <div className='row'>
                                <div className='col-lg-3' />
                                <div className='col-lg-4'>
                                  <button onClick={this.handleEditSubmit} type='button' className='btn btn-primary my-3'>{t`lanCommonButtonUpdate`}</button>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
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
ADHostsReviewRatingsListViewComponent.propTypes = {
  reviewData: PropTypes.any,
  handleViewUser: PropTypes.any
}

export default ADHostsReviewRatingsListViewComponent
