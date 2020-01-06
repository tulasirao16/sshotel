import React, { Component } from 'react'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
import ADHotelBookNowPage from '../../../components/admin/EUBookings/ADHotelBookNowPage'
class ADHostsBookNowPage extends Component {
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
          <ADHotelBookNowPage />
          <FooterComponent />
        </div>
      </div>
    )
  }
}

export default ADHostsBookNowPage
