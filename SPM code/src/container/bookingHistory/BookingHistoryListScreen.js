import React from 'react';
import { observer, inject } from 'mobx-react';
import { Text, View, Platform, ScrollView, Dimensions, TouchableHighlight, ImageBackground, StatusBar, TouchableOpacity, Image, ActivityIndicator, FlatList, RefreshControl, BackHandler } from 'react-native';
import { Button, Icon, Header, Container, Tab, Tabs, Content, Footer } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './css/BookingHistoryListCss';
import TabScreen from '../../components/bookingHistory/TabScreen';
import moment from 'moment';
import BookingHistoryEachRow from './BookingHistoryEachRow';
import SearchBar from 'react-native-searchbar';
import i18n from 'i18n-js';
import AwesomeButton from 'react-native-really-awesome-button';
import { any } from 'prop-types';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const layoutHeight = 0;

@inject(['UserStore'], ['PropertyStore'])
@observer
export default class BookingHistoryListScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      SPBookingsList: [],
      search: '',
      status: 'all',
      activePage: 1,
      refreshing: false,
      param1: null,
      loading: false,
      reload: false,
      reloadFunction: ''
    }
    this.handleScrollEnd = this.handleScrollEnd.bind(this);
  }

  // _handleResults(results) {
  //   this.setState({ results });
  // }

  componentWillMount() {
    this.setState({ reload: false })
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    this.setState({ loading : true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading : false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    PropertyStore.getSPBookings(1, 'all', '', function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '0000') {
        _this.setState({ loading: false, SPBookingsList: resObj.statusResult })
      } else {
        _this.setState({ loading: false, SPBookingsList: [] })
      }
    })
  }
  componentDidMount() {
    const navigation = this.props.navigation;
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack()
      return true
    })
  }
  componentWillUnmount() {
    this.backHandler.remove()
  }
  handleChangeTab = ({ i }) => {
    this.searchBar.hide()
    this.setState({ search: '' })
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    this.setState({ loading : true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading : false, reload: true, reloadFunction: 'handleChangeTab', param1: i});
    }, 10000);
    switch (i) {
      case 0:
        let Allstatus = 'all'
        PropertyStore.getSPBookings(1, Allstatus, this.state.search, function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false, status: 'all', activePage: 0 })
        });
        break;
      case 1:
        let upcomingstatus = 'Booked'
        PropertyStore.getSPBookings(1, upcomingstatus, this.state.search, function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false, status: 'Booked', activePage: 0 })
        });
        break;
      case 2:
        let completedstatus = 'Completed'
        PropertyStore.getSPBookings(1, completedstatus, this.state.search, function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false, status: 'Completed', activePage: 0 })
        });
        break;
      default:
        clearTimeout(isLoading)
        _this.setState({ loading: false })
        break;
    }
  }
  handleSearchChange = (Search) => {
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    PropertyStore.getSPBookings(1, _this.state.status, Search, function (resObj) {
    })
  }
  handleSearchBackClick = (Search) => {
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    this.setState({ loading : true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading : false, reload: true, reloadFunction: 'handleSearchBackClick', param1: Search });
    }, 10000);
    PropertyStore.getSPBookings(1, _this.state.status, Search, function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
    })
    this.searchBar.hide()
  }
  handleScrollEnd = (e) => {
    const PropertyStore = this.props.PropertyStore;
    var offset = e.nativeEvent.contentOffset.y;
    var height = e.nativeEvent.contentSize.height;
    if((this.layoutHeight + offset) >= height) {
      if(PropertyStore.BookingListingDataCount > PropertyStore.BookingData.length) {
        const num = this.state.activePage + 1;
        let _this = this;
        this.setState({ loading : true });
        let isLoading = setTimeout(function () {
         _this.setState({ loading : false, reload: true, reloadFunction: 'handleScrollEnd', param1: e });
        }, 10000);
        PropertyStore.getSPBookings(num, _this.state.status, _this.state.search, function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false, activePage: num });
        });
      }
    }
  }
  _onRefresh = () => {
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    this.setState({ refreshing : true });
    let isLoading = setTimeout(function () {
      _this.setState({ refreshing : false, reload: true, reloadFunction: '_onRefresh' });
    }, 10000);
    PropertyStore.getSPBookings(1, _this.state.status, _this.state.search, function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ refreshing: false })
      if (!PropertyStore.internet_connection) {
        _this.props.navigation.navigate('InformationScreen')
      } else if (resObj.statusCode == '0000') {
        PropertyStore.BookingData = resObj.statusResult.bookingData;
        PropertyStore.BookingListingDataCount = resObj.statusResult.totalDocs;   
      }
    });
    
  }
  handleReload = () => {
    switch(this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      case 'handleChangeTab':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleChangeTab(this.state.param1)
        break;
      case 'handleSearchBackClick':
        this.setState({ reload: false, reloadFunction: ''})
        this.handleSearchBackClick(this.state.param1)
        break;
      case 'handleScrollEnd':
        this.setState({ reload: false, reloadFunction: ''})
        this.handleScrollEnd(this.state.param1)
        break;
      case '_onRefresh':
        this.setState({ reload: false, reloadFunction: ''})
        this._onRefresh()
        break;
      default:
        break;
    }
  }
  render() {
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    if (PropertyStore.isLoading == true) {
      userData = <View></View>;
    } else if (PropertyStore.BookingData.length <= 0) {
      userData = <View style={styles.noDataViewStyle} >
        <Text style={styles.noBooking}>{i18n.t('lanLabelNoBookings')}</Text>
      </View>
    }
    else {
      userData =
        <FlatList
          data={PropertyStore.BookingData}
          renderItem={({ item, index }) => <BookingHistoryEachRow navigation={navigation} data={item} i={index} />}
          keyExtractor={(item, index) => index.toString()}
        />
    }
    return (
      !this.state.reload
      ?<View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft} >
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.props.navigation.openDrawer()} >
                <Icon name='ios-menu' style={styles.iconMenuStyle}  />
              </TouchableHighlight>
            </View>
            <View style={styles.headerBody} >
                <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleBookingHistoryList')} </Text>
            </View>
            <View style={styles.headerRight} >
              <View style={{flex:1 }}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()} >
                  <Icon name='ios-search' style={styles.iconSearchStyle} />
                </TouchableHighlight>
              </View>
              <View style={{flex:1 }}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.props.navigation.navigate('BookingsPropertiesList')} >
                  <Icon name='ios-add' style={styles.iconHomeStyle}  />
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <View style={{position:'absolute', top:Platform.OS === 'ios' ? 28 : 21}}>
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
            {/* <SearchHeader
              ref={(searchHeader) => {
                this.searchHeader = searchHeader;
              }}
              placeholder='Search...'
              placeholderColor='gray'
              entryAnimation='from-right-side'
              onClear={() => {
                this.handleSearchChange('')
              }}
              onEnteringSearch={async (text) => {
                if (text) {
                  this.handleSearchChange(text.nativeEvent.text)
                } else {
                  return [];
                }
              }}
              onSearch={async (text) => {
                if (text) {
                  this.handleSearchChange(text.nativeEvent.text)
                } else {
                  return [];
                }
              }}
            /> */}
        </LinearGradient>
        {this.state.loading
          ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#ffffff' size='large' style={ styles.activeIndicatorStyle } /></View>
          : null}
          <View style={styles.content} >
            <Tabs tabBarUnderlineStyle={{ borderBottomWidth: 2, borderColor: '#01a4a1' }} onChangeTab={this.handleChangeTab}>
              <Tab heading= {i18n.t('lanTitleAll')} tabStyle={{ backgroundColor: '#fff' }} textStyle={{ color: '#025d8c', fontSize: 14, fontFamily: 'Roboto_light' }} activeTabStyle={{ backgroundColor: '#fff', }} activeTextStyle={{ color: '#01a4a1', fontFamily: 'Roboto_light' }}>
                <ScrollView
                  onLayout={event => {this.layoutHeight = event.nativeEvent.layout.height;}} onScrollEndDrag={this.handleScrollEnd}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh}
                    />
                  }
                >
                  {userData}
                </ScrollView>  
              </Tab>
              <Tab heading= {i18n.t('lanTitleUpcoming')} tabStyle={{ backgroundColor: '#fff' }} textStyle={{ color: '#025d8c', fontSize: 14, fontFamily: 'Roboto_light' }} activeTabStyle={{ backgroundColor: '#fff', }} activeTextStyle={{ color: '#01a4a1', fontFamily: 'Roboto_light' }}>
                <ScrollView
                  onLayout={event => {this.layoutHeight = event.nativeEvent.layout.height;}} onScrollEndDrag={this.handleScrollEnd}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh}
                    />
                  }
                >
                  {userData}
                </ScrollView> 
              </Tab>
              <Tab heading={i18n.t('lanTitlePast')} tabStyle={{ backgroundColor: '#fff' }} textStyle={{ color: '#025d8c', fontSize: 14, fontFamily: 'Roboto_light' }} activeTabStyle={{ backgroundColor: '#fff', }} activeTextStyle={{ color: '#01a4a1', fontFamily: 'Roboto_light' }}>
                <ScrollView
                  onLayout={event => {this.layoutHeight = event.nativeEvent.layout.height;}} onScrollEndDrag={this.handleScrollEnd}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh}
                    />
                  }
                >
                  {userData}
                </ScrollView> 
              </Tab>
            </Tabs>
          </View>
      </View>
      : <View>
      <LinearGradient colors={['#01A4A2', '#025D8C']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
        <View style={styles.headerMainViewReload} >
          <View style={styles.headerLeftReload} >
            <TouchableOpacity>
              <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => this.componentWillMount()} />
            </TouchableOpacity>
          </View>
          <View style={styles.headerBodyReload} >
            <TouchableOpacity>
              <Text style={styles.headerTitleStyle1}>{i18n.t('lanAppTitle')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      <View style={{ jflex:1, justifyContent:'center', alignItems:'center', width:DEVICE_WIDTH - 20, height:Device_Height - 150}} >
        <View style={ styles.eachBtnView } >
          <LinearGradient colors={['#01A4A2', '#025D8C']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
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