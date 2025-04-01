import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Alert,
  TouchableOpacity,
  Platform
} from 'react-native';
// import {CalendarPicker} from 'react-native-nepali-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import {Tenant} from '../models/Tenant';
import {Room} from '../models/Room';
import {Rent} from '../models/Rent';
import KVTenantContext from '../contexts/KVTenantContext';
import KVRoomContext from '../contexts/KVRoomContext';
import KVRentContext from '../contexts/KVRentContext';
import KVListView from '../components/KVListView';
// import PaymentScreen from './PaymentScreen';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RadioButton} from 'react-native-paper';

import {
  BUTTON_COLOR,
  CONTAINER_COLOR,
  DIMENSIONS,
  FONT_CONSTANTS,
  HEADER_COLOR
} from '../constants/theme-constants';
import {KVMainView} from '../components/KVMainView';
import strings from '../localizations/screen';
// import {STATUS_PAYMENT} from '../../../KothaVada-backend/constants/appContants';
import { translateNepaliNumber } from '../validation/translate';
import { DATE_SYSTEM } from '../constants/app-constants';
import { KVDatePicker } from '../components/KVDatePicker';
import { SearchBar } from 'react-native-elements';
/*
 * class for Add/Update Room Detail Screen
 */
export default function AddRentDetailScreen(props) {
  const [item, setItem] = useState(new Rent());
  const [editableMode, setEditableMode] = useState(props.editMode);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showTenantSelection, setShowTenantSelection] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [indicator, setIndicator] = useState(false);

  const [showStartDateSelection, setShowStartDateSelection] = useState(false);
  const [showEndDateSelection, setShowEndDateSelection] = useState(false);

  const tenantContext = useContext(KVTenantContext);
  const rentContext = useContext(KVRentContext);
  const roomContext = useContext(KVRoomContext);

  const tenants = tenantContext.tenantList;
  const occupiedRooms = roomContext.getFullRoom();
  const ROOM_PRIMARY_KEY = Room.PRIMARY_KEY;
  const ROOM_KEY_VALUES = Room.getTenantSelectionListViewProperties();
  const [searchQuery, setSearchQuery] = useState('');

  /*
   * method to update initial value
   */
  useEffect(() => {
    if (props.selectedItem != undefined && props.selectedItem._id) {
      setItem(props.selectedItem);
    }
  }, []);

  /*
   * method to save record
   */
  const saveHandler = async () => {
    setIndicator(true);
    await rentContext.addRent(item);
    props.onCancelClicked();
    setIndicator(false);
  };

  /*
   * method to display in editable mode record
   */
  const handleUpdateClicked = () => {
    setIndicator(true);
    setEditableMode(true);
    setIndicator(false);
  };

  const handlePayClicked = () => {
    setShowPayment(true);
  };

  const handlePaidRent = rent => {
    setItem(rent);
    setShowPayment(false);
    props.onCancelClicked();
  };

  const handlePayCancelClicked = () => {
    setShowPayment(false);
  };

  /*
   * method to delete record with confirmation
   */
  const handleDeleteClicked = () => {
    return Alert.alert(strings.areYouSureToDelete, '', [
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: strings.no,
      }, // The "Yes" button
      {
        text: strings.yes,
        onPress: () => {
          setIndicator(true);
          rentContext.deleteRent(item);
          props.onCancelClicked();
          setIndicator(false);
        },
      },
    ]);
  };

  /*
   * method to update the key and value for state
   */
  const updateState = (key, value) => {
    setItem(oldState => ({
      ...oldState,
      [key]: value,
    }));
  };

  const onStartDateChange = (selectedDate) => {
    setShowStartDateSelection(false);
    let currentDate = selectedDate;
    //set startDate
    updateState('dateStart',selectedDate?.toISOString().substring(0, 10));

    //set enddate to default 30 days later
    let endDate = new Date(currentDate.setDate(currentDate.getDate() + 30));
    updateState('dateEnd', endDate?.toISOString().substring(0, 10));
  };

  const onEndDateChange = (selectedDate) => {
    setShowEndDateSelection(false);
    let currentDate = selectedDate;

    updateState('dateEnd', currentDate?.toISOString());
  };
  
   
  const resetDateSystem = () => {
    updateState('dateStart', null);  
    updateState('dateEnd', null);    
};

  const handleSelectedRoom = room => {
    setSelectedRoom(room);
    let updatedItem = new Rent();
    updatedItem.tenantId = room.tenantId;
    updatedItem.tenantName = room.tenantName;
    updatedItem.roomId = room._id;
    updatedItem.roomName = room.roomName;
    updatedItem.roomRent = room.price;
    updatedItem.garbageCharge = room.garbageCharge;
    updatedItem.dateSystem = DATE_SYSTEM.BS;
    setItem(updatedItem);
    setShowTenantSelection(false);
  };

  const filteredRooms = occupiedRooms.filter(room => {
  const query = searchQuery.trim().toLocaleLowerCase(); 
  const tenantName = room.tenantName.trim().toLocaleLowerCase(); 
  const roomName = room.roomName.trim().toLocaleLowerCase(); 
  
  return tenantName.includes(query) || roomName.includes(query);
  });
  
  return (
    <View style={{flex: 1}}>
      <KVMainView indicator={indicator}>
        <View>
          {showTenantSelection ? (
            <View>
              {/* Close Button (cross) */}
              <TouchableOpacity onPress={() => {
                setShowTenantSelection(false);
              }} style={styles.closeButton}>
                <Icon name="close" size={40} color="white" />
              </TouchableOpacity>

              <View style={styles.modalSelection}>
                <Text style={styles.header}>{strings.selectTenant}</Text>
                <View style={styles.lineStyle} />
                  <SearchBar
                    placeholder={strings.searchplaceholder}
                    containerStyle={styles.searchContainer}
                    inputContainerStyle={styles.searchInput}
                    inputStyle={{ fontSize: FONT_CONSTANTS.FONT_SIZE_SMALL * 1.2 }} 
                    clearIcon={{color: BUTTON_COLOR.CANCEL}}
                    onChangeText={setSearchQuery}
                    value={searchQuery}/>
                <View style={styles.listView}>
                  <KVListView
                    dataSource={filteredRooms}
                    primaryKey={ROOM_PRIMARY_KEY}
                    keyValues={ROOM_KEY_VALUES}
                    onItemClicked={item => handleSelectedRoom(item)}
                    onRefresh={() => {}}
                  />
                </View>

              </View>
            </View>
          ) : (
            <View style={styles.container}>
              <View>
                {editableMode ? (
                  item && item._id ? (
                    <Text style={styles.header}>{strings.updateRent}</Text>
                  ) : (
                    <Text style={styles.header}>{strings.addRent}</Text>
                  )
                ) : (
                  <Text style={styles.header}>{strings.rentDetails}</Text>
                )}
                <View style={styles.lineStyle} />

                <Text style={styles.text}>{strings.tenant}:</Text>
                {editableMode ? (
                  <TouchableOpacity style={{borderColor: 'black', borderWidth: 1,  borderRadius: 5}}
                    onPress={() => setShowTenantSelection(true)}
                    >
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.selectTenant}>
                        {item.tenantName || strings.selectTenant}
                      </Text>
                      <View style={styles.caretdown}>
                        <Ionicons  name="caret-down" size={20} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.input}>{item.tenantName}</Text>
                )}

                <View style={styles.roomContainer}>
                  <Text style={styles.text}>
                    {strings.roomName}:{' '}
                  </Text>
                  <Text style={styles.text}>{item.roomName}</Text>
                </View>
                <View style={styles.roomContainer}>
                  <Text style={styles.text}>
                    {strings.roomRent}:{' '}
                  </Text>
                  <Text style={styles.text}>{item.roomRent}</Text>
                </View>
                <View style={styles.electricityContainer} >
                <Text style={styles.text}>{strings.electricityUnit}:</Text>
                <Text style={styles.chargeText}>{strings.electricityPerUnit}:</Text>
               </View >
               <View style={styles.electricityContainer} >
               <TextInput
                  style={styles.electricityInput}
                  keyboardType="number-pad"
                  editable={editableMode}
                  selectTextOnFocus={editableMode}
                  onChangeText={text => updateState('electricityUnit', translateNepaliNumber(text))}
                  value={`${item.electricityUnit}`}
                />
               <TextInput
                  style={styles.electricityInput}
                  keyboardType="number-pad"
                  editable={editableMode}
                  selectTextOnFocus={editableMode}
                  onChangeText={text => updateState('electricityPerUnit', translateNepaliNumber(text))}
                  value={`${item.electricityPerUnit}`}
                />
                </View>
                <Text style={styles.text}>{strings.garbageCharge}:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  editable={editableMode}
                  selectTextOnFocus={editableMode}
                  onChangeText={text => updateState('garbageCharge', translateNepaliNumber(text))}
                  value={`${item.garbageCharge}`}
                />

                <Text style={styles.text}>{strings.waterCharge}:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  editable={editableMode}
                  selectTextOnFocus={editableMode}
                  onChangeText={text => updateState('waterCharge', translateNepaliNumber(text))}
                  value={`${item.waterCharge}`}
                />

                <View style={styles.radioButton}>
                <Text style={styles.radioText}>{DATE_SYSTEM.BS}:</Text>
                <RadioButton
                  style={styles.rbutton}
                  value={DATE_SYSTEM.BS}
                  status={item.dateSystem === DATE_SYSTEM.AD ? 'unchecked' : 'checked'} 
                  onPress={() => {
                      resetDateSystem();
                      updateState('dateSystem', DATE_SYSTEM.BS);
                  }}
                  />
                <Text style={styles.radioText}>{DATE_SYSTEM.AD}:</Text>
                <RadioButton
                    value={DATE_SYSTEM.AD}
                    status={item.dateSystem === DATE_SYSTEM.AD ? 'checked' : 'unchecked'}
                    onPress={() => {
                        resetDateSystem();
                        updateState('dateSystem', DATE_SYSTEM.AD);
                    }}
                />
   
                </View>
                <Text style={styles.text}>{strings.startDate}:</Text>
                {editableMode ? (
                  <View>
                    <TouchableOpacity onPress={() => setShowStartDateSelection(true)}>
                      <Text style={styles.input}>
                       {item.dateStart ? item.dateStart.substring(0, 10) : ''}
                        </Text>
                      </TouchableOpacity>
                    {showStartDateSelection ? 
                       <KVDatePicker
                         dateSystem = {item.dateSystem}
                         onDateSelect={onStartDateChange}
                         onCloseClicked = {()=> setShowStartDateSelection(false)}
                       />
                     : (
                      <View />
                    )}
                  </View>
                ) : (
                  <Text style={styles.input}>
                    {item.dateStart.substring(0, 10)}
                  </Text>
                )}

                <Text style={styles.text}>{strings.endDate}:</Text>
               {editableMode ? (
                  <View>
                    <TouchableOpacity onPress={() => setShowEndDateSelection(true)}>
                      <Text style={styles.input}>
                        {item.dateEnd ? item.dateEnd.substring(0, 10) : ''}
                      </Text>
                    </TouchableOpacity>
                    {showEndDateSelection ? (
                      <KVDatePicker
                      dateSystem={item.dateSystem}
                      onDateSelect={onEndDateChange}
                      onCloseClicked={() => setShowEndDateSelection(false)}
                    />
                    ) : null}
                  </View>
                ) : (
                  <Text style={styles.input}>
                    {item.dateEnd ? item.dateEnd.substring(0, 10) : ''}
                  </Text>
                )}

                {editableMode ? (
                  <View style={styles.button}>
                    <Button
                      title={strings.save}
                      color={BUTTON_COLOR.ACTIVE}
                      onPress={saveHandler}
                    />
                  </View>
                ) : (
                  <View></View>
                )}

                <View style={styles.button}>
                  <Button
                    title={strings.cancel}
                    color={BUTTON_COLOR.CANCEL}
                    onPress={props.onCancelClicked}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </KVMainView>
    </View>
  );
}

/*
 * style css class
 */
const styles = StyleSheet.create({
  caretdown: {
    margin: '2%'
  },
  container: {
      marginTop: Platform.OS === 'ios' ? "25%" : "2%",
    borderRadius: 5,
    borderColor: 'white',
    paddingTop:"2%",
    paddingHorizontal: '5%',
    backgroundColor: 'white',
    minHeight: DIMENSIONS.HEIGHT / 2.1,
    maxHeight: DIMENSIONS.HEIGHT / 1.1,
  },
  modalSelection: {
    borderWidth: 1,
    width: '100%',
    borderColor: 'white',
    borderRadius: 5,
    backgroundColor: 'white',
    alignContent: 'center',
    padding: '1%',
    height: '100%',
    minHeight: DIMENSIONS.HEIGHT / 2.1,
    maxHeight: DIMENSIONS.HEIGHT / 1.3,
  },
  header: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    fontWeight: 'bold',
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom: '1%',
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    margin: '1%',
  },
  text: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    fontWeight: 'bold',
  },
  chargeText: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    fontWeight: 'bold',
    marginLeft:"10%"
  },
  input: {
    borderWidth: 1,
    borderBottomColor: 'black',
    borderRadius: 5,
    padding: '2%',
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    minHeight: DIMENSIONS.HEIGHT / 150,
    width: '100%',
  },
  electricityInput: {
    borderWidth: 1,
    borderBottomColor: 'black',
    borderRadius: 5,
    padding: '2%',
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    minHeight: DIMENSIONS.HEIGHT / 150,
    width: '46%',
  },
  electricityContainer:{
    flexDirection:"row",
    gap:"8%",     
  },
  selectTenant: {
    padding: '2%',
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    minHeight: DIMENSIONS.HEIGHT / 150,
    width: '90%'
  },
  button: {
    marginVertical: '2%',
    justifyContent: 'space-between',
  },
  listView: {
    marginTop: '2%',
    justifyContent: 'center',
    maxHeight: '85%',
  },
  roomContainer: {
    flexDirection: 'row',
  },
  readOnlyLabelStyle: {
    flex: 1,
    justifyContent: 'flex-start',
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    fontWeight: 'bold',
  },
  readOnlyValueStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
  },
  radioButton:{
    flexDirection: "row",
    justifyContent:"flex-start",
    gap:5
  },
  radioText:{
    fontWeight:"bold",
    fontSize:FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    marginTop:'3%',
    marginRight:'-2%'
  },
  rbutton:{
    padding: 2,
  },
   searchContainer: {
    width:'100%',
    height:"2%",
    backgroundColor:CONTAINER_COLOR.BACKGROUNDCOLOR,
    marginLeft:'-1%',
    marginBottom: '12%',
    borderBottomWidth: 0, // Removes the bottom border
    borderTopWidth: 0,    // Removes the top border
    borderColor:CONTAINER_COLOR.BACKGROUNDCOLOR
    },
    searchInput: {
     height:"7%",
     backgroundColor: HEADER_COLOR.TITLE,
     borderRadius: 10, 
     shadowColor: '#000', 
     shadowOffset: { width: 0, height: 4 }, 
     shadowOpacity: 0.2, 
     shadowRadius: 4, 
     elevation: 5,
    },
});
