/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import '../../../components/admin/css/all.min.css'
import '../../../components/admin/css/argon.min.css'
import '../../../components/admin/css/nucleo.css'

import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
import ADHostUsersListComponent from '../../../components/admin/HostUsers/ADHostUsersListComponent'

class ADHostUsersList extends React.Component {

  render () {
    return (
      <div className='main-content' id='panel'>
        {/* -------Navbar-------- */ }
        <DrawerWithHeader />
        <ADHostUsersListComponent />
        <FooterComponent />
      </div>
    )
  }

}

export default ADHostUsersList
