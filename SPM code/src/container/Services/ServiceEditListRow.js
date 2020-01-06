import React from 'react';
import { ActivityIndicator, AsyncStorage, BackHandler, Dimensions, Text, View, StatusBar, ScrollView, Button, Platform, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Icon, Switch } from 'native-base';
import { observer, inject } from 'mobx-react';
import styles from './css/CreateServiceCss';
import ToggleSwitch from 'toggle-switch-react-native';
import { PUBLIC_DOMAIN } from '../../../constants';

@inject(['UserStore'], ['PropertyStore'])
@observer
export default class ServiceEditListRow extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      activePage: 1,
      search: '',
      refreshing: false,
      isToggle: true,
      data: this.props.data,
      serviceStatus: this.props.data && this.props.data.serviceStatus ? this.props.data.serviceStatus : ''
    }
    this.handelServiceStatus = this.handelServiceStatus.bind(this)
  }
  componentWillReceiveProps(newProps) {
    this.setState({ data: newProps.data, serviceStatus: newProps.data.serviceStatus });
  }

  handelServiceStatus(serviceData, isOn) {
    const PropertyStore = this.props.PropertyStore;
    const data = this.props.data;
    let y = PropertyStore.ServicesAvailable;
    let servicesAvailable = y.indexOf(serviceData.serviceName);
    if (servicesAvailable === -1) {
      y.push(serviceData.serviceName);
    } else {
      y.splice(servicesAvailable, 1);
    }
    let put_json = {
      servicesAvailable: PropertyStore.ServicesAvailable,
      propertyInfoId: data.propertyInfoId
    };
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false });
    }, 10000);
    if (_this.state.isToggle && data.serviceStatus == 'Available') {
      PropertyStore.updateSPPIServiceStatusUnavailable(data._id, put_json, function (resObj) {
        clearTimeout(isLoading)
        if (resObj.statusCode == '0000') {
          _this.props.handleServiceStatusChange()
          _this.setState({ loading: false, isToggle: isOn, serviceStatus: 'Unavailable' })
        } else {
          _this.setState({ loading: false })
        }
      });
    } else {
      PropertyStore.updateSPPIServiceStatusAvailable(data._id, put_json, function (resObj) {
        clearTimeout(isLoading)
        if (resObj.statusCode == '0000') {
          _this.props.handleServiceStatusChange()
          _this.setState({ loading: false, isToggle: isOn, serviceStatus: 'Available' })
        } else {
          _this.setState({ loading: false })
        }
      });
    }
  }


  render() {
    const navigation = this.props.navigation;
    const UserStore = this.props.UserStore;
    const data = this.props.data;
    const i = this.props.index;
    return (
      <View styles={styles.container}>
        <View style={styles.bodyContainer}>
          <TouchableOpacity key={i} onPress={() => this.props.editViewService(i)}>
            <View style={styles.content}>
              <View style={styles.list}>
                <View style={styles.LeftView}>
                  <Image source={(data && data.serviceIconPath) ? { uri: PUBLIC_DOMAIN + data.serviceIconPath } : require('../../../assets/icon11.png')} style={styles.images} />
                </View>
                <View style={styles.CenterView}>
                  <Text style={styles.textMedium}>{data.serviceName}</Text>
                  <View style={styles.aminityCharge}>
                    <Text style={[styles.serviceType, styles.textColor]}>{data.serviceType}</Text>
                    <Text style={[styles.serviceType, styles.textColor]}>{'\u20B9'} {data.serviceCharge}</Text>
                  </View>
                </View>
                <View style={{ justifyContent: 'center',alignItems: 'center'}} >
                  {this.state.loading
                  ? <View ><ActivityIndicator size='large' /></View>
                  : null}
                </View>
                <View style={styles.RightView}>
                  <ToggleSwitch
                    isOn={(this.state.serviceStatus == 'Available' && this.state.isToggle) ? true : false}
                    onColor='#5cb85c'
                    offColor='#e6e6e6'
                    labelStyle={{ color: 'black', fontWeight: '900' }}
                    size='small'
                    onToggle={(isOn) => this.handelServiceStatus(data, isOn)}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
};  