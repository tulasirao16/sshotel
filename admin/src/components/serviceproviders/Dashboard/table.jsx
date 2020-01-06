/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'

import 'react-drawer/lib/react-drawer.css'

class SPTable extends React.Component {
  constructor () {
    super()
    this.state = {
    }
  }

  render () {
    return (
      <div>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  {/* <button className='btn btn-primary mb-0' onClick={this.handleBack}>{ t`lanCommonButtonBack` }</button> */}
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleBack}>Dashboards</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>Bookings Page</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6'>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-12 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-body bookings'>
                  <table
                    id='table'
                    data-toggle='table'
                    data-height='460'
                    data-show-columns='true'
                    data-show-footer='true'>
                    <thead>
                      <tr>
                        <th data-field='Booked' >BOOKED BY</th>
                        <th data-field='Mobile' >MOBILE #</th>
                        <th data-field='email'>EMAIL</th>
                        <th data-field='checkin'>Check-In</th>
                        <th data-field='checkin'>Check-Out</th>
                        <th data-field='checkin'>Rooms</th>
                        <th data-field='propertytitle'>Property Title</th>
                        <th data-field='area'>Area</th>
                        <th data-field='bookingcode'>Booking Code</th>
                        <th data-field='amount'>Amount</th>
                        <th data-field='status'>Status</th>
                        <th data-field='actions'>Actions</th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SPTable
