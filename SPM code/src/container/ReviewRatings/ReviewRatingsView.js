import React from 'react';
import { View, ActivityIndicator, Text, Button, TouchableOpacity, TouchableHighlight, TextInput, StatusBar, Dimensions, Keyboard, Image, BackHandler } from 'react-native';
import StarRating from 'react-native-star-rating';
import { Icon, Card, CardItem, Switch, Left, Body, Right } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './css/ReviewRatingsViewCss';
import { observer, inject } from 'mobx-react';
import ToggleSwitch from 'toggle-switch-react-native';
import i18n from 'i18n-js';
import AwesomeButton from 'react-native-really-awesome-button';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['SPStore'])
@observer
export default class RatingViewScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };

  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    let rateHostList = navigation.state.params && navigation.state.params.rateHostList ? navigation.state.params.rateHostList : [];
    this.state = {
      starCount: 0,
      show: true,
      reviewHeadline: '',
      reviewComments: '',
      rateHostList: rateHostList,
      spServiceProvider: rateHostList.spServiceProvider,
      area: rateHostList.spLocationId.area,
      bookingCode: rateHostList.bookingCode,
      reviewHeadline: rateHostList.reviewHeadline,
      reviewComments: rateHostList.reviewComments,
      reviewStatus: rateHostList.reviewStatus,
      _id: rateHostList._id,
      rateHostreviewHeadline: rateHostList ? rateHostList.reviewHeadline : '',
      rateHostreviewComments: rateHostList ? rateHostList.reviewComments : '',
      rating: rateHostList ? rateHostList.rating : '',
      handleButton: false,
      // allRatings: [],
      toggle: false,
      reload: false,
      reloadFunction: '',
      loading: false
    };
  }
  // componentWillMount() {
  // }
  componentWillUnmount() {
    this.backHandler.remove()
  }
  goBack = () => {
    this.props.navigation.navigate('ReviewRatingsListScreen', { searchString: '' })
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      const navigation = this.props.navigation;
      navigation.goBack()
      return true
    })
  }
  handleToggle = (isOn, reviewId, reviewStatus) => {
    const SPStore = this.props.SPStore;
    const navigation = this.props.navigation;
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'handleToggle' });
    }, 10000);
    if (reviewStatus == 'Active') {
      SPStore.getstatusRatings(reviewId, 'Inactive', function (resObj) {
        clearTimeout(isLoading)
        _this.setState({ loading: false, rateHostList: resObj.statusResult, reviewStatus: resObj.statusResult.reviewStatus })
      })
    } else {
      SPStore.getstatusRatings(reviewId, 'Active', function (resObj) {
        clearTimeout(isLoading)
        _this.setState({ loading: false, rateHostList: resObj.statusResult, reviewStatus: resObj.statusResult.reviewStatus })
      })
    }
  }

  handleReload = () => {
    switch (this.state.reloadFunction) {
      case 'handleToggle':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleToggle()
        break;
      default:
        break;
    }
  }
  render() {
    const navigation = this.props.navigation;
    let rateHostList = navigation.state.params.rateHostList;
    let bookingHistoryData = navigation.state.params.data;
    return (
      !this.state.reload
      ? <View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft} >
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.goBack()}>
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
              </TouchableHighlight>
            </View>
            <View style={styles.headerBody} >
              <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleHotelsRatingsAndReviews')}</Text>
            </View>
            <View style={styles.headerRight}>
              {/* <Icon name='ios-search' onPress={() => this.searchHeader.show()} style={styles.iconMenuStyle} /> */}
            </View>
          </View>
        </LinearGradient>
        <View>
          {this.state.loading
          ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#ffffff' size='large' style={styles.activeIndicatorStyle} /></View>
          : null}
        </View>
        <View style={styles.businessNameView} >
          <Card style={styles.cardBusiness}>
            <CardItem style={styles.cardItemBusinessStyle}>
              <Left style={styles.leftImageView}>
                <View style={styles.imageBox} >
                  <Image source={require('../../../assets/dummy_property.jpg')} style={styles.imgStyle} />
                </View>
                <Body>
                  <View style={styles.floatingInputView} >
                    <Text style={styles.propertyTitle}> {this.state.spServiceProvider} </Text>
                    <Text style={styles.titleType}>{i18n.t('lanTitleHotelsRatingsAndReviews')}</Text>
                  </View>
                </Body>
              </Left>
            </CardItem>
          </Card>
        </View>
        <View style={styles.content}>
          <Card style={styles.card}>
            <View>
              <CardItem style={styles.cardItem}>
                <View style={styles.listItem}>
                  <Text style={styles.serviceTitle}>{this.state.spServiceProvider}, {this.state.area ? this.state.area : ''} </Text>
                </View>
              </CardItem>
              <CardItem style={styles.cardItem}>
                <View style={styles.listMain}>
                  <View>
                    <Text style={styles.textLabel}>{i18n.t('lanLabelBookingCode')}</Text>
                    <Text style={styles.bookingText}>{this.state.bookingCode} </Text>
                  </View>
                </View>
              </CardItem>
              <CardItem style={styles.cardItem}>
                <View style={styles.listMain}>
                  <View style={styles.leftView}>
                    <Text style={styles.textLabel}>{i18n.t('lanLabelRating')}</Text>
                    <StarRating
                      disabled={true}
                      starStyle={{ fontSize: 15 }}
                      containerStyle={{ width: 80 }}
                      fullStarColor='#f7931e'
                      maxStars={5}
                      rating={this.state.rating}
                      selectedStar={(rating) => this.onStarRatingUpdate(rating)}
                    />
                  </View>
                  <View style={styles.rightView}>
                    <ToggleSwitch
                      isOn={this.state.reviewStatus == 'Active' ? true : false}
                      onColor='#5cb85c'
                      offColor='#e6e6e6'
                      labelStyle={{ color: 'black', fontWeight: '600' }}
                      size='small'
                      onToggle={(isOn) => this.handleToggle(isOn, this.state._id, this.state.reviewStatus)}
                    />
                  </View>
                </View>
              </CardItem>
              <CardItem style={styles.cardItem}>
                <View style={styles.listItem}>
                  <View>
                    <Text style={styles.textLabel}>{i18n.t('lanLabelReviewHeadline')}</Text>
                  </View>
                  <View>
                    <Text style={styles.bookingText}>{this.state.rateHostreviewHeadline}</Text>
                  </View>
                </View>
              </CardItem>
              <CardItem style={styles.cardItem}>
                <View style={styles.listItem}>
                  <View>
                    <Text style={styles.textLabel}>{i18n.t('lanLabelReviewComments')}</Text>
                  </View>
                  <View>
                    <Text style={styles.bookingText}>{this.state.rateHostreviewComments}</Text>
                  </View>
                </View>
              </CardItem>
            </View>
          </Card>
        </View>
      </View>
      : <View>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <View style={styles.headerMainViewReload} >
            <View style={styles.headerLeftReload} >
              <TouchableOpacity>
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => navigation.goBack()} />
              </TouchableOpacity>
            </View>
            <View style={styles.headerBodyReload} >
              <TouchableOpacity>
                <Text style={styles.headerTitleStyle}>{i18n.t('lanAppTitle')}</Text>
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
