/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

import '../../../components/admin/css/all.min.css'
import '../../../components/admin/css/argon.min.css'
import '../../../components/admin/css/nucleo.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

class ADTicketEditComponent extends React.Component {
  constructor () {
    super()
    let TicketData = JSON.parse(localStorage.getItem('TicketData'))
    let actionType = localStorage.getItem('actionType')
    this.state = {
      ticketData: TicketData,
      _id: TicketData._id,
      ticketNumber: TicketData.ticketNumber,
      ticketNumType: TicketData.ticketNumType,
      ticketGroup: TicketData.ticketGroup,
      ticketTag: TicketData.ticketTag,
      ticketPriority:  TicketData.ticketPriority,
      adminUserData: [],
      adminUserId: TicketData.adminUserId,
      adminUserName: TicketData.adminUserName,
      ticketStatus: TicketData.ticketStatus,
      requesterMobileNum: TicketData.reqMobileNumber,
      requesterEmail: TicketData.reqEmail,
      requesterName: '',
      ticketTitle: TicketData.ticketTitle,
      ticketDescription: TicketData.ticketDescription,
      notes: TicketData && TicketData.notes ? TicketData.notes : '',
      actionType: actionType,
      assignToIsRequired: false,
      reassignToIsRequired: false,
      notesIsRequired: false,
      assignDisable: false,
      reassignAdminUserId: '',
      reassignAdminUserName: '',
      newNotes: '',
      buttonDisable: false
    }
    this.handleSelectUser = this.handleSelectUser.bind(this)
    this.handleSelectReassignUser = this.handleSelectReassignUser.bind(this)
    this.handleUpdateTicket = this.handleUpdateTicket.bind(this)
  }
  componentWillMount () {
    let TicketData = JSON.parse(localStorage.getItem('TicketData'))
    let actionType = localStorage.getItem('actionType')
    if (actionType === 'Assign' && TicketData.ticketStatus === 'New') {
      this.setState({ assignToIsRequired: true })
    }
    if (actionType === 'Escalate' || actionType === 'Onhold' || actionType === 'Duplicate' || actionType === 'Resolved' || actionType === 'Reassign' || actionType === 'Completed') {
      this.setState({ notesIsRequired: true })
    }
    if (actionType === 'Inprogress' && (TicketData.ticketStatus === 'Open' || TicketData.ticketStatus === 'Escalate' || TicketData.ticketStatus === 'Onhold')) {
      this.setState({ assignDisable: true })
    }
    if (actionType === 'Reassign' && (TicketData.ticketStatus === 'Open' || TicketData.ticketStatus === 'Inprogress')) {
      this.setState({ assignDisable: true, reassignToIsRequired: true })
    }
  }
  componentDidMount () {
    let getADTicketsDashboardCountsObj = {
      url: config.baseUrl + config.getADUsersListForTicketsAPI
    }
    let _this = this
    APICallManager.getCall(getADTicketsDashboardCountsObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ adminUserData: resObj.data.statusResult })
      }
    })
  }
  handleSelectUser (event) {
    if (event.target.value === '') {
      this.setState({ adminUserId: '', adminUserName: '' })
    } else {
      let adminUserData = this.state.adminUserData
      let index = adminUserData.findIndex(info => info._id === event.target.value)
      this.setState({ adminUserId: adminUserData[index]._id, adminUserName: adminUserData[index].name, errorMessage: '' })
    }
  }
  handleSelectReassignUser (event) {
    if (event.target.value === '') {
      this.setState({ ticketStatus: 'New', assignStatus:'Unassigned', adminUserId: '', adminUserName: '' })
    } else {
      let adminUserData = this.state.adminUserData
      let index = adminUserData.findIndex(info => info._id === event.target.value)
      this.setState({ reassignAdminUserId: adminUserData[index]._id, reassignAdminUserName: adminUserData[index].name, errorMessage: '' })
    }
  }
  handleUpdateTicket () {
    if (!this.state.adminUserName) {
      this.setState({ errorMessage: 'Select User' })
    } else if (this.state.assignToIsRequired && this.state.adminUserId === '') {
      this.setState({ errorMessage: 'Assign to is required' })
    } else if (this.state.reassignToIsRequired && this.state.reassignAdminUserId === '') {
      this.setState({ errorMessage: 'Reassign to is required' })
    } else if (this.state.notesIsRequired && this.state.newNotes.trim() === '') {
      this.setState({ errorMessage: 'Notes is required' })
    } else {
      this.setState({ buttonDisable: true })
      var updateObj = {
        adminUserId: this.state.reassignAdminUserId ? this.state.reassignAdminUserId : this.state.adminUserId,
        adminUserName: this.state.reassignAdminUserName ? this.state.reassignAdminUserName : this.state.adminUserName,
        ticketPriority: this.state.ticketPriority,
        ticketStatus: this.state.actionType === 'Reassign' || this.state.actionType === 'Assign' ? 'Open' : this.state.actionType,
        notes: this.state.newNotes ? this.state.newNotes : this.state.notes,
        reassignStatus: this.state.actionType === 'Reassign' || this.state.reassignAdminUserId !== '' ? 'true' : 'false'
      }
      let _this = this
      let obj = { url: config.baseUrl + config.putADTicketsUpdateAPI + this.state._id, body: updateObj }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj && resObj.data.statusCode === '0000') {
          setTimeout(() => {
            hashHistory.push('admin/tickets')
          }, 2000)
          ToastsStore.success('Ticket Updated Succesfully')
        } else {
          _this.setState({ buttonDisable: false })
          ToastsStore.error('Ticket Updated failed')
        }
      })
    }
    event.preventDefault()
  }
  render () {
    return (
      <div>
        {/* ---------- Header Ends ------------- */}
        <div className='container-fluid mt--6 mb-4'>
          <div className='row justify-content-center'>
            <div className='col-lg-12 col-md-12'>
              <div className='card border-0 mb-0'>
                <div className='card-header bg-transparent pb-3'>
                  <div className='row'>
                    <div className='col-sm-8'>
                      <h5 className='card-title'>{t`lanEUTitleTicketEdit`}</h5>
                    </div>
                    <div className='col-sm-4 text-center'>
                      <h5 className='card-title'>{t`lanCommonLabelTicketNumber`}:{this.state.ticketNumType}{this.state.ticketNumber}</h5>
                    </div>
                  </div>
                </div>
                <div className='card-body px-lg-4 py-lg-4'>
                  <form>
                    <div className='row'>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label >{t`lanCommonLabelGroup`}: {this.state.ticketGroup}</label>
                          <select className='form-control' id='exampleFormControlSelect1' value={this.state.ticketGroup} disabled={this.state.ticketGroup} >
                            <option value='Marketing'>{t`lanADLabelTicketMarketing`}</option>
                            <option value='Host Service'>{t`lanADLabelTicketHostService`}</option>
                            <option value='Enduser Service'>{t`lanADLabelTicketEnduserService`}</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label >Tags</label>
                          <select className='form-control' id='exampleFormControlSelect1' value={this.state.ticketTag} disabled={this.state.ticketGroup} >
                            <option value='Onboarding'>{t`lanADLabelTicketOnboarding`}</option>
                            <option value='Booking'>{t`lanCommonLabelBooking`}</option>
                            <option value='Refund'>{t`lanADLabelTicketRefund`}</option>
                            <option value='Property'>{t`lanCommonLabelProperty`}</option>
                            <option value='Cancellation'>{t`lanADLabelTicketCancellation`}</option>
                            <option value='Account'>{t`lanADLabelTicketAccount`}</option>
                            <option value='Payment'>{t`lanADLabelTicketPayment`}</option>
                            <option value='Dispute'>{t`lanADLabelTicketDispute`}</option>
                            <option value='Other'>{t`lanADLabelTicketOther`}</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label >{t`lanCommonLabelPriority`}</label>
                          <select className='form-control' id='exampleFormControlSelect1' value={this.state.ticketPriority} onChange={() => this.setState({ ticketPriority: event.target.value, errorMessage: '' })}>
                            <option value='Low'>{t`lanADLabelTicketLow`}</option>
                            <option value='Medium'>{t`lanADLabelTicketMedium`}</option>
                            <option value='High'>{t`lanADLabelTicketHigh`}</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanADLabelTicketAssignTo`} {this.state.assignToIsRequired ? '*' : '' }</label>
                          <select className='form-control' id='exampleFormControlSelect1' value={this.state.adminUserId} onChange={(event) => this.handleSelectUser(event)} disabled={this.state.assignDisable} >
                            <option value=''>{t`lanADLabelTicketSelectUser`}</option>
                            {this.state.adminUserData && this.state.adminUserData.length >= 1
                            ? this.state.adminUserData.map((data, i) =>
                              <option value={data._id} key={i}>{data.name}</option>
                            )
                          : '' }
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label >{t`lanCommonLabelStatus`}</label>
                          <input type='text' className='form-control' id='exampleFormControlInput1' value={this.state.ticketStatus} disabled={this.state.ticketStatus} />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <div className='row'>
                            <label className='col-sm-8'>{t`lanCommonLabelRequester`} {t`lanCommonLabelMobileNumber`}</label>
                            <a onClick={this.handleGetDetails}><label className='text-primary pl-3'>{t`lanADLabelTicketGetDetails`}</label></a>
                          </div>
                          <input type='text' className='form-control' id='exampleFormControlInput1' placeholder='Enter Subject' value={this.state.requesterMobileNum} disabled={this.state.requesterMobileNum} />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelRequester`} {t`lanCommonLabelEmail`}</label>
                          <input type='text' className='form-control' id='exampleFormControlInput1' placeholder='Enter Requester' value={this.state.requesterEmail} disabled={this.state.requesterMobileNum} />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelRequester`} {t`lanCommonLabelName`}</label>
                          <input type='text' className='form-control' id='exampleFormControlInput1' placeholder='Enter Requester' value={this.state.requesterName} disabled={this.state.requesterMobileNum} />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanADLabelTicketSubject`}</label>
                          <input type='text' className='form-control' id='exampleFormControlInput1' placeholder='Enter Subject' value={this.state.ticketTitle} disabled={this.state.ticketTitle} />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelDescription`}</label>
                          <textarea className='form-control' id='exampleFormControlTextarea1' rows='3'
                            placeholder='Write a large text here ...' value={this.state.ticketDescription} disabled={this.state.ticketDescription} />
                        </div>
                      </div>
                      <div className='col-md-3 pr-1'>
                        {this.state.notes
                        ? <div className='form-group'>
                          <label>{t`lanADLabelTicketGivenNotes`}</label>
                          <textarea className='form-control' id='exampleFormControlTextarea1' rows='3'
                            placeholder='Write a large text here ...' value={this.state.notes} onChange={() => this.setState({ notes: event.target.value })} disabled={this.state.notes} />
                        </div>
                        : '' }
                        <div className='form-group'>
                          <label>Notes{this.state.notesIsRequired ? '*' : ''}</label>
                          <textarea className='form-control' id='exampleFormControlTextarea1' rows='3'
                            placeholder='Write a large text here ...' value={this.state.newNotes} onChange={() => this.setState({ newNotes: event.target.value })} />
                        </div>
                      </div>
                      <div className='col-md-3'>
                        {this.state.assignDisable
                          ? <div className='form-group'>
                            <label>{t`lanADLabelTicketReassignTo`} {this.state.reassignToIsRequired ? '*' : '' }</label>
                            <select className='form-control' id='exampleFormControlSelect1' value={this.state.reassignAdminUserId} onChange={(event) => this.handleSelectReassignUser(event)} >
                              <option value=''>{t`lanADLabelTicketSelectUser`}</option>
                              {this.state.adminUserData && this.state.adminUserData.length >= 1
                              ? this.state.adminUserData.map((data, i) =>
                                data._id !== this.state.adminUserId
                                ? <option value={data._id} key={i}>{data.name}</option>
                                : ''
                              )
                            : '' }
                            </select>
                          </div>
                          : '' }
                      </div>
                    </div>
                    <label className='text-danger' >{this.state.errorMessage}</label>
                    <div className='row'>
                      <div className='update ml-auto mr-auto'>
                        <button disabled={this.state.buttonDisable} className='btn btn-primary btn-round' onClick={this.handleUpdateTicket}>{this.state.actionType}</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}

export default ADTicketEditComponent
