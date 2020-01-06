import React from 'react';
import { ActivityIndicator, View, Text, TouchableWithoutFeedback, StyleSheet, TouchableHighlight, BackHandler, Dimensions, StatusBar, Animated, TouchableOpacity, Platform, ScrollView, RefreshControl, FlatList } from 'react-native';
import { observer, inject } from 'mobx-react';
import { Container, Header, Content, List, ListItem, Card, CardItem, Body, Switch, Icon, Button } from 'native-base';
import styles from './css/ReviewRatingsListCss';
import SearchBar from 'react-native-searchbar';
import { LinearGradient } from 'expo-linear-gradient';
import StarRating from 'react-native-star-rating';
import ToggleSwitch from 'toggle-switch-react-native';
import i18n from 'i18n-js';
import AwesomeButton from 'react-native-really-awesome-button';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['SPStore'])
@observer
export default class ReviewRatingsList extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      rating: 0,
      refreshing: false,
      allRatings: [],
      statusCode: '',
      toggle: false,
      isTimeBased: 'False',
      search: '',
      reload: false,
      reloadFunction: '',
      loading: false,
    }
  }
  componentWillMount() {
    const SPStore = this.props.SPStore;
    const navigation = this.props.navigation;
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    SPStore.getAllReviewRatings('1', '', 'All', function (resObj) {
      clearTimeout(isLoading);
      if (resObj.statusCode == '0000') {
        _this.setState({ statusCode: resObj.statusCode, allRatings: resObj.statusResult.myreviews, loading: false })
      } else {
        _this.setState({ statusCode: resObj.statusCode, allRatings: [], loading: false })
      }
    })
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      const navigation = this.props.navigation;
      navigation.goBack()
      return true;
    });
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }
  handleToggle = (isOn, reviewId, reviewStatus) => {
    const SPStore = this.props.SPStore;
    let _this = this;
    this.setState({ loading: true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false });
    }, 20000);
    if (reviewStatus == 'Active') {
      SPStore.getstatusRatings(reviewId, 'Inactive', function (resObj) {
        if (resObj.statusCode == '0000') {
          SPStore.getAllReviewRatings('1', '', 'All', function (resObj) {
            if (resObj.statusCode == '0000') {
              _this.setState({ loading: false, statusCode: resObj.statusCode, allRatings: resObj.statusResult.myreviews })
            } else {
              _this.setState({ loading: false, statusCode: resObj.statusCode, allRatings: [] })
            }
          })
        }
      })
    } else {
      SPStore.getstatusRatings(reviewId, 'Active', function (resObj) {
        if (resObj.statusCode == '0000') {
          SPStore.getAllReviewRatings('1', '', 'All', function (resObj) {
            if (resObj.statusCode == '0000') {
              _this.setState({ loading: false, statusCode: resObj.statusCode, allRatings: resObj.statusResult.myreviews })
            } else {
              _this.setState({ loading: false, statusCode: resObj.statusCode, allRatings: [] })
            }
          })
        }
      })
    }
  }
  handleSearchChange = (searchString) => {
    const SPStore = this.props.SPStore;
    // this.setState({ loading: true });
    let _this = this;
    // let isLoading = setTimeout(function () {
    //   _this.setState({ loading: false, reload: true, reloadFunction: 'handleSearchChange' });
    // }, 10000);
    SPStore.getAllReviewRatings(1, searchString, 'All', function (resObj) {
      // clearTimeout(isLoading)
      if (resObj.statusCode == '0000') {
        _this.setState({ loading: false, statusCode: resObj.statusCode, allRatings: resObj.statusResult.myreviews })
      } else {
        _this.setState({ loading: false, statusCode: resObj.statusCode, allRatings: [] })
      }
    })
  }
  handleSearchBackClick = (searchString) => {
    this.setState({ refreshing: true })
    const SPStore = this.props.SPStore;
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ refreshing: false, reload: true, reloadFunction: 'handleSearchBackClick' });
    }, 10000);
    SPStore.getAllReviewRatings(1, searchString, 'All', function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '0000') {
        _this.setState({ allRatings: resObj.statusResult.myreviews, refreshing: false })
      } else {
        _this.setState({ allRatings: [], refreshing: false })
      }
    });
    this.searchBar.hide()
  }
  _onRefresh = (searchString) => {
    this.setState({ refreshing: true })
    const SPStore = this.props.SPStore;
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ refreshing: false, reload: true, reloadFunction: '_onRefresh' });
    }, 10000);
    SPStore.getAllReviewRatings(1, searchString, 'All', function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '0000') {
        _this.setState({ allRatings: resObj.statusResult.myreviews, refreshing: false })
      } else {
        _this.setState({ allRatings: [], refreshing: false })
      }
    })
  }
  componentWillReceiveProps() {
    const SPStore = this.props.SPStore;
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillReceiveProps' });
    }, 10000);
    SPStore.getAllReviewRatings('1', '', 'All', function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '0000') {
        _this.setState({ loading: false, statusCode: resObj.statusCode, allRatings: resObj.statusResult.myreviews })
      } else {
        _this.setState({ loading: false, statusCode: resObj.statusCode, allRatings: [] })
      }
    })
  }
  viewRating = (i) => {
    this.props.navigation.navigate('ReviewRatingsViewScreen', { rateHostList: this.state.allRatings[i], statusCode: this.state.statusCode });
  }

  handleReload = () => {
    switch (this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      // case 'handleSearchChange':
      //   this.setState({ reload: false, reloadFunction: '' });
      //   this.handleSearchChange()
      //   break;
      case 'handleSearchBackClick':
        this.setState({ reload: false, reloadFunction: '' });
        this.handleSearchBackClick()
        break;
      case '_onRefresh':
        this.setState({ reload: false, reloadFunction: '' });
        this._onRefresh()
        break;
      case 'componentWillReceiveProps':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillReceiveProps()
        break;
      default:
        break;
    }
  }

  render() {
    const navigation = this.props.navigation;
    const SPStore = this.props.SPStore;
    let ReviewList =
      <View style={{ marginTop: 100, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      </View>;
    if (SPStore.SearchHomeReviewNoMatches) {

      ReviewList = <View style={{ marginTop: 200, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Text>{i18n.t('lanLabelNoMatchesFound')}</Text>
      </View>;
    }
    return (
      !this.state.reload
          ? <View style={styles.container}>
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
              <StatusBar barStyle='light-content' />
              <View style={styles.status} />
              <View style={styles.headerMainView} >
                <View style={styles.headerLeft} >
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.props.navigation.openDrawer()}>
                    <Icon name='ios-menu' style={styles.iconMenuStyle} />
                  </TouchableHighlight>
                </View>
                <View style={styles.headerBody} >
                  <Text style={styles.headerTitleStyle}>{i18n.t('lanLabelRatingsAndReviewsList')} </Text>
                </View>
                <View style={styles.headerRight} >
                  <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()}>
                    <Icon name='ios-search' style={styles.iconSearchStyle} />
                  </TouchableHighlight>
                </View>
              </View>
              <View style={{ position: 'absolute', top: Platform.OS === 'ios' ? 28 : 21 }}>
                <SearchBar
                  ref={(ref) => this.searchBar = ref}
                  handleResults={this._handleResults}
                  showOnLoad={false}
                  iOSPadding={false}
                  iOSHideShadow={true}
                  placeholder={i18n.t('lanLabelSearch')}
                  placeholderTextColor='gray'
                  handleChangeText={(input) => this.handleSearchChange(input)}
                  onBack={(input) => this.handleSearchBackClick(input)}
                />
              </View>
              {/* <View>
            <SearchHeader
              ref={(searchHeader) => {
                this.searchHeader = searchHeader;
              }}
              placeholder='Search...'
              placeholderColor='gray'
              entryAnimation='from-right-side'
              onClear={() => {
                this.handleSearchChange('')
              }}
              onEnteringSearch={async (text) => {
                if (text) {
                  this.handleSearchChange(text.nativeEvent.text)
                } else {
                  return [];
                }
              }}
              onSearch={async (text) => {
                if (text) {
                  this.handleSearchChange(text.nativeEvent.text)
                } else {
                  return [];
                }
              }}
            />
          </View> */}
            </LinearGradient>
            <View>
              {this.state.loading
                ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#FFFFFF' size='large' style={ styles.activeIndicatorStyle } /></View>
                : null
              }
            </View>
            <ScrollView refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
                enabled={true}
              />
            }>
              <View style={styles.content}>
                {this.state.allRatings.length > 0 ?
                  this.state.allRatings.map((data, i) => {
                    return (
                      <TouchableOpacity onPress={() => this.viewRating(i)} key={i}>
                        <Card style={styles.card}>
                          <CardItem style={styles.cardItem}>
                            <View style={styles.listMain}>
                              <Text style={styles.serviceTitle}>{data.spServiceProvider}, {data.spLocationId.area}</Text>
                            </View>
                          </CardItem >
                          <CardItem style={styles.cardItem}>
                            <View style={styles.listMain}>
                              <View style={styles.leftView}>
                                <Text style={styles.textLabel}>{i18n.t('lanLabelBookingCode')}</Text>
                              </View>
                              <View style={styles.rightView}>
                                <Text style={styles.bookingText}>{data.bookingCode}</Text>
                              </View>
                            </View>
                          </CardItem>
                          <CardItem style={styles.cardItem}>
                            <View style={styles.listMain}>
                              <View style={styles.leftView}>
                                <Text style={styles.textLabel}>{i18n.t('lanLabelRating')}</Text>
                              </View>
                              <View style={styles.rightView}>
                                <StarRating
                                  disabled={true}
                                  starStyle={{ fontSize: 15 }}
                                  containerStyle={{ width: 80 }}
                                  fullStarColor='#f7931e'
                                  maxStars={5}
                                  rating={data.rating}
                                  selectedStar={(rating) => this.onStarRatingUpdate(rating)}
                                />
                              </View>
                            </View>
                          </CardItem>
                          <CardItem style={styles.cardItem}>
                            <View style={styles.listMain}>
                              <View style={styles.leftView}>
                                <Text style={styles.textLabel}>{i18n.t('lanLabelReviewHeadline')}</Text>
                              </View>
                              <View style={styles.rightView}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.bookingText}>{data.reviewHeadline}</Text>
                              </View>
                            </View>
                          </CardItem>
                          <CardItem style={styles.cardItem}>
                            <View style={styles.listMain}>
                              <View style={styles.leftView}>
                                <Text style={styles.textLabel}>{i18n.t('lanLabelReviewComments')}</Text>
                              </View>
                              <View style={styles.rightView}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.bookingText}>{data.reviewComments}</Text>
                              </View>
                            </View>
                          </CardItem>
                          <CardItem style={styles.cardItem}>
                            <View style={styles.listMain}>
                              <View style={styles.leftView}>
                                <Text style={styles.textLabel}>{i18n.t('lanLabelReviewStatus')}</Text>
                              </View>
                              <View style={styles.rightView}>
                                <ToggleSwitch
                                  isOn={data.reviewStatus == 'Active' ? true : this.state.isToggle ? true : false}
                                  onColor='#5cb85c'
                                  offColor='#e6e6e6'
                                  labelStyle={{ color: 'black', }}
                                  size='small'
                                  onToggle={(isOn) => this.handleToggle(isOn, data._id, data.reviewStatus)}
                                />
                              </View>
                            </View>
                          </CardItem>
                        </Card>
                      </TouchableOpacity>
                    )
                  })
                  : <View style={styles.nofav}><Text style={styles.nofavTxt}>{i18n.t('lanLabelNoRatings')}</Text></View>}
              </View>
            </ScrollView>
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