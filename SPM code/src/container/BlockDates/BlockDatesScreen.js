import React from 'react';
import { observer, inject } from 'mobx-react';
import { Text, View, StatusBar, TouchableOpacity, TouchableHighlight, Platform, Image, BackHandler } from 'react-native';
import { Icon, Left,  Tab, Body, Tabs, Card, CardItem, } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './css/BlockDatesCss';
import SearchBar from 'react-native-searchbar';
import i18n from 'i18n-js';
import { PUBLIC_DOMAIN } from '../../../constants';
import BlockedDatesUpComingList from './BlockedDatesUpComingList';
import BlockedDatesPastList from './BlockedDatesPastList';

const layoutHeight = 0;
@inject(['PropertyStore'])
@observer
export default class BlockDatesScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null
    }
  };
  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    this.state = {
      propertyID: navigation.state.params && navigation.state.params.propertyObj ? navigation.state.params.propertyObj.propertyID : '',
      spLocationId: navigation.state.params && navigation.state.params.propertyObj ? navigation.state.params.propertyObj.spLocationId : '',
      propertyData: navigation.state.params && navigation.state.params.propertyObj ? navigation.state.params.propertyObj : {},
      currentTab: 0,
      activePage: 1,
      refreshing: false,
      refresh: navigation.state.params && navigation.state.params.date ? navigation.state.params.date : '',
      status: 'Upcoming',
      BlockedDatesList: [],
      BlockedDatesDubList: []
    };
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
  handleChangeTab = ({ i }) => {
    switch (i) {
      case 0:
       this.setState({status: 'Upcoming', currentTab: i});
       this.searchBar.hide();
      break;
      case 1:
       this.setState({status: 'Past', currentTab: i});
       this.searchBar.hide();
      break;
    }
  }
  handleSearchChange = (Search) => {
    const PropertyStore = this.props.PropertyStore;
    if(this.state.status == 'Upcoming') {
    var searchList = PropertyStore.BlockedDatesUpComingDummyList.filter(function (item) {
      return item.blockingType.indexOf(Search) > -1 ||
        item.propertyId.propertyTitle.indexOf(Search) > -1 ||
        item.blockingFromDate.indexOf(Search) > -1 ||
        item.blockingToDate.indexOf(Search) > -1
    });
    PropertyStore.BlockedDatesUpComingList = searchList;
  } else {
    var searchList = PropertyStore.BlockedDatesPastDummyList.filter(function (item) {
      return item.blockingType.indexOf(Search) > -1 ||
      item.propertyId.propertyTitle.indexOf(Search) > -1 ||
        item.blockingFromDate.indexOf(Search) > -1 ||
        item.blockingToDate.indexOf(Search) > -1
    });
    PropertyStore.BlockedDatesPastList = searchList;
  }
}
handleSearchBackClick = () => {
  this.handleSearchChange('')
  this.searchBar.hide()
}
  render() {
    const navigation = this.props.navigation;
   return (
      <View style={styles.container}>
		    <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft} >
            <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()}  >
              <Icon name='ios-arrow-back' style={styles.iconMenuStyle}/>
            </TouchableHighlight>
              
            </View>
            <View style={styles.headerBody}>
              <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleBlockedDates')}</Text>         
            </View>
            <View style={styles.headerRight}>
              <View style={{flex:1 }}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()} >
                  <Icon name='ios-search' style={styles.iconSearchStyle} />
                </TouchableHighlight>
              </View>
              {/* {navigation.state.params.propertyObj.propertyAction == 'Edit' ? */}
              <View style={{flex:1 }}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.navigate('CreateBlockedDates', { propertyObj: navigation.state.params.propertyObj })} >
                  <Icon name='ios-add' style={styles.iconMenuPlusStyle} />
                </TouchableHighlight>     
              </View>       
              {/* : null } */}
            </View>
          </View>
          <View style={{position:'absolute', top:Platform.OS === 'ios' ? 28 : 21 }}>
            <SearchBar
              ref={(ref) => this.searchBar = ref}
              showOnLoad = {false}
              iOSPadding={false}
              iOSHideShadow={true}
              placeholder={i18n.t('lanLabelSearch')}
              placeholderTextColor='gray'
              handleChangeText={(input) => this.handleSearchChange(input)}
              onBack={() => this.handleSearchBackClick('')}
            />
          </View>
		    </LinearGradient>
        <View style={ styles.businessNameView } >
          <Card style={ styles.cardBusiness }>
            <CardItem style={ styles.cardItemBusinessStyle }>
                <Left style={[styles.leftImageView, styles.listItemView ]}>
                    <View style={styles.imageBusinessBox} >
                        <Image source={this.state.propertyData && this.state.propertyData.propertyImage ? {uri: PUBLIC_DOMAIN + this.state.propertyData.propertyImage}:  require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
                    </View>
                    <Body>
                        <View style={ styles.floatingInputBusinessView } >
                            <Text style={styles.propertyTitle}> {this.state.propertyData.propertyTitle} </Text>
                            <Text style={styles.titleLocationType}> {this.state.propertyData.propertyArea} </Text>
                            <Text style={styles.titleType}> {this.state.propertyData.propertyType} - {i18n.t('lanTitleBlockedDates')} </Text>
                        </View>
                    </Body>
                </Left>  
            </CardItem>
          </Card>
        </View>
        <View  >
          <Tabs tabBarUnderlineStyle={{ borderBottomWidth: 2, borderColor: '#01a4a1' }} onChangeTab={this.handleChangeTab} initialPage={this.state.currentTab}>
            <Tab heading={i18n.t('lanTitleUpcoming')} tabStyle={{ backgroundColor: '#fff' }} textStyle={{ color: '#025d8c', fontSize: 14, fontFamily: 'Roboto_light' }} activeTabStyle={{ backgroundColor: '#fff', }} activeTextStyle={{ color: '#01a4a1', fontFamily: 'Roboto_light' }}>
            <BlockedDatesUpComingList navigation ={navigation} propertyID={this.state.propertyID} propertyData={this.state.propertyData} refresh= {this.state.refresh}/>
              </Tab>
              <Tab heading={i18n.t('lanTitlePast')} tabStyle={{ backgroundColor: '#fff' }} textStyle={{ color: '#025d8c', fontSize: 14, fontFamily: 'Roboto_light' }} activeTabStyle={{ backgroundColor: '#fff', }} activeTextStyle={{ color: '#01a4a1', fontFamily: 'Roboto_light' }}>
              <BlockedDatesPastList navigation ={navigation} propertyID={this.state.propertyID} propertyData={this.state.propertyData} refresh= {this.state.refresh}/>
              </Tab>
            </Tabs>
          </View>
      </View>
    );
  }
}