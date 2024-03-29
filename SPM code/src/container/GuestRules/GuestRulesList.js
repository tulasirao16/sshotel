import React from 'react';
import { ActivityIndicator, AsyncStorage, BackHandler, TouchableHighlight, StatusBar, Image, StyleSheet, Platform, Dimensions, Animated, TouchableOpacity, ScrollView, Keyboard, UIManager, TextInput, KeyboardAvoidingView, RefreshControl } from 'react-native';
import { Button, Container, Header, Content, Form, Icon, View, Text, List, Switch, Left, Body, Right, ListItem, Item, Input, Label, Card, CardItem } from 'native-base';
import styles from './css/GuestRulesListCss';
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from 'react-native-searchbar';
import AwesomeButton from 'react-native-really-awesome-button';
import { inject, observer } from 'mobx-react';
import { PUBLIC_DOMAIN } from '../../../constants';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['PropertyStore'])
@observer
export default class GuestRulesList extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    this.state = {
      propertyInfoId: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyInfoId : '',
      propertyId: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyId : '',
      propertyType: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyType : '',
      propertyTitle: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyTitle : '',
      propertyImage: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyImage : '',
      PIGuestRulesList: [],
      guestRulesNotes: '',
      refreshing: false,
      search: '',
      loading: false,
      reload: false,
      reloadFunction: ''
    };
  }
  componentWillMount() {
    const navigation = this.props.navigation;
    const propertyData = navigation.state.params.propertyData;
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    this.setState({ loading: true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    PropertyStore.getPropertyInfoGuestRules(this.state.propertyId, this.state.propertyInfoId, '', function (resObj) {
      clearTimeout(isLoading)
        if (resObj.statusCode == '0000') {
        _this.setState({
          PIGuestRulesList: resObj.statusResult, spPIGuestRulesList: resObj.statusResult, loading: false,
          guestRulesNotes: navigation.state.params.propertyData && navigation.state.params.propertyData.guestRulesNotes
            ? navigation.state.params.propertyData.guestRulesNotes : ''
        })
      } else {
        _this.setState({ PIGuestRulesList: [], spPIGuestRulesList: [], loading: false })
      }
    });
  }

  handleSearchChange = (Search) => {
    let searchPIGuestRulesList = this.state.spPIGuestRulesList.filter(function (item) {
      return item.ruleName.indexOf(Search) > -1;
    });
    this.setState({ PIGuestRulesList: searchPIGuestRulesList });
  }

  handleSearchBackClick = (search) => {
    this.handleSearchChange('')
    this.searchBar.hide()
  }

  _onRefresh = () => {
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    this.setState({ loading: true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: '_onRefresh' });
    }, 10000);
    PropertyStore.getPropertyInfoGuestRules(this.state.propertyId, this.state.propertyInfoId, '', function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '0000') {
        _this.setState({
          PIGuestRulesList: resObj.statusResult, spPIGuestRulesList: resObj.statusResult,
          guestRulesNotes: navigation.state.params.propertyData && navigation.state.params.propertyData.guestRulesNotes
            ? navigation.state.params.propertyData.guestRulesNotes : '', loading: false
        })
      } else if (!PropertyStore.internet_connection) {
        _this.setState({ loading: false })
        navigation.navigate('InformationScreen')
      } else {
        _this.setState({ loading: false })
      }
    })
  }
  handleReload = () => {
    switch(this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      case '_onRefresh':
        this.setState({ reload: false, reloadFunction: ''})
        this._onRefresh()
        break;
      default:
        break;
    }
  }
  render() {
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    const propertyData = navigation.state.params.propertyData;
    return (
      !this.state.reload
      ?<View style={styles.container}>
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
              <Text style={styles.headerTitleStyle}>{i18n.t('lanLabelGuestRulesList')}</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={{flex:1 }}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()} >
                  <Icon name='checkmark-circle' style={styles.checkmarkStyle}/>
                </TouchableHighlight> 
              </View>
              <View style={{flex:1}}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()}>
                  <Icon name='ios-search' style={styles.iconSearchStyle} />
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <View style={{position:'absolute', top: Platform.OS === 'ios' ? 28 : 21 }}>
            <SearchBar  
              ref={(ref) => this.searchBar = ref}
              handleResults={this._handleResults}
              showOnLoad = {false}
              iOSPadding={false}
              iOSHideShadow={true}
              placeholder={i18n.t('lanCommonLabelSearch')}
              placeholderTextColor='gray'
              handleChangeText={(input) => this.handleSearchChange(input)}
              onBack={(input) => this.handleSearchBackClick(input)}
            />
          </View>
        </LinearGradient>
        {this.state.loading
          ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#ffffff' size='large' style={ styles.activeIndicatorStyle } /></View>
          : null}
        <View style={styles.businessNameView} >
          <Card style={styles.cardBusiness}>
            <CardItem style={styles.cardItemBusinessStyle}>
              <Left style={[styles.leftImageView, styles.listItemView]}>
                <View style={styles.imageBusinessBox} >
                  <Image source={this.state.propertyImage ? { uri: PUBLIC_DOMAIN + this.state.propertyImage } : require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
                </View>
                <Body>
                  <View style={styles.floatingInputBusinessView} >
                    <Text style={styles.propertyTitle}> {propertyData && propertyData.propertyName ? propertyData.propertyName : ''} </Text>
                    <Text style={styles.titleLocationType}> {propertyData && propertyData.propertyArea ? propertyData.propertyArea : ''} </Text>
                    <Text style={styles.titleType}> {this.state.propertyType} {i18n.t('lanLabelGuestRule')}</Text>
                  </View>
                </Body>
              </Left>
            </CardItem>
          </Card>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          {this.state.PIGuestRulesList.length > 0 ?
            this.state.PIGuestRulesList.map((data, i) => {
              return (
                <TouchableOpacity key={i}>
                  <View style={styles.content} >
                    <View style={styles.list}>
                      <View style={styles.LeftView}>
                        <Image source={(data && data.ruleIconPath) ? { uri: PUBLIC_DOMAIN + data.ruleIconPath } : require('../../../assets/icon8.png')} style={styles.images} />
                      </View>
                      <View style={styles.CenterView}>
                        <Text style={ styles.textMedium }>{data.ruleName}</Text>
                        <View style={styles.aminityCharge}>
                          <Text style={[styles.serviceType, styles.textColor]}>{data.ruleStatus == 'Active' ? i18n.t('lanLabelAllowed') : i18n.t('lanLabelNotAllowed')}</Text>
                        </View>
                      </View>
                      <View style={styles.RightView}>
                        <Switch
                          value={data.ruleStatus == 'Active' ? true : false}
                          // onValueChange={(isOn) => this.handleToggle(isOn, i, item)}
                          onColor='#5cb85c'
                          offColor='#e6e6e6'
                          labelStyle={{ color: 'black', fontWeight: '600' }}
                          />            
                      </View>
                    </View>
                  </View>
                  {/* <ListItem style={styles.listItem}>
                    <View style={styles.CenterView}>
                    <Image source={(data && data.ruleIconPath) ? { uri: PUBLIC_DOMAIN + data.ruleIconPath } : require('../../../assets/icon8.png')} style={styles.images} />
                      <Text style={styles.textBig}>{data.ruleName}</Text>
                      <View style={styles.aminityCharge}>
                        <Text style={[styles.textSmall, styles.textColor]}>{data.ruleStatus == 'Active' ? 'Allowed' : 'Not Allowed'}</Text>
                      </View>
                    </View>
                    <Right>
                      <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                      <Switch value={data.ruleStatus == 'Active' ? true : false} />
                      </View>
                    </Right>
                  </ListItem> */}
                </TouchableOpacity>
              );
            })
            : <View style={styles.noAmenities}><Text style={styles.noAmenitiesText}>{i18n.t('lanLabelNoGuestRules')}</Text></View>
          }
          <View>
            <View style={styles.input}>
              <View style={styles.makeNoteView} >
                <View style={ styles.middle }><Text style={styles.labelTxt}>{i18n.t('lanLabelThingsGuestShouldKnow')}</Text></View>
                <Text style={styles.makeNoteLabelTxt}>{PropertyStore.guestRulesNotes ? PropertyStore.guestRulesNotes : ''}</Text>
              </View>
            </View>
          </View>
          {
            this.state.PIGuestRulesList.length > 0
            ? <View style={styles.btnModal} >
              <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                <AwesomeButton block success
                  onPress={() => navigation.goBack()}
                  width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent'
                  backgroundShadow='transparent' backgroundDarker='transparent'
                  paddingHorizontal={50} borderRadius={22}
                >
                  <Text style={styles.BtnText}>{i18n.t('lanCommonButtonDone')}</Text>
                </AwesomeButton>
              </LinearGradient>
            </View>
            : null
          }
        </ScrollView>
      </View>
      : <View>
        <LinearGradient colors={['#01A4A2', '#025D8C']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <View style={styles.headerMainViewReload} >
            <View style={styles.headerLeftReload} >
              <TouchableOpacity>
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => navigation.goBack()} />
              </TouchableOpacity>
            </View>
            <View style={styles.headerBodyReload} >
              <TouchableOpacity>
                <Text style={styles.headerTitleStyle1}>{i18n.t('lanAppTitle')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        <View style={{ jflex:1, justifyContent:'center', alignItems:'center', width:DEVICE_WIDTH - 20, height:Device_Height - 150}} >
          <View style={ styles.eachBtnView } >
            <LinearGradient colors={['#01A4A2', '#025D8C']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
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
    )
  }
}

