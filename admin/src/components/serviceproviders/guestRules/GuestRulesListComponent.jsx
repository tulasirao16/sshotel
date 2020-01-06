/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
// import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import Switch from 'react-switch'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import { t } from 'ttag'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import './css/Service.css'

class SPGuestRulesListComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      checked: false,
      component: false,
      propertyId: this.props.propertyId,
      propertyInfoId : this.props.propertyInfoId,
      guestRulesData: [],
      searchguestRulesData: [],
      searchString: '',
      reload: false,
      guestRulesNotes: '',
      GuestRulesAvaliable: [],
      updatedGuestRulesArray: []
    }
    this.handleStatusChange = this.handleStatusChange.bind(this)
  }
  componentWillMount () {
    let getSpPropertyInfoGuestRulesList = {
      url: config.baseUrl + config.getSPPropertyInfoGuestRulesListAPI + this.state.propertyId + '/' + this.state.propertyInfoId + '/' + this.state.searchString
    }
    let _this = this
    APICallManager.getCall(getSpPropertyInfoGuestRulesList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        let resData = resObj.data.statusResult
        _this.setState({
          guestRulesData: resData,
          searchguestRulesData: resData,
          guestRulesNotes: resData.length > 0 && resData[0].propertyInfoId && resData[0].propertyInfoId.guestRulesNotes ? resData[0].propertyInfoId.guestRulesNotes : ''
        })
      }
      resObj.data.statusResult.map((data, i) => {
        if (data.ruleStatus === 'Active') {
          _this.state.GuestRulesAvaliable.push(data.ruleName)
        }
      })
    })
  }

  // handleBack = () => {
  //   hashHistory.push('host/property-view')
  //   event.preventDefault()
  // }

  handleSearch = (event) => {
    this.setState({ searchString: event.target.value })
    let searchGuestRules = this.state.searchguestRulesData.filter(function (item) {
      return item.ruleName.indexOf(event.target.value) > -1 || item.ruleStatus.indexOf(event.target.value) > -1
    })
    this.setState({ guestRulesData: searchGuestRules })
  }

  handleStatusChange (status, data, i) {
    let _this = this
    _this.setState({ reload: false })
    let x = _this.state.GuestRulesAvaliable
    let GuestRulesAvaliable = x.indexOf(data.ruleName)
    let modificationData = data
    let y = _this.state.updatedGuestRulesArray
    const index = y.findIndex(dataObj => dataObj._id === data._id)
    if (index < 0) {
      status === true ? modificationData.ruleStatus = 'Active' : modificationData.ruleStatus = 'Inactive'
      y.push(modificationData)
      _this.state.guestRulesData[i].ruleStatus = status === true ? 'Active' : 'Inactive'
      if (GuestRulesAvaliable === -1) {
        x.push(data.ruleName)
      } else {
        x.splice(GuestRulesAvaliable, 1)
      }
    } else {
      y.splice(index, 1)
      _this.state.guestRulesData[i].ruleStatus = status === true ? 'Active' : 'Inactive'
      if (GuestRulesAvaliable === -1) {
        x.push(data.ruleName)
      } else {
        x.splice(GuestRulesAvaliable, 1)
      }
    }
  }

  handleGuestrulesUpdate = () => {
    if (this.state.updatedGuestRulesArray.length <= 0 && this.state.guestRulesNotes === this.state.guestRulesData[0].propertyInfoId.guestRulesNotes) {
      // hashHistory.push('host/property-view')
      event.preventDefault()
    } else {
      let putSPPropertyInfoGuestRulesStatus = {
        url: config.baseUrl + config.putSPPropertyInfoGuestRulesEditAPI,
        body: {
          propertyId: this.state.propertyId,
          propertyInfoId: this.state.propertyInfoId,
          guestRulesAvaliable: this.state.GuestRulesAvaliable,
          guestRulesNotes: this.state.guestRulesNotes,
          updatedGuestRulesArray: this.state.updatedGuestRulesArray
        }
      }
      let _this = this
      APICallManager.putCall(putSPPropertyInfoGuestRulesStatus, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ reload: true, errorMessage: t`lanSPLabelSuccessGuestRulesUpdated` })
        }
      })
    }
  }

  render () {
    return (
      <div>
        <div className='guestrules-list' id='panel'>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-8'>
                <h3 className='mb-0'>{t`lanSPTitleGuestRules`} {t`lanSPTitleList`}</h3>
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
              {this.state.guestRulesData.length > 0
              ? this.state.guestRulesData.map((data, i) =>
                <div className='col-xl-3 col-md-6' key={i}>
                  <div className='card'>
                    {/* Card body */}
                    <div className='card-body'>
                      <div className='row mb-3'>
                        <div className='col-md-4 col-6'>
                          <img src={data.ruleIconPath ? config.baseUrl + data.ruleIconPath : require('../images/guestrules/noalcohol.png')} className='icon-calendar' />
                        </div>
                        <div className='col-md-8 col-6 text-right'>
                          <p className='card-category'>{data.ruleStatus === 'Active' ? 'Allowed' : 'Not Allowed'}</p>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-8 col-6'>
                          <p className='card-category'>{data.ruleName}</p>
                        </div>
                        <div className='col-md-4 col-6'>
                          <div className='stats'>
                            <Switch
                              className='react-switch'
                              onChange={(status) => this.handleStatusChange(status, data, i)}
                              checked={data.ruleStatus === 'Active'}
                              aria-labelledby='neat-label'
                              height={25}
                              width={50}
                              handleDiameter={20}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : <h2>{t`lanCommonLabelNoMatchesFound`}</h2> }
            </div>
            <div className='row mt-4'>
              <div className='col-xl-3 col-md-6'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPLabelMakeanote`}</label>
                  <textarea className='form-control' placeholder={t`lanSPLabelMakeanote`} value={this.state.guestRulesNotes} onChange={(e) => this.setState({ guestRulesNotes: e.target.value })} rows='3' />
                </div>
              </div>
            </div>
            <div style={{ color: 'red' }}>
              {this.state.errorMessage}
            </div>
            <div className='row mt-1'>
              <div className='col-xl-3 col-md-6'>
                {/* <button className='btn btn-primary' onClick={this.handleBack} type='submit'>{t`lanCommonButtonBack`}</button> */}
                <button className='btn btn-primary' onClick={this.handleGuestrulesUpdate} type='submit'>{t`lanCommonButtonUpdate`}</button>
              </div>
            </div>
          </div>
          {/* ------- Navbar --------- */}
          {/* <div className='header bg-primary pb-6'>
            <div className='container'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitleGuestRules`}</h6>
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
                        <p className='text-sm mb-0'>Hotel - {t`lanSPTitleGuestRules`}</p>
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
      </div>
    )
  }
}
SPGuestRulesListComponent.propTypes = {
  propertyId: PropTypes.any,
  propertyInfoId: PropTypes.any
}

export default SPGuestRulesListComponent
