import React from 'react';
import { ActivityIndicator, AsyncStorage, BackHandler, Dimensions, Text, View, StatusBar, ScrollView, Button, Platform, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Icon } from 'native-base';
import { observer, inject } from 'mobx-react';
import styles from './css/BookingHistoryListCss';
import ToggleSwitch from 'toggle-switch-react-native';
import { PUBLIC_DOMAIN } from '../../../constants';
import moment from 'moment';

@inject(['UserStore'])
@observer
export default class BookingHistoryEachRow extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    }

  }
  componentWillReceiveProps() {
    this.setState({ data: this.props.data });
  }
  handelBookingsView(i) {
    const navigation = this.props.navigation;
    navigation.navigate('BookingHistoryViewScreen', { BookingData: this.state.data });
  }
  render() {
    
    const navigation = this.props.navigation;
    const UserStore = this.props.UserStore;
    const data = this.props.data;
    const i = this.props.i;
    return (
      <View style={styles.mainView}>
        <TouchableOpacity onPress={() => this.handelBookingsView(i)} >
          <View style={styles.mainComponentView}>
            <View style={styles.hotelContentView} >
              <View style={styles.hotelDetails} >
                {/* <Text style={styles.textMedium}>{data.euUserId.displayName}, {data.euMobileNumber}</Text> */}
                <Text style={styles.textBig}>{data.spPropertyTitle ? data.spPropertyTitle : ''}</Text>
                <Text style={styles.textMedium}>{data.spLocationObj.area}, {data.spLocationObj.city}, {data.spLocationObj.state}</Text>
                {/* <Text style={styles.textSmall}>{data && data.euUserId.displayName ? data.euUserId.displayName : ''}</Text> */}
                <Text style={styles.textSmall}>{data.euMobileNumber}</Text>
                <Text style={styles.textDate}>{moment(data.checkInDate).format('MMM DD, YY')} - {moment(data.checkOutDate).format('MMM DD, YY')}</Text>
              </View>
            </View>
            <View style={styles.hoteStatusView} >
              <View style={styles.pendingCircle} >
                <Text style=
                  {data.bookingStatus == 'Completed' ? styles.completedTxt : data.bookingStatus == 'Booked'
                    ? styles.bookedText : data.bookingStatus == 'Cancelled'
                      ? styles.canceledTxt : styles.completedTxt
                  }>{data.bookingStatus}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity >
      </View>

    )
  }
}; 