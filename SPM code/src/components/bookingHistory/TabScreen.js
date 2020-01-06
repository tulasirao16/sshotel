import React from 'react';
// import { observer, inject } from 'mobx-react';
import { Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { View, Text, Icon, Button, Left, Body, Right } from 'native-base';
import styles from './css/BookingHistoryCompontCss';
import AwesomeButton from "react-native-really-awesome-button";

export default class TabScreen extends React.Component {
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
              <Text style={styles.textMedium}>Hyderabad, Telangana</Text>
              <Text style={styles.textSmall}>Booked : 2 Days</Text>
            </View>
            {/* <View style={styles.enduserDetails} >
              <View style={{ flexDirection: 'row', marginBottom:5, }}>
              <View style={{justifyContent:'center', alignItems:'center'}}>
                <Icon name='person' style={styles.personIcon}/>
              </View>
                <Text style={styles.textMedium}>Enduser Name </Text>
              </View>
              <View style={{ flexDirection: 'row', marginBottom:5, }}>
              <View style={{justifyContent:'center', alignItems:'center'}}>
                <Icon name='call' style={styles.calIcon}/>
              </View>
                <Text style={styles.textMedium}>1234567890</Text>
              </View>
              <View style={{ flexDirection: 'row', marginLeft:25, }}>
                  <Icon name='star' style={styles.starIcon} />
                  <Icon name='star' style={styles.starIcon}/>
                  <Icon name='star' style={styles.starIcon}/>
                  <Icon name='star' style={styles.starIcon}/>
                  <Icon name='star' style={styles.starIcon}/>
              </View>
            </View> */}
          </View>
          <View style={styles.hoteStatusView} >
            <View style={styles.pendingCircle} >
              <Text style={styles.bookedText}>Booked</Text>
            </View>
          </View>
        </View>
        <View style={styles.mainComponentView}>
          <View style={styles.hoteContentView} >
            <View style={styles.hotelDetails} >
              <Text style={styles.textBig}>Hotel Name</Text>
              <Text style={styles.textMedium}>Hyderabad, Telangana</Text>
              <Text style={styles.textSmall}>Booked : 4 Days</Text>
            </View>
          </View>
          <View style={styles.hoteStatusView} >
            <View style={styles.pendingCircle} >
              <Text style={styles.canceledTxt}>Cancelled</Text>
            </View>
          </View>
        </View>
        <View style={styles.mainComponentView}>
          <View style={styles.hoteContentView} >
            <View style={styles.hotelDetails} >
              <Text style={styles.textBig}>Hotel Name</Text>
              <Text style={styles.textMedium}>Hyderabad, Telangana</Text>
              <Text style={styles.textSmall}>Booked : 6 Days</Text>
            </View>
          </View>
          <View style={styles.hoteStatusView} >
            <View style={styles.pendingCircle} >
              <Text style={styles.completedTxt}>Compeletd</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

