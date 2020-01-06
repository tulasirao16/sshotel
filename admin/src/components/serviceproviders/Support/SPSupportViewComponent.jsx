/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
// import ReactDrawer from 'react-drawer'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import PropTypes from 'prop-types'
import moment from 'moment'
import { t } from 'ttag'
// import Switch from 'react-switch'
// import DrawerWithHeader from '../Drawer/DrawerComponent'
// import FooterComponent from '../FooterCompnt/Footer'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class SPSupportViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      supportData: this.props.selectedSupportData
    }
    this.handleEditView = this.handleEditView.bind(this)
  }

  componentWillReceiveProps (newProps) {
    this.setState({ supportData: newProps.selectedSupportData })
  }
  handleEditView (e) {
    localStorage.setItem('supportData', JSON.stringify(this.state.supportData))
    hashHistory.push('/host/support/edit')
    event.preventDefault()
  }
  render () {
    return (
      <div >
        {/* ------- Navbar --------- */}
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a href='#'><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={() => this.props.handleViewSupport(this.state.supportData)} >Support</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>Support View Page</li>
                    </ol>
                  </nav>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  <a onClick={() => this.props.handleEditTicket(this.state.supportData)} className='btn btn-success text-white'><i className='far fa-edit' />{' '}{t`lanSPButtonEditTicket`}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6 pb-4'>
          <div className='row justify-content-center support-view'>
            <div className='col-md-12 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header'>
                  <h6 className='h2 d-inline-block mb-0'>{t`lanSPLabelViewTicket`}</h6>
                </div>
                <div className='card-body'>
                  {/* List group */}
                  <ul className='list-group list-group-flush list mb-2'>
                    <li className='list-group-item'>
                      <div className='row align-items-center pb-2'>
                        <div className='col'>
                          <small className='view-title'>{t`lanCommonLabelTicketType`}:</small>
                          <h5 className='mb-0'>{this.state.supportData.ticket}</h5>
                        </div>
                        <div className='col'>
                          <small className='view-title' >{t`lanCommonLabelTicketNumber`}:</small>
                          <h5 className='mb-0'>{this.state.supportData.ticketNumber}</h5>
                        </div>
                        <div className='col'>
                          <small className='view-title' >{t`lanCommonLabelStatus`}:</small>
                          <h5 className='mb-0'>{this.state.supportData.status}</h5>
                        </div>
                        <div className='col'>
                          <small className='view-title' >{t`lanCommonLabelDate`}:</small>
                          <h5 className='mb-0'>{moment(this.state.supportData.createdAt).format('MMM DD, YYYY')}</h5>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <section>
                    <div className='row clearfix'>
                      <div className='col-md-12 col-lg-12 col-xl-12'>
                        <div className='list-group list-group-flush'>
                          <div className='list-group-item'>
                            <div className='row align-items-center'>
                              <div className='col'>
                                <div className='d-flex justify-content-between align-items-center'>
                                  <div>
                                    <small className='mb-2 view-title '>{t`lanCommonLabelDescription`}</small>
                                  </div>
                                </div>
                                <p className='text-sm mb-0'>{this.state.supportData.ticketDescription}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                {/* <div className='card-footer text-center'>
                  <button className='btn btn-primary mb-0' onClick={() => this.props.handleViewSupport(this.state.supportData)}>{ t`lanCommonButtonBack` }</button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
SPSupportViewComponent.propTypes = {
  selectedSupportData: PropTypes.any,
  handleViewSupport: PropTypes.any,
  handleEditTicket: PropTypes.any
}
export default SPSupportViewComponent
