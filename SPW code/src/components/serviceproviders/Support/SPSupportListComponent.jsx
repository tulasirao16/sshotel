/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import moment from 'moment'
import { t } from 'ttag'
import { Tabs, Tab } from 'react-bootstrap-tabs'
import { hashHistory } from 'react-router'
import axios from 'axios'
import Pagination from 'react-js-pagination'
import 'react-drawer/lib/react-drawer.css'
import 'react-toastify/dist/ReactToastify.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import classnames from 'classnames'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import SPSupportCreateComponent from './SPSupportCreateComponent'
import SPSupportViewComponent from './SPSupportViewComponent'

const myApi = axios.create()

class SPSupportListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      authObj: JSON.parse(localStorage.getItem('authObj')),
      searchString: '',
      supportList: [],
      activePage: 1,
      totalCount: 0,
      matchesData: false,
      isShowList: true,
      isShowView: false,
      activeProfileTitle: true
    }
    this.handleCreateSupport = this.handleCreateSupport.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleUserProfile = this.handleUserProfile.bind(this)
    this.handleAddressDetails = this.handleAddressDetails.bind(this)
    this.handleIDProofs = this.handleIDProofs.bind(this)
    this.handlePreferences = this.handlePreferences.bind(this)
    this.handleBusinessInfo = this.handleBusinessInfo.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleSupport = this.handleSupport.bind(this)
    this.handleLogOut = this.handleLogOut.bind(this)
    this.handleViewSupport = this.handleViewSupport.bind(this)
    this.handleOnKeyPress = this.handleOnKeyPress.bind(this)
  }
  componentWillMount () {
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    this.setState({
      authObj: authObj,
      firstName: authObj.firstName,
      lastName: authObj.lastName,
      displayName: authObj.displayName,
      mobileNumber: authObj.mobileNumber,
      email: authObj.email ? authObj.email : '',
      address: authObj.address ? authObj.address : '',
      defaultLanguage: authObj.preferences.defaultLanguage,
      defaultTimezone: authObj.preferences.defaultTimezone,
      defaultCurrency: authObj.preferences.defaultCurrency,
      dateFormat: authObj.preferences.dateFormat

    })
    let supportList = {
      url: config.baseUrl + config.getSPSupportListAPI + this.state.activePage + '/'
    }
    let _this = this
    APICallManager.getCall(supportList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          supportList: resObj.data.statusResult.supportData,
          totalCount: resObj.data.statusResult.totalDocs,
          matchesData: false
        })
      } else {
        _this.setState({
          supportList: [],
          matchesData: false
        })
      }
    })
  }

  handleInputChange (event) {
    let _this = this
    _this.setState({ searchString: event.target.value, activePage: 1 })
    let supportObj = {
      unBlockStatus: true,
      url: config.baseUrl + config.getSPSupportListAPI + '1' + '/' + event.target.value
    }
    APICallManager.getCall(supportObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          supportList: resObj.data.statusResult.supportData,
          totalCount: resObj.data.statusResult.totalDocs,
          matchesData: false
        })
      } else {
        _this.setState({
          supportList: [],
          totalCount: 0,
          matchesData: true
        })
      }
    })
  }
  handlePageChange (pageNumber) {
    if (this.state.activePage !== pageNumber) {
      this.setState({ activePage: pageNumber })
      let _this = this
      let obj = {
        unBlockStatus: true,
        url: config.baseUrl + config.getSPSupportListAPI + pageNumber + '/' + this.state.searchString }
      APICallManager.getCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ supportList: resObj.data.statusResult.supportData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false })
        } else {
          _this.setState({ supportList: [], totalCount: 0, matchesData: false })
        }
      })
    }
  }
  handleUserProfile () {
    hashHistory.push('/host/user/profile')
    event.preventDefault()
  }
  handleAddressDetails () {
    hashHistory.push('/host/user/profile/address')
    event.preventDefault()
  }
  handleIDProofs () {
    hashHistory.push('/host/user/profile/idproof')
    event.preventDefault()
  }
  handlePreferences () {
    hashHistory.push('/host/user/profile/preferences')
    event.preventDefault()
  }
  handleBusinessInfo () {
    hashHistory.push('/host/user/profile/businessinfo')
    event.preventDefault()
  }
  handleChangePassword () {
    hashHistory.push('/host/user/profile/changepassword')
    event.preventDefault()
  }
  handleSupport () {
    this.setState({ activeProfileTitle: true })
    hashHistory.push('/host/support')
    event.preventDefault()
  }
  handleLogOut () {
    localStorage.clear()
    myApi.defaults.headers.token = null
    hashHistory.push('/host/signin')
  }
  handleCreateSupport (data) {
    let supportListingData = this.state.supportList
    if (data && data._id) {
      supportListingData.unshift(data)
      this.setState({ supportList: supportListingData })
    }
  }
  handleViewSupport (data) {
    this.setState({
      isShowList: !this.state.isShowList,
      isShowView: !this.state.isShowView,
      selectedSupportData: data
    })
  }

  handleOnKeyPress (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }

  render () {
    return (
      <div>
        {/* ---------- Header Starts ------------- */}
        <div className='header bg-primary pb-6'>
          <div className='container'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{ t`lanSPTitleProfile` }</h6>
                </div>
              </div>
            </div>
          </div>
        </div>{/* ---------- Header Starts ------------- */}
        <div className='container mt--6'>
          <div className='row'>
            <div className='col-md-4'>
              <div className='card card-profile'>
                <img src={require('../images/img-1-1000x600.jpg')} className='card-img-top' />
                <div className='row justify-content-center'>
                  <div className='col-lg-3 order-lg-2'>
                    <div className='card-profile-image rounded-circle mt--5'>
                      <a>
                        <img src={this.state.authObj.userIconPath ? config.baseUrl + this.state.authObj.userIconPath : require('../images/profile-icon.png')} className='rounded-circle' />
                      </a>
                    </div>
                  </div>
                </div>
                <div className='card-body mt-6 pt-0'>
                  <div className='text-center'>
                    <h5 className='h3'>{this.state.displayName}</h5>
                    <div className='h5 font-weight-300'>
                      <i className='ni ni-pin-3 mr-2' />{this.state.address}
                    </div>
                    <ul className='list-unstyled team-members'>
                      <li>
                        <div className='row mobile'>
                          <div className='col-md-9 col-9 pl-4 text-left'>
                            <p><span ><i className='fas fa-mobile-alt pr-2 pl-1' /></span><small>{this.state.mobileNumber}</small></p>
                          </div>
                          <div className='col-md-3 col-3 text-right'>
                            <i className='far fa-check-circle btn-outline-success' />
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className='row email'>
                          <div className='col-md-9 col-9 pl-4 text-left'>
                            <p><span ><i className='fas fa-envelope pr-2 pl-1' /></span>{this.state.email}</p>
                          </div>
                          <div className='col-md-3 col-3 pt-1 text-right'>
                            <i className='far fa-check-circle btn-outline-success' />
                          </div>
                        </div>
                      </li>
                      <hr className='divider' />
                    </ul>
                  </div>
                  <ul className='list-unstyled team-members'>
                    <li>
                      <a onClick={this.handleUserProfile} >{ t`lanSPTitleUserProfile` }</a>
                    </li>
                    <li>
                      <a onClick={this.handleAddressDetails} >{ t`lanSPTitleAddressDetails` }</a>
                    </li>
                    <li>
                      <a onClick={this.handleIDProofs} >{ t`lanSPTitleIDProofs` }</a>
                    </li>
                    {/* <li>
                      <a onClick={this.handlePreferences} >{ t`lanSPTitlePreferences` }</a>
                    </li> */}
                    <li>
                      <a onClick={this.handleBusinessInfo} >{ t`lanSPTitleBusinessInfo` }</a>
                    </li>
                    <li>
                      <a className={classnames({ 'active-profile-title' :this.state.activeProfileTitle })} onClick={this.handleSupport} >{ t`lanSPTitleSupport` }</a>
                    </li>
                    <li>
                      <a onClick={this.handleChangePassword} >{ t`lanSPTitleChangePassword` }</a>
                    </li>
                    <li>
                      <a onClick={this.handleLogOut}>{ t`lanSPTitleLogout` }</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='col-lg-8' >
              {this.state.isShowList
                ? <div className='edit-profile preference'>
                  <div className='card'>
                    <div className='card-header'>
                      <h4 className='card-title'>{t`lanSPTitleSupport`}</h4>
                    </div>
                    {/* edit prfile htmlForm */}
                    <div className='edit-profile'>
                      <div className='card-body support-mobile'>
                        <div className='row justify-content-end'>
                          <div className='col-sm-6 eu-support-search'>
                            {/* -- Search form -- */}
                            <form>
                              <div className='form-group mb-0'>
                                <div className='input-group col-sm-12 input-group-lg input-group-flush'>
                                  <div className='input-group-prepend'>
                                    <div className='input-group-text'>
                                      <span className='fas fa-search' />
                                    </div>
                                  </div>
                                  <input type='search' className='form-control' placeholder={t`lanCommonLabelSearch`} value={this.state.searchString} onKeyPress={this.handleOnKeyPress} onChange={this.handleInputChange} />
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                        <Tabs headerClass='tab-header-bold' activeHeaderClass='tab-header-blue'>
                          <Tab label={t`lanSPButtonTicketList`}>
                            <div >
                              {(this.state.supportList && this.state.supportList.length > 0)
                                ? <div className='table-responsive'>
                                  <div>
                                    <table className='table align-items-center table-flush table-hover'>
                                      <thead className='thead-light'>
                                        <tr>
                                          <th className='sort'>Ticket Title</th>
                                          <th className='sort'>Ticket Type</th>
                                          <th className='sort'>Ticket ID</th>
                                          <th className='sort'>Date</th>
                                          <th className='sort'>Status</th>
                                          <th className='sort'>Ticket Description </th>
                                          <th className='sort'>Actions</th>
                                        </tr>
                                      </thead>
                                      {this.state.supportList.map((item, i) =>
                                        <tbody key={i} >
                                          <tr>
                                            <td><h5 className='mb-0 text-sm'>{item.ticketTitle}</h5></td>
                                            <td><h5 className='mb-0 text-sm'>{item.ticketTag}</h5></td>
                                            <td><h5 className='mb-0 text-sm'>{item.ticketNumType + item.ticketNumber}</h5></td>
                                            <td><h5 className='mb-0 text-sm'>{moment(item.createdAt).format('MMM DD, YYYY')}</h5></td>
                                            <td><h5 className='mb-0 text-sm'>{item.ticketStatus}</h5></td>
                                            <td><p className='ticket-msg'>{item.ticketDescription}</p></td>
                                            <td><div className='ticket-actions'>
                                              <a onClick={() => this.handleViewSupport(item)} className='update-edit' title='View Ticket'>
                                                <span className='avatar avatar-md mr-0 bg-primary rounded-circle'>
                                                  <span className='media-object d-flex justify-content-center align-items-center'><i className='far fa-eye' /></span>
                                                </span>
                                              </a>
                                            </div>
                                            </td>
                                          </tr>
                                        </tbody>)}
                                    </table>
                                    {/* <div className='row align-items-center mb-2'>
                                      <div className='col-sm-3'>
                                        <h5 className='mb-0 text-sm'>{item.ticketTitle}</h5>
                                      </div>
                                      <div className='col-sm-2'>
                                        <h5 className='mb-0 text-sm'>{item.ticketTag}</h5>
                                      </div>
                                      <div className='col-sm-2'>
                                        <h5 className='mb-0 text-sm'>{item.ticketNumType + item.ticketNumber}</h5>
                                      </div>
                                      <div className='col-sm-2'>
                                        <h5 className='mb-0 text-sm'>{moment(item.createdAt).format('MMM DD, YYYY')}</h5>
                                      </div>
                                      <div className='col-sm-2 col-6'>
                                        <h5 className='mb-0 text-sm'>{item.ticketStatus}</h5>
                                      </div>
                                      <div className='col-sm-2 col-6'>
                                        <div className='row align-items-center mt-0'>
                                          <div className='col-sm-12 text-center ticket-actions'>
                                            <a onClick={() => this.handleViewSupport(item)} className='update-edit' title='View Ticket'>
                                              <span className='avatar avatar-md mr-0 bg-primary rounded-circle'>
                                                <span className='media-object d-flex justify-content-center align-items-center'><i className='far fa-eye' /></span>
                                              </span>
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    </div> */}
                                  </div>
                                </div>
                                : this.state.matchesData
                                ? <div className='container'>
                                  <div className='row justify-content-center'>
                                    <div className='col-sm-12 text-center my-0' >
                                      <div className='no-data'><p>{t`lanCommonLabelNoMatchesFound`}</p></div>
                                    </div>
                                  </div>
                                </div>
                              : <div className='container'>
                                <div className='row justify-content-center'>
                                  <div className='col-sm-12 text-center'>
                                    <div className='no-data'><p>{t`lanCommonLabelNoTickets`}</p></div>
                                  </div>
                                </div>
                              </div>
                              }
                            </div>
                            {(this.state.supportList && this.state.supportList.length > 0)
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
                          </Tab>
                          <Tab label={t`lanSPButtonNewTicket`}>
                            <SPSupportCreateComponent handleCreateSupport={this.handleCreateSupport} />
                          </Tab>
                        </Tabs>
                      </div>
                    </div>
                  </div>
                </div>
                : this.state.isShowView ? <SPSupportViewComponent selectedSupportData={this.state.selectedSupportData} handleViewSupport={this.handleViewSupport} />
                : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SPSupportListComponent
