/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
// import DrawerWithHeader from '../../../components/serviceproviders/Drawer/DrawerComponent'
// import FooterComponent from '../../../components/serviceproviders/FooterCompnt/Footer'
import SPNotificationsListComponent from '../../../components/serviceproviders/Notifications/SPNotificationsListComponent'

class SPNotificationsList extends React.Component {

  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        {/* <DrawerWithHeader /> */}
        <SPNotificationsListComponent />
        {/* <FooterComponent /> */}
      </div>
    )
  }
}

export default SPNotificationsList
