import React from 'react'
import { t } from 'ttag'
import { hashHistory } from 'react-router'
import Amenities from '../../../../assets/amenities/amenities.json'
import config from '../../../../public/config.json'
import APICallManager from '../../../services/callmanager'
// import './Css/compare.css'

class ADEUSPPropertyCompareComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      allAmenities: [],
      spPropertyIds: [],
      spPropertyInfo: JSON.parse(localStorage.getItem('spPropertyInfo')),
      conditionValue: localStorage.getItem('backHome'),
      reload: false
    }
    this.handleRemove = this.handleRemove.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleBookNow = this.handleBookNow.bind(this)
  }
  componentWillMount () {
    let ids = JSON.parse(localStorage.getItem('spPropertyIDs'))
    this.setState({ spPropertyIds: ids })
    let postJson = {
      compareIDS: ids
    }
    let obj = { url: config.baseUrl + config.getEUPropertiesCompareAPI, body: postJson }
    let _this = this
    APICallManager.postCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        _this.setState({ allAmenities: resObj.data.statusResult })
      } else {
        _this.setState({ allAmenities: [] })
      }
    })
  }
  handleRemove (item) {
    let ids = this.state.spPropertyIds
    let infoObj = this.state.spPropertyInfo
    let i = ids.indexOf(item._id)
    if (i !== -1) {
      ids.splice(i, 1)
      infoObj.splice(i, 1)
      let obj = { url: config.baseUrl + config.getEUPropertiesCompareAPI, body: { compareIDS: ids } }
      this.setState({ reload: true })
      let _this = this
      APICallManager.postCall(obj, function (resObj) {
        if (resObj.data.statusCode === '0000') {
          _this.setState({ allAmenities: resObj.data.statusResult, spPropertyIds: ids, spPropertyInfo: infoObj, reload: false })
        } else {
          _this.setState({ allAmenities: [], reload: false })
        }
      })
    }
  }
  handleBack () {
    hashHistory.push('/admin/eu/home')
  }
  handleBookNow (info) {
    localStorage.setItem('EUPropertyInfoData', JSON.stringify(info))
    hashHistory.push('/admin/eu/booking')
  }
  render () {
    return (
      <div className='enduser' style={{ fontFamily: 'Lato' }}>
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center pt-2 pb-2'>
                <div className='col-lg-6 col-7'>
                  {/* <h6 className='h2 text-white d-inline-block mb-0'>{t`lanEUTitleInbox`}</h6> */}
                  <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleBack}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item active eu-font' aria-current='page'><a>{t`lanEUTitleCompareHost`}</a></li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container  mt--6 pb-4'>
          <div className='row justify-content-center inbox'>
            <div className='col-md-12'>
              <div className='card'>
                <div className='card-header py-2'>
                  <div className='row '>
                    <div className='col-sm-7'>
                      <h6 className='h2 text-primary d-inline-block pt-2'>{t`lanEUTitleCompareHost`}</h6>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-lg-3 col-sm-3 col-xs-12 '>
                      <p className='card-category'>{t`lanEULabelCompareHostsLimit`}</p>
                    </div>
                    {this.state.spPropertyInfo.map((item, i) =>
                      <div className='col-lg-3 col-sm-3 col-xs-12 text-center' key={i}>
                        <div className='host-box'>
                          <p className='card-category'>
                            {item.spPropertyInfoId && item.spPropertyInfoId.propertyTitle ? item.spPropertyInfoId.propertyTitle : item.propertyTitle}
                            <span className='close-host text-danger pl-2'><a onClick={() => this.handleRemove(item)}> <i className='fas fa-times' /></a></span></p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='card-body'>
                  <table className='table table-bordered text-center'>
                    <thead>
                      <tr>
                        <th scope='col'>{t`lanEUTitleAmenities`}</th>
                        {this.state.spPropertyInfo.map((item, i) =>
                          <th scope='col' key={i}>{item.spPropertyInfoId && item.spPropertyInfoId.propertyTitle ? item.spPropertyInfoId.propertyTitle : item.propertyTitle}</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {Amenities.map((item, i) => {
                        let amenities = this.state.allAmenities.filter(amenities => amenities.amenityName === item.name)
                        return (
                          <tr key={i}>
                            <td scope='row'>
                              <div className='compare-img'>
                                <img src={item && item.amenityIconPath ? config.baseUrl + item.amenityIconPath : require('../../../../assets/compare/icon8.png')} className='img-fluidCompareIcons img-rounded' />
                              </div>
                            </td>
                            {amenities.map((data, i) => {
                              return (
                                <td key={i}>
                                  {data.amenityStatus === 'Available'
                                    ? <div><i className='fas fa-check' style={{ fontSize: 20, color: 'green' }} /></div>
                                    : <div><i className='fas fa-times-circle' style={{ fontSize: 20, color: 'red' }} /></div>
                                  }
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })
                      }
                      <tr>
                        <td>
                          <div className='row'>
                            <div className='col-sm-12 text-center' >
                              <a className='btn btn-danger text-white' onClick={this.handleBack}>{t`lanCommonButtonBack`}</a>
                            </div>
                          </div>
                        </td>
                        {this.state.spPropertyInfo && this.state.spPropertyInfo.length > 0 ? this.state.spPropertyInfo.map((info, i) =>
                          <td key={i}>
                            <div className=' row'>
                              <div className='col-sm-12 text-center' >
                                <a className='btn btn-primary text-white' onClick={() => this.handleBookNow(info)}>{t`lanEUButtonBookNow`}</a>
                              </div>
                            </div>
                          </td>
                        ) : null}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ADEUSPPropertyCompareComponent
