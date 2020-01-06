import React from 'react';
import { Text, View, Platform, ScrollView, Dimensions, TouchableHighlight, ActivityIndicator, StatusBar, ImageBackground, TextInput, TouchableOpacity, Image } from 'react-native';
import { Icon, Card, CardItem, Left, Body, Button } from 'native-base';
import styles from './css/CalendarScreenCss';
import { LinearGradient } from 'expo-linear-gradient';
import CalendarPicker from 'react-native-calendar-picker';
import Modal from 'react-native-modal';
import AwesomeButton from 'react-native-really-awesome-button';
import moment from 'moment';
import { PUBLIC_DOMAIN } from '../../../constants';
import { inject, observer } from 'mobx-react';
import i18n from 'i18n-js';
import Toast, { DURATION } from 'react-native-easy-toast';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['PropertyStore'])
@observer
export default class CalendarScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    this.state = {
      //set value in state for start and end date
      selectedStartDate: null,
      selectedEndDate: null,
      selectedHours: 0,
      //initial Hours
      selectedMinutes: 0,
      //initial Minutes
      checkInDate: navigation.state.params && navigation.state.params.data ? navigation.state.params.data.bkdData.blockingFromDate : '',
      checkOutDate: navigation.state.params && navigation.state.params.data ? navigation.state.params.data.bkdData.blockingToDate : '',
      blockingType: navigation.state.params && navigation.state.params.data ? navigation.state.params.data.bkdData.blockingType : '',
      propertyData: navigation.state.params && navigation.state.params.data.propertyData,
      customDatesStyles: [],
      status: navigation.state.params && navigation.state.params.data && navigation.state.params.data.status ? navigation.state.params.data.status : '',
      isDeleteModalVisible: false,
      loading: false,
      reload: false,
      reloadFunction: '',
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount() {
    let customDates = [];
    if(this.state.blockingType == 'Continuous Blocking') {
      let noOfDays = moment(this.state.checkOutDate).diff(moment(this.state.checkInDate), 'days') + 1;
      for (i = 0; i < noOfDays; i++) {
        customDates.push({
          date: moment(this.state.checkInDate).add(i, 'days').format('LL'),
          style: { backgroundColor: '#009EE3' },
          textStyle: { color: 'black' }, // sets the font color
          containerStyle: [], // extra styling for day container
        });
      }
      this.setState({ customDatesStyles: customDates })
    } else {
      customDates.push({
        date: this.state.checkInDate,
        style: { backgroundColor: '#009EE3' },
        textStyle: { color: 'black' }, // sets the font color
        containerStyle: [], // extra styling for day container
      });
      this.setState({ customDatesStyles: customDates })
    }
  }

