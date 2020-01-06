/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
// import { hashHistory } from 'react-router'
import DrawerWithHeader from '../Drawer/DrawerComponent'
import FooterComponent from '../FooterCompnt/Footer'
import 'react-drawer/lib/react-drawer.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
class CreateLocation extends React.Component {
  constructor () {
    super()
    this.state = {
    }
    this.handleAddNearestAreas = this.handleAddNearestAreas.bind(this)
  }
  handleAddNearestAreas (event) {
    // hashHistory.push('/AddNearestAreas')
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
                  <h6 className='h2 text-white d-inline-block mb-0'>Add Property</h6>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  <a href='#' className='btn btn-sm btn-neutral'>New</a>
                  <a href='#' className='btn btn-sm btn-neutral'>Filters</a>
                </div>
              </div>
            </div>
          </div>
        </div>{/* ---------- Header Starts ------------- */}
        <div className='container mt--6'>
          <div>
            <div className='card'>
              <div className='sp-hotels'>
                <div className='card mb-0'>
                  {/* Card body */}
                  <div className='card-body'>
                    <div className='row align-items-center'>
                      <div className='col-auto'>
                        {/* Avatar */}
                        {/* <a href='#' className='rounded-circle'>
                          <img src={require('../images/room1.jpg')} className='avatar rounded-circle' />
                        </a> */}
                      </div>
                      <div className='col ml--2'>
                        <h4 className='mb-2'>
                          <a href='#'>Test Hotels</a>
                        </h4>
                        <p className='text-sm mb-0'>Hotel - Create Property Location</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='card-header'>
                <h3 className='mb-0'>Add Property - Location</h3>
              </div>
              <div className='card-body'>
                <form>
                  <div className='row'>
                    <div className='col-md-6 room-catageory'>
                      <div className='form-group'>
                        <div className='custom-control custom-radio'>
                          <input name='custom-radio-1' className='custom-control-input' id='customRadio5' type='radio' />
                          <label className='custom-control-label'>Select Locations List</label>
                        </div>
                        <div className='custom-control custom-radio'>
                          <input name='custom-radio-1' className='custom-control-input' id='customRadio5' type='radio' />
                          <label className='custom-control-label'>Create Locations</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='form-control-label' >Location</label>
                        <select className='form-control' id='exampleFormControlSelect1'>
                          <option>Seclect Location</option>
                        </select>
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='form-control-label' >Area</label>
                        <input type='text' className='form-control' id='example3cols2Input' />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='form-control-label' >Landmark</label>
                        <input type='text' className='form-control' id='example3cols3Input' />
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='form-control-label' >Pincode</label>
                        <input type='text' className='form-control' id='example3cols2Input' />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='form-control-label' >Status</label>
                        <select className='form-control' id='exampleFormControlSelect1'>
                          <option>Seclect Status</option>
                          <option>Active</option>
                          <option>In Active</option>
                        </select>
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='form-control-label' >City</label>
                        <input type='text' className='form-control' id='example3cols3Input' />
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='form-control-label' >Country</label>
                        <select className='form-control' id='exampleFormControlSelect1'>
                          <option>Seclect Country</option>
                          <option>India</option>
                          <option>USA</option>
                          <option>Canada</option>
                          <option>Australia</option>
                        </select>
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='form-control-label' >State</label>
                        <select className='form-control' id='exampleFormControlSelect1'>
                          <option>Seclect State</option>
                          <option>Telangana</option>
                          <option>Andhra Pradesh</option>
                        </select>
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='form-control-label' >Latitude</label>
                        <input type='text' className='form-control' id='example3cols3Input' />
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='form-control-label' >Longitude</label>
                        <input type='text' className='form-control' id='example3cols3Input' />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='form-control-label' >Contact Person</label>
                        <input type='text' className='form-control' id='example3cols3Input' />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='form-control-label' >Mobile Number #</label>
                        <input type='text' className='form-control' id='example3cols3Input' />
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='form-control-label' >Alternate Mobile Number</label>
                        <input type='text' className='form-control' id='example3cols3Input' />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='form-control-label' >Email</label>
                        <input type='text' className='form-control' id='example3cols3Input' />
                      </div>
                    </div>
                    <div className='col-md-4'>
                      <div className='form-group'>
                        <label className='form-control-label' >Address</label>
                        <textarea className='form-control' id='exampleFormControlTextarea1' rows='3'>Write Address</textarea>
                      </div>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <div className='col-md-2 col-auto page-item active mt-2'>
                      <a href='#' className='page-link'><i className='fas fa-chevron-left' /></a>
                    </div>
                    <div className='col-md-3 col-auto'>
                      <button className='btn btn-primary' onClick={this.handleAddNearestAreas} type='submit'>Next</button>
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

export default CreateLocation
