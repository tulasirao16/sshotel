
import React from 'react';
import { Platform, Dimensions, Animated, ScrollView } from 'react-native';
import { Button, Icon, View, Left, Right, Text } from 'native-base';
import styles from './css/TypeOfPropertyCss';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import RadioButton from 'radio-button-react-native';
import { inject, observer } from 'mobx-react';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
@inject(['PropertyStore'])
@observer
export default class TypeOfPropertyInfoScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    this.state = {
      shift: new Animated.Value(0),
      propertyType: navigation.state.params && navigation.state.params.propertyType ? navigation.state.params.propertyType : 'SingleBedRoom'
    };
    this.handlePropertyType = this.handlePropertyType.bind(this);
  }
  handlePropertyType() {
    const navigation = this.props.navigation;
    navigation.navigate('PropertyInfoView');
  }
  render() {
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
                <Text style={{ fontSize: 18, justifyContent: 'flex-start', fontFamily: 'Roboto_light', paddingTop: 10, color: '#fff', }}>{i18n.t('lanLabelTypeOfProperty')} </Text>
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
                  <Text style={styles.textBig}>{i18n.t('lanLabelSingleBedRoom')} </Text>
                </View>
              </Left>
              <Right>
                <RadioButton currentValue={this.state.propertyType} value='Single Bed Room' onPress={() => this.setState({ propertyType: 'Single Bed Room' })} />
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textBig}>{i18n.t('lanLabelDoubleBedRoom')}</Text>
                </View>
              </Left>
              <Right>
                <RadioButton currentValue={this.state.propertyType} value='Double Bed Room' onPress={() => this.setState({ propertyType: 'Double Bed Room' })} />
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textBig}>{i18n.t('lanLabelTripleApartment')}</Text>
                </View>
              </Left>
              <Right>
                <RadioButton currentValue={this.state.propertyType} value='Trible Appartment' onPress={() => this.setState({ propertyType: 'Trible Appartment' })} />
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textBig}>{i18n.t('lanLabelFullApartment')}</Text>
                </View>
              </Left>
              <Right>
                <RadioButton currentValue={this.state.propertyType} value='Full Appartment' onPress={() => this.setState({ propertyType: 'Full Appartment' })} />
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textBig}>{i18n.t('lanLabelLoft')}</Text>
                </View>
              </Left>
              <Right>
                <RadioButton currentValue={this.state.propertyType} value='Loft' onPress={() => this.setState({ propertyType: 'Loft' })} />
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textBig}>{i18n.t('lanLabelCabin')}</Text>
                </View>
              </Left>
              <Right>
                <RadioButton currentValue={this.state.propertyType} value='Cabin' onPress={() => this.setState({ propertyType: 'Cabin' })} />
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textBig}>{i18n.t('lanLabelVilla')}</Text>
                </View>
              </Left>
              <Right>
                <RadioButton currentValue={this.state.propertyType} value='Villa' onPress={() => this.setState({ propertyType: 'Villa' })} />
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textBig}>{i18n.t('lanLabelCastle')}</Text>
                </View>
              </Left>
              <Right>
                <RadioButton currentValue={this.state.propertyType} value='Castle' onPress={() => this.setState({ propertyType: 'Castle' })} />
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textBig}>{i18n.t('lanLabelDorm')}</Text>
                </View>
              </Left>
              <Right>
                <RadioButton currentValue={this.state.propertyType} value='Dorm' onPress={() => this.setState({ propertyType: 'Dorm' })} />
              </Right>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 17 }} >
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
              <AwesomeButton block success
                onPress={() => this.handlePropertyType()}
                width={DEVICE_WIDTH - 30} height={50} backgroundColor='transparent' backgroundShadow='transparent'
                backgroundDarker='transparent' paddingHorizontal={50} borderRadius={5}>
                <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Roboto_light' }}> {i18n.t('lanButtonNext')} </Text>
              </AwesomeButton>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
    );
  }
}

