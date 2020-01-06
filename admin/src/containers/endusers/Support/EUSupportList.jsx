/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'

import '../../../components/endusers/profile/css/Profile.css'
import MainHeader from '../../../components/endusers/HeaderCompnt/MainHeader'
import FooterComponent from '../../../components/endusers/FooterCompnt/Footer'
import EUSupportListComponent from '../../../components/endusers/Support/EUSupportListComponent'

class EUSupportList extends React.Component {
  render () {
    return (
      <div className='main-content eu-profile-container' id='panel'>
        {/* ------- Navbar --------- */}
        <MainHeader />
        <div className='main-content' id='panel'>
          <EUSupportListComponent />
        </div>
        <FooterComponent />
      </div>
    )
  }
}

export default EUSupportList
