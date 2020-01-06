import { observable, action } from 'mobx';
import { AsyncStorage } from 'react-native';

import { PUBLIC_DOMAIN } from '../../constants';

export default class SupportStore {
  @observable authToken = '';
  @observable isLoading = false;
  @observable internet_connection = true;
  @observable SignupResponse = {};
  @observable SigninResponse = {};
  @observable ForgotPasswordResponse = [];
  @observable otpResponse = [];
  @observable TicketList = [];
  @observable TicketListCount = 0;
  @observable SearchHomeMessageNoMatches = false;


  @action.bound
  async getSPSupportData(activePage, searchString, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    this.isLoading = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/support/' + activePage + '/' + searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          if (activePage != '1') {
            this.TicketList = this.TicketList.concat(responseJson.statusResult.supportData);
            this.totalTicketsCount = responseJson.statusResult.totalDocs;
            this.SearchHomeMessageNoMatches = false;
            this.TicketsNoOrders = false;
          } else {
            this.TicketList = responseJson.statusResult.supportData;
            this.totalTicketsCount = responseJson.statusResult.totalDocs;
            this.SearchHomeMessageNoMatches = false;
            this.TicketsNoOrders = false;
          }
          this.isLoading = false;
        } else {
          this.TicketList = [];
          this.totalTicketsCount = 0;
          if (searchString !== '') {
            this.SearchHomeMessageNoMatches = true;
            this.TicketsNoOrders = false;
          } else {
            this.SearchHomeMessageNoMatches = false;
            this.TicketsNoOrders = true;
          }
          this.isLoading = false;
        }
        callback(responseJson);
      });
    })
      .catch((error) => {
        this.internet_connection = false;
        // this.MessagesList = [];
        this.isLoading = false;
        callback({ statusCode: '9999' });
      });
  }

  @action.bound
  async createSupport(post_json, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/support/create', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(post_json)
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
  async updateSPSupportData(ticketId, put_json, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/support/edit/' + ticketId, {
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
}
