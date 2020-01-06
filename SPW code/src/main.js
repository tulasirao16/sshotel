/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import ReactDOM from 'react-dom'
// import { Provider } from 'react-redux'
import { Router, Route, hashHistory } from 'react-router'

// --------------- SUPPLIER IMPORTS --------------- //
import SPSigninScreen from './containers/serviceproviders/Signin/SPSigninScreen'
import SPForgotpassword from './containers/serviceproviders/Signin/SPForgotPasswordScreen'
import SPForgotpasswordOtp from './containers/serviceproviders/Signin/SPForgotPasswordOtpScreen'
import SPResetPassword from './containers/serviceproviders/Signin/SPResetPasswordScreen'
import SPSignupScreen from './containers/serviceproviders/Signup/SPSignupScreen'
import SPSignupSuccess from './components/serviceproviders/Signup/SPSignupSuccessComponent'
import SPPropertiesList from './containers/serviceproviders/Properties/SPPropertiesList'
import SPAmenitiesList from './containers/serviceproviders/Amenities/SPAmenitiesList'
import SPServicesList from './containers/serviceproviders/Services/SPServicesList'
import SPBookingsList from './containers/serviceproviders/BookingsHistory/SPBookingsList'
import SPReviewRatingsList from './containers/serviceproviders/ReviewRatings/SPReviewRatingsList'
import SPLocationsList from './containers/serviceproviders/Locations/SPLocationsList'
import SPUsersList from './containers/serviceproviders/Users/SPUsersList'
import SPFavouritesList from './containers/serviceproviders/Favourites/SPFavouritesList'
import SPSupportList from './containers/serviceproviders/Support/SPSupportList'
import SPInboxList from './containers/serviceproviders/Inbox/SPInboxList'
import SPNotificationsList from './containers/serviceproviders/Notifications/SPNotificationsList'
import SPPropertyView from './containers/serviceproviders/Properties/SPPropertyView'
import SPPropertyInfoView from './containers/serviceproviders/PropertyInfos/SPPropertyInfoView'
import SPBlockedDatesView from './containers/serviceproviders/BlockedDates/SPBlockedDatesView'
import SPAmenitiesView from './containers/serviceproviders/Amenities/SPAmenitiesView'
import SPGuestRulesList from './containers/serviceproviders/GuestRules/SPGuestRulesList'
import SPBookingsView from './containers/serviceproviders/BookingsHistory/SPBookingsView'
import SPReviewRatingsView from './containers/serviceproviders/ReviewRatings/SPReviewRatingsView'
import SPLocationView from './containers/serviceproviders/Locations/SPLocationView'
import SPUsersView from './containers/serviceproviders/Users/SPUsersView'
import SPBlockedDatesCreate from './containers/serviceproviders/BlockedDates/SPBlockedDatesCreate'
import SPPropertyInfoCreate from './containers/serviceproviders/PropertyInfos/SPPropertyInfoCreate'
import SPAmenitiesCreate from './containers/serviceproviders/Amenities/SPAmenitiesCreate'
import SPAmenitiesCreateView from './containers/serviceproviders/Amenities/SPAmenitiesCreateView'
import SPLocationCreate from './containers/serviceproviders/Locations/SPLocationCreate'
import SPPropertyCreate from './containers/serviceproviders/Properties/SPPropertyCreate'
import SPLocationEdit from './containers/serviceproviders/Locations/SPLocationEdit'
import SPBlockedDatesEdit from './containers/serviceproviders/BlockedDates/SPBlockedDatesEdit'
import SPUserEdit from './containers/serviceproviders/Users/SPUsersEdit'
import SPBookingEdit from './containers/serviceproviders/EditBooking/SPEditBooking'
import SPUserProfile from './containers/serviceproviders/Profile/SPUserProfile'
import SPUserProfileAddress from './containers/serviceproviders/Profile/SPUserProfileAddress'
import SPProfileChangePassword from './containers/serviceproviders/Profile/SPProfileChangePassword'
import SPProfilePreferences from './containers/serviceproviders/Profile/SPProfilePreferences'
import SPProfileIdProofsList from './containers/serviceproviders/Profile/SPProfileIdProofsList'
import SPUserProfileBusinessInfo from './containers/serviceproviders/Profile/SPUserProfileBusinessInfo'
import SPProfileIdProofEdit from './containers/serviceproviders/Profile/SPProfileIdProofEdit'
import SPDashboard from './containers/serviceproviders/Dashboard/SPDashboard'
import SPDashboardBlockedDates from './containers/serviceproviders/Dashboard/SPDashboardBlockedDates'
import SPDashboardBookings from './containers/serviceproviders/Dashboard/SPDashboardBookings'

