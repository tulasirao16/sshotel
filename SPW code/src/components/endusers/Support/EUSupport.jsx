/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import 'react-drawer/lib/react-drawer.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import '../profile/css/Profile.css'

class EUSupportComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      reqEmail: '',
      reqMobileNumber: '',
      name: '',
      ticketTitle: '',
      ticketTag: '',
      ticketDescription: '',
      buttonDisabled: false,
      newSupportList: [],
      errorMessage: '',
      user: false,
      submitDisabled: false
    }
    this.handleHost = this.handleHost.bind(this)
    this.handleCreateTicket = this.handleCreateTicket.bind(this)
    this.handleTicketType = this.handleTicketType.bind(this)
  }
  componentWillMount () {
  }
  handleHost (event) {
    if (event.target.value === 'Host') {
      this.setState({ ticketValue: !event.target.value,
        user: !this.state.user,
        ticketTitle: '',
        ticketTag: '',
        reqEmail: '',
        reqMobileNumber: '',
        name: '',
        ticketDescription: '',
        errorMessage: ''
      })
    }
  }
  handleTicketType () {
    switch (event.target.value) {
      case 'Booking':
        this.setState({ Booking: event.target.value, ticketTag: 'Booking', ticketNumType: 'EBT', errorMessage: '' })
        break
      case 'Refund':
        this.setState({ Refund: event.target.value, ticketTag: 'Refund', ticketNumType: 'ERT', errorMessage: '' })
        break
      case 'Property':
        this.setState({ Property: event.target.value, ticketTag: 'Property', ticketNumType: 'EPPT', errorMessage: '' })
        break
      case 'Cancellation':
        this.setState({ Cancellation: event.target.value, ticketTag: 'Cancellation', ticketNumType: 'ECT', errorMessage: '' })
        break
      case 'Account':
        this.setState({ Account: event.target.value, ticketTag: 'Account', ticketNumType: 'EAT', errorMessage: '' })
        break
      case 'Dispute':
        this.setState({ Dispute: event.target.value, ticketTag: 'Dispute', ticketNumType: 'EDT', errorMessage: '' })
        break
      case 'Other':
        this.setState({ Other: event.target.value, ticketTag: 'Other', ticketNumType: 'EOT', errorMessage: '' })
        break
      case 'Onboarding':
        this.setState({ Onboarding: event.target.value, ticketTag: 'Onboarding', ticketNumType: 'EOB', errorMessage: '' })
        break
      case 'Payment':
        this.setState({ Payment: event.target.value, ticketTag: 'Payment', ticketNumType: 'EPMT', errorMessage: '' })
        break
    }
  }
  handleCreateTicket () {
    const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (!this.state.ticketTitle.trim()) {
      this.setState({ errorMessage: t`lanEULabelErrorTicketTitleIsRequired` })
    } else if (!this.state.ticketTag) {
      this.setState({ errorMessage: t`lanCommonLabelErrorTicketTypeRequired` })
    } else if (!this.state.reqMobileNumber.trim()) {
      this.setState({ errorMessage: t`lanEULabelErrorMobileNumberRequired` })
    } else if (this.state.reqEmail && !emailValidation.test(this.state.reqEmail)) {
      this.setState({ errorMessage: t`lanEULabelErrorInvalidEmail` })
    } else if (!this.state.name) {
      this.setState({ errorMessage: t`lanCommonLabelErrorNameRequired` })
    } else if (!this.state.ticketDescription.trim()) {
      this.setState({ errorMessage: t`lanCommonLabelErrorDescriptionRequired` })
    } else {
      let _this = this
      _this.setState({ submitDisabled: true })
      let supportData = {
        'ticketTitle': this.state.ticketTitle,
        'ticketTag': this.state.ticketTag,
        'reqMobileNumber': this.state.reqMobileNumber,
        'reqEmail': this.state.reqEmail,
        'name' : this.state.name,
        'ticketNumType': this.state.ticketNumType,
        'ticketDescription': this.state.ticketDescription,
        'user': this.state.user
      }
      let obj = { url: config.baseUrl + config.postWithoutLoginSupportAPI, body: supportData }
      APICallManager.postCall(obj, function (resObj) {
        _this.setState({ submitDisabled: true })
        if (resObj.data.statusCode === '0000') {
          _this.setState({ errorMessage: t`lanEULabelSuccesTicketCreatedSuccessfully` })
        } else {
          _this.setState({ errorMessage: t`lanCommonLabelErrorRecordCreateFailed` })
        }
      })
    }
    event.preventDefault()
  }
  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-lg-11'>
            <div className='edit-profile-info preference'>
              <div className='card'>
                <div className='card-header card-header-danger'>
                  <div className='col-sm-2'>
                    <h4 className='card-title'>{t`lanEULabelSupportFor`} :</h4>
                  </div>
                  <div className='col-sm-2 text-center' >
                    <div className='custom-control custom-radio'>
                      <input value='Host' type='checkbox' onChange={this.handleHost} />
                      <label className='text-white'>{t`lanEULabelHost`}</label>
                    </div>
                  </div>
                </div>
                <div className='card-body card-ticket'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <label>{t`lanEULabelTicketTitle`}<span style={{ color: 'red' }}>*</span></label>
                        <input type='text' className='form-control' placeholder={t`lanEULabelTicketTitle`} value={this.state.ticketTitle} maxLength='40'
                          onChange={() => this.setState({ ticketTitle: event.target.value, errorMessage: '' })} />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <label>{t`lanEULabelTicketType`}<span style={{ color: 'red' }}>*</span></label>
                        <div className=''>
                          <select className='form-control' id='exampleFormControlSelect1' onChange={this.handleTicketType} value={this.state.ticketTag}>
                            <option value=''>{t`lanEULabelSelectTicket`}</option>
                            <option value='Account'>Account</option>
                            <option value='Booking'>Booking</option>
                            <option value='Cancellation'>Cancellation</option>
                            <option value='Property'>Property</option>
                            <option value='Refund'>Refund</option>
                            <option value='Payment'>Payment</option>
                            <option value='Dispute'>Dispute</option>
                            {/* <option value='Onboarding'>Onboarding</option> */}
                            <option value='Other'>Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <label>{t`lanCommonLabelMobileNumber`}<span style={{ color: 'red' }}>*</span></label>
                        <input type='text' className='form-control' placeholder={t`lanCommonLabelMobileNumber`} value={this.state.reqMobileNumber} maxLength='10'
                          onChange={() => this.setState({ reqMobileNumber: event.target.value, errorMessage: '' })} />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <label>{t`lanCommonLabelEmail`}</label>
                        <input type='email' className='form-control' placeholder={t`lanCommonLabelEmail`} value={this.state.reqEmail} maxLength='80'
                          onChange={() => this.setState({ reqEmail: event.target.value, errorMessage: '' })} />
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <label>{t`lanEULabelName`}:<span style={{ color: 'red' }}>*</span></label>
                        <input type='email' className='form-control' placeholder={t`lanEULabelName`} value={this.state.name} maxLength='20'
                          onChange={() => this.setState({ name: event.target.value, errorMessage: '' })} />
                      </div>
                    </div>
                  </div>
                  <div className='form-group '>
                    <label className='col-md-12 pl-0 col-form-label form-control-label'> {t`lanEULabelTicketDescription`} <span style={{ color: 'red' }}>*</span></label>
                    <div className='col-md-12 pl-0'>
                      <textarea className='form-control textarea' id='exampleFormControlTextarea1' rows='6' placeholder={t`lanEULabelWriteMessageHere`}
                        onChange={() => this.setState({ ticketDescription: event.target.value, errorMessage: '' })} value={this.state.ticketDescription} />
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='container text-center'>
                    <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
                  </div>
                </div>
                <div className=' row'>
                  <div className='col-sm-12 text-center' >
                    <button className='btn btn-primary btn-text-white' disabled={this.state.submitDisabled} onClick={this.handleCreateTicket}>{t`lanCommonButtonCreate`}</button>
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

export default EUSupportComponent
