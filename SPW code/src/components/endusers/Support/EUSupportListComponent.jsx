/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import moment from 'moment'
import { t } from 'ttag'
import { Tabs, Tab } from 'react-bootstrap-tabs'
import Pagination from 'react-js-pagination'
import '../profile/css/Profile.css'
import '../profile/css/EuProfileResponsive.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import EUSupportCreateComponent from './EUSupportCreateComponent'
import EUSupportViewComponent from './EUSupportViewComponent'
import EUProfileSideMenu from '../profile/EUProfileSideMenu'

class EUSupportListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      authObj: JSON.parse(localStorage.getItem('authObj')),
      activePage: 1,
      searchString: '',
      supportList: [],
      totalCount: 0,
      isShowList: true,
      isShowView: false,
      matchesData: false
    }
    this.handleCreateSupport = this.handleCreateSupport.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleViewSupport = this.handleViewSupport.bind(this)
    this.handleOnKeyPress = this.handleOnKeyPress.bind(this)
  }
  componentWillMount () {
    let supportList = {
      unBlockStatus: true,
      url: config.baseUrl + config.getEUSupportListAPI + this.state.activePage + '/'
    }
    let _this = this
    APICallManager.getCall(supportList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          supportList: resObj.data.statusResult.supportData,
          totalCount: resObj.data.statusResult.totalDocs,
          matchesData: false
        })
      } else {
        _this.setState({
          supportList: [],
          matchesData: false
        })
      }
    })
  }

  handleInputChange (event) {
    let _this = this
    _this.setState({ searchString: event.target.value, activePage: 1 })
    let supportObj = {
      unBlockStatus: true,
      url: config.baseUrl + config.getEUSupportListAPI + '1' + '/' + event.target.value
    }
    APICallManager.getCall(supportObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          supportList: resObj.data.statusResult.supportData,
          totalCount: resObj.data.statusResult.totalDocs,
          matchesData: false
        })
      } else {
        _this.setState({
          supportList: [],
          matchesData: true
        })
      }
    })
  }
  handlePageChange (pageNumber) {
    this.setState({ activePage: pageNumber })
    let _this = this
    let obj = {
      unBlockStatus: true,
      url: config.baseUrl + config.getEUSupportListAPI + pageNumber + '/' + this.state.searchString }
    APICallManager.getCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ supportList: resObj.data.statusResult.supportData, totalCount: resObj.data.statusResult.totalDocs, matchesData: false })
      } else {
        _this.setState({ supportList: [], totalCount: 0, matchesData: false })
      }
    })
  }
  handleCreateSupport (data) {
    let supportListingData = this.state.supportList
    if (data && data._id) {
      supportListingData.unshift(data)
      this.setState({ supportList: supportListingData })
    }
  }
  handleViewSupport (data) {
    this.setState({
      isShowList: !this.state.isShowList,
      isShowView: !this.state.isShowView,
      selectedSupportData: data
    })
  }

  handleOnKeyPress (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }

  render () {
    return (
      <div className='main-content eu-support' id='panel'>
        <div className='container-fluid mt-5 pb-5'>
          <div className='row justify-content-center'>
            <div className='col-lg-3' >
              <EUProfileSideMenu authObj={this.state.authObj} />
            </div>
            <div className='col-lg-9' >
              {this.state.isShowList
              ? <div className='edit-profile-info preference'>
                <div className='card'>
                  <div className='card-header card-header-danger'>
                    <h4 className='card-title'>{t`lanSPTitleSupport`}</h4>
                  </div>
                  {/* edit prfile htmlForm */}
                  <div className='edit-profile-form'>
                    <div className='card-body support-mobile'>
                      <div className='row justify-content-end'>
                        <div className='col-sm-6 eu-support-search'>
                          {/* -- Search form -- */}
                          <form>
                            <div className='form-group mb-0'>
                              <div className='input-group col-sm-12 input-group-lg input-group-flush'>
                                <div className='input-group-prepend'>
                                  <div className='input-group-text'>
                                    <span className='fas fa-search' />
                                  </div>
                                </div>
                                <input type='search' className='form-control' placeholder={t`lanCommonLabelSearch`} value={this.state.searchString} onKeyPress={this.handleOnKeyPress} onChange={this.handleInputChange} />
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                      <Tabs onSelect={(index, label) => console.log(label + ' selected')}
                        headerClass='tab-header-bold' activeHeaderClass='tab-header-blue'>
                        <Tab label={t`lanEUButtonTicketList`}>
                          <div >
                            {this.state.supportList.length > 0
                              ? <div className='card-body card-list'>
                                {this.state.supportList.map((item, i) =>
                                  <div className='card-each-list' key={i}>
                                    <div className='row align-items-center mb-2'>
                                      <div className='col-sm-3'>
                                        <h5 className='mb-0 text-sm'>{item.ticketTitle}</h5>
                                      </div>
                                      <div className='col-sm-2'>
                                        <h5 className='mb-0 text-sm'>{item.ticketTag}</h5>
                                      </div>
                                      <div className='col-sm-2'>
                                        <h5 className='mb-0 text-sm'>{item.ticketNumType + item.ticketNumber}</h5>
                                      </div>
                                      <div className='col-sm-2'>
                                        <h5 className='mb-0 text-sm'>{moment(item.createdAt).format('MMM DD, YYYY')}</h5>
                                      </div>
                                      <div className='col-sm-1 col-6'>
                                        <h5 className='mb-0 text-sm'>{item.ticketStatus}</h5>
                                      </div>
                                      <div className='col-sm-2 col-6'>
                                        <div className='row align-items-center mt-0'>
                                          <div className='col-sm-12 text-center ticket-actions'>
                                            <a onClick={() => this.handleViewSupport(item)} className='update-edit' title='View Ticket'>
                                              <span className='avatar avatar-md mr-0 bg-primary rounded-circle'>
                                                <span className='media-object d-flex justify-content-center align-items-center'><i className='far fa-eye' /></span>
                                              </span>
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <p className='ticket-msg'>{item.ticketDescription}</p>
                                  </div>
                                )}
                              </div>
                              : this.state.matchesData
                              ? <div className='container'>
                                <div className='row justify-content-center'>
                                  <div className='col-sm-12 text-center my-0' >
                                    <div className='no-data'><p>{t`lanCommonLabelNoMatchesFound`}</p></div>
                                  </div>
                                </div>
                              </div>
                             : <div className='container'>
                               <div className='row justify-content-center'>
                                 <div className='col-sm-12 text-center'>
                                   <div className='no-data'><p>{t`lanCommonLabelNoTickets`}</p></div>
                                 </div>
                               </div>
                             </div>
                            }
                          </div>
                          {(this.state.supportList && this.state.supportList.length > 0)
                          ? <div className='card-footer'>
                            <div className='row justify-content-center'>
                              <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={10}
                                totalItemsCount={this.state.totalCount}
                                pageRangeDisplayed={5}
                                onChange={this.handlePageChange}
                            />
                            </div>
                          </div> : null }
                        </Tab>
                        <Tab label={t`lanEUButtonNewTicket`}>
                          <EUSupportCreateComponent handleCreateSupport={this.handleCreateSupport} />
                        </Tab>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>
              : this.state.isShowView ? <EUSupportViewComponent selectedSupportData={this.state.selectedSupportData} handleViewSupport={this.handleViewSupport} />
              : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EUSupportListComponent
