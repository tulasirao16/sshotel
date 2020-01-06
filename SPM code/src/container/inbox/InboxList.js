import React from 'react';
import { observer, inject } from 'mobx-react';
import { Platform, FlatList, BackHandler, ActivityIndicator, TouchableHighlight, TouchableOpacity, StatusBar, Image, ScrollView, Dimensions, Animated, RefreshControl, Keyboard, UIManager, SafeAreaView, TextInput } from 'react-native';
import { Container, Button, List, ListItem, View, Icon, Text, Left, Right, Body, Content } from 'native-base';
import styles from './css/InboxCompontCss';
import moment from 'moment';
import EachRow from './EachRow';
import SearchBar from 'react-native-searchbar';
import AwesomeButton from 'react-native-really-awesome-button';
import EachRowInboxList from '../../components/Inbox/EachRowInboxList'
import i18n from 'i18n-js';

import { LinearGradient } from 'expo-linear-gradient';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const layoutHeight = 0;

const { State: TextInputState } = TextInput;

@inject(['MessageStore'])
@observer
export default class SPInboxScreen extends React.Component {
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
      refreshing: false,
      loading: false,
      search: '',
      reload: false,
      reloadFunction: '',
      param: ''
    }
    this.page = 0
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
  }
  componentWillMount() {
    const MessageStore = this.props.MessageStore;
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    MessageStore.getServiceProviderChatListAPI('1', '', function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
    });
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
  _onRefresh = () => {
    this.setState({ activePage: 1, search: '', loading: true })
    const MessageStore = this.props.MessageStore;
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: '_onRefresh' });
    }, 10000);
    MessageStore.getSPMessages('1', '', function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
      if (resObj.statusCode == '9999') {
        _this.props.navigation.navigate('InformationScreen')
      }
    });
  }
  handleSearchChange = (Search) => {
    this.setState({ search: Search })
    const MessageStore = this.props.MessageStore;
    MessageStore.getServiceProviderChatListAPI('1', Search, function (resObj) {
    });
  }
  handleSearchBackClick = (Search) => {
    this.setState({ search: Search, loading: true })
    const MessageStore = this.props.MessageStore;
    let _this = this
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'handleSearchBackClick', param: Search });
    }, 10000);
    MessageStore.getServiceProviderChatListAPI('1', Search, function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
    })
    this.searchBar.hide()
  }

  handleScrollEnd = (e) => {
    const MessageStore = this.props.MessageStore;
    var offset = e.nativeEvent.contentOffset.y,
      height = e.nativeEvent.contentSize.height;
    if ((this.layoutHeight + offset) >= height) {
      if (MessageStore.SPChatListCount > MessageStore.SPChatList.length) {
        this.setState({ loading: true });
        const num = this.state.activePage + 1;
        const MessageStore = this.props.MessageStore;
        let _this = this
        let isLoading = setTimeout(function () {
          _this.setState({ loading: false, reload: true, reloadFunction: 'handleScrollEnd', param:e });
        }, 10000);
        MessageStore.getServiceProviderChatListAPI(num, _this.state.search, function (resObj) {
          clearTimeout(isLoading)
          if (resObj.statusCode == '0000') {
            _this.setState({ activePage: num, loading: false });
          } else {
            _this.setState({ loading: false })
          }
        });
      }
    }
  }
  handleReload = () => {
    switch (this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      case 'handleSearchBackClick':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleSearchBackClick(this.state.param)
        break;
      case 'handleScrollEnd':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleScrollEnd(this.state.param)
        break;
      case '_onRefresh':
        this.setState({ reload: false, reloadFunction: '' });
        this._onRefresh()
        break;
      default:
        break;
    }
  }
  render() {
    const navigation = this.props.navigation;
    const MessageStore = this.props.MessageStore;
    return (
      // <SafeAreaView style={{ flex: 1 }}>
      !this.state.reload
      ? <View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft} >
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.openDrawer()}>
                <Icon name='md-menu' style={styles.iconMenuStyle} />
              </TouchableHighlight>
            </View>
            <View style={styles.headerBody} >
              <Text style={styles.headerTitleStyle}> {i18n.t('lanTitleInbox')}</Text>
            </View>
            <View style={styles.headerRight} >
              <View style={{ flex: 1 }}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()} >
                  <Icon name='ios-search' style={styles.iconSearchStyle} />
                </TouchableHighlight>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.navigate('SPHomeScreen')}>
                  <Icon name='md-home' style={styles.iconHomeStyle} />
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <View style={{ position: 'absolute', top: Platform.OS === 'ios' ? 28 : 21 }}>
            <SearchBar
              ref={(ref) => this.searchBar = ref}
              handleResults={this._handleResults}
              showOnLoad={false}
              iOSPadding={false}
              iOSHideShadow={true}
              placeholder={i18n.t('lanLabelSearch')}
              placeholderTextColor='gray'
              handleChangeText={(input) => this.handleSearchChange(input)}
              onBack={() => this.handleSearchBackClick('')}
            />
          </View>
        </LinearGradient>
        {this.state.loading
          ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#ffffff' size='large' style={styles.activeIndicatorStyle} /></View>
          : null}
        <Content style={styles.content}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            style={{ width: DEVICE_WIDTH, height: Device_Height - 100, left: 0 }} onLayout={event => { this.layoutHeight = event.nativeEvent.layout.height; }} onScrollEndDrag={this.handleScrollEnd}
          >
            {(MessageStore.SPChatList && MessageStore.SPChatList.length > 0) ? MessageStore.SPChatList.map((info, i) =>
              <EachRowInboxList navigation={navigation} info={info} key={i} />)
              : <View style={styles.noDataViewStyle}><Text style={styles.noMessages}> {i18n.t('lanLabelNoMessageFound')}</Text></View>}

          </ScrollView>
        </Content>
      </View>
      : <View>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
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
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
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
    );
  }
}
