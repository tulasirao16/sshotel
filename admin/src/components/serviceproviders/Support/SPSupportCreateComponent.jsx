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
// import Switch from 'react-switch'
import { t } from 'ttag'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'
// import DrawerWithHeader from '../Drawer/DrawerComponent'
// import FooterComponent from '../FooterCompnt/Footer'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class SPSupportCreateComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      tNumber: '',
      tSubject: '',
      ticketBy: '',
      ticketOn: '',
      tQuery: '',
      tNumberError: '',
      tSubjectError: '',
      ticketByError: '',
      ticketOnError:'',
      tQueryError: '',
      ticket: '',
      ticketDescription: ''
    }
    this.handleAddManually = this.handleAddManually.bind(this)
    this.handleViewTicket = this.handleViewTicket.bind(this)
    // this.handleOnChange = this.handleOnChange.bind(this)
    this.handleCreateTicket = this.handleCreateTicket.bind(this)
  }
  handleAddManually (event) {
    hashHistory.push('/AddProperty')
    event.preventDefault()
  }
  handleViewTicket (e) {
    hashHistory.push('/viewticket')
    event.preventDefault()
  }
  // handleOnChange (e) {
  //   if(e.target.id == 'ticketNumber') {
  //     this.setState({
  //       tNumber: e.target.value,
  //       tNumberError: ''
  //     })
  //   } else if(e.target.id == 'TicketSubject') {
  //     this.setState({
  //       tSubject: e.target.value,
  //       tSubjectError: ''
  //     })
  //   } else if(e.target.id == 'ticketBy') {
  //     this.setState({
  //       ticketBy: e.target.value,
  //       ticketByError: ''
  //     })
  //   } else if(e.target.id == 'ticketOn') {
  //     this.setState({
  //       ticketOn: e.target.value,
  //       ticketOnError: ''
  //     })
  //   } else if(e.target.id == 'ticketQuery') {
  //     this.setState({
  //       tQuery: e.target.value,
  //       tQueryError: ''
  //     })
  //   }
  // }
  // handleCreateTicket () {
  //   if(!this.state.tNumber) {
  //     this.setState({
  //       tNumberError: 'Enter Ticket Number'
  //     })
  //   } else if(!this.state.tSubject) {
  //     this.setState({
  //       tSubjectError: 'Enter Ticket Subject'
  //     })
  //   } else if(!this.state.ticketBy) {
  //     this.setState({
  //       ticketByError: 'Enter Ticket Created by Whom'
  //     })
  //   } else if(!this.state.ticketOn) {
  //     this.setState({
  //       ticketOnError: 'Enter Created Date'
  //     })
  //   } else if(!this.state.tQuery) {
  //     this.setState({
  //       tQueryError: 'Enter Ticket Query '
  //     })
  //   } else {
  //     hashHistory.push('/host/support')
  //     event.preventDefault()
  //   }
  // }
  handleCreateTicket () {
    if (!this.state.ticket) {
      this.setState({ errorMessage: t`lanCommonLabelErrorTicketTypeRequired` })
    } else if (!this.state.ticketDescription.trim()) {
      this.setState({ errorMessage: t`lanCommonLabelErrorDescriptionRequired` })
    } else {
      let supportData = {
        'ticket': this.state.ticket,
        'ticketDescription': this.state.ticketDescription
      }
      let _this = this
      let obj = { url: config.baseUrl + config.postSPSupportCreateAPI, body: supportData }
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          toast.success('Ticket Created Successfully', {
            position: toast.POSITION.TOP_CENTER
          })
          setTimeout(() => {
            _this.props.handleCreateSupport(resObj.data.statusResult)
          }, 2000)
          // hashHistory.push('/host/support')
        } else {
          toast.error('Ticket Create Failed', {
            position: toast.POSITION.TOP_CENTER
          })
          _this.setState({ errorMessage: t`lanCommonLabelErrorRecordCreateFailed` })
        }
      })
    }
    event.preventDefault()
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        {/* <DrawerWithHeader /> */}
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a href='#'><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={() => this.props.handleCreateSupport({})} >Support</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>Support Create Page</li>
                    </ol>
                  </nav>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  {/* <a className='btn btn-sm btn-neutral'>Edit Ticket</a> */}
                  {/* <a href='#' className='btn btn-sm btn-neutral'>Filters</a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6 '>
          <div className='row justify-content-center notifictions'>
            <div className='col-md-12 card-wrapper'>
              <div className='card mb-2'>
                <div className='card-header'>
                  <h6 className='h2 d-inline-block mb-0'>{t`lanSPButtonCreateTicket`}</h6>
                </div>
                <div className='card-body'>
                  <section className='notifications'>
                    <div className='row'>
                      <label className='form-control-label col-auto'>{t`lanCommonLabelTicketType`}<span className='error'>*</span></label>
                      <div className='form-group col-md-4'>
                        <select className='form-control' id='exampleFormControlSelect1' onChange={() => this.setState({ ticket: event.target.value, errorMessage: '' })} value={this.state.ticket} >
                          <option value=''>Select Ticket Type</option>
                          <option value='Ticket1'>Ticket1</option>
                          <option value='Ticket2'>Ticket2</option>
                        </select>
                        {/* <input type='text' value={this.state.ticket} onChange={this.handleOnChange} className='form-control' id='ticketNumber' placeholder='Ticket Number' /> */}
                        {/* <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tNumberError ? {color: 'red', fontSize: 18 } : {opacity: 0}} /></span>  */}
                        {/* <p className='text-muted'><small style={{ color: 'red' }}>{this.state.tNumberError}</small> </p> */}
                      </div>
                    </div>
                    <div className='row'>
                      <label className='form-control-label col-auto'>{t`lanCommonLabelDescription`}<span className='error'>*</span></label>
                      <div className='form-group col-md-4'>
                        {/* <textarea className='form-control' id='exampleFormControlTextarea1' rows='6' onChange={() => this.setState(Des)} >
                            {this.state.supportData.ticketDescription}
                          </textarea> */}
                        <textarea className='form-control' id='ticketQuery' rows='3' maxLength='500'
                          onChange={() => this.setState({ ticketDescription: event.target.value, errorMessage: '' })} value={this.state.description} />
                        {/* <span className='input-error-icon' ><i className='far fa-times-circle' style={this.state.tQueryError ? { color: 'red', fontSize: 18 } : { opacity: 0 }} /></span>
                        <p className='text-muted'><small style={{ color: 'red' }}>{this.state.tQueryError}</small> </p> */}
                      </div>
                    </div>
                    <div className='row'>
                      <div className='container'>
                        <label className='label-control' style={{ color: 'red' }}>{this.state.errorMessage}</label>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='form-control-label col-md-2' />
                      <div className='col-md-4'>
                        <button className='btn btn-primary update-edit' onClick={this.handleCreateTicket}>{t`lanCommonButtonCreate`}</button>
                        <ToastContainer rtl />
                      </div>
                    </div>
                    {/* <div className='card-footer text-center'>
                      <button className='btn btn-primary mb-0' >{ t`lanCommonButtonBack` }</button>
                    </div> */}
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SPSupportCreateComponent.propTypes = {
  handleCreateSupport: PropTypes.any
}

export default SPSupportCreateComponent
