import React from 'react';
import { Text, View, StatusBar, TextInput, ScrollView, Dimensions, ActivityIndicator, BackHandler } from 'react-native';
import { Icon, Label } from 'native-base';
import styles from './css/EditInboxCss';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import { observer, inject } from 'mobx-react';
import i18n from 'i18n-js';


const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['MessageStore'])
@observer


export default class EditInboxScreen extends React.Component {
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
      serviceProviderID: navigation.state.params.data && navigation.state.params.data.spServiceProviderId ? navigation.state.params.data.spServiceProviderId : '',
      spServiceProvider: navigation.state.params.data && navigation.state.params.data.spServiceProvider ? navigation.state.params.data.spServiceProvider : '',
      euName: navigation.state.params.data && navigation.state.params.data.euUserId.displayName ? navigation.state.params.data.euUserId.displayName : '',
      euUserId: navigation.state.params.data && navigation.state.params.data.euUserId ? navigation.state.params.data.euUserId._id : '',
      messageBy: navigation.state.params.data && navigation.state.params.data.messageBy ? navigation.state.params.data.messageBy : '',
      userAccount: navigation.state.params.data && navigation.state.params.data.euUserId.userAccount ? navigation.state.params.data.euUserId.userAccount : '',
      message: '',
      errorMessage: ''
    };
    this.handleSend = this.handleSend.bind(this)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
  }
  componentWillMount() {
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
  handleSend() {
    const navigation = this.props.navigation;
    const MessageStore = this.props.MessageStore;
    if (!this.state.message.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorPleaseEnterMessage')})
    } else {
      if (this.state.serviceProviderID) {
        let post_json = {
          spServiceProviderId: this.state.serviceProviderID,
          spServiceProvider: this.state.spServiceProvider,
          message: this.state.message,
          euName: this.state.euName,
          euUserId: this.state.euUserId,
          messagedBy: 'Service Provider',
          from: 'End User'
        };
        let _this = this;
        MessageStore.sendMessage(post_json, function (resObj) {
          _this.setState({ message: '' });
          if (resObj.statusCode == '0000') {
            _this.setState({ errorMessage: ' ', message: '' });
            MessageStore.getSPMessages('1', '', function (resObj) {
              _this.setState({ messageData: resObj.statusResult })
            });
            navigation.navigate('InboxScreen');
          } else {
            _this.setState({ errorMessage:  i18n.t('lanErrorSendMessageFailed'), message: '' });
          }
        });
      } else {
        let post_json = {
          adminUserId: this.state.adminUserId,
          adminName: this.state.adminName,
          message: this.state.message,
          spServiceProvider: this.state.spServiceProvider,
          euName: this.state.euName,
          messagedBy: 'Service Provider',
          from: 'Admin'
        };
        let _this = this;
        MessageStore.sendMessage(post_json, function (resObj) {
          _this.setState({ message: '' });
          if (resObj.statusCode == '0000') {
            _this.setState({ errorMessage: ' ', message: '' });
            MessageStore.getSPMessages('1', '', function (resObj) {
              _this.setState({ messageData: resObj.statusResult })
            });
            navigation.navigate('InboxScreen');
          } else {
            _this.setState({ errorMessage: ((i18n.t('lanLabelSendMessageFailed'))), message: '' });
          }
        });
      }
    }
  }

  render() {
    const navigation = this.props.navigation;
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft} >
              <View>
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => navigation.goBack()} />
              </View>
            </View>
            <View style={styles.headerBody} >
              <Text style={styles.headerTitleStyle}> {i18n.t('lanButtonSendMessage')} </Text>
            </View>
            <View style={styles.headerRight} >
            </View>
          </View>
        </LinearGradient>
        {this.state.isloading
          ? <View style={styles.activeIndicatorView}><ActivityIndicator color="#ffffff" size='large' style={styles.activeIndicatorStyle} /></View>
          : null}
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.view} >
              <Text style={[styles.textFont, styles.headingStyle]}>To: </Text>
              <Text style={[styles.textFont, styles.texStyle]}> {this.state.euName + ' '}{this.state.userAccount ? '(' + this.state.userAccount + ')' : ''}</Text>
            </View>
            <View>
              <Label style={styles.labels}>{i18n.t('lanButtonMessage')}</Label>
              <TextInput
                style={styles.textArea}
                value={this.state.ticketDescription}
                onChangeText={(text) => this.setState({ message: text, errorMessage: '' })}
                underlineColorAndroid="transparent"
                multiline={true}
                editable={true}
              />
            </View>
            <View>
              <Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>
            </View>
            <View style={styles.getCenterView} >
              <AwesomeButton block success
                onPress={() => this.handleSend()}
                width={DEVICE_WIDTH / 3} height={44} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={22} >
                <Text style={styles.BtnText} > {i18n.t('lanButtonSend')} </Text>
              </AwesomeButton>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

