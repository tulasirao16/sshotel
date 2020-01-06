import React from 'react';
import { View, Picker, Dimensions, TextInput, TouchableOpacity, TouchableHighlight, AsyncStorage, ActivityIndicator, ScrollView,Image, Keyboard, StatusBar, UIManage, BackHandler } from 'react-native';
import { Text, Item, Icon, Label, Card, CardItem, Left, List, ListItem, Right,Button, Body } from 'native-base';
import { inject, observer } from 'mobx-react';
import styles from '../Locations/css/LocationCreateCss';
import AwesomeButton from "react-native-really-awesome-button";
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import { LinearGradient } from 'expo-linear-gradient';
import { PUBLIC_DOMAIN } from '../../../constants';
import i18n from 'i18n-js';
import Toast, { DURATION } from 'react-native-easy-toast';

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
        const data = navigation.state.params && navigation.state.params.propertyData ? navigation.state.params.propertyData : {};
        this.state = {
            propertyTitle: data && data.propertyTitle ? data.propertyTitle : '',
            propertyType: data && data.propertyType ? data.propertyType : '',
            propertyArea: data && data.propertyArea ? data.propertyArea : '',
            propertyImage: data && data.propertyImage ? data.propertyImage : '',
            loading: false,
            propertyAction: data && data.propertyAction ? data.propertyAction : '',
            nearestAreasData: data && data.nearestAreas ? data.nearestAreas : [],
            area: '',
            nearestType: data && data.nearestType ? data.nearestType : ''
          }
          this.handleAddAreas = this.handleAddAreas.bind(this);
          this.handleRemoveArea = this.handleRemoveArea.bind(this);
          this.handleSubmitDetails = this.handleSubmitDetails.bind(this);
    }
    componentWillMount () {
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
      if(!this.state.area) {
        this.setState({errorMessage: i18n.t('lanErrorPleaseAddArea')});
      } else if (this.state.propertyArea.toUpperCase() === this.state.area.toUpperCase()) {
        // alert(i18n.t('lanErrorAreaAlreadyExists'));
        this.refs.toast.show(i18n.t('lanErrorAreaAlreadyExists'));
      } else {
        let addAreas = this.state.nearestAreasData;
        let index = addAreas.findIndex(x => x.toUpperCase() === this.state.area.toUpperCase())
        if (index >= 0) {
          // alert(i18n.t('lanErrorAreaAlreadyExists'));
          this.refs.toast.show(i18n.t('lanErrorAreaAlreadyExists'));
        } else {
          addAreas.push(this.state.area);
        }
        this.setState({nearestAreasData: addAreas, area: '', errorMessage: ''});
      }
    }
    handleRemoveArea (item) {
        let removeAreas = this.state.nearestAreasData;
        let index = removeAreas.indexOf(item);
        removeAreas.splice(index, 1);
        this.setState({nearestAreasData: removeAreas});
    }
    handleSubmitDetails () {
        const navigation = this.props.navigation;
        navigation.goBack();
    }
   
    render () {
        const navigation = this.props.navigation
        return(
            <View>
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
                <Text style={styles.headerTitleStyle}> {this.state.nearestType}</Text>
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
                            <Text style={styles.titleType}> {this.state.propertyType} - {this.state.nearestType} </Text>
                        </View>
                    </Body>
                  </Left>  
                </CardItem>
              </Card>
          </View>
          <ScrollView>
            <View style={styles.content}>
            {this.state.propertyAction == 'View' ? null
             : <View style={styles.input}>
                <FloatingLabelInput
                  label={i18n.t('lanLabelPleaseAddNearestAreas')}
                  value={this.state.area}
                  onChangeText={(text) => this.setState({ area: text, errorMessage: '' })}
                  maxLength={30}
                />
                <Button transparent onPress={()=> this.handleAddAreas()} style={styles.addBtn}>
                  <Text style={{paddingLeft:5, paddingRight:5, height:null, fontSize:13, color:'#fff'}}><Icon name="add-circle" style={{fontSize:18, color:'#fff', marginRight:5,}} /> {i18n.t('lanButtonAdd')}</Text>
                </Button>
                {/* <TouchableOpacity onPress={()=> this.handleAddAreas()}><Text>Add</Text></TouchableOpacity> */}
              </View> }
              {this.state.nearestAreasData && this.state.nearestAreasData.length > 0 ? this.state.nearestAreasData.map((item, i) =>
                <View key={i}>
                  <List>
                    <ListItem style={{marginLeft:0 }}>
                      <View style={{flexDirection:'row' }}>
                        <Left>
                          <View><Text style={{fontFamily:'Roboto_medium'}}>{item}</Text></View>
                        </Left>
                        <Right>
                        {this.state.propertyAction == 'View' ? null : <TouchableOpacity onPress={()=> this.handleRemoveArea(item)} style={styles.minusIcon}>
                            <Text><Icon name='ios-remove' style={{fontSize:20, color:'#333' }} /></Text>
                          </TouchableOpacity>  }
                        </Right>
                      </View>
                    </ListItem>
                  </List>
                {/* <Text>{item}</Text>  */}
              {/* {this.state.propertyAction == 'View' ? null : <Icon name='ios-remove' onPress={()=> this.handleRemoveArea(item)}/> } */}
               </View>
               ): null}
              <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>
            
              <View style={styles.btnModal} >
                <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearBtnStyles}>
                  <AwesomeButton block success
                    onPress={this.handleSubmitDetails}
                    width={DEVICE_WIDTH/3} height={44} backgroundColor='transparent' backgroundShadow='transparent' backgroundDarker='transparent' paddingHorizontal={50} borderRadius={22} >
                {this.state.propertyAction == 'View' ? <Text style={styles.BtnText}> {i18n.t('lanButtonDone')} </Text> :  <Text style={styles.BtnText}> {i18n.t('lanButtonUpdate')} </Text> }
                  </AwesomeButton>
                </LinearGradient>
              </View>
            </View>
          </ScrollView>
          </View>
          <Toast
              ref='toast'
              style={{backgroundColor:'red', width: '100%', borderRadius:0,padding: 10, }}
              position='bottom'
              positionValue={120}
              fadeInDuration={750}
              fadeOutDuration={1000}
              // opacity={0.8}
              borderRadius={0}
              textStyle={{color:'white', fontFamily: 'Roboto_medium', }}
            />
         </View>
        )
    }
}   