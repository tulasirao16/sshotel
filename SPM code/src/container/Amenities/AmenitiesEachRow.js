import React from 'react';
import { ActivityIndicator, AsyncStorage, BackHandler, Dimensions, Text, View, StatusBar, ScrollView, Button, Platform, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Icon,  Switch} from 'native-base';
import { observer, inject } from 'mobx-react';
import styles from './css/AmenitiesCss';
import ToggleSwitch from 'toggle-switch-react-native';
import { PUBLIC_DOMAIN } from '../../../constants';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';

const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['UserStore'], ['PropertyStore'])
@observer
export default class AmenitiesEachRow extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: this.props.data,
      updatedAmenitiesArray: [],
    }

  }
  componentWillReceiveProps() {
    this.setState({ data: this.props.data });
  }
  editViewAmenity(i) {
    const PropertyStore = this.props.PropertyStore;
    const navigation = this.props.navigation;
    navigation.navigate('AmenitiesEditViewScreen', { AmenitiesEditViewData: PropertyStore.Amenities[i] });
  }
  handleSwitch = (data, isOn) => {
    const propertyId = this.props.propertyId;
    const propertyInfoId = this.props.propertyInfoId;
    const PropertyStore = this.props.PropertyStore;
    let modificationData = data;
    isOn == true ? modificationData.amenityStatus = 'Available' : modificationData.amenityStatus = 'Unavailable'
    let x = this.state.updatedAmenitiesArray;
    let y = PropertyStore.AvaliableAmenities;
    let amenitiesAvaliable = y.indexOf(data.amenityName);
    if(amenitiesAvaliable === -1) {
      y.push(data.amenityName)
      x.push(modificationData);
    }else {
      y.splice(amenitiesAvaliable, 1);
      x.push(modificationData);
    }
    let put_json = {
      _id: modificationData._id,
      propertyInfoId: modificationData.propertyInfoId,
      amenityStatus: modificationData.amenityStatus,
      availableAmenities: PropertyStore.AvaliableAmenities
    }
    let _this = this;
    this.setState({ loading : true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading : false });
    }, 10000);
    PropertyStore.setAmenitiesStatus(put_json, function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
      if (!PropertyStore.internet_connection) {
        _this.props.navigation.navigate('InformationScreen')
      } 
    })
  }
  render() {
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    const data = this.props.data;
    const i = this.props.i;
    const AvaliableAmenities = PropertyStore.AvaliableAmenities;
    const DummyAvaliableAmenities = PropertyStore.DummyAvaliableAmenities;
    return (
      <TouchableOpacity key={i} onPress={() => this.editViewAmenity(i)}>
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
                  <Text style={[styles.textSmall, styles.textColor]}>Free</Text>
                  :
                  <Text style={[styles.textSmall, styles.textColor]}>{'\u20B9'} {data.amenityCharge}</Text>
                }
              </View>
            </View>
            <View>
              {this.state.loading
              ? <View ><ActivityIndicator  size='large' /></View>
              : null}
            </View>
            <View style={styles.RightView}>
              <ToggleSwitch isOn={PropertyStore.AvaliableAmenities.indexOf(data.amenityName) >= 0 ? true : false} 
              onToggle={(isOn) => this.handleSwitch(data, isOn)}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}; 