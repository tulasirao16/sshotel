import React from 'react';
import { View, Dimensions,Animated, TextInput, TouchableOpacity, TouchableHighlight, AsyncStorage, ActivityIndicator, ScrollView,Image, Keyboard, StatusBar, UIManage, BackHandler, Platform } from 'react-native';
import { Text, Item, Icon, Label, Card, CardItem, Left, Picker, Body } from 'native-base';
import RadioButton from 'radio-button-react-native';
import { inject, observer } from 'mobx-react';
import styles from '../Locations/css/LocationCreateCss';
import AwesomeButton from 'react-native-really-awesome-button';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import { LinearGradient } from 'expo-linear-gradient';
import { GOOGLE_MAPS_API_KEY } from '../../../constants';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Toast, { DURATION } from 'react-native-easy-toast';
import i18n from 'i18n-js';
const Device_Height = Dimensions.get('window').height;
const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['SPStore'],['PropertyStore'])
@observer
export default class PropertyLocationCreate extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => {
        const { params = {} } = navigation.state;
        return {
          header: null,
        }
      };

    constructor(props) {
        super(props);
        const navigation = this.props.navigation;
        const PropertyStore = this.props.PropertyStore;
        let pdata = PropertyStore.createPropertyLocation ? PropertyStore.createPropertyLocation : {};
        this.state = {
            locationValue: pdata && pdata.locationValue ? pdata.locationValue : 'Selectfromlist',
            locationID: pdata && pdata._id ? pdata._id : '',
            locationItem: PropertyStore && PropertyStore.locationItem ? PropertyStore.locationItem : 0,
            locationData: {},
            houseNumber: '',
            lineName: '',
            street: '',
            area: pdata && pdata.area ? pdata.area : '',
            address: pdata && pdata.address ? pdata.address : '',
            landmark: pdata && pdata.landmark ? pdata.landmark : '',
            city: pdata && pdata.city ? pdata.city : '',
            zip: pdata && pdata.zip ? pdata.zip : '',
            state: pdata && pdata.state ? pdata.state : 'Telangana',
            country: pdata && pdata.country ? pdata.country : 'India',
            contactPerson: pdata && pdata.contactPerson ? pdata.contactPerson :'',
            mobileNumber: pdata && pdata.mobileNumber ? pdata.mobileNumber :'',
            alternateMobileNumber: pdata && pdata.alternateMobileNumber ? pdata.alternateMobileNumber :'',
            email: pdata && pdata.email ? pdata.email :'',
            latitude: pdata && pdata.latitude ? pdata.latitude :'',
            longitude: pdata && pdata.longitude ? pdata.longitude :'',
            locationStatus: pdata && pdata.locationStatus ? pdata.locationStatus: 'Active',
            spServiceProvider: pdata && pdata.spServiceProvider ? pdata.spServiceProvider :'',
            propertyTitle: navigation.state.params && navigation.state.params.propertyData && navigation.state.params.propertyData.propertyTitle ? navigation.state.params.propertyData.propertyTitle : '',
            propertyType: navigation.state.params && navigation.state.params.propertyData && navigation.state.params.propertyData.propertyType ? navigation.state.params.propertyData.propertyType : '',
            propertyArea: navigation.state.params && navigation.state.params.propertyData && navigation.state.params.propertyData.propertyArea ? navigation.state.params.propertyData.propertyArea : '',
            loading: false,
            shift: new Animated.Value(0),
            enable: false,
            areaError: '',
            areaSuccess: '',
            pincodeError: '', pincodeSuccess: '',
            landMarkSuccess: '',
            cityError: '', citySuccess: '',
            latError: '', latSuccess: '',
            longError: '', longSuccess: '',
            contactPersonSuccess: '',
            contactPersonError:'',
            mobileError: '', mobileSuccess: '',
            emailError:'', emailSuccess: '',
            addressError: '', addressSuccess: '',
            submitDisabled: false,
            altMobileNum: '',
            reload: false,
            reloadFunction: ''

          }
          this.focusNextField = this.focusNextField.bind(this);
          this.inputs = {};
          this.handleLocations = this.handleLocations.bind(this);
    }
  async componentWillMount () {
    const SPStore = this.props.SPStore;
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    // if(PropertyStore.createPropertyLocation && PropertyStore.createPropertyLocation.area) {
    // } else {
    // }
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    SPStore.getSpPropertyLocationsList(function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
      if (resObj.statusCode == '404') {
        navigation.navigate('InformationScreen');
      }
    });
    // if(this.state.locationValue == 'Selectfromlist') {
    //   let index = SPStore.LocationsList && SPStore.LocationsList.length > 0 ? SPStore.LocationsList.map(function (e) { return e._id; }).indexOf(this.state.locationID) : -1;
    //   this.setState({locationItem: index})
    // } else {
    // }
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
    handleKeyboardDidShow = (event) => {
      const { height: windowHeight } = Dimensions.get('window');
      const keyboardHeight = event.endCoordinates.height;
      const currentlyFocusedField = TextInputState.currentlyFocusedField();
      UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
        const fieldHeight = height;
        const fieldTop = pageY;
        const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight +100);
        if (gap >= 0) {
          return;
        }
        Animated.timing(
          this.state.shift,
          {
            toValue: gap,
            duration: 1000,
            useNativeDriver: true,
          }
        ).start();
      });
    }
  
    handleKeyboardDidHide = () => {
      Animated.timing(
        this.state.shift,
        {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }
      ).start();
    }

    async handleLocations (value) {
      const PropertyStore = this.props.PropertyStore;
      PropertyStore.createPropertyLocation = {};
      this.setState({ locationValue: value,
        locationItem: 0,
        locationID: '',
          area: '',
          houseNumber: '',
          address: '',
          landmark: '',
          city: '',
          zip: '',
          state: 'Telangana',
          country: 'India',
          contactPerson: '',
          mobileNumber: '',
          alternateMobileNumber: '',
          email: '',
          latitude: '',
          longitude: '',
          locationStatus:  'Active',
          errorMessage: '',
          areaSuccess: '',
          pincodeSuccess: '',
          landMarkSuccess: '',
          citySuccess: '',
          latSuccess: '',
          longSuccess: '',
          contactPersonSuccess: '',
          mobileSuccess: '',
          emailSuccess: '',
          addressSuccess: '',
          altMobileNum: ''
      });
      if(value == 'Create') {
        await AsyncStorage.getItem('authObj').then((value) => {
          let authObj = JSON.parse(value);
          this.setState({
            contactPerson: authObj.spServiceProviderId && authObj.spServiceProviderId.contactPerson ? authObj.spServiceProviderId.contactPerson : '',
            mobileNumber: authObj.spServiceProviderId && authObj.spServiceProviderId.contactNumber ? authObj.spServiceProviderId.contactNumber : '',
            alternateMobileNumber: authObj.spServiceProviderId && authObj.spServiceProviderId.alternateContactNumber ? authObj.spServiceProviderId.alternateContactNumber : '',
            email: authObj.spServiceProviderId && authObj.spServiceProviderId.contactEmail ? authObj.spServiceProviderId.contactEmail : '',
            spServiceProvider: authObj.spServiceProvider
          });
        });
      }
    }
    handleExistLocation (value) {
        const SPStore = this.props.SPStore;
        const PropertyStore = this.props.PropertyStore;
        if(value > 0) {
            this.setState({
                locationItem: value,
                locationData: SPStore.LocationsList[value-1],
                locationID: SPStore.LocationsList[value-1]._id,
                area: SPStore.LocationsList[value-1].area,
                address: SPStore.LocationsList[value-1].address,
                landmark: SPStore.LocationsList[value-1].landmark ? SPStore.LocationsList[value-1].landmark : '',
                city: SPStore.LocationsList[value-1].city,
                zip: SPStore.LocationsList[value-1].zip,
                state: SPStore.LocationsList[value-1].state ? SPStore.LocationsList[value-1].state : 'Telangana',
                country: SPStore.LocationsList[value-1].country ? SPStore.LocationsList[value-1].country : 'India',
                contactPerson: SPStore.LocationsList[value-1].contactPerson,
                mobileNumber: SPStore.LocationsList[value-1].mobileNumber,
                alternateMobileNumber: SPStore.LocationsList[value-1].alternateMobileNumber ? SPStore.LocationsList[value-1].alternateMobileNumber : '',
                email: SPStore.LocationsList[value-1].email,
                latitude: SPStore.LocationsList[value-1].latitude,
                longitude: SPStore.LocationsList[value-1].longitude,
                locationStatus: SPStore.LocationsList[value-1].locationStatus ? SPStore.LocationsList[value-1].locationStatus : 'Active',
                houseNumber: '',
                spServiceProvider: '',
            });
        } else {
          this.setState({
            houseNumber: '',
            locationID: '',
            locationItem: value,
            area: '',
            address: '',
            landmark: '',
            city: '',
            zip: '',
            state: 'Telangana',
            country: 'India',
            contactPerson: '',
            mobileNumber: '',
            alternateMobileNumber: '',
            email: '',
            latitude: '',
            longitude: '',
            locationStatus:  'Active',
          })
        }
    }
    handleSubmitDetails = () => {
        const SPStore = this.props.SPStore;
        const  PropertyStore = this.props.PropertyStore;
        const navigation = this.props.navigation
        const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const phValidation = /^((\(\d{3}\))|\d{3,4})(\-|\s)?(\d{3})(\-|\s)?(\d{1,4})(\-|\s)?(\d{1,3})$/
        if (!this.state.area.trim()) {
          this.refs.toast.show(i18n.t('lanErrorAreaIsRequired'));
          this.setState({ areaError: true, areaSuccess: false })
        } else if (!this.state.zip.trim()) {
          this.refs.toast.show(i18n.t('lanErrorPincodeIsRequired'));
          this.setState({ pincodeError: true, pincodeSuccess: 'false' })
        } else if (!this.state.city.trim()) {
          this.refs.toast.show(i18n.t('lanErrorCityIsRequired'));
          this.setState({ cityError: true, citySuccess: false })
        } else if (!this.state.state) {
          this.refs.toast.show(i18n.t('lanErrorStateIsRequired'));
          // this.setState({ stateError: true, stateSuccess: false })
        } else if (!this.state.country) {
          this.refs.toast.show(i18n.t('lanErrorCountryIsRequired'));
          // this.setState({ errorMessage: 'Country is required' })
        } else if (!this.state.latitude) {
          this.refs.toast.show(i18n.t('lanErrorLatitudeIsRequired'));
          this.setState({ latError: true, latSuccess: false });
        } else if (!this.state.longitude) {
          this.refs.toast.show(i18n.t('lanErrorLongitudeIsRequired'));
          this.setState({ longError: true, longSuccess: false });
        } else if (!this.state.locationStatus) {
          this.refs.toast.show(i18n.t('lanErrorLocationStatusIsRequired'));
          // this.setState({ errorMessage: 'locationStatus is Required' });
        } else if (!this.state.contactPerson.trim()) {
          this.refs.toast.show(i18n.t('lanErrorContactPersonIsRequired'));
          this.setState({ contactPersonError: true, contactPersonSuccess: false })
        } else if (!this.state.mobileNumber.trim()) {
          this.refs.toast.show(i18n.t('lanErrorMobileNumberIsRequired'));
          this.setState({ mobileError: true, mobileSuccess: false })
        } else if (this.state.mobileNumber.trim() && !phValidation.test(this.state.mobileNumber.trim())) {
          this.refs.toast.show(i18n.t('lanErrorInvalidMobileNumber'));
          this.setState({ mobileError: true, mobileSuccess: false })
        } else if (this.state.alternateMobileNumber && !phValidation.test(this.state.alternateMobileNumber)) {
          this.refs.toast.show(i18n.t('lanErrorInvalidAlternateMobileNumber'));
          // this.setState({ errorMessage: 'Invalid AlternateMobileNumber' })
        } else if (!this.state.email.trim()) {
          this.refs.toast.show(i18n.t('lanErrorEmailIsRequired'));
          this.setState({ emailError: true, emailSuccess: false })
        } else if (!emailValidation.test(this.state.email)) {
          this.refs.toast.show(i18n.t('lanErrorInvalidEmail'));
          this.setState({ emailError: true, emailSuccess: false })
        } else if (!this.state.address.trim()) {
          this.refs.toast.show(i18n.t('lanErrorAddressIsRequired'));
          this.setState({ addressError: true, addressSuccess: false })
        } else {
          let locationData = {
            '_id': this.state.locationID,
            'address': this.state.address,
            'area': this.state.area,
            'zip': this.state.zip,
            'city': this.state.city,
            'state': this.state.state,
            'landmark': this.state.landmark,
            'country': this.state.country,
            'contactPerson': this.state.contactPerson,
            'mobileNumber': this.state.mobileNumber,
            'alternateMobileNumber': this.state.alternateMobileNumber,
            'email': this.state.email,
            'latitude': this.state.latitude,
            'longitude': this.state.longitude,
            'locationStatus': this.state.locationStatus,
            'locationValue': this.state.locationValue 
          };
          this.setState({ submitDisabled: true })
          PropertyStore.createPropertyLocation = locationData;
          PropertyStore.locationItem = this.state.locationItem;
          navigation.navigate('CreateProperty', {createLocEnable: true});
          // navigation.goBack({enable: true});
        }
    }
    handleLocation = () => {
      this.setState({loading: true})
      let _this = this; var isArea= false;
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false }); 
      }, 15000);
       navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          let _this = this;
          this.getLocation(position.coords.latitude, position.coords.longitude, function(data) {
            if(data.statusCode == '0000') {
              clearTimeout(isLoading);
              _this.setState({loading: false, address: data.address});
              data.result.forEach(value => {
              if(value.types.indexOf('premise')!=-1) {
                _this.setState({houseNumber: value.long_name});
              }
              if(value.types.indexOf('administrative_area_level_2')!=-1) {
                _this.setState({city: value.long_name});
              }
              if(value.types.indexOf('administrative_area_level_1')!=-1) {
                _this.setState({state: value.long_name});
              }
              // if (value.types.indexOf('sublocality') != -1) {
              //   _this.setState({ address: _this.state.houseNumber + ', ' + _this.state.lineName + ', ' + _this.state.street+ ', ' + value.long_name });
              // }
              if (value.types.indexOf('sublocality_level_2') != -1) {
                _this.setState({ street: value.long_name });
              }
              if (value.types.indexOf('sublocality_level_3') != -1) {
                _this.setState({ lineName: value.long_name });
              }
              // if (value.types.indexOf('sublocality_level_1') != -1) {
              //   _this.setState({ area: value.long_name });
              // }
              if (value.types.indexOf('sublocality_level_1') != -1) {
                isArea = true
                _this.setState({ area: value.long_name });
              } else if (!isArea && value.types.indexOf('locality') != -1) {
                _this.setState({ area: value.long_name });
              }
              if (value.types.indexOf('postal_code') != -1) {
                _this.setState({ zip: value.long_name });
              }
              if (value.types.indexOf('locality') != -1) {
                _this.setState({ areaLocality: value.long_name });
              }
              if (value.types.indexOf('country') != -1) {
                _this.setState({ country: value.long_name });
              }
            });
            } else {
              clearTimeout(isLoading)
              _this.setState({loading: false});
              // alert(i18n.t('lanLabelNotGettingLocationPleaseEnterManually'));
              _this.refs.toast.show(i18n.t('lanLabelNotGettingLocationPleaseEnterManually'));
            }
          });
        },
        (error) => {
          clearTimeout(isLoading)
          this.setState({ errorMessage: error.message, loading: false })
        },
        { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
      );
    }

    getLocation (lat, long, callback) {
      fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=' + GOOGLE_MAPS_API_KEY)
        .then((response) => response.json())
        .then((responseJson) => {
          callback({statusCode: '0000', result: responseJson.results[0].address_components, address: responseJson.results[0].formatted_address});
        }).catch((error) => {
          callback({statusCode: '9999', result: {}, address: ''});
        });
      }
    handleGetLatLong = () => {
      this.setState({loading: true})
      let addressLocation = this.state.address + ',' + this.state.area + '/' + this.state.city + ',' + this.state.state + ',' + this.state.zip
      let _this = this;
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false });
        _this.refs.toast.show(i18n.t('lanLabelIfNotMapedTypeTheAddressManualy'));
      }, 10000);
      fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + addressLocation + ',IN&key=' + GOOGLE_MAPS_API_KEY)
      .then((response) => response.json())
      .then((responseJson) => {
        clearTimeout(isLoading)
        _this.setState({
          loading: false,
          latitude: (responseJson.results && responseJson.results.length > 0) ? responseJson.results[0].geometry.location.lat: '',
          longitude: (responseJson.results && responseJson.results.length > 0) ? responseJson.results[0].geometry.location.lng: ''
        });
      })
    }

    focusNextField(id) {
      this.inputs[id].focus();
    }
    handleReload = () => {
      switch (this.state.reloadFunction) {
        case 'componentWillMount':
          this.setState({ reload: false, reloadFunction: '' });
          this.componentWillMount()
          break;
        case 'handleLocation':
          this.setState({ reload: false, reloadFunction: '' });
          this.handleLocation()
          break;
        case 'handleGetLatLong':
          this.setState({ reload: false, reloadFunction: '' });
          this.handleGetLatLong()
          break;
        default:
          break;
      }
    }
    render () {
        const SPStore = this.props.SPStore;
        const navigation = this.props.navigation
        const { shift } = this.state;
        const areaLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelArea')}<Text style={styles.required}>*</Text></Text>
        const pincodeLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelPinCode')}<Text style={styles.required}>*</Text></Text>
        const cityLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelCity')}<Text style={styles.required}>*</Text></Text>
        const latitudeLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelLatitude')}<Text style={styles.required}>*</Text></Text>
        const longitudeLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelLongitude')}<Text style={styles.required}>*</Text></Text>
        const mobileNoLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelMobileNumber')}<Text style={styles.required}>*</Text></Text>
        const emailLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelEmail')}<Text style={styles.required}>*</Text></Text>
        const contactPersonLbl = <Text style={[styles.titleRadio]}>{i18n.t('lanLabelContactPerson')}<Text style={styles.required}>*</Text></Text>
        const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return(
        !this.state.reload
         ? <View style={{ flex: 1, }}>
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
                    <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleCreateLocation')}</Text>
                  </View>
                </View>
              </LinearGradient>
              {this.state.loading
              ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#ffffff' size='large' style={ styles.activeIndicatorStyle } /></View>
              : null}
              <View style={ styles.businessNameView } >
                <Card style={ styles.card }>
                  <CardItem style={ styles.cardItemStyle }>
                    <Left style={[styles.leftImageView, styles.listItemView ]}>
                      <View style={styles.imageBusinessBox} >
                        <Image source={this.state.propertyImage ? {uri: PUBLIC_DOMAIN + this.state.propertyImage} :  require('../../../assets/dummy_property.jpg')} style={styles.imgStyle} />
                      </View>
                      <Body>
                        <View style={ styles.floatingInputBusinessView } >
                          <Text style={styles.propertyTitle}> {this.state.propertyTitle} </Text>
                          <Text style={styles.titleLocationType}> {this.state.area ? this.state.area : ''} </Text>
                          <Text style={styles.titleType}> {this.state.propertyType} </Text>
                        </View>
                      </Body>
                    </Left>  
                  </CardItem>
                </Card>
              </View>
              <Animated.View style={{ flex: 1, transform: [{ translateY: shift }] }}>
                <ScrollView>
                  <View style={styles.content}>
                  <View style={ styles.DateGenderView }>
                    <View style={ styles.floatingInputView } >
                        <View style={{ flexDirection: 'row'}}>
                            <RadioButton currentValue={this.state.locationValue} value='Selectfromlist' onPress={(value)=> this.handleLocations(value)} />
                            <View style={{ paddingHorizontal:5, paddingVertical:3 }} >
                            <Text style={styles.radioTitle}>{i18n.t('lanLabelSelectLocationList')}</Text>
                            </View>  
                        </View>
                    </View>
                    <View style={ styles.floatingInputView } >
                        <View style={{ flexDirection: 'row'}}>
                            <RadioButton currentValue={this.state.locationValue} value='Create' onPress={(value)=> this.handleLocations(value)} />
                            <View style={{ paddingHorizontal:4, paddingVertical:3 }} >
                            <Text style={styles.radioTitle}>{i18n.t('lanTitleCreateLocation')}</Text>
                            </View>  
                        </View>
                    </View>
                  </View>
                  {this.state.locationValue == 'Selectfromlist' ?
                  <View style={{marginBottom:10 }}>
                    <Item>
                      <Picker
                          iosHeader='Select Location'
                          iosIcon={<Icon name='arrow-down' />}
                          mode='dropdown'
                          style={{ width: DEVICE_WIDTH-20 }}
                          selectedValue={this.state.locationItem}
                          onValueChange={this.handleExistLocation.bind(this) }>
                          <Picker.Item label='Select Location' value={0} />
                          {SPStore.LocationsList && SPStore.LocationsList.length > 0 ? 
                          SPStore.LocationsList.map((item, i) => {
                            return <Picker.Item key={i+1} label={item.address} value={i+1} />
                          }): []}
                      </Picker>
                    </Item>
                  </View> : null }
                  {this.state.locationValue == 'Create' ? 
                  <View style={styles.getLocation}>
                    <TouchableOpacity onPress={this.handleLocation}>
                      <Text style={{ fontSize: 11, fontFamily: 'Roboto_medium', color: '#f7931e'}}> {i18n.t('lanLabelGetLocation')} </Text>
                    </TouchableOpacity>
                  </View>
                    : null }
                    <View style={styles.input}>
                      <FloatingLabelInput
                        label={areaLbl}
                        isError={this.state.areaError}
                        value={this.state.area}
                        onChangeText={(text) => this.setState({ area: text, errorMessage: '', areaError:text ? false : true, areaSuccess: true })}
                        minLength={2} maxLength={30}
                        returnKeyType = { 'next' }
                        onRef={(ref) => {
                          this.inputs['Area'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('Landmark');
                        }}
                      />
                      {this.state.areaError
                      ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                      : this.state.areaSuccess && !this.state.areaError
                        ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                        : null
                      }
                    </View>
                    <View style={styles.input}>
                      <FloatingLabelInput
                        label={i18n.t('lanLabelLandmark')}
                        value={this.state.landmark}
                        onChangeText={(text) => this.setState({ landmark: text, errorMessage: '', landMarkSuccess: text ? true : false })}
                        minLength={2} maxLength={30}
                        returnKeyType = { 'next' }
                        onRef={(ref) => {
                          this.inputs['Landmark'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('PIN Code');
                        }}
                      />
                      {this.state.landMarkSuccess
                      ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                      : null }
                    </View>
                    <View style={styles.dropdownView}>
                      <View style={styles.pincodestyle}>
                        <FloatingLabelInput
                          label={pincodeLbl}
                          isError={this.state.pincodeError}
                          value={this.state.zip}
                          keyboardType={'numeric'}
                          onChangeText={(text) => this.setState({ zip: text, errorMessage: '', pincodeError:text ? false : true, pincodeSuccess:text.length >= 6 ? true : false })}
                          maxLength={6}
                          returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                            onRef={(ref) => {
                              this.inputs['PIN Code'] = ref;
                            }}
                            onSubmitEditing={() => {
                                this.focusNextField('City');
                            }}
                        />
                        {this.state.pincodeError
                        ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                        : this.state.pincodeSuccess && !this.state.pincodeError
                          ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                          : null
                        }
                      </View>
                      <View style={styles.rightView}>
                        <Picker
                          iosHeader='Select Status'
                          iosIcon={<Icon name='arrow-down' />}
                          mode='dropdown'
                          style={{ width: undefined, marginTop:-10  }}
                          selectedValue={this.state.locationStatus}
                          onValueChange={(itemValue, itemIndex) =>
                              this.setState({ locationStatus: itemValue, errorMessage: '' })
                          }>
                          <Picker.Item label='Active' value='Active' />
                          <Picker.Item label='Inactive' value='Inactive' />
                        </Picker>
                      </View>
                    </View>
                    <View style={styles.input}>
                      <FloatingLabelInput
                        label={cityLbl}
                        isError={this.state.cityError}
                        value={this.state.city}
                        onChangeText={(text) => this.setState({ city: text, errorMessage: '', cityError:text ? false : true, citySuccess: true })}
                        minLength={2} maxLength={30}
                        returnKeyType = { 'next' }
                          onRef={(ref) => {
                            this.inputs['City'] = ref;
                          }}
                          onSubmitEditing={() => {
                              this.focusNextField('Latitude');
                          }}
                      />
                      {this.state.cityError
                      ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                      : this.state.citySuccess && !this.state.cityError
                        ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                        : null
                      }
                    </View>
                    <View style={styles.dropdownView}>
                      <View style={styles.leftView}>
                        <Picker
                          iosHeader='Select country'
                          iosIcon={<Icon name='arrow-down' />}
                          mode='dropdown'
                          style={{ width: undefined }}
                          selectedValue={this.state.country}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({ country: itemValue, errorMessage: '' })
                          }>
                          <Picker.Item label='India' value='India' />
                          <Picker.Item label='USA' value='USA' />
                          <Picker.Item label='Canada' value='Canada' />
                          <Picker.Item label='Australia' value='Australia' />
                        </Picker>
                      </View>
                      <View style={styles.rightView}>
                        <Picker
                          iosHeader='Select State'
                          iosIcon={<Icon name='arrow-down' />}
                          mode='dropdown'
                          style={{ width: undefined }}
                          selectedValue={this.state.state}
                          onValueChange={(itemValue, itemIndex) =>
                              this.setState({ state: itemValue, errorMessage: '', })
                            }>
                          <Picker.Item label='Telangana' value='Telangana' />
                          <Picker.Item label='Andhra Pradesh' value='Andhra Pradesh' />
                        </Picker>
                      </View>
                    </View>
                    <View style={styles.floatingInputView}>
                      <View style={styles.getLatitude}>
                        <TouchableOpacity onPress={this.handleGetLatLong}>
                          <Text style={{ fontSize: 11, fontFamily: 'Roboto_medium', color: '#f7931e'}}> {i18n.t('lanButtonLat&Long')} </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.leftinputView}>
                        <FloatingLabelInput
                          label={latitudeLbl}
                          keyboardType='numeric'
                          isError={this.state.latError}
                          value={this.state.latitude.toString()}
                          onChangeText={(text) => this.setState({ latitude: text, errorMessage: '', latError: text ? false : true, latSuccess: true })}
                          minLength={2} maxLength={15}
                          returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                          onRef={(ref) => {
                            this.inputs['Latitude'] = ref;
                          }}
                          onSubmitEditing={() => {
                              this.focusNextField('Longitude');
                          }}
                        />
                        {this.state.latError
                        ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                        : this.state.latSuccess && !this.state.latError
                          ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                          : null
                        }
                      </View>
                      <View style={styles.rightinputView}>
                        <FloatingLabelInput
                          label={longitudeLbl}
                          isError={this.state.longError}
                          keyboardType='numeric'
                          value={this.state.longitude.toString()}
                          onChangeText={(text) => this.setState({ longitude: text, errorMessage: '', longError:text ? false : true, longSuccess: true })}
                          minLength={2} maxLength={15}
                          returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                          onRef={(ref) => {
                            this.inputs['Longitude'] = ref;
                          }}
                          onSubmitEditing={() => {
                              this.focusNextField('Contact Person');
                          }}
                        />
                        {this.state.longError
                        ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                        : this.state.longSuccess && !this.state.longError
                          ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                          : null
                        }
                      </View>
                    </View>
                    <View style={styles.input}>
                      <FloatingLabelInput
                        label={contactPersonLbl}
                        isError={this.state.contactPersonError}
                        value={this.state.contactPerson}
                        onChangeText={(text) => this.setState({ contactPerson: text, errorMessage: '', contactPersonSuccess: text ? true : false })}
                        minLength={2} maxLength={20}
                        returnKeyType = { 'next' }
                          onRef={(ref) => {
                            this.inputs['Contact Person'] = ref;
                          }}
                          onSubmitEditing={() => {
                              this.focusNextField('Mobile Number');
                          }}
                      />
                      {/* {this.state.contactPersonSuccess
                      ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                      : null } */}
                      {this.state.contactPersonError
                        ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                        : this.state.contactPersonSuccess && !this.state.contactPersonError
                          ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                          : null
                        }

                    </View>
                    <View style={styles.input}>
                      <FloatingLabelInput
                        label={mobileNoLbl}
                        isError={this.state.mobileError}
                        value={this.state.mobileNumber}
                        keyboardType='numeric'
                        onChangeText={(text) => this.setState({ mobileNumber: text, errorMessage: '', mobileError:text ? false : true, mobileSuccess:text.length == 10 ? true : false })}
                        maxLength={10}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                          onRef={(ref) => {
                            this.inputs['Mobile Number'] = ref;
                          }}
                          onSubmitEditing={() => {
                              this.focusNextField('Alternate Mobile Number');
                          }}
                      />
                      {this.state.mobileError
                        ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                        : this.state.mobileSuccess && !this.state.mobileError
                          ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                          : null
                        }
                    </View>
                    <View style={styles.input}>
                      <FloatingLabelInput
                        label={i18n.t('lanLabelAlternateMobileNumber')}
                        value={this.state.alternateMobileNumber}
                        onChangeText={(text) => this.setState({ alternateMobileNumber: text, errorMessage: '', altMobileNum:text.length == 10 ? true : false })}
                        keyboardType='numeric'
                        maxLength={10}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                          onRef={(ref) => {
                            this.inputs['Alternate Mobile Number'] = ref;
                          }}
                          onSubmitEditing={() => {
                              this.focusNextField('Email');
                          }}
                      />
                      {this.state.altMobileNum
                      ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                      : null }
                    </View>
                    <View style={styles.input}>
                      <FloatingLabelInput
                        label={emailLbl}
                        isError={this.state.emailError}
                        value={this.state.email}
                        autoCapitalize={'none'}
                        onChangeText={(text) => this.setState({ email: text, errorMessage: '', emailError: !emailValidation.test(text), emailSuccess: emailValidation.test(text) })}
                        maxlength={30}
                        returnKeyType = { 'next' }
                          onRef={(ref) => {
                            this.inputs['Email'] = ref;
                          }}
                          onSubmitEditing={() => { this.addressInput.focus();}}
                      />
                      {this.state.emailError
                      ? <View style={styles.errorIconView}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                      : this.state.emailSuccess && !this.state.emailError
                        ? <View style={styles.errorIconView}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                        : null
                      }
                    </View>
                    <View style={styles.textAreaContainer} >
                      <Label style={styles.labels}>{i18n.t('lanLabelAddress')}<Text style={styles.required}>*</Text></Label>
                      <View style={{ flex: 5 }}>
                        <TextInput
                          style={!this.state.addressError ? styles.textArea : styles.textAreaError }
                          value={this.state.address}
                          onChangeText={(text) => this.setState({ address: text, errorMessage: '', addressError:text ? false : true, addressSuccess: true })}
                          underlineColorAndroid='transparent'
                          numberOfLines={10}
                          multiline={true}
                          editable={true}
                          returnKeyType = { 'done' }
                          ref={(input) => { this.addressInput = input }}
                          onSubmitEditing={() => { this.handleSubmitDetails() }}
                        />
                        {this.state.addressError
                        ? <View style={styles.errorIconViewAddress}><Icon name='ios-close-circle' style={ styles.errorIcon } /></View>
                        : this.state.addressSuccess && !this.state.addressError
                          ? <View style={styles.errorIconViewAddress}><Icon name='ios-checkmark-circle' style={styles.successIcon } /></View>
                          : null
                        }
                      </View>
                    </View>
                    {/* <View style={{justifyContent:'center', alignItems:'center' }}><Text style={{ color: 'red', fontSize: 12, fontFamily: 'Roboto_medium', }}>{this.state.errorMessage}</Text></View> */}
                    <View style={styles.centerLine}>
                      <Text style={styles.mediumFont}>{i18n.t('lanLabelIfNotMapedTypeTheAddressManualy')}</Text>
                    </View>
                    {!this.state.submitDisabled
                    ? <View style={styles.btnModal} >
                      <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                        <AwesomeButton block success
                          onPress={this.handleSubmitDetails}
                          width={DEVICE_WIDTH/3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                          <Text style={styles.BtnText}>{i18n.t('lanCommonButtonSubmit')}</Text>
                        </AwesomeButton>
                      </LinearGradient>
                    </View>
                    : 
                    <View style={styles.btnModal} >
                      <LinearGradient colors={['#ddd', '#ddd']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                        <AwesomeButton block success
                          disabled={this.state.submitDisabled}
                          onPress={this.handleSubmitDetails}
                          width={DEVICE_WIDTH/3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                          <Text style={styles.BtnText}> {i18n.t('lanCommonButtonSubmit')}</Text>
                        </AwesomeButton>
                      </LinearGradient>
                    </View>
                    }
                  </View>
                </ScrollView>
              </Animated.View>
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
              <KeyboardSpacer topSpacing={50} />
            </View>
            : <View>
              <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
                <View style={styles.headerMainViewReload} >
                  <View style={styles.headerLeftReload} >
                    <TouchableOpacity>
                      <Icon name='ios-arrow-back' style={styles.iconMenuStyle1} onPress={() => navigation.goBack()} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.headerBodyReload} >
                    <TouchableOpacity>
                      <Text style={styles.headerTitleStyle1}>{i18n.t('lanAppTitle')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
              <View style={{ jflex: 1, justifyContent: 'center', alignItems: 'center', width: DEVICE_WIDTH - 20, height: Device_Height - 150 }} >
                <View style={styles.eachBtnView} >
                  <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
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
        )
    }
}   