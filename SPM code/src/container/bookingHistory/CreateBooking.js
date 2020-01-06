import React from 'react';
import { observer, inject } from 'mobx-react';
import { View, Image, TextInput, ScrollView, StatusBar, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Button, Text, Item, Input, Icon, Picker, Tab, Tabs, Left, Body, Right, borderRadius } from 'native-base';
import styles from './css/CreateBookingCss';
import { LinearGradient } from 'expo-linear-gradient';
import DatePicker from 'react-native-datepicker';
import Modal from 'react-native-modal';
import moment from 'moment';
import AwesomeButton from 'react-native-really-awesome-button';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import { PUBLIC_DOMAIN } from '../../../constants';
import Swiper from 'react-native-swiper';
import CreateDaysBookingComponent from './CreateDaysBooking';
import CreateHourlyBookingComponent from './CreateHourlyBooking';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;
@inject(['UserStore'], ['PropertyStore'], ['BookingStore'])
@observer
export default class CreateBooking extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    const data = navigation.state.params && navigation.state.params.data ? navigation.state.params.data : {}
    this.state = {
      data: data,
      propertyId: data.propertyId && data.propertyId._id ? data.propertyId._id : '',
      propertyInfoId: data && data._id ? data._id : '',
      amenitiesArray: [],
      servicesArray: [],
      guestRulesArray: []
    };
  }
  componentWillMount() {
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    PropertyStore.getSPPropertyInfoList(_this.state.propertyId, _this.state.propertyInfoId, '', function (resObj) {
      if (resObj.statusCode == '0000') {
        _this.setState({ amenitiesArray: resObj.statusResult });
      } 
    });
    PropertyStore.getInfoServices(_this.state.propertyId, _this.state.propertyInfoId, function(resObj) {
      if(resObj.statusCode == '0000') {
      _this.setState({ servicesArray: resObj.statusResult });
      }
    });
    PropertyStore.getPropertyInfoGuestRules(_this.state.propertyId, _this.state.propertyInfoId, '', function (resObj) {
      if (resObj.statusCode == '0000') {
        _this.setState({ guestRulesArray: resObj.statusResult})
      } 
    });
  }
  handleView = (viewData) => {
    const navigation = this.props.navigation;
    const data = navigation.state.params && navigation.state.params.data ? navigation.state.params.data : [];
    switch (viewData) {
      case 'amenities' : this.props.navigation.navigate('CreateBookingsReferenceView', {propertyData: data, headingName: 'Amenities', amenitiesData: this.state.amenitiesArray });
      break;

      case 'services' :this.props.navigation.navigate('CreateBookingsReferenceView', {propertyData: data, headingName: 'Services', servicesData: this.state.servicesArray});
      break;

      case 'rules' : this.props.navigation.navigate('CreateBookingsReferenceView', {propertyData: data, headingName: 'Guest Rules', guestRulesData: this.state.guestRulesArray });
      break;
    }
  }
  render() {
    const navigation = this.props.navigation;
    const data = navigation.state.params && navigation.state.params.data ? navigation.state.params.data : {};
    return (
      <View style={styles.container}>
        {data.pricing.minBasePriceUnit === '6 Hours' ?
        <CreateHourlyBookingComponent data={data} amenitiesArray={this.state.amenitiesArray}
        servicesArray={this.state.servicesArray} navigation={navigation} /> :
        <CreateDaysBookingComponent data={data} amenitiesArray={this.state.amenitiesArray}
        servicesArray={this.state.servicesArray} navigation={navigation} /> }
      </View>
    );
  }
}