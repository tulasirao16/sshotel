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
import PropTypes from 'prop-types'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

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

class ADEUInboxListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      userData: JSON.parse(localStorage.getItem('userData')),
      inboxListData: [],
      chatList: [],
      activePage: 1,
      searchString: '',
      totalCount: 0,
      messagestotalCount: 0,
      deleteData: {},
      isMessageList: true,
      modalIsOpen: false,
      reload: false,
      message: '',
      spServiceProvider: '',
      spServiceProviderId: '',
      propertyId: '',
      propertyTitle: '',
      propertyType: '',
      chatData: [],
      messagesfor: localStorage.getItem('messagesfor')
    }
    this.handleClickSearch = this.handleClickSearch.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleMessageStatus = this.handleMessageStatus.bind(this)
    this.unreadMessage = this.unreadMessage.bind(this)
    this.handleReadMessages = this.handleReadMessages.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.commonFunction = this.commonFunction.bind(this)
    this.handleConfirmDeleteMessage = this.handleConfirmDeleteMessage.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleViewEachChat = this.handleViewEachChat.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleEnterPressed = this.handleEnterPressed.bind(this)
    this.handleEnterKey = this.handleEnterKey.bind(this)
    this.handleEndUsers = this.handleEndUsers.bind(this)
  }
  componentWillMount () {
    let obj = { url: config.baseUrl + config.getADEUChatListAPI + this.state.userData._id + '/' + this.state.activePage + '/' }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.handleViewEachChat(resObj.data.statusResult.messageData[0]._id._id)
        _this.setState({ chatList: resObj.data.statusResult.messageData, totalCount: resObj.data.statusResult.totalDocs })
      } else {
        _this.handleViewEachChat('')
        _this.setState({ chatList: [], totalCount: 0 })
      }
    })
  }
  componentDidMount () {
    window.onhashchange = () => {
      event.preventDefault()
    }
  }
  handleEnterKey = (event) => {
    if (event.charCode === 13) {
      // this.handleClickSearch()
      event.preventDefault()
    }
  }
  handleClickSearch (event) {
    let search = this.state.searchString
    // this.setState({ searchString: event.target.value })
    let obj = { url: config.baseUrl + config.getADEUChatListAPI + this.state.userData._id + '/' + this.state.activePage + '/' + search }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ chatList: resObj.data.statusResult.messageData, totalCount: resObj.data.statusResult.totalDocs })
      } else {
        _this.setState({ chatList: [], totalCount: resObj.data.statusResult.totalDocs })
      }
    })
    event.preventDefault()
  }
  handlePageChange (pageNumber) {
    if (this.state.activePage !== pageNumber) {
      this.setState({ activePage: pageNumber })
      let obj = { url: config.baseUrl + config.getADEUChatListAPI + this.state.userData._id + '/' + pageNumber + '/' + this.state.searchString }
      let _this = this
      APICallManager.getCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ chatList: resObj.data.statusResult.messageData, totalCount: resObj.data.statusResult.totalDocs })
        } else {
          _this.setState({ chatList: [], totalCount: resObj.data.statusResult.totalDocs })
        }
      })
    }
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
    let obj = { url: config.baseUrl + config.putADEUInboxReadToUnreadAPI + messageObj._id }
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
        ToastsStore.error(t`lanEULabelErrorMessageUnreadFailed`)
      }
    })
  }
  handleReadMessages (propertyId) {
    let chatList = this.state.chatList
    let index = chatList.findIndex(x => x._id._id === propertyId)
    let unreadIndex = chatList[index].euReadStatusGroup.findIndex(y => y.euReadStatus === 'Unread')
    let euReadStatusGroup = chatList[index].euReadStatusGroup
    // eslint-disable-next-line max-len
    if ((euReadStatusGroup.length > 1 && (euReadStatusGroup[0].euReadStatus === 'Unread' || euReadStatusGroup[1].euReadStatus === 'Unread')) || euReadStatusGroup.length === 1 && euReadStatusGroup[0].euReadStatus === 'Unread') {
      let _this = this
      let obj = { url: config.baseUrl + config.putADEUReadMessagesAPI + propertyId }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          if (unreadIndex >= 0) {
            chatList[index].euReadStatusGroup[unreadIndex].euReadStatus = 'Read'
            _this.setState({ chatList: chatList })
          }
        }
      })
    }
  }
  handleDelete (item) {
    this.setState({ modalIsOpen: true, deleteData: item })
  }
  handleConfirmDeleteMessage () {
    let postJson = {
      messageIDs: [this.state.deleteData._id]
    }
    this.setState({ reload: true, modalIsOpen: false })
    let obj = { url: config.baseUrl + config.deleteADEUInboxMessageAPI, body: postJson }
    let _this = this
    APICallManager.putCall(obj, function (delResObj) {
      _this.setState({ reload: false, deleteData: {}, modalIsOpen: false })
      if (delResObj.data.statusCode === '0000') {
        let obj = { url: config.baseUrl + config.getADEUChatListAPI + this.state.userData._id + '/' + this.state.activePage + '/' }
        APICallManager.getCall(obj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            _this.setState({ inboxListData: resObj.data.statusResult.messageData, totalCount: resObj.data.statusResult.totalDocs })
          } else {
            _this.setState({ inboxListData: [], totalCount: 0 })
          }
        })
      } else {
        ToastsStore.error(t`lanEULabelErrorMessageDeleteFailed`)
      }
    })
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
      let obj = { url: config.baseUrl + config.getADEUChatListAPI + this.state.userData._id + '/' + this.state.activePage + '/' }
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
    hashHistory.push('/admin/home')
    event.preventDefault()
  }

  handleEndUsers (event) {
    hashHistory.push('/admin/eu-users')
    event.preventDefault()
  }
  handleViewEachChat (propertyId) {
    let propertyDetails = JSON.parse(localStorage.getItem('propertyDetails'))
    let obj = {}
    if (propertyDetails && propertyDetails.spPropertyId) {
      let propertyID = propertyDetails.spPropertyId && propertyDetails.spPropertyId._id ? propertyDetails.spPropertyId._id : propertyDetails.spPropertyId
      localStorage.removeItem('propertyDetails')
      this.setState({
        spServiceProvider: propertyDetails.spServiceProvider,
        spServiceProviderId: propertyDetails.spServiceProviderId,
        propertyId: propertyDetails.spPropertyId,
        propertyTitle: propertyDetails.spPropertyTitle,
        propertyType: propertyDetails.spPropertyType
      })
      obj = { url: config.baseUrl + config.getADEUConversationAPI + this.state.userData._id + '/' + propertyID + '/' + '1/' }
    } else {
      obj = { url: config.baseUrl + config.getADEUConversationAPI + this.state.userData._id + '/' + propertyId + '/' + '1/' }
    }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.handleReadMessages(propertyId)
        _this.setState({
          chatData: resObj.data.statusResult.messagesData.reverse(),
          messagestotalCount: resObj.data.statusResult.totalDocs,
          spServiceProvider: resObj.data.statusResult.messagesData[0].spServiceProvider,
          spServiceProviderId: resObj.data.statusResult.messagesData[0].spServiceProviderId,
          propertyId: resObj.data.statusResult.messagesData[0].propertyId,
          propertyTitle: resObj.data.statusResult.messagesData[0].propertyTitle,
          propertyType: resObj.data.statusResult.messagesData[0].propertyType
        })
      } else {
        _this.setState({ chatData: [], messagestotalCount: 0 })
      }
    })
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
    let userData = JSON.parse(localStorage.getItem('userData'))
    if (!this.state.message) {
      this.setState({ errorMessage: t`lanSPLabelErrorPleaseEnterMessage` })
    } else {
      let postdata = {
        message: this.state.message,
        spServiceProviderId: this.state.spServiceProviderId,
        spServiceProvider: this.state.spServiceProvider,
        messagedBy: 'End User',
        propertyId: this.state.propertyId,
        propertyTitle: this.state.propertyTitle,
        propertyType: this.state.propertyType,
        euName: userData.name,
        euUserId: userData._id
      }
      let obj = {
        url: config.baseUrl + config.postADEUSendMessageAPI, body: postdata
      }
      let _this = this
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          let messagesArray = _this.state.chatData
          messagesArray.push(resObj.data.statusResult)
          let chatList = _this.state.chatList
          let index = chatList.findIndex(x => x._id._id === _this.state.propertyId)
          if (index >= 0) {
            let messageData = chatList[index].euReadStatusGroup
            let i = messageData.length > 1 ? messageData[0].euReadStatus === 'Unread' ? 0 : 1 : 0
            messageData[i].message = _this.state.message
            chatList[index].euReadStatusGroup = messageData
          }
          _this.setState({ chatData: messagesArray, message: '', chatList: chatList })
        } else {
          ToastsStore.error(t`lanEULabelErrorSendMessageFailed`)
          // _this.setState({ errorMessage: 'Send Message Failed' })
        }
      })
    }
  }
  componentWillUnmount () {
    localStorage.removeItem('messagesfor')
  }
  render () {
    return (
      <div>
        <div className='enduser-inbox-list'>
          <div className='header bg-primary pb-6'>
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='row align-items-center pt-3 pb-3'>
                  <div className='col-lg-6 col-3'>
                    <h6 className='h2 text-white d-inline-block mb-0'>{t`lanADEUTitleAdminEUUsers`}</h6>
                    <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        {this.state.messagesfor === 'euusermesseges'
                      ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item' />
                        <li className='breadcrumb-item'><a onClick={this.handleEndUsers}>EU Users</a></li>
                        <li className='breadcrumb-item' aria-current='page'><a onClick={this.props.handleBookingsBack}>{t`lanCommonTitleBookings`}</a></li>
                        <li className='breadcrumb-item active' aria-current='page'>{t`lanEUTitleInbox`}</li>
                      </ol>
                       : <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                         <li className='breadcrumb-item' />
                         <li className='breadcrumb-item active eu-font'><a onClick={this.handleEndUsers}>{t`lanEndUsersTitleList`}</a></li>
                         <li className='breadcrumb-item active eu-font' aria-current='page'>{t`lanEUTitleInbox`}</li>
                       </ol>
                        }
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container  mt--6 pb-4'>
            <div className='row justify-content-center inbox'>
              <div className='col-md-12'>
                <div className='card mb-2'>
                  <div className='card-header py-2'>
                    <div className='row '>
                      <div className='col-sm-7'>
                        <h6 className='h2 text-primary d-inline-block pt-2'>{t`lanEUTitleInbox`}</h6>
                      </div>
                      <div className='col-sm-4'>
                        {/* -- Search form -- */}
                        <form>
                          <div className='form-group mb-0'>
                            <div className='input-group input-group-lg input-group-flush'>
                              <div className='input-group-prepend'>
                                <div className='input-group-text'>
                                  <span className='fas fa-search' />
                                </div>
                              </div>
                              <input type='search' className='form-control' placeholder='Search' value={this.state.searchString}
                                onKeyPress={this.handleEnterKey} onChange={(e) => { this.setState({ searchString: e.target.value }) }} />
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className='col-sm-1'>
                        <button className='btn btn-icon btn-primary px-3 py-2' type='button' onClick={this.handleClickSearch}>
                          <span className='btn-inner--icon'><i className='fa fa-search' /></span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className='card-body'>
                    <section className='eu-inbox'>
                      <div className='row clearfix'>
                        <div className='col-md-4 col-lg-4 col-xl-4 col-12 inbox-list-tab'>
                          <div className='sp-list-div'>
                            <div className='list-group list-group-flush'>
                              {this.state.chatList && this.state.chatList.length > 0 ? this.state.chatList.map((info, i) => {
                                let data = info.euReadStatusGroup.length > 1 ? info.euReadStatusGroup[0].euReadStatus === 'Unread' ? info.euReadStatusGroup[0] : info.euReadStatusGroup[1] : info.euReadStatusGroup[0]
                                let currentDay = moment().format('MMM Do YY')
                                let yesterday = moment().subtract(1, 'day').format('MMM Do YY')
                                let messageDate = moment(data.createdOn).format('MMM Do YY')
                                let Time = messageDate === yesterday ? 'Yesterday' : messageDate === currentDay ? moment(data.createdOn).add(5, 'hours').add(30, 'minutes').format('LT') : messageDate
                                // let yesterday = moment(currentDay).subtract(1, 'day')
                                return (
                                  <a className='list-group-item list-group-item-action ' onClick={() => this.handleViewEachChat(info._id._id)} key={i}>
                                    <div className='row align-items-center'>
                                      <div className='col-2 p-0'>
                                        <img alt='Image placeholder' className='avatar rounded-circle' src={(info && info._id && info._id.imagePath) ? config.baseUrl + info._id.imagePath
                                          : require('../../../../assets/profile-icon.png') ? require('../../../../assets/profile-icon.png') : null} />
                                      </div>
                                      <div className='col-8 col-lg-8 col-sm-8'>
                                        <div className='d-flex justify-content-between align-items-center'>
                                          <div>
                                            <h4 className='mb-0 text-sm'>{data.propertyTitle}</h4>
                                          </div>
                                          <div className='text-right text-muted'>
                                            <small>{Time}</small>
                                          </div>
                                        </div>
                                        <p className='text-sm mb-0 noOfLines'>{data.message}</p>
                                      </div>
                                      <div className='col-1 col-lg-1 col-sm-1 avatar rounded-circle'>
                                        { data.euReadStatus === 'Unread'
                                          ? <div className='text-right text-muted'>
                                            <small>{data.count}</small>
                                          </div>
                                          : ''
                                        }
                                      </div>
                                    </div>
                                  </a>
                                )
                              }) : <p>No Data Found</p>}
                            </div>
                          </div>
                          <div className='card-footer'>
                            <div className='text-center'>
                              <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={100}
                                totalItemsCount={this.state.totalCount}
                                pageRangeDisplayed={5}
                                onChange={(pageNumber) => this.handlePageChange(pageNumber)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className='col-md-8 col-lg-8 col-xl-8 col-12'>
                          <div className='card-body'>
                            <h1>{this.state.propertyTitle}</h1>
                            {this.state.chatData && this.state.chatData.length > 0 ? this.state.chatData.map((chat, i) => {
                              let isEUMessage = chat.messageBy === 'End User' ? 'true' : 'false'
                              let currentDay = moment().format('MMM DD, YY')
                              let yesterday = moment().subtract(1, 'day').format('MMM DD, YY')
                              let messageDate = moment(chat.createdOn).format('MMM DD, YY')
                              let Time = messageDate === yesterday ? 'Yesterday' : messageDate === currentDay ? moment(chat.createdOn).add(5, 'hours').add(30, 'minutes').format('LT') : messageDate
                              return (
                                <div key={i}>
                                  {isEUMessage === 'false'
                                    ? <div className={classnames('row justify-content-start ', { 'delete-selected' : this.state.deleteMessage })}>
                                      <div className='col-sm-7 py-2'>
                                        <a onClick={this.handleDelete}>
                                          <div className='sp-message bg-sp p-2 px-3 rounded-right' >
                                            <div className='d-flex justify-content-between '>
                                              <p className='sp-Text-property-title text-left mb-0'>{chat.propertyTitle} {this.state.deleteMessage}</p>
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
                            }) : <p>No Messages Yet</p>}
                            {this.state.propertyTitle && this.state.propertyTitle.length > 0
                            ? <div className='row'>
                              <div className='col-lg-10 col-sm-10 col-10'>
                                <input type='text' className='form-control chat-textBox' placeholder='Type here to send message' value={this.state.message}
                                  onChange={this.handleInputChange} onKeyPress={this.handleEnterPressed} />
                              </div>
                              <div className='col-lg-2 col-sm-2 col-2 pl-0'>
                                <div className='send-circle '>
                                  <button className='rounded-circle inbox-send-button btn-primary' onClick={this.handleSendMessage}><i className='fa fa-paper-plane' style={{ fontSize: 16 }} /></button>
                                </div>
                              </div>
                            </div> : null}
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal style={customStyles}>
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
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}
ADEUInboxListComponent.propTypes = {
  handleBookingsBack: PropTypes.func
}

export default ADEUInboxListComponent

