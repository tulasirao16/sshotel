import React from 'react';
// import { observer, inject } from 'mobx-react';
import { AsyncStorage, BackHandler, Image, StyleSheet, Platform, Dimensions, Animated, TouchableOpacity, Keyboard, UIManager, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button, Container, Header, Content, Form, Icon, View, Text, Textarea, Card, CardItem, Body, Item, Input, Label } from 'native-base';
import styles from './css/PrebuildTemplatesCss';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import AwesomeButton from "react-native-really-awesome-button";

const DEVICE_WIDTH = Dimensions.get(`window`).width;

// @inject(['UserStore'])
// @observer
export default class PrebuildTemplatesScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
  const { params = {} } = navigation.state;
  return {
    title: 'Package fit for you',
    header: null,
    headerStyle: {
    backgroundColor: '#025d8c'
    },
    headerTitleStyle: {
    textAlign: 'left',
    flex: 1,
    color: '#fff',
    fontSize: 18,
    },
    headerLeft: <Button transparent onPress={() => navigation.goBack()}><Icon name='arrow-back' style={{ color: '#fff', marginLeft: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>,
    headerRight: <Button transparent onPress={() => navigation.navigate('PropertyView')}><Icon name='construct' style={{ color: '#fff', marginRight: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>,
  }
  };

  constructor(props) {
  super(props);
  this.state = {
    mobileNumber: '',
    countryCode: '',
    shift: new Animated.Value(0),
    errorMessage: '',
    disableButton: false
  };
  }

  _onButtonNextPress() {
  navigation = this.props.navigation
  navigation.navigate('PropertyView')
  }
  _handleReviewDetails () {
    navigation = this.props.navigation
    navigation.navigate('ReviewScreen')
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
        <View style={ styles.headerLeft } >
        <Button transparent onPress={() => navigation.goBack()}><Icon name='arrow-back' style={{ color: '#fff', marginLeft: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>
        </View>
        <View style={ styles.headerTitleView } >
        <Text style={ styles.headerTitle } >Package Fit For You</Text>
        </View>
        <View style={ styles.headerRight } >
        <Button transparent style={{ justifyContent: 'flex-end', }} onPress={() => navigation.navigate('PropertyView')}><Icon name='construct' style={{ color: '#fff', marginRight: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>
        </View>
      </View>
      </LinearGradient>
    </View>
    <ScrollView>
    <View style={styles.content}>
      <View style={styles.pageHeadingView}>
      <Text style={styles.pageHeading}>Prebuild templates for you</Text>
      </View>
      <View style={styles.main_div}>
        <TouchableOpacity onPress={this._handleReviewDetails.bind(this) } >
          <View style={styles.left_div}>
            <Button style={styles.share_button}><Text style={styles.textBig}>S</Text></Button>
            <Image source={require('../../../assets/sleep.png')} style={styles.iconImage} />
            <Text style={[styles.textSmall, styles.regularTxt]} >Bed and Breakfast</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._handleReviewDetails.bind(this) } >
          <View style={styles.Right_div}>
            <Button style={styles.private_button}><Text style={styles.textBig}>P</Text></Button>
            <Image source={require('../../../assets/sleep.png')} style={styles.iconImage} />
            <Text style={[styles.textSmall, styles.regularTxt]} >Bed and Breakfast</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.main_div}>
        <TouchableOpacity onPress={this._handleReviewDetails.bind(this) } >
          <View style={styles.left_div}>
            <Button style={styles.share_button}><Text style={styles.textBig}>S</Text></Button>
            <Image source={require('../../../assets/home.png')} style={styles.iconImage} />
            <Text style={[styles.textSmall, styles.regularTxt]} >1BH + Parking</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._handleReviewDetails.bind(this) } >
          <View style={styles.Right_div}>
            <Button style={styles.private_button}><Text style={styles.textBig}>P</Text></Button>
            <Image source={require('../../../assets/apartment.png')} style={styles.iconImage} />
            <Text style={[styles.textSmall, styles.regularTxt]}>Appartment + Parking</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
      <View style={{  flexDirection: 'row', justifyContent: 'center' }} >
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
          {/* <Button rounded style={styles.buttonNext} onPress={() => this.handlePage()}><Text style={{ paddingLeft: 20, paddingRight: 20, fontFamily: (Platform.OS === 'ios') ? 'Avenir-Heavy' : 'sans-serif-condensed' }}> Proceed </Text></Button> */}
          <AwesomeButton block success
            onPress={this._onButtonNextPress.bind(this)}
            width={DEVICE_WIDTH - 30} height={50} backgroundColor='transparent' backgroundShadow='transparent'
            backgroundDarker='transparent' paddingHorizontal={50} borderRadius={5}>
            <Text style={{ color: 'white', fontSize:18, fontFamily:'Roboto_light' }}> I can do manualy </Text>
          </AwesomeButton> 
        </LinearGradient> 
      </View>
    </ScrollView>
    </View>
  );
  }
}


