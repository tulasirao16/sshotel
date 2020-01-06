import React from 'react'
import { View, Text, Card, CardItem } from 'native-base';
import { TouchableOpacity } from 'react-native';
import styles from './css/BlockDatesCss'
import moment from 'moment'
import i18n from 'i18n-js';



export default class BlockedDatesRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      propertyData: {},
      status: ''
    }
    this.handleCalendar = this.handleCalendar.bind(this);
  }
  componentWillMount () {
    this.setState({ propertyData: this.props.propertyData, status: this.props.status });
  }
  componentWillReceiveProps () {
    this.setState({ status: this.props.status });
  }

  handleCalendar (data) {
    const navigation = this.props.navigation;
    navigation.navigate('CalendarScreen', {data: {bkdData: data, propertyData: this.state.propertyData, status: this.state.status}});
  }

  render() {
    const data = this.props.data;
    return (
      <View>
         <TouchableOpacity onPress={()=> this.handleCalendar(data)} >
            <Card style={styles.card}>
              <CardItem style={styles.cardItem}>
                <View style={styles.listMain}>
                  <Text style={styles.ServiceTitle}> {data.propertyId.propertyTitle} </Text>
                </View>
              </CardItem>
              <CardItem style={styles.cardItem}>
                <View style={styles.listMain}>
                  <View style={styles.timeLabel}>
                    <Text style={styles.bookingTextLabel}> {i18n.t('lanLabelBlockingType')}</Text>
                  </View>
                  <View  style={styles.timeValue}>
                    <Text style={styles.bookingTextEnd}>: {data.blockingType} </Text>
                  </View>
                </View>
              </CardItem>
              <CardItem style={styles.cardItem}>
                <View style={styles.listMain}>
                  <View style={styles.timeLabel}>
                    <Text style={styles.bookingTextLabel}> {i18n.t('lanLabelFromDate')} </Text>
                  </View>
                  <View  style={styles.timeValue}>
                    <Text style={styles.bookingTextEnd}>: {moment(data.blockingFromDate).format('MMM DD, YYYY')} </Text>
                  </View>
                </View>
              </CardItem>

              <CardItem style={styles.cardItem}>
                <View style={styles.listMain}>
                  <View style={styles.timeLabel}>
                    <Text style={styles.bookingTextToLabel}>{i18n.t('lanLabelToDate')} </Text>
                  </View>
                  <View style={styles.timeValue}>
                    <Text style={styles.bookingTextEnd}> : {data.blockingToDate ? moment(data.blockingToDate).format('MMM DD, YYYY'): null} </Text>
                  </View>
                </View>
              </CardItem>
            </Card>
          </TouchableOpacity>
      </View>
    )
  }
}