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

// --------------- END USERS IMPORTS --------------- //
// import EUHomeLandingPage from './containers/endusers/LandingPage/LandingPage'
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
import EUFavouritesList from './containers/endusers/Favourites/EUFavouritesList'
import EUInboxList from './containers/endusers/Inbox/EUInboxList'
import EUHotelsList from './components/endusers/hotelsList/EUHotelsList'
import EUForgotPassword from './containers/endusers/Login/EUForgotPasswordScreen'
import EUBookingPayment from './containers/endusers/Payments/EUBookingPayment'
import EUBookingPaymentSuccess from './containers/endusers/Payments/EUBookingPaymentSuccess'
import EUBookingPaymentFail from './containers/endusers/Payments/EUBookingPaymentFail'
import EUBookingMobilePaymentSetup from './containers/endusers/Payments/EUBookingMobilePaymentSetup'
import EUBookingMobilePaymentSuccess from './containers/endusers/Payments/EUBookingMobilePaymentSuccess'
import EUBookingMobilePaymentFail from './containers/endusers/Payments/EUBookingMobilePaymentFail'
import EUSignupScreen from './containers/endusers/Signup/EUSignupScreen'
import EUReviewRatingsList from './containers/endusers/ReviewRatings/EUReviewRatingsList'
import EUConfirmBooking from './components/endusers/BookingHistory/ConfirmBooking'

import Language from './Language'
import EUHotelBookNowPage from './containers/endusers/BookNow/BookNow'
import PropertyGalleryPage from './components/endusers/hotelBookNow/gallery'
import AddDiscounts from './components/serviceproviders/Discounts/AddDiscounts'
import AddOffers from './components/serviceproviders/Offers/AddOffers'
import EUEditReview from './components/endusers/reviews/EditReview'
import EUGiveRating from './components/endusers/BookingHistory/GiveRating'
import EUBookingView from './containers/endusers/BookingsHistory/EUBookingView'
import EUFileNotFound from './components/endusers/FileNotFound/EUFileNotFound'

