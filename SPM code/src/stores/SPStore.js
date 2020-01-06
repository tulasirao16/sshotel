import { observable, action } from 'mobx';
import { AsyncStorage } from 'react-native';

import { PUBLIC_DOMAIN } from '../../constants';

export default class SPStore {
  @observable authToken = '';
  @observable isLoading = true;
  @observable internet_connection = true;
  @observable LocationsList = [];
  @observable LocationNoOrders = false;
  @observable SearchHomeLocationNoMatches = false;
  @observable LocationResponse = [];
  @observable totalLocationsCount = 0;

  @observable RatingsReviewsList = []; 
  @observable IsSearchRatingsReviews = false;  
  @observable IsRatingsReviews = false;
  @observable InactiveResponseResponse = []; 

  @action.bound
  async getSpLocationsList(activePage, searchString, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    this.LocationsList = [];
    this.totalLocationsCount = 0;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/sp/services/locations' + '/' + activePage + '/' +  searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        if (response.status == 200) {
          if (activePage != '1') {
              this.LocationsList = this.LocationsList.concat(responseJson.statusResult.locationsList);
              this.totalLocationsCount = responseJson.statusResult.totalDocs;
              this.SearchHomeLocationNoMatches = false;
              this.LocationNoOrders = false;
          } else {
            this.SearchHomeLocationNoMatches = false;
            this.LocationNoOrders = false;
            this.LocationsList = responseJson.statusResult.locationsList;
            this.totalLocationsCount = responseJson.statusResult.totalDocs;
          }
          this.isLoading = false;
      } else {
          if(searchString !== '') {
              this.SearchHomeLocationNoMatches = true;
              this.LocationNoOrders = false;
              this.totalLocationsCount = 0;
          } else {
              this.SearchHomeLocationNoMatches = false;
              this.LocationNoOrders = true;
              this.totalLocationsCount = 0;
          }
          this.isLoading = false;
      }
        callback(responseJson);
      });
    }).catch((error) => {
      this.internet_connection = false;
      alert('No Internet Connectrion')
      this.isLoading = false;
      callback({statusCode: '9999'});
    });
  }

  @action.bound
  async getSpPropertyLocationsList(callback) {
    this.internet_connection = true;
    this.isLoading = true;
    this.LocationsList = [];
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    fetch(PUBLIC_DOMAIN + 'api/sp/property/locations', {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
       authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          this.LocationsList = this.LocationsList.concat(responseJson.statusResult);
        }
        this.isLoading = false;
        callback(responseJson)
      });
    }).catch((error) => {
      this.isLoading = false;
      callback({ statusCode: '9999' });
    });
  }

  @action.bound
  async ActiveSPLocationData(recordID, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/sp/locations/Activate/' + recordID, {
      method: 'PUT',
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
    });
  }

  @action.bound
  async InactiveSPLocationData(recordID, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/sp/locations/Inactivate/' + recordID, {
      method: 'PUT',
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
    });
  }

  @action.bound
  async postLocations(locationData, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/sp/locations/create', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(locationData)
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          this.LocationResponse = responseJson.statusResult;
        } else {
          this.LocationResponse = [];
        }
        callback(responseJson);
      });
    }).catch((error) => {
      this.LocationResponse = [];
      callback({ statusCode: '404' });
    });
  }

  @action.bound
  async updateLocations(updateLocationData, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/sp/locations/edit', {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(updateLocationData)
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        callback(responseJson);
      });
    }).catch((error) => {
      callback({ statusCode: '404' });
    });
  }

  @action.bound
  async getAllReviewRatings(activePage, searchString, byDateType, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/host/ratings/' + byDateType + '/' + activePage + '/' + searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          if (activePage != '1') {
            this.RatingsReviewsList = this.RatingsReviewsList.concat(responseJson.statusResult.myfavs);
            this.IsSearchRatingsReviews = false;
            this.IsRatingsReviews = false;
          } else {
            this.RatingsReviewsList = responseJson.statusResult.myfavs;
            this.ReviewListCount = responseJson.statusResult.totalDocs;

            this.IsSearchRatingsReviews = false;
            this.IsRatingsReviews = false;
          }
         } else {
          if (searchString !== '') {
            this.IsSearchRatingsReviews = true;
            this.NoReviews = false;
          } else {
            this.IsSearchRatingsReviews = false;
            this.IsRatingsReviews = true;
          }
          this.isLoading = false;
        }

        callback(responseJson);
      });
      }).catch((error) => {
      this.RatingsReviewsList = [];
      callback({ statusCode: '9999' });
    })
  }
  @action.bound
  async getstatusRatings(reviewId, reviewStatus, callback) {
  let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/host/ratings/status/' + reviewId+ '/' + reviewStatus, {
      method: 'PUT',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          this.InactiveResponse = responseJson.statusResult;
         } else {
          this.InactiveResponseResponse = [];
        }
        callback(responseJson);
      });
    })
      .catch((error) => {
       this.InactiveResponseResponse = [];
        callback({ statusCode: '404' });
      });
  }
}
