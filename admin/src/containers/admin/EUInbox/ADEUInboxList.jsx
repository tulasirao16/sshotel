/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import MainHeader from '../../../components/admin/Drawer/DrawerComponent'

import ADEUInboxListComponent from '../../../components/admin/EUInbox/ADEUInboxListComponent'

class ADEUInboxList extends React.Component {
  render () {
    return (
      <div className='main-content enduser' id='panel'>
        {/* ------- Navbar --------- */}
        <MainHeader />
        <div className='main-content' id='panel'>
          <ADEUInboxListComponent />
        </div>
      </div>
    )
  }
}
export default ADEUInboxList
