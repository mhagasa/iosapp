import {RESPONSE_STATUS} from '../constants/app-constants';
import {ASYNCSTORAGE_KEYS} from '../constants/asyncStorage-constants';
import KVResponse from '../models/KVResponse';
import KVAsyncStorage from '../services/KVAsyncStorage';
import KVTenantApiManager from '../services/KVTenantApiManager';

const sampleData = require('../sampleData/tenantData.json');

export class KVTenantManager {
  tenantList = [];

  constructor() {
    this.loadTenant();
  }


  /*
   * load tenant from list 
   */
  loadTenant(){
    this.tenantList = new KVAsyncStorage()
      .getItems(ASYNCSTORAGE_KEYS.KEY_TENANT)
      .then(tenants => {
        this.tenantList = JSON.parse(tenants);
      })
      .catch(err => {
        console.log(err);
      });
  }

  generateId() {
    let tenantLength = this.tenantList ? this.tenantList.length + 1 : 1;
    return 'tenant' + tenantLength + Math.random();
  }

  async addTenant(tenant) {
    try {
      let token = await new KVAsyncStorage().getToken();
      let response;
      if (tenant._id) {
        response = await new KVTenantApiManager().updateItem(
          tenant,
          JSON.parse(token),
        );
      } else {
        response = await new KVTenantApiManager().addItem(
          tenant,
          JSON.parse(token),
        );
      }

      if (response && response.status === RESPONSE_STATUS.SUCCESS) {
        let tenants = await new KVAsyncStorage().addItem(
          ASYNCSTORAGE_KEYS.KEY_TENANT,
          response.responseData,
        );
        this.tenantList = tenants;
      }
      return response;
    } catch (err) {
      return new KVResponse(
        RESPONSE_STATUS.ERROR,
        400,
        err && err.message ? err.message : JSON.stringify(err),
      );
    }
  }

  /*
   * remove tenant from room
   */
  async deleteTenant(tenant) {
    try {
      let token = await new KVAsyncStorage().getToken();
      let response;
      if (tenant._id) {
        response = await new KVTenantApiManager().deleteItem(
          tenant._id,
          JSON.parse(token),
        );
      }

      if (response && response.status === RESPONSE_STATUS.SUCCESS) {
        await this.deleteTenantFromList(tenant);
      }
      return response;
    } catch (err) {
      return new KVResponse(
        RESPONSE_STATUS.ERROR,
        400,
        err && err.message ? err.message : JSON.stringify(err),
      );
    }
  }

  getTenantFromRoomId(roomId) {
    if (this.tenantList) {
      return this.tenantList.find(obj => {
        return obj.roomId === roomId;
      });
    }
    return null;
  }

  /*
   * method to add tenants in tenant asyncstorage and tenantlist
   */
  async addTenants(tenantDetails) {
    await new KVAsyncStorage().setItems(
      ASYNCSTORAGE_KEYS.KEY_TENANT,
      tenantDetails,
    );
    this.tenantList = tenantDetails;
  }

  /*
   * method to delete tenant from tenant list and aysnc storage
   */
  async deleteTenantFromList(tenant){
    if (this.tenantList && this.tenantList.length > 0) {
      this.tenantList = this.tenantList.filter(item => item._id !== tenant._id);
      await new KVAsyncStorage().setItems(
        ASYNCSTORAGE_KEYS.KEY_TENANT,
        this.tenantList,
      );
    }
  }

  /*
   * method to clear tenantlist and async storage data
   */
  async clearAllData() {
    this.tenantList = [];
    await new KVAsyncStorage().clearItems(ASYNCSTORAGE_KEYS.KEY_TENANT);
  }
}
