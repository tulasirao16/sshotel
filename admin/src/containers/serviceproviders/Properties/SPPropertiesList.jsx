/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import DrawerWithHeader from '../../../components/serviceproviders/Drawer/DrawerComponent'
import FooterComponent from '../../../components/serviceproviders/FooterCompnt/Footer'
import SPPropertiesListComponent from '../../../components/serviceproviders/Properties/SPPropertiesListComponent'

class SPPropertiesList extends React.Component {

  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ---------- Header Starts ------------- */}
        <DrawerWithHeader />

        {/* ---------- Properties List Starts ------------- */}
        <SPPropertiesListComponent />

        {/* ---------- Footer Starts ------------- */}
        <FooterComponent />
      </div>
    )
  }
}

export default SPPropertiesList
