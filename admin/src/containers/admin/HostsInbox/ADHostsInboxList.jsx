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
import ADHostsInboxListComponent from '../../../components/admin/HostsInbox/ADHostsInboxListComponent'

class ADHostsInboxList extends React.Component {
  render () {
    return (
      <div className='main-content' id='panel'>
        <DrawerWithHeader />
        {/* ------- Navbar --------- */}
        <ADHostsInboxListComponent />
        <FooterComponent />
      </div>
    )
  }
}
export default ADHostsInboxList