/* ============ ADMIN IMPORTS ============ */
import ADLogin from './containers/admin/Login/ADLogin'
import ADHomeScreen from './containers/admin/Home/ADHomeScreen'
import ADHotelsList from './containers/admin/EUBookings/ADHotelsList'
import ADEUConfirmBooking from './containers/admin/EUBookings/ADEUConfirmBooking'
import ADHostsBookNowPage from './containers/admin/EUBookings/ADHostsBookNowPage'
import ADBookingHistory from './containers/admin/ADBookingHistory/ADBookingHistory'
import ADEUSPPInfoAmenitiesCompare from './containers/admin/EUBookings/ADEUSPPInfoAmenitiesCompare'
import ADListbySearchScreen from './containers/admin/Hosts/ADListBySearchScreen'
import ADHostsInboxList from './containers/admin/HostsInbox/ADHostsInboxList'
import ADUsersList from './containers/admin/Users/ADUsersListByStatus'
import ADUsersListAll from './containers/admin/Users/ADUsersListAll'
import ADHostsPropertiesScreen from './containers/admin/HostProperties/ADHostsPropertiesScreen'
import ADForgetPassword from './containers/admin/ForgetPassword/ADForgetPassword'
import ADHostUsersList from './containers/admin/HostUsers/ADHostUsersList'
import ADHostsPropertyInfoScreen from './containers/admin/HostProperties/HostPropertiesInfo/ADHostsPropertyInfoScreen'
import ADTicketsDashBoardScreen from './containers/admin/Tickets/ADTicketsDashboardScreen'
import ADTicketsList from './containers/admin/Tickets/ADTicketsList'
import ADTicketViewScreen from './containers/admin/Tickets/ADTicketViewScreen'
import ADTicketEditScreen from './containers/admin/Tickets/ADTicketEditScreen'
import ADHostPropertyBlockedDatesView from './containers/admin/HostBlockedDates/ADHostPropertyBlockedDatesView'
import ADHostPropertyBlockedDatesEdit from './containers/admin/HostBlockedDates/ADHostPropertyBlockedDatesEdit'
import ADHostPropertyBlockedDatesCreate from './containers/admin/HostBlockedDates/ADHostPropertyBlockedDatesCreate'
import ADHostBookings from './containers/admin/ADHostPropertyBookings/ADHostBookings'
import ADHostCreateBooking from './containers/admin/HostCreateBooking/ADHostCreateBooking'
import ADHostPropertyInfoList from './containers/admin/HostCreateBooking/ADCreateBookingPropertyInfoList'
import ADHostBookingsView from './components/admin/ADHostPropertyBookings/ADBookingsViewComponent'
import ADHostBookingsEdit from './containers/admin/ADHostPropertyBookings/ADHostEditBookings'
import ADHostLocationsList from './containers/admin/Locations/ADHostLocationsList'
import ADHostLocationCreate from './containers/admin/Locations/ADHostLocationCreate'
import ADHostLocationView from './containers/admin/Locations/ADHostLocationView'
import ADHostLocationsEdit from './containers/admin/Locations/ADHostLocationsEdit'
import ADEUUsersListScreen from './containers/admin/EuUsers/ADEUUsersListScreen'
import ADEUInboxListComponent from './containers/admin/EUInbox/ADEUInboxList'
import ADHostsReviewRatingsList from './containers/admin/HostsReviews/ADHostsReviewRatingsList'
import ADHostsNotificationsList from './containers/admin/HostNotices/ADHostsNotificationsList'
import ADEUNotificationsList from './containers/admin/EUNotices/ADEUNotificationsList'
import ADHostsPropertyInfoCreateScreen from './containers/admin/HostProperties/HostPropertyInfoCreate/ADHostsPropertyInfoCreateScreen'
import ADHostUserListView from './containers/admin/HostUsers/ADHostUserListView'
import ADHostUserListEdit from './containers/admin/HostUsers/ADHostUserListEdit'
import ADHostUserListIDProof from './containers/admin/HostUsers/ADHostUserListIDProof'
import ADHostUserIDProofEdit from './containers/admin/HostUsers/ADHostUserIDProofEdit'
import ADHostUserNotificationsList from './containers/admin/HostUsers/ADHostUserNotificationsList'
import ADProfileIdProofEdit from './containers/admin/Profile/ADProfileIdProofEdit'
import ADProfileIdProofsList from './containers/admin/Profile/ADProfileIdProofsList'
import ADProfilePreferences from './containers/admin/Profile/ADProfilePreferences'
import ADProfileChangePassword from './containers/admin/Profile/ADProfileChangePassword'
import ADProfile from './containers/admin/Profile/ADUserProfile'
import ADEUUserProfile from './containers/admin/EuUsers/Profile/ADEUUserProfile'
import ADEUDashboardBookings from './containers/admin/EuUsers/ADEUDashboardBookings'
import ADEuBookingDashboardScreen from './components/admin/EUUsers/ADEUBookingDashboardScreen'
import ADEUUsersFavouriteList from './containers/admin/EUFavorites/ADEUUsersFavouriteList'
import ADEUBookingsHistoryList from './containers/admin/EUBookingsHistory/ADEUBookingsHistoryList'
import ADDashboardBookingList from './containers/admin/Home/ADDashboardBookingList'
import ADDashboardBlockedDates from './containers/admin/Home/ADDashboardBlockedDates'
import ADEUBookingsHistoryEdit from './components/admin/EUBookingsHistory/ADEUEditBookingComponent'
import ADEUBookingsHistoryView from './containers/admin/EUBookingsHistory/ADEUBookingsHistoryView'
import ADEUReviewRatingsList from './containers/admin/EURatings/ADEUReviewRatingsList'
import ADSPHomeScreen from './containers/admin/Home/ADServiceProviderDashboard'
import ADSPDashboardBookingList from './containers/admin/Home/ADServiceProviderDashboardBookings'
import ADHostsPropertyCreate from './containers/admin/HostProperties/HostPropertyCreate/ADHostsPropertyCreateScreen'
import ADHostsEditHostScreen from './containers/admin/Hosts/ADHostsEditHostScreen'
import ADSPDashBoardScreen from './containers/admin/Home/ADDashboardScreen'
import ADHostsSupportList from './containers/admin/HostsSupport/ADHostsSupportList'
import ADEUSupportList from './containers/admin/EUSupport/ADEUSupportList'
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

      {/* ============ End User Paths ============ */}
      {/* <Route components={EUHomeLandingPage} path='/' onEnter={checkLoggedIn} /> */}
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
      <Route components={EUProfileIdProofEdit} path='/idproof/edit' onEnter={checkLoggedIn} />
      <Route components={EUFavouritesList} path='/favourites' onEnter={checkLoggedIn} />
      <Route components={EUInboxList} path='/inbox-list' onEnter={checkLoggedIn} />
      <Route components={EUForgotPassword} path='/login/forgotpassword' onEnter={checkLoggedIn} />
      <Route components={EUBookingPayment} path='/booking/payment' onEnter={checkLoggedIn} />
      <Route components={EUBookingPaymentSuccess} path='/booking/payment/success/:id' onEnter={checkLoggedIn} />
      <Route components={EUBookingPaymentFail} path='/booking/payment/fail/:id' onEnter={checkLoggedIn} />
      <Route components={EUBookingMobilePaymentSetup} path='/mobile/booking/payment/:id' onEnter={checkLoggedIn} />
      <Route components={EUBookingMobilePaymentSuccess} path='/mobile/booking/payment/success/:id' onEnter={checkLoggedIn} />
      <Route components={EUBookingMobilePaymentFail} path='/mobile/booking/payment/fail/:id' onEnter={checkLoggedIn} />
      <Route components={EUReviewRatingsList} path='/reviewratings' onEnter={checkLoggedIn} />
      <Route components={EUConfirmBooking} path='/hotels/booknow/confirm' onEnter={checkLoggedIn} />
      <Route components={EUFileNotFound} path='/fileNotFound' onEnter={checkLoggedIn} />

      <Route components={EUEditReview} path='/editReview' onEnter={checkLoggedIn} />
      <Route components={EUGiveRating} path='/giveRating' onEnter={checkLoggedIn} />
      <Route exact components={EUHotelBookNowPage} path='/hotels/booknow' onEnter={checkLoggedIn} />
      <Route exact components={PropertyGalleryPage} path='/gallery' onEnter={checkLoggedIn} />
      <Route components={AddPackageForYou} path='/AddPackageForYou' />
      <Route components={AddProperty} path='/AddProperty' />
      <Route components={AddDiscounts} path='/AddDiscounts' onEnter={checkLoggedIn} />
      <Route components={AddOffers} path='/AddOffers' onEnter={checkLoggedIn} />
      <Route components={Language} path='/langugae' onEnter={checkLoggedIn} />
      <Route components={ServiceProviderCreateBooking} path='/createbooking' onEnter={checkLoggedIn} />
      <Route components={EUBookingView} path='/bookings/view/:recordId' onEnter={checkLoggedIn} />

      {/* ============ Admin Paths ============ */}
      <Route components={ADLogin} path='/' onEnter={checkLoggedIn} />
      <Route components={ADLogin} path='/admin' onEnter={checkLoggedIn} />
      <Route components={ADHotelsList} path='/admin/eu/home' onEnter={checkLoggedIn} />
      <Route components={ADEUConfirmBooking} path='/admin/eu/booking/confirm' onEnter={checkLoggedIn} />
      <Route components={ADHostsBookNowPage} path='/admin/eu/booking' onEnter={checkLoggedIn} />
      <Route components={ADBookingHistory} path='/admin/bookinghistory' onEnter={checkLoggedIn} />
      <Route components={ADEUSPPInfoAmenitiesCompare} path='/admin/eu/properties/compare' onEnter={checkLoggedIn} />
      <Route components={ADHomeScreen} path='/admin/home' onEnter={checkLoggedIn} />
      <Route components={ADListbySearchScreen} path='/admin/hosts' onEnter={checkLoggedIn} />
      <Route components={ADHostsInboxList} path='/admin/host-inbox' onEnter={checkLoggedIn} />
      <Route components={ADUsersList} path='/admin/dashboard/users-bystatus' onEnter={checkLoggedIn} />
      <Route components={ADUsersListAll} path='/admin/users' onEnter={checkLoggedIn} />
      <Route components={ADHostBookings} path='/admin/host/property/bookings' onEnter={checkLoggedIn} />
      <Route components={ADHostPropertyInfoList} path='/admin/host/property/bookings/properties-infolist' onEnter={checkLoggedIn} />
      <Route components={ADHostCreateBooking} path='/admin/host/properties/properties-infolist/create-booking' onEnter={checkLoggedIn} />
      <Route components={ADHostBookingsView} path='/admin/host/property/bookings-view' onEnter={checkLoggedIn} />
      <Route components={ADHostBookingsEdit} path='/admin/host/property/bookings-edit' onEnter={checkLoggedIn} />
      <Route components={ADHostsPropertiesScreen} path='/admin/host/properties' onEnter={checkLoggedIn} />
      <Route components={ADForgetPassword} path='/admin/forgetpassword' onEnter={checkLoggedIn} />
      <Route components={ADHostUsersList} path='/admin/host-users' onEnter={checkLoggedIn} />
      <Route components={ADHostsPropertyInfoScreen} path='/admin/host/property-info'onEnter={checkLoggedIn} />
      <Route components={ADTicketsDashBoardScreen} path='/admin/tickets/dashboard' onEnter={checkLoggedIn} />
      <Route components={ADTicketsList} path='/admin/tickets' onEnter={checkLoggedIn} />
      <Route components={ADTicketViewScreen} path='/admin/tickets/ticketView' onEnter={checkLoggedIn} />
      <Route components={ADTicketEditScreen} path='/admin/tickets/ticketEdit' onEnter={checkLoggedIn} />
      <Route components={ADHostPropertyBlockedDatesView} path='/admin/host/properties/blocked-date-view' onEnter={checkLoggedIn} />
      <Route components={ADHostPropertyBlockedDatesEdit} path='/admin/host/properties/blocked-date-edit' onEnter={checkLoggedIn} />
      <Route components={ADHostPropertyBlockedDatesCreate} path='/admin/host/properties/blocked-date-create' onEnter={checkLoggedIn} />
      <Route components={ADHostLocationsList} path='/admin/host/location-list' onEnter={checkLoggedIn} />
      <Route components={ADHostLocationCreate} path='/admin/host/location-create' onEnter={checkLoggedIn} />
      <Route components={ADHostLocationView} path='/admin/host/location-view' onEnter={checkLoggedIn} />
      <Route components={ADHostLocationsEdit} path='/admin/host/location-edit' onEnter={checkLoggedIn} />
      <Route components={ADEUUsersListScreen} path='/admin/eu-users'onEnter={checkLoggedIn} />
      <Route components={ADEUInboxListComponent} path='/admin/eu/inbox' onEnter={checkLoggedIn} />
      <Route components={ADHostsReviewRatingsList} path='/admin/hosts/review-ratings' onEnter={checkLoggedIn} />
      <Route components={ADHostsNotificationsList} path='/admin/hosts/notifications' onEnter={checkLoggedIn} />
      <Route components={ADEUNotificationsList} path='/admin/eu/notifications' onEnter={checkLoggedIn} />
      <Route components={ADHostsPropertyInfoCreateScreen} path='/admin/host/property-info/create'onEnter={checkLoggedIn} />
      <Route components={ADHostUserListView} path='/admin/host-users/view' onEnter={checkLoggedIn} />
      <Route components={ADHostUserListEdit} path='/admin/host-users/edit' onEnter={checkLoggedIn} />
      <Route components={ADHostUserListIDProof} path='/admin/host-user/id-proof' onEnter={checkLoggedIn} />
      <Route components={ADHostUserIDProofEdit} path='/admin/host-user/id-proof/edit' onEnter={checkLoggedIn} />
      <Route components={ADHostUserNotificationsList} path='/admin/host-user/notifications' onEnter={checkLoggedIn} />
      <Route components={ADProfileIdProofEdit} path='/admin/user/profile/edit' onEnter={checkLoggedIn} />
      <Route components={ADProfileIdProofsList} path='/admin/user/profile/idproof' onEnter={checkLoggedIn} />
      <Route components={ADProfilePreferences} path='/admin/user/profile/preferences' onEnter={checkLoggedIn} />
      <Route components={ADProfile} path='/admin/profile' onEnter={checkLoggedIn} />
      <Route components={ADProfileChangePassword} path='/admin/user/profile/changepassword' onEnter={checkLoggedIn} />
      <Route components={ADEUUserProfile} path='/admin/eu-user/profile' onEnter={checkLoggedIn} />
      <Route components={ADEUDashboardBookings} path='/admin/eu/bookings' onEnter={checkLoggedIn} />
      <Route components={ADEuBookingDashboardScreen} path='/admin/eu/dashboard' onEnter={checkLoggedIn} />
      <Route component={ADEUUsersFavouriteList} path='/admin/eu/favourites' onEnter={checkLoggedIn} />
      <Route component={ADEUBookingsHistoryList} path='/admin/eu/booking-history' onEnter={checkLoggedIn} />
      <Route components={ADDashboardBookingList} path='/admin/dashboard/bookings'onEnter={checkLoggedIn} />
      <Route components={ADDashboardBlockedDates} path='/admin/dashboard/blockeddates'onEnter={checkLoggedIn} />
      <Route component={ADEUBookingsHistoryEdit} path='/admin/eu/booking-history/edit' onEnter={checkLoggedIn} />
      <Route component={ADEUBookingsHistoryView} path='/admin/eu/booking-history/view' onEnter={checkLoggedIn} />
      <Route component={ADEUReviewRatingsList} path='/admin/eu/review-rating' onEnter={checkLoggedIn} />
      <Route component={ADSPHomeScreen} path='/admin/host-dashboard' onEnter={checkLoggedIn} />
      <Route component={ADSPDashboardBookingList} path='/admin/host-dashboard/bookings' onEnter={checkLoggedIn} />
      <Route components={ADHostsPropertyCreate} path='/admin/host/property/create' onEnter={checkLoggedIn} />
      <Route components={ADHostsEditHostScreen} path='/admin/host/edit' onEnter={checkLoggedIn} />
      <Route component={ADSPDashBoardScreen} path='/admin/host-dashboard' onEnter={checkLoggedIn} />
      <Route component={ADHostsSupportList} path='/admin/hosts/support' onEnter={checkLoggedIn} />
      <Route component={ADEUSupportList} path='/admin/eu/support' onEnter={checkLoggedIn} />
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
