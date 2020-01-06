import React from 'react'
import { View, Text, Icon, Switch } from 'native-base';
import ToggleSwitch from 'toggle-switch-react-native';
import { TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './css/BookingsPropertiesListCss';
import { PUBLIC_DOMAIN } from '../../../constants';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
import i18n from 'i18n-js';

import Toast, { DURATION } from 'react-native-easy-toast';

export default class EachRowProperty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false
    }
  }

  handlePropertyView (data) {
    const navigation = this.props.navigation;
    if (data.status == 'Active') {
      navigation.navigate('BookingsPropertyInfoList', {propertyData: data});
    } else {
      this.refs.toast.show(i18n.t('lanErrorPropertyInActiveCreateBooking'));
    }
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
                { data && data.rating ? 
                  <View>
                    <Text style={styles.tabTitle}> {data.rating} </Text>
                    <Text style={{paddingTop:5}}><Icon name='md-star' style={styles.starIcon} /></Text> 
                  </View>
                  : null
                }
                
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
                  <Text style={ styles.propertyTxt } > {data.singleBedsCount ? data.singleBedsCount : 0}</Text>
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
            <View style={styles.eachViewTwoPrice} >
              <Switch
                value={data.status == 'Active' ? true : this.state.isToggle ? true : false}
              />
            </View>
          </View>
        </TouchableOpacity>
          <Toast
            ref='toast'
            style={{ backgroundColor: '#ff0000', width: '100%', borderRadius:0, marginTop: 10, }}
            position='top'
            positionValue={0}
            fadeInDuration={50}
            fadeOutDuration={1000}
            // opacity={0.8}
            textStyle={{ color: 'white', fontFamily:'Roboto_medium', }}
          />
      </View>
    )
  }
}