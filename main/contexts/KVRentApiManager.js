import {API_METHOD, CONSTANT_API_URL} from '../constants/app-constants';
import KVApiManager from './KVApiManager';

export default class KVRentApiManager {
  /*
   * api for adding rent
   */
  addItem = async (payload, token) => {
    let response = await KVApiManager.callApi(
      CONSTANT_API_URL.API_URL_RENT,
      API_METHOD.POST,
      token,
      payload,
    );
    return response;
  };

  /*
   * api for update rent
   */
  updateItem = async (payload, token) => {
    let response = await KVApiManager.callApi(
      CONSTANT_API_URL.API_URL_RENT + payload._id,
      API_METHOD.PATCH,
      token,
      payload,
    );
    return response;
  };

  /*
   * api for load rents
   */
  loadItems = async token => {
    let response = await KVApiManager.callApi(
      CONSTANT_API_URL.API_URL_RENT,
      API_METHOD.GET,
      token,
      null,
    );
    return response;
  };

  /*
   * api for load pending rents
   */
  loadPendingItems = async token => {
    let response = await KVApiManager.callApi(
      CONSTANT_API_URL.API_URL_RENT_LOAD_PENDING,
      API_METHOD.GET,
      token,
      null,
    );
    return response;
  };

  /*
   * api for load all rents
   */
  loadAllItems = async token => {
    let response = await KVApiManager.callApi(
      CONSTANT_API_URL.API_URL_RENT,
      API_METHOD.GET,
      token,
      null,
    );
    return response;
  };

  /*
   * api for pay rent
   */
  payRent = async (rent, token) => {
    let response = await KVApiManager.callApi(
      CONSTANT_API_URL.API_URL_RENT_PAY + rent._id,
      API_METHOD.PATCH,
      token,
      rent,
    );
    return response;
  };

  /*
   * api for delete rent
   */
  deleteItem = async (rentId, token) => {
    let response = await KVApiManager.callApi(
      CONSTANT_API_URL.API_URL_RENT_DELETE + rentId,
      API_METHOD.DELETE,
      token,
      null,
    );
    return response;
  };
}
