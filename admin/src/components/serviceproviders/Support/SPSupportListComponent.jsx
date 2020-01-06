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
import moment from 'moment'
import Pagination from 'react-js-pagination'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import SPSupportViewComponent from './SPSupportViewComponent'
import SPSupportCreateComponent from './SPSupportCreateComponent'
import SPSupportEditComponent from './SPSupportEditComponent'

class SPSupportListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      activePage: 1,
      searchString: '',
      supportData: [],
      totalCount: 0,
      isShowList: true,
      isShowView: false,
      isShowEdit: false,
      isShowCreate: false,
      selectedSupportData: {}
    }
    this.handleCreateSupport = this.handleCreateSupport.bind(this)
    this.handleViewSupport = this.handleViewSupport.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleEditSupport = this.handleEditSupport.bind(this)
    this.handleEditTicket = this.handleEditTicket.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }

  componentWillMount () {
    let supportList = {
      url: config.baseUrl + config.getSPSupportListAPI + this.state.activePage + '/'
    }
    let _this = this
    APICallManager.getCall(supportList, function (resObj) {
      console.log('totalDocs', resObj.data.statusResult.totalDocs)
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          supportData: resObj.data.statusResult.supportData,
          totalCount: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({
          supportData: [],
          totalCount: 0
        })
      }
    })
  }

  handleInputChange (event) {
    let supportList = {
      url: config.baseUrl + config.getSPSupportListAPI + 1 + '/' + event.target.value
    }
    let _this = this
    _this.setState({ searchString: event.target.value })
    APICallManager.getCall(supportList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          supportData: resObj.data.statusResult.supportData,
          totalCount: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({
          supportData: [],
          totalCount: 0
        })
      }
    })
  }

  handleCreateSupport (data) {
    let supportListingData = this.state.supportData
    if (data && data._id) {
      supportListingData.unshift(data)
      this.setState({ supportData: supportListingData })
    }
    this.setState({
      isShowList: !this.state.isShowList,
      isShowView: false,
      isShowEdit: false,
      isShowCreate: !this.state.isShowCreate
    })
  }
  handleViewSupport (data) {
    this.setState({
      isShowList: !this.state.isShowList,
      isShowView: !this.state.isShowView,
      isShowEdit: false,
      isShowCreate: false,
      selectedSupportData: data
    })
  }

  handleEditSupport (data, isModified) {
    if (isModified) {
      let supportListingData = this.state.supportData
      const index = supportListingData.findIndex(dataObj => dataObj._id === data._id)
      supportListingData[index] = data
      this.setState({ supportData: supportListingData })
    }
    // localStorage.setItem('supportData', JSON.stringify(data))
    this.setState({
      isShowList: !this.state.isShowList,
      isShowView: false,
      isShowEdit: !this.state.isShowEdit,
      isShowCreate: false,
      selectedSupportData: data
    })
    // hashHistory.push('/host/support/edit')
    event.preventDefault()
  }

  handleEditTicket (data) {
    this.setState({
      isShowList: false,
      isShowView: false,
      isShowEdit: true,
      isShowCreate: false,
      selectedSupportData: data
    })
    event.preventDefault()
  }

  handlePageChange (pageNumber) {
    this.setState({ activePage: pageNumber })
    let supportList = { url: config.baseUrl + config.getSPSupportListAPI + pageNumber + '/' + this.state.searchString }
    let _this = this
    APICallManager.getCall(supportList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          supportData: resObj.data.statusResult.supportData,
          totalCount: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({
          supportData: [],
          totalCount: 0
        })
      }
    })
  }
  handleHome (event) {
    hashHistory.push('/host/home')
    event.preventDefault()
  }

  render () {
    return (
      <div >
        {/* ------- Navbar --------- */}
        {this.state.isShowList ? <div >
          <div className='header bg-primary pb-6' >
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        {/* <li className='breadcrumb-item'><a >Support</a></li> */}
                        <li className='breadcrumb-item active' aria-current='page'>Support List Page</li>
                      </ol>
                    </nav>
                  </div>
                  <div className='col-lg-6 col-5 text-right'>
                    <a onClick={() => this.handleCreateSupport({})} className='btn btn-success text-white'><i className='fas fa-plus' /> {''} {t`lanSPButtonCreateTicket`}</a>
                    {/* <a href='#' className='btn btn-sm btn-neutral'>Filters</a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container-fluid mt--6'>
            <div className='row justify-content-center notifictions'>
              <div className='col-lg-12 card-wrapper'>
                <div className='card mb-2'>
                  <div className='card-header'>
                    <div className='row'>
                      <div className='col-md-8'>
                        <h6 className='h2 d-inline-block mb-0'>{t`lanSPTitleSupport`}</h6>
                      </div>
                      <div className='col-md-4'>
                        {/* -- Search form -- */}
                        <form>
                          <div className='form-group mb-0'>
                            <div className='input-group input-group-lg input-group-flush'>
                              <div className='input-group-prepend'>
                                <div className='input-group-text'>
                                  <span className='fas fa-search' />
                                </div>
                              </div>
                              <input type='search' className='form-control' value={this.state.searchString} onChange={this.handleInputChange} placeholder={t`lanCommonLabelSearch`} />
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
                          <div className='list-group list-group-flush'>
                            <div>
                              {this.state.supportData.length > 0
                              ? <div className='table-responsive'>
                                <table className='table align-items-center table-flush table-hover'>
                                  <thead className='thead-light'>
                                    <tr>
                                      <th>{t`lanCommonLabelTicketType`}</th>
                                      <th>{t`lanCommonLabelTicketNumber`}</th>
                                      <th>{t`lanCommonLabelStatus`}</th>
                                      <th>{t`lanCommonLabelDate`}</th>
                                      <th>{t`lanCommonLabelActions`}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.supportData.map((item, i) =>
                                      <tr key={i}>
                                        <td>
                                          <span className='text-muted'>{item.ticket}</span>
                                        </td>
                                        <td>
                                          <span className='text-muted'>{item.ticketNumber}</span>
                                        </td>
                                        <td className='table-actions'>
                                          <span className='text-muted'>{item.status}</span>
                                        </td>
                                        <td>
                                          <span className='text-muted'>{moment(item.createdAt).format('MMM DD, YYYY')}</span>
                                        </td>
                                        <td>
                                          <a onClick={() => this.handleViewSupport(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanSPButtonTooltipViewTicket`}>
                                            <i className='far fa-eye' style={{ color:'#01a1a1' }} />
                                          </a>
                                          <a onClick={() => this.handleEditSupport(item, false)} className='table-action' data-toggle='tooltip' data-placement='top' title={t`lanSPButtonTooltipEditTicket`} >
                                            <i className='fas fa-user-edit' style={{ color:'#067eb7' }} />
                                          </a>
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                              : this.state.supportData.length <= 0
                              ? <div className='container'>
                                <div className='row justify-content-center'>
                                  <div className='col-sm-12 text-center'>
                                    <label className='no-records'>{t `lanCommonLabelNoResultsFound`}</label>
                                  </div>
                                </div>
                              </div>
                              : null
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    {this.state.supportData && this.state.supportData.length > 0
                      ? <div className='card-footer pb-0'>
                        <div className='row justify-content-center'>
                          <Pagination
                            activePage={this.state.activePage}
                            itemsCountPerPage={20}
                            totalItemsCount={this.state.totalCount}
                            pageRangeDisplayed={5}
                            onChange={this.handlePageChange}
                          />
                        </div>
                      </div>
                    : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> : this.state.isShowView ? <SPSupportViewComponent selectedSupportData={this.state.selectedSupportData} handleViewSupport={this.handleViewSupport} handleEditTicket={this.handleEditTicket} />
        : this.state.isShowEdit ? <SPSupportEditComponent handleEditSupport={this.handleEditSupport} selectedSupportData={this.state.selectedSupportData} />
        : this.state.isShowCreate ? <h1><SPSupportCreateComponent handleCreateSupport={this.handleCreateSupport} /></h1> : '' }
      </div>
    )
  }
}

export default SPSupportListComponent
