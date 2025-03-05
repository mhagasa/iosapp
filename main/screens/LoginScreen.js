import React, {useState, useEffect, useContext} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  BackHandler,
  ScrollView
} from 'react-native';
import User from '../models/User';
import {
  LANGUAGE_CODE,
  RESPONSE_STATUS,
  SCREEN_NAME,
} from '../constants/app-constants';
import KVButton from '../components/KVButton';
import KVUserContext from '../contexts/KVUserContext';
import {KVMainView} from '../components/KVMainView';
import {
  CONTAINER_COLOR,
  DIMENSIONS,
  FONT_CONSTANTS,
} from '../constants/theme-constants';
import strings, {changeLanguage} from '../localizations/screen';
import KVPasswordInput from '../components/KVPasswordInput';
// import KVLanguageSwitchButton from '../components/KVLanaugageSwitchButton';

const LoginScreen = ({navigation}) => {
  const [user, setUser] = useState(new User());
  const [indicator, setIndicator] = useState(false);
  const userContext = useContext(KVUserContext);
  const [isEnglish, setIsEnglish] = useState(true);

  // handles back button press event
  useFocusEffect(
    React.useCallback(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [])
);

  const updateState = (key, value) => {
    setUser(oldState => ({
      ...oldState,
      [key]: value,
    }));
  };

  /*
   * handler method for login button
   */
  const loginHandler = async () => {
    setIndicator(true);
    let response = await userContext.login(user);
    if (response && response.status === RESPONSE_STATUS.SUCCESS) {
      if (
        response &&
        response.responseData &&
        response.responseData.userDetail &&
        response.responseData.userDetail.userType
      ) {
        await userContext.setLanguage(LANGUAGE_CODE.ENGLISH);
        strings.setLanguage(LANGUAGE_CODE.ENGLISH);
        if (response.responseData.userDetail.userType == 'LANDLORD') {
          setIndicator(false);
          navigation.navigate(SCREEN_NAME.TABNAVIGATOR);
        } else if (response.responseData.userDetail.userType == 'TENANT') {
          setIndicator(false);
          navigation.navigate(SCREEN_NAME.TENANTHOME);
        }
      }
    } else {
      setIndicator(false);
      ToastAndroid.showWithGravity(
        response.errorMessage,
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    }
  };
  const toggleLanguage = async () => {
    const newLanguage = isEnglish
      ? LANGUAGE_CODE.NEPALI
      : LANGUAGE_CODE.ENGLISH; // Toggle between 'en' and 'ne'
    setIsEnglish(!isEnglish);
    changeLanguage(newLanguage);
  };

  return (
    <View style={styles.mainContainer}>
      {/*<View style={styles.toggleContainer}> */}
      {/* Language Switch Button Outside of KVMainView */}
      {/*<KVLanguageSwitchButton
        isEnglish={isEnglish}
        toggleLanguage={toggleLanguage}
      />
     </View>*/}
      <KVMainView indicator={indicator}>
        <View style={styles.card}>
          <Image
            source={require('../assets/img/ic_launcher_round.png')}
            style={styles.image}
          />
          <View style={styles.form}>
            <ScrollView>
            <View style={styles.inputs}>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                placeholder={strings.mobile}
                autoCapitalize="none"
                onChangeText={item => updateState('mobile', item)}
                maxLength={10}
                value={user.mobile}></TextInput>
              <View>
                <KVPasswordInput
                  placeholder={strings.password}
                  onValueChange={value => {
                    updateState('password', value);
                  }}
                />
              </View>
              <KVButton value={strings.login} onPressHandler={loginHandler} />
              <Text>{strings.newUser}:</Text>
              <KVButton
                value={strings.register}
                onPressHandler={() => navigation.navigate(SCREEN_NAME.REGISTER)}
              />
              {/* <TouchableOpacity
                onPress={() => navigation.navigate(SCREEN_NAME.FORGOTPASSWORD)}>
                <Text style={styles.forgotPasswordText}>
                  {strings.forgotPassword}
                </Text>
              </TouchableOpacity> */}
            </View>
            </ScrollView>
          </View>
        </View>
      </KVMainView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer:{
    flex: 1,
    height: DIMENSIONS.HEIGHT,
    maxHeight: DIMENSIONS.HEIGHT,
    backgroundColor:CONTAINER_COLOR.LIGHTGREY
  },
  toggleContainer:{
    marginTop:"5%",
    height:"3%",
    backgroundColor:CONTAINER_COLOR.BACKGROUNDCOLOR,
    marginLeft:'2%',
    marginBottom: '6%',
    borderColor:CONTAINER_COLOR.BACKGROUNDCOLOR
  },
  image: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: '8%',
  },
  card: {
    position:"relative",
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: CONTAINER_COLOR.OPTIONALWHITE,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: DIMENSIONS.HEIGHT / 9,
    elevation:10
  },
  heading: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    fontWeight: 'bold',
    marginTop: '5%',
    color: 'black',
    alignItems: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: '10%',
    width: '100%',
    alignItems: 'center'
  },
  inputs: {
    width: '90%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '8%',
    marginBottom:'10%'
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingTop: '5%',
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    minHeight: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    width: '100%',
    alignItems: 'center',

  },
  passwordInput: {
    paddingTop: '10%',
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    minHeight: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    width: '100%',
  },
  forgotPasswordText: {
    marginTop: 10, // Space between button and link
    color: 'blue', // Link color
    textDecorationLine: 'underline', // Underline to indicate a link
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM, // Adjust font size
  },
});

export default LoginScreen;
