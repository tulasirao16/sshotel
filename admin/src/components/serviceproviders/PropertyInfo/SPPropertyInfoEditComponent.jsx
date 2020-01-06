/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import PropTypes from 'prop-types'
import Switch from 'react-switch'
import 'react-drawer/lib/react-drawer.css'

import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

export default class SPPropertyInfoEditComponent extends React.Component {
  constructor (props) {
    super(props)
    let data = this.props.propertyInfoViewObj
    this.state = {
      propertyInfoViewObj: data,
      propertyId: data.propertyId._id,
      propertyInfoId: data._id,
      rentType: data && data.rentType ? data.rentType : '',
      roomType: data && data.roomType ? data.roomType : '',
      roomCategory: data && data.roomCategory ? data.roomCategory : '',
      roomName: data && data.roomsName ? data.roomsName : '',
      adultCapacity: data && data.membersCapacity ? data.membersCapacity : '',
      childCapacity: data && data.childsCapacity ? data.childsCapacity : '',
      totalRoomsCount: data && data.roomsCount ? data.roomsCount : '',
      activeRooms: data && data.activeRoomsCount ? data.activeRoomsCount : '',
      inactiveRooms: data && data.inactiveRoomsCount ? data.inactiveRoomsCount : '',
      onHoldRooms: data && data.onHoldRoomsCount ? data.onHoldRoomsCount : '',
      singleBeds: data && data.singleBedsCount ? data.singleBedsCount : '',
      doubleBeds: data && data.doubleBedsCount ? data.doubleBedsCount : '',
      bathRooms: data && data.privateBathRooms ? data.privateBathRooms : '',
      acs: data && data.acsCount ? data.acsCount : '',
      kitchens: data && data.kitchensCount ? data.kitchensCount : '',
      halls: data && data.hallsCount ? data.hallsCount : '',
      status: data && data.status ? data.status : 'Active',
      defaultPriority: data && data.isDefault ? data.isDefault : false,
      oldDefaultStatus: data && data.isDefault ? data.isDefault : false,

      adultDummyCapacity: data ? data.membersCapacity : '',
      roomsDummyCount: data ? data.roomsCount : '',
      activeDummyRooms: data ? data.activeRoomsCount : '',
      onHoldDummyRooms: data ? data.onHoldRoomsCount : '',
      singleDummyBeds: data && data.singleBedsCount ? data.singleBedsCount : '',
      doubleDummyBeds: data && data.doubleBedsCount ? data.doubleBedsCount : '',
      bathRoomsDummy: data && data.privateBathRooms ? data.privateBathRooms : '',
      hallsDummy: data && data.hallsCount ? data.hallsCount : '',
      numACsDummy: data && data.acsCount ? data.acsCount : '',
      kitchensDummy: data && data.kitchensCount ? data.kitchensCount : '',
      disableValue: true,
      propertyAction: this.props.propertyAction,
      reload: false
    }
    this.handleInfoUpdate = this.handleInfoUpdate.bind(this)
  }
  handleMobileNumKeys (event) {
    if ((event.charCode >= 32 && event.charCode < 48 && event.charCode !== 40 &&
      event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
      (event.charCode > 57 && event.charCode < 127)) {
      event.preventDefault()
    }
  }
  handleUpdateAction = () => {
    this.setState({ disableValue: !this.state.disableValue, propertyAction: 'Edit' })
    this.props.commonFunction(true, 'infoEdit')
  }
  handleBack = () => {
    this.setState({ disableValue: true, propertyAction: 'View' })
    this.props.commonFunction(false, 'infoEdit')
  }
  handleInfoUpdate () {
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
    } else {
      let infoObj = {
        rentType: this.state.rentType,
        roomCategory: this.state.roomCategory,
        roomType: this.state.roomType,
        membersCapacity: this.state.adultCapacity,
        childsCapacity: this.state.childCapacity,
        roomsName: this.state.roomName,
        roomsCount: this.state.totalRoomsCount,
        activeRoomsCount: this.state.activeRooms,
        onHoldRoomsCount: this.state.onHoldRooms,
        status: this.state.status,
        isDefault: this.state.defaultPriority,
        inactiveRoomsCount: this.state.totalRoomsCount - this.state.activeRooms - (this.state.onHoldRooms ? this.state.onHoldRooms : 0),
        singleBedsCount: this.state.singleBeds,
        doubleBedsCount: this.state.doubleBeds,
        privateBathRooms: this.state.bathRooms,
        kitchensCount: this.state.kitchens,
        hallsCount: this.state.halls,
        acsCount: this.state.acs,
        counts: {
          membersCapacity: (this.state.adultCapacity * this.state.activeRooms) - (this.state.adultDummyCapacity * this.state.activeDummyRooms),
          roomsCount: this.state.totalRoomsCount - this.state.roomsDummyCount,
          activeNumRooms: this.state.activeRooms - this.state.activeDummyRooms,
          onHoldNumRooms: this.state.onHoldRooms - this.state.onHoldDummyRooms,
          inactiveNumRooms: this.state.totalRoomsCount - this.state.activeRooms - (this.state.onHoldRooms ? this.state.onHoldRooms : 0) - this.state.inactiveRooms,
          singleBedsCount: this.state.singleBeds - this.state.singleDummyBeds,
          doubleBedsCount: this.state.doubleBeds - this.state.doubleDummyBeds,
          privateBathRooms: this.state.bathRooms - this.state.bathRoomsDummy,
          kitchensCount: this.state.kitchens - this.state.kitchensDummy,
          hallsCount: this.state.halls - this.state.hallsDummy,
          acsCount: this.state.acs - this.state.numACsDummy
        }
      }
      let obj = {
        url: config.baseUrl + config.putSPPropertyInfoUpdateAPI + this.state.propertyId + '/' + this.state.propertyInfoId,
        body: infoObj
      }
      this.setState({ reload: false })
      let _this = this
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          localStorage.setItem('propertyInfoViewObj', JSON.stringify(resObj.data.statusResult))
          _this.state.disableValue = true
          _this.state.propertyAction = 'View'
          _this.setState({ reload: true })
          _this.props.commonFunction(false, 'infoEdit')
          toast.success(t`lanSPLabelSuccessInfoUpdated`, {
            position: toast.POSITION.TOP_CENTER
          })
          setTimeout(() => {
          }, 2000)
          // alert(t`lanSPLabelSuccessInfoUpdated`)
        } else {
          _this.state.disableValue = false
          _this.state.propertyAction = 'Edit'
          _this.setState({ reload: true })
          _this.props.commonFunction(true, 'infoEdit')
          // _this.setState({ errorMessage: t`lanSPLabelErrorInfoUpdateFailed` })
          toast.error(t`lanSPLabelErrorInfoUpdateFailed`, {
            position: toast.POSITION.TOP_CENTER
          })
        }
      })
    }
  }
  render () {
    return (
      <div className='Create-Propety-Info'>
        <div className='card-body'>
          <form>
            <div className='row'>
              <div className='col-md-9' />
              <div className='col-md-3 text-right'>
                {this.state.propertyAction === 'Edit' ? null
                  : <a onClick={() => this.handleUpdateAction()} className='table-action btn btn-primary text-white' data-toggle='tooltip' >
                    <i className='fas fa-edit' /> Edit
                  </a>}
              </div>
            </div>
            <div className='row'>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelRentType`}</label>
                  <select className='form-control' id='exampleFormControlSelect1' value={this.state.rentType} disabled={this.state.disableValue}
                    onChange={(event) => this.setState({ rentType: event.target.value, errorMessage: '' })}>
                    <option value=''>Select Rent Type</option>
                    <option value='Sharing Room'>Sharing Room</option>
                    <option value='Private Room'>Private Room</option>
                    <option value='Entire Space'>Entire Space</option>
                  </select>
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelRoomType`}</label>
                  <select className='form-control' id='exampleFormControlSelect1' value={this.state.roomType} disabled={this.state.disableValue}
                    onChange={(event) => this.setState({ roomType: event.target.value, errorMessage: '' })}>
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
                  <label className='form-control-label'>{t`lanSPLabelRoomCategory`}</label>
                  <select className='form-control' id='exampleFormControlSelect1' value={this.state.roomCategory} disabled={this.state.disableValue}
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
                    disabled={this.state.disableValue} onChange={(event) => this.setState({ roomName: event.target.value, errorMessage: '' })} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label' >{t`lanSPLabelAdultCapacity`}</label>
                  <input type='text' className='form-control' id='example3cols3Input' value={this.state.adultCapacity}
                    disabled={this.state.disableValue} onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ adultCapacity: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelChildCapacity`}</label>
                  <input type='text' className='form-control' id='example3cols3Input' value={this.state.childCapacity}
                    disabled={this.state.disableValue} onChange={(event) => this.setState({ childCapacity: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label' >{t`lanSPLabelRoomsCount`}</label>
                  <input type='text' className='form-control' id='example3cols3Input' value={this.state.totalRoomsCount}
                    disabled={this.state.disableValue} onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ totalRoomsCount: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label' >{t`lanSPLabelActiveRooms`}</label>
                  <input type='text' className='form-control' id='example3cols3Input' value={this.state.activeRooms}
                    disabled={this.state.disableValue} onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ activeRooms: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelOnHoldRooms`}</label>
                  <input type='text' className='form-control' id='example3cols3Input' value={this.state.onHoldRooms}
                    disabled={this.state.disableValue} onChange={(event) => this.setState({ onHoldRooms: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelSingleBeds`}</label>
                  <input type='text' className='form-control' id='example3cols3Input' value={this.state.singleBeds}
                    disabled={this.state.disableValue} onChange={(event) => this.setState({ singleBeds: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelDoubleBeds`}</label>
                  <input type='text' className='form-control' id='example3cols3Input' value={this.state.doubleBeds}
                    disabled={this.state.disableValue} onChange={(event) => this.setState({ doubleBeds: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelShowerAndBathtub`}</label>
                  <input type='text' className='form-control' id='example3cols3Input' value={this.state.bathRooms}
                    disabled={this.state.disableValue} onChange={(event) => this.setState({ bathRooms: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelPropertyAcs`}</label>
                  <input type='text' className='form-control' id='example3cols3Input' value={this.state.acs}
                    disabled={this.state.disableValue} onChange={(event) => this.setState({ acs: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelPropertyKitchens`}</label>
                  <input type='text' className='form-control' id='example3cols3Input' value={this.state.kitchens}
                    disabled={this.state.disableValue} onChange={(event) => this.setState({ kitchens: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelPropertyHalls`}</label>
                  <input type='text' className='form-control' id='example3cols3Input' value={this.state.halls}
                    disabled={this.state.disableValue} onChange={(event) => this.setState({ halls: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <label className='form-control-label'>{t`lanCommonLabelStatus`}</label>
                <div className='form-group'>
                  <Switch
                    className='react-switch'
                    disabled
                    onChange={(status) => this.setState({ status: status === true ? 'Active' : 'Inactive', errorMessage: '' })}
                    checked={this.state.status === 'Active'}
                    aria-labelledby='neat-label'
                  />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelDefaultPriority`}</label>
                  <select className='form-control' id='exampleFormControlSelect1' value={this.state.defaultPriority}
                    disabled={this.state.oldDefaultStatus === true ? true : this.state.disableValue} onChange={(event) => this.setState({ defaultPriority: event.target.value, errorMessage: '' })}>
                    <option value='true'>true</option>
                    <option value='false'>false</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ color: 'red' }}>
              {this.state.errorMessage}
            </div>
            {this.state.disableValue === false
              ? <div className='form-group row mt-3'>
                <div className='col-md-3 col-auto'>
                  <button className='btn btn-primary' onClick={this.handleInfoUpdate} type='button'>{t`lanCommonButtonUpdate`}</button>
                  <button className='btn btn-primary' onClick={this.handleBack} type='button'>{t`lanCommonButtonBack`}</button>
                </div>
              </div> : null}
            <ToastContainer rtl />
          </form>
        </div>
      </div>
    )
  }
}

SPPropertyInfoEditComponent.propTypes = {
  propertyInfoViewObj: PropTypes.any,
  propertyAction: PropTypes.any,
  commonFunction: PropTypes.any
}
