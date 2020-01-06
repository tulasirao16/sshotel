/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import { hashHistory } from 'react-router'

import APICallManager from '../../../../services/callmanager'
import config from '../../../../../public/config.json'
import { t } from 'ttag'
import Pagination from 'react-js-pagination'
import moment from 'moment'
import Modal from 'react-modal'

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

class ADNotificationsList extends React.Component {
  constructor () {
    super()
    this.state = {
      activePage: 1,
      adUserId: localStorage.getItem('adUserId'),
      notificationsList: [],
      matchesData: false,
      searchString: '',
      notificationsData: {},
      errorNotification:''
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleStatus = this.handleStatus.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleConfirmDeleteNotification = this.handleConfirmDeleteNotification.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleNotifications = this.handleNotifications.bind(this)
  }
  componentWillMount () {
    let obj = { url: config.baseUrl + config.getADNotificationsListAPI + this.state.adUserId + '/' + this.state.activePage + '/' }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          notificationsList: resObj.data.statusResult.notificationsData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          notificationsList: [], matchesData: false
        })
      }
    })
  }
  handleInputChange (event) {
    let search = this.state.searchString
    // this.setState({ searchString: search })
    let obj = { url: config.baseUrl + config.getADNotificationsListAPI + this.state.adUserId + '/' + this.state.activePage + '/' + search }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          notificationsList: resObj.data.statusResult.notificationsData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false
        })
      } else {
        _this.setState({
          notificationsList: [], totalCount: 0, matchesData: true
        })
      }
    })
  }
  handlePageChange (pageNumber) {
    this.setState({ activePage: pageNumber })
    let _this = this
    let obj = { url: config.baseUrl + config.getADNotificationsListAPI + pageNumber + '/' + this.state.searchString }
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ notificationsList: resObj.data.statusResult.notificationsData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false })
      } else {
        _this.setState({ notificationsList: [], totalCount: 0, matchesData: false })
      }
    })
  }
  handleStatus (item) {
    let _this = this
    let putNotificationData = {
      status : item.status === 'Read' ? 'Unread' : 'Read'
    }
    let obj = { url: config.baseUrl + config.putADNotificationsStatusAPI + item._id, body: putNotificationData }
    let notifications = this.state.notificationsList
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        const i = notifications.indexOf(item)
        notifications[i].status = resObj.data.statusResult.status
        _this.setState({
          notificationsList: notifications
        })
      } else {
        alert('Notification Unread failed')
      }
    })
  }
  handleDelete (item) {
    this.setState({ modalIsOpen: true, notificationsData: item })
  }
  handleConfirmDeleteNotification () {
    let _this = this
    let obj = {
      url: config.baseUrl + config.deleteADNotificationsAPI + this.state.notificationsData._id
    }
    APICallManager.putCall(obj, function (resObj) {
      _this.setState({ modalIsOpen: false })
      if (resObj.data.statusCode === '0000') {
        _this.setState({ modalIsOpen: false })
        window.location.reload()
      } else {
        _this.setState({ errorNotification: 'Notification Delete Failed' })
      }
    })
  }
  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleNotifications () {
    localStorage.setItem('menuItem', 'Notifications')
    hashHistory.push('/admin/notifications')
    event.preventDefault()
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-8 col-7'>
                  {/* <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitleNotifications`}</h6> */}
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item active eu-font'><a onClick={this.handleNotifications}>Notifications List</a></li>
                      <li className='breadcrumb-item active eu-font'>Notifications</li>
                      {/* <li className='breadcrumb-item'><a href='#'>Tables</a></li> */}
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6'>
          <div className='row justify-content-center notifictions'>
            <div className='col-md-11 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header'>
                  <div className='row'>
                    <div className='col-sm-8'><h6 className='h2 d-inline-block mb-0'>{t`lanSPTitleNotifications`}</h6> </div>
                    <div className='col-lg-3 text-right'>
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
                              onChange={(e) => { this.setState({ searchString: e.target.value }) }} placeholder={t`lanCommonLabelSearch`} />
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className='col-lg-1'>
                      <button className='btn btn-icon btn-primary px-3 py-2' type='button' onClick={this.handleInputChange}>
                        <span className='btn-inner--icon'><i className='fa fa-search' /></span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className='card-body'>
                  <section className='notifications'>
                    <div className='row clearfix'>
                      {(this.state.notificationsList && this.state.notificationsList.length > 0)
                        ? <div className='col-md-12 col-lg-12 col-xl-12'>
                          {/* List group */}
                          <div className='list-group list-group-flush'>
                            {this.state.notificationsList.map((item, i) =>
                              <div key={i} className='list-group-items'>
                                <a className='list-group-item list-group-item-action'>
                                  <div className='row align-items-center'>
                                    <div className='col-12'>
                                      <div className='d-flex justify-content-between align-items-center row'>
                                        <div className='col-sm-8'>
                                          <h4 className={item.status === 'Unread' ? 'mb-0 text-sm font-weight-bold' : 'mb-0 text-sm'}>{item.notificationTitle} </h4>
                                        </div>
                                        <div className='text-right text-muted col-sm-3'>
                                          <small className='text-muted'>{moment(item.createdOn).format('MMM DD,YY')}</small>
                                        </div>
                                      </div>
                                      <p className={item.status === 'Unread' ? 'text-sm mb-0 p-3 font-weight-bold' : 'text-sm mb-0 p-3'}>{item.notificationMessage}</p>
                                    </div>
                                  </div>
                                </a>
                                <a onClick={() => this.handleDelete(item)} className='table-action table-action-delete'
                                  title='Delete' >
                                  <i className='fas fa-trash text-error' />
                                </a>
                                <button className='btn-sm success' style={item.status === 'Read' ? { background:'#ef543b' } : { background:'#4da424' }}
                                  onClick={() => this.handleStatus(item)} >{item.status === 'Read' ? 'Unread' : 'Read'}</button>
                              </div>
                            )}
                          </div>
                        </div> : this.state.matchesData
                          ? <div className='container'>
                            <div className='row justify-content-center'>
                              <div className='col-sm-12 text-center'>
                                <div className='no-data'><p>{t`lanCommonLabelNoMatchesFound`}</p></div>
                              </div>
                            </div>
                          </div>
                          : <div className='container'>
                            <div className='row justify-content-center'>
                              <div className='col-sm-12 text-center'>
                                <div className='no-data'><p>{t`lanSPLabelNoNotifications`}</p></div>
                              </div>
                            </div>
                          </div>
                      }
                    </div>
                  </section>
                  {(this.state.notificationsList && this.state.notificationsList.length > 0)
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
                    </div> : null}
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
    )
  }
  }

export default ADNotificationsList
