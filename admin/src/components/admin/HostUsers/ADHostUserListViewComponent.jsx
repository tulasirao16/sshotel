/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import Switch from 'react-switch'
import { t } from 'ttag'
import 'react-drawer/lib/react-drawer.css'
import moment from 'moment'
import { hashHistory } from 'react-router'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class ADHostUserListViewComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      userInfo: {},
      userStatus: false
    }
    this.handleBack = this.handleBack.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleBack () {
    localStorage.removeItem('userData')
    hashHistory.push('/admin/host-users')
    event.preventDefault()
  }

  componentWillMount () {
    let userInfo = JSON.parse(localStorage.getItem('userData'))
    this.setState({
      userInfo: userInfo
    })
    if (userInfo.userStatus === 'Active') {
      this.setState({
        userStatus: true
      })
    }
  }
  handleChange () {
    // this.setState({ checked })
  }

  render () {
    return (
      <div>
        {/* ---------- Header Ends ------------- */}
        <div className='container-fluid mt--6 mb-4 user-view'>
          <div className='row justify-content-center'>
            <div className='col-lg-12 col-md-12'>
              <div className='card border-0 mb-0'>
                <div className='card-header bg-transparent pb-3'>
                  <h5 className='card-title'>{ t`lanADTooltipLabelHostUserView` }</h5>
                </div>
                <div className='card-body px-lg-4 py-lg-4'>
                  {/* List group */}
                  <ul className='list-group list-group-flush list my--3'>
                    <li className='list-group-item px-0'>
                      <div className='row align-items-center'>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelFirstName` }:</small>
                          <h5 className='mb-0'>{this.state.userInfo.firstName}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelLastName` }:</small>
                          <h5 className='mb-0'>{(this.state.userInfo && this.state.userInfo.lastName) ? this.state.userInfo.lastName : '-'}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelDisplayName` }:</small>
                          <h5 className='mb-0'>{this.state.userInfo.displayName}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelDateOfBirth` }:</small>
                          <h5 className='mb-0'>{(this.state.userInfo && this.state.userInfo.dob) ? moment(this.state.userInfo.dob).format('MMM DD, YY') : '-'}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelMobileNumber` }:</small>
                          <h5 className='mb-0'>{this.state.userInfo.mobileNumber}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelAlternateMobileNumber` }:</small>
                          <h5 className='mb-0'>{(this.state.userInfo && this.state.userInfo.alternateContactNumber) ? this.state.userInfo.alternateContactNumber : '-'}</h5>
                        </div>
                      </div>
                    </li>
                    <li className='list-group-item px-0'>
                      <div className='row align-items-center'>
                        <div className='col-md-3 col-6l'>
                          <small className='view-title'>{ t`lanCommonLabelEmail` }:</small>
                          <h5 className='mb-0'>{this.state.userInfo.email}</h5>
                        </div>
                        <div className='col-md-3 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelAlternateEmail` }:</small>
                          <h5 className='mb-0'>{(this.state.userInfo && this.state.userInfo.alternateEmail) ? this.state.userInfo.alternateEmail : '-'}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelUserID` }:</small>
                          <h5 className='mb-0'>{this.state.userInfo.userAccount}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelUserRole` }:</small>
                          <h5 className='mb-0'>{this.state.userInfo.userRole}</h5>
                        </div>
                      </div>
                    </li>
                    <li className='list-group-item px-0'>
                      <div className='row align-items-center'>
                        <div className='col-md-3 col-6'>
                          <small className='view-title'>{ t`lanSPLabelBusinessName` }:</small>
                          <h5 className='mb-0'>{this.state.userInfo.spServiceProvider}</h5>
                        </div>
                        <div className='col-md-3 col-6'>
                          <small className='view-title'>{ t`lanCommonLabelStatus` }:</small>
                          <h5 className='mb-0'>
                            <Switch
                              className='react-switch'
                              onChange={this.handleChange}
                              checked={this.state.userStatus}
                              aria-labelledby='neat-label'
                              disabled
                              />
                          </h5>
                        </div>
                      </div>
                    </li>
                    <li className='list-group-item px-0'>
                      <div className='col mt-3'>
                        <button className='btn btn-primary' type='button' data-toggle='collapse' data-target='#collapseExample' aria-expanded='false' aria-controls='collapseExample'>
                          { t`lanCommonButtonViewAddressDetails` }
                        </button>
                        <div className='collapse' id='collapseExample'>
                          <div className='card card-body'>
                            <ul className='list-group list-group-flush list my--3'>
                              <li className='list-group-item px-0'>
                                <div className='row align-items-center'>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{ t`lanCommonLabelArea` }:</small>
                                    <h5 className='mb-0'>{(this.state.userInfo && this.state.userInfo.area) ? this.state.userInfo.area : '-'}</h5>
                                  </div>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{ t`lanCommonLabelLandmark` }:</small>
                                    <h5 className='mb-0'>{(this.state.userInfo && this.state.userInfo.landMark) ? this.state.userInfo.landMark : '-'}</h5>
                                  </div>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{ t`lanCommonLabelCity` }:</small>
                                    <h5 className='mb-0'>{(this.state.userInfo && this.state.userInfo.city) ? this.state.userInfo.city : '-'}</h5>
                                  </div>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{ t`lanCommonLabelZip` }:</small>
                                    <h5 className='mb-0'>{(this.state.userInfo && this.state.userInfo.zip) ? this.state.userInfo.zip : '-'}</h5>
                                  </div>
                                </div>
                              </li>
                              <li className='list-group-item px-0'>
                                <div className='row align-items-center'>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{ t`lanCommonLabelState` }:</small>
                                    <h5 className='mb-0'>{(this.state.userInfo && this.state.userInfo.state) ? this.state.userInfo.state : '-'}</h5>
                                  </div>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{ t`lanCommonLabelCountry` }:</small>
                                    <h5 className='mb-0'>{(this.state.userInfo && this.state.userInfo.country) ? this.state.userInfo.country : '-'}</h5>
                                  </div>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{ t`lanCommonLabelAddress` }:</small>
                                    <h5 className='mb-0'>{(this.state.userInfo && this.state.userInfo.address) ? this.state.userInfo.address : '-'}</h5>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className='px-lg-4 py-lg-4 text-center'>
                  <button className='btn btn-danger' onClick={this.handleBack}>{t`lanCommonButtonBack`}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ADHostUserListViewComponent
