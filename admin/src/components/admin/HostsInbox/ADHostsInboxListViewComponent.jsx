/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import PropTypes from 'prop-types'
import { t } from 'ttag'
import { hashHistory } from 'react-router'
import Modal from 'react-modal'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

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

class ADHostsInboxListViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      messagesData: this.props.selectedMessageData,
      modalIsOpen: false,
      errorMessage: ''
    }
    this.handleHome = this.handleHome.bind(this)
    this.handleHosts = this.handleHosts.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleConfirmDeleteMessage = this.handleConfirmDeleteMessage.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleHostDashboard = this.handleHostDashboard
  }
  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleHosts () {
    hashHistory.push('/admin/hosts')
  }
  handleConfirmDeleteMessage () {
    let _this = this
    let obj = {
      url: config.baseUrl + config.deleteADMessageAPI + this.state.messagesData._id
    }
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ modalIsOpen: false })
        window.location.reload()
      } else {
        ToastsStore.error(t`lanEULabelMessageDeleteFailed`)
        // _this.setState({ errorMessage: 'Message Delete Failed' })
      }
    })
  }
  closeModal () {
    this.setState({ modalIsOpen: false })
  }
  handleDelete () {
    this.setState({ modalIsOpen: true })
  }
  componentWillUnmount () {
    localStorage.removeItem('messagesBy')
    localStorage.removeItem('propertiesBy')
  }
  handleHostDashboard () {
    hashHistory.push('admin/host-dashboard')
  }
  handlePropertiesList () {
    localStorage.setItem('propertiesBy', 'Dashboard')
    hashHistory.push('/admin/host/property/bookings')
  }
  render () {
    return (
      <div className='main-content-view-msg-eu' id='panel'>
        <div className='header bg-primary pt-4 pb-5'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center pb-5'>
                <div className='col-lg-6 col-7'>
                  <nav aria-label='breadcrumb eu' className='d-md-inline-block ml-md-4'>
                    { this.state.propertiesBy === 'Dashboard' && this.state.messagesBy === 'hostdashboard'
                    ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={this.handlePropertiesList} >{t`lanSPTitlePropertiesList`}</a></li>
                      <li className='breadcrumb-item'><a onClick={this.handlePropertiesList}>Bookings-Page</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>Inbox List</li>
                    </ol>
                    : this.state.messagesBy === 'hostdashboard'
                     ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                       <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                       <li className='breadcrumb-item '><a onClick={this.handleHosts}>Host List</a></li>
                       <li className='breadcrumb-item ' aria-current='page'><a onClick={this.handleHostDashboard}>Host Dashboard</a></li>
                       <li className='breadcrumb-item'><a onClick={() => this.props.handleInboxView()}>{t`lanEUTitleInbox`}</a></li>
                       <li className='breadcrumb-item active' aria-current='page'>View Message</li>
                     </ol>
                     : <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                       <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                       <li className='breadcrumb-item'><a onClick={this.handleHosts}>Hosts List</a></li>
                       <li className='breadcrumb-item'><a onClick={() => this.props.handleInboxView()}>{t`lanEUTitleInbox`}</a></li>
                       <li className='breadcrumb-item active' aria-current='page'>View Message</li>
                     </ol>
                    }
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
                {/* <div className='card-header'>
                  <h3 className='box-title'>{t`View Message`}</h3>
                </div> */}
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
                                  <h5 className='mb-0'>
                                    {this.state.messagesData.messageBy === 'Service Provider'
                                      ? (this.state.messagesData.spServiceProvider)
                                      : this.state.messagesData.euName}
                                  </h5>
                                </div>
                                {/* mailbox-controls */}
                                <div className='mailbox-read-message mt-3'>
                                  <small className='notification-label'>{t`lanCommonLabelMessage`}:</small>
                                  <h5 className='mb-0'>{this.state.messagesData.message}</h5>
                                </div>
                                <div className='mailbox-read-message mt-1'>
                                  <small>{t`lanCommonLabelTo`}:</small>
                                  <h5 className='mb-0'>{this.state.messagesData.messageBy === 'Service Provider' ? this.state.messagesData.euName
                                    : this.state.messagesData.spServiceProvider + ' '} </h5>
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
          </div>

          <Modal isOpen={this.state.modalIsOpen} style={customStyles}>
            <h2 className='modal-text' >{t`lanCommonLabelDeleteNote`}</h2>
            <div className='row my-4 px-3'>
              <label className='text-danger' >{this.state.errorMessage}</label>
              <button className='btn btn-primary mr-2' onClick={this.handleConfirmDeleteMessage}>{t`lanCommonButtonConfirm`}</button>
              <button className='btn btn-danger' onClick={this.closeModal}>{t`lanCommonButtonCancel`}</button>
            </div>
          </Modal>
        </div>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}
ADHostsInboxListViewComponent.propTypes = {
  selectedMessageData: PropTypes.any,
  handleInboxView: PropTypes.any
}
export default ADHostsInboxListViewComponent

