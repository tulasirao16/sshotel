import React from 'react';
import { observer, inject } from 'mobx-react';
import { Platform, FlatList, BackHandler, ActivityIndicator, TouchableHighlight, TouchableOpacity, StatusBar, SafeAreaView, Image, ScrollView, Dimensions, Animated, RefreshControl, Keyboard, UIManager, TextInput } from 'react-native';
import { Container, Button, List, ListItem, View, Icon, Text, Left, Right, Body, Content } from 'native-base';
import styles from './css/InboxCompontCss';
import moment from 'moment';
import EachRow from './EachRow';
import SearchBar from 'react-native-searchbar';
import SPInboxEachMessageView from '../../components/Inbox/EachMessageViewComponent'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';
import i18n from 'i18n-js';
import Toast, { DURATION } from 'react-native-easy-toast';


const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const layoutHeight = 0;

const { State: TextInputState } = TextInput;

@inject(['MessageStore'])
@observer
export default class SPChatView extends React.Component {
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
      message: '',
      euName: '',
      euUserId: '',
      propertyId: '',
      propertyTitle: '',
      propertyType: '',
      // shift: new Animated.Value(0),
      reload: false,
      reloadFunction: '',
      param:'',
      keyboardOpen: false
    }
    this.page = 0
    // this.handleSearchChange = this.handleSearchChange.bind(this);
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
  }
  componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    const MessageStore = this.props.MessageStore;
    const navigation = this.props.navigation;
    const euUserId = navigation.state.params.euUserId;
    const propertyId = navigation.state.params.propertyId;
    let _this = this
    this.setState({ loading: true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    MessageStore.getServiceProviderEUConversationAPI(euUserId, propertyId, '1', '', function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode === '0000') {
        _this.scroll.scrollToEnd({ animated: true, index: -1 }, 0);
        _this.setState({
          euName: resObj.statusResult.messagesData[0].euName,
          euUserId: resObj.statusResult.messagesData[0].euUserId,
          propertyId: resObj.statusResult.messagesData[0].propertyId,
          propertyTitle: resObj.statusResult.messagesData[0].propertyTitle,
          propertyType: resObj.statusResult.messagesData[0].propertyType,
          loading: false
        })
      } else {
        _this.setState({loading: false})
      }
    });
    // BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    const navigation = this.props.navigation;
    navigation.goBack()
      return true
    })
  }
  componentWillUnmount() {
    this.backHandler.remove()
    // BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }

  handleSendMessage = () => {
    const MessageStore = this.props.MessageStore;
    if (!this.state.message.trim()) {
      this.refs.toast.show(i18n.t('lanErrorEnterMessageToSend'));
    } else {
      let postdata = {
        message: this.state.message,
        euName: this.state.euName,
        euUserId: this.state.euUserId,
        messagedBy: 'Service Provider',
        propertyId: this.state.propertyId,
        propertyTitle: this.state.propertyTitle,
        propertyType: this.state.propertyType
      }
      this.setState({ loading: true })
      let _this = this
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reload: true });
      }, 10000);
      MessageStore.postSPSendMessage(postdata, function (resObj) {
        clearTimeout(isLoading)
        if (resObj.statusCode === '0000') {
          let messagesArray = MessageStore.SPEUConversationList
          messagesArray.push(resObj.statusResult)
          _this.setState({ message: '', loading: false  })
          MessageStore.SPEUConversationList = messagesArray
        } else {
          _this.setState({ errorMessage: i18n.t('lanLabelSendMessageFailed'), loading: false } )
        }
      });
    }
  }

  handleKeyboardDidShow = (event) => {
    this.setState ({ keyboardOpen: true })
    // const { height: windowHeight } = Dimensions.get('window');
    // const keyboardHeight = event.endCoordinates.height;
    // const currentlyFocusedField = TextInputState.currentlyFocusedField();
    // UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
    //   const fieldHeight = height;
    //   const fieldTop = pageY;
    //   const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight + 20);
    //   if (gap >= 0) {
    //     return;
    //   }
    //   Animated.timing(
    //     this.state.shift,
    //     {
    //       toValue: gap,
    //       duration: 100,
    //       useNativeDriver: true,
    //     }
    //   ).start();
    // });
  }
  handleKeyboardDidHide = () => {
    this.setState ({ keyboardOpen: false })
    // this.scroll.scrollToEnd()
    // Animated.timing(
    //   this.state.shift,
    //   {
    //     toValue: 0,
    //     duration: 0,
    //     useNativeDriver: true,
    //   }
    // ).start();
  }

  handleScrollEnd = (e) => {
    const MessageStore = this.props.MessageStore;
    var offset = e.nativeEvent.contentOffset.y,
    height = e.nativeEvent.contentSize.height;
    if ((this.layoutHeight + offset) < height && offset == 0) {
      if (MessageStore.SPEUConversationListCount > MessageStore.SPEUConversationList.length) {
        this.setState({ loading: true });
        const num = this.state.activePage + 1;
        const MessageStore = this.props.MessageStore;
        let _this = this
        let isLoading = setTimeout(function () {
          _this.setState({ loading: false, reload: true, reloadFunction: 'handleScrollEnd', param: e });
        }, 10000);
        MessageStore.getServiceProviderEUConversationAPI(_this.state.euUserId, _this.state.propertyId, num, _this.state.search, function (resObj) {
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
  handleSearchChange = (Search) => {
    const MessageStore = this.props.MessageStore;
    this.setState({ search: Search })
    MessageStore.getServiceProviderEUConversationAPI(this.state.euUserId, this.state.propertyId, '1', Search, function (resObj) {
    });
    this.setState({ activePage: 1 })
  }

  handleSearchBackClick = (Search) => {
    this.setState({ activePage: 1, search: Search, loading: true })
    const MessageStore = this.props.MessageStore;
    let _this = this
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'handleSearchBackClick', param: Search });
    }, 10000);
    MessageStore.getServiceProviderEUConversationAPI(this.state.euUserId, this.state.propertyId, '1', Search, function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
    });
    this.searchBar.hide()
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
      default:
        break;
    }
  }



  render() {
    const navigation = this.props.navigation;
    const MessageStore = this.props.MessageStore;
    const { shift } = this.state;
    return (
      !this.state.reload
      ? <View style={styles.container}>
          <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <StatusBar barStyle='light-content' />
            <View style={styles.status} />
            <View style={styles.headerMainView} >
              <View style={styles.headerLeft} >
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.props.navigation.goBack()} >
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
                </TouchableHighlight>
              </View>
              <View style={styles.headerBody} >
                <Text style={styles.headerTitleStyle}>{this.state.propertyTitle} </Text>
              </View>
              <View style={styles.headerRight} >
                <View style={{flex:1 }}>
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()}>
                    <Icon name='ios-search' style={styles.iconSearchStyle} />
                  </TouchableHighlight>
                </View>
                <View style={{flex:1 }}>
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.navigate('SPHomeScreen')}>
                    <Icon name='md-home' style={styles.iconHomeStyle}  />
                  </TouchableHighlight>
                </View>
              </View>
            </View>
            <View style={{position:'absolute', top:21 }}>
              <SearchBar
                ref={(ref) => this.searchBar = ref}
                handleResults={this._handleResults}
                showOnLoad = {false}
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
          <View style={!this.state.keyboardOpen ? [styles.messagesContainer] : {height: Device_Height/2.7} }>
            <ScrollView
              ref={(scroll) => {this.scroll = scroll;}}
              style={{ width: DEVICE_WIDTH, left: 0, height: Device_Height-160 }}
              onLayout={event => { this.layoutHeight = event.nativeEvent.layout.height; }}
              onScrollEndDrag={this.handleScrollEnd}
              onContentSizeChange={() => {
                this.scroll.scrollToEnd({ animated: false, index: -1 }, 0);
              }}
            >
              {MessageStore.SPEUConversationList && MessageStore.SPEUConversationList.length > 0 ? MessageStore.SPEUConversationList.map((chat, i) => {
                let isEUMessage = chat.messageBy === 'End User' ? 'true' : 'false'
                let currentDay = moment().format('MMM DD, YY')
                let yesterday = moment().subtract(1, 'day').format('MMM DD, YY')
                let messageDate = moment(chat.createdOn).format('MMM DD, YY')
                let Time = messageDate === yesterday ? 'Yesterday' : messageDate === currentDay ? moment(chat.createdOn).add(5, 'hours').add(30, 'minutes').format('LT') : messageDate
                return (
                  <SPInboxEachMessageView navigation={navigation} chat={chat} key={i} />
                )
              }) : <View style={styles.noDataViewStyle}><Text style={styles.noMessages}>{i18n.t('lanLabelNoMessagesYet')}</Text></View>}

            </ScrollView>
          </View>  
          <Toast
            ref='toast'
            style={{ backgroundColor: '#ff0000', width: '100%', marginTop: 8, }}
            position='top'
            positionValue={70}
            fadeInDuration={50}
            fadeOutDuration={500}
            borderRadius={0}
            // opacity={0.8}
            textStyle={{ color: 'white', fontFamily:'Roboto_medium', }}
          />
          <View style={!this.state.keyboardOpen ? [styles.Two] : {height: Device_Height/2.7} }>
            <View style={styles.footer}>
              <View style={styles.inputBox}>
                <TextInput placeholder={i18n.t('lanLabelReply')} style={styles.inboxTextBox} value={this.state.message} onChangeText={(text) => this.setState({ message: text })} />
              </View>
              <TouchableOpacity onPress={this.handleSendMessage} >
                <View style={styles.sendView}>
                  <Icon name='md-send' style={{ color: '#fff', fontSize: 25 }} onPress={this.handleSendMessage} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
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
              <Text style={styles.headerTitleStyle}>{i18n.t('lanAppTitle')}</Text>
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
