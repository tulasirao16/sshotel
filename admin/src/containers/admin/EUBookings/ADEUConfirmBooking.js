import React, { Component } from 'react'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
import ADEUConfirmBookingView from '../../../components/admin/EUBookings/ConfirmBooking'

class ADEUConfirmBooking extends Component {
  constructor () {
    super()
    this.state = {
      authObj: {}
    }
  }
  render () {
    return (
      <div>
        {/* ------- Navbar --------- */}
        {/* {this.state.authObj && this.state.authObj.userRole === 'Admin' ? <DrawerWithHeader /> : ''} */}
        <DrawerWithHeader />
        <div className='main-content ' id='panel'>
          {/* -------- Heaer ---------- */}
          <ADEUConfirmBookingView />
          <FooterComponent />
        </div>
      </div>
    )
  }
}

export default ADEUConfirmBooking
