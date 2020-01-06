import React from 'react'
import ADEUUsersFavouriteComponent from '../../../components/admin/EUFavorites/ADEUUsersFavouriteComponent'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
import '../../../components/admin/EUBookings/Css/ADHotelsList.css'
class ADEUUsersFavouriteList extends React.Component {

  render () {
    return (
      <div>
        <DrawerWithHeader />
        <ADEUUsersFavouriteComponent />
        <FooterComponent />
      </div>
    )
  }
}

export default ADEUUsersFavouriteList
