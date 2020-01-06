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
                      <li className='breadcrumb-item'><a onClick={this.handleBack}>{t`lanSPButtonDashboards`}</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>{t`lanSPLabelBookingsPage`}</li>
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
                        <th data-field='Booked' >{t`lanSPLabelBOOKEDBY`}</th>
                        <th data-field='Mobile' >{t`lanSPLabelMOBILE`} #</th>
                        <th data-field='email'>{t`lanSPLabelEMAIL`}</th>
                        <th data-field='checkin'>{t`lanSPLabelCheckIn`}</th>
                        <th data-field='checkin'>{t`lanSPLabelCheckOut`}</th>
                        <th data-field='checkin'>{t`lanSPLabelRooms`}</th>
                        <th data-field='propertytitle'>{t`lanSPLabelPropertyTitle`}</th>
                        <th data-field='area'>{t`lanSPLabelArea`}</th>
                        <th data-field='bookingcode'>{t`lanSPLabelBookingCode`}</th>
                        <th data-field='amount'>{t`lanSPLabelAmount`}</th>
                        <th data-field='status'>{t`lanSPLabelStatus`}</th>
                        <th data-field='actions'>{t`lanSPLabelActions`}</th>
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
