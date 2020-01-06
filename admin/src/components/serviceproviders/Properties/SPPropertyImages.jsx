import React from 'react'
import async from 'async'
import { t } from 'ttag'
import { Player } from 'video-react'
import classnames from 'classnames'
// import '../../../../node_modules/video-react/dist/video-react.css'
import PropTypes from 'prop-types'

export default class SPPropertyImages extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      photos: props.photos,
      video: props.video,
      videoFiles: props.videoFiles,
      files: props.files,
      indexPositions: [],
      videoSelected: false
    }
    this.handleSelect = this.handleSelect.bind(this)
  }
  handleBack = () => {
    this.props.imageFunction(this.state.photos, this.state.files, this.state.video, this.state.videoFiles)
  }
  handleSelect (i) {
    let value = this.state.indexPositions
    let j = value.indexOf(i)
    if (j !== -1) {
      value.splice(j, 1)
    } else {
      value.push(i)
    }
    this.setState({ indexPositions: value })
  }
  handleVideoSelect = (i) => {
    this.setState({ videoSelected: !this.state.videoSelected })
  }
  handleDelete = () => {
    let imageData = this.state.photos
    let files = this.state.files
    let filesSize = Object.keys(files).length
    let newFiles = {}
    let video = this.state.videoSelected ? [] : this.state.video
    let videoFiles = this.state.videoSelected ? {} : this.state.videoFiles

    let indexs = this.state.indexPositions
    let _this = this
    async.series([
      function (callback) {
        indexs.sort(function (a, b) { return b - a })
        callback(null, indexs)
      }, function (callback) {
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
      }, function (callback) {
        let indexPos = 0
        for (let k = 0; k < filesSize; k++) {
          if (files[k]) {
            newFiles[indexPos.toString()] = files[k]
            indexPos++
          }
        }
        callback(null, newFiles)
      }
    ], function (err, results) {
      if (err) {}
      _this.setState({ photos: imageData, files: newFiles, indexPositions: [], videoSelected: false, video: video, videoFiles: videoFiles })
      _this.props.imageFunction(imageData, newFiles, video, videoFiles)
    })
  }
  render () {
    return (
      <div className='container view-property-files'>
        <div className='row'>
          {this.state.photos && this.state.photos.length > 0 ? this.state.photos.map((item, i) => {
            return (
              <SPPropertyImageView image={item} keyPos={i} handleSelect={this.handleSelect} selected={false} />
            )
          })
          : <img src={require('../../../../assets/no-images-available.jpg')} className='view-all-images-each-img' />}
          {this.state.video && this.state.video.length > 0 ? this.state.video.map((item, i) => {
            return (
              <div className='col-sm-4 view-all-images' key={i}>
                <a onClick={() => this.handleVideoSelect(i)}>
                  <Player
                    playsInline
                    src={item}
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
            {(this.state.indexPositions && this.state.indexPositions.length > 0) || this.state.videoSelected ? <button onClick={this.handleDelete}>{t`lanCommonButtonDelete`}</button> : null}
          </div>
        </div>
      </div>
    )
  }
}
SPPropertyImages.propTypes = {
  photos: PropTypes.any,
  files: PropTypes.any,
  video: PropTypes.any,
  videoFiles: PropTypes.any,
  imageFunction: PropTypes.any
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

  handleSelect (i) {
    this.setState({ selected: !this.state.selected })
    this.props.handleSelect(i)
  }

  render () {
    return (
      <div className='col-sm-4 view-all-images' key={this.state.keyPos} >
        <a onClick={() => this.handleSelect(this.state.keyPos)}>
          <img src={this.state.item} className={classnames('view-all-images-each-img', { 'selected-file': this.state.selected })} />
        </a>
      </div>
    )
  }
}
SPPropertyImageView.propTypes = {
  image: PropTypes.any,
  keyPos: PropTypes.any,
  selected: PropTypes.any,
  handleSelect: PropTypes.any
}
