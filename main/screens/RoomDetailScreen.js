import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, BackHandler, Alert} from 'react-native';
import Modal from 'react-native-modal';

import FloatingAdd from '../components/FloatingAdd';
import KVRoomListView from '../components/KVRoomListView';
import {RESPONSE_STATUS} from '../constants/app-constants';
import {CONTAINER_COLOR, FONT_CONSTANTS,HEADER_COLOR,BUTTON_COLOR} from '../constants/theme-constants';
import KVRoomContext from '../contexts/KVRoomContext';
import KVTenantContext from '../contexts/KVTenantContext';
import {useIsMounted} from '../hooks/useIsMounted';
import strings from '../localizations/screen';
import {Room} from '../models/Room';
import AddRoomDetailScreen from './AddRoomDetailScreen';
import UpdateTenantDetailScreen from './UpdateTenantDetailScreen';
import {SearchBar} from 'react-native-elements';
import Toast from 'react-native-toast-message'; // Import Toast

const PRIMARY_KEY = Room.PRIMARY_KEY;

export default function RoomDetailScreen() {
  const ROOM_KEY_VALUES = Room.getListViewProperties();

  const [isModalVisible, setModalVisible] = useState(false);
  const [isViewDetailVisible, setIsViewDetailVisible] = useState(false);
  const [isTenantDetailVisible, setIsTenantDetailVisible] = useState(false);
  const [addNewTenant, setAddNewTenant] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const roomContext = useContext(KVRoomContext);
  const tenantContext = useContext(KVTenantContext);
  const [exitApp, setExitApp] = useState(0);

  const isMounted = useIsMounted();
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  

  //fetch rooms from api
  useEffect(() => {
    setHasError(false);
    roomContext
      .loadRooms()
      .then(async response => {
        if (isMounted.current) {
          if (response.status === RESPONSE_STATUS.SUCCESS) {
            await tenantContext.addTenants(response.responseData.tenantDetails);
            setRooms(roomContext.roomList);
          } else {
            throw response.errorMessage;
          }
        }
      })
      .catch(error => {
        setHasError(true);
        Toast.show({
          type: 'error', // 'success', 'error', or 'info'
          position: 'top', // 'top', 'bottom', or 'center'
          text2: error.message ? error.message : JSON.stringify(error)
        });
      });
  }, []);

  //handles rooms
  useEffect(() => {
    if (!isModalVisible && !isViewDetailVisible && !isLoadingData) {
      let roomList = roomContext.roomList;
      if (roomList != undefined && roomList.length > 0) {
        setRooms(roomList);
      } else if (!hasError) {
        setRooms([]);
      }
    }
  }, [isModalVisible, isViewDetailVisible, isLoadingData]);

  // handles back button press event
  useEffect(() => {
    const backAction = () => {
      setTimeout(() => {
        setExitApp(0);
      }, 2000); // 2 seconds to tap second-time

      if (exitApp === 0) {
        setExitApp(exitApp + 1);
        Toast.show({
          type: 'info', // 'success', 'error', or 'info'
          position: 'top', // 'top', 'bottom', or 'center'
          text2: strings.tapAgainToExit
        });
      } else if (exitApp === 1) {
        BackHandler.exitApp();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  });

  const handleAdd = () => {
    setModalVisible(!isModalVisible);
  };

  const handleRefresh = async () => {
    setHasError(false);
    setIsLoadingData(true); 
    let response = await roomContext.loadRooms();
    let message = '';
    if (response && response.status === RESPONSE_STATUS.SUCCESS) {
      message = strings.roomsLoadedSuccessfully;
      await tenantContext.addTenants(response.responseData.tenantDetails);
      setRooms(roomContext.roomList);
    } else if (response && response.status === RESPONSE_STATUS.ERROR) {
      setHasError(true);
      message = response.errorMessage;
    }
    setIsLoadingData(false);
    //display error
    Toast.show({
      type: 'error', // 'success', 'error', or 'info'
      position: 'top', // 'top', 'bottom', or 'center'
      text2: message
    });
  };

  const handleItemClicked = room => {
    if (!isViewDetailVisible) {
      setSelectedRoom(room);
    } else {
      setSelectedRoom(null);
    }
    setIsViewDetailVisible(!isViewDetailVisible);
  };

  /*
   * method to handle Update tenant clicked
   */
  const handleUpdateTenantClicked = async room => {
    if (!isTenantDetailVisible) {
      setAddNewTenant(false);
      setSelectedRoom(room);
    } else {
      setSelectedRoom(null);
      await handleRefresh();
    }
    setIsTenantDetailVisible(!isTenantDetailVisible);
  };

  /*
   * method to handle Update tenant clicked
   */
  const handleAddTenantClicked = async room => {
    if (!isTenantDetailVisible) {
      setAddNewTenant(true);
      setSelectedRoom(room);

    } else {
      setSelectedRoom(null);
      await handleRefresh();
    }
    setIsTenantDetailVisible(!isTenantDetailVisible);
  };

  const handleDeleteTenantClicked = tenant =>{
    return Alert.alert(strings.areYouSureToDelete, '', [
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: strings.no,
      }, // The "Yes" button
      {
        text: strings.yes,
        onPress: async () => {
          setIsLoadingData(true);
          await tenantContext.deleteTenant(tenant);
          await handleRefresh();
          setIsLoadingData(false);
        },
      },
    ]);

  }
  
   /*
 * method to handle search functionality for pending rents
 * updates the search query state and filters the pending rents
 * based on the provided search text.
 */
  const handleSearch = text => { 
    setSearchQuery(text);
    const query = text.toLowerCase();

    const filtered = rooms.filter(room => {
      const roomName = room.roomName?.toLowerCase() || '';
      const roomNo = room.roomNo?.toString().toLowerCase() || '';
      const tenantName = room.tenantName?.toLowerCase() || '';
      
      return (
        roomName.includes(query)|| 
        roomNo.includes(query)||
        tenantName.includes(query));
      });

      setFilteredRooms(filtered);
  };
  
  /*
 * Re-filter search query or the pending room list
 */
  useEffect(() => {
    handleSearch(searchQuery); 
    }, [rooms]);

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder={strings.searchplaceholder}
        onChangeText={handleSearch}
        value={searchQuery}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInput}
        inputStyle={{ fontSize: FONT_CONSTANTS.FONT_SIZE_SMALL * 1.2 }} 
        clearIcon={{color: BUTTON_COLOR.CANCEL}}
        onClear={() => setSearchQuery('')}
      />
      <Modal isVisible={isModalVisible}>
        <AddRoomDetailScreen
          editMode={true}
          onCancelClicked={handleAdd}
        />
      </Modal>
      <Modal isVisible={isTenantDetailVisible}>
        <UpdateTenantDetailScreen
          selectedRoom={selectedRoom}
          addMode={addNewTenant}
          onCancelClicked={handleUpdateTenantClicked}
        />
      </Modal>
      <Modal isVisible={isViewDetailVisible}>
        <AddRoomDetailScreen
          editMode={false}
          selectedRoom={selectedRoom}
          onCancelClicked={handleItemClicked}
        />
      </Modal>
      <View style={styles.insideContainer}>
        <KVRoomListView
          dataSource={filteredRooms}
          primaryKey={PRIMARY_KEY}
          keyValues={ROOM_KEY_VALUES}
          onRefresh={handleRefresh}
          onItemClicked={item => handleItemClicked(item)}
          onAddTenantClicked={item => handleAddTenantClicked(item)}
          onUpdateTenantClicked={item => handleUpdateTenantClicked(item)}
          onDeleteTenantClicked={item => handleDeleteTenantClicked(item)}
          emptyLabel={strings.noRoomsAvailable}
        />
      </View>

      <FloatingAdd onClickHandler={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONTAINER_COLOR.BACKGROUNDCOLOR,
    padding: '2%',
    width: '100%',
    marginBottom: '10%'
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
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
  },
  searchContainer: {
    width:'103%',
    height:"2.2%",
    backgroundColor:CONTAINER_COLOR.BACKGROUNDCOLOR,
    marginLeft:'-2%',
    marginBottom: '7.5%',
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
