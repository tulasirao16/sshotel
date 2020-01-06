/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
// import Switch from 'react-switch'
// import ReactDrawer from 'react-drawer'
import 'react-drawer/lib/react-drawer.css'

import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
import '../../../components/admin/css/all.min.css'
import '../../../components/admin/css/argon.min.css'
import '../../../components/admin/css/nucleo.css'
import ADTicketEditComponent from '../../../components/admin/Tickets/ADTicketsEditComponent'

class ADTicketEditScreen extends React.Component {
  constructor () {
    super()
    this.state = {
    }
    this.handleHome = this.handleHome.bind(this)
    this.UsersList = this.UsersList.bind(this)
  }
  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  UsersList () {
    hashHistory.push('/admin/tickets')
    event.preventDefault()
  }
  render () {
    return (
      <div>
        <div className='main-content' id='panel'>
          <DrawerWithHeader />
          {/* ---------- Header Starts ------------- */}
          <div className='header bg-primary pb-6'>
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    <h6 className='h2 text-white d-inline-block mb-0'>{t`lanADTitleAdminTickets`}</h6>
                    <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item'><a onClick={this.UsersList}>{t`lanEUButtonTicketList`}</a></li>
                        <li className='breadcrumb-item active' aria-current='page'>{t`lanEUTitleTicketEdit`}</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ADTicketEditComponent />
          <FooterComponent />
        </div>
      </div>
    )
  }
}

export default ADTicketEditScreen
