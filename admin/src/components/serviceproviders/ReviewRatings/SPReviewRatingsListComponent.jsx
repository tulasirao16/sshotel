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
import Pagination from 'react-js-pagination'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import './css/Reviews.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

class SPReviewRatingsListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      authObj: JSON.parse(localStorage.getItem('authObj')),
      reviewRatingList: [],
      activePage: 1,
      searchString: '',
      isTimeBased: false,
      matchesData: false
    }
    this.handleReviewRatingView = this.handleReviewRatingView.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleReviewRatingStatus = this.handleReviewRatingStatus.bind(this)
    this.handlePageChangeReviewRatingList = this.handlePageChangeReviewRatingList.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }
  componentWillMount () {
    let isTimeBased = localStorage.getItem('homeReviewRating')
    let obj = {}
    if (isTimeBased === 'True') {
      obj = { url: config.baseUrl + config.getSPReviewRatingsListAPI + isTimeBased + '/' + this.state.activePage + '/' }
      this.setState({ isTimeBased: true })
    } else {
      obj = { url: config.baseUrl + config.getSPReviewRatingsListAPI + this.state.isTimeBased + '/' + this.state.activePage + '/' }
      this.setState({ isTimeBased: false })
    }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          reviewRatingList: resObj.data.statusResult.myreviews, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          reviewRatingList: [], matchesData: false
        })
      }
    })
  }
  handleInputChange (event) {
    let _this = this
    _this.setState({ searchString: event.target.value, activePage: 1 })
    let obj = {
      url: config.baseUrl + config.getSPReviewRatingsListAPI + this.state.isTimeBased + '/' + '1' + '/' + event.target.value
    }
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          reviewRatingList: resObj.data.statusResult.myreviews, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          reviewRatingList: [], totalCount: 0, matchesData: true
        })
      }
    })
  }
  handlePageChangeReviewRatingList (pageNumber) {
    this.setState({ activePage: pageNumber })
    let obj = { url: config.baseUrl + config.getSPReviewRatingsListAPI + this.state.isTimeBased + '/' + pageNumber + '/' + this.state.searchString }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          reviewRatingList: resObj.data.statusResult.myreviews, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          reviewRatingList: [], totalCount: 0, matchesData: false
        })
      }
    })
  }
  handleReviewRatingView (reviewRatingObj) {
    localStorage.setItem('reviewRatingObj', JSON.stringify(reviewRatingObj))
    hashHistory.push('/host/reviewratings/view')
    event.preventDefault()
  }
  handleReviewRatingStatus (reviewRatingObj) {
    if (reviewRatingObj.reviewStatus === 'Active') {
      this.inactivateStatus(reviewRatingObj)
    } else {
      this.activateStatus(reviewRatingObj)
    }
  }
  inactivateStatus (reviewRatingObj) {
    let _this = this
    let obj = { url: config.baseUrl + config.putSPReviewRatingActivateInactivateAPI + reviewRatingObj._id + '/' + 'Inactive' }
    let reviewRatings = this.state.reviewRatingList
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        const i = reviewRatings.indexOf(reviewRatingObj)
        reviewRatings[i].reviewStatus = resObj.data.statusResult.reviewStatus
        _this.setState({
          reviewRatingList: reviewRatings
        })
      } else {
        alert('Review inactivation failed')
      }
    })
  }
  activateStatus (reviewRatingObj) {
    let _this = this
    let obj = { url: config.baseUrl + config.putSPReviewRatingActivateInactivateAPI + reviewRatingObj._id + '/' + 'Active' }
    let reviewRatings = this.state.reviewRatingList
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        const i = reviewRatings.indexOf(reviewRatingObj)
        reviewRatings[i].reviewStatus = resObj.data.statusResult.reviewStatus
        _this.setState({
          reviewRatingList: reviewRatings
        })
      } else {
        alert('Review activation failed')
      }
    })
  }
  handleHome () {
    hashHistory.push('/host/home')
    event.preventDefault()
  }

  render () {
    return (
      <div>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitleReviewRatings`}</h6>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      {/* <li className='breadcrumb-item'><a>Dashboard</a></li> */}
                      <li className='breadcrumb-item active' aria-current='page'>{t`lanSPTitleReviews&Ratings`}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6'>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-12 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header'>
                  <div className='row'>
                    <div className='col-sm-8'>
                      <h3 className='mb-0'>{t`lanSPTitleReviewRatings`} </h3>
                    </div>
                    <div className='col-lg-4 text-right'>
                      {/* -- Search form -- */}
                      <form>
                        <div className='form-group mb-0'>
                          <div className='input-group input-group-lg input-group-flush'>
                            <div className='input-group-prepend'>
                              <div className='input-group-text'>
                                <span className='fas fa-search'>{/* Search Icon */}</span>
                              </div>
                            </div>
                            <input type='text' className='form-control' placeholder='Search' value={this.state.searchString} onChange={this.handleInputChange} />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className='card-body'>
                  <section className='notifications bookings'>
                    <div className='row clearfix'>
                      {this.state.reviewRatingList.length > 0
                        ? <div className='col-md-12 col-lg-12 col-xl-12'>
                          <div>
                            <div className='table-responsive'>
                              <table className='table align-items-center table-flush table-striped'>
                                <thead className='thead-light'>
                                  <tr>
                                    <th>{t`lanCommonLabelProperty`}</th>
                                    <th>{t`lanCommonLabelBookingCode`}</th>
                                    <th>{t`lanSPLabelRating`}</th>
                                    <th>{t`lanSPLabelReviewHeader`}</th>
                                    <th>{t`lanSPLabelReviewComment`}</th>
                                    <th>{t`lanCommonLabelStatus`}</th>
                                    <th>{t`lanCommonLabelActions`}</th>
                                  </tr>
                                </thead>
                                {this.state.reviewRatingList.map((item, i) =>
                                  <tbody key={i}>
                                    <tr>
                                      <td className='table-user'>
                                        <a href='#'><strong>{item.spServiceProvider}, {item.spLocationId ? item.spLocationId.area : ''}</strong></a>
                                      </td>
                                      <td>
                                        <span className='text-muted'>{item.bookingCode}</span>
                                      </td>
                                      <td>
                                        <span className='text-muted'>{item.rating} <i className='fas fa-star rating-star' style={{ color: 'gold' }} /></span>
                                      </td>
                                      <td>
                                        <span className='text-muted'>{item.reviewHeadline}</span>
                                      </td>
                                      <td>
                                        <span className='text-muted'>{item.reviewComments} </span>
                                      </td>
                                      <td>
                                        <span className='text-muted'>{item.reviewStatus} </span>
                                      </td>
                                      <td className='table-actions btn-actions'>
                                        <a onClick={() => this.handleReviewRatingView(item)} className='table-action table-action-view' data-toggle='tooltip' data-placement='top' title='View Review'>
                                          <i className='far fa-eye'>{/* fa eye icon */}</i>
                                        </a>
                                        <button className='btn-sm success' style={item.reviewStatus === 'Active' ? { background: '#ef543b' } : { background: '#4da424' }} onClick={() => this.handleReviewRatingStatus(item)} >{item.reviewStatus === 'Active' ? 'Inactivate' : 'Activate'}</button>
                                      </td>
                                    </tr>
                                  </tbody>
                                )}
                              </table>
                            </div>
                          </div>
                        </div> : this.state.matchesData
                        ? <div className='container'>
                          <div className='row justify-content-center'>
                            <div className='col-sm-12 text-center'>
                              <div className='no-data'><p>{t`lanCommonLabelNoMatchesFound`}</p></div>
                            </div>
                          </div>
                        </div>
                        : <div className='container'>
                          <div className='row justify-content-center'>
                            <div className='col-sm-12 text-center'>
                              <div className='no-data'><p>{t`lanSPLabelNoReviewRatings`}</p></div>
                            </div>
                          </div>
                        </div>
                        }
                    </div>
                  </section>
                  {this.state.reviewRatingList && this.state.reviewRatingList.length > 0
                    ? <div className='card-footer'>
                      <div className='row justify-content-center'>
                        <Pagination
                          activePage={this.state.activePage}
                          itemsCountPerPage={20}
                          totalItemsCount={this.state.totalCount}
                          pageRangeDisplayed={5}
                          onChange={this.handlePageChangeReviewRatingList}
                        />
                      </div>
                    </div> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SPReviewRatingsListComponent
