/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import config from '../../../../../public/config.json'
// import APICallManager from '../../../services/callmanager'
// import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import Switch from 'react-switch'
import { t } from 'ttag'
import Amenities from '../../../../../assets/amenities/amenities.json'
import ADHostsAmenitiesCreateViewComponent from './ADHostsAmenitiesCreateViewComponent'

import '../../css/all.min.css'
import '../../css/argon.min.css'
import '../../css/nucleo.css'
import './css/Aminities.css'

class ADHostsAmenitiesCreateComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      reload: false,
      searchString: '',
      amenitiesData: (props.amenityObj && props.amenityObj.length) ? props.amenityObj : Amenities,
      dummyAmenities: [],
      availableAmenities: props.availableAmenities && props.availableAmenities.length > 0 ? props.availableAmenities : [],
      value: 0,
      component: false,
      amenitiesObj: {},
      errorMessage: '',
      errorClass: false
    }
    this.handleAminityView = this.handleAminityView.bind(this)
    this.handleAmenityCreate = this.handleAmenityCreate.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.handleAminityViewCreate = this.handleAminityViewCreate.bind(this)
    this.handleAminityViewBack = this.handleAminityViewBack.bind(this)
  }

  componentWillMount () {
    this.setState({ errorClass:'label-control text-danger' })
  }

  handleAminityViewCreate (amenitiesmodifiedData, key) {
    this.setState({ errorMessage: '' })
    let amenitiesData = this.state.amenitiesData
    amenitiesData[key].status = amenitiesmodifiedData.amenityStatus
    amenitiesData[key].type = amenitiesmodifiedData.amenityType
    amenitiesData[key].price = amenitiesmodifiedData.charge
    amenitiesData.map((data, i) => {
      if (data.status === 'Available') {
        this.state.availableAmenities.push(data.name)
      }
    })
    this.setState({ component: false, amenitiesData: amenitiesData })
  }
  handleAminityViewBack () {
    this.setState({ component: false })
  }
  handleAmenityCreate () {
    let amenitiesArray = this.state.amenitiesData
    let availableAmenities = this.state.availableAmenities
    this.props.handleAmenitiesChange(true)
    this.props.commonFuntion(amenitiesArray, availableAmenities, '', 'amenities')
    this.setState({ errorClass:'text-success' })
    this.setState({ errorMessage: t`lanSPLabelSuccessAmenitiesCreated` })
  }
  handleAminityView (data, i) {
    this.setState({ component: true, amenitiesObj: data, value: i })
    event.preventDefault()
  }

  handleStatusChange (status, data, i) {
    this.props.handleAmenitiesChange(false)
    this.setState({ errorMessage: '' })
    let _this = this
    _this.setState({ reload: false })
    switch (status) {
      case false :
        let index = this.state.availableAmenities.indexOf(data.name)
        _this.state.availableAmenities.splice(index, 1)
        _this.state.amenitiesData[i].status = 'Unavailable'
        _this.setState({ reload: true })
        break
      case true :
        _this.state.availableAmenities.push(data.name)
        _this.state.amenitiesData[i].status = 'Available'
        _this.setState({ reload: true })
        break
    }
  }

  handleSearch = (event) => {
    this.setState({ searchString: event.target.value })
    let searchAmenities = Amenities.filter(function (item) {
      return item.name.indexOf(event.target.value) > -1 || item.type.indexOf(event.target.value) > -1 ||
      item.status.indexOf(event.target.value) > -1
    })
    this.setState({ amenitiesData: searchAmenities })
  }
  handleEnter (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }
  
  render () {
    return (
    this.state.component === false
    ? <div>
      {/* ------- Navbar --------- */}
      <div className='row'>
        <div className='col-md-8' />
        <div className='col-md-4 mb-3 text-right'>
          <form>
            <div className='form-group mb-0 serach-tab'>
              <div className='input-group input-group-lg input-group-flush'>
                <div className='input-group-prepend'>
                  <div className='input-group-text'>
                    <span className='fas fa-search' />
                  </div>
                </div>
                <input type='search' className='form-control' placeholder={t`lanCommonLabelSearch`} value={this.state.searchString} onChange={(search) => this.handleSearch(search)} onKeyPress={this.handleEnter} />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className='row'>
        { this.state.amenitiesData && this.state.amenitiesData.length > 0
        ? this.state.amenitiesData.map((data, i) =>
          <div className='col-xl-3 col-md-6' key={i}>
            <div className='card'>
              {/* Card body */}
              <a onClick={() => this.handleAminityView(data, i)} >
                <div className='card-body p-3'>
                  <div className='row mb-2'>
                    <div className='col-md-6 col-6'>
                      <img src={data.amenityIconPath ? config.baseUrl + data.amenityIconPath : require('../../images/amenities/wifi.png')} className='icon-calendar' />
                    </div>
                    <div className='col-md-6 col-6 text-right'>
                      <p className='card-category'>{data.type}</p>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-8 col-6'>
                      <p className='card-category'>{data.name}</p>
                    </div>
                    <div className='col-md-4 col-6 text-right'>
                      <p className='card-category'>(₹){data.price}</p>
                    </div>
                  </div>
                </div>
              </a>
              <div className='card-footer p-2'>
                <div className='stats'>
                  <Switch
                    className='react-switch'
                    onChange={(status) => this.handleStatusChange(status, data, i)}
                    checked={data.status === 'Available'}
                    aria-labelledby='neat-label'
                    height={25}
                    width={50}
                    handleDiameter={20}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : this.state.amenitiesData && this.state.amenitiesData.length <= 0 ? <h2>{t`lanCommonLabelNoMatchesFound`}</h2> : null
        }
      </div>
      <div className='container'>
        <div className='text-center'><label className={this.state.errorClass}>{this.state.errorMessage}</label></div>
      </div>
      <div className='row mt-1'>
        <div className='container text-center'>
          <button className='btn btn-primary' onClick={this.handleAmenityCreate} type='submit'>{t`lanCommonButtonCreate`}</button>
        </div>
      </div>

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
          <div className='sp-hotels'>
            <div className='card mb-0'>
              <div className='card-body'>
                <div className='row align-items-center'>
                  <div className='col-auto'>
                    <a href='#' className='rounded-circle'>
                      <img src={require('../images/room1.jpg')} className='avatar rounded-circle' />
                    </a>
                  </div>
                  <div className='col ml--2'>
                    <h4 className='mb-2'>
                      <a href='#'>Test Hotels</a>
                    </h4>
                    <p className='text-sm mb-0'>Hotel - {t`lanCommonButtonCreate`} {t`lanSPTitleAmenities`}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='card-header py-2'>
            <div className='row'>
              <div className='col-md-6'>
                <h3 className='mb-0 mt-3'>{t`lanSPTitleAmenities`} {t`lanCommonButtonCreate`}</h3>
              </div>
              <div className='col-md-6'>
                <form>
                  <div className='form-group mb-0 col-lg-9 serach-tab'>
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
          </div>
          <div className='card-body'></div>
        </div>
      </div> */}
    </div> : <ADHostsAmenitiesCreateViewComponent handleAmenitiesChange={this.props.handleAmenitiesChange} amenitiesObj={this.state.amenitiesObj}
      handleAminityViewCreate={this.handleAminityViewCreate} value={this.state.value} handleAminityViewBack={this.handleAminityViewBack} />
    )
  }
}

ADHostsAmenitiesCreateComponent.propTypes = {
  commonFuntion: PropTypes.any,
  amenityObj: PropTypes.any,
  availableAmenities: PropTypes.any,
  handleAmenitiesChange: PropTypes.any
}

export default ADHostsAmenitiesCreateComponent
