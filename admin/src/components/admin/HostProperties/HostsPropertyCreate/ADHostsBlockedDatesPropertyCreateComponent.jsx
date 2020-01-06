/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'react-drawer/lib/react-drawer.css'
import DayPicker, { DateUtils } from 'react-day-picker'
import 'react-day-picker/lib/style.css'

import '../../css/all.min.css'
import '../../css/argon.min.css'
import '../../css/nucleo.css'

class ADHostsBlockedDatesPropertyCreateComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      blockingType: 'Continuous Blocking',
      from: null,
      to: null,
      enteredTo: null,
      customDatesStyles: [],
      dates: [],
      errorMessage: '',
      errorClass: false
    }
    this.handleDayClick = this.handleDayClick.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this)
    this.handleCreateBlockedDates = this.handleCreateBlockedDates.bind(this)
    this.isSelectingFirstDay = this.isSelectingFirstDay.bind(this)
  }
  componentWillMount () {
    this.setState({ errorClass:'label-control text-danger' })
    if (this.props.blockedDatesObj && this.props.blockedDatesObj.blockingType) {
      if (this.props.blockedDatesObj.blockingType === 'Continuous Blocking') {
        let value = new Date(moment(this.props.blockedDatesObj.blockingFromDate).year(), moment(this.props.blockedDatesObj.blockingFromDate).month(), moment(this.props.blockedDatesObj.blockingFromDate).date(), 12, 0, 0)
        let value1 = new Date(moment(this.props.blockedDatesObj.blockingToDate).year(), moment(this.props.blockedDatesObj.blockingToDate).month(), moment(this.props.blockedDatesObj.blockingToDate).date(), 12, 0, 0)
        this.setState({ from: value, to: value1, enteredTo: value1, blockingType: this.props.blockedDatesObj.blockingType })
      } else {
        this.setState({ blockingType: this.props.blockedDatesObj.blockingType, customDatesStyles: this.props.blockedDatesObj.customDates, dates: this.props.blockedDatesObj.dateArray })
      }
    } else {
    }
  }
  isSelectingFirstDay (from, to, day) {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from)
    const isRangeSelected = from && to
    return !from || isBeforeFirstDay || isRangeSelected
  }
  handleSelect (event) {
    this.setState({ blockingType: event.target.value })
  }

  handleDayClick (day, { selected }) {
    this.setState({ errorMessage: '' })
    if (moment().format('YYYY-MM-DD') > moment(day).format('YYYY-MM-DD')) {
    } else {
      if (this.state.blockingType === 'Continuous Blocking') {
        const { from, to } = this.state
        if (from && to && day >= from && day <= to) {
          return
        }
        if (this.isSelectingFirstDay(from, to, day)) {
          this.setState({
            from: day,
            to: null,
            enteredTo: null
          })
        } else {
          this.setState({
            to: day,
            enteredTo: day
          })
        }
      } else {
        this.setState({ from: null, to: null })
        let date = moment(day).format('YYYY-MM-DD')
        let customDates = this.state.customDatesStyles
        let arrayDates = this.state.dates
        let i = arrayDates.indexOf(date)
        if (i !== -1) {
          arrayDates.splice(i, 1)
          customDates.splice(i, 1)
          this.setState({ customDatesStyles: customDates, dates: arrayDates })
        } else {
          arrayDates.push(date)
          customDates.push(new Date(moment(date).year(), moment(date).month(), moment(date).date(), 12, 0, 0))
          this.setState({ customDatesStyles: customDates, dates: arrayDates })
        }
      }
    }
  }
  handleDayMouseEnter (day) {
    const { from, to } = this.state
    if (!this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        enteredTo: day
      })
    }
  }
  handleBack = () => {
    hashHistory.push('/host/property-view')
  }
  handleCreateBlockedDates () {
    if (this.state.blockingType === 'Continuous Blocking' && !this.state.from) {
      this.setState({ errorMessage: t`lanSPLabelErrorBlockedFromDate` })
    } else if (this.state.blockingType === 'Continuous Blocking' && !this.state.to) {
      this.setState({ errorMessage: t`lanSPLabelErrorBlockedToDate` })
    } else if (this.state.blockingType === 'Random Blocking' && !this.state.dates.length > 0) {
      this.setState({ errorMessage: t`lanSPLabelErrorBlockedDates` })
    } else {
      let postData = {}
      if (this.state.blockingType === 'Continuous Blocking') {
        postData = {
          blockingType: this.state.blockingType,
          blockingFromDate: this.state.from,
          blockingToDate: this.state.to,
          propertyID:  '',
          spLocationId:  '',
          spServiceProviderId:  ''

        }
      } else {
        postData = {
          blockingType: this.state.blockingType,
          customDates: this.state.customDatesStyles,
          dateArray: this.state.dates,
          propertyID:'',
          spLocationId: '',
          spServiceProviderId: ''
        }
      }
      this.props.commonFunction(postData, 'blockedDatesObj')
      this.setState({ errorClass:'text-success' })
      this.setState({ errorMessage: t`lanSPSuccessBlockedDatesCreated` })
    }
  }
  render () {
    const { from, to, enteredTo } = this.state
    const modifiers = { start: from, end: enteredTo }
    const disabledDays = { before: this.state.from }
    const selectedDays = [from, { from, to: enteredTo }]
    return (
      <div>
        <div style={{ backgroundColor: '#fff' }}>
          <div className='form-group row'>
            <div className='col-lg-4'>
              <div className='row'>
                <div className='col-md-10'>
                  <div className='form-group'>
                    <label className='form-control-label'>{t`lanSPLabelSelectBlockingType`}<span className='error'>*</span></label>
                    <select value={this.state.blockingType} multiple='' onChange={this.handleSelect} className='form-control' id='exampleFormControlSelect2'>
                      <option value='Continuous Blocking'>Continuous Blocking</option>
                      <option value='Random Blocking'>Random Blocking</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-8'>
              <div className='mt-4'>
                {this.state.blockingType === 'Continuous Blocking'
                ? <div className='row'>
                  {/* {!from && !to && t`lanSPLabelErrorSelectFirstDay`}
                  {from && !to && t`lanSPLabelErrorSelectLastDay`} */}
                  {t`lanSPLabelBlockDatesSelected`} {' '} {t`lanSPLabelBlockDatesFrom`} <span className='error mx-3 block-from'>{from &&
                    to &&
                    ` ${from.toLocaleDateString()} `}</span> {t`lanSPLabelBlockDatesTo`} <span className='error mx-3 block-from'> {from &&
                      to &&
                      `${to.toLocaleDateString()}`}</span>
                </div>
                : <div>
                  <div className='row align-items-center'>
                    {this.state.dates && this.state.dates.length > 0 ? this.state.dates.map((item, i) =>
                      <div className='col-sm-3' key={i}>{item}</div>
                    ) : t`lanSPLabelErrorNoDates`}
                  </div>
                </div>
              }
              </div>
            </div>
            <div className='col-lg-12 text-center'>
              {this.state.blockingType === 'Continuous Blocking'
                ? <div className='calendar mt-4' >
                  <DayPicker
                    className='Range'
                    numberOfMonths={3}
                    fromMonth={from}
                    selectedDays={selectedDays}
                    disabledDays={{ before: new Date(), disabledDays }}
                    modifiers={modifiers}
                    onDayClick={this.handleDayClick}
                    onDayMouseEnter={this.handleDayMouseEnter}
                  />
                </div>
                : <div className='calendar mt-4' >
                  <DayPicker
                    numberOfMonths={3}
                    disabledDays={{
                      before: new Date()
                      // after: this.state.maxDate
                    }}
                    selectedDays={this.state.customDatesStyles}
                    onDayClick={this.handleDayClick}
                  />
                </div>
              }
            </div>
            <div className='col-sm-12 text-center'>
              <label className={this.state.errorClass}>{this.state.errorMessage}</label>
            </div>
            <div className='col-sm-12 text-center'>
              <button className='btn btn-primary update-edit' onClick={this.handleCreateBlockedDates}>{t`lanCommonButtonCreate`}</button>
            </div>
          </div>
        </div>
        <style>{`
  .Range .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
  background-color: #f0f8ff !important;
  color: #4a90e2;
  }
  .Range .DayPicker-Day {
  border-radius: 0 !important;
  }
`}</style>
        {/* </div> */}
      </div>
    )
  }
}

ADHostsBlockedDatesPropertyCreateComponent.propTypes = {
  commonFunction: PropTypes.any,
  blockedDatesObj: PropTypes.any
}

export default ADHostsBlockedDatesPropertyCreateComponent
