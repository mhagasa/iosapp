import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  BackHandler,
  Image,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message'; // Import Toast
import User from '../models/User';
import KVAsyncStorage from '../services/KVAsyncStorage';

import {
  USER_TYPE,
  SCREEN_NAME,
  RESPONSE_STATUS,
} from '../constants/app-constants';
import {
  BUTTON_COLOR,
  BUTTON_STYLE,
  CONTAINER_COLOR,
  DIMENSIONS,
  FONT_CONSTANTS,
  HEADER_COLOR,
  INSIDE_CONTAINER_COLOR,
} from '../constants/theme-constants';
import { KVMainView } from '../components/KVMainView';
import strings from '../localizations/screen';
import { KVUserManager } from '../contexts/KVUserManager';
import { validateResigter } from '../validation/KVUserValidation';
import { translateNepaliNumber } from '../validation/translate';

const USER_TYPE_LANDLORD = USER_TYPE.USER_TYPE_LANDLORD;
const USER_TYPE_TENANT = USER_TYPE.USER_TYPE_TENANT;

const RegisterScreen = ({ navigation }) => {
  const [registerUser, setRegisterUser] = useState(
    new User('', '', USER_TYPE.USER_TYPE_LANDLORD, ''),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const [indicator, setIndicator] = useState(false);
  const [retypePassword, setRetypePassword] = useState('');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.pop();
        return true;
      },
    );

    return () => backHandler.remove(); // Cleanup the event listener
  }, [navigation]);

  const onRegisterIn = async (jsonRes, token) => {
    try {
      await KVAsyncStorage.storeUserAndToken(jsonRes, token);
      navigation.navigate(SCREEN_NAME.TABNAVIGATOR);
    } catch (err) {
      setErrorMessage(err);
    }
  };

  const setErrorMessage = (msg) => {
    setIsError(true);
    setMessage(msg);
  };

  const onSubmitHandler = async () => {
    try {
      const validationResult = validateResigter({ registerUser, retypePassword });
      if (!validationResult.isValid) {
        console.log(validationResult.errorMessage);
        // Show toast for validation error
        Toast.show({
          type: 'error', // 'success', 'error', or 'info'
          position: 'top', // 'top', 'bottom', or 'center'
          text2: validationResult.errorMessage
        });
        return;
      }

      setIndicator(true);
      let response = await new KVUserManager().register(registerUser);
      if (response && response.status === RESPONSE_STATUS.SUCCESS) {
        navigation.navigate(SCREEN_NAME.SENDREGISTEROTP, {
          paramKey: response.responseData,
          registerUser: registerUser,
        });
      } else {
        // Show toast for API error
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error',
          text2: response.errorMessage,
        });
      }

      setIndicator(false);
    } catch (err) {
      setIndicator(false);
      // Show toast for unexpected error
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: err.message || 'Something went wrong!',
      });
    }
  };

  const onLoginHandler = () => {
    navigation.navigate(SCREEN_NAME.LOGIN);
  };

  const updateState = (key, value) => {
    setRegisterUser((oldState) => ({
      ...oldState,
      [key]: value,
    }));
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KVMainView indicator={indicator}>
        <View style={styles.card}>
          <Image
            source={require('../assets/img/ic_launcher_round.png')}
            style={styles.image}
          />
          <Text style={styles.heading}>{strings.signUp}</Text>
          <View style={styles.form}>
            <ScrollView>
              <View style={styles.inputs}>
                <TextInput
                  style={styles.input}
                  placeholder={strings.fullName}
                  onChangeText={(item) => updateState('name', item)}
                  value={registerUser.name}
                />
                <TextInput
                  style={styles.input}
                  placeholder={strings.mobile}
                  onChangeText={(item) =>
                    updateState('mobile', translateNepaliNumber(item))
                  }
                  value={registerUser.mobile}
                  keyboardType="number-pad"
                  maxLength={10}
                />
                <View style={styles.inputUsertypelabel}>
                  <Text style={styles.inputUsertype}>{strings.userType}:</Text>
                  <Picker
                    style={styles.inputUsertypePicker}
                    selectedValue={registerUser.userType}
                    onValueChange={(value) => {
                      updateState('userType', value);
                    }}
                  >
                    <Picker.Item
                      label={strings.landlord}
                      value={USER_TYPE_LANDLORD}
                    />
                    <Picker.Item
                      label={strings.tenant}
                      value={USER_TYPE_TENANT}
                    />
                  </Picker>
                </View>
                <KVPasswordInput
                  placeholder={strings.password}
                  onValueChange={(value) => {
                    updateState('password', value);
                  }}
                />
                <KVPasswordInput
                  placeholder={strings.retypePassword}
                  onValueChange={(value) => {
                    setRetypePassword(value);
                  }}
                />
              </View>
            </ScrollView>
            <View>
              <TouchableOpacity style={styles.button} onPress={onSubmitHandler}>
                <Text style={styles.buttonText}>{strings.signUp}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.haveAccount}>
              <Text>{strings.haveAnAccount} </Text>
              <TouchableOpacity onPress={onLoginHandler}>
                <Text style={styles.haveAccountLogin}>{strings.login}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KVMainView>
      {/* Render Toast at the root level */}
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    height: DIMENSIONS.HEIGHT,
    maxHeight: DIMENSIONS.HEIGHT,
    backgroundColor: CONTAINER_COLOR.LIGHTGREY,
  },
  image: {
    height: DIMENSIONS.HEIGHT / 8,
    width: DIMENSIONS.WIDTH / 3.7,
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: '4%',
    marginBottom: '0.5%',
  },
  card: {
    flex: 1,
    backgroundColor: CONTAINER_COLOR.OPTIONALWHITE,
    marginTop: '15%',
    marginBottom: '5%',
    borderRadius: 10,
    maxHeight: '100%',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    width: '85%',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 7,
    shadowRadius: 3,
    elevation: 10,
  },
  heading: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM + 10,
    fontWeight: 'bold',
    marginTop: '2%',
    marginBottom: '-2%',
    color: HEADER_COLOR.OPTIONAL_TITLE,
  },
  form: {
    flex: 1,
    paddingBottom: '10%',
    width: '85%',
    elevation: 8,
    marginBottom: '-3%',
  },
  inputs: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: DIMENSIONS.HEIGHT / 70,
    marginBottom: DIMENSIONS.HEIGHT / 45,
    elevation: 10,
    marginBottom: '3%',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingTop: '5%',
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    minHeight: 30,
    marginBottom: DIMENSIONS.HEIGHT / 100,
  },
  inputUsertypelabel: {
    width: '100%',
    height: '55%',
    paddingTop: '4%',
    marginBottom: '2.5%',
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM + 10,
    minHeight: FONT_CONSTANTS.FONT_SIZE_MEDIUM + 10,
    flex: 1,
    flexDirection: 'row',
  },
  inputUsertype: {
    flex: 1,
    marginBottom: '1%',
    marginTop: '10%',
    width: DIMENSIONS.WIDTH,
    height: FONT_CONSTANTS.FONT_SIZE_MEDIUM + 10,
  },
  inputUsertypePicker: {
    height: '100%',
    width: '70%',
    backgroundColor: INSIDE_CONTAINER_COLOR.BACKGROUNDCOLOR,
    marginTop: '-25%',
    marginBottom: '-20%',
  },
  button: {
    width: '100%',
    backgroundColor: BUTTON_COLOR.ACTIVE,
    height: FONT_CONSTANTS.FONT_SIZE_MEDIUM + 25,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2%',
  },
  buttonText: {
    color: BUTTON_STYLE.TEXT_COLOR,
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
  },
  haveAccount: {
    flexDirection: 'row',
    marginTop: '5%',
    marginLeft: '25%',
  },
  haveAccountLogin: {
    flexDirection: 'row',
    color: '#007BFF',
  },
});

export default RegisterScreen;