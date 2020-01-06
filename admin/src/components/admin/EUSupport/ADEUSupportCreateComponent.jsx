/* eslint-disable no-useless-escape */
import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import PropTypes from 'prop-types'
import { t } from 'ttag'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

class ADEUSupportCreateComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      reqEmail: '',
      reqMobileNumber:'',
      ticketTitle: '',
      ticketTag: '',
      ticketDescription: '',
      ticketNumType: '',
      errorMessage: '',
      submitDisabled: false
    }
    this.handleAddManually = this.handleAddManually.bind(this)
    this.handleViewTicket = this.handleViewTicket.bind(this)
    this.handleTicketType = this.handleTicketType.bind(this)
    this.handleCreateTicket = this.handleCreateTicket.bind(this)
  }
  componentWillMount () {
    let userData = JSON.parse(localStorage.getItem('userData'))
    if (userData) {
      this.setState({
        userData: userData,
        reqMobileNumber: userData.mobileNumber,
        reqEmail: userData.email ? userData.email : ''
      })
    }
  }
  handleTicketType () {
    switch (event.target.value) {
      case 'Booking':
        this.setState({ Booking: event.target.value, ticketTag: 'Booking', ticketNumType: 'SBT', errorMessage: '' })
        break
      case 'Refund':
        this.setState({ Refund: event.target.value, ticketTag: 'Refund', ticketNumType: 'SRT', errorMessage: '' })
        break
      case 'Property':
        this.setState({ Property: event.target.value, ticketTag: 'Property', ticketNumType: 'SPPT', errorMessage: '' })
        break
      case 'Cancellation':
        this.setState({ Cancellation: event.target.value, ticketTag: 'Cancellation', ticketNumType: 'SCT', errorMessage: '' })
        break
      case 'Account':
        this.setState({ Account: event.target.value, ticketTag: 'Account', ticketNumType: 'SAT', errorMessage: '' })
        break
      case 'Dispute':
        this.setState({ Dispute: event.target.value, ticketTag: 'Dispute', ticketNumType: 'SDT', errorMessage: '' })
        break
      case 'Other':
        this.setState({ Other: event.target.value, ticketTag: 'Other', ticketNumType: 'SOT', errorMessage: '' })
        break
      case 'Payment':
        this.setState({ Payment: event.target.value, ticketTag: 'Payment', ticketNumType: 'SPMT', errorMessage: '' })
        break
    }
  }
  handleAddManually (event) {
    hashHistory.push('/AddProperty')
    event.preventDefault()
  }
  handleViewTicket (e) {
    hashHistory.push('/viewticket')
    event.preventDefault()
  }
  handleCreateTicket () {
    let userData = JSON.parse(localStorage.getItem('userData'))
    const emailValidation = /^[a-z0-9._%+-]+@[a-z0-9.-]+[\.]{1}[a-z]{2,4}$/
    if (!this.state.ticketTitle.trim()) {
      this.setState({ errorMessage: 'Ticket Title is Required' })
    } else if (!this.state.ticketTag) {
      this.setState({ errorMessage: t`lanCommonLabelErrorTicketTypeRequired` })
    } else if (!this.state.reqMobileNumber.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorMobileNumberRequired` })
    } else if (this.state.reqEmail && !emailValidation.test(this.state.reqEmail)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidEMail` })
    } else if (!this.state.ticketDescription.trim()) {
      this.setState({ errorMessage: t`lanCommonLabelErrorDescriptionRequired` })
    } else {
      let _this = this
      let supportData = {
        ticketTitle: this.state.ticketTitle,
        ticketTag: this.state.ticketTag,
        ticketDescription: this.state.ticketDescription,
        ticketNumType: this.state.ticketNumType,
        euUserId: userData._id,
        euName: userData.name,
        reqMobileNumber: this.state.reqMobileNumber,
        reqEmail:this.state.reqEmail
      }
      console.log('supportData...EU:', supportData)
      let obj = { url: config.baseUrl + config.postADEUSupportCreateAPI, body: supportData }
      APICallManager.postCall(obj, function (resObj) {
        console.log('resObjj==EU', resObj)
        if (resObj.data.statusCode === '0000') {
          ToastsStore.success('Ticket Created Successfully')
          setTimeout(() => {
            _this.props.handleCreateSupport(resObj.data.statusResult)
          }, 2000)
          _this.setState({ ticketTitle: '', ticketTag: '', ticketDescription: '' })
        } else {
          ToastsStore.error('Ticket Create Failed')
          _this.setState({ errorMessage: t`lanCommonLabelErrorRecordCreateFailed` })
        }
      })
    }
    event.preventDefault()
  }
  render () {
    return (
      <div className='card-ticket py-3 px-2'>
        <div className='row'>
          <div className='col-md-3'>
            <div className='form-group'>
              <label>Ticket Title<span style={{ color: 'red' }}>*</span></label>
              <input type='ticket' className='form-control' value={this.state.ticketTitle} maxLength='80'
                onChange={() => this.setState({ ticketTitle: event.target.value, errorMessage: '' })} disabled={this.state.disabled} />
            </div>
          </div>
          <div className='col-md-3'>
            <div className='form-group'>
              <label>{t`lanEULabelTicketType`}<span style={{ color: 'red' }}>*</span></label>
              <div className=''>
                <select className='form-control' id='exampleFormControlSelect1' onChange={this.handleTicketType} value={this.state.ticketTag}>
                  <option value=''>Select Ticket</option>
                  <option value='Account'>Account</option>
                  <option value='Booking'>Booking</option>
                  <option value='Cancellation'>Cancellation</option>
                  <option value='Property'>Property</option>
                  <option value='Refund'>Refund</option>
                  <option value='Payment'>Payment</option>
                  <option value='Dispute'>Dispute</option>
                  <option value='Other'>Other</option>
                </select>
              </div>
            </div>
          </div>
          <div className='col-md-3'>
            <div className='form-group'>
              <label>{t`lanCommonLabelMobileNumber`}<span style={{ color: 'red' }}>*</span></label>
              <input type='text' className='form-control' placeholder='Mobile Number' value={this.state.reqMobileNumber} maxLength='10'
                onChange={() => this.setState({ reqMobileNumber: event.target.value, errorMessage: '' })} disabled={this.state.disabled} />
            </div>
          </div>
          <div className='col-md-3'>
            <div className='form-group'>
              <label>{t`lanCommonLabelEmail`}</label>
              <input type='email' className='form-control' placeholder='email' value={this.state.reqEmail} maxLength='80'
                onChange={() => this.setState({ reqEmail: event.target.value, errorMessage: '' })} disabled={this.state.disabled} />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <div className='form-group '>
              <label>Ticket Description <span className='mandatory'>*</span></label>
              <div className='pl-0'>
                <textarea className='form-control textarea' id='exampleFormControlTextarea1' rows='6' placeholder='Write message here ...'
                  onChange={() => this.setState({ ticketDescription: event.target.value, errorMessage: '' })} value={this.state.description} />
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12'>
            <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12' >
            <button className='btn btn-primary btn-text-white' disabled={this.state.submitDisabled} onClick={this.handleCreateTicket}>{t`lanCommonButtonCreate`}</button>
            <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
          </div>
        </div>
      </div>
    )
  }
}

ADEUSupportCreateComponent.propTypes = {
  handleCreateSupport: PropTypes.any
}

export default ADEUSupportCreateComponent
