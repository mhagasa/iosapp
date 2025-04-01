import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Platform
} from 'react-native';

import {KVMainView} from '../components/KVMainView';

import {Tenant} from '../models/Tenant';

import KVTenantContext from '../contexts/KVTenantContext';
import KVRoomContext from '../contexts/KVRoomContext';

import {BUTTON_COLOR} from '../constants/theme-constants';
import strings from '../localizations/screen';
import {RESPONSE_STATUS} from '../constants/app-constants';
import { translateNepaliNumber } from '../validation/translate';
import { validateMobile } from '../validation/KVUserValidation';
import Toast from 'react-native-toast-message'; // Import Toast

/*
 * class for Add/Update Room Detail Screen
 */
export default function UpdateTenantDetailScreen({
  editMode,
  addMode,
  selectedRoom,
  onCancelClicked,
}) {
  const [item, setItem] = useState(new Tenant());
  const [indicator, setIndicator] = useState(false);

  const tenantContext = useContext(KVTenantContext);
  const roomContext = useContext(KVRoomContext);

  /*
   * method to update initial value
   */
  useEffect(() => {
    try {
      if (selectedRoom != undefined) {
        if(!addMode){
          let tenant = tenantContext.getTenantFromRoomId(selectedRoom._id);
          if (tenant) {
            setItem(tenant);
          }
        } else {
          let tenant = new Tenant();
          tenant.roomId = selectedRoom._id;
          tenant.roomName = selectedRoom.roomName;
          setItem(tenant);
        }
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error', // 'success', 'error', or 'info'
        position: 'top', // 'top', 'bottom', or 'center'
        text2: error.message ? error.message : JSON.stringify(error)
      });
    }
  }, []);

  /*
   * method to add new tenant
   */
  const addHandler = async () => {
    if (item._id) {
      item._id = null;
    }
    await updateHandler();
  };

  /*
   * method to update tenant
   */
  const updateHandler = async () => {
    try {
      setIndicator(true);
      let errorMessage;
      let response;
      
      if (!validateMobile(item.tenantPhone).isValid) {
        errorMessage = strings.enterMobile;
      }else{
        response = await tenantContext.addTenant(item);
      }
      if(errorMessage){
        Toast.show({
          type: 'error', // 'success', 'error', or 'info'
          position: 'top', // 'top', 'bottom', or 'center'
          text2: errorMessage
        });
      }
      if (response && response.status === RESPONSE_STATUS.SUCCESS) {
        selectedRoom.tenantId = response.responseData._id;
        selectedRoom.tenantName = response.responseData.tenantName;
        await roomContext.updateRoomList(selectedRoom);
        let message = '';
        if (item._id) {
          message = strings.tenantUpdatedSuccessfully;
        } else {
          message = strings.tenantAddedSuccessfully;
        }
        Toast.show({
          type: 'info', // 'success', 'error', or 'info'
          position: 'top', // 'top', 'bottom', or 'center'
          text2: message
        });
        onCancelClicked();
      } else if (response && response.errorMessage) {
        //display error
        throw response.errorMessage;
      } else {
        //display internal error
        throw response;
      }
      setIndicator(false);
    } catch (err) {
      setIndicator(false);
      console.log(err);
      Toast.show({
        type: 'error', // 'success', 'error', or 'info'
        position: 'top', // 'top', 'bottom', or 'center'
        text2: err.message
      });
    }
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

  return (
    <View style={{flex: 1}}>
      <KVMainView indicator={indicator}>
        <View style={styles.container}>
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                alignContent: 'center',
                alignSelf: 'center',
                marginBottom: 5,
              }}>
              {addMode? strings.addTenantDetails : strings.updateTenantDetails}
            </Text>

            <View style={styles.lineStyle} />

            <Text style={styles.text}>{strings.tenantName}:</Text>
            <TextInput
              style={styles.input}
              value={item.tenantName}
              selectTextOnFocus={true}
              onChangeText={text => updateState('tenantName', text)}
            />

            <Text style={styles.text}>{strings.totalAdults}:</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              editable={true}
              selectTextOnFocus={true}
              onChangeText={text => updateState('totalAdults',translateNepaliNumber(text))}
              value={`${item.totalAdults}`}
            />

            <Text style={styles.text}>{strings.totalChildren}:</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              selectTextOnFocus={true}
              onChangeText={text => updateState('totalChildren',translateNepaliNumber(text))}
              value={`${item.totalChildren}`}
            />

            <Text style={styles.text}>{strings.address}:</Text>
            <TextInput
              style={styles.input}
              value={item.address}
              selectTextOnFocus={true}
              onChangeText={text => updateState('address', text)}
            />

            <Text style={styles.text}>{strings.phone}:</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              maxLength={10}
              selectTextOnFocus={true}
              onChangeText={text => updateState('tenantPhone',translateNepaliNumber(text))}
              value={`${item.tenantPhone}`}
            />

            <View style={styles.button}>
              
              {addMode? (
              <View style={styles.button}>
                <Button
                  title={strings.addNew}
                  color={BUTTON_COLOR.ACTIVE}
                  onPress={addHandler}
                />
              </View>
              ):(
                item._id ? (
                  <View style={styles.button}>
                    <Button
                      title={strings.updateExisting}
                      color={BUTTON_COLOR.ACTIVE}
                      onPress={updateHandler}
                    />
                  </View>
                ) : (
                  <View />
                )
              )}

              <View style={styles.button}>
                <Button
                  title={strings.cancel}
                  color={BUTTON_COLOR.CANCEL}
                  onPress={onCancelClicked}
                />
              </View>
            </View>
          </View>
        </View>
      </KVMainView>
    </View>
  );
}

/*
 * style css class
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    paddingTop: 10,
    padding: 20,
    backgroundColor: '#fff',
    width: '100%',
    marginTop: Platform.OS === 'ios' ? "25%" : "2%",
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    margin: 5,
  },
  text: {
    fontSize: 15,
    margin: 5,
  },
  input: {
    borderWidth: 1,
    borderBottomColor: 'black',
    borderRadius: 10,
    padding: 5,
    fontSize: 15,
    minHeight: 35,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    marginTop: 10,
    justifyContent: 'space-between',
  },
  modalSelection: {
    borderWidth: 1,
    width: '100%',
    borderColor: 'white',
    borderRadius: 10,
    paddingTop: 5,
    paddingBottom: 10,
    padding: 5,
    backgroundColor: '#fff',
    alignContent: 'center',
    height: '90%',
  },
});
