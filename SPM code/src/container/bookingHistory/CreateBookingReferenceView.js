import React from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncStorage, BackHandler, Image, Platform, StatusBar, Dimensions, Animated, TouchableOpacity, TouchableHighlight, ScrollView, Keyboard, UIManager, TextInput, KeyboardAvoidingView, ActivityIndicator, RefreshControl } from 'react-native';
import { Icon, View, Text, List, Switch, Left, Body, Card, CardItem } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import styles from '../Amenities/css/AmenitiesCss';
import { PUBLIC_DOMAIN } from '../../../constants';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['UserStore'], ['PropertyStore'])
@observer
export default class CreateBookingsReferenceView extends React.Component {
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
      propertyType: navigation.state.params.propertyData.propertyId && navigation.state.params.propertyData.propertyId.propertyType ? navigation.state.params.propertyData.propertyId.propertyType : '',
      propertyImage: navigation.state.params.propertyData.propertyId && navigation.state.params.propertyData.propertyId.imagePath ? navigation.state.params.propertyData.propertyId.imagePath : '',
      heading: navigation.state.params && navigation.state.params.headingName ? navigation.state.params.headingName : '',
      shift: new Animated.Value(0),
      errorMessage: '',
      disableButton: false,
      amenitiesList: [],
      servicesList: [],
      guestRulesList: [],
      text: '',
      refreshing: false,
    }


  }
  componentWillMount() {
    const navigation = this.props.navigation;
    const amenitiesData = navigation.state.params.amenitiesData;
    const servicesData = navigation.state.params.servicesData;
    const guestRulesData = navigation.state.params.guestRulesData;
    switch (this.state.heading) {
      case 'Amenities': this.setState({ amenitiesList: amenitiesData });
        break;

      case 'Services': this.setState({ servicesList: servicesData });
        break;

      case 'Guest Rules': this.setState({ guestRulesList: guestRulesData });
        break;

    }
  }

  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    const propertyData = navigation.state.params.propertyData;
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft} >
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()} >
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
              </TouchableHighlight>
            </View>
            <View style={styles.headerBody}>
              <Text style={styles.headerTitleStyle}>{this.state.heading}  {i18n.t('lanTitleList')}</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.businessNameView} >
          <Card style={styles.cardBusiness}>
            <CardItem style={styles.cardItemBusinessStyle}>
              <Left style={[styles.leftImageView, styles.listItemView]}>
                <View style={styles.imageBusinessBox} >
                  <Image source={this.state.propertyImage ? { uri: PUBLIC_DOMAIN + this.state.propertyImage } : require('../../../assets/dummy_property.jpg')} style={styles.imgBusinessStyle} />
                </View>
                <Body>
                  <View style={styles.floatingInputBusinessView} >
                    <Text style={styles.propertyTitle}> {propertyData && propertyData.propertyId.name ? propertyData.propertyId.name : ''} </Text>
                    <Text style={styles.titleLocationType}> {propertyData.propertyId && propertyData.propertyId.spLocationObj.area ? propertyData.propertyId.spLocationObj.area : ''} </Text>
                    <Text style={styles.titleType}> {this.state.propertyType} - {this.state.heading} </Text>
                  </View>
                </Body>
              </Left>
            </CardItem>
          </Card>
        </View>
        <ScrollView >
          {
            this.state.amenitiesList.length > 0 ?
              this.state.amenitiesList.map((data, i) => {
                return (
                  <TouchableOpacity key={i} >
                    <View style={styles.content}>
                      <View style={styles.list}>
                        <View style={styles.LeftView}>
                          <Image source={(data && data.amenityIconPath) ? { uri: PUBLIC_DOMAIN + data.amenityIconPath } : require('../../../assets/icon11.png')} style={styles.images} />
                        </View>
                        <View style={styles.CenterView}>
                          <Text style={styles.textMedium}>{data.amenityName}</Text>
                          <View style={styles.aminityCharge}>
                            {
                              data.amenityType == 'Free'
                                ?
                                <Text style={[styles.textSmall, styles.textColor]}>{i18n.t('lanLabelFree')}</Text>
                                :
                                <Text style={[styles.textSmall, styles.textColor]}>{'\u20B9'} {data.amenityCharge}</Text>
                            }
                          </View>
                        </View>
                        <View style={styles.RightView}>
                          <Switch value={data.amenityStatus == 'Available' ? true : false} />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })
              :
              (this.state.servicesList && this.state.servicesList.length > 0) ?
                this.state.servicesList.map((data, i) => {
                  return (
                    <TouchableOpacity key={i} >
                      <View style={styles.content}>
                        <View style={styles.list}>
                          <View style={styles.LeftView}>
                            <Image source={(data && data.serviceIconPath) ? { uri: PUBLIC_DOMAIN + data.serviceIconPath } : require('../../../assets/icon11.png')} style={styles.images} />
                          </View>
                          <View style={styles.CenterView}>
                            <Text style={styles.textMedium}>{data.serviceName}</Text>
                            <View style={styles.aminityCharge}>
                              <Text style={[styles.textSmall, styles.textColor]}>{data.serviceType}</Text>
                              <Text style={[styles.textSmall, styles.textColor]}>{'\u20B9'} {data.serviceCharge}</Text>
                            </View>
                          </View>
                          <View style={styles.RightView}>
                            <Switch
                              value={data.serviceStatus == 'Available' ? true : false}
                            />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
                : (this.state.guestRulesList && this.state.guestRulesList.length > 0) ?
                  this.state.guestRulesList.map((data, i) => {
                    return (
                      <TouchableOpacity key={i}>
                        <View style={styles.content} >
                          <View style={styles.list}>
                            <View style={styles.LeftView}>
                              <Image source={(data && data.ruleIconPath) ? { uri: PUBLIC_DOMAIN + data.ruleIconPath } : require('../../../assets/icon8.png')} style={styles.images} />
                            </View>
                            <View style={styles.CenterView}>
                              <Text style={styles.textMedium}>{data.ruleName}</Text>
                              <View style={styles.aminityCharge}>
                                <Text style={[styles.serviceType, styles.textColor]}>{data.ruleStatus == 'Active' ? 'Allowed' : 'Not Allowed'}</Text>
                              </View>
                            </View>
                            <View style={styles.RightView}>
                              <Switch
                                value={data.ruleStatus == 'Active' ? true : false} />
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }) : <Text>{i18n.t('lanLabelNoData')}</Text>
          }
        { (this.state.guestRulesList && this.state.guestRulesList.length > 0) || (this.state.servicesList && this.state.servicesList.length > 0) ||
            (this.state.amenitiesList && this.state.amenitiesList.length > 0) ? 
            <View style={styles.btnModal} >
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
              <AwesomeButton block success
                onPress={() => navigation.goBack()}
                width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent'
                backgroundShadow='transparent' backgroundDarker='transparent'
                paddingHorizontal={50} borderRadius={22}
              >
                <Text style={styles.BtnText}> {i18n.t('lanButtonDone')} </Text>
              </AwesomeButton>
            </LinearGradient>
          </View> : null
        }
         
        </ScrollView>
      </View>
    );
  }
}


