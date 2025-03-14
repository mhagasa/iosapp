import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, BackHandler, ToastAndroid, Alert, Text} from 'react-native';

export default function RoomDetailScreen() {

  return (
    <View style={styles.container}>
      
      <View>
        <Text>
            Hello Gharbeti Baa!!!
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '2%',
    width: '100%',
  },
  insideContainer: {
    height: '87%',
  },
  row: {
    margin: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 1,
  },
  rowText: {
    fontSize: 10,
  },
  searchContainer: {
    width:'103%',
    height:"2.2%",
    marginLeft:'-2%',
    marginBottom: '7.5%',
    borderBottomWidth: 0, // Removes the bottom border
    borderTopWidth: 0,    // Removes the top border
  },
  searchInput: {
     height:"7%",
     borderRadius: 10, 
     shadowColor: '#000', 
     shadowOffset: { width: 0, height: 4 }, 
     shadowOpacity: 0.2, 
     shadowRadius: 4, 
     elevation: 5,
  },
});
