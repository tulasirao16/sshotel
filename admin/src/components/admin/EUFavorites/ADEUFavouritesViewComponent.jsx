/* eslint-disable max-len */
import React from 'react'
import { hashHistory } from 'react-router'
import APICallManager from '../../../services/callmanager'
import PropTypes from 'prop-types'
import config from '../../../../public/config.json'
// import { t } from 'ttag'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

export default class ADEUFavouritesViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      favouriteObj: props.favouriteObj,
      favouritesData: [],
      totalCount: 0,
      activePage: 1,
      searchString: '',
      favouriteProperties: []
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleUsers = this.handleUsers.bind(this)
    this.handleBooking = this.handleBooking.bind(this)
  }
  handleClick (favouriteObj) {
    let favouritesListData = this.state.favouritesData
    let favouriteObj1 = this.state.favouriteObj
    let _this = this
    let recordID = favouriteObj._id
    if (favouriteObj.status === 'Unfavourite') {
      let action = {
        status :'Favourite'
      }
      let obj = { url: config.baseUrl + config.putADFavoritesStatusActivateAPI + recordID, body: action }
      APICallManager.putCall(obj, function (resObj) {
        console.log(resObj)
        if (resObj.data.statusCode === '0000') {
          favouriteObj1.status = 'Favourite'
          _this.setState({ favouritesData: favouritesListData, favouriteObj : favouriteObj1 })
        }
      })
    } else {
      let action = {
        status :'Unfavourite'
      }
      let obj = { url: config.baseUrl + config.putADFavoritesStatusActivateAPI + recordID, body: action }
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          favouriteObj1.status = 'Unfavourite'
          _this.setState({ favouritesData: favouritesListData, favouriteObj : favouriteObj1 })
        }
      })
    }
  }
  componentDidMount () {
    window.onhashchange = () => {
      event.preventDefault()
    }
  }
  handleUsers () {
    hashHistory.push('/admin/eu-users')
  }
  handleBooking () {
    hashHistory.push('/admin/eu/booking')
  }
  render () {
    const favouriteObj = this.state.favouriteObj
    return (
      <div>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center pt-4 pb-4'>
                <div className='col-lg-6 col-7'>
                  <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item eu-font'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item eu-font'><a onClick={this.handleUsers}>End Users</a></li>
                      <li className='breadcrumb-item eu-font' aria-current='page'><a onClick={() => this.props.handleFavorites()}>Favourites</a></li>
                      <li className='breadcrumb-item active eu-font' aria-current='page'>FavouritesView</li>
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
                  <div className='row'>
                    <div className='col-lg-4 col-md-6 col-12 col-sm-12'>
                      <div className='room-wrapper'>
                        <div className='room-inner'>
                          <div className='room'>
                            <figure>
                              <a className='avatar rounded-circle avatar-sm fav-icon' title='liked' style={{ backgroundColor: '#ffffff' }} >
                                {favouriteObj.status === 'Favourite' ? <i className='fas fa-heart icon-cog text-red' onClick={() => this.handleClick(favouriteObj)} /> : <i className='far fa-heart' onClick={() => this.handleClick(favouriteObj)} /> }
                              </a>
                              <div className='img-div-list'>
                                <img src={(favouriteObj.spPropertyId.imagePath ? config.baseUrl + favouriteObj.spPropertyId.imagePath : '')} alt='property_image' className='img-fluid img-container' />
                              </div>
                            </figure>
                            <div style={{ cursor:'pointer' }} role='button' onClick={() => this.handleBooking(favouriteObj)}>
                              <div className='caption'>
                                <div className='txt1 hotelName eu-font'>{favouriteObj.spPropertyId.propertyTitle}</div>
                                {favouriteObj.spPropertyId && favouriteObj.spPropertyId.rating
                                ? <div className='txt2'>
                                  <div className='small-stars eu-font' style={{ color: 'black', fontSize: 16 }}>
                                    {favouriteObj.spPropertyId.rating}
                                    <i className='fa fa-star' style={{ color: 'gold', fontSize: 16 }} />
                                  </div>
                                </div> : ''}
                                <div className='txt3 availables'>
                                  <div className='row'>
                                    <div className='col-sm-6 py-1'>
                                      <i className='fa fa-users pr-3' />
                                      <span className='eu-font' >{favouriteObj.spPropertyId.propertyCapacity}</span>
                                    </div>
                                    <div className='col-sm-6 py-1' >
                                      <div className='avatar avatar-xs pr-3'>
                                        <img src={require('../../../../assets/available/doublebed.png')} />
                                      </div>
                                      <span className='eu-font'>{favouriteObj.spPropertyId.doubleBedsCount}</span>
                                    </div>
                                  </div>
                                  <div className='row'>
                                    <div className='col-sm-6 py-1' >
                                      <i className='fa fa-bath pr-3' />
                                      <span className='eu-font'>{favouriteObj.spPropertyId.privateBathRooms}</span>
                                    </div>
                                    <div className='col-sm-6 py-1' >
                                      <i className='fa fa-bed pr-3' />
                                      <span className='eu-font'>{favouriteObj.spPropertyId.singleBedsCount}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className='txt4'>
                                  <a onClick={() => this.handleBooking(favouriteObj)} >View Details <i className='fa fa-caret-right' aria-hidden='true' /></a>
                                </div>
                              </div>
                              <div className='select-txt'>
                                <a className='eu-font' ><span>SELECT THIS ROOM<i className='fa fa-angle-right' aria-hidden='true' /></span></a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ADEUFavouritesViewComponent.propTypes = {
  favouriteObj: PropTypes.any,
  handleFavorites:PropTypes.any
}
