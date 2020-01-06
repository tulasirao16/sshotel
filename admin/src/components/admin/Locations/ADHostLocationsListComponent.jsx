/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import Pagination from 'react-js-pagination'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import { t } from 'ttag'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import './css/location.css'

class ADHostLocationsListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      hostData: JSON.parse(localStorage.getItem('hostData')),
      locationsList: [],
      totalCount: 0,
      searchString: '',
      activePage: 1,
      noLocations: false,
      spServiceProvider: '',
      ownerName: '',
      isShowArea: true,
      isShowCity: true,
      isShowState: true,
      areaChecked: 'checked',
      cityChecked: 'checked',
      stateChecked: 'checked',
      pincodeChecked: 'checked',
      latitudeChecked: 'checked',
      longitudeChecked: 'checked',
      contactpersonChecked: 'checked',
      mobileNumberChecked: 'checked',
      statusChecked: 'checked',
      actionsChecked: 'checked'
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleViewLocation = this.handleViewLocation.bind(this)
    this.handleEditLocation = this.handleEditLocation.bind(this)
    this.handleLocationStatus = this.handleLocationStatus.bind(this)
  }

  componentWillMount () {
    this.setState({ latitudeChecked:this.state.latitudeChecked === 'unchecked' })
    this.setState({ longitudeChecked:this.state.longitudeChecked === 'unchecked' })
    let hostData = this.state.hostData
    if (hostData && hostData._id) {
      this.setState({
        hostData: hostData,
        ownerName: hostData.contactPerson,
        spServiceProvider: hostData.serviceProvider
      })
      let getServiceLocations = {
        url: config.baseUrl + config.getADHostlocationListAPI + hostData._id + '/' + this.state.activePage
      }
      let _this = this
      APICallManager.getCall(getServiceLocations, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({
            locationsList: resObj.data.statusResult.locationsList,
            totalCount: resObj.data.statusResult.totalDocs,
            noLocations: false
          })
        } else {
          _this.setState({
            locationsList: [],
            totalCount: 0,
            noLocations: false
          })
        }
      })
    }
  }

  handleInputChange (event) {
    let _this = this
    _this.setState({ activePage: 1 })
    let searchValue = this.state.searchString
    let getSearchLocationObj = {
      url: config.baseUrl + config.getADHostlocationListAPI + this.state.hostData._id + '/' + 1 + '/' + searchValue
    }
    APICallManager.getCall(getSearchLocationObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          locationsList: resObj.data.statusResult.locationsList, totalCount: resObj.data.statusResult.totalDocs, noLocations: false
        })
      } else {
        _this.setState({
          locationsList: [], totalCount: 0, noLocations: true
        })
      }
    })
  }
  handlePageChange (pageNumber) {
    if (this.state.activePage !== pageNumber) {
      this.setState({ activePage: pageNumber })
      let _this = this
      let obj = { url: config.baseUrl + config.getADHostlocationListAPI + this.state.hostData._id + '/' + pageNumber + '/' + this.state.searchString }
      APICallManager.getCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ locationsList: resObj.data.statusResult.locationsList, totalCount: resObj.data.statusResult.totalDocs, noLocations: false })
        } else {
          _this.setState({ locationsList: [], totalCount: 0, noLocations: false })
        }
      })
    }
  }
  handleViewLocation (locationsList) {
    let locationList = locationsList
    localStorage.setItem('locationList', JSON.stringify(locationList))
    hashHistory.push('admin/host/location-view')
    event.preventDefault()
  }

  handleEditLocation (locationsList) {
    let locationList = locationsList
    localStorage.setItem('locationList', JSON.stringify(locationList))
    hashHistory.push('admin/host/location-edit')
    event.preventDefault()
  }
  handleLocationStatus (locationObj) {
    let _this = this
    let putServiceLocationData = {
      status : locationObj.locationStatus === 'Active' ? 'Inactive' : 'Active'
    }
    let obj = { url: config.baseUrl + config.putADHostlocationUpdateStatusAPI + locationObj._id, body: putServiceLocationData }
    let locations = this.state.locationsList
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        const i = locations.indexOf(locationObj)
        locations[i].locationStatus = resObj.data.statusResult.locationStatus
        _this.setState({
          locationsList: locations
        })
      } else {
        ToastsStore.error('Location Status Update Failed')
      }
    })
    event.preventDefault()
  }
  handleEnter (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }

  render () {
    return (
      <div className='admin-locations'>
        {/* ---------- Header Ends ------------- */}
        <div className='container-fluid mt--6 mb-4'>
          <div className='row justify-content-center'>
            <div className='col-lg-12 col-md-12'>
              <div className='card border-0 mb-0'>
                <div className='sp-hotels'>
                  <div className='card mb-0'>
                    {/* Card body */}
                    <div className='card-body p-2'>
                      <div className='row align-items-center'>
                        <div className='col-auto'>
                          {/* Avatar */}
                          {/* <a className='rounded-circle'>
                            <img src={require('../images/room1.jpg')} className='avatar rounded-circle' />
                          </a> */}
                        </div>
                        <div className='col ml--2'>
                          <h4 className='card-title mb-0 '>
                            {this.state.spServiceProvider}
                          </h4>
                          <b className='text-sm mb-0 text-white'>{this.state.ownerName}</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card-header mb-0'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <h5 className='card-title pt-1'>{ t`lanSPTitleLocationsList` }</h5>
                    </div>
                    <div className='col-md-6 text-right'>
                      <div className='row'>
                        <div className='col-md-2'>
                          <div className='button-group'>
                            <button type='button' className='btn btn-success dropdown-toggle' data-toggle='dropdown'><i className='fas fa-list' /></button>
                            <ul className='dropdown-menu'>
                              <li><a id='area'><input type='checkbox' onChange={() => this.setState({ areaChecked: this.state.areaChecked === 'checked' ? ''
                               : 'checked' })} checked={this.state.areaChecked} />Area</a></li>
                              <li><a id='city'><input type='checkbox' onChange={() => this.setState({ cityChecked: this.state.cityChecked === 'checked' ? ''
                               : 'checked' })} checked={this.state.cityChecked} />City</a></li>
                              <li><a id='state'><input type='checkbox' onChange={() => this.setState({ stateChecked: this.state.stateChecked === 'checked' ? ''
                               : 'checked' })} checked={this.state.stateChecked} />State</a></li>
                              <li><a id='pincode'><input type='checkbox' onChange={() => this.setState({ pincodeChecked: this.state.pincodeChecked === 'checked' ? ''
                               : 'checked' })} checked={this.state.pincodeChecked} />Pin Code</a></li>
                              <li><a id='latitude'><input type='checkbox' onChange={() => this.setState({ latitudeChecked: this.state.latitudeChecked === 'checked' ? ''
                               : 'checked' })} checked={this.state.latitudeChecked} />Latitude</a></li>
                              <li><a id='longitude'><input type='checkbox' onChange={() => this.setState({ longitudeChecked: this.state.longitudeChecked === 'checked' ? ''
                               : 'checked' })} checked={this.state.longitudeChecked} />Longitude</a></li>
                              <li><a id='contactperson'><input type='checkbox' onChange={() => this.setState({ contactpersonChecked: this.state.contactpersonChecked === 'checked' ? ''
                               : 'checked' })} checked={this.state.contactpersonChecked} />Contact Person</a></li>
                              <li><a id='mobile'><input type='checkbox' onChange={() => this.setState({ mobileNumberChecked: this.state.mobileNumberChecked === 'checked' ? ''
                               : 'checked' })} checked={this.state.mobileNumberChecked} />Mobile #</a></li>
                              <li><a id='status'><input type='checkbox' onChange={() => this.setState({ statusChecked: this.state.statusChecked === 'checked' ? ''
                               : 'checked' })} checked={this.state.statusChecked} />Status</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className='col-md-8 pr-0'>
                          {/* -- Search form -- */}
                          <form>
                            <div className='form-group mb-0'>
                              <div className='input-group input-group-lg input-group-flush'>
                                <div className='input-group-prepend'>
                                  <div className='input-group-text'>
                                    <span className='fas fa-search' />
                                  </div>
                                </div>
                                <input type='search' className='form-control' value={this.state.searchString}
                                  onChange={(e) => { this.setState({ searchString: e.target.value }) }} placeholder={t`lanCommonLabelSearch`} onKeyPress={this.handleEnter} />
                              </div>
                            </div>
                          </form>
                        </div>
                        <div className='col-sm-2 pl-0'>
                          <button className='btn btn-icon btn-primary search-btn-admin px-3 py-2' type='button' onClick={this.handleInputChange}>
                            <span className='btn-inner--icon'><i className='fa fa-search' /></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card-body Locations'>
                  <div>
                    {this.state.locationsList.length > 0
                    ? <div className='table-responsive'>
                      <table className='table align-items-center table-flush table-striped'>
                        <thead className='thead-light'>
                          <tr>
                            {this.state.areaChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelArea` }</th> : null }
                            {this.state.cityChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelCity` }</th> : null}
                            {this.state.stateChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelState` }</th> : null }
                            {this.state.pincodeChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelZip` }</th> : null }
                            {this.state.latitudeChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelLatitude` }</th> : null }
                            {this.state.longitudeChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelLongitude` }</th> : null }
                            {this.state.contactpersonChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelContactPerson` }</th> : null }
                            {this.state.mobileNumberChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelMobileNumber`}</th> : null }
                            {this.state.statusChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelStatus` }</th> : null }
                            <th className='sort' data-sort='name'>{ t`lanCommonLabelActions` }</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.locationsList.map((locationList, i) =>
                            <tr role='row' className='odd' key={i}>
                              {this.state.areaChecked ? <td className='sorting_1'>{locationList.area}</td> : null }
                              {this.state.cityChecked === 'checked' ? <td>{locationList.city}</td> : null }
                              {this.state.stateChecked ? <td>{locationList.state}</td> : null }
                              {this.state.pincodeChecked ? <td>{locationList.zip}</td> : null }
                              {this.state.latitudeChecked ? <td>{locationList.latitude}</td> : null }
                              {this.state.longitudeChecked ? <td>{locationList.longitude}</td> : null }
                              {this.state.contactpersonChecked ? <td>{locationList.contactPerson}</td> : null }
                              {this.state.mobileNumberChecked ? <td>{locationList.mobileNumber}</td> : null }
                              {this.state.statusChecked ? <td>{locationList.locationStatus}</td> : null }
                              <td>
                                <a onClick={() => this.handleViewLocation(locationList)} className='table-action table-action-view' data-toggle='tooltip' title={t`lanSPButtonTooltipLocationView`}>
                                  <i className='far fa-eye' />
                                </a>
                                <a onClick={() => this.handleEditLocation(locationList)} className='table-action table-action-edit' data-toggle='tooltip' title={t`lanSPButtonTooltipLocationEdit`}>
                                  <i className='fas fa-user-edit' />
                                </a>
                                {/* <a className='table-action table-action-delete' data-toggle='tooltip' data-original-title='Delete product'>
                                  <i className='fas fa-trash' />
                                </a> */}
                                <button className='btn-sm success' style={locationList.locationStatus === 'Active' ? { background:'#ef543b' } : { background:'#4da424' }}
                                  onClick={() => this.handleLocationStatus(locationList)} >{locationList.locationStatus === 'Active' ? 'Inactivate' : 'Activate'}</button>
                              </td>
                            </tr>
                        )}
                        </tbody>
                      </table>
                    </div>
                    : this.state.noLocations
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
                          <div className='no-data'><p>{t`lanSPLabelNoLocationsAvailable`}</p></div>
                        </div>
                      </div>
                    </div>
                    }
                    <div className='row justify-content-center'>
                      <div className='col-sm-12'>
                        {this.state.locationsList.length > 0
                        ? <div className='card-footer'>
                          <div className='row justify-content-center'>
                            <Pagination
                              activePage={this.state.activePage}
                              itemsCountPerPage={10}
                              totalItemsCount={this.state.totalCount}
                              pageRangeDisplayed={5}
                              onChange={this.handlePageChange}
                          />
                          </div>
                        </div> : null }
                      </div>
                    </div>
                  </div>
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
export default ADHostLocationsListComponent

