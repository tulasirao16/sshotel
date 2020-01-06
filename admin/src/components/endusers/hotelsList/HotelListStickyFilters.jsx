/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import { hashHistory } from 'react-router'
import DatePicker from 'react-datepicker'
import Modal from 'react-modal'

const customStyles = {
  content: {
    width: '75%',
    height: '80vh',
    top: '60%',
    left: 'auto',
    right: '13%',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}
class HotelListStickyFilters extends React.Component {
  constructor () {
    super()
    this.state = {
      startDate: new Date(),
      modalIsOpen: false,
      aminities: ['Wifi', 'Breakfast', 'Iron', 'Washer', 'Hanger', 'Hairdry', 'Laundry', 'Lunch', 'AC', 'TV', 'Car Parking', 'Dinner'],
      services: ['Tourist Guide', 'Pickup And Drop', 'Doctor on Call', 'SPA', 'Baby Care'],
      rules: ['arties & Events', 'Alcohol', 'Dogs', 'Smoking', 'Children'],
      language: ['English', 'Hindi', 'Telugu', 'Tamil', 'Malayali']
    }
    this.handleEndUserLogin = this.handleEndUserLogin.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  handleEndUserLogin (e) {
    hashHistory.push('/login')
    e.preventDefault()
  }
  handleChange (date) {
    this.setState({
      startDate: date
    })
  }
  openModal () {
    this.setState({ modalIsOpen: true })
  }
  afterOpenModal () {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00'
  }
  closeModal () {
    this.setState({ modalIsOpen: false })
  }
  render () {
    return (
      <nav className=' navbar-expand-lg navbar-dark special-color-dark filterbar py-2'>
        {/* <!-- Collapse button --> */}
        <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarSupportedContent2'
          aria-controls='navbarSupportedContent2' aria-expanded='false' aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon'>{ /*  */ }</span>
        </button>
        {/* <!-- Collapsible content --> */}
        <div className='collapse navbar-collapse container' id='navbarSupportedContent2'>
          <div className='container'>
            <div className='row'>
              <div className='col-lg-4 col-xs-12 col-sm-4 '>
                {/* dates start */}
                <div className='filter-tab-dates-view px-2'>
                  <div className='search-item filterDates pt-2 '>
                    <div className='fltp calendar-sq' id='rangestart'>
                      <DatePicker
                        selected={this.state.startDate}
                        onChange={this.handleChange}
                        className='filter'
                      />
                      <label className='placeholder' data-big-placeholder='Check in' style={{ top: '-16px', fontSize: '.67em' }}
                        data-little-placeholder='Start'>{ /*  */ }</label>
                    </div>
                    <i className='fas fa-long-arrow-alt-right' style={{ marginRight: '5rem', position: 'relative', bottom: 0 }} >{ /*  */ }</i>
                    <div className='fltp calendar-sq' id='rangestart'>
                      <DatePicker
                        selected={this.state.startDate}
                        onChange={this.handleChange}
                        className='filter'
                      />
                      <label className='placeholder' data-big-placeholder='Check out' style={{ top: '-16px', fontSize: '0.67em' }}
                        data-little-placeholder='Start'>{ /*  */ }</label>
                    </div>
                  </div>
                </div>
                {/* dates end */}
              </div>
              {/* guests starts */}
              <div className='col-lg-2 col-sm-2 col-xs-12 text-center filter-tab-guests-view'>
                <div className='search-item'>
                  <select className='selectpicker guests-picker'>
                    <option>Guests</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                  </select>
                </div>
              </div>
              {/* guests starts */}
              {/* pricing starts */}
              {/* <div className='col-sm-3 col-xs-12 col-lg-3'>
                  <div className='filter-tab-pricing-view'>
                    <div>
                      <h5>price slider</h5>
                    </div>
                  </div>
                </div> */}
              {/* pricing ends */}
              {/* sorting starts */}
              <div className='col-lg-2 col-sm-2 col-xs-12 filter-tab-sorting-view'>
                <button className='btn btn-icon btn-primary sorting-btn' type='button' onClick={this.openModal}>
                  <span className='btn-inner--icon'><i className='pr-2 fa fa-filter'>{ /*  */ }</i></span>
                  <span className='btn-inner--text'>Sorting</span>
                </button>
              </div>
              {/* sorting ends */}
              {/* Modal filter starts */}
              <div className='col-lg-2 col-sm-2 col-xs-12 filter-tab-filter-view'>
                <button className='btn btn-icon btn-primary filter-btn' type='button' onClick={this.openModal}>
                  <span className='btn-inner--icon'><i className='pr-2 fa fa-filter'>{ /*  */ }</i></span>
                  <span className='btn-inner--text'>Filters</span>
                  <span className='btn-inner--icon'><i className='pl-2 fas fa-angle-down'>{ /*  */ }</i></span>
                </button>
              </div>
              {/* Modal filter starts */}
            </div>
          </div>
        </div>
        {/* <!-- Collapsible content --> */}
        <Modal
          isOpen={this.state.modalIsOpen}
          // onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel='Filter Modal'>
          <div className='row py-2 modal-close' style={{ justifyContent: 'flex-end' }}>
            <a onClick={this.closeModal}><span><i className='fas fa-times'>{ /*  */ }</i></span></a>
          </div>
          <div>
            <div className='row'>
              <div className='col-md-12 col-sm-12 col-xs-12 sub-menu mb-xl-0 mb-4'>
                <div className='row'>
                  <div className='col-lg-3 col-sm-3 col-xs-12'>
                    <label>Bed Rooms</label>
                    <select className='form-control'>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                    </select>
                  </div>
                  <div className='col-lg-3 col-sm-3 col-xs-12'>
                    <label>Beds</label>
                    <select className='form-control'>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                    </select>
                  </div>
                  <div className='col-lg-3 col-sm-3 col-xs-12'>
                    <label>Bath Rooms</label>
                    <select className='form-control'>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                    </select>
                  </div>
                  <div className='col-lg-3 col-sm-3 col-xs-12'>
                    <label>Room Type</label>
                    <select className='form-control'>
                      <option>Entire Space</option>
                      <option>Private Room</option>
                      <option>Shared Room</option>
                    </select>
                  </div>
                </div>
                <hr />
                <div className='row'>
                  <div className='col-sm-6 col-lg-3 col-xs-12 '>
                    <div className='custom-control custom-checkbox'>
                      <input type='checkbox' className='custom-control-input' id='customCheck1' />
                      <label className='custom-control-label' htmlFor='customCheck1'>Instant Booking</label>
                    </div>
                  </div>
                  <div className='col-sm-6 col-lg-3 col-xs-12'>
                    <div className='custom-control custom-checkbox'>
                      <input type='checkbox' className='custom-control-input' id='customCheck1' />
                      <label className='custom-control-label' htmlFor='customCheck1'>Super Host</label>
                    </div>
                  </div>
                </div>
                <hr />
                <div className='aminities'>
                  <div className='row '>
                    <div className='col-sm-12'>
                      <label>Aminities</label>
                    </div>
                    {this.state.aminities && this.state.aminities.length > 0 ? this.state.aminities.map((item, i) =>
                      <div className='col-sm-4 col-lg-2 col-xs-12 pt-2' key={i}>
                        <div className='custom-control custom-checkbox'>
                          <input type='checkbox' className='custom-control-input' id='customCheck1' />
                          <label className='custom-control-label' htmlFor='customCheck1' key={i} >{item}</label>
                        </div>
                      </div>
                    ) : 'No Data'}
                    <div className='col-sm-12 pt-2 filter-more'>
                      <a className=' more-trigger' data-more='More' data-less='Less'>
                        <i className='far fa-arrow-alt-circle-down' />
                      </a>
                    </div>
                  </div>
                </div>
                <hr />
                <div className='services'>
                  <div className='row '>
                    <div className='col-sm-12'>
                      <label>Services</label>
                    </div>
                    {this.state.services && this.state.services.length > 0 ? this.state.services.map((item, i) =>
                      <div className='col-sm-4 col-lg-3 col-xs-12 pt-2' key={i}>
                        <div className='custom-control custom-checkbox'>
                          <input type='checkbox' className='custom-control-input' id='customCheck1' />
                          <label className='custom-control-label' htmlFor='customCheck1'>{item}</label>
                        </div>
                      </div>
                    ) : <div className='col-lg-12, col-xs-12 col-sm-12 text-center'>No Services Available </div>}
                    <div className='col-sm-12 pt-2 filter-more'>
                      <a className=' more-trigger' data-more='More' data-less='Less'>
                        <i className='far fa-arrow-alt-circle-down' />
                      </a>
                    </div>
                  </div>
                </div>
                <hr />
                <div className='rules'>
                  <div className='row '>
                    <div className='col-sm-12'>
                      <label>Guest rules</label>
                    </div>
                    {this.state.rules && this.state.rules.length > 0 ? this.state.rules.map((item, i) =>
                      <div className='col-sm-4 col-lg-3 col-xs-12 pt-2' key={i}>
                        <div className='custom-control custom-checkbox'>
                          <input type='checkbox' className='custom-control-input' id='customCheck1' />
                          <label className='custom-control-label' htmlFor='customCheck1'>{item}</label>
                        </div>
                      </div>
                    ) : <div className='col-lg-12, col-xs-12 col-sm-12 text-center'>No Guest Rules </div>}
                    <div className='col-sm-12 pt-2 filter-more'>
                      <a className=' more-trigger' data-more='More' data-less='Less'>
                        <i className='far fa-arrow-alt-circle-down' />
                      </a>
                    </div>
                  </div>
                </div>
                <hr />
                <div className='languages'>
                  <div className='row '>
                    <div className='col-sm-12'>
                      <label>Languages</label>
                    </div>
                    {this.state.language && this.state.language.length > 0 ? this.state.language.map((item, i) =>
                      <div className='col-sm-4 col-lg-2 col-xs-12 pt-2' key={i}>
                        <div className='custom-control custom-checkbox'>
                          <input type='checkbox' className='custom-control-input' id='customCheck1' />
                          <label className='custom-control-label' htmlFor='customCheck1'>{item}</label>
                        </div>
                      </div>
                    ) : <div className='col-lg-12, col-xs-12 col-sm-12 text-center'>No data </div>}
                    <div className='col-sm-12 pt-2 filter-more'>
                      <a className=' more-trigger' data-more='More' data-less='Less'>
                        <i className='far fa-arrow-alt-circle-down' />
                      </a>
                    </div>
                  </div>
                </div>
                <hr />
                <div className='row modal-btns' >
                  <button onClick={this.closeModal} className='btn btn-danger' type='button' >Cancel</button>
                  <button className='btn btn-success' type='button' >Apply</button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </nav>
    )
  }
}

export default HotelListStickyFilters
