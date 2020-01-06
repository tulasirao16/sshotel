/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import { hashHistory } from 'react-router'
import PropTypes from 'prop-types'
import 'react-drawer/lib/react-drawer.css'
import DrawerWithHeader from '../../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../../components/admin/footer/Footer'
import ADHostsPropertyInfoCreateComponent from '../../../../components/admin/HostProperties/HostPropertyInfoCreate/ADHostsPropertyInfoCreateComponent'
// import ADHostsPropertyInfoCreateComponent from '../../../../components/admin/HostProperties/HostsPropertyCreate/ADHostsPropertyCreateComponent'

class ADHostsPropertyInfoCreateScreen extends React.Component {
  constructor () {
    super()
    this.state = {
      propertyObj: JSON.parse(localStorage.getItem('propertyObj'))
    }
    this.handleBack = this.handleBack.bind(this)
    this.handleBackToHome = this.handleBackToHome.bind(this)
    this.handleBackPropList = this.handleBackPropList.bind(this)
    this.handlePropertyView = this.handlePropertyView.bind(this)
  }
  handleBack (event) {
    hashHistory.push('/admin/host/properties')
    localStorage.setItem('PropertiesShow', 'View')
    event.preventDefault()
  }
  handleBackToHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }

  handleBackPropList () {
    hashHistory.push('/admin/host/properties')
    localStorage.setItem('PropertiesShow', 'List')
    event.preventDefault()
  }

  handlePropertyView () {
    hashHistory.push('/admin/host/property-info/create')
    event.preventDefault()
  }

  render () {
    return (
      <div className='main-content' id='panel'>
        {this.props.createProperty === 'create' ? null
          : <div>
            <DrawerWithHeader />
            <div className='header bg-primary pb-6'>
              <div className='container-fluid'>
                <div className='header-body'>
                  <div className='row align-items-center py-4'>
                    <div className='col-lg-6 col-7'>
                      <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                        <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                          <li className='breadcrumb-item'><a onClick={this.handleBackToHome}><i className='fas fa-home' /></a></li>
                          <li className='breadcrumb-item'><a onClick={this.handleBackPropList} >{t`lanSPTitlePropertiesList`}</a></li>
                          <li className='breadcrumb-item'><a onClick={this.handleBack} >{ t`lanSPTitlePropertyView` }</a></li>
                          <li className='breadcrumb-item active' aria-current='page'><a onClick={this.handlePropertyView} >{t`lanSPTitlePropertyInfo`}</a>→ {t`lanSPTitleCreatePropertyInfo`}</li>
                        </ol>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        <div>
          <ADHostsPropertyInfoCreateComponent amenitiesObj={this.props.amenitiesObj} propertyObj={this.state.propertyObj} createProperty={this.props.createProperty}
            infoFunction={this.props.infoFunction} propertyTitle={this.props.propertyTitle} propertyType={this.props.propertyType} propertyInfoObj={this.props.propertyInfoObj} />
        </div>
        {this.props.createProperty === 'create' ? null
          : <FooterComponent />}
      </div>
    )
  }
}
ADHostsPropertyInfoCreateScreen.propTypes = {
  createProperty: PropTypes.any,
  infoFunction: PropTypes.any,
  propertyTitle: PropTypes.any,
  propertyType: PropTypes.any,
  propertyInfoObj: PropTypes.any,
  amenitiesObj: PropTypes.any
}
export default ADHostsPropertyInfoCreateScreen
