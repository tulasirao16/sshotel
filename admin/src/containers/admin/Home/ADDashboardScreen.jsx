/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
import '../../../components/admin/css/all.min.css'
import '../../../components/admin/css/argon.min.css'
import '../../../components/admin/css/nucleo.css'

// import PieChart from 'react-minimal-pie-chart';
import ADServiceProviderDashBoardComponent from '../../../components/admin/Home/ADServiceProviderDashboardComponent'

class ADSPDashBoardScreen extends React.Component {
  constructor () {
    super()
    this.state = {
    }
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        <DrawerWithHeader />
        <ADServiceProviderDashBoardComponent />
        <FooterComponent />
      </div>
    )
  }
}
export default ADSPDashBoardScreen
