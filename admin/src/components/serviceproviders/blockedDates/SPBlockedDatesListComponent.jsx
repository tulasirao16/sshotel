/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import { Tabs, Tab } from 'react-bootstrap'
import PropTypes from 'prop-types'
import moment from 'moment'
import { t } from 'ttag'

import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import './css/Blocked.css'

class SPBlockedDatesListComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      propertyId: this.props.propertyID,
      propertyObj: this.props.propertyObj,
      key: 'UpComing',
      blockedDatesList: [],
      blockedDatesDummyList: [],
      blockedDatesDummyPastList: [],
      blockedDatesPastList: [],
      propertyChecked: 'checked',
      blockingChecked: 'checked',
      fromDateChecked: 'checked',
      toDateChecked: 'checked',
      searchString: ''
    }
    this.blockedDatesView = this.blockedDatesView.bind(this)
    this.blockedDatesEdit = this.blockedDatesEdit.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }
  componentWillMount () {
    this.setState({ propertyId: this.props.propertyID })
    let obj = { url: config.baseUrl + config.getSPPropertyBlockedDatesListAPI + this.props.propertyID }
    let obj1 = { url: config.baseUrl + config.getSPPropertyBlockedDatesPastListAPI + this.props.propertyID }
    let _this = this
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        let bData = resObj.data.statusResult
        resObj.data.statusResult.map((item, i) => {
          bData[i].blockingFromDate = moment(item.blockingFromDate).format('MMM DD, YYYY')
          bData[i].blockingToDate = moment(item.blockingToDate).format('MMM DD, YYYY')
        })
        _this.setState({ blockedDatesList: bData, blockedDatesDummyList: bData })
      } else {
        _this.setState({ blockedDatesList: [], blockedDatesDummyList: [] })
      }
    })
    APICallManager.getCall(obj1, function (resObj1) {
      if (resObj1.data.statusCode === '0000') {
        let bPastData = resObj1.data.statusResult
        resObj1.data.statusResult.map((item, i) => {
          bPastData[i].blockingFromDate = moment(item.blockingFromDate).format('MMM DD, YYYY')
          bPastData[i].blockingToDate = moment(item.blockingToDate).format('MMM DD, YYYY')
        })
        _this.setState({ blockedDatesPastList: bPastData, blockedDatesDummyPastList: bPastData })
      } else {
        _this.setState({ blockedDatesPastList: [], blockedDatesDummyPastList: [] })
      }
    })
  }
  // handleTabChange = (key) => {
  //   alert(key)
  //   this.setState({ searchString: '' })
  //   let _this = this
  //   if (key === 'UpComing') {
  //     let obj = { url: config.baseUrl + config.getSPPropertyBlockedDatesListAPI + this.state.propertyId }
  //     APICallManager.getCall(obj, function (resObj) {
  //       if (resObj.data.statusCode === '0000') {
  //         let bData = resObj.data.statusResult
  //         resObj.data.statusResult.map((item, i) => {
  //           bData[i].blockingFromDate = moment(item.blockingFromDate).format('MMM DD, YYYY')
  //           bData[i].blockingToDate = moment(item.blockingToDate).format('MMM DD, YYYY')
  //         })
  //         _this.setState({ blockedDatesList: bData, blockedDatesDummyList: bData, key: 'UpComing' })
  //       } else {
  //         _this.setState({ blockedDatesList: [], blockedDatesDummyList: [] key: 'UpComing' })
  //       }
  //     })
  //   } else {
  //     let obj1 = { url: config.baseUrl + config.getSPPropertyBlockedDatesPastListAPI + this.state.propertyId }
  //     APICallManager.getCall(obj1, function (resObj1) {
  //       if (resObj1.data.statusCode === '0000') {
  //         let bPastData = resObj1.data.statusResult
  //         resObj1.data.statusResult.map((item, i) => {
  //           bPastData[i].blockingFromDate = moment(item.blockingFromDate).format('MMM DD, YYYY')
  //           bPastData[i].blockingToDate = moment(item.blockingToDate).format('MMM DD, YYYY')
  //         })
  //         _this.setState({ blockedDatesList: bPastData, blockedDatesDummyList: bPastData, key: 'Past' })
  //       } else {
  //         _this.setState({ blockedDatesList: [], blockedDatesDummyList: [], key: 'Past' })
  //       }
  //       //   _this.setState({ blockedDatesPastList: bPastData, blockedDatesDummyPastList: bPastData, key: 'Past' })
  //       // } else {
  //       //   _this.setState({ blockedDatesPastList: [], blockedDatesDummyPastList: [], key: 'Past' })
  //       // }
  //     })
  //   }
  // }
  handleSearch (event) {
    let Search = event.target.value
    this.setState({ searchString: Search })
    if (this.state.key === 'UpComing') {
      var searchList = this.state.blockedDatesDummyList.filter(function (item) {
        return item.blockingType.indexOf(Search) > -1 ||
          item.propertyId.propertyTitle.indexOf(Search) > -1 ||
          item.blockingFromDate.indexOf(Search) > -1 ||
          item.blockingToDate.indexOf(Search) > -1
      })
      this.setState({ blockedDatesList: searchList })
    } else {
      var searchList1 = this.state.blockedDatesDummyPastList.filter(function (item) {
        return item.blockingType.indexOf(Search) > -1 ||
          item.propertyId.propertyTitle.indexOf(Search) > -1 ||
          item.blockingFromDate.indexOf(Search) > -1 ||
          item.blockingToDate.indexOf(Search) > -1
      })
      this.setState({ blockedDatesPastList: searchList1 })
    }
  }
  handleCreateBlockedDates = () => {
    localStorage.setItem('propertyObj', JSON.stringify(this.state.propertyObj))
    hashHistory.push('/host/property/blockeddates/create')
  }
  blockedDatesView (item) {
    localStorage.setItem('blockedDatesView', JSON.stringify(item))
    hashHistory.push('/host/property/blockeddates/view')
  }
  blockedDatesEdit (item) {
    localStorage.setItem('blockedDatesEdit', JSON.stringify(item))
    hashHistory.push('/host/property/blockeddates/edit')
  }
  render () {
    return (
      <div>
        <div className='blockedate-list'>
          <div className='card mb-2'>
            <div className='py-0 px-0'>
              <div className='row'>

                <div className='col-md-4'>
                  <form>
                    <div className='form-group mb-0'>
                      <div className='input-group input-group-lg input-group-flush'>
                        <div className='input-group-prepend'>
                          <div className='input-group-text'>
                            <span className='fas fa-search' />
                          </div>
                        </div>
                        <input type='search' className='form-control' placeholder={t`lanCommonLabelSearch`} value={this.state.searchString} onChange={(search) => this.handleSearch(search)} />
                      </div>
                    </div>
                  </form>
                </div>
                <div className='col-md-5 col-4'>
                  <div className='pull-right'>
                    <div className='button-group'>
                      <button type='button' className='btn btn-success dropdown-toggle' data-toggle='dropdown'><i className='fas fa-list' /></button>
                      <ul className='dropdown-menu'>
                        <li><a id='area'><input type='checkbox' onChange={() => this.setState({ propertyChecked: this.state.propertyChecked === 'checked' ? ''
                          : 'checked' })} checked={this.state.propertyChecked} />Property Title</a></li>
                        <li><a id='city'><input type='checkbox' onChange={() => this.setState({ blockingChecked: this.state.blockingChecked === 'checked' ? ''
                          : 'checked' })} checked={this.state.blockingChecked} />Blocking Type</a></li>
                        <li><a id='state'><input type='checkbox' onChange={() => this.setState({ fromDateChecked: this.state.fromDateChecked === 'checked' ? ''
                          : 'checked' })} checked={this.state.fromDateChecked} />From Date</a></li>
                        <li><a id='pincode'><input type='checkbox' onChange={() => this.setState({ toDateChecked: this.state.toDateChecked === 'checked' ? ''
                          : 'checked' })} checked={this.state.toDateChecked} />To Date</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className='col-md-3'>
                  <a onClick={this.handleCreateBlockedDates} className='btn btn-primary text-white'>{t`lanSPButtonCreateBlockedDates`}</a>
                </div>

              </div>
            </div>
            <div className='card-body'>
              <section className='notifications bookings'>
                <div className='row clearfix'>
                  <div className='col-md-12 col-lg-12 col-xl-12'>
                    {/* tabs list */}
                    {/* <Tabs activeKey={this.state.key} onSelect={key => this.handleTabChange(key)} */}
                    <Tabs activeKey={this.state.key} onSelect={key => this.setState({ key })} defaultActiveKey={this.state.key} id='uncontrolled-tab-example'>
                      <Tab eventKey='UpComing' title={t`lanSPBookingsButtonUpcoming`}>
                        <div>
                          {this.state.blockedDatesList.length > 0
                          ? <div className='table-responsive'>
                            <table className='table align-items-center table-flush table-striped'>
                              <thead className='thead-light'>
                                <tr>
                                  {this.state.propertyChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelPropertyTitle` }</th> : null }
                                  {this.state.blockingChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanSPLabelBlockingType` }</th> : null }
                                  {this.state.fromDateChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanSPLabelFromDate` }</th> : null }
                                  {this.state.toDateChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanSPLabelToDate` }</th> : null }
                                  <th className='sort' data-sort='name'>{ t`lanCommonLabelActions` }</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.blockedDatesList.map((item, i) =>
                                  <tr key={i}>
                                    {this.state.propertyChecked ? <td className='text-muted'>{item.propertyId ? item.propertyId.propertyTitle
                                       : ''}, {item.propertyId.spLocationObj ? item.propertyId.spLocationObj.area : ''}</td> : null }
                                    {this.state.blockingChecked ? <td className='text-muted'>{item.blockingType}</td> : null }
                                    {this.state.fromDateChecked ? <td className='text-muted'>{item.blockingFromDate}</td> : null }
                                    {this.state.toDateChecked ? <td className='text-muted'>{item.blockingToDate}</td> : null }
                                    <td className='table-actions btn-actions'>
                                      <a onClick={() => this.blockedDatesView(item)} className='table-action table-action-view'
                                        data-toggle='tooltip' data-placement='top' title={t`lanCommonButtonTooltipViewBlockedDates`}>
                                        <i className='far fa-eye' />
                                      </a>
                                      <a onClick={() => this.blockedDatesEdit(item)} className='table-action table-action-edit'
                                        data-toggle='tooltip' data-placement='top' title={t`lanCommonButtonTooltipEditBlockedDates`}>
                                        <i className='far fa-edit' />
                                      </a>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          : this.state.blockedDatesList ? <div className='no-data'><p>{t`lanSPLabelNoBlockedDates`}</p></div> : <div className='no-data'><p>{t`lanCommonLabelNoMatchesFound`}</p></div>}
                        </div>
                      </Tab>
                      <Tab eventKey='Past' title={t`lanSPBookingsButtonPast`}>
                        <div>
                          {this.state.blockedDatesList.length > 0
                          ? <div className='table-responsive'>
                            <table className='table align-items-center table-flush table-striped'>
                              <thead className='thead-light'>
                                <tr>
                                  {this.state.propertyChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanCommonLabelPropertyTitle` }</th> : null }
                                  {this.state.blockingChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanSPLabelBlockingType` }</th> : null }
                                  {this.state.fromDateChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanSPLabelFromDate` }</th> : null }
                                  {this.state.toDateChecked === 'checked' ? <th className='sort' data-sort='name'>{ t`lanSPLabelToDate` }</th> : null }
                                  <th className='sort' data-sort='name'>{ t`lanCommonLabelActions` }</th>
                                </tr>
                              </thead>
                              {this.state.blockedDatesPastList.map((item, i) =>
                                <tbody key={i}>
                                  <tr>
                                    {this.state.propertyChecked ? <td className='text-muted'>{item.propertyId ? item.propertyId.propertyTitle
                                       : ''}, {item.propertyId.spLocationObj ? item.propertyId.spLocationObj.area : ''}</td> : null }
                                    {this.state.blockingChecked ? <td className='text-muted'>{item.blockingType}</td> : null }
                                    {this.state.fromDateChecked ? <td className='text-muted'>{item.blockingFromDate}</td> : null }
                                    {this.state.toDateChecked ? <td className='text-muted'>{item.blockingToDate}</td> : null }
                                    <td className='table-actions btn-actions'>
                                      <a onClick={() => this.blockedDatesView(item)} className='table-action table-action-view'
                                        data-toggle='tooltip' data-placement='top' title={t`lanCommonButtonTooltipViewBlockedDates`}>
                                        <i className='far fa-eye' />
                                      </a>
                                    </td>
                                  </tr>
                                </tbody>
                              )}
                            </table>
                          </div>
                          : this.state.blockedDatesPastList ? <div className='no-data'><p>{t`lanSPLabelNoPastBlockedDates`}</p></div> : <div className='no-data'><p>{t`lanCommonLabelNoMatchesFound`}</p></div>}
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        {/* <div className='main-content' id='panel'>
          <div className='container-fluid mt--6'>
            <div className='row justify-content-center notifictions'>
              <div className='col-lg-12 card-wrapper'>
                <div className='card mb-2'>
                  <div className='card-header mx-4 py-0'>
                    <form>
                      <div className='form-group mb-0'>
                        <div className='input-group input-group-lg input-group-flush'>
                          <div className='input-group-prepend'>
                            <div className='input-group-text'>
                              <span className='fas fa-search' />
                            </div>
                          </div>
                          <input type='search' className='form-control' placeholder={t`lanCommonLabelSearch`} value={this.state.searchString} onChange={(search) => this.handleSearch(search)} />
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className='card-body'>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    )
  }
}
SPBlockedDatesListComponent.propTypes = {
  propertyID: PropTypes.any,
  propertyObj: PropTypes.any
}

export default SPBlockedDatesListComponent
