/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import DrawerWithHeader from '../Drawer/DrawerComponent'
import FooterComponent from '../FooterCompnt/Footer'
import 'react-drawer/lib/react-drawer.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
class AddDiscounts extends React.Component {
  constructor () {
    super()
    this.state = {
    }
    this.handleAddOffers = this.handleAddOffers.bind(this)
  }
  handleAddOffers (event) {
    hashHistory.push('/AddOffers')
    event.preventDefault()
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        <DrawerWithHeader />
        {/* ---------- Header Starts ------------- */}
        <div className='header bg-primary pb-6'>
          <div className='container'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanSPLabelAddProperty`}</h6>
                </div>
                <div className='col-lg-6 col-5 text-right'>
                  <a href='#' className='btn btn-neutral'>{t`lanSPLabelViewPreviousDiscounts`}</a>
                </div>
              </div>
            </div>
          </div>
        </div>{/* ---------- Header Starts ------------- */}
        <div className='container mt--6'>
          <div>
            <div className='card'>
              <div className='card-header'>
                <h3 className='mb-0'>{t`lanSPLabelAddDiscounts`}</h3>
              </div>
              <div className='card-body'>
                <form>
                  <div className='form-group row'>
                    <label className='col-md-2 col-form-label form-control-label'>{t`lanSPLabelAddTitle`}</label>
                    <div className='col-md-3'>
                      <input type='text' className='form-control' required='' />
                    </div>
                  </div>
                  <div className='form-group row'>
                    <label className='col-md-2 col-form-label form-control-label'>{t`lanSPLabelPricePercentage`}</label>
                    <div className='col-md-3'>
                      <input className='form-control' type='text' id='example-text-input' />
                    </div>
                  </div>
                  <div className='form-group row'>
                    <label className='col-md-2 col-form-label form-control-label'>{t`lanSPLabelMinimumNights`}</label>
                    <div className='col-md-10'>
                      <div className='row'>
                        <div className='col-md-3'>
                          <div className='row mt-2'>
                            <div className='col-md-4 col-auto page-item'>
                              <a href='#' className='page-link'><i className='fas fa-minus' /></a>
                            </div>
                            <div className='col-md-3 col-auto'>
                              <p className='text-center'>1</p>
                            </div>
                            <div className='col-md-4 col-auto page-item'>
                              <a href='#' className='page-link'><i className='fas fa-plus' /></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='form-group row'>
                    <label className='col-md-2 col-form-label form-control-label'>{t`lanSPLabelApplyDates`}</label>
                    <div className='col-md-3'>
                      <select className='form-control' id='exampleFormControlSelect1'>
                        <option>All days</option>
                        <option>only weekends</option>
                        <option>only week days</option>
                        <option>Block dates</option>
                      </select>
                    </div>
                  </div>
                  <div className='form-group row mt-5'>
                    <div className='col-md-2 col-auto page-item active mt-2'>
                      <a href='#' className='page-link'><i className='fas fa-chevron-left' /></a>
                    </div>
                    <div className='col-md-3 col-auto'>
                      <button className='btn btn-primary' onClick={this.handleAddOffers} type='submit'>{t`lanSPButtonNext`}</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <FooterComponent />
      </div>
    )
  }
}
export default AddDiscounts
