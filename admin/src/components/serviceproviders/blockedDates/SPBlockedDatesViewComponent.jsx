/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import moment from 'moment'
import { t } from 'ttag'
import Modal from 'react-modal'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/lib/style.css'

import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

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

class SPBlockedDatesViewComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      blockedDatesData: {},
      customDatesStyles: [],
      modalIsOpen: false
    }
    this.handleBlockedDatesDelete = this.handleBlockedDatesDelete.bind(this)
    this.handleConfirmDeleteBlockedDates = this.handleConfirmDeleteBlockedDates.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleBack = this.handleBack.bind(this)
  }
  componentWillMount () {
    let customDates = []
    let blockedData = JSON.parse(localStorage.getItem('blockedDatesView'))
    this.setState({ blockedDatesData: blockedData, blockedStartDate: blockedData.blockingFromDate })
    if (blockedData.blockingType === 'Continuous Blocking') {
      let noOfDays = moment(blockedData.blockingToDate).diff(moment(blockedData.blockingFromDate), 'days') + 1
      for (let i = 0; i < noOfDays; i++) {
        let date = moment(blockedData.blockingFromDate).add(i, 'days').format('YYYY-MM-DD')
        customDates.push(new Date(moment(date).year(), moment(date).month(), moment(date).date(), 12, 0, 0))
      }
      this.setState({ customDatesStyles: customDates })
    } else {
      let date = moment(blockedData.blockingFromDate).format('YYYY-MM-DD')
      customDates.push(new Date(moment(date).year(), moment(date).month(), moment(date).date(), 12, 0, 0))
      this.setState({ customDatesStyles: customDates })
    }
  }
  handleConfirmDeleteBlockedDates () {
    let obj = { url: config.baseUrl + config.deleteSPPropertyBlockedDatesAPI + this.state.blockedDatesData._id }
    let _this = this
    APICallManager.deleteCall(obj, function (resObj) {
      _this.setState({ modalIsOpen: false })
      if (resObj.data.statusCode === '0000') {
        hashHistory.push('/host/property-view')
        _this.setState({ errorMessage: t`lanSPLabelSuccessBlockedDateDelete` })
      } else {
        _this.setState({ errorMessage: t`lanSPLabelErrorBlockedDateDeleteFailed` })
      }
    })
  }
  closeModal () {
    this.setState({ modalIsOpen: false })
  }
  handleBlockedDatesDelete () {
    this.setState({ modalIsOpen: true })
  }
  handleBack () {
    hashHistory.push('host/property-view')
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        <div className='container-fluid mt--6 pb-4'>
          <div className='row justify-content-center block-dates-view'>
            <div className='col-lg-9 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header'>
                  {/* List group */}
                  <ul className='list-group list-group-flush list my--3'>
                    <li className='list-group-item px-3 mt-2'>
                      <div className='row align-items-center'>
                        <div className='col'>
                          <small className='view-title'>{t`lanSPLabelBlockingType`}:</small>
                          <h5 className='mb-0'>{this.state.blockedDatesData.blockingType}</h5>
                        </div>
                        <div className='col'>
                          <small className='view-title' >{t`lanSPLabelFromDate`}:</small>
                          <h5 className='mb-0'>{this.state.blockedDatesData.blockingFromDate}</h5>
                        </div>
                        <div className='col'>
                          <small className='view-title' >{t`lanSPLabelToDate`}:</small>
                          <h5 className='mb-0'>{this.state.blockedDatesData.blockingToDate}</h5>
                        </div>
                        <div className='col-lg-1 text-right delete-blocked'>
                          <button className='btn btn-icon btn-danger' type='button' onClick={this.handleBlockedDatesDelete}>
                            <span className='btn-inner--icon'><i className='fas fa-trash' /></span>
                          </button>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className='card-body'>
                  <section className='notifications'>
                    <div className='row clearfix'>
                      <div className='col-md-12 col-lg-12 col-xl-12'>
                        <DayPicker
                          month={new Date(new Date(moment(this.state.blockedStartDate).year(), moment(this.state.blockedStartDate).month(), moment(this.state.blockedStartDate).date()))}
                          selectedDays={this.state.customDatesStyles}
                          numberOfMonths={3}
                          />
                      </div>
                      <div className='col-sm-12 text-center mt-3'>
                        <button className='btn btn-primary' type='button' onClick={this.handleBack} >{t`lanCommonButtonDone`}</button>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={this.state.modalIsOpen} style={customStyles}>
          <h2 className='modal-text' >{t`lanCommonLabelDeleteNote`}</h2>
          <div className='row'>
            <div className='col-sm-12'>
              <button className='btn btn-primary mr-2' onClick={this.handleConfirmDeleteBlockedDates}>{t`lanCommonButtonConfirm`}</button>
              <button className='btn btn-danger' onClick={this.closeModal}>{t`lanCommonButtonCancel`}</button>
            </div>
          </div>
        </Modal>
        <div>
          <small>{this.state.errorMessage}</small>
        </div>
      </div>
    )
  }
}

export default SPBlockedDatesViewComponent
