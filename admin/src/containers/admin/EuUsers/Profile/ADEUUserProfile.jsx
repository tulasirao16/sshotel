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
import ADEUUserProfileComponent from '../../../../components/admin/EUUsers/profile/ADEUUserProfileComponent'

class ADEUUserProfile extends React.Component {
  constructor () {
    super()
    this.state = {
      update: false
    }
    this.handleHome = this.handleHome.bind(this)
    this.handleUsers = this.handleUsers.bind(this)
  }
  updateEuUserData = () => {
    this.setState({ update: true })
  }

  handleHome () {
    localStorage.removeItem('euUserData')
    localStorage.removeItem('idProofData')
    hashHistory.push('/admin/home')
    event.preventDefault()
  }

  handleUsers () {
    localStorage.removeItem('euUserData')
    localStorage.removeItem('idProofData')
    hashHistory.push('/admin/eu-users')
    event.preventDefault()
  }
  render () {
    return (
      <div style={{ fontFamily: 'Lato' }}>
        <div className='main-content eu-profile-container ' id='panel'>
          <DrawerWithHeader update={this.state.update} />
          {/* ---------- Header Starts ------------- */}
          <div className='header bg-primary pb-0'>
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    <h6 className='h2 text-white d-inline-block mb-0'>{t`lanADEUTitleAdminEUUsers`}</h6>
                    <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item active'><a onClick={this.handleUsers} >{t`lanADEUTitleUsersList`}</a></li>
                        <li className='breadcrumb-item active' aria-current='page'>{t`lanADEUTitleUserProfile`}</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ADEUUserProfileComponent />
          <FooterComponent />
        </div>
      </div>
    )
  }
}
export default ADEUUserProfile
