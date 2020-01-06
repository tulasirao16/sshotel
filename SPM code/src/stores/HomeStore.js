import { observable, action } from 'mobx';
import { AsyncStorage } from 'react-native';

import { PUBLIC_DOMAIN } from '../../constants';

export default class HomeStore {
  @observable authToken = '';
  @observable isLoading = false;
  @observable internet_connection = true;
  @observable checkInBookingsList = [];
  @observable checkInBookingsListCount = 0;
  @observable checkInBookingsList = [];
  @observable homeScreenBlockedDatesListCount = 0;
  @observable homeScreenBlockedDatesList = [];
  
    
  @action.bound
  async getSPHomeScreenBookingsCount(byDateType, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/dashboard/counts/' + byDateType, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        callback(responseJson);
      });
    }).catch((error) => {
      callback({ statusCode: '9999' });
    })
  }
      
  @action.bound
  async getSPCheckInBookingsList(byDateType, pageNum, searchString,  callback) {
    this.isLoading = true
    if (pageNum == 1) {
      this.checkInBookingsList = [];
      this.checkInBookingsListCount = 0;
    }
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/sp/homescreen/checkins/counts/bookings/list/' + byDateType + '/' + pageNum + '/' + searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        if (response.status == 200) {
          if(searchString == '' && pageNum > 1) {
            this.checkInBookingsList = this.checkInBookingsList.concat(responseJson.statusResult.bookingsData);
            this.checkInBookingsListCount = responseJson.statusResult.totalDocs;
          } else {
            this.checkInBookingsList = responseJson.statusResult.bookingsData;
            this.checkInBookingsListCount = responseJson.statusResult.totalDocs;   
          }
        } else {
          this.checkInBookingsList = [];
          this.checkInBookingsListCount = 0;
        }
        this.isLoading = false
        callback(responseJson);
      });
    }).catch((error) => {
      callback({ statusCode: '9999' });
      this.isLoading = false
    })
  }
      
  @action.bound
  async getSPCheckOutBookingsList(byDateType, pageNum, searchString,  callback) {
    this.isLoading = true
    if (pageNum == 1) {
      this.checkInBookingsList = [];
      this.checkInBookingsListCount = 0;
    }
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/sp/homescreen/checkouts/counts/bookings/list/' + byDateType + '/' + pageNum + '/' + searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        if (response.status == 200) {
          if(searchString == '' && pageNum > 1) {
            this.checkInBookingsList = this.checkInBookingsList.concat(responseJson.statusResult.bookingsData);
            this.checkInBookingsListCount = responseJson.statusResult.totalDocs;
          } else {
            this.checkInBookingsList = responseJson.statusResult.bookingsData;
            this.checkInBookingsListCount = responseJson.statusResult.totalDocs;   
          }
        } else {
          this.checkInBookingsList = [];
          this.checkInBookingsListCount = 0;
        }
        this.isLoading = false
        callback(responseJson);
      });
    }).catch((error) => {
      callback({ statusCode: '9999' });
      this.isLoading = false
    })
  }

  @action.bound
  async getSPBookingsCountBookingsList(byDateType, pageNum, searchString,  callback) {
    this.isLoading = true
    if (pageNum == 1) {
      this.checkInBookingsList = [];
      this.checkInBookingsListCount = 0;
    }
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/sp/homescreen/booking/counts/bookings/list/' + byDateType + '/'  + pageNum + '/' + searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        if (response.status == 200) {
          if(searchString == '' && pageNum > 1) {
            this.checkInBookingsList = this.checkInBookingsList.concat(responseJson.statusResult.bookingsData);
            this.checkInBookingsListCount = responseJson.statusResult.totalDocs;
          } else {
            this.checkInBookingsList = responseJson.statusResult.bookingsData;
            this.checkInBookingsListCount = responseJson.statusResult.totalDocs;   
          }
        } else {
          this.checkInBookingsList = [];
          this.checkInBookingsListCount = 0;
        }
        callback(responseJson);
        this.isLoading = false
      });
    }).catch((error) => {
      callback({ statusCode: '9999' });
      this.isLoading = false
    })
  }
 
  @action.bound
  async getSPBookingsCountCancelledList(byDateType, pageNum, searchString,  callback) {
    this.isLoading = true
    if (pageNum == 1) {
      this.checkInBookingsList = [];
      this.checkInBookingsListCount = 0;
    }
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/sp/homescreen/booking/counts/cancelled/list/' + byDateType + '/'  + pageNum + '/' + searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        if (response.status == 200) {
          if(searchString == '' && pageNum > 1) {
            this.checkInBookingsList = this.checkInBookingsList.concat(responseJson.statusResult.bookingsData);
            this.checkInBookingsListCount = responseJson.statusResult.totalDocs;
          } else {
            this.checkInBookingsList = responseJson.statusResult.bookingsData;
            this.checkInBookingsListCount = responseJson.statusResult.totalDocs;   
          }
        } else {
          this.checkInBookingsList = [];
          this.checkInBookingsListCount = 0;
        }
        this.isLoading = false
        callback(responseJson);
      });
    }).catch((error) => {
      callback({ statusCode: '9999' });
      this.isLoading = false
    })
  }
   
  @action.bound
  async getSPBookingsAmountsList(byDateType, pageNum, searchString,  callback) {
    this.isLoading = true
    if (pageNum == 1) {
      this.checkInBookingsList = [];
      this.checkInBookingsListCount = 0;
    }
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/sp/homescreen/booking/amounts/list/' + byDateType + '/'  + pageNum + '/' + searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        if (response.status == 200) {
          if(searchString == '' && pageNum > 1) {
            this.checkInBookingsList = this.checkInBookingsList.concat(responseJson.statusResult.bookingsData);
            this.checkInBookingsListCount = responseJson.statusResult.totalDocs;
          } else {
            this.checkInBookingsList = responseJson.statusResult.bookingsData;
            this.checkInBookingsListCount = responseJson.statusResult.totalDocs;   
          }
        } else {
          this.checkInBookingsList = [];
          this.checkInBookingsListCount = 0;
        }
        this.isLoading = false
        callback(responseJson);
      });
    }).catch((error) => {
      callback({ statusCode: '9999' });
      this.isLoading = false
    })
  }
    
  @action.bound
  async getSPHomeScreenBlockedDatesList(pageNum, searchString, byDateType,  callback) {
    this.checkInBookingsList = [];
    this.checkInBookingsListCount = 0;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/sp/homescreen/blockedDates/list/' + byDateType + '/' + pageNum + '/' + searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        if (response.status == 200) {
          if(searchString == '' && pageNum > 1) {
            this.homeScreenBlockedDatesList = this.homeScreenBlockedDatesList.concat(responseJson.statusResult.blockedDatesData);
            this.homeScreenBlockedDatesListCount = responseJson.statusResult.totalDocs;
          } else {
            this.homeScreenBlockedDatesList = responseJson.statusResult.blockedDatesData;
            this.homeScreenBlockedDatesListCount = responseJson.statusResult.totalDocs;   
          }
        } else {
          this.homeScreenBlockedDatesList = [];
          this.homeScreenBlockedDatesListCount = 0;
        }
        callback(responseJson);
      });
    }).catch((error) => {
      callback({ statusCode: '9999' });
    })
  }

}
