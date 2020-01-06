/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import moment from 'moment'
import 'react-drawer/lib/react-drawer.css'
import Modal from 'react-modal'
import DatePicker from 'react-datepicker'
import { addDays } from 'date-fns'
import 'react-day-picker/lib/style.css'
import ReactStars from 'react-stars'
import PropTypes from 'prop-types'
import amenities from '../../../../assets/amenities/amenities.json'
import services from '../../../../assets/services/services.json'
import guestRules from '../../../../assets/guestrules/guestRules.json'
import config from '../../../../public/config.json'

const customStyles = {
  content: {
    width: '75%',
    height: '80vh',
    top: '60%',
    left: 'auto',
    right: '13%',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}
class EUHotelsListFilters extends React.Component {
  constructor (props) {
    super(props)
    let fromDate = moment().format('MMM DD YY')
    let toDate = moment().add(1, 'days').format('MMM DD YY')
    var currentDate = moment.utc(moment().format('YYYY-MM-DD'))
    var checkOut = moment.utc(moment().add(3, 'month').endOf('month').format('YYYY-MM-DD'))
    var duration = moment.duration(checkOut.diff(currentDate))
    var days = duration.asDays()
    this.state = {
      startDate: new Date(),
      modalIsOpen: false,
      // language: ['English', 'Hindi', 'Telugu', 'Tamil', 'Malayali'],
      priceRange: '',
      guests: 2,
      latitude: 17.432178,
      longitude: 78.123478,
      // bedRooms: 1,
      roomType: '',
      rentType: '',
      roomCategory: '',
      sortBy: 'Recommended',
      amenitiesArray: [],
      servicesArray: [],
      guestRulesArray: [],
      filterBy: {},
      basePriceMin: 0,
      basePriceMax: 0,
      rating: 0,
      noOfRooms: 1,
      guestAdultValue: 2,
      guestRooms: 1,
      child: 0,
      dataType: '',
      from: new Date(fromDate),
      to: new Date(toDate),
      guestDropdownActive: false,
      checkInDate: new Date(),
      checkOutDate: new Date(),
      locationSearchObj: this.props.locationSearchObj ? this.props.locationSearchObj : {},
      location: this.props.location ? this.props.location : '',
      isOpen: true,
      hidden: false,
      predictions: [],
      isEnable: false,
      isUserLogedin: false,
      maxDate: days
    }
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleFromChange = this.handleFromChange.bind(this)
    this.handleToChange = this.handleToChange.bind(this)
    this.ratingChanged = this.ratingChanged.bind(this)
    this.handleCheck = this.handleCheck.bind(this)
    this.handleCheckService = this.handleCheckService.bind(this)
    this.handlePriceRange = this.handlePriceRange.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.handleIncrease = this.handleIncrease.bind(this)
    this.handleDecrease = this.handleDecrease.bind(this)
    this.handleSortBy = this.handleSortBy.bind(this)
    this.handleGuestsDropdown = this.handleGuestsDropdown.bind(this)
    this.handleApply = this.handleApply.bind(this)
    this.handleclose = this.handleclose.bind(this)
    this.handleGuestInc = this.handleGuestInc.bind(this)
    this.handleGuestDec = this.handleGuestDec.bind(this)
    this.handleGuestChildDec = this.handleGuestChildDec.bind(this)
    this.handleGuestChildInc = this.handleGuestChildInc.bind(this)
    this.handleGuestRoomsInc = this.handleGuestRoomsInc.bind(this)
    this.handleGuestRoomsDec = this.handleGuestRoomsDec.bind(this)
    this.handleCheckInDate = this.handleCheckInDate.bind(this)
    this.handleCheckOutDate = this.handleCheckOutDate.bind(this)
    this.handleResetAll = this.handleResetAll.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleLocationData = this.handleLocationData.bind(this)
    this.handleHotelPrice = this.handleHotelPrice.bind(this)
  }

  componentWillMount () {
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    if (this.props.locationSearchObj && this.props.locationSearchObj.area && this.props.locationSearchObj.city && this.props.locationSearchObj.state) {
      this.setState({
        guestRooms: this.props.locationSearchObj.guestRooms,
        guestAdultValue: (this.props.locationSearchObj && this.props.locationSearchObj.guestAdultValue) ? this.props.locationSearchObj.guestAdultValue : 2,
        child: (this.props.locationSearchObj && this.props.locationSearchObj.child) ? this.props.locationSearchObj.child : 0,
        checkInDate: (homePageData && homePageData.checkInDate) ? homePageData.checkInDate : (this.props.locationSearchObj && this.props.locationSearchObj.checkInDate)
         ? this.props.locationSearchObj.checkInDate : new Date(),
        checkOutDate: (homePageData && homePageData.checkOutDate) ? homePageData.checkOutDate : (this.props.locationSearchObj && this.props.locationSearchObj.checkOutDate)
         ? this.props.locationSearchObj.checkOutDate : new Date(),
        // checkInDate: homePageData.checkInDate ? homePageData.checkInDate : new Date(),
        // checkOutDate: homePageData.checkOutDate ? homePageData.checkOutDate : new Date(),
        dataType: this.props.dataType
      })
      this.handleHotelPrice((homePageData && homePageData.checkInDate) ? homePageData.checkInDate : (this.props.locationSearchObj && this.props.locationSearchObj.checkInDate)
      ? this.props.locationSearchObj.checkInDate : new Date())
    }
  }

  componentWillReceiveProps (newProps) {
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    if (newProps.locationSearchObj && newProps.locationSearchObj.area && newProps.locationSearchObj.city && newProps.locationSearchObj.state) {
      this.setState({
        guestRooms: newProps.locationSearchObj.guestRooms,
        guestAdultValue: (newProps.locationSearchObj && newProps.locationSearchObj.guestAdultValue) ? newProps.locationSearchObj.guestAdultValue : 2,
        child: (newProps.locationSearchObj && newProps.locationSearchObj.child) ? newProps.locationSearchObj.child : 0,
        // checkInDate: homePageData.checkInDate ? homePageData.checkInDate : newProps.locationSearchObj.checkInDate,
        // checkOutDate: homePageData.checkOutDate ? homePageData.checkOutDate : newProps.locationSearchObj.checkOutDate,
        checkInDate: (homePageData && homePageData.checkInDate) ? homePageData.checkInDate : (newProps.locationSearchObj && newProps.locationSearchObj.checkInDate)
        ? newProps.locationSearchObj.checkInDate : new Date(),
        checkOutDate: (homePageData && homePageData.checkOutDate) ? homePageData.checkOutDate : (newProps.locationSearchObj && newProps.locationSearchObj.checkOutDate)
        ? newProps.locationSearchObj.checkOutDate : new Date(),
        dataType: this.props.dataType
      })
    }
    this.setState({ location: newProps.location })
  }
  handleEnterKey (event) {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }
  async handleSearchChange (event) {
    this.handleResetAll()
    let destination = event.target.value
    if (event.target.value.trim().length) {
      this.setState({
        isEnable: true, location: destination, destination: destination
      })
      const apiurl = `${config.googleMapsPlaceAutoCompleteAPI}${config.googleMapsAPIKey}&input=${destination}&location=${this.state.latitude},${this.state.longitude}&radius=2000`
      try {
        const result = await fetch(config.corsUrl + apiurl)
        const json = await result.json()
        this.setState({
          predictions: json.predictions
        })
      } catch (err) {
        console.log('====Error:', err)
      }
    } else {
      this.setState({
        isEnable: false, location: destination, destination: destination
      })
    }
  }
  async handleLocationData (description) {
    this.setState({
      isEnable: false,
      destination: description
    })
    let _this = this
    const apiurl = `${config.googleMapsGeocodeAPI}${config.googleMapsAPIKey}&address=${description}`
    try {
      const result = await fetch(apiurl)
      const json = await result.json()
      _this.setState({
        latitude: json.results[0].geometry.location.lat,
        longitude: json.results[0].geometry.location.lng
      })
      this.props.getAddressComponents(json.results[0].geometry.location.lat, json.results[0].geometry.location.lng)
    } catch (err) {
      console.log('====Error:', err)
    }
  }

  openModal () {
    this.setState({ modalIsOpen: true })
  }
  closeModal () {
    this.setState({ modalIsOpen: false })
  }
  // showFromMonth () {
  //   const { from, to } = this.state
  //   if (!from) {
  //     return
  //   }
  //   if (moment(to).diff(moment(from), 'months') < 2) {
  //     this.to.getDayPicker().showMonth(from)
  //   }
  // }
  handleFromChange (from) {
    // Change the from date and focus the 'to' input field
    this.setState({ from })
  }
  handleToChange (to) {
    this.setState({ to })
  }
  ratingChanged (rating) {
    this.setState({
      rating: rating
    })
  }
  handleIncrease () {
    this.setState({ guestRooms: this.state.guestRooms + 1 })
  }
  handleDecrease () {
    if (this.state.guestRooms === 1) {
    } else {
      this.setState({ guestRooms: this.state.guestRooms - 1 })
    }
  }
  handleCheck (item) {
    let amenities = this.state.amenitiesArray
    let i = amenities.indexOf(item.name)
    if (i === -1) {
      amenities.push(item.name)
    } else {
      amenities.splice(i, 1)
    }
    this.setState({ amenitiesArray: amenities })
  }
  handleCheckService (item) {
    let services = this.state.servicesArray
    let i = services.indexOf(item.serviceName)
    if (i === -1) {
      services.push(item.serviceName)
    } else {
      services.splice(i, 1)
    }
    this.setState({ servicesArray: services })
  }
  handleCheckRules (item) {
    let rules = this.state.guestRulesArray
    let i = rules.indexOf(item.ruleName)
    if (i === -1) {
      rules.push(item.ruleName)
    } else {
      rules.splice(i, 1)
    }
    this.setState({ guestRulesArray: rules })
  }
  handlePriceRange (event) {
    let value = event.target.value
    switch (value) {
      case 'Upto 1000':
        this.setState({ priceRange: value, basePriceMin: '', basePriceMax: 1000 })
        break
      case '1000-2000':
        this.setState({ priceRange: value, basePriceMin: 1000, basePriceMax: 2000 })
        break
      case '2000-5000':
        this.setState({ priceRange: value, basePriceMin: 2000, basePriceMax: 5000 })
        break
      case '5000-7500':
        this.setState({ priceRange: value, basePriceMin: 5000, basePriceMax: 7500 })
        break
      case '7500-10000':
        this.setState({ priceRange: value, basePriceMin: 7500, basePriceMax: 10000 })
        break
      case '> 10000':
        this.setState({ priceRange: value, basePriceMin: 10000, basePriceMax: '' })
        break
      default:
        this.setState({ priceRange: '', basePriceMin: '', basePriceMax: '' })
        break
    }
  }
  handleSortBy (event) {
    this.setState({ sortBy: event.target.value, modalIsOpen: false })
    this.props.handleDataByListFilters(this.state.dataType, event.target.value, this.state.filterBy, this.state.checkInDate, this.state.checkOutDate, this.state.child, this.state.guestAdultValue, this.state.guestRooms)
    // API call
  }
  handleFilter () {
    this.setState({ guestRooms: this.state.guestRooms })
    let postData = {
      guests: this.state.guestAdultValue,
      noOfRooms: this.state.guestRooms,
      rentType: this.state.rentType,
      roomCategory: this.state.roomCategory,
      roomType: this.state.roomType,
      priceRange: this.state.priceRange,
      basePriceMin: this.state.basePriceMin,
      basePriceMax: this.state.basePriceMax,
      rating: this.state.rating,
      sortBy: this.state.sortBy,
      amenitiesArray: this.state.amenitiesArray,
      servicesArray: this.state.servicesArray,
      guestRulesArray: this.state.guestRulesArray
    }
    this.setState({ modalIsOpen: false, filterBy: postData })
    this.props.handleDataByListFilters(this.state.dataType, this.state.sortBy, postData, this.state.checkInDate, this.state.checkOutDate, this.state.child, this.state.guestAdultValue, this.state.guestRooms)
  }
  handleResetAll () {
    this.setState({
      roomType: '',
      roomCategory: '',
      rentType: '',
      guests: 2,
      guestRooms: 1,
      rating: 0,
      priceRange: '',
      basePriceMin: '',
      basePriceMax: '',
      amenitiesArray: [],
      servicesArray: [],
      guestRulesArray: []
    })
  }
  handleGuestsDropdown () {
    this.setState({
      guestDropdownActive:true
    })
  }
  handleApply () {
    this.setState({
      guestDropdownActive:false
    })
    this.props.handleDataByListFilters(this.state.dataType, this.state.sortBy, this.state.filterBy, this.state.checkInDate, this.state.checkOutDate, this.state.child, this.state.guestAdultValue, this.state.guestRooms)
  }
  handleclose () {
    this.setState({
      guestDropdownActive:false
    })
  }

  handleCheckInDate (date) {
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    let checkOutDate = new Date(moment(date, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD'))
    this.setState({
      checkInDate: date,
      checkOutDate: checkOutDate
    })
    this.handleHotelPrice(date)
    homePageData.checkInDate = date
    homePageData.checkOutDate = checkOutDate
    localStorage.setItem('homePageData', JSON.stringify(homePageData))
  }
  handleCheckOutDate (date) {
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    this.setState({
      checkOutDate: date
    })
    homePageData.checkOutDate = date
    localStorage.setItem('homePageData', JSON.stringify(homePageData))
  }
  handleGuestInc () {
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    this.setState({ guestAdultValue: this.state.guestAdultValue + 1 })
    homePageData.guestAdultValue = this.state.guestAdultValue + 1
    localStorage.setItem('homePageData', JSON.stringify(homePageData))
  }
  handleGuestDec () {
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    if (this.state.guestAdultValue !== 1 && this.state.guestAdultValue !== 0) {
      this.setState({ guestAdultValue: this.state.guestAdultValue - 1 })
      homePageData.guestAdultValue = this.state.guestAdultValue - 1
      localStorage.setItem('homePageData', JSON.stringify(homePageData))
    } else {
      this.setState({ guestAdultValue: 1 })
      homePageData.guestAdultValue = 1
      localStorage.setItem('homePageData', JSON.stringify(homePageData))
    }
  }
  handleGuestChildInc () {
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    this.setState({ child: this.state.child + 1 })
    homePageData.child = this.state.child + 1
    localStorage.setItem('homePageData', JSON.stringify(homePageData))
  }
  handleGuestChildDec () {
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    if (this.state.child === 0) {
    } else {
      this.setState({ child: this.state.child - 1 })
      homePageData.child = this.state.child - 1
      localStorage.setItem('homePageData', JSON.stringify(homePageData))
    }
  }

  handleGuestRoomsInc () {
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    this.setState({ guestRooms: this.state.guestRooms + 1 })
    homePageData.guestRooms = this.state.guestRooms + 1
    localStorage.setItem('homePageData', JSON.stringify(homePageData))
  }
  handleGuestRoomsDec () {
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    if (this.state.guestRooms !== 1 && this.state.guestRooms !== 0) {
      this.setState({ guestRooms: this.state.guestRooms - 1 })
      homePageData.guestRooms = this.state.guestRooms - 1
      localStorage.setItem('homePageData', JSON.stringify(homePageData))
    } else {
      this.setState({ guestRooms: 1 })
    }
  }
  handleHotelPrice (checkInDate) {
    let dt = moment(checkInDate, 'YYYY-MM-DD HH:mm:ss')
    let dateName = dt.format('dddd')
    if (dateName === 'Saturday' || dateName === 'Sunday') {
      this.props.setDay('Weekend')
      localStorage.setItem('Day', 'Weekend')
    } else {
      this.props.setDay('Weekday')
      localStorage.setItem('Day', 'Weekday')
    }
  }
  render () {
    let EUBookingType = JSON.parse(localStorage.getItem('EUBookingType'))
    let checkOutMinDate = EUBookingType === 'Days' ? moment(this.state.checkInDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD') : this.state.checkInDate
    return (
      <div className='container-fluid filters-page pl-5'>
        <div className='row'>
          <div className='col-sm-11 col-lg-4 col-12 '>
            <form>
              <div className=' my-2 col-lg-12 px-0 '>
                <div className='input-group input-group-lg input-group-flush'>
                  <div className='input-group-prepend'>
                    <div className='input-group-text'><span className='fas fa-search' /></div>
                  </div>
                  <input type='search' className='form-control eu-font' placeholder={t`lanEULabelLocationSearch`} value={this.state.location} onChange={this.handleSearchChange} onKeyDown={this.handleEnterKey} />
                </div>
              </div>
            </form>
          </div>
          <div className='col-sm-4 col-lg-1 col-6 pr-0'>
            <span className='cal-icon-position pr-1'><i className='fas fa-calendar-alt' /></span>
            <label className='eu-font mt-2'>{t`lanCommonLabelCheckIn`}</label>
            <DatePicker
              onKeyDown={e => e.preventDefault()}
              selected={this.state.checkInDate ? new Date(this.state.checkInDate) : new Date()}
              onChange={this.handleCheckInDate}
              minDate={new Date()}
              maxDate={addDays(new Date(), this.state.maxDate)}
              className='filter eu-font'
            />
          </div>
          <div className='col-sm-4 col-lg-1 cal-mobile col-6 px-0 '>
            <label className='eu-font mt-2' > <span className='cal-icon-position check-out pr-1'><i className='fas fa-calendar-alt' /></span>{t`lanCommonLabelCheckOut`}</label>
            <DatePicker
              onKeyDown={e => e.preventDefault()}
              selected={this.state.checkOutDate ? new Date(this.state.checkOutDate) : new Date()}
              onChange={this.handleCheckOutDate}
              minDate={new Date(checkOutMinDate)}
              maxDate={addDays(new Date(), this.state.maxDate)}
              className='filter eu-font'
            />
          </div>
          <div className='col-sm-4 col-lg-2 mt-3 col-12 '>
            <a className='guests-picker' onClick={this.handleGuestsDropdown} >
              <span className='cal-icon-position pr-1'><i className='fas fa-users' /></span>
              <label value='large' className='guest-label pl-0 eu-font'>{this.state.guestAdultValue} {t`lanEULabelGuest`}, {this.state.guestRooms} {t`lanEULabelRoom`}</label>
              <span className='btn-inner--icon'><i className='pl-2 fas fa-caret-down' style={{ color: '#716e6e' }} /></span>
            </a>
          </div>
          <div className='col-sm-4 col-lg-2 mt-2 col-6  pr-0 mobile-py'>
            <span className='sort-icon-position pr-1'><i className='fas fa-sort' /></span>
            <select className='selectpicker sorting-picker eu-font pl-4' value={this.state.sortBy} onChange={this.handleSortBy}>
              <option className='eu-font' value=''> {t`lanEUButtonSorting`}</option>
              <option className='eu-font' value='Recommended'>Recommended</option>
              <option className='eu-font' value='Guest Ratings'>Guest Ratings</option>
              <option className='eu-font' value='Price Low to High'>Price Low to High</option>
              <option className='eu-font' value='Price High to Low'>Price High to Low</option>
            </select>
          </div>
          <div className='col-sm-4 col-lg-2 mt-2 col-6 mobile-py m-320'>
            <button className='btn btn-icon btn-primary filter-btn' type='button' onClick={this.openModal}>
              <span className='btn-inner--icon'><i className='pr-2 fa fa-filter' /></span>
              <span className='btn-inner--text'>{t`lanEUButtonFilters`}</span>
              <span className='btn-inner--icon'><i className='pl-2 fas fa-angle-down' /></span>
            </button>
          </div>
        </div>
        {this.state.isEnable
            ? <div className='overlay-filter-search-bg'>
              <div className='search-bg-div-filter'>
                <div className='card-body'>
                  <div className='row mb-2'>
                    <div className='col-sm-12 col-12'>
                      {this.state.predictions.map((predictions, index) => (
                        <a onClick={() => this.handleLocationData(predictions.description)} key={index}>
                          <div><label style={{ color: '#555', fontSize: 13, cursor: 'pointer' }} >{predictions.description}</label><br /></div></a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          : ''}
        {/* <!-- Collapsible content --> */}
        {this.state.guestDropdownActive === true
          ? <div className='overlay-filter-guest-dropdown'>
            <div className='filter-guest-dropdown-div'>
              <div className='card-body'>
                <div className='row mb-2'>
                  <div className='col-sm-3 col-3 py-2'>{t`lanEULabelAdults`}</div>
                  <div className='col-sm-3 col-3'>
                    <button className='circle-class' onClick={this.handleGuestDec} ><i className='fas fa-minus' style={{ color: 'black' }} /></button>
                  </div>
                  <div className='col-sm-3 col-3 py-2 text-center '><strong>{this.state.guestAdultValue} </strong></div>
                  <div className='col-sm-3 col-3'>
                    <button className='circle-class' onClick={this.handleGuestInc} ><i className='fas fa-plus' style={{ color: 'black' }} /></button>
                  </div>
                </div>
                <div className='row mb-2'>
                  <div className='col-sm-3 col-3 py-2'>{t`lanEULabelChildren`}</div>
                  <div className='col-sm-3 col-3'>
                    <button className='circle-class' onClick={this.handleGuestChildDec} ><i className='fas fa-minus' style={{ color: 'black' }} /></button>
                  </div>
                  <div className='col-sm-3 col-3 py-2 text-center '><strong>{this.state.child}</strong></div>
                  <div className='col-sm-3 col-3'>
                    <button className='circle-class' onClick={this.handleGuestChildInc} ><i className='fas fa-plus' style={{ color: 'black' }} /></button>
                  </div>
                </div>
                <div className='row mb-2'>
                  <div className='col-sm-3 col-3 py-2'>{t`lanCommonLabelNumberOfRooms`}</div>
                  <div className='col-sm-3 col-3'>
                    <button className='circle-class' onClick={this.handleGuestRoomsDec} ><i className='fas fa-minus' style={{ color: 'black' }} /></button>
                  </div>
                  <div className='col-sm-3 col-3 py-2 text-center '><strong>{this.state.guestRooms} </strong></div>
                  <div className='col-sm-3 col-3'>
                    <button className='circle-class' onClick={this.handleGuestRoomsInc} ><i className='fas fa-plus' style={{ color: 'black' }} /></button>
                  </div>
                </div>
                <div className='row mt-3'>
                  <div className='col-sm-12 col-12 text-right'>
                    <button className='btn btn-danger' onClick={this.handleclose} > {t`lanEUButtonClose`}</button>
                    <button className='btn btn-primary' onClick={this.handleApply} > {t`lanEUButtonApply`}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        : null}
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel='Filter Modal'
          ariaHideApp={false}
        >
          <div className='row p-2 modal-close mr-auto' style={{ justifyContent: 'flex-end' }}>
            <button type='button' onClick={this.handleResetAll} className='btn btn-outline-success eu-font'>{t`lanEUButtonResetAll`}</button>
            <a onClick={this.closeModal}><span><i className='fas fa-times' /></span></a>
          </div>
          <div className='modal-filter'>
            <div className='row'>
              {/* modal filters data started */}
              <div className='col-md-12 col-sm-12 col-xs-12 sub-menu mb-xl-0 mb-4'>
                {/* Room filters  started */}
                <div className='row'>
                  <div className='col-sm-12'>
                    <p>{t`lanEUTitleRoomFilter`}</p>
                  </div>
                  <div className='col-lg-3 col-sm-3 col-xs-12'>
                    <small className='eu-font'>{t`lanEULabelRoomType`}</small>
                    <select className='form-control eu-font' value={this.state.roomType} onChange={(event) => this.setState({ roomType: event.target.value })}>
                      <option value='' className='eu-font'>{t`lanEULabelSelectRoomType`}</option>
                      <option className='eu-font' value='Single Bed Room'>Single Bed Room</option>
                      <option className='eu-font' value='Double Bed Room'>Double Bed Room</option>
                      <option className='eu-font' value='1 BHK'>1 BHK</option>
                      <option className='eu-font' value='2 BHK'>2 BHK</option>
                      <option className='eu-font' value='3 BHK'>3 BHK</option>
                      <option className='eu-font' value='Full Apartment'>Full Apartment</option>
                      <option className='eu-font' value='Loft'>Loft</option>
                      <option className='eu-font' value='Cabin'>Cabin</option>
                      <option className='eu-font' value='Villa'>Villa</option>
                      <option className='eu-font' value='Castle'>Castle</option>
                      <option className='eu-font' value='Dorm'>Dorm</option>
                    </select>
                  </div>
                  <div className='col-lg-3 col-sm-3 col-xs-12'>
                    <small className='eu-font'>{t`lanEULabelRoomCategory`}</small>
                    <select className='form-control eu-font' value={this.state.roomCategory} onChange={(event) => this.setState({ roomCategory: event.target.value })}>
                      <option className='eu-font' value=''>{t`lanEULabelSelectRoomCategory`}</option>
                      <option className='eu-font' value='Economy'>Economy</option>
                      <option className='eu-font' value='Deluxe'>Deluxe</option>
                      <option className='eu-font' value='Luxury'>Luxury</option>
                    </select>
                  </div>
                  <div className='col-lg-3 col-sm-3 col-xs-12'>
                    <small className='eu-font' >{t`lanEULabelRentType`}</small>
                    <select className='form-control eu-font' value={this.state.rentType} onChange={(event) => this.setState({ rentType: event.target.value })}>
                      <option className='eu-font' value=''>{t`lanEULabelSelectRentType`}</option>
                      <option className='eu-font' value='Sharing Room'>Sharing Room</option>
                      <option className='eu-font' value='Private Room'>Private Room</option>
                      <option className='eu-font' value='Entire Space'>Entire Space</option>
                    </select>
                  </div>
                  <div className='col-lg-3 col-sm-3 col-xs-12 col-12 modal-filter-rooms-mobile'>
                    <small className='eu-font' >{t`lanCommonLabelNumberOfRooms`}</small>
                    <div className='row'>
                      <div className='col-sm-4 col-4'>
                        <button className='circle-class' onClick={this.handleDecrease} ><i className='fas fa-minus' style={{ color: 'black' }} /></button>
                      </div>
                      <div className='col-sm-4 col-4 py-2 text-left '><strong className='eu-font'> {this.state.guestRooms} </strong></div>
                      <div className='col-sm-4 col-4'>
                        <button className='circle-class' onClick={this.handleIncrease} ><i className='fas fa-plus' style={{ color: 'black' }} /></button>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                {/* Room filters  end */}
                <div className='row'>
                  <div className='col-sm-12'>
                    <p className='eu-font' >{t`lanEUTitlePriceRange&Reviews`}</p>
                  </div>
                  <div className='col-md-6'>
                    <div className='form-group'>
                      <small className='eu-font'>{t`lanEULabelPriceRangePerNight`}</small>
                      <select className='form-control eu-font' id='exampleFormControlSelect1' value={this.state.priceRange} onChange={this.handlePriceRange}>
                        <option className='eu-font' value=''>{t`lanEULabelSelectPriceRange`}</option>
                        <option className='eu-font' value='Upto 1000'>Upto 1000</option>
                        <option className='eu-font' value='1000-2000'>1000-2000</option>
                        <option className='eu-font' value='2000-5000'>2000-5000</option>
                        <option className='eu-font' value='5000-7500'>5000-7500</option>
                        <option className='eu-font' value='7500-10000'>7500-10000</option>
                        <option className='eu-font' value='> 10000'>> 10000</option>
                      </select>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <small className='eu-font'>{t`lanEULabelRating`}</small>
                    <ReactStars
                      count={5}
                      onChange={this.ratingChanged}
                      value={this.state.rating}
                      size={24}
                      color2={'#ffd700'}
                    />
                  </div>
                </div>
                <hr />
                {/* Price and Reviews filters  end */}
                <div className='aminities'>
                  <div className='row'>
                    <div className='col-sm-12'>
                      <p className='eu-font' >{t`lanEULabelAmenities`}</p>
                    </div>
                    {amenities && amenities.length > 0 ? amenities.map((item, i) => {
                      let checked = this.state.amenitiesArray.find(amenity => (amenity === item.name))
                      return (
                        <div className='col-sm-4 col-lg-3 col-xs-12 col-6 pt-2' key={i}>
                          <input type='checkbox' id='customCheck1' checked={checked === item.name} onChange={() => this.handleCheck(item)} />
                          <small className='pl-2 eu-font font-weight-700' >{item.name}</small>
                        </div>
                      )
                    }
                    ) : <div className='row justify-content-center'>
                      <div className='col-sm-12 text-center py-4' >
                        <div className='eu-font'><p className='eu-font'>{t`lanEULabelErrorNoAmenities`}</p></div>
                      </div>
                    </div>
                    }
                    <div className='col-sm-12 pt-2 filter-more'>
                      <a className=' more-trigger' data-more={t`lanEUButtonMore`} data-less='Less'>
                        <i className='far fa-arrow-alt-circle-down' />
                      </a>
                    </div>
                  </div>
                </div>
                <hr />
                {/* eminities filter section end */}
                <div className='services'>
                  <div className='row '>
                    <div className='col-sm-12'>
                      <p className='eu-font' >{t`lanEUTitleServices`}</p>
                    </div>
                    {services && services.length > 0 ? services.map((item, i) => {
                      let checked = this.state.servicesArray.find(service => (service === item.serviceName))
                      return (
                        <div className='col-sm-4 col-lg-3 col-6 col-xs-12 pt-2' key={i}>
                          <input type='checkbox' id='customCheck1' checked={checked === item.serviceName} onChange={() => this.handleCheckService(item)} />
                          <small className='pl-2 eu-font font-weight-700' >{item.serviceName}</small>
                        </div>
                      )
                    }
                    ) : <div className='row justify-content-center'>
                      <div className='col-sm-12 text-center py-4' >
                        <div className='eu-font'><p className='eu-font'>{t`lanEULabelErrorNoServices`}</p></div>
                      </div>
                    </div>
                    }
                    <div className='col-sm-12 pt-2 filter-more'>
                      <a className=' more-trigger' data-more={t`lanEUButtonMore`} data-less='Less'>
                        <i className='far fa-arrow-alt-circle-down' />
                      </a>
                    </div>
                  </div>
                </div>
                <hr />
                {/* service filter section ends */}
                <div className='rules'>
                  <div className='row '>
                    <div className='col-sm-12'>
                      <p className='eu-font' >{t`lanEUTitleGuestRules`}</p>
                    </div>
                    {guestRules && guestRules.length > 0 ? guestRules.map((item, i) => {
                      let checked = this.state.guestRulesArray.find(rules => (rules === item.ruleName))
                      return (
                        <div className='col-sm-4 col-lg-3 col-12 col-xs-12 pt-2' key={i}>
                          <input type='checkbox' id='customCheck1' checked={checked === item.ruleName} onChange={() => this.handleCheckRules(item)} />
                          <small className='pl-2 eu-font font-weight-700' >{item.ruleName}</small>
                        </div>
                      )
                    }
                    ) : <div className='row justify-content-center'>
                      <div className='col-sm-12 text-center py-4' >
                        <div className='eu-font'><p className='eu-font'>{t`lanEULabelErrorNoGuestRules`}</p></div>
                      </div>
                    </div>
                    }
                    <div className='col-sm-12 pt-2 filter-more'>
                      <a className=' more-trigger' data-more={t`lanEUButtonMore`} data-less='Less'>
                        <i className='far fa-arrow-alt-circle-down' />
                      </a>
                    </div>
                  </div>
                </div>
                <hr />
                {/* rules filter section end */}
                <div className='row modal-btns mr-auto' >
                  <button onClick={this.closeModal} className='btn btn-danger btn-text-dark' type='button' >{t`lanCommonButtonCancel`}</button>
                  <button className='btn btn-success' type='button' onClick={this.handleFilter} >{t`lanEUButtonApply`}</button>
                </div>
                {/* filters end and button end */}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

EUHotelsListFilters.propTypes = {
  locationSearchObj: PropTypes.any,
  handleDataByListFilters: PropTypes.any,
  dataType: PropTypes.any,
  getAddressComponents: PropTypes.any,
  location: PropTypes.any,
  setDay: PropTypes.func
}
export default EUHotelsListFilters

