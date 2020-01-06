import React from 'react';
import { observer, inject } from 'mobx-react';
import { Platform, FlatList, BackHandler, ActivityIndicator, TouchableOpacity, StatusBar, Image, ScrollView, Dimensions, Animated, RefreshControl, Keyboard, UIManager, TextInput } from 'react-native';
import { Container, Button, List, ListItem, View, Icon, Text, Left, Right, Body, Content } from 'native-base';
import styles from './css/InboxCompontCss';
import moment from 'moment';
import EachRow from './EachRow';
import SearchBar from 'react-native-searchbar';
import i18n from 'i18n-js';

import { LinearGradient } from 'expo-linear-gradient';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const layoutHeight = 0;

const { State: TextInputState } = TextInput;

@inject(['MessageStore'])
@observer
export default class InboxScreen extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => {
        const { params = {} } = navigation.state;
        return {
            header: null,
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            refreshing: false,
            loading: false,
            search: ''
        }
        this.page = 0
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    }
    componentWillMount() {
        this.setState({ search: '' })
        const MessageStore = this.props.MessageStore;
        let _this = this
        this.page = this.page + 1;
        MessageStore.getSPMessages(this.page, '', function (resObj) {
            if (resObj.statusCode == '404') {
                navigation.navigate("InformationScreen");
            } else {
                _this.setState({ activePage: 1, search: '' })
            }
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
    }
    handleBackButtonClick() {
        const navigation = this.props.navigation
        navigation.goBack()
        return true
    }
    _onRefresh = () => {
        this.setState({ refreshing: false, search: '' })
        const MessageStore = this.props.MessageStore;
        let _this = this;
        MessageStore.getSPMessages('1', '', function (resObj) {
            if (resObj.statusCode == '9999') {
                _this.props.navigation.navigate("InformationScreen")
            }
        });
        _this.setState({ activePage: 1 })
    }
    handleSearchChange = (Search) => {
        this.setState({ search: Search })
        const MessageStore = this.props.MessageStore;
        let _this = this
        MessageStore.getSPMessages('1', Search, function (resObj) {
        })
        _this.setState({ activePage: 1 })
    }
    handleSearchBackClick = (Search) => {
        this.setState({ search: Search })
        const MessageStore = this.props.MessageStore;
        let _this = this
        MessageStore.getSPMessages('1', Search, function (resObj) {
        })
        this.searchBar.hide()
    }
    // _handleSearch = () => {
    //     this.searchHeader.show()
    // }
    handleScrollEnd = (e) => {
        const MessageStore = this.props.MessageStore;
        var offset = e.nativeEvent.contentOffset.y,
            height = e.nativeEvent.contentSize.height;
        if ((this.layoutHeight + offset) >= height) {
            if (MessageStore.totalMessagesCount > MessageStore.MessagesList.length) {
                this.setState({ loading: true });
                const num = this.state.activePage + 1;
                if (num) {
                    this.setState({ activePage: num });
                    let _this = this;
                    MessageStore.getSPMessages(num, _this.state.search, function (resObj) {
                        _this.setState({ loading: false });
                    });
                }
            }
        }
    }
    render() {
        const navigation = this.props.navigation;
        const MessageStore = this.props.MessageStore;
        let messagedata =
            <View>
            </View>;
        if (MessageStore.MessagesNoOrders) {
            messagedata = <View style={styles.noDataViewStyle} >
                <Text style={styles.noMessages}>{i18n.t('lanLabelNoMessagesTillNow')}</Text>
            </View>;
        } else {
            if (MessageStore.SearchHomeMessageNoMatches) {
                messagedata = <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.title}>{i18n.t('lanLabelNoMatchesFound')}</Text>
                </View>;
            } else {
                messagedata =
                    MessageStore.isLoading ? (<ActivityIndicator size='large' />)
                        : <FlatList
                            refreshControl={
                                <RefreshControl
                                />
                            }
                            data={MessageStore.MessagesList}
                            renderItem={({ item, index }) => <EachRow navigation={navigation} data={item} key={item._id} />}
                            keyExtractor={(item, index) => index.toString()}
                            ListFooterComponent={this.Render_Footer}
                        />
            }

        }
        return (
            <View style={styles.container}>
                <View>
                    <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
                        <StatusBar barStyle='light-content' />
                        <View style={styles.status} />
                        <View style={styles.headerMainView} >
                            <View style={styles.headerLeft} >
                                <View>
                                    <Icon name='md-menu' style={styles.iconSearchStyle} onPress={() => navigation.openDrawer()} />
                                </View>
                            </View>
                            <View style={styles.headerBody} >
                                <Text style={styles.headerTitleStyle}> {i18n.t('lanTitleInbox')} </Text>
                            </View>
                            <View style={styles.headerRight} >
                                <TouchableOpacity activeOpacity={0.8} onPress={() => this.searchBar.show()} >
                                    <Icon name='ios-search' style={styles.iconSearchStyle} />
                                </TouchableOpacity>
                                < TouchableOpacity >
                                    <Icon name='md-home' style={styles.iconMenuStyle} onPress={() => navigation.navigate("SPHomeScreen")} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ position: 'absolute', top:Platform.OS === 'ios' ? 28 : 21 }}>
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
                        {/* <SearchHeader
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
                        /> */}
                    </LinearGradient>
                </View>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                    style={{ width: DEVICE_WIDTH, height: Device_Height - 100 }} onLayout={event => { this.layoutHeight = event.nativeEvent.layout.height; }} onScrollEndDrag={this.handleScrollEnd}>
                    <View style={styles.content}>
                        {messagedata}
                    </View>
                    <View>
                        {this.state.loading ?
                            <View><ActivityIndicator color='#fff' style={{ marginLeft: 6 }} /></View>
                            : null
                        }
                    </View>
                </ScrollView>

            </View>
        );
    }
}
