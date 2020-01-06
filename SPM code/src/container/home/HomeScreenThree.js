import React from 'react';
import { AsyncStorage, BackHandler, Image, StyleSheet, Platform, Dimensions, Animated, Keyboard, TouchableOpacity, ScrollView, UIManager, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button, Container, Header, Content, Form, Icon, List, ListItem, View, Left, Radio, Right, Textarea, Text, Item, Input, Label } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './css/HomeScreenThreeCss';
import AwesomeButton from "react-native-really-awesome-button";

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const Device_Height = Dimensions.get('window').height;

// @inject(['UserStore'])
// @observer
export default class HomeScreenThree extends React.Component {
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
        this.handlePropertyList = this.handlePropertyList.bind(this);
    }
    _onButtonNextPress() {
        navigation = this.props.navigation
        navigation.navigate('PropertiesList')
    }
    handlePropertyList() {
        const navigation = this.props.navigation
        navigation.navigate('PropertiesList')
    }
    render() {
        const { shift } = this.state;
        const navigation = this.props.navigation;
        let params = navigation.state.params;
        return (
            <View style={styles.container}>
                <View >
                    <LinearGradient colors={['#019fa0', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearGradientStyle}>
                        <View style={{ paddingLeft:0}} >
                            <TouchableOpacity onPress={()=> this.handlePropertyList()} >
                                <Icon name='ios-menu' style={ styles.menuIcon } />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: Device_Height / 17 }} >
                            <View style={ styles.viewOne } >
                                <View style={ styles.eachView } >
                                    <View style={{ width:40, height:40, paddingBotton:5}}>
                                        <Image source={require('../../../assets/check-list.png')} style={ styles.imgStyle } />
                                    </View>
                                    <Text style={ styles.title }>Property List </Text>
                                </View>
                                <View style={ styles.eachView } >
                                    <View style={{ width:40, height:40, paddingBotton:5}}>
                                        <Image source={require('../../../assets/check-list.png')} style={ styles.imgStyle } />
                                    </View>
                                    <Text style={ styles.title } >Block Dates</Text></View>
                            </View>
                            <View style={ styles.viewOne } >
                                <View style={ styles.eachView } >
                                    <View style={{ width:40, height:40, paddingBotton:5}}>
                                        <Image source={require('../../../assets/check-list.png')} style={ styles.imgStyle } />
                                    </View>
                                    <Text style={ styles.title }>Property List </Text>
                                </View>
                                <View style={ styles.eachView } >
                                    <View style={{ width:40, height:40, paddingBotton:5}}>
                                        <Image source={require('../../../assets/check-list.png')} style={ styles.imgStyle } />
                                    </View>
                                    <Text style={ styles.title } >Block Dates</Text></View>
                            </View>
                            <View style={ styles.viewOne } >
                                <View style={ styles.eachView } >
                                    <View style={{ width:40, height:40, paddingBotton:5}}>
                                        <Image source={require('../../../assets/check-list.png')} style={ styles.imgStyle } />
                                    </View>
                                    <Text style={ styles.title }>Property List </Text>
                                </View>
                                <View style={ styles.eachView } >
                                    <View style={{ width:40, height:40, paddingBotton:5}}>
                                        <Image source={require('../../../assets/check-list.png')} style={ styles.imgStyle } />
                                    </View>
                                    <Text style={ styles.title } >Block Dates</Text></View>
                            </View>
                            <View style={ styles.viewOne } >
                                <View style={ styles.eachView } >
                                    <View style={{ width:40, height:40, paddingBotton:5}}>
                                        <Image source={require('../../../assets/check-list.png')} style={ styles.imgStyle } />
                                    </View>
                                    <Text style={ styles.title } >Amount</Text>
                                </View>
                                <View style={ styles.eachView } >
                                <View style={{ width:40, height:40, paddingBotton:5}}>
                                        <Image source={require('../../../assets/check-list.png')} style={ styles.imgStyle } />
                                    </View>
                                <Text style={ styles.title } >Messages</Text>
                                </View>
                            </View>
                           
                           
                        </View>   
                    </LinearGradient>
                </View>

            </View>
        );
    }
}


