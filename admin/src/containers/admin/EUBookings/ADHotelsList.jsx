import React, { Component } from 'react'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
import ADHotelsListComponent from '../../../components/admin/EUBookings/ADHotelsListComponent'
class ADHotelsList extends Component {
  constructor () {
    super()
    localStorage.setItem('menuItem', 'CreateBooking')
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
          <ADHotelsListComponent />
          <FooterComponent />
        </div>
      </div>
    )
  }
}

export default ADHotelsList
