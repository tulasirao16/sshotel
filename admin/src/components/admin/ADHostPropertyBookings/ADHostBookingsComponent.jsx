/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Oct 2019
 */

import React from 'react'
import { t } from 'ttag'
import { hashHistory } from 'react-router'
import Modal from 'react-modal'
import moment from 'moment'
import 'react-drawer/lib/react-drawer.css'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import Pagination from 'react-js-pagination'

import ADBookingsViewRatings from './ADBookingsViewRatings'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

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
class ADHostBookingsComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      bookingData: [],
      activePage: 1,
      searchString: '',
      status: 'all',
      totalCountBookings: 0,
      key: 0,
      modalIsOpen: false,
      refundAmount: '',
      confirmCancelModalVisible: false,
      confirmCancelBookingData: {},
      bookedByChecked: 'checked',
      mobileNumberChecked: 'checked',
      emailChecked: 'checked',
      checkInChecked: 'checked',
      checkOutChecked: 'checked',
      noOfRoomsChecked: 'checked',
      propertyTitleChecked: 'checked',
      areaChecked: 'checked',
      bookingCodeChecked: 'checked',
      bookingAmountChecked: 'checked',
      statusChecked: 'checked',
      viewRatings: false,
      bookingCode: '',
      hotel: '',
      selectedBooking : {},
      hostData: JSON.parse(localStorage.getItem('hostData')),
      propertyData : JSON.parse(localStorage.getItem('propertyData')),
      bookingHistory: localStorage.getItem('bookingView'),
      propertiesBy:localStorage.getItem('propertiesBy'),
      noRefund : false,
      statusCode : ''
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleRating = this.handleRating.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
    this.handleBookAgain = this.handleBookAgain.bind(this)
    this.handleAPICall = this.handleAPICall.bind(this)
    this.handleBookingView = this.handleBookingView.bind(this)
    this.handleBookingCancel = this.handleBookingCancel.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirmCancel = this.handleConfirmCancel.bind(this)
    this.closeConfirmModal = this.closeConfirmModal.bind(this)
    this.handleBookingEdit = this.handleBookingEdit.bind(this)
    this.handlePropertiesList = this.handlePropertiesList.bind(this)
    this.handleEnter = this.handleEnter.bind(this)
  }
  componentWillMount () {
    this.setState({ bookingCodeChecked:this.state.bookingCodeChecked === 'unchecked' })
    this.setState({ emailChecked:this.state.emailChecked === 'unchecked' })
    this.setState({ bookingAmountChecked:this.state.bookingAmountChecked === 'unchecked' })
    this.setState({ areaChecked:this.state.areaChecked === 'unchecked' })
    let data = JSON.parse(localStorage.getItem('bookingData'))
    if (this.state.bookingHistory) {
      this.handleRating(data)
    } else if (this.state.hostData || this.state.propertyData) {
      let getSpBookingsObj = { url: config.baseUrl + config.getADHostPropertyBookingsListAPI +
        this.state.propertyData.spServiceProviderId + '/' + this.state.propertyData._id + '/' + this.state.activePage + '/' + this.state.searchString }
      this.handleAPICall(getSpBookingsObj)
    } else {
      hashHistory.push('/admin/home')
    }
  }
  componentWillUnmount () {
    localStorage.removeItem('bookingView')
  }
  handleInputChange (search) {
    this.setState({ activePage: 1 })
    if (this.state.hostData || this.state.propertyData) {
      let getSpBookingsObj = { url: config.baseUrl + config.getADHostPropertyBookingsListAPI +
         this.state.propertyData.spServiceProviderId + '/' + this.state.propertyData._id + '/1/' + this.state.searchString }
      this.handleAPICall(getSpBookingsObj)
    } else {
      hashHistory.push('/admin/home')
    }
    event.preventDefault(search)
  }
  handleEnter (event) {
    if (event.charCode === 13) {
      this.handleInputChange()
      event.preventDefault()
    }
  }
  handlePageChange (pageNumber) {
    this.setState({ activePage: pageNumber })
    if (this.state.hostData || this.state.propertyData) {
      if (this.state.activePage !== pageNumber) {
        let getSpBookingsObj = { url: config.baseUrl + config.getADHostPropertyBookingsListAPI +
          this.state.propertyData.spServiceProviderId + '/' + this.state.propertyData._id + '/' + this.state.activePage + '/' + this.state.searchString }
        this.handleAPICall(getSpBookingsObj)
      }
    } else {
      hashHistory.push('/admin/home')
    }
  }
  handleAPICall (getSpBookingsObj) {
    let _this = this
    APICallManager.getCall(getSpBookingsObj, function (resObj) {
      if (resObj && resObj.data && resObj.data.statusCode === '0000') {
        _this.setState({
          bookingData : resObj.data.statusResult.bookingsData,
          totalCountBookings: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({
          bookingData: [],
          totalCountBookings: 0
        })
      }
    })
  }
  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleHostsList () {
    hashHistory.push('/admin/hosts')
  }
  handleBack () {
    this.state.bookingHistory ? hashHistory.push('/admin/bookinghistory') : this.setState({ viewRatings: false })
  }
  handlePropertiesList () {
    hashHistory.push('/admin/host/properties')
  }
  handleBookingView (data) {
    localStorage.setItem('propertiesBookingsHost', 'propertiesHost')
    localStorage.setItem('propertiesBookings', 'properties')
    localStorage.setItem('bookingData', JSON.stringify(data))
    hashHistory.push('/admin/host/property/bookings-view')
    event.preventDefault()
  }
  handleBookingEdit (data) {
    localStorage.setItem('bookingData', JSON.stringify(data))
    hashHistory.push('/admin/host/property/bookings-edit')
    event.preventDefault()
  }
  handleBookAgain (data) {
    localStorage.setItem('userData', JSON.stringify(data.euUserId))
    localStorage.setItem('booknow', 'ad-hostbookings')
    let EUPropertyInfoData = data.spPropertyInfoId
    localStorage.setItem('EUPropertyInfoData', JSON.stringify(EUPropertyInfoData))
    let checkInDate = data.checkInDate
    let checkOutDate = data.checkOutDate
    let child = data.noOfChilds
    let guestAdultValue = data.noOfAdults
    let guestRooms = data.noOfRooms
    let oldCheckInDate = moment(data.checkInDate).format('DD')
    let oldCheckOutDate = moment(data.checkOutDate).format('DD')
    var currentDate = new Date()
    var currentDate1 = new Date().getDate()
    let totalDays = oldCheckOutDate - oldCheckInDate
    if (currentDate1 > oldCheckInDate) {
      let checkInDate = moment(currentDate).format('YYYY-MM-DD hh:mm')
      currentDate.setDate(currentDate.getDate() + totalDays)
      let checkOutDate = moment(currentDate).format('YYYY-MM-DD hh:mm')
      let homePageData = { checkInDate, checkOutDate, child, guestAdultValue, guestRooms }
      localStorage.setItem('homePageData', JSON.stringify(homePageData))
    } else {
      let homePageData = { checkInDate, checkOutDate, child, guestAdultValue, guestRooms }
      localStorage.setItem('homePageData', JSON.stringify(homePageData))
    }
    hashHistory.push('/admin/eu/booking')
    event.preventDefault()
  }
  handleMessage (data) {
    localStorage.setItem('bookingData', JSON.stringify(data))
    localStorage.setItem('hostData', JSON.stringify(data.spServiceProviderId))
    localStorage.setItem('messagesBy', 'Booking')
    hashHistory.push('/admin/host-inbox')
    event.preventDefault()
  }
  handleRating (data) {
    localStorage.setItem('bookingData', JSON.stringify(data))
    this.setState({
      bookingCode: data.bookingCode,
      hotel: data.spPropertyTitle,
      viewRatings:true })
    // event.preventDefault()
  }
  handleBookingCancel (data) {
    this.setState({ selectedBooking: data })
    let getSpBookingsObj = {
      url: config.baseUrl + config.getADRefundAmountBookingAPI + data._id + '/' + data.checkInDate
    }
    let _this = this
    APICallManager.getCall(getSpBookingsObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          refundAmount: resObj.data.statusResult.result.totalRefundAmount,
          modalIsOpen: !_this.state.modalIsOpen,
          confirmCancelBookingData: resObj.data.statusResult.result,
          statusCode: resObj.data.statusCode,
          noRefund: true
        })
      } else if (resObj.data.statusCode === '8888') {
        _this.setState({
          refundAmount: 'Are you sure, you want to Cancel this booking on',
          modalIsOpen: !_this.state.modalIsOpen,
          confirmCancelBookingData: resObj.data.statusResult.result,
          noRefund : false,
          statusCode: resObj.data.statusCode
        })
      } else if (resObj.data.statusCode === '7777') {
        _this.setState({
          refundAmount: 'Are you sure, you want to Cancel this booking on',
          modalIsOpen: !_this.state.modalIsOpen,
          confirmCancelBookingData: resObj.data.statusResult.result,
          noRefund : false,
          statusCode: resObj.data.statusCode
        })
      } else {
        ToastsStore.error('Sorry! You can not cancel this booking')
      }
    })
  }
  closeModal () {
    this.setState({ modalIsOpen: !this.state.modalIsOpen })
  }
  handleCancel () {
    this.setState({ modalIsOpen: !this.state.modalIsOpen, confirmCancelModalVisible: !this.state.confirmCancelModalVisible })
  }
  handleConfirmCancel (statusCode) {
    let bookingListingData = this.state.bookingData
    const index = bookingListingData.findIndex(dataObj => dataObj._id === this.state.selectedBooking._id)
    let _this = this
    switch (statusCode) {
      case '0000' :
        let cancelObj = {
          bookingId: _this.state.selectedBooking._id,
          appRefundAmount: _this.state.confirmCancelBookingData.appRefundAmount,
          spRefundAmount: _this.state.confirmCancelBookingData.spRefundAmount,
          totalRefundAmount: _this.state.confirmCancelBookingData.totalRefundAmount,
          statusCode: '0000'
        }
        let obj = { url: config.baseUrl + config.putADConfirmCancelBookingAPI, body: cancelObj }
        APICallManager.putCall(obj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            bookingListingData[index].appRefundAmount = _this.state.confirmCancelBookingData.appRefundAmount
            bookingListingData[index].spRefundAmount = _this.state.confirmCancelBookingData.spRefundAmount
            bookingListingData[index].totalRefundAmount = _this.state.confirmCancelBookingData.totalRefundAmount
            bookingListingData[index].bookingStatus = 'Cancelled'
            _this.setState({ confirmCancelModalVisible: !_this.state.confirmCancelModalVisible, bookingData: bookingListingData })
            ToastsStore.success('Booking Cancellation Successful')
          } else {
            ToastsStore.error('Booking Cancellation Failed')
          }
        })
        break
      case '8888' :
        let cancelNoRefundObj = {
          bookingId: _this.state.selectedBooking._id,
          appRefundAmount: 0,
          spRefundAmount: 0,
          totalRefundAmount: 0,
          statusCode: '8888'
        }
        let noRefundObj = { url: config.baseUrl + config.putADConfirmCancelBookingAPI, body: cancelNoRefundObj }
        APICallManager.putCall(noRefundObj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            bookingListingData[index].appRefundAmount = 0
            bookingListingData[index].spRefundAmount = 0
            bookingListingData[index].totalRefundAmount = 0
            bookingListingData[index].bookingStatus = 'Cancelled'
            _this.setState({ confirmCancelModalVisible: !_this.state.confirmCancelModalVisible, bookingData: bookingListingData })
            ToastsStore.success('Booking Cancellation Successful')
          } else {
            ToastsStore.error('Booking Cancellation Failed')
          }
        })
        break
      case '7777' :
        let paymentStatusPendingCancelObj = {
          bookingId: _this.state.selectedBooking._id,
          statusCode: '7777'
        }
        let paymentStatusPendingCancel = { url: config.baseUrl + config.putADConfirmCancelBookingAPI, body: paymentStatusPendingCancelObj }
        APICallManager.putCall(paymentStatusPendingCancel, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            bookingListingData[index].bookingStatus = 'Cancelled'
            _this.setState({ confirmCancelModalVisible: !_this.state.confirmCancelModalVisible, bookingData: bookingListingData })
            ToastsStore.success('Booking Cancellation Successful')
          } else {
            ToastsStore.error('Booking Cancellation Failed')
          }
        })
        break
      default :
        ToastsStore.warning('Please TryAgain')
    }
  }
  closeConfirmModal () {
    this.setState({ confirmCancelModalVisible: !this.state.confirmCancelModalVisible })
  }
  handleCreatebooking (event) {
    hashHistory.push('/admin/host/property/bookings/properties-infolist')
    event.preventDefault()
  }
  render () {
    return (
      <div>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-7 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'> {t`lanCommonTitleBookings`}</h6>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    {this.state.propertiesBy === 'Dashboard'
                    ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={this.handlePropertiesList} >{t`lanSPTitlePropertiesList`}</a></li>
                      {!this.state.viewRatings
                      ? <li className='breadcrumb-item active' aria-current='page'>Bookings-Page</li>
                      : <li className='breadcrumb-item'><a onClick={this.handleBack}>Bookings-Page</a>
                        <span className='breadcrumb-item active' aria-current='page'> - {t`lanSPTitleReviewRatingView`}</span></li>}
                    </ol>
                    : !this.state.bookingHistory
                    ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleHostsList} >{t`lanADTitleHostsHostsList`}</a></li>
                      <li className='breadcrumb-item'><a onClick={this.handlePropertiesList} >{t`lanSPTitlePropertiesList`}</a></li>
                      {!this.state.viewRatings
                      ? <li className='breadcrumb-item active' aria-current='page'>{t`lanCommonTitleBookings`}</li>
                      : <li className='breadcrumb-item'><a onClick={this.handleBack}>{t`lanCommonTitleBookings`}</a>
                        <span className='breadcrumb-item active' aria-current='page'> - {t`lanSPTitleReviewRatingView`}</span></li>}
                    </ol>
                    : <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleBack}>{t`lanSPTitleBookingsHistory`}</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>{t`lanSPTitleReviewRatingView`}</li>
                    </ol>}
                  </nav>
                </div>
                <div className='col-lg-5 col-5 text-right'>
                  {this.state.propertyData && this.state.propertyData.status === 'Inactive'
                  ? null
                  : <a className='btn btn-success text-white' onClick={this.handleCreatebooking}><i className='fas fa-plus' /> {t`lanCommonButtonCreateBooking`}</a>}
                </div>
              </div>
            </div>
          </div>
        </div>
        {!this.state.viewRatings
        ? <div className='container-fluid mt--6'>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-12 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header mb-0'>
                  <div className='row'>
                    <div className='col-md-6 col-6'>
                      <h5 className='card-title pt-1'>{ t`lanCommonTitleBookings` }</h5>
                    </div>
                    <div className='col-md-6 col-6 text-right'>
                      <div className='row'>
                        <div className='col-md-2 pr-0 text-right'>
                          { this.state.bookingData.length > 0
                          ? <div className='button-group'>
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
                              <li><a><input type='checkbox' onChange={() => this.setState({ bookingAmountChecked: this.state.bookingAmountChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.bookingAmountChecked} />Booking Amount</a></li>
                              <li><a><input type='checkbox' onChange={() => this.setState({ statusChecked: this.state.statusChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.statusChecked} />Status</a></li>
                            </ul>
                          </div>
                          : null}
                        </div>
                        <div className='col-md-8 pr-0'>
                          {/* -- Search form -- */}
                          <form>
                            <div className='form-group mb-0'>
                              <div className='input-group input-group-lg input-group-flush'>
                                <div className='input-group-prepend'>
                                  <div className='input-group-text'>
                                    <span className='fas fa-search' />
                                  </div>
                                </div>
                                <input type='search' className='form-control' placeholder={t`lanCommonLabelSearch`}
                                  value={this.state.searchString} onKeyPress={this.handleEnter}
                                  onChange={(e) => { this.setState({ searchString: e.target.value }) }} />
                              </div>
                            </div>
                          </form>
                        </div>
                        <div className='col-md-2 text-left'>
                          <button className='btn btn-icon btn-primary px-3 py-2' type='button' onClick={this.handleInputChange}>
                            <span className='btn-inner--icon'><i className='fa fa-search' /></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card-body bookings'>
                  <section className='notifications'>
                    <div className='row clearfix'>
                      <div className='col-md-12 col-lg-12 col-xl-12 p-0'>
                        { this.state.bookingData.length > 0
                          ? <div>
                            <div>
                              <table className='table align-items-center table-flush table-striped table-responsive'>
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
                                    {this.state.bookingAmountChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelBookingAmount` }</th> : null }
                                    {this.state.statusChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelStatus` }</th> : null }
                                    <th className='sort' data-sort='name'>{ t`lanCommonLabelActions` }</th>
                                  </tr>
                                </thead>
                                {
                                this.state.bookingData.map((item, i) =>
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
                                      {this.state.bookingAmountChecked ? <td className='text-muted'>{Math.round(item.spTotalAmount)}</td> : null }
                                      {this.state.statusChecked ? <td className='text-muted'>{item.bookingStatus}</td> : null }
                                      <td className='table-actions'>
                                        {item.status === 'Booked'
                                        ? <span className='badge badge-dot mr-4'>
                                          <i className='bg-warning' />
                                          <span className='status'>{item.status}</span>
                                        </span>
                                        : item.status === 'Completed'
                                        ? <span className='badge badge-dot mr-4'>
                                          <i className='bg-success' />
                                          <span className='status'>{item.status}</span>
                                        </span>
                                        : item.status === 'Cancelled'
                                        ? <span className='badge badge-dot mr-4'>
                                          <i className='bg-danger' />
                                          <span className='status'>{item.status}</span>
                                        </span>
                                        : '' }
                                        <span className='text-muted'>{item.location} </span>
                                        <span className='text-muted'>{item.hotel} </span>
                                        <div className='table-actions btn-actions'>
                                          {this.state.propertyData && this.state.propertyData.status === 'Inactive' ? null
                                         : <a onClick={() => this.handleBookAgain(item)} className='table-action table-action-view' data-toggle='tooltip' data-placement='top'
                                           title={t`lanCommonButtonTooltipBookAgain`}>
                                           <i className='fas fa-retweet' />
                                         </a>}
                                          {item.bookingStatus === 'Completed' || item.bookingStatus === 'Closed' || item.bookingStatus === 'Checked-Out'
                                            ? <a onClick={() => this.handleRating(item)} className='table-action table-action-view' data-toggle='tooltip' data-placement='top'
                                              title={t`lanSPTitleReviews&Ratings`}>
                                              <i className='far fa-star' />
                                            </a>
                                            : null}
                                          <a onClick={() => this.handleMessage(item)} className='table-action table-action-view' data-toggle='tooltip' data-placement='top'
                                            title={t`lanCommonLabelMessage`}>
                                            <i className='fa fa-envelope' />
                                          </a>
                                          <a onClick={() => this.handleBookingView(item)} className='table-action table-action-view' data-toggle='tooltip' data-placement='top'
                                            title={t`lanCommonButtonTooltipViewBooking`}>
                                            <i className='far fa-eye' />
                                          </a>
                                          {this.state.propertyData && this.state.propertyData.status === 'Inactive' ? null
                                         : <a onClick={() => this.handleBookingEdit(item)} className='table-action table-action-edit' data-toggle='tooltip' data-placement='top'
                                           title={t`lanCommonButtonTooltipEditBooking`}>
                                           <i className='far fa-edit' />
                                         </a>}
                                          {item.bookingStatus === 'Booked' || item.bookingStatus === 'Confirmed'
                                            ? <a onClick={() => this.handleBookingCancel(item)} className='table-action table-action-cancel' data-toggle='tooltip' data-placement='top'
                                              title={t`lanCommonButtonTooltipCancelBooking`}>
                                              <i className='fas fa-times' />
                                            </a> : '' }
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                  )}
                              </table>
                            </div>
                          </div> : this.state.bookingData.length <= 0 ? <div className='no-data'><p>{t`lanCommonLabelNoResultsFound`}</p></div> : null
                        }
                      </div>
                    </div>
                    <Modal
                      isOpen={this.state.modalIsOpen}
                      style={customStyles}
                    > {this.state.noRefund
                     ? <p>Total Amount of {this.state.refundAmount} Will Be Refunded To The Customer {this.state.selectedBooking.euName} With Booking ID: {this.state.selectedBooking.bookingCode}</p>
                     : <p> Are you sure, you want to Cancel this booking on With Booking ID: {this.state.selectedBooking.bookingCode}</p>}
                      <button className='btn btn-primary mr-2' onClick={this.handleCancel}>{t`lanSPButtonOkay`}</button>
                      <button className='btn btn-danger' onClick={this.closeModal}>{t`lanCommonButtonBack`}</button>
                    </Modal>
                    <Modal
                      isOpen={this.state.confirmCancelModalVisible}
                      style={customStyles}
                    >
                      <p>Are you sure, you want to Cancel this booking on {moment(this.state.selectedBooking.checkInDate).format('MMM DD, YY')} -
                        {moment(this.state.selectedBooking.checkOutDate).format('MMM DD, YY')}?</p>
                      <button className='btn btn-primary mr-2' onClick={() => this.handleConfirmCancel(this.state.statusCode)}>{t`lanSPButtonYes`}</button>
                      <button className='btn btn-danger' onClick={this.closeConfirmModal}>{t`lanSPButtonNo`}</button>
                    </Modal>
                  </section>
                </div>
                <div className='card-footer'>
                  {this.state.bookingData.length > 0
                    ? <div className='text-center'>
                      <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={20}
                        totalItemsCount={this.state.totalCountBookings}
                        pageRangeDisplayed={5}
                        onChange={this.handlePageChange}
                      />
                    </div>
                  : null}
                </div>
                <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
              </div>
            </div>
          </div>
        </div> : null}
        { this.state.viewRatings ? <ADBookingsViewRatings hotel={this.state.hotel} bookingCode={this.state.bookingCode} handleBack={this.handleBack} /> : null }
      </div>
    )
  }
}

export default ADHostBookingsComponent
