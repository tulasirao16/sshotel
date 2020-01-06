/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import Modal from 'react-modal'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import PropTypes from 'prop-types'
import 'react-day-picker/lib/style.css'

import { t } from 'ttag'

import '../home/Css/EULandingPage.css'
import '../../../css/carousel.css'
import '../../../css/theme.min.css'
import './Css/EUStickyFilter.css'
import './Css/EUVideoTheme.css'
const Amenities = require('../../../../assets/amenities/amenities.json')
var ip = require('ip')

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
}

class EUHomePropertiesListComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      latitude: this.props.latitude ? this.props.latitude : 0,
      longitude: this.props.longitude ? this.props.longitude : 0,
      area: this.props.area ? this.props.area : '',
      city: this.props.city ? this.props.city : '',
      state: this.props.state ? this.props.state : '',
      location: '',
      guestAdultValue: this.props.guestAdultValue ? this.props.state : 2,
      guestRooms: this.props.guestRooms ? this.props.state : 1,
      sortBy: 'Recommended',
      filterBy: {},
      SPPropertyList: [],
      activePage: 1,
      startDate: new Date(),
      isOpen: true,
      prevScrollpos: window.pageYOffset,
      visible: true,
      mountains: [
        { placeImg: require('../../../../assets/all/m1.jpg') },
        { placeImg: require('../../../../assets/all/m2.jpg') }
      ],
      beachPlaces: false,
      mountainPlaces: false,
      typeSelect: true,
      typeSelectRemote: false,
      typeSelectTemple: false,
      typeSelectResort: false,
      typeSelectCity: false,
      typeSelectHill: false,
      from: undefined,
      to: undefined,
      moreImages: [
        { simg: require('../../../../assets/r1.jpg') },
        { simg: require('../../../../assets/r2.jpg') },
        { simg: require('../../../../assets/r4.jpg') },
        { simg: require('../../../../assets/r5.jpg') },
        { simg: require('../../../../assets/r1.jpg') }
      ],
      spPropertyInfo: [],
      spPropertyIDs: [],
      modalIsOpen: false
    }
    this.handleDefaultData = this.handleDefaultData.bind(this)
    this.handleAllHotelsList = this.handleAllHotelsList.bind(this)
    this.handleHotelInfoView = this.handleHotelInfoView.bind(this)
    this.handleCompare = this.handleCompare.bind(this)
    this.handleComparePopup = this.handleComparePopup.bind(this)
    this.handleComparePage = this.handleComparePage.bind(this)
    this.handleDataByLocation = this.handleDataByLocation.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentDidMount () {
    if (this.props.area && this.props.city && this.props.state) {
      this.setState({
        area: this.props.area,
        city: this.props.city,
        state: this.props.state,
        latitude: this.props.latitude,
        longitude: this.props.longitude,
        guestRooms: this.props.guestRooms,
        guestAdultValue: this.props.guestAdultValue
      })
      this.handleDataByLocation(this.props.area, this.props.city, this.props.state, this.props.guestAdultValue, this.props.guestRooms)
    } else {
      this.handleDefaultData()
    }
  }

  // componentWillReceiveProps (newProps) {
  //   if (newProps.area && newProps.city && newProps.state) {
  //     this.setState({
  //       area: newProps.area,
  //       city: newProps.city,
  //       state: newProps.state,
  //       latitude: newProps.latitude,
  //       longitude: newProps.longitude,
  //       guestRooms: newProps.guestRooms,
  //       guestAdultValue: newProps.guestAdultValue
  //     })
  //     this.handleDataByLocation(newProps.area, newProps.city, newProps.state, newProps.guestAdultValue, newProps.guestRooms)
  //   } else {
  //     this.handleDefaultData()
  //   }
  // }

  handleDataByLocation (area, city, state, guestAdultValue, guestRooms) {
    let num = 1
    let postJson = {
      'dataType': 'byLocation',
      'noOfPersons': guestAdultValue,
      'noOfRooms': guestRooms,
      'sortBy': this.state.sortBy,
      'filterBy': this.state.filterBy,
      'activePage': num,
      'area': area,
      'city': city,
      'state': state
    }
    console.log('postJson', postJson)
    let propertiesList = { url: config.baseUrl + config.postEUHomePropertyGetAPI, body: postJson }
    let _this = this
    APICallManager.postCall(propertiesList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ SPPropertyList: resObj.data.statusResult.homeData })
      } else {
        _this.setState({ SPPropertyList: [] })
      }
    })
  }
  handleDefaultData () {
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
        _this.setState({ SPPropertyList: resObj.data.statusResult.homeData })
      } else {
        _this.setState({ SPPropertyList: [] })
      }
    })
  }
  handleHotelInfoView (e) {
    localStorage.setItem('EUPropertyInfoData', JSON.stringify(e))
    hashHistory.push('/hotels/booknow')
    e.preventDefault()
  }
  handleAllHotelsList (e) {
    let locationSearchObj = {
      area: this.state.area,
      city: this.state.city,
      state: this.state.state,
      latitude: this.state.latitude,
      longitude: this.state.longitude
    }
    localStorage.setItem('locationSearchObj', JSON.stringify(locationSearchObj))
    hashHistory.push('/hotels')
    e.preventDefault()
  }
  closeModal () {
    this.setState({ modalIsOpen: false })
  }
  handleCompare (item) {
    alert('hiii')
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
      this.setState({ modalIsOpen: true })
    } else if (this.state.spPropertyIDs.length === 1) {
      this.setState({ modalIsOpen: true })
    } else {
      this.setState({ modalIsOpen: false })
    }
  }
  handleComparePage () {
    localStorage.setItem('spPropertyIDs', JSON.stringify(this.state.spPropertyIDs))
    localStorage.setItem('spPropertyInfo', JSON.stringify(this.state.spPropertyInfo))
    hashHistory.push('/properties/compare')
  }
  render () {
    return (
      <div className='cozyspace' >
        <main role='main' className='inner cover'>
          {/* ======================= Best Deals section ================================ */}
          <div className='ui grid container landing-hotel-list pt-4'>
            <div className='row mb-2'>
              <div className='col-md-12'>
                <div className='typo-section-header-sq'>
                  <h2 className='text-align-center-sq'>{t`lanEULabelBestDeals`}</h2>
                </div>
              </div>
              <div className='col-md-12 d-lg-flex align-items-center justify-content-end'>
                <a onClick={this.handleAllHotelsList} className='more-trigger pb-3  '>{t`lanEULabelSeeAllBestDeals`}<i className='fas fa-angle-double-right ml-2' />
                </a>
              </div>
            </div>
            <div className='row'>
              <div className='ui column'>
                <div className='typo-section-sq bottom-big'>
                  <div className='album '>
                    <div className='container-fluid'>
                      <div className='row'>
                        {this.state.SPPropertyList.length > 0 ? this.state.SPPropertyList.map((item, i) =>
                        i < 6
                          ? <div className='col-lg-4' key={i} >
                            {/* <a onClick={this.handleHotelInfoView} > */}
                            <div className='room-wrapper'>
                              <div className='room-inner'>
                                <div className='room'>
                                  <figure>
                                    <a className='avatar rounded-circle avatar-sm fav-icon' title='liked' style={{ backgroundColor: '#ffffff' }}>
                                      <i className='fas fa-heart' />
                                    </a>
                                    <a onClick={() => this.handleHotelInfoView(item)} >
                                      <img src={(item.propertyId && item.propertyId.imagePath) ? config.baseUrl + item.propertyId.imagePath : require('../../../../assets/property_big_05.jpg')} className='img-fluid' />
                                      <div className='list-overlay' />
                                    </a>
                                    {this.state.spPropertyIDs && this.state.spPropertyIDs.length > 0 ? this.state.spPropertyIDs.map((data, i) =>
                                      <a key={i} className='avatar rounded-circle avatar-sm compare-icon' style={{ backgroundColor: '#ffffff' }} onClick={() => this.handleCompare(item)}>
                                        <img src={require('../../../../assets/compare.png')} title='compare' alt='compare' style={{ width: '20px', height: '20px' }} />
                                      </a>
                                    ) : <a className='avatar rounded-circle avatar-sm compare-icon' style={{ backgroundColor: '#ffffff' }} onClick={() => this.handleCompare(item)}>
                                      <img src={require('../../../../assets/compare.png')} title='compare' alt='compare' style={{ width: '20px', height: '20px' }} />
                                    </a>
                                    }
                                    {/* <figcaption className='row'>
                                        <div className='avatar-group'>
                                          {item.amenities.map((item, i) =>
                                            <a className='avatar rounded-circle' onClick={this.handleHotelInfoView} >
                                              <img alt='Image placeholder' src={require('../../../../assets/rm2.jpg')} />
                                            </a>
                                          )}
                                        </div>
                                        <a className='avatar rounded-circle' onClick={this.handleHotelInfoView} style={{ backgroundColor: '#e2dddd', marginLeft: 20 }}>
                                          <i className='fas fa-video' style={{ color: '#1da1d1' }} />
                                        </a>
                                      </figcaption> */}
                                  </figure>
                                  <div className='caption'>
                                    <div className='txt1 hotelName'>{item.propertyTitle}</div>
                                    {item.rating ? <div className='txt2'>
                                      {item.rating}
                                      <div className='small-stars'>
                                        <i className='fa fa-star' />
                                        <i className='fa fa-star' />
                                        <i className='fa fa-star' />
                                        <i className='fa fa-star' />
                                        <i className='fa fa-star' />
                                      </div>
                                    </div> : ''}
                                    <div className='txt3 availables row'>
                                      <div className='col-sm-6 py-1'>
                                        <i className='fa fa-users pr-3' />
                                        <span>{(item.propertyId && item.propertyId.propertyCapacity) ? item.propertyId.propertyCapacity : 0}</span>
                                      </div>
                                      <div className='col-sm-6 py-1' >
                                        <div className='avatar avatar-xs pr-3'>
                                          <img src={require('../../../../assets/available/doublebed.png')} />
                                        </div>
                                        <span>{(item.propertyId && item.propertyId.doubleBedsCount) ? item.propertyId.doubleBedsCount : 0}</span>
                                      </div>
                                      <div className='col-sm-6 py-1' >
                                        <i className='fa fa-bath pr-3' />
                                        <span>{(item.propertyId && item.propertyId.privateBathRooms) ? item.propertyId.privateBathRooms : 0}</span>
                                      </div>
                                      <div className='col-sm-6 py-1' >
                                        <i className='fa fa-bed pr-3' />
                                        <span>{(item.propertyId && item.propertyId.singleBedsCount) ? item.propertyId.singleBedsCount : 0}</span>
                                      </div>

                                    </div>
                                    <div className='txt4'>
                                      <a onClick={this.handleAllHotelsList}>VIEW DETAIL<i className='fa fa-caret-right' aria-hidden='true' /></a>
                                    </div>
                                  </div>
                                  <div className='select-txt'>
                                    <a href='details.html'><span>SELECT THIS ROOM<i className='fa fa-angle-right' aria-hidden='true' /></span></a>
                                  </div>
                                  <div className='room-icons'>
                                    {(item.amenities && item.amenities.length > 0)
                                      ? item.amenities.map((data, i) => {
                                        let amen = Amenities.find(amen => amen.name === data)
                                        return (
                                          i < 5
                                            ? <div className='room-ic room-ic-wifi' key={i} >
                                              <img src={config.baseUrl + amen.amenityIconPath} />
                                              <div className='txt1'>{amen.name}</div>
                                            </div> : ''
                                        )
                                      }) : null}
                                    <div className='room-price'>
                                      <div className='txt1'>₹<span>{item.pricing.basePrice}</span></div>
                                      <div className='txt2'>PER NIGHT</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* </a> */}
                          </div> : ''
                        ) : <div className='col-sm-12 text-center my-3' ><label>{t`lanCommonLabelNoResultsFound`}</label> </div>} {/* col end */}
                      </div> {/* row end */}
                      <a href='' className='more-trigger pb-5' data-more={t`lanEULabelDiscoverAll`} onClick={this.handleAllHotelsList}>
                        <i className='fas fa-chevron-circle-down' />
                      </a>
                    </div> {/* container end */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Modal
          isOpen={this.state.modalIsOpen}
          style={customStyles}
        >
          <div className='container'>
            <div className='row py-2 modal-close' style={{ justifyContent: 'flex-end' }}>
              <a onClick={this.closeModal}><span><i className='fas fa-times' /></span></a>
            </div>
            <div className='col-sm-12 hotel-names-compare'>
              <p className='pb-0'>You can Compare Up To Three Hotels </p>
              {this.state.spPropertyInfo && this.state.spPropertyInfo.length > 0 ? this.state.spPropertyInfo.map((item, i) =>
                <label key={i}>
                  {item.propertyTitle },
                </label>
              ) : null}
            </div>
            {this.state.spPropertyIDs.length < 3
              ? <div className='col-sm-12 pb-3 add-hotel-to-compare' >
                <button className='circle-class-compare-add mr-2' onClick={() => this.setState({ modalIsOpen: false })}>
                  <i className='fas fa-plus' style={{ color: 'green' }} /></button><span>{t`lanEUButtonAddHotelsToCompare`}</span>
              </div> : null}
            {this.state.spPropertyIDs.length === 1
            ? null
              : <div className='col-sm-12 text-left pb-5'>
                <button className='btn btn-primary' onClick={this.handleComparePage}>{t`lanEUButtonCompare`}</button>
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
              <button onClick={() => this.setState({ modalIsOpen: false })}>{t`lanEUButtonAddHotelsToCompare`}</button>
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

EUHomePropertiesListComponent.propTypes = {
  area: PropTypes.any,
  city: PropTypes.any,
  state: PropTypes.any,
  latitude: PropTypes.any,
  longitude: PropTypes.any,
  guestAdultValue: PropTypes.any,
  guestRooms: PropTypes.any
}

export default EUHomePropertiesListComponent
