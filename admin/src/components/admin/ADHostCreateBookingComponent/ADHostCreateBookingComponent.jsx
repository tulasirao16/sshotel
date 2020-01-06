/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import Switch from 'react-switch'
import { hashHistory } from 'react-router'
import { t } from 'ttag'

import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import ADCreateHourlyBookingComponent from './ADCreateHourlyBookingComponent'
import ADCreateDaysBookingComponent from './ADCreateDaysBookingComponent'
import '../css/Bookings.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class ADHostCreateBooking extends React.Component {
  constructor () {
    super()
    const propertyInfoData = JSON.parse(localStorage.getItem('propertyInfoViewObj'))
    this.state = {
      propertyData: JSON.parse(localStorage.getItem('propertyData')),
      propertyInfoData: JSON.parse(localStorage.getItem('propertyInfoViewObj')),
      propertyInfoId: propertyInfoData && propertyInfoData._id ? propertyInfoData._id : '',
      amenitiesData: [],
      servicesData: [],
      searchString: '',
      guestRulesData: []
    }
  }
  componentWillMount () {
    let getSpPropertyInfoAmenities = {
      url: config.baseUrl + config.getADHostsPropertyInfoAmenitiesListAPI + this.state.propertyInfoId + '/' + this.state.searchString
    }
    let _this = this
    APICallManager.getCall(getSpPropertyInfoAmenities, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        resObj.data.statusResult.map((data, i) => {
          if (data.amenityStatus === 'Available') {
            _this.state.amenitiesData.push(data)
            _this.setState({ reload: true })
          }
        })
      }
    })
    let getSpPropertyInfoGuestRulesList = {
      url: config.baseUrl + config.getADHostsPropertyInfoRulesListAPI + this.state.propertyInfoId + '/' + this.state.propertyInfoData.propertyId + '/' + this.state.searchString
    }
    APICallManager.getCall(getSpPropertyInfoGuestRulesList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        resObj.data.statusResult.map((data, i) => {
          if (data.ruleStatus === 'Active') {
            _this.state.guestRulesData.push(data)
            _this.setState({ reload: true })
          }
        })
      }
    })
    let getSpPropertyInfoServices = {
      url: config.baseUrl + config.getADHostsPropertyInfoServicesListAPI + this.state.propertyInfoId
    }
    APICallManager.getCall(getSpPropertyInfoServices, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        resObj.data.statusResult.map((data, i) => {
          if (data.serviceStatus === 'Available') {
            _this.state.servicesData.push(data)
          }
        })
        _this.setState({ reload: true })
      }
    })
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-12 col-12'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanCommonButtonCreateBooking`}</h6>
                  <nav aria-label='breadcrumb' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={() => hashHistory.push('admin/home')}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={() => hashHistory.push('admin/hosts')} >{t`lanADTitleHostsHostsList`}</a></li>
                      <li className='breadcrumb-item'><a onClick={() => hashHistory.push('admin/host/properties')}>{t`lanSPTitlePropertiesList`}</a></li>
                      <li className='breadcrumb-item'><a onClick={() => hashHistory.push('admin/host/property/bookings')}>{t`lanCommonTitleBookings`}</a></li>
                      <li className='breadcrumb-item'><a onClick={() => hashHistory.push('admin/host/property/bookings/properties-infolist')}>{t`lanSPTitlePropertiesInfoList`}</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>{t`lanCommonButtonCreateBooking`}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6 '>
          <div className='row justify-content-center booking-view'>
            <div className='col-md-12 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-body'>
                  <div className='accordion' id='accordionExample'>
                    <div className='card'>
                      <div className='card-header' id='headingOne' data-toggle='collapse' data-target='#collapseOne' aria-expanded='true' aria-controls='collapseOne'>
                        <h5 className='mb-0'>{t`lanCommonButtonCreateBooking`}</h5>
                      </div>
                      <div id='collapseOne' className='collapse show' aria-labelledby='headingOne' data-parent='#accordionExample'>
                        <div className='card-body'>
                          {this.state.propertyInfoData.pricing.minBasePriceUnit === '6 Hours' ? <ADCreateHourlyBookingComponent /> : <ADCreateDaysBookingComponent /> }
                        </div>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-header' id='headingTwo' data-toggle='collapse' data-target='#collapseTwo' aria-expanded='false' aria-controls='collapseTwo'>
                        <h5 className='mb-0'>{t`lanSPTitleAmenities`}</h5>
                      </div>
                      <div id='collapseTwo' className='collapse' aria-labelledby='headingTwo' data-parent='#accordionExample'>
                        <div className='card-body'>
                          {/* <h3>{t`lanSPTitleAmenities`}</h3> */}
                          <div className='table-responsive'>
                            <table className='table align-items-center table-flush table-striped'>
                              <thead className='thead-light'>
                                <tr>
                                  <th>{t`lanSPTitleAmenity`}</th>
                                  <th>{t`lanSPLabelAmenityType`}</th>
                                  <th>{t`lanSPLabelPropertyInfoPrice`} (₹)</th>
                                  <th>{t`lanCommonLabelStatus`}</th>
                                </tr>
                              </thead>
                              { this.state.amenitiesData.length > 0
                              ? this.state.amenitiesData.map((data, i) =>
                                <tbody key={i}>
                                  <tr>
                                    <td className='table-user'>
                                      <img src={data.amenityIconPath ? config.baseUrl + data.amenityIconPath : require('../images/amenities/wifi.png')} className='icon-calendar' />
                                      <a className='ml-3'><strong>{data.amenityName}</strong></a>
                                    </td>
                                    <td>
                                      <span className='text-muted'>{data.amenityType}</span>
                                    </td>
                                    <td>
                                      <span className='text-muted'>{data.amenityCharge}</span>
                                    </td>
                                    <td className='table-actions'>
                                      <Switch
                                        className='react-switch'
                                        checked={data.amenityStatus === 'Available'}
                                        aria-labelledby='neat-label'
                                        onChange={() => {}}
                                      />
                                    </td>
                                  </tr>
                                </tbody>) : null
                            }
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-header' id='headingThree' data-toggle='collapse' data-target='#collapseThree' aria-expanded='false' aria-controls='collapseThree'>
                        <h5 className='mb-0'>{t`lanSPTitleGuestRules`}</h5>
                      </div>
                      <div id='collapseThree' className='collapse' aria-labelledby='headingThree' data-parent='#accordionExample'>
                        <div className='card-body'>
                          {/* <h3>{t`lanSPTitleGuestRules`} </h3> */}
                          <div>
                            <div className='table-responsive'>
                              <table className='table align-items-center table-flush table-striped'>
                                <thead className='thead-light'>
                                  <tr>
                                    <th>{t`lanSPTitleGuestRules`} </th>
                                    <th>{t`lanSPTitleGuestRules`} {t`lanCommonLabelName`}</th>
                                    <th>{t`lanCommonLabelStatus`}</th>
                                  </tr>
                                </thead>
                                {this.state.guestRulesData.length > 0
                              ? this.state.guestRulesData.map((data, i) =>
                                <tbody key={i}>
                                  <tr>
                                    <td className='table-user' style={{ width: '20px' }}>
                                      <img src={data.ruleIconPath ? config.baseUrl + data.ruleIconPath : require('../images/guestrules/noalcohol.png')} className='icon-calendar' />
                                    </td>
                                    <td>
                                      <span className='text-muted'>{data.ruleName}</span>
                                    </td>
                                    <td className='table-actions'>
                                      <Switch
                                        className='react-switch'
                                        checked={data.ruleStatus === 'Active'}
                                        aria-labelledby='neat-label'
                                        onChange={() => {}}
                                      />
                                    </td>
                                  </tr>
                                </tbody>) : null
                              }
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-header' id='headingFour' data-toggle='collapse' data-target='#collapseFour' aria-expanded='false' aria-controls='collapseFour'>
                        <h5 className='mb-0'>{t`lanSPTitleServices`}</h5>
                      </div>
                      <div id='collapseFour' className='collapse' aria-labelledby='headingFour' data-parent='#accordionExample'>
                        <div className='card-body'>
                          {/* <h3>{t`lanSPTitleServices`}</h3> */}
                          <div>
                            <div className='table-responsive'>
                              <table className='table align-items-center table-flush table-striped'>
                                <thead className='thead-light'>
                                  <tr>
                                    <th>{t`lanSPTitleServices`}</th>
                                    <th>{t`lanSPLabelServiceType`}</th>
                                    <th>{t`lanSPLabelPropertyInfoPrice`} (₹)</th>
                                    <th>{t`lanCommonLabelStatus`}</th>
                                  </tr>
                                </thead>
                                {this.state.servicesData.length > 0
                                ? this.state.servicesData.map((data, i) =>
                                  <tbody key={i}>
                                    <tr>
                                      <td className='table-user'>
                                        <img src={(data && data.serviceIconPath) ? config.baseUrl + data.serviceIconPath : require('../images/services/car.png')} className='icon-calendar' />
                                        <a className='ml-3'><strong>{data.serviceName}</strong></a>
                                      </td>
                                      <td>
                                        <span className='text-muted'>{data.serviceType}</span>
                                      </td>
                                      <td>
                                        <span className='text-muted'>{data.serviceCharge} </span>
                                      </td>
                                      <td className='table-actions'>
                                        <Switch
                                          className='react-switch'
                                          checked={data.serviceStatus === 'Available'}
                                          aria-labelledby='neat-label'
                                          onChange={() => {}}
                                        />
                                      </td>
                                    </tr>
                                  </tbody>) : null
                              }
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className='row' data-spy='scroll' data-target='.navbar' data-offset='50' style={{ position: 'relative' }}>
                      <div className='col-md-12'>
                        <div style={{ color:'red' }}>{this.state.errorMessage}</div>
                      </div>
                    </div>
                    {/* <button className='btn btn-primary update-edit' disabled={this.state.propertyBlocked} onClick={this.handleCreateBooking}>{t`lanCommonButtonCreateBooking`}</button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ADHostCreateBooking
