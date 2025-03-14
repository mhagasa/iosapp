import React from 'react';
import {View, Text, Switch, StyleSheet, Image} from 'react-native';
import {
  LANGUAGE_CHANGE_TOGGLE_BUTTON,
  FONT_CONSTANTS,
} from '../constants/theme-constants'; // Adjust the path as necessary
import strings from '../localizations/screen';

export default function KVLanguageSwitchButton({isEnglish, toggleLanguage}) {
  return (
    <View style={styles.languageSwitchContainer}>
      <Image
        source={
          isEnglish
            ? require('../assets/flags/english_flag.png') // Replace with the actual path to the English flag image
            : require('../assets/flags/nepali_flag.png') // Replace with the actual path to the Nepali flag image
        }
        style={styles.flagIcon}
      />
      <Text style={styles.languageLabel}>
        {isEnglish ? strings.english : strings.nepali}
      </Text>
      <Switch
        style={LANGUAGE_CHANGE_TOGGLE_BUTTON.languageSwitchButtonSize}
        trackColor={LANGUAGE_CHANGE_TOGGLE_BUTTON.switchTrackColor}
        thumbColor={
          isEnglish
            ? LANGUAGE_CHANGE_TOGGLE_BUTTON.thumbColorOn
            : LANGUAGE_CHANGE_TOGGLE_BUTTON.thumbColorOff
        }
        onValueChange={toggleLanguage}
        value={isEnglish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  languageSwitchContainer: {
    position: 'absolute',
    top: '5%', // Adjust as needed to create space from the top
    right: '-6%', // Adjust as needed to create space from the right
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageLabel: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    fontWeight: 'bold',
  },
  flagIcon: {
    width: '15%',
    height: '100%',
    marginRight:'3%',
    resizeMode: 'contain',
  },
});
