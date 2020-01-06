import { observable, action } from 'mobx';
import { AsyncStorage } from 'react-native';

import { PUBLIC_DOMAIN } from '../../constants';

export default class BookingStore {
  @observable authToken = '';
  @observable ServiceProviderBookingsData = [];
  @observable isLoading = false;
  @observable  internet_connection = true;
  @observable AvailableRoomCount = [];

  @action.bound
  async getServiceProviderBookingsData(pageNum, searchString, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI3YmEzYWQyMC01ODZiLTExZTktOTA2ZS0wNThiYTRkMDFhNzQiLCJ1YSI6IkVVSUQwMSIsInVlIjoic2FpbWl0dHU3MjZAZ21haWwuY29tIiwidW1uIjoiNzc5OTk5MjAyMCIsInVyIjoiQ3VzdG9tZXIiLCJudCI6IkV4cG9uZW50UHVzaFRva2VuW3RQd3hRVkJCT0dlSG53TnY3dkNEOFRdIiwidXByZiI6eyJkZWZhdWx0TGFuZ3VhZ2UiOiJFbmdsaXNoIiwiZGVmYXVsdFRpbWV6b25lIjoiSVNUIiwiZGVmYXVsdEN1cnJlbmN5IjoiSU5SIiwiY3VycmVuY3lGb3JtYXQiOiIjLCMjIy4jIyIsImRhdGVGb3JtYXQiOiJNTU0gREQsIFlZWVkiLCJyb3dzUGVyUGFnZSI6IjEwIn0sImV4cCI6MTU1NTU3MzI1MTYxOX0.1rsgKRwpj3RhIKAwktIlb0upDi6Y6hgMfd3JkR7WsrY' };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/service/bookings/' + pageNum + '/' + searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
            // this.ServiceProviderBookingsData = this.ServiceProviderBookingsData.concat(responseJson.statusResult);
            this.isLoading = false;
          if (pageNum != 1) {
            this.ServiceProviderBookingsData = this.ServiceProviderBookingsData.concat(responseJson.statusResult);
          } else {
            this.ServiceProviderBookingsData = responseJson.statusResult;
          }
        } else {
          this.ServiceProviderBookingsData = [];
          this.isLoading = false;
        }
        callback(responseJson);
      });
    }).catch((error) => {
      callback({ statusCode: '9999' });
      this.internet_connection = false;
      this.ServiceProviderBookingsData = [];
      this.isLoading = false;
    })
  }

  @action.bound
  async setEndUserBooking(post_json, callback) {
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/eu/booking/sp', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(post_json)
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        // if (response.status == 200) {
        //   this.BookingResponse = responseJson.statusResult;
        // } else {
        //   this.BookingResponse = [];
        // }
        this.isLoading = false;
        callback(responseJson);
      });
    })
      .catch((error) => {
        this.isLoading = false;
        // this.BookingResponse = [];
        callback({ statusCode: '9999' });
      });
  }

  @action getBookingRoomsCount(data, callback) {
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': this.authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/eu/booking/sppty/available/count', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    }).then((response) => {
      response.json().then((responseJson) => {
        if (response.status == 200) {
          this.AvailableRoomCount = responseJson.statusResult;
        } else {
          this.AvailableRoomCount = [];
        }
        callback(responseJson);
      });
    })
      .catch((error) => {
        this.AvailableRoomCount = [];
        callback({ statusCode: '9999' });
      });
  }

  @action.bound
  async putEndUserBooking(put_json, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/eu/update/booking/sp', {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(put_json)
    }).then((response) => {
      response.json().then((responseJson) => {
        this.isLoading = false;
        callback(responseJson);
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '9999' });
    });
  }

  @action.bound
  async getRefundAmountBooking(bookingId, checkInDate, callback){
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/eu/cancel/booking/' + bookingId + '/' + checkInDate, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        this.isLoading = false;
        callback(responseJson);
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '9999' });
    })

  }

  @action.bound
  async confirmCancelBooking(put_json, callback){
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/eu/confirm/cancel/booking', {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(put_json)
    }).then((response) => {
      response.json().then((responseJson) => {
        this.isLoading = false;
        callback(responseJson);
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '9999' });
    })
  }

  @action.bound
  async getSPBookingData(recordId, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/booking/' + recordId, {
      method: 'GET',
      headers: headers
    }).then((response) => {
      response.json().then((responseJson) => {
        this.isLoading = false;
        callback(responseJson);
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '9999' });
    })
  }
}
