/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import APICallManager from '../../../services/callmanager'
import PropTypes from 'prop-types'
import config from '../../../../public/config.json'
// import { t } from 'ttag'
import './Css/Favourites.css'

export default class EUFavouritesEachRowListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      favouritesData: [],
      totalCount: 0,
      activePage: 1,
      searchString: '',
      isFavourite: true,
      favouriteProperties: []
    }
    this.handleFavHotelView = this.handleFavHotelView.bind(this)
    this.handleFavouriteProperty = this.handleFavouriteProperty.bind(this)
    this.handleUnFavouriteProperty = this.handleUnFavouriteProperty.bind(this)
    this.handleBooking = this.handleBooking.bind(this)
  }
  componentWillMount () {
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.preferences) {
      let favouriteProperties = (authObj && authObj.preferences && authObj.preferences.favouriteProperties) ? authObj.preferences.favouriteProperties : []
      this.setState({ authObj: authObj, favouriteProperties: favouriteProperties })
    }
  }

  handleFavHotelView (e) {
    hashHistory.push('/hotels/booknow')
    event.preventDefault()
  }
  handleFavouriteProperty (data) {
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    let authFavs = authObj.preferences.favouriteProperties
    if (authObj && authObj.mobileNumber) {
      let newAuthObj = authObj
      let postJson = {
        customer: authObj.name,
        serviceProviderID: data.spServiceProviderId,
        serviceProvider: data.spServiceProvider,
        spPropertyTitle: data.spPropertyId.propertyTitle,
        spPropertyId: data.spPropertyId._id,
        spLocationId: data.spLocationId,
        contactPerson: data.spLocationObj.contactPerson,
        mobileNumber: data.spLocationObj.mobileNumber,
        alternateMobileNumber: data.spLocationObj.alternateMobileNumber ? data.spLocationObj.alternateMobileNumber : '',
        email: data.spLocationObj.email,
        address: data.spLocationObj.address,
        landmark: data.spLocationObj.landmark,
        area: data.spLocationObj.area,
        areaLocality: data.spLocationObj.areaLocality,
        zip: data.spLocationObj.zip,
        city: data.spLocationObj.city,
        state: data.spLocationObj.state,
        country: data.spLocationObj.country,
        latitude: data.spLocationObj.latitude,
        longitude: data.spLocationObj.longitude
      }
      let _this = this
      let obj = { url: config.baseUrl + config.postEUFavouritePropertyAPI, body: postJson }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj && resObj.data.statusCode === '0000') {
          _this.setState({ isFavourite: true })
          let favouriteProperties = _this.state.favouriteProperties
          favouriteProperties.push(data.spPropertyId._id)
          authFavs.push(data.spPropertyId._id)
          newAuthObj.preferences.favouriteProperties = authFavs
          localStorage.setItem('authObj', JSON.stringify(newAuthObj))
          _this.setState({ isFavourite: true, favouriteProperties: favouriteProperties })
        }
      })
    } else {
      hashHistory.push('/login')
    }
  }
  handleUnFavouriteProperty (data) {
    var newAuthObj = JSON.parse(localStorage.getItem('authObj'))
    let authFavs = newAuthObj.preferences.favouriteProperties
    let favouriteProperties = this.state.favouriteProperties
    var userData = {
      spPropertyId: data.spPropertyId._id,
      spID: data.spServiceProviderId
    }
    let _this = this
    let obj = { url: config.baseUrl + config.putEUUnfavouritePropertyAPI, body: userData }
    APICallManager.putCall(obj, function (resObj) {
      if (resObj && resObj.data.statusCode === '0000') {
        _this.setState({ isFavourite: false })
        let index = favouriteProperties.findIndex(x => x === data.spPropertyId._id)
        favouriteProperties.splice(index, 1)
        let ri = authFavs.findIndex(x => x === data.spPropertyId._id)
        authFavs.splice(ri, 1)
        newAuthObj.preferences.favouriteProperties = authFavs
        localStorage.setItem('authObj', JSON.stringify(newAuthObj))
        _this.setState({ isFavourite: false, favouriteProperties: favouriteProperties })
      }
    })
  }
  handleBooking (data) {
    let favouritesList = {
      url: config.baseUrl + config.getEUFavouritesPropertyInfoDataAPI + data.spPropertyId._id
    }
    APICallManager.getCall(favouritesList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        localStorage.setItem('EUPropertyInfoData', JSON.stringify(resObj.data.statusResult))
        hashHistory.push('/hotels/booknow')
      }
    })
  }
  render () {
    const data = this.props.data
    return (
      <div className='col-lg-4'>
        <div className='room-wrapper'>
          <div className='room-inner'>
            <div className='room'>
              <figure>
                <a className='avatar rounded-circle avatar-sm fav-icon' title='liked' style={{ backgroundColor: '#ffffff' }} >
                  {this.state.isFavourite ? <i className='fas fa-heart' onClick={() => this.handleUnFavouriteProperty(data)} /> : <i className='far fa-heart' onClick={() => this.handleFavouriteProperty(data)} /> }
                </a>
                <a>
                  <img src={(data.spPropertyId.imagePath ? config.baseUrl + data.spPropertyId.imagePath : '')} />
                </a>
                {/* <a className='avatar rounded-circle avatar-sm compare-icon' style={{ backgroundColor: '#ffffff' }}>
                  <img src={require('../../../../assets/compare.png')} title='compare' alt='compare' style={{ width: '20px', height: '20px' }} />
                </a> */}
              </figure>
              <div style={{ cursor:'pointer' }} role='button' onClick={() => this.handleBooking(data)}>
                <div className='caption'>
                  <div className='txt1 hotelName eu-font'>{data.spPropertyId.propertyTitle}</div>
                  {data.spPropertyId && data.spPropertyId.rating
                  ? <div className='txt2'>
                    <div className='small-stars eu-font' style={{ color: 'black', fontSize: 16 }}>
                      {data.spPropertyId.rating}
                      <i className='fa fa-star' style={{ color: 'gold', fontSize: 16 }} />
                    </div>
                  </div> : ''}
                  <div className='txt3 availables row'>
                    <div className='col-sm-6 py-1'>
                      <i className='fa fa-users pr-3' />
                      <span className='eu-font' >{data.spPropertyId.propertyCapacity}</span>
                    </div>
                    <div className='col-sm-6 py-1' >
                      <div className='avatar avatar-xs pr-3'>
                        <img src={require('../../../../assets/available/doublebed.png')} />
                      </div>
                      <span className='eu-font'>{data.spPropertyId.doubleBedsCount}</span>
                    </div>
                    <div className='col-sm-6 py-1' >
                      <i className='fa fa-bath pr-3' />
                      <span className='eu-font'>{data.spPropertyId.privateBathRooms}</span>
                    </div>
                    <div className='col-sm-6 py-1' >
                      <i className='fa fa-bed pr-3' />
                      <span className='eu-font'>{data.spPropertyId.singleBedsCount}</span>
                    </div>
                  </div>
                  <div className='txt4'>
                    <a className='eu-font'>VIEW DETAIL</a>
                  </div>
                </div>
                <div className='select-txt'>
                  <span className='eu-font'>SELECT THIS ROOM<i className='fa fa-angle-right' aria-hidden='true' /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

EUFavouritesEachRowListComponent.propTypes = {
  data: PropTypes.any
}
