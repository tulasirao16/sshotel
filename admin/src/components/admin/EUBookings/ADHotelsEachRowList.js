/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
// import APICallManager from '../../../services/callmanager'
import PropTypes from 'prop-types'
import config from '../../../../public/config.json'
import { t } from 'ttag'
import './Css/ADHotelsList.css'
import StarRatingComponent from 'react-star-rating-component'

const Amenities = require('../../../../assets/amenities/amenities.json')

export default class ADHotelsEachRowList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      authObj: {},
      userData: JSON.parse(localStorage.getItem('userData')),
      favouritesData: [],
      totalCount: 0,
      activePage: 1,
      searchString: '',
      isFavourite: true,
      favouriteProperties: [],
      SPPropertyList: props.SPPropertyList ? props.SPPropertyList : [],
      // spPropertyIDs: []
      spPropertyIDs: this.props.spPropertyIDs,
      submitDisabled: false,
      day: props.day ? props.day : ''
    }
    // this.handleFavouriteProperty = this.handleFavouriteProperty.bind(this)
    // this.handleUnFavouriteProperty = this.handleUnFavouriteProperty.bind(this)
    this.handleHotelListItemView = this.handleHotelListItemView.bind(this)
  }
  componentWillMount () {
    this.setState({ authObj: this.props.authObj, favouriteProperties: this.props.favouriteProperties })
  }
  async componentWillReceiveProps (newProps) {
    this.setState({ authObj: newProps.authObj, favouriteProperties: newProps.favouriteProperties })
  }
  // handleFavouriteProperty = (data) => {
  //   if (!this.state.userData.name || !this.state.userData.mobileNumber) {
  //     alert('Please fill your profile information')
  //     hashHistory.push('/profile')
  //   } else if (this.state.userData && this.state.userData.mobileNumber) {
  //     let newAuthObj = this.state.userData
  //     let postJson = {
  //       customer: this.state.userData.name,
  //       serviceProviderID: data.spServiceProviderId,
  //       serviceProvider: data.spServiceProvider,
  //       spPropertyTitle: data.propertyId.propertyTitle,
  //       spPropertyId: data.propertyId._id,
  //       spPropertyInfoId: data._id,
  //       spLocationId: data.spLocationId,
  //       contactPerson: data.spLocationObj.contactPerson,
  //       mobileNumber: data.spLocationObj.mobileNumber,
  //       alternateMobileNumber: data.spLocationObj.alternateMobileNumber ? data.spLocationObj.alternateMobileNumber : '',
  //       email: data.spLocationObj.email,
  //       address: data.spLocationObj.address,
  //       landmark: data.spLocationObj.landmark,
  //       area: data.spLocationObj.area,
  //       areaLocality: data.spLocationObj.areaLocality,
  //       zip: data.spLocationObj.zip,
  //       city: data.spLocationObj.city,
  //       state: data.spLocationObj.state,
  //       country: data.spLocationObj.country,
  //       latitude: data.spLocationObj.latitude,
  //       longitude: data.spLocationObj.longitude
  //     }
  //     let _this = this
  //     _this.setState({ submitDisabled: true })
  //     let obj = { url: config.baseUrl + config.postADEUFavouritePropertyAPI + this.state.userData._id, body: postJson }
  //     APICallManager.postCall(obj, function (resObj) {
  //       _this.setState({ submitDisabled: false })
  //       if (resObj && resObj.data.statusCode === '0000') {
  //         let favouriteProperties = _this.state.favouriteProperties
  //         favouriteProperties.push(data.propertyId._id)
  //         newAuthObj.preferences.favouriteProperties = favouriteProperties
  //         localStorage.setItem('userData', JSON.stringify(newAuthObj))
  //         _this.props.handleFavouriteProperty(favouriteProperties, newAuthObj)
  //       }
  //     })
  //   } else {
  //     hashHistory.push('/login')
  //   }
  // }
  // handleUnFavouriteProperty (data) {
  //   var newUserObj = this.state.userData
  //   let favouriteProperties = this.state.favouriteProperties
  //   var userData = {
  //     spPropertyId: data.propertyId._id,
  //     spID: data.spServiceProviderId
  //   }
  //   let _this = this
  //   _this.setState({ submitDisabled: true })
  //   let obj = { url: config.baseUrl + config.putADEUUnfavouritePropertyAPI + data.id, body: userData }
  //   APICallManager.putCall(obj, function (resObj) {
  //     if (resObj && resObj.data.statusCode === '0000') {
  //       _this.setState({ isFavourite: false })
  //       let index = favouriteProperties.findIndex(x => x === data.propertyId._id)
  //       favouriteProperties.splice(index, 1)
  //       newUserObj.preferences.favouriteProperties = favouriteProperties
  //       localStorage.setItem('userData', JSON.stringify(newUserObj))
  //       _this.props.handleFavouriteProperty(favouriteProperties, newUserObj)
  //     } else {
  //       alert('not UnFavourite failed')
  //     }
  //   })
  // }
  handleHotelListItemView (data) {
    localStorage.setItem('EUPropertyInfoData', JSON.stringify(data))
    hashHistory.push('/admin/eu/booking')
    event.preventDefault()
  }
  render () {
    const data = this.props.data
    const day = this.props.day ? this.props.day : ''
    // let favourite = ''
    // if (this.state.favouriteProperties && this.state.favouriteProperties.length) {
    //   favourite = this.state.favouriteProperties.find(fp => fp === data.propertyId._id)
    // }
    let compareID = ''
    if (this.state.spPropertyIDs && this.state.spPropertyIDs.length) {
      compareID = this.state.spPropertyIDs.find(ci => ci === data._id)
    }
    // let favourite = this.state.favouriteProperties.find(fp => fp === data.propertyId._id)
    // let compareID = this.state.spPropertyIDs.find(ci => ci === data._id)
    return (
      <div className='col-lg-4 col-md-6 col-12 col-sm-12'>
        <div className='room-wrapper'>
          <div className='room-inner'>
            <div className='room'>
              <figure>
                {/* {this.state.userData && this.state.userData.userAccount
                ? <a className='avatar rounded-circle avatar-sm fav-icon' title='liked' style={{ backgroundColor: '#ffffff' }}>
                  {favourite === data.propertyId._id
                    ? <i className='fas fa-heart' disabled={this.state.submitDisabled} onClick={() => this.handleUnFavouriteProperty(data)} />
                    : <i className='far fa-heart' disabled={this.state.submitDisabled} onClick={() => this.handleFavouriteProperty(data)} />}
                </a> : null} */}
                <div className='img-div-list'>
                  <img src={(data.propertyId && data.propertyId.imagePath) ? config.baseUrl + data.propertyId.imagePath : require('../../../../assets/property_big_05.jpg')}
                    alt='property_image' className='img-fluid img-container' />
                </div>
                {data.pricing.minBasePriceUnit === '6 Hours'
                ? <a>
                  <div className='bottom-left'>
                    <p className='hourly-stay-text'>{t`lanEUButtonFlexiStay`}</p>
                  </div>
                </a>
                : null }
                {this.state.SPPropertyList.length >= 2
                ? compareID === data._id
                    ? <a className='avatar rounded-circle avatar-sm compare-icon' style={{ backgroundColor: '#ffffff' }} onClick={() => this.props.handleCompare(data)}>
                      <img src={require('../../../../assets/compare.png')} title='compare' alt='compare' style={{ width: '20px', height: '20px' }} />
                    </a>
                    : <a className='avatar rounded-circle avatar-sm compare-icon' style={{ backgroundColor: '#ffffff' }} onClick={() => this.props.handleCompare(data)}>
                      <img src={require('../../../../assets/compare.png')} title='compare' alt='compare' style={{ width: '20px', height: '20px' }} />
                    </a>
                : null}
                {/* <figcaption className='row'>
                  <div className='avatar-group'>
                      {this.state.moreImages.map((item, i) =>
                      <a className='avatar rounded-circle avatar-sm '>
                          <img alt='Image placeholder' src={item.simg} />
                      </a>
                      )}
                  </div>
                  <a className='avatar rounded-circle avatar-sm' onClick={this.handleHotelInfoView} style={{ backgroundColor: '#e2dddd', marginLeft: 25 }}>
                      <i className='fas fa-video' style={{ color: '#1da1d1' }} />
                  </a>
                  </figcaption> */}
              </figure>
              <div role='button' onClick={() => this.handleHotelListItemView(data)}>
                <div className='caption'>
                  <div className='txt1 hotelName'>{data.propertyTitle}</div>
                  {data.rating ? <div className='txt2 pb-0'>
                    {/* {data.rating} */}
                    <div className='small-stars pl-0'>
                      <StarRatingComponent
                        name='rate1'
                        starCount={data.rating}
                        value={data.rating}
                      />
                    </div>
                  </div>
                  : <div className='txt2 pb-0'>
                    <div className=' no-rating pl-0'>
                      <StarRatingComponent
                        name='rate2'
                        starCount={5}
                        value={5}
                      />
                    </div>
                  </div>
                  }
                  <div className='txt4 mb-2'>
                    <p className='list-checking-times'>{data.pricing.checkInTime} -- {data.pricing.checkOutTime}</p>
                  </div>
                  <div className='txt3 availables row'>
                    <div className='col-sm-6 py-1'>
                      <i className='fa fa-users pr-3' />
                      <span>{(data.propertyId && data.propertyId.propertyCapacity) ? data.propertyId.propertyCapacity : 0}</span>
                    </div>
                    <div className='col-sm-6 py-1' >
                      <div className='avatar avatar-xs pr-3'>
                        <img src={require('../../../../assets/available/doublebed.png')} />
                      </div>
                      <span className='list-img-icon'>{(data.propertyId && data.propertyId.doubleBedsCount) ? data.propertyId.doubleBedsCount : 0}</span>
                    </div>
                    <div className='col-sm-6 py-1' >
                      <i className='fa fa-bath pr-3' />
                      <span>{(data.propertyId && data.propertyId.privateBathRooms) ? data.propertyId.privateBathRooms : 0}</span>
                    </div>
                    <div className='col-sm-6 py-1' >
                      <i className='fa fa-bed pr-3' />
                      <span>{(data.propertyId && data.propertyId.singleBedsCount) ? data.propertyId.singleBedsCount : 0}</span>
                    </div>
                  </div>
                  <div className='txt4'>
                    <a onClick={() => this.handleHotelListItemView(data)} >{t`lanEUButtonViewDetail`}<i className='fa fa-caret-right' aria-hidden='true' /></a>
                  </div>
                </div>
                <div className='select-txt'>
                  <a onClick={() => this.handleHotelListItemView(data)} ><span>{t`lanEUButtonSelectThisRoom`}<i className='fa fa-angle-right' aria-hidden='true' /></span></a>
                </div>
                <div className='room-icons'>
                  {(data.amenities && data.amenities.length > 0)
                    ? data.amenities.map((data, i) => {
                      let amen = Amenities.find(amen => amen.name === data)
                      return (
                        i < 5
                            ? <div className='room-ic room-ic-wifi' key={i}>
                              <img src={config.baseUrl + amen.amenityIconPath} />
                              <div className='txt1'>{amen.name}</div>
                            </div> : ''
                      )
                    }) : null}
                  {day && day === 'Weekend'
                  ? <div className='room-price'>
                    <div className='txt1'>₹ <span>{data.pricing.weekEndTotalPrice}</span></div>
                    {/* <div className='txt2'>PER NIGHT</div> */}
                    {data.pricing.weekEndBasePriceDiscount !== '0'
                    ? <div>
                      <div className='txt1'><del>{data.pricing.weekEndWdTotalPrice}</del></div>
                      <div className='txt2'>
                        <div>{`${data.pricing.weekEndBasePriceDiscount} %`}</div>
                      </div>
                    </div>
                    : ''}
                  </div>
                  : <div className='room-price'>
                    <div className='txt1'>₹ <span>{data.pricing.totalPrice}</span></div>
                    {data.pricing.basePriceDiscount !== '0'
                    ? <div>
                      <div className='txt1'><del>{data.pricing.wdTotalPrice}</del></div>
                      <div className='txt2'>
                        {`${data.pricing.basePriceDiscount} %`}
                      </div>
                    </div>
                    : ''}
                  </div>}
                  {/* <div className='room-price'>
                    <div className='txt1'>₹<span>{data.pricing.totalPrice}</span></div>
                    <div className='txt2'>PER NIGHT</div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ADHotelsEachRowList.propTypes = {
  data: PropTypes.any,
  authObj: PropTypes.any,
  favouriteProperties: PropTypes.any,
  spPropertyIDs: PropTypes.any,
  handleCompare: PropTypes.func,
  // handleFavouriteProperty: PropTypes.any,
  SPPropertyList: PropTypes.array,
  day: PropTypes.any
}
