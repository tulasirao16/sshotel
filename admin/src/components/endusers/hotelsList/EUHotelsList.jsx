/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import './Css/EUHotelsList.css'
import './Css/EUDropdownStyles.css'
import './Css/modal.css'
import './Css/HotelsListResponsive.css'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import moment from 'moment'
// import classnames from 'classnames'
import MainHeader from '../../../components/endusers/HeaderCompnt/MainHeader'
import HeaderWithoutLogin from '../../../components/endusers/HeaderCompnt/HeaderWithoutLogin'
// import FooterComponent from '../FooterCompnt/Footer'
import EUHotelsListFilters from './EUHotelsListFilters'
// import Map from 'react-js-google-maps'
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import Pagination from 'react-js-pagination'
import HotelsListView from './EUHotelsListView'
import HotelsMapView from './EUHotelsMapView'
import EUHotelsEachRowListComponent from './EUHotelEachRowList'

// const Amenities = require('../../../../assets/amenities/amenities.json')
var ip = require('ip')
// import HotelListStickyFilters from './HotelListStickyFilters'
// import '../../../css/style.css'

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
class EUHotelsList extends React.Component {
  constructor () {
    super()
    this.state = {
      location: '',
      modalIsOpen: false,
      startDate: new Date(),
      prevScrollpos: window.pageYOffset,
      visible: true,
      latitude: 17.4301,
      longitude: 78.5416,
      guestAdultValue: 2,
      guestRooms: 1,
      sortBy: 'Recommended',
      dataType: '',
      filterBy: {},
      SPPropertyList: [],
      locationSearchObj: JSON.parse(localStorage.getItem('locationSearchObj')),
      area: '',
      city: '',
      state: '',
      activePage: 1,
      totalCount: 0,
      mapOptions: {
        zoom: 5,
        center: { lat: 0, lng: 0 }
      },
      authObj: {},
      favouriteProperties: [],
      isBothViewShow: true,
      isMapViewShow: false,
      isListViewShow: false,
      mapHotelData: false,
      selectedHotelData: {},
      spPropertyInfo: [],
      spPropertyIDs: [],
      compareModalIsOpen: false

    }
    this.handleHotelListItemView = this.handleHotelListItemView.bind(this)
    this.handleListView = this.handleListView.bind(this)
    this.handleMapView = this.handleMapView.bind(this)
    this.handleHotelList = this.handleHotelList.bind(this)
    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind()
    this.closeModal = this.closeModal.bind(this)
    this.setMarker = this.setMarker.bind(this)
    this.onMapLoad = this.onMapLoad.bind(this)
    this.getAddressComponents = this.getAddressComponents.bind(this)
    this.handleDataByLocation = this.handleDataByLocation.bind(this)
    this.handleDefaultData = this.handleDefaultData.bind(this)
    // this.handleSetUserLocation = this.handleSetUserLocation.bind(this)
    this.handleDataByListFilters = this.handleDataByListFilters.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.onMarkerClick = this.onMarkerClick.bind(this)
    this.handleFavouriteProperty = this.handleFavouriteProperty.bind(this)
    this.handleCompare = this.handleCompare.bind(this)
    this.handleComparePopup = this.handleComparePopup.bind(this)
    this.handleComparePage = this.handleComparePage.bind(this)
    this.onMapClicked = this.onMapClicked.bind(this)
  }
  componentWillUnmount () {
    // If this component is unmounted, stop listening
  }
  componentWillMount () {
    window.addEventListener('scroll', this.handleScroll)
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    if (homePageData) {
      this.setState({ guestAdultValue: homePageData.guestAdultValue,
        child: homePageData.child,
        guestRooms: homePageData.guestRooms
      })
    } else {
      homePageData = {
        checkInDate: new Date(),
        checkOutDate: new Date(moment().add(1, 'day').format('YYYY-MM-DD')),
        child: 0,
        guestAdultValue: 2,
        guestRooms: 1

      }
      localStorage.setItem('homePageData', JSON.stringify(homePageData))
    }
    if (authObj && authObj.preferences) {
      let favouriteProperties = (authObj && authObj.preferences && authObj.preferences.favouriteProperties) ? authObj.preferences.favouriteProperties : []
      this.setState({ authObj: authObj, favouriteProperties: favouriteProperties })
    }
    let locationSearchObj = JSON.parse(localStorage.getItem('locationSearchObj'))
    if (locationSearchObj && locationSearchObj.area && locationSearchObj.city && locationSearchObj.state) {
      this.handleDataByLocation(locationSearchObj.area, locationSearchObj.city, locationSearchObj.state, locationSearchObj.guestAdultValue, locationSearchObj.guestRooms)
      this.setState({
        latitude: locationSearchObj.latitude,
        longitude: locationSearchObj.longitude,
        location: locationSearchObj.area + ',' + locationSearchObj.city + ',' + locationSearchObj.state,
        area: locationSearchObj.area,
        city: locationSearchObj.city,
        state: locationSearchObj.state,
        mapOptions: {
          zoom: 13,
          center: { lat: locationSearchObj.latitude, lng: locationSearchObj.longitude }
        },
        dataType: 'byLocation'
      })
      // setTimeout(() => {
      //   this.handleSetUserLocation(locationSearchObj.latitude, locationSearchObj.longitude)
      // }, 500)
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null
          })
          this.getAddressComponents(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          this.setState({ error: error.message, dataType: 'default' })
          this.handleDefaultData()
        },
        { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
      )
    }
  }

  getAddressComponents (lat, long) {
    let locationSearchObj = JSON.parse(localStorage.getItem('locationSearchObj'))
    if (!locationSearchObj) {
      locationSearchObj = {}
    }
    this.setState({
      mapOptions: {
        zoom: 13,
        center: { lat: lat, lng: long }
      }
    })
    let area = ''
    let city = ''
    let state = ''
    fetch(config.googleGeoLocationLatLng + lat + ',' + long + '&key=' + config.googleMapsAPIKey)
      .then((response) => response.json())
      .then((responseJson) => {
        responseJson.results[0].address_components.forEach(data => {
          if (data.types.indexOf('sublocality_level_1') !== -1) {
            area = data.long_name
            this.setState({ area: data.long_name })
          }
          if (data.types.indexOf('administrative_area_level_2') !== -1) {
            city = data.long_name
            this.setState({ city: data.long_name })
          }
          if (data.types.indexOf('administrative_area_level_1') !== -1) {
            state = data.long_name
            this.setState({ state: data.long_name })
          }
        })
        if (area && city && state) {
          locationSearchObj.area = area
          locationSearchObj.city = city
          locationSearchObj.state = state
          locationSearchObj.latitude = lat
          locationSearchObj.longitude = long
          locationSearchObj.guestRooms = 1
          localStorage.setItem('locationSearchObj', JSON.stringify(locationSearchObj))
          this.setState({ location: area + ', ' + city + ', ' + state, latitude: lat, longitude: long })
          this.handleDataByLocation(area, city, state, this.state.guestAdultValue, this.state.guestRooms)
          // this.handleSetUserLocation(lat, long)
        }
      }).catch((error) => {
        console.log('error', error)
      })
  }

  // handleDataByLocation (area, city, state) {
  //   let num = 1
  //   let postJson = {
  //     'dataType': 'byLocation',
  //     'noOfPersons': this.state.guestAdultValue,
  //     'noOfRooms': this.state.guestRooms,
  //     'sortBy': this.state.sortBy,
  //     'filterBy': this.state.filterBy,
  //     'activePage': num,
  //     'area': 'Tarnaka',
  //     'city': city,
  //     'state': state
  //   }
  //   let propertiesList = { url: config.baseUrl + config.postEUMapViewPropertyGetAPI, body: postJson }
  //   let _this = this
  //   APICallManager.postCall(propertiesList, function (resObj) {
  //     console.log('resObj:', resObj)
  //     if (resObj.data.statusCode === '0000') {
  //       _this.setState({ SPPropertyList: resObj.data.statusResult.homedata })
  //       setTimeout(function () {
  //         _this.onMapLoad()
  //       }, 2000)
  //     } else {
  //       _this.setState({ SPPropertyList: [] })
  //     }
  //   })
  // }

  handleDataByLocation (area, city, state, guestAdultValue, guestRooms) {
    this.setState({ dataType: 'byLocation' })
    let num = 1
    let noOfRooms = 1
    if (guestRooms) {
      noOfRooms = guestRooms
    }
    let noOfPersons = 2
    if (guestAdultValue) {
      noOfPersons = guestAdultValue
    }
    let postJson = {
      'dataType': 'byLocation',
      'noOfPersons': noOfPersons,
      'noOfRooms': noOfRooms,
      'sortBy': this.state.sortBy,
      'filterBy': this.state.filterBy,
      'activePage': num,
      'area': area,
      'city': city,
      'state': state
    }
    let propertiesList = { url: config.baseUrl + config.postEUHomePropertyGetAPI, body: postJson }
    let _this = this
    APICallManager.postCall(propertiesList, function (resObj) {
      if (resObj && resObj.data.statusCode === '0000') {
        _this.setState({ SPPropertyList: resObj.data.statusResult.homeData, totalCount: resObj.data.statusResult.totalDocs })
      } else {
        _this.setState({ SPPropertyList: [], totalCount: 0 })
      }
    })
  }
  handleDefaultData () {
    this.setState({ dataType: 'default' })
    let ipAddress = ip.address()
    let num = 1
    let postJson = {
      'dataType': 'default',
      'noOfPersons': this.state.guestAdultValue,
      'noOfRooms': this.state.guestRooms,
      'sortBy': this.state.sortBy,
      'filterBy': this.state.filterBy,
      'activePage': num,
      'ip': ipAddress
    }
    let propertiesList = { url: config.baseUrl + config.postEUHomePropertyGetAPI, body: postJson }
    let _this = this
    APICallManager.postCall(propertiesList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ SPPropertyList: resObj.data.statusResult.homeData, totalCount: resObj.data.statusResult.totalDocs })
      } else {
        _this.setState({ SPPropertyList: [], totalCount: 0 })
      }
    })
  }
  handleDataByListFilters (dataType, sortBy, filterBy, checkInDate, checkOutDate, child, guestAdultValue, guestRooms) {
    let locationSearchObj = JSON.parse(localStorage.getItem('locationSearchObj'))
    locationSearchObj.guestRooms = guestRooms
    locationSearchObj.guestAdultValue = guestAdultValue
    locationSearchObj.child = child
    locationSearchObj.checkInDate = checkInDate
    locationSearchObj.checkOutDate = checkOutDate
    locationSearchObj.guestRooms = guestRooms
    this.setState({ locationSearchObj: locationSearchObj })
    localStorage.setItem('locationSearchObj', JSON.stringify(locationSearchObj))
    this.setState({
      guestAdultValue: guestAdultValue,
      guestRooms: guestRooms,
      sortBy: sortBy,
      filterBy: filterBy
    })
    let num = 1
    let postJson = {}
    if (dataType === 'byLocation') {
      postJson = {
        'dataType': dataType,
        'noOfPersons': guestAdultValue,
        'noOfRooms': guestRooms,
        'rentType': filterBy.rentType,
        'roomCategory': filterBy.roomCategory,
        'roomType': filterBy.roomType,
        'sortBy': sortBy,
        'filterBy': filterBy,
        'activePage': num,
        'area': this.state.area,
        'city': this.state.city,
        'state': this.state.state
      }
    } else {
      let ipAddress = ip.address()
      postJson = {
        'dataType': 'default',
        'noOfPersons': this.state.guestAdultValue,
        'noOfRooms': this.state.guestRooms,
        'sortBy': this.state.sortBy,
        'filterBy': this.state.filterBy,
        'activePage': num,
        'ip': ipAddress
      }
    }
    let propertiesList = { url: config.baseUrl + config.postEUHomePropertyGetAPI, body: postJson }
    let _this = this
    APICallManager.postCall(propertiesList, function (resObj) {
      if (resObj && resObj.data.statusCode === '0000') {
        _this.setState({ SPPropertyList: resObj.data.statusResult.homeData, totalCount: resObj.data.statusResult.totalDocs })
      } else {
        _this.setState({ SPPropertyList: [], totalCount: 0 })
      }
    })
  }
  handlePageChange (pageNumber) {
    this.setState({ activePage: pageNumber })
    let postJson = {
      'dataType': 'byLocation',
      'noOfPersons': this.state.guestAdultValue,
      'noOfRooms': this.state.guestRooms,
      'sortBy': this.state.sortBy,
      'filterBy': this.state.filterBy,
      'activePage': pageNumber,
      'area': this.state.area,
      'city': this.state.city,
      'state': this.state.state
    }
    let propertiesList = { url: config.baseUrl + config.postEUHomePropertyGetAPI, body: postJson }
    let _this = this
    APICallManager.postCall(propertiesList, function (resObj) {
      if (resObj && resObj.data.statusCode === '0000') {
        _this.setState({ SPPropertyList: resObj.data.statusResult.homeData, totalCount: resObj.data.statusResult.totalDocs })
      } else {
        _this.setState({ SPPropertyList: [], totalCount: 0 })
      }
    })
  }

  handleHotelListItemView (e) {
    localStorage.setItem('EUPropertyInfoData', JSON.stringify(e))
    hashHistory.push('/hotels/booknow')
    event.preventDefault()
  }
  handleListView () {
    this.setState({
      isBothViewShow: false,
      isListViewShow: true,
      isMapViewShow: false
    })
    // hashHistory.push('/hotels/listView')
    // event.preventDefault()
  }
  handleMapView () {
    this.setState({
      isBothViewShow: false,
      isListViewShow: false,
      isMapViewShow: true
    })
    // hashHistory.push('/hotels/mapView')
    // event.preventDefault()
  }
  handleHotelList () {
    this.setState({
      isBothViewShow: true,
      isListViewShow: false,
      isMapViewShow: false
    })
    // hashHistory.push('/hotels')
    // event.preventDefault()
  }
  openModal () {
    this.setState({ modalIsOpen: true })
  }
  afterOpenModal () {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00'
  }
  closeModal () {
    this.setState({ compareModalIsOpen: false })
  }
  onMapLoad () {
    if (this.state.SPPropertyList && this.state.SPPropertyList.length) {
      this.state.SPPropertyList.map((item, i) =>
        this.setMarker(item.spLocationObj)
      )
    }
  }
  setMarker (data) {
    var uluru = { lat: data.latitude, lng: data.longitude }
    var marker = new window.google.maps.Marker({
      position: uluru,
      map: window.gmaps['map1'].gmap
    })
  }

  // handleSetUserLocation (latitude, longitude) {
  //   var image = {
  //     url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
  //     size: new window.google.maps.Size(20, 32),
  //     origin: new window.google.maps.Point(0, 0),
  //     anchor: new window.google.maps.Point(0, 32)
  //   }
  //   let pos = { lat: latitude, lng: longitude }
  //   console.log('pos========', pos)
  //   var info = new window.google.maps.Marker({
  //     position: pos,
  //     map: window.gmaps['map1'].gmap,
  //     icon: image
  //   })
  // }

  onMarkerClick (data) {
    this.setState({ mapHotelData: true, selectedHotelData: data })
  }

  handleFavouriteProperty (favProperties, newAuthObj) {
    this.setState({ favouriteProperties: favProperties, authObj: newAuthObj })
  }
  handleCompare (item) {
    let info = this.state.spPropertyInfo
    let infoIDs = this.state.spPropertyIDs
    let i = infoIDs.indexOf(item._id)
    if (i === -1) {
      if (infoIDs.length >= 3) {
        alert(t`lanEULabelErrorCompareHostsLimit`)
      } else {
        infoIDs.push(item._id)
        info.push(item)
      }
    } else {
      infoIDs.splice(i, 1)
      info.splice(i, 1)
    }
    this.setState({ spPropertyIDs: infoIDs, spPropertyInfo: info })
    this.handleComparePopup()
  }
  handleComparePopup () {
    if (this.state.spPropertyIDs.length > 1 && this.state.spPropertyIDs.length <= 3) {
      this.setState({ compareModalIsOpen: true })
    } else if (this.state.spPropertyIDs.length === 1) {
      this.setState({ compareModalIsOpen: true })
    } else {
      this.setState({ compareModalIsOpen: false })
    }
  }
  handleComparePage () {
    localStorage.setItem('spPropertyIDs', JSON.stringify(this.state.spPropertyIDs))
    localStorage.setItem('spPropertyInfo', JSON.stringify(this.state.spPropertyInfo))
    hashHistory.push('/properties/compare')
  }
  onMapClicked () {
    this.setState({ mapHotelData: false, selectedHotelData: {} })
  }
  render () {
    // const mapOptions = {
    //   zoom: 5,
    //   center: { lat: this.state.latitude, lng: this.state.longitude }
    // }
    return (
      <div id='hotel-list-page-1'>
        <div id='page-wrapper'>
          {/* Page Header started */}
          <section className='eu-header-section'>
            {this.state.authObj && this.state.authObj.userRole === 'Customer' ? <MainHeader /> : <HeaderWithoutLogin />}
            {/* <MainHeader /> */}
          </section>
          {/* ====================================== Page Header end ====================================== */}
          {/* fiter section start */}
          <section className='filter-section bg-white'>
            <EUHotelsListFilters location={this.state.location} getAddressComponents={this.getAddressComponents} locationSearchObj={this.state.locationSearchObj}
              handleDataByListFilters={this.handleDataByListFilters} dataType={this.state.dataType} />
            {/* <div className='page-header-filter w-100'>
              <div className='search-bar p-0 p-lg-1 position-relative z-index-20' style={{ borderRadius: 0 }}>
                <EUHotelsListFilters locationSearchObj={this.state.locationSearchObj} handleDataByListFilters={this.handleDataByListFilters} dataType={this.state.dataType} />
              </div>
            </div> */}
          </section>
          {/* ====================================== fiter section end ====================================== */}
          {/* ====================== main body start ====================== */}
          <section role='main' className='inner cover hotels-page-hotel-list'>
            <div className='album pt-1 bg-white'>
              {this.state.isBothViewShow
                ? <div className='container-fluid'>
                  <div className='row'>
                    {/* =================== view filter, map column start =========================== */}
                    <div className='col-lg-3 col-xs-12 ui half-layout'>
                      <div className='switch-view-controller'>
                        <a onClick={this.handleListView} className='item'>
                          <i className='fas fa-th' />
                          <span>List</span>
                        </a>
                        <a onClick={this.handleHotelList} id='both-trigger' className='item active hidden-mobile'>
                          <i className='far fa-object-group' />
                          <span>Both</span>
                        </a>
                        <a onClick={this.handleMapView} id='only-map-trigger' className='item'>
                          <i className='fas fa-map-marker-alt' />
                          <span>Map</span>
                        </a>
                        <a href='' className='modal-trigger item hidden-desktop hidden-large-desktop' data-trigger-for='menu02'>
                          <i className='icon icon-filter' />
                          <span>Filters</span>
                        </a>
                      </div>
                      <div className='map-list'>
                        <Map google={this.props.google} zoom={16} initialCenter={{ lat: this.state.latitude, lng: this.state.longitude }} onClick={this.onMapClicked} >
                          {this.state.SPPropertyList.length > 0
                            ? this.state.SPPropertyList.map((data, i) =>
                              <Marker
                                className='list-map'
                                title={data.propertyTitle}
                                name={'SOMA'}
                                position={{ lat: data.spLocationObj.latitude, lng: data.spLocationObj.longitude }}
                                onClick={() => this.onMarkerClick(data)} key={i} />
                            ) : null}
                        </Map>
                        {/* <Map
                          id='map1'
                          apiKey={config.googleMapsAPIKey}
                          mapOptions={this.state.mapOptions}
                          style={{ width: '100%', height: 480, position:'fixed' }}
                          onLoad={this.onMapLoad}
                          className='sticky-map'
                        /> */}
                      </div>
                    </div>
                    {/* hotel data in map starts  */}
                    {this.state.mapHotelData
                      ? <div className='overlay-map-data'>
                        <div className='hotel-data-div'>
                          <div className='card bg-dark text-white border-0'>
                            <img className='card-img' src={(this.state.selectedHotelData.propertyId && this.state.selectedHotelData.propertyId.imagePath)
                               ? config.baseUrl + this.state.selectedHotelData.propertyId.imagePath : require('../../../../assets/property_big_05.jpg')} alt='Card image' />
                            <div className='card-img-overlay d-flex align-items-center'>
                              <div>
                                <h5 className='h2 card-title text-white mb-2'>{this.state.selectedHotelData.propertyTitle}</h5>
                                {this.state.selectedHotelData.rating
                                  ? <div className='txt2'>
                                    {this.state.selectedHotelData.rating}
                                    <div className='small-stars'>
                                      <i className='fa fa-star' />
                                      <i className='fa fa-star' />
                                      <i className='fa fa-star' />
                                      <i className='fa fa-star' />
                                      <i className='fa fa-star' />
                                    </div>
                                  </div> : ''}
                                <p className='card-text text-sm font-weight-bold'>Price: {this.state.selectedHotelData.pricing.basePrice}</p>
                                <button className='btn btn-sm btn-success' onClick={() => this.handleHotelListItemView(this.state.selectedHotelData)}>Book Now</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      : ''}
                    {/* =================== view filter, map column start =========================== */}
                    {/* =================== listView column start =========================== */}

                    <div className='col-lg-9 col-xs-12 both-list m-auto pl-4' >
                      <div className='row bg-light py-4'>
                        {this.state.SPPropertyList.length > 0
                        ? this.state.SPPropertyList.map((item, i) =>
                          <EUHotelsEachRowListComponent data={item} key={i} SPPropertyList={this.state.SPPropertyList} authObj={this.state.authObj}
                            favouriteProperties={this.state.favouriteProperties} handleFavouriteProperty={this.handleFavouriteProperty} handleCompare={this.handleCompare} spPropertyIDs={this.state.spPropertyIDs} />
                        ) : <div className='container'>
                          <div className='row justify-content-center'>
                            <div className='col-sm-12 text-center my-8' >
                              <div className='no-data'><p>{t`lanCommonLabelNoResultsFound`}</p></div>
                            </div>
                          </div>
                        </div>
                        } {/* container no data end */}
                      </div> {/* col-lg-9 row end */}
                      {this.state.SPPropertyList && this.state.SPPropertyList.length > 0
                        ? <div className='container text-center'>
                          <div className='row bg-grey'>
                            <div className=' col-sm-12 text-center my-5'>
                              <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={20}
                                totalItemsCount={this.state.totalCount}
                                pageRangeDisplayed={5}
                                onChange={this.handlePageChange}
                              />
                            </div>
                          </div>
                        </div>
                        : null
                      }
                    </div> {/* col-lg-9  col end */}
                  </div> {/* row end */}
                </div>
                : this.state.isListViewShow ? <HotelsListView handleFavouriteProperty={this.handleFavouriteProperty}
                  handleListView={this.handleListView} handleMapView={this.handleMapView} handleHotelList={this.handleHotelList} SPPropertyList={this.state.SPPropertyList} authObj={this.state.authObj} />
                : this.state.isMapViewShow ? <HotelsMapView handleListView={this.handleListView} handleMapView={this.handleMapView}
                  handleHotelList={this.handleHotelList} latitude={this.state.latitude} longitude={this.state.longitude}
                  area={this.state.area} city={this.state.city} state={this.state.state} guestAdultValue={this.state.guestAdultValue}
                  guestRooms={this.state.guestRooms} sortBy={this.state.sortBy} filterBy={this.state.filterBy} /> : ''}
            </div>
          </section>
          {/* <FooterComponent /> */}
        </div>
        <div >
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel='Example Modal'
          >
            <div className='modal-body room-modal'>
              <div className='container'>
                <div className='row'>
                  <div className='col-lg-12 col-sm-12 col-xs-12 text-right'>
                    <a className='text-right ' onClick={this.closeModal}><i className='fas fa-times' style={{ fontSize: 25 }} /></a>
                  </div>
                </div>
                <div className='section-1'>
                  <p className='modal-title mb-3'>ROOM TYPE :</p>
                  <div className='form-group row'>
                    <label className='col-md-7 col-form-label form-control-label'>Sharing</label>
                    <div className='col-md-4'>
                      <div className='row'>
                        <div className='col-md-3 col-auto page-item'>
                          <input className='radio-btn' type='radio' />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <label className='col-md-7 col-form-label form-control-label'>Individual House</label>
                    <div className='col-md-4'>
                      <div className='row'>
                        <div className='col-md-3 col-auto page-item'>
                          <input className='radio-btn' type='radio' />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <label className='col-md-7 col-form-label form-control-label'>Private Room</label>
                    <div className='col-md-4'>
                      <div className='row'>
                        <div className='col-md-3 col-auto page-item'>
                          <input className='radio-btn' type='radio' />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* ======================== */}
                  <p className='modal-title mb-3'>BEDS AND BATH ROOMS :</p>
                  <div className='form-group row'>
                    <label className='col-md-4 col-form-label form-control-label'>Beds</label>
                    <div className='col-md-6'>
                      <div className='row'>
                        <div className='col-md-3 col-auto page-item'>
                          <a href='#' className='page-link'><i className='fas fa-minus' /></a>
                        </div>
                        <div className='col-md-3 col-auto'>
                          <p className='text-center'>1</p>
                        </div>
                        <div className='col-md-3 col-auto page-item'>
                          <a href='#' className='page-link'><i className='fas fa-plus' /></a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <label className='col-md-4 col-form-label form-control-label'>Bed Room</label>
                    <div className='col-md-6'>
                      <div className='row'>
                        <div className='col-md-3 col-auto page-item'>
                          <a href='#' className='page-link'><i className='fas fa-minus' /></a>
                        </div>
                        <div className='col-md-3 col-auto'>
                          <p className='text-center'>1</p>
                        </div>
                        <div className='col-md-3 col-auto page-item'>
                          <a href='#' className='page-link'><i className='fas fa-plus' /></a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <label className='col-md-4 col-form-label form-control-label'>Bathrooms</label>
                    <div className='col-md-6'>
                      <div className='row'>
                        <div className='col-md-3 col-auto page-item'>
                          <a href='#' className='page-link'><i className='fas fa-minus' /></a>
                        </div>
                        <div className='col-md-3 col-auto'>
                          <p className='text-center'>1</p>
                        </div>
                        <div className='col-md-3 col-auto page-item'>
                          <a href='#' className='page-link'><i className='fas fa-plus' /></a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <div className='col-md-12 text-center mt-2 col-auto'>
                      <button className='btn btn-primary' onClick={this.handleAddProperty} type='submit'>DONE</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
        <Modal
          isOpen={this.state.compareModalIsOpen}
          style={customStyles}
        >
          <div className='container'>
            <div className='row py-2 modal-close' style={{ justifyContent: 'flex-end' }}>
              <a onClick={this.closeModal}><span><i className='fas fa-times' /></span></a>
            </div>
            <div className='col-sm-12 hotel-names-compare pb-2'>
              <p className='pb-0 eu-font'>You can Compare Up To Three Hotels </p>

              {this.state.spPropertyInfo && this.state.spPropertyInfo.length > 0 ? this.state.spPropertyInfo.map((item, i) =>
                <p className='eu-font mb-0 pb-1' key={i}>
                  {item.propertyTitle },
                </p>
              ) : null}
            </div>
            {this.state.spPropertyIDs.length < 3
              ? <div className='col-sm-12 pb-3 add-hotel-to-compare' >
                <button className='circle-class-compare-add mr-2 eu-font' onClick={() => this.setState({ compareModalIsOpen: false })}>
                  <i className='fas fa-plus' style={{ color: 'green' }} /></button><span>{t`lanEUButtonAddHotelsToCompare`}</span>
              </div> : null}
            {this.state.spPropertyIDs.length === 1
            ? null
              : <div className='col-sm-12 text-left pb-5'>
                <button className='btn btn-primary eu-font' onClick={this.handleComparePage}>{t`lanEUButtonCompare`}</button>
              </div>
            }
          </div>

          {/* <div>
            {this.state.spPropertyInfo && this.state.spPropertyInfo.length > 0 ? this.state.spPropertyInfo.map((item, i) =>
              <div>
                {item.propertyTitle}
              </div>
            ) : null}
          </div>
          {this.state.spPropertyIDs.length < 3
            ? <div>
              <button onClick={() => this.setState({ compareModalIsOpen: false })}>{t`lanEUButtonAddHotelsToCompare`}</button>
            </div> : null}
          {this.state.spPropertyIDs.length === 1
            ? null
            : <div>
              <button onClick={this.handleComparePage}>{t`lanEUButtonCompare`}</button>
            </div>
          } */}
        </Modal>
      </div>
    )
  }
}
EUHotelsList.propTypes = {
  google: PropTypes.any
}
export default GoogleApiWrapper({
  apiKey: ('AIzaSyAzRLF3zrXoLF9E0VxCJUQcesO0Z9qqkb0')
})(EUHotelsList)
