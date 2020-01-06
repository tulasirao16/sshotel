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
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import moment from 'moment'
import Modal from 'react-modal'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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

class BookingData extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      handleCancelButton: false,
      bookingData: this.props.data,
      modalIsOpen: false,
      confirmCancelModalVisible: false,
      refundAmount: '',
      bookingCode: '',
      checkInDate: '',
      checkOutDate: '',
      spServiceProviderId: '',
      euName: '',
      noRefund: false,
      currDate: moment().format('YYYY-MM-DD')

    }
    this.handleBookingView = this.handleBookingView.bind(this)
    this.handleBookAgain = this.handleBookAgain.bind(this)
    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.handleRating = this.handleRating.bind(this)
    this.handleBookingCancelAmount = this.handleBookingCancelAmount.bind(this)
    this.handleBookingCancel = this.handleBookingCancel.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleConfirmCancel = this.handleConfirmCancel.bind(this)
    this.closeModaltwo = this.closeModaltwo.bind(this)
  }
  closeModal () {
    this.setState({ modalIsOpen: false })
  }
  closeModaltwo () {
    this.setState({ confirmCancelModalVisible: false, refundAmount: '', bookingCode: '', checkInDate: '', checkOutDate: '', spServiceProviderId: '' })
  }
  handleBookingView (item) {
    this.props.handleToggle(item)
    event.preventDefault()
  }
  handleRating (item) {
    this.props.handleRating(item)
    event.preventDefault()
  }
  handleBookAgain (item) {
    localStorage.setItem('EUPropertyInfoData', JSON.stringify(item.spPropertyInfoId))
    hashHistory.push('/hotels/booknow')
    event.preventDefault()
  }
  handleSendMessage (item) {
    this.props.handleMessage(item)
  }
  handleBookingCancelAmount (item) {
    var checkIn = moment.utc(item.checkInDate, 'YYYY-MM-DD')
    var fromNow = moment()
    var duration = moment.duration(checkIn.diff(fromNow))
    var hours = duration.asHours()
    if (hours < item.spPropertyInfoId.pricing.refundCancelTime) {
      // toast.error('Sorry.. You cant cancel this booking', {
      //   position: toast.POSITION.TOP_RIGHT
      // })
      this.setState({
        modalIsOpen: true,
        refundAmount: 'Note: No refund on cancellation',
        bookingCode: item.bookingCode,
        checkInDate: item.checkInDate,
        checkOutDate: item.checkOutDate,
        spServiceProviderId: item.spServiceProviderId,
        euName: item.euName,
        noRefund: true
      })
    } else {
      let checkIn = moment.utc(item.checkInDate, 'YYYY-MM-DD')
      let fromNow = moment()
      let duration = moment.duration(checkIn.diff(fromNow))
      let hours = duration.asHours()
      if (hours >= item.spPropertyInfoId.pricing.fullRefundCancelTime) {
        let appTotalAmount = item.appTotalAmount
        let spTotalAmount = item.spTotalAmount
        let refundAmount = ((appTotalAmount) + (spTotalAmount))
        this.setState({
          modalIsOpen: true,
          refundAmount: `Total Refund of RS  ${refundAmount}`,
          bookingCode: item.bookingCode,
          checkInDate: item.checkInDate,
          checkOutDate: item.checkOutDate,
          spServiceProviderId: item.spServiceProviderId,
          euName: item.euName
        })
      } else if (hours >= item.spPropertyInfoId.pricing.refundCancelTime && hours < item.spPropertyInfoId.pricing.fullRefundCancelTime) {
        // let appTotalAmount = item.appTotalAmount
        // let spTotalAmount = item.spTotalAmount
        let refundAmount = ((item.appTotalAmount / 100) * (item.spPropertyInfoId.pricing.refundCancelPercentage) + (item.spTotalAmount / 100) * (item.spPropertyInfoId.pricing.refundCancelPercentage))
        this.setState({
          modalIsOpen: true,
          refundAmount:  `Partial Refund of ${refundAmount}`,
          bookingCode: item.bookingCode,
          checkInDate: item.checkInDate,
          checkOutDate: item.checkOutDate,
          spServiceProviderId: item.spServiceProviderId,
          euName: item.euName
        })
      } else {
        toast.error('Something Went Wrong', {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    }
  }
  handleBookingCancel () {
    let obj = { url: config.baseUrl + config.putEUBookingCancelAPI + this.state.bookingCode + '/' + moment(this.state.checkInDate).format('YYYY-MM-DD') + '/' + this.state.spServiceProviderId }
    let _this = this
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ confirmCancelModalVisible: false, bookingCode: '', checkInDate: '', spServiceProviderId: '' })
        location.reload()
      } else {
        toast.error('Cancellation Failed Try Again', {
          position: toast.POSITION.TOP_RIGHT
        })
        _this.setState({ confirmCancelModalVisible: false, bookingCode: '', checkInDate: '', spServiceProviderId: '' })
      }
    })
  }
  handleConfirmCancel () {
    this.setState({
      modalIsOpen: false,
      confirmCancelModalVisible: true
    })
  }
  handlePageChangeBookingsList = (pageNumber) => {
    this.setState({ activePage : pageNumber })
    let getEUBookingsObj = {
      url: config.baseUrl + config.getEUBookingsHistoryListAPI + pageNumber + '/' + this.state.dataType + '/' + this.state.searchString
    }
    let _this = this
    APICallManager.getCall(getEUBookingsObj, function (resObj) {
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
                <th>{t`lanSPLabelTotalDays`}</th>
                <th>{t`lanCommonLabelStatus`}</th>
                <th>{t`lanCommonLabelActions`}</th>
              </tr>
            </thead>
            {data.map((item, i) => {
              console.log({ item })
              console.log('checkInDate===', moment.utc(item.checkInDate, 'YYYY-MM-DD').valueOf())
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
                      <span className='text-muted'>{item.totalDays} </span>
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
                      <a onClick={() => this.handleSendMessage(item)} className='update-edit mr-1' title='Send Message'>
                        <span className='avatar avatar-md mr-0 bg-info rounded-circle'>
                          <span className='media-object d-flex justify-content-center align-items-center'><i className='fas fa-sms' /></span>
                        </span>
                      </a>
                      <a onClick={() => this.handleBookAgain(item)} className='update-edit mr-1' title='Book Again' >
                        <span className='avatar avatar-md mr-0 bg-success rounded-circle'>
                          <span className='media-object d-flex justify-content-center align-items-center'><i className='fas fa-redo' /></span>
                        </span>
                      </a>
                      {((item.bookingStatus === 'Booked' || item.bookingStatus === 'Confirmed') && moment.utc(this.state.currDate).valueOf() <= moment.utc(item.checkInDate, 'YYYY-MM-DD').valueOf())
                      ? <a onClick={() => this.handleBookingCancelAmount(item)} className='update-edit mr-1' data-toggle='tooltip'
                        data-placement='top' title={t`lanCommonButtonTooltipCancelBooking`}>
                        <span className='avatar avatar-md mr-0 bg-danger rounded-circle'>
                          <span className='media-object d-flex justify-content-center align-items-center'><i className='fas fa-times' /></span>
                        </span>
                      </a> : '' }
                      {item.bookingStatus === 'Completed' || item.bookingStatus === 'Checked-Out'
                    ? <a onClick={() => this.handleRating(item)} className='update-edit mr-1 ' title='Give Review' >
                      <span className='avatar avatar-md mr-0 bg-info rounded-circle'>
                        <span className='media-object d-flex justify-content-center align-items-center'><i className='fas fa-star' /></span>
                      </span>
                    </a>
                    : null
                    }
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
        <ToastContainer rtl />
        <Modal
          isOpen={this.state.confirmCancelModalVisible}
          onRequestClose={this.closeModaltwo}
          style={customStyles}
        >
          <div className='container modalOne'>
            <div className='row my-2'>
              <div className='col-sm-12 text-right'>
                <i className='fas fa-times' onClick={this.closeModal} />
              </div>
              <div className='col-sm-12 m-3'>
                <p>Are you sure, you want to Cancel this booking <br /> on {moment(this.state.checkInDate).format('MMM DD, YY')} to
              {moment(this.state.checkOutDate).format('MMM DD, YY')}</p>
              </div>
            </div>
            <div className='row my-3'>
              <div className='col-sm-12 text-center'>
                <button className='btn btn-primary mr-2' type='button' onClick={this.handleBookingCancel}>{t`lanSPButtonYes`}</button>
                <button className='btn btn-danger' type='button' onClick={this.closeModaltwo}>{t`lanSPButtonNo`}</button>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
        >
          <div className='container modalOne'>
            <div className='row my-2'>
              <div className='col-sm-12 text-right'>
                <i className='fas fa-times' onClick={this.closeModal} />
              </div>
              <div className='col-sm-12 m-3'>
                {!this.state.noRefund
              ? <p>{this.state.refundAmount}/- will be refunded to {this.state.euName} <br /> with Booking Id: {this.state.bookingCode}</p>
              : <p>{this.state.refundAmount}<br /> with Booking Id: {this.state.bookingCode}</p>
              }
              </div>
            </div>
            <div className='row my-3'>
              <div className='col-sm-12 text-center'>
                <button className='btn btn-primary mr-3' type='button' onClick={this.handleConfirmCancel}>{t`lanSPButtonOkay`}</button>
                <button className='btn btn-danger' type='button' onClick={this.closeModal}>{t`lanCommonButtonBack`}</button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

BookingData.propTypes = {
  data: PropTypes.any,
  handleToggle: PropTypes.func,
  handleRating: PropTypes.func,
  handleMessage: PropTypes.func
}
export default BookingData
