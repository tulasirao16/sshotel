import React from 'react';
import { ActivityIndicator, AsyncStorage, BackHandler, Dimensions, Text, View, StatusBar, ScrollView, Button, Platform, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Icon } from 'native-base';
import { observer, inject } from 'mobx-react';
import styles from './css/UsersListCss';
import { LinearGradient } from 'expo-linear-gradient';
import ToggleSwitch from 'toggle-switch-react-native';
import { PUBLIC_DOMAIN } from '../../../constants';
import i18n from 'i18n-js';
import AwesomeButton from 'react-native-really-awesome-button';
@inject(['UserStore'])
@observer
export default class UsersListDataScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      search: '',
      refreshing: false,
      isToggle: true,
      data: this.props.data,
      authObj: {},
      loading: false,
      reload: false,
      reloadFunction: '',
    }
    this.handleUserStatus = this.handleUserStatus.bind(this)
    this.handleUserClick = this.handleUserClick.bind(this)
  }

  async componentWillMount() {
    this.setState({ data: this.props.data, userStatus: this.props.data.userStatus });
    await AsyncStorage.getItem('authObj').then((value) => {
      let authObj = JSON.parse(value);
      this.setState({ authObj: (authObj && authObj.mobileNumber) ? authObj : {} });
    });
  }

  componentWillReceiveProps() {
    this.setState({ data: this.props.data, userStatus: this.props.data.userStatus });
  }
  handleUserStatus(isOn) {
    const UserStore = this.props.UserStore;
    const data = this.props.data;
    let UsersListingData = UserStore.UsersListingData;
    // this.setState({ loading: true });
    this.props.handleStatusChange(true)
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false });
    }, 10000);
    if (_this.state.isToggle && data.userStatus == 'Active') {
      UserStore.inActivateSPUserData(data._id, function (resObj) {
        _this.props.handleStatusChange(false)
        clearTimeout(isLoading)
        if (resObj.statusCode == '0000') {
          const index = UsersListingData.findIndex(dataObj => dataObj._id === data._id);
          UsersListingData[index].userStatus = 'Inactive'
          UserStore.UsersListingData = UsersListingData;
          _this.setState({ loading: false, isToggle: isOn, userStatus: 'Inactive' })
        } else {
          _this.setState({ loading: false })
        }
      });
    } else {
      UserStore.activateSPUserData(data._id, function (resObj) {
        _this.props.handleStatusChange(false)
        clearTimeout(isLoading)
        if (resObj.statusCode == '0000') {
          const index = UsersListingData.findIndex(dataObj => dataObj._id === data._id);
          UsersListingData[index].userStatus = 'Active'
          UserStore.UsersListingData = UsersListingData;
          _this.setState({ loading: false, isToggle: isOn, userStatus: 'Active' })
        } else {
          _this.setState({ loading: false })
        }
      });
    }
  }

  handleUserClick(data) {
    const navigation = this.props.navigation;
    navigation.navigate('UserView', { data: data, userStatus: this.state.userStatus, authObj: this.state.authObj });
  }

  render() {
    const navigation = this.props.navigation;
    const UserStore = this.props.UserStore;
    const data = this.props.data;
    return (
      <View style={styles.bodyContainer}>
        <TouchableOpacity onPress={() => this.handleUserClick(data)}>
          <View style={styles.list} >
            <View style={styles.left}>
              <Image style={styles.thumbImg} source={(data.userIconPath) ? { uri: PUBLIC_DOMAIN + data.userIconPath } : require('../../../assets/images/NoProfile.png')} />
            </View>
            <View style={styles.body}>
              <Text style={styles.textBig}> {data.firstName} {data.lastName}</Text>
              <View style={{ paddingLeft: 5 }} >
                <Text style={styles.textNote}><Icon name='ios-phone-portrait' style={{ fontSize: 12, color: '#f7931e', right: 5 }} /> {' '}{data.mobileNumber}</Text>
                <Text style={styles.textNote}><Icon name='ios-mail' style={{ fontSize: 12, color: '#f7931e', right: 5 }} /> {' '}{data.email}</Text>
                <Text style={styles.textSmall}>{i18n.t('lanLabelUserRole')} {data.userRole}</Text>
                <Text style={styles.textNote}>{i18n.t('lanLabelUserId')} {data.userAccount}</Text>
              </View>
            </View>
            {this.state.loading
            ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#ffffff' size='large' style={ styles.activeIndicatorStyle } /></View>
            : null}
            <View style={styles.right}>
              <ToggleSwitch
                isOn={(data.userStatus == 'Active') ? true : false}
                onColor='#5cb85c'
                offColor='#e6e6e6'
                labelStyle={{ color: 'black', fontWeight: '900' }}
                size='small'
                onToggle={(isOn) => this.handleUserStatus(isOn)}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}; 