/* eslint-disable max-len */
/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
// import moment from 'moment'
import { t } from 'ttag'
import { Tabs, Tab } from 'react-bootstrap-tabs'
import { hashHistory } from 'react-router'
import Pagination from 'react-js-pagination'
import 'react-drawer/lib/react-drawer.css'
import 'react-toastify/dist/ReactToastify.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
// import classnames from 'classnames'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import Modal from 'react-modal'
import ADHostsSupportCreateComponent from './ADHostsSupportCreateComponent'
import ADHostsSupportViewComponent from './ADHostsSupportViewComponent'
import ADHostsSupportEditComponent from './ADHostsSupportEditComponent'
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
}

class ADHostsSupportListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      hostData:JSON.parse(localStorage.getItem('hostData')),
      searchString: '',
      supportList: [],
      activePage: 1,
      totalCount: 0,
      matchesData: false,
      isShow: 'List',
      activeProfileTitle: true,
      modalIsOpen: false,
      ticketdata:'',
      subjectChecked:'checked',
      mobileNumberChecked:'checked',
      emailChecked:'checked',
      ticketNumberChecked:'checked',
      requesterChecked:'checked',
      tagChecked:'checked',
      priorityChecked:'checked',
      statusChecked :'checked'
    }
    this.handleCreateSupport = this.handleCreateSupport.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleViewSupport = this.handleViewSupport.bind(this)
    this.handleEditSupport = this.handleEditSupport.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleConfirmDeleteSupport = this.handleConfirmDeleteSupport.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleUsers = this.handleUsers.bind(this)
  }
  componentWillMount () {
    let supportList = {
      url: config.baseUrl + config.getADHostsSupportListAPI + this.state.hostData._id + '/' + this.state.activePage
    }
    let _this = this
    APICallManager.getCall(supportList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          supportList: resObj.data.statusResult.ticketsData,
          totalCount: resObj.data.statusResult.totalDocs,
          matchesData: false
        })
      } else {
        _this.setState({
          supportList: [],
          matchesData: false
        })
      }
    })
  }
  componentDidMount () {
    window.onhashchange = () => {
      event.preventDefault()
    }
  }
  handleInputChange (event) {
    let _this = this
    _this.setState({ activePage: 1 })
    let searchvalue = this.state.searchString
    let supportObj = {
      url: config.baseUrl + config.getADHostsSupportListAPI + this.state.hostData._id + '/' + '1' + '/' + searchvalue
    }
    APICallManager.getCall(supportObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          supportList: resObj.data.statusResult.ticketsData,
          totalCount: resObj.data.statusResult.totalDocs,
          matchesData: false
        })
      } else {
        _this.setState({
          supportList: [],
          totalCount: 0,
          matchesData: true,
          searchString:''
        })
      }
    })
  }
  handlePageChange (pageNumber) {
    if (pageNumber !== this.state.activePage) {
      this.setState({ activePage: pageNumber })
      let _this = this
      let obj = { url: config.baseUrl + config.getADHostsSupportListAPI + this.state.hostData._id + '/' + pageNumber + '/' + this.state.searchString }
      APICallManager.getCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ supportList: resObj.data.statusResult.ticketsData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false })
        } else {
          _this.setState({ supportList: [], totalCount: 0, matchesData: false })
        }
      })
    }
  }
  handleCreateSupport (data) {
    let supportListingData = this.state.supportList
    if (data && data._id) {
      supportListingData.unshift(data)
      this.setState({ supportList: supportListingData })
    }
  }
  handleViewSupport (data) {
    localStorage.setItem('supportData', JSON.stringify(data))
    this.setState({
      isShow:'View',
      selectedSupportData: data
    })
  }
  handleEditSupport (data) {
    this.setState({
      isShow:'Edit',
      selectedSupportData: data
    })
  }
  handleDelete (data) {
    this.setState({ modalIsOpen: true, ticketdata: data })
  }
  handleConfirmDeleteSupport () {
    let supportList = this.state.supportList
    let obj = {
      url: config.baseUrl + config.deleteADHostsSupportAPI + this.state.ticketdata._id
    }
    let _this = this
    let index = supportList.findIndex(dataObj => dataObj._id === this.state.ticketdata._id)

    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        supportList.splice(index, 1)
        _this.setState({ modalIsOpen: false })
      } else {
        _this.setState({ errorMessage: 'Ticket Delete Failed' })
      }
    })
  }
  closeModal () {
    this.setState({ modalIsOpen: false })
  }
  handleBack (data) {
    this.setState({
      isShow:'List',
      selectedSupportData: data
    })
  }
  handleUsers () {
    hashHistory.push('/admin/hosts')
  }
  handleHome () {
    hashHistory.push('/admin/home')
  }
  handleEnter (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }

  render () {
    return (
      <div>
        {this.state.isShow === 'List'
        ? <div>
          <div className='header bg-primary pb-6'>
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    <h6 className='h2 text-white d-inline-block mb-0'>Admin Hosts Support</h6>
                    <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item'><a onClick={this.handleUsers}>Host Users</a></li>
                        <li className='breadcrumb-item active' aria-current='page'>Support</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container-fluid mt--6'>
            <div>
              <div className='col-md-12'>
                <div className='card Users'>
                  <div className='card-body'>
                    <Tabs headerclassName='tab-header-bold' activeHeaderclassName='tab-header-blue'>
                      <Tab label='supportList'>
                        <div className='row py-lg-3'>
                          <div className='col-md-6 col-6'>
                            <div><h3>supportList</h3></div>
                          </div>
                          <div className='col-md-6 col-6 text-right'>
                            <div className='row'>
                              <div className='col-md-4'>
                                <div className='button-group'>
                                  <button title='Table Filter' className='btn btn-success dropdown-toggle' data-toggle='dropdown'><i className='fas fa-list' /></button>
                                  <ul className='dropdown-menu'>
                                    <li><a><input type='checkbox' onChange={() => this.setState({
                                      subjectChecked: this.state.subjectChecked === 'checked' ? ''
                                            : 'checked'
                                    })} checked={this.state.subjectChecked} />Subject</a></li>
                                    <li><a><input type='checkbox' onChange={() => this.setState({
                                      mobileNumberChecked: this.state.mobileNumberChecked === 'checked' ? ''
                                            : 'checked'
                                    })} checked={this.state.mobileNumberChecked} />Mobile #</a></li>
                                    <li><a><input type='checkbox' onChange={() => this.setState({
                                      emailChecked: this.state.emailChecked === 'checked' ? ''
                                            : 'checked'
                                    })} checked={this.state.emailChecked} />Email</a></li>
                                    <li><a><input type='checkbox' onChange={() => this.setState({
                                      ticketNumberChecked: this.state.ticketNumberChecked === 'checked' ? ''
                                            : 'checked'
                                    })} checked={this.state.ticketNumberChecked} />Ticket #</a></li>
                                    <li><a><input type='checkbox' onChange={() => this.setState({
                                      requesterChecked: this.state.requesterChecked === 'checked' ? ''
                                            : 'checked'
                                    })} checked={this.state.requesterChecked} />Requester</a></li>
                                    <li><a><input type='checkbox' onChange={() => this.setState({
                                      tagChecked: this.state.tagChecked === 'checked' ? ''
                                            : 'checked'
                                    })} checked={this.state.tagChecked} />Tag</a></li>
                                    <li><a><input type='checkbox' onChange={() => this.setState({
                                      priorityChecked: this.state.priorityChecked === 'checked' ? ''
                                            : 'checked'
                                    })} checked={this.state.priorityChecked} />Priority</a></li>
                                    <li><a><input type='checkbox' onChange={() => this.setState({
                                      statusChecked: this.state.statusChecked === 'checked' ? ''
                                            : 'checked'
                                    })} checked={this.state.statusChecked} />Status</a></li>
                                  </ul>
                                </div>
                              </div>
                              <div className='col-md-7 pr-0 text-right'>
                                <form>
                                  <div className='form-group mb-0'>
                                    <div className='input-group input-group-lg input-group-flush'>
                                      <div className='input-group-prepend'>
                                        <div className='input-group-text'>
                                          <span className='fas fa-search' />
                                        </div>
                                      </div>
                                      <input type='search' className='form-control' value={this.state.searchString} onKeyPress={this.handleEnter}
                                        onChange={(e) => { this.setState({ searchString: e.target.value }) }}
                                        placeholder={t`lanCommonLabelSearch`} />
                                    </div>
                                  </div>
                                </form>
                              </div>
                              <div className='col-md-1 pl-0'>
                                <button className='btn btn-icon btn-primary search-btn-admin px-3 py-2' type='button' onClick={this.handleInputChange}>
                                  <span className='btn-inner--icon'><i className='fa fa-search' /></span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {this.state.supportList.length > 0
                        ? <div className='table-responsive'>
                          <table className='table align-items-center table-flush table-striped'>
                            <thead className='thead-light'>
                              <tr>
                                {this.state.subjectChecked === 'checked' ? <th className='sort' data-sort='name'>TITTLE</th> : null}
                                {this.state.mobileNumberChecked === 'checked' ? <th className='sort' data-sort='name'>MOBILE </th> : null}
                                {this.state.emailChecked === 'checked' ? <th className='sort' data-sort='name'>EMAIL</th> : null}
                                {this.state.ticketNumberChecked === 'checked' ? <th className='sort' data-sort='name'>TICKET #</th> : null}
                                {this.state.requesterChecked === 'checked' ? <th className='sort' data-sort='name'>REQUESTER</th> : null}
                                {this.state.tagChecked === 'checked' ? <th className='sort' data-sort='name'>TAG</th> : null}
                                {this.state.priorityChecked === 'checked' ? <th className='sort' data-sort='name'>PRIORITY</th> : null}
                                {this.state.statusChecked === 'checked' ? <th className='sort' data-sort='name'>STATUS </th> : null}
                                <th>{t`lanCommonLabelActions`}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.supportList.map((item, i) =>
                                <tr key={i}>
                                  {this.state.subjectChecked === 'checked' ? <td className='sort' data-sort='name'>{item.ticketTitle}</td> : null}
                                  {this.state.mobileNumberChecked === 'checked' ? <td className='sort' data-sort='name'>{item.reqMobileNumber}</td> : null}
                                  {this.state.emailChecked === 'checked' ? <td className='sort' data-sort='name'>{item.reqEmail}</td> : null}
                                  {this.state.ticketNumberChecked === 'checked' ? <td className='sort' data-sort='name'>{item.ticketNumType + item.ticketNumber}</td> : null}
                                  {this.state.requesterChecked === 'checked' ? <td className='sort' data-sort='name'>{item.spServiceProvider}</td> : null}
                                  {this.state.tagChecked === 'checked' ? <td className='sort' data-sort='name'>{item.ticketTag}</td> : null}
                                  {this.state.priorityChecked === 'checked' ? <td className='sort' data-sort='name'>{item.ticketPriority}</td> : null}
                                  {this.state.statusChecked === 'checked' ? <td className='sort' data-sort='name'>{item.ticketStatus}</td> : null}
                                  <td>
                                    <div className='col-sm-2 col-6'>
                                      <div className='row align-items-center mt-0'>
                                        <div className='col-sm-12 text-center ticket-actions'>
                                          <a onClick={() => this.handleViewSupport(item)} className='update-edit' title='View Ticket'>
                                            <span className='avatar avatar-md mr-2 bg-primary rounded-circle'>
                                              <span className='media-object d-flex justify-content-center align-items-center'><i className='far fa-eye' /></span>
                                            </span>
                                          </a>
                                          <a onClick={() => this.handleEditSupport(item)} className='update-edit' title='Edit Ticket'>
                                            <span className='avatar avatar-md mr-2 bg-success rounded-circle'>
                                              <span className='media-object d-flex justify-content-center align-items-center'><i className='far fa-edit
                                              ' /></span>
                                            </span>
                                          </a>
                                          <a onClick={() => this.handleDelete(item, i)} className='table-action table-action-delete' title='Delete' >
                                            <span className='avatar avatar-md mr-2 bg-danger rounded-circle'>
                                              <span className='media-object d-flex justify-content-center align-items-center'>
                                                <i className='fas fa-trash text-error' />
                                              </span>
                                            </span>
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                            <tfoot>
                              {this.state.supportList && this.state.supportList.length > 0
                                ? <tr className='card-footer'>
                                  <td className='text-center'>
                                    <Pagination
                                      activePage={this.state.activePage}
                                      itemsCountPerPage={20}
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
                        : this.state.supportList.length <= 0 ? <div className='no-data'><p>{t`lanCommonLabelNoResultsFound`}</p></div> : null
                      }
                      </Tab>
                      <Tab label='CreateTicket'>
                        <ADHostsSupportCreateComponent supportList={this.state.supportList} handleCreateSupport={this.handleCreateSupport} />
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          : this.state.isShow === 'View' ? <ADHostsSupportViewComponent selectedSupportData={this.state.selectedSupportData} handleBack={this.handleBack} />
          : this.state.isShow === 'Edit' ? <ADHostsSupportEditComponent selectedSupportData={this.state.selectedSupportData} handleBack={this.handleBack} supportList={this.state.supportList} />
          : null}
        <div>
          <Modal isOpen={this.state.modalIsOpen} style={customStyles} ariaHideApp={false}>
            <h2 className='modal-text' >{t`lanCommonLabelDeleteNote`}</h2>
            <div className='row my-4 px-3'>
              <button className='btn btn-primary mr-2' onClick={this.handleConfirmDeleteSupport}>{t`lanCommonButtonConfirm`}</button>
              <button className='btn btn-danger' onClick={this.closeModal}>{t`lanCommonButtonCancel`}</button>
            </div>
          </Modal>
        </div>
      </div>
    )
  }
}

export default ADHostsSupportListComponent
