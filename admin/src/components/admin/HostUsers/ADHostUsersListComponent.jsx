/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { Tabs, Tab } from 'react-bootstrap-tabs'
import { t } from 'ttag'
import Pagination from 'react-js-pagination'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

import APICallManager from '../../../services/callmanager'
import ADHostUserCreateComponent from '../HostUsers/ADHostUserCreateComponent'

import Modal from 'react-modal'

import config from '../../../../public/config.json'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
// import { Alert } from 'react-bootstrap'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-60%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor       : 'transparent',
    width                 : '40%'
  }
}

class ADHostUsersListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      userData: JSON.parse(localStorage.getItem('userData')),
      hostData: JSON.parse(localStorage.getItem('hostData')),
      // authObj: JSON.parse(localStorage.getItem('authObj')),
      activePage: 1,
      searchString: '',
      defaultLanguage: '',
      defaultTimezone: '',
      defaultCurrency: '',
      dateFormat: '',
      usersList: [],
      password: '',
      errorPassword: '',
      errorMessage: '',
      modalIsOpen: false,
      hostUserData: {},
      totalCount: 0,
      nameChecked: 'checked',
      mobileNumberChecked: 'checked',
      emailChecked: 'checked',
      businessChecked: 'checked',
      userIDChecked: 'checked',
      userRoleChecked: 'checked',
      statusChecked: 'checked',
      actionsChecked: 'checked',
      id: '',
      hostUserChangePassword: {},
      hostUserPreference: {},
      preferenceIndex:''
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleEditUser = this.handleEditUser.bind(this)
    this.handleViewUser = this.handleViewUser.bind(this)
    this.handleIDProofs = this.handleIDProofs.bind(this)
    this.handleCreateUser = this.handleCreateUser.bind(this)
    this.handleDeleteUser = this.handleDeleteUser.bind(this)
    this.handlePasswordReset = this.handlePasswordReset.bind(this)
    this.handlePreferences = this.handlePreferences.bind(this)
    this.handlePasswordShowHide = this.handlePasswordShowHide.bind(this)
    this.closePasswordModal = this.closePasswordModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.closeModalPreferences = this.closeModalPreferences.bind(this)
    this.handleConfirmDeleteUser = this.handleConfirmDeleteUser.bind(this)
    this.PwdResetSubmit = this.PwdResetSubmit.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleUserStatus = this.handleUserStatus.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleHosts = this.handleHosts.bind(this)
    // this.handleRating = this.handleRating.bind(this)
    this.toastFunc = this.toastFunc.bind(this)
    this.handleNotifications = this.handleNotifications.bind(this)
  }

  componentWillMount () {
    let usersList = {
      url: config.baseUrl + config.getADHostUsersListAPI + this.state.hostData._id + '/' + this.state.activePage
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
    let hostData = JSON.parse(localStorage.getItem('hostData'))
    this.setState({
      hostData: hostData,
      firstName: hostData.firstName,
      lastName: hostData.lastName,
      displayName: hostData.displayName,
      mobileNumber: hostData.mobileNumber,
      email: hostData.email ? hostData.email : '',
      address: hostData.address ? hostData.address : '',
      defaultLanguage: hostData.preferences.defaultLanguage,
      defaultTimezone: hostData.preferences.defaultTimezone,
      defaultCurrency: hostData.preferences.defaultCurrency,
      dateFormat: hostData.preferences.dateFormat

    })
  }

  handleInputChange (event) {
    let _this = this
    this.setState({ activePage: 1 })
    let getObj = {
      url: config.baseUrl + config.getADHostUsersListAPI + this.state.hostData._id + '/' + '1' + '/' + this.state.searchString
    }
    APICallManager.getCall(getObj, function (resObj) {
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
    if (this.state.activePage !== pageNumber) {
      this.setState({ activePage: pageNumber })
      let usersList = { url: config.baseUrl + config.getADHostUsersListAPI + this.state.hostData._id + '/' + pageNumber + '/' + this.state.searchString }
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
  }
  toastFunc (value) {
    switch (value) {
      case 'User Create failed':
        ToastsStore.error('User Create failed ')
        break
      case 'User Created Successfully':
        ToastsStore.success('User Created Successfully')
        break
      case 'Not Getting Location.Please Enter Manually':
        ToastsStore.warning('Not Getting Location.Please Enter Manually')
        break
      default:
    }
  }
  handleEditUser (userData) {
    localStorage.setItem('userData', JSON.stringify(userData))
    hashHistory.push('/admin/host-users/edit')
    event.preventDefault()
  }

  handleViewUser (userData) {
    localStorage.setItem('userData', JSON.stringify(userData))
    hashHistory.push('/admin/host-users/view')
    event.preventDefault()
  }

  handleIDProofs (userData) {
    localStorage.setItem('userData', JSON.stringify(userData))
    hashHistory.push('/admin/host-user/id-proof')
    event.preventDefault()
  }

  handleCreateUser (userData) {
    let userListingData = this.state.usersList
    userListingData.unshift(userData)
    this.setState({ usersList: userListingData })
  }

  handleDeleteUser (userData) {
    this.setState({ modalIsOpen: true, hostUserData: userData })
  }

  handlePasswordReset (item) {
    this.setState({ modalPasswordIsOpen: true, hostUserChangePassword: item })
  }

  handlePreferences (item) {
    let _this = this
    localStorage.setItem('userData', JSON.stringify(item))
    _this.setState({ modalPreferencesOpen: true,
      preferenceIndex: item,
      defaultLanguage: item.preferences.defaultLanguage,
      defaultTimezone: item.preferences.defaultTimezone,
      defaultCurrency:item.preferences.defaultCurrency,
      dateFormat: item.preferences.dateFormat
    })
  }

  handlePasswordShowHide = () => {
    this.setState({ show: !this.state.show })
  }

  closePasswordModal () {
    localStorage.removeItem('userData')
    this.setState({ modalPasswordIsOpen: false })
  }

  closeModal () {
    this.setState({ modalIsOpen: false })
  }

  closeModalPreferences (userData) {
    localStorage.removeItem('userData')
    this.setState({ modalPreferencesOpen: false })
  }

  handleConfirmDeleteUser () {
    this.setState({ modalIsOpen: false })
    let userListingData = this.state.usersList
    const index = userListingData.findIndex(dataObj => dataObj._id === this.state.hostUserData._id)
    let userInfo = {
      _id: this.state.hostUserData._id,
      mobileNumber: this.state.hostUserData.mobileNumber,
      email: this.state.hostUserData.email,
      userAccount: this.state.hostUserData.userAccount
    }
    let _this = this
    let obj = { url: config.baseUrl + config.putADHostUserAPI, body: userInfo }
    APICallManager.postCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        userListingData.splice(index, 1)
        _this.setState({ usersList: userListingData })
      }
    })
  }

  PwdResetSubmit (event) {
    if (!this.state.password.trim()) {
      this.setState({ errorPassword: 'Please enter the password' })
    } else if (this.state.password.length < 6) {
      this.setState({ errorPassword: t`lanSPLabelErrorPasswordMinLength` })
    } else {
      let hostUserData = {
        newPassword: this.state.password
      }
      let usersList = { url: config.baseUrl + config.putADHostUserChangePasswordAPI + '/' + this.state.hostUserChangePassword._id, body: hostUserData }
      APICallManager.putCall(usersList, function (resObj) {
        if (resObj.data.statusCode === '1012') {
          ToastsStore.success('User Password Updated Successfully')
        } else {
          ToastsStore.error('User Password Updated Failed')
        }
      })
      this.setState({ modalPasswordIsOpen: false, password: '' })
    }
    event.preventDefault()
  }

  handleUpdate () {
    let userData = JSON.parse(localStorage.getItem('userData'))
    if (!this.state.defaultLanguage) {
      this.setState({ errorMessage: 'Language  is required' })
    } else if (!this.state.defaultTimezone) {
      this.setState({ errorMessage: 'Time  is required' })
    } else if (!this.state.defaultCurrency) {
      this.setState({ errorMessage: 'Currency is required' })
    } else if (!this.state.dateFormat) {
      this.setState({ errorMessage: 'Format is required' })
    } else {
      if (userData.preferences.defaultLanguage !== this.state.defaultLanguage ||
        userData.preferences.defaultTimezone !== this.state.defaultTimezone ||
        userData.preferences.defaultCurrency !== this.state.defaultCurrency ||
        userData.preferences.dateFormat !== this.state.dateFormat) {
        let putData = {
          defaultLanguage: this.state.defaultLanguage,
          defaultTimezone: this.state.defaultTimezone,
          defaultCurrency: this.state.defaultCurrency,
          dateFormat: this.state.dateFormat
        }
        let _this = this
        let obj = { url: config.baseUrl + config.putADHostUserPreferencesAPI + userData._id, body: putData }
        APICallManager.putCall(obj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            ToastsStore.success('Updated Successfully')
            let usersData = _this.state.usersList
            let index = usersData.findIndex(x => x._id === _this.state.preferenceIndex._id)
            usersData[index] = resObj.data.statusResult
            _this.setState({ modalPreferencesOpen: false, usersList: usersData })
          } else {
            _this.setState({ modalPreferencesOpen: false })
            ToastsStore.error('Update Failed')
          }
        })
      } else {
        this.setState({ modalPreferencesOpen: false })
        ToastsStore.error('No Changes to Update')
      }
    }
  }

  handleUserStatus (item) {
    let _this = this
    let putServiceLocationData = {
      status: item.userStatus === 'Active' ? 'Inactive' : 'Active'
    }
    let obj = { url: config.baseUrl + config.putADHostUserStatusAPI + item._id, body: putServiceLocationData }
    let userList = this.state.usersList
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        const i = userList.indexOf(item)
        userList[i].userStatus = resObj.data.statusResult.userStatus
        _this.setState({
          usersList: userList
        })
      } else {
        ToastsStore.error('Status Update failed')
      }
    })
  }

  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }

  handleHosts () {
    hashHistory.push('/admin/hosts')
    event.preventDefault()
  }
  // handleRating (hostData) {
  //   localStorage.setItem('hostData', JSON.stringify(hostData))
  //   hashHistory.push('/admin/hosts/review-ratings')
  //   event.preventDefault()
  // }
  handleNotifications (item) {
    localStorage.setItem('hostUserData', JSON.stringify(item))
    hashHistory.push('/admin/host-user/notifications')
    event.preventDefault()
  }
  handleEnter (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }

  render () {
    return (
      <div>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanADButtonTooltipLabelHostsHostUsers`}</h6>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item active' aria-current='page'><a onClick={this.handleHosts}>{t`lanADTitleHostsHostsList`}</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>{t`lanADHostsHostUsersList`}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='card Users'>
                <div className='card-body'>
                  {/* tabs list */}
                  <Tabs headerclassName='tab-header-bold' activeHeaderclassName='tab-header-blue'>
                    <Tab label={t`lanADTitleHostUsersList`}>
                      <div className='row py-lg-3'>
                        <div className='col-md-6 col-6'>
                          <div><h3>{t`lanADTitleHostUsersList`}</h3></div>
                        </div>
                        <div className='col-md-6 col-6 text-right'>
                          <div className='row'>
                            <div className='col-md-4'>
                              <div className='button-group'>
                                <button title={t`lanCommonLabelTableFilter`} className='btn btn-success dropdown-toggle' data-toggle='dropdown'><i className='fas fa-list' /></button>
                                <ul className='dropdown-menu'>
                                  <li><a><input type='checkbox' onChange={() => this.setState({
                                    nameChecked: this.state.nameChecked === 'checked' ? ''
                                      : 'checked'
                                  })} checked={this.state.nameChecked} />{t`lanCommonLabelName`}</a></li>
                                  <li><a><input type='checkbox' onChange={() => this.setState({
                                    mobileNumberChecked: this.state.mobileNumberChecked === 'checked' ? ''
                                      : 'checked'
                                  })} checked={this.state.mobileNumberChecked} />{t`lanCommonLabelMobileNumber`}</a></li>
                                  <li><a><input type='checkbox' onChange={() => this.setState({
                                    emailChecked: this.state.emailChecked === 'checked' ? ''
                                      : 'checked'
                                  })} checked={this.state.emailChecked} />{t`lanCommonLabelEmail`}</a></li>
                                  <li><a><input type='checkbox' onChange={() => this.setState({
                                    businessChecked: this.state.businessChecked === 'checked' ? ''
                                      : 'checked'
                                  })} checked={this.state.businessChecked} />{t`lanCommonLabelBusiness`}</a></li>
                                  <li><a><input type='checkbox' onChange={() => this.setState({
                                    userIDChecked: this.state.userIDChecked === 'checked' ? ''
                                      : 'checked'
                                  })} checked={this.state.userIDChecked} />{t`lanCommonLabelUserID`}</a></li>
                                  <li><a><input type='checkbox' onChange={() => this.setState({
                                    userRoleChecked: this.state.userRoleChecked === 'checked' ? ''
                                      : 'checked'
                                  })} checked={this.state.userRoleChecked} />{t`lanCommonLabelUserRole`}</a></li>
                                  <li><a><input type='checkbox' onChange={() => this.setState({
                                    statusChecked: this.state.statusChecked === 'checked' ? ''
                                      : 'checked'
                                  })} checked={this.state.statusChecked} />{t`lanCommonLabelStatus`}</a></li>
                                  {/* <li><a><input type='checkbox' checked={this.state.actionsChecked} />Actions</a></li> */}
                                </ul>
                              </div>
                            </div>
                            <div className='col-md-7 text-right pr-0'>
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
                                      onChange={(e) => { this.setState({ searchString: e.target.value }) }} onKeyPress={this.handleEnter} placeholder={t`lanCommonLabelSearch`} />
                                  </div>
                                </div>
                              </form>
                            </div>
                            <div className='col-md-1 pl-0'>
                              <button className='btn btn-icon btn-primary search-btn-admin px-3 py-2' type='button' onClick={this.handleInputChange}>
                                <span className='btn-inner--icon'><i className='fa fa-search' /></span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {this.state.usersList.length > 0
                        ? <div className='table-responsive'>
                          <table className='table align-items-center table-flush table-striped'>
                            <thead className='thead-light'>
                              <tr>
                                {this.state.nameChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelName`}</th> : null}
                                {this.state.mobileNumberChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelMobileNumber`}</th> : null}
                                {this.state.emailChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelEmail`}</th> : null}
                                {this.state.businessChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelBusiness`}</th> : null}
                                {this.state.userIDChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelUserID`}</th> : null}
                                {this.state.userRoleChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelUserRole`}</th> : null}
                                {this.state.statusChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelStatus`}</th> : null}
                                <th>{t`lanCommonLabelActions`}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.usersList.map((item, i) =>
                                <tr key={i}>
                                  {this.state.nameChecked ? <td className='text-muted'>{item.name}</td> : null}
                                  {this.state.mobileNumberChecked ? <td className='text-muted'>{item.mobileNumber}</td> : null}
                                  {this.state.emailChecked ? <td className='text-muted'>{item.email}</td> : null}
                                  {this.state.businessChecked ? <td className='text-muted'>{item.spServiceProvider}</td> : null}
                                  {this.state.userIDChecked ? <td className='text-muted'>{item.userAccount}</td> : null}
                                  {this.state.userRoleChecked ? <td className='text-muted'>{item.userRole}</td> : null}
                                  {this.state.statusChecked ? <td className='text-muted'>{item.userStatus}</td> : null}
                                  <td>
                                    {/* <a onClick={() => this.handleRating(item)} className='table-action table-action-view' data-toggle='tooltip' data-placement='top' title={t`lanSPLabelRating`}>
                                      <i className='far fa-star' />
                                    </a> */}
                                    <a onClick={() => this.handleViewUser(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanADTooltipLabelHostUserView`}>
                                      <i className='far fa-eye' />
                                    </a>
                                    <a onClick={() => this.handleEditUser(item)} className='table-action' data-toggle='tooltip' data-placement='top' title={t`lanADTooltipLabelHostUserEdit`} >
                                      <i className='fas fa-user-edit' />
                                    </a>
                                    <a onClick={() => this.handleDeleteUser(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanADTooltipLabelHostUserDelete`}>
                                      <i className='fas fa-trash' />
                                    </a>
                                    <a onClick={() => this.handlePasswordReset(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top'
                                      title={t`lanADTooltipLabelHostUserPaswordReset`}>
                                      <i className='fa fa-key' />
                                    </a>
                                    <a onClick={() => this.handlePreferences(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanADTooltipLabelHostUserPreferences`}>
                                      <i className='fa fa-sliders' />
                                    </a>
                                    <a onClick={() => this.handleIDProofs(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanADTooltipLabelHostUserIDProof`}>
                                      <i className='fa fa-id-card' />
                                    </a>
                                    <a onClick={() => this.handleNotifications(item)} className='table-action table-action-view' data-toggle='tooltip' data-placement='top'
                                      title={t`lanADTooltipLabelHostUserNotification`}>
                                      <i className='fas fa-bell ' />
                                    </a>
                                    <button className='btn-sm success ml-2' style={item.userStatus === 'Active' ? { background: '#ff0000', color:'#fff' } : { background: '#4da424', color:'#fff' }}
                                      onClick={() => this.handleUserStatus(item)} >{item.userStatus === 'Active' ? t`lanADButtonHostUserInactive` : t`lanADButtonHostUserActive`}</button>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                        : this.state.usersList.length <= 0 ? <div className='no-data'><p>{t`lanCommonLabelNoResultsFound`}</p></div> : null
                      }
                      <div className='row justify-content-center'>
                        <div className='col-sm-12'>
                          {this.state.usersList.length > 0
                          ? <div className='card-footer'>
                            <div className='row justify-content-center'>
                              <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={20}
                                totalItemsCount={this.state.totalCount}
                                pageRangeDisplayed={5}
                                onChange={this.handlePageChange}
                            />
                            </div>
                          </div> : null }
                        </div>
                      </div>
                    </Tab>
                    <Tab label={t`lanADTitleHostsCreateHostUser`}>
                      <ADHostUserCreateComponent toastFunc={this.toastFunc} handleUserCreatedData={this.handleCreateUser} />
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={this.state.modalIsOpen} style={customStyles}>
          <div className='modal-content'>
            <div className='modal-body text-center'>
              <p className='text-center'>{t`lanCommonLabelDeleteNote`}</p>
            </div>
            <div className='pb-4 text-center'>
              <button className='btn btn-primary mr-2' onClick={this.handleConfirmDeleteUser}>{t`lanCommonButtonConfirm`}</button>
              <button className='btn btn-danger' onClick={this.closeModal}>{t`lanCommonButtonCancel`}</button>
            </div>
          </div>
        </Modal>
        <Modal isOpen={this.state.modalPasswordIsOpen} style={customStyles}>
          <div className='modal-content'>
            <div className='modal-header p-3' style={{ backgroundColor:'#E4E4E4' }}>
              <h4 className='modal-title'>{t`lanADTitlePaswordReset`}</h4>
              <button type='button' className='close' onClick={this.closePasswordModal}>&times;</button>
            </div>
            <div className='modal-body'>
              <form>
                <div className='form-group'>
                  <input type={this.state.show ? 'text' : 'password'} onChange={(e) => this.setState({ password: e.target.value.replace(/\s/g, ''), errorPassword: '' })}
                    placeholder='Password' className='form-control' id='password' value={this.state.password}
                    maxLength={20} />
                  <i className={this.state.show ? 'far fa-eye' : 'far fa-eye-slash'} onClick={this.handlePasswordShowHide} style={{ position: 'absolute', top: 10, right: 10, zIndex: 99 }} />
                </div>
                <p className='errorMessage'>{this.state.errorPassword}</p>
                <button type='submit' className='btn btn-primary' onClick={this.PwdResetSubmit}>{t`lanSPButtonSubmit`}</button>
                <button className='btn btn-danger' onClick={this.closePasswordModal}>{t`lanCommonButtonCancel`}</button>
              </form>
            </div>
          </div>
        </Modal>
        <Modal isOpen={this.state.modalPreferencesOpen} style={customStyles}>
          <div className='modal-content'>
            <div className='modal-header p-3' style={{ backgroundColor:'#E4E4E4' }}>
              <h4 className='modal-title'>{t`lanSPTitlePreferences`}</h4>
              <button type='button' className='close' onClick={this.closeModalPreferences}>&times;</button>
            </div>
            <div className='modal-body'>
              <form>
                <div className='row'>
                  <div className='col-md-6'>
                    <div className='form-group'>
                      <label className='form-control-label'>{t`lanCommonLabelLanguage`}</label>
                      <select className='form-control' id='defaultLanguage' value={this.state.defaultLanguage} onChange={() => this.setState({ defaultLanguage: event.target.value, errorMessage: '' })}>
                        <option value='English'>English</option>
                        <option value='Hindi'>Hindi</option>
                        <option value='Telugu'>Telugu</option>
                      </select>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='form-group'>
                      <label className='form-control-label'>{t`lanCommonLabelTimezone`}</label>
                      <select className='form-control' id='defaultTimezone' value={this.state.defaultTimezone} onChange={() => this.setState({ defaultTimezone: event.target.value, errorMessage: '' })}>
                        <option value='IST'>IST - Indian Standard Time (UTC+05:30)</option>
                        <option value='EST'>EST - Eastern Standard Time (UTC-05:00)</option>
                        <option value='EDT'>EDT - Eastern Daylight Time (UTC-04:00)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-6'>
                    <div className='form-group'>
                      <label className='form-control-label'>{t`lanCommonLabelCurrency`}</label>
                      <select className='form-control' id='defaultCurrency' value={this.state.defaultCurrency} onChange={() => this.setState({ defaultCurrency: event.target.value, errorMessage: '' })}>
                        <option value='INR'>INR - Indian Rupee (₹)</option>
                        <option value='USD'>USD - US Dollar ($)</option>
                        <option value='EUR'>EUR - Euro (€)</option>
                      </select>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='form-group'>
                      <label className='form-control-label'>{t`lanCommonLabelDateFormat`}</label>
                      <select className='form-control' id='dateFormat' value={this.state.dateFormat} onChange={() => this.setState({ dateFormat: event.target.value, errorMessage: '' })}>
                        <option value='DD-MM-YY'>DD-MM-YY</option>
                        <option value='DD-MM-YYYY'>DD-MM-YYYY</option>
                        <option value='DD/MM/YY'>DD/MM/YY</option>
                        <option value='DD/MM/YYYY'>DD/MM/YYYY</option>
                        <option value='MMM DD, YY'>MMM DD, YY</option>
                        <option value='MMM DD, YYYY'>MMM DD, YYYY</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-sm-12 text-center mt-4'>
                    <button type='button' className='btn btn-primary' onClick={this.handleUpdate}>{t`lanCommonButtonUpdate`}</button>
                    <button className='btn btn-danger' onClick={this.closeModalPreferences}>{t`lanCommonButtonCancel`}</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Modal>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}

export default ADHostUsersListComponent

