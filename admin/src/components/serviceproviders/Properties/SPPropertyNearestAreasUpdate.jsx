/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import { t } from 'ttag'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPPropertyNearestAreasUpdate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      area: '',
      nearestAreas: this.props.nearestAreas && this.props.nearestAreas.length > 0 ? this.props.nearestAreas : [],
      errorMessages: ''
    }
    this.handleAddArea = this.handleAddArea.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
  }
  handleAddArea () {
    if (!this.state.area) {
      this.setState({ errorMessages: t`lanSPLabelErrorAreaRequired` })
    } else {
      let addAreas = this.state.nearestAreas
      addAreas.push(this.state.area)
      this.setState({ nearestAreas: addAreas, errorMessages: '', area: '' })
      this.props.commonFunction(addAreas)
    }
  }
  handleRemove (item) {
    let removeAreas = this.state.nearestAreas
    let index = removeAreas.indexOf(item)
    removeAreas.splice(index, 1)
    this.setState({ nearestAreas: removeAreas })
    this.props.commonFunction(removeAreas)
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ---------- Header Starts ------------- */}
        {/* <div className='header bg-primary pb-6'>
          <div className='container'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitleNearestAreas`}</h6>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div style={{ backgroundColor:'#fff' }}>
          <form>
            <div className='row'>
              <div className='col-md-4 col-8'>
                <div className='form-group'>
                  <label className='form-control-label'>{t`lanSPSubTitleAddNearestAreas`}</label>
                  <input type='text' className='form-control' value={this.state.area} onChange={(event) => this.setState({ area: event.target.value, errorMessages: '' })} />
                </div>
              </div>
              <div className='col-md-2 col-4'>
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
        {/* <div className='container mt--6'>
          <div>
            <div className='card'>
              <div className='card-header'>
                <h3 className='mb-0'>{t`lanSPSubTitleUpdateNearestAreas`}</h3>
              </div>
              <div className='card-body'></div>
            </div>
          </div>
        </div> */}
      </div>
    )
  }
}
SPPropertyNearestAreasUpdate.propTypes = {
  commonFunction: PropTypes.any,
  nearestAreas: PropTypes.any
}

export default SPPropertyNearestAreasUpdate
