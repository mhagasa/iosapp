import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

import {FONT_CONSTANTS, HEADER_COLOR} from '../constants/theme-constants';

// import RoomDetailScreen from './RoomDetailScreen';
// import RentDetailScreen from './RentDetailScreen';
import testScreen from './testScreen';

import {SCREEN_NAME, LABEL} from '../constants/app-constants';
import HeaderRight from '../components/HeaderRight';
import strings from '../localizations/screen';
import { color } from 'react-native-elements/dist/helpers';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      // initialRouteName={SCREEN_NAME.ROOMDETAIL}
      // screenOptions={({route}) => ({
      //   tabBarIcon: ({focused, color, size}) => {
      //     let iconName;
      //     let rn = route.name;

      //     if (rn === SCREEN_NAME.ROOMDETAIL) {
      //       iconName = focused ? 'home' : 'home-outline';
      //     } else if (rn === SCREEN_NAME.RENTDETAIL) {
      //       iconName = focused ? 'list' : 'list-outline';
      //     } else if (rn === SCREEN_NAME.TENATNDETAIL) {
      //       iconName = focused ? 'people' : 'people-outline';
      //     }
      //     return <Ionicons name={iconName} size={25} color={color} />;
      //   },
      //   headerRight: () => <HeaderRight />,
      //   headerBackVisible: false,
      //   tabBarHideOnKeyboard: true, 
      // })}
      >
      {/* <Tab.Screen
        name={SCREEN_NAME.ROOMDETAIL}
        component={RoomDetailScreen}
        options={{
          title: strings.kothaVada,
          headerTitleAlign: 'left',
          headerBackVisible: () => null,
          gestureEnabled: false,
          tabBarLabel: strings.room,
          headerShadowVisible: true,
          headerStyle: {
            backgroundColor: "white",
            shadowColor: 'white',
            
          },
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: '#fff',
            height: '7.3%',
            ...styles.shadow,
          },
          tabBarLabelStyle: {
            fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
            padding:4
          },
        }}
      />
      <Tab.Screen
        name={SCREEN_NAME.RENTDETAIL}
        component={RentDetailScreen}
        options={{
          title: strings.kothaVada,
          headerTitleAlign: 'left',
          headerBackVisible: () => null,
          gestureEnabled: false,
          tabBarLabel: strings.rent,
          headerShadowVisible: true,
          headerStyle: {
            backgroundColor: HEADER_COLOR.TITLE,
            shadowColor: 'black',
          },
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: '#ffffff',
            height: '6.3%',
            elevation: 5
          },
          tabBarLabelStyle: {
            fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
            padding:5
          },
        }}
      /> */}
      <Tab.Screen name={'testScreen'} component={testScreen}></Tab.Screen>
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  shadow: {
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.5,
    elevation: 5,
  },
});
