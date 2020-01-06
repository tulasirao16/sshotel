/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
import ADServiceProviderDashboard from '../../../components/admin/Home/ADServiceProviderDashboardComponent'

class ADSPHomeScreen extends React.Component {

  render () {
    return (
      <div>
        <div className='main-content' id='panel'>
          {/* ------- Navbar --------- */}
          <DrawerWithHeader />
          <ADServiceProviderDashboard />
        </div>
        <FooterComponent />
      </div>
    )
  }
}

export default ADSPHomeScreen
