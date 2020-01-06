import React from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncStorage, TouchableOpacity, TouchableHighlight, ActivityIndicator, Platform, BackHandler, ScrollView, StatusBar, Image, Dimensions, Animated, Keyboard, UIManager, TextInput } from 'react-native';
import { View, Icon, Text, Picker, Button } from 'native-base';
import { ImagePicker, ImageManipulator } from 'expo';
import i18n from 'i18n-js';
import * as Permissions from 'expo-permissions';
import styles from './css/UpdateIDProofCss';
import AwesomeButton from 'react-native-really-awesome-button';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';
import { PUBLIC_DOMAIN } from '../../../constants';
import Toast, { DURATION } from 'react-native-easy-toast';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;

class FloatingLabelInput extends React.Component {
    state = {
      isFocused: false,
    };
  
    componentWillMount() {
      this._animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
    }
  
    handleFocus = () => this.setState({ isFocused: true });
    handleBlur = () => this.setState({ isFocused: false });
  
    componentDidUpdate() {
      Animated.timing(this._animatedIsFocused, {
        toValue: (this.state.isFocused || this.props.value !== '') ? 1 : 0,
        duration: 200,
      }).start();
    }
  
    render() {
      const { label, ...props } = this.props;
      const labelStyle = {
        position: 'absolute',
        left: 0,
        top: this._animatedIsFocused.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
        fontSize: this._animatedIsFocused.interpolate({
          inputRange: [0, 1],
          outputRange: [17, 14],
        }),
        color: '#9a9a9a',
        fontWeight: '400',
        fontFamily: (Platform.OS === 'ios') ? 'Roboto_medium' : 'Roboto_medium'
      };
      return (
        <View style={{ paddingTop: 18, }}>
          <Animated.Text style={labelStyle}>
            {label}
          </Animated.Text>
          <TextInput
            {...props}
            style={this.state.isFocused ? { height: 26, fontSize: 17, fontFamily: 'Roboto_medium', color: '#6d6d6d', borderBottomWidth: 2, borderBottomColor: '#025d8c' }
              : { height: 26, fontSize: 17, color: '#000', fontFamily: 'Roboto_medium', borderBottomWidth: 1, borderBottomColor: '#009688' }}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            underlineColorAndroid='transparent'
            blurOnSubmit
          />
        </View>
      );
    }
  }

