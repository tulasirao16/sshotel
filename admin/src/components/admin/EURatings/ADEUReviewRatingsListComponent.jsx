/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import { hashHistory } from 'react-router'

import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import Pagination from 'react-js-pagination'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

class ADEUReviewRatingsListComponent extends React.Component {
  constructor () {
    let userData = JSON.parse(localStorage.getItem('userData'))
    super()
    this.state = {
      reviewRatingList: [],
      euUserId: userData._id,
      activePage: 1,
      searchString: '',
      totalCount: 0,
      matchesData: false
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleStatus = this.handleStatus.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleEUUsers = this.handleEUUsers.bind(this)
  }

  componentWillMount () {
    let obj = {}
    obj = { url: config.baseUrl + config.getADEUReviewRatingsListAPI + this.state.euUserId + '/' + this.state.activePage + '/' }
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
    this.setState({ activePage: 1 })
    let obj = {
      url: config.baseUrl + config.getADEUReviewRatingsListAPI + this.state.euUserId + '/' + 1 + '/' + this.state.searchString
    }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          reviewRatingList: resObj.data.statusResult.reviewsData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          reviewRatingList: [], totalCount: 0, matchesData: true
        })
      }
    })
  }
  handlePageChange (pageNumber) {
    if (this.state.activePage !== pageNumber) {
      this.setState({ activePage: pageNumber })
      let _this = this
      let obj = { url: config.baseUrl + config.getADEUReviewRatingsListAPI + this.state.euUserId + '/' + pageNumber + '/' + this.state.searchString }
      APICallManager.getCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ reviewRatingList: resObj.data.statusResult.reviewsData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false })
        } else {
          _this.setState({ reviewRatingList: [], totalCount: 0, matchesData: false })
        }
      })
    }
  }
  handleStatus (item) {
    let _this = this
    let putReviewratingData = {
      status: item.reviewStatus === 'Active' ? 'Inactive' : 'Active'
    }
    let obj = { url: config.baseUrl + config.putADEUReviewRatingsStatusAPI + item._id, body: putReviewratingData }
    let reviewRatings = this.state.reviewRatingList
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        const i = reviewRatings.indexOf(item)
        reviewRatings[i].reviewStatus = resObj.data.statusResult.reviewStatus
        _this.setState({
          reviewRatingList: reviewRatings
        })
      } else {
        ToastsStore.error(t`lanEULabelErrorReviewratingInactiveFailed`)
      }
    })
  }
  handleHome (event) {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleEUUsers () {
    localStorage.setItem('menuItem', 'EUUsers')
    hashHistory.push('/admin/eu-users')
  }
  handleEnter (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }
  render () {
    return (
      <div>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center pt-2 pb-4'>
                <div className='col-lg-6 col-7'>
                  {/* <h6 className='h2 text-white d-inline-block mb-0'>EndUsers-List</h6> */}
                  <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item active eu-font'><a onClick={this.handleEUUsers}>{t`lanEndUsersTitleList`}</a></li>
                      <li className='breadcrumb-item active eu-font'>{t`lanEUTitleReviewratingsList`}</li>
                      {/* <li className='breadcrumb-item active eu-font'>Review ratings List</li> */}
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6 pb-4'>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-11 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header  py-2'>
                  <div className='row'>
                    <div className='col-sm-7'>
                      <h6 className='h2 text-primary d-inline-block pt-2'>{t`lanADEUTitleReviews`}</h6>
                    </div>
                    <div className='col-sm-4'>
                      {/* -- Search form -- */}
                      <form>
                        <div className='form-group mb-0'>
                          <div className='input-group input-group-lg input-group-flush'>
                            <div className='input-group-prepend'>
                              <div className='input-group-text'>
                                <span className='fas fa-search'>{/* Search Icon */}</span>
                              </div>
                            </div>
                            <input type='search' className='form-control' value={this.state.searchString}
                              onChange={(e) => { this.setState({ searchString: e.target.value }) }} onKeyPress={this.handleEnter} placeholder={t`lanCommonLabelSearch`} />
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className='col-sm-1'>
                      <button className='btn btn-icon btn-primary px-3 py-2' type='button' onClick={this.handleInputChange}>
                        <span className='btn-inner--icon'><i className='fa fa-search' /></span>
                      </button>
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
                                    <th>{t`lanEULabelRating`}</th>
                                    <th>{t`lanEULabelReviewHeader`}</th>
                                    <th>{t`lanCommonLabelActions`}</th>
                                  </tr>
                                </thead>
                                {this.state.reviewRatingList.map((item, i) =>
                                  <tbody key={i}>
                                    <tr>
                                      <td className='table-user'>
                                        <a ><strong>{item.spServiceProvider}, {item.spLocationId ? item.spLocationId.area : ''}</strong></a>
                                      </td>
                                      <td>
                                        <span className='text-muted'>{item.bookingCode}</span>
                                      </td>
                                      <td>
                                        <span className='text-muted'>{item.rating}</span>
                                      </td>
                                      <td>
                                        <span className='text-muted'>{item.reviewHeadline}</span>
                                      </td>
                                      <td className='table-actions btn-actions'>
                                        <button className='btn-sm success' style={item.reviewStatus === 'Active' ? { background: '#ef543b' } : { background: '#4da424' }}
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
                  {(this.state.reviewRatingList && this.state.reviewRatingList.length > 0)
                    ? <div className='card-footer'>
                      <div className='row justify-content-center'>
                        <Pagination
                          activePage={this.state.activePage}
                          itemsCountPerPage={30}
                          totalItemsCount={this.state.totalCount}
                          pageRangeDisplayed={5}
                          onChange={this.handlePageChange}
                        />
                      </div>
                    </div> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}

export default ADEUReviewRatingsListComponent

