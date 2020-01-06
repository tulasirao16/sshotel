/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import './css/Profile.css'
import { t } from 'ttag'
import Modal from 'react-modal'

import { Tabs, Tab } from 'react-bootstrap-tabs'
import EUProfileSideMenu from './EUProfileSideMenu'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import EUProfileIdProofCreateComponent from './EUProfileIdProofCreateComponent'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
}

class EUProfileIdProofsListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      authObj: JSON.parse(localStorage.getItem('authObj')),
      reload: false,
      idType: '',
      nameOnId: '',
      idNumber: '',
      idStatus: 'Not-Verified',
      idproofsList: [],
      modalIsOpen: false,
      showData: {},
      errorMessage: ''
    }
    this.handleIdProofCreated = this.handleIdProofCreated.bind(this)
    this.handleViewIdProof = this.handleViewIdProof.bind(this)
    this.handleEditIdProof = this.handleEditIdProof.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentWillMount () {
    let idproofsList = {
      url: config.baseUrl + config.getEUProfileIdProofsListAPI
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
  handleEditIdProof (idProofData) {
    localStorage.setItem('idProofData', JSON.stringify(idProofData))
    hashHistory.push('/idproof/edit')
    event.preventDefault()
  }

  render () {
    return (
      <div className='main-content idProof-profile' id='panel'>
        {/* ------- Navbar --------- */}
        <div className='container-fluid mt-5 pb-5'>
          <div className='row'>
            <div className='col-lg-3' >
              <EUProfileSideMenu authObj={this.state.authObj} />
            </div>
            <div className='col-lg-9' >
              <div className='profile-add-id-proof '>
                <div className='card'>
                  <div className='card-header card-header-danger'>
                    <h4 className='card-title'>{ t`lanEUTitleAddIDProofs` }</h4>
                  </div>
                  <div className='card-profile-idProof-col'>
                    <div className='card-body pl-5 pr-5'>
                      <Tabs onSelect={(index, label) => console.log(label + ' selected')}
                        headerClass='tab-header-bold' activeHeaderClass='tab-header-blue'>
                        <Tab label={t`lanEUTitleIDProofList`}>
                          <div className='py-lg-4'>
                            {this.state.idproofsList.length > 0
                          ? <div className='table-responsive'>
                            <table className='table align-items-center table-flush table-striped'>
                              <thead className='thead-light'>
                                <tr>
                                  <th>{ t`lanCommonLabelIDType` }</th>
                                  <th>{ t`lanCommonLabelCardNumber` }</th>
                                  <th>{ t`lanCommonLabelNameOnId` }</th>
                                  <th>{ t`lanCommonLabelStatus` }</th>
                                  <th>{ t`lanCommonLabelActions` }</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.idproofsList.map((item, i) =>
                                  <tr key={i}>
                                    <td className='table-user'>
                                      <a ><strong>{item.idType}</strong></a>
                                    </td>
                                    <td>
                                      <span className='text-muted'>{item.idNumber}</span>
                                    </td>
                                    <td className='table-actions'>
                                      <span className='text-muted'>{item.nameOnId}</span>
                                    </td>
                                    <td className='table-actions'>
                                      <span className='text-muted'>{item.idStatus}</span>
                                    </td>
                                    <td>
                                      <a onClick={() => this.handleViewIdProof(item)} className='table-action table-action-view' data-toggle='tooltip' title='IdProofView'>
                                        <i className='far fa-eye text-success' />
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
                              <div className='col-sm-12 text-center my-0' >
                                <div className='no-data'><p>{t`lanCommonLabelNoIDProofsFound`}</p></div>
                              </div>
                            </div>
                          </div>
                          : null
                        }
                          </div>
                        </Tab>
                        <Tab label={t`lanEUTitleCreateIDProof`}>
                          <EUProfileIdProofCreateComponent handleIdProofCreate={this.handleIdProofCreated} />
                        </Tab>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={this.state.modalIsOpen} style={customStyles}>
          <div className='container'>
            <div className='row justify-content-center'>
              <div className='col-sm-12 text-right'>
                <a onClick={this.closeModal} ><i className='fas fa-times text-danger' style={{ fontSize: 22 }} /></a>
              </div>
            </div>
            <div className='row'>
              <div className='col-sm-5'>
                <div className='form-group'>
                  <label className='col-sm-4 text-grey'>{ t`lanCommonLabelIDType` }:</label>
                  <b className='col-sm-8 text-black' style={{ fontSize: 14 }}>{this.state.showData.idType}</b>
                </div>
              </div>
              <div className='col-sm-7'>
                <div className='form-group'>
                  <label className='col-sm-4 text-grey'>{ t`lanCommonLabelCardNumber` }:</label>
                  <b className='col-sm-8 text-black' style={{ fontSize: 14 }} >{this.state.showData.idNumber}</b>
                </div>
              </div>
            </div>
            <div className='row mb-3'>
              <div className='col-sm-12 text-center'>
                <div className='id-proof-img-modal-div'>
                  <img src={this.state.showData.kycImagePath ? config.baseUrl + this.state.showData.kycImagePath : ''} className='rounded' />
                </div>
              </div>
            </div>
            {/* <div className='row '>
              <div className='col-sm-12 text-right mb-3'>
                <button className='btn btn-danger' onClick={this.closeModal}>Close</button>
              </div>
            </div> */}
          </div>
        </Modal>
      </div>
    )
  }
}

export default EUProfileIdProofsListComponent
