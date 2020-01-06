/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import config from '../../../../../public/config.json'
import APICallManager from '../../../../services/callmanager'

import 'react-drawer/lib/react-drawer.css'
import 'react-datepicker/dist/react-datepicker.css'
import { t } from 'ttag'

import '../../css/all.min.css'
import '../../css/argon.min.css'
import '../../css/nucleo.css'

class ADHostsAmenitiesViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      date: new Date(),
      propertyId: this.props.propertyId,
      propertyInfoId: this.props.propertyInfoId,
      amenitiesData: this.props.amenitiesObj,
      amenityStatus: this.props.amenitiesObj.amenityStatus,
      amenityType: this.props.amenitiesObj.amenityType,
      charge: this.props.amenitiesObj.amenityCharge,
      errorMessage: '',
      editable: true
    }
    this.handleAmenityBack = this.handleAmenityBack.bind(this)
    this.handleSelectAmenityStatus = this.handleSelectAmenityStatus.bind(this)
    this.handleSelectAmenityType = this.handleSelectAmenityType.bind(this)
    this.handleAmenityCharge = this.handleAmenityCharge.bind(this)
    this.handlAmenityEdit = this.handlAmenityEdit.bind(this)
  }
  handleAmenityBack () {
    let obj = {}
    this.props.handleAmenityData(obj, false)
  }
  handleSelectAmenityStatus () {
    this.setState({ amenityStatus: event.target.value, errorMessage: '' })
  }
  handleSelectAmenityType () {
    if (event.target.value === 'Free') {
      this.setState({ amenityType: 'Free', errorMessage: '', charge: '0' })
    } else {
      this.setState({ amenityType: event.target.value, errorMessage: '' })
    }
  }
  handleAmenityCharge () {
    if (event.target.value === '' || event.target.value === undefined) {
      this.setState({ charge: '0', errorMessage: '' })
    } else {
      this.setState({ charge: parseInt(event.target.value), errorMessage: '' })
    }
  }
  handlAmenityEdit () {
    let amenityObj = {
      recordID: this.state.amenitiesData._id,
      amenityStatus: this.state.amenityStatus,
      amenityType: this.state.amenityType,
      amenityCharge: this.state.charge
    }
    if (this.state.amenityStatus === this.state.amenitiesData.amenityStatus && this.state.amenityType === this.state.amenitiesData.amenityType && this.state.charge === this.state.amenitiesData.amenityCharge) {
      this.props.handleAmenityData(amenityObj, false)
    } else if (this.state.amenityType === 'Paid' && this.state.charge === '0') {
      this.setState({ errorMessage: t`lanSPLabelErrorAmenityCharged` })
    } else {
      let putADHostsPropertyInfoAmenity = {
        url: config.baseUrl + config.putADHostsPropertyInfoAmenitiesUpdateAPI + this.state.amenitiesData._id,
        body: amenityObj
      }
      let _this = this
      APICallManager.putCall(putADHostsPropertyInfoAmenity, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.props.handleAmenityData(amenityObj, true)
        } else {
          _this.setState({ errorMessage: t`lanCommonLabelErrorRecordUpdateFailed` })
        }
      })
    }
  }

  render () {
    return (
      <div className='card mb-2'>
        <div className='card-body'>
          <div className='table-user mb-3'>
            <img src={this.state.amenitiesData.amenityIconPath ? config.baseUrl + this.state.amenitiesData.amenityIconPath : require('../../images/amenities/wifi.png')} className='icon-calendar' />
            <a ><strong>{this.state.amenitiesData.amenityName}</strong></a>
          </div>
          <section className='notifications'>
            <div className='row'>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label '>{t`lanSPLabelAmenityCode`}<span className='error'>*</span></label>
                  <h5 className='mb-0'>{this.state.amenitiesData.amenityId}</h5>
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label '>{t`lanCommonLabelStatus`}<span className='error'>*</span></label>
                  <select className='form-control' id='exampleFormControlSelect1' onChange={this.handleSelectAmenityStatus} value={this.state.amenityStatus}>
                    <option value='Available'>Available</option>
                    <option value='Unavailable'>Unavailable</option>
                  </select>
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelAmenityType`}<span className='error'>*</span></label>
                  <select className='form-control' id='exampleFormControlSelect1' onChange={this.handleSelectAmenityType} value={this.state.amenityType}>
                    {/* <option value=''>{ t`lanCommonLabelSelectStatus` }</option> */}
                    <option value='Free'>Free</option>
                    <option value='Paid'>Paid</option>
                  </select>
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanCommonLabelCharge`}(₹)<span className='error'>*</span></label>
                  <input type='text' disabled={this.state.amenityType === 'Free' ? this.state.editable : false} value={this.state.charge} onChange={this.handleAmenityCharge}
                    className='form-control' id='TicketSubject' />
                </div>
              </div>
            </div>
            <p className='text-center'>
              <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
            </p>
            <div className='row'>
              <div className='col-md-12 text-center'>
                <button className='btn btn-primary update-edit' onClick={this.handlAmenityEdit}>{t`lanCommonButtonUpdate`}</button>
                <button className='btn btn-primary' onClick={this.handleAmenityBack}>{t`lanCommonButtonBack`}</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }
}
ADHostsAmenitiesViewComponent.propTypes = {
  propertyId: PropTypes.any,
  propertyInfoId: PropTypes.any,
  handleAmenityData: PropTypes.any,
  amenitiesObj: PropTypes.any
}
export default ADHostsAmenitiesViewComponent
