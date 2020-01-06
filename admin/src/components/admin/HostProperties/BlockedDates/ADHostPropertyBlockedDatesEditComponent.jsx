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
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import APICallManager from '../../../../services/callmanager'
import config from '../../../../../public/config.json'

import '../../css/all.min.css'
import '../../css/argon.min.css'
import '../../css/nucleo.css'

class ADHostPropertyBlockedDatesEditComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      blockingType: 'Continuous Blocking',
      from: null,
      blockingFromDate: null,
      blockingToDate: null,
      to: null,
      enteredTo: null,
      blockedObj: {},
      blockingTypeDummy: '',
      dummyFromDate: null,
      dummyToDate: null,
      errorMessage: ''
    }
    this.handleDayClick = this.handleDayClick.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this)
    this.handleUpdateBlockedDates = this.handleUpdateBlockedDates.bind(this)
    this.isSelectingFirstDay = this.isSelectingFirstDay.bind(this)
  }
  componentWillMount () {
    if (this.props.blockedObj) {
      this.setState({
        blockedObj: this.props.blockedObj,
        blockingType: this.props.blockedObj.blockingType,
        blockingTypeDummy: this.props.blockedObj.blockingType,
        dummyFromDate: moment(this.props.blockedObj.blockingFromDate).format('YYYY-MM-DD'),
        dummyToDate: moment(this.props.blockedObj.blockingToDate).format('YYYY-MM-DD')
      })
      if (this.props.blockedObj.blockingType === 'Continuous Blocking') {
        let value = new Date(moment(this.props.blockedObj.blockingFromDate).year(), moment(this.props.blockedObj.blockingFromDate).month(), moment(this.props.blockedObj.blockingFromDate).date(), 12, 0, 0)
        let value1 = new Date(moment(this.props.blockedObj.blockingToDate).year(), moment(this.props.blockedObj.blockingToDate).month(), moment(this.props.blockedObj.blockingToDate).date(), 12, 0, 0)
        this.setState({ from: value, to: value1, enteredTo: value1 })
      } else {
        let date = moment(this.props.blockedObj.blockingFromDate).format('YYYY-MM-DD')
        let value = new Date(moment(date).year(), moment(date).month(), moment(date).date(), 12, 0, 0)
        this.setState({ blockingFromDate: value, blockingToDate: value })
      }
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
        this.setState({ blockingFromDate: null, blockingToDate: null })
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
        if (selected) {
          this.setState({ blockingFromDate: undefined, blockingToDate: undefined })
        } else {
          let date = moment(day).format('YYYY-MM-DD')
          let value = new Date(moment(date).year(), moment(date).month(), moment(date).date(), 12, 0, 0)
          this.setState({ blockingFromDate: selected ? undefined : value, blockingToDate: selected ? undefined : value })
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
    hashHistory.push('/admin/host/properties')
  }
  handleUpdateBlockedDates () {
    if (!this.state.blockingType) {
      this.setState({ errorMessage: 'Blocking Type is Required' })
    } else if (this.state.blockingType === 'Continuous Blocking' && !this.state.from) {
      this.setState({ errorMessage: t`lanSPLabelErrorBlockedFromDate` })
    } else if (this.state.blockingType === 'Continuous Blocking' && !this.state.to) {
      this.setState({ errorMessage: t`lanSPLabelErrorBlockedToDate` })
    } else if (this.state.blockingType === 'Random Blocking' && !this.state.blockingFromDate) {
      this.setState({ errorMessage: t`lanSPLabelErrorBlockedDates` })
    } else if (this.state.blockingType === 'Continuous Blocking' && this.state.blockingTypeDummy === 'Continuous Blocking' &&
     moment(this.state.from).format('YYYY-MM-DD') === moment(this.state.dummyFromDate).format('YYYY-MM-DD') &&
     moment(this.state.to).format('YYYY-MM-DD') === moment(this.state.dummyToDate).format('YYYY-MM-DD')) {
      hashHistory.push('/admin/host/properties')
    } else if (this.state.blockingType === 'Random Blocking' && this.state.blockingTypeDummy === 'Random Blocking' &&
      moment(this.state.blockingFromDate).format('YYYY-MM-DD') === moment(this.state.dummyFromDate).format('YYYY-MM-DD') &&
      moment(this.state.blockingToDate).format('YYYY-MM-DD') === moment(this.state.dummyToDate).format('YYYY-MM-DD')) {
      hashHistory.push('/admin/host/properties')
    } else {
      let postData = {
        blockingType: this.state.blockingType,
        blockingFromDate: this.state.blockingType === 'Continuous Blocking' ? this.state.from : this.state.blockingFromDate,
        blockingToDate: this.state.blockingType === 'Continuous Blocking' ? this.state.to : this.state.blockingToDate,
        propertyID: this.state.blockedObj.propertyId._id,
        spLocationId: this.state.blockedObj.spLocationId,
        spServiceProviderId: this.state.blockedObj.spServiceProviderId
      }
      let obj = { url: config.baseUrl + config.putADHostPropertyBlockedDatesEditAPI + this.state.blockedObj._id, body: postData }
      let _this = this
      APICallManager.putCall(obj, function (resObj) {
        _this.setState({ blockingType: 'Continuous Blocking', from: '', to: '' })
        if (resObj.data.statusCode === '0000') {
          hashHistory.push('/admin/host/properties')
        } else if (resObj.data.statusCode === '1011') {
          ToastsStore.error(t`lanSPLabelErrorCannotBlockedDates`)
        } else if (resObj.data.statusCode === '1013') {
          ToastsStore.error(t`lanSPLabelErrorAlreadyBlocked`)
        } else {
          _this.setState({ errorMessage: t`lanSPLabelErrorUpdateFailed` })
        }
      })
    }
  }
  render () {
    const { from, to, enteredTo } = this.state
    const modifiers = { start: from, end: enteredTo }
    const disabledDays = { before: this.state.from }
    const selectedDays = [from, { from, to: enteredTo }]
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        <div className='container-fluid mt--6 '>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-12 card-wrapper'>
              <div className='card mb-2'>
                <div className='sp-hotels'>
                  <div className='card mb-0'>
                    {/* Card body */}
                    <div className='card-body p-2'>
                      <div className='row align-items-center'>
                        <div className='col-auto'>
                          {/* Avatar */}
                          <a className='rounded-circle'>
                            {/* <img src={this.state.blockedObj && this.state.blockedObj.propertyId && this.state.blockedObj.propertyId.imagePath ? config.baseUrl + this.state.blockedObj.propertyId.imagePath
                              : require('../../images/room1')} className='avatar rounded-circle' /> */}
                          </a>
                        </div>
                        <div className='col ml--2'>
                          <h4 className='mb-2'>
                            <a>{this.state.blockedObj.propertyId.propertyTitle}</a>
                          </h4>
                          <p className='text-sm mb-0'>{this.state.blockedObj.propertyId.propertyType} - {t`lanSPTitleBlockedDatesEdit`}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card-header'>
                  <h3 className='mb-0'>{t`lanSPTitleBlockedDatesEdit`}</h3>
                </div>
                <div className='card-body'>
                  <div className='form-group row'>
                    <div className='col-lg-3'>
                      <div className='form-group'>
                        <label className='form-control-label'>{t`lanSPLabelSelectBlockingType`}<span className='error'>*</span></label>
                        <select value={this.state.blockingType} multiple='' onChange={this.handleSelect} className='form-control' id='exampleFormControlSelect2'>
                          <option value='Continuous Blocking'>Continuous Blocking</option>
                          <option value='Random Blocking'>Random Blocking</option>
                        </select>
                      </div>
                    </div>
                    <div className='col-sm-8 mt-4'>
                      {this.state.blockingType === 'Continuous Blocking'
                        ? <div className='row'>
                          {/* {!from && !to && t`lanSPLabelErrorSelectFirstDay`}
                          {from && !to && t`lanSPLabelErrorSelectLastDay`} */}
                          Block Dates Selected {' '} From <span className='error mx-3 block-from'>
                            {from &&
                              to &&
                              ` ${from.toLocaleDateString()} `}</span> To <span className='error mx-3 block-from'> {from &&
                              to &&
                              `${to.toLocaleDateString()}`}</span>
                        </div>
                        : <div>
                          <div className='row align-items-center'>
                            <div className='col-sm-3'>
                              {this.state.blockingFromDate
                                ? t`lanSPLabelFromDate` + ':' + this.state.blockingFromDate.toLocaleDateString() + ' ' + t`lanSPLabelToDate` + ':' + this.state.blockingFromDate.toLocaleDateString()
                                : t`lanSPLabelErrorSelectFirstDay`}
                            </div>
                          </div>
                        </div>
                        }
                    </div>
                    <div className='col-lg-12 text-center'>
                      {this.state.blockingType === 'Continuous Blocking'
                        ? <div className='calendar mt-4' >
                          <DayPicker
                            className='Range'
                            numberOfMonths={3}
                            selectedDays={selectedDays}
                            disabledDays={{ before: new Date(), disabledDays }}
                            modifiers={modifiers}
                            onDayClick={this.handleDayClick}
                            onDayMouseEnter={this.handleDayMouseEnter}
                          />
                        </div>
                        : <div className='calendar mt-4' >
                          <DayPicker
                            // fromMonth={this.state.blockingFromDate}
                            disabledDays={{
                              before: new Date()
                              // after: this.state.maxDate
                            }}
                            selectedDays={this.state.blockingFromDate}
                            onDayClick={this.handleDayClick}
                          />
                        </div>
                      }
                    </div>
                    <div className='col-md-12 text-center'>
                      <small style={{ color: 'red' }}>{this.state.errorMessage}</small>
                    </div>
                    <div className='col-md-12 text-center'>
                      <button className='btn btn-primary update-edit' onClick={this.handleUpdateBlockedDates}>{t`lanCommonButtonUpdate`}</button>
                      <button className='btn btn-primary update-edit' onClick={this.handleBack}>{t`lanCommonButtonBack`}</button>
                    </div>
                  </div>
                </div>
              </div>
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
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}

ADHostPropertyBlockedDatesEditComponent.propTypes = {
  blockedObj: PropTypes.any
}

export default ADHostPropertyBlockedDatesEditComponent
