  /**
   * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
   * Unauthorized copying of this file, via any medium is strictly prohibited
   * Proprietary and confidential
   * Written by Hari <hari@ngstek.com>, Mar 2019
   */

  import React from 'react'
  import { hashHistory } from 'react-router'
  import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
  import PropTypes from 'prop-types'
  import APICallManager from '../../../services/callmanager'
  import config from '../../../../public/config.json'
  import { t } from 'ttag'
  import './Css/EUHotelsList.css'
  // import '../../../css/style.css'

  class HotelsMapView extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        SPPropertyList: (this.props.SPPropertyList && this.props.SPPropertyList.length) ? this.props.SPPropertyList : [],
        latitude: this.props.latitude ? this.props.latitude : 17.4301,
        longitude: this.props.longitude ? this.props.longitude : 78.5416,
        area: this.props.area,
        city: this.props.city,
        state: this.props.state,
        markerArray: [
          {
            lat: 17.426400,
            lng: 78.540286
          },
          {
            lat: 17.428048,
            lng: 78.542475
          }

        ],
        mapHotelData: false
      }
      this.handleHotelListItemView = this.handleHotelListItemView.bind(this)
      this.handleListView = this.handleListView.bind(this)
      this.handleMapView = this.handleMapView.bind(this)
      this.handleHotelList = this.handleHotelList.bind(this)
      this.onMapClicked = this.onMapClicked.bind(this)
    }
    componentWillMount () {
      // alert('area:' + this.props.area)
      let EUBookingType = JSON.parse(localStorage.getItem('EUBookingType'))
      let postJson = {
        'area': this.props.area,
        'city': this.props.city,
        'state': this.props.state,
        'noOfPersons': this.props.guestAdultValue,
        'noOfRooms': this.props.guestRooms,
        'sortBy': this.props.sortBy,
        'filterBy': this.props.filterBy,
        'hostsBy': EUBookingType
      }
      let propertiesList = { url: config.baseUrl + config.postMapScreenPropertiesDataGetAPI, body: postJson }
      let _this = this
      APICallManager.postCall(propertiesList, function (resObj) {
        if (resObj && resObj.data.statusCode === '0000') {
          _this.setState({ SPPropertyList: resObj.data.statusResult.homedata, totalCount: resObj.data.statusResult.totalDocs })
        } else {
          _this.setState({ SPPropertyList: [], totalCount: 0 })
        }
      })
    }
    componentWillReceiveProps (newProps) {
      let EUBookingType = JSON.parse(localStorage.getItem('EUBookingType'))
      this.setState({
        area: newProps.area,
        city: newProps.city,
        state: newProps.state,
        latitude: newProps.latitude,
        longitude: newProps.longitude
      })
      let postJson = {
        'area': newProps.area,
        'city': newProps.city,
        'state': newProps.state,
        'noOfPersons': newProps.guestAdultValue,
        'noOfRooms': newProps.guestRooms,
        'sortBy': newProps.sortBy,
        'filterBy': newProps.filterBy,
        'hostsBy': EUBookingType
      }
      let propertiesList = { url: config.baseUrl + config.postMapScreenPropertiesDataGetAPI, body: postJson }
      let _this = this
      APICallManager.postCall(propertiesList, function (resObj) {
        if (resObj && resObj.data.statusCode === '0000') {
          _this.setState({ SPPropertyList: resObj.data.statusResult.homedata, totalCount: resObj.data.statusResult.totalDocs })
        } else {
          _this.setState({ SPPropertyList: [], totalCount: 0 })
        }
      })
    }
    // handleHotelListItemView () {
    //   hashHistory.push('/hotels/list-item')
    //   event.preventDefault()
    // }
    handleListView () {
      hashHistory.push('/hotels/listView')
      event.preventDefault()
    }
    handleMapView () {
      hashHistory.push('/hotels/mapView')
      event.preventDefault()
    }
    handleHotelList () {
      hashHistory.push('/hotels')
      event.preventDefault()
    }
    onMarkerClick (data) {
      this.setState({ mapHotelData: true, selectedHotelData: data })
    }
    handleHotelListItemView (event) {
      localStorage.setItem('EUPropertyInfoData', JSON.stringify(this.state.selectedHotelData))
      hashHistory.push('/hotels/booknow')
      event.preventDefault()
    }
    onMapClicked () {
      this.setState({ mapHotelData: false, selectedHotelData: {} })
    }
    render () {
      return (
        <div id='page-wrapper'>
          <main role='main' className='inner cover'>
            {/* =================== filter section =========================== */}
            <div className='album map-view-hotels'>
              <div className='container-fluid'>
                <div className='row'>
                  <div className='col-lg-12 col-xs-12 col-12 ui half-layout'>
                    <div className='overlay-div-list-type'>{/** */}</div>
                    <div className='switch-view-controller'>
                      <a onClick={this.props.handleListView} className='item'>
                        <i className='fas fa-th' />
                        <span>{t`lanEUButtonList`}</span>
                      </a>
                      <a onClick={this.props.handleHotelList} id='both-trigger' className='item active hidden-mobile'>
                        <i className='far fa-object-group' />
                        <span>{t`lanEUButtonBoth`}</span>
                      </a>

                      <a onClick={this.props.handleMapView} id='only-map-trigger' className='item'>
                        <i className='fas fa-map-marker-alt' />
                        <span>{t`lanEUButtonMap`}</span>
                      </a>

                      {/* <a className='modal-trigger item hidden-desktop hidden-large-desktop'
                        data-trigger-for='menu02'>
                        <i className='icon icon-filter' />
                        <span>Filters</span>
                      </a> */}
                    </div>
                    <div className='container-fluid'>
                      <div className='row'>
                        <div className='col-lg-12 col-sm-12 col-xs-12 col-12 pt-3' id='hotels-map-view'>
                          <div className='map-wrapper'>
                            <div id='map'>
                              <Map google={this.props.google} zoom={14} initialCenter={{ lat: this.state.latitude, lng: this.state.longitude }} onClick={this.onMapClicked} >
                                {(this.state.SPPropertyList && this.state.SPPropertyList.length > 0)
                                ? this.state.SPPropertyList.map((data, i) =>
                                  <Marker
                                    style={{ position: 'relative' }}
                                    title={data.propertyTitle}
                                    name={'SOMA'}
                                    position={{ lat: data.spLocationObj.latitude, lng: data.spLocationObj.longitude }}
                                    onClick={() => this.onMarkerClick(data)}
                                    key={i} />
                                  ) : null }
                              </Map>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* hotel data in map starts  */}
                    {this.state.mapHotelData
                    ? <div className='overlay-max-map-data'>
                      <div className='hotel-data-div'>
                        <div className='card bg-dark text-white border-0'>
                          <img className='card-img' src={(this.state.selectedHotelData.propertyId && this.state.selectedHotelData.propertyId.imagePath)
                             ? config.baseUrl + this.state.selectedHotelData.propertyId.imagePath : require('../../../../assets/property_big_05.jpg')} alt='Card image' />
                          <div className='card-img-overlay d-flex align-items-center'>
                            <div className='card-overlay-inner'>
                              <h5 className='h2 card-title text-white mb-0 '>{this.state.selectedHotelData.propertyTitle}</h5>
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
                                </div> : '' }
                              {/* {this.state.selectedHotelData.pricing.basePrice} */}
                              <div className='row'>
                                <div className='col-md-3 pr-0'>
                                  <p className='text-price'>{t`lanEULabelPrice`}:</p>
                                </div>
                                <div className='col-md-9'>
                                  {this.state.day === 'Weekend'
                                    ? <div className='room-price'>
                                      <div className='row'>
                                        <div className='col-md-4 pr-0 pl-0'>
                                          <div className='txt1'>₹ <span>{this.state.selectedHotelData.pricing.weekEndTotalPrice}</span></div>
                                        </div>
                                        <div className='col-md-8'>
                                          {this.state.selectedHotelData.pricing.weekEndBasePriceDiscount !== '0'
                                            ? <div className='row'>
                                              <div className='col-md-7 pr-0 pl-0'>
                                                <div className='txt3'><del>{this.state.selectedHotelData.pricing.weekEndWdTotalPrice}</del></div>
                                              </div>
                                              <div className='col-md-3 pl-0 pr-0'>
                                                <div className='txt2'>
                                                  <div>{`${this.state.selectedHotelData.pricing.weekEndBasePriceDiscount} %`}</div>
                                                </div>
                                              </div>
                                            </div>
                                            : ''}
                                        </div>
                                      </div>
                                    </div>
                                    : <div>
                                      <div className='room-price'>
                                        <div className='row'>
                                          <div className='col-md-4 pr-0 pl-0'>
                                            <div className='txt1'>₹ <span>{this.state.selectedHotelData.pricing.totalPrice}</span></div>
                                          </div>
                                          <div className='col-md-8'>
                                            {this.state.selectedHotelData.pricing.basePriceDiscount !== '0'
                                            ? <div className='row'>
                                              <div className='col-md-7 pr-0 pl-0'>
                                                <div className='txt1'><del>₹ {this.state.selectedHotelData.pricing.wdTotalPrice}</del></div>
                                              </div>
                                              <div className='col-md-3 pl-0 pr-0'>
                                                <div className='txt2'>
                                                  {`${this.state.selectedHotelData.pricing.basePriceDiscount} %`}
                                                </div>
                                              </div>
                                            </div>
                                            : ''}
                                          </div>
                                        </div>
                                      </div>
                                    </div>}
                                </div>
                              </div>
                              <button className='btn btn-sm btn-success' onClick={this.handleHotelListItemView}>{t`lanEUButtonBookNow`}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  : ''}
                  </div>
                </div> {/* row end */}
              </div> {/* container end */}
            </div>
          </main>
        </div>
      )
    }
  }

  HotelsMapView.propTypes = {
    SPPropertyList: PropTypes.any,
    latitude: PropTypes.any,
    longitude: PropTypes.any,
    handleListView: PropTypes.any,
    handleHotelList: PropTypes.any,
    handleMapView: PropTypes.any,
    area: PropTypes.any,
    city: PropTypes.any,
    state: PropTypes.any,
    guestAdultValue: PropTypes.any,
    guestRooms: PropTypes.any,
    sortBy: PropTypes.any,
    google: PropTypes.any,
    filterBy: PropTypes.any
  }
  export default GoogleApiWrapper({
    apiKey: (config.googleMapsAPIKey)
  })(HotelsMapView)
