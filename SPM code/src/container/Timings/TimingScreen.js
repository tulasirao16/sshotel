import React from 'react';
import { AsyncStorage, BackHandler, Image, StyleSheet, Platform, Dimensions, Animated, Keyboard, TouchableOpacity, ScrollView, UIManager, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button, Container, Header, Content, Form, Icon, List, ListItem, View, Left, Radio, Right, Textarea, Text, Item, Input, Label } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './css/TimingsCss';
import i18n from 'i18n-js';


const { State: TextInputState } = TextInput;
export default class TimingScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      title:i18n.t('lanTitleTiming'),
      header: null,
      headerStyle: {
        backgroundColor: '#025d8c'
      },
      headerTitleStyle: {
        textAlign: 'left',
        flex: 1,
        color: '#fff',
        fontSize: 16,
      },
      headerLeft: <Button transparent onPress={() => navigation.goBack()} ><Icon name='arrow-back' style={{ color: '#fff', marginLeft: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>,
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      shift: new Animated.Value(0),
      text: 'Address',
      dirty: false,
    };
  }

  _onButtonNextPress() {
    navigation = this.props.navigation
    navigation.navigate('PropertyView')
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
                <Text style={styles.headerTitle}>{i18n.t('lanTitleTimings')} </Text>
              </View>
              <View style={{ flex: 1, }}>
                {/* <Button transparent onPress={() => navigation.navigate('PrebuildTemplatesScreen')}><Icon name='apps' style={{ color: '#fff', marginRight: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button> */}
              </View>
            </View>
          </LinearGradient>
        </View>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.listItem} >
              <Left>
                <View>
                  <Text style={styles.textBig}>{i18n.t('lanLabelCheckInTime')}</Text>
                </View>
              </Left>
              <Right>
                <View>
                  <Button transparent><Text style={styles.textHover} uppercase={false}>{i18n.t('lanLabel6AM')}</Text></Button>
                </View>
              </Right>
            </View>
            <View style={styles.listItem} >
              <Left>
                <View>
                  <Text style={styles.textBig}>{i18n.t('lanLabelCheckOutTime')}</Text>
                </View>
              </Left>
              <Right>
                <View>
                  <Button transparent><Text style={styles.textHover} uppercase={false}>{i18n.t('lanLabel6AM')}</Text></Button>
                </View>
              </Right>
            </View>
          </View>
          <View style={styles.button_main}>
            <TouchableOpacity activeOpacity={.8} onPress={this._onButtonNextPress.bind(this)}>
              <LinearGradient colors={['#019fa0', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={{ padding: 15, alignItems: 'center', borderRadius: 5 }}>
                <Text style={styles.gradientBtn}>{i18n.t('lanButtonDone')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

