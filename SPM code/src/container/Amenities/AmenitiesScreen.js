import React from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncStorage, BackHandler, Image, Platform, StatusBar, TouchableHighlight, Dimensions, Animated, TouchableOpacity, ScrollView, Keyboard, UIManager, TextInput, KeyboardAvoidingView, ActivityIndicator, RefreshControl } from 'react-native';
import { Icon, View, Text, List, Switch, Left, Body, Card, CardItem } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';
import SearchBar from 'react-native-searchbar';
import styles from './css/AmenitiesCss';
import { PUBLIC_DOMAIN } from '../../../constants';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['UserStore'], ['PropertyStore'])
@observer
export default class AmenitiesScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };

  constructor(props) {
    super(props);
    const navigation = props.navigation;

    this.state = {
      propertyInfoId: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyInfoId : '',
      propertyId: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyId : '',
      propertyType: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyType : '',
      propertyTitle: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyTitle : '',
      propertyImage: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyImage : '',
      mobileNumber: '',
      countryCode: '',
      shift: new Animated.Value(0),
      errorMessage: '',
      loading: false,
      reload: false,
      reloadFunction: '',
      disableButton: false,
      SPPropertyInfoList: [],
      spPInfoAmenitiesList: [],
      text: '',
      search: '',
      refreshing: false,
    }


  }
  componentWillMount() {
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    this.setState({ loading : true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading : false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    PropertyStore.getSPPropertyInfoList(this.state.propertyId, this.state.propertyInfoId, '', function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '0000') {
        _this.setState({ loading: false, SPPropertyInfoList: resObj.statusResult, spPInfoAmenitiesList: resObj.statusResult })
      } else {
        _this.setState({ loading: false, SPPropertyInfoList: [], spPInfoAmenitiesList: [] })
      }
    })
  }

  viewAmenity(i) {
    const navigation = this.props.navigation;
    const propertyData = navigation.state.params.propertyData;
    navigation.navigate('AmenitiesViewScreen', { spPInfoAmenitiesViewData: this.state.SPPropertyInfoList[i], propertyData: propertyData })
  }
  handleSearchChange = (Search) => {
    let searchSPPropertyInfoList = this.state.spPInfoAmenitiesList.filter(function (item) {
      return item.amenityName.indexOf(Search) > -1 || item.amenityType.indexOf(Search) > -1 ||
      item.amenityStatus.indexOf(Search) > -1
    });
    this.setState({ SPPropertyInfoList: searchSPPropertyInfoList });
  }

  handleSearchBackClick = (Search) => {
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    this.setState({ loading : true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading : false, reload: true, reloadFunction: 'handleSearchBackClick' });
    }, 10000);
    PropertyStore.getSPPropertyInfoList(this.state.propertyId, this.state.propertyInfoId, '', function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '0000') {
        _this.setState({ loading: false, SPPropertyInfoList: resObj.statusResult, spPInfoAmenitiesList: resObj.statusResult })
      } else {
        _this.setState({ loading: false, SPPropertyInfoList: [], spPInfoAmenitiesList: [] })
      }
    })
    this.searchBar.hide()
  }

  _onRefresh = () => {
    this.setState({ refreshing: true })
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ refreshing: false, reload: true, reloadFunction: '_onRefresh' });
    }, 10000);
    PropertyStore.getSPPropertyInfoList(this.state.propertyId, this.state.propertyInfoId, '', function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '0000') {
        _this.setState({ refreshing: false, SPPropertyInfoList: resObj.statusResult, spPInfoAmenitiesList: resObj.statusResult })
      } else {
        _this.setState({ refreshing: false, SPPropertyInfoList: [], spPInfoAmenitiesList: [] })
      }
    })
  }
  handleReload = () => {
    switch(this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      case 'handleSearchBackClick':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleSearchBackClick('reload')
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
    const PropertyStore = this.props.PropertyStore;
    const propertyData = navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData : {};
    return (
      <View style={styles.container}>
      {!this.state.reload
      ?<View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft} >
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()} >
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
              </TouchableHighlight>
            </View>
            <View style={styles.headerBody}>
                <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleAmenitiesList')}</Text>         
            </View>
            <View style={styles.headerRight}>
              <View style={{flex:1, justifyContent:'center', alignItems:'center' }}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()} >
                  <Icon name='checkmark-circle' style={styles.checkmarkStyle}/>
                </TouchableHighlight>
              </View>
              <View style={{flex:1, justifyContent:'center', alignItems:'center' }}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()} >
                  <Icon name='ios-search' style={styles.iconSearchStyle} />
                </TouchableHighlight>  
              </View>        
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
              onBack={(input) => this.handleSearchBackClick(input)}
            />
          </View>
        </LinearGradient>
        <View style={ styles.businessNameView } >
          <Card style={ styles.cardBusiness }>
            <CardItem style={ styles.cardItemBusinessStyle }>
                <Left style={[styles.leftImageView, styles.listItemView ]}>
                    <View style={styles.imageBusinessBox} >
                        <Image source={this.state.propertyImage ? {uri: PUBLIC_DOMAIN + this.state.propertyImage} : require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
                    </View>
                    <Body>
                        <View style={ styles.floatingInputBusinessView } >
                            <Text style={styles.propertyTitle}> {propertyData && propertyData.propertyName ? propertyData.propertyName : ''} </Text>
                            <Text style={styles.titleLocationType}> {propertyData && propertyData.propertyArea ? propertyData.propertyArea : ''} </Text>
                            <Text style={styles.titleType}> {this.state.propertyType} -{i18n.t('lanTitleAmenitiesList')}</Text>
                        </View>
                    </Body>
                </Left>  
            </CardItem>
          </Card>
        </View>
          <View >
            {this.state.loading ? 
             <View style={ styles.activeIndicatorView }><ActivityIndicator color="#ffffff" size='large' style={ styles.activeIndicatorStyle } /></View>
            : null 
            }
          </View>
        <ScrollView 
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          {
            // PropertyStore.isLoading ?
            // <View><ActivityIndicator size='large'/></View>
            // :
            this.state.SPPropertyInfoList.length > 0 ?
              this.state.SPPropertyInfoList.map((data, i) => {
                return (
                  <TouchableOpacity key={i} onPress={() => this.viewAmenity(i)}>
                    <View style={styles.content}>
                      <View style={styles.list}>
                        <View style={styles.LeftView}>
                          <Image source={(data && data.amenityIconPath) ? { uri: PUBLIC_DOMAIN + data.amenityIconPath } : require('../../../assets/icon11.png')} style={styles.images} />
                        </View>
                        <View style={styles.CenterView}>
                          <Text style={styles.textMedium}>{data.amenityName}</Text>
                          <View style={styles.aminityCharge}>
                            {
                              data.amenityType == 'Free'
                                ?
                                <Text style={[styles.textSmall, styles.textColor]}>Free</Text>
                                :
                                <Text style={[styles.textSmall, styles.textColor]}>{'\u20B9'} {data.amenityCharge}</Text>
                            }
                          </View>
                        </View>
                        <View style={styles.RightView}>
                          <Switch value={data.amenityStatus == 'Available' ? true : false} />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                )
              })
              : <View style={styles.noAmenities}><Text style={styles.noAmenitiesText}>{i18n.t('lanLabelNoAmenitiesListed')}</Text></View>
          }
          <View style={styles.btnModal} >
                <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                  <AwesomeButton block success
                    onPress={() => navigation.goBack()}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' 
                    backgroundShadow='transparent' backgroundDarker='transparent'
                    paddingHorizontal={50} borderRadius={22} 
                  >
                    <Text style={styles.BtnText}>  {i18n.t('lanButtonDone')} </Text>
                  </AwesomeButton>
                </LinearGradient>
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
              <Text style={styles.headerTitleStyle}>{i18n.t('lanAppTitle')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      <View style={{ jflex:1, justifyContent:'center', alignItems:'center', width:DEVICE_WIDTH - 20, height:Device_Height - 150}} >
        <View style={ styles.eachBtnView } >
          {/* <Button onPress={() => this.handleReload()}  style={ styles.btnStyle }>
            <Text style={ styles.btnTxt } >Reload </Text>
          </Button> */}
          <LinearGradient colors={['#01A4A2', '#025D8C']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
            <AwesomeButton block success
              onPress={() => this.handleReload()}
              width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
              <Text style={styles.BtnText1}>{i18n.t('lanButtonReload')}</Text>
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


