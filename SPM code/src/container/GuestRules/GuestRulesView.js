import React from 'react';
import { Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { View, Text, Icon, Left, Right, ListItem } from 'native-base';
import styles from './css/GuestRulesListCss';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import SearchHeader from 'react-native-search-header';
import AwesomeButton from 'react-native-really-awesome-button';
import ToggleSwitch from 'toggle-switch-react-native';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import { inject, observer } from 'mobx-react';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
import i18n from 'i18n-js';

@inject(['PropertyStore'])
@observer
export default class GuestRulesView extends React.Component {
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
      propertyId: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyId : '' , 
      isModalVisible: false,
      userAccount: '',
      guests: 2,
      children: true,
      pets: true,
      smokers: true,
      events: true,
      guestRule: '',
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }
  componentWillMount () {
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    this.setState({ loading : true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading : false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    PropertyStore.getPropertyInfoGuestRules(this.state.propertyId, this.state.propertyInfoId, function(resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })  
    });
  }
  handleGuest() {
    const navigation = this.props.navigation
    const PropertyStore = this.props.PropertyStore;
    let rulesObj = {
      guests: this.state.guests,
      children: this.state.children,
      pets: this.state.pets,
      smokers: this.state.smokers,
      events: this.state.events
    };
    PropertyStore.GuestRules = rulesObj;
    navigation.goBack();
  }
  handleToggle = (isOn, type) => {
    switch(type) {
      case 'children': 
        this.setState({children: isOn})
      break;
      case 'pets': 
        this.setState({pets: isOn})
      break;
      case 'smokers': 
        this.setState({smokers: isOn})
      break;
      case 'events': 
        this.setState({events: isOn})
      break;
    }
    this.setState({ toggle: isOn, isToggle: isOn })
  }
  _handleSearch = () => {
    this.searchHeader.show()
  }
  handleAdd () {
    if(this.state.guests < 1) {
    } else {
      this.setState({guests: this.state.guests + 1})
    } 
  }
  handleRemove () {
    if(this.state.guests == 1) {
    } else {
      this.setState({guests: this.state.guests - 1});
    } 
  }
  handleReload = () => {
    switch(this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      default:
        break;
    }
  }
  render() {
    const navigation = this.props.navigation;
    return (
      !this.state.reload
      ?<View style={styles.container}>
        <View style={styles.header}>
          <LinearGradient colors={['#019fa0', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <View style={styles.headerMainView}>
              <View style={styles.headerLeft}>
                <View>
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => navigation.goBack()} />
                </View>
              </View>
              <View style={styles.headerBody}>
                <View>
                  <Text style={styles.headerTitleStyle}>{i18n.t('lanButtonAddGuestRule')}</Text>
                </View>
              </View>
              <View style={styles.headerRight}>
                <View>
                  <TouchableOpacity onPress={this._handleSearch}>
                    <Icon name='ios-search' style={styles.iconMenuStyle} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View>
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
            </View>
          </LinearGradient>
          {this.state.isloading
          ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#ffffff' size='large' style={ styles.activeIndicatorStyle } /></View>
          : null}
        </View>
        <ScrollView>
          <View style={styles.content} >
               <View style={styles.list}>
          <View style={{ flex: 5, }}>
            <Text style={styles.bigText} uppercase={false}>{i18n.t('lanButtonNoOfGuestsAllowed')}</Text>
          </View>
          <View style={{ flex: 1, }}>
            <View style={styles.circle}>
              <Icon name='remove' style={styles.removeIcon} onPress={()=> this.handleRemove()}/>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.bigText} >{this.state.guests}</Text>
          </View>
          <View style={{ flex: 1, }}>
            <View style={styles.circle}>
            <TouchableOpacity>
              <Icon name='add' style={styles.addIcon} onPress={()=> this.handleAdd()}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
            <ListItem style={styles.listItem}>
              <Left>
                <Text style={styles.textSmall}>{i18n.t('lanButtonChildrenTwotoTwelveYears')}</Text>
              </Left>
              <Right>
              <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <ToggleSwitch
                      isOn={this.state.children}
                      onColor='steelblue'
                      offColor='red'
                      labelStyle={{ color: 'black', fontWeight: '600' }}
                      size='medium'
                      onToggle={(isOn) => this.handleToggle(isOn, 'children')}
                    />
                  </View>
              </Right>
            </ListItem>
            {/* <ListItem style={styles.listItem} >
              <Left>
                <Text style={styles.textSmall}>Infants ( Under 2) </Text>
              </Left>
              <Right>
                <Switch value={false} />
              </Right>
            </ListItem> */}
            <ListItem style={styles.listItem} >
              <Left>
                <Text style={styles.textSmall}>{i18n.t('lanButtonPets')}</Text>
              </Left>
              <Right>
              <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <ToggleSwitch
                      isOn={this.state.pets}
                      onColor='steelblue'
                      offColor='red'
                      labelStyle={{ color: 'black', fontWeight: '600' }}
                      size='medium'
                      onToggle={(isOn) => this.handleToggle(isOn, 'pets')}
                    />
                  </View>
              </Right>
            </ListItem>
            <ListItem style={styles.listItem} >
              <Left>
                <Text style={styles.textSmall}>{i18n.t('lanButtonSmokers')}</Text>
              </Left>
              <Right>
              <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <ToggleSwitch
                      isOn={this.state.smokers}
                      onColor='steelblue'
                      offColor='red'
                      labelStyle={{ color: 'black', fontWeight: '600' }}
                      size='medium'
                      onToggle={(isOn) => this.handleToggle(isOn, 'smokers')}
                    />
                  </View>
              </Right>
            </ListItem>
            <ListItem style={styles.listItem} >
              <Left>
                <Text style={styles.textSmall}>Events and Parties</Text>
              </Left>
              <Right>
              <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <ToggleSwitch
                      isOn={this.state.events}
                      onColor='steelblue'
                      offColor='red'
                      labelStyle={{ color: 'black', fontWeight: '600' }}
                      size='medium'
                      onToggle={(isOn) => this.handleToggle(isOn, 'events')}
                    />
                  </View>
              </Right>
            </ListItem>
            <View style={{ marginTop: 10 }}>
              <View>
                <Text style={styles.labelTxt}>Things Guest should know</Text>
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  label='Make a Note'
                  value={this.state.guestRule}
                  onChangeText={(text) => this.setState({ guestRule: text, errorMessage: '' })}
                  maxLength={100}
                />
              </View>
              {/* <View style={{ marginTop: 10, marginBottom: 10, }}>
                <Text style={styles.bigTxt}>Make a Note</Text>
              </View> */}
            </View>
            <View style={styles.btnModal} >
              <AwesomeButton block success
                onPress={this.handleGuest.bind(this)}
                width={DEVICE_WIDTH / 3} height={44} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={22} >
                <Text style={styles.BtnText}> Done </Text>
              </AwesomeButton>
            </View>
          </View>
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
              <Text style={styles.headerTitleStyle}>{i18n.t('lanAppTitle')}</Text>
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

