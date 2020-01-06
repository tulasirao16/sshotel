/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import { hashHistory } from 'react-router'
import DrawerWithHeader from '../../../components/serviceproviders/Drawer/DrawerComponent'
import FooterComponent from '../../../components/serviceproviders/FooterCompnt/Footer'
import SPPropertyViewComponent from '../../../components/serviceproviders/Properties/SPPropertyViewComponent'
import 'react-drawer/lib/react-drawer.css'

class SPPropertyView extends React.Component {
  constructor () {
    super()
    this.state = {
    }
    this.handleBackToHome = this.handleBackToHome.bind(this)
    this.handleBackPropList = this.handleBackPropList.bind(this)
  }
  handleBackToHome () {
    hashHistory.push('/host/home')
    event.preventDefault()
  }
  handleBackPropList () {
    hashHistory.push('/host/properties')
    event.preventDefault()
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        <DrawerWithHeader />
        {/* ---------- Header Starts ------------- */}
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleBackToHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleBackPropList} >{t`lanSPTitlePropertiesList`}</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>{t`lanSPTitlePropertyView`}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SPPropertyViewComponent />
        <FooterComponent />
      </div>
    )
  }
}

export default SPPropertyView
