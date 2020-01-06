import React from 'react';
import { observer, inject } from 'mobx-react';
import { ActivityIndicator, AsyncStorage, BackHandler, TouchableHighlight, Image, StyleSheet, Platform, Dimensions, Animated, TouchableOpacity, ScrollView, Keyboard, UIManager, TextInput, KeyboardAvoidingView, RefreshControl } from 'react-native';
import { Button, Container, Header, Content, Form, Icon, View, Text, List, Switch, Left, Body, Right, ListItem, Item, Input, Label, Card, CardItem } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';
import SearchBar from 'react-native-searchbar';
import i18n from 'i18n-js';

import styles from './css/PropertyInfoPricingListCss';
import { PUBLIC_DOMAIN } from '../../../constants';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['UserStore'], ['PropertyStore'])
@observer
export default class PropertyInfoPricingListScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      shift: new Animated.Value(0),
      SPPropertyInfoPricingList: [],
      refreshing: false,
      reload: false,
      reloadFunction: '',
      loading: false
    }
  }
  componentWillMount() {
    const PropertyStore = this.props.PropertyStore;
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    PropertyStore.getSPPropertyInfoPricingList('', function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '0000') {
        _this.setState({ loading: false, SPPropertyInfoPricingList: resObj.statusResult })
      } else {
        _this.setState({ loading: false })
      }
    })
  }
  componentWillReceiveProps() {
    const PropertyStore = this.props.PropertyStore;
    const navigation = this.props.navigation;
    if (!PropertyStore.internet_connection) {
      navigation.navigate('InformationScreen');
    }
  }

  handleSearchChange = (Search) => {
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    PropertyStore.getSPPropertyInfoPricingList(Search, function (resObj) {
      if (resObj.statusCode == '0000') {
        _this.setState({ loading: false, SPPropertyInfoPricingList: resObj.statusResult })
      } else {
        _this.setState({ loading: false, SPPropertyInfoPricingList: [] })
      }
    })
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ refreshing: false, reload: true, reloadFunction: '_onRefresh' });
    }, 10000);
    PropertyStore.getSPPropertyInfoPricingList('', function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '0000') {
        _this.setState({ SPPropertyInfoPricingList: resObj.statusResult, refreshing: false })
      } else if (!PropertyStore.internet_connection) {
        _this.setState({ refreshing: false })
        _this.props.navigation.navigate('InformationScreen')
      } else {
        _this.setState({ refreshing: false })
      }
    })
  }
  propertyInfoView(i) {
    this.props.navigation.navigate('PropertyInfoPricingViewScreen', { PropertyInfoPricingData: this.state.SPPropertyInfoPricingList[i] });
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
      case '_onRefresh':
        this.setState({ reload: false, reloadFunction: '' });
        this._onRefresh()
        break;
      default:
        break;
    }
  }
  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    PropertyStore = this.props.PropertyStore;
    return (
      !this.state.reload
        ? <View style={styles.container}>
          <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <View style={styles.headerMainView} >
              <View style={styles.headerLeft}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.props.navigation.openDrawer()}>
                  <Icon name='ios-menu' style={styles.iconMenuStyle} />
                </TouchableHighlight>
              </View>
              <View style={styles.headerBody}>
                <Text style={styles.headerTitleStyle}>{i18n.t('lanTitlePropertyInfoPricing')}</Text>
              </View>
              <View style={styles.headerRight}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()}>
                  <Icon name='ios-search' style={styles.iconSearchStyle} />
                </TouchableHighlight>
              </View>
            </View>
            <View>
            </View>
            <View style={{ position: 'absolute', top: Platform.OS === 'ios' ? 28 : 21 }}>
              <SearchBar
                ref={(ref) => this.searchBar = ref}
                showOnLoad={false}
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
          ? <View style={styles.activeIndicatorView}><ActivityIndicator color="#ffffff" size='large' style={styles.activeIndicatorStyle} /></View>
          : null}
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            {PropertyStore.isLoading ?
              <View></View>
              : this.state.SPPropertyInfoPricingList.length > 0
                ? this.state.SPPropertyInfoPricingList.map((data, i) => {
                  return (
                    <TouchableOpacity key={i} onPress={() => this.propertyInfoView(i)}>
                      <View style={styles.content}>
                        <View style={styles.mainView}>
                          <View style={styles.LeftView}>
                            <Image source={(data && data.propertyId.imagePath) ? { uri: PUBLIC_DOMAIN + data.propertyId.imagePath } : require('../../../assets/icon11.png')} style={styles.images} />
                          </View>
                          <View style={styles.CenterView}>
                            <List>
                              <ListItem style={styles.listitem}>
                                <Text style={styles.textBig}>
                                  {`${data.spServiceProvider}, ${data.spLocationObj.area}`}
                                </Text>
                              </ListItem>
                              <ListItem style={styles.listitem}>
                                <View style={styles.leftListItem}>
                                  <Text style={styles.textLight}>{i18n.t('lanLabelRentType')}</Text>
                                </View>
                                <View style={styles.centerListItem}>
                                  <Text style={styles.textMedium}>{data.rentType} </Text>
                                </View>
                              </ListItem>
                              <ListItem style={styles.listitem}>
                                <View style={styles.leftListItem}>
                                  <Text style={styles.textLight}>{i18n.t('lanLabelRoomType')}</Text>
                                </View>
                                <View style={styles.centerListItem}>
                                  <Text style={styles.textMedium}>{data.roomType}</Text>
                                </View>
                              </ListItem>
                              <ListItem style={styles.listitem}>
                                <View style={styles.leftListItem}>
                                  <Text style={styles.textLight}>{i18n.t('lanLabelBasePrice')}</Text>
                                </View>
                                <View style={styles.centerListItem}>
                                  <Text style={[styles.textSmall, styles.textColor]}>{'\u20B9'} {data.pricing.basePrice}</Text>
                                </View>
                              </ListItem>
                              <ListItem style={styles.listitem}>
                                <View style={styles.leftListItem}>
                                  <Text style={styles.textLight}>{i18n.t('lanLabelBillingType')}</Text>
                                </View>
                                <View style={styles.centerListItem}>
                                  <Text style={styles.textMedium}>{data.pricing.billingType}</Text>
                                </View>
                              </ListItem>
                            </List>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
                : <Text>{i18n.t('lanLabelNoProperties')}</Text>
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
