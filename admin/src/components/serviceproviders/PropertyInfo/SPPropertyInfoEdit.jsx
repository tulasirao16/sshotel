/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import Switch from 'react-switch'
import 'react-drawer/lib/react-drawer.css'
import DrawerWithHeader from '../Drawer/DrawerComponent'
import FooterComponent from '../FooterCompnt/Footer'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPPropertyInfoEdit extends React.Component {
  constructor () {
    super()
    this.state = {
      starrating:''
    }
    this.handleCreatePropertyInfo = this.handleCreatePropertyInfo.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleCreatePropertyInfo (event) {
    hashHistory.push('/host/property-info/create')
    event.preventDefault()
  }

  handleRatingChanged (newRating) {
    this.setState({ starrating: newRating })
  }

  handleChange (checked) {
    this.setState({ checked })
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
                  <h6 className='h2 text-white d-inline-block mb-0'>Property Info Edit</h6>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  <a href='#' className='btn btn-neutral' onClick={this.handleCreatePropertyInfo}><i className='fas fa-plus' /> Create Property Info</a>
                </div>
              </div>
            </div>
          </div>
        </div>{/* ---------- Header Starts ------------- */}
        <div className='container mt--6'>
          <div className='row justify-content-center'>
            <div className='col-lg-12 col-md-12'>
              <div className='card border-0 mb-0'>
                <div className='sp-hotels'>
                  <div className='card mb-0'>
                    {/* Card body */}
                    <div className='card-body'>
                      <div className='row align-items-center'>
                        <div className='col-auto'>
                          {/* Avatar */}
                          <a href='#' className='rounded-circle'>
                            <img src={require('../images/room1.jpg')} className='avatar rounded-circle' />
                          </a>
                        </div>
                        <div className='col ml--2'>
                          <h4 className='mb-0'><a href='#'>CeleBrity Hotels</a> </h4>
                          <p className='text-sm mb-0'>Tarnaka</p>
                          <p className='text-sm mb-0'>Hotel - Property Info Edit</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card-header'>
                  <h3 className='mb-0'>Property Info Edit</h3>
                </div>
                <div className='card-body property-info-View'>
                  <div className='accordion' id='accordionExample'>
                    <div className='card'>
                      <div className='card-header' id='headingOne' data-toggle='collapse' data-target='#collapseOne' aria-expanded='true' aria-controls='collapseOne'>
                        <h6 className='mb-0'>Property Info Edit</h6>
                      </div>
                      <div id='collapseOne' className='collapse show' aria-labelledby='headingOne' data-parent='#accordionExample'>
                        <div className='card-body'>
                          <div className='row'>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>Property Title</label>
                                <input type='text' className='form-control' id='example3cols2Input' value='CeleBrity Hotels' />
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>Type of Property</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>Select Property Type</option>
                                  <option>Hotel</option>
                                  <option>Individual</option>
                                </select>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>Room Categeory</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>Select Property Type</option>
                                  <option>Deluxe</option>
                                  <option>Luxary</option>
                                </select>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>Rent Type</label>
                                <input type='text' className='form-control' id='example3cols2Input' value='Private Room' />
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>Room Type</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>Select Room Type</option>
                                  <option>1 BHK</option>
                                  <option>2 BHK</option>
                                  <option>3 BHK</option>
                                </select>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>Room Name</label>
                                <input type='text' className='form-control' id='example3cols2Input' value='Service #102' />
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>Adult Capacity</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>Select Adults</option>
                                  <option>01</option>
                                  <option>02</option>
                                  <option>03</option>
                                  <option>04</option>
                                  <option>05</option>
                                  <option>06</option>
                                </select>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>Child Capacity</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>Select Childs</option>
                                  <option>01</option>
                                  <option>02</option>
                                  <option>03</option>
                                  <option>04</option>
                                  <option>05</option>
                                  <option>06</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>Rooms Count</label>
                                <input type='text' className='form-control' id='example3cols2Input' value='4 of 5' />
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>Onhold Rooms Count</label>
                                <input type='text' className='form-control' id='example3cols2Input' value='02' />
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>Status</label>
                                <div>
                                  <Switch
                                    className='react-switch'
                                    onChange={this.handleChange}
                                    checked={this.state.checked}
                                    aria-labelledby='neat-label'
                                  />
                                </div>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>Dafault Priority</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>Select Dafault Priority</option>
                                  <option>True</option>
                                  <option>False</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>Single Beds</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>Select Single Beds</option>
                                  <option>01</option>
                                  <option>02</option>
                                  <option>03</option>
                                  <option>04</option>
                                  <option>05</option>
                                </select>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>Double Beds</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>Select Double Beds</option>
                                  <option>01</option>
                                  <option>02</option>
                                  <option>03</option>
                                  <option>04</option>
                                  <option>05</option>
                                </select>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>Bath Rooms</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>Select Bath Rooms</option>
                                  <option>01</option>
                                  <option>02</option>
                                  <option>03</option>
                                  <option>04</option>
                                  <option>05</option>
                                </select>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>No.of A/C's</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>Select A/c's</option>
                                  <option>01</option>
                                  <option>02</option>
                                  <option>03</option>
                                  <option>04</option>
                                  <option>05</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>No.of Kitchens</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>Select Kitchens</option>
                                  <option>01</option>
                                  <option>02</option>
                                  <option>03</option>
                                  <option>04</option>
                                  <option>05</option>
                                </select>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>No.of Halls</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>Select Halls</option>
                                  <option>01</option>
                                  <option>02</option>
                                  <option>03</option>
                                  <option>04</option>
                                  <option>05</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-header' id='headingTwo' data-toggle='collapse' data-target='#collapseTwo' aria-expanded='false' aria-controls='collapseTwo'>
                        <h6 className='mb-0'>Price Details</h6>
                      </div>
                      <div id='collapseTwo' className='collapse' aria-labelledby='headingTwo' data-parent='#accordionExample'>
                        <div className='card-body'>
                          <ul className='list-group list-group-flush list my--3'>
                            <li className='list-group-item px-0'>
                              <div className='row align-items-center'>
                                <div className='col'>
                                  <small>Min Base Price Unit</small>
                                  <h5 className='mb-0'>6 Hours</h5>
                                </div>
                                <div className='col'>
                                  <small>Min Base Price</small>
                                  <h5 className='mb-0'>Rs.1500</h5>
                                </div>
                                <div className='col'>
                                  <small>Billing Type</small>
                                  <h5 className='mb-0'>Per Hour</h5>
                                </div>
                                <div className='col'>
                                  <small>Base Price</small>
                                  <h5 className='mb-0'>Rs.2000</h5>
                                </div>
                                <div className='col'>
                                  <small>Checkin Credentials</small>
                                  <h5 className='mb-0'>Around the Clock</h5>
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item px-0'>
                              <div className='row align-items-center'>
                                <div className='col'>
                                  <small>Check-in Time</small>
                                  <h5 className='mb-0'>01:00 PM</h5>
                                </div>
                                <div className='col'>
                                  <small>Check-out Time</small>
                                  <h5 className='mb-0'>12:00 AM</h5>
                                </div>
                                <div className='col'>
                                  <small>Currency</small>
                                  <h5 className='mb-0'>INR - (Indian Rupees)</h5>
                                </div>
                                <div className='col'>
                                  <small>Full Refund Cancel Time</small>
                                  <h5 className='mb-0'>24 Hours</h5>
                                </div>
                                <div className='col'>
                                  <small>Refund Cancel Time</small>
                                  <h5 className='mb-0'>12 Hours</h5>
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item px-0'>
                              <div className='row align-items-center'>
                                <div className='col'>
                                  <small>Refund Cancel Percentage (%)</small><br />
                                  <h5 className='mb-0'>12 Hours</h5>
                                </div>
                                <div className='col' />
                                <div className='col' />
                                <div className='col' />
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-header' id='headingThree' data-toggle='collapse' data-target='#collapseThree' aria-expanded='false' aria-controls='collapseThree'>
                        <h6 className='mb-0'>Amenities</h6>
                      </div>
                      <div id='collapseThree' className='collapse' aria-labelledby='headingThree' data-parent='#accordionExample'>
                        <div className='card-body'>
                          <div className='row'>
                            <div className='col-md-4'>
                              <ul className='list-group list-group-flush'>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/wifi.png')} className='icon-calendar' /> Wifi - <span className='text-success'>Free</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/air-conditioner.png')} className='icon-calendar' /> Air Conditioner - <span className='text-success'>Rs.50/-</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/icon8.png')} className='icon-calendar' /> Car Parking - <span className='text-success'>Rs.50/-</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/icon9.png')} className='icon-calendar' /> Lunch - <span className='text-success'>Rs.50/-</span></p>
                                </li>
                              </ul>
                            </div>
                            <div className='col-md-4'>
                              <ul className='list-group list-group-flush'>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/icon10.png')} className='icon-three' /> Swimming Pool - <span className='text-success'>Rs.250/-</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/icon11.png')} className='icon-three' /> GYM - <span className='text-success'>Rs.480/-</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/icon12.png')} className='icon-three' /> Beds - <span className='text-success'>Free</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/icon13.png')} className='icon-three' /> Welcome Drinks - <span className='text-success'>Free</span></p>
                                </li>
                              </ul>
                            </div>
                            <div className='col-md-4'>
                              <ul className='list-group list-group-flush'>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/laundry.png')} className='icon-three' /> Laundry - <span className='text-success'>Rs.250/-</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/breakfast.png')} className='icon-three' /> Breakfast - <span className='text-success'>Rs.30/-</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/lift.png')} className='icon-three' /> Lift - <span className='text-success'>Free</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/television.png')} className='icon-three' /> TV - <span className='text-success'>Free</span></p>
                                </li>
                              </ul>
                            </div>
                            <div className='col-md-4'>
                              <ul className='list-group list-group-flush'>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/spa.png')} className='icon-three' /> SPA - <span className='text-success'>Rs.250/-</span></p>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-header' id='headingFour' data-toggle='collapse' data-target='#collapseFour' aria-expanded='false' aria-controls='collapseFour'>
                        <h6 className='mb-0'>Services</h6>
                      </div>
                      <div id='collapseFour' className='collapse' aria-labelledby='headingFour' data-parent='#accordionExample'>
                        <div className='card-body'>
                          <div className='row'>
                            <div className='col-md-4'>
                              <ul className='list-group list-group-flush'>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/services/car.png')} className='icon-calendar' /> Pickup & Drop - <span className='text-success'>Free</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/air-conditioner.png')} className='icon-calendar' /> Air Conditioner - <span className='text-success'>Rs.50/-</span></p>
                                </li>
                              </ul>
                            </div>
                            <div className='col-md-4'>
                              <ul className='list-group list-group-flush'>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/services/touristguide.png')} className='icon-three' /> Tourist Guide - <span className='text-success'>Rs.250/-</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images//services/spa.png')} className='icon-three' /> SPA - <span className='text-success'>Rs.480/-</span></p>
                                </li>
                              </ul>
                            </div>
                            <div className='col-md-4'>
                              <ul className='list-group list-group-flush'>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/services/babycare.png')} className='icon-calendar' /> Baby Care - <span className='text-success'>Rs.150/-</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/services/doctoroncall.png')} className='icon-calendar' /> Doctor on Call - <span className='text-success'>Rs.150/-</span></p>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-header' id='headingFive' data-toggle='collapse' data-target='#collapseFive' aria-expanded='false' aria-controls='collapseFive'>
                        <h6 className='mb-0'>Guest Rules</h6>
                      </div>
                      <div id='collapseFive' className='collapse' aria-labelledby='headingFive' data-parent='#accordionExample'>
                        <div className='card-body'>
                          <div className='row'>
                            <div className='col-md-4'>
                              <ul className='list-group list-group-flush'>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/guestrules/noalcohol.png')} className='icon-calendar' /> Alcohol - <span className='text-success'>Not Allowed</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/guestrules/partiesevents.png')} className='icon-calendar' /> Parties & Events - <span className='text-success'>Allowed</span></p>
                                </li>
                              </ul>
                            </div>
                            <div className='col-md-4'>
                              <ul className='list-group list-group-flush'>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/guestrules/dog.png')} className='icon-calendar' /> Dogs - <span className='text-success'>Allowed</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/guestrules/smokefree.jpg')} className='icon-calendar' /> Smoking - <span className='text-success'>Not Allowed</span></p>
                                </li>
                              </ul>
                            </div>
                            <div className='col-md-4'>
                              <ul className='list-group list-group-flush'>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/guestrules/children.png')} className='icon-three' /> Children - <span className='text-success'>Allowed</span></p>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterComponent />
      </div>
    )
  }
}

export default SPPropertyInfoEdit
