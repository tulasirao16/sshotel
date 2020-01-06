/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import moment from 'moment'
import { t } from 'ttag'
import { hashHistory } from 'react-router'

import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
import MainHeader from '../../../components/endusers/HeaderCompnt/MainHeader'
import FooterComponent from '../../../components/endusers/FooterCompnt/Footer'

import './css/NotificationStyles.css'

class EUNotificationsListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      notificationData: [],
      notificationDummyData: [],
      searchString: '',
      // selectedIDs: [],
      reload: false
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleRedirect = this.handleRedirect.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }
  componentWillMount () {
    let obj = { url: config.baseUrl + config.getEUNotificationsAPI }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        let notifyObj = resObj.data.statusResult
        resObj.data.statusResult.map((item, i) => {
          notifyObj[i].createdAt = moment(item.createdAt).format('MMM DD YY')
        })
        _this.setState({ notificationData: notifyObj, notificationDummyData: notifyObj })
      } else {
        _this.setState({ notificationData: [], notificationDummyData: [] })
      }
    })
  }
  componentWillUnmount () {
    let upObj = { url: config.baseUrl + config.putEUNotificationsUnReadToReadAPI }
    APICallManager.putCall(upObj, function (upResObj) {
    })
  }
  // handleSelect (item) {
  //   let x = this.state.selectedIDs
  //   let i = x.indexOf(item._id)
  //   if (i === -1) {
  //     x.push(item._id)
  //   } else {
  //     x.splice(i, 1)
  //   }
  //   this.setState({ selectedIDs: x })
  // }
  handleSearch (event) {
    this.setState({ searchString: event.target.value })
    let Search = event.target.value
    let searchList = this.state.notificationDummyData.filter(function (item) {
      return item.notificationTitle.indexOf(Search) > -1 ||
        item.notificationMessage.indexOf(Search) > -1 ||
        item.createdAt.indexOf(Search) > -1
    })
    this.setState({ notificationData: searchList })
  }
  handleRedirect (item) {
    if (item.notificationBody && item.notificationBody.type === 'Booking' && item.notificationBody.recordId) {
      hashHistory.push('/bookings/view/' + item.notificationBody.recordId)
    }
  }
  handleDelete (item) {
    this.setState({ reload: true })
    let delobj = { url: config.baseUrl + config.deleteEUNotificationsAPI, body: { notifyIDs: item._id } }
    let obj = { url: config.baseUrl + config.getEUNotificationsAPI }
    let _this = this
    APICallManager.putCall(delobj, function (delResObj) {
      _this.setState({ reload: false })
      if (delResObj.data.statusCode === '0000') {
        APICallManager.getCall(obj, function (resObj) {
          if (resObj.data.statusCode === '0000') {
            let notifyObj = resObj.data.statusResult
            resObj.data.statusResult.map((item, i) => {
              notifyObj[i].createdAt = moment(item.createdAt).format('MMM DD YY')
            })
            _this.setState({ notificationData: notifyObj, notificationDummyData: notifyObj })
          } else {
            _this.setState({ notificationData: [], notificationDummyData: [] })
          }
        })
      } else {
        alert(t`lanEULabelNotificationsDeleteFailed`)
      }
    })
  }
  handleHome (event) {
    hashHistory.push('/hotels')
    event.preventDefault()
  }
  render () {
    return (
      <div>
        <MainHeader navRoute='notifications' />
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center pt-7 pb-3'>
                <div className='col-lg-6 col-7'>
                  <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item eu-font'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item active eu-font' aria-current='page'>{t`lanEUTitleNotifications`}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container mt--6 pb-4'>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-12 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header py-2'>
                  <div className='row'>
                    <div className='col-sm-8'>
                      <h6 className='h2 text-primary d-inline-block pt-2'>{t`lanEUTitleNotifications`}</h6>
                    </div>
                    <div className='col-sm-4'>
                      {/* -- Search form -- */}
                      <form>
                        <div className='form-group mb-0'>
                          <div className='input-group input-group-lg input-group-flush'>
                            <div className='input-group-prepend'>
                              <div className='input-group-text'>
                                <span className='fas fa-search' />
                              </div>
                            </div>
                            <input type='search' className='form-control' placeholder='Search' value={this.state.searchString} onChange={this.handleSearch} />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className='card-body'>
                  <section className='notifications'>
                    <div className='row clearfix'>
                      <div className='col-md-12 col-lg-12 col-xl-12'>
                        {/* List group */}
                        {this.state.notificationData && this.state.notificationData.length > 0
                        ? this.state.notificationData.map((item, i) =>
                          <div className='row align-items-center bottom-line py-1' key={i}>
                            <div className='col-sm-11'>
                              <a onClick={() => this.handleRedirect(item)}>
                                <div className='row align-items-center py-1 list-group-item-action'>
                                  <div className='col-sm-1 col-1'>
                                    {/* Avatar */}
                                    <img src={require('../../../../assets/rm1.jpg')} className='avatar rounded-circle' />
                                  </div>
                                  <div className='col-12 col-sm-9'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                      <div>
                                        <h5 className={item.status === 'Unread' ? 'mb-0 text-sm font-weight-bold' : 'mb-0 text-sm'}>{item.notificationTitle}</h5>
                                      </div>
                                    </div>
                                    <p className={item.status === 'Unread' ? 'text-sm mb-0 eu-font font-weight-bold' : 'text-sm mb-0 eu-font'}>{item.notificationMessage}</p>
                                  </div>
                                  <div className='col-sm-2'>
                                    <div className='text-center text-muted'>
                                      <small>{moment(item.createdAt).format('MMM DD YYYY')}</small>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </div>
                            <div className='col-sm-1'>
                              <a onClick={() => this.handleDelete(item)} className='table-action table-action-delete'
                                title='Delete' >
                                <i className='fas fa-trash' />
                              </a>
                            </div>
                          </div>
                        ) : <div className='container'>
                          <div className='row justify-content-center'>
                            <div className='col-sm-12 text-center my-0' >
                              <div className='no-data'><p>{t`lanEULabelNoNotifications`}</p></div>
                            </div>
                          </div>
                        </div>
                        }
                      </div>
                    </div>
                  </section>
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

export default EUNotificationsListComponent
