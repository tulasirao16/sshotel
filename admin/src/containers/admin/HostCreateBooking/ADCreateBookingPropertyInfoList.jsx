/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import ADCreateBookingPropertyInfoListComponent from '../../../components/admin/ADHostCreateBookingComponent/ADCreateBookingPropertyInfoListComponent'
import FooterComponent from '../../../components/admin/footer/Footer'

class ADCreateBookingPropertyInfoList extends React.Component {

  render () {
    return (
      <div >
        <DrawerWithHeader />
        <ADCreateBookingPropertyInfoListComponent />
        <FooterComponent />
      </div>
    )
  }
}

export default ADCreateBookingPropertyInfoList
