import React from 'react';
import { ActivityIndicator, AsyncStorage, Image, Dimensions, Animated, Platform, TouchableHighlight, TouchableOpacity, ScrollView } from 'react-native';
import { Icon, View, Text, Picker } from 'native-base';
import { observer, inject } from 'mobx-react';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './css/SPHomeScreenCss';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import en from '../../../assets/i18n/en_Us.json'
import hn from '../../../assets/i18n/hn_Ind.json'
import te from '../../../assets/i18n/te_Ind.json'
import AwesomeButton from 'react-native-really-awesome-button';

i18n.fallbacks = true;
i18n.translations = { en, hn, te };
i18n.locale = Localization.locale;
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

@inject(['HomeStore'], ['PropertyStore'], ['MessageStore'])
@observer
export default class ServiceProviderHome extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: '',
      countryCode: '',
      shift: new Animated.Value(0),
      errorMessage: '',
      disableButton: false,
      dateType: 'Today',
      checkInsCount: 0,
      cancelledCount: 0,
      confirmedCount: 0,
      checkInBookedCount: 0,
      checkInConfirmedCount: 0,
      checkInCheckInsCount: 0,
      checkOutCheckInsCount: 0,
      checkOutCheckOutsCount: 0,
      bookingsCount: 0,
      bookingsBookedCount: 0,
      bookingsCheckInsCount: 0,
      bookingsCheckOutsCount: 0,
      bookingsConfirmedCount: 0,
      bookingsCancelledCount: 0,
      BookedAmount: 0,
      ConfirmedAmount: 0,
      CheckInsAmount: 0,
      CheckOutsAmount: 0,
      CancelledAmount: 0,
      messagesCount: 0,
      reviewsCount: 0,
      propertysCount: 0,
      blockedDatesCount: 0,
      notificationsUnreadCount: 0,
      locale: '',
      reload: false,
      reloadFunction: '',
      loading: false
    };
    this.handlePropertyList = this.handlePropertyList.bind(this);
    this.handleCreateBooking = this.handleCreateBooking.bind(this);
    this.handleService = this.handleService.bind(this);
    this.onPressCheckInCount = this.onPressCheckInCount.bind(this);
    this.onPressCheckOutCount = this.onPressCheckOutCount.bind(this);
    this.onPressBookingsCount = this.onPressBookingsCount.bind(this);
    this.onPressCancelledCount = this.onPressCancelledCount.bind(this);
    this.onPressAmounts = this.onPressAmounts.bind(this);
    this.handleOnNavigateBack = this.handleOnNavigateBack.bind(this);
  }

  async componentWillMount() {
    const prevLocale = await AsyncStorage.getItem('Setlocale');
    i18n.locale = prevLocale
    this.setState({
      locale: prevLocale,
      dateType: 'Today',
      checkInsCount: 0,
      cancelledCount: 0,
      confirmedCount: 0,
      checkInBookedCount: 0,
      checkInConfirmedCount: 0,
      checkInCheckInsCount: 0,
      checkOutCheckInsCount: 0,
      checkOutCheckOutsCount: 0,
      bookingsCount: 0,
      bookingsBookedCount: 0,
      bookingsCheckInsCount: 0,
      bookingsCheckOutsCount: 0,
      bookingsConfirmedCount: 0,
      bookingsCancelledCount: 0,
      CompletedAmount: 0,
      BookedAmount: 0,
      ConfirmedAmount: 0,
      CheckInsAmount: 0,
      CheckOutsAmount: 0,
      CancelledAmount: 0,
      messagesCount: 0,
      reviewsCount: 0,
      propertysCount: 0,
      blockedDatesCount: 0,
      notificationsUnreadCount: 0
    })
    const HomeStore = this.props.HomeStore;
    const navigation = this.props.navigation;
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    HomeStore.getSPHomeScreenBookingsCount('Today', function (resObj) {
      clearTimeout(isLoading)
      if(resObj.statusCode == '9999') {
        _this.setState({ loading: false })
        navigation.navigate('InformationScreen');
      } else if (resObj.statusCode == '0000') {
        _this.setState({ loading: false })
        if (resObj.statusResult.messagesCount && resObj.statusResult.messagesCount.length) {
          _this.setState({messagesCount: resObj.statusResult.messagesCount[0].count})
        }
        if (resObj.statusResult.reviewsCount && resObj.statusResult.reviewsCount.length) {
          _this.setState({reviewsCount: resObj.statusResult.reviewsCount[0].count})
        }
        if (resObj.statusResult.propertysCount && resObj.statusResult.propertysCount.length) {
          _this.setState({propertysCount: resObj.statusResult.propertysCount[0].count})
        }
        if (resObj.statusResult.blockedDatesCount && resObj.statusResult.blockedDatesCount.length) {
          _this.setState({blockedDatesCount: resObj.statusResult.blockedDatesCount[0].count})
        }
        if (resObj.statusResult.notificationsUnreadCount && resObj.statusResult.notificationsUnreadCount.length) {
          _this.setState({notificationsUnreadCount: resObj.statusResult.notificationsUnreadCount[0].count})
        }
        resObj.statusResult.bookingsAmount.forEach(data => {
          if (data._id == 'Booked') {
            _this.setState({ BookedAmount: data.total });
          }
          if (data._id == 'Confirmed') {
            _this.setState({ ConfirmedAmount: data.total });
          }
          if (data._id == 'Checked-In') {
            _this.setState({ CheckInsAmount: data.total });
          }
          if (data._id == 'Checked-Out') {
            _this.setState({ CheckOutsAmount: data.total });
          }
          if (data._id == 'Cancelled') {
            _this.setState({ CancelledAmount: data.total });
          }
          if (data._id === 'Completed') {
            _this.setState({ CompletedAmount: data.total })
          }
        });
        resObj.statusResult.bookingsCount.forEach(data => {
          if (data._id == 'Booked') {
            _this.setState({ bookingsBookedCount: data.myCount });
          }
          if (data._id == 'Confirmed') {
            _this.setState({ bookingsConfirmedCount: data.myCount });
          }
          if (data._id == 'Checked-In') {
            _this.setState({ bookingsCheckInsCount: data.myCount });
          }
          if (data._id == 'Checked-Out') {
            _this.setState({ bookingsCheckOutsCount: data.myCount });
          }
          if (data._id == 'Cancelled') {
            _this.setState({ bookingsCancelledCount: data.myCount });
          }
        });
        resObj.statusResult.checkInsCount.forEach(data => {
          if (data._id == 'Booked') {
            _this.setState({ checkInBookedCount: data.myCount });
          }
          if (data._id == 'Checked-In') {
            _this.setState({ checkInCheckInsCount: data.myCount });
          }
          if (data._id == 'Confirmed') {
            _this.setState({ checkInConfirmedCount: data.myCount });
          }
        });
        resObj.statusResult.checkOutsCount.forEach(data => {
          if (data._id == 'Checked-In') {
            _this.setState({ checkOutCheckInsCount: data.myCount });
          }
          if (data._id == 'Checked-Out') {
            _this.setState({ checkOutCheckOutsCount: data.myCount });
          }
        });
      }  else {
        _this.setState({ loading: false })
      }
    });
  }

  componentWillReceiveProps () {
    let _this = this
    setTimeout(function () {
      _this.handleDateTypeChange(_this.state.dateType)
    }, 2000);
  }
  
  _onButtonNextPress() {
    navigation = this.props.navigation
    navigation.navigate('PropertiesList')
  }
  handlePropertyList() {
    const navigation = this.props.navigation
    navigation.navigate('HomeScreenTwo')
  }
  handleCreateBooking() {
    const navigation = this.props.navigation
    navigation.navigate('BookingsPropertiesList')
  }

  handleService() {
    const navigation = this.props.navigation
    navigation.navigate('HomeScreenThree')
  }

  handleBlocking () {
    const navigation = this.props.navigation;
    navigation.navigate('HomeScreenBlockedDates', { byDateType: this.state.dateType});
    // var propertyData = {
    //     propertyID: data._id,
    //     spLocationId: data.spLocationId,
    //     spServiceProviderId: data.spServiceProviderId,
    //     propertyTitle: data.propertyTitle,
    //     propertyType: data.propertyType,
    //     propertyImage: data.imagePath,
    //     propertyAction: this.state.propertyAction
    // };
    // navigation.navigate('BlockDatesScreen', { propertyObj: propertyData });
  }
  onPressCheckInCount () {
    const navigation = this.props.navigation;
    navigation.navigate('CheckInBookings', {type: 'Check_In', byDateType: this.state.dateType});
  }
  onPressCheckOutCount () {
    const navigation = this.props.navigation;
    navigation.navigate('CheckInBookings', {type: 'Check_Out', byDateType: this.state.dateType});
  }
  onPressBookingsCount () {
    const navigation = this.props.navigation;
    navigation.navigate('CheckInBookings', {type: 'Bookings', byDateType: this.state.dateType});
  }
  onPressCancelledCount () {
    const navigation = this.props.navigation;
    navigation.navigate('CheckInBookings', {type: 'Cancelled', byDateType: this.state.dateType});
  }
  onPressAmounts () {
    const navigation = this.props.navigation;
    navigation.navigate('CheckInBookings', {type: 'Amounts', byDateType: this.state.dateType});
  }
  onPressReviewRatings () {
    const navigation = this.props.navigation;
    AsyncStorage.setItem('isTimeBased', 'True');
    navigation.navigate('HomeScreenReviewRatings', { byDateType: this.state.dateType});
  }
  handleOnNavigateBack = () => {
    this.setState({ notificationsUnreadCount: 0 })
  //   let _this = this;
  //   const HomeStore = this.props.HomeStore;
  //   HomeStore.getSPHomeScreenBookingsCount(function (resObj) {
  //     if(resObj.statusCode == '0000') {
  //       _this.setState({notificationsUnreadCount: resObj.statusResult.notificationsUnreadCount && resObj.statusResult.notificationsUnreadCount[0] ? resObj.statusResult.notificationsUnreadCount[0] : 0})
  //   }
  // });
  }
  handleNavigationOnClick (screen) {
    const navigation = this.props.navigation;
    AsyncStorage.setItem('ScreenName', screen);
    switch(screen) {
      case 'PropertiesList':
        navigation.navigate('PropertiesList', {refresh: 'refresh'})
        break;
        case 'SPInboxScreen':
        navigation.navigate('SPInboxScreen', {refresh: 'refresh'})
        break;
        case 'HomeScreenReviewRatings':
        this.onPressReviewRatings()
        // navigation.navigate('ReviewRatingsListScreen', {refresh: 'refresh'})
        break;
        default:
        navigation.navigate('SPHomeScreen')
    }
  }

  handleDateTypeChange (dateType) {
    this.setState({
      dateType: dateType,
      checkInsCount: 0,
      cancelledCount: 0,
      confirmedCount: 0,
      checkInBookedCount: 0,
      checkInConfirmedCount: 0,
      checkInCheckInsCount: 0,
      checkOutCheckInsCount: 0,
      checkOutCheckOutsCount: 0,
      bookingsCount: 0,
      bookingsBookedCount: 0,
      bookingsCheckInsCount: 0,
      bookingsCheckOutsCount: 0,
      bookingsConfirmedCount: 0,
      bookingsCancelledCount: 0,
      CompletedAmount: 0,
      BookedAmount: 0,
      ConfirmedAmount: 0,
      CheckInsAmount: 0,
      CheckOutsAmount: 0,
      CancelledAmount: 0,
      messagesCount: 0,
      reviewsCount: 0,
      propertysCount: 0,
      blockedDatesCount: 0,
      notificationsUnreadCount: 0
    })
    const HomeStore = this.props.HomeStore;
    const navigation = this.props.navigation;
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'handleDateTypeChange'});
    }, 10000);
    HomeStore.getSPHomeScreenBookingsCount(dateType, function (resObj) {
      clearTimeout(isLoading)
      if(resObj.statusCode == '9999') {
        _this.setState({ loading: false })
        navigation.navigate('InformationScreen');
      } else if (resObj.statusCode == '0000') {
        _this.setState({ loading: false })
        if (resObj.statusResult.messagesCount && resObj.statusResult.messagesCount.length) {
          _this.setState({messagesCount: resObj.statusResult.messagesCount[0].count})
        }
        if (resObj.statusResult.reviewsCount && resObj.statusResult.reviewsCount.length) {
          _this.setState({reviewsCount: resObj.statusResult.reviewsCount[0].count})
        }
        if (resObj.statusResult.propertysCount && resObj.statusResult.propertysCount.length) {
          _this.setState({propertysCount: resObj.statusResult.propertysCount[0].count})
        }
        if (resObj.statusResult.blockedDatesCount && resObj.statusResult.blockedDatesCount.length) {
          _this.setState({blockedDatesCount: resObj.statusResult.blockedDatesCount[0].count})
        }
        if (resObj.statusResult.notificationsUnreadCount && resObj.statusResult.notificationsUnreadCount.length) {
          _this.setState({notificationsUnreadCount: resObj.statusResult.notificationsUnreadCount[0].count})
        }
        resObj.statusResult.bookingsAmount.forEach(data => {
          if (data._id == 'Booked') {
            _this.setState({ BookedAmount: data.total });
          }
          if (data._id == 'Confirmed') {
            _this.setState({ ConfirmedAmount: data.total });
          }
          if (data._id == 'Checked-In') {
            _this.setState({ CheckInsAmount: data.total });
          }
          if (data._id == 'Checked-Out') {
            _this.setState({ CheckOutsAmount: data.total });
          }
          if (data._id == 'Cancelled') {
            _this.setState({ CancelledAmount: data.total });
          }
          if (data._id === 'Completed') {
            _this.setState({ CompletedAmount: data.total })
          }
        });
        resObj.statusResult.bookingsCount.forEach(data => {
          if (data._id == 'Booked') {
            _this.setState({ bookingsBookedCount: data.myCount });
          }
          if (data._id == 'Confirmed') {
            _this.setState({ bookingsConfirmedCount: data.myCount });
          }
          if (data._id == 'Checked-In') {
            _this.setState({ bookingsCheckInsCount: data.myCount });
          }
          if (data._id == 'Checked-Out') {
            _this.setState({ bookingsCheckOutsCount: data.myCount });
          }
          if (data._id == 'Cancelled') {
            _this.setState({ bookingsCancelledCount: data.myCount });
          }
        });
        resObj.statusResult.checkInsCount.forEach(data => {
          if (data._id == 'Booked') {
            _this.setState({ checkInBookedCount: data.myCount });
          }
          if (data._id == 'Checked-In') {
            _this.setState({ checkInCheckInsCount: data.myCount });
          }
          if (data._id == 'Confirmed') {
            _this.setState({ checkInConfirmedCount: data.myCount });
          }
        });
        resObj.statusResult.checkOutsCount.forEach(data => {
          if (data._id == 'Checked-In') {
            _this.setState({ checkOutCheckInsCount: data.myCount });
          }
          if (data._id == 'Checked-Out') {
            _this.setState({ checkOutCheckOutsCount: data.myCount });
          }
        });
      }  else {
        _this.setState({ loading: false })
      }
    });
  }
  changeLocale = (locale) => {
    i18n.locale = locale
    AsyncStorage.setItem('Setlocale', locale)
    this.setState({ locale: locale })
  }
  handleReload = () => {
    switch (this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      case 'handleDateTypeChange':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleDateTypeChange(this.state.dateType)
        break;
      default:
        break;
    }
  }
  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    let params = navigation.state.params;
    const MessageStore = this.props.MessageStore;
    return (
      !this.state.reload
        ? <View style={styles.container}>
          <View style={styles.header}>
            <LinearGradient colors={['#019fa0', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearGradientStyle}>
              <View style={styles.headerMainView} >
                <View style={styles.headerLeft} >
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.openDrawer()} >
                    <Icon name='ios-menu' style={styles.menuIcon} />
                  </TouchableHighlight>
                </View>
                <View style={styles.headerBody} >
                  <Text style={styles.headerTitleStyle}>{i18n.t('lanLabelHome')}</Text>
                </View>
                <View style={styles.headerRight}>
                  <View style={{ flex: Platform.OS === 'ios' ? 1 : 1, justifyContent: 'center', alignItems:'center' }} >
                    <Picker
                      mode='dropdown'
                      // iosIcon={<Icon name='arrow-down' style={{ color: '#fff' }} />}
                      placeholder='English'
                      placeholderStyle={{ color: '#fff' }}
                      placeholderIconColor='#fff'
                      selectedValue={this.state.locale}
                      style={{ width:(Platform.OS === 'ios' ? 100 : 100), marginTop:(Platform.OS === 'ios' ? 5 : 5), marginRight:(Platform.OS === 'ios' ? 10 : 0), color:'#fff', backgroundColor:'transparent',  }}
                      textStyle={{ fontSize: (Platform.OS === 'ios' ? 18 : 14) , color:'#ffffff'}}
                      onValueChange={this.changeLocale}>
                      <Picker.Item label='English' value={'en-GB'} />
                      <Picker.Item label='తెలుగు' value={'te-GB'} />
                      <Picker.Item label={'हिंदी'} value={'hn-GB'} />
                    </Picker>
                  </View>
                  <View style={{ flex: Platform.OS === 'android' ? 1 : 1, justifyContent: 'center', alignItems:'center' }}>
                    <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.componentWillMount()}>
                      <Icon name='refresh' style={styles.refreshIcon} />
                    </TouchableHighlight>
                  </View>
                  <View style={{ flex: Platform.OS === 'android' ? 1 : 1, justifyContent: 'center', alignItems:'center' }}>
                    <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.navigate('NotificationsListScreen', { onNavigateBack: this.handleOnNavigateBack, notificationsUnreadCount: this.state.notificationsUnreadCount })} >
                      <View style={styles.headerbellIcon} >
                        <Icon name='ios-notifications' style={styles.iconBellStyle} />
                        {/* <View style={ styles.notificationCircle} >
                      <Text style={{fontSize:10}}>{this.state.notificationsUnreadCount}</Text>
                      </View> */}
                        {(this.state.notificationsUnreadCount && this.state.notificationsUnreadCount > 0) ?
                          <View style={styles.notificationCircle}>
                            <Text style={{ fontSize: 12, color: '#fff' }}>{this.state.notificationsUnreadCount}</Text>
                          </View>
                          : null
                        }
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
          {this.state.loading
            ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#FFFFFF' size='large' style={styles.activeIndicatorStyle} /></View>
            : null}
          <View style={{marginTop: Platform.OS === 'ios' ? -95 : -95,  }}>
            <View style={{ marginHorizontal:20, width:DEVICE_WIDTH-20, }}>
            <View style={styles.viewOne} >
              <View style={{ borderBottomWidth: 1, marginHorizontal: 10, marginBottom: 15, borderBottomColor: '#01a4a2', marginTop: -10, }} >
                <Picker
                  mode='dropdown'
                  iosIcon={<Icon name='arrow-down' />}
                  style={{ width: DEVICE_WIDTH - 50, }}
                  selectedValue={this.state.dateType}
                  // selectedValue={this.state.dateType}
                  onValueChange={(value) => this.handleDateTypeChange(value)} >
                  <Picker.Item label='Last Week' value='LastWeek' />
                  <Picker.Item label='Last Day' value='LastDay' />
                  <Picker.Item label='Current Day' value='Today' />
                  <Picker.Item label='Current Week' value='Week' />
                  <Picker.Item label='Current Month' value='Month' />
                  <Picker.Item label='Current Year' value='Year' />
                </Picker>
              </View>
              <View style={styles.eachRowParent} >
                <View style={styles.eachView} >
                  <TouchableOpacity onPress={this.onPressCheckInCount}>
                    <View style={{ width: 40, height: 40, paddingtop: 5 }}>
                      <Image source={require('../../../assets/small-calendar.png')} style={styles.imgStyle} />
                    </View>
                    <View style={{ paddtingTop: 5 }} >
                      <Text style={styles.tabTitle}>{i18n.t('lanLabelCheckIn')}</Text>
                      <Text style={styles.countFont}>{this.state.checkInCheckInsCount}/{this.state.checkInCheckInsCount + this.state.checkInConfirmedCount + this.state.checkInBookedCount}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.eachView} >
                  <TouchableOpacity onPress={this.onPressCheckOutCount}>
                    <View style={{ width: 40, height: 40, paddingtop: 5 }}>
                      <Image source={require('../../../assets/checkout.png')} style={styles.imgStyle} />
                    </View>
                    <Text style={styles.tabTitle}>{i18n.t('lanLabelCheckOut')}</Text>
                    <Text style={styles.countFont} >{this.state.checkOutCheckOutsCount}/{this.state.checkOutCheckOutsCount + this.state.checkOutCheckInsCount}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.eachView} >
                  <TouchableOpacity onPress={this.onPressBookingsCount}>
                    <View style={{ width: 40, height: 40, paddingtop: 5 }}>
                      <Image source={require('../../../assets/booking-blue.png')} style={styles.imgStyle} />
                    </View>
                    <Text style={styles.tabTitle}>{i18n.t('lanLabelBookings')}</Text>
                    <Text style={styles.countFont} >{this.state.bookingsBookedCount + this.state.bookingsConfirmedCount + this.state.bookingsCheckInsCount + this.state.bookingsCheckOutsCount}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.eachView} >
                  <TouchableOpacity onPress={this.onPressCancelledCount}>
                    <View style={{ width: 40, height: 40, paddingtop: 5 }}>
                      <Image source={require('../../../assets/booking-blue.png')} style={styles.imgStyle} />
                    </View>
                    <Text style={styles.tabTitle}>{i18n.t('lanLabelCancelled')}</Text>
                    <Text style={styles.countFont} >{this.state.bookingsCancelledCount}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            </View>
            <View style={{ marginHorizontal: 20, width: DEVICE_WIDTH - 20, height: DEVICE_HEIGHT - DEVICE_HEIGHT / 2.7, }} >
            <ScrollView>
              <TouchableOpacity onPress={() => this.handleNavigationOnClick('PropertiesList')} >
                <View style={styles.viewTwo} >
                  <View style={[styles.eachViewTwoIcon, styles.eachViewPropertyIconBg]} >
                    <View style={{ width: 50, height: 50, paddingtop: 5 }}>
                      <Image source={require('../../../assets/check-list.png')} style={styles.imgStyle} />
                    </View>
                  </View>
                  <View style={styles.eachViewTwoBody} >
                    <Text style={styles.tabTitleOne}>{i18n.t('lanLabelPropertyList')}</Text>
                  </View>
                  <View style={styles.eachViewTwoPrice} >
                    <Text style={styles.countFont} >{this.state.propertysCount}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.handleNavigationOnClick('SPInboxScreen')} >
                <View style={styles.viewTwo} >
                  <View style={[styles.eachViewTwoIcon, styles.eachViewMessageBodyBg]} >
                    <Icon name='mail' style={styles.tabIcon} />
                  </View>
                  <View style={styles.eachViewTwoBody} >
                    <Text style={styles.tabTitleOne}>{i18n.t('lanLabelMessages')}</Text>
                  </View>
                  <View style={styles.eachViewTwoPrice} >
                    {/* <Text style={ styles.countFont } >{ ' ' + MessageStore.MessagesUnReadCount + ' '}</Text> */}
                    <Text style={styles.countFont} >{this.state.messagesCount}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.handleNavigationOnClick('HomeScreenReviewRatings')} >
                <View style={styles.viewTwo} >
                  <View style={[styles.eachViewTwoIcon, styles.eachStarBodyBg]} >
                    <Icon name='star' style={styles.starIcon} />
                  </View>
                  <View style={styles.eachViewTwoBody} >
                    <Text style={styles.tabTitleOne}>{i18n.t('lanLabelReviewRatings')}</Text>
                  </View>
                  <View style={styles.eachViewTwoPrice} >
                    <Text style={styles.countFont} >{this.state.reviewsCount}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onPressAmounts} >
                <View style={styles.viewTwoAmount} >
                  <View style={[styles.eachViewTwoIcon, styles.eachViewTwoAmountBg]} >
                    <View style={{ width: 50, height: 50, paddingtop: 5 }}>
                      <Image source={require('../../../assets/money.png')} style={styles.imgStyle} />
                    </View>
                  </View>
                  <View style={styles.eachViewTwoBody} >
                    <Text style={styles.tabTitleOne}>{i18n.t('lanLabelAmount')}</Text>
                    {/* <Text style={styles.tabTitleOneSmall}>Booking Total: {'\u20B9'} {this.state.BookedAmount + this.state.ConfirmedAmount + this.state.CheckInsAmount + this.state.CheckOutsAmount + this.state.CancelledAmount} </Text>
                      <Text style={styles.tabTitleOneSmall}>Booking Cancelled: {'\u20B9'} {this.state.CancelledAmount} </Text>
                      <Text style={styles.tabTitleOneSmall}>SP Amount: {'\u20B9'} {this.state.BookedAmount + this.state.ConfirmedAmount + this.state.CheckInsAmount + this.state.CheckOutsAmount} </Text> */}
                  </View>
                  <View style={styles.eachViewTwoPrice} >
                    <Text style={styles.countFont} >{'\u20B9'} {this.state.BookedAmount + this.state.ConfirmedAmount + this.state.CheckInsAmount + this.state.CheckOutsAmount + this.state.CompletedAmount}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.handleBlocking()} >
                <View style={styles.viewTwo} >
                  <View style={[styles.eachViewTwoIcon, styles.eachViewTwoBlockedBg]} >
                    <View style={{ width: 50, height: 50, paddingtop: 5 }}>
                      <Image source={require('../../../assets/calendar.png')} style={styles.imgStyle} />
                    </View>
                  </View>
                  <View style={styles.eachViewTwoBody} >
                    <Text style={styles.tabTitleOne}>{i18n.t('lanLabelBlockdates')}</Text>
                  </View>
                  <View style={styles.eachViewTwoPrice} >
                    <Text style={styles.countFont} >{this.state.blockedDatesCount}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('BookingsPropertiesList')} >
                <View style={styles.viewTwo} >
                  <View style={[styles.eachViewTwoIcon, styles.CreatePropertyIconBg]} >
                    <Icon name='business' style={styles.businessIcon} />
                  </View>
                  <View style={styles.eachViewTwoBody} >
                    <Text style={styles.tabTitleOne}>{i18n.t('lanLabelCreateBooking')}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={ this.handleService} >
                  <View style={styles.viewTwo} >
                    <View style={[styles.eachViewTwoIcon, styles.eachViewTwoIconBg ]} >
                      <View style={{ width:50, height:50, paddingtop:5}}>
                        <Image source={require('../../../assets/service-white.png')} style={ styles.imgStyle } />
                      </View>
                    </View>
                    <View style={styles.eachViewTwoBody} >
                      <Text style={styles.tabTitleOne}>{i18n.t('lanLabelServices')}</Text>
                    </View>
                    <View style={styles.eachViewTwoPrice} >
                      <Text style={styles.countFont} >10</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={ this.handlePropertyList} >
                  <View style={styles.viewTwo} >
                    <View style={[styles.eachViewTwoIcon, styles.eachViewTwoBodyBg ]} >
                      <View style={{ width:50, height:50, paddingtop:5}}>
                        <Image source={require('../../../assets/discount-voucher.png')} style={ styles.imgStyle } />
                      </View>
                    </View>
                    <View style={styles.eachViewTwoBody} >
                      <Text style={styles.tabTitleOne}>{i18n.t('lanLabelOffers')}</Text>
                    </View>
                    <View style={styles.eachViewTwoPrice} >
                      <Text style={styles.countFont} >2</Text>
                    </View>
                  </View>
                </TouchableOpacity> */}

            </ScrollView>
          </View>
          </View>
        </View>
        : <View>
          <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <View style={styles.headerMainViewReload} >
              <View style={styles.headerBodyReload} >
                <TouchableOpacity>
                  <Text style={styles.headerTitleStyle1}>{i18n.t('lanAppTitle')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
          <View style={{ jflex: 1, justifyContent: 'center', alignItems: 'center', width: DEVICE_WIDTH - 20, height: DEVICE_HEIGHT - 150 }} >
            <View style={styles.eachBtnView} >
              <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                <AwesomeButton block success
                  onPress={() => this.handleReload()}
                  width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                  <Text style={styles.BtnText}>{i18n.t('lanButtonReload')}</Text>
                </AwesomeButton>
              </LinearGradient>
            </View>
            <Text style={styles.serverNotText} >{i18n.t('lanLabelServerNotResponding')}</Text>
          </View>
        </View>
    );
  }
}
