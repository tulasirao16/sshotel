
import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import PropTypes from 'prop-types'
import { t } from 'ttag'

class ADEUBookingsViewHistoryComponent extends React.Component {
  constructor (props) {
    let bookingsby = localStorage.getItem('bookingsby')
    let data = bookingsby === 'hostdashboard' ? JSON.parse(localStorage.getItem('bookingData'))
     : bookingsby === 'EU-dashboard' ? JSON.parse(localStorage.getItem('bookingData')) : bookingsby === 'dashboard' ? JSON.parse(localStorage.getItem('userData')) : ''
    super(props)
    this.state = {
      recordId: this.props.recordId ? this.props.recordId : '',
      bookingData: this.props.data ? this.props.data : data,
      toggle: '',
      bookingsby: localStorage.getItem('bookingsby')

    }
    this.handleHome = this.handleHome.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleHostDashbaordBookings = this.handleHostDashbaordBookings.bind(this)
    this.handleDashbaordBookings = this.handleDashbaordBookings.bind(this)
    this.handleEUBookings = this.handleEUBookings.bind(this)
    this.handleEUDashboard = this.handleEUDashboard.bind(this)
  }
  handleHome () {
    hashHistory.push('admin/home')
    event.preventDefault()
  }
  handleRating (data) {
    this.props.handleRating(data)
  }
  handleUsers () {
    hashHistory.push('/admin/eu-users')
  }
  componentWillUnmount () {
    localStorage.removeItem('bookingsby')
  }
  handleBack () {
    hashHistory.push('admin/host-dashboard')
    event.preventDefault()
  }
  handleHostDashbaordBookings () {
    hashHistory.push('admin/host-dashboard/bookings')
    event.preventDefault()
  }
  handleDashbaordBookings () {
    hashHistory.push('admin/dashboard/bookings')
    event.preventDefault()
  }
  handleEUDashboard () {
    hashHistory.push('/admin/eu/dashboard')
    event.preventDefault()
  }
  handleEUBookings () {
    hashHistory.push('/admin/eu/bookings')
  }
  render () {
    return (
      <div>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  {this.state.bookingsby === 'dashboard' || this.state.bookingsby === 'hostdashboard' || this.state.bookingsby === 'EU-dashboard'
                  ? ''
                  : <h6 className='h2 text-white d-inline-block mb-0'>{t`lanADEUTitleAdminEUUsers`}</h6>
                  }
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      {this.state.bookingsby === 'dashboard'
                    ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item' />
                      <li className='breadcrumb-item'><a onClick={this.handleDashbaordBookings}>Bookings List</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>BookingsView</li>
                    </ol>
                    : this.state.bookingsby === 'hostdashboard'
                    ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item' />
                      <li className='breadcrumb-item'><a onClick={this.handleBack}>Host Dashboard</a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleHostDashbaordBookings}>Bookings List</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>BookingsView</li>
                    </ol>
                    : this.state.bookingsby === 'EU-dashboard'
                    ? <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item' />
                      <li className='breadcrumb-item'><a onClick={this.handleUsers}>EU Users List</a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleEUDashboard}>Dashboard</a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleEUBookings}>Bookings</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>Bookings View</li>
                    </ol>
                    : <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item' />
                      <li className='breadcrumb-item'><a onClick={this.handleUsers}>EU Users</a></li>
                      <li className='breadcrumb-item'><a onClick={this.props.handleBack}>{t`lanCommonTitleBookings`}</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>BookingsView</li>
                    </ol>
                    }
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6 pb-4'>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-10 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header'>
                  <div className='row'>
                    <div className='col-sm-10'>
                      <h5 className='card-title'>{t`lanSPLabelBookingDetails`}</h5>
                    </div>
                    <div className='col-sm-2 text-right'>
                      {this.state.bookingData.bookingStatus === 'Completed' || this.state.bookingData.bookingStatus === 'Checked-Out'
                    ? <a onClick={() => this.handleRating(this.state.bookingData)} className='update-edit mr-1 ' title='Give Review' >
                      <span className='avatar avatar-md mr-0 bg-info rounded-circle'>
                        <span className='media-object d-flex justify-content-center align-items-center'><i className='fas fa-star' /></span>
                      </span>
                    </a>
                    : null
                    }
                    </div>
                  </div>
                </div>
                <div className='card-body'>
                  <section className='notifications'>
                    <div className='row clearfix'>
                      <div className='col-md-12 col-lg-12 col-sm-12 col-xl-12'>
                        <div className='row'>
                          <div className='col-sm-6'>
                            <div className='row py-2'>
                              <div className='col-sm-3'><small>{t`lanCommonLabelBookingCode`}</small></div>
                              <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.bookingCode}</h5></div>
                            </div>
                            <div className='row py-2'>
                              <div className='col-sm-3'><small>{t`lanCommonLabelName`}</small></div>
                              <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.euName}</h5></div>
                            </div>
                            <div className='row py-2'>
                              <div className='col-sm-3'><small>{t`lanCommonLabelCheckIn`}</small></div>
                              <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.checkInDate}</h5></div>
                            </div>
                            <div className='row py-2' >
                              <div className='col-sm-3'>
                                {this.state.bookingData.bookingType === 'Hours'
                                 ? <small>{t`lanSPLabelTotalDays`} / Hour(s)</small>
                                 : <small>{t`lanSPLabelTotalDays`}</small>}
                              </div>
                              <div className='col-sm-6'>
                                {this.state.bookingData.bookingType === 'Hours'
                                 ? this.state.bookingData.totalDays > 1
                                   ? <h5 className='mb-0 text-sm'>{this.state.bookingData.totalDays} days / {this.state.bookingData.totalHours} hours</h5>
                                   : <h5 className='mb-0 text-sm'>{this.state.bookingData.totalDays} day / {this.state.bookingData.totalHours} hours</h5>
                                 : <h5 className='mb-0 text-sm'>{this.state.bookingData.totalDays}</h5>
                                }
                              </div>
                            </div>
                          </div>
                          <div className='col-sm-6'>
                            <div className='row py-2'>
                              <div className='col-sm-3'><small>{t`lanCommonLabelStatus`}</small></div>
                              <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.bookingStatus}</h5></div>
                            </div>
                            <div className='row py-2'>
                              <div className='col-sm-3'><small>{t`lanEULabelHotel`} {t`lanCommonLabelName`}</small></div>
                              <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.spPropertyTitle}</h5></div>
                            </div>
                            <div className='row py-2'>
                              <div className='col-sm-3'><small>{t`lanCommonLabelCheckOut`}</small></div>
                              <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.checkOutDate}</h5></div>
                            </div>
                            <div className='row py-2'>
                              <div className='col-sm-3'><small>{t`lanCommonLabelBookingAmount`}</small></div>
                              <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.totalPrice}</h5></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                <div className='card-footer hotelDetails mx-4 mb-4 pl-0'>
                  <h5 className='card-title'>{t`lanEULabelHotel`} {t`lanEULabelContactInformation`}</h5>
                  <div className='card-body-footer'>
                    <div className='row clearfix'>
                      <div className='col-md-12 col-lg-12 col-sm-12 col-xl-12'>
                        <div className='row'>
                          <div className='col-sm-6'>
                            <div className='row py-2'>
                              <div className='col-sm-4'><small>{t`lanCommonLabelContactPerson`}</small></div>
                              <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.spLocationObj ? this.state.bookingData.spLocationObj.contactPerson : ''}</h5></div>
                            </div>
                            <div className='row py-2'>
                              <div className='col-sm-4'><small>{t`lanCommonLabelMobileNumber`}</small></div>
                              <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.spLocationObj ? this.state.bookingData.spLocationObj.mobileNumber : ''}</h5></div>
                            </div>
                            <div className='row py-2'>
                              <div className='col-sm-4'><small>{t`lanCommonLabelEmail`}</small></div>
                              <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.spLocationObj ? this.state.bookingData.spLocationObj.email : ''}</h5></div>
                            </div>
                          </div>
                          <div className='col-sm-6'>
                            <div className='col-sm-4'><small>{t`lanCommonLabelAddress`}</small></div>
                            <div className='col-sm-6'><h5 className='mb-0 text-sm'>{this.state.bookingData.spLocationObj ? this.state.bookingData.spLocationObj.address : ''}</h5></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='px-lg-4 py-lg-4 text-center'>
                  {this.state.bookingsby === 'dashboard'
                    ? <button className='btn btn-danger' onClick={this.handleDashbaordBookings}>{t`lanCommonButtonBack`}</button>
                    : this.state.bookingsby === 'hostdashboard'
                    ? <button className='btn btn-danger' onClick={this.handleHostDashbaordBookings}>{t`lanCommonButtonBack`}</button>
                    : this.state.bookingsby === 'EU-dashboard'
                    ? <button className='btn btn-danger' onClick={this.handleEUBookings}>{t`lanCommonButtonBack`}</button>
                    : <button className='btn btn-danger' onClick={this.props.handleBack}>{t`lanCommonButtonBack`}</button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
ADEUBookingsViewHistoryComponent.propTypes = {
  data: PropTypes.any,
  recordId: PropTypes.any,
  handleRating: PropTypes.func,
  handleBack:PropTypes.func
}
export default ADEUBookingsViewHistoryComponent
