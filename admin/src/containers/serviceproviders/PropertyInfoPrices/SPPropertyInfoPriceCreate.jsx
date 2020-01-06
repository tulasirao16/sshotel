/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
// import { t } from 'ttag'
import PropTypes from 'prop-types'
import SPPropertyInfoPriceCreateComponent from '../../../components/serviceproviders/PropertyInfoPrices/SPPropertyInfoPriceCreateComponent'
import 'react-drawer/lib/react-drawer.css'

class SPPropertyInfoPriceCreate extends React.Component {
  constructor () {
    super()
    this.state = {
    }
  }

  render () {
    return (
      <div className='main-content' id='panel'>
        {/* <DrawerWithHeader /> */}
        {/* ---------- Header Starts ------------- */}
        {/* <div className='header bg-primary pb-6'>
          <div className='container'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitleProperyInfoPrice`}</h6>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* ---------- Header Starts ------------- */}
        <div>
          <SPPropertyInfoPriceCreateComponent commonFuntion={this.props.commonFuntion} priceObj={this.props.priceObj} />
        </div>
        {/* <FooterComponent /> */}
      </div>
    )
  }
}
SPPropertyInfoPriceCreate.propTypes = {
  commonFuntion: PropTypes.any,
  priceObj: PropTypes.any
}

export default SPPropertyInfoPriceCreate
