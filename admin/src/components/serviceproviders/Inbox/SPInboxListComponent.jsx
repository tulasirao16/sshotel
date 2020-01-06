/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import Pagination from 'react-js-pagination'
import moment from 'moment'
import { t } from 'ttag'
import SPInboxViewComponent from './SPInboxViewComponent'
import { hashHistory } from 'react-router'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPInboxListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      messagesList: [],
      searchString: '',
      activePage: 1,
      noMessages: false,
      isShowMessagesList: true,
      isShowMessageView: true,
      reload: false,
      selectedMessageData: {}
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleInboxView = this.handleInboxView.bind(this)
    this.handleInboxViewBack = this.handleInboxViewBack.bind(this)
    this.handleMessageStatus = this.handleMessageStatus.bind(this)
  }
  componentWillMount () {
    let getUserMessages = {
      url: config.baseUrl + config.getSPUserMessagesListAPI + '/' + this.state.activePage + '/'
    }
    let _this = this
    APICallManager.getCall(getUserMessages, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          messagesList: resObj.data.statusResult.messagesList,
          totalCount: resObj.data.statusResult.totalDocs,
          noMessages: false
        })
      } else {
        _this.setState({
          messagesList: [],
          noMessages: false
        })
      }
    })
  }
  componentWillReceiveProps (newProps) {
    this.setState({ messagesData: newProps.selectedMessageData })
  }
  handleInputChange (event) {
    let _this = this
    _this.setState({ searchString: event.target.value, activePage: 1 })
    let getSearchMessageObj = {
      url: config.baseUrl + config.getSPUserMessagesListAPI + '/' + '1' + '/' + event.target.value
    }
    APICallManager.getCall(getSearchMessageObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          messagesList: resObj.data.statusResult.messagesList, totalCount: resObj.data.statusResult.totalDocs, noMessages: false
        })
      } else {
        _this.setState({
          messagesList: [], totalCount: 0, noMessages: true
        })
      }
    })
  }
  handlePageChange (pageNumber) {
    this.setState({ activePage: pageNumber })
    let _this = this
    let obj = { url: config.baseUrl + config.getSPUserMessagesListAPI + '/' + pageNumber + '/' + this.state.searchString }
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ messagesList: resObj.data.statusResult.messagesList, totalCount: resObj.data.statusResult.totalDocs, noMessages: false })
      } else {
        _this.setState({ messagesList: [], totalCount: 0, noMessages: false })
      }
    })
  }

  handleInboxView (data) {
    this.setState({
      isShowMessagesList: !this.state.isShowMessagesList,
      selectedMessageData: data,
      reload: true
    })
  }

  handleInboxViewBack (messageStatus, data) {
    let messages = this.state.messagesList
    const i = messages.indexOf(data)
    messages[i].spReadStatus = messageStatus
    this.setState({
      isShowMessagesList: !this.state.isShowMessagesList,
      messagesList: messages,
      selectedMessageData: {},
      reload: true
    })
  }

  handleMessageStatus (messageObj) {
    if (messageObj.spReadStatus === 'Read') {
      // location.reload()
      this.unreadMessage(messageObj)
    } else {
      // location.reload()
      this.readMessage(messageObj)
    }
  }
  unreadMessage (messageObj) {
    let _this = this
    let putMessagesData = {
      _id: messageObj._id
    }
    let obj = { url: config.baseUrl + config.putSPMessageReadToUnreadAPI + messageObj._id, body: putMessagesData }
    let messages = this.state.messagesList
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        const i = messages.indexOf(messageObj)
        messages[i].spReadStatus = resObj.data.statusResult.spReadStatus
        _this.setState({
          messagesList: messages,
          reload: true
        })
      } else {
        alert('Message Unread failed')
      }
    })
  }
  readMessage (messageObj) {
    let _this = this
    let putMessagesData = {
      _id: messageObj._id
    }
    let obj = { url: config.baseUrl + config.putSPMessageUnreadToReadAPI + messageObj._id, body: putMessagesData }
    let messages = this.state.messagesList
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        const i = messages.indexOf(messageObj)
        messages[i].spReadStatus = resObj.data.statusResult.spReadStatus
        _this.setState({
          messagesList: messages,
          reload: true
        })
      } else {
        alert('Message Read failed')
      }
    })
  }
  handleHome () {
    hashHistory.push('/host/home')
  }

  render () {
    return (
      <div>
        {/* ------- Navbar --------- */}
        {this.state.isShowMessagesList
        ? <div>
          <div className='header bg-primary pb-6'>
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-md-6 col-12'>
                    <h6 className='h2 text-white d-inline-block mb-0'>{ t`lanSPTitleInbox` }</h6>
                    <nav aria-label='breadcrumb' className='d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        {/* <li className='breadcrumb-item'><a >Inbox</a></li> */}
                        <li className='breadcrumb-item active' aria-current='page'>Inbox List Page</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container-fluid mt--6 pb-6'>
            <div className='row inbox'>
              <div className='col-md-3 mb-3'>
                <div className='list-group list-group-messages'>
                  <a className='list-group-item active border-0'>
                    <i className='far fa-envelope mr-1' /> Inbox
                      <span className='badge badge-dark badge-pill float-right'>8</span>
                  </a>
                  <a className='list-group-item list-group-item-action border-0'>
                    <i className='fa fa-paper-plane-o mr-1' /> Sent</a>
                  <a className='list-group-item list-group-item-action border-0'>
                    <i className='far fa-file mr-1' /> Draft</a>
                  <a className='list-group-item list-group-item-action border-0'>
                    <i className='far fa-star mr-1' /> Starred
                    <span className='badge badge-danger badge-pill float-right'>3</span>
                  </a>
                  <a className='list-group-item list-group-item-action border-0'>
                    <i className='fas fa-trash-alt mr-2' /> Trash
                  </a>
                </div>
              </div>
              <div className='col-md-9'>
                <div className='card mb-2'>
                  <div className='card-header'>
                    <div className='row'>
                      <div className='col-sm-7'><h3 className='mb-0'>{ t`lanSPTitleInbox` } </h3></div>
                      <div className='col-lg-5 text-right'>
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
                  <div className='card-body'>
                    <section className='inbox'>
                      <div className='row clearfix'>
                        <div className='col-md-12 col-lg-12 col-xl-12'>
                          <ul className='mail_list list-group list-unstyled mt-4' >
                            {this.state.messagesList.length > 0 ? this.state.messagesList.map((item, i) =>
                              <div className='row' style={item.spReadStatus === 'Unread' ? { backgroundColor: 'rgb(243, 243, 243)', paddingTop:10, paddingBottom:10, marginBottom:10 }
                               : { backgroundColor: '#FFF', paddingTop:10, paddingBottom:10, marginBottom:10 }} key={i}>
                                <div className='col-lg-10'>
                                  <li onClick={() => this.handleInboxView(item)} >
                                    <div className='media'>
                                      <div className='pull-left' >
                                        <span className='avatar avatar-md mr-3 bg-info rounded-circle'>
                                          <span className='media-object d-flex justify-content-center align-items-center' style={{ fontSize:12 }}>{moment(item.createdOn).format('MMM DD')}</span>
                                        </span>
                                      </div>
                                      <div className='media-body'>
                                        <div className='media-heading'>
                                          <a className='m-r-10'>{item.messageBy === 'Service Provider' ? 'You' : item.messageBy === 'End User' ? item.euName : 'Admin:' + item.adminName}</a>
                                          <small className='float-right text-muted'><time className='hidden-sm-down'>{moment(item.createdOn).add(5, 'hours').add(30, 'minutes').format('LT')}</time>
                                            <i className='zmdi zmdi-attachment-alt' />
                                          </small>
                                        </div>
                                        <p className='msg'>{item.message}</p>
                                      </div>
                                    </div>
                                  </li>
                                </div>
                                <div className='col-lg-2 text-right'>
                                  {item.messageBy !== 'Service Provider'
                                    ? <span>
                                      <button className='btn-sm success' style={item.spReadStatus === 'Read' ? { background:'#ef543b' } : { background:'#4da424' }}
                                        onClick={() => this.handleMessageStatus(item)} >{item.spReadStatus === 'Read' ? 'Unread' : 'Read'}</button>
                                    </span>
                                  : null }
                                </div>
                              </div>
                              ) : this.state.noMessages
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
                                    <div className='no-data'><p>{t`lanSPLabelNoMessagesAvailable`}</p></div>
                                  </div>
                                </div>
                              </div>
                              }
                          </ul>
                        </div>
                      </div>
                    </section>
                    {this.state.messagesList.length > 0
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        : <SPInboxViewComponent selectedMessageData={this.state.selectedMessageData} handleInboxView={this.handleInboxViewBack} />
        }
      </div>
    )
  }
}

export default SPInboxListComponent
