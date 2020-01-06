/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import MainHeader from '../../../components/admin/Drawer/DrawerComponent'
import ADHostsReviewRatingsListComponent from '../../../components/admin/HostsReviews/ADHostsReviewRatingsListComponent'

class ADHostsReviewRatingsList extends React.Component {

  render () {
    return (
      <div>
        {/* ------- Navbar --------- */}
        <MainHeader />
        <div className='main-content' id='panel'>
          <ADHostsReviewRatingsListComponent />
        </div>
      </div>
    )
  }
}

export default ADHostsReviewRatingsList
