import React from 'react';
import { Platform, FlatList, BackHandler, ActivityIndicator, StatusBar, TouchableHighlight, TouchableOpacity, Image, ScrollView, Dimensions, Animated, RefreshControl, Keyboard, UIManager, TextInput, Linking } from 'react-native';
import { Container, Button, List, ListItem, Card, CardItem, View, Icon, Text, Left, Right, Body, Content } from 'native-base';
import moment from 'moment';
import styles from './css/BookingHistoryViewCss';
import AwesomeButton from 'react-native-really-awesome-button';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';
import Toast, { DURATION } from 'react-native-easy-toast';

import { observer, inject } from 'mobx-react';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['BookingStore'], ['PropertyStore'])
@observer
export default class BookingHistoryViewScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  }
  constructor(props){
    super(props)
      const navigation = this.props.navigation;
      this.state = {
        isModalVisible: false,
        bookingId: navigation.state.params.BookingData._id,
        checkInDate: navigation.state.params.BookingData && navigation.state.params.BookingData.checkInDate ? navigation.state.params.BookingData.checkInDate : '',
        refundAmount: '',
        confirmCancelModalVisible: false,
        loading: false,
        reload: false,
        reloadFunction: '',
        param1: null,
        confirmCancelBookingData: {},
        noRefund: false,
        statusCode: ''
    }
    this.toggleModal = this.toggleModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  handleBackButtonClick() {
    const navigation = this.props.navigation
    navigation.goBack()
    return true
  }  
  toggleModal () {
    BookingStore = this.props.BookingStore;
    let _this = this;
    this.setState({ loading : true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading : false, reload: true, reloadFunction: 'toggleModal' });
    }, 10000);
    BookingStore.getRefundAmountBooking(this.state.bookingId, this.state.checkInDate, function(resobj){
      clearTimeout(isLoading)
      if(resobj.statusCode == '0000') { 
        _this.setState({ loading: false, refundAmount: resobj.statusResult.result.totalRefundAmount, isModalVisible: !_this.state.isModalVisible, confirmCancelBookingData: resobj.statusResult.result, noRefund: true, statusCode:resobj.statusCode })
      } else if (resobj.statusCode == '8888') {
        _this.setState({ loading: false, refundAmount: i18n.t('lanLabelNoteNoRefundOnCancellation'), isModalVisible: !_this.state.isModalVisible, confirmCancelBookingData: resobj.statusResult.result, noRefund: false, statusCode:resobj.statusCode})
      } else {
        _this.setState({ loading: false, refundAmount: i18n.t('lanLabelAreYouSureYouWantToCancelTheBooking'), isModalVisible: !_this.state.isModalVisible, confirmCancelBookingData: resobj.statusResult.result, noRefund: false, statusCode:resobj.statusCode})
      }
    })
  };

  handleCancel () {
    this.setState({isModalVisible: !this.state.isModalVisible, loading : true })
    let _this = this
    setTimeout(function(){
      _this.setState({ confirmCancelModalVisible: !_this.state.confirmCancelModalVisible, loading : false })  
    }, 500)
  }

  handleConfirmCancel(statusCode) {
    const BookingStore = this.props.BookingStore;
    const PropertyStore = this.props.PropertyStore;
    const navigation = this.props.navigation
    let _this = this;
    this.setState({ loading : true, confirmCancelModalVisible: !_this.state.confirmCancelModalVisible });
    let isLoading = setTimeout(function () {
      _this.setState({ loading : false, reload: true, reloadFunction: 'handleConfirmCancel', param1: statusCode });
    }, 15000);
    switch (statusCode) {
      case '0000': 
        let cancelObj = {
          bookingId: _this.state.bookingId,
          appRefundAmount: _this.state.confirmCancelBookingData.appRefundAmount,
          spRefundAmount: _this.state.confirmCancelBookingData.spRefundAmount,
          totalRefundAmount: _this.state.confirmCancelBookingData.totalRefundAmount,
          statusCode: '0000'
        }
        BookingStore.confirmCancelBooking(cancelObj, function(resobj){
          clearTimeout(isLoading)
          if(resobj.statusCode == '0000') {
            _this.setState({ loading: false });
            PropertyStore.getSPBookings(1, 'all', '', function (resObj) {});
            navigation.navigate('BookingHistoryListScreen');
          } else {
            _this.setState({ loading: false })
            // alert(i18n.t('lanErrorBookingCancellationFailed'));
            _this.refs.toast.show(i18n.t('lanErrorBookingCancellationFailed'));
          }
        })
        break;
      case '8888':
        let cancelNoRefundObj = {
          bookingId: _this.state.bookingId,
          appRefundAmount: 0,
          spRefundAmount: 0,
          totalRefundAmount: 0,
          statusCode: '8888'
        }
        BookingStore.confirmCancelBooking(cancelNoRefundObj, function(resobj){
          clearTimeout(isLoading)
          if(resobj.statusCode == '0000') {
            _this.setState({ loading: false });
            PropertyStore.getSPBookings(1, 'all', '', function (resObj) {});
            navigation.navigate('BookingHistoryListScreen');
          } else {
            _this.setState({ loading: false })
            // alert(i18n.t('lanErrorBookingCancellationFailed'));
            _this.refs.toast.show(i18n.t('lanErrorBookingCancellationFailed'));
          }
        })
        break;
      case '7777' :
        let paymentStatusPendingCancelObj = {
          bookingId: _this.state.bookingId,
          statusCode: '7777'
        }
        BookingStore.confirmCancelBooking(paymentStatusPendingCancelObj, function(resobj){
          clearTimeout(isLoading)
          if(resobj.statusCode == '0000') {
            _this.setState({ loading: false });
            PropertyStore.getSPBookings(1, 'all', '', function (resObj) {});
            navigation.navigate('BookingHistoryListScreen');
          } else {
            _this.setState({ loading: false })
            // alert(i18n.t('lanErrorBookingCancellationFailed'));
            _this.refs.toast.show(i18n.t('lanErrorBookingCancellationFailed'));
          }
        })
        break;
      default:
        clearTimeout(isLoading)
        _this.setState({ loading: false })
        // alert('Please Try Again')
        _this.refs.toast.show('Please Try Again');
        break;
    }
  }

  handleReload = () => {
    switch(this.state.reloadFunction) {
      case 'toggleModal':
        this.setState({ reload: false, reloadFunction: '' });
        this.toggleModal()
        break;
      case 'handleConfirmCancel':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleConfirmCancel(this.state.param1)
        break;
      default:
        break;
    }
  }
  render() {
    const navigation = this.props.navigation;
    const bookingData = navigation.state.params.BookingData;
    return (
      !this.state.reload
      ? <View style={styles.container}>
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
              <View>
                <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleBookingHistory')}</Text>
              </View>
            </View>
            <View style={styles.headerRight} >
              {bookingData.bookingStatus=== 'Closed' || bookingData.bookingStatus === 'Completed' || bookingData.bookingStatus === 'Cancelled'
              ? null  
              : <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('BookingEdit', {bookingData: bookingData})} >
                <Icon name='ios-create' style={styles.iconEditStyle} />
              </TouchableOpacity>}
              {bookingData.bookingStatus == 'Booked' || bookingData.bookingStatus == 'Confirmed'
              ? <TouchableOpacity activeOpacity={0.8} onPress={this.toggleModal} >
                <Icon name='md-close-circle' style={styles.iconCloseStyle} />
              </TouchableOpacity>
              : null}
            </View> 
          </View>
        </LinearGradient>
        {this.state.loading
        ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#ffffff' size='large' style={ styles.activeIndicatorStyle } /></View>
        : null}
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.heading}>
              <Text style={styles.bookingTitle}>{i18n.t('lanTitleBookingDetails')}</Text>
            </View>
            <List style={styles.list}>
              <ListItem style={styles.listItem}>
                <View style={styles.listMain}>
                  <View style={styles.leftView}>
                    <Text style={styles.textLabel}>{i18n.t('lanLabelBookingCode')}</Text>
                  </View>
                  <View style={styles.rightView}>
                    <Text style={styles.bookingText}>{bookingData.bookingCode}</Text>
                  </View>
                </View>
              </ListItem>
              <ListItem style={styles.listItem}>
                <View style={styles.listMain}>
                  <View style={styles.leftView}>
                    <Text style={styles.textLabel}>{i18n.t('lanLabelBookedBy')} </Text>
                  </View>
                  <View style={styles.rightView}>
                    <Text style={styles.bookingText}>{bookingData.euName}</Text>
                  </View>
                </View>
              </ListItem>
              <ListItem style={styles.listItem}>
                <View style={styles.listMain}>
                  <View style={styles.leftView}>
                    <Text style={styles.textLabel}>{i18n.t('lanLabelMobile')}</Text>
                  </View>
                  <View style={styles.rightView}>
                    <Text style={styles.bookingText}>{bookingData.euMobileNumber}</Text>
                  </View>
                  <View style={styles.middleView}>
                    <Icon name='ios-call' style={{ fontSize:20, color:'#3b86ff'}} onPress={() => Linking.openURL(`tel:${bookingData.euMobileNumber}`)} />
                  </View>
                </View>
              </ListItem>
              <ListItem style={styles.listItem}>
                <View style={styles.listMain}>
                  <View style={styles.leftView}>
                    <Text style={styles.textLabel}>{i18n.t('lanLabelNoOfPersons')}</Text>
                  </View>
                  <View style={styles.rightView}>
                    <Text style={styles.bookingText}>{bookingData.noOfAdults} {i18n.t('lanLabelAdults')}, {bookingData.noOfChilds}{i18n.t('lanLabelChild')}</Text>
                  </View>
                </View>
              </ListItem>
              <ListItem style={styles.listItem}>
                <View style={styles.listMain}>
                  <View style={styles.leftView}>
                    <Text style={styles.textLabel}>{i18n.t('lanLabelNoOfRooms')}</Text>
                  </View>
                  <View style={styles.rightView}>
                    <Text style={styles.bookingText}>{bookingData.noOfRooms}</Text>
                  </View>
                </View>
              </ListItem>
              <ListItem style={styles.listItem}>
                <View style={styles.listMain}>
                  <View style={styles.leftView}>
                    <Text style={styles.textLabel}>{i18n.t('lanLabelTotalDays')} / {i18n.t('lanLabelHour')}</Text>
                  </View>
                  <View style={styles.rightView}>
                    <Text style={styles.bookingText}>{bookingData.totalDays} {i18n.t('lanLabelDays')} /  {bookingData.totalHours} {i18n.t('lanLabelHours')}</Text>
                  </View>
                </View>
              </ListItem>
              <ListItem style={styles.listItem}>
                <View style={styles.listMain}>
                  <View style={styles.leftView}>
                    <Text style={styles.textLabel}>{i18n.t('lanLabelCheckInCheckOutTime')}</Text>
                  </View>
                  <View style={styles.rightView}>
                    <Text style={styles.bookingText}>
                      {moment(bookingData.checkInDate).format('MMM DD, YY')} {moment(bookingData.checkInDate).format('hh:mm A')}  {'\n'}
                      {moment(bookingData.checkOutDate).format('MMM DD, YY')} {moment(bookingData.checkOutDate).format('hh:mm A')} 
                    </Text>
                  </View>
                </View>
              </ListItem>
              <ListItem style={styles.listItem}>
                <View style={styles.listMain}>
                  <View style={styles.leftView}>
                    <Text style={styles.textLabel}>{i18n.t('lanLabelStatus')}</Text>
                  </View>
                  <View style={styles.rightView}>
                    <Text style={styles.bookingText}>{bookingData.bookingStatus}</Text>
                  </View>
                </View>
              </ListItem>
              {bookingData && bookingData.paymentMode
                ? <ListItem style={styles.listItem}>
                    <View style={styles.listMain}>
                      <View style={styles.leftView}>
                        <Text style={styles.textLabel}>{i18n.t('lanLabelPaymentMode')}</Text>
                      </View>
                      <View style={styles.rightView}>
                        <Text style={styles.bookingText}>{bookingData.paymentMode}</Text>
                      </View>
                    </View>
                  </ListItem>
                : null}  
              <ListItem style={styles.listItem}>
                <View style={styles.listMain}>
                  <View style={styles.leftView}>
                    <Text style={styles.textLabel}>{i18n.t('lanLabelGrandTotal')}</Text>
                  </View>
                  <View style={styles.rightView}>
                    <Text style={[styles.bookingText, styles.greenColor]}>{'\u20B9'} {bookingData.totalPrice}</Text>
                  </View>
                </View>
              </ListItem>
              <ListItem style={styles.listItem}>
                <View style={styles.listMain}>
                  <View style={styles.leftView}>
                    <Text style={styles.textLabel}>{i18n.t('lanLabelPaymentStatus')}</Text>
                  </View>
                  <View style={styles.rightView}>
                    <Text style={styles.bookingText}>{bookingData.paymentStatus}</Text>
                  </View>
                </View>
              </ListItem>
            </List>
          </View>
          <View style={styles.content}>
            <List>
              <View style={styles.heading}>
                <Text style={styles.bookingTitle}>{bookingData.spPropertyTitle}</Text>
              </View>
              <ListItem style={styles.listItem}>
                <View style={styles.listMain}>
                  <View style={styles.leftView}>
                    <Text style={styles.textLabel}>{i18n.t('lanLabelContactPerson')}</Text>
                  </View>
                  <View style={styles.rightView}>
                    <Text style={styles.bookingText}>{bookingData.spLocationObj.contactPerson}</Text>
                  </View>
                </View>
              </ListItem>
              <ListItem style={styles.listItem}>
                <View style={styles.listMain}>
                  <View style={styles.leftView}>
                    <Text style={styles.textLabel}>{i18n.t('lanLabelMobileNumber')}</Text>
                  </View>
                  <View style={styles.rightView}>
                    <Text style={styles.bookingText}>{bookingData.spLocationObj.mobileNumber}</Text>
                  </View>
                  <View style={styles.middleView}>
                    <Icon name='ios-call' style={{ fontSize:20, color:'#3b86ff'}} onPress={() => Linking.openURL(`tel:${bookingData.spLocationObj.mobileNumber}`)} />
                  </View>
                </View>
              </ListItem>
              <ListItem style={styles.listItem}>
                <View style={styles.listMain}>
                  <View style={styles.leftView}>
                    <Text style={styles.textLabel}>{i18n.t('lanLabelEmail')}</Text>
                  </View>
                  <View style={styles.rightView}>
                    <Text style={styles.bookingText}>{bookingData.spLocationObj.email}</Text>
                  </View>
                </View>
              </ListItem>
              <ListItem style={styles.listItem}>
                <View style={styles.listMain}>
                  <Left>
                    <View>
                      <Text style={styles.textLabel}>{i18n.t('lanLabelAddress')}</Text>
                      <Text style={styles.bookingText}>
                        {bookingData.spLocationObj.address}
                      </Text>
                    </View>
                  </Left>
                </View>
              </ListItem>
            </List>
          </View>
        </ScrollView>
        <View style={{ justifyContent:'center', alignItems:'center'}} >
          <Modal isVisible={this.state.isModalVisible}>
            <View style={ styles.modalView }>
              <View style={ styles.modalContainerStyles}>
                <View style={ styles.txtInfoViewStyle }>
                  {this.state.noRefund
                  ? <Text style={ styles.txtInfo }>
                     {i18n.t('lanLabelTotalAmountOf')} <Text> </Text>
                      <Text style={ styles.txtbold }>{this.state.refundAmount}</Text>   
                      <Text> </Text> {i18n.t('lanLabelWillBe')} <Text> </Text>
                      <Text style={ styles.txtbold }>{i18n.t('lanLabelRefunded')}</Text> {i18n.t('lanLabelToTheCustomer')} <Text style={ styles.txtbold }> {bookingData.euName} </Text>
                      {i18n.t('lanLabelWithBookingID')}  <Text style={ styles.txtbold }> {bookingData.bookingCode} </Text> .  
                    </Text>
                  : <Text style={ styles.txtInfo }>
                      <Text style={ styles.txtbold }>{this.state.refundAmount} </Text>   
                      {i18n.t('lanLabelToTheCustomer')}  <Text style={ styles.txtbold }> {bookingData.euName} </Text>
                      {i18n.t('lanLabelWithBookingID')} <Text style={ styles.txtbold }> {bookingData.bookingCode} </Text> .  
                    </Text>
                  }  
                </View>
                <View style={ styles.btnsParentView } >
                  <View style={ styles.eachBtnView } >
                    <Button rounded success onPress={() => this.handleCancel()}  >
                      <Text >{i18n.t('lanCommonButtonOk')}</Text>
                    </Button>
                  </View>
                  <View style={ styles.eachBtnView } >
                    <Button rounded danger onPress={() => this.setState({isModalVisible: !this.state.isModalVisible })} >
                      <Text > {i18n.t('lanCommonButtonBACK')} </Text>
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <View style={{ justifyContent:'center', alignItems:'center'}} >
          <Modal isVisible={this.state.confirmCancelModalVisible}>
            <View style={ styles.modalView }>
              <View style={ styles.modalContainerStyles}>
                <View style={ styles.txtInfoViewStyle }>
                  <Text style={ styles.txtInfo }>{i18n.t('lanLabelAreYouSureYouWantTo')} <Text> </Text>
                  <Text style={ styles.txtbold }>{i18n.t('lanLabelCancel')}</Text> <Text> </Text> {i18n.t('lanLabelThisBookingOn')} 
                  <Text style={ styles.txtbold }>  {moment(bookingData.checkInDate).format('MMM DD, YY')} - {moment(bookingData.checkOutDate).format('MMM DD, YY')} ? </Text> </Text>
                </View>
                <View style={ styles.btnsParentView } >
                  <View style={ styles.eachBtnView } >
                    <Button rounded success onPress={() => this.handleConfirmCancel(this.state.statusCode)} >
                      <Text>{i18n.t('lanCommonButtonYes')}  </Text>
                    </Button>
                  </View>
                  <View style={ styles.eachBtnView } >
                    <Button rounded danger onPress={() => this.setState({confirmCancelModalVisible: !this.state.confirmCancelModalVisible })} >
                      <Text >{i18n.t('lanCommonButtonNo')}  </Text>
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
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
      <LinearGradient colors={['#01A4A2', '#025D8C']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
        <View style={styles.headerMainViewReload} >
          <View style={styles.headerLeftReload} >
            <TouchableOpacity>
              <Icon name='ios-arrow-back' style={styles.iconMenuStyle1} onPress={() => navigation.goBack()} />
            </TouchableOpacity>
          </View>
          <View style={styles.headerBodyReload} >
            <TouchableOpacity>
              <Text style={styles.headerTitleStyle1}>{i18n.t('lanAppTitle')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      <View style={{ jflex:1, justifyContent:'center', alignItems:'center', width:DEVICE_WIDTH - 20, height:Device_Height - 150}} >
        <View style={ styles.eachBtnView } >
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
    )
  }
}