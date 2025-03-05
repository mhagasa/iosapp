import {OCCUPANCY, ROOM_TYPE} from '../constants/app-constants';
import strings from '../localizations/screen';

export class Room {
  _id = '';
  roomName = '';
  landlordId = '';
  tenantPhone = '';
  tenantId = '';
  tenantName = '';
  type = ROOM_TYPE.FLAT; // Flat , Room
  occupancy = OCCUPANCY.VACANT; //Vacant , Full
  floor = '';
  price = 0;
  garbageCharge = 0;
  electricityPerUnit = 0;

  static PRIMARY_KEY = '_id';

  static getListViewProperties() {
    return {
      roomName: strings.roomName,
      type: strings.rentType,
      price: strings.price,
      occupancy: strings.occupancy,
      floor: strings.floor,
      tenantName: strings.tenantName,
    };
  }

  static getTenantSelectionListViewProperties() {
    return {
      roomName: strings.roomName,
      tenantName: strings.tenantName,
      type: strings.rentType,
      price: strings.price,
      floor: strings.floor,
    };
  }

  static getTenantRoomProperties() {
    return {
      roomName: strings.roomName,
      type: strings.rentType,
      price: strings.price,
      floor: strings.floor,
      garbageCharge: strings.garbageCharge,
      electricityPerUnit: strings.electricityPerUnit,
    };
  }
}
