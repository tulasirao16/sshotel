/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import moment from 'moment'
import Pagination from 'react-js-pagination'
import 'react-drawer/lib/react-drawer.css'
import Modal from 'react-modal'
import classnames from 'classnames'
import './css/InboxCss.css'
import { hashHistory } from 'react-router'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import EUInboxMessageViewComponent from './EUInboxMessageViewComponent'

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

class EUInboxListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      inboxListData: [],
      activePage: 1,
      searchString: '',
      totalCount: 0,
      deleteData: {},
      isMessageList: true,
      modalIsOpen: false,
      reload: false
    }
    this.handleViewMessage = this.handleViewMessage.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleMessageStatus = this.handleMessageStatus.bind(this)
    this.unreadMessage = this.unreadMessage.bind(this)
    this.readMessage = this.readMessage.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.commonFunction = this.commonFunction.bind(this)
    this.handleConfirmDeleteMessage = this.handleConfirmDeleteMessage.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }
  componentWillMount () {
    let obj = { url: config.baseUrl + config.getEUInboxListAPI + '1' }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ inboxListData: resObj.data.statusResult.messageData, totalCount: resObj.data.statusResult.totalDocs })
      } else {
        _this.setState({ inboxListData: [], totalCount: 0 })
      }
    })
  }
  handleSearch (event) {
    let search = event.target.value
    this.setState({ searchString: event.target.value })
    let obj = { url: config.baseUrl + config.getEUInboxListAPI + this.state.activePage + '/' + search }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ inboxListData: resObj.data.statusResult.messageData, totalCount: resObj.data.statusResult.totalDocs })
      } else {
        _this.setState({ inboxListData: [], totalCount: 0 })
      }
    })
  }
  handlePageChange (pageNumber) {
    this.setState({ activePage: pageNumber })
    let obj = { url: config.baseUrl + config.getEUInboxListAPI + pageNumber + '/' + this.state.searchString }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ inboxListData: resObj.data.statusResult.messageData, totalCount: resObj.data.statusResult.totalDocs })
      } else {
        _this.setState({ inboxListData: [], totalCount: 0 })
      }
    })
  }
  handleMessageStatus (messageObj) {
    if (messageObj.euReadStatus === 'Read') {
      this.unreadMessage(messageObj)
    } else {
      this.readMessage(messageObj)
    }
  }
  unreadMessage (messageObj) {
    let _this = this
    let obj = { url: config.baseUrl + config.putEUInboxReadToUnreadAPI + messageObj._id }
    let inboxList = this.state.inboxListData
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        const i = inboxList.indexOf(messageObj)
        inboxList[i].euReadStatus = resObj.data.statusResult.euReadStatus
        _this.setState({
          inboxListData: inboxList,
          reload: true
        })
      } else {
        alert(t`lanEULabelErrorMessageUnreadFailed`)
      }
    })
  }
  readMessage (messageObj) {
    let _this = this
    let obj = { url: config.baseUrl + config.putEUInboxUnreadToReadAPI + messageObj._id }
    let inboxList = this.state.inboxListData
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        const i = inboxList.indexOf(messageObj)
        inboxList[i].euReadStatus = resObj.data.statusResult.euReadStatus
        _this.setState({
          inboxListData: inboxList,
          reload: true
        })
      } else {
        alert(t`lanEULabelErrorMessageReadFailed`)
      }
    })
  }
  handleDelete (item) {
    this.setState({ modalIsOpen: true, deleteData: item })
  }
  handleConfirmDeleteMessage () {
    let postJson = {
      messageIDs: [this.state.deleteData._id]
    }
    this.setState({ reload: true, modalIsOpen: false })
    let obj = { url: config.baseUrl + config.deleteEUInboxMessageAPI, body: postJson }
    let _this = this
    APICallManager.putCall(obj, function (delResObj) {
      _this.setState({ reload: false, deleteData: {}, modalIsOpen: false })
      if (delResObj.data.statusCode === '0000') {
        let obj = { url: config.baseUrl + config.getEUInboxListAPI + '1' }
        APICallManager.getCall(obj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            _this.setState({ inboxListData: resObj.data.statusResult.messageData, totalCount: resObj.data.statusResult.totalDocs })
          } else {
            _this.setState({ inboxListData: [], totalCount: 0 })
          }
        })
      } else {
        alert(t`lanEULabelErrorMessageDeleteFailed`)
      }
    })
  }
  handleViewMessage (item) {
    this.setState({ messageData: item, isMessageList: false })
  }
  closeModal () {
    this.setState({ modalIsOpen: false, deleteData: {} })
  }
  commonFunction (messageStatus, data, type) {
    if (type === 'status') {
      let messages = this.state.inboxListData
      let i = messages.indexOf(data)
      if (i !== -1) {
        messages[i].euReadStatus = messageStatus
      }
      this.setState({ isMessageList: true, inboxListData: messages })
    } else if (type === 'delete') {
      let messages = this.state.inboxListData
      let i = messages.indexOf(data)
      if (i !== -1) {
        messages.splice(i, 1)
      }
      this.setState({ isMessageList: true, inboxListData: messages })
    } else {
      let obj = { url: config.baseUrl + config.getEUInboxListAPI + '1' }
      let _this = this
      APICallManager.getCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ inboxListData: resObj.data.statusResult.messageData, totalCount: resObj.data.statusResult.totalDocs })
        } else {
          _this.setState({ inboxListData: [], totalCount: 0 })
        }
      })
    }
  }
  handleHome (event) {
    hashHistory.push('/hotels')
    event.preventDefault()
  }
  render () {
    return (
      <div>
        {this.state.isMessageList
          ? <div className='enduser-inbox-list'>
            <div className='header bg-primary pb-6'>
              <div className='container-fluid'>
                <div className='header-body'>
                  <div className='row align-items-center pt-7 pb-5'>
                    <div className='col-lg-6 col-7'>
                      {/* <h6 className='h2 text-white d-inline-block mb-0'>{t`lanEUTitleInbox`}</h6> */}
                      <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                        <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                          <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                          <li className='breadcrumb-item active eu-font' aria-current='page'><a >{t`lanEUTitleInbox`}</a></li>
                        </ol>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='container  mt--6 pb-4'>
              <div className='row justify-content-center inbox'>
                <div className='col-md-11'>
                  <div className='card mb-2'>
                    <div className='card-header py-2'>
                      <div className='row '>
                        <div className='col-sm-7'>
                          <h6 className='h2 text-primary d-inline-block pt-2'>{t`lanEUTitleInbox`}</h6>
                        </div>
                        <div className='col-sm-5'>
                          {/* -- Search form -- */}
                          <form>
                            <div className='form-group mb-0'>
                              <div className='input-group input-group-lg input-group-flush'>
                                <div className='input-group-prepend'>
                                  <div className='input-group-text'>
                                    <span className='fas fa-search' />
                                  </div>
                                </div>
                                <input type='search' className='form-control' placeholder='Search' value={this.state.searchString} onChange={this.handleSearch} />
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className='card-body'>
                      <section className='eu-inbox'>
                        <div className='row clearfix'>
                          <div className='col-md-12 col-lg-12 col-xl-12'>
                            <ul className='mail_list list-group list-unstyled'>
                              {this.state.inboxListData && this.state.inboxListData.length > 0 ? this.state.inboxListData.map((item, i) =>
                                <div className='row' key={i}>
                                  <div className='col-lg-11'>
                                    <li className={classnames('list-group-item', { 'bg-gray': item.euReadStatus === 'Unread' })} onClick={() => this.handleViewMessage(item)}>
                                      <div className='media'>
                                        <div className='pull-left'>
                                          <span className='avatar avatar-md mr-3 bg-info rounded-circle'>
                                            <span className='media-object d-flex justify-content-center align-items-center'>{moment(item.createdOn).format('DD')}</span>
                                          </span>
                                        </div>
                                        <div className='media-body'>
                                          <div className='media-heading'>
                                            <a className='m-r-10'>{item.messageBy === 'End User' ? 'You' : item.messageBy === 'Service Provider' ? item.spServiceProvider : 'Admin:' + item.adminName}</a>
                                            <small className='float-right pt-3 text-muted'><time className='hidden-sm-down eu-font'>{moment(item.createdOn).add(5, 'hours').add(30, 'minutes').format('LT')}</time>
                                              <i className='zmdi zmdi-attachment-alt' /> </small>
                                          </div>
                                          <p className='msg '>{item.message}</p>
                                        </div>
                                      </div>
                                    </li>

                                  </div>
                                  <div className='col-lg-1 text-center my-3'>
                                    {item.messageBy !== 'End User'
                                      ? <span>
                                        <button className='btn-sm success' style={item.euReadStatus === 'Read' ? { background: '#ef543b' } : { background: '#4da424' }}
                                          onClick={() => this.handleMessageStatus(item)} >{item.euReadStatus === 'Read' ? 'Unread' : 'Read'}</button>
                                      </span>
                                      : null}
                                    <a onClick={() => this.handleDelete(item)} className='table-action table-action-delete'
                                      title='Delete' >
                                      <i className='fas fa-trash text-error' />
                                    </a>
                                  </div>
                                </div>
                              ) : <div className='container'>
                                <div className='row justify-content-center'>
                                  <div className='col-sm-12 text-center my-0' >
                                    <div className='no-data'><p>{t`lanEULabelErrorNoMessagesAvailable`}</p></div>
                                  </div>
                                </div>
                              </div>
                              }
                            </ul>
                            {this.state.inboxListData && this.state.inboxListData.length > 0
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
          </div>
          : <EUInboxMessageViewComponent messageData={this.state.messageData} commonFunction={this.commonFunction} />
        }
        <Modal isOpen={this.state.modalIsOpen} style={customStyles}>
          <div className='container modalOne'>
            <div className='row my-2'>
              <div className='col-sm-12 text-right'>
                <a onClick={this.closeModal} ><i className='fas fa-times' /> </a>
              </div>
              <div className='col-sm-12 m-3'>
                <p>{t`lanCommonLabelDeleteNote`}</p>
              </div>
            </div>
            <div className='row my-3'>
              <div className='col-sm-12 text-center'>
                <button className='btn btn-primary mr-2' onClick={this.handleConfirmDeleteMessage}>{t`lanCommonButtonConfirm`}</button>
                <button className='btn btn-danger' onClick={this.closeModal}>{t`lanCommonButtonCancel`}</button>
              </div>
            </div>
          </div>
        </Modal>
      </div>

    )
  }
}

export default EUInboxListComponent
