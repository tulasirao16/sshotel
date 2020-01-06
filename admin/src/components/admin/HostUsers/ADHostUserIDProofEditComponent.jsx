/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import config from '../../../../public/config.json'
import { fetch as fetchPolyfill } from 'whatwg-fetch'
import APICallManager from '../../../services/callmanager'
import 'react-drawer/lib/react-drawer.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import { t } from 'ttag'
import Modal from 'react-modal'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-60%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor       : 'transparent',
    width                 : '40%'
  }
}

class ADHostUserIDProofEditComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      userData: JSON.parse(localStorage.getItem('userData')),
      idTypeValid: true,
      reload: false,
      idProofData: {},
      oldIDProofData: {},
      userIconPath: '',
      userIconOriginalName: '',
      filename: '',
      file: [],
      imgsrc: [],
      kycImagePath: '',
      _id: '',
      idType: '',
      idNumber: '',
      nameOnId: '',
      idStatus: 'Not-Verified',
      modalIsOpen: false,
      showData: {},
      errorMessage: '',
      activeIDProof: true,
      buttonDisabled: false
    }
    this.onFileChange = this.onFileChange.bind(this)
    this.handleUpdateIdProof = this.handleUpdateIdProof.bind(this)
    this.handleIdTypeValidation = this.handleIdTypeValidation.bind(this)
    this.handleApiCall = this.handleApiCall.bind(this)
    this.handleViewIdProof = this.handleViewIdProof.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  componentWillMount () {
    let userData = JSON.parse(localStorage.getItem('userData'))
    let data = JSON.parse(localStorage.getItem('idProofData'))
    this.setState({
      idProofData: data,
      oldIDProofData: data,
      _id: data._id,
      firstName: userData.firstName,
      displayName: userData.displayName,
      mobileNumber: userData.mobileNumber,
      email: userData.email,
      address: userData.address ? userData.address : '',
      iconPath: userData.userIconPath ? userData.userIconPath : '',
      userIcon: userData.userIcon ? userData.userIcon : '',
      iconOriginalName: userData.userIconOriginalName ? userData.userIconOriginalName : ''
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
      console.log('url', url)
    }
  }
  handleViewIdProof (idProofData) {
    this.setState({ modalIsOpen: true, showData: idProofData })
    event.preventDefault()
  }

  handleOk () {
    this.setState({ modalIsOpen: false, showData: {} })
  }
  closeModal () {
    this.setState({ modalIsOpen: false, showData: {} })
  }

  handleIdTypeValidation (event) {
    let userData = JSON.parse(localStorage.getItem('userData'))
    let spUserId = userData._id
    let idType = event.target.value
    this.setState(prevState => {
      let idProofData = Object.assign({}, prevState.idProofData)
      let errorMessage = ''
      idProofData.idType = idType
      return { idProofData, errorMessage }
    })
    let userObj = {
      url: config.baseUrl + config.getADSPProfileIdTypeValidateAPI + idType + '/' + spUserId
    }
    let _this = this
    APICallManager.getCall(userObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ idTypeValid: false, errorMessage: 'You have this Id Type in your list' })
      } else {
        _this.setState({ idTypeValid: true, errorMessage: '' })
      }
    })
  }
  handleUpdateIdProof () {
    let oIDpd = this.state.oldIDProofData
    let idPD = this.state.idProofData
    if (!this.state.idTypeValid) {
      this.setState({ errorMessage: 'You have this Id Type in your list' })
    } else if (!idPD.idNumber.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorCardNumberRequired` })
    } else if (!idPD.nameOnId.trim()) {
      this.setState({ errorMessage: t`lanSPLabelErrorNameOnIdRequired` })
    } else {
      this.setState({ buttonDisabled:true })
      var isUpdate = JSON.stringify(oIDpd) === JSON.stringify(idPD)
      if (!isUpdate || this.state.filename) {
        this.handleApiCall()
      } else {
        ToastsStore.warning('No Changes to Update')
        hashHistory.push('/admin/host-user/id-proof')
      }
    }
    event.preventDefault()
  }
  handleApiCall () {
    const data = new FormData()
    data.append('profileIdProofImage', this.state.file)
    data.append('idType', this.state.idProofData.idType)
    data.append('idNumber', this.state.idProofData.idNumber)
    data.append('nameOnId', this.state.idProofData.nameOnId)
    fetchPolyfill(config.baseUrl + config.putADHostUserIDProofUpdateAPI + this.state._id, {
      method: 'PUT',
      body: data,
      headers: { 'token': localStorage.getItem('token') }
    }).then((response) => {
      response.json().then((resData) => {
        if (resData.statusCode === '0000') {
          ToastsStore.success('ID Proof Updated Successfully')
          setTimeout(() => {
            hashHistory.push('/admin/host-user/id-proof')
          }, 2000)
        } else {
          this.setState({ buttonDisabled: true })
          ToastsStore.error('ID Proof Updated Failed')
          setTimeout(() => {
            this.setState({ buttonDisabled: false })
          }, 5000)
        }
      })
    })
  }

  render () {
    return (
      <div className='user-id-proof'>
        <div className='container-fluid mt--6'>
          <div className='row'>
            <div className='col id-proof-body'>
              <div className='card card-user'>
                <div className='card-header'>
                  <h5 className='card-title'>{ t`lanSPTitleEditIDProoof` }</h5>
                </div>
                <div className='card-body'>
                  <form>
                    <div className='row'>
                      <div className='col-md-4'>
                        <div className='form-group'>
                          <label className='form-control-label' >{ t`lanCommonLabelIDType` }</label>
                          <select className='form-control' value={(this.state.idProofData && this.state.idProofData.idType) ? this.state.idProofData.idType : ''} onChange={this.handleIdTypeValidation} >
                            {(this.state.idProofData && this.state.idProofData.idType)
                            ? null : <option value=''>Select ID Type</option>}
                            <option value='Aadhar Card'>Aadhar Card</option>
                            <option value='Voter Card'>Voter Card</option>
                            <option value='Passport'>Passport</option>
                            {/* <option value='Ration Card'>Ration Card</option> */}
                            <option value='PAN Card'>PAN Card</option>
                            <option value='Driving License'>Driving License</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-4'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelCardNumber` }</label>
                          <input type='text' className='form-control' maxLength='20' value={(this.state.idProofData && this.state.idProofData.idNumber) ? this.state.idProofData.idNumber : ''}
                            onChange={
                            () =>
                              this.setState(prevState => {
                                let idProofData = Object.assign({}, prevState.idProofData)
                                let errorMessage = ''
                                idProofData.idNumber = event.target.value
                                return { idProofData, errorMessage }
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className='col-md-4'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelNameOnId` }</label>
                          <input type='text' className='form-control' maxLength='40' value={this.state.idProofData.nameOnId}
                            onChange={
                            () =>
                              this.setState(prevState => {
                                let idProofData = Object.assign({}, prevState.idProofData)
                                let errorMessage = ''
                                idProofData.nameOnId = event.target.value
                                return { idProofData, errorMessage }
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-4 pr-1'>
                        <div className='form-group'>
                          <div className='row '>
                            <label className='form-control-label col-sm-10'>{ t`lanCommonLabelChooseIDProof` } <span className='error'>*</span></label>
                            <a onClick={() => this.handleViewIdProof(this.state.idProofData)} className='table-action table-action-view text-right' data-toggle='tooltip' title='IdProofView'>
                              <i className='far fa-eye' />
                            </a>
                          </div>
                          <div className='custom-file '>
                            <input type='file' className='custom-file-input' name='file' onChange={this.onFileChange} />
                            <label className='custom-file-label'>{this.state.filename ? this.state.filename : (this.state.idProofData.kycImageOriginalName
                            ? this.state.idProofData.kycImageOriginalName : 'Choose ID Proof')}</label>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-4'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelStatus` }</label>
                          <input type='text' className='form-control' value={this.state.idProofData.idStatus} disabled />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='container'>
                        <div className='text-center'>
                          <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-sm-12 text-center '>
                        <button disabled={this.state.buttonDisabled} className='btn btn-primary' onClick={this.handleUpdateIdProof}>{ t`lanCommonButtonUpdate` }</button>
                        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={this.state.modalIsOpen} style={customStyles} ariaHideApp={false}>
          <div className='modal-content'>
            <div className='modal-header p-3' style={{ backgroundColor:'#e4e4e4' }}>
              <h4 className='modal-title'>ID Proof View</h4>
              <button type='button' className='close' onClick={this.closeModal}>&times;</button>
            </div>
            <div className='modal-body'>
              <div className='row'>
                <div className='col-md-6'>
                  <label>ID Type</label>
                  <h2 className='text-sm'>{this.state.showData.idType}</h2>
                </div>
                <div className='col-md-6'>
                  <label>ID Number</label>
                  <h2 className='text-sm'>{this.state.showData.idNumber}</h2>
                </div>
              </div>
              <div className='images mt-10'>
                <img src={this.state.showData.kycImagePath ? config.baseUrl + this.state.showData.kycImagePath : ''} className='rounded' />
              </div>
            </div>
            <div className='modal-footer p-3' style={{ backgroundColor:'#e4e4e4' }}>
              <button className='btn btn-primary' onClick={this.handleOk}>OK</button>
              <button className='btn btn-danger' onClick={this.closeModal}>Close</button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default ADHostUserIDProofEditComponent
