/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import { t } from 'ttag'
import 'react-drawer/lib/react-drawer.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import { hashHistory } from 'react-router'

class EUSupportCreateComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      ticket: '',
      ticketDescription: '',
      name: '',
      errorMessage:''
    }
    this.handleCreateTicket = this.handleCreateTicket.bind(this)
  }
  componentWillMount () {
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    this.setState({ authObj: authObj,
      name: authObj.name
    })
  }
  handleCreateTicket () {
    if (!this.state.authObj.name) {
      alert('Please Fill Your Profile')
      hashHistory.push('/profile')
    } else if (!this.state.ticket) {
      this.setState({ errorMessage: t`lanEULabelErrorTicketTypeRequired` })
    } else if (!this.state.ticketDescription.trim()) {
      this.setState({ errorMessage: t`lanEULabelErrorMessageRequired` })
    } else {
      let supportData = {
        'ticket': this.state.ticket,
        'ticketDescription': this.state.ticketDescription
      }
      let _this = this
      let obj = { url: config.baseUrl + config.postEUSupportCreateAPI, body: supportData }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '1209') {
          _this.props.handleCreateSupport(resObj.data.statusResult)
          // hashHistory.push('/host/support')
        } else {
          _this.setState({ errorMessage: t`lanCommonLabelErrorRecordCreateFailed` })
        }
      })
    }
    event.preventDefault()
  }

  render () {
    return (
      <div className='card-body card-ticket'>
        <div className='form-group row'>
          <label className='col-md-3 col-form-label form-control-label'>{t`lanEULabelTicketType`} <span className='mandatory'>*</span></label>
          <div className='col-md-5'>
            <select className='form-control' id='exampleFormControlSelect1' onChange={() => this.setState({ ticket: event.target.value, errorMessage: '' })} value={this.state.ticket}>
              <option value=''>Select Ticket</option>
              <option value='Ticket 1'>Ticket 1</option>
              <option value='Ticket 2'>Ticket 2</option>
            </select>
          </div>
        </div>
        <div className='form-group row'>
          <label className='col-md-3 col-form-label form-control-label'> {t`lanCommonLabelMessage`} <span className='mandatory'>*</span></label>
          <div className='col-md-9'>
            <textarea className='form-control textarea' id='exampleFormControlTextarea1' rows='6' placeholder='Write message here ...'
              onChange={() => this.setState({ ticketDescription: event.target.value, errorMessage: '' })} value={this.state.description} />
          </div>
        </div>
        <div className='row'>
          <div className='container text-right'>
            <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
          </div>
        </div>
        <div className=' row'>
          <div className='col-sm-12 text-right' >
            <button className='btn btn-primary btn-text-white' onClick={this.handleCreateTicket}>{t`lanCommonButtonCreate`}</button>
          </div>
        </div>
      </div>
    )
  }
}

EUSupportCreateComponent.propTypes = {
  handleCreateSupport: PropTypes.any
}

export default EUSupportCreateComponent
