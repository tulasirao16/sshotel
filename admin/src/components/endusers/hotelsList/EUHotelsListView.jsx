/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
// import APICallManager from '../../../services/callmanager'
// import config from '../../../../public/config.json'
import { t } from 'ttag'
import './Css/EUHotelsList.css'
import PropTypes from 'prop-types'
import EUHotelsEachRowListComponent from './EUHotelEachRowList'
import Modal from 'react-modal'

// import '../../../css/style.css'
// const Amenities = require('../../../../assets/amenities/amenities.json')
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

export default class HotelsListView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      authObj: {},
      favouritesData: [],
      totalCount: 0,
      activePage: 1,
      searchString: '',
      isFavourite: true,
      favouriteProperties: [],
      spPropertyIDs: [],
      spPropertyInfo: [],
     // spPropertyIDs: this.props.spPropertyIDs,
      SPPropertyList: (this.props.SPPropertyList && this.props.SPPropertyList.length) ? this.props.SPPropertyList : []
    }
    this.handleHotelListItemView = this.handleHotelListItemView.bind(this)
    this.handleListView = this.handleListView.bind(this)
    this.handleMapView = this.handleMapView.bind(this)
    this.handleHotelList = this.handleHotelList.bind(this)
    this.handleFavouriteProperty = this.handleFavouriteProperty.bind(this)
    // this.handleUnFavouriteProperty = this.handleUnFavouriteProperty.bind(this)
    this.handleCompare = this.handleCompare.bind(this)
    this.handleComparePopup = this.handleComparePopup.bind(this)
    this.handleComparePage = this.handleComparePage.bind(this)
  }

  componentWillMount () {
    this.setState({ SPPropertyList: this.props.SPPropertyList })
    // this.setState({ authObj: this.props.authObj, favouriteProperties: this.props.favouriteProperties })
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.preferences) {
      let favouriteProperties = (authObj && authObj.preferences && authObj.preferences.favouriteProperties) ? authObj.preferences.favouriteProperties : []
      this.setState({ authObj: authObj, favouriteProperties: favouriteProperties })
    }
  }
  async componentWillReceiveProps (newProps) {
    this.setState({ SPPropertyList: newProps.SPPropertyList })
  }
  // handleFavouriteProperty = (data) => {
  //   if (this.state.authObj && this.state.authObj.mobileNumber) {
  //     let newAuthObj = this.state.authObj
  //     let postJson = {
  //       customer: this.state.authObj.name,
  //       serviceProviderID: data.spServiceProviderId,
  //       serviceProvider: data.spServiceProvider,
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
  //     let obj = { url: config.baseUrl + config.postEUFavouritePropertyAPI, body: postJson }
  //     APICallManager.postCall(obj, function (resObj) {
  //       if (resObj && resObj.data.statusCode === '0000') {
  //         let favouriteProperties = _this.state.favouriteProperties
  //         favouriteProperties.push(data.propertyId._id)
  //         newAuthObj.preferences.favouriteProperties = favouriteProperties
  //         localStorage.setItem('authObj', JSON.stringify(newAuthObj))
  //         _this.props.handleFavouriteProperty(favouriteProperties, newAuthObj)
  //       }
  //     })
  //   } else {
  //     hashHistory.push('/login')
  //   }
  // }
  // handleUnFavouriteProperty (data) {
  //   var newAuthObj = this.state.authObj
  //   let favouriteProperties = this.state.favouriteProperties
  //   var userData = {
  //     spPropertyId: data.propertyId._id,
  //     spID: data.spServiceProviderId
  //   }
  //   let _this = this
  //   let obj = { url: config.baseUrl + config.putEUUnfavouritePropertyAPI, body: userData }
  //   APICallManager.putCall(obj, function (resObj) {
  //     if (resObj && resObj.data.statusCode === '0000') {
  //       let index = favouriteProperties.findIndex(x => x === data.propertyId._id)
  //       favouriteProperties.splice(index, 1)
  //       newAuthObj.preferences.favouriteProperties = favouriteProperties
  //       localStorage.setItem('authObj', JSON.stringify(newAuthObj))
  //       _this.props.handleFavouriteProperty(favouriteProperties, newAuthObj)
  //     }
  //   })
  // }
  handleHotelListItemView (data) {
    localStorage.setItem('EUPropertyInfoData', JSON.stringify(data))
    hashHistory.push('/hotels/booknow')
    event.preventDefault()
  }
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
  handleFavouriteProperty (favProperties, newAuthObj) {
    // console.log(favProperties)
    this.setState({ favouriteProperties: favProperties, authObj: newAuthObj })
    this.props.handleFavouriteProperty(favProperties, newAuthObj)
  }
  render () {
    // const data = this.props.data
    // console.log('data', data)
    // let favourite = ''
    // if (this.state.favouriteProperties && this.state.favouriteProperties.length) {
    //   favourite = this.state.favouriteProperties.find(fp => fp === data.propertyId._id)
    // }
    // let compareID = ''
    // if (this.state.spPropertyIDs && this.state.spPropertyIDs.length) {
    //   compareID = this.state.spPropertyIDs.find(ci => ci === data._id)
    // }
    return (
      <div id='page-wrapper'>
        <main role='main' className='inner cover'>
          {/* =================== filter section =========================== */}
          <div className='album py-5 bg-light'>
            <div className='container'>
              <div className='row'>
                <div className='col-lg-12 col-xs-12 text-center only-list' >
                  <div className='switch-view-controller'>
                    <a onClick={this.props.handleListView} className='item'>
                      <i className='fas fa-th' />
                      <span>List</span>
                    </a>
                    <a onClick={this.props.handleHotelList} id='both-trigger' className='item active hidden-mobile'>
                      <i className='far fa-object-group' />
                      <span>Both</span>
                    </a>

                    <a onClick={this.props.handleMapView} id='only-map-trigger' className='item'>
                      <i className='fas fa-map-marker-alt' />
                      <span>Map</span>
                    </a>

                    <a href='' className='modal-trigger item hidden-desktop hidden-large-desktop'
                      data-trigger-for='menu02'>
                      <i className='icon icon-filter' />
                      <span>Filters</span>
                    </a>
                  </div>
                </div>

                {this.state.SPPropertyList.length > 0
                  ? this.state.SPPropertyList.map((item, i) =>
                    <EUHotelsEachRowListComponent key={i} data={item} authObj={this.state.authObj} favouriteProperties={this.state.favouriteProperties}
                      handleFavouriteProperty={this.handleFavouriteProperty} handleCompare={this.handleCompare} spPropertyIDs={this.state.spPropertyIDs} />)
                    // <div className='col-lg-4'>
                    //   <a onClick={this.handleHotelListItemView} >
                    //     <div className='room-wrapper'>
                    //       <div className='room-inner'>
                    //         <div className='room'>
                    //           <figure>
                    //             {this.state.authObj && this.state.authObj.mobileNumber
                    //           ? <a className='avatar rounded-circle avatar-sm fav-icon' title='liked' style={{ backgroundColor: '#ffffff' }}>
                    //             {favourite === data.propertyId._id
                    //               ? <i className='fas fa-heart' onClick={() => this.handleUnFavouriteProperty(data)} />
                    //               : <i className='far fa-heart' onClick={() => this.handleFavouriteProperty(data)} />}
                    //           </a> : null}
                    //             <a >
                    //               <img src={(data.propertyId && data.propertyId.imagePath) ? config.baseUrl + data.propertyId.imagePath
                    //                 : require('../../../../assets/property_big_05.jpg')} alt='' className='img-fluid' />
                    //             </a>
                    //             {compareID === data._id
                    //             ? <a className='avatar rounded-circle avatar-sm compare-icon' style={{ backgroundColor: '#ffffff' }} onClick={() => this.props.handleCompare(data)}>
                    //               <img src={require('../../../../assets/compare.png')} title='compare' alt='compare' style={{ width: '20px', height: '20px' }} />
                    //             </a>
                    //             : <a className='avatar rounded-circle avatar-sm compare-icon' style={{ backgroundColor: '#ffffff' }} onClick={() => this.props.handleCompare(data)}>
                    //               <img src={require('../../../../assets/compare.png')} title='compare' alt='compare' style={{ width: '20px', height: '20px' }} />
                    //             </a>
                    //             }

                    //             {/* <a className='avatar rounded-circle avatar-sm fav-icon' title='liked' style={{ backgroundColor: '#ffffff' }}>
                    //           <i className='fas fa-heart' />
                    //         </a>
                    //         <a onClick={this.handleHotelListItemView} >
                    //           <img src={(item.propertyId && item.propertyId.imagePath) ? config.baseUrl + item.propertyId.imagePath : require('../../../../assets/property_big_05.jpg')} alt='' className='img-fluid' />
                    //         </a>
                    //         <a className='avatar rounded-circle avatar-sm compare-icon' style={{ backgroundColor: '#ffffff' }} onClick={() => this.handleCompare(item)}>
                    //           <img src={require('../../../../assets/compare.png')} title='compare' alt='compare' style={{ width: '20px', height: '20px' }} />
                    //         </a> */}

                    //             {/* <figcaption className='row'>
                    //           <div className='avatar-group'>
                    //             {this.state.moreImages.map((item, i) =>
                    //               <a className='avatar rounded-circle avatar-sm '>
                    //                 <img alt='Image placeholder' src={item.simg} />
                    //               </a>
                    //             )}
                    //           </div>
                    //           <a className='avatar rounded-circle avatar-sm' onClick={this.handleHotelInfoView} style={{ backgroundColor: '#e2dddd', marginLeft: 25 }}>
                    //             <i className='fas fa-video' style={{ color: '#1da1d1' }} />
                    //           </a>
                    //         </figcaption> */}
                    //           </figure>
                    //           <div className='caption'>
                    //             <div className='txt1 hotelName'>{item.propertyTitle}</div>
                    //             {item.rating ? <div className='txt2'>
                    //               {item.rating}
                    //               <div className='small-stars'>
                    //                 <i className='fa fa-star' />
                    //                 <i className='fa fa-star' />
                    //                 <i className='fa fa-star' />
                    //                 <i className='fa fa-star' />
                    //                 <i className='fa fa-star' />
                    //               </div>
                    //             </div> : ''}
                    //             <div className='txt3 availables row'>
                    //               <div className='col-sm-6 py-1'>
                    //                 <i className='fa fa-users pr-3' />
                    //                 <span>{(item.propertyId && item.propertyId.propertyCapacity) ? item.propertyId.propertyCapacity : 0}</span>
                    //               </div>
                    //               <div className='col-sm-6 py-1' >
                    //                 <div className='avatar avatar-xs pr-3'>
                    //                   <img src={require('../../../../assets/available/doublebed.png')} />
                    //                 </div>
                    //                 <span>{(item.propertyId && item.propertyId.doubleBedsCount) ? item.propertyId.doubleBedsCount : 0}</span>
                    //               </div>
                    //               <div className='col-sm-6 py-1' >
                    //                 <i className='fa fa-bath pr-3' />
                    //                 <span>{(item.propertyId && item.propertyId.privateBathRooms) ? item.propertyId.privateBathRooms : 0}</span>
                    //               </div>
                    //               <div className='col-sm-6 py-1' >
                    //                 <i className='fa fa-bed pr-3' />
                    //                 <span>{(item.propertyId && item.propertyId.singleBedsCount) ? item.propertyId.singleBedsCount : 0}</span>
                    //               </div>
                    //             </div>
                    //             <div className='txt4'>
                    //               <a onClick={this.handleHotelListItemView} >VIEW DETAIL<i className='fa fa-caret-right' aria-hidden='true' /></a>
                    //             </div>
                    //           </div>
                    //           <div className='select-txt'>
                    //             <a onClick={this.handleHotelListItemView} ><span>SELECT THIS ROOM<i className='fa fa-angle-right' aria-hidden='true' /></span></a>
                    //           </div>
                    //           <div className='room-icons'>
                    //             {(item.amenities && item.amenities.length > 0)
                    //           ? item.amenities.map((data, i) => {
                    //             let amen = Amenities.find(amen => amen.name === data)
                    //             return (
                    //               i < 5
                    //                 ? <div className='room-ic room-ic-wifi'>
                    //                   <img src={config.baseUrl + amen.amenityIconPath} />
                    //                   <div className='txt1'>{amen.name}</div>
                    //                 </div> : ''
                    //             )
                    //           }) : null}
                    //             <div className='room-price'>
                    //               <div className='txt1'>₹<span>{item.pricing.basePrice}</span></div>
                    //               <div className='txt2'>PER NIGHT</div>
                    //             </div>
                    //           </div>
                    //         </div>
                    //       </div>
                    //     </div>
                    //   </a>
                    // </div>)
                : <div>{t`lanCommonLabelNoResultsFound`}</div>
                }
              </div> {/* row end */}
            </div> {/* container end */}
          </div>
        </main>
        <Modal
          isOpen={this.state.compareModalIsOpen}
          style={customStyles}
        >
          <div>
            {this.state.spPropertyInfo && this.state.spPropertyInfo.length > 0 ? this.state.spPropertyInfo.map((item, i) =>
              <div key={i}>
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
          }
        </Modal>
      </div>
    )
  }
}

HotelsListView.propTypes = {
  // handleCompare: propTypes.any,
  // favouriteProperties: PropTypes.any,
  handleFavouriteProperty :PropTypes,
  // authObj: PropTypes.any,
  // spPropertyIDs: PropTypes.any,
  // data: PropTypes.any,
  SPPropertyList: PropTypes.any,
  handleListView: PropTypes.any,
  handleHotelList: PropTypes.any,
  handleMapView: PropTypes.any
}
