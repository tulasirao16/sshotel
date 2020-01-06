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
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class CreateBookingPropertiesListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      reload: false,
      propertiesList: [],
      activePage: 1,
      searchString: '',
      matchesData: false
    }
    this.handlePageChangePropertiesList = this.handlePageChangePropertiesList.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePropertyView = this.handlePropertyView.bind(this)
  }
  componentWillMount () {
    let obj = { url: config.baseUrl + config.getSPPropertiesListAPI + this.state.activePage + '/' }
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
    this.setState({ activePage: pageNumber })
    let obj = { url: config.baseUrl + config.getSPPropertiesListAPI + pageNumber + '/' + this.state.searchString }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          propertiesList: resObj.data.statusResult.propertiesList, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          propertiesList: [], totalCount: 0, matchesData: false
        })
      }
    })
  }
  handleInputChange (event) {
    let _this = this
    _this.setState({ searchString: event.target.value, activePage: 1 })
    let obj = {
      url: config.baseUrl + config.getSPPropertiesListAPI + '1' + '/' + event.target.value
    }
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          propertiesList: resObj.data.statusResult.propertiesList, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          propertiesList: [], totalCount: 0, matchesData: true
        })
      }
    })
  }
  handlePropertyView (item) {
    localStorage.setItem('propertyData', JSON.stringify(item))
    hashHistory.push('/host/create-booking/properties-info/list')
  }
  render () {
    return (
      <div>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-12'>
                  {/* <h6 className='h2 text-white d-inline-block mb-0'> {t`lanSPTitlePropertiesList`}</h6> */}
                  <nav aria-label='breadcrumb' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a>Booking History</a></li>
                      <li className='breadcrumb-item'><a>Create Booking</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>Properties List</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>{/* ---------- Header Starts ------------- */}
        <div className='container-fluid mt--6'>
          <div className='card property-list'>
            <div className='card-header'>
              <div className='row'>
                <div className='col-md-8'>
                  <h3 className='mb-0'>{t`lanSPTitlePropertiesList`}</h3>
                </div>
                <div className='col-md-4'>
                  <div className='input-group input-group-lg input-group-flush'>
                    <div className='input-group-prepend'>
                      <div className='input-group-text'>
                        <span className='fas fa-search' />
                      </div>
                    </div>
                    <input className='form-control mr-sm-2' type='text' placeholder={t`lanCommonLabelSearch`} aria-label='Search' value={this.state.searchString} onChange={this.handleInputChange} />
                  </div>
                </div>
              </div>
            </div>
            <div className='card-body'>
              <div className='row mb-2'>
                {this.state.propertiesList && this.state.propertiesList.length > 0 ? this.state.propertiesList.map((item, i) =>
                  <div className='col-md-6' key={i}>
                    <div className='card mb-4'>
                      <a onClick={() => this.handlePropertyView(item)}>
                        <div className='row'>
                          <div className='col-md-4 left_div'>
                            <div className='card-images p-0'>
                              <img src={item.imagePath ? config.baseUrl + item.imagePath : require('../images/room1.jpg')} className='respnsive-img' />
                            </div>
                          </div>
                          <div className='col-md-8 right_div'>
                            <div className='card-body p-3'>
                              <div className='title'>
                                <h3 className='mb-0'>{item.propertyTitle}</h3>
                              </div>
                              <div className='SubTitle mb-1 text-muted'><p>{item.spLocationObj ? item.spLocationObj.area + ', ' + item.spLocationObj.city : ''}</p></div>
                              <ul className='list-group list-group-flush list'>
                                <li className='list-group-item px-0 pb-0'>
                                  <div className='row align-items-center'>
                                    <div className='col-auto mb-2'>
                                      <span className='badge badge-pill badge-secondary'>
                                        <img src={require('../images/check-list-icon.png')} className='icon-img' />
                                        <small>{item.propertyType}</small>
                                      </span>
                                    </div>
                                    <div className='col-auto mb-2'>
                                      <span className='badge badge-pill badge-secondary'>
                                        <img src={require('../images/family-room.png')} className='icon-img' />
                                        <small>{item.propertyCapacity}</small>
                                      </span>
                                    </div>
                                    <div className='col-auto mb-2'>
                                      <span className='badge badge-pill badge-secondary'>
                                        <img src={require('../images/family-room.png')} className='icon-img' />
                                        <small>{item.activeNumRooms ? item.activeNumRooms : 0} {' '} {t`lanSPLabelActiveRooms`} </small>
                                      </span>
                                    </div>
                                    <div className='col-auto mb-2'>
                                      <span className='badge badge-pill badge-secondary'>
                                        <img src={require('../images/family-room.png')} className='icon-img' />
                                        <small>{item.onHoldNumRooms ? item.onHoldNumRooms : 0} {' '} {t`lanSPLabelOnHoldRooms`}</small>
                                      </span>
                                    </div>
                                    <div className='col-auto mb-2'>
                                      <span className='badge badge-pill badge-secondary'>
                                        <img src={require('../images/single-bed.png')} className='icon-img' />
                                        <small>{item.singleBedsCount ? item.singleBedsCount : 0} {' '} {t`lanSPLabelSingleBeds`}</small>
                                      </span>
                                    </div>
                                    <div className='col-auto mb-2'>
                                      <span className='badge badge-pill badge-secondary'>
                                        <img src={require('../images/room.png')} className='icon-img' />
                                        <small>{item.doubleBedsCount ? item.doubleBedsCount : 0} {' '} {t`lanSPLabelDoubleBeds`}</small>
                                      </span>
                                    </div>
                                    <div className='col-auto mb-2'>
                                      <span className='badge badge-pill badge-secondary'>
                                        <img src={require('../images/bathtub.png')} className='icon-img' />
                                        <small>{item.privateBathRooms ? item.privateBathRooms : 0}{' '} {t`lanSPLabelShowerAndBathtub`}</small>
                                      </span>
                                    </div>
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
                          // onChange={(status) => this.handleStatusChange(status, item, i)}
                          checked={item.status === 'Active'}
                          aria-labelledby='neat-label'
                        />
                      </div>
                    </div>
                  </div>
                ) : this.state.matchesData ? <div className='no-data'><p>{t`lanCommonLabelNoMatchesFound`}</p></div> : <div className='no-data'><p>{t`lanSPLabelNoProperties`}</p></div>}
              </div>
            </div>
            {this.state.propertiesList && this.state.propertiesList.length > 0
              ? <div className='card-footer'>
                <div className='text-center'>
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
      </div>
    )
  }
}

export default CreateBookingPropertiesListComponent
