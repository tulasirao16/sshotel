import React from 'react';
import { observer, inject } from 'mobx-react';
import { Dimensions, FlatList, TouchableOpacity, TouchableHighlight, Platform, StatusBar, ActivityIndicator, RefreshControl, Image, BackHandler } from 'react-native';
import { Icon, View, Text, Card, CardItem, Left, Body } from 'native-base';
import styles from './css/PropertyInfoListCss';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import SearchBar from 'react-native-searchbar';
import EachPropertyInfoRow from './EachPropertyInfoRow';
import { PUBLIC_DOMAIN } from '../../../constants';
import i18n from 'i18n-js';
import AwesomeButton from 'react-native-really-awesome-button';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const layoutHeight = 0;

@inject(['PropertyStore'])
@observer
export default class PropertyInfoList extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      header: null
    }
  };

  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    this.state = {
      propertyID: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData._id : '',
      propertyTitle: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyTitle : '',
      propertyType: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyType : '',
      propertyImage: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.imagePath : '',
      propertyArea: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.spLocationObj.area : '',
      propertyAction: navigation.state.params && navigation.state.params.propertyData && navigation.state.params.propertyData.propertyAction ? navigation.state.params.propertyData.propertyAction : 'View',
      activePage: 1,
      refreshing: false,
      loading: false,
      search: '',
      reload: false,
      reloadFunction: '',
    };
    // this.Refresh = this.Refresh.bind(this);
    this.handleCreatePropertyInfoList = this.handleCreatePropertyInfoList.bind(this);
  }
  componentWillMount() {
    const PropertyStore = this.props.PropertyStore;
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    PropertyStore.getPropertyInfos(_this.state.propertyID, function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false });
      if (resObj.statusCode == '9999') {
        _this.props.navigation.navigate('InformationScreen')
      }
    });
  }
  componentWillReceiveProps(newProps) {
    const PropertyStore = this.props.PropertyStore;
    if (newProps.navigation.state.params && newProps.navigation.state.params.list == 'list') {
      this.setState({ loading: true });
      let _this = this;
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillReceiveProps' });
      }, 10000);
      PropertyStore.getPropertyInfos(_this.state.propertyID, function (resObj) {
        clearTimeout(isLoading)
        if (resObj.statusCode == '0000') {
          _this.setState({ loading: false });
        } else if (resObj.statusCode == '9999') {
          _this.setState({ loading: false });
          _this.props.navigation.navigate('InformationScreen')
        } else {
          _this.setState({ loading: false });
        }
      });
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
  _onRefresh = () => {
    this.setState({ refreshing: true })
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ refreshing: false, reload: true, reloadFunction: '_onRefresh' });
    }, 10000);
    PropertyStore.getPropertyInfos(_this.state.propertyID, function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ refreshing: false });
      if (resObj.statusCode == '9999') {
        _this.props.navigation.navigate('InformationScreen')
      }
    });
  }

  // _handleSearch = () => {
  //   this.searchHeader.show()
  // }

  handleSearchChange = (Search) => {
    const PropertyStore = this.props.PropertyStore;
    var searchList = PropertyStore.PropertyInfoDubList.filter(function (item) {
      return item.propertyType.indexOf(Search) > -1 ||
        item.propertyTitle.indexOf(Search) > -1 ||
        item.rentType.indexOf(Search) > -1 ||
        item.roomCategory.indexOf(Search) > -1 ||
        item.roomType.indexOf(Search) > -1 ||
        // item.membersCapacity.indexOf(Search) > -1 ||
        // item.childsCapacity.indexOf(Search) > -1 ||
        // item.roomsCount.indexOf(Search) > -1 ||
        // item.activeRoomsCount.indexOf(Search) > -1 ||
        // item.singleBedsCount.indexOf(Search) > -1 ||
        // item.doubleBedsCount.indexOf(Search) > -1 ||
        // item.pricing.minBasePrice.indexOf(Search) > -1 ||
        // item.pricing.basePrice.indexOf(Search) > -1 ||
        item.pricing.billingType.indexOf(Search) > -1 ||
        item.pricing.currency.indexOf(Search) > -1 ||
        item.spLocationObj.area.indexOf(Search) > -1
    });
    PropertyStore.PropertyInfoList = searchList;
  }

  handleSearchBackClick = (Search) => {
    const PropertyStore = this.props.PropertyStore;
    var searchList = PropertyStore.PropertyInfoDubList.filter(function (item) {
      return item.propertyType.indexOf(Search) > -1 ||
        item.propertyTitle.indexOf(Search) > -1 ||
        item.rentType.indexOf(Search) > -1 ||
        item.roomCategory.indexOf(Search) > -1 ||
        item.roomType.indexOf(Search) > -1 ||
        // item.membersCapacity.indexOf(Search) > -1 ||
        // item.childsCapacity.indexOf(Search) > -1 ||
        // item.roomsCount.indexOf(Search) > -1 ||
        // item.activeRoomsCount.indexOf(Search) > -1 ||
        // item.singleBedsCount.indexOf(Search) > -1 ||
        // item.doubleBedsCount.indexOf(Search) > -1 ||
        // item.pricing.minBasePrice.indexOf(Search) > -1 ||
        // item.pricing.basePrice.indexOf(Search) > -1 ||
        item.pricing.billingType.indexOf(Search) > -1 ||
        item.pricing.currency.indexOf(Search) > -1 ||
        item.spLocationObj.area.indexOf(Search) > -1
    });
    this.searchBar.hide()
    PropertyStore.getPropertyInfos(this.state.propertyID, function (resObj) {
    });
  }

  handleCreatePropertyInfoList() {
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    if (PropertyStore.PropertyInfoList.length > 1) {
      var isMinBaseDefaultInfocreate = true
    } else {
      var isMinBaseDefaultInfocreate = false
    }
    let checkMinBase = PropertyStore.PropertyInfoList.find(data => data.pricing.isDefaultMinBasePrice === true)
    if (checkMinBase) {
      var isMinBaseDefault = false
    } else {
      var isMinBaseDefault = true
    }
    PropertyStore.PricingView = {};
    navigation.navigate('CreatePropertyInfo', {
      propertyData: navigation.state.params.propertyData,
      isMinBaseDefaultInfocreate: isMinBaseDefaultInfocreate, isMinBaseDefault: isMinBaseDefault
    });
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
    const PropertyStore = this.props.PropertyStore;
    let propertyInfoList =
      <View style={{ marginTop: 100, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      </View>;
    if (!PropertyStore.PropertyInfoList) {
      propertyInfoList = <View style={styles.contentContainerStyle}>
        <Text >{i18n.t('lanLabelNoPropertyInfosTillNow')}</Text>
      </View>;
    } else {
      propertyInfoList =
        <FlatList
          refreshControl={
            <RefreshControl
            />
          }
          data={PropertyStore.PropertyInfoList}
          renderItem={({ item }) => <EachPropertyInfoRow propertyID={this.state.propertyID} propertyInfosList={PropertyStore.PropertyInfoList} navigation={navigation} data={item} key={item._id} propertyAction={this.state.propertyAction} />}
          keyExtractor={(item, index) => index.toString()}
        />
    }
    return (
      !this.state.reload
        ? <View style={styles.container}>
          <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <StatusBar barStyle='light-content' />
            <View style={styles.status} />
            <View style={styles.headerMainView}>
              <View style={styles.headerLeft} >
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()}>
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
                </TouchableHighlight>
              </View>
              <View style={styles.headerBody} >
                <Text style={styles.headerTitleStyle}>{i18n.t('lanTitlePropertyInfoList')}  </Text>
              </View>
              <View style={styles.headerRight}>
                <View style={{ flex: 1 }}>
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()} >
                    <Icon name='ios-search' style={styles.iconSearchStyle} />
                  </TouchableHighlight>
                </View>
                {/* <View style={{ flex: 1 }}>
                  <TouchableHighlight style={styles.plus_button} underlayColor='#0b6664' onPress={() => this.handleCreatePropertyInfoList()} >
                    <Icon name='ios-add' style={styles.iconPlusStyle} />
                  </TouchableHighlight>
                </View> */}
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
          {this.state.loading
            ? <View style={styles.activeIndicatorView}><ActivityIndicator color="#ffffff" size='large' style={styles.activeIndicatorStyle} /></View>
            : null}
          <View style={styles.businessNameView} >
            <Card style={styles.cardBusiness}>
              <CardItem style={styles.cardItemBusinessStyle}>
                <Left style={[styles.leftImageView, styles.listItemView]}>
                  <View style={styles.imageBusinessBox} >
                    <Image source={this.state.propertyImage ? { uri: PUBLIC_DOMAIN + this.state.propertyImage } : require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
                  </View>
                  <Body>
                    <View style={styles.floatingInputBusinessView} >
                      <Text numberOfLines={1} ellipsizeMode='tail' style={styles.propertyTitle}> {this.state.propertyTitle} </Text>
                      <Text style={styles.titleLocationType}> {this.state.propertyArea} </Text>
                      <Text style={styles.titleType}> {this.state.propertyType} - {i18n.t('lanTitlePropertyInfoList')} </Text>
                    </View>
                  </Body>
                </Left>
              </CardItem>
            </Card>
          </View>
          <ScrollView onLayout={event => { this.layoutHeight = event.nativeEvent.layout.height; }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />}
          >
            <View style={styles.propertyCountStyle} >
              <Text style={styles.title}>{`${i18n.t('lanLabelYouHave')} ${PropertyStore.PropertyInfoList.length} ${i18n.t('lanLabelPropertyInfosListed')}`}</Text>
            </View>
            <View style={{ margin: 10 }}>
              {propertyInfoList}
            </View>
            <View>
            </View>
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
                  <Text style={styles.headerTitleStyle}>{i18n.t('lanAppTitle')}</Text>
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
