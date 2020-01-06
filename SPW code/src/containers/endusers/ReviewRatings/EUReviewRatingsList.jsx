/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import MainHeader from '../../../components/endusers/HeaderCompnt/MainHeader'
import FooterComponent from '../../../components/endusers/FooterCompnt/Footer'
import EUReviewRatingsListComponent from '../../../components/endusers/ReviewRatings/EUReviewRatingsListComponent'

class EUReviewRatingsList extends React.Component {

  render () {
    return (
      <div className='main-content enduser' id='panel'>
        <MainHeader />
        {/* ------- Navbar --------- */}
        <EUReviewRatingsListComponent />
        <FooterComponent />
      </div>
    )
  }
}

export default EUReviewRatingsList
