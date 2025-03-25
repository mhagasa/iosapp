import React, {useState, useContext} from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Button} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BUTTON_COLOR} from '../constants/theme-constants';
import KVRentContext from '../contexts/KVRentContext';
import strings from '../localizations/screen';

export default function KVCollapse(props) {
  const [openArrow, setOpenArrow] = useState(true);
  const rentContext = useContext(KVRentContext);

  return (
    <View style={styles.container}>
      <View style={styles.arrowContainer}>
        <TouchableOpacity
          onPress={() => setOpenArrow(!openArrow)}
          style={styles.touchableOpacityStyle}>
          {openArrow ? (
            <Ionicons name="caret-up" size={20} />
          ) : (
            <Ionicons name="caret-down" size={20} />
          )}
        </TouchableOpacity>
        {openArrow ? (
          <View style={styles.buttonContainer} hide={false}>
            <View style={styles.button}>
              <Button
                title={strings.update}
                color={BUTTON_COLOR.UPDATE}
                onPress={() => props.handleUpdate(props.item)}
              />
            </View>
            <View style={styles.button}>
              <Button
                title={strings.delete}
                color={BUTTON_COLOR.DELETE}
                onPress={() => props.handleDeleteClicked(props.item)}
              />
            </View>
            <View style={styles.button}>
              <Button
                title={strings.pay}
                color={BUTTON_COLOR.PAY}
                onPress={() => props.handlePayClicked(props.item)}
              />
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arrowContainer: {
    flexDirection: 'row',
    margin: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    marginRight: '5%',
    width: '25%',
  },
  touchableOpacityStyle: {
    width: '10%',
  },
});
