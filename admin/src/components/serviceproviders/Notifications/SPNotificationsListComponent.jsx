/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
// import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import Pagination from 'react-js-pagination'
import moment from 'moment'

import { t } from 'ttag'
import DrawerWithHeader from '../Drawer/DrawerComponent'
import FooterComponent from '../FooterCompnt/Footer'
import SPNotificationsDeleteComponent from './SPNotificationsDeleteComponent'
import { hashHistory } from 'react-router'

class SPNotificationsListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      activePage: 1,
      notificationsList: [],
      matchesData: false,
      searchString: '',
      errorMessage: '',
      selectedDeleteData: {},
      isNotificationView:false
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleViewBack = this.handleViewBack.bind(this)
    this.handleUserDelete = this.handleUserDelete.bind(this)
    this.handleRedirect = this.handleRedirect.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }
  componentWillMount () {
    let obj = { url: config.baseUrl + config.getSPNotificationsListAPI + this.state.activePage + '/' }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          notificationsList: resObj.data.statusResult.notificationsData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          notificationsList: [], matchesData: false
        })
      }
    })
  }
  componentWillUnmount () {
    let obj1 = { url: config.baseUrl + config.putSPNotificationsReadAPI }
    APICallManager.putCall(obj1, function (resObj) {
      if (resObj.data.statusCode === '0000') {
      //  alert(t`lanSPSuccessNotificationsRead`)
      } else {
       // alert(t`lanSPErrorReadFailed`)
      }
    })
  }
  handleInputChange (event) {
    let _this = this
    _this.setState({ searchString: event.target.value, activePage: 1 })
    let obj = {
      url: config.baseUrl + config.getSPNotificationsListAPI + '1' + '/' + event.target.value
    }
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          notificationsList: resObj.data.statusResult.notificationsData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          notificationsList: [], totalCount: 0, matchesData: true
        })
      }
    })
  }
  handlePageChange (pageNumber) {
    this.setState({ activePage: pageNumber })
    let _this = this
    let obj = { url: config.baseUrl + config.getSPNotificationsListAPI + pageNumber + '/' + this.state.searchString }
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ notificationsList: resObj.data.statusResult.notificationsData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false })
      } else {
        _this.setState({ notificationsList: [], totalCount: 0, noLomatchesDatacations: false })
      }
    })
  }
  handleNotificationDelete (data) {
    this.setState({ selectedDeleteData: data, isNotificationView: true })
  }
  handleViewBack () {
    this.setState({ isNotificationView: false })
  }
  handleUserDelete (status, data) {
    if (status) {
      let notificationsList = this.state.notificationsList
      const index = notificationsList.findIndex(dataObj => dataObj._id === data._id)
      notificationsList.splice(index, 1)
      this.setState({ notificationsList: notificationsList, isNotificationView: false })
    } else {
      this.setState({ isNotificationView: false })
    }
  }
  handleRedirect (item) {
    if (item.notificationBody && item.notificationBody.type === 'Booking' && item.notificationBody.recordId) {
      hashHistory.push('/host/bookings-history/view/' + item.notificationBody.recordId)
    } else if (item.notificationBody && item.notificationBody.type === 'Property' && item.notificationBody.recordId) {
      let obj = { url: config.baseUrl + config.getSPPropertyDataAPI + item.notificationBody.recordId }
      APICallManager.getCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          localStorage.setItem('propertyData', JSON.stringify(resObj.data.statusResult))
          hashHistory.push('/host/property-view')
        }
      })
    } else if (item.notificationBody && item.notificationBody.type === 'User Create' && item.notificationBody.recordId) {
      let obj = { url: config.baseUrl + config.getSPUserDataAPI + item.notificationBody.recordId }
      APICallManager.getCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          localStorage.setItem('userData', JSON.stringify(resObj.data.statusResult))
          hashHistory.push('/host/user/view')
        }
      })
    }
  }
  handleHome () {
    hashHistory.push('/host/home')
    event.preventDefault()
  }
  render () {
    return (

      <div className='main-content' id='panel'>
        <DrawerWithHeader />
        {/* ------- Navbar --------- */}
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-8 col-7'>
                  {/* <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitleNotifications`}</h6> */}
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      {/* <li className='breadcrumb-item'><a href='#'>Tables</a></li> */}
                      <li className='breadcrumb-item active' aria-current='page'>{t`lanSPTitleNotifications`}</li>
                      {this.state.isNotificationView ? <li className='breadcrumb-item active' aria-current='page'>Notifications Delete</li> : ''}
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        {!this.state.isNotificationView
        ? <div className='container-fluid mt--6'>
          <div className='row justify-content-center notifictions'>
            <div className='col-md-11 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header'>
                  <div className='row'>
                    <div className='col-sm-8'><h6 className='h2 d-inline-block mb-0'>{t`lanSPTitleNotifications`}</h6> </div>
                    <div className='col-lg-4 text-right'>
                      {/* -- Search form -- */}
                      <form>
                        <div className='form-group mb-0'>
                          <div className='input-group input-group-lg input-group-flush'>
                            <div className='input-group-prepend'>
                              <div className='input-group-text'>
                                <span className='fas fa-search' />
                              </div>
                            </div>
                            <input type='search' className='form-control'value={this.state.searchString} onChange={this.handleInputChange} placeholder={t`lanCommonLabelSearch`} />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className='card-body'>
                  <section className='notifications'>
                    <div className='row clearfix'>
                      {(this.state.notificationsList && this.state.notificationsList.length > 0)
                        ? <div className='col-md-12 col-lg-12 col-xl-12'>
                          {/* List group */}
                          <div className='list-group list-group-flush'>
                            {this.state.notificationsList.map((item, i) =>
                              <div key={i} className='list-group-items'>
                                <a className='list-group-item list-group-item-action' onClick={() => this.handleRedirect(item)}>
                                  <div className='row align-items-center'>
                                    <div className='col-12'>
                                      <div className='d-flex justify-content-between align-items-center row'>
                                        <div className='col-sm-8'>
                                          <h4 className={item.status === 'Unread' ? 'mb-0 text-sm font-weight-bold' : 'mb-0 text-sm'}>{item.notificationTitle} </h4>
                                        </div>
                                        <div className='text-right text-muted col-sm-3'>
                                          <small className='text-muted'>{moment(item.createdOn).format('MMM DD,YY')}</small>
                                        </div>
                                      </div>
                                      <p className={item.status === 'Unread' ? 'text-sm mb-0 p-3 font-weight-bold' : 'text-sm mb-0 p-3'}>{item.notificationMessage}</p>                                    </div>
                                  </div>
                                </a>
                                <div className='right-col'>
                                  <button type='button' onClick={() => this.handleNotificationDelete(item)} className='table-action table-action-delete btn btn-sm'
                                    data-toggle='tooltip' data-placement='top' title={t`lanSPButtonDeleteNotification`} >
                                    <i className='fas fa-trash' />
                                  </button>
                                </div>
                              </div>
                            )}
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
                              <div className='no-data'><p>{t`lanSPLabelNoNotifications`}</p></div>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  </section>
                  {(this.state.notificationsList && this.state.notificationsList.length > 0)
                  ? <div className='card-footer'>
                    <div className='row justify-content-center'>
                      <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={10}
                        // itemsCountPerPage={10}
                        totalItemsCount={this.state.totalCount}
                        pageRangeDisplayed={5}
                        // pageRangeDisplayed={5}
                        onChange={this.handlePageChange}
                    />
                    </div>
                  </div> : null }
                </div>
              </div>
            </div>
          </div>
        </div>
        : <SPNotificationsDeleteComponent selectedDeleteData={this.state.selectedDeleteData} handleViewBack={this.handleViewBack} handleUserDelete={this.handleUserDelete} /> }
        <FooterComponent />
      </div>
    )
  }
}

export default SPNotificationsListComponent
