import React from 'react';
import { observer, inject } from 'mobx-react';
import { Platform, FlatList, BackHandler, ActivityIndicator, TouchableOpacity, Image, ScrollView, StatusBar, Dimensions, Animated, RefreshControl, Keyboard, UIManager, TextInput } from 'react-native';
import { Container, Button, List, ListItem, View, Icon, Text, Left, Right, Body, Content } from 'native-base';
import styles from './css/InboxCompontCss';
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from 'react-native-searchbar';
import moment from 'moment';


const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const layoutHeight = 0;
const { State: TextInputState } = TextInput;

@inject(['MessageStore'])
@observer
export default class SPInboxEachMessageView extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      shift: new Animated.Value(0),
      activePage: 1,
      refreshing: false,
      loading: false,
      search: '',
      messageData: [],
      selectedValues: [],
      lookID: [],
      check: false,
      errorMessage: '',
      isDelete: false
    }
    this.page = 0
    // this.handleData = this.handleData.bind(this);
    // this.handleDelete = this.handleDelete.bind(this)
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
  }
  // componentWillMount() {
  //   BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
  // }
  // componentWillUnmount() {
  //   BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  // }
  // _onRefresh = () => {
  //   this.setState({ refreshing: false, search: '' })
  //   const MessageStore = this.props.MessageStore;
  //   let _this = this;
  //   MessageStore.getEndUserMessages('1', '', function (resObj) {
  //     if (resObj.statusCode == '9999') {
  //       _this.props.navigation.navigate("InformationScreen")
  //     }
  //   });
  //   _this.setState({ activePage: 1 })
  // }
  // handleSearchChange = (Search) => {
  //   this.setState({ search: Search })
  //   const MessageStore = this.props.MessageStore;
  //   let _this = this
  //   MessageStore.getEndUserMessages('1', Search, function (resObj) {
  //   })
  //   _this.setState({ activePage: 1 })
  // }
  // _handleSearch = () => {
  //   this.searchHeader.show()
  // }

  // handleScrollEnd = (e) => {
  //   const MessageStore = this.props.MessageStore;
  //   var offset = e.nativeEvent.contentOffset.y,
  //     height = e.nativeEvent.contentSize.height;
  //   if ((this.layoutHeight + offset) >= height) {
  //     if (MessageStore.totalMessagesCount > MessageStore.MessagesList.length) {
  //       this.setState({ loading: true });
  //       const num = this.state.activePage + 1;
  //       if (num) {
  //         this.setState({ activePage: num });
  //         let _this = this;
  //         MessageStore.getEndUserMessages(num, _this.state.search, function (resObj) {
  //           _this.setState({ loading: false });
  //         });
  //       }
  //     }
  //   }
  // }

  // handleData(data) {
  //   let x = this.state.selectedValues;
  //   let ID = this.state.lookID;
  //   let getUserObj = x.find(user => (user._id === data._id));
  //   if (getUserObj && getUserObj._id) {
  //     let i = x.indexOf(data);
  //     let j = ID.indexOf(data._id);
  //     x.splice(i, 1);
  //     ID.splice(j, 1);
  //     this.setState({ check: false });
  //   } else {
  //     x.push(data);
  //     ID.push(data._id);
  //     this.setState({ check: true });
  //   }
  //   this.setState({ selectedValues: x, lookID: ID });
  // }
  // handleDelete() {
  //   const MessageStore = this.props.MessageStore;
  //   if (this.state.lookID.length > 0) {
  //     let _this = this;
  //     let post_json = {
  //       messageIDs: this.state.lookID
  //     };
  //     MessageStore.deleteMessages(post_json, function (resObj) {
  //       if (resObj.statusCode == '0000') {
  //         _this.setState({ lookID: [], selectedValues: [] });
  //         MessageStore.getEndUserMessages('1', '', function (resObj) {
  //           _this.setState({ messageData: resObj.statusResult })
  //         });
  //       } else {
  //         _this.setState({ lookID: [], selectedValues: [] });
  //         _this.setState({ errorMessage: 'Delete failed' });
  //       }
  //     });
  //   } else {
  //     alert('please select to delete');
  //   }
  //   this.page = 1;
  // }
  // handleBackButtonClick() {
  //   const navigation = this.props.navigation
  //   navigation.navigate("SPChatView")
  //   return true
  // }
  render() {
    const navigation = this.props.navigation;
    const chat = this.props.chat
    let isEUMessage = chat.messageBy === 'End User' ? 'true' : 'false'
    let currentDay = moment().format('MMM DD, YY')
    let yesterday = moment().subtract(1, 'day').format('MMM DD, YY')
    let messageDate = moment(chat.createdOn).format('MMM DD, YY')
    let Time = messageDate === yesterday ? 'Yesterday' : messageDate === currentDay ? moment(chat.createdOn).add(5, 'hours').add(30, 'minutes').format('LT') : messageDate
    return (
      <View style={{ flex: 1, marginTop: 10 }}>
        <View>
          {isEUMessage === 'true'
            ? <View style={styles.cardSp} >
              <View style={styles.cardItem}>
                <View style={{ alignItems: 'flex-start' }} >
                  <View style={{ flexDirection: 'row' }} >
                    <View style={{ alignItems: 'flex-start' }}>
                      <Text style={styles.spMessageText}>{chat.euName}</Text>
                    </View>
                  </View>
                  <Text style={styles.spMessageTextMessage}>{chat.message}</Text>

                  <Text style={styles.spMessageTime}>{Time}</Text>
                </View>
              </View>
              <View style={styles.triangleSp}></View>
            </View>
            : <View style={styles.cardEu} >
              <View style={styles.cardItemEu}>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.euMessageText}> You</Text>
                  <Text style={styles.euMessageTextMessage}>{chat.message}</Text>
                  <Text style={styles.spMessageTimeEu}>{Time}</Text>
                </View>
              </View>
              <View style={styles.triangleEu}></View>
            </View>}
        </View>
      </View>
    );
  }
}
