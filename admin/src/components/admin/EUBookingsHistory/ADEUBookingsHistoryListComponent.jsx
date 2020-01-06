/* eslint-disable max-len */
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
import { Tabs, Tab } from 'react-bootstrap'
import './css/Bookings.css'
import BookingData from './BookingsEachRowComponent'
import ADEUBookingsViewHistoryComponent from './ADEUBookingsViewHistoryComponent'
import ADEUEditBookingComponent from './ADEUEditBookingComponent'
import ADEUInboxMessageComponent from '../EUInbox/ADEUInboxListComponent'
import ADEURatingComponent from './GiveRating'
import Pagination from 'react-js-pagination'

class ADEUBookingsHistoryListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      userData: JSON.parse(localStorage.getItem('userData')),
      bhType: 'all',
      searchString: '',
      bookingDataArray: [],
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
    this.handleView = this.handleView.bind(this)
    this.handleViewClose = this.handleViewClose.bind(this)
    this.handleRating = this.handleRating.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
    this.childFunction = this.childFunction.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleUsers = this.handleUsers.bind(this)
  }
  componentWillMount () {
    if (this.state.userData && this.state.userData._id) {
      let getEUBookingsObj = {
        url: config.baseUrl + config.getADEUBookingsHistoryListAPI + this.state.userData._id + '/' + this.state.bhType + '/' + this.state.activePage + '/' + this.state.searchString
      }
      let _this = this
      APICallManager.getCall(getEUBookingsObj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({
            bookingDataArray: resObj.data.statusResult.bookingData, totalCountBookings: resObj.data.statusResult.totalDocs
          })
        }
      })
    }
  }
  handleSearch = (event) => {
    let _this = this
    let searchValue = this.state.searchString
    _this.setState({ activePage: 1 })
    let getEUBookingsObj = {
      url: config.baseUrl + config.getADEUBookingsHistoryListAPI + this.state.userData._id + '/' + this.state.bhType + '/' + 1 + '/' + searchValue
    }
    APICallManager.getCall(getEUBookingsObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          bookingDataArray : resObj.data.statusResult.bookingData, totalCountBookings: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({
          bookingDataArray : [], totalCountBookings: 0
        })
      }
    })
  }
  handleView (data) {
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
    localStorage.setItem('messagesfor', 'euusermesseges')
    this.setState({
      toggle: 'Message',
      data: data
    })
  }
  handleEdit (data) {
    localStorage.setItem('bookingsby', 'eu-bookings')
    localStorage.setItem('bookingData', JSON.stringify(data))
    hashHistory.push('/admin/host/property/bookings-edit')
    // this.setState({
    //   toggle: 'Edit',
    //   data:data
    // })
  }
  childFunction () {
    this.setState({ toggle: '' })
  }
  handleTabs (index) {
    this.setState({ key: index, activePage: 1, searchString: '' })
    switch (index) {
      case '0' :
        this.setState({ bhType: 'all' })
        if (this.state.userData && this.state.userData._id) {
          let getEUBookingsObj = {
            url: config.baseUrl + config.getADEUBookingsHistoryListAPI + this.state.userData._id + '/' + 'all' + '/' + 1 + '/'
          }
          let _this = this
          APICallManager.getCall(getEUBookingsObj, function (resObj) {
            if (resObj.data.statusCode === '0000') {
              _this.setState({
                bookingDataArray: resObj.data.statusResult.bookingData, totalCountBookings: resObj.data.statusResult.totalDocs
              })
            } else {
              _this.setState({ bookingDataArray: [], totalCountBookings: 0 })
            }
          })
        }
        break
      case '1' :
        this.setState({ bhType: 'upcoming' })
        if (this.state.userData && this.state.userData._id) {
          let getEUBookingsObj = {
            url: config.baseUrl + config.getADEUBookingsHistoryListAPI + this.state.userData._id + '/' + 'upcoming' + '/' + 1 + '/'
          }
          let _this = this
          APICallManager.getCall(getEUBookingsObj, function (resObj) {
            if (resObj.data.statusCode === '0000') {
              _this.setState({
                bookingDataArray: resObj.data.statusResult.bookingData, totalCountBookings: resObj.data.statusResult.totalDocs
              })
            } else {
              _this.setState({ bookingDataArray: [], totalCountBookings: 0 })
            }
          })
        }
        break
      case '2' :
        this.setState({ bhType: 'past' })
        if (this.state.userData && this.state.userData._id) {
          let getEUBookingsObj = {
            url: config.baseUrl + config.getADEUBookingsHistoryListAPI + this.state.userData._id + '/' + 'past' + '/' + 1 + '/'
          }
          let _this = this
          APICallManager.getCall(getEUBookingsObj, function (resObj) {
            if (resObj.data.statusCode === '0000') {
              _this.setState({
                bookingDataArray: resObj.data.statusResult.bookingData, totalCountBookings: resObj.data.statusResult.totalDocs
              })
            } else {
              _this.setState({ bookingDataArray: [], totalCountBookings: 0 })
            }
          })
        }
        break
    }
  }
  handlePageChangeBookingsList = (pageNumber) => {
    if (this.state.activePage !== pageNumber) {
      this.setState({ activePage : pageNumber })
      let getEUBookingsObj = {
        url: config.baseUrl + config.getADEUBookingsHistoryListAPI + this.state.userData._id + '/' + this.state.bhType + '/' + pageNumber + '/' + this.state.searchString
      }
      let _this = this
      APICallManager.getCall(getEUBookingsObj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({
            bookingDataArray : resObj.data.statusResult.bookingData, totalCountBookings: resObj.data.statusResult.totalDocs
          })
        } else {
          _this.setState({
            bookingDataArray : [], totalCountBookings: 0
          })
        }
      })
    }
  }
  handleHome (event) {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleUsers () {
    hashHistory.push('/admin/eu-users')
    event.preventDefault()
  }
  handleBack (resObj) {
    if (resObj && resObj._id) {
      let bookingDataArray = this.state.bookingDataArray
      const index = bookingDataArray.findIndex(dataObj => dataObj._id === resObj._id)
      bookingDataArray[index] = resObj
      this.setState({
        toggle: 'List',
        bookingDataArray: bookingDataArray
      })
    } else {
      this.setState({
        toggle: 'List'
      })
    }
  }
  handleEnter (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }
  render () {
    return (
        this.state.toggle === 'List'
      ? <div className='bookings-home'>
        <div className='main-content' id='panel'>
          <div className='header bg-primary pb-6'>
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    <h6 className='h2 text-white d-inline-block mb-0'>{t`lanADEUTitleAdminEUUsers`}</h6>
                    <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item'><a onClick={this.handleUsers}>EU Users List</a></li>
                        <li className='breadcrumb-item active' aria-current='page'>{t`lanCommonTitleBookings`}</li>
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
                      <div className='col-sm-7'>
                        <h6 className='h2 text-primary d-inline-block pt-2'>{t`lanCommonTitleBookings`}</h6>
                      </div>
                      <div className='col-sm-4 pr-0'>
                        {/* -- Search form -- */}
                        <form>
                          <div className='form-group mb-0'>
                            <div className='input-group input-group-lg input-group-flush'>
                              <div className='input-group-prepend'>
                                <div className='input-group-text'>
                                  {/* <span className='fas fa-search'></span> */}
                                </div>
                              </div>
                              <input type='search' className='form-control' placeholder={t`lanCommonLabelSearch`} value={this.state.searchString}
                                onChange={(e) => { this.setState({ searchString: e.target.value }) }} onKeyPress={this.handleEnter} />
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className='col-sm-1 pl-0'>
                        <button className='btn btn-icon btn-primary search-btn-admin px-3 py-2' type='button' onClick={this.handleSearch}>
                          <span className='btn-inner--icon'><i className='fa fa-search' /></span>
                        </button>
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
                              <BookingData data={this.state.bookingDataArray} handleView={this.handleView} handleRating={this.handleRating} handleMessage={this.handleMessage} handleEdit={this.handleEdit} />
                              <div className='container'><div className='row justify-content-center'>
                                {this.state.bookingDataArray.length > 0
                                  ? <div className='col-sm-12 col-12 text-center'>
                                    <Pagination
                                      activePage={this.state.activePage}
                                      itemsCountPerPage={10}
                                      totalItemsCount={this.state.totalCountBookings}
                                      pageRangeDisplayed={5}
                                      onChange={(pageNumber) => this.handlePageChangeBookingsList(pageNumber)}
                                    />
                                  </div> : null }
                              </div>
                              </div>
                            </Tab>
                            <Tab title={t`lanEUTitleUpcoming`} eventKey={1}>
                              <BookingData data={this.state.bookingDataArray} handleView={this.handleView} handleRating={this.handleRating} handleMessage={this.handleMessage} handleEdit={this.handleEdit} />
                              <div className='card-footer'>
                                <div>
                                  {this.state.bookingDataArray.length > 0
                                  ? <div className='text-center'>
                                    <Pagination
                                      activePage={this.state.activePage}
                                      itemsCountPerPage={10}
                                      totalItemsCount={this.state.totalCountBookings}
                                      pageRangeDisplayed={5}
                                      onChange={(pageNumber) => this.handlePageChangeBookingsList(pageNumber)}
                                    />
                                  </div> : null }
                                </div>
                              </div>
                            </Tab>
                            <Tab title={t`lanEUTitlePast`} eventKey={2}>
                              <BookingData data={this.state.bookingDataArray} handleView={this.handleView} handleRating={this.handleRating} handleMessage={this.handleMessage} handleEdit={this.handleEdit} />
                              <div className='card-footer'>
                                <div>
                                  {this.state.bookingDataArray.length > 0
                                    ? <div className='text-center'>
                                      <Pagination
                                        activePage={this.state.activePage}
                                        itemsCountPerPage={10}
                                        totalItemsCount={this.state.totalItemsCount}
                                        pageRangeDisplayed={5}
                                        onChange={(pageNumber) => this.handlePageChangeBookingsList(pageNumber)}
                                      />
                                    </div> : null }
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
      </div>
      : this.state.toggle === 'View' ? <ADEUBookingsViewHistoryComponent data={this.state.data} handleBack={this.handleBack} handleRating={this.handleRating} />
      : this.state.toggle === 'Edit' ? <ADEUEditBookingComponent handleBack={this.handleBack} />
      : this.state.toggle === 'Message' ? <ADEUInboxMessageComponent handleBookingsBack={this.handleBack} />
      : this.state.toggle === 'Rating' ? <ADEURatingComponent hotel={this.state.hotel} bookingCode={this.state.bookingCode} data={this.state.data} handleViewClose={this.handleBack} />
      : ''
    )
  }
}
export default ADEUBookingsHistoryListComponent
