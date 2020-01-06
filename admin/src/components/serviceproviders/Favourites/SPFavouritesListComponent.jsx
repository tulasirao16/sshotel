/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import SPFavouritesViewComponent from './SPFavouriteViewComponent'
import { t } from 'ttag'
import Pagination from 'react-js-pagination'
import { hashHistory } from 'react-router'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import './css/Favourites.css'

class SPFavouritesListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      favouritesData: [],
      totalCount: 0,
      activePage: 1,
      isFavouriteView: false,
      searchString: '',
      selectedFavData: {}
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleUnfavourite = this.handleUnfavourite.bind(this)
    this.handleFavourite = this.handleFavourite.bind(this)
    this.handleViewFavourite = this.handleViewFavourite.bind(this)
    this.handleViewBack = this.handleViewBack.bind(this)
    this.handleUserDelete = this.handleUserDelete.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleHome = this.handleHome.bind(this)
  }

  componentWillMount () {
    let favouritesList = {
      url: config.baseUrl + config.getSPFavouritesListAPI + this.state.activePage + '/'
    }
    let _this = this
    APICallManager.getCall(favouritesList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          favouritesData: resObj.data.statusResult.myfavs,
          totalCount: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({ favouritesData: [], totalCount: 0 })
      }
    })
  }

  handleInputChange (event) {
    let _this = this
    _this.setState({ searchString: event.target.value })
    let favouritesList = {
      url: config.baseUrl + config.getSPFavouritesListAPI + '1' + '/' + event.target.value
    }
    APICallManager.getCall(favouritesList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          favouritesData: resObj.data.statusResult.myfavs,
          totalCount: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({
          favouritesData: [],
          totalCount: 0
        })
      }
    })
  }

  handlePageChange (pageNumber) {
    this.setState({ activePage: pageNumber })
    let favouritesList = { url: config.baseUrl + config.getSPFavouritesListAPI + pageNumber + '/' + this.state.searchString }
    let _this = this
    APICallManager.getCall(favouritesList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          favouritesData: resObj.data.statusResult.myfavs,
          totalCount: resObj.data.statusResult.totalDocs
        })
      } else {
        _this.setState({
          favouritesData: [],
          totalCount: 0
        })
      }
    })
  }

  handleUnfavourite (data) {
    let favouritesData = this.state.favouritesData
    const index = favouritesData.findIndex(dataObj => dataObj._id === data._id)
    let unFavouriteObj = {
      spPropertyId: data.spPropertyId._id,
      userID: data.euUserId._id,
      recordID: data._id
    }
    let _this = this
    let obj = { url: config.baseUrl + config.putSPFavouriteUserUnfavourite, body: unFavouriteObj }
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        favouritesData[index].status = 'Unfavourite'
        _this.setState({ favouritesData: favouritesData })
      }
    })
  }

  handleFavourite (data) {
    let favouritesData = this.state.favouritesData
    const index = favouritesData.findIndex(dataObj => dataObj._id === data._id)
    let FavouriteObj = {
      spPropertyId: data.spPropertyId._id,
      userID: data.euUserId._id,
      recordID: data._id
    }
    let _this = this
    let obj = { url: config.baseUrl + config.putSPFavouriteUserFavourite, body: FavouriteObj }
    APICallManager.putCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        favouritesData[index].status = 'Favourite'
        _this.setState({ favouritesData: favouritesData })
      }
    })
  }

  handleChange (checked) {
    this.setState({ checked })
  }

  handleViewFavourite (data) {
    this.setState({ selectedFavData: data, isFavouriteView: true })
  }

  handleViewBack (isFavourite, data) {
    let favouritesData = this.state.favouritesData
    const index = favouritesData.findIndex(dataObj => dataObj._id === data._id)
    if (isFavourite) {
      favouritesData[index].status = 'Favourite'
      this.setState({ favouritesData: favouritesData })
    } else {
      favouritesData[index].status = 'Unfavourite'
      this.setState({ favouritesData: favouritesData })
    }
    this.setState({ isFavouriteView: false })
  }

  handleUserDelete (data) {
    let favouritesData = this.state.favouritesData
    const index = favouritesData.findIndex(dataObj => dataObj._id === data._id)
    favouritesData.splice(index, 1)
    this.setState({ favouritesData: favouritesData, isFavouriteView: false })
  }
  handleHome () {
    hashHistory.push('/host/home')
    event.preventDefault()
  }

  render () {
    return (
      <div>
        {/* ---------- Header Starts ------------- */}
        <div>
          <div className='header bg-primary pb-6'>
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPTitleFavourites`}</h6>
                    <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        {/* <li className='breadcrumb-item'><a href='#'>Tables</a></li> */}
                        <li className='breadcrumb-item active' aria-current='page'><a onClick={() => this.handleBack()} >Favourites List Page </a></li>
                        {this.state.isFavouriteView ? <li className='breadcrumb-item active' aria-current='page'><a >Favourite View </a></li> : ''}
                      </ol>
                    </nav>
                  </div>
                  {/* <div className='col-lg-6 col-5 text-right'>
                    <a href='#' className='btn btn-sm btn-neutral'><i className='fas fa-map-marker-alt' />{ t`lanSPButtonGetLocation` }</a>
                  </div> */}
                </div>
              </div>
            </div>
          </div>{/* ---------- Header Starts ------------- */}
          {!this.state.isFavouriteView
            ? <div className='container-fluid mt--6'>
              <div className='row'>
                <div className='col-md-12'>
                  <div className='card Users'>
                    <div className='card-header'>
                      <div className='row'>
                        <div className='col-md-8'>
                          <h5 className='card-title'>{t`lanSPSubTitleFavouritesList`}</h5>
                        </div>
                        <div className='col-md-4 text-right'>
                          {/* -- Search form -- */}
                          <form>
                            <div className='form-group mb-0'>
                              <div className='input-group input-group-lg input-group-flush'>
                                <div className='input-group-prepend'>
                                  <div className='input-group-text'>
                                    <span className='fas fa-search' />
                                  </div>
                                </div>
                                <input type='search' className='form-control'value={this.state.searchString} onChange={this.handleInputChange} placeholder={t`lanCommonLabelSearch`} />                                </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className='card-body'>
                      <div className='py-lg-2'>
                        {this.state.favouritesData.length > 0
                        ? <div className='table-responsive'>
                          <table className='table align-items-center table-flush table-striped'>
                            <thead className='thead-light'>
                              <tr>
                                <th>{ t`lanCommonLabelName` }</th>
                                <th>{ t`lanCommonLabelMobileNumber` }</th>
                                <th>{ t`lanCommonLabelEmail` }</th>
                                <th>{ t`lanCommonLabelBusiness` }</th>
                                <th>{t`lanCommonLabelPropertyArea`}</th>
                                <th>{t`lanCommonLabelPropertyCity`}</th>
                                <th>{ t`lanCommonLabelActions` }</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.favouritesData.map((data, i) =>
                                <tr key={i}>
                                  <td className='table-user'>
                                    <a ><strong>{data.euUserId.displayName}</strong></a>
                                  </td>
                                  <td>
                                    <span className='text-muted'>{data.euUserId.mobileNumber}</span>
                                  </td>
                                  <td className='table-actions'>
                                    <span className='text-muted'>{data.euUserId.email}</span>
                                  </td>
                                  <td className='table-actions'>
                                    <span className='text-muted'>{data.spPropertyId.propertyTitle}</span>
                                  </td>
                                  <td className='table-actions'>
                                    <span className='text-muted'> {data.spPropertyId.spLocationObj.area}</span>
                                  </td>
                                  <td className='table-actions'>
                                    <span className='text-muted'>{data.spPropertyId.spLocationObj.city}</span>
                                  </td>
                                  <td>
                                    <a onClick={() => this.handleViewFavourite(data)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanSPButtonTooltipViewUser`}>
                                      <i className='far fa-eye' style={{ color:'#03a3a2' }} />
                                    </a>
                                    {data.status === 'Favourite'
                                    ? <a onClick={() => this.handleUnfavourite(data)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top'
                                      title={t`lanSPButtonTooltipRemoveFromFavourite`}>
                                      <span className='btn-inner--icon'><i className='fas fa-heart' style={{ color:'red' }} /></span>
                                    </a>
                                      : <a onClick={() => this.handleFavourite(data)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title={t`lanSPButtonTooltipAddToFavourite`}>
                                        <span className='btn-inner--icon'><i className='far fa-heart' style={{ color:'red' }} /></span>
                                      </a> }
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      : this.state.favouritesData.length <= 0
                      ? <div className='container'>
                        <div className='row justify-content-center'>
                          <div className='col-sm-12 text-center'>
                            <div className='no-data'><p>{t `lanCommonLabelNoResultsFound`}</p></div>
                          </div>
                        </div>
                      </div>
                      : null}
                      </div>
                      {this.state.favouritesData && this.state.favouritesData.length > 0
                        ? <div className='card-footer pb-0'>
                          <div className='row justify-content-center'>
                            <Pagination
                              activePage={this.state.activePage}
                              itemsCountPerPage={10}
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
          : <SPFavouritesViewComponent selectedFavData={this.state.selectedFavData} handleViewBack={this.handleViewBack} handleUserDelete={this.handleUserDelete} /> }
        </div>
      </div>
    )
  }
}

export default SPFavouritesListComponent
