/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import DrawerWithHeader from '../Drawer/DrawerComponent'
import FooterComponent from '../FooterCompnt/Footer'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import Switch from 'react-switch'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class ServiceProviderCreateBooking extends React.Component {
  constructor () {
    super()
    this.state = {
      tNumber: '',
      tSubject: '',
      ticketBy: '',
      ticketOn: '',
      tQuery: '',
      tNumberError: '',
      tSubjectError: '',
      ticketByError: '',
      ticketOnError:'',
      tQueryError: '',
      selectedOption: '',
      basePrice: '',
      MinBasePrice: '',
      checked: false
    }
    this.handleAddManually = this.handleAddManually.bind(this)
    this.handleViewTicket = this.handleViewTicket.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleCreateTicket = this.handleCreateTicket.bind(this)
  }

  handleAddManually (event) {
    hashHistory.push('/AddProperty')
    event.preventDefault()
  }

  handleViewTicket (e) {
    hashHistory.push('/viewticket')
    event.preventDefault()
  }

  handleOnChange (e) {
    if (e.target.id === 'ticketNumber') {
      this.setState({
        tNumber: e.target.value,
        tNumberError: ''
      })
    } else if (e.target.id === 'TicketSubject') {
      this.setState({
        tSubject: e.target.value,
        tSubjectError: ''
      })
    } else if (e.target.id === 'ticketBy') {
      this.setState({
        ticketBy: e.target.value,
        ticketByError: ''
      })
    } else if (e.target.id === 'ticketOn') {
      this.setState({
        ticketOn: e.target.value,
        ticketOnError: ''
      })
    } else if (e.target.id === 'ticketQuery') {
      this.setState({
        tQuery: e.target.value,
        tQueryError: ''
      })
    }
  }
  handleCreateTicket () {
    if (!this.state.tNumber) {
      this.setState({
        tNumberError: 'Enter Ticket Number'
      })
    } else if (!this.state.tSubject) {
      this.setState({
        tSubjectError: 'Enter Ticket Subject'
      })
    } else if (!this.state.ticketBy) {
      this.setState({
        ticketByError: 'Enter Ticket Created by Whom'
      })
    } else if (!this.state.ticketOn) {
      this.setState({
        ticketOnError: 'Enter Created Date'
      })
    } else if (!this.state.tQuery) {
      this.setState({
        tQueryError: 'Enter Ticket Query '
      })
    } else {
      hashHistory.push('/support')
      event.preventDefault()
    }
  }

  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        <DrawerWithHeader />
        <div className='header bg-primary pb-6'>
          <div className='container'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>Create Booking</h6>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  {/* <a className='btn btn-sm btn-neutral'>Edit Ticket</a> */}
                  {/* <a href='#' className='btn btn-sm btn-neutral'>Filters</a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container mt--6 '>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-10 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-body'>
                  <section className='notifications'>
                    <div className='card-body'>
                      <div className='form-group row'>
                        <label className='col-md-3 col-form-label form-control-label'>Select Price Type <span className='error'>*</span></label>
                        <div className='col-md-3'>
                          <select multiple='' className='form-control' id='exampleFormControlSelect2'>
                            <option>Base Price</option>
                            <option>Min Base Price</option>
                          </select>
                        </div>
                        <label className='col-md-3 col-form-label form-control-label'>Amount Per Day (₹)<span className='error'>*</span></label>
                        <div className='col-md-3'>
                          <input type='text' value={this.state.tSubject} onChange={this.handleOnChange} className='form-control' id='TicketSubject' placeholder='Amount Per Day' />
                        </div>
                      </div>
                      <div className='form-group row'>
                        <label className='col-md-3 col-form-label form-control-label'>No. of Guests</label>
                        <div className='col-md-5'>
                          <div className='row'>
                            <div className='col-md-2 col-auto page-item'>
                              <a href='#' className='page-link'><i className='fas fa-minus' /></a>
                            </div>
                            <div className='col-md-2 col-auto'>
                              <p className='text-center'>1</p>
                            </div>
                            <div className='col-md-2 col-auto page-item'>
                              <a href='#' className='page-link'><i className='fas fa-plus' /></a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='form-group row'>
                        <label className='col-md-3 col-form-label form-control-label'>No. of Bedrooms</label>
                        <div className='col-md-5'>
                          <div className='row'>
                            <div className='col-md-2 col-auto page-item'>
                              <a href='#' className='page-link'><i className='fas fa-minus' /></a>
                            </div>
                            <div className='col-md-2 col-auto'>
                              <p className='text-center'>1</p>
                            </div>
                            <div className='col-md-2 col-auto page-item'>
                              <a href='#' className='page-link'><i className='fas fa-plus' /></a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='form-group row'>
                        <label className='col-md-3 col-form-label form-control-label'>No. of Bathrooms</label>
                        <div className='col-md-5'>
                          <div className='row'>
                            <div className='col-md-2 col-auto page-item'>
                              <a href='#' className='page-link'><i className='fas fa-minus' /></a>
                            </div>
                            <div className='col-md-2 col-auto'>
                              <p className='text-center'>1</p>
                            </div>
                            <div className='col-md-2 col-auto page-item'>
                              <a href='#' className='page-link'><i className='fas fa-plus' /></a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <label className='form-control-label'>Check In Date<span className='error'>*</span></label>
                            <input type='text' value={this.state.tSubject} onChange={this.handleOnChange} className='form-control' id='TicketSubject' placeholder='Check Out Date' />
                            <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                            <p className='text-muted'><small style={{ color: 'red' }}>{this.state.tSubjectError}</small> </p>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <label className='form-control-label'>Check In Date<span className='error'>*</span></label>
                            <input type='text' value={this.state.ticketOn} onChange={this.handleOnChange} className='form-control' id='ticketOn' placeholder='Check In Date' />
                            <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.ticketOnError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                            <p className='text-muted'><small style={{ color: 'red' }}>{this.state.ticketOnError}</small> </p>
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <label className='form-control-label'>Check In Time<span className='error'>*</span></label>
                            <input type='text' value={this.state.tSubject} onChange={this.handleOnChange} className='form-control' id='TicketSubject' placeholder='Check Out Time' />
                            <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                            <p className='text-muted'><small style={{ color: 'red' }}>{this.state.tSubjectError}</small> </p>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <label className='form-control-label'>Check In Time<span className='error'>*</span></label>
                            <input type='text' value={this.state.ticketOn} onChange={this.handleOnChange} className='form-control' id='ticketOn' placeholder='Check In Time' />
                            <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.ticketOnError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                            <p className='text-muted'><small style={{ color: 'red' }}>{this.state.ticketOnError}</small> </p>
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <label className='form-control-label'>No.of Days (#)<span className='error'>*</span></label>
                            <input type='text' value={this.state.tSubject} onChange={this.handleOnChange} className='form-control' id='TicketSubject' placeholder='No. of Days' />
                            <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tSubjectError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                            <p className='text-muted'><small style={{ color: 'red' }}>{this.state.tSubjectError}</small> </p>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <label className='form-control-label'>Total Amount (₹)<span className='error'>*</span></label>
                            <input type='text' value={this.state.ticketOn} onChange={this.handleOnChange} className='form-control' id='ticketOn' placeholder='Total Amount' />
                            <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.ticketOnError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                            <p className='text-muted'><small style={{ color: 'red' }}>{this.state.ticketOnError}</small> </p>
                          </div>
                        </div>
                      </div>
                      <div className='row' data-spy='scroll' data-target='.navbar' data-offset='50' style={{ position: 'relative' }}>
                        <nav className='navbar navbar-scroll-id'>
                          <div className='container'>
                            <ul className='nav navbar-nav'>
                              <li><a href='#section1'>AMINITIES</a></li>
                              <li><a href='#section2'>SERVICES</a></li>
                              <li><a href='#section3'>GUEST RULES</a></li>
                            </ul>
                          </div>
                        </nav>
                        <div id='section1' className='container'>
                          <div className=''>
                            <h3>Aminities</h3>
                            <div className='card-body px-lg-4 py-lg-4'>
                              <div className='table-responsive'>
                                <table className='table align-items-center table-flush table-striped'>
                                  <thead className='thead-light'>
                                    <tr>
                                      <th>Aminity</th>
                                      <th>Aminity-Type</th>
                                      <th>Price (₹)</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className='table-user'>
                                        <img src={require('../../../../assets/compare/icon8.png')} className='avatar rounded-circle mr-3' />
                                        <a href='#'><strong>Car Parking</strong></a>
                                      </td>
                                      <td>
                                        <span className='text-muted'>Paid</span>
                                      </td>
                                      <td>
                                        <span className='text-muted'>50 </span>
                                      </td>
                                      <td className='table-actions'>
                                        <Switch
                                          className='react-switch'
                                          onChange={this.handleChange}
                                          checked={this.state.checked}
                                          aria-labelledby='neat-label'
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className='table-user'>
                                        <img src={require('../../../../assets/compare/icon9.png')} className='avatar rounded-circle mr-3' />
                                        <a href='#'><strong>Breakfast</strong></a>
                                      </td>
                                      <td>
                                        <span className='text-muted'>Paid</span>
                                      </td>
                                      <td>
                                        <span className='text-muted'>70 </span>
                                      </td>
                                      <td className='table-actions'>
                                        <Switch
                                          className='react-switch'
                                          onChange={this.handleChange}
                                          checked={this.state.checked}
                                          aria-labelledby='neat-label'
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className='table-user'>
                                        <img src={require('../../../../assets/compare/wifi.png')} className='avatar rounded-circle mr-3' />
                                        <a href='#'><strong>Wifi</strong></a>
                                      </td>
                                      <td>
                                        <span className='text-muted'>Free</span>
                                      </td>
                                      <td>
                                        <span className='text-muted'>0 </span>
                                      </td>
                                      <td className='table-actions'>
                                        <Switch
                                          className='react-switch'
                                          onChange={this.handleChange}
                                          checked={this.state.checked}
                                          aria-labelledby='neat-label'
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div id='section2' className='container'>
                          <div className=''>
                            <h3>Aminities</h3>
                            <div className='card-body px-lg-4 py-lg-4'>
                              <div className='table-responsive'>
                                <table className='table align-items-center table-flush table-striped'>
                                  <thead className='thead-light'>
                                    <tr>
                                      <th>Aminity</th>
                                      <th>Aminity-Type</th>
                                      <th>Price (₹)</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className='table-user'>
                                        <img src={require('../../../../assets/compare/icon8.png')} className='avatar rounded-circle mr-3' />
                                        <a href='#'><strong>Car Parking</strong></a>
                                      </td>
                                      <td>
                                        <span className='text-muted'>Paid</span>
                                      </td>
                                      <td>
                                        <span className='text-muted'>50 </span>
                                      </td>
                                      <td className='table-actions'>
                                        <Switch
                                          className='react-switch'
                                          onChange={this.handleChange}
                                          checked={this.state.checked}
                                          aria-labelledby='neat-label'
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className='table-user'>
                                        <img src={require('../../../../assets/compare/icon9.png')} className='avatar rounded-circle mr-3' />
                                        <a href='#'><strong>Breakfast</strong></a>
                                      </td>
                                      <td>
                                        <span className='text-muted'>Paid</span>
                                      </td>
                                      <td>
                                        <span className='text-muted'>70 </span>
                                      </td>
                                      <td className='table-actions'>
                                        <Switch
                                          className='react-switch'
                                          onChange={this.handleChange}
                                          checked={this.state.checked}
                                          aria-labelledby='neat-label'
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className='table-user'>
                                        <img src={require('../../../../assets/compare/wifi.png')} className='avatar rounded-circle mr-3' />
                                        <a href='#'><strong>Wifi</strong></a>
                                      </td>
                                      <td>
                                        <span className='text-muted'>Free</span>
                                      </td>
                                      <td>
                                        <span className='text-muted'>0 </span>
                                      </td>
                                      <td className='table-actions'>
                                        <Switch
                                          className='react-switch'
                                          onChange={this.handleChange}
                                          checked={this.state.checked}
                                          aria-labelledby='neat-label'
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div id='section3' className='container'>
                          <div className=''>
                            <h3>Aminities</h3>
                            <div className='card-body px-lg-4 py-lg-4'>
                              <div className='table-responsive'>
                                <table className='table align-items-center table-flush table-striped'>
                                  <thead className='thead-light'>
                                    <tr>
                                      <th>Aminity</th>
                                      <th>Aminity-Type</th>
                                      <th>Price (₹)</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className='table-user'>
                                        <img src={require('../../../../assets/compare/icon8.png')} className='avatar rounded-circle mr-3' />
                                        <a href='#'><strong>Car Parking</strong></a>
                                      </td>
                                      <td>
                                        <span className='text-muted'>Paid</span>
                                      </td>
                                      <td>
                                        <span className='text-muted'>50 </span>
                                      </td>
                                      <td className='table-actions'>
                                        <Switch
                                          className='react-switch'
                                          onChange={this.handleChange}
                                          checked={this.state.checked}
                                          aria-labelledby='neat-label'
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className='table-user'>
                                        <img src={require('../../../../assets/compare/icon9.png')} className='avatar rounded-circle mr-3' />
                                        <a href='#'><strong>Breakfast</strong></a>
                                      </td>
                                      <td>
                                        <span className='text-muted'>Paid</span>
                                      </td>
                                      <td>
                                        <span className='text-muted'>70 </span>
                                      </td>
                                      <td className='table-actions'>
                                        <Switch
                                          className='react-switch'
                                          onChange={this.handleChange}
                                          checked={this.state.checked}
                                          aria-labelledby='neat-label'
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className='table-user'>
                                        <img src={require('../../../../assets/compare/wifi.png')} className='avatar rounded-circle mr-3' />
                                        <a href='#'><strong>Wifi</strong></a>
                                      </td>
                                      <td>
                                        <span className='text-muted'>Free</span>
                                      </td>
                                      <td>
                                        <span className='text-muted'>0 </span>
                                      </td>
                                      <td className='table-actions'>
                                        <Switch
                                          className='react-switch'
                                          onChange={this.handleChange}
                                          checked={this.state.checked}
                                          aria-labelledby='neat-label'
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className='btn btn-primary update-edit' onClick={this.handleCreateTicket}>Create Booking</button>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterComponent />
      </div>
    )
  }
}

export default ServiceProviderCreateBooking
