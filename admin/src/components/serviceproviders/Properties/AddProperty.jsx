/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import DrawerWithHeader from '../Drawer/DrawerComponent'
import FooterComponent from '../FooterCompnt/Footer'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class AddProperty extends React.Component {
  constructor () {
    super()
    this.state = {
    }
    this.handleAddProperty = this.handleAddProperty.bind(this)
  }
  handleAddProperty (event) {
    hashHistory.push('/host/locations/create')
    event.preventDefault()
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        <DrawerWithHeader />
        {/* ---------- Header Starts ------------- */}
        <div className='header bg-primary pb-6'>
          <div className='container'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>Create Property</h6>
                </div>
              </div>
            </div>
          </div>
        </div>{/* ---------- Header Ends ------------- */}
        <div className='container mt--6'>
          <div>
            <div className='card'>
              <div className='card-header'>
                <h3 className='mb-0'>Create Property - Manually</h3>
              </div>
              <div className='card-body'>
                <form>
                  <div className='form-row justify-content-center'>
                    <div className='col-lg-6 mb-4'>
                      <div className='card-profile-upload'>
                        <i className='fas fa-camera cam-icon' />
                      </div>
                      <p className='text-center'>Please Add Proprty Images</p>
                    </div>
                  </div>
                  <div className='form-row justify-content-center'>
                    <div className='col-md-4 mb-3'>
                      <label className='form-control-label'>Property Title</label>
                      <input type='text' className='form-control' id='validationCustom' required='' />
                    </div>
                  </div>
                  <div className='form-row justify-content-center'>
                    <div className='col-md-4 mb-3'>
                      <label className='form-control-label'>About Your Property</label>
                      <input type='text' className='form-control' id='validationCustomUsername' required='' />
                    </div>
                  </div>
                  <div className='form-row justify-content-center'>
                    <div className='col-md-4 mb-3'>
                      <label className='form-control-label'>Property Type</label>
                      <select className='form-control' id='exampleFormControlSelect1'>
                        <option>Choose a Property Type</option>
                        <option>Hotel</option>
                        <option>Individual House</option>
                      </select>
                    </div>
                  </div>
                  <div className='form-row justify-content-center mt-3'>
                    <div className='col-md-2 col-auto page-item active mt-2'>
                      <a href='#' className='page-link'><i className='fas fa-chevron-left' /></a>
                    </div>
                    <div className='col-md-3 col-auto text-right'>
                      <button className='btn btn-primary' onClick={this.handleAddProperty} type='submit'>Next</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <FooterComponent />
      </div>
    )
  }
}

export default AddProperty
