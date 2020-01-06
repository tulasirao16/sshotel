import React from 'react';
// import { observer, inject } from 'mobx-react';
import { AsyncStorage, BackHandler, Image, StyleSheet, Platform, Dimensions, Animated, TouchableOpacity, Keyboard, UIManager, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button, Container, Header, Content, Form, Icon, View, Text, Textarea, Card, CardItem, Body, Item, Input, Label } from 'native-base';
import styles from './css/dashboardCss';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import AwesomeButton from "react-native-really-awesome-button";
import i18n from 'i18n-js'

const DEVICE_WIDTH = Dimensions.get(`window`).width;

// @inject(['UserStore'])
// @observer
export default class DashboardScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: '',
      countryCode: '',
      shift: new Animated.Value(0),
      errorMessage: '',
      disableButton: false
    };
    this._handleReviewDetails = this._handleReviewDetails.bind(this);
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
  _onButtonNextPress() {
    navigation = this.props.navigation
    navigation.navigate('PropertyView')
  }
  _handleReviewDetails() {
    navigation = this.props.navigation
    navigation.navigate('SupplierUserView')
  }


  render() {
    const { shift } = this.state;
    const navigation = this.props.navigation;
    let params = navigation.state.params;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <LinearGradient colors={['#019fa0', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.headerStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
              <View style={styles.headerLeft} >
                <Button transparent onPress={() => navigation.goBack()}><Icon name='arrow-back' style={{ color: '#fff', marginLeft: 20, fontSize: 25, paddingTop: (Platform.OS === 'ios') ? 5 : 12 }} /></Button>
              </View>
              <View style={styles.headerTitleView} >
                <Text style={styles.headerTitle} >{i18n.t('lanTitleDashboard')}</Text>
              </View>
              <View style={styles.headerRight} ></View>
            </View>
          </LinearGradient>
        </View>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.main_div}>
              <View style={styles.left_div}>
                <View style={styles.badge}>
                  <Text style={{color:'#fff', fontSize:12}}>5</Text>
                </View>
                <Image source={require('../../../assets/calendar.png')} style={styles.iconImage} />
                <Text style={styles.regularTxt} >{i18n.t('lanButtonCheckIn')}</Text>
              </View>
              <View style={styles.mid_div}>
                <View style={styles.badge}>
                  <Text style={{color:'#fff', fontSize:12}}>10</Text>
                </View>
                <Image source={require('../../../assets/calendar.png')} style={styles.iconImage} />
                <Text style={styles.regularTxt} >{i18n.t('lanButtonCheckOut')}</Text>
              </View>
              <View style={styles.Right_div}>
                <View style={styles.badge}>
                  <Text style={{color:'#fff', fontSize:12}}>20</Text>
                </View>
                <Image source={require('../../../assets/calendar.png')} style={styles.iconImage} />
                <Text style={styles.regularTxt} >{i18n.t('lanButtonCheckOut')}{i18n.t('lanButtonBookings')}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={this._handleReviewDetails} >
            <View style={styles.main_div1}>
              <View style={styles.left_div1}>
                <View style={styles.leftImg}>
                  <Image source={require('../../../assets/rupee.png')} style={styles.iconImage} />
                </View>
              </View>
              <View style={styles.mid_div1}>
                <Text style={styles.textBig} >{i18n.t('lanButtonAmount')}</Text>
              </View>
              <View style={styles.Right_div1}>
                <Text style={styles.textSmall} >3000</Text>
              </View>
            </View>
            </TouchableOpacity>
            <View style={styles.main_div1}>
              <View style={styles.left_div1}>
                <View style={styles.leftImg1}>
                  <Image source={require('../../../assets/calendar2.png')} style={styles.iconImage} />
                </View>
              </View>
              <View style={styles.mid_div1}>
                <Text style={styles.textBig} >{i18n.t('lanButtonBlockedDates')}</Text>
              </View>
              <View style={styles.Right_div1}>
                <Text style={styles.textSmall} >10thMay2019</Text>
              </View>
            </View>
            <View style={styles.main_div1}>
              <View style={styles.left_div1}>
                <View style={styles.leftImg2}>
                  <Image source={require('../../../assets/resort.png')} style={styles.iconImage} />
                </View>
              </View>
              <View style={styles.mid_div1}>
               <TouchableOpacity onPress={()=> navigation.navigate('PropertiesList')}><Text style={styles.textBig} >Property list </Text></TouchableOpacity> 
              </View>
              <View style={styles.Right_div1}>
                <Text style={styles.textSmall} >3000</Text>
              </View>
            </View>
            <View style={styles.main_div1}>
              <View style={styles.left_div1}>
                <View style={styles.leftImg3}>
                  <Image source={require('../../../assets/tag.png')} style={styles.iconImage} />
                </View>
              </View>
              <View style={styles.mid_div1}>
                <Text style={styles.textBig} >{i18n.t('lanButtonOffers')}</Text>
              </View>
              <View style={styles.Right_div1}>
                <Text style={styles.textSmall} >3000</Text>
              </View>
            </View>
            <View style={styles.main_div1}>
              <View style={styles.left_div1}>
                <View style={styles.leftImg4}>
                  <Image source={require('../../../assets/mail.png')} style={styles.iconImage} />
                </View>
              </View>
              <View style={styles.mid_div1}>
                <Text style={styles.textBig} >{i18n.t('lanButtonMessages')}</Text>
              </View>
              <View style={styles.Right_div1}>
                <Text style={styles.textSmall} >3000</Text>
              </View>
            </View>
            <View style={styles.main_div1}>
              <View style={styles.left_div1}>
                <View style={styles.leftImg5}>
                  <Image source={require('../../../assets/support.png')} style={styles.iconImage} />
                </View>
              </View>
              <View style={styles.mid_div1}>
                <Text style={styles.textBig} >{i18n.t('lanButtonServices')}</Text>
              </View>
              <View style={styles.Right_div1}>
                <Text style={styles.textSmall} >3000</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}


