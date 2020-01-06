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
import config from '../../../../../public/config.json'
// import Switch from 'react-switch'
import 'react-datepicker/dist/react-datepicker.css'
import '../../css/all.min.css'
import '../../css/argon.min.css'
import '../../css/nucleo.css'

class ADHostsServicesViewComponent extends React.Component {
  constructor (props) {
    super(props)
    let ServiceCreateData = this.props.selectedService
    this.state = {
      serviceData: ServiceCreateData,
      serviceType: ServiceCreateData && ServiceCreateData.serviceType ? ServiceCreateData.serviceType : '',
      serviceCharge: ServiceCreateData && ServiceCreateData.serviceCharge ? ServiceCreateData.serviceCharge : '0',
      serviceName: ServiceCreateData && ServiceCreateData.serviceName ? ServiceCreateData.serviceName : '',
      serviceStatus: ServiceCreateData && ServiceCreateData.serviceStatus ? ServiceCreateData.serviceStatus : 'Unavailable',
      disabled: true,
      errorMessage: ''
    }
    this.handleServiceType = this.handleServiceType.bind(this)
    this.handleCreateService = this.handleCreateService.bind(this)
    this.handleServiceCharge = this.handleServiceCharge.bind(this)
  }

  componentWillReceiveProps (newProps) {
    this.setState({
      serviceData: newProps.selectedService,
      serviceType: newProps.selectedService && newProps.selectedService.serviceType ? newProps.selectedService.serviceType : '',
      serviceCharge: newProps.selectedService && newProps.selectedService.serviceCharge ? newProps.selectedService.serviceCharge : '0',
      serviceName: newProps.selectedService && newProps.selectedService.serviceName ? newProps.selectedService.serviceName : '',
      serviceStatus: newProps.selectedService && newProps.selectedService.serviceStatus ? newProps.selectedService.serviceStatus : 'Unavailable'
    })
  }

  handleServiceType (event) {
    if (event.target.value === 'Free') {
      this.setState({ serviceType: event.target.value, disabled: true, serviceCharge: '0', errorMessage: '' })
    } else {
      this.setState({ serviceType: event.target.value, disabled: false, errorMessage: '' })
    }
  }
  handleServiceCharge () {
    if (event.target.value === '' || event.target.value === undefined) {
      this.setState({ serviceCharge: '0', errorMessage: '' })
    } else {
      this.setState({ serviceCharge: parseInt(event.target.value), errorMessage: '' })
    }
  }

  handleCreateService () {
    let modifiedObj = {
      serviceStatus: this.state.serviceStatus,
      serviceType: this.state.serviceType,
      serviceCharge: this.state.serviceCharge,
      serviceId: this.state.serviceData.serviceId
    }
    if (this.state.serviceStatus === this.state.serviceData.serviceStatus && this.state.serviceType === this.state.serviceData.serviceType && this.state.serviceCharge === this.state.serviceData.serviceCharge) {
      this.props.handleServiceModifiedData(modifiedObj, false)
    } else if (this.state.serviceType === 'Paid' && (parseInt(this.state.serviceCharge) <= 0 || !this.state.serviceCharge)) {
      this.setState({ errorMessage: t`lanSPLabelErrorServiceChargeRequired` })
    } else {
      this.props.handleServiceModifiedData(modifiedObj, true)
      this.props.handleServicesChange(false)
    }
  }

  render () {
    return (
      <div >
        <div>
          <div className='table-user mb-3'>
            <img src={(this.state.serviceData && this.state.serviceData.serviceIconPath) ? config.baseUrl + this.state.serviceData.serviceIconPath : require('../../images/services/car.png')}
              className='avatar rounded-circle mr-3' />
            <a href='#'><strong>{(this.state.serviceData && this.state.serviceData.serviceName) ? this.state.serviceData.serviceName : ''}</strong></a>
          </div>
          <div>
            <section className='notifications'>
              <div div className='row'>
                <div className='col-md-3'>
                  <div className='form-group'>
                    <label className='form-control-label '>{t`lanSPLabelServiceCode`}<span className='error'>*</span></label>
                    <h5 className='mb-0'>{(this.state.serviceData && this.state.serviceData.serviceId) ? this.state.serviceData.serviceId : ''}</h5>
                  </div>
                </div>
                <div className='col-md-3'>
                  <div className='form-group'>
                    <label className='form-control-label '>{t`lanCommonLabelStatus`}<span className='error'>*</span></label>
                    <select multiple='' className='form-control' onChange={() => this.setState({ serviceStatus: event.target.value, errorMessage: '' })} value={this.state.serviceStatus}>
                      <option value='Unavailable'>Unavailable</option>
                      <option value='Available'>Available</option>
                    </select>
                  </div>
                </div>
                <div className='col-md-3'>
                  <div className='form-group'>
                    <label className='form-control-label'>{t`lanSPLabelServiceType`}<span className='error'>*</span></label>
                    <select multiple='' className='form-control' value={this.state.serviceType} onChange={this.handleServiceType}>
                      <option value='Free'>Free</option>
                      <option value='Paid'>Paid</option>
                    </select>
                  </div>
                </div>
                <div className='col-md-3'>
                  <div className='form-group'>
                    <label className='form-control-label'>{t`lanCommonLabelCharge`} (₹)<span className='error'>*</span></label>
                    <input type='text' disabled={this.state.serviceType === 'Free' ? this.state.editable : false} value={this.state.serviceCharge} onChange={this.handleServiceCharge}
                      className='form-control' />
                  </div>
                </div>
              </div>
              <p className='text-center'>
                <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
              </p>
              <div className='text-center'>
                <button className='btn btn-primary update-edit' onClick={() => this.handleCreateService(this.state.serviceData)}>{t`lanCommonButtonUpdate`}</button>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

ADHostsServicesViewComponent.propTypes = {
  selectedService: PropTypes.any,
  handleServiceModifiedData: PropTypes.any,
  handleServicesChange: PropTypes.func
}

export default ADHostsServicesViewComponent
