import React from 'react';
import { observer, inject } from 'mobx-react';
import { ScrollView, ActivityIndicator, View, Dimensions, StatusBar,Platform, TouchableHighlight, TouchableOpacity, BackHandler } from 'react-native';
import { Card, CardItem, Text, Icon, Tab, Tabs, } from 'native-base';
import Toast, { DURATION } from 'react-native-easy-toast';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
import SearchBar from 'react-native-searchbar';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';
import styles from './css/HomeScreenBlockedDatesCss';
import moment from 'moment';
import i18n from 'i18n-js';


const layoutHeight = 0;

@inject(['HomeStore'])
@observer
export default class HomeScreenBlockedDates extends React.Component {
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
      loading: false

    }
    this.handleSupportView = this.handleSupportView.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
  }
  componentWillMount() {
    const HomeStore = this.props.HomeStore;
    const navigation = this.props.navigation;
    const byDateType = navigation.state.params.byDateType;
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    HomeStore.getSPHomeScreenBlockedDatesList(1, '', byDateType, function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
    })
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
    const byDateType = navigation.state.params.byDateType;
    this.setState({search: Search})
    HomeStore.getSPHomeScreenBlockedDatesList(1, Search, byDateType, function (resObj) {
    })
  }
  handleScrollEnd = (e) => {
    const HomeStore = this.props.HomeStore;
    const navigation = this.props.navigation;
    var offset = e.nativeEvent.contentOffset.y;
    var height = e.nativeEvent.contentSize.height;
    if((this.layoutHeight + offset) >= height) {
      if(HomeStore.checkInBookingsListCount > HomeStore.checkInBookingsList.length) {
        const num = this.state.activePage + 1;
        const byDateType = navigation.state.params.byDateType;
        this.setState({ loading: true });
        let _this = this;
        let isLoading = setTimeout(function () {
          _this.setState({ loading: false, reload: true, reloadFunction: 'handleScrollEnd', param: e });
        }, 10000);
        HomeStore.getSPHomeScreenBlockedDatesList(num, _this.state.search, byDateType, function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false })
        })
      }
    }
  }
  handleSupportView() {
    const navigation = this.props.navigation;
    navigation.navigate('ViewSupport');
  }
  handleSearchBackClick = () => {
    this.handleSearchChange('')
    this.searchBar.hide()
  }
  handleReload = () => {
    switch (this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
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
            <View style={styles.headerMainView} >
              <View style={styles.headerLeft} >
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.props.navigation.openDrawer()}>
                  <Icon name='ios-menu' style={styles.iconMenuStyle}  />
                </TouchableHighlight>
              </View>
              <View style={styles.headerBody} >
                <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleBlockedDates')}</Text>
              </View>
              <View style={styles.headerRight}>
                <View style={{flex:1 }}>
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()}>
                    <Icon name='ios-search' style={styles.iconSearchStyle} />
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
              showOnLoad = {false}
              iOSPadding={false}
              iOSHideShadow={true}
              placeholder={i18n.t('lanLabelSearch')}
              placeholderTextColor='gray'
              handleChangeText={(input) => this.handleSearchChange(input)}
              onBack={() => this.handleSearchBackClick('')}
            />
          </View>
        </LinearGradient>
          {this.state.loading
            ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#FFFFFF' size='large' style={styles.activeIndicatorStyle} /></View>
            : null}
        <ScrollView onLayout={event => {this.layoutHeight = event.nativeEvent.layout.height;}} onScrollEndDrag={this.handleScrollEnd}>
            { (HomeStore.homeScreenBlockedDatesList && HomeStore.homeScreenBlockedDatesList.length > 0)
                ?
                HomeStore.homeScreenBlockedDatesList.map((data, i) => {
                    return (
            <View key={i} style={styles.bodyList}>
            <View style={styles.mainComponentView}>
            <TouchableOpacity onPress={this.handleCalendar} >
            <Card style={styles.card}>
              <CardItem style={styles.cardItem}>
                <View style={styles.listMain}>
                  <Text style={styles.ServiceTitle}> {data.propertyId.propertyTitle} </Text>
                </View>
              </CardItem>
              <CardItem style={styles.cardItem}>
                <View style={styles.listMain}>
                  <View style={styles.timeLabel}>
                    <Text style={styles.bookingTextLabel}>{i18n.t('lanLabelBlockingType')} </Text>
                  </View>
                  <View  style={styles.timeValue}>
                    <Text style={styles.bookingTextEnd}>: {data.blockingType} </Text>
                  </View>
                </View>
              </CardItem>
              <CardItem style={styles.cardItem}>
                <View style={styles.listMain}>
                  <View style={styles.timeLabel}>
                    <Text style={styles.bookingTextLabel}> {i18n.t('lanLabelFromDate')}  </Text>
                  </View>
                  <View  style={styles.timeValue}>
                    <Text style={styles.bookingTextEnd}>: {moment(data.blockingFromDate).format('MMM DD, YYYY')} </Text>
                  </View>
                </View>
              </CardItem>

              <CardItem style={styles.cardItem}>
                <View style={styles.listMain}>
                  <View style={styles.timeLabel}>
                    <Text style={styles.bookingTextToLabel}> {i18n.t('lanLabelToDate')} </Text>
                  </View>
                  <View style={styles.timeValue}>
                    <Text style={styles.bookingTextEnd}> : {data.blockingToDate ? moment(data.blockingToDate).format('MMM DD, YYYY'): null} </Text>
                  </View>
                </View>
              </CardItem>
            </Card>
          </TouchableOpacity>
               
            </View>
            </View> )
                })
                : <View style={styles.noAmenities}><Text style={styles.noAmenitiesText}>{i18n.t('lanLabelNoBlockedDates')}  </Text></View>
            }
        </ScrollView>
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
              <Text style={styles.headerTitleStyle1}>{i18n.t('lanAppTitle')}</Text>
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

