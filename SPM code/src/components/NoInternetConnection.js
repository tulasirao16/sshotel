import React from 'react';
import { Button, Text, TouchableOpacity, View, Platform } from 'react-native';
import { Icon } from 'native-base';
import styles from '../components/houseRules/css/routerCss';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from 'i18n-js';

export default class NoInternetScreen extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => {
        const { params = {} } = navigation.state;
        return {
            header: null
        }
    };
    constructor(props) {
        super(props)
        const navigation = props.navigation
        this.state = {
        }
        this.handleNavigation = this.handleNavigation.bind(this)
    }
    handleNavigation() {
        const navigation = this.props.navigation
        navigation.goBack()
    }
    render() {
        return (
            // <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            //     <Text style={{ fontFamily: 'Roboto_medium', fontSize: 16, color: 'black' }}>No Internet Connection</Text>
            //     <Button
            //         title='Go Back'
            //         onPress={this.handleNavigation}
            //     />
            // </View>
        <View style={{ flex: 1 }}>
          <LinearGradient colors={['#01A4A2', '#025D8C']} start={[0.0, 0.5]} end={[1.0, 0.5]} locations={[0.0, 1.0]} style={styles.linearStyles}>
            <View style={styles.headerMainViewReload} >
              <View style={styles.headerBodyNoInternet} >
                <TouchableOpacity>
                  <Text style={styles.headerTitleStyle}>{i18n.t('lanAppTitle')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 200 }} >
            <Button title='Go Back' onPress={this.handleNavigation} />
            <Text style={{ fontFamily: 'Roboto_medium', fontSize: 16, color: 'black'}}>No Internet Connection</Text>
          </View>
        </View>
        )
    }
}