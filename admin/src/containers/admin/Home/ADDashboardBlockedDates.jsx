/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
import ADDashboardBlockedDatesListComponent from '../../../components/admin/Home/ADDashboardBlockedDatesComponent'

class ADDashboardBlockedDates extends React.Component {

  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        <DrawerWithHeader />
        <ADDashboardBlockedDatesListComponent />
        <FooterComponent />
      </div>
    )
  }
}

export default ADDashboardBlockedDates
