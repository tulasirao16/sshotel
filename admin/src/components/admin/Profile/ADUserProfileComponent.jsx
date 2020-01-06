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
    import { fetch as fetchPolyfill } from 'whatwg-fetch'
    import axios from 'axios'
    import { t } from 'ttag'
    import DatePicker from 'react-datepicker'
    import moment from 'moment'
    import classnames from 'classnames'
    import PropTypes from 'prop-types'
    // import DrawerWithHeader from '../../../components/serviceproviders/Drawer/DrawerComponent'

    import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

    const myApi = axios.create()

    import '../css/all.min.css'
    import '../css/argon.min.css'
    import '../css/nucleo.css'

    class ADUserProfileComponent extends React.Component {
      constructor () {
        let maxDate = moment().subtract(18, 'years').format('YYYY-MM-DD')
        super()
        this.state = {
          firstName: '',
          lastName: '',
          displayName: '',
          email: '',
          mobileNumber: '',
          userAccount: '',
          userRole: '',
          address: '',
          dob: '',
          userIconPath: '',
          image: '',
          data: {},
          authObj: {},
          iconPath: '',
          iconOriginalName: '',
          userIcon: '',
          file: [],
          imgsrc: [],
          _id: '',
          errorMessage: '',
          activeProfileTitle: true,
          disabled: true,
          maxDate: new Date(moment(maxDate).format('YYYY-MM-DD'))
        }
        this.onFileChange = this.onFileChange.bind(this)
        this.updateProfiledetails = this.updateProfiledetails.bind(this)
        this.handleUserProfile = this.handleUserProfile.bind(this)
        this.handleAddressDetails = this.handleAddressDetails.bind(this)
        this.handleIDProofs = this.handleIDProofs.bind(this)
        this.handlePreferences = this.handlePreferences.bind(this)
        this.handleBusinessInfo = this.handleBusinessInfo.bind(this)
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.handleLogOut = this.handleLogOut.bind(this)
        this.handleEnableEdit = this.handleEnableEdit.bind(this)
        this.handleChangeDate = this.handleChangeDate.bind(this)
        this.handleHome = this.handleHome.bind(this)
      }
      componentWillMount () {
        let authObj = JSON.parse(localStorage.getItem('authObj'))
        if (authObj && authObj.userRole) {
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
            spServiceProvider: authObj.spServiceProvider
          })
        }
      }
      handleUserProfile () {
        this.setState({ activeProfileTitle: true })
        hashHistory.push('/admin/profile')
        event.preventDefault()
      }
      handleAddressDetails () {
        hashHistory.push('/host/user/profile/address')
        event.preventDefault()
      }
      handleIDProofs () {
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
      handleMobileNumKeys (event) {
        if ((event.charCode >= 32 && event.charCode < 48 && event.charCode !== 40 &&
          event.charCode !== 41 && event.charCode !== 43 && event.charCode !== 45) ||
          (event.charCode > 57 && event.charCode < 127)) {
          event.preventDefault()
        }
      }
      handleChangeDate (date) {
        this.setState(prevState => {
          let authObj = Object.assign({}, prevState.authObj)
          let errorMessage = ''
          authObj.dob = date
          return { authObj, errorMessage }
        })
      }
      onFileChange (e) {
        this.setState({ file: e.target.files[0] })
        var file = e.target.files[0]
        var fileType = file.type ? file.type.split('/')[0] : ''
        if (fileType !== 'image') {
          this.setState({ errorMessage1: t`lanEULabelErrorUploadValidImage` })
        } else {
          var reader = new FileReader()
          var url = reader.readAsDataURL(file)
          reader.onloadend = function (e) {
            this.setState({
              imgsrc: [reader.result], errorMessage1: ''
            })
          }.bind(this)
          console.log('url', url)
        }
      }

      updateProfiledetails () {
        let newAuthObj = this.state.authObj
        const emailValidation = /^[a-z0-9._%+-]+@[a-z0-9.-]+[\.]{1}[a-z]{2,4}$/
        const phValidation = /^((\(\d{3}\))|\d{3,4})(\-|\s)?(\d{3})(\-|\s)?(\d{1,4})(\-|\s)?(\d{1,3})$/
        if (this.state.errorMessage1) {
          this.setState({ errorMessage1: t`lanEULabelErrorUploadValidImage` })
        } else if (!this.state.firstName.trim()) {
          this.setState({ errorMessage: t`lanCommonLabelErrorFirstNameRequired` })
        } else if (!this.state.lastName.trim()) {
          this.setState({ errorMessage: t`lanCommonLabelErrorLastNameRequired` })
        } else if (!this.state.displayName.trim()) {
          this.setState({ errorMessage: t`lanCommonLabelErrorDisplayNameRequired` })
        } else if (!this.state.mobileNumber) {
          this.setState({ errorMessage: t`lanSPLabelErrorMobileNumberRequired` })
        } else if (!phValidation.test(this.state.mobileNumber)) {
          this.setState({ errorMessage: t`lanSPLabelErrorInvalidMobileNumber` })
        } else if (!this.state.email) {
          this.setState({ errorMessage: t`lanSPLabelErrorEmailRequired` })
        } else if (!emailValidation.test(this.state.email)) {
          this.setState({ errorMessage: t`lanSPLabelErrorInvalidEMail` })
        } else if (!this.state.address) {
          this.setState({ errorMessage: t`lanSPLabelErrorAdressRequired` })
        } else {
          this.setState({ disabled: true })
          var dateNumber = ''
          if (this.state.authObj.dob) {
            dateNumber = moment.utc(this.state.authObj.dob).valueOf()
          }
          let _this = this
          let DoB = this.state.authObj && this.state.authObj.dob ? moment(this.state.authObj.dob).format('YYYY-MM-DD') : ''
          // let DoB = this.state.authObj.dob ? moment(this.state.authObj.dob).format('YYYY-MM-DD') : ''
          const data = new FormData()
          data.append('profileImage', this.state.file)
          data.append('profilefirstName', this.state.firstName)
          data.append('profilelastName', this.state.lastName)
          data.append('profiledisplayName', this.state.displayName)
          data.append('profileuserAccount', this.state.userAccount)
          data.append('profilemobileNumber', this.state.mobileNumber)
          data.append('profileemail', this.state.email)
          data.append('profiledob', DoB)
          data.append('dobNumber', dateNumber)
          data.append('profileaddress', this.state.address)
          data.append('serviceproviderImageFilePath', this.state.iconPath)
          data.append('serviceproviderImageFileName', this.state.iconOriginalName)
          fetchPolyfill(config.baseUrl + config.putADUserProfileAPI, {
            method: 'PUT',
            body: data,
            headers: { 'token': localStorage.getItem('token') }
          }).then((response) => {
            response.json().then((body) => {
              if (response.headers.get('token')) {
                localStorage.setItem('token', response.headers.get('token'))
              }
              if (response.status === 200) {
                newAuthObj.firstName = body.statusResult.firstName
                newAuthObj.lastName = body.statusResult.lastName
                newAuthObj.displayName = body.statusResult.displayName
                newAuthObj.mobileNumber = body.statusResult.mobileNumber
                newAuthObj.email = body.statusResult.email
                newAuthObj.dob = body.statusResult.dob ? body.statusResult.dob : ''
                newAuthObj.userIconPath = body.statusResult.userIconPath
                newAuthObj.userIconOriginalName = body.statusResult.userIconOriginalName
                newAuthObj.userIcon = body.statusResult.userIcon
                localStorage.setItem('authObj', JSON.stringify(newAuthObj))
                ToastsStore.success('Profile Updated Successfully')
                this.props.updateAuthObj()
                this.props.updateProfilePic(this.state.imgsrc)
              } else {
                _this.setState({ disabled: false })
                ToastsStore.error('Profile Update Failed')
              }
            })
          })
        }
      }
      handleEnableEdit () {
        this.setState({
          disabled: false
        })
      }
      handleHome () {
        hashHistory.push('/admin/home')
        event.preventDefault()
      }
      render () {
        return (
          <div>
            {/* <DrawerWithHeader set={this.state.success} /> */}
            {/* ---------- Header Starts ------------- */}
            <div className='header bg-primary pb-6'>
              <div className='container'>
                <div className='header-body'>
                  <div className='row align-items-center py-4'>
                    <div className='col-lg-6 col-7'>
                      <h6 className='h2 text-white d-inline-block mb-0'>{ t`lanSPTitleProfile` }</h6>
                      <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                        <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                          <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                          <li className='breadcrumb-item active' aria-current='page'>Profile</li>
                        </ol>
                      </nav>
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
                          <img src={this.state.authObj.userIconPath ? config.baseUrl + this.state.authObj.userIconPath : require('../images/profile-icon.png')} className='rounded-circle' />
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
                                <p style={{ fontSize:13 }}><span ><i className='fas fa-envelope pr-2 pl-1' /></span>{this.state.email}</p>
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
                          <a className={classnames({ 'active-profile-title' :this.state.activeProfileTitle })} onClick={this.handleUserProfile} >{ t`lanSPTitleUserProfile` }</a>
                        </li>
                        {/* <li>
                          <a onClick={this.handleAddressDetails} >{ t`lanSPTitleAddressDetails` }</a>
                        </li> */}
                        <li>
                          <a onClick={this.handleIDProofs} >{ t`lanSPTitleIDProofs` }</a>
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
                      <div className='row'>
                        <div className='col-sm-12'>
                          {this.state.disabled
                          ? <h5 className='card-title'>Profile</h5>
                          : <h5 className='card-title'>{ t`lanSPTitleEditProfile` }</h5>
                          }
                        </div>
                        <div className='text-left enable-edit'>
                          <a onClick={this.handleEnableEdit} title='Click To Edit Profile' >
                            <span>
                              <i className='fas fa-edit' style={this.state.disabled
                                 ? { color: '#32325c', fontSize: 18, position: 'absolute', top:16, left: 106 } : { color: '#32a3a3', fontSize: 18, position: 'absolute', top:16, left: 145 }} />
                            </span></a>
                        </div>
                      </div>
                    </div>
                    <div className='card-body user-profile-card-body'>
                      <div className='row justify-content-center'>
                        <div className='col-lg-2 mb-4 py-2 mt-4 mb-2'>
                          <div className='card-profile-image rounded-circle'>
                            <img src={this.state.imgsrc.length ? this.state.imgsrc : (this.state.authObj.userIconPath
                              ? config.baseUrl + this.state.authObj.userIconPath : require('../images/profile-icon.png'))} className='rounded-circle' />
                          </div>
                          <div className='card-header text-center border-0 mb-4 pb-0 pb-md-4'>
                            <div className='d-flex justify-content-between'>
                              <a className='btn-camera' onClick={(e) => this.refs.handleFileSelect.click()}><i className='fas fa-camera' /></a>
                              <input ref='handleFileSelect' name='supplier-profile' type='file' onChange={this.onFileChange} style={{ display: 'none' }} disabled={this.state.disabled} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='text-center'>
                        <span className='text-danger'>{this.state.errorMessage1}</span>
                      </div>
                      <div className='row pt-4'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <label>{t`lanCommonLabelFirstName`}<span style={{ color: 'red' }}>*</span></label>
                            <input type='text' className='form-control' placeholder='First Name' maxLength='40' value={this.state.firstName}
                              onChange={() => this.setState({ firstName: event.target.value, errorMessage: '' })} disabled={this.state.disabled} />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <label>{t`lanCommonLabelLastName`}<span style={{ color: 'red' }}>*</span></label>
                            <input type='text' className='form-control' placeholder='Last Name' id='lastName' maxLength='40' value={this.state.lastName}
                              onChange={() => this.setState({ lastName: event.target.value, errorMessage: '' })} disabled={this.state.disabled} />
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <label>{t`lanCommonLabelDisplayName`}<span style={{ color: 'red' }}>*</span></label>
                            <input type='text' className='form-control' placeholder='Display Name' maxLength='20' value={this.state.displayName}
                              onChange={() => this.setState({ displayName: event.target.value, errorMessage: '' })} disabled={this.state.disabled} />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <label>{t`lanCommonLabelMobileNumber`}<span style={{ color: 'red' }}>*</span></label>
                            <input type='text' className='form-control' placeholder='Mobile Number' maxLength='10' onKeyPress={this.handleMobileNumKeys} value={this.state.mobileNumber}
                              onChange={() => this.setState({ mobileNumber: event.target.value, errorMessage: '' })} disabled={this.state.disabled} />
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <label>{t`lanCommonLabelEmail`}<span style={{ color: 'red' }}>*</span></label>
                            <input type='email' className='form-control' placeholder='email' value={this.state.email} maxLength='80'
                              onChange={() => this.setState({ email: event.target.value, errorMessage: '' })} disabled={this.state.disabled} />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <label>{t`lanCommonLabelUserID`}</label>
                            <input type='text' className='form-control' placeholder='User ID' value={this.state.userAccount} disabled={this.state.disabled} />
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <label>{t`lanCommonLabelUserRole`}</label>
                            <input type='text' className='form-control' placeholder='User Role' value={this.state.userRole} disabled={this.state.disabled} />
                          </div>
                        </div>
                        <div className='col-md-3 pr-1'>
                          <div className='form-group'>
                            <label>{ t`lanCommonLabelDateOfBirth` }</label>
                            <DatePicker
                              maxDate={this.state.maxDate}
                              selected={(this.state.dob)
                                ? new Date(moment(this.state.authObj.dob).year(), moment(this.state.authObj.dob).month(), moment(this.state.authObj.dob).date()) : null}
                              filterDate={(date) => {
                                return moment() > date
                              }}
                              className={classnames('enableElement', { 'disableElement': this.state.disabled })}
                              onSelect={this.handleChangeDate}
                              value={(this.state.authObj && this.state.authObj.dob) ? moment(this.state.authObj.dob).format('MMM DD, YY') : null}
                              // maxDate={moment().subtract(18, 'years').format('YYYY-MM-DD')}
                              showYearDropdown
                              showMonthDropdown
                              disabled={this.state.disabled}
                            />
                            <i className='far fa-calendar-alt icon-cal' />
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-12'>
                          <div className='form-group'>
                            <label>{t`lanCommonLabelAddress`}</label>
                            <textarea className='form-control textarea' maxLength='80' value={this.state.address}
                              onChange={() => this.setState({ address: event.target.value, errorMessage: '' })} disabled={this.state.disabled}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-md-12 text-center'>
                          <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-sm-12 text-center'>
                          {!this.state.disabled
                            ? <button disabled={this.state.disabled} className='btn btn-primary' onClick={this.updateProfiledetails}>{ t`lanCommonButtonUpdate` }</button>
                          : null }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
            </div>
          </div>
        )
      }
    }
    ADUserProfileComponent.propTypes = {
      updateAuthObj:PropTypes.any,
      updateProfilePic:PropTypes.any
    }
    export default ADUserProfileComponent
