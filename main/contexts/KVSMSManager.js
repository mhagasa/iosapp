import { RESPONSE_STATUS } from '../constants/app-constants';
import KVSMSApiManager from '../services/KVSmsApiManager';
import KVAsyncStorage from '../services/KVAsyncStorage';
import KVResponse  from '../models/KVResponse';

export default class KVSMSManager {
  /*
   * method to verify token
   */
  async sendRegisterSms(smsData) {
    let response;
    try {
      response = await new KVSMSApiManager().sendRegisterSms(smsData);

      if (response && response.status === RESPONSE_STATUS.SUCCESS) {
        await new KVAsyncStorage().storeUserAndToken(
          response.responseData,
          response.token,
        );
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
  /**
   * Method to verify OTP entered by user
   * @param {*} otpData 
   * @returns 
   */
  async verifyOtp(otpData){
    let response;
    try {
      response = await new KVSMSApiManager().verifyOtp(otpData);

      if (response && response.status === RESPONSE_STATUS.SUCCESS) {
        await new KVAsyncStorage().storeUserAndToken(
          response.responseData,
          response.token,
        );
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
}
