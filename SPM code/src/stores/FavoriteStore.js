import { observable, action } from 'mobx';
import { AsyncStorage } from 'react-native';

import { PUBLIC_DOMAIN } from '../../constants';

export default class BookingStore {
  @observable authToken = '';
  @observable isLoading = true;
  @observable  internet_connection = true;
  @observable SPFavouritesData = [];
  @observable SPFavouritesDataCount = null;

  
  @action.bound
  async getSPFavoriteUsers(pageNum, searchString, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/eu/favourites/' + pageNum + '/' + searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          if (pageNum != '1') {
            this.SPFavouritesData = this.SPFavouritesData.concat(responseJson.statusResult.myfavs);
          } else {
            this.SPFavouritesData = responseJson.statusResult.myfavs;
          }
          this.SPFavouritesDataCount = responseJson.statusResult.totalDocs;
        } else {
          this.SPFavouritesData = [];
        }
        callback(responseJson);
      });
    }).catch((error) => {
      callback({ statusCode: '9999' });
    })
  }

  @action.bound
  async unfavouriteUserFromFavourite(put_json, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/users/unfavourite', {
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
  async setUserAsFavourite(put_json, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/users/favourite', {
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
  async deleteUserFromFavourite(put_json, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/favourite/users/delete', {
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