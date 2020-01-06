import React from 'react';
import { View, Picker, Dimensions, TextInput, TouchableOpacity, TouchableHighlight, AsyncStorage, ActivityIndicator, ScrollView,Image, Keyboard, StatusBar, UIManage, BackHandler  } from 'react-native';
import { Text, Item, Icon, Label, Card, CardItem, Left, Right, List, ListItem, Button, Body } from 'native-base';
import { inject, observer } from 'mobx-react';
import styles from '../Locations/css/LocationCreateCss';
import AwesomeButton from "react-native-really-awesome-button";
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import { LinearGradient } from 'expo-linear-gradient';
import Toast, { DURATION } from 'react-native-easy-toast';
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['PropertyStore'])
@observer
export default class PropertyLocationCreate extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => {
        const { params = {} } = navigation.state;
        return {
          header: null,
        }
      };
    constructor(props) {
        super(props);
        const navigation = this.props.navigation;
        const PropertyStore = this.props.PropertyStore;
        const data = navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData : {};
        this.state = {
            propertyTitle: data && data.propertyTitle ? data.propertyTitle : '',
            propertyType: data && data.propertyType ? data.propertyType : '',
            propertyArea: data && data.propertyArea ? data.propertyArea : '',
            loading: false,
            propertyAction: data && data.propertyAction ? data.propertyAction : '',
            nearestAreas: PropertyStore.NearestAreas && PropertyStore.NearestAreas.length > 0 ? PropertyStore.NearestAreas : [],
            area: '',
            inputError: '',
            submitDisabled: ''
          }
          this.handleAddAreas = this.handleAddAreas.bind(this);
          this.handleRemoveArea = this.handleRemoveArea.bind(this);
          this.handleSubmitDetails = this.handleSubmitDetails.bind(this);
    }
    componentWillMount () {
      // const navigation = this.props.navigation;
      // if(this.state.propertyAction == 'create' && this.state.nearestAreas.length < 1) {
      //   let addAreas = this.state.nearestAreas;
      //   let area = this.state.propertyArea;
      //   if(area) {
      //     addAreas.push(area);
      //     this.setState({nearestAreas: addAreas, area: '', errorMessage: ''});
      //   }
      // }
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
    handleAddAreas () {
      let upperCaseArea = this.state.area.trim().toUpperCase()
        if(!this.state.area) {
          this.refs.toast.show(i18n.t('lanErrorPleaseAddArea'))
          this.setState({ inputError: true })
        } else if (this.state.propertyArea.trim().toUpperCase() === upperCaseArea) {
          // alert(i18n.t('lanErrorAreaAlreadyExists'))
          this.refs.toast.show(i18n.t('lanErrorAreaAlreadyExists'))
          // this.setState({errorMessage: 'Please Add Area'});
        } else {
          let index = this.state.nearestAreas.indexOf(upperCaseArea)
          if (index != -1) {
            // alert(i18n.t('lanErrorAreaAlreadyExists'))
            this.refs.toast.show(i18n.t('lanErrorAreaAlreadyExists'))
          } else {
            let addAreas = this.state.nearestAreas;
            addAreas.push(upperCaseArea);
            this.setState({nearestAreas: addAreas, area: '', errorMessage: ''});
          }
        }
    }
    handleRemoveArea (item) {
        let removeAreas = this.state.nearestAreas;
        let index = removeAreas.indexOf(item);
        removeAreas.splice(index, 1);
        this.setState({nearestAreas: removeAreas});
    }
    handleSubmitDetails () {
      const PropertyStore = this.props.PropertyStore;
      const navigation = this.props.navigation;
          PropertyStore.NearestAreas = this.state.nearestAreas;
          // navigation.goBack('',{ enableNeraestArea: true });
          if(this.state.nearestAreas.length > 0) {
            this.setState({ submitDisabled: true })
          navigation.navigate('CreateProperty', {enableNearestArea: true});
          } else {
            this.refs.toast.show(i18n.t('lanErrorPleaseAddNearestAreaToSubmit'));
          }
    }
   
    render () {
        const navigation = this.props.navigation
        return(
          <View style={{flex:1 }}>
            <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <StatusBar barStyle='light-content' />
            <View style={styles.status} />
            <View style={styles.headerMainView} >
              <View style={styles.headerLeft} >
                <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.goBack()}>
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle} />
                </TouchableHighlight>
              </View>
              <View style={styles.headerBody} >
                <Text style={styles.headerTitleStyle}> {i18n.t('lanTitleNearestAreas')} </Text>
              </View>
            </View>
          </LinearGradient>
          <View style={ styles.bodyContentView } >
            <View style={ styles.businessNameView } >
              <Card style={ styles.card }>
                <CardItem style={ styles.cardItemStyle }>
                  <Left style={[styles.leftImageView, styles.listItemView ]}>
                    <View style={styles.imageBusinessBox} >
                        <Image source={this.state.propertyImage ? {uri: PUBLIC_DOMAIN + this.state.propertyImage} :  require('../../../assets/dummy_property.jpg')} style={styles.imgStyle} />
                    </View>
                    <Body>
                        <View style={ styles.floatingInputBusinessView } >
                            <Text style={styles.propertyTitle}> {this.state.propertyTitle} </Text>
                            <Text style={styles.titleLocationType}> {this.state.propertyArea ? this.state.propertyArea : ''} </Text>
                            <Text style={styles.titleType}> {this.state.propertyType} - {i18n.t('lanTitleAddNearestLocations')}</Text>
                        </View>
                    </Body>
                  </Left>  
                </CardItem>
              </Card>
          </View>
          <ScrollView>
            <View style={styles.content}>
              <View style={styles.input}>
                <FloatingLabelInput
                  label={i18n.t('lanLabelPleaseAddNearestAreas')}
                  isError={this.state.inputError}
                  value={this.state.area}
                  onChangeText={(text) => this.setState({ area: text, errorMessage: '', inputError:text ? false : true })}
                  maxLength={30}
                  onSubmitEditing={() => {
                    this.handleAddAreas();
                }} 
                />
                <Button transparent onPress={()=> this.handleAddAreas()} style={styles.addBtn}>
                  <Text style={{paddingLeft:5, paddingRight:5, height:null, fontSize:13, color:'#fff'}}><Icon name="add-circle" style={{fontSize:18, color:'#fff', marginRight:5,}} /> {i18n.t('lanButtonAdd')}</Text>
                </Button>
              </View>
              {this.state.inputError ? <Text style={styles.textCenterNote}>{i18n.t('lanTitlePleaseAddNearestArea')}</Text> : null }
              {this.state.nearestAreas && this.state.nearestAreas.length > 0 ? this.state.nearestAreas.map((item, i) =>
                <View key={i}>
                  <List>
                    <ListItem style={{marginLeft:0 }}>
                      <View style={{flexDirection:'row' }}>
                        <Left>
                          <View><Text style={{fontFamily:'Roboto_medium'}}>{item}</Text></View>
                        </Left>
                        <Right>
                          <TouchableOpacity onPress={()=> this.handleRemoveArea(item)} style={styles.minusIcon}>
                            <Icon name='ios-remove' style={{fontSize:20, color:'#333' }} />
                          </TouchableOpacity>
                        </Right>
                      </View>
                    </ListItem>
                  </List>
               </View>
               ): null}
              <View style={styles.btnModal} >
              {!this.state.submitDisabled
              ? <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                  <AwesomeButton block success
                    onPress={this.handleSubmitDetails}
                    width={DEVICE_WIDTH/3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                    <Text style={styles.BtnText}> {i18n.t('lanButtonSubmit')}  </Text>
                  </AwesomeButton>
                </LinearGradient>
              : <LinearGradient colors={['#ddd', '#ddd']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                <AwesomeButton block success
                  onPress={this.handleSubmitDetails}
                  disabled={this.state.submitDisabled}
                  width={DEVICE_WIDTH/3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                  <Text style={styles.BtnText}>{i18n.t('lanButtonSubmit')} </Text>
                </AwesomeButton>
              </LinearGradient>
              }
              </View>
              {/* <View style={{justifyContent:'center', alignItems:'center'}}><Text style={{color: 'red', fontFamily:'Roboto_medium'}}>{this.state.errorMessage}</Text></View> */}
            </View>
          </ScrollView>
          <Toast
            ref="toast"
            style={{backgroundColor:'red', width: '96%', borderRadius:0,padding: 10, }}
            position='top'
            positionValue={80}
            fadeInDuration={750}
            fadeOutDuration={1000}
            // opacity={0.8}
            borderRadius={0}
            textStyle={{color:'white', fontFamily: 'Roboto_medium', }}
          />
          </View>
         </View>
        )
    }
}   