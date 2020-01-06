import React from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncStorage, ActivityIndicator, Platform, TouchableOpacity, TouchableHighlight, BackHandler, ScrollView, StatusBar, Image, Dimensions, Animated, Keyboard, UIManager, TextInput } from 'react-native';
import { View, Icon, Text, Picker } from 'native-base';
import { ImagePicker, ImageManipulator } from 'expo';
import * as Permissions from 'expo-permissions';
import i18n from 'i18n-js';
import styles from './css/CreateIDProofCss';
import AwesomeButton from 'react-native-really-awesome-button';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import { LinearGradient } from 'expo-linear-gradient';
import { PUBLIC_DOMAIN } from '../../../constants';
import Toast, { DURATION } from 'react-native-easy-toast';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;

@inject(['UserStore'])
@observer
export default class CreateIDProofScreen extends React.Component {

  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor() {
    super();
    this.state = {
      shift: new Animated.Value(0),
      authObj: {},
      uploading: false,
      reload: false,
      idProofSatus: false,
      data: {},
      file: {},
      image: '',
      idImagePath: '',
      idType: '',
      idNumber: '',
      nameOnId: '',
      filename: '',
      dobOnId: '',
      idStatus: 'Not-Verified',
      submitDisabled: false,
      errorMessage: '',
      loading: false,
    }
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    this.handleCreateData = this.handleCreateData.bind(this)
    this.handleIdTypeValidation = this.handleIdTypeValidation.bind(this)
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
    this.backHandler.remove()
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    const navigation = this.props.navigation;
    navigation.goBack()
      return true
    })
  }
  onValueChange(value) {
    this.setState({
      selected: value
    });
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
  _takePhoto = async () => {
    const {
      status: cameraPerm
    } = await Permissions.askAsync(Permissions.CAMERA);

    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
      });

      this._handleImagePicked(pickerResult);
    }
  };
  _pickImage = async () => {
    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
      { compress: 0.5 }
    );
    this.setState({
      image: manipResult.uri, filename: manipResult.uri, errorMessage: ''
    });
  }

  handleIdTypeValidation = (value) => {
    this.setState({ idType: value, loading: true })
    const UserStore = this.props.UserStore
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false });
    }, 10000);
    let idType = value
    UserStore.getIdDetails(value, function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '0000') {
        let idProofData = resObj.statusResult
        _this.setState({
          idProofSatus: true,
          filename: '',
          file: {},
          image: '',
          idImagePath: idProofData.kycImageOriginalName,
          idType: idProofData.idType,
          idNumber: idProofData.idNumber,
          nameOnId: idProofData.nameOnId,
          idStatus: idProofData.idStatus,
          dobOnId: idProofData.dobOnId ? idProofData.dobOnId : '' ,
          errorMessage: 'Id proof added',
          reload: true,
          loading: false
        })
      } else {
        _this.setState({
          idType: idType,
          idImagePath: '',
          idNumber: '',
          idProofSatus: false,
          idStatus: 'Not-Verified',
          errorMessage: '',
          reload: true,
          loading: false
        })
      }
    })
  }

  async handleCreateData(uri) {
    const navigation = this.props.navigation;
    var authToken = await AsyncStorage.getItem('authToken');
    if (this.state.idProofSatus) {
      navigation.navigate('IDProofsList')
    } else if (!this.state.idType) {
      this.setState({ errorMessage: i18n.t('lanErrorIDTypeIsRequired') })
    } else if (!this.state.idNumber.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorCardNumberRequired') })
    } else if (!this.state.nameOnId.trim()) {
      this.setState({ errorMessage: i18n.t('lanErrorNameOnIDRequired') })
    } else if (this.state.image.length <= 0) {
      this.setState({ errorMessage: i18n.t('lanErrorImageIsRequired') })
    } else if (uri) {
      this.setState({ submitDisabled: true, loading: true })
      let _this = this
      const data = new FormData()
      let uriParts = uri.split('.');
      let fileType = uriParts[uriParts.length - 1];
      data.append('profileIdProofImage', {
        uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
      data.append('idType', this.state.idType)
      data.append('idNumber', this.state.idNumber)
      data.append('nameOnId', this.state.nameOnId)
      data.append('dobOnId', this.state.dobOnId)
      let options = {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'token': authToken
        },
      };
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, errorMessage: i18n.t('lanLabelServerNotResponding') });
        setTimeout(function () {
          navigation.navigate('IDProofsList');
        }, 3000);
      }, 20000);
      let apiUrl = PUBLIC_DOMAIN + 'api/v1/sp/user/profile/idproof/create';
      fetch(apiUrl, options).then((response) => {
        response.json().then((responseJson) => {
          clearTimeout(isLoading)
          if (responseJson.statusCode == '0000') {
            _this.setState({ errorMessage: i18n.t('lanSuccessCreateIDProofSuccessfully'),loading: false, submitDisabled: false })
            navigation.navigate('IDProofsList', { idproof: 'idproof' });
          } else if (responseJson.statusCode == '9980') {
            _this.setState({ loading: false, errorMessage: i18n.t('lanErrorInvalidInformation'), submitDisabled: false })
          } else {
            _this.setState({ loading: false, errorMessage: i18n.t('lanErrorCreateIDProofFailed'), submitDisabled: false })
          }
        })
      })
    }
  }
  
  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
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
                  <View>
                    <Text style={styles.headerTitleStyle}> {i18n.t('lanTitleAddIDProof')} </Text>
                  </View>
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
                  <Text style={styles.pickerLabel}> {i18n.t('lanLabelSelectIDType')}<Text style={{ color: 'red' }}>*</Text>:</Text>
                  <View style={styles.pickerView}>
                    <Picker
                      mode='dropdown'
                      iosIcon={<Icon name='arrow-down' />}
                      style={{ width: DEVICE_WIDTH-20 }}
                      selectedValue={this.state.idType}
                      onValueChange={(itemValue, itemIndex) => this.handleIdTypeValidation(itemValue)}
                    >
                      <Picker.Item label={i18n.t('lanLabelPleaseSelectIDType')} value='' />
                      <Picker.Item label='Voter Card' value='Voter Card' />
                      <Picker.Item label='Driving License' value='Driving License' />
                    </Picker>
                  </View>
                </View>
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  style={styles.floatingLabel}
                  label={i18n.t('lanLabelCardNumber')}
                  value={this.state.idNumber}
                  onChangeText={(text) => this.setState({ idNumber: text, errorMessage: '' })}
                  minLength={2} maxLength={40}
                  returnKeyType = { 'next' }
                  onRef={(ref) => {
                    this.inputs['Card Number'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('Name On ID');
                  }}  
                />
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  style={styles.floatingLabel}
                  label={i18n.t('lanLabeNameOnID')}
                  value={this.state.nameOnId}
                  onChangeText={(text) => this.setState({ nameOnId: text, errorMessage: '' })}
                  minLength={2} maxLength={40}
                  returnKeyType = { 'next' }
                  onRef={(ref) => {
                    this.inputs['Name On ID'] = ref;
                  }}
                  onSubmitEditing={() => {
                      this.focusNextField('Status');
                  }}  
                />
              </View>
                {this.state.idType === 'Driving License'
                ? <View style={styles.input}>
                    <FloatingLabelInput
                      style={styles.floatingLabel}
                      // label='Date of birth'
                      placeholder={i18n.t('lanLabelDOBDDMMYYYY')}
                      value={this.state.dobOnId}
                      onChangeText={(text) => this.setState({ dobOnId: text, errorMessage: '' })}
                      maxLength={10}
                      onRef={(ref) => {
                        this.inputs[''] = ref;
                      }}
                      onSubmitEditing={() => {}}
                    />
                  </View>
                : null }
              <View style={styles.input}>
                <FloatingLabelInput
                  style={styles.floatingLabel}
                  label={i18n.t('lanLabelStatus')}
                  editable={false}
                  value={this.state.idStatus}
                  minLength={2} maxLength={40}
                  onRef={(ref) => {
                    this.inputs['Status'] = ref;
                  }}
                  onSubmitEditing={() => {}}  
                />
              </View>
              <View style={styles.input}>
                <FloatingLabelInput
                  style={styles.floatingLabel}
                  label={i18n.t('lanLabelChooseIDProof')}
                  value={this.state.filename ? this.state.filename : (this.state.idImagePath ? this.state.idImagePath : ' ')}
                  editable={false}
                />
                <View style={styles.browseIdProof}>
                  <LinearGradient colors={['#025d8c', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} >
                    <AwesomeButton block success
                      onPress={this._pickImage}
                      width={80} height={30} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                      <Text style={styles.BtnBrowseText} >{i18n.t('lanCommonButtonBrowse')}</Text>
                    </AwesomeButton>
                  </LinearGradient>
                </View>
              </View>
              <Text style={{ color: 'red', fontFamily: 'Roboto_medium', fontSize: 11 }}>{this.state.errorMessage}</Text>
                <View style={styles.getCenterView} >
                  <LinearGradient colors={['#025d8c', '#01a4a2']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                  {!this.state.submitDisabled
                    ? <AwesomeButton block success
                        onPress={() => this.handleCreateData(this.state.image)}
                        width={DEVICE_WIDTH/3} height={44} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={22} marginTop={20}>
                        <Text style={styles.BtnText} >{this.state.idProofSatus ? i18n.t('lanCommonButtonClose') : i18n.t('lanCommonButtonCreate')}</Text>
                      </AwesomeButton>
                    : <AwesomeButton block success
                        disabled={true}
                        onPress={() => this.handleCreateData(this.state.image)}
                        width={DEVICE_WIDTH/3} height={44} backgroundColor='#ddd' backgroundShadow='#ddd' backgroundDarker='#ddd' paddingHorizontal={50} borderRadius={22} marginTop={20}>
                      <Text style={styles.BtnText} >{this.state.idProofSatus ? i18n.t('lanCommonButtonClose') : i18n.t('lanCommonButtonCreate')}</Text>
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
