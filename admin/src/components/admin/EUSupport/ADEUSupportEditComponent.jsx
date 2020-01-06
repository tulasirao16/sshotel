import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import PropTypes from 'prop-types'
import { t } from 'ttag'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
// import { hashHistory } from 'react-router'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

class ADEUSupportEditComponent extends React.Component {
  constructor (props) {
    super(props)
    let supportData = this.props.selectedSupportData
    this.state = {
      ticketTitle:supportData.ticketTitle,
      ticketTag:supportData.ticketTag,
      ticketNumType:supportData.ticketNumType,
      ticketDescription:supportData.ticketDescription,
      ticketNumber:supportData.ticketNumber,
      ticketStatus:supportData.ticketStatus,
      disabled: true,
      supportId: '',
      errorMessage:'',
      supportList:[]
    }
    this.handleUpdateSupport = this.handleUpdateSupport.bind(this)
  }
  handleUpdateSupport () {
    let supportList = this.props.supportList
    let supportData = this.props.selectedSupportData
    if (!this.state.ticketTitle) {
      this.setState({ errorMessage: 'Ticket Title Required' })
    } else if (!this.state.ticketTag) {
      this.setState({ errorMessage: 'Ticket Type Required' })
    } else if (!this.state.ticketDescription) {
      this.setState({ errorMessage: 'Ticket Description Required' })
    } else if (supportData.ticketTitle === this.state.ticketTitle && supportData.ticketTag === this.state.ticketTag && supportData.ticketDescription === this.state.ticketDescription) {
      this.props.handleBack(supportList)
    } else {
      let putJson = {
        ticketTitle:this.state.ticketTitle,
        ticketTag:this.state.ticketTag,
        ticketDescription:this.state.ticketDescription
      }
      let obj = { url: config.baseUrl + config.putADEUSupportUpdateAPI + supportData._id, body: putJson }
      let _this = this
      let index = supportList.findIndex(dataObj => dataObj._id === supportData._id)
      APICallManager.putCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          ToastsStore.success('Ticket Updated Successfully')
          supportList[index] = resObj.data.statusResult
          _this.setState({ supportList: supportList })
          setTimeout(() => {
            _this.props.handleBack(supportList)
          }, 2000)
          // supportList.set(index, supportData._id)
        } else {
          ToastsStore.error('Ticket Update failed try again')
        }
      })
    }
  }

  render () {
    return (
      <div>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>Admin EU Support</h6>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleUsers}>End Users</a></li>
                      <li className='breadcrumb-item'><a onClick={() => this.props.handleBack()}>Support</a></li>
                      <li className='breadcrumb-item active' aria-current='page'>Support Edit</li>
                    </ol>
                  </nav>
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
                      <h5 className='card-title'>Edit Ticket</h5>
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
                        <input type='ticket' className='form-control' value={this.state.ticketTitle}
                          onChange={(event) => this.setState({ ticketTitle:event.target.value, errorMessage:'' })} />
                      </div>
                    </div>
                    <div className='col-md-3'>
                      <div className='form-group'>
                        <label>{t`lanEULabelTicketType`}</label>
                        <div className=''>
                          <select className='form-control' id='exampleFormControlSelect2' value={this.state.ticketTag}
                            onChange={(event) => this.setState({ ticketTag:event.target.value, errorMessage:'' })}>
                            <option value='Account'>Account</option>
                            <option value='Booking'>Booking</option>
                            <option value='Cancellation'>Cancellation</option>
                            <option value='Property'>Property</option>
                            <option value='Refund'>Refund</option>
                            <option value='Payment'>Payment</option>
                            <option value='Dispute'>Dispute</option>
                            <option value='Other'>Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className='col-md-3'>
                      <div className='form-group'>
                        <label>Ticket Number</label>
                        <input type='text' className='form-control' value={this.state.ticketNumType + this.state.ticketNumber} disabled={this.state.disabled} />
                      </div>
                    </div>
                    <div className='col-md-3'>
                      <div className='form-group'>
                        <label>Ticket Status</label>
                        <input type='email' className='form-control' value={this.state.ticketStatus} disabled={this.state.disabled} />
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='form-group '>
                        <label> Ticket Description </label>
                        <textarea className='form-control textarea' id='exampleFormControlTextarea1' rows='6'
                          value={this.state.ticketDescription} onChange={(event) => this.setState({ ticketDescription:event.target.value, errorMessage:'' })} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p style={{ color: 'red' }}>{this.state.errorMessage} </p>
                  </div>
                  <div>
                    <button className='btn btn-primary update-edit' onClick={this.handleUpdateSupport}>{t`lanCommonButtonUpdate`}</button>
                  </div>
                  <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
ADEUSupportEditComponent.propTypes = {
  selectedSupportData: PropTypes.any,
  handleBack: PropTypes.any,
  supportList:PropTypes.any
}
export default ADEUSupportEditComponent
