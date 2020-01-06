/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import { t } from 'ttag'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'

import config from '../../../../../public/config.json'
import ADHostsPropertyInfoEditComponent from './ADHostsPropertyInfoEditComponent'
import ADHostsPropertyInfoPriceViewComponent from './ADHostsPropertyInfoPriceViewComponent'
import ADHostsAmenitiesListComponent from './ADHostsAmenitiesListComponent'
import ADHostsServicesListComponent from './ADHostsServicesListComponent'
import ADHostsGuestRulesListComponent from './ADHostsGuestRulesListComponent'
import '../../css/all.min.css'
import '../../css/argon.min.css'
import '../../css/nucleo.css'

class ADHostsPropertyInfoComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      propertyInfoViewObj: this.props.propertyInfoViewObj,
      disableValue: true,
      propertyAction: 'View',
      priceAction: false,
      infoAction: false,
      errorMessage: ''
    }
    this.handleBack = this.handleBack.bind(this)
  }

  handleBack () {
    hashHistory.push('/admin/host/properties')
    localStorage.setItem('PropertiesShow', 'View')
    event.preventDefault()
  }
  commonFunction = (action, type) => {
    if (type === 'infoEdit') {
      this.setState({ infoAction: action })
    } else {
      this.setState({ priceAction: action })
    }
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        <div className='container-fluid mt--6'>
          <div className='row justify-content-center'>
            <div className='col-lg-12 col-md-12'>
              <div className='card border-0 mb-0'>
                <div className='sp-hotels'>
                  <div className='card mb-0'>
                    {/* Card body */}
                    <div className='card-body p-2'>
                      <div className='row align-items-center'>
                        <div className='col-auto'>
                          {/* Avatar */}
                          <a className='rounded-circle'>
                            <img src={this.state.propertyInfoViewObj && this.state.propertyInfoViewObj.propertyId.imagePath ? config.baseUrl + this.state.propertyInfoViewObj.propertyId.imagePath
                              : require('../../images/room1.jpg')} className='avatar rounded-circle' />
                          </a>
                        </div>
                        <div className='col ml--2'>
                          <h4 className='mb-0 card-title'>{this.state.propertyInfoViewObj ? this.state.propertyInfoViewObj.propertyTitle : ''}</h4>
                          <p className='text-sm mb-0 text-white'>{this.state.propertyInfoViewObj ? this.state.propertyInfoViewObj.spLocationObj.area : ''}</p>
                          <p className='text-sm mb-0 text-white'>{this.state.propertyInfoViewObj ? this.state.propertyInfoViewObj.propertyType : ''} - {t`lanSPTitlePropertyInfoView`}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card-header'>
                  {/* <h3 className='mb-0'>{t`lanSPTitlePropertyInfoView`}</h3> */}
                </div>
                <div className='card-body property-info-View'>
                  <div className='accordion' id='accordionExample'>
                    <div className='card'>
                      <div className='card-header' id='headingOne' data-toggle='collapse' data-target='#collapseOne' aria-expanded='true' aria-controls='collapseOne'>
                        <h6 className='mb-0'>{this.state.infoAction === false ? t`lanSPTitlePropertyInfoView` : t`lanSPTitlePropertyInfoEdit`}</h6>
                      </div>
                      <div id='collapseOne' className='collapse show' aria-labelledby='headingOne' data-parent='#accordionExample'>
                        <ADHostsPropertyInfoEditComponent propertyInfoViewObj={this.state.propertyInfoViewObj} propertyAction={this.state.propertyAction} commonFunction={this.commonFunction} />
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-header' id='headingTwo' data-toggle='collapse' data-target='#collapseTwo' aria-expanded='false' aria-controls='collapseTwo'>
                        <h6 className='mb-0'>{this.state.priceAction === false ? t`lanSPTitlePriceDetails` : t`lanSPTitlePriceEdit`}</h6>
                      </div>
                      <div id='collapseTwo' className='collapse' aria-labelledby='headingTwo' data-parent='#accordionExample'>
                        <ADHostsPropertyInfoPriceViewComponent propertyInfoPriceObj={this.state.propertyInfoViewObj} commonFunction={this.commonFunction} />
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-header' id='headingThree' data-toggle='collapse' data-target='#collapseThree' aria-expanded='false' aria-controls='collapseThree'>
                        <h6 className='mb-0'>{t`lanSPTitleAmenities`}</h6>
                      </div>
                      <div id='collapseThree' className='collapse' aria-labelledby='headingThree' data-parent='#accordionExample'>
                        <ADHostsAmenitiesListComponent propertyInfoId={this.state.propertyInfoViewObj._id} propertyId={this.state.propertyInfoViewObj.propertyId} />
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-header' id='headingFour' data-toggle='collapse' data-target='#collapseFour' aria-expanded='false' aria-controls='collapseFour'>
                        <h6 className='mb-0'>{t`lanSPTitleServices`}</h6>
                      </div>
                      <div id='collapseFour' className='collapse' aria-labelledby='headingFour' data-parent='#accordionExample'>
                        <ADHostsServicesListComponent propertyInfoId={this.state.propertyInfoViewObj._id} propertyId={this.state.propertyInfoViewObj.propertyId} />
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-header' id='headingFive' data-toggle='collapse' data-target='#collapseFive' aria-expanded='false' aria-controls='collapseFive'>
                        <h6 className='mb-0'>{t`lanSPTitleGuestRules`}</h6>
                      </div>
                      <div id='collapseFive' className='collapse' aria-labelledby='headingFive' data-parent='#accordionExample'>
                        <ADHostsGuestRulesListComponent propertyInfoId={this.state.propertyInfoViewObj._id} propertyId={this.state.propertyInfoViewObj.propertyId} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-sm-12 text-center mt-4'>
                  <button className='btn btn-primary' type='button' onClick={this.handleBack}>{t`lanCommonButtonBack`}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ADHostsPropertyInfoComponent.propTypes = {
  propertyInfoViewObj: PropTypes.any
}

export default ADHostsPropertyInfoComponent
