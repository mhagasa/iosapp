import React, {useEffect, useContext, useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {
  BUTTON_COLOR,
  CONTAINER_COLOR,
  FONT_CONSTANTS,
} from '../constants/theme-constants';

export default function KVRadioPopup(props) {
  const [checked, setChecked] = useState('');

  /*
   * method to set initial radio button
   */
  useEffect(() => {
    if (props.checked) {
      setChecked(props.checked);
    } else {
      if (props.values) {
        setChecked(Object.keys(props.values)[0]);
      }
    }
  }, []);

  /*
   * method to set checked clicked
   */
  const checkedClicked = async value => {
    await props.onCheckedChanged(value);
    setChecked(value);
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <View style={styles.centeredView}>
          {props.values
            ? Object.keys(props.values).map(key => (
                <View key={key} style={{flexDirection: 'row'}}>
                  <RadioButton
                    value={key}
                    status={checked === key ? 'checked' : 'unchecked'}
                    onPress={() => checkedClicked(key)}
                  />
                  <Text style={styles.text}>{props.values[key]}</Text>
                </View>
              ))
            : null}
          <Pressable onPress={props.onCancelClicked}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalView: {
    marginTop: '75%',
    margin: '25%',
    backgroundColor: CONTAINER_COLOR.LIGHTGREY,
    borderRadius: 20,
    padding: '5%',
    alignItems: 'center',
  },
  cancelButton: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    backgroundColor: BUTTON_COLOR.CANCEL,
    marginTop: '5%',
    padding: '5%',
    paddingHorizontal: '20%',
    borderRadius: 10,
  },
  text: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    marginLeft: '5%',
    paddingTop: '1%',
  },
});
