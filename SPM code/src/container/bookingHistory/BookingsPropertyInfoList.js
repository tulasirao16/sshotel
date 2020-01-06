import React from 'react';
import { observer, inject } from 'mobx-react';
import { Dimensions, BackHandler, FlatList, TouchableOpacity, TouchableHighlight, StatusBar, Platform, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { Icon, View, Text, Card, CardItem, Left, Body } from 'native-base';
import styles from './css/BookingsPropertyInfoListCss';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import SearchBar from 'react-native-searchbar';
import EachRowPropertyInfo from './EachRowPropertyInfo';
import { PUBLIC_DOMAIN } from '../../../constants';
import i18n from 'i18n-js';
import AwesomeButton from 'react-native-really-awesome-button';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const layoutHeight = 0;

@inject(['PropertyStore'])
@observer
export default class BookingsPropertyInfoList extends React.Component {
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
      activePage: 1,
      refreshing: false,
      loading: false,
      reload: false,
      reloadFunction: '',
      param1: null,
      Search: ''
    };
    // this.Refresh = this.Refresh.bind(this);
    this.handleCreatePropertyInfoList = this.handleCreatePropertyInfoList.bind(this);
  }
  componentWillMount() {
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    this.setState({ loading: true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    PropertyStore.getPropertyInfos(_this.state.propertyID, function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
      if(resObj.statusCode == '9999') {
        _this.props.navigation.navigate('InformationScreen')
      }
    });
  }
  componentWillReceiveProps (newProps) {
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    if(newProps.navigation.state.params && newProps.navigation.state.params.list == 'list') {
      this.setState({ loading: true });
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillReceiveProps', param1: newProps });
      }, 10000);
      PropertyStore.getPropertyInfos(_this.state.propertyID, function (resObj) {
        clearTimeout(isLoading)
        _this.setState({ loading: false })
        if(resObj.statusCode == '9999') {
          _this.props.navigation.navigate('InformationScreen')
        }
      });
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  handleBackButtonClick = () => {
    const navigation = this.props.navigation
    navigation.goBack()
    return true
  }

  _onRefresh = () => {
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    this.setState({ loading: true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: '_onRefresh' });
    }, 10000);
    PropertyStore.getPropertyInfos(_this.state.propertyID, function (resObj) {
      clearTimeout(isLoading)
        _this.setState({ loading: false })
      if(resObj.statusCode == '9999') {
        _this.props.navigation.navigate('InformationScreen')
      }
    });
  }

  // _handleSearch = () => {
  //   this.searchHeader.show()
  // 

  handleSearchChange = (Search) => {
    const PropertyStore = this.props.PropertyStore;
    // alert(JSON.stringify(PropertyStore.PropertyInfoDubList))
    console.log('PropertyInfoDubList', JSON.stringify(PropertyStore.PropertyInfoDubList))
    // alert(PropertyStore.PropertyInfoDubList.length)
    var searchList = PropertyStore.PropertyInfoDubList.filter(function (item) {
      console.log('PropertyInfoDubList', JSON.stringify(item))
      return item.propertyType.indexOf(Search) > -1 ||
        item.rentType.indexOf(Search) > -1 ||
        item.roomCategory.indexOf(Search) > -1 ||
        item.roomType.indexOf(Search) > -1 ||
        item.membersCapacity.toString().indexOf(Search) > -1 ||
        item.childsCapacity.toString().indexOf(Search) > -1 ||
        item.roomsCount.toString().indexOf(Search) > -1 ||
        item.activeRoomsCount.toString().indexOf(Search) > -1 ||
        item.singleBedsCount.toString().indexOf(Search) > -1 ||
        item.doubleBedsCount.toString().indexOf(Search) > -1 ||
        item.pricing.minBasePrice.toString().indexOf(Search) > -1 ||
        item.pricing.basePrice.toString().indexOf(Search) > -1 ||
        item.pricing.billingType.toString().indexOf(Search) > -1 ||
        item.pricing.currency.toString().indexOf(Search) > -1 ||
        item.spLocationObj.area.toString().indexOf(Search) > -1
    });
    PropertyStore.PropertyInfoList = searchList;
  }


  handleSearchBackClick = (Search) => {
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    var searchList = PropertyStore.PropertyInfoDubList.filter(function (item) {
      return item.propertyType.indexOf(Search) > -1 ||
        item.rentType.indexOf(Search) > -1 ||
        item.roomCategory.indexOf(Search) > -1 ||
        item.roomType.indexOf(Search) > -1 ||
        item.membersCapacity.toString().indexOf(Search) > -1 ||
        item.childsCapacity.toString().indexOf(Search) > -1 ||
        item.roomsCount.toString().indexOf(Search) > -1 ||
        item.activeRoomsCount.toString().indexOf(Search) > -1 ||
        item.singleBedsCount.toString().indexOf(Search) > -1 ||
        item.doubleBedsCount.toString().indexOf(Search) > -1 ||
        item.pricing.minBasePrice.toString().indexOf(Search) > -1 ||
        item.pricing.basePrice.toString().indexOf(Search) > -1 ||
        item.pricing.billingType.toString().indexOf(Search) > -1 ||
        item.pricing.currency.toString().indexOf(Search) > -1 ||
        item.spLocationObj.area.toString().indexOf(Search) > -1
    });
    PropertyStore.PropertyInfoList = searchList;
    this.searchBar.hide()
  }


  handleCreatePropertyInfoList () {
    const navigation = this.props.navigation;
    navigation.navigate('CreatePropertyInfo', {propertyData: navigation.state.params.propertyData});
  }
  handleReload = () => {
    switch(this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      case 'componentWillReceiveProps':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillReceiveProps(this.state.param1)
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
    let propertyInfoList =
    <View style={{ marginTop: 100, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    </View>;
    if (!PropertyStore.PropertyInfoList) {
      propertyInfoList = <View style={ styles.contentContainerStyle }>
        <Text >{i18n.t('lanLabelNoPropertyInfosTillNow')}</Text>
      </View>;
    } else {
      propertyInfoList =
      <FlatList
        refreshControl={
          <RefreshControl />
        }
        data={PropertyStore.PropertyInfoList}
        renderItem={({ item }) => <EachRowPropertyInfo navigation={navigation} data={item} key={item._id} />}
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
                <Text style={styles.headerTitleStyle}> {i18n.t('lanTitleCreateBooking')}</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()} >
                <Icon name='ios-search' style={styles.iconSearchStyle} />
              </TouchableHighlight>
            </View>
          </View>
          <View style={{position:'absolute', top:Platform.OS === 'ios' ? 28 : 21 }}>
              <SearchBar
                ref={(ref) => this.searchBar = ref}
                handleResults={this._handleResults}
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
        ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#ffffff' size='large' style={ styles.activeIndicatorStyle } /></View>
        : null}
        <View style={ styles.businessNameView } >
          <Card style={ styles.cardBusiness }>
            <CardItem style={ styles.cardItemBusinessStyle }>
              <Left style={[styles.leftImageView, styles.listItemView ]}>
                <View style={styles.imageBusinessBox} >
                  <Image source={this.state.propertyImage ? {uri: PUBLIC_DOMAIN + this.state.propertyImage} : require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
                </View>
                <Body>
                  <View style={ styles.floatingInputBusinessView } >
                    <Text  numberOfLines={1} ellipsizeMode='tail'  style={styles.propertyTitle}> {this.state.propertyTitle} </Text>
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
          <View style={ styles.propertyCountStyle } >
            <Text style={styles.title}>{`${i18n.t('lanLabelYouHave')} ${PropertyStore.PropertyInfoList.length} ${i18n.t('lanLabelPropertyInfosListed')}`}</Text>
          </View>
          <View>
            {propertyInfoList}
          </View>
        </ScrollView>
      </View>
      : <View>
      <LinearGradient colors={['#01A4A2', '#025D8C']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
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
