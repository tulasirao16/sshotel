/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts'
import config from '../../../../public/config.json'

export default class EUMobileFBLogin extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true
    }
  }
  componentWillMount () {
    this.handleFacebookLogin()
  }
  handleFacebookLogin () {
    var input = navigator.onLine
    if (input) {
      window.location.href = config.baseUrl + config.getEUUserSocialFacebookLoginAPI
    } else {
      ToastsStore.error('You are disconnected from internet')
    }
  }
  render () {
    return (
      <div style={{ position: 'absolute', top:0, bottom:0, left:0, right:0, background: 'rgba(0,0,0, .5)', width: '100vw', height: '100vh' }}>
        <div className='row justify-content-center'>
          <div className='col-sm-12 text-center mt-7'>
            <img src={require('../../../../assets/logo-white.png')} width='150' height='50' />
            <br />
            <h1>Redirecting to facebook...</h1>
            <br />
            <i className='fa fa-spinner' style={{ color: 'white', fontSize: '30' }} />
            <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
          </div>
        </div>
      </div>
    )
  }
}
