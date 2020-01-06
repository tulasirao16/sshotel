import React from 'react';
// import { observer, inject } from 'mobx-react';
import { Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { View, Text, Icon, Button } from 'native-base';
import styles from './css/BookingHistoryCompontCss';
import AwesomeButton from "react-native-really-awesome-button";

export default class BookingHistoryCompont extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    return {
      header: null,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.mainView}>
        <View style={styles.mainComponentView}>
          <View style={styles.hoteContentView} >
            <View style={styles.hotelDetails} >
              <Text style={styles.textBig}>Hotel Name</Text>
              <Text style={styles.textMedium}>Hyderabad</Text>
              <Text style={styles.textSmall}>Checkin Date and Chekout Date</Text>
              <Text style={styles.textMedium}>Customer Name: Nagaraju</Text>
              <Text style={styles.textMedium}>Customer Number: 9948040212</Text>
            </View>
            {/* <AwesomeButton block success
              onPress={this._validateForm}
              width={100} height={30} backgroundColor='#545374' backgroundShadow='#545374'
              backgroundDarker='#000' paddingHorizontal={30} borderRadius={25} >
              <Text  style={{ color: 'white' }} > Give rating</Text>
            </AwesomeButton> */}
          </View>
          <View style={styles.hoteStatusView} >
            <View style={styles.StatusCircle} >
              <Text style={styles.statusTxt}>P</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

