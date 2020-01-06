import React from 'react';
import { Platform, ScrollView, Dimensions, StatusBar, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Button, Icon, View, Text, Left, Right, Body, Card, CardItem } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './css/AddPriceViewCss';
import { inject, observer } from 'mobx-react';
import AwesomeButton from "react-native-really-awesome-button";
import { PUBLIC_DOMAIN } from '../../../constants';
import Collapsible from 'react-native-collapsible';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['PropertyStore'])
@observer
export default class AddPriceViewScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      header: null,
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      collapsed2: false,
      collapsed3: true,
    };
  }

  toggleExpanded = () => {
    //Toggling the state of single Collapsible
    this.setState({ collapsed: !this.state.collapsed, collapsed2: true, collapsed3: true });
  };

  toggleExpanded2 = () => {
    //Toggling the state of single Collapsible
    this.setState({ collapsed2: !this.state.collapsed2, collapsed: true, collapsed3: true });
  };

  toggleExpanded3 = () => {
    //Toggling the state of single Collapsible
    this.setState({ collapsed3: !this.state.collapsed3, collapsed: true, collapsed2: true });
  };


  render() {
    const navigation = this.props.navigation;
    let data = navigation.state.params && navigation.state.params.propertyPrice && navigation.state.params.propertyPrice.pricing ? navigation.state.params.propertyPrice.pricing : {}
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#019fa0', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.headerStyle}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft}>
              <View>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()}>
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
                </TouchableHighlight>
              </View>
            </View>
            <View style={styles.headerBody}>
              <View>
                <Text style={styles.headerTitleStyle}>{i18n.t('lanTitlePriceDetails')} </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.bodyStyle} >
          <View style={styles.businessNameView} >
            <Card style={styles.cardBusiness}>
              <CardItem style={styles.cardItemBusinessStyle}>
                <Left style={[styles.leftImageView, styles.listItemView]}>
                  <View style={styles.imageBox} >
                    <Image source={navigation.state.params && navigation.state.params.propertyPrice.propertyImage ? { uri: PUBLIC_DOMAIN + navigation.state.params.propertyPrice.propertyImage } : require('../../../assets/dummy_property.jpg')} style={styles.imgStyle} />
                  </View>
                  <Body>
                    <View style={styles.businessNamesView} >
                      <Text style={styles.propertyTitle}> {navigation.state.params.propertyPrice.propertyTitle} </Text>
                      <Text style={styles.titleLocationType}> {navigation.state.params.propertyPrice.propertyArea} </Text>
                      <Text style={styles.titleType}> {navigation.state.params.propertyPrice.propertyType} - {i18n.t('lanTitlePriceDetails')}  </Text>
                    </View>
                  </Body>
                </Left>
              </CardItem>
            </Card>
          </View>
          <View style={styles.contents} >
            <ScrollView>

              <View style={styles.collapse2}>
                <ScrollView>
                  {/*Code for Single Collapsible Start 2*/}
                  <TouchableOpacity onPress={this.toggleExpanded2}>
                    <View style={styles.collapseHeader}>
                      <Text style={styles.collapseHeaderText}>{i18n.t('lanLabelWeekDayPrice')} </Text>
                      <View style={{ position: 'absolute', right: 7, top: 6, }}>
                        {
                          !this.state.collapsed2 ? <Icon name='remove' style={{ fontSize: 24 }} /> : <Icon name='add' style={{ fontSize: 24 }} />
                        }
                      </View>
                      {/*Heading of Single Collapsible*/}
                    </View>
                  </TouchableOpacity>
                  {/*Content of Single Collapsible 2*/}
                  <Collapsible collapsed={this.state.collapsed2} align="center">
                    <View style={styles.content}>
                      <View style={styles.card}>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelWeekdayBasePrice')}</Text>
                            <Text style={styles.textmedium}>{data && data.basePrice ? data.basePrice : ''} </Text>
                          </Left>
                          <Right>
                            <View>
                              <Text style={[styles.textSmall, styles.rightData]}>{i18n.t('lanLabelDiscount')}</Text>
                              <Text style={[styles.textmedium, styles.rightData]}>{data && data.basePrice ? Math.ceil(parseInt(data.basePrice) / 100 * data.basePriceDiscount) : 0} </Text>
                            </View>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelCgstPercentage')}</Text>
                            <Text style={styles.textmedium}>{data && data.basePrice ? Math.ceil(Math.ceil(data.basePrice - parseInt(data.basePrice / 100 * data.basePriceDiscount)) / 100 * parseInt(data.cgstPercentage)) : 0} </Text>
                          </Left>
                          <Right>
                            <View>
                              <Text style={[styles.textSmall, styles.rightData]}>{i18n.t('lanLabelSgstPercentage')}</Text>
                              <Text style={[styles.textmedium, styles.rightData]}>{data && data.basePrice ? Math.ceil(data.basePrice - Math.ceil(parseInt(data.basePrice) / 100 * data.basePriceDiscount)) / 100 * parseInt(data.sgstPercentage) : 0} </Text>
                            </View>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelSPAmount')}</Text>
                            <Text style={styles.textmedium}>{data && data.spAmount ? data.spAmount : 0} </Text>
                          </Left>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelWeekdayMinBasePrice1')}</Text>
                            <Text style={styles.textmedium}>{data && data.minBasePrice ? data.minBasePrice : 0} </Text>
                          </Left>
                          <Right>
                            <View>
                              <Text style={[styles.textSmall, styles.rightData]}>{i18n.t('lanLabelDiscount')}</Text>
                              <Text style={[styles.textmedium, styles.rightData]}>{data && data.minBasePrice ? Math.ceil(parseInt(data.minBasePrice) / 100 * data.basePriceDiscount) : 0} </Text>
                            </View>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelCgstPercentage')}</Text>
                            <Text style={styles.textmedium}>{data && data.minBasePrice ? Math.ceil(Math.ceil(data.minBasePrice - parseInt(data.minBasePrice / 100 * data.basePriceDiscount)) / 100 * parseInt(data.cgstPercentage)) : 0} </Text>
                          </Left>
                          <Right>
                            <View>
                              <Text style={[styles.textSmall, styles.rightData]}>{i18n.t('lanLabelSgstPercentage')}</Text>
                              <Text style={[styles.textmedium, styles.rightData]}>{data && data.minBasePrice ? Math.ceil(Math.ceil(data.minBasePrice - parseInt(data.minBasePrice) / 100 * data.basePriceDiscount) / 100 * parseInt(data.sgstPercentage)) : 0} </Text>
                            </View>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelSPAmount')}</Text>
                            <Text style={styles.textmedium}>{data && data.minBaseSpAmount ? data.minBaseSpAmount : 0} </Text>
                          </Left>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelWeekdayMinBasePrice2')}</Text>
                            <Text style={styles.textmedium}>{data && data.minBasePrice2 ? data.minBasePrice2 : 0} </Text>
                          </Left>
                          <Right>
                            <View>
                              <Text style={[styles.textSmall, styles.rightData]}>{i18n.t('lanLabelDiscount')}</Text>
                              <Text style={[styles.textmedium, styles.rightData]}>{data && data.minBasePrice2 ? Math.ceil(parseInt(data.minBasePrice2) / 100 * data.basePriceDiscount) : 0} </Text>
                            </View>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelCgstPercentage')}</Text>
                            <Text style={styles.textmedium}>{data && data.minBasePrice ? Math.ceil(Math.ceil(data.minBasePrice2 - parseInt(data.minBasePrice2) / 100 * data.basePriceDiscount) / 100 * parseInt(data.cgstPercentage)) : 0} </Text>
                          </Left>
                          <Right>
                            <View>
                              <Text style={[styles.textSmall, styles.rightData]}>{i18n.t('lanLabelSgstPercentage')}</Text>
                              <Text style={[styles.textmedium, styles.rightData]}>{data && data.minBasePrice2 ? Math.ceil(Math.ceil(data.minBasePrice2 - parseInt(data.minBasePrice2) / 100 * data.basePriceDiscount) / 100 * parseInt(data.sgstPercentage)) : 0} </Text>
                            </View>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelSPAmount')}</Text>
                            <Text style={styles.textmedium}>{data && data.minBaseSpAmount2 ? data.minBaseSpAmount2 : 0} </Text>
                          </Left>
                        </View>
                      </View>
                    </View>
                  </Collapsible>
                </ScrollView>
              </View>

              <View style={styles.collapse3}>
                <ScrollView>
                  {/*Code for Single Collapsible Start 3*/}
                  <TouchableOpacity onPress={this.toggleExpanded3}>
                    <View style={styles.collapseHeader}>
                      <Text style={styles.collapseHeaderText}>{i18n.t('lanLabelWeekEndPrice')}</Text>
                      <View style={{ position: 'absolute', right: 7, top: 6, }}>
                        {
                          !this.state.collapsed3 ? <Icon name='remove' style={{ fontSize: 24 }} /> : <Icon name='add' style={{ fontSize: 24 }} />
                        }
                      </View>
                      {/*Heading of Single Collapsible*/}
                    </View>
                  </TouchableOpacity>
                  {/*Content of Single Collapsible 3*/}
                  <Collapsible collapsed={this.state.collapsed3} align="center">
                    <View style={styles.content}>
                      <View style={styles.card}>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelWeekendBasePrice')}</Text>
                            <Text style={styles.textmedium}>{data && data.weekEndBasePrice ? data.weekEndBasePrice : 0} </Text>
                          </Left>
                          <Right>
                            <View>
                              <Text style={[styles.textSmall, styles.rightData]}>{i18n.t('lanLabelDiscount')}</Text>
                              <Text style={[styles.textmedium, styles.rightData]}>{data && data.weekEndBasePrice ? Math.ceil(parseInt(data.weekEndBasePrice) / 100 * data.weekEndBasePriceDiscount) : 0} </Text>
                            </View>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelCgstPercentage')}</Text>
                            <Text style={styles.textmedium}>{data && data.weekEndBasePrice ? Math.ceil(Math.ceil(data.weekEndBasePrice - parseInt(data.weekEndBasePrice / 100 * data.basePriceDiscount)) / 100 * parseInt(data.cgstPercentage)) : 0} </Text>
                          </Left>
                          <Right>
                            <View>
                              <Text style={[styles.textSmall, styles.rightData]}>{i18n.t('lanLabelSgstPercentage')}</Text>
                              <Text style={[styles.textmedium, styles.rightData]}>{data && data.refundCancelTime ? Math.ceil((data.weekEndBasePrice - (data.weekEndBasePrice / 100 * data.weekEndBasePriceDiscount)) / 100 * (data.sgstPercentage)) : 0} </Text>
                            </View>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelSPAmount')}</Text>
                            <Text style={styles.textmedium}>{data && data.weekEndSpAmount ? data.weekEndSpAmount : 0} </Text>
                          </Left>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelWeekendMinBasePrice1')}</Text>
                            <Text style={styles.textmedium}>{data && data.weekEndMinBasePrice ? data.weekEndMinBasePrice : 0} </Text>
                          </Left>
                          <Right>
                            <View>
                              <Text style={[styles.textSmall, styles.rightData]}>{i18n.t('lanLabelDiscount')}</Text>
                              <Text style={[styles.textmedium, styles.rightData]}>{data && data.weekEndMinBasePrice ? Math.ceil(parseInt(data.weekEndMinBasePrice) / 100 * data.weekEndBasePriceDiscount) : 0} </Text>
                            </View>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelCgstPercentage')}</Text>
                            <Text style={styles.textmedium}>{data && data.weekEndMinBasePrice ? Math.ceil(Math.ceil(data.minBasePrice - parseInt(data.minBasePrice / 100 * data.basePriceDiscount)) / 100 * parseInt(data.cgstPercentage)) : 0} </Text>
                          </Left>
                          <Right>
                            <View>
                              <Text style={[styles.textSmall, styles.rightData]}>{i18n.t('lanLabelSgstPercentage')}</Text>
                              <Text style={[styles.textmedium, styles.rightData]}>{data && data.refundCancelTime ? Math.ceil((data.weekEndMinBasePrice - (data.weekEndMinBasePrice / 100 * data.weekEndBasePriceDiscount)) / 100 * (data.sgstPercentage)) : 0} </Text>
                            </View>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelSPAmount')}</Text>
                            <Text style={styles.textmedium}>{data && data.weekEndMinBaseSpAmount ? data.weekEndMinBaseSpAmount : 0} </Text>
                          </Left>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelWeekendMinBasePrice2')}</Text>
                            <Text style={styles.textmedium}>{data && data.weekEndMinBasePrice2 ? data.weekEndMinBasePrice2 : 0} </Text>
                          </Left>
                          <Right>
                            <View>
                              <Text style={[styles.textSmall, styles.rightData]}>{i18n.t('lanLabelDiscount')}</Text>
                              <Text style={[styles.textmedium, styles.rightData]}>{data && data.weekEndMinBasePrice2 ? Math.ceil(parseInt(data.weekEndMinBasePrice2) / 100 * data.weekEndBasePriceDiscount) : 0} </Text>
                            </View>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelCgstPercentage')}</Text>
                            <Text style={styles.textmedium}>{data && data.minBasePrice2 ? Math.ceil(Math.ceil(data.minBasePrice2 - parseInt(data.minBasePrice2 / 100 * parseInt(data.basePriceDiscount))) / 100 * parseInt(data.cgstPercentage)) : 0} </Text>
                          </Left>
                          <Right>
                            <View>
                              <Text style={[styles.textSmall, styles.rightData]}>{i18n.t('lanLabelSgstPercentage')}</Text>
                              <Text style={[styles.textmedium, styles.rightData]}>{data && data.refundCancelTime ? Math.ceil((data.weekEndMinBasePrice2 - (data.weekEndMinBasePrice2 / 100 * data.weekEndBasePriceDiscount)) / 100 * (data.sgstPercentage)) : 0} </Text>
                            </View>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelSPAmount')}</Text>
                            <Text style={styles.textmedium}>{data && data.weekEndMinBaseSpAmount2 ? data.weekEndMinBaseSpAmount2 : 0} </Text>
                          </Left>
                        </View>
                      </View>
                    </View>
                  </Collapsible>
                </ScrollView>
              </View>
              <View style={styles.collapse1}>
                <ScrollView>
                  {/*Code for Single Collapsible Start 1*/}
                  <TouchableOpacity onPress={this.toggleExpanded}>
                    <View style={styles.collapseHeader}>
                      <Text style={styles.collapseHeaderText}>{i18n.t('lanButtonPriceDetails')}</Text>
                      <View style={{ position: 'absolute', right: 7, top: 6, }}>
                        {
                          !this.state.collapsed ? <Icon name='remove' style={{ fontSize: 24 }} /> : <Icon name='add' style={{ fontSize: 24 }} />
                        }
                      </View>
                      {/*Heading of Single Collapsible*/}
                    </View>
                  </TouchableOpacity>
                  {/*Content of Single Collapsible 1*/}
                  <Collapsible collapsed={this.state.collapsed} align="center">
                    <View style={styles.content}>
                      <View style={styles.card}>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelCheckInCredentials')} </Text>
                            <Text style={styles.textmedium}>{data && data.checkInCredentials ? data.checkInCredentials : 0} </Text>
                          </Left>
                          <Right>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelCheckInTime')} </Text>
                            <Text style={styles.textmedium}>{data && data.checkInTime ? data.checkInTime : 0} </Text>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelCheckOutTime')} </Text>
                            <Text style={styles.textmedium}>{data && data.checkOutTime ? data.checkOutTime : 0} </Text>
                          </Left>
                          <Right>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelCurrency')} </Text>
                            <Text style={styles.textmedium}> {data && data.currency && data.currency == 'INR' ? 'INR - Indian Rupee(₹)' : 'USD - US Dollar($)'} </Text>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelFullRefundCancelTime')} </Text>
                            <Text style={styles.textmedium}>{data && data.fullRefundCancelTime ? data.fullRefundCancelTime : ''} </Text>
                          </Left>
                          <Right>
                            <View>
                              <Text style={[styles.textSmall, styles.rightData]}>{i18n.t('lanLabelRefundCancelTime')}</Text>
                              <Text style={[styles.textmedium, styles.rightData]}>{data && data.refundCancelTime ? data.refundCancelTime : ''} </Text>
                            </View>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelRefundCancelPercentage')}</Text>
                            <Text style={styles.textmedium}> {data && data.refundCancelPercentage ? data.refundCancelPercentage : ''} </Text>
                          </Left>
                          <Right>
                            <View>
                              <Text style={[styles.textSmall, styles.rightData]}>{i18n.t('lanLabelServiceCharges')}</Text>
                              <Text style={[styles.textmedium, styles.rightData]}>{data && data.serviceCharges ? data.serviceCharges : 0}</Text>
                            </View>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelOtherCharges')}</Text>
                            <Text style={styles.textmedium}>{data && data.otherCharges ? data.otherCharges : 0} </Text>
                          </Left>
                          <Right>
                            <View>
                              <Text style={[styles.textSmall, styles.rightData]}>{i18n.t('lanLabelCgstPercentage')}</Text>
                              <Text style={[styles.textmedium, styles.rightData]}>{data && data.cgstPercentage ? data.cgstPercentage : 0} </Text>
                            </View>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelSgstPercentage')}</Text>
                            <Text style={styles.textmedium}>{data && data.sgstPercentage ? data.sgstPercentage : 0} </Text>
                          </Left>
                          <Right>
                            <View>
                              <Text style={[styles.textSmall, styles.rightData]}>{i18n.t('lanLabelWeekDayDiscountPercentage')}</Text>
                              <Text style={[styles.textmedium, styles.rightData]}>{data && data.basePriceDiscount ? data.basePriceDiscount : 0} </Text>
                            </View>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelWeekEndDiscountPercentage')}</Text>
                            <Text style={styles.textmedium}>{data && data.weekEndBasePriceDiscount ? data.weekEndBasePriceDiscount : 0} </Text>
                          </Left>
                          <Right>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelBillingType')} </Text>
                            <Text style={styles.textmedium}>{data && data.billingType ? data.billingType : ''} </Text>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={[styles.textSmall, styles.rightData]}>{i18n.t('lanLabelMinBillingType')} </Text>
                            <Text style={[styles.textmedium, styles.rightData]}>{data && data.minBasePriceUnit ? data.minBasePriceUnit : 0} </Text>
                          </Left>
                          <Right>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelBaseDefaultPriority')}</Text>
                            <Text style={styles.textmedium}>{data && data.isDefaultBasePrice ? data.isDefaultBasePrice === true ? 'true' : 'false' : 'false'} </Text>
                          </Right>
                        </View>
                        <View style={styles.cardItem}>
                          <Left>
                            <Text style={styles.textSmall}>{i18n.t('lanLabelMinBaseDefaultPriority')}</Text>
                            <Text style={styles.textmedium}>{data && data.isDefaultMinBasePrice ? data.isDefaultMinBasePrice === true ? 'true' : 'false' : 'false'} </Text>
                          </Left>
                          <Right>
                            <View>
                              <Text style={[styles.textSmall, styles.rightData]}>{i18n.t('lanLabelAllowMidNightCheckOut')}</Text>
                              <Text style={[styles.textmedium, styles.rightData]}>{data && data.isMidnightCheckOutAllowed ? data.isMidnightCheckOutAllowed === true ? 'true' : 'false' : 'false'} </Text>
                            </View>
                          </Right>
                        </View>
                      </View>
                    </View>
                  </Collapsible>
                </ScrollView>
              </View>
              <View style={styles.btnModal} >
                <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                  <AwesomeButton block success
                    onPress={() => navigation.goBack()}
                    width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} marginTop={20} >
                    <Text style={styles.BtnText}> {i18n.t('lanButtonDone')} </Text>
                  </AwesomeButton>
                </LinearGradient>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}
