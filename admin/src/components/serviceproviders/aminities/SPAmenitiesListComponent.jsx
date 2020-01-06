/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import SPAmenitiesViewComponent from './SPAmenitiesViewComponent'
import 'react-drawer/lib/react-drawer.css'
import Switch from 'react-switch'
import { t } from 'ttag'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import './css/Aminities.css'

class SPAmenitiesListComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      reload: false,
      propertyId: this.props.propertyId,
      propertyInfoId: this.props.propertyInfoId,
      searchString: '',
      amenitiesData:[],
      availableAmenities: [],
      searchAmenitiesData: [],
      check: true,
      amenitiesObj: {}
    }
    this.handleAminityView = this.handleAminityView.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.handleAmenityData = this.handleAmenityData.bind(this)
  }
  componentWillMount () {
    // this.setState({ propertyInfoId: this.props.propertyInfoId, propertyId: this.props.propertyId })
    let getSpPropertyInfoAmenities = {
      url: config.baseUrl + config.getSPPropertyInfoAmenitiesListAPI + this.props.propertyId + '/' + this.props.propertyInfoId + '/' + this.state.searchString
    }
    let _this = this
    APICallManager.getCall(getSpPropertyInfoAmenities, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          amenitiesData : resObj.data.statusResult,
          searchAmenitiesData: resObj.data.statusResult
        })
        resObj.data.statusResult.map((data, i) => {
          if (data.amenityStatus === 'Available') {
            _this.state.availableAmenities.push(data.amenityName)
          }
        })
      }
    })
  }

  handleAminityView (data) {
    this.setState({ amenitiesObj: data, check: false })
  }

  handleStatusChange (status, data, i) {
    let _this = this
    _this.setState({ reload: false })
    switch (status) {
      case false :
        let index = this.state.availableAmenities.indexOf(data.amenityName)
        _this.state.availableAmenities.splice(index, 1)
        let putSPPropertyInfoAmenityUnavailable = {
          url: config.baseUrl + config.putSPPropertyInfoAmenitiesStatusAPI,
          body: {
            _id: data._id,
            amenityStatus: 'Unavailable',
            availableAmenities: _this.state.availableAmenities,
            propertyInfoId: data.propertyInfoId
          }
        }
        APICallManager.putCall(putSPPropertyInfoAmenityUnavailable, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            _this.state.amenitiesData[i].amenityStatus = 'Unavailable'
            _this.setState({ reload: true })
          }
        })
        break
      case true :
        _this.state.availableAmenities.push(data.amenityName)
        let putSPPropertyInfoAmenityAvailable = {
          url: config.baseUrl + config.putSPPropertyInfoAmenitiesStatusAPI,
          body: {
            _id: data._id,
            amenityStatus: 'Available',
            availableAmenities: _this.state.availableAmenities,
            propertyInfoId: data.propertyInfoId
          }
        }
        APICallManager.putCall(putSPPropertyInfoAmenityAvailable, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            _this.state.amenitiesData[i].amenityStatus = 'Available'
            _this.setState({ reload: true })
          }
        })
        break
    }
  }

  handleSearch = (event) => {
    this.setState({ searchString: event.target.value })
    let searchAmenities = this.state.searchAmenitiesData.filter(function (item) {
      return item.amenityName.indexOf(event.target.value) > -1 || item.amenityType.indexOf(event.target.value) > -1 ||
        item.amenityStatus.indexOf(event.target.value) > -1
    })
    this.setState({ amenitiesData: searchAmenities })
  }
  handleAmenityData (amenityObj, modified) {
    if (modified) {
      let amenitiesData = this.state.amenitiesData
      let availableAmenities = this.state.availableAmenities
      const index = amenitiesData.findIndex(dataObj => dataObj._id === amenityObj._id)
      let isModifiedStatus = this.state.amenitiesData[index].amenityStatus === amenityObj.amenityStatus ? 'false' : 'true'
      amenitiesData[index].amenityStatus = amenityObj.amenityStatus
      amenitiesData[index].amenityType = amenityObj.amenityType
      amenitiesData[index].amenityCharge = amenityObj.amenityCharge
      this.setState({ amenitiesData: amenitiesData })
      if (isModifiedStatus === 'true') {
        if (amenityObj.amenityStatus === 'Available') {
          availableAmenities.push(this.state.amenitiesData[index].amenityName)
        } else {
          let amenitiesAvailableIndex = availableAmenities.findIndex(amenities => amenities === this.state.amenitiesData[index].amenityName)
          availableAmenities.splice(amenitiesAvailableIndex, 1)
        }
        this.setState({ availableAmenities: availableAmenities })
      }
      this.setState({ check: !this.state.check })
    } else {
      this.setState({ check: !this.state.check })
    }
  }
  render () {
    return (
      this.state.check
      ? <div>
        <div className='aminities-list' id='panel'>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-8'>
                <h3 className='mb-0'>{t`lanSPSubTitleAmenitiesList`}</h3>
              </div>
              <div className='col-md-4 mb-4 text-right'>
                {/* -- Search form -- */}
                <form>
                  <div className='form-group mb-0 search-tab'>
                    <div className='input-group input-group-lg input-group-flush'>
                      <div className='input-group-prepend'>
                        <div className='input-group-text'>
                          <span className='fas fa-search' />
                        </div>
                      </div>
                      <input type='search' className='form-control' placeholder={t`lanCommonLabelSearch`} value={this.state.searchString} onChange={(search) => this.handleSearch(search)} />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className='row'>
              { this.state.amenitiesData.length > 0
              ? this.state.amenitiesData.map((data, i) =>
                <div className='col-xl-3 col-md-6' key={i}>
                  <div className='card'>
                    {/* Card body */}
                    <a onClick={() => this.handleAminityView(data)} >
                      <div className='card-body p-3'>
                        <div className='row mb-3'>
                          <div className='col-md-6 col-6'>
                            <img src={data.amenityIconPath ? config.baseUrl + data.amenityIconPath : require('../images/amenities/wifi.png')} className='icon-calendar' />
                          </div>
                          <div className='col-md-6 col-6 text-right'>
                            <p className='card-category'>{data.amenityType}</p>
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-md-8 col-6'>
                            <p className='card-category'>{data.amenityName}</p>
                          </div>
                          <div className='col-md-4 col-6 text-right'>
                            <p className='card-category'>(₹){data.amenityCharge}</p>
                          </div>
                        </div>
                      </div>
                    </a>
                    <div className='card-footer p-2'>
                      <div className='stats'>
                        <Switch
                          className='react-switch'
                          onChange={(status) => this.handleStatusChange(status, data, i)}
                          checked={data.amenityStatus === 'Available'}
                          aria-labelledby='neat-label'
                          height={25}
                          width={50}
                          handleDiameter={20}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : this.state.amenitiesData.length <= 0 ? <h2>{t`lanCommonLabelNoMatchesFound`}</h2> : null
              }
            </div>
          </div>
          {/* ------- Navbar --------- */}
          {/* <div className='header bg-primary pb-6'>
            <div className='container'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitleAmenities`}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div className='container aminities mt--6'>
            <div className='card mb-2'>
              <div className='card-header py-2'>

              </div>

            </div>
          </div> */}
        </div>
      </div>
      : <SPAmenitiesViewComponent amenitiesObj={this.state.amenitiesObj} propertyInfoId={this.state.propertyInfoId} propertyId={this.state.propertyId} handleAmenityData={this.handleAmenityData} />
    )
  }
}

SPAmenitiesListComponent.propTypes = {
  propertyInfoId: PropTypes.any,
  propertyId: PropTypes.any
}

export default SPAmenitiesListComponent
