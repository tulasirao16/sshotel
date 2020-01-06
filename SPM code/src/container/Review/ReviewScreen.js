import React from 'react';
import { ActivityIndicator, AsyncStorage, BackHandler, Image, StyleSheet, Platform, Dimensions, Animated, Keyboard, TouchableOpacity, ScrollView, UIManager, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button, Container, Header, Content, Form, Icon, List, ListItem, View, Left, Radio, Right, Textarea, Text, Item, Input, Label } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { observer, inject } from 'mobx-react';
import i18n from 'i18n-js';
import AwesomeButton from 'react-native-really-awesome-button';
import styles from './css/ReviewCss';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const { State: TextInputState } = TextInput;

@inject(['UserStore'])
@observer
export default class ReviewScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      title: i18n.t('lanTitleReview'),
      header: null,
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
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      shift: new Animated.Value(0),
      text: 'Address',
      spPropertiesInfo: [],
      pricing: '',
      reload: false,
      reloadFunction: '',
      loading: false,
    };
  }

  _onButtonNextPress() {
    navigation = this.props.navigation
    navigation.navigate('PropertyView')
  }
  componentWillMount() {
    const navigation = this.props.navigation;
    let PropertyDetails = navigation.state.params.Data;
    const UserStore = this.props.UserStore;
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    UserStore.propertyInfo(PropertyDetails._id, function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode === '0000') {
        _this.setState({
          loading: false,
          spPropertiesInfo: resObj.statusResult[0],
          pricing: resObj.statusResult[0] && resObj.statusResult[0].pricing ? resObj.statusResult[0].pricing : null
        });
      } else {
        _this.setState({ loading: false, spPropertiesList: [] });
      }
    });
  }
  handleReload = () => {
    switch (this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      default:
        break;
    }
  }


  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    let PropertyDetails = navigation.state.params.Data;
    return (
      !this.state.reload
      ? <View style={styles.container}>
        <View style={styles.header}>
          <LinearGradient colors={['#019fa0', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.headerStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
              <View style={{ flex: 1, }}>
                <Button transparent onPress={() => navigation.goBack()}><Icon name='arrow-back' style={{ color: '#fff', marginLeft: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>
              </View>
              <View style={{ flex: 4, }}>
                <Text style={styles.headerTitle}>{i18n.t('lanTitleReview')}</Text>
              </View>
              <View style={{ flex: 1, }}>
                {/* <Button transparent onPress={() => navigation.navigate('PrebuildTemplatesScreen')}><Icon name='apps' style={{ color: '#fff', marginRight: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button> */}
              </View>
            </View>
          </LinearGradient>
        </View>
        <View>
          {this.state.loading ?
          <View style={styles.activeIndicatorView}><ActivityIndicator color='#ffffff' size='large' style={styles.activeIndicatorStyle} /></View>
          : null}
        </View>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textSmall}>{i18n.t('lanLabelTypeOfProperty')}</Text>
                  <Text style={styles.textBig}>{PropertyDetails.propertyType}</Text>
                </View>
              </Left>
              <Right>
                <View>
                  <Button transparent><Text style={styles.textHover} uppercase={false}>{i18n.t('lanButtonEdit')}</Text></Button>
                </View>
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textSmall}>{i18n.t('lanLabelTypeOfPlace')}</Text>
                  <Text style={styles.textBig}>{this.state.spPropertiesInfo.rentType}</Text>
                </View>
              </Left>
              <Right>
                <View>
                  <Button transparent><Text style={styles.textHover} uppercase={false}>{i18n.t('lanButtonEdit')}</Text></Button>
                </View>
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textSmall}>{i18n.t('lanLabelLocation')}</Text>
                </View>
                <View>
                  <Text style={styles.textBig}>{PropertyDetails.spLocationObj.address}</Text>
                </View>
              </Left>
              <Right>
                <View>
                  <Button transparent><Text style={styles.textHover} uppercase={false}>{i18n.t('lanButtonMap')}</Text></Button>
                </View>
              </Right>
            </View>
            <View style={styles.listItem} >
              <Left>
                <View>
                  <Text style={styles.textMedium}>{i18n.t('lanLabelNoGuestsAllowed')}</Text>
                </View>
              </Left>
              <Right>
                <View>
                  <Button transparent><Text style={styles.textHover} uppercase={false}>{PropertyDetails.propertyCapacity}</Text></Button>
                </View>
              </Right>
            </View>
            <View style={styles.listItem} >
              <Left>
                <View>
                  <Text style={styles.textMedium}>{i18n.t('lanLabelNoOfBedRooms')}</Text>
                </View>
              </Left>
              <Right>
                <View>
                  <Button transparent><Text style={styles.textHover} uppercase={false}>{this.state.spPropertiesInfo.roomType}</Text></Button>
                </View>
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textMedium}>{i18n.t('lanButtonCheckInCheckOutTime')}</Text>
                </View>
              </Left>
              <Right>
                <View>
                  <Button transparent><Text style={styles.textHover} uppercase={false}>{`${this.state.pricing.defaultCheckInTime}-${this.state.pricing.defaultCheckOutTime}`}</Text></Button>
                </View>
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textMedium}>{i18n.t('lanLabelBasePrice')}</Text>
                </View>
              </Left>
              <Right>
                <View>
                  <Button transparent><Text style={styles.textHover} uppercase={false}>{this.state.pricing.minBasePrice}</Text></Button>
                </View>
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textMedium}>{i18n.t('lanLabelCurrency')}</Text>
                </View>
              </Left>
              <Right>
                <View>
                  <Button transparent><Text style={styles.textHover} uppercase={false}>{this.state.pricing.currency}</Text></Button>
                </View>
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textMedium}>{i18n.t('lanLabelOffers')}</Text>
                </View>
              </Left>
              <Right>
                <View>
                  <Button transparent><Text style={styles.textHover} uppercase={false}>{this.state.pricing.offers}</Text></Button>
                </View>
              </Right>
            </View>
            <View style={styles.listItem}>
              <Left>
                <View>
                  <Text style={styles.textMedium}>{i18n.t('lanLabelDiscount')}</Text>
                </View>
              </Left>
              <Right>
                <View>
                  <Button transparent><Text style={styles.textHover} uppercase={false}>{this.state.pricing.discounts}</Text></Button>
                </View>
              </Right>
            </View>
          </View>
          <View style={styles.button_main}>
            <TouchableOpacity activeOpacity={.8} onPress={this._onButtonNextPress.bind(this)}>
              <LinearGradient colors={['#019fa0', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={{ padding: 15, alignItems: 'center', borderRadius: 5 }}>
                <Text style={styles.gradientBtn}>{i18n.t('lanButtonProceed')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      : <View>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <View style={styles.headerMainViewReload} >
            <View style={styles.headerLeftReload} >
              <TouchableOpacity>
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => navigation.goBack()} />
              </TouchableOpacity>
            </View>
            <View style={styles.headerBodyReload} >
              <TouchableOpacity>
                <Text style={styles.headerTitleStyle}>{i18n.t('lanAppTitle')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        <View style={{ jflex: 1, justifyContent: 'center', alignItems: 'center', width: DEVICE_WIDTH - 20, height: Device_Height - 150 }} >
          <View style={styles.eachBtnView} >
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
              <AwesomeButton block success
                onPress={() => this.handleReload()}
                width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                <Text style={styles.BtnText}>{i18n.t('lanButtonReload')}</Text>
              </AwesomeButton>
            </LinearGradient>
          </View>
          <Text style={styles.serverNotText} >{i18n.t('lanLabelServerNotResponding')}</Text>
        </View>
      </View>
    );
  }
}