import SPGuestRulesCreate from './containers/serviceproviders/GuestRules/SPGuestRulesCreate'
import SPServicesCreate from './containers/serviceproviders/Services/SPServicesCreate'
import SPBookingsPropertiesList from './containers/serviceproviders/CreateBooking/SPBookingsPropertiesList'
import SPCreateBookingPropertyInfoListComponent from './containers/serviceproviders/CreateBooking/SPCreateBookingPropertyInfoList'
import SPCreateBooking from './containers/serviceproviders/CreateBooking/SPCreateBooking'
import AddPackageForYou from './components/serviceproviders/Properties/AddPackageForYou'
import AddProperty from './components/serviceproviders/Properties/AddProperty'
import ServiceProviderCreateBooking from './components/serviceproviders/BookingsHistory/CreateBooking'
import SPPropertyInfoPriceCreate from './containers/serviceproviders/PropertyInfoPrices/SPPropertyInfoPriceCreate'
import SPSetPasswordComponent from './components/serviceproviders/Users/SPUserSetPasswordComponent'

// --------------- END USERS IMPORTS --------------- //
import EUHomeLandingPage from './containers/endusers/LandingPage/LandingPage'
import EULoginScreen from './containers/endusers/Login/EULoginScreen'
import EUSocialLoginSuccess from './containers/endusers/Login/EUSocialLoginSuccess'
import EUNotifications from './containers/endusers/Notifications/EUNotificationsList'
import EUBookingsList from './containers/endusers/BookingsHistory/EUBookingsList'
import EUProfile from './containers/endusers/Profile/EUProfile'
import EUProfilePreferences from './containers/endusers/Profile/EUProfilePreferences'
import EUProfileChangePassword from './containers/endusers/Profile/EUProfileChangePassword'
import EUProfileIdProofsList from './containers/endusers/Profile/EUProfileIdProofsList'
import EUProfileIdProofEdit from './containers/endusers/Profile/EUProfileIdProofEdit'
import EUSPPInfoAmenitiesCompare from './containers/endusers/CompareHosts/EUSPPInfoAmenitiesCompare'
import EUSupportList from './containers/endusers/Support/EUSupportList'
import EUSupport from './containers/endusers/Support/EUSupport'
import EUFavouritesList from './containers/endusers/Favourites/EUFavouritesList'
import EUInboxList from './containers/endusers/Inbox/EUInboxList'
import EUHotelsList from './components/endusers/hotelsList/EUHotelsList'
import EUForgotPassword from './containers/endusers/Login/EUForgotPasswordScreen'
import EUBookingPayment from './containers/endusers/Payments/EUBookingPayment'
import EUBookingPaymentSuccess from './containers/endusers/Payments/EUBookingPaymentSuccess'
import EUBookingPaymentFail from './containers/endusers/Payments/EUBookingPaymentFail'
import EndUsersBookingFail from './containers/endusers/Payments/EUBookingFail'
import EUBookingMobilePaymentSetup from './containers/endusers/Payments/EUBookingMobilePaymentSetup'
import EUBookingMobilePaymentSuccess from './containers/endusers/Payments/EUBookingMobilePaymentSuccess'
import EUBookingMobilePaymentFail from './containers/endusers/Payments/EUBookingMobilePaymentFail'
import EUSignupScreen from './containers/endusers/Signup/EUSignupScreen'
import EUReviewRatingsList from './containers/endusers/ReviewRatings/EUReviewRatingsList'
import EUConfirmBooking from './components/endusers/BookingHistory/ConfirmBooking'
import EUMobileFBLogin from './components/endusers/mobileFacebookLogin/EUMobileFBLogin'

