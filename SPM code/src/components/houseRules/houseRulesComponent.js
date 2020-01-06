import React from 'react';
// import { observer, inject } from 'mobx-react';
import { Dimensions, TextInput, TouchableOpacity, Platform } from 'react-native';
import { View, Text, Icon, Button, Left, Right, Switch, ListItem, Radio } from 'native-base';
import styles from './css/houseRulesComponentCss';
import Modal from 'react-native-modal';

export default class Rules extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
    this.openPopUp = this.openPopUp.bind(this);
  }
  openPopUp() {
    alert('Guest popup');
  }
  _toggleModal = () =>
    this.setState({
      isModalVisible: !this.state.isModalVisible
    });
  render() {
    return (
      <View style={styles.mainView}>
        <TouchableOpacity onPress={this._toggleModal}>
          <Text style={{ justifyContent: 'flex-start', alignItems: 'flex-start', fontFamily:'Roboto_medium',fontSize:14, color:'#333' }}>HOUSE RULES</Text>
        </TouchableOpacity>
        <Modal isVisible={this.state.isModalVisible} style={styles.modalView}>
          <TouchableOpacity style={styles.closeBtn}>
            <Button transparent onPress={this._toggleModal}><Icon name='close' /></Button>
          </TouchableOpacity>
          <View style={styles.roomTypeView}>
            <View style={styles.labelView} >
              <Text style={styles.labelTxt}> HOUSE RULES</Text>
              <Text style={styles.bigTxt}> Things are Sutible</Text>
            </View>
            <ListItem style={styles.listItem}>
              <Left>
                <Text>Children (2 - 12)</Text>
              </Left>
              <Right>
                <Switch value={true} />
              </Right>
            </ListItem>
            <ListItem style={styles.listItem} >
              <Left>
                <Text>Infants ( Under 2) </Text>
              </Left>
              <Right>
                <Switch value={false} />
              </Right>
            </ListItem>
            <ListItem style={styles.listItem} >
              <Left>
                <Text>Pets</Text>
              </Left>
              <Right>
                <Switch value={false} />
              </Right>
            </ListItem>
            <ListItem style={styles.listItem} >
              <Left>
                <Text>Smokers</Text>
              </Left>
              <Right>
                <Switch value={false} />
              </Right>
            </ListItem>
            <ListItem style={styles.listItem} >
              <Left>
                <Text>Events and Parties</Text>
              </Left>
              <Right>
                <Switch value={false} />
              </Right>
            </ListItem>
            <View style={{ marginTop: 20 }}>
              <ListItem style={styles.listItem} >
                <Text style={styles.labelTxt}>Things Guest should know</Text>
              </ListItem>
              <ListItem style={styles.listItem} >
                <Text style={styles.bigTxt}>Make a Note</Text>
              </ListItem>
            </View>
            <View style={styles.btnModal}>
              <Button onPress={this._toggleModal} style={styles.btnModalSubmit}  ><Text style={styles.btnTxt}> DONE </Text></Button>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

