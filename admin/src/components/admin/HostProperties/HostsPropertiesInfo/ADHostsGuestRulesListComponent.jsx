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
import config from '../../../../../public/config.json'
import APICallManager from '../../../../services/callmanager'
import { t } from 'ttag'

import '../../css/all.min.css'
import '../../css/argon.min.css'
import '../../css/nucleo.css'
import './css/GuestRules.css'

class ADHostsGuestRulesListComponent extends React.Component {
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
      updatedGuestRulesArray: [],
      sucessMessages: '',
      id: this.props.propertyId
    }
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }
  componentWillMount () {
    let getSpPropertyInfoGuestRulesList = {
      url: config.baseUrl + config.getADHostsPropertyInfoRulesListAPI + this.state.propertyInfoId + '/' + this.state.propertyId + '/' + this.state.searchString
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

  handleSearch = (event) => {
    this.setState({ searchString: event.target.value })
    let searchGuestRules = this.state.searchguestRulesData.filter(function (item) {
      return item.ruleName.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1 || item.ruleStatus.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
    })
    this.setState({ guestRulesData: searchGuestRules })
  }

  handleStatusChange (status, data, i) {
    let _this = this
    _this.setState({ reload: false })
    let GuestRulesAvaliable = _this.state.GuestRulesAvaliable
    if (status) {
      GuestRulesAvaliable.push(data.ruleName)
      let putADPropertyInfoRulesStatus = {
        url: config.baseUrl + config.putADHostsPropertyInfoRulesStatusAPI,
        body: {
          _id: data._id,
          propertyInfoId: _this.state.propertyInfoId,
          ruleStatus: 'Active'
        }
      }
      APICallManager.putCall(putADPropertyInfoRulesStatus, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.state.guestRulesData[i].ruleStatus = 'Active'
          _this.setState({ GuestRulesAvaliable: GuestRulesAvaliable })
        }
      })
    } else {
      let rulesAvailableIndex = GuestRulesAvaliable.indexOf(data.ruleName)
      GuestRulesAvaliable.splice(rulesAvailableIndex, 1)
      let putADPropertyInfoRulesStatus = {
        url: config.baseUrl + config.putADHostsPropertyInfoRulesStatusAPI,
        body: {
          _id: data._id,
          propertyInfoId: this.state.propertyInfoId,
          ruleStatus: 'Inactive'
        }
      }
      let _this = this
      APICallManager.putCall(putADPropertyInfoRulesStatus, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.state.guestRulesData[i].ruleStatus = 'Inactive'
          _this.setState({ GuestRulesAvaliable: GuestRulesAvaliable })
        }
      })
    }
  }

  handleGuestrulesUpdate = () => {
    if (this.state.updatedGuestRulesArray.length <= 0 && this.state.guestRulesNotes === this.state.guestRulesData[0].propertyInfoId.guestRulesNotes) {
      // hashHistory.push('host/property-view')
      event.preventDefault()
    } else {
      let putSPPropertyInfoGuestRulesStatus = {
        url: config.baseUrl + config.putADHostsPropertyInfoGuestRulesEditAPI,
        body: {
          propertyId: this.state.propertyId,
          _id: this.state.propertyInfoId,
          guestRulesNotes: this.state.guestRulesNotes
        }
      }
      let _this = this
      APICallManager.putCall(putSPPropertyInfoGuestRulesStatus, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ reload: true, sucessMessages: t`lanSPLabelSuccessGuestRulesUpdated` })
        }
      })
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
                      <input type='search' className='form-control' placeholder={t`lanCommonLabelSearch`} value={this.state.searchString} onChange={(search) => this.handleSearch(search)} onKeyPress={this.handleEnter} />
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
                          <img src={data.ruleIconPath ? config.baseUrl + data.ruleIconPath : require('../../images/guestrules/noalcohol.png')} className='icon-calendar' />
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
            <div style={{ color: 'green' }}>
              {this.state.sucessMessages}
            </div>
            <div className='row mt-1'>
              <div className='col-xl-3 col-md-6'>
                <button className='btn btn-primary' onClick={this.handleGuestrulesUpdate} type='submit'>{t`lanCommonButtonUpdate`}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
ADHostsGuestRulesListComponent.propTypes = {
  propertyId: PropTypes.any,
  propertyInfoId: PropTypes.any
}

export default ADHostsGuestRulesListComponent
