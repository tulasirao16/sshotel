/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import PropTypes from 'prop-types'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'

class EUInboxSendMessageComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      messageData: this.props.messageData,
      message: '',
      errorMessage: ''
    }
    this.handleBack = this.handleBack.bind(this)
    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }

  handleBack () {
    this.props.childFunction('back')
  }
  handleSendMessage () {
    let postJson = {}
    if (!this.state.message.trim()) {
      this.setState({ errorMessage: t`lanEULabelErrorMessageRequired` })
    } else {
      if (this.state.messageData.spServiceProviderId) {
        postJson = {
          spServiceProviderId: this.state.messageData.spServiceProviderId,
          spServiceProvider: this.state.messageData.spServiceProvider,
          spUserId: this.state.messageData.spPropertyId && this.state.messageData.spPropertyId.createdById ? this.state.messageData.spPropertyId.createdById : this.state.messageData.spUserId,
          spName: this.state.messageData.spName ? this.state.messageData.spName : '',
          message: this.state.message,
          euName: this.state.messageData.euName,
          messagedBy: 'End User',
          from: 'Service Provider'
        }
      } else {
        postJson = {
          adminUserId: this.state.messageData.adminUserId,
          adminName: this.state.messageData.adminName,
          message: this.state.message,
          euName: this.state.messageData.euName,
          messagedBy: 'End User',
          from: 'Admin'
        }
      }
      let obj = {
        url: config.baseUrl + config.postEUSendMessageAPI, body: postJson
      }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          location.reload()
        } else {
          alert(t`lanEULabelErrorSendMessageFailed`)
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
      <div className='main-content-send-msg-eu enduser' id='panel'>
        {/* ------- Navbar --------- */}
        {/* <MainHeader /> */}
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center pt-7 pb-5'>
                <div className='col-lg-6 col-7'>
                  {/* <h6 className='h2 text-white d-inline-block mb-0'>{t`lanEUTitleInbox`}</h6> */}
                  <nav aria-label='breadcrumb eu' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleBack} >{t`lanEUTitleInbox`}</a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleBack} >{t`lanEUTitleReadMessage`}</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>{t`lanEUTitleSendMessage`}</li>
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
                  <h3 className='box-title'>{t`lanEUTitleSendMessage`}</h3>
                </div>
                <div className='card-body'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <small className='form-control-label' id='exampleFormControlInput1'>{t`lanCommonLabelTo`}</small>
                        <input className='form-control' id='exampleFormControlInput1' value={this.state.messageData.messageBy === 'Service Provider'
                          ? ((this.state.messageData.spUserId && this.state.messageData.spUserId.userAccount) ? this.state.messageData.spServiceProvider + ' ' +
                            '(' + this.state.messageData.spUserId.userAccount + ')' : this.state.messageData.spServiceProvider)
                          : this.state.messageData.spServiceProvider} />
                      </div>
                    </div>
                    <div className='col-sm-10 col-12'>
                      <div className='form-group'>
                        <small className='form-control-label' id='exampleFormControlTextarea1'>{t`lanCommonLabelMessage`}</small>
                        <textarea className='form-control' id='exampleFormControlTextarea1' placeholder='Write Message' rows='3' value={this.state.message}
                          onChange={(event) => this.setState({ message: event.target.value, errorMessage: '' })} />
                      </div>
                    </div>
                    <div className='col-sm-12 col-12 text-center'>
                      <p className='error'>{this.state.errorMessage}</p>
                      <button onClick={this.handleSendMessage} className='btn btn-primary' type='button'>{t`lanEUButtonSend`}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <FooterComponent /> */} 
      </div>
    )
  }
}
EUInboxSendMessageComponent.propTypes = {
  childFunction: PropTypes.any,
  messageData: PropTypes.any
}
export default EUInboxSendMessageComponent
