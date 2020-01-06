import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import ADEUSPPropertyCompareComponent from '../../../components/admin/EUBookings/ADEUSPPropertyCompareComponent'
import FooterComponent from '../../../components/admin/footer/Footer'

class ADEUSPPInfoAmenitiesCompare extends React.Component {
  constructor () {
    super()
    this.state = {
      authObj : JSON.parse(localStorage.getItem('authObj'))
    }
  }
  render () {
    return (
      <div className='main-content enduser' id='panel'>
        <DrawerWithHeader />
        <ADEUSPPropertyCompareComponent />
        <FooterComponent />
      </div>
    )
  }
}
export default ADEUSPPInfoAmenitiesCompare
