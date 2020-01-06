/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
// import { Tabs, Tab } from 'react-bootstrap'
import PropTypes from 'prop-types'
// import moment from 'moment'
import { t } from 'ttag'
import Pagination from 'react-js-pagination'

import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
// import './css/Blocked.css'
import './css/Blocked.css'

class ADDashboardBlockedDatesListComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      propertyId: this.props.propertyID,
      propertyObj: this.props.propertyObj,
      blockedDatesList: [],
      searchString: '',
      activePage: 1,
      totalCount: 0
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
  }
  componentWillMount () {
    let obj = { url: config.baseUrl + config.getADHomeBlockedDatesAPI + this.state.activePage + '/' }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ blockedDatesList: resObj.data.statusResult.blockedDatesData, totalCount: resObj.data.statusResult.totalDocs })
      } else {
        _this.setState({ blockedDatesList: [], totalCount: 0 })
      }
    })
  }
  handleInputChange (event) {
    this.setState({ activePage: 1 })
    let _this = this
    let searchValue = this.state.searchString
    // _this.setState({ searchString: event.target.value })
    let usersList = {
      url: config.baseUrl + config.getADHomeBlockedDatesAPI + '1' + '/' + searchValue
    }
    APICallManager.getCall(usersList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ blockedDatesList: resObj.data.statusResult.blockedDatesData, totalCount: resObj.data.statusResult.totalDocs })
      } else {
        _this.setState({ blockedDatesList: [], totalCount: 0 })
      }
    })
  }
  handlePageChange (pageNumber) {
    if (this.state.activePage !== pageNumber) {
      this.setState({ activePage: pageNumber })
      let usersList = { url: config.baseUrl + config.getADHomeBlockedDatesAPI + pageNumber + '/' + this.state.searchString }
      let _this = this
      APICallManager.getCall(usersList, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ blockedDatesList: resObj.data.statusResult.blockedDatesData, totalCount: resObj.data.statusResult.totalDocs })
        } else {
          _this.setState({ blockedDatesList: [], totalCount: 0 })
        }
      })
    }
  }
  handleBack () {
    hashHistory.push('/admin/home')
    event.preventDefault()
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
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanADLabelDashboardBlockedDates`}</h6>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleBack}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item active' aria-current='page'>{t`lanADLabelDashboardBlockedDates`}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='blockedate-list container-fluid mt--6'>
          <div className='card mb-2'>
            <div className='card-header'>
              <div className='row'>
                <div className='col-md-8'>
                  <h3>{t`lanADLabelDashboardBlockedDates`}</h3>
                </div>
                <div className='col-md-3'>
                  <form>
                    <div className='form-group mb-0'>
                      <div className='input-group input-group-lg input-group-flush'>
                        <div className='input-group-prepend'>
                          <div className='input-group-text'>
                            <span className='fas fa-search' />
                          </div>
                        </div>
                        <input type='search' className='form-control' placeholder={t`lanCommonLabelSearch`} value={this.state.searchString}
                          onChange={(e) => { this.setState({ searchString: e.target.value }) }} onKeyPress={this.handleEnter} />
                      </div>
                    </div>
                  </form>
                </div>
                <div className='col-md-1 pl-0'>
                  <button className='btn btn-icon btn-primary px-3 py-2' type='button' onClick={this.handleInputChange}>
                    <span className='btn-inner--icon'><i className='fa fa-search' /></span>
                  </button>
                </div>
              </div>
            </div>
            <div className='card-body'>
              <section className='notifications bookings'>
                <div className='row clearfix'>
                  <div className='col-md-12 col-lg-12 col-xl-12'>
                    {/* tabs list */}
                    {/* <Tabs activeKey={this.state.key} onSelect={key => this.handleTabChange(key)} */}
                    <div>
                      <div className='table-responsive'>
                        <table className='table align-items-center table-flush table-striped'>
                          <thead className='thead-light'>
                            <tr>
                              <th>{t`lanCommonLabelBusiness`}</th>
                              <th>{t`lanADLabelDashboardBlockingType`}</th>
                              <th>{t`lanADLabelDashboardFromDate`}</th>
                              <th>{t`lanADLabelDashboardToDate`}</th>
                            </tr>
                          </thead>
                          {this.state.blockedDatesList && this.state.blockedDatesList.length > 0 ? this.state.blockedDatesList.map((item, i) =>
                            <tbody key={i}>
                              <tr>
                                <td>
                                  <span className='text-muted'>{item.spServiceProvider}</span>
                                </td>
                                <td>
                                  <span className='text-muted'>{item.blockingType}</span>
                                </td>
                                <td>
                                  <span className='text-muted'>{item.blockingFromDate}</span>
                                </td>
                                <td>
                                  <span className='text-muted'>{item.blockingToDate} </span>
                                </td>
                              </tr>
                            </tbody>) : <tfoot>
                              <tr><td colSpan='4' className='text-center p-8'>{t`lanADLabelDashboardNoBlockedDates`}</td></tr>
                            </tfoot>}
                        </table>
                      </div>
                      {/* <div className='card-footer text-center'>
                        <button className='btn btn-primary mb-0' onClick={this.handleBack}>{ t`lanCommonButtonBack` }</button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        <div className='row justify-content-center'>
          <div className='col-sm-12'>
            {this.state.totalCount > 0
            ? <div className='card-footer'>
              <div className='row justify-content-center'>
                <Pagination
                  activePage={this.state.activePage}
                  itemsCountPerPage={20}
                  totalItemsCount={this.state.totalCount}
                  pageRangeDisplayed={5}
                  onChange={this.handlePageChange}
              />
              </div>
            </div> : null }
          </div>
        </div>
      </div>
    )
  }
}
ADDashboardBlockedDatesListComponent.propTypes = {
  propertyID: PropTypes.any,
  propertyObj: PropTypes.any
}

export default ADDashboardBlockedDatesListComponent
