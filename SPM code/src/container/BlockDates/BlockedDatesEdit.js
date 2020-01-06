import React from 'react';
import { Text, View, ScrollView, Dimensions, StatusBar, TouchableOpacity, TouchableHighlight, ActivityIndicator, Image } from 'react-native';
import { Icon, Picker, Card, CardItem, Left, Body } from 'native-base';
import styles from './css/CalendarScreenCss';
import { LinearGradient } from 'expo-linear-gradient';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import AwesomeButton from 'react-native-really-awesome-button';
import { PUBLIC_DOMAIN } from '../../../constants'; 
import i18n from 'i18n-js';
import Toast, { DURATION } from 'react-native-easy-toast';
import RadioButton from 'radio-button-react-native';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
// const Device_Height = Dimensions.get('window').height;

@inject(['PropertyStore'])
@observer
export default class BlockedDatesEdit extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
     header: null
    }
  };
  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    this.state = {
      blockedID: navigation.state.params && navigation.state.params.data ? navigation.state.params.data.bkdData._id : '',
      checkInDate: navigation.state.params && navigation.state.params.data ? navigation.state.params.data.bkdData.blockingFromDate : '',
      checkInDummyDate: navigation.state.params && navigation.state.params.data ? navigation.state.params.data.bkdData.blockingFromDate : '',
      checkOutDate: navigation.state.params && navigation.state.params.data ? navigation.state.params.data.bkdData.blockingToDate : '',
      checkOutDummyDate: navigation.state.params && navigation.state.params.data ? navigation.state.params.data.bkdData.blockingToDate : '',
      blockingType: navigation.state.params && navigation.state.params.data ? navigation.state.params.data.bkdData.blockingType : '',
      spServiceProviderId: navigation.state.params && navigation.state.params.data ? navigation.state.params.data.bkdData.spServiceProviderId : '',
      propertyID: navigation.state.params && navigation.state.params.data ? navigation.state.params.data.bkdData.propertyId : '',
      propertyData: navigation.state.params && navigation.state.params.data.propertyData,
      status: navigation.state.params && navigation.state.params.data.status,
      customDatesStyles: [],
      isloading: false,
      errorMessage: ''
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.handleUpdateBlocking = this.handleUpdateBlocking.bind(this);
  }
  componentWillMount() {
    // let customDates = [];
    // if(this.state.blockingType == 'Continuous Blocking') {
    //   let noOfDays = moment(this.state.checkOutDate).diff(moment(this.state.checkInDate), 'days') + 1;
    //   for (i = 0; i < noOfDays; i++) {
    //     customDates.push({
    //       date: moment(this.state.checkInDate).add(i, 'days').format('LL'),
    //       style: { backgroundColor: '#009EE3' },
    //       textStyle: { color: 'black' }, // sets the font color
    //       containerStyle: [], // extra styling for day container
    //     });
    //   }
    //   this.setState({ customDatesStyles: customDates })
    // } else {
    //   customDates.push({
    //     date: this.state.checkInDate,
    //     style: { backgroundColor: '#009EE3' },
    //     textStyle: { color: 'black' }, // sets the font color
    //     containerStyle: [], // extra styling for day container
    //   });
    //   this.setState({ customDatesStyles: customDates }) 
    // }
  }
  onValueChange (item) {
   if(item == 'Continuous Blocking') {
      this.setState({blockingType: item, checkInDate: '', checkOutDate: '', errorMessage: ''});
    } else {
      this.setState({blockingType: item, checkInDate: '', checkOutDate: '', errorMessage: ''});
    }
  }
  onDateChange(date, type) {
    this.setState({customDatesStyles: []});
    if(this.state.blockingType == 'Continuous Blocking') {
        if (type === 'END_DATE') {
          this.setState({
            checkOutDate: moment(date).format('YYYY-MM-DD'),
            errorMessage: ''
          });
        } else {
          this.setState({
            checkInDate: moment(date).format('YYYY-MM-DD'),
            checkOutDate: null,
            errorMessage: ''
          });
        }
      } else {
        this.setState({checkInDate: moment(date).format('YYYY-MM-DD'), checkOutDate: moment(date).format('YYYY-MM-DD'), errorMessage: ''})
      }  
  }
  handleUpdateBlocking () {
    const PropertyStore = this.props.PropertyStore;
    const navigation = this.props.navigation;
    if(!this.state.blockingType) {
      this.setState({errorMessage: i18n.t('lanErrorBlockingTypeIsRequired') });
    } else if(!this.state.checkInDate) {
      this.setState({errorMessage: i18n.t('lanErrorBlockingFromDateIsRequired') });
    } else if(!this.state.checkOutDate) {
      this.setState({errorMessage: i18n.t('lanErrorBlockingToDateIsRequired') });
    } else if((this.state.checkInDate == this.state.checkInDummyDate) && (this.state.checkOutDate == this.state.checkOutDummyDate)) {
      PropertyStore.refresh = '';
      navigation.navigate('BlockDatesScreen', {date: ''});
    } else {
      this.setState({ isloading : true });
      let post_json;
      post_json  = {
        blockingType: this.state.blockingType,
        blockingFromDate: this.state.checkInDate,
        blockingToDate : this.state.checkOutDate,
        propertyID: this.state.propertyID,
        spServiceProviderId: this.state.spServiceProviderId
      };
      let _this = this;
      let loading = setTimeout(function () {
        _this.setState({ isloading: false });
        _this.refs.toast.show (i18n.t('lanLabelServerNotResponding'));
      }, 20000);
      PropertyStore.updateSPPropertyBlockedDates(_this.state.blockedID, post_json, function(resObj) {
        clearTimeout(loading)
        if(resObj.statusCode == '0000') {
          resObj.statusResult.blockingFromDate = moment(resObj.statusResult.blockingFromDate).format('MMM DD, YYYY')
          resObj.statusResult.blockingToDate = moment(resObj.statusResult.blockingToDate).format('MMM DD, YYYY')
          if(_this.state.status == 'Upcoming') {
            let position = PropertyStore.BlockedDatesUpComingList.map(function (e) { return e._id; }).indexOf(_this.state.blockedID);
            PropertyStore.BlockedDatesUpComingList.splice(position, 1, resObj.statusResult);    
            PropertyStore.BlockedDatesUpComingDummyList.splice(position, 1, resObj.statusResult);   
          } else {
            let position = PropertyStore.BlockedDatesPastList.map(function (e) { return e._id; }).indexOf(_this.state.blockedID);
            PropertyStore.BlockedDatesPastList.splice(position, 1, resObj.statusResult);    
            PropertyStore.BlockedDatesPastDummyList.splice(position, 1, resObj.statusResult);
          }
          _this.setState({ isloading : false });
          PropertyStore.refresh = '';
          navigation.navigate('BlockDatesScreen');
        } else if(resObj.statusCode == '1013') {
          _this.setState({ isloading : false });
          PropertyStore.refresh = '';
          // alert(i18n.t('lanErrorYouHaveAlreadyBlockedThisDates'));
          _this.refs.toast.show (i18n.t('lanErrorYouHaveAlreadyBlockedThisDates'));
        } else if(resObj.statusCode == '1011') {
          // alert (i18n.t('lanErrorBlockedDatesDependencys'));
          _this.refs.toast.show (i18n.t('lanErrorBlockedDatesDependencys'));
          _this.setState({ isloading : false });
        } else {
          _this.refs.toast.show (i18n.t('lanErrorUnknownError'));
          _this.setState({ isloading : false });
        }
      });
    }
  }
  render() {
    const navigation = this.props.navigation;
    return (
      <View style={styles.container}>
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
                <Text style={styles.headerTitleStyle}> {i18n.t('lanTitleUpdateBlockedDates')} </Text>
            </View>
          </View>
        </LinearGradient>
        {this.state.isloading
          ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#ffffff' size='large' style={ styles.activeIndicatorStyle } /></View>
          : null}
        <View style={ styles.businessNameView } >
          <Card style={ styles.card }>
            <CardItem style={ styles.cardItemStyle }>
                <Left style={[styles.leftImageView, styles.listItemView ]}>
                    <View style={styles.imageBox} >
                        <Image source={this.state.propertyData ? {uri: PUBLIC_DOMAIN + this.state.propertyData.propertyImage} : require('../../../assets/dummy_property.jpg')} style={styles.imgStyle} />
                    </View>
                    <Body>
                        <View style={ styles.floatingInputView } >
                            <Text style={styles.propertyTitle}> {this.state.propertyData.propertyTitle} </Text>
                            <Text style={styles.titleLocationType}> {this.state.propertyData.propertyArea} </Text>
                            <Text style={styles.titleType}> {this.state.propertyData.propertyType} -  {i18n.t('lanLabelBlockedDatesEdit')} </Text>
                        </View>
                    </Body>
                </Left>  
            </CardItem>
          </Card>
        </View>
        <ScrollView>
        {/* <View style={ styles.pickerViewStyle } >
          <Text style={ styles.pickerTextStyle } >{i18n.t('lanSelectBlockingType')}<Text style={{color: 'red'}}>*</Text></Text>
          <Picker
              mode='dialog'
              style={ styles.pickerStyle }
              selectedValue={this.state.blockingType}
              onValueChange={this.onValueChange}>
              <Picker.Item label='Continuous Blocking' value='Continuous Blocking' />
              <Picker.Item label='Random Blocking' value='Random Blocking' />
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
            <View>
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={this.state.blockingType == 'Continuous Blocking' ? true : false}
                weekdays={['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']}
                minDate={new Date()}
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
                previousTitle='Previous'
                nextTitle='Next'
                initialDate={this.state.checkInDummyDate}
                // customDatesStyles={this.state.customDatesStyles}
                selectedStartDate = {this.state.checkInDate}
                selectedEndDate = {this.state.checkOutDate}
                selectedRangeStyle='#000000'
                scaleFactor={375}
                onDateChange={this.onDateChange}
              />
            </View>
            <View>
              <View style={styles.displaySelectedDates}>
                <View style={styles.startDateView}>
                  <View style={{ width:75 }} ><Text style={styles.startEndHeadings} >{i18n.t('lanLabelFromDate')} :</Text></View>
                  <View style={{ width:90 }} >
                    <Text style={styles.dateTxt} >{this.state.checkInDate ? moment(this.state.checkInDate).format('MMM DD, YYYY') : ''}</Text>
                  </View>
                  <View>
                  <View style={{ width:65 }} ><Text style={styles.startEndHeadings} >{i18n.t('lanLabelToDate')} :</Text></View>
                  <View style={{ width:90 }} >
                    <Text style={styles.dateTxt} >{this.state.checkOutDate ? moment(this.state.checkOutDate).format('MMM DD, YYYY') : ''}</Text>
                  </View> 
                  </View>
                </View>
              </View>
              </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 17 }} >
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
              <AwesomeButton block success
                onPress={() => this.handleUpdateBlocking()}
                width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                <Text style={styles.BtnText}> {i18n.t('lanCommonButtonUpdate')}</Text>
              </AwesomeButton>
            </LinearGradient>
          </View>
          </View>
          <Text style={{color: 'red', fontFamily: 'Roboto_medium', paddingHorizontal:15}}>{this.state.errorMessage}</Text>
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
    );
  }
}

