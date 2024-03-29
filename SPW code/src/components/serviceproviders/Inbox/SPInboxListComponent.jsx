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
import classnames from 'classnames'
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
      totalCount: 0,
      noMessages: false,
      isShowMessagesList: true,
      isShowMessageView: true,
      reload: false,
      selectedMessageData: {},
      chatData: [],
      message: '',
      euName: '',
      euUserId: '',
      propertyId: '',
      propertyTitle: '',
      propertyType: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleInboxView = this.handleInboxView.bind(this)
    this.handleInboxViewBack = this.handleInboxViewBack.bind(this)
    this.handleMessageStatus = this.handleMessageStatus.bind(this)
    this.handleEnterPressed = this.handleEnterPressed.bind(this)
    this.handleReadMessages = this.handleReadMessages.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }
  componentWillMount () {
    let getUserMessages = {
      unBlockStatus: true,
      url: config.baseUrl + config.getSPChatListAPI + '1'
    }
    let _this = this
    APICallManager.getCall(getUserMessages, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.handleViewEachChat(resObj.data.statusResult.messageData[0].spReadStatusGroup[0].propertyId, resObj.data.statusResult.messageData[0]._id.euUserId._id)
        _this.setState({
          messagesList: resObj.data.statusResult.messageData,
          totalCount: resObj.data.statusResult.totalDocs,
          noMessages: false
        })
      } else {
        _this.setState({
          messagesList: [],
          totalCount: 0,
          noMessages: false
        })
      }
    })
  }
  handleViewEachChat (propertyId, euUserID) {
    let obj = {
      unBlockStatus: true,
      url: config.baseUrl + config.getSPEUConversationAPI + euUserID + '/' + propertyId + '/' + '1/' }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.handleReadMessages(euUserID, propertyId)
        _this.setState({
          chatData: resObj.data.statusResult.messagesData.reverse(),
          totalCount: resObj.data.statusResult.totalDocs,
          euName: resObj.data.statusResult.messagesData[0].euName,
          euUserId: resObj.data.statusResult.messagesData[0].euUserId,
          propertyId: resObj.data.statusResult.messagesData[0].propertyId,
          propertyTitle: resObj.data.statusResult.messagesData[0].propertyTitle,
          propertyType: resObj.data.statusResult.messagesData[0].propertyType
        })
      } else {
        _this.setState({ chatData: [], totalCount: 0 })
      }
    })
  }
  handleReadMessages (euUserID, propertyId) {
    let messagesList = this.state.messagesList
    let index = messagesList.findIndex(x => (x._id.euUserId._id === euUserID && x.spReadStatusGroup[0].propertyId === propertyId))
    let unreadIndex = messagesList[index].spReadStatusGroup.findIndex(y => y.spReadStatus === 'Unread')
    let spReadStatusGroup = messagesList[index].spReadStatusGroup
    if ((spReadStatusGroup.length > 1 && (spReadStatusGroup[0].spReadStatus === 'Unread' || spReadStatusGroup[1].spReadStatus === 'Unread')) || (spReadStatusGroup.length === 1 && spReadStatusGroup[0].spReadStatus === 'Unread')) {
      let _this = this
      let obj = { url: config.baseUrl + config.putSPReadMessagesAPI + euUserID + '/' + propertyId }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          if (unreadIndex >= 0) {
            messagesList[index].spReadStatusGroup[unreadIndex].spReadStatus = 'Read'
            _this.setState({ messagesList: messagesList })
          }
        }
      })
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState({ messagesData: newProps.selectedMessageData })
  }
  handleSearchInputChange (event) {
    let search = event.target.value
    this.setState({ searchString: event.target.value })
    let obj = {
      unBlockStatus: true,
      url: config.baseUrl + config.getSPChatListAPI + this.state.activePage + '/' + search }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          messagesList: resObj.data.statusResult.messageData,
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
  handlePageChange (pageNumber) {
    if (this.state.activePage !== pageNumber) {
      this.setState({ activePage: pageNumber })
      let obj = {
        unBlockStatus: true,
        url: config.baseUrl + config.getSPChatListAPI + pageNumber + '/' + this.state.searchString }
      let _this = this
      APICallManager.getCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({
            messagesList: resObj.data.statusResult.messageData,
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
  }
  handleInputChange (event) {
    this.setState({ message: event.target.value })
  }
  handleEnterPressed (event) {
    var code = event.keyCode || event.which
    if (code === 13) {
      this.handleSendMessage()
    }
  }

  handleSendMessage = () => {
    if (!this.state.message) {
      this.setState({ errorMessage: t`lanSPLabelErrorPleaseEnterMessage` })
    } else {
      let postdata = {
        message: this.state.message,
        euName: this.state.euName,
        euUserId: this.state.euUserId,
        messagedBy: 'Service Provider',
        propertyId: this.state.propertyId,
        propertyTitle: this.state.propertyTitle,
        propertyType: this.state.propertyType
      }
      let obj = {
        url: config.baseUrl + config.postSPSendMessageAPI, body: postdata
      }
      let _this = this
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          let messagesArray = _this.state.chatData
          messagesArray.push(resObj.data.statusResult)
          let messagesList = _this.state.messagesList
          let index = messagesList.findIndex(x => x.spReadStatusGroup[0].propertyId === _this.state.propertyId)
          if (index >= 0) {
            let messageData = messagesList[index].spReadStatusGroup
            messageData[0].message = _this.state.message
            messagesList[index].spReadStatusGroup = messageData
          }
          _this.setState({ chatData: messagesArray, message: '', messagesList: messagesList })
        } else {
          _this.setState({ errorMessage: t`lanSPLabelErrorSendMessageFailed` })
        }
      })
    }
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
        alert(t`lanSPLabelErrorMessageUnreadFailed`)
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
        alert(t`lanSPLabelErrorMessageReadFailed`)
      }
    })
  }
  handleHome () {
    hashHistory.push('/host/home')
  }

  handleChat () {
    hashHistory.push('/inbox/chat')
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
                        <li className='breadcrumb-item active' aria-current='page'>{ t`lanSPTitleInbox` }</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container-fluid mt--6 pb-6'>
            <div className='row inbox justify-content-center'>
              <div className='col-md-12'>
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
                              <input type='search' className='form-control' value={this.state.searchString} onChange={this.handleSearchInputChange} placeholder={t`lanCommonLabelSearch`} />
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className='card-body'>
                    <section className='inbox'>
                      <div className='row clearfix'>
                        <div className='col-md-4 col-lg-4 col-xl-4 col-12 inbox-list-tab'>
                          <div className='sp-list-div'>
                            <div className='list-group list-group-flush'>
                              {this.state.messagesList && this.state.messagesList.length > 0 ? this.state.messagesList.map((info, i) => {
                                let data = info.spReadStatusGroup.length > 1 ? info.spReadStatusGroup[0].euReadStatus === 'Unread' ? info.spReadStatusGroup[0] : info.spReadStatusGroup[1] : info.spReadStatusGroup[0]
                                let currentDay = moment().format('MMM Do YY')
                                let yesterday = moment().subtract(1, 'day').format('MMM Do YY')
                                let messageDate = moment(data.createdOn).format('MMM Do YY')
                                let Time = messageDate === yesterday ? 'Yesterday' : messageDate === currentDay ? moment(data.createdOn).add(5, 'hours').add(30, 'minutes').format('LT') : messageDate
                                // let yesterday = moment(currentDay).subtract(1, 'day')
                                return (
                                  <a className='list-group-item list-group-item-action ' onClick={() => this.handleViewEachChat(info.spReadStatusGroup[0].propertyId, info._id.euUserId._id)} key={i} >
                                    <div className='row align-items-center'>
                                      <div className='col-2 p-0'>
                                        <img alt='Image placeholder' className='avatar rounded-circle' src={(info && info._id && info._id.euUserId && info._id.euUserId.userIconPath) ? config.baseUrl + info._id.euUserId.userIconPath
                                          : require('../../../../assets/profile-icon.png')} />
                                      </div>
                                      <div className='col-8 col-lg-8 col-sm-8'>
                                        <div className='d-flex justify-content-between align-items-center'>
                                          <div>
                                            <h4 className='mb-0 text-sm'>{data.euName}</h4>
                                            <h4 className='mb-0 text-sm'>{data.propertyTitle}</h4>
                                          </div>
                                          <div className='text-right text-muted'>
                                            <small>{Time}</small>
                                          </div>
                                        </div>
                                        <p className='text-sm mb-0 noOfLines'>{data.message}</p>
                                      </div>
                                      <div className='col-1 col-lg-1 col-sm-1 avatar rounded-circle'>
                                        { data.spReadStatus === 'Unread'
                                          ? <div className='text-right text-muted'>
                                            <small>{data.count}</small>
                                          </div>
                                          : ''
                                        }
                                      </div>
                                    </div>
                                  </a>
                                )
                              }) : <p>{ t`lanSPLabelNoMessagesAvailable` }</p>}
                            </div>
                          </div>
                        </div>
                        <div className='col-md-8 col-lg-8 col-xl-8 col-12'>
                          <div className='card-body'>
                            {this.state.chatData && this.state.chatData.length > 0 ? this.state.chatData.map((chat, i) => {
                              let isEUMessage = chat.messageBy === 'End User' ? 'true' : 'false'
                              let currentDay = moment().format('MMM DD, YY')
                              let yesterday = moment().subtract(1, 'day').format('MMM DD, YY')
                              let messageDate = moment(chat.createdOn).format('MMM DD, YY')
                              let Time = messageDate === yesterday ? 'Yesterday' : messageDate === currentDay ? moment(chat.createdOn).add(5, 'hours').add(30, 'minutes').format('LT') : messageDate
                              return (
                                <div key={i}>
                                  {isEUMessage === 'true'
                                    ? <div className={classnames('row justify-content-start ', { 'delete-selected' : this.state.deleteMessage })}>
                                      <div className='col-sm-7 py-2'>
                                        <a onClick={this.handleDelete}>
                                          <div className='sp-message bg-sp p-2 px-3 rounded-right' >
                                            <div className='d-flex justify-content-between '>
                                              <p className='sp-Text-property-title text-left mb-0'>{chat.euName} {this.state.deleteMessage}</p>
                                              <p className='sp-Text-property-title text-right mb-0'>{Time}</p>
                                            </div>
                                            {/* <p className='sp-Text-message mb-0'>area, city</p> */}
                                            <p className='sp-Text-message mb-0'>{chat.message}</p>
                                          </div>
                                        </a>
                                      </div>
                                    </div>
                                    : <div className='row justify-content-end'>
                                      <div className='col-sm-7 py-2'>
                                        <div className='eu-message bg-eu p-2 px-3 rounded-left'>
                                          <div className='d-flex justify-content-between '>
                                            <p className='eu-Text-property-title text-left mb-0'>you</p>
                                            <p className='eu-Text-property-title text-right mb-0'>{Time}</p>
                                          </div>
                                          <p className='eu-Text-message mb-0'>{chat.message}</p>
                                        </div>
                                      </div>
                                    </div>
                                    }
                                </div>
                              )
                            }) : <p>{ t`lanSPLabelNoMessagesAvailable` }</p>}
                            {/* <div className='row'>
                              <div className='col-md-8'><input type='search' className='form-control' placeholder={t`lanCommonLabelSearch`} value={this.state.message} onChange={this.handleInputChange} onKeyPress={this.handleEnterPressed} /></div>
                              <div className='col-md-3'><button className='btn btn-primary' type='button' onClick={this.handleSendMessage}>{t`lanSPButtonSend`}</button></div>
                            </div> */}
                            {this.state.messagesList && this.state.messagesList.length > 0
                              ? <div className='row'>
                                <div className='col-md-8'><input type='search' className='form-control' placeholder={t`lanSPLabelTypeHereToSendMessage`} value={this.state.message} onChange={this.handleInputChange} onKeyPress={this.handleEnterPressed} /></div>
                                <div className='col-md-3'><button className='btn btn-primary' type='button' onClick={this.handleSendMessage}>{t`lanSPButtonSend`}</button></div>
                              </div>
                              : '' }
                          </div>
                        </div>
                      </div>
                    </section>
                    {this.state.messagesList.length > 0
                    ? <div className='card-footer'>
                      <div className='row justify-content-center'>
                        <Pagination
                          activePage={this.state.activePage}
                          itemsCountPerPage={100}
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
