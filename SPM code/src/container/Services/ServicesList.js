import React from 'react';
import { observer, inject } from 'mobx-react';
import { ActivityIndicator, Button, BackHandler, Image, Platform, TouchableHighlight, Dimensions, Animated, TouchableOpacity, StatusBar, ScrollView, Keyboard, UIManager, TextInput, KeyboardAvoidingView } from 'react-native';
import { Icon, View, Text, List, Switch, Left, Body, Card, CardItem } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';
import SearchBar from 'react-native-searchbar';

import styles from '../Amenities/css/AmenitiesCss';
import { PUBLIC_DOMAIN } from '../../../constants';
import i18n from 'i18n-js';

const Services = require('../../../assets/Services/services.json')
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['UserStore'], ['PropertyStore'])
@observer
export default class ServicesList extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    this.state = {
      shift: new Animated.Value(0),
      status: false,
      propertyID: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyId : '',
      propertyInfoId: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyInfoId : '',
      propertyTitle: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyTitle : '',
      propertyType: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyType : '',
      services: [],
      spPInfoServicesList: [],
      search: '',
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
    PropertyStore.getInfoServices(_this.state.propertyID, _this.state.propertyInfoId, function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '0000') {
        _this.setState({ loading: false, services: resObj.statusResult, spPInfoServicesList: resObj.statusResult });
      } else {
        _this.setState({ loading: false, services: [] });
      }
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    const navigation = this.props.navigation;
    navigation.goBack();
    return true;
  }

  viewService = (i) => {
    navigation = this.props.navigation;
    navigation.navigate('ServiceView', { ServiceEditData: this.state.services[i], id: i });
  }

  handleSearchChange(search) {
    let searchSPPIServicesList = this.state.services.filter(function (item) {
      return item.serviceName.indexOf(search) > -1;
    });
    this.setState({ spPInfoServicesList: searchSPPIServicesList });
  }

  handleSearchBackClick = (search) => {
    this.handleSearchChange('')
    this.searchBar.hide()
  }

  handleReload = () => {
    switch (this.state.reloadFunction) {
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
    const data = navigation.state.params.propertyData;
    return (
        !this.state.reload
          ? <View style={styles.container}>
            <LinearGradient colors={['#019fa0', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.headerStyle}>
              <StatusBar barStyle='light-content' />
              <View style={styles.status} />
              <View style={styles.headerMainView} >
                <View style={styles.headerLeft} >
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()} >
                    <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
                  </TouchableHighlight>
                </View>
                <View style={styles.headerBody}>
                  <Text style={styles.headerTitleStyle}>{i18n.t('lanLabelServicesList')}</Text>
                </View>
                <View style={styles.headerRight}>
                  <View style={{ flex: 1 }}>
                    <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()} >
                      <Icon name='checkmark-circle' style={styles.checkmarkStyle} />
                    </TouchableHighlight>
                  </View>
                  <View style={{ flex: 1 }}>
                    <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()} >
                      <Icon name='ios-search' style={styles.iconSearchStyle} />
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
            </LinearGradient>
            <View style={styles.businessNameView} >
              <Card style={styles.cardBusiness}>
                <CardItem style={styles.cardItemBusinessStyle}>
                  <Left style={[styles.leftImageView, styles.listItemView]}>
                    <View style={styles.imageBusinessBox} >
                      <Image source={(data && data.propertyIconPath) ? { uri: PUBLIC_DOMAIN + data.propertyIconPath } : require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
                    </View>
                    <Body>
                      <View style={styles.floatingInputBusinessView} >
                        <Text style={styles.propertyTitle}>{this.state.propertyTitle}</Text>
                        <Text style={styles.titleLocationType}> {this.state.propertyArea} </Text>
                        <Text style={styles.titleType}> {this.state.propertyType} {i18n.t('lanLabelService')}</Text>
                      </View>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
            </View>
            {this.state.loading
            ? <View style={ styles.activeIndicatorView }><ActivityIndicator color="#FFFFFF" size='large' style={ styles.activeIndicatorStyle } /></View>
            : null}
            <ScrollView>
              {
                this.state.spPInfoServicesList.length > 0
                  ?
                  this.state.spPInfoServicesList.map((data, i) => {
                    return (
                      <TouchableOpacity key={i} onPress={() => this.viewService(i)}>
                        <View style={styles.content}>
                          <View style={styles.list}>
                            <View style={styles.LeftView}>
                              <Image source={(data && data.serviceIconPath) ? { uri: PUBLIC_DOMAIN + data.serviceIconPath } : require('../../../assets/icon11.png')} style={styles.images} />
                            </View>
                            <View style={styles.CenterView}>
                              <Text style={styles.textMedium}>{data.serviceName}</Text>
                              <View style={styles.aminityCharge}>
                                <Text style={[styles.textSmall, styles.textColor]}>{data.serviceType}</Text>
                                <Text style={[styles.textSmall, styles.textColor]}>{'\u20B9'} {data.serviceCharge}</Text>
                              </View>
                            </View>
                            <View style={styles.RightView}>
                              <Switch
                                value={data.serviceStatus == 'Available' ? true : false}
                              // onValueChange={() => this._handelSwitch(i, data)} 
                              />
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )
                  })
                  : <View style={styles.noAmenities}><Text style={styles.noAmenitiesText} >{i18n.t('lanLabelNoServicesListed')}</Text></View>
              }
              {this.state.spPInfoServicesList.length > 0 ? <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 17 }} >
                <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                  <AwesomeButton block success
                    onPress={() => navigation.goBack()}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent'
                    backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22}>
                    <Text style={styles.BtnText} >{i18n.t('lanCommonButtonDone')}</Text>
                  </AwesomeButton>
                </LinearGradient>
              </View> : null}
            </ScrollView>
          </View >
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


