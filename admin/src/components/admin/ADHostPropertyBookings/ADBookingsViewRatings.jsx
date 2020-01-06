/* eslint-disable max-len */
/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import { t } from 'ttag'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import PropTypes from 'prop-types'
import StarRatings from 'react-star-ratings'

class ADBookingsViewRatings extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      reviewRatingData: {},
      data: JSON.parse(localStorage.getItem('bookingData')),
      rating : 0,
      reviewHeadline: '',
      reviewComments: '',
      errMessage: '',
      successMessage: '',
      statusCode: '',
      editDisable: true,
      hotel: this.props.hotel,
      bookingCode: this.props.bookingCode,
      activePage: 1
    }
    this.handleEdit = this.handleEdit.bind(this)
    this.handleToEnable = this.handleToEnable.bind(this)
    this.changeRating = this.changeRating.bind(this)
    this.handleEditSubmit = this.handleEditSubmit.bind(this)
  }
  componentWillMount () {
    this.setState({ rating: this.state.data.spPropertyId && this.state.data.spPropertyId.rating ? this.state.data.spPropertyId.rating : 0 })
    let getEUBookingRatingObj = {
      url: config.baseUrl + config.getADEUUserRatingReviewAPI + this.state.data._id
    }
    let _this = this
    APICallManager.getCall(getEUBookingRatingObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          reviewRatingData : resObj.data.statusResult,
          rating: resObj.data.statusResult.rating,
          reviewHeadline: resObj.data.statusResult.reviewHeadline,
          reviewComments: resObj.data.statusResult.reviewComments,
          statusCode: '0000'
        })
      } else {
        _this.setState({ editDisable: false, statusCode: '9997' })
      }
    })
  }
  handleEdit () {
    this.setState({ editDisable: !this.state.editDisable })
  }
  changeRating (rating) {
    this.setState({ rating: rating, errMessage: '' })
  }
  handleEditSubmit () {
    let reviewHeadline = this.state.reviewHeadline.trim()
    let reviewComments = this.state.reviewComments.trim()
    if (this.state.rating === 0) {
      this.setState({ errMessage: 'Please give star rating' })
    } else if (reviewHeadline === null || reviewHeadline === undefined || reviewHeadline === '') {
      this.setState({ errMessage: 'Please give review Headline' })
    } else if (reviewComments === null || reviewComments === undefined || reviewComments === '') {
      this.setState({ errMessage: 'Please give review comments' })
    } else if (this.state.rating === this.state.reviewRatingData.rating && reviewHeadline === this.state.reviewRatingData.reviewHeadline &&
      reviewComments === this.state.reviewRatingData.reviewComments) {
      this.setState({ errMessage: 'Please give diffrent ratings' })
    } else {
      let reviewRatingObj = {
        rating: this.state.rating,
        reviewHeadline: this.state.reviewHeadline,
        reviewComments: this.state.reviewComments,
        bookingCode: this.state.bookingCode
      }
      let putEUReviewRating = {
        url: config.baseUrl + config.putADEUUserRatingReviewUpdateAPI + this.state.data._id,
        body: reviewRatingObj
      }
      let _this = this
      APICallManager.putCall(putEUReviewRating, function (resObj) {
        if (resObj.data.statusCode === '1051') {
          _this.setState({ successMessage: 'Updated successfully' })
          setTimeout(() => {
            _this.props.handleBack()
          }, 1500)
        } else {
          _this.setState({ errMessage: t`lanCommonLabelErrorRecordUpdateFailed` })
        }
      })
    }
  }
  handleToEnable () {
    if (this.state.editDisable) {
      this.setState({ errMessage: 'please click on edit button to enable' })
      setTimeout(() => {
        this.setState({
          errMessage: ''
        })
      }, 2000)
    } else { null }
  }
  render () {
    return (
      this.state.statusCode === '0000'
        ? <div className='main-content view-rating-page enduser' id='panel'>
          <div className='container mt--6 pb-4'>
            <div className='row justify-content-center notifictions'>
              <div className='col-lg-10 card-wrapper'>
                <div className='card mb-2'>
                  <div className='card-header bg-transparent px-5 pb-3 row'>
                    <h5 className='card-title col-sm-10'>{t`lanEUTitleReviewRatingDetails`}</h5>
                    <a onClick={this.handleEdit} className='col-sm-2 text-right'> {t`lanCommonButtonEdit`} <span><i className='fas fa-edit' /></span></a>
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
                                    <p className='mb-0 card-text'>{this.props.hotel}</p>
                                  </div>
                                </div>
                              </li>
                              <li className='list-group-item-one py-1'>
                                <div className='row align-items-center'>
                                  <div className='col-lg-3'>
                                    <small>{t`lanCommonLabelBookingCode`}</small>
                                  </div>
                                  <div className='col-lg-8'>
                                    <p className='mb-0 card-text'>{this.props.bookingCode}</p>
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
                                      changeRating={!this.state.editDisable ? this.changeRating : null}
                                      numberOfStars={5}
                                      starWidthAndHeight={'5px'}
                                      starDimension='20px'
                                      starSpacing='5px'
                                      starHoverColor='gold'
                                    />
                                  </div>
                                </div>
                              </li>
                              <li className='list-group-item-one py-1'>
                                <div className='row align-items-center'>
                                  <div className='col-lg-3'>
                                    <small>{t`lanEULabelReviewHeadline`}</small>
                                  </div>
                                  <div className='col-lg-8' onClick={this.handleToEnable}>
                                    <input type='text' disabled={this.state.editDisable} value={this.state.reviewHeadline} style={{ cursor: this.state.editDisable ? 'not-allowed' : 'text' }} title={this.state.editDisable ? 'Disable' : ''} onChange={(e) => this.setState({ reviewHeadline: e.target.value, errMessage: '' })} />
                                  </div>
                                </div>
                              </li>
                              <li className='list-group-item-one py-1'>
                                <div className='row'>
                                  <div className='col-lg-3'>
                                    <small>{t`lanEULabelReviewComment`}</small>
                                  </div>
                                  <div className='col-lg-8' onClick={this.handleToEnable}>
                                    <input type='text' disabled={this.state.editDisable} value={this.state.reviewComments} style={{ cursor: this.state.editDisable ? 'not-allowed' : 'text' }} onChange={(e) => this.setState({ reviewComments: e.target.value, errMessage: '' })} />
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                          <div className='text-danger'>
                            {this.state.errMessage}
                          </div>
                          <div className='text-success'>
                            {this.state.successMessage}
                          </div>
                          {this.state.editDisable === false && this.state.statusCode === '0000'
                          ? <div className='col-sm-12 text-center'><button onClick={this.handleEditSubmit} type='button' className='btn btn-primary my-3'>{t`lanCommonButtonUpdate`}</button></div>
                          : null }
                          {/* {!this.state.editDisable ? <div className='col-sm-12 text-center'><button onClick={this.handleEditSubmit} type='button' className='btn btn-primary my-3'>{t`lanCommonButtonUpdate`}</button></div>
                          : null } */}
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      : <div className='card-body'>
        <h1>No Review Rating</h1>
      </div>
    )
  }
}
ADBookingsViewRatings.propTypes = {
  hotel: PropTypes.any,
  bookingCode:PropTypes.any
}

export default ADBookingsViewRatings
