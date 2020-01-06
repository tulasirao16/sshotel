/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import ADEUUsersListComponent from '../../../components/admin/EUUsers/ADEUUsersListComponent'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
class ADEUUsersListScreen extends React.Component {

  render () {
    return (
      <div>
        <DrawerWithHeader />
        <div className='main-content' id='panel'>
          <ADEUUsersListComponent />
        </div>
        <FooterComponent />
      </div>
    )
  }
}

export default ADEUUsersListScreen
