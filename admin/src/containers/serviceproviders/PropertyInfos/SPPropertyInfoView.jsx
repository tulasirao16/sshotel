/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import DrawerWithHeader from '../../../components/serviceproviders/Drawer/DrawerComponent'
import FooterComponent from '../../../components/serviceproviders/FooterCompnt/Footer'
import SPPropertyInfoViewComponent from '../../../components/serviceproviders/PropertyInfo/SPPropertyInfoViewComponent'
class SPPropertyInfoView extends React.Component {
  constructor () {
    super()
    this.state = {
      propertyInfoViewObj: JSON.parse(localStorage.getItem('propertyInfoViewObj')),
      propertyObj: JSON.parse(localStorage.getItem('propertyObj'))
    }
    this.handlePropertyInfoCreate = this.handlePropertyInfoCreate.bind(this)
    this.handleBackToHome = this.handleBackToHome.bind(this)
    this.handleBackPropList = this.handleBackPropList.bind(this)
    this.handleBack = this.handleBack.bind(this)
  }
  handlePropertyInfoCreate () {
    localStorage.setItem('propertyObj', JSON.stringify(this.state.propertyObj))
    hashHistory.push('/host/property-info/create')
    event.preventDefault()
  }
  handleBack (event) {
    hashHistory.push('/host/property-view')
    event.preventDefault()
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
                  <nav aria-label='breadcrumb' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleBackToHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleBackPropList} >{t`lanSPTitlePropertiesList`}</a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleBack} >{ t`lanSPTitlePropertyView` }</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>{t`lanSPTitlePropertyInfo`} → {t`lanSPTitlePropertyInfoView`}</li>
                    </ol>
                  </nav>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  <a className='btn btn-neutral' onClick={this.handlePropertyInfoCreate}><i className='fas fa-plus' /> {t`lanSPTitleCreatePropertyInfo`}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <SPPropertyInfoViewComponent propertyInfoViewObj={this.state.propertyInfoViewObj} />
        </div>
        <FooterComponent />
      </div>
    )
  }
}

export default SPPropertyInfoView
