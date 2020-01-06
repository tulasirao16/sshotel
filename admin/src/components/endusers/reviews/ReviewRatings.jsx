/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
// import Switch from 'react-switch'
import MainHeader from '../HeaderCompnt/MainHeader'
import FooterComponent from '../FooterCompnt/Footer'
import './css/Reviews.css'

class EndUserReviews extends React.Component {
  constructor () {
    super()
    this.state = {
      data:[
        { id:1, hotel:'Taaz', location:'Banjara Hills', bookingCode:'NGSBNBB001', rating:5, rheading: 'Good', rcomment:'Good Service', status: 'Active' },
        { id:2, hotel:'Dwaraka', location:'Tarnaka', bookingCode:'NGSBNBB002', rating:4.5, rheading: 'Good', rcomment:'Good Service', status: 'Active' },
        { id:3, hotel:'Taaz', location:'Banjara Hills', bookingCode:'NGSBNBB001', rating:5, rheading: 'Good', rcomment:'Good Service', status: 'Active' },
        { id:4, hotel:'Madhura Hotels', location:'Mumbai', bookingCode:'NGSBNBB004', rating:3.5, rheading: 'Good', rcomment:'Good Service', status: 'INactive' }

      ]
    }
    this.handleRatingView = this.handleRatingView.bind(this)
  }
  handleRatingView (e) {
    hashHistory.push('/ratingView')
    event.preventDefault()
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        {/* page header start */}
        <MainHeader />
        {/* page header end */}
        <div className='header bg-primary pb-6 ratings'>
          <div className='container'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>Reviews & Ratings</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container mt--6'>
          <div className='row justify-content-center notifictions'>
            <div className='col-lg-12 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-body'>
                  <div className='card-header mx-0 py-0 col-lg-6 col-sm-12 col-xs-12'>
                    {/* -- Search form -- */}
                    <form>
                      <div className='form-group mb-0'>
                        <div className='input-group input-group-lg input-group-flush'>
                          <div className='input-group-prepend'>
                            <div className='input-group-text'>
                              <span className='fas fa-search'>{ /* nobody */ }</span>
                            </div>
                          </div>
                          <input type='search' className='form-control' placeholder='Search' />
                        </div>
                      </div>
                    </form>
                  </div>
                  <section className='ratings-section bookings'>
                    <div className='row clearfix'>
                      <div className='col-md-12 col-lg-12 col-xl-12'>
                        <div className='px-lg-0 py-lg-4'>
                          <div className='table-responsive'>
                            <a href={this.handleRatingView} >
                              <table className='table align-items-center table-flush table-striped table-hover table-responsive review-table'>
                                <thead className='thead-light'>
                                  <tr>
                                    <th>Hotel</th>
                                    <th>Booking Code</th>
                                    <th>Rating</th>
                                    <th>Review Header</th>
                                    <th>Review Comment</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                {this.state.data.map((item, i) =>
                                  <tbody key={i}>
                                    <tr>
                                      <td className='table-user'>
                                        <img src={require('../../../../assets/r1.jpg')} className='avatar rounded-circle mr-3' />
                                        <a href='#'><strong>{item.hotel}, {item.location}</strong></a>
                                      </td>
                                      <td>
                                        <span className='text-muted'>{item.bookingCode}</span>
                                      </td>
                                      <td>
                                        <button type='button' className='btn btn-sm btn-cozy'>
                                          <span className='text-muted-white'>{item.rating} <i className='fas fa-star' /></span>
                                        </button>
                                      </td>
                                      <td className='table-rHeading' >
                                        <span className='text-muted'>{item.rheading}</span>
                                      </td>
                                      <td className='table-rComment' >
                                        <span className='text-muted'>{item.rcomment} </span>
                                      </td>
                                      <td className='table-actions'>
                                        {item.status === 'Active'
                                        ? <button type='button' className='btn btn-sm btn-success'>Active</button>
                                        : <button type='button' className='btn btn-sm btn-danger'>Inactive</button>
                                        }
                                      </td>
                                      <td className='table-actions btn-actions'>
                                        <a onClick={this.handleRatingView} className='table-action table-action-view' data-toggle='tooltip' data-placement='top' title='View Booking'>
                                          <i className='far fa-eye'>{ /*  */ }</i>
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                )}
                              </table>
                            </a>
                          </div>
                          <div className='card-footer'>
                            <nav aria-label='Page navigation example'>
                              <ul className='pagination justify-content-center'>
                                <li className='page-item disabled'>
                                  <a className='page-link' href='#' tabIndex='-1'>
                                    <i className='fa fa-angle-left'>{ /*  */ }</i>
                                    <span className='sr-only'>Previous</span>
                                  </a>
                                </li>
                                <li className='page-item'><a className='page-link' href='#'>1</a></li>
                                <li className='page-item active'><a className='page-link' href='#'>2</a></li>
                                <li className='page-item'><a className='page-link' href='#'>3</a></li>
                                <li className='page-item'>
                                  <a className='page-link' href='#'>
                                    <i className='fa fa-angle-right'>{ /*  */ }</i>
                                    <span className='sr-only'>Next</span>
                                  </a>
                                </li>
                              </ul>
                            </nav>
                          </div>
                        </div>
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

export default EndUserReviews
