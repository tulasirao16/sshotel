/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
// import ReactDrawer from 'react-drawer'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import { t } from 'ttag'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import moment from 'moment'
import PropTypes from 'prop-types'
// import Switch from 'react-switch'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class SPSupportEditComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      supportData: this.props.selectedSupportData,
      oldSupportData: this.props.selectedSupportData,
      errorMessage: ''
    }
    this.handleBack = this.handleBack.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  // componentWillMount () {
  //   // let supportData = JSON.parse(localStorage.getItem('supportData'))
  //   this.setState({
  //     supportData: supportData,
  //     oldSupportData: supportData
  //   })
  // }

  componentWillReceiveProps (newProps) {
    this.setState({ supportData: newProps.selectedSupportData, oldSupportData: newProps.selectedSupportData })
  }

  handleBack () {
    hashHistory.push('/host/support')
    event.preventDefault()
  }
  handleUpdate () {
    if (!this.state.supportData.ticket) {
      this.setState({ errorMessage: t`lanCommonLabelErrorTicketTypeRequired` })
    } else if (!this.state.supportData.ticketDescription.trim()) {
      this.setState({ errorMessage: t`lanCommonLabelErrorDescriptionRequired` })
    } else {
      var isUpdate = JSON.stringify(this.state.oldSupportData) === JSON.stringify(this.state.supportData)
      if (isUpdate) {
        this.props.handleEditSupport(this.state.supportData, false)
      } else {
        let supportObj = {
          ticket: this.state.supportData.ticket,
          ticketDescription: this.state.supportData.ticketDescription
        }
        let _this = this
        let obj = { url: config.baseUrl + config.putSPSupportUpdateAPI + this.state.supportData._id, body: supportObj }
        APICallManager.putCall(obj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            toast.success('Ticket Updated Successfully', {
              position: toast.POSITION.TOP_CENTER
            });
            setTimeout(() => {
              _this.props.handleEditSupport(resObj.data.statusResult, true)
            }, 2000)
            // _this.props.handleEditSupport(resObj.data.statusResult, true)
            // hashHistory.push('/host/support')
          } else {
            toast.error('Ticket Update failed', {
              position: toast.POSITION.TOP_CENTER
            });
            _this.setState({ errorMessage: t`lanCommonLabelErrorRecordUpdateFailed` })
          }
        })
      }
    }
    event.preventDefault()
  }
  render () {
    return (
      <div >
        {/* ------- Navbar --------- */}
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a href='#'><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={() => this.props.handleEditSupport(this.state.supportData, false)}>Support</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>Support Edit Page</li>
                    </ol>
                  </nav>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  {/* <a className='btn btn-sm btn-neutral'>Edit Ticket</a> */}
                  {/* <a href='#' className='btn btn-sm btn-neutral'>Filters</a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6 pb-3'>
          <div className='row justify-content-center support-edit'>
            <div className='col-md-12 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header'>
                  <h6 className='h2 d-inline-block mb-0'>{t`lanSPButtonEditTicket`}</h6>
                </div>
                <div className='card-body'>
                  <section className='notifications'>
                    <div className='row py-2'>
                      <small className='edit-title col-sm-2' >{t`lanCommonLabelTicketType`}</small>
                      <div className='col-md-3'>
                        <select className='form-control' id='exampleFormControlSelect1' onChange={
                            () =>
                              this.setState(prevState => {
                                let supportData = Object.assign({}, prevState.supportData)
                                let errorMessage = ''
                                supportData.ticket = event.target.value
                                return { supportData, errorMessage }
                              })
                            } value={this.state.supportData.ticket} >
                          <option value='Ticket1'>Ticket1</option>
                          <option value='Ticket2'>Ticket2</option>
                        </select>
                      </div>
                      <div className='col-md-2'>
                        <small className='view-title ' >{t`lanCommonLabelTicketNumber`}:</small>
                        <h5 className='mb-0'>{this.state.supportData.ticketNumber}</h5>
                      </div>
                      <div className='col-md-2'>
                        <small className='view-title ' >{t`lanCommonLabelStatus`}:</small>
                        <h5 className='mb-0'>{this.state.supportData.status}</h5>
                      </div>
                      <div className='col-md-2'>
                        <small className='view-title' >{t`lanCommonLabelDate`}:</small>
                        <h5 className='mb-0'>{moment(this.state.supportData.createdAt).format('MMM DD, YYYY')}</h5>
                      </div>
                    </div>
                    <div className='row clearfix'>
                      <div className='col-md-12 col-lg-12 col-xl-12'>
                        {/* List group */}
                        <div className='list-group list-group-flush'>
                          <form>
                            <div className='row'>
                              <small className='mb-2 edit-title col-sm-2'>{t`lanCommonLabelDescription`}</small>
                              <div className='form-group col-sm-8'>
                                <textarea className='form-control edit-textarea' id='exampleFormControlTextarea1' rows='5' maxLength='500' onChange={
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
                            <div className='row'>
                              <div className='container'>
                                <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col-sm-12 text-center'>
                                <button className='btn btn-primary update-edit' onClick={this.handleUpdate}>{t`lanCommonButtonUpdate`}</button>
                                <ToastContainer rtl />
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                {/* <div className='card-footer text-center'>
                  <button className='btn btn-primary mb-0' onClick={() => this.props.handleEditSupport(this.state.supportData, false)}>{ t`lanCommonButtonBack` }</button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SPSupportEditComponent.propTypes = {
  handleEditSupport: PropTypes.any,
  selectedSupportData: PropTypes.any
}
export default SPSupportEditComponent
