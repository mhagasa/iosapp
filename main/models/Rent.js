import {RENT_STATUS} from '../constants/app-constants';
import strings from '../localizations/screen';

export class Rent {
  _id = '';
  landlordId = '';
  roomId = '';
  roomName = '';
  tenantId = '';
  tenantUserId = '';
  tenantName = '';
  roomRent = '';
  electricityPerUnit = '';
  electricityUnit = '';
  electricityCharge = '';
  garbageCharge = '';
  waterCharge = '';
  internetCharge = '';
  previousDue = '';
  totalRent = '';
  paidRent = '';
  pendingRent = '';
  dateStart = '';
  dateEnd = '';
  status = RENT_STATUS.UNPAID; // Paid, Partial, Unpaid

  static PRIMARY_KEY = '_id';

  static getListViewProperties() {
    return {
      tenantName: strings.tenantName,
      roomName: strings.roomName,
      roomRent: strings.roomRent,
      electricityUnit: strings.electricityUnit,
      electricityCharge: strings.electricityCharge,
      garbageCharge: strings.garbageCharge,
      waterCharge: strings.waterCharge,
      internetCharge: strings.internetCharge,
      previousDue: strings.previousDue,
      totalRent: strings.totalRent,
      paidRent: strings.paidRent,
      pendingRent: strings.pendingRent,
      dateStart: strings.startDate,
      dateEnd: strings.endDate,
      status: strings.status,
    };
  }
  static getPaidListViewProperties() {
    return {
      tenantName: strings.tenantName,
      roomName: strings.roomName,
      dateStart: strings.startDate,
      dateEnd: strings.endDate,
      roomRent: strings.roomRent,
      electricityUnit: strings.electricityUnit,
      electricityCharge: strings.electricityCharge,
      garbageCharge: strings.garbageCharge,
      waterCharge: strings.waterCharge,
      internetCharge: strings.internetCharge,
      previousDue: strings.previousDue,
      totalRent: strings.totalRent,
    };
  }
  static getTenantRentProperties() {
    return {
      roomName: strings.roomName,
      sectionBreak0: '',
      dateStart: strings.startDate,
      dateEnd: strings.endDate,
      electricityUnit: strings.electricityUnit,
      sectionBreak1: '',
      roomRent: strings.roomRent,
      electricityCharge: strings.electricityCharge,
      garbageCharge: strings.garbageCharge,
      waterCharge: strings.waterCharge,
      internetCharge: strings.internetCharge,
      previousDue: strings.previousDue,
      sectionBreak2: '',
      totalRent: strings.totalRent,
    };
  }
}
