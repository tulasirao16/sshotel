import UserStore from "./UserStore";
import BookingStore from './BookingStore';
import PropertyStore from './PropertyStore';
import SPStore from './SPStore';
import MessageStore from './MessageStore';
import FavoriteStore from './FavoriteStore';
import HomeStore from './HomeStore';
import SupportStore from './SupportStore';
export default {
  UserStore:new UserStore(),
  BookingStore: new BookingStore(),
  PropertyStore: new PropertyStore(),
  SPStore: new SPStore(),
  MessageStore: new MessageStore(),
  FavoriteStore: new FavoriteStore(),
  HomeStore: new HomeStore(),
  SupportStore: new SupportStore()
};
