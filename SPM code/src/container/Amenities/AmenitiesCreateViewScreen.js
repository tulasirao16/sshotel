import React from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncStorage, BackHandler, Image, StyleSheet, TouchableHighlight, StatusBar, Platform, Dimensions, Animated, TouchableOpacity, ScrollView, Keyboard, UIManager, TextInput, KeyboardAvoidingView,  } from 'react-native';
import { Button, Container, Header, Content, Form, Icon, View, Text, List, Switch, Left, Body, Right, ListItem, Item, Input, Label, Card, CardItem, Picker } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import styles from './css/aminitiesEditCss';
import { PUBLIC_DOMAIN } from '../../../constants';
import i18n from 'i18n-js';
import Toast, { DURATION } from 'react-native-easy-toast';

const Amenities = require('../../../assets/Amenities/amenities.json')
const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['UserStore'], ['PropertyStore'])
@observer
export default class AmenitiesCreateViewScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };

  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    let AmenitiesEditData = navigation.state.params.AmenitiesEditData;
    let id = navigation.state.params.id;
    this.state = {
      shift: new Animated.Value(0),
      type: AmenitiesEditData && AmenitiesEditData.type ? AmenitiesEditData.type : '',
      amenityPrice: AmenitiesEditData && AmenitiesEditData.price ? AmenitiesEditData.price : '0',
      name: AmenitiesEditData && AmenitiesEditData.name ? AmenitiesEditData.name : '',
      id: id,
      status: AmenitiesEditData && AmenitiesEditData.status ? AmenitiesEditData.status : 'Unavailable',
    }
    this.handleamenityPrice = this.handleamenityPrice.bind(this)
  }
  setAmenityData = () => {
    if (this.state.type == 'Paid' && (parseInt(this.state.amenityPrice) <= 0 || this.state.amenityPrice.trim() == '' || this.state.amenityPrice.trim() == 'undefined')) {
      // alert(i18n.t('lanErrorPaidAmenityPriceIsRequired'))
      this.refs.toast.show(i18n.t('lanErrorPaidAmenityPriceIsRequired'));
    } else {
      const navigation = this.props.navigation;
      const PropertyStore = this.props.PropertyStore;
      let AmenitiesAvailable = PropertyStore.AmenitiesAvailable;
      let x = AmenitiesAvailable.indexOf(this.state.name);
      if( x === -1 &&  this.state.status == 'Available') {
        AmenitiesAvailable.push(this.state.name);
      } else if(x > -1 &&  this.state.status == 'Unavailable'){
        AmenitiesAvailable.splice(x , 1);
      }
      navigation.navigate('AmenitiesCreateScreen', { AmenitiesEditData: { name: this.state.name, type: this.state.type, amenityPrice: this.state.amenityPrice, status: this.state.status }, id: this.state.id })
    }
  }
  // handleamenityPrice(price) {
  //   if(this.state.type == 'Free') {
  //     this.setState({ amenityPrice: '0' })
  //   } else {
  //     this.setState({ amenityPrice: price })
  //   }
  // }
  handleamenityPrice = (price) => {
    if (price == '') {
      this.setState({ amenityPrice: '' });
    } else {
      var num = parseInt(price);
      var numString = num.toString();
      this.setState({ amenityPrice: numString });
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
    const { shift } = this.state;
    const navigation = this.props.navigation;
    let AmenitiesEditData = navigation.state.params.AmenitiesEditData;
    const propertyData = navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData : {};
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
                <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleAmenitiesCreateEdit')}</Text>
            </View>
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
                    <Text style={styles.titleType}> {propertyData && propertyData.propertyType ? propertyData.propertyType : ''} -{i18n.t('lanTitleAmenities')}</Text>
                  </View>
                </Body>
              </Left>
            </CardItem>
          </Card>
          {/* <Card style={styles.card}>
            <CardItem style={styles.cardItemStyle}>
              <Left style={[styles.leftImageView, styles.listItemView]}>
                <View style={styles.imageBox} >
                  <Image source={(AmenitiesEditData && AmenitiesEditData.amenityIconPath) ? { uri: PUBLIC_DOMAIN + AmenitiesEditData.amenityIconPath } : require('../../../assets/icon11.png')} style={styles.imgStyle} />
                </View>
                <Body>
                  <View style={styles.floatingInputView} >
                    <Text style={styles.propertyTitle}> {AmenitiesEditData && AmenitiesEditData.name ? AmenitiesEditData.name : ''}</Text>
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
                    <Image source={(AmenitiesEditData && AmenitiesEditData.amenityIconPath) ? { uri: PUBLIC_DOMAIN + AmenitiesEditData.amenityIconPath } : require('../../../assets/icon11.png')} style={styles.imgAmenityStyle} />
                </View>
                <Text style={styles.titleTypeWhite}> {AmenitiesEditData && AmenitiesEditData.name ? AmenitiesEditData.name : ''} </Text>
            </View>
          </View>
          <View style={styles.contentAmenityView}>
            <List>
              <ListItem style={[styles.listitem, styles.listItemBottomWidth]}>
                <View style={styles.leftListItem}>
                  <Text style={styles.textLight}> {i18n.t('lanLabelAmenityCode')}  <Text style={{ color: 'red'}}>*</Text>  </Text>
                </View>
                <View style={styles.centerListItem}>
                  <Text style={styles.textMedium}>{AmenitiesEditData.amenityId} </Text>
                </View>
              </ListItem>
              <ListItem style={[styles.listitem, styles.listItemBottomWidth]}>
                    <View style={styles.leftListItem}>
                      <Text style={styles.textLight}> {i18n.t('lanLabelStatus')} <Text style={{ color: 'red'}}>*</Text> </Text>
                    </View>
                    <View style={[styles.centerListItem, styles.pickerViewCreateAmenity ]}>
                      <Picker
                        iosHeader='Select one'
                        iosIcon={<Icon name='arrow-down' />}
                        mode='dropdown'
                        // enabled= {false}
                        style={{ width: DEVICE_WIDTH/2.3, top:-5 }}
                        selectedValue={this.state.status}
                        onValueChange={(itemValue, itemIndex) =>
                          this.setState({ status: itemValue })}
                      >
                        <Picker.Item label="Available" value="Available" />
                        <Picker.Item label="Unavailable" value="Unavailable" />
                      </Picker>
                    </View>
                  </ListItem>
                  <ListItem style={[styles.listitem, styles.listItemBottomWidth]}>
                    <View style={styles.leftListItem}>
                      <Text style={styles.textLight}> {i18n.t('lanLabelAmenityType')} <Text style={{ color: 'red'}}>*</Text> </Text>
                    </View>
                    <View style={[ styles.centerListItem, styles.pickerViewCreateAmenity ]}>
                      <Picker
                        iosHeader='Select one'
                        iosIcon={<Icon name='arrow-down' />}
                        mode='dropdown'
                        style={{ width: DEVICE_WIDTH/2.3, top:-5 }}
                        selectedValue={this.state.type}
                        onValueChange={(itemValue, itemIndex) =>
                          this.setState({ type: itemValue, amenityPrice: '0' })}
                      >
                        <Picker.Item label="Free" value="Free" />
                        <Picker.Item label="Paid" value="Paid" />
                      </Picker>
                    </View>
                  </ListItem>
                    <ListItem style={[styles.listitem, styles.listItemBottomWidth]}>
                    <View style={styles.leftListItem}>
                      <Text style={styles.textLight}>{i18n.t('lanLabelCharge')}( {'\u20B9'} ) <Text style={{ color: 'red'}}>*</Text> </Text>
                    </View>
                    <View style={styles.centerListItem}>
                      <TextInput
                        style={{borderBottomColor:'#01a4a2', borderBottomWidth:0.5 }}
                        value={this.state.type == 'Free' ? '0' : this.state.amenityPrice}
                        editable={this.state.type == 'Free' ? false : true}
                        keyboardType='numeric'
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onChangeText={(price) => this.handleamenityPrice(price)}
                      />
                    </View>
                  </ListItem>
            </List>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 17 }} >
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
              <AwesomeButton block success
                onPress={this.setAmenityData}
                width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                <Text style={styles.BtnText}>  {i18n.t('lanButtonDone')} </Text>
              </AwesomeButton>
            </LinearGradient>
          </View>
        </ScrollView>
        <Toast
            ref='toast'
            style={{ backgroundColor: '#ff0000', width: '100%', borderRadius:0, marginTop: 10, }}
            position='top'
            positionValue={70}
            fadeInDuration={50}
            fadeOutDuration={500}
            // opacity={0.8}
            textStyle={{ color: 'white', fontFamily:'Roboto_medium', }}
          />
      </View >
    );
  }
}


