import React from 'react';
import { View, TextInput, Animated, Keyboard, Dimensions, TouchableHighlight, TouchableOpacity, ScrollView, BackHandler, UIManager, Image, StatusBar, ActivityIndicator, Platform } from 'react-native';
import { Icon, Text, Picker, Card, CardItem, Left, Body, Right, Switch } from 'native-base';
import { observer, inject } from 'mobx-react';
import styles from './css/CreatePropertyInfoCss';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import RadioButton from 'radio-button-react-native';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import { PUBLIC_DOMAIN } from '../../../constants';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;

@inject(['PropertyStore'])
@observer
export default class PropertyInfoEdit extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    const data = navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData : {};
    this.state = {
      shift: new Animated.Value(0),
      value: '',
      selected: "key0",
      propertyID: data ? data.propertyId : {},
      propertyInfoId: data ? data._id : '',
      propertyTitle: data ? data.propertyTitle : '',
      propertyType: data ? data.propertyType : '',
      propertyImage: data ? data.propertyId.imagePath : '',
      propertyArea: data ? data.propertyId.spLocationObj.area : '',
      roomType: data ? data.roomType : '',
      rentType: data ? data.rentType : '',
      roomCategory: data ? data.roomCategory : '',
      roomName: data && data.roomsName ? data.roomsName : '',
      adultCapacity: data ? data.membersCapacity : '',
      childCapacity: data ? data.childsCapacity : '',
      roomsCount: data ? data.roomsCount : '',
      activeRooms: data ? data.activeRoomsCount : '',
      inactiveRooms: data ? data.inactiveRoomsCount : '',
      onHoldRooms: data ? data.onHoldRoomsCount : '',
      status: data ? data.status == 'Active' ? true : false : true,
      isDefault: data && data.isDefault ? 'true' : 'false',
      oldIsDefault: data && data.isDefault ? 'true' : 'false',
      singleBeds: data && data.singleBedsCount ? data.singleBedsCount : '',
      doubleBeds: data && data.doubleBedsCount ? data.doubleBedsCount : '',
      bathRooms: data && data.privateBathRooms ? data.privateBathRooms : '',
      halls: data && data.hallsCount ? data.hallsCount : '',
      numACs: data && data.acsCount ? data.acsCount : '',
      kitchens: data && data.kitchensCount ? data.kitchensCount : '',
      pricing: data && data.pricing ? data.pricing : {},
      isloading: false,

      adultDummyCapacity: data ? data.membersCapacity : '',
      roomsDummyCount: data ? data.roomsCount : '',
      activeDummyRooms: data ? data.activeRoomsCount : '',
      onHoldDummyRooms: data ? data.onHoldRoomsCount : '',
      singleDummyBeds: data && data.singleBedsCount ? data.singleBedsCount : '',
      doubleDummyBeds: data && data.doubleBedsCount ? data.doubleBedsCount : '',
      bathRoomsDummy: data && data.privateBathRooms ? data.privateBathRooms : '',
      hallsDummy: data && data.hallsCount ? data.hallsCount : '',
      numACsDummy: data && data.acsCount ? data.acsCount : '',
      kitchensDummy: data && data.kitchensCount ? data.kitchensCount : '',

    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    this.handleNext = this.handleNext.bind(this);
    this.handleServiceEditList = this.handleServiceEditList.bind(this);
    this.handleStatus = this.handleStatus.bind(this);
    this.handlePriceEdit = this.handlePriceEdit.bind(this);
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  handleTextChange = (newText) => this.setState({ value: newText });
  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight + 100);
      if (gap >= 0) {
        return;
      }
      Animated.timing(
        this.state.shift,
        {
          toValue: gap,
          duration: 10,
          useNativeDriver: true,
        }
      ).start();
    });
  }
  handleKeyboardDidHide = () => {
    Animated.timing(
      this.state.shift,
      {
        toValue: 0,
        duration: 10,
        useNativeDriver: true,
      }
    ).start();
  }
  onValueChange(value) {
    this.setState({
      selected: value
    });
  }
  componentWillReceiveProps(newProps) {
    if (newProps.navigation.state.params && newProps.navigation.state.params.pricing) {
      this.setState({ pricing: newProps.navigation.state.params.pricing });
    }
  }
  handleStatus() {
    this.setState({ status: !this.state.status });
  }
  handleNext() {
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    if (!this.state.rentType) {
      this.setState({ errorMessage: (i18n.t('lanErrorRentTypeIsRequired')) });
    } else if (!this.state.roomType) {
      this.setState({ errorMessage: (i18n.t('lanErrorRoomTypeIsRequired')) });
    } else if (!this.state.roomCategory) {
      this.setState({ errorMessage:  (i18n.t('lanErrorRoomCategoryIsRequired')) });
    } else if (!this.state.adultCapacity || parseInt(this.state.adultCapacity) == 0) {
      this.setState({ errorMessage: (i18n.t('lanErrorAdultCapacityIsRequired')) });
    } else if (!this.state.childCapacity || parseInt(this.state.childCapacity) == 0) {
      this.setState({ errorMessage: (i18n.t('lanErrorChildCapacityIsRequired')) });
    } else if (!this.state.roomsCount || parseInt(this.state.roomsCount) == 0) {
      this.setState({ errorMessage: (i18n.t('lanErrorTotalRoomsAreRequired')) });
    } else if (!this.state.activeRooms || parseInt(this.state.activeRooms) == 0) {
      this.setState({ errorMessage: (i18n.t('lanErrorActiveRoomsAreRequired')) });
    } else if (parseInt(this.state.roomsCount) < parseInt(this.state.activeRooms)) {
      this.setState({ errorMessage: (i18n.t('lanErrorTotalRoomsShouldBeGreaterThanActiveRooms')) });
    } else if (parseInt(this.state.roomsCount) < parseInt(this.state.onHoldRooms) + parseInt(this.state.activeRooms)) {
      this.setState({ errorMessage: (i18n.t('lanErrorActiveRoomsAndOnHoldRoomsShouldBeLessThanTotalRooms')) });
      // }   else if(!this.state.singleBeds || parseInt(this.state.singleBeds) == 0) {
      //     this.setState({errorMessage: 'Single Beds Count is Required'});
      // } else if(!this.state.doubleBeds || parseInt(this.state.doubleBeds) == 0) {
      //     this.setState({errorMessage: 'Double Beds Count is Required'});
    } else if (!this.state.singleBeds && !this.state.doubleBeds) {
      this.setState({ errorMessage: (i18n.t('lanErrorSingleBedorDoubleBedsCountAreRequired')) });
    } else {
      this.setState({ isloading: true });
      let post_json = {
        rentType: this.state.rentType,
        roomCategory: this.state.roomCategory,
        roomType: this.state.roomType,
        membersCapacity: this.state.adultCapacity,
        childsCapacity: this.state.childCapacity,
        roomsName: this.state.roomName,
        roomsCount: this.state.roomsCount,
        activeRoomsCount: this.state.activeRooms ? this.state.activeRooms : 0,
        onHoldRoomsCount: this.state.onHoldRooms ? this.state.onHoldRooms : 0,
        status: this.state.status ? 'Active' : 'Inactive',
        isDefault: this.state.isDefault == 'true' ? true : false,
        inactiveRoomsCount: this.state.roomsCount - this.state.activeRooms - (this.state.onHoldRooms ? this.state.onHoldRooms : 0),
        singleBedsCount: this.state.singleBeds,
        doubleBedsCount: this.state.doubleBeds,
        privateBathRooms: this.state.bathRooms,
        kitchensCount: this.state.kitchens,
        hallsCount: this.state.halls,
        acsCount: this.state.numACs,
        counts: {
          membersCapacity: (this.state.adultCapacity * this.state.activeRooms) - (this.state.adultDummyCapacity * this.state.activeDummyRooms),
          roomsCount: this.state.roomsCount - this.state.roomsDummyCount,
          activeNumRooms: this.state.activeRooms - this.state.activeDummyRooms,
          onHoldNumRooms: this.state.onHoldRooms - this.state.onHoldDummyRooms,
          inactiveNumRooms: this.state.roomsCount - this.state.activeRooms - (this.state.onHoldRooms ? this.state.onHoldRooms : 0) - this.state.inactiveRooms,
          singleBedsCount: this.state.singleBeds - this.state.singleDummyBeds,
          doubleBedsCount: this.state.doubleBeds - this.state.doubleDummyBeds,
          privateBathRooms: this.state.bathRooms - this.state.bathRoomsDummy,
          kitchensCount: this.state.kitchens - this.state.kitchensDummy,
          hallsCount: this.state.halls - this.state.hallsDummy,
          acsCount: this.state.numACs - this.state.numACsDummy
        }
      };
      let _this = this;
      PropertyStore.updatePropertyInfo(_this.state.propertyID._id, _this.state.propertyInfoId, post_json, function (resObj) {
        PropertyStore.InfoPricing = {};
        if (resObj.statusCode == '0000') {
          // let position = PropertyStore.PropertyInfoList.map(function (e) { return e._id; }).indexOf(_this.state.propertyInfoId);
          // PropertyStore.PropertyInfoList.splice(position, 1, resObj.statusResult);    
          // PropertyStore.PropertyInfoDubList.splice(position, 1, resObj.statusResult);        
          _this.setState({ isloading: false })
          navigation.navigate('PropertyInfoList', { list: 'list' });
        } else {
          _this.setState({ isloading: false, errorMessage: i18n.t('lanErrorPropertyInfoUpdateFailed') });
        }
      });
    }
  }
  handlePriceEdit() {
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    let propertyData = {
      propertyTitle: this.state.propertyTitle,
      propertyType: this.state.propertyType,
      propertyImage: this.state.propertyImage,
      propertyArea: this.state.propertyArea,
      propertyID: this.state.propertyID._id,
      propertyInfoID: this.state.propertyInfoId,
      checkBillingType: navigation.state.params.propertyData.checkBillingType,
      PropertyPricing: navigation.state.params.propertyData
    };
    navigation.navigate('PriceEdit', { PropertyPricing: propertyData , propertyID: this.props.navigation.state.params.propertyID});
  }
  handleAmenities = () => {
    navigation = this.props.navigation;
    const data = navigation.state.params.propertyData;
    let propertyData = {
      propertyInfoId: data._id,
      propertyId: data.propertyId._id,
      propertyTitle: data.propertyTitle,
      propertyType: data.propertyType,
      propertyIconPath: data.propertyId.imagePath,
      propertyName: data.propertyId.name,
      propertyArea: data.propertyId.spLocationObj.area
    }
    navigation.navigate('AmenitiesEditScreen', { propertyData: propertyData });
  }

  handleGuestRulesEdit = () => {
    navigation = this.props.navigation;
    const data = navigation.state.params.propertyData;
    let propertyData = {
      propertyInfoId: data._id,
      propertyId: data.propertyId._id,
      propertyTitle: data.propertyTitle,
      propertyType: data.propertyType,
      propertyIconPath: data.propertyId.imagePath,
      propertyName: data.propertyId.name,
      propertyArea: data.propertyId.spLocationObj.area,
      guestRulesNotes: data.guestRulesNotes,
    }
    navigation.navigate('EditGuestRules', { propertyData: propertyData });
  }

  handleServiceEditList() {
    const navigation = this.props.navigation;
    const data = navigation.state.params.propertyData;
    let propertyData = {
      propertyInfoId: data._id,
      propertyId: data.propertyId._id,
      propertyTitle: data.propertyTitle,
      propertyType: data.propertyType,
      propertyIconPath: data.propertyId.imagePath,
    }
    navigation.navigate('ServicesEditList', { propertyData: propertyData })
  }

  render() {
    const navigation = this.props.navigation;
    const { shift } = this.state;
    return (
      <View style={styles.container}>
        {/* <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}> */}
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
              <Text style={styles.headerTitleStyle}>{i18n.t('lanTitlePropertyInfoEdit')} </Text>
              </View>
            </View>
          </LinearGradient>
          {this.state.isloading
            ? <View style={styles.activeIndicatorView}><ActivityIndicator color="#ffffff" size='large' style={styles.activeIndicatorStyle} /></View>
            : null}
          <View style={styles.bodyContainer}>
            <View style={styles.businessNameView} >
              <Card style={styles.card}>
                <CardItem style={styles.cardItemStyle}>
                  <Left style={[styles.leftImageView, styles.listItemView]}>
                    <View style={styles.imageBox} >
                      <Image source={this.state.propertyImage ? { uri: PUBLIC_DOMAIN + this.state.propertyImage } : require('../../../assets/dummy_property.jpg')} style={styles.imgStyle} />
                    </View>
                    <Body>
                      <View style={styles.floatingInputView} >
                        <Text style={styles.propertyTitle}> {this.state.propertyTitle} </Text>
                        <Text style={styles.titleLocationType}> {this.state.propertyArea} </Text>
                        <Text style={styles.titleType}> {this.state.propertyType} - {i18n.t('lanTitlePropertyInfoEdit')}</Text>
                      </View>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
            </View>
            <ScrollView>
              <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
              <View style={styles.content}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', marginBottom:10  }} >
                <Text style={[styles.titleRadio, styles.leftSpace]} >{i18n.t('lanLabelSelectRentType')}<Text style={styles.required}>*</Text> </Text>
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" /> }
                    style={{ width: '100%', marginTop:-5, marginLeft:-5  }}
                    selectedValue={this.state.rentType}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ rentType: itemValue, errorMessage: '' })
                    }>
                    <Picker.Item label="Rent Type" value='' />
                    <Picker.Item label="Sharing Room" value="Sharing Room" />
                    <Picker.Item label="Private Room" value="Private Room" />
                    <Picker.Item label="Entire Space" value="Entire Space" />
                  </Picker>
                </View>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', marginBottom:5 }} >
                <Text style={[styles.titleRadio, styles.leftSpace]} >{i18n.t('lanLabelSelectRoomType')}<Text style={styles.required}>*</Text> </Text>
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" /> }
                    style={{ width: '100%', marginTop:-5, marginLeft:-5  }}
                    selectedValue={this.state.roomType}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ roomType: itemValue, errorMessage: '' })
                    }>
                    <Picker.Item label="Single Bed Room" value="Single Bed Room" />
                    <Picker.Item label="Double Bed Room" value="Double Bed Room" />
                    <Picker.Item label="1 BHK" value="1 BHK" />
                    <Picker.Item label="2 BHK" value="2 BHK" />
                    <Picker.Item label="3 BHK" value="3 BHK" />
                    <Picker.Item label="Full Appartment" value="Full Appartment" />
                    <Picker.Item label="Loft" value="Loft" />
                    <Picker.Item label="Cabin" value="Cabin" />
                    <Picker.Item label="Villa" value="Villa" />
                    <Picker.Item label="Castle" value="Castle" />
                    <Picker.Item label="Dorm" value="Dorm" />
                  </Picker>
                </View>
                  <View style={styles.DateGenderView}>
                    <View style={styles.floatingInputView} >
                      <Text style={styles.titleRadio} >{i18n.t('lanLabelRoomCategory')}</Text>
                    </View>
                  </View>
                  <View style={styles.DateGenderView}>
                    <View style={[styles.floatingInputView, styles.DatePicker]} >
                      <View style={{ flexDirection: 'row' }}>
                        <RadioButton currentValue={this.state.roomCategory} value='Economy' onPress={() => this.setState({ roomCategory: 'Economy', errorMessage: '' })} />
                        <View style={{ paddingHorizontal: 5, paddingVertical: 3 }} >
                          <Text style={styles.title}>Economy</Text>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.floatingInputView, styles.DatePicker]} >
                      <View style={{ flexDirection: 'row' }}>
                        <RadioButton currentValue={this.state.roomCategory} value='Deluxe' onPress={() => this.setState({ roomCategory: 'Deluxe', errorMessage: '' })} />
                        <View style={{ paddingHorizontal: 5, paddingVertical: 3 }} >
                          <Text style={styles.title}>Deluxe</Text>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.floatingInputView, styles.DatePicker]} >
                      <View style={{ flexDirection: 'row' }}>
                        <RadioButton currentValue={this.state.roomCategory} value='Luxury' onPress={() => this.setState({ roomCategory: 'Luxury', errorMessage: '' })} />
                        <View style={{ paddingHorizontal: 5, paddingVertical: 3 }} >
                          <Text style={styles.title}>Luxury</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.floatingInputView} >
                    <FloatingLabelInput
                      label={i18n.t('lanLabelRoomName')}
                      value={this.state.roomName}
                      onChangeText={(text) => this.setState({ roomName: text, errorMessage: '' })}
                      returnKeyType = { 'next' }
                      onRef={(ref) => {
                        this.inputs['Room Name'] = ref;
                      }}
                      onSubmitEditing={() => {
                          this.focusNextField('Adults Capacity');
                      }}  
                    />
                  </View>
                  <View style={styles.DateGenderView}>
                    <View style={[styles.floatingInputView, styles.DatePicker]} >
                      <FloatingLabelInput
                        label={i18n.t('lanLabelAdultsCapacity')}
                        value={this.state.adultCapacity.toString()}
                        keyboardType='numeric'
                        onChangeText={(text) => this.setState({ adultCapacity: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                          this.inputs['Adults Capacity'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('Child Capacity');
                        }}  
                      />
                    </View>
                    <View style={[styles.floatingInputView, styles.genderView]}>
                      <FloatingLabelInput
                        label={i18n.t('lanLabelChildCapacity')}
                        value={this.state.childCapacity.toString()}
                        keyboardType='numeric'
                        onChangeText={(text) => this.setState({ childCapacity: text.replace(/\s/g, ''), errorMessage: '' })}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                          this.inputs['Child Capacity'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('Rooms Count');
                        }}  
                      />
                    </View>
                  </View>

                  <View style={styles.DateGenderView}>
                    <View style={[styles.floatingInputView, styles.DatePicker]} >
                      <FloatingLabelInput
                        label={i18n.t('lanLabelRoomsCount')}
                        value={this.state.roomsCount.toString()}
                        onChangeText={(text) => this.setState({ roomsCount: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                        keyboardType='numeric'
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                          this.inputs['Rooms Count'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('Active Rooms');
                        }}  
                      />
                    </View>
                    <View style={[styles.floatingInputView, styles.genderView]}>
                      <FloatingLabelInput
                        label={i18n.t('lanLabelActiveRooms')}
                        value={this.state.activeRooms.toString()}
                        keyboardType='numeric'
                        onChangeText={(text) => this.setState({ activeRooms: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                          this.inputs['Active Rooms'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('OnHold Rooms');
                        }}  
                      />
                    </View>
                  </View>
                  <View style={styles.DateGenderView}>
                    <View style={[styles.floatingInputView, styles.DatePicker]} >
                      <FloatingLabelInput
                        label={i18n.t('lanLabelOnHoldRooms')}
                        value={this.state.onHoldRooms.toString()}
                        onChangeText={(text) => this.setState({ onHoldRooms: text ? parseInt(text) : '', errorMessage: '' })}
                        keyboardType='numeric'
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                          this.inputs['OnHold Rooms'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('Single Beds');
                        }}  
                      />
                    </View>
                  </View>
                  <View style={{paddingVertical:5, }}>
                    <View style={styles.listItem}>
                      <Left>
                        <Text style={[styles.title]}>{i18n.t('lanLabelStatus')}</Text>
                      </Left>
                      <Right>
                        <Switch value={this.state.status} onValueChange={() => this.handleStatus()}></Switch>
                      </Right>
                    </View>
                  </View>
                  {/* <View style={styles.DateGenderView}>
                    <View style={styles.floatingInputView} >
                    <Text style={styles.titleRadio} >{i18n.t('lanLabelDefaultPriority')}</Text>
                    </View>
                  </View>
                  <View style={styles.DateGenderView}>
                    <View style={[styles.floatingInputView, styles.DatePicker]} >
                      <View style={{ flexDirection: 'row' }}>
                        <RadioButton currentValue={this.state.isDefault} value='true' onPress={() => this.setState({ isDefault: 'true', errorMessage: '' })} />
                        <View style={{ paddingHorizontal: 10 }} >
                          <Text style={styles.title}>true</Text>
                        </View>
                      </View>
                    </View>
                    {this.state.oldIsDefault == 'false' ?
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <View style={{ flexDirection: 'row' }}>
                          <RadioButton currentValue={this.state.isDefault} value='false' onPress={() => this.setState({ isDefault: 'false', errorMessage: '' })} />
                          <View style={{ paddingHorizontal: 8 }} >
                            <Text style={styles.title}>false</Text>
                          </View>
                        </View>
                      </View> : null}
                  </View> */}

                  <View style={styles.DateGenderView}>
                    <View style={[styles.floatingInputView, styles.DatePicker]} >
                      <FloatingLabelInput
                        label={i18n.t('lanLabelSingleBeds')}
                        keyboardType='numeric'
                        value={this.state.singleBeds.toString()}
                        onChangeText={(text) => this.setState({ singleBeds: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                          this.inputs['Single Beds'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('Double Beds');
                        }}  
                      />
                    </View>
                    <View style={[styles.floatingInputView, styles.genderView]}>
                      <FloatingLabelInput
                        label={i18n.t('lanLabelDoubleBeds')}
                        keyboardType='numeric'
                        value={this.state.doubleBeds.toString()}
                        onChangeText={(text) => this.setState({ doubleBeds: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                          this.inputs['Double Beds'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('Kitchens');
                        }} 
                      />
                    </View>
                  </View>

                  <View style={styles.DateGenderView}>
                    <View style={[styles.floatingInputView, styles.DatePicker]} >
                      <FloatingLabelInput
                        label={i18n.t('lanLabelKitchens')}
                        keyboardType='numeric'
                        value={this.state.kitchens == '0' ? '' : this.state.kitchens.toString()}
                        onChangeText={(text) => this.setState({ kitchens: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                          this.inputs['Kitchens'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('Halls');
                        }}
                      />
                    </View>
                    <View style={[styles.floatingInputView, styles.genderView]}>
                      <FloatingLabelInput
                        label={i18n.t('lanLabelHalls')}
                        keyboardType='numeric'
                        value={this.state.halls == '0' ? '' : this.state.halls.toString()}
                        onChangeText={(text) => this.setState({ halls: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                          this.inputs['Halls'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('Bath Rooms');
                        }}
                      />
                    </View>
                  </View>

                  <View style={styles.DateGenderView}>
                    <View style={[styles.floatingInputView, styles.DatePicker]} >
                      <FloatingLabelInput
                        label={i18n.t('lanLabelBathRooms')}
                        keyboardType='numeric'
                        value={this.state.bathRooms == '0' ? '' : this.state.bathRooms.toString()}
                        onChangeText={(text) => this.setState({ bathRooms: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                          this.inputs['Bath Rooms'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('ACs');
                        }}
                      />
                    </View>
                    <View style={[styles.floatingInputView, styles.genderView]}>
                      <FloatingLabelInput
                        label={i18n.t('lanLabelNoOfAcs')}
                        keyboardType='numeric'
                        value={this.state.numACs == '0' ? '' : this.state.numACs.toString()}
                        onChangeText={(text) => this.setState({ numACs: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                          this.inputs['ACs'] = ref;
                        }}
                        onSubmitEditing={() => {}}
                      />
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => this.handlePriceEdit()} >
                    <View style={styles.listItem}>
                      <Left>
                        <View>
                          <Text style={[styles.title, styles.titleRouting]}> {i18n.t('lanButtonPricing')}</Text>
                        </View>
                      </Left>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.handleAmenities} >
                    <View style={styles.listItem}>
                      <Left>
                        <View>
                          <Text style={[styles.title, styles.titleRouting]}>{i18n.t('lanButtonAmenities')} </Text>
                        </View>
                      </Left>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.handleServiceEditList} >
                    <View style={styles.listItem}>
                      <Left>
                        <View>
                          <Text style={[styles.title, styles.titleRouting]}>{i18n.t('lanButtonServices')} </Text>
                        </View>
                      </Left>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.handleGuestRulesEdit} >
                    <View style={styles.listItem}>
                      <Left>
                        <View>
                        <Text style={[styles.title, styles.titleRouting]}>{i18n.t('lanButtonGuestRules')} </Text>
                        </View>
                      </Left>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.errorView} >
                    <Text style={styles.errorTxt}>{this.state.errorMessage}</Text>
                  </View>
                  <View style={styles.btnModal} >
                    <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                      <AwesomeButton block success
                        onPress={() => this.handleNext()}
                        width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} marginTop={20} >
                        <Text style={styles.BtnText}> {i18n.t('lanCommonButtonUpdate')} </Text>
                      </AwesomeButton>
                    </LinearGradient>
                  </View>
                </View>
              </Animated.View>
            </ScrollView>
          </View>
        <KeyboardSpacer topSpacing={50} />
      </View>
    );
  }
}
