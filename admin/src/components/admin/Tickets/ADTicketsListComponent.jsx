/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import Pagination from 'react-js-pagination'
import 'react-drawer/lib/react-drawer.css'
import { Tabs, Tab } from 'react-bootstrap-tabs'
import Modal from 'react-modal'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

import APICallManager from '../../../services/callmanager'
import TicketCreateComponent from '../../../components/admin/Tickets/ADTicketsCreateComponent'
import config from '../../../../public/config.json'
import '../../../components/admin/css/all.min.css'
import '../../../components/admin/css/argon.min.css'
import '../../../components/admin/css/nucleo.css'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}
class ADTicketsListComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activePage: 1,
      searchString: '',
      ticketsList:[],
      subjectChecked: 'checked',
      // mobileNumberChecked: 'checked',
      // emailChecked: 'checked',
      mobileNumberChecked: '',
      emailChecked: '',
      ticketNumberChecked: 'checked',
      requesterChecked: 'checked',
      assigneeChecked: 'checked',
      assignChecked: '',
      groupChecked: 'checked',
      tagChecked: 'checked',
      priorityChecked: 'checked',
      statusChecked: 'checked',
      actionsChecked: 'checked',
      errorMessage:'',
      userData: {},
      ModalIsOpen: false,
      userCreated: false,
      key: -1,
      totalCount: 0,
      percentage: '',
      perError: ''
    }
    this.handleHome = this.handleHome.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleEditTicket = this.handleEditTicket.bind(this)
    this.handleViewTicket = this.handleViewTicket.bind(this)
    this.handleTicketCreated = this.handleTicketCreated.bind(this)
  }

  componentWillMount () {
    let ticketsList = {
      url: config.baseUrl + config.getADTicketsListAPI + this.state.activePage + '/'
    }
    let _this = this
    APICallManager.getCall(ticketsList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          ticketsList: resObj.data.statusResult.ticketData,
          totalCount: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({ ticketsList: [] })
      }
    })
  }

  handleInputChange (event) {
    this.setState({ activePage: 1 })
    let _this = this
    // _this.setState({ searchString: event.target.value })
    let searchValue = _this.state.searchString
    let ticketsList = {
      url: config.baseUrl + config.getADTicketsListAPI + '1' + '/' + searchValue
    }
    APICallManager.getCall(ticketsList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          ticketsList: resObj.data.statusResult.ticketData,
          totalCount: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({
          ticketsList: [],
          totalCount: 0
        })
      }
    })
  }
  handlePageChange (pageNumber) {
    if (this.state.activePage !== pageNumber) {
      this.setState({ activePage: pageNumber })
      let ticketsList = { url: config.baseUrl + config.getADTicketsListAPI + pageNumber + '/' + this.state.searchString }
      let _this = this
      APICallManager.getCall(ticketsList, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({
            ticketsList: resObj.data.statusResult.ticketData,
            totalCount: resObj.data.statusResult.totalDocs
          })
        } else {
          _this.setState({
            ticketsList: [],
            totalCount: 0
          })
        }
      })
    }
  }

  handleEditTicket (data, actionType) {
    localStorage.setItem('TicketData', JSON.stringify(data))
    localStorage.setItem('actionType', actionType)
    hashHistory.push('admin/tickets/ticketEdit')
    event.preventDefault()
  }
  handleViewTicket (event, data) {
    localStorage.setItem('TicketData', JSON.stringify(data))
    hashHistory.push('admin/tickets/ticketView')
    event.preventDefault()
  }
  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleUserCreate = (item) => {
    var regex = /^[0-9. ]+$/
    let percentageNum = parseFloat(this.state.percentage)
    if (!percentageNum) {
      this.setState({ perError: 'App service charge is Requried' })
    } else if (!regex.test(this.state.percentage)) {
      this.setState({ perError: 'Percentage should not contain special characters' })
    } else if (percentageNum > 100) {
      this.setState({ perError: 'Percentage should be less than 100' })
    } else {
      let userObj = {
        spServiceProviderId: item.spServiceProviderId._id,
        spServiceProvider: item.spServiceProviderId.serviceProvider,
        firstName: item.spServiceProviderId.contactPerson,
        name: item.spServiceProviderId.contactPerson,
        city: item.spServiceProviderId.city,
        address: item.spServiceProviderId.contactAddress,
        mobileNumber: item.spServiceProviderId.contactNumber,
        email: item.spServiceProviderId.contactEmail,
        spPercentage: this.state.percentage
      }
      let obj = { url: config.baseUrl + config.postADSPUserCreateAPI, body: userObj }
      let _this = this
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          ToastsStore.success('User Created Successfully')
          setTimeout(() => {
          }, 2000)
          _this.state.ticketsList[_this.state.key].spServiceProviderId.status = 'Active'
          _this.setState({ ModalIsOpen: false, userData: {}, userCreated: true })
        } else {
          _this.setState({ ModalIsOpen: false, userData: {} })
          ToastsStore.error('User Create Failed')
          setTimeout(() => {
          }, 2000)
        }
      })
    }
  }

  modal = (item, i) => {
    this.setState({ ModalIsOpen: true, userData: item, key: i })
  }
  handleTicketCreated (data, type) {
    if (type === 'onboardingTicket') {
      let ticketsList = {
        url: config.baseUrl + config.getADTicketsListAPI + this.state.activePage + '/'
      }
      let _this = this
      APICallManager.getCall(ticketsList, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({
            ticketsList: resObj.data.statusResult.ticketData,
            totalCount: resObj.data.statusResult.totalDocs
          })
        } else {
          _this.setState({ ticketsList: [] })
        }
      })
    } else {
      let ticketListingData = this.state.ticketsList
      ticketListingData.unshift(data)
      this.setState({ ticketsList: ticketListingData, totalCount: this.state.totalCount + 1 })
    }
  }
  handleEnter (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }
  toastFunction (value) {
    switch (value) {
      case 'Successfully':
        ToastsStore.success('Ticket Created Succesfully')
        break
      case 'exist Email':
        ToastsStore.error('Email already exist please login')
        break
      case 'exist Mobilenumber':
        ToastsStore.error('Mobilenumber already exist please login')
        break
      case 'team will get back':
        ToastsStore.error('your request is under progress our team will get back to you soon')
        break
      case 'failed':
        ToastsStore.error('Ticket Create failed')
        break
      default:
        // code block
    }
  }
  render () {
    return (
      <div>
        <div>
          <div className='header bg-primary pb-6'>
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    <h6 className='h2 text-white d-inline-block mb-0'>{t`lanADTitleAdminTickets`}</h6>
                    <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item active' aria-current='page'>{t`lanEUButtonTicketList`}</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container-fluid mt--6'>
            <div className='row'>
              <div className='col-md-12'>
                <div className='card Users'>
                  <div className='card-body'>
                    {/* tabs list */}
                    <Tabs headerclassName='tab-header-bold' activeHeaderclassName='tab-header-blue'>
                      <Tab label={t`lanEUButtonTicketList`}>
                        <div>
                          <div className='row py-lg-3'>
                            <div className='col-md-6 col-6'>
                              <div><h3>{t`lanEUButtonTicketList`}</h3></div>
                            </div>
                            <div className='col-md-6 col-6 text-right'>
                              <div className='row'>
                                <div className='col-md-4'>
                                  <div className='button-group'>
                                    <button title={t`lanCommonLabelTableFilter`} className='btn btn-success dropdown-toggle' data-toggle='dropdown'><i className='fas fa-list' /></button>
                                    <ul className='dropdown-menu'>
                                      <li><a><input type='checkbox' onChange={() => this.setState({
                                        subjectChecked: this.state.subjectChecked === 'checked' ? ''
                                            : 'checked'
                                      })} checked={this.state.subjectChecked} />{t`lanCommonLabelTitle`}</a></li>
                                      <li><a><input type='checkbox' onChange={() => this.setState({
                                        ticketNumberChecked: this.state.ticketNumberChecked === 'checked' ? ''
                                            : 'checked'
                                      })} checked={this.state.ticketNumberChecked} />{t`lanCommonLabelTicketNumber`}</a></li>
                                      <li><a><input type='checkbox' onChange={() => this.setState({
                                        requesterChecked: this.state.requesterChecked === 'checked' ? ''
                                            : 'checked'
                                      })} checked={this.state.requesterChecked} />{t`lanCommonLabelRequester`}</a></li>
                                      <li><a><input type='checkbox' onChange={() => this.setState({
                                        mobileNumberChecked: this.state.mobileNumberChecked === 'checked' ? ''
                                            : 'checked'
                                      })} checked={this.state.mobileNumberChecked} />{t`lanCommonLabelMobileNumber`}</a></li>
                                      <li><a><input type='checkbox' onChange={() => this.setState({
                                        emailChecked: this.state.emailChecked === 'checked' ? ''
                                            : 'checked'
                                      })} checked={this.state.emailChecked} />{t`lanCommonLabelEmail`}</a></li>
                                      <li><a><input type='checkbox' onChange={() => this.setState({
                                        groupChecked: this.state.groupChecked === 'checked' ? ''
                                            : 'checked'
                                      })} checked={this.state.groupChecked} />{t`lanCommonLabelGroup`}</a></li>
                                      <li><a><input type='checkbox' onChange={() => this.setState({
                                        tagChecked: this.state.tagChecked === 'checked' ? ''
                                            : 'checked'
                                      })} checked={this.state.tagChecked} />{t`lanCommonLabelTag`}</a></li>
                                      <li><a><input type='checkbox' onChange={() => this.setState({
                                        priorityChecked: this.state.priorityChecked === 'checked' ? ''
                                            : 'checked'
                                      })} checked={this.state.priorityChecked} />{t`lanCommonLabelPriority`}</a></li>
                                      <li><a><input type='checkbox' onChange={() => this.setState({
                                        assigneeChecked: this.state.assigneeChecked === 'checked' ? ''
                                            : 'checked'
                                      })} checked={this.state.assigneeChecked} />{t`lanCommonLabelAssignee`}</a></li>
                                      <li><a><input type='checkbox' onChange={() => this.setState({
                                        assignChecked: this.state.assignChecked === 'checked' ? ''
                                            : 'checked'
                                      })} checked={this.state.assignChecked} />{t`lanCommonLabelAssignStatus`}</a></li>
                                      <li><a><input type='checkbox' onChange={() => this.setState({
                                        statusChecked: this.state.statusChecked === 'checked' ? ''
                                            : 'checked'
                                      })} checked={this.state.statusChecked} />{t`lanCommonLabelStatus`}</a></li>
                                    </ul>
                                  </div>
                                </div>
                                <div className='col-md-7 text-right'>
                                  {/* -- Search form -- */}
                                  <form>
                                    <div className='form-group mb-0'>
                                      <div className='input-group input-group-lg input-group-flush'>
                                        <div className='input-group-prepend'>
                                          <div className='input-group-text'>
                                            <span className='fas fa-search' />
                                          </div>
                                        </div>
                                        <input type='search' className='form-control' value={this.state.searchString}
                                          onChange={(e) => { this.setState({ searchString: e.target.value }) }} onKeyPress={this.handleEnter} placeholder={t`lanCommonLabelSearch`} />
                                      </div>
                                    </div>
                                  </form>
                                </div>
                                <div className='col-md-1 pl-0'>
                                  <button className='btn btn-icon btn-primary px-3 py-2' type='button' onClick={this.handleInputChange}>
                                    <span className='btn-inner--icon'><i className='fa fa-search' /></span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          {this.state.ticketsList.length > 0
                              ? <div className='table-responsive'>
                                <table className='table align-items-center table-flush table-striped'>
                                  <thead className='thead-light'>
                                    <tr>
                                      {this.state.subjectChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelTitle`}</th> : null}
                                      {this.state.ticketNumberChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelTicketNumber`}</th> : null}
                                      {this.state.requesterChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelRequester`}</th> : null}
                                      {this.state.mobileNumberChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelMobileNumber`}</th> : null}
                                      {this.state.emailChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelEmail`}</th> : null}
                                      {this.state.groupChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelGroup`}</th> : null}
                                      {this.state.tagChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelTag`}</th> : null}
                                      {this.state.priorityChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelPriority`}</th> : null}
                                      {this.state.assigneeChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelAssignee`}</th> : null}
                                      {this.state.assignChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelAssignStatus`}</th> : null}
                                      {this.state.statusChecked === 'checked' ? <th className='sort' data-sort='name'>{t`lanCommonLabelStatus`}</th> : null}
                                      <th>{t`lanCommonLabelActions`}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.ticketsList.map((item, i) =>
                                      <tr key={i}>
                                        {this.state.subjectChecked ? <td >{item.ticketTitle}</td> : null}
                                        {this.state.ticketNumberChecked ? <td >{item.ticketNumType + item.ticketNumber}</td> : null}
                                        {this.state.requesterChecked ? <td >{item.euName ? item.euName : item.spName ? item.spName : '' }</td> : null}
                                        {this.state.mobileNumberChecked ? <td >{item.reqMobileNumber }</td> : null}
                                        {this.state.emailChecked ? <td >{item.reqEmail ? item.reqEmail : item.reqEmail ? item.reqEmail : '' }</td> : null}
                                        {this.state.groupChecked ? <td >{item.ticketGroup}</td> : null}
                                        {this.state.tagChecked ? <td >{item.ticketTag}</td> : null}
                                        {this.state.priorityChecked ? <td >{item.ticketPriority}</td> : null}
                                        {this.state.assigneeChecked ? <td >{item.adminUserName ? item.adminUserName : '-'}</td> : null}
                                        {this.state.assignChecked ? <td >{item.assignStatus}</td> : null}
                                        {this.state.statusChecked ? <td >{item.ticketStatus}</td> : null}
                                        <td>
                                          <div className='row'>
                                            <div className='col-lg-1' style={{ position: 'relative', top:20, left:-5 }}>
                                              <a className='table-action' data-toggle='tooltip' title={t`lanSPButtonTooltipViewTicket`} onClick={(event) => this.handleViewTicket(event, item)} >
                                                <i className='fas fa-eye text-info' />
                                              </a>
                                            </div>
                                            <div className='col-lg-11 ml-4'>
                                              {item.ticketStatus === 'New'
                                          ? <div>
                                            <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketAssign`} onClick={() => this.handleEditTicket(item, 'Assign')} >
                                              <i className='fas fa-hand-point-up text-info' />
                                            </a>
                                            <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketEscalate`} onClick={() => this.handleEditTicket(item, 'Escalate')}>
                                              <i className='fas fa-sort-amount-up' style={{ color: 'black' }} />
                                            </a>
                                            <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketOnhold`} onClick={() => this.handleEditTicket(item, 'Onhold')}>
                                              <i className='fas fa-pause-circle text-gray' />
                                            </a>
                                            <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketDuplicate`} onClick={() => this.handleEditTicket(item, 'Duplicate')}>
                                              <i className='fas fa-copy' style={{ color: '#06608c' }} />
                                            </a>
                                            {/* {item.ticketTitle === 'Onboarding' && item.spServiceProviderId.status !== 'Active'
                                          ? <a onClick={() => this.modal(item, i)} className='table-action' data-toggle='tooltip' title='Create'>
                                            <i className='fas fa-plus text-info' />
                                          </a>
                                          : '' } */}
                                          </div>
                                            : item.ticketStatus === 'Open'
                                            ? <div>
                                              <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketInprogress`} onClick={() => this.handleEditTicket(item, 'Inprogress')}>
                                                <i className='fa fa-spinner text-warning' />
                                              </a>
                                              <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketResolved`} onClick={() => this.handleEditTicket(item, 'Resolved')}>
                                                <i className='fas fa-check' style={{ color: '#7ac142' }} />
                                              </a>
                                              <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketReassign`} onClick={() => this.handleEditTicket(item, 'Reassign')}>
                                                <i className='far fa-hand-point-right text-danger' />
                                              </a>
                                              <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketEscalate`} onClick={() => this.handleEditTicket(item, 'Escalate')}>
                                                <i className='fas fa-sort-amount-up' style={{ color: 'black' }} />
                                              </a>
                                              <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketOnhold`} onClick={() => this.handleEditTicket(item, 'Onhold')}>
                                                <i className='fas fa-pause-circle text-gray' />
                                              </a>
                                              <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketDuplicate`} onClick={() => this.handleEditTicket(item, 'Duplicate')}>
                                                <i className='fas fa-copy' style={{ color: '#06608c' }} />
                                              </a>
                                            </div>
                                          : item.ticketStatus === 'Inprogress'
                                          ? <div>
                                            <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketResolved`} onClick={() => this.handleEditTicket(item, 'Resolved')}>
                                              <i className='fas fa-check' style={{ color: '#7ac142' }} />
                                            </a>
                                            <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketReassign`} onClick={() => this.handleEditTicket(item, 'Reassign')}>
                                              <i className='far fa-hand-point-right text-danger' />
                                            </a>
                                            <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketEscalate`} onClick={() => this.handleEditTicket(item, 'Escalate')}>
                                              <i className='fas fa-sort-amount-up' style={{ color: 'black' }} />
                                            </a>
                                            <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketOnhold`} onClick={() => this.handleEditTicket(item, 'Onhold')} >
                                              <i className='fas fa-pause-circle text-gray' />
                                            </a>
                                            <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketDuplicate`} onClick={() => this.handleEditTicket(item, 'Duplicate')} >
                                              <i className='fas fa-copy' style={{ color: '#06608c' }} />
                                            </a>
                                            {item.ticketTitle === 'Onboarding' && item.spServiceProviderId.status !== 'Active'
                                          ? <a onClick={() => this.modal(item, i)} className='table-action' data-toggle='tooltip' title='Create'>
                                            <i className='fas fa-plus text-info' />
                                          </a>
                                          : '' }
                                          </div>
                                        : item.ticketStatus === 'Resolved'
                                        ? <div>
                                          <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketDuplicate`} onClick={() => this.handleEditTicket(item, 'Duplicate')}>
                                            <i className='fas fa-copy' style={{ color: '#06608c' }} />
                                          </a>
                                          <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketCompleted`} onClick={() => this.handleEditTicket(item, 'Completed')}>
                                            <i className='fas fa-check-circle text-success' />
                                          </a>
                                        </div>
                                          : item.ticketStatus === 'Escalate'
                                          ? <div>
                                            <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketInprogress`} onClick={() => this.handleEditTicket(item, 'Inprogress')}>
                                              <i className='fa fa-spinner text-warning' />
                                            </a>
                                            <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketResolved`} onClick={() => this.handleEditTicket(item, 'Resolved')}>
                                              <i className='fas fa-check' style={{ color: '#7ac142' }} />
                                            </a>
                                            <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketOnhold`} onClick={() => this.handleEditTicket(item, 'Onhold')}>
                                              <i className='fas fa-pause-circle text-gray' />
                                            </a>
                                          </div>
                                          : item.ticketStatus === 'Onhold'
                                          ? <div>
                                            <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketInprogress`} onClick={() => this.handleEditTicket(item, 'Inprogress')}>
                                              <i className='fa fa-spinner text-warning' />
                                            </a>
                                            <a className='table-action' data-toggle='tooltip' title={t`lanADTooltipLabelTicketsTicketResolved`}>
                                              <i className='fas fa-check' style={{ color: '#7ac142' }} onClick={() => this.handleEditTicket(item, 'Resolved')} />
                                            </a>
                                          </div>
                                          : item.ticketStatus === 'Completed'
                                          ? <div>
                                            {/* <a onClick={this.handleEditTicket} className='table-action' data-toggle='tooltip' data-original-title='Edit product'>
                                              <i className='fas fa-user-edit' />
                                            </a> */}
                                          </div>
                                          : null }
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                  <tfoot>
                                    {this.state.ticketsList && this.state.ticketsList.length > 0
                                      ? <tr className='card-footer'>
                                        <td className='text-center'>
                                          <Pagination
                                            activePage={this.state.activePage}
                                            itemsCountPerPage={10}
                                            totalItemsCount={this.state.totalCount}
                                            pageRangeDisplayed={5}
                                            onChange={this.handlePageChange}
                                          />
                                        </td>
                                      </tr>
                                      : null}
                                  </tfoot>
                                </table>
                              </div>
                              : this.state.ticketsList.length <= 0 ? <div className='no-data'><p>{t`lanCommonLabelNoResultsFound`}</p></div> : null
                            }
                        </div>
                      </Tab>
                      <Tab label={t`lanSPButtonCreateTicket`}>
                        <TicketCreateComponent handleTicketCreated={this.handleTicketCreated} toastFunction={this.toastFunction} />
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.ModalIsOpen}
          style={customStyles}
          ariaHideApp={false}
        >
          <div>
            <div className='container'>
              <div className='row justify-content-center'>
                <div className='col-lg-12'>
                  <div className='card'>
                    <div className='card-body'>
                      <p>{t`lanADAlertLabelTicketsAreYouSureWantToCreateUser`}</p>
                    </div>
                    <input type='num' className='form-control' maxLength='5' value={this.state.percentage}
                      onChange={(text) => this.setState({ percentage: text.target.value, perError: '' })} placeholder={t`lanADPlaceHolderLabelTicketsAppServiceCharges`} />
                    <label className='text-danger' >{this.state.perError}</label>
                    <div className='card-footer'>
                      <button className='btn btn-primary' onClick={() => this.handleUserCreate(this.state.userData)}>{t`lanSPButtonOK`}</button>
                      <button className='btn btn-danger' onClick={() => this.setState({ ModalIsOpen: false })}>{t`lanCommonButtonCancel`}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}

export default ADTicketsListComponent
