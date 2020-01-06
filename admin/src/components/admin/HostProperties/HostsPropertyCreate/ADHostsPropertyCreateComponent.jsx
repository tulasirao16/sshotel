/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import async from 'async'
import { Player } from 'video-react'

import '../../../../../node_modules/video-react/dist/video-react.css'
import { hashHistory } from 'react-router'
import { fetch as fetchPolyfill } from 'whatwg-fetch'
import { Carousel } from 'react-responsive-carousel'
import '../../css/carousel.min.css'
import Modal from 'react-modal'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

import { t } from 'ttag'
import 'react-drawer/lib/react-drawer.css'
import config from '../../../../../public/config.json'
import ADHostsPropertyLocationCreate from './ADHostsPropertyLocationCreate'
import ADHostsPropertyNearestAreasCreate from './ADHostsPropertyNearestAreasCreate'
import ADHostsBlockedDatesPropertyCreateComponent from './ADHostsBlockedDatesPropertyCreateComponent'
import ADHostsPropertyInfoCreate from './ADHostsPropertyInfoCreate'
import ADHostsPropertyImages from './ADHostsPropertyImages'
import '../../css/all.min.css'
import '../../css/argon.min.css'
import '../../css/nucleo.css'
import Amenities from '../../../../../assets/amenities/amenities.json'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '30%',
    textAlign             : 'center'
  }
}

class ADHostsPropertyCreateComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      intialAmenities: Amenities,
      reload: false,
      propertyTitle: '',
      aboutProperty: '',
      propertyType: 'Hotel',
      propertyCapacity: 0,
      noOfRooms: 0,
      activeRooms: 0,
      onHoldRooms: 0,
      singleBedsCount: 0,
      doubleBedsCount: 0,
      privateBathRooms: 0,
      acsCount: 0,
      kitchensCount: 0,
      hallsCount: 0,
      imagePath: '',
      spLocationObj: {},
      nearestAreas: [],
      blockedDatesObj: {},
      files: {},
      createProperty: 'create',
      propertyInfoAction: false,
      photosStatus: false,
      images: [],
      video: [],
      videoFiles: {},
      errorMessage: '',
      videoErrorMessage: '',
      duplicateAmenities: Amenities,
      amenitiesObj: Amenities,
      modalIsOpen: false,
      imagesChoosedLength: '',
      buttonView: false,
      videoError: false
    }
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  componentWillMount () {
    // let authObj = JSON.parse(localStorage.getItem('authObj'))
    let hostData = JSON.parse(localStorage.getItem('hostData'))
    if (hostData && (hostData.spServiceProviderId ? hostData.spServiceProviderId : hostData._id)) {
      this.setState({ propertyTitle: (hostData.spServiceProviderId ? hostData.spServiceProviderId : hostData._id) && hostData.serviceProvider ? hostData.serviceProvider : '' })
    } else {
      // hashHistory.push('/host/signin')
    }
  }
  componentDidMount () {
  }
  openModal () {
    this.setState({ modalIsOpen: true })
  }
  closeModal () {
    this.setState({ modalIsOpen: false })
  }
  commonFunction = (obj, type) => {
    this.setState({ errorMessage: '' })
    if (type === 'locationObj') {
      this.setState({ spLocationObj: obj })
    } else if (type === 'nearestAreas') {
      this.setState({ nearestAreas: obj })
    } else if (type === 'blockedDatesObj') {
      this.setState({ blockedDatesObj: obj })
    }
  }
  imageFunction = (images, files, video, videoFiles, videoError) => {
    // let images = []
    // // let video = []
    // photos.forEach(item => {
    //   if (item && item.indexOf('image') !== -1) {
    //     images.push(item)
    //   }
    // })
    if (!videoError) {
      this.setState({ videoErrorMessage: '', errorMessage: '' })
    }
    this.setState({ images: images, files: files, video: video, videoFiles: videoFiles, photosStatus: false, reload: true, videoError: videoError })
  }
  infoFunction = (infoObj, modified) => {
    this.setState({ errorMessage: '' })
    if (modified) {
      this.setState({ propertyInfoAction: false, propertyInfoObj: infoObj })
    } else {
      this.setState({ propertyInfoAction: false })
    }
  }

  onFileChange = (e) => {
    let filesData = e.target.files
    let files = this.state.files
    let images = this.state.images
    let fileslength = Object.keys(files).length
    let fdLength = Object.keys(filesData).length
    let filesArr = Array.prototype.slice.call(filesData)
    let _this = this
    if ((fileslength + fdLength) <= 10) {
      if (!this.state.videoError) {
        this.setState({ videoErrorMessage: '' })
      }
      async.series([
        function (callback) {
          for (let i = 0; i < fdLength; i++) {
            files[fileslength + i] = filesData[i]
          }
          callback(null, files)
        }, function (callback) {
          for (let i = 0; i < filesArr.length; i++) {
            let f = filesArr[i]
            let reader = new FileReader()
            reader.onloadend = function (e) {
              let data = e.target.result
              images.push(data)
              // _this.setState({
              //   images: [..._this.state.images, data],
              //   reload: true
              // })
            }
            reader.readAsDataURL(f)
          }
          callback(null, images)
        }
      ], function (err, results) {
        if (err) {}
        _this.setState({ modalIsOpen: true, files: files, images: images, reload: true, imagesChoosedLength: fdLength, errorMessage: '' })
        // alert(fdLength + ' Images Selected..!')
      })
    } else {
      this.setState({ videoErrorMessage: t`lanSPErrorImagesOnly` })
    }
  }
  onFileChangeVideo = (e) => {
    if (e.target.files[0] !== undefined) {
      let _this = this
      this.setState({ videoErrorMessage: '', videoError: false })
      let videoFiles = this.state.videoFiles
      let file = e.target.files[0]
      videoFiles[0] = file
      let reader = new FileReader()
      let url = reader.readAsDataURL(file)
      reader.onloadend = function (e) {
        if (file.size > 150000000) {
          this.setState({ videoErrorMessage: t`lanSPErrorVideoSize`, videoError: true })
        } else {
          let media = new Audio(reader.result)
          media.onloadedmetadata = function () {
            if (media.duration > 60) {
              _this.setState({ videoErrorMessage: t`lanSPErrorVideoTime`, videoError: true })
            }
          }
        }
        this.setState({
          video: [reader.result], errorMessage: ''
        })
      }.bind(this)
      this.setState({ videoFiles: videoFiles })
    }
  }
  handleProperty = () => {
    if (this.state.images.length < 1) {
      this.setState({ errorMessage: t`lanSPErrorPropertyImageIsRequired` })
    } else if (!this.state.propertyTitle) {
      this.setState({ errorMessage: t`lanSPErrorPropertyTitleIsRequired` })
    } else if (this.state.videoError) {
      this.setState({ errorMessage: t`lanSPErrorVideoTime` })
    } else if (!this.state.aboutProperty) {
      this.setState({ errorMessage: t`lanSPErrorAboutPropertyIsRequired` })
    } else if (!this.state.propertyType) {
      this.setState({ errorMessage: t`lanSPErrorPropertyTypeIsRequired` })
    } else if (!this.state.spLocationObj.area) {
      this.setState({ errorMessage: t`lanSPErrorAddLocationDetails` })
    } else {
      this.setState({ propertyInfoAction: true })
    }
  }
  handlePropertyCreate = () => {
    // this.setState({ buttonView : true })
    if (this.state.images.length < 1) {
      this.setState({ errorMessage: t`lanSPErrorPropertyImageIsRequired`, buttonView : false })
    } else if (!this.state.propertyTitle.trim()) {
      this.setState({ errorMessage: t`lanSPErrorPropertyTitleIsRequired`, buttonView : false })
    } else if (!this.state.aboutProperty.trim()) {
      this.setState({ errorMessage: t`lanSPErrorAboutPropertyIsRequired`, buttonView : false })
    } else if (this.state.videoError) {
      this.setState({ errorMessage: t`lanSPErrorVideoTime` })
    } else if (!this.state.propertyType) {
      this.setState({ errorMessage: t`lanSPErrorPropertyTypeIsRequired`, buttonView : false })
    } else if (!this.state.spLocationObj.area) {
      this.setState({ errorMessage: t`lanSPErrorAddLocationDetails`, buttonView : false })
    } else if (!this.state.propertyInfoObj.roomType) {
      this.setState({ errorMessage: t`lanSPErrorAddPropertyInfoDetails`, buttonView : false })
    } else {
      this.setState({ buttonView : true })
      let hostData = JSON.parse(localStorage.getItem('hostData'))
      this.state.propertyInfoObj.spServiceProviderId = hostData.spServiceProviderId ? hostData.spServiceProviderId : hostData._id
      this.state.propertyInfoObj.spServiceProvider = hostData.serviceProvider
      const data = new FormData()
      let imageFiles = this.state.files
      let videoFiles = this.state.videoFiles
      let ifLength = Object.keys(imageFiles).length
      let vfLength = Object.keys(videoFiles).length
      let _this = this
      async.series([
        function (callback) {
          for (let i = 0; i < ifLength; i++) {
            data.append('propertyImages', imageFiles[i])
          }
          callback(null, data)
        }, function (callback) {
          for (let j = 0; j < vfLength; j++) {
            data.append('propertyImages', videoFiles[j])
            data.append('fileType', 'Video')
          }
          callback(null, data)
        }
      ], function (err, results) {
        if (err) { }
        data.append('propertyTitle', _this.state.propertyTitle)
        data.append('aboutProperty', _this.state.aboutProperty)
        data.append('propertyType', _this.state.propertyType)
        data.append('status', 'Active')
        data.append('nearestAreas', JSON.stringify(_this.state.nearestAreas))
        data.append('spLocationObj', JSON.stringify(_this.state.spLocationObj))
        data.append('blockedObj', JSON.stringify(_this.state.blockedDatesObj))
        data.append('propertyInfo', JSON.stringify(_this.state.propertyInfoObj))
        data.append('spServiceProviderId', hostData.spServiceProviderId ? hostData.spServiceProviderId : hostData._id)
        data.append('spServiceProvider', hostData.serviceProvider)
        // data.append('propertyInfo', JSON.stringify(_this.state.propertyInfoObj))
        fetchPolyfill(config.baseUrl + config.postADHostsPropertyCreateAPI, {
          method: 'POST',
          body: data,
          headers: {
            'token': localStorage.getItem('token')
          }
        }).then((response) => {
          response.json().then((responseJson) => {
            if (responseJson.statusCode === '0000') {
              ToastsStore.success(t`lanSPSuccessPropertyCreatedSuccessfully`)
              setTimeout(() => {
                hashHistory.push('/admin/host/properties')
                window.location.reload()
              }, 2000)
            } else {
              this.setState({ buttonView : false })
              ToastsStore.error(t`lanSPErrorPropertyCreateFailed`)
            }
          })
        })
      })
    }
  }

  render () {
    return (
      this.state.propertyInfoAction
      ? <ADHostsPropertyInfoCreate amenitiesObj={this.state.amenitiesObj} createProperty={this.state.createProperty} infoFunction={this.infoFunction}
        propertyTitle={this.state.propertyTitle} propertyType={this.state.propertyType} propertyInfoObj={this.state.propertyInfoObj} />
      : <div className='main-content' id='panel'>
        <div className='container-fluid mt--6'>
          <div className='card property-view'>
            <div className='card-header'>
              <div className='row'>
                <div className='col-md-8'>
                  <h5 className='mb-0 card-title'>{this.state.propertyTitle}</h5>
                </div>
                <div className='col-md-4 text-right'>
                  {(this.state.images && this.state.images.length > 0) || (this.state.video && this.state.video.length > 0)
                  ? <div className='custom-file'>
                    <button className='btn btn-info' onClick={() => this.setState({ photosStatus: true })}>View all Images</button>
                  </div> : null}
                </div>
              </div>
            </div>
            <div className='card-body'>
              <div>
                {this.state.photosStatus ? <ADHostsPropertyImages videoError={this.state.videoError} photos={this.state.images} files={this.state.files} imageFunction={this.imageFunction} video={this.state.video} videoFiles={this.state.videoFiles} />
                : <div>
                  <div className='row'>
                    <div className='col-md-6 create-prop-slider image-col'>
                      {this.state.images && this.state.images.length > 0
                      ? <Carousel autoPlay infiniteLoop showThumbs={false}>
                        {this.state.images.map((item, i) =>
                          <div key={i}>
                            <img src={item} key={i} />
                          </div>
                        )}
                      </Carousel>
                      : <div className='dummy-image'>
                        <img src={require('../../../../../assets/no-images-available.jpg')} />
                      </div>}
                      <div className='add-image-btn'>
                        <input type='file' className='custom-file-input' id='files' name='files' accept='image/*' lang='en' onChange={this.onFileChange} multiple />
                        <label className='btn btn-primary add-icon'><i className='far fa-images' />{''} {t`lanSPButtonAddPhotos`}</label>
                      </div>
                    </div>
                    <div className='col-sm-6 video-col'>
                      <div className='dummy-image'>
                        {this.state.video && this.state.video.length > 0
                        ? this.state.video.map((item, i) =>
                          <Player
                            playsInline
                            src={item}
                            key={i}
                            />)
                        : <div className='dummy-image'>
                          <img src={require('../../images/videoDummy.png')} />
                          {/* <input type='file' className='custom-file-input img-input-file' id='files' name='files' accept='video/*' lang='en' onChange={this.onFileChangeVideo} /> */}
                        </div>}
                      </div>
                      <div className='add-image-btn'>
                        <input type='file' className='custom-file-input' id='files' name='files' accept='video/*' lang='en' onChange={this.onFileChangeVideo} />
                        <label className='btn btn-primary add-icon'><i className='far fa-file-video' />{''} {t`lanSPButtonAddVideo`}</label>
                      </div>
                    </div>
                    <label style={{ color:'red' }}>{this.state.videoErrorMessage}</label>
                    <div className='col-md-12 mt-3'>
                      <div className='accordion' id='accordionExample'>
                        <div className='card'>
                          <div className='card-header' id='headingOne' data-toggle='collapse' data-target='#collapseOne' aria-expanded='true' aria-controls='collapseOne'>
                            <h5 className='mb-0'>{t`lanSPSubTitlePropertyDetails`}</h5>
                          </div>
                          <div id='collapseOne' className='collapse show' aria-labelledby='headingOne' data-parent='#accordionExample'>
                            <div className='card-body'>
                              <form>
                                <div className='row'>
                                  <div className='col-md-3'>
                                    <label className='form-control-label'>{t`lanCommonLabelPropertyTitle`}</label>
                                    <input type='text' className='form-control' value={this.state.propertyTitle}
                                      onChange={() => this.setState({ propertyTitle: event.target.value, errorMessage: '' })} />
                                  </div>
                                  <div className='col-md-3'>
                                    <label className='form-control-label'>{t`lanSPLabelPropertyType`}</label>
                                    <select className='form-control' value={this.state.propertyType} onChange={() => this.setState({ propertyType: event.target.value, errorMessage: '' })} >
                                      <option value='Hotel'>Hotel</option>
                                      <option value='Individual House '>Individual House</option>
                                    </select>
                                  </div>
                                  <div className='col-md-6'>
                                    <label className='form-control-label'>{t`lanSPLabelAboutYourProperty`}</label>
                                    <textarea className='form-control' rows='2' value={this.state.aboutProperty} onChange={() => this.setState({ aboutProperty: event.target.value, errorMessage: '' })} />
                                    {/* <label className='form-control-label'>{t`lanSPLabelAboutYourProperty`}</label>
                                    <input type='text' className='form-control' value={this.state.aboutProperty}
                                      onChange={() => this.setState({ aboutProperty: event.target.value, errorMessage: '' })} /> */}
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                        <div className='card'>
                          <div className='card-header' id='headingTwo' data-toggle='collapse' data-target='#collapseTwo' aria-expanded='false' aria-controls='collapseTwo'>
                            <h5 className='mb-0'>{t`lanSPSubTitlePropertyLocationDetails`}</h5>
                          </div>
                          <div id='collapseTwo' className='collapse' aria-labelledby='headingTwo' data-parent='#accordionExample'>
                            <div className='card-body'>
                              <ADHostsPropertyLocationCreate commonFunction={this.commonFunction} spLocationObj={this.state.spLocationObj} />
                            </div>
                          </div>
                        </div>
                        <div className='card'>
                          <div className='card-header' id='headingThree' data-toggle='collapse' data-target='#collapseThree' aria-expanded='false' aria-controls='collapseThree'>
                            <h5 className='mb-0'>{t`lanSPSubTitleNearestAreas`}</h5>
                          </div>
                          <div id='collapseThree' className='collapse' aria-labelledby='headingThree' data-parent='#accordionExample'>
                            <div className='card-body'>
                              <ADHostsPropertyNearestAreasCreate commonFunction={this.commonFunction} nearestAreas={this.state.nearestAreas} spLocationObj={this.state.spLocationObj} />
                            </div>
                          </div>
                        </div>
                        <div className='card'>
                          <div className='card-header' id='headingFour' data-toggle='collapse' data-target='#collapseFour' aria-expanded='false' aria-controls='collapseFour'>
                            <h5 className='mb-0'>{t`lanSPSubTitleBlockedDates`}</h5>
                          </div>
                          <div id='collapseFour' className='collapse' aria-labelledby='headingFour' data-parent='#accordionExample'>
                            <div className='card-body'>
                              <ADHostsBlockedDatesPropertyCreateComponent commonFunction={this.commonFunction} blockedDatesObj={this.state.blockedDatesObj} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='container'>
                    <div className='text-center'>
                      <label style={{ color:'red' }}>{this.state.errorMessage}</label>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-sm-12 text-center mt-2'>
                      <button className='btn btn-primary' type='button' onClick={this.handleProperty}>{t`lanSPButtonNext`}</button>
                      {this.state.propertyInfoObj && this.state.propertyInfoObj.rentType
                      ? <button className='btn btn-primary' type='button' disabled={this.state.buttonView} onClick={this.handlePropertyCreate}>{t`lanCommonButtonCreate`}</button> : null}
                    </div>
                  </div>
                </div>}
              </div>
              <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                style={customStyles}
                contentLabel='Example Modal'
              >
                <div>
                  <p style={{ fontWeight:600 }}>{t`lanSPAlertMessage`} {this.state.imagesChoosedLength} {t`lanSPAlertImages`}..!</p>
                  <button type='button' className='btn btn-primary' onClick={this.closeModal}>{t`lanSPButtonOK`}</button>
                </div>
              </Modal>
            </div>
          </div>
        </div>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}

export default ADHostsPropertyCreateComponent
