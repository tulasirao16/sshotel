/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import { t } from 'ttag'
import { hashHistory } from 'react-router'
import moment from 'moment'
import Modal from 'react-modal'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import 'react-drawer/lib/react-drawer.css'

import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
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

class BookingData extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      bookingData: this.props.data,
      refundAmount: '',
      bookingCode: '',
      activePage: 1,
      searchString: '',
      status: 'all',
      totalCountBookings: 0,
      key: 0,
      modalIsOpen: false,
      confirmCancelModalVisible: false,
      confirmCancelBookingData: {},
      checkInDate: '',
      checkOutDate: '',
      spServiceProviderId: '',
      selectedBooking : {},
      euName: '',
      currDate: moment().format('YYYY-MM-DD'),
      noRefund : false,
      statusCode : ''

    }
    this.handleBookingView = this.handleBookingView.bind(this)
    this.handleBookAgain = this.handleBookAgain.bind(this)
    this.handleInboxMessage = this.handleInboxMessage.bind(this)
    this.handleRating = this.handleRating.bind(this)
    this.handleBookingCancel = this.handleBookingCancel.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirmCancel = this.handleConfirmCancel.bind(this)
    this.closeConfirmModal = this.closeConfirmModal.bind(this)
    this.handleEditBooking = this.handleEditBooking.bind(this)
  }

  handleBookingView (item) {
    this.props.handleView(item)
    event.preventDefault()
  }
  handleEditBooking (item) {
    localStorage.setItem('eu-bookings', 'eu-bookingData')
    this.props.handleEdit(item)
    event.preventDefault()
  }
  handleRating (item) {
    localStorage.setItem('euUserId', JSON.stringify(item.euUserId))
    this.props.handleRating(item)
    event.preventDefault()
  }
  handleBookAgain (data) {
    localStorage.setItem('booknow', 'eu-bookingData')
    localStorage.setItem('userData', JSON.stringify(data.euUserId))
    let EUPropertyInfoData = data.spPropertyInfoId
    let BookingType = EUPropertyInfoData.pricing.minBasePriceUnit === 'Per Day' ? 'Days' : 'Hours'
    localStorage.setItem('EUBookingType', JSON.stringify(BookingType))
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
  handleInboxMessage (item) {
    localStorage.setItem('propertyDetails', JSON.stringify(item))
    this.props.handleMessage(item)
    event.preventDefault()
  }
  handleBookingCancel (data) {
    this.setState({ selectedBooking: data })
    let getADBookingsObj = {
      url: config.baseUrl + config.getADRefundAmountBookingAPI + data._id + '/' + moment(data.checkInDate).format('YYYY-MM-DD')
    }
    let _this = this
    APICallManager.getCall(getADBookingsObj, function (resObj) {
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
          if (resObj && resObj.data.statusCode === '0000') {
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
  componentWillReceiveProps (newProps) {
    this.setState({ bookingData: newProps.data })
  }
  closeConfirmModal () {
    this.setState({ confirmCancelModalVisible: !this.state.confirmCancelModalVisible })
  }

  render () {
    const data = this.props.data
    return (
      <div className='eu-all-bookings-list py-lg-4'>
        {data && data.length > 0
        ? <div className='table-responsive eu-bookings-table'>
          <table className='table align-items-center table-flush table-striped'>
            <thead className='thead-light'>
              <tr>
                <th>{t`lanEULabelHotel`}</th>
                <th>{t`lanSPSubTitlePropertyLocationDetails`}</th>
                <th>{t`lanCommonLabelCheckIn`}</th>
                <th>{t`lanCommonLabelCheckOut`}</th>
                <th>TotalDay(S) / Hour(S)</th>
                <th>{t`lanCommonLabelStatus`}</th>
                <th>{t`lanCommonLabelActions`}</th>
              </tr>
            </thead>
            {data.map((item, i) => {
              return (
                <tbody key={i}>
                  <tr>
                    <td className='table-user'>
                      <a ><strong>{item.spPropertyTitle}</strong></a>
                    </td>
                    <td>
                      <span className='text-muted'>{item.spLocationObj.city}</span>
                    </td>
                    <td>
                      <span className='text-muted'>{moment(item.checkInDate).format('MMM DD, YY') + ' (' + moment(item.checkInDate).format('hh:mm A') + ')'} </span>
                    </td>
                    <td>
                      <span className='text-muted'>{moment(item.checkOutDate).format('MMM DD, YY') + ' (' + moment(item.checkOutDate).format('hh:mm A') + ')'} </span>
                    </td>
                    <td>
                      {item.bookingType === 'Hours'
                      ? item.totalDays > 1
                        ? <span className='text-muted'>
                          {item.totalDays} days / {item.totalHours} hours
                          </span>
                        : <span className='text-muted'>
                          {item.totalDays} day / {item.totalHours} hours
                          </span>
                      : item.totalDays > 1
                      ? <span className='text-muted'>
                        {item.totalDays} days
                        </span>
                      : <span className='text-muted'>
                        {item.totalDays} day
                        </span>
                      }
                    </td>
                    <td className='table-actions'>
                      <span className='text-muted'>{item.bookingStatus} </span>
                    </td>
                    <td className='table-actions'>
                      <a onClick={() => this.handleBookingView(item)} className='update-edit mr-1' title='View Booking'>
                        <span className='avatar avatar-md mr-0 bg-primary rounded-circle'>
                          <span className='media-object d-flex justify-content-center align-items-center'><i className='far fa-eye' /></span>
                        </span>
                      </a>
                      <a onClick={() => this.handleEditBooking(item)} className='update-edit mr-1' title='Edit Booking' >
                        <span className='avatar avatar-md mr-0 bg-success rounded-circle'>
                          <span className='media-object d-flex justify-content-center align-items-center'><i className='fas fa-edit' /></span>
                        </span>
                      </a>
                      <a onClick={() => this.handleInboxMessage(item)} className='update-edit mr-1' title='Inbox Message'>
                        <span className='avatar avatar-md mr-0 bg-info rounded-circle'>
                          <span className='media-object d-flex justify-content-center align-items-center'><i className='fas fa-sms' /></span>
                        </span>
                      </a>
                      <a onClick={() => this.handleBookAgain(item)} className='update-edit mr-1' title='Book Again' >
                        <span className='avatar avatar-md mr-0 bg-success rounded-circle'>
                          <span className='media-object d-flex justify-content-center align-items-center'><i className='fas fa-redo' /></span>
                        </span>
                      </a>
                      {item.bookingStatus === 'Completed' || item.bookingStatus === 'Checked-Out'
                    ? <a onClick={() => this.handleRating(item)} className='update-edit mr-1 ' title='Give Review' >
                      <span className='avatar avatar-md mr-0 bg-info rounded-circle'>
                        <span className='media-object d-flex justify-content-center align-items-center'><i className='fas fa-star' /></span>
                      </span>
                    </a>
                    : null
                    }
                      {item.bookingStatus === 'Booked' || item.bookingStatus === 'Confirmed'
                    ? <a onClick={() => this.handleBookingCancel(item)} className='table-action table-action-cancel' data-toggle='tooltip' data-placement='top'
                      title={t`lanCommonButtonTooltipCancelBooking`}>
                      <i className='fas fa-times' />
                    </a> : '' }
                    </td>
                  </tr>
                </tbody>
              )
            })}
          </table>
        </div>
        : <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-sm-12 text-center my-0' >
              <div className='no-data'><p>{t`lanCommonLabelNoResultsFound`}</p></div>
            </div>
          </div>
        </div>
        }
        <Modal
          isOpen={this.state.modalIsOpen}
          style={customStyles}
          ariaHideApp={false}
          > {this.state.noRefund
            ? <p>Total Amount of {this.state.refundAmount} Will Be Refunded To The Customer {this.state.selectedBooking.euName} With Booking ID: {this.state.selectedBooking.bookingCode}</p>
            : <p> Are you sure, you want to Cancel this booking on With Booking ID: {this.state.selectedBooking.bookingCode}</p>}
          <button className='btn btn-primary mr-2' onClick={this.handleCancel}>{t`lanSPButtonOkay`}</button>
          <button className='btn btn-danger' onClick={this.closeModal}>{t`lanCommonButtonBack`}</button>
        </Modal>
        <Modal
          isOpen={this.state.confirmCancelModalVisible}
          style={customStyles}
          ariaHideApp={false}
        >
          <p>Are you sure, you want to Cancel this booking on {moment(this.state.selectedBooking.checkInDate).format('MMM DD, YY')} -
            {moment(this.state.selectedBooking.checkOutDate).format('MMM DD, YY')}?</p>
          <button className='btn btn-primary mr-2' onClick={() => this.handleConfirmCancel(this.state.statusCode)}>{t`lanSPButtonYes`}</button>
          <button className='btn btn-danger' onClick={this.closeConfirmModal}>{t`lanSPButtonNo`}</button>
        </Modal>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}

BookingData.propTypes = {
  data: PropTypes.any,
  handleView: PropTypes.func,
  handleRating: PropTypes.func,
  handleMessage: PropTypes.func,
  handleEdit: PropTypes.func
}
export default BookingData
