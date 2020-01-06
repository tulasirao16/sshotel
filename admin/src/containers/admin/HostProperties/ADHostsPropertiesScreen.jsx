/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
import ADHostsPropertiesComponent from '../../../components/admin/HostProperties/ADHostsPropertiesComponent'
class ADHostsPropertiesScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <div>
        <DrawerWithHeader />
        <ADHostsPropertiesComponent />
        <FooterComponent />
      </div>
    )
  }
}

export default ADHostsPropertiesScreen
