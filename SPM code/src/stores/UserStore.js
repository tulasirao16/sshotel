import { observable, action } from 'mobx';
import { AsyncStorage } from 'react-native';
import moment from 'moment';

import { PUBLIC_DOMAIN } from '../../constants';

export default class UserStore {
  @observable authToken = '';
  @observable isLoading = false;
  @observable internet_connection = true;
  @observable SignupResponse = {};
  @observable SigninResponse = {};
  @observable ForgotPasswordResponse = [];
  @observable otpResponse = [];
  @observable UsersListingData = [];
  @observable UsersListingDataCount = 0;
  @observable IDProofsList = [];
  @observable totalIDProofsCount = 0;
  @observable IDProofsNoOrders = false;
  @observable UsersListingNoData = false;
  @observable checkIn = moment().format('YYYY-MM-DD');
  @observable checkOut = moment().add(1, 'days').format('YYYY-MM-DD');


  @action.bound
  async supplierSignin(reqObj, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    AsyncStorage.removeItem('authToken');
    AsyncStorage.removeItem('authObj');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/signin', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(reqObj)
    }).then((response) => {
      response.json().then((responseJson) => {
        if (response.status == 200) {
          let authToken = response.headers.get('token');
          AsyncStorage.setItem('authToken', String(authToken));
          this.SigninResponse = responseJson.statusResult;
        } else {
          this.SigninResponse = {};
        }
        this.isLoading = false;
        callback(responseJson);
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '404' });
    });
  }

  @action.bound
  async supplierSignupSendOTP(post_json, callback) {
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    this.internet_connection = true; this.isLoading = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/signup/sendotp', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(post_json)
    }).then((response) => {
      response.json().then((responseJson) => {
        let otpToken = response.headers.get('otp_token');
        AsyncStorage.setItem('otp_token', String(otpToken));
        this.isLoading = false;
        callback(responseJson);
      });
    }).catch((error) => {
      this.internet_connection = false; this.isLoading = false;
      callback({ statusCode: '404' });
    });
  }

  @action.bound
  async supplierSignupValidateOTP(post_json, callback) {
    let otpToken = await AsyncStorage.getItem('otp_token');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'otp_token': otpToken };
    this.internet_connection = true; this.isLoading = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/signup/verifyotp', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(post_json)
    }).then((response) => {
      response.json().then((responseJson) => {
        if (response.status == 200) {
          AsyncStorage.removeItem('otp_token');
        }
        this.isLoading = false;
        callback(responseJson);
      });
    }).catch((error) => {
      this.internet_connection = false; this.isLoading = false;
      callback({ statusCode: '404' });
    });
  }


  @action.bound
  async supplierSignupOnboarding(post_json, callback) {
    let otpToken = await AsyncStorage.getItem('otp_token');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'otp_token': otpToken };
    this.internet_connection = true; this.isLoading = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/signup/ticket', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(post_json)
    }).then((response) => {
      response.json().then((responseJson) => {
        this.isLoading = false;
        callback(responseJson);
      });
    }).catch((error) => {
      this.internet_connection = false; this.isLoading = false;
      callback({ statusCode: '404' });
    });
  }

  @action.bound
  async supplierSignupValidateUserID(userAccount, callback) {
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    this.internet_connection = true; this.isLoading = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/validate/userid', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ userID: userAccount })
    }).then((response) => {
      response.json().then((responseJson) => {
        this.isLoading = false;
        if (response.status == 200) {
          callback(true);
        } else {
          callback(false);
        }
      });
    }).catch((error) => {
      this.internet_connection = false; this.isLoading = false;
      callback(false);
    });
  }

  @action.bound
  async supplierSignup(post_json, callback) {
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    this.internet_connection = true; this.isLoading = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/signup', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(post_json)
    }).then((response) => {
      response.json().then((responseJson) => {
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          this.SignupResponse = responseJson.statusResult;
        } else {
          this.SignupResponse = {};
        }
        this.isLoading = false;
        callback(responseJson);
      });
    }).catch((error) => {
      this.internet_connection = true; this.isLoading = false;
      callback({ statusCode: '404' });
    });
  }

  @action.bound
  async getSPUsersListingData(pageNum, searchString, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/users/list/' + pageNum + '/' + searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        if (response.status == 200) {
          let authToken = response.headers.get('token');
          AsyncStorage.setItem('authToken', String(authToken));
          this.UsersListingNoData = false;
          if (searchString == '' && pageNum > 1) {
            this.UsersListingData = this.UsersListingData.concat(responseJson.statusResult.userData);
            this.UsersListingDataCount = responseJson.statusResult.totalDocs;
          } else {
            this.UsersListingData = responseJson.statusResult.userData;
            this.UsersListingDataCount = responseJson.statusResult.userData.length;
          }
        } else {
          this.UsersListingNoData = true;
          this.UsersListingData = [];
          this.UsersListingDataCount = 0;
        }
        this.isLoading = false;
        callback(responseJson);
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '404' });
    });
  }

  @action.bound
  async postSPUserData(post_json, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/create', {
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
  async updateSPUserData(put_json, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/edit', {
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
  async verifyUniqueness(post_json, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/create/uniqueness/verification', {
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
  async activateSPUserData(recordID, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/activate/' + recordID, {
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
  async inActivateSPUserData(recordID, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/inactivate/' + recordID, {
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
  async deleteSPUserData(body, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/delete', {
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
  async getIDProofs(callback) {
    this.internet_connection = true;
    this.isLoading = true;
    this.IDProofsList = [];
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/profile/idproof', {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
       authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          this.IDProofsList = this.IDProofsList.concat(responseJson.statusResult);
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
  async getIdDetails(idType, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/profile/idtype/' + idType, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
       authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        this.isLoading = false;
        callback(responseJson)
      });
    }).catch((error) => {
      this.isLoading = false;
      callback({ statusCode: '9999' });
    });
  }

  @action.bound
  async handleUpdatePassword(loginData, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/sp/profile/changepassword', {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(loginData)
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          this.ChangeNewPasswordResponse = responseJson.statusResult;
        } else {
          this.ChangeNewPasswordResponse = [];
        }
        callback(responseJson);
      });
    })
      .catch((error) => {
        this.ChangeNewPasswordResponse = [];
        callback({ statusCode: '404' });
      });
  }

  @action.bound
  async updateProfilePreference(postData, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/profile/preference/:id', {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(postData)
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        callback(responseJson);
      });
    }).catch((error) => {
      callback({ statusCode: '9999' });
    });
  }

  @action.bound
  async supplierUpdatedData(recordID, data, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/sp/serviceProvider/update/' + recordID, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data)
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
  async postSPForgotPasswordSendOtp(post_json, callback) {
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    this.internet_connection = true;
    this.isLoading = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/forgot/password/sendotp', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(post_json)
    }).then((response) => {
      response.json().then((responseJson) => {
        if (response.status == 200) {
          let authToken = response.headers.get('otp_token');
        AsyncStorage.setItem('authToken', String(authToken));
          this.ForgotPasswordResponse = responseJson.statusResult;
        } else {
          this.ForgotPasswordResponse = [];
        }
        callback(responseJson);
      });
    }).catch((error) => {
      this.ForgotPasswordResponse = [];
      callback({ statusCode: '9999' });
    });
  }

  @action.bound
  async postForgotPasswordOtpValidation(post_json, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'otp_token': authToken };
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/forgot/password/verifyotp', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(post_json)
    }).then((response) => {
      response.json().then((responseJson) => {
        if (response.status == 200) {
          let authToken = response.headers.get('otp_token');
          AsyncStorage.setItem('authToken', String(authToken));
          this.OtpResponse = responseJson.statusResult;
        } else {
          this.OtpResponse = [];
        }
        callback(responseJson);
      });
    })
      .catch((error) => {
        this.OtpResponse = [];
        callback({ statusCode: '9999' });
      });
  }

  @action.bound
  async updateSpPassword(post_json, callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'otp_token': authToken };
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/forgot/password/reset', {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(post_json)
    }).then((response) => {
      response.json().then((responseJson) => {
       if (response.status == 200) {
          AsyncStorage.removeItem('authToken');
        }
        callback(responseJson);
      });
    }).catch((error) => {
      callback({ statusCode: '9999' });
    });
  }

  @action.bound
  async getUserDetails(userData, callback) {
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/details/' + userData, {
      method: 'GET',
      headers: headers,
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        this.isLoading = false;
        callback(responseJson)
      });
    }).catch((error) => {
      this.isLoading = false;
      callback({ statusCode: '9999' });
    });
  }
  @action.bound
  async getSPUserData(recordId, callback) {
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/user/' + recordId, {
      method: 'GET',
      headers: headers
    }).then((response) => {
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        this.isLoading = false;
        callback(responseJson)
      });
    }).catch((error) => {
      this.isLoading = false;
      callback({ statusCode: '9999' });
    });
  }
}
