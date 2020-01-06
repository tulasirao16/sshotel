import React from 'react';
import { observer, inject } from 'mobx-react';
import { ScrollView, View, Dimensions, StatusBar, Platform, TouchableOpacity, TouchableHighlight, BackHandler, ActivityIndicator } from 'react-native';
import { Card, CardItem, Text, Icon, Tab, Tabs, } from 'native-base';
import Toast, { DURATION } from 'react-native-easy-toast';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';
import styles from './css/CheckInBookingsCss';
import moment from 'moment';
import SearchBar from 'react-native-searchbar';
import i18n from 'i18n-js';

const layoutHeight = 0;

@inject(['HomeStore'])
@observer
export default class CheckInBookings extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      SPBookingsList: [],
      activePage: 1,
      search: '',
      heading : '',
      reload: false,
      reloadFunction: '',
      loading: false,
    }
    this.handleSupportView = this.handleSupportView.bind(this);
    this.handelBookingsView = this.handelBookingsView.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
  }

  componentWillMount() {
    const HomeStore = this.props.HomeStore;
    const navigation = this.props.navigation;
    const type = navigation.state.params.type;
    const byDateType = navigation.state.params.byDateType;
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    switch (type) {
      case 'Check_In':
        this.setState({heading: i18n.t('lanTitleCheckInBookings')} )
        HomeStore.getSPCheckInBookingsList(byDateType, 1, '', function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false })
        })
        break;
      case 'Check_Out':
        this.setState({heading: i18n.t('lanLabelCheckOutBookings') })
        HomeStore.getSPCheckOutBookingsList(byDateType, 1, '', function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false })
        })
        break;
      case 'Bookings':
        this.setState({heading:  i18n.t('lanLabelBookings')})
        HomeStore.getSPBookingsCountBookingsList(byDateType, 1, '', function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false })
        })
        break;
      case 'Cancelled':
        this.setState({heading:  i18n.t('lanLabelCancelledBookings')})
        HomeStore.getSPBookingsCountCancelledList(byDateType, 1, '', function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false })
        })
        break;
      case 'Amounts':
        this.setState({heading:  i18n.t('lanLabelBookingAmounts')})
        HomeStore.getSPBookingsAmountsList(byDateType, 1, '', function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false })
        })
        break;
    }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  handleBackButtonClick() {
    const navigation = this.props.navigation
    navigation.goBack()
    return true
  }
  handleSearchChange = (Search) => {
    const HomeStore = this.props.HomeStore;
    const navigation = this.props.navigation;
    const type = navigation.state.params.type;
    const byDateType = navigation.state.params.byDateType;
    this.setState({search: Search})
    switch (type) {
      case 'Check_In':
        HomeStore.getSPCheckInBookingsList(byDateType, 1, Search, function (resObj) {
        })
        break;
      case 'Check_Out':
        this.setState({heading: 'CheckOut Bookings'})
        HomeStore.getSPCheckOutBookingsList(byDateType, 1, Search, function (resObj) {
        })
        break;
      case 'Bookings':
        this.setState({heading: 'Bookings'})
        HomeStore.getSPBookingsCountBookingsList(byDateType, 1, Search, function (resObj) {
        })
        break;
      case 'Cancelled':
        this.setState({heading: 'Cancelled Bookings'})
        HomeStore.getSPBookingsCountCancelledList(byDateType, 1, Search, function (resObj) {
        })
        break;
      case 'Amounts':
        this.setState({heading: 'Booking Amounts'})
        HomeStore.getSPBookingsAmountsList(byDateType, 1, Search, function (resObj) {
        })
        break;
    }
  }

  handleSearchBackClick = (Search) => {
    const HomeStore = this.props.HomeStore;
    const navigation = this.props.navigation;
    const type = navigation.state.params.type;
    const byDateType = navigation.state.params.byDateType;
    this.setState({search: Search, loading: true})
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'handleSearchBackClick', param: Search });
    }, 10000);
    switch (type) {
      case 'Check_In':
        HomeStore.getSPCheckInBookingsList(byDateType, 1, Search, function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false })
        })
        break;
      case 'Check_Out':
        this.setState({heading: 'CheckOut Bookings'})
        HomeStore.getSPCheckOutBookingsList(byDateType, 1, Search, function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false })
        })
        break;
      case 'Bookings':
        this.setState({heading: 'Bookings'})
        HomeStore.getSPBookingsCountBookingsList(byDateType, 1, Search, function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false })
        })
        break;
      case 'Cancelled':
        this.setState({heading: 'Cancelled Bookings'})
        HomeStore.getSPBookingsCountCancelledList(byDateType, 1, Search, function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false })
        })
        break;
      case 'Amounts':
        this.setState({heading: 'Booking Amounts'})
        HomeStore.getSPBookingsAmountsList(byDateType, 1, Search, function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false })
        })
        break;
    }
    this.searchBar.hide()
  }

  
  handleScrollEnd = (e) => {
    const HomeStore = this.props.HomeStore;
    const navigation = this.props.navigation;
    const type = navigation.state.params.type;
    const byDateType = navigation.state.params.byDateType;
    var offset = e.nativeEvent.contentOffset.y;
    var height = e.nativeEvent.contentSize.height;
    if((this.layoutHeight + offset) >= height) {
      if(HomeStore.checkInBookingsListCount > HomeStore.checkInBookingsList.length) {
        const num = this.state.activePage + 1;
        this.setState({ loading: true });
        let _this = this;
        let isLoading = setTimeout(function () {
          _this.setState({ loading: false, reload: true, reloadFunction: 'handleScrollEnd', param: e });
        }, 10000);
        switch (type) {
          case 'Check_In':
            HomeStore.getSPCheckInBookingsList(byDateType, num, _this.state.search, function (resObj) {
              clearTimeout(isLoading)
              _this.setState({ loading: false })
            })
            break;
          case 'Check_Out':
            this.setState({heading: 'CheckOut Bookings'})
            HomeStore.getSPCheckOutBookingsList(byDateType, num, _this.state.search, function (resObj) {
              clearTimeout(isLoading)
              _this.setState({ loading: false })
            })
            break;
          case 'Bookings':
            this.setState({heading: 'Bookings'})
            HomeStore.getSPBookingsCountBookingsList(byDateType, num, _this.state.search, function (resObj) {
              clearTimeout(isLoading)
              _this.setState({ loading: false })
            })
            break;
          case 'Cancelled':
            this.setState({heading: 'Cancelled Bookings'})
            HomeStore.getSPBookingsCountCancelledList(byDateType, num, _this.state.search, function (resObj) {
              clearTimeout(isLoading)
              _this.setState({ loading: false })
            })
            break;
          case 'Amounts':
            this.setState({heading: 'Booking Amounts'})
            HomeStore.getSPBookingsAmountsList(byDateType, num, _this.state.search, function (resObj) {
              clearTimeout(isLoading)
              _this.setState({ loading: false })
            })
            break;
        }
      }
    }
  }
  handleSupportView() {
    const navigation = this.props.navigation;
    navigation.navigate('ViewSupport');
  }
  handelBookingsView(data) {
    const navigation = this.props.navigation;
    navigation.navigate('BookingHistoryViewScreen', { BookingData: data });
  }
  handleReload = () => {
    switch (this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      case 'handleSearchBackClick':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleSearchBackClick(this.state.param)
        break;
      case 'handleScrollEnd':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleScrollEnd(this.state.param)
        break;
      default:
        break;
    }
  }
  render() {
    const navigation = this.props.navigation;
    const HomeStore = this.props.HomeStore;
    return (
    !this.state.reload
      ? <View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView}>
            <View style={styles.headerLeft} >
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.props.navigation.openDrawer()} >
                <Icon name='ios-menu' style={styles.iconMenuStyle} />
              </TouchableHighlight>
            </View>
            <View style={styles.headerBody}>
              <Text style={styles.headerTitleStyle}>{this.state.heading}</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={{flex:1 }}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()}>
                  <Icon name='ios-search' style={styles.iconSearchStyle}  />
                </TouchableHighlight>
              </View>
              <View style={{flex:1 }}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.navigate('SPHomeScreen')}>
                  <Icon name='md-home' style={styles.iconHomeStyle} />
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <View style={{position:'absolute', top:Platform.OS === 'ios' ? 28 : 21 }}>
            <SearchBar
              ref={(ref) => this.searchBar = ref}
              handleResults={this._handleResults}
              showOnLoad = {false}
              iOSPadding={false}
              iOSHideShadow={true}
              placeholder={i18n.t('lanCommonLabelSearch')}
              placeholderTextColor='gray'
              handleChangeText={(input) => this.handleSearchChange(input)}
              onBack={(input) => this.handleSearchBackClick(input)}
            />
          </View>
        </LinearGradient>
          {this.state.loading
            ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#fff' style={{ marginLeft: 6 }} size='large' /></View>
            : null
          }
        <View style={styles.content}>
        <ScrollView onLayout={event => {this.layoutHeight = event.nativeEvent.layout.height;}} onScrollEndDrag={this.handleScrollEnd}>
            { HomeStore.checkInBookingsList.length > 0
                ?
                HomeStore.checkInBookingsList.map((data, i) => {
                 return (
            <View style={styles.bodyList} key={i}>
            <TouchableOpacity onPress={() => this.handelBookingsView(data)} >
            <View style={styles.mainComponentView}>
                <View style={styles.hotelContentView} >
                <View style={styles.hotelDetails} >
                    <Text style={styles.textBig}>{data.spPropertyInfoId.propertyTitle}</Text>
                    <Text style={styles.textMedium}>{data.spLocationObj.area}, {data.spLocationObj.city}, {data.spLocationObj.state}</Text>
                    {/* <Text style={styles.textSmall}>{data.euUserId.displayName}</Text> */}
                    <Text style={styles.textSmall}>{data.euMobileNumber}</Text>
                    <Text style={styles.textDate}>{moment(data.checkInDate).format('MMM DD, YY')} - {moment(data.checkOutDate).format('MMM DD, YY')}</Text>
                </View>
                </View>
                <View style={styles.hoteStatusView} >
                <View style={styles.pendingCircle} >
                    <Text style={styles.bookedText}>{data.bookingStatus}</Text>
                </View>
                </View>
            </View>
        </TouchableOpacity>
            </View> )
                })
                : <View style={styles.noAmenities}><Text style={styles.noAmenitiesText}>{i18n.t('lanLabelNoBookingsListed')}</Text></View>
            }
        </ScrollView>
        </View> 
      </View>
      : <View>
      <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
        <View style={styles.headerMainViewReload} >
          <View style={styles.headerLeftReload} >
            <TouchableOpacity>
              <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => navigation.goBack()} />
            </TouchableOpacity>
          </View>
          <View style={styles.headerBodyReload} >
            <TouchableOpacity>
              <Text style={styles.headerTitleStyle}>{i18n.t('lanAppTitle')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      <View style={{ jflex: 1, justifyContent: 'center', alignItems: 'center', width: DEVICE_WIDTH - 20, height: Device_Height - 150 }} >
        <View style={styles.eachBtnView} >
          {/* <Button onPress={() => this.handleReload()}  style={ styles.btnStyle }>
               <Text style={ styles.btnTxt } >Reload </Text>
               </Button> */}
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

