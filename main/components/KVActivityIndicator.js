import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

import {DIMENSIONS} from '../constants/theme-constants';

export default KVActivityIndicator = ({setIndicator}) => {
  return (
    <View style={styles.container}>
      {setIndicator ? (
        <ActivityIndicator
          size="large"
          animating={setIndicator}
          style={styles.loading}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  loading: {
    position: 'absolute',
    opacity: 0.5,
    backgroundColor: 'grey',
    height: DIMENSIONS.HEIGHT,
    width: DIMENSIONS.WIDTH,
  },
});
