import React from 'react';
import { observer, inject } from 'mobx-react';
import { View, Image, TextInput, ScrollView, StatusBar, Dimensions, TouchableOpacity, ActivityIndicator, BackHandler } from 'react-native';
import { Button, Text, Picker, LabelList, ListItem, Item, Input, Icon, Tab, Tabs, Left, Right, borderRadius } from 'native-base';
// import styles from './css/BookingHistoryViewCss';
import styles from './css/BookingEditCss';
import { LinearGradient } from 'expo-linear-gradient';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import AwesomeButton from "react-native-really-awesome-button";
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import { PUBLIC_DOMAIN } from '../../../constants';
import Modal from 'react-native-modal';
import EditDaysBooking from './EditDaysBooking'
import EditHoursBooking from './EditHoursBooking'

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;

@inject(['UserStore'], ['BookingStore'], ['PropertyStore'])
@observer
export default class BookingEdit extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const navigation = this.props.navigation;
    const bookingData = navigation.state.params && navigation.state.params.bookingData ? navigation.state.params.bookingData : {};
    const BookingStore = this.props.BookingStore;
    const PropertyStore = this.props.PropertyStore;
    return (
      <View style={styles.container}>
        {bookingData.spPropertyInfoId.pricing.minBasePriceUnit === '6 Hours'
          ? <EditHoursBooking bookingData={bookingData}  navigation={navigation} />
          : <EditDaysBooking bookingData={bookingData}  navigation={navigation} />}
      </View>

    );
  }
}