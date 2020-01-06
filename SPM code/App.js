import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Bridge from './src/components/router';
import { Font, AppLoading } from 'expo';
import DueDate from './assets/Fonts/DueDate.ttf';
import {Provider} from 'mobx-react';
import stores from './src/stores';

export default class App extends React.Component {
  state={
    isReady: false
  }
  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto_light': require('./assets/Fonts/Montserrat-Light.ttf'),
      'Roboto_medium': require('./assets/Fonts/Montserrat-Medium.ttf'),
      'Roboto_bold': require('./assets/Fonts/Montserrat-Bold.ttf'),
      'Roboto_Italic': require('./assets/Fonts/Montserrat-Italic.ttf'),
      DueDate:DueDate,
      FontAwesome: require('./node_modules/react-native-vector-icons/Fonts/FontAwesome.ttf'),
      Ionicons: require('./node_modules/react-native-vector-icons/Fonts/Ionicons.ttf'),
      MaterialIcons: require('./node_modules/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
      MaterialCommunityIcons: require('./node_modules/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf')
    });
    this.setState({isReady:true})
  }
  // async componentWillMount() {
  //   await Font.loadAsync({
  //     Roboto: Montserrat_Light,
  //     Roboto_light: Montserrat_Light,
  //     Roboto_medium: Montserrat_medium,
  //     Roboto_Italic:Montserrat_Italic,
  //     Roboto_bold: Montserrat_Bold,
  //     DueDate:DueDate,
  //     FontAwesome: require('./node_modules/react-native-vector-icons/Fonts/FontAwesome.ttf'),
  //     Ionicons: require('./node_modules/react-native-vector-icons/Fonts/Ionicons.ttf'),
  //     MaterialIcons: require('./node_modules/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
  //     MaterialCommunityIcons: require('./node_modules/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf')
  //   });
  // }
  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }
    return (
      <Provider {...stores}>
        <Bridge />
      </Provider>
    );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily:'Roboto_medium',
  },
});
