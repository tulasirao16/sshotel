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
import Modal from 'react-modal'
import '../../css/all.min.css'
import '../../css/argon.min.css'
import '../../css/nucleo.css'
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}
class ADHostsPropertyInfoPriceCreateComponent extends React.Component {
  constructor (props) {
    super(props)
    // let data = props.priceObj
    let hostData = JSON.parse(localStorage.getItem('hostData'))
    let pricingDataView = JSON.parse(localStorage.getItem('PricingData'))
    let data = pricingDataView === null ? props.priceObj : pricingDataView
    this.state = {
      minBasePriceUnit: data && data.minBasePriceUnit ? data.minBasePriceUnit : '6<=>6 Hours',
      minBasePriceUnitValue: data && data.minBasePriceUnitValue ? data.minBasePriceUnitValue : 6,
      billingType: data && data.billingType ? data.billingType : 'Per Day',
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
      checkInHour: data && data.checkInTime ? moment(data.checkInTime, 'hh:mm A').format('hh') : '12',
      checkInMin: data && data.checkInTime ? moment(data && data.checkInTime, 'hh:mm A').format('mm') : '00',
      checkInAM: data && data.checkInTime ? moment(data && data.checkInTime, 'hh:mm A').format('A') : 'PM',
      checkOutHour: data && data.checkOutTime ? moment(data.checkOutTime, 'hh:mm A').format('hh') : '11',
      checkOutMin: data && data.checkOutTime ? moment(data.checkOutTime, 'hh:mm A').format('mm') : '00',
      checkOutAM: data && data.checkOutTime ? moment(data.checkOutTime, 'hh:mm A').format('A') : 'AM',
      errorMessage: '',
      errorClass: false,
      serviceCharges: data && data.serviceCharges ? data.serviceCharges : 0,
      otherCharges: data && data.otherCharges ? data.otherCharges : 0,
      cgstPercentage: data && data.cgstPercentage ? data.cgstPercentage : 0,
      cgstAmount: data && data.cgstAmount ? data.cgstAmount : 0,
      cgstAmount1:data && data.cgstAmount1 ? data.cgstAmount1 : 0,
      cgstAmount2:data && data.cgstAmount2 ? data.cgstAmount2 : 0,
      cgstAmount3:data && data.cgstAmount3 ? data.cgstAmount3 : 0,
      cgstAmount4:data && data.cgstAmount4 ? data.cgstAmount4 : 0,
      weekEndcgstAmount: data && data.weekEndcgstAmount ? data.weekEndcgstAmount : 0,
      weekEndcgstAmount1:data && data.weekEndcgstAmount1 ? data.weekEndcgstAmount1 : 0,
      weekEndcgstAmount2:data && data.weekEndcgstAmount2 ? data.weekEndcgstAmount2 : 0,
      weekEndcgstAmount3:data && data.weekEndcgstAmount3 ? data.weekEndcgstAmount3 : 0,
      weekEndcgstAmount4:data && data.weekEndcgstAmount4 ? data.weekEndcgstAmount4 : 0,
      sgstPercentage: data && data.sgstPercentage ? data.sgstPercentage : 0,
      sgstAmount: data && data.sgstAmount ? data.sgstAmount : 0,
      sgstAmount1:data && data.sgstAmount1 ? data.sgstAmount1 : 0,
      sgstAmount2:data && data.sgstAmount2 ? data.sgstAmount2 : 0,
      sgstAmount3:data && data.sgstAmount3 ? data.sgstAmount3 : 0,
      sgstAmount4:data && data.sgstAmount4 ? data.sgstAmount4 : 0,
      weekEndsgstAmount: data && data.weekEndsgstAmount ? data.weekEndsgstAmount : 0,
      weekEndsgstAmount1:data && data.weekEndsgstAmount1 ? data.weekEndsgstAmount1 : 0,
      weekEndsgstAmount2:data && data.weekEndsgstAmount2 ? data.weekEndsgstAmount2 : 0,
      weekEndsgstAmount3:data && data.weekEndsgstAmount3 ? data.weekEndsgstAmount3 : 0,
      weekEndsgstAmount4:data && data.weekEndsgstAmount4 ? data.weekEndsgstAmount4 : 0,
      minBasePrice : data && data.minBasePrice ? data.minBasePrice : 0,
      minBasePrice2 : data && data.minBasePrice2 ? data.minBasePrice2 : 0,
      minBasePrice3 : data && data.minBasePrice3 ? data.minBasePrice3 : 0,
      minBasePrice4 : data && data.minBasePrice4 ? data.minBasePrice4 : 0,

      weekdayBilingUnit: data && data.weekdayBilingUnit ? data.weekdayBilingUnit : 'Per Day',
      weekdayDiscount: data && data.weekdayDiscount ? data.weekdayDiscount : 0,
      weekEndMinBasePrice : data && data.weekEndMinBasePrice ? data.weekEndMinBasePrice : 0,
      weekEndMinBasePrice2 : data && data.weekEndMinBasePrice2 ? data.weekEndMinBasePrice2 : 0,
      weekEndMinBasePrice3 : data && data.weekEndMinBasePrice3 ? data.weekEndMinBasePrice3 : 0,
      weekEndMinBasePrice4 : data && data.weekEndMinBasePrice4 ? data.weekEndMinBasePrice4 : 0,
      weekEndBasePrice4 : data && data.weekEndBasePrice4 ? data.weekEndBasePrice4 : 0,
      weekEndBasePrice: data && data.weekEndBasePrice ? data.weekEndBasePrice : '',

      weekEndminBilingUnit: data && data.weekEndminBilingUnit ? data.weekEndminBilingUnit : 'Per Day',
      weekEndDiscount: data && data.weekEndDiscount ? data.weekEndDiscount : 0,
      appPercentage: hostData && hostData.appPercentage ? hostData.appPercentage : 2,
      appPgPercentage: data && data.appPgPercentage ? data.appPgPercentage : 3,
      PGAmount:data && data.PGAmount ? data.PGAmount : 0,
      PGAmount1:data && data.PGAmount1 ? data.PGAmount1 : 0,
      PGAmount2:data && data.PGAmount2 ? data.PGAmount2 : 0,
      PGAmount3:data && data.PGAmount3 ? data.PGAmount3 : 0,
      PGAmount4:data && data.PGAmount4 ? data.PGAmount4 : 0,
      weekEndPGAmount:data && data.weekEndPGAmount ? data.weekEndPGAmount : 0,
      weekEndPGAmount1:data && data.weekEndPGAmount1 ? data.weekEndPGAmount1 : 0,
      weekEndPGAmount2:data && data.weekEndPGAmount2 ? data.weekEndPGAmount2 : 0,
      weekEndPGAmount3:data && data.weekEndPGAmount3 ? data.weekEndPGAmount3 : 0,
      weekEndPGAmount4:data && data.weekEndPGAmount4 ? data.weekEndPGAmount4 : 0,
      weekEndEdit : true,
      editVisiblePrice : false,
      EDFinalPrice: data && data.EDFinalPrice ? data.EDFinalPrice : 0,
      SPFinalPrice: data && data.SPFinalPrice ? data.SPFinalPrice : 0,

      EDWithOutDiscountFinalPrice : data && data.EDWithOutDiscountFinalPrice ? data.EDWithOutDiscountFinalPrice : 0,
      SPWithOutDiscountFinalPrice : data && data.SPWithOutDiscountFinalPrice ? data.SPWithOutDiscountFinalPrice : 0,

      basePriceDiscount: data && data.basePriceDiscount ? data.basePriceDiscount : 0,
      basePriceDiscount1: data && data.basePriceDiscount1 ? data.basePriceDiscount1 : 0,
      basePriceDiscount2: data && data.basePriceDiscount2 ? data.basePriceDiscount2 : 0,
      basePriceDiscount3: data && data.basePriceDiscount3 ? data.basePriceDiscount3 : 0,
      basePriceDiscount4: data && data.basePriceDiscount4 ? data.basePriceDiscount4 : 0,

      weekEndbasePriceDiscount : data && data.weekEndbasePriceDiscount ? data.weekEndbasePriceDiscount : 0,
      weekEndbasePriceDiscount1: data && data.weekEndbasePriceDiscount1 ? data.weekEndbasePriceDiscount1 : 0,
      weekEndbasePriceDiscount2: data && data.weekEndbasePriceDiscount2 ? data.weekEndbasePriceDiscount2 : 0,
      weekEndbasePriceDiscount3: data && data.weekEndbasePriceDiscount3 ? data.weekEndbasePriceDiscount3 : 0,
      weekEndbasePriceDiscount4: data && data.weekEndbasePriceDiscount4 ? data.weekEndbasePriceDiscount4 : 0,

      appCharges: data && data.appCharges ? data.appCharges : 0,
      minBaseAppCharges: data && data.minBaseAppCharges ? data.minBaseAppCharges : 0,
      minBaseAppCharges2: data && data.minBaseAppCharges2 ? data.minBaseAppCharges2 : 0,
      minBaseAppCharges3: data && data.minBaseAppCharges3 ? data.minBaseAppCharges3 : 0,
      minBaseAppCharges4: data && data.minBaseAppCharges4 ? data.minBaseAppCharges4 : 0,

      weekEndAppCharges: data && data.weekEndAppCharges ? data.weekEndAppCharges : 0,
      weekEndMinBaseAppCharges: data && data.weekEndMinBaseAppCharges ? data.weekEndMinBaseAppCharges : 0,
      weekEndMinBaseAppCharges2: data && data.weekEndMinBaseAppCharges2 ? data.weekEndMinBaseAppCharges2 : 0,
      weekEndMinBaseAppCharges3: data && data.weekEndMinBaseAppCharges3 ? data.weekEndMinBaseAppCharges3 : 0,
      weekEndMinBaseAppCharges4: data && data.weekEndMinBaseAppCharges4 ? data.weekEndMinBaseAppCharges4 : 0,

      spAmount: data && data.spAmount ? data.spAmount : 0,
      minBaseSpAmount: data && data.appCharges ? data.appCharges : 0,
      minBaseSpAmount2: data && data.minBaseSpAmount2 ? data.minBaseSpAmount2 : 0,
      minBaseSpAmount3: data && data.minBaseSpAmount3 ? data.minBaseSpAmount3 : 0,
      minBaseSpAmount4: data && data.minBaseSpAmount4 ? data.minBaseSpAmount4 : 0,

      weekEndSpAmount: data && data.weekEndSpAmount ? data.weekEndSpAmount : 0,
      weekEndMinBaseSpAmount: data && data.weekEndMinBaseSpAmount ? data.weekEndMinBaseSpAmount : 0,
      weekEndMinBaseSpAmount2: data && data.weekEndMinBaseSpAmount2 ? data.weekEndMinBaseSpAmount2 : 0,
      weekEndMinBaseSpAmount3: data && data.weekEndMinBaseSpAmount3 ? data.weekEndMinBaseSpAmount3 : 0,
      weekEndMinBaseSpAmount4: data && data.weekEndMinBaseSpAmount4 ? data.weekEndMinBaseSpAmount4 : 0,

      totalPrice: data && data.totalPrice ? data.totalPrice : 0,
      minBaseTotalPrice: data && data.minBaseTotalPrice ? data.minBaseTotalPrice : 0,
      minBaseTotalPrice2: data && data.minBaseTotalPrice2 ? data.minBaseTotalPrice2 : 0,
      minBaseTotalPrice3: data && data.minBaseTotalPrice3 ? data.minBaseTotalPrice3 : 0,
      minBaseTotalPrice4: data && data.minBaseTotalPrice4 ? data.minBaseTotalPrice4 : 0,

      weekEndTotalPrice: data && data.weekEndTotalPrice ? data.weekEndTotalPrice : 0,
      weekEndMinBaseTotalPrice: data && data.weekEndMinBaseTotalPrice ? data.weekEndMinBaseTotalPrice : 0,
      weekEndMinBaseTotalPrice2: data && data.weekEndMinBaseTotalPrice2 ? data.weekEndMinBaseTotalPrice2 : 0,
      weekEndMinBaseTotalPrice3: data && data.weekEndMinBaseTotalPrice3 ? data.weekEndMinBaseTotalPrice3 : 0,
      weekEndMinBaseTotalPrice4: data && data.weekEndMinBaseTotalPrice4 ? data.weekEndMinBaseTotalPrice4 : 0,

      wdTotalPrice: data && data.wdTotalPrice ? data.wdTotalPrice : 0,
      minBaseWdTotalPrice: data && data.minBaseWdTotalPrice ? data.minBaseWdTotalPrice : 0,
      minBaseWdTotalPrice2: data && data.minBaseWdTotalPrice2 ? data.minBaseWdTotalPrice2 : 0,
      minBaseWdTotalPrice3: data && data.minBaseWdTotalPrice3 ? data.minBaseWdTotalPrice3 : 0,
      minBaseWdTotalPrice4: data && data.minBaseWdTotalPrice4 ? data.minBaseWdTotalPrice4 : 0,

      weekEndWdTotalPrice: data && data.weekEndWdTotalPrice ? data.weekEndWdTotalPrice : 0,
      weekEndMinBaseWdTotalPrice: data && data.weekEndMinBaseWdTotalPrice ? data.weekEndMinBaseWdTotalPrice : 0,
      weekEndMinBaseWdTotalPrice2: data && data.weekEndMinBaseWdTotalPrice2 ? data.weekEndMinBaseWdTotalPrice2 : 0,
      weekEndMinBaseWdTotalPrice3: data && data.weekEndMinBaseWdTotalPrice3 ? data.weekEndMinBaseWdTotalPrice3 : 0,
      weekEndMinBaseWdTotalPrice4: data && data.weekEndMinBaseWdTotalPrice4 ? data.weekEndMinBaseWdTotalPrice4 : 0,
      demo : 1,
      // isCreateProperty: this.props.isCreateProperty === 'create' ? true : minBasecheck === true ? true : isMinBaseDefaultInfocreate === 'true' ? true : false,
      // isDefaultBasePrice: this.props.isCreateProperty === 'create' ? true : minBasecheck === 'true' ? true : isMinBaseDefaultInfocreate === 'true' ? true : false,
      // isDefaultMinBasePrice: this.props.isCreateProperty === 'create' ? true : minBasecheck === 'true' ? true : false,
      modalIsOpen: false,
      isMidnightCheckOutAllowed: data && data.isMidnightCheckOutAllowed ? (data.isMidnightCheckOutAllowed === true ? true : false) : false,
      isDefaultBasePrice : data && data.isDefaultBasePrice ? data.isDefaultBasePrice : true,
      isDefaultMinBasePrice : data && data.isDefaultMinBasePrice ? data.isDefaultMinBasePrice : true
      
      // checkDefaultMinBase: isMinBaseDefaultInfocreate === 'true' && data.minBasePriceUnit === '6<=>6 Hours' || '6 Hours' ? true : false,
      // checkDefaultBillingType: minBasecheck === 'true' ? false : true
    }
    this.handlePriceUnit = this.handlePriceUnit.bind(this)
    this.handleCredentials = this.handleCredentials.bind(this)
    this.handlePrice = this.handlePrice.bind(this)
    this.handleWeekdayPrice = this.handleWeekdayPrice.bind(this)

    this.HandleWeekdayMinPrice = this.HandleWeekdayMinPrice.bind(this)
    this.HandleWeekdayMinPrice2 = this.HandleWeekdayMinPrice2.bind(this)
    this.HandleBasePriceCal = this.HandleBasePriceCal.bind(this)
    this.handleMinBasePrice1 = this.handleMinBasePrice1.bind(this)
    this.handleMinBasePrice2 = this.handleMinBasePrice2.bind(this)
    this.handleMinBasePrice3 = this.handleMinBasePrice3.bind(this)
    this.handleMinBasePrice4 = this.handleMinBasePrice4.bind(this)

    this.handleWeekEndPrice = this.handleWeekEndPrice.bind(this)
    this.HandleWeekEndBasePriceCal = this.HandleWeekEndBasePriceCal.bind(this)
    this.handleWeekEndMinBasePrice1 = this.handleWeekEndMinBasePrice1.bind(this)
    this.handleWeekEndMinBasePrice2 = this.handleWeekEndMinBasePrice2.bind(this)
    this.handleWeekEndMinBasePrice3 = this.handleWeekEndMinBasePrice3.bind(this)
    this.handleWeekEndMinBasePrice4 = this.handleWeekEndMinBasePrice4.bind(this)
    // this.handleDemo = this.handleDemo.bind(this)

    this.handleCommonchange = this.handleCommonchange.bind(this)
    this.handleSetstate = this.handleSetstate.bind(this)
    this.handleAllCal = this.handleAllCal.bind(this)

    this.handlePriceUnitValue = this.handlePriceUnitValue.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentWillMount () {
    this.setState({ errorClass:'label-control text-danger' })
  }

  handleWeekdayPrice = (event) => {
    if (this.state.weekEndEdit) {
      this.HandleWeekdayMinPrice(event)
    } else {
      this.HandleWeekdayMinPrice2(event)
    }
  }

  async HandleWeekdayMinPrice (event) {
    if (this.state.minBasePriceUnit === '24<=>Per Day') {
      const basePrice = event.target.value
      // const StringLength = basePrice.length
      // const charfind = basePrice.charAt(0)
      // let FirstChar = basePrice.length !== 0 ? charfind < 5 ? 1 : 5 : ''
      // let FirstChar1 = basePrice.length > 2 ? parseInt(FirstChar + '0'.repeat(StringLength - 2)) : 0
      // let minBasePrice = Math.ceil((basePrice / 4) * 1 + FirstChar1)
      // let minBasePrice2 = Math.ceil((basePrice / 4) * 2 + FirstChar1)
      // let minBasePrice3 = Math.ceil((basePrice / 4) * 3 + FirstChar1)
      let HandleBasePriceCal = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal1 = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal2 = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal3 = this.HandleBasePriceCal(basePrice)

      const weekEndbasePrice = event.target.value
      // const WEStringLength = weekEndbasePrice.length
      // const WEcharfind = weekEndbasePrice.charAt(0)
      // let WEFirstChar = weekEndbasePrice.length !== 0 ? WEcharfind < 5 ? 1 : 5 : ''
      // let WEFirstChar1 = weekEndbasePrice.length > 2 ? parseInt(WEFirstChar + '0'.repeat(WEStringLength - 2)) : 0
      // let WEminBasePrice = Math.ceil((weekEndbasePrice / 4) * 1 + WEFirstChar1)
      // let WEminBasePrice2 = Math.ceil((weekEndbasePrice / 4) * 2 + WEFirstChar1)
      // let WEminBasePrice3 = Math.ceil((weekEndbasePrice / 4) * 3 + WEFirstChar1)
      let HandleWeekEndBasePriceCal = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      let HandleWeekEndBasePriceCal1 = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      let HandleWeekEndBasePriceCal2 = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      let HandleWeekEndBasePriceCal3 = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      this.setState({
        errorMessage: '',
        // base price
        basePrice: basePrice,
        weekEndBasePrice: weekEndbasePrice,

        // min base price
        minBasePrice : event.target.value.length !== 0 ? basePrice : 0,
        minBasePrice2 : event.target.value.length !== 0 ? basePrice : 0,
        minBasePrice3 : event.target.value.length !== 0 ? basePrice : 0,
        minBasePrice4 : event.target.value.length !== 0 ? basePrice : 0,

        weekEndMinBasePrice : event.target.value.length !== 0 ? weekEndbasePrice : 0,
        weekEndMinBasePrice2 : event.target.value.length !== 0 ? weekEndbasePrice : 0,
        weekEndMinBasePrice3 : event.target.value.length !== 0 ? weekEndbasePrice : 0,
        weekEndMinBasePrice4 : event.target.value.length !== 0 ? weekEndbasePrice : 0,

        // discounts
        basePriceDiscount: event.target.value.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,
        basePriceDiscount1: event.target.value.length !== 0 ? HandleBasePriceCal1.basePriceDiscountCal : 0,
        basePriceDiscount2: event.target.value.length !== 0 ? HandleBasePriceCal2.basePriceDiscountCal : 0,
        basePriceDiscount3: event.target.value.length !== 0 ? HandleBasePriceCal3.basePriceDiscountCal : 0,
        basePriceDiscount4: event.target.value.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,

        weekEndbasePriceDiscount : event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount1: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,

        // app charges
        appCharges: event.target.value.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,
        minBaseAppCharges: event.target.value.length !== 0 ? HandleBasePriceCal1.appPercentageCal : 0,
        minBaseAppCharges2: event.target.value.length !== 0 ? HandleBasePriceCal2.appPercentageCal : 0,
        minBaseAppCharges3: event.target.value.length !== 0 ? HandleBasePriceCal3.appPercentageCal : 0,
        minBaseAppCharges4: event.target.value.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,

        weekEndAppCharges: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,
        weekEndMinBaseAppCharges:  event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.appPercentageCal : 0,
        weekEndMinBaseAppCharges2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.appPercentageCal : 0,
        weekEndMinBaseAppCharges3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.appPercentageCal : 0,
        weekEndMinBaseAppCharges4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,

        // cgst amount
        cgstAmount: event.target.value.length !== 0 ? HandleBasePriceCal.cgstCal : 0,
        cgstAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.cgstCal : 0,
        cgstAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.cgstCal : 0,
        cgstAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.cgstCal : 0,
        cgstAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.cgstCal : 0,

        weekEndcgstAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,
        weekEndcgstAmount1:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.cgstCal : 0,
        weekEndcgstAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.cgstCal : 0,
        weekEndcgstAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.cgstCal : 0,
        weekEndcgstAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,

        // sgst amount
        sgstAmount: event.target.value.length !== 0 ? HandleBasePriceCal.sgstCal : 0,
        sgstAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.sgstCal : 0,
        sgstAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.sgstCal : 0,
        sgstAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.sgstCal : 0,
        sgstAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.sgstCal : 0,

        weekEndsgstAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,
        weekEndsgstAmount1:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.sgstCal : 0,
        weekEndsgstAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.sgstCal : 0,
        weekEndsgstAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.sgstCal : 0,
        weekEndsgstAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,

        // sp amount
        spAmount : event.target.value.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,
        minBaseSpAmount: event.target.value.length !== 0 ? HandleBasePriceCal1.SPUserPrice : 0,
        minBaseSpAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.SPUserPrice : 0,
        minBaseSpAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.SPUserPrice : 0,
        minBaseSpAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,

        weekEndSpAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,
        weekEndMinBaseSpAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.SPUserPrice : 0,
        weekEndMinBaseSpAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.SPUserPrice : 0,
        weekEndMinBaseSpAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.SPUserPrice : 0,
        weekEndMinBaseSpAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,

        // PG amount
        PGAmount: event.target.value.length !== 0 ? HandleBasePriceCal.paymentCal : 0,
        PGAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.paymentCal : 0,
        PGAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.paymentCal : 0,
        PGAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.paymentCal : 0,
        PGAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.paymentCal : 0,

        weekEndPGAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,
        weekEndPGAmount1: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.paymentCal : 0,
        weekEndPGAmount2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.paymentCal : 0,
        weekEndPGAmount3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.paymentCal : 0,
        weekEndPGAmount4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,

        // EDWithOutDiscountFinalPrice : event.target.value.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
        SPWithOutDiscountFinalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.SPWithOutDiscountFinalPrice : 0,

        // with out discount EU amount
        wdTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice2 : event.target.value.length !== 0 ? HandleBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice3 : event.target.value.length !== 0 ? HandleBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice4 : event.target.value.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        weekEndWdTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        // EU total amount
        totalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,
        minBaseTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal1.EndUserPrice : 0,
        minBaseTotalPrice2 : event.target.value.length !== 0 ? HandleBasePriceCal2.EndUserPrice : 0,
        minBaseTotalPrice3: event.target.value.length !== 0 ? HandleBasePriceCal3.EndUserPrice : 0,
        minBaseTotalPrice4: event.target.value.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,

        weekEndTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0,
        weekEndMinBaseTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.EndUserPrice : 0,
        weekEndMinBaseTotalPrice2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.EndUserPrice : 0,
        weekEndMinBaseTotalPrice3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.EndUserPrice : 0,
        weekEndMinBaseTotalPrice4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0 })
    } else {
      const basePrice = event.target.value
      const StringLength = basePrice.length
      const charfind = basePrice.charAt(0)
      let FirstChar = basePrice.length !== 0 ? charfind < 5 ? 1 : 5 : ''
      let FirstChar1 = basePrice.length > 2 ? parseInt(FirstChar + '0'.repeat(StringLength - 2)) : 0
      // let minBasePrice = Math.ceil((basePrice / 4) * 1 + FirstChar1)
      // let minBasePrice2 = Math.ceil((basePrice / 4) * 2 + FirstChar1)
      // let minBasePrice3 = Math.ceil((basePrice / 4) * 3 + FirstChar1)
      let minBasePrice = Math.ceil(basePrice / 100 * 50)
      let minBasePrice2 = Math.ceil(basePrice / 100 * 75)
      let minBasePrice3 = Math.ceil(basePrice / 100 * 90)

      let HandleBasePriceCal = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal1 = this.HandleBasePriceCal(minBasePrice)
      let HandleBasePriceCal2 = this.HandleBasePriceCal(minBasePrice2)
      let HandleBasePriceCal3 = this.HandleBasePriceCal(minBasePrice3)

      let HandleWeekEndBasePriceCal = this.HandleWeekEndBasePriceCal(basePrice)
      let HandleWeekEndBasePriceCal1 = this.HandleWeekEndBasePriceCal(minBasePrice)
      let HandleWeekEndBasePriceCal2 = this.HandleWeekEndBasePriceCal(minBasePrice2)
      let HandleWeekEndBasePriceCal3 = this.HandleWeekEndBasePriceCal(minBasePrice3)
      this.setState({
        errorMessage: '',

        // base price
        basePrice: basePrice,
        weekEndBasePrice: basePrice,

        // min base price
        minBasePrice : event.target.value.length !== 0 ? minBasePrice : 0,
        minBasePrice2 : event.target.value.length !== 0 ? minBasePrice2 : 0,
        minBasePrice3 : event.target.value.length !== 0 ? minBasePrice3 : 0,
        minBasePrice4 : event.target.value.length !== 0 ? basePrice : 0,

        weekEndMinBasePrice : event.target.value.length !== 0 ? minBasePrice : 0,
        weekEndMinBasePrice2 : event.target.value.length !== 0 ? minBasePrice2 : 0,
        weekEndMinBasePrice3 : event.target.value.length !== 0 ? minBasePrice3 : 0,
        weekEndMinBasePrice4 : event.target.value.length !== 0 ? basePrice : 0,

        // discounts
        basePriceDiscount: event.target.value.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,
        basePriceDiscount1: event.target.value.length !== 0 ? HandleBasePriceCal1.basePriceDiscountCal : 0,
        basePriceDiscount2: event.target.value.length !== 0 ? HandleBasePriceCal2.basePriceDiscountCal : 0,
        basePriceDiscount3: event.target.value.length !== 0 ? HandleBasePriceCal3.basePriceDiscountCal : 0,
        basePriceDiscount4: event.target.value.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,

        weekEndbasePriceDiscount : event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount1: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,

        // app charges
        appCharges: event.target.value.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,
        minBaseAppCharges: event.target.value.length !== 0 ? HandleBasePriceCal1.appPercentageCal : 0,
        minBaseAppCharges2: event.target.value.length !== 0 ? HandleBasePriceCal2.appPercentageCal : 0,
        minBaseAppCharges3: event.target.value.length !== 0 ? HandleBasePriceCal3.appPercentageCal : 0,
        minBaseAppCharges4: event.target.value.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,

        weekEndAppCharges: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,
        weekEndMinBaseAppCharges:  event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.appPercentageCal : 0,
        weekEndMinBaseAppCharges2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.appPercentageCal : 0,
        weekEndMinBaseAppCharges3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.appPercentageCal : 0,
        weekEndMinBaseAppCharges4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,

        // cgst amount
        cgstAmount: event.target.value.length !== 0 ? HandleBasePriceCal.cgstCal : 0,
        cgstAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.cgstCal : 0,
        cgstAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.cgstCal : 0,
        cgstAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.cgstCal : 0,
        cgstAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.cgstCal : 0,

        weekEndcgstAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,
        weekEndcgstAmount1:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.cgstCal : 0,
        weekEndcgstAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.cgstCal : 0,
        weekEndcgstAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.cgstCal : 0,
        weekEndcgstAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,

        // sgst amount
        sgstAmount: event.target.value.length !== 0 ? HandleBasePriceCal.sgstCal : 0,
        sgstAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.sgstCal : 0,
        sgstAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.sgstCal : 0,
        sgstAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.sgstCal : 0,
        sgstAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.sgstCal : 0,

        weekEndsgstAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,
        weekEndsgstAmount1:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.sgstCal : 0,
        weekEndsgstAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.sgstCal : 0,
        weekEndsgstAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.sgstCal : 0,
        weekEndsgstAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,

        // sp amount
        spAmount : event.target.value.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,
        minBaseSpAmount: event.target.value.length !== 0 ? HandleBasePriceCal1.SPUserPrice : 0,
        minBaseSpAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.SPUserPrice : 0,
        minBaseSpAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.SPUserPrice : 0,
        minBaseSpAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,

        weekEndSpAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,
        weekEndMinBaseSpAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.SPUserPrice : 0,
        weekEndMinBaseSpAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.SPUserPrice : 0,
        weekEndMinBaseSpAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.SPUserPrice : 0,
        weekEndMinBaseSpAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,

        // PG amount
        PGAmount: event.target.value.length !== 0 ? HandleBasePriceCal.paymentCal : 0,
        PGAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.paymentCal : 0,
        PGAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.paymentCal : 0,
        PGAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.paymentCal : 0,
        PGAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.paymentCal : 0,

        weekEndPGAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,
        weekEndPGAmount1: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.paymentCal : 0,
        weekEndPGAmount2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.paymentCal : 0,
        weekEndPGAmount3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.paymentCal : 0,
        weekEndPGAmount4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,

        // EDWithOutDiscountFinalPrice : event.target.value.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
        SPWithOutDiscountFinalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.SPWithOutDiscountFinalPrice : 0,

      // with out discount EU amount
        wdTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice2 : event.target.value.length !== 0 ? HandleBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice3 : event.target.value.length !== 0 ? HandleBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice4 : event.target.value.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        weekEndWdTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        // EU total amount
        totalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,
        minBaseTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal1.EndUserPrice : 0,
        minBaseTotalPrice2 : event.target.value.length !== 0 ? HandleBasePriceCal2.EndUserPrice : 0,
        minBaseTotalPrice3: event.target.value.length !== 0 ? HandleBasePriceCal3.EndUserPrice : 0,
        minBaseTotalPrice4: event.target.value.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,

        weekEndTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0,
        weekEndMinBaseTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.EndUserPrice : 0,
        weekEndMinBaseTotalPrice2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.EndUserPrice : 0,
        weekEndMinBaseTotalPrice3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.EndUserPrice : 0,
        weekEndMinBaseTotalPrice4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0 })
    }
    this.props.handlePricingChange(false)
  }
  HandleWeekdayMinPrice2 (event) {
    if (this.state.minBasePriceUnit === '24<=>Per Day') {
      const basePrice = event.target.value
      let HandleBasePriceCal = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal1 = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal2 = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal3 = this.HandleBasePriceCal(basePrice)

      // const weekEndbasePrice = event.target.value
      // let HandleWeekEndBasePriceCal = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      // let HandleWeekEndBasePriceCal1 = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      // let HandleWeekEndBasePriceCal2 = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      // let HandleWeekEndBasePriceCal3 = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      this.setState({
        errorMessage: '',
        // base price
        basePrice: basePrice,
        // weekEndBasePrice: weekEndbasePrice,

        // min base price
        minBasePrice : event.target.value.length !== 0 ? basePrice : 0,
        minBasePrice2 : event.target.value.length !== 0 ? basePrice : 0,
        minBasePrice3 : event.target.value.length !== 0 ? basePrice : 0,
        minBasePrice4 : event.target.value.length !== 0 ? basePrice : 0,

        // weekEndMinBasePrice : event.target.value.length !== 0 ? weekEndbasePrice : 0,
        // weekEndMinBasePrice2 : event.target.value.length !== 0 ? weekEndbasePrice : 0,
        // weekEndMinBasePrice3 : event.target.value.length !== 0 ? weekEndbasePrice : 0,
        // weekEndMinBasePrice4 : event.target.value.length !== 0 ? weekEndbasePrice : 0,

        // discounts
        basePriceDiscount: event.target.value.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,
        basePriceDiscount1: event.target.value.length !== 0 ? HandleBasePriceCal1.basePriceDiscountCal : 0,
        basePriceDiscount2: event.target.value.length !== 0 ? HandleBasePriceCal2.basePriceDiscountCal : 0,
        basePriceDiscount3: event.target.value.length !== 0 ? HandleBasePriceCal3.basePriceDiscountCal : 0,
        basePriceDiscount4: event.target.value.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,

        // weekEndbasePriceDiscount : event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,
        // weekEndbasePriceDiscount1: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.basePriceDiscountCal : 0,
        // weekEndbasePriceDiscount2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.basePriceDiscountCal : 0,
        // weekEndbasePriceDiscount3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.basePriceDiscountCal : 0,
        // weekEndbasePriceDiscount4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,

        // app charges
        appCharges: event.target.value.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,
        minBaseAppCharges: event.target.value.length !== 0 ? HandleBasePriceCal1.appPercentageCal : 0,
        minBaseAppCharges2: event.target.value.length !== 0 ? HandleBasePriceCal2.appPercentageCal : 0,
        minBaseAppCharges3: event.target.value.length !== 0 ? HandleBasePriceCal3.appPercentageCal : 0,
        minBaseAppCharges4: event.target.value.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,

        // weekEndAppCharges: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,
        // weekEndMinBaseAppCharges:  event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.appPercentageCal : 0,
        // weekEndMinBaseAppCharges2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.appPercentageCal : 0,
        // weekEndMinBaseAppCharges3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.appPercentageCal : 0,
        // weekEndMinBaseAppCharges4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,

        // cgst amount
        cgstAmount: event.target.value.length !== 0 ? HandleBasePriceCal.cgstCal : 0,
        cgstAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.cgstCal : 0,
        cgstAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.cgstCal : 0,
        cgstAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.cgstCal : 0,
        cgstAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.cgstCal : 0,

        // weekEndcgstAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,
        // weekEndcgstAmount1:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.cgstCal : 0,
        // weekEndcgstAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.cgstCal : 0,
        // weekEndcgstAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.cgstCal : 0,
        // weekEndcgstAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,

        // sgst amount
        sgstAmount: event.target.value.length !== 0 ? HandleBasePriceCal.sgstCal : 0,
        sgstAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.sgstCal : 0,
        sgstAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.sgstCal : 0,
        sgstAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.sgstCal : 0,
        sgstAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.sgstCal : 0,

        // weekEndsgstAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,
        // weekEndsgstAmount1:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.sgstCal : 0,
        // weekEndsgstAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.sgstCal : 0,
        // weekEndsgstAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.sgstCal : 0,
        // weekEndsgstAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,

        // sp amount
        spAmount : event.target.value.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,
        minBaseSpAmount: event.target.value.length !== 0 ? HandleBasePriceCal1.SPUserPrice : 0,
        minBaseSpAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.SPUserPrice : 0,
        minBaseSpAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.SPUserPrice : 0,
        minBaseSpAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,

        // weekEndSpAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,
        // weekEndMinBaseSpAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.SPUserPrice : 0,
        // weekEndMinBaseSpAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.SPUserPrice : 0,
        // weekEndMinBaseSpAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.SPUserPrice : 0,
        // weekEndMinBaseSpAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,

        // PG amount
        PGAmount: event.target.value.length !== 0 ? HandleBasePriceCal.paymentCal : 0,
        PGAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.paymentCal : 0,
        PGAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.paymentCal : 0,
        PGAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.paymentCal : 0,
        PGAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.paymentCal : 0,

        // weekEndPGAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,
        // weekEndPGAmount1: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.paymentCal : 0,
        // weekEndPGAmount2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.paymentCal : 0,
        // weekEndPGAmount3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.paymentCal : 0,
        // weekEndPGAmount4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,

        // EDWithOutDiscountFinalPrice : event.target.value.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
        // SPWithOutDiscountFinalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.SPWithOutDiscountFinalPrice : 0,

        // with out discount EU amount
        wdTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice2 : event.target.value.length !== 0 ? HandleBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice3 : event.target.value.length !== 0 ? HandleBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice4 : event.target.value.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        // weekEndWdTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        // weekEndMinBaseWdTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        // weekEndMinBaseWdTotalPrice2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        // weekEndMinBaseWdTotalPrice3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        // weekEndMinBaseWdTotalPrice4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        // EU total amount
        totalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,
        minBaseTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal1.EndUserPrice : 0,
        minBaseTotalPrice2 : event.target.value.length !== 0 ? HandleBasePriceCal2.EndUserPrice : 0,
        minBaseTotalPrice3: event.target.value.length !== 0 ? HandleBasePriceCal3.EndUserPrice : 0,
        minBaseTotalPrice4: event.target.value.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0 })

        // weekEndTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0,
        // weekEndMinBaseTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.EndUserPrice : 0,
        // weekEndMinBaseTotalPrice2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.EndUserPrice : 0,
        // weekEndMinBaseTotalPrice3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.EndUserPrice : 0,
        // weekEndMinBaseTotalPrice4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0
    } else {
      const basePrice = event.target.value
      const StringLength = basePrice.length
      const charfind = basePrice.charAt(0)
      let FirstChar = basePrice.length !== 0 ? charfind < 5 ? 1 : 5 : ''
      let FirstChar1 = basePrice.length > 2 ? parseInt(FirstChar + '0'.repeat(StringLength - 2)) : 0
      // let minBasePrice = Math.ceil((basePrice / 4) * 1 + FirstChar1)
      // let minBasePrice2 = Math.ceil((basePrice / 4) * 2 + FirstChar1)
      // let minBasePrice3 = Math.ceil((basePrice / 4) * 3 + FirstChar1)
      let minBasePrice = Math.ceil(basePrice / 100 * 50)
      let minBasePrice2 = Math.ceil(basePrice / 100 * 75)
      let minBasePrice3 = Math.ceil(basePrice / 100 * 90)
      let HandleBasePriceCal = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal1 = this.HandleBasePriceCal(minBasePrice)
      let HandleBasePriceCal2 = this.HandleBasePriceCal(minBasePrice2)
      let HandleBasePriceCal3 = this.HandleBasePriceCal(minBasePrice3)
      this.setState({
        errorMessage: '',
        basePrice: basePrice,
        minBasePrice : event.target.value.length !== 0 ? minBasePrice : 0,
        minBasePrice2 : event.target.value.length !== 0 ? minBasePrice2 : 0,
        minBasePrice3 : event.target.value.length !== 0 ? minBasePrice3 : 0,
        minBasePrice4 : event.target.value.length !== 0 ? basePrice : 0,

        basePriceDiscount: event.target.value.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,
        basePriceDiscount1: event.target.value.length !== 0 ? HandleBasePriceCal1.basePriceDiscountCal : 0,
        basePriceDiscount2: event.target.value.length !== 0 ? HandleBasePriceCal2.basePriceDiscountCal : 0,
        basePriceDiscount3: event.target.value.length !== 0 ? HandleBasePriceCal3.basePriceDiscountCal : 0,
        basePriceDiscount4: event.target.value.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,

        appCharges: event.target.value.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,
        minBaseAppCharges: event.target.value.length !== 0 ? HandleBasePriceCal1.appPercentageCal : 0,
        minBaseAppCharges2: event.target.value.length !== 0 ? HandleBasePriceCal2.appPercentageCal : 0,
        minBaseAppCharges3: event.target.value.length !== 0 ? HandleBasePriceCal3.appPercentageCal : 0,
        minBaseAppCharges4: event.target.value.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,

        cgstAmount: event.target.value.length !== 0 ? HandleBasePriceCal.cgstCal : 0,
        cgstAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.cgstCal : 0,
        cgstAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.cgstCal : 0,
        cgstAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.cgstCal : 0,
        cgstAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.cgstCal : 0,

        sgstAmount: event.target.value.length !== 0 ? HandleBasePriceCal.sgstCal : 0,
        sgstAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.sgstCal : 0,
        sgstAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.sgstCal : 0,
        sgstAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.sgstCal : 0,
        sgstAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.sgstCal : 0,

        spAmount : event.target.value.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,
        minBaseSpAmount: event.target.value.length !== 0 ? HandleBasePriceCal1.SPUserPrice : 0,
        minBaseSpAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.SPUserPrice : 0,
        minBaseSpAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.SPUserPrice : 0,
        minBaseSpAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,

        PGAmount: event.target.value.length !== 0 ? HandleBasePriceCal.paymentCal : 0,
        PGAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.paymentCal : 0,
        PGAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.paymentCal : 0,
        PGAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.paymentCal : 0,
        PGAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.paymentCal : 0,

        wdTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice2 : event.target.value.length !== 0 ? HandleBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice3 : event.target.value.length !== 0 ? HandleBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice4 : event.target.value.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        totalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,
        minBaseTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal1.EndUserPrice : 0,
        minBaseTotalPrice2 : event.target.value.length !== 0 ? HandleBasePriceCal2.EndUserPrice : 0,
        minBaseTotalPrice3: event.target.value.length !== 0 ? HandleBasePriceCal3.EndUserPrice : 0,
        minBaseTotalPrice4: event.target.value.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0 })
    }
    this.props.handlePricingChange(false)
  }
  HandleBasePriceCal (basePrice) {
    const basePriceDiscountCal = Math.floor(basePrice / 100 * this.state.weekdayDiscount) // discount for base price
    const discountCal = basePrice - basePriceDiscountCal // price after baseprice - discount price
    const appPercentageCal = Math.ceil(basePrice / 100 * this.state.appPercentage)
    const cgstCal = Math.ceil(discountCal / 100 * (this.state.cgstPercentage))
    const sgstCal = Math.ceil(discountCal / 100 * (this.state.sgstPercentage))
    const gstWithCal = discountCal / 100 * (this.state.cgstPercentage + this.state.sgstPercentage)
    const gstwithOutCal = basePrice / 100 * (this.state.cgstPercentage + this.state.sgstPercentage)
// change
    const finalPrice = Math.ceil(((discountCal + Math.ceil(this.state.serviceCharges)) + (this.state.otherCharges + gstWithCal)) + appPercentageCal)
    const paymentCal = Math.ceil(finalPrice / 100 * this.state.appPgPercentage)
    const EndUserPrice = Math.ceil((finalPrice + paymentCal))
    const SPUserPrice = Math.floor((parseInt(EndUserPrice) - parseInt(paymentCal)) - parseInt(appPercentageCal))
    const withOutDiscountPrice = parseInt(basePrice) + parseInt(this.state.serviceCharges) + parseInt(this.state.otherCharges) + parseInt(gstwithOutCal) + parseInt(appPercentageCal)
    const paymentDisCal = Math.ceil(withOutDiscountPrice / 100 * this.state.appPgPercentage)
    const EDWithOutDiscountFinalPrice = Math.ceil(withOutDiscountPrice + paymentDisCal)
    const SPWithOutDiscountFinalPrice = parseInt(EDWithOutDiscountFinalPrice) - parseInt(paymentCal) - parseInt(appPercentageCal)
    return { basePriceDiscountCal, appPercentageCal, cgstCal, sgstCal, SPUserPrice, paymentCal, SPWithOutDiscountFinalPrice, EDWithOutDiscountFinalPrice, EndUserPrice }
  }

  handleMinBasePrice1 (event) {
    let handleMinBasePrice1 = this.HandleBasePriceCal(event.target.value)
    this.setState({
      errorMessage: '',
      minBasePrice : event.target.value.length !== 0 ? event.target.value : '',
      basePriceDiscount1: event.target.value.length !== 0 ? handleMinBasePrice1.basePriceDiscountCal : 0,
      minBaseAppCharges: event.target.value.length !== 0 ? handleMinBasePrice1.appPercentageCal : 0,
      cgstAmount1: event.target.value.length !== 0 ? handleMinBasePrice1.cgstCal : 0,
      sgstAmount1: event.target.value.length !== 0 ? handleMinBasePrice1.sgstCal : 0,
      minBaseSpAmount: event.target.value.length !== 0 ? handleMinBasePrice1.SPUserPrice : 0,
      PGAmount1: event.target.value.length !== 0 ? handleMinBasePrice1.paymentCal : 0,
      // EDWithOutDiscountFinalPrice : event.target.value.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
      SPWithOutDiscountFinalPrice : event.target.value.length !== 0 ? handleMinBasePrice1.SPWithOutDiscountFinalPrice : 0,
      minBaseWdTotalPrice : event.target.value.length !== 0 ? handleMinBasePrice1.EDWithOutDiscountFinalPrice : 0,
      minBaseTotalPrice : event.target.value.length !== 0 ? handleMinBasePrice1.EndUserPrice : 0 })
    this.props.handlePricingChange(false)
  }

  handleMinBasePrice2 (event) {
    let handleMinBasePrice2 = this.HandleBasePriceCal(event.target.value)
    this.setState({
      errorMessage: '',
      minBasePrice2 : event.target.value.length !== 0 ? event.target.value : '',
      basePriceDiscount2: event.target.value.length !== 0 ? handleMinBasePrice2.basePriceDiscountCal : 0,
      minBaseAppCharges2: event.target.value.length !== 0 ? handleMinBasePrice2.appPercentageCal : 0,
      cgstAmount2: event.target.value.length !== 0 ? handleMinBasePrice2.cgstCal : 0,
      sgstAmount2: event.target.value.length !== 0 ? handleMinBasePrice2.sgstCal : 0,
      minBaseSpAmount2: event.target.value.length !== 0 ? handleMinBasePrice2.SPUserPrice : 0,
      PGAmount2: event.target.value.length !== 0 ? handleMinBasePrice2.paymentCal : 0,
      // EDWithOutDiscountFinalPrice : event.target.value.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
      SPWithOutDiscountFinalPrice : event.target.value.length !== 0 ? handleMinBasePrice2.SPWithOutDiscountFinalPrice : 0,
      minBaseWdTotalPrice2 : event.target.value.length !== 0 ? handleMinBasePrice2.EDWithOutDiscountFinalPrice : 0,
      minBaseTotalPrice2 : event.target.value.length !== 0 ? handleMinBasePrice2.EndUserPrice : 0 })
    this.props.handlePricingChange(false)
  }

  handleMinBasePrice3 (event) {
    let handleMinBasePrice3 = this.HandleBasePriceCal(event.target.value)
    this.setState({
      errorMessage: '',
      minBasePrice3 : event.target.value.length !== 0 ? event.target.value : '',
      basePriceDiscount3: event.target.value.length !== 0 ? handleMinBasePrice3.basePriceDiscountCal : 0,
      minBaseAppCharges3: event.target.value.length !== 0 ? handleMinBasePrice3.appPercentageCal : 0,
      cgstAmount3: event.target.value.length !== 0 ? handleMinBasePrice3.cgstCal : 0,
      sgstAmount3: event.target.value.length !== 0 ? handleMinBasePrice3.sgstCal : 0,
      minBaseSpAmount3: event.target.value.length !== 0 ? handleMinBasePrice3.SPUserPrice : 0,
      PGAmount3: event.target.value.length !== 0 ? handleMinBasePrice3.paymentCal : 0,
      // EDWithOutDiscountFinalPrice : event.target.value.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
      SPWithOutDiscountFinalPrice : event.target.value.length !== 0 ? handleMinBasePrice3.SPWithOutDiscountFinalPrice : 0,
      minBaseWdTotalPrice3 : event.target.value.length !== 0 ? handleMinBasePrice3.EDWithOutDiscountFinalPrice : 0,
      minBaseTotalPrice3 : event.target.value.length !== 0 ? handleMinBasePrice3.EndUserPrice : 0 })
    this.props.handlePricingChange(false)
  }

  handleMinBasePrice4 (event) {
    let handleMinBasePrice4 = this.HandleBasePriceCal(event.target.value)
    this.setState({
      errorMessage: '',
      minBasePrice4 : event.target.value.length !== 0 ? event.target.value : '',
      basePriceDiscount4: event.target.value.length !== 0 ? handleMinBasePrice4.basePriceDiscountCal : 0,
      minBaseAppCharges4: event.target.value.length !== 0 ? handleMinBasePrice4.appPercentageCal : 0,
      cgstAmount4: event.target.value.length !== 0 ? handleMinBasePrice4.cgstCal : 0,
      sgstAmount4: event.target.value.length !== 0 ? handleMinBasePrice4.sgstCal : 0,
      minBaseSpAmount4: event.target.value.length !== 0 ? handleMinBasePrice4.SPUserPrice : 0,
      PGAmount4: event.target.value.length !== 0 ? handleMinBasePrice4.paymentCal : 0,
      // EDWithOutDiscountFinalPrice : event.target.value.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
      SPWithOutDiscountFinalPrice : event.target.value.length !== 0 ? handleMinBasePrice4.SPWithOutDiscountFinalPrice : 0,
      minBaseWdTotalPrice4 : event.target.value.length !== 0 ? handleMinBasePrice4.EDWithOutDiscountFinalPrice : 0,
      minBaseTotalPrice4 : event.target.value.length !== 0 ? handleMinBasePrice4.EndUserPrice : 0 })
    this.props.handlePricingChange(false)
  }

  handleWeekEndPrice = (event) => {
    if (this.state.minBasePriceUnit === '24<=>Per Day') {
      // const basePrice = event.target.value
      // let HandleBasePriceCal = this.HandleBasePriceCal(basePrice)
      // let HandleBasePriceCal1 = this.HandleBasePriceCal(basePrice)
      // let HandleBasePriceCal2 = this.HandleBasePriceCal(basePrice)
      // let HandleBasePriceCal3 = this.HandleBasePriceCal(basePrice)

      const weekEndbasePrice = event.target.value
      let HandleWeekEndBasePriceCal = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      let HandleWeekEndBasePriceCal1 = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      let HandleWeekEndBasePriceCal2 = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      let HandleWeekEndBasePriceCal3 = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      this.setState({
        errorMessage: '',
        // base price
        // basePrice: basePrice,
        weekEndBasePrice: weekEndbasePrice,

        // min base price
        // minBasePrice : event.target.value.length !== 0 ? basePrice : 0,
        // minBasePrice2 : event.target.value.length !== 0 ? basePrice : 0,
        // minBasePrice3 : event.target.value.length !== 0 ? basePrice : 0,
        // minBasePrice4 : event.target.value.length !== 0 ? basePrice : 0,

        weekEndMinBasePrice : event.target.value.length !== 0 ? weekEndbasePrice : 0,
        weekEndMinBasePrice2 : event.target.value.length !== 0 ? weekEndbasePrice : 0,
        weekEndMinBasePrice3 : event.target.value.length !== 0 ? weekEndbasePrice : 0,
        weekEndMinBasePrice4 : event.target.value.length !== 0 ? weekEndbasePrice : 0,

        // discounts
        // basePriceDiscount: event.target.value.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,
        // basePriceDiscount1: event.target.value.length !== 0 ? HandleBasePriceCal1.basePriceDiscountCal : 0,
        // basePriceDiscount2: event.target.value.length !== 0 ? HandleBasePriceCal2.basePriceDiscountCal : 0,
        // basePriceDiscount3: event.target.value.length !== 0 ? HandleBasePriceCal3.basePriceDiscountCal : 0,
        // basePriceDiscount4: event.target.value.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,

        weekEndbasePriceDiscount : event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount1: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,

        // app charges
        // appCharges: event.target.value.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,
        // minBaseAppCharges: event.target.value.length !== 0 ? HandleBasePriceCal1.appPercentageCal : 0,
        // minBaseAppCharges2: event.target.value.length !== 0 ? HandleBasePriceCal2.appPercentageCal : 0,
        // minBaseAppCharges3: event.target.value.length !== 0 ? HandleBasePriceCal3.appPercentageCal : 0,
        // minBaseAppCharges4: event.target.value.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,

        weekEndAppCharges: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,
        weekEndMinBaseAppCharges:  event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.appPercentageCal : 0,
        weekEndMinBaseAppCharges2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.appPercentageCal : 0,
        weekEndMinBaseAppCharges3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.appPercentageCal : 0,
        weekEndMinBaseAppCharges4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,

        // cgst amount
        // cgstAmount: event.target.value.length !== 0 ? HandleBasePriceCal.cgstCal : 0,
        // cgstAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.cgstCal : 0,
        // cgstAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.cgstCal : 0,
        // cgstAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.cgstCal : 0,
        // cgstAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.cgstCal : 0,

        weekEndcgstAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,
        weekEndcgstAmount1:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.cgstCal : 0,
        weekEndcgstAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.cgstCal : 0,
        weekEndcgstAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.cgstCal : 0,
        weekEndcgstAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,

        // sgst amount
        // sgstAmount: event.target.value.length !== 0 ? HandleBasePriceCal.sgstCal : 0,
        // sgstAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.sgstCal : 0,
        // sgstAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.sgstCal : 0,
        // sgstAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.sgstCal : 0,
        // sgstAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.sgstCal : 0,

        weekEndsgstAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,
        weekEndsgstAmount1:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.sgstCal : 0,
        weekEndsgstAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.sgstCal : 0,
        weekEndsgstAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.sgstCal : 0,
        weekEndsgstAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,

        // sp amount
        // spAmount : event.target.value.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,
        // minBaseSpAmount: event.target.value.length !== 0 ? HandleBasePriceCal1.SPUserPrice : 0,
        // minBaseSpAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.SPUserPrice : 0,
        // minBaseSpAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.SPUserPrice : 0,
        // minBaseSpAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,

        weekEndSpAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,
        weekEndMinBaseSpAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.SPUserPrice : 0,
        weekEndMinBaseSpAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.SPUserPrice : 0,
        weekEndMinBaseSpAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.SPUserPrice : 0,
        weekEndMinBaseSpAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,

        // PG amount
        // PGAmount: event.target.value.length !== 0 ? HandleBasePriceCal.paymentCal : 0,
        // PGAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.paymentCal : 0,
        // PGAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.paymentCal : 0,
        // PGAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.paymentCal : 0,
        // PGAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.paymentCal : 0,

        weekEndPGAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,
        weekEndPGAmount1: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.paymentCal : 0,
        weekEndPGAmount2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.paymentCal : 0,
        weekEndPGAmount3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.paymentCal : 0,
        weekEndPGAmount4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,

        // EDWithOutDiscountFinalPrice : event.target.value.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
        // SPWithOutDiscountFinalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.SPWithOutDiscountFinalPrice : 0,

        // with out discount EU amount
        // wdTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        // minBaseWdTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        // minBaseWdTotalPrice2 : event.target.value.length !== 0 ? HandleBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        // minBaseWdTotalPrice3 : event.target.value.length !== 0 ? HandleBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        // minBaseWdTotalPrice4 : event.target.value.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        weekEndWdTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        // EU total amount
        // totalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,
        // minBaseTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal1.EndUserPrice : 0,
        // minBaseTotalPrice2 : event.target.value.length !== 0 ? HandleBasePriceCal2.EndUserPrice : 0,
        // minBaseTotalPrice3: event.target.value.length !== 0 ? HandleBasePriceCal3.EndUserPrice : 0,
        // minBaseTotalPrice4: event.target.value.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0 })

        weekEndTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0,
        weekEndMinBaseTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.EndUserPrice : 0,
        weekEndMinBaseTotalPrice2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.EndUserPrice : 0,
        weekEndMinBaseTotalPrice3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.EndUserPrice : 0,
        weekEndMinBaseTotalPrice4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0 })
    } else {
      const weekEndBasePrice = event.target.value
      const StringLength = weekEndBasePrice.length
      const charfind = weekEndBasePrice.charAt(0)
      let FirstChar = weekEndBasePrice.length !== 0 ? charfind < 5 ? 1 : 5 : ''
      let FirstChar1 = weekEndBasePrice.length > 2 ? parseInt(FirstChar + '0'.repeat(StringLength - 2)) : 0
      // let weekEndMinBasePrice = Math.ceil((weekEndBasePrice / 4) * 1 + FirstChar1)
      // let weekEndMinBasePrice2 = Math.ceil((weekEndBasePrice / 4) * 2 + FirstChar1)
      // let weekEndMinBasePrice3 = Math.ceil((weekEndBasePrice / 4) * 3 + FirstChar1)
      let weekEndMinBasePrice = Math.ceil(weekEndBasePrice / 100 * 50)
      let weekEndMinBasePrice2 = Math.ceil(weekEndBasePrice / 100 * 75)
      let weekEndMinBasePrice3 = Math.ceil(weekEndBasePrice / 100 * 90)

      let HandleWeekEndBasePriceCal = this.HandleWeekEndBasePriceCal(weekEndBasePrice)
      let HandleWeekEndBasePriceCal1 = this.HandleWeekEndBasePriceCal(weekEndMinBasePrice)
      let HandleWeekEndBasePriceCal2 = this.HandleWeekEndBasePriceCal(weekEndMinBasePrice2)
      let HandleWeekEndBasePriceCal3 = this.HandleWeekEndBasePriceCal(weekEndMinBasePrice3)

      this.setState({
        errorMessage: '',
        weekEndEdit: event.target.value.length !== 0 ? false : true,

        weekEndBasePrice: weekEndBasePrice,
        weekEndMinBasePrice : event.target.value.length !== 0 ? weekEndMinBasePrice : 0,
        weekEndMinBasePrice2 : event.target.value.length !== 0 ? weekEndMinBasePrice2 : 0,
        weekEndMinBasePrice3 : event.target.value.length !== 0 ? weekEndMinBasePrice3 : 0,
        weekEndMinBasePrice4 : event.target.value.length !== 0 ? weekEndBasePrice : 0,

        weekEndbasePriceDiscount : event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount1: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,

        weekEndAppCharges: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,
        weekEndMinBaseAppCharges:  event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.appPercentageCal : 0,
        weekEndMinBaseAppCharges2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.appPercentageCal : 0,
        weekEndMinBaseAppCharges3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.appPercentageCal : 0,
        weekEndMinBaseAppCharges4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,

        weekEndcgstAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,
        weekEndcgstAmount1:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.cgstCal : 0,
        weekEndcgstAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.cgstCal : 0,
        weekEndcgstAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.cgstCal : 0,
        weekEndcgstAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,

        weekEndsgstAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,
        weekEndsgstAmount1:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.sgstCal : 0,
        weekEndsgstAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.sgstCal : 0,
        weekEndsgstAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.sgstCal : 0,
        weekEndsgstAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,

        weekEndSpAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,
        weekEndMinBaseSpAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.SPUserPrice : 0,
        weekEndMinBaseSpAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.SPUserPrice : 0,
        weekEndMinBaseSpAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.SPUserPrice : 0,
        weekEndMinBaseSpAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,

        weekEndPGAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,
        weekEndPGAmount1: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.paymentCal : 0,
        weekEndPGAmount2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.paymentCal : 0,
        weekEndPGAmount3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.paymentCal : 0,
        weekEndPGAmount4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,

        weekEndWdTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        weekEndTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0,
        weekEndMinBaseTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.EndUserPrice : 0,
        weekEndMinBaseTotalPrice2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.EndUserPrice : 0,
        weekEndMinBaseTotalPrice3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.EndUserPrice : 0,
        weekEndMinBaseTotalPrice4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0

      // totalPrice : event.target.value.length !== 0 ? EndUserPrice : 0,
      // SPFinalPrice : event.target.value.length !== 0 ? SPUserPrice : 0,
      // EDWithOutDiscountFinalPrice : event.target.value.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
      // SPWithOutDiscountFinalPrice : event.target.value.length !== 0 ? SPWithOutDiscountFinalPrice : 0
      })
    }
    this.props.handlePricingChange(false)
  }

  HandleWeekEndBasePriceCal (weekEndBasePrice) {
    const basePriceDiscountCal = Math.floor(weekEndBasePrice / 100 * this.state.weekEndDiscount) // discount for base price
    const discountCal = weekEndBasePrice - basePriceDiscountCal
    const appPercentageCal = Math.ceil(weekEndBasePrice / 100 * this.state.appPercentage)
    const cgstCal = Math.ceil(discountCal / 100 * (this.state.cgstPercentage))
    const sgstCal = Math.ceil(discountCal / 100 * (this.state.sgstPercentage))
    const gstWithCal = discountCal / 100 * (this.state.cgstPercentage + this.state.sgstPercentage)
    const gstwithOutCal = weekEndBasePrice / 100 * (this.state.cgstPercentage + this.state.sgstPercentage)
    const finalPrice = discountCal + this.state.serviceCharges + this.state.otherCharges + gstWithCal + appPercentageCal
    const paymentCal = Math.ceil(finalPrice / 100 * this.state.appPgPercentage)
    const EndUserPrice = Math.ceil(finalPrice + paymentCal)
    const SPUserPrice = Math.ceil((parseInt(EndUserPrice) - parseInt(paymentCal)) - parseInt(appPercentageCal))
    const withOutDiscountPrice = parseInt(weekEndBasePrice) + parseInt(this.state.serviceCharges) + parseInt(this.state.otherCharges) + parseInt(gstwithOutCal) + parseInt(appPercentageCal)
    const paymentDisCal = Math.ceil(withOutDiscountPrice / 100 * this.state.appPgPercentage)
    const EDWithOutDiscountFinalPrice = Math.ceil(withOutDiscountPrice + paymentDisCal)
    const SPWithOutDiscountFinalPrice = parseInt(EDWithOutDiscountFinalPrice) - parseInt(paymentCal) - parseInt(appPercentageCal)
    return { basePriceDiscountCal, appPercentageCal, cgstCal, sgstCal, SPUserPrice, paymentCal, SPWithOutDiscountFinalPrice, EDWithOutDiscountFinalPrice, EndUserPrice }
  }

  handleWeekEndMinBasePrice1 (weekEndBasePrice) {
    let handleWeekEndMinBasePrice1 = this.HandleWeekEndBasePriceCal(weekEndBasePrice.target.value)
    this.setState({
      errorMessage: '',
      weekEndEdit: event.target.value.length !== 0 ? false : true,
      weekEndMinBasePrice : event.target.value.length !== 0 ? weekEndBasePrice.target.value : '',
      weekEndbasePriceDiscount1: event.target.value.length !== 0 ? handleWeekEndMinBasePrice1.basePriceDiscountCal : 0,
      weekEndMinBaseAppCharges:  event.target.value.length !== 0 ? handleWeekEndMinBasePrice1.appPercentageCal : 0,
      weekEndcgstAmount1:event.target.value.length !== 0 ? handleWeekEndMinBasePrice1.cgstCal : 0,
      weekEndsgstAmount1:event.target.value.length !== 0 ? handleWeekEndMinBasePrice1.sgstCal : 0,
      weekEndMinBaseSpAmount: event.target.value.length !== 0 ? handleWeekEndMinBasePrice1.SPUserPrice : 0,
      weekEndPGAmount1: event.target.value.length !== 0 ? handleWeekEndMinBasePrice1.paymentCal : 0,
      weekEndMinBaseWdTotalPrice: event.target.value.length !== 0 ? handleWeekEndMinBasePrice1.EDWithOutDiscountFinalPrice : 0,
      weekEndMinBaseTotalPrice: event.target.value.length !== 0 ? handleWeekEndMinBasePrice1.EndUserPrice : 0
    })
    this.props.handlePricingChange(false)
  }

  handleWeekEndMinBasePrice2 (weekEndBasePrice) {
    let handleWeekEndMinBasePrice2 = this.HandleWeekEndBasePriceCal(weekEndBasePrice.target.value)
    this.setState({
      errorMessage: '',
      weekEndEdit: event.target.value.length !== 0 ? false : true,
      weekEndMinBasePrice2 : event.target.value.length !== 0 ? weekEndBasePrice.target.value : '',
      weekEndbasePriceDiscount2: event.target.value.length !== 0 ? handleWeekEndMinBasePrice2.basePriceDiscountCal : 0,
      weekEndMinBaseAppCharges2:  event.target.value.length !== 0 ? handleWeekEndMinBasePrice2.appPercentageCal : 0,
      weekEndcgstAmount2:event.target.value.length !== 0 ? handleWeekEndMinBasePrice2.cgstCal : 0,
      weekEndsgstAmount2:event.target.value.length !== 0 ? handleWeekEndMinBasePrice2.sgstCal : 0,
      weekEndMinBaseSpAmount2: event.target.value.length !== 0 ? handleWeekEndMinBasePrice2.SPUserPrice : 0,
      weekEndPGAmount2: event.target.value.length !== 0 ? handleWeekEndMinBasePrice2.paymentCal : 0,
      weekEndMinBaseWdTotalPrice2: event.target.value.length !== 0 ? handleWeekEndMinBasePrice2.EDWithOutDiscountFinalPrice : 0,
      weekEndMinBaseTotalPrice2: event.target.value.length !== 0 ? handleWeekEndMinBasePrice2.EndUserPrice : 0
    })
    this.props.handlePricingChange(false)
  }

  handleWeekEndMinBasePrice3 (weekEndBasePrice) {
    let handleWeekEndMinBasePrice3 = this.HandleWeekEndBasePriceCal(weekEndBasePrice.target.value)
    this.setState({
      errorMessage: '',
      weekEndEdit: event.target.value.length !== 0 ? false : true,
      weekEndMinBasePrice3 : event.target.value.length !== 0 ? weekEndBasePrice.target.value : '',
      weekEndbasePriceDiscount3: event.target.value.length !== 0 ? handleWeekEndMinBasePrice3.basePriceDiscountCal : 0,
      weekEndMinBaseAppCharges3:  event.target.value.length !== 0 ? handleWeekEndMinBasePrice3.appPercentageCal : 0,
      weekEndcgstAmount3:event.target.value.length !== 0 ? handleWeekEndMinBasePrice3.cgstCal : 0,
      weekEndsgstAmount3:event.target.value.length !== 0 ? handleWeekEndMinBasePrice3.sgstCal : 0,
      weekEndMinBaseSpAmount3: event.target.value.length !== 0 ? handleWeekEndMinBasePrice3.SPUserPrice : 0,
      weekEndPGAmount3: event.target.value.length !== 0 ? handleWeekEndMinBasePrice3.paymentCal : 0,
      weekEndMinBaseWdTotalPrice3: event.target.value.length !== 0 ? handleWeekEndMinBasePrice3.EDWithOutDiscountFinalPrice : 0,
      weekEndMinBaseTotalPrice3: event.target.value.length !== 0 ? handleWeekEndMinBasePrice3.EndUserPrice : 0
    })
    this.props.handlePricingChange(false)
  }

  handleWeekEndMinBasePrice4 (weekEndBasePrice) {
    let handleWeekEndMinBasePrice4 = this.HandleWeekEndBasePriceCal(weekEndBasePrice.target.value)
    this.setState({
      errorMessage: '',
      weekEndEdit: event.target.value.length !== 0 ? false : true,
      weekEndMinBasePrice4 : event.target.value.length !== 0 ? weekEndBasePrice.target.value : '',
      weekEndbasePriceDiscount4: event.target.value.length !== 0 ? handleWeekEndMinBasePrice4.basePriceDiscountCal : 0,
      weekEndMinBaseAppCharges4:  event.target.value.length !== 0 ? handleWeekEndMinBasePrice4.appPercentageCal : 0,
      weekEndcgstAmount4:event.target.value.length !== 0 ? handleWeekEndMinBasePrice4.cgstCal : 0,
      weekEndsgstAmount4:event.target.value.length !== 0 ? handleWeekEndMinBasePrice4.sgstCal : 0,
      weekEndMinBaseSpAmount4: event.target.value.length !== 0 ? handleWeekEndMinBasePrice4.SPUserPrice : 0,
      weekEndPGAmount4: event.target.value.length !== 0 ? handleWeekEndMinBasePrice4.paymentCal : 0,
      weekEndMinBaseWdTotalPrice4: event.target.value.length !== 0 ? handleWeekEndMinBasePrice4.EDWithOutDiscountFinalPrice : 0,
      weekEndMinBaseTotalPrice4: event.target.value.length !== 0 ? handleWeekEndMinBasePrice4.EndUserPrice : 0
    })
    this.props.handlePricingChange(false)
  }

  async handleCommonchange (event) {
    if (event.target.value === '') {
      event.target.value = 0
    }
    // this.setState({ serviceCharges: event.target.value, errorMessage: '' })
    switch (event.target.id) {
      case 'Service charges':
        await this.handleSetstate(event.target.id, event.target.value)
        this.handleAllCal(event)
        // this.setState({ minBasePriceUnit: item, minBasePriceUnitValue: 4 })
        break
      case 'Other charges':
        await this.handleSetstate(event.target.id, event.target.value)
        this.handleAllCal(event)
        break
      case 'CGST':
        await this.handleSetstate(event.target.id, event.target.value)
        this.handleAllCal(event)
        break
      case 'SGST':
        await this.handleSetstate(event.target.id, event.target.value)
        this.handleAllCal(event)
        break
      case 'App Percentage':
        await this.handleSetstate(event.target.id, event.target.value)
        this.handleAllCal(event)
        break
      case 'App Payment charges':
        await this.handleSetstate(event.target.id, event.target.value)
        this.handleAllCal(event)
        break
      case 'Weekday Discount':
        await this.handleSetstate(event.target.id, event.target.value)
        this.handleAllCal(event)
        break
      case 'WeekEnd Discount':
        await this.handleSetstate(event.target.id, event.target.value)
        this.handleAllCal(event)
        break
    }
    this.props.handlePricingChange(false)
  }

  handleSetstate (id, value) {
    switch (id) {
      case 'Service charges':
        this.setState({ serviceCharges : Math.ceil(value) === '' || 0 ? '' : parseInt(value), errorMessage : '' })
        break
      case 'Other charges':
        this.setState({ otherCharges : Math.ceil(value) === '' || 0 ? '' : parseInt(value), errorMessage : '' })
        break
      case 'CGST':
        this.setState({ cgstPercentage : Math.ceil(value) === '' || 0 ? '' : parseInt(value), errorMessage : '' })
        break
      case 'SGST':
        this.setState({ sgstPercentage : Math.ceil(value) === '' || 0 ? '' : parseInt(value), errorMessage : '' })
        break
      case 'App Percentage':
        this.setState({ appPercentage : Math.ceil(value) === '' || 0 ? '' : parseInt(value), errorMessage : '' })
        break
      case 'App Payment charges':
        this.setState({ appPgPercentage : Math.ceil(value) === '' || 0 ? '' : parseInt(value), errorMessage : '' })
        break
      case 'Weekday Discount':
        this.setState({ weekdayDiscount : Math.ceil(value) === '' || 0 ? '' : parseInt(value), errorMessage : '' })
        break
      case 'WeekEnd Discount':
        this.setState({ weekEndDiscount : Math.ceil(value) === '' || 0 ? '' : parseInt(value), errorMessage : '' })
        break
    }
  }

  handleAllCal () {
    // const basePrice = event.target.value
    // const StringLength = basePrice.length
    // const charfind = basePrice.charAt(0)
    // let FirstChar = basePrice.length !== 0 ? charfind < 5 ? 1 : 5 : ''
    // let FirstChar1 = basePrice.length > 2 ? parseInt(FirstChar + '0'.repeat(StringLength - 2)) : 0
    // let minBasePrice = Math.ceil((basePrice / 4) * 1 + FirstChar1)
    // let minBasePrice2 = Math.ceil((basePrice / 4) * 2 + FirstChar1)
    // let minBasePrice3 = Math.ceil((basePrice / 4) * 3 + FirstChar1)
    let basePrice = this.state.basePrice === '' ? 0 : this.state.basePrice
    let weekEndBasePrice = this.state.weekEndBasePrice === '' ? 0 : this.state.weekEndBasePrice

    let HandleBasePriceCal = this.HandleBasePriceCal(basePrice)
    let HandleBasePriceCal1 = this.HandleBasePriceCal(this.state.minBasePrice)
    let HandleBasePriceCal2 = this.HandleBasePriceCal(this.state.minBasePrice2)
    let HandleBasePriceCal3 = this.HandleBasePriceCal(this.state.minBasePrice3)

    let HandleWeekEndBasePriceCal = this.HandleWeekEndBasePriceCal(weekEndBasePrice)
    let HandleWeekEndBasePriceCal1 = this.HandleWeekEndBasePriceCal(this.state.weekEndMinBasePrice)
    let HandleWeekEndBasePriceCal2 = this.HandleWeekEndBasePriceCal(this.state.weekEndMinBasePrice2)
    let HandleWeekEndBasePriceCal3 = this.HandleWeekEndBasePriceCal(this.state.weekEndMinBasePrice3)
    this.setState({
      errorMessage: '',

      // base price
      // basePrice: basePrice,
      // weekEndBasePrice: basePrice,

      // // min base price
      // minBasePrice : event.target.value.length !== 0 ? minBasePrice : 0,
      // minBasePrice2 : event.target.value.length !== 0 ? minBasePrice2 : 0,
      // minBasePrice3 : event.target.value.length !== 0 ? minBasePrice3 : 0,
      // minBasePrice4 : event.target.value.length !== 0 ? basePrice : 0,

      // weekEndMinBasePrice : event.target.value.length !== 0 ? minBasePrice : 0,
      // weekEndMinBasePrice2 : event.target.value.length !== 0 ? minBasePrice2 : 0,
      // weekEndMinBasePrice3 : event.target.value.length !== 0 ? minBasePrice3 : 0,
      // weekEndMinBasePrice4 : event.target.value.length !== 0 ? basePrice : 0,

      // discounts
      basePriceDiscount: HandleBasePriceCal.basePriceDiscountCal,
      basePriceDiscount1: HandleBasePriceCal1.basePriceDiscountCal,
      basePriceDiscount2: HandleBasePriceCal2.basePriceDiscountCal,
      basePriceDiscount3: HandleBasePriceCal3.basePriceDiscountCal,
      basePriceDiscount4: HandleBasePriceCal.basePriceDiscountCal,

      weekEndbasePriceDiscount :  HandleWeekEndBasePriceCal.basePriceDiscountCal,
      weekEndbasePriceDiscount1:  HandleWeekEndBasePriceCal1.basePriceDiscountCal,
      weekEndbasePriceDiscount2:  HandleWeekEndBasePriceCal2.basePriceDiscountCal,
      weekEndbasePriceDiscount3:  HandleWeekEndBasePriceCal3.basePriceDiscountCal,
      weekEndbasePriceDiscount4:  HandleWeekEndBasePriceCal.basePriceDiscountCal,

      // app charges
      appCharges: HandleBasePriceCal.appPercentageCal,
      minBaseAppCharges:  HandleBasePriceCal1.appPercentageCal,
      minBaseAppCharges2: HandleBasePriceCal2.appPercentageCal,
      minBaseAppCharges3: HandleBasePriceCal3.appPercentageCal,
      minBaseAppCharges4: HandleBasePriceCal.appPercentageCal,

      weekEndAppCharges:  HandleWeekEndBasePriceCal.appPercentageCal,
      weekEndMinBaseAppCharges:  HandleWeekEndBasePriceCal1.appPercentageCal,
      weekEndMinBaseAppCharges2: HandleWeekEndBasePriceCal2.appPercentageCal,
      weekEndMinBaseAppCharges3: HandleWeekEndBasePriceCal3.appPercentageCal,
      weekEndMinBaseAppCharges4: HandleWeekEndBasePriceCal.appPercentageCal,

      // cgst amount
      cgstAmount: HandleBasePriceCal.cgstCal,
      cgstAmount1: HandleBasePriceCal1.cgstCal,
      cgstAmount2: HandleBasePriceCal2.cgstCal,
      cgstAmount3: HandleBasePriceCal3.cgstCal,
      cgstAmount4: HandleBasePriceCal.cgstCal,

      weekEndcgstAmount:  HandleWeekEndBasePriceCal.cgstCal,
      weekEndcgstAmount1: HandleWeekEndBasePriceCal1.cgstCal,
      weekEndcgstAmount2: HandleWeekEndBasePriceCal2.cgstCal,
      weekEndcgstAmount3: HandleWeekEndBasePriceCal3.cgstCal,
      weekEndcgstAmount4: HandleWeekEndBasePriceCal.cgstCal,

      // sgst amount
      sgstAmount: HandleBasePriceCal.sgstCal,
      sgstAmount1:HandleBasePriceCal1.sgstCal,
      sgstAmount2:HandleBasePriceCal2.sgstCal,
      sgstAmount3:HandleBasePriceCal3.sgstCal,
      sgstAmount4:HandleBasePriceCal.sgstCal,

      weekEndsgstAmount: HandleWeekEndBasePriceCal.sgstCal,
      weekEndsgstAmount1:HandleWeekEndBasePriceCal1.sgstCal,
      weekEndsgstAmount2:HandleWeekEndBasePriceCal2.sgstCal,
      weekEndsgstAmount3:HandleWeekEndBasePriceCal3.sgstCal,
      weekEndsgstAmount4:HandleWeekEndBasePriceCal.sgstCal,

      // sp amount
      spAmount :  HandleBasePriceCal.SPUserPrice,
      minBaseSpAmount: HandleBasePriceCal1.SPUserPrice,
      minBaseSpAmount2:HandleBasePriceCal2.SPUserPrice,
      minBaseSpAmount3:HandleBasePriceCal3.SPUserPrice,
      minBaseSpAmount4:HandleBasePriceCal.SPUserPrice,

      weekEndSpAmount:HandleWeekEndBasePriceCal.SPUserPrice,
      weekEndMinBaseSpAmount: HandleWeekEndBasePriceCal1.SPUserPrice,
      weekEndMinBaseSpAmount2:HandleWeekEndBasePriceCal2.SPUserPrice,
      weekEndMinBaseSpAmount3:HandleWeekEndBasePriceCal3.SPUserPrice,
      weekEndMinBaseSpAmount4:HandleWeekEndBasePriceCal.SPUserPrice,

      // PG amount
      PGAmount: HandleBasePriceCal.paymentCal,
      PGAmount1:HandleBasePriceCal1.paymentCal,
      PGAmount2:  HandleBasePriceCal2.paymentCal,
      PGAmount3: HandleBasePriceCal3.paymentCal,
      PGAmount4: HandleBasePriceCal.paymentCal,

      weekEndPGAmount:HandleWeekEndBasePriceCal.paymentCal,
      weekEndPGAmount1:HandleWeekEndBasePriceCal1.paymentCal,
      weekEndPGAmount2:HandleWeekEndBasePriceCal2.paymentCal,
      weekEndPGAmount3:HandleWeekEndBasePriceCal3.paymentCal,
      weekEndPGAmount4:HandleWeekEndBasePriceCal.paymentCal,

      // EDWithOutDiscountFinalPrice : event.target.value.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
      SPWithOutDiscountFinalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.SPWithOutDiscountFinalPrice : 0,

      // with out discount EU amount
      wdTotalPrice : HandleBasePriceCal.EDWithOutDiscountFinalPrice,
      minBaseWdTotalPrice :  HandleBasePriceCal1.EDWithOutDiscountFinalPrice,
      minBaseWdTotalPrice2 : HandleBasePriceCal2.EDWithOutDiscountFinalPrice,
      minBaseWdTotalPrice3 : HandleBasePriceCal3.EDWithOutDiscountFinalPrice,
      minBaseWdTotalPrice4 : HandleBasePriceCal.EDWithOutDiscountFinalPrice,

      weekEndWdTotalPrice: HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice,
      weekEndMinBaseWdTotalPrice: HandleWeekEndBasePriceCal1.EDWithOutDiscountFinalPrice,
      weekEndMinBaseWdTotalPrice2:HandleWeekEndBasePriceCal2.EDWithOutDiscountFinalPrice,
      weekEndMinBaseWdTotalPrice3:HandleWeekEndBasePriceCal3.EDWithOutDiscountFinalPrice,
      weekEndMinBaseWdTotalPrice4:HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice,

      // EU total amount
      totalPrice : HandleBasePriceCal.EndUserPrice,
      minBaseTotalPrice : HandleBasePriceCal1.EndUserPrice,
      minBaseTotalPrice2 :HandleBasePriceCal2.EndUserPrice,
      minBaseTotalPrice3:HandleBasePriceCal3.EndUserPrice,
      minBaseTotalPrice4:HandleBasePriceCal.EndUserPrice,

      weekEndTotalPrice: HandleWeekEndBasePriceCal.EndUserPrice,
      weekEndMinBaseTotalPrice: HandleWeekEndBasePriceCal1.EndUserPrice,
      weekEndMinBaseTotalPrice2:HandleWeekEndBasePriceCal2.EndUserPrice,
      weekEndMinBaseTotalPrice3:HandleWeekEndBasePriceCal3.EndUserPrice,
      weekEndMinBaseTotalPrice4:HandleWeekEndBasePriceCal.EndUserPrice })
    this.props.handlePricingChange(false)
  }

  handlePriceUnit (event) {
    let item = event.target.value
    this.setState({ errorMessage: '' })
    switch (item) {
      case 'Per Day':
        this.setState({ billingType: 'Per Day' })
        break
      case 'Per Week':
        this.setState({ billingType: 'Per Week' })
        break
      case 'Per Month':
        this.setState({ billingType: 'Per Month' })
        break
      case 'Per Year':
        this.setState({ billingType: 'Per Year' })
        break
    }
    this.props.handlePricingChange(false)
  }

  handlePriceUnitValue (event) {
    let basePrice = this.state.basePrice === '' ? 0 : this.state.basePrice
    let weekEndBasePrice = this.state.weekEndBasePrice === '' ? 0 : this.state.weekEndBasePrice
    let str = event.target.value
    let res = str.split('<=>')
    this.setState({
      errorMessage: '',
      minBasePriceUnitValue: parseInt(res[0]),
      minBasePriceUnit: event.target.value,
      checkDefaultBillingType : event.target.value === '24<=>Per Day' ? true : false,
      isDefaultMinBasePrice : event.target.value === '24<=>Per Day' ? false : true,
      editVisiblePrice : event.target.value === '24<=>Per Day' ? true : false })

    if (event.target.value === '24<=>Per Day') {
      let HandleBasePriceCal = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal1 = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal2 = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal3 = this.HandleBasePriceCal(basePrice)
      let HandleWeekEndBasePriceCal = this.HandleWeekEndBasePriceCal(weekEndBasePrice)
      let HandleWeekEndBasePriceCal1 = this.HandleWeekEndBasePriceCal(weekEndBasePrice)
      let HandleWeekEndBasePriceCal2 = this.HandleWeekEndBasePriceCal(weekEndBasePrice)
      let HandleWeekEndBasePriceCal3 = this.HandleWeekEndBasePriceCal(weekEndBasePrice)
      this.setState({
        errorMessage: '',
          // base price
        basePrice: basePrice,
        weekEndBasePrice:weekEndBasePrice,
        // min base price
        minBasePrice : event.target.value.length !== 0 ? basePrice : 0,
        minBasePrice2 : event.target.value.length !== 0 ? basePrice : 0,
        minBasePrice3 : event.target.value.length !== 0 ? basePrice : 0,
        minBasePrice4 : event.target.value.length !== 0 ? basePrice : 0,
        weekEndMinBasePrice : event.target.value.length !== 0 ? weekEndBasePrice : 0,
        weekEndMinBasePrice2 : event.target.value.length !== 0 ? weekEndBasePrice : 0,
        weekEndMinBasePrice3 : event.target.value.length !== 0 ? weekEndBasePrice : 0,
        weekEndMinBasePrice4 : event.target.value.length !== 0 ? weekEndBasePrice : 0,
        // discounts
        basePriceDiscount: event.target.value.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,
        basePriceDiscount1: event.target.value.length !== 0 ? HandleBasePriceCal1.basePriceDiscountCal : 0,
        basePriceDiscount2: event.target.value.length !== 0 ? HandleBasePriceCal2.basePriceDiscountCal : 0,
        basePriceDiscount3: event.target.value.length !== 0 ? HandleBasePriceCal3.basePriceDiscountCal : 0,
        basePriceDiscount4: event.target.value.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount : event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount1: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,
        // app charges
        appCharges: event.target.value.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,
        minBaseAppCharges: event.target.value.length !== 0 ? HandleBasePriceCal1.appPercentageCal : 0,
        minBaseAppCharges2: event.target.value.length !== 0 ? HandleBasePriceCal2.appPercentageCal : 0,
        minBaseAppCharges3: event.target.value.length !== 0 ? HandleBasePriceCal3.appPercentageCal : 0,
        minBaseAppCharges4: event.target.value.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,
        weekEndAppCharges: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,
        weekEndMinBaseAppCharges:  event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.appPercentageCal : 0,
        weekEndMinBaseAppCharges2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.appPercentageCal : 0,
        weekEndMinBaseAppCharges3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.appPercentageCal : 0,
        weekEndMinBaseAppCharges4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,
        // cgst amount
        cgstAmount: event.target.value.length !== 0 ? HandleBasePriceCal.cgstCal : 0,
        cgstAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.cgstCal : 0,
        cgstAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.cgstCal : 0,
        cgstAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.cgstCal : 0,
        cgstAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.cgstCal : 0,
        weekEndcgstAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,
        weekEndcgstAmount1:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.cgstCal : 0,
        weekEndcgstAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.cgstCal : 0,
        weekEndcgstAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.cgstCal : 0,
        weekEndcgstAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,
        // sgst amount
        sgstAmount: event.target.value.length !== 0 ? HandleBasePriceCal.sgstCal : 0,
        sgstAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.sgstCal : 0,
        sgstAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.sgstCal : 0,
        sgstAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.sgstCal : 0,
        sgstAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.sgstCal : 0,
        weekEndsgstAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,
        weekEndsgstAmount1:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.sgstCal : 0,
        weekEndsgstAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.sgstCal : 0,
        weekEndsgstAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.sgstCal : 0,
        weekEndsgstAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,
        // sp amount
        spAmount : event.target.value.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,
        minBaseSpAmount: event.target.value.length !== 0 ? HandleBasePriceCal1.SPUserPrice : 0,
        minBaseSpAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.SPUserPrice : 0,
        minBaseSpAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.SPUserPrice : 0,
        minBaseSpAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,
        weekEndSpAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,
        weekEndMinBaseSpAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.SPUserPrice : 0,
        weekEndMinBaseSpAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.SPUserPrice : 0,
        weekEndMinBaseSpAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.SPUserPrice : 0,
        weekEndMinBaseSpAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0 ,
        // PG amount
        PGAmount: event.target.value.length !== 0 ? HandleBasePriceCal.paymentCal : 0,
        PGAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.paymentCal : 0,
        PGAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.paymentCal : 0,
        PGAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.paymentCal : 0,
        PGAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.paymentCal : 0 ,
        weekEndPGAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,
        weekEndPGAmount1: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.paymentCal : 0,
        weekEndPGAmount2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.paymentCal : 0,
        weekEndPGAmount3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.paymentCal : 0,
        weekEndPGAmount4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,
        // EDWithOutDiscountFinalPrice : event.target.value.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
        SPWithOutDiscountFinalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.SPWithOutDiscountFinalPrice : 0 ,
        // with out discount EU amount
        wdTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice2 : event.target.value.length !== 0 ? HandleBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice3 : event.target.value.length !== 0 ? HandleBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice4 : event.target.value.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0 ,
        weekEndWdTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0 ,
        // EU total amount
        totalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,
        minBaseTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal1.EndUserPrice : 0,
        minBaseTotalPrice2 : event.target.value.length !== 0 ? HandleBasePriceCal2.EndUserPrice : 0,
        minBaseTotalPrice3: event.target.value.length !== 0 ? HandleBasePriceCal3.EndUserPrice : 0,
        minBaseTotalPrice4: event.target.value.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,
        weekEndTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0,
        weekEndMinBaseTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.EndUserPrice : 0,
        weekEndMinBaseTotalPrice2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.EndUserPrice : 0,
        weekEndMinBaseTotalPrice3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.EndUserPrice : 0,
        weekEndMinBaseTotalPrice4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0 })
      this.props.handlePricingChange(false)
    } else {
      const basePrice = this.state.basePrice
      // const StringLength = basePrice.length
      // const charfind = basePrice.charAt(0)
      // let FirstChar = basePrice.length !== 0 ? charfind < 5 ? 1 : 5 : ''
      // let FirstChar1 = basePrice.length > 2 ? parseInt(FirstChar + '0'.repeat(StringLength - 2)) : 0
      let minBasePrice = Math.ceil((basePrice / 100 * 50))
      let minBasePrice2 = Math.ceil((basePrice / 100 * 75))
      let minBasePrice3 = Math.ceil((basePrice / 100 * 90))
      let HandleBasePriceCal = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal1 = this.HandleBasePriceCal(minBasePrice)
      let HandleBasePriceCal2 = this.HandleBasePriceCal(minBasePrice2)
      let HandleBasePriceCal3 = this.HandleBasePriceCal(minBasePrice3)

      const weekEndbasePrice = this.state.weekEndBasePrice
      // const WEStringLength = weekEndbasePrice.length
      // const WEcharfind = weekEndbasePrice.charAt(0)
      // let WEFirstChar = weekEndbasePrice.length !== 0 ? WEcharfind < 5 ? 1 : 5 : ''
      // let WEFirstChar1 = weekEndbasePrice.length > 2 ? parseInt(WEFirstChar + '0'.repeat(WEStringLength - 2)) : 0
      let WEminBasePrice = Math.ceil((weekEndbasePrice / 100 * 50))
      let WEminBasePrice2 = Math.ceil((weekEndbasePrice / 100 * 75))
      let WEminBasePrice3 = Math.ceil((weekEndbasePrice / 100 * 90))
      let HandleWeekEndBasePriceCal = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      let HandleWeekEndBasePriceCal1 = this.HandleWeekEndBasePriceCal(WEminBasePrice)
      let HandleWeekEndBasePriceCal2 = this.HandleWeekEndBasePriceCal(WEminBasePrice2)
      let HandleWeekEndBasePriceCal3 = this.HandleWeekEndBasePriceCal(WEminBasePrice3)
      this.setState({
        checkInHour:'12',
        checkInMin:'00',
        checkInAM:'PM',
        checkOutHour:'11',
        checkOutMin: '00',
        checkOutAM:'AM',
        errorMessage: '',
        // base price
        basePrice: basePrice,
        weekEndBasePrice: weekEndbasePrice,

        // min base price
        minBasePrice : event.target.value.length !== 0 ? minBasePrice : 0,
        minBasePrice2 : event.target.value.length !== 0 ? minBasePrice2 : 0,
        minBasePrice3 : event.target.value.length !== 0 ? minBasePrice3 : 0,
        minBasePrice4 : event.target.value.length !== 0 ? basePrice : 0,

        weekEndMinBasePrice : event.target.value.length !== 0 ? WEminBasePrice : 0,
        weekEndMinBasePrice2 : event.target.value.length !== 0 ? WEminBasePrice2 : 0,
        weekEndMinBasePrice3 : event.target.value.length !== 0 ? WEminBasePrice3 : 0,
        weekEndMinBasePrice4 : event.target.value.length !== 0 ? WEminBasePrice : 0,

        // discounts
        basePriceDiscount: event.target.value.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,
        basePriceDiscount1: event.target.value.length !== 0 ? HandleBasePriceCal1.basePriceDiscountCal : 0,
        basePriceDiscount2: event.target.value.length !== 0 ? HandleBasePriceCal2.basePriceDiscountCal : 0,
        basePriceDiscount3: event.target.value.length !== 0 ? HandleBasePriceCal3.basePriceDiscountCal : 0,
        basePriceDiscount4: event.target.value.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,

        weekEndbasePriceDiscount : event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount1: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,

        // app charges
        appCharges: event.target.value.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,
        minBaseAppCharges: event.target.value.length !== 0 ? HandleBasePriceCal1.appPercentageCal : 0,
        minBaseAppCharges2: event.target.value.length !== 0 ? HandleBasePriceCal2.appPercentageCal : 0,
        minBaseAppCharges3: event.target.value.length !== 0 ? HandleBasePriceCal3.appPercentageCal : 0,
        minBaseAppCharges4: event.target.value.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,

        weekEndAppCharges: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,
        weekEndMinBaseAppCharges:  event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.appPercentageCal : 0,
        weekEndMinBaseAppCharges2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.appPercentageCal : 0,
        weekEndMinBaseAppCharges3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.appPercentageCal : 0,
        weekEndMinBaseAppCharges4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,

        // cgst amount
        cgstAmount: event.target.value.length !== 0 ? HandleBasePriceCal.cgstCal : 0,
        cgstAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.cgstCal : 0,
        cgstAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.cgstCal : 0,
        cgstAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.cgstCal : 0,
        cgstAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.cgstCal : 0,

        weekEndcgstAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,
        weekEndcgstAmount1:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.cgstCal : 0,
        weekEndcgstAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.cgstCal : 0,
        weekEndcgstAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.cgstCal : 0,
        weekEndcgstAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,

        // sgst amount
        sgstAmount: event.target.value.length !== 0 ? HandleBasePriceCal.sgstCal : 0,
        sgstAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.sgstCal : 0,
        sgstAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.sgstCal : 0,
        sgstAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.sgstCal : 0,
        sgstAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.sgstCal : 0,

        weekEndsgstAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,
        weekEndsgstAmount1:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.sgstCal : 0,
        weekEndsgstAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.sgstCal : 0,
        weekEndsgstAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.sgstCal : 0,
        weekEndsgstAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,

        // sp amount
        spAmount : event.target.value.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,
        minBaseSpAmount: event.target.value.length !== 0 ? HandleBasePriceCal1.SPUserPrice : 0,
        minBaseSpAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.SPUserPrice : 0,
        minBaseSpAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.SPUserPrice : 0,
        minBaseSpAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,

        weekEndSpAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,
        weekEndMinBaseSpAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.SPUserPrice : 0,
        weekEndMinBaseSpAmount2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.SPUserPrice : 0,
        weekEndMinBaseSpAmount3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.SPUserPrice : 0,
        weekEndMinBaseSpAmount4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,

        // PG amount
        PGAmount: event.target.value.length !== 0 ? HandleBasePriceCal.paymentCal : 0,
        PGAmount1: event.target.value.length !== 0 ? HandleBasePriceCal1.paymentCal : 0,
        PGAmount2: event.target.value.length !== 0 ? HandleBasePriceCal2.paymentCal : 0,
        PGAmount3: event.target.value.length !== 0 ? HandleBasePriceCal3.paymentCal : 0,
        PGAmount4: event.target.value.length !== 0 ? HandleBasePriceCal.paymentCal : 0,

        weekEndPGAmount: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,
        weekEndPGAmount1: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.paymentCal : 0,
        weekEndPGAmount2: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.paymentCal : 0,
        weekEndPGAmount3: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.paymentCal : 0,
        weekEndPGAmount4: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,

        // EDWithOutDiscountFinalPrice : event.target.value.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
        SPWithOutDiscountFinalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.SPWithOutDiscountFinalPrice : 0,

        // with out discount EU amount
        wdTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice2 : event.target.value.length !== 0 ? HandleBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice3 : event.target.value.length !== 0 ? HandleBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice4 : event.target.value.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        weekEndWdTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        // EU total amount
        totalPrice : event.target.value.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,
        minBaseTotalPrice : event.target.value.length !== 0 ? HandleBasePriceCal1.EndUserPrice : 0,
        minBaseTotalPrice2 : event.target.value.length !== 0 ? HandleBasePriceCal2.EndUserPrice : 0,
        minBaseTotalPrice3: event.target.value.length !== 0 ? HandleBasePriceCal3.EndUserPrice : 0,
        minBaseTotalPrice4: event.target.value.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,

        weekEndTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0,
        weekEndMinBaseTotalPrice: event.target.value.length !== 0 ? HandleWeekEndBasePriceCal1.EndUserPrice : 0,
        weekEndMinBaseTotalPrice2:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal2.EndUserPrice : 0,
        weekEndMinBaseTotalPrice3:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal3.EndUserPrice : 0,
        weekEndMinBaseTotalPrice4:event.target.value.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0 })
      this.props.handlePricingChange(false)
    }
  }
  handleCredentials (event) {
    this.setState({
      checkInCredentials: event.target.value,
      checkInHour: '12',
      checkInMin: '00',
      checkInAM: 'PM',
      checkOutHour: '11',
      checkOutMin: '00',
      checkOutAM: 'AM',
      errorMessage: ''
    })
    this.props.handlePricingChange(false)
  }
  handleMobileNumKeys (event) {
    if ((event.charCode >= 32 && event.charCode < 48 && event.charCode !== 40 &&
      event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
      (event.charCode > 57 && event.charCode < 127)) {
      event.preventDefault()
    }
  }

  handlePrice () {
    if (!this.state.fullRefundCancelTime) {
      this.setState({ errorMessage: t`lanSPLabelErrorInfoPriceFullRefundCancelTime` })
    } else if (!this.state.refundCancelTime) {
      this.setState({ errorMessage: t`lanSPLabelErrorInfoPriceRefundCancelTime` })
    } else if (parseInt(this.state.refundCancelTime) > parseInt(this.state.fullRefundCancelTime)) {
      this.setState({ errorMessage: t`lanSPLabelErrorInfoPriceFullRefundCancelTimeCondition` })
    } else if (!this.state.refundCancelPercentage) {
      this.setState({ errorMessage: t`lanSPLabelErrorInfoPriceRefundCancelPercentage` })
    } else if (!this.state.appPercentage) {
      this.setState({ errorMessage: t`lanADErrorHostsLabelAppPercentage` })
    } else if (!this.state.appPgPercentage) {
      this.setState({ errorMessage: t`lanADErrorHostsLabelAppPgPercentage` })
    } else if (!this.state.basePrice) {
      this.setState({ errorMessage: t`lanADErrorHostsLabelBasePrice` })
    } else if (!this.state.minBasePrice) {
      this.setState({ errorMessage: t`lanADErrorHostsLabelMinBasePrice` })
    } else if (!this.state.minBasePrice2) {
      this.setState({ errorMessage: t`lanADErrorHostsLabelMinBasePrice2` })
    } else if (!this.state.minBasePrice3) {
      this.setState({ errorMessage: t`lanADErrorHostsLabelMinBasePrice3` })
    } else if (!this.state.minBasePrice4) {
      this.setState({ errorMessage: t`lanADErrorHostsLabelMinBasePrice4` })
    } else if (!this.state.weekEndBasePrice) {
      this.setState({ errorMessage: t`lanADErrorHostsLabelWeekEndBasePrice` })
    } else if (!this.state.weekEndMinBasePrice) {
      this.setState({ errorMessage: t`lanADErrorHostsLabelWeekEndMinBasePrice` })
    } else if (!this.state.weekEndMinBasePrice2) {
      this.setState({ errorMessage: t`lanADErrorHostsLabelWeekEndMinBasePrice2` })
    } else if (!this.state.weekEndMinBasePrice3) {
      this.setState({ errorMessage: t`lanADErrorHostsLabelWeekEndMinBasePrice3` })
    } else if (!this.state.weekEndMinBasePrice4) {
      this.setState({ errorMessage: t`lanADErrorHostsLabelWeekEndMinBasePrice4` })
    } else {
      let str = this.state.minBasePriceUnit
      let res = str.split('<=>')
      let pricingData = {
        minBasePriceUnit: res[1], // 4 Hours, 6 Hours, 8 Hours, 12 Hours, 16 Hours, Per Day, Per Month, Per Year
        minBasePriceUnitValue:this.state.minBasePriceUnitValue, // In hours only 4, 6, 8, 12, 16, 22, 7*24 - 2, 30*24-2
        minBasePrice: this.state.minBasePrice,
        minBasePrice2:this.state.minBasePrice2,
        minBasePrice3: this.state.minBasePrice3,
        minBasePrice4: this.state.minBasePrice4,
        weekEndMinBasePrice:this.state.weekEndMinBasePrice,
        weekEndMinBasePrice2: this.state.weekEndMinBasePrice2,
        weekEndMinBasePrice3:this.state.weekEndMinBasePrice3,
        weekEndMinBasePrice4:this.state.weekEndMinBasePrice4,
        billingType: this.state.billingType,
        basePrice: this.state.basePrice,
        basePriceDiscount:this.state.weekdayDiscount,
        weekEndBasePrice: this.state.weekEndBasePrice,
        weekEndBasePriceDiscount: this.state.weekEndDiscount,
        serviceCharges:this.state.serviceCharges,
        otherCharges:this.state.otherCharges,
        currency: this.state.currency,
        // offers: offers, // Applied, NA
        // discounts: discounts, // Applied, NA
        checkInCredentials:this.state.checkInCredentials, // Around the Clock, Specific Time
        checkInTime:this.state.checkInHour + ':' + this.state.checkInMin + ' ' + this.state.checkInAM, // 01:00 PM
        // defaultCheckInTime: {type: String, required: true, trim: true}, // 01:00 PM
        checkOutTime:this.state.checkOutHour + ':' + this.state.checkOutMin + ' ' + this.state.checkOutAM, // 11:00 AM
        // defaultCheckOutTime: {type: String, required: true, trim: true}, // 11:00 AM
        fullRefundCancelTime: this.state.fullRefundCancelTime,
        refundCancelTime: this.state.refundCancelTime,
        refundCancelPercentage:this.state.refundCancelPercentage,
        cgstPercentage:this.state.cgstPercentage,
        cgstAmount:this.state.cgstAmount, // GST on base price - discount
        sgstPercentage: this.state.sgstPercentage,
        sgstAmount: this.state.sgstAmount, // GST on base price - discount
        appPercentage: this.state.appPercentage,
        appCharges: this.state.appCharges,
        weekEndAppCharges: this.state.weekEndAppCharges,
        minBaseAppCharges: this.state.minBaseAppCharges,
        minBaseAppCharges2: this.state.minBaseAppCharges2,
        minBaseAppCharges3: this.state.minBaseAppCharges3,
        minBaseAppCharges4: this.state.minBaseAppCharges4,
        weekEndMinBaseAppCharges:this.state.weekEndMinBaseAppCharges,
        weekEndMinBaseAppCharges2: this.state.weekEndMinBaseAppCharges2,
        weekEndMinBaseAppCharges3:this.state.weekEndMinBaseAppCharges3,
        weekEndMinBaseAppCharges4:this.state.weekEndMinBaseAppCharges4,
        appPgPercentage: this.state.appPgPercentage,
        spAmount: this.state.spAmount, // base price - discount + service + other + GST
        weekEndSpAmount:this.state.weekEndSpAmount,
        minBaseSpAmount:this.state.minBaseSpAmount,
        minBaseSpAmount2:this.state.minBaseSpAmount2,
        minBaseSpAmount3:this.state.minBaseSpAmount3,
        minBaseSpAmount4: this.state.minBaseSpAmount4,
        weekEndMinBaseSpAmount: this.state.weekEndMinBaseSpAmount,
        weekEndMinBaseSpAmount2:this.state.weekEndMinBaseSpAmount2,
        weekEndMinBaseSpAmount3:this.state.weekEndMinBaseSpAmount3,
        weekEndMinBaseSpAmount4:this.state.weekEndMinBaseSpAmount4,

        wdTotalPrice: this.state.wdTotalPrice,
        minBaseWdTotalPrice: this.state.minBaseWdTotalPrice,
        minBaseWdTotalPrice2: this.state.minBaseWdTotalPrice2,
        minBaseWdTotalPrice3: this.state.minBaseWdTotalPrice3,
        minBaseWdTotalPrice4: this.state.minBaseWdTotalPrice4,
        weekEndWdTotalPrice: this.state.weekEndWdTotalPrice,
        weekEndMinBaseWdTotalPrice: this.state.weekEndMinBaseWdTotalPrice,
        weekEndMinBaseWdTotalPrice2: this.state.weekEndMinBaseWdTotalPrice2,
        weekEndMinBaseWdTotalPrice3: this.state.weekEndMinBaseWdTotalPrice3,
        weekEndMinBaseWdTotalPrice4: this.state.weekEndMinBaseWdTotalPrice4,

        totalPrice:this.state.totalPrice, // spAmount + appCharges + paymentCharges
        weekEndTotalPrice: this.state.weekEndTotalPrice,
        minBaseTotalPrice: this.state.minBaseTotalPrice,
        minBaseTotalPrice2: this.state.minBaseTotalPrice2,
        minBaseTotalPrice3: this.state.minBaseTotalPrice3,
        minBaseTotalPrice4: this.state.minBaseTotalPrice4,
        weekEndMinBaseTotalPrice: this.state.weekEndMinBaseTotalPrice,
        weekEndMinBaseTotalPrice2: this.state.weekEndMinBaseTotalPrice2,
        weekEndMinBaseTotalPrice3: this.state.weekEndMinBaseTotalPrice3,
        weekEndMinBaseTotalPrice4: this.state.weekEndMinBaseTotalPrice4,
        // minBasePriceUnit: this.state.minBasePriceUnit,
        // minBasePriceUnitValue: this.state.minBasePriceUnitValue,
        // basePrice: this.state.basePrice,
        // minBasePrice: this.state.minBasePrice,
        // billingType: this.state.billingType,
        // checkInCredentials: this.state.checkInCredentials,
        // currency: this.state.currency,
        // checkInTime: this.state.checkInHour + ':' + this.state.checkInMin + ' ' + this.state.checkInAM,
        // checkOutTime: this.state.checkOutHour + ':' + this.state.checkOutMin + ' ' + this.state.checkOutAM,
        // fullRefundCancelTime: this.state.fullRefundCancelTime,
        // refundCancelTime: this.state.refundCancelTime,
        // refundCancelPercentage: this.state.refundCancelPercentage
        isDefaultBasePrice: this.state.isDefaultBasePrice,
        isDefaultMinBasePrice:  this.state.isDefaultMinBasePrice,
        isMidnightCheckOutAllowed:  this.state.isMidnightCheckOutAllowed
      }

      const pricingDataView = {
        minBasePriceUnit: this.state.minBasePriceUnit,
        minBasePriceUnitValue: this.state.minBasePriceUnitValue,
        billingType: this.state.billingType,
        basePrice: this.state.basePrice,
        checkInCredentials: this.state.checkInCredentials,
        checkInTime:this.state.checkInTime,
        checkOutTime: this.state.checkOutTime,
        currency: this.state.currency,
        fullRefundCancelTime: this.state.fullRefundCancelTime,
        refundCancelTime: this.state.refundCancelTime,
        refundCancelPercentage: this.state.refundCancelPercentage,
        timeHours: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        timeMins: ['00', '15', '30', '45'],
        timePeriod: ['AM', 'PM'],
        checkInHour: this.state.checkInHour,
        checkInMin: this.state.checkInMin,
        checkInAM: this.state.checkInAM,
        checkOutHour: this.state.checkOutHour,
        checkOutMin: this.state.checkOutMin,
        checkOutAM: this.state.checkOutAM,
        serviceCharges: this.state.serviceCharges,
        otherCharges:this.state.otherCharges,
        cgstPercentage:this.state.cgstPercentage,
        cgstAmount: this.state.cgstAmount,
        cgstAmount1:this.state.cgstAmount1,
        cgstAmount2:this.state.cgstAmount2,
        cgstAmount3:this.state.cgstAmount3,
        cgstAmount4:this.state.cgstAmount4,
        weekEndcgstAmount: this.state.weekEndcgstAmount,
        weekEndcgstAmount1:this.state.weekEndcgstAmount1,
        weekEndcgstAmount2:this.state.weekEndcgstAmount2,
        weekEndcgstAmount3:this.state.weekEndcgstAmount3,
        weekEndcgstAmount4:this.state.weekEndcgstAmount4,
        sgstPercentage: this.state.sgstPercentage,
        sgstAmount: this.state.sgstAmount,
        sgstAmount1:this.state.sgstAmount1,
        sgstAmount2:this.state.sgstAmount2,
        sgstAmount3:this.state.sgstAmount3,
        sgstAmount4:this.state.sgstAmount4,
        weekEndsgstAmount: this.state.weekEndsgstAmount,
        weekEndsgstAmount1:this.state.weekEndsgstAmount1,
        weekEndsgstAmount2:this.state.weekEndsgstAmount2,
        weekEndsgstAmount3:this.state.weekEndsgstAmount3,
        weekEndsgstAmount4:this.state.weekEndsgstAmount4,
        minBasePrice : this.state.minBasePrice,
        minBasePrice2 :this.state.minBasePrice2,
        minBasePrice3 :this.state.minBasePrice3,
        minBasePrice4 :this.state.minBasePrice4,
  
        weekdayBilingUnit: this.state.weekdayBilingUnit,
        weekdayDiscount:this.state.weekdayDiscount,
        weekEndMinBasePrice : this.state.weekEndMinBasePrice,
        weekEndMinBasePrice2 :this.state.weekEndMinBasePrice2,
        weekEndMinBasePrice3 : this.state.weekEndMinBasePrice3,
        weekEndMinBasePrice4 : this.state.weekEndMinBasePrice4,
        weekEndBasePrice4 : this.state.weekEndBasePrice4,
        weekEndBasePrice: this.state.weekEndBasePrice,
  
        weekEndminBilingUnit: this.state.weekEndminBilingUnit,
        weekEndDiscount: this.state.weekEndDiscount,
        appPercentage: this.state.appPercentage,
        appPgPercentage: this.state.appPgPercentage,
        PGAmount:this.state.PGAmount,
        PGAmount1:this.state.PGAmount1,
        PGAmount2:this.state.PGAmount2,
        PGAmount3:this.state.PGAmount3,
        PGAmount4:this.state.PGAmount4,
        weekEndPGAmount:this.state.weekEndPGAmount,
        weekEndPGAmount1:this.state.weekEndPGAmount1,
        weekEndPGAmount2:this.state.weekEndPGAmount2,
        weekEndPGAmount3:this.state.weekEndPGAmount3,
        weekEndPGAmount4:this.state.weekEndPGAmount4,
        EDFinalPrice: this.state.EDFinalPrice,
        SPFinalPrice: this.state.SPFinalPrice,
        EDWithOutDiscountFinalPrice : this.state.EDWithOutDiscountFinalPrice,
        SPWithOutDiscountFinalPrice : this.state.SPWithOutDiscountFinalPrice,
  
        basePriceDiscount: this.state.basePriceDiscount,
        basePriceDiscount1:this.state.basePriceDiscount1,
        basePriceDiscount2:this.state.basePriceDiscount2,
        basePriceDiscount3:this.state.basePriceDiscount3,
        basePriceDiscount4:this.state.basePriceDiscount4,
  
        weekEndbasePriceDiscount : this.state.weekEndbasePriceDiscount,
        weekEndbasePriceDiscount1: this.state.weekEndbasePriceDiscount1,
        weekEndbasePriceDiscount2: this.state.weekEndbasePriceDiscount2,
        weekEndbasePriceDiscount3: this.state.weekEndbasePriceDiscount3,
        weekEndbasePriceDiscount4: this.state.weekEndbasePriceDiscount4,
  
        appCharges: this.state.appCharges,
        minBaseAppCharges: this.state.minBaseAppCharges,
        minBaseAppCharges2:this.state.minBaseAppCharges2,
        minBaseAppCharges3:this.state.minBaseAppCharges3,
        minBaseAppCharges4:this.state.minBaseAppCharges4,
  
        weekEndAppCharges: this.state.weekEndAppCharges,
        weekEndMinBaseAppCharges: this.state.weekEndMinBaseAppCharges,
        weekEndMinBaseAppCharges2:this.state.weekEndMinBaseAppCharges2,
        weekEndMinBaseAppCharges3:this.state.weekEndMinBaseAppCharges3,
        weekEndMinBaseAppCharges4:this.state.weekEndMinBaseAppCharges4,
  
        spAmount: this.state.spAmount,
        minBaseSpAmount: this.state.minBaseSpAmount,
        minBaseSpAmount2:this.state.minBaseSpAmount2,
        minBaseSpAmount3:this.state.minBaseSpAmount3,
        minBaseSpAmount4:this.state.minBaseSpAmount4,
  
        weekEndSpAmount: this.state.weekEndSpAmount,
        weekEndMinBaseSpAmount: this.state.weekEndMinBaseSpAmount,
        weekEndMinBaseSpAmount2:this.state.weekEndMinBaseSpAmount2,
        weekEndMinBaseSpAmount3:this.state.weekEndMinBaseSpAmount3,
        weekEndMinBaseSpAmount4:this.state.weekEndMinBaseSpAmount4,
  
        totalPrice: this.state.totalPrice,
        minBaseTotalPrice: this.state.minBaseTotalPrice,
        minBaseTotalPrice2:this.state.minBaseTotalPrice2,
        minBaseTotalPrice3:this.state.minBaseTotalPrice3,
        minBaseTotalPrice4:this.state.minBaseTotalPrice4,
  
        weekEndTotalPrice: this.state.weekEndTotalPrice,
        weekEndMinBaseTotalPrice: this.state.weekEndMinBaseTotalPrice,
        weekEndMinBaseTotalPrice2:this.state.weekEndMinBaseTotalPrice2,
        weekEndMinBaseTotalPrice3:this.state.weekEndMinBaseTotalPrice3,
        weekEndMinBaseTotalPrice4:this.state.weekEndMinBaseTotalPrice4,
  
        wdTotalPrice: this.state.wdTotalPrice,
        minBaseWdTotalPrice: this.state.minBaseWdTotalPrice,
        minBaseWdTotalPrice2:this.state.minBaseWdTotalPrice2,
        minBaseWdTotalPrice3:this.state.minBaseWdTotalPrice3,
        minBaseWdTotalPrice4:this.state.minBaseWdTotalPrice4,
        weekEndWdTotalPrice: this.state.weekEndWdTotalPrice,
        weekEndMinBaseWdTotalPrice: this.state.weekEndMinBaseWdTotalPrice,
        weekEndMinBaseWdTotalPrice2:this.state.weekEndMinBaseWdTotalPrice2,
        weekEndMinBaseWdTotalPrice3:this.state.weekEndMinBaseWdTotalPrice3,
        weekEndMinBaseWdTotalPrice4:this.state.weekEndMinBaseWdTotalPrice4,
        isMidnightCheckOutAllowed: this.state.isMidnightCheckOutAllowed,
        isDefaultBasePrice : this.state.isDefaultBasePrice,
        isDefaultMinBasePrice : this.state.isDefaultMinBasePrice
      }
      this.setState({ errorClass:'text-success' })
      this.setState({ errorMessage: t`lanSPLabelSuccessInfoPriceCreated` })
      this.setState({ modalIsOpen: !this.state.modalIsOpen })
      this.props.handlePricingChange(true)
      localStorage.setItem('PricingData', JSON.stringify(pricingDataView))
      this.props.commonFuntion(pricingData, {}, '', 'price')
    }
  }
  closeModal () {
    // this.textInput.focus()
    this.setState({ modalIsOpen: !this.state.modalIsOpen })
  }
  render () {
    return (
      <div>
        <div className='create-price'>
          <form>
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
                      <select className='form-control' id='exampleFormControlSelect1' value={this.state.checkInHour} disabled={!this.state.editVisiblePrice} onChange={(event) => this.setState({ checkInHour: event.target.value, errorMessage: '' })}>
                        {this.state.timeHours.map((timehour, i) => <option value={timehour} key={i}>{timehour}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className='form-group'>
                      <select className='form-control' id='exampleFormControlSelect1' value={this.state.checkInMin} disabled={!this.state.editVisiblePrice} onChange={(event) => this.setState({ checkInMin: event.target.value, errorMessage: '' })}>
                        {this.state.timeMins.map((timemin, i) => <option value={timemin} key={i}>{timemin}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className='form-group'>
                      <select className='form-control' id='exampleFormControlSelect1' value={this.state.checkInAM} disabled={!this.state.editVisiblePrice} onChange={(event) => this.setState({ checkInAM: event.target.value, errorMessage: '' })}>
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
                      <select className='form-control' id='exampleFormControlSelect1' value={this.state.checkOutHour} disabled={!this.state.editVisiblePrice} onChange={(event) => this.setState({ checkOutHour: event.target.value, errorMessage: '' })}>
                        {this.state.timeHours.map((timehour, i) => <option value={timehour} key={i}>{timehour}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className='form-group'>
                      <select className='form-control' id='exampleFormControlSelect1' value={this.state.checkOutMin} disabled={!this.state.editVisiblePrice} onChange={(event) => this.setState({ checkOutMin: event.target.value, errorMessage: '' })}>
                        {this.state.timeMins.map((timemin, i) => <option value={timemin} key={i}>{timemin}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className='form-group'>
                      <select className='form-control' id='exampleFormControlSelect1' value={this.state.checkOutAM} disabled={!this.state.editVisiblePrice} onChange={(event) => this.setState({ checkOutAM: event.target.value, errorMessage: '' })}>
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
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsServiceCharges`}</label>
                  <input type='text' className='form-control' id='Service charges'
                    value={this.state.serviceCharges}
                    onChange={(event) => this.handleCommonchange(event)}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsOtherCharges`}</label>
                  <input type='text' className='form-control' id='Other charges'
                    value={this.state.otherCharges} onChange={(event) => this.handleCommonchange(event)}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsCGST`} (%)</label>
                  <input type='text' className='form-control' id='CGST'
                    value={this.state.cgstPercentage} onChange={(event) => this.handleCommonchange(event)}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSGST`} (%)</label>
                  <input type='text' className='form-control' id='SGST'
                    value={this.state.sgstPercentage}
                    onChange={(event) => this.handleCommonchange(event)}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsAppPercentage`} (%)<span className='require'>*</span></label>
                  <input type='text' className='form-control' id='App Percentage'
                    value={this.state.appPercentage}
                    onChange={(event) => this.handleCommonchange(event)}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsAppPaymentCharges`} (%)<span className='require'>*</span></label>
                  <input type='text' className='form-control' id='App Payment charges'
                    // value={this.state.appPgPercentage} onChange={(event) => event.target.value.charAt(0) === '0'
                    //   ? null : this.handleCommonchange(event)} onKeyPress={this.handleMobileNumKeys} />
                    value={this.state.appPgPercentage} onChange={(event) => this.handleCommonchange(event)} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsWeekdayDiscount`} (%)</label>
                  <input type='text' className='form-control' id='Weekday Discount' maxLength={7}
                    value={this.state.weekdayDiscount} onChange={(event) => this.handleCommonchange(event)} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsWeekEndDiscount`} (%)</label>
                  <input type='text' className='form-control' id='WeekEnd Discount'
                    value={this.state.weekEndDiscount} maxLength={7}
                    onChange={(event) => this.handleCommonchange(event)}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelBillingType`}</label>
                  <select className='form-control' id='exampleFormControlSelect1' value={this.state.billingType} onChange={this.handlePriceUnit}>
                    <option value='Per Day'>Per Day</option>
                    <option value='Per Week'>Per Week</option>
                    <option value='Per Month'>Per Month</option>
                    <option value='Per Year'>Per Year</option>
                  </select>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsMinBillingType`}</label>
                  <select className='form-control' id='exampleFormControlSelect1' value={this.state.minBasePriceUnit}
                    onChange={this.handlePriceUnitValue}>
                    <option value='6<=>6 Hours'>6 Hours</option>
                    <option value='24<=>Per Day'>Per Day</option>
                  </select>
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>Base default Priority</label>
                  <select className='form-control' id='exampleFormControlSelect1' disabled value={this.state.isDefaultBasePrice}
                    onChange={(event) => this.setState({ isDefaultBasePrice: event.target.value, errorMessage: '' })}>
                    <option value='true'>true</option>
                    <option value='false'>false</option>
                  </select>
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>Min Base default Priority</label>
                  <select className='form-control' id='exampleFormControlSelect1' value={this.state.isDefaultMinBasePrice}
                    // disabled={this.props.isCreateProperty === 'create' ? true : this.state.checkDefaultMinBase ? false : true}
                    // disabled={this.props.isCreateProperty === 'create' ? true : this.state.checkDefaultBillingType === true ? true : this.state.checkDefaultMinBase ? false : true}
                    disabled={this.state.editVisiblePrice === true ? true : this.state.checkDefaultMinBase ? false : true}
                    onChange={(event) => this.setState({ isDefaultMinBasePrice: event.target.value, errorMessage: '' })}>
                    <option value='true'>true</option>
                    <option value='false'>false</option>
                  </select>
                </div>
              </div>
              <div className='col-md-3 pt-4 mt-2'>
                <input className='mt-2' type='checkbox' id='allow midnight checkout' ref={(input) => { this.textInput = input }}
                  value={this.state.isMidnightCheckOutAllowed}
                  checked={this.state.isMidnightCheckOutAllowed}
                  onChange={() => this.setState({ errorMessage: '', isMidnightCheckOutAllowed: this.state.isMidnightCheckOutAllowed === false ? true : false })} />
                <label className='form-control-label pl-2'> Allow Mid Night Check-out ?</label>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-12'>
                <h5 className='mb-2 card-title'>{t`lanADLabelHostsWeekdayPrice`}</h5>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsWeekdayBasePrice`}<span className='require'>*</span></label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.basePrice} maxLength={7}
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.handleWeekdayPrice(event)}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.basePriceDiscount} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ basePriceDiscount: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsAppCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.appCharges} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ appCharges: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsCGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.cgstAmount} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ cgstAmount: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.sgstAmount} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ sgstAmount: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSPAmount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.spAmount} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ spAmount: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsPGCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.PGAmount} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ spAmount: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPriceWithoutDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.wdTotalPrice} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ wdTotalPrice: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPrice`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.totalPrice} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ totalPrice: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsWeekdayMinBasePrice`} 1<span className='require'>*</span></label>
                  <input type='text' className='form-control' id='example3cols2Input' disabled={this.state.editVisiblePrice} maxLength={7}
                    value={this.state.minBasePrice} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.handleMinBasePrice1(event)} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.basePriceDiscount1} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ basePriceDiscount1: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsAppCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.minBaseAppCharges} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ minBaseAppCharges: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsCGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.cgstAmount1} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ cgstAmount1: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.sgstAmount1} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ sgstAmount1: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSPAmount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.minBaseSpAmount} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ minBaseSpAmount: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsPGCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.PGAmount1} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ PGAmount1: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPriceWithoutDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.minBaseWdTotalPrice} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ minBaseWdTotalPrice: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPrice`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.minBaseTotalPrice} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ minBaseTotalPrice: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsWeekdayMinBasePrice`} 2<span className='require'>*</span></label>
                  <input type='text' className='form-control' id='example3cols2Input' disabled={this.state.editVisiblePrice} maxLength={7}
                    value={this.state.minBasePrice2} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.handleMinBasePrice2(event)} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.basePriceDiscount2} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ basePriceDiscount2: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsAppCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.minBaseAppCharges2} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ minBaseAppCharges2: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsCGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.cgstAmount2} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ cgstAmount2: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.sgstAmount2} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ sgstAmount2: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSPAmount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.minBaseSpAmount2} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ minBaseSpAmount2: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsPGCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.PGAmount2} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ PGAmount2: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPriceWithoutDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.minBaseWdTotalPrice2} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ minBaseWdTotalPrice2: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPrice`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.minBaseTotalPrice2} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ minBaseTotalPrice2: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsWeekdayMinBasePrice`} 3<span className='require'>*</span></label>
                  <input type='text' className='form-control' id='example3cols2Input' disabled={this.state.editVisiblePrice} maxLength={7}
                    value={this.state.minBasePrice3} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.handleMinBasePrice3(event)} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.basePriceDiscount3} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ basePriceDiscount3: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsAppCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.minBaseAppCharges3} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ minBaseAppCharges3: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsCGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.cgstAmount3} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ cgstAmount3: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSGST`}ST</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.sgstAmount3} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ sgstAmount3: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSPAmount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.minBaseSpAmount3} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ minBaseSpAmount3: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsPGCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.PGAmount3} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ PGAmount3: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPriceWithoutDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.minBaseWdTotalPrice3} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ minBaseWdTotalPrice3: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPrice`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.minBaseTotalPrice3} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ minBaseTotalPrice3: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsWeekdayMinBasePrice`} 4<span className='require'>*</span></label>
                  <input type='text' className='form-control' id='example3cols2Input' disabled={this.state.editVisiblePrice} maxLength={7}
                    value={this.state.minBasePrice4} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.handleMinBasePrice4(event)} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.basePriceDiscount4} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ basePriceDiscount4: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsAppCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.minBaseAppCharges4} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ minBaseAppCharges4: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsCGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.cgstAmount4} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ cgstAmount4: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.sgstAmount4} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ sgstAmount4: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSPAmount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.minBaseSpAmount4} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ minBaseSpAmount4: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsPGCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.PGAmount4} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ PGAmount4: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPriceWithoutDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.minBaseWdTotalPrice4} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ minBaseWdTotalPrice4: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPrice`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.minBaseTotalPrice4} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ minBaseTotalPrice4: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
            </div>
            {/* <div className='container'>
              <div className='text-center'><label className={this.state.errorClass}>{this.state.errorMessage}</label></div>
            </div> */}
            <div className='row'>
              <div className='col-md-12'>
                <h5 className='mb-2 card-title'>{t`lanADLabelHostsWeekEndPrice`}</h5>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsWeekEndBasePrice`}<span className='require'>*</span></label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.weekEndBasePrice} maxLength={7}
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.handleWeekEndPrice(event)}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndbasePriceDiscount} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndbasePriceDiscount: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsAppCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndAppCharges} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndAppCharges: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsCGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndcgstAmount} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndcgstAmount: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndsgstAmount} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndsgstAmount: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSPAmount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndSpAmount} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndSpAmount: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsPGCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.weekEndPGAmount} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ weekEndPGAmount: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPriceWithoutDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.weekEndWdTotalPrice} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ weekEndWdTotalPrice: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPrice`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.weekEndTotalPrice} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ weekEndTotalPrice: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsWeekEndMinBasePrice`} 1<span className='require'>*</span></label>
                  <input type='text' className='form-control' id='example3cols2Input' disabled={this.state.editVisiblePrice} maxLength={7}
                    value={this.state.weekEndMinBasePrice} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.handleWeekEndMinBasePrice1(event)} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndbasePriceDiscount1} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndbasePriceDiscount1: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsAppCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndMinBaseAppCharges} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndMinBaseAppCharges: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsCGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndcgstAmount1} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndcgstAmount1: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndsgstAmount1} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndsgstAmount1: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSPAmount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndMinBaseSpAmount} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndMinBaseSpAmount: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsPGCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.weekEndPGAmount1} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ weekEndPGAmount1: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPriceWithoutDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.weekEndMinBaseWdTotalPrice} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ weekEndMinBaseWdTotalPrice: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPrice`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.weekEndMinBaseTotalPrice} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ weekEndMinBaseTotalPrice: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsWeekEndMinBasePrice`} 2<span className='require'>*</span></label>
                  <input type='text' className='form-control' id='example3cols2Input' disabled={this.state.editVisiblePrice} maxLength={7}
                    value={this.state.weekEndMinBasePrice2} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.handleWeekEndMinBasePrice2(event)} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndbasePriceDiscount2} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndbasePriceDiscount2: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsAppCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndMinBaseAppCharges2} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndMinBaseAppCharges2: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsCGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndcgstAmount2} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndcgstAmount2: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndsgstAmount2} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndsgstAmount2: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSPAmount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndMinBaseSpAmount2} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndMinBaseSpAmount2: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsPGCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.weekEndPGAmount2} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ weekEndPGAmount2: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPriceWithoutDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.weekEndMinBaseWdTotalPrice2} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ weekEndMinBaseWdTotalPrice2: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPrice`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.weekEndMinBaseTotalPrice2} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ weekEndMinBaseTotalPrice2: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsWeekEndMinBasePrice`} 3<span className='require'>*</span></label>
                  <input type='text' className='form-control' id='example3cols2Input' disabled={this.state.editVisiblePrice} maxLength={7}
                    value={this.state.weekEndMinBasePrice3} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.handleWeekEndMinBasePrice3(event)} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndbasePriceDiscount3} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndbasePriceDiscount3: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsAppCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndMinBaseAppCharges3} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndMinBaseAppCharges3: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsCGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndcgstAmount3} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndcgstAmount3: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndsgstAmount3} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndsgstAmount3: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSPAmount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndMinBaseSpAmount3} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndMinBaseSpAmount3: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsPGCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.weekEndPGAmount3} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ weekEndPGAmount3: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPriceWithoutDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.weekEndMinBaseWdTotalPrice3} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ weekEndMinBaseWdTotalPrice3: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPrice`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.weekEndMinBaseTotalPrice3} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ weekEndMinBaseTotalPrice3: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsWeekEndMinBasePrice`} 4<span className='require'>*</span></label>
                  <input type='text' className='form-control' id='example3cols2Input' disabled={this.state.editVisiblePrice} maxLength={7}
                    value={this.state.weekEndMinBasePrice4} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.handleWeekEndMinBasePrice4(event)} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndbasePriceDiscount4} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndbasePriceDiscount4: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsAppCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndMinBaseAppCharges4} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndMinBaseAppCharges4: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsCGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndcgstAmount4} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndcgstAmount4: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSGST`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndsgstAmount4} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndsgstAmount4: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsSPAmount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7} disabled
                    value={this.state.weekEndMinBaseSpAmount4} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ weekEndMinBaseSpAmount4: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsPGCharges`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.weekEndPGAmount4} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ weekEndPGAmount4: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-2'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPriceWithoutDiscount`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.weekEndMinBaseWdTotalPrice4} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ weekEndMinBaseWdTotalPrice4: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanADLabelHostsEUTotalPrice`}</label>
                  <input type='text' className='form-control' id='example3cols2Input'
                    value={this.state.weekEndMinBaseTotalPrice4} maxLength={7} disabled
                    onChange={(event) => event.target.value.charAt(0) === '0' ? null : this.setState({ weekEndMinBaseTotalPrice4: event.target.value, errorMessage: '' })}
                    onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
            </div>
            {/* <div className='row'>
              <div className='col-md-12'>
                <h5 className='mb-2 card-title'>Final Price</h5>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>End User Final Price</label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7}
                    value={this.state.EDFinalPrice} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ EDFinalPrice: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
              <div className='col-md-3'>
                <div className='form-group'>
                  <label className='form-control-label'>Supplier Final Price </label>
                  <input type='text' className='form-control' id='example3cols2Input' maxLength={7}
                    value={this.state.SPFinalPrice} onChange={(event) => event.target.value.charAt(0) === '0'
                      ? null : this.setState({ SPFinalPrice: event.target.value, errorMessage: '' })} onKeyPress={this.handleMobileNumKeys} />
                </div>
              </div>
            </div> */}
            <div className='container'>
              <div className='text-center'><label className={this.state.errorClass}>{this.state.errorMessage}</label></div>
            </div>
            <div className='container mt-3'>
              <div className='text-center'>
                <button className='btn btn-primary' onClick={this.handlePrice} type='button'>{t`lanCommonButtonCreate`}</button>
              </div>
            </div>
            <Modal
              isOpen={this.state.modalIsOpen}
              style={customStyles}
              >
              <div className='container text-center'>
                <div className='row'>
                  <div className='col-sm-12'>
                    <div className='card1'>
                      <div className='card-body'>
                        {
                          this.state.isMidnightCheckOutAllowed === true
                           ? <label style={{ fontSize: 19, color: '#000' }} >Are You Sure Want To Allow Mid Night Checkout ?</label>
                           : <label style={{ fontSize: 19, color: '#000' }} >Are You Sure Don't Want To Allow Mid Night Checkout ?</label>
                        }
                        {/* <label style={{ fontSize: 19, color: '#000' }} >{this.state.modalIsOpen
                        === false ? Are You Sure Don't Want To Allow Mid Night Checkout : Are Tou Sure Want To Allow Mid Night Checkout }</label> */}
                      </div>
                      <div className='card-footer'>
                        <div className='row justify-content-center'>
                          <button className='btn btn-primary mr-2' onClick={this.closeModal}>{t`lanCommonButtonConfirm`}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </form>
        </div>
      </div>
    )
  }
}
ADHostsPropertyInfoPriceCreateComponent.propTypes = {
  commonFuntion: PropTypes.any,
  priceObj: PropTypes.any,
  handlePricingChange: PropTypes.any
}

export default ADHostsPropertyInfoPriceCreateComponent
