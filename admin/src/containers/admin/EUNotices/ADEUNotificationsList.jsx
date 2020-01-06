/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'

import 'react-drawer/lib/react-drawer.css'
import MainHeader from '../../../components/admin/Drawer/DrawerComponent'
// import MainHeader from '../../../components/endusers/HeaderCompnt/MainHeader'
// import FooterComponent from '../../../components/endusers/FooterCompnt/Footer'
import ADEUNotificationsListComponent from '../../../components/admin/EUNotices/ADEUNotificationsListComponent'

class ADEUNotificationsList extends React.Component {
  constructor () {
    super()
    this.state = {
   //  notificationUnReadCount: 0
    }
  }
  render () {
    return (
      <div className='main-content enduser' id='panel'>
        {/* ------- Navbar --------- */}
        <MainHeader />
        <div className='main-content' id='panel'>
          <ADEUNotificationsListComponent />
        </div>
        {/* <FooterComponent /> */}
      </div>
    )
  }
}
export default ADEUNotificationsList
