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
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import { Tabs, Tab } from 'react-bootstrap-tabs'
import APICallManager from '../../../services/callmanager'
import Modal from 'react-modal'
import classnames from 'classnames'

import ADHostUserListIDProofCreateComponent from './ADHostUserListIDProofCreateComponent'

import config from '../../../../public/config.json'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import axios from 'axios'
// import { Alert } from 'react-bootstrap'

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

const myApi = axios.create()

class ADHostUserListIDProofComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      userData: JSON.parse(localStorage.getItem('userData')),
      usersList: [],
      activePage: 1,
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
      nameChecked: 'checked',
      mobileNumberChecked: 'checked',
      emailChecked: 'checked',
      idTypeChecked : 'checked',
      idNoChecked : 'checked',
      nameOnIdChecked : 'checked',
      statusChecked : 'checked'
    }
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
    let userData = this.state.userData
    let idproofsList = {
      url: config.baseUrl + config.getADHostUserIdProofsListAPI + userData._id
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
    hashHistory.push('/admin/host-user/id-proof/edit')
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
        <div className='container-fluid mt--6'>
          <div className='row'>
            <div className='col id-proof-body'>
              <div className='card card-id-proof'>
                <div className='card-header'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <h5 className='card-title'>{ t`lanADTooltipLabelHostUserIDProof` }</h5>
                    </div>
                    <div className='col-md-6'>
                      <div className='text-right'>
                        <div className='button-group'>
                          <button type='button' className='btn btn-success dropdown-toggle' data-toggle='dropdown'><i className='fas fa-list' /></button>
                          <ul className='dropdown-menu'>
                            <li><a><input type='checkbox' onChange={() => this.setState({ nameChecked: this.state.nameChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.nameChecked} />Name</a></li>
                            <li><a><input type='checkbox' onChange={() => this.setState({ mobileNumberChecked: this.state.mobileNumberChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.mobileNumberChecked} />Mobile Number</a></li>
                            <li><a><input type='checkbox' onChange={() => this.setState({ emailChecked: this.state.emailChecked === 'checked' ? ''
                              : 'checked' })} checked={this.state.emailChecked} />Email</a></li>
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
                                  {this.state.nameChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelName` }</th> : null }
                                  {this.state.mobileNumberChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelMobileNumber` }</th> : null }
                                  {this.state.emailChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelEmail` }</th> : null }
                                  {this.state.idTypeChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelIDType` }</th> : null }
                                  {this.state.idNoChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelIDNumber` } #</th> : null }
                                  {this.state.nameOnIdChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelNameOnId` }</th> : null }
                                  {this.state.statusChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelStatus` }</th> : null }
                                  <th className='sort' data-sort='name'>{ t`lanCommonLabelActions` }</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.idproofsList.map((item, i) =>
                                  <tr key={i}>
                                    {this.state.nameChecked ? <td className='text-muted'>{this.state.userData.displayName}</td> : null }
                                    {this.state.mobileNumberChecked ? <td className='text-muted'>{this.state.userData.mobileNumber}</td> : null }
                                    {this.state.emailChecked ? <td className='text-muted'>{this.state.userData.email}</td> : null }
                                    {this.state.idTypeChecked ? <td className='table-user'>{item.idType}</td> : null }
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
                      <ADHostUserListIDProofCreateComponent handleIdProofCreate={this.handleIdProofCreated} />
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={this.state.modalIsOpen} style={customStyles} ariaHideApp={false} >
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
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}

export default ADHostUserListIDProofComponent
