import {RESPONSE_STATUS, USER_TYPE, OCCUPANCY} from '../constants/app-constants';
import {ASYNCSTORAGE_KEYS} from '../constants/asyncStorage-constants';
import strings from '../localizations/screen';
import KVResponse from '../models/KVResponse';
import KVAsyncStorage from '../services/KVAsyncStorage';
import KVRoomApiManager from '../services/KVRoomApiManager';

export class KVRoomManager {
  roomList = [];

  constructor() {}

  async loadRooms() {
    try {
      let asyncStorage = new KVAsyncStorage();
      let token = await asyncStorage.getToken();
      let userJSON = await asyncStorage.getUserDetails();

      let response;
      if (userJSON) {
        let user = JSON.parse(userJSON);
        if (user && user.userType === USER_TYPE.USER_TYPE_LANDLORD) {
          response = await new KVRoomApiManager().loadRooms(JSON.parse(token));
        } else if (user && user.userType === USER_TYPE.USER_TYPE_TENANT) {
          response = await new KVRoomApiManager().loadRoomsForTenant(
            JSON.parse(token),
          );
        }
      }

      if (response && response.status === RESPONSE_STATUS.SUCCESS) {
        await new KVAsyncStorage().setItems(
          ASYNCSTORAGE_KEYS.KEY_ROOM,
          response.responseData.rooms,
        );
        this.roomList = response.responseData.rooms;
      } else {
        throw strings.userDetailIncorrect;
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
   * method to add room to db and storage
   */
  async addRoom(room) {
    try {
      let token = await new KVAsyncStorage().getToken();
      let response;
      if (room._id) {
        response = await new KVRoomApiManager().updateRoom(
          room,
          JSON.parse(token),
        );
      } else {
        response = await new KVRoomApiManager().addRoom(
          room,
          JSON.parse(token),
        );
      }

      if (response && response.status === RESPONSE_STATUS.SUCCESS) {
        let rooms = await new KVAsyncStorage().addItem(
          ASYNCSTORAGE_KEYS.KEY_ROOM,
          response.responseData,
        );
        this.roomList = rooms;
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
   * method to delete room from db and storage
   */
  async deleteRoom(room) {
    try {
      if (room) {
        let token = await new KVAsyncStorage().getToken();
        let response = await new KVRoomApiManager().deleteRoom(
          room._id,
          JSON.parse(token),
        );

        if (response && response.status === RESPONSE_STATUS.SUCCESS) {
          let index = this.roomList && this.roomList.indexOf(room);

          //delete room in room context
          if (index != null && index > -1) {
            this.roomList.splice(index, 1);
          }
          //delete room in async storage
          await new KVAsyncStorage().setItems(
            ASYNCSTORAGE_KEYS.KEY_ROOM,
            this.roomList,
          );
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

  /*
   * method that returns vacant rooms
   */
  getVacantRoom() {
    return this.roomList.filter(obj => {
      return obj.occupancy.toUpperCase() == OCCUPANCY.VACANT.toUpperCase();
    });
  }

  /*
   * method that returns occuppied rooms
   */
  getFullRoom() {
    return this.roomList.filter(obj => {
      return obj.occupancy.toUpperCase() == OCCUPANCY.FULL.toUpperCase();
    });
  }

  getDetails(roomId) {
    return this.roomList.find(obj => {
      return obj._id === roomId;
    });
  }

  async getRoomListForTenant() {
    /*KVAsyncStorage */
    let userDetails = await new KVAsyncStorage().getUserDetails();

    //logic for roomlist api call
  }

  /*
   * method to update roomList and async storage for room
   */
  async updateRoomList(room) {
    let rooms = await new KVAsyncStorage().addItem(
      ASYNCSTORAGE_KEYS.KEY_ROOM,
      room,
    );
    this.roomList = rooms;
  }

  /*
   * method to clear roomlist and async storage data
   */
  async clearAllData() {
    this.roomList = [];
    //await new KVAsyncStorage().clearItems(ASYNCSTORAGE_KEYS.KEY_ROOM);
  }
}
