/* eslint-disable max-len */
import React from 'react'
import { hashHistory } from 'react-router'
import Switch from 'react-switch'
import { t } from 'ttag'
import Pagination from 'react-js-pagination'
import 'react-drawer/lib/react-drawer.css'
import { Tabs, Tab } from 'react-bootstrap-tabs'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import APICallManager from '../../../services/callmanager'
// import Modal from 'react-modal'
import config from '../../../../public/config.json'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
// import moment from 'moment'
import ADEUUsersCreateComponent from './ADEUUsersCreateComponent'
import ADEUUsersListHeaderNav from './ADEUUsersListHeaderNav'
// const customStyles = {
//   content: {
//     top: '50%',
//     left: '50%',
//     right: 'auto',
//     bottom: 'auto',
//     marginRight: '-50%',
//     transform: 'translate(-50%, -50%)'
//   }
// }

// address: "sfveef"
// alternateContactNumber: ""
// alternateEmail: ""
// area: ""
// city: ""
// country: "India"
// createdAt: 1574216446000
// createdBy: "superadmin"
// createdOn: "2019-11-20 07:50:46"
// deviceNotifyToken: ""
// displayName: "name"
// dob: ""
// dobNumber: 0
// email: "name@gmail.com"
// emailVerifyStatus: "Open"
// firstName: "name"
// isDeleted: false
// landMark: ""
// lastName: "name"
// mbnVerifyStatus: "Open"
// mobileNumber: "9874563214"
// name: "name name"
// password: "b061d66c3eaae0955f82e2a5c826c38f404655fb781a0561e04d055c05240c28d648733fef40ab09f666d59ba9b95effc991d9ea1065942cf91a1a1e47d26c14"
// passwordSalt: "75769e9f2601c214be6c13fad2735717"
// preferences: {defaultLanguage: "English", defaultTimezone: "IST - Indian Standard Time(UTC+05:30)", defaultCurrency: "INR - Indian Rupee(₹)", currencyFormat: "#,###.##", dateFormat: "MMM DD, YYYY", …}
// signupType: "Local"
// signupUserId: "75f2d971-0b6a-11ea-8e02-c35db8745ddb"
// state: ""
// updatedAt: 1574216446000
// updatedBy: "superadmin"
// updatedOn: "2019-11-20 07:50:46"
// userAccount: "191NN11362"
// userRole: "Customer"
// userStatus: "Active"
// zip: ""
// __v: 0
// _id: "75f2d970-0b6a-11ea-8e02-c35db8745ddb"

class ADEUUsersListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      activePage: 1,
      searchString: '',
      searchStatus: false,
      usersList: [],
      modalIsOpen: false,
      userDeleteData: {},
      totalCount: 0,
      nameChecked: 'checked',
      mobileNumberChecked: 'checked',
      emailChecked: 'checked',
      areaChecked: 'checked',
      cityChecked: 'checked',
      statusChecked: 'checked',
      actionsChecked: 'checked',
      handleList: false,
      userData: {}
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleEditUser = this.handleEditUser.bind(this)
    // this.handleBokkingsUser = this.handleBokkingsUser.bind(this)
    // this.closeModal = this.closeModal.bind(this)
    // this.handleConfirmDeleteUser = this.handleConfirmDeleteUser.bind(this)
    this.handleUserCreatedData = this.handleUserCreatedData.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleViewAll = this.handleViewAll.bind(this)
    this.handleRemoveSelect = this.handleRemoveSelect.bind(this)
    this.handleUsers = this.handleUsers.bind(this)
    this.handleUserMessage = this.handleUserMessage.bind(this)
    this.handleRating = this.handleRating.bind(this)
    this.handleNotifications = this.handleNotifications.bind(this)
  }
  componentWillMount () {
    let euUsersListyby = localStorage.getItem('EUListyby')
    if (euUsersListyby === 'Dashboard') {
      this.handleViewAll()
    }
  }
  componentWillUnmount () {
    localStorage.removeItem('EUListyby')
  }
  handleInputChange () {
    let searchString = this.state.searchString
    this.setState({ activePage: 1 })
    let _this = this
    let url = this.state.handleList ? config.baseUrl + config.getADEndUsersListAllAPI + '/' + '1' + '/' + searchString : config.baseUrl + config.getADEndUsersListBySearchAPI + '1' + '/' + searchString
    let getReqObj = {
      url: url
    }
    APICallManager.getCall(getReqObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          usersList: resObj.data.statusResult.userData,
          totalCount: resObj.data.statusResult.totalDocs,
          searchStatus: !!searchString
        })
      } else {
        _this.setState({
          usersList: [],
          totalCount: 0,
          searchStatus: !!searchString
        })
      }
    })
    event.preventDefault()
  }
  handlePageChange (pageNumber) {
    if (this.state.activePage !== pageNumber) {
      this.setState({ activePage: pageNumber })
      let url = this.state.handleList ? config.baseUrl + config.getADEndUsersListAllAPI + '/' + pageNumber + '/' + this.state.searchString : config.baseUrl + config.getADEndUsersListBySearchAPI + pageNumber + '/' + this.state.searchString
      let getReqObj = { url: url }
      let _this = this
      APICallManager.getCall(getReqObj, function (resObj) {
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

  handleChange (userData, i) {
    let _this = this
    // const index = userListingData.findIndex(dataObj => dataObj._id === userData._id)
    let action = {
      status : userData.userStatus === 'Active' ? 'Inactive' : 'Active'
    }
    let obj = { url: config.baseUrl + config.putADEUUserStatusActivateAPI + userData._id, body: action }
    let userListingData = this.state.usersList
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        userListingData[i].userStatus = resObj.data.statusResult.userStatus
        _this.setState({ usersList: userListingData })
      } else {
        ToastsStore.warning('status inactivation failed')
      }
    })
  }

  handleEditUser (item) {
    localStorage.setItem('euUserData', JSON.stringify(item))
    hashHistory.push('/admin/eu-user/profile')
    event.preventDefault()
  }
  handleBokkingsHotel (userData) {
    localStorage.setItem('userData', JSON.stringify(userData))
    hashHistory.push('/admin/eu/booking-history')
    event.preventDefault()
  }
  handleViewUser (userData) {
    let _this = this
    _this.setState({ userData: userData })
    event.preventDefault()
  }

  // handleBokkingsUser (userData) {
  //   this.setState({ modalIsOpen: true, userDeleteData: userData })
  // }

  // closeModal () {
  //   this.setState({ modalIsOpen: false })
  // }

  // handleConfirmDeleteUser () {
  //   this.setState({ modalIsOpen: false })
  //   let userListingData = this.state.usersList
  //   const index = userListingData.findIndex(dataObj => dataObj._id === this.state.userDeleteData._id)
  //   let userInfo = {
  //     _id: this.state.userDeleteData._id,
  //     mobileNumber: this.state.userDeleteData.mobileNumber,
  //     email: this.state.userDeleteData.email,
  //     userAccount: this.state.userDeleteData.userAccount
  //   }
  //   let _this = this
  //   let obj = { url: config.baseUrl + config.postSPUserDeleteAPI, body: userInfo }
  //   APICallManager.postCall(obj, function (resObj) {
  //     if (resObj.data.statusCode === '0000') {
  //       userListingData.splice(index, 1)
  //       _this.setState({ usersList: userListingData })
  //     }
  //   })
  // }

  handleUserCreatedData (data) {
    let userListingData = this.state.usersList
    userListingData.unshift(data)
    this.setState({ usersList: userListingData })
  }
  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleRating (userData) {
    localStorage.setItem('userData', JSON.stringify(userData))
    hashHistory.push('/admin/eu/review-rating')
    event.preventDefault()
  }
  handleUserMessage (userData) {
    localStorage.setItem('userData', JSON.stringify(userData))
    hashHistory.push('/admin/eu/inbox')
    event.preventDefault()
  }
  handleFavourites (userData) {
    localStorage.setItem('userData', JSON.stringify(userData))
    hashHistory.push('/admin/eu/favourites')
    event.preventDefault()
  }
  handleNotifications (userData) {
    localStorage.setItem('userData', JSON.stringify(userData))
    hashHistory.push('/admin/eu/notifications')
    event.preventDefault()
  }
  handleViewAll () {
    let _this = this
    _this.setState({ usersList: [], searchString : '', handleList: true, searchStatus: false })
    let getObj = {
      url: config.baseUrl + config.getADEndUsersListAllAPI + '/' + '1' + '/'
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
  handleRemoveSelect () {
    this.setState({ handleList: false, usersList: [], searchString: '', searchStatus: false, activePage: 1 })
  }
  handleUsers () {
    this.setState({ userData: {} })
  }
  handleSupport (userData) {
    localStorage.setItem('userData', JSON.stringify(userData))
    hashHistory.push('/admin/eu/support')
    event.preventDefault()
  }
  handleBookingsDashboard (userData) {
    localStorage.setItem('userData', JSON.stringify(userData))
    hashHistory.push('/admin/eu/dashboard')
    event.preventDefault()
  }
  handleEnter (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }
  handleSwitchChange () {
  }

  render () {
    return (
      <div>
        {/* ---------- Users List nav header Starts ------------- */}
        <ADEUUsersListHeaderNav handleList={this.state.usersList} handleHome={this.handleHome} userData={this.state.userData} handleUsers={this.handleUsers} />
        {/* ---------- Header Starts ------------- */}
        <div className='container-fluid mt--6 adminUserList'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='card Users'>
                {
                  this.state.userData && !this.state.userData._id
                    ? <div className='card-body'>
                      {/* tabs list */}
                      <Tabs headerclassName='tab-header-bold' activeHeaderclassName='tab-header-blue'>
                        <Tab label={t`lanSPButtonUsersList`}><div>
                          <div className='row py-lg-3'>
                            <div className='col-md-4 col-4'>
                              {!this.state.handleList
                              ? <div><h3>{t`lanADEUCommonLabelUsersListSearch`}</h3></div>
                              : <div><h3>{t`lanSPButtonUsersList`}</h3></div>
                              }
                            </div>
                            <div className='col-md-8 col-8 text-right'>
                              <div className='row'>
                                <div className='col-md-3 pr-0'>
                                  {!this.state.handleList
                                  ? <button type='button' className='btn btn-primary btn-one list-btn-custom' onClick={this.handleViewAll}>{t`lanADButtonHostsListAll`}</button>
                                  : <button type='button' className='btn btn-danger btn-one list-btn-custom' onClick={this.handleRemoveSelect}>{t`lanADButtonHostsRemoveAll`}</button>
                                  }
                                </div>
                                <div className='col-md-1 pr-0 mr-2'>
                                  <div className='button-group'>
                                    <button title='Table Filter' className='btn btn-success list-btn-custom dropdown-toggle' data-toggle='dropdown'><i className='fas fa-list' /></button>
                                    <ul className='dropdown-menu'>
                                      {/* <li><a><input type='checkbox' onChange={() => this.setState({
                                        businessChecked: this.state.businessChecked === 'checked' ? ''
                                          : 'checked'
                                      })} checked={this.state.businessChecked} />Business</a></li> */}
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
                                        areaChecked: this.state.areaChecked === 'checked' ? ''
                                          : 'checked'
                                      })} checked={this.state.areaChecked} />Area</a></li>
                                      <li><a><input type='checkbox' onChange={() => this.setState({
                                        cityChecked: this.state.cityChecked === 'checked' ? ''
                                          : 'checked'
                                      })} checked={this.state.cityChecked} />City</a></li>
                                      <li><a><input type='checkbox' onChange={() => this.setState({
                                        statusChecked: this.state.statusChecked === 'checked' ? ''
                                          : 'checked'
                                      })} checked={this.state.statusChecked} />Status</a></li>
                                      {/* <li><a><input type='checkbox' checked={this.state.actionsChecked} />Actions</a></li> */}
                                    </ul>
                                  </div>
                                </div>
                                <div className='col-md-6 text-right pr-0'>
                                  {/* -- Search form -- */}
                                  {/* <button className='btn btn-icon btn-primary col-md-1' type='button'>
                                  <span className='btn-inner--icon'><i className='ni ni-atom' /></span>
                                </button> */}
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
                                <div className='col-md-1 pl-0 text-left'>
                                  <button className='btn btn-icon btn-primary list-btn-custom-search px-3 py-2' type='button' onClick={this.handleInputChange}>
                                    <span className='btn-inner--icon'><i className='fa fa-search' /></span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='table-responsive'>
                            <table className='table align-items-center table-flush table-striped'>
                              <thead className='thead-light'>
                                <tr>
                                  {/* {this.state.businessChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelBusiness`}</th> : null} */}
                                  {this.state.nameChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelName`}</th> : null}
                                  {this.state.mobileNumberChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelMobileNumber`}</th> : null}
                                  {this.state.emailChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelEmail`}</th> : null}
                                  {this.state.areaChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelArea`}</th> : null}
                                  {this.state.cityChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelCity`}</th> : null}
                                  {this.state.statusChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelStatus`}</th> : null}
                                  <th>{t`lanCommonLabelActions`}</th>
                                </tr>
                              </thead>
                              {/* <tbody> */}
                              {this.state.usersList.length > 0
                                ? <tbody>
                                  {this.state.usersList.map((item, i) =>
                                    <tr key={i}>
                                      {/* {this.state.businessChecked ? <td className='text-muted'>{item.serviceProvider}</td> : null} */}
                                      {this.state.nameChecked ? <td className='text-muted'>{item.name}</td> : null}
                                      {this.state.mobileNumberChecked ? <td className='text-muted'>{item.mobileNumber}</td> : null}
                                      {this.state.emailChecked ? <td className='text-muted'>{item.email}</td> : null}
                                      {this.state.areaChecked ? <td className='text-muted'>{item.area}</td> : null}
                                      {this.state.cityChecked ? <td className='text-muted'>{item.city}</td> : null}
                                      {this.state.statusChecked ? <td className='table-actions'>{item.userStatus}</td> : null}
                                      <td>
                                        <a onClick={() => this.handleViewUser(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanSPButtonTooltipViewUser`}>
                                          <i className='far fa-eye' />
                                        </a>
                                        <a onClick={() => this.handleEditUser(item)} className='table-action' data-toggle='tooltip' data-placement='top' title={t`lanSPButtonTooltipEditUser`} >
                                          <i className='fas fa-user-edit' />
                                        </a>
                                        <a onClick={() => this.handleUserMessage(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanADEULabelButtonUserMessage`}>
                                          <i className='fa fa-envelope' />
                                        </a>
                                        {/* <a onClick={() => this.handleBokkingsUser(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanADEULabelButtonUserBooking`}>
                                          <i className='fas fa-trash ' />
                                        </a> */}
                                        <a onClick={() => this.handleFavourites(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title='UserFavourites'>
                                          <i className='fas fa-heart' />
                                        </a>
                                        <a onClick={() => this.handleBokkingsHotel(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanADEULabelButtonUserBooking`}>
                                          <i className='fas fa-hotel' />
                                        </a>
                                        <a onClick={() => this.handleBookingsDashboard(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanADEULabelButtonUserBooking`}>
                                          <i className='fas fa-chart-pie' />
                                        </a>
                                        <a onClick={() => this.handleRating(item)} className='table-action table-action-view' data-toggle='tooltip' data-placement='top'
                                          title={t`lanSPLabelRating`}>
                                          <i className='far fa-star' />
                                        </a>
                                        <a onClick={() => this.handleNotifications(item)} className='table-action table-action-view' data-toggle='tooltip' data-placement='top' title={'Notifications'}>
                                          <i className='fas fa-bell' />
                                        </a>
                                        <a onClick={() => this.handleSupport(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title='Support'>
                                          <i className='ni ni-headphones text-info' />
                                        </a>
                                        <button className='btn-sm success text-white' style={item.userStatus === 'Active' ? { background: '#ef543b' } : { background: '#4da424' }}
                                          onClick={() => this.handleChange(item, i)} >{item.userStatus === 'Active' ? 'Inactive' : 'Active'}</button>

                                      </td>
                                    </tr>
                                    )}
                                </tbody>
                                : (!this.state.handleList
                                    ? (!this.state.searchStatus ? <tbody><tr className='no-data'><td colSpan='7'>{t`lanADEndUsersCommonLabelSearchResults`}</td></tr></tbody> : <tbody><tr className='no-data'><td>{t`lanADHostsCommonLabelNoSearchResultFound`}</td></tr></tbody>)
                                    : (!this.state.searchStatus ? <tbody><tr className='no-data'><td colSpan='7'>{t`lanCommonLabelNoResultsFound`}</td></tr></tbody> : <tbody><tr className='no-data'><td>{t`lanADHostsCommonLabelNoSearchResultFound`}</td></tr></tbody>)
                                )
                              }
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
                        </div>
                        </Tab>
                        <Tab label={t`lanSPButtonCreateUser`}>
                          <ADEUUsersCreateComponent handleUserCreatedData={this.handleUserCreatedData} />
                        </Tab>
                      </Tabs>
                      {/* <Modal
                        isOpen={this.state.modalIsOpen}
                        style={customStyles}
                      >
                        <h2 >{t`lanADButtonTooltipLabelHostsDeleteHost`}</h2>
                        <button className='btn btn-primary mr-2' onClick={this.handleConfirmDeleteUser}>{t`lanCommonButtonConfirm`}</button>
                        <button className='btn btn-danger' onClick={this.closeModal}>{t`lanCommonButtonCancel`}</button>
                      </Modal> */}
                    </div>
                    : <div className='card border-0 mb-0 admin-userList'>
                      <div className='card-header bg-transparent pb-3'>
                        <h5 className='card-title'>{t`lanSPLabelUserDetails`}</h5>
                      </div>
                      <div className='card-body px-lg-4 py-lg-4'>
                        {/* List group */}
                        <ul className='list-group list-group-flush list my--3'>
                          <li className='list-group-item px-0'>
                            <div className='row align-items-center'>
                              <div className='col-md-2 col-6'>
                                <small className='view-title'>{t`lanCommonLabelFirstName`}:</small>
                                <h5 className='mb-0 font-16'>{this.state.userData.firstName}</h5>
                              </div>
                              <div className='col-md-2 col-6'>
                                <small className='view-title'>{t`lanCommonLabelLastName`}:</small>
                                <h5 className='mb-0 font-16'>{this.state.userData && this.state.userData.lastName ? this.state.userData.lastName : '-' }</h5>
                              </div>
                              <div className='col-md-2 col-6'>
                                <small className='view-title'>{t`lanCommonLabelDisplayName`}:</small>
                                <h5 className='mb-0 font-16'>{(this.state.userData && this.state.userData.name) ? this.state.userData.name : '-'}</h5>
                              </div>
                              <div className='col-md-2 col-6'>
                                <small className='view-title'>{t`lanCommonLabelMobileNumber`}:</small>
                                <h5 className='mb-0 font-16'>{this.state.userData.mobileNumber}</h5>
                              </div>
                              <div className='col-md-3 col-6l'>
                                <small className='view-title'>{t`lanCommonLabelEmail`}:</small>
                                <h5 className='mb-0 font-16'>{this.state.userData.email}</h5>
                              </div>
                            </div>
                          </li>
                          <li className='list-group-item px-0'>
                            <div className='row align-items-center'>
                              <div className='col-md-3 col-6l'>
                                <small className='view-title'>{t`lanCommonLabelDateOfBirth`}:</small>
                                <h5 className='mb-0'>{this.state.userData && this.state.userData.dob ? this.state.userData.dob : '-' }</h5>
                              </div>
                              <div className='col-md-3 col-6l'>
                                <small className='view-title'>{t`lanCommonLabelUserID`}:</small>
                                <h5 className='mb-0'>{this.state.userData.userAccount}</h5>
                              </div>
                              <div className='col-md-3 col-6l'>
                                <small className='view-title'>{t`lanCommonLabelStatus`}:</small>
                                <h5 className='mb-0'>
                                  <Switch
                                    className='react-switch'
                                    onChange={this.handleSwitchChange}
                                    checked={this.state.userData.userStatus === 'Active'}
                                    aria-labelledby='neat-label'
                                    disabled />
                                </h5>
                              </div>
                            </div>
                          </li>
                          <li className='list-group-item px-0'>
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
                                        <div className='col-md-3 col-6'>
                                          <small className='view-title'>{t`lanCommonLabelLandmark`}:</small>
                                          <h5 className='mb-0'>{(this.state.userData && this.state.userData.landMark) ? this.state.userData.landMark : '-'}</h5>
                                        </div>
                                        <div className='col-md-3 col-6'>
                                          <small className='view-title'>{t`lanCommonLabelCity`}:</small>
                                          <h5 className='mb-0'>{(this.state.userData && this.state.userData.city) ? this.state.userData.city : '-'}</h5>
                                        </div>
                                        <div className='col-md-3 col-6'>
                                          <small className='view-title'>{t`lanCommonLabelState`}:</small>
                                          <h5 className='mb-0'>{(this.state.userData && this.state.userData.state) ? this.state.userData.state : '-'}</h5>
                                        </div>
                                      </div>
                                    </li>
                                    <li className='list-group-item px-0'>
                                      <div className='row align-items-center'>
                                        <div className='col-md-3 col-6'>
                                          <small className='view-title'>{t`lanCommonLabelZip`}:</small>
                                          <h5 className='mb-0'>{(this.state.userData && this.state.userData.zip) ? this.state.userData.zip : '-'}</h5>
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
                          <li className='list-group-item px-0'>
                            <div className='px-lg-4 py-lg-4 text-center'>
                              <button className='btn btn-danger' onClick={this.handleUsers}>{t`lanCommonButtonBack`}</button>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                }
              </div>
            </div>
          </div>
        </div>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}

export default ADEUUsersListComponent
