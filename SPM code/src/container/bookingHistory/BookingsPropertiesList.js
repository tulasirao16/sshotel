import React from 'react';
import { observer, inject } from 'mobx-react';
import { Dimensions, BackHandler, FlatList, TouchableOpacity, TouchableHighlight, StatusBar,Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { Icon, View, Text, Footer } from 'native-base';
import styles from './css/BookingsPropertiesListCss';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import AwesomeButton from 'react-native-really-awesome-button';
import SearchBar from 'react-native-searchbar';
import EachRowProperty from './EachRowProperty';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const layoutHeight = 0;

@inject(['PropertyStore'])
@observer
export default class BookingsPropertiesList extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      header: null
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      refreshing: false,
      loading: false,
      reload: false,
      reloadFunction: '',
      param1: null,
      search: ''
    };
    // this.Refresh = this.Refresh.bind(this);
    this.handleCreatePropertyList = this.handleCreatePropertyList.bind(this);
  }
  componentWillMount() {
    this.setState({search: '', loading: true})
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    PropertyStore.getSpProperties('1', '', function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
      if(resObj.statusCode == '9999') {
        _this.props.navigation.navigate('InformationScreen')
      }
    });
    _this.setState({ activePage: 1, search: '' })
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }
  handleBackButtonClick = () => {
    const navigation = this.props.navigation
    navigation.goBack()
    return true
  }

  _onRefresh = () => {
    this.setState({ loading: true, search: '' })
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: '_onRefresh' });
    }, 10000);
    PropertyStore.getSpProperties('1', '', function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
      if(resObj.statusCode == '9999') {
        _this.props.navigation.navigate('InformationScreen')
      }
    });
    _this.setState({ activePage: 1 })
  }
  handleAddProperty() {
    navigation = this.props.navigation
    navigation.navigate('PrebuildTemplatesScreen')
  }

  handleSearchChange = (Search) => {
    this.setState({search: Search})
    const PropertyStore = this.props.PropertyStore;
    let _this = this
    PropertyStore.getSpProperties('1', Search, function (resObj) {
    })
    _this.setState({ activePage: 1 })
  }

  handleSearchBackClick = (Search) => {
    const PropertyStore = this.props.PropertyStore;
    let _this = this;
    this.setState({ loading: true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'handleSearchBackClick', param1: Search });
    }, 10000);
    PropertyStore.getSpProperties('1', Search, function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
    })
    this.searchBar.hide()
  }

  handleScrollEnd = (e) => {
    const PropertyStore = this.props.PropertyStore;
    var offset = e.nativeEvent.contentOffset.y,
      height = e.nativeEvent.contentSize.height;
    if ((this.layoutHeight + offset) >= height) {
      if (PropertyStore.totalPropertiesCount > PropertyStore.PropertiesList.length) {
        this.setState({ loading: true });
        const num = this.state.activePage + 1;
        if (num) {
          this.setState({ activePage: num, loading: true });
          let _this = this;
          let isLoading = setTimeout(function () {
           _this.setState({ loading: false, reload: true, reloadFunction: 'handleScrollEnd', param1: e });
          }, 10000);
          PropertyStore.getSpProperties(num, _this.state.search, function (resObj) {
            clearTimeout(isLoading)
             _this.setState({ loading: false });
          });
        }
      }
    }
  }
  handleCreatePropertyList () {
    const navigation = this.props.navigation;
    navigation.navigate('CreateProperty');
  }
  handleReload = () => {
    switch(this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      case '_onRefresh':
        this.setState({ reload: false, reloadFunction: '' });
        this._onRefresh()
        break;
      case 'handleSearchBackClick':
        this.setState({ reload: false, reloadFunction: ''})
        this.handleSearchBackClick(this.state.param1)
        break;
      case 'handleScrollEnd':
        this.setState({ reload: false, reloadFunction: ''})
        this.handleScrollEnd(this.state.param1)
        break;
      default:
        break;
    }
  }


  render() {
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    let propertiesList =
      <View>
      </View>;
    // if (!PropertyStore.internet_connection) {
    //   propertiesList = <View style={{ marginTop: 200, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    //     <TouchableOpacity onPress={()=> this.Refresh()}><Text>No Internet Connection</Text></TouchableOpacity>
    //   </View>;
    // } else {
      if (PropertyStore.PropertyNoOrders) {
        propertiesList = <View  style={ styles.contentContainerStyle } >
          <Text  style={ styles.title } >{i18n.t('lanLabelNoPropertiesTillNow')}</Text>
        </View>;
      } else {
        if (PropertyStore.SearchHomePropertyNoMatches) {
          propertiesList = <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={ styles.title }>{i18n.t('lanLabelNoMatchesFound')}</Text>
          </View>;
        } else {
          propertiesList =
              <FlatList
                refreshControl={
                  <RefreshControl
                  />
                }
                data={PropertyStore.PropertiesList}
                renderItem={({ item }) => <EachRowProperty navigation={navigation} data={item} key={item._id} />}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={this.Render_Footer}
              />
        }
      }
    // }
    return (
      !this.state.reload
      ?<View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView}>
            <View style={styles.headerLeft} >
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()}>
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
              </TouchableHighlight>
            </View>
            <View style={styles.headerBody} >
              <Text style={styles.headerTitleStyle}> {i18n.t('lanTitlePropertiesList')}  </Text>
            </View>
            <View style={styles.headerRight}>
              <View style={{flex:1 }}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => this.searchBar.show()} >
                  <Icon name='ios-search' style={styles.iconSearchStyle} />
                </TouchableHighlight>
              </View>
              <View style={{flex:1 }}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.navigate('SPHomeScreen')}>
                  <Icon name='md-home' style={styles.iconHomeStyle} />
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <View style={{position:'absolute', top:Platform.OS === 'ios' ? 28 : 21 }}>
            <SearchBar
              ref={(ref) => this.searchBar = ref}
              handleResults={this._handleResults}
              showOnLoad = {false}
              iOSPadding={false}
              iOSHideShadow={true}
              placeholder={i18n.t('lanLabelSearch')}
              placeholderTextColor='gray'
              handleChangeText={(input) => this.handleSearchChange(input)}
              onBack={(input) => this.handleSearchBackClick(input)}
            />
          </View>
        </LinearGradient>
        {this.state.loading
        ? <View style={ styles.activeIndicatorView }><ActivityIndicator color='#ffffff' size='large' style={ styles.activeIndicatorStyle } /></View>
        : null}
        <ScrollView  onLayout={event => { this.layoutHeight = event.nativeEvent.layout.height; }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />}
          onScrollEndDrag={this.handleScrollEnd}
        >
          <View  style={ styles.propertyCountStyle } >
            <Text style={styles.title}>{`${i18n.t('lanLabelYouHave')} ${PropertyStore.totalPropertiesCount && PropertyStore.totalPropertiesCount > 0 ? PropertyStore.totalPropertiesCount: 0} ${i18n.t('lanLabelPropertyListed')}`}</Text>
          </View>
          <View style={ this.propertyListStyle }>
            {propertiesList}
          </View>
          <View>
          </View>
          </ScrollView>
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
          <LinearGradient colors={['#01A4A2', '#025D8C']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles1}>
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
