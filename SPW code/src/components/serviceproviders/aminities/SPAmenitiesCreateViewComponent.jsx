/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
// import { hashHistory } from 'react-router'
import config from '../../../../public/config.json'
// import APICallManager from '../../../services/callmanager'
import PropTypes from 'prop-types'
import 'react-drawer/lib/react-drawer.css'
import 'react-datepicker/dist/react-datepicker.css'
import { t } from 'ttag'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPAmenitiesCreateViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      date: new Date(),
      amenitiesData: this.props.amenitiesObj,
      amenityStatus: this.props.amenitiesObj.status,
      amenityType: this.props.amenitiesObj.type,
      charge:  this.props.amenitiesObj.price === 0 ? '0' : this.props.amenitiesObj.price,
      errorMessage: '',
      value: this.props.value,
      editable: true,
      errorClass: false
    }
    this.handleSelectAmenityStatus = this.handleSelectAmenityStatus.bind(this)
    this.handleSelectAmenityType = this.handleSelectAmenityType.bind(this)
    this.handleAmenityCharge = this.handleAmenityCharge.bind(this)
    this.handleAmenityCreate = this.handleAmenityCreate.bind(this)
    this.handleAminityViewBack = this.handleAminityViewBack.bind(this)
  }
  componentWillMount () {
    this.setState({ errorClass:'label-control text-danger' })
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
  handleAmenityCreate () {
    if (this.state.amenityStatus === this.state.amenitiesData.amenityStatus && this.state.amenityType === this.state.amenitiesData.amenityType && this.state.charge === this.state.amenitiesData.amenityCharge) {
      this.props.handleAminityViewCreate()
    } else if (this.state.amenityType === 'Paid' && this.state.charge === '0') {
      this.setState({ errorMessage: t`lanSPLabelErrorAmenityCharged` })
    } else {
      let modifiedObj = {
        amenityStatus: this.state.amenityStatus,
        amenityType: this.state.amenityType,
        charge: this.state.charge
      }
      this.props.handleAminityViewCreate(modifiedObj, this.state.value)
      this.props.handleAmenitiesChange(false)
    }
  }
  handleAminityViewBack () {
    this.props.handleAminityViewBack()
  }
  render () {
    return (
      <div style={{ backgroundColor:'#fff' }}>
        <div className='table-user mb-3'>
          <img src={this.state.amenitiesData.amenityIconPath ? config.baseUrl + this.state.amenitiesData.amenityIconPath : require('../images/amenities/wifi.png')} className='icon-calendar' />
          <a ><strong>{this.state.amenitiesData.name}</strong></a>
        </div>
        <div>
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
                  <select className='form-control' onChange={this.handleSelectAmenityStatus} value={this.state.amenityStatus}>
                    <option value='Available'>Available</option>
                    <option value='Unavailable'>Unavailable</option>
                  </select>
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelAmenityType`}<span className='error'>*</span></label>
                  <select className='form-control' onChange={this.handleSelectAmenityType} value={this.state.amenityType}>
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
                    className='form-control' />
                </div>
              </div>
            </div>
            <p className='text-center'><label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label></p>
            <div className='row'>
              <div className='col-md-12 text-center'>
                <button className='btn btn-default' onClick={this.handleAminityViewBack}>{t`lanCommonButtonBack`}</button>
                <button className='btn btn-primary update-edit' onClick={this.handleAmenityCreate}>{t`lanCommonButtonDone`}</button>
              </div>
            </div>
          </section>
        </div>
        {/* <div className='main-content' id='panel'>
          <div className='header bg-primary pb-6'>
            <div className='container'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitleAmenity`} {t`lanCommonButtonCreate`}</h6>
                  </div>
                  <div className='col-lg-6 col-5 text-right'>
                    <a onClick={this.handleEditView} className='btn btn-sm btn-neutral'>Edit Ticket</a>
                    <a href='#' className='btn btn-sm btn-neutral'>Filters</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container mt--6 '>
            <div className='row justify-content-center aminities-view'>
              <div className='col-lg-5 card-wrapper'>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    )
  }
}
SPAmenitiesCreateViewComponent.propTypes = {
  amenitiesObj: PropTypes.object,
  handleAminityViewCreate: PropTypes.func,
  value: PropTypes.number,
  handleAminityViewBack: PropTypes.func,
  handleAmenitiesChange: PropTypes.func
}

export default SPAmenitiesCreateViewComponent
