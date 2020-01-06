/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import { t } from 'ttag'
import './css/Reviews.css'
import { hashHistory } from 'react-router'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import EUReviewRatingViewComponent from './EUReviewRatingsViewComponent'

class EUReviewRatingsListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      authObj: JSON.parse(localStorage.getItem('authObj')),
      reviewRatingList: [],
      searchString: '',
      matchesData: false,
      isShowList: true,
      isShowView: false
    }
    this.handleReviewRatingView = this.handleReviewRatingView.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleViewBack = this.handleViewBack.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }
  handleViewBack () {
    this.setState({ isShowView: false,
      isShowList: !this.state.isShowList })
  }
  handleHome (event) {
    hashHistory.push('/hotels')
    event.preventDefault()
  }
  componentWillMount () {
    let obj = {}
    obj = { url: config.baseUrl + config.getEUReviewRatingsListAPI }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          reviewRatingList: resObj.data.statusResult, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
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
    _this.setState({ searchString: event.target.value })
    let obj = {
      url: config.baseUrl + config.getEUReviewRatingsListAPI + event.target.value
    }
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          reviewRatingList: resObj.data.statusResult, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          reviewRatingList: [], totalCount: 0, matchesData: true
        })
      }
    })
  }
  handleReviewRatingView (reviewRatingObj) {
    localStorage.setItem('reviewRatingObj', JSON.stringify(reviewRatingObj))
    this.setState({
      isShowList: false,
      isShowView: !this.state.isShowView
    })
    event.preventDefault()
  }
  render () {
    return (
      <div>
        {this.state.isShowList
        ? <div>
          <div className='header bg-primary pb-6'>
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='row align-items-center pt-7 pb-5'>
                  <div className='col-lg-6 col-7'>
                    <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item active eu-font' aria-current='page'><a >{t`lanEUTitleReviewRatings`}</a></li>
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
                    <div className='row'>
                      <div className='col-sm-8'>
                        <h6 className='h2 text-primary d-inline-block pt-2'>{t`lanEUTitleReviews`}</h6>
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
                                      <th>{t`lanEULabelRating`}</th>
                                      <th>{t`lanEULabelReviewHeader`}</th>
                                      {/* <th>{t`lanEULabelReviewComment`}</th> */}
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
                                        {/* <td>
                                          <span className='text-muted'>{item.reviewComments} </span>
                                        </td> */}
                                        <td className='table-actions btn-actions'>
                                          <a onClick={() => this.handleReviewRatingView(item)} className='table-action table-action-view' data-toggle='tooltip' data-placement='top' title='View Review'>
                                            <i className='far fa-eye'>{/* fa eye icon */}</i>
                                          </a>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      : this.state.isShowView ? <EUReviewRatingViewComponent handleViewBack={this.handleViewBack} />
          // : this.state.isShowDelete ? <EUSupportDeleteComponent handleDeleteSupport={this.handleDeleteSupport} selectedSupportData={this.state.selectedSupportData} />
        : null}
      </div>
    )
  }
}

export default EUReviewRatingsListComponent
