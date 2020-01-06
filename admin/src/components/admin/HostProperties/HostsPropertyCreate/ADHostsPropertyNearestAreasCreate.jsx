/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import PropTypes from 'prop-types'
import '../../css/all.min.css'
import '../../css/argon.min.css'
import '../../css/nucleo.css'

class ADHostsPropertyNearestAreasCreate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      area: '',
      nearestAreas: this.props.nearestAreas && this.props.nearestAreas.length > 0 ? this.props.nearestAreas : [],
      spLocationObj: this.props.spLocationObj ? this.props.spLocationObj : {},
      errorMessages: ''
    }
    this.handleAddArea = this.handleAddArea.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
  }
  handleAddArea (e) {
    // if (!this.state.area) {
    //   this.setState({ errorMessages: t`lanSPLabelErrorAreaRequired` })
    // } else {
    //   let addAreas = this.state.nearestAreas
    //   addAreas.push(this.state.area)
    //   this.setState({ nearestAreas: addAreas, errorMessages: '', area: '' })
    //   this.props.commonFunction(addAreas, 'nearestAreas')
    // }
    let spLocationObj = this.state.spLocationObj && this.state.spLocationObj.area && this.state.spLocationObj.area.length > 0 ? true : false
    if (!this.state.area) {
      this.setState({ errorMessages: t`lanSPLabelErrorAreaRequired` })
    } else if (spLocationObj && this.state.spLocationObj.area.toUpperCase() === this.state.area.toUpperCase()) {
      if (this.state.spLocationObj && this.state.spLocationObj.area.toUpperCase() === this.state.area.toUpperCase()) {
        this.setState({ errorMessages: t`lanSPLabelErrorAreaAlreadyExist` })
      }
    } else {
      let upperCaseArea = this.state.area.toUpperCase()
      let addAreas = this.state.nearestAreas
      let index = addAreas.indexOf(upperCaseArea)
      if (index !== -1) {
        this.setState({ errorMessages: t`lanSPLabelErrorAreaAlreadyExist` })
      } else {
        addAreas.push(upperCaseArea)
        this.setState({ nearestAreas: addAreas, errorMessages: '', area: '' })
        this.props.commonFunction(addAreas, 'nearestAreas')
      }
    }
    e.preventDefault()
  }
  handleOnChange (event) {
    this.setState({
      area: event.target.value,
      errorMessages: ''
    })
  }

  handleEnterPressed (event) {
    var code = event.keyCode || event.which
    if (code === 13) {
      event.preventDefault()
    }
  }

  handleRemove (item) {
    let removeAreas = this.state.nearestAreas
    let index = removeAreas.indexOf(item)
    removeAreas.splice(index, 1)
    this.setState({ nearestAreas: removeAreas })
    this.props.commonFunction(removeAreas, 'nearestAreas')
  }
  async componentWillReceiveProps (newProps) {
    this.setState({ spLocationObj: newProps.spLocationObj })
  }
  render () {
    return (
      <div>
        <div style={{ backgroundColor:'#fff' }}>
          <form>
            <div className='row'>
              <div className='col-md-4 col-7'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPSubTitleAddNearestAreas`}</label>
                  <input type='text' className='form-control' onKeyPress={this.handleEnterPressed} value={this.state.area} onChange={(event) => this.handleOnChange(event)} />
                </div>
              </div>
              <div className='col-md-2 col-5'>
                <div className='mt-4 pt-2'>
                  <button className='btn btn-success' data-role='add' type='button' onClick={this.handleAddArea}>
                    <i className='fas fa-plus' /> {t`lanSPButtonAdd`}
                  </button>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-md-6'>
                {this.state.nearestAreas && this.state.nearestAreas.length > 0 ? this.state.nearestAreas.map((item, i) =>
                  <span className='tag badge badge-primary mr-2' key={i}>{item}<span data-role='remove'><i className='fas fa-times pl-1' style={{ color: 'red' }} onClick={() => this.handleRemove(item)} /></span></span>
                ) : <h6>{t`lanSPLabelNoNearestAreas`}</h6>}
              </div>
              <div style={{ color: 'red' }}>
                {this.state.errorMessages}
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
ADHostsPropertyNearestAreasCreate.propTypes = {
  commonFunction: PropTypes.any,
  nearestAreas: PropTypes.any,
  spLocationObj: PropTypes.any
}

export default ADHostsPropertyNearestAreasCreate
