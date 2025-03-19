import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNCSTORAGE_KEYS} from '../constants/asyncStorage-constants';
export default class KVAsyncStorage {
  /*
   * method to store user and token
   */
  async storeUserAndToken(userData, token) {
    await AsyncStorage.setItem(
      ASYNCSTORAGE_KEYS.KEY_USER,
      JSON.stringify(userData) || '',
    );
    await AsyncStorage.setItem(
      ASYNCSTORAGE_KEYS.KEY_TOKEN,
      JSON.stringify(token) || '',
    );
    return true;
  }

  /*
   * method to clear user and token
   */
  async clearUserAndToken() {
    //await AsyncStorage.removeItem(ASYNCSTORAGE_KEYS.KEY_USER);
    //await AsyncStorage.removeItem(ASYNCSTORAGE_KEYS.KEY_TOKEN);
    return true;
  }

  /*
   * method to return user details
   */
  async getUserDetails() {
    //return await AsyncStorage.getItem(ASYNCSTORAGE_KEYS.KEY_USER);
  }

  /*
   * method to return token
   */
  async getToken() {
    return await AsyncStorage.getItem(ASYNCSTORAGE_KEYS.KEY_TOKEN);
  }

  async getItems(key) {
    //return await AsyncStorage.getItem(key);
  }

  async setItems(key, jsonData) {
    //await AsyncStorage.setItem(key, JSON.stringify(jsonData) || '');
    return true;
  }

  /*
   * method to clear key
   */
  async clearItems(key) {
    //await AsyncStorage.removeItem(key);
    return true;
  }

  async clearAll() {
    //await AsyncStorage.clear();
  }

  /*
   * method to add item in async storage in specified key
   * @params: key - key in async storage
   *          jsonData - data that needs to be stored
   */
  async addItem(key, jsonData) {
    let itemsString //= await AsyncStorage.getItem(key);
    let items = [];
    if (itemsString && itemsString.length > 0) {
      items = JSON.parse(itemsString);
      items = items.filter(item => item._id !== jsonData._id);
      items.push(jsonData);
    } else {
      items.push(jsonData);
    }
    items.sort((a, b) => (a._id < b._id ? -1 : 1));
    //await AsyncStorage.setItem(key, JSON.stringify(items) || '');
    return items;
  }
}
