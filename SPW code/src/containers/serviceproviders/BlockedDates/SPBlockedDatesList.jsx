/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import PropTypes from 'prop-types'
import SPBlockedDatesListComponent from '../../../components/serviceproviders/blockedDates/SPBlockedDatesListComponent'

class SPBlockedDates extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        {/* <div className='header bg-primary pb-6'>
          <div className='container'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPSubTitleBlockedDates`}</h6>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  <a onClick={this.handleCreateBlockedDates} className='btn btn-sm btn-neutral'>{t`lanSPButtonCreateBlockedDates`}</a>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <SPBlockedDatesListComponent propertyID={this.props.propertyID} propertyObj={this.props.propertyObj} />
      </div>
    )
  }
}

SPBlockedDates.propTypes = {
  propertyID: PropTypes.any,
  propertyObj: PropTypes.any
}
export default SPBlockedDates
