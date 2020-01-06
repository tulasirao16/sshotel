import { observable, action } from 'mobx';
import { AsyncStorage } from 'react-native';

import { PUBLIC_DOMAIN } from '../../constants';

export default class MessageStore {

  @observable authToken = '';
  @observable MessagesList = [];
  @observable MessagesUnReadCount = 0;
  @observable totalMessagesCount = 0;
  @observable internet_connection = true;
  @observable MessagesNoOrders = false;
  @observable SearchHomeMessageNoMatches = false;
  @observable isLoading = true;
  @observable NotificationsList = [];
  @observable totalNotificationsCount = 0;
  @observable SearchHomeNotificationNoMatches = false;
  @observable NotificationsNoOrders = false;
  @observable NotificationsUnReadCount = 0;
  @observable SPChatList = [];
  @observable SPChatListCount = 0;
  @observable SPEUConversationList = []
  @observable SPEUConversationListCount = 0;

  @action.bound
  async getSPMessages(activePage, searchString, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    let headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/messages/' + activePage + '/' + searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          if (activePage != '1') {
            this.MessagesList = this.MessagesList.concat(responseJson.statusResult.messagesList);
            this.totalMessagesCount = responseJson.statusResult.totalDocs;
            this.SearchHomeMessageNoMatches = false;
            this.MessagesNoOrders = false;
          } else {
            this.SearchHomeMessageNoMatches = false;
            this.MessagesList = responseJson.statusResult.messagesList;
            this.totalMessagesCount = responseJson.statusResult.totalDocs;
            this.MessagesNoOrders = false;
          }
          this.isLoading = false;
        } else {
          if (searchString !== '') {
            this.SearchHomeMessageNoMatches = true;
            this.MessagesNoOrders = false;
          } else {
            this.SearchHomeMessageNoMatches = false;
            this.MessagesNoOrders = true;
          }
          this.isLoading = false;
        }
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '9999' });
    });
  }


  @action.bound
  async getServiceProviderChatListAPI(activePage, searchString, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/chat/list/' + activePage + '/' + searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          this.SPChatList = responseJson.statusResult.messageData;
          this.SPChatListCount = responseJson.statusResult.totalDocs
        } else {
          this.SPChatList = [];
          this.SPChatListCount = 0;
        }
        callback(responseJson);
      });
    })
    .catch((error) => {
      this.SPChatList = [];
      this.SPChatListCount = 0;
      callback({ statusCode: '9999' });
    });
  }


  @action.bound
  async getServiceProviderEUConversationAPI(euUserID, propertyId, activePage, searchString, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/serviceprovider/enduser/conversation/'+ euUserID + '/' + propertyId + '/' + activePage + '/' + searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          if (activePage != '1') {
            var upcomingData = responseJson.statusResult.messagesData.reverse()
            var data = upcomingData.concat(this.SPEUConversationList)
            this.SPEUConversationList  = data
            this.SPEUConversationListCount = responseJson.statusResult.totalDocs;
          } else {
            this.SPEUConversationList = responseJson.statusResult.messagesData.reverse();
            this.SPEUConversationListCount = responseJson.statusResult.totalDocs
          }
        } else {
          this.SPEUConversationList = [];
          this.SPEUConversationListCount = 0;
        }
        callback(responseJson);
      });
    })
    .catch((error) => {
      this.SPEUConversationList = [];
      this.SPEUConversationListCount = 0;
      callback({ statusCode: '9999' });
    });
  }

    
  @action.bound
  async postSPSendMessage(post_json, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/send/message', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(post_json)
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          callback(responseJson)
        } else {
          callback(responseJson)
        }
      });
    })
      .catch((error) => {
        callback({ statusCode: '9999' });
      });
  }


  @action.bound
  async putSPReadMessageStatusAPI(euUserID, propertyId, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/message/unread/to/read/'+ euUserID+ '/' + propertyId, {
      method: 'PUT',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          callback(responseJson)
        } else {
          callback(responseJson)
        }
      });
    })
      .catch((error) => {
        callback({ statusCode: '9999' });
      });
  }

  @action.bound
  async sendMessage(post_json, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/send/message', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(post_json)
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          callback(responseJson)
        } else {
          callback(responseJson)
        }
      });
    })
      .catch((error) => {
        callback({ statusCode: '9999' });
      });
  }

  @action.bound
  async deleteMessage(body, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/delete/message', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
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
  async setMessageUnReadToRead(messageID, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/message/unread/to/read/' + messageID, {
      method: 'PUT',
      headers: headers
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          callback(responseJson)
        } else {
          callback(responseJson)
        }
      });
    })
      .catch((error) => {
        callback({ statusCode: '9999' });
      });
  }

  @action.bound
  async setMessageReadToUnRead(messageID, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/message/read/to/unread/' + messageID, {
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
  async getSPMessagesUnReadCount(callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/count/messages', {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          this.MessagesUnReadCount = responseJson.statusResult;
        } else {
          this.MessagesUnReadCount = 0;
        }
        callback(responseJson);
      });
    })
      .catch((error) => {
        this.MessagesUnReadCount = 0;
        callback({ statusCode: '9999' });
      });
  }

  @action.bound
  async getSPNotificationsData(activePage, searchString, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    let headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/notification/' + activePage + '/' + searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          if (activePage != '1') {
            this.NotificationsList = this.NotificationsList.concat(responseJson.statusResult.notificationsData);
            this.totalNotificationsCount = responseJson.statusResult.totalDocs;
            this.SearchHomeNotificationNoMatches = false;
            this.NotificationsNoOrders = false;
          } else {
            this.SearchHomeNotificationNoMatches = false;
            this.NotificationsNoOrders = false;
            this.NotificationsList = responseJson.statusResult.notificationsData;
            this.totalNotificationsCount = responseJson.statusResult.totalDocs;
          }
          this.isLoading = false;
        } else {
          if (searchString !== '') {
            this.SearchHomeNotificationNoMatches = true;
            this.NotificationsNoOrders = false;
          } else {
            this.SearchHomeNotificationNoMatches = false;
            this.NotificationsNoOrders = true;
          }
          this.isLoading = false;
        }
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '9999' });
    });
  }

  @action.bound
  async setNotificationsUnReadToRead(callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/notification/unread/to/read', {
      method: 'PUT',
      headers: headers
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          callback(responseJson)
        } else {
          callback(responseJson)
        }
      });
    })
      .catch((error) => {
        callback({ statusCode: '9999' });
      });
  }

  @action.bound
  async getSPNotificationsUnReadCount(callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    let headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/unread/notification/count', {
      method: 'GET',
      headers: headers
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          this.NotificationsUnReadCount = responseJson.statusResult;
        } else {
          this.NotificationsUnReadCount = 0;
        }
        callback(responseJson)
      })
    }).catch((error) => {
      this.NotificationsUnReadCount = 0;
      callback({ statusCode: '9999' })
    })
  }
  @action.bound
  async deleteNotification(post_json, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/notification/delete', {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(post_json)
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          callback(responseJson)
        } else {
          callback(responseJson)
        }
      });
    })
      .catch((error) => {
        callback({ statusCode: '9999' });
      });
  }
};