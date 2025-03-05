import strings from '../localizations/screen';

export class Tenant {
  _id = '';
  tenantPhone = 0;
  tenantName = '';
  roomId = '';
  totalAdults = 0;
  totalChildren = 0;
  address = '';
  userId = '';

  static PRIMARY_KEY = '_id';

  static getListViewProperties() {
    return {
      tenantName: strings.tenantName,
      roomName: strings.roomName,
      totalAdults: strings.totalAdults,
      totalChildren: strings.totalChildren,
      tenantPhone: strings.phone,
    };
  }
}
