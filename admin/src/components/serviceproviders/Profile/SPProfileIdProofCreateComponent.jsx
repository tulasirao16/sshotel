/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { fetch as fetchPolyfill } from 'whatwg-fetch'
import PropTypes from 'prop-types'
import { t } from 'ttag'
import 'react-drawer/lib/react-drawer.css'
import { hashHistory } from 'react-router'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPProfileIdProofCreateComponent extends React.Component {
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
      idType: '',
      idNumber: '',
      nameOnId: '',
      idStatus: 'Not-Verified',
      filename: '',
      errorMessage: ''
    }
    this.onFileChange = this.onFileChange.bind(this)
    this.handleIdTypeValidation = this.handleIdTypeValidation.bind(this)
    this.handleCreateIdProof = this.handleCreateIdProof.bind(this)
  }

  onFileChange (e) {
    this.setState({ file: e.target.files[0], filename:e.target.files[0].name })
    var file = e.target.files[0]
    var fileType = file.type ? file.type.split('/')[0] : ''
    var fileTypePdf = file.type && file.type.split('/').length > 1 ? file.type.split('/')[1] : ''
    if (fileType !== 'image' && fileTypePdf !== 'pdf') {
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
      url: config.baseUrl + config.getSPProfileIdTypeValidateAPI + idType
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
          nameOnId: idProofData.nameOnId,
          idStatus: idProofData.idStatus,
          errorMessage: 'Id proof added',
          reload: true
        })
      } else {
        _this.setState({
          idType: idType,
          idImagePath: '',
          idNumber: '',
          idProofSatus: false,
          idStatus: 'Not-Verified',
          errorMessage: '',
          reload: true })
      }
    })
  }

  handleCreateIdProof () {
    if (!this.state.authObj.name) {
      alert('Update Your Profile')
      hashHistory.push('/host/user/profile')
    } else if (this.state.errorMessage1) {
      this.setState({ errorMessage: t`lanEULabelErrorUploadValidImage` })
    } else if (this.state.idProofSatus) {
      this.props.handleIdProofCreate(null)
    } else if (this.state.imgsrc.length <= 0) {
      this.setState({ errorMessage: t`lanSPLabelErrorImageRequired` })
    } else if (!this.state.idType) {
      this.setState({ errorMessage: t`lanSPLabelErrorIdTypeRequired` })
    } else if (!this.state.idNumber.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorCardNumberRequired` })
    } else if (!this.state.nameOnId.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorNameOnIdRequired` })
    } else {
      let _this = this
      const data = new FormData()
      data.append('profileIdProofImage', this.state.file)
      data.append('idType', this.state.idType)
      data.append('idNumber', this.state.idNumber)
      data.append('nameOnId', this.state.nameOnId)
      this.refs.btn.setAttribute('disabled', 'disabled')
      fetchPolyfill(config.baseUrl + config.postSPUserProfileIdProofCreateAPI, {
        method: 'POST',
        body: data,
        headers: { 'token': localStorage.getItem('token') }
      }).then((response) => {
        response.json().then((resData) => {
          if (resData.statusCode === '0000') {
            toast.success('ID Proof Created Successfully', {
              position: toast.POSITION.TOP_CENTER
            })
            setTimeout(() => {
              _this.props.handleIdProofCreate(resData.statusResult)
            }, 1000)
          } else {
            toast.error('ID Proof Create Failed', {
              position: toast.POSITION.TOP_CENTER
            })
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
        <div className='py-lg-4'>
          <form>
            {/* <div className='row justify-content-center mb-6'>
              <div className='col-lg-2'>
                <div className='card-profile-image rounded-circle'>
                  <a>
                    <img src={this.state.imgsrc.length ? this.state.imgsrc : (this.state.idImagePath ? config.baseUrl + this.state.idImagePath : require('../images/idproof.jpg'))} className='rounded-circle' />
                  </a>
                </div>
                <div className='card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4'>
                  <div className='d-flex justify-content-between'>
                    <a className='btn-camera' onClick={(e) => this.refs.handleFileSelect.click()}><i className='fas fa-camera' /></a>
                    <input ref='handleFileSelect' name='supplier-profile' type='file' onChange={this.onFileChange} multiple='false' style={{ display: 'none' }} />
                  </div>
                </div>
              </div>
            </div> */}
            <div className='row'>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label className='form-control-label' >{ t`lanCommonLabelIDType` }</label>
                  <select className='form-control' value={this.state.idType} onChange={this.handleIdTypeValidation} >
                    <option value=''>Please Select Id Type</option>
                    <option value='Aadhar Card'>Aadhar Card</option>
                    <option value='Voter Card'>Voter Card</option>
                    <option value='Passport'>Passport</option>
                    <option value='Ration Card'>Ration Card</option>
                    <option value='PAN Card'>PAN Card</option>
                    <option value='Driving License'>Driving License</option>
                  </select>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelCardNumber` }</label>
                  <input type='text' className='form-control' maxLength='20' value={this.state.idNumber} onChange={() => this.setState({ idNumber: event.target.value, errorMessage: '' })} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelNameOnId` }</label>
                  <input type='text' className='form-control' maxLength='40' value={this.state.nameOnId} onChange={() => this.setState({ nameOnId: event.target.value, errorMessage: '' })} />
                </div>
              </div>
              <div className='col-md-6 pr-1'>
                <div className='form-group'>
                  <label className='form-control-label'>{ t`lanCommonLabelChooseIDProof` } <span className='error'>*</span></label>
                  <div className='custom-file '>
                    <input type='file' className='custom-file-input' name='file' onChange={this.onFileChange} />
                    <label className='custom-file-label'>{this.state.filename.length ? this.state.filename : (this.state.idImagePath ? this.state.idImagePath : 'Choose ID Proof')}</label>
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>{ t`lanCommonLabelStatus` }</label>
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
                <button type='button' ref='btn' className='btn btn-primary' onClick={this.handleCreateIdProof} >{this.state.idProofSatus ? 'Close' : 'Create'}</button>
                <ToastContainer rtl />
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

SPProfileIdProofCreateComponent.propTypes = {
  handleIdProofCreate: PropTypes.func
}

export default SPProfileIdProofCreateComponent
