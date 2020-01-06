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
import EUSPPInfoAmenitiesCompareComponent from '../../../components/endusers/CompareHosts/EUSPPInfoAmenitiesCompareComponent'

class EUSPPInfoAmenitiesCompare extends React.Component {
  constructor () {
    super()
    this.state = {
      authObj : JSON.parse(localStorage.getItem('authObj'))
    }
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        {this.state.authObj && this.state.authObj.displayName
        ? <MainHeader />
        : null }
        <div className='main-content' id='panel'>
          <EUSPPInfoAmenitiesCompareComponent />
        </div>
        <FooterComponent />
      </div>
    )
  }
}
export default EUSPPInfoAmenitiesCompare
