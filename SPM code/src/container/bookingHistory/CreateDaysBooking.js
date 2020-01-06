import React from 'react'
import { Button, Icon, View, Text, Left, Right, List, ListItem, Picker } from 'native-base';
import ToggleSwitch from 'toggle-switch-react-native';
import { Platform, TextInput, Image, ScrollView,TouchableHighlight, AsyncStorage, Dimensions, StatusBar, TouchableOpacity, ActivityIndicator, CheckBox, BackHandler } from 'react-native';
import { observer, inject } from 'mobx-react';
import { LinearGradient } from 'expo-linear-gradient';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import AwesomeButton from 'react-native-really-awesome-button';
import Swiper from 'react-native-swiper';
import Modal from 'react-native-modal';
import styles from './css/CreateBookingCss';
import styles1 from './css/styles1css'
import i18n from 'i18n-js'
import { PUBLIC_DOMAIN } from '../../../constants';
import BookingCalendarScreen from './BookingCalendar'
import Toast, { DURATION } from 'react-native-easy-toast';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['UserStore'], ['PropertyStore'], ['BookingStore'])
@observer
export default class CreateDaysBookingComponent extends React.Component {
  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    const data = this.props.data
    this.state = {
      checkInDate: moment().format('YYYY-MM-DD'),
      checkOutDate: moment().add(1, 'days').format('YYYY-MM-DD'),
      checkInTime: data.pricing.checkInTime,
      checkOutTime: data.pricing.checkOutTime,
      amenitiesData: [] ,
      servicesData: [] ,
      guestRulesArray: [],
      adults: 2,
      childs: 0,
      rooms: 1,
      numberOfDays: 1,
      amount: data.pricing.totalPrice ? data.pricing.totalPrice : 0,
      avaliableRoomCount: 0,
      propertyId: (data && data.propertyId) ? (data.propertyId._id ? data.propertyId._id : data.propertyId) : '',
      propertyInfoId: data && data._id ? data._id : '',
      propertyInfoData: data,
      totalDays: 1,
      numOfPeople: 2,
      bookingType: 'Days',
      bookingCalendarScreen: false
    }
    this.setRoomsCount = this.setRoomsCount.bind(this)
    this.getNumberOfRoomsCount = this.getNumberOfRoomsCount.bind(this)
    this.handleCheckIn = this.handleCheckIn.bind(this)
    this.handleCheckOut = this.handleCheckOut.bind(this)
    this.getNumOfDays = this.getNumOfDays.bind(this)
    this.handleDaysAmount = this.handleDaysAmount.bind(this)
    this.handleAdultsIncrease = this.handleAdultsIncrease.bind(this)
    this.handleAdultsDecrease = this.handleAdultsDecrease.bind(this)
    this.handleChildsIncrease = this.handleChildsIncrease.bind(this)
    this.handleChildsDecrease = this.handleChildsDecrease.bind(this)
    this.handleRooms = this.handleRooms.bind(this)
    this.handleDates = this.handleDates.bind(this)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
  }

  componentWillMount () {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
    this.setRoomsCount()
    this.handleDaysAmount(this.state.checkInDate)
    this.getNumberOfRoomsCount(this.state.checkInDate, this.state.checkOutDate, this.state.checkInTime, this.state.checkOutTime)
    this.getNumOfDays(this.state.checkInDate, this.state.checkOutDate)
  }
  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  handleBackButtonClick () {
    const navigation = this.props.navigation
    navigation.goBack()
    return true
  }
  componentWillReceiveProps (newProps) {
    this.setState ({ amenitiesData: newProps.amenitiesArray, servicesData: newProps.servicesArray })
  }
  getNumberOfRoomsCount (checkInDate, checkOutDate, checkInTime, checkOutTime) {
    const BookingStore = this.props.BookingStore;
    let cidt = moment(checkInDate ? checkInDate : this.state.checkInDate).format('YYYY-MM-DD')
    let codt = moment(checkOutDate ? checkOutDate : this.state.checkOutDate).format('YYYY-MM-DD')
    let checkInHours = moment(checkInTime ? checkInTime : this.state.checkInTime, ['hh:mm A']).format('HH:mm')
    let checkOutHours = moment(checkOutTime ? checkOutTime : this.state.checkOutTime, ['hh:mm A']).format('HH:mm')
    let data = {
      checkInDate: cidt + ' ' + checkInHours,
      checkOutDate: codt + ' ' + checkOutHours,
      propertyId: this.state.propertyId,
      spPropertyInfoId: this.state.propertyInfoId,
      spServiceProviderId: this.state.propertyInfoData.spServiceProviderId,
      noOfRooms: this.state.rooms
    };
    let _this = this;
    BookingStore.getBookingRoomsCount(data, function (resObj) {
      if (resObj.statusCode == '1017') {
        _this.setState({errorMessage: ((i18n.t('lanErrorServiceNotAvailableOnThisDateChooseDifferentOne'))), propertyBlocked: true});
      } else if (resObj.statusCode === '0000') {
          if (resObj.statusResult.bookingCount >= resObj.statusResult.activeRoomsCount) {
            _this.setState({ errorMessage: ((i18n.t('lanErrorNoRoomsAvailable'))), propertyBlocked: true })
          } else {
            _this.setState({ avaliableRoomCount: resObj.statusResult.activeRoomsCount - resObj.statusResult.bookingCount, propertyBlocked: false, errorMessage: '' })
          }
      }   
    })
  }
  handleCheckIn (checkIn) {
    let checkInDateValue = moment(checkIn, 'YYYY-MM-DD').valueOf()
    let currentDay = moment().format('YYYY-MM-DD')
    let currentDayValue = moment.utc(currentDay, 'YYYY-MM-DD').valueOf()
    if (checkInDateValue > currentDayValue) {
      this.setState({ checkInDate: checkIn, checkOutDate: moment(checkIn).add(this.state.totalDays, 'day').format('YYYY-MM-DD') })
      this.getNumberOfRoomsCount(checkIn, moment(checkIn).add(this.state.totalDays, 'day').format('YYYY-MM-DD'))
      this.getNumOfDays(checkIn, moment(checkIn).add(this.state.totalDays, 'day').format('YYYY-MM-DD'))
      this.handleDaysAmount(checkIn)
    } else {
      this.setState({ checkInDate: checkIn })
      this.getNumberOfRoomsCount(checkIn, this.state.checkOutDate)
      this.getNumOfDays(checkIn, this.state.checkOutDate)
      this.handleDaysAmount(checkIn)
    }
  }
  handleCheckOut (checkOutDate) {
    let checkInDateValue = moment(this.state.checkInDate, 'YYYY-DD-MM').valueOf()
    let checkOutDateValue = moment(checkOutDate, 'YYYY-DD-MM').valueOf()
    if (checkOutDateValue < checkInDateValue) {
      // alert(i18n.t('lanErrorCheckOutDateShouldNotBeLessThanCheckInDate'));
      this.refs.toast.show(i18n.t('lanErrorCheckOutDateShouldNotBeLessThanCheckInDate'));
    } else {
      this.setState({ checkOutDate: checkOutDate })
      this.getNumberOfRoomsCount(this.state.checkInDate, checkOutDate)
      this.getNumOfDays(this.state.checkInDate, checkOutDate)
    }
  }
  getNumOfDays (checkInDate, checkOutDate) {
    var checkIn = moment.utc(checkInDate)
    var checkOut = moment.utc(checkOutDate)
    var duration = moment.duration(checkOut.diff(checkIn))
    var days = duration.asDays()
    this.setState({ totalDays: days === 0 ? 1 : days })
  }
  handleDaysAmount (checkInDate) {
    let pricing = this.state.propertyInfoData.pricing
    let checkInDateFormat = moment(checkInDate).format('YYYY-MM-DD')
    let dt = moment(checkInDateFormat, 'YYYY-MM-DD HH:mm:ss')
    let dateName = dt.format('dddd')
    let weekEnd = dateName === 'Saturday' || dateName === 'Sunday'
    if (weekEnd) {
      this.setState({ amount: pricing.weekEndTotalPrice })
    } else {
      this.setState({ amount: pricing.totalPrice })
    }
  }
  handleAdultsIncrease (membersCapacity, childsCapacity) {
    let addValue = (this.state.adults + 1) + (this.state.childs)
    let numOfAdults = (this.state.adults) + 1
    this.setState({ adults: numOfAdults })
    let totalCapacity = parseInt(membersCapacity) + parseInt(childsCapacity)
    let RoomCount = (numOfAdults / membersCapacity)
    let TotalRoomCount = (addValue / totalCapacity)
    let index = RoomCount % 1
    let totalIndex = TotalRoomCount % 1
    if (RoomCount > TotalRoomCount) {
      if (index === 0) {
        this.setState({ rooms: RoomCount })
      } else {
        let addRoomCount = (RoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: addValue })
      }
    } else {
      if (totalIndex === 0) {
        this.setState({ rooms: TotalRoomCount })
      } else {
        let addRoomCount = (TotalRoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: addValue })
      }
    }
  }
  handleAdultsDecrease (membersCapacity, childsCapacity) {
    let addValue = (this.state.adults - 1) + (this.state.childs)
    let numOfAdults = (this.state.adults) - 1
    this.setState({ adults: numOfAdults })
    let totalCapacity = parseInt(membersCapacity) + parseInt(childsCapacity)
    let RoomCount = (numOfAdults / membersCapacity)
    let TotalRoomCount = (addValue / totalCapacity)
    let totalIndex = TotalRoomCount % 1
    let index = RoomCount % 1
    if (RoomCount > TotalRoomCount) {
      if (index === 0) {
        this.setState({ rooms: RoomCount })
      } else {
        let addRoomCount = (RoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: addValue })
      }
    } else {
      if (totalIndex === 0) {
        this.setState({ rooms: TotalRoomCount })
      } else {
        let addRoomCount = (TotalRoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: addValue })
      }
    }
  }
  handleChildsIncrease (membersCapacity, childsCapacity) {
    let adultsCapacity = this.state.adults
    let addValue = (this.state.childs + 1) + this.state.adults
    let numOfChildren = (this.state.childs) + 1
    this.setState({ childs: numOfChildren })
    let totalCapacity = parseInt(membersCapacity) + parseInt(childsCapacity)
    let RoomCount = (adultsCapacity / membersCapacity)
    let TotalRoomCount = (addValue / totalCapacity)
    let totalIndex = TotalRoomCount % 1
    let index = RoomCount % 1
    if (RoomCount > TotalRoomCount) {
      if (index === 0) {
        this.setState({ rooms: RoomCount })
      } else {
        let addRoomCount = (RoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: addValue })
      }
    } else {
      if (totalIndex === 0) {
        this.setState({ noOfRooms: TotalRoomCount })
      } else {
        let addRoomCount = (TotalRoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: addValue })
      }
    }
  }
  handleChildsDecrease (membersCapacity, childsCapacity) {
    let addValue = (this.state.childs - 1) + (this.state.adults)
    let numOfChildren = (this.state.childs) - 1
    this.setState({ childs: numOfChildren })
    let totalCapacity = parseInt(membersCapacity) + parseInt(childsCapacity)
    let RoomCount = (this.state.adults / membersCapacity)
    let TotalRoomCount = (addValue / totalCapacity)
    let totalIndex = TotalRoomCount % 1
    let index = RoomCount % 1

    if (RoomCount > TotalRoomCount) {
      if (index === 0) {
        this.setState({ rooms: RoomCount })
      } else {
        let addRoomCount = (RoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: addValue })
      }
    } else {
      if (totalIndex === 0) {
        this.setState({ rooms: TotalRoomCount })
      } else {
        let addRoomCount = (TotalRoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: addValue })
      }
    }
  }
  handleRooms (status, membersCapacity, childsCapacity) {
    let numOfPeople = this.state.adults + this.state.childs
    let noOfAdults = this.state.adults
    let totalCapacity = parseInt(membersCapacity) + parseInt(childsCapacity)
    let RoomCount = (noOfAdults / parseInt(membersCapacity))
    let TotalRoomCount = (numOfPeople / totalCapacity)
    let totalIndex = TotalRoomCount % 1
    let index = RoomCount % 1
    let roomsCount = (index === 0) ? RoomCount : parseInt(RoomCount.toString().split('.')[0]) + 1
    let totalRoomsCount = (totalIndex === 0) ? TotalRoomCount : parseInt(TotalRoomCount.toString().split('.')[0]) + 1
    if (status === 'add') {
      var addRoom = (this.state.rooms) + (1)
      this.setState({ rooms: addRoom, errorMessage: '' })
    } else {
      let subRoom = (this.state.rooms) - (1)
      if (subRoom < roomsCount || subRoom < totalRoomsCount) {
      } else {
        let subRoom = (this.state.rooms) - (1)
        this.setState({ rooms: subRoom, errorMessage: '' })
      }
    }
  }
  handleBooking () {
    const navigation = this.props.navigation;
    const propertyData = this.state.propertyInfoData
    let checkInHours = moment(this.state.checkInTime, ['hh:mm A']).format('HH:mm')
    let checkOutHours = moment(this.state.checkOutTime, ['hh:mm A']).format('HH:mm')
    let cidt = moment(this.state.checkInDate).format('YYYY-MM-DD')
    let codt = moment(this.state.checkOutDate).format('YYYY-MM-DD')

    let postJson = {
      area: propertyData.spLocationObj.area,
      city: propertyData.spLocationObj.city,
      state: propertyData.spLocationObj.state,
      country: propertyData.spLocationObj.country,
      latitude: propertyData.spLocationObj.latitude,
      longitude: propertyData.spLocationObj.longitude,
      zip: propertyData.spLocationObj.zip,
      spServiceProviderId: propertyData.spServiceProviderId,
      spServiceProvider: propertyData.spServiceProvider,
      spLocationId: propertyData.spLocationId,
      contactPerson: propertyData.spLocationObj.contactPerson,
      mobileNumber: propertyData.spLocationObj.mobileNumber,
      spemail: propertyData.spLocationObj.email,
      address: propertyData.spLocationObj.address,
      noOfDays: this.state.totalDays,
      checkInDate: cidt + ' ' + checkInHours,
      checkOutDate: codt + ' ' + checkOutHours,
      noOfChilds: this.state.childs.toString(),
      noOfAdults: this.state.adults,
      noOfRooms: this.state.rooms,
      spPropertyId: propertyData.propertyId._id ? propertyData.propertyId._id : propertyData.propertyId,
      spPropertyTitle: propertyData.propertyTitle,
      spPropertyType:  propertyData.propertyType,
      spPropertyInfoId: propertyData._id,
      totalPrice: (this.state.rooms) * (this.state.totalDays) * (this.state.amount),
      bookingType: 'Days'
    }
    navigation.navigate('ConfirmBooking', {data: propertyData, bookingData: postJson})
  }
  handleDates () {
    const UserStore = this.props.UserStore;
    let checkInDate = moment(UserStore.checkIn).format('YYYY-MM-DD')
    let checkOutDate =  moment(UserStore.checkOut).format('YYYY-MM-DD')
    this.getNumOfDays(checkInDate, checkOutDate)
    this.handleDaysAmount(checkInDate)
    this.getNumberOfRoomsCount(checkInDate, checkOutDate, this.state.checkInTime, this.state.checkOutTime)
    this.setState({ bookingCalendarScreen: false, checkInDate: checkInDate, checkOutDate: checkOutDate})
  }
  setRoomsCount () {
    let propertyInfoData = this.state.propertyInfoData
    let guestRooms = this.state.rooms
    let numOfAdults = this.state.adults
    let actualMembers = numOfAdults + this.state.childs
    let mc = propertyInfoData ? parseInt(propertyInfoData.membersCapacity) : 1
    let cc = propertyInfoData ? parseInt(propertyInfoData.childsCapacity) : 0
    let totalCapacity = mc + cc
    let RoomCount = (numOfAdults / mc)
    let TotalRoomCount = (actualMembers / totalCapacity)
    let index = RoomCount % 1
    let totalIndex = TotalRoomCount % 1
    if (RoomCount > TotalRoomCount) {
      if (index === 0) {
        this.setState({ rooms: guestRooms <= RoomCount ? RoomCount : guestRooms })
      } else {
        let addRoomCount = (RoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: guestRooms <= addValue ? addValue : guestRooms })
      }
    } else {
      if (totalIndex === 0) {
        this.setState({ rooms: guestRooms <= TotalRoomCount ? TotalRoomCount : guestRooms })
      } else {
        let addRoomCount = (TotalRoomCount.toString().split('.')[0])
        let addValue = parseInt(addRoomCount) + 1
        this.setState({ rooms: guestRooms <= addValue ? addValue : guestRooms })
      }
    }
  }
  render() {
    const navigation = this.props.navigation;
    const data = this.props.data
    return (
        !this.state.bookingCalendarScreen  
        ? <View >
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
              <StatusBar barStyle='light-content' />
              <View style={styles.status} />
              <View style={styles.headerMainView} >
                <View style={styles.headerLeft} >
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()}>
                    <Icon name='ios-arrow-back' style={styles.iconMenuStyle}  />
                  </TouchableHighlight>
                </View>
                <View style={styles.headerBody} >
                  <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.headerTitleStyle}> {this.state.propertyInfoData && this.state.propertyInfoData.propertyTitle ? this.state.propertyInfoData.propertyTitle : this.state.propertyInfoData.spPropertyInfoId.propertyTitle}</Text>
                </View>
              </View>
            </LinearGradient>
            {this.state.loading
              ? <View style={ styles.activeIndicatorView }><ActivityIndicator color="#ffffff" size='large' style={ styles.activeIndicatorStyle } /></View>
              : null}
            <View style={styles.imageView}>
              <Image source={data.propertyId.imagePath ? { uri: PUBLIC_DOMAIN + data.propertyId.imagePath } : require('../../../assets/dummy_property.jpg')} style={styles.imageStyle} />
            </View>
          <View style={styles.editableContainer}>
            <TouchableOpacity onPress={()=> this.setState({ bookingCalendarScreen: true })} style={{ flex:3, justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text style={styles.editablelabel}><Icon name='md-calendar' style={styles.editablelabelIcon} /> {' '}{i18n.t('lanButtonCheckIn')}</Text>
              <Text style={styles.editableValues}>{`${this.state.checkInTime},${moment(this.state.checkInDate, 'YYYY-MM-DD').format('MMM-DD')}`}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.setState({ bookingCalendarScreen: true })} style={{ flex:3, justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text style={styles.editablelabel}><Icon name='md-calendar' style={styles.editablelabelIcon} /> {' '}{i18n.t('lanButtonCheckOut')}</Text>
              <Text style={styles.editableValues}>{`${this.state.checkOutTime},${moment(this.state.checkOutDate, 'YYYY-MM-DD').format('MMM-DD')}`}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.setState({ guestModal: true })} style={{ flex:3, justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text style={styles.editablelabel}><Icon name='ios-contacts' style={styles.editablelabelIcon} /> {' '}{i18n.t('lanButtonRoomsGuests')}</Text>
              <Text style={styles.editableValues}>{`${this.state.rooms} Rooms / ${this.state.adults} Guests`}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 5, marginHorizontal:16, borderBottomColor: '#d1d1d1', borderBottomWidth: 0.5 }} ></View>
          
          <View style={styles.productDetailsView} >
            <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
              <View style={styles.content}>
                <View style={{ paddingBottom: 10, borderColor: '#d1d1d1', borderBottomWidth: 0.5, }} >
                  <Text style={ styles.titleHotel}>{data && data.propertyTitle ? data.propertyTitle : data.spPropertyInfoId.propertyTitle}</Text>
                  <Text style={styles.addressValues} >{data.spLocationObj.address}.</Text>
                </View>
                <View style={{ marginTop: (Platform.OS === 'android' ? 8 : 18), marginBottom: 5, height: 60, borderColor: '#d1d1d1', borderBottomWidth: 0.5, }}>
                  <Text style={[styles.textmedium, styles.Title]}>{i18n.t('lanLabelAmenities')}</Text>
                  <Swiper style={styles.wrapper} showsButtons={false} showsPagination={false} autoplay={true} autoplayTimeout={3.5}>
                    <View style={styles.slide1}>
                      <View style={{ flexDirection: 'row', marginVertical: 0 }} >
                        <View style={styles.aminitiesStyles}>
                          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                          {this.state.amenitiesData && this.state.amenitiesData.length > 0 ? this.state.amenitiesData.map((item, i) =>
                            item.amenityStatus == 'Available'
                            ? <View style={{ flex: 1, marginRight:10 }} key={i}>
                                  <View style={{width: 30, height: 20}} >
                                    <Image source={item.amenityIconPath ? {uri: PUBLIC_DOMAIN + item.amenityIconPath} : null} style={styles.imageStyleAmen} />
                                  </View>
                              </View> : null ) : 
                            <Text style={styles.textSmall}>{i18n.t('lanLabelNoAmenities')}</Text>}
                            </ScrollView>
                        </View>
                      </View>
                    </View>
                  </Swiper>
                </View>
                <View>
                {this.state.servicesData && this.state.servicesData.length > 0 ?    
                <View style={{ marginTop: (Platform.OS === 'android' ? 8 : 18), marginBottom: 5, height: 60, borderColor: '#d1d1d1', borderBottomWidth: 0.5, }}>
                  <Text style={[styles.textmedium, styles.Title]}>{i18n.t('lanLabelServices')}</Text>
                  <Swiper style={styles.wrapper} showsButtons={false} showsPagination={false} autoplay={true} autoplayTimeout={3.5}>
                    <View style={styles.slide1}>
                      <View style={{ flexDirection: 'row', marginVertical: 0 }} >
                        <View style={styles.aminitiesStyles}>
                          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                          {this.state.servicesData && this.state.servicesData.length > 0 ? this.state.servicesData.map((item, i) =>
                            item.serviceStatus === 'Available'
                            ? <View style={{ flex: 1, margin:5 }} key={i}>
                                  <View >
                                  <Text style={{ color: '#000', fontSize:12, fontFamily: 'Roboto_medium', }} >{item.serviceName},</Text>
                                    {/* <Image source={item.serviceIconPath ? {uri: PUBLIC_DOMAIN + item.serviceIconPath} : null} style={styles.imageStyleAmen} /> */}
                                  </View>
                              </View> : null) : null}
                            </ScrollView>
                        </View>
                      </View>
                    </View>
                  </Swiper>
                </View> : null }
                </View>
                </View>
            </ScrollView>
            <View style={styles.fixedContainer}>
              <View style={{ justifyContent:'center', alignItems: 'center'}}> 
                <Text style={{ color: 'red', fontSize:13, fontFamily: 'Roboto_medium', }}>{this.state.errorMessage}</Text>
                {!this.state.propertyBlocked && this.state.avaliableRoomCount !== 0
                  ? <Text style={{ color: 'green', fontSize:12, fontFamily: 'Roboto_medium', justifyContent:'center' }}>
                      {`${i18n.t('lanLabelHurryUpOnly')} ${this.state.avaliableRoomCount} ${i18n.t('lanLabelRoomsLeft')}`}
                    </Text>
                  : null }
              </View>
              <View style={styles.fixedContainerTwo}>
                <View style={{flex:2, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={styles.fixedValuesPrice} >₹ {(this.state.rooms) * (this.state.totalDays) * (this.state.amount)}</Text>
                </View>
                <View style={{flex:2, alignItems: 'flex-end', justifyContent: 'center'}}>
                  {!this.state.propertyBlocked
                  ?  <TouchableOpacity style={styles.activeButton} onPress={() => this.handleBooking()}><Text style={styles.fixedValues}>{i18n.t('lanButtonBookNow')}</Text></TouchableOpacity>
                  :  <TouchableOpacity style={styles.deActiveButton}><Text style={styles.fixedValues}>{i18n.t('lanButtonBookNow')}</Text></TouchableOpacity>}
                </View>
              </View>
            </View>
          </View>

          <Modal isVisible={this.state.guestModal} style={styles1.modalView}>
            <View style={styles1.modalContainer}>
              <View style={styles1.mainView} >
                <View>
                  <Text style={styles1.bigTxt}> {i18n.t('lanLabelGuests')} </Text>
                </View>
                <View>
                  <List style={styles1.list}>
                    <ListItem style={styles1.GuestlistItem}>
                      <View style={styles1.guestTypeTitleView} >
                        <Text style={styles1.guestTypeTxt}> {i18n.t('lanLabelAdults')}</Text>
                      </View>
                      <View style={styles1.minusIconView} >
                        <View style={styles1.circle} >
                          <TouchableOpacity
                            disabled={this.state.adults <= 1}
                            onPress={() => this.handleAdultsDecrease(data.membersCapacity, data.childsCapacity)}
                          >
                            <Icon name='ios-remove' style={styles1.removeIcon} />
                          </TouchableOpacity> 
                        </View>
                      </View>
                      <View style={styles1.guestNumberView} >
                        <View style={styles1.guestNumberTxtView}>
                          <Text style={styles1.guestNumberTxt}>{this.state.adults}</Text>
                        </View>
                      </View>
                      <View style={styles1.plusIconView} >
                        <View style={styles1.circle} >
                          <TouchableOpacity
                            disabled={(this.state.adults) > ( (this.state.avaliableRoomCount) * (data.membersCapacity) - 1 ) || ( (this.state.adults) + (this.state.childs) >  ( (this.state.avaliableRoomCount) * ( parseInt(data.membersCapacity) + parseInt(data.childsCapacity) )  - 1 ) ) ? true : false}
                            onPress={() => this.handleAdultsIncrease(data.membersCapacity, data.childsCapacity)}
                          >
                            <Icon name='ios-add' style={styles1.addIcon} />
                          </TouchableOpacity>  
                        </View>
                      </View>
                    </ListItem>
                    <ListItem style={styles1.GuestlistItem}>
                      <View style={styles1.guestInfoView} >
                        <View style={styles1.guestTypeTitleView} >
                          <Text style={styles1.guestTypeTxt}>{i18n.t('lanLabelChildren')}</Text>
                          <Text style={styles1.ageinfoTxt} > {i18n.t('lanLabelUptoTwelveYears')}</Text>
                        </View>
                        <View style={styles1.minusIconView} >
                          <View style={styles1.circle} >
                            <TouchableOpacity
                              disabled={this.state.childs <= 0}
                              onPress={() => this.handleChildsDecrease(data.membersCapacity, data.childsCapacity)}
                            >
                            <Icon name='ios-remove' style={styles1.removeIcon} />
                            </TouchableOpacity>  
                          </View>
                        </View>
                        <View style={styles1.guestNumberView} >
                          <View style={styles1.guestNumberTxtView}>
                            <Text style={styles1.guestNumberTxt}> {this.state.childs} </Text>
                          </View>
                        </View>
                        <View style={styles1.plusIconView} >
                          <View style={styles1.circle} >
                            <TouchableOpacity
                              disabled={( (this.state.childs) > (this.state.avaliableRoomCount) * (data.childsCapacity) -1 ) && ( (this.state.adults) > (this.state.avaliableRoomCount) * (data.membersCapacity) - 1  ) || ( (this.state.adults) + (this.state.childs) >  ( (this.state.avaliableRoomCount) * ( parseInt(data.membersCapacity) + parseInt(data.childsCapacity) )  - 1 ) ) ? true : false}
                              onPress={() => this.handleChildsIncrease(data.membersCapacity, data.childsCapacity)}
                            >
                              <Icon name='ios-add' style={styles1.addIcon} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </ListItem>
                    <ListItem style={styles1.GuestlistItem}>
                      <View style={styles1.guestInfoView} >
                        <View style={styles1.guestTypeTitleView} >
                          <Text style={styles1.guestTypeTxt}>{i18n.t('lanLabelRooms')}</Text>
                        </View>
                        <View style={styles1.minusIconView} >
                          <View style={styles1.circle} >
                            <TouchableOpacity
                              disabled={this.state.roomSubButton || this.state.rooms <= 1}
                              onPress={() => this.handleRooms('sub', data.membersCapacity, data.childsCapacity)}
                            >
                              <Icon name='ios-remove' style={styles1.removeIcon} />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={styles1.guestNumberView} >
                          <View style={styles1.guestNumberTxtView}>
                            <Text style={styles1.guestNumberTxt}> {this.state.rooms} </Text>
                          </View>
                        </View>
                        <View style={styles1.plusIconView} >
                          <View style={styles1.circle} >
                            <TouchableOpacity
                              disabled={this.state.avaliableRoomCount <= this.state.rooms ? true : false} 
                              onPress={() => this.handleRooms('add', data.membersCapacity, data.childsCapacity)}
                            >
                              <Icon name='ios-add' style={styles1.removeIcon} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </ListItem>
                  </List>
                </View>
                {(this.state.numOfAdults) > ((this.state.avaliableRoomCount) * (data.membersCapacity) - 1) || ((this.state.numOfAdults) + (this.state.numOfChilds) > ((this.state.avaliableRoomCount) * (parseInt(data.membersCapacity) + parseInt(data.childsCapacity)) - 1))
                ? <Text style={styles1.errorMessage}>{i18n.t('lanErrorReachedMaximumLimitOfAdults')}</Text>
                : ((this.state.numOfChilds) > (this.state.avaliableRoomCount) * (data.childsCapacity) - 1) && ((this.state.numOfAdults) > (this.state.avaliableRoomCount) * (data.membersCapacity) - 1) || ((this.state.numOfAdults) + (this.state.numOfChilds) > ((this.state.avaliableRoomCount) * (parseInt(data.membersCapacity) + parseInt(data.childsCapacity)) - 1))
                  ? <Text style={styles1.errorMessage}>{i18n.t('lanErrorReachedMaximumLimitOfChilds')}</Text>
                  : this.state.avaliableRoomCount <= this.state.rooms
                  ? <Text style={styles1.errorMessage}>{i18n.t('lanErrorReachedMaximumLimitOfRooms')}</Text>
                : null
                }
                <View style={styles1.btnModal} >
                  <AwesomeButton block success
                  onPress={() => this.setState({ guestModal: !this.state.guestModal })}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={22} >
                    <Text style={styles1.BtnText}>{i18n.t('lanButtonDone')}  </Text>
                  </AwesomeButton>
                </View>
              </View>
            </View>
          </Modal>
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
        </View>
       : <BookingCalendarScreen handleDates={this.handleDates} bookingType={this.state.bookingType} navigation={navigation} />
    )
  }
}