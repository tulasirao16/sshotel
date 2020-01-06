import React from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncStorage, StyleSheet, Image, Platform, TouchableOpacity, BackHandler, Dimensions, Animated, Keyboard, TouchableHighlight, UIManager,TextInput } from 'react-native';
import { Container, Button,List, ListItem, Footer, Input, View, Thumbnail, Tab, Icon, Item, Tabs, Text, Left, Right, Body, Content } from 'native-base';
import styles from './css/InboxCompontCss';
import moment from 'moment';
import { PUBLIC_DOMAIN } from '../../../constants';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const { State: TextInputState } = TextInput;


@inject(['MessageStore'])
@observer
export default class EachRowInboxList extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
     header: null
    }
  };
  
  constructor(props) {
    super(props);
    this.state = {
      shift: new Animated.Value(0),
    }
    this.handleEachMessageView = this.handleEachMessageView.bind(this)
  }

  componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
  }
  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
      if (gap >= 0) {
        return;
      }
      Animated.timing(
        this.state.shift,
        {
          toValue: gap,
          duration: 1000,
          useNativeDriver: true,
        }
      ).start();
    });
  }
  handleKeyboardDidHide = () => {
    Animated.timing(
      this.state.shift,
      {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }
    ).start();
  }
  handleEachMessageView (propertyId, euUserId, propertyTitle) {
    const navigation = this.props.navigation
    this.handleReadMessages(euUserId, propertyId)
    setTimeout(function () {
      navigation.navigate('SPChatView', { propertyId: propertyId, euUserId: euUserId, propertyTitle: propertyTitle })
    }, 500);
  }


  handleReadMessages = (euUserId, propertyId) => {
    const MessageStore = this.props.MessageStore;
    let chatList = MessageStore.SPChatList
    let index = chatList.findIndex(x => (x._id.euUserId._id === euUserId && x.spReadStatusGroup[0].propertyId === propertyId))
    let unreadIndex = chatList[index].spReadStatusGroup.findIndex(y => y.spReadStatus === 'Unread')
    let spReadStatusGroup = chatList[index].spReadStatusGroup
    if ((spReadStatusGroup.length > 1 && (spReadStatusGroup[0].spReadStatus === 'Unread' || spReadStatusGroup[1].spReadStatus === 'Unread')) || spReadStatusGroup.length === 1 && spReadStatusGroup[0].spReadStatus === 'Unread') {
      MessageStore.putSPReadMessageStatusAPI(euUserId, propertyId, function (resObj) {
        if(resObj.statusCode == '0000'){
          if (unreadIndex >= 0) {
            chatList[index].spReadStatusGroup[unreadIndex].spReadStatus = 'Read'
            MessageStore.SPChatList = chatList
            // _this.setState({ chatList: chatList })
          }
        }
      });
    }
  }

  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    const info = this.props.info;
    let data = info.spReadStatusGroup.length > 1 ? info.spReadStatusGroup[0].spReadStatus === 'Unread' ? info.spReadStatusGroup[0] : info.spReadStatusGroup[1] : info.spReadStatusGroup[0]
    let currentDay = moment().format('MMM Do YY')
    let yesterday = moment().subtract(1, 'day').format('MMM Do YY')
    let messageDate = moment(data.createdOn).format('MMM Do YY')
    let Time = messageDate === yesterday ? 'Yesterday' : messageDate === currentDay ? moment(data.createdOn).add(5, 'hours').add(30, 'minutes').format('LT') : messageDate
    return (
        <List>
            <ListItem avatar style={styles.listItemStyle} Button={true} onPress={() => this.handleEachMessageView(info.spReadStatusGroup[0].propertyId, info._id.euUserId._id)}>
              <Left>
                <View style={ styles.imageView}>
                  <Image source={(info && info._id && info._id.euUserId && info._id.euUserId.userIconPath) ? { uri: PUBLIC_DOMAIN + info._id.euUserId.userIconPath } :require('../../../assets/images/WE-NEED-YOUR-HOUSE.png')} style={styles.imageView} />
                </View>
              </Left>
              <Body style={{borderBottomWidth:0, }}>
                <Text style={styles.spPropertyTitle} note>{data.euName}</Text>
                <Text style={styles.locationText}>{data.propertyTitle}</Text>
                <Text style={styles.spMessageListText} numberOfLines={1} ellipsizeMode={'tail'} note>{data.message}</Text>
              </Body>
              <Right style={{borderBottomWidth:0,  }}>
              <View style={ styles.listItemRightStyle }>
                <Text style={styles.spMessageListTime} note>{Time}</Text>
                  { data.spReadStatus === 'Unread'
                  ? <View style={ styles.badge }>
                      <Text style={ styles.spUnreadMessageCount } note>{data.count}</Text>
                      </View> : null }
                    </View>
              </Right>
            </ListItem>
          </List>
          );
        }
      }

      // <View style={ styles.mainView }>
      //   <List style={{paddingBottom:0,paddingTop:0,}}>
      //     <ListItem avatar style={styles.listItemStyle} Button={true} onPress={() => this.handleEachMessageView(info.spReadStatusGroup[0].propertyId, info._id.euUserId._id)}> 
      //       <Left>
      //         <View style={ styles.imageView1 }>
      //           <Image source={(info && info._id && info._id.euUserId && info._id.euUserId.userIconPath) ? { uri: PUBLIC_DOMAIN + info._id.euUserId.userIconPath } :require('../../../assets/images/WE-NEED-YOUR-HOUSE.png')} style={styles.imageView} />
      //         </View>
      //       </Left>
      //       <Body style={{paddingTop:0, paddingBottom:0, borderBottomWidth:0}}>
      //         <View style={ styles.listItemBodyStyle }>
      //           <Text style={styles.spPropertyTitle}>{data.propertyTitle}</Text>
      //           <Text style={styles.locationText} note>{data.euName}</Text>
      //           <Text style={styles.spMessageListText} numberOfLines={1} ellipsizeMode={'tail'} note>{data.propertyTitle}</Text>
      //         </View>
      //       </Body>
      //       <Right style={{paddingTop:0, paddingBottom:0, borderBottomWidth:0}}>
      //         <View style={ styles.listItemRightStyle }>
      //           <Text style={styles.spMessageListTime} note>{Time}</Text>
      //           { data.spReadStatus === 'Unread'
      //           ? <View style={[ styles.badge ]}>
      //             <Text style={ styles.spUnreadMessageCount } note>{data.count}</Text>
      //           </View> : null }
      //         </View>
      //       </Right>
      //     </ListItem>
      //   </List>
      // </View>


