import React from 'react';
import { Text, View, Platform, ScrollView, Dimensions, ActivityIndicator, ImageBackground, TouchableOpacity, Image, StatusBar } from 'react-native';
import { Button, Icon, Container, Content, List, ListItem, Left, Body, Right, Footer } from 'native-base';
import styles from './css/FavouritesScreenCss';
import { observer, inject } from 'mobx-react';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';
import StarRating from '../../components/starRating/StarRatingCompont';
import AwesomeButton from 'react-native-really-awesome-button';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['FavoriteStore'])
@observer
export default class FavouriteViewScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      isDeleteModalVisible :  false,
      errorMessage: '',
      loading: false
    };
    this.handleDeleteUser = this.handleDeleteUser.bind(this)
  }

  handleDeleteUser (data) {
    const FavoriteStore = this.props.FavoriteStore;
    const navigation = this.props.navigation;
    this.setState({isDeleteModalVisible: false})
    let favListData = FavoriteStore.SPFavouritesData;
    let put_json = {
      spPropertyId: data.spPropertyId._id,
      userID: data.euUserId._id,
      recordID: data._id
    }
    let _this = this;
    this.setState({ loading : true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading : false });
    }, 10000);
    FavoriteStore.deleteUserFromFavourite(put_json, function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '0000') {
        _this.setState({ loading: false })
        const index = favListData.findIndex(dataObj => dataObj._id === data._id);
        favListData.splice(index, 1);
        FavoriteStore.SPFavouritesData = favListData;
        navigation.navigate('FavouritesScreen');
      } else {
        _this.setState({loading: false, errorMessage: '' })
      }
    });
  }
  render() {
    const navigation = this.props.navigation;
    let data = navigation.state.params.data;
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={ styles.headerMainView } >
            <View style={styles.headerLeft} >
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => navigation.goBack()} />
            </View>
            <View style={styles.headerBody} >
                <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleFavouriteView')} </Text>
            </View>
            <View style={styles.headerRight}>
              <Icon name='ios-trash' style={styles.iconMenuStyle} onPress={()=> this.setState({isDeleteModalVisible: true})}/>
            </View>
          </View>
        </LinearGradient>
        {this.state.loading
          ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#ffffff' size='large' style={ styles.activeIndicatorStyle } /></View>
          : null}
        <ScrollView>
          <View style={styles.favViewContent}>
            <View style={styles.favViewList} >
              <View style={styles.left}>
                <Image source={require('../../../assets/user-fav.png')} style={styles.thumbImg} />
              </View>
              <View style={styles.body}>
                <Text style={styles.textBig}>{data.euUserId.displayName}</Text>
                <Text style={styles.textNote}><Icon name='ios-phone-portrait' style={{ fontSize: 10, color: '#01a4a1',  }} /> {data.euUserId.mobileNumber} </Text>
                <Text style={styles.textSmall}><Icon name='ios-mail' style={{ fontSize: 12, color: '#f7931e' }} />{data.euUserId.email}</Text>
                <Text style={styles.textSmall}>{data.spPropertyId.propertyTitle}</Text>
                <Text style={styles.textSmall}>{i18n.t('lanLabelIndividualHouse')}</Text>
                <Text style={styles.textNote}><Icon name='pin' style={{ fontSize: 12, color: '#01a4a1',  }} /> {data.spPropertyId.spLocationObj.area}, {data.spPropertyId.spLocationObj.city}</Text>
                {/* <View style={styles.ratings}>
                  <StarRating />
                </View> */}
              </View>
              <View style={styles.right}>
                <Button transparent style={styles.favIcon}><Icon name='heart' style={ styles.favHeartStyle } /></Button>
              </View>
            </View>
          </View>
          <Text style={{color: 'red', fontFamily: 'Roboto_light', paddingHorizontal:15}}>{this.state.errorMessage}</Text>
          <View style={{  flexDirection: 'row', justifyContent: 'center', paddingTop:25 }} >
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={{ borderRadius: 22 }}>
              <AwesomeButton block success
                onPress={() => navigation.goBack()}
                width={DEVICE_WIDTH/3} height={44} backgroundColor='transparent' backgroundShadow='transparent'
                backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22}>
                <Text style={{ color: 'white', fontSize:18, fontFamily:'Roboto_light' }}> {i18n.t('lanButtonDone')} </Text>
              </AwesomeButton> 
            </LinearGradient> 
          </View>
        </ScrollView>
        <Modal isVisible={this.state.isDeleteModalVisible}>
          <View style={ styles.modalView }>
            <View style={ styles.modalContainerStyles}>
              <View style={ styles.txtInfoViewStyle }>
                <Text style={ styles.txtInfo }>{i18n.t('lanLabelAreYouSureYouWantTo')} </Text>
              </View>
              <View style={ styles.btnsParentView } >
                <View style={ styles.eachBtnView } >
                  <Button onPress={() => this.handleDeleteUser(data)}  style={ styles.btnStyle }>
                    <Text style={ styles.btnTxt } > {i18n.t('lanButtonDelete')}</Text>
                  </Button>
                </View>
                <View style={ styles.eachBtnView } >
                  <Button onPress={() =>this.setState({isDeleteModalVisible: false})} style={ styles.cancelBtn } >
                    <Text style={ styles.btnTxt }>{i18n.t('lanButtonCancel')}</Text>
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}