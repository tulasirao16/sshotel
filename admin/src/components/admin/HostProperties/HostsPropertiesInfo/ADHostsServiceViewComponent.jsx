/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
// import ReactDrawer from 'react-drawer'
// import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import PropTypes from 'prop-types'
import { t } from 'ttag'
import APICallManager from '../../../../services/callmanager'
import config from '../../../../../public/config.json'
// import Switch from 'react-switch'
import 'react-datepicker/dist/react-datepicker.css'
import '../../css/all.min.css'
import '../../css/argon.min.css'
import '../../css/nucleo.css'

class ADHostsServiceViewComponent extends React.Component {
  constructor (props) {
    super(props)
    let ServiceEditData = this.props.selectedService
    this.state = {
      serviceData: ServiceEditData,
      serviceType: ServiceEditData && ServiceEditData.serviceType ? ServiceEditData.serviceType : '',
      serviceCharge: ServiceEditData && ServiceEditData.serviceCharge ? ServiceEditData.serviceCharge : '0',
      serviceName: ServiceEditData && ServiceEditData.serviceName ? ServiceEditData.serviceName : '',
      serviceStatus: ServiceEditData && ServiceEditData.serviceStatus ? ServiceEditData.serviceStatus : 'Unavailable',
      disabled: true,
      errorMessage: ''
    }
    this.handleServiceType = this.handleServiceType.bind(this)
    this.handleUpdateService = this.handleUpdateService.bind(this)
    this.handleServiceBack = this.handleServiceBack.bind(this)
  }

  componentWillMount () {
    let ServiceEditData = this.props.selectedService
    if (ServiceEditData && ServiceEditData.serviceType === 'Free') {
      this.setState({ disabled: true })
    } else {
      this.setState({ disabled: false })
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState({ serviceData: newProps.selectedService })
  }

  handleServiceType (event) {
    if (event.target.value === 'Free') {
      this.setState({ serviceType: event.target.value, disabled: true, serviceCharge: '0', errorMessage: '' })
    } else {
      this.setState({ serviceType: event.target.value, disabled: false, errorMessage: '' })
    }
  }

  handleUpdateService () {
    var num = parseInt(this.state.serviceCharge)
    let serviceData = {
      _id: this.state.serviceData._id,
      serviceType: this.state.serviceType,
      serviceCharge: num,
      serviceStatus: this.state.serviceStatus
    }
    if (this.state.serviceStatus === this.state.serviceData.serviceStatus && this.state.serviceType === this.state.serviceData.serviceType && this.state.serviceCharge === this.state.serviceData.serviceCharge) {
      this.props.handleServiceModifiedData(serviceData, false)
    } else if ((this.state.serviceType === 'Paid' && parseInt(this.state.serviceCharge) <= 0) || !this.state.serviceCharge.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorServiceChargeRequired` })
    } else {
      let _this = this
      let obj = { url: config.baseUrl + config.putADHostsPropertyInfoServicesUpdateAPI + this.state.serviceData._id, body: serviceData }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.props.handleServiceModifiedData(serviceData, true)
        } else {
          _this.setState({ errorMessage: t`lanCommonLabelErrorRecordUpdateFailed` })
        }
      })
    }
  }
  handleServiceBack () {
    let serviceData = {
      _id: this.state.serviceData._id,
      serviceType: this.state.serviceType,
      serviceCharge: this.state.serviceCharge,
      serviceStatus: this.state.serviceStatus
    }
    this.props.handleServiceModifiedData(serviceData, false)
  }
  render () {
    return (
      <div >
        <div className='card mb-2'>
          <div className='card-body'>
            <div className='table-user mb-3'>
              <img src={(this.state.serviceData && this.state.serviceData.serviceIconPath) ? config.baseUrl + this.state.serviceData.serviceIconPath : require('../../images/services/car.png')}
                className='avatar rounded-circle mr-3' />
              <a href='#'><strong>{(this.state.serviceData && this.state.serviceData.serviceName) ? this.state.serviceData.serviceName : ''}</strong></a>
            </div>
            <section className='notifications'>
              <div className='cardbody'>
                <div className='row'>
                  <div className='col-md-3'>
                    <div className='form-group'>
                      <label className='form-control-label '>{t`lanSPLabelServiceCode`}<span className='error'>*</span></label>
                      <h5 className='mb-0'>{(this.state.serviceData && this.state.serviceData.serviceId) ? this.state.serviceData.serviceId : ''}</h5>
                    </div>
                  </div>
                  <div className='col-md-3'>
                    <div className='form-group'>
                      <label className='form-control-label '>{t`lanCommonLabelStatus`}<span className='error'>*</span></label>
                      <select multiple='' className='form-control' id='exampleFormControlSelect2'
                        onChange={() => this.setState({ serviceStatus: event.target.value, errorMessage: '' })} value={this.state.serviceStatus}>
                        <option value='Unavailable'>Unavailable</option>
                        <option value='Available'>Available</option>
                      </select>
                    </div>
                  </div>
                  <div className='col-md-3'>
                    <div className='form-group'>
                      <label className='form-control-label'>{t`lanSPLabelServiceType`}<span className='error'>*</span></label>
                      <select multiple='' className='form-control' id='exampleFormControlSelect2' value={this.state.serviceType} onChange={this.handleServiceType}>
                        <option value='Free'>Free</option>
                        <option value='Paid'>Paid</option>
                      </select>
                    </div>
                  </div>
                  <div className='col-md-3'>
                    <div className='form-group'>
                      <label className='form-control-label'>{t`lanCommonLabelCharge`} (₹)<span className='error'>*</span></label>
                      <input type='text' className='form-control' disabled={this.state.disabled} id='TicketSubject'
                        onChange={(event) => this.setState({ serviceCharge: event.target.value, errorMessage: '' })} value={this.state.serviceCharge} />
                    </div>
                  </div>
                </div>
                <p className='text-center'>
                  <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
                </p>
                <div className='row'>
                  <div className='col-sm-12 text-center'>
                    <button className='btn btn-primary update-edit' onClick={() => this.handleUpdateService()}>{t`lanCommonButtonUpdate`}</button>
                    <button className='btn btn btn-primary' onClick={this.handleServiceBack}>{t`lanCommonButtonBack`}</button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

ADHostsServiceViewComponent.propTypes = {
  selectedService: PropTypes.any,
  handleServiceModifiedData: PropTypes.any
}

export default ADHostsServiceViewComponent
