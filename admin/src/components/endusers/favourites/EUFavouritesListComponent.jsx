/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import { t } from 'ttag'
import Pagination from 'react-js-pagination'
import './Css/Favourites.css'
import EUFavouritesEachRowListComponent from './EUFavouritesEachRowList'

export default class EUFavouritesListComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      favouritesData: [],
      totalCount: 0,
      activePage: 1,
      searchString: '',
      isFavourite: false
    }
    this.handleFavHotelView = this.handleFavHotelView.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
  }

  componentWillMount () {
    let favouritesList = {
      url: config.baseUrl + config.getEUFavouritesListAPI + this.state.activePage + '/'
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
      url: config.baseUrl + config.getEUFavouritesListAPI + '1' + '/' + event.target.value
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
    let favouritesList = { url: config.baseUrl + config.getEUFavouritesListAPI + pageNumber + '/' + this.state.searchString }
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
  handleFavHotelView (e) {
    hashHistory.push('/hotels/booknow')
    event.preventDefault()
  }
  render () {
    return (
      <div>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center pt-7 pb-3'>
                <div className='col-lg-6 col-7'>
                  <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item eu-font'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item active eu-font' aria-current='page'>{t`lanEUTitleFavourites`}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id='page-wrapper'>
          <main role='main' className='inner cover fav-hotel-list'>
            <div className='album py-0 bg-light'>
              <div className='container mt--6 pb-4'>
                <div className='row justify-content-center notifictions'>
                  <div className='col-lg-12 card-wrapper'>
                    <div className='card mb-2'>
                      <div className='card-header'>
                        <div className='row'>
                          <div className='col-sm-8'>
                            <h6 className='h2 text-primary d-inline-block pt-2'>{t`lanEUTitleFavourites`}</h6>
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
                                  <input
                                    type='search' className='form-control' value={this.state.searchString} onChange={this.handleInputChange} placeholder={t`lanCommonLabelSearch`} />
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                      {this.state.favouritesData.length > 0
                        ? <div className='card-body'>
                          <div className='row'>
                            {this.state.favouritesData.map((item, i) =>
                              <EUFavouritesEachRowListComponent data={item} key={i} />
                            )}
                          </div>
                          {this.state.favouritesData && this.state.favouritesData.length > 0
                      ? <div className='row justify-content-center'>
                        <div className='text-center'>
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
                        : this.state.favouritesData
                        ? <div className='container'>
                          <div className='row justify-content-center'>
                            <div className='col-sm-12 text-center my-0' >
                              <div className='no-data'><p>{t`lanEULabelNoFavouritesAvailable`}</p></div>
                            </div>
                          </div>
                        </div>
                        : <div className='container'>
                          <div className='row justify-content-center'>
                            <div className='col-sm-12 text-center my-0' >
                              <div className='no-data'><p>{t`lanCommonLabelNoMatchesFound`}</p></div>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div> {/* container end */}
            </div>
          </main>
        </div>
      </div>

    )
  }
}
