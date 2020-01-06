/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import APICallManager from '../../../services/callmanager'
import Pagination from 'react-js-pagination'
import config from '../../../../public/config.json'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import { Tabs, Tab } from 'react-bootstrap'
import Modal from 'react-modal'
import moment from 'moment'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import './css/Bookings.css'
// import  SPInboxSendMessageComponent from '../Inbox/SPInboxSendMessageComponent'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '50%',
    textAlign             : 'center'
  }
}
class SPBookingsListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      bookingDate: [],
      activePage: 1,
      searchString: '',
      status: 'all',
      totalCountBookings: 0,
      key: '0',
      modalIsOpen: false,
      refundAmount: '',
      confirmCancelModalVisible: false,
      confirmCancelBookingData: {},
      selectedBooking : {},
      bookedByChecked: 'checked',
      mobileNumberChecked: 'checked',
      emailChecked: 'checked',
      checkInChecked: 'checked',
      checkOutChecked: 'checked',
      noOfRoomsChecked: 'checked',
      propertyTitleChecked: 'checked',
      areaChecked: 'checked',
      bookingCodeChecked: 'checked',
      amountChecked: 'checked',
      statusChecked: 'checked',
      matchesFound: false,
      noRefund: false
    }
    this.handleCreatebooking = this.handleCreatebooking.bind(this)
    this.handleBookingView = this.handleBookingView.bind(this)
    this.handleBookingEdit = this.handleBookingEdit.bind(this)
    this.handleBookingCancel = this.handleBookingCancel.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirmCancel = this.handleConfirmCancel.bind(this)
    this.closeConfirmModal = this.closeConfirmModal.bind(this)
  }

  componentWillMount () {
    this.setState({ bookingCodeChecked:this.state.bookingCodeChecked === 'unchecked' })
    this.setState({ emailChecked:this.state.emailChecked === 'unchecked' })
    this.setState({ mobileNumberChecked:this.state.mobileNumberChecked === 'unchecked' })
    this.setState({ areaChecked:this.state.areaChecked === 'unchecked' })
    let getSpBookingsObj = {
      url: config.baseUrl + config.getSPBookingsHistoryListAPI + this.state.activePage + '/' + this.state.status + '/' + this.state.searchString
    }
    let _this = this
    APICallManager.getCall(getSpBookingsObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          bookingDate : resObj.data.statusResult.bookingData, totalCountBookings: resObj.data.statusResult.totalDocs, matchesFound: false
        })
      }
    })
  }
  handleCreatebooking (event) {
    hashHistory.push('/host/create-booking/properties-list')
    event.preventDefault()
  }
  handleBookingView (e) {
    localStorage.setItem('bookingData', JSON.stringify(e))
    hashHistory.push('/host/bookings-history/view')
    event.preventDefault()
  }
  handleBookingEdit (e) {
    localStorage.setItem('bookingData', JSON.stringify(e))
    hashHistory.push('/host/bookings-history/edit-booking')
    event.preventDefault()
  }
  handleSearch = (event) => {
    // if (event.target.value.length === 0) {
    //   this.setState({ matchesFound: false, searchString: event.target.value })
    // } else {
    //   let _this = this
    //   _this.setState({ searchString: event.target.value })
    //   let getSpBookingsObj = {
    //     url: config.baseUrl + config.getSPBookingsHistoryListAPI + this.state.activePage + '/' + this.state.status + '/' + event.target.value
    //   }
    //   APICallManager.getCall(getSpBookingsObj, function (resObj) {
    //     if (resObj.data.statusCode === '0000') {
    //       _this.setState({
    //         bookingDate : resObj.data.statusResult.bookingData, totalCountBookings: resObj.data.statusResult.totalDocs, matchesFound: false
    //       })
    //     } else {
    //       _this.setState({
    //         bookingDate : [], totalCountBookings: 0, matchesFound: true
    //       })
    //     }
    //   })
    // }
    let _this = this
    _this.setState({ searchString: event.target.value })
    let getSpBookingsObj = {
      url: config.baseUrl + config.getSPBookingsHistoryListAPI + this.state.activePage + '/' + this.state.status + '/' + event.target.value
    }
    APICallManager.getCall(getSpBookingsObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          bookingDate : resObj.data.statusResult.bookingData, totalCountBookings: resObj.data.statusResult.totalDocs, matchesFound: false
        })
      } else {
        _this.setState({
          bookingDate : [], totalCountBookings: 0, matchesFound: true
        })
      }
    })
  }
  handlePageChangePropertiesList = (pageNumber) => {
    this.setState({ activePage : pageNumber })
    let _this = this
    let getSpBookingsObj = {
      url: config.baseUrl + config.getSPBookingsHistoryListAPI + pageNumber + '/' + this.state.status + '/' + this.state.searchString
    }
    APICallManager.getCall(getSpBookingsObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          bookingDate : resObj.data.statusResult.bookingData, totalCountBookings: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({
          bookingDate : [], totalCountBookings: 0
        })
      }
    })
  }
  handleTabs = (key) => {
    this.setState({ key: key })
    let _this = this
    switch (key) {
      case '0' :
        let getSpBookingsObj = {
          url: config.baseUrl + config.getSPBookingsHistoryListAPI + this.state.activePage + '/' + 'all' + '/' + this.state.searchString
        }
        APICallManager.getCall(getSpBookingsObj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            _this.setState({
              bookingDate : resObj.data.statusResult.bookingData, totalCountBookings: resObj.data.statusResult.totalDocs, status: 'all'
            })
          } else {
            _this.setState({
              bookingDate : [], totalCountBookings: 0, status: 'all'
            })
          }
        })
        break
      case '1' :
        let getSpBookedBookingsObj = {
          url: config.baseUrl + config.getSPBookingsHistoryListAPI + this.state.activePage + '/' + 'Booked' + '/' + this.state.searchString
        }
        APICallManager.getCall(getSpBookedBookingsObj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            _this.setState({
              bookingDate : resObj.data.statusResult.bookingData, totalCountBookings: resObj.data.statusResult.totalDocs, status: 'Booked'
            })
          } else {
            _this.setState({
              bookingDate : [], totalCountBookings: 0, status: 'Booked'
            })
          }
        })
        break
      case '2' :
        let getSpCompletedBookingsObj = {
          url: config.baseUrl + config.getSPBookingsHistoryListAPI + this.state.activePage + '/' + 'Completed' + '/' + this.state.searchString
        }
        APICallManager.getCall(getSpCompletedBookingsObj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            _this.setState({
              bookingDate : resObj.data.statusResult.bookingData, totalCountBookings: resObj.data.statusResult.totalDocs, status: 'Completed'
            })
          } else {
            _this.setState({
              bookingDate : [], totalCountBookings: 0, status: 'Completed'
            })
          }
        })
        break
    }
  }

  handleBookingCancel (data) {
    this.setState({ selectedBooking: data })
    let getSpBookingsObj = {
      url: config.baseUrl + config.getSPRefundAmountBookingAPI + data._id + '/' + data.checkInDate
    }
    let _this = this
    APICallManager.getCall(getSpBookingsObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          refundAmount: resObj.data.statusResult.result.totalRefundAmount, modalIsOpen: !_this.state.modalIsOpen, confirmCancelBookingData: resObj.data.statusResult.result, noRefund: true
        })
      } else {
        _this.setState({
          refundAmount: 'Note: No refund on cancellation', modalIsOpen: !_this.state.modalIsOpen, noRefund: false
        })
      }
    })
  }

  closeModal () {
    this.setState({ modalIsOpen: !this.state.modalIsOpen })
  }

  handleCancel () {
    this.setState({ modalIsOpen: !this.state.modalIsOpen, confirmCancelModalVisible: !this.state.confirmCancelModalVisible })
  }
  handleConfirmCancel () {
    let bookingListingData = this.state.bookingDate
    const index = bookingListingData.findIndex(dataObj => dataObj._id === this.state.selectedBooking._id)
    let _this = this
    if (this.state.noRefund) {
      let cancelObj = {
        bookingId: _this.state.selectedBooking._id,
        appRefundAmount: _this.state.confirmCancelBookingData.appRefundAmount,
        spRefundAmount: _this.state.confirmCancelBookingData.spRefundAmount,
        totalRefundAmount: _this.state.confirmCancelBookingData.totalRefundAmount
      }
      let obj = { url: config.baseUrl + config.putSPConfirmCancelBookingAPI, body: cancelObj }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          bookingListingData[index].appRefundAmount = _this.state.confirmCancelBookingData.appRefundAmount
          bookingListingData[index].spRefundAmount = _this.state.confirmCancelBookingData.spRefundAmount
          bookingListingData[index].totalRefundAmount = _this.state.confirmCancelBookingData.totalRefundAmount
          bookingListingData[index].bookingStatus = 'Cancelled'
          _this.setState({ confirmCancelModalVisible: !_this.state.confirmCancelModalVisible, bookingDate: bookingListingData })
        } else {
          alert('booking cancellation failed')
        }
      })
    } else {
      let cancelObj = {
        bookingId: _this.state.selectedBooking._id,
        appRefundAmount: '0',
        spRefundAmount: '0',
        totalRefundAmount: '0'
      }
      let obj = { url: config.baseUrl + config.putSPConfirmCancelBookingAPI, body: cancelObj }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          bookingListingData[index].appRefundAmount = 0
          bookingListingData[index].spRefundAmount = 0
          bookingListingData[index].totalRefundAmount = 0
          bookingListingData[index].bookingStatus = 'Cancelled'
          _this.setState({ confirmCancelModalVisible: !_this.state.confirmCancelModalVisible, bookingDate: bookingListingData })
        } else {
          alert('booking cancellation failed')
        }
      })
    }
  }

  closeConfirmModal () {
    this.setState({ confirmCancelModalVisible: !this.state.confirmCancelModalVisible })
  }
  handleHome () {
    hashHistory.push('/host/home')
  }
  render () {
    return (
      <div className='booking-history'>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{ t`lanCommonTitleBookings` }</h6>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      {/* <li className='breadcrumb-item'><a><i className='fas fa-home' /></a></li> */}
                      {/* <li className='breadcrumb-item'><a href='#'>Dashboards</a></li> */}
                      <li className='breadcrumb-item active' aria-current='page'>{ t`lanSPTitleBookingsHistory` }</li>
                    </ol>
                  </nav>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  <a onClick={this.handleCreatebooking} className='btn btn-success text-white'><i className='fas fa-plus' /> {t`lanCommonButtonCreateBooking`}</a>
                  {/* <a href='#' className='btn btn-sm btn-neutral'>Filters</a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6'>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-12 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header'>
                  <div className='row'>
                    <div className='col-md-6 col-6'>
                      <h6 className='h2 d-inline-block mb-0'>{ t`lanCommonTitleBookings` }</h6>
                    </div>
                    <div className='col-md-6 col-6 text-right'>
                      <div className='row'>
                        <div className='col-md-4'>
                          <div className='button-group'>
                            <button title='Table Filter' className='btn btn-success dropdown-toggle' data-toggle='dropdown'><i className='fas fa-list' /></button>
                            <ul className='dropdown-menu'>
                              <li><a><input type='checkbox' onChange={() => this.setState({ bookedByChecked: this.state.bookedByChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.bookedByChecked} />Booked By</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({ mobileNumberChecked: this.state.mobileNumberChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.mobileNumberChecked} />Mobile Number</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({ emailChecked: this.state.emailChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.emailChecked} />Email</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({ checkInChecked: this.state.checkInChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.checkInChecked} />Check In</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({ checkOutChecked: this.state.checkOutChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.checkOutChecked} />Check Out</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({ noOfRoomsChecked: this.state.noOfRoomsChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.noOfRoomsChecked} />Rooms</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({ propertyTitleChecked: this.state.propertyTitleChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.propertyTitleChecked} />Property Title</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({ areaChecked: this.state.areaChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.areaChecked} />Area</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({ bookingCodeChecked: this.state.bookingCodeChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.bookingCodeChecked} />Booking Code</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({ amountChecked: this.state.amountChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.amountChecked} />Amount</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({ statusChecked: this.state.statusChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.statusChecked} />Status</a></li>
                              {/* <li><a><input type='checkbox' checked={this.state.actionsChecked} />Actions</a></li> */}
                            </ul>
                          </div>
                        </div>
                        <div className='col-md-8'>
                          {/* -- Search form -- */}
                          <form>
                            <div className='form-group mb-0'>
                              <div className='input-group input-group-lg input-group-flush'>
                                <div className='input-group-prepend'>
                                  <div className='input-group-text'>
                                    <span className='fas fa-search' />
                                  </div>
                                </div>
                                <input type='search' className='form-control' placeholder={t`lanCommonLabelSearch`} value={this.state.searchString} onChange={(search) => this.handleSearch(search)} />
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card-body bookingsList'>
                  <section className='notifications'>
                    <div className='row clearfix'>
                      <div className='col-md-12 col-lg-12 col-xl-12'>
                        {/* tabs list */}
                        <Tabs activeKey={this.state.key} onSelect={key => this.handleTabs(key)} defaultActiveKey={this.state.key}
                          headerclass={'tab-header-bold'} activeheaderclass={'tab-header-blue'} >
                          <Tab title={t`lanSPBookingsButtonAll`} eventKey={0}>
                            { this.state.bookingDate.length > 0
                          ? <div>
                            <div className='table-responsive'>
                              <table className='table align-items-center table-flush table-striped'>
                                <thead className='thead-light'>
                                  <tr>
                                    {this.state.bookedByChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelBookedBy` }</th> : null }
                                    {this.state.mobileNumberChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelMobileNumber` }</th> : null }
                                    {this.state.emailChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelEmail` }</th> : null }
                                    {this.state.checkInChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelCheckIn` }</th> : null }
                                    {this.state.checkOutChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelCheckOut` }</th> : null }
                                    {this.state.noOfRoomsChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelNumberOfRooms` }</th> : null }
                                    {this.state.propertyTitleChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelPropertyTitle` }</th> : null }
                                    {this.state.areaChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelArea` }</th> : null }
                                    {this.state.bookingCodeChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelBookingCode` }</th> : null }
                                    {this.state.amountChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelBookingAmount` }</th> : null }
                                    {this.state.statusChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelStatus` }</th> : null }
                                    <th className='sort' data-sort='name'>{ t`lanCommonLabelActions` }</th>
                                  </tr>
                                </thead>
                                {
                                    this.state.bookingDate.map((item, i) =>
                                      <tbody key={i}>
                                        <tr>
                                          {this.state.bookedByChecked ? <td className='text-muted'>{item.euName}</td> : null }
                                          {this.state.mobileNumberChecked ? <td className='text-muted'>{item.euMobileNumber}</td> : null }
                                          {this.state.emailChecked ? <td className='text-muted'>{item.euEmail}</td> : null }
                                          {this.state.checkInChecked ? <td className='text-muted'>{moment(item.checkInDate).format('MMM DD,YY(hh:mm A)')}</td> : null }
                                          {this.state.checkOutChecked ? <td className='text-muted'>{moment(item.checkOutDate).format('MMM DD,YY(hh:mm A)')}</td> : null }
                                          {this.state.noOfRoomsChecked ? <td className='text-muted'>{item.noOfRooms}</td> : null }
                                          {this.state.propertyTitleChecked ? <td className='text-muted'>{item.spPropertyInfoId.propertyTitle}</td> : null }
                                          {this.state.areaChecked ? <td className='text-muted'>{item.spLocationObj.area}</td> : null }
                                          {this.state.bookingCodeChecked ? <td className='text-muted'>{item.bookingCode}</td> : null }
                                          {this.state.amountChecked ? <td className='text-muted'>{item.spTotalAmount}</td> : null }
                                          {this.state.statusChecked ? <td className='text-muted'>{item.bookingStatus}</td> : null }
                                          <td className='table-actions btn-actions'>
                                            <a onClick={() => this.handleBookingView(item)} className='table-action table-action-view' data-toggle='tooltip' data-placement='top'
                                              title={t`lanCommonButtonTooltipViewBooking`}>
                                              <i className='far fa-eye' />
                                            </a>
                                            <a onClick={() => this.handleBookingEdit(item)} className='table-action table-action-edit' data-toggle='tooltip'
                                              data-placement='top' title={t`lanCommonButtonTooltipEditBooking`}>
                                              <i className='far fa-edit' />
                                            </a>
                                            {item.bookingStatus === 'Booked' || item.bookingStatus === 'Confirmed'
                                              ? <a onClick={() => this.handleBookingCancel(item)} className='table-action table-action-cancel' data-toggle='tooltip' data-placement='top'
                                                title={t`lanCommonButtonTooltipCancelBooking`}>
                                                <i className='fas fa-times' />
                                              </a> : '' }
                                          </td>
                                        </tr>
                                      </tbody>
                                  )}
                              </table>
                            </div>
                            <div className='card-footer'>
                              <div>
                                <div className='text-center'>
                                  <Pagination
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={20}
                                    totalItemsCount={this.state.totalCountBookings}
                                    pageRangeDisplayed={5}
                                    onChange={this.handlePageChangePropertiesList}
                                  />
                                </div>
                              </div>
                            </div>
                          </div> : this.state.matchesFound === true ? <div className='no-data'><p>{t`lanCommonLabelNoMatchesFound`}</p></div> : <div className='no-data'><p>{t`lanCommonLabelNoResultsFound`}</p></div>
                        }
                          </Tab>
                          <Tab title={t`lanSPBookingsButtonUpcoming`} eventKey={1}>
                            {this.state.bookingDate.length > 0
                          ? <div>
                            <div className='table-responsive'>
                              <table className='table align-items-center table-flush table-striped'>
                                <thead className='thead-light'>
                                  <tr>
                                    {this.state.bookedByChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelBookedBy` }</th> : null }
                                    {this.state.mobileNumberChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelMobileNumber` }</th> : null }
                                    {this.state.emailChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelEmail` }</th> : null }
                                    {this.state.checkInChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelCheckIn` }</th> : null }
                                    {this.state.checkOutChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelCheckOut` }</th> : null }
                                    {this.state.noOfRoomsChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelNumberOfRooms` }</th> : null }
                                    {this.state.propertyTitleChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelPropertyTitle` }</th> : null }
                                    {this.state.areaChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelArea` }</th> : null }
                                    {this.state.bookingCodeChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelBookingCode` }</th> : null }
                                    {this.state.amountChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelBookingAmount` }</th> : null }
                                    {this.state.statusChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelStatus` }</th> : null }
                                    <th className='sort' data-sort='name'>{ t`lanCommonLabelActions` }</th>
                                  </tr>
                                </thead>
                                { this.state.bookingDate.map((item, i) =>
                                  <tbody key={i}>
                                    <tr>
                                      {this.state.bookedByChecked ? <td className='text-muted'>{item.euName}</td> : null }
                                      {this.state.mobileNumberChecked ? <td className='text-muted'>{item.euMobileNumber}</td> : null }
                                      {this.state.emailChecked ? <td className='text-muted'>{item.euEmail}</td> : null }
                                      {this.state.checkInChecked ? <td className='text-muted'>{moment(item.checkInDate).format('MMM DD,YY(hh:mm A)')}</td> : null }
                                      {this.state.checkOutChecked ? <td className='text-muted'>{moment(item.checkOutDate).format('MMM DD,YY(hh:mm A)')}</td> : null }
                                      {this.state.noOfRoomsChecked ? <td className='text-muted'>{item.noOfRooms}</td> : null }
                                      {this.state.propertyTitleChecked ? <td className='text-muted'>{item.spPropertyInfoId.propertyTitle}</td> : null }
                                      {this.state.areaChecked ? <td className='text-muted'>{item.spLocationObj.area}</td> : null }
                                      {this.state.bookingCodeChecked ? <td className='text-muted'>{item.bookingCode}</td> : null }
                                      {this.state.amountChecked ? <td className='text-muted'>{item.spTotalAmount}</td> : null }
                                      {this.state.statusChecked ? <td className='text-muted'>{item.bookingStatus}</td> : null }
                                      <td className='table-actions btn-actions'>
                                        <a onClick={this.handleBookingView} className='table-action table-action-view' data-toggle='tooltip' data-placement='top' title={t`lanCommonButtonTooltipViewBooking`}>
                                          <i className='far fa-eye' />
                                        </a>
                                        <a onClick={this.handleBookingEdit} className='table-action table-action-edit' data-toggle='tooltip' data-placement='top' title={t`lanCommonButtonTooltipEditBooking`}>
                                          <i className='far fa-edit' />
                                        </a>
                                        {item.bookingStatus === 'Booked' || item.bookingStatus === 'Confirmed'
                                          ? <a onClick={() => this.handleBookingCancel(item)} className='table-action table-action-cancel' data-toggle='tooltip'
                                            data-placement='top' title={t`lanCommonButtonTooltipCancelBooking`}>
                                            <i className='fas fa-times' />
                                          </a> : '' }
                                      </td>
                                    </tr>
                                  </tbody>
                              )}
                              </table>
                            </div>
                            <div className='card-footer'>
                              <div>
                                <div className='text-center'>
                                  <Pagination
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={20}
                                    totalItemsCount={this.state.totalCountBookings}
                                    pageRangeDisplayed={5}
                                    onChange={this.handlePageChangePropertiesList}
                                  />
                                </div>
                              </div>
                            </div>
                          </div> : this.state.matchesFound === true ? <div className='no-data'><p>{t`lanCommonLabelNoMatchesFound`}</p></div> : <div className='no-data'><p>{t`lanCommonLabelNoResultsFound`}</p></div>
                        }
                          </Tab>
                          <Tab title={t`lanSPBookingsButtonPast`} eventKey={2}>
                            {this.state.bookingDate.length > 0
                            ? <div>
                              <div className='table-responsive'>
                                <table className='table align-items-center table-flush table-striped'>
                                  <thead className='thead-light'>
                                    <tr>
                                      {this.state.bookedByChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelBookedBy` }</th> : null }
                                      {this.state.mobileNumberChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelMobileNumber` }</th> : null }
                                      {this.state.emailChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelEmail` }</th> : null }
                                      {this.state.checkInChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelCheckIn` }</th> : null }
                                      {this.state.checkOutChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelCheckOut` }</th> : null }
                                      {this.state.noOfRoomsChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelNumberOfRooms` }</th> : null }
                                      {this.state.propertyTitleChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelPropertyTitle` }</th> : null }
                                      {this.state.areaChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelArea` }</th> : null }
                                      {this.state.bookingCodeChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelBookingCode` }</th> : null }
                                      {this.state.amountChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelBookingAmount` }</th> : null }
                                      {this.state.statusChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelStatus` }</th> : null }
                                      <th className='sort' data-sort='name'>{ t`lanCommonLabelActions` }</th>
                                    </tr>
                                  </thead>
                                  { this.state.bookingDate.map((item, i) =>
                                    <tbody key={i}>
                                      <tr>
                                        {this.state.bookedByChecked ? <td className='text-muted'>{item.euName}</td> : null }
                                        {this.state.mobileNumberChecked ? <td className='text-muted'>{item.euMobileNumber}</td> : null }
                                        {this.state.emailChecked ? <td className='text-muted'>{item.euEmail}</td> : null }
                                        {this.state.checkInChecked ? <td className='text-muted'>{moment(item.checkInDate).format('MMM DD,YY(hh:mm A)')}</td> : null }
                                        {this.state.checkOutChecked ? <td className='text-muted'>{moment(item.checkOutDate).format('MMM DD,YY(hh:mm A)')}</td> : null }
                                        {this.state.noOfRoomsChecked ? <td className='text-muted'>{item.noOfRooms}</td> : null }
                                        {this.state.propertyTitleChecked ? <td className='text-muted'>{item.spPropertyInfoId.propertyTitle}</td> : null }
                                        {this.state.areaChecked ? <td className='text-muted'>{item.spLocationObj.area}</td> : null }
                                        {this.state.bookingCodeChecked ? <td className='text-muted'>{item.bookingCode}</td> : null }
                                        {this.state.amountChecked ? <td className='text-muted'>{item.spTotalAmount}</td> : null }
                                        {this.state.statusChecked ? <td className='text-muted'>{item.bookingStatus}</td> : null }
                                        <td className='table-actions btn-actions'>
                                          <a onClick={() => this.handleBookingView(item)} className='table-action table-action-view' data-toggle='tooltip' data-placement='top'
                                            title={t`lanCommonButtonTooltipViewBooking`}>
                                            <i className='far fa-eye' />
                                          </a>
                                          <a onClick={this.handleBookingEdit} className='table-action table-action-edit'
                                            data-toggle='tooltip' data-placement='top' title={t`lanCommonButtonTooltipEditBooking`}>
                                            <i className='far fa-edit' />
                                          </a>
                                          {item.bookingStatus === 'Booked' || item.bookingStatus === 'Confirmed'
                                          ? <a onClick={() => this.handleBookingCancel(item)} className='table-action table-action-cancel'
                                            data-toggle='tooltip' data-placement='top' title={t`lanCommonButtonTooltipCancelBooking`}>
                                            <i className='fas fa-times' />
                                          </a> : '' }
                                        </td>
                                      </tr>
                                    </tbody>
                                  )}
                                </table>
                              </div>
                              <div className='card-footer'>
                                <div>
                                  <div className='text-center'>
                                    <Pagination
                                      activePage={this.state.activePage}
                                      itemsCountPerPage={20}
                                      totalItemsCount={this.state.totalCountBookings}
                                      pageRangeDisplayed={5}
                                      onChange={this.handlePageChangePropertiesList}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div> : this.state.matchesFound === true ? <div className='no-data'><p>{t`lanCommonLabelNoMatchesFound`}</p></div> : <div className='no-data'><p>{t`lanCommonLabelNoResultsFound`}</p></div>
                          }
                          </Tab>
                        </Tabs>
                        <Modal
                          isOpen={this.state.modalIsOpen}
                          style={customStyles}
                        >
                          {this.state.noRefund
                         ? <p>Total Amount of {this.state.refundAmount} Will Be Refunded To The Customer {this.state.selectedBooking.euName} With Booking ID: {this.state.selectedBooking.bookingCode}</p>
                          : <p>{this.state.refundAmount} With Booking ID: {this.state.selectedBooking.bookingCode}</p> }
                          <button className='btn btn-primary mr-2' onClick={this.handleCancel}>{t`lanSPButtonOkay`}</button>
                          <button className='btn btn-danger' onClick={this.closeModal}>{t`lanCommonButtonBack`}</button>
                        </Modal>
                        <Modal
                          isOpen={this.state.confirmCancelModalVisible}
                          style={customStyles}
                        >
                          <p>Are you sure, you want to Cancel this booking on {moment(this.state.selectedBooking.checkInDate).format('MMM DD, YY')} -
                           {moment(this.state.selectedBooking.checkOutDate).format('MMM DD, YY')}?</p>
                          <button className='btn btn-primary mr-2' onClick={this.handleConfirmCancel}>{t`lanSPButtonYes`}</button>
                          <button className='btn btn-danger' onClick={this.closeConfirmModal}>{t`lanSPButtonNo`}</button>
                        </Modal>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <SPInboxSendMessageComponent /> */}
      </div>
    )
  }
}

export default SPBookingsListComponent
