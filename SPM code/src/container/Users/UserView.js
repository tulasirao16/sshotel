import React from 'react';
import { AsyncStorage, ActivityIndicator, Text,  View, StatusBar, Dimensions, TouchableHighlight, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Icon, List, ListItem, Left, Body, Right, Thumbnail, Button} from 'native-base';
import { observer, inject } from 'mobx-react';
import Modal from 'react-native-modal';
import styles from './css/UserViewCss';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from 'react-native-really-awesome-button';
import moment from 'moment';
import i18n from 'i18n-js';
import Toast, { DURATION } from 'react-native-easy-toast';

const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['UserStore'])
@observer
export default class UserView extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      isDeleteModalVisible: false,
      loading: false,
      reload: false,
      reloadFunction: ''
    };
    this.handleEditUser = this.handleEditUser.bind(this)
    this.handleDeleteUser = this.handleDeleteUser.bind(this)
  }

  handleEditUser(data) {
    const navigation = this.props.navigation;
    navigation.navigate('EditUser', { data: data })
  }

  handleDeleteUser(data) {
    const UserStore = this.props.UserStore;
    let usersListData = UserStore.UsersListingData;
    const navigation = this.props.navigation;
    this.setState({ isDeleteModalVisible: false, loading: true })
    let userData = {
      _id: data._id,
      mobileNumber: data.mobileNumber,
      email: data.email,
      userAccount: data.userAccount
    };
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false });
    }, 10000);
    UserStore.deleteSPUserData(userData, function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
      if (resObj.statusCode == '0000') {
        const index = usersListData.findIndex(dataObj => dataObj._id === data._id);
        usersListData.splice(index, 1);
        UserStore.UsersListingData = usersListData;
        navigation.navigate('UsersList');
      } else {
        // alert(i18n.t('lanErrorFailure'));
        _this.refs.toast.show(i18n.t('lanErrorFailure'));
      }
    });
  }

  render() {
    const navigation = this.props.navigation;
    let data = navigation.state.params.data;
    let dob = data.dob ? moment(data.dob).format('LL') : '';
    let deleteIcon = data.userAccount == navigation.state.params.authObj.userAccount ? false : true
    return (
          <View style={styles.container}>
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
              <StatusBar barStyle='light-content' />
              <View style={styles.status} />
              <View style={styles.headerMainView} >
                <View style={styles.headerLeft} >
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()} >
                    <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
                  </TouchableHighlight>
                </View>
                <View style={styles.headerBody} >
                  <Text style={styles.headerTitleStyle}> {data.spServiceProvider}</Text>
                </View>
                <View style={styles.headerRight} >
                  <View style={{ flex: 1 }}>
                    <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.handleEditUser(data)} >
                      <Icon name='create' style={styles.iconEditStyle} />
                    </TouchableHighlight>
                  </View>
                  <View style={{ flex: 1 }}>
                    {data.userType == 'Employee' ? !deleteIcon ? null :
                      <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.setState({ isDeleteModalVisible: true })} >
                        <Icon name='ios-trash' style={styles.iconDeleteStyle} />
                      </TouchableHighlight> : null}
                  </View>
                </View>
              </View>
            </LinearGradient>
            {this.state.loading
              ? <View style={styles.activeIndicatorView}><ActivityIndicator color="#FFFFFF" size='large' style={styles.activeIndicatorStyle} /></View>
              : null}
            <View style={styles.bodyContainer}>
              <ScrollView>
                <View style={styles.bodyContent} >
                  <View style={styles.floatingInputView}>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelFirstName')}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularTextFontSize, styles.regularFontStyle]}>{data.firstName}</Text>
                    </View>
                  </View>

                  <View style={styles.floatingInputView}>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelLastName')}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularTextFontSize, styles.regularFontStyle]}>{data.lastName}</Text>
                    </View>
                  </View>

                  <View style={styles.floatingInputView}>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelDisplayName')}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularTextFontSize, styles.regularFontStyle]}>{data.displayName}</Text>
                    </View>
                  </View>

                  <View style={styles.floatingInputView}>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelUserDOB')}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularTextFontSize, styles.regularFontStyle]}>{data.dob ? dob : ''}</Text>
                    </View>
                  </View>

                  <View style={styles.floatingInputView}>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelMobile')}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularTextFontSize, styles.regularFontStyle]}>{data.mobileNumber}</Text>
                    </View>
                  </View>

                  <View style={styles.floatingInputView}>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelAlternateMobile')}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularTextFontSize, styles.regularFontStyle]}>{data.alternateContactNumber ? data.alternateContactNumber : ''}</Text>
                    </View>
                  </View>

                  <View style={styles.floatingInputView}>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelEmail')}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularTextFontSize, styles.regularFontStyle]}>{data.email}</Text>
                    </View>
                  </View>

                  <View style={styles.floatingInputView}>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelAlternateEmail')}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularTextFontSize, styles.regularFontStyle]}>{data.alternateEmail}</Text>
                    </View>
                  </View>


                  <View style={styles.floatingInputView}>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelUserId')}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularTextFontSize, styles.regularFontStyle]}>{data.userAccount}</Text>
                    </View>
                  </View>

                  <View style={styles.floatingInputView}>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelUserRole')}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularTextFontSize, styles.regularFontStyle]}>{data.userRole}</Text>
                    </View>
                  </View>

                  <View style={styles.floatingInputView}>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularFontSize, styles.regularFontStyle]}>{i18n.t('lanLabelUserStatus')}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.regularTextFontSize, styles.regularFontStyle]}>{data.userStatus}</Text>
                    </View>
                  </View>

                </View>
                <View style={styles.btnModal} >
                  <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                    <AwesomeButton block success
                      onPress={() => navigation.goBack()}
                      width={DEVICE_WIDTH / 3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} marginTop={20} >
                      <Text style={styles.BtnText}>{i18n.t('lanCommonButtonDone')}</Text>
                    </AwesomeButton>
                  </LinearGradient>
                </View>
              </ScrollView>
              <Modal isVisible={this.state.isDeleteModalVisible}>
                <View style={styles.modalView}>
                  <View style={styles.modalContainerStyles}>
                    <View style={styles.txtInfoViewStyle}>
                      <Text style={styles.txtInfo}>{i18n.t('lanLabelConfirmNoteBeforeDelete')}</Text>
                    </View>
                    <View style={styles.btnsParentView} >
                      <View style={styles.eachBtnView} >
                        <Button onPress={() => this.handleDeleteUser(data)} style={styles.btnStyle}>
                          <Text style={styles.btnTxt} >{i18n.t('lanCommonButtonDelete')}</Text>
                        </Button>
                      </View>
                      <View style={styles.eachBtnView} >
                        <Button onPress={() => this.setState({ isDeleteModalVisible: false })} style={styles.cancelBtn} >
                          <Text style={styles.btnTxt}>{i18n.t('lanCommonButtonCancel')}</Text>
                        </Button>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
            <Toast
                ref='toast'
                style={{ backgroundColor: 'red', width: '100%', borderRadius: 0, padding: 10, }}
                position='top'
                positionValue={80}
                fadeInDuration={750}
                fadeOutDuration={1000}
                // opacity={0.8}
                borderRadius={0}
                textStyle={{ color: 'white', fontFamily: 'Roboto_medium', }}
              />
          </View>
    );
  }
}