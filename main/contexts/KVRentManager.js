import {RESPONSE_STATUS} from '../constants/app-constants';
import {ASYNCSTORAGE_KEYS} from '../constants/asyncStorage-constants';
import KVResponse from '../models/KVResponse';
import KVAsyncStorage from '../services/KVAsyncStorage';
import KVRentApiManager from '../services/KVRentApiManager';

const sampleData = require('../sampleData/rentData.json');

export class KVRentManager {
  pendingRentList = [];
  allRentList = [];

  constructor() {
    //this.pendingRentList = sampleData;
  }

  generateId() {
    let pendingRentList = this.pendingRentList
      ? this.pendingRentList.length + 1
      : 1;
    return 'rent' + pendingRentList + Math.random();
  }

  async loadPendingRents() {
    try {
      let token = await new KVAsyncStorage().getToken();
      let response = await new KVRentApiManager().loadPendingItems(
        JSON.parse(token),
      );

      if (response && response.status === RESPONSE_STATUS.SUCCESS) {
        await new KVAsyncStorage().setItems(
          ASYNCSTORAGE_KEYS.KEY_RENT,
          response.responseData,
        );
        this.pendingRentList = response.responseData;
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
  
  async loadAllRents() {
    try {
      let token = await new KVAsyncStorage().getToken();
      let response = await new KVRentApiManager().loadItems(
        JSON.parse(token),
      );

      if (response && response.status === RESPONSE_STATUS.SUCCESS) {
        this.allRentList = response.responseData;
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
   * method to add rent to db and storage
   */
  async addRent(item) {
    try {
      let token = await new KVAsyncStorage().getToken();
      let response;
      if (item._id) {
        response = await new KVRentApiManager().updateItem(
          item,
          JSON.parse(token),
        );
      } else {
        response = await new KVRentApiManager().addItem(
          item,
          JSON.parse(token),
        );
      }

      if (response && response.status === RESPONSE_STATUS.SUCCESS) {
        let rents = await new KVAsyncStorage().addItem(
          ASYNCSTORAGE_KEYS.KEY_RENT,
          response.responseData,
        );
        this.pendingRentList = rents;
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
   * method to pay rent
   */
  async payRent(item) {
    try {
      let token = await new KVAsyncStorage().getToken();
      let response;
      if (item) {
        response = await new KVRentApiManager().payRent(
          item,
          JSON.parse(token),
        );
      } else {
        throw 'No Data found';
      }

      if (response && response.status === RESPONSE_STATUS.SUCCESS) {
        await this.removeRentFromList(item);
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
   * method to delete rent
   */
  async deleteRent(rent) {
    try {
      if (rent) {
        let token = await new KVAsyncStorage().getToken();
        let response = await new KVRentApiManager().deleteItem(
          rent._id,
          JSON.parse(token),
        );

        if (response && response.status === RESPONSE_STATUS.SUCCESS) {
          await this.removeRentFromList(rent);
        }
        return response;
      }
    } catch (err) {
      return new KVResponse(
        RESPONSE_STATUS.ERROR,
        400,
        err && err.message ? err.message : JSON.stringify(err),
      );
    }
  }

  getPaidRents() {
    return this.pendingRentList.filter(obj => {
      return obj.status === 'Paid';
    });
  }

  getPendingRents() {
    return this.pendingRentList.filter(obj => {
      return obj.status !== 'Paid';
    });
  }

  getPendingRentsFromStorage() {
    new KVAsyncStorage().setItems(ASYNCSTORAGE_KEYS.KEY_RENT, sampleData);
    return new KVAsyncStorage().getItems(ASYNCSTORAGE_KEYS.KEY_RENT);
  }

  calculateRent(item) {
    let electricityCharge = parseInt(item.electricityUnit) * 12;
    item.electricityCharge = electricityCharge;
    let totalRent =
      parseInt(item.electricityCharge) +
      parseInt(item.roomRent) +
      parseInt(item.garbageCharge) +
      parseInt(item.previousDue);

    item.totalRent = totalRent;
  }

  calculatePaidRent(item) {
    item.paidRent =
      item.paidRent == '' ? '0' : JSON.stringify(parseInt(item.paidRent));
    item.pendingRent = parseInt(item.totalRent) - parseInt(item.paidRent);
    if (parseInt(item.pendingRent) > 0) {
      item.status = 'Partial';
    } else {
      item.status = 'Paid';
    }
    return item;
  }

  async clearAllData() {
    this.pendingRentList = [];
    this.allRentList = [];
    //await new KVAsyncStorage().clearItems(ASYNCSTORAGE_KEYS.KEY_RENT);
  }

  /*
   * method to remove rent from async storage and rentlist
   */
  async removeRentFromList(rent) {
    try {
      //remove the rent
      this.pendingRentList = this.pendingRentList.filter(
        obj => obj._id != rent._id,
      );

      //delete rent in async storage
      await new KVAsyncStorage().setItems(
        ASYNCSTORAGE_KEYS.KEY_RENT,
        this.pendingRentList,
      );
    } catch (error) {
      throw error;
    }
  }
}
