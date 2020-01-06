import React from 'react';
import { Dimensions, ScrollView, StatusBar, TouchableOpacity, TouchableHighlight, AsyncStorage, TextInput,Animated, Keyboard, BackHandler, UIManager, ActivityIndicator, Platform } from 'react-native';
import { Button, View, Text, Label, Icon } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';
import styles from './css/BusinessInfoCss';
import { inject, observer } from 'mobx-react';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;

@inject(['UserStore'])
@observer
export default class BusinessInfoScreen extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => {
        return {
            header: null,
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            recordId: '',
            bussinessName: '',
            serviceProvider: '',
            contactPerson: '',
            contactNumber: '',
            contactEmail: '',
            contactAddress: '',
            landmark: '',
            area: '',
            city: '',
            state: '',
            zip: '',
            token: '',
            _id: '',
            errorMessage: '',
            submitDisabled: false,
            isloading: false,
            shift: new Animated.Value(0),

        };
        this.focusNextField = this.focusNextField.bind(this);
        this.inputs = {};
        this.handleUpdate = this.handleUpdate.bind(this);
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
      }

      focusNextField(id) {
        this.inputs[id].focus();
      }

    async componentWillMount() {
        const UserStore = this.props.UserStore;
        await AsyncStorage.getItem('authObj').then((value) => {
            let authObj = JSON.parse(value);
           this.setState({
                authObj: authObj,
                recordId: authObj.spServiceProviderId._id,
                serviceProvider: authObj.spServiceProviderId.serviceProvider,
                contactPerson: authObj.spServiceProviderId.contactPerson,
                contactNumber: authObj.spServiceProviderId.contactNumber,
                contactEmail: authObj.spServiceProviderId.contactEmail,
                contactAddress: authObj.spServiceProviderId.contactAddress,
                area: authObj.spServiceProviderId.area ? authObj.spServiceProviderId.area : '',
                landmark: authObj.spServiceProviderId.landmark ? authObj.spServiceProviderId.landmark : '',
                city: authObj.spServiceProviderId.city ? authObj.spServiceProviderId.city : '',
                state: authObj.spServiceProviderId.state ? authObj.spServiceProviderId.state : '',
                zip: authObj.spServiceProviderId.zip ? authObj.spServiceProviderId.zip : ''
            });
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
    }
    componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton = () => {
        const navigation = this.props.navigation;
        navigation.goBack()
        return true;
    }

    handleUpdate() {
        let newAuthObj = this.state.authObj
        const navigation = this.props.navigation;
        const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const phValidation = /^(\d{10})$/
        if (!this.state.serviceProvider.trim()) {
          this.setState({ errorMessage: i18n.t('lanErrorBussinessNameIsRequired')});
        } else if (!this.state.contactPerson.trim()) {
            this.setState({ errorMessage: i18n.t('lanErrorContactPersonIsRequired')});
        } else if (!this.state.contactNumber.trim()) {
            this.setState({ errorMessage: i18n.t('lanErrorContactMobileNumberIsRequired')});
        } else if (!phValidation.test(this.state.contactNumber)) {
            this.setState({ errorMessage: i18n.t('lanErrorInvalidContactMobileNumber')});
        } else if (!this.state.contactEmail.trim()) {
            this.setState({ errorMessage: i18n.t('lanErrorEmailIsRequired')})
        } else if (!emailValidation.test(this.state.contactEmail)) {
            this.setState({ errorMessage: i18n.t('lanErrorBusinessInfoInvalidContactEmail')});
        } else if (!this.state.area.trim()) {
            this.setState({ errorMessage: i18n.t('lanErrorAreaIsRequired')});
        } else if (!this.state.city.trim()) {
            this.setState({ errorMessage: i18n.t('lanErrorCityIsRequired')});
        } else if (!this.state.state.trim()) {
            this.setState({ errorMessage: i18n.t('lanErrorStateIsRequired')});
        } else if (!this.state.zip.trim()) {
            this.setState({ errorMessage: i18n.t('lanErrorPincodeIsRequired')});
        } else if (!this.state.contactAddress.trim()) {
            this.setState({ errorMessage: i18n.t('lanErrorAddressIsRequired')});
        } else {
            this.setState({ submitDisabled: true, isloading: true })
            let data = {
                serviceProvider: this.state.serviceProvider,
                contactPerson: this.state.contactPerson,
                contactNumber: this.state.contactNumber,
                contactEmail: this.state.contactEmail,
                landmark: this.state.landmark,
                area: this.state.area,
                city: this.state.city,
                state: this.state.state,
                zip: this.state.zip,
                contactAddress: this.state.contactAddress,
                _id: this.state._id
            }
            const UserStore = this.props.UserStore;
            let _this = this;
            let _newAuthObj = newAuthObj;
            let loading = setTimeout(function () {
              _this.setState({ isloading: false, submitDisabled: false, errorMessage: i18n.t('lanLabelServerNotResponding') });
            }, 10000);
            UserStore.supplierUpdatedData(this.state.recordId, data, function (resObj) {
                clearTimeout(loading)
                _this.setState({ submitDisabled: false, isloading: false })
                if (resObj.statusCode == '0000') {
                    _this.setState({ errorMessage: i18n.t('lanSuccessUpdatedSuccessfully')});
                    navigation.navigate('ProfileScreen', { businessinfo: 'businessinfo' });
                    _newAuthObj.spServiceProviderId.contactNumber = resObj.statusResult.contactNumber;
                    _newAuthObj.spServiceProviderId.serviceProvider = resObj.statusResult.serviceProvider;
                    _newAuthObj.spServiceProviderId.contactPerson = resObj.statusResult.contactPerson;
                    _newAuthObj.spServiceProviderId.contactEmail = resObj.statusResult.contactEmail;
                    _newAuthObj.spServiceProviderId.landmark = resObj.statusResult.landmark;
                    _newAuthObj.spServiceProviderId.area = resObj.statusResult.area;
                    _newAuthObj.spServiceProviderId.city = resObj.statusResult.city;
                    _newAuthObj.spServiceProviderId.state = resObj.statusResult.state;
                    _newAuthObj.spServiceProviderId.zip = resObj.statusResult.zip;
                    _newAuthObj.spServiceProviderId.contactAddress = resObj.statusResult.contactAddress;
                    _newAuthObj.spServiceProviderId.recordId = resObj.statusResult._id;
                    AsyncStorage.setItem('authObj', JSON.stringify(_newAuthObj));
                } else if (resObj.statusCode == '404') {
                    _this.setState({ errorMessage: i18n.t('lanErrorNoInternetConnection')});
                } else {
                    _this.setState({ errorMessage: i18n.t('lanErrorUpdateFailed')});
                }
            });
        }
    }
      handleKeyboardDidShow = (event) => {
        const { height: windowHeight } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        const currentlyFocusedField = TextInputState.currentlyFocusedField();
        UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
          const fieldHeight = height;
          const fieldTop = pageY;
          const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight+100);
          if (gap >= 0) {
            return;
          }
          Animated.timing(
            this.state.shift,
            {
              toValue: gap,
              duration: 300,
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
            duration: 10,
            useNativeDriver: true,
          }
        ).start();
      }

    render() {
        const navigation = this.props.navigation;
        const { shift } = this.state;

        return (
          <View style={styles.container}>
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
                  <Text style={styles.headerTitleStyle}>{i18n.t('lanLabelBusinessInfo')}</Text>
                </View>
              </View>
            </LinearGradient>
            {this.state.isloading
            ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#ffffff' size='large' style={styles.activeIndicatorStyle} /></View>
            : null}
            <ScrollView>
              <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
                <View style={styles.content}>
                  <View style={styles.input}>
                    <FloatingLabelInput
                        label={i18n.t('lanLabelBussinessName')}
                        value={this.state.serviceProvider}
                        onChangeText={(text) => this.setState({ serviceProvider: text, errorMessage: '' })}
                        minLength={3} maxLength={80}
                        returnKeyType = { 'next' }
                        onRef={(ref) => {
                            this.inputs['Bussiness Name'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('Contact Person');
                        }}
                    />
                  </View>
                  <View style={styles.input}>
                    <FloatingLabelInput
                        label={i18n.t('lanLabelContactPerson')}
                        value={this.state.contactPerson}
                        onChangeText={(text) => this.setState({ contactPerson: text, errorMessage: '' })}
                        minLength={3} maxLength={40}
                        returnKeyType = { 'next' }
                        onRef={(ref) => {
                            this.inputs['Contact Person'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('Contact Mobile');
                        }}
                    />
                  </View>
                  <View style={styles.input}>
                    <FloatingLabelInput
                        label={i18n.t('lanLabelContactMobile')}
                        keyboardType={'numeric'}
                        value={this.state.contactNumber}
                        onChangeText={(text) => this.setState({ contactNumber: text, errorMessage: '' })}
                        minLength={3} maxLength={10}
                        // returnKeyType = { 'next' }
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                            this.inputs['Contact Mobile'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('Contact Email');
                        }}
                    />
                  </View>
                  <View style={styles.input}>
                    <FloatingLabelInput
                        label={i18n.t('lanLabelContactEmail')}
                        value={this.state.contactEmail}
                        onChangeText={(text) => this.setState({ contactEmail: text, errorMessage: '' })}
                        autoCapitalize='none'
                        minLength={3} maxLength={80}
                        returnKeyType = { 'next' }
                        onRef={(ref) => {
                            this.inputs['Contact Email'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('Area');
                        }}
                    />
                  </View>
                  <View style={styles.input}>
                    <FloatingLabelInput
                        label={i18n.t('lanLabelArea')}
                        value={this.state.area}
                        onChangeText={(text) => this.setState({ area: text, errorMessage: '' })}
                        minLength={3} maxLength={15}
                        returnKeyType = { 'next' }
                        onRef={(ref) => {
                            this.inputs['Area'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('Landmark');
                        }}
                    />
                  </View>
                  <View style={styles.input}>
                    <FloatingLabelInput
                        label={i18n.t('lanLabelLandmark')}
                        value={this.state.landmark}
                        onChangeText={(text) => this.setState({ landmark: text, errorMessage: '' })}
                        minLength={3} maxLength={50}
                        returnKeyType = { 'next' }
                        onRef={(ref) => {
                            this.inputs['Landmark'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('City');
                        }}
                    />
                  </View>
                  <View style={styles.input}>
                    <FloatingLabelInput
                        label={i18n.t('lanLabelCity')}
                        value={this.state.city}
                        onChangeText={(text) => this.setState({ city: text, errorMessage: '' })}
                        minLength={3} maxLength={20}
                        returnKeyType = { 'next' }
                        onRef={(ref) => {
                            this.inputs['City'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('State');
                        }}
                    />
                  </View>
                  <View style={styles.input}>
                    <FloatingLabelInput
                        label={i18n.t('lanLabelState')}
                        value={this.state.state}
                        onChangeText={(text) => this.setState({ state: text, errorMessage: '' })}
                        minLength={3} maxLength={20}
                        returnKeyType = { 'next' }
                        onRef={(ref) => {
                            this.inputs['State'] = ref;
                        }}
                        onSubmitEditing={() => {
                            this.focusNextField('PIN');
                        }}
                    />
                  </View>
                  <View style={styles.input}>
                    <FloatingLabelInput
                        label={i18n.t('lanLabelPin')}
                        value={this.state.zip}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.setState({ zip: text, errorMessage: '' })}
                        minLength={6} maxLength={6}
                        // returnKeyType={'next'}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                        onRef={(ref) => {
                            this.inputs['PIN'] = ref;
                        }}
                        onSubmitEditing={() => {this.addressField.focus()}}
                    />
                  </View>
                  <View style={styles.input}>
                    <Label style={styles.labels}>{i18n.t('lanLabelAddress')}</Label>
                    <View>
                      <TextInput
                        style={styles.textArea}
                        value={this.state.contactAddress} maxLength={200} minLength={3} multiline={true}
                        onChangeText={(text) => this.setState({ contactAddress: text, errorMessage: '' })}
                        underlineColorAndroid='transparent'
                        numberOfLines={10}
                        multiline={true}
                        editable={true}
                        ref={(input)=> {this.addressField = input}}
                      />
                    </View>
                    <Text style={{ color: 'red', fontSize: 11, fontFamily: 'Roboto_medium', top:5}}> * {i18n.t('lanLabelAllFieldsRequired')} </Text>
                  </View>
                  <Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>
                  <View style={styles.getCenterView} >
                    <LinearGradient colors={['#025d8c', '#01a4a2']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                        {!this.state.submitDisabled
                        ? <AwesomeButton block success
                            onPress={() => this.handleUpdate()}
                            width={DEVICE_WIDTH/3} height={44} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={22} marginTop={20}>
                            <Text style={styles.BtnText} >{i18n.t('lanCommonButtonUpdate')}</Text>
                            </AwesomeButton>
                        : <AwesomeButton block success
                            disabled={true}
                            onPress={() => this.handleUpdate()}
                            width={DEVICE_WIDTH/3} height={44} backgroundColor='#ddd' backgroundShadow='#ddd' backgroundDarker='#ddd' paddingHorizontal={50} borderRadius={22} marginTop={20}>
                            <Text style={styles.BtnText} >{i18n.t('lanCommonButtonUpdate')}</Text>
                            </AwesomeButton>
                        }
                    </LinearGradient>
                  </View> 
                </View>
              </Animated.View>
            </ScrollView>
          </View>
        );
    }
}