import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {DIMENSIONS,INSIDE_CONTAINER_COLOR} from '../constants/theme-constants';

export default function FloatingAdd({onClickHandler}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onClickHandler}
        style={styles.touchableOpacityStyle}>
        <Ionicons
          name="add-circle"
          style={styles.floatingButtonStyle}
          size={60}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top:'86%',
    left: '83%',
    justifyContent:'flex-end'
  },
  touchableOpacityStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: INSIDE_CONTAINER_COLOR,
    borderRadius: 100,
  },
  floatingButtonStyle: {
    color: '#000',
    borderwidth:1
  },
});
