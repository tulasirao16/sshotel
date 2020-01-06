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
import { t } from 'ttag'

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
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPLabelPropertyInfoEdit`}</h6>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  <a href='#' className='btn btn-neutral' onClick={this.handleCreatePropertyInfo}><i className='fas fa-plus' />{t`lanSPLabelCreatePropertyInfo`}</a>
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
                          <h4 className='mb-0'><a href='#'>{t`lanSPLabelCeleBrityHotels`}</a> </h4>
                          <p className='text-sm mb-0'>{t`lanSPLabelTarnaka`}</p>
                          <p className='text-sm mb-0'>{t`lanSPLabelHotelPropertyInfoEdit`}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='card-header'>
                  <h3 className='mb-0'>{t`lanSPLabelPropertyInfoEdit`}</h3>
                </div>
                <div className='card-body property-info-View'>
                  <div className='accordion' id='accordionExample'>
                    <div className='card'>
                      <div className='card-header' id='headingOne' data-toggle='collapse' data-target='#collapseOne' aria-expanded='true' aria-controls='collapseOne'>
                        <h6 className='mb-0'>{t`lanSPLabelPropertyInfoEdit`}</h6>
                      </div>
                      <div id='collapseOne' className='collapse show' aria-labelledby='headingOne' data-parent='#accordionExample'>
                        <div className='card-body'>
                          <div className='row'>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelPropertyTitle`}</label>
                                <input type='text' className='form-control' id='example3cols2Input' value='CeleBrity Hotels' />
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelTypeOfProperty`}</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>{t`lanSPLabelSelectPropertyType`}</option>
                                  <option>Hotel</option>
                                  <option>Individual</option>
                                </select>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelRoomCategeory`}</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>{t`lanSPLabelSelectPropertyType`}</option>
                                  <option>Deluxe</option>
                                  <option>Luxary</option>
                                </select>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelRentType`}</label>
                                <input type='text' className='form-control' id='example3cols2Input' value='Private Room' />
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelRoomType`}</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>{t`lanSPLabelSelectRoomType`}</option>
                                  <option>1 BHK</option>
                                  <option>2 BHK</option>
                                  <option>3 BHK</option>
                                </select>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelRoomName`}</label>
                                <input type='text' className='form-control' id='example3cols2Input' value='Service #102' />
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelAdultCapacity`}</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>{t`lanSPLabelSelectAdults`}</option>
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
                                <label className='form-control-label'>{t`lanSPLabelChildCapacity`}</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>{t`lanSPLabelSelectChilds`}</option>
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
                                <label className='form-control-label'>{t`lanSPLabelRoomsCount`}</label>
                                <input type='text' className='form-control' id='example3cols2Input' value='4 of 5' />
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelOnholdRoomsCount`}</label>
                                <input type='text' className='form-control' id='example3cols2Input' value='02' />
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelStatus`}</label>
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
                                <label className='form-control-label'>{t`lanSPLabelDafaultPriority`}</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>{t`lanSPLabelSelectDafaultPriority`}</option>
                                  <option>True</option>
                                  <option>False</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-md-3'>
                              <div className='form-group'>
                                <label className='form-control-label'>{t`lanSPLabelSingleBeds`}</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>{t`lanSPLabelSelectSingleBeds`}</option>
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
                                <label className='form-control-label'>{t`lanSPLabelDoubleBeds`}</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>{t`lanSPLabelSelectDoubleBeds`}</option>
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
                                <label className='form-control-label'>{t`lanSPLabelBathRooms`}</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>{t`lanSPLabelSelectBathRooms`}</option>
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
                                <label className='form-control-label'>{t`lanSPLabelNoOfAcS`}</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>{t`lanSPLabelSelectAcS`}</option>
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
                                <label className='form-control-label'>{t`lanSPLabelNooOfKitchens`}</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>{t`lanSPLabelSelectKitchens`}</option>
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
                                <label className='form-control-label'>{t`lanSPLabelNoOfHalls`}</label>
                                <select className='form-control' id='exampleFormControlSelect1'>
                                  <option>{t`lanSPLabelSelectHalls`}</option>
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
                        <h6 className='mb-0'>{t`lanSPLabelPriceDetails`}</h6>
                      </div>
                      <div id='collapseTwo' className='collapse' aria-labelledby='headingTwo' data-parent='#accordionExample'>
                        <div className='card-body'>
                          <ul className='list-group list-group-flush list my--3'>
                            <li className='list-group-item px-0'>
                              <div className='row align-items-center'>
                                <div className='col'>
                                  <small>{t`lanSPLabelMinBasePriceUnit`}</small>
                                  <h5 className='mb-0'>{t`lanSPLabelSixHours`}</h5>
                                </div>
                                <div className='col'>
                                  <small>{t`lanSPLabelMinBasePrice`}</small>
                                  <h5 className='mb-0'>Rs.1500</h5>
                                </div>
                                <div className='col'>
                                  <small>{t`lanSPLabelBillingType`}</small>
                                  <h5 className='mb-0'>{t`lanSPLabelPerHour`}</h5>
                                </div>
                                <div className='col'>
                                  <small>{t`lanSPLabelBasePrice`}</small>
                                  <h5 className='mb-0'>Rs.2000</h5>
                                </div>
                                <div className='col'>
                                  <small>{t`lanSPLabelCheckinCredentials`}</small>
                                  <h5 className='mb-0'>{t`lanSPLabelAroundTheClock`}</h5>
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item px-0'>
                              <div className='row align-items-center'>
                                <div className='col'>
                                  <small>{t`lanSPLabelCheckInTime`}</small>
                                  <h5 className='mb-0'>01:00 PM</h5>
                                </div>
                                <div className='col'>
                                  <small>{t`lanSPLabelCheckOutTime`}</small>
                                  <h5 className='mb-0'>12:00 AM</h5>
                                </div>
                                <div className='col'>
                                  <small>{t`lanSPLabelCurrency`}</small>
                                  <h5 className='mb-0'>INR - (Indian Rupees)</h5>
                                </div>
                                <div className='col'>
                                  <small>{t`lanSPLabelFullRefundCancelTime`}</small>
                                  <h5 className='mb-0'>{t`lanSPLabel24Hours`}</h5>
                                </div>
                                <div className='col'>
                                  <small>{t`lanSPLabelRefundCancelTime`}</small>
                                  <h5 className='mb-0'>{t`lanSPLabel12Hours`}</h5>
                                </div>
                              </div>
                            </li>
                            <li className='list-group-item px-0'>
                              <div className='row align-items-center'>
                                <div className='col'>
                                  <small>{t`lanSPLabelRefundCancelPercentage`} (%)</small><br />
                                  <h5 className='mb-0'>{t`lanSPLabel12Hours`}</h5>
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
                        <h6 className='mb-0'>{t`lanSPLabelAmenities`}</h6>
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
                                  <p><img src={require('../images/amenities/wifi.png')} className='icon-calendar' />{t`lanSPLabelWiFi`}- <span className='text-success'>{t`lanSPLabelFree`}</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/air-conditioner.png')} className='icon-calendar' />{t`lanSPLabelAirConditioner`} - <span className='text-success'>Rs.50/-</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/icon8.png')} className='icon-calendar' /> {t`lanSPLabelCarParking`}- <span className='text-success'>Rs.50/-</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/icon9.png')} className='icon-calendar' /> {t`lanSPLabelLunch`} - <span className='text-success'>Rs.50/-</span></p>
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
                                  <p><img src={require('../images/amenities/icon10.png')} className='icon-three' />{t`lanSPLabelSwimmingPool`} - <span className='text-success'>Rs.250/-</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/icon11.png')} className='icon-three' /> {t`lanSPLabelGYM`} - <span className='text-success'>Rs.480/-</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/icon12.png')} className='icon-three' /> {t`lanSPLabelBeds`} - <span className='text-success'>{t`lanSPLabelFree`}</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/icon13.png')} className='icon-three' /> {t`lanSPLabelWelcomeDrinks`} - <span className='text-success'>{t`lanSPLabelFree`}</span></p>
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
                                  <p><img src={require('../images/amenities/laundry.png')} className='icon-three' />{t`lanSPLabelLaundry`} - <span className='text-success'>Rs.250/-</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/breakfast.png')} className='icon-three' />{t`lanSPLabelBreakfast`}- <span className='text-success'>Rs.30/-</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/lift.png')} className='icon-three' />{t`lanSPLabelLift`} - <span className='text-success'>{t`lanSPLabelFree`}</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/television.png')} className='icon-three' /> {t`lanSPLabelTV`} - <span className='text-success'>{t`lanSPLabelFree`}</span></p>
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
                                  <p><img src={require('../images/amenities/spa.png')} className='icon-three' /> {t`lanSPLabelSPA`} - <span className='text-success'>Rs.250/-</span></p>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-header' id='headingFour' data-toggle='collapse' data-target='#collapseFour' aria-expanded='false' aria-controls='collapseFour'>
                        <h6 className='mb-0'>{t`lanSPLabelServices`}</h6>
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
                                  <p><img src={require('../images/services/car.png')} className='icon-calendar' /> {t`lanSPLabelPickupDrop`} - <span className='text-success'>{t`lanSPLabelFree`}</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/amenities/air-conditioner.png')} className='icon-calendar' /> {t`lanSPLabelAirConditioner`} - <span className='text-success'>Rs.50/-</span></p>
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
                                  <p><img src={require('../images/services/touristguide.png')} className='icon-three' /> {t`lanSPLabelTouristGuide`} - <span className='text-success'>Rs.250/-</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images//services/spa.png')} className='icon-three' /> {t`lanSPLabelSPA`} - <span className='text-success'>Rs.480/-</span></p>
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
                                  <p><img src={require('../images/services/babycare.png')} className='icon-calendar' />{t`lanSPLabelBabyCare`} - <span className='text-success'>Rs.150/-</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/services/doctoroncall.png')} className='icon-calendar' />{t`lanSPLabelDoctorOnCall`} - <span className='text-success'>Rs.150/-</span></p>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card'>
                      <div className='card-header' id='headingFive' data-toggle='collapse' data-target='#collapseFive' aria-expanded='false' aria-controls='collapseFive'>
                        <h6 className='mb-0'>{t`lanSPLabelGuestRules`}</h6>
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
                                  <p><img src={require('../images/guestrules/noalcohol.png')} className='icon-calendar' /> {t`lanSPLabelAlcohol`}- <span className='text-success'>{t`lanSPLabelNotAllowed`}</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/guestrules/partiesevents.png')} className='icon-calendar' /> {t`lanSPLabelPartiesEvents`} - <span className='text-success'>{t`lanSPLabelAllowed`}</span></p>
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
                                  <p><img src={require('../images/guestrules/dog.png')} className='icon-calendar' /> {t`lanSPLabelDogs`} - <span className='text-success'>{t`lanSPLabelAllowed`}</span></p>
                                </li>
                                <li className='list-group-item'>
                                  <label className='checkbox'>
                                    <input type='checkbox' />
                                    <span className='default' />
                                  </label>
                                  <p><img src={require('../images/guestrules/smokefree.jpg')} className='icon-calendar' />{t`lanSPLabelSmoking`} - <span className='text-success'>{t`lanSPLabelNotAllowed`}</span></p>
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
                                  <p><img src={require('../images/guestrules/children.png')} className='icon-three' /> {t`lanSPLabelChildren`} - <span className='text-success'>{t`lanSPLabelAllowed`}</span></p>
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
