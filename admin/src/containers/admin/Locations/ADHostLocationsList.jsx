/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'

import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
import ADHostLocationsListComponent from '../../../components/admin/Locations/ADHostLocationsListComponent'

class ADHostLocationsList extends React.Component {
  constructor () {
    super()
    this.state = {
        // propertyObj: JSON.parse(localStorage.getItem('propertyObj'))
    }
    this.handleHome = this.handleHome.bind(this)
    this.handleBackPropList = this.handleBackPropList.bind(this)
    this.handleCreateLocation = this.handleCreateLocation.bind(this)
  }

  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleBackPropList () {
    hashHistory.push('/admin/hosts')
    event.preventDefault()
  }
  handleCreateLocation () {
    hashHistory.push('admin/host/location-create')
    event.preventDefault()
  }

  render () {
    return (
      <div>
        <div className='main-content' id='panel'>
          <DrawerWithHeader />
          <div className='header bg-primary pb-6'>
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    <h6 className='h2 text-white d-inline-block mb-0'> {t`lanADHostsLocationList`}</h6>
                    <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item'><a onClick={this.handleBackPropList} >{t`lanADTitleHostsHostsList`}</a></li>
                        <li className='breadcrumb-item active' aria-current='page'>{ t`lanSPTitleLocationsList` }</li>
                      </ol>
                    </nav>
                  </div>
                  <div className='col-lg-6 col-5 text-right'>
                    <a onClick={this.handleCreateLocation} className='btn btn-success text-white'><i className='fas fa-plus' /> { t`lanSPTitleLocationCreate` }</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ---------- Header Starts ------------- */}
          <ADHostLocationsListComponent />
        </div>
        <FooterComponent />
      </div>
    )
  }
}

export default ADHostLocationsList
