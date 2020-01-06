import React from 'react'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
import ADEUBookingsViewHistoryComponent from '../../../components/admin/EUBookingsHistory/ADEUBookingsViewHistoryComponent'

class ADEUBookingsHistoryView extends React.Component {

  render () {
    return (
      <div>
        <div className='main-content view-booking enduser' id='panel'>
          <DrawerWithHeader />
          <ADEUBookingsViewHistoryComponent />
        </div>
        <FooterComponent />
      </div>
    )
  }
}

export default ADEUBookingsHistoryView
