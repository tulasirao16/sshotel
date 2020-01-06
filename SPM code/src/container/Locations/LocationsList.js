import React from 'react';
import { ActivityIndicator, AsyncStorage, TouchableHighlight, BackHandler, Dimensions, FlatList, Text, View, StatusBar, ScrollView, Button, Platform, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Icon, Card, CardItem, Left, Content, Body } from 'native-base';
import { observer, inject } from 'mobx-react';
import styles from './css/LocationsListCss';
import EachLocationRow from './EachLocationRow';
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from 'react-native-searchbar';
import i18n from 'i18n-js';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const layoutHeight = 0;
import AwesomeButton from 'react-native-really-awesome-button';

@inject(['SPStore'])
@observer
export default class LocationsList extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      activePage: 1,
      search: '',
      refreshing: false,
      param1: null,
      reloadFunction: '',
      reload: false
    }
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleScrollEnd = this.handleScrollEnd.bind(this);
  }
  componentWillMount() {
    this.setState({ search: '' })
    const SPStore = this.props.SPStore;
    const navigation = this.props.navigation;
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    SPStore.getSpLocationsList(1, '', function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '404') {
        _this.setState({ loading: false })
        navigation.navigate('InformationScreen');
      } else {
        _this.setState({ loading: false, activePage: 1, search: '' })
      }
    });
    AsyncStorage.getItem('authObj').then((value) => {
      let authObj = JSON.parse(value);
      this.setState({
        spServiceProvider: authObj.spServiceProvider,
        contactPerson: authObj.spServiceProviderId.contactPerson
      });
    });
  }
  componentWillReceiveProps(newProps) {
    const SPStore = this.props.SPStore;
    const navigation = this.props.navigation;
    if (newProps.navigation.state.params && newProps.navigation.state.params.location == 'location') {
      this.setState({ loading: true });
      let _this = this;
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillReceiveProps' });
      }, 10000);
      SPStore.getSpLocationsList(1, '', function (resObj) {
        clearTimeout(isLoading)
        _this.setState({ loading: false })
        if (resObj.statusCode == '9999') {
          _this.props.navigation.navigate('InformationScreen')
        }
      });
      _this.setState({ activePage: 1, search: '' })
    } else {
    }
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      const navigation = this.props.navigation;
      navigation.goBack()
      return true
    })
  }
  componentWillUnmount() {
    this.backHandler.remove()
  }
  handleSearchChange(search) {
    // this.setState({ loading: true })
    this.setState({ search: search })
    const SPStore = this.props.SPStore;
    let _this = this
    SPStore.getSpLocationsList(1, search, function (resObj) {
      _this.setState({ loading: false })
    });
    _this.setState({ activePage: 1 })
  }

  handleSearchBackClick = (search) => {
    this.setState({ search: search })
    const SPStore = this.props.SPStore;
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'handleSearchBackClick' });
    }, 10000);
    SPStore.getSpLocationsList(1, search, function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
    });
    this.searchBar.hide()
  }

  handleScrollEnd = (e) => {
    const SPStore = this.props.SPStore;
    var offset = e.nativeEvent.contentOffset.y;
    var height = e.nativeEvent.contentSize.height;
    if (!this.state.loading && (this.layoutHeight + offset) >= height) {
      if (SPStore.totalLocationsCount > SPStore.LocationsList.length) {
        const num = this.state.activePage + 1;
        this.setState({ loading: true });
        let _this = this;
        let isLoading = setTimeout(function () {
          _this.setState({ loading: false, reload: true, reloadFunction: 'handleScrollEnd', param1: e });
        }, 10000);
        SPStore.getSpLocationsList(num, _this.state.search, function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false, activePage: num });
        });
      }
    }
  }

  // _handleSearch = () => {
  //   this.searchHeader.show()
  // }

  _onRefresh = () => {
    this.setState({ loading: true, search: '' })
    const SPStore = this.props.SPStore;
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: '_onRefresh' });
    }, 10000);
    SPStore.getSpLocationsList(1, '', function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
      if (resObj.statusCode == '9999') {
        _this.props.navigation.navigate('InformationScreen')
      }
    });
    _this.setState({ activePage: 1 })
  }

  handleReload = () => {
    switch (this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      case 'componentWillReceiveProps':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillReceiveProps()
        break;
      case 'handleSearchBackClick':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleSearchBackClick(this.state.search)
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

  render() {
    const navigation = this.props.navigation;
    const SPStore = this.props.SPStore;
    // let locationsList = 
    // <View style={styles.activeIndicatorView}><ActivityIndicator size='large' /></View>;
    if (SPStore.LocationNoOrders) {
      locationsList = <View style={styles.noDataViewStyle} >
        <Text style={styles.noLocations}>{i18n.t('lanLabelNoLocationsTillNow')}</Text>
      </View>;
    } else {
      if (SPStore.SearchHomeLocationNoMatches) {
        locationsList = <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.title}>{i18n.t('lanLabelNoMatchesFound')}</Text>
        </View>;
      } else {
        locationsList =
          <FlatList
            data={SPStore.LocationsList}
            renderItem={({ item }) => <EachLocationRow navigation={navigation} data={item} handleStatusChange={this.handleStatusChange} />}
            keyExtractor={(item, index) => index.toString()}
          />
      }
    }
    return (
      !this.state.reload
        ? <View style={styles.container}>
          {this.state.loading
          ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#FFFFFF' size='large' style={ styles.activeIndicatorStyle } /></View>
          : null}
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
              <StatusBar barStyle='light-content' />
              <View style={styles.status} />
              <View style={styles.headerMainView}>
                <View style={styles.headerLeft} >
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.openDrawer()}>
                    <Icon name='md-menu' style={styles.iconMenuStyle} />
                  </TouchableHighlight>
                </View>
                <View style={styles.headerBody} >
                  <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleLocationsList')}</Text>
                </View>
                <View style={styles.headerRight}>
                  <View style={{ flex: 1 }}>
                    <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()} >
                      <Icon name='ios-search' style={styles.iconSearchStyle} />
                    </TouchableHighlight>
                  </View>
                  <View style={{ flex: 1 }}>
                    <TouchableHighlight style={styles.addmenu_button} underlayColor='#0b6664' onPress={() => navigation.navigate('LocationsCreateScreen')}>
                      <Icon name='add' style={styles.iconAddStyle} />
                    </TouchableHighlight>
                  </View>
                  <View style={{ flex: 1 }}>
                    <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.navigate('SPHomeScreen')}>
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
                  placeholder={i18n.t('lanCommonLabelSearch')}
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
            />
          </View> */}
            </LinearGradient>
            {/* {this.state.loading
                  ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#FFFFFF' size='large' style={ styles.activeIndicatorStyle } /></View>
                  : null
                } */}
             {/* <View style={styles.businessNameView} >
              <Card style={styles.cardBusiness}>
                <CardItem style={styles.cardItemBusinessStyle}>
                  <Left style={[styles.leftImageView, styles.listItemView]}>
                     <View style={styles.imageBusinessBox} >
                  <Image source={require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
                </View> 
                    <Body>
                      <View style={styles.floatingInputView} >
                        <Text style={styles.propertyTitle}> {this.state.spServiceProvider} </Text>
                        <Text style={styles.titleType}> {this.state.contactPerson} </Text>
                      </View>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
            </View>  */}
            <Content style={styles.content}>
              {/* {this.state.loading
                ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#FFFFFF' size='large' style={ styles.activeIndicatorStyle } /></View>
                : null
              } */}
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
                onLayout={event => { this.layoutHeight = event.nativeEvent.layout.height; }} onScrollEndDrag={this.handleScrollEnd}>
                {locationsList}
              </ScrollView>
            </Content>
          </View>
          : <View>
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
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
            <View style={{ jflex: 1, justifyContent: 'center', alignItems: 'center', width: DEVICE_WIDTH - 20, height: Device_Height - 150 }} >
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
