import React from 'react';
import { View, TextInput, Animated, Keyboard, Dimensions, TouchableOpacity, TouchableHighlight, ActivityIndicator, ScrollView, Image, BackHandler, UIManager, StatusBar, Platform } from 'react-native';
import { Icon, Text, Picker, Card, CardItem, Body, Left, Right, Switch } from 'native-base';
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
export default class CreatePropertyInfo extends React.Component {
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
        let infoData = PropertyStore.createPropertyInfo ? PropertyStore.createPropertyInfo : {};
        let data = navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData : {};
        this.state = {
            shift: new Animated.Value(0),
            value: '',
            selected: "key0",
            propertyID: data && data._id ? data._id : '',
            propertyTitle: data && data.propertyTitle ? data.propertyTitle : '',
            propertyType: data && data.propertyType ? data.propertyType : '',
            propertyImage: data && data.imagePath ? data.imagePath : '',
            propertyArea: data && data.spLocationObj && data.spLocationObj.area ? data.spLocationObj.area : data.propertyArea ? data.propertyArea : '',
            nearestAreas: data && data.nearestAreas ? data.nearestAreas : [],
            roomType: infoData && infoData.roomType ? infoData.roomType : 'Single Bed Room',
            rentType: infoData && infoData.rentType ? infoData.rentType : 'Private Room',
            roomCategory: infoData && infoData.roomCategory ? infoData.roomCategory : 'Economy',
            roomName: infoData && infoData.roomsName ? infoData.roomsName : '',
            adultCapacity: infoData && infoData.membersCapacity ? infoData.membersCapacity : '3',
            childCapacity: infoData && infoData.childsCapacity ? infoData.childsCapacity : '1',
            roomsCount: infoData && infoData.roomsCount ? infoData.roomsCount : '',
            activeRooms: infoData && infoData.activeRoomsCount ? infoData.activeRoomsCount : '',
            onHoldRooms: infoData && infoData.onHoldRoomsCount ? infoData.onHoldRoomsCount : '',
            singleBeds: infoData && infoData.singleBedsCount ? infoData.singleBedsCount : '',
            doubleBeds: infoData && infoData.doubleBedsCount ? infoData.doubleBedsCount : '',
            bathRooms: infoData && infoData.privateBathRooms ? infoData.privateBathRooms : '',
            halls: infoData && infoData.hallsCount ? infoData.hallsCount : '',
            numACs: infoData && infoData.acsCount ? infoData.acsCount : '',
            kitchens: infoData && infoData.kitchensCount ? infoData.kitchensCount : '',
            guestRuleNote: '',
            status: infoData && infoData.status ? infoData.status : true,
            isDefault: infoData && infoData.isDefault == true ? 'true' : data && data.property ? 'true' : 'false',
            isloading: false,
            createproperty: data && data.property ? data.property : '',
            rentTypeError: '',
            roomTypeError: '',
            adultCapError: '',
            childCapError: '',
            roomsCountError: '', roomsCountSuccess: '',
            activeRoomsError: '', activeRoomsSuccess: '',
            singleBedError: '', singleBedSuccess: '',
            doubleBedError: '', doubleBedSuccess: '',
            bathRoomsCheck: '',
            acCheck: '',
            kitchensCheck: '',
            hallsCheck: '',
            priceValidate: 'false',
            AmenitiesValidate: 'false',
            servicesValidate: 'false',
            guestRulesValidate: 'false'

        };
        this.focusNextField = this.focusNextField.bind(this);
        this.inputs = {};
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
        this.handleNext = this.handleNext.bind(this);
        this.handleStatus = this.handleStatus.bind(this);
    }

    focusNextField(id) {
        this.inputs[id].focus();
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
    //   handleTextChange = (newText) => this.setState({ value: newText });
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
              duration: 500,
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
            duration: 0,
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
      this.setState({ guestRuleNote: newProps.navigation.state.params.ruleNote })
      if(newProps.navigation.state.params.priceValidate == true && this.state.priceValidate == 'true') {
        this.setState({ priceValidate: 'false' })
      } else if(newProps.navigation.state.params.AmenitiesValidate == true && this.state.AmenitiesValidate == 'true') {
        this.setState({ AmenitiesValidate: 'false' })
      } else if(newProps.navigation.state.params.servicesValidate == true && this.state.servicesValidate == 'true') {
        this.setState({ servicesValidate: 'false' })
      } else if(newProps.navigation.state.params.guestRulesValidate == true && this.state.guestRulesValidate == 'true') {
        this.setState({ guestRulesValidate: 'false' })
      }
    }
    //   handleKeyPress = ({ nativeEvent: { key: keyValue } }, value) => {
    //       alert(value);
    //     //   if(keyValue === '0' && this.state.singleBeds.charAt(0) == 0) {
    //     //     this.setState({singleBeds: ''});
    //     //   }
    //     //   if(keyValue === '0' && this.state.singleBeds.charAt(0) == 0) {
    //     //     this.setState({singleBeds: ''});
    //     //   }
    //   };

    handlePrice = () => {
      this.setState({ errorMessage: '' });
      const navigation = this.props.navigation
      const PropertyCreate = navigation.state.params.PropertyCreate
      let isMinBaseDefaultInfocreate = navigation.state.params && navigation.state.params.isMinBaseDefaultInfocreate ? navigation.state.params.isMinBaseDefaultInfocreate : false;
      let isMinBaseDefault = navigation.state.params && navigation.state.params.isMinBaseDefault ? navigation.state.params.isMinBaseDefault : false;        
      let pricing = {
          propertyTitle: this.state.propertyTitle,
          propertyType: this.state.propertyType,
          propertyImage: this.state.propertyImage,
          propertyArea: this.state.propertyArea
      }
      navigation.navigate('AddPriceScreen', { pricing: pricing ,
      isMinBaseDefaultInfocreate: isMinBaseDefaultInfocreate, isMinBaseDefault: isMinBaseDefault, PropertyCreate: PropertyCreate });
  }

    handleAmenities = () => {
        this.setState({ errorMessage: '' });
        navigation = this.props.navigation
        let propertyData = {
            propertyType: this.state.propertyType,
            propertyIconPath: this.state.propertyImage,
            propertyName: this.state.propertyTitle,
            propertyArea: this.state.propertyArea
        }
        navigation.navigate('AmenitiesCreateScreen', { propertyData: propertyData });
    }

    handleNavigateToCreateService() {
        const navigation = this.props.navigation;
        let propertyData = {
            propertyType: this.state.propertyType,
            propertyIconPath: this.state.propertyImage,
            propertyTitle: this.state.propertyTitle,
            propertyArea: this.state.propertyArea
        }
        navigation.navigate('ServiceCreate', { propertyData: propertyData })
    }

    handleGuestRules = () => {
        this.setState({ errorMessage: '' });
        navigation = this.props.navigation
        let propertyData = {
            propertyType: this.state.propertyType,
            propertyIconPath: this.state.propertyImage,
            propertyName: this.state.propertyTitle,
            propertyArea: this.state.propertyArea
        }
        navigation.navigate('GuestRulesCreateScreen', { ruleNote: this.state.guestRuleNote, propertyData: propertyData });
    }
    handleStatus() {
        this.setState({ status: !this.state.status });
    }
    componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleNext() {
        const navigation = this.props.navigation;
        const propertyObj = navigation.state.params && navigation.state.params.propertyData;
        const PropertyStore = this.props.PropertyStore;
        PropertyStore.createPropertyInfo = {};
        if (!this.state.rentType) {
            this.setState({ errorMessage:(i18n.t('lanErrorRentTypeIsRequired')) , rentTypeError: true });
        } else if (!this.state.roomType) {
            this.setState({ errorMessage: (i18n.t('lanErrorRoomTypeIsRequired')), roomTypeError: true });
        } else if (!this.state.roomCategory) {
            this.setState({ errorMessage:  (i18n.t('lanErrorRoomCategoryIsRequired')) });
        } else if (!this.state.adultCapacity || parseInt(this.state.adultCapacity) == 0) {
            this.setState({ errorMessage: (i18n.t('lanErrorAdultCapacityIsRequired')), adultCapError: true });
        } else if (!this.state.childCapacity || parseInt(this.state.childCapacity) == 0) {
            this.setState({ errorMessage: (i18n.t('lanErrorChildCapacityIsRequired')), childCapError: true });
        } else if (!this.state.roomsCount || parseInt(this.state.roomsCount) == 0) {
            this.setState({ errorMessage: (i18n.t('lanErrorTotalRoomsAreRequired')), roomsCountError: true, roomsCountSuccess: false });
        } else if (!this.state.activeRooms || parseInt(this.state.activeRooms) == 0) {
            this.setState({ errorMessage: (i18n.t('lanErrorActiveRoomsAreRequired')), activeRoomsError: true, activeRoomsSuccess: false });
        } else if (parseInt(this.state.roomsCount) < parseInt(this.state.activeRooms)) {
            this.setState({ errorMessage: (i18n.t('lanErrorTotalRoomsShouldBeGreaterThanActiveRooms')) });
        } else if (parseInt(this.state.roomsCount) < parseInt(this.state.onHoldRooms) + parseInt(this.state.activeRooms)) {
            this.setState({ errorMessage: (i18n.t('lanErrorActiveRoomsAndOnHoldRoomsShouldBeLessThanTotalRooms'))});
        } else if (!this.state.singleBeds && !this.state.doubleBeds) {
            this.setState({ errorMessage: (i18n.t('lanErrorSingleBedorDoubleBedsCountAreRequired')),
             singleBedError: true, singleBedSuccess: false, doubleBedError: true, doubleBedSuccess: false, });
            // } else if(this.state.singleBeds || parseInt(this.state.singleBeds) == 0) {
            //     this.setState({errorMessage: 'Single Beds Count is Required'});
            // } else if(!this.state.doubleBeds || parseInt(this.state.doubleBeds) == 0) {
            //     this.setState({errorMessage: 'Double Beds Count is Required'});
        } else if (!PropertyStore.Pricing.basePrice || parseInt(PropertyStore.Pricing.basePrice) == 0) {
            this.setState({ errorMessage: i18n.t('lanErrorPleaseAddPriceDetails'), priceValidate: 'true' });
        } else if (!PropertyStore.Pricing.minBasePrice || parseInt(PropertyStore.Pricing.minBasePrice) == 0) {
            this.setState({ errorMessage:  i18n.t('lanErrorPleaseAddMinBasePrice') });
        } else if (!PropertyStore.Pricing.fullRefundCancelTime) {
            this.setState({ errorMessage: i18n.t('lanErrorPleaseAddFullRefundCancelTimeInPriceScreen') });
        } else if (!PropertyStore.Pricing.refundCancelTime) {
            this.setState({ errorMessage: i18n.t('lanErrorPleaseAddRefundCancelTimeInPriceScreen') });
        } else if (!PropertyStore.Pricing.refundCancelPercentage) {
            this.setState({ errorMessage: i18n.t('lanErrorPleaseAddRefundCancelPercentageInPriceScreen') });
        } else if (PropertyStore.Amenities.length < 1) {
            this.setState({ errorMessage: i18n.t('lanErrorPleaseAddAmenities'), AmenitiesValidate: 'true' });
        } else if (PropertyStore.Services.length < 1) {
            this.setState({ errorMessage: i18n.t('lanErrorPleaseAddServices'), servicesValidate: 'true' });
        } else if (PropertyStore.GuestRules.length < 1) {
            this.setState({ errorMessage: i18n.t('lanErrorPleaseAddGuestRules'), guestRulesValidate: 'true' });
        } else {
            this.setState({ isloading: true });
            let post_json = {
                propertyId: this.state.createproperty ? '' : this.state.propertyID,
                propertyTitle: this.state.propertyTitle,
                propertyType: this.state.propertyType,
                rentType: this.state.rentType,
                roomCategory: this.state.roomCategory,
                roomType: this.state.roomType,
                membersCapacity: this.state.adultCapacity,
                childsCapacity: this.state.childCapacity,
                roomsName: this.state.roomName,
                roomsCount: this.state.roomsCount,
                activeRoomsCount: this.state.activeRooms,
                onHoldRoomsCount: this.state.onHoldRooms,
                status: this.state.status ? 'Active' : 'Inactive',
                isDefault: this.state.createproperty ? true : this.state.isDefault == 'true' ? true : false,
                inactiveRoomsCount: this.state.roomsCount - this.state.activeRooms - (this.state.onHoldRooms ? this.state.onHoldRooms : 0),
                singleBedsCount: this.state.singleBeds,
                doubleBedsCount: this.state.doubleBeds,
                privateBathRooms: this.state.bathRooms,
                kitchensCount: this.state.kitchens,
                hallsCount: this.state.halls,
                acsCount: this.state.numACs,
                pricing: PropertyStore.Pricing,
                spLocationId: this.state.createproperty ? '' : propertyObj.spLocationId,
                spLocationObj: this.state.createproperty ? '' : propertyObj.spLocationObj,
                amenities: PropertyStore.Amenities,
                amenitiesAvailable: PropertyStore.AmenitiesAvailable,
                guestRules: PropertyStore.GuestRules,
                guestRulesAvaliable: PropertyStore.AvailableGuests,
                servicesAvailable: PropertyStore.ServicesAvailable,
                paidServices: PropertyStore.Services,
                guestRuleNote: this.state.guestRuleNote,
                nearestAreas: this.state.nearestAreas
            };
            if (this.state.createproperty == 'create') {
                PropertyStore.createPropertyInfo = post_json;
                navigation.navigate('CreateProperty', {propInfoEnable: true})
                // navigation.goBack();
            } else {
                let _this = this;
                PropertyStore.createPropertyInfoData(post_json, function (resObj) {
                    _this.setState({ isloading: false });
                    PropertyStore.Pricing = {};
                    PropertyStore.GuestRules = [];
                    PropertyStore.GuestRulesAvaliable = [];
                    PropertyStore.AvailableGuests = [];
                    PropertyStore.Amenities = [];
                    PropertyStore.AmenitiesAvailable = [];
                    PropertyStore.Services = [];
                    PropertyStore.ServicesAvailable = [];
                    PropertyStore.selectedService = false;
                    PropertyStore.selectedPricing = false;
                    PropertyStore.selectedAminities = false;
                    PropertyStore.selectedGuestRules = false;
                    if (resObj.statusCode == '0000') {
                        navigation.navigate('PropertyInfoList', { list: 'list' });
                    } else {
                        _this.setState({ errorMessage: i18n.t('lanErrorPropertyInfoCreateFailed') });
                    }
                });
            }
        }
    }

    render() {
      const navigation = this.props.navigation;
      const PropertyStore = this.props.PropertyStore;
      const { shift } = this.state;
      const adultCapacity = <Text style={[styles.titleDropdown]}>{i18n.t('lanLabelAdultsCapacity')}<Text style={styles.required}>*</Text></Text>
      const childCapacity = <Text style={[styles.titleDropdown]}>{i18n.t('lanLabelChildCapacity')}<Text style={styles.required}>*</Text></Text>
      const roomsCountLbl = <Text style={[styles.titleDropdown]}>{i18n.t('lanLabelTotalRooms')}<Text style={styles.required}>*</Text></Text>
      const activeRoomsLbl = <Text style={[styles.titleDropdown]}>{i18n.t('lanLabelActiveRooms')} <Text style={styles.required}>*</Text></Text>
      const holdRoomsLbl = <Text style={[styles.titleDropdown]}>{i18n.t('lanLabelOnHoldRooms')}</Text>
      const singleBedsLbl = <Text style={[styles.titleDropdown]}>{i18n.t('lanLabelSingleBeds')} <Text style={styles.required}>*</Text></Text>
      const doubleBedsLbl = <Text style={[styles.titleDropdown]}>{i18n.t('lanLabelDoubleBeds')} <Text style={styles.required}>*</Text></Text>
        return (
          <View style={styles.container}>
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
                  <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleCreatePropertyInfo')}</Text>
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
                          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.propertyTitle}> {this.state.propertyTitle} </Text>
                          <Text style={styles.titleLocationType}> {this.state.propertyArea} </Text>
                          <Text style={styles.titleType}> {this.state.propertyType} - {i18n.t('lanTitlePropertyInfoCreate')}</Text>
                        </View>
                      </Body>
                    </Left>
                  </CardItem>
                </Card>
              </View>
              <ScrollView>
                <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
                  <View style={styles.content}>
                    <View style={!this.state.rentTypeError ? { borderBottomWidth: 1, borderBottomColor: '#01a4a2', marginBottom:10,  } : {borderBottomWidth: 1, borderBottomColor: 'red', marginBottom:10,}} >
                      <Text style={!this.state.rentTypeError ? [ styles.titleDropdown, styles.leftSpace ] : [ styles.titleError, styles.leftSpace ] } >{i18n.t('lanLabelSelectRentType')}<Text style={styles.required}>*</Text></Text>
                      <Picker
                        iosHeader='Select Rent Type'
                        iosIcon={<Icon name='arrow-down' />}
                        mode='dropdown'
                        style={{ width: DEVICE_WIDTH-20, marginTop:-5, marginLeft:-5 }}
                        selectedValue={this.state.rentType}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ rentType: itemValue, errorMessage: '', rentTypeError:itemValue ? false : true })
                        }>
                        <Picker.Item label="Rent Type" value='' />
                        <Picker.Item label="Sharing Room" value="Sharing Room" />
                        <Picker.Item label="Private Room" value="Private Room" />
                        <Picker.Item label="Entire Space" value="Entire Space" />
                      </Picker>
                    </View>
                    <View style={!this.state.roomTypeError ? { borderBottomWidth: 1, borderBottomColor: '#01a4a2', marginBottom:10, } : { borderBottomWidth: 1, borderBottomColor: 'red', marginBottom:10, }} >
                      <Text style={!this.state.roomTypeError ? [ styles.titleDropdown, styles.leftSpace ] : [ styles.titleError, styles.leftSpace ] } >{i18n.t('lanLabelSelectRoomType')}<Text style={styles.required}>*</Text> </Text>
                      <Picker
                        iosHeader='Select Room Type'
                        iosIcon={<Icon name='arrow-down' />}
                        mode='dropdown'
                        style={{ width: DEVICE_WIDTH-20, marginTop:-5, marginLeft:-5 }}
                        selectedValue={this.state.roomType}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ roomType: itemValue, errorMessage: '', roomTypeError: itemValue ? false : true})
                        }>
                        <Picker.Item label="Room Type" value="" />
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
                  <View style={styles.midcontent}>
                    <View style={styles.roomCategory}>
                      <View style={styles.floatingInputView} >
                        <Text style={styles.titleRadio} >{i18n.t('lanLabelRoomCategory')}</Text>
                      </View>
                    </View>
                    <View style={styles.DateGenderView}>
                      <View style={[styles.inputRadio, styles.DatePicker]} >
                        <View style={{ flexDirection: 'row' }}>
                          <RadioButton currentValue={this.state.roomCategory} value='Economy' onPress={() => this.setState({ roomCategory: 'Economy', errorMessage: '' })} />
                          <View style={{ paddingHorizontal:5, paddingVertical:3 }} >
                            <Text style={styles.title}>Economy</Text>
                          </View>
                        </View>
                      </View>
                      <View style={[styles.inputRadio, styles.DatePicker]} >
                        <View style={{ flexDirection: 'row' }}>
                          <RadioButton currentValue={this.state.roomCategory} value='Deluxe' onPress={() => this.setState({ roomCategory: 'Deluxe', errorMessage: '' })} />
                          <View style={{ paddingHorizontal:5, paddingVertical:3 }} >
                            <Text style={styles.title}>Deluxe</Text>
                          </View>
                        </View>
                      </View>
                      <View style={[styles.inputRadio, styles.DatePicker]} >
                        <View style={{ flexDirection: 'row' }}>
                          <RadioButton currentValue={this.state.roomCategory} value='Luxury' onPress={() => this.setState({ roomCategory: 'Luxury', errorMessage: '' })} />
                          <View style={{ paddingHorizontal:5, paddingVertical:3}} >
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
                            isError={this.state.adultCapError}
                            value={this.state.adultCapacity.toString()}
                            keyboardType='numeric'
                            onChangeText={(text) => this.setState({ adultCapacity: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '', adultCapError: text ? false : true })}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                                this.inputs['Adults Capacity'] = ref;
                            }}
                            onSubmitEditing={() => {
                                this.focusNextField('Child Capacity');
                            }}
                        />
                        {this.state.adultCapError
                        ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                        : <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                        }
                      </View>
                      <View style={[styles.floatingInputView, styles.genderView]}>
                        <FloatingLabelInput
                            label={i18n.t('lanLabelChildCapacity')}
                            value={this.state.childCapacity.toString()}
                            isError={this.state.childCapError}
                            keyboardType='numeric'
                            onChangeText={(text) => this.setState({ childCapacity: text.replace(/\s/g, ''), errorMessage: '', childCapError:text ? false : true })}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                                this.inputs['Child Capacity'] = ref;
                            }}
                            onSubmitEditing={() => {
                                this.focusNextField('Rooms Count');
                            }}
                        />
                        {this.state.childCapError
                        ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                        : <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                        }
                      </View>
                    </View>
                    <View style={styles.DateGenderView}>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <FloatingLabelInput
                            label={roomsCountLbl}
                            value={this.state.roomsCount.toString()}
                            isError={this.state.roomsCountError}
                            onChangeText={(text) => this.setState({ roomsCount: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '', roomsCountError:text ? false : true, roomsCountSuccess: true })}
                            keyboardType='numeric'
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                                this.inputs['Rooms Count'] = ref;
                            }}
                            onSubmitEditing={() => {
                                this.focusNextField('Active Rooms');
                            }}
                        />
                        {this.state.roomsCountError
                        ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                        : this.state.roomsCountSuccess && !this.state.roomsCountError
                          ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                          : null
                        }
                      </View>
                      <View style={[styles.floatingInputView, styles.genderView]}>
                        <FloatingLabelInput
                            label={activeRoomsLbl}
                            value={this.state.activeRooms.toString()}
                            isError={this.state.activeRoomsError}
                            keyboardType='numeric'
                            onChangeText={(text) => this.setState({ activeRooms: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '', activeRoomsError:text ? false : true, activeRoomsSuccess: true })}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                                this.inputs['Active Rooms'] = ref;
                            }}
                            onSubmitEditing={() => {
                                this.focusNextField('OnHold Rooms');
                            }}
                        />
                        {this.state.activeRoomsError
                        ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                        : this.state.activeRoomsSuccess && !this.state.activeRoomsError
                          ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                          : null
                        }
                      </View>
                    </View>
                    <View style={styles.DateGenderView}>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <FloatingLabelInput
                            label={holdRoomsLbl}
                            value={this.state.onHoldRooms.toString()}
                            onChangeText={(text) => this.setState({onHoldRooms:text ? parseInt(text) : '', errorMessage: '' })}
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
                    <View style={styles.DateGenderView}>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <FloatingLabelInput
                            label={singleBedsLbl}
                            keyboardType='numeric'
                            value={this.state.singleBeds.toString()}
                            isError={this.state.singleBedError}
                            onChangeText={(text) => this.setState({ singleBeds: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '',
                            singleBedError: text ? false : true, singleBedSuccess: text ? true : false, doubleBedError: text ? false : true, doubleBedSuccess: false })}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                                this.inputs['Single Beds'] = ref;
                            }}
                            onSubmitEditing={() => {
                                this.focusNextField('Double Beds');
                            }}
                        />
                        {this.state.singleBedError
                        ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                        : this.state.singleBedSuccess
                          ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                          : null
                        }
                      </View>
                      <View style={[styles.floatingInputView, styles.genderView]}>
                        <FloatingLabelInput
                            label={doubleBedsLbl}
                            keyboardType='numeric'
                            value={this.state.doubleBeds.toString()}
                            isError={this.state.doubleBedError}
                            onChangeText={(text) => this.setState({ doubleBeds: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '',
                              doubleBedError: text ? false : true, doubleBedSuccess: text ? true : false, singleBedError: text ? false : true, singleBedSuccess: false })}
                              returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                                this.inputs['Double Beds'] = ref;
                            }}
                            onSubmitEditing={() => {
                                this.focusNextField('Bath Rooms');
                            }}
                        />
                        {this.state.doubleBedError
                        ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                        : this.state.doubleBedSuccess
                          ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                          : null
                        }
                      </View>
                    </View>
                    <View style={styles.DateGenderView}>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <FloatingLabelInput
                            label={i18n.t('lanLabelBathRooms')}
                            keyboardType='numeric'
                            value={this.state.bathRooms.toString()}
                            onChangeText={(text) => this.setState({ bathRooms: text.replace(/\s/g, ''), errorMessage: '', bathRoomsCheck:text ? true : false })}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                                this.inputs['Bath Rooms'] = ref;
                            }}
                            onSubmitEditing={() => {
                                this.focusNextField('ACs');
                            }}
                        />
                        {this.state.bathRoomsCheck
                        ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                        : null }
                      </View>
                      <View style={[styles.floatingInputView, styles.genderView]}>
                        <FloatingLabelInput
                            label={i18n.t('lanLabelNoOfAcs')}
                            keyboardType='numeric'
                            value={this.state.numACs.toString()}
                            onChangeText={(text) => this.setState({ numACs: text.replace(/\s/g, ''), errorMessage: '', acCheck:text ? true : false })}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                                this.inputs['ACs'] = ref;
                            }}
                            onSubmitEditing={() => {
                                this.focusNextField('Kitchens');
                            }}
                        />
                        {this.state.acCheck
                        ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                        : null }
                      </View>
                    </View>
                    <View style={styles.DateGenderView}>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <FloatingLabelInput
                            label={i18n.t('lanLabelKitchens')}
                            keyboardType='numeric'
                            value={this.state.kitchens.toString()}
                            onChangeText={(text) => this.setState({ kitchens: text, errorMessage: '', kitchensCheck:text ? true : false })}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                                this.inputs['Kitchens'] = ref;
                            }}
                            onSubmitEditing={() => {
                                this.focusNextField('Halls');
                            }}
                        />
                        {this.state.kitchensCheck
                        ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                        : null }
                      </View>
                      <View style={[styles.floatingInputView, styles.genderView]}>
                        <FloatingLabelInput
                            label={i18n.t('lanLabelHalls')}
                            keyboardType='numeric'
                            value={this.state.halls.toString()}
                            onChangeText={(text) => this.setState({ halls: text, errorMessage: '', hallsCheck:text ? true : false })}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                                this.inputs['Halls'] = ref;
                            }}
                            onSubmitEditing={() => {}}
                        />
                        {this.state.hallsCheck
                        ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                        : null }
                      </View>
                    </View>
                    <View>
                      <View style={styles.listItem}>
                        <Left>
                          <Text style={[styles.title]}>{i18n.t('lanLabelStatus')}</Text>
                        </Left>
                        <Right>
                          <Switch value={this.state.status} onValueChange={() => this.handleStatus()}></Switch>
                        </Right>
                      </View>
                    </View>
                    <TouchableOpacity onPress={this.handlePrice}>
                      <View style={styles.listItem}>
                        <Left style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                          <View>
                            <Text style={this.state.priceValidate == 'true' ? styles.routingTitleValidateStyle : styles.routingTitleStyle}> {i18n.t('lanButtonPricing')}<Text style={styles.required}>*</Text></Text>
                          </View>
                          <View>
                            {!PropertyStore.selectedPricing
                            ? <Icon name='md-arrow-forward' style={this.state.priceValidate == 'true' ? styles.routingTitleIconValidateStyle : styles.routingTitleIconStyle} />
                            : <Icon name='ios-checkmark-circle' style={styles.routingTitleSuccessStyle} />
                            }
                          </View>
                        </Left>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handleAmenities} >
                      <View style={styles.listItem}>
                        <Left style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                          <View>
                            <Text style={this.state.AmenitiesValidate == 'true' ? styles.routingTitleValidateStyle : styles.routingTitleStyle}>  {i18n.t('lanButtonAmenities')}<Text style={styles.required}>*</Text></Text>
                          </View>
                          <View>
                            {!PropertyStore.selectedAminities
                            ? <Icon name='md-arrow-forward' style={this.state.AmenitiesValidate == 'true' ? styles.routingTitleIconValidateStyle : styles.routingTitleIconStyle} />
                            : <Icon name='ios-checkmark-circle' style={styles.routingTitleSuccessStyle} />
                            }
                          </View>
                        </Left>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.handleNavigateToCreateService()}  >
                      <View style={styles.listItem}>
                        <Left style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                          <View>
                            <Text style={this.state.servicesValidate == 'true' ? styles.routingTitleValidateStyle : styles.routingTitleStyle}> {i18n.t('lanButtonServices')}<Text style={styles.required}>*</Text></Text>
                          </View>
                          <View>
                            {!PropertyStore.selectedService
                            ? <Icon name='md-arrow-forward' style={this.state.servicesValidate == 'true' ? styles.routingTitleIconValidateStyle : styles.routingTitleIconStyle} />
                            : <Icon name='ios-checkmark-circle' style={styles.routingTitleSuccessStyle} />
                            }
                          </View>
                        </Left>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handleGuestRules} >
                      <View style={styles.listItem}>
                        <Left style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                          <View>
                           <Text style={this.state.guestRulesValidate == 'true' ? styles.routingTitleValidateStyle : styles.routingTitleStyle}> {i18n.t('lanButtonGuestRules')}<Text style={styles.required}>*</Text></Text>
                          </View>
                          <View>
                            {!PropertyStore.selectedGuestRules
                            ? <Icon name='md-arrow-forward' style={this.state.guestRulesValidate == 'true' ? styles.routingTitleIconValidateStyle : styles.routingTitleIconStyle} />
                            : <Icon name='ios-checkmark-circle' style={styles.routingTitleSuccessStyle} />
                            }
                          </View>
                        </Left>
                      </View>
                    </TouchableOpacity>
                    <View style={{justifyContent:'center', alignItems:'center' }}><Text style={{ color: 'red', fontSize:12, fontFamily:'Roboto_medium' }}>{this.state.errorMessage}</Text></View>
                      <View style={styles.btnModal} >
                        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                          <AwesomeButton block success
                            onPress={() => this.handleNext()}
                            width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} marginTop={20} >
                            <Text style={styles.BtnText}> {i18n.t('lanCommonButtonCreate')}</Text>
                          </AwesomeButton>
                        </LinearGradient>
                      </View>
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
