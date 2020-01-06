/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
// import { hashHistory } from 'react-router'
// import APICallManager from '../../../services/callmanager'
// import config from '../../../../public/config.json'
// import { t } from 'ttag'
import './Css/HotelsListItemView.css'
// import MainHeader from '../HeaderCompnt/MainHeader'
// import FooterComponent from '../FooterCompnt/Footer'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
// import classnames from 'classnames'

export default class PropertyGalleryPage extends React.Component {
  constructor () {
    super()
    this.state = {
      sliderImages:[
            { maximg:require('../../../../assets/hero_big_32.jpg') },
            { maximg:require('../../../../assets/hero_big_31.jpg') },
            { maximg:require('../../../../assets/hero_big_30.jpg') },
            { maximg:require('../../../../assets/hero_big_29.jpg') },
            { maximg:require('../../../../assets/hero_big_28.jpg') },
            { maximg:require('../../../../assets/rm6.jpg') },
            { maximg:require('../../../../assets/property_big_01.jpg') },
            { maximg:require('../../../../assets/hero_big_32.jpg') },
            { maximg:require('../../../../assets/hero_big_31.jpg') },
            { maximg:require('../../../../assets/hero_big_30.jpg') },
            { maximg:require('../../../../assets/hero_big_29.jpg') },
            { maximg:require('../../../../assets/hero_big_28.jpg') },
            { maximg:require('../../../../assets/rm6.jpg') },
            { maximg:require('../../../../assets/property_big_01.jpg') }
      ]
    }
  }
  render () {
    return (
      <div className='white-bg' style={{ backgroundColor:'#ffffff' }}>
        <div id='page-wrapper ' >
          <div className='container'>
            <div className='row'>
              <div className='col-sm-11'>
                <div className='card' >
                  <div className='card-body'>
                    <Carousel className='' axis='horizontal' verticalSwipe='standard' infiniteLoop
                      useKeyboardArrows dynamicHeight showArrows autoPlay onChange={this.onChange} onClickItem={this.onClickItem} onClickThumb={this.onClickThumb}>
                      {this.state.sliderImages.map((item, i) =>
                        <div className='slide-1' key={i}>
                          <img src={item.maximg} />
                        </div>
                      )}
                    </Carousel>
                  </div>
                </div>
              </div>
              <div className='col-sm-4'>
                <a onClick={this.handleBack} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
