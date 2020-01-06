/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import moment from 'moment'
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
import { t } from 'ttag'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

import Pagination from 'react-js-pagination'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import ADHotelsMapView from './ADHotelsMapView'
import ADHotelsListView from './ADHotelsListView'
import ADHotelsEachRowList from './ADHotelsEachRowList'
import ADHotelsListFilters from './ADHotelsListFilters'
import './Css/ADDropdownStyles.css'
import './Css/ADHotelsList.css'
import './Css/ADHotelsListResponsive.css'
import './Css/modal.css'

var ip = require('ip')

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
class ADHotelsListComponent extends React.Component {
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
      compareModalIsOpen: false,
      hostsBy: false,
      day: '',
      nearestLoc: true,
      nearestSPPropertyList: [],
      nearestTotalCount: 0,
      nearestActivePage: 1,
      postJson: {}

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
    this.handleHostsBy = this.handleHostsBy.bind(this)
    this.setDay = this.setDay.bind(this)
    this.handleNearestAreas = this.handleNearestAreas.bind(this)
  }
  componentWillMount () {
    window.addEventListener('scroll', this.handleScroll)
    // let authObj = JSON.parse(localStorage.getItem('authObj'))
    let homePageData = JSON.parse(localStorage.getItem('homePageData'))
    let userData = JSON.parse(localStorage.getItem('userData'))
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
    // if (authObj && authObj.preferences) {
    //   let favouriteProperties = (authObj && authObj.preferences && authObj.preferences.favouriteProperties) ? authObj.preferences.favouriteProperties : []
    //   this.setState({ authObj: authObj, favouriteProperties: favouriteProperties })
    // }
    if (userData && userData.preferences) {
      let favouriteProperties = (userData && userData.preferences && userData.preferences.favouriteProperties) ? userData.preferences.favouriteProperties : []
      this.setState({ userData: userData, favouriteProperties: favouriteProperties })
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
      // navigator.geolocation.getCurrentPosition(
      //   (position) => {
      //     this.setState({
      //       latitude: position.coords.latitude,
      //       longitude: position.coords.longitude,
      //       error: null
      //     })
      //     this.getAddressComponents(position.coords.latitude, position.coords.longitude)
      //   },
      //   (error) => {
      //     this.setState({ error: error.message, dataType: 'default' })
      //     this.handleDefaultData()
      //   },
      //   { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
      // )
    }
    localStorage.setItem('EUBookingType', JSON.stringify('Days'))
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
    var isArea = false
    fetch(config.googleGeoLocationLatLng + lat + ',' + long + '&key=' + config.googleMapsAPIKey)
      .then((response) => response.json())
      .then((responseJson) => {
        responseJson.results[0].address_components.forEach(data => {
          if (data.types.indexOf('sublocality_level_1') !== -1) {
            area = data.long_name
            isArea = true
            this.setState({ area: data.long_name })
          } else if (!isArea && data.types.indexOf('locality') !== -1) {
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
      'state': state,
      'hostsBy': this.state.hostsBy ? 'Hours' : 'Days'
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
    let locationSearchObj = localStorage.getItem('locationSearchObj') ? JSON.parse(localStorage.getItem('locationSearchObj')) : {}
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
        'state': this.state.state,
        'hostsBy': this.state.hostsBy ? 'Hours' : 'Days'
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
    // NearBy Api
    let nearByObj = {
      activePage: 1,
      area: (this.state.locationSearchObj && this.state.locationSearchObj.area) ? this.state.locationSearchObj.area : '',
      hostsBy: this.state.hostsBy ? 'Hours' : 'Days',
      filterBy: filterBy,
      noOfPersons: this.state.guestAdultValue,
      noOfRooms: this.state.guestRooms
    }
    if (!nearByObj && !nearByObj.area) {
      let nearByPropertiesList = { url: config.baseUrl + config.postEUHomeScreenNearestAreaServicesGetAPI, body: nearByObj }
      APICallManager.postCall(nearByPropertiesList, function (resObj) {
        if (resObj && resObj.data && resObj.data.statusCode === '0000') {
          _this.setState({ nearestSPPropertyList: resObj.data.statusResult.homedata, nearestTotalCount: resObj.data.statusResult.totalDocs })
        } else {
          _this.setState({ nearestSPPropertyList: [], nearestTotalCount: 0 })
        }
      })
    }
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
      'state': this.state.state,
      'hostsBy': this.state.hostsBy ? 'Hours' : 'Days'
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
    hashHistory.push('/admin/eu/booking')
    event.preventDefault()
  }
  handleListView () {
    this.setState({
      isBothViewShow: false,
      isListViewShow: true,
      isMapViewShow: false
    })
  }
  handleMapView () {
    this.setState({
      isBothViewShow: false,
      isListViewShow: false,
      isMapViewShow: true
    })
  }
  handleHotelList () {
    this.setState({
      isBothViewShow: true,
      isListViewShow: false,
      isMapViewShow: false
    })
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
    return marker
  }
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
        ToastsStore.error(t`lanEULabelErrorCompareHostsLimit`)
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
    hashHistory.push('/admin/eu/properties/compare')
  }
  onMapClicked () {
    this.setState({ mapHotelData: false, selectedHotelData: {} })
  }
  handleHostsBy () {
    this.setState({ hostsBy: !this.state.hostsBy })
    let EUBookingType = !this.state.hostsBy === true ? 'Hours' : 'Days'
    localStorage.setItem('EUBookingType', JSON.stringify(EUBookingType))
    let postJson = {
      'dataType': 'byLocation',
      'noOfPersons': this.state.guestAdultValue,
      'noOfRooms': this.state.guestRooms,
      'sortBy': this.state.sortBy,
      'filterBy': this.state.filterBy,
      'activePage': this.state.pageNumber,
      'area': this.state.area,
      'city': this.state.city,
      'state': this.state.state,
      'hostsBy': !this.state.hostsBy === true ? 'Hours' : 'Days'
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
  setDay (day) {
    this.setState({ day: day })
  }
  handleNearestAreas () {
    this.setState({ nearestLoc: false })
    let postJson = {
      activePage: 1,
      area: (this.state.locationSearchObj && this.state.locationSearchObj.area) ? this.state.locationSearchObj.area : '',
      hostsBy: this.state.hostsBy ? 'Hours' : 'Days',
      filterBy: this.state.filterBy,
      noOfPersons: this.state.guestAdultValue,
      noOfRooms: this.state.guestRooms
    }
    let propertiesList = { url: config.baseUrl + config.postEUHomeScreenNearestAreaServicesGetAPI, body: postJson }
    let _this = this
    APICallManager.postCall(propertiesList, function (resObj) {
      if (resObj && resObj.data.statusCode === '0000') {
        _this.setState({ nearestSPPropertyList: resObj.data.statusResult.homedata, nearestTotalCount: resObj.data.statusResult.totalDocs })
      } else {
        _this.setState({ nearestSPPropertyList: [], nearestTotalCount: 0 })
      }
    })
  }
  handleBack = () => {
    this.setState({ nearestLoc: true })
  }
  handleNearestPageChange = (pageNumber) => {
    this.setState({ nearestActivePage: pageNumber })
    let postJson = {
      activePage: pageNumber,
      area: (this.state.locationSearchObj && this.state.locationSearchObj.area) ? this.state.locationSearchObj.area : '',
      hostsBy: this.state.hostsBy ? 'Hours' : 'Days',
      filterBy: this.state.filterBy,
      noOfPersons: this.state.guestAdultValue,
      noOfRooms: this.state.guestRooms
    }
    let propertiesList = { url: config.baseUrl + config.postEUHomeScreenNearestAreaServicesGetAPI, body: postJson }
    let _this = this
    APICallManager.postCall(propertiesList, function (resObj) {
      if (resObj && resObj.data.statusCode === '0000') {
        _this.setState({ nearestSPPropertyList: resObj.data.statusResult.homedata, nearestTotalCount: resObj.data.statusResult.totalDocs })
      } else {
        _this.setState({ nearestSPPropertyList: [], nearestTotalCount: 0 })
      }
    })
  }
  render () {
    // const mapOptions = {
    //   zoom: 5,
    //   center: { lat: this.state.latitude, lng: this.state.longitude }
    // }
    return (
      <div id='hotel-list-page-1'>
        <div id='page-wrapper'>
          {/* fiter section start */}
          <section className='filter-section bg-white'>
            <ADHotelsListFilters location={this.state.location} getAddressComponents={this.getAddressComponents} locationSearchObj={this.state.locationSearchObj}
              handleDataByListFilters={this.handleDataByListFilters} dataType={this.state.dataType} setDay={this.setDay} />
          </section>
          {/* ====================================== fiter section end ====================================== */}
          {/* ====================== main body start ====================== */}
          <section role='main' className='inner cover hotels-page-hotel-list'>
            <div className='album'>
              {this.state.isBothViewShow
                ? <div className='container-fluid bg-white'>
                  {!this.state.nearestLoc
                    ? <div className='row'>
                      <div className='col-lg-3 col-xs-12 ui half-layout'>
                        <div className='map-list'>
                          <Map google={this.props.google} zoom={12} initialCenter={{ lat: this.state.latitude, lng: this.state.longitude }} onClick={this.onMapClicked} >
                            {this.state.nearestSPPropertyList.length > 0
                              ? this.state.nearestSPPropertyList.map((data, i) =>
                                <Marker
                                  className='list-map'
                                  title={data.propertyTitle}
                                  name={'SOMA'}
                                  position={{ lat: data.spLocationObj.latitude, lng: data.spLocationObj.longitude }}
                                  onClick={() => this.onMarkerClick(data)} key={i} />
                              ) : null}
                          </Map>
                        </div>
                      </div>
                      <div className='col-lg-9 col-xs-12 both-list m-auto pl-4 section-list' >
                        <div className='row bg-light py-4'>
                          {this.state.nearestSPPropertyList && this.state.nearestSPPropertyList.length > 0
                          ? this.state.nearestSPPropertyList.map((item, i) =>
                            <ADHotelsEachRowList data={item} key={i} SPPropertyList={this.state.nearestSPPropertyList} authObj={this.state.authObj}
                              favouriteProperties={this.state.favouriteProperties} handleFavouriteProperty={this.handleFavouriteProperty} handleCompare={this.handleCompare} spPropertyIDs={this.state.spPropertyIDs}
                              day={this.state.day} />
                          ) : <div className='container'>
                            <div className='row justify-content-center'>
                              <div className='col-sm-12 text-center my-8' >
                                <div className='no-data'><p>{t`lanCommonLabelNoResultsFound`}</p></div>
                              </div>
                            </div>
                          </div>
                          } {/* container no data end */}
                          {this.state.SPPropertyList && this.state.SPPropertyList.length > 0
                          ? <div className='container text-center'>
                            <div className='row bg-grey'>
                              <div className=' col-sm-12 text-center my-2'>
                                <Pagination
                                  activePage={this.state.nearestActivePage}
                                  itemsCountPerPage={10}
                                  totalItemsCount={this.state.nearestTotalCount}
                                  pageRangeDisplayed={5}
                                  onChange={this.handleNearestPageChange}
                                />
                              </div>
                            </div>
                          </div>
                          : null
                        }
                        </div> {/* col-lg-9 row end */}
                      </div>
                    </div>
                    : <div className='row'>
                      {/* =================== view filter, map column start =========================== */}
                      <div className='col-lg-3 col-xs-12 ui half-layout'>
                        <div className='switch-view-controller'>
                          <a onClick={this.handleListView} className='item'>
                            <i className='fas fa-th' />
                            <span>{t`lanEUButtonList`}</span>
                          </a>
                          <a onClick={this.handleHotelList} id='both-trigger' className='item active hidden-mobile'>
                            <i className='far fa-object-group' />
                            <span>{t`lanEUButtonBoth`}</span>
                          </a>
                          <a onClick={this.handleMapView} id='only-map-trigger' className='item'>
                            <i className='fas fa-map-marker-alt' />
                            <span>{t`lanEUButtonMap`}</span>
                          </a>
                          <a href='' className='modal-trigger item hidden-desktop hidden-large-desktop' data-trigger-for='menu02'>
                            <i className='icon icon-filter' />
                            <span>{t`lanEUButtonFilters`}</span>
                          </a>
                        </div>
                        <div className='map-list'>
                          <Map google={this.props.google} zoom={12} initialCenter={{ lat: this.state.latitude, lng: this.state.longitude }} onClick={this.onMapClicked} >
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
                                  <h5 className='h2 card-title text-white mb-0'>{this.state.selectedHotelData.propertyTitle}</h5>
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
                                  {this.state.day === 'Weekend'
                                  ? <div className='room-price'>
                                    <div className='txt1'>₹ <span>{this.state.selectedHotelData.pricing.weekEndTotalPrice}</span></div>
                                    {this.state.selectedHotelData.pricing.weekEndBasePriceDiscount !== '0'
                                      ? <div>
                                        <div className='txt1'><del>{this.state.selectedHotelData.pricing.weekEndWdTotalPrice}</del></div>
                                        <div className='txt2'>
                                          <div>{`${this.state.selectedHotelData.pricing.weekEndBasePriceDiscount} %`}</div>
                                        </div>
                                      </div>
                                      : ''}
                                  </div>
                                  : <div className='room-price'>
                                    <div className='txt1'>₹ <span>{this.state.selectedHotelData.pricing.totalPrice}</span></div>
                                    {this.state.selectedHotelData.pricing.basePriceDiscount !== '0'
                                    ? <div>
                                      <div className='txt1'><del>{this.state.selectedHotelData.pricing.wdTotalPrice}</del></div>
                                      <div className='txt2'>
                                        {`${this.state.selectedHotelData.pricing.basePriceDiscount} %`}
                                      </div>
                                    </div>
                                    : ''}
                                  </div>}
                                  {/* <p className='card-text text-sm text-white mb-1 font-weight-bold'>{t`lanEULabelPrice`}: ₹ {this.state.selectedHotelData.pricing.basePrice} /{t`lanEULabelDay`} </p> */}
                                  <button className='btn btn-sm btn-success' onClick={() => this.handleHotelListItemView(this.state.selectedHotelData)}>{t`lanEUButtonBookNow`} </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        : ''}
                      {/* =================== view filter, map column start =========================== */}
                      {/* =================== listView column start =========================== */}
                      <div className='col-lg-9 col-xs-12 both-list m-auto pl-4 section-list' >
                        {/* <div className='row justify-content-center bg-light py-1'>
                          <input onClick={this.handleHostsBy} type='checkbox' className='hourly-checkbox m-2' />
                          <p className='pt-2'>{t`lanEUTitleHourlyHotels`}</p>
                        </div> */}
                        <div className='row bg-light pt-2 pb-4'>
                          <div className='col-sm-12 text-center mb-2'>
                            {!this.state.hostsBy
                            ? <div className='adHourly-div'>
                              <a onClick={this.handleHostsBy}>
                                <p className='Adp-hourly-book-title'>{t`lanEULabelGoWithHourlyBooking`}</p>
                              </a>
                            </div>
                            : <div className='adHourly-div'>
                              <a onClick={this.handleHostsBy}>
                                <p className='Adp-hourly-book-title'>{t`lanEULabelGoWithDailyBooking`}</p>
                              </a>
                            </div>
                            }
                          </div>
                          {this.state.SPPropertyList.length > 0
                          ? this.state.SPPropertyList.map((item, i) =>
                            <ADHotelsEachRowList data={item} key={i} SPPropertyList={this.state.SPPropertyList} authObj={this.state.authObj}
                              favouriteProperties={this.state.favouriteProperties} handleFavouriteProperty={this.handleFavouriteProperty} handleCompare={this.handleCompare} spPropertyIDs={this.state.spPropertyIDs}
                              day={this.state.day} />
                          ) : <div className='container'>
                            <div className='row justify-content-center'>
                              <div className='col-sm-12 text-center my-8' >
                                <div className='no-data'><p>{t`lanCommonLabelNoResultsFound`}</p></div>
                              </div>
                            </div>
                          </div>
                          } {/* container no data end */}
                          {this.state.nearestLoc && ((this.state.totalCount > 10 && this.state.activePage >= 2) || this.state.totalCount <= 10)
                          ? <div className='container text-center'>
                            <div className='row bg-grey'>
                              <div className=' col-sm-12 text-center my-2 nearestLocation_1'>
                                <a onClick={this.handleNearestAreas}>
                                  <div className='row justify-content-center'>
                                    <div className='nearestHotelsDiv'>
                                      <div className='alert alert-primary' role='alert'>
                                        Search For Nearby Hotels Around {(this.state.locationSearchObj && this.state.locationSearchObj.area) ? this.state.locationSearchObj.area : ''}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                          : <div className='container text-center'>
                            <div className='row bg-grey'>
                              <div className=' col-sm-12 text-center my-2'>
                                <a onClick={this.handleBack}>
                                  <div className='row justify-content-center'>
                                    <div className='nearestHotelsDiv'>
                                      <div className='alert alert-warning' role='button'>
                                        {this.state.location}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </div>
                          }
                          {this.state.SPPropertyList && this.state.SPPropertyList.length > 0
                          ? <div className='container text-center'>
                            <div className='row bg-grey'>
                              <div className=' col-sm-12 text-center my-2'>
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
                        </div> {/* col-lg-9 row end */}
                      </div> {/* col-lg-9  col end */}
                    </div>
                  }
                </div>
                : this.state.isListViewShow ? <ADHotelsListView handleFavouriteProperty={this.handleFavouriteProperty}
                  handleListView={this.handleListView} handleMapView={this.handleMapView} handleHotelList={this.handleHotelList} SPPropertyList={this.state.SPPropertyList} authObj={this.state.authObj} />
                : this.state.isMapViewShow ? <ADHotelsMapView handleListView={this.handleListView} handleMapView={this.handleMapView}
                  handleHotelList={this.handleHotelList} latitude={this.state.latitude} longitude={this.state.longitude}
                  area={this.state.area} city={this.state.city} state={this.state.state} guestAdultValue={this.state.guestAdultValue}
                  guestRooms={this.state.guestRooms} sortBy={this.state.sortBy} filterBy={this.state.filterBy} /> : ''}
            </div>
          </section>
          {/* <FooterComponent /> */}
        </div>
        <div>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            ariaHideApp={false}
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
                  <p className='modal-title mb-3'>{t`lanEUTitleRoomType`}:</p>
                  <div className='form-group row'>
                    <label className='col-md-7 col-form-label form-control-label'>{t`lanEULabelSharing`}</label>
                    <div className='col-md-4'>
                      <div className='row'>
                        <div className='col-md-3 col-auto page-item'>
                          <input className='radio-btn' type='radio' />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <label className='col-md-7 col-form-label form-control-label'>{t`lanEULabelIndividualHouse`}</label>
                    <div className='col-md-4'>
                      <div className='row'>
                        <div className='col-md-3 col-auto page-item'>
                          <input className='radio-btn' type='radio' />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <label className='col-md-7 col-form-label form-control-label'>{t`lanEULabelPrivateRoom`}</label>
                    <div className='col-md-4'>
                      <div className='row'>
                        <div className='col-md-3 col-auto page-item'>
                          <input className='radio-btn' type='radio' />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* ======================== */}
                  <p className='modal-title mb-3'>{t`lanEUTitleBedsAndBathRooms`}:</p>
                  <div className='form-group row'>
                    <label className='col-md-4 col-form-label form-control-label'>{t`lanEULabelBeds`}</label>
                    <div className='col-md-6'>
                      <div className='row'>
                        <div className='col-md-3 col-auto page-item'>
                          <a className='page-link'><i className='fas fa-minus' /></a>
                        </div>
                        <div className='col-md-3 col-auto'>
                          <p className='text-center'>1</p>
                        </div>
                        <div className='col-md-3 col-auto page-item'>
                          <a className='page-link'><i className='fas fa-plus' /></a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <label className='col-md-4 col-form-label form-control-label'>{t`lanEULabelBedRoom`}</label>
                    <div className='col-md-6'>
                      <div className='row'>
                        <div className='col-md-3 col-auto page-item'>
                          <a className='page-link'><i className='fas fa-minus' /></a>
                        </div>
                        <div className='col-md-3 col-auto'>
                          <p className='text-center'>1</p>
                        </div>
                        <div className='col-md-3 col-auto page-item'>
                          <a className='page-link'><i className='fas fa-plus' /></a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <label className='col-md-4 col-form-label form-control-label'>{t`lanEULabelBathrooms`}</label>
                    <div className='col-md-6'>
                      <div className='row'>
                        <div className='col-md-3 col-auto page-item'>
                          <a className='page-link'><i className='fas fa-minus' /></a>
                        </div>
                        <div className='col-md-3 col-auto'>
                          <p className='text-center'>1</p>
                        </div>
                        <div className='col-md-3 col-auto page-item'>
                          <a className='page-link'><i className='fas fa-plus' /></a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <div className='col-md-12 text-center mt-2 col-auto'>
                      <button className='btn btn-primary' onClick={this.handleAddProperty} type='submit'>{t`lanEUButtonDone`}</button>
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
          ariaHideApp={false}
        >
          <div className='container'>
            <div className='row py-2 modal-close' style={{ justifyContent: 'flex-end' }}>
              <a onClick={this.closeModal}><span><i className='fas fa-times' /></span></a>
            </div>
            <div className='col-sm-12 hotel-names-compare pb-2'>
              <p className='pb-0 eu-font'>{t`lanEULabelYouCanCompareUpToThreeHotels`}</p>

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
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}
ADHotelsListComponent.propTypes = {
  google: PropTypes.any
}
export default GoogleApiWrapper({
  apiKey: (config.googleMapsAPIKey)
})(ADHotelsListComponent)
