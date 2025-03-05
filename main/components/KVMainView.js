import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import KVActivityIndicator from './KVActivityIndicator';

export function KVMainView(props) {
  return (
    <ScrollView
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>{props.children}</View>
        </ScrollView>
      </TouchableWithoutFeedback>
      {props.indicator && <KVActivityIndicator setIndicator={props.indicator} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flex: 1, 
    justifyContent: 'center', 
  },
  indicator: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
