import React from 'react';
import { Text, View, Image,Platform, AsyncStorage,TouchableHighlight, StatusBar, FlatList, BackHandler, ActivityIndicator, Dimensions, RefreshControl, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { Button, Icon, List, ListItem } from 'native-base';
import styles from './css/NotificationsListCss';
import { LinearGradient } from 'expo-linear-gradient';
import { inject, observer } from 'mobx-react';
import Modal from 'react-native-modal';
import AwesomeButton from 'react-native-really-awesome-button';
import SearchBar from 'react-native-searchbar';
import i18n from 'i18n-js';
import Toast, { DURATION } from 'react-native-easy-toast';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const layoutHeight = 0;

@inject(['MessageStore'], ['HomeStore'])
@observer
export default class NotificationsListScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      header: null
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      notificationData: [],
      selectedValues: [],
      lookID: [],
      activePage: 1,
      refreshing: false,
      search: '',
      notificationsUnreadCount: 0,
      isDeleteModalVisible: false,
      reload: false,
      reloadFunction: '',
      loading: false,
      reloadParam: null
    };
    this.page = 1
    this.handleData = this.handleData.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.hanldeGoBack = this.hanldeGoBack.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    this.updateValues = this.updateValues.bind(this)
  }
  componentWillMount() {
    const HomeStore = this.props.HomeStore;
    const navigation = this.props.navigation;
    this.setState({ loading: true })
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    HomeStore.getSPHomeScreenBookingsCount('Today', function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
      if (resObj.statusCode == '9999') {
        navigation.navigate('InformationScreen');
      } else if (resObj.statusCode == '0000') {
        if (resObj.statusResult.notificationsUnreadCount && resObj.statusResult.notificationsUnreadCount.length) {
          _this.setState({ notificationsUnreadCount: resObj.statusResult.notificationsUnreadCount[0].count })
        }
      }
    })
  }
  componentDidMount() {
    const MessageStore = this.props.MessageStore;
    this.setState({ loading: true })
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentDidMount' });
    }, 10000);
    MessageStore.getSPNotificationsData(1, '', function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    const MessageStore = this.props.MessageStore;
    const navigation = this.props.navigation;
    if (this.state.notificationsUnreadCount > 0) {
      this.setState({ loading: true });
      let _this = this;
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillUnmount' });
      }, 10000);
      MessageStore.setNotificationsUnReadToRead(function (resObj) {
        clearTimeout(isLoading)
        if (resObj.statusCode == '404') {
          _this.setState({ loading: false })
          navigation.navigate('InformationScreen');
        } else {
          _this.setState({ loading: false })
          // navigation.state.params.onNavigateBack();
          // navigation.navigate('SPHomeScreen', {refresh: true})
        }
      });
    }
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }

  handleBackButtonClick() {
    const navigation = this.props.navigation
    navigation.goBack()
    return true
  }
  _onRefresh = () => {
    const MessageStore = this.props.MessageStore;
    this.setState({ loading: true, selectedValues: [], lookID: [] });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: '_onRefresh' });
    }, 10000);
    MessageStore.getSPNotificationsData(1, '', function (resObj) {
      clearTimeout(isLoading)
      if (!MessageStore.internet_connection) {
        _this.props.navigation.navigate('InformationScreen')
      } else {
        MessageStore.getSPNotificationsData(1, '', function (resObj) {
          _this.setState({ loading: false })
        });
      }
    });
  }
  handleData(data) {
    let x = this.state.selectedValues;
    let ID = this.state.lookID;
    let getSpObj = x.find(sp => (sp._id === data._id));
    if (getSpObj && getSpObj._id) {
      let i = x.indexOf(data);
      let j = ID.indexOf(data._id);
      x.splice(i, 1);
      ID.splice(j, 1);
    } else {
      x.push(data);
      ID.push(data._id);
    }
    this.setState({ selectedValues: x, lookID: ID });
  }
  handleDelete() {
    const MessageStore = this.props.MessageStore;
    this.setState({ isDeleteModalVisible: false, loading: true })
    let _this = this;
    if (this.state.lookID.length > 0) {
      // let _this = this;
      let post_json = {
        notifyIDs: this.state.lookID
      };
      let isLoading = setTimeout(function () {           
        _this.setState({ loading: false });
      }, 10000); 
      MessageStore.deleteNotification(post_json, function (resObj) {
        if (resObj.statusCode == '0000') {
          _this.setState({ lookID: [], selectedValues: []});
          MessageStore.getSPNotificationsData(1, '', function (resObj) {
            clearTimeout(isLoading)
            _this.setState({ loading: false });
          });
          // MessageStore.getSPNotificationsUnReadCount(function(resObj) {
          // });
        } else {
          _this.setState({ lookID: [], selectedValues: [] });
          _this.setState({ errorMessage: i18n.t('lanErrorDeleteFailed') });
        }
      });
    } else {
      _this.setState({ loading: false });
      this.refs.toast.show(i18n.t('lanErrorPleaseSelectToDelete'))
    }
    this.page = 1;
  }
  hanldeGoBack = () => {
    const navigation = this.props.navigation;
    navigation.state.params.onNavigateBack();
    navigation.goBack();
  }
  handleSearchChange(search) {
    this.setState({ search: search })
    const MessageStore = this.props.MessageStore;
    let _this = this
    MessageStore.getSPNotificationsData(1, search, function (resObj) {
      _this.setState({ loading: false })
    });
  }

  handleSearchBackClick = (search) => {
    this.setState({ search: search, selectedValues: [], lookID: [] })
    const MessageStore = this.props.MessageStore;
    let _this = this;
    _this.setState({ loading: true })
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'handleSearchBackClick',  reloadParam: search });
    }, 10000);
    MessageStore.getSPNotificationsData(1, search, function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
    });
    this.searchBar.hide()
  }

  handleScrollEnd = (e) => {
    const MessageStore = this.props.MessageStore;
    var offset = e.nativeEvent.contentOffset.y;
    var height = e.nativeEvent.contentSize.height;
    if (!this.state.loading && (this.layoutHeight + offset) >= height) {
      if (MessageStore.totalNotificationsCount > MessageStore.NotificationsList.length) {
        const num = this.state.activePage + 1;
        let _this = this;
        _this.setState({ loading: true })
        let isLoading = setTimeout(function () {
          _this.setState({ loading: false, reload: true, reloadFunction: 'handleScrollEnd', reloadParam: e });
        }, 10000);
        MessageStore.getSPNotificationsData(num, _this.state.search, function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false, activePage: num, reloadParam: null });
        });
      }
    }
  }

  handleReload = () => {
    switch (this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      case 'componentDidMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentDidMount()
        break;
      case 'componentWillUnmount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillUnmount()
        break;
      case '_onRefresh':
        this.setState({ reload: false, reloadFunction: '' });
        this._onRefresh()
        break;
      case 'handleScrollEnd':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleScrollEnd(this.state.reloadParam)
        break;
      case 'handleSearchBackClick':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleSearchBackClick(this.state.reloadParam)
        break;
      case 'handleDelete':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleDelete()
        break;
      default:
        break;
    }
  }

  updateValues (selectedValues, lookID){
    this.setState({ selectedValues: selectedValues, lookID: lookID })
  }
  render() {
    const navigation = this.props.navigation;
    const MessageStore = this.props.MessageStore;
    let NotificationData =
      <View>
      </View>;
    if (MessageStore.NotificationsNoOrders) {
      NotificationData = <View style={styles.noDataViewStyle} >
        <Text style={styles.noUser}>{i18n.t('lanLabelNoNotificationsTillNow')}</Text>
      </View>;
    } else {
      if (MessageStore.SearchHomeNotificationNoMatches) {
        NotificationData = <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.title}>{i18n.t('lanLabelNoMatchesFound')}</Text>
        </View>;
      } else {
        NotificationData =
        // this.state.loading ? (
        //   <View style={ styles.activeIndicatorView }>
        //     <ActivityIndicator color='#FFFFFF' size='large' style={ styles.activeIndicatorStyle } />
        //   </View> ) :
          <FlatList
              refreshControl={
                <RefreshControl
                />
              }
              data={MessageStore.NotificationsList}
              renderItem={({ item, i }) => <EachRow updateValues={this.updateValues} selectedValues={this.state.selectedValues} lookID={this.state.lookID} key={i} navigation={navigation} data={item} key={item._id} handleChildData={this.handleData} lookID={this.state.lookID} />}
              keyExtractor={(item, index) => index.toString()}
            />
      }
    }
    return (
      !this.state.reload
      ? <View style={{flex:1 }}>
        <View>
          <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <StatusBar barStyle='light-content' />
            <View style={styles.status} />
            <View style={styles.headerMainView} >
              <View style={styles.headerLeft} >
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.props.navigation.openDrawer()} >
                  <Icon name='ios-menu' style={styles.iconMenuStyle} />
                </TouchableHighlight>
              </View>
              <View style={styles.headerBody} >
                <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleNotifications')} </Text>
              </View>
              <View style={styles.headerRight} >
                <View style={{flex:1 }}>
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()}>
                    <Icon name='ios-search' style={styles.iconSearchStyle} onPress={() => this.searchBar.show()} />
                  </TouchableHighlight>
                </View>
                <View style={{flex:1 }}>
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={this.handleDelete} >
                    <Icon name='ios-trash' style={styles.iconDeleteStyle} />
                  </TouchableHighlight>
                </View>
              </View>
            </View>
            <View style={{ position: 'absolute', top: Platform.OS === 'ios' ? 28 : 21 }}>
              <SearchBar
                ref={(ref) => this.searchBar = ref}
                handleResults={this._handleResults}
                showOnLoad={false}
                iOSPadding={false}
                iOSHideShadow={true}
                placeholder={i18n.t('lanLabelSearch')}
                placeholderTextColor='gray'
                handleChangeText={(input) => this.handleSearchChange(input)}
                onBack={(input) => this.handleSearchBackClick(input)}
              />
            </View>
          </LinearGradient>
        </View>
          {this.state.loading
          ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#FFFFFF' size='large' style={ styles.activeIndicatorStyle } /></View>
          : null}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          style={{ width: DEVICE_WIDTH, height: Device_Height - 100,  }} 
          onLayout={event => { this.layoutHeight = event.nativeEvent.layout.height; }} onScrollEndDrag={this.handleScrollEnd}>
          {NotificationData}
          {/* <View>
          {this.state.loading ?
            <View><ActivityIndicator color='#fff' style={{ marginLeft: 6 }} /></View>
            : null
          }
        </View> */}
        </ScrollView>
        <Modal isVisible={this.state.isDeleteModalVisible}>
          <View style={styles.modalView}>
            <View style={styles.modalContainerStyles}>
              <View style={styles.txtInfoViewStyle}>
                <Text style={styles.txtInfo}> {i18n.t('lanLabelAreYouSureYouWantTo')} </Text>
              </View>
              <View style={styles.btnsParentView} >
                <View style={styles.eachBtnView} >
                  <Button onPress={() => this.handleDelete()} style={styles.btnStyle}>
                    <Text style={styles.btnTxt} > {i18n.t('lanButtonDelete')} </Text>
                  </Button>
                </View>
                <View style={styles.eachBtnView} >
                  <Button onPress={() => this.setState({ isDeleteModalVisible: false })} style={styles.cancelBtn} >
                    <Text style={styles.btnTxt}>  {i18n.t('lanButtonCancel')} </Text>
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <Toast
          ref='toast'
          style={{backgroundColor:'red', width: '100%', borderRadius:0,padding: 10, }}
          position='top'
          positionValue={80}
          fadeInDuration={50}
          fadeOutDuration={500}
          // opacity={0.8}
          borderRadius={0}
          textStyle={{color:'white', fontFamily: 'Roboto_medium', }}
        />
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
              <Text style={styles.headerTitleStyle}>{i18n.t('lanAppTitle')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      <View style={{ jflex: 1, justifyContent: 'center', alignItems: 'center', width: DEVICE_WIDTH - 20, height: Device_Height - 150 }} >
        <View style={styles.eachBtnView} >
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

@inject(['BookingStore'], ['PropertyStore'], ['UserStore'])
class EachRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      authObj: {}
    }
    this.handleRedirect = this.handleRedirect.bind(this)
  }
  async componentWillMount() {
    this.setState({ data: this.props.data, userStatus: this.props.data.userStatus });
    await AsyncStorage.getItem('authObj').then((value) => {
      let authObj = JSON.parse(value);
      this.setState({ authObj: (authObj && authObj.mobileNumber) ? authObj : {} });
    });
  }
  handleRedirect(item) {
    const navigation = this.props.navigation
    const BookingStore = this.props.BookingStore
    const PropertyStore = this.props.PropertyStore
    const UserStore = this.props.UserStore
    const selectedValues = this.props.selectedValues
    const lookID = this.props.lookID
    let _this = this
    if(selectedValues.length !== 0){
      let x = selectedValues;
      let ID = lookID;
      let getSpObj = x.find(sp => (sp._id === item._id));
      if (getSpObj && getSpObj._id) {
        let i = x.indexOf(item);
        let j = ID.indexOf(item._id);
        x.splice(i, 1);
        ID.splice(j, 1);
      } else {
        x.push(item);
        ID.push(item._id);
      }
      this.props.updateValues(x, ID)
      // this.setState({ selectedValues: x, lookID: ID });
    } else {
      if (item.notificationBody && item.notificationBody.type === 'Booking' && item.notificationBody.recordId) {
        BookingStore.getSPBookingData(item.notificationBody.recordId, function (resObj) {
          if (resObj.statusCode === '0000') {
            navigation.navigate('BookingHistoryViewScreen', { BookingData: resObj.statusResult });
          }
        });
      } else if (item.notificationBody && item.notificationBody.type === 'Property' && item.notificationBody.recordId) {
        PropertyStore.getSPPropertyData(item.notificationBody.recordId, function (resObj) {
          if (resObj.statusCode === '0000') {
            navigation.navigate('PropertyView', { data: resObj.statusResult });
          }
        });
      } else if (item.notificationBody && item.notificationBody.type === 'User Create' && item.notificationBody.recordId) {
        UserStore.getSPUserData(item.notificationBody.recordId, function (resObj) {
          if (resObj.statusCode === '0000') {
            navigation.navigate('UserView', { data: resObj.statusResult, authObj: _this.state.authObj });
          }
        });
      }
    }
  }

  render() {
    const navigation = this.props.navigation;
    const data = this.props.data;
    const  booking = data.notificationBody.bookingCode ? true : false 
    const isSelected = this.props.lookID.find(item => item === data._id)
    return (
      <List key={data._id} style={styles.notifications}>
        {!isSelected
          ? <ListItem style={styles.eachNotification} button={true} onPress={() => this.handleRedirect(data)} onLongPress={() => this.props.handleChildData(data)}>
            <View>
              <View style={styles.deleteNoteView}>
                <Text style={data.status === 'Unread' ? [styles.titleGap, styles.titleColor, styles.fontBold] : [styles.regularFontStyle, styles.titleGap, styles.titleColor,]}>{data.notificationTitle}</Text>
                <Text style={data.status === 'Unread' ? [styles.smallFont, styles.fontBold] : [styles.regularFontStyle, styles.smallFont]}>{data.notificationMessage}
                </Text>
                {booking == true
                 ? <View style={{ flexDirection: 'row', marginTop: 5 }}>
                  <Text style={[styles.mediumFontStyle, styles.titleGap ]}>{i18n.t('lanLabelBookingCode')} </Text>
                  <Text style={[styles.mediumFontStyle, styles.titleGap, styles.titleColorBlue ]}> {data.notificationBody.bookingCode}</Text>
                </View>
                : null }
                <TouchableOpacity style={{ flexDirection: 'row'}} onPress={() => Linking.openURL(`tel:${data.notificationBody && data.notificationBody.contact ? data.notificationBody.contact : ''}`)}>
                  <Text style={[styles.mediumFontStyle, styles.titleGap, styles.lineHeightStyle ]}>{i18n.t('lanLabelContact')}  </Text>
                  <Text style={[styles.mediumFontStyle, styles.titleGap,  styles.lineHeightStyle, styles.underlineStyle ]}> {data.notificationBody.contact ? data.notificationBody.contact : ''}</Text>
                  <TouchableHighlight style={styles.call_button} underlayColor='#adadad' onPress={() => Linking.openURL(`tel:${data.notificationBody && data.notificationBody.contact ? data.notificationBody.contact : ''}`)}>
                    <Icon name='call' style={{ fontSize: 20, color: '#006d6b' }} />
                  </TouchableHighlight>
                </TouchableOpacity>
              </View>
            </View>
          </ListItem>
          : <ListItem style={styles.deleteNotification} button={true} onPress={() => this.handleRedirect(data)} onLongPress={() => this.props.handleChildData(data)}>
            <View style={styles.deleteNoteView}>
              {/* <View style={{ justifyContent: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  {this.props.lookID.map((item, i) =>
                    <Text key={i}>{data._id === item ? <Icon name='md-checkmark' style={{ color: '#295aa2', fontSize: 20, paddingRight: 10 }} /> : null}</Text>)
                  }
                </View>
              </View> */}
              <Text style={data.status === 'Unread' ? [styles.titleGap, styles.deltitleColor, styles.fontBold] : [styles.regularFontStyle, styles.titleGap, styles.deltitleColor]}>{data.notificationTitle}</Text>
              <Text style={data.status === 'Unread' ? [styles.smallFont, styles.smallFontDelete] : [styles.regularFontStyle, styles.smallFontDelete]}>{data.notificationMessage}</Text>
              {booking == true
                 ? <View style={{ flexDirection: 'row', marginTop: 5 }}>
                  <Text style={[styles.delmediumFontStyle, styles.titleGap ]}>{i18n.t('lanLabelBookingCode')} </Text>
                  <Text style={[styles.mediumFontStyle, styles.titleGap, styles.deltitleColorBlue ]}> {data.notificationBody.bookingCode}</Text>
                </View>
                : null }
              <TouchableOpacity style={{ flexDirection: 'row'}} onPress={() => Linking.openURL(`tel:${data.notificationBody && data.notificationBody.contact ? data.notificationBody.contact : ''}`)}>
                <Text style={[styles.delmediumFontStyle, styles.titleGap, styles.lineHeightStyle ]}>{i18n.t('lanLabelContact')}  </Text>
                <Text style={[styles.delmediumFontStyle, styles.titleGap,  styles.lineHeightStyle, styles.underlineStyle ]}> {data.notificationBody.contact ? data.notificationBody.contact : ''}</Text>
                <TouchableHighlight style={styles.del_call_button} underlayColor='#adadad' onPress={() => Linking.openURL(`tel:${data.notificationBody && data.notificationBody.contact ? data.notificationBody.contact : ''}`)}>
                  <Icon name='call' style={{ fontSize: 20, color: '#333' }} />
                </TouchableHighlight>
              </TouchableOpacity>
            </View>
          </ListItem>}
      </List>
    )
  }
}
