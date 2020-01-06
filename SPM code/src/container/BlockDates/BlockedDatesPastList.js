import React from 'react';
import { Text, View, ScrollView, Dimensions, StatusBar, TouchableOpacity, Image, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { observer, inject } from 'mobx-react';
import BlockedDatesRow from './BlockedDatesRow';
import styles from './css/BlockDatesCss';
import i18n from 'i18n-js';
import AwesomeButton from 'react-native-really-awesome-button';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['PropertyStore'])
@observer
export default class BlockedDatesPastList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      propertyData: {},
      propertyID: '',
      status: 'Past',
      loading: false,
      reload: false,
      reloadFunction: ''
    }
  }
  componentWillMount() {
    this.setState({ propertyID: this.props.propertyID, propertyData: this.props.propertyData });
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    this.setState({ loading: true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    PropertyStore.getPropertyPastBlockedDates(this.props.propertyID, function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
      if (!PropertyStore.internet_connection) {
        _this.props.navigation.navigate('InformationScreen')
      }
    });
  }
  componentWillReceiveProps() {
    const PropertyStore = this.props.PropertyStore;
    if (PropertyStore.refresh == 'refresh') {
      let _this = this;
      this.setState({ loading: true });
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillReceiveProps' });
      }, 10000);
      PropertyStore.getPropertyPastBlockedDates(this.props.propertyID, function (resObj) {
        clearTimeout(isLoading)
        _this.setState({ loading: false })
        PropertyStore.refresh = '';
        if (!PropertyStore.internet_connection) {
          _this.props.navigation.navigate('InformationScreen')
        }
      });
    }
  }
  _onRefresh = () => {
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    this.setState({ loading: true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: '_onRefresh' });
    }, 10000);
    PropertyStore.getPropertyPastBlockedDates(this.state.propertyID, function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false });
      if (!PropertyStore.internet_connection) {
        _this.props.navigation.navigate('InformationScreen')
      }
    });
  }
  handleReload = () => {
    switch (this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      case 'componentWillReceiveProps':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillReceiveProps()
        break;
      case '_onRefresh':
        this.setState({ reload: false, reloadFunction: '' })
        this._onRefresh()
        break;
      default:
        break;
    }
  }
  render() {
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    let userData;
    // if (PropertyStore.isLoading == true) {
    //   userData = <View><ActivityIndicator size='large' /></View>;
    if (this.state.loading) {
      userData = <View style={styles.activeIndicatorView}><ActivityIndicator color='#ffffff' size='large' style={styles.activeIndicatorStyle} /></View>;
    } else if (PropertyStore.BlockedDatesPastList.length <= 0) {
      userData = <View style={styles.noDataViewStyle} >
        <Text style={styles.noUser}>{i18n.t('lanErrorNoBlockedDates')}</Text>
      </View>
    } else {
      userData =
        <FlatList
          refreshControl={
            <RefreshControl />
          }
          data={PropertyStore.BlockedDatesPastList}
          renderItem={({ item, index }) => <BlockedDatesRow navigation={navigation} data={item} i={index} propertyData={this.state.propertyData} status={this.state.status} />}
          keyExtractor={(item, index) => index.toString()}
        />
    }
    return (
      <View style={styles.container}>
        {!this.state.reload
          ? <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <View style={styles.content} >
              {userData}
            </View>
          </ScrollView>
          : <View>
            <LinearGradient colors={['#01A4A2', '#025D8C']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
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
        }
      </View>
    )
  }
}
