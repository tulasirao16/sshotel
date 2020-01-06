import React from 'react';
import { Platform, BackHandler, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { Button, Icon, Text, View } from 'native-base';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import Modal from 'react-native-modal';
import styles from './css/MessagesCss';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import i18n from 'i18n-js';

const DEVICE_WIDTH = Dimensions.get(`window`).width;

@inject(['MessageStore'])
@observer
class Messages extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => {
        const { params = {} } = navigation.state;
        return {
            header: null,
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            isDeleteModalVisible: false
        }
        this.handleReply = this.handleReply.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    }
    componentWillMount() {
        const MessageStore = this.props.MessageStore;
        const navigation = this.props.navigation;
        const data = navigation.state.params.data
        if (navigation.state.params.data.spReadStatus == 'Unread') {
            MessageStore.setMessageUnReadToRead(navigation.state.params.data._id, function (resObj) {
                MessageStore.getSPMessages('1', '', function (resObj) {
                });
            });
        }
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
    handleReply() {
        const data = this.props.data;
        const navigation = this.props.navigation;
        const dataObj = navigation.state.params.data;
        navigation.navigate('EditInboxScreen', { data: navigation.state.params.data })
    }
    handleDelete(data) {
        const MessageStore = this.props.MessageStore;
        const navigation = this.props.navigation;
        this.setState({ isDeleteModalVisible: false })
        let messageData = {
            _id: data._id
        };
        MessageStore.deleteMessage(messageData, function (resObj) {
            if (resObj.statusCode == '0000') {
                MessageStore.getSPMessages('1', '', function (resObj) {
                    navigation.navigate('InboxScreen');
                });
            } else {
                _this.setState({ errorMessage: i18n.t('lanErrorDeleteMessageFailed') });
            }
        });
    }

    render() {
        const navigation = this.props.navigation;
        let data = navigation.state.params.data;
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#01a4a2', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
                    <View style={styles.headerMainView} >
                        <View style={styles.headerLeft} >
                            <View>
                                <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => navigation.goBack()} />
                            </View>
                        </View>
                        <View style={styles.headerBody} >
                            <View>
                                <Text style={styles.headerTitleStyle}> {i18n.t('lanTitleReadMessage')} </Text>
                            </View>
                        </View>
                        <View style={styles.headerRight} >
                            <TouchableOpacity activeOpacity={0.8} onPress={() => this.setState({ isDeleteModalVisible: true })} >
                                <Icon name='ios-trash' style={styles.iconDeleteStyle} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
                <ScrollView>
                    <View style={styles.bodyViewContainer}>
                        <View style={styles.view}>
                            <Text style={[styles.textFont, styles.headingStyle]}>{i18n.t('lanLabelFrom')} </Text>
                            <Text style={[styles.textStyle, styles.textFont]} >{data.messageBy == 'Service Provider' ?
                                ((data.spUserId && data.spUserId.userAccount) ? data.spServiceProvider + ' ' + '(' + data.spUserId.userAccount + ')' : data.spServiceProvider)
                                : data.euUserId.displayName + '(' + data.euUserId.userAccount + ')'}
                            </Text>
                        </View>
                        <View style={styles.view}>
                            <Text style={[styles.textFont, styles.headingStyle]} >{i18n.t('lanLabelMessage')}</Text>
                            <Text style={[styles.textStyle, styles.textFont]}>{data.message}</Text>
                        </View>
                        <View style={styles.view}>
                            <Text style={[styles.textFont, styles.headingStyle]}>{i18n.t('lanLabelTo')}</Text>
                            <Text style={[styles.textStyle, styles.textFont]} >{data.messageBy == 'Service Provider' ? data.euName + ' ' + '(' + data.euUserId.userAccount + ')' : data.spServiceProvider + ' '}{data.messageBy == 'Service Provider' ? '' : (data.spUserId && data.spUserId.userAccount) ? '(' + data.spUserId.userAccount + ')' : ''}</Text>
                        </View>

                        <View style={styles.view}>
                            <Text style={[styles.textFont, styles.headingStyle]}>{i18n.t('lanLabelMessageOn')}</Text>
                            <Text style={[styles.textStyle, styles.textFont]} >{moment(data.createdOn).add(5, 'hours').add(30, 'minutes').format('MMMM Do YYYY, h:mm a')}</Text>
                        </View>
                    </View>
                    <View style={styles.getCenterView} >
                      <AwesomeButton block success
                            onPress={() => this.handleReply()}
                            width={DEVICE_WIDTH / 3} height={44} backgroundColor='#01a4a2' backgroundShadow='#01a4a2' backgroundDarker='#01a4a2' paddingHorizontal={50} borderRadius={22} >
                            <Text style={styles.BtnText} > {i18n.t('lanLabelReply')} </Text>
                        </AwesomeButton> 
                    </View>
                </ScrollView>
                <Modal isVisible={this.state.isDeleteModalVisible}>
                    <View style={styles.modalView}>
                        <View style={styles.modalContainerStyles}>
                            <View style={styles.txtInfoViewStyle}>
                                <Text style={styles.txtInfo}> {i18n.t('lanLabelAreYouSureYouWantToDelete')} </Text>
                            </View>
                            <View style={styles.btnsParentView} >
                                <View style={styles.eachBtnView} >
                                    <Button onPress={() => this.handleDelete(data)} style={styles.btnStyle}>
                                        <Text style={styles.btnTxt} > {i18n.t('lanButtonDelete')} </Text>
                                    </Button>
                                </View>
                                <View style={styles.eachBtnView} >
                                    <Button onPress={() => this.setState({ isDeleteModalVisible: false })} style={styles.cancelBtn} >
                                        <Text style={styles.btnTxt}> {i18n.t('lanButtonCancel')}</Text>
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}
export default Messages