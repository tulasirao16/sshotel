import { observable, action } from 'mobx';
import { AsyncStorage } from 'react-native';

import { PUBLIC_DOMAIN } from '../../constants';
import moment from 'moment';
export default class PropertyStore {
  @observable authToken = '';
  @observable isLoading = false;
  @observable isLoadingUpdate = false;
  @observable  internet_connection = true;
  @observable PropertiesList = [];
  @observable totalPropertiesCount = 0;
  @observable SearchHomePropertyNoMatches = false;
  @observable PropertyNoOrders = false;
  @observable PropertyInfoList = [];
  @observable PropertyInfoDubList = [];
  @observable totalPropertyInfoCount = 0;
  @observable SearchPropertyInfoNoMatches = false;
  @observable PropertyInfoNoOrders = false;
  @observable BlockedDatesUpComingList = [];
  @observable BlockedDatesUpComingDummyList = [];
  @observable BlockedDatesPastList = [];
  @observable BlockedDatesPastDummyList = [];
  @observable totalBlockedCount = 0;
  @observable SearchBlockedNoMatches = false;
  @observable PropertyBlockedNoOrders = false;
  @observable Pricing = {};
  @observable InfoPricing = {};
  @observable GuestRules = [];
  @observable AvailableGuests = [];
  @observable Amenities = [];
  @observable AmenitiesAvailable = [];
  @observable Services = [];
  @observable ServicesAvailable = [];
  @observable DummyServicesAvailable = [];
  @observable BookingData = [];
  @observable BookingListingDataCount = 0;
  @observable PropertyInfoServicesList = [];
  @observable BlockedPastDatesList = [];
  @observable guestRulesNotes = '';
  @observable GuestRulesAvaliable = [];
  @observable DummyGuestRulesAvaliable = [];
  @observable refresh = '';
  @observable AvaliableAmenities = [];
  @observable DummyAvaliableAmenities = [];
  @observable GuestRulesObj = [];
  @observable createPropertyLocation = {};
  @observable createPropertyInfo = {};
  @observable createBlockedDates = {};
  @observable PropertyImages = [];
  @observable NearestAreas = [];
  @observable locationItem = 0;
  @observable selectedService = false;
  @observable selectedAminities = false;
  @observable selectedGuestRules = false;
  @observable PricingView = {};
  @observable selectedPricing = false;
  @action.bound
  async getSpProperties(activePage, searchString, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    this.totalPropertiesCount = 0;
   let authToken = await AsyncStorage.getItem('authToken');
    let headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/service/properties/' + activePage + '/' + searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => { 
      response.json().then((responseJson) => {
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
            if (activePage != '1') {
                this.PropertiesList = this.PropertiesList.concat(responseJson.statusResult.propertiesList);
                this.totalPropertiesCount = responseJson.statusResult.totalDocs;
                this.SearchHomePropertyNoMatches = false;
                this.PropertyNoOrders = false;
            } else {
              this.SearchHomePropertyNoMatches = false;
              this.PropertyNoOrders = false;
              this.PropertiesList = responseJson.statusResult.propertiesList;
              this.totalPropertiesCount = responseJson.statusResult.totalDocs;
            }
            this.isLoading = false;
        } else {
            if(searchString !== '') {
                this.SearchHomePropertyNoMatches = true;
                this.PropertyNoOrders = false;
                this.totalPropertiesCount = 0;
            } else {
                this.SearchHomePropertyNoMatches = false;
                this.PropertyNoOrders = true;
                this.totalPropertiesCount = 0;
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
  async getSPPropertyInfoList(propertyId, propertyInfoId, searchString,  callback) {
    this.internet_connection = true;
    this.isLoading = true;
    this.AvaliableAmenities = [];
    this.DummyAvaliableAmenities = [];
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/property/info/amenities/' + propertyId + '/' + propertyInfoId + '/' + searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => { 
      response.json().then((responseJson) => {
        this.isLoading = false;
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        this.Amenities = responseJson.statusResult;
        responseJson.statusResult.map((data,i) => {
          if(data.amenityStatus == 'Available') {
            this.AvaliableAmenities.push(data.amenityName);
            this.DummyAvaliableAmenities.push(data.amenityName);
          }
        })
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      this.Amenities = [];
      alert('get Transactions error: ' + error);
      callback({ statusCode: '9999' });
    });
  }

  @action.bound
  async getSPPropertyDocs(propertyId,callback) {
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/service/property/docs/' + propertyId, {
      method: 'GET',
      headers: headers,
    }).then((response) => { 
      response.json().then((responseJson) => {
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        callback(responseJson)
      });
    }).catch((error) => {
      callback({ statusCode: '404' });
    });
  }

  @action.bound
  async getPropertyInfos(propertyID, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    this.PropertyInfoList = [];
    this.PropertyInfoDubList = [];
    let authToken = await AsyncStorage.getItem('authToken');
    let headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/service/property/info/' + propertyID, {
      method: 'GET',
      headers: headers,
    }).then((response) => { 
      response.json().then((responseJson) => {
        authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          this.PropertyInfoList = responseJson.statusResult;
          this.PropertyInfoDubList = responseJson.statusResult;
            this.isLoading = false;
        } else {
          this.PropertyInfoList = [];
          this.PropertyInfoDubList = [];
          this.isLoading = false;
        }
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      this.PropertyInfoList = [];
      this.PropertyInfoDubList = [];
      callback({ statusCode: '9999' });
    });
  }

  @action.bound
  async createPropertyInfoData(post_json,  callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/property/info/create', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(post_json)
    }).then((response) => { 
      response.json().then((responseJson) => {
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        this.isLoading = false;
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '404' });
    }); 
  }

  @action.bound
  async getPropertyBlockedDates(propertyID, callback) {
    this.internet_connection = true;
    this.isLoading = true;
   let authToken = await AsyncStorage.getItem('authToken');
    let headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/service/property/blocked/dates/' + propertyID , {
      method: 'GET',
      headers: headers,
    }).then((response) => { 
      response.json().then((responseJson) => {
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          this.BlockedDatesUpComingList = responseJson.statusResult;
          this.BlockedDatesUpComingDummyList = responseJson.statusResult;
          responseJson.statusResult.map((item, i) => {
            this.BlockedDatesUpComingList[i].blockingFromDate = moment(item.blockingFromDate).format('MMM DD, YYYY');
            this.BlockedDatesUpComingDummyList[i].blockingFromDate = moment(item.blockingFromDate).format('MMM DD, YYYY');
            this.BlockedDatesUpComingList[i].blockingToDate = moment(item.blockingToDate).format('MMM DD, YYYY');
            this.BlockedDatesUpComingDummyList[i].blockingToDate = moment(item.blockingToDate).format('MMM DD, YYYY');
          });
          this.isLoading = false;
        } else {
          this.BlockedDatesUpComingList = [];
          this.BlockedDatesUpComingDummyList = [];
          this.isLoading = false;
        }
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.BlockedDatesUpComingList = [];
      this.BlockedDatesUpComingDummyList = [];
      callback({ statusCode: '9999' });
    });
  }

  @action.bound
  async getPropertyPastBlockedDates(propertyID, callback) {
    this.internet_connection = true;
    this.isLoading = true;
   let authToken = await AsyncStorage.getItem('authToken');
    let headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/service/property/past/blocked/dates/' + propertyID , {
      method: 'GET',
      headers: headers,
    }).then((response) => { 
      response.json().then((responseJson) => {
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        if (response.status == 200) {
          this.BlockedDatesPastList = responseJson.statusResult;
          this.BlockedDatesPastDummyList = responseJson.statusResult;
          responseJson.statusResult.map((item, i) => {
            this.BlockedDatesPastList[i].blockingFromDate = moment(item.blockingFromDate).format('MMM DD, YYYY');
            this.BlockedDatesPastDummyList[i].blockingFromDate = moment(item.blockingFromDate).format('MMM DD, YYYY');
            this.BlockedDatesPastList[i].blockingToDate = moment(item.blockingToDate).format('MMM DD, YYYY');
            this.BlockedDatesPastDummyList[i].blockingToDate = moment(item.blockingToDate).format('MMM DD, YYYY');
          });
          this.isLoading = false;
        } else {
          this.BlockedDatesPastList = [];
          this.BlockedDatesPastDummyList = [];
          this.isLoading = false;
        }
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.BlockedDatesPastList = [];
      this.BlockedDatesPastDummyList = [];
      callback({ statusCode: '9999' });
    });
  }

  @action.bound
  async deleteBlockedDate(blockedID, callback) {
    this.internet_connection = true;
    this.isLoading = true;
   let authToken = await AsyncStorage.getItem('authToken');
    let headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/service/property/delete/blocked/date/' + blockedID , {
      method: 'DELETE',
      headers: headers,
    }).then((response) => { 
      response.json().then((responseJson) => {
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      callback({ statusCode: '9999' });
    });
  }

  @action.bound
  async getSPPropertyInfoPricingList(searchString,  callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/property/info/pricing' + '/' +  searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => { 
      response.json().then((responseJson) => {
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        this.isLoading = false;
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '404' });
    });
  }

    @action.bound
  async getInfoServices(propertyID, propertyInfoId,  callback) {
    this.internet_connection = true;
    this.isLoading = true;
    this.ServicesAvailable = [];
    this.DummyServicesAvailable = [];
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/property/info/services/' + propertyID + '/' + propertyInfoId, {
      method: 'GET',
      headers: headers,
    }).then((response) => { 
      response.json().then((responseJson) => {
        if (response.status == 200) {
          let authToken = response.headers.get('token');
          AsyncStorage.setItem('authToken', String(authToken));
          this.PropertyInfoServicesList = responseJson.statusResult;
          responseJson.statusResult.map((data,i) => {
            if(data.serviceStatus == 'Available') {
              this.ServicesAvailable.push(data.serviceName);
              this.DummyServicesAvailable.push(data.serviceName);
            }
          })
          this.isLoading = false;
        } else {
          this.PropertyInfoServicesList = [];
        }
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '404' });
    });
  }

  @action.bound
  async createSPProperty(post_json,  callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/property/create', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(post_json)
    }).then((response) => { 
      response.json().then((responseJson) => {
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        this.isLoading = false;
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '404' });
    }); 
  }

  @action.bound
  async getPropertyInfoGuestRules(propertyId, propertyInfoId, searchString,  callback) {
    this.internet_connection = true;
    this.isLoading = true;
    this.GuestRulesAvaliable = [];
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/property/info/guest/rules/' + propertyId + '/' + propertyInfoId + '/'  +  searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => { 
      response.json().then((responseJson) => {
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        this.isLoading = false;
        this.guestRulesNotes = responseJson.statusResult[0].propertyInfoId ? responseJson.statusResult[0].propertyInfoId.guestRulesNotes : "" ,
        responseJson.statusResult.map((data,i) => {
          if(data.ruleStatus == 'Active') {
            this.GuestRulesAvaliable.push(data.ruleName);
            this.GuestRulesObj.push(data)
            this.DummyGuestRulesAvaliable.push(data.ruleName);
          }
        })
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '404' });
    });
  }


  @action.bound
  async updatePropertyInfo(propertyId, propertyInfoId, post_json,  callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/property/info/update/' + propertyId + '/' + propertyInfoId, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(post_json)
    }).then((response) => { 
      response.json().then((responseJson) => {
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        this.isLoading = false;
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '404' });
    }); 
  }

  @action.bound
  async getSPBookings(pageNum, status, searchString,  callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/bookings/' + pageNum + '/' + status + '/' + searchString, {
      method: 'GET',
      headers: headers,
    }).then((response) => { 
      response.json().then((responseJson) => {
        if(response.status == 200) {
          let authToken = response.headers.get('token');
          AsyncStorage.setItem('authToken', String(authToken));
          if(searchString == '' && pageNum > 1) {
            this.BookingData = this.BookingData.concat(responseJson.statusResult.bookingData);
            this.BookingListingDataCount = responseJson.statusResult.totalDocs;
          } else {
            this.BookingData = responseJson.statusResult.bookingData;
            this.BookingListingDataCount = responseJson.statusResult.totalDocs;   
          }
        } else {
          this.BookingData = [];
          this.BookingListingDataCount = 0;
        }
        this.isLoading = false;
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '404' });
    });
  }


  @action.bound
  async updateSPPropertyInfoServicesData(put_json, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/propertyinfo/services', {
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
  async updateSPPropertyInfoAmenityData(put_json, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/propertyinfo/amenity', {
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
  async setGuestRulesNotes(put_json, callback) {
    this.internet_connection = true;
    this.isLoadingUpdate = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/propertyinfo/guestrulesnotes', {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(put_json)
    }).then((response) => {
      response.json().then((responseJson) => {
        this.isLoadingUpdate = false;
        this.guestRulesNotes = responseJson.statusResult.propertyRulesNotes;
        this.GuestRulesAvaliable = [];
        this.DummyGuestRulesAvaliable = [];
        callback(responseJson);
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '9999' });
    });
  }

  @action.bound
  async setAmenitiesStatus(put_json, callback) {
    this.internet_connection = true;
    this.isLoadingUpdate = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/propertyinfo/amenities/status', {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(put_json)
    }).then((response) => {
      response.json().then((responseJson) => {
        this.isLoadingUpdate = false;
        callback(responseJson);
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoadingUpdate = false;
      callback({ statusCode: '9999' });
    });
  }

  @action.bound
  async updateSPPIServiceStatusAvailable(recordID, put_json, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/propertyinfo/services/Available/' + recordID, {
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
  async updateSPPIServiceStatusUnavailable(recordID, put_json, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken };
    this.internet_connection = true;
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/propertyinfo/services/Unavailable/' + recordID, {
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
  async createSPPropertyBlockedDates(post_json, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/sp/property/blocked/dates/create', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(post_json)
    }).then((response) => { 
      response.json().then((responseJson) => {
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        this.isLoading = false;
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '404' });
    });
  }

  @action.bound
  async updateSPPropertyBlockedDates(blockedID, post_json, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/sp/property/blocked/dates/update/'+ blockedID, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(post_json)
    }).then((response) => { 
      response.json().then((responseJson) => {
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        this.isLoading = false;
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '404' });
    });
  }

  @action.bound
  async updatePropertyInfoPricing(propertyInfoID, pricingData, propertyID, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/property/info/pricing/update/'+ propertyInfoID + '/' + propertyID, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(pricingData)
    }).then((response) => { 
      response.json().then((responseJson) => {
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        this.isLoading = false;
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '404' });
    });
  }
  @action.bound
  async spPropertyInfoStatusChange(infoID, status, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/property/info/status/change/'+ infoID + '/' + status, {
      method: 'PUT',
      headers: headers,
    }).then((response) => { 
      response.json().then((responseJson) => {
        if (response.status == 200) {
          let index = this.PropertyInfoList.map(function (e) { return e._id; }).indexOf(responseJson.statusResult._id);
          this.PropertyInfoList[index].status = responseJson.statusResult.status;
        }
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        this.isLoading = false;
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '404' });
    });
  }

  @action.bound
  async spPropertyStatusChange(propertyID, status, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/property/status/change/'+ propertyID + '/' + status, {
      method: 'PUT',
      headers: headers,
    }).then((response) => { 
      response.json().then((responseJson) => {
        if (response.status == 200) {
          // let index = this.PropertyInfoList.map(function (e) { return e._id; }).indexOf(responseJson.statusResult._id);
          // this.PropertyInfoList[index].status = responseJson.statusResult.status;
        }
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        this.isLoading = false;
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '404' });
    });
  }

  @action.bound
  async updateAmenitiesInPropertyInfo(propertyInfoId, put_json, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/property/info/amenities/update/'+ propertyInfoId, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(put_json)
    }).then((response) => { 
      response.json().then((responseJson) => {
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        this.isLoading = false;
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '404' });
    });
  }
  @action.bound
  async deletePropertyImages(updateObj, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/property/delete/images', {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(updateObj)
    }).then((response) => { 
      response.json().then((responseJson) => {
        let authToken = response.headers.get('token');
        AsyncStorage.setItem('authToken', String(authToken));
        this.isLoading = false;
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '404' });
    });
  }

  @action.bound
  async getSPPropertyData(recordId, callback) {
    this.internet_connection = true;
    this.isLoading = true;
    let authToken = await AsyncStorage.getItem('authToken');
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'token': authToken};
    fetch(PUBLIC_DOMAIN + 'api/v1/sp/property/' + recordId, {
      method: 'GET',
      headers: headers
    }).then((response) => {
      response.json().then((responseJson) => {
        AsyncStorage.setItem('authToken', String(authToken));
        this.isLoading = false;
        callback(responseJson)
      });
    }).catch((error) => {
      this.internet_connection = false;
      this.isLoading = false;
      callback({ statusCode: '404' });
    });
  }
}