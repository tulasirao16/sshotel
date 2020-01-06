/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import Pagination from 'react-js-pagination'
import ADHostsReviewRatingsListViewComponent from './ADHostsReviewRatingsListViewComponent'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

class ADHostsReviewRatingsListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      reviewRatingList: [],
      hostData: JSON.parse(localStorage.getItem('hostData')),
      activePage: 1,
      searchString: '',
      isDisplay: 'List',
      reviewRatingsBy: localStorage.getItem('reviewRatingsBy'),
      hostreviewRatings:localStorage.getItem('hostreviewRatings')
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleStatus = this.handleStatus.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleDashboardReviewRatingslist = this.handleDashboardReviewRatingslist.bind(this)
    this.handleDashboardReviewRatingsInputChangelist = this.handleDashboardReviewRatingsInputChangelist.bind(this)
    this.handleDashboardReviewRatingsPageChangelist = this.handleDashboardReviewRatingsPageChangelist.bind(this)
    this.handleADReviewViewBack = this.handleADReviewViewBack.bind(this)
    this.handleHosts = this.handleHosts.bind(this)
    this.handleHostDashboard = this.handleHostDashboard.bind(this)
  }
  componentWillMount () {
    if (this.state.reviewRatingsBy === 'Dashboard') {
      let obj = {}
      obj = { url: config.baseUrl + config.getADHostsReviewRatingsListAPI + 'null' + '/' + this.state.activePage + '/' }
      this.handleDashboardReviewRatingslist(obj)
    } else {
      let obj = {}
      obj = { url: config.baseUrl + config.getADHostsReviewRatingsListAPI + this.state.hostData._id + '/' + this.state.activePage + '/' }
      this.handleDashboardReviewRatingslist(obj)
    }
  }
  handleDashboardReviewRatingslist (obj) {
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          reviewRatingList: resObj.data.statusResult.reviewsData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          reviewRatingList: [], matchesData: false
        })
      }
    })
  }
  handleInputChange (event) {
    // let search = event.target.value
    this.setState({ activePage:1 })
    if (this.state.reviewRatingsBy === 'Dashboard') {
      let obj = {}
      obj = { url: config.baseUrl + config.getADHostsReviewRatingsListAPI + 'null' + '/' + 1 + '/' + this.state.searchString }
      this.handleDashboardReviewRatingsInputChangelist(obj)
    } else {
      let obj = {}
      obj = { url: config.baseUrl + config.getADHostsReviewRatingsListAPI + this.state.hostData._id + '/' + 1 + '/' + this.state.searchString }
      this.handleDashboardReviewRatingsInputChangelist(obj)
    }
  }
  handleDashboardReviewRatingsInputChangelist (obj) {
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          reviewRatingList: resObj.data.statusResult.reviewsData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          reviewRatingList: [], matchesData: false
        })
      }
    })
  }
  handlePageChange (pageNumber) {
    if (this.state.activePage !== pageNumber) {
      this.setState({ activePage: pageNumber })
      let obj = {}
      if (this.state.reviewRatingsBy === 'Dashboard') {
        obj = { url: config.baseUrl + config.getADHostsReviewRatingsListAPI + 'null' + '/' + pageNumber + '/' + this.state.searchString }
      } else {
        obj = { url: config.baseUrl + config.getADHostsReviewRatingsListAPI + this.state.hostData._id + '/' + pageNumber + '/' + this.state.searchString }
      }
      this.handleDashboardReviewRatingsPageChangelist(obj)
    }
  }
  handleDashboardReviewRatingsPageChangelist (obj) {
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          reviewRatingList: resObj.data.statusResult.reviewsData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          reviewRatingList: [], matchesData: false
        })
      }
    })
  }
  handleStatus (item) {
    let _this = this
    let putReviewratingData = {
      status: item.reviewStatus === 'Active' ? 'Inactive' : 'Active'
    }
    let obj = { url: config.baseUrl + config.putADHostsReviewRatingsListAPI + item._id, body: putReviewratingData }
    let reviewRatings = this.state.reviewRatingList
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        const i = reviewRatings.indexOf(item)
        reviewRatings[i].reviewStatus = resObj.data.statusResult.reviewStatus
        _this.setState({
          reviewRatingList: reviewRatings
        })
      } else {
        ToastsStore.error('Reviewrating Inactive failed')
      }
    })
  }
  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleViewUser (item) {
    this.setState({
      isDisplay: 'View',
      reviewData: item
    })
    event.preventDefault()
  }
  handleADReviewViewBack () {
    this.setState({
      isDisplay: 'List'
    })
  }
  handleHosts () {
    localStorage.removeItem('hostData')
    hashHistory.push('/admin/hosts')
  }
  handleHostDashboard () {
    hashHistory.push('/admin/host-dashboard')
    event.preventDefault()
  }
  componentWillUnmount () {
    localStorage.removeItem('hostreviewRatings')
    localStorage.removeItem('reviewRatingsBy')
  }
  handleEnter (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }
  render () {
    return (
      <div>
        {this.state.isDisplay === 'List'
          ? <div>
            <div className='header bg-primary pb-6'>
              <div className='container-fluid'>
                <div className='header-body'>
                  <div className='row align-items-center pt-4 pb-4'>
                    <div className='col-lg-6 col-7'>
                      <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                        <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                          <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                          {this.state.hostreviewRatings === 'hostdashboard'
                        ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                          <li className='breadcrumb-item active eu-font' />
                          <li className='breadcrumb-item active eu-font'><a onClick={this.handleHostDashboard}>{t`lanADHostTitleDashboard`}</a></li>
                          <li className='breadcrumb-item active eu-font'> Review-Ratings List</li>
                        </ol>
                        : this.state.reviewRatingsBy === 'Dashboard'
                        ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                          <li className='breadcrumb-item active eu-font' />
                          <li className='breadcrumb-item active eu-font'> Review-Ratings List</li>
                        </ol>
                        : <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                          <li className='breadcrumb-item active eu-font' />
                          <li className='breadcrumb-item active eu-font'><a onClick={this.handleHosts}>{t`lanADHostTitleList`}</a></li>
                          <li className='breadcrumb-item active eu-font'> Review-Ratings List</li>
                        </ol>
                        }
                        </ol>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='container-fluid mt--6 pb-4'>
              <div className='row justify-content-center notifictions'>
                <div className='col-lg-12 card-wrapper'>
                  <div className='card mb-2'>
                    <div className='card-header'>
                      <h6 className='h2 text-primary d-inline-block pt-2'>{t`lanEUTitleReviews`}</h6>
                    </div>
                    <div className='card-body'>
                      <section className='notifications bookings'>
                        <div className='row mb-3'>
                          <div className='col-md-7' />
                          <div className='col-sm-4 pr-0'>
                            <form>
                              <div className='form-group mb-0'>
                                <div className='input-group input-group-lg input-group-flush'>
                                  <div className='input-group-prepend'>
                                    <div className='input-group-text'><i className='fa fa-search' /></div>
                                  </div>
                                  <input type='search' className='form-control' placeholder='Search' value={this.state.searchString}
                                    onChange={(e) => { this.setState({ searchString: e.target.value }) }} onKeyPress={this.handleEnter} />
                                </div>
                              </div>
                            </form>
                          </div>
                          <div className='col-md-1 pl-0'>
                            <button className='btn btn-icon btn-primary search-btn-admin px-3 py-2' type='button' onClick={this.handleInputChange}>
                              <span className='btn-inner--icon'><i className='fa fa-search' /></span>
                            </button>
                          </div>
                        </div>
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
                                        <th>{t`lanEULabelRating`}</th>
                                        <th>{t`lanEULabelReviewHeader`}</th>
                                        <th>Actions</th>
                                      </tr>
                                    </thead>
                                    {this.state.reviewRatingList.map((item, i) =>
                                      <tbody key={i}>
                                        <tr>
                                          <td className='table-user'>
                                            <a ><strong>{item.spServiceProvider}, {item.spLocationId ? item.spLocationId.area : ''}</strong></a>
                                          </td>
                                          <td>
                                            <span >{item.bookingCode}</span>
                                          </td>
                                          <td>
                                            <span >{item.rating}</span>
                                          </td>
                                          <td>
                                            <span >{item.reviewHeadline}</span>
                                          </td>
                                          <td className='table-actions btn-actions'>
                                            <a onClick={() => this.handleViewUser(item)} className='update-edit' data-toggle='tooltip' data-placement='top' title={t`lanSPButtonTooltipViewUser`}>
                                              <span className='avatar avatar-xs mr-2 bg-primary rounded-circle'>
                                                <span className='media-object d-flex justify-content-center align-items-center'><i className='far fa-eye' /></span>
                                              </span>
                                            </a>
                                            <button className='btn-sm success' style={item.reviewStatus === 'Active' ? { background: '#ff0000', color:'#fff', outline:0 } : { background: '#4da424', color:'#fff', outline:0 }}
                                              onClick={() => this.handleStatus(item)} >{item.reviewStatus === 'Active' ? 'Inactive' : 'Active'}</button>
                                          </td>
                                        </tr>
                                      </tbody>
                                    )}
                                  </table>
                                </div>
                              </div>
                            </div>
                            : this.state.matchesData
                              ? <div className='container'>
                                <div className='row justify-content-center'>
                                  <div className='col-sm-12 text-center my-0' >
                                    <div className='no-data'><p>{t`lanCommonLabelNoMatchesFound`}</p></div>
                                  </div>
                                </div>
                              </div>
                              : <div className='container'>
                                <div className='row justify-content-center'>
                                  <div className='col-sm-12 text-center my-0' >
                                    <div className='no-data'><p>{t`lanSPLabelNoReviewRatings`}</p></div>
                                  </div>
                                </div>
                              </div>
                          }
                        </div>
                      </section>
                    </div>
                    {this.state.reviewRatingList && this.state.reviewRatingList.length > 0
                      ? <div className='card-footer'>
                        <div className='text-center'>
                          <Pagination
                            activePage={this.state.activePage}
                            itemsCountPerPage={30}
                            totalItemsCount={this.state.totalCount}
                            pageRangeDisplayed={5}
                            onChange={this.handlePageChange}
                          />
                        </div>
                      </div>
                      : null}
                  </div>
                </div>
              </div>
              <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
            </div>
          </div>
          : this.state.isDisplay === 'View' ? <ADHostsReviewRatingsListViewComponent reviewData={this.state.reviewData} reviewRatingList={this.state.reviewRatingList} handleViewUser={this.handleADReviewViewBack} />
            : ''}
      </div>
    )
  }
}
export default ADHostsReviewRatingsListComponent
