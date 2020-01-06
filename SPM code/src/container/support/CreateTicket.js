import React from 'react';
import { observer, inject } from 'mobx-react';
import { View, Image, TextInput, ScrollView, AsyncStorage, Platform, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity, StatusBar, BackHandler } from 'react-native';
import { Container, Button, Text, Item, Input, Icon, Picker, Tab, Tabs, Segment, Label, Textarea, } from 'native-base';
import Toast, { DURATION } from 'react-native-easy-toast';
import TicketList from './TicketList';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
import SearchBar from 'react-native-searchbar';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';
// import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import i18n from 'i18n-js';
import styles from './css/CreateTicketCss'

const phRegex = /^\d{10}$/
const { State: TextInputState } = TextInput;

@inject(['SupportStore'])
@observer
export default class AddTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reqEmail: '',
      reqMobileNumber: '',
      ticketTitle: '',
      ticketTag: '',
      ticketDescription: '',
      errorMessage: '',
      disableValue: false,
      loading: false,
    }
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }
  focusNextField(id) {
    this.inputs[id].focus();
  }
  componentWillMount() {
    AsyncStorage.getItem('authObj').then((value) => {
      let authObj = JSON.parse(value);
      this.setState({
        reqMobileNumber: authObj.mobileNumber,
        reqEmail: authObj.email,
        spUserId: authObj._id,
        spName: authObj.name ? authObj.name : ''
      })
    });
  }
  onValueChange2(value) {
    switch (value) {
      case 'Booking':
        this.setState({ ticketTag: value, ticketNumType: 'SBT', errorMessage: '' })
        break
      case 'Refund':
        this.setState({ ticketTag: value, ticketNumType: 'SRT', errorMessage: '' })
        break
      case 'Property':
        this.setState({ ticketTag: value, ticketNumType: 'SPPT', errorMessage: '' })
        break
      case 'Cancellation':
        this.setState({ ticketTag: value, ticketNumType: 'SCT', errorMessage: '' })
        break
      case 'Account':
        this.setState({ ticketTag: value, ticketNumType: 'SAT', errorMessage: '' })
        break
      case 'Dispute':
        this.setState({ ticketTag: value, ticketNumType: 'SDT', errorMessage: '' })
        break
      case 'Other':
        this.setState({ ticketTag: value, ticketNumType: 'SOT', errorMessage: '' })
        break
      case 'Payment':
        this.setState({ ticketTag: value, ticketNumType: 'SPMT', errorMessage: '' })
        break
    }
  }
  handleCreateTicket() {
    const navigation = this.props.navigation;
    const SupportStore = this.props.SupportStore;
    const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!this.state.ticketTag) {
      this.setState({ errorMessage: i18n.t('lanErrorTicketTypeIsRequired') })
    } else if (!this.state.reqMobileNumber.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorMobileNumberIsRequired') });
    } else if (!this.state.reqMobileNumber.trim().match(phRegex)) {
      this.setState({ errorMessage: i18n.t('lanErrorInvalidMobileNumber') });
    } else if (this.state.reqEmail && !emailValidation.test(this.state.reqEmail)) {
      this.setState({ errorMessage: i18n.t('lanErrorInvalidEmail') })
    } else if (!this.state.ticketTitle.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorTicketTitleIsRequired') })
    } else if (!this.state.ticketDescription.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorTicketDescriptionIsRequired') })
    } else {
      this.setState({ disableValue: true, loading: true })
      let post_json = {
        'ticketTitle': this.state.ticketTitle,
        'ticketTag': this.state.ticketTag,
        'reqMobileNumber': this.state.reqMobileNumber,
        'reqEmail': this.state.reqEmail,
        'ticketNumType': this.state.ticketNumType,
        'ticketDescription': this.state.ticketDescription
      }
      let _this = this;
      let isLoading = setTimeout(function () {
        _this.refs.toast.show(i18n.t('lanLabelServerNotResponding'))
        setTimeout(function () {
          _this.setState({ loading: false });
          navigation.navigate('TicketList');
        }, 2000);
      }, 15000);
      SupportStore.createSupport(post_json, function (resObj) {
        clearTimeout(isLoading)
        if (resObj.statusCode == '0000') {
          _this.refs.toastsuccess.show(i18n.t('lanSucessTicketSent'));
          _this.props.handleTicket()
          _this.setState({ ticketTitle: '',  ticketTag: '', ticketDescription: '', disableValue: false, loading: false})
          navigation.navigate('Support', { ticket: 'ticket' });
        } else if (resObj.statusCode == '9999') {
          _this.setState({ disableValue: false, loading: false })
          _this.props.navigation.navigate('InformationScreen')
        } else {
          _this.refs.toast.show(i18n.t('lanErrorTicketSentFailed'));
          _this.setState({ errorMessage: '', disableValue: false, loading: false });
        }
      });
    }
  }
  render() {
    const navigation = this.props.navigation;
    return (
      <ScrollView>
        {this.state.loading
            ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#ffffff' size='large' style={styles.activeIndicatorStyle} /></View>
            : null}
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.labels}>{i18n.t('lanLabelTicketType')}</Text>
            <Item style={styles.item}>
              <Picker
                mode='dropdown'
                iosIcon={<Icon name='arrow-down' />}
                style={{ width: DEVICE_WIDTH - 20, left: -5 }}
                placeholder='Select your Ticket'
                placeholderStyle={{ color: '#000' }}
                placeholderIconColor='#000'
                selectedValue={this.state.ticketTag}
                onValueChange={this.onValueChange2.bind(this)}
                onChangeText={(text) => this.setState({ ticketTag: text, errorMessage: '' })}
              >
                <Picker.Item label='Account' value='Account' />
                <Picker.Item label='Booking' value='Booking' />
                <Picker.Item label='Cancellation' value='Cancellation' />
                <Picker.Item label='Property' value='Property' />
                <Picker.Item label='Refund' value='Refund' />
                <Picker.Item label='Payment' value='Payment' />
                <Picker.Item label='Dispute' value='Dispute' />
                <Picker.Item label='Other' value='Other' />
              </Picker>
            </Item>
            <View style={styles.input}>
              <FloatingLabelInput
                label={i18n.t('lanLabelMobileNumber')}
                value={this.state.reqMobileNumber}
                onChangeText={(text) => this.setState({ reqMobileNumber: text, errorMessage: '' })}
                maxLength={10}
                keyboardType='numeric'
                returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                onRef={(ref) => {
                  this.inputs['Mobile Number'] = ref;
                }}
                onSubmitEditing={() => {
                  this.focusNextField('Email');
                }}
              />
            </View>
            <View style={styles.input}>
              <FloatingLabelInput
                label={i18n.t('lanLabelEmail')}
                value={this.state.reqEmail}
                onChangeText={(text) => this.setState({ reqEmail: text, errorMessage: '' })}
                maxLength={80}
                returnKeyType={'next'}
                onRef={(ref) => {
                  this.inputs['Email'] = ref;
                }}
                onSubmitEditing={() => {
                  this.focusNextField('Ticket Title');
                }}
              />
            </View>
            <View style={styles.input}>
              <FloatingLabelInput
                label={i18n.t('lanLabelTicketTitle')}
                value={this.state.ticketTitle}
                onChangeText={(text) => this.setState({ ticketTitle: text, errorMessage: '' })}
                maxLength={20}
                returnKeyType={'next'}
                onRef={(ref) => {
                  this.inputs['Ticket Title'] = ref;
                }}
                onSubmitEditing={() => { this.AddressField.focus() }}
              />
            </View>
            <View>
              <Label style={styles.labels}>{i18n.t('lanLabelTicketDescription')}</Label>
              <TextInput
                style={styles.textArea}
                value={this.state.ticketDescription}
                onChangeText={(text) => this.setState({ ticketDescription: text, errorMessage: '' })}
                underlineColorAndroid='transparent'
                numberOfLines={10}
                multiline={true}
                editable={true}
                ref={(input) => { this.AddressField = input }}
              />
            </View>
            <View style={{ justifyContent: 'center', marginVertical: 20 }}>
              <Text style={{ color: 'red', fontSize: 15 }}>{this.state.errorMessage}</Text>
            </View>
            <View style={styles.getCenterView} >
              <AwesomeButton block success
                onPress={() => this.handleCreateTicket()}
                width={DEVICE_WIDTH / 3} height={44} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={22} marginTop={40}>
                <Text style={styles.BtnText} >{i18n.t('lanCommonButtonDone')}</Text>
              </AwesomeButton>
            </View>
            <Toast
              ref='toast'
              style={{ backgroundColor: '#ff0000', width: '100%', marginTop: 18 }}
              position='top'
              positionValue={63}
              fadeInDuration={50}
              fadeOutDuration={500}
              opacity={0.8}
              textStyle={{ color: 'white' }}
            />
            <Toast
              ref='toastsuccess'
              style={{ backgroundColor: 'green', width: '100%', marginTop: 20, marginBottom: 10 }}
              position='top'
              positionValue={60}
              fadeInDuration={500}
              fadeOutDuration={5000}
              opacity={0.8}
              textStyle={{ color: 'white' }}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
