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

class EURatingComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      reviewRatingData: {},
      bookingCode: this.props.data,
      rating : 0,
      reviewHeadline: '',
      reviewComments: '',
      errMessage: '',
      successMessage: '',
      statusCode: '',
      editDisable: true
    }
    this.handleEdit = this.handleEdit.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.changeRating = this.changeRating.bind(this)
    this.handleEditSubmit = this.handleEditSubmit.bind(this)
    this.handleCreate = this.handleCreate.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }
  componentWillMount () {
    let getEUBookingRatingObj = {
      url: config.baseUrl + config.getEUBookingRatingsAPI + this.state.bookingCode
    }
    let _this = this
    APICallManager.getCall(getEUBookingRatingObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          reviewRatingData : resObj.data.statusResult[0],
          rating: resObj.data.statusResult[0].rating,
          reviewHeadline: resObj.data.statusResult[0].reviewHeadline,
          reviewComments: resObj.data.statusResult[0].reviewComments,
          statusCode: '0000'
        })
      } else {
        _this.setState({ editDisable: false, statusCode: '9997' })
      }
    })
  }
  handleEdit () {
    this.setState({ editDisable: false })
  }
  handleBack () {
    this.props.handleViewClose()
    event.preventDefault()
  }
  changeRating (rating) {
    this.setState({ rating: rating, errMessage: '' })
  }
  handleHome (event) {
    hashHistory.push('/hotels')
    event.preventDefault()
  }
  handleEditSubmit () {
    if (this.state.rating === 0) {
      this.setState({ errMessage: 'Please give star rating' })
    } else if (this.state.reviewHeadline.trim() === null || this.state.reviewHeadline.trim() === undefined || this.state.reviewHeadline.trim() === '') {
      this.setState({ errMessage: 'Please give review headline' })
    } else if (this.state.reviewComments.trim() === null || this.state.reviewComments.trim() === undefined || this.state.reviewComments.trim() === '') {
      this.setState({ errMessage: 'Please give review comments' })
    } else if (this.state.rating === this.state.reviewRatingData.rating && this.state.reviewHeadline === this.state.reviewRatingData.reviewHeadline &&
      this.state.reviewHeadline === this.state.reviewRatingData.reviewHeadline) {
      this.props.handleViewClose()
    } else {
      let reviewRatingObj = {
        rating: this.state.rating,
        reviewHeadline: this.state.reviewHeadline,
        reviewComments: this.state.reviewComments,
        bookingCode: this.state.bookingCode
      }
      let putEUReviewRating = {
        url: config.baseUrl + config.putEUReviewRatingsAPI,
        body: reviewRatingObj
      }
      let _this = this
      APICallManager.putCall(putEUReviewRating, function (resObj) {
        if (resObj.data.statusCode === '1051') {
          _this.setState({ successMessage: 'Updated successfully' })
          setTimeout(() => {
            _this.props.handleViewClose()
          }, 500)
        } else {
          _this.setState({ errMessage: t`lanCommonLabelErrorRecordUpdateFailed` })
        }
      })
    }
  }
  handleCreate () {
    if (this.state.rating === 0) {
      this.setState({ errMessage: 'Please give star rating' })
    } else if (this.state.reviewHeadline.trim() === null || this.state.reviewHeadline.trim() === undefined || this.state.reviewHeadline.trim() === '') {
      this.setState({ errMessage: 'Please give review headline' })
    } else if (this.state.reviewComments.trim() === null || this.state.reviewComments.trim() === undefined || this.state.reviewComments.trim() === '') {
      this.setState({ errMessage: 'Please give review comments' })
    } else {
      let data = this.props.dataObj
      let postObj = {
        euName: data.euName,
        spServiceProviderId: data.spServiceProviderId,
        spServiceProvider: data.spServiceProvider,
        spLocationId: data.spLocationId,
        bookingCode: data.bookingCode,
        rating: this.state.rating,
        reviewHeadline: this.state.reviewHeadline,
        reviewComments: this.state.reviewComments,
        spPropertyId: data.spPropertyId,
        spPropertyInfoId: data.spPropertyInfoId._id
      }
      let _this = this
      let obj = { url: config.baseUrl + config.postEUReviewRatingsAPI, body: postObj }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '1050') {
          _this.setState({ successMessage: 'Created successfully' })
          setTimeout(() => {
            _this.props.handleViewClose()
          }, 500)
        } else {
          _this.setState({ errorMessage: 'Review Rating Failed' })
        }
      })
    }
  }
  render () {
    return (
      <div className='main-content view-rating-page enduser' id='panel'>
        {/* <div className='header bg-primary pb-6'>
          <div className='container'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{this.state.editDisable === false && this.state.statusCode === '0000' ? t`lanEUTitleReviewRatingEdit`
                        : this.state.editDisable === false && this.state.statusCode === '9997' ? t`lanEUTitleReviewRatingCreate` : t`lanEUTitleReviewRatingView`}</h6>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  <a onClick={this.handleBack} className='btn btn-sm btn-neutral'>{t`lanCommonButtonBack`}</a>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center pt-7 pb-5'>
                <div className='col-lg-6 col-7'>
                  {/* <h6 className='h2 text-white d-inline-block mb-0'>{t`lanEUTitleInbox`}</h6> */}
                  <nav aria-label='breadcrumb eu' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleBack} >Bookings</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>
                        {this.state.editDisable === false && this.state.statusCode === '0000' ? t`lanEUTitleReviewRatingEdit`
                        : this.state.editDisable === false && this.state.statusCode === '9997' ? t`lanEUTitleReviewRatingCreate` : t`lanEUTitleReviewRatingView`}
                      </li>
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
                <div className='card-header bg-transparent px-5 pb-3 row'>
                  <h5 className='card-title col-sm-10'>{t`lanEUTitleReviewRatingDetails`}</h5>
                  {this.state.statusCode === '9997' ? null
                    : <a onClick={this.handleEdit} className='col-sm-2 text-right'> {t`lanCommonButtonEdit`} <span><i className='fas fa-edit' /></span></a>
                  }
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
                                    {(this.state.reviewRatingData.bookingId && this.state.reviewRatingData.bookingId.spPropertyTitle) ? this.state.reviewRatingData.bookingId.spPropertyTitle : this.props.hotel}</p>
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item-one py-1'>
                              <div className='row align-items-center'>
                                <div className='col-lg-3'>
                                  <small>{t`lanCommonLabelBookingCode`}</small>
                                </div>
                                <div className='col-lg-8'>
                                  <p className='mb-0 card-text'>{this.state.reviewRatingData.bookingCode ? this.state.reviewRatingData.bookingCode : this.props.data}</p>
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
                                <div className='col-lg-8'>
                                  <input type='text' disabled={this.state.editDisable} value={this.state.reviewHeadline} onChange={(e) => this.setState({ reviewHeadline: e.target.value, errMessage: '' })} />
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item-one py-1'>
                              <div className='row'>
                                <div className='col-lg-3'>
                                  <small>{t`lanEULabelReviewComment`}</small>
                                </div>
                                <div className='col-lg-8'>
                                  <input type='text' disabled={this.state.editDisable} value={this.state.reviewComments} onChange={(e) => this.setState({ reviewComments: e.target.value, errMessage: '' })} />
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div style={{ color: 'red' }}>
                          {this.state.errMessage}
                        </div>
                        <div style={{ color: 'green' }}>
                          {this.state.successMessage}
                        </div>
                        {this.state.editDisable === false && this.state.statusCode === '0000' ? <div className='col-sm-12 text-center'><button onClick={this.handleEditSubmit} type='button' className='btn btn-primary my-3'>{t`lanCommonButtonEdit`}</button></div>
                        : this.state.editDisable === false && this.state.statusCode === '9997' ? <div className='col-sm-12 text-center'> <button onClick={this.handleCreate} type='button' className='btn btn-primary my-3'>{t`lanCommonButtonCreate`}</button></div>
                        : null }
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
EURatingComponent.propTypes = {
  data: PropTypes.any,
  handleViewClose: PropTypes.func,
  hotel: PropTypes.any,
  dataObj: PropTypes.object
}

export default EURatingComponent
