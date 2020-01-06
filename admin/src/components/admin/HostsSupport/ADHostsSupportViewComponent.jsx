/* eslint-disable max-len */
import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import PropTypes from 'prop-types'
import { t } from 'ttag'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class ADHostsSupportViewComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      supportData: this.props.selectedSupportData,
      disabled: true
    }
  }

  render () {
    return (
      <div>
        <div>
          <div className='header bg-primary pb-6'>
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='row align-items-center py-4'>
                  <div className='col-lg-6 col-7'>
                    <h6 className='h2 text-white d-inline-block mb-0'>Admin Hosts Support</h6>
                    <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item'><a onClick={this.handleUsers}>Host Users</a></li>
                        <li className='breadcrumb-item'><a onClick={() => this.props.handleBack()}>Support</a></li>
                        <li className='breadcrumb-item active' aria-current='page'>Support View</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container-fluid mt--6 mb-4'>
          <div className='row justify-content-center'>
            <div className='col-lg-12 col-md-12'>
              <div className='card border-0 mb-0'>
                <div className='card-header bg-transparent pb-3'>
                  <div className='row'>
                    <div className='col-sm-10'>
                      <h5 className='card-title'>View Ticket</h5>
                    </div>
                    <div className='col-sm-2 text-right' >
                      <button className='btn btn-primary mb-0' onClick={() => this.props.handleBack(this.state.supportData)}>{t`lanCommonButtonBack`}</button>
                    </div>
                  </div>
                </div>
                <div className='card-body card-ticket'>
                  <div className='row'>
                    <div className='col-md-3'>
                      <div className='form-group'>
                        <label>Ticket Title</label>
                        <input type='ticket' className='form-control' value={this.state.supportData.ticketTitle} disabled={this.state.disabled} />
                      </div>
                    </div>
                    <div className='col-md-3'>
                      <div className='form-group'>
                        <label>{t`lanEULabelTicketType`}</label>
                        <div className=''>
                          <select className='form-control' id='exampleFormControlSelect1' disabled={this.state.disabled}>
                            <option>{this.state.supportData.ticketTag}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className='col-md-3'>
                      <div className='form-group'>
                        <label>Ticket Number:</label>
                        <input type='text' className='form-control' value={this.state.supportData.ticketNumType + this.state.supportData.ticketNumber} disabled={this.state.disabled} />
                      </div>
                    </div>
                    <div className='col-md-3'>
                      <div className='form-group'>
                        <label>Ticket Status:</label>
                        <input type='email' className='form-control' value={this.state.supportData.ticketStatus} disabled={this.state.disabled} />
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <label> Ticket Description </label>
                        <textarea className='form-control textarea' id='exampleFormControlTextarea1' rows='6'
                          value={this.state.supportData.ticketDescription} disabled={this.state.disabled} />
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
ADHostsSupportViewComponent.propTypes = {
  selectedSupportData: PropTypes.any,
  handleBack: PropTypes.any
}
export default ADHostsSupportViewComponent
