/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import Pagination from 'react-js-pagination'
import moment from 'moment'
import { t } from 'ttag'
import { hashHistory } from 'react-router'

import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import Modal from 'react-modal'
import ADEUNotificationsListViewComponent from './ADEUNotificationsListViewComponent'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

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

class ADEUNotificationsListComponent extends React.Component {
  constructor (props) {
    let userData = JSON.parse(localStorage.getItem('userData'))
    super(props)
    this.state = {
      userData: JSON.parse(localStorage.getItem('userData')),
      notificationList: [],
      isShowNotification: 'List',
      euUserId: userData._id,
      activePage: 1,
      notificationData: {},
      searchString: '',
      matchesData: false,
      reload: false
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleStatus = this.handleStatus.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleConfirmDeleteNotification = this.handleConfirmDeleteNotification.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleViewUser = this.handleViewUser.bind(this)
    this.handleViewNotificationBack = this.handleViewNotificationBack.bind(this)
    this.handleNotifications = this.handleNotifications.bind(this)
    this.handleEUUsers = this.handleEUUsers.bind(this)
  }
  componentWillMount () {
    let obj = { url: config.baseUrl + config.getADEUHostNotificationsAPI + this.state.userData._id + '/' + this.state.activePage + '/' }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          notificationList: resObj.data.statusResult.notificationsData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          notificationList: [], matchesData: false
        })
      }
    })
  }
  handleInputChange (event) {
    let search = this.state.searchString
    this.setState({ searchString: search, activePage: 1 })
    let obj = { url: config.baseUrl + config.getADEUHostNotificationsAPI + this.state.userData._id + '/' + 1 + '/' + this.state.searchString }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          notificationList: resObj.data.statusResult.notificationsData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          notificationList: [], totalCount: 0, matchesData: false
        })
      }
    })
  }
  handlePageChange (pageNumber) {
    if (this.state.activePage !== pageNumber) {
      this.setState({ activePage: pageNumber })
      let _this = this
      let obj = { url: config.baseUrl + config.getADEUHostNotificationsAPI + this.state.userData._id + '/' + pageNumber + '/' + this.state.searchString }
      APICallManager.getCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ notificationList: resObj.data.statusResult.notificationsData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false })
        } else {
          _this.setState({ notificationList: [], totalCount: 0, matchesData: false })
        }
      })
    }
  }
  handleStatus (item) {
    let _this = this
    let putNotificationData = {
      status: item.status === 'Read' ? 'Unread' : 'Read'
    }
    let obj = { url: config.baseUrl + config.putADEUHostNotificationsListAPI + item._id, body: putNotificationData }
    let notifications = this.state.notificationList
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        const i = notifications.indexOf(item)
        notifications[i].status = resObj.data.statusResult.status
        _this.setState({
          notificationList: notifications
        })
      } else {
        ToastsStore.error(t`lanEULabelErrorNotificationUnreadFailed`)
      }
    })
  }
  handleDelete (item) {
    this.setState({ modalIsOpen: true, notificationData: item })
  }

  handleConfirmDeleteNotification () {
    let notificationList = this.state.notificationList
    let obj = {
      url: config.baseUrl + config.deleteADEUHostNotificationsAPI + this.state.notificationData._id
    }
    let index = notificationList.findIndex(i => i._id === this.state.notificationData._id)
    let _this = this
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        notificationList.splice(index, 1)
        _this.setState({ modalIsOpen: false })
      } else {
        ToastsStore.error(t`lanEULabelErrorNotificationDeleteFailed`)
        // _this.setState({ errorNotification: 'Notification Delete Failed' })
      }
    })
  }
  componentDidMount () {
    window.onhashchange = () => {
      event.preventDefault()
    }
  }

  closeModal () {
    this.setState({ modalIsOpen: false })
  }
  handleHome (event) {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleViewUser (item) {
    this.setState({
      isShowNotification: 'View',
      notificationData: item
    })
    event.preventDefault()
  }
  handleViewNotificationBack () {
    this.setState({
      isShowNotification: 'List'
    })
  }
  handleNotifications () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleEUUsers () {
    localStorage.setItem('menuItem', 'EUUsers')
    hashHistory.push('admin/eu-users')
  }
  handleEnter (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }

  render () {
    return (
      <div>
        {this.state.isShowNotification === 'List'
          ? <div>
            {/* ------- Navbar --------- */}
            <div className='header bg-primary pb-6'>
              <div className='container-fluid'>
                <div className='header-body'>
                  <div className='row align-items-center pt-4 pb-4'>
                    <div className='col-lg-6 col-7'>
                      {/* <h6 className='h2 text-white d-inline-block mb-0'>EndUsers-List</h6> */}
                      <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                        <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                          <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                          <li className='breadcrumb-item active eu-font'><a onClick={this.handleEUUsers}>{t`lanEndUsersTitleList`}</a></li>
                          <li className='breadcrumb-item active eu-font'> Notifications List </li>
                          {/* <li className='breadcrumb-item active eu-font'>Notifications List</li> */}
                        </ol>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='container mt--6 pb-4'>
              <div className='row justify-content-center notifictions'>
                <div className='col-lg-12 card-wrapper'>
                  <div className='card mb-2'>
                    <div className='card-header py-2'>
                      <div className='row'>
                        <div className='col-sm-7'>
                          <h6 className='h2 text-primary d-inline-block pt-2'>{t`lanEUTitleNotifications`}</h6>
                        </div>
                        <div className='col-sm-4 pr-0'>
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
                        <div className='col-sm-1 pl-0'>
                          <button className='btn btn-icon btn-primary search-btn-admin px-3 py-2' type='button' onClick={this.handleInputChange}>
                            <span className='btn-inner--icon'><i className='fa fa-search' /></span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='card-body'>
                      <section className='notifications'>
                        <div className='row clearfix'>
                          <div className='col-md-12 col-lg-12 col-xl-12'>
                            {/* List group */}
                            {this.state.notificationList && this.state.notificationList.length > 0
                              ? this.state.notificationList.map((item, i) =>
                                <div className='row align-items-center bottom-line py-1' key={i}>
                                  <div className='col-sm-9'>
                                    {/* <a onClick={() => this.handleRedirect(item)}> */}
                                    <div className='row align-items-center py-1 list-group-item-action'>
                                      <div className='col-sm-2 col-1'>
                                        {/* Avatar */}
                                        <img src={require('../../../../assets/rm1.jpg')} className='avatar rounded-circle' />
                                      </div>
                                      <div className='col-12 col-sm-8'>
                                        <div className='d-flex justify-content-between align-items-center'>
                                          <div>
                                            <h5 className={item.status === 'Unread' ? 'mb-0 text-sm font-weight-bold' : 'mb-0 text-sm'}>{item.notificationTitle}</h5>
                                          </div>
                                        </div>
                                        <p className={item.status === 'Unread' ? 'text-sm mb-0 eu-font font-weight-bold' : 'text-sm mb-0 eu-font'}>{item.notificationMessage}</p>
                                      </div>
                                      <div className='col-sm-2'>
                                        <div className='text-center text-muted'>
                                          <small>{moment(item.createdAt).format('MMM DD YYYY')}</small>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='col-sm-1'>
                                    <a onClick={() => this.handleViewUser(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanSPButtonTooltipViewUser`}>
                                      <i className='far fa-eye' />
                                    </a>
                                  </div>
                                  <div className='col-sm-2'>
                                    <a onClick={() => this.handleDelete(item)} className='table-action table-action-delete pr-3' title='Delete' >
                                      <i className='fas fa-trash' />
                                    </a>
                                    <button className='btn-sm success text-white' style={item.status === 'Read' ? { background: '#ef543b' } : { background: '#4da424' }}
                                      onClick={() => this.handleStatus(item)} >{item.status === 'Read' ? 'Unread' : 'Read'}
                                    </button>
                                  </div>
                                </div>
                              ) : this.state.matchesData
                              ? <div className='container'>
                                <div className='row justify-content-center'>
                                  <div className='col-sm-12 text-center my-0' >
                                    <div className='no-data'><p>{t`lanCommonLabelNoMatchesFound`}</p></div>
                                  </div>
                                </div>
                              </div>
                              : <div className='container'>
                                <div className='row justify-content-center'>
                                  <div className='col-sm-12 text-center my-0' >
                                    <div className='no-data'><p>{t`lanSPLabelNoNotifications`}</p></div>
                                  </div>
                                </div>
                              </div>
                            }
                            {(this.state.notificationList && this.state.notificationList.length > 0)
                              ? <div className='card-footer'>
                                <div className='text-center'>
                                  <Pagination
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={10}
                                    totalItemsCount={this.state.totalCount}
                                    pageRangeDisplayed={5}
                                    onChange={this.handlePageChange}
                                  />
                                </div>
                              </div>
                              : null}
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Modal isOpen={this.state.modalIsOpen} style={customStyles}>
              <div className='card-body'>
                <h2 className='modal-text' >{t`lanCommonLabelDeleteNote`}</h2>
                <div className='row my-4 px-3'>
                  <label className='text-danger' >{this.state.errorNotification}</label>
                  <button className='btn btn-primary mr-2' onClick={this.handleConfirmDeleteNotification}>{t`lanCommonButtonConfirm`}</button>
                  <button className='btn btn-danger' onClick={this.closeModal}>{t`lanCommonButtonCancel`}</button>
                </div>
              </div>
            </Modal>
          </div>
          : this.state.isShowNotification === 'View' ? <ADEUNotificationsListViewComponent notificationData={this.state.notificationData} handleViewUser={this.handleViewNotificationBack} />
            : ''}
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}

export default ADEUNotificationsListComponent
