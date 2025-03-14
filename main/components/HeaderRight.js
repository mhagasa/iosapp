import React, {useContext, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SCREEN_NAME} from '../constants/app-constants';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { DIMENSIONS } from '../constants/theme-constants';

export default HeaderRight = () => {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const iconSize = DIMENSIONS.WIDTH * 0.09;

  return (
    <View style={styles.container}>
      
      {/* <TouchableOpacity style={styles.notification}>
        <Pressable
          onPress={() => {
            navigation.navigate(SCREEN_NAME.NOTIFICATION);
          }}>
          <Ionicons name="notifications-outline" size={iconSize} />
        </Pressable>
      </TouchableOpacity>
      <TouchableOpacity>
        <Pressable
          onPress={() => {
            navigation.navigate(SCREEN_NAME.PROFILE);
          }}>
          <Ionicons name="person-circle-outline" size={iconSize} />
        </Pressable>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: '5%',
  },
  notification:{
    marginRight: '5%'
  }
});
