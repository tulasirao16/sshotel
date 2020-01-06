/* eslint-disable max-len */
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
import './css/Bookings.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import PropTypes from 'prop-types'
import StarRatings from 'react-star-ratings'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

class ADEURatingComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      reviewRatingData: {},
      data: this.props.data,
      rating : 0,
      reviewHeadline: '',
      reviewComments: '',
      errMessage: '',
      successMessage: '',
      statusCode: '',
      editDisable: true,
      activePage: 1,
      searchString: '',
      screen: props.screen ? props.screen : '',
      buttonDisabled: false
    }
    this.handleEdit = this.handleEdit.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.changeRating = this.changeRating.bind(this)
    this.handleEditSubmit = this.handleEditSubmit.bind(this)
    this.handleCreate = this.handleCreate.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleUsers = this.handleUsers.bind(this)
  }
  componentWillMount () {
    let getEUBookingRatingObj = {
      url: config.baseUrl + config.getADEUUserRatingReviewAPI + this.state.data._id
    }
    let _this = this
    APICallManager.getCall(getEUBookingRatingObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          // reviewRatingData : resObj.data.statusResult[0],
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
    hashHistory.push('/admin/home')
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
      this.setState({ buttonDisabled:true})
      let reviewRatingObj = {
        rating: this.state.rating,
        reviewHeadline: this.state.reviewHeadline,
        reviewComments: this.state.reviewComments
      }
      let putEUReviewRating = {
        url: config.baseUrl + config.putADEUUserRatingReviewUpdateAPI + this.state.data._id,
        body: reviewRatingObj
      }
      let _this = this
      APICallManager.putCall(putEUReviewRating, function (resObj) {
        if (resObj.data.statusCode === '1051') {
          ToastsStore.success('Updated successfully')
          setTimeout(() => {
            _this.props.handleViewClose()
          }, 2000)
        } else {
          ToastsStore.error('Record Update Failed')
          _this.setState({ buttonDisabled:false})
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
      this.setState({ buttonDisabled:true})
      let data = this.props.data
      let postObj = {
        euName: data.euName,
        euUserId: data.euUserId,
        spServiceProviderId: data.spServiceProviderId,
        spServiceProvider: data.spServiceProvider,
        spLocationId: data.spLocationId,
        bookingCode: data.bookingCode,
        bookingId: data._id,
        rating: this.state.rating,
        reviewHeadline: this.state.reviewHeadline,
        reviewComments: this.state.reviewComments,
        spPropertyId: data.spPropertyId,
        spPropertyInfoId: data.spPropertyInfoId._id
      }
      let _this = this
      let obj = { url: config.baseUrl + config.postADEUUserRatingReviewCreateAPI, body: postObj }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '1050') {
          ToastsStore.success('Created Successfully')
          setTimeout(() => {
            _this.props.handleViewClose()
          }, 2000)
        } else {
          ToastsStore.error('Review Rating Failed')
          _this.setState({ buttonDisabled:false})
        }
      })
    }
  }
  handleUsers () {
    hashHistory.push('/admin/eu-users')
    event.preventDefault()
  }
  render () {
    return (
      <div className='main-content view-rating-page enduser' id='panel'>
        <div className='header bg-primary pb-5'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center pt-3 pb-5'>
                {this.state.screen !== 'Dashboard'
                ? <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanADEUTitleAdminEUUsers`}</h6>
                  <nav aria-label='breadcrumb eu' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleUsers}>{t`lanADEUTitleEUUsers`}</a></li>
                      <li className='breadcrumb-item'><a onClick={this.props.handleViewClose}>{t`lanEUButtonBookings`}</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>
                        {this.state.editDisable === false && this.state.statusCode === '0000' ? t`lanEUTitleReviewRatingEdit`
                        : this.state.editDisable === false && this.state.statusCode === '9997' ? t`lanEUTitleReviewRatingCreate` : t`lanEUTitleReviewRatingView`}
                      </li>
                    </ol>
                  </nav>
                </div>
                  : <div className='col-lg-6 col-7'>
                    <nav aria-label='breadcrumb eu' className='d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item'><a onClick={this.props.handleViewClose}>{t`lanEUButtonBookings`}</a></li>
                        <li className='breadcrumb-item active' aria-current='page'>
                          {this.state.editDisable === false && this.state.statusCode === '0000' ? t`lanEUTitleReviewRatingEdit`
                          : this.state.editDisable === false && this.state.statusCode === '9997' ? t`lanEUTitleReviewRatingCreate` : t`lanEUTitleReviewRatingView`}
                        </li>
                      </ol>
                    </nav>
                  </div>}
              </div>
            </div>
          </div>
        </div>
        <div className='container mt--6 pb-4'>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-10 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header'>
                  <h5 className='card-title'>{t`lanEUTitleReviewRatingDetails`}</h5>
                  {this.state.statusCode === '9997' ? null
                    : <a onClick={this.handleEdit} className='text-right'> {t`lanCommonButtonEdit`} <span><i className='fas fa-edit' /></span></a>
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
                                  <p className='mb-0 card-text'>{this.props.hotel}</p>
                                  {/* {(this.state.reviewRatingData.bookingId && this.state.reviewRatingData.bookingId.spPropertyTitle) ? this.state.reviewRatingData.bookingId.spPropertyTitle : this.props.hotel}</p> */}
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
                                  {/* <p className='mb-0 card-text'>{this.state.reviewRatingData.bookingCode ? this.state.reviewRatingData.bookingCode : this.props.data}</p> */}
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
                          <ul className='list-group list-group-flush list my--3'>
                            <li className='list-group-item-one py-1'>
                              <div className='row'>
                                <div className='col-lg-3' />
                                <div className='col-lg-4'>
                                  {this.state.editDisable === false && this.state.statusCode === '0000' ? <div className='col-sm-12 text-center'><button disabled={this.state.buttonDisabled} onClick={this.handleEditSubmit} type='button' className='btn btn-primary my-3'>{t`lanCommonButtonUpdate`}</button></div>
                                  : this.state.editDisable === false && this.state.statusCode === '9997' ? <div className='col-sm-12 text-center'> <button disabled={this.state.buttonDisabled} onClick={this.handleCreate} type='button' className='btn btn-primary my-3'>{t`lanCommonButtonCreate`}</button></div>
                                  : null }
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
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
ADEURatingComponent.propTypes = {
  data: PropTypes.any,
  handleViewClose: PropTypes.func,
  hotel: PropTypes.any,
  bookingCode:PropTypes.any,
  handleBookingsBack:PropTypes.func,
  screen: PropTypes.string
}

export default ADEURatingComponent
