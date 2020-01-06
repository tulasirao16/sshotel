/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import MainHeader from '../../../components/endusers/HeaderCompnt/MainHeader'
import FooterComponent from '../../../components/endusers/FooterCompnt/Footer'
import EUProfileComponent from '../../../components/endusers/profile/EUProfileComponent'

class EUProfile extends React.Component {
  constructor () {
    super()
    this.state = {
      update: false
    }
  }
  updateAuthObj = () => {
    this.setState({ update: true })
  }
  render () {
    return (
      <div style={{ fontFamily: 'Lato' }}>
        <div className='main-content eu-profile-container ' id='panel'>
          <MainHeader update={this.state.update} />
          {/* ---------- Header Starts ------------- */}
          <EUProfileComponent updateAuthObj={this.updateAuthObj} />
          <FooterComponent />
        </div>
      </div>
    )
  }
}
export default EUProfile
