/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import { t } from 'ttag'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

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

class SPNotificationsDeleteComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      notificationObj: [],
      notifyIDs: '',
      errorMessage: '',
      selectedDeleteData: this.props.selectedDeleteData,
      handleViewBack: this.props.handleViewBack,
      handleUserDelete: this.props.handleUserDelete,
      modalIsOpen: false
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleConfirmDeleteNotification = this.handleConfirmDeleteNotification.bind(this)
  }
  componentWillMount () {
  }
  handleDelete () {
    this.setState({ modalIsOpen: true })
  }
  closeModal () {
    this.setState({ modalIsOpen: false })
  }
  handleConfirmDeleteNotification () {
    this.setState({ modalIsOpen: false })
    let obj = { url: config.baseUrl + config.deleteSPNotificationsDeleteAPI,
      body: {
        notifyIDs: this.state.selectedDeleteData._id
      }
    }
    let _this = this
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.props.handleUserDelete(true, _this.state.selectedDeleteData)
      } else {
        _this.setState({ errorMessage: t`lanSPErrorDeleteFailed` })
      }
    })
  }
  handleBack () {
    this.props.handleViewBack()
  }

  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        <div className='container-fluid mt--6 pb-4'>
          <div className='row justify-content-center '>
            <div className='col-lg-8 card-wrapper mb-7'>
              <div className='card mb-2'>
                <div className='card-header bg-transparent px-5 pb-3'>
                  <h5 className='card-title'>{t`lanSPTitleNotificationDelete`}</h5>
                </div>
                <div className='card-body mx-4'>
                  <section className='notifications notifictions-list'>
                    <div className='row clearfix justify-content-center'>
                      <div className='col-md-12 col-lg-12 col-xl-12'>
                        {/* List group */}
                        <ul className='list-group list-group-flush list my--3'>
                          <li className='list-group-item-one py-1'>
                            <div className='row align-items-center'>
                              <div className='col-lg-3'>
                                <small className='notification-label'>{t`lanSPLabelNotificationTitle`}</small>
                              </div>
                              <div className='col-lg-8'>
                                <h5 className='mb-0 '>{this.state.selectedDeleteData.notificationTitle}</h5>
                              </div>
                            </div>
                          </li>
                          <li className='list-group-item-one py-1'>
                            <div className='row align-items-center'>
                              <div className='col-lg-3'>
                                <small className='notification-label' >{t`lanSPLabelNotificationMessage`}</small>
                              </div>
                              <div className='col-lg-8'>
                                <h5 className='mb-0'>{this.state.selectedDeleteData.notificationMessage}</h5>
                              </div>
                            </div>
                          </li>
                          <li className='list-group-item-one py-1'>
                            <div className='row align-items-center'>
                              <div className='col-lg-3'>
                                <small className='notification-label'>{t`lanSPLabelCreatedOn`}</small>
                              </div>
                              <div className='col-lg-8'>
                                <h5 className='mb-0'>{this.state.selectedDeleteData.createdOn}</h5>
                              </div>
                            </div>
                          </li>
                          <p className='text-muted'><small style={{ color: 'red' }}>{this.state.errorMessage}</small> </p>
                          <div className='row'>
                            <div className='col-sm-12 text-left my-4'>
                              <button className='btn btn-primary' type='button' onClick={this.handleBack}>{t`lanCommonButtonBack`}</button>
                              <button className='btn btn-danger' type='button' onClick={this.handleDelete}>{t`lanCommonButtonDelete`}</button>
                            </div>
                          </div>
                        </ul>
                        <Modal
                          isOpen={this.state.modalIsOpen}
                          style={customStyles}
                          >
                          <h2 className='modal-text' >{t`lanCommonLabelDeleteNote`}</h2>
                          <div className='row my-3'>
                            <button className='btn btn-primary mr-2 px-3' onClick={this.handleConfirmDeleteNotification}>{t`lanCommonButtonConfirm`}</button>
                            <button className='btn btn-danger' onClick={this.closeModal}>{t`lanCommonButtonCancel`}</button>
                          </div>
                        </Modal>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
SPNotificationsDeleteComponent.propTypes = {
  selectedDeleteData: PropTypes.any,
  handleViewBack: PropTypes.any,
  handleUserDelete: PropTypes.any
}

export default SPNotificationsDeleteComponent
