/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import DrawerWithHeader from '../../../components/serviceproviders/Drawer/DrawerComponent'
import FooterComponent from '../../../components/serviceproviders/FooterCompnt/Footer'
import SPAmenitiesListComponent from '../../../components/serviceproviders/aminities/SPAmenitiesListComponent'

class SPAmenitiesList extends React.Component {

  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        <DrawerWithHeader />
        <SPAmenitiesListComponent />
        <FooterComponent />
      </div>
    )
  }
}

export default SPAmenitiesList
