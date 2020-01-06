import React from 'react';
import { Platform, ActivityIndicator, Dimensions, Animated, TouchableHighlight, TouchableOpacity, ScrollView, Image, StatusBar } from 'react-native';
import { Button, Icon, View, Left, Right, Text, Body, Card, CardItem, Switch } from 'native-base';
import styles from './css/PropertyInfoViewCss';
import AwesomeButton from 'react-native-really-awesome-button';
import { LinearGradient } from 'expo-linear-gradient';
import { inject, observer } from 'mobx-react';
import { PUBLIC_DOMAIN } from '../../../constants';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
import i18n from 'i18n-js';
const Device_Height = Dimensions.get('window').height;

@inject(['PropertyStore'])
@observer
export default class PropertyInfoView extends React.Component {
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
      propertyDocs: [],
      propertyImage: navigation.state.params && navigation.state.params.data ? navigation.state.params.data.propertyId.imagePath : '',
      reload: false,
      reloadFunction: '',
      loading: false,

    };
    this._handleTypeOfProperty = this._handleTypeOfProperty.bind(this);
    this._handleAmenities = this._handleAmenities.bind(this);
    this._handleGuestRules = this._handleGuestRules.bind(this);
    this._handleAddPrice = this._handleAddPrice.bind(this);
  }
  componentWillMount() {
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    PropertyStore.getSPPropertyDocs(navigation.state.params.data._id, function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '0000') {
        _this.setState({ loading: false, propertyDocs: resObj.statusResult });
      } else {
        _this.setState({ loading: false, propertyDocs: [] });
      }
    });
  }
  _onButtonNextPress() {
    navigation = this.props.navigation
    navigation.navigate('GuestInformationScreen')
  }
  _handleTypeOfProperty(propertyType) {
    navigation = this.props.navigation
    navigation.navigate('TypeOfPropertyInfoScreen', { propertyType: propertyType })
  }

  _handleAmenities(data) {
    const navigation = this.props.navigation;
    let propertyData = {
      propertyInfoId: data._id,
      propertyId: data.propertyId._id,
      propertyTitle: data.propertyTitle,
      propertyType: data.propertyType,
      propertyImage: data.propertyId.imagePath,
      guestRulesNotes: data.guestRulesNotes,
      propertyName: data.propertyId.name,
      propertyArea: data.propertyId.spLocationObj.area
    }
    navigation.navigate('AmenitiesScreen', { propertyData: propertyData })
  }
  handleServices(data) {
    const navigation = this.props.navigation;
    let propertyData = {
      propertyInfoId: data._id,
      propertyId: data.propertyId._id,
      propertyTitle: data.propertyTitle,
      propertyType: data.propertyType,
      propertyIconPath: data.propertyId.imagePath,
    }
    navigation.navigate('ServicesList', { propertyData: propertyData })
  }
  _handleGuestRules(data) {
    const navigation = this.props.navigation;
    let propertyData = {
      propertyInfoId: data._id,
      propertyId: data.propertyId._id,
      propertyType: data.propertyType,
      propertyTitle: data.propertyTitle,
      propertyImage: data.propertyId.imagePath,
      guestRulesNotes: data.guestRulesNotes,
      propertyName: data.propertyId.name,
      propertyArea: data.propertyId.spLocationObj.area
    }
    navigation.navigate('GuestRulesList', { propertyData: propertyData })
  }
  _handleAddPrice(data) {
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    let propertyData = {
      propertyTitle: data.propertyTitle,
      propertyType: data.propertyType,
      propertyImage: data.propertyId.imagePath,
      propertyArea: data.propertyId.spLocationObj.area,
      pricing: PropertyStore.InfoPricing && PropertyStore.InfoPricing.basePrice ? PropertyStore.InfoPricing: data.pricing
    }
    navigation.navigate('AddPriceViewScreen', { propertyPrice: propertyData })
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
    const data = navigation.state.params && navigation.state.params.data ? navigation.state.params.data : {}
    return (
      !this.state.reload
      ? <View style={styles.container}>
        <LinearGradient colors={['#019fa0', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.headerStyle}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView}>
            <View style={styles.headerLeft} >
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()}>
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
              </TouchableHighlight>
            </View>
            <View style={styles.headerBody} >
              <Text numberOfLines={1} ellipsizeMode='tail' style={styles.headerTitleStyle} >{data && data.propertyTitle ? data.propertyTitle : 'List Your Property'}</Text>
            </View>
            {data && data.propertyAction && data.propertyAction == 'Edit' ?
              <View style={styles.headerRight} >
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.navigate('PropertyInfoEdit', { propertyData: data, propertyID: this.props.navigation.state.params.propertyID })} >
                  <Icon name='create' style={styles.iconEditStyle} />
                </TouchableHighlight>
              </View>
              : null}
          </View>
        </LinearGradient>
        {this.state.loading ?
        <View style={styles.activeIndicatorView}><ActivityIndicator color='#ffffff' size='large' style={styles.activeIndicatorStyle} /></View>
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
                    <Text numberOfLines={1} ellipsizeMode='tail' style={styles.propertyTitle}> {data.propertyTitle} </Text>
                    <Text style={styles.titleLocationType}> {data.propertyId.spLocationObj.area} </Text>
                    <Text style={styles.titleType}> {data.propertyType} - {i18n.t('lanTitlePropertyInfoView')} </Text>
                  </View>
                </Body>
              </Left>
            </CardItem>
          </Card>
        </View>
        <View >
        </View>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.card}>
              <View style={styles.cardItem}>
                <Left>
                  <View>
                    <Text style={styles.textSmall}>{i18n.t('lanLabelPropertyTitle')}</Text>
                    <Text style={styles.textmedium} >{data.propertyTitle}</Text>
                  </View>
                </Left>
              </View>
              <View style={styles.cardItem}>
                <Left>
                  <View>
                    <Text style={styles.textSmall}>{i18n.t('lanLabelTypeOfProperty')} </Text>
                    <Text style={styles.textmedium} >{data.propertyType}</Text>
                  </View>
                </Left>
                <Right>
                  <View style={styles.rightData}>
                    <Text style={styles.textSmall}>{i18n.t('lanLabelRoomCategory')}</Text>
                    <Text style={styles.textmedium} >{data.roomCategory}</Text>
                  </View>
                </Right>
              </View>
              <View style={styles.cardItem}>
                <Left>
                  <View>
                    <Text style={styles.textSmall}>{i18n.t('lanLabelRentType')}</Text>
                    <Text style={styles.textmedium} >{data.rentType}</Text>
                  </View>
                </Left>
                <Right >
                  <View style={styles.rightData} >
                    <Text style={styles.textSmall}>{i18n.t('lanLabelRoomType')} </Text>
                    <Text style={styles.textmedium}>{data.roomType}</Text>
                  </View>
                </Right>
              </View>
              <View style={styles.cardItem}>
                <Left>
                  <View>
                    <Text style={styles.textSmall}>{i18n.t('lanLabelRoomName')}</Text>
                    <Text style={styles.textmedium} >{data.roomsName}</Text>
                  </View>
                </Left>
                <Body>
                  <View>
                    <Text style={styles.textSmall}> {i18n.t('lanLabelAdultsCapacity')}</Text>
                    <Text style={styles.textmedium}  >{data.membersCapacity}</Text>
                  </View>
                </Body>
                <Right>
                  <View style={styles.rightData}>
                    <Text style={styles.textSmall}>{i18n.t('lanLabelChildCapacity')}</Text>
                    <Text style={styles.textmedium} >{data.childsCapacity}</Text>
                  </View>
                </Right>
              </View>
              <View style={styles.cardItem}>
                <Left>
                  <View>
                    <Text style={styles.textSmall}>{i18n.t('lanLabelRoomsCount')}</Text>
                    <Text style={styles.textmedium}  >{data.activeRoomsCount} {' of'} {data.roomsCount}</Text>
                  </View>
                </Left>
                <Body>
                  <View>
                    <Text style={styles.textSmall}>{i18n.t('lanLabelOnHoldRooms')}</Text>
                    <Text style={styles.textmedium} >{data.onHoldRoomsCount}</Text>
                  </View>
                </Body>
                <Right>
                  <Text style={styles.textSmall}>{i18n.t('lanLabelStatus')}</Text>
                  <View style={styles.rightData}>
                    <Switch value={data.status == 'Active' ? true : false}></Switch>
                  </View>
                </Right>
              </View>
              <View style={styles.cardItem}>
                <Left>
                  <View>
                    {/* <Text style={styles.textSmall}>{i18n.t('lanLabelDefaultPriority')}</Text>
                    <Text style={styles.textmedium}>{data.isDefault ? 'True' : 'False'}</Text> */}
                    <Text style={styles.textSmall}>{i18n.t('lanLabelSingleBeds')}</Text>
                    <Text style={styles.textmedium} >{data.singleBedsCount ? data.singleBedsCount : 0}</Text>
                  </View>
                </Left>
                <Body>
                  <View>
                    <Text style={styles.textSmall}>{i18n.t('lanLabelDoubleBeds')}</Text>
                    <Text style={styles.textmedium} >{data.doubleBedsCount ? data.doubleBedsCount : 0}</Text>
                  </View>
                </Body>
                <Right>
                  <View style={styles.rightData}>
                    <Text style={styles.textSmall}>{i18n.t('lanLabelHalls')}</Text>
                    <Text style={styles.textmedium} >{data.hallsCount ? data.hallsCount : 0}</Text>
                  </View>
                </Right>
              </View>
              <View style={styles.cardItem}>
                <Left>
                  <View>
                    <Text style={styles.textSmall}>{i18n.t('lanLabelBathRooms')}</Text>
                    <Text style={styles.textmedium} >{data.privateBathRooms ? data.privateBathRooms : 0}</Text>
                  </View>
                </Left>
                <Body>
                  <View>
                    <Text style={styles.textSmall}>{i18n.t('lanLabelACs')}</Text>
                    <Text style={styles.textmedium} >{data.acsCount ? data.acsCount : 0}</Text>
                  </View>
                </Body>
                <Right>
                  <View style={styles.rightData}>
                    <Text style={styles.textSmall}>{i18n.t('lanLabelKitchens')}</Text>
                    <Text style={styles.textmedium}  >{data.kitchensCount ? data.kitchensCount : 0}</Text>
                  </View>
                </Right>
              </View>
              {/* <View style={styles.cardItem}>
                <Left >
                  <View>
                    <Text style={styles.textSmall}>{i18n.t('lanLabelHalls')}</Text>
                    <Text style={styles.textmedium} >{data.hallsCount ? data.hallsCount : 0}</Text>
                  </View>
                </Left>
              </View> */}
              <TouchableOpacity onPress={() => this._handleAddPrice(data)}>
                <View style={styles.cardItem}>
                  <Left>
                    <View>
                      <Text style={[styles.title, styles.titleRouting]}>{i18n.t('lanLabelPRICEDETAILS')}</Text>
                    </View>
                  </Left>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this._handleAmenities(data)}>
                <View style={styles.cardItem}>
                  <Left>
                    <View>
                      <Text style={[styles.title, styles.titleRouting]}>{i18n.t('lanLabelAMENITIES')}</Text>
                    </View>
                  </Left>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.handleServices(data)}>
                <View style={styles.cardItem}>
                  <Left>
                    <View>
                      <Text style={[styles.title, styles.titleRouting]}>{i18n.t('lanLabelSERVICES')}</Text>
                    </View>
                  </Left>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this._handleGuestRules(data)}>
                <View style={styles.cardItem}>
                  <View>
                    <View>
                      <Text style={[styles.title, styles.titleRouting]}>{i18n.t('lanLabelGUESTRULES')}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.btnModal} >
              <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                <AwesomeButton block success
                  onPress={() => navigation.goBack()}
                  width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} marginTop={20} >
                  <Text style={styles.BtnText}> {i18n.t('lanButtonDone')} </Text>
                </AwesomeButton>
              </LinearGradient>
            </View>
          </View>
        </ScrollView>
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

