import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import KVRentContext from '../contexts/KVRentContext';
import { Rent } from '../models/Rent';
import { BUTTON_COLOR } from '../constants/theme-constants';
import KVListView from '../components/KVListView';

const KEY_VALUES = Rent.getPaidListViewProperties();
const PRIMARY_KEY = Rent.PRIMARY_KEY;


export default function ViewPaidRentsScreen({ onCancelClicked }) {

  const [paidRents, setPaidRents] = useState([]);
  const [filterBy, setFilterBy] = useState("Room");

  const rentContext = useContext(KVRentContext);

  useEffect(() => {
    setPaidRents(rentContext.getPaidRents());
  }, []);

  const handleApplyFilterClicked = () => {

  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold", alignContent: 'center', alignSelf: 'center', marginBottom: 5 }}>Paid Rents</Text>
      <View style={styles.lineStyle} />

      <KVListView
        dataSource={paidRents}
        primaryKey={PRIMARY_KEY}
        keyValues={KEY_VALUES}
        onRefresh={() => {}}
        onItemClicked={(item) => { }} />


      <View style={styles.button}>
        <Button title="Apply Filter" color={BUTTON_COLOR.ACTIVE} onPress={handleApplyFilterClicked} />
      </View>
      <View style={styles.button}>
        <Button title="Cancel" color={BUTTON_COLOR.CANCEL} onPress={onCancelClicked} />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    paddingTop: 75,
    paddingBottom: 75,
    padding: 5,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    minHeight: "50%"
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    margin: 5,
  },
  button: {
    margin: 5,
  },
  inputFilterBylabel: {
    width: '100%',
    fontSize: 14,
    minHeight: 40,
    flex: 1,
    flexDirection: 'row',
  },
  inputFilterBy: {
    marginRight: 10,
    marginTop: 15,
    width: '30%',
    height: 50,
  },
  inputFilterByPicker: {
    margin: 0,
    width: '50%',
    height: 40,
  }
});
