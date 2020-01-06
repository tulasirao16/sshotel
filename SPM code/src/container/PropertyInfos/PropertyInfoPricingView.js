import React from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncStorage, BackHandler, Image, TouchableHighlight, StyleSheet, Platform, Dimensions, Animated, TouchableOpacity, ScrollView, Keyboard, UIManager, TextInput, KeyboardAvoidingView, RefreshControl } from 'react-native';
import { Button, Container, Header, Content, Form, Icon, View, Text, List, Switch, Left, Body, Right, ListItem, Item, Input, Label, Card, CardItem } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import i18n from 'i18n-js';

import styles from './css/PropertyInfoPricingViewCss';
import { PUBLIC_DOMAIN } from '../../../constants';

const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['UserStore'], ['PropertyStore'])
@observer
export default class PropertyInfoPricingViewScreen extends React.Component {
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
      SPPropertyInfoPricingList: [],
      refreshing: false,
    }
  }
  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    const PropertyInfoPricingData = navigation.state.params.PropertyInfoPricingData;
    PropertyStore = this.props.PropertyStore;
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft}>
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()}>
                <Icon name='arrow-back' style={{ color: '#fff', fontSize: 25, }}  />
              </TouchableHighlight>
            </View>
            <View style={styles.headerBody}>
              <Text style={styles.headerTitleStyle}>{i18n.t('lanTitlePropertyInfoPricing')}</Text>
            </View>
          </View>
        </LinearGradient>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.mainView}>
              <List>
                <ListItem style={styles.listitem}>
                  <Text style={styles.textBig}>
                    {PropertyInfoPricingData.spServiceProvider && PropertyInfoPricingData.spLocationObj.area ?
                      `${PropertyInfoPricingData.spServiceProvider}, ${PropertyInfoPricingData.spLocationObj.area}` : ''
                    }
                  </Text>
                </ListItem>
                <ListItem style={styles.listitem}>
                  <Left>
                    <Text style={styles.textLight}>{i18n.t('lanLabelMinimumBaseUnitPrice')}</Text>
                  </Left>
                  <Right>
                    <Text style={styles.textMedium}>
                      {PropertyInfoPricingData && PropertyInfoPricingData.pricing.minBasePriceUnit
                        ?
                        `${PropertyInfoPricingData.pricing.minBasePriceUnit}`
                        : ''
                      }
                    </Text>
                  </Right>
                </ListItem>
                <ListItem style={styles.listitem}>
                  <Left>
                    <Text style={styles.textLight}>{i18n.t('lanLabelMinimumBasePrice')}</Text>
                  </Left>
                  <Right>
                    <Text style={[styles.textSmall, styles.textColor]}>
                      {PropertyInfoPricingData && PropertyInfoPricingData.pricing.minBasePrice
                        ?
                        `\u20B9 ${PropertyInfoPricingData.pricing.minBasePrice}`
                        : ''
                      }
                    </Text>
                  </Right>
                </ListItem>
                <ListItem style={styles.listitem}>
                  <Left>
                    <Text style={styles.textLight}>{i18n.t('lanLabelBillingType')}</Text>
                  </Left>
                  <Right>
                    <Text style={styles.textMedium}>
                      {PropertyInfoPricingData && PropertyInfoPricingData.pricing.billingType
                        ?
                        `${PropertyInfoPricingData.pricing.billingType}`
                        : ''
                      }
                    </Text>
                  </Right>
                </ListItem>
                <ListItem style={styles.listitem}>
                  <Left>
                    <Text style={styles.textLight}>{i18n.t('lanLabelBasePrice')}</Text>
                  </Left>
                  <Right>
                    <Text style={[styles.textSmall, styles.textColor]}>
                      {PropertyInfoPricingData && PropertyInfoPricingData.pricing.basePrice
                        ?
                        `\u20B9 ${PropertyInfoPricingData.pricing.basePrice}`
                        : ''
                      }
                    </Text>
                  </Right>
                </ListItem>
                <ListItem style={styles.listitem}>
                  <Left>
                    <Text style={styles.textLight}>{i18n.t('lanLabelCurrency')}</Text>
                  </Left>
                  <Right>
                    <Text style={styles.textMedium}>
                      {PropertyInfoPricingData && PropertyInfoPricingData.pricing.currency
                        ?
                        `${PropertyInfoPricingData.pricing.currency}`
                        : ''
                      }
                    </Text>
                  </Right>
                </ListItem>
                <ListItem style={styles.listitem}>
                  <Left>
                    <Text style={styles.textLight}>{i18n.t('lanLabelOffers')}</Text>
                  </Left>
                  <Right>
                    <Text style={styles.textMedium}>
                      {PropertyInfoPricingData && PropertyInfoPricingData.pricing.offers
                        ?
                        `${PropertyInfoPricingData.pricing.offers}`
                        : ''
                      }
                    </Text>
                  </Right>
                </ListItem>
                <ListItem style={styles.listitem}>
                  <Left>
                    <Text style={styles.textLight}>{i18n.t('lanLabelDiscount')}</Text>
                  </Left>
                  <Right>
                    <Text style={styles.textMedium}>
                      {PropertyInfoPricingData && PropertyInfoPricingData.pricing.discounts
                        ?
                        `${PropertyInfoPricingData.pricing.discounts}`
                        : ''
                      }
                    </Text>
                  </Right>
                </ListItem>
                <ListItem style={styles.listitem}>
                  <Left>
                    <Text style={styles.textLight}>{i18n.t('lanLabelCheckInCredentials')}</Text>
                  </Left>
                  <Right>
                    <Text style={styles.textMedium}>
                      {PropertyInfoPricingData && PropertyInfoPricingData.pricing.checkInCredentials
                        ?
                        `${PropertyInfoPricingData.pricing.checkInCredentials}`
                        : ''
                      }
                    </Text>
                  </Right>
                </ListItem>
                <ListItem style={styles.listitem}>
                  <Left>
                    <Text style={styles.textLight}>{i18n.t('lanLabelCheckInTime')}</Text>
                  </Left>
                  <Right>
                    <Text style={styles.textMedium}>
                      {PropertyInfoPricingData && PropertyInfoPricingData.pricing.checkInTime
                        ?
                        `${PropertyInfoPricingData.pricing.checkInTime}`
                        : ''
                      }
                    </Text>
                  </Right>
                </ListItem>
                <ListItem style={styles.listitem}>
                  <Left>
                    <Text style={styles.textLight}>{i18n.t('lanLabelDefaultCheckInTime')}</Text>
                  </Left>
                  <Right>
                    <Text style={styles.textMedium}>
                      {PropertyInfoPricingData && PropertyInfoPricingData.pricing.defaultCheckInTime
                        ?
                        `${PropertyInfoPricingData.pricing.defaultCheckInTime}`
                        : ''
                      }
                    </Text>
                  </Right>
                </ListItem>
                <ListItem style={styles.listitem}>
                  <Left>
                    <Text style={styles.textLight}>{i18n.t('lanLabelCheckOutTime')}</Text>
                  </Left>
                  <Right>
                    <Text style={styles.textMedium}>
                      {PropertyInfoPricingData && PropertyInfoPricingData.pricing.checkOutTime
                        ?
                        `${PropertyInfoPricingData.pricing.checkOutTime}`
                        : ''
                      }
                    </Text>
                  </Right>
                </ListItem>
                <ListItem style={styles.listitem}>
                  <Left>
                    <Text style={styles.textLight}>{i18n.t('lanLabelDefaultCheckOutTime')}</Text>
                  </Left>
                  <Right>
                    <Text style={styles.textMedium}>
                      {PropertyInfoPricingData && PropertyInfoPricingData.pricing.defaultCheckOutTime
                        ?
                        `${PropertyInfoPricingData.pricing.defaultCheckOutTime}`
                        : ''
                      }
                    </Text>
                  </Right>
                </ListItem>
                <ListItem style={styles.listitem}>
                  <Left>
                    <Text style={styles.textLight}>{i18n.t('lanLabelFullRefundCancelTime')}</Text>
                  </Left>
                  <Right>
                    <Text style={styles.textMedium}>
                      {PropertyInfoPricingData && PropertyInfoPricingData.pricing.fullRefundCancelTime
                        ?
                        `${PropertyInfoPricingData.pricing.fullRefundCancelTime}`
                        : ''
                      }
                    </Text>
                  </Right>
                </ListItem>
                <ListItem style={styles.listitem}>
                  <Left>
                    <Text style={styles.textLight}>{i18n.t('lanLabelRefundCancelTime')}</Text>
                  </Left>
                  <Right>
                    <Text style={styles.textMedium}>
                      {PropertyInfoPricingData && PropertyInfoPricingData.pricing.refundCancelTime
                        ?
                        `${PropertyInfoPricingData.pricing.refundCancelTime}`
                        : ''
                      }
                    </Text>
                  </Right>
                </ListItem>
                <ListItem style={styles.listitem}>
                  <Left>
                    <Text style={styles.textLight}>{i18n.t('lanLabelRefundCancelPercentage')}</Text>
                  </Left>
                  <Right>
                    <Text style={styles.textMedium}>
                      {PropertyInfoPricingData && PropertyInfoPricingData.pricing.refundCancelPercentage
                        ?
                        `${PropertyInfoPricingData.pricing.refundCancelPercentage}`
                        : ''
                      }
                    </Text>
                  </Right>
                </ListItem>
              </List>
            </View>
          </View>
        </ScrollView>
        <View style={styles.btnModal} >
          <AwesomeButton block success
            onPress={() => navigation.goBack()}
            width={DEVICE_WIDTH / 3} height={44} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={22} >
            <Text style={styles.BtnText}> {i18n.t('lanButtonDone')} </Text>
          </AwesomeButton>
        </View>
      </View>
    );
  }
}


