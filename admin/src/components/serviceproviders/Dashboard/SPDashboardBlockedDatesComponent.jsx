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

import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
// import './css/Blocked.css'
import '../blockedDates/css/Blocked.css'

class SPDashboardBlockedDatesListComponent extends React.Component {
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
  }
  componentWillMount () {
    let obj = { url: config.baseUrl + config.getSPHomeBlockedDatesAPI + this.state.activePage + '/' }
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
    let _this = this
    _this.setState({ searchString: event.target.value })
    let usersList = {
      url: config.baseUrl + config.getSPHomeBlockedDatesAPI + '1' + '/' + event.target.value
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
    this.setState({ activePage: pageNumber })
    let usersList = { url: config.baseUrl + config.getSPHomeBlockedDatesAPI + pageNumber + '/' + this.state.searchString }
    let _this = this
    APICallManager.getCall(usersList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ blockedDatesList: resObj.data.statusResult.blockedDatesData, totalCount: resObj.data.statusResult.totalDocs })
      } else {
        _this.setState({ blockedDatesList: [], totalCount: 0 })
      }
    })
  }
  handleBack () {
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
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPSubTitleBlockedDates`}</h6>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleBack}><i className='fas fa-home' /></a></li>
                      {/* <li className='breadcrumb-item'><a onClick={this.handleBack}>Dashboards</a></li> */}
                      <li className='breadcrumb-item active' aria-current='page'>Blocked Dates</li>
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
                  <h3>{t`lanSPSubTitleBlockedDates`}</h3>
                </div>
                <div className='col-md-4'>
                  <form>
                    <div className='form-group mb-0'>
                      <div className='input-group input-group-lg input-group-flush'>
                        <div className='input-group-prepend'>
                          <div className='input-group-text'>
                            <span className='fas fa-search' />
                          </div>
                        </div>
                        <input type='search' className='form-control' placeholder={t`lanCommonLabelSearch`} value={this.state.searchString} onChange={(search) => this.handleInputChange(search)} />
                      </div>
                    </div>
                  </form>
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
                              <th>{t`lanSPLabelBlockingType`}</th>
                              <th>{t`lanSPLabelFromDate`}</th>
                              <th>{t`lanSPLabelToDate`}</th>
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
                            </tbody>
                            ) : <tfoot>
                              <tr><td colSpan='4' className='text-center p-8'>{t`lanSPLabelNoBlockedDates`}</td></tr>
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
      </div>
    )
  }
}
SPDashboardBlockedDatesListComponent.propTypes = {
  propertyID: PropTypes.any,
  propertyObj: PropTypes.any
}

export default SPDashboardBlockedDatesListComponent
