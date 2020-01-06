/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { t } from 'ttag'
import 'react-drawer/lib/react-drawer.css'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPPropertyInfoPriceCreateComponent extends React.Component {
  constructor (props) {
    super(props)
    let data = this.props.priceObj
    this.state = {
      minBasePriceUnit: data && data.minBasePriceUnit ? data.minBasePriceUnit : '12 Hours',
      minBasePriceUnitValue: data && data.minBasePriceUnitValue ? data.minBasePriceUnitValue : 4,
      billingType: data && data.billingType ? data.billingType : 'Per Day',
      minBasePrice: data && data.minBasePrice ? data.minBasePrice : '',
      basePrice: data && data.basePrice ? data.basePrice : '',
      checkInCredentials: data && data.checkInCredentials ? data.checkInCredentials : 'Around The Clock',
      checkInTime: data && data.checkInTime ? data.checkInTime : '',
      checkOutTime: data && data.checkOutTime ? data.checkOutTime : '',
      currency: data && data.currency ? data.currency : 'INR',
      fullRefundCancelTime: data && data.fullRefundCancelTime ? data.fullRefundCancelTime : '72',
      refundCancelTime: data && data.refundCancelTime ? data.refundCancelTime : '12',
      refundCancelPercentage: data && data.refundCancelPercentage ? data.refundCancelPercentage : '65',
      timeHours: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      timeMins: ['00', '15', '30', '45'],
      timePeriod: ['AM', 'PM'],
      checkInHour: data && data.checkInTime ? moment(data.checkInTime, 'hh:mm A').format('hh') : '01',
      checkInMin: data && data.checkInTime ? moment(data && data.checkInTime, 'hh:mm A').format('mm') : '00',
      checkInAM: data && data.checkInTime ? moment(data && data.checkInTime, 'hh:mm A').format('A') : 'PM',
      checkOutHour: data && data.checkOutTime ? moment(data.checkOutTime, 'hh:mm A').format('hh') : '11',
      checkOutMin: data && data.checkOutTime ? moment(data.checkOutTime, 'hh:mm A').format('mm') : '00',
      checkOutAM: data && data.checkOutTime ? moment(data.checkOutTime, 'hh:mm A').format('A') : 'AM',
      errorMessage: '',
      errorClass: false
    }
    this.handlePriceUnit = this.handlePriceUnit.bind(this)
    this.handleCredentials = this.handleCredentials.bind(this)
    this.handlePrice = this.handlePrice.bind(this)
  }

  componentWillMount () {
    this.setState({ errorClass:'label-control text-danger' })
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
      this.setState({ errorClass:'text-success' })
      this.setState({ errorMessage: t`lanSPLabelSuccessInfoPriceCreated` })
      this.props.commonFuntion(pricingData, {}, '', 'price')
    }
  }
  render () {
    return (
      <div>
        <div className='create-price'>
          <form>
            <div className='row'>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelMinBasePriceUnit`}<span className='require'>*</span></label>
                  <select className='form-control' id='exampleFormControlSelect1' value={this.state.minBasePriceUnit} onChange={this.handlePriceUnit}>
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
                  <label className='form-control-label'>{t`lanSPLabelBillingType`}<span className='require'>*</span></label>
                  <select className='form-control' id='exampleFormControlSelect1' value={this.state.billingType} onChange={(event) => this.setState({ billingType: event.target.value, errorMessage: '' })}>
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
                  <label className='form-control-label'>{t`lanSPLabelMinBasePrice`}<span className='require'>*</span></label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.minBasePrice} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ minBasePrice: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelBasePrice`}<span className='require'>*</span></label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.basePrice} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ basePrice: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelCheckInCredentials`}</label>
                  <select className='form-control' id='exampleFormControlSelect1'
                    value={this.state.checkInCredentials} onChange={this.handleCredentials} >
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
                      <select className='form-control' id='exampleFormControlSelect1' value={this.state.checkInHour} onChange={(event) => this.setState({ checkInHour: event.target.value, errorMessage: '' })}>
                        {this.state.timeHours.map((timehour, i) => <option value={timehour} key={i}>{timehour}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className='form-group'>
                      <select className='form-control' id='exampleFormControlSelect1' value={this.state.checkInMin} onChange={(event) => this.setState({ checkInMin: event.target.value, errorMessage: '' })}>
                        {this.state.timeMins.map((timemin, i) => <option value={timemin} key={i}>{timemin}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className='form-group'>
                      <select className='form-control' id='exampleFormControlSelect1' value={this.state.checkInAM} onChange={(event) => this.setState({ checkInAM: event.target.value, errorMessage: '' })}>
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
                      <select className='form-control' id='exampleFormControlSelect1' value={this.state.checkOutHour} onChange={(event) => this.setState({ checkOutHour: event.target.value, errorMessage: '' })}>
                        {this.state.timeHours.map((timehour, i) => <option value={timehour} key={i}>{timehour}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className='form-group'>
                      <select className='form-control' id='exampleFormControlSelect1' value={this.state.checkOutMin} onChange={(event) => this.setState({ checkOutMin: event.target.value, errorMessage: '' })}>
                        {this.state.timeMins.map((timemin, i) => <option value={timemin} key={i}>{timemin}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className='form-group'>
                      <select className='form-control' id='exampleFormControlSelect1' value={this.state.checkOutAM} onChange={(event) => this.setState({ checkOutAM: event.target.value, errorMessage: '' })}>
                        {this.state.timePeriod.map((timep, i) => <option value={timep} key={i}>{timep}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelCurrency`}</label>
                  <select className='form-control' id='exampleFormControlSelect1' value={this.state.currency} onChange={(event) => this.setState({ currency: event.target.value, errorMessage: '' })} >
                    <option value='INR'>INR - Indian Rupee(₹)</option>
                    <option value='USD'>USD - US Dollar($)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelFullRefundCancelTime`} (Hours)<span className='require'>*</span></label>
                  <input type='text' className='form-control' id='example3cols3Input'
                    value={this.state.fullRefundCancelTime} onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ fullRefundCancelTime: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelRefundCancelTime`} (Hours)<span className='require'>*</span></label>
                  <input type='text' className='form-control' id='example3cols3Input'
                    value={this.state.refundCancelTime} onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ refundCancelTime: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelRefundCancelPercentage`} (%)<span className='require'>*</span></label>
                  <input type='text' className='form-control' id='example3cols3Input'
                    value={this.state.refundCancelPercentage}
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ refundCancelPercentage: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
            </div>
            <div className='container'>
              <div className='text-center'><label className={this.state.errorClass}>{this.state.errorMessage}</label></div>
            </div>
            <div className='container mt-3'>
              <div className='text-center'>
                <button className='btn btn-primary' onClick={this.handlePrice} type='button'>{t`lanCommonButtonCreate`}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

SPPropertyInfoPriceCreateComponent.propTypes = {
  commonFuntion: PropTypes.any,
  priceObj: PropTypes.any
}

export default SPPropertyInfoPriceCreateComponent
