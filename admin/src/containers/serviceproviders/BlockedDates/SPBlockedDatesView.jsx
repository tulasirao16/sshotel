/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import 'react-drawer/lib/react-drawer.css'
import { hashHistory } from 'react-router'
import DrawerWithHeader from '../../../components/serviceproviders/Drawer/DrawerComponent'
import FooterComponent from '../../../components/serviceproviders/FooterCompnt/Footer'
import SPBlockedDatesViewComponent from '../../../components/serviceproviders/blockedDates/SPBlockedDatesViewComponent'

class SPBlockedDatesView extends React.Component {
  constructor () {
    super()
    this.state = {
    }
    this.handleBack = this.handleBack.bind(this)
    this.handleBackPropList = this.handleBackPropList.bind(this)
  }
  handleBack (event) {
    hashHistory.push('/host/property-view')
    event.preventDefault()
  }
  handleBackPropList () {
    hashHistory.push('/host/properties')
    event.preventDefault()
  }
  render () {
    return (
      <div>
        <div className='main-content' id='panel'>
          {/* ------- Navbar --------- */}
          <DrawerWithHeader />
          <div className='header bg-primary pb-6'>
            <div className='container'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-8 col-7'>
                    <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item'><a onClick={this.handleBackPropList} >{t`lanSPTitlePropertiesList`}</a></li>
                        <li className='breadcrumb-item'><a onClick={this.handleBack} >{ t`lanSPTitlePropertyView` }</a></li>
                        <li className='breadcrumb-item active' aria-current='page'>{t`lanSPTitleBlockedDatesView`}</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SPBlockedDatesViewComponent />
        </div>
        <FooterComponent />
      </div>
    )
  }
}

export default SPBlockedDatesView