@inject(['UserStore'])
@observer
export default class UpdateIDProofScreen extends React.Component {

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
      idTypeValid: true,
      authObj: {},
      file: {},
      data: {},
      uploading: false,
      loading: false,
      image: '',
      _id: '',
      idType: '',
      kycImagePath: '',
      kycImageOriginalName:'',
      filename: '',
      errorMessage: '',
      currentidProofData: {},
      oldIDProofData: {},
      dobOnId: '',
      isModalVisible: false,
      submitDisabled: false
    }
    this.handleUpdateData = this.handleUpdateData.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.handleidType = this.handleidType.bind(this);
    this.handleApiCall = this.handleApiCall.bind(this);
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
  }

  async componentWillMount() {
    const navigation = this.props.navigation;
    var data = navigation.state.params.data;
    this.setState({
      currentidProofData: data,
      oldIDProofData: data,
      _id: data._id,
      dobOnId: data.dobOnId
    })
  }
  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleBackButton() {
    const navigation = this.props.navigation;
    navigation.navigate('ProfileScreen');
    return true;
  }
  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
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
  _pickImage = async () => {
    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      this._handleImagePicked(pickerResult);
    }
  };
  _handleImagePicked = async pickerResult => {
    try {
      this.setState({
        uploading: true
      });

      if (!pickerResult.cancelled) {
        this.handleCompressImage(pickerResult.uri);
      }
    } catch (e) {
      // alert(i18n.t('lanErrorUploadFailedSorry'));
      this.refs.toast.show(i18n.t('lanErrorUploadFailedSorry'));
    } finally {
      this.setState({
        uploading: false
      });
    }
  };
  async handleCompressImage(uri) {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [],
      { compress: 0.75 }
    );
    this.setState({
      image: manipResult.uri, filename: manipResult.uri, errorMessage: ''
    });
  }
  _toggleModal = () =>
    this.setState({
      isModalVisible: !this.state.isModalVisible
    });

  handleidType = (value) => {
    let idType = value
    const UserStore = this.props.UserStore
    this.setState(prevState => {
      let currentidProofData = Object.assign({}, prevState.currentidProofData)
      let errorMessage = ''
      let loading = true
      currentidProofData.idType = idType
      return { currentidProofData, errorMessage, loading }
    })
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false });
    }, 10000);
    if(_this.state.oldIDProofData.idType != idType) {
      UserStore.getIdDetails(value, function (resObj) {
        clearTimeout(isLoading)
        if(resObj.statusCode == '0000') {
          _this.setState({ idTypeValid: false, errorMessage: i18n.t('lanErrorYouHaveThisIDTypeInYourList'), loading: false })
        } else {
          _this.setState({ idTypeValid: true, errorMessage: '' , loading: false})
        }
      })
    } else {
      clearTimeout(isLoading)
      _this.setState({ idTypeValid: true, errorMessage: '' , loading: false})
    }
  }

  handleUpdateData() {
    let oIDpd = this.state.oldIDProofData
    let idPD = this.state.currentidProofData
    const navigation = this.props.navigation
    if (!this.state.idTypeValid) {
      this.setState({ errorMessage: i18n.t('lanErrorYouHaveThisIDTypeInYourList') })
    } else if (!idPD.idNumber.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorCardNumberIsRequired') });
    } else {
      this.setState({ submitDisabled: true, loading: true })
      var isUpdate = JSON.stringify(oIDpd) === JSON.stringify(idPD)
      if (isUpdate && !this.state.filename && this.state.currentidProofData.dobOnId === this.state.dobOnId) {
        this.setState({ submitDisabled: false, loading: false })
        navigation.navigate('IDProofsList');
      } else {
        if (this.state.currentidProofData.idType === 'Voter Card') {
          if (this.state.currentidProofData.idNumber !== this.state.oldIDProofData.idNumber) {
            this.handleApiCall(this.state.filename, validateAdhaarApi = 'true')
          } else {
            this.handleApiCall(this.state.filename, validateAdhaarApi = 'false')
          }
        } else {
          if (this.state.currentidProofData.idNumber !== this.state.oldIDProofData.idNumber || this.state.currentidProofData.dobOnId !== this.state.dobOnId) {
            this.handleApiCall(this.state.filename, validateAdhaarApi = 'true')
          } else {
            this.handleApiCall(this.state.filename, validateAdhaarApi = 'false')
          }
        }
      }
    }
  }

  async handleApiCall(uri, validateAdhaarApi) {
    const navigation = this.props.navigation
    var authToken = await AsyncStorage.getItem('authToken');
    const data = new FormData()
    if (uri) {
      let uriParts = uri.split('.');
      let fileType = uriParts[uriParts.length - 1];
      data.append('profileIdProofImage', {
        uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
    }
    data.append('idType', this.state.currentidProofData.idType)
    data.append('idNumber', this.state.currentidProofData.idNumber)
    data.append('nameOnId', this.state.currentidProofData.nameOnId)
    data.append('dobOnId', validateAdhaarApi === 'false' ? this.state.currentidProofData.dobOnId : this.state.dobOnId)
    data.append('validateAdhaarApi', validateAdhaarApi)
    let _this = this;
    let options = {
      method: 'PUT',
      body: data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'token': authToken
      },
    };
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, submitDisabled: false, errorMessage: i18n.t('lanLabelServerNotResponding')});
    }, 15000);
    let apiUrl = PUBLIC_DOMAIN + 'api/v1/sp/user/profile/idproof/update/' + this.state._id;
    fetch(apiUrl, options).then((response) => {
      response.json().then((responseJson) => {
        clearTimeout(isLoading)
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (responseJson.statusCode == '0000') {
          _this.setState({ errorMessage: i18n.t('lanSuccessUpdateIDProofSuccessfully'), submitDisabled: false, loading: false })
          navigation.navigate('IDProofsList', { idproof: 'idproof' });
        } else if (responseJson.statusCode == '9980') {
          _this.setState({ errorMessage: i18n.t('lanErrorInvalidIDProofDetails'), submitDisabled: false, loading: false})
        } else {
          _this.setState({ errorMessage: i18n.t('lanErrorUpdateIDProofFailed'), submitDisabled: false, loading: false })
        }
      });
    })
  }
  
  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    let data = navigation.state.params.data;
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
          <View>
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
              <StatusBar barStyle='light-content' />
              <View style={styles.status} />
              <View style={styles.headerMainView} >
                <View style={styles.headerLeft} >
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()}>
                    <Icon name='ios-arrow-back' style={styles.iconMenuStyle}  />
                  </TouchableHighlight>
                </View>
                <View style={styles.headerBody} >
                <Text style={styles.headerTitleStyle}> {i18n.t('lanTitleUpdateIDProof')} </Text>
                </View>
              </View>
            </LinearGradient>
            {this.state.loading
              ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#ffffff' size='large' style={styles.activeIndicatorStyle} /></View>
              : null}
          </View>
          <ScrollView>
            <View style={styles.content}>
              <View style={styles.input}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#009688', marginTop: 10 }}>
                  <Text style={styles.pickerLabel}> {i18n.t('lanLabelSelectIDType')} <Text style={{ color: 'red' }}>*</Text>:</Text>
                  <View style={styles.pickerView}>
                    <Picker
                      mode='dialog'
                      iosIcon={<Icon name='ios-arrow-down-outline' />}
                      style={{ height: 40, width: DEVICE_WIDTH - 100, color: '#5a5a5a' }}
                      placeholderStyle={{ color: '#000' }}
                      placeholderIconColor='#000'
                      enabled={false}
                      selectedValue={this.state.currentidProofData.idType}
                      onValueChange={(itemValue, itemIndex) =>  this.handleidType(itemValue)}
                    >
                      <Picker.Item label='Aadhar Card' value='Aadhar Card' />
                      <Picker.Item label='Voter Card' value='Voter Card' />
                      <Picker.Item label='Passport' value='Passport' />
                      <Picker.Item label='Ration Card' value='Ration Card' />
                      <Picker.Item label='PAN Card' value='PAN Card' />
                      <Picker.Item label='Driving License' value='Driving License' />
                    </Picker>
                  </View>
                </View>
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  style={styles.floatingLabel}
                  label={i18n.t('lanLabelCardNumber')}
                  value={this.state.currentidProofData.idNumber}
                  onChangeText={
                  (value) =>
                    this.setState(prevState => {
                      let currentidProofData = Object.assign({}, prevState.currentidProofData)
                      let errorMessage = ''
                      currentidProofData.idNumber = value
                      return { currentidProofData, errorMessage }
                    })
                  }
                  minLength={2} maxLength={40}
                />
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  style={styles.floatingLabel}
                  label={i18n.t('lanLabeNameOnID')}
                  value={this.state.currentidProofData.nameOnId}
                  onChangeText={
                    (value) =>
                      this.setState(prevState => {
                        let currentidProofData = Object.assign({}, prevState.currentidProofData)
                        let errorMessage = ''
                        currentidProofData.nameOnId = value
                        return { currentidProofData, errorMessage }
                      })
                    }
                  minLength={2} maxLength={40}
                />
              </View>
              {this.state.currentidProofData.idType === 'Driving License'
                ? <View style={styles.input}>
                    <FloatingLabelInput
                      style={styles.floatingLabel}
                      label={i18n.t('lanLabelDateOfBirth')}
                      placeholder={i18n.t('lanLabelDOBDDMMYYYY')}
                      value={this.state.dobOnId}
                      onChangeText={(text) => this.setState({ dobOnId: text, errorMessage: '' })}
                      maxLength={10}
                    />
                  </View>
                : null }
              <View style={styles.input}>
                <FloatingLabelInput
                  style={styles.floatingLabel}
                  label='Status'
                  value={this.state.currentidProofData.idStatus}
                  editable={false}
                />
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  style={styles.floatingLabel}
                  value={this.state.filename ? this.state.filename : (this.state.currentidProofData.kycImage ? this.state.currentidProofData.kycImage : 'Choose ID Proof')}
                  editable={false}
                />
                <View style={styles.browseIdProof}>
                <LinearGradient colors={['#025d8c', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBrowseBtnStyles}>
                    <AwesomeButton block success
                      onPress={this._pickImage}
                      width={70} height={25} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                      <Text style={styles.BtnBrowseText} >{i18n.t('lanCommonButtonBrowse')}</Text>
                    </AwesomeButton>
                  </LinearGradient>
                </View>
              </View>
              <TouchableOpacity transparent onPress={this._toggleModal} style={styles.idProofView} >
                <View><Text><Icon name='ios-eye' style={{ color: '#025d8c', fontSize: 30 }} /></Text></View>
              </TouchableOpacity>
              <Modal transparent={true} isVisible={this.state.isModalVisible} style={styles.modalView}>
                <View style={styles.modalContainer}>
                  <View style={styles.mainView} >
                    <View style={styles.modalClose} >
                      <Icon name='md-close-circle'  onPress={() => this.setState({ isModalVisible: false })} style={styles.closeIcon} />
                    </View>
                    <View style={{ paddingLeft: 20 }} >
                      <View><Text style={styles.idText}><Text style={styles.boldFontStyle}>{i18n.t('lanLabelProfileIDType')}</Text> {data.idType}</Text></View>
                      <View><Text style={styles.idText}><Text style={styles.boldFontStyle}>{i18n.t('lanLabelProfileID')}</Text> {data.idNumber}</Text></View>
                      <View>
                      <View style={styles.profileImageView} >
                        <Image source={(data.kycImagePath) ? { uri: PUBLIC_DOMAIN + data.kycImagePath } : ''}
                          style={styles.fitImage} />
                      </View>
                    </View>
                    <View style={styles.btnModal} >
                      <Button onPress={this._toggleModal} uppercase={false} transparent style={styles.btnModalSubmit} >
                      <Text style={styles.btnTxt}>{i18n.t('lanCommonButtonOk')}</Text>
                      </Button>
                    </View>
                  </View>
                </View>
                </View>
              </Modal>
              <Text style={{ color: 'red', fontFamily: 'Roboto_medium', fontSize: 11 }}>{this.state.errorMessage}</Text>
              <View style={styles.getCenterView} >
                <LinearGradient colors={['#025d8c', '#01a4a2']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                  {!this.state.submitDisabled
                  ? <AwesomeButton block success
                  onPress={this.handleUpdateData}
                  width={DEVICE_WIDTH / 3} height={44} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={22} >
                  <Text style={styles.BtnText} > {i18n.t('lanCommonButtonUpdate')} </Text>
                  </AwesomeButton>
                  : <AwesomeButton block success
                  disabled={true}
                  onPress={this.handleUpdateData}
                  width={DEVICE_WIDTH / 3} height={44} backgroundColor='#ddd' backgroundShadow='#ddd' backgroundDarker='#ddd' paddingHorizontal={50} borderRadius={22} >
                  <Text style={styles.BtnText} > {i18n.t('lanCommonButtonUpdate')} </Text>
                </AwesomeButton>
                }
                </LinearGradient>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
        <Toast
          ref='toast'
          style={{backgroundColor:'red', width: '100%', borderRadius:0,padding: 10, }}
          position='top'
          positionValue={80}
          fadeInDuration={50}
          fadeOutDuration={500}
          // opacity={0.8}
          borderRadius={0}
          textStyle={{color:'white', fontFamily: 'Roboto_medium', }}
        />
      </View>
    );
  }
}
