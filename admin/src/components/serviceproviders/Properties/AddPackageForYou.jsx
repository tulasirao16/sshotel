/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { hashHistory } from 'react-router'
import 'react-drawer/lib/react-drawer.css'
import DrawerWithHeader from '../Drawer/DrawerComponent'
import FooterComponent from '../FooterCompnt/Footer'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

class AddPackageForYou extends React.Component {
  constructor () {
    super()
    this.state = {
      open: false,
      position: 'left',
      noOverlay: true
    }
    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.onDrawerClose = this.onDrawerClose.bind(this)
    this.setPosition = this.setPosition.bind(this)
    this.setNoOverlay = this.setNoOverlay.bind(this)
    this.handleAddManually = this.handleAddManually.bind(this)
    this.handleSupport = this.handleSupport.bind(this)
  }
  setPosition (e) {
    this.setState({ position: e.target.value })
  }
  setNoOverlay (e) {
    this.setState({ noOverlay: e.target.checked })
  }
  toggleDrawer () {
    this.setState({ open: !this.state.open })
  }
  closeDrawer () {
    this.setState({ open: false })
  }
  onDrawerClose () {
    this.setState({ open: false })
  }

  handleAddManually (event) {
    hashHistory.push('/AddProperty')
    event.preventDefault()
  }
  handleSupport () {
    hashHistory.push('/host/support')
    event.preventDefault()
  }
  render () {
    return (
      <div className='main-content' id='panel'>
        {/* ------- Navbar --------- */}
        <DrawerWithHeader />
        <div className='header bg-primary pb-6'>
          <div className='container'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>Add Packages Fit For You</h6>
                </div>
              </div>
              {/* Card stats */}
              <div className='row'>
                <div className='col-xl-3 col-md-6'>
                  <div className='card '>
                    {/* Card body */}
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col'>
                          {/* <h5 className='card-title text-uppercase text-muted mb-0'>Total traffic</h5> */}
                          {/* <span className='icon-bed'><i className='fas fa-bed'/></span> */}
                          <img src={require('../images/icon-1.png')} className='icon-one' />
                        </div>
                        <div className='col-auto'>
                          <div className='icon icon-shape bg-gradient-red text-white rounded-circle shadow'>
                            {/* <i className='ni ni-active-40' /> */}
                            <span className='h1 font-weight-bold mb-0 text-white'>S</span>
                          </div>
                        </div>
                      </div>
                      <p className='mt-3 mb-0 text-sm'>
                        <span className='h3 mb-0'>Bed and Breakfast</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card '>
                    {/*  Card body */}
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col'>
                          <img src={require('../images/icon-2.png')} className='icon-two' />
                        </div>
                        <div className='col-auto'>
                          <div className='icon icon-shape bg-gradient-orange text-white rounded-circle shadow'>
                            <span className='h1 font-weight-bold mb-0 text-white'>P</span>
                          </div>
                        </div>
                      </div>
                      <p className='mt-3 mb-0 text-sm'>
                        <span className='h3 mb-0'>Bed and Breakfast</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card '>
                    {/* Card body */}
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col'>
                          {/* <h5 className='card-title text-uppercase text-muted mb-0'>Total traffic</h5> */}
                          {/* <span className='icon-bed'><i className='fas fa-bed'/></span> */}
                          <img src={require('../images/icon-1.png')} className='icon-one' />
                        </div>
                        <div className='col-auto'>
                          <div className='icon icon-shape bg-gradient-red text-white rounded-circle shadow'>
                            {/* <i className='ni ni-active-40' /> */}
                            <span className='h1 font-weight-bold mb-0 text-white'>S</span>
                          </div>
                        </div>
                      </div>
                      <p className='mt-3 mb-0 text-sm'>
                        <span className='h3 mb-0'>Bed and Breakfast</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6'>
                  <div className='card '>
                    {/*  Card body */}
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col'>
                          <img src={require('../images/icon-2.png')} className='icon-two' />
                        </div>
                        <div className='col-auto'>
                          <div className='icon icon-shape bg-gradient-orange text-white rounded-circle shadow'>
                            <span className='h1 font-weight-bold mb-0 text-white'>P</span>
                          </div>
                        </div>
                      </div>
                      <p className='mt-3 mb-0 text-sm'>
                        <span className='h3 mb-0'>Bed and Breakfast</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container mt--6 pb-5'>
          {/* Card stats */}
          <div className='row'>
            <div className='col-xl-3 col-md-6'>
              <div className='card '>
                {/* Card body */}
                <div className='card-body'>
                  <div className='row'>
                    <div className='col'>
                      <img src={require('../images/icon-3.png')} className='icon-three' />
                    </div>
                    <div className='col-auto'>
                      <div className='icon icon-shape bg-gradient-red text-white rounded-circle shadow'>
                        {/* <i className='ni ni-active-40' /> */}
                        <span className='h1 font-weight-bold mb-0 text-white'>S</span>
                      </div>
                    </div>
                  </div>
                  <p className='mt-3 mb-0 text-sm'>
                    <span className='h3 mb-0'>1BH + Parking</span>
                  </p>
                </div>
              </div>
            </div>
            <div className='col-xl-3 col-md-6'>
              <div className='card '>
                {/*  Card body */}
                <div className='card-body'>
                  <div className='row'>
                    <div className='col'>
                      <img src={require('../images/icon-4.png')} className='icon-four' />
                    </div>
                    <div className='col-auto'>
                      <div className='icon icon-shape bg-gradient-orange text-white rounded-circle shadow'>
                        <span className='h1 font-weight-bold mb-0 text-white'>P</span>
                      </div>
                    </div>
                  </div>
                  <p className='mt-3 mb-0 text-sm'>
                    <span className='h3 mb-0'>Appartment + Parking</span>
                  </p>
                </div>
              </div>
            </div>
            <div className='col-xl-3 col-md-6'>
              <div className='card '>
                {/* Card body */}
                <div className='card-body'>
                  <div className='row'>
                    <div className='col'>
                      <img src={require('../images/icon-3.png')} className='icon-three' />
                    </div>
                    <div className='col-auto'>
                      <div className='icon icon-shape bg-gradient-red text-white rounded-circle shadow'>
                        {/* <i className='ni ni-active-40' /> */}
                        <span className='h1 font-weight-bold mb-0 text-white'>S</span>
                      </div>
                    </div>
                  </div>
                  <p className='mt-3 mb-0 text-sm'>
                    <span className='h3 mb-0'>1BH + Parking</span>
                  </p>
                </div>
              </div>
            </div>
            <div className='col-xl-3 col-md-6'>
              <div className='card bg-gradient-default border-0 text-center'>
                {/*  Card body */}
                <div className='card-body'>
                  <div className='row'>
                    <div className='col'>
                      <a href='#' onClick={this.handleAddManually}><i className='fas fa-plus-circle icon-plus' /></a>
                    </div>
                  </div>
                  <p className='mt-3 mb-0 text-sm'>
                    <a href='#' onClick={this.handleAddManually}><span className='h3 mb-0 text-white'>Add Another Property</span></a>
                  </p>
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

export default AddPackageForYou
