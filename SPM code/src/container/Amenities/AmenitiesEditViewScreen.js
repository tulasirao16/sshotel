import React from 'react';
import { observer, inject } from 'mobx-react';
import { Image, Button, StatusBar, Dimensions, Animated, TouchableOpacity, TouchableHighlight, ScrollView, Keyboard, UIManager, TextInput, KeyboardAvoidingView, ActivityIndicator, Platform } from 'react-native';
import { Content, Icon, View, Text, List, Switch, Left, Body, Right, ListItem, Card, CardItem, Picker } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';
import i18n from 'i18n-js';
// import SearchHeader from 'react-native-search-header';
import Toast, { DURATION } from 'react-native-easy-toast';

import styles from './css/AmenitiesCss';
import { PUBLIC_DOMAIN } from '../../../constants';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['UserStore'], ['PropertyStore'])
@observer
export default class AmenitiesEditViewScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
        return {
            header: null,
        }
    };

  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    let AmenitiesEditViewData = navigation.state.params.AmenitiesEditViewData;
    this.state = {
      shift: new Animated.Value(0),
      submitDisabled: false,
      status: AmenitiesEditViewData && AmenitiesEditViewData.amenityStatus ? AmenitiesEditViewData.amenityStatus : 'Unavailable',
      type: AmenitiesEditViewData && AmenitiesEditViewData.amenityType ? AmenitiesEditViewData.amenityType : 'Free',
      charge: AmenitiesEditViewData && AmenitiesEditViewData.amenityCharge ? AmenitiesEditViewData.amenityCharge : '0',
      propertyInfoId: AmenitiesEditViewData && AmenitiesEditViewData.propertyInfoId ? AmenitiesEditViewData.propertyInfoId : '',
      loading: false,
      reload: false,
      reloadFunction: '',
    }
  }
  handlestatusChange(value) {
    this.setState({ status: value })
  }
  handleTypeChange(value) {
    this.setState({ type: value })
  }
  handleSubmit = () => {
    let _this = this;
    const navigation = this.props.navigation;
    let AmenitiesEditViewData = navigation.state.params.AmenitiesEditViewData;
    const PropertyStore = this.props.PropertyStore;
    if (this.state.status == AmenitiesEditViewData.amenityStatus && this.state.type == AmenitiesEditViewData.amenityType
      && this.state.charge == AmenitiesEditViewData.amenityCharge) {
      this.refs.toast.show('Nothing has been changed to update')
    } else if (this.state.type == 'Paid' && this.state.charge < 1) {
      this.refs.toast.show('Paid amenity should be charged')
    } else {
      var num = parseInt(this.state.charge);
      this.setState({ loading : true, submitDisabled: true, charge: num });
      let isLoading = setTimeout(function () {
        _this.setState({ loading : false, reload: true, reloadFunction: 'handleSubmit' });
      }, 10000);
      let AmenityData = {
        _id: AmenitiesEditViewData._id,
        amenityStatus: this.state.status ? this.state.status : 'Unavailable',
        amenityType: this.state.type ? this.state.type : 'Free',
        amenityCharge: this.state.charge ? this.state.charge : '0',
      }
      PropertyStore.updateSPPropertyInfoAmenityData(AmenityData, function (resObj) {
        clearTimeout(isLoading)
        _this.setState({ loading: false, submitDisabled: false })
        if (resObj.statusCode == '0000') {        
          let _id = resObj.statusResult._id
          let position = PropertyStore.Amenities.map(function (e) { return e._id; }).indexOf(_id);
          let remove = PropertyStore.Amenities.splice(position, 1, resObj.statusResult);
          let x = PropertyStore.AvaliableAmenities;
          let AvaliableAmenities = x.indexOf(resObj.statusResult.amenityName);
          if (AvaliableAmenities === -1) {
            x.push(resObj.statusResult.amenityName);
          } else {
            x.splice(AvaliableAmenities, 1);
          }
          let put_json = {
            type: 'amenities',
            avaliableData:  PropertyStore.AvaliableAmenities
          };
          PropertyStore.updateAmenitiesInPropertyInfo(_this.state.propertyInfoId,  put_json, function(upObj) {
          });
          navigation.navigate('AmenitiesEditScreen')
        } else {
          _this.refs.toast.show(i18n.t('lanErrorUpdateFailed'));
        }
      });
    }
  }
  handleReload = () => {
    switch(this.state.reloadFunction) {
      case 'handleSubmit':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleSubmit()
        break;
      default:
        break;
    }
  }
  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    let AmenitiesEditViewData = navigation.state.params.AmenitiesEditViewData;
    return (
      <View style={styles.container}>
      {!this.state.reload
      ?<View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
            <View style={styles.headerMainView} >
              <View style={styles.headerLeft}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()} >
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
                </TouchableHighlight>
              </View>
              <View style={styles.headerBody}>
                <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleAmenityEditView')}</Text>
              </View>
            </View>
        </LinearGradient>
        {this.state.loading
          ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#ffffff' size='large' style={ styles.activeIndicatorStyle } /></View>
          : null}
          <View>
            <View style={styles.businessNameView} >
              <Card style={styles.cardBusiness}>
                <CardItem style={styles.cardItemBusinessStyle}>
                  <Left style={[styles.leftImageView, styles.listItemView]}>
                    <View style={styles.imageBusinessBox} >
                      <Image source={(AmenitiesEditViewData && AmenitiesEditViewData.propertyId.imagePath) ? { uri: PUBLIC_DOMAIN + AmenitiesEditViewData.propertyId.imagePath } : require('../../../assets/icon11.png')} style={styles.imgBusinessStyle} />
                    </View>
                    <Body>
                      <View style={styles.floatingInputBusinessView} >
                        <Text style={styles.propertyTitle}> {AmenitiesEditViewData.propertyId.name}</Text>
                        <Text style={styles.titleLocationType}>{AmenitiesEditViewData.propertyId.spLocationObj.area}</Text>
                        <Text style={styles.titleType}> {AmenitiesEditViewData && AmenitiesEditViewData.propertyId.propertyType ? AmenitiesEditViewData.propertyId.propertyType : '' } -  {i18n.t('lanLabelAmenities')}</Text>
                      </View>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
              {/* <Card style={ styles.card }>
            <CardItem style={ styles.cardItemStyle }>
                <Left style={[styles.leftImageView, styles.listItemView ]}>
                    <View style={styles.imageBox} >
                    <Image source={(AmenitiesEditViewData && AmenitiesEditViewData.amenityIconPath) ? { uri: PUBLIC_DOMAIN + AmenitiesEditViewData.amenityIconPath } : require('../../../assets/icon11.png')} style={styles.imgAmenityStyle} />
                    </View>
                    <Body>
                        <View style={ styles.floatingInputView } >
                            <Text style={styles.propertyTitle}> {AmenitiesEditViewData && AmenitiesEditViewData.amenityName ? AmenitiesEditViewData.amenityName : ''}</Text>
                        </View>
                    </Body>
                </Left>  
            </CardItem>
          </Card> */}
            </View>
            <ScrollView>
              <View style={styles.aminityView}>
                <View style={ styles.eachAminityCenterView } >
                  <View style={ styles.eachAminityView} >
                      <View style={styles.imageAmenityBox} >
                          <Image source={(AmenitiesEditViewData && AmenitiesEditViewData.amenityIconPath) ? { uri: PUBLIC_DOMAIN + AmenitiesEditViewData.amenityIconPath } : require('../../../assets/icon11.png')} style={styles.imgAmenityStyle} />
                      </View>
                      <Text style={styles.titleTypeWhite}> {AmenitiesEditViewData && AmenitiesEditViewData.amenityName ? AmenitiesEditViewData.amenityName : ''} </Text>
                  </View>
                </View>
                <View style={styles.contentAmenityView}>
                  <List>
                    <ListItem style={styles.listitem}>
                      <View style={styles.leftListItemAmenitiesEditView}>
                        <Text style={styles.textLight}> {i18n.t('lanLabelAmenityCode')}</Text>
                      </View>
                      <View style={styles.centerListItemAmenitiesEditView}>
                        <Text style={styles.textMedium}>{AmenitiesEditViewData.amenityId} </Text>
                      </View>
                    </ListItem>
                    <ListItem style={styles.listitem}>
                      <View style={styles.leftListItemAmenitiesEditView}>
                        <Text style={styles.textLight}> {i18n.t('lanLabelStatus')}</Text>
                      </View>
                      <View style={[styles.centerListItemAmenitiesEditView, styles.pickerViewCreateAmenity ]}>
                        <Picker
                          iosHeader='Select one'
                          iosIcon={<Icon name='arrow-down' />}
                          mode='dropdown'
                          style={{ width: DEVICE_WIDTH/2, top:-5 }}
                          selectedValue={this.state.status}
                          onValueChange={this.handlestatusChange.bind(this)}
                        >
                          <Picker.Item label='Available' value='Available' />
                          <Picker.Item label='Unavailable' value='Unavailable' />
                        </Picker>
                      </View>
                    </ListItem>
                    <ListItem style={styles.listitem}>
                      <View style={styles.leftListItemAmenitiesEditView}>
                        <Text style={styles.textLight}> {i18n.t('lanLabelAmenityType')} </Text>
                      </View>
                      <View style={[styles.centerListItemAmenitiesEditView, styles.pickerViewCreateAmenity ]}>
                        <Picker
                          iosHeader='Select one'
                          iosIcon={<Icon name='arrow-down' />}
                          mode='dropdown'
                          style={{ width: DEVICE_WIDTH/2, top:-5 }}
                          selectedValue={this.state.type}
                          onValueChange={this.handleTypeChange.bind(this)}
                        >
                          <Picker.Item label='Free' value='Free' />
                          <Picker.Item label='Paid' value='Paid' />
                        </Picker>
                      </View>
                    </ListItem>
                    <ListItem style={styles.listitem}>
                      <View style={styles.leftListItemAmenitiesEditView}>
                        <Text style={styles.textLight}>{i18n.t('lanLabelCharge')}</Text>
                      </View>
                      <View style={styles.centerListItemAmenitiesEditView}>
                        <TextInput style={styles.textInputStyle}
                          value={this.state.type == 'Free' ? '0' : this.state.charge}
                          editable={this.state.type == 'Free' ? false : true}
                          keyboardType='numeric'
                          returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                          onChangeText={(price) => this.setState({ charge: price })}
                        />
                      </View>
                    </ListItem>
                  </List>
                </View>
              </View>
              <Toast
                ref='toast'
                style={{ backgroundColor: '#ff0000', width: '100%', marginTop: 8, }}
                position='top'
                positionValue={70}
                fadeInDuration={50}
                fadeOutDuration={500}
                opacity={0.8}
                textStyle={{ color: 'white' }}
              />
              <View style={styles.btnModal} >
                <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                  <AwesomeButton block success
                    disabled={this.state.submitDisabled}
                    onPress={this.handleSubmit}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                    <Text style={styles.BtnText}> {i18n.t('lanButtonSubmit')} </Text>
                  </AwesomeButton>
                </LinearGradient>
              </View>
            </ScrollView>
          </View>
      </View >
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
              <Text style={styles.BtnText}>{i18n.t('lanButtonReload')}</Text>
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


