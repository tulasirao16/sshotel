/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import HeaderComponent from '../../../components/admin/Header/Header'
import FooterComponent from '../../../components/admin/footer/Footer'
import ADLoginComponent from '../../../components/admin/Login/ADLoginComponent'

class ADLogin extends React.Component {
  constructor () {
    super()
    this.state = {
    }
  }
  render () {
    return (
      <div className='body-main'>
        <HeaderComponent />
        <div className='admin-main-content' id='panel'>
          <ADLoginComponent />
        </div>
        <FooterComponent />
      </div>
    )
  }
}
export default ADLogin
