/* eslint-disable max-len */
import React from 'react'
import { hashHistory } from 'react-router'
import Switch from 'react-switch'
import { t } from 'ttag'
import Pagination from 'react-js-pagination'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import 'react-drawer/lib/react-drawer.css'
import { Tabs, Tab } from 'react-bootstrap-tabs'
import APICallManager from '../../../services/callmanager'
// import Modal from 'react-modal'
import config from '../../../../public/config.json'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
// import moment from 'moment'
import ADHostsCreateHostComponent from './ADHostsCreateHostComponent'
import ADHostsListHeaderNav from './ADHostsListHeaderNav'
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
class ADListBySearchComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      activePage: 1,
      searchString: '',
      searchStatus: false,
      hostsList: [],
      modalIsOpen: false,
      userDeleteData: {},
      totalCount: 0,
      nameChecked: 'checked',
      mobileNumberChecked: 'checked',
      emailChecked: 'checked',
      businessChecked: 'checked',
      areaChecked: 'checked',
      cityChecked: 'checked',
      statusChecked: 'checked',
      actionsChecked: 'checked',
      handleList: false,
      hostData: {},
      hostStatus: localStorage.getItem('hostStatus'),
      hostslistby:localStorage.getItem('hostslistby')
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleEditUser = this.handleEditUser.bind(this)
    this.handleDeleteUser = this.handleDeleteUser.bind(this)
    this.closeModal = this.closeModal.bind(this)
    // this.handleConfirmDeleteUser = this.handleConfirmDeleteUser.bind(this)
    this.handleUserCreatedData = this.handleUserCreatedData.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleViewAll = this.handleViewAll.bind(this)
    this.handleRemoveSelect = this.handleRemoveSelect.bind(this)
    this.handleHosts = this.handleHosts.bind(this)
    this.handleHostUsers = this.handleHostUsers.bind(this)
    this.handleHostMessage = this.handleHostMessage.bind(this)
    this.handleHostProperty = this.handleHostProperty.bind(this)
    this.handleHostAnalytics = this.handleHostAnalytics.bind(this)
    this.handleRating = this.handleRating.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleNotifications = this.handleNotifications.bind(this)
  }

  componentWillMount () {
    if (this.state.hostStatus) {
      this.setState({ handleList:true,
        searchStatus:false })
      let getObj = {
        url: config.baseUrl + config.getADHostsListByStatusAPI + '1' + '/' + this.state.hostStatus + '/'
      }
      this.handleAPIByStatus(getObj)
    } else if (this.state.hostslistby === 'Dashboard') {
      this.setState({ handleList:true,
        searchStatus:false })
      let getObj = {
        url: config.baseUrl + config.getADHostsListAPI + '/' + '1' + '/'
      }
      this.handleAPIByStatus(getObj)
    }
  }
  componentWillUnmount () {
    localStorage.removeItem('propertiesBy')
    localStorage.removeItem('messagesBy')
    localStorage.removeItem('hostslistby')
    localStorage.removeItem('hostStatus')
  }
  handleInputChange () {
    let searchString = this.state.searchString
    this.setState({ activePage: 1 })
    if (this.state.hostStatus) {
      this.setState({ hostsList: [], searchString : '', handleList: true, searchStatus: false })
      let getObj = {
        url: config.baseUrl + config.getADHostsListByStatusAPI + '1' + '/' + this.state.hostStatus + '/' + searchString
      }
      let _this = this
      APICallManager.getCall(getObj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({
            hostsList: resObj.data.statusResult.userData,
            totalCount: resObj.data.statusResult.totalDocs,
            searchStatus: !!searchString
          })
        } else {
          _this.setState({
            hostsList: [],
            totalCount: 0,
            searchStatus: !!searchString
          })
        }
      })
    } else {
      let _this = this
      let url = this.state.handleList ? config.baseUrl + config.getADHostsListAPI + '/' + '1' + '/' + searchString : config.baseUrl + config.getADHostsListBySearchAPI + '1' + '/' + searchString
      let getReqObj = {
        url: url
      }
      APICallManager.getCall(getReqObj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({
            hostsList: resObj.data.statusResult.userData,
            totalCount: resObj.data.statusResult.totalDocs,
            searchStatus: !!searchString
          })
        } else {
          _this.setState({
            hostsList: [],
            totalCount: 0,
            searchStatus: !!searchString
          })
        }
      })
    }
    event.preventDefault()
  }
  handlePageChange (pageNumber) {
    if (this.state.activePage !== pageNumber) {
      this.setState({ activePage: pageNumber })
      if (this.state.hostStatus) {
        this.setState({ hostsList: [], searchString : '', handleList: true, searchStatus: false })
        let getObj = {
          url: config.baseUrl + config.getADHostsListByStatusAPI + pageNumber + '/' + this.state.hostStatus + '/'
        }
        let _this = this
        APICallManager.getCall(getObj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            _this.setState({
              hostsList: resObj.data.statusResult.userData,
              totalCount: resObj.data.statusResult.totalDocs
            })
          } else {
            _this.setState({
              hostsList: [],
              totalCount: 0
            })
          }
        })
      } else {
        let url = this.state.handleList ? config.baseUrl + config.getADHostsListAPI + '/' + pageNumber + '/' + this.state.searchString : config.baseUrl + config.getADHostsListBySearchAPI + pageNumber + '/' + this.state.searchString
        let getReqObj = { url: url }
        let _this = this
        APICallManager.getCall(getReqObj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            _this.setState({
              hostsList: resObj.data.statusResult.userData,
              totalCount: resObj.data.statusResult.totalDocs
            })
          } else {
            _this.setState({
              hostsList: [],
              totalCount: 0
            })
          }
        })
      }
    }
  }

  handleChange (item, i) {
    let _this = this
    let statusChange = item.status === 'Active' ? 'Inactive' : 'Active'
    let userListingData = this.state.hostsList
    let obj = { url: config.baseUrl + config.putADHostsHostStatusAPI + item._id + '/' + statusChange }
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        userListingData[i].status = resObj.data.statusResult.status
        _this.setState({ hostsList: userListingData })
      } else {
        ToastsStore.warning('status inactivation failed')
      }
    })
  }

  handleSupport (hostData) {
    localStorage.setItem('hostData', JSON.stringify(hostData))
    hashHistory.push('/admin/hosts/support')
    event.preventDefault()
  }
  handleEditUser (hostData) {
    localStorage.setItem('hostData', JSON.stringify(hostData))
    hashHistory.push('/admin/host/edit')
    event.preventDefault()
  }

  handleLocationList (hostData) {
    localStorage.setItem('hostData', JSON.stringify(hostData))
    hashHistory.push('admin/host/location-list')
    event.preventDefault()
  }
  handleRating (item) {
    localStorage.setItem('hostData', JSON.stringify(item))
    hashHistory.push('/admin/hosts/review-ratings')
    event.preventDefault()
  }
  handleNotifications (item) {
    localStorage.setItem('hostData', JSON.stringify(item))
    hashHistory.push('/admin/hosts/notifications')
    event.preventDefault()
  }

  handleViewUser (userData) {
    let _this = this
    _this.setState({ hostData: userData })
    event.preventDefault()
  }

  handleDeleteUser (userData) {
    this.setState({ modalIsOpen: true, userDeleteData: userData })
  }

  closeModal () {
    this.setState({ modalIsOpen: false })
  }
  handleEnter (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }

  // handleConfirmDeleteUser () {
  //   this.setState({ modalIsOpen: false })
  //   let userListingData = this.state.hostsList
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
  //       _this.setState({ hostsList: userListingData })
  //     }
  //   })
  // }

  handleUserCreatedData (data) {
    let userListingData = this.state.hostsList
    userListingData.unshift(data)
    this.setState({ hostsList: userListingData })
  }
  handleHome () {
    localStorage.removeItem('hostData')
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleHostUsers (item) {
    localStorage.setItem('hostData', JSON.stringify(item))
    hashHistory.push('/admin/host-users')
    event.preventDefault()
  }
  handleHostMessage (hostData) {
    localStorage.removeItem('messagesBy')
    localStorage.setItem('hostData', JSON.stringify(hostData))
    hashHistory.push('/admin/host-inbox')
  }
  handleViewAll () {
    if (this.state.hostStatus) {
      this.setState({ hostsList: [], searchString : '', handleList: true, searchStatus: false })
      let getObj = {
        url: config.baseUrl + config.getADHostsListByStatusAPI + '1' + '/' + this.state.hostStatus + '/'
      }
      this.handleAPIByStatus(getObj)
    } else {
      this.setState({ hostsList: [], searchString : '', handleList: true, searchStatus: false })
      let getObj = {
        url: config.baseUrl + config.getADHostsListAPI + '/' + '1' + '/'
      }
      this.handleAPIByStatus(getObj)
    }
  };
  handleAPIByStatus (getObj) {
    let _this = this
    APICallManager.getCall(getObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          hostsList: resObj.data.statusResult.userData,
          totalCount: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({
          hostsList: [],
          totalCount: 0
        })
      }
    })
  }

  handleRemoveSelect () {
    this.setState({ handleList: false, hostsList: [], searchString: '', searchStatus: false, activePage: 1 })
  }
  handleHosts () {
    this.setState({ hostData: {} })
  }
  handleHostProperty (item) {
    localStorage.removeItem('propertiesBy')
    localStorage.removeItem('hostStatus')
    localStorage.setItem('hostData', JSON.stringify(item))
    localStorage.setItem('PropertiesShow', 'List')
    hashHistory.push('/admin/host/properties')
  }
  handleHostAnalytics (item) {
    localStorage.setItem('hostData', JSON.stringify(item))
    hashHistory.push('admin/host-dashboard')
  }

  render () {
    return (
      <div>
        {/* ---------- Hosts List nav header Starts ------------- */}
        <ADHostsListHeaderNav handleList={this.state.hostsList} handleHome={this.handleHome} hostData={this.state.hostData} handleHosts={this.handleHosts} />
        {/* ---------- Header Starts ------------- */}
        <div className='container-fluid mt--6'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='card Users'>
                {
                  this.state.hostData && !this.state.hostData._id
                    ? <div className='card-body'>
                      {/* tabs list */}
                      <Tabs headerclassName='tab-header-bold' activeHeaderclassName='tab-header-blue'>
                        <Tab label={t`lanADButtonHostsHostsList`}><div>
                          <div className='row py-lg-3'>
                            <div className='col-md-6 col-6'>
                              {
                                    !this.state.handleList
                                      ? <div><h3>{t`lanADHostsCommonLabelHostsListSearch`}</h3></div>
                                      : <div><h3>{t`lanADButtonHostsHostsList`}</h3></div>
                            }
                              {/* <div><h3>{t`lanADButtonHostsHostsList`}</h3></div> */}
                            </div>
                            <div className='col-md-6 col-6 text-right'>
                              <div className='row'>
                                <div className='col-md-3'>
                                  {
                                    !this.state.handleList
                                      ? <button type='button' className='btn btn-primary btn-one' onClick={this.handleViewAll}>{t`lanADButtonHostsListAll`}</button>
                                      : <button type='button' className='btn btn-danger btn-one' onClick={this.handleRemoveSelect}>{t`lanADButtonHostsRemoveAll`}</button>
                                  }
                                </div>
                                <div className='col-md-2'>
                                  <div className='button-group'>
                                    <button title='Table Filter' className='btn btn-success dropdown-toggle' data-toggle='dropdown'><i className='fas fa-list' /></button>
                                    <ul className='dropdown-menu'>
                                      <li><a><input type='checkbox' onChange={() => this.setState({
                                        businessChecked: this.state.businessChecked === 'checked' ? ''
                                          : 'checked'
                                      })} checked={this.state.businessChecked} />{t`lanCommonLabelBusiness`}</a></li>
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
                                        areaChecked: this.state.areaChecked === 'checked' ? ''
                                          : 'checked'
                                      })} checked={this.state.areaChecked} />{t`lanCommonLabelArea`}</a></li>
                                      <li><a><input type='checkbox' onChange={() => this.setState({
                                        cityChecked: this.state.cityChecked === 'checked' ? ''
                                          : 'checked'
                                      })} checked={this.state.cityChecked} />{t`lanCommonLabelCity`}</a></li>
                                      <li><a><input type='checkbox' onChange={() => this.setState({
                                        statusChecked: this.state.statusChecked === 'checked' ? ''
                                          : 'checked'
                                      })} checked={this.state.statusChecked} />{t`lanCommonLabelStatus`}</a></li>
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
                                <div className='col-md-1 pl-0'>
                                  <button className='btn btn-icon btn-primary search-btn-admin px-3 py-2' type='button' onClick={this.handleInputChange}>
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
                                  {this.state.businessChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelBusiness`}</th> : null}
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
                              {this.state.hostsList.length > 0
                                ? <tbody>
                                  {this.state.hostsList.map((item, i) =>
                                    <tr key={i}>
                                      {this.state.businessChecked ? <td >{item.serviceProvider}</td> : null}
                                      {this.state.nameChecked ? <td >{item.contactPerson}</td> : null}
                                      {this.state.mobileNumberChecked ? <td >{item.contactNumber}</td> : null}
                                      {this.state.emailChecked ? <td >{item.contactEmail}</td> : null}
                                      {this.state.areaChecked ? <td >{item.area}</td> : null}
                                      {this.state.cityChecked ? <td >{item.city}</td> : null}
                                      {this.state.statusChecked
                                        ? <td className='table-actions'>
                                          {item.status}
                                        </td> : null}
                                      <td>
                                        <a onClick={() => this.handleViewUser(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanADButtonTooltipLabelHostsViewHost`}>
                                          <i className='far fa-eye' />
                                        </a>
                                        <a onClick={() => this.handleEditUser(item)} className='table-action' data-toggle='tooltip' data-placement='top' title={t`lanADButtonTooltipLabelHostsEditHost`} >
                                          <i className='fas fa-user-edit' />
                                        </a>
                                        <a onClick={() => this.handleHostUsers(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanADButtonTooltipLabelHostsHostUsers`}>
                                          <i className='fa fa-users' />
                                        </a>
                                        <a onClick={() => this.handleHostMessage(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanADButtonTooltipLabelHostsHostMessage`}>
                                          <i className='fa fa-envelope' />
                                        </a>
                                        <a onClick={() => this.handleHostProperty(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanADButtonTooltipLabelHostsHostProperties`}>
                                          <i className='fas fa-building' />
                                        </a>
                                        {/* <a onClick={() => this.handleDeleteUser(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanADButtonTooltipLabelHostsDeleteHost`}>
                                          <i className='fas fa-trash' />
                                        </a> */}
                                        <a onClick={() => this.handleLocationList(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanADButtonTooltipLabelHostsLocationList`}>
                                          <i className='fas fa-map-marked-alt' />
                                        </a>
                                        <a onClick={() => this.handleHostAnalytics(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanADLabelDashboardHostDashboard`}>
                                          <i className='fas fa-chart-pie' />
                                        </a>
                                        <a onClick={() => this.handleRating(item)} className='table-action table-action-view' data-toggle='tooltip' data-placement='top' title={t`lanSPLabelRating`}>
                                          <i className='far fa-star' />
                                        </a>
                                        <a onClick={() => this.handleNotifications(item)} className='table-action table-action-view' data-toggle='tooltip' data-placement='top' title={'Notifications'}>
                                          <i className='fas fa-bell ' />
                                        </a>
                                        <a onClick={() => this.handleSupport(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title='Support'>
                                          <i className='ni ni-headphones text-info' />
                                        </a>
                                        <button className='btn-sm success text-white' style={item.status === 'Active' ? { background: '#ef543b' } : { background: '#4da424' }}
                                          onClick={() => this.handleChange(item, i)} >{item.status === 'Active' ? 'Inactive' : 'Active'}</button>
                                      </td>
                                    </tr>
                                    )}
                                </tbody>
                                : (!this.state.handleList
                                    ? (!this.state.searchStatus ? <tbody><tr className='no-data'><td colSpan='8'>{t`lanADHostsCommonLabelSearchResults`}</td></tr></tbody> : <tbody><tr className='no-data'><td colSpan='8'>{t`lanADHostsCommonLabelNoSearchResultFound`}</td></tr></tbody>)
                                    : (!this.state.searchStatus ? <tbody><tr className='no-data'><td colSpan='8'>{t`lanCommonLabelNoResultsFound`}</td></tr></tbody> : <tbody><tr className='no-data'><td colSpan='8'>{t`lanADHostsCommonLabelNoSearchResultFound`}</td></tr></tbody>)
                                )
                              }
                              <tfoot>
                                {this.state.hostsList && this.state.hostsList.length > 0
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
                        <Tab label={t`lanADButtonHostsCreateHost`}>
                          <ADHostsCreateHostComponent handleUserCreatedData={this.handleUserCreatedData} />
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
                    : <div className='card border-0 mb-0'>
                      <div className='card-header bg-transparent pb-3'>
                        <h5 className='card-title'>{t`lanADTitleHostsHostView`}</h5>
                      </div>
                      <div className='card-body px-lg-4 py-lg-4'>
                        {/* List group */}
                        <ul className='list-group list-group-flush list my--3'>
                          <li className='list-group-item px-0'>
                            <div className='row align-items-center'>
                              <div className='col-md-3 col-sm-3 col-6'>
                                <small className='view-title'>{t`lanADCommonLabelBusinessName`}:</small>
                                <h5 className='mb-0'>{this.state.hostData.serviceProvider}</h5>
                              </div>
                              <div className='col-md-3 col-sm-3 col-6'>
                                <small className='view-title'>{t`lanCommonLabelContactPerson`}:</small>
                                <h5 className='mb-0'>{(this.state.hostData && this.state.hostData.contactPerson) ? this.state.hostData.contactPerson : '-'}</h5>
                              </div>
                              <div className='col-md-3 col-sm-3 col-6'>
                                <small className='view-title'>{t`lanCommonLabelMobileNumber`}:</small>
                                <h5 className='mb-0'>{this.state.hostData.contactNumber}</h5>
                              </div>
                              <div className='col-md-3 col-sm-3 col-6l'>
                                <small className='view-title'>{t`lanCommonLabelEmail`}:</small>
                                <h5 className='mb-0'>{this.state.hostData.contactEmail}</h5>
                              </div>
                            </div>
                          </li>
                          <li className='list-group-item px-0'>
                            <div className='col pl-0'>
                              <small className='view-title'>{t`lanCommonLabelStatus`}:</small>
                              <h5 className='mb-0'>
                                <Switch
                                  className='react-switch'
                                  onChange={this.handleChange}
                                  checked={this.state.hostData.status === 'Active'}
                                  aria-labelledby='neat-label'
                                  disabled />
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
                                          <h5 className='mb-0'>{(this.state.hostData && this.state.hostData.area) ? this.state.hostData.area : '-'}</h5>
                                        </div>
                                        <div className='col-md-3 col-6'>
                                          <small className='view-title'>{t`lanCommonLabelLandmark`}:</small>
                                          <h5 className='mb-0'>{(this.state.hostData && this.state.hostData.landmark) ? this.state.hostData.landmark : '-'}</h5>
                                        </div>
                                        <div className='col-md-3 col-6'>
                                          <small className='view-title'>{t`lanCommonLabelCity`}:</small>
                                          <h5 className='mb-0'>{(this.state.hostData && this.state.hostData.city) ? this.state.hostData.city : '-'}</h5>
                                        </div>
                                        <div className='col-md-3 col-6'>
                                          <small className='view-title'>{t`lanCommonLabelState`}:</small>
                                          <h5 className='mb-0'>{(this.state.hostData && this.state.hostData.state) ? this.state.hostData.state : '-'}</h5>
                                        </div>
                                      </div>
                                    </li>
                                    <li className='list-group-item px-0'>
                                      <div className='row align-items-center'>
                                        <div className='col-md-3 col-6'>
                                          <small className='view-title'>{t`lanCommonLabelZip`}:</small>
                                          <h5 className='mb-0'>{(this.state.hostData && this.state.hostData.zip) ? this.state.hostData.zip : '-'}</h5>
                                        </div>
                                        {/* <div className='col-md-3 col-6'>
                                          <small className='view-title'>{t`lanCommonLabelCountry`}:</small>
                                          <h5 className='mb-0'>{(this.state.hostData && this.state.hostData.country) ? this.state.hostData.country : '-'}</h5>
                                        </div> */}
                                        <div className='col-md-3 col-6'>
                                          <small className='view-title'>{t`lanCommonLabelAddress`}:</small>
                                          <h5 className='mb-0'>{(this.state.hostData && this.state.hostData.contactAddress) ? this.state.hostData.contactAddress : '-'}</h5>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className='px-lg-4 py-lg-4 text-center'>
                                <button className='btn btn-danger' onClick={this.handleHosts}>{t`lanCommonButtonBack`}</button>
                              </div>
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

export default ADListBySearchComponent
