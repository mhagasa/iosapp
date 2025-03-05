import {
  API_METHOD,
  CONSTANT_API_URL,
  RESPONSE_STATUS,
} from '../constants/app-constants';
import KVResponse from '../models/KVResponse';
import KVApiManager from './KVApiManager';

export default class KVRoomApiManager {
  /*
   * api for adding room
   */
  addRoom = async (payload, token) => {
    let response = await KVApiManager.callApi(
      CONSTANT_API_URL.API_URL_ROOM_ADD,
      API_METHOD.POST,
      token,
      payload,
    );
    return response;
  };

  /*
   * api for update room
   */
  updateRoom = async (payload, token) => {
    console.log(JSON.stringify(payload));
    let response;

    let api = CONSTANT_API_URL.API_URL_ROOM_ADD + payload._id;
    console.log(api);
    await fetch(CONSTANT_API_URL.API_URL_ROOM_ADD + payload._id, {
      mode: 'no-cors',
      method: API_METHOD.PATCH,
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token,
      },
      body: JSON.stringify(payload),
    })
      .then(async res => {
        try {
          const jsonRes = await res.json();
          if (res.status === 200) {
            response = new KVResponse(
              RESPONSE_STATUS.SUCCESS,
              res.status,
              '',
              jsonRes,
            );
          } else {
            response = new KVResponse(
              RESPONSE_STATUS.ERROR,
              res.status,
              JSON.stringify(jsonRes.message),
            );
          }
        } catch (err) {
          console.log(err);
          response = new KVResponse(RESPONSE_STATUS.ERROR, 400, err.message);
        }
      })
      .catch(err => {
        console.log(err);
        response = new KVResponse(RESPONSE_STATUS.ERROR, 400, err.message);
      });

    return response;
  };

  /*
   * api for load Rooms for tenant
   */
  loadRoomsForTenant = async token => {
    let response = await KVApiManager.callApi(
      CONSTANT_API_URL.API_URL_LOAD_TENANT_ROOM,
      API_METHOD.GET,
      token,
      null,
    );
    return response;
  };

  /*
   * api for load rooms
   */
  loadRooms = async token => {
    let response;

    await fetch(CONSTANT_API_URL.API_URL_LOAD_ROOMS, {
      mode: 'no-cors',
      method: API_METHOD.GET,
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token,
      },
    })
      .then(async res => {
        try {
          const jsonRes = await res.json();
          if (res.status === 200) {
            response = new KVResponse(
              RESPONSE_STATUS.SUCCESS,
              res.status,
              '',
              jsonRes,
            );
          } else {
            response = new KVResponse(
              RESPONSE_STATUS.ERROR,
              res.status,
              jsonRes.message,
            );
          }
        } catch (err) {
          console.log(err);
          response = new KVResponse(RESPONSE_STATUS.ERROR, 400, err.message);
        }
      })
      .catch(err => {
        console.log(err);
        response = new KVResponse(RESPONSE_STATUS.ERROR, 400, err.message);
      });

    return response;
  };

  /*
   * api for load rooms
   */
  deleteRoom = async (roomId, token) => {
    let response;

    await fetch(CONSTANT_API_URL.API_URL_DELETE_ROOM + roomId, {
      mode: 'no-cors',
      method: API_METHOD.DELETE,
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token,
      },
    })
      .then(async res => {
        try {
          const jsonRes = await res.json();
          if (res.status === 200) {
            response = new KVResponse(
              RESPONSE_STATUS.SUCCESS,
              res.status,
              '',
              jsonRes,
            );
          } else {
            response = new KVResponse(
              RESPONSE_STATUS.ERROR,
              res.status,
              jsonRes.message,
            );
          }
        } catch (err) {
          console.log(err);
          response = new KVResponse(RESPONSE_STATUS.ERROR, 400, err.message);
        }
      })
      .catch(err => {
        console.log(err);
        response = new KVResponse(RESPONSE_STATUS.ERROR, 400, err.message);
      });

    return response;
  };
}
