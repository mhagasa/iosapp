import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import {Room} from '../models/Room';
import KVRoomContext from '../contexts/KVRoomContext';
import UpdateTenantDetailScreen from './UpdateTenantDetailScreen';
import {
  BUTTON_COLOR,
  DIMENSIONS,
  FONT_CONSTANTS,
} from '../constants/theme-constants';
import {RESPONSE_STATUS} from '../constants/app-constants';
import {KVMainView} from '../components/KVMainView';
import strings from '../localizations/screen';
import { translateNepaliNumber } from '../validation/translate';
import Toast from 'react-native-toast-message';

/*
 * class for Add/Update Room Detail Screen
 */
export default function AddRoomDetailScreen(props) {
  const [room, setRoom] = useState(new Room());
  const [editableMode, setEditableMode] = useState(props.editMode);
  const [showTenantDetail, setShowTenantDetail] = useState(false);
  const [indicator, setIndicator] = useState(false);
  const roomContext = useContext(KVRoomContext);

  // Dropdown data for room types
  const roomTypes = [
    { label: strings.flat, value: 'Flat' },
    { label: strings.room, value: 'Room' }
  ];

  /*
   * method to update initial value
   */
  useEffect(() => {
    if (props.selectedRoom != undefined) {
      setRoom(props.selectedRoom);
    }
  }, []);

  /*
   * method to save record
   */
  const saveHandler = async () => {
    try {
      setIndicator(true);
      if (formValidation(room)) {
        let response = await roomContext.addRoom(room);
        setIndicator(false);
        if (response && response.status === RESPONSE_STATUS.SUCCESS) {
          setEditableMode(false);
          let message = room._id
            ? strings.roomUpdatedSuccessfully
            : strings.roomSavedSuccessfully;
          setRoom(response.responseData);
          Toast.show({
            type: 'error', // 'success', 'error', or 'info'
            position: 'top', // 'top', 'bottom', or 'center'
            text2: message
          });
          props.onCancelClicked();
        } else if (response && response.errorMessage) {
          //display error
          Toast.show({
            type: 'error', // 'success', 'error', or 'info'
            position: 'top', // 'top', 'bottom', or 'center'
            text2: response.errorMessage
          });
        } else {
          //display internal error
          Toast.show({
            type: 'error', // 'success', 'error', or 'info'
            position: 'top', // 'top', 'bottom', or 'center'
            text2: response
          });
        }
      }
      setIndicator(false);
    } catch (err) {
      setIndicator(false);
      //display error
      Toast.show({
        type: 'error', // 'success', 'error', or 'info'
        position: 'top', // 'top', 'bottom', or 'center'
        text2: err.message
      });
    }
  };

  /*
   * validate the room details entered
   */
  const formValidation = room => {
    try {
      let valid = false;
      let errorMessage;
      if (!room.roomName.trim()) {
        errorMessage = strings.enterRoomName;
      } else if (!room.floor.trim()) {
        errorMessage = strings.enterFloor;
      } else if (!room.price) {
        errorMessage = strings.enterPrice;
      } else {
        valid = true;
      }
      if (!valid) {
        //display error
        Toast.show({
          type: 'error', // 'success', 'error', or 'info'
          position: 'top', // 'top', 'bottom', or 'center'
          text2: errorMessage
        });
      }
      return valid;
    } catch (err) {
      //display internal error
      Toast.show({
        type: 'error', // 'success', 'error', or 'info'
        position: 'top', // 'top', 'bottom', or 'center'
        text2: err.message
      });
    }
  };

  /*
   * method to display in editable mode record
   */
  const handleUpdateClicked = () => {
    setEditableMode(true);
  };

  const handleUpdateTenantClicked = () => {
    setShowTenantDetail(true);
  };

  /*
   * method to handle cancel clicked
   */
  const handleCancelClicked = () => {
    editableMode && room._id ? setEditableMode(false) : props.onCancelClicked();
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
        onPress: async () => {
          setIndicator(true);
          await roomContext.deleteRoom(room);
          setIndicator(false);
          props.onCancelClicked();
        },
      },
    ]);
  };

  /*
   * method to update the key and value for state
   */
  const updateState = (key, value) => {
    setRoom(oldState => ({
      ...oldState,
      [key]: value,
    }));
  };

  return (
    <View style={{flex: 1}}>
        {showTenantDetail ? (
          <UpdateTenantDetailScreen
            selectedRoom={room}
            onCancelClicked={() => {
              setRoom(roomContext.getDetails(room._id));
              setShowTenantDetail(false);
            }}></UpdateTenantDetailScreen>
        ) : (
          <KVMainView indicator={indicator}>
            <View style={styles.container}>
              {editableMode ? (
                room && room._id ? (
                  <Text style={styles.header}>{strings.updateRoom}</Text>
                ) : (
                  <Text style={styles.header}>{strings.addRoom}</Text>
                )
              ) : (
                <Text style={styles.header}>{strings.roomDetails}</Text>
              )}
              <View style={styles.lineStyle} />

              <Text style={styles.text}>{strings.roomName}:</Text>
              <TextInput
                style={styles.input}
                value={room.roomName}
                editable={editableMode}
                selectTextOnFocus={editableMode}
                onChangeText={text => updateState('roomName', text)}
              />

              <Text style={styles.text}>{strings.type}:</Text>
              {editableMode ? (
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={roomTypes}
                  labelField="label"
                  valueField="value"
                  placeholder="Select type"
                  value={room.type}
                  onChange={item => updateState('type', item.value)}
                />
              ) : (
                <TextInput
                  style={styles.input}
                  editable={false}
                  value={room.type}
                />
              )}

              <Text style={styles.text}>{strings.floor}:</Text>
              <TextInput
                style={styles.input}
                value={room.floor}
                editable={editableMode}
                selectTextOnFocus={editableMode}
                onChangeText={text => updateState('floor', text)}
              />

              <Text style={styles.text}>{strings.price}:</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                editable={editableMode}
                selectTextOnFocus={editableMode}
                onChangeText={text => updateState('price', translateNepaliNumber(text))}
                value={`${room.price}`}
              />

              <Text style={styles.text}>{strings.garbageCharge}:</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                editable={editableMode}
                selectTextOnFocus={editableMode}
                onChangeText={text => updateState('garbageCharge', translateNepaliNumber(text))}
                value={`${room.garbageCharge}`}
              />
    
              {editableMode ? (
                <View style={styles.button}>
                  <Button
                    title={strings.save}
                    color={BUTTON_COLOR.ACTIVE}
                    onPress={saveHandler}
                  />
                </View>
              ) : (
                <View>
                  <View style={styles.button}>
                    <Button
                      title={strings.update}
                      color={BUTTON_COLOR.UPDATE}
                      onPress={handleUpdateClicked}
                    />
                  </View>
                  <View style={styles.button}>
                    <Button
                      title={strings.delete}
                      color={BUTTON_COLOR.DELETE}
                      onPress={handleDeleteClicked}
                    />
                  </View>
                </View>
              )}

              <View style={styles.button}>
                <Button
                  title={strings.cancel}
                  color={BUTTON_COLOR.CANCEL}
                  onPress={handleCancelClicked}
                />
              </View>
             
              </View>
          </KVMainView>
        )}
    <Toast/>
    </View>
  );
}

/*
 * style css class
 */
const styles = StyleSheet.create({
  container: {
    position:"relative",
    marginTop: Platform.OS === 'ios' ? "25%" : "2%",
    borderWidth: 1,
    borderRadius: 5,
    padding: '5%',
    backgroundColor: '#fff',
    height: '110%',
    width: '100%',
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
  },
  input: {
    borderWidth: 1,
    borderBottomColor: 'black',
    borderRadius: 5,
    padding: '1%',
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    height: FONT_CONSTANTS.FONT_SIZE_MEDIUM + 25,
    width: '100%',
    alignItems: 'center',
  },
  dropdown: {
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  placeholderStyle: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
  },
  button: {
    marginTop: '5%',
    justifyContent: 'space-between',
  },
  buttonContainer:{
    marginTop:'-100%',
    backgroundColor:"white"
  }
});