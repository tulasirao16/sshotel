/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import PropTypes from 'prop-types'
import { fetch as fetchPolyfill } from 'whatwg-fetch'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import { hashHistory } from 'react-router'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

class EUProfileIdProofCreateComponent extends React.Component {
  constructor () {
    super()
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    this.state = {
      reload: false,
      authObj: authObj,
      idProofSatus: false,
      file: [],
      imgsrc: [],
      idImagePath: '',
      filename: '',
      idType: '',
      idNumber: '',
      nameOnId: '',
      dobOnId: '',
      idStatus: 'Not-Verified',
      submitDisabled: false,
      errorMessage: ''
    }
    this.onFileChange = this.onFileChange.bind(this)
    this.handleIdTypeValidation = this.handleIdTypeValidation.bind(this)
    this.handleCreateIdProof = this.handleCreateIdProof.bind(this)
  }
  componentWillMount () {
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    this.setState({
      authObj: authObj,
      name: authObj.name
    })
  }

  onFileChange (e) {
    this.setState({ file: e.target.files[0], filename:e.target.files[0].name })
    var file = e.target.files[0]
    var fileType = file.type ? file.type.split('/')[0] : ''
    if (fileType !== 'image') {
      this.setState({ errorMessage: t`lanEULabelErrorUploadValidImage` })
    } else {
      var reader = new FileReader()
      var url = reader.readAsDataURL(file)
      reader.onloadend = function (e) {
        this.setState({
          imgsrc: [reader.result], errorMessage: ''
        })
      }.bind(this)
      console.log(url)
    }
  }
  handleIdTypeValidation (event) {
    let idType = event.target.value
    let userObj = {
      unBlockStatus: true,
      url: config.baseUrl + config.getEUProfileIdTypeValidateAPI + idType
    }
    let _this = this
    APICallManager.getCall(userObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        let idProofData = resObj.data.statusResult
        _this.setState({
          idProofSatus: true,
          filename : '',
          file: [],
          imgsrc: [],
          idImagePath: idProofData.kycImageOriginalName,
          idType: idProofData.idType,
          idNumber: idProofData.idNumber,
          dobOnId: idProofData.dobOnId,
          nameOnId: idProofData.nameOnId,
          idStatus: idProofData.idStatus,
          errorMessage: t`lanEULabelErrorIdProofAdded`,
          reload: true
        })
      } else {
        _this.setState({
          idType: idType,
          idImagePath: '',
          idNumber: '',
          dobOnId: '',
          idProofSatus: false,
          idStatus: 'Not-Verified',
          errorMessage: '',
          reload: true })
      }
    })
  }

  handleCreateIdProof () {
    let DOBRegx = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
    if (!this.state.authObj.name) {
      // alert(t`lanEULabelUpdateYourProfile`)
      ToastsStore.error(t`lanEULabelUpdateYourProfile`)
      hashHistory.push('/profile')
    } else if (this.state.idProofSatus) {
      this.props.handleIdProofCreate(null)
    } else if (!this.state.idType) {
      this.setState({ errorMessage: t`lanEULabelErrorIdTypeRequired` })
    } else if (!this.state.idNumber.trim()) {
      this.setState({ errorMessage: t`lanEULabelErrorCardNumberRequired` })
    } else if (!this.state.nameOnId.trim()) {
      this.setState({ errorMessage: t`lanEULabelErrorNameOnIdRequired` })
    } else if (this.state.imgsrc.length <= 0) {
      this.setState({ errorMessage: t`lanEULabelErrorChooseIdProofRequired` })
    } else if (this.state.idType === 'Driving License' && !this.state.dobOnId) {
      this.setState({ errorMessage: t`lanEULabelErrorDateOfBirthIsRequired` })
    } else if (this.state.idType === 'Driving License' && !DOBRegx.test(this.state.dobOnId)) {
      this.setState({ errorMessage: t`lanEULabelErrorPleaseEnterDOBInFormatDDMMYYYY` })
      ToastsStore.error(t`lanEULabelErrorPleaseEnterDOBInFormatDDMMYYYY`)
    } else {
      this.setState({ submitDisabled: true })
      let name = this.state.authObj.name
      let _this = this
      const data = new FormData()
      data.append('profileIdProofImage', this.state.file)
      data.append('euName', name)
      data.append('idType', this.state.idType)
      data.append('idNumber', this.state.idNumber)
      data.append('nameOnId', this.state.nameOnId)
      data.append('dobOnId', this.state.dobOnId)
      this.refs.btn.setAttribute('disabled', 'disabled')
      fetchPolyfill(config.baseUrl + config.postEUProfileIdProofCreateAPI, {
        method: 'POST',
        body: data,
        headers: { 'token': localStorage.getItem('token') }
      }).then((response) => {
        response.json().then((resData) => {
          if (resData.statusCode === '0000') {
            ToastsStore.success(t`lanEULabelErrorIDProofCreatedSuccessfully`)
            setTimeout(() => {
              _this.props.handleIdProofCreate(resData.statusResult)
            }, 2000)
          } else if (resData.statusCode === '9980') {
            ToastsStore.error(t`lanEULabelErrorInvalidIDProofDetails`)
            setTimeout(() => {
              _this.props.handleIdProofCreate(resData.statusResult)
            }, 2000)
          } else {
            ToastsStore.error(t`lanEULabelErrorIDProofCreateFailed`)
            setTimeout(() => {
              _this.props.handleIdProofCreate(resData.statusResult)
            }, 2000)
          }
        })
      })
    }
  }

  render () {
    return (
      <div>
        <div className='py-lg-4 create-id-proof'>
          <form>
            <div className='row'>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label className='form-control-label' >{ t`lanCommonLabelIDType` } <span className='error'>*</span></label>
                  <select className='form-control' value={this.state.idType} onChange={this.handleIdTypeValidation} >
                    <option value=''>{ t`lanEULabelPleaseSelectIdType` }</option>
                    <option value='Voter Card'>Voter Card</option>
                    <option value='Driving License'>Driving License</option>
                    {/* <option value='Aadhar Card'>Aadhar Card</option> */}
                    {/* <option value='Passport'>Passport</option> */}
                    {/* <option value='Ration Card'>Ration Card</option> */}
                    {/* <option value='PAN Card'>PAN Card</option> */}
                  </select>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelCardNumber` } <span className='error'>*</span></label>
                  <input type='text' className='form-control' maxLength='20' value={this.state.idNumber} onChange={() => this.setState({ idNumber: event.target.value, errorMessage: '' })} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelNameonID` } <span className='error'>*</span></label>
                  <input type='text' className='form-control' maxLength='40' value={this.state.nameOnId} onChange={() => this.setState({ nameOnId: event.target.value, errorMessage: '' })} />
                </div>
              </div>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label className='form-control-label'>{ t`lanCommonLabelChooseIDProof` } <span className='error'>*</span></label>
                  <div className='custom-file '>
                    <input type='file' className='custom-file-input' name='file' onChange={this.onFileChange} />
                    <label className='custom-file-label'>{this.state.filename.length ? this.state.filename : (this.state.idImagePath ? this.state.idImagePath : 'Choose ID Proof')}</label>
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
              {this.state.idType === 'Driving License'
              ? <div className='col-md-6'>
                <div className='form-group'>
                  <label>{ t`lanEULabelDOBOnID`} <span className='error'>*</span></label>
                  <input type='text' className='form-control' placeholder='DD-MM-YYYY' value={this.state.dobOnId} onChange={() => this.setState({ dobOnId: event.target.value, errorMessage: '' })} />
                </div>
              </div>
              : null }
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelStatus` } <span className='error'>*</span></label>
                  <input type='text' className='form-control' value={this.state.idStatus} disabled />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='container'>
                <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-12 text-center'>
                <button type='button' ref='btn' className='btn btn-primary' disabled={this.state.submitDisabled} onClick={this.handleCreateIdProof} >{this.state.idProofSatus ? t`lanEUButtonClose` : t`lanCommonButtonCreate`}</button>
              </div>
            </div>
          </form>
        </div>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}

EUProfileIdProofCreateComponent.propTypes = {
  handleIdProofCreate: PropTypes.func
}

export default EUProfileIdProofCreateComponent
