import React from 'react';
import { Text, View, Platform, ScrollView, Dimensions, TouchableHighlight, StatusBar, ImageBackground, ActivityIndicator, TextInput, TouchableOpacity, Image, BackHandler} from 'react-native';
import { Button, Icon, Picker, Card, CardItem, Left, Body } from 'native-base';
import styles from './css/CalendarScreenCss';
import { LinearGradient } from 'expo-linear-gradient';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import AwesomeButton from "react-native-really-awesome-button";
import RadioButton from 'radio-button-react-native';
import i18n from 'i18n-js';
import { PUBLIC_DOMAIN } from '../../../constants'; 
import Toast, { DURATION } from 'react-native-easy-toast';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
@inject(['PropertyStore'])
@observer
export default class CreateBlockedDates extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
     header: null
    }
  };
  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    this.state = {
      propertyID: navigation.state.params && navigation.state.params.propertyObj ? navigation.state.params.propertyObj.propertyID : '',
      spLocationId: navigation.state.params && navigation.state.params.propertyObj ? navigation.state.params.propertyObj.spLocationId : '',
      spServiceProviderId: navigation.state.params && navigation.state.params.propertyObj ? navigation.state.params.propertyObj.spServiceProviderId : '',
      selectedStartDate: null,
      selectedEndDate: null,
      checkInDate: PropertyStore.createBlockedDates && PropertyStore.createBlockedDates.blockingFromDate ? PropertyStore.createBlockedDates.blockingFromDate : '',
      checkOutDate: PropertyStore.createBlockedDates && PropertyStore.createBlockedDates.blockingToDate ? PropertyStore.createBlockedDates.blockingToDate : '',
      customDatesStyles: [],
      blockingType: PropertyStore.createBlockedDates && PropertyStore.createBlockedDates.blockingType ? PropertyStore.createBlockedDates.blockingType : 'Continuous Blocking',
      dates: PropertyStore.createBlockedDates && PropertyStore.createBlockedDates.dateArray ? PropertyStore.createBlockedDates.dateArray : [],
      isloading: false,
      errorMessage: '',
      submitDisabled: false,
      createProperty: navigation.state.params && navigation.state.params.propertyObj && navigation.state.params.propertyObj.property ? navigation.state.params.propertyObj.property : '',
      reload: false,
      reloadFunction: ''
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.handleBlocking = this.handleBlocking.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }
  componentWillMount () {
    let customDates = [];
    let dateArray = this.state.dates;
    for (i = 0; i < dateArray.length; i++) {
      var value = {
        date: moment(dateArray[i]).format('YYYY-MM-DD'),
        style: { backgroundColor: '#009EE3' },
        textStyle: { color: 'black' }, // sets the font color
        containerStyle: [], // extra styling for day container
      };
      customDates.push(value);
      // dateArray.push(dateValue);
    }
    this.setState({customDatesStyles: customDates})
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
  handleReset () {
    const PropertyStore = this.props.PropertyStore;
    PropertyStore.createBlockedDates = {};
    this.setState({ blockingType: 'Continuous Blocking', checkInDate: '', checkOutDate: '', dates: [], customDatesStyles: []})
  }

  onValueChange (value) {
    if(value == 'Continuous Blocking') {
      this.setState({customDatesStyles: [], blockingType: value, errorMessage: ''});
    } else {
      this.setState({ blockingType: value, checkInDate: '', checkOutDate: '', errorMessage: '' });
    }
  }

  onDateChange(date, type) {
    if(this.state.blockingType == 'Continuous Blocking') {
      if (type === 'END_DATE') {
        this.setState({
          checkOutDate: moment(date).format('YYYY-MM-DD'), errorMessage: ''
        });
      } else {
        this.setState({
          checkInDate: moment(date).format('YYYY-MM-DD'), errorMessage: '',
          checkOutDate: null,
        });
      }
    } else {
      let customDates = this.state.customDatesStyles;
      let dateArray = this.state.dates;
      let dateValue = moment(date).format('YYYY-MM-DD');
      // let getDate = dateArray.find(data => (data == dateValue));
      //   if (getDate) {
        // let i = customDates.indexOf(dateValue);
        let j = dateArray.indexOf(dateValue);
        if(j !== -1) {
        customDates.splice(j, 1);
        dateArray.splice(j, 1);
      } else {
        if(this.state.customDatesStyles.length > 9) {
          // alert(i18n.t('lanErrorYouCannotBlockMoreThanTenDates'));
          _this.refs.toast.show(i18n.t('lanErrorYouCannotBlockMoreThanTenDates'));
        } else {
        var value = {
          date: dateValue,
          style: { backgroundColor: '#009EE3' },
          textStyle: { color: 'black' }, // sets the font color
          containerStyle: [], // extra styling for day container
        };
        customDates.push(value);
        dateArray.push(dateValue);
      }
    }
       this.setState({ customDatesStyles: customDates, dates: dateArray, errorMessage: '' })
    }
  }
  handleBlocking () {
    const PropertyStore = this.props.PropertyStore;
    const navigation = this.props.navigation;
    if(!this.state.blockingType) {
      this.setState({errorMessage: i18n.t('lanErrorBlockingTypeIsRequired') });
    } else if(this.state.blockingType == 'Continuous Blocking' && !this.state.checkInDate) {
      this.setState({errorMessage: i18n.t('lanErrorBlockingFromDateIsRequired') });
    } else if(this.state.blockingType == 'Continuous Blocking' && !this.state.checkOutDate) {
      this.setState({errorMessage: i18n.t('lanErrorBlockingToDateIsRequired') });
    } else if(this.state.blockingType == 'Random Blocking' && !this.state.customDatesStyles.length > 0) {
      this.setState({errorMessage: i18n.t('lanErrorBlockingDatesAreRequired') });
    } else {
      this.setState({ isloading: true, submitDisabled: true });
      let post_json;
      if(this.state.blockingType == 'Continuous Blocking') {
        post_json  = {
          blockingType: this.state.blockingType,
          blockingFromDate: this.state.checkInDate,
          blockingToDate : this.state.checkOutDate,
          propertyID: this.state.createProperty && this.state.createProperty == 'create' ? '' : this.state.propertyID,
          spLocationId: this.state.createProperty && this.state.createProperty == 'create' ? '' : this.state.spLocationId,
          spServiceProviderId: this.state.createProperty && this.state.createProperty == 'create' ? '' : this.state.spServiceProviderId
        };
      } else {
        post_json  = {
          blockingType: this.state.blockingType,
          customDates: this.state.customDatesStyles,
          dateArray : this.state.dates,
          propertyID: this.state.createProperty && this.state.createProperty == 'create' ? '' : this.state.propertyID,
          spLocationId: this.state.createProperty && this.state.createProperty == 'create' ? '' : this.state.spLocationId,
          spServiceProviderId: this.state.createProperty && this.state.createProperty == 'create' ? '' : this.state.spServiceProviderId
        };
      }
      if(this.state.createProperty == 'create') {
        PropertyStore.createBlockedDates = post_json;
        this.setState({ isloading: false, submitDisabled: false });
        navigation.navigate('CreateProperty', {enableBlocked: true});
      } else {
        let _this = this;
        let isLoading = setTimeout(function () {
          _this.setState({ isloading: false, reload: true, submitDisabled: false });
        }, 20000);
        PropertyStore.createSPPropertyBlockedDates(post_json, function(resObj) {
          clearTimeout(isLoading)
          _this.setState({ isloading: false, submitDisabled: false });
          if(resObj.statusCode == '0000') {
            PropertyStore.refresh = 'refresh';
            navigation.navigate('BlockDatesScreen', {date: 'refresh'});
          } else if(resObj.statusCode == '1011') {
            // alert (i18n.t('lanErrorBlockedDatesDependencys'));
            _this.refs.toast.show(i18n.t('lanErrorBlockedDatesDependencys'));
          } else if(resObj.statusCode == '1013') {
            // alert(i18n.t('lanErrorYouHaveAlreadyBlockedThisDates'));
            _this.refs.toast.show(i18n.t('lanErrorYouHaveAlreadyBlockedThisDates'));
          }
        });
      }
    }
  }

  handleReload = () => {
    const navigation = this.props.navigation
    navigation.navigate('BlockDatesScreen');
  }
  render() {
    const navigation = this.props.navigation;
    let propertyData = navigation.state.params && navigation.state.params.propertyObj ? navigation.state.params.propertyObj : {}
    return (
      !this.state.reload
       ? <View style={styles.container}>
          <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <StatusBar barStyle='light-content' />
            <View style={styles.status} />
            <View style={styles.headerMainView} >
              <View style={styles.headerLeft}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()} >
                  <Icon name='ios-arrow-back'  style={styles.iconMenuStyle} />
                </TouchableHighlight>
              </View>
              <View style={styles.headerBody}>
                  <Text style={styles.headerTitleStyle}> {i18n.t('lanTitleCreateBlockedDates')} </Text>
              </View>
              <View style={styles.headerRight} >
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.handleReset()}>
                    <Icon name='refresh' style={styles.iconRefreshStyle} />
                  </TouchableHighlight>
                </View>
            </View>
          </LinearGradient>
          {this.state.isloading
            ? <View style={ styles.activeIndicatorView }><ActivityIndicator color="#FFFFFF" size='large' style={ styles.activeIndicatorStyle } /></View>
            : null}
          <View style={ styles.businessNameView } >
            <Card style={ styles.card }>
              <CardItem style={ styles.cardItemStyle }>
                  <Left style={[styles.leftImageView, styles.listItemView ]}>
                      <View style={styles.imageBox} >
                          <Image source={propertyData.propertyImage ? {uri: PUBLIC_DOMAIN + propertyData.propertyImage} :require('../../../assets/dummy_property.jpg')} style={styles.imgStyle} />
                      </View>
                      <Body>
                          <View style={ styles.floatingInputView } >
                              <Text style={styles.propertyTitle}> {propertyData.propertyTitle} </Text>
                              <Text style={styles.titleLocationType}> {propertyData.propertyArea} </Text>
                              <Text style={styles.titleType}> {propertyData.propertyType} - {i18n.t('lanTitleCreateBlockedDates')} </Text>
                          </View>
                      </Body>
                  </Left>  
              </CardItem>
            </Card>
          </View>
          <ScrollView>
          {/* <View style={ styles.pickerViewStyle } >
            <Text style={ styles.pickerTextStyle } >Select Blocking Type<Text style={{color: 'red'}}>*</Text></Text>
            <Picker
                iosHeader='Select one'
                iosIcon={<Icon name='arrow-down' />}
                mode='dropdown'
                // iosIcon={<Icon name="arrow-down" />}
                style={ styles.pickerStyle }
                selectedValue={this.state.blockingType}
                onValueChange={this.onValueChange}>
                <Picker.Item label="Continuous Blocking" value="Continuous Blocking" />
                <Picker.Item label="Random Blocking" value="Random Blocking" />
            </Picker>
          </View> */}
          <View style={ styles.blockingTypeView }>
            <View style={ styles.blockingView } >
                <View style={{ flexDirection: 'row'}}>
                    <RadioButton currentValue={this.state.blockingType} value='Continuous Blocking' onPress={(value)=> this.onValueChange(value)} />
                    <View style={{ paddingHorizontal:5, paddingVertical:3 }} >
                        <Text style={styles.radioTitle}>Continuous Blocking</Text>
                    </View>  
                </View>
            </View>
            <View style={ styles.blockingView } >
                <View style={{ flexDirection: 'row'}}>
                    <RadioButton currentValue={this.state.blockingType} value='Random Blocking' onPress={(value)=> this.onValueChange(value)} />
                    <View style={{ paddingHorizontal:4, paddingVertical:3 }} >
                        <Text style={styles.radioTitle}> Random Blocking</Text>
                    </View>  
                </View>
            </View>
          </View>
            <View style={styles.content} >
              <View style={{flex:1 }}>
                <CalendarPicker
                  startFromMonday={true}
                allowRangeSelection={this.state.blockingType == 'Continuous Blocking' ? true : false}
                  minDate={new Date()}
                  // maxDate={maxDate}
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
                  // todayBackgroundColor="#01a4a2"
                  // selectedDayColor="#66ff33"
                  customDatesStyles={this.state.customDatesStyles}
                  // selectedDayTextColor="#000000"
                  selectedRangeStyle="#000000"
                  selectedStartDate = {this.state.checkInDate}
                  selectedEndDate = {this.state.checkOutDate}
                  scaleFactor={375}
                  textStyle={{
                    fontFamily: 'Roboto_medium',
                    color: '#000000',
                  }}
                  onDateChange={this.onDateChange}
                />
                {this.state.blockingType == 'Continuous Blocking' ?
                <View>
                <View style={styles.displaySelectedDates}>
                  <View style={styles.startDateView}>
                    <View style={{flex:2 }}>
                      <Text style={styles.startEndHeadings} >{i18n.t('lanLabelFromDate')}</Text>
                      <Text style={styles.dateTxt} >{this.state.checkInDate ? moment(this.state.checkInDate).format('MMM DD, YYYY') : ''}</Text>
                    </View>
                    <View style={{flex:2 }}>
                      <Text style={styles.startEndHeadings} >{i18n.t('lanLabelToDate')}</Text>
                      <Text style={styles.dateTxt} >{this.state.checkOutDate ? moment(this.state.checkOutDate).format('MMM DD, YYYY') : ''}</Text>
                    </View>
                  </View>
                  {/* <View style={styles.startDateView}>
                    <View style={{flex:2}} ><Text style={styles.startEndHeadings} >To Date : </Text></View>
                    <View style={{flex:2}} >
                      <Text style={styles.dateTxt} >{this.state.checkOutDate ? moment(this.state.checkOutDate).format('MMM DD, YYYY') : ''}</Text>
                    </View>
                  </View> */}
                </View>
                </View>
                : 
                <View style={{flexDirection:'row', width:DEVICE_WIDTH, flexWrap: 'wrap' }}>
                {this.state.customDatesStyles ? this.state.customDatesStyles.map((item, i) =>
                    <View style={styles.randomBlockdateView}><Text style={ styles.propertyTitle } key ={i}>{moment(item.date).format('MMM DD, YYYY')}</Text></View>,
                ): null}</View>}
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 17 }} >
              {!this.state.submitDisabled
              ? <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                  <AwesomeButton block success
                    onPress={() => this.handleBlocking()}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                    <Text style={styles.BtnText}> {i18n.t('lanButtonDone')} </Text>
                  </AwesomeButton>
                </LinearGradient>
              : <LinearGradient colors={['#ddd', '#ddd']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                <AwesomeButton block success
                  disabled={this.state.submitDisabled}
                  onPress={() => this.handleBlocking()}
                  width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                  <Text style={styles.BtnText}> {i18n.t('lanButtonDone')} </Text>
                </AwesomeButton>
              </LinearGradient>
              }
              </View>
              <Text style={{color: 'red', fontFamily: 'Roboto_medium', paddingHorizontal:15, alignItems: 'center', }}>{this.state.errorMessage}</Text>
              {/* <View style={styles.button_main}>
                <TouchableOpacity activeOpacity={.8} onPress={() => this.handleBlocking()} >
                  <LinearGradient colors={['#025d8c', '#019fa0']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={{ padding: 15, alignItems: 'center', borderRadius: 5 }}>
                    <Text style={styles.gradientBtn}>Done</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View> */}
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
        </View>
        : <View>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
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
        <View style={{ jflex: 1, justifyContent: 'center', alignItems: 'center', width: DEVICE_WIDTH - 20, height: Device_Height - 150 }} >
          <View style={styles.eachBtnView} >
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
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
    );
  }
}

