/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import moment from 'moment'
import { t } from 'ttag'
import { Tabs, Tab } from 'react-bootstrap-tabs'
import Modal from 'react-modal'

import '../profile/css/Profile.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import EUSupportCreateComponent from './EUSupportCreateComponent'
import EUSupportEditComponent from './EUSupportEditComponent'
import EUProfileSideMenu from '../profile/EUProfileSideMenu'

// import EUSupportViewComponent from './EUSupportViewComponent'
// import EUSupportDeleteComponent from './EUSupportDeleteComponent'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}
class EUSupportListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      authObj: JSON.parse(localStorage.getItem('authObj')),
      searchString: '',
      supportData: [],
      totalCount: 0,
      isShowList: true,
      isShowView: false,
      isShowEdit: false,
      isShowDelete: false,
      modalIsOpen: false,
      supportDeleteData: {}
    }
    this.handleCreateSupport = this.handleCreateSupport.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleViewSupport = this.handleViewSupport.bind(this)
    this.handleEditSupport = this.handleEditSupport.bind(this)
    this.handleDeleteSupport = this.handleDeleteSupport.bind(this)
    this.handleConfirmDeleteUser = this.handleConfirmDeleteUser.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  componentWillMount () {
    let supportList = {
      url: config.baseUrl + config.getEUSupportListAPI
    }
    let _this = this
    APICallManager.getCall(supportList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          supportData: resObj.data.statusResult,
          totalCount: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({
          supportData: [],
          totalCount: 0
        })
      }
    })
  }

  handleInputChange (event) {
    let supportList = {
      url: config.baseUrl + config.getEUSupportListAPI + event.target.value
    }
    let _this = this
    _this.setState({ searchString: event.target.value })
    APICallManager.getCall(supportList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          supportData: resObj.data.statusResult,
          totalCount: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({
          supportData: [],
          totalCount: 0
        })
      }
    })
  }
  handleCreateSupport (data) {
    let supportListingData = this.state.supportData
    if (data && data._id) {
      supportListingData.unshift(data)
      this.setState({ supportData: supportListingData })
    }
  }
  handleDeleteSupport (data, status) {
    if (status) {
      let supportListingData = this.state.supportData
      const index = supportListingData.findIndex(dataObj => dataObj._id === data._id)
      supportListingData.splice(index, 1)
      this.setState({ supportData: supportListingData })
    }
    this.setState({
      isShowList: !this.state.isShowList,
      isShowView: false,
      isShowEdit: false,
      isShowDelete: !this.state.isShowDelete,

      selectedSupportData: data
    })
    event.preventDefault()
  }
  handleViewSupport (data) {
    this.setState({
      isShowList: !this.state.isShowList,
      isShowView: !this.state.isShowView,
      isShowDelete: false,
      isShowEdit: false,
      // isShowCreate: false,
      selectedSupportData: data
    })
  }
  handleEditSupport (data, nModified) {
    if (nModified) {
      let supportListingData = this.state.supportData
      const index = supportListingData.findIndex(dataObj => dataObj._id === data._id)
      supportListingData[index] = data
      this.setState({ supportData: supportListingData })
    }
    // localStorage.setItem('supportData', JSON.stringify(data))
    this.setState({
      isShowList: !this.state.isShowList,
      isShowView: false,
      isShowDelete: false,
      isShowEdit: !this.state.isShowEdit,

      selectedSupportData: data
    })
    // hashHistory.push('/host/support/edit')
    event.preventDefault()
  }
  handleDelete (data) {
    this.setState({ modalIsOpen: true, supportDeleteData: data })
  }
  handleConfirmDeleteUser () {
    this.setState({ modalIsOpen: false })
    let supportData = this.state.supportData
    const index = supportData.findIndex(dataObj => dataObj._id === this.state.supportDeleteData._id)
    let obj = {
      url: config.baseUrl + config.deleteEUSupportDeleteAPI + this.state.supportDeleteData._id
    }
    let _this = this
    APICallManager.deleteCall(obj, function (resObj) {
      if (resObj.data.statusCode === '1205') {
        supportData.splice(index, 1)
        _this.setState({ supportData: supportData })
      } else {
        _this.setState({ errorMessage: t`lanSPErrorDeleteFailed` })
      }
    })
  }
  closeModal () {
    this.setState({ modalIsOpen: false })
  }

  render () {
    return (
      <div className='main-content eu-support' id='panel'>
        <div className='container-fluid mt-5 pb-5'>
          <div className='row justify-content-center'>
            <div className='col-lg-3' >
              <EUProfileSideMenu authObj={this.state.authObj} />
            </div>
            <div className='col-lg-9' >
              {this.state.isShowList
              ? <div className='edit-profile-info preference'>
                <div className='card'>
                  <div className='card-header card-header-danger'>
                    <h4 className='card-title'>{t`lanSPTitleSupport`}</h4>
                  </div>
                  {/* edit prfile htmlForm */}
                  <div className='edit-profile-form'>
                    <div className='card-body'>
                      <div className='row justify-content-end'>
                        <div className='col-sm-6 eu-support-search'>
                          {/* -- Search form -- */}
                          <form>
                            <div className='form-group mb-0'>
                              <div className='input-group col-sm-12 input-group-lg input-group-flush'>
                                <div className='input-group-prepend'>
                                  <div className='input-group-text'>
                                    <span className='fas fa-search' />
                                  </div>
                                </div>
                                <input type='search' className='form-control' placeholder={t`lanCommonLabelSearch`} value={this.state.searchString} onChange={this.handleInputChange} />
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                      <Tabs onSelect={(index, label) => console.log(label + ' selected')}
                        headerClass='tab-header-bold' activeHeaderClass='tab-header-blue'>
                        <Tab label={t`lanEUButtonTicketList`}>
                          <div >
                            {this.state.supportData.length > 0
                              ? <div className='card-body card-list'>
                                {this.state.supportData.map((item, i) =>
                                  <div className='card-each-list' key={i}>
                                    <div className='row align-items-center mb-2'>
                                      <div className='col-sm-4'>
                                        <h5 className='mb-0 text-sm'>{item.ticket}</h5>
                                      </div>
                                      <div className='col-sm-2'>
                                        <h5 className='mb-0 text-sm'>{item.ticketNumber}</h5>
                                      </div>
                                      <div className='col-sm-2'>
                                        <h5 className='mb-0 text-sm'>{moment(item.createdAt).format('MMM DD, YYYY')}</h5>
                                      </div>
                                      <div className='col-sm-2'>
                                        <h5 className='mb-0 text-sm'>{item.status}</h5>
                                      </div>
                                      <div className='col-sm-2'>
                                        <div className='row align-items-center mt-0'>
                                          <div className='col-sm-12 text-center ticket-actions'>
                                            {/* <a onClick={() => this.handleViewSupport(item)} className='update-edit' title='View Ticket'>
                                              <span className='avatar avatar-md mr-0 bg-primary rounded-circle'>
                                                <span className='media-object d-flex justify-content-center align-items-center'><i className='far fa-eye' /></span>
                                              </span>
                                            </a> */}
                                            <a onClick={() => this.handleEditSupport(item, false)} className='mr-1 update-edit ' title='Edit Ticket' >
                                              <span className='avatar avatar-md mr-0 bg-success rounded-circle'>
                                                <span className='media-object d-flex justify-content-center align-items-center'><i className='fas fa-edit' /></span>
                                              </span>
                                            </a>
                                            <a onClick={() => this.handleDelete(item)} className='ml-1 update-edit' title='Delete Ticket'>
                                              <span className='avatar avatar-md mr-0 bg-danger rounded-circle'>
                                                <span className='media-object d-flex justify-content-center align-items-center'><i className='fas fa-trash' /></span>
                                              </span>
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <p className='ticket-msg'>{item.ticketDescription}.</p>

                                  </div>
                                )}
                              </div>
                              : this.state.supportData.length <= 0
                              ? <div className='container'>
                                <div className='row justify-content-center'>
                                  <div className='col-sm-12 text-center my-0' >
                                    <div className='no-data'><p>{t`lanCommonLabelNoResultsFound`}</p></div>
                                  </div>
                                </div>
                              </div>
                             : null
                            }
                          </div>
                          <Modal isOpen={this.state.modalIsOpen} style={customStyles} >
                            <div className='container modalOne'>
                              <div className='row my-2'>
                                <div className='col-sm-12 text-right'>
                                  <a onClick={this.closeModal} ><i className='fas fa-times' /> </a>
                                </div>
                                <div className='col-sm-12 m-3'>
                                  <p>{t`lanCommonLabelDeleteNote`}</p>
                                </div>
                              </div>
                              <div className='row my-3'>
                                <div className='col-sm-12 text-center'>
                                  <button className='btn btn-primary mr-2 btn-text-white' onClick={this.handleConfirmDeleteUser}>{t`lanCommonButtonConfirm`}</button>
                                  <button className='btn btn-danger btn-text-white' onClick={this.closeModal}>{t`lanCommonButtonCancel`}</button>
                                </div>
                              </div>
                            </div>
                          </Modal>
                        </Tab>
                        <Tab label={t`lanEUButtonNewTicket`}>
                          <EUSupportCreateComponent handleCreateSupport={this.handleCreateSupport} />
                        </Tab>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>
              // : this.state.isShowView ? <EUSupportViewComponent selectedSupportData={this.state.selectedSupportData} handleViewSupport={this.handleViewSupport} />
              : this.state.isShowEdit ? <EUSupportEditComponent selectedSupportData={this.state.selectedSupportData} handleEditSupport={this.handleEditSupport} handleViewSupport={this.handleViewSupport} />
                // : this.state.isShowDelete ? <EUSupportDeleteComponent handleDeleteSupport={this.handleDeleteSupport} selectedSupportData={this.state.selectedSupportData} />
              : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EUSupportListComponent
