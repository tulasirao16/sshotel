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
import DrawerWithHeader from '../../../components/serviceproviders/Drawer/DrawerComponent'
import FooterComponent from '../../../components/serviceproviders/FooterCompnt/Footer'
import SPBlockedDatesCreateComponent from '../../../components/serviceproviders/blockedDates/SPBlockedDatesCreateComponent'
import 'react-drawer/lib/react-drawer.css'

class SPBlockedDatesCreate extends React.Component {
  constructor () {
    super()
    this.state = {
      propertyObj: JSON.parse(localStorage.getItem('propertyObj'))
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
          {this.props.createProperty === 'create' ? null : <DrawerWithHeader /> }
          <div className='header bg-primary pb-6'>
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-8 col-7'>
                    <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item'><a onClick={this.handleBackPropList} >{t`lanSPTitlePropertiesList`}</a></li>
                        <li className='breadcrumb-item'><a onClick={this.handleBack} >{ t`lanSPTitlePropertyView` }</a></li>
                        <li className='breadcrumb-item active' aria-current='page'>{t`lanSPButtonCreateBlockedDates`}</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
              {/* <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPSubTitleBlockedDates`}</h6>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <SPBlockedDatesCreateComponent propertyObj={this.state.propertyObj} createProperty={this.props.createProperty} commonFunction={this.props.commonFunction} blockedDatesObj={this.props.blockedDatesObj} />
        </div>
        {this.props.createProperty === 'create' ? null : <FooterComponent /> }
      </div>
    )
  }
}
SPBlockedDatesCreate.propTypes = {
  commonFunction: PropTypes.any,
  createProperty: PropTypes.any,
  blockedDatesObj: PropTypes.any
}
export default SPBlockedDatesCreate
