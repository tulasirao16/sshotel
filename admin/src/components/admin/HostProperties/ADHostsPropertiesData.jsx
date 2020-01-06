/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import async from 'async'
import { Player } from 'video-react'
import '../../../../node_modules/video-react/dist/video-react.css'
import { hashHistory } from 'react-router'
import { Carousel } from 'react-responsive-carousel'
import '../css/carousel.min.css'
import { fetch as fetchPolyfill } from 'whatwg-fetch'
import Modal from 'react-modal'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import { t } from 'ttag'
import 'react-drawer/lib/react-drawer.css'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import ADHostsPropertyLocationEdit from './ADHostsPropertyLocationEdit'
import ADHostsPropertyNearestAreasUpdate from './ADHostsPropertyNearestAreasUpdate'
import ADHostsPropertyBlockedDatesList from './BlockedDates/ADHostsPropertyBlockedDatesList'
import ADHostsPropertyInfoList from './ADHostsPropertyInfoList'
import ADHostsPropertyImagesEdit from './ADHostsPropertyImagesEdit'
import PropTypes from 'prop-types'
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
    transform             : 'translate(-50%, -50%)',
    width                 : '30%',
    textAlign             : 'center'
  }
}

class ADHostsPropertiesData extends React.Component {
  constructor (props) {
    let propertyData = JSON.parse(localStorage.getItem('propertyData'))
    super(props)
    this.state = {
      propertyObj: propertyData,
      propertyId: propertyData._id,
      spLocationId: propertyData.spLocationId && propertyData.spLocationId._id
        ? propertyData.spLocationId._id : propertyData.spLocationId,
      propertyData: {},
      propertyTitle: propertyData.propertyTitle,
      aboutProperty: propertyData.aboutProperty,
      propertyType: propertyData.propertyType,
      propertyCapacity: propertyData.propertyCapacity ? propertyData.propertyCapacity : 0,
      noOfRooms: propertyData.numRooms ? propertyData.numRooms : 0,
      activeRooms: propertyData.activeNumRooms ? propertyData.activeNumRooms : 0,
      onHoldRooms: propertyData.onHoldNumRooms ? propertyData.onHoldNumRooms : 0,
      singleBedsCount: propertyData.singleBedsCount ? propertyData.singleBedsCount : 0,
      doubleBedsCount: propertyData.doubleBedsCount ? propertyData.doubleBedsCount : 0,
      privateBathRooms: propertyData.privateBathRooms ? propertyData.privateBathRooms : 0,
      acsCount: propertyData.acsCount ? propertyData.acsCount : 0,
      kitchensCount: propertyData.kitchensCount ? propertyData.kitchensCount : 0,
      hallsCount: propertyData.hallsCount ? propertyData.hallsCount : 0,
      imagePath: propertyData.imagePath ? propertyData.imagePath : '',
      spLocationData: propertyData.spLocationObj ? propertyData.spLocationObj : {},
      nearestAreas: propertyData.nearestAreas ? propertyData.nearestAreas : [],
      propertyDocs: [],
      propertyDocsDummy: 0,
      newFiles: {},
      photosStatus: false,
      propertyImagesCount: 0,
      isOpen: false,
      images: [],
      video: [],
      videoOld: [],
      videoFiles: {},
      modalIsOpen: false,
      imagesChoosedLength: '',
      errorMessage: '',
      videoErrorMessage: '',
      oldPropertyTitle:propertyData.propertyTitle,
      videoError: false
    }
    this.handleAddProperty = this.handleAddProperty.bind(this)
    this.handleChange = this.handleChange.bind(this)
    // this.handleBack = this.handleBack.bind(this)
    this.handlePropertyUpdate = this.handlePropertyUpdate.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  componentWillMount () {
    if (this.state.propertyObj && this.state.propertyId) {
      let obj = { url: config.baseUrl + config.getPropertyDocsAPI + this.state.propertyId }
      let _this = this
      APICallManager.getCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          let images = []
          let video = []
          let data = resObj.data.statusResult
          async.series([
            function (callback) {
              data.forEach(element => {
                if (element.fileType === 'Image') {
                  images.push(element)
                } else if (element.fileType === 'Video') {
                  video.push(element)
                }
              })
              callback(null, video, images)
            }
          ])
          _this.setState({
            propertyDocs: resObj.data.statusResult, propertyImagesCount: images.length, propertyDocsDummy: resObj.data.statusResult.length, video: video, videoOld: video, images: images
          })
        }
      })
    }
  }
  // handleBack () {
  //   hashHistory.push('/admin/host/properties')
  // }
  openModal () {
    this.setState({ modalIsOpen: true })
  }
  closeModal () {
    this.setState({ modalIsOpen: false, newFiles: this.state.newFiles, images: this.state.images, reload: true, errorMessage: '' })
  }

  onFileChange = (e) => {
    let _this = this
    let files = this.state.newFiles
    let images = this.state.images
    let fileslength = Object.keys(files).length
    var fileData = e.target.files
    let fdLength = Object.keys(fileData).length
    let previousImagesLength = this.state.images.length
    var filesArr = Array.prototype.slice.call(fileData)
    if ((previousImagesLength + fileslength + fdLength) <= 10) {
      async.series([
        function (callback) {
          for (let i = 0; i < fdLength; i++) {
            // if (fileData[i].size > 50000000) {
            //   alert('File size is too big')
            //   filesArr.splice(i, 1)
            // } else {
            files[fileslength + i] = fileData[i]
            // }
          }
          callback(null, files)
        },
        function (callback) {
          for (let i = 0; i < filesArr.length; i++) {
            let f = filesArr[i]
            let reader = new FileReader()
            reader.onloadend = function (e) {
              let data = e.target.result
              images.push(data)
            }
            reader.readAsDataURL(f)
          }
          callback(null, images)
        }
      ], function (err, results) {
        if (err) {}
        _this.setState({ modalIsOpen: true, newFiles: files, images: images, reload: true, imagesChoosedLength: fdLength, errorMessage: '' })
      })
    } else {
      this.setState({ videoErrorMessage: 'Upload up to 10 images only' })
    }
  }
  onFileChangeVideo = (e) => {
    this.setState({ videoError: false })
    if (this.state.videoOld && this.state.videoOld.length > 0) {
      this.setState({ videoErrorMessage: 'To upload new video, please delete existing video.' })
    } else {
      let _this = this
      this.setState({ videoErrorMessage: '' })
      let videoFiles = this.state.videoFiles
      let file = e.target.files[0]
      videoFiles[0] = file
      let reader = new FileReader()
      let url = reader.readAsDataURL(file)
      reader.onloadend = function (e) {
        if (file.size > 150000000) {
          this.setState({ videoErrorMessage: 'Uploaded video size should be less than or equal to 250MB and Duration should be less than or equal to 60 seconds.', videoError: true })
        } else {
          let media = new Audio(reader.result)
          media.onloadedmetadata = function () {
            if (media.duration > 60) {
              _this.setState({ videoErrorMessage: 'Uploaded video duration should be less than or equal to 60 seconds and Size should be less than or equal to 250MB.', videoError: true })
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
  handlePropertyUpdate () {
    if (this.state.images.length < 1) {
      this.setState({ errorMessage: t`lanSPErrorPropertyImageIsRequired` })
    } else if (this.state.images.length > 10) {
      this.setState({ errorMessage: 'Upload up to 10 images only' })
    } else if (this.state.videoError) {
      this.setState({ errorMessage: 'Uploaded video duration should be less than or equal to 60 seconds and Size should be less than or equal to 250MB.' })
    } else if (!this.state.propertyTitle.trim()) {
      this.setState({ errorMessage: t`lanSPErrorPropertyTitleIsRequired` })
    } else if (!this.state.aboutProperty.trim()) {
      this.setState({ errorMessage: t`lanSPErrorAboutPropertyIsRequired` })
    } else if (!this.state.propertyType) {
      this.setState({ errorMessage: t`lanSPErrorPropertyTypeIsRequired` })
    } else {
      let propertyData = JSON.parse(localStorage.getItem('propertyData'))
      const data = new FormData()
      let imageFiles = this.state.newFiles
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
        data.append('oldPropertyTitle', _this.state.oldPropertyTitle)
        data.append('propertyTitle', _this.state.propertyTitle)
        data.append('aboutProperty', _this.state.aboutProperty)
        data.append('propertyType', _this.state.propertyType)
        data.append('spLocationId', _this.state.spLocationId)
        data.append('nearestAreas', JSON.stringify(_this.state.nearestAreas))
        data.append('imagesCount', parseInt(_this.state.propertyDocsDummy))
        data.append('spServiceProviderId', propertyData.spServiceProviderId)
        data.append('spServiceProvider', propertyData.spServiceProvider)
        fetchPolyfill(config.baseUrl + config.putADHostsPropertyUpdateAPI + _this.state.propertyId, {
          method: 'PUT',
          body: data,
          headers: {
            'token': localStorage.getItem('token')
          }
        }).then((response) => {
          response.json().then((responseJson) => {
            if (responseJson.statusCode === '0000') {
              ToastsStore.success(t`lanADHostsSuccessPropertyUpdatesuccessfully`)
              setTimeout(() => {
                localStorage.setItem('PropertiesShow', 'List')
                hashHistory.push('/admin/host/properties')
                window.location.reload()
              }, 2000)
            } else {
              ToastsStore.error(t`lanSPErrorPropertyUpdateFailed`)
            }
          })
        })
      })
    }
  }
  handleAddProperty (event) {
    hashHistory.push('/AddPropertyDetails')
    event.preventDefault()
  }

  handleChange (checked) {
    this.setState({ checked })
  }
  commonFunction = (areas) => {
    this.setState({ nearestAreas: areas })
  }
  imageFunction = (images, files, video, videoFiles, videoError) => {
    if (!videoError) {
      this.setState({ videoErrorMessage: '', errorMessage: '' })
    }
    let videoOld = (this.state.videoOld.length > 0 && video.length < 1) ? [] : this.state.videoOld
    this.setState({ images: images, newFiles: files, video: video, videoFiles: videoFiles, videoOld: videoOld, photosStatus: false, reload: true, videoError: videoError })
  }

  render () {
    return (
      <div className='main-content' id='panel'>
        <div className='container-fluid mt--6'>
          <div className='card property-view'>
            <div className='card-header'>
              <div className='row'>
                <div className='col-md-8'>
                  <h3 className='mb-0'>{this.state.propertyTitle}</h3>
                </div>
                <div className='col-md-4 text-right'>
                  {((this.state.images && this.state.images.length > 0) || (this.state.video && this.state.video.length > 0)) && !this.state.photosStatus
                    ? <div className='custom-file mb-2 col-md-6 text-right'>
                      <button className='btn btn-info' onClick={() => this.setState({ photosStatus: true })}>View all Images</button>
                    </div>
                    : null }
                </div>
              </div>
            </div>
            <div className='card-body'>
              {this.state.photosStatus
              ? <ADHostsPropertyImagesEdit videoError={this.state.videoError} photos={this.state.images}
                propertyImagesCount={this.state.propertyImagesCount} video={this.state.video} newFiles={this.state.newFiles} imageFunction={this.imageFunction}
                propertyID={this.state.propertyId} imagePath={this.state.imagePath} videoFiles={this.state.videoFiles} />
              : <div>
                <div className='row'>
                  <div className='col-sm-6 create-prop-slider image-col'>
                    {this.state.images && this.state.images.length > 0
                    ? <Carousel autoPlay infiniteLoop showThumbs={false}>
                      {this.state.images && this.state.images.length > 0 ? this.state.images.map((item, i) =>
                        <div className='mb-0' key={i}>
                          <img src={item.imagePath ? config.baseUrl + item.imagePath : item} />
                        </div>
                      ) : null}
                    </Carousel>
                    : <div className='dummy-image'>
                      <img src={require('../../../../assets/no-images-available.jpg')} />
                    </div>}
                    <div className='add-image-btn'>
                      <input type='file' className='custom-file-input' id='files' name='files' accept='image/*' lang='en' onChange={this.onFileChange} multiple />
                      <label className='btn btn-primary add-icon'><i className='fas fa-plus' /><br /> Photos</label>
                    </div>
                  </div>
                  <div className='col-md-6 video-col'>
                    {this.state.video && this.state.video.length > 0 ? this.state.video.map((item, i) =>
                      <div className='dummy-image' key={i}>
                        <Player
                          playsInline
                          src={item && item.imagePath ? config.baseUrl + item.imagePath : item}
                        />
                      </div>)
                    : <div className='dummy-image'>
                      <img src={require('../images/videoDummy.png')} />
                      {/* <input type='file' className='custom-file-input img-input-file' id='files' name='files' accept='video/*' lang='en' onChange={this.onFileChangeVideo} /> */}
                    </div>}
                    <div className='row mt-4'>
                      <div className='add-image-btn'>
                        <input type='file' className='custom-file-input' id='files' name='files' accept='video/*' lang='en' onChange={this.onFileChangeVideo} />
                        <label className='btn btn-primary add-icon'><i className='fas fa-plus' /><br /> Video</label>
                      </div>
                    </div>
                  </div>
                  <label style={{ color:'red' }}>{this.state.videoErrorMessage}</label>
                  <div className='col-md-12'>
                    <div>
                      <div className='accordion' id='accordionExample'>
                        <div className='card'>
                          <div className='card-header' id='headingOne' data-toggle='collapse' data-target='#collapseOne' aria-expanded='true' aria-controls='collapseOne'>
                            <h5 className='mb-0'>{t`lanSPSubTitlePropertyDetails`}</h5>
                          </div>
                          <div id='collapseOne' className='collapse show' aria-labelledby='headingOne' data-parent='#accordionExample'>
                            <div className='card-body'>
                              <div className='row'>
                                <div className='col-md-3'>
                                  <div className='form-group'>
                                    <label className='view-title'>{t`lanCommonLabelPropertyTitle`}</label>
                                    <input type='text' className='form-control' id='example3cols2Input' value={this.state.propertyTitle}
                                      onChange={() => this.setState({ propertyTitle: event.target.value, errorMessage: '' })} />
                                  </div>
                                </div>
                                <div className='col-md-3'>
                                  <div className='form-group'>
                                    <label className='view-title'>{t`lanSPLabelPropertyType`}</label>
                                    <select className='form-control' value={this.state.propertyType} onChange={() => this.setState({ propertyType: event.target.value, errorMessage: '' })} >
                                      <option value=''>Choose a Property Type</option>
                                      <option value='Hotel'>Hotel</option>
                                      <option value='Individual House'>Individual House</option>
                                    </select>
                                  </div>
                                </div>
                                <div className='col-md-6'>
                                  <div className='form-group'>
                                    <label className='form-control-label'>{t`lanSPLabelAboutYourProperty`}</label>
                                    <textarea rows='2' className='form-control' value={this.state.aboutProperty}
                                      onChange={() => this.setState({ aboutProperty: event.target.value, errorMessage: '' })} />
                                  </div>
                                </div>
                              </div>
                              <div className='row mb-2'>
                                <div className='col-md-2 col-6'>
                                  <small className='view-title'>{t`lanSPLabelPropertyCapacity`}</small>
                                  <h5>{this.state.propertyCapacity}</h5>
                                </div>
                                <div className='col-md-2 col-6'>
                                  <small className='view-title'>{t`lanSPLabelPropertyTotalRooms`}</small>
                                  <h5>{this.state.noOfRooms}</h5>
                                </div>
                                <div className='col-md-2 col-6'>
                                  <small className='view-title'>{t`lanSPLabelPropertyActiveRooms`}</small>
                                  <h5>{this.state.activeRooms}</h5>
                                </div>
                                <div className='col-md-2 col-6'>
                                  <small className='view-title'>{t`lanSPLabelPropertyOnHoldRooms`}</small>
                                  <h5>{this.state.onHoldRooms}</h5>
                                </div>
                                <div className='col-md-2 col-6'>
                                  <small className='view-title'>{t`lanSPLabelPropertySingleBedRooms`}</small>
                                  <h5>{this.state.singleBedsCount}</h5>
                                </div>
                                <div className='col-md-2 col-6'>
                                  <small className='view-title'> {t`lanSPLabelPropertyDoubleBedRooms`}</small>
                                  <h5>{this.state.doubleBedsCount}</h5>
                                </div>
                              </div>
                              <div className='row'>
                                <div className='col-md-2 col-6'>
                                  <small className='view-title'>{t`lanSPLabelPropertyBathRooms`}</small>
                                  <h5>{this.state.privateBathRooms}</h5>
                                </div>
                                <div className='col-md-2 col-6'>
                                  <small className='view-title'>{t`lanSPLabelPropertyAcs`}</small>
                                  <h5>{this.state.acsCount}</h5>
                                </div>
                                <div className='col-md-2 col-6'>
                                  <small className='view-title'>{t`lanSPLabelPropertyKitchens`}</small>
                                  <h5>{this.state.kitchensCount}</h5>
                                </div>
                                <div className='col-md-2 col-6'>
                                  <small className='view-title'>{t`lanSPLabelPropertyHalls`}</small>
                                  <h5>{this.state.hallsCount}</h5>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='card'>
                          <div className='card-header' id='headingTwo' data-toggle='collapse' data-target='#collapseTwo' aria-expanded='false' aria-controls='collapseTwo'>
                            <h5 className='mb-0'>{t`lanSPSubTitlePropertyLocationDetails`}</h5>
                          </div>
                          <div id='collapseTwo' className='collapse' aria-labelledby='headingTwo' data-parent='#accordionExample'>
                            <div className='card-body'>
                              <ADHostsPropertyLocationEdit spLocationObj={this.state.spLocationData} spLocationId={this.state.spLocationId} propertyId={this.state.propertyId} />
                            </div>
                          </div>
                        </div>
                        <div className='card'>
                          <div className='card-header' id='headingThree' data-toggle='collapse' data-target='#collapseThree' aria-expanded='false' aria-controls='collapseThree'>
                            <h5 className='mb-0'>{t`lanSPSubTitleNearestAreas`}</h5>
                          </div>
                          <div id='collapseThree' className='collapse' aria-labelledby='headingThree' data-parent='#accordionExample'>
                            <div className='card-body'>
                              <ADHostsPropertyNearestAreasUpdate spLocationObj={this.state.spLocationData} propertyId={this.state.propertyId} nearestAreas={this.state.nearestAreas} commonFunction={this.commonFunction} />
                            </div>
                          </div>
                        </div>
                        <div className='card'>
                          <div className='card-header' id='headingFour' data-toggle='collapse' data-target='#collapseFour' aria-expanded='false' aria-controls='collapseFour'>
                            <h5 className='mb-0'>{t`lanSPSubTitleBlockedDates`}</h5>
                          </div>
                          <div id='collapseFour' className='collapse' aria-labelledby='headingFour' data-parent='#accordionExample'>
                            <div className='card-body'>
                              <ADHostsPropertyBlockedDatesList propertyID={this.state.propertyId} propertyObj={this.state.propertyObj} />
                            </div>
                          </div>
                        </div>
                        <div className='card'>
                          <div className='card-header' id='headingFive' data-toggle='collapse' data-target='#collapseFive' aria-expanded='false' aria-controls='collapseFive'>
                            <h5 className='mb-0'>{t`lanSPSubTitlePropertyInfos`}</h5>
                          </div>
                          <div id='collapseFive' className='collapse' aria-labelledby='headingFive' data-parent='#accordionExample'>
                            <div className='card-body'>
                              {/* <a href='#/host/property/amenities'>Amenities</a> */}
                              <ADHostsPropertyInfoList propertyID={this.state.propertyId} propertyObj={this.state.propertyObj} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ color: 'red' }}>
                  {this.state.errorMessage}
                </div>
                <div className='row'>
                  <div className='col-sm-12 text-center mt-4'>
                    <button className='btn btn-danger' type='button' onClick={this.props.handleBack}>{t`lanCommonButtonBack`}</button>
                    <button className='btn btn-primary' type='button' onClick={this.handlePropertyUpdate}>{t`lanCommonButtonUpdate`}</button>
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
                <p>You have selected {this.state.imagesChoosedLength} images..!</p>
                <button type='button' className='btn btn-primary' onClick={this.closeModal}>OK</button>
              </div>
            </Modal>
          </div>
        </div>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}
ADHostsPropertiesData.propTypes = {
  // propertyData: PropTypes.any,
  handleBack: PropTypes.any
}
export default ADHostsPropertiesData
