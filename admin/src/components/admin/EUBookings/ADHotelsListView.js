import React from 'react'
import { hashHistory } from 'react-router'
import { t } from 'ttag'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'

import ADHotelEachRowList from './ADHotelsEachRowList'
import './Css/ADHotelsList.css'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}
class ADHotelsListView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      authObj: {},
      favouritesData: [],
      totalCount: 0,
      activePage: 1,
      searchString: '',
      isFavourite: true,
      favouriteProperties: [],
      spPropertyIDs: [],
      spPropertyInfo: [],
      SPPropertyList: (this.props.SPPropertyList && this.props.SPPropertyList.length) ? this.props.SPPropertyList : []
    }
    this.handleHotelListItemView = this.handleHotelListItemView.bind(this)
    this.handleListView = this.handleListView.bind(this)
    this.handleMapView = this.handleMapView.bind(this)
    this.handleHotelList = this.handleHotelList.bind(this)
    this.handleFavouriteProperty = this.handleFavouriteProperty.bind(this)
    this.handleCompare = this.handleCompare.bind(this)
    this.handleComparePopup = this.handleComparePopup.bind(this)
    this.handleComparePage = this.handleComparePage.bind(this)
  }

  componentWillMount () {
    this.setState({ SPPropertyList: this.props.SPPropertyList })
    let authObj = JSON.parse(localStorage.getItem('authObj'))
    if (authObj && authObj.preferences) {
      let favouriteProperties = (authObj && authObj.preferences && authObj.preferences.favouriteProperties) ? authObj.preferences.favouriteProperties : []
      this.setState({ authObj: authObj, favouriteProperties: favouriteProperties })
    }
  }
  async componentWillReceiveProps (newProps) {
    this.setState({ SPPropertyList: newProps.SPPropertyList })
  }
  handleHotelListItemView (data) {
    localStorage.setItem('EUPropertyInfoData', JSON.stringify(data))
    hashHistory.push('/admin/eu/booking')
    event.preventDefault()
  }
  handleListView () {
    hashHistory.push('/hotels/listView')
    event.preventDefault()
  }
  handleMapView () {
    hashHistory.push('/hotels/mapView')
    event.preventDefault()
  }
  handleHotelList () {
    hashHistory.push('/hotels')
    event.preventDefault()
  }
  handleCompare (item) {
    let info = this.state.spPropertyInfo
    let infoIDs = this.state.spPropertyIDs
    let i = infoIDs.indexOf(item._id)
    if (i === -1) {
      if (infoIDs.length >= 3) {
        ToastsStore.error('lanEULabelErrorCompareHostsLimit')
      } else {
        infoIDs.push(item._id)
        info.push(item)
      }
    } else {
      infoIDs.splice(i, 1)
      info.splice(i, 1)
    }
    this.setState({ spPropertyIDs: infoIDs, spPropertyInfo: info })
    this.handleComparePopup()
  }
  handleComparePopup () {
    if (this.state.spPropertyIDs.length > 1 && this.state.spPropertyIDs.length <= 3) {
      this.setState({ compareModalIsOpen: true })
    } else if (this.state.spPropertyIDs.length === 1) {
      this.setState({ compareModalIsOpen: true })
    } else {
      this.setState({ compareModalIsOpen: false })
    }
  }
  handleComparePage () {
    localStorage.setItem('spPropertyIDs', JSON.stringify(this.state.spPropertyIDs))
    localStorage.setItem('spPropertyInfo', JSON.stringify(this.state.spPropertyInfo))
    hashHistory.push('/properties/compare')
  }
  handleFavouriteProperty (favProperties, newAuthObj) {
    this.setState({ favouriteProperties: favProperties, authObj: newAuthObj })
    this.props.handleFavouriteProperty(favProperties, newAuthObj)
  }
  render () {
    return (
      <div id='page-wrapper'>
        <main role='main' className='inner cover'>
          {/* =================== filter section =========================== */}
          <div className='album py-5 bg-light'>
            <div className='container'>
              <div className='row'>
                <div className='col-lg-12 col-xs-12 text-center only-list' >
                  <div className='switch-view-controller'>
                    <a onClick={this.props.handleListView} className='item'>
                      <i className='fas fa-th' />
                      <span>List</span>
                    </a>
                    <a onClick={this.props.handleHotelList} id='both-trigger' className='item active hidden-mobile'>
                      <i className='far fa-object-group' />
                      <span>Both</span>
                    </a>

                    <a onClick={this.props.handleMapView} id='only-map-trigger' className='item'>
                      <i className='fas fa-map-marker-alt' />
                      <span>Map</span>
                    </a>

                    <a href='' className='modal-trigger item hidden-desktop hidden-large-desktop'
                      data-trigger-for='menu02'>
                      <i className='icon icon-filter' />
                      <span>Filters</span>
                    </a>
                  </div>
                </div>

                {this.state.SPPropertyList.length > 0
                  ? this.state.SPPropertyList.map((item, i) =>
                    <ADHotelEachRowList key={i} data={item} authObj={this.state.authObj} favouriteProperties={this.state.favouriteProperties}
                      handleFavouriteProperty={this.handleFavouriteProperty} handleCompare={this.handleCompare} spPropertyIDs={this.state.spPropertyIDs} />)
                : <div>{t`lanCommonLabelNoResultsFound`}</div>
                }
              </div> {/* row end */}
            </div> {/* container end */}
          </div>
        </main>
        <Modal
          isOpen={this.state.compareModalIsOpen}
          style={customStyles}
          ariaHideApp={false}
        >
          <div>
            {this.state.spPropertyInfo && this.state.spPropertyInfo.length > 0 ? this.state.spPropertyInfo.map((item, i) =>
              <div key={i}>
                {item.propertyTitle}
              </div>
            ) : null}
          </div>
          {this.state.spPropertyIDs.length < 3
            ? <div>
              <button onClick={() => this.setState({ compareModalIsOpen: false })}>{t`lanEUButtonAddHotelsToCompare`}</button>
            </div> : null}
          {this.state.spPropertyIDs.length === 1
            ? null
            : <div>
              <button onClick={this.handleComparePage}>{t`lanEUButtonCompare`}</button>
            </div>
          }
        </Modal>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
      </div>
    )
  }
}
ADHotelsListView.propTypes = {
  // handleCompare: PropTypes.func,
  // favouriteProperties: PropTypes.any,
  handleFavouriteProperty :PropTypes.func,
  // authObj: PropTypes.any,
  // spPropertyIDs: PropTypes.any,
  // data: PropTypes.any,
  SPPropertyList: PropTypes.any,
  handleListView: PropTypes.any,
  handleHotelList: PropTypes.any,
  handleMapView: PropTypes.func
}
export default ADHotelsListView
