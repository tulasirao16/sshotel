/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import { t } from 'ttag'
import Pagination from 'react-js-pagination'
import moment from 'moment'
import Modal from 'react-modal'

import APICallManager from '../../../../services/callmanager'
import config from '../../../../../public/config.json'
import ADHostUserNotificationsListViewComponent from './ADHostUserNotificationsListViewComponent'

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

class ADHostUserNotificationsList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hostUserData: JSON.parse(localStorage.getItem('hostUserData')),
      activePage: 1,
      notificationList: [],
      matchesData: false,
      modalIsOpen: false,
      searchString: '',
      notificationData: {},
      errorNotification: '',
      isShowNotification: 'List'
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleStatus = this.handleStatus.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleConfirmDeleteNotification = this.handleConfirmDeleteNotification.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleViewUser = this.handleViewUser.bind(this)
    this.handleViewNotificationBack = this.handleViewNotificationBack.bind(this)
  }
  componentWillMount () {
    if (this.state.hostUserData.userRole === 'Admin') {
      let obj = { url: config.baseUrl + config.getADHostsNotificationsListAPI + this.state.hostUserData.spServiceProviderId + '/' + this.state.activePage + '/' + this.state.searchString }
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
    } else {
      let obj = { url: config.baseUrl + config.getADHostUserNotificationsAPI + this.state.hostUserData.spServiceProviderId + '/' +
       this.state.activePage + '/' + this.state.hostUserData._id + '/' + this.state.searchString }
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
  }
  handleInputChange (event) {
    this.setState({ activePage: 1 })
    let search = this.state.searchString
    if (this.state.hostUserData.userRole === 'Admin') {
      let obj = { url: config.baseUrl + config.getADHostsNotificationsListAPI + this.state.hostUserData.spServiceProviderId + '/' + '1' + '/' + search }
      let _this = this
      APICallManager.getCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({
            notificationList: resObj.data.statusResult.notificationsData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
          })
        } else {
          _this.setState({
            notificationList: [], matchesData: true
          })
        }
      })
    } else {
      let obj = { url: config.baseUrl + config.getADHostUserNotificationsAPI + this.state.hostUserData.spServiceProviderId + '/' + '1' + '/' + this.state.hostUserData._id + '/' + search }
      let _this = this
      APICallManager.getCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({
            notificationList: resObj.data.statusResult.notificationsData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
          })
        } else {
          _this.setState({
            notificationList: [], matchesData: true
          })
        }
      })
    }
    event.preventDefault()
  }

  handlePageChange (pageNumber) {
    if (this.state.activePage !== pageNumber) {
      this.setState({ activePage: pageNumber })
      if (this.state.hostUserData.userRole === 'Admin') {
        let obj = { url: config.baseUrl + config.getADHostsNotificationsListAPI + this.state.hostUserData.spServiceProviderId + '/' + pageNumber + '/' + this.state.searchString }
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
      } else {
        let obj = { url: config.baseUrl + config.getADHostUserNotificationsAPI + this.state.hostUserData.spServiceProviderId + '/' + pageNumber + '/' + this.state.hostUserData._id + '/' + this.state.searchString }
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
    }
  }
  handleStatus (item) {
    let _this = this
    let putNotificationsData = {
      status: item.status === 'Read' ? 'Unread' : 'Read'
    }
    let obj = { url: config.baseUrl + config.putADHostsNotificationsStatusAPI + item._id, body: putNotificationsData }
    let notifications = this.state.notificationList
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        const i = notifications.indexOf(item)
        notifications[i].status = resObj.data.statusResult.status
        _this.setState({
          notificationList: notifications
        })
      } else {
        ToastsStore.error('Notification Unread failed')
      }
    })
  }
  handleDelete (item) {
    this.setState({ modalIsOpen: true, notificationData: item })
  }

  handleConfirmDeleteNotification () {
    let notificationList = this.state.notificationList
    let obj = {
      url: config.baseUrl + config.deleteADHostsNotificationsAPI + this.state.notificationData._id
    }
    let index = notificationList.findIndex(i => i._id === this.state.notificationData._id)
    let _this = this
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        notificationList.splice(index, 1)
        _this.setState({ modalIsOpen: false })
      } else {
        _this.setState({ errorNotification: 'Notification Delete Failed' })
      }
    })
  }
  closeModal () {
    this.setState({ modalIsOpen: false })
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
            {/* ------- Body Begins --------- */}
            <div className='container-fluid mt--6 pb-4'>
              <div className='row justify-content-center notifictions'>
                <div className='col-lg-12 card-wrapper'>
                  <div className='card mb-2'>
                    <div className='card-header'>
                      <div className='row'>
                        <div className='col-sm-8'>
                          <h6 className='h2 text-primary d-inline-block pt-2'>{t`lanEUTitleNotifications`}</h6>
                        </div>
                        <div className='col-sm-3 pr-0'>
                          {/* -- Search form -- */}
                          <form>
                            <div className='form-group mb-0'>
                              <div className='input-group input-group-lg input-group-flush'>
                                <div className='input-group-prepend'>
                                  <div className='input-group-text'>
                                    <span className='fas fa-search' />
                                  </div>
                                </div>
                                <input type='search' className='form-control' value={this.state.searchString} onKeyPress={this.handleEnter}
                                  onChange={(e) => { this.setState({ searchString: e.target.value }) }} placeholder={t`lanCommonLabelSearch`} />
                              </div>
                            </div>
                          </form>
                        </div>
                        <div className='col-sm-1'>
                          <button className='btn btn-icon btn-primary px-3 py-2' type='button' onClick={this.handleInputChange}>
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
                                  <div className='col-sm-12'>
                                    <div className='row align-items-center py-1 list-group-item-action'>
                                      <div className='col-md-1 pr-0 pl-0 text-center'>
                                        {/* Avatar */}
                                        <img src={require('../../../../../assets/rm1.jpg')} className='avatar rounded-circle' />
                                      </div>
                                      <div className='col-md-6 pl-0'>
                                        <div className='d-flex justify-content-between align-items-center'>
                                          <div>
                                            <h5 className={item.status === 'Unread' ? 'mb-0 text-sm font-weight-bold' : 'mb-0 text-sm'}>{item.notificationTitle}</h5>
                                          </div>
                                        </div>
                                        <p className={item.status === 'Unread' ? 'text-sm mb-0 eu-font font-weight-bold' : 'text-sm mb-0 eu-font'}>{item.notificationMessage}</p>
                                      </div>
                                      <div className='col-md-5'>
                                        <div className='row'>
                                          <div className='col-md-3 pr-0'>
                                            <small>{moment(item.createdAt).format('MMM DD YYYY')}</small>
                                          </div>
                                          <div className='col-md-1 pl-0'>
                                            <a onClick={() => this.handleViewUser(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanSPButtonTooltipViewUser`}>
                                              <i className='far fa-eye' />
                                            </a>
                                          </div>
                                          <div className='col-md-1 pl-0'>
                                            <a onClick={() => this.handleDelete(item)} className='table-action table-action-delete' title='Delete' >
                                              <i className='fas fa-trash' />
                                            </a>
                                          </div>
                                          <div className='col-md-2 pl-0'>
                                            <button className='btn-sm success' style={item.status === 'Read' ? { background: '#ef543b', color:'#fff' } : { background: '#4da424', color:'#fff' }}
                                              onClick={() => this.handleStatus(item)} >{item.status === 'Read' ? 'Unread' : 'Read'}</button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
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
                            {this.state.notificationList && this.state.notificationList.length > 0
                              ? <div className='card-footer'>
                                <div className='text-center'>
                                  <Pagination
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={30}
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
              <h2 className='modal-text' >{t`lanCommonLabelDeleteNote`}</h2>
              <div className='row my-4 px-3'>
                <label className='text-danger' >{this.state.errorNotification}</label>
                <button className='btn btn-primary mr-2' onClick={this.handleConfirmDeleteNotification}>{t`lanCommonButtonConfirm`}</button>
                <button className='btn btn-danger' onClick={this.closeModal}>{t`lanCommonButtonCancel`}</button>
              </div>
            </Modal>
          </div>
          : this.state.isShowNotification === 'View' ? <ADHostUserNotificationsListViewComponent notificationData={this.state.notificationData} handleViewUser={this.handleViewNotificationBack} />
            : ''}
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}

export default ADHostUserNotificationsList

