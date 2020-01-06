/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import Switch from 'react-switch'
import { t } from 'ttag'
import Pagination from 'react-js-pagination'
import 'react-drawer/lib/react-drawer.css'
import { Tabs, Tab } from 'react-bootstrap-tabs'
// import DatePicker from 'react-datepicker'
import APICallManager from '../../../services/callmanager'
import SPUserCreateComponent from './SPUserCreateComponent'
import Modal from 'react-modal'

import config from '../../../../public/config.json'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
}

class SPUsersListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      activePage: 1,
      searchString: '',
      usersList: [],
      modalIsOpen: false,
      userDeleteData: {},
      totalCount: 0,
      nameChecked:'checked',
      mobileNumberChecked:'checked',
      emailChecked:'checked',
      businessChecked:'checked',
      userIDChecked:'checked',
      userRoleChecked:'checked',
      statusChecked:'checked',
      actionsChecked:'checked'
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleEditUser = this.handleEditUser.bind(this)
    this.handleDeleteUser = this.handleDeleteUser.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleConfirmDeleteUser = this.handleConfirmDeleteUser.bind(this)
    this.handleUserCreatedData = this.handleUserCreatedData.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }

  componentWillMount () {
    let usersList = {
      url: config.baseUrl + config.getSPUsersListAPI + '/' + this.state.activePage + '/'
    }
    let _this = this
    APICallManager.getCall(usersList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          usersList: resObj.data.statusResult.userData,
          totalCount: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({ usersList: [] })
      }
    })
  }

  handleInputChange (event) {
    let _this = this
    _this.setState({ searchString: event.target.value })
    let usersList = {
      url: config.baseUrl + config.getSPUsersListAPI + '/' + '1' + '/' + event.target.value
    }
    APICallManager.getCall(usersList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          usersList: resObj.data.statusResult.userData,
          totalCount: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({
          usersList: [],
          totalCount: 0
        })
      }
    })
  }

  handlePageChange (pageNumber) {
    this.setState({ activePage: pageNumber })
    let usersList = { url: config.baseUrl + config.getSPUsersListAPI + '/' + pageNumber + '/' + this.state.searchString }
    let _this = this
    APICallManager.getCall(usersList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          usersList: resObj.data.statusResult.userData,
          totalCount: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({
          usersList: [],
          totalCount: 0
        })
      }
    })
  }

  handleChange (userData) {
    let userListingData = this.state.usersList
    const index = userListingData.findIndex(dataObj => dataObj._id === userData._id)
    let _this = this
    if (userData.userStatus === 'Inactive') {
      let obj = { url: config.baseUrl + config.putSPUserStatusActivateAPI + userData._id }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          userListingData[index].userStatus = 'Active'
          _this.setState({ usersList: userListingData })
        }
      })
    } else {
      let obj = { url: config.baseUrl + config.putSPUserStatusInactivateAPI + userData._id }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          userListingData[index].userStatus = 'Inactive'
          _this.setState({ usersList: userListingData })
        }
      })
    }
  }

  handleEditUser (userData) {
    localStorage.setItem('userData', JSON.stringify(userData))
    hashHistory.push('/host/user/edit')
    event.preventDefault()
  }

  handleViewUser (userData) {
    localStorage.setItem('userData', JSON.stringify(userData))
    hashHistory.push('/host/user/view')
    event.preventDefault()
  }

  handleDeleteUser (userData) {
    this.setState({ modalIsOpen: true, userDeleteData: userData })
  }

  closeModal () {
    this.setState({ modalIsOpen: false })
  }

  handleConfirmDeleteUser () {
    this.setState({ modalIsOpen: false })
    let userListingData = this.state.usersList
    const index = userListingData.findIndex(dataObj => dataObj._id === this.state.userDeleteData._id)
    let userInfo = {
      _id: this.state.userDeleteData._id,
      mobileNumber: this.state.userDeleteData.mobileNumber,
      email: this.state.userDeleteData.email,
      userAccount: this.state.userDeleteData.userAccount
    }
    let _this = this
    let obj = { url: config.baseUrl + config.postSPUserDeleteAPI, body: userInfo }
    APICallManager.postCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        userListingData.splice(index, 1)
        _this.setState({ usersList: userListingData })
      }
    })
  }

  handleUserCreatedData (data) {
    let userListingData = this.state.usersList
    userListingData.unshift(data)
    this.setState({ usersList: userListingData })
  }
  handleHome () {
    hashHistory.push('/host/home')
    event.preventDefault()
  }
  render () {
    return (
      <div>
        {/* ---------- Header Starts ------------- */}
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{ t`lanSPTitleUsers` }</h6>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      {/* <li className='breadcrumb-item'><a>Users</a></li> */}
                      <li className='breadcrumb-item active' aria-current='page'>{ t`lanSPTitleUsersList` }</li>
                    </ol>
                  </nav>
                </div>
                {/* <div className='col-lg-6 col-5 text-right'>
                  <a href='#' className='btn btn-sm btn-neutral'><i className='fas fa-map-marker-alt' />{ t`lanSPButtonGetLocation` }</a>
                </div> */}
              </div>
            </div>
          </div>
        </div>{/* ---------- Header Starts ------------- */}
        <div className='container-fluid mt--6'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='card Users'>
                {/* <div className='card-header'>
                  <h5 className='card-title'>Create User</h5>
                </div> */}
                <div className='card-body'>
                  {/* tabs list */}
                  <Tabs headerclassName='tab-header-bold' activeHeaderclassName='tab-header-blue'>
                    <Tab label={t`lanSPButtonUsersList`}><div>
                      <div className='row py-lg-3'>
                        <div className='col-md-6 col-6'>
                          <div><h3>{ t`lanSPButtonUsersList` }</h3></div>
                        </div>
                        <div className='col-md-6 col-6 text-right'>
                          <div className='row'>
                            <div className='col-md-4'>
                              <div className='button-group'>
                                <button title='Table Filter' className='btn btn-success dropdown-toggle' data-toggle='dropdown'><i className='fas fa-list' /></button>
                                <ul className='dropdown-menu'>
                                  <li><a><input type='checkbox' onChange={() => this.setState({ nameChecked: this.state.nameChecked === 'checked' ? ''
                                  : 'checked' })} checked={this.state.nameChecked} />Name</a></li>
                                  <li><a><input type='checkbox' onChange={() => this.setState({ mobileNumberChecked: this.state.mobileNumberChecked === 'checked' ? ''
                                  : 'checked' })} checked={this.state.mobileNumberChecked} />Mobile Number</a></li>
                                  <li><a><input type='checkbox' onChange={() => this.setState({ emailChecked: this.state.emailChecked === 'checked' ? ''
                                  : 'checked' })} checked={this.state.emailChecked} />Email</a></li>
                                  <li><a><input type='checkbox' onChange={() => this.setState({ businessChecked: this.state.businessChecked === 'checked' ? ''
                                  : 'checked' })} checked={this.state.businessChecked} />Business</a></li>
                                  <li><a><input type='checkbox' onChange={() => this.setState({ userIDChecked: this.state.userIDChecked === 'checked' ? ''
                                  : 'checked' })} checked={this.state.userIDChecked} />UserID</a></li>
                                  <li><a><input type='checkbox' onChange={() => this.setState({ userRoleChecked: this.state.userRoleChecked === 'checked' ? ''
                                  : 'checked' })} checked={this.state.userRoleChecked} />UserRole</a></li>
                                  <li><a><input type='checkbox' onChange={() => this.setState({ statusChecked: this.state.statusChecked === 'checked' ? ''
                                  : 'checked' })} checked={this.state.statusChecked} />Status</a></li>
                                  {/* <li><a><input type='checkbox' checked={this.state.actionsChecked} />Actions</a></li> */}
                                </ul>
                              </div>
                            </div>
                            <div className='col-md-8 text-right'>
                              {/* -- Search form -- */}
                              <form>
                                <div className='form-group mb-0'>
                                  <div className='input-group input-group-lg input-group-flush'>
                                    <div className='input-group-prepend'>
                                      <div className='input-group-text'>
                                        <span className='fas fa-search' />
                                      </div>
                                    </div>
                                    <input type='search' className='form-control' value={this.state.searchString} onChange={this.handleInputChange} placeholder={t`lanCommonLabelSearch`} />
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                      {this.state.usersList.length > 0
                      ? <div className='table-responsive'>
                        <table className='table align-items-center table-flush table-striped'>
                          <thead className='thead-light'>
                            <tr>
                              {this.state.nameChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelName` }</th> : null }
                              {this.state.mobileNumberChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelMobileNumber` }</th> : null }
                              {this.state.emailChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelEmail` }</th> : null }
                              {this.state.businessChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelBusiness` }</th> : null }
                              {this.state.userIDChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelUserID` }</th> : null }
                              {this.state.userRoleChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelUserRole` }</th> : null }
                              {this.state.statusChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelStatus` }</th> : null }
                              <th>{ t`lanCommonLabelActions` }</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.usersList.map((item, i) =>
                              <tr key={i}>
                                {this.state.nameChecked ? <td className='text-muted'>{item.name}</td> : null }
                                {this.state.mobileNumberChecked ? <td className='text-muted'>{item.mobileNumber}</td> : null }
                                {this.state.emailChecked ? <td className='text-muted'>{item.email}</td> : null }
                                {this.state.businessChecked ? <td className='text-muted'>{item.spServiceProvider}</td> : null }
                                {this.state.userIDChecked ? <td className='text-muted'>{item.userAccount}</td> : null }
                                {this.state.userRoleChecked ? <td className='text-muted'>{item.userRole}</td> : null }
                                {this.state.statusChecked
                                  ? <td className='table-actions'>
                                    <Switch
                                      className='react-switch'
                                      onChange={() => this.handleChange(item)}
                                      checked={item.userStatus === 'Active'}
                                      aria-labelledby='neat-label'
                                    />
                                  </td> : null }
                                <td>
                                  <a onClick={() => this.handleViewUser(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanSPButtonTooltipViewUser`}>
                                    <i className='far fa-eye' />
                                  </a>
                                  <a onClick={() => this.handleEditUser(item)} className='table-action' data-toggle='tooltip' data-placement='top' title={t`lanSPButtonTooltipEditUser`} >
                                    <i className='fas fa-user-edit' />
                                  </a>
                                  <a onClick={() => this.handleDeleteUser(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanSPButtonTooltipDeleteUser`}>
                                    <i className='fas fa-trash' />
                                  </a>
                                </td>
                              </tr>
                            )}
                          </tbody>
                          <tfoot>
                            {this.state.usersList && this.state.usersList.length > 0
                              ? <tr className='card-footer'>
                                <td className='text-center'>
                                  <Pagination
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={20}
                                    totalItemsCount={this.state.totalCount}
                                    pageRangeDisplayed={5}
                                    onChange={this.handlePageChange}
                                  />
                                </td>
                              </tr>
                            : null}
                          </tfoot>
                        </table>
                      </div>
                      : this.state.usersList.length <= 0 ? <div className='no-data'><p>{t `lanCommonLabelNoResultsFound`}</p></div> : null
                      }
                    </div>
                    </Tab>
                    <Tab label={t`lanSPButtonCreateUser`}>
                      <SPUserCreateComponent handleUserCreatedData={this.handleUserCreatedData} />
                    </Tab>
                  </Tabs>
                  <Modal
                    isOpen={this.state.modalIsOpen}
                    style={customStyles}
                  >
                    <h2 >{t`lanCommonLabelDeleteNote`}</h2>
                    <button className='btn btn-primary mr-2' onClick={this.handleConfirmDeleteUser}>{t`lanCommonButtonConfirm`}</button>
                    <button className='btn btn-danger' onClick={this.closeModal}>{t`lanCommonButtonCancel`}</button>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SPUsersListComponent
