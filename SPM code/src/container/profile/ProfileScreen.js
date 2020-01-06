import React from 'react';
import { observer, inject } from 'mobx-react';
import i18n from 'i18n-js';
import { TouchableWithoutFeedback, View, Image, TouchableOpacity,TouchableHighlight, Platform, AsyncStorage, ScrollView, TextInput, BackHandler, KeyboardAvoidingView, Animated, StatusBar, Keyboard, UIManager, Dimensions } from 'react-native';
import { ListItem, Left, List, Button, Text, Right, Item, Input, Container, Content, Body, Thumbnail, Icon, Card, CardItem, Form, Label, ActionSheet } from 'native-base';
import { Constants, ImagePicker, ImageManipulator } from 'expo';
import * as Permissions from 'expo-permissions';
import { PUBLIC_DOMAIN } from '../../../constants';
import styles from './css/ProfileCss';
import { LinearGradient } from 'expo-linear-gradient';
import Toast, { DURATION } from 'react-native-easy-toast';

const { State: TextInputState } = TextInput;

@inject(['UserStore'])
@observer
export default class ProfileScreen extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => {
        const { params = {} } = navigation.state;
        return {
            header: null,

        }
    };
    constructor(props) {
        super(props);
        this.state = {
            shift: new Animated.Value(0),
            data: {},
            image: '',
            authObj: {},
            userType: 'Owner'

        }
        this.handleBackButton = this.handleBackButton.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
    }
    state = {
        shift: new Animated.Value(0)
    };
    async componentWillMount() {
        await AsyncStorage.getItem('authObj').then((value) => {
            let authObj = JSON.parse(value);
            this.setState({
                authObj: authObj,
                mobileNumber: authObj.mobileNumber,
                email: authObj.email ? authObj.email : '',
                address: authObj.address,
                dob: authObj.dob ? authObj.dob : '',
                iconPath: authObj.userIconPath ? authObj.userIconPath : '',
                iconOriginalName: authObj.userIconOriginalName ? authObj.userIconOriginalName : ''
            });
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
    }

    async componentWillReceiveProps(newProps) {
        await AsyncStorage.getItem('authObj').then((value) => {
            let authObj = JSON.parse(value);
            this.setState({
                authObj: authObj,
                mobileNumber: authObj.mobileNumber,
                email: authObj.email ? authObj.email : '',
                address: authObj.address,
                dob: authObj.dob ? authObj.dob : '',
                iconPath: authObj.userIconPath ? authObj.userIconPath : '',
                iconOriginalName: authObj.userIconOriginalName ? authObj.userIconOriginalName : ''
            });
        });
    }
    

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton() {
        const navigation = this.props.navigation;
        navigation.navigate('SPHomeScreen');
        return true;
    }
    handleKeyboardDidShow = (event) => {
        const { height: windowHeight } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        const currentlyFocusedField = TextInputState.currentlyFocusedField();
        UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
            const fieldHeight = height;
            const fieldTop = pageY;
            const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
            if (gap >= 0) {
                return;
            }
            Animated.timing(
                this.state.shift,
                {
                    toValue: gap,
                    duration: 1000,
                    useNativeDriver: true,
                }
            ).start();
        });
    }
    handleKeyboardDidHide = () => {
        Animated.timing(
            this.state.shift,
            {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }
        ).start();
    }
    _takePhoto = async () => {
        const {
            status: cameraPerm
        } = await Permissions.askAsync(Permissions.CAMERA);

        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });

            this._handleImagePicked(pickerResult);
        }
    };
    _handleImagePicked = async pickerResult => {
        try {
            this.setState({
                uploading: true
            });

            if (!pickerResult.cancelled) {
                this.handleCompressImage(pickerResult.uri);
            }
        } catch (e) {
            // alert('Upload failed, sorry :(');
            this.refs.toast.show('Upload failed, sorry' );
        } finally {
            this.setState({
                uploading: false
            });
        }
    };
    async handleCompressImage(uri) {
        const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [],
            { compress: 0.5 }
        );
        this.setState({
            image: manipResult.uri, errorMessage: ''
        });
    }
    _pickImage = async () => {
        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });
            this._handleImagePicked(pickerResult);
        }
    };
    handleLogOut() {
        AsyncStorage.removeItem('authObj');
        AsyncStorage.removeItem('authToken');
        const navigation = this.props.navigation;
        navigation.navigate('SigninScreen');
    }


    render() {
        const { shift } = this.state;
        const navigation = this.props.navigation;
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
                    <StatusBar barStyle='light-content' />
                    <View style={styles.status} />
                    <View style={styles.headerMainView} >
                        <View style={styles.headerLeft} >
                            <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.openDrawer()} >
                                <Icon name='ios-menu' style={styles.iconMenuStyle} />
                            </TouchableHighlight>
                        </View>
                        <View style={styles.headerBody} >
                        <Text style={styles.headerTitleStyle}> {i18n.t('lanTitleMyProfile')} </Text>
                        </View>
                        <View style={styles.headerRight}>
                            <TouchableHighlight style={styles.menu_button} underlayColor='#0b6664' onPress={() => navigation.navigate("SPHomeScreen")} >
                                <Icon name='md-home' style={styles.iconHomeStyle}  />
                            </TouchableHighlight>
                        </View>
                    </View>
                </LinearGradient>
                <View style={styles.bodyContainer}>
                    <View style={styles.profileContent}>
                        <View style={styles.profileImageView} >
                            <Image source={this.state.image ? { uri: this.state.image } : (this.state.authObj && this.state.authObj.userIconPath) ? { uri: PUBLIC_DOMAIN + this.state.authObj.userIconPath } : require('../../../assets/profile-icon.png')}
                                style={styles.fitImage} />
                            {/* <View style={styles.camicon}>
                                <Icon onPress={() => navigation.navigate("ProfileEditScreen")} style={{ fontSize: 70, color: '#fff' }} name='md-camera' />
                                <View style={styles.plusIcon}>
                                    <Icon onPress={() => navigation.navigate("ProfileEditScreen")} style={{ fontSize: 30, color: '#fff' }} name='ios-add' />
                                </View>
                            </View> */}
                        </View>
                    </View>
                    <View style={styles.profileOptionsView} >
                        <View style={styles.addressContainer}>
                            <View style={styles.address}>
                                <Text style={styles.addressTxt}>{this.state.address}
                                </Text>
                            </View>
                            <TouchableWithoutFeedback onPress={() => navigation.navigate("ProfileEditScreen")}>
                                <View style={styles.editIcon}>
                                    <Icon name='ios-create' style={styles.editIConStyle} />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.addressContainer}>
                            <View style={styles.address}>
                                <Text style={styles.MobileTxt}>{this.state.mobileNumber}</Text>
                            </View>
                            <View style={styles.editIcon}>
                                <Icon name='ios-checkmark-circle' style={styles.checkIConStyle} />
                            </View>
                        </View>
                        <View style={styles.addressContainer}>
                            <View style={styles.address}>
                                <Text style={styles.addressTxt}>{this.state.email}</Text>
                            </View>
                            <View style={styles.editIcon}>
                                <Icon name='ios-checkmark-circle' style={styles.checkIConStyle} />
                            </View>
                        </View>
                        <View style={styles.hrLine} ></View>
                    </View>
                </View>
                <ScrollView >
                    <View>
                        <View style={styles.optionTitle}>
                            <TouchableWithoutFeedback onPress={() => navigation.navigate("IDProofsList")}>
                            <Text style={[styles.title, styles.titleRouting]}>{i18n.t('lanLabelIDProofs')}</Text>
                            </TouchableWithoutFeedback>
                        </View>
                        {/* <View style={styles.optionTitle}>
                            <TouchableWithoutFeedback onPress={() => navigation.navigate("PreferenceScreen")}>
                            <Text style={[styles.title, styles.titleRouting]} >{i18n.t('lanLabelPreference')}</Text>
                            </TouchableWithoutFeedback>
                        </View> */}
                        {this.state.authObj.userType == 'Owner'
                            ? <View style={styles.optionTitle}>
                                <TouchableWithoutFeedback onPress={() => navigation.navigate("BusinessInfoScreen")}>
                                <Text style={[styles.title, styles.titleRouting]} >{i18n.t('lanLabelBusinessInfo')}</Text>
                                </TouchableWithoutFeedback>
                            </View>
                            : null}
                        <View style={styles.optionTitle}>
                            <TouchableWithoutFeedback onPress={() => navigation.navigate("ChangePassword")}>
                            <Text style={[styles.title, styles.titleRouting]} >{i18n.t('lanLabelChangePassword')}</Text>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.optionTitle}>
                            <TouchableWithoutFeedback onPress={() => this.handleLogOut()}>
                            <Text style={[styles.title, styles.titleRouting]} >{i18n.t('lanLabelLogout')}</Text>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>

                </ScrollView>
                <Toast
                    ref='toast'
                    style={{backgroundColor:'red', width: '100%', borderRadius:0,padding: 10, }}
                    position='top'
                    positionValue={80}
                    fadeInDuration={50}
                    fadeOutDuration={500}
                    // opacity={0.8}
                    borderRadius={0}
                    textStyle={{color:'white', fontFamily: 'Roboto_medium', }}
                    />
            </View>
        );
    }
}