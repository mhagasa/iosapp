import {API_METHOD, CONSTANT_API_URL, RESPONSE_STATUS} from '../constants/app-constants';
import KVResponse from '../models/KVResponse';
import KVApiManager from './KVApiManager';

export default class KVSmsApiManager {
  sendRegisterSms = async smsData => {
    let response = await KVApiManager.callApi(
      CONSTANT_API_URL.API_URL_REGISTER_SEND_OTP,
      API_METHOD.POST,
      null,
      smsData,
    );
    return response;
  };
  // sendSMS = async smsData => {
  //   console.log('Before sendSMS API Call:');
  //   console.log(JSON.stringify(smsData));
  //   let response = await KVApiManager.callApi(
  //     CONSTANT_API_URL.API_URL_SEND_OTP,
  //     'GET',
  //     '',
  //     JSON.stringify(smsData),
  //   );
  //   console.log('sendSMS API response');
  //   console.log(response);
  //   return response;
  // };
  verifyOtp = async otpData => {
    let response = await KVApiManager.callApi(
      CONSTANT_API_URL.API_URL_VERIFY_OTP,
      API_METHOD.POST,
      null,
      otpData,
    );
    return response;
  };
}
