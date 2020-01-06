import React from 'react';
import { observer, inject } from 'mobx-react';
import { ActivityIndicator, BackHandler, FlatList, TouchableHighlight, Image, StatusBar, Dimensions, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { Icon, View, Text, Left, Body, Card, CardItem } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';

import styles from './css/CreateServiceCss';
import { PUBLIC_DOMAIN } from '../../../constants';
import ServiceEditListRow from './ServiceEditListRow';
import i18n from 'i18n-js';

const Services = require('../../../assets/Services/services.json')
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
@inject(['UserStore'], ['PropertyStore'])
@observer
export default class ServicesEditList extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    this.state = {
      shift: new Animated.Value(0),
      status: false,
      propertyID: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyId : '', 
      propertyInfoId: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyInfoId : '',
      propertyTitle: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyTitle : '',
      propertyType: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyType : '',
      services: [],
      spPInfoServicesList: [],
      isLoadingStatus: false,
      reload: false,
      reloadFunction: '',
      loading: false
    };
    this.handleServiceStatusChange = this.handleServiceStatusChange.bind(this);
  }
  componentWillMount () {
    const PropertyStore = this.props.PropertyStore;
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    PropertyStore.getInfoServices(_this.state.propertyID, _this.state.propertyInfoId, function(resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
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
    navigation = this.props.navigation
    navigation.navigate('ServiceView', { ServiceEditData: this.state.services[i], id: i });
  }

  editViewService = (i) => {
    const PropertyStore = this.props.PropertyStore;
    navigation = this.props.navigation
    navigation.navigate('ServiceEdit', { onNavigateBack: this.handleOnNavigateBack, ServiceEditData: PropertyStore.PropertyInfoServicesList[i], id: i });
  }
  handleServiceStatusChange () {
    this.setState({isLoadingStatus: true, loading: false})
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'handleServiceStatusChange' });
    }, 10000);
    PropertyStore.getInfoServices(_this.state.propertyID, _this.state.propertyInfoId, function(resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
    });
  }
  handleOnNavigateBack = () => {
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'handleOnNavigateBack' });
    }, 10000);
    PropertyStore.getInfoServices(_this.state.propertyID, _this.state.propertyInfoId, function(resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
    });
  }
  handleDone = () => {
    navigation = this.props.navigation;
    navigation.goBack()
  }
  handleReload = () => {
    switch (this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      case 'handleServiceStatusChange':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleServiceStatusChange()
        break;
        case 'handleOnNavigateBack':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleOnNavigateBack()
        break;
      default:
        break;
    }
  }
  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    const data = navigation.state.params.propertyData;
    let serviceData = <View></View>;
    if (!PropertyStore.PropertyInfoServicesList) {
      serviceData =  <View style={styles.noAmenities} >
        <Text noAmenitiesText >{i18n.t('lanLabelNoUsersFound')}</Text>
        </View>;
      
    } else if (PropertyStore.PropertyInfoServicesList.length > 0) {
      serviceData = 
      <FlatList
        data={PropertyStore.PropertyInfoServicesList}
        renderItem={({ item, index }) => <ServiceEditListRow navigation={navigation} index={index} editViewService={this.editViewService} handleServiceStatusChange = {this.handleServiceStatusChange} data={item} services={this.state.services}/>}
        keyExtractor={(item, index) => index.toString()}
      />
    } 
    return (
    !this.state.reload
      ? <View style={styles.container}>
          <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <StatusBar barStyle='light-content' />
            <View style={styles.status} />
            <View style={styles.headerMainView} >
              <View style={styles.headerLeft} >
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()}>
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
                </TouchableHighlight>
              </View>
              <View style={styles.headerBody} >
                <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleServicesEditList')}</Text>
              </View>
            </View>
          </LinearGradient>
          {this.state.loading
            ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#FFFFFF' size='large' style={styles.activeIndicatorStyle} /></View>
            : null}
        <View style={ styles.businessNameView } >
          <Card style={ styles.cardItemBusinessStyle }>
            <CardItem style={ styles.cardItemStyle }>
              <Left style={[styles.leftImageView, styles.listItemView ]}>
                <View style={styles.imageBusinessBox} >
                    <Image source={(data && data.propertyIconPath) ? { uri: PUBLIC_DOMAIN + data.propertyIconPath } : require('../../../assets/icon11.png')} style={styles.imgBusinessStyle} />
                </View>
                <Body>
                  <View style={ styles.floatingInputBusinessView } >
                      <Text style={styles.propertyTitle}> {this.state.propertyTitle} </Text>
                      <Text style={styles.titleLocationType}> Tarnaka </Text>
                      <Text style={styles.titleType}> {this.state.propertyType} - {i18n.t('lanLabelServices')} </Text>
                  </View>
                </Body>
              </Left>  
            </CardItem>
          </Card>
        </View>
        <ScrollView>
          {serviceData}
          {PropertyStore.PropertyInfoServicesList.length > 0 ? 
           <View style={styles.btnModal} >
           <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
             <AwesomeButton block success
               onPress={this.handleDone}
               width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
               <Text style={styles.BtnText}>{i18n.t('lanCommonButtonDone')}</Text>
             </AwesomeButton>
           </LinearGradient>
         </View>
         : null}
        </ScrollView>
      </View >
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