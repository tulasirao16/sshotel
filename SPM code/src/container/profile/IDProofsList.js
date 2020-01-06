import React from 'react';
import { observer, inject } from 'mobx-react';
import { Dimensions, FlatList, TouchableOpacity, TouchableHighlight, StatusBar, ActivityIndicator, RefreshControl, BackHandler } from 'react-native';
import { Icon, View, Text, Footer, Button } from 'native-base';
import styles from './css/IDProofsListCss';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from 'i18n-js';

import { ScrollView } from 'react-native-gesture-handler';
import AwesomeButton from 'react-native-really-awesome-button';
import EachIDProofRow from './EachIDProofRow';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const layoutHeight = 0;

@inject(['UserStore'])
@observer
export default class IDProofsList extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      header: null
    }
  };

  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    this.state = {
      refreshing: false,
      loading: false,
      reload: false,
      reloadFunction: '',
      errorMessage: '',
      param: ''
    };
    this.handleCreateIDProofList = this.handleCreateIDProofList.bind(this);
  }

  componentWillMount() {
    const UserStore = this.props.UserStore;
    const navigation = this.props.navigation;
    this.setState({ loading: true });
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    UserStore.getIDProofs(function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
      if (resObj.statusCode == '9999') {
        _this.props.navigation.navigate('InformationScreen');
      }
    });
  }

  componentWillReceiveProps(newProps) {
    const UserStore = this.props.UserStore;
    const navigation = this.props.navigation;
    let _this = this;
    if (newProps.navigation.state.params && newProps.navigation.state.params.idproof == 'idproof') {
      this.setState({ loading: true });
      let isLoading = setTimeout(function () {
        _this.setState({ loading: false, reload: true, param: newProps, reloadFunction: 'componentWillReceiveProps'  });
      }, 10000);
      UserStore.getIDProofs(function (resObj) {
        clearTimeout(isLoading)
        _this.setState({ loading: false })
        if (resObj.statusCode == '9999') {
          _this.props.navigation.navigate('InformationScreen')
        }
      });
    } else {
    }
  }
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    const navigation = this.props.navigation;
    navigation.goBack()
      return true
    })
  }
  componentWillUnmount() {
    this.backHandler.remove()
  }
  handleCreateIDProofList() {
    const navigation = this.props.navigation;
    navigation.navigate('CreateIDProofScreen');
  }

  _onRefresh = () => {
    const UserStore = this.props.UserStore;
    let _this = this;
    this.setState({ loading: true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: '_onRefresh' });
    }, 10000);
    UserStore.getIDProofs(function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
      if (!UserStore.internet_connection) {
        _this.props.navigation.navigate('InformationScreen')
      }
    });
  }
  handleReload = () => {
    switch (this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      case 'componentWillReceiveProps':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillReceiveProps(this.state.param)
        break;
      case '_onRefresh':
        this.setState({ reload: false, reloadFunction: '' });
        this._onRefresh()
        break;
      default:
        break;
    }
  }

  render() {
    const navigation = this.props.navigation;
    const UserStore = this.props.UserStore;
    let idproofsList = <View></View>;
    if (UserStore.IDProofsList.length == 0) {
      idproofsList = <View style={styles.noDataViewStyle} >
        <Text style={[styles.noIdproof, styles.bottomSpace]}>{i18n.t('lanLabelNoIDProofsFound')}</Text>
        <LinearGradient colors={['#025d8c', '#01a4a2']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
          <AwesomeButton block success
            onPress={() => this.handleCreateIDProofList()}
            width={DEVICE_WIDTH / 2.2} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
            <Text style={styles.BtnText} > {i18n.t('lanCommonButtonAddIDProofs')} </Text>
          </AwesomeButton>
        </LinearGradient>
      </View>;
    } else {
      idproofsList =
        <FlatList
          data={UserStore.IDProofsList}
          renderItem={({ item }) => <EachIDProofRow navigation={navigation} data={item} />}
          keyExtractor={(item, index) => index.toString()}
        />
    }
    return (
      !this.state.reload
      ? <View style={styles.container}>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <StatusBar barStyle='light-content' />
          <View style={styles.status} />
          <View style={styles.headerMainView}>
            <View style={styles.headerLeft} >
              <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()} >
                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
              </TouchableHighlight>
            </View>
            <View style={styles.headerBody} >
            <Text style={styles.headerTitleStyle}> {i18n.t('lanTitleIDProofsList')}</Text>
            </View>
            <View style={styles.headerRight}>
              {/* <TouchableOpacity activeOpacity={0.8}  onPress={() => this.searchHeader.show()} >
                  <Icon name='ios-search' style={styles.iconMenuStyle} />
                </TouchableOpacity> */}
              <View style={{flex:1 }}>
                <TouchableHighlight style={styles.plusmenu_button} underlayColor='#0b6664' onPress={() => this.handleCreateIDProofList()}>
                  <Icon name='ios-add' style={styles.iconPlusMenuStyle} />
                </TouchableHighlight>
              </View>
              <View style={{flex:1 }}>
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.navigate('SPHomeScreen')}>
                  <Icon name='md-home' style={styles.iconHomeStyle}  />
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </LinearGradient>
        {this.state.loading
        ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#ffffff' size='large' style={styles.activeIndicatorStyle} /></View>
        : null}
        <ScrollView onLayout={event => { this.layoutHeight = event.nativeEvent.layout.height; }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />}
          onScrollEndDrag={this.handleScrollEnd}
        >
          <View style={this.propertyListStyle}>
            {idproofsList}
          </View>
        </ScrollView>
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
    );
  }
}

