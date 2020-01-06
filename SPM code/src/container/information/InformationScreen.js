import React from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncStorage, BackHandler, Image, TouchableHighlight, StyleSheet, StatusBar, Platform, Dimensions, Animated, TouchableOpacity, ScrollView, Keyboard, UIManager, TextInput, KeyboardAvoidingView, RefreshControl } from 'react-native';
import { Button, Container, Header, Content, Form, Icon, View, Text, List, Switch, Left, Body, Right, ListItem, Item, Input, Label, Card, CardItem } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../Amenities/css/AmenitiesCss';
import i18n from 'i18n-js';
const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['UserStore'], ['PropertyStore'])
@observer
export default class InformationScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      title: i18n.t('lanTitleInformationScreen'),
      header: null,
      headerStyle: {
        backgroundColor: '#025d8c'
      },
      headerTitleStyle: {
        textAlign: 'left',
        flex: 1,
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Roboto_medium',
      },
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      shift: new Animated.Value(0),
    }
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
  }
  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <LinearGradient colors={['#019fa0', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <StatusBar barStyle='light-content' />
            <View style={styles.status} />
            <View style={styles.headerMainView} >
              <View style={styles.headerLeft} >
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()}>
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
                </TouchableHighlight>
              </View>
              <View style={styles.headerBody} >
                <Text style={styles.headerTitleStyle}> {i18n.t('lanLabelInformation')} </Text>
              </View>
            </View>
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', }}>
              <View style={{ flex: 1, }}>
                <Button transparent onPress={() => navigation.goBack()}><Icon name='arrow-back' style={{ color: '#fff', marginLeft: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>
              </View>
              <View style={{ flex: 4, }}>
                <Text style={styles.headerTitle}>Information</Text>
              </View>
            </View> */}
          </LinearGradient>
        </View>
        <View style={styles.content}>
          <View style={styles.NoInternet}>
            <Text style={{ fontFamily: 'Roboto_medium', fontSize:14, color: '#025d8c'}}>{i18n.t('lanLabelNoInternetConnection')}</Text>
          </View>
        </View>
      </View>
    );
  }
}


