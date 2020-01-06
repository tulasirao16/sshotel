/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import MainHeader from '../../../components/endusers/HeaderCompnt/MainHeader'
import FooterComponent from '../../../components/endusers/FooterCompnt/Footer'
import EUInboxListComponent from '../../../components/endusers/inbox/EUInboxListComponent'

class EUInboxList extends React.Component {
  render () {
    return (
      <div className='main-content enduser' id='panel'>
        {/* ------- Navbar --------- */}
        <MainHeader drawerValue='inbox' />
        <div className='main-content' id='panel'>
          <EUInboxListComponent />
        </div>
        <FooterComponent />
      </div>
    )
  }
}
export default EUInboxList
