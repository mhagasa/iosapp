import React, {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import { StyleSheet } from 'react-native';
import {View, Text} from 'react-native';

import KVAsyncStorage from './main/services/KVAsyncStorage';
import { ASYNCSTORAGE_KEYS } from './main/constants/asyncStorage-constants';

import { useIsMounted } from './main/hooks/useIsMounted';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import KVUserContext from './main/contexts/KVUserContext';
import { KVUserManager } from './main/contexts/KVUserManager';

import strings from './main/localizations/screen';

import HeaderRight from './main/components/HeaderRight';

import { SCREEN_NAME } from './main/constants/app-constants';
import { HEADER_COLOR } from './main/constants/theme-constants';

import RegisterScreen from './main/screens/RegisterScreen';
import LoginScreen from './main/screens/LoginScreen';
import ForgotPasswordScreen from './main/screens/ForgotPasswordScreen';
import SplashScreen from './main/screens/SplashScreen';
import SendRegisterOtpScreen from './main/screens/SendRegisterOtpScreen';
import TabNavigator from './main/screens/TabNavigator';
import ViewAllRentScreen from './main/screens/ViewAllRentScreen';

import KVRoomContext from './main/contexts/KVRoomContext';
import KVRentContext from './main/contexts/KVRentContext';
import KVTenantContext from './main/contexts/KVTenantContext';
import { KVRoomManager } from './main/contexts/KVRoomManager';
import { KVRentManager } from './main/contexts/KVRentManager';
import { KVTenantManager } from './main/contexts/KVTenantManager';

const Stack = createStackNavigator();

const roomManager = new KVRoomManager();
const tenantManager = new KVTenantManager();
const rentManager = new KVRentManager();
const userManager = new KVUserManager();

function App(): React.JSX.Element {
  //const isDarkMode = useColorScheme() === 'dark';
  const isMounted = useIsMounted();

  const [initialRouteName, setInitialRouteName] = useState(SCREEN_NAME.SPLASH);



  //fetch rooms from api
  useEffect(() => {
    new KVAsyncStorage()
      .getItems(ASYNCSTORAGE_KEYS.KEY_LANGUAGE)
      .then(language => {
        if (isMounted.current && language) {
          strings.setLanguage(JSON.parse(language));
        }
      });
  }, []);

  return (
    <KVRoomContext.Provider value={roomManager}>
      <KVRentContext.Provider value={rentManager}>
        <KVTenantContext.Provider value={tenantManager}>
          <KVUserContext.Provider value={userManager}>
            <NavigationContainer>
              <Stack.Navigator initialRouteName={initialRouteName}>
                <Stack.Screen 
                name={SCREEN_NAME.SPLASH}
                component={SplashScreen}
                options={{
                  headerShown: false
                  }} 
                />
                
                <Stack.Screen 
                name={SCREEN_NAME.LOGIN}
                component={LoginScreen}
                options={{
                  headerShown: false
                  }} 
                />

                <Stack.Screen
                name={SCREEN_NAME.REGISTER}
                component={RegisterScreen}
                options={{
                  headerShown: true,
                }}
                />

                <Stack.Screen 
                name={SCREEN_NAME.FORGOTPASSWORD}
                component={ForgotPasswordScreen}
                options={{
                  headerShown: true
                }} 
                />


                <Stack.Screen 
                name={SCREEN_NAME.VIEWALLRENT}
                component={ViewAllRentScreen}
                options={{
                  title: strings.viewAllRents
                }}
                />

                <Stack.Screen 
                name={SCREEN_NAME.SENDREGISTEROTP}
                component={SendRegisterOtpScreen}
                options={{
                  title: strings.sendOtp,
                  headerStyle: {backgroundColor: HEADER_COLOR.TITLE},
                  headerLeft: () => null,
                }}
                />
                
                <Stack.Screen 
                name={SCREEN_NAME.TABNAVIGATOR}
                component={TabNavigator}
                options={{
                  headerShown: false,
                  headerRight: () => <HeaderRight />
                }} 
                />
              </Stack.Navigator>
            </NavigationContainer>
          </KVUserContext.Provider>
        </KVTenantContext.Provider>
      </KVRentContext.Provider>
    </KVRoomContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;