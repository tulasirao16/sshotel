import React from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncStorage, Button, BackHandler, Image, StyleSheet, TouchableHighlight, StatusBar, Platform, Dimensions, Animated, TouchableOpacity, ScrollView, Keyboard, UIManager, TextInput, KeyboardAvoidingView, Picker, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { Container, Header, Content, Form, Icon, View, Text, List, Switch, Left, Body, Right, ListItem, Item, Input, Label, Card, CardItem } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';
import styles from './css/aminitiesEditCss';
import { PUBLIC_DOMAIN } from '../../../constants';
import AmenitiesEachRow from './AmenitiesEachRow';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['UserStore'], ['PropertyStore'])
@observer
export default class AmenitiesEditScreen extends React.Component {
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
      shift: new Animated.Value(0),
      propertyInfoId: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyInfoId : '',
      propertyId: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyId : '',
      refreshing: false,
      reload: navigation.state.params && navigation.state.params.reload ? navigation.state.params.reload: '',
      reLoad: false,
      reloadFunction: '',
      loading: false
    }
  }
  componentWillMount() {
    this.setState({ loading : true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading : false, reLoad: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    const PropertyStore = this.props.PropertyStore;
    const navigation = this.props.navigation;
    const propertyData = navigation.state.params.propertyData
    // let _this = this;
    PropertyStore.getSPPropertyInfoList(propertyData.propertyId, propertyData.propertyInfoId, '', function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
      if (resObj.statusCode == '0000') {
        // _this.setState({ spPInfoAmenitiesList: resObj.statusResult })
      } else {
        // _this.setState({ spPInfoAmenitiesList: [] })
      }
    })
  }
  
  _onRefresh = () => {
    this.setState({ loading : true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading : false, reLoad: true, reloadFunction: '_onRefresh' });
    }, 10000);
    this.setState({ refreshing: false })
    const PropertyStore = this.props.PropertyStore;
    const navigation = this.props.navigation;
    const propertyData = navigation.state.params.propertyData
    let _this = this;
    PropertyStore.getSPPropertyInfoList(propertyData.propertyId, propertyData.propertyInfoId, '', function (resObj) {
      clearTimeout(isLoading)
        _this.setState({ loading: false })
      if (resObj.statusCode == '0000') {
        // _this.setState({ spPInfoAmenitiesList: resObj.statusResult })
      } else {
        // _this.setState({ spPInfoAmenitiesList: [] })
      }
    })
  }
  handleReload = () => {
    switch(this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reLoad: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      case '_onRefresh':
        this.setState({ reLoad: false, reloadFunction: '' });
        this._onRefresh()
        break;
      default:
        break;
    }
  }

  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    const propertyData = navigation.state.params.propertyData
    if (this.state.loading) {
      amenitiesData = <View></View>;
    } else if (PropertyStore.Amenities.length <= 0) {
      amenitiesData = <View style= { styles.noAmenities }>
        <Text style= { styles.noAmenitiesText }>{i18n.t('lanLabelNoAmenities')}</Text>
      </View>
    } else {
      amenitiesData =
        <FlatList
          data={PropertyStore.Amenities}
          renderItem={({ item, index }) => <AmenitiesEachRow navigation={navigation} data={item} i={index} propertyId={propertyData.propertyId} propertyInfoId={propertyData.propertyInfoId} />}
          keyExtractor={(item, index) => index.toString()}
        />
    }
    return (
      <View style={styles.container}>
      {!this.state.reLoad
      ?<View>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft}>
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()}>
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
              </TouchableHighlight>
            </View>
            <View style={styles.headerBody}>
                <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleAmenitiesEdit')}</Text>
            </View>
          </View>
        </LinearGradient>
        {this.state.loading
          ? <View style={ styles.activeIndicatorView }><ActivityIndicator color="#ffffff" size='large' style={ styles.activeIndicatorStyle } /></View>
          : null}
        <ScrollView 
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
        <View style={styles.businessNameView} >
          <Card style={ styles.cardBusiness }>
            <CardItem style={ styles.cardItemBusinessStyle }>
                <Left style={[styles.leftImageView, styles.listItemView ]}>
                    <View style={styles.imageBusinessBox} >
                    <Image source={propertyData.propertyIconPath ? {uri: PUBLIC_DOMAIN + propertyData.propertyIconPath} : require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
                    </View>
                    <Body>
                        <View style={ styles.floatingInputBusinessView } >
                            <Text style={styles.propertyTitle}> {propertyData && propertyData.propertyName ? propertyData.propertyName : ''}</Text>
                            <Text style={styles.titleLocationType}> {propertyData && propertyData.propertyArea ? propertyData.propertyArea : ''} </Text>
                            <Text style={styles.titleType}> {propertyData && propertyData.propertyType ? propertyData.propertyType : '' } - {i18n.t('lanTitleAmenities')}</Text>
                        </View>
                    </Body>
                </Left>  
            </CardItem>
          </Card>
        </View>
        {amenitiesData}
        {/* {
          PropertyStore.isLoadingUpdate ? 
          <View style={ styles.activeIndicatorView }><ActivityIndicator size='large' color='red' style={ styles.activeIndicatorStyle }/></View>
          : null
        } */}
        {this.state.loading
          ? null
          :  <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 17 }} >
              <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                <AwesomeButton block success
                  onPress={() => navigation.goBack()}
                  width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                  <Text style={styles.BtnText}> {i18n.t('lanButtonDone')} </Text>
                </AwesomeButton>
              </LinearGradient>
             </View>
        }
        </ScrollView>
      </View >
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
          {/* <Button onPress={() => this.handleReload()}  style={ styles.btnStyle }>
            <Text style={ styles.btnTxt } >Reload </Text>
          </Button> */}
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
  }
</View>
    );
  }
}


