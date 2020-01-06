/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import { t } from 'ttag'
import { hashHistory } from 'react-router'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPLocationViewComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      authObj: JSON.parse(localStorage.getItem('authObj')),
      locationsList: [],
      area: '',
      Landmark: '',
      city: '',
      state: '',
      country: '',
      address: '',
      zip: '',
      latitude: '',
      longitude: '',
      mobileNumber: '',
      spServiceProvider: '',
      contactPerson: '',
      locationStatus: ''
    }
    this.handleBack = this.handleBack.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }

  componentWillMount () {
    let locationList = JSON.parse(localStorage.getItem('locationList'))
    this.setState({
      area: locationList.area,
      landmark: locationList.landmark,
      zip: locationList.zip,
      city: locationList.city,
      state: locationList.state,
      country: locationList.country,
      address: locationList.address,
      latitude: locationList.latitude,
      longitude: locationList.longitude,
      spServiceProvider: locationList.spServiceProvider,
      contactPerson: locationList.contactPerson,
      locationStatus: locationList.locationStatus,
      mobileNumber: locationList.mobileNumber,
      email: locationList.email,
      alternateMobileNumber: locationList.alternateMobileNumber
    })
  }

  handleBack () {
    hashHistory.push('/host/locations')
  }
  handleHome () {
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
                <div className='col-md-6 col-12'>
                  <nav aria-label='breadcrumb' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a>{ t`lanSPTitleServiceLocations` }</a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleBack}>{ t`lanSPTitleLocationsList` }</a></li>
                      <li className='breadcrumb-item'><a>{ t`lanSPTitleServiceLocationView` }</a></li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>{/* ---------- Header Ends ------------- */}
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
                          {/* <a href='#' className='rounded-circle'>
                            <img src={require('../images/room1.jpg')} className='avatar rounded-circle' />
                          </a> */}
                        </div>
                        <div className='col ml--2'>
                          <h4 className='card-title mb-0'>
                            {this.state.spServiceProvider}
                          </h4>
                          <b className='text-sm mb-0 text-white'>{this.state.contactPerson}</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card-header bg-transparent pb-3'>
                  <h5 className='card-title'>{ t`lanSPTitleServiceLocationView` }</h5>
                </div>
                <div className='card-body px-lg-4 py-lg-4 locations-view'>
                  {/* List group */}
                  <ul className='list-group list-group-flush list my--3'>
                    <li className='list-group-item px-0'>
                      <div className='row align-items-center'>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelArea` }:</small>
                          <h5 className='mb-0'>{this.state.area}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelLandmark` }:</small>
                          <h5 className='mb-0'>{this.state.landmark}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelCity` }:</small>
                          <h5 className='mb-0'>{this.state.city}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelState` }:</small>
                          <h5 className='mb-0'>{this.state.state}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelCountry` }:</small>
                          <h5 className='mb-0'>{this.state.country}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelZip` }:</small>
                          <h5 className='mb-0'>{this.state.zip}</h5>
                        </div>
                      </div>
                    </li>
                    <li className='list-group-item px-0'>
                      <div className='row align-items-center'>
                        <div className='col-md-3 col-auto'>
                          <small className='view-title'>{ t`lanCommonLabelAddress` }:</small>
                          <h5 className='mb-0'>{this.state.address}</h5>
                        </div>
                        <div className='col-md-3 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelLatitude` }:</small>
                          <h5 className='mb-0'>{this.state.latitude}</h5>
                        </div>
                        <div className='col-md-3 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelLongitude` }:</small>
                          <h5 className='mb-0'>{this.state.longitude}</h5>
                        </div>
                        <div className='col-md-3 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelStatus` }:</small>
                          <h5 className='mb-0'>{this.state.locationStatus}</h5>
                        </div>
                      </div>
                    </li>
                    <li className='list-group-item px-0'>
                      <div className='row align-items-center'>
                        <div className='col-md-3 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelContactPerson` }:</small>
                          <h5 className='mb-0'>{this.state.contactPerson}</h5>
                        </div>
                        <div className='col-md-3 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelEmail` }:</small>
                          <h5 className='mb-0'>{this.state.email}</h5>
                        </div>
                        <div className='col-md-3 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelMobileNumber` }:</small>
                          <h5 className='mb-0'>{this.state.mobileNumber}</h5>
                        </div>
                        <div className='col-md-3 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelAlternateMobileNumber` }:</small>
                          <h5 className='mb-0'>{this.state.alternateMobileNumber}</h5>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className='row'>
                  <div className='col-sm-12 text-center my-4'>
                    <button className='btn btn-primary' type='button' onClick={this.handleBack}>{ t`lanCommonButtonDone` }</button>
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

export default SPLocationViewComponent
