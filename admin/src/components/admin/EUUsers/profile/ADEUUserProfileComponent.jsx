/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'

import config from '../../../../../public/config.json'

import './css/Profile.css'
import { t } from 'ttag'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import ADEUUserProfileEdit from './ADEUUserProfileEditComponent'
import ADEUUserProfileIDProofList from './ADEUUserProfileIdProofsListComponent'
import ADEUUserProfilePreferences from './ADEUUserProfilePreferencesComponent'
import ADEUUserProfileChangePassword from './ADEUUserProfileChangePasswordComponent'
import ADEUUserProfileIDProofEdit from './ADEUUserProfileIdProofEditComponent'

class ADEUUserProfileComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      euUserData: JSON.parse(localStorage.getItem('euUserData')),
      selectedOption: 'profileEdit',
      firstName: '',
      lastName: '',
      displayName: '',
      email: '',
      mobileNumber: '',
      area: '',
      address: '',
      userIconPath: '',
      imgSrc:''
    }
    this.handleEditProfile = this.handleEditProfile.bind(this)
    this.handleAddIdProof = this.handleAddIdProof.bind(this)
    this.handlePreference = this.handlePreference.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleEditIdProof = this.handleEditIdProof.bind(this)
    this.updatedata = this.updatedata.bind(this)
    this.toastFunc = this.toastFunc.bind(this)
  }

  componentWillMount () {
    let euUserData = JSON.parse(localStorage.getItem('euUserData'))
    if (euUserData && euUserData.firstName) {
      this.setState({
        euUserData: euUserData,
        firstName: euUserData.firstName,
        lastName: euUserData.lastName,
        displayName: euUserData.displayName,
        mobileNumber: !euUserData.mobileNumber.includes('@') ? euUserData.mobileNumber : '',
        email: euUserData.email ? euUserData.email : '',
        address: euUserData.address ? euUserData.address : '',
        dob: euUserData.dob ? euUserData.dob : '',
        iconPath: euUserData.userIconPath ? euUserData.userIconPath : '',
        iconOriginalName: euUserData.userIconOriginalName ? euUserData.userIconOriginalName : '',
        userIcon: euUserData.userIcon ? euUserData.userIcon : ''
      })
    }
  }

  handleEditProfile () {
    this.setState({
      selectedOption : 'profileEdit'
    })
  }
  handleAddIdProof () {
    this.setState({
      selectedOption : 'IdProofList'
    })
  }
  handlePreference () {
    this.setState({
      selectedOption : 'preferences'
    })
  }
  handleChangePassword () {
    this.setState({
      selectedOption : 'changePassword'
    })
  }
  handleEditIdProof () {
    this.setState({
      selectedOption : 'IdProofEdit'
    })
  }
  updatedata (data, euUserData) {
    this.setState({
      imgSrc: data,
      displayName:euUserData.displayName,
      email:euUserData.email,
      address:euUserData.address
    })
  }

  toastFunc (value) {
    switch (value) {
      case 'No Changes to Update':
        ToastsStore.error('No Changes to Update ')
        break
      case 'Id Proof Updated Successfully':
        ToastsStore.success('Id Proof Updated Successfully')
        break
      case 'Id Proof Update Failed':
        ToastsStore.error('Id Proof Update Failed')
        break
      case 'Preferences Updated Successfully':
        ToastsStore.success('Preferences Updated Successfully')
        break
      case 'Preferences Update Failed':
        ToastsStore.error('Preferences Update Failed')
        break
      case 'Profile Updated Successfully':
        ToastsStore.success('Profile Updated Successfully')
        break
      case 'Profile Update Failed':
        ToastsStore.error('Profile Update Failed')
        break
      case 'Password Updated Successfully':
        ToastsStore.success('Password Updated Successfully')
        break
      case 'Password Update Failed':
        ToastsStore.error('Password Update Failed')
        break
      case 'ID Proof Created Successfully':
        ToastsStore.success('ID Proof Created Successfully')
        break
      case 'ID Proof Create Failed':
        ToastsStore.error('ID Proof Create Failed')
        break
      case 'Number Already Exist':
        ToastsStore.error('Number Already Exist')
        break
      case 'Update Your Profile':
        ToastsStore.warning('Update Your Profile')
        break
      case 'status inactivation failed':
        ToastsStore.warning('status inactivation failed')
        break
      default:
        // code block
    }
  }
  render () {
    return (
      <div className='Profile-page-wrapper' id='panel'>
        <div className='container-fluid mt-4 pt-1'>
          <div className='row'>
            <div className='col-sm-3'>
              <div style={{ fontFamily: 'Lato' }}>
                <div className='profile-info'>
                  <div className='card card-profile'>
                    <div className='card-avatar'>
                      <a>
                        {/* <img className='img' src={require('../../../../../assets/avatar_01.jpg')} /> */}
                        <img className='img' src={this.state.imgSrc.length ? this.state.imgSrc : (this.state.euUserData && this.state.euUserData.userIconPath)
                         ? config.baseUrl + this.state.euUserData.userIconPath : require('../../../../../assets/profile-icon.png')} />
                      </a>
                    </div>
                    <div className='card-body'>
                      <h5 className='h3 title'>
                        <span className='d-block mb-1'>{this.state.displayName}</span>
                      </h5>
                      <p className='card-text user-address'>{this.state.address}</p>
                      <div style={{ display: 'flex' }}>
                        <h6 className='card-category '><span><i className='fa fa-mobile pr-2' /></span>{this.state.mobileNumber}</h6>
                        <div className='verify-div profile-mobile-num'>
                          <span className='verift-icon'><i className='fas fa-check-circle text-green' /></span>
                        </div>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <h6 className='card-category email'><span><i className='fa fa-envelope pr-2' /></span>{this.state.email}</h6>
                        <div className='verify-div profile-email-num'>
                          <span className='verift-icon'><i className='fas fa-check-circle text-green' /></span>
                        </div>
                      </div>
                      <hr />
                      <a onClick={this.handleEditProfile} >
                        <h4 className='card-title route-opt'>{t`lanEUButtonEditProfile`}</h4>
                      </a>
                      <hr />
                      <a onClick={this.handleAddIdProof} >
                        <h4 className='card-title route-opt'>{t`lanEUButtonIDProofs`}</h4>
                      </a>
                      <hr />
                      <a onClick={this.handlePreference} >
                        <h4 className='card-title route-opt'>{t`lanEUButtonPreferences`}</h4>
                      </a>
                      <hr />
                      <a onClick={this.handleChangePassword} >
                        <h4 className='card-title route-opt'>{t`lanADTitlePaswordReset`}</h4>
                      </a>
                      <hr />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-9' >
              {/*  coponents will be called below */}
              {
                this.state.selectedOption === 'profileEdit' ? <ADEUUserProfileEdit toastFunc={this.toastFunc} updatedata={this.updatedata} />
                : this.state.selectedOption === 'IdProofList' ? <ADEUUserProfileIDProofList toastFunc={this.toastFunc} handleEditIdProof={this.handleEditIdProof} />
                : this.state.selectedOption === 'preferences' ? <ADEUUserProfilePreferences toastFunc={this.toastFunc} handleHome={this.handleEditProfile} />
                : this.state.selectedOption === 'changePassword' ? <ADEUUserProfileChangePassword toastFunc={this.toastFunc} handleHome={this.handleEditProfile} />
                : this.state.selectedOption === 'IdProofEdit' ? <ADEUUserProfileIDProofEdit toastFunc={this.toastFunc} handleHome={this.handleEditProfile} />
                : <p>no data found</p>
              }
            </div>
          </div>
        </div>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}
export default ADEUUserProfileComponent

