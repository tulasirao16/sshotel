import React from 'react';
import { observer, inject } from 'mobx-react';
import { ScrollView, Animated, AsyncStorage, TouchableOpacity, TouchableHighlight, StatusBar, Image, BackHandler } from 'react-native';
import { View, Icon, Text, Switch, Label, Left, Body, Right, Card, CardItem } from 'native-base';
import styles from './css/LocationViewCss';
import { LinearGradient } from 'expo-linear-gradient';
import { PUBLIC_DOMAIN } from '../../../constants';
import ToggleSwitch from 'toggle-switch-react-native';
import i18n from 'i18n-js';

@inject(['UserStore'])
@observer

export default class LocationsViewScreen extends React.Component {

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
      propertyID: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyID : '',
      propertyTitle: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyTitle : '',
      propertyType: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyType : '',
      propertyImage: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyImage : '',
      propertyArea: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyArea.area : '',
      propertyAction: navigation.state.params && navigation.state.params.propertyData && navigation.state.params.propertyData.propertyAction ? navigation.state.params.propertyData.propertyAction : 'View',
      spServiceProvider: '',
      propertyData: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData : {},
      toggle: false
    }
    this.handleBackButton = this.handleBackButton.bind(this)
    this.handleLocationEdit = this.handleLocationEdit.bind(this)
  }

  componentWillMount() {
    AsyncStorage.getItem('authObj').then((value) => {
      let authObj = JSON.parse(value);
      this.setState({
        spServiceProvider: authObj.spServiceProvider,
        mobileNumber: authObj.mobileNumber,
        alternateMobileNumber: authObj.alternateMobileNumber,
        email: authObj.email,
        contactPerson: authObj.spServiceProviderId.contactPerson
      });
    });
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
  handleBackButton() {
    const navigation = this.props.navigation;
    navigation.navigate('LocationsList');
    return true;
  }
  handleLocationEdit(data) {
    const PropertyStore = this.props.PropertyStore;
    const navigation = this.props.navigation;
    navigation.navigate('LocationsEditScreen', { data: data, propertyData: this.state.propertyData });
  }

  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    let data = navigation.state.params && navigation.state.params.data && navigation.state.params.data.locationData ? navigation.state.params.data.locationData : navigation.state.params.locationObj;
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft} >
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()}>
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
              </TouchableHighlight>
            </View>
            <View style={styles.headerBody} >
              <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleLocationView')} </Text>
            </View>
            <View style={styles.headerRight} >
              <View>
                {(navigation.state.params && navigation.state.params.data && navigation.state.params.data.propertyAction && navigation.state.params.data.propertyAction == 'Edit') ||
                  (navigation.state.params && navigation.state.params.locationObj && navigation.state.params.locationObj.propertyAction == 'Edit') ?
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.handleLocationEdit(data)}>
                    <Icon name='create' style={styles.iconEditStyle} />
                  </TouchableHighlight>
                  : null}
              </View>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.businessNameView} >
          <Card style={styles.cardBusiness}>
            <CardItem style={styles.cardItemBusinessStyle}>
              <Left style={[styles.leftImageView, styles.listItemView]}>
                {/* <View style={styles.imageBusinessBox} >
                  <Image source={this.state.propertyImage ? { uri: PUBLIC_DOMAIN + this.state.propertyImage } : require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
                </View> */}
                <Body>
                  <View style={styles.floatingInputBusinessView} >
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.propertyTitle}> {this.state.propertyTitle ? this.state.propertyTitle : this.state.spServiceProvider} </Text>
                    <Text style={styles.titleLocationType}> {this.state.propertyArea ? this.state.propertyArea : this.state.area} </Text>
                    <Text style={styles.titleType}> {this.state.propertyType ? this.state.propertyType : 'Hotel'} - {i18n.t('lanLabelLocationView')} </Text>
                  </View>
                </Body>
              </Left>
            </CardItem>
          </Card>
        </View>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.card}>
              <View style={styles.cardItem}>
                <Left>
                  <View style={{ flexDirection: 'column' }}>
                    <Label style={styles.textSmall}>{i18n.t('lanLabelArea')}</Label>
                    <Text style={styles.textmedium}>{data.area}</Text>
                  </View>
                </Left>
                <Right >
                  <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <Label style={styles.textSmall}>{i18n.t('lanLabelLandmark')}</Label>
                    <Text style={styles.textmedium}>{data.landmark}</Text>
                  </View>
                </Right>
              </View>
              <View style={styles.cardItem}>
                <Left>
                  <View >
                    <Label style={styles.textSmall}>{i18n.t('lanLabelPinCode')}</Label>
                    <View>
                      <Text style={styles.textmedium}>{data.zip}</Text>
                    </View>
                  </View>
                </Left>
                <Right>
                  <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <Label style={styles.textSmall}>{i18n.t('lanLabelCity')}</Label>
                    <View>
                      <Text style={styles.textmedium}>{data.city}</Text>
                    </View>
                  </View>
                </Right>
              </View>
              <View style={styles.cardItem}>
                <Left>
                  <View >
                    <Label style={styles.textSmall}>{i18n.t('lanLabelState')}</Label>
                    <View>
                      <Text style={styles.textmedium}>{data.state}</Text>
                    </View>
                  </View>
                </Left>
                <Right>
                  <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <Label style={styles.textSmall}>{i18n.t('lanLabelCountry')}</Label>
                    <View>
                      <Text style={styles.textmedium}>{data.country}</Text>
                    </View>
                  </View>
                </Right>
              </View>
              <View style={styles.cardItem}>
                <View >
                  <Label style={styles.textSmall}>{i18n.t('lanLabelAddress')}</Label>
                  <View>
                    <Text style={styles.textmedium}>{data.address}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.cardItem}>
                <Left>
                  <View >
                    <Label style={styles.textSmall}>{i18n.t('lanLabelLatitude')}</Label>
                    <View>
                      <Text style={styles.textmedium}>{data.latitude}</Text>
                    </View>
                  </View>
                </Left>
                <Body>
                  <View>
                    <Label style={styles.textSmall}>{i18n.t('lanLabelLongitude')}</Label>
                    <View>
                      <Text style={styles.textmedium}>{data.longitude}</Text>
                    </View>
                  </View>
                </Body>
                <Right>
                  <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <ToggleSwitch
                      isOn={data.locationStatus == 'Active' ? true : this.state.isToggle ? true : false} onColor='steelblue'
                      onColor='#5cb85c'
                      offColor='#e6e6e6'
                      labelStyle={{ color: 'black', fontWeight: '600' }}
                      size='medium'
                      onToggle={(isOn) => (isOn)}
                    />
                  </View>
                </Right>
              </View>
              <View style={styles.cardItem}>
                <Left>
                  <View >
                    <Label style={styles.textSmall}>{i18n.t('lanLabelContactPerson')}</Label>
                    <View>
                      <Text style={styles.textmedium}>{data.contactPerson}</Text>
                    </View>
                  </View>
                </Left>
                <Right>
                  <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <Label style={styles.textSmall}>{i18n.t('lanLabelEmail')}</Label>
                    <View>
                      <Text style={styles.textmedium}>{data.email}</Text>
                    </View>
                  </View>
                </Right>
              </View>
              <View style={styles.cardItem}>
                <Left>
                  <View >
                    <Label style={styles.textSmall}>{i18n.t('lanLabelMobileNumber')}</Label>
                    <View>
                      <Text style={styles.textmedium}>{data.mobileNumber}</Text>
                    </View>
                  </View>
                </Left>
                <Right>
                  <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <Label style={styles.textSmall}>{i18n.t('lanLabelAlternateMobileNumber')}</Label>
                    <View>
                      <Text style={styles.textmedium}>{data.alternateMobileNumber}</Text>
                    </View>
                  </View>
                </Right>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

