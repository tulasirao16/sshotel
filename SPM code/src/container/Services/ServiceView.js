import React from 'react';
import { observer, inject } from 'mobx-react';
import { Dimensions, Animated, TouchableOpacity, TouchableHighlight, ScrollView, StatusBar, Keyboard, UIManager, Image, TextInput, KeyboardAvoidingView, Picker } from 'react-native';
import { Icon, View, Text, List, Left, Body, Right, ListItem, Item, Input, Label, Card, CardItem } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";

import styles from './css/CreateServiceCss';
import { PUBLIC_DOMAIN } from '../../../constants';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['UserStore'], ['PropertyStore'])
@observer
export default class ServiceView extends React.Component {
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
      shift: new Animated.Value(0),
      serviceType: ServiceEditData && ServiceEditData.serviceType ? ServiceEditData.serviceType : '',
      serviceCharge: ServiceEditData && ServiceEditData.serviceCharge ? ServiceEditData.serviceCharge : 0,
      serviceName: ServiceEditData && ServiceEditData.serviceName ? ServiceEditData.serviceName : '',
      id: id,
    }
  }
  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    let ServiceEditData = navigation.state.params.ServiceEditData;
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
            <Text style={styles.headerTitleStyle}>{i18n.t('lanLabelServiceView')}</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.businessNameView} >
          <Card style={styles.cardBusiness}>
            <CardItem style={styles.cardItemBusinessStyle}>
              <Left style={[styles.leftImageView, styles.listItemView]}>
                <View style={styles.imageBusinessBox} >
                  <Image source={(ServiceEditData.propertyId && ServiceEditData.propertyId.imagePath) ? { uri: PUBLIC_DOMAIN + ServiceEditData.propertyId.imagePath } : require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
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
          <View style={styles.aminityView}>
            <View style={styles.eachAminityCenterView} >
              <View style={styles.eachAminityView} >
                <View style={styles.imageAmenityBox} >
                  <Image source={(ServiceEditData && ServiceEditData.serviceIconPath) ? { uri: PUBLIC_DOMAIN + ServiceEditData.serviceIconPath } : require('../../../assets/icon11.png')} style={styles.imgAmenityStyle} />
                </View>
                <Text style={styles.titleTypeWhite}> {ServiceEditData && ServiceEditData.serviceName ? ServiceEditData.serviceName : ''} </Text>
              </View>
            </View>
            <View style={[styles.contentAmenityView, styles.contentAmenityLeftPadding]}>
              <List>
                <ListItem style={styles.listitem}>
                  <View style={styles.leftListItem}>
                    <Text style={styles.labelStyle}>{i18n.t('lanLabelServiceCode')}</Text>
                  </View>
                  <View style={styles.centerListItem}>
                    <Text style={styles.textMedium}>{ServiceEditData.serviceId} </Text>
                  </View>
                </ListItem>
                <ListItem style={styles.listitem}>
                  <View style={styles.leftListItem} >
                    <Text style={styles.labelStyle}>{i18n.t('lanLabelServiceType')}</Text>
                  </View>
                  <View style={styles.centerListItem} >
                    <Text style={styles.TextStyle}>{ServiceEditData.serviceType}</Text>
                  </View>
                </ListItem>
                <ListItem style={styles.listitem} >
                  <View style={styles.leftListItem} >
                    <Text style={styles.labelStyle}>{i18n.t('lanLabelServiceCharge')} ({'\u20B9'})</Text>
                  </View>
                  <View style={styles.centerListItem} >
                    <Text style={styles.TextStyle}>{ServiceEditData.serviceCharge}</Text>
                  </View>
                </ListItem>
                <ListItem style={styles.listitem} >
                  <View style={styles.leftListItem} >
                    <Text style={styles.labelStyle}>{i18n.t('lanLabelServiceStatus')}</Text>
                  </View>
                  <View style={styles.centerListItem} >
                    <Text style={styles.TextStyle}>{ServiceEditData.serviceStatus}</Text>
                  </View>
                </ListItem>
              </List>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 17 }} >
              <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                <AwesomeButton block success
                  onPress={() => navigation.goBack()}
                  width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                  <Text style={styles.BtnText}>{i18n.t('lanCommonButtonDone')}</Text>
                </AwesomeButton>
              </LinearGradient>
            </View>
          </View>
        </ScrollView>
      </View >
    );
  }
}


