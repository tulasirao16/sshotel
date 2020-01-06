/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { t } from 'ttag'
// import moment from 'moment'
import Pagination from 'react-js-pagination'
import 'react-drawer/lib/react-drawer.css'
import Modal from 'react-modal'
import classnames from 'classnames'
import './css/InboxCss.css'
import { hashHistory } from 'react-router'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
}

class InboxEachChatComponent extends React.Component {
  constructor () {
    super()
    this.state = {
      inboxListData: [],
      activePage: 1,
      searchString: '',
      totalCount: 0,
      deleteData: {},
      isMessageList: true,
      modalIsOpen: false,
      reload: false,
      delete: false,
      deleteMessage: false
    }
    this.handleHome = this.handleHome.bind(this)
    this.handleDelete = this.handleDelete.bind()
  }

  handleHome (event) {
    hashHistory.push('/hotels')
    event.preventDefault()
  }
  handleDelete () {
    this.setState({
      deleteMessage:true
    })
  }
  render () {
    return (
      <div>
        <div className='enduser-inbox-list'>
          <div className='header bg-primary pb-6'>
            <div className='container-fluid'>
              <div className='header-body'>
                <div className='row align-items-center pt-7 pb-5'>
                  <div className='col-lg-6 col-7'>
                    {/* <h6 className='h2 text-white d-inline-block mb-0'>{t`lanEUTitleInbox`}</h6> */}
                    <nav aria-label='breadcrumb eu eu-font' className='d-md-inline-block ml-md-4'>
                      <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                        <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                        <li className='breadcrumb-item active eu-font' aria-current='page'><a >{t`lanEUTitleInbox`}</a></li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container  mt--6 pb-4'>
            <div className='row justify-content-center inbox'>
              <div className='col-12'>
                <div className='card mb-2'>
                  <div className='card-header py-2'>
                    <div className='row '>
                      <div className='col-sm-7'>
                        <h6 className='h2 text-primary d-inline-block pt-2'> chat</h6>
                      </div>
                      <div className='col-sm-5'>
                        {/* -- Search form -- */}
                        <form>
                          <div className='form-group mb-0'>
                            <div className='input-group input-group-lg input-group-flush'>
                              <div className='input-group-prepend'>
                                <div className='input-group-text'>
                                  <span className='fas fa-search' />
                                </div>
                              </div>
                              <input type='search' className='form-control' placeholder='Search' />
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className='card-body'>
                    <section className='eu-inbox'>
                      <div className='row clearfix'>
                        <div className='col-md-3 col-lg-3 col-xl-3 inbox-list-tab'>
                          <div className='sp-list-div'>
                            <div className='list-group list-group-flush'>
                              <a className='list-group-item list-group-item-action'>
                                <div className='row align-items-center'>
                                  <div className='col-3 p-0'>
                                    <img alt='Image placeholder' src={require('../../../../assets/rm4.jpg')} className='avatar rounded-circle' />
                                  </div>
                                  <div className='col ml--2'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                      <div>
                                        <h4 className='mb-0 text-sm'>{t`lanEULabelJohnSnow`}</h4>
                                      </div>
                                      <div className='text-right text-muted'>
                                        <small>{t`lanEULabelHrsAgo`}</small>
                                      </div>
                                    </div>
                                    <p className='text-sm mb-0 noOfLines'>{t`lanEULabelLetMeetAtStarbucksAtWdyt`}</p>
                                  </div>
                                </div>
                              </a>
                              <a className='list-group-item list-group-item-action'>
                                <div className='row align-items-center'>
                                  <div className='col-3 p-0'>
                                    <img alt='Image placeholder' src={require('../../../../assets/rm4.jpg')} className='avatar rounded-circle' />
                                  </div>
                                  <div className='col ml--2'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                      <div>
                                        <h4 className='mb-0 text-sm'>{t`lanEULabelJohnSnow`}</h4>
                                      </div>
                                      <div className='text-right text-muted'>
                                        <small>{t`lanEULabelHrsAgo`}</small>
                                      </div>
                                    </div>
                                    <p className='text-sm mb-0 noOfLines'>{t`lanEULabelLetMeetAtStarbucksAtWdyt`}</p>
                                  </div>
                                </div>
                              </a>
                              <a className='list-group-item list-group-item-action'>
                                <div className='row align-items-center'>
                                  <div className='col-3 p-0'>
                                    <img alt='Image placeholder' src={require('../../../../assets/rm4.jpg')} className='avatar rounded-circle' />
                                  </div>
                                  <div className='col ml--2'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                      <div>
                                        <h4 className='mb-0 text-sm'>{t`lanEULabelJohnSnow`}</h4>
                                      </div>
                                      <div className='text-right text-muted'>
                                        <small>{t`lanEULabelHrsAgo`}</small>
                                      </div>
                                    </div>
                                    <p className='text-sm mb-0 noOfLines'>{t`lanEULabelLetMeetAtStarbucksAtWdyt`}</p>
                                  </div>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className='col-md-9 col-lg-9 col-xl-9 col-12'>
                          <div className='card-body'>
                            <div className={classnames('row justify-content-start ', { 'delete-selected' : this.state.deleteMessage })}>
                              <div className='col-sm-7 py-2'>
                                <a onClick={this.handleDelete}>    
                                  <div className='sp-message bg-sp p-2 px-3 rounded-right' >
                                    <div className='d-flex justify-content-between '>
                                      <p className='sp-Text-property-title text-left mb-0'>{t`lanEULabelRachakondaGrandHotels`} {this.state.deleteMessage}</p>
                                      <p className='sp-Text-property-title text-right mb-0'>{t`lanEULabelyesterday`}</p>
                                    </div>
                                    <p className='sp-Text-message mb-0'>{t`lanEULabelAreaCity`}</p>
                                    <p className='sp-Text-message mb-0'>{t`lanEULabelIWantToPickUpAndDropCanUProvideNow`}</p>
                                  </div>
                                </a>
                              </div>
                            </div>
                            <div className='row justify-content-end'>
                              <div className='col-sm-7 py-2'>
                                <div className='eu-message bg-eu p-2 px-3 rounded-left'>
                                  <div className='d-flex justify-content-between '>
                                    <p className='eu-Text-property-title text-left mb-0'>{t`lanEULabelYou`}</p>
                                    <p className='eu-Text-property-title text-right mb-0'>{t`lanEULabelAm`}</p>
                                  </div>
                                  <p className='eu-Text-message mb-0'>{t`lanEULabelIWantToPickUpAndDropCanUProvideNow`}</p>
                                </div>
                              </div>
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
        </div>
        <Modal style={customStyles}>
          <div className='container modalOne'>
            <div className='row my-2'>
              <div className='col-sm-12 text-right'>
                <a onClick={this.closeModal} ><i className='fas fa-times' /> </a>
              </div>
              <div className='col-sm-12 m-3'>
                <p>{t`lanCommonLabelDeleteNote`}</p>
              </div>
            </div>
            <div className='row my-3'>
              <div className='col-sm-12 text-center'>
                <button className='btn btn-primary mr-2' onClick={this.handleConfirmDeleteMessage}>{t`lanCommonButtonConfirm`}</button>
                <button className='btn btn-danger' onClick={this.closeModal}>{t`lanCommonButtonCancel`}</button>
              </div>
            </div>
          </div>
        </Modal>
      </div>

    )
  }
}

export default InboxEachChatComponent
