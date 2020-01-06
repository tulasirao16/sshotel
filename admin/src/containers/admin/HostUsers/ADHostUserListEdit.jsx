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
import ADHostUserListEditComponent from '../../../components/admin/HostUsers/ADHostUserListEditComponent'

class ADHostUserListEdit extends React.Component {
  constructor () {
    super()
    this.state = {
        // propertyObj: JSON.parse(localStorage.getItem('propertyObj'))
    }
    this.handleHome = this.handleHome.bind(this)
    this.handleBackPropList = this.handleBackPropList.bind(this)
    this.handleBack = this.handleBack.bind(this)
  }

  handleHome () {
    localStorage.removeItem('userData')
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleBackPropList () {
    localStorage.removeItem('userData')
    hashHistory.push('/admin/hosts')
    event.preventDefault()
  }
  handleBack () {
    localStorage.removeItem('userData')
    hashHistory.push('/admin/host-users')
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
                  <div className='col'>
                    <h6 className='h2 text-white d-inline-block mb-0'> {t`lanADButtonTooltipLabelHostsHostUsers`}</h6>
                    <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item'><a onClick={this.handleBackPropList} >{t`lanADTitleHostsHostsList`}</a></li>
                        <li className='breadcrumb-item'><a onClick={this.handleBack} >{t`lanADHostsHostUsersList`}</a></li>
                        <li className='breadcrumb-item active' aria-current='page'>{ t`lanADTooltipLabelHostUserEdit` }</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ---------- Header Starts ------------- */}
          <ADHostUserListEditComponent />
          <FooterComponent />
        </div>
      </div>
    )
  }
}

export default ADHostUserListEdit
