import React from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncStorage, BackHandler, Image, StyleSheet, Platform, StatusBar, Dimensions, Animated, TouchableOpacity, TouchableHighlight, ScrollView, Keyboard, UIManager, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button, Container, Header, Content, Form, Icon, View, Text, List, Switch, Left, Body, Right, ListItem, Item, Input, Label, Card, CardItem } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import i18n from 'i18n-js';

import styles from './css/AmenitiesCss';
import { PUBLIC_DOMAIN } from '../../../constants';

const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['UserStore'], ['PropertyStore'])
@observer
export default class AmenitiesViewScreen extends React.Component {
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
    }
  }
  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    let spPInfoAmenitiesViewData = navigation.state.params.spPInfoAmenitiesViewData;
    const propertyData = navigation.state.params.propertyData;
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft}>
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()} >
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle}  />
              </TouchableHighlight>
            </View>
            <View style={styles.headerBody}>
              <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleAmenityView')}</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.businessNameView} >
          <Card style={styles.cardBusiness}>
            <CardItem style={styles.cardItemBusinessStyle}>
              <Left style={[styles.leftImageView, styles.listItemView]}>
                <View style={styles.imageBusinessBox} >
                  <Image source={propertyData.propertyImage ? { uri: PUBLIC_DOMAIN + propertyData.propertyImage } : require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
                </View>
                <Body>
                  <View style={styles.floatingInputBusinessView} >
                    <Text style={styles.propertyTitle}> {propertyData && propertyData.propertyName ? propertyData.propertyName : ''}</Text>
                    <Text style={styles.titleLocationType}> {propertyData && propertyData.propertyArea ? propertyData.propertyArea : ''} </Text>
                    <Text style={styles.titleType}> {propertyData && propertyData.propertyType ? propertyData.propertyType : ''} - {i18n.t('lanTitleAmenities')}</Text>
                  </View>
                </Body>
              </Left>
            </CardItem>
          </Card>
        </View>
        <ScrollView>
        <View style={styles.aminityView}>
          <View style={styles.eachAminityCenterView} >
            <View style={styles.eachAminityView} >
              <View style={styles.imageAmenityBox} >
                <Image source={spPInfoAmenitiesViewData.amenityIconPath ? { uri: PUBLIC_DOMAIN + spPInfoAmenitiesViewData.amenityIconPath } : require('../../../assets/dummy_property.jpg')} style={styles.imgAmenityStyle} />
              </View>
              <Text style={styles.titleTypeWhite}> {spPInfoAmenitiesViewData && spPInfoAmenitiesViewData.amenityName ? spPInfoAmenitiesViewData.amenityName : ''}</Text>
            </View>
          </View>
          <View style={styles.contentAmenityView}>
            <List>
              <ListItem style={styles.listitem}>

                <View style={styles.centerListItem}>
                  <View style={styles.leftListItem}>
                    <Text style={styles.textLight}> {i18n.t('lanLabelAmenityCode')}</Text>
                  </View>
                  <View style={styles.leftListItem}>
                    <Text style={styles.textMedium}>{spPInfoAmenitiesViewData.amenityId} </Text>
                  </View>
                </View>
              </ListItem>
              <ListItem style={styles.listitem}>
                <View style={styles.centerListItem}>
                  <View style={styles.leftListItem}>
                    <Text style={styles.textLight}>{i18n.t('lanLabelStatus')}</Text>
                  </View>
                  <View style={styles.leftListItem}>
                    <Text style={styles.textMedium}>{spPInfoAmenitiesViewData.amenityStatus} </Text>
                  </View>
                </View>
              </ListItem>
              <ListItem style={styles.listitem}>
                <View style={styles.centerListItem}>
                  <View style={styles.leftListItem}>
                    <Text style={styles.textLight}> {i18n.t('lanLabelAmenityType')} </Text>
                  </View>
                  <View style={styles.leftListItem}>
                    <Text style={styles.textMedium}>{spPInfoAmenitiesViewData.amenityType}</Text>
                  </View>
                </View>
              </ListItem>
              <ListItem style={styles.listitem}>
                <View style={styles.centerListItem}>
                  <View style={styles.leftListItem}>
                    <Text style={styles.textLight}> {i18n.t('lanLabelCharge')} </Text>
                  </View>
                  <View style={styles.leftListItem}>
                    <Text style={styles.textMedium}> {'\u20B9'} {spPInfoAmenitiesViewData.amenityCharge}</Text>
                  </View>
                </View>
              </ListItem>
            </List>
          </View>
          <View style={styles.btnModal} >
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
              <AwesomeButton block success
                onPress={() => navigation.goBack()}
                width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                <Text style={styles.BtnText}> {i18n.t('lanButtonDone')} </Text>
              </AwesomeButton>
            </LinearGradient>
          </View>
        </View>
        </ScrollView>
      </View >
    );
  }
}


