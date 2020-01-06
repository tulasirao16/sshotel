/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import { Tabs, Tab } from 'react-bootstrap-tabs'
import SPProfileIdProofCreateComponent from './SPProfileIdProofCreateComponent'
import classnames from 'classnames'
import Modal from 'react-modal'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import axios from 'axios'
import { t } from 'ttag'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor       : 'transparent',
    width                 : '40%'
  }
}
const myApi = axios.create()

class SPProfileIdProofsListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      reload: false,
      firstName: '',
      lastName: '',
      displayName: '',
      email: '',
      mobileNumber: '',
      address: '',
      userIconPath: '',
      userIcon: '',
      userIconOriginalName: '',
      authObj: {},
      idType: '',
      nameOnId: '',
      idNumber: '',
      image: '',
      imgsrc: [],
      kycImagePath: '',
      kycImageOriginalName: '',
      idStatus: 'Not-Verified',
      idproofsList: [],
      errorMessage: '',
      idProofArray: [],
      activeIDProof: true,
      modalIsOpen: false,
      showData: {},
      idTypeChecked : 'checked',
      idNoChecked : 'checked',
      nameOnIdChecked : 'checked',
      statusChecked : 'checked'
    }
    this.handleUserProfile = this.handleUserProfile.bind(this)
    this.handleAddressDetails = this.handleAddressDetails.bind(this)
    this.handleIDProofs = this.handleIDProofs.bind(this)
    this.handlePreferences = this.handlePreferences.bind(this)
    this.handleBusinessInfo = this.handleBusinessInfo.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleLogOut = this.handleLogOut.bind(this)
    this.handleIdProofCreated = this.handleIdProofCreated.bind(this)
    this.handleEditIdProof = this.handleEditIdProof.bind(this)
    this.handleViewIdProof = this.handleViewIdProof.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  componentWillMount () {
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    this.setState({
      authObj: authObj,
      firstName: authObj.firstName,
      lastName: authObj.lastName,
      displayName: authObj.displayName,
      mobileNumber: authObj.mobileNumber,
      email: authObj.email ? authObj.email : '',
      userAccount: authObj.userAccount,
      userRole: authObj.userRole,
      address: authObj.address ? authObj.address : '',
      dob: authObj.dob ? authObj.dob : '',
      iconPath: authObj.userIconPath ? authObj.userIconPath : '',
      iconOriginalName: authObj.userIconOriginalName ? authObj.userIconOriginalName : '',
      userIcon: authObj.userIcon ? authObj.userIcon : '',
      spServiceProvider: authObj.spServiceProvider,
      kycImagePath: authObj.kycImagePath ? authObj.kycImagePath : ''
    })
    let idproofsList = {
      url: config.baseUrl + config.getSPProfileIdProofsListAPI
    }
    let _this = this
    APICallManager.getCall(idproofsList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          idproofsList: resObj.data.statusResult
        })
      }
    })
  }
  handleUserProfile () {
    hashHistory.push('/host/user/profile')
    event.preventDefault()
  }
  handleAddressDetails () {
    hashHistory.push('/host/user/profile/address')
    event.preventDefault()
  }
  handleIDProofs () {
    this.setState({ activeIDProof: true })
    hashHistory.push('/host/user/profile/idproof')
    event.preventDefault()
  }
  handlePreferences () {
    hashHistory.push('/host/user/profile/preferences')
    event.preventDefault()
  }
  handleBusinessInfo () {
    hashHistory.push('/host/user/profile/businessinfo')
    event.preventDefault()
  }
  handleChangePassword () {
    hashHistory.push('/host/user/profile/changepassword')
    event.preventDefault()
  }
  handleLogOut () {
    localStorage.clear()
    myApi.defaults.headers.token = null
    hashHistory.push('/host/signin')
  }
  handleIdProofCreated (data) {
    if (data && data._id) {
      let idProofListingData = this.state.idproofsList
      idProofListingData.unshift(data)
      this.setState({ idproofsList: idProofListingData })
    } else {
      this.setState({ reload: true })
    }
  }
  handleEditIdProof (idProofData) {
    localStorage.setItem('idProofData', JSON.stringify(idProofData))
    hashHistory.push('/host/user/profile/edit')
    event.preventDefault()
  }
  handleViewIdProof (item) {
    this.setState({ modalIsOpen: true, showData: item })
    event.preventDefault()
  }
  handleOk () {
    this.setState({ modalIsOpen: false, showData: {} })
  }
  closeModal () {
    this.setState({ modalIsOpen: false, showData: {} })
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
                          <div className='col-md-9 col-9 pl-4 text-left'>
                            <p><span ><i className='fas fa-mobile-alt pr-2 pl-1' /></span><small>{this.state.mobileNumber}</small></p>
                          </div>
                          <div className='col-md-3 col-3 text-right'>
                            <i className='far fa-check-circle btn-outline-success' />
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className='row email'>
                          <div className='col-md-9 col-9 pl-4 text-left'>
                            <p><span ><i className='fas fa-envelope pr-2 pl-1' /></span>{this.state.email}</p>
                          </div>
                          <div className='col-md-3 col-3 pt-1 text-right'>
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
                    <li>
                      <a onClick={this.handleAddressDetails} >{ t`lanSPTitleAddressDetails` }</a>
                    </li>
                    <li>
                      <a className={classnames({ 'active-profile-title' :this.state.activeIDProof })} onClick={this.handleIDProofs} >{ t`lanSPTitleIDProofs` }</a>
                    </li>
                    <li>
                      <a onClick={this.handlePreferences} >{ t`lanSPTitlePreferences` }</a>
                    </li>
                    <li>
                      <a onClick={this.handleBusinessInfo} >{ t`lanSPTitleBusinessInfo` }</a>
                    </li>
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
            <div className='col-md-8 id-proof-body'>
              <div className='card card-id-proof'>
                <div className='card-header'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <h5 className='card-title'>{ t`lanSPTitleIDProofs` }</h5>
                    </div>
                    <div className='col-md-6'>
                      <div className='text-right'>
                        <div className='button-group'>
                          <button type='button' className='btn btn-success dropdown-toggle' data-toggle='dropdown'><i className='fas fa-list' /></button>
                          <ul className='dropdown-menu'>
                            <li><a id='area'><input type='checkbox' onChange={() => this.setState({ idTypeChecked: this.state.idTypeChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.idTypeChecked} />ID Type</a></li>
                            <li><a id='city'><input type='checkbox' onChange={() => this.setState({ idNoChecked: this.state.idNoChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.idNoChecked} />ID No #</a></li>
                            <li><a id='state'><input type='checkbox' onChange={() => this.setState({ nameOnIdChecked: this.state.nameOnIdChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.nameOnIdChecked} />Name on ID</a></li>
                            <li><a id='pincode'><input type='checkbox' onChange={() => this.setState({ statusChecked: this.state.statusChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.statusChecked} />Status</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card-body'>
                  <Tabs onSelect={(index, label) => console.log(label + ' selected')} headerclassName='tab-header-bold' activeHeaderclassName='tab-header-blue'>
                    <Tab label='ID Proof List '>
                      <div className='py-lg-4'>
                        {this.state.idproofsList.length > 0
                          ? <div className='table-responsive'>
                            <table className='table align-items-center table-flush table-hover'>
                              <thead className='thead-light'>
                                <tr>
                                  {this.state.idTypeChecked === 'checked' ? <th className='sort' data-sort='name'>ID Type</th> : null }
                                  {this.state.idNoChecked === 'checked' ? <th className='sort' data-sort='name'>ID No #</th> : null }
                                  {this.state.nameOnIdChecked === 'checked' ? <th className='sort' data-sort='name'>Name on ID</th> : null }
                                  {this.state.statusChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelStatus` }</th> : null }
                                  <th className='sort' data-sort='name'>{ t`lanCommonLabelActions` }</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.idproofsList.map((item, i) =>
                                  <tr key={i}>
                                    {this.state.idTypeChecked ? <td className='table-user'>
                                      <img src={item.kycImagePath ? config.baseUrl + item.kycImagePath : require('../images/team-4.jpg')} className='avatar rounded-circle mr-3' />
                                      <a ><strong>{item.idType}</strong></a>
                                    </td> : null }
                                    {this.state.idNoChecked ? <td className='text-muted'>{item.idNumber}</td> : null }
                                    {this.state.nameOnIdChecked ? <td className='text-muted'>{item.nameOnId}</td> : null }
                                    {this.state.statusChecked ? <td className='text-muted'>{item.idStatus}</td> : null }
                                    <td>
                                      <a onClick={() => this.handleViewIdProof(item)} className='table-action table-action-view' data-toggle='tooltip' title='IdProofView'>
                                        <i className='far fa-eye' />
                                      </a>
                                      <a onClick={() => this.handleEditIdProof(item)} className='table-action table-action-edit' data-toggle='tooltip'>
                                        <i className='fas fa-user-edit' />
                                      </a>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          : this.state.idproofsList.length <= 0
                          ? <div className='container'>
                            <div className='row justify-content-center'>
                              <div className='col-sm-12 text-center'>
                                <label>{t`lanCommonLabelNoIDProofsFound`}</label>
                              </div>
                            </div>
                          </div>
                          : null
                          }
                      </div>
                    </Tab>
                    <Tab label='Create ID Proof'>
                      <SPProfileIdProofCreateComponent handleIdProofCreate={this.handleIdProofCreated} />
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default SPProfileIdProofsListComponent
