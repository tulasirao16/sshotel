/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
import ADUserProfileComponent from '../../../components/admin/Profile/ADUserProfileComponent'

class ADUserProfile extends React.Component {
  constructor () {
    super()
    this.state = {
      update: false,
      pic:''
    }
  }
  updateAuthObj = () => {
    this.setState({ update: true })
  }

  updateProfilePic = (a) => {
    this.setState({ pic: a })
  }
  render () {
    return (
      <div>
        <div className='main-content' id='panel'>
          <DrawerWithHeader update={this.state.update} updatePic={this.state.pic} />
          {/* ---------- Header Starts ------------- */}
          <ADUserProfileComponent updateProfilePic={this.updateProfilePic} updateAuthObj={this.updateAuthObj} />
          <FooterComponent />
        </div>
      </div>
    )
  }
}

export default ADUserProfile
