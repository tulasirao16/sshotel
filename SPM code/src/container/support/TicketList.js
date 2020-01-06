import React from 'react';
import { observer, inject } from 'mobx-react';
import { Text, WebView, View, Image, ActivityIndicator, FlatList, RefreshControl, Dimensions, Platform, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Body, Title, Button, List, ListItem, Icon, Card, CardItem } from 'native-base';
import moment from 'moment'
import styles from './css/TicketListCss'
import i18n from 'i18n-js';
import AwesomeButton from 'react-native-really-awesome-button';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const layoutHeight = 0;

@inject(['SupportStore'])
@observer
export default class TicketList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      refreshing: false,
      loading: false,
      searchString: '',
      reload: false,
      reloadFunction: '',
      param1: null
    }
    this.page = 0
  }
  componentWillMount() {
    const SupportStore = this.props.SupportStore
    const navigation = this.props.navigation;;
    let _this = this
    this.setState({ loading: true });
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: 'componentWillMount' });
    }, 10000);
    SupportStore.getSPSupportData('1', '', function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
    });
  }
  _onRefresh = () => {
    this.setState({ search: '', activePage: 1, loading: true })
    const SupportStore = this.props.SupportStore;
    let _this = this;
    let isLoading = setTimeout(function () {
      _this.setState({ loading: false, reload: true, reloadFunction: '_onRefresh' });
    }, 10000);
    SupportStore.getSPSupportData('1', '', function (resObj) {
      clearTimeout(isLoading)
      _this.setState({ loading: false })
      if (resObj.statusCode == '9999') {
        _this.props.navigation.navigate('InformationScreen')
      }
    });
  }
  _handleSearch = () => {
    this.searchHeader.show()
  }

  handleScrollEnd = (e) => {
    const SupportStore = this.props.SupportStore;
    var offset = e.nativeEvent.contentOffset.y,
    height = e.nativeEvent.contentSize.height;
    if ((this.layoutHeight + offset) >= height) {
      if (SupportStore.totalTicketsCount > SupportStore.TicketList.length) {
        this.setState({ loading: true });
        const num = this.state.activePage + 1;
        if (num) {
          this.setState({ activePage: num, loading: true });
          let _this = this;
          let isLoading = setTimeout(function () {
            _this.setState({ loading: false, reload: true, reloadFunction: 'handleScrollEnd', param1: e });
          }, 10000);
          SupportStore.getSPSupportData(num, _this.state.search, function (resObj) {
            clearTimeout(isLoading)
            _this.setState({ loading: false });
          });
        }
      }
    }
  }

  ListHeader = () => {
    const SupportStore = this.props.SupportStore;
    const navigation = this.props.navigation;
    return (
      // <View></View>
      <View style={styles.ticketsCount}>
        <Text style={{ color: '#333', fontFamily: 'Roboto_medium' }}>{SupportStore.totalTicketsCount}{i18n.t('lanLabelTickets')} </Text>
      </View>
    );
  };
  handleReload = () => {
    switch (this.state.reloadFunction) {
      case 'componentWillMount':
        this.setState({ reload: false, reloadFunction: '' });
        this.componentWillMount()
        break;
      case '_onRefresh':
        this.setState({ reload: false, reloadFunction: '' });
        this._onRefresh()
        break;
      case 'handleScrollEnd':
        this.setState({ reload: false, reloadFunction: '' })
        this.handleScrollEnd(this.state.param1)
        break;
      default:
        break;
    }
  }

  render() {
    const navigation = this.props.navigation;
    const SupportStore = this.props.SupportStore;
    let TicketList = <View></View>;
    if (SupportStore.isLoading) {
      TicketList = <View style={{ marginTop: 80, justifyContent: 'center', alignItems: 'center' }}>
        {/* <ActivityIndicator color='#008000' /> */}
      </View>;
    } else if (SupportStore.TicketList.length == 0) {
      TicketList = <View style={styles.noDataViewStyle} >
        <Text style={styles.noIdproof}>{i18n.t('lanLabelNoTicketsFound')}</Text>
      </View>;
    } else {
      TicketList =
        <FlatList
          data={SupportStore.TicketList}
          renderItem={({ item, index }) => <EachRow1 navigation={navigation} data={item} key={item._id} />}
          keyExtractor={(item, index) => index}
          ListFooterComponent={this.Render_Footer}
          ListHeaderComponent={this.ListHeader}
        />
    }

    return (
      !this.state.reload
        ? <View >
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            onLayout={event => { this.layoutHeight = event.nativeEvent.layout.height; }} onScrollEndDrag={this.handleScrollEnd}>
            {TicketList}
          </ScrollView>
          {this.state.loading
          ? <View style={styles.activeIndicatorView}><ActivityIndicator color='#ffffff' size='large' style={styles.activeIndicatorStyle} /></View>
          : null}
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
                  <Text style={styles.headerTitleStyle}>{i18n.t('lanAppTitle')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
          <View style={{ jflex: 1, justifyContent: 'center', alignItems: 'center', width: DEVICE_WIDTH - 20, height: Device_Height - 150 }} >
            <View style={styles.eachBtnView} >
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


@observer
class EachRow1 extends React.Component {
  handleView(data) {
    const navigation = this.props.navigation;
    navigation.navigate('ViewTicket', { data: data });
  }
  render() {
    const navigation = this.props.navigation;
    const data = this.props.data;
    return (
      <View style={styles.container}>
        <List key={data._id} style={styles.list}>
          <ListItem button onPress={() => this.handleView(data)}>
            <View>
              <View>
                <Text style={styles.textBig}>{i18n.t('lanLabelTicketType')}:{data.ticketTag}</Text>
              </View>
              <View>
                <Text style={styles.textBig}>{i18n.t('lanLabelTicketTitle')}:{data.ticketTitle}</Text>
              </View>
              <View>
                <Text style={styles.textBig}>{i18n.t('lanLabelTicketStatus')}:{data.ticketStatus}</Text>
              </View>
              <View>
                <Text style={styles.textMedium}>{i18n.t('lanLabelTicketNumber')}:{data.ticketNumType + data.ticketNumber}</Text>
              </View>
              <View>
                <Text style={styles.textMedium}>{i18n.t('lanLabelSupportDate')}:{moment(data.createdAt).format('MMM DD, YYYY')}</Text>
              </View>
            </View>
          </ListItem>
        </List>
      </View>
    );
  }
}
