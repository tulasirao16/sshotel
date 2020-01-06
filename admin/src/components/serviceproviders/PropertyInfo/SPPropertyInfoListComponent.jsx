/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import PropTypes from 'prop-types'
import { hashHistory } from 'react-router'
import Switch from 'react-switch'
import 'react-drawer/lib/react-drawer.css'
import ReactStars from 'react-stars'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPPropertyInfoListComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      reload: false,
      starrating: '',
      propertyId: this.props.propertyID,
      propertyObj: this.props.propertyObj,
      propertyInfoList: [],
      propertyInfoDummyList: [],
      searchString: ''
    }
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePropertyInfoView = this.handlePropertyInfoView.bind(this)
  }
  componentWillMount () {
    // this.setState({ propertyId: this.props.propertyID })
    let obj = { url: config.baseUrl + config.getSPPropertyInfosListAPI + this.props.propertyID }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          propertyInfoList: resObj.data.statusResult, propertyInfoDummyList: resObj.data.statusResult
        })
      } else {
        _this.setState({
          propertyInfoList: [], propertyInfoDummyList: []
        })
      }
    })
  }
  handleInputChange (event) {
    this.setState({ searchString: event.target.value })
    let Search = event.target.value
    let searchList = this.state.propertyInfoDummyList.filter(function (item) {
      return item.propertyTitle.indexOf(Search) > -1 ||
        item.propertyTitle.indexOf(Search) > -1 ||
        item.spLocationObj.area.indexOf(Search) > -1 ||
        item.propertyType.indexOf(Search) > -1 ||
        item.rentType.indexOf(Search) > -1 ||
        item.roomCategory.indexOf(Search) > -1 ||
        item.roomType.indexOf(Search) > -1 ||
        item.pricing.billingType.indexOf(Search) > -1
    })
    this.setState({ propertyInfoList: searchList })
  }
  handleCreatePropertyInfo = (event) => {
    localStorage.setItem('propertyObj', JSON.stringify(this.state.propertyObj))
    hashHistory.push('/host/property-info/create')
    event.preventDefault()
  }
  handlePropertyInfoView (item) {
    localStorage.setItem('propertyObj', JSON.stringify(this.state.propertyObj))
    localStorage.setItem('propertyInfoViewObj', JSON.stringify(item))
    hashHistory.push('/host/property-info/view')
  }
  handleStatusChange (status, item, i) {
    let statusChange = status === false ? 'Inactive' : 'Active'
    let obj = { url: config.baseUrl + config.putSPPropertyInfoStatusChangeAPI + item._id + '/' + statusChange }
    this.setState({ reload: false })
    let _this = this
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.state.propertyInfoList[i].status = resObj.data.statusResult.status
        _this.state.propertyInfoDummyList[i].status = resObj.data.statusResult.status
        _this.setState({ reload: true })
      } else if (resObj.data.statusCode === '1015') {
        _this.setState({ reload: true })
        alert(t`lanSPLabelErrorPropertyInactive`)
      } else {
        _this.setState({ reload: true })
        alert(t`lanSPTitlePropertyInfo` + statusChange + ' ' + t`lanSPLabelErrorFailed`)
      }
    })
  }
  render () {
    return (
      <div>
        <div className='property-info-list'>
          <div className='card border-0 mb-0'>
            <div className='py-0 px-0 mb-4'>
              <div className='row align-items-center'>
                <div className='col-md-4'>
                  <div className='input-group input-group-lg input-group-flush'>
                    <div className='input-group-prepend'>
                      <div className='input-group-text'>
                        <span className='fas fa-search' />
                      </div>
                    </div>
                    <input className='form-control mr-sm-2' type='text' placeholder={t`lanCommonLabelSearch`} aria-label='Search' value={this.state.searchString} onChange={this.handleInputChange} />
                  </div>
                  {/* <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitlePropertyInfoList`}</h6> */}
                </div>
                <div className='col-md-8 text-right'>
                  <a href='#' className='btn btn-primary text-white' onClick={this.handleCreatePropertyInfo}><i className='fas fa-plus' /> {t`lanSPTitleCreatePropertyInfo`}</a>
                </div>
              </div>
              {/* <h3 className='mb-0'>{t`lanSPTitlePropertyInfoList`}</h3> */}
            </div>
            <div>
              <div className='row'>
                {this.state.propertyInfoList && this.state.propertyInfoList.length > 0 ? this.state.propertyInfoList.map((item, i) =>
                  <div className='col-md-6' key={i}>
                    <div className='card mb-3'>
                      <a onClick={() => this.handlePropertyInfoView(item)}>
                        <div className='row'>
                          <div className='col-md-4 left_div'>
                            <div className='card-images'>
                              <img src={item.propertyId.imagePath ? config.baseUrl + item.propertyId.imagePath : require('../images/room1.jpg')} className='images' />
                            </div>
                          </div>
                          <div className='col-md-8 right_div'>
                            <div className='card-body p-3'>
                              <div className='title'><h3 className='mb-0'>{item.propertyTitle}</h3></div>
                              <div className='SubTitle mb-0 text-muted'><p>{item.spLocationObj.area}</p></div>
                              {item.rating
                                ? <ReactStars
                                  value={item.rating}
                                  count={5}
                                  size={24}
                                  half={false}
                                  color2={'#ffd700'} />
                                : null}
                              <ul className='list-group list-group-flush list'>
                                <li className='list-group-item px-0 pb-0'>
                                  <div className='row align-items-center'>
                                    <div className='col-auto mb-2'>
                                      <span className='badge badge-pill badge-secondary'>
                                        <small>{t`lanSPLabelActiveRooms`}</small>
                                        <p className='rooms-count'>{item.activeRoomsCount ? item.activeRoomsCount : 0}</p>
                                      </span>
                                    </div>
                                    <div className='col-auto mb-2'>
                                      <span className='badge badge-pill badge-secondary'>
                                        <small>{t`lanSPLabelOnHoldRooms`}</small>
                                        <p className='rooms-count'>{item.onHoldRoomsCount ? item.onHoldRoomsCount : 0}</p>
                                      </span>
                                    </div>
                                    <div className='col-auto mb-2'>
                                      <span className='badge badge-pill badge-secondary'>
                                        <small>{t`lanSPLabelPropertyTotalRooms`}</small>
                                        <p className='rooms-count'>{item.roomsCount ? item.roomsCount : 0}</p>
                                      </span>
                                    </div>
                                    <div className='col-auto mb-2'>
                                      <span className='badge badge-pill badge-secondary'>
                                        <img src={require('../images/check-list-icon.png')} className='icon-img' />
                                        <small>{item.propertyType}</small>
                                      </span>
                                    </div>
                                    <div className='col-auto mb-2'>
                                      <span className='badge badge-pill badge-secondary'>
                                        <img src={require('../images/family-room.png')} className='icon-img' />
                                        <small>{item.membersCapacity ? item.membersCapacity : 0}</small>
                                      </span>
                                    </div>
                                    <div className='col-auto mb-2'>
                                      <span className='badge badge-pill badge-secondary'>
                                        <img src={require('../images/room.png')} className='icon-img' />
                                        <small>{item.roomType}</small>
                                      </span>
                                    </div>
                                  </div>
                                </li>
                                <li className='list-group-item px-0 pb-0'>
                                  <div className='row align-items-center'>
                                    <div className='col-auto'>
                                      <p className='text-muted mb-0'>{t`lanSPLabelPropertyInfoPrice`}</p>
                                      <span className='h2 font-weight-bold mb-0'>Rs. {item.pricing.basePrice} /- <small>{item.pricing.billingType}</small> </span>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </a>
                      <div className='CardFooter'>
                        <Switch
                          className='react-switch'
                          onChange={(status) => this.handleStatusChange(status, item, i)}
                          checked={item.status === 'Active'}
                          aria-labelledby='neat-label'
                        />
                      </div>
                    </div>
                  </div>
              ) : <div className='no-data'><p>{t`lanSPLabelNoPropertyInfoListed`}</p></div>}
              </div>
            </div>
          </div>
        </div>
        {/* <div className='main-content' id='panel'>
          <div className='container-fluid mt--6'>
            <div className='row justify-content-center'>
              <div className='col-lg-12 col-md-12'>

              </div>
            </div>
          </div>
        </div> */}
      </div>
    )
  }
}

SPPropertyInfoListComponent.propTypes = {
  propertyID: PropTypes.any,
  propertyObj: PropTypes.any
}
export default SPPropertyInfoListComponent
