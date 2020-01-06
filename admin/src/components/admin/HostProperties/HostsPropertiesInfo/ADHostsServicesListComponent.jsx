/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import config from '../../../../../public/config.json'
import APICallManager from '../../../../services/callmanager'
import ADHostsServiceViewComponent from './ADHostsServiceViewComponent'
// import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import Switch from 'react-switch'
import { t } from 'ttag'

import '../../css/all.min.css'
import '../../css/argon.min.css'
import '../../css/nucleo.css'
import './css/Service.css'

class ADHostsServicesListComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      checked: false,
      propertyTitle: '',
      propertyType: '',
      propertyId: this.props.propertyId,
      propertyInfoId: this.props.propertyInfoId,
      searchString: '',
      servicesData: [],
      searchServicesData: [],
      isServiceView :  false,
      selectedService: {},
      servicesAvailable: [],
      reload: false
    }
    this.handleServiceView = this.handleServiceView.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.handleServiceModifiedData = this.handleServiceModifiedData.bind(this)
  }

  componentWillMount () {
    let getSpPropertyInfoAmenities = {
      url: config.baseUrl + config.getADHostsPropertyInfoServicesListAPI + this.state.propertyInfoId
    }
    let _this = this
    APICallManager.getCall(getSpPropertyInfoAmenities, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          servicesData : resObj.data.statusResult,
          searchServicesData: resObj.data.statusResult,
          propertyTitle: resObj.data.statusResult[0].propertyTitle,
          propertyType: resObj.data.statusResult[0].propertyType
        })
        resObj.data.statusResult.map((data, i) => {
          if (data.serviceStatus === 'Available') {
            _this.state.servicesAvailable.push(data.serviceName)
          }
        })
      }
    })
  }

  handleSearch = (event) => {
    this.setState({ searchString: event.target.value })
    let searchServices = this.state.searchServicesData.filter(function (item) {
      return item.serviceName.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1 || item.serviceType.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1 ||
        item.serviceStatus.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
    })
    this.setState({ servicesData: searchServices })
  }
  handleServiceView (data) {
    this.setState({ isServiceView: !this.state.isServiceView, selectedService: data })
    event.preventDefault()
  }
  handleStatusChange (status, data, i) {
    let servicesAvailable = this.state.servicesAvailable
    if (status) {
      servicesAvailable.push(data.serviceName)
      let putSPPropertyInfoServiceStatus = {
        url: config.baseUrl + config.putADHostsPropertyInfoServicesStatusAPI,
        body: {
          _id: data._id,
          propertyInfoId: this.state.propertyInfoId,
          serviceStatus: 'Available'
        }
      }
      let _this = this
      APICallManager.putCall(putSPPropertyInfoServiceStatus, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.state.servicesData[i].serviceStatus = 'Available'
          _this.setState({ servicesAvailable: servicesAvailable })
        }
      })
    } else {
      let servicesAvailableIndex = servicesAvailable.indexOf(data.serviceName)
      servicesAvailable.splice(servicesAvailableIndex, 1)
      let putSPPropertyInfoServiceStatus = {
        url: config.baseUrl + config.putADHostsPropertyInfoServicesStatusAPI,
        body: {
          _id: data._id,
          propertyInfoId: this.state.propertyInfoId,
          serviceStatus: 'Unavailable'
        }
      }
      let _this = this
      APICallManager.putCall(putSPPropertyInfoServiceStatus, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.state.servicesData[i].serviceStatus = 'Unavailable'
          _this.setState({ servicesAvailable: servicesAvailable })
        }
      })
    }
  }
  handleServiceModifiedData (data, isModified) {
    if (isModified) {
      let servicesData = this.state.servicesData
      let servicesAvailable = this.state.servicesAvailable
      const index = servicesData.findIndex(dataObj => dataObj._id === data._id)
      let isModifiedStatus = this.state.servicesData[index].serviceStatus === data.serviceStatus ? 'false' : 'true'
      servicesData[index].serviceStatus = data.serviceStatus
      servicesData[index].serviceType = data.serviceType
      servicesData[index].serviceCharge = data.serviceCharge
      this.setState({ servicesData: servicesData })
      if (isModifiedStatus === 'true') {
        if (data.serviceStatus === 'Available') {
          servicesAvailable.push(this.state.servicesData[index].serviceName)
        } else {
          let servicesAvailableIndex = servicesAvailable.findIndex(services => services === this.state.servicesData[index].serviceName)
          servicesAvailable.splice(servicesAvailableIndex, 1)
        }
        this.setState({ servicesAvailable: servicesAvailable })
      }
      this.setState({ isServiceView: !this.state.isServiceView })
    } else {
      this.setState({ isServiceView: !this.state.isServiceView })
    }
  }
  handleEnter (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }

  render () {
    return (
      <div>
        {/* ------- Navbar --------- */}
        {!this.state.isServiceView
          ? <div className='services-list'>
            <div className='card-body'>
              <div className='row'>
                <div className='col-md-8'>
                  <h3 className='mb-0'>{t`lanSPSubTitleServicesList`}</h3>
                </div>
                <div className='col-md-4 mb-4 text-right'>
                  <form>
                    <div className='form-group mb-0 search-tab'>
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
                { this.state.servicesData.length > 0
                  ? this.state.servicesData.map((data, i) =>
                    <div className='col-xl-3 col-md-6' key={i}>
                      <div className='card'>
                        {/* Card body */}
                        <a onClick={() => this.handleServiceView(data)} >
                          <div className='card-body p-3'>
                            <div className='row mb-2'>
                              <div className='col-md-6 col-6'>
                                <img src={(data && data.serviceIconPath) ? config.baseUrl + data.serviceIconPath : require('../../images/services/car.png')} className='icon-calendar' />
                              </div>
                              <div className='col-md-6 col-6 text-right'>
                                <p className='card-category'>(₹){data.serviceCharge}</p>
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col-md-8 col-6'>
                                <p className='card-category'>{data.serviceName}</p>
                              </div>
                              <div className='col-md-4 col-6 text-right'>
                                <p className='card-category'>{data.serviceType}</p>
                              </div>
                            </div>
                          </div>
                        </a>
                        <div className='card-footer p-2'>
                          <div className='stats'>
                            <Switch
                              className='react-switch'
                              onChange={(status) => this.handleStatusChange(status, data, i)}
                              checked={data.serviceStatus === 'Available'}
                              aria-labelledby='neat-label'
                              height={25}
                              width={50}
                              handleDiameter={20}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : this.state.servicesData.length <= 0 ? <h2>{t`lanCommonLabelNoMatchesFound`}</h2> : null
                  }
              </div>
            </div>
            {/* <div className='header bg-primary pb-6'>
              <div className='container'>
                <div className='header-body'>
                  <div className='row align-items-center py-4'>
                    <div className='col-lg-6 col-7'>
                      <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitleServices`}</h6>
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
                            <a href='#'>{this.state.propertyTitle}</a>
                          </h4>
                          <p className='text-sm mb-0'>{this.state.propertyType} - {t`lanSPSubTitleServicesList`}</p>
                        </div>
                      </div>
                    </div>
                   </div>
                </div>
                <div className='card-header mx-4 py-2'>
                </div>
              </div>
            </div> */}
          </div>
          // : ''
          : <ADHostsServiceViewComponent selectedService={this.state.selectedService} handleServiceModifiedData={this.handleServiceModifiedData} />
        }
      </div>
    )
  }
}

ADHostsServicesListComponent.propTypes = {
  propertyInfoId: PropTypes.any,
  propertyId: PropTypes.any
}

export default ADHostsServicesListComponent
