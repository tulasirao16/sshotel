/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import SPHeaderComponent from '../../../components/serviceproviders/HeaderCompnt/Header'
// import FooterComponent from '../../../components/serviceproviders/FooterCompnt/Footer'
import SPSignupComponent from '../../../components/serviceproviders/Signup/SPSignupComponent'

class SPSignupScreen extends React.Component {

  render () {
    return (
      <div className='signup-page'>
        <div className='body-main'>
          {/* ------- Navbar --------- */}
          <SPHeaderComponent />
          <div className='main-content' id='panel'>
            <SPSignupComponent />
            {/* <FooterComponent /> */}
          </div>
        </div>
      </div>
    )
  }
}

export default SPSignupScreen
