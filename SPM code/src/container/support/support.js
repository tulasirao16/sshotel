import React from 'react';
import { observer, inject } from 'mobx-react';
import { View, Image, TextInput,ActivityIndicator, ScrollView, AsyncStorage, TouchableHighlight, Platform, StyleSheet, Dimensions, TouchableOpacity, StatusBar, BackHandler } from 'react-native';
import { Container, Button, Text, Item, Input, Icon, Picker, Tab, Tabs, Segment, Label, Textarea, } from 'native-base';
import Toast, { DURATION } from 'react-native-easy-toast';
import TicketList from './TicketList';
import AddTicket from './CreateTicket';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
import SearchBar from 'react-native-searchbar';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';
import i18n from 'i18n-js';

import styles from './css/SupportCss'
const Device_Height = Dimensions.get('window').height;

const { State: TextInputState } = TextInput;

@inject(['SupportStore'])
@observer
export default class Support extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      page: 'Ticket List',
      search: '',
      pageNum: 0,
      loading: false,
      reload: false,
      reloadFunction: '',
      param1: null,
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
  }
  componentWillReceiveProps(newProps) {
    const SupportStore = this.props.SupportStore;
    const navigation = this.props.navigation;
    if (newProps.navigation.state.params && newProps.navigation.state.params.ticket == 'ticket') {
      let _this = this;
      this.setState({ loading: true });
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillReceiveProps', param1: newProps });
      }, 10000);
      SupportStore.getSPSupportData(1, '', function (resObj) {
        clearTimeout(isLoading)
        _this.setState({ loading: false })
        if (resObj.statusCode == '9999') {
          _this.props.navigation.navigate('InformationScreen')
        }
      });
    } else {
    }
  }
  handleTab(ref) {
    this.setState({ page: ref })
    this.searchBar.hide()
    if (ref == 'Ticket List') {
      const SupportStore = this.props.SupportStore;
      let _this = this;
      this.setState({ pageNum: 0, loading: true });
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reload: true, reloadFunction: 'handleTab', param1: ref });
      }, 10000);
      SupportStore.getSPSupportData(1, '', function (resObj) {
        clearTimeout(isLoading)
        _this.setState({ loading: false })
      });
    } else {
      this.setState({ pageNum: 1 })
    }
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  componentDidMount() {
    this.props.navigation.setParams({ handleSearchClick: this._handleSearchClick.bind(this) })
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  _handleSearchClick() {
    this.setState({
      show: true
    })
  }
  handleSearchChange = (Search) => {
    const SupportStore = this.props.SupportStore;
    let _this =  this
    SupportStore.getSPSupportData(1, Search, function (resObj) {
      _this.setState({ loading: false })
    });
  }
  handleSearchBackClick = (Search) => {
    const SupportStore = this.props.SupportStore;
    let _this =  this
    this.setState({ loading : true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading : false, reload: true, reloadFunction: 'handleSearchBackClick', param1: Search });
    }, 10000);
    SupportStore.getSPSupportData(1, Search, function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
    });
    this.searchBar.hide()
  }
  
  _handleBack = () => {
    const navigation = this.props.navigation;
    navigation.goBack();
  }
  handleBackButtonClick() {
    const navigation = this.props.navigation
    navigation.goBack()
    return true
  }
  handleTicket = () => {
    this.setState({ pageNum: 0 })
  }
  handleReload = () => {
    switch(this.state.reloadFunction) {
      case 'componentWillReceiveProps':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillReceiveProps(this.state.param1)
        break;
      case 'handleTab':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleTab(this.state.param1)
        break;
      case 'handleSearchBackClick':
        this.setState({ reload: false, reloadFunction: ''})
        this.handleSearchBackClick(this.state.param1)
        break;
      default:
        break;
    }
  }

  render() {
    const SupportStore = this.props.SupportStore;
    const navigation = this.props.navigation;
    return (
      !this.state.reload
      ?<View style={styles.container}>
        <View style={styles.headerStyle}>
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
                <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleSupport')}</Text>
              </View>
              <View style={styles.headerRight} >
                {this.state.page == 'Ticket List' ?
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()} >
                    <Icon name='ios-search' style={styles.iconSearchStyle} onPress={() => this.searchBar.show()} />
                  </TouchableHighlight> : null}
              </View>
            </View>
            <View style={{ position: 'absolute', top: Platform.OS === 'ios' ? 28 : 21 }}>
              <SearchBar
                ref={(ref) => this.searchBar = ref}
                handleResults={this._handleResults}
                showOnLoad={false}
                iOSPadding={false}
                iOSHideShadow={true}
                placeholder={i18n.t('lanLabelSupportSearch')}
                placeholderTextColor='gray'
                handleChangeText={(input) => this.handleSearchChange(input)}
                onBack={(input) => this.handleSearchBackClick(input)}
              />
            </View>
          </LinearGradient>
          {this.state.loading
          ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#ffffff' size='large' style={styles.activeIndicatorStyle} /></View>
          : null}
        </View>

        <Tabs initialPage={0} page={this.state.pageNum} onChangeTab={({ ref }) => this.handleTab(ref.props.value)} tabBarUnderlineStyle={{ borderBottomWidth: 2, borderColor: '#01a4a1' }}>
          <Tab value={'Ticket List'} heading={i18n.t('lanLabelTicketList')} tabStyle={{ backgroundColor: '#fff' }} textStyle={{ color: '#025d8c', fontSize: 14, fontFamily: 'Roboto_light' }} activeTabStyle={{ backgroundColor: '#fff', }} activeTextStyle={{ color: '#01a4a1', fontFamily: 'Roboto_light' }} >
            <TicketList navigation={navigation} />
          </Tab>
          <Tab value={'New Ticket'} heading={i18n.t('lanLabelNewTicket')} tabStyle={{ backgroundColor: '#fff' }} textStyle={{ color: '#025d8c', fontSize: 14, fontFamily: 'Roboto_light' }} activeTabStyle={{ backgroundColor: '#fff', }} activeTextStyle={{ color: '#01a4a1', fontFamily: 'Roboto_light' }} >
            <AddTicket navigation={navigation} handleTicket={this.handleTicket} />
          </Tab>
        </Tabs>
      </View>
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
                <Text style={styles.headerTitleStyle1}>{i18n.t('lanAppTitle')}</Text>
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
                <Text style={styles.BtnText1}>{i18n.t('lanButtonReload')}</Text>
              </AwesomeButton>
            </LinearGradient>
          </View>
          <Text style={styles.serverNotText} >{i18n.t('lanLabelServerNotResponding')}</Text>
        </View>
      </View>
    );
  }
}

