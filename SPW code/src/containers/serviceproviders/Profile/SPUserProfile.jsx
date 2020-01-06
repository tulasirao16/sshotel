/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import DrawerWithHeader from '../../../components/serviceproviders/Drawer/DrawerComponent'
import FooterComponent from '../../../components/serviceproviders/FooterCompnt/Footer'
import SPUserProfileComponent from '../../../components/serviceproviders/Profile/SPUserProfileComponent'

class SPUserProfile extends React.Component {
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
      <div>
        <div className='main-content' id='panel'>
          <DrawerWithHeader update={this.state.update} />
          {/* ---------- Header Starts ------------- */}
          <SPUserProfileComponent updateAuthObj={this.updateAuthObj} />
          <FooterComponent />
        </div>
      </div>
    )
  }
}

export default SPUserProfile
