/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import './css/FooterStyles.css'

class FooterComponent extends React.Component {
  constructor () {
    super()
    this.state = {
    }
  }

  render () {
    return (
      <div style={{ background: '#ffffff' }}>
        <div className='footer-topper'>{/* jskj */}</div>
        <footer id='footer'>
          <div className='wrapper'>
            <nav id='footer-menu'>
              <ul>
                <li> <a href='/location'>Location</a> </li>
                <li> <a href='/faqs'>FAQs</a> </li>
                <li> <a href='https://blog.com/' target='_blank'>Blog</a> </li>
                <li> <a href='/travel-partners'>Travel Partners</a> </li>
                {/* <li> <a href='/accessibility'>Accessibility</a> </li>
                <li> <a href='/privacy'>Privacy</a> </li> */}
              </ul>
            </nav>
            <div id='social-links'>
              <a className='facebook-i' href='https://www.facebook.com/' target='_blank'><i className='fab fa-facebook-f' /></a>
              <a className='pinterest-i' href='https://www.gmail.com/' target='_blank'><i className='far fa-envelope' /></a>
              <a className='twitter-i' href='https://twitter.com/' target='_blank'><i className='fa fa-twitter' /></a>
              <a className='youtube-i' href='https://www.youtube.com/' target='_blank'><i className='fa fa-youtube-play' /></a>
              <a className='linkedin-i' href='https://www.youtube.com/' target='_blank'><i className='fab fa-linkedin-in' /></a>
            </div>
            <div className='logo-container'>
              <div id='tripadvisor'>
                <p><a href='' className='logo' rel='nofollow' target='_blank' >AM to PM</a>
                  <br />rated '<span>Excellent</span>' by 1,750 Users</p>
              </div>
              {/* /<div className='conde-naste'></div> */}
            </div>
            <div className='footer-info'>
              <p className='address'> <span className='adr'>
                <span className='street-address'>HiTech City, Madhapur </span>, <span className='locality'>Hyderabad </span>, <span className='locality'>Telangana,</span>
                <span className='postal-code'>India-500081</span> </span>
                <span className='contacts'> <span className='email'>Email: <a href='http://ngstek.com'>info@ngstek.com</a>
                </span> | <span className='tel'>Phone: (+91) 8184949596</span> | <span className='tel'>Fax: 704-259-9900 </span> | <span className='tel'>All Other Inquiries: (+91) 8184949596</span> </span>
              </p>
              <p className='copy'> AMtoPM © 2019 - All rights reserved. </p>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}

export default FooterComponent
