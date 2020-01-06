import React from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncStorage, BackHandler, Image, TouchableHighlight, StyleSheet, Platform, Dimensions, Animated, TouchableOpacity, ScrollView, Keyboard, UIManager, TextInput, KeyboardAvoidingView, StatusBar } from 'react-native';
import { Button, Container, Header, Content, Form, Icon, View, Text, List, Switch, Left, Body, Right, ListItem, Item, Input, Label, Card, CardItem } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import SearchBar from 'react-native-searchbar';
import i18n from 'i18n-js';

import styles from './css/AmenitiesCss';
import { PUBLIC_DOMAIN } from '../../../constants';

import Amenities from '../../../assets/Amenities/amenities.json';
// const Amenities = require('../../../assets/Amenities/amenities.json')

const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['UserStore'], ['PropertyStore'])
@observer
export default class AmenitiesCreateScreen extends React.Component {
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
      amenitiesAvaliable: (PropertyStore.AmenitiesAvailable && PropertyStore.AmenitiesAvailable.length > 0) ? PropertyStore.AmenitiesAvailable : [],
      status: false,
      search: '',
      amenities: (PropertyStore.Amenities && PropertyStore.Amenities.length > 0) ? PropertyStore.Amenities : (Amenities && Amenities.length > 0) ? Amenities : []
    }
  }
  _handelSwitch = (i, data) => {
    let x = this.state.amenitiesAvaliable;
    let amenitiesAvaliable = x.indexOf(data.name);
    if (amenitiesAvaliable === -1) {
      x.push(data.name);
      this.setState({ status: true })
      this.state.amenities[i].status = 'Available'
    } else {
      x.splice(amenitiesAvaliable, 1);
      this.setState({ status: false })
      this.state.amenities[i].status = 'Unavailable'
    }
  }
  handleSearchChange = (Search) => {
    let searchAmenities = Amenities.filter(function (item) {
      return item.name.indexOf(Search) > -1 || item.type.indexOf(Search) > -1 ||
      item.status.indexOf(Search) > -1
    });
    this.setState({ amenities: searchAmenities });
  }
  viewAmenity = (i) => {
    navigation = this.props.navigation
    const propertyData = navigation.state.params.propertyData
    navigation.navigate('AmenitiesCreateViewScreen', { AmenitiesEditData: this.state.amenities[i], id: i, propertyData: propertyData });
  }
  componentWillReceiveProps(newProps) {
    if (newProps.navigation.state.params && newProps.navigation.state.params.AmenitiesEditData) {
      let amenityeditData = newProps.navigation.state.params.AmenitiesEditData;
      let id = newProps.navigation.state.params.id;
      let AmenitiesAvailable = this.state.amenitiesAvaliable;
      let x = AmenitiesAvailable.indexOf(amenityeditData.name);
      if (id == 0) {
        this.state.amenities[id].type = amenityeditData.type,
          this.state.amenities[id].price = amenityeditData.amenityPrice
          this.state.amenities[id].status = amenityeditData.status
          if( x === -1 &&  amenityeditData.status == 'Available') {
            AmenitiesAvailable.push(amenityeditData.name);
          } else if(x > -1 &&  amenityeditData.status == 'Unavailable'){
            AmenitiesAvailable.splice(x , 1);
          }
      } else {
        this.state.amenities[id].type = amenityeditData.type,
          this.state.amenities[id].price = amenityeditData.amenityPrice,
          this.state.amenities[id].status = amenityeditData.status;
          if( x === -1 &&  amenityeditData.status == 'Available') {
            AmenitiesAvailable.push(amenityeditData.name);
          } else if(x > -1 &&  amenityeditData.status == 'Unavailable'){
            AmenitiesAvailable.splice(x , 1);
          }
      }
    }
  }
  handleSubmit = () => {
    navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    PropertyStore.Amenities = this.state.amenities;
    PropertyStore.AmenitiesAvailable = this.state.amenitiesAvaliable;
    PropertyStore.selectedAminities = true;
    navigation.navigate('CreatePropertyInfo', {AmenitiesValidate: true})
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
    const { shift } = this.state;
    const navigation = this.props.navigation;
    const propertyData = navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData: {}
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft}>
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()} >
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
              </TouchableHighlight>
            </View>
            <View style={styles.headerBody}>
              <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleAmenityCreate')}</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()} >
                <Icon name='ios-search' style={styles.iconSearchStyle} />
              </TouchableHighlight>
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
            />
          </View>
        </LinearGradient>
        <View style={styles.businessNameView} >
          <Card style={styles.cardBusiness}>
            <CardItem style={styles.cardItemBusinessStyle}>
              <Left style={[styles.leftImageView, styles.listItemView]}>
                <View style={styles.imageBusinessBox} >
                  <Image source={propertyData.propertyIconPath ? { uri: PUBLIC_DOMAIN + propertyData.propertyIconPath } : require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
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
          {
            this.state.amenities && this.state.amenities.length > 0
              ?
              this.state.amenities.map((data, i) => {
                return (
                  <TouchableOpacity key={i} onPress={() => this.viewAmenity(i)}>
                    <View style={styles.content}>
                      <View style={styles.list}>
                        <View style={styles.LeftView}>
                          <Image source={(data && data.amenityIconPath) ? { uri: PUBLIC_DOMAIN + data.amenityIconPath } : require('../../../assets/icon11.png')} style={styles.images} />
                        </View>
                        <View style={styles.CenterView}>
                          <Text style={styles.textMedium}>{data.name}</Text>
                          <View style={styles.aminityCharge}>
                            <Text style={styles.textSmall}>{data.type}</Text>
                            {data.type == 'Free'
                              ? null
                              : <Text style={styles.textSmall}>{'\u20B9'} {data.price}</Text>
                            }
                          </View>
                        </View>
                        <View style={styles.RightView}>
                          <Switch
                            value={this.state.amenitiesAvaliable.indexOf(data.name) >= 0 ? true : false}
                            onValueChange={() => this._handelSwitch(i, data)} />
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
                onPress={this.handleSubmit}
                width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                <Text style={styles.BtnText}> {i18n.t('lanButtonDone')}</Text>
              </AwesomeButton>
            </LinearGradient>
          </View>
        </ScrollView>
      </View >
    );
  }
}


