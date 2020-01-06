/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import { t } from 'ttag'
// import Switch from 'react-switch'
import { Tabs, Tab } from 'react-bootstrap'
// import FooterComponent from '../FooterCompnt/Footer'
import './css/Bookings.css'
import BookingData from './BookingsEachRowComponent'
import EUBookingViewComponent from './EUBookingViewComponent'
import EUReviewRatingComponent from '../reviews/EURatingComponent'
import EUInboxSendMessageComponent from '../inbox/EUInboxSendMessageComponent'
import Pagination from 'react-js-pagination'

class EUBookingsListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      dataType: 'all',
      searchString: '',
      bookingDate : [],
      toggle: 'List',
      key: '0',
      activePage: 1,
      data: {},
      bookingCode: '',
      hotel: '',
      totalCountBookings: 0
    }
    // this.handleEUCreatebooking = this.handleEUCreatebooking.bind(this)
    this.handleTabs = this.handleTabs.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleViewClose = this.handleViewClose.bind(this)
    this.handleRating = this.handleRating.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
    this.childFunction = this.childFunction.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }
  componentWillMount () {
    let getEUBookingsObj = {
      url: config.baseUrl + config.getEUBookingsHistoryListAPI + this.state.activePage + '/' + this.state.dataType + '/' + this.state.searchString
    }
    let _this = this
    APICallManager.getCall(getEUBookingsObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          bookingDate : resObj.data.statusResult.bookingData, totalCountBookings: resObj.data.statusResult.totalDocs
        })
      }
    })
  }
  handleSearch = (event) => {
    let _this = this
    _this.setState({ searchString: event.target.value })
    let getEUBookingsObj = {
      url: config.baseUrl + config.getEUBookingsHistoryListAPI + this.state.activePage + '/' + this.state.dataType + '/' + event.target.value
    }
    APICallManager.getCall(getEUBookingsObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          bookingDate : resObj.data.statusResult.bookingData, totalCountBookings: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({
          bookingDate : [], totalCountBookings: 0
        })
      }
    })
  }

  // handleEUCreatebooking (event) {
  //   hashHistory.push('/eucreatebooking')
  //   event.preventDefault()
  // }
  handleToggle (data) {
    this.setState({
      toggle: 'View',
      data: data
    })
  }
  handleViewClose () {
    this.setState({
      toggle: 'List',
      data: {}
    })
  }
  handleRating (data) {
    this.setState({
      toggle: 'Rating',
      bookingCode: data.bookingCode,
      hotel: data.spPropertyTitle,
      data: data
    })
  }
  handleMessage (data) {
    this.setState({
      toggle: 'Message',
      data: data
    })
  }
  childFunction () {
    this.setState({ toggle: '' })
  }
  handleTabs (index) {
    this.setState({ key: index })
    let _this = this
    switch (index) {
      case '0' :
        let getEUBookingsObj = {
          url: config.baseUrl + config.getEUBookingsHistoryListAPI + this.state.activePage + '/' + 'all' + '/' + _this.state.searchString
        }
        APICallManager.getCall(getEUBookingsObj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            _this.setState({
              bookingDate : resObj.data.statusResult.bookingData,
              totalCountBookings: resObj.data.statusResult.totalDocs,
              dataType: 'all'
            })
          } else {
            _this.setState({ bookingDate: [], totalCountBookings: 0, dataType: 'all' })
          }
        })
        break
      case '1' :
        let getEUBookingsUpcomingObj = {
          url: config.baseUrl + config.getEUBookingsHistoryListAPI + this.state.activePage + '/' + 'Booked' + '/' + _this.state.searchString
        }
        APICallManager.getCall(getEUBookingsUpcomingObj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            _this.setState({
              bookingDate : resObj.data.statusResult.bookingData,
              totalCountBookings: resObj.data.statusResult.totalDocs,
              dataType: 'Booked'
            })
          } else {
            _this.setState({ bookingDate: [], totalCountBookings: 0, dataType: 'Booked' })
          }
        })
        break
      case '2' :
        let getEUBookingsPastObj = {
          url: config.baseUrl + config.getEUBookingsHistoryListAPI + this.state.activePage + '/' + 'Completed' + '/' + _this.state.searchString
        }
        APICallManager.getCall(getEUBookingsPastObj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            _this.setState({
              bookingDate : resObj.data.statusResult.bookingData,
              totalCountBookings: resObj.data.statusResult.totalDocs,
              dataType: 'Completed'
            })
          } else {
            _this.setState({ bookingDate: [], totalCountBookings: 0, dataType: 'Completed' })
          }
        })
        break
    }
  }
  handlePageChangeBookingsList = (pageNumber) => {
    this.setState({ activePage : pageNumber })
    let getEUBookingsObj = {
      url: config.baseUrl + config.getEUBookingsHistoryListAPI + pageNumber + '/' + this.state.dataType + '/' + this.state.searchString
    }
    let _this = this
    APICallManager.getCall(getEUBookingsObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          bookingDate : resObj.data.statusResult.bookingData, totalCountBookings: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({
          bookingDate : [], totalCountBookings: 0
        })
      }
    })
  }
  handleHome (event) {
    hashHistory.push('/hotels')
    event.preventDefault()
  }
  render () {
    return (
    this.state.toggle === 'List'
    ? <div className='bookings-home'>
      <div className='main-content' id='panel'>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center pt-7 pb-3'>
                <div className='col-lg-6 col-7'>
                  <nav aria-label='breadcrumb' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a >{t`lanCommonTitleBookings`}</a></li>
                      {/* <li className='breadcrumb-item active' aria-current='page'>Bookings List Page</li> */}
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6'>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-12 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header py-2'>
                  <div className='row'>
                    <div className='col-sm-8'>
                      <h6 className='h2 text-primary d-inline-block pt-2'>{t`lanCommonTitleBookings`}</h6>
                    </div>
                    <div className='col-sm-4'>
                      {/* -- Search form -- */}
                      <form>
                        <div className='form-group mb-0'>
                          <div className='input-group input-group-lg input-group-flush'>
                            <div className='input-group-prepend'>
                              <div className='input-group-text'>
                                {/* <span className='fas fa-search'></span> */}
                              </div>
                            </div>
                            <input type='search' className='form-control' placeholder={t`lanCommonLabelSearch`} value={this.state.searchString} onChange={(search) => this.handleSearch(search)} />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className='card-body'>
                  <section className='notifications bookings eu-bookings-list'>
                    <div className='row clearfix'>
                      <div className='col-md-12 col-lg-12 col-xl-12 px-lg-4 '>
                        {/* tabs list */}
                        <Tabs activeKey={this.state.key} onSelect={key => this.handleTabs(key)} className='eu-bookings-list'
                          defaultActiveKey={this.state.key} headerclass='tab-header-bold' activeceaderclass='tab-header-blue'
                        >
                          <Tab title={t`lanEUTitleAll`} eventKey={0}>
                            <BookingData data={this.state.bookingDate} handleToggle={this.handleToggle} handleRating={this.handleRating} handleMessage={this.handleMessage} />
                            <div className='container'><div className='row justify-content-center'>
                              <div className='col-sm-12 col-12 text-center'>
                                <Pagination
                                  activePage={this.state.activePage}
                                  itemsCountPerPage={10}
                                  totalItemsCount={this.state.totalCountBookings}
                                  pageRangeDisplayed={5}
                                  onChange={(pageNumber) => this.handlePageChangeBookingsList(pageNumber)}
                                />
                              </div>
                            </div>
                            </div>
                          </Tab>
                          <Tab title={t`lanEUTitleUpcoming`} eventKey={1}>
                            <BookingData data={this.state.bookingDate} handleToggle={this.handleToggle} handleRating={this.handleRating} handleMessage={this.handleMessage} />
                            <div className='card-footer'>
                              <div>
                                <div className='text-center'>
                                  <Pagination
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={10}
                                    totalItemsCount={this.state.totalCountBookings}
                                    pageRangeDisplayed={5}
                                    onChange={(pageNumber) => this.handlePageChangeBookingsList(pageNumber)}
                                  />
                                </div>
                              </div>
                            </div>
                          </Tab>
                          <Tab title={t`lanEUTitlePast`} eventKey={2}>
                            <BookingData data={this.state.bookingDate} handleToggle={this.handleToggle} handleRating={this.handleRating} handleMessage={this.handleMessage} />
                            <div className='card-footer'>
                              <div>
                                <div className='text-center'>
                                  <Pagination
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={10}
                                    totalItemsCount={this.state.totalCountBookings}
                                    pageRangeDisplayed={5}
                                    onChange={(pageNumber) => this.handlePageChangeBookingsList(pageNumber)}
                                  />
                                </div>
                              </div>
                            </div>
                          </Tab>
                        </Tabs>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> : this.state.toggle === 'View' ? <EUBookingViewComponent data={this.state.data} handleViewClose={this.handleViewClose} handleRating={this.handleRating} />
    : this.state.toggle === 'Rating' ? <EUReviewRatingComponent handleViewClose={this.handleViewClose} data={this.state.bookingCode} hotel={this.state.hotel} dataObj={this.state.data} />
    : this.state.toggle === 'Message' ? <EUInboxSendMessageComponent messageData={this.state.data} childFunction={this.childFunction} />
    : <EUBookingsListComponent />
    )
  }
}

export default EUBookingsListComponent
