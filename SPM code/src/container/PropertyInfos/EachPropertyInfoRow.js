import React from 'react'
import { View, Text, Icon, Button } from 'native-base';
import ToggleSwitch from 'toggle-switch-react-native';
import Modal from 'react-native-modal';

import { TouchableOpacity, Image, Dimensions } from 'react-native';
import styles from './css/PropertyInfoListCss';
import { PUBLIC_DOMAIN } from '../../../constants';
import { inject, observer } from 'mobx-react';
import i18n from 'i18n-js';
import Toast, { DURATION } from 'react-native-easy-toast';

@inject(['PropertyStore'])
@observer

export default class EachPropertyInfoRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
      isModalVisible: false,
      status: '',
      propertyAction: '',
      propertyInfosList:this.props.propertyInfosList
    }
    this.handlePropertyView = this.handlePropertyView.bind(this);
    this.handleStatus = this.handleStatus.bind(this);
  }
  componentWillMount () {
    this.setState({propertyAction: this.props.propertyAction})
  }
  handlePropertyView (data) {
    const PropertyStore = this.props.PropertyStore;
      let checkMinBase1 = this.state.propertyInfosList.find(data1 => data1.pricing.minBasePriceUnit === '6 Hours' && data1.pricing.isDefaultMinBasePrice && data1._id !== data._id)
      if (checkMinBase1) {
        data.checkBillingType = false
      } else {
        data.checkBillingType = true
      }
    const navigation = this.props.navigation;
    data.propertyAction = this.state.propertyAction;
    PropertyStore.InfoPricing = data.pricing;
    navigation.navigate('PropertyInfoView', {data: data , propertyID: this.props.navigation.state.params.propertyID});
  }
  handleToggle = (isOn, data) => {
    let status = isOn ? 'Active': 'Inactive';
    this.setState({ isModalVisible: true, status: status });
    // data.status = isOn ? true : false;
  }
  handleStatus (data, status) {
    this.setState({ isModalVisible: false });
    const PropertyStore = this.props.PropertyStore;
      PropertyStore.spPropertyInfoStatusChange(data._id, status, function(resObj) {
        if(resObj.statusCode == '1015') {
          // alert(i18n.t('lanErrorYouCanNotInactiveTheProperty'));
          this.refs.toast.show(i18n.t('lanErrorYouCanNotInactiveTheProperty'));
        }
     });
  }
  render() {
    const data = this.props.data;
    return (
      <View>
        <TouchableOpacity onPress={()=> this.handlePropertyView(data)} >
          <View style={styles.viewTwo} >
            <View style={[styles.eachViewTwoIcon, styles.eachViewPropertyIconBg]} >
              <View style={ styles.leftPropertyImage }>
                <Image source={data.propertyId && data.propertyId.imagePath ? { uri: PUBLIC_DOMAIN + data.propertyId.imagePath } : require('../../../assets/check-list.png')} style={styles.imgStyle} />
              </View>
            </View>
            <View style={styles.eachViewTwoBody} >
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.tabTitleOne}>{data.propertyTitle} </Text>
                <View style={ styles.eachPropertyMainView } >
                  <Text style={styles.tabTitle}> {data.spLocationObj.area} </Text>
                 {data.rating ? <View><Text style={styles.tabTitle}>  {data.rating} <Icon name='md-star' style={styles.starIcon} /> </Text>
                  {/* <Text ></Text> */}
                  </View> : null }
                </View>
                <View style={ styles.eachPropertyMainView } >
                  <Text style={styles.tabTitleLabel}> {i18n.t('lanLabelNoOfActiveRooms')} </Text>
                  <Text style={styles.tabTitleValue}> {data.activeRoomsCount} </Text> 
                </View>
                <View style={ styles.eachPropertyMainView } >
                  <Text style={styles.tabTitleLabel}>  {i18n.t('lanLabelNoOfOnHoldRooms')} </Text>
                  <Text style={styles.tabTitleValue}> {data.onHoldRoomsCount} </Text> 
                </View>
                <View style={ styles.eachPropertyMainView } >
                  <Text style={[styles.tabTitleLabel, styles.topGapTwo ]}> {i18n.t('lanLabelTotalRooms')}: </Text>
                  <Text style={[styles.tabTitleValue, styles.topGapTwo ]}> {data.roomsCount} </Text> 
                </View>
                <View style={ styles.eachPropertyMainView } >
                  <Text style={[styles.tabTitleLabel, styles.topGap ]}> {i18n.t('lanLabelPrice')} </Text>
                  <Text style={[styles.tabTitleValue, styles.topGap ]}> {'\u20B9'} {data.pricing.basePrice} / <Text style={{fontSize:10, fontFamily:'Roboto_light', color: '#2e2a2f'}}>{data.pricing.billingType}</Text> </Text> 
                </View>
              <View style={[ styles.eachPropertyMainView, styles.aminitiesTopGap ]} >
                <View style={ styles.eachPropertyDetail} >
                  <View style={styles.imageBox } >
                    <Image source={require('../../../assets/check-list.png')} style={ styles.imageStyle } />
                  </View>
                  <Text style={ styles.propertyTxt }>{data.propertyType}</Text>
                </View>
                <View style={ styles.eachPropertyDetail} >
                  <View style={styles.imageBox } >
                    <Image source={require('../../../assets/family-room.png')} style={ styles.imageStyle } />
                  </View>
                  <Text style={styles.propertyTxt}>{data.membersCapacity ? data.membersCapacity : 0} </Text>
                </View>
                <View style={ styles.eachPropertyDetail} >
                  <View style={styles.imageBox } >
                    <Image source={require('../../../assets/room.png')} style={ styles.imageStyle } />
                  </View>
                  <Text style={ styles.propertyTxt }> {data.roomType} </Text>
                </View>
              </View>
            </View>
            <View style={styles.eachViewTwoPrice}>
            <ToggleSwitch
                isOn={data.status == 'Active' ? true : this.state.toggle ? true : false}
                onColor='#5cb85c'
                offColor='#e6e6e6'
                labelStyle={{ color: 'black', fontWeight: '900', paddingVertical:5 }}
                size='small'
                onToggle={(isOn) => this.handleToggle(isOn, data)}
              />
            </View>
          </View>
        </TouchableOpacity>
        <Modal isVisible={this.state.isModalVisible}>
            <View style={ styles.modalView }>
              <View style={ styles.modalContainerStyles}>
                <View style={ styles.txtInfoViewStyle }>
                  <View style={{alignItems:'center', justifyContent:'center'}}>
                    <Text style={ styles.txtInfo }> {i18n.t('lanLabelAreYouSureYouWantTo')}</Text> 
                    <Text style={this.state.status == 'Active' ? styles.statusActiveTxt : styles.statusInactiveTxt}> {this.state.status} </Text>
                  </View>
                  {/* <Text style={[styles.txtInfo, styles.statusTxt]}></Text>*/}
                   <Text style={styles.HotelTxt}>{data.propertyTitle}</Text> 
                </View>
                <View style={ styles.btnsParentView } >
                  <View style={ styles.eachBtnView } >
                    <Button rounded success onPress={()=> this.handleStatus(data, this.state.status)}>
                      <Text style={ styles.btnTxt } > {i18n.t('lanCommonButtonYes')}</Text>
                    </Button>
                  </View>
                  <View style={ styles.eachBtnView } >
                    <Button rounded danger onPress={()=> this.setState({ isModalVisible: false })}>
                      <Text style={ styles.btnTxt }> {i18n.t('lanCommonButtonNo')} </Text>
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
          <Toast
              ref='toast'
              style={{backgroundColor:'red', width: '100%', borderRadius:0,padding: 10, }}
              position='bottom'
              positionValue={120}
              fadeInDuration={750}
              fadeOutDuration={1000}
              // opacity={0.8}
              borderRadius={0}
              textStyle={{color:'white', fontFamily: 'Roboto_medium', }}
            />
      </View>
    )
  }
}