import React from 'react';
import { AsyncStorage, BackHandler, Image, StyleSheet, Platform, Dimensions, Animated, Keyboard, TouchableOpacity, ScrollView, UIManager, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button, Container, Header, Content, Form, Icon, List, ListItem, View, Left, Radio, Right, Textarea, Text, Item, Input, Label } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import styles from './css/AddCommonSpacesCss';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
import i18n from 'i18n-js';

export default class AddCommonSpacesScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
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
                <Text style={{ fontSize: 18, justifyContent: 'flex-start', fontFamily: 'Roboto_light', paddingTop: 10, color: '#fff', }}>Add Common Spaces</Text>
              </View>
              <View style={{ flex: 1, opacity: 0 }}>
                <Button transparent onPress={() => navigation.navigate('PrebuildTemplatesScreen')}><Icon name='apps' style={{ color: '#fff', marginRight: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>
              </View>
            </View>
          </LinearGradient>
        </View>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textBig}>{i18n.t('lanLabelKitchens')}</Text>
                </View>
              </Left>
              <Right>
                <Radio selected={true} selectedColor='#025d8c' color='#019fa0' style={styles.radioBtnStyle} />
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textBig}>{i18n.t('lanLabelHalls')}</Text>
                </View>
              </Left>
              <Right>
                <Radio selected={false} color='#019fa0' style={styles.radioBtnStyle} />
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textBig}>{i18n.t('lanLabelSofa')}</Text>
                </View>
              </Left>
              <Right>
                <Radio selected={false} color='#019fa0' style={styles.radioBtnStyle} />
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textBig}>{i18n.t('lanLabelKitchens')}</Text>
                </View>
              </Left>
              <Right>
                <Radio selected={false} color='#019fa0' style={styles.radioBtnStyle} />
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textBig}>{i18n.t('lanLabelHalls')}</Text>
                </View>
              </Left>
              <Right>
                <Radio selected={false} color='#019fa0' style={styles.radioBtnStyle} />
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textBig}>{i18n.t('lanLabelSofa')}</Text>
                </View>
              </Left>
              <Right>
                <Radio selected={false} color='#019fa0' style={styles.radioBtnStyle} />
              </Right>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
              {/* <Button rounded style={styles.buttonNext} onPress={() => this.handlePage()}><Text style={{ paddingLeft: 20, paddingRight: 20, fontFamily: (Platform.OS === 'ios') ? 'Avenir-Heavy' : 'sans-serif-condensed' }}> Proceed </Text></Button> */}
              <AwesomeButton block success onPress={this._onButtonNextPress.bind(this)}
                width={DEVICE_WIDTH - 30} height={50} backgroundColor='transparent' backgroundShadow='transparent'
                backgroundDarker='transparent' paddingHorizontal={50} borderRadius={5}>
                <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Roboto_light' }}> {i18n.t('lanButtonDone')}</Text>
              </AwesomeButton>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
    );
  }
}

