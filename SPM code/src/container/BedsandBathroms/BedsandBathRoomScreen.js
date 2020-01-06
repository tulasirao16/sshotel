import React from 'react';
import { AsyncStorage, BackHandler, Image, StyleSheet, Platform, Dimensions, Animated, Keyboard, TouchableOpacity, ScrollView, UIManager, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button, Container, Header, Content, Form, Icon, List, ListItem, View, Left, Radio, Right, Textarea, Text, Item, Input, Label } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './css/BedsandBathRoomCss';
import AwesomeButton from "react-native-really-awesome-button";

const DEVICE_WIDTH = Dimensions.get(`window`).width;

export default class BedsandBathRoomScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header:null,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      shift: new Animated.Value(0),
      text: 'Address'
    };
  }
  _onButtonNextPress() {
    navigation = this.props.navigation
    navigation.navigate('AddCommonSpacesScreen')
  }
  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    return (
        <View style={styles.container}>
        <View style={styles.header}>
          <LinearGradient colors={['#019fa0', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.headerStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
              <View style={{ flex: 1, }}>
                <Button transparent onPress={() => navigation.goBack()}><Icon name='arrow-back' style={{ color: '#fff', marginLeft: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>
              </View>
              <View style={{ flex: 4, }}>
                <Text style={{ fontSize: 18, justifyContent: 'flex-start', fontFamily: 'Roboto_light', paddingTop: 10, color: '#fff', }}>Beds And Bath Rooms </Text>
              </View>
              <View style={{ flex: 1, opacity:0 }}>
                <Button transparent onPress={() => navigation.navigate('PrebuildTemplatesScreen')}><Icon name='apps' style={{ color: '#fff', marginRight: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>
              </View>
            </View>
          </LinearGradient>
        </View>
        <ScrollView>
          <View style={styles.content}>
            <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10, textAlign: 'left' }}>
              <Text style={styles.title}>BEDS AND BATH ROOMS </Text>
            </View>
            <View style={styles.list}>
              <View style={{ flex: 5, }}>
                <Text style={ styles.textBig }>Beds</Text>
              </View>
              <View style={{ flex: 1, }}>
                <View style={styles.circle}>
                  <Icon name='remove' style={styles.removeIcon} />
                </View>
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color:'#474747' }}>1</Text>
              </View>
              <View style={{ flex: 1, }}>
                <View style={styles.circle}>
                  <Icon name='add' style={styles.addIcon} />
                </View>
              </View>
            </View>
            <View style={styles.list}>
              <View style={{ flex: 5, }}>
                <Text style={ styles.textBig } >Bed Room</Text>
              </View>
              <View style={{ flex: 1, }}>
                <View style={styles.circle}>
                  <Icon name='remove' style={styles.removeIcon} />
                </View>
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color:'#474747' }}>1</Text>
              </View>
              <View style={{ flex: 1, }}>
                <View style={styles.circle}>
                  <Icon name='add' style={styles.addIcon} />
                </View>
              </View>
            </View>
            <View style={styles.list}>
              <View style={{ flex: 5, }}>
                <Text style={ styles.textBig } >Bathroom</Text>
              </View>
              <View style={{ flex: 1, }}>
                <View style={styles.circle}>
                  <Icon name='remove' style={styles.removeIcon} />
                </View>
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color:'#474747' }}>1</Text>
              </View>
              <View style={{ flex: 1, }}>
                <View style={styles.circle}>
                  <Icon name='add' style={styles.addIcon} />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.content}>
            <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10, textAlign: 'left' }}>
              <Text style={styles.title}>TYPE OF BEDS</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderColor: '#cfcece' }}>
              <Left>
                <View>
                  <Text style={ styles.textBig } >Bed Room 1</Text>
                </View>
              </Left>
              <Right>
                <View>
                  <Text style={ styles.textBig } >Single Bed</Text>
                </View>
              </Right>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderColor: '#cfcece' }}>
              <Left>
                <View>
                  <Text style={ styles.textBig } >Bed Room 2</Text>
                </View>
              </Left>
              <Right>
                <View>
                  <Text style={ styles.textBig } >Double Bed</Text>
                </View>
              </Right>
            </View>
          </View>
          <View style={styles.content}>
            <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10, textAlign: 'left' }}>
              <Text style={styles.title}>TYPE OF BATHROOM</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderColor: '#cfcece' }}>
              <Left>
                <View>
                  <Text style={ styles.textBig }>Sharing</Text>
                </View>
              </Left>
              <Right>
                <Radio selected={true} color='teal' style={ styles.radioBtnStyle } selectedColor='#025d8c' />
              </Right>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderColor: '#cfcece' }}>
              <Left>
                <View>
                  <Text style={ styles.textBig } >Private Bath Room</Text>
                </View>
              </Left>
              <Right>
                <Radio selected={false}  color='teal' style={ styles.radioBtnStyle }  />
              </Right>
            </View>
          </View>
          <View style={{  flexDirection: 'row', justifyContent: 'center' }} >
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
              {/* <Button rounded style={styles.buttonNext} onPress={() => this.handlePage()}><Text style={{ paddingLeft: 20, paddingRight: 20, fontFamily: (Platform.OS === 'ios') ? 'Avenir-Heavy' : 'sans-serif-condensed' }}> Proceed </Text></Button> */}
              <AwesomeButton block success
                onPress={this._onButtonNextPress.bind(this)}
                width={DEVICE_WIDTH - 30} height={50} backgroundColor='transparent' backgroundShadow='transparent'
                backgroundDarker='transparent' paddingHorizontal={50} borderRadius={5}>
                <Text style={{ color: 'white', fontSize:18,fontFamily:'Roboto_light' }}> {'Next'.toUpperCase()} </Text>
              </AwesomeButton> 
            </LinearGradient> 
          </View>
      </ScrollView >
      </View>
    );
  }
}

