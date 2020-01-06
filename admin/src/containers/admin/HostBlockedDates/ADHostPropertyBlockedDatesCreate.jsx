/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import PropTypes from 'prop-types'
import { hashHistory } from 'react-router'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
import ADHostPropertyBlockedDatesCreateComponent from '../../../components/admin/HostProperties/BlockedDates/ADHostPropertyBlockedDatesCreateComponent'
import 'react-drawer/lib/react-drawer.css'

class ADHostPropertyBlockedDatesCreate extends React.Component {
  constructor () {
    super()
    this.state = {
      propertyObj: JSON.parse(localStorage.getItem('propertyObj'))
    }
    this.handleBack = this.handleBack.bind(this)
    this.handleBackPropList = this.handleBackPropList.bind(this)
    this.handleBackToHome = this.handleBackToHome.bind(this)
  }
  handleBackToHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleBack (event) {
    hashHistory.push('/admin/host/properties')
    localStorage.setItem('PropertiesShow', 'View')
    event.preventDefault()
  }
  handleBackPropList () {
    hashHistory.push('/admin/host/properties')
    localStorage.setItem('PropertiesShow', 'List')
    event.preventDefault()
  }
  render () {
    return (
      <div>
        <div className='main-content' id='panel'>
          {/* ------- Navbar --------- */}
          {this.props.createProperty === 'create' ? null : <DrawerWithHeader /> }
          <div className='header bg-primary pb-6'>
            <div className='container'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-8 col-7'>
                    <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleBackToHome} ><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item'><a onClick={this.handleBackPropList} >{t`lanADTitleHostsPropertiesList`}</a></li>
                        <li className='breadcrumb-item'><a onClick={this.handleBack} >{ t`lanSPTitlePropertyView` }</a></li>
                        <li className='breadcrumb-item active' aria-current='page'>{t`lanSPTitleBlockedDatesView`}</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ADHostPropertyBlockedDatesCreateComponent propertyObj={this.state.propertyObj} createProperty={this.props.createProperty}
            commonFunction={this.props.commonFunction} blockedDatesObj={this.props.blockedDatesObj} />
        </div>
        {this.props.createProperty === 'create' ? null : <FooterComponent /> }
      </div>
    )
  }
}
ADHostPropertyBlockedDatesCreate.propTypes = {
  commonFunction: PropTypes.any,
  createProperty: PropTypes.any,
  blockedDatesObj: PropTypes.any
}

export default ADHostPropertyBlockedDatesCreate
