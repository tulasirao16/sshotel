import React from 'react';
import { Text, View, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'native-base';
import styles from './css/BookingCalendarCss';
import AwesomeButton from "react-native-really-awesome-button";
import { LinearGradient } from 'expo-linear-gradient';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import * as Animatable from 'react-native-animatable';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
import i18n from 'i18n-js';

@inject(['UserStore'])
@observer
export default class BookingCalendarScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null
    }
  };
  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    const UserStore = this.props.UserStore;
    this.state = {
      checkInDate: moment().format('LL'),
      checkOutDate: moment().add(1, 'days').format('LL'),
      selectedHours: 0,
      checkOutDateNumber: moment().add(1, 'days').format('YYYY-MM-DD'),
      selectedMinutes: 0,
      minDate: moment().format('YYYY-MM-DD'),
      maxDate: moment().add(3, 'month').endOf('month').format('YYYY-MM-DD'),
      customDatesStyles: [],
      selectedDayColor: '#01a4a2',
      bookingType: this.props.bookingType ? this.props.bookingType : ''

    };
    this.onDateChange = this.onDateChange.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleBack = this.handleBack.bind(this)
  }
  componentWillMount() {
    let customDates = [];
    const UserStore = this.props.UserStore;
    let noOfDays = moment(UserStore.checkOut).diff(moment(UserStore.checkIn), 'days') + 1;
    for (i = 0; i < noOfDays; i++) {
      customDates.push({
        date: moment(UserStore.checkIn).add(i, 'days').format('LL'),
        style: { backgroundColor: '#009EE3' },
        textStyle: { color: 'black' }, // sets the font color
        containerStyle: [], // extra styling for day container
      });
    }
    UserStore.customDates = customDates;
    this.setState({ customDatesStyles: customDates })
    let dt = moment(this.state.checkInDate, 'YYYY-MM-DD HH:mm:ss')
    let dateName = dt.format('dddd')
    let weekEnd = dateName === 'Saturday' || dateName === 'Sunday' ? 'Weekend' : 'Weekday'
    UserStore.weekEnd = weekEnd
  }

  onDateChange(date, type) {
    const UserStore = this.props.UserStore;
    let customDates = [];
    if (type === 'END_DATE') {
      UserStore.checkOut = moment(date).format('LL')
      this.setState({
        checkOutDate: moment(date).format('LL'),
        checkOutDateNumber: moment(date).format('YYYY-MM-DD')
      });
    } else {
      var validateCheckOut = moment(this.state.checkOutDateNumber, 'YYYY-MM-DD').valueOf()
      var validateCheckIn = moment(date, 'YYYY-MM-DD').valueOf();
      let dt = moment(date, 'YYYY-MM-DD HH:mm:ss')
      let dateName = dt.format('dddd')
      let weekEnd = dateName === 'Saturday' || dateName === 'Sunday' ? 'Weekend' : 'Weekday'
      UserStore.weekEnd = weekEnd
      if(validateCheckOut < validateCheckIn  ) {
        UserStore.checkIn = moment(date).format('LL')
        this.setState({
          checkOutDate: null,
          checkInDate: moment(date).format('LL'),
        });
      } else {
        UserStore.checkIn = moment(date).format('LL')
        this.setState({
          checkInDate: moment(date).format('LL'),
          checkOutDate: null,
        });
      }
    }
    customDates.push({
      date: date,
      style: { backgroundColor: '#009EE3' },
      textStyle: { color: 'black' }, // sets the font color
      containerStyle: [], // extra styling for day container
    });
    UserStore.customDates = customDates;
    this.setState({ customDatesStyles: customDates });
  }
  handleDate() {
    const navigation = this.props.navigation;
    const UserStore = this.props.UserStore
    UserStore.checkIn = this.state.checkInDate
    UserStore.checkOut = this.state.checkOutDate
    this.props.handleDates()
  }
  handleBack () {
    const navigation = this.props.navigation;
    const UserStore = this.props.UserStore
    UserStore.checkIn = this.state.checkInDate
    UserStore.checkOut = this.state.checkOutDate
    this.props.handleDates()
  }
  render() {
    const navigation = this.props.navigation;
    const UserStore = this.props.UserStore;
    const { checkInDate, checkOutDate } = this.state;

    return (
        <View >
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft} >
              <View>
                {this.state.bookingType == 'Days'
                ? this.state.checkInDate === this.state.checkOutDate || !this.state.checkOutDate
                 ? null
                  : <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => this.handleBack()} />
                : !this.state.checkOutDate
                  ? null 
                    : <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => this.handleBack()} /> }
              </View>
            </View>
            <View style={styles.headerBody} >
              <View>
                <Text style={styles.headerTitleStyle}>{/*Date Filter*/} </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.filterBodyContainer} >
          <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearGradientOne}>
            <View style={{ flexDirection: 'row', width: DEVICE_WIDTH, paddingVertical:15, paddingHorizontal:18, left: 0, borderWidth:0, borderColor: '#01a4a2', borderRadius:5 }} >
              <View style={{ flex: 3, alignItems:'flex-start', justifyContent: 'center', borderRightWidth:0.4, borderRightColor: '#a6a6a6'  }}>
                <Text style={[styles.startEndHeadings, styles.fontMediumStyle]} >{i18n.t('lanButtonCheckInTime')}</Text>
                <View style={styles.startDateView}>
                  <Text style={styles.dateTxt} >{moment(UserStore.checkIn).format('MMM DD, YY')}</Text>
                </View>
              </View>
              <View style={{ flex: 3, alignItems:'flex-start', justifyContent: 'center', paddingLeft:40 }}>
                <Text style={[styles.startEndHeadings, styles.fontMediumStyle]} >{i18n.t('lanButtonCheckOutTime')}</Text>
                <View style={styles.startDateView}>
                  {this.state.checkOutDate
                    ? <Text style={styles.dateTxt} >{moment(UserStore.checkOut).format('MMM DD, YY')}</Text>
                    : <Text style={styles.dateTxtSelect} >{i18n.t('lanButtonSelectADate')}</Text>}
                </View>
              </View>
            </View>
          </LinearGradient>
          <View style={styles.container}>
            <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={true}
              minDate={this.state.minDate}
              maxDate={this.state.maxDate}
              weekdays={['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']}
              months={[
                'January',
                'Febraury',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
              ]}
              previousTitle="Previous"
              nextTitle="Next"
              selectedRangeStyle={true}
              selectedDayColor={this.state.selectedDayColor}
              scaleFactor={375}
              customDatesStyles={UserStore.customDates}
              textStyle={{
                fontFamily: 'Roboto_medium',
                color: '#000000',
              }}
              onDateChange={this.onDateChange}
            />
          </View>
          <View>
           {!this.state.checkOutDate  
            ? <View style={styles.errorView}>
                <Text style={styles.dateTxtError} >{i18n.t('lanLabelSelectCheckOutDate')}</Text>
              </View>
            : this.state.bookingType == 'Days' && this.state.checkInDate === this.state.checkOutDate
                ? <View style={styles.errorView}>
                    <Text style={styles.dateTxtError} >{i18n.t('lanLabelCheckoutDateShouldBeGreaterThanCheckInDate')}</Text>
                  </View>
                : null } 
            <Animatable.View animation="slideInUp"  delay={100} style={{ marginHorizontal: 10, marginTop: 30, flexDirection: 'row', justifyContent:'center', alignItems: 'center', }} >
              {this.state.bookingType == 'Days'
              ? this.state.checkInDate === this.state.checkOutDate || !this.state.checkOutDate
                ? <AwesomeButton disabled
                    width={DEVICE_WIDTH - 50} height={50} paddingHorizontal={50} borderRadius={10} marginTop={20}>
                    <Text style={{ color: 'white', fontFamily:'Roboto_light', fontSize:17 }} >{i18n.t('lanButtonContinue')} </Text>
                  </AwesomeButton>
                : <AwesomeButton block success
                    onPress={() => this.handleDate()}
                    width={DEVICE_WIDTH - 50} height={50} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={10} marginTop={20}>
                    <Text style={{ color: 'white', fontFamily:'Roboto_light', fontSize:17 }} >{i18n.t('lanButtonContinue')} </Text>
                  </AwesomeButton>
              : !this.state.checkOutDate
                ? <AwesomeButton disabled
                    width={DEVICE_WIDTH - 50} height={50} paddingHorizontal={50} borderRadius={10} marginTop={20}>
                    <Text style={{ color: 'white', fontFamily:'Roboto_light', fontSize:17 }} >{i18n.t('lanButtonContinue')}</Text>
                  </AwesomeButton>
                : <AwesomeButton block success
                    onPress={() => this.handleDate()}
                    width={DEVICE_WIDTH - 50} height={50} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={10} marginTop={20}>
                    <Text style={{ color: 'white', fontFamily:'Roboto_light', fontSize:17 }} >{i18n.t('lanButtonContinue')} </Text>
                  </AwesomeButton>  }
            </Animatable.View>
          </View>
        </View>
      </View>
    );
  }
}
