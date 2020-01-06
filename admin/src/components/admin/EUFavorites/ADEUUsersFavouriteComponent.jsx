/* eslint-disable max-len */
import React from 'react'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
import ADEUFavouritesViewComponent from './ADEUFavouritesViewComponent'
import Pagination from 'react-js-pagination'
import { hashHistory } from 'react-router'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import moment from 'moment'

// import ADEndUserFavouritesEach from './ADEndUsersFavouriteComponent'

export default class ADEUUsersFavouriteComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      favouritesData: [],
      totalCount: 0,
      activePage: 1,
      searchString: '',
      isFavorites:'List',
      favouriteObj: {}
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleViewFavourites = this.handleViewFavourites.bind(this)
    this.handleUsers = this.handleUsers.bind(this)
    this.handleHome = this.handleHome.bind(this)
    this.handleFavouritesStatus = this.handleFavouritesStatus.bind(this)
    this.handleFavouritesViewBack = this.handleFavouritesViewBack.bind(this)
    this.handleBookingFavorites = this.handleBookingFavorites.bind(this)
  }

  componentWillMount () {
    let userData = JSON.parse(localStorage.getItem('userData'))
    if (userData) {
      let favouritesList = {
        url: config.baseUrl + config.getADEndUserFavouritesByUserId + userData._id + '/' + '1' + '/'
      }
      let _this = this
      APICallManager.getCall(favouritesList, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({
            favouritesData: resObj.data.statusResult.eufavs,
            totalCount: resObj.data.statusResult.totalDocs
          })
        } else {
          _this.setState({ favouritesData: [], totalCount: 0 })
        }
      })
    } else {
      hashHistory.push('/admin/eu-users')
    }
  }
  handleInputChange (event) {
    let userData = JSON.parse(localStorage.getItem('userData'))
    let _this = this
    let searchValue = this.state.searchString
    this.setState({ activePage: 1 })
    let favouritesList = {
      url: config.baseUrl + config.getADEndUserFavouritesByUserId + userData._id + '/' + '1' + '/' + searchValue
    }
    APICallManager.getCall(favouritesList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          favouritesData: resObj.data.statusResult.eufavs,
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

  handlePageChange = (pageNumber) => {
    if (this.state.activePage !== pageNumber) {
      this.setState({ activePage: pageNumber })
      let userData = JSON.parse(localStorage.getItem('userData'))
      let favouritesList = {
        url: config.baseUrl + config.getADEndUserFavouritesByUserId + userData._id + '/' + pageNumber + '/' + this.state.searchString
      }
      let _this = this
      APICallManager.getCall(favouritesList, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({
            favouritesData: resObj.data.statusResult.eufavs,
            totalCount: resObj.data.statusResult.totalDocs
          })
        } else {
          _this.setState({ favouritesData: [], totalCount: 0 })
        }
      })
    }
  }
  handleFavouritesStatus (item) {
    let favouritesListData = this.state.favouritesData
    let _this = this
    let recordID = item._id
    if (item.status === 'Unfavourite') {
      let action = {
        status :'Favourite'
      }
      let obj = { url: config.baseUrl + config.putADFavoritesStatusActivateAPI + recordID, body: action }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          item.status = 'Favourite'
          _this.setState({ favouritesData: favouritesListData })
        }
      })
    } else {
      let action = {
        status :'Unfavourite'
      }
      let obj = { url: config.baseUrl + config.putADFavoritesStatusActivateAPI + recordID, body: action }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          item.status = 'Unfavourite'
          _this.setState({ favouritesData: favouritesListData })
        }
      })
    }
  }
  handleViewFavourites (item) {
    this.setState({
      isFavorites: 'View',
      favouriteObj: item
    })
  }
  handleEnter (event) {
    if (event.charCode === 13) {
      event.preventDefault()
    }
  }
  handleUsers () {
    hashHistory.push('/admin/eu-users')
  }
  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }
  handleFavouritesViewBack (resObj) {
    let isFavorites = this.state.isFavorites
    if (resObj && resObj._id) {
      isFavorites[this.state.key] = resObj
      this.setState({
        isUserisFavoritesList: 'List',
        isFavorites: isFavorites
      })
    } else {
      this.setState({
        isFavorites: 'List'
      })
    }
  }
  handleBookingFavorites (data) {
    localStorage.setItem('booknow', 'favourates')
    let favouritesList = {
      url: config.baseUrl + config.getEUFavouritesPropertyInfoDataAPI + data.spPropertyId._id
    }
    APICallManager.getCall(favouritesList, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        localStorage.setItem('EUPropertyInfoData', JSON.stringify(resObj.data.statusResult))
        let EUBookingType = resObj.data.statusResult.pricing.minBasePriceUnit === '6 Hours' ? 'Hours' : 'Days'
        localStorage.setItem('EUBookingType', JSON.stringify(EUBookingType))
        hashHistory.push('/admin/eu/booking')
        let child = 0
        let guestAdultValue = 2
        let guestRooms = 1
        if (EUBookingType === 'Days') {
          let checkInDate = new Date()
          let checkOutDate = new Date(moment().add(1, 'day').format('YYYY-MM-DD'))
          let homePageData = { checkInDate, checkOutDate, child, guestAdultValue, guestRooms }
          localStorage.setItem('homePageData', JSON.stringify(homePageData))
        } else {
          let checkInDate = new Date(moment().format('YYYY-MM-DD'))
          let checkOutDate = new Date(moment().format('YYYY-MM-DD'))
          let homePageData = { checkInDate, checkOutDate, child, guestAdultValue, guestRooms }
          localStorage.setItem('homePageData', JSON.stringify(homePageData))
        }
      }
    })
    event.preventDefault()
  }

  render () {
    return (
      <div>
        {this.state.isFavorites === 'List'
        ? <div>
          <div className='header bg-primary pb-6'>
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='row align-items-center pt-4 pb-4'>
                  <div className='col-lg-6 col-7'>
                    <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item eu-font'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item eu-font'><a onClick={this.handleUsers}><i />End Users List</a></li>
                        <li className='breadcrumb-item active eu-font' aria-current='page'>Favourites</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container-fluid mt--6'>
            <div className='row'>
              <div className='col-md-12'>
                <div className='card Users'>
                  <div className='card-body'>
                    <div className='card-header'>
                      <div className='row'>
                        <div className='col-sm-7'>
                          <h6 className='h2 text-primary d-inline-block pt-2'>Favourites</h6>
                        </div>
                        <div className='col-sm-4 pr-0' >
                          <form>
                            <div className='form-group mb-0'>
                              <div className='input-group input-group-lg input-group-flush'>
                                <div className='input-group-prepend'>
                                  <div className='input-group-text'>
                                    <span className='fas fa-search' />
                                  </div>
                                </div>
                                <input
                                  type='search' className='form-control' value={this.state.searchString}
                                  onChange={(e) => { this.setState({ searchString: e.target.value }) }} onKeyPress={this.handleEnter} placeholder='Search' />
                              </div>
                            </div>
                          </form>
                        </div>
                        <div className='col-sm-1 pl-0 '>
                          <button className='btn btn-icon btn-primary search-btn-admin px-3 py-2' type='button' onClick={this.handleInputChange}>
                            <span className='btn-inner--icon'><i className='fa fa-search' /></span>
                          </button>
                        </div>
                      </div>
                    </div>
                    {this.state.favouritesData && this.state.favouritesData.length > 0
                          ? <div className='table-responsive'>
                            <table className='table align-items-center table-flush table-striped'>
                              <thead className='thead-light'>
                                <tr>
                                  <th className='sort' data-sort='name'>ProviderName</th>
                                  <th className='sort' data-sort='name'>HotelName</th>
                                  <th className='sort' data-sort='name'>Capacity</th>
                                  <th className='sort' data-sort='name'>Beds</th>
                                  <th className='sort' data-sort='name'>BathRooms</th>
                                  <th className='sort' data-sort='name'>status</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              {this.state.favouritesData.map((item, i) =>
                                <tbody key={i}>
                                  <tr >
                                    <td>{item.spServiceProvider}</td>
                                    <td>{item.spPropertyTitle}</td>
                                    <td>{item.spPropertyId && item.spPropertyId.propertyCapacity ? item.spPropertyId.propertyCapacity : 0 }</td>
                                    <td>{item.spPropertyId && item.spPropertyId.doubleBedsCount ? item.spPropertyId.doubleBedsCount : 0 }</td>
                                    <td>{item.spPropertyId && item.spPropertyId.privateBathRooms ? item.spPropertyId.privateBathRooms : 0}</td>
                                    <td >{item.status}</td>
                                    <td>
                                      <a onClick={() => this.handleViewFavourites(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' >
                                        <i className='far fa-eye' />
                                      </a>
                                      <a className='avatar-sm' title='liked' style={{ backgroundColor: '#ffffff' }} >
                                        {item.status === 'Unfavourite' ? <i className='fas fa-heart icon-cog text-red' onClick={() => this.handleFavouritesStatus(item)} /> : <i className='far fa-heart' onClick={() => this.handleFavouritesStatus(item)} /> }
                                      </a>
                                      <a onClick={() => this.handleBookingFavorites(item)} className='table-action table-action-delete' data-toggle='tooltip' data-placement='top' title='FavouriteBooking'>
                                       <u> Book Again</u>
                                      </a>
                                    </td>
                                  </tr>
                                </tbody>
                              )}
                              <tfoot>
                                {this.state.favouritesData && this.state.favouritesData.length > 0
                                      ? <tr className='card-footer'>
                                        <td className='text-center'>
                                          <Pagination
                                            activePage={this.state.activePage}
                                            itemsCountPerPage={20}
                                            totalItemsCount={this.state.totalCount}
                                            pageRangeDisplayed={5}
                                            onChange={this.handlePageChange}
                                          />
                                        </td>
                                      </tr>
                                      : null}
                              </tfoot>
                            </table>
                          </div>
                          : <div className='container'>
                            <div className='row justify-content-center'>
                              <div className='col-sm-12 text-center my-0' >
                                <div className='no-item'><p>NoFavouritesAvaliable</p></div>
                              </div>
                            </div>
                          </div>
                        }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        : this.state.isFavorites === 'View' ? <ADEUFavouritesViewComponent favouriteObj={this.state.favouriteObj} handleFavorites={this.handleFavouritesViewBack} /> : 'nullllll'}
      </div>
    )
  }
}
