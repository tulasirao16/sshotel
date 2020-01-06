import React from 'react';
import { observer, inject } from 'mobx-react';
import { View, Image, TextInput, ScrollView, TouchableHighlight, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import { Button, Text, Item, Input, Label, Icon, Picker, Tab, Tabs, Left, Right } from 'native-base';
// import styles from './css/ViewTicketCss.js'
import { LinearGradient } from 'expo-linear-gradient';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import AwesomeButton from "react-native-really-awesome-button";
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import i18n from 'i18n-js';
import styles from './css/SupportCss'


const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;

@inject(['UserStore'], ['SupportStore'])
@observer
export default class ViewTicket extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,

  });

  constructor(props) {
    super(props);
    const navigation = props.navigation;
    this.state = {
    };
  }

  render() {
    const navigation = this.props.navigation;
    const data = navigation.state.params.data;
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft} >
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()}>
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle}  />
              </TouchableHighlight>
            </View>
            <View style={styles.headerBody} >
              <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleViewTicket')}</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.bodyContainer} >
          <ScrollView>
            <View style={styles.content}>
              <View style={styles.card}>
                <View style={styles.cardItem}>
                  <Left>
                    <View style={{ flexDirection: 'column' }}>
                      <Label style={styles.textSmall}>{i18n.t('lanLabelTicketType')}</Label>
                      <Text style={styles.textmedium}>{data.ticketTag}</Text>
                    </View>
                  </Left>
                  <Right >
                    <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                      <Label style={styles.textSmall}>{i18n.t('lanLabelTicketTitle')}</Label>
                      <Text style={styles.textmedium}>{data.ticketTitle}</Text>
                    </View>
                  </Right>
                </View>
                <View style={styles.cardItem}>
                  <Left>
                    <View style={{ flexDirection: 'column' }}>
                      <Label style={styles.textSmall}>{i18n.t('lanLabelTicketStatus')}</Label>
                      <Text style={styles.textmedium}>{data.ticketStatus}</Text>
                    </View>
                  </Left>
                  <Right >
                    <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                      <Label style={styles.textSmall}>{i18n.t('lanLabelTicketNumber')}</Label>
                      <Text style={styles.textmedium}>{data.ticketNumType + data.ticketNumber}</Text>
                    </View>
                  </Right>
                </View>
                <View style={styles.cardItem}>
                  <View style={{ flexDirection: 'column' }}>
                    <Label style={styles.textSmall}>{i18n.t('lanLabelSupportDate')}</Label>
                    <Text style={styles.textmedium}>{moment(data.createdAt).format('MMM DD, YYYY')}</Text>
                  </View>
                </View>
                <View style={styles.cardItem}>
                  <View style={{ flexDirection: 'column' }}>
                    <Label style={styles.textSmall}>{i18n.t('lanLabelTicketDescription')}</Label>
                    <Text style={styles.textmedium}>{data.ticketDescription}</Text>
                  </View>
                </View>
              </View>
              {/* <Text style={styles.labels}> Ticket Type</Text>
              <Item style={styles.item}>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: DEVICE_WIDTH - 20, left: -5 }}
                  placeholderStyle={{ color: '#000' }}
                  placeholderIconColor='#000'
                  selectedValue={data.ticketTag}
                  editable={false}
                  onValueChange={this.onValueChange2.bind(this)}
                  onChangeText={(text) => this.setState({ ticketTag: text, errorMessage: '' })}
                >
                  <Picker.Item label={data.ticketTag} value={data.ticketTag} />
                </Picker>
              </Item>
              <View style={styles.input}>
                <FloatingLabelInput
                  label="Ticket Title"
                  value={data.ticketTitle}
                  editable={false}
                />
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  label="Ticket Status"
                  value={data.ticketStatus}
                  editable={false}
                />
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  label="Ticket #"
                  value={data.ticketNumType + data.ticketNumber}
                  editable={false}
                />
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  label="Date"
                  value={moment(data.createdAt).format('MMM DD, YYYY')}
                  editable={false}
                />
              </View>
              <View>
                <Label style={styles.labels}> Ticket Description</Label>
                <TextInput
                  style={styles.textArea}
                  value={data.ticketDescription}
                  underlineColorAndroid="transparent"
                  numberOfLines={10}
                  multiline={true}
                  editable={false}
                />
              </View> */}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}