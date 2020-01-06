/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import PropTypes from 'prop-types'
import { t } from 'ttag'
import moment from 'moment'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPSupportViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      supportData: this.props.selectedSupportData,
      disabled: true
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState({ supportData: newProps.selectedSupportData })
  }
  render () {
    return (
      <div className='edit-profile preference'>
        <div className='card'>
          <div className='card-header'>
            <div className='row'>
              <div className='col-sm-10'>
                <h4 className='card-title'>{t`lanSPLabelViewTicket`}</h4>
              </div>
              <div className='col-sm-2 text-center' >
                <button className='btn btn-primary mb-0' onClick={() => this.props.handleViewSupport(this.state.supportData)}>{t`lanCommonButtonBack`}</button>
              </div>
            </div>
          </div>
          <div className='card-body card-ticket'>
            <div className='row align-items-center mb-3'>
              <div className='col-sm-3'>
                <small className='view-title'>{t`lanSPLabelTicketTitle`}</small>
                <h5 className='mb-0 text-sm'>{this.state.supportData.ticketTitle}</h5>
              </div>
              <div className='col-sm-3'>
                <small className='view-title'>{t`lanSPLabelTicketType`}</small>
                <h5 className='mb-0 text-sm'>{this.state.supportData.ticketTag}</h5>
              </div>
              <div className='col-sm-3'>
                <small className='view-title'>{t`lanSPLabelTicketNumber`}</small>
                <h5 className='mb-0 text-sm'>{this.state.supportData.ticketNumType + this.state.supportData.ticketNumber}</h5>
              </div>
              <div className='col-sm-3'>
                <small className='view-title'>{t`lanSPLabelTicketStatus`}</small>
                <h5 className='mb-0 text-sm'>{this.state.supportData.ticketStatus}</h5>
              </div>
            </div>
            <div className='row align-items-center mb-2'>
              <div className='col-sm-3 col-6'>
                <small className='view-title'>{t`lanCommonLabelDate`}</small>
                <h5 className='mb-0 text-sm'>{moment(this.state.supportData.createdAt).format('MMM DD, YYYY')}</h5>
              </div>
              <div className='col-sm-8 col-6'>
                <small className='view-title'>{t`lanSPLabelTicketDescription`}</small>
                <h5 className='mb-0 text-sm'>{this.state.supportData.ticketDescription}</h5>
              </div>
            </div>
            {/* <div className='row'>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>{t`lanSPLabelTicketTitle`}</label>
                  <input type='ticket' className='form-control' value={this.state.supportData.ticketTitle} disabled={this.state.disabled} />
                </div>
              </div>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>{t`lanSPLabelTicketType`}</label>
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
                  <label>{t`lanSPLabelTicketNumber`}:</label>
                  <input type='text' className='form-control' value={this.state.supportData.ticketNumType + this.state.supportData.ticketNumber} disabled={this.state.disabled} />
                </div>
              </div>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>{t`lanSPLabelTicketStatus`}:</label>
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
              <label className='col-md-12 pl-0 col-form-label form-control-label'> {t`lanSPLabelTicketDescription`}</label>
              <div className='col-md-12 pl-0'>
                <textarea className='form-control textarea' id='exampleFormControlTextarea1' rows='6'
                  value={this.state.supportData.ticketDescription} disabled={this.state.disabled} />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    )
  }
}
SPSupportViewComponent.propTypes = {
  selectedSupportData: PropTypes.any,
  handleViewSupport: PropTypes.any
}
export default SPSupportViewComponent
