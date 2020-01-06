import React from 'react'
import { View, Text, Card, CardItem, Icon, Button } from 'native-base';
import { TouchableOpacity, Image, Dimensions } from 'react-native';
import styles from './css/EachIDProofRowCss';
import { observer, inject } from 'mobx-react';
import i18n from 'i18n-js';
import Modal from 'react-native-modal';
import { PUBLIC_DOMAIN } from '../../../constants';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['UserStore'])
@observer

export default class EachIDProofRow extends React.Component {
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
      data: this.props.data,
      isModalVisible: false
    }
    this.handleIDProofView = this.handleIDProofView.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({ data: this.props.data });
  }
  handleIDProofView(data) {
    const navigation = this.props.navigation;
    navigation.navigate('UpdateIDProofScreen', { data: data });
  }
  _toggleModal = () =>
    this.setState({
      isModalVisible: !this.state.isModalVisible
    });
  render() {
    const data = this.props.data;
    return (
      <View>
      <TouchableOpacity onPress={() => this.handleIDProofView(data)} >
        <Card style={styles.card}>
          <CardItem style={styles.cardItem}>
            <View style={styles.listMain}>
              <View>
              <Text style={styles.bookingText}><Text style={styles.boldFontStyle}>{i18n.t('lanLabelIDType')}</Text>: {data.idType}</Text>
              </View>
            </View>
          </CardItem>
          <CardItem style={styles.cardItem}>
            <View style={styles.listMain}>
              <View>
                <Text style={styles.bookingText}><Text style={styles.boldFontStyle}>{i18n.t('lanLabelIDNo')}</Text>: {data.idNumber} </Text>
              </View>
            </View>
          </CardItem>
          <CardItem style={styles.cardItem}>
            <View style={styles.listMain}>
              <View>
                <Text style={styles.bookingText}><Text style={styles.boldFontStyle}>{i18n.t('lanLabeNameOnID')}</Text>: {data.nameOnId} </Text>
              </View>
            </View>
          </CardItem>
          <CardItem style={styles.cardItem}>
            <View style={styles.listMain}>
              <View>
                <Text style={styles.bookingText}><Text style={styles.boldFontStyle}>{i18n.t('lanLabelStatus')}</Text>: {data.idStatus} </Text>
              </View>
            </View>
          </CardItem>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity transparent onPress={this._toggleModal} style={styles.idProofView} >
        <View><Text><Icon name='ios-eye' style={{ color: '#025d8c', fontSize: 30 }} /></Text></View>
      </TouchableOpacity>
      <Modal isVisible={this.state.isModalVisible} style={styles.modalView}>
        <View style={{ paddingLeft: 20 }} >
          <View><Text style={styles.idText}><Text style={styles.boldFontStyle}>{i18n.t('lanLabelProfileIDType')}</Text> {data.idType}</Text></View>
          <View><Text style={styles.idText}><Text style={styles.boldFontStyle}>{i18n.t('lanLabelProfileID')}</Text> {data.idNumber}</Text></View>
          <View>
            <View style={styles.profileImageView} >
              <Image source={(data.kycImagePath) ? { uri: PUBLIC_DOMAIN + data.kycImagePath } : ''}
                style={styles.fitImage} /></View>
          </View>
          <View style={styles.btnModal} >
            <Button onPress={this._toggleModal} uppercase={false} transparent style={styles.btnModalSubmit} >
            <Text style={styles.btnTxt}>{i18n.t('lanCommonButtonOk')}</Text>
            </Button>
          </View>
        </View>
      </Modal>
      </View>
    )
  }
}