import React from 'react';
import { View, TextInput, Animated, Keyboard, Dimensions, TouchableOpacity, ActivityIndicator, ScrollView, Image, BackHandler, UIManager, StatusBar, Platform } from 'react-native';
import { Icon, Text, Picker, Card, CardItem, Body, Left, Right, Switch } from 'native-base';
import { observer, inject } from 'mobx-react';
import styles from './css/CreatePropertyCss';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import RadioButton from 'radio-button-react-native';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import { PUBLIC_DOMAIN } from '../../../constants';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const { State: TextInputState } = TextInput;

@inject(['PropertyStore'])
@observer
export default class CreateProperty extends React.Component {
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
      value: '',
      selected: "key0",
      propertyID: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData._id : '',
      propertyTitle: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyTitle : '',
      propertyType: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.propertyType : '',
      propertyImage: navigation.state.params && navigation.state.params.propertyData && navigation.state.params.propertyData.imagePath ? navigation.state.params.propertyData.imagePath : '',
      propertyArea: navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData.spLocationObj.area : '',
      roomType: '',
      rentType: '',
      roomCategory: '',
      roomName: '',
      adultCapacity: '',
      childCapacity: '',
      roomsCount: '',
      activeRooms: '',
      singleBeds: '',
      doubleBeds: '',
      bathRooms: '',
      halls: '',
      numACs: '',
      kitchens: '',
      guestRuleNote: '',
      status: true,
      isloading: false
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
  }

  focusNextField(id) {
    this.inputs[id].focus();
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
  onValueChange(value) {
    this.setState({
      selected: value
    });
  }
  render() {
    const navigation = this.props.navigation;
    const { shift } = this.state;
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.container, { transform: [{ translateY: shift }] }]}>
          <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <StatusBar barStyle='light-content' />
            <View style={styles.status} />
            <View style={styles.headerMainView} >
              <View style={styles.headerLeft} >
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
                </TouchableOpacity>
              </View>
              <View style={styles.headerBody} >
                <Text style={styles.headerTitleStyle}> {i18n.t('lanLabelEditProperty')} </Text>
              </View>
            </View>
          </LinearGradient>
          <View style={styles.bodyContainer} >
            <View style={styles.imageView}>
              <Image source={require('../../../assets/dummy_property.jpg')} style={styles.imageStyle} />
              <View style={styles.plusCircle}>
                <Icon name="add" style={styles.plusIcon} />
              </View>
            </View>
            <View style={styles.scrollInfoView} >
              <ScrollView>
                <View style={[styles.floatingInputView, styles.floatingInputViewOne]} >
                  <Text style={[styles.pickerLabel]} >{i18n.t('lanLabelSelectPropertyType')}<Text style={styles.required}>*</Text></Text>
                  <View style={{ borderBottomWidth: 1, borderBottomColor: '#01a4a2', marginTop: -5.5 }} >
                    <Picker
                      note
                      mode='dialog'
                      style={{ width: DEVICE_WIDTH - 90 }}
                      selectedValue={this.state.state}
                      onValueChange={this.handle}
                    >
                      <Picker.Item label= "Sharing" value='Sharing' />
                      <Picker.Item label= "Private"  value='Private' />
                      <Picker.Item label= "Individual" value='Individual' />
                      <Picker.Item label= "1 BHK" value='1 BHK' />
                    </Picker>
                  </View>
                </View>
                <View style={styles.floatingInputView} >
                  <FloatingLabelInput
                    label= {i18n.t('lanLabelPropertyName')}
                    value=''
                    onChangeText={(text) => this.setState({ propertyName: text, errorMessage: '' })}
                    returnKeyType = { 'next' }
                    onRef={(ref) => {
                      this.inputs['Property Name'] = ref;
                    }}
                    onSubmitEditing={() => {
                        this.focusNextField('Adult Capacity');
                    }}  
                  />
                </View>
                <View style={styles.DateGenderView}>
                  <View style={[styles.floatingInputView, styles.DatePicker]} >
                    <FloatingLabelInput
                      label= {i18n.t('lanLabelAdultsCapacity')}
                      value={this.state.adultCapacity.toString()}
                      keyboardType='numeric'
                      onChangeText={(text) => this.setState({ adultCapacity: text, errorMessage: '' })}
                      returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                      onRef={(ref) => {
                        this.inputs['Adult Capacity'] = ref;
                      }}
                      onSubmitEditing={() => {
                          this.focusNextField('Child Capacity');
                      }}  
                    />
                  </View>
                  <View style={[styles.floatingInputView, styles.genderView]}>
                    <FloatingLabelInput
                      label=  {i18n.t('lanLabelChildCapacity')}
                      value={this.state.childCapacity.toString()}
                      keyboardType='numeric'
                      onChangeText={(text) => this.setState({ childCapacity: text, errorMessage: '' })}
                      returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                      onRef={(ref) => {
                        this.inputs['Child Capacity'] = ref;
                      }}
                      onSubmitEditing={() => {
                          this.focusNextField('Rooms Count');
                      }}  
                    />
                  </View>
                </View>

                <View style={styles.DateGenderView}>
                  <View style={[styles.floatingInputView, styles.DatePicker]} >
                    <FloatingLabelInput
                      label= {i18n.t('lanLabelRoomsCount')}
                      value={this.state.roomsCount.toString()}
                      onChangeText={(text) => this.setState({ roomsCount: text, errorMessage: '' })}
                      keyboardType='numeric'
                      returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                      onRef={(ref) => {
                        this.inputs['Rooms Count'] = ref;
                      }}
                      onSubmitEditing={() => {
                          this.focusNextField('Active Room');
                      }}  
                    />
                  </View>
                  <View style={[styles.floatingInputView, styles.genderView]}>
                    <FloatingLabelInput
                      label=  {i18n.t('lanLabelActiveRoom')}
                      value={this.state.activeRooms.toString()}
                      keyboardType='numeric'
                      onChangeText={(text) => this.setState({ activeRooms: text, errorMessage: '' })}
                      returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                      onRef={(ref) => {
                        this.inputs['Active Count'] = ref;
                      }}
                      onSubmitEditing={() => {
                          this.focusNextField('Single Beds');
                      }}  
                    />
                  </View>
                </View>

                <View style={styles.DateGenderView}>
                  <View style={[styles.floatingInputView, styles.DatePicker]} >
                    <FloatingLabelInput
                      label=  {i18n.t('lanLabelSingleBeds')}
                      keyboardType='numeric'
                      value={this.state.singleBeds.toString()}
                      onChangeText={(text) => this.setState({ singleBeds: text, errorMessage: '' })}
                      returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                      onRef={(ref) => {
                        this.inputs['Single Beds'] = ref;
                      }}
                      onSubmitEditing={() => {
                          this.focusNextField('Double Beds');
                      }}
                    />
                  </View>
                  <View style={[styles.floatingInputView, styles.genderView]}>
                    <FloatingLabelInput
                      label= {i18n.t('lanLabelDoubleBeds')}
                      keyboardType='numeric'
                      value={this.state.doubleBeds.toString()}
                      onChangeText={(text) => this.setState({ doubleBeds: text, errorMessage: '' })}
                      returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                      onRef={(ref) => {
                        this.inputs['Double Beds'] = ref;
                      }}
                      onSubmitEditing={() => {
                          this.focusNextField('Bath Rooms');
                      }}
                    />
                  </View>
                </View>
                <View style={styles.DateGenderView}>
                  <View style={[styles.floatingInputView, styles.DatePicker]} >
                    <FloatingLabelInput
                      label= {i18n.t('lanLabelBathRooms')}
                      keyboardType='numeric'
                      value={this.state.bathRooms.toString()}
                      onChangeText={(text) => this.setState({ bathRooms: text, errorMessage: '' })}
                      returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                      onRef={(ref) => {
                        this.inputs['Bath Rooms'] = ref;
                      }}
                      onSubmitEditing={() => {
                          this.focusNextField('ACs');
                      }}
                    />
                  </View>
                  <View style={[styles.floatingInputView, styles.genderView]}>
                    <FloatingLabelInput
                      label= {i18n.t('lanLabelNoofACs')}
                      keyboardType='numeric'
                      value={this.state.numACs.toString()}
                      onChangeText={(text) => this.setState({ numACs: text, errorMessage: '' })}
                      returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                      onRef={(ref) => {
                        this.inputs['ACs'] = ref;
                      }}
                      onSubmitEditing={() => {
                          this.focusNextField('Kitchens');
                      }}
                    />
                  </View>
                </View>

                <View style={styles.DateGenderView}>
                  <View style={[styles.floatingInputView, styles.DatePicker]} >
                    <FloatingLabelInput
                      label= {i18n.t('lanLabelKitchens')}
                      keyboardType='numeric'
                      value={this.state.kitchens.toString()}
                      onChangeText={(text) => this.setState({ kitchens: text, errorMessage: '' })}
                      returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                      onRef={(ref) => {
                        this.inputs['Kitchens'] = ref;
                      }}
                      onSubmitEditing={() => {
                          this.focusNextField('Halls');
                      }}
                    />
                  </View>
                  <View style={[styles.floatingInputView, styles.genderView]}>
                    <FloatingLabelInput
                      label= {i18n.t('lanLabelHalls')}
                      keyboardType='numeric'
                      value={this.state.halls.toString()}
                      onChangeText={(text) => this.setState({ halls: text, errorMessage: '' })}
                      returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next'}
                      onRef={(ref) => {
                        this.inputs['Halls'] = ref;
                      }}
                      onSubmitEditing={() => {}}
                    />
                  </View>
                </View>
                <Text style={{ color: 'red', fontSize: 11, fontFamily: 'Roboto_medium', paddingHorizontal: 15 }}>{i18n.t('lanErrorAllFieldsAreMandatory')}</Text>

                <View style={styles.btnModal} >
                  <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                    <AwesomeButton block success
                      onPress={() => this.handleNext()}
                      width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} marginTop={20} >
                      <Text style={styles.BtnText}>{i18n.t('lanButtonCreate')}</Text>
                    </AwesomeButton>
                  </LinearGradient>
                </View>
                <View style={styles.errorView} >
                  <Text style={styles.errorTxt}>{this.state.errorMessage}</Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }
}
