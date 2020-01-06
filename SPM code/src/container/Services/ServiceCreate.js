import React from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncStorage, BackHandler, Image, TouchableHighlight, StyleSheet, Platform, StatusBar, Dimensions, Animated, TouchableOpacity, ScrollView, Keyboard, UIManager, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button, Container, Header, Content, Form, Icon, View, Text, List, Switch, Left, Body, Right, ListItem, Item, Input, Label, Card, CardItem } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import styles from './css/CreateServiceCss';
import { PUBLIC_DOMAIN } from '../../../constants';

import Services from '../../../assets/Services/services.json';
// const Services = require('../../../assets/Services/services.json')
const DEVICE_WIDTH = Dimensions.get(`window`).width;
import i18n from 'i18n-js';

@inject(['UserStore'], ['PropertyStore'])
@observer
export default class ServiceCreate extends React.Component {
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
      servicesAvaliable: (PropertyStore.ServicesAvailable && PropertyStore.ServicesAvailable.length > 0) ? PropertyStore.ServicesAvailable : [],
      status: false,
      services: (PropertyStore.Services && PropertyStore.Services.length > 0) ? PropertyStore.Services : (Services && Services.length > 0) ? Services : [],
      propertyID: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData._id : '', 
      propertyTitle: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyTitle : '',
      propertyType: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyType : '',
      propertyImage : navigation.state.params && navigation.state.params.propertyData && navigation.state.params.propertyData.imagePath ? navigation.state.params.propertyData.imagePath : '',
      propertyArea: navigation.state.params && navigation.state.params.propertyData && navigation.state.params.propertyData.propertyArea ? navigation.state.params.propertyData.propertyArea : '',
    }
  }
  _handelSwitch = (i, data) => {
    let x = this.state.servicesAvaliable;
    let servicesAvaliable = x.indexOf(data.serviceName);
    if (servicesAvaliable === -1) {
      x.push(data.serviceName);
      this.setState({ status: true })
      this.state.services[i].serviceStatus = 'Available'
    } else {
      x.splice(servicesAvaliable, 1);
      this.setState({ status: false })
      this.state.services[i].serviceStatus = 'Unavailable'
    }
  }

  handleServiceCreateView = (i) => {
    const navigation = this.props.navigation;
    const propertyData = navigation.state.params.propertyData;
    navigation.navigate('ServiceCreateView', { ServiceEditData: this.state.services[i], id: i, propertyData: propertyData });
  }
  componentWillReceiveProps(newProps) {
    let ServiceEditData = newProps.navigation.state.params.ServiceEditData;
    let id = newProps.navigation.state.params.id;
    if(id == 0) {
      this.state.services[id].serviceType = ServiceEditData.serviceType,
      this.state.services[id].serviceCharge = ServiceEditData.serviceCharge
    } else {
      this.state.services[id].serviceType = ServiceEditData.serviceType,
      this.state.services[id].serviceCharge = ServiceEditData.serviceCharge
    }

    let x = this.state.servicesAvaliable;
    let servicesAvaliable = x.indexOf(ServiceEditData.serviceName);
    if (ServiceEditData.serviceStatus == 'Available') {
      if (servicesAvaliable === -1) {
        x.push(ServiceEditData.serviceName);
        this.setState({ status: true });
        this.state.services[id].serviceStatus = 'Available';
      }
    } else {
      if (servicesAvaliable >= 0) {
        x.splice(servicesAvaliable, 1);
        this.setState({ status: false });
        this.state.services[id].serviceStatus = 'Unavailable';
      }
    }
  }
  Done = () => {
    let x = this.state.servicesAvaliable;
    navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    PropertyStore.Services = this.state.services;
    PropertyStore.ServicesAvailable = this.state.servicesAvaliable;
    PropertyStore.selectedService = true;
    // navigation.goBack()
    navigation.navigate('CreatePropertyInfo', {servicesValidate: true})
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
    const data = navigation.state.params.propertyData;
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
            <View style={styles.headerMainView} >
                 <View style={styles.headerLeft} >
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()} >
                        <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
                    </TouchableHighlight>
                 </View>
                 <View style={styles.headerBody} >
                    <Text style={styles.headerTitleStyle}>{i18n.t('lanLabelCreateServices')}</Text>
                 </View>
            </View>
        </LinearGradient>
        <View style={ styles.businessNameView } >
          <Card style={ styles.cardBusiness }>
            <CardItem style={ styles.cardItemBusinessStyle }>
                <Left style={[styles.leftImageView, styles.listItemView ]}>
                    <View style={styles.imageBusinessBox} >
                      <Image source={(data && data.imagePath) ? { uri: PUBLIC_DOMAIN + data.imagePath } : require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
                    </View>
                    <Body>
                        <View style={ styles.floatingInputBusinessView } >
                            <Text style={styles.propertyTitle}> {this.state.propertyTitle}</Text>
                            <Text style={styles.titleLocationType}> {this.state.propertyArea} </Text>
                            <Text style={styles.titleType}> {this.state.propertyType} {i18n.t('lanLabelService')}</Text>
                        </View>
                    </Body>
                </Left>  
            </CardItem>
          </Card>
        </View>
        <ScrollView>
          {
            this.state.services.length > 0
            ?
            this.state.services.map((dataObj, i) => {
                return (
                  <TouchableOpacity key={i} onPress={() => this.handleServiceCreateView(i)}>
                    <View style={styles.content}>
                      <View style={styles.list}>
                        <View style={styles.LeftView}>
                        <Image source={(dataObj && dataObj.serviceIconPath) ? { uri: PUBLIC_DOMAIN + dataObj.serviceIconPath } : require('../../../assets/icon11.png')} style={styles.images} />
                        </View>
                        <View style={styles.CenterView}>
                          <Text style={ styles.textMedium }>{dataObj.serviceName}</Text>
                          <View style={styles.aminityCharge}>
                            <Text style={[styles.serviceType, styles.textColor]}>{dataObj.serviceType}</Text>
                            <Text style={[styles.serviceType, styles.textColor]}>{'\u20B9'} {dataObj.serviceCharge}</Text>
                          </View>
                        </View>
                        <View style={styles.RightView}>
                          <Switch
                            value={this.state.servicesAvaliable.indexOf(dataObj.serviceName) >= 0 ? true : false}
                            onValueChange={() => this._handelSwitch(i, dataObj)} />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })
            : <View style={styles.noAmenities}><Text style={styles.noAmenitiesText }>{i18n.t('lanLabelNoServicesListed')}</Text></View>
          }
          {this.state.services.length > 0 ? 
          <View style={styles.btnModal} >
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
              <AwesomeButton block success
                onPress={this.Done}
                width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                <Text style={styles.BtnText}>{i18n.t('lanCommonButtonDone')}</Text>
              </AwesomeButton>
            </LinearGradient>
          </View>
          : null}
        </ScrollView>
      </View >
    );
  }
}


