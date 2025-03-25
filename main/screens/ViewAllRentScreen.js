import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  ToastAndroid,
  Button,
} from 'react-native';

import Modal from 'react-native-modal';


// import KVListView from '../components/KVListView';
import KVRentListView from '../components/KVRentListView';
import {RESPONSE_STATUS} from '../constants/app-constants';
import {
  BUTTON_COLOR,
  CONTAINER_COLOR,
  DIMENSIONS,HEADER_COLOR,FONT_CONSTANTS
} from '../constants/theme-constants';
import KVRentContext from '../contexts/KVRentContext';
import strings from '../localizations/screen';

import {Rent} from '../models/Rent';
import KVButton from '../components/KVButton';
import { useIsMounted } from '../hooks/useIsMounted';

// import AddRentDetailScreen from './AddRentDetailScreen';
import {SearchBar,Icon} from 'react-native-elements';

const PRIMARY_KEY = Rent.PRIMARY_KEY;

export default function ViewAllRentScreen({navigation}) {
  const KEY_VALUES = Rent.getListViewProperties();

  const [isModalVisible, setModalVisible] = useState(false);
  const [isViewDetailVisible, setIsViewDetailVisible] = useState(false);
  const [rents, setRents] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const rentContext = useContext(KVRentContext);

  const isMounted = useIsMounted();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRents, setFilteredRents] = useState([]);
  
  /*
   * handle all rent
   */
  useEffect(() => {
      rentContext
        .loadAllRents()
        .then(response => {
          if (isMounted.current) {
            if (response.status === RESPONSE_STATUS.SUCCESS) {
              setRents(rentContext.allRentList);
            } else {
              throw response.errorMessage;
            }
          }
        })
        .catch(error => {
          ToastAndroid.showWithGravity(
            error.message ? error.message : JSON.stringify(error),
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );
        });
    }, []);

  // handles back button press event
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true; // Prevent default
        }
        return false; // Allow default
      }
    );

    return () => backHandler.remove();
  }, []);

  /*
   * Re-filter search query or the pending rents list
   */
  useEffect(() => {
    handleSearch(searchQuery);
  }, [rents,searchQuery]);


  /*
   * handle item viewed
   */
  const handleItemClicked = item => {
    if (!isViewDetailVisible) {
      setSelectedItem(item);
    } else {
      setSelectedItem(null);
    }
    setIsViewDetailVisible(!isViewDetailVisible);
  };

  

  const handleRefresh = async () => {
    setIsRefreshing(true);
    let response = await rentContext.loadAllRents();
    setIsRefreshing(false);
    let message = '';
    if (response && response.status === RESPONSE_STATUS.SUCCESS) {
      setRents(response.responseData);
      message = strings.roomsLoadedSuccessfully;
    } else if (response && response.status === RESPONSE_STATUS.ERROR) {
      message = response.errorMessage;
    }
    //display error
    ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.TOP);
  };

  /*
   * method to handle search functionality for pending rents
   * updates the search query state and filters the pending rents
   * based on the provided search text.
   */
  const handleSearch = text => { 
    setSearchQuery(text);
    const query = text.toLowerCase();

    const filtered = rents.filter(rent => {
      const roomName = rent.roomName?.toLowerCase() || '';
      const roomNo = rent.roomNo?.toString().toLowerCase() || '';
      const tenantName = rent.tenantName?.toLowerCase() || '';
      
      return (
        roomName.includes(query) || 
        roomNo.includes(query)||
        tenantName.includes(query)
      );
    });

    setFilteredRents(filtered);
  };


  return (
    <View style={styles.container}>
     <SearchBar
        placeholder={strings.searchplaceholder}
        onChangeText={handleSearch}
        value={searchQuery}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInput}
        inputStyle={{ fontSize: FONT_CONSTANTS.FONT_SIZE_SMALL * 1.2 }} 
        clearIcon={{ color: BUTTON_COLOR.CANCEL }}
        onClear={() => {
          setSearchQuery('');
          setFilteredRents(rents);
        }}
      />
      {/* <Modal isVisible={isViewDetailVisible}>
        <AddRentDetailScreen
          editMode={false}
          selectedItem={selectedItem}
          onCancelClicked={handleItemClicked}
        />
      </Modal> */}
        
      <View style={styles.listView}>
        <KVRentListView
          dataSource={filteredRents}
          primaryKey={PRIMARY_KEY}
          keyValues={KEY_VALUES}
          onRefresh={handleRefresh}
          onItemClicked={item => handleItemClicked(item)}
          emptyLabel={strings.noPendingRents}
          hideButton={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONTAINER_COLOR.BACKGROUNDCOLOR,
    paddingBottom: '1%',
    marginBottom: '10%',
    width: '100%',
    height: '55%'
  },
  listView: {
    margin: '2%',
    height: '95%'
  },
  searchContainer: {
    width:'98%',
    height:"1.2%",
    backgroundColor:CONTAINER_COLOR.BACKGROUNDCOLOR,
    marginLeft:'1%',
    marginBottom: '7.5%',
    borderBottomWidth: 0, // Removes the bottom border
    borderTopWidth: 0,    // Removes the top border
    borderColor:CONTAINER_COLOR.BACKGROUNDCOLOR
  },
  searchInput: {
     alignItems:'center',
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
