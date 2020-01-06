import React from 'react'
import FooterComponent from '../../../components/admin/footer/Footer'
import ADEUConfirmBookingView from '../../../components/admin/EUBookings/ConfirmBooking'

class EUConfirmBooking extends React.Component {
  render () {
    return (
      <div className='main-content enduser' id='panel'>
        <ADEUConfirmBookingView />
        <FooterComponent />
      </div>
    )
  }
}
export default EUConfirmBooking
