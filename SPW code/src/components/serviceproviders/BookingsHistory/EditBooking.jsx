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
import { t } from 'ttag'
import 'react-drawer/lib/react-drawer.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
class ServiceProviderEditTicket extends React.Component {
  constructor () {
    super()
    this.state = {
    }
    this.handleAddManually = this.handleAddManually.bind(this)
    this.handleViewTicket = this.handleViewTicket.bind(this)
  }
  handleAddManually (event) {
    hashHistory.push('/AddProperty')
    event.preventDefault()
  }
  handleViewTicket (e) {
    hashHistory.push('/viewticket')
    event.preventDefault()
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
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPLabelEditTicket`}</h6>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  {/* <a className='btn btn-sm btn-neutral'>Edit Ticket</a> */}
                  {/* <a href='#' className='btn btn-sm btn-neutral'>Filters</a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container mt--6 pb-3'>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-10 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header'>
                  {/* List group */}
                  <ul className='list-group list-group-flush list my--3'>
                    <li className='list-group-item px-3 py-3'>
                      <div className='row align-items-center'>
                        <div className='col'>
                          <small>{t`lanSPLabelEditBookingTicketNumber`}</small>
                          <h5 className='mb-0'>{t`lanSPLabelNGSBNBT01`}</h5>
                        </div>
                        <div className='col'>
                          <small>{t`lanSPLabelCreatedBy`}</small>
                          <h5 className='mb-0'>{t`lanSPLabelActiveStyle`}</h5>
                        </div>
                        <div className='col'>
                          <small>{t`lanSPLabelCreatedOn`}:</small>
                          <h5 className='mb-0'>{t`lanSPLabel25Jun2019`}</h5>
                        </div>
                        <div className='col'>
                          <small>{t`lanSPLabelStatus`}:</small>
                          <h5 className='mb-0'>{t`lanSPLabelOpen`}</h5>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className='card-body'>
                  <section className='notifications'>
                    <div className='row clearfix'>
                      <div className='col-md-12 col-lg-12 col-xl-12'>
                        {/* List group */}
                        <div className='list-group list-group-flush'>
                          <form>
                            <div className='form-group'>
                              <label>{t`lanSPLabelTicketQuery`}</label>
                              <textarea className='form-control' id='exampleFormControlTextarea1' rows='6'>
                                {t`lanSPLabelLoremIpsumDolorSitAmet`}
                              </textarea>
                            </div>
                            <button className='btn btn-primary update-edit'>{t`lanSPButtonUpdate`}</button>
                          </form>
                        </div>
                      </div>
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
export default ServiceProviderEditTicket
