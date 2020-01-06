import React from 'react';
import { ActivityIndicator, AsyncStorage, BackHandler, TextInput, TouchableHighlight, Dimensions, FlatList, Text, View, StatusBar, ScrollView, Button, Platform, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Icon } from 'native-base';
import SearchBar from 'react-native-searchbar';
import { observer, inject } from 'mobx-react';
import styles from './css/UsersListCss';
import UsersListDataScreen from './UserListData';
import { LinearGradient } from 'expo-linear-gradient';
// import { ScrollView } from 'react-native-gesture-handler';
import ToggleSwitch from 'toggle-switch-react-native';
import { PUBLIC_DOMAIN } from '../../../constants';
import i18n from 'i18n-js';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const layoutHeight = 0;
import AwesomeButton from 'react-native-really-awesome-button';

@inject(['UserStore'])
@observer
export default class UsersListScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      search: '',
      refreshing: false,
      param1: null,
      reload: false,
      reloadFunction: '',
      loading: false,
    }
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleScrollEnd = this.handleScrollEnd.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
  }
  componentWillMount() {
    const UserStore = this.props.UserStore;
    const navigation = this.props.navigation;
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    UserStore.getSPUsersListingData(1, '', function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '404') {
      _this.setState({ loading: false })
        navigation.navigate('InformationScreen');
      } else {
        _this.setState({ loading: false })
      }
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillReceiveProps() {
    const UserStore = this.props.UserStore;
    const navigation = this.props.navigation;
    if (!UserStore.internet_connection) {
      navigation.navigate('InformationScreen');
    }
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    const navigation = this.props.navigation;
    navigation.navigate('SPHomeScreen');
    return true;
  }

  handleSearchChange(search) {
    this.setState({ search: search })
    const UserStore = this.props.UserStore;
    let _this = this;
    UserStore.getSPUsersListingData(1, search, function (resObj) {
      _this.setState({ loading: false })
    });
  }

  handleSearchBackClick = (search) => {
    this.setState({ loading: true, search: search })
    const UserStore = this.props.UserStore;
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'handleSearchBackClick', param1: search });
    }, 10000);
    UserStore.getSPUsersListingData(1, search, function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
    });
    this.searchBar.hide()
  }

  handleScrollEnd = (e) => {
    const UserStore = this.props.UserStore;
    var offset = e.nativeEvent.contentOffset.y;
    var height = e.nativeEvent.contentSize.height;
    if (!this.state.loading && (this.layoutHeight + offset) >= height) {
      if (UserStore.UsersListingDataCount > UserStore.UsersListingData.length) {
        const num = this.state.activePage + 1;
        this.setState({ loading: true });
        let _this = this;
        let isLoading = setTimeout(function () {
          _this.setState({ loading: false, reload: true, reloadFunction: 'handleScrollEnd', param1: e });
        }, 10000);
        UserStore.getSPUsersListingData(num, _this.state.search, function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ activePage: num, loading: false });
        });
      }
    }
  }

  handleUserClick(data) {
    const navigation = this.props.navigation;
    navigation.navigate('UserView', { data: data });
  }

  _onRefresh = () => {
    const UserStore = this.props.UserStore;
    let _this = this;
    this.setState({ loading: true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: '_onRefresh' });
    }, 10000);
    UserStore.getSPUsersListingData(1, '', function (resObj) {
      if (!UserStore.internet_connection) {
        _this.setState({ loading: false })
        _this.props.navigation.navigate('InformationScreen')
      } else {
        _this.setState({ loading: false })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
      }
    });
  }

  handleReload = () => {
    switch (this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      case 'handleSearchBackClick':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleSearchBackClick(this.state.param1)
        break;
      case 'handleScrollEnd':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleScrollEnd(this.state.param1)
        break;
      case '_onRefresh':
        this.setState({ reload: false, reloadFunction: '' });
        this._onRefresh()
        break;
      default:
        break;
    }
  }

  handleStatusChange = (value) => {
    if (value) {
      this.setState({ loading: true })
    } else {
      this.setState({ loading: false })
    }
  }


  render() {
    const navigation = this.props.navigation;
    const UserStore = this.props.UserStore;
    let userData = <View ><ActivityIndicator size='large' /></View>
    // if (this.state.loading) {
    //   userData = <View style={styles.noDataViewStyle} >
    //     <Text style={styles.noUser}>{i18n.t('lanLabelNoDataFound')}</Text>
    //   </View>;
    // } else if (UserStore.UsersListingData.length > 0) {
      userData =
        <FlatList
          data={UserStore.UsersListingData}
          renderItem={({ item, index }) => <UsersListDataScreen navigation={navigation} data={item} handleStatusChange={this.handleStatusChange} />}
          keyExtractor={(item, index) => index.toString()}
        />
    // }
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
                <View style={styles.headerBody} >
                  <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleUsersList')}</Text>
                </View>
                <View style={styles.headerRight}>
                  <View style={{ flex: 1 }}>
                    <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()} >
                      <Icon name='ios-search' style={styles.iconSearchStyle} />
                    </TouchableHighlight>
                  </View>
                  <View style={{ flex: 1 }}>
                    <TouchableHighlight style={styles.addmenu_button} underlayColor='#0b6664' onPress={() => navigation.navigate('CreateUser')} >
                      <Icon name='ios-add' style={styles.iconAddMenuStyle} />
                    </TouchableHighlight>
                  </View>
                  <View style={{ flex: 1 }}>
                    <TouchableHighlight style={styles.menu_button} onPress={() => navigation.navigate('SPHomeScreen')} >
                      <Icon name='md-home' style={styles.iconHomeStyle} />
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
              {/* <View>
            <SearchHeader
              ref={(searchHeader) => {
                this.searchHeader = searchHeader;
              }}
              placeholder='Search...'
              placeholderColor='gray'
              backgroundColor='red'
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
              onHide ={() => this.handleSearchChange('')}
              onSearch={async (text) => {
                if (text) {
                  this.handleSearchChange(text.nativeEvent.text)
                } else {
                  return [];
                }
              }}
            />
          </View> */}
            </LinearGradient>
            {this.state.loading
              ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#FFFFFF' size='large' style={ styles.activeIndicatorStyle } /></View>
              : null}
            <View style={styles.content}>
              {/* <TextInput
           onChangeText={(text) => this.handleSearchChange(text)}
        /> */}
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
                style={{ width: DEVICE_WIDTH, height: Device_Height - 100, backgroundColor: 'transparent' }} onLayout={event => { this.layoutHeight = event.nativeEvent.layout.height; }} onScrollEndDrag={this.handleScrollEnd}>
                {userData}
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