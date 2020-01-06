/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import DrawerWithHeader from '../../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../../components/admin/footer/Footer'
import ADHostsPropertyCreateComponent from '../../../../components/admin/HostProperties/HostsPropertyCreate/ADHostsPropertyCreateComponent'
import 'react-drawer/lib/react-drawer.css'

class ADHostsPropertyCreateScreen extends React.Component {
  constructor () {
    super()
    this.state = {
    }
    this.handleHome = this.handleHome.bind(this)
    this.handlePropertiesList = this.handlePropertiesList.bind(this)
  }
  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handlePropertiesList () {
    hashHistory.push('/admin/host/properties')
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
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitlePropertyCreate`}</h6>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={this.handlePropertiesList}>{t`lanSPTitlePropertiesList`}</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>{t`lanSPTitlePropertyCreate`}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ADHostsPropertyCreateComponent />
        <FooterComponent />
      </div>
    )
  }
}
export default ADHostsPropertyCreateScreen
