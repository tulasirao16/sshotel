/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import { hashHistory } from 'react-router'
import moment from 'moment'
import PropTypes from 'prop-types'
import { t } from 'ttag'
import Switch from 'react-switch'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class ADUsersViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userData: props.UserView,
      isUserList: props.isUserList,
      userStatus: props.UserView.userStatus === 'Active' ? true : false
    }
    this.handleHome = this.handleHome.bind(this)
  }
  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleUserStatus () {
  }
  render () {
    return (
      <div>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-12'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanADTitleUsers`}</h6>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={() => this.props.handleViewUser()}> Users List</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>User View</li>

                    </ol>
                  </nav>
                </div>
                {/* <div className='col-lg-6 col-5 text-right'>
              <a href='#' className='btn btn-sm btn-neutral'><i className='fas fa-map-marker-alt' />{ t`lanSPButtonGetLocation` }</a>
            </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6 mb-4 user-view'>
          <div className='row justify-content-center'>
            <div className='col-lg-12 col-md-12'>
              <div className='card border-0 mb-0'>
                <div className='card-header bg-transparent pb-3'>
                  <h5 className='card-title'>{t`lanSPTitleUsersView`}</h5>
                </div>
                <div className='card-body px-lg-4 py-lg-4'>
                  {/* List group */}
                  <ul className='list-group list-group-flush list my--3'>
                    <li className='list-group-item px-0'>
                      <div className='row align-items-center'>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{t`lanCommonLabelFirstName`}:</small>
                          <h5 className='mb-0'>{this.state.userData.firstName}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{t`lanCommonLabelLastName`}:</small>
                          <h5 className='mb-0'>{(this.state.userData && this.state.userData.lastName) ? this.state.userData.lastName : '-'}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{t`lanCommonLabelDisplayName`}:</small>
                          <h5 className='mb-0'>{this.state.userData.displayName}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{t`lanCommonLabelDateOfBirth`}:</small>
                          <h5 className='mb-0'>{(this.state.userData && this.state.userData.dob) ? moment(this.state.userData.dob).format('MMM DD, YY') : '-'}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{t`lanCommonLabelMobileNumber`}:</small>
                          <h5 className='mb-0'>{this.state.userData.mobileNumber}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{t`lanCommonLabelAlternateMobileNumber`}:</small>
                          <h5 className='mb-0'>{(this.state.userData && this.state.userData.alternateContactNumber) ? this.state.userData.alternateContactNumber : '-'}</h5>
                        </div>
                      </div>
                    </li>
                    <li className='list-group-item px-0'>
                      <div className='row align-items-center'>
                        <div className='col-md-3 col-6l'>
                          <small className='view-title'>{t`lanCommonLabelEmail`}:</small>
                          <h5 className='mb-0'>{this.state.userData.email}</h5>
                        </div>
                        <div className='col-md-3 col-6'>
                          <small className='view-title'>{t`lanCommonLabelAlternateEmail`}:</small>
                          <h5 className='mb-0 value-text'>{(this.state.userData && this.state.userData.alternateEmail) ? this.state.userData.alternateEmail : '-'}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{t`lanCommonLabelUserID`}:</small>
                          <h5 className='mb-0'>{this.state.userData.userAccount}</h5>
                        </div>
                        <div className='col-md-2 col-6'>
                          <small className='view-title'>{t`lanCommonLabelUserRole`}:</small>
                          <h5 className='mb-0'>{this.state.userData.userRole}</h5>
                        </div>
                      </div>
                    </li>
                    <li className='list-group-item px-0 '>
                      <div className='col pl-0'>
                        <small className='view-title'>{t`lanCommonLabelStatus`}:</small>
                        <h5 className='mb-0'>
                          <div className='react-switch'>
                            <Switch onChange={this.handleUserStatus} checked={this.state.userStatus} disabled />
                          </div>
                        </h5>
                      </div>
                      <div className='col mt-3 pl-0'>
                        <button className='btn btn-primary' type='button' data-toggle='collapse' data-target='#collapseExample' aria-expanded='false' aria-controls='collapseExample'>
                          {t`lanCommonButtonViewAddressDetails`}
                        </button>
                        <div className='collapse' id='collapseExample'>
                          <div className='card card-body'>
                            <ul className='list-group list-group-flush list my--3'>
                              <li className='list-group-item px-0'>
                                <div className='row align-items-center'>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{t`lanCommonLabelArea`}:</small>
                                    <h5 className='mb-0'>{(this.state.userData && this.state.userData.area) ? this.state.userData.area : '-'}</h5>
                                  </div>
                                </div>
                              </li>
                              <li className='list-group-item px-0'>
                                <div className='row align-items-center'>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{t`lanCommonLabelState`}:</small>
                                    <h5 className='mb-0'>{(this.state.userData && this.state.userData.state) ? this.state.userData.state : '-'}</h5>
                                  </div>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{t`lanCommonLabelCountry`}:</small>
                                    <h5 className='mb-0'>{(this.state.userData && this.state.userData.country) ? this.state.userData.country : 'India'}</h5>
                                  </div>
                                  <div className='col-md-3 col-6'>
                                    <small className='view-title'>{t`lanCommonLabelAddress`}:</small>
                                    <h5 className='mb-0'>{(this.state.userData && this.state.userData.address) ? this.state.userData.address : '-'}</h5>
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
                  <button className='btn btn-danger' onClick={this.props.handleViewUser}>{t`lanCommonButtonBack`}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ADUsersViewComponent.propTypes = {
  UserView: PropTypes.any,
  isUserList: PropTypes.any,
  handleViewUser: PropTypes.any
}

export default ADUsersViewComponent
