import React from 'react';
// import { observer, inject } from 'mobx-react';
import { AsyncStorage, BackHandler, Image, StyleSheet, Platform, Dimensions, Animated, Keyboard, UIManager, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Button, Container, Header, Content, Form, Icon, View, Text, List, Switch, Left, Body, Right, ListItem, Item, Input, Label, } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './css/GuestRulesCss';
import { ScrollView } from 'react-native-gesture-handler';
import i18n from 'i18n-js';

const { State: TextInputState } = TextInput;
// @inject(['UserStore'])
// @observer
export default class GuestRulesScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      title: i18n.t('lanTitleGuestRules'),
      header:null,
      headerStyle: {
        backgroundColor: '#025d8c'
      },
      headerTitleStyle: {
        textAlign: 'left',
        flex: 1,
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Roboto_medium'
      },
      headerLeft: <Button transparent onPress={() => navigation.goBack()}><Icon name='arrow-back' style={{ color: '#fff', marginLeft: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>,
      //   headerRight: <Button transparent onPress={() => navigation.navigate('PrebuildTemplatesScreen')}><Icon name='add' style={{ color: '#fff', marginRight: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>,
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      disableButton: false,
      guests: 1
    };
    this.handleAdd = this.handleAdd.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
  }
  handleAdd () {

  }
  handleRemove () {

  }
  _handleHouseRules() {
    navigation = this.props.navigation
    navigation.navigate('GuestRulesCreateScreen')
  }

  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    let params = navigation.state.params;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <LinearGradient colors={['#019fa0', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.headerStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
              <View style={{ flex: 1, }}>
                <Button transparent onPress={() => navigation.goBack()}><Icon name='arrow-back' style={{ color: '#fff', marginLeft: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>
              </View>
              <View style={{ flex: 4, }}>
                <Text style={styles.headerTitle}>{i18n.t('lanTitleGuestRules')}</Text>
              </View>
              <View style={{ flex: 1, }}>
                {/* <Button transparent onPress={() => navigation.navigate('PrebuildTemplatesScreen')}><Icon name='apps' style={{ color: '#fff', marginRight: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button> */}
              </View>
            </View>
          </LinearGradient>
        </View>
        <ScrollView>
        <View style={styles.content} >
       
        <View style={styles.list}>
          <View style={{ flex: 1, }}>
            <Text style={styles.bigText} uppercase={false}>{i18n.t('lanLabelDetailsFromGuest')}</Text>
          </View>
        </View>
        <View style={styles.list}>
          <View style={{ flex:1,}}>
          <TouchableOpacity onPress={this._handleHouseRules.bind(this)}>
            <Text style={styles.bigText} uppercase={false}>{i18n.t('lanLabelHouseRules')}</Text>
          </TouchableOpacity>
          </View>
        </View>
        {/* <View style={{ flex: 1, flexDirection: 'row', marginTop: 20,  justifyContent: 'center',  }}>
            <Button style={styles.buttonNext} ><Text style={{ justifyContent: 'center', textAlign:'center', alignItem:'center',  fontFamily: (Platform.OS === 'ios') ? 'Roboto_medium' : 'sans-serif-condensed' }}> DONE </Text></Button>
        </View> */}
        </View>
        </ScrollView>
      </View>
    );
  }
}


