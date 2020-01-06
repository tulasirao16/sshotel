/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import ADEUReviewRatingsListComponent from '../../../components/admin/EURatings/ADEUReviewRatingsListComponent'

class ADEUReviewRatingsList extends React.Component {

  render () {
    return (
      <div className='main-content enduser' id='panel'>
        <DrawerWithHeader />
        {/* ------- Navbar --------- */}
        <ADEUReviewRatingsListComponent />

      </div>
    )
  }
}

export default ADEUReviewRatingsList
