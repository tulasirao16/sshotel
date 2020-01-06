/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import { t } from 'ttag'
import moment from 'moment'
import 'react-drawer/lib/react-drawer.css'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPPropertyInfoPriceViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      reload: false,
      propertyInfoPriceObj: this.props.propertyInfoPriceObj,
      propertyInfoId: this.props.propertyInfoPriceObj._id,
      minBasePriceUnit: this.props.propertyInfoPriceObj.pricing && this.props.propertyInfoPriceObj.pricing.minBasePriceUnit ? this.props.propertyInfoPriceObj.pricing.minBasePriceUnit : '4 Hours',
      minBasePrice: this.props.propertyInfoPriceObj.pricing && this.props.propertyInfoPriceObj.pricing.minBasePrice ? this.props.propertyInfoPriceObj.pricing.minBasePrice : '',
      minBasePriceUnitValue: this.props.propertyInfoPriceObj.pricing && this.props.propertyInfoPriceObj.pricing.minBasePriceUnitValue ? this.props.propertyInfoPriceObj.pricing.minBasePriceUnitValue : 4,
      checkInCredentials: this.props.propertyInfoPriceObj.pricing && this.props.propertyInfoPriceObj.pricing.checkInCredentials ? this.props.propertyInfoPriceObj.pricing.checkInCredentials : 'Around The Clock',
      currency: this.props.propertyInfoPriceObj.pricing && this.props.propertyInfoPriceObj.pricing.currency ? this.props.propertyInfoPriceObj.pricing.currency : 'INR',
      fullRefundCancelTime: this.props.propertyInfoPriceObj.pricing && this.props.propertyInfoPriceObj.pricing.fullRefundCancelTime ? this.props.propertyInfoPriceObj.pricing.fullRefundCancelTime : '',
      refundCancelTime: this.props.propertyInfoPriceObj.pricing && this.props.propertyInfoPriceObj.pricing.refundCancelTime ? this.props.propertyInfoPriceObj.pricing.refundCancelTime : '',
      refundCancelPercentage: this.props.propertyInfoPriceObj.pricing && this.props.propertyInfoPriceObj.pricing.refundCancelPercentage ? this.props.propertyInfoPriceObj.pricing.refundCancelPercentage : '',
      billingType: this.props.propertyInfoPriceObj.pricing && this.props.propertyInfoPriceObj.pricing.billingType ? this.props.propertyInfoPriceObj.pricing.billingType : 'Per Hour',
      basePrice: this.props.propertyInfoPriceObj.pricing && this.props.propertyInfoPriceObj.pricing.basePrice ? this.props.propertyInfoPriceObj.pricing.basePrice : '',
      checkInHour: this.props.propertyInfoPriceObj.pricing.checkInTime ? moment(this.props.propertyInfoPriceObj.pricing.checkInTime, 'hh:mm A').format('hh') : '01',
      checkInMin: this.props.propertyInfoPriceObj.pricing.checkInTime ? moment(this.props.propertyInfoPriceObj.pricing.checkInTime, 'hh:mm A').format('mm') : '00',
      checkInAM: this.props.propertyInfoPriceObj.pricing.checkInTime ? moment(this.props.propertyInfoPriceObj.pricing.checkInTime, 'hh:mm A').format('A') : 'PM',
      checkOutHour: this.props.propertyInfoPriceObj.pricing.checkOutTime ? moment(this.props.propertyInfoPriceObj.pricing.checkOutTime, 'hh:mm A').format('hh') : '11',
      checkOutMin: this.props.propertyInfoPriceObj.pricing.checkOutTime ? moment(this.props.propertyInfoPriceObj.pricing.checkOutTime, 'hh:mm A').format('mm') : '00',
      checkOutAM: this.props.propertyInfoPriceObj.pricing.checkOutTime ? moment(this.props.propertyInfoPriceObj.pricing.checkOutTime, 'hh:mm A').format('A') : 'AM',
      timeHours: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      timeMins: ['00', '15', '30', '45'],
      timePeriod: ['AM', 'PM'],
      disableValue: true,
      propertyAction: 'View',
      errorMessage: ''
    }
    this.handlePriceUnit = this.handlePriceUnit.bind(this)
    this.handleCredentials = this.handleCredentials.bind(this)
    this.handlePrice = this.handlePrice.bind(this)
  }
  handlePriceUnit (event) {
    let item = event.target.value
    this.setState({ errorMessage: '' })
    switch (item) {
      case '4 Hours':
        this.setState({ minBasePriceUnit: item, minBasePriceUnitValue: 4 })
        break
      case '6 Hours':
        this.setState({ minBasePriceUnit: item, minBasePriceUnitValue: 6 })
        break
      case '8 Hours':
        this.setState({ minBasePriceUnit: item, minBasePriceUnitValue: 8 })
        break
      case '12 Hours':
        this.setState({ minBasePriceUnit: item, minBasePriceUnitValue: 12 })
        break
      case '16 Hours':
        this.setState({ minBasePriceUnit: item, minBasePriceUnitValue: 16 })
        break
      case 'Per Day':
        this.setState({ minBasePriceUnit: item, minBasePriceUnitValue: 22 })
        break
      case 'Per Week':
        this.setState({ minBasePriceUnit: item, minBasePriceUnitValue: (7 * 24) - 2 })
        break
      case 'Per Month':
        this.setState({ minBasePriceUnit: item, minBasePriceUnitValue: (30 * 24) - 2 })
        break
      case 'Per Year':
        this.setState({ minBasePriceUnit: item, minBasePriceUnitValue: (365 * 24) - 2 })
        break
    }
  }
  handleCredentials (event) {
    this.setState({
      checkInCredentials: event.target.value,
      checkInHour: '01',
      checkInMin: '00',
      checkInAM: 'PM',
      checkOutHour: '11',
      checkOutMin: '00',
      checkOutAM: 'AM',
      errorMessage: ''
    })
  }
  handleMobileNumKeys (event) {
    if ((event.charCode >= 32 && event.charCode < 48 && event.charCode !== 40 &&
      event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
      (event.charCode > 57 && event.charCode < 127)) {
      event.preventDefault()
    }
  }
  handlePriceAction = () => {
    this.setState({ disableValue: !this.state.disableValue, propertyAction: 'Edit' })
    this.props.commonFunction(true, 'priceEdit')
  }
  handleBack = () => {
    this.setState({ disableValue: true, propertyAction: 'View' })
    this.props.commonFunction(false, 'priceEdit')
  }
  handlePrice () {
    if (!this.state.minBasePrice) {
      this.setState({ errorMessage: t`lanSPLabelErrorInfoPriceMinBasePrice` })
    } else if (!this.state.basePrice) {
      this.setState({ errorMessage: t`lanSPLabelErrorInfoPriceBasePrice` })
    } else if (!this.state.fullRefundCancelTime) {
      this.setState({ errorMessage: t`lanSPLabelErrorInfoPriceFullRefundCancelTime` })
    } else if (!this.state.refundCancelTime) {
      this.setState({ errorMessage: t`lanSPLabelErrorInfoPriceRefundCancelTime` })
    } else if (parseInt(this.state.refundCancelTime) > parseInt(this.state.fullRefundCancelTime)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInfoPriceFullRefundCancelTimeCondition` })
    } else if (!this.state.refundCancelPercentage) {
      this.setState({ errorMessage: t`lanSPLabelErrorInfoPriceRefundCancelPercentage` })
    } else {
      let pricingData = {
        minBasePriceUnit: this.state.minBasePriceUnit,
        minBasePriceUnitValue: this.state.minBasePriceUnitValue,
        basePrice: this.state.basePrice,
        minBasePrice: this.state.minBasePrice,
        billingType: this.state.billingType,
        checkInCredentials: this.state.checkInCredentials,
        currency: this.state.currency,
        checkInTime: this.state.checkInHour + ':' + this.state.checkInMin + ' ' + this.state.checkInAM,
        checkOutTime: this.state.checkOutHour + ':' + this.state.checkOutMin + ' ' + this.state.checkOutAM,
        fullRefundCancelTime: this.state.fullRefundCancelTime,
        refundCancelTime: this.state.refundCancelTime,
        refundCancelPercentage: this.state.refundCancelPercentage
      }
      let obj = {
        url: config.baseUrl + config.putSPPropertyInfoPriceUpdateAPI + this.state.propertyInfoId,
        body: pricingData
      }
      this.setState({ reload: false })
      let _this = this
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          localStorage.setItem('propertyInfoViewObj', JSON.stringify(resObj.data.statusResult))
          _this.state.disableValue = true
          _this.state.propertyAction = 'View'
          _this.setState({ reload: true })
          _this.props.commonFunction(false, 'priceEdit')
          // alert(t`lanSPLabelSuccessInfoPriceUpdated`)
          toast.success(t`lanSPLabelSuccessInfoPriceUpdated`, {
            position: toast.POSITION.TOP_CENTER
          })
          setTimeout(() => {
          }, 2000)
        } else {
          _this.state.disableValue = false
          _this.state.propertyAction = 'Edit'
          _this.setState({ reload: true })
          _this.props.commonFunction(true, 'priceEdit')
          toast.error(t`lanSPLabelErrorInfoPriceUpdateFailed`, {
            position: toast.POSITION.TOP_CENTER
          })
          // alert(t`lanSPLabelErrorInfoPriceUpdateFailed`)
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
              <div className='col-md-9'></div>
              <div className='col-md-3 text-right'>
                {this.state.propertyAction === 'Edit' ? null
                : <a onClick={() => this.handlePriceAction()} className='table-action btn btn-primary text-white' data-toggle='tooltip' >
                  <i className='fas fa-edit' /> Edit
                </a>}
              </div>
            </div>
            <div className='row'>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelMinBasePriceUnit`}</label>
                  <select className='form-control' id='exampleFormControlSelect1' value={this.state.minBasePriceUnit} onChange={this.handlePriceUnit}
                    disabled={this.state.disableValue} >
                    <option value='4 Hours'>4 Hours</option>
                    <option value='6 Hours'>6 Hours</option>
                    <option value='8 Hours'>8 Hours</option>
                    <option value='12 Hours'>12 Hours</option>
                    <option value='16 Hours'>16 Hours</option>
                    <option value='Per Day'>Per Day</option>
                    <option value='Per Week'>Per Week</option>
                    <option value='Per Month'>Per Month</option>
                    <option value='Per Year'>Per Year</option>
                  </select>
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelBillingType`}</label>
                  <select className='form-control' id='exampleFormControlSelect1' value={this.state.billingType} disabled={this.state.disableValue}
                    onChange={(event) => this.setState({ billingType: event.target.value, errorMessage: '' })}>
                    <option value='Per Hour'>Per Hour</option>
                    <option value='Per Day'>Per Day</option>
                    <option value='Per Week'>Per Week</option>
                    <option value='Per Month'>Per Month</option>
                    <option value='Per Year'>Per Year</option>
                  </select>
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelMinBasePrice`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.minBasePrice} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ minBasePrice: event.target.value })} onKeyPress={this.handleMobileNumKeys} disabled={this.state.disableValue} />
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelBasePrice`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.basePrice} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ basePrice: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} disabled={this.state.disableValue} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelCheckInCredentials`}</label>
                  <select className='form-control' id='exampleFormControlSelect1'
                    value={this.state.checkInCredentials} onChange={this.handleCredentials} disabled={this.state.disableValue} >
                    <option value='Specific Time'>Specific Time</option>
                    <option value='Around The Clock'>Around The Clock</option>
                  </select>
                </div>
              </div>
              <div className='col-md-3'>
                <label className='form-control-label'>{t`lanSPLabelCheckInTime`}</label>
                <div className='row'>
                  <div className='col-md-4'>
                    <div className='form-group'>
                      <select className='form-control' id='exampleFormControlSelect1' value={this.state.checkInHour}
                        disabled={this.state.disableValue} onChange={(event) => this.setState({ checkInHour: event.target.value, errorMessage: '' })}>
                        {this.state.timeHours.map((timehour, i) => <option value={timehour} key={i}>{timehour}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className='form-group'>
                      <select className='form-control' id='exampleFormControlSelect1' value={this.state.checkInMin}
                        disabled={this.state.disableValue} onChange={(event) => this.setState({ checkInMin: event.target.value, errorMessage: '' })}>
                        {this.state.timeMins.map((timemin, i) => <option value={timemin} key={i}>{timemin}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className='form-group'>
                      <select className='form-control' id='exampleFormControlSelect1' value={this.state.checkInAM} disabled={this.state.disableValue}
                        onChange={(event) => this.setState({ checkInAM: event.target.value, errorMessage: '' })}>
                        {this.state.timePeriod.map((timep, i) => <option value={timep} key={i}>{timep}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-3'>
                <label className='form-control-label'>{t`lanSPLabelCheckOutTime`}</label>
                <div className='row'>
                  <div className='col-md-4'>
                    <div className='form-group'>
                      <select className='form-control' id='exampleFormControlSelect1' value={this.state.checkOutHour}
                        disabled={this.state.disableValue} onChange={(event) => this.setState({ checkOutHour: event.target.value, errorMessage: '' })}>
                        {this.state.timeHours.map((timehour, i) => <option value={timehour} key={i}>{timehour}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className='form-group'>
                      <select className='form-control' id='exampleFormControlSelect1' value={this.state.checkOutMin}
                        disabled={this.state.disableValue} onChange={(event) => this.setState({ checkOutMin: event.target.value, errorMessage: '' })}>
                        {this.state.timeMins.map((timemin, i) => <option value={timemin} key={i}>{timemin}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className='form-group'>
                      <select className='form-control' id='exampleFormControlSelect1' value={this.state.checkOutAM}
                        disabled={this.state.disableValue} onChange={(event) => this.setState({ checkOutAM: event.target.value, errorMessage: '' })}>
                        {this.state.timePeriod.map((timep, i) => <option value={timep} key={i}>{timep}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelCurrency`}</label>
                  <select className='form-control' id='exampleFormControlSelect1' value={this.state.currency}
                    disabled={this.state.disableValue} onChange={(event) => this.setState({ currency: event.target.value, errorMessage: '' })} >
                    <option value='INR'>INR - Indian Rupee(₹)</option>
                    <option value='USD'>USD - US Dollar($)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelFullRefundCancelTime`} (Hours)</label>
                  <input type='text' className='form-control' id='example3cols3Input'
                    value={this.state.fullRefundCancelTime} onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ fullRefundCancelTime: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} disabled={this.state.disableValue} />
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelRefundCancelTime`} (Hours)</label>
                  <input type='text' className='form-control' id='example3cols3Input'
                    value={this.state.refundCancelTime} onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ refundCancelTime: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} disabled={this.state.disableValue} />
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelRefundCancelPercentage`} (%)</label>
                  <input type='text' className='form-control' id='example3cols3Input'
                    value={this.state.refundCancelPercentage}
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ refundCancelPercentage: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} disabled={this.state.disableValue} />
                </div>
              </div>
            </div>
            <div style={{ color: 'red' }}>
              {this.state.errorMessage}
            </div>
            {this.state.disableValue === false
              ? <div className='form-group row mt-3'>
                <div className='col-md-3 col-auto'>
                  <button className='btn btn-primary' onClick={this.handlePrice} type='button'>{t`lanCommonButtonUpdate`}</button>
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
SPPropertyInfoPriceViewComponent.propTypes = {
  propertyInfoPriceObj: PropTypes.any,
  commonFunction: PropTypes.any
}

export default SPPropertyInfoPriceViewComponent
