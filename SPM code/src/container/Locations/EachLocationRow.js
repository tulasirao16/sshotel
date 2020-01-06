import React from 'react'
import { View, Text, Card, CardItem, Icon, Switch, Left, Body, Right} from 'native-base';
import ToggleSwitch from 'toggle-switch-react-native';
import { ActivityIndicator, TouchableOpacity, Image, Dimensions } from 'react-native';
import styles from './css/LocationsListCss';
import { observer, inject } from 'mobx-react';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['SPStore'])
@observer

export default class EachLocationRow extends React.Component {
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
      loading: false,
      activePage: 1,
      Search: '',
      refreshing: false,
      isToggle: true,
      data: this.props.data
    }
    this.handleLocationStatus = this.handleLocationStatus.bind(this)
  }
  componentWillReceiveProps() {
    this.setState({ data: this.props.data, locationStatus: this.props.data.locationStatus });
  }
  handleLocationStatus(isOn) {
    const SPStore = this.props.SPStore;
    const data = this.props.data;
    let LocationsList = SPStore.LocationsList;
    let _this = this;
    this.setState({ loading: true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false });
    }, 10000);
    if (_this.state.isToggle && data.locationStatus == 'Active') {
      SPStore.InactiveSPLocationData(data._id, function (resObj) {
        clearTimeout(isLoading)
        if (resObj.statusCode == '0000') {
          const index = LocationsList.findIndex(dataObj => dataObj._id === data._id);
          LocationsList[index].locationStatus = 'Inactive'
          SPStore.LocationsList = LocationsList;
          _this.setState({ loading : false, isToggle: isOn, locationStatus: 'Inactive' })
        } else {
          _this.setState({ loading : false })
        }
      });
    } else {
      SPStore.ActiveSPLocationData(data._id, function (resObj) {
        clearTimeout(isLoading)
        if (resObj.statusCode == '0000') {
          const index = LocationsList.findIndex(dataObj => dataObj._id === data._id);
          LocationsList[index].locationStatus = 'Active'
          SPStore.LocationsList = LocationsList;
          _this.setState({ loading : false, isToggle: isOn, locationStatus: 'Active' })
        } else {
          _this.setState({ loading : false })
        }
      });
    }
  }

  handleLocationView(data) {
    const navigation = this.props.navigation;
    navigation.navigate('LocationsViewScreen', { data: {locationData: data, propertyAction: 'Edit'} });
  }
  render() {
    const data = this.props.data;
    return (
        <TouchableOpacity onPress={() => this.handleLocationView(data)} >
          <Card style={styles.card}>
            <CardItem style={styles.cardItem}>
              <View style={styles.listMain}>
                <Left>
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.ServiceTitle}>{data.spServiceProvider}, {data.area} </Text>
                </Left>
                {this.state.loading
                  ? <View ><ActivityIndicator style={{ marginLeft: 6 }} size='large' /></View>
                  : null
                }
                <View>
                  <ToggleSwitch
                    isOn={(data.locationStatus == 'Active' && this.state.isToggle) ? true : false}
                    onColor='#5cb85c'
                    offColor='#e6e6e6'
                    labelStyle={{ color: 'black', fontWeight: '600' }}
                    size='small'
                    onToggle={(isOn) => this.handleLocationStatus(isOn)}
                  />
                </View>
              </View>
            </CardItem>
            <CardItem style={styles.cardItem}>
              <View style={styles.listMain}>
                <View>
                  <Text style={styles.bookingText}>{data.contactPerson}</Text>
                </View>
              </View>
            </CardItem>
            <CardItem style={styles.cardItem}>
              <View style={styles.listMain}>
                <View>
                <Text style={styles.bookingText}>{data.mobileNumber} </Text>
                </View>
              </View>
            </CardItem>
            <CardItem style={styles.cardItem}>
              <View style={styles.listMain}>
                <View>
                  <Text style={styles.bookingText}>{data.email} </Text>
                </View>
              </View>
            </CardItem>
          </Card>
        </TouchableOpacity>
    )
  }
}