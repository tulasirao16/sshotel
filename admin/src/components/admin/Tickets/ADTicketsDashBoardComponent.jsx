/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
import 'react-drawer/lib/react-drawer.css'
import PieChart from 'react-minimal-pie-chart'

import '../../../components/admin/css/all.min.css'
import '../../../components/admin/css/argon.min.css'
import '../../../components/admin/css/nucleo.css'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

class ADTicketsDashBoardComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      dateType: 'Today',
      ticketsByAssignData: [],
      ticketsByGroupData: [],
      ticketsByPrioritiesData: [],
      ticketsByStatusData: [],
      ticketsByTagData: [],
      ticketsCountByStatus: [],
      completedTicketsCount: 0,
      onHoldTicketsCount: 0,
      escalatedTicketsCount: 0,
      closedTicketsCount: 0,
      newTicketsCount: 0,
      openTicketsCount: 0,
      inprogressTicketsCount: 0,
      resolvedTicketsCount: 0,
      assignedTicketsCount: 0,
      unassignedTicketsCount: 0,
      reassignedTicketsCount: 0,
      highPriorityTicketsCount: 0,
      mediumPriorityTicketsCount: 0,
      lowPriorityTicketsCount: 0,
      marketingTicketsCount: 0,
      enduserServicesTicketsCount: 0,
      hostServicesTicketsCount: 0,
      bookingTagTicketsCount: 0,
      refundTagTicketsCount: 0,
      propertyTagTicketsCount: 0,
      cancellationTagTicketsCount: 0,
      accountsTagTicketsCount: 0,
      disputeTagTicketsCount: 0,
      otherTagTicketsCount: 0,
      tktByStatus: false,
      tktByAssain: false,
      tktByPriorities: false,
      tktByGroup: false,
      tktByTags: false,
      mouseOverData: {},
      onboardingTicketsCount: 0,
      paymentTagTicketsCount: 0

    }
    this.handleDateTypeChange = this.handleDateTypeChange.bind(this)
    this.handleCountTicketsByPriority = this.handleCountTicketsByPriority.bind(this)
    this.handleCountByAssignStatus = this.handleCountByAssignStatus.bind(this)
    this.handleCountByTag = this.handleCountByTag.bind(this)
    this.handleCountByGroup = this.handleCountByGroup.bind(this)
    this.handleCountsByStatus = this.handleCountsByStatus.bind(this)
    this.handleTicketsByStatus = this.handleTicketsByStatus.bind(this)
  }
  componentWillMount () {
    let getADTicketsDashboardCountsObj = {
      url: config.baseUrl + config.getADTicketsDashboardCountsAPI + this.state.dateType
    }
    let _this = this
    APICallManager.getCall(getADTicketsDashboardCountsObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          ticketsByAssignData : resObj.data.statusResult.TicketsByAssignData.result,
          ticketsByGroupData: resObj.data.statusResult.TicketsByGroupData.result,
          ticketsByPrioritiesData: resObj.data.statusResult.TicketsByPrioritiesData.result,
          ticketsByStatusData: resObj.data.statusResult.TicketsByStatusData.result,
          ticketsByTagData: resObj.data.statusResult.TicketsByTagData.result,
          ticketsCountByStatus: resObj.data.statusResult.TicketsCountByStatus.result,
          totalCount: resObj.data.statusResult.TicketsTotalCount.result
        })
        _this.handleTicketsByStatus(resObj.data.statusResult.TicketsByStatusData.result)
        _this.handleCountsByStatus(resObj.data.statusResult.TicketsCountByStatus.result)
        _this.handleCountTicketsByPriority(resObj.data.statusResult.TicketsByPrioritiesData.result)
        _this.handleCountByAssignStatus(resObj.data.statusResult.TicketsByAssignData.result)
        _this.handleCountByGroup(resObj.data.statusResult.TicketsByGroupData.result)
        _this.handleCountByTag(resObj.data.statusResult.TicketsByTagData.result)
      }
    })
  }
  handleTicketsByStatus (data) {
    if (data && data.length) {
      let ticketsByStatusData = data
      var tempNewTicketsCount = 0
      var tempOpenTicketsCount = 0
      var tempInprogressTicketsCount = 0
      var tempResolvedTicketsCount = 0
      ticketsByStatusData.forEach(value => {
        if (value._id === 'New') {
          tempNewTicketsCount = value.count
        }
        if (value._id === 'Open') {
          tempOpenTicketsCount = value.count
        }
        if (value._id === 'Inprogress') {
          tempInprogressTicketsCount = value.count
        }
        if (value._id === 'Resolved') {
          tempResolvedTicketsCount = value.count
        }
      })
      this.setState({
        newTicketsCount: tempNewTicketsCount,
        openTicketsCount: tempOpenTicketsCount,
        inprogressTicketsCount: tempInprogressTicketsCount,
        resolvedTicketsCount: tempResolvedTicketsCount
      })
    } else {
      this.setState({
        newTicketsCount: 0,
        openTicketsCount: 0,
        inprogressTicketsCount: 0,
        resolvedTicketsCount: 0
      })
    }
  }
  handleCountsByStatus (data) {
    if (data && data.length) {
      let ticketsCountByStatus = data
      var tempCompletedTicketsCount = 0
      var tempOnHoldTicketsCount = 0
      var tempEscalatedTicketsCount = 0
      var tempClosedTicketsCount = 0
      ticketsCountByStatus.forEach(value => {
        if (value._id === 'Completed') {
          tempCompletedTicketsCount = value.count
        }
        if (value._id === 'Onhold') {
          tempOnHoldTicketsCount = value.count
        }
        if (value._id === 'Escalate') {
          tempEscalatedTicketsCount = value.count
        }
        if (value._id === 'Closed') {
          tempClosedTicketsCount = value.count
        }
      })
      this.setState({
        completedTicketsCount: tempCompletedTicketsCount,
        onHoldTicketsCount: tempOnHoldTicketsCount,
        escalatedTicketsCount: tempEscalatedTicketsCount,
        closedTicketsCount: tempClosedTicketsCount
      })
    } else {
      this.setState({
        completedTicketsCount: 0,
        onHoldTicketsCount: 0,
        escalatedTicketsCount: 0,
        closedTicketsCount: 0
      })
    }
  }
  handleCountByTag (data) {
    if (data.length) {
      let ticketsByTagData = data
      var tempBookingTicketsCount = 0
      var tempRefundTicketsCount = 0
      var tempPropertyTicketsCount = 0
      var tempCancellationTicketsCount = 0
      var tempAccountsTicketsCount = 0
      var tempDisputeTicketsCount = 0
      var tempOtherTicketsCount = 0
      var tempOnboardingTicketsCount = 0
      var tempPaymentTicketsCount = 0
      ticketsByTagData.forEach(value => {
        if (value._id === 'Booking') {
          tempBookingTicketsCount = value.count
        }
        if (value._id === 'Refund') {
          tempRefundTicketsCount = value.count
        }
        if (value._id === 'Property') {
          tempPropertyTicketsCount = value.count
        }
        if (value._id === 'Cancellation') {
          tempCancellationTicketsCount = value.count
        }
        if (value._id === 'Account') {
          tempAccountsTicketsCount = value.count
        }
        if (value._id === 'Dispute') {
          tempDisputeTicketsCount = value.count
        }
        if (value._id === 'Other') {
          tempOtherTicketsCount = value.count
        }
        if (value._id === 'Onboarding') {
          tempOnboardingTicketsCount = value.count
        }
        if (value._id === 'Payment') {
          tempPaymentTicketsCount = value.count
        }
      })
      this.setState({
        bookingTagTicketsCount: tempBookingTicketsCount,
        refundTagTicketsCount: tempRefundTicketsCount,
        propertyTagTicketsCount: tempPropertyTicketsCount,
        cancellationTagTicketsCount: tempCancellationTicketsCount,
        accountsTagTicketsCount: tempAccountsTicketsCount,
        disputeTagTicketsCount: tempDisputeTicketsCount,
        otherTagTicketsCount: tempOtherTicketsCount,
        onboardingTicketsCount: tempOnboardingTicketsCount,
        paymentTagTicketsCount: tempPaymentTicketsCount
      })
    } else {
      this.setState({
        bookingTagTicketsCount: 0,
        refundTagTicketsCount: 0,
        propertyTagTicketsCount: 0,
        cancellationTagTicketsCount: 0,
        accountsTagTicketsCount: 0,
        disputeTagTicketsCount: 0,
        otherTagTicketsCount: 0,
        onboardingTicketsCount:0,
        paymentTagTicketsCount: 0
      })
    }
  }
  handleCountByAssignStatus (data) {
    if (data.length) {
      let ticketsByAssignData = data
      var tempAssignedTicketsCount = 0
      var tempUnassignedTicketsCount = 0
      var tempReassignedTicketsCount = 0
      ticketsByAssignData.forEach(value => {
        if (value._id === 'Assigned') {
          tempAssignedTicketsCount = value.count
        }
        if (value._id === 'Unassigned') {
          tempUnassignedTicketsCount = value.count
        }
        if (value._id === 'Reassigned') {
          tempReassignedTicketsCount = value.count
        }
      })
      this.setState({
        assignedTicketsCount: tempAssignedTicketsCount,
        unassignedTicketsCount: tempUnassignedTicketsCount,
        reassignedTicketsCount: tempReassignedTicketsCount
      })
    } else {
      this.setState({
        assignedTicketsCount: 0,
        unassignedTicketsCount: 0,
        reassignedTicketsCount: 0
      })
    }
  }
  handleCountByGroup (data) {
    if (data.length) {
      let ticketsByGroupData = data
      var tempMarketingTicketsCount = 0
      var tempEUServicesTicketsCount = 0
      var tempHostServicesTicketsCount = 0
      ticketsByGroupData.forEach(value => {
        if (value._id === 'Marketing') {
          tempMarketingTicketsCount = value.count
        }
        if (value._id === 'End User Service') {
          tempEUServicesTicketsCount = value.count
        }
        if (value._id === 'Host Service') {
          tempHostServicesTicketsCount = value.count
        }
      })
      this.setState({
        marketingTicketsCount: tempMarketingTicketsCount,
        enduserServicesTicketsCount: tempEUServicesTicketsCount,
        hostServicesTicketsCount: tempHostServicesTicketsCount
      })
    } else {
      this.setState({
        marketingTicketsCount: 0,
        enduserServicesTicketsCount: 0,
        hostServicesTicketsCount: 0
      })
    }
  }
  handleCountTicketsByPriority (data) {
    if (data.length) {
      let ticketsByPrioritiesData = data
      var tempHighTicketsCount = 0
      var tempMediumTicketsCount = 0
      var tempLowTicketsCount = 0
      ticketsByPrioritiesData.forEach(value => {
        if (value._id === 'High') {
          tempHighTicketsCount = value.count
        }
        if (value._id === 'Medium') {
          tempMediumTicketsCount = value.count
        }
        if (value._id === 'Low') {
          tempLowTicketsCount = value.count
        }
      })
      this.setState({
        highPriorityTicketsCount: tempHighTicketsCount,
        mediumPriorityTicketsCount: tempMediumTicketsCount,
        lowPriorityTicketsCount: tempLowTicketsCount
      })
    } else {
      this.setState({
        highPriorityTicketsCount: 0,
        mediumPriorityTicketsCount: 0,
        lowPriorityTicketsCount: 0
      })
    }
  }
  handleDateTypeChange (event) {
    this.setState({ dateType: event.target.value })
    let getADTicketsDashboardCountsObj = {
      url: config.baseUrl + config.getADTicketsDashboardCountsAPI + event.target.value
    }
    let _this = this
    APICallManager.getCall(getADTicketsDashboardCountsObj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({
          ticketsByAssignData : resObj.data.statusResult.TicketsByAssignData.result,
          ticketsByGroupData: resObj.data.statusResult.TicketsByGroupData.result,
          ticketsByPrioritiesData: resObj.data.statusResult.TicketsByPrioritiesData.result,
          ticketsByStatusData: resObj.data.statusResult.TicketsByStatusData.result,
          ticketsByTagData: resObj.data.statusResult.TicketsByTagData.result,
          ticketsCountByStatus: resObj.data.statusResult.TicketsCountByStatus.result,
          totalCount: resObj.data.statusResult.TicketsTotalCount.result
        })
        _this.handleCountsByStatus(resObj.data.statusResult.TicketsCountByStatus.result)
        _this.handleTicketsByStatus(resObj.data.statusResult.TicketsByStatusData.result)
        _this.handleCountByTag(resObj.data.statusResult.TicketsByTagData.result)
        _this.handleCountByGroup(resObj.data.statusResult.TicketsByGroupData.result)
        _this.handleCountTicketsByPriority(resObj.data.statusResult.TicketsByPrioritiesData.result)
        _this.handleCountByAssignStatus(resObj.data.statusResult.TicketsByAssignData.result)
      }
    })
  }
  handlePieChart (data, dataIndex) {
    this.setState({ tktByStatus: true, mouseOverData: data[dataIndex] })
  }

  handlePieChartAssain = (event, data, dataIndex) => {
    this.setState({ tktByAssain: true, mouseOverData: data[dataIndex] })
  }
  handlePieChartPriority = (event, data, dataIndex) => {
    this.setState({ tktByPriorities: true, mouseOverData: data[dataIndex] })
  }
  handlePieChartGroup = (event, data, dataIndex) => {
    this.setState({ tktByGroup: true, mouseOverData: data[dataIndex] })
  }
  handlePieChartTags = (event, data, dataIndex) => {
    this.setState({ tktByTags: true, mouseOverData: data[dataIndex] })
  }

  render () {
    var tagToalCount = this.state.bookingTagTicketsCount + this.state.disputeTagTicketsCount + this.state.refundTagTicketsCount + this.state.propertyTagTicketsCount +
     this.state.cancellationTagTicketsCount + this.state.accountsTagTicketsCount + this.state.otherTagTicketsCount + this.state.onboardingTicketsCount + this.state.paymentTagTicketsCount

    var ticketsByStatusTotalCount = this.state.newTicketsCount + this.state.openTicketsCount + this.state.inprogressTicketsCount + this.state.resolvedTicketsCount + this.state.escalatedTicketsCount +
    this.state.onHoldTicketsCount + this.state.completedTicketsCount + this.state.closedTicketsCount
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        <div className='container-fluid mt--6'>
          <div className='card mb-2'>
            <div className='card-header'>
              <div className='row'>
                <div className='col-md-9'>
                  <h3 className='mb-0'>{t`lanADLabelTicketsDashBoardShortViews`}</h3>
                </div>
                <div className='col-md-3 text-right'>
                  <div className='form-group' style={{ marginBottom:0 }}>
                    <select className='form-control' id='exampleFormControlSelect1' value={this.state.dateType} onChange={(e) => this.handleDateTypeChange(e)}>
                      <option value='Today'>Current Day</option>
                      <option value='Week'>Current Week</option>
                      <option value='Month'>Current Month</option>
                      <option value='Year'>Current Year</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className='card-body'>
              <div className='row'>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats'>
                    <div className='card-header'>
                      <h5 className='card-title'>{t`lanADLabelTicketsDashBoardTicketsByStatus`}</h5>
                    </div>
                    {/* Card body */}
                    <div className='card-body'>
                      {ticketsByStatusTotalCount !== 0
                     ? <PieChart
                       onMouseOver={(event, data, dataIndex) => this.handlePieChart(data, dataIndex)}
                       onMouseOut={() => this.setState({ tktByStatus: false })}
                       style={{ height:150 }}
                       data={[
                         {
                           value: (this.state.newTicketsCount * 100) /
                          ticketsByStatusTotalCount,
                           key: 1,
                           count: this.state.newTicketsCount,
                           ticketType: 'New',
                           color: '#E38627'
                         },
                         {
                           value: (this.state.openTicketsCount * 100) /
                          ticketsByStatusTotalCount,
                           key: 2,
                           count: this.state.openTicketsCount,
                           ticketType: 'Open',
                           color: '#C13C37'
                         },
                         {
                           value: (this.state.inprogressTicketsCount * 100) /
                          ticketsByStatusTotalCount,
                           key: 3,
                           count: this.state.inprogressTicketsCount,
                           ticketType: 'Inprogress',
                           color: '#6A2135'
                         },
                         {
                           value: (this.state.resolvedTicketsCount * 100) /
                          ticketsByStatusTotalCount,
                           key: 4,
                           count: this.state.resolvedTicketsCount,
                           ticketType: 'Resolved',
                           color: '#DAF7A6'
                         },
                         {
                           value: (this.state.completedTicketsCount * 100) /
                          ticketsByStatusTotalCount,
                           key: 5,
                           count: this.state.completedTicketsCount,
                           ticketType: 'Completed',
                           color: '#c13777'
                         },
                         {
                           value: (this.state.onHoldTicketsCount * 100) /
                          ticketsByStatusTotalCount,
                           key: 6,
                           count: this.state.onHoldTicketsCount,
                           ticketType: 'onhold',
                           color: '#37c13c'
                         },
                         {
                           value: (this.state.escalatedTicketsCount * 100) /
                          ticketsByStatusTotalCount,
                           key: 7,
                           count: this.state.escalatedTicketsCount,
                           ticketType: 'Esclate',
                           color: '#8137c1'
                         },
                         {
                           value: (this.state.closedTicketsCount * 100) /
                          ticketsByStatusTotalCount,
                           key: 8,
                           count: this.state.closedTicketsCount,
                           ticketType: 'Closed',
                           color: '#3c37c1'
                         }
                       ]}
                      />
                      : <PieChart
                        style={{ height:150 }}
                        data={[
                          {
                            value: 100,
                            color: '#eeeeee'
                          }
                        ]}
                      />
                    }
                    </div>
                    {this.state.tktByStatus
                    ? <div className='overlay-div-pie-chart'>
                      <div className='pie-chart-div'>
                        <div className='pie-chart-content'>
                          <p className='text-black'><b className='text-black'>{this.state.mouseOverData.ticketType}({Math.round(this.state.mouseOverData.value)}%) - {this.state.mouseOverData.count}</b></p>
                        </div>
                      </div>
                    </div>
                    : null }
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats'>
                    <div className='card-header'>
                      <h5 className='card-title'>{t`lanADLabelTicketsDashBoardTicketsByAssignees`}</h5>
                    </div>
                    {/* Card body */}
                    <div className='card-body'>
                      {this.state.assignedTicketsCount + this.state.unassignedTicketsCount + this.state.reassignedTicketsCount !== 0
                     ? <PieChart
                       onMouseOver={(event, data, dataIndex) => this.handlePieChartAssain(event, data, dataIndex)}
                       onMouseOut={() => this.setState({ tktByAssain: false })}
                       style={{ height:150 }}
                       data={[
                         {
                           value: (this.state.assignedTicketsCount * 100) / (this.state.assignedTicketsCount + this.state.unassignedTicketsCount + this.state.reassignedTicketsCount),
                           key: 1,
                           color: '#E38627',
                           count: this.state.assignedTicketsCount,
                           ticketType: 'Assigned'
                         },
                         {
                           value: (this.state.unassignedTicketsCount * 100) / (this.state.assignedTicketsCount + this.state.unassignedTicketsCount + this.state.reassignedTicketsCount),
                           key: 2,
                           color: '#C13C37',
                           count: this.state.unassignedTicketsCount,
                           ticketType: 'Unassigned'
                         },
                         {
                           value: (this.state.reassignedTicketsCount * 100) / (this.state.assignedTicketsCount + this.state.unassignedTicketsCount + this.state.reassignedTicketsCount),
                           key: 3,
                           color: '#C13C37',
                           count: this.state.reassignedTicketsCount,
                           ticketType: 'Reassigned'
                         }
                       ]}
                      />
                      : <PieChart
                        style={{ height:150 }}
                        data={[
                          {
                            value: 100,
                            color: '#eeeeee'
                          }
                        ]}
                    />
                      }
                    </div>
                    {this.state.tktByAssain
                    ? <div className='overlay-tkt-by-assignees'>
                      <div className='pie-chart-div'>
                        <div className='pie-chart-content'>
                          <p className='text-black'><b className='text-black'>{this.state.mouseOverData.ticketType}({Math.round(this.state.mouseOverData.value)}%) - {this.state.mouseOverData.count}</b></p>
                        </div>
                      </div>
                    </div>
                    : null }
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats'>
                    <div className='card-header'>
                      <h5 className='card-title'>{t`lanADLabelTicketsDashBoardTicketsByPriorities`}</h5>
                    </div>
                    {/* Card body */}
                    <div className='card-body'>
                      { this.state.lowPriorityTicketsCount + this.state.mediumPriorityTicketsCount + this.state.highPriorityTicketsCount !== 0
                     ? <PieChart
                       onMouseOver={(event, data, dataIndex) => this.handlePieChartPriority(event, data, dataIndex)}
                       onMouseOut={() => this.setState({ tktByPriorities: false })}
                       style={{ height:150 }}
                       data={[
                         {
                           value: (this.state.lowPriorityTicketsCount * 100) / (this.state.lowPriorityTicketsCount + this.state.mediumPriorityTicketsCount + this.state.highPriorityTicketsCount),
                           key: 1,
                           color: '#E38627',
                           count: this.state.lowPriorityTicketsCount,
                           ticketType: 'Low'
                         },
                         {
                           value: (this.state.mediumPriorityTicketsCount * 100) / (this.state.lowPriorityTicketsCount + this.state.mediumPriorityTicketsCount + this.state.highPriorityTicketsCount),
                           key: 2,
                           color: '#C13C37',
                           count: this.state.mediumPriorityTicketsCount,
                           ticketType: 'Medium'
                         },
                         {
                           value: (this.state.highPriorityTicketsCount * 100) / (this.state.lowPriorityTicketsCount + this.state.mediumPriorityTicketsCount + this.state.highPriorityTicketsCount),
                           key: 3,
                           color: '#6A2135',
                           count: this.state.highPriorityTicketsCount,
                           ticketType: 'High'
                         }
                       ]}
                      />
                       : <PieChart
                         style={{ height:150 }}
                         data={[
                           {
                             value: 100,
                             color: '#eeeeee'
                           }
                         ]}
                   />
                      }
                    </div>
                    {this.state.tktByPriorities
                    ? <div className='overlay-tkt-by-assignees'>
                      <div className='pie-chart-div'>
                        <div className='pie-chart-content'>
                          <p className='text-black'><b className='text-black'>{this.state.mouseOverData.ticketType}({Math.round(this.state.mouseOverData.value)}%) - {this.state.mouseOverData.count}</b></p>
                        </div>
                      </div>
                    </div>
                    : null }
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats'>
                    <div className='card-header'>
                      <h5 className='card-title'>{t`lanADLabelTicketsDashBoardTicketsByGroup`}</h5>
                    </div>
                    {/* Card body */}
                    <div className='card-body'>
                      {this.state.marketingTicketsCount + this.state.enduserServicesTicketsCount + this.state.hostServicesTicketsCount !== 0
                      ? <PieChart
                        onMouseOver={(event, data, dataIndex) => this.handlePieChartGroup(event, data, dataIndex)}
                        onMouseOut={() => this.setState({ tktByGroup: false })}
                        style={{ height:150 }}
                        data={[
                          {
                            value: (this.state.marketingTicketsCount * 100) / (this.state.marketingTicketsCount + this.state.enduserServicesTicketsCount + this.state.hostServicesTicketsCount),
                            key: 1,
                            color: '#E38627',
                            count: this.state.marketingTicketsCount,
                            ticketType: 'Marketing'
                          },
                          {
                            value: (this.state.enduserServicesTicketsCount * 100) / (this.state.marketingTicketsCount + this.state.enduserServicesTicketsCount + this.state.hostServicesTicketsCount),
                            key: 2,
                            color: '#C13C37',
                            count: this.state.enduserServicesTicketsCount,
                            ticketType: 'End User Services'
                          },
                          {
                            value: (this.state.hostServicesTicketsCount * 100) / (this.state.marketingTicketsCount + this.state.enduserServicesTicketsCount + this.state.hostServicesTicketsCount),
                            key: 3,
                            color: '#6A2135',
                            count: this.state.hostServicesTicketsCount,
                            ticketType: 'Host Services'
                          }
                        ]}
                      />
                       : <PieChart
                         style={{ height:150 }}
                         data={[
                           {
                             value: 100,
                             color: '#eeeeee'
                           }
                         ]}
                        />
                      }
                    </div>
                    {this.state.tktByGroup
                    ? <div className='overlay-div-pie-chart'>
                      <div className='pie-chart-div'>
                        <div className='pie-chart-content'>
                          <p className='text-black'><b className='text-black'>{this.state.mouseOverData.ticketType}({Math.round(this.state.mouseOverData.value)}%) - {this.state.mouseOverData.count}</b></p>
                        </div>
                      </div>
                    </div>
                    : null }
                  </div>
                </div>
              </div>
              <div className='row mt-4'>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats'>
                    <div className='card-header'>
                      <h5 className='card-title'>{t`lanADLabelTicketsDashBoardTicketsByTags`}</h5>
                    </div>
                    {/* Card body */}
                    <div className='card-body'>
                      {tagToalCount !== 0
                     ? <PieChart
                       onMouseOver={(event, data, dataIndex) => this.handlePieChartTags(event, data, dataIndex)}
                       onMouseOut={() => this.setState({ tktByTags: false })}
                       style={{ height:150 }}
                       data={[
                         {
                           value: (this.state.bookingTagTicketsCount * 100) / (tagToalCount),
                           key: 1,
                           color: '#e327e2',
                           count: this.state.bookingTagTicketsCount,
                           ticketType: 'Booking'
                         },
                         {
                           value: (this.state.disputeTagTicketsCount * 100) / (tagToalCount),
                           key: 2,
                           color: '#27e386',
                           count: this.state.disputeTagTicketsCount,
                           ticketType: 'Dispute'
                         },
                         {
                           value: (this.state.refundTagTicketsCount * 100) / (tagToalCount),
                           key: 3,
                           color: '#6A2135',
                           count: this.state.refundTagTicketsCount,
                           ticketType: 'Refund'
                         },
                         {
                           value: (this.state.propertyTagTicketsCount * 100) / (tagToalCount),
                           key: 4,
                           color: '#E38627',
                           count: this.state.propertyTagTicketsCount,
                           ticketType: 'Property'
                         },
                         {
                           value: (this.state.cancellationTagTicketsCount * 100) / (tagToalCount),
                           key: 5,
                           color: '#C13C37',
                           count: this.state.cancellationTagTicketsCount,
                           ticketType: 'Cancellation'
                         },
                         {
                           value: (this.state.accountsTagTicketsCount * 100) / (tagToalCount),
                           key: 6,
                           color: '#216a56',
                           count: this.state.accountsTagTicketsCount,
                           ticketType: 'Account'
                         },
                         {
                           value: (this.state.otherTagTicketsCount * 100) / (tagToalCount),
                           key: 7,
                           color: '#215a6a',
                           count: this.state.otherTagTicketsCount,
                           ticketType: 'Other'
                         },
                         {
                           value: (this.state.onboardingTicketsCount * 100) / (tagToalCount),
                           key: 8,
                           color: '#0e040b',
                           count: this.state.onboardingTicketsCount,
                           ticketType: 'Onboarding'
                         },
                         {
                           value: (this.state.paymentTagTicketsCount * 100) / (tagToalCount),
                           key: 9,
                           color: '#0e282f',
                           count: this.state.paymentTagTicketsCount,
                           ticketType: 'Payment'
                         }
                       ]}
                      />
                       : <PieChart
                         style={{ height:150 }}
                         data={[
                           {
                             value: 100,
                             color: '#eeeeee'
                           }
                         ]}
                          />
                    }
                    </div>
                    {this.state.tktByTags
                  ? <div className='overlay-div-pie-chart'>
                    <div className='pie-chart-div'>
                      <div className='pie-chart-content'>
                        <p className='text-black'><b className='text-black'>{this.state.mouseOverData.ticketType}({Math.round(this.state.mouseOverData.value)}%)- {this.state.mouseOverData.count}</b></p>
                      </div>
                    </div>
                  </div>
                    : null }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='card mt-4'>
            <div className='card-header'>
              <div className='row'>
                <div className='col-lg-9 col-9'>
                  <h3 className='mb-0'>{t`lanADLabelTicketsDashBoardTicketsView`}</h3>
                </div>
              </div>
            </div>
            <div className='card-body'>
              <div className='row'>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col'>
                          <h5 className='text-uppercase text-muted mb-0'>{t`lanADLabelTicketsDashBoardTotalTickets`}</h5>
                          <span className='h1 font-weight-bold mb-0'>{this.state.totalCount}</span>
                        </div>
                        <div className='col-auto'>
                          <div className='icon icon-shape bg-gradient-red text-white rounded-circle shadow'>
                            <i className='ni ni-active-40' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col'>
                          <h5 className='text-uppercase text-muted mb-0'>{t`lanADLabelTicketsDashBoardTicketsCompleted`}</h5>
                          <span className='h1 font-weight-bold mb-0'>{this.state.completedTicketsCount}</span>
                        </div>
                        <div className='col-auto'>
                          <div className='icon icon-shape bg-gradient-orange text-white rounded-circle shadow'>
                            <i className='ni ni-chart-pie-35' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col'>
                          <h5 className='text-uppercase text-muted mb-0'>{t`lanADLabelTicketsDashBoardTicketsOnHold`}</h5>
                          <span className='h1 font-weight-bold mb-0'>{this.state.onHoldTicketsCount}</span>
                        </div>
                        <div className='col-auto'>
                          <div className='icon icon-shape bg-gradient-green text-white rounded-circle shadow'>
                            <i className='ni ni-money-coins' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col'>
                          <h5 className='text-uppercase text-muted mb-0'>{t`lanADLabelTicketsDashBoardTicketsEscalated`}</h5>
                          <span className='h1 font-weight-bold mb-0'>{this.state.escalatedTicketsCount}</span>
                        </div>
                        <div className='col-auto'>
                          <div className='icon icon-shape bg-gradient-info text-white rounded-circle shadow'>
                            <i className='ni ni-chart-bar-32' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-xl-3 col-md-6'>
                  <div className='card card-stats'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col'>
                          <h5 className='text-uppercase text-muted mb-0'>{t`lanADLabelTicketsDashBoardTicketsClosed`}</h5>
                          <span className='h1 font-weight-bold mb-0'>{this.state.closedTicketsCount}</span>
                        </div>
                        <div className='col-auto'>
                          <div className='icon icon-shape bg-gradient-red text-white rounded-circle shadow'>
                            <i className='ni ni-active-40' />
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
        {/* <FooterComponent /> */}
      </div>
    )
  }
}
export default ADTicketsDashBoardComponent
