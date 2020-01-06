import React from 'react';
import { ActivityIndicator, AsyncStorage, BackHandler, Image, StyleSheet, Platform, Dimensions, Animated, TouchableOpacity, ScrollView, Keyboard, UIManager, TextInput, KeyboardAvoidingView, RefreshControl } from 'react-native';
import { Button, Container, Header, Content, Form, Icon, View, Text, List, Switch, Left, Body, Right, ListItem, Item, Input, Label, Card, CardItem } from 'native-base';
import styles from './css/GuestRulesViewCss';
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import ToggleSwitch from 'toggle-switch-react-native';
import FloatingLabelInput from '../../components/floatingLabels/FloatingLabelInput';
import { inject, observer } from 'mobx-react';
const DEVICE_WIDTH = Dimensions.get(`window`).width;
import { PUBLIC_DOMAIN } from '../../../constants';
import i18n from 'i18n-js';

@inject(['PropertyStore'])
@observer
export default class GuestRulesViewScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    const navigation = this.props.navigation;
    this.state = {

    };
  }
  render() {
    const navigation = this.props.navigation;
    const PropertyStore = this.props.PropertyStore;
    let PIGuestRulesViewData = navigation.state.params.PIGuestRulesViewData;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <LinearGradient colors={['#019fa0', '#025d8c']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <View style={styles.headerMainView}>
              <View style={styles.headerLeft}>
                <View>
                  <Icon name='ios-arrow-back' style={styles.iconMenuStyle} onPress={() => navigation.goBack()} />
                </View>
              </View>
              <View style={styles.headerBody}>
                <View>
                  <Text style={styles.headerTitleStyle}>{i18n.t('lanTitleGuestRuleView')}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.list}>
              <View style={styles.LeftView}>
                <Image source={(PIGuestRulesViewData && PIGuestRulesViewData.ruleIconPath) ? { uri: PUBLIC_DOMAIN + PIGuestRulesViewData.ruleIconPath } : require('../../../assets/icon11.png')} style={styles.images} />
              </View>
              <View style={styles.CenterView}>
                <View>
                  <Label style={styles.labelTxt}>{i18n.t('lanLabelRuleName')}</Label>
                  <Text style={styles.textMedium}> {PIGuestRulesViewData.ruleName}</Text>
                </View>
              </View>
              <View style={styles.RightView}>
                <View>
                  <Label style={styles.labelTxt}>{i18n.t('lanLabelRuleStatus')}</Label>
                  <Text style={[styles.textMedium, styles.textColor]}> {PIGuestRulesViewData.ruleStatus}</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

