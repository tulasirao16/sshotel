/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
// import ReactDrawer from 'react-drawer'
// import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import PropTypes from 'prop-types'
import { t } from 'ttag'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import Modal from 'react-modal'

// import Switch from 'react-switch'
import 'react-datepicker/dist/react-datepicker.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

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
class SPFavouriteViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      disabled: true,
      errorMessage: '',
      selectedFavData: this.props.selectedFavData,
      status: this.props.selectedFavData.status,
      modalIsOpen: false
    }
    this.handleConfirmDeleteFavUser = this.handleConfirmDeleteFavUser.bind(this)
    this.handleUnfavourite = this.handleUnfavourite.bind(this)
    this.handleFavourite = this.handleFavourite.bind(this)
  }

  componentWillReceiveProps (newProps) {
    this.setState({ selectedFavData : newProps.selectedFavData, status: newProps.selectedFavData.status })
  }

  handleUnfavourite (data) {
    let unFavouriteObj = {
      spPropertyId: data.spPropertyId._id,
      userID: data.euUserId._id,
      recordID: data._id
    }
    let _this = this
    let obj = { url: config.baseUrl + config.putSPFavouriteUserUnfavourite, body: unFavouriteObj }
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ status: 'Unfavourite' })
      }
    })
  }

  handleFavourite (data) {
    let FavouriteObj = {
      spPropertyId: data.spPropertyId._id,
      userID: data.euUserId._id,
      recordID: data._id
    }
    let _this = this
    let obj = { url: config.baseUrl + config.putSPFavouriteUserFavourite, body: FavouriteObj }
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ status: 'Favourite' })
      }
    })
  }

  handleBack () {
    if (this.state.status === 'Unfavourite') {
      this.props.handleViewBack(false, this.state.selectedFavData)
    } else {
      this.props.handleViewBack(true, this.state.selectedFavData)
    }
  }

  handleConfirmDeleteFavUser (data) {
    this.setState({ modalIsOpen: false })
    let deleteObj = {
      spPropertyId: data.spPropertyId._id,
      userID: data.euUserId._id,
      recordID: data._id
    }
    let _this = this
    let obj = { url: config.baseUrl + config.putSPFavouriteUserDelete, body: deleteObj }
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.props.handleUserDelete(data)
      } else {
        _this.setState({ errorMessage: t`lanCommonLabelErrorRecordDeleteFailed` })
      }
    })
  }

  render () {
    return (
      <div >
        <div className='container-fluid mt--6 '>
          <div className='row justify-content-center favourites-view'>
            <div className='col-lg-10 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <h6 className='h2'>{t`lanSPSubTitleViewFavouriteUser`}</h6>
                    </div>
                    <div className='col-md-6'>
                      <div className='text-right'>
                        {this.state.status === 'Favourite' ? <a style={{ marginRight:10, color:'red' }} onClick={() => this.handleUnfavourite(this.state.selectedFavData)} ><i className='fas fa-heart' /></a>
                          : <a style={{ marginRight:15, color:'red' }} onClick={() => this.handleFavourite(this.state.selectedFavData)} ><i className='far fa-heart' /></a>}
                        <a style={{ color:'#02608d' }} onClick={() => this.setState({ modalIsOpen: true })} ><i className='fas fa-trash' /></a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card-body'>
                  <section className='notifications'>
                    <div>
                      <ul className='list-group list-group-flush list my--3'>
                        <li className='list-group-item px-0'>
                          <div className='row align-items-center'>
                            <div className='col'>
                              <small className='view-title'>{ t`lanCommonLabelName` }</small>
                              <h5 className='mb-0'>{(this.state.selectedFavData && this.state.selectedFavData.euUserId) ? this.state.selectedFavData.euUserId.displayName : ''}</h5>
                            </div>
                            <div className='col'>
                              <small className='view-title' >{ t`lanCommonLabelMobileNumber` }</small>
                              <h5 className='mb-0'>{(this.state.selectedFavData && this.state.selectedFavData.euUserId) ? this.state.selectedFavData.euUserId.mobileNumber : ''}</h5>
                            </div>
                            <div className='col'>
                              <small className='view-title'>{ t`lanCommonLabelEmail` }</small>
                              <h5 className='mb-0'>{(this.state.selectedFavData && this.state.selectedFavData.euUserId) ? this.state.selectedFavData.euUserId.email : ''}</h5>
                            </div>
                            <div className='col'>
                              <small className='view-title'>{ t`lanCommonLabelBusiness` }</small>
                              <h5 className='mb-0'>{(this.state.selectedFavData && this.state.selectedFavData.spPropertyId) ? this.state.selectedFavData.spPropertyId.propertyTitle : ''}</h5>
                            </div>
                          </div>
                        </li>
                        <li className='list-group-item px-0'>
                          <div className='row align-items-center'>
                            <div className='col'>
                              <small className='view-title'>{t`lanCommonLabelPropertyArea`}</small>
                              <h5 className='mb-0'>{(this.state.selectedFavData.spPropertyId && this.state.selectedFavData.spPropertyId.spLocationObj) ? this.state.selectedFavData.spPropertyId.spLocationObj.area : ''}</h5>
                            </div>
                            <div className='col'>
                              <small className='view-title'>{t`lanCommonLabelPropertyCity`}</small>
                              <h5 className='mb-0'>{(this.state.selectedFavData.spPropertyId && this.state.selectedFavData.spPropertyId.spLocationObj) ? this.state.selectedFavData.spPropertyId.spLocationObj.city : ''}</h5>
                            </div>
                            <div className='col'> {/* empty */} </div>
                            <div className='col'> {/* empty */} </div>
                          </div>
                        </li>
                      </ul>
                      <div className='row'>
                        <div className='container'>
                          <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
                        </div>
                        <div className='col-sm-12 text-center'>
                          <button className='btn btn-primary update-edit' onClick={() => this.handleBack()}>{t`lanCommonButtonBack`}</button>
                        </div>
                      </div>
                    </div>
                  </section>
                  <Modal
                    isOpen={this.state.modalIsOpen}
                    style={customStyles}
                  >
                    <h2 >{t`lanCommonLabelDeleteNote`}</h2>
                    <button className='btn btn-primary mr-2' onClick={() => this.handleConfirmDeleteFavUser(this.state.selectedFavData)}>{t`lanCommonButtonConfirm`}</button>
                    <button className='btn btn-danger' onClick={() => this.setState({ modalIsOpen: false })}>{t`lanCommonButtonCancel`}</button>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SPFavouriteViewComponent.propTypes = {
  selectedFavData: PropTypes.any,
  handleViewBack: PropTypes.any
}

export default SPFavouriteViewComponent
