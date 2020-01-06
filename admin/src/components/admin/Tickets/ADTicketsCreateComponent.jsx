/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
// import { hashHistory } from 'react-router'
import { t } from 'ttag'
import 'react-drawer/lib/react-drawer.css'
// import DatePicker from 'react-datepicker'
// import moment from 'moment'
// import APICallManager from '../../../services/callmanager'
// import PropTypes from 'prop-types'

// import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class TicketCreateComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ticketGroup: '',
      ticketTag: '',
      ticketStatus: 'New',
      ticketDescription: '',
      bussinessName: '',
      adminUserData: [],
      contactPerson: '',
      mobileNumber: '',
      email: '',
      propertyType: '',
      city: '',
      address : '',
      requesterMobileNum: '',
      requesterEmail: '',
      requesterName: '',
      ticketTitle: '',
      spName: '',
      reqEmail: '',
      adminUserId: '',
      assignStatus: 'Unassigned',
      euResObj: {},
      spResObj: {},
      ticketNumberType: '',
      errorMessage: '',
      adminUserName: '',
      mobileVerified: false,
      emailVerified: false,
      mobileNumVerifyStatus: false,
      emailVerifyStatus: false,
      buttonDisable: false
    }
    this.handleChangeTicketGroup = this.handleChangeTicketGroup.bind(this)
    this.handleGetDetails = this.handleGetDetails.bind(this)
    this.handleSelectUser = this.handleSelectUser.bind(this)
    this.handleCreateTicket = this.handleCreateTicket.bind(this)
    this.handleSetTicketNumberType = this.handleSetTicketNumberType.bind(this)
    this.handleVerifyMobile = this.handleVerifyMobile.bind(this)
    this.handleCreateOnboardingTicket = this.handleCreateOnboardingTicket.bind(this)
    this.handleVerifyEmail = this.handleVerifyEmail.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
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
  handleChangeTicketGroup (event) {
    this.setState({ ticketGroup: event.target.value, errorMessage: '' })
    if (event.target.value === 'Marketing') {
      this.setState({ ticketTag: 'Onboarding', ticketPriority: 'High', ticketTitle: 'Onboarding' })
    } else {
      this.setState({ ticketTag: '', ticketPriority: 'Medium', ticketTitle: '' })
    }
  }
  handleGetDetails () {
    if (this.state.ticketGroup.trim() && this.state.requesterMobileNum) {
      let getADTicketsUserDetailsObj = {
        url: config.baseUrl + config.getADTicketsUserDetailsAPI + this.state.requesterMobileNum + '/' + this.state.ticketGroup
      }
      let _this = this
      APICallManager.getCall(getADTicketsUserDetailsObj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          if (_this.state.ticketGroup === 'End User Service') {
            _this.setState({
              euResObj: resObj.data.statusResult,
              requesterEmail: resObj.data.statusResult.email,
              requesterName: resObj.data.statusResult.name
            })
          } else {
            _this.setState({
              spResObj: resObj.data.statusResult,
              requesterEmail: resObj.data.statusResult.email,
              requesterName: resObj.data.statusResult.name
            })
          }
        }
      })
    } else {
      this.setState({ errorMessage: t`lanADAlertLabelTicketsSelectTicketGroupAndRequestMobileNumber` })
    }
  }
  handleVerifyMobile () {
    const phRegex = /^\d{10}$/

    if (!this.state.mobileNumber.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorMobileNumberRequired` })
    } else if (!phRegex.test(this.state.mobileNumber)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidMobileNumber` })
    } else {
      let _this = this
      let getADTicketsUserDetailsObj = {
        url: config.baseUrl + config.getADTicketsUserDetailsAPI + _this.state.mobileNumber + '/' + 'supplier'
      }
      APICallManager.getCall(getADTicketsUserDetailsObj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ errorMessage: t`lanSPLabelErrorUserMobileNumberExist`, mobileVerified: true, mobileNumVerifyStatus: true })
        } else {
          _this.setState({ mobileVerified: false, mobileNumVerifyStatus: true, errorMessage: '' })
        }
      })
    }
  }
  handleVerifyEmail () {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[\.]{1}[a-zA-Z]{2,4}$/

    if (!this.state.email.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorEmailRequired` })
    } else if (!emailRegex.test(this.state.email)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidEMail` })
    } else {
      let _this = this
      let getADTicketsUserDetailsObj = {
        url: config.baseUrl + config.getADTicketsUserDetailsAPI + _this.state.email + '/' + 'supplier'
      }
      APICallManager.getCall(getADTicketsUserDetailsObj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ errorMessage: t`lanSPLabelErrorUserEmailExist`, emailVerified: true, emailVerifyStatus: true })
        } else {
          _this.setState({ emailVerified: false, emailVerifyStatus: true, errorMessage: '' })
        }
      })
    }
  }
  handleCreateTicket () {
    const phRegex = /^\d{10}$/
    const emailValidation = /^[a-z0-9._%+-]+@[a-z0-9.-]+[\.]{1}[a-z]{2,4}$/
    if (!this.state.ticketGroup) {
      this.setState({ errorMessage: 'Ticket-Groups is required' })
    } else if (!this.state.ticketTag) {
      this.setState({ errorMessage: t`lanADErrorLabelTicketsTicketTagIsRequired` })
    } else if (!this.state.ticketPriority) {
      this.setState({ errorMessage: t`lanADErrorLabelTicketsTicketPriorityIsRequired` })
    } else if (!this.state.ticketStatus) {
      this.setState({ errorMessage: t`lanADErrorLabelTicketsTicketStatusIsRequired` })
    } else if (!this.state.requesterMobileNum) {
      this.setState({ errorMessage: t`lanADErrorLabelTicketsMobileNumberIsRequired` })
    } else if (!this.state.requesterMobileNum.trim().match(phRegex)) {
      this.setState({ errorMessage: t`lanEULabelErrorInvalidMobileNumber` })
    } else if (this.state.requesterEmail && !emailValidation.test(this.state.requesterEmail)) {
      this.setState({ errorMessage: t`lanADErrorLabelTicketsInvalidRequesterEmail` })
    } else if (this.state.email && !emailValidation.test(this.state.email)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidEMail` })
    } else if (!this.state.ticketTitle) {
      this.setState({ errorMessage: t`lanADErrorLabelTicketsTicketTitleIsRequried` })
    } else if (!this.state.ticketDescription) {
      this.setState({ errorMessage: t`lanADErrorLabelTicketsTicketDescriptionIsRequried` })
    } else {
      this.setState({ buttonDisable: true })
      let ticketNumberType = this.handleSetTicketNumberType()
      const postObj = {
        reqMobileNumber: this.state.requesterMobileNum,
        ticketTitle: this.state.ticketTitle,
        ticketDescription: this.state.ticketDescription,
        ticketNumberType: ticketNumberType,
        ticketGroup: this.state.ticketGroup,
        ticketTag: this.state.ticketTag,
        ticketPriority: this.state.ticketPriority,
        ticketStatus: this.state.ticketStatus,
        assignStatus: this.state.assignStatus,
        euUserId: this.state.euResObj && this.state.euResObj._id ? this.state.euResObj._id : '',
        euName: this.state.euResObj && this.state.euResObj._id ? this.state.euResObj.name : '',
        spServiceProviderId: this.state.spResObj && this.state.spResObj._id ? this.state.spResObj.spServiceProviderId : '',
        spServiceProvider: this.state.spResObj && this.state.spResObj._id ? this.state.spResObj.spServiceProvider : '',
        spUserId: this.state.spResObj && this.state.spResObj._id ? this.state.spResObj._id : '',
        spName:  this.state.spResObj && this.state.spResObj._id ? this.state.spResObj.name : '',
        reqEmail: this.state.requesterEmail,
        bussinessName: this.state.bussinessName,
        contactPerson: this.state.contactPerson,
        mobileNumber: this.state.mobileNumber,
        email: this.state.email,
        propertyType: this.state.propertyType,
        city: this.state.city,
        address: this.state.address,
        adminUserId: this.state.adminUserId,
        adminUserName: this.state.adminUserName
      }
      let _this = this
      let obj = { url: config.baseUrl + config.postADCreateTicketAPI, body: postObj }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj && resObj.data.statusCode === '0000') {
          setTimeout(() => {
            _this.props.handleTicketCreated(resObj.data.statusResult, 'ticket')
          }, 2000)
          _this.props.toastFunction('Successfully')
        } else {
          _this.setState({ buttonDisable: false })
          _this.props.toastFunction('failed')
        }
      })
    }
    event.preventDefault()
  }
  handleCreateOnboardingTicket () {
    const phRegex = /^\d{10}$/
    const emailValidation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[\.]{1}[a-zA-Z]{2,4}$/
    if (!this.state.ticketGroup) {
      this.setState({ errorMessage: t`lanADErrorLabelTicketsTicketGroupIsRequried` })
    } else if (!this.state.ticketTag) {
      this.setState({ errorMessage: t`lanADErrorLabelTicketsTicketTagIsRequired` })
    } else if (!this.state.ticketPriority) {
      this.setState({ errorMessage: t`lanADErrorLabelTicketsTicketPriorityIsRequired` })
    } else if (!this.state.ticketStatus) {
      this.setState({ errorMessage: t`lanADErrorLabelTicketsTicketStatusIsRequired` })
    } else if (!this.state.ticketTitle) {
      this.setState({ errorMessage: t`lanADErrorLabelTicketsTicketTitleIsRequried` })
    } else if (!this.state.bussinessName.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorBusinessNameRequired` })
    } else if (!this.state.contactPerson.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorContactPersonRequired` })
    } else if (!this.state.mobileNumber.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorMobileNumberRequired` })
    } else if (!phRegex.test(this.state.mobileNumber)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidMobileNumber` })
    } else if (this.state.mobileNumVerifyStatus === false) {
      this.setState({ errorMessage: t`lanADErrorLabelTicketsPleaseClickOnMobileNumberGetDetails` })
    } else if (this.state.mobileVerified) {
      this.setState({ errorMessage: t`lanSPLabelErrorUserMobileNumberExist` })
    } else if (!this.state.email.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorEmailRequired` })
    } else if (!emailValidation.test(this.state.email)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInvalidEMail` })
    } else if (this.state.emailVerifyStatus === false) {
      this.setState({ errorMessage: t`lanADErrorLabelTicketsPleaseClickOnEmailGetDetails` })
    } else if (this.state.emailVerified) {
      this.setState({ errorMessage: t`lanSPLabelErrorUserEmailExist` })
    } else if (!this.state.propertyType.trim()) {
      this.setState({ errorMessage: t`lanADErrorLabelTicketsPropertyTypeRequired` })
    } else if (!this.state.city.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorCityRequired` })
    } else if (!this.state.address.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorAdressRequired` })
    } else {
      this.setState({ buttonDisable: true })
      let userData = {
        serviceProvider: this.state.bussinessName,
        contactPerson: this.state.contactPerson,
        contactNumber: this.state.mobileNumber,
        contactAddress: this.state.address,
        city: this.state.city,
        propertyType: this.state.propertyType,
        contactEmail: this.state.email
      }
      let _this = this
      let obj = { url: config.baseUrl + config.postSPUserSignupOnboardingAPI, body: userData }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          setTimeout(() => {
            _this.props.handleTicketCreated(resObj.data.statusResult, 'onboardingTicket')
            _this.props.toastFunction('Successfully')
          }, 2000)
        } else if (resObj.data.statusCode === '9957') {
          setTimeout(() => {
            _this.props.toastFunction('exist Email')
            _this.setState({ buttonDisable: false })
          }, 5000)
        } else if (resObj.data.statusCode === '9956') {
          _this.props.toastFunction('exist Mobilenumber')
        } else if (resObj.data.statusCode === '9951') {
          setTimeout(() => {
            _this.setState({ buttonDisable: false })
          }, 2000)
          _this.props.toastFunction('team will get back')
        } else {
          _this.setState({ buttonDisable: false })
          _this.setState({ errorMessage: t`lanSPLabelErrorFailed` })
        }
      })
    }
    event.preventDefault()
  }
  handleNumber (event) {
    if ((event.charCode >= 32 && event.charCode < 48 && event.charCode !== 40 &&
    event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
    (event.charCode > 57 && event.charCode < 127)) {
      event.preventDefault()
    }
  }
  handleSetTicketNumberType (event) {
    var ticketNumberType = ''
    switch (this.state.ticketTag) {
      case '':
        ticketNumberType = ''
        // this.setState({ ticketTag: event.target.value, ticketNumberType: '', errorMessage: '' })
        break
      case 'Onboarding':
        ticketNumberType = 'MOBT'
        break
      case 'Booking':
        if (this.state.ticketTag === 'End User Service') {
          ticketNumberType = 'EBT'
        } else {
          ticketNumberType = 'SBT'
        }
        break
      case 'Refund':
        if (this.state.ticketTag === 'End User Service') {
          ticketNumberType = 'ERT'
        } else {
          ticketNumberType = 'SRT'
        }
        break
      case 'Property':
        if (this.state.ticketTag === 'End User Service') {
          ticketNumberType = 'EPPT'
        } else {
          ticketNumberType = 'SPPT'
        }
        break
      case 'Cancellation':
        if (this.state.ticketTag === 'End User Service') {
          ticketNumberType = 'ECT'
        } else {
          ticketNumberType = 'SCT'
        }
        break
      case 'Account':
        if (this.state.ticketTag === 'End User Service') {
          ticketNumberType = 'EAT'
        } else {
          ticketNumberType = 'SAT'
        }
        break
      case 'Payment':
        if (this.state.ticketTag === 'End User Service') {
          ticketNumberType = 'EPMT'
        } else {
          ticketNumberType = 'SPMT'
        }
        break
      case 'Dispute':
        if (this.state.ticketTag === 'End User Service') {
          ticketNumberType = 'EDT'
        } else {
          ticketNumberType = 'SDT'
        }
        break
      case 'Other':
        if (this.state.ticketTag === 'End User Service') {
          ticketNumberType = 'EOT'
        } else {
          ticketNumberType = 'SOT'
        }
        break
      default:
        ticketNumberType = ''
    }
    return ticketNumberType
  }
  handleSelectUser () {
    if (event.target.value === '') {
      this.setState({ ticketStatus: 'New', assignStatus:'Unassigned', adminUserId: '', adminUserName: '' })
    } else {
      let adminUserData = this.state.adminUserData
      let index = adminUserData.findIndex(info => info._id === event.target.value)
      this.setState({ adminUserId: adminUserData[index]._id, adminUserName: adminUserData[index].name, errorMessage: '' })
      this.setState({ ticketStatus: 'Open', assignStatus:'Assigned' })
    }
  }
  handleOnChange () {
  }
  render () {
    return (
      <div className='user-create'>
        <div className='py-lg-4'>
          <div className='mb-3'><h3>{t`lanSPButtonCreateTicket`}</h3></div>
          <form>
            <div className='row'>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{t`lanCommonLabelGroups`}</label>
                  <select className='form-control' id='exampleFormControlSelect1' value={this.state.ticketGroup} onChange={(event) => this.handleChangeTicketGroup(event)}>
                    <option value=''>{t`lanADLabelTicketsSelectGroup`}</option>
                    <option value='Marketing'>Marketing</option>
                    <option value='Host Service'>Host Service</option>
                    <option value='End User Service'>End User Service</option>
                  </select>
                </div>
              </div>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{t`lanCommonLabelTags`}</label>
                  {this.state.ticketGroup !== 'Marketing' ? <select className='form-control' id='exampleFormControlSelect1'
                    value={this.state.ticketTag} onChange={() => this.setState({ ticketTag: event.target.value, errorMessage: '' })}>
                    <option value=''>{t`lanADLabelTicketsSelectTag`}</option>
                    <option value='Booking'>Booking</option>
                    <option value='Refund'>Refund</option>
                    <option value='Property'>Property </option>
                    <option value='Cancellation'>Cancellation</option>
                    <option value='Account'>Account</option>
                    <option value='Payment'>Payment</option>
                    <option value='Dispute'>Dispute</option>
                    <option value='Other'>Other</option>
                  </select>
                  : <select className='form-control' id='exampleFormControlSelect1' value={this.state.ticketTag} onChange={() => this.setState({ ticketTag: event.target.value, errorMessage: '' })}>
                    <option value='Onboarding'>Onboarding</option>
                  </select>
                }
                </div>
              </div>
              {this.state.ticketGroup !== 'Marketing'
              ? <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{t`lanCommonLabelPriority`}</label>
                  <select className='form-control' id='exampleFormControlSelect1' value={this.state.ticketPriority} onChange={() => this.setState({ ticketPriority: event.target.value, errorMessage: '' })} >
                    <option value='Low'>Low</option>
                    <option value='Medium'>Medium</option>
                    <option value='High'>High</option>
                  </select>
                </div>
              </div>
              : <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{t`lanCommonLabelPriority`}</label>
                  <select className='form-control' id='exampleFormControlSelect1' value='High'>
                    <option value='High'>High</option>
                  </select>
                </div>
              </div> }
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{t`lanADLabelTicketAssignTo`}</label>
                  <select className='form-control' id='exampleFormControlSelect1' value={this.state.adminUserId} onChange={(event) => this.handleSelectUser(event)} >
                    <option value=''>{t`lanADLabelTicketSelectUser`}</option>
                    {this.state.adminUserData && this.state.adminUserData.length >= 1
                    ? this.state.adminUserData.map((data, i) =>
                      <option value={data._id} key={i}>{data.name}</option>
                    )
                   : '' }
                  </select>
                </div>
              </div>

              { this.state.ticketTag === 'Onboarding'
                ? <div className='container-fluid'>
                  <div className='row'>
                    <div className='col-md-3 pr-1'>
                      <div className='form-group'>
                        <label>{t`lanSPLabelBusinessName`}</label>
                        <input type='text' className='form-control' id='exampleFormControlInput1' value={this.state.bussinessName}
                          onChange={() => this.setState({ bussinessName: event.target.value, errorMessage: '' })} />
                      </div>
                    </div>
                    <div className='col-md-3 pr-1'>
                      <div className='form-group'>
                        <label>{t`lanCommonLabelContactPerson`}</label>
                        <input type='text' className='form-control' id='exampleFormControlInput1' placeholder={t`lanADPlaceHolderLabelTicketsEnterSubject`}
                          value={this.state.contactPerson} onChange={() => this.setState({ contactPerson: event.target.value, errorMessage: '' })} />
                      </div>
                    </div>
                    <div className='col-md-3 pr-1'>
                      <div className='form-group'>
                        <label>{t`lanEULabelMobile`}</label>
                        <a onClick={this.handleVerifyMobile}><label className='text-primary pl-3'>{t`lanADLabelTicketGetDetails`}</label></a>
                        <input type='text' className='form-control' id='exampleFormControlInput1' placeholder={t`lanADPlaceHolderLabelTicketsEnterRequester`} value={this.state.mobileNumber}
                          onKeyPress={this.handleNumber} onChange={() => this.setState({ mobileNumber: event.target.value, errorMessage: '', mobileVerified: false, mobileNumVerifyStatus: false })} />
                      </div>
                    </div>
                    <div className='col-md-3 pr-1'>
                      <div className='form-group'>
                        <label>{t`lanCommonLabelEmail`}</label>
                        <a onClick={this.handleVerifyEmail}><label className='text-primary pl-3'>{t`lanADLabelTicketGetDetails`}</label></a>
                        <input type='text' className='form-control' id='exampleFormControlInput1' placeholder={t`lanADPlaceHolderLabelTicketsEnterRequester`} value={this.state.email}
                          onChange={() => this.setState({ email: event.target.value, errorMessage: '', mobileVerified: false, emailVerifyStatus: false })} />
                      </div>
                    </div>
                    <div className='col-md-3 pr-1'>
                      <div className='form-group'>
                        <label>{t`lanSPLabelPropertyType`}</label>
                        <select className='form-control' id='exampleFormControlSelect1' value={this.state.propertyType} onChange={(event) => this.setState({ propertyType: event.target.value, errorMessage: '' })} >
                          <option value=''>{t`lanADLabelTicketsSelectPropertyType`}</option>
                          <option value='Hotel'>Hotel</option>
                          <option value='Individual'>Individual</option>
                        </select>
                        {/* <input type='text' className='form-control' id='exampleFormControlInput1' placeholder={t`lanADPlaceHolderLabelTicketsEnterSubject`}
                          value={this.state.propertyType} onChange={() => this.setState({ propertyType: event.target.value, errorMessage: '' })} /> */}
                      </div>
                    </div>
                    <div className='col-md-3 pr-1'>
                      <div className='form-group'>
                        <label>{t`lanCommonLabelCity`}</label>
                        <input type='text' className='form-control' id='exampleFormControlInput1' placeholder={t`lanADPlaceHolderLabelTicketsEnterRequester`}
                          value={this.state.city} onChange={() => this.setState({ city: event.target.value, errorMessage: '' })} />
                      </div>
                    </div>
                    <div className='col-md-3 pr-1'>
                      <div className='form-group'>
                        <label>{t`lanCommonLabelAddress`}</label>
                        <input type='text' className='form-control' id='exampleFormControlInput1' placeholder={t`lanADPlaceHolderLabelTicketsEnterRequester`}
                          value={this.state.address} onChange={() => this.setState({ address: event.target.value, errorMessage: '' })} />
                      </div>
                    </div>
                  </div>
                </div> : '' }
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{t`lanCommonLabelStatus`}</label>
                  <input type='text' className='form-control' id='exampleFormControlInput1' value={this.state.ticketStatus} onChange={this.handleOnChange} />
                </div>
              </div>
              {this.state.ticketGroup !== 'Marketing'
             ? <div className='col-md-3 pr-1'>
               <div className='form-group'>
                 <div className='row'>
                   <label className='col-sm-8'>{t`lanADLabelTicketsRequesterMobile`}</label>
                   <a onClick={this.handleGetDetails}><label className='text-primary pl-3'>{t`lanADLabelTicketGetDetails`}</label></a>
                 </div>
                 <input type='text' className='form-control' maxLength='10' id='exampleFormControlInput1' placeholder='Enter Requester Mobile #'
                   value={this.state.requesterMobileNum} onKeyPress={this.handleNumber} onChange={() => this.setState({ requesterMobileNum: event.target.value, errorMessage: '' })} />
               </div>
             </div> : '' }
              {this.state.ticketGroup !== 'Marketing'
            ? <div className='col-md-3 pr-1'>
              <div className='form-group'>
                <label>{t`lanADLabelTicketsRequesterEmail`}</label>
                <input type='text' className='form-control' id='exampleFormControlInput1' placeholder='Enter Requester Email' value={this.state.requesterEmail}
                  onChange={() => this.setState({ requesterEmail: event.target.value, errorMessage: '' })} />
              </div>
            </div> : '' }
              {this.state.ticketGroup !== 'Marketing'
            ? <div className='col-md-3 pr-1'>
              <div className='form-group'>
                <label>{t`lanADLabelTicketsRequesterName`}</label>
                <input type='text' className='form-control' id='exampleFormControlInput1' placeholder='Enter Requester Name'
                  value={this.state.requesterName} onChange={() => this.setState({ requesterName: event.target.value, errorMessage: '' })} />
              </div>
            </div> : '' }
            </div>
            <div className='row'>
              <div className='col-md-3 pr-1'>
                <div className='form-group'>
                  <label>{t`lanCommonLabelTitle`}</label>
                  <input type='text' className='form-control' id='exampleFormControlInput1' placeholder='Enter Title'
                    value={this.state.ticketTitle} onChange={() => this.setState({ ticketTitle: event.target.value, errorMessage: '' })} />
                </div>
              </div>
              <div className='col-md-9'>
                {this.state.ticketGroup !== 'Marketing'
                  ? <div>
                    <div className='form-group'>
                      <label>{t`lanCommonLabelDescription`}</label>
                      <textarea className='form-control' id='exampleFormControlTextarea1' rows='3' placeholder='Tickets Write Large Text Here...'
                        value={this.state.ticketDescription} onChange={() => this.setState({ ticketDescription: event.target.value, errorMessage: '' })} />
                    </div>
                  </div> : '' }
              </div>
            </div>
            <label className='text-danger' >{this.state.errorMessage}</label>
            <div className='row'>
              <div className='update' style={{ marginLeft:'18px' }}>
                {this.state.ticketGroup !== 'Marketing'
              ? <button disabled={this.state.buttonDisable} className='btn btn-primary btn-round' onClick={this.handleCreateTicket}>{t`lanCommonButtonCreate`}</button>
              : <button disabled={this.state.buttonDisable} className='btn btn-primary btn-round' onClick={this.handleCreateOnboardingTicket}>{t`lanCommonButtonCreate`}</button>
              }
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
export default TicketCreateComponent
