import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, AsyncStorage, Text, View, Dimensions, Image, NetInfo } from 'react-native';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from "react-navigation";
import { Button, Container, Header, Content, List, ListItem, Icon, Left, Right } from 'native-base';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../components/houseRules/css/routerCss';
const Device_Height = Dimensions.get('window').height;


import SplashScreen from '../container/splash/SplashScreen';
import SPSignupScreen from '../container/signup/SignupScreen';
import SignupAddress from '../container/signup/SignupAddress';
import SigninScreen from '../container/signin/SigninScreen';
import SPHomeScreen from '../container/home/SPHomeScreen';
import PropertiesList from '../container/Properties/PropertiesList';
import AmenitiesScreen from '../container/Amenities/AmenitiesScreen';
import AmenitiesViewScreen from '../container/Amenities/AmenitiesViewScreen';
import UsersList from '../container/Users/UsersList';
import ReviewRatingsListScreen from '../container/ReviewRatings/ReviewRatingsList';
import ReviewRatingsViewScreen from '../container/ReviewRatings/ReviewRatingsView';
import LocationsList from '../container/Locations/LocationsList';
import LocationsViewScreen from '../container/Locations/LocationsViewScreen';
import LocationsCreateScreen from '../container/Locations/LocationsCreateScreen';
import PropertyInfoPricingListScreen from '../container/PropertyInfos/PropertyInfoPricingList';
import PropertyInfoPricingViewScreen from '../container/PropertyInfos/PropertyInfoPricingView';
import InformationScreen from '../container/information/InformationScreen';
import AmenitiesCreateScreen from '../container/Amenities/AmenitiesCreateScreen';
import AmenitiesCreateViewScreen from '../container/Amenities/AmenitiesCreateViewScreen';
import BookingHistoryListScreen from '../container/bookingHistory/BookingHistoryListScreen';
import BookingHistoryViewScreen from '../container/bookingHistory/BookingHistoryViewScreen';
import BookingHistoryEachRow from '../container/bookingHistory/BookingHistoryEachRow';
import AmenitiesEditScreen from '../container/Amenities/AmenitiesEditScreen';
import AmenitiesEditViewScreen from '../container/Amenities/AmenitiesEditViewScreen';
import EditGuestRules from '../container/GuestRules/EditGuestRules';

import ServiceCreate from '../container/Services/ServiceCreate';
import ServiceEdit from '../container/Services/ServiceEdit';
import ServicesList from '../container/Services/ServicesList';
import ServiceView from '../container/Services/ServiceView';

import BookingsPropertiesList from '../container/bookingHistory/BookingsPropertiesList';
import BookingsPropertyInfoList from '../container/bookingHistory/BookingsPropertyInfoList';
import ConfirmBooking from '../container/bookingHistory/ConfirmBooking';
import CreateBookingsReferenceView from '../container/bookingHistory/CreateBookingReferenceView';
import BookingEdit from '../container/bookingHistory/BookingEdit';

import SigninNewScreen from '../container/signin/SigninNewScreen';
import ForgotPasswordScreen from '../container/signin/ForgotPasswordScreen';
import ResetPasswordScreen from '../container/signin/ResetPasswordScreen';
import VerifyScreen from '../container/signin/VerifyScreen';
import SignupOtpScreen from '../container/signup/SignupOtpScreen';
import PropertyView from '../container/Properties/PropertyView';
import AddPriceScreen from '../container/AddPrice/AddPriceScreen';
import ReviewScreen from '../container/Review/ReviewScreen';
import PrebuildTemplatesScreen from '../container/PrebuildTemplates/PrebuildTemplatesScreen';
import TypeOfPropertyScreen from '../container/TypeOfProperty/TypeOfPropertyScreen';
import TypeOfRentScreen from '../container/TypeOfRent/TypeOfRentScreen';
import AddCommonSpacesScreen from '../container/AddCommonSpaces/AddCommonSpacesScreen';
import GuestRulesScreen from '../container/GuestRules/GuestRulesScreen';
import GuestRulesList from '../container/GuestRules/GuestRulesList';
import GuestRulesViewScreen from '../container/GuestRules/GuestRulesViewScreen';
import BlockDatesScreen from '../container/BlockDates/BlockDatesScreen';
import HomeScreenBlockedDates from '../container/home/HomeScreenBlockedDates';
import HomeScreenReviewRatings from '../container/home/HomeScreenReviewRatings';
import TimingScreen from '../container/Timings/TimingScreen';
import BedsandBathRoomScreen from '../container/BedsandBathroms/BedsandBathRoomScreen';
import ProfileScreen from '../container/profile/ProfileScreen';
import ProfileEditScreen from '../container/profile/ProfileEditScreen';
import ProfileAddress from '../container/profile/ProfileAddressScreen';
import IDProofsList from '../container/profile/IDProofsList';
import UpdateIDProofScreen from '../container/profile/UpdateIDProofScreen';
import CreateIDProofScreen from '../container/profile/CreateIDProofScreen';
import ChangePassword from '../container/profile/ChangePasswordScreen';
import PreferenceScreen from '../container/profile/PreferenceScreen';
import BusinessInfoScreen from '../container/profile/BusinessInfoScreen';
import InboxScreen from '../container/inbox/InboxCompont';
import SPInboxScreen from '../container/inbox/InboxList';
import SPChatView from '../container/inbox/ViewChat'
import Messages from '../container/inbox/Messages'
import FavouritesScreen from '../container/favourites/FavouritesScreen';
import BookingHistoryScreen from '../container/bookingHistory/BookingHistoryScreen';
import CalendarScreen from '../container/calendar/CalendarScreen';
import OtpScreen from '../container/otpScreen/OtpScreen';
import CreatePassword from '../container/createPassword/CreatePassword';
import DashboardScreen from '../container/dashboard/Dashboard';
import UserView from '../container/Users/UserView';
import PropertyInfoList from '../container/PropertyInfos/PropertyInfoList';
import TypeOfPropertyInfoScreen from '../container/TypeOfProperty/TypeOfPropertyInfoScreen';
import PropertyInfoView from '../container/PropertyInfos/PropertyInfoView';
import CreatePropertyInfo from '../container/PropertyInfos/CreatePropertyInfo';
import CreateUser from '../container/Users/CreateUser';
import CreateUserAddress from '../container/Users/CreateUserAddress';
import LocationsEditScreen from '../container/Locations/LocationsEditScreen';
import GuestRulesCreateScreen from '../container/GuestRules/GuestRulesCreateScreen';
import EditUser from '../container/Users/EditUser';
import AddPriceViewScreen from '../container/AddPrice/AddPriceViewScreen';
import PropertyInfoEdit from '../container/PropertyInfos/PropertyInfoEdit';
import PriceEdit from '../container/AddPrice/PriceEdit';
import CreateBlockedDates from '../container/BlockDates/CreateBlockedDates';
import ServicesEditList from '../container/Services/ServiceEditList';
import ServiceEditListRow from '../container/Services/ServiceEditListRow';
import ServiceCreateView from '../container/Services/ServiceCreateView';
import NotificationsListScreen from '../container/notifications/NotificationsList';
import FavouriteViewScreen from '../container/favourites/FavouriteView';
import BlockedDatesEdit from '../container/BlockDates/BlockedDatesEdit';
import CreateProperty from '../container/Properties/CreateProperty';
import EditProperty from '../container/Properties/EditProperty';
import EditInboxScreen from '../container/inbox/EditInboxScreen';
import Support from '../container/support/support';
import ViewTicket from '../container/support/ViewTicket';
// import InboxViewScreen from '../container/inbox/InboxViewScreen';
// import TicketList from '../container/support/TicketList';
// import ViewSupport from '../container/support/ViewSupport';
// import EditSupport from '../container/support/EditSupport';
import CreateBooking from '../container/bookingHistory/CreateBooking';
import CheckInBookings from '../container/home/CheckInBookings';
import PropertyLocationCreate from '../container/Properties/PropertyLocationCreate';
import PropertyImages from '../container/Properties/PropertyImages';
import PropertyImagesEdit from '../container/Properties/PropertyImagesEdit';
import PropertyNearestLocations from '../container/Properties/PropertyNearestLocations';
import PropertyNearestLocationsEdit from '../container/Properties/PropertyNearestLocationsEdit';
import NoInternetScreen from '../components/NoInternetConnection';
// import CreateSupport from '../container/support/CreateSupport';
import { inject, observer } from 'mobx-react';
import i18n from 'i18n-js'; 

