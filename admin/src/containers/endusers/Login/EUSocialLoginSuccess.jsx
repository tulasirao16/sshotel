/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import axios from 'axios'
import { hashHistory } from 'react-router'
import PropTypes from 'prop-types'

import '../../../components/endusers/Login/Css/EULogin.css'
import MainHeader from '../../../components/endusers/HeaderCompnt/MainHeader'
import APICallManager from '../../../services/callmanager'
import config from '../../../../public/config.json'

const myApi = axios.create()

class EUSocialLoginSuccess extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount () {
    let accessToken = this.props && this.props.params ? this.props.params.accessToken : ''
    let loginToken = this.props && this.props.params ? this.props.params.id : ''
    myApi.defaults.headers.token = loginToken
    localStorage.setItem('token', loginToken)
    let obj = { url: config.baseUrl + config.postEUUserSocialLoginAPI, body: { 'accessToken': accessToken } }
    APICallManager.postCall(obj, function (resObj) {
      if (resObj.data.statusCode === '0000') {
        localStorage.setItem('authObj', JSON.stringify(resObj.data.statusResult))
      } else {
        localStorage.removeItem('token')
        myApi.defaults.headers.token = null
      }
      hashHistory.push('/hotels')
    })
  }
  render () {
    return (
      <div className='body-main' style={{ fontFamily: 'Lato' }}>
        {/* ------- Navbar --------- */}
        <MainHeader />
        <div className='main-content' id='panel'>
          {/* -------- Heaer ---------- */}
          <div className='header py-8 py-lg-7 pt-lg-9 home-header'>
            <div className='separator separator-bottom separator-skew zindex-100'>
              <svg x='0' y='0' viewBox='0 0 2560 100' preserveAspectRatio='none' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                <polygon className='fill-default' points='2560 0 2560 100 0 100' />
              </svg>
            </div>
          </div>
          <div className='container pb-5 content'>
            <div className='row justify-content-center'>
              <div className='col-lg-5 col-md-7 text-center'>
                <div className='card border-0 mb-0'>
                  <div className='card-header bg-transparent pb-3'>
                    <h5 className='card-title' style={{ fontSize: 19 }}>Login Success</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className='footer-main mt-5'>
            <div className='container'>
              <div className='row align-items-center justify-content-lg-between'>
                <div className='col-lg-6'>
                  <div className='copyright text-center text-lg-left'>AMtoPM © 2019 - All rights reserved.</div>
                </div>
                <div className='col-lg-6'>
                  <ul className='nav nav-footer justify-content-center justify-content-lg-end'>
                    <li className='nav-item'>
                      <a href='#' className='nav-link' target='_blank'>About</a>
                    </li>
                    <li className='nav-item'>
                      <a href='#' className='nav-link' target='_blank'>Terms & Conditions</a>
                    </li>
                    <li className='nav-item'>
                      <a href='#' className='nav-link' target='_blank'>Privacy Policy</a>
                    </li>
                    <li className='nav-item'>
                      <a href='#' className='nav-link' target='_blank'>Site map</a>
                    </li>
                    <li className='nav-item'>
                      <a href='#' className='nav-link' target='_blank'>Trust & Safety</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    )
  }
}

EUSocialLoginSuccess.propTypes = {
  params: PropTypes.any
}
export default EUSocialLoginSuccess
