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
import Switch from 'react-switch'
import 'react-drawer/lib/react-drawer.css'

import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import SPPropertyInfoPriceCreate from '../../../containers/serviceproviders/PropertyInfoPrices/SPPropertyInfoPriceCreate'
import SPAmenitiesCreateComponent from '../../../components/serviceproviders/aminities/SPAmenitiesCreateComponent'
import SPServicesCreateComponent from '../../../components/serviceproviders/Services/SPServicesCreateComponent'
import GuestRulesCreateComponent from '../../../components/serviceproviders/guestRules/GuestRulesCreateComponent'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPPropertyInfoCreateComponent extends React.Component {
  constructor (props) {
    super(props)
    let data = props.propertyInfoObj
    this.state = {
      propertyObj: props.propertyObj ? props.propertyObj : {},
      createProperty: props.createProperty ? props.createProperty : '',
      propertyTitle: props.createProperty === 'create' ? props.propertyTitle : props.propertyObj.propertyTitle,
      propertyType: props.createProperty === 'create' ? props.propertyType : props.propertyObj.propertyType,
      rentType: data && data.rentType ? data.rentType : 'Private Room',
      roomType: data && data.roomType ? data.roomType : 'Single Bed Room',
      roomCategory: data && data.roomCategory ? data.roomCategory : 'Economy',
      roomName: data && data.roomsName ? data.roomsName : '',
      adultCapacity: data && data.membersCapacity ? data.membersCapacity : '3',
      childCapacity: data && data.childsCapacity ? data.childsCapacity : '1',
      totalRoomsCount: data && data.roomsCount ? data.roomsCount : '',
      activeRooms: data && data.activeRoomsCount ? data.activeRoomsCount : '',
      onHoldRooms: data && data.onHoldRoomsCount ? data.onHoldRoomsCount : '',
      singleBeds: data && data.singleBedsCount ? data.singleBedsCount : '',
      doubleBeds: data && data.doubleBedsCount ? data.doubleBedsCount : '',
      bathRooms: data && data.privateBathRooms ? data.privateBathRooms : '',
      acs: data && data.acsCount ? data.acsCount : '',
      kitchens: data && data.kitchensCount ? data.kitchensCount : '',
      halls: data && data.hallsCount ? data.hallsCount : '',
      status: data && data.status ? data.status : true,
      defaultPriority: props.createProperty === 'create' ? 'true' : 'false',
      priceObj: data && data.pricing ? data.pricing : {},
      amenityObj: data && data.amenities ? data.amenities : props.amenitiesObj ? props.amenitiesObj : [],
      availableAmenities: data && data.amenitiesAvailable ? data.amenitiesAvailable : [],
      serviceObj: data && data.paidServices ? data.paidServices : [],
      availableServices: data && data.servicesAvailable ? data.servicesAvailable : [],
      guestRulesObj: data && data.guestRules ? data.guestRules : [],
      availableGuestRules: data && data.guestRulesAvaliable ? data.guestRulesAvaliable : [],
      guestRuleNote: data && data.guestRuleNote ? data.guestRuleNote : '',
      errorMessage: '',
      isSavedAmenities: false,
      isCreatedAmenities: false,
      isSavedServices: false,
      isCreatedServices: false,
      isCreatedGuestRules: false
    }
    this.handleCreatePropertyInfo = this.handleCreatePropertyInfo.bind(this)
    this.commonFuntion = this.commonFuntion.bind(this)
  }
  handleMobileNumKeys (event) {
    if ((event.charCode >= 32 && event.charCode < 48 && event.charCode !== 40 &&
      event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
      (event.charCode > 57 && event.charCode < 127)) {
      event.preventDefault()
    }
  }
  commonFuntion (arrayData, availableData, data, type) {
    this.setState({ errorMessage: '' })
    switch (type) {
      case 'price':
        this.setState({ priceObj: arrayData })
        break
      case 'amenities':
        this.setState({ amenityObj: arrayData, availableAmenities: availableData, isCreatedAmenities: true })
        break
      case 'services':
        this.setState({ serviceObj: arrayData, availableServices: availableData, isCreatedServices: true })
        break
      case 'guestRules':
        this.setState({ guestRulesObj: arrayData, availableGuestRules: availableData, guestRuleNote: data, isCreatedGuestRules: true })
        break
    }
  }
  handleCreatePropertyInfo () {
    this.setState({ errorMessage: '' })
    if (!this.state.rentType) {
      this.setState({ errorMessage: t`lanSPLabelErrorPropertyInfoRentType` })
    } else if (!this.state.roomType) {
      this.setState({ errorMessage: t`lanSPLabelErrorPropertyInfoRoomType` })
    } else if (!this.state.roomCategory) {
      this.setState({ errorMessage: t`lanSPLabelErrorPropertyInfoRoomCategory` })
    } else if (!this.state.adultCapacity || parseInt(this.state.adultCapacity) === 0) {
      this.setState({ errorMessage: t`lanSPLabelErrorPropertyInfoAdultCapacity` })
    } else if (!this.state.childCapacity || parseInt(this.state.childCapacity) === 0) {
      this.setState({ errorMessage: t`lanSPLabelErrorPropertyInfoChildCapacity` })
    } else if (!this.state.totalRoomsCount || parseInt(this.state.totalRoomsCount) === 0) {
      this.setState({ errorMessage: t`lanSPLabelErrorPropertyInfoTotalRooms` })
    } else if (!this.state.activeRooms || parseInt(this.state.activeRooms) === 0) {
      this.setState({ errorMessage: t`lanSPLabelErrorPropertyInfoActiveRooms` })
    } else if (parseInt(this.state.totalRoomsCount) < parseInt(this.state.activeRooms)) {
      this.setState({ errorMessage: t`lanSPLabelErrorPropertyInfoTotalRoomsCondition` })
    } else if (parseInt(this.state.totalRoomsCount) < parseInt(this.state.onHoldRooms) + parseInt(this.state.activeRooms)) {
      this.setState({ errorMessage: t`lanSPLabelErrorPropertyInfoActiveRoomsCondition` })
    } else if (!this.state.singleBeds && !this.state.doubleBeds) {
      this.setState({ errorMessage: t`lanSPLabelErrorPropertyInfoSingleBeds` })
    } else if (!this.state.priceObj.basePrice) {
      this.setState({ errorMessage: t`lanSPLabelErrorPropertyInfoAddPrice` })
    } else if (!this.state.isCreatedAmenities) {
      this.setState({ errorMessage: t`lanSPLabelErrorPropertyInfoAddAmenities` })
    } else if (!this.state.isSavedAmenities) {
      this.setState({ errorMessage: 'please save changes in Amenities' })
    } else if (!this.state.isCreatedServices) {
      this.setState({ errorMessage: t`lanSPLabelErrorPropertyInfoAddServices` })
    } else if (!this.state.isSavedServices) {
      this.setState({ errorMessage: 'please save changes in Services' })
    } else if (!this.state.isCreatedGuestRules) {
      this.setState({ errorMessage: t`lanSPLabelErrorPropertyInfoAddGuestRules` })
    } else {
      let infoObj = {
        propertyId: this.state.createproperty === 'create' ? '' : this.state.propertyObj._id,
        propertyTitle: this.state.propertyTitle,
        propertyType: this.state.propertyType,
        rentType: this.state.rentType,
        roomCategory: this.state.roomCategory,
        roomType: this.state.roomType,
        membersCapacity: this.state.adultCapacity,
        childsCapacity: this.state.childCapacity,
        roomsName: this.state.roomName,
        roomsCount: this.state.totalRoomsCount,
        activeRoomsCount: this.state.activeRooms,
        onHoldRoomsCount: this.state.onHoldRooms,
        status: this.state.status ? 'Active' : 'Inactive',
        isDefault: this.state.createproperty === 'create' ? true : this.state.defaultPriority,
        inactiveRoomsCount: this.state.totalRoomsCount - this.state.activeRooms - (this.state.onHoldRooms ? this.state.onHoldRooms : 0),
        singleBedsCount: this.state.singleBeds,
        doubleBedsCount: this.state.doubleBeds,
        privateBathRooms: this.state.bathRooms,
        kitchensCount: this.state.kitchens,
        hallsCount: this.state.halls,
        acsCount: this.state.acs,
        pricing: this.state.priceObj,
        spLocationId: this.state.createproperty === 'create' ? '' : this.state.propertyObj.spLocationId,
        spLocationObj: this.state.createproperty === 'create' ? {} : this.state.propertyObj.spLocationObj,
        amenities: this.state.amenityObj,
        amenitiesAvailable: this.state.availableAmenities,
        guestRules: this.state.guestRulesObj,
        guestRulesAvaliable: this.state.availableGuestRules,
        servicesAvailable: this.state.availableServices,
        paidServices: this.state.serviceObj,
        guestRuleNote: this.state.guestRuleNote,
        nearestAreas: this.state.propertyObj.nearestAreas
      }
      if (this.state.createProperty === 'create') {
        this.props.infoFunction(infoObj, true)
      } else {
        let obj = {
          url: config.baseUrl + config.postSPPropertyInfoCreateAPI,
          body: infoObj
        }
        let _this = this
        APICallManager.postCall(obj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            hashHistory.push('/host/property-view')
          } else {
            _this.setState({ errorMessage: t`lanSPLabelErrorInfoCreateFailed` })
          }
        })
      }
    }
  }
  handleBack = () => {
    this.props.infoFunction({}, false)
  }
  handleAmenitiesChange = (value) => {
    this.setState({ isSavedAmenities: value })
  }
  handleServicesChange = (value) => {
    this.setState({ isSavedServices: value })
  }
  handleGuestRulesChange = (value) => {
    this.setState({ isCreatedGuestRules: value })
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        <div className='container-fluid mt--6'>
          <div>
            <div className='card Create-Propety-Info'>
              <div className='sp-hotels'>
                <div className='card mb-0'>
                  {/* Card body */}
                  <div className='card-body p-2'>
                    <div className='row align-items-center'>
                      <div className='col-auto'>
                        {/* Avatar */}
                        <a className='rounded-circle'>
                          <img src={this.state.createProperty === 'create' ? require('../images/room1.jpg') : this.state.propertyObj && this.state.propertyObj.imagePath
                            ? config.baseUrl + this.state.propertyObj.imagePath : require('../images/room1.jpg')} className='avatar rounded-circle' />
                        </a>
                      </div>
                      <div className='col ml--2'>
                        <h4 className='mb-2 card-title'>{this.state.propertyTitle}</h4>
                        <p className='text-sm mb-0'>{this.state.propertyType} - {t`lanSPTitleCreatePropertyInfo`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='card-header'>
                <h3 className='mb-0'>{t`lanSPTitlePropertyInfo`}</h3>
              </div>
              <div className='card-body'>
                <div className='accordion' id='accordionExample'>
                  <div className='card'>
                    <div className='card-header' id='headingOne' data-toggle='collapse' data-target='#collapseOne' aria-expanded='true' aria-controls='collapseOne'>
                      <h5 className='mb-0'>{t`lanSPTitleCreatePropertyInfo`}</h5>
                    </div>
                    <div id='collapseOne' className='collapse show' aria-labelledby='headingOne' data-parent='#accordionExample'>
                      <div className='card-body'>
                        <form>
                          <div className='row'>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelRentType`}<span className='require'>*</span></label>
                                <select className='form-control' id='exampleFormControlSelect1' value={this.state.rentType} onChange={(event) => this.setState({ rentType: event.target.value, errorMessage: '' })}>
                                  <option value=''>Select Rent Type</option>
                                  <option value='Sharing Room'>Sharing Room</option>
                                  <option value='Private Room'>Private Room</option>
                                  <option value='Entire Space'>Entire Space</option>
                                </select>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelRoomType`}<span className='require'>*</span></label>
                                <select className='form-control' id='exampleFormControlSelect1' value={this.state.roomType} onChange={(event) => this.setState({ roomType: event.target.value, errorMessage: '' })}>
                                  <option value=''>Select Room Type</option>
                                  <option value='Single Bed Room'>Single Bed Room</option>
                                  <option value='Double Bed Room'>Double Bed Room</option>
                                  <option value='1 BHK'>1 BHK</option>
                                  <option value='2 BHK'>2 BHK</option>
                                  <option value='3 BHK'>3 BHK</option>
                                  <option value='Full Apartment'>Full Apartment</option>
                                  <option value='Loft'>Loft</option>
                                  <option value='Cabin'>Cabin</option>
                                  <option value='Villa'>Villa</option>
                                  <option value='Castle'>Castle</option>
                                  <option value='Dorm'>Dorm</option>
                                </select>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelRoomCategory`}<span className='require'>*</span></label>
                                <select className='form-control' id='exampleFormControlSelect1' value={this.state.roomCategory}
                                  onChange={(event) => this.setState({ roomCategory: event.target.value, errorMessage: '' })}>
                                  <option value=''>Select Room Category</option>
                                  <option value='Economy'>Economy</option>
                                  <option value='Deluxe'>Deluxe</option>
                                  <option value='Luxury'>Luxury</option>
                                </select>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelRoomName`}</label>
                                <input type='text' className='form-control' id='example3cols2Input' value={this.state.roomName}
                                  onChange={(event) => this.setState({ roomName: event.target.value, errorMessage: '' })} />
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label' >{t`lanSPLabelAdultCapacity`}<span className='require'>*</span></label>
                                <input type='text' className='form-control' id='example3cols3Input' value={this.state.adultCapacity}
                                  onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ adultCapacity: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelChildCapacity`}<span className='require'>*</span></label>
                                <input type='text' className='form-control' id='example3cols3Input' value={this.state.childCapacity}
                                  onChange={(event) => this.setState({ childCapacity: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label' >{t`lanSPLabelRoomsCount`}<span className='require'>*</span></label>
                                <input type='text' className='form-control' id='example3cols3Input' value={this.state.totalRoomsCount}
                                  onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ totalRoomsCount: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label' >{t`lanSPLabelActiveRooms`}<span className='require'>*</span></label>
                                <input type='text' className='form-control' id='example3cols3Input' value={this.state.activeRooms}
                                  onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ activeRooms: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelOnHoldRooms`}</label>
                                <input type='text' className='form-control' id='example3cols3Input' value={this.state.onHoldRooms}
                                  onChange={(event) => this.setState({ onHoldRooms: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelSingleBeds`}</label>
                                <input type='text' className='form-control' id='example3cols3Input' value={this.state.singleBeds}
                                  onChange={(event) => this.setState({ singleBeds: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelDoubleBeds`}</label>
                                <input type='text' className='form-control' id='example3cols3Input' value={this.state.doubleBeds}
                                  onChange={(event) => this.setState({ doubleBeds: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelShowerAndBathtub`}</label>
                                <input type='text' className='form-control' id='example3cols3Input' value={this.state.bathRooms}
                                  onChange={(event) => this.setState({ bathRooms: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelPropertyAcs`}</label>
                                <input type='text' className='form-control' id='example3cols3Input' value={this.state.acs}
                                  onChange={(event) => this.setState({ acs: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelPropertyKitchens`}</label>
                                <input type='text' className='form-control' id='example3cols3Input' value={this.state.kitchens}
                                  onChange={(event) => this.setState({ kitchens: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelPropertyHalls`}</label>
                                <input type='text' className='form-control' id='example3cols3Input' value={this.state.halls}
                                  onChange={(event) => this.setState({ halls: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <label className='form-control-label'>{t`lanCommonLabelStatus`}</label>
                              <div className='form-group'>
                                <Switch
                                  className='react-switch'
                                  onChange={(status) => this.setState({ status: status, errorMessage: '' })}
                                  checked={this.state.status}
                                  aria-labelledby='neat-label'
                                />
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            {/* <div className='col-md-4'>
                                <label className='form-control-label'>Dafault Priority</label>
                                <div className='custom-control custom-radio'>
                                  <input name='custom-radio-1' className='custom-control-input' id='customRadio5' type='radio' />
                                  <label className='custom-control-label'>True</label>
                                </div>
                              </div> */}
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelDefaultPriority`}</label>
                                <select className='form-control' id='exampleFormControlSelect1' value={this.state.defaultPriority}
                                  disabled={this.state.createProperty === 'create'}
                                  onChange={(event) => this.setState({ defaultPriority: event.target.value, errorMessage: '' })}>
                                  <option value='true'>true</option>
                                  <option value='false'>false</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className='card'>
                    <div className='card-header' id='headingTwo' data-toggle='collapse' data-target='#collapseTwo' aria-expanded='false' aria-controls='collapseTwo'>
                      <h5 className='mb-0'>{t`lanSPLabelAddPrice`}</h5>
                    </div>
                    <div id='collapseTwo' className='collapse' aria-labelledby='headingTwo' data-parent='#accordionExample'>
                      <div className='card-body'>
                        <SPPropertyInfoPriceCreate commonFuntion={this.commonFuntion} priceObj={this.state.priceObj} />
                      </div>
                    </div>
                  </div>
                  <div className='card'>
                    <div className='card-header' id='headingThree' data-toggle='collapse' data-target='#collapseThree' aria-expanded='false' aria-controls='collapseThree'>
                      <h5 className='mb-0'>{t`lanSPTitleAmenities`}</h5>
                    </div>
                    <div id='collapseThree' className='collapse' aria-labelledby='headingThree' data-parent='#accordionExample'>
                      <div className='card-body'>
                        <SPAmenitiesCreateComponent handleAmenitiesChange={this.handleAmenitiesChange} commonFuntion={this.commonFuntion}
                          amenityObj={this.state.amenityObj} availableAmenities={this.state.availableAmenities} />
                      </div>
                    </div>
                  </div>
                  <div className='card'>
                    <div className='card-header' id='headingFour' data-toggle='collapse' data-target='#collapseFour' aria-expanded='false' aria-controls='collapseFour'>
                      <h5 className='mb-0'>{t`lanSPTitleServices`}</h5>
                    </div>
                    <div id='collapseFour' className='collapse' aria-labelledby='headingFour' data-parent='#accordionExample'>
                      <div className='card-body'>
                        <SPServicesCreateComponent handleServicesChange={this.handleServicesChange} commonFuntion={this.commonFuntion}
                          serviceObj={this.state.serviceObj} availableServices={this.state.availableServices} />
                      </div>
                    </div>
                  </div>
                  <div className='card'>
                    <div className='card-header' id='headingFive' data-toggle='collapse' data-target='#collapseFive' aria-expanded='false' aria-controls='collapseFive'>
                      <h5 className='mb-0'>{t`lanSPTitleGuestRules`}</h5>
                    </div>
                    <div id='collapseFive' className='collapse' aria-labelledby='headingFive' data-parent='#accordionExample'>
                      <div className='card-body'>
                        <GuestRulesCreateComponent handleGuestRulesChange={this.handleGuestRulesChange} commonFuntion={this.commonFuntion} guestRulesObj={this.state.guestRulesObj}
                          availableGuestRules={this.state.availableGuestRules} guestRuleNote={this.state.guestRuleNote} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='container text-center'>
                  <label style={{ color: 'red' }}>{this.state.errorMessage}</label>
                </div>
                <div className='container text-center'>
                  <button className='btn btn-primary' onClick={this.handleCreatePropertyInfo} type='button'>{t`lanCommonButtonCreate`}</button>
                  {this.state.createProperty === 'create' ? <button className='btn btn-danger' onClick={this.handleBack} type='button'>{t`lanCommonButtonBack`}</button> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
SPPropertyInfoCreateComponent.propTypes = {
  propertyObj: PropTypes.any,
  createProperty: PropTypes.any,
  infoFunction: PropTypes.any,
  propertyTitle: PropTypes.any,
  propertyType: PropTypes.any,
  propertyInfoObj: PropTypes.any,
  amenitiesObj: PropTypes.any
}

export default SPPropertyInfoCreateComponent
