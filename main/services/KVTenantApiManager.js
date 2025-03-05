import {API_METHOD, CONSTANT_API_URL, RESPONSE_STATUS} from '../constants/app-constants';
import KVResponse from '../models/KVResponse';
import KVApiManager from './KVApiManager';

export default class KVTenantApiManager {
  /*
   * api for adding tenant
   */
  addItem = async (payload, token) => {
    let response = await KVApiManager.callApi(
      CONSTANT_API_URL.API_URL_TENANT_ADD,
      API_METHOD.POST,
      token,
      payload,
    );
    return response;
  };

  /*
   * api for update tenant
   */
  updateItem = async (payload, token) => {
    let response = await KVApiManager.callApi(
      CONSTANT_API_URL.API_URL_TENANT_ADD + payload._id,
      API_METHOD.PATCH,
      token,
      payload,
    );
    return response;
  };

  /*
   * api for load rooms
   */
  loadItems = async token => {
    let response = await KVApiManager.callApi(
      CONSTANT_API_URL.API_URL_TENANT_ADD,
      API_METHOD.GET,
      token,
      payload,
    );
    return response;
  };

    /*
   * API for deleting tenant
   */
    deleteItem = async (tenantId, token) => {
      let response = await KVApiManager.callApi(
        `${CONSTANT_API_URL.API_URL_TENANT_ADD}${tenantId}`,
        API_METHOD.DELETE,
        token,
      );
      return response;
    };
    
}
