/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import DrawerWithHeader from '../../../components/serviceproviders/Drawer/DrawerComponent'
import FooterComponent from '../../../components/serviceproviders/FooterCompnt/Footer'
import SPLocationEditComponent from '../../../components/serviceproviders/Locations/SPLocationEditComponent'

class SPLocationEdit extends React.Component {

  render () {
    return (
      <div>
        <div className='main-content' id='panel'>
          {this.props.spLocationObj ? null : <DrawerWithHeader /> }
          {/* ---------- Header Starts ------------- */}
          <SPLocationEditComponent spLocationObj={this.props.spLocationObj} propertyId={this.props.propertyId} />
          {this.props.spLocationObj ? null : <FooterComponent /> }
        </div>
      </div>
    )
  }
}
SPLocationEdit.propTypes = {
  spLocationObj: PropTypes.any,
  propertyId: PropTypes.any
}
export default SPLocationEdit
