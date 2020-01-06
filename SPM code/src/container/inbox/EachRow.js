import React from 'react';
import { observer, inject } from 'mobx-react';
import { Container, Button, List, ListItem, Card, CardItem, View, Icon, Text, Left, Right, Body, Content } from 'native-base';
import styles from './css/InboxCompontCss';
import { TouchableOpacity, Image, Dimensions } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import moment from 'moment';

@inject(['MessageStore'])
@observer
export default class EachRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    handleToggleStatus = (isOn, data) => {
        const MessageStore = this.props.MessageStore;
        if (data.spReadStatus == 'Read') {
            MessageStore.setMessageReadToUnRead(data._id, function (resObj) {
                MessageStore.getSPMessages('1', '', function (resObj) {
                    MessageStore.getSPMessagesUnReadCount(function (resObj) {
                    });
                });
            });
        } else {
            MessageStore.setMessageUnReadToRead(data._id, function (resObj) {
                MessageStore.getSPMessages('1', '', function (resObj) {
                    MessageStore.getSPMessagesUnReadCount(function (resObj) {
                    });
                });
            });
        }
    }
    render() {
        const navigation = this.props.navigation;
        const data = this.props.data;
        return (
          <TouchableOpacity onPress={() => navigation.navigate('Messages', { data: data })}>
            <Card key={data._id} style={styles.card}>
                <CardItem style={[data.spReadStatus == 'Unread' ? { backgroundColor: '#d4d4d4', paddingLeft:5, paddingRight:5, paddingTop:5, paddingBottom:5, borderRadius:10, fontWeight:600  } : { backgroundColor: '#fff', paddingLeft:5, paddingRight:5, paddingTop:5, paddingBottom:5, borderRadius:10, fontWeight:500 }]}>
                <View style={{flexDirection:'row' }}>
                  <View style={{flex:1, marginRight:20, }}> 
                    <View style={styles.imageView}>
                    <Text style={styles.number}>{moment(data.createdOn).format('MMM DD')}</Text>
                    </View>
                  </View>
                  <View style={{flex:7 }}>
                    <View style={styles.listItemBodyStyle}>
                      <Text style={styles.note}>{data.messageBy == 'Service Provider' ? 'You' : data.messageBy == 'End User' ? data.euName : 'Admin:' + data.adminName}</Text>
                      <Text style={styles.mainText}>{data.message}</Text>
                      <Text style={styles.dateTime}>{moment(data.createdOn).add(5, 'hours').add(30, 'minutes').format('LT')}</Text>
                    </View>
                  </View>
                        {/* <View style={styles.toggleSwitch}>
                        {data.messageBy !== 'Service Provider' ?
                            <ToggleSwitch
                                isOn={data.spReadStatus == 'Unread' ? false : true}
                                onColor='#5cb85c'
                                offColor='#c70a0a'
                                labelStyle={{ color: 'black', fontWeight: '600' }}
                                size='small'
                                onToggle={(isOn) => this.handleToggleStatus(isOn, data)}
                        /> : null
                        }
                    </View> */}
                </View>
              </CardItem>
            </Card>
          </TouchableOpacity>
        )
    }
}