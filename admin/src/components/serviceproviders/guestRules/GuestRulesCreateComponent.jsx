/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import 'react-drawer/lib/react-drawer.css'
import Switch from 'react-switch'
import config from '../../../../public/config.json'
// import APICallManager from '../../../services/callmanager'
import { t } from 'ttag'
import GuestRules from '../../../../assets/guestrules/guestRules.json'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import './css/Service.css'

class SPGuestRulesCreateComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      guestRulesData: this.props.guestRulesObj && this.props.guestRulesObj.length > 0 ? this.props.guestRulesObj : GuestRules,
      searchguestRulesData: this.props.guestRulesObj && this.props.guestRulesObj.length > 0 ? this.props.guestRulesObj : GuestRules,
      searchString: '',
      guestRulesNotes: this.props.guestRuleNote ? this.props.guestRuleNote : '',
      GuestRulesAvaliable: this.props.availableGuestRules && this.props.availableGuestRules.length > 0 ? this.props.availableGuestRules : [],
      reload: false,
      errorMessage: '',
      errorClass: false
    }
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.handleGuestRulesCreate = this.handleGuestRulesCreate.bind(this)
  }

  componentWillMount () {
    this.setState({ errorClass:'label-control text-danger' })
  }

  handleSearch = (event) => {
    this.setState({ searchString: event.target.value })
    let searchGuestRules = this.state.searchguestRulesData.filter(function (item) {
      return item.ruleName.indexOf(event.target.value) > -1 || item.ruleStatus.indexOf(event.target.value) > -1
    })
    this.setState({ guestRulesData: searchGuestRules })
  }
  handleStatusChange (status, data, i) {
    this.setState({ errorMessage: '' })
    this.props.handleGuestRulesChange(false)
    let GuestRules = this.state.guestRulesData
    if (status) {
      this.state.GuestRulesAvaliable.push(data.ruleName)
      GuestRules[i].ruleStatus = 'Active'
      this.setState({ guestRulesData: GuestRules })
    } else {
      let indexGuestRulesAvaliable = this.state.GuestRulesAvaliable.indexOf(data.ruleName)
      this.state.GuestRulesAvaliable.splice(indexGuestRulesAvaliable, 1)
      GuestRules[i].ruleStatus = 'Inactive'
      this.setState({ guestRulesData: GuestRules })
    }
  }
  handleGuestRulesCreate () {
    let guestRulesData = this.state.guestRulesData
    let GuestRulesAvaliable = this.state.GuestRulesAvaliable
    this.props.handleGuestRulesChange(true)
    this.props.commonFuntion(guestRulesData, GuestRulesAvaliable, this.state.guestRulesNotes, 'guestRules')
    this.setState({ errorClass:'text-success' })
    this.setState({ errorMessage: t`lanSPLabelSuccessGuestRulesCreated` })
  }
  render () {
    return (
      <div>
        <div className='row'>
          <div className='col-md-8'>
            {/* <h3 className='mb-0 mt-3'>{t`lanSPTitleGuestRules`} {t`lanCommonButtonCreate`}</h3> */}
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
          <div className='col-xl-4 col-md-6'>
            <div className='form-group'>
              <label className='form-control-label'>{t`lanSPLabelMakeanote`}</label>
              <textarea className='form-control' placeholder={t`lanSPLabelMakeanote`}
                value={this.state.guestRulesNotes} onChange={(e) => this.setState({ guestRulesNotes: e.target.value, errorMessage: '' })} rows='3' />
            </div>
          </div>
        </div>
        <div className='conatiner text-center'>
          <label className={this.state.errorClass}>{this.state.errorMessage}</label>
        </div>
        <div className='container mt-1'>
          <div className='text-center'>
            <button className='btn btn-primary' onClick={this.handleGuestRulesCreate} type='submit'>{t`lanCommonButtonCreate`}</button>
          </div>
        </div>

        {/* <div className='main-content' id='panel'>
          <div className='header bg-primary pb-6'>
            <div className='container'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitleGuestRules`}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container aminities mt--6'>
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
              <div className='card-body'>

              </div>
            </div>
          </div>
        </div> */}
      </div>
    )
  }
}
SPGuestRulesCreateComponent.propTypes = {
  commonFuntion: PropTypes.any,
  guestRulesObj: PropTypes.any,
  availableGuestRules: PropTypes.any,
  guestRuleNote: PropTypes.any,
  handleGuestRulesChange: PropTypes.any
}

export default SPGuestRulesCreateComponent
