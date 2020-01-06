/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import Switch from 'react-switch'
import Pagination from 'react-js-pagination'
import 'react-drawer/lib/react-drawer.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import ADHostsPropertiesData from './ADHostsPropertiesData'

class ADHostsPropertiesComponent extends React.Component {
  constructor () {
    super()
    let propertyStatus = localStorage.getItem('propertyStatus')
    this.state = {
      reload: false,
      propertiesList: [],
      activePage: 1,
      searchString: '',
      matchesData: false,
      propertiesData: {},
      view: localStorage.getItem('PropertiesShow'),
      hostData : JSON.parse(localStorage.getItem('hostData')),
      propertyStatus: propertyStatus ? propertyStatus : '',
      propertiesBy: localStorage.getItem('propertiesBy')
    }
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.handlePageChangePropertiesList = this.handlePageChangePropertiesList.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePropertyView = this.handlePropertyView.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleHostList = this.handleHostList.bind(this)
    this.handleBooking = this.handleBooking.bind(this)
    // this.handleAnalytics = this.handleAnalytics.bind(this)
    this.handlePropertiesList = this.handlePropertiesList.bind(this)
    this.handleDashboardPropertiesList = this.handleDashboardPropertiesList.bind(this)
    this.handleDashboardPageChangePropertiesList = this.handleDashboardPageChangePropertiesList.bind(this)
    this.handleDashboardInputChangePropertiesList = this.handleDashboardInputChangePropertiesList.bind(this)
  }
  componentWillMount () {
    let PropertiesShowfromBD = localStorage.getItem('PropertiesShowfromBD')
    // this.setState({ view : 'List' })
    if (this.state.propertyStatus) {
      this.setState({ view : 'List' })
      let obj = { url: config.baseUrl + config.getADHostPropertiesListBystatusAPI + this.state.activePage + '/' + this.state.propertyStatus + '/' + this.state.searchString }
      this.handleDashboardPropertiesList(obj)
    } else if (this.state.propertiesBy === 'Dashboard') {
      if (PropertiesShowfromBD === 'View') {
        this.setState({ view : 'View' })
        let obj = { url: config.baseUrl + config.getADHostPropertiesListAPI + '/' + this.state.activePage + '/' + 'null' + '/' + this.state.searchString }
        this.handleDashboardPropertiesList(obj)
        localStorage.removeItem('PropertiesShowfromBD')
      } else {
        this.setState({ view : 'List' })
        let obj = { url: config.baseUrl + config.getADHostPropertiesListAPI + '/' + this.state.activePage + '/' + 'null' + '/' + this.state.searchString }
        this.handleDashboardPropertiesList(obj)
      }
    } else {
      this.state.hostData._id = this.state.hostData.spServiceProviderId ? this.state.hostData.spServiceProviderId : this.state.hostData._id
      let obj = { url: config.baseUrl + config.getADHostPropertiesListAPI + '/' + this.state.activePage + '/' + this.state.hostData._id + '/' + this.state.searchString }
      this.handleDashboardPropertiesList(obj)
    }
  }
  handleDashboardPropertiesList (obj) {
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          propertiesList: resObj.data.statusResult.propertiesList, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          propertiesList: [], matchesData: false
        })
      }
    })
  }
  handlePageChangePropertiesList (pageNumber) {
    if (this.state.activePage !== pageNumber) {
      this.setState({ activePage: pageNumber })
      this.setState({ view : 'List' })
      if (this.state.propertyStatus) {
        let obj = { url: config.baseUrl + config.getADHostPropertiesListBystatusAPI + pageNumber + '/' + this.state.propertyStatus + '/' + this.state.searchString }
        this.handleDashboardPropertiesList(obj)
      } else if (this.state.propertiesBy === 'Dashboard') {
        let obj = { url: config.baseUrl + config.getADHostPropertiesListAPI + '/' + pageNumber + '/' + 'null' + '/' + this.state.searchString }
        this.handleDashboardPropertiesList(obj)
      } else {
        this.state.hostData._id = this.state.hostData.spServiceProviderId ? this.state.hostData.spServiceProviderId : this.state.hostData._id
        let obj = { url: config.baseUrl + config.getADHostPropertiesListAPI + '/' + pageNumber + '/' + this.state.hostData._id + '/' + this.state.searchString }
        this.handleDashboardPropertiesList(obj)
      }
    }
  }
  handleDashboardPageChangePropertiesList (obj) {
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          propertiesList: resObj.data.statusResult.propertiesList, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          propertiesList: [], matchesData: false
        })
      }
    })
  }
  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleInputChange () {
    this.setState({ activePage: 1 })
    this.setState({ view : 'List' })
    if (this.state.propertyStatus) {
      let obj = { url: config.baseUrl + config.getADHostPropertiesListBystatusAPI + '1' + '/' + this.state.propertyStatus + '/' + this.state.searchString }
      this.handleDashboardPropertiesList(obj)
    } else if (this.state.propertiesBy === 'Dashboard') {
      // this.setState({ hostData : 'all' })
      let obj = { url: config.baseUrl + config.getADHostPropertiesListAPI + '/' + '1' + '/' + 'null' + '/' + this.state.searchString }
      this.handleDashboardPropertiesList(obj)
    } else {
      this.state.hostData._id = this.state.hostData.spServiceProviderId ? this.state.hostData.spServiceProviderId : this.state.hostData._id
      let obj = { url: config.baseUrl + config.getADHostPropertiesListAPI + '/' + '1' + '/' + this.state.hostData._id + '/' + this.state.searchString }
      this.handleDashboardPropertiesList(obj)
    }
    event.preventDefault()
  }
  handleDashboardInputChangePropertiesList (obj) {
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          propertiesList: resObj.data.statusResult.propertiesList, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          propertiesList: [], matchesData: false
        })
      }
    })
  }
  handlePropertyView (item) {
    let _this = this
    localStorage.setItem('propertyData', JSON.stringify(item))
    _this.setState({ view: 'View' })
    _this.setState({ propertiesData: item })
  }
  handleStatusChange (status, item, i) {
    let statusChange = status === false ? 'Inactive' : 'Active'
    let obj = { url: config.baseUrl + config.putADHostsPropertyStatusChangeAPI + item._id + '/' + statusChange }
    this.setState({ reload: false })
    let _this = this
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.state.propertiesList[i].status = resObj.data.statusResult.status
        _this.setState({ reload: true })
      } else if (resObj.data.statusCode === '1016') {
        ToastsStore.error(t`lanSPLabelErrorPropertyInactive`)
      } else {
        ToastsStore.error(t`lanCommonLabelProperty` + statusChange + ' ' + t`lanSPLabelErrorFailed`)
        _this.setState({ reload: true })
      }
    })
  }
  handlePropertyCreate = () => {
    localStorage.setItem('PricingData', JSON.stringify({}))
    hashHistory.push('/admin/host/property/create')
  }
  handleHostList () {
    localStorage.removeItem('propertyStatus')
    localStorage.removeItem('propertiesBy')
    hashHistory.push('/admin/hosts')
  }
  handlePropertiesList () {
    localStorage.removeItem('propertyStatus')
    this.setState({ view: 'List' })
    // hashHistory.push('/admin/host/properties')
  }
  handleBooking (item) {
    localStorage.setItem('propertyData', JSON.stringify(item))
    hashHistory.push('/admin/host/property/bookings')
  }

  // handleAnalytics (item) {
    // hashHistory.push('/admin/hosts/property/analytics')
  // }
  componentWillUnmount () {
    localStorage.removeItem('Dashboard')
    localStorage.removeItem('propertyStatus')
  }

  render () {
    return (
      <div>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  { this.state.propertiesBy === 'Dashboard' || this.state.propertyStatus || this.state.view === 'View'
                        ? ''
                        : <h6 className='h2 text-white d-inline-block mb-0'> {t`lanADTitleHostsPropertiesList`}</h6>
                      }
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      { this.state.propertiesBy === 'Dashboard' || this.state.propertyStatus
                        ? this.state.view === 'List'
                        ? <li className='breadcrumb-item active' aria-current='page'>{t`lanSPTitlePropertiesList`}</li>
                        : <li className='breadcrumb-item active' aria-current='page'><a onClick={this.handlePropertiesList} >{t`lanSPTitlePropertiesList`}</a></li>
                        : this.state.view === 'List'
                        ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                          <li className='breadcrumb-item active' aria-current='page' />
                          <li className='breadcrumb-item active' aria-current='page'> <a onClick={this.handleHostList} > {t`lanADTitleHostsHostsList`}</a></li>
                          <li className='breadcrumb-item active' >{t`lanSPTitlePropertiesList`}</li>
                        </ol>
                        : <li className='breadcrumb-item active' aria-current='page'><a onClick={this.handlePropertiesList} >{t`lanSPTitlePropertiesList`}</a></li>
                      }
                      {
                        this.state.view === 'List'
                        ? ''
                        : <li className='breadcrumb-item active' >{t`lanSPTitlePropertyView`}</li>
                      }
                    </ol>
                  </nav>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  {this.state.propertiesBy === 'Dashboard' || this.state.propertyStatus || this.state.view === 'View'
                  ? ''
                  : <a onClick={this.handlePropertyCreate} className='btn btn-success text-white'><i className='fas fa-plus' /> {t`lanSPButtonCreateProperty`}</a>
                }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {
          this.state.view === 'List'
            ? <div className='container-fluid mt--6'>
              <div className='card property-list'>
                <div className='card-header'>
                  <div className='row'>
                    <div className='col-md-7'>
                      <h5 className='mb-0 card-title'>{this.state.hostData ? this.state.hostData.serviceProvider + ':'
                        : (this.state.propertiesBy === 'Dashboard' ? this.state.propertiesBy + ':' : '') } {t`lanSPTitlePropertiesList`}</h5>
                    </div>
                    <div className='col-md-4 pr-0'>
                      <div className='input-group input-group-lg input-group-flush'>
                        <div className='input-group-prepend'>
                          <div className='input-group-text'>
                            <span className='fas fa-search' />
                          </div>
                        </div>
                        <input className='form-control' type='search' placeholder={t`lanCommonLabelSearch`} aria-label='Search' value={this.state.searchString}
                          onChange={(e) => { this.setState({ searchString: e.target.value }) }} />
                      </div>
                    </div>
                    <div className='col-md-1 pl-0'>
                      <button className='btn btn-icon btn-primary search-btn-admin px-3 py-2' type='button' onClick={this.handleInputChange}>
                        <span className='btn-inner--icon'><i className='fa fa-search' /></span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className='card-body'>
                  <div className='row mb-2'>
                    {this.state.propertiesList && this.state.propertiesList.length > 0 ? this.state.propertiesList.map((item, i) =>
                      <div className='col-md-6' key={i}>
                        <div className='card mb-4'>
                          <a >
                            <div className='row'>
                              <div className='col-md-4 left_div'>
                                <div className='card-images p-0' onClick={() => this.handlePropertyView(item)}>
                                  <img src={item.imagePath ? config.baseUrl + item.imagePath : require('../images/room1.jpg')} className='respnsive-img' />
                                </div>
                              </div>
                              <div className='col-md-8 right_div'>
                                <div className='card-body p-3'>
                                  <div className='title' onClick={() => this.handlePropertyView(item)}>
                                    <h3 className='mb-0'>{item.propertyTitle}</h3>
                                  </div>
                                  <div className='SubTitle mb-1 text-muted' onClick={() => this.handlePropertyView(item)}><p>{item.spLocationObj ? item.spLocationObj.area + ', ' + item.spLocationObj.city : ''}</p></div>
                                  <ul className='list-group list-group-flush list'>
                                    <li className='list-group-item px-0 pb-0'>
                                      <div className='row align-items-center'>
                                        <div className='col-auto mb-2'>
                                          <span className='badge badge-pill badge-secondary'>
                                            <img src={require('../images/check-list-icon.png')} className='icon-img' />
                                            {item.propertyType}
                                          </span>
                                        </div>
                                        <div className='col-auto mb-2'>
                                          <span className='badge badge-pill badge-secondary'>
                                            <img src={require('../images/family-room.png')} className='icon-img' />
                                            {item.propertyCapacity}
                                          </span>
                                        </div>
                                        <div className='col-auto mb-2'>
                                          <span className='badge badge-pill badge-secondary'>
                                            <img src={require('../images/family-room.png')} className='icon-img' />
                                            {item.activeNumRooms ? item.activeNumRooms : 0} {' '} {t`lanSPLabelActiveRooms`}
                                          </span>
                                        </div>
                                        <div className='col-auto mb-2'>
                                          <span className='badge badge-pill badge-secondary'>
                                            <img src={require('../images/family-room.png')} className='icon-img' />
                                            {item.onHoldNumRooms ? item.onHoldNumRooms : 0} {' '} {t`lanSPLabelOnHoldRooms`}
                                          </span>
                                        </div>
                                        <div className='col-auto mb-2'>
                                          <span className='badge badge-pill badge-secondary'>
                                            <img src={require('../images/single-bed.png')} className='icon-img' />
                                            {item.singleBedsCount ? item.singleBedsCount : 0} {' '} {t`lanSPLabelSingleBeds`}
                                          </span>
                                        </div>
                                        <div className='col-auto mb-2'>
                                          <span className='badge badge-pill badge-secondary'>
                                            <img src={require('../images/room.png')} className='icon-img' />
                                            {item.doubleBedsCount ? item.doubleBedsCount : 0} {' '} {t`lanSPLabelDoubleBeds`}
                                          </span>
                                        </div>
                                        <div className='col-auto mb-2'>
                                          <span className='badge badge-pill badge-secondary'>
                                            <img src={require('../images/bathtub.png')} className='icon-img' />
                                            {item.privateBathRooms ? item.privateBathRooms : 0}{' '} {t`lanSPLabelShowerAndBathtub`}
                                          </span>
                                        </div>
                                        <div className='pl-4 pr-2'>
                                          <button className='btn btn-icon btn-primary' onClick={() => this.handleBooking(item)}>
                                            { t`lanCommonTitleBookings` }</button>
                                        </div>
                                        {/* <div>
                                          <button className='btn btn-icon btn-primary' type='button' onClick={() => { this.handleAnalytics(item) }}>
                                            {t`lanADCommonButtonAnalytics`}</button>
                                        </div> */}
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </a>
                          <div className='CardFooter'>
                            <Switch
                              className='react-switch'
                              onChange={(status) => this.handleStatusChange(status, item, i)}
                              checked={item.status === 'Active'}
                              aria-labelledby='neat-label'
                            />
                          </div>
                        </div>
                      </div>
                    ) : this.state.matchesData
                    ? <div className='container'>
                      <div className='row'>
                        <div className='col-sm-12'>
                          <div className='no-data'><p>{t`lanCommonLabelNoMatchesFound`}</p></div>
                        </div>
                      </div>
                    </div>
                    : <div className='container'>
                      <div className='row'>
                        <div className='col-sm-12'>
                          <div className='no-data'><p>{t`lanSPLabelNoProperties`}</p></div>
                        </div>
                      </div>
                    </div>
                    }
                  </div>
                </div>
                {this.state.propertiesList && this.state.propertiesList.length > 0
                  ? <div className='card-footer'>
                    <div className='row justify-content-center'>
                      <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={20}
                        totalItemsCount={this.state.totalCount}
                        pageRangeDisplayed={5}
                        onChange={this.handlePageChangePropertiesList}
                      />
                    </div>
                  </div> : null}
              </div>
            </div>
        // : <ADHostsPropertiesData propertyData={this.state.propertiesData} />
        : <ADHostsPropertiesData handleBack={this.handlePropertiesList} />
         }
        </div>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}

export default ADHostsPropertiesComponent
