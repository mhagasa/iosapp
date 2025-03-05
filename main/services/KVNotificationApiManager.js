import {API_METHOD, CONSTANT_API_URL} from '../constants/app-constants';
import KVApiManager from './KVApiManager';

export default class KVNotificationApiManager {
  
  /*
   * api for load notifications
   */
  loadItems = async token => {
    let response = await KVApiManager.callApi(
      CONSTANT_API_URL.API_URL_NOTIFICATION,
      API_METHOD.GET,
      token,
      null,
    );
    return response;
  };
}