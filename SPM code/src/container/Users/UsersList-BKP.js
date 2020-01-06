import React from 'react';
import {ActivityIndicator,BackHandler, Dimensions, Image, ScrollView, Text, View}  from 'react-native';
import { observer, inject } from 'mobx-react';
import { Button, Icon} from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import SearchHeader from 'react-native-search-header';
import styles from './css/UsersListCss-bkp';
import { PUBLIC_DOMAIN } from '../../../constants';


const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;
const layoutHeight = 0;

@inject(['UserStore'])
@observer
export default class UsersList extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
        header: null,
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      kycImagePath: '',
      loading: true,
      activePage: 1
    }
  }


  componentWillMount() {
    const UserStore = this.props.UserStore;
    let _this = this
    UserStore.getUsersListingData(1, '', function (resObj) {
      _this.setState({loading: false})
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    const navigation = this.props.navigation;
    navigation.navigate('DashboardScreen');
    return true;
  }

  handleSearchChange(search) {
    const UserStore = this.props.UserStore;
    let _this = this
    UserStore.getUsersListingData(1, search, function (resObj) {
      _this.setState({loading: false})
    });
  }

  handleScrollEnd = (e) => {
    const UserStore = this.props.UserStore;

    var offset = e.nativeEvent.contentOffset.y,
    height = e.nativeEvent.contentSize.height;
    if(!this.state.loading &&
    (this.layoutHeight + offset) >= height) {
      if(UserStore.UserListingDataCount > UserStore.UsersListingData.length) {
        // this.setState({ loading : true });
        const num = this.state.activePage + 1;
        let _this = this;
        UserStore.getUsersListingData(num, '', function (resObj) {
          _this.setState({ activePage: num});
        });
      }
    }
  }

  render () {
    const UserStore = this.props.UserStore;
    return(
      <View>
        <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
          <View style={styles.headerMainView} >
            <View style={styles.headerLeft} >
              <View>
                <Icon name='ios-menu' style={styles.iconMenuStyle} onPress={() => this.props.navigation.openDrawer()} />
              </View>
            </View>
            <View style={styles.headerBody} >
              <View>
                <Text style={styles.headerTitleStyle}> Users Listing </Text>
              </View>
            </View>
            <View style={styles.headerRight} >
              <View>
                <Icon name='ios-search' style={styles.iconMenuStyle} onPress={() => this.searchHeader.show()}/>
              </View>
            </View>
          </View>
        </LinearGradient>
        <View>
          <SearchHeader entryAnimation='from-right-side'
              ref={(searchHeader) => {
                this.searchHeader = searchHeader;
              }}
              placeholder='Search...'
              placeholderColor='gray'
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
          </View>
           {/* <View>
                {this.state.loading ? 
                  <View><ActivityIndicator color='#fff' style={{ marginLeft: 6 }} /></View>
                  : null 
                }
              </View> */}
        {this.state.loading ? 
            <View><ActivityIndicator color='#000000' style={{ marginLeft: 6 }} /></View> : 
        <ScrollView style={{width: DEVICE_WIDTH, height: Device_Height-85}} onLayout={event => {this.layoutHeight = event.nativeEvent.layout.height;}} onScrollEndDrag={this.handleScrollEnd}>
            {(UserStore.UsersListingData && UserStore.UsersListingData.length >=1) ?  UserStore.UsersListingData.map((listData, index) =>
            <View style={{flexDirection: 'row', marginTop:10}} key={index}>
            <Image source={(listData.userIconPath) ? { uri: PUBLIC_DOMAIN + listData.userIconPath } : require('../../../assets/images/NoProfile.png')} style={styles.fitImage} />
            <View style={{flexDirection: 'column',justifyContent: 'center',}}>
              <Text>User Name: {listData.firstName}</Text>
              <Text>User Role: {listData.userRole}</Text>
              <Text>Service Provider: {listData.spServiceProvider}</Text>
              <Text>Mobile Number: {listData.mobileNumber}</Text>
              <Text>Email: {listData.email}</Text>
            </View>
            </View>
            ) :<Text>No Users Found</Text> }
          {/* {UserStore.UsersListingData.length > 0 ? UserStore.UsersListingData.map((data, i) => {
          <View style={{flex: 1,flexDirection: 'row'}} key={i}>
            <Image source={(this.state.kycImagePath) ? { uri: PUBLIC_DOMAIN + this.state.kycImagePath } : require('../../../assets/images/House.jpg')} style={styles.fitImage} />
            <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center',}}>
              <Text>User Name: {data.name}</Text>
              <Text>User Role: sai</Text>
              <Text>Service Provider: sai</Text>
              <Text>Mobile Number: sai</Text>
              <Text>Email: sai</Text>
            </View>
          </View>
            <Text>Users Found</Text>
          }) : <Text>No Users Found</Text> }  */}
        </ScrollView>}
      </View>
    )
  }
}