  onDateChange(date, type) {
    //function to handle the date change 
    if (type === 'END_DATE') {
      this.setState({
        selectedEndDate: date,
        errorMessage: ''
      });
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null,
        errorMessage: ''
      });
    }
  }
  handleDelete () {
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    this.setState({ loading: true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false });
    }, 10000);
    PropertyStore.deleteBlockedDate(navigation.state.params.data.bkdData._id, function(resObj) {
      clearTimeout(isLoading)
      if(resObj.statusCode == '0000') {
        _this.setState({isDeleteModalVisible: false, loading: false})
        PropertyStore.refresh = 'refresh';
        navigation.navigate('BlockDatesScreen', {date: 'refresh'});
      } else {
        _this.setState({isDeleteModalVisible: false, loading: false})
        // alert(i18n.t('lanErrorDeleteFailed'));
        _this.refs.toast.show(i18n.t('lanErrorDeleteFailed'));
      }
    });
  }
  handleClose () {
    this.setState({isDeleteModalVisible: false})
  }
  render() {
    const navigation = this.props.navigation;
    const minDate = moment().format('MM-DD-YYYY'); // Min date
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft} >
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()} >
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
              </TouchableHighlight>
            </View>
            <View style={styles.headerBody}>
                <Text style={styles.headerTitleStyle}> {i18n.t('lanTitleBlockedDatesView')} </Text>
            </View>
            {this.state.propertyData && this.state.propertyData.propertyAction == 'Edit' && moment().format('YYYY-MM-DD')  <= moment(this.state.checkInDate).format('YYYY-MM-DD') ? 
            <View style={styles.headerRight}>
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={()=> navigation.navigate('BlockedDatesEdit', {data: navigation.state.params.data})} >
              <Icon name='create' style={styles.iconMenuStyle} />
              </TouchableHighlight>
            </View> : null }
            <View style={styles.headerRight}>
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={()=> this.setState({isDeleteModalVisible: !this.state.isDeleteModalVisible})} >
                <Icon name='ios-trash' style={styles.iconMenuStyle} />
              </TouchableHighlight>
            </View>
          </View>
        </LinearGradient>
        {this.state.loading
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
                            <Text style={styles.titleType}> {this.state.propertyData.propertyType} - {i18n.t('lanTitleBlockedDatesView')} </Text>
                            {/* <Text style={styles.titleType}> {this.state.checkInDate} - {this.state.checkOutDate ? this.state.checkOutDate : ''} </Text> */}
                        </View>
                    </Body>
                </Left>  
            </CardItem>
          </Card>
        </View>
        <ScrollView>
          <View style={styles.blockingType}>
          <Text style={styles.blockingTypeText}>{i18n.t('lanLabelBlockingType')} </Text>
            <Text style={styles.blockingTypeTextValue}>{this.state.blockingType}</Text>
          </View>
          <View style={styles.content} >
            <View>
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                minDate={minDate}
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
                previousTitle='Previous'
                nextTitle='Next'
                initialDate={this.state.checkInDate}
                // todayBackgroundColor='#01a4a2'
                enableDateChange ={false}
                selectedDayColor='#66ff33'
                customDatesStyles={this.state.customDatesStyles}
                selectedStartDate = {this.state.checkInDate}
                selectedEndDate = {this.state.checkOutDate}
                selectedDayTextColor='#000000'
                scaleFactor={375}
                textStyle={{
                  fontFamily: 'Roboto_medium',
                  color: '#000000',
                }}
                onDateChange={this.onDateChange}
              />

            </View>
            <View style={styles.displaySelectedDates}>
                <View style={styles.startDateView}>
                  <View style={{ width:75 }} ><Text style={styles.startEndHeadings} >{i18n.t('lanLabelFromDate')}</Text></View>
                  <View style={{ width:90 }} >
                    <Text style={styles.dateTxt} >{this.state.checkInDate ? moment(this.state.checkInDate).format('MMM DD, YYYY') : ''}</Text>
                  </View>
                  <View style={{ width:65 }} ><Text style={styles.startEndHeadings} >{i18n.t('lanLabelToDate')}</Text></View>
                  <View style={{ width:90 }} >
                    <Text style={styles.toDateTxt} >{this.state.checkOutDate ? moment(this.state.checkOutDate).format('MMM DD, YYYY') : ''}</Text>
                  </View>
                </View>
                </View>
            {/* <View style={styles.button_main}>
              <TouchableOpacity activeOpacity={.8} onPress={() => navigation.goBack()} >
                <LinearGradient colors={['#025d8c', '#019fa0']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={{ padding: 15, alignItems: 'center', borderRadius: 5 }}>
                  <Text style={styles.gradientBtn}>Done</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View> */}
          </View>
          <View style={styles.btnModal} >
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
              <AwesomeButton block success
                onPress={() => navigation.goBack()}
                width={DEVICE_WIDTH/3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} marginTop={20} >
                <Text style={styles.BtnText}> {i18n.t('lanButtonDone')} </Text>
              </AwesomeButton>
            </LinearGradient>
          </View> 
        </ScrollView>
        <Modal isVisible={this.state.isDeleteModalVisible}>
            <View style={ styles.modalView }>
              <View style={ styles.modalContainerStyles}>
                <View style={ styles.txtInfoViewStyle }>
                  <Text style={ styles.txtInfo }> Are you sure, you want to delete blocked dates </Text>
                </View>
                <View style={ styles.btnsParentView } >
                  <View style={ styles.eachBtnView } >
                    <Button onPress={() => this.handleDelete()}  style={ styles.btnStyle }>
                      <Text style={ styles.btnTxt } > Yes </Text>
                    </Button>
                  </View>
                  <View style={ styles.eachBtnView } >
                    <Button onPress={() => this.handleClose()} style={ styles.cancelBtn } >
                      <Text style={ styles.btnTxt }> No </Text>
                    </Button>
                  </View>
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
    );
  }
}

