/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import EUProfileSideMenu from './EUProfileSideMenu'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import { t } from 'ttag'
import './css/Profile.css'

class EUProfilePreferenceComponent extends React.Component {
  constructor () {
    super()
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    this.state = {
      authObj: JSON.parse(localStorage.getItem('authObj')),
      preferences: authObj.preferences,
      defaultLanguage: authObj.preferences.defaultLanguage,
      defaultTimezone: authObj.preferences.defaultTimezone,
      defaultCurrency: authObj.preferences.defaultCurrency,
      dateFormat: authObj.preferences.dateFormat,
      errorMessage: ''
    }
    this.handleUpdate = this.handleUpdate.bind(this)
  }
  componentWillMount () {
  }

  handleUpdate () {
    let _this = this
    let preferences = this.state.preferences
    let newAuthObj = this.state.authObj
    if (preferences.defaultLanguage !== this.state.defaultLanguage ||
    preferences.defaultTimezone !== this.state.defaultTimezone ||
    preferences.defaultCurrency !== this.state.defaultCurrency ||
    preferences.dateFormat !== this.state.dateFormat) {
      let putData = {
        defaultLanguage: this.state.defaultLanguage,
        defaultTimezone: this.state.defaultTimezone,
        defaultCurrency: this.state.defaultCurrency,
        dateFormat: this.state.dateFormat
      }
      let obj = { url: config.baseUrl + config.putEUProfilePreferencesUpdateAPI + 'id', body: putData }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          newAuthObj.preferences.defaultLanguage = _this.state.defaultLanguage
          newAuthObj.preferences.defaultTimezone = _this.state.defaultTimezone
          newAuthObj.preferences.defaultCurrency = _this.state.defaultCurrency
          newAuthObj.preferences.dateFormat = _this.state.dateFormat
          localStorage.setItem('authObj', JSON.stringify(newAuthObj))
          _this.setState({ authObj: newAuthObj })
          alert('Preferences updated successfully')
          hashHistory.push('/profile')
        } else {
          alert('Preferences update failed')
        }
      })
    } else {
      hashHistory.push('/profile')
    }
  }

  render () {
    return (
      <div className='main-content' id='panel'>
        <div className='container-fluid mt-5 pb-5'>
          <div className='row'>
            <div className='col-lg-3' >
              <EUProfileSideMenu authObj={this.state.authObj} />
            </div>
            <div className='col-lg-8' >
              <div className='edit-profile-info preference'>
                <div className='card'>
                  <div className='card-header card-header-danger'>
                    <h4 className='card-title'>{ t`lanEUTitlePreferences` }</h4>
                  </div>
                  <div className='edit-profile-form'>
                    <div className='card-body'>
                      <form>
                        <div className='form-group row'>
                          <label className='col-md-3 col-form-label form-control-label'>{ t`lanCommonLabelLanguage` } <span className='mandatory'>*</span></label>
                          <div className='col-md-5'>
                            <select className='form-control' id='defaultLanguage' value={this.state.defaultLanguage} onChange={() => this.setState({ defaultLanguage: event.target.value, errorMessage: '' })}>
                              <option value='English'>English</option>
                              <option value='Hindi'>Hindi</option>
                              <option value='Telugu'>Telugu</option>
                            </select>
                          </div>
                        </div>
                        <div className='form-group row'>
                          <label className='col-md-3 col-form-label form-control-label'>{ t`lanCommonLabelTimezone` } <span className='mandatory'>*</span></label>
                          <div className='col-md-5'>
                            <select multiple='' className='form-control' id='defaultTimezone' value={this.state.defaultTimezone} onChange={() => this.setState({ defaultTimezone: event.target.value, errorMessage: '' })}>
                              <option value='IST'>IST - Indian Standard Time (UTC+05:30)</option>
                              <option value='EST'>EST - Eastern Standard Time (UTC-05:00)</option>
                              <option value='EDT'>EDT - Eastern Daylight Time (UTC-04:00)</option>
                            </select>
                          </div>
                        </div>
                        <div className='form-group row'>
                          <label className='col-md-3 col-form-label form-control-label'>{ t`lanCommonLabelCurrency` } <span className='mandatory'>*</span></label>
                          <div className='col-md-5'>
                            <select className='form-control' id='defaultCurrency' value={this.state.defaultCurrency} onChange={() => this.setState({ defaultCurrency: event.target.value, errorMessage: '' })}>
                              <option value='INR'>INR - Indian Rupee(₹)</option>
                              <option value='USD'>USD - US Dollar($)</option>
                              <option value='EUR'>EUR - Euro(€)</option>
                            </select>
                          </div>
                        </div>
                        <div className='form-group row'>
                          <label className='col-md-3 col-form-label form-control-label'>{ t`lanCommonLabelDateFormat` } <span className='mandatory'>*</span></label>
                          <div className='col-md-5'>
                            <select multiple='' className='form-control' id='dateFormat' value={this.state.dateFormat} onChange={() => this.setState({ dateFormat: event.target.value, errorMessage: '' })}>
                              <option value='DD-MM-YY'>DD-MM-YY</option>
                              <option value='DD-MM-YYYY'>DD-MM-YYYY</option>
                              <option value='DD/MM/YY'>DD/MM/YY</option>
                              <option value='DD/MM/YYYY'>DD/MM/YYYY</option>
                              <option value='MMM DD, YY'>MMM DD, YY</option>
                              <option value='MMM DD, YYYY'>MMM DD, YYYY</option>
                            </select>
                          </div>
                        </div>
                      </form>
                      <div className=' row'>
                        <div className='col-sm-12 text-left' >
                          <a className='btn btn-primary text-white' onClick={this.handleUpdate}>{ t`lanCommonButtonUpdate` }</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EUProfilePreferenceComponent
