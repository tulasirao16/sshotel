import React from 'react';
import { Dimensions, TouchableOpacity, Image, TouchableHighlight, StatusBar, Animated, Keyboard, BackHandler, UIManager, TextInput } from 'react-native';
import { View, Text, Icon, Left, Right, ListItem, Switch, Card, CardItem, Body } from 'native-base';
import styles from './css/GuestRulesListCss';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
// import SearchHeader from 'react-native-search-header';
import AwesomeButton from "react-native-really-awesome-button";
import ToggleSwitch from 'toggle-switch-react-native';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import { inject, observer } from 'mobx-react';
import guestRules from '../../../assets/Amenities/guestRules.json';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;
import { PUBLIC_DOMAIN } from '../../../constants';
import i18n from 'i18n-js';

@inject(['PropertyStore'])
@observer
export default class GuestRulesCreateScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    const PropertyStore = this.props.PropertyStore;
    const navigation = this.props.navigation;
    this.state = {
      isModalVisible: false,
      userAccount: '',
      guests: 2,
      children: false,
      pets: false,
      smokers: false,
      events: false,
      errorMessage: '',
      shift: new Animated.Value(0),
      guestRule: navigation.state.params && navigation.state.params.ruleNote ? navigation.state.params.ruleNote : '',
      availableGuestRules: (PropertyStore.AvailableGuests && PropertyStore.AvailableGuests.length > 0) ? PropertyStore.AvailableGuests : [],
      guestRules: (PropertyStore.GuestRules && PropertyStore.GuestRules.length > 0) ? PropertyStore.GuestRules : guestRules ? guestRules : []
    };
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    // this.handleAdd = this.handleAdd.bind(this);
    // this.handleRemove = this.handleRemove.bind(this);
  }

  handleGuest() {
      const navigation = this.props.navigation;
      const PropertyStore = this.props.PropertyStore;
      PropertyStore.AvailableGuests = this.state.availableGuestRules;
      PropertyStore.GuestRules = this.state.guestRules;
      PropertyStore.selectedGuestRules = true;
      navigation.navigate('CreatePropertyInfo', {ruleNote: this.state.guestRule, guestRulesValidate: true});
  }
  handleToggle = (isOn, i, type) => {
    let availableGuestRules = this.state.availableGuestRules;
    let index = availableGuestRules.indexOf(type.ruleName);
    if(index === -1) {
      availableGuestRules.push(type.ruleName);
      this.state.guestRules[i].ruleStatus = 'Active';
      this.setState({availableGuestRules : availableGuestRules})
    } else {
      availableGuestRules.splice(index, 1);
      this.state.guestRules[i].ruleStatus = 'Inactive'
      this.setState({availableGuestRules : availableGuestRules})
    }
  }
  // _handleSearch = () => {
  //   this.searchHeader.show()
  // }
  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
      if (gap >= 0) {
        return;
      }
      Animated.timing(
        this.state.shift,
        {
          toValue: gap,
          duration: 1000,
          useNativeDriver: true,
        }
      ).start();
    });
  }
  handleKeyboardDidHide = () => {
    Animated.timing(
      this.state.shift,
      {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }
    ).start();
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
    const navigation = this.props.navigation;
    const { shift } = this.state;
    const propertyData = navigation.state.params.propertyData
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
        <LinearGradient colors={['#019fa0', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView}>
            <View style={styles.headerLeft}>
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()} >
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
              </TouchableHighlight>
            </View>
            <View style={styles.headerBody}>
              <Text style={styles.headerTitleStyle}>{i18n.t('lanLabelAddGuestRules')}</Text>
            </View>
            {/* <View style={styles.headerRight}>
              <TouchableOpacity onPress={this._handleSearch}>
                <Icon name='ios-search' style={styles.iconMenuStyle} />
              </TouchableOpacity>
            </View> */}
          </View>
          {/* <View>
            <SearchHeader
              ref={(searchHeader) => {
                this.searchHeader = searchHeader;
              }}
              placeholder='Search...'
              placeholderColor='gray'
              entryAnimation='from-right-side'
              onClear={() => {
                this.handleSearchChange('')
              }}
              onEnteringSearch={async (text) => {
                if (text) {
                  this.handleSearchChange(text.nativeEvent.text)
                } else {
                  return [];
                }
              }}
              onSearch={async (text) => {
                if (text) {
                  this.handleSearchChange(text.nativeEvent.text)
                } else {
                  return [];
                }
              }}
            />
          </View> */}
        </LinearGradient>
        <View style={styles.businessNameView} >
          <Card style={styles.cardBusiness}>
            <CardItem style={styles.cardItemBusinessStyle}>
              <Left style={[styles.leftImageView, styles.listItemView]}>
                <View style={styles.imageBusinessBox} >
                  <Image source={propertyData.propertyIconPath ? { uri: PUBLIC_DOMAIN + propertyData.propertyIconPath } : require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
                </View>
                <Body>
                  <View style={styles.floatingInputBusinessView} >
                    <Text style={styles.propertyTitle}> {propertyData && propertyData.propertyName ? propertyData.propertyName : ''}</Text>
                    <Text style={styles.titleLocationType}> {propertyData && propertyData.propertyArea ? propertyData.propertyArea : ''} </Text>
                    <Text style={styles.titleType}> {propertyData && propertyData.propertyType ? propertyData.propertyType : ''} {i18n.t('lanLabelGuestRule')}</Text>
                  </View>
                </Body>
              </Left>
            </CardItem>
          </Card>
        </View>
        <ScrollView>
            {this.state.guestRules.map((item , i) => 
            <View style={styles.content} key={i}>
            <View style={styles.list}>
              <View style={styles.LeftView}>
              <Image source={(item && item.ruleIconPath) ? { uri: PUBLIC_DOMAIN + item.ruleIconPath } : require('../../../assets/icon8.png')} style={styles.images} />
              </View>
              <View style={styles.CenterView}>
                <Text style={ styles.textMedium }>{item.ruleName}</Text>
                <View style={styles.aminityCharge}>
                  <Text style={[styles.serviceType, styles.textColor]}>{this.state.availableGuestRules.indexOf(item.ruleName) >= 0 ? i18n.t('lanLabelAllowed') : i18n.t('lanLabelNotAllowed')}</Text>
                </View>
              </View>
              <View style={styles.RightView}>
                <Switch
                  value={this.state.availableGuestRules.indexOf(item.ruleName) >= 0 ? true : false}
                  onValueChange={(isOn) => this.handleToggle(isOn, i, item)}
                  onColor='#5cb85c'
                  offColor='#e6e6e6'
                  labelStyle={{ color: 'black', fontWeight: '600' }}
                  />            
              </View>
            </View>
            </View>
            )}
          <View style={{ margin: 10 }}>
              <View style={ styles.middle }>
                <Text style={styles.labelTxt}>{i18n.t('lanLabelThingsGuestShouldKnow')}</Text>
              </View>
              <View style={styles.input}>
                <Text style={styles.makeNoteLabelTxt}>{i18n.t('lanLabelMakeANote')}</Text>
                <View style={{height: 70,margin:5, paddingHorizontal:5, borderColor: 'gray', borderWidth: 0, borderRadius:6, backgroundColor: '#ffffff', padding:5, elevation:1 }} >
                <TextInput  
                  style={{ top:-16, fontSize: 13, fontFamily: 'Roboto_light'}}
                  numberOfLines = {4}
                  multiline={true}
                  value={this.state.guestRule}
                  onChangeText={(text) => this.setState({ guestRule: text, errorMessage: '' })}
                  maxLength={100}
                />
                </View>
               </View>
              {/* <View style={styles.input}>
                <FloatingLabelInput
                  label="Make a Note"
                  value={this.state.guestRule}
                  onChangeText={(text) => this.setState({ guestRule: text, errorMessage: '' })}
                  maxLength={100}
                />
              </View> */}
              <Text style={styles.errorTxt}>{this.state.errorMessage}</Text>
              <View style={styles.btnModal} >
                <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                  <AwesomeButton block success
                    onPress={this.handleGuest.bind(this)}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                    <Text style={styles.BtnText}>{i18n.t('lanCommonButtonDone')}</Text>
                  </AwesomeButton>
                </LinearGradient>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    )
  }
}

