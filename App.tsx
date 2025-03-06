import React, {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import { StyleSheet } from 'react-native';
import {View, Text} from 'react-native';

//import KVAsyncStorage from './main/services/KVAsyncStorage';
//import { ASYNCSTORAGE_KEYS } from './main/constants/asyncStorage-constants';

import { useIsMounted } from './main/hooks/useIsMounted';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import KVUserContext from './main/contexts/KVUserContext';

import { KVUserManager } from './main/contexts/KVUserManager';

import strings from './main/localizations/screen';
import { SCREEN_NAME } from './main/constants/app-constants';
import RegisterScreen from './main/screens/RegisterScreen';

import LoginScreen from './main/screens/LoginScreen';
import SplashScreen from './main/screens/SplashScreen';

const Stack = createStackNavigator();

const userManager = new KVUserManager();

function App(): React.JSX.Element {
  //const isDarkMode = useColorScheme() === 'dark';
  const isMounted = useIsMounted();

  const [initialRouteName, setInitialRouteName] = useState(SCREEN_NAME.SPLASH);



  //fetch rooms from api
  useEffect(() => {
    // new KVAsyncStorage()
    //   .getItems(ASYNCSTORAGE_KEYS.KEY_LANGUAGE)
    //   .then(language => {
    //     if (isMounted.current && language) {
    //       strings.setLanguage(JSON.parse(language));
    //     }
    //   });
  }, []);

  return (
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

        </Stack.Navigator>
      </NavigationContainer>
    </KVUserContext.Provider>
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