import Language from './Language'
import EUHotelBookNowPage from './containers/endusers/BookNow/BookNow'
import AddDiscounts from './components/serviceproviders/Discounts/AddDiscounts'
import AddOffers from './components/serviceproviders/Offers/AddOffers'
import EUGiveRating from './components/endusers/BookingHistory/GiveRating'
import EUBookingView from './containers/endusers/BookingsHistory/EUBookingView'
import EUFileNotFound from './components/endusers/FileNotFound/EUFileNotFound'
import ChatTest from './test'

// ========================================================
// Store Instantiation
// ========================================================
// const initialState = window.___INITIAL_STATE__
// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

const checkLoggedIn = (nextState, replace) => {
  /* if (localStorage.getItem('authobj')) {
    replace({
      pathname: '/prelogin'
    })
  } */
}

// window.onhashchange = segmentCallManager.logPageChange
// window.onload = segmentCallManager.logInitialLoad

let render = () => {
  ReactDOM.render(
    // <Provider>
    <Router history={hashHistory}>
      {/* ============ Supplier Paths ============ */}
      <Route components={ChatTest} path='/test' />
      <Route components={SPSignupScreen} path='/host' />
      <Route components={SPSignupScreen} path='/host/signup' />
      <Route components={SPSignupSuccess} path='/host/signup/success' />
      <Route components={SPSigninScreen} path='/host/signin' onEnter={checkLoggedIn} />
      <Route components={SPDashboard} path='/host/home' />
      <Route components={SPDashboardBlockedDates} path='/host/home/blockeddates' />
      <Route components={SPDashboardBookings} path='/host/home/bookings' onEnter={checkLoggedIn} />
      <Route components={SPPropertiesList} path='/host/properties' />
      <Route components={SPBlockedDatesView} path='/host/property/blockeddates/view' onEnter={checkLoggedIn} />
      <Route components={SPBlockedDatesCreate} path='/host/property/blockeddates/create' onEnter={checkLoggedIn} />
      <Route components={SPBookingsList} path='/host/bookings-history' onEnter={checkLoggedIn} />
      <Route components={SPReviewRatingsList} path='/host/reviewratings' onEnter={checkLoggedIn} />
      <Route components={SPLocationsList} path='/host/locations' onEnter={checkLoggedIn} />
      <Route components={SPUsersList} path='/host/users' onEnter={checkLoggedIn} />
      <Route components={SPPropertyView} path='/host/property-view' />
      <Route components={SPBookingsView} path='/host/bookings-history/view(/:recordId)' onEnter={checkLoggedIn} />
      <Route components={SPReviewRatingsView} path='/host/reviewratings/view' onEnter={checkLoggedIn} />
      <Route components={SPLocationView} path='/host/locations/view' onEnter={checkLoggedIn} />
      <Route components={SPUsersView} path='/host/user/view' onEnter={checkLoggedIn} />
      <Route components={SPLocationCreate} path='/host/locations/create' onEnter={checkLoggedIn} />
      <Route components={SPLocationEdit} path='/host/locations/edit' onEnter={checkLoggedIn} />
      <Route components={SPAmenitiesList} path='/host/property/amenities' onEnter={checkLoggedIn} />
      <Route components={SPAmenitiesView} path='/host/property/amenities-view' onEnter={checkLoggedIn} />
      <Route components={SPBlockedDatesEdit} path='/host/property/blockeddates/edit' onEnter={checkLoggedIn} />
      <Route components={SPAmenitiesCreate} path='/host/property/amenities-create' onEnter={checkLoggedIn} />
      <Route components={SPAmenitiesCreateView} path='/host/property/amenities-create/view' onEnter={checkLoggedIn} />
      <Route components={SPUserEdit} path='/host/user/edit' onEnter={checkLoggedIn} />
      <Route components={SPPropertyInfoView} path='/host/property-info/view' onEnter={checkLoggedIn} />
      <Route components={SPPropertyInfoPriceCreate} path='/host/property-info/price/create' onEnter={checkLoggedIn} />
      <Route components={SPGuestRulesList} path='/host/guest-rules/list' onEnter={checkLoggedIn} />
      <Route components={SPServicesList} path='/host/property/services' onEnter={checkLoggedIn} />
      <Route components={SPUserProfile} path='/host/user/profile' onEnter={checkLoggedIn} />
      <Route components={SPUserProfileAddress} path='/host/user/profile/address' onEnter={checkLoggedIn} />
      <Route components={SPProfileChangePassword} path='/host/user/profile/changepassword' onEnter={checkLoggedIn} />
      <Route components={SPProfilePreferences} path='/host/user/profile/preferences' onEnter={checkLoggedIn} />
      <Route components={SPProfileIdProofsList} path='/host/user/profile/idproof' onEnter={checkLoggedIn} />
      <Route components={SPUserProfileBusinessInfo} path='/host/user/profile/businessinfo' onEnter={checkLoggedIn} />
      <Route components={SPGuestRulesCreate} path='/host/property/guest-rules/create' onEnter={checkLoggedIn} />
      <Route components={SPServicesCreate} path='/host/property/services-create' onEnter={checkLoggedIn} />
      <Route components={SPPropertyInfoCreate} path='/host/property-info/create' onEnter={checkLoggedIn} />
      <Route components={SPForgotpassword} path='/host/signin/forgotpasssword' onEnter={checkLoggedIn} />
      <Route components={SPForgotpasswordOtp} path='/host/signin/forgotpasssword/otp' onEnter={checkLoggedIn} />
      <Route components={SPResetPassword} path='/host/signin/forgotpasssword/reset' onEnter={checkLoggedIn} />
      <Route components={SPFavouritesList} path='/host/favourites' onEnter={checkLoggedIn} />
      <Route components={SPSupportList} path='/host/support' onEnter={checkLoggedIn} />
      <Route components={SPBookingsPropertiesList} path='/host/create-booking/properties-list' onEnter={checkLoggedIn} />
      <Route components={SPCreateBookingPropertyInfoListComponent} path='/host/create-booking/properties-info/list' onEnter={checkLoggedIn} />
      <Route components={SPCreateBooking} path='/host/create-booking' onEnter={checkLoggedIn} />
      <Route components={SPProfileIdProofEdit} path='/host/user/profile/edit' onEnter={checkLoggedIn} />
      <Route components={SPInboxList} path='/host/inbox' onEnter={checkLoggedIn} />
      <Route components={SPNotificationsList} path='/host/notifications' onEnter={checkLoggedIn} />
      <Route components={SPPropertyCreate} path='/host/property/create' onEnter={checkLoggedIn} />
      <Route components={SPBookingEdit} path='/host/bookings-history/edit-booking' onEnter={checkLoggedIn} />
      <Route components={SPSetPasswordComponent} path='/host/newuser/setpassword/:token' />

      {/* ============ End User Paths ============ */}
      <Route components={EUHomeLandingPage} path='/' onEnter={checkLoggedIn} />
      <Route components={EUHotelsList} path='/hotels' onEnter={checkLoggedIn} />
      <Route components={EULoginScreen} path='/login' onEnter={checkLoggedIn} />
      <Route components={EUSignupScreen} path='/signup' onEnter={checkLoggedIn} />
      <Route components={EUSocialLoginSuccess} path='/social/login/success/:accessToken/:id' />
      <Route components={EUNotifications} path='/notifications-list' onEnter={checkLoggedIn} />
      <Route components={EUBookingsList} path='/bookings' onEnter={checkLoggedIn} />
      <Route components={EUProfile} path='/profile' onEnter={checkLoggedIn} />
      <Route components={EUProfilePreferences} path='/preferences' onEnter={checkLoggedIn} />
      <Route components={EUProfileChangePassword} path='/changepassword' onEnter={checkLoggedIn} />
      <Route components={EUProfileIdProofsList} path='/idproofs' onEnter={checkLoggedIn} />
      <Route components={EUSPPInfoAmenitiesCompare} path='/properties/compare' onEnter={checkLoggedIn} />
      <Route components={EUSupportList} path='/support' onEnter={checkLoggedIn} />
      <Route components={EUSupport} path='/eu-support' onEnter={checkLoggedIn} />
      <Route components={EUProfileIdProofEdit} path='/idproof/edit' onEnter={checkLoggedIn} />
      <Route components={EUFavouritesList} path='/favourites' onEnter={checkLoggedIn} />
      <Route components={EUInboxList} path='/inbox-list' onEnter={checkLoggedIn} />
      <Route components={EUForgotPassword} path='/login/forgotpassword' onEnter={checkLoggedIn} />
      <Route components={EUBookingPayment} path='/booking/payment' onEnter={checkLoggedIn} />
      <Route components={EUBookingPaymentSuccess} path='/booking/payment/success/:id' onEnter={checkLoggedIn} />
      <Route components={EUBookingPaymentFail} path='/booking/payment/fail/:id' onEnter={checkLoggedIn} />
      <Route components={EndUsersBookingFail} path='/booking/fail' onEnter={checkLoggedIn} />
      <Route components={EUBookingMobilePaymentSetup} path='/mobile/booking/payment/:id' onEnter={checkLoggedIn} />
      <Route components={EUBookingMobilePaymentSuccess} path='/mobile/booking/payment/success/:id' onEnter={checkLoggedIn} />
      <Route components={EUBookingMobilePaymentFail} path='/mobile/booking/payment/fail/:id' onEnter={checkLoggedIn} />
      <Route components={EUReviewRatingsList} path='/reviewratings' onEnter={checkLoggedIn} />
      <Route components={EUConfirmBooking} path='/hotels/booknow/confirm' onEnter={checkLoggedIn} />
      <Route components={EUFileNotFound} path='/fileNotFound' onEnter={checkLoggedIn} />
      <Route components={EUMobileFBLogin} path='/mobile/fb/login' onEnter={checkLoggedIn} />
      <Route components={EUGiveRating} path='/giveRating' onEnter={checkLoggedIn} />
      <Route exact components={EUHotelBookNowPage} path='/hotels/booknow' onEnter={checkLoggedIn} />
      <Route components={AddPackageForYou} path='/AddPackageForYou' />
      <Route components={AddProperty} path='/AddProperty' />
      <Route components={AddDiscounts} path='/AddDiscounts' onEnter={checkLoggedIn} />
      <Route components={AddOffers} path='/AddOffers' onEnter={checkLoggedIn} />
      <Route components={Language} path='/langugae' onEnter={checkLoggedIn} />
      <Route components={ServiceProviderCreateBooking} path='/createbooking' onEnter={checkLoggedIn} />
      <Route components={EUBookingView} path='/bookings/view/:recordId' onEnter={checkLoggedIn} />

      {/* ============ Adin Paths ============ */}
    </Router>,
    // </Provider>,
  MOUNT_NODE)
}

// This code is excluded from production bundle
if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(
        <RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        // console.error(error)
        renderError(error)
      }
    }

    // Setup hot module replacement
    // module.hot.accept('./components/endusers/login/login', () => setImmediate(() => {
    //   ReactDOM.unmountComponentAtNode(MOUNT_NODE)
    //   render()
    // }))
  }
}

// ========================================================
// Go!
// ========================================================
render()
