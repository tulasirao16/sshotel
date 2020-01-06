import React from 'react';
import { ActivityIndicator, BackHandler, Text, View, Platform, ScrollView, Dimensions, ImageBackground, TouchableOpacity, Image, StatusBar, RefreshControl } from 'react-native';
import { Button, Icon, Container, Content, List, ListItem, Left, Body, Right, Footer } from 'native-base';
import { observer, inject } from 'mobx-react';
import styles from './css/FavouritesScreenCss';
import { LinearGradient } from 'expo-linear-gradient';
import StarRating from '../../components/starRating/StarRatingCompont';
import SearchBar from 'react-native-searchbar';
import i18n from 'i18n-js';
import AwesomeButton from 'react-native-really-awesome-button';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

@inject(['FavoriteStore'])
@observer
export default class FavouritesScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props)
    this.state ={
      activePage: 1,
      loading: false,
      reload: false,
      reloadFunction: '',
      param1: null,
      search: '',
      isFavourite: true,
      refreshing: false
    }
    this.handleFavouriteView = this.handleFavouriteView.bind(this);
    this.handleUnfavourite = this.handleUnfavourite.bind(this);
  }
  componentWillMount() {
    const FavoriteStore = this.props.FavoriteStore;
    const navigation = this.props.navigation;
    let _this = this
    this.setState({ loading : true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading : false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    FavoriteStore.getSPFavoriteUsers(1, '', function (resObj) {
      clearTimeout(isLoading)
      if(resObj.statusCode == '9999') {
        _this.setState({ loading: false })
        navigation.navigate('InformationScreen');
      }  else {
        _this.setState({ loading: false })
      }
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  _onRefresh = () => {
    const FavoriteStore = this.props.FavoriteStore;
    const navigation = this.props.navigation;
    let _this = this
    this.setState({ loading : true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading : false, reload: true, reloadFunction: '_onRefresh' });
    }, 10000);
    FavoriteStore.getSPFavoriteUsers(1, '', function (resObj) {
      clearTimeout(isLoading)
      if(resObj.statusCode == '9999') {
        _this.setState({ activePage: 1, loading: false  })
        navigation.navigate('InformationScreen');
      }  else {
        _this.setState({ loading: false, activePage: 1 })
      }
    });
  }
  handleBackButtonClick = () => {
    const navigation = this.props.navigation;
    navigation.goBack();
    return true;
  }


  handleSearchChange(search) {
    this.setState({search: search})
    const FavoriteStore = this.props.FavoriteStore;
    let _this = this
    FavoriteStore.getSPFavoriteUsers(1, search, function (resObj) {
      if(resObj.statusCode == '9999') {
        navigation.navigate('InformationScreen');
      }  else {
        _this.setState({ loading: false })
      }
    });
  }

  handleFavouriteView (data) {
    const navigation = this.props.navigation;
    navigation.navigate('FavouriteViewScreen', { data: data})
  }

  handleScrollEnd = (e) => {
    const FavoriteStore = this.props.FavoriteStore;
    var offset = e.nativeEvent.contentOffset.y;
    var height = e.nativeEvent.contentSize.height;
    if(!this.state.loading && (this.layoutHeight + offset) >= height) {
      if(FavoriteStore.SPFavouritesDataCount > FavoriteStore.SPFavouritesData.length) {
        const num = this.state.activePage + 1;
        let _this = this;
        this.setState({ loading : true });
        let isLoading = setTimeout(function () {
         _this.setState({ loading : false, reload: true, reloadFunction: 'handleScrollEnd', param1: e });
        }, 10000);
        FavoriteStore.getSPFavoriteUsers(num, _this.state.search, function (resObj) {
          clearTimeout(isLoading)
          _this.setState({ activePage: num});
          if(resObj.statusCode == '9999') {
            _this.setState({ loading: false })
            navigation.navigate('InformationScreen');
          }  else {
            _this.setState({ loading: false })
          }
        });
      }
    }
  }
  handleUnfavourite (data) {
    const FavoriteStore = this.props.FavoriteStore;
    let favListData = FavoriteStore.SPFavouritesData;
    let put_json = {
      spPropertyId: data.spPropertyId._id,
      userID: data.euUserId._id,
      recordID: data._id
    }
    let _this = this;
    this.setState({ loading : true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading : false, reload: true, reloadFunction: 'handleUnfavourite', param1: data  });
    }, 10000);
    FavoriteStore.unfavouriteUserFromFavourite(put_json, function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '0000') {
        const index = favListData.findIndex(dataObj => dataObj._id === data._id);
        favListData[index].status = 'Unfavourite'
        FavoriteStore.SPFavouritesData = favListData;
        _this.setState({ isFavourite: false, loading: false });
      } else {
        _this.setState({ loading: false });
      }
    });
  }
  handleFavourite (data) {
    const FavoriteStore = this.props.FavoriteStore;
    let favListData = FavoriteStore.SPFavouritesData;
    let put_json = {
      spPropertyId: data.spPropertyId._id,
      userID: data.euUserId._id,
      recordID: data._id
    }
    let _this = this;
    this.setState({ loading : true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading : false, reload: true, reloadFunction: 'handleFavourite', param1: data });
    }, 10000);
    FavoriteStore.setUserAsFavourite(put_json, function (resObj) {
      clearTimeout(isLoading)
      if (resObj.statusCode == '0000') {
        const index = favListData.findIndex(dataObj => dataObj._id === data._id);
        favListData[index].status = 'Favourite'
        FavoriteStore.SPFavouritesData = favListData;
        _this.setState({ isFavourite: true, loading: false});
      } else {
        _this.setState({ loading: false});
      }
    });
  }
  handleSearchBackClick = () => {
    this.handleSearchChange('')
    this.searchBar.hide()
  }
  handleReload = () => {
    switch(this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount('reload')
        break;
      case '_onRefresh':
        this.setState({ reload: false, reloadFunction: '' });
        this._onRefresh('reload')
        break;
      case 'handleScrollEnd':
        this.setState({ reload: false, reloadFunction: ''})
        this.handleScrollEnd(this.state.param1)
        break;
      case 'handleUnfavourite':
        this.setState({ reload: false, reloadFunction: ''})
        this.handleUnfavourite(this.state.param1)
        break;
      case 'handleFavourite':
        this.setState({ reload: false, reloadFunction: ''})
        this.handleFavourite(this.state.param1)
        break;
      default:
        break;
    }
  }
  render() {
    const FavoriteStore = this.props.FavoriteStore;
    const navigation = this.props.navigation;
    return ( 
       !this.state.reload
      ?<View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={ styles.headerMainView } >
            <View style={styles.headerLeft} >
                <Icon name='ios-menu' style={styles.iconMenuStyle} onPress={() => this.props.navigation.openDrawer()} />
            </View>
            <View style={styles.headerBody} >
                <Text style={styles.headerTitleStyle}> {i18n.t('lanTitleFavourites')} </Text>
            </View>
            <View style={styles.headerRight}>
              <Icon name='ios-search' style={[styles.iconMenuStyle, styles.iconGap ]} onPress={() => this.searchBar.show()}/>
              <Icon name='md-home' style={styles.iconMenuStyle} onPress={() => navigation.navigate('DashboardScreen')}/>
            </View>
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
              onHide ={() => this.handleSearchChange('')}
              onSearch={async (text) => {
                if (text) {
                  this.handleSearchChange(text.nativeEvent.text)
                } else {
                  return [];
                }
              }}
            />
          </View> */}
           <View style={{position:'absolute', top:Platform.OS === 'ios' ? 28 : 21 }}>
            <SearchBar
              ref={(ref) => this.searchBar = ref}
              showOnLoad = {false}
              iOSPadding={false}
              iOSHideShadow={true}
              placeholder='Search...'
              placeholderTextColor='gray'
              handleChangeText={(input) => this.handleSearchChange(input)}
              onBack={() => this.handleSearchBackClick('')}
            />
          </View>
        </LinearGradient>
        {this.state.loading
        ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#ffffff' size='large' style={ styles.activeIndicatorStyle } /></View>
        : null}
        <ScrollView  
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        } onLayout={event => {this.layoutHeight = event.nativeEvent.layout.height;}} onScrollEndDrag={this.handleScrollEnd}>
          {(FavoriteStore.SPFavouritesData && FavoriteStore.SPFavouritesData.length > 0) ? FavoriteStore.SPFavouritesData.map((data, i) => {
          return (
            <View style={styles.content} key={i}>
              <TouchableOpacity onPress={() => this.handleFavouriteView(data)} >
               <View style={styles.list} >
                 <View style={styles.left}>
                   <Image source={require('../../../assets/user-fav.png')} style={styles.thumbImg} />
                 </View>
                 <View style={styles.body}>
                   <Text style={styles.textBig}>{data.euUserId.displayName}</Text>
                   <Text style={styles.textNote}><Icon name='ios-phone-portrait' style={{ fontSize: 12, color: '#f7931e' }} />{data.euUserId.mobileNumber}</Text>
                   <Text style={styles.textNote}><Icon name='ios-mail' style={{ fontSize: 12, color: '#f7931e' }} />{data.euUserId.email}</Text>
                   <Text style={styles.textSmall}>{data.spPropertyId.propertyTitle} </Text>
                   <Text style={styles.textNote}><Icon name='pin' style={{ fontSize: 12, color: '#01a4a1',  }} /> {data.spPropertyId.spLocationObj.area}, {data.spPropertyId.spLocationObj.city}</Text>
                 </View>
                 <View style={styles.right}>
                   {data.status == 'Favourite'? <Button transparent style={styles.favIcon} onPress={() => this.handleUnfavourite(data)}><Icon name='heart' style={ styles.favHeartStyle } /></Button> : <Button transparent style={styles.favIcon} onPress={() => this.handleFavourite(data)}><Icon name='heart-empty' style={ styles.favHeartStyle } /></Button>}
                 </View>
               </View>
             </TouchableOpacity>
            </View>
          )
          }) : <View style={ styles.noDataViewStyle }><Text style={ styles.noUser }>{i18n.t('lanLabelNoFavourites')}</Text></View>}
        </ScrollView>}
      </View>
      : <View>
        <LinearGradient colors={['#01A4A2', '#025D8C']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <View style={styles.headerMainViewReload} >
            <View style={styles.headerLeftReload} >
              <TouchableOpacity>
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => navigation.goBack()} />
              </TouchableOpacity>
            </View>
            <View style={styles.headerBodyReload} >
              <TouchableOpacity>
                <Text style={styles.headerTitleStyle1}>{i18n.t('lanAppTitle')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        <View style={{ jflex:1, justifyContent:'center', alignItems:'center', width:DEVICE_WIDTH - 20, height:Device_Height - 150}} >
          <View style={ styles.eachBtnView } >
            <LinearGradient colors={['#01A4A2', '#025D8C']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
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
    );
  }
}

