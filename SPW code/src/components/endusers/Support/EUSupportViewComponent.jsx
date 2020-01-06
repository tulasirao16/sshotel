/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import { t } from 'ttag'
import moment from 'moment'
import '../profile/css/Profile.css'

class EUSupportViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      authObj: JSON.parse(localStorage.getItem('authObj')),
      supportData: this.props.selectedSupportData,
      disabled: true
    }
  }
  componentWillReceiveProps (newProps) {
    this.setState({ supportData: newProps.selectedSupportData })
  }
  render () {
    return (
      <div className='edit-profile-info preference'>
        <div className='card'>
          <div className='card-header card-header-danger'>
            <div className='col-sm-10'>
              <h4 className='card-title'>{t`lanEUTitleTicketView`}</h4>
            </div>
            <div className='col-sm-2 text-center' >
              <button className='btn btn-primary mb-0' onClick={() => this.props.handleViewSupport(this.state.supportData)}>{t`lanCommonButtonBack`}</button>
            </div>
          </div>
          <div className='card-body card-ticket'>
            <div className='row'>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>{t`lanEULabelTicketTitle`}</label>
                  <input type='ticket' className='form-control' value={this.state.supportData.ticketTitle} disabled={this.state.disabled} />
                </div>
              </div>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>{t`lanEULabelTicketType`}</label>
                  <div className=''>
                    <select className='form-control' id='exampleFormControlSelect1' disabled={this.state.disabled}>
                      <option>{this.state.supportData.ticketTag}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>{t`lanEULabelTicketNumber`}:</label>
                  <input type='text' className='form-control' value={this.state.supportData.ticketNumType + this.state.supportData.ticketNumber} disabled={this.state.disabled} />
                </div>
              </div>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>{t`lanEULabelTicketStatus`}:</label>
                  <input type='email' className='form-control' value={this.state.supportData.ticketStatus} disabled={this.state.disabled} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>{t`lanCommonLabelDate`}:</label>
                  <input type='text' className='form-control' value={moment(this.state.supportData.createdAt).format('MMM DD, YYYY')} disabled={this.state.disabled} />
                </div>
              </div>
            </div>
            <div className='form-group '>
              <label className='col-md-12 pl-0 col-form-label form-control-label'>{t`lanEULabelTicketDescription`} </label>
              <div className='col-md-12 pl-0'>
                <textarea className='form-control textarea' id='exampleFormControlTextarea1' rows='6'
                  value={this.state.supportData.ticketDescription} disabled={this.state.disabled} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
EUSupportViewComponent.propTypes = {
  selectedSupportData: PropTypes.any,
  handleViewSupport: PropTypes.any

}

export default EUSupportViewComponent
