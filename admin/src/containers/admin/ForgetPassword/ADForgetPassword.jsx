import React from 'react'
import 'react-drawer/lib/react-drawer.css'

import HeaderComponent from '../../../components/admin/Header/Header'
import FooterComponent from '../../../components/admin/footer/Footer'
import ADForgetPasswordComponent from '../../../components/admin/forget/ADForgetPasswordComponent'

class ADForgetPassword extends React.Component {
  constructor () {
    super()
    this.state = {
    }
  }

  render () {
    return (
      <div className='body-main'>
        <HeaderComponent />
        <ADForgetPasswordComponent />
        <div className='admin-main-content' id='panel'>
          <FooterComponent />
        </div>
      </div>
    )
  }
}

export default ADForgetPassword
