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
import axios from 'axios'
import { t } from 'ttag'
import classnames from 'classnames'
import Modal from 'react-modal'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '60%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-60%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor       : 'transparent',
    width                 : '40%'
  }
}

const myApi = axios.create()

class ADProfileIdProofEditComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      authObj: JSON.parse(localStorage.getItem('authObj')),
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
    this.handleUserProfile = this.handleUserProfile.bind(this)
    this.handleAddressDetails = this.handleAddressDetails.bind(this)
    this.handleIDProofs = this.handleIDProofs.bind(this)
    this.handlePreferences = this.handlePreferences.bind(this)
    this.handleBusinessInfo = this.handleBusinessInfo.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleLogOut = this.handleLogOut.bind(this)
    this.onFileChange = this.onFileChange.bind(this)
    this.handleUpdateIdProof = this.handleUpdateIdProof.bind(this)
    this.handleIdTypeValidation = this.handleIdTypeValidation.bind(this)
    this.handleApiCall = this.handleApiCall.bind(this)
    this.handleViewIdProof = this.handleViewIdProof.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  componentWillMount () {
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    let data = JSON.parse(localStorage.getItem('idProofData'))
    this.setState({
      idProofData: data,
      oldIDProofData: data,
      _id: data._id,
      firstName: authObj.firstName,
      displayName: authObj.displayName,
      mobileNumber: authObj.mobileNumber,
      email: authObj.email,
      address: authObj.address ? authObj.address : '',
      iconPath: authObj.userIconPath ? authObj.userIconPath : '',
      userIcon: authObj.userIcon ? authObj.userIcon : '',
      iconOriginalName: authObj.userIconOriginalName ? authObj.userIconOriginalName : ''
    })
  }
  handleUserProfile () {
    hashHistory.push('/admin/profile')
    event.preventDefault()
  }
  handleAddressDetails () {
    hashHistory.push('/host/user/profile/address')
    event.preventDefault()
  }
  handleIDProofs () {
    this.setState({ activeIDProof: true })
    hashHistory.push('/admin/user/profile/idproof')
    event.preventDefault()
  }
  handlePreferences () {
    hashHistory.push('/admin/user/profile/preferences')
    event.preventDefault()
  }
  handleBusinessInfo () {
    hashHistory.push('/host/user/profile/businessinfo')
    event.preventDefault()
  }
  handleChangePassword () {
    hashHistory.push('/admin/user/profile/changepassword')
    event.preventDefault()
  }
  handleLogOut () {
    localStorage.clear()
    myApi.defaults.headers.token = null
    hashHistory.push('/admin')
  }
  handleBack () {
    hashHistory.push('admin/user/profile/idproof')
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
    let idType = event.target.value
    this.setState(prevState => {
      let idProofData = Object.assign({}, prevState.idProofData)
      let errorMessage = ''
      idProofData.idType = idType
      return { idProofData, errorMessage }
    })
    let userObj = {
      url: config.baseUrl + config.getADProfileIdTypeValidateAPI + idType
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
      this.setState({ buttonDisabled: true })
      var isUpdate = JSON.stringify(oIDpd) === JSON.stringify(idPD)
      if (!isUpdate || this.state.filename) {
        this.handleApiCall()
      } else {
        ToastsStore.warning('No Changes to Update')
        setTimeout(() => {
          hashHistory.push('/admin/user/profile/idproof')
        }, 1000)
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
    let _this = this
    fetchPolyfill(config.baseUrl + config.putADUserProfileIdProofUpdateAPI + this.state._id, {
      method: 'PUT',
      body: data,
      headers: { 'token': localStorage.getItem('token') }
    }).then((response) => {
      response.json().then((resData) => {
        if (resData.statusCode === '0000') {
          ToastsStore.success('ID Proof Updated Successfully')
          setTimeout(() => {
            hashHistory.push('/admin/user/profile/idproof')
          }, 2000)
          // hashHistory.push('/host/user/profile/idproof')
        } else {
          ToastsStore.error('ID Proof Updated Failed')
          setTimeout(() => {
            _this.setState({ buttonDisabled: false })
          }, 5000)
        }
      })
    })
  }

  render () {
    return (
      <div>
        {/* ---------- Header Starts ------------- */}
        <div className='header bg-primary pb-6'>
          <div className='container'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{ t`lanSPTitleProfile` }</h6>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  <a className='btn btn-sm btn-neutral' onClick={this.handleBack}><i className='fas fa-chevron-left' /> { t`lanCommonButtonBack` }</a>
                </div>
              </div>
            </div>
          </div>
        </div>{/* ---------- Header Starts ------------- */}
        <div className='container mt--6'>
          <div className='row'>
            <div className='col-md-4'>
              <div className='card card-profile'>
                <img src={require('../images/img-1-1000x600.jpg')} className='card-img-top' />
                <div className='row justify-content-center'>
                  <div className='col-lg-3 order-lg-2'>
                    <div className='card-profile-image rounded-circle mt--5'>
                      <a>
                        <img src={this.state.authObj.userIconPath ? config.baseUrl + this.state.authObj.userIconPath : require('../images/profile-icon.png')} className='rounded-circle' />
                      </a>
                    </div>
                  </div>
                </div>
                <div className='card-body mt-6 pt-0'>
                  <div className='text-center'>
                    <h5 className='h3'>{this.state.displayName}</h5>
                    <div className='h5 font-weight-300'>
                      <i className='ni ni-pin-3 mr-2' />{this.state.address}
                    </div>
                    <ul className='list-unstyled team-members'>
                      <li>
                        <div className='row mobile'>
                          <div className='col-md-10 col-9 pl-4 text-left'>
                            <p><span ><i className='fas fa-mobile-alt pr-2 pl-1' /></span><small>{this.state.mobileNumber}</small></p>
                          </div>
                          <div className='col-md-2 col-3 text-right'>
                            <i className='far fa-check-circle btn-outline-success' />
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className='row email'>
                          <div className='col-md-10 col-9 pl-4 text-left'>
                            <p style={{ fontSize: 13 }}><span ><i className='fas fa-envelope pr-2 pl-1' /></span>{this.state.email}</p>
                          </div>
                          <div className='col-md-2 col-3 pt-1 text-right'>
                            <i className='far fa-check-circle btn-outline-success' />
                          </div>
                        </div>
                      </li>
                      <hr className='divider' />
                    </ul>
                  </div>
                  <ul className='list-unstyled team-members'>
                    <li>
                      <a onClick={this.handleUserProfile} >{ t`lanSPTitleUserProfile` }</a>
                    </li>
                    {/* <li>
                      <a onClick={this.handleAddressDetails} >{ t`lanSPTitleAddressDetails` }</a>
                    </li> */}
                    <li>
                      <a className={classnames({ 'active-profile-title' :this.state.activeIDProof })} onClick={this.handleIDProofs} >{ t`lanSPTitleIDProofs` }</a>
                    </li>
                    <li>
                      <a onClick={this.handlePreferences} >{ t`lanSPTitlePreferences` }</a>
                    </li>
                    {/* <li>
                      <a onClick={this.handleBusinessInfo} >{ t`lanSPTitleBusinessInfo` }</a>
                    </li> */}
                    <li>
                      <a onClick={this.handleChangePassword} >{ t`lanSPTitleChangePassword` }</a>
                    </li>
                    <li>
                      <a onClick={this.handleLogOut}>{ t`lanSPTitleLogout` }</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='col-md-8'>
              <div className='card card-user'>
                <div className='card-header'>
                  <h5 className='card-title'>{ t`lanSPTitleEditIDProoof` }</h5>
                </div>
                <div className='card-body'>
                  <form>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label className='form-control-label' >{ t`lanCommonLabelIDType` }<span className='madatory'>*</span></label>
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
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelCardNumber` }<span className='madatory'>*</span></label>
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
                    </div>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelNameOnId` }<span className='madatory'>*</span></label>
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
                      <div className='col-md-6 pr-1'>
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
                      <div className='col-md-6'>
                        <div className='form-group'>
                          <label>{ t`lanCommonLabelStatus` }</label>
                          <input type='text' className='form-control' value={this.state.idProofData.idStatus} disabled />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='container'>
                        <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-sm-12 text-center '>
                        <button type='button' disabled={this.state.buttonDisabled} className='btn btn-primary' onClick={this.handleUpdateIdProof}>{ t`lanCommonButtonUpdate` }</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
          </div>
        </div>
        {/* <Modal isOpen={this.state.modalIsOpen} style={customStyles}>
          <h2 className='text-sm'>IDType: {this.state.showData.idType}, IDNumber: {this.state.showData.idNumber}</h2>
          <h2><img src={this.state.showData.kycImagePath ? config.baseUrl + this.state.showData.kycImagePath : ''} className='rounded mr-3' width='200' height='200' /></h2>
          <button className='btn btn-primary mr-2' onClick={this.handleOk}>OK</button>
          <button className='btn btn-danger' onClick={this.closeModal}>Close</button>
        </Modal> */}
        <Modal isOpen={this.state.modalIsOpen} style={customStyles}>
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

export default ADProfileIdProofEditComponent
