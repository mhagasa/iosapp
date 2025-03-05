import React, {useContext, useEffect} from 'react';
import {View, Text, Image, StyleSheet, ToastAndroid} from 'react-native';

import {
  RESPONSE_STATUS,
  SCREEN_NAME,
  USER_TYPE,
} from '../constants/app-constants';
import KVUserContext from '../contexts/KVUserContext';
import strings from '../localizations/screen';

export default function SplashScreen({navigation}) {
  const userContext = useContext(KVUserContext);
  useEffect(() => {
    navigateToHome = async () => {
      try {
        let token = await userContext.getTokenFromStorage();
        if (token) {
          await userContext.verifyToken().then(async response => {
            if (response && response.status != RESPONSE_STATUS.SUCCESS) {
              ToastAndroid.showWithGravity(
                response.errorMessage,
                ToastAndroid.SHORT,
                ToastAndroid.TOP,
              );
            }
            let userJSON = await userContext.getUserDetailsFromStorage();
            if (userJSON) {
              let user = JSON.parse(userJSON);

              if (user.userType === USER_TYPE.USER_TYPE_LANDLORD) {
                navigation.navigate(SCREEN_NAME.TABNAVIGATOR);
              } else if (user.userType === USER_TYPE.USER_TYPE_TENANT) {
                navigation.navigate(SCREEN_NAME.TENANTHOME);
              } else {
                navigation.navigate(SCREEN_NAME.LOGIN);
              }
            } else {
              navigation.navigate(SCREEN_NAME.LOGIN);
            }
          });
        } else {
          navigation.navigate(SCREEN_NAME.LOGIN);
        }
      } catch (err) {
        ToastAndroid.showWithGravity(
          err.message,
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      }
    };
    navigateToHome();
  });

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Image
        source={require('../assets/img/ic_launcher_round.png')}
        style={styles.image}
      />
      <Text style={styles.appName}>{strings.kothaVada}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  appName: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 50,
    fontWeight: 'bold',
    alignItems: 'center',
  },
});
