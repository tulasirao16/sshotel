import React from 'react';
import { Platform, AsyncStorage, Animated, TouchableOpacity, TouchableHighlight, ScrollView, Keyboard, TextInput, Dimensions, StatusBar, Image, BackHandler, UIManager } from 'react-native';
import { Button, Icon, View, Text, Card, CardItem, Accordion, Left, Body, Picker } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import TimePicker from "react-native-24h-timepicker";
import styles from './css/AddPriceCss';
import { inject, observer } from 'mobx-react';
import AwesomeButton from "react-native-really-awesome-button";
import { PUBLIC_DOMAIN } from '../../../constants';
import moment from 'moment';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Collapsible from 'react-native-collapsible';
import i18n from 'i18n-js';
import { CheckBox } from 'react-native-elements'

const { State: TextInputState } = TextInput;
const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['PropertyStore'])
@observer
export default class AddPriceScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      title: i18n.t('lanTitleAddPrice'),
      header: null,
      headerStyle: {
        backgroundColor: '#025d8c'
      },
      headerTitleStyle: {
        textAlign: 'left',
        flex: 1,
        color: '#fff',
        fontSize: 18,
      },
      headerLeft: <Button transparent onPress={() => navigation.goBack()} ><Icon name='arrow-back' style={{ color: '#fff', marginLeft: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>,
      headerRight: <Button transparent onPress={() => navigation.navigate('PrebuildTemplatesScreen')}><Icon name='apps' style={{ color: '#fff', marginRight: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>,
    }
  };

  constructor(props) {
    super(props);
    const PropertyStore = this.props.PropertyStore;
    const navigation = this.props.navigation;
    let mmm = AsyncStorage.getItem('authObj')
    AsyncStorage.getItem('authObj').then((value) => {
      let authObj = JSON.parse(value);
    });
    const isMinBaseDefaultInfocreate = navigation.state.params.isMinBaseDefaultInfocreate;
    const isMinBaseDefault = navigation.state.params.isMinBaseDefault;
    const isPropertyCreate = navigation.state.params.PropertyCreate;
    const pricingData = PropertyStore.PricingView && PropertyStore.PricingView.basePrice ? PropertyStore.PricingView : {}
    this.state = {
      // basePrice: PropertyStore.Pricing && PropertyStore.Pricing.basePrice ? PropertyStore.Pricing.basePrice : '',
      // minBasePriceUnit: PropertyStore.Pricing && PropertyStore.Pricing.minBasePriceUnit ? PropertyStore.Pricing.minBasePriceUnit : '12 Hours',
      // minBasePriceUnitValue: PropertyStore.Pricing && PropertyStore.Pricing.minBasePriceUnitValue ? PropertyStore.Pricing.minBasePriceUnitValue : 4,
      // minBasePrice: PropertyStore.Pricing && PropertyStore.Pricing.minBasePrice ? PropertyStore.Pricing.minBasePrice : '',
      // billingType: PropertyStore.Pricing && PropertyStore.Pricing.billingType ? PropertyStore.Pricing.billingType :'Per Day',
      // currency: PropertyStore.Pricing && PropertyStore.Pricing.currency ? PropertyStore.Pricing.currency : 'INR',
      // checkIn: PropertyStore.Pricing && PropertyStore.Pricing.checkInTime ? PropertyStore.Pricing.checkInTime : '01:00 PM',
      // checkOut: PropertyStore.Pricing && PropertyStore.Pricing.checkOutTime ? PropertyStore.Pricing.checkOutTime : '11:00 AM',
      // checkInCredentials: PropertyStore.Pricing && PropertyStore.Pricing.checkInCredentials ? PropertyStore.Pricing.checkInCredentials : 'Around the Clock',
      // fullRefundCancelTime: PropertyStore.Pricing && PropertyStore.Pricing.fullRefundCancelTime ? PropertyStore.Pricing.fullRefundCancelTime : '72',
      // refundCancelTime: PropertyStore.Pricing && PropertyStore.Pricing.refundCancelTime ? PropertyStore.Pricing.refundCancelTime : '12',
      // refundCancelPercentage: PropertyStore.Pricing && PropertyStore.Pricing.refundCancelPercentage ? PropertyStore.Pricing.refundCancelPercentage : '65',
      // propertyTitle : navigation.state.params && navigation.state.params.pricing ? navigation.state.params.pricing.propertyTitle : '',
      // propertyType : navigation.state.params && navigation.state.params.pricing ? navigation.state.params.pricing.propertyType : '',
      // propertyImage : navigation.state.params && navigation.state.params.pricing ? navigation.state.params.pricing.propertyImage : '',
      // propertyArea : navigation.state.params && navigation.state.params.pricing ? navigation.state.params.pricing.propertyArea : '',
      // errorMessage: '',
      // checkInHour: PropertyStore.Pricing && PropertyStore.Pricing.checkInTime ? moment(PropertyStore.Pricing.checkInTime, 'hh:mm A').format('hh') : '01',
      // checkInMin: PropertyStore.Pricing && PropertyStore.Pricing.checkInTime ? moment(PropertyStore.Pricing.checkInTime, 'hh:mm A').format('mm') : '00',
      // checkInAM: PropertyStore.Pricing && PropertyStore.Pricing.checkInTime ? moment(PropertyStore.Pricing.checkInTime, 'hh:mm A').format('A') : 'PM',
      // checkOutHour: PropertyStore.Pricing && PropertyStore.Pricing.checkOutTime ? moment(PropertyStore.Pricing.checkOutTime, 'hh:mm A').format('hh') : '11',
      // checkOutMin: PropertyStore.Pricing && PropertyStore.Pricing.checkOutTime ? moment(PropertyStore.Pricing.checkOutTime, 'hh:mm A').format('mm') : '00',
      // checkOutAM: PropertyStore.Pricing && PropertyStore.Pricing.checkOutTime ? moment(PropertyStore.Pricing.checkOutTime, 'hh:mm A').format('A') : 'AM',


      propertyTitle: navigation.state.params && navigation.state.params.pricing ? navigation.state.params.pricing.propertyTitle : '',
      propertyType: navigation.state.params && navigation.state.params.pricing ? navigation.state.params.pricing.propertyType : '',
      propertyImage: navigation.state.params && navigation.state.params.pricing ? navigation.state.params.pricing.propertyImage : '',
      propertyArea: navigation.state.params && navigation.state.params.pricing ? navigation.state.params.pricing.propertyArea : '',

      minBasePriceUnit: pricingData && pricingData.minBasePriceUnit ? pricingData.minBasePriceUnit : '6<=>6 Hours',
      minBasePriceUnitValue: pricingData && pricingData.minBasePriceUnitValue ? pricingData.minBasePriceUnitValue : 6,
      billingType: pricingData && pricingData.billingType ? pricingData.billingType : 'Per Day',
      basePrice: pricingData && pricingData.basePrice ? pricingData.basePrice : '',
      checkInCredentials: pricingData && pricingData.checkInCredentials ? pricingData.checkInCredentials : 'Around the Clock',
      checkInTime: pricingData && pricingData.checkInTime ? pricingData.checkInTime : '',
      checkOutTime: pricingData && pricingData.checkOutTime ? pricingData.checkOutTime : '',
      currency: pricingData && pricingData.currency ? pricingData.currency : 'INR',
      fullRefundCancelTime: pricingData && pricingData.fullRefundCancelTime ? pricingData.fullRefundCancelTime : '72',
      refundCancelTime: pricingData && pricingData.refundCancelTime ? pricingData.refundCancelTime : '12',
      refundCancelPercentage: pricingData && pricingData.refundCancelPercentage ? pricingData.refundCancelPercentage : '65',
      timeHours: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      timeMins: ['00', '15', '30', '45'],
      timePeriod: ['AM', 'PM'],
      checkInHour: pricingData && pricingData.checkInTime ? moment(pricingData.checkInTime, 'hh:mm A').format('hh') : '12',
      checkInMin: pricingData && pricingData.checkInTime ? moment(pricingData && pricingData.checkInTime, 'hh:mm A').format('mm') : '00',
      checkInAM: pricingData && pricingData.checkInTime ? moment(pricingData && pricingData.checkInTime, 'hh:mm A').format('A') : 'PM',
      checkOutHour: pricingData && pricingData.checkOutTime ? moment(pricingData.checkOutTime, 'hh:mm A').format('hh') : '11',
      checkOutMin: pricingData && pricingData.checkOutTime ? moment(pricingData.checkOutTime, 'hh:mm A').format('mm') : '00',
      checkOutAM: pricingData && pricingData.checkOutTime ? moment(pricingData.checkOutTime, 'hh:mm A').format('A') : 'AM',
      errorMessage: '',
      errorClass: false,
      serviceCharges: pricingData && pricingData.serviceCharges ? pricingData.serviceCharges : 0,
      otherCharges: pricingData && pricingData.otherCharges ? pricingData.otherCharges : 0,
      cgstPercentage: pricingData && pricingData.cgstPercentage ? pricingData.cgstPercentage : 0,
      cgstAmount: pricingData && pricingData.cgstAmount ? pricingData.cgstAmount : 0,
      cgstAmount1: pricingData && pricingData.cgstAmount1 ? pricingData.cgstAmount1 : 0,
      cgstAmount2: pricingData && pricingData.cgstAmount2 ? pricingData.cgstAmount2 : 0,
      cgstAmount3: pricingData && pricingData.cgstAmount3 ? pricingData.cgstAmount3 : 0,
      cgstAmount4: pricingData && pricingData.cgstAmount4 ? pricingData.cgstAmount4 : 0,
      weekEndcgstAmount: pricingData && pricingData.weekEndcgstAmount ? pricingData.weekEndcgstAmount : 0,
      weekEndcgstAmount1: pricingData && pricingData.weekEndcgstAmount1 ? pricingData.weekEndcgstAmount1 : 0,
      weekEndcgstAmount2: pricingData && pricingData.weekEndcgstAmount2 ? pricingData.weekEndcgstAmount2 : 0,
      weekEndcgstAmount3: pricingData && pricingData.weekEndcgstAmount3 ? pricingData.weekEndcgstAmount3 : 0,
      weekEndcgstAmount4: pricingData && pricingData.weekEndcgstAmount4 ? pricingData.weekEndcgstAmount4 : 0,
      sgstPercentage: pricingData && pricingData.sgstPercentage ? pricingData.sgstPercentage : 0,
      sgstAmount: pricingData && pricingData.sgstAmount ? pricingData.sgstAmount : 0,
      sgstAmount1: pricingData && pricingData.sgstAmount1 ? pricingData.sgstAmount1 : 0,
      sgstAmount2: pricingData && pricingData.sgstAmount2 ? pricingData.sgstAmount2 : 0,
      sgstAmount3: pricingData && pricingData.sgstAmount3 ? pricingData.sgstAmount3 : 0,
      sgstAmount4: pricingData && pricingData.sgstAmount4 ? pricingData.sgstAmount4 : 0,
      weekEndsgstAmount: pricingData && pricingData.weekEndsgstAmount ? pricingData.weekEndsgstAmount : 0,
      weekEndsgstAmount1: pricingData && pricingData.weekEndsgstAmount1 ? pricingData.weekEndsgstAmount1 : 0,
      weekEndsgstAmount2: pricingData && pricingData.weekEndsgstAmount2 ? pricingData.weekEndsgstAmount2 : 0,
      weekEndsgstAmount3: pricingData && pricingData.weekEndsgstAmount3 ? pricingData.weekEndsgstAmount3 : 0,
      weekEndsgstAmount4: pricingData && pricingData.weekEndsgstAmount4 ? pricingData.weekEndsgstAmount4 : 0,
      minBasePrice: pricingData && pricingData.minBasePrice ? pricingData.minBasePrice : 0,
      minBasePrice2: pricingData && pricingData.minBasePrice2 ? pricingData.minBasePrice2 : 0,
      minBasePrice3: pricingData && pricingData.minBasePrice3 ? pricingData.minBasePrice3 : 0,
      minBasePrice4: pricingData && pricingData.minBasePrice4 ? pricingData.minBasePrice4 : 0,

      weekdayBilingUnit: pricingData && pricingData.weekdayBilingUnit ? pricingData.weekdayBilingUnit : 'Per Day',
      weekdayDiscount: pricingData && pricingData.weekdayDiscount ? pricingData.weekdayDiscount : 0,
      weekEndMinBasePrice: pricingData && pricingData.weekEndMinBasePrice ? pricingData.weekEndMinBasePrice : 0,
      weekEndMinBasePrice2: pricingData && pricingData.weekEndMinBasePrice2 ? pricingData.weekEndMinBasePrice2 : 0,
      weekEndMinBasePrice3: pricingData && pricingData.weekEndMinBasePrice3 ? pricingData.weekEndMinBasePrice3 : 0,
      weekEndMinBasePrice4: pricingData && pricingData.weekEndMinBasePrice4 ? pricingData.weekEndMinBasePrice4 : 0,
      weekEndBasePrice4: pricingData && pricingData.weekEndBasePrice4 ? pricingData.weekEndBasePrice4 : 0,
      weekEndBasePrice: pricingData && pricingData.weekEndBasePrice ? pricingData.weekEndBasePrice : '',

      weekEndminBilingUnit: pricingData && pricingData.weekEndminBilingUnit ? pricingData.weekEndminBilingUnit : 'Per Day',
      weekEndDiscount: pricingData && pricingData.weekEndDiscount ? pricingData.weekEndDiscount : 0,
      appPercentage: '',
      appPgPercentage: '',
      PGAmount: 0,
      PGAmount1: 0,
      PGAmount2: 0,
      PGAmount3: 0,
      PGAmount4: 0,
      weekEndPGAmount: 0,
      weekEndPGAmount1: 0,
      weekEndPGAmount2: 0,
      weekEndPGAmount3: 0,
      weekEndPGAmount4: 0,
      weekEndEdit: true,
      editVisiblePrice: true,
      EDFinalPrice: pricingData && pricingData.EDFinalPrice ? pricingData.EDFinalPrice : 0,
      SPFinalPrice: pricingData && pricingData.SPFinalPrice ? pricingData.SPFinalPrice : 0,

      EDWithOutDiscountFinalPrice: pricingData && pricingData.EDWithOutDiscountFinalPrice ? pricingData.EDWithOutDiscountFinalPrice : 0,
      SPWithOutDiscountFinalPrice: pricingData && pricingData.SPWithOutDiscountFinalPrice ? pricingData.SPWithOutDiscountFinalPrice : 0,

      basePriceDiscount: pricingData && pricingData.basePriceDiscount ? pricingData.basePriceDiscount : 0,
      basePriceDiscount1: pricingData && pricingData.basePriceDiscount1 ? pricingData.basePriceDiscount1 : 0,
      basePriceDiscount2: pricingData && pricingData.basePriceDiscount2 ? pricingData.basePriceDiscount2 : 0,
      basePriceDiscount3: pricingData && pricingData.basePriceDiscount3 ? pricingData.basePriceDiscount3 : 0,
      basePriceDiscount4: pricingData && pricingData.basePriceDiscount4 ? pricingData.basePriceDiscount4 : 0,

      weekEndbasePriceDiscount: pricingData && pricingData.weekEndbasePriceDiscount ? pricingData.weekEndbasePriceDiscount : 0,
      weekEndbasePriceDiscount1: pricingData && pricingData.weekEndbasePriceDiscount1 ? pricingData.weekEndbasePriceDiscount1 : 0,
      weekEndbasePriceDiscount2: pricingData && pricingData.weekEndbasePriceDiscount2 ? pricingData.weekEndbasePriceDiscount2 : 0,
      weekEndbasePriceDiscount3: pricingData && pricingData.weekEndbasePriceDiscount3 ? pricingData.weekEndbasePriceDiscount3 : 0,
      weekEndbasePriceDiscount4: pricingData && pricingData.weekEndbasePriceDiscount4 ? pricingData.weekEndbasePriceDiscount4 : 0,

      appCharges: pricingData && pricingData.appCharges ? pricingData.appCharges : 0,
      minBaseAppCharges: pricingData && pricingData.minBaseAppCharges ? pricingData.minBaseAppCharges : 0,
      minBaseAppCharges2: pricingData && pricingData.minBaseAppCharges2 ? pricingData.minBaseAppCharges2 : 0,
      minBaseAppCharges3: pricingData && pricingData.minBaseAppCharges3 ? pricingData.minBaseAppCharges3 : 0,
      minBaseAppCharges4: pricingData && pricingData.minBaseAppCharges4 ? pricingData.minBaseAppCharges4 : 0,

      weekEndAppCharges: pricingData && pricingData.weekEndAppCharges ? pricingData.weekEndAppCharges : 0,
      weekEndMinBaseAppCharges: pricingData && pricingData.weekEndMinBaseAppCharges ? pricingData.weekEndMinBaseAppCharges : 0,
      weekEndMinBaseAppCharges2: pricingData && pricingData.weekEndMinBaseAppCharges2 ? pricingData.weekEndMinBaseAppCharges2 : 0,
      weekEndMinBaseAppCharges3: pricingData && pricingData.weekEndMinBaseAppCharges3 ? pricingData.weekEndMinBaseAppCharges3 : 0,
      weekEndMinBaseAppCharges4: pricingData && pricingData.weekEndMinBaseAppCharges4 ? pricingData.weekEndMinBaseAppCharges4 : 0,

      spAmount: pricingData && pricingData.spAmount ? pricingData.spAmount : 0,
      minBaseSpAmount: pricingData && pricingData.appCharges ? pricingData.appCharges : 0,
      minBaseSpAmount2: pricingData && pricingData.minBaseSpAmount2 ? pricingData.minBaseSpAmount2 : 0,
      minBaseSpAmount3: pricingData && pricingData.minBaseSpAmount3 ? pricingData.minBaseSpAmount3 : 0,
      minBaseSpAmount4: pricingData && pricingData.minBaseSpAmount4 ? pricingData.minBaseSpAmount4 : 0,

      weekEndSpAmount: pricingData && pricingData.weekEndSpAmount ? pricingData.weekEndSpAmount : 0,
      weekEndMinBaseSpAmount: pricingData && pricingData.weekEndMinBaseSpAmount ? pricingData.weekEndMinBaseSpAmount : 0,
      weekEndMinBaseSpAmount2: pricingData && pricingData.weekEndMinBaseSpAmount2 ? pricingData.weekEndMinBaseSpAmount2 : 0,
      weekEndMinBaseSpAmount3: pricingData && pricingData.weekEndMinBaseSpAmount3 ? pricingData.weekEndMinBaseSpAmount3 : 0,
      weekEndMinBaseSpAmount4: pricingData && pricingData.weekEndMinBaseSpAmount4 ? pricingData.weekEndMinBaseSpAmount4 : 0,

      totalPrice: pricingData && pricingData.totalPrice ? pricingData.totalPrice : 0,
      minBaseTotalPrice: pricingData && pricingData.minBaseTotalPrice ? pricingData.minBaseTotalPrice : 0,
      minBaseTotalPrice2: pricingData && pricingData.minBaseTotalPrice2 ? pricingData.minBaseTotalPrice2 : 0,
      minBaseTotalPrice3: pricingData && pricingData.minBaseTotalPrice3 ? pricingData.minBaseTotalPrice3 : 0,
      minBaseTotalPrice4: pricingData && pricingData.minBaseTotalPrice4 ? pricingData.minBaseTotalPrice4 : 0,

      weekEndTotalPrice: pricingData && pricingData.weekEndTotalPrice ? pricingData.weekEndTotalPrice : 0,
      weekEndMinBaseTotalPrice: pricingData && pricingData.weekEndMinBaseTotalPrice ? pricingData.weekEndMinBaseTotalPrice : 0,
      weekEndMinBaseTotalPrice2: pricingData && pricingData.weekEndMinBaseTotalPrice2 ? pricingData.weekEndMinBaseTotalPrice2 : 0,
      weekEndMinBaseTotalPrice3: pricingData && pricingData.weekEndMinBaseTotalPrice3 ? pricingData.weekEndMinBaseTotalPrice3 : 0,
      weekEndMinBaseTotalPrice4: pricingData && pricingData.weekEndMinBaseTotalPrice4 ? pricingData.weekEndMinBaseTotalPrice4 : 0,

      wdTotalPrice: pricingData && pricingData.wdTotalPrice ? pricingData.wdTotalPrice : 0,
      minBaseWdTotalPrice: pricingData && pricingData.minBaseWdTotalPrice ? pricingData.minBaseWdTotalPrice : 0,
      minBaseWdTotalPrice2: pricingData && pricingData.minBaseWdTotalPrice2 ? pricingData.minBaseWdTotalPrice2 : 0,
      minBaseWdTotalPrice3: pricingData && pricingData.minBaseWdTotalPrice3 ? pricingData.minBaseWdTotalPrice3 : 0,
      minBaseWdTotalPrice4: pricingData && pricingData.minBaseWdTotalPrice4 ? pricingData.minBaseWdTotalPrice4 : 0,

      weekEndWdTotalPrice: pricingData && pricingData.weekEndWdTotalPrice ? pricingData.weekEndWdTotalPrice : 0,
      weekEndMinBaseWdTotalPrice: pricingData && pricingData.weekEndMinBaseWdTotalPrice ? pricingData.weekEndMinBaseWdTotalPrice : 0,
      weekEndMinBaseWdTotalPrice2: pricingData && pricingData.weekEndMinBaseWdTotalPrice2 ? pricingData.weekEndMinBaseWdTotalPrice2 : 0,
      weekEndMinBaseWdTotalPrice3: pricingData && pricingData.weekEndMinBaseWdTotalPrice3 ? pricingData.weekEndMinBaseWdTotalPrice3 : 0,
      weekEndMinBaseWdTotalPrice4: pricingData && pricingData.weekEndMinBaseWdTotalPrice4 ? pricingData.weekEndMinBaseWdTotalPrice4 : 0,
      demo: 1,
      // isCreateProperty: this.props.isCreateProperty === 'create' ? true : minBasecheck === true ? true : false,

      isCreateProperty: isPropertyCreate === 'create' ? true : (isMinBaseDefault ? true : isMinBaseDefaultInfocreate ? true : false),
      isDefaultBasePrice: isPropertyCreate === 'create' ? 'true' : isMinBaseDefault ? 'true' : isMinBaseDefaultInfocreate ? 'false' : 'true',
      isDefaultMinBasePrice: isPropertyCreate === 'create' ? 'true' : isMinBaseDefault ? 'true' : 'false',

      // isDefaultBasePrice: !isMinBaseDefault ? !isMinBaseDefaultInfocreate : 'false',
      // isDefaultMinBasePrice: !isMinBaseDefault,

      // isCreateProperty: this.props.isCreateProperty === 'create' ? true : minBasecheck === true ? true : isMinBaseDefaultInfocreate === 'true' ? true : false,
      // isDefaultBasePrice: this.props.isCreateProperty === 'create' ? true : minBasecheck === true ? true : isMinBaseDefaultInfocreate === 'true' ? true : false,
      // isDefaultMinBasePrice: this.props.isCreateProperty === 'create' ? true : minBasecheck === 'true' ? true : false,
      allowMidnight: '',
      modalIsOpen: false,
      isMidnightCheckOutAllowed: pricingData && pricingData.isMidnightCheckOutAllowed,
      checkDefaultMinBase: isMinBaseDefaultInfocreate === true && pricingData.minBasePriceUnit === '6<=>6 Hours' || '6 Hours' ? true : false,
      checkDefaultBillingType: isMinBaseDefault,
      shift: new Animated.Value(0),
      collapsed: true,
      collapsed2: false,
      collapsed3: true,
      CancelTimeError: '',
      fullRefundCancelTimeError:'',
      CancelPercentageError:'',
    };

    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};

    this.handlePriceUnit = this.handlePriceUnit.bind(this)
    this.handleCredentials = this.handleCredentials.bind(this)
    this.handlePrice = this.handlePrice.bind(this)
    this.handleWeekdayPrice = this.handleWeekdayPrice.bind(this)

    this.HandleWeekdayMinPrice = this.HandleWeekdayMinPrice.bind(this)
    this.HandleWeekdayMinPrice2 = this.HandleWeekdayMinPrice2.bind(this)
    this.HandleBasePriceCal = this.HandleBasePriceCal.bind(this)
    this.handleMinBasePrice1 = this.handleMinBasePrice1.bind(this)
    this.handleMinBasePrice2 = this.handleMinBasePrice2.bind(this)
    this.handleMinBasePrice3 = this.handleMinBasePrice3.bind(this)
    this.handleMinBasePrice4 = this.handleMinBasePrice4.bind(this)

    this.handleWeekEndPrice = this.handleWeekEndPrice.bind(this)
    this.HandleWeekEndBasePriceCal = this.HandleWeekEndBasePriceCal.bind(this)
    this.handleWeekEndMinBasePrice1 = this.handleWeekEndMinBasePrice1.bind(this)
    this.handleWeekEndMinBasePrice2 = this.handleWeekEndMinBasePrice2.bind(this)
    this.handleWeekEndMinBasePrice3 = this.handleWeekEndMinBasePrice3.bind(this)
    this.handleWeekEndMinBasePrice4 = this.handleWeekEndMinBasePrice4.bind(this)

    this.handleCommonchange = this.handleCommonchange.bind(this)
    this.handleSetstate = this.handleSetstate.bind(this)
    this.handleAllCal = this.handleAllCal.bind(this)

    this.handlePriceUnitValue = this.handlePriceUnitValue.bind(this)
    this.closeModal = this.closeModal.bind(this)

    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  componentWillMount() {
    AsyncStorage.getItem('authObj').then((value) => {
      let authObj = JSON.parse(value);
      this.setState({
        appPgPercentage: authObj && authObj.pgcInPercent ? authObj.pgcInPercent : 3,
        appPercentage: authObj && authObj.spServiceProviderId && authObj.spServiceProviderId.appPercentage ? parseInt(authObj.spServiceProviderId.appPercentage) : 0
      });
    });
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
  handleWeekdayPrice = (event) => {
    if (this.state.weekEndEdit) {
      this.HandleWeekdayMinPrice(event)
    } else {
      this.HandleWeekdayMinPrice2(event)
    }
  }

  async HandleWeekdayMinPrice(event) {
    if (this.state.minBasePriceUnit === '24<=>Per Day') {
      const basePrice = event
      let HandleBasePriceCal = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal1 = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal2 = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal3 = this.HandleBasePriceCal(basePrice)

      const weekEndbasePrice = event
      let HandleWeekEndBasePriceCal = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      let HandleWeekEndBasePriceCal1 = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      let HandleWeekEndBasePriceCal2 = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      let HandleWeekEndBasePriceCal3 = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      this.setState({
        errorMessage: '',
        // base price
        basePrice: basePrice,
        weekEndBasePrice: weekEndbasePrice,

        // min base price
        minBasePrice: event.length !== 0 ? basePrice : 0,
        minBasePrice2: event.length !== 0 ? basePrice : 0,
        minBasePrice3: event.length !== 0 ? basePrice : 0,
        minBasePrice4: event.length !== 0 ? basePrice : 0,

        weekEndMinBasePrice: event.length !== 0 ? weekEndbasePrice : 0,
        weekEndMinBasePrice2: event.length !== 0 ? weekEndbasePrice : 0,
        weekEndMinBasePrice3: event.length !== 0 ? weekEndbasePrice : 0,
        weekEndMinBasePrice4: event.length !== 0 ? weekEndbasePrice : 0,

        // discounts
        basePriceDiscount: event.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,
        basePriceDiscount1: event.length !== 0 ? HandleBasePriceCal1.basePriceDiscountCal : 0,
        basePriceDiscount2: event.length !== 0 ? HandleBasePriceCal2.basePriceDiscountCal : 0,
        basePriceDiscount3: event.length !== 0 ? HandleBasePriceCal3.basePriceDiscountCal : 0,
        basePriceDiscount4: event.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,

        weekEndbasePriceDiscount: event.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount4: event.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,

        // app charges
        appCharges: event.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,
        minBaseAppCharges: event.length !== 0 ? HandleBasePriceCal1.appPercentageCal : 0,
        minBaseAppCharges2: event.length !== 0 ? HandleBasePriceCal2.appPercentageCal : 0,
        minBaseAppCharges3: event.length !== 0 ? HandleBasePriceCal3.appPercentageCal : 0,
        minBaseAppCharges4: event.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,

        weekEndAppCharges: event.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,
        weekEndMinBaseAppCharges: event.length !== 0 ? HandleWeekEndBasePriceCal1.appPercentageCal : 0,
        weekEndMinBaseAppCharges2: event.length !== 0 ? HandleWeekEndBasePriceCal2.appPercentageCal : 0,
        weekEndMinBaseAppCharges3: event.length !== 0 ? HandleWeekEndBasePriceCal3.appPercentageCal : 0,
        weekEndMinBaseAppCharges4: event.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,

        // cgst amount
        cgstAmount: event.length !== 0 ? HandleBasePriceCal.cgstCal : 0,
        cgstAmount1: event.length !== 0 ? HandleBasePriceCal1.cgstCal : 0,
        cgstAmount2: event.length !== 0 ? HandleBasePriceCal2.cgstCal : 0,
        cgstAmount3: event.length !== 0 ? HandleBasePriceCal3.cgstCal : 0,
        cgstAmount4: event.length !== 0 ? HandleBasePriceCal.cgstCal : 0,

        weekEndcgstAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,
        weekEndcgstAmount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.cgstCal : 0,
        weekEndcgstAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.cgstCal : 0,
        weekEndcgstAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.cgstCal : 0,
        weekEndcgstAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,

        // sgst amount
        sgstAmount: event.length !== 0 ? HandleBasePriceCal.sgstCal : 0,
        sgstAmount1: event.length !== 0 ? HandleBasePriceCal1.sgstCal : 0,
        sgstAmount2: event.length !== 0 ? HandleBasePriceCal2.sgstCal : 0,
        sgstAmount3: event.length !== 0 ? HandleBasePriceCal3.sgstCal : 0,
        sgstAmount4: event.length !== 0 ? HandleBasePriceCal.sgstCal : 0,

        weekEndsgstAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,
        weekEndsgstAmount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.sgstCal : 0,
        weekEndsgstAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.sgstCal : 0,
        weekEndsgstAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.sgstCal : 0,
        weekEndsgstAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,

        // sp amount
        spAmount: event.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,
        minBaseSpAmount: event.length !== 0 ? HandleBasePriceCal1.SPUserPrice : 0,
        minBaseSpAmount2: event.length !== 0 ? HandleBasePriceCal2.SPUserPrice : 0,
        minBaseSpAmount3: event.length !== 0 ? HandleBasePriceCal3.SPUserPrice : 0,
        minBaseSpAmount4: event.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,

        weekEndSpAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,
        weekEndMinBaseSpAmount: event.length !== 0 ? HandleWeekEndBasePriceCal1.SPUserPrice : 0,
        weekEndMinBaseSpAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.SPUserPrice : 0,
        weekEndMinBaseSpAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.SPUserPrice : 0,
        weekEndMinBaseSpAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,

        // PG amount
        PGAmount: event.length !== 0 ? HandleBasePriceCal.paymentCal : 0,
        PGAmount1: event.length !== 0 ? HandleBasePriceCal1.paymentCal : 0,
        PGAmount2: event.length !== 0 ? HandleBasePriceCal2.paymentCal : 0,
        PGAmount3: event.length !== 0 ? HandleBasePriceCal3.paymentCal : 0,
        PGAmount4: event.length !== 0 ? HandleBasePriceCal.paymentCal : 0,

        weekEndPGAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,
        weekEndPGAmount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.paymentCal : 0,
        weekEndPGAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.paymentCal : 0,
        weekEndPGAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.paymentCal : 0,
        weekEndPGAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,

        // EDWithOutDiscountFinalPrice : event.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
        SPWithOutDiscountFinalPrice: event.length !== 0 ? HandleBasePriceCal.SPWithOutDiscountFinalPrice : 0,

        // with out discount EU amount
        wdTotalPrice: event.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice: event.length !== 0 ? HandleBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice2: event.length !== 0 ? HandleBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice3: event.length !== 0 ? HandleBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice4: event.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        weekEndWdTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice2: event.length !== 0 ? HandleWeekEndBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice3: event.length !== 0 ? HandleWeekEndBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice4: event.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        // EU total amount
        totalPrice: event.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,
        minBaseTotalPrice: event.length !== 0 ? HandleBasePriceCal1.EndUserPrice : 0,
        minBaseTotalPrice2: event.length !== 0 ? HandleBasePriceCal2.EndUserPrice : 0,
        minBaseTotalPrice3: event.length !== 0 ? HandleBasePriceCal3.EndUserPrice : 0,
        minBaseTotalPrice4: event.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,

        weekEndTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0,
        weekEndMinBaseTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal1.EndUserPrice : 0,
        weekEndMinBaseTotalPrice2: event.length !== 0 ? HandleWeekEndBasePriceCal2.EndUserPrice : 0,
        weekEndMinBaseTotalPrice3: event.length !== 0 ? HandleWeekEndBasePriceCal3.EndUserPrice : 0,
        weekEndMinBaseTotalPrice4: event.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0
      })
    } else {
      const basePrice = event
      const StringLength = basePrice.length
      const charfind = basePrice.charAt(0)
      let FirstChar = basePrice.length !== 0 ? charfind < 5 ? 1 : 5 : ''
      let FirstChar1 = basePrice.length > 2 ? parseInt(FirstChar + '0'.repeat(StringLength - 2)) : 0
      let minBasePrice = Math.ceil(basePrice / 100 * 50)
      let minBasePrice2 = Math.ceil(basePrice / 100 * 75)
      let minBasePrice3 = Math.ceil(basePrice / 100 * 90)

      let HandleBasePriceCal = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal1 = this.HandleBasePriceCal(minBasePrice)
      let HandleBasePriceCal2 = this.HandleBasePriceCal(minBasePrice2)
      let HandleBasePriceCal3 = this.HandleBasePriceCal(minBasePrice3)

      let HandleWeekEndBasePriceCal = this.HandleWeekEndBasePriceCal(basePrice)
      let HandleWeekEndBasePriceCal1 = this.HandleWeekEndBasePriceCal(minBasePrice)
      let HandleWeekEndBasePriceCal2 = this.HandleWeekEndBasePriceCal(minBasePrice2)
      let HandleWeekEndBasePriceCal3 = this.HandleWeekEndBasePriceCal(minBasePrice3)
      this.setState({
        errorMessage: '',

        // base price
        basePrice: basePrice,
        weekEndBasePrice: basePrice,

        // min base price
        minBasePrice: event.length !== 0 ? minBasePrice : 0,
        minBasePrice2: event.length !== 0 ? minBasePrice2 : 0,
        minBasePrice3: event.length !== 0 ? minBasePrice3 : 0,
        minBasePrice4: event.length !== 0 ? basePrice : 0,

        weekEndMinBasePrice: event.length !== 0 ? minBasePrice : 0,
        weekEndMinBasePrice2: event.length !== 0 ? minBasePrice2 : 0,
        weekEndMinBasePrice3: event.length !== 0 ? minBasePrice3 : 0,
        weekEndMinBasePrice4: event.length !== 0 ? basePrice : 0,

        // discounts
        basePriceDiscount: event.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,
        basePriceDiscount1: event.length !== 0 ? HandleBasePriceCal1.basePriceDiscountCal : 0,
        basePriceDiscount2: event.length !== 0 ? HandleBasePriceCal2.basePriceDiscountCal : 0,
        basePriceDiscount3: event.length !== 0 ? HandleBasePriceCal3.basePriceDiscountCal : 0,
        basePriceDiscount4: event.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,

        weekEndbasePriceDiscount: event.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount4: event.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,

        // app charges
        appCharges: event.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,
        minBaseAppCharges: event.length !== 0 ? HandleBasePriceCal1.appPercentageCal : 0,
        minBaseAppCharges2: event.length !== 0 ? HandleBasePriceCal2.appPercentageCal : 0,
        minBaseAppCharges3: event.length !== 0 ? HandleBasePriceCal3.appPercentageCal : 0,
        minBaseAppCharges4: event.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,

        weekEndAppCharges: event.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,
        weekEndMinBaseAppCharges: event.length !== 0 ? HandleWeekEndBasePriceCal1.appPercentageCal : 0,
        weekEndMinBaseAppCharges2: event.length !== 0 ? HandleWeekEndBasePriceCal2.appPercentageCal : 0,
        weekEndMinBaseAppCharges3: event.length !== 0 ? HandleWeekEndBasePriceCal3.appPercentageCal : 0,
        weekEndMinBaseAppCharges4: event.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,

        // cgst amount
        cgstAmount: event.length !== 0 ? HandleBasePriceCal.cgstCal : 0,
        cgstAmount1: event.length !== 0 ? HandleBasePriceCal1.cgstCal : 0,
        cgstAmount2: event.length !== 0 ? HandleBasePriceCal2.cgstCal : 0,
        cgstAmount3: event.length !== 0 ? HandleBasePriceCal3.cgstCal : 0,
        cgstAmount4: event.length !== 0 ? HandleBasePriceCal.cgstCal : 0,

        weekEndcgstAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,
        weekEndcgstAmount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.cgstCal : 0,
        weekEndcgstAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.cgstCal : 0,
        weekEndcgstAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.cgstCal : 0,
        weekEndcgstAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,

        // sgst amount
        sgstAmount: event.length !== 0 ? HandleBasePriceCal.sgstCal : 0,
        sgstAmount1: event.length !== 0 ? HandleBasePriceCal1.sgstCal : 0,
        sgstAmount2: event.length !== 0 ? HandleBasePriceCal2.sgstCal : 0,
        sgstAmount3: event.length !== 0 ? HandleBasePriceCal3.sgstCal : 0,
        sgstAmount4: event.length !== 0 ? HandleBasePriceCal.sgstCal : 0,

        weekEndsgstAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,
        weekEndsgstAmount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.sgstCal : 0,
        weekEndsgstAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.sgstCal : 0,
        weekEndsgstAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.sgstCal : 0,
        weekEndsgstAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,

        // sp amount
        spAmount: event.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,
        minBaseSpAmount: event.length !== 0 ? HandleBasePriceCal1.SPUserPrice : 0,
        minBaseSpAmount2: event.length !== 0 ? HandleBasePriceCal2.SPUserPrice : 0,
        minBaseSpAmount3: event.length !== 0 ? HandleBasePriceCal3.SPUserPrice : 0,
        minBaseSpAmount4: event.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,

        weekEndSpAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,
        weekEndMinBaseSpAmount: event.length !== 0 ? HandleWeekEndBasePriceCal1.SPUserPrice : 0,
        weekEndMinBaseSpAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.SPUserPrice : 0,
        weekEndMinBaseSpAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.SPUserPrice : 0,
        weekEndMinBaseSpAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,

        // PG amount
        PGAmount: event.length !== 0 ? HandleBasePriceCal.paymentCal : 0,
        PGAmount1: event.length !== 0 ? HandleBasePriceCal1.paymentCal : 0,
        PGAmount2: event.length !== 0 ? HandleBasePriceCal2.paymentCal : 0,
        PGAmount3: event.length !== 0 ? HandleBasePriceCal3.paymentCal : 0,
        PGAmount4: event.length !== 0 ? HandleBasePriceCal.paymentCal : 0,

        weekEndPGAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,
        weekEndPGAmount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.paymentCal : 0,
        weekEndPGAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.paymentCal : 0,
        weekEndPGAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.paymentCal : 0,
        weekEndPGAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,

        // EDWithOutDiscountFinalPrice : event.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
        SPWithOutDiscountFinalPrice: event.length !== 0 ? HandleBasePriceCal.SPWithOutDiscountFinalPrice : 0,

        // with out discount EU amount
        wdTotalPrice: event.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice: event.length !== 0 ? HandleBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice2: event.length !== 0 ? HandleBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice3: event.length !== 0 ? HandleBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice4: event.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        weekEndWdTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice2: event.length !== 0 ? HandleWeekEndBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice3: event.length !== 0 ? HandleWeekEndBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice4: event.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        // EU total amount
        totalPrice: event.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,
        minBaseTotalPrice: event.length !== 0 ? HandleBasePriceCal1.EndUserPrice : 0,
        minBaseTotalPrice2: event.length !== 0 ? HandleBasePriceCal2.EndUserPrice : 0,
        minBaseTotalPrice3: event.length !== 0 ? HandleBasePriceCal3.EndUserPrice : 0,
        minBaseTotalPrice4: event.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,

        weekEndTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0,
        weekEndMinBaseTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal1.EndUserPrice : 0,
        weekEndMinBaseTotalPrice2: event.length !== 0 ? HandleWeekEndBasePriceCal2.EndUserPrice : 0,
        weekEndMinBaseTotalPrice3: event.length !== 0 ? HandleWeekEndBasePriceCal3.EndUserPrice : 0,
        weekEndMinBaseTotalPrice4: event.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0
      })
    }
  }
  HandleWeekdayMinPrice2(event) {
    if (this.state.minBasePriceUnit === '24<=>Per Day') {
      const basePrice = event
      let HandleBasePriceCal = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal1 = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal2 = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal3 = this.HandleBasePriceCal(basePrice)

      this.setState({
        errorMessage: '',
        // base price
        basePrice: basePrice,
        // weekEndBasePrice: weekEndbasePrice,

        // min base price
        minBasePrice: event.length !== 0 ? basePrice : 0,
        minBasePrice2: event.length !== 0 ? basePrice : 0,
        minBasePrice3: event.length !== 0 ? basePrice : 0,
        minBasePrice4: event.length !== 0 ? basePrice : 0,

        // discounts
        basePriceDiscount: event.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,
        basePriceDiscount1: event.length !== 0 ? HandleBasePriceCal1.basePriceDiscountCal : 0,
        basePriceDiscount2: event.length !== 0 ? HandleBasePriceCal2.basePriceDiscountCal : 0,
        basePriceDiscount3: event.length !== 0 ? HandleBasePriceCal3.basePriceDiscountCal : 0,
        basePriceDiscount4: event.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,

        // app charges
        appCharges: event.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,
        minBaseAppCharges: event.length !== 0 ? HandleBasePriceCal1.appPercentageCal : 0,
        minBaseAppCharges2: event.length !== 0 ? HandleBasePriceCal2.appPercentageCal : 0,
        minBaseAppCharges3: event.length !== 0 ? HandleBasePriceCal3.appPercentageCal : 0,
        minBaseAppCharges4: event.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,

        // cgst amount
        cgstAmount: event.length !== 0 ? HandleBasePriceCal.cgstCal : 0,
        cgstAmount1: event.length !== 0 ? HandleBasePriceCal1.cgstCal : 0,
        cgstAmount2: event.length !== 0 ? HandleBasePriceCal2.cgstCal : 0,
        cgstAmount3: event.length !== 0 ? HandleBasePriceCal3.cgstCal : 0,
        cgstAmount4: event.length !== 0 ? HandleBasePriceCal.cgstCal : 0,

        // sgst amount
        sgstAmount: event.length !== 0 ? HandleBasePriceCal.sgstCal : 0,
        sgstAmount1: event.length !== 0 ? HandleBasePriceCal1.sgstCal : 0,
        sgstAmount2: event.length !== 0 ? HandleBasePriceCal2.sgstCal : 0,
        sgstAmount3: event.length !== 0 ? HandleBasePriceCal3.sgstCal : 0,
        sgstAmount4: event.length !== 0 ? HandleBasePriceCal.sgstCal : 0,

        // sp amount
        spAmount: event.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,
        minBaseSpAmount: event.length !== 0 ? HandleBasePriceCal1.SPUserPrice : 0,
        minBaseSpAmount2: event.length !== 0 ? HandleBasePriceCal2.SPUserPrice : 0,
        minBaseSpAmount3: event.length !== 0 ? HandleBasePriceCal3.SPUserPrice : 0,
        minBaseSpAmount4: event.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,

        // PG amount
        PGAmount: event.length !== 0 ? HandleBasePriceCal.paymentCal : 0,
        PGAmount1: event.length !== 0 ? HandleBasePriceCal1.paymentCal : 0,
        PGAmount2: event.length !== 0 ? HandleBasePriceCal2.paymentCal : 0,
        PGAmount3: event.length !== 0 ? HandleBasePriceCal3.paymentCal : 0,
        PGAmount4: event.length !== 0 ? HandleBasePriceCal.paymentCal : 0,

        // with out discount EU amount
        wdTotalPrice: event.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice: event.length !== 0 ? HandleBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice2: event.length !== 0 ? HandleBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice3: event.length !== 0 ? HandleBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice4: event.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        // EU total amount
        totalPrice: event.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,
        minBaseTotalPrice: event.length !== 0 ? HandleBasePriceCal1.EndUserPrice : 0,
        minBaseTotalPrice2: event.length !== 0 ? HandleBasePriceCal2.EndUserPrice : 0,
        minBaseTotalPrice3: event.length !== 0 ? HandleBasePriceCal3.EndUserPrice : 0,
        minBaseTotalPrice4: event.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0
      })
    } else {
      const basePrice = event
      const StringLength = basePrice.length
      const charfind = basePrice.charAt(0)
      let FirstChar = basePrice.length !== 0 ? charfind < 5 ? 1 : 5 : ''
      let FirstChar1 = basePrice.length > 2 ? parseInt(FirstChar + '0'.repeat(StringLength - 2)) : 0
      let minBasePrice = Math.ceil(basePrice / 100 * 50)
      let minBasePrice2 = Math.ceil(basePrice / 100 * 75)
      let minBasePrice3 = Math.ceil(basePrice / 100 * 90)
      // let minBasePrice = Math.ceil((basePrice / 4) * 1 + FirstChar1)
      // let minBasePrice2 = Math.ceil((basePrice / 4) * 2 + FirstChar1)
      // let minBasePrice3 = Math.ceil((basePrice / 4) * 3 + FirstChar1)
      let HandleBasePriceCal = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal1 = this.HandleBasePriceCal(minBasePrice)
      let HandleBasePriceCal2 = this.HandleBasePriceCal(minBasePrice2)
      let HandleBasePriceCal3 = this.HandleBasePriceCal(minBasePrice3)
      this.setState({
        errorMessage: '',
        basePrice: basePrice,
        minBasePrice: event.length !== 0 ? minBasePrice : 0,
        minBasePrice2: event.length !== 0 ? minBasePrice2 : 0,
        minBasePrice3: event.length !== 0 ? minBasePrice3 : 0,
        minBasePrice4: event.length !== 0 ? basePrice : 0,

        basePriceDiscount: event.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,
        basePriceDiscount1: event.length !== 0 ? HandleBasePriceCal1.basePriceDiscountCal : 0,
        basePriceDiscount2: event.length !== 0 ? HandleBasePriceCal2.basePriceDiscountCal : 0,
        basePriceDiscount3: event.length !== 0 ? HandleBasePriceCal3.basePriceDiscountCal : 0,
        basePriceDiscount4: event.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,

        appCharges: event.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,
        minBaseAppCharges: event.length !== 0 ? HandleBasePriceCal1.appPercentageCal : 0,
        minBaseAppCharges2: event.length !== 0 ? HandleBasePriceCal2.appPercentageCal : 0,
        minBaseAppCharges3: event.length !== 0 ? HandleBasePriceCal3.appPercentageCal : 0,
        minBaseAppCharges4: event.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,

        cgstAmount: event.length !== 0 ? HandleBasePriceCal.cgstCal : 0,
        cgstAmount1: event.length !== 0 ? HandleBasePriceCal1.cgstCal : 0,
        cgstAmount2: event.length !== 0 ? HandleBasePriceCal2.cgstCal : 0,
        cgstAmount3: event.length !== 0 ? HandleBasePriceCal3.cgstCal : 0,
        cgstAmount4: event.length !== 0 ? HandleBasePriceCal.cgstCal : 0,

        sgstAmount: event.length !== 0 ? HandleBasePriceCal.sgstCal : 0,
        sgstAmount1: event.length !== 0 ? HandleBasePriceCal1.sgstCal : 0,
        sgstAmount2: event.length !== 0 ? HandleBasePriceCal2.sgstCal : 0,
        sgstAmount3: event.length !== 0 ? HandleBasePriceCal3.sgstCal : 0,
        sgstAmount4: event.length !== 0 ? HandleBasePriceCal.sgstCal : 0,

        spAmount: event.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,
        minBaseSpAmount: event.length !== 0 ? HandleBasePriceCal1.SPUserPrice : 0,
        minBaseSpAmount2: event.length !== 0 ? HandleBasePriceCal2.SPUserPrice : 0,
        minBaseSpAmount3: event.length !== 0 ? HandleBasePriceCal3.SPUserPrice : 0,
        minBaseSpAmount4: event.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,

        PGAmount: event.length !== 0 ? HandleBasePriceCal.paymentCal : 0,
        PGAmount1: event.length !== 0 ? HandleBasePriceCal1.paymentCal : 0,
        PGAmount2: event.length !== 0 ? HandleBasePriceCal2.paymentCal : 0,
        PGAmount3: event.length !== 0 ? HandleBasePriceCal3.paymentCal : 0,
        PGAmount4: event.length !== 0 ? HandleBasePriceCal.paymentCal : 0,

        wdTotalPrice: event.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice: event.length !== 0 ? HandleBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice2: event.length !== 0 ? HandleBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice3: event.length !== 0 ? HandleBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice4: event.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        totalPrice: event.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,
        minBaseTotalPrice: event.length !== 0 ? HandleBasePriceCal1.EndUserPrice : 0,
        minBaseTotalPrice2: event.length !== 0 ? HandleBasePriceCal2.EndUserPrice : 0,
        minBaseTotalPrice3: event.length !== 0 ? HandleBasePriceCal3.EndUserPrice : 0,
        minBaseTotalPrice4: event.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0
      })
    }
  }
  HandleBasePriceCal(basePrice) {
    const basePriceDiscountCal = Math.floor(basePrice / 100 * this.state.weekdayDiscount) // discount for base price
    const discountCal = basePrice - basePriceDiscountCal // price after baseprice - discount price
    const appPercentageCal = Math.ceil(basePrice / 100 * this.state.appPercentage)
    const cgstCal = Math.ceil(discountCal / 100 * (this.state.cgstPercentage))
    const sgstCal = Math.ceil(discountCal / 100 * (this.state.sgstPercentage))
    const gstWithCal = discountCal / 100 * (parseInt(this.state.cgstPercentage) + parseInt(this.state.sgstPercentage))
    const gstwithOutCal = basePrice / 100 * (this.state.cgstPercentage + this.state.sgstPercentage)
    // change
    const finalPrice = Math.ceil(((discountCal + Math.ceil(this.state.serviceCharges)) + (this.state.otherCharges + gstWithCal)) + appPercentageCal)
    const paymentCal = Math.ceil(finalPrice / 100 * this.state.appPgPercentage)
    const EndUserPrice = Math.ceil((finalPrice + paymentCal))
    const SPUserPrice = Math.floor((parseInt(EndUserPrice) - parseInt(paymentCal)) - parseInt(appPercentageCal))
    const withOutDiscountPrice = parseInt(basePrice) + parseInt(this.state.serviceCharges) + parseInt(this.state.otherCharges) + parseInt(gstwithOutCal) + parseInt(appPercentageCal)
    const paymentDisCal = Math.ceil(withOutDiscountPrice / 100 * this.state.appPgPercentage)
    const EDWithOutDiscountFinalPrice = Math.ceil(withOutDiscountPrice + paymentDisCal)
    const SPWithOutDiscountFinalPrice = parseInt(EDWithOutDiscountFinalPrice) - parseInt(paymentCal) - parseInt(appPercentageCal)
    return { basePriceDiscountCal, appPercentageCal, cgstCal, sgstCal, SPUserPrice, paymentCal, SPWithOutDiscountFinalPrice, EDWithOutDiscountFinalPrice, EndUserPrice }
  }

  handleMinBasePrice1(event) {
    let handleMinBasePrice1 = this.HandleBasePriceCal(event)
    this.setState({
      errorMessage: '',
      minBasePrice: event.length !== 0 ? event : '',
      basePriceDiscount1: event.length !== 0 ? handleMinBasePrice1.basePriceDiscountCal : 0,
      minBaseAppCharges: event.length !== 0 ? handleMinBasePrice1.appPercentageCal : 0,
      cgstAmount1: event.length !== 0 ? handleMinBasePrice1.cgstCal : 0,
      sgstAmount1: event.length !== 0 ? handleMinBasePrice1.sgstCal : 0,
      minBaseSpAmount: event.length !== 0 ? handleMinBasePrice1.SPUserPrice : 0,
      PGAmount1: event.length !== 0 ? handleMinBasePrice1.paymentCal : 0,
      // EDWithOutDiscountFinalPrice : event.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
      SPWithOutDiscountFinalPrice: event.length !== 0 ? handleMinBasePrice1.SPWithOutDiscountFinalPrice : 0,
      minBaseWdTotalPrice: event.length !== 0 ? handleMinBasePrice1.EDWithOutDiscountFinalPrice : 0,
      minBaseTotalPrice: event.length !== 0 ? handleMinBasePrice1.EndUserPrice : 0
    })
  }

  handleMinBasePrice2(event) {
    let handleMinBasePrice2 = this.HandleBasePriceCal(event)
    this.setState({
      errorMessage: '',
      minBasePrice2: event.length !== 0 ? event : '',
      basePriceDiscount2: event.length !== 0 ? handleMinBasePrice2.basePriceDiscountCal : 0,
      minBaseAppCharges2: event.length !== 0 ? handleMinBasePrice2.appPercentageCal : 0,
      cgstAmount2: event.length !== 0 ? handleMinBasePrice2.cgstCal : 0,
      sgstAmount2: event.length !== 0 ? handleMinBasePrice2.sgstCal : 0,
      minBaseSpAmount2: event.length !== 0 ? handleMinBasePrice2.SPUserPrice : 0,
      PGAmount2: event.length !== 0 ? handleMinBasePrice2.paymentCal : 0,
      // EDWithOutDiscountFinalPrice : event.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
      SPWithOutDiscountFinalPrice: event.length !== 0 ? handleMinBasePrice2.SPWithOutDiscountFinalPrice : 0,
      minBaseWdTotalPrice2: event.length !== 0 ? handleMinBasePrice2.EDWithOutDiscountFinalPrice : 0,
      minBaseTotalPrice2: event.length !== 0 ? handleMinBasePrice2.EndUserPrice : 0
    })
  }

  handleMinBasePrice3(event) {
    let handleMinBasePrice3 = this.HandleBasePriceCal(event)
    this.setState({
      errorMessage: '',
      minBasePrice3: event.length !== 0 ? event : '',
      basePriceDiscount3: event.length !== 0 ? handleMinBasePrice3.basePriceDiscountCal : 0,
      minBaseAppCharges3: event.length !== 0 ? handleMinBasePrice3.appPercentageCal : 0,
      cgstAmount3: event.length !== 0 ? handleMinBasePrice3.cgstCal : 0,
      sgstAmount3: event.length !== 0 ? handleMinBasePrice3.sgstCal : 0,
      minBaseSpAmount3: event.length !== 0 ? handleMinBasePrice3.SPUserPrice : 0,
      PGAmount3: event.length !== 0 ? handleMinBasePrice3.paymentCal : 0,
      // EDWithOutDiscountFinalPrice : event.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
      SPWithOutDiscountFinalPrice: event.length !== 0 ? handleMinBasePrice3.SPWithOutDiscountFinalPrice : 0,
      minBaseWdTotalPrice3: event.length !== 0 ? handleMinBasePrice3.EDWithOutDiscountFinalPrice : 0,
      minBaseTotalPrice3: event.length !== 0 ? handleMinBasePrice3.EndUserPrice : 0
    })
  }

  handleMinBasePrice4(event) {
    let handleMinBasePrice4 = this.HandleBasePriceCal(event)
    this.setState({
      errorMessage: '',
      minBasePrice4: event.length !== 0 ? event : '',
      basePriceDiscount4: event.length !== 0 ? handleMinBasePrice4.basePriceDiscountCal : 0,
      minBaseAppCharges4: event.length !== 0 ? handleMinBasePrice4.appPercentageCal : 0,
      cgstAmount4: event.length !== 0 ? handleMinBasePrice4.cgstCal : 0,
      sgstAmount4: event.length !== 0 ? handleMinBasePrice4.sgstCal : 0,
      minBaseSpAmount4: event.length !== 0 ? handleMinBasePrice4.SPUserPrice : 0,
      PGAmount4: event.length !== 0 ? handleMinBasePrice4.paymentCal : 0,
      // EDWithOutDiscountFinalPrice : event.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
      SPWithOutDiscountFinalPrice: event.length !== 0 ? handleMinBasePrice4.SPWithOutDiscountFinalPrice : 0,
      minBaseWdTotalPrice4: event.length !== 0 ? handleMinBasePrice4.EDWithOutDiscountFinalPrice : 0,
      minBaseTotalPrice4: event.length !== 0 ? handleMinBasePrice4.EndUserPrice : 0
    })
  }

  handleWeekEndPrice = (event) => {
    if (this.state.minBasePriceUnit === '24<=>Per Day') {

      const weekEndbasePrice = event
      let HandleWeekEndBasePriceCal = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      let HandleWeekEndBasePriceCal1 = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      let HandleWeekEndBasePriceCal2 = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      let HandleWeekEndBasePriceCal3 = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      this.setState({
        errorMessage: '',
        // base price
        // basePrice: basePrice,
        weekEndBasePrice: weekEndbasePrice,

        weekEndMinBasePrice: event.length !== 0 ? weekEndbasePrice : 0,
        weekEndMinBasePrice2: event.length !== 0 ? weekEndbasePrice : 0,
        weekEndMinBasePrice3: event.length !== 0 ? weekEndbasePrice : 0,
        weekEndMinBasePrice4: event.length !== 0 ? weekEndbasePrice : 0,

        weekEndbasePriceDiscount: event.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount4: event.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,

        weekEndAppCharges: event.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,
        weekEndMinBaseAppCharges: event.length !== 0 ? HandleWeekEndBasePriceCal1.appPercentageCal : 0,
        weekEndMinBaseAppCharges2: event.length !== 0 ? HandleWeekEndBasePriceCal2.appPercentageCal : 0,
        weekEndMinBaseAppCharges3: event.length !== 0 ? HandleWeekEndBasePriceCal3.appPercentageCal : 0,
        weekEndMinBaseAppCharges4: event.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,

        weekEndcgstAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,
        weekEndcgstAmount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.cgstCal : 0,
        weekEndcgstAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.cgstCal : 0,
        weekEndcgstAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.cgstCal : 0,
        weekEndcgstAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,

        weekEndsgstAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,
        weekEndsgstAmount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.sgstCal : 0,
        weekEndsgstAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.sgstCal : 0,
        weekEndsgstAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.sgstCal : 0,
        weekEndsgstAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,

        weekEndSpAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,
        weekEndMinBaseSpAmount: event.length !== 0 ? HandleWeekEndBasePriceCal1.SPUserPrice : 0,
        weekEndMinBaseSpAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.SPUserPrice : 0,
        weekEndMinBaseSpAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.SPUserPrice : 0,
        weekEndMinBaseSpAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,

        weekEndPGAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,
        weekEndPGAmount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.paymentCal : 0,
        weekEndPGAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.paymentCal : 0,
        weekEndPGAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.paymentCal : 0,
        weekEndPGAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,

        weekEndWdTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice2: event.length !== 0 ? HandleWeekEndBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice3: event.length !== 0 ? HandleWeekEndBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice4: event.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        weekEndTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0,
        weekEndMinBaseTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal1.EndUserPrice : 0,
        weekEndMinBaseTotalPrice2: event.length !== 0 ? HandleWeekEndBasePriceCal2.EndUserPrice : 0,
        weekEndMinBaseTotalPrice3: event.length !== 0 ? HandleWeekEndBasePriceCal3.EndUserPrice : 0,
        weekEndMinBaseTotalPrice4: event.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0
      })
    } else {
      const weekEndBasePrice = event
      const StringLength = weekEndBasePrice.length
      const charfind = weekEndBasePrice.charAt(0)
      let FirstChar = weekEndBasePrice.length !== 0 ? charfind < 5 ? 1 : 5 : ''
      let FirstChar1 = weekEndBasePrice.length > 2 ? parseInt(FirstChar + '0'.repeat(StringLength - 2)) : 0
      // let weekEndMinBasePrice = Math.ceil((weekEndBasePrice / 4) * 1 + FirstChar1)
      // let weekEndMinBasePrice2 = Math.ceil((weekEndBasePrice / 4) * 2 + FirstChar1)
      // let weekEndMinBasePrice3 = Math.ceil((weekEndBasePrice / 4) * 3 + FirstChar1)
      let weekEndMinBasePrice = Math.ceil(weekEndBasePrice / 100 * 50)
      let weekEndMinBasePrice2 = Math.ceil(weekEndBasePrice / 100 * 75)
      let weekEndMinBasePrice3 = Math.ceil(weekEndBasePrice / 100 * 90)

      let HandleWeekEndBasePriceCal = this.HandleWeekEndBasePriceCal(weekEndBasePrice)
      let HandleWeekEndBasePriceCal1 = this.HandleWeekEndBasePriceCal(weekEndMinBasePrice)
      let HandleWeekEndBasePriceCal2 = this.HandleWeekEndBasePriceCal(weekEndMinBasePrice2)
      let HandleWeekEndBasePriceCal3 = this.HandleWeekEndBasePriceCal(weekEndMinBasePrice3)

      this.setState({
        errorMessage: '',
        weekEndEdit: event.length !== 0 ? false : true,

        weekEndBasePrice: weekEndBasePrice,
        weekEndMinBasePrice: event.length !== 0 ? weekEndMinBasePrice : 0,
        weekEndMinBasePrice2: event.length !== 0 ? weekEndMinBasePrice2 : 0,
        weekEndMinBasePrice3: event.length !== 0 ? weekEndMinBasePrice3 : 0,
        weekEndMinBasePrice4: event.length !== 0 ? weekEndBasePrice : 0,

        weekEndbasePriceDiscount: event.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount4: event.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,

        weekEndAppCharges: event.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,
        weekEndMinBaseAppCharges: event.length !== 0 ? HandleWeekEndBasePriceCal1.appPercentageCal : 0,
        weekEndMinBaseAppCharges2: event.length !== 0 ? HandleWeekEndBasePriceCal2.appPercentageCal : 0,
        weekEndMinBaseAppCharges3: event.length !== 0 ? HandleWeekEndBasePriceCal3.appPercentageCal : 0,
        weekEndMinBaseAppCharges4: event.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,

        weekEndcgstAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,
        weekEndcgstAmount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.cgstCal : 0,
        weekEndcgstAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.cgstCal : 0,
        weekEndcgstAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.cgstCal : 0,
        weekEndcgstAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,

        weekEndsgstAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,
        weekEndsgstAmount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.sgstCal : 0,
        weekEndsgstAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.sgstCal : 0,
        weekEndsgstAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.sgstCal : 0,
        weekEndsgstAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,

        weekEndSpAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,
        weekEndMinBaseSpAmount: event.length !== 0 ? HandleWeekEndBasePriceCal1.SPUserPrice : 0,
        weekEndMinBaseSpAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.SPUserPrice : 0,
        weekEndMinBaseSpAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.SPUserPrice : 0,
        weekEndMinBaseSpAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,

        weekEndPGAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,
        weekEndPGAmount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.paymentCal : 0,
        weekEndPGAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.paymentCal : 0,
        weekEndPGAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.paymentCal : 0,
        weekEndPGAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,

        weekEndWdTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice2: event.length !== 0 ? HandleWeekEndBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice3: event.length !== 0 ? HandleWeekEndBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice4: event.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        weekEndTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0,
        weekEndMinBaseTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal1.EndUserPrice : 0,
        weekEndMinBaseTotalPrice2: event.length !== 0 ? HandleWeekEndBasePriceCal2.EndUserPrice : 0,
        weekEndMinBaseTotalPrice3: event.length !== 0 ? HandleWeekEndBasePriceCal3.EndUserPrice : 0,
        weekEndMinBaseTotalPrice4: event.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0
      })
    }
  }
  HandleWeekEndBasePriceCal(weekEndBasePrice) {
    const basePriceDiscountCal = Math.floor(weekEndBasePrice / 100 * this.state.weekEndDiscount) // discount for base price
    const discountCal = weekEndBasePrice - basePriceDiscountCal
    const appPercentageCal = Math.ceil(weekEndBasePrice / 100 * this.state.appPercentage)
    const cgstCal = Math.ceil(discountCal / 100 * (this.state.cgstPercentage))
    const sgstCal = Math.ceil(discountCal / 100 * (this.state.sgstPercentage))
    const gstWithCal = Math.ceil(discountCal / 100 * (parseInt(this.state.cgstPercentage) + parseInt(this.state.sgstPercentage)))
    const gstwithOutCal = weekEndBasePrice / 100 * (this.state.cgstPercentage + this.state.sgstPercentage)
    const finalPrice = discountCal + this.state.serviceCharges + this.state.otherCharges + gstWithCal + appPercentageCal
    const paymentCal = Math.ceil(finalPrice / 100 * this.state.appPgPercentage)
    const EndUserPrice = Math.ceil(finalPrice + paymentCal)
    const SPUserPrice = Math.ceil((parseInt(EndUserPrice) - parseInt(paymentCal)) - parseInt(appPercentageCal))
    const withOutDiscountPrice = parseInt(weekEndBasePrice) + parseInt(this.state.serviceCharges) + parseInt(this.state.otherCharges) + parseInt(gstwithOutCal) + parseInt(appPercentageCal)
    const paymentDisCal = Math.ceil(withOutDiscountPrice / 100 * this.state.appPgPercentage)
    const EDWithOutDiscountFinalPrice = Math.ceil(withOutDiscountPrice + paymentDisCal)
    const SPWithOutDiscountFinalPrice = parseInt(EDWithOutDiscountFinalPrice) - parseInt(paymentCal) - parseInt(appPercentageCal)
    return { basePriceDiscountCal, appPercentageCal, cgstCal, sgstCal, SPUserPrice, paymentCal, SPWithOutDiscountFinalPrice, EDWithOutDiscountFinalPrice, EndUserPrice }
  }

  handleWeekEndMinBasePrice1(weekEndBasePrice) {
    let handleWeekEndMinBasePrice1 = this.HandleWeekEndBasePriceCal(weekEndBasePrice)
    this.setState({
      errorMessage: '',
      weekEndEdit: weekEndBasePrice.length !== 0 ? false : true,
      weekEndMinBasePrice: weekEndBasePrice.length !== 0 ? weekEndBasePrice : '',
      weekEndbasePriceDiscount1: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice1.basePriceDiscountCal : 0,
      weekEndMinBaseAppCharges: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice1.appPercentageCal : 0,
      weekEndcgstAmount1: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice1.cgstCal : 0,
      weekEndsgstAmount1: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice1.sgstCal : 0,
      weekEndMinBaseSpAmount: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice1.SPUserPrice : 0,
      weekEndPGAmount1: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice1.paymentCal : 0,
      weekEndMinBaseWdTotalPrice: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice1.EDWithOutDiscountFinalPrice : 0,
      weekEndMinBaseTotalPrice: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice1.EndUserPrice : 0,
    })
  }

  handleWeekEndMinBasePrice2(weekEndBasePrice) {
    let handleWeekEndMinBasePrice2 = this.HandleWeekEndBasePriceCal(weekEndBasePrice)
    this.setState({
      errorMessage: '',
      weekEndEdit: weekEndBasePrice.length !== 0 ? false : true,
      weekEndMinBasePrice2: weekEndBasePrice.length !== 0 ? weekEndBasePrice : '',
      weekEndbasePriceDiscount2: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice2.basePriceDiscountCal : 0,
      weekEndMinBaseAppCharges2: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice2.appPercentageCal : 0,
      weekEndcgstAmount2: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice2.cgstCal : 0,
      weekEndsgstAmount2: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice2.sgstCal : 0,
      weekEndMinBaseSpAmount2: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice2.SPUserPrice : 0,
      weekEndPGAmount2: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice2.paymentCal : 0,
      weekEndMinBaseWdTotalPrice2: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice2.EDWithOutDiscountFinalPrice : 0,
      weekEndMinBaseTotalPrice2: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice2.EndUserPrice : 0,
    })
  }

  handleWeekEndMinBasePrice3(weekEndBasePrice) {
    let handleWeekEndMinBasePrice3 = this.HandleWeekEndBasePriceCal(weekEndBasePrice)
    this.setState({
      errorMessage: '',
      weekEndEdit: weekEndBasePrice.length !== 0 ? false : true,
      weekEndMinBasePrice3: weekEndBasePrice.length !== 0 ? weekEndBasePrice : '',
      weekEndbasePriceDiscount3: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice3.basePriceDiscountCal : 0,
      weekEndMinBaseAppCharges3: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice3.appPercentageCal : 0,
      weekEndcgstAmount3: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice3.cgstCal : 0,
      weekEndsgstAmount3: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice3.sgstCal : 0,
      weekEndMinBaseSpAmount3: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice3.SPUserPrice : 0,
      weekEndPGAmount3: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice3.paymentCal : 0,
      weekEndMinBaseWdTotalPrice3: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice3.EDWithOutDiscountFinalPrice : 0,
      weekEndMinBaseTotalPrice3: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice3.EndUserPrice : 0,
    })
  }

  handleWeekEndMinBasePrice4(weekEndBasePrice) {
    let handleWeekEndMinBasePrice4 = this.HandleWeekEndBasePriceCal(weekEndBasePrice)
    this.setState({
      errorMessage: '',
      weekEndEdit: weekEndBasePrice.length !== 0 ? false : true,
      weekEndMinBasePrice4: weekEndBasePrice.length !== 0 ? weekEndBasePrice : '',
      weekEndbasePriceDiscount4: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice4.basePriceDiscountCal : 0,
      weekEndMinBaseAppCharges4: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice4.appPercentageCal : 0,
      weekEndcgstAmount4: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice4.cgstCal : 0,
      weekEndsgstAmount4: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice4.sgstCal : 0,
      weekEndMinBaseSpAmount4: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice4.SPUserPrice : 0,
      weekEndPGAmount4: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice4.paymentCal : 0,
      weekEndMinBaseWdTotalPrice4: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice4.EDWithOutDiscountFinalPrice : 0,
      weekEndMinBaseTotalPrice4: weekEndBasePrice.length !== 0 ? handleWeekEndMinBasePrice4.EndUserPrice : 0,
    })
  }

  async handleCommonchange(id, event) {
    if (event === '') {
      event = 0
    }
    // this.setState({ serviceCharges: event, errorMessage: '' })
    switch (id) {
      case 'Service charges':
        await this.handleSetstate(id, event)
        this.handleAllCal(event)
        // this.setState({ minBasePriceUnit: item, minBasePriceUnitValue: 4 })
        break
      case 'Other charges':
        await this.handleSetstate(id, event)
        this.handleAllCal(event)
        break
      case 'CGST':
        await this.handleSetstate(id, event)
        this.handleAllCal(event)
        break
      case 'SGST':
        await this.handleSetstate(id, event)
        this.handleAllCal(event)
        break
      case 'App Percentage':
        await this.handleSetstate(id, event)
        this.handleAllCal(event)
        break
      case 'App Payment charges':
        await this.handleSetstate(id, event)
        this.handleAllCal(event)
        break
      case 'Weekday Discount':
        await this.handleSetstate(id, event)
        this.handleAllCal(event)
        break
      case 'WeekEnd Discount':
        await this.handleSetstate(id, event)
        this.handleAllCal(event)
        break
    }
  }

  handleSetstate(id, value) {
    switch (id) {
      case 'Service charges':
        this.setState({ serviceCharges: Math.ceil(value) === '' || 0 ? '' : parseInt(value), errorMessage: '' })
        break
      case 'Other charges':
        this.setState({ otherCharges: Math.ceil(value) === '' || 0 ? '' : parseInt(value), errorMessage: '' })
        break
      case 'CGST':
        this.setState({ cgstPercentage: Math.ceil(value) === '' || 0 ? '' : parseInt(value), errorMessage: '' })
        break
      case 'SGST':
        this.setState({ sgstPercentage: Math.ceil(value) === '' || 0 ? '' : parseInt(value), errorMessage: '' })
        break
      case 'App Percentage':
        this.setState({ appPercentage: Math.ceil(value) === '' || 0 ? '' : parseInt(value), errorMessage: '' })
        break
      case 'App Payment charges':
        this.setState({ appPgPercentage: Math.ceil(value) === '' || 0 ? '' : parseInt(value), errorMessage: '' })
        break
      case 'Weekday Discount':
        this.setState({ weekdayDiscount: Math.ceil(value) === '' || 0 ? '' : parseInt(value), errorMessage: '' })
        break
      case 'WeekEnd Discount':
        this.setState({ weekEndDiscount: Math.ceil(value) === '' || 0 ? '' : parseInt(value), errorMessage: '' })
        break
    }
  }

  handleAllCal() {

    let HandleBasePriceCal = this.HandleBasePriceCal(this.state.basePrice)
    let HandleBasePriceCal1 = this.HandleBasePriceCal(this.state.minBasePrice)
    let HandleBasePriceCal2 = this.HandleBasePriceCal(this.state.minBasePrice2)
    let HandleBasePriceCal3 = this.HandleBasePriceCal(this.state.minBasePrice3)

    let HandleWeekEndBasePriceCal = this.HandleWeekEndBasePriceCal(this.state.weekEndBasePrice)
    let HandleWeekEndBasePriceCal1 = this.HandleWeekEndBasePriceCal(this.state.weekEndMinBasePrice)
    let HandleWeekEndBasePriceCal2 = this.HandleWeekEndBasePriceCal(this.state.weekEndMinBasePrice2)
    let HandleWeekEndBasePriceCal3 = this.HandleWeekEndBasePriceCal(this.state.weekEndMinBasePrice3)
    this.setState({
      errorMessage: '',

      // discounts
      basePriceDiscount: HandleBasePriceCal.basePriceDiscountCal,
      basePriceDiscount1: HandleBasePriceCal1.basePriceDiscountCal,
      basePriceDiscount2: HandleBasePriceCal2.basePriceDiscountCal,
      basePriceDiscount3: HandleBasePriceCal3.basePriceDiscountCal,
      basePriceDiscount4: HandleBasePriceCal.basePriceDiscountCal,

      weekEndbasePriceDiscount: HandleWeekEndBasePriceCal.basePriceDiscountCal,
      weekEndbasePriceDiscount1: HandleWeekEndBasePriceCal1.basePriceDiscountCal,
      weekEndbasePriceDiscount2: HandleWeekEndBasePriceCal2.basePriceDiscountCal,
      weekEndbasePriceDiscount3: HandleWeekEndBasePriceCal3.basePriceDiscountCal,
      weekEndbasePriceDiscount4: HandleWeekEndBasePriceCal.basePriceDiscountCal,

      // app charges
      appCharges: HandleBasePriceCal.appPercentageCal,
      minBaseAppCharges: HandleBasePriceCal1.appPercentageCal,
      minBaseAppCharges2: HandleBasePriceCal2.appPercentageCal,
      minBaseAppCharges3: HandleBasePriceCal3.appPercentageCal,
      minBaseAppCharges4: HandleBasePriceCal.appPercentageCal,

      weekEndAppCharges: HandleWeekEndBasePriceCal.appPercentageCal,
      weekEndMinBaseAppCharges: HandleWeekEndBasePriceCal1.appPercentageCal,
      weekEndMinBaseAppCharges2: HandleWeekEndBasePriceCal2.appPercentageCal,
      weekEndMinBaseAppCharges3: HandleWeekEndBasePriceCal3.appPercentageCal,
      weekEndMinBaseAppCharges4: HandleWeekEndBasePriceCal.appPercentageCal,

      // cgst amount
      cgstAmount: HandleBasePriceCal.cgstCal,
      cgstAmount1: HandleBasePriceCal1.cgstCal,
      cgstAmount2: HandleBasePriceCal2.cgstCal,
      cgstAmount3: HandleBasePriceCal3.cgstCal,
      cgstAmount4: HandleBasePriceCal.cgstCal,

      weekEndcgstAmount: HandleWeekEndBasePriceCal.cgstCal,
      weekEndcgstAmount1: HandleWeekEndBasePriceCal1.cgstCal,
      weekEndcgstAmount2: HandleWeekEndBasePriceCal2.cgstCal,
      weekEndcgstAmount3: HandleWeekEndBasePriceCal3.cgstCal,
      weekEndcgstAmount4: HandleWeekEndBasePriceCal.cgstCal,

      // sgst amount
      sgstAmount: HandleBasePriceCal.sgstCal,
      sgstAmount1: HandleBasePriceCal1.sgstCal,
      sgstAmount2: HandleBasePriceCal2.sgstCal,
      sgstAmount3: HandleBasePriceCal3.sgstCal,
      sgstAmount4: HandleBasePriceCal.sgstCal,

      weekEndsgstAmount: HandleWeekEndBasePriceCal.sgstCal,
      weekEndsgstAmount1: HandleWeekEndBasePriceCal1.sgstCal,
      weekEndsgstAmount2: HandleWeekEndBasePriceCal2.sgstCal,
      weekEndsgstAmount3: HandleWeekEndBasePriceCal3.sgstCal,
      weekEndsgstAmount4: HandleWeekEndBasePriceCal.sgstCal,

      // sp amount
      spAmount: HandleBasePriceCal.SPUserPrice,
      minBaseSpAmount: HandleBasePriceCal1.SPUserPrice,
      minBaseSpAmount2: HandleBasePriceCal2.SPUserPrice,
      minBaseSpAmount3: HandleBasePriceCal3.SPUserPrice,
      minBaseSpAmount4: HandleBasePriceCal.SPUserPrice,

      weekEndSpAmount: HandleWeekEndBasePriceCal.SPUserPrice,
      weekEndMinBaseSpAmount: HandleWeekEndBasePriceCal1.SPUserPrice,
      weekEndMinBaseSpAmount2: HandleWeekEndBasePriceCal2.SPUserPrice,
      weekEndMinBaseSpAmount3: HandleWeekEndBasePriceCal3.SPUserPrice,
      weekEndMinBaseSpAmount4: HandleWeekEndBasePriceCal.SPUserPrice,

      // PG amount
      PGAmount: HandleBasePriceCal.paymentCal,
      PGAmount1: HandleBasePriceCal1.paymentCal,
      PGAmount2: HandleBasePriceCal2.paymentCal,
      PGAmount3: HandleBasePriceCal3.paymentCal,
      PGAmount4: HandleBasePriceCal.paymentCal,

      weekEndPGAmount: HandleWeekEndBasePriceCal.paymentCal,
      weekEndPGAmount1: HandleWeekEndBasePriceCal1.paymentCal,
      weekEndPGAmount2: HandleWeekEndBasePriceCal2.paymentCal,
      weekEndPGAmount3: HandleWeekEndBasePriceCal3.paymentCal,
      weekEndPGAmount4: HandleWeekEndBasePriceCal.paymentCal,

      // EDWithOutDiscountFinalPrice : event.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
      // SPWithOutDiscountFinalPrice : event.length !== 0 ? HandleBasePriceCal.SPWithOutDiscountFinalPrice : 0,

      // with out discount EU amount
      wdTotalPrice: HandleBasePriceCal.EDWithOutDiscountFinalPrice,
      minBaseWdTotalPrice: HandleBasePriceCal1.EDWithOutDiscountFinalPrice,
      minBaseWdTotalPrice2: HandleBasePriceCal2.EDWithOutDiscountFinalPrice,
      minBaseWdTotalPrice3: HandleBasePriceCal3.EDWithOutDiscountFinalPrice,
      minBaseWdTotalPrice4: HandleBasePriceCal.EDWithOutDiscountFinalPrice,

      weekEndWdTotalPrice: HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice,
      weekEndMinBaseWdTotalPrice: HandleWeekEndBasePriceCal1.EDWithOutDiscountFinalPrice,
      weekEndMinBaseWdTotalPrice2: HandleWeekEndBasePriceCal2.EDWithOutDiscountFinalPrice,
      weekEndMinBaseWdTotalPrice3: HandleWeekEndBasePriceCal3.EDWithOutDiscountFinalPrice,
      weekEndMinBaseWdTotalPrice4: HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice,

      // EU total amount
      totalPrice: HandleBasePriceCal.EndUserPrice,
      minBaseTotalPrice: HandleBasePriceCal1.EndUserPrice,
      minBaseTotalPrice2: HandleBasePriceCal2.EndUserPrice,
      minBaseTotalPrice3: HandleBasePriceCal3.EndUserPrice,
      minBaseTotalPrice4: HandleBasePriceCal.EndUserPrice,

      weekEndTotalPrice: HandleWeekEndBasePriceCal.EndUserPrice,
      weekEndMinBaseTotalPrice: HandleWeekEndBasePriceCal1.EndUserPrice,
      weekEndMinBaseTotalPrice2: HandleWeekEndBasePriceCal2.EndUserPrice,
      weekEndMinBaseTotalPrice3: HandleWeekEndBasePriceCal3.EndUserPrice,
      weekEndMinBaseTotalPrice4: HandleWeekEndBasePriceCal.EndUserPrice
    })
  }

  handlePriceUnit(event) {
    let item = event
    this.setState({ errorMessage: '' })
    switch (item) {
      case 'Per Day':
        this.setState({ billingType: 'Per Day' })
        break
      case 'Per Week':
        this.setState({ billingType: 'Per Week' })
        break
      case 'Per Month':
        this.setState({ billingType: 'Per Month' })
        break
      case 'Per Year':
        this.setState({ billingType: 'Per Year' })
        break
    }
  }
  handlePriceUnitValue(event) {
    let str = event
    let res = str.split('<=>')
    this.setState({
      errorMessage: '',
      minBasePriceUnitValue: parseInt(res[0]),
      minBasePriceUnit: event,
      // checkDefaultBillingType: event === '24<=>Per Day' ? true : false,
      // isDefaultMinBasePrice: event === '24<=>Per Day' ? 'false' : 'true',
      // editVisiblePrice: event === '24<=>Per Day' ? true : false
      editVisiblePrice: event === '24<=>Per Day' ? false : true
    })

    if (event === '24<=>Per Day') {
      let HandleBasePriceCal = this.HandleBasePriceCal(this.state.basePrice)
      let HandleBasePriceCal1 = this.HandleBasePriceCal(this.state.basePrice)
      let HandleBasePriceCal2 = this.HandleBasePriceCal(this.state.basePrice)
      let HandleBasePriceCal3 = this.HandleBasePriceCal(this.state.basePrice)
      let HandleWeekEndBasePriceCal = this.HandleWeekEndBasePriceCal(this.state.weekEndBasePrice)
      let HandleWeekEndBasePriceCal1 = this.HandleWeekEndBasePriceCal(this.state.weekEndBasePrice)
      let HandleWeekEndBasePriceCal2 = this.HandleWeekEndBasePriceCal(this.state.weekEndBasePrice)
      let HandleWeekEndBasePriceCal3 = this.HandleWeekEndBasePriceCal(this.state.weekEndBasePrice)
      this.setState({
        isDefaultMinBasePrice: 'false',
        checkDefaultBillingType: true,
        errorMessage: '',
        // base price
        basePrice: this.state.basePrice,
        weekEndBasePrice: this.state.weekEndBasePrice,
        // min base price
        minBasePrice: event.length !== 0 ? this.state.basePrice : 0,
        minBasePrice2: event.length !== 0 ? this.state.basePrice : 0,
        minBasePrice3: event.length !== 0 ? this.state.basePrice : 0,
        minBasePrice4: event.length !== 0 ? this.state.basePrice : 0,
        weekEndMinBasePrice: event.length !== 0 ? this.state.weekEndBasePrice : 0,
        weekEndMinBasePrice2: event.length !== 0 ? this.state.weekEndBasePrice : 0,
        weekEndMinBasePrice3: event.length !== 0 ? this.state.weekEndBasePrice : 0,
        weekEndMinBasePrice4: event.length !== 0 ? this.state.weekEndBasePrice : 0,
        // discounts
        basePriceDiscount: event.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,
        basePriceDiscount1: event.length !== 0 ? HandleBasePriceCal1.basePriceDiscountCal : 0,
        basePriceDiscount2: event.length !== 0 ? HandleBasePriceCal2.basePriceDiscountCal : 0,
        basePriceDiscount3: event.length !== 0 ? HandleBasePriceCal3.basePriceDiscountCal : 0,
        basePriceDiscount4: event.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount: event.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount4: event.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,
        // app charges
        appCharges: event.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,
        minBaseAppCharges: event.length !== 0 ? HandleBasePriceCal1.appPercentageCal : 0,
        minBaseAppCharges2: event.length !== 0 ? HandleBasePriceCal2.appPercentageCal : 0,
        minBaseAppCharges3: event.length !== 0 ? HandleBasePriceCal3.appPercentageCal : 0,
        minBaseAppCharges4: event.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,
        weekEndAppCharges: event.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,
        weekEndMinBaseAppCharges: event.length !== 0 ? HandleWeekEndBasePriceCal1.appPercentageCal : 0,
        weekEndMinBaseAppCharges2: event.length !== 0 ? HandleWeekEndBasePriceCal2.appPercentageCal : 0,
        weekEndMinBaseAppCharges3: event.length !== 0 ? HandleWeekEndBasePriceCal3.appPercentageCal : 0,
        weekEndMinBaseAppCharges4: event.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,
        // cgst amount
        cgstAmount: event.length !== 0 ? HandleBasePriceCal.cgstCal : 0,
        cgstAmount1: event.length !== 0 ? HandleBasePriceCal1.cgstCal : 0,
        cgstAmount2: event.length !== 0 ? HandleBasePriceCal2.cgstCal : 0,
        cgstAmount3: event.length !== 0 ? HandleBasePriceCal3.cgstCal : 0,
        cgstAmount4: event.length !== 0 ? HandleBasePriceCal.cgstCal : 0,
        weekEndcgstAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,
        weekEndcgstAmount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.cgstCal : 0,
        weekEndcgstAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.cgstCal : 0,
        weekEndcgstAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.cgstCal : 0,
        weekEndcgstAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,
        // sgst amount
        sgstAmount: event.length !== 0 ? HandleBasePriceCal.sgstCal : 0,
        sgstAmount1: event.length !== 0 ? HandleBasePriceCal1.sgstCal : 0,
        sgstAmount2: event.length !== 0 ? HandleBasePriceCal2.sgstCal : 0,
        sgstAmount3: event.length !== 0 ? HandleBasePriceCal3.sgstCal : 0,
        sgstAmount4: event.length !== 0 ? HandleBasePriceCal.sgstCal : 0,
        weekEndsgstAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,
        weekEndsgstAmount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.sgstCal : 0,
        weekEndsgstAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.sgstCal : 0,
        weekEndsgstAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.sgstCal : 0,
        weekEndsgstAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,
        // sp amount
        spAmount: event.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,
        minBaseSpAmount: event.length !== 0 ? HandleBasePriceCal1.SPUserPrice : 0,
        minBaseSpAmount2: event.length !== 0 ? HandleBasePriceCal2.SPUserPrice : 0,
        minBaseSpAmount3: event.length !== 0 ? HandleBasePriceCal3.SPUserPrice : 0,
        minBaseSpAmount4: event.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,
        weekEndSpAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,
        weekEndMinBaseSpAmount: event.length !== 0 ? HandleWeekEndBasePriceCal1.SPUserPrice : 0,
        weekEndMinBaseSpAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.SPUserPrice : 0,
        weekEndMinBaseSpAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.SPUserPrice : 0,
        weekEndMinBaseSpAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,
        // PG amount
        PGAmount: event.length !== 0 ? HandleBasePriceCal.paymentCal : 0,
        PGAmount1: event.length !== 0 ? HandleBasePriceCal1.paymentCal : 0,
        PGAmount2: event.length !== 0 ? HandleBasePriceCal2.paymentCal : 0,
        PGAmount3: event.length !== 0 ? HandleBasePriceCal3.paymentCal : 0,
        PGAmount4: event.length !== 0 ? HandleBasePriceCal.paymentCal : 0,
        weekEndPGAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,
        weekEndPGAmount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.paymentCal : 0,
        weekEndPGAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.paymentCal : 0,
        weekEndPGAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.paymentCal : 0,
        weekEndPGAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,
        // EDWithOutDiscountFinalPrice : event.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
        SPWithOutDiscountFinalPrice: event.length !== 0 ? HandleBasePriceCal.SPWithOutDiscountFinalPrice : 0,
        // with out discount EU amount
        wdTotalPrice: event.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice: event.length !== 0 ? HandleBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice2: event.length !== 0 ? HandleBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice3: event.length !== 0 ? HandleBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice4: event.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        weekEndWdTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice2: event.length !== 0 ? HandleWeekEndBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice3: event.length !== 0 ? HandleWeekEndBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice4: event.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        // EU total amount
        totalPrice: event.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,
        minBaseTotalPrice: event.length !== 0 ? HandleBasePriceCal1.EndUserPrice : 0,
        minBaseTotalPrice2: event.length !== 0 ? HandleBasePriceCal2.EndUserPrice : 0,
        minBaseTotalPrice3: event.length !== 0 ? HandleBasePriceCal3.EndUserPrice : 0,
        minBaseTotalPrice4: event.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,
        weekEndTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0,
        weekEndMinBaseTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal1.EndUserPrice : 0,
        weekEndMinBaseTotalPrice2: event.length !== 0 ? HandleWeekEndBasePriceCal2.EndUserPrice : 0,
        weekEndMinBaseTotalPrice3: event.length !== 0 ? HandleWeekEndBasePriceCal3.EndUserPrice : 0,
        weekEndMinBaseTotalPrice4: event.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0
      })
    } else {
      const navigation = this.props.navigation;
      const isMinBaseDefault = navigation.state.params.isMinBaseDefault;
      // let minBasecheck = localStorage.getItem('isMinBaseDefault')
      if (this.props.navigation.state.params.PropertyCreate === 'create') {
        this.setState({ isDefaultMinBasePrice: true })
      } else {
        if (isMinBaseDefault) {
          this.setState({ isDefaultMinBasePrice: 'true', checkDefaultBillingType: true })
        } else {
          this.setState({ isDefaultMinBasePrice: 'false', checkDefaultBillingType: false })
        }
      }

      // old code 


      // if (this.props.navigation.state.params.PropertyCreate === 'create') {
      //   console.log('truemmmmmmmm')
      //   this.setState({ isDefaultMinBasePrice: true })
      // } else {
      //   console.log('falseeeeeeeeeeeee')
      //   if (!isMinBaseDefault) {
      //     console.log('one')
      //     this.setState({ isDefaultMinBasePrice: 'true', checkDefaultBillingType: false })
      //   } else {
      //     console.log('two')
      //     this.setState({ isDefaultMinBasePrice: 'false', checkDefaultBillingType: true })
      //   }
      // }




      // if (!isMinBaseDefault) {
      //   this.setState({ isDefaultMinBasePrice: true, checkDefaultBillingType: false })
      // } else {
      //   this.setState({ isDefaultMinBasePrice: false, checkDefaultBillingType: true })
      // }


      // if (isMinBaseDefault === true) {
      //   // this.setState({ isDefaultMinBasePrice: true, checkDefaultBillingType: false })
      //   this.setState({ isDefaultMinBasePrice: false, checkDefaultBillingType: true })
      // } else {
      //   this.setState({ isDefaultMinBasePrice: true, checkDefaultBillingType: false })
      //   // this.setState({ isDefaultMinBasePrice: false, checkDefaultBillingType: true })
      // }

      const basePrice = this.state.basePrice
      // const StringLength = basePrice.length
      // const charfind = basePrice.charAt(0)
      // let FirstChar = basePrice.length !== 0 ? charfind < 5 ? 1 : 5 : ''
      // let FirstChar1 = basePrice.length > 2 ? parseInt(FirstChar + '0'.repeat(StringLength - 2)) : 0
      // let minBasePrice = Math.ceil((basePrice / 4) * 1 + FirstChar1)
      // let minBasePrice2 = Math.ceil((basePrice / 4) * 2 + FirstChar1)
      // let minBasePrice3 = Math.ceil((basePrice / 4) * 3 + FirstChar1)
      let minBasePrice = Math.ceil(basePrice / 100 * 50)
      let minBasePrice2 = Math.ceil(basePrice / 100 * 75)
      let minBasePrice3 = Math.ceil(basePrice / 100 * 90)
      let HandleBasePriceCal = this.HandleBasePriceCal(basePrice)
      let HandleBasePriceCal1 = this.HandleBasePriceCal(minBasePrice)
      let HandleBasePriceCal2 = this.HandleBasePriceCal(minBasePrice2)
      let HandleBasePriceCal3 = this.HandleBasePriceCal(minBasePrice3)

      const weekEndbasePrice = this.state.weekEndBasePrice
      // const WEStringLength = weekEndbasePrice.length
      // const WEcharfind = weekEndbasePrice.charAt(0)
      // let WEFirstChar = weekEndbasePrice.length !== 0 ? WEcharfind < 5 ? 1 : 5 : ''
      // let WEFirstChar1 = weekEndbasePrice.length > 2 ? parseInt(WEFirstChar + '0'.repeat(WEStringLength - 2)) : 0
      // let WEminBasePrice = Math.ceil((weekEndbasePrice / 4) * 1 + WEFirstChar1)
      // let WEminBasePrice2 = Math.ceil((weekEndbasePrice / 4) * 2 + WEFirstChar1)
      // let WEminBasePrice3 = Math.ceil((weekEndbasePrice / 4) * 3 + WEFirstChar1)

      let WEminBasePrice = Math.ceil(weekEndbasePrice / 100 * 50)
      let WEminBasePrice2 = Math.ceil(weekEndbasePrice / 100 * 75)
      let WEminBasePrice3 = Math.ceil(weekEndbasePrice / 100 * 90)
      let HandleWeekEndBasePriceCal = this.HandleWeekEndBasePriceCal(weekEndbasePrice)
      let HandleWeekEndBasePriceCal1 = this.HandleWeekEndBasePriceCal(WEminBasePrice)
      let HandleWeekEndBasePriceCal2 = this.HandleWeekEndBasePriceCal(WEminBasePrice2)
      let HandleWeekEndBasePriceCal3 = this.HandleWeekEndBasePriceCal(WEminBasePrice3)
      this.setState({
        checkInHour: '12',
        checkInMin: '00',
        checkInAM: 'PM',
        checkOutHour: '11',
        checkOutMin: '00',
        checkOutAM: 'AM',
        errorMessage: '',
        // base price
        basePrice: basePrice,
        weekEndBasePrice: weekEndbasePrice,

        // min base price
        minBasePrice: event.length !== 0 ? minBasePrice : 0,
        minBasePrice2: event.length !== 0 ? minBasePrice2 : 0,
        minBasePrice3: event.length !== 0 ? minBasePrice3 : 0,
        minBasePrice4: event.length !== 0 ? basePrice : 0,

        weekEndMinBasePrice: event.length !== 0 ? WEminBasePrice : 0,
        weekEndMinBasePrice2: event.length !== 0 ? WEminBasePrice2 : 0,
        weekEndMinBasePrice3: event.length !== 0 ? WEminBasePrice3 : 0,
        weekEndMinBasePrice4: event.length !== 0 ? WEminBasePrice : 0,

        // discounts
        basePriceDiscount: event.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,
        basePriceDiscount1: event.length !== 0 ? HandleBasePriceCal1.basePriceDiscountCal : 0,
        basePriceDiscount2: event.length !== 0 ? HandleBasePriceCal2.basePriceDiscountCal : 0,
        basePriceDiscount3: event.length !== 0 ? HandleBasePriceCal3.basePriceDiscountCal : 0,
        basePriceDiscount4: event.length !== 0 ? HandleBasePriceCal.basePriceDiscountCal : 0,

        weekEndbasePriceDiscount: event.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.basePriceDiscountCal : 0,
        weekEndbasePriceDiscount4: event.length !== 0 ? HandleWeekEndBasePriceCal.basePriceDiscountCal : 0,

        // app charges
        appCharges: event.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,
        minBaseAppCharges: event.length !== 0 ? HandleBasePriceCal1.appPercentageCal : 0,
        minBaseAppCharges2: event.length !== 0 ? HandleBasePriceCal2.appPercentageCal : 0,
        minBaseAppCharges3: event.length !== 0 ? HandleBasePriceCal3.appPercentageCal : 0,
        minBaseAppCharges4: event.length !== 0 ? HandleBasePriceCal.appPercentageCal : 0,

        weekEndAppCharges: event.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,
        weekEndMinBaseAppCharges: event.length !== 0 ? HandleWeekEndBasePriceCal1.appPercentageCal : 0,
        weekEndMinBaseAppCharges2: event.length !== 0 ? HandleWeekEndBasePriceCal2.appPercentageCal : 0,
        weekEndMinBaseAppCharges3: event.length !== 0 ? HandleWeekEndBasePriceCal3.appPercentageCal : 0,
        weekEndMinBaseAppCharges4: event.length !== 0 ? HandleWeekEndBasePriceCal.appPercentageCal : 0,

        // cgst amount
        cgstAmount: event.length !== 0 ? HandleBasePriceCal.cgstCal : 0,
        cgstAmount1: event.length !== 0 ? HandleBasePriceCal1.cgstCal : 0,
        cgstAmount2: event.length !== 0 ? HandleBasePriceCal2.cgstCal : 0,
        cgstAmount3: event.length !== 0 ? HandleBasePriceCal3.cgstCal : 0,
        cgstAmount4: event.length !== 0 ? HandleBasePriceCal.cgstCal : 0,

        weekEndcgstAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,
        weekEndcgstAmount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.cgstCal : 0,
        weekEndcgstAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.cgstCal : 0,
        weekEndcgstAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.cgstCal : 0,
        weekEndcgstAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.cgstCal : 0,

        // sgst amount
        sgstAmount: event.length !== 0 ? HandleBasePriceCal.sgstCal : 0,
        sgstAmount1: event.length !== 0 ? HandleBasePriceCal1.sgstCal : 0,
        sgstAmount2: event.length !== 0 ? HandleBasePriceCal2.sgstCal : 0,
        sgstAmount3: event.length !== 0 ? HandleBasePriceCal3.sgstCal : 0,
        sgstAmount4: event.length !== 0 ? HandleBasePriceCal.sgstCal : 0,

        weekEndsgstAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,
        weekEndsgstAmount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.sgstCal : 0,
        weekEndsgstAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.sgstCal : 0,
        weekEndsgstAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.sgstCal : 0,
        weekEndsgstAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.sgstCal : 0,

        // sp amount
        spAmount: event.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,
        minBaseSpAmount: event.length !== 0 ? HandleBasePriceCal1.SPUserPrice : 0,
        minBaseSpAmount2: event.length !== 0 ? HandleBasePriceCal2.SPUserPrice : 0,
        minBaseSpAmount3: event.length !== 0 ? HandleBasePriceCal3.SPUserPrice : 0,
        minBaseSpAmount4: event.length !== 0 ? HandleBasePriceCal.SPUserPrice : 0,

        weekEndSpAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,
        weekEndMinBaseSpAmount: event.length !== 0 ? HandleWeekEndBasePriceCal1.SPUserPrice : 0,
        weekEndMinBaseSpAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.SPUserPrice : 0,
        weekEndMinBaseSpAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.SPUserPrice : 0,
        weekEndMinBaseSpAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.SPUserPrice : 0,

        // PG amount
        PGAmount: event.length !== 0 ? HandleBasePriceCal.paymentCal : 0,
        PGAmount1: event.length !== 0 ? HandleBasePriceCal1.paymentCal : 0,
        PGAmount2: event.length !== 0 ? HandleBasePriceCal2.paymentCal : 0,
        PGAmount3: event.length !== 0 ? HandleBasePriceCal3.paymentCal : 0,
        PGAmount4: event.length !== 0 ? HandleBasePriceCal.paymentCal : 0,

        weekEndPGAmount: event.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,
        weekEndPGAmount1: event.length !== 0 ? HandleWeekEndBasePriceCal1.paymentCal : 0,
        weekEndPGAmount2: event.length !== 0 ? HandleWeekEndBasePriceCal2.paymentCal : 0,
        weekEndPGAmount3: event.length !== 0 ? HandleWeekEndBasePriceCal3.paymentCal : 0,
        weekEndPGAmount4: event.length !== 0 ? HandleWeekEndBasePriceCal.paymentCal : 0,

        // EDWithOutDiscountFinalPrice : event.length !== 0 ? EDWithOutDiscountFinalPrice : 0,
        SPWithOutDiscountFinalPrice: event.length !== 0 ? HandleBasePriceCal.SPWithOutDiscountFinalPrice : 0,

        // with out discount EU amount
        wdTotalPrice: event.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice: event.length !== 0 ? HandleBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice2: event.length !== 0 ? HandleBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice3: event.length !== 0 ? HandleBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        minBaseWdTotalPrice4: event.length !== 0 ? HandleBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        weekEndWdTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal1.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice2: event.length !== 0 ? HandleWeekEndBasePriceCal2.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice3: event.length !== 0 ? HandleWeekEndBasePriceCal3.EDWithOutDiscountFinalPrice : 0,
        weekEndMinBaseWdTotalPrice4: event.length !== 0 ? HandleWeekEndBasePriceCal.EDWithOutDiscountFinalPrice : 0,

        // EU total amount
        totalPrice: event.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,
        minBaseTotalPrice: event.length !== 0 ? HandleBasePriceCal1.EndUserPrice : 0,
        minBaseTotalPrice2: event.length !== 0 ? HandleBasePriceCal2.EndUserPrice : 0,
        minBaseTotalPrice3: event.length !== 0 ? HandleBasePriceCal3.EndUserPrice : 0,
        minBaseTotalPrice4: event.length !== 0 ? HandleBasePriceCal.EndUserPrice : 0,

        weekEndTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0,
        weekEndMinBaseTotalPrice: event.length !== 0 ? HandleWeekEndBasePriceCal1.EndUserPrice : 0,
        weekEndMinBaseTotalPrice2: event.length !== 0 ? HandleWeekEndBasePriceCal2.EndUserPrice : 0,
        weekEndMinBaseTotalPrice3: event.length !== 0 ? HandleWeekEndBasePriceCal3.EndUserPrice : 0,
        weekEndMinBaseTotalPrice4: event.length !== 0 ? HandleWeekEndBasePriceCal.EndUserPrice : 0
      })
    }
  }

  closeModal() {
    // this.textInput.focus()
    this.setState({ modalIsOpen: !this.state.modalIsOpen })
  }


  handlePrice() {
    const navigation = this.props.navigation
    const PropertyStore = this.props.PropertyStore
    // if (!this.state.minBasePrice || parseInt(this.state.minBasePrice) == 0) {
    //   this.setState({ errorMessage: i18n.t('lanErrorMinBasePriceIsRequired') });
    // } else if (!this.state.basePrice || parseInt(this.state.basePrice) == 0) {
    //   this.setState({ errorMessage: i18n.t('lanErrorBasePriceIsRequired') });
    // } else 
    if (!this.state.basePrice) {
      this.setState({ errorMessage: i18n.t('lanErrorBasePriceIsRequired') })
    } else if (!this.state.minBasePrice) {
      this.setState({ errorMessage: i18n.t('lanErrorMinBasePriceIsRequired') })
    } else if (!this.state.minBasePrice2) {
      this.setState({ errorMessage: i18n.t('lanErrorMinBasePrice2IsRequired') })
    } else if (!this.state.minBasePrice3) {
      this.setState({ errorMessage: i18n.t('lanErrorMinBasePrice3IsRequired') })
    } else if (!this.state.minBasePrice4) {
      this.setState({ errorMessage: i18n.t('lanErrorMinBasePrice4IsRequired') })
    } else if (!this.state.weekEndBasePrice) {
      this.setState({ errorMessage: i18n.t('lanErrorWeekEndBasePriceIsRequired') })
    } else if (!this.state.weekEndMinBasePrice) {
      this.setState({ errorMessage: i18n.t('lanErrorWeekEndMinBasePriceIsRequired') })
    } else if (!this.state.weekEndMinBasePrice2) {
      this.setState({ errorMessage: i18n.t('lanErrorWeekEndMinBasePrice2IsRequired') })
    } else if (!this.state.weekEndMinBasePrice3) {
      this.setState({ errorMessage: i18n.t('lanErrorWeekEndMinBasePrice3IsRequired') })
    } else if (!this.state.weekEndMinBasePrice4) {
      this.setState({ errorMessage: i18n.t('lanErrorWeekEndMinBasePrice4IsRequired') })
    } else if (!this.state.fullRefundCancelTime) {
      this.setState({ errorMessage: i18n.t('lanErrorFullRefundCancelTimeIsRequired') });
    } else if (!this.state.refundCancelTime) {
      this.setState({ errorMessage: i18n.t('lanErrorRefundCancelTimeIsRequired') });
    } else if (parseInt(this.state.refundCancelTime) > parseInt(this.state.fullRefundCancelTime)) {
      this.setState({ errorMessage: i18n.t('lanErrorRefundCancelTimeShouldBeLessThanFullRefundCancelTime') });
    } else if (!this.state.refundCancelPercentage) {
      this.setState({ errorMessage: i18n.t('lanErrorRefundCancelPercentageIsRequired') });
    } else {
      let str = this.state.minBasePriceUnit
      let res = str.split('<=>')
      weekEndMinBasePrice4 = parseInt(this.state.weekEndMinBasePrice4)
      weekEndBasePrice = parseInt(this.state.weekEndBasePrice)
      minBasePrice4 = parseInt(this.state.minBasePrice4)
      basePrice = parseInt(this.state.basePrice)
      appPercentage = parseInt(this.state.appPercentage)
      let isDefaultMinBasePrice = this.state.isDefaultMinBasePrice === 'true' ? true : false
      let pricingData = {
        minBasePriceUnit: res[1], // 4 Hours, 6 Hours, 8 Hours, 12 Hours, 16 Hours, Per Day, Per Month, Per Year
        minBasePriceUnitValue: this.state.minBasePriceUnitValue, // In hours only 4, 6, 8, 12, 16, 22, 7*24 - 2, 30*24-2
        minBasePrice: this.state.minBasePrice,
        minBasePrice2: this.state.minBasePrice2,
        minBasePrice3: this.state.minBasePrice3,
        minBasePrice4: minBasePrice4,
        weekEndMinBasePrice: this.state.weekEndMinBasePrice,
        weekEndMinBasePrice2: this.state.weekEndMinBasePrice2,
        weekEndMinBasePrice3: this.state.weekEndMinBasePrice3,
        weekEndMinBasePrice4: weekEndMinBasePrice4,
        billingType: this.state.billingType,
        basePrice: basePrice,
        basePriceDiscount: this.state.weekdayDiscount,
        weekEndBasePrice: weekEndBasePrice,
        weekEndBasePriceDiscount: this.state.weekEndDiscount,
        serviceCharges: this.state.serviceCharges,
        otherCharges: this.state.otherCharges,
        currency: this.state.currency,
        // offers: offers, // Applied, NA
        // discounts: discounts, // Applied, NA
        checkInCredentials: this.state.checkInCredentials, // Around the Clock, Specific Time
        checkInTime: this.state.checkInHour + ':' + this.state.checkInMin + ' ' + this.state.checkInAM, // 01:00 PM
        // defaultCheckInTime: {type: String, required: true, trim: true}, // 01:00 PM
        checkOutTime: this.state.checkOutHour + ':' + this.state.checkOutMin + ' ' + this.state.checkOutAM, // 11:00 AM
        // defaultCheckOutTime: {type: String, required: true, trim: true}, // 11:00 AM
        fullRefundCancelTime: this.state.fullRefundCancelTime,
        refundCancelTime: this.state.refundCancelTime,
        refundCancelPercentage: this.state.refundCancelPercentage,
        cgstPercentage: this.state.cgstPercentage,
        cgstAmount: this.state.cgstAmount, // GST on base price - discount
        sgstPercentage: this.state.sgstPercentage,
        sgstAmount: this.state.sgstAmount, // GST on base price - discount
        appPercentage: appPercentage,
        appCharges: this.state.appCharges,
        weekEndAppCharges: this.state.weekEndAppCharges,
        minBaseAppCharges: this.state.minBaseAppCharges,
        minBaseAppCharges2: this.state.minBaseAppCharges2,
        minBaseAppCharges3: this.state.minBaseAppCharges3,
        minBaseAppCharges4: this.state.minBaseAppCharges4,
        weekEndMinBaseAppCharges: this.state.weekEndMinBaseAppCharges,
        weekEndMinBaseAppCharges2: this.state.weekEndMinBaseAppCharges2,
        weekEndMinBaseAppCharges3: this.state.weekEndMinBaseAppCharges3,
        weekEndMinBaseAppCharges4: this.state.weekEndMinBaseAppCharges4,
        appPgPercentage: this.state.appPgPercentage,
        spAmount: this.state.spAmount, // base price - discount + service + other + GST
        weekEndSpAmount: this.state.weekEndSpAmount,
        minBaseSpAmount: this.state.minBaseSpAmount,
        minBaseSpAmount2: this.state.minBaseSpAmount2,
        minBaseSpAmount3: this.state.minBaseSpAmount3,
        minBaseSpAmount4: this.state.minBaseSpAmount4,
        weekEndMinBaseSpAmount: this.state.weekEndMinBaseSpAmount,
        weekEndMinBaseSpAmount2: this.state.weekEndMinBaseSpAmount2,
        weekEndMinBaseSpAmount3: this.state.weekEndMinBaseSpAmount3,
        weekEndMinBaseSpAmount4: this.state.weekEndMinBaseSpAmount4,

        wdTotalPrice: this.state.wdTotalPrice,
        minBaseWdTotalPrice: this.state.minBaseWdTotalPrice,
        minBaseWdTotalPrice2: this.state.minBaseWdTotalPrice2,
        minBaseWdTotalPrice3: this.state.minBaseWdTotalPrice3,
        minBaseWdTotalPrice4: this.state.minBaseWdTotalPrice4,
        weekEndWdTotalPrice: this.state.weekEndWdTotalPrice,
        weekEndMinBaseWdTotalPrice: this.state.weekEndMinBaseWdTotalPrice,
        weekEndMinBaseWdTotalPrice2: this.state.weekEndMinBaseWdTotalPrice2,
        weekEndMinBaseWdTotalPrice3: this.state.weekEndMinBaseWdTotalPrice3,
        weekEndMinBaseWdTotalPrice4: this.state.weekEndMinBaseWdTotalPrice4,

        totalPrice: this.state.totalPrice, // spAmount + appCharges + paymentCharges
        weekEndTotalPrice: this.state.weekEndTotalPrice,
        minBaseTotalPrice: this.state.minBaseTotalPrice,
        minBaseTotalPrice2: this.state.minBaseTotalPrice2,
        minBaseTotalPrice3: this.state.minBaseTotalPrice3,
        minBaseTotalPrice4: this.state.minBaseTotalPrice4,
        weekEndMinBaseTotalPrice: this.state.weekEndMinBaseTotalPrice,
        weekEndMinBaseTotalPrice2: this.state.weekEndMinBaseTotalPrice2,
        weekEndMinBaseTotalPrice3: this.state.weekEndMinBaseTotalPrice3,
        weekEndMinBaseTotalPrice4: this.state.weekEndMinBaseTotalPrice4,
        isDefaultBasePrice: this.state.isDefaultBasePrice,
        isDefaultMinBasePrice: isDefaultMinBasePrice,
        isMidnightCheckOutAllowed: this.state.isMidnightCheckOutAllowed

      };

      let pricingDataView = {

        propertyTitle: this.state.propertyTitle,
        propertyType: this.state.propertyType,
        propertyImage: this.state.propertyImage,
        propertyArea: this.state.propertyArea,

        minBasePriceUnit: this.state.minBasePriceUnit,
        minBasePriceUnitValue: this.state.minBasePriceUnitValue,
        billingType: this.state.billingType,
        basePrice: this.state.basePrice,
        checkInCredentials: this.state.checkInCredentials,
        checkInTime: this.state.checkInTime,
        checkOutTime: this.state.checkOutTime,
        currency: this.state.currency,
        fullRefundCancelTime: this.state.fullRefundCancelTime,
        refundCancelTime: this.state.refundCancelTime,
        refundCancelPercentage: this.state.refundCancelPercentage,
        timeHours: this.state.timeHours,
        timeMins: this.state.timeMins,
        timePeriod: this.state.timePeriod,
        checkInHour: this.state.checkInHour,
        checkInMin: this.state.checkInMin,
        checkInAM: this.state.checkInAM,
        checkOutHour: this.state.checkOutHour,
        checkOutMin: this.state.checkOutMin,
        checkOutAM: this.state.checkOutAM,
        errorMessage: this.state.errorMessage,
        errorClass: this.state.errorClass,
        serviceCharges: this.state.serviceCharges,
        otherCharges: this.state.otherCharges,
        cgstPercentage: this.state.cgstPercentage,
        cgstAmount: this.state.cgstAmount,
        cgstAmount1: this.state.cgstAmount1,
        cgstAmount2: this.state.cgstAmount2,
        cgstAmount3: this.state.cgstAmount3,
        cgstAmount4: this.state.cgstAmount4,
        weekEndcgstAmount: this.state.weekEndcgstAmount,
        weekEndcgstAmount1: this.state.weekEndcgstAmount1,
        weekEndcgstAmount2: this.state.weekEndcgstAmount2,
        weekEndcgstAmount3: this.state.weekEndcgstAmount3,
        weekEndcgstAmount4: this.state.weekEndcgstAmount4,
        sgstPercentage: this.state.sgstPercentage,
        sgstAmount: this.state.sgstAmount,
        sgstAmount1: this.state.sgstAmount1,
        sgstAmount2: this.state.sgstAmount2,
        sgstAmount3: this.state.sgstAmount3,
        sgstAmount4: this.state.sgstAmount4,
        weekEndsgstAmount: this.state.weekEndsgstAmount,
        weekEndsgstAmount1: this.state.weekEndsgstAmount1,
        weekEndsgstAmount2: this.state.weekEndsgstAmount2,
        weekEndsgstAmount3: this.state.weekEndsgstAmount3,
        weekEndsgstAmount4: this.state.weekEndsgstAmount4,
        minBasePrice: this.state.minBasePrice,
        minBasePrice2: this.state.minBasePrice2,
        minBasePrice3: this.state.minBasePrice3,
        minBasePrice4: this.state.minBasePrice4,

        weekdayBilingUnit: this.state.weekdayBilingUnit,
        weekdayDiscount: this.state.weekdayDiscount,
        weekEndMinBasePrice: this.state.weekEndMinBasePrice,
        weekEndMinBasePrice2: this.state.weekEndMinBasePrice2,
        weekEndMinBasePrice3: this.state.weekEndMinBasePrice3,
        weekEndMinBasePrice4: weekEndMinBasePrice4,
        weekEndBasePrice4: this.state.weekEndBasePrice4,
        weekEndBasePrice: weekEndBasePrice,

        weekEndminBilingUnit: this.state.weekEndminBilingUnit,
        weekEndDiscount: this.state.weekEndDiscount,
        appPercentage: this.state.appPercentage,
        appPgPercentage: this.state.appPgPercentage,
        PGAmount: this.state.PGAmount,
        PGAmount1: this.state.PGAmount1,
        PGAmount2: this.state.PGAmount2,
        PGAmount3: this.state.PGAmount3,
        PGAmount4: this.state.PGAmount4,
        weekEndPGAmount: this.state.weekEndPGAmount,
        weekEndPGAmount1: this.state.weekEndPGAmount1,
        weekEndPGAmount2: this.state.weekEndPGAmount2,
        weekEndPGAmount3: this.state.weekEndPGAmount3,
        weekEndPGAmount4: this.state.weekEndPGAmount4,
        weekEndEdit: this.state.weekEndEdit,
        editVisiblePrice: this.state.editVisiblePrice,
        EDFinalPrice: this.state.EDFinalPrice,
        SPFinalPrice: this.state.SPFinalPrice,

        EDWithOutDiscountFinalPrice: this.state.EDWithOutDiscountFinalPrice,
        SPWithOutDiscountFinalPrice: this.state.SPWithOutDiscountFinalPrice,

        basePriceDiscount: this.state.basePriceDiscount,
        basePriceDiscount1: this.state.basePriceDiscount1,
        basePriceDiscount2: this.state.basePriceDiscount2,
        basePriceDiscount3: this.state.basePriceDiscount3,
        basePriceDiscount4: this.state.basePriceDiscount4,

        weekEndbasePriceDiscount: this.state.weekEndbasePriceDiscount,
        weekEndbasePriceDiscount1: this.state.weekEndbasePriceDiscount1,
        weekEndbasePriceDiscount2: this.state.weekEndbasePriceDiscount2,
        weekEndbasePriceDiscount3: this.state.weekEndbasePriceDiscount3,
        weekEndbasePriceDiscount4: this.state.weekEndbasePriceDiscount4,

        appCharges: this.state.appCharges,
        minBaseAppCharges: this.state.minBaseAppCharges,
        minBaseAppCharges2: this.state.minBaseAppCharges2,
        minBaseAppCharges3: this.state.minBaseAppCharges3,
        minBaseAppCharges4: this.state.minBaseAppCharges4,

        weekEndAppCharges: this.state.weekEndAppCharges,
        weekEndMinBaseAppCharges: this.state.weekEndMinBaseAppCharges,
        weekEndMinBaseAppCharges2: this.state.weekEndMinBaseAppCharges2,
        weekEndMinBaseAppCharges3: this.state.weekEndMinBaseAppCharges3,
        weekEndMinBaseAppCharges4: this.state.weekEndMinBaseAppCharges4,

        spAmount: this.state.spAmount,
        minBaseSpAmount: this.state.minBaseSpAmount,
        minBaseSpAmount2: this.state.minBaseSpAmount2,
        minBaseSpAmount3: this.state.minBaseSpAmount3,
        minBaseSpAmount4: this.state.minBaseSpAmount4,

        weekEndSpAmount: this.state.weekEndSpAmount,
        weekEndMinBaseSpAmount: this.state.weekEndMinBaseSpAmount,
        weekEndMinBaseSpAmount2: this.state.weekEndMinBaseSpAmount2,
        weekEndMinBaseSpAmount3: this.state.weekEndMinBaseSpAmount3,
        weekEndMinBaseSpAmount4: this.state.weekEndMinBaseSpAmount4,

        totalPrice: this.state.totalPrice,
        minBaseTotalPrice: this.state.minBaseTotalPrice,
        minBaseTotalPrice2: this.state.minBaseTotalPrice2,
        minBaseTotalPrice3: this.state.minBaseTotalPrice3,
        minBaseTotalPrice4: this.state.minBaseTotalPrice4,

        weekEndTotalPrice: this.state.weekEndTotalPrice,
        weekEndMinBaseTotalPrice: this.state.weekEndMinBaseTotalPrice,
        weekEndMinBaseTotalPrice2: this.state.weekEndMinBaseTotalPrice2,
        weekEndMinBaseTotalPrice3: this.state.weekEndMinBaseTotalPrice3,
        weekEndMinBaseTotalPrice4: this.state.weekEndMinBaseTotalPrice4,

        wdTotalPrice: this.state.wdTotalPrice,
        minBaseWdTotalPrice: this.state.minBaseWdTotalPrice,
        minBaseWdTotalPrice2: this.state.minBaseWdTotalPrice2,
        minBaseWdTotalPrice3: this.state.minBaseWdTotalPrice3,
        minBaseWdTotalPrice4: this.state.minBaseWdTotalPrice4,

        weekEndWdTotalPrice: this.state.weekEndWdTotalPrice,
        weekEndMinBaseWdTotalPrice: this.state.weekEndMinBaseWdTotalPrice,
        weekEndMinBaseWdTotalPrice: this.state.weekEndMinBaseWdTotalPrice,
        weekEndMinBaseWdTotalPrice2: this.state.weekEndMinBaseWdTotalPrice2,
        weekEndMinBaseWdTotalPrice3: this.state.weekEndMinBaseWdTotalPrice3,
        weekEndMinBaseWdTotalPrice4: this.state.weekEndMinBaseWdTotalPrice4,
        // demo : 1,
        // isCreateProperty: this.props.isCreateProperty === 'create' ? true : minBasecheck === true ? true : false,

        // isCreateProperty: this.state.isDefaultMinBasePrice,
        isDefaultBasePrice: this.state.isDefaultBasePrice,
        isDefaultMinBasePrice: isDefaultMinBasePrice,
        // allowMidnight: '',
        // modalIsOpen: this.state.modalIsOpen,
        isMidnightCheckOutAllowed: this.state.isMidnightCheckOutAllowed,
        // checkDefaultMinBase: isMinBaseDefaultInfocreate === true && PropertyStore.Pricing.minBasePriceUnit === '6<=>6 Hours' || '6 Hours' ? true : false,
        // checkDefaultBillingType: isMinBaseDefault

      };
      PropertyStore.Pricing = pricingData;
      PropertyStore.PricingView = pricingDataView;
      PropertyStore.selectedPricing = true;
      navigation.navigate('CreatePropertyInfo', { priceValidate: true })
    }
  }

  handleCredentials(item) {
    this.setState({
      checkInCredentials: item, CheckIn: '12:00 PM',
      checkInHour: '12', checkInMin: '00', checkInAM: 'PM', checkOutHour: '11', checkOutMin: '00', checkOutAM: 'AM',
      CheckOut: '11:00 AM', errorMessage: ''
    });
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
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

  toggleExpanded = () => {
    //Toggling the state of single Collapsible
    this.setState({ collapsed: !this.state.collapsed, collapsed2: true, collapsed3: true  });
  };

  toggleExpanded2 = () => {
    //Toggling the state of single Collapsible
    this.setState({ collapsed2: !this.state.collapsed2, collapsed: true, collapsed3: true });
  };

  toggleExpanded3 = () => {
    //Toggling the state of single Collapsible
    this.setState({ collapsed3: !this.state.collapsed3, collapsed: true, collapsed2: true  });
  };

  render() {
    const navigation = this.props.navigation;
    const { shift } = this.state;
    const WeekdayBasePrice = <Text style={{fontFamily: 'Roboto_light'}} >{i18n.t('lanLabelWeekdayBasePrice')}<Text style={styles.required}>*</Text></Text>
    const WeekdayMinBasePrice1 = <Text style={{fontFamily: 'Roboto_light'}} >{i18n.t('lanLabelWeekdayMinBasePrice1')}<Text style={styles.required}>*</Text></Text>
    const WeekdayMinBasePrice2 = <Text style={{fontFamily: 'Roboto_light'}} >{i18n.t('lanLabelWeekdayMinBasePrice2')}<Text style={styles.required}>*</Text></Text>
    const WeekendBasePrice = <Text style={{fontFamily: 'Roboto_light'}} >{i18n.t('lanLabelWeekendBasePrice')}<Text style={styles.required}>*</Text></Text>
    const WeekendMinBasePrice1 = <Text style={{fontFamily: 'Roboto_light'}} >{i18n.t('lanLabelWeekendMinBasePrice1')}<Text style={styles.required}>*</Text></Text>
    const WeekendMinBasePrice2 = <Text style={{fontFamily: 'Roboto_light'}} >{i18n.t('lanLabelWeekendMinBasePrice2')}<Text style={styles.required}>*</Text></Text>
    const FullRefundCancelTime = <Text style={{fontFamily: 'Roboto_light'}} >{i18n.t('lanLabelFullRefundCancelTime')}<Text style={styles.required}>*</Text></Text>
    const RefundCancelTime = <Text style={{fontFamily: 'Roboto_light'}} >{i18n.t('lanLabelRefundCancelTime')}<Text style={styles.required}>*</Text></Text>
    const RefundCancelPercentage = <Text style={{fontFamily: 'Roboto_light'}} >{i18n.t('lanLabelRefundCancelPercentage')}<Text style={styles.required}>*</Text></Text>

    return (
      <View style={styles.container}>
          <LinearGradient colors={['#019fa0', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <StatusBar barStyle='light-content' />
            <View style={styles.status} />
            <View style={styles.headerMainView} >
              <View style={styles.headerLeft}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()} >
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
                </TouchableHighlight>
              </View>
              <View style={styles.headerBody} >
                <Text style={styles.headerTitleStyle}> {i18n.t('lanTitleAddPrice')} </Text>
              </View>
            </View>
          </LinearGradient>
          <View style={styles.bodyContainer}>
            <View style={styles.businessNameView} >
              <Card style={styles.cardBusiness}>
                <CardItem style={styles.cardItemBusinessStyle}>
                  <Left style={[styles.leftImageView, styles.listItemView]}>
                    <View style={styles.imageBusinessBox} >
                      <Image source={this.state.propertyImage ? { uri: PUBLIC_DOMAIN + this.state.propertyImage } : require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
                    </View>
                    <Body>
                      <View style={styles.floatingInputBusinessView} >
                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.propertyTitle}> {this.state.propertyTitle} </Text>
                        <Text style={styles.titleLocationType}> {this.state.propertyArea} </Text>
                        <Text style={styles.titleType}> {this.state.propertyType} - {i18n.t('lanTitleAddPrice')}:</Text>
                      </View>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
            </View>
          <ScrollView>
            <View style={styles.bodyViewAddPrice} >
            <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
              <View style={styles.collapse2}>
                 {/*Code for Single Collapsible Start 2*/}
                <TouchableOpacity onPress={this.toggleExpanded2}>
                  <View style={styles.collapseHeader}>
                    <Text style={styles.collapseHeaderText}>{i18n.t('lanLabelWeekDayPrice')}<Text style={styles.required}>*</Text></Text>
                    <View style={{position:'absolute', right:10, top:5,}}>
                      {
                        !this.state.collapsed2 ? <Icon name='remove' style={{fontSize:24 }} /> :  <Icon name='add' style={{fontSize:24 }} />
                      }
                    </View>
                    {/*Heading of Single Collapsible*/}
                  </View>
                </TouchableOpacity>
                {/*Content of Single Collapsible 2*/}
                <Collapsible collapsed={this.state.collapsed2} align="center">
                  <View style={styles.content}>
                     {/* <Text style={[ styles.titleRadio, styles.leftSpace ]} >Allow Mid Night Check-out ?</Text> */}
                    {/* <Text style={styles.subHeadingStyle} >{i18n.t('lanLabelWeekDayPrice')}</Text> */}
                      <View style={styles.floatingInputView} >
                        <FloatingLabelInput
                          label={WeekdayBasePrice}
                          keyboardType='numeric'
                          maxLength={7}
                          value={this.state.basePrice.toString()}
                          // onChangeText={(text)=> this.setState({minBasePrice: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: ''})}
                          onChangeText={(text) => text.charAt(0) === '0' ? null : this.handleWeekdayPrice(text)}
                          // this.handleWeekdayPrice(event)
                          returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                          onRef={(ref) => {
                            this.inputs['Min Base Price'] = ref;
                          }}
                          onSubmitEditing={() => {
                            this.focusNextField('Max Base Price');
                          }}
                        />
                      </View>
                      <View style={styles.DateGenderView} >
                        <View style={[styles.floatingInputView, styles.DatePicker]} >
                          <FloatingLabelInput
                            label={i18n.t('lanLabelDiscount')}
                            editable={false}
                            maxLength={7}
                            keyboardType='numeric'
                            value={this.state.basePriceDiscount.toString()}
                            onChangeText={(text) => this.setState({ basePriceDiscount: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                            onRef={(ref) => {
                              this.inputs['Max Base Price'] = ref;
                            }}
                            onSubmitEditing={() => { }}
                          />
                        </View>
                        <View style={[styles.floatingInputView, styles.DatePicker]} >
                          <FloatingLabelInput
                            label={i18n.t('lanLabelCgstPercentage')}
                            editable={false}
                            maxLength={7}
                            keyboardType='numeric'
                            value={this.state.cgstAmount.toString()}
                            onChangeText={(text) => this.setState({ cgstAmount: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                              this.inputs['Min Base Price'] = ref;
                            }}
                            onSubmitEditing={() => {
                              this.focusNextField('Max Base Price');
                            }}
                          />
                        </View>
                      </View>
                      <View style={styles.DateGenderView} >
                        <View style={[styles.floatingInputView, styles.DatePicker]} >
                          <FloatingLabelInput
                            label={i18n.t('lanLabelSgstPercentage')}
                            editable={false}
                            maxLength={7}
                            keyboardType='numeric'
                            value={this.state.sgstAmount.toString()}
                            onChangeText={(text) => this.setState({ sgstAmount: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                            onRef={(ref) => {
                              this.inputs['Max Base Price'] = ref;
                            }}
                            onSubmitEditing={() => { }}
                          />
                        </View>
                        <View style={[styles.floatingInputView, styles.DatePicker]} >
                          <FloatingLabelInput
                            label={i18n.t('lanLabelSPAmount')}
                            editable={false}
                            maxLength={7}
                            keyboardType='numeric'
                            value={this.state.spAmount.toString()}
                            onChangeText={(text) => this.setState({ spAmount: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                              this.inputs['Min Base Price'] = ref;
                            }}
                            onSubmitEditing={() => {
                              this.focusNextField('Max Base Price');
                            }}
                          />
                        </View>
                      </View>
                      <View style={styles.floatingInputView} >
                        <FloatingLabelInput
                          label={WeekdayMinBasePrice1}
                          keyboardType='numeric'
                          maxLength={7}
                          editable={this.state.editVisiblePrice}
                          value={this.state.minBasePrice.toString()}
                          onChangeText={(text) => text.charAt(0) === '0' ? null : this.handleMinBasePrice1(text)}
                          returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                          onRef={(ref) => {
                            this.inputs['Min Base Price'] = ref;
                          }}
                          onSubmitEditing={() => {
                            this.focusNextField('Max Base Price');
                          }}
                        />
                      </View>
                      <View style={styles.DateGenderView} >
                        <View style={[styles.floatingInputView, styles.DatePicker]} >
                          <FloatingLabelInput
                            label={i18n.t('lanLabelDiscount')}
                            editable={false}
                            maxLength={7}
                            keyboardType='numeric'
                            value={this.state.basePriceDiscount1.toString()}
                            onChangeText={(text) => this.setState({ basePriceDiscount1: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                            onRef={(ref) => {
                              this.inputs['Max Base Price'] = ref;
                            }}
                            onSubmitEditing={() => { }}
                          />
                        </View>
                        <View style={[styles.floatingInputView, styles.DatePicker]} >
                          <FloatingLabelInput
                            label={i18n.t('lanLabelCgstPercentage')}
                            editable={false}
                            maxLength={7}
                            keyboardType='numeric'
                            value={this.state.cgstAmount1.toString()}
                            onChangeText={(text) => this.setState({ cgstAmount1: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                              this.inputs['Min Base Price'] = ref;
                            }}
                            onSubmitEditing={() => {
                              this.focusNextField('Max Base Price');
                            }}
                          />
                        </View>
                      </View>
                      <View style={styles.DateGenderView} >
                        <View style={[styles.floatingInputView, styles.DatePicker]} >
                          <FloatingLabelInput
                            label={i18n.t('lanLabelSgstPercentage')}
                            editable={false}
                            maxLength={7}
                            keyboardType='numeric'
                            value={this.state.sgstAmount1.toString()}
                            onChangeText={(text) => this.setState({ sgstAmount1: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                            onRef={(ref) => {
                              this.inputs['Max Base Price'] = ref;
                            }}
                            onSubmitEditing={() => { }}
                          />
                        </View>
                        <View style={[styles.floatingInputView, styles.DatePicker]} >
                          <FloatingLabelInput
                            label={i18n.t('lanLabelSPAmount')}
                            editable={false}
                            maxLength={7}
                            keyboardType='numeric'
                            value={this.state.minBaseSpAmount.toString()}
                            onChangeText={(text) => this.setState({ minBaseSpAmount: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                              this.inputs['Min Base Price'] = ref;
                            }}
                            onSubmitEditing={() => {
                              this.focusNextField('Max Base Price');
                            }}
                          />
                        </View>
                      </View>
                      <View style={styles.floatingInputView} >
                        <FloatingLabelInput
                          label={WeekdayMinBasePrice2}
                          keyboardType='numeric'
                          maxLength={7}
                          editable={this.state.editVisiblePrice}
                          value={this.state.minBasePrice2.toString()}
                          onChangeText={(text) => text.charAt(0) === '0' ? null : this.handleMinBasePrice2(text)}
                          returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                          onRef={(ref) => {
                            this.inputs['Min Base Price'] = ref;
                          }}
                          onSubmitEditing={() => {
                            this.focusNextField('Max Base Price');
                          }}
                        />
                      </View>
                      <View style={styles.DateGenderView} >
                        <View style={[styles.floatingInputView, styles.DatePicker]} >
                          <FloatingLabelInput
                            label={i18n.t('lanLabelDiscount')}
                            editable={false}
                            maxLength={7}
                            keyboardType='numeric'
                            value={this.state.basePriceDiscount2.toString()}
                            onChangeText={(text) => this.setState({ basePriceDiscount2: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                            onRef={(ref) => {
                              this.inputs['Max Base Price'] = ref;
                            }}
                            onSubmitEditing={() => { }}
                          />
                        </View>
                        <View style={[styles.floatingInputView, styles.DatePicker]} >
                          <FloatingLabelInput
                            label={i18n.t('lanLabelCgstPercentage')}
                            editable={false}
                            maxLength={7}
                            keyboardType='numeric'
                            value={this.state.cgstAmount2.toString()}
                            onChangeText={(text) => this.setState({ cgstAmount2: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                              this.inputs['Min Base Price'] = ref;
                            }}
                            onSubmitEditing={() => {
                              this.focusNextField('Max Base Price');
                            }}
                          />
                        </View>
                      </View>
                      <View style={styles.DateGenderView} >
                        <View style={[styles.floatingInputView, styles.DatePicker]} >
                          <FloatingLabelInput
                            label={i18n.t('lanLabelSgstPercentage')}
                            editable={false}
                            maxLength={7}
                            keyboardType='numeric'
                            value={this.state.sgstAmount2.toString()}
                            onChangeText={(text) => this.setState({ sgstAmount2: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                            onRef={(ref) => {
                              this.inputs['Max Base Price'] = ref;
                            }}
                            onSubmitEditing={() => { }}
                          />
                        </View>
                        <View style={[styles.floatingInputView, styles.DatePicker]} >
                          <FloatingLabelInput
                            label={i18n.t('lanLabelSPAmount')}
                            editable={false}
                            maxLength={7}
                            keyboardType='numeric'
                            value={this.state.minBaseSpAmount2.toString()}
                            onChangeText={(text) => this.setState({ minBaseSpAmount2: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                              this.inputs['Min Base Price'] = ref;
                            }}
                            onSubmitEditing={() => {
                              this.focusNextField('Max Base Price');
                            }}
                          />
                        </View>
                      </View>

                  </View>
                </Collapsible>
                {/*Code for Single Collapsible Ends*/}
              </View>

              <View style={styles.collapse3}>
                {/*Code for Single Collapsible Start 3*/}
                <TouchableOpacity onPress={this.toggleExpanded3}>
                  <View style={styles.collapseHeader}>
                    <Text style={styles.collapseHeaderText}>{i18n.t('lanButtonWeekEndPrice')}<Text style={styles.required}>*</Text></Text>
                    <View style={{position:'absolute', right:10, top:5,}}>
                      {
                        !this.state.collapsed3 ? <Icon name='remove' style={{fontSize:24 }} /> :  <Icon name='add' style={{fontSize:24 }} />
                      }
                    </View>
                    {/*Heading of Single Collapsible*/}
                  </View>
                </TouchableOpacity>
                {/*Content of Single Collapsible 3*/}
                <Collapsible collapsed={this.state.collapsed3} align="center">
                  <View style={styles.content}>
                    <View style={styles.floatingInputView} >
                      <FloatingLabelInput
                        label={WeekendBasePrice}
                        keyboardType='numeric'
                        maxLength={7}
                        value={this.state.weekEndBasePrice.toString()}
                        onChangeText={(text) => text.charAt(0) === '0' ? null : this.handleWeekEndPrice(text)}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                          this.inputs['Min Base Price'] = ref;
                        }}
                        onSubmitEditing={() => {
                          this.focusNextField('Max Base Price');
                        }}
                      />
                    </View>
                    <View style={styles.DateGenderView} >
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <FloatingLabelInput
                          label={i18n.t('lanLabelDiscount')}
                          editable={false}
                          maxLength={7}
                          keyboardType='numeric'
                          value={this.state.weekEndbasePriceDiscount.toString()}
                          onChangeText={(text) => this.setState({ weekEndbasePriceDiscount: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                          onRef={(ref) => {
                            this.inputs['Max Base Price'] = ref;
                          }}
                          onSubmitEditing={() => { }}
                        />
                      </View>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <FloatingLabelInput
                          label={i18n.t('lanLabelCgstPercentage')}
                          editable={false}
                          maxLength={7}
                          keyboardType='numeric'
                          value={this.state.weekEndcgstAmount.toString()}
                          onChangeText={(text) => this.setState({ weekEndcgstAmount: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                          returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                          onRef={(ref) => {
                            this.inputs['Min Base Price'] = ref;
                          }}
                          onSubmitEditing={() => {
                            this.focusNextField('Max Base Price');
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.DateGenderView} >
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <FloatingLabelInput
                          label={i18n.t('lanLabelSgstPercentage')}
                          editable={false}
                          maxLength={7}
                          keyboardType='numeric'
                          value={this.state.weekEndsgstAmount.toString()}
                          onChangeText={(text) => this.setState({ weekEndsgstAmount: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                          onRef={(ref) => {
                            this.inputs['Max Base Price'] = ref;
                          }}
                          onSubmitEditing={() => { }}
                        />
                      </View>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <FloatingLabelInput
                          label={i18n.t('lanLabelSPAmount')}
                          editable={false}
                          maxLength={7}
                          keyboardType='numeric'
                          value={this.state.weekEndSpAmount.toString()}
                          onChangeText={(text) => this.setState({ weekEndSpAmount: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                          returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                          onRef={(ref) => {
                            this.inputs['Min Base Price'] = ref;
                          }}
                          onSubmitEditing={() => {
                            this.focusNextField('Max Base Price');
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.floatingInputView} >
                      <FloatingLabelInput
                        label={WeekendMinBasePrice1}
                        editable={this.state.editVisiblePrice}
                        keyboardType='numeric'
                        maxLength={7}
                        value={this.state.weekEndMinBasePrice.toString()}
                        onChangeText={(text) => text.charAt(0) === '0' ? null : this.handleWeekEndMinBasePrice1(text)}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                          this.inputs['Min Base Price'] = ref;
                        }}
                        onSubmitEditing={() => {
                          this.focusNextField('Max Base Price');
                        }}
                      />
                    </View>
                    <View style={styles.DateGenderView} >
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <FloatingLabelInput
                          label={i18n.t('lanLabelDiscount')}
                          editable={false}
                          maxLength={7}
                          keyboardType='numeric'
                          value={this.state.weekEndbasePriceDiscount1.toString()}
                          onChangeText={(text) => this.setState({ weekEndbasePriceDiscount1: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                          onRef={(ref) => {
                            this.inputs['Max Base Price'] = ref;
                          }}
                          onSubmitEditing={() => { }}
                        />
                      </View>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <FloatingLabelInput
                          label={i18n.t('lanLabelCgstPercentage')}
                          editable={false}
                          maxLength={7}
                          keyboardType='numeric'
                          value={this.state.weekEndcgstAmount1.toString()}
                          onChangeText={(text) => this.setState({ weekEndcgstAmount1: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                          returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                          onRef={(ref) => {
                            this.inputs['Min Base Price'] = ref;
                          }}
                          onSubmitEditing={() => {
                            this.focusNextField('Max Base Price');
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.DateGenderView} >
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <FloatingLabelInput
                          label={i18n.t('lanLabelSgstPercentage')}
                          editable={false}
                          maxLength={7}
                          keyboardType='numeric'
                          value={this.state.weekEndsgstAmount1.toString()}
                          onChangeText={(text) => this.setState({ weekEndsgstAmount1: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                          onRef={(ref) => {
                            this.inputs['Max Base Price'] = ref;
                          }}
                          onSubmitEditing={() => { }}
                        />
                      </View>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <FloatingLabelInput
                          label={i18n.t('lanLabelSPAmount')}
                          editable={false}
                          maxLength={7}
                          keyboardType='numeric'
                          value={this.state.weekEndMinBaseSpAmount.toString()}
                          onChangeText={(text) => this.setState({ weekEndMinBaseSpAmount: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                          returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                          onRef={(ref) => {
                            this.inputs['Min Base Price'] = ref;
                          }}
                          onSubmitEditing={() => {
                            this.focusNextField('Max Base Price');
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.floatingInputView} >
                      <FloatingLabelInput
                        label={WeekendMinBasePrice2}
                        editable={this.state.editVisiblePrice}
                        keyboardType='numeric'
                        maxLength={7}
                        name='name'
                        value={this.state.weekEndMinBasePrice2.toString()}
                        onChangeText={(text) => text.charAt(0) === '0' ? null : this.handleWeekEndMinBasePrice2(text)}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                          this.inputs['Min Base Price'] = ref;
                        }}
                        onSubmitEditing={() => {
                          this.focusNextField('Max Base Price');
                        }}
                      />
                    </View>
                    <View style={styles.DateGenderView} >
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <FloatingLabelInput
                        maxLength={7}
                          label={i18n.t('lanLabelDiscount')}
                          disableValue={this.state.editVisiblePrice}
                          editable={false}
                          keyboardType='numeric'
                          value={this.state.weekEndbasePriceDiscount2.toString()}
                          onChangeText={(text) => this.setState({ weekEndbasePriceDiscount2: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                          onRef={(ref) => {
                            this.inputs['Max Base Price'] = ref;
                          }}
                          onSubmitEditing={() => { }}
                        />
                      </View>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <FloatingLabelInput
                          label={i18n.t('lanLabelCgstPercentage')}
                          editable={false}
                          maxLength={7}
                          keyboardType='numeric'
                          value={this.state.weekEndcgstAmount2.toString()}
                          onChangeText={(text) => this.setState({ weekEndcgstAmount2: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                          returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                          onRef={(ref) => {
                            this.inputs['Min Base Price'] = ref;
                          }}
                          onSubmitEditing={() => {
                            this.focusNextField('Max Base Price');
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.DateGenderView} >
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <FloatingLabelInput
                          label={i18n.t('lanLabelSgstPercentage')}
                          editable={false}
                          maxLength={7}
                          keyboardType='numeric'
                          value={this.state.weekEndsgstAmount2.toString()}
                          onChangeText={(text) => this.setState({ weekEndsgstAmount2: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                          onRef={(ref) => {
                            this.inputs['Max Base Price'] = ref;
                          }}
                          onSubmitEditing={() => { }}
                        />
                      </View>
                      <View style={[styles.floatingInputView, styles.DatePicker]} >
                        <FloatingLabelInput
                          label={i18n.t('lanLabelSPAmount')}
                          editable={false}
                          maxLength={7}
                          keyboardType='numeric'
                          value={this.state.weekEndMinBaseSpAmount2.toString()}
                          onChangeText={(text) => this.setState({ weekEndMinBaseSpAmount2: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: '' })}
                          returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                          onRef={(ref) => {
                            this.inputs['Min Base Price'] = ref;
                          }}
                          onSubmitEditing={() => {
                            this.focusNextField('Max Base Price');
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </Collapsible>
                {/*Code for Single Collapsible Ends*/}
              </View>
              <View style={styles.collapse1}>
                {/*Code for Single Collapsible Start 1*/}
                <TouchableOpacity onPress={this.toggleExpanded}>
                  <View style={styles.collapseHeader}>
                    <Text style={styles.collapseHeaderText}>{i18n.t('lanButtonCreatePrice')}<Text style={styles.required}>*</Text></Text>
                    <View style={{position:'absolute', right:10, top:5,}}>
                      {
                        !this.state.collapsed ? <Icon name='remove' style={{fontSize:24 }} /> :  <Icon name='add' style={{fontSize:24 }} />
                      }
                    </View>
                    {/*Heading of Single Collapsible*/}
                  </View>
                </TouchableOpacity>
                {/*Content of Single Collapsible 1*/}
                <Collapsible collapsed={this.state.collapsed} align="center">
                  <View style={styles.content}>
                    <View style={styles.floatingInputView} >
                      <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2',  }} >
                        <Text style={[styles.regularFontStyle, styles.regularFontSize]} >{i18n.t('lanLabelCheckInCredentials')}</Text>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" /> }
                          iosHeader="Select CheckIn Credentials"
                          selectedValue={this.state.checkInCredentials}
                          style={{ width: '100%', color: '#454545', marginTop:-5, marginLeft:-4  }}
                          onValueChange={(itemValue, itemIndex) => this.handleCredentials(itemValue, itemIndex)}
                        >
                          <Picker.Item label="Around the Clock" value="Around the Clock" color='#000' />
                          <Picker.Item label="Specific Time" value="Specific Time" color='#000' />
                        </Picker>
                      </View>
                    </View>
                    <View>
                      <View style={styles.DateGenderView}>
                        <View style={styles.floatingInputView}>
                          <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', }} >
                            <View><Text style={[styles.regularFontStyle, styles.regularFontSize, styles.labelGap]}>{i18n.t('lanLabelCheckInTime')}</Text></View>
                            <View style={{ width: DEVICE_WIDTH-50, flexDirection: 'row' }} >
                              <View style={{flex:1}}>
                                <Picker
                                  mode="dropdown"
                                  iosIcon={<Icon name="arrow-down" /> }
                                  selectedValue={this.state.checkInHour}
                                  enabled={!this.state.editVisiblePrice}
                                  style={{ width: '100%', color: '#454545', left: -6, top: -4 }}
                                  itemStyle={{ color: 'red' }}
                                  onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ checkInHour: itemValue, errorMessage: '' })}
                                >
                                  <Picker.Item label="01" value="01" />
                                  <Picker.Item label="02" value="02" />
                                  <Picker.Item label="03" value="03" />
                                  <Picker.Item label="04" value="04" />
                                  <Picker.Item label="05" value="05" />
                                  <Picker.Item label="06" value="06" />
                                  <Picker.Item label="07" value="07" />
                                  <Picker.Item label="08" value="08" />
                                  <Picker.Item label="09" value="09" />
                                  <Picker.Item label="10" value="10" />
                                  <Picker.Item label="11" value="11" />
                                  <Picker.Item label="12" value="12" />
                                </Picker>
                              </View>
                              <View style={{flex:1}}>
                                <Picker
                                  mode="dropdown"
                                  iosIcon={<Icon name="arrow-down" /> }
                                  selectedValue={this.state.checkInMin}
                                  enabled={!this.state.editVisiblePrice}
                                  style={{ width: '100%', color: '#454545', left: -6, top: -4 }}
                                  itemStyle={{ color: 'red' }}
                                  onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ checkInMin: itemValue, errorMessage: '' })}
                                >
                                  <Picker.Item label="00" value="00" />
                                  <Picker.Item label="15" value="15" />
                                  <Picker.Item label="30" value="30" />
                                  <Picker.Item label="45" value="45" />
                                </Picker>
                              </View>
                              <View style={{flex:1}}>
                                <Picker
                                  mode="dropdown"
                                  iosIcon={<Icon name="arrow-down" /> }
                                  selectedValue={this.state.checkInAM}
                                  enabled={!this.state.editVisiblePrice}
                                  style={{ width: '100%', color: '#454545', left: -6, top: -4 }}
                                  itemStyle={{ color: 'red' }}
                                  onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ checkInAM: itemValue, errorMessage: '' })}
                                >
                                  <Picker.Item label="AM" value="AM" />
                                  <Picker.Item label="PM" value="PM" />
                                </Picker>
                              </View>
                            </View>
                            {/* <Text style={[ styles.regularFontStyle, styles.regularTextFontSize, styles.textGap ]}>{this.state.CheckIn}</Text> */}
                          </View>
                        </View>
                      </View>
                      <View style={styles.DateGenderView}>
                        <View style={styles.floatingInputView} >
                          <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', }} >
                            <View><Text style={[styles.regularFontStyle, styles.regularFontSize, styles.labelGap]}>{i18n.t('lanLabelCheckOutTime')}</Text></View>
                            <View style={{ width: DEVICE_WIDTH-50, flexDirection: 'row' }} >
                              <View style={{flex:1}}>
                                <Picker
                                  mode="dropdown"
                                  iosIcon={<Icon name="arrow-down" /> }
                                  selectedValue={this.state.checkOutHour}
                                  enabled={!this.state.editVisiblePrice}
                                  style={{ width: '100%', color: '#454545', left: -6, top: -4 }}
                                  itemStyle={{ color: 'red' }}
                                  onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ checkOutHour: itemValue, errorMessage: '' })}
                                >
                                  <Picker.Item label="01" value="01" />
                                  <Picker.Item label="02" value="02" />
                                  <Picker.Item label="03" value="03" />
                                  <Picker.Item label="04" value="04" />
                                  <Picker.Item label="05" value="05" />
                                  <Picker.Item label="06" value="06" />
                                  <Picker.Item label="07" value="07" />
                                  <Picker.Item label="08" value="08" />
                                  <Picker.Item label="09" value="09" />
                                  <Picker.Item label="10" value="10" />
                                  <Picker.Item label="11" value="11" />
                                  <Picker.Item label="12" value="12" />
                                </Picker>
                              </View>
                              <View style={{flex:1}}>
                                <Picker
                                  mode="dropdown"
                                  iosIcon={<Icon name="arrow-down" /> }
                                  selectedValue={this.state.checkOutMin}
                                  enabled={!this.state.editVisiblePrice}
                                  style={{ width:'100%', color: '#454545', left: -6, top: -4 }}
                                  itemStyle={{ color: 'red' }}
                                  onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ checkOutMin: itemValue, errorMessage: '' })}
                                >
                                  <Picker.Item label="00" value="00" />
                                  <Picker.Item label="15" value="15" />
                                  <Picker.Item label="30" value="30" />
                                  <Picker.Item label="45" value="45" />
                                </Picker>
                              </View>
                              <View style={{flex:1}}>
                                <Picker
                                  mode="dropdown"
                                  iosIcon={<Icon name="arrow-down" /> }
                                  selectedValue={this.state.checkOutAM}
                                  enabled={!this.state.editVisiblePrice}
                                  style={{ width: '100%', color: '#454545', left: -6, top: -4 }}
                                  itemStyle={{ color: 'red' }}
                                  onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ checkOutAM: itemValue, errorMessage: '' })}
                                >
                                  <Picker.Item label="AM" value="AM" />
                                  <Picker.Item label="PM" value="PM" />
                                </Picker>
                              </View>
                            </View>
                            {/* <Text style={[ styles.regularFontStyle, styles.regularTextFontSize, styles.textGap ]}>{this.state.CheckIn}</Text> */}
                          </View>
                        </View>
                      </View>
                    </View>
                    {/* } */}
                    <View style={styles.floatingInputView} >
                      <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', }} >
                        <Text style={[styles.regularFontStyle, styles.regularFontSize]} >{i18n.t('lanLabelCurrency')}</Text>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name="arrow-down" /> }
                          selectedValue={this.state.currency}
                          style={{ width: '100%', color: '#454545', left: -4, top:-5 }}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({ currency: itemValue, errorMessage: '' })}
                        >
                          <Picker.Item label="INR - Indian Rupee(₹)" value="INR" />
                          <Picker.Item label="USD - US Dollar($)" value="USD" />
                        </Picker>
                      </View>
                    </View>      
                    <View style={styles.floatingInputView} >
                      <FloatingLabelInput
                        label={FullRefundCancelTime}
                        keyboardType='numeric'
                        isError={this.state.fullRefundCancelTimeError}
                        value={this.state.fullRefundCancelTime.toString()}
                        onChangeText={(text) => this.setState({ fullRefundCancelTime: text.replace(/\s/g, ''), errorMessage: '', fullRefundCancelTimeError: text ? false : true })}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                          this.inputs['Cancel Time'] = ref;
                        }}
                        onSubmitEditing={() => {
                          this.focusNextField('Refund Cancel Time');
                        }}
                      />
                      {this.state.fullRefundCancelTimeError
                        ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                        : <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                      }
                    </View>                    
                    <View style={styles.floatingInputView} >
                      <FloatingLabelInput
                        label={RefundCancelTime}
                        keyboardType='numeric'
                        isError={this.state.CancelTimeError}
                        value={this.state.refundCancelTime.toString()}
                        onChangeText={(text) => this.setState({ refundCancelTime: text.replace(/\s/g, ''), errorMessage: '', CancelTimeError: text ? false : true })}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                          this.inputs['Refund Cancel Time'] = ref;
                        }}
                        onSubmitEditing={() => {
                          this.focusNextField('Cancel Percentage');
                        }}
                      />
                      {this.state.CancelTimeError
                        ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                        : <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                      }
                    </View>                   
                    <View style={styles.floatingInputView} >
                      <FloatingLabelInput
                        label={RefundCancelPercentage}
                        keyboardType='numeric'
                        isError={this.state.CancelPercentageError}
                        value={this.state.refundCancelPercentage.toString()}
                        onChangeText={(text) => this.setState({ refundCancelPercentage: text.replace(/\s/g, ''), errorMessage: '', CancelPercentageError: text ? false : true })}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                          this.inputs['Cancel Percentage'] = ref;
                        }}
                        onSubmitEditing={() => {
                          this.focusNextField('Service charges');
                        }}
                      />
                      {this.state.CancelPercentageError
                        ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                        : <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                      }
                    </View>

                    <View style={styles.DateGenderView} >
                      <View style={{flex:1 }}>
                        <View style={styles.floatingInputView } >
                          <FloatingLabelInput
                            label={i18n.t('lanLabelServiceCharges')}
                            keyboardType='numeric'
                            value={this.state.serviceCharges.toString()}
                            onChangeText={(text) => this.handleCommonchange('Service charges', text)}
                            // onChange={(text)=> this.setState({basePrice: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: ''})}
                            // onChangeText={(text)=> this.setState({serviceCharges: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: ''})}
                            // (event) => this.handleCommonchange(event)}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                              this.inputs['Service charges'] = ref;
                            }}
                            onSubmitEditing={() => {
                              this.focusNextField('Other charges');
                            }}
                          />
                        </View>
                      </View>
                      <View style={{flex:1 }}>
                        <View style={styles.floatingInputView} >
                          <FloatingLabelInput
                            label={i18n.t('lanLabelOtherCharges')}
                            keyboardType='numeric'
                            value={this.state.otherCharges.toString()}
                            onChangeText={(text) => this.handleCommonchange('Other charges', text)}
                            // onChangeText={(text)=> this.setState({minBasePrice: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: ''})}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                              this.inputs['Other charges'] = ref;
                            }}
                            onSubmitEditing={() => {
                              this.focusNextField('CGST');
                            }}
                          />
                        </View>
                      </View>
                    </View>


                    <View style={styles.DateGenderView} >
                      <View style={{flex:1 }}>
                        <View style={styles.floatingInputView } >
                          <FloatingLabelInput
                            label={i18n.t('lanLabelCgstPercentage')}
                            keyboardType='numeric'
                            value={this.state.cgstPercentage.toString()}
                            onChangeText={(text) => this.handleCommonchange('CGST', text)}
                            // onChangeText={(text)=> this.setState({basePrice: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: ''})}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                              this.inputs['CGST'] = ref;
                            }}
                            onSubmitEditing={() => {
                              this.focusNextField('SGST');
                            }}
                          />
                        </View>
                      </View>
                      <View style={{flex:1 }}>
                        <View style={styles.floatingInputView} >
                          <FloatingLabelInput
                            label={i18n.t('lanLabelSgstPercentage')}
                            keyboardType='numeric'
                            value={this.state.sgstPercentage.toString()}
                            onChangeText={(text) => this.handleCommonchange('SGST', text)}
                            // onChangeText={(text)=> this.setState({minBasePrice: text.charAt(0) == '0' ? '' : text.replace(/\s/g, ''), errorMessage: ''})}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                              this.inputs['SGST'] = ref;
                            }}
                            onSubmitEditing={() => {
                              this.focusNextField('Weekday Discount');
                            }}
                          />
                        </View>
                      </View>
                    </View>                 
                    <View style={styles.DateGenderView} >
                      <View style={{flex:1 }}>
                        <View style={styles.floatingInputView } >
                          <FloatingLabelInput
                            label={i18n.t('lanLabelWeekDayDiscountPercentage')}
                            keyboardType='numeric'
                            value={this.state.weekdayDiscount.toString()}
                            onChangeText={(text) => this.handleCommonchange('Weekday Discount', text)}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                              this.inputs['Weekday Discount'] = ref;
                            }}
                            onSubmitEditing={() => {
                              this.focusNextField('WeekEnd Discount');
                            }}
                          />
                        </View>
                      </View>
                      <View style={{flex:1 }}>
                        <View style={styles.floatingInputView } >
                          <FloatingLabelInput
                            label={i18n.t('lanLabelWeekEndDiscountPercentage')}
                            keyboardType='numeric'
                            value={this.state.weekEndDiscount.toString()}
                            onChangeText={(text) => this.handleCommonchange('WeekEnd Discount', text)}
                            returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                              this.inputs['WeekEnd Discount'] = ref;
                            }}
                            onSubmitEditing={() => { }}
                          />
                        </View>
                      </View>
                    </View>

                    <View style={styles.DateGenderView} >
                      <View style={{flexDirection:'row', width:DEVICE_WIDTH-50}}>
                        <View style={{flex:2 }}>
                          <View style={styles.floatingInputView} >
                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', }} >
                              <Text style={[styles.titleRadio, styles.leftSpace]} >{i18n.t('lanLabelBillingType')}</Text>
                              <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" /> }
                                selectedValue={this.state.billingType}
                                style={{ width: '100%', color: '#454545', left: -4 }}
                                onValueChange={(itemValue, itemIndex) => this.handlePriceUnit(itemValue, itemIndex)}
                              >
                                <Picker.Item label="Per Day" value="Per Day" color='#000' />
                                <Picker.Item label="Per Week" value="Per Week" color='#000' />
                                <Picker.Item label="Per Month" value="Per Month" color='#000' />
                                <Picker.Item label="Per Year" value="Per Year" color='#000' />
                              </Picker>
                            </View>
                          </View>
                        </View>
                        <View style={{flex:2 }}>
                          <View style={styles.floatingInputView} >
                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2',  }} >
                              <Text style={[styles.titleRadio, styles.leftSpace]} >{i18n.t('lanLabelMinBillingType')} </Text>
                              <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" /> }
                                selectedValue={this.state.minBasePriceUnit}
                                style={{ width: '100%', color: '#454545', left: -4 }}
                                itemStyle={{ color: 'red' }}
                                onValueChange={(itemValue, itemIndex) => this.handlePriceUnitValue(itemValue, itemIndex)}
                              >
                                <Picker.Item label="6 Hours" value="6<=>6 Hours" />
                                <Picker.Item label="Per Day" value="24<=>Per Day" />
                              </Picker>
                            </View>
                            </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.DateGenderView} >
                      <View style={styles.floatingInputView} >
                        <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', width:DEVICE_WIDTH-50,  }} >
                          <Text style={[styles.titleRadio, styles.leftSpace]} >{i18n.t('lanLabelBaseDefaultPriority')}</Text>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" /> }
                            selectedValue={this.state.isDefaultBasePrice}
                            // enabled={this.props.navigation.state.params.PropertyCreate === 'create' ? false : true}
                            style={{ width: '100%', left: -4, top:-5 }}
                            onValueChange={(itemValue, itemIndex) => this.setState({ isDefaultBasePrice:itemValue })}
                            // onValueChange={(itemValue, itemIndex) => this.handlePriceUnit(itemValue, itemIndex)}
                          >
                            <Picker.Item label="true" value="true" color='#000' />
                            <Picker.Item label="false" value="false" color='#000' />
                          </Picker>
                        </View>
                      </View>
                    </View>

                    <View style={styles.DateGenderView} >
                      <View style={styles.floatingInputView} >
                        <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', width:DEVICE_WIDTH-50, }} >
                          <Text style={[styles.titleRadio, styles.leftSpace]} >{i18n.t('lanLabelMinBaseDefaultPriority')}</Text>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" /> }
                            selectedValue={this.state.isDefaultMinBasePrice}
                            // enabled={this.state.checkDefaultBillingType === false ? true : this.state.editVisiblePrice === true ? true : !this.state.checkDefaultMinBase ? false : true}
                            // old enabled={this.props.navigation.state.params.PropertyCreate === 'create' ? false : this.state.checkDefaultBillingType === false ? true : this.state.editVisiblePrice ? !this.state.checkDefaultMinBase : false}
                            enabled={this.state.checkDefaultBillingType === false ? true : this.state.editVisiblePrice ? !this.state.checkDefaultMinBase : false}
                            // enabled={this.state.editVisiblePrice ? false : this.state.checkbillingTypeCount}
                            style={{ width: '100%', left: -4, top:-5  }}
                            itemStyle={{ color: 'red' }}
                            // onValueChange={(itemValue, itemIndex) => this.handlePriceUnitValue(itemValue, itemIndex)}
                            onValueChange={(itemValue, itemIndex) => this.setState({ isDefaultMinBasePrice:itemValue })}
                          >
                            <Picker.Item label="true" value="true" color='#000' />
                            <Picker.Item label="false" value="false" color='#000' />
                          </Picker>
                        </View>
                      </View>
                    </View>

                    <View style={styles.CheckBoxInputView} >
                      <View style={{flex:1 }}>
                        <CheckBox
                          title={i18n.t('lanLabelAllowMidNightCheckOut')}
                          checked={this.state.isMidnightCheckOutAllowed}
                          onPress={() => this.setState({ isMidnightCheckOutAllowed: !this.state.isMidnightCheckOutAllowed })}
                        />
                      </View>
                      {/* <View style={{flex:6, justifyContent:'center', alignItems:'flex-start' }}>
                        <Text style={styles.titleCheckbox} >{i18n.t('lanLabelAllowMidNightCheckOut')}</Text>
                      </View> */}
                    </View>
                  </View>
                </Collapsible>
                {/*Code for Single Collapsible Ends*/}
              </View>
              
             <View style={styles.btnModal} >
                <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                  <AwesomeButton block success
                    onPress={() => this.handlePrice()}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} marginTop={20} >
                    <Text style={styles.BtnText}>{i18n.t('lanButtonSave')}</Text>
                  </AwesomeButton>
                </LinearGradient>
              </View>
              <Text style={{ color: 'red', paddingHorizontal: 15, fontFamily: 'Roboto_medium', fontSize: 13 }}>{this.state.errorMessage}</Text>
            </Animated.View>
            </View>
          </ScrollView>
          </View>
          <KeyboardSpacer />
      </View>
    );
  }
}
