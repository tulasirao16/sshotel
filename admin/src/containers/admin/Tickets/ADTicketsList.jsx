/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'

import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
import ADTicketsListComponent from '../../../components/admin/Tickets/ADTicketsListComponent'

export default class ADTicketsList extends React.Component {
  constructor () {
    super()
    this.state = {
    }
  }

  render () {
    return (
      <div>
        {/* ------- Navbar --------- */}
        <DrawerWithHeader />
        <div className='main-content' id='panel'>
          <ADTicketsListComponent />
        </div>
        <FooterComponent />
      </div>
    )
  }
};
