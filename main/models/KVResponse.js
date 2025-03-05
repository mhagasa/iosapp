import {RESPONSE_STATUS} from '../constants/app-constants';

export default class KVResponse {
  status = RESPONSE_STATUS.SUCCESS;
  responseStatus = '';
  errorMessage = '';
  responseData = {};

  constructor(
    status,
    responseStatus = 200,
    errorMessage = '',
    responseData = {},
    token = null,
  ) {
    this.status = status;
    this.responseStatus = responseStatus;
    this.errorMessage = errorMessage;
    this.responseData = responseData;
    this.token = token;
  }
}
