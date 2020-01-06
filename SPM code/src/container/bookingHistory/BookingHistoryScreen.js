
import React from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StatusBar, Text, View, Platform, ScrollView, Dimensions, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { Icon, Button } from 'native-base';
import SearchBar from 'react-native-searchbar';
import { observer, inject } from 'mobx-react';

import BookingHistoryCompont from '../../components/bookingHistory/BookingHistoryCompont';
import styles from './css/BookingHistoryScreenCss';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from 'i18n-js';
import AwesomeButton from 'react-native-really-awesome-button';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['BookingStore'])
@observer
export default class BookingHistoryScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loading: false,
      reload: false,
      reloadFunction: '',
    }
  }
  componentWillMount() {
    const BookingStore = this.props.BookingStore;
    let _this = this;
    this.setState({ loading : true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading : false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    BookingStore.getServiceProviderBookingsData(1, '', function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
    });
  }
  handleSearchChange = (Search) => {
    const BookingStore = this.props.BookingStore;
    BookingStore.getServiceProviderBookingsData(1, Search, function (resObj) {
    });
  }
  handleSearchBackClick = () => {
    this.componentWillMount()
    this.searchBar.hide()
  }
  handleReload = () => {
    switch(this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      default:
        break;
    }
  }
  render() {
    const navigation = this.props.navigation;
    const BookingStore = this.props.BookingStore;
    let bookingsData =
      <View style={{ marginTop: 100, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'blue' }}>{i18n.t('lanLabelEmpty')}</Text>
        {/* <DoubleCircleLoader/> */}
      </View>;
    if (!BookingStore.internet_connection) {
      messagedata = <View style={{ marginTop: 200, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Button transparent full onPress={() => this.Refresh()} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'red', fontSize: 20 }}>{i18n.t('lanLabelNoInternetConnection')}</Text>
        </Button>
      </View>;
    } else if (!BookingStore.ServiceProviderBookingsData) {
      bookingsData = <View style={{ marginTop: 100, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'blue' }}>{i18n.t('lanLabelNoMessages')}</Text>
      </View>;
    } else {
      bookingsData =
        <View style={{ justifyContent: 'center', flex: 1, paddingTop: (Platform.OS === 'iOS') ? 20 : 0 }}>
          {BookingStore.isLoading ? (<ActivityIndicator size='large' />)
            : <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
              data={BookingStore.ServiceProviderBookingsData}
              renderItem={({ item, index }) => <BookingHistoryCompont navigation={navigation} data={item} key={item._id} handleChildData={this.handleData} check={this.state.check} lookID={this.state.lookID} />}
              keyExtractor={(item, index) => index.toString()}
            // ListFooterComponent={this.Render_Footer}
            />}
        </View>
    }
    return (
      <View style={styles.container}>
      {!this.state.reload
      ?<View>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView}>
            <View style={styles.headerLeft} >
              <View>
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => navigation.goBack()} />
              </View>
            </View>
            <View style={styles.headerBody} >
              <View>
                <Text style={styles.headerTitleStyle}> {i18n.t('lanTitleBookingHistory')} </Text>
              </View>
            </View>
            <View style={styles.headerRight} >
              <Icon name='ios-search' style={styles.iconMenuStyle} onPress={() => this.searchBar.show()} />
            </View>
          </View>
          <View style={{position:'absolute', top:Platform.OS === 'ios' ? 28 : 21 }}>
            <SearchBar
              ref={(ref) => this.searchBar = ref}
              showOnLoad = {false}
              iOSPadding={false}
              iOSHideShadow={true}
              placeholder='Search...'
              placeholderTextColor='gray'
              handleChangeText={(input) => this.handleSearchChange(input)}
              onBack={() => this.handleSearchBackClick('')}
            />
          </View>
        </LinearGradient>
        {this.state.loading
          ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#ffffff' size='large' style={ styles.activeIndicatorStyle } /></View>
          : null}
        <ScrollView style={styles.content} >
          {bookingsData}
        </ScrollView>
        {/* <BookingsHistoryScreen renderprops={this.state.show} searchArrayData={this.state.searchBookingsList} navigation={navigation} /> */}
      </View>
       : <View>
       <LinearGradient colors={['#01A4A2', '#025D8C']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
         <View style={styles.headerMainViewReload} >
           <View style={styles.headerLeftReload} >
             <TouchableOpacity>
               <Icon name='ios-arrow-back' style={styles.iconMenuStyle1} onPress={() => navigation.goBack()} />
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
   }
 </View>

    );
  }
}
