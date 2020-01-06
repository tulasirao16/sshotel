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

import '../profile/css/Profile.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

class EUSupportEditComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      supportData: this.props.selectedSupportData,
      oldSupportData: this.props.selectedSupportData,
      errorMessage: ''
    }
    this.handleUpdate = this.handleUpdate.bind(this)
  }
  componentWillReceiveProps (newProps) {
    this.setState({ supportData: newProps.selectedSupportData, oldSupportData: newProps.selectedSupportData })
  }
  handleUpdate () {
    if (!this.state.supportData.ticket) {
      this.setState({ errorMessage: t`lanEULabelErrorTicketTypeRequired` })
    } else if (!this.state.supportData.ticketDescription.trim()) {
      this.setState({ errorMessage: t`lanEULabelErrorMessageRequired` })
    } else {
      var isUpdate = JSON.stringify(this.state.oldSupportData) === JSON.stringify(this.state.supportData)
      if (isUpdate) {
        this.props.handleEditSupport(this.state.supportData, false)
      } else {
        let supportObj = {
          ticket: this.state.supportData.ticket,
          ticketDescription: this.state.supportData.ticketDescription,
          id: this.state.supportData._id
        }
        let _this = this
        let obj = { url: config.baseUrl + config.putEUSupportUpdateAPI, body: supportObj }
        APICallManager.putCall(obj, function (resObj) {
          if (resObj.data.statusCode === '1010') {
            _this.props.handleEditSupport(resObj.data.statusResult, true)
          } else {
            _this.setState({ errorMessage: t`lanCommonLabelErrorRecordUpdateFailed` })
          }
        })
      }
    }
    event.preventDefault()
  }
  render () {
    return (
      <div className='edit-profile-info preference support-edit'>
        <div className='card'>
          <div className='card-header card-header-danger' >
            <h4 className='card-title'>{t`lanEUTitleTicketEdit`}</h4>
            <p className='card-category text-white'>{t`lanEULabelEditTicketRaised`}</p>
          </div>
          {/* edit prfile htmlForm */}
          <div className='edit-profile-form'>
            <div className='card-body'>
              <div className='card-body card-ticket'>
                <div className='form-group row'>
                  <label className='col-md-2 col-form-label form-control-label'>{t`lanEULabelTicketType`} <span className='mandatory'>*</span></label>
                  <div className='col-md-5'>
                    <select className='form-control' id='exampleFormControlSelect1' onChange={
                      () =>
                        this.setState(prevState => {
                          let supportData = Object.assign({}, prevState.supportData)
                          let errorMessage = ''
                          supportData.ticket = event.target.value
                          return { supportData, errorMessage }
                        })
                    } value={this.state.supportData.ticket} >
                      <option value='Ticket 1'>Ticket 1</option>
                      <option value='Ticket 1'>Ticket 1</option>
                    </select>
                  </div>
                </div>
                <div className='form-group row'>
                  <label className='col-md-2 col-form-label form-control-label'> {t`lanCommonLabelMessage`} <span className='mandatory'>*</span></label>
                  <div className='col-md-9'>
                    <textarea className='form-control' id='exampleFormControlTextarea1' rows='3' maxLength='500' onChange={
                      () =>
                        this.setState(prevState => {
                          let supportData = Object.assign({}, prevState.supportData)
                          let errorMessage = ''
                          supportData.ticketDescription = event.target.value
                          return { supportData, errorMessage }
                        })
                    } >
                      {this.state.supportData.ticketDescription}
                    </textarea>
                  </div>
                </div>
                <div className='form-group row'>
                  <label className='col-md-2 col-form-label form-control-label'>{t`lanEULabelTicketNumber`}</label>
                  <div className='col-md-5'>
                    <h5 className='form-control'>{this.state.supportData.ticketNumber}</h5>
                  </div>
                </div>
                <div className='form-group row'>
                  <label className='col-md-2 col-form-label form-control-label'>{t`lanCommonLabelStatus`}</label>
                  <div className='col-md-5'>
                    <h5 className='form-control'>{this.state.supportData.status}</h5>
                  </div>
                </div>
                <div className='form-group row'>
                  <label className='col-md-2 col-form-label form-control-label'>{t`lanEULabelTicketCreatedOn`}</label>
                  <div className='col-md-5'>
                    <h5 className='form-control'>{moment(this.state.supportData.createdAt).format('MMM DD, YYYY')}</h5>
                  </div>
                </div>
                <div className='row'>
                  <div className='container'>
                    <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
                  </div>
                </div>
                <div className=' row'>
                  <div className='col-sm-12 text-center' >
                    <button className='btn btn-info update-edit mr-2 btn-text-white' onClick={() => this.props.handleViewSupport(this.state.supportData)}>{t`lanCommonButtonBack`}</button>
                    <button className='btn btn-primary update-edit btn-text-white' onClick={this.handleUpdate}>{t`lanCommonButtonUpdate`}</button>
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
EUSupportEditComponent.propTypes = {
  handleEditSupport: PropTypes.any,
  selectedSupportData: PropTypes.any,
  handleViewSupport: PropTypes.any
}

export default EUSupportEditComponent
