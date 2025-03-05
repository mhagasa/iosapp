import KVResponse from '../models/KVResponse';
import {API_METHOD, RESPONSE_STATUS} from '../constants/app-constants';
import { getErrorMessage } from '../localizations/localizationMapping';
export default class KVApiManager {
  /*
   * common method to call api with KV Response
   */
  static callApi = async (url, method, token, payload) => {
    let response;

    try {
      let params = {
        mode: 'no-cors',
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
      };

      //add body if not get request
      if (method !== API_METHOD.GET && method !== API_METHOD.DELETE) {
        params.body = JSON.stringify(payload);
      }

      await fetch(url, params)
        .then(async res => {
          try {
            const jsonRes = await res.json();
            if (res.status === 200) {
              const newToken = res.headers.map['auth-token'];
              response = new KVResponse(
                RESPONSE_STATUS.SUCCESS,
                res.status,
                '',
                jsonRes,
                newToken,
              );
            } else {
              if (jsonRes.errorCode) {
                //Try to get the localized message
                const localizedMessage = getErrorMessage(jsonRes.errorCode);

                //Use localized message if available, otherwise fallback to API message
                const displayMessage =
                  localizedMessage ||
                  jsonRes.errorMessage ||
                  'An Unknown error occured.';
                response = new KVResponse(
                  RESPONSE_STATUS.ERROR,
                  res.status,
                  JSON.stringify(displayMessage),
                );
              } else {
                response = new KVResponse(
                  RESPONSE_STATUS.ERROR,
                  res.status,
                  JSON.stringify(jsonRes.message),
                );
              }
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
    } catch (err) {
      response = new KVResponse(RESPONSE_STATUS.ERROR, 400, err.message);
    }
    return response;
  };
}
