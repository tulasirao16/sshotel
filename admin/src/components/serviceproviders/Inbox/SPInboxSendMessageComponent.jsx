/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import { t } from 'ttag'
import PropTypes from 'prop-types'
import 'react-drawer/lib/react-drawer.css'
import { hashHistory } from 'react-router'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPInboxSendMessageComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      messagesData: this.props.selectedMessageData
    }
    this.handleSend = this.handleSend.bind(this)
  }
  componentWillReceiveProps (newProps) {
    this.setState({ messagesData: newProps.selectedMessageData })
  }
  handleSend () {
    location.reload()
    if (!this.state.message) {
      this.setState({ errorMessage: t`lanSPLabelErrorPleaseEnterMessage` })
    } else {
      if (this.state.messagesData.spServiceProviderId) {
        let postdata = {
          spServiceProviderId: this.state.messagesData.spServiceProviderId,
          spServiceProvider: this.state.messagesData.spServiceProvider,
          message: this.state.message,
          euName: this.state.messagesData.euName,
          euUserId: this.state.messagesData.euUserId,
          messagedBy: 'Service Provider',
          from: 'End User'
        }
        let obj = {
          url: config.baseUrl + config.postSPSendMessageAPI, body: postdata
        }
        let _this = this
        APICallManager.postCall(obj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
           // _this.props.handleReplay(resObj.data.statusResult)
          } else {
            _this.setState({ errorMessage: 'Send Message Failed' })
          }
        })
      } else {
        let postdata = {
          adminUserId: this.state.messagesData.adminUserId,
          adminName: this.state.messagesData.adminName,
          message: this.state.message,
          spServiceProvider: this.state.messagesData.spServiceProvider,
          euName: this.state.messagesData.euName,
          messagedBy: 'Service Provider',
          from: 'Admin'
        }
        let obj = {
          url: config.baseUrl + config.postSPSendMessageAPI, body: postdata
        }
        let _this = this
        APICallManager.postCall(obj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            _this.props.handleReplay(resObj.data.statusResult)
          } else {
            _this.setState({ errorMessage: 'Send Message Failed' })
          }
        })
      }
    }
  }

  handleHome () {
    hashHistory.push('/host/home')
  }

  render () {
    return (
      <div>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  {/* <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitleInbox`}</h6> */}
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a >Inbox</a></li>
                      <li className='breadcrumb-item'><a onClick={() => this.props.handleReplay(this.state.messagesData)} >Read Message</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>Reply</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='main-content' id='panel'>
          <div className='container mt--6'>
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
                        <h3 className='box-title col-lg-6 col-5'>{ t`lanSPTitleSendMessage` }</h3>
                      </div>
                      <div className='col-sm-4 text-right'>
                        <button className='btn btn-primary mb-0' onClick={() => this.props.handleReplay(this.state.messagesData)}>{ t`lanCommonButtonBack` }</button>
                      </div>
                    </div>
                  </div>
                  <div className='card-body'>
                    <div className='row px-3'>
                      <div className='col-md-6'>
                        <form>
                          <div className='form-group'>
                            <label className='form-control-label'>{ t`lanCommonLabelTo` }</label>
                            <input type='text' className='form-control' value={this.state.messagesData.messageBy === 'Service Provider'
                              ? ((this.state.messagesData.spUserId && this.state.messagesData.spUserId.userAccount) ? this.state.messagesData.spServiceProvider + ' ' + '(' + this.state.messagesData.spUserId.userAccount + ')' : this.state.messagesData.spServiceProvider)
                              : this.state.messagesData.euUserId.displayName + '(' + this.state.messagesData.euUserId.userAccount + ')'} />
                          </div>
                        </form>
                      </div>
                      <div className='col-md-12'>
                        <div className='form-group'>
                          <label className='form-control-label' >{ t`lanCommonLabelMessage` }</label>
                          <textarea className='form-control' rows='3' id='message' value={this.state.message} onChange={() => this.setState({ message: event.target.value, errorMessage: '' })}
                            underlineColorAndroid='transparent'
                            multiline='true'
                            editable='true' />
                        </div>
                      </div>
                      <div className='col-sm-12'>
                        <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
                      </div>
                      <div className='col-sm-12 text-center'>
                        <button type='button' className='btn btn-primary mt-2' onClick={this.handleSend}>{t`lanSPButtonSend`}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}
SPInboxSendMessageComponent.propTypes = {
  selectedMessageData: PropTypes.any,
  handleReplay: PropTypes.any
}

export default SPInboxSendMessageComponent
