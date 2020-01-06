/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import Pagination from 'react-js-pagination'
import 'react-drawer/lib/react-drawer.css'
import { Tabs, Tab } from 'react-bootstrap-tabs'
import Modal from 'react-modal'
// import PropTypes from 'prop-types'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

import APICallManager from '../../../services/callmanager'
import ADUsersViewComponent from '../../../components/admin/Users/ADUsersViewComponent'
import ADUserEditComponent from '../../../components/admin/Users/ADUserEditComponent'
import config from '../../../../public/config.json'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}
class ADUsersListComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activePage: 1,
      searchString: '',
      newPassword: '',
      status: localStorage.getItem('adminUserStatus'),
      usersList:[],
      nameChecked: 'checked',
      mobileNumberChecked: 'checked',
      emailChecked: 'checked',
      userIDChecked: 'checked',
      userRoleChecked: 'checked',
      statusChecked: 'checked',
      actionsChecked: 'checked',
      isUserList:'List',
      isShowUsers: true,
      isEditUsers:true,
      UserView: {},
      userAc: {},
      show: false,
      key:'',
      userSpliceData:{},
      errorMessage:'',
      password:''
    }
    this.handleHome = this.handleHome.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    // this.handleDeleteUser = this.handleDeleteUser.bind(this)
    this.handleViewUser = this.handleViewUser.bind(this)
    this.handleADUserViewBack = this.handleADUserViewBack.bind(this)
    this.handleChangeUserPassword = this.handleChangeUserPassword.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleEditUser = this.handleEditUser.bind(this)
    this.handlePasswordShowHide = this.handlePasswordShowHide.bind(this)
  }

  componentWillMount () {
    let usersList = {
      url: config.baseUrl + config.getADUsersListByStatusAPI + '1' + '/' + this.state.status
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
    this.setState({ activePage: 1 })
    let _this = this
    let searchValue = this.state.searchString
    let usersList = {
      url: config.baseUrl + config.getADUsersListByStatusAPI + '1' + '/' + this.state.status + '/' + searchValue
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
  handleFunction = (e) => {
    let x = e.target.value.trim()
    if (this.state.password.length < 1 && x === '') {
      this.setState({ password:'', errorMessage:'' })
    } else {
      this.setState({ password: x, errorMessage:'' })
    }
  }

  // handleDeleteUser (userData) {
  //   this.setState({ modalIsOpen: true, userDeleteData: userData })
  // }

  handlePageChange (pageNumber) {
    if (this.state.activePage !== pageNumber) {
      this.setState({ activePage: pageNumber })
      let usersList = { url: config.baseUrl + config.getADUsersListByStatusAPI + pageNumber + '/' + this.state.status }
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
  closeModal () {
    this.setState({ modalIsOpen: false, errorMessage:'', password:'' })
  }
  handlePasswordShowHide (show) {
    this.setState({
      show: !this.state.show
    })
  }
  handleViewUser (userData) {
    this.setState({
      isUserList: 'View',
      UserView: userData
    })
  }
  handleEditUser (userData, i) {
    this.setState({
      isUserList: 'Edit',
      UserView: userData,
      key:i
    })
  }
  handleEnter (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }
  handleADUserViewBack (resObj) {
    let usersList = this.state.usersList
    if (resObj && resObj._id) {
      usersList[this.state.key] = resObj
      this.setState({
        isUserList: 'List',
        usersList: usersList
      })
    } else {
      this.setState({
        isUserList: 'List'
      })
    }
  }
  handleChangeUserPassword (data) {
    this.setState({ modalIsOpen: true, userAc: data })
  }
  handleSubmit () {
    if (!this.state.password) {
      this.setState({ errorMessage: 'Password is Requied', password:'' })
    } else if (this.state.password.length < 6) {
      this.setState({ errorMessage: 'Password Should Be Greater Than 6 Letters', password:'' })
    } else {
      let password = this.state.password
      this.setState({ modalIsOpen: false, password:'', errorMessage: '' })
      let userInfo = {
        newPassword: password
      }
      let putObj = {
        url: config.baseUrl + config.putADUsersChangePasswordAPI + this.state.userAc._id, body: userInfo
      }
      APICallManager.putCall(putObj, function (resObj) {
        if (resObj.data.statusCode === '1012') {
          ToastsStore.success('User Password Updated Successfully')
        } else {
          ToastsStore.error('User Password Updated Failed')
        }
      })
    }
    event.preventDefault()
  }
  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleChange (userData) {
    let userListingData = this.state.usersList
    const index = userListingData.findIndex(dataObj => dataObj._id === userData._id)
    let _this = this
    if (userData.userStatus === 'Inactive') {
      let obj = { url: config.baseUrl + config.putADUserStatusActivateAPI + userData._id }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          userListingData[index].userStatus = 'Active'
          userListingData.splice(index, 1)
          _this.setState({ usersList: userListingData })
        }
      })
    } else {
      let obj = { url: config.baseUrl + config.putADUserStatusInactivateAPI + userData._id }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          userListingData[index].userStatus = 'Inactive'
          userListingData.splice(index, 1)
          _this.setState({ usersList: userListingData })
        }
      })
    }
  }
  render () {
    return (
      <div>
        {this.state.isUserList === 'List'
          ? <div>
            <div className='header bg-primary pb-6'>
              <div className='container-fluid'>
                <div className='header-body'>
                  <div className='row align-items-center py-4'>
                    <div className='col-lg-6 col-7'>
                      <h6 className='h2 text-white d-inline-block mb-0'>{t`lanADTitleUsers`}</h6>
                      <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                        <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                          <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                          <li className='breadcrumb-item active' aria-current='page'>{t`lanADTitleUsersList`}</li>
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
            <div className='container-fluid mt--6'>
              <div className='row'>
                <div className='col-md-12'>
                  <div className='card Users'>
                    <div className='card-body'>
                      {/* tabs list */}
                      <Tabs headerclassName='tab-header-bold' activeHeaderclassName='tab-header-blue'>
                        <Tab label={t`lanSPButtonUsersList`}>
                          <div>
                            <div className='row py-lg-3'>
                              <div className='col-md-6 col-6'>
                                <div><h3>{t`lanSPButtonUsersList`}</h3></div>
                              </div>
                              <div className='col-md-6 col-6 text-right'>
                                <div className='row'>
                                  <div className='col-md-4'>
                                    <div className='button-group'>
                                      <button title='Table Filter' className='btn btn-success dropdown-toggle' data-toggle='dropdown'><i className='fas fa-list' /></button>
                                      <ul className='dropdown-menu'>
                                        <li><a><input type='checkbox' onChange={() => this.setState({
                                          nameChecked: this.state.nameChecked === 'checked' ? ''
                                            : 'checked'
                                        })} checked={this.state.nameChecked} />Name</a></li>
                                        <li><a><input type='checkbox' onChange={() => this.setState({
                                          mobileNumberChecked: this.state.mobileNumberChecked === 'checked' ? ''
                                            : 'checked'
                                        })} checked={this.state.mobileNumberChecked} />Mobile Number</a></li>
                                        <li><a><input type='checkbox' onChange={() => this.setState({
                                          emailChecked: this.state.emailChecked === 'checked' ? ''
                                            : 'checked'
                                        })} checked={this.state.emailChecked} />Email</a></li>
                                        <li><a><input type='checkbox' onChange={() => this.setState({
                                          userIDChecked: this.state.userIDChecked === 'checked' ? ''
                                            : 'checked'
                                        })} checked={this.state.userIDChecked} />UserID</a></li>
                                        <li><a><input type='checkbox' onChange={() => this.setState({
                                          userRoleChecked: this.state.userRoleChecked === 'checked' ? ''
                                            : 'checked'
                                        })} checked={this.state.userRoleChecked} />UserRole</a></li>
                                        <li><a><input type='checkbox' onChange={() => this.setState({
                                          statusChecked: this.state.statusChecked === 'checked' ? ''
                                            : 'checked'
                                        })} checked={this.state.statusChecked} />Status</a></li>
                                        {/* <li><a><input type='checkbox' checked={this.state.actionsChecked} />Actions</a></li> */}
                                      </ul>
                                    </div>
                                  </div>
                                  <div className='col-md-7 text-right'>
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
                                  <div className='col-md-1 pl-0'>
                                    <button className='btn btn-icon btn-primary px-3 py-2' type='button' onClick={this.handleInputChange}>
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
                                        {this.state.userIDChecked ? <td className='text-muted'>{item.userAccount}</td> : null}
                                        {this.state.userRoleChecked ? <td className='text-muted'>{item.userRole}</td> : null}
                                        {this.state.statusChecked
                                          ? <td className='table-actions'>
                                            <button className='btn-sm success ml-2' style={item.userStatus === 'Active' ? { background: '#ff0000', fontWeight:'bold', color:'#fff', outline:0 }
                                              : { background: '#4da424', fontWeight:'bold', color:'#fff', outline:0 }}
                                              onClick={() => this.handleChange(item, i)} >{item.userStatus === 'Active' ? t`lanLabelADUserInactive` : t`lanLabelADUserActive`}</button>
                                          </td> : null}
                                        <td>
                                          <a onClick={() => this.handleViewUser(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanSPButtonTooltipViewUser`}>
                                            <i className='far fa-eye' />
                                          </a>
                                          <a onClick={() => this.handleEditUser(item, i)} className='table-action' data-toggle='tooltip' data-placement='top' title={t`lanSPButtonTooltipEditUser`} >
                                            <i className='fas fa-user-edit' />
                                          </a>
                                          <a onClick={() => this.handleChangeUserPassword(item)} className='fa fa-key' data-toggle='tooltip' data-placement='top' title='Change Password' />
                                          {/* <a onClick={() => this.handleDeleteUser(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanSPButtonTooltipDeleteUser`}>
                                            <i className='fas fa-trash' />
                                          </a> */}
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
                                            itemsCountPerPage={10}
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
                              : this.state.usersList.length <= 0 ? <div className='no-data'><p>{t`lanCommonLabelNoResultsFound`}</p></div> : null
                            }
                          </div>
                        </Tab>
                      </Tabs>
                      {/* <Modal
                        isOpen={this.state.modalIsOpen}
                        style={customStyles}
                       >
                        <h2 >{t`lanCommonLabelDeleteNote`}</h2>
                        <button className='btn btn-primary mr-2' onClick={this.handleSubmit}>{t`lanCommonButtonConfirm`}</button>
                        <button className='btn btn-danger' onClick={this.closeModal}>{t`lanCommonButtonCancel`}</button>
                      </Modal> */}
                      <Modal
                        isOpen={this.state.modalIsOpen}
                        style={customStyles}
                        ariaHideApp={false}
                      >
                        <div className='text-right' style={{ justifyContent: 'flex-end' }}>
                          <a onClick={this.closeModal}><span><i className='fas fa-times' /></span></a>
                        </div>
                        {/* <h2 >{t`lanCommonLabelDeleteNote`}</h2> */}
                        <div className='form-group'>
                          <label className='form-control-label'>Password Reset</label>
                          <input type={this.state.show ? 'text' : 'password'} onChange={(e) => this.handleFunction(e)} className='form-control' id='password' value={this.state.password}
                            maxLength={20} />
                          <i className={this.state.show ? 'far fa-eye' : 'far fa-eye-slash'} onClick={this.handlePasswordShowHide} style={{ position:'absolute', bottom:14, right:10, zIndex:99 }} />
                        </div>
                        <p className='errorMessage'>{this.state.errorMessage}</p>
                        <button className='btn btn-primary mr-2' onClick={this.handleSubmit}>{t`lanCommonButtonUpdate`}</button>
                        <button className='btn btn-danger' onClick={this.closeModal}>Close</button>
                      </Modal>
                      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          : this.state.isUserList === 'View' ? <ADUsersViewComponent UserView={this.state.UserView} handleViewUser={this.handleADUserViewBack} /> : this.state.isUserList === 'Edit'
          ? <ADUserEditComponent UserView={this.state.UserView} handleEditUser={this.handleADUserViewBack} usersList={this.state.usersList} /> : ''
        }
      </div>
    )
  }
}
export default ADUsersListComponent

// ADUsersListComponent.propTypes = {
//   status: PropTypes.any
//   // isUserList: PropTypes.any,
//   // handleEditUser: PropTypes.any
// }
