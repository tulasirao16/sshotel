/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { t } from 'ttag'

import '../profile/css/Profile.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

class EUSupportDeleteComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      supportData: this.props.selectedSupportData
    }
    this.handleDelete = this.handleDelete.bind(this)
  }
  componentWillReceiveProps (newProps) {
    this.setState({ supportData: newProps.selectedSupportData })
  }
  handleDelete () {
    let obj = {
      url: config.baseUrl + config.deleteEUSupportDeleteAPI + this.state.supportData._id
    }
    let _this = this
    APICallManager.deleteCall(obj, function (resObj) {
      if (resObj.data.statusCode === '1205') {
        _this.props.handleDeleteSupport(_this.state.supportData, true)
      } else {
        _this.setState({ errorMessage: t`lanSPErrorDeleteFailed` })
      }
    })
  }

  render () {
    return (
      <div className='edit-profile-info preference'>
        <div className='card'>
          <div className='card-header card-header-danger'>
            <h4 className='card-title'>{t`lanEUTitleTicketDelete`}</h4>
            {/* <p className='card-category'></p> */}
          </div>
          {/* edit prfile htmlForm */}
          <div className='edit-profile-form ticket-view '>
            <div className='card-body'>
              <div className=' card-ticket'>
                <div className='row card-header px-0  align-items-center mb-2'>
                  <div className='col-sm-4'>
                    <small>{t`lanEULabelTicketType`}:</small>
                    <h5 className='mb-0 text-sm'>{this.state.supportData.ticket}</h5>
                  </div>
                  <div className='col-sm-2'>
                    <small>{t`lanEULabelTicketNumber`}:</small>
                    <h5 className='mb-0 text-sm'>{this.state.supportData.ticketNumber}</h5>
                  </div>
                  <div className='col-sm-2'>
                    <small>{t`lanEULabelTicketCreatedOn`}:</small>
                    <h5 className='mb-0 text-sm'>{moment(this.state.supportData.createdAt).format('MMM DD, YYYY')}</h5>
                  </div>
                  <div className='col-sm-2'>
                    <small>{t`lanCommonLabelStatus`}:</small>
                    <h5 className='mb-0 text-sm'>{this.state.supportData.status}</h5>
                  </div>
                </div>
                <p className='ticket-msg'>{this.state.supportData.ticketDescription}</p>
              </div>
              <div className='card-footer text-center'>
                <button className='btn btn-primary mb-0' onClick={() => this.props.handleDeleteSupport(this.state.supportData)}>{t`lanCommonButtonBack`}</button>
                <button className='btn btn-primary mb-0' onClick={this.handleDelete}>{t`lanCommonButtonDelete`}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

EUSupportDeleteComponent.propTypes = {
  selectedSupportData: PropTypes.any,
  handleDeleteSupport: PropTypes.any

}

export default EUSupportDeleteComponent
