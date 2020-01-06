import React from 'react'
import async from 'async'
import { t } from 'ttag'
import { Player } from 'video-react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'

export default class ADHostsPropertyImagesEdit extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      propertyID: props.propertyID,
      imagePath: props.imagePath,
      video: props.video,
      videoFiles: props.videoFiles,
      photos: props.photos,
      newFiles: props.newFiles,
      propertyImagesCount: props.propertyImagesCount,
      imagesCount: 0,
      indexPositions: [],
      deleteIDs: [],
      imagesPath: [],
      videoSelected: false,
      videoError: props.videoError,
      videoSelectNDel: false
    }
  }
  handleBack = () => {
    this.props.imageFunction(this.state.photos, this.state.newFiles, this.state.video, this.state.videoFiles, this.state.videoSelectNDel ? true : this.state.videoError)
  }
  handleSelect = (item, i) => {
    let _this = this
    let indexPositions = this.state.indexPositions
    let deleteIDs = this.state.deleteIDs
    let imagesPath = this.state.imagesPath
    let propertyImagesCount = this.state.propertyImagesCount
    let imagesCount = this.state.imagesCount
    async.series([
      function (callback) {
        if (item._id) {
          let id = deleteIDs.indexOf(item._id)
          let imagePath = imagesPath.indexOf(item.imagePath)
          if (id !== -1) {
            deleteIDs.splice(id, 1)
            imagesPath.splice(imagePath, 1)
            imagesCount--
          } else {
            deleteIDs.push(item._id)
            imagesPath.push(item.imagePath)
            imagesCount++
          }
        }
        callback(null, deleteIDs, imagesPath, imagesCount)
      }, function (callback) {
        let j = indexPositions.indexOf(i)
        if (j !== -1) {
          indexPositions.splice(j, 1)
        } else {
          indexPositions.push(i)
        }
        callback(null, indexPositions)
      }
    ], function (err, results) {
      if (err) {}
      if (item._id && imagesCount === propertyImagesCount) {
        ToastsStore.warning(t`lanADHostsYouHaveToMaitainAtleastOneExistingImage`)
      }
      _this.setState({ indexPositions, deleteIDs, imagesPath, imagesCount })
    })
  }
  handleVideoSelect = (item, position) => {
    if (this.props.videoError) {
      this.setState({ videoError: !this.state.videoError, videoSelectNDel: !this.state.videoSelectNDel })
    }
    let deleteIDs = this.state.deleteIDs
    let imagesPath = this.state.imagesPath
    let _this = this
    async.series([
      function (callback) {
        if (!_this.state.videoSelected && item._id) {
          deleteIDs.push(item._id)
          imagesPath.push(item.imagePath)
        } else if (_this.state.videoSelected && item._id) {
          let id = deleteIDs.indexOf(item._id)
          let imagePath = imagesPath.indexOf(item.imagePath)
          deleteIDs.splice(id, 1)
          imagesPath.splice(imagePath, 1)
        }
        callback(null, deleteIDs, imagesPath)
      }
    ], function (err, results) {
      if (err) {}
      _this.setState({ videoSelected: !_this.state.videoSelected, deleteIDs: deleteIDs, imagesPath: imagesPath })
    })
  }

  handleDelete = () => {
    this.setState({ videoSelectNDel: false })
    if (this.state.imagesCount === this.state.propertyImagesCount) {
      ToastsStore.warning(t`lanADHostsYouHaveToMaitainAtleastOneExistingImage`)
    } else {
      let imageData = this.state.photos
      let files = this.state.newFiles
      let filesSize = Object.keys(files).length
      let newNewFiles = {}
      let indexs = this.state.indexPositions
      let _this = this

      let video = this.state.videoSelected ? [] : this.state.video
      let videoFiles = this.state.videoSelected ? {} : this.state.videoFiles
      let updateObj = {
        propertyID: this.state.propertyID,
        imagePath: this.state.imagePath,
        imageIDs: this.state.deleteIDs,
        imagesPath: this.state.imagesPath
      }
      if (this.state.deleteIDs && this.state.deleteIDs.length > 0) {
        let obj = { url: config.baseUrl + config.putADHostPropertyImagesDeleteAPI, body: updateObj }
        APICallManager.putCall(obj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            ToastsStore.success(t`lanSPSuccessPropertyImagesDeleted`)
          } else {
            ToastsStore.error(t`lanSPErrorPropertyImagesDeleteFailed`)
          }
        })
      }

      async.series([
        function (callback) {
          indexs.sort(function (a, b) { return b - a })
          callback(null, indexs)
        },
        function (callback) {
          indexs.forEach(function (i) {
            imageData.splice(i, 1)
          })
          callback(null, imageData)
        },
        function (callback) {
          indexs.forEach(function (i) {
            delete files[i]
          })
          callback(null, files)
        },
        function (callback) {
          let indexPos = 0
          for (let k = 0; k < filesSize; k++) {
            if (imageData[k]) {
              newNewFiles[indexPos.toString()] = imageData[k]
              indexPos++
            }
          }
          callback(null, newNewFiles)
        }
      ], function (err, results) {
        if (err) {}
        _this.setState({ photos: imageData, newFiles: newNewFiles, indexPositions: [], videoSelected: false, video: video, videoFiles: videoFiles })
        _this.props.imageFunction(imageData, newNewFiles, video, videoFiles, _this.state.videoError)
      })
    }
  }

  render () {
    return (
      <div>
        <div className='row'>
          {this.state.photos && this.state.photos.length > 0 ? this.state.photos.map((item, i) => {
            return (
              <SPPropertyImageView image={item} key={i} keyPos={i} handleSelect={this.handleSelect} selected={false} />
            )
          })
          : <img src={require('../../../../assets/no-images-available.jpg')} />}
          {this.state.video && this.state.video.length > 0 ? this.state.video.map((item, i) => {
            return (
              <div className='col-md-3' key={i}>
                <a onClick={() => this.handleVideoSelect(item, i)}>
                  <Player
                    playsInline
                    src={item && item.imagePath ? config.baseUrl + item.imagePath : item}
                    className={classnames('view-all-images-each-video', { 'selected-file': this.state.videoSelected })}
                  />
                </a>
              </div>
            )
          }) : null}
        </div>
        <div className='row justify-content-center'>
          <button className='btn btn-primary' onClick={this.handleBack}>{t`lanCommonButtonBack`}</button>
          <div>
            {(this.state.indexPositions && this.state.indexPositions.length > 0) || this.state.videoSelected ? <button className='btn btn-danger' onClick={this.handleDelete}>{t`lanCommonButtonDelete`}</button> : null}
          </div>
        </div>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}
ADHostsPropertyImagesEdit.propTypes = {
  propertyID: PropTypes.any,
  imagePath: PropTypes.any,
  video: PropTypes.any,
  videoFiles: PropTypes.any,
  photos: PropTypes.any,
  newFiles: PropTypes.any,
  propertyImagesCount: PropTypes.any,
  imageFunction: PropTypes.any,
  videoError: PropTypes.any
}

class SPPropertyImageView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: props.selected,
      item: props.image,
      keyPos: props.keyPos
    }
    this.handleSelect = this.handleSelect.bind(this)
  }

  handleSelect (item, i) {
    this.setState({ selected: !this.state.selected })
    this.props.handleSelect(item, i)
  }

  render () {
    return (
      <div className='col-md-3'>
        <a onClick={() => this.handleSelect(this.state.item, this.state.keyPos)}>
          <img src={this.state.item && this.state.item.imagePath ? config.baseUrl + this.state.item.imagePath
            : this.state.item} className={classnames('view-all-images-each-img', { 'selected-file': this.state.selected })} />
        </a>
      </div>
    )
  }
}
SPPropertyImageView.propTypes = {
  image: PropTypes.any,
  selected: PropTypes.any,
  handleSelect: PropTypes.any,
  keyPos: PropTypes.any
}
