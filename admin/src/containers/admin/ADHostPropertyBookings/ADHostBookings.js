import React, { Component } from 'react'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
import ADHostBookingsComponent from '../../../components/admin/ADHostPropertyBookings/ADHostBookingsComponent'
class ADHostBookings extends Component {
  render () {
    return (
      <div className='main-content ' id='panel'>
        <DrawerWithHeader />
        {/* -------- Heaer ---------- */}
        <ADHostBookingsComponent />
        <FooterComponent />
      </div>
    )
  }
}
export default ADHostBookings
