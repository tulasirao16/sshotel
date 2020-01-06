import React from 'react';
import { observer, inject } from 'mobx-react';
import { Dimensions, BackHandler, Animated, TouchableOpacity, TouchableHighlight, ScrollView, StatusBar, Image, TextInput, Platform } from 'react-native';
import { Icon, View, Text, List, Left, Body, ListItem, Card, CardItem, Picker } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import ToggleSwitch from 'toggle-switch-react-native';
import i18n from 'i18n-js';
import Toast, { DURATION } from 'react-native-easy-toast';

import styles from './css/CreateServiceCss';
import { PUBLIC_DOMAIN } from '../../../constants';

const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['UserStore'], ['PropertyStore'])
@observer
export default class ServiceCreateView extends React.Component {
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
      serviceStatus: ServiceEditData && ServiceEditData.serviceStatus ? ServiceEditData.serviceStatus : 'Unavailable',
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
    // const navigation = this.props.navigation;
    // const PropertyStore = this.props.PropertyStore;
    // let ServiceEditData = navigation.state.params.ServiceEditData;
    // let serviceData = {
    //   _id: ServiceEditData._id,
    //   serviceType: this.state.serviceType,
    //   serviceCharge: this.state.serviceCharge,
    //   serviceStatus: this.state.serviceStatus
    // }
    // let _this = this;
    // PropertyStore.updateSPPropertyInfoServicesData(serviceData, function (resObj) {
    //   if (resObj.statusCode == "0000") {
    //     navigation.state.params.onNavigateBack()
    //     navigation.goBack();
    //   } else {
    //     _this.setState({ errorMessage: 'Update failed' })
    //   }
    // });
    if (this.state.serviceType == 'Paid' && this.state.serviceCharge <= 0) {
      // alert(i18n.t('lanErrorPaidServicePriceIsRequired'))
      this.refs.toast.show(i18n.t('lanErrorPaidServicePriceIsRequired'));
    } else {
      const navigation = this.props.navigation;
      navigation.navigate('ServiceCreate', { ServiceEditData: { serviceName: this.state.serviceName, serviceType: this.state.serviceType, serviceCharge: this.state.serviceCharge, serviceStatus: this.state.serviceStatus }, id: this.state.id })
    }
  }

  handelServiceStatus(isOn) {
    if (this.state.serviceStatus == 'Available') {
      this.setState({ serviceStatus: 'Unavailable' })
    } else {
      this.setState({ serviceStatus: 'Available' })
    }
  }

  handlePrice = (price) => {
    if (price == '') {
      this.setState({ serviceCharge: '' });
    } else {
      var num = parseInt(price);
      var numString = num.toString();
      this.setState({ serviceCharge: numString });
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
    let propertyData = navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData : {};
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
                <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleServiceCreate')}</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.businessNameView} >
          <Card style={styles.cardBusiness}>
            <CardItem style={styles.cardItemBusinessStyle}>
              <Left style={[styles.leftImageView, styles.listItemView]}>
                <View style={styles.imageBusinessBox} >
                  <Image source={(propertyData && propertyData.imagePath) ? { uri: PUBLIC_DOMAIN + propertyData.imagePath } : require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
                </View>
                <Body>
                  <View style={styles.floatingInputBusinessView} >
                    <Text style={styles.propertyTitle}> {propertyData.propertyTitle} </Text>
                    <Text style={styles.titleLocationType}> {propertyData && propertyData.propertyArea ? propertyData.propertyArea: ''} </Text>
                    <Text style={styles.titleType}> {propertyData && propertyData.propertyType ? propertyData.propertyType : ''} - {ServiceEditData.serviceName} </Text>
                  </View>
                </Body>
              </Left>
            </CardItem>
          </Card>
          {/* <Card style={styles.card}>
            <CardItem style={styles.cardItemStyle}>
              <Left style={[styles.leftImageView, styles.listItemView]}>
                <View style={styles.imageBox} >
                  <Image source={(ServiceEditData && ServiceEditData.serviceIconPath) ? { uri: PUBLIC_DOMAIN + ServiceEditData.serviceIconPath } : require('../../../assets/icon11.png')} style={styles.imgStyle} />
                </View>
                <Body>
                  <View style={styles.floatingInputView} >
                    <Text style={styles.propertyTitle}> {ServiceEditData && ServiceEditData.serviceName ? ServiceEditData.serviceName : ''}</Text>
                  </View>
                </Body>
              </Left>
            </CardItem>
          </Card> */}
        </View>
        <ScrollView>
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
                  <Text style={styles.textLight}> {i18n.t('lanLabelServiceCode')}</Text>
                </View>
                <View style={styles.centerListItem}>
                  <Text style={styles.textMedium}>{ServiceEditData.serviceId} </Text>
                </View>
              </ListItem>

              <ListItem style={styles.listitem}>
                <View style={styles.leftListItem}>
                  <Text style={styles.TextStyle}> {i18n.t('lanLabelSelectServiceType')} <Text style={{ color: 'red', paddingTop: 5 }}> *</Text> </Text>
                </View>
                <View style={styles.centerListItem}>
                  <View style={styles.pickerView} >
                    <Picker
                      iosHeader='Select one'
                      iosIcon={<Icon name='arrow-down' />}
                      mode='dropdown'
                      selectedValue={this.state.serviceType}
                      style={{ width: DEVICE_WIDTH / 2.7, top: -7 }}
                      onValueChange={(itemValue, itemIndex) => this.handleServiceType(itemValue)}>
                      <Picker.Item label="Free" value="Free" />
                      <Picker.Item label="Paid" value="Paid" />
                    </Picker>
                  </View>
                </View>
              </ListItem>

              <ListItem style={styles.listitem}>
                <View style={styles.leftListItem}>
                  <Text style={styles.TextStyle}> {i18n.t('lanLabelEnterServiceCharge')} ({'\u20B9'}) <Text style={{ color: 'red', paddingTop: 5 }}> *</Text> </Text>
                </View>
                <View style={styles.centerListItem}>
                  <TextInput style={styles.textInputStyle}
                    value={this.state.serviceCharge}
                    editable={this.state.serviceType == 'Free' ? false : true}
                    keyboardType='numeric'
                    returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                    // onChangeText={(price) => this.setState({ serviceCharge: price })}
                    onChangeText={(price) => this.handlePrice(price)}
                  />
                </View>
              </ListItem>

              <ListItem style={styles.listitem}>
                <View style={styles.leftListItem}>
                  <Text style={styles.TextStyle}>   {i18n.t('lanLabelServiceStatus')}<Text style={{ color: 'red', paddingTop: 5 }}> *</Text> </Text>
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


              {/* <Text style={[styles.TextStyle, styles.topGap]}>Select service Type <Text style={{ color: 'red', paddingTop: 5 }}> *</Text></Text>
              <ListItem style={styles.listitem}>
                <View style={styles.pickerView} >
                  <Picker
                    selectedValue={this.state.serviceType}
                    style={{ width: DEVICE_WIDTH / 2.2, top: -7 }}
                    onValueChange={(itemValue, itemIndex) => this.handleServiceType(itemValue)}>
                    <Picker.Item label="Free" value="Free" />
                    <Picker.Item label="Paid" value="Paid" />
                  </Picker>
                </View>
              </ListItem> */}
              {/* <View style={styles.topGap}>
                <Text style={styles.TextStyle}> Enter service charge ({'\u20B9'}) <Text style={{ color: 'red', paddingTop: 5 }}> *</Text></Text>
                <TextInput style={styles.textInputStyle}
                  value={this.state.serviceCharge}
                  editable={this.state.serviceType == 'Free' ? false : true}
                  keyboardType='numeric'
                  onChangeText={(price) => this.setState({ serviceCharge: price })}
                />
              </View> */}
              {/* <Text style={styles.TextStyle}> Service Status <Text style={{ color: 'red', paddingTop: 5 }}> *</Text></Text>
              <ToggleSwitch
                isOn={this.state.serviceStatus == 'Available' ? true : false}
                onColor='#5cb85c'
                offColor='gray'
                labelStyle={{ color: 'black', fontWeight: '900' }}
                size='small'
                onToggle={(isOn) => this.handelServiceStatus(isOn)}
              /> */}
            </List>
          </View>
          <Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 17 }} >
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
              <AwesomeButton block success
                onPress={this.handleSubmit}
                width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                <Text style={styles.BtnText}> {i18n.t('lanButtonSubmit')} </Text>
              </AwesomeButton>
            </LinearGradient>
          </View>
        </ScrollView>
        <Toast
              ref='toast'
              style={{backgroundColor:'red', width: '100%', borderRadius:0,padding: 10, }}
              position='bottom'
              positionValue={120}
              fadeInDuration={750}
              fadeOutDuration={1000}
              // opacity={0.8}
              borderRadius={0}
              textStyle={{color:'white', fontFamily: 'Roboto_medium', }}
            />
      </View >
    );
  }
}


