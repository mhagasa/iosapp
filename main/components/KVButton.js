import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {
  BUTTON_COLOR,
  BUTTON_STYLE,
  FONT_CONSTANTS,
} from '../constants/theme-constants';

export default function KVButton(props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={props.onPressHandler}>
        <Text style={styles.buttonText}>{props.value}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: BUTTON_COLOR.ACTIVE,
    height: FONT_CONSTANTS.FONT_SIZE_MEDIUM + 25,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: '2%',
  },
  buttonText: {
    color: BUTTON_STYLE.TEXT_COLOR,
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    fontWeight: '400',
  },
});
