/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import moment from 'moment'
import PropTypes from 'prop-types'
import { hashHistory } from 'react-router'
import Modal from 'react-modal'
import 'react-drawer/lib/react-drawer.css'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import EUInboxSendMessageComponent from './EUInboxSendMessageComponent'
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

class EUInboxMessageViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      messageData: this.props.messageData,
      messageStatus: this.props.messageData.euReadStatus,
      modalIsOpen: false,
      isShowMessageView: true
    }
    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleDeleteMessage = this.handleDeleteMessage.bind(this)
    this.childFunction = this.childFunction.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }
  componentWillMount () {
    let _this = this
    if (this.state.messageData.euReadStatus === 'Unread') {
      let setUnReadToRead = {
        url: config.baseUrl + config.putEUInboxUnreadToReadAPI + this.state.messageData._id
      }
      APICallManager.putCall(setUnReadToRead, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ messageStatus: resObj.data.statusResult.euReadStatus, reload: true })
        }
      })
    }
  }
  handleHome (event) {
    hashHistory.push('/hotels')
    event.preventDefault()
  }
  handleDeleteMessage () {
    this.setState({ modalIsOpen: false })
    let postJson = {
      messageIDs: [this.state.messageData._id]
    }
    let obj = { url: config.baseUrl + config.deleteEUInboxMessageAPI, body: postJson }
    let _this = this
    APICallManager.putCall(obj, function (delResObj) {
      if (delResObj.data.statusCode === '0000') {
        _this.props.commonFunction(_this.state.messageStatus, _this.state.messageData, 'delete')
      } else {
        alert(t`lanEULabelErrorMessageDeleteFailed`)
      }
    })
  }
  handleSendMessage () {
    this.setState({ isShowMessageView: false })
  }
  handleBack () {
    this.props.commonFunction(this.state.messageStatus, this.state.messageData, 'status')
  }
  childFunction (type) {
    if (type === 'back') {
      this.setState({ isShowMessageView: true })
    } else {
      this.setState({ isShowMessageView: true })
      this.props.commonFunction(this.state.messageStatus, this.state.messageData, 'list')
    }
  }
  render () {
    return (
      <div>
        {this.state.isShowMessageView
          ? <div className='main-content-view-msg-eu' id='panel'>
            <div className='header bg-primary pb-6'>
              <div className='container-fluid'>
                <div className='header-body'>
                  <div className='row align-items-center pt-7 pb-5'>
                    <div className='col-lg-6 col-7'>
                      <nav aria-label='breadcrumb eu' className='d-md-inline-block ml-md-4'>
                        <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                          <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                          <li className='breadcrumb-item'><a onClick={this.handleBack}>{t`lanEUTitleInbox`}</a></li>
                          <li className='breadcrumb-item active' aria-current='page'><a >{t`lanEUTitleReadMessage`}</a></li>
                        </ol>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='container mt--6 pb-4'>
              <div className='row justify-content-center inbox'>
                <div className='col-md-10'>
                  <div className='card mb-2'>
                    <div className='card-header'>
                      <h3 className='box-title'>{t`lanEUTitleReadMessage`}</h3>
                    </div>
                    <div className='card-body'>
                      <section className='inbox'>
                        <div className='row clearfix'>
                          <div className='col-md-12 col-lg-12 col-xl-12'>
                            <div className='inbox'>
                              <div className='row clearfix'>
                                <div className='col-md-12 col-lg-12 col-xl-12'>
                                  <div className='box-body no-padding'>
                                    <div className='mailbox-read-info'>
                                      <small>{t`lanCommonLabelFrom`}:</small>
                                      <span className='mailbox-read-time pull-right'>{moment(this.state.messageData.createdOn).add(5, 'hours').add(30, 'minutes').format('MMMM Do YYYY, h:mm a')}</span>
                                      <h5 className='mb-0 text-sm' > {this.state.messageData.messageBy === 'End User'
                                        ? this.state.messageData.euUserId.displayName + '(' + this.state.messageData.euUserId.userAccount + ')'
                                        : ((this.state.messageData.spUserId && this.state.messageData.spUserId.userAccount) ? this.state.messageData.spServiceProvider + ' ' +
                                          '(' + this.state.messageData.spUserId.userAccount + ')' : this.state.messageData.spServiceProvider)}
                                      </h5>
                                    </div>
                                    {/* mailbox-controls */}
                                    <div className='mailbox-read-message mt-1'>
                                      <small>{t`lanCommonLabelTo`}:</small>
                                      <h5 className='mb-0 text-sm' > {this.state.messageData.messageBy === 'End User'
                                        ? ((this.state.messageData.spUserId && this.state.messageData.spUserId.userAccount) ? this.state.messageData.spServiceProvider + ' ' +
                                          '(' + this.state.messageData.spUserId.userAccount + ')' : this.state.messageData.spServiceProvider)
                                        : this.state.messageData.euUserId.displayName + '(' + this.state.messageData.euUserId.userAccount + ')'}
                                      </h5>
                                      <small className='pt-2'>{this.state.messageData.message}</small>
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
                        <button onClick={this.handleSendMessage} type='button' className='btn'><i className='fas fa-reply' /> {t`lanEUButtonReply`}</button>
                        <button type='button' className='btn' onClick={() => this.setState({ modalIsOpen: true })}><i className='fas fa-trash text-error' /> {t`lanCommonButtonDelete`}</button>
                      </div>
                    </div>
                  </div>
                </div>
                <Modal isOpen={this.state.modalIsOpen} style={customStyles}>
                  <div className='container modalOne'>
                    <div className='row my-2'>
                      <div className='col-sm-12 text-right'>
                        <a onClick={() => this.setState({ modalIsOpen: false })} ><i className='fas fa-times' /> </a>
                      </div>
                      <div className='col-sm-12 m-3'>
                        <p>{t`lanCommonLabelDeleteNote`}</p>
                      </div>
                    </div>
                    <div className='row my-3'>
                      <div className='col-sm-12 text-center'>
                        <button className='btn btn-primary mr-2' onClick={this.handleDeleteMessage}>{t`lanCommonButtonConfirm`}</button>
                        <button className='btn btn-danger' onClick={() => this.setState({ modalIsOpen: false })}>{t`lanCommonButtonCancel`}</button>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
          : <EUInboxSendMessageComponent childFunction={this.childFunction} messageData={this.state.messageData} />
        }
        {/* <FooterComponent /> */}
      </div>
    )
  }
}
EUInboxMessageViewComponent.propTypes = {
  messageData: PropTypes.any,
  commonFunction: PropTypes.any
}

export default EUInboxMessageViewComponent
