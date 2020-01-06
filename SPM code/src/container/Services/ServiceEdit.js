import React from 'react';
import { observer, inject } from 'mobx-react';
import { Dimensions, BackHandler, Animated, TouchableOpacity, TouchableHighlight, ScrollView, StatusBar, Image, TextInput, ActivityIndicator, Platform } from 'react-native';
import { Icon, View, Text, List, Left, Body, ListItem, Card, CardItem, Picker } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';
import ToggleSwitch from 'toggle-switch-react-native';

import styles from './css/CreateServiceCss';
import { PUBLIC_DOMAIN } from '../../../constants';
import i18n from 'i18n-js';
const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['UserStore'], ['PropertyStore'])
@observer
export default class ServiceEdit extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };

  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    let ServiceEditData = navigation.state.params.ServiceEditData;
    let id = navigation.state.params.id;
    this.state = {
      serviceType: ServiceEditData && ServiceEditData.serviceType ? ServiceEditData.serviceType : '',
      serviceCharge: ServiceEditData && ServiceEditData.serviceCharge ? ServiceEditData.serviceCharge : '0',
      serviceName: ServiceEditData && ServiceEditData.serviceName ? ServiceEditData.serviceName : '',
      id: id,
      errorMessage: '',
      serviceStatus: ServiceEditData && ServiceEditData.serviceStatus ? ServiceEditData.serviceStatus : '',
      propertyInfoId: ServiceEditData && ServiceEditData.propertyInfoId ? ServiceEditData.propertyInfoId : '',
      reload: false,
      reloadFunction: '',
      loading: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleServiceType(itemValue) {
    if (itemValue == 'Free') {
      this.setState({ serviceType: itemValue, serviceCharge: '0' })
    } else {
      this.setState({ serviceType: itemValue })
    }
  }
  handleSubmit() {
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    let ServiceEditData = navigation.state.params.ServiceEditData;
    if(this.state.serviceType == 'Paid' && this.state.serviceCharge < 1) {
      this.setState({errorMessage: i18n.t('lanErrorPaidServiceShouldBeCharged')})
    } else if(ServiceEditData.serviceType == this.state.serviceType && ServiceEditData.serviceCharge == this.state.serviceCharge
      &&  ServiceEditData.serviceStatus == this.state.serviceStatus) {
           navigation.goBack(); 
    } else {
      var num = parseInt(this.state.serviceCharge);
      let serviceData = {
        _id: ServiceEditData._id,
        serviceType: this.state.serviceType,
        serviceCharge: num,
        serviceStatus: this.state.serviceStatus
      }
      this.setState({ loading : true });
      let _this = this;
      let isLoading = setTimeout(function () {
        _this.setState({ loading : false, reload: true });
      }, 10000);
      PropertyStore.updateSPPropertyInfoServicesData(serviceData, function (resObj) {
        clearTimeout(isLoading)
        if (resObj.statusCode == '0000') {
          _this.setState({ loading: false });
          let x = PropertyStore.ServicesAvailable;
          let servicesAvailable = x.indexOf(resObj.statusResult.serviceName);
          if (servicesAvailable === -1) {
            x.push(resObj.statusResult.serviceName);
          } else {
            x.splice(servicesAvailable, 1);
          }
          let put_json = {
            type: 'services',
            avaliableData:  PropertyStore.ServicesAvailable
          };
          PropertyStore.updateAmenitiesInPropertyInfo(_this.state.propertyInfoId,  put_json, function(upObj) {
          });
          navigation.state.params.onNavigateBack()
          navigation.goBack();
        } else {
          _this.setState({ loading: false, errorMessage: i18n.t('lanErrorUpdateFailed') })
        }
      });
    }
  }

  handelServiceStatus(isOn) {
    if (this.state.serviceStatus == 'Available') {
      this.setState({ serviceStatus: 'Unavailable' })
    } else {
      this.setState({ serviceStatus: 'Available' })
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

  render() {
    const navigation = this.props.navigation;
    let ServiceEditData = navigation.state.params.ServiceEditData;
    const PropertyStore = this.props.PropertyStore;
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft}>
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()}>
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
                </TouchableHighlight>
              </View>
            <View style={styles.headerBody}>
              <Text style={styles.headerTitleStyle}>{i18n.t('lanLabelServiceEdit')}</Text>
            </View>
          </View>
        </LinearGradient>
        {/* {
          this.state.loading
          ? <View ><ActivityIndicator size='large' /></View>
          : null
        } */}
        {this.state.loading
          ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#FFFFFF' size='large' style={ styles.activeIndicatorStyle } /></View>
          : null}
        <View style={styles.businessNameView} >
          <Card style={styles.cardBusiness}>
            <CardItem style={styles.cardItemBusinessStyle}>
              <Left style={[styles.leftImageView, styles.listItemView]}>
                <View style={styles.imageBusinessBox} >
                  <Image source={(ServiceEditData.propertyId && ServiceEditData.propertyId.imagePath) ? { uri: PUBLIC_DOMAIN + ServiceEditData.propertyId.imagePath } : require('../../../assets/icon11.png')} style={styles.imgBusinessStyle} />
                </View>
                <Body>
                  <View style={styles.floatingInputBusinessView} >
                    <Text style={styles.propertyTitle}> {ServiceEditData.propertyTitle} </Text>
                    <Text style={styles.titleLocationType}> {ServiceEditData.propertyId.spLocationObj.area} </Text>
                    <Text style={styles.titleType}> {ServiceEditData.propertyType} - {ServiceEditData.serviceName} </Text>
                  </View>
                </Body>
              </Left>
            </CardItem>
          </Card>
        </View>
        <ScrollView>
          <View style={styles.aminityView}>
            <View style={ styles.eachAminityCenterView } >
              <View style={ styles.eachAminityView} >
                  <View style={styles.imageAmenityBox} >
                      <Image source={(ServiceEditData && ServiceEditData.serviceIconPath) ? { uri: PUBLIC_DOMAIN + ServiceEditData.serviceIconPath } : require('../../../assets/icon11.png')} style={styles.imgAmenityStyle} />
                  </View>
                  <Text style={styles.titleTypeWhite}> {ServiceEditData && ServiceEditData.serviceName ? ServiceEditData.serviceName : ''} </Text>
              </View>
            </View>
            <View style={styles.contentAmenityView}>
              <List>
                <ListItem style={styles.listitem}>
                  <View style={styles.leftListItem}>
                      <Text style={styles.textLight}>{i18n.t('lanLabelServiceCode')} <Text style={{ color: 'red', paddingTop: 5 }}> *</Text></Text>
                  </View>
                  <View style={styles.centerListItem}>
                      <Text style={styles.textMedium}>{ServiceEditData.serviceId} </Text>
                  </View>
                </ListItem>
                <ListItem style={styles.listitem}>
                  <View style={styles.leftListItem}>
                    <Text style={styles.TextStyle}> {i18n.t('lanLabelSelecServiceType')} <Text style={{ color: 'red', paddingTop: 5 }}> *</Text> </Text>
                  </View>
                  <View style={styles.centerListItem}>
                    <View style={styles.pickerView} >
                      <Picker
                        iosHeader='Select one'
                        iosIcon={<Icon name='arrow-down' />}
                        mode='dropdown'
                        selectedValue={this.state.serviceType}
                        style={{ width: DEVICE_WIDTH/3, top:-5 }}
                        onValueChange={(itemValue, itemIndex) => this.handleServiceType(itemValue)}>
                        <Picker.Item label='Free' value='Free' />
                        <Picker.Item label='Paid' value='Paid' />
                      </Picker>
                    </View>
                  </View>
                </ListItem>

                <ListItem style={styles.listitem}>
                  <View style={styles.leftListItem}>
                    <Text style={styles.TextStyle}>{i18n.t('lanLabelEnterServiceCharge')} ({'\u20B9'}) <Text style={{ color: 'red', paddingTop: 5 }}> *</Text> </Text>
                  </View>
                  <View style={styles.centerListItem}>
                    <TextInput style={styles.textInputStyle}
                      editable={this.state.serviceType == 'Free' ? false : true}
                      keyboardType='numeric'
                      returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                      value={this.state.serviceCharge}
                      onChangeText={(price) => this.setState({ serviceCharge: price, errorMessage: '' })}
                    />
                  </View>
                </ListItem>

                <ListItem style={styles.listitem}>
                  <View style={styles.leftListItem}>
                    <Text style={styles.TextStyle}>{i18n.t('lanLabelServiceStatus')}<Text style={{ color: 'red', paddingTop: 5 }}> *</Text> </Text>
                  </View>
                  <View style={[styles.centerListItem, styles.alignCenter]}>
                    <ToggleSwitch
                      isOn={this.state.serviceStatus == 'Available' ? true : false}
                      onColor='#5cb85c'
                      offColor='#e6e6e6'
                      labelStyle={{ color: 'black', fontWeight: '900' }}
                      size='small'
                      onToggle={(isOn) => this.handelServiceStatus(isOn)}
                    />
                  </View>
                </ListItem>

              </List>
            </View>
            <Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 17 }} >
              <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                <AwesomeButton block success
                  onPress={this.handleSubmit}
                  width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                  <Text style={styles.BtnText}>{i18n.t('lanCommonButtonUpdate')}</Text>
                </AwesomeButton>
              </LinearGradient>
            </View>
          </View>
        </ScrollView>
      </View >
    );
  }
}


