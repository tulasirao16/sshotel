/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
import '../../../components/admin/css/all.min.css'
import '../../../components/admin/css/argon.min.css'
import '../../../components/admin/css/nucleo.css'
import 'react-drawer/lib/react-drawer.css'

// import PieChart from 'react-minimal-pie-chart';
import ADTicketsDashBoardComponent from '../../../components/admin/Tickets/ADTicketsDashBoardComponent'

class ADTicketsDashBoardScreen extends React.Component {
  constructor () {
    super()
    this.state = {
    }
    this.handleHome = this.handleHome.bind(this)
  }

  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }

  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        <DrawerWithHeader />
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-md-6'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{ t`lanADLabelTicketTicketsDashboard` }</h6>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ADTicketsDashBoardComponent />
        <FooterComponent />
      </div>
    )
  }
}
export default ADTicketsDashBoardScreen
