import React from 'react'
import { View, Text, Icon, Button } from 'native-base';
import ToggleSwitch from 'toggle-switch-react-native';
import { TouchableOpacity, Image, Dimensions, AsyncStorage,ActivityIndicator} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';
import i18n from 'i18n-js';

import styles from './css/PropertiesListCss';
import { PUBLIC_DOMAIN } from '../../../constants';
import { inject, observer } from 'mobx-react';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['PropertyStore'])
@observer
export default class EachPropertyRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
      isModalVisible: false,
      status: '',
      reload: false,
      reloadFunction: '',
      loading: false,
      statusCode: ''
    }
    this.handleStatus = this.handleStatus.bind(this);
  }
  handleToggle = (isOn) => {
    let status = isOn ? 'Active': 'Inactive';
    this.setState({ isModalVisible: true, status: status, statusCode: '' });
  }
  handleStatus (data, status) {
    this.setState({  loading: true });
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true});
    }, 10000);
    PropertyStore.spPropertyStatusChange(data._id, status, function(resObj) {
      if(resObj.statusCode == '0000') {
        PropertyStore.getSpProperties('1', '', function(resObj) {
          clearTimeout(isLoading)
          _this.setState({ loading: false, isModalVisible: false })
        });
      } else if(resObj.statusCode == '1016') {
        clearTimeout(isLoading)
          _this.setState({ loading: false, statusCode: '1016' })
      } else {
        clearTimeout(isLoading)
        _this.setState({ loading: false, isModalVisible: false })
      }
    });
  }
  handlePropertyView (data) {
    AsyncStorage.setItem('propertyID' , data._id)
    const navigation = this.props.navigation;
    navigation.navigate('PropertyView', {data: data});
  }
  render() {
    const data = this.props.data;
    return (
      <View>
        <TouchableOpacity onPress={()=> this.handlePropertyView(data)} >
          <View style={styles.viewTwo} >
            <View style={[styles.eachViewTwoIcon, styles.eachViewPropertyIconBg]} >
              <View style={ styles.leftPropertyImage }>
                <Image source={data.imagePath ? { uri: PUBLIC_DOMAIN + data.imagePath } : require('../../../assets/check-list.png')} style={styles.imgStyle} />
              </View>
            </View>         
            <View style={styles.eachViewTwoBody} >
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.tabTitleOne}>{data.propertyTitle} </Text>
              <View style={{ paddingTop:0}} >
              <View style={ styles.eachPropertyMainView } >
                <Text style={styles.tabTitle}> {data.spLocationObj.area} </Text>
                {data && data.rating ? 
                  <View>
                    <Text style={styles.tabTitle}> {data.rating}<Icon name='md-star' style={styles.starIcon} /> </Text>
                    {/* <Text style={{paddingTop:5}}></Text> */}
                  </View> 
                : null}
              </View>
              </View>
              <View style={ styles.aminitiesTopGap } >
              <View style={ styles.eachPropertyMainView } >
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
                  <Text style={ styles.propertyTxt } >{data.propertyCapacity ? data.propertyCapacity : 0}</Text>
                </View>
                <View style={ styles.eachPropertyDetail} >
                  <View style={styles.imageBox } >
                    <Image source={require('../../../assets/room.png')} style={ styles.imageStyle } />
                  </View>
                  <Text style={ styles.propertyTxt }> {data.numRooms ? data.numRooms : 0} </Text>
                </View>
                <View style={ styles.eachPropertyDetail} >
                  <View style={styles.imageBox } >
                    <Image source={require('../../../assets/single-bed.png')} style={ styles.imageStyle } />
                  </View>
                  <Text style={ styles.propertyTxt } > {data.singleBedsCount ? data.singleBedsCount : 0}</Text>
                </View>
                <View style={ styles.eachPropertyDetail} >
                  <View style={styles.imageBox } >
                    <Image source={require('../../../assets/bed.png')} style={ styles.imageStyle } />
                  </View>
                  <Text style={ styles.propertyTxt } > {data.doubleBedsCount ? data.doubleBedsCount : 0}</Text>
                </View>
                <View style={ styles.eachPropertyDetail} >
                  <View style={styles.imageBox } >
                    <Image source={require('../../../assets/bathtub.png')} style={ styles.imageStyle } />
                  </View>
                  <Text style={ styles.propertyTxt }> {data.privateBathRooms ? data.privateBathRooms : 0} </Text>
                </View>
              </View>
              </View>
            </View>
            {this.state.loading
            ? <View ><ActivityIndicator  size='large'  /></View>
            : null}
            <View style={styles.eachViewTwoPrice} >
              {/* <View style={styles.ratingContainer}>
                <View style={styles.ratingBox} >
                    <View style={styles.ratingContent} >
                      <Text style={styles.ratingTxt}> {data.rating} </Text>
                      <Text><Icon name='md-star' style={styles.starIcon} /></Text>
                    </View>
                </View>
              </View> */}
              <ToggleSwitch
                isOn={data.status == 'Active' ? true : this.state.isToggle ? true : false}
                onColor='#5cb85c'
                offColor='gray'
                labelStyle={{ color: 'black', fontWeight: '900', paddingVertical:5 }}
                size='small'
                onToggle={(isOn) => this.handleToggle(isOn, data)}
              />
            </View>
          </View>
        </TouchableOpacity>
        <Modal isVisible={this.state.isModalVisible}>
          {this.state.statusCode !== '1016'
          ? <View style={ styles.modalView }>
              <View style={ styles.modalContainerStyles}>
                <View style={ styles.txtInfoViewStyle }>
                  <View style={{alignItems:'center', justifyContent:'center'}}>
                    <Text style={ styles.txtInfo }> {i18n.t('lanLabelAreYouSureYouWantTo')}</Text> 
                    <Text style={this.state.status == 'Active' ? styles.statusActiveTxt : styles.statusInactiveTxt}> {this.state.status}</Text>
                  </View>
                  {/* <Text style={[styles.txtInfo, styles.statusTxt]}></Text>*/}
                   <Text style={styles.HotelTxt}>{data.propertyTitle}</Text> 
                </View>
                <View style={ styles.btnsParentView } >
                  <View style={ styles.eachBtnView } >
                    <Button rounded success onPress={()=> this.handleStatus(data, this.state.status)}>
                      <Text style={ styles.btnTxt } > {i18n.t('lanButtonYes')} </Text>
                    </Button>
                  </View>
                  <View style={ styles.eachBtnView } >
                    <Button rounded danger onPress={()=> this.setState({ isModalVisible: false })}>
                      <Text style={ styles.btnTxt }>{i18n.t('lanButtonNo')}</Text>
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          : <View style={ styles.modalView }>
            <View style={ styles.modalContainerStyles}>
              <View style={ styles.txtInfoViewStyle }>
                <View style={{alignItems:'center', justifyContent:'center'}} >
                  <Text style={ styles.txtInfo }> {i18n.t('lanErrorYouCanNotInactiveTheProperty')}</Text>
                </View>
              </View>
              <View style={ styles.btnsParentView } >
                <View style={ styles.eachBtnView } >
                  <Button rounded danger onPress={()=> this.setState({ isModalVisible: false })}>
                    <Text style={ styles.btnTxt } > {i18n.t('lanCommonButtonClose')} </Text>
                  </Button>
                </View>
              </View>
            </View>
          </View>}
        </Modal>
      </View>
    )
  }
}