const StackNavigator = createStackNavigator({

  SplashScreen: {screen: SplashScreen},
  SigninScreen: {screen: SigninScreen},
  SPSignupScreen: {screen: SPSignupScreen},
  SignupAddress: {screen: SignupAddress},
  SPHomeScreen: {screen: SPHomeScreen},
  PropertiesList: {screen: PropertiesList},
  AmenitiesScreen: {screen: AmenitiesScreen},
  AmenitiesViewScreen: {screen: AmenitiesViewScreen},
  AddPriceViewScreen: {screen: AddPriceViewScreen},
  UsersList: {screen: UsersList},
  UserView: {screen: UserView},
  EditUser: {screen: EditUser},
  CreateUserAddress: {screen: CreateUserAddress},
  CreateUser: {screen: CreateUser},
  ReviewRatingsListScreen: {screen: ReviewRatingsListScreen},
  ReviewRatingsViewScreen: {screen: ReviewRatingsViewScreen},
  LocationsList: {screen: LocationsList},
  LocationsViewScreen: {screen: LocationsViewScreen},
  LocationsCreateScreen: {screen: LocationsCreateScreen},
  LocationsEditScreen: {screen: LocationsEditScreen},

  DashboardScreen:{screen:DashboardScreen},
  PrebuildTemplatesScreen: { screen: PrebuildTemplatesScreen },
  SignupOtpScreen: { screen: SignupOtpScreen },
  GuestRulesList:{screen:GuestRulesList},
  GuestRulesViewScreen: { screen: GuestRulesViewScreen },
  GuestRulesScreen: { screen: GuestRulesScreen },
  SigninNewScreen:{screen:SigninNewScreen},
  ForgotPasswordScreen:{screen:ForgotPasswordScreen},
  OtpScreen: {screen: OtpScreen},
  CreatePassword: {screen: CreatePassword},
  ResetPasswordScreen:{screen:ResetPasswordScreen},
  VerifyScreen:{screen:VerifyScreen},
  CalendarScreen:{ screen:CalendarScreen },
  InboxScreen: {screen: InboxScreen},
  SPInboxScreen: {screen: SPInboxScreen},
  SPChatView: {screen: SPChatView},
  Messages : {screen: Messages},
  FavouritesScreen: { screen: FavouritesScreen },
  BookingHistoryScreen: { screen: BookingHistoryScreen },
  ReviewScreen: { screen: ReviewScreen },
  TimingScreen: { screen: TimingScreen },
  AddPriceScreen: { screen: AddPriceScreen },
  BlockDatesScreen: { screen: BlockDatesScreen },
  HomeScreenBlockedDates: {screen: HomeScreenBlockedDates},
  HomeScreenReviewRatings: {screen: HomeScreenReviewRatings},
  AddCommonSpacesScreen: { screen: AddCommonSpacesScreen },
  BedsandBathRoomScreen: { screen: BedsandBathRoomScreen },
  TypeOfRentScreen: { screen: TypeOfRentScreen },
  TypeOfPropertyScreen: { screen: TypeOfPropertyScreen },
  PropertyView: { screen: PropertyView },
  ProfileScreen: { screen: ProfileScreen },
  UpdateIDProofScreen: {screen: UpdateIDProofScreen},
  CreateIDProofScreen: {screen: CreateIDProofScreen},
  IDProofsList: {screen: IDProofsList},
  PreferenceScreen: {screen:PreferenceScreen},
  BusinessInfoScreen: {screen: BusinessInfoScreen},
  ChangePassword: {screen: ChangePassword},
  ProfileEditScreen: { screen: ProfileEditScreen },
  ProfileAddress: {screen: ProfileAddress},
  PropertyInfoList: {screen: PropertyInfoList},
  TypeOfPropertyInfoScreen: {screen: TypeOfPropertyInfoScreen},
  PropertyInfoPricingListScreen: { screen: PropertyInfoPricingListScreen},
  PropertyInfoPricingViewScreen: { screen: PropertyInfoPricingViewScreen },
  InformationScreen: { screen: InformationScreen },
  PropertyInfoView: {screen: PropertyInfoView},
  CreatePropertyInfo: {screen: CreatePropertyInfo},
  AmenitiesCreateScreen: { screen: AmenitiesCreateScreen },
  GuestRulesCreateScreen: {screen: GuestRulesCreateScreen},
  AmenitiesCreateViewScreen:{ screen: AmenitiesCreateViewScreen },
  ServiceCreate: { screen: ServiceCreate },
  ServiceEdit: { screen: ServiceEdit },
  ServicesList: {screen: ServicesList},
  ServiceView: {screen: ServiceView},
  ServicesEditList: {screen: ServicesEditList},
  ServiceEditListRow: {screen: ServiceEditListRow},
  PropertyInfoEdit: { screen: PropertyInfoEdit},
  PriceEdit: {screen: PriceEdit},
  CreateBlockedDates: {screen: CreateBlockedDates},
  BookingHistoryListScreen: {screen: BookingHistoryListScreen},
  BookingHistoryViewScreen: {screen: BookingHistoryViewScreen},
  BookingHistoryEachRow: {screen: BookingHistoryEachRow},
  CheckInBookings: {screen: CheckInBookings },
  ServiceCreateView: {screen: ServiceCreateView},
  AmenitiesEditScreen: {screen: AmenitiesEditScreen },
  NotificationsListScreen: {screen: NotificationsListScreen },
  FavouriteViewScreen: { screen: FavouriteViewScreen },
  AmenitiesEditViewScreen: { screen: AmenitiesEditViewScreen },
  EditGuestRules: { screen: EditGuestRules },
  BlockedDatesEdit: {screen: BlockedDatesEdit},
  CreateProperty: {screen: CreateProperty},
  EditProperty: {screen: EditProperty},
  EditInboxScreen: {screen: EditInboxScreen},
  Support: {screen: Support},
  ViewTicket: {screen: ViewTicket},
  // InboxViewScreen: {screen: InboxViewScreen},
  // TicketList: {screen: TicketList },
  // ViewSupport: {screen: ViewSupport},
  // EditSupport: {screen: EditSupport},
  BookingsPropertiesList: {screen: BookingsPropertiesList},
  BookingsPropertyInfoList: {screen: BookingsPropertyInfoList},
  CreateBooking: {screen: CreateBooking },
  ConfirmBooking: {screen: ConfirmBooking},
  CreateBookingsReferenceView: {screen: CreateBookingsReferenceView},
  PropertyLocationCreate: {screen: PropertyLocationCreate},
  BookingEdit: {screen: BookingEdit},
  PropertyImages: {screen: PropertyImages},
  PropertyImagesEdit: {screen: PropertyImagesEdit},
  PropertyNearestLocations: {screen: PropertyNearestLocations},
  PropertyNearestLocationsEdit: {screen: PropertyNearestLocationsEdit},
  NoInternetScreen: {screen: NoInternetScreen}
  // CreateSupport: {screen: CreateSupport}
}
  // {
  //   navigationOptions: {
  //     header: null,
  //     drawerLockMode: 'locked-closed'
  //   }
  // },
);
StackNavigator.navigationOptions = ({ navigation }) => {
  let drawerLockMode = 'unlocked';
  const routeName = navigation.state.routes[navigation.state.routes.length-1].routeName;
  if (routeName == 'SigninScreen' || routeName == 'SPSignupScreen' || routeName == 'SplashScreen' || routeName == 'SignupAddress' || routeName == 'SignupOtpScreen' || routeName == 'SigninNewScreen') {
    drawerLockMode = 'locked-closed';
  }

  return {
    drawerLockMode,
  };
};

@inject(['MessageStore'])
@observer
export default class DrawerContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authObj: {},
      isLogOutModalVisible: false,
      unReadCount: 20,
      activePage: false,
      activePropertyPage: false,
      screenName: 'SPHomeScreen'
    };
  }

  async componentWillMount() {
    await AsyncStorage.getItem('authObj').then((value) => {
      let authObj = JSON.parse(value);
      this.setState({authObj: (authObj && authObj.mobileNumber) ? authObj : {}});
    });
  }
  async componentWillReceiveProps () {
    const navigation = this.props.navigation;
    const MessageStore = this.props.MessageStore;
    NetInfo.getConnectionInfo().then(connectionInfo => {
      if(connectionInfo.type == 'none' || connectionInfo.type == 'unknown') {
        navigation.navigate('NoInternetScreen');
      }
    });
    
    let ScreenName = await AsyncStorage.getItem('ScreenName');
    if (ScreenName) {
      AsyncStorage.removeItem('ScreenName');
      this.setState({ screenName: ScreenName })
      navigation.navigate(ScreenName)
    }
    await AsyncStorage.getItem('authObj').then((value) => {
      let authObj = JSON.parse(value);
      let unReadCount = this.state.unReadCount;
      this.setState({ unReadCount: unReadCount + 1, authObj: (authObj && authObj.mobileNumber) ? authObj : {} });
      if(authObj && authObj.mobileNumber && this.state.unReadCount >= 20) {
        this.setState({ unReadCount: 0 });
        MessageStore.getSPMessagesUnReadCount(function(resObj) {
        });
      }
    });
  }

  handleLogOut () {
    this.setState({isLogOutModalVisible: false})
    AsyncStorage.removeItem('authObj');
    AsyncStorage.removeItem('authToken'); 
    const navigation = this.props.navigation;
    navigation.navigate('SigninScreen', {clearData: true});
  }
  handleClose () {
    this.props.navigation.closeDrawer()
    this.setState({ isLogOutModalVisible: false })
  }

  handleOnNavigateBack = () => {
  }

  handleClick = (screen) => {
    const navigation = this.props.navigation
    this.setState({ screenName: screen })
    // alert('====================screen:' + screen)
    switch(screen) {
      case 'SPHomeScreen':
      navigation.navigate("SPHomeScreen", {refresh: true})
        break;
      case 'PropertiesList':
      navigation.navigate("PropertiesList")
        break;
        case 'LocationsList':
        navigation.navigate("LocationsList")
        break;
      case 'SPInboxScreen':
      navigation.navigate("SPInboxScreen")
        break;
        case 'BookingHistoryListScreen':
        navigation.navigate("BookingHistoryListScreen")
        break;
        case 'ReviewRatingsListScreen':
        AsyncStorage.setItem('isTimeBased', 'False');
        navigation.navigate('ReviewRatingsListScreen')
        break;
        case 'UsersList':
        navigation.navigate("UsersList")
        break;
        case 'NotificationsListScreen':
        navigation.navigate('NotificationsListScreen', {notificationsUnreadCount: 0, onNavigateBack: this.handleOnNavigateBack})
        break;
        case 'ProfileScreen':
        navigation.navigate('ProfileScreen')
        break;
        case 'Support':
        navigation.navigate('Support')
        break;
      default:
      navigation.navigate("SPHomeScreen", {refresh: true})
    }
  }

  render() {
    // const ThemeStore = this.props.ThemeStore;
    const navigation = this.props.navigation
    //   let imgTag = <Image source={LOGO_IMG} style={{ width:206, height:72 }} />;
    return (
      <Container>     
        <View style={{ height: Device_Height/4.5 }} >
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearGradientRouter}>
          <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', paddingVertical: 23 }} >
            <View style={ styles.routerLogoImageView } >
              <Image source={require('../../assets/logo.png')} style={styles.imageFit} />
            </View>
          </View> 
        </LinearGradient> 
      </View>
      <Content>
          <View style={ styles.bodyView } >
            <View style={ styles.eachRow } >
              <TouchableWithoutFeedback activeOpacity={0.8} onPress={() => this.handleClick('SPHomeScreen')}>
                <View style={ styles.eachView }>
                  <View style={ this.state.screenName == 'SPHomeScreen' ? styles.iconActiveCircle : styles.iconCircle } >
                    <Icon style= { this.state.screenName == 'SPHomeScreen' ? styles.iconActiveStyle : styles.iconStyle } name='ios-home' />
                  </View>
                  <Text style={ styles.routerTitle }>{i18n.t('lanActionHome')}</Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback activeOpacity={0.8} onPress={() => this.handleClick('PropertiesList')}>
                <View style={ styles.eachView }>
                  <View style={ this.state.screenName == 'PropertiesList' ? styles.iconActiveCircle : styles.iconCircle } >
                    <Icon style= { this.state.screenName == 'PropertiesList' ? styles.iconActiveStyle : styles.iconStyle } name='ios-apps' />
                  </View>
                  <Text style={ styles.routerTitle }>{i18n.t('lanActionProperties')}</Text> 
                </View>
              </TouchableWithoutFeedback>
            </View>

            <View style={ styles.eachRow } >
              <TouchableWithoutFeedback onPress={() => this.handleClick('LocationsList')}>
                <View style={ styles.eachView }>
                  <View style={ this.state.screenName == 'LocationsList' ? styles.iconActiveCircle : styles.iconCircle } >
                    <Icon style= { this.state.screenName == 'LocationsList' ? styles.iconActiveStyle : styles.iconStyle } name='ios-pin' />
                  </View>
                  <Text style={ styles.routerTitle }>{i18n.t('lanActionServiceLocations')}</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => this.handleClick("SPInboxScreen")}>
                <View style={ styles.eachView } >
                  <View style={ this.state.screenName == 'SPInboxScreen' ? styles.iconActiveCircle : styles.iconCircle } >
                    <Icon style= { this.state.screenName == 'SPInboxScreen' ? styles.iconActiveStyle : styles.iconStyle } name='ios-mail' />
                  </View>
                  <Text style={ styles.routerTitle } >{i18n.t('lanActionInbox')}</Text> 
                </View>
              </TouchableWithoutFeedback>
            </View>

            <View style={ styles.eachRow } >
              <TouchableWithoutFeedback onPress={() => this.handleClick("BookingHistoryListScreen")}>
                <View style={ styles.eachView }>
                  <View style={ this.state.screenName == 'BookingHistoryListScreen' ? styles.iconActiveCircle : styles.iconCircle } >
                    <Icon style= { this.state.screenName == 'BookingHistoryListScreen' ? styles.iconActiveStyle : styles.iconStyle } name='ios-list' />
                  </View>
                  <Text style={ styles.routerTitle } >{i18n.t('lanActionBookings')}</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => navigation.navigate('BookingsPropertiesList')}>
                <View style={ styles.eachView }>
                  <View style={ styles.iconCircle } >
                    <Icon style= {[styles.iconStyle, styles.iconAddStyle]} name='ios-add' />
                  </View>
                  <Text style={ styles.routerTitle } >{i18n.t('lanActionCreateBooking')}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View> 

            <View style={ styles.eachRow } >
              <TouchableWithoutFeedback onPress={() => this.handleClick("ReviewRatingsListScreen")}>
                <View style={ styles.eachView }>
                  <View style={ this.state.screenName == 'ReviewRatingsListScreen' ? styles.iconActiveCircle : styles.iconCircle } >
                    <Icon style={ this.state.screenName == 'ReviewRatingsListScreen' ? styles.iconActiveStyle : styles.iconStyle } name='ios-star' />
                  </View>
                  <Text style={ styles.routerTitle } >{i18n.t('lanActionRatingAndReviews')}</Text>
                </View>
                </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => this.handleClick("UsersList")}>
                <View style={ styles.eachView }>
                  <View style={ this.state.screenName == 'UsersList' ? styles.iconActiveCircle : styles.iconCircle } >
                    <Icon style={ this.state.screenName == 'UsersList' ? styles.iconActiveStyle : styles.iconStyle } name='ios-contacts' />
                  </View>
                  <Text style={ styles.routerTitle }>{i18n.t('lanActionUsers')}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>

            <View style={ styles.eachRow } >
                {/* <TouchableWithoutFeedback onPress={() => navigation.navigate("FavouritesScreen")}>
                  <View style={ styles.eachView }>
                    <View style={ styles.iconCircle } >
                      <Icon style= { styles.iconStyle } name='ios-heart' />
                    </View>
                    <Text style={ styles.routerTitle } >Favourites</Text>
                  </View>
                </TouchableWithoutFeedback> */}
              <TouchableWithoutFeedback onPress={() => this.handleClick('NotificationsListScreen')}>
                <View style={ styles.eachView }>
                  <View style={ this.state.screenName == 'NotificationsListScreen' ? styles.iconActiveCircle : styles.iconCircle } >
                    <Icon style={ this.state.screenName == 'NotificationsListScreen' ? styles.iconActiveStyle : styles.iconStyle } name='ios-notifications' />
                  </View>
                  <Text style={ styles.routerTitle }>{i18n.t('lanActionNotifications')} </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => this.handleClick("ProfileScreen")}>
                <View style={ styles.eachView }>
                  <View style={ this.state.screenName == 'ProfileScreen' ? styles.iconActiveCircle : styles.iconCircle } >
                    <Icon style={ this.state.screenName == 'ProfileScreen' ? styles.iconActiveStyle : styles.iconStyle } name='ios-contact' />
                  </View>
                  <Text style={ styles.routerTitle }>{i18n.t('lanActionProfile')} </Text>
                </View>
                </TouchableWithoutFeedback>
            </View>
            
            <View style={ styles.eachRow } >
              <TouchableWithoutFeedback onPress={() => this.handleClick("Support")}>
                  <View style={ styles.eachView }>
                    <View style={ this.state.screenName == 'Support' ? styles.iconActiveCircle : styles.iconCircle } >
                      <Icon style={ this.state.screenName == 'Support' ? styles.iconActiveStyle : styles.iconStyle } name='ios-headset' />
                    </View>
                    <Text style={ styles.routerTitle }>{i18n.t('lanActionSupport')}</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => this.setState({ isLogOutModalVisible: true })}>
                  <View style={ styles.eachView }>
                    <View style={ styles.iconCircle } >
                      <Icon style= { styles.iconStyle } name='ios-log-out' />
                    </View>
                    <Text style={ styles.routerTitle } >{i18n.t('lanActionLogout')}</Text>
                  </View>
                </TouchableWithoutFeedback>
            </View>
          </View>
          {/* <List>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("PropertiesList")}>
              <ListItem selected style={{ borderBottomWidth: 1, borderColor: "#DCDCDC", borderStyle: "solid" }}>
                <Left>
                  <Icon name="mail" style={{ fontSize: 21, color: '#01a4a1', width: 20, marginRight: 10 }} />
                  <Text style={{fontFamily:'Roboto_medium', fontSize:15,}}>My Properties</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
            </TouchableWithoutFeedback>
          </List>
          <List>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("LocationsList")}>
              <ListItem selected style={{ borderBottomWidth: 1, borderColor: "#DCDCDC", borderStyle: "solid" }}>
                <Left>
                  <Icon name="mail" style={{ fontSize: 21, color: '#01a4a1', width: 20, marginRight: 10 }} />
                  <Text style={{fontFamily:'Roboto_medium', fontSize:15,}}>My Service Locations</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
            </TouchableWithoutFeedback>
          </List>
          <List>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("InboxScreen")}>
              <ListItem selected style={{ borderBottomWidth: 1, borderColor: "#DCDCDC", borderStyle: "solid" }}>
                <Left>
                  <Icon name="mail" style={{ fontSize: 21, color: '#01a4a1', width: 20, marginRight: 10 }} />
                  <Text style={{fontFamily:'Roboto_medium', fontSize:15,}}>Inbox</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
            </TouchableWithoutFeedback>
          </List>
          <List>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("FavouritesScreen")}>
              <ListItem style={{ borderBottomWidth: 1, borderColor: "#DCDCDC", borderStyle: "solid" }}>
                <Left>
                  <Icon name="heart" style={{ fontSize: 21, color: '#01a4a1', width: 20, marginRight: 10 }} />
                  <Text style={{fontFamily:'Roboto_medium', fontSize:15,}}>Favourites</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
            </TouchableWithoutFeedback>
          </List>
          <List>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("NotificationsListScreen")}>
              <ListItem style={{ borderBottomWidth: 1, borderColor: "#DCDCDC", borderStyle: "solid" }}>
                <Left>
                  <Icon name="heart" style={{ fontSize: 21, color: '#01a4a1', width: 20, marginRight: 10 }} />
                  <Text style={{fontFamily:'Roboto_medium', fontSize:15,}}>Notifications</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
            </TouchableWithoutFeedback>
          </List>
          <List>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("BookingHistoryListScreen")}>
              <ListItem style={{ borderBottomWidth: 1, borderColor: "#DCDCDC", borderStyle: "solid" }}>
                <Left>
                  <Icon name="calendar" style={{ fontSize: 21, color: '#01a4a1', width: 20, marginRight: 10 }} />
                  <Text style={{fontFamily:'Roboto_medium', fontSize:15,}}>Booking History</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
            </TouchableWithoutFeedback>
          </List>
          <List>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("ReviewRatingsListScreen")}>
              <ListItem style={{ borderBottomWidth: 1, borderColor: "#DCDCDC", borderStyle: "solid" }}>
                <Left>
                  <Icon name="star" style={{ fontSize: 23, color: '#01a4a1', width: 20, marginRight: 10 }} />
                  <Text style={{fontFamily:'Roboto_medium', fontSize:15,}}>Ratings & Reviews</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
            </TouchableWithoutFeedback>
          </List>
          <List>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("UsersList")}>
              <ListItem selected style={{ borderBottomWidth: 1, borderColor: "#DCDCDC", borderStyle: "solid" }}>
                <Left>
                  <Icon name="mail" style={{ fontSize: 21, color: '#01a4a1', width: 20, marginRight: 10 }} />
                  <Text style={{fontFamily:'Roboto_medium', fontSize:15,}}>Users</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
            </TouchableWithoutFeedback>
          </List>
          <List>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("ProfileScreen")}>
              <ListItem style={{ borderBottomWidth: 1, borderColor: "#DCDCDC", borderStyle: "solid" }}>
                <Left>
                  <Icon name="contact" style={{ fontSize: 21, color: '#01a4a1', width: 20, marginRight: 10 }} />
                  <Text style={{fontFamily:'Roboto_medium', fontSize:15,}}>Profile</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
            </TouchableWithoutFeedback>
          </List>
          <List>
            <TouchableWithoutFeedback onPress={() => this.setState({ isLogOutModalVisible: true })}>
              <ListItem style={{ borderBottomWidth: 1, borderColor: "#DCDCDC", borderStyle: "solid" }}>
                <Left>
                  <Icon name="contact" style={{ fontSize: 21, color: '#01a4a1', width: 20, marginRight: 10 }} />
                  <Text style={{fontFamily:'Roboto_medium', fontSize:15,}}>Log Out</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
            </TouchableWithoutFeedback>
          </List> */}
          <Modal isVisible={this.state.isLogOutModalVisible}>
            <View style={ styles.modalView }>
              <View style={ styles.modalContainerStyles}>
                <View style={ styles.txtInfoViewStyle }>
                  <Text style={ styles.txtInfo }>{i18n.t('lanLabelAreYouSureYouWantToLogOut')}</Text>
                </View>
                <View style={ styles.btnsParentView } >
                  <View style={ styles.eachBtnView } >
                    <Button onPress={() => this.handleLogOut()}  style={ styles.btnStyle }>
                      <Text style={ styles.btnTxt } >{i18n.t('lanCommonButtonConfirm')} </Text>
                    </Button>
                  </View>
                  <View style={ styles.eachBtnView } >
                    <Button onPress={() => this.handleClose()} style={ styles.cancelBtn } >
                      <Text style={ styles.btnTxt }>{i18n.t('lanCommonButtonCancel')}</Text>
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </Content>
      </Container>
    );
  }
}
const Drawer = createDrawerNavigator(
  {
    Home: { screen: StackNavigator },
  },
  {
    contentComponent: ({ navigation }) => (
      <DrawerContent navigation={navigation} />
    ),
  }
);
const MyApp = createAppContainer(Drawer);
module.exports = MyApp;
