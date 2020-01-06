/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import config from '../../../../../public/config.json'
import ADHostsServiceCreateViewComponent from './ADHostsServiceCreateViewComponent'
import 'react-drawer/lib/react-drawer.css'
import Switch from 'react-switch'
import { t } from 'ttag'
import Services from '../../../../../assets/services/services.json'

import '../../css/all.min.css'
import '../../css/argon.min.css'
import '../../css/nucleo.css'
import './css/Service.css'

class ADHostsServicesCreateComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchString: '',
      servicesData: this.props.serviceObj && this.props.serviceObj.length > 0 ? this.props.serviceObj : Services,
      availableServices: this.props.availableServices && this.props.availableServices.length > 0 ? this.props.availableServices : [],
      errorMessage: '',
      errorClass: false
    }
    this.handleServiceView = this.handleServiceView.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.handleServiceCreate = this.handleServiceCreate.bind(this)
    this.handleServiceModifiedData = this.handleServiceModifiedData.bind(this)
  }

  componentWillMount () {
    this.setState({ errorClass:'label-control text-danger' })
  }
  handleSearch = (event) => {
    this.setState({ searchString: event.target.value })
    let searchServices = this.state.searchServicesData.filter(function (item) {
      return item.serviceName.indexOf(event.target.value) > -1 || item.serviceType.indexOf(event.target.value) > -1 ||
        item.serviceStatus.indexOf(event.target.value) > -1
    })
    this.setState({ servicesData: searchServices })
  }

  handleServiceView (data) {
    this.setState({ isServiceView: !this.state.isServiceView, selectedService: data })
    event.preventDefault()
  }

  handleServiceModifiedData (data, isModified) {
    this.setState({ errorMessage: '' })
    if (isModified) {
      let servicesData = this.state.servicesData
      let availableServices = this.state.availableServices
      const index = servicesData.findIndex(dataObj => dataObj.serviceId === data.serviceId)
      let isModifiedStatus = this.state.servicesData[index].serviceStatus === data.serviceStatus ? 'false' : 'true'
      servicesData[index].serviceStatus = data.serviceStatus
      servicesData[index].serviceType = data.serviceType
      servicesData[index].serviceCharge = data.serviceCharge
      this.setState({ servicesData: servicesData })
      if (isModifiedStatus === 'true') {
        if (data.serviceStatus === 'Available') {
          availableServices.push(this.state.servicesData[index].serviceName)
        } else {
          let availableServicesIndex = availableServices.findIndex(data => data === this.state.servicesData[index].serviceName)
          availableServices.splice(availableServicesIndex, 1)
        }
        this.setState({ availableServices: availableServices })
      }
      this.setState({ isServiceView: !this.state.isServiceView })
    } else {
      this.setState({ isServiceView: !this.state.isServiceView })
    }
  }

  handleServiceCreate () {
    let servicesData = this.state.servicesData
    let availableServices = this.state.availableServices
    this.props.handleServicesChange(true)
    this.props.commonFuntion(servicesData, availableServices, '', 'services')
    this.setState({ errorClass:'text-success' })
    this.setState({ errorMessage: t`lanSPLabelServicesCreatedsuccessfully` })
  }

  handleStatusChange (status, data, i) {
    this.props.handleServicesChange(false)
    this.setState({ errorMessage: '' })
    let availableServices = this.state.availableServices
    if (status) {
      availableServices.push(data.serviceName)
      this.state.servicesData[i].serviceStatus = 'Available'
      this.setState({ availableServices: availableServices })
    } else {
      let index = availableServices.indexOf(data.serviceName)
      availableServices.splice(index, 1)
      this.state.servicesData[i].serviceStatus = 'Unavailable'
      this.setState({ availableServices: availableServices })
    }
  }

  handleSearch = (event) => {
    this.setState({ searchString: event.target.value })
    let searchServices = Services.filter(function (item) {
      return item.serviceName.indexOf(event.target.value) > -1 || item.serviceType.indexOf(event.target.value) > -1 ||
      item.serviceStatus.indexOf(event.target.value) > -1
    })
    this.setState({ servicesData: searchServices })
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
        ? <div>
          <div className='row'>
            <div className='col-md-8'>
              {/* <h3 className='mb-0 mt-3'>{t`lanSPSubTitleServicesList`}</h3> */}
            </div>
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
            { this.state.servicesData.length > 0
              ? this.state.servicesData.map((data, i) =>
                <div className='col-xl-3 col-md-6' key={i}>
                  <div className='card'>
                    {/* Card body */}
                    <a onClick={() => this.handleServiceView(data)} >
                      <div className='card-body p-3'>
                        <div className='row mb-3'>
                          <div className='col-md-6 col-6'>
                            <img src={(data && data.serviceIconPath) ? config.baseUrl + data.serviceIconPath : require('../../images/services/car.png')} className='icon-calendar' />
                          </div>
                          <div className='col-md-6 col-6 text-right'>
                            <p className='card-category'>{data.serviceType}</p>
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-md-8 col-6'>
                            <p className='card-category'>{data.serviceName}</p>
                          </div>
                          <div className='col-md-4 col-6 text-right'>
                            <p className='card-category'>(₹){data.serviceCharge}</p>
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
          <div className='container text-center'>
            <label className={this.state.errorClass}>{this.state.errorMessage}</label>
          </div>
          <div className='container mt-1'>
            <div className='text-center'>
              <button className='btn btn-primary' onClick={this.handleServiceCreate} type='submit'>{t`lanCommonButtonCreate`}</button>
            </div>
          </div>
          {/* <div className='header bg-primary pb-6'>
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitleServices`}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div className='container-fluid aminities mt--6'>
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
                        <p className='text-sm mb-0'>Hotel - {t`lanSPLabelCreateServices`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='card-header mx-4 py-2'>
                <div className='row'>
                  <div className='col-md-6'>
                    <h3 className='mb-0 mt-3'>{t`lanSPSubTitleServicesList`}</h3>
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
              <div className='card-body'>

              </div>
            </div>
          </div> */}
        </div>
          : <ADHostsServiceCreateViewComponent handleServicesChange={this.props.handleServicesChange} selectedService={this.state.selectedService} handleServiceModifiedData={this.handleServiceModifiedData} />
        }
      </div>
    )
  }
}
ADHostsServicesCreateComponent.propTypes = {
  commonFuntion: PropTypes.any,
  serviceObj: PropTypes.any,
  availableServices: PropTypes.any,
  handleServicesChange: PropTypes.any
}
export default ADHostsServicesCreateComponent
