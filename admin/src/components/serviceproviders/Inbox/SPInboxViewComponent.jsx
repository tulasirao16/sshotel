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
import moment from 'moment'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import SPInboxSendMessageComponent from './SPInboxSendMessageComponent'
import { hashHistory } from 'react-router'

import { t } from 'ttag'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

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

class SPInboxViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      messagesData: this.props.selectedMessageData,
      messageStatus: this.props.selectedMessageData.spReadStatus,
      modalIsOpen: false,
      isShowMessageView: true,
      selectedMessageData: {},
      messagesList: [],
      searchString: '',
      activePage: 1,
      reload: false,
      noMessages: false
    }
    this.handleReplay = this.handleReplay.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleConfirmDeleteMessage = this.handleConfirmDeleteMessage.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentWillMount () {
    let _this = this
    if (this.state.messagesData.spReadStatus === 'Unread') {
      let setUnReadToRead = {
        url: config.baseUrl + config.putSPMessageUnreadToReadAPI + this.state.messagesData._id
      }
      APICallManager.putCall(setUnReadToRead, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ messageStatus: resObj.data.statusResult.spReadStatus, reload: true })
        }
      })
    }
  }
  handleConfirmDeleteMessage () {
    location.reload()
    let deleteData = {
      _id: this.state.messagesData._id
    }
    let _this = this
    let obj = {
      url: config.baseUrl + config.deleteSPMessageAPI, body: deleteData
    }
    APICallManager.postCall(obj, function (resObj) {
      _this.setState({ modalIsOpen: false })
      if (resObj.data.statusCode === '0000') {
        _this.props.handleInboxView(resObj.data.statusResult)
      } else {
        _this.setState({ errorMessage: 'Message Delete Failed' })
      }
    })
  }

  closeModal () {
    this.setState({ modalIsOpen: false })
  }

  handleReplay (data) {
    this.setState({
      isShowMessageView: !this.state.isShowMessageView,
      selectedMessageData: data
    })
  }
  handleDelete () {
    this.setState({ modalIsOpen: true })
  }
  handleHome () {
    hashHistory.push('/host/home')
  }

  render () {
    return (
      <div>
        {this.state.isShowMessageView
        ? <div>
          <div className='header bg-primary pb-6'>
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    {/* <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitleInbox`}</h6> */}
                    <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item'><a onClick={() => this.props.handleInboxView(this.state.messageStatus, this.state.messagesData)} >Inbox</a></li>
                        <li className='breadcrumb-item active' aria-current='page'>Read Message</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container mt--6 pb-3'>
            <div className='row inbox'>
              <div className='col-md-3'>
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
                      <div className='col-sm-8'>
                        <h3 className='box-title col-lg-6 col-5'>{ t`lanSPTitleReadMessage` }</h3>
                      </div>
                      <div className='col-sm-4 text-right'>
                        <button className='btn btn-primary mb-0' onClick={() => this.props.handleInboxView(this.state.messageStatus, this.state.messagesData)} >{ t`lanCommonButtonBack` }</button>
                      </div>
                    </div>
                  </div>
                  <div className='card-body inbox-read'>
                    <section className='inbox px-3'>
                      <div className='row clearfix'>
                        <div className='col-md-12 col-lg-12 col-xl-12'>
                          <div className='inbox'>
                            <div className='row clearfix'>
                              <div className='col-md-12 col-lg-12 col-xl-12'>
                                <div className='box-body no-padding'>
                                  <div className='mailbox-read-info'>
                                    <small className='notification-label'>{ t`lanCommonLabelFrom` }:</small>
                                    <h5 className='mb-0'>
                                      {this.state.messagesData.messageBy === 'Service Provider'
                                      ? ((this.state.messagesData.spUserId && this.state.messagesData.spUserId.userAccount) ? this.state.messagesData.spServiceProvider + ' ' +
                                        '(' + this.state.messagesData.spUserId.userAccount + ')' : this.state.messagesData.spServiceProvider)
                                      : this.state.messagesData.euUserId.displayName + '(' + this.state.messagesData.euUserId.userAccount + ')'}
                                    </h5>
                                  </div>
                                  <div className='mailbox-read-message mt-3'>
                                    <small className='notification-label'>{ t`lanCommonLabelMessage` }:</small>
                                    <h5 className='mb-0'>{this.state.messagesData.message}</h5>
                                  </div>
                                  <div className='mailbox-read-message mt-3'>
                                    <small className='notification-label'>{ t`lanCommonLabelTo` }:</small>
                                    <h5 className='mb-0'>{this.state.messagesData.messageBy === 'Service Provider' ? this.state.messagesData.euName + ' ' +
                                    '(' + this.state.messagesData.euUserId.userAccount + ')'
                                      : this.state.messagesData.spServiceProvider + ' '}{this.state.messagesData.messageBy === 'Service Provider' ? '' : (this.state.messagesData.spUserId && this.state.messagesData.spUserId.userAccount)
                                      ? '(' + this.state.messagesData.spUserId.userAccount + ')' : ''} </h5>
                                  </div>
                                  <div className='mailbox-read-message mt-3'>
                                    <small className='notification-label'>{ t`lanCommonLabelMessageOn` }:</small> <h5 className='mb-0'> {moment(this.state.messagesData.createdOn).add(5, 'hours').add(30, 'minutes').format('MMMM Do YYYY, h:mm a')} </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                  <div className='card-footer'>
                    <div className='pull-right'>
                      <button type='button' className='btn' onClick={() => this.handleReplay(this.state.messagesData)}><i className='fas fa-reply' /> Reply</button>
                      {/* <button type='button' className='btn'><i className='fa fa-share' /> Forward</button> */}
                    </div>
                    <button type='button' className='btn' onClick={() => this.handleDelete(this.state.messagesData)}><i className='fa fa-trash-o' /> Delete</button>
                    {/* <button type='button' className='btn'><i className='fa fa-print' /> Print</button> */}
                  </div>
                </div>
              </div>
            </div>
            <Modal isOpen={this.state.modalIsOpen} style={customStyles}>
              <h2 className='modal-text' >{t`lanCommonLabelDeleteNote`}</h2>
              <div className='row my-4 px-3'>
                <button className='btn btn-primary mr-2' onClick={this.handleConfirmDeleteMessage}>{t`lanCommonButtonConfirm`}</button>
                <button className='btn btn-danger' onClick={this.closeModal}>{t`lanCommonButtonCancel`}</button>
              </div>
            </Modal>
          </div>
        </div>
        : <SPInboxSendMessageComponent selectedMessageData={this.state.selectedMessageData} handleReplay={this.handleReplay} />
      }
      </div>

    )
  }
}

SPInboxViewComponent.propTypes = {
  selectedMessageData: PropTypes.any,
  handleInboxView: PropTypes.any
}

export default SPInboxViewComponent
