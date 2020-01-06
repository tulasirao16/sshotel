/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import 'react-drawer/lib/react-drawer.css'
import '../css/signup.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPSignupUserAddressComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      area: '',
      city: '',
      zip: '',
      areaLocality: '',
      landmark: '',
      state: '',
      address: '',
      errorMessage: ''
    }
    this.handleBack = this.handleBack.bind(this)
    this.handleSignupSubmit = this.handleSignupSubmit.bind(this)
  }

  handleBack () {
    hashHistory.push('/host/signup')
    event.preventDefault()
  }
  handleSignupSubmit () {
    if (!this.state.area.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorAreaRequired` })
    } else if (!this.state.city.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorCityRequired` })
    } else if (!this.state.zip.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorPinCodeRequired` })
    } else if (!this.state.state.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorSateRequired` })
    } else if (!this.state.address.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorAdressRequired` })
    } else {
      // let userData = JSON.parse(localStorage.getItem(''))
    }
    event.preventDefault()
  }

  render () {
    return (
      <div>
        <div className='container pb-5 content'>
          <div className='row justify-content-center'>
            <div className='col-lg-10 col-md-12'>
              <div className='card border-0 mb-0'>
                <div className='card-header bg-transparent pb-3'>
                  <h5 className='card-title'>{t`lanSPTitleSignupLocation`}</h5>
                </div>
                <div className='card-body px-lg-4 py-lg-4'>
                  <form role='form'>
                    <div className='row'>
                      <div className='col-md-4'>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanCommonLabelArea`}*</label>
                          <input type='text' autoFocus className='form-control' maxLength={30} onChange={(e) => this.setState({ area: e.target.value, errorMessage: '' })} />
                        </div>
                      </div>
                      <div className='col-md-4'>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanCommonLabelCity`}*</label>
                          <input type='text' className='form-control' maxLength={30} onChange={(e) => this.setState({ city: e.target.value, errorMessage: '' })} />
                        </div>
                      </div>
                      <div className='col-md-4'>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanCommonLabelZip`}*</label>
                          <input type='text' className='form-control' maxLength={6} onChange={(e) => this.setState({ zip: e.target.value, errorMessage: '' })} />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-4'>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanSPLabelAreaLocality`}</label>
                          <input type='text' className='form-control' maxLength={30} onChange={(e) => this.setState({ areaLocality: e.target.value, errorMessage: '' })} />
                        </div>
                      </div>
                      <div className='col-md-4'>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanCommonLabelLandmark`}</label>
                          <input type='text' className='form-control' maxLength={40} onChange={(e) => this.setState({ landmark: e.target.value, errorMessage: '' })} />
                        </div>
                      </div>
                      <div className='col-md-4'>
                        <div className='form-group'>
                          <label className='form-control-label'>{t`lanCommonLabelState`}*</label>
                          <select className='form-control' value={this.state.state} onChange={(e) => this.setState({ state: e.target.value, errorMessage: '' })} >
                            <option value=''>{ t`lanCommonLabelSelectState` }</option>
                            <option value='Telangana'>Telangana</option>
                            <option value='Andhra Pradesh'>Andhra Pradesh</option>
                            <option value='Tamilnadu'>Tamilnadu</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-8'>
                        <div className='form-group'>
                          <label>{t`lanCommonLabelAddress`}*</label>
                          <textarea className='form-control textarea'={t`lanCommonLabelAddress`} value={this.state.address} onChange={(e) => this.setState({ address: e.target.value, errorMessage: '' })} />
                        </div>
                      </div>
                    </div>
                    <label className='text-danger'>{this.state.errorMessage}</label>
                    <div className='text-center mb-4'>
                      <button type='button' onClick={this.handleBack} className='btn btn-primary mt-2'>{t`lanCommonButtonBack`}</button>
                      <button type='button' onClick={this.handleSignupSubmit} className='btn btn-primary mt-2'>{t`lanSPButtonSignup`}</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SPSignupUserAddressComponent
