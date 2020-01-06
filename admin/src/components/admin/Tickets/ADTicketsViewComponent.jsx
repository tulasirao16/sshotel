/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import Switch from 'react-switch'
import 'react-drawer/lib/react-drawer.css'
import '../../../components/admin/css/all.min.css'
import '../../../components/admin/css/argon.min.css'
import '../../../components/admin/css/nucleo.css'

class ADTicketViewComponent extends React.Component {
  constructor () {
    super()
    let TicketData = JSON.parse(localStorage.getItem('TicketData'))
    this.state = {
      ticketData: TicketData
    }
  }
  render () {
    const ticketData = this.state.ticketData
    return (
      <div>
        <div>
          {/* ---------- Header Ends ------------- */}
          <div className='container-fluid mt--6 mb-4'>
            <div className='row justify-content-center'>
              <div className='col-lg-12 col-md-12'>
                <div className='card border-0 mb-0'>
                  <div className='card-header bg-transparent pb-3'>
                    <div className='row'>
                      <div className='col-sm-8'>
                        <h5 className='card-title'>Ticket View</h5>
                      </div>
                      <div className='col-sm-4 text-center'>
                        <h5 className='card-title'>Ticket #: {ticketData.ticketNumType}{ticketData.ticketNumber}</h5>
                      </div>
                    </div>
                    {/* <h5 className='card-title'>Ticket View</h5> */}
                  </div>
                  <div className='card-body px-lg-4 py-lg-4'>
                    {/* List group */}
                    <ul className='list-group list-group-flush list my--3'>
                      <li className='list-group-item px-0'>
                        <div className='row align-items-center'>
                          <div className='col'>
                            <small>Groups</small>
                            <h5 className='mb-0'>{ticketData.ticketGroup}</h5>
                          </div>
                          <div className='col'>
                            <small>Tags</small>
                            <h5 className='mb-0'>{ticketData.ticketTag}</h5>
                          </div>
                          <div className='col'>
                            <small>Priority</small>
                            <h5 className='mb-0'>{ticketData.ticketPriority}</h5>
                          </div>
                          <div className='col'>
                            <small>Assign To</small>
                            <h5 className='mb-0'>{ticketData && ticketData.adminUserName ? ticketData.adminUserName : '-'}</h5>
                          </div>
                          <div className='col'>
                            <small>Status</small>
                            <h5 className='mb-0'>{ticketData.ticketStatus}</h5>
                          </div>
                        </div>
                      </li>
                      <li className='list-group-item px-0'>
                        <div className='row align-items-center'>
                          <div className='col'>
                            <small>Requester Mobile#</small>
                            <h5 className='mb-0'>{ticketData.reqMobileNumber}</h5>
                          </div>
                          <div className='col'>
                            <small>Requester Email</small>
                            <h5 className='mb-0'>{ticketData && ticketData.reqEmail ? ticketData.reqEmail : '-'}</h5>
                          </div>
                          <div className='col'>
                            <small>Requester Name</small>
                            <h5 className='mb-0'>{(ticketData && ticketData.spName) ? ticketData.spName : (ticketData && ticketData.euName) ? ticketData.euName : '-'}</h5>
                          </div>
                        </div>
                      </li>
                      <li className='list-group-item px-0'>
                        <div className='row align-items-center'>
                          <div className='col'>
                            <small>Subject</small>
                            <h5 className='mb-0'>{ticketData.ticketTitle}</h5>
                          </div>
                          <div className='col'>
                            <small>Description</small>
                            <h5 className='mb-0'>{ticketData.ticketDescription}</h5>
                          </div>
                          <div className='col'>
                            <small>Notes</small>
                            <h5 className='mb-0'>{(ticketData && ticketData.notes) ? ticketData.notes : ''}</h5>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ADTicketViewComponent
