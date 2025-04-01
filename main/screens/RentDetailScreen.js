import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ToastAndroid,
} from 'react-native';
import Modal from 'react-native-modal';
import FloatingAdd from '../components/FloatingAdd';
// import KVListView from '../components/KVListView';
import KVRentContext from '../contexts/KVRentContext';
import {Rent} from '../models/Rent';
import AddRentDetailScreen from './AddRentDetailScreen';
// import ViewPaidRentsScreen from './ViewPaidRentsScreen';
// import PaymentScreen from './PaymentScreen';
import KVRentListView from '../components/KVRentListView';
import {
  BUTTON_COLOR,
  CONTAINER_COLOR,
  FONT_CONSTANTS,
  INSIDE_CONTAINER_COLOR,HEADER_COLOR
} from '../constants/theme-constants';
import strings from '../localizations/screen';
import {RENT_STATUS, RESPONSE_STATUS, SCREEN_NAME} from '../constants/app-constants';

import {useIsMounted} from '../hooks/useIsMounted';
import {SearchBar} from 'react-native-elements';

const KEY_VALUES = Rent.getListViewProperties();
const PRIMARY_KEY = Rent.PRIMARY_KEY;

export default function RentDetailScreen({navigation}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleteClicked, setDeleteClicked] = useState(false);
  const [isViewDetailVisible, setIsViewDetailVisible] = useState(false);
  const [showPaidRents, setShowPaidRents] = useState(false);
  const [pendingRents, setPendingRents] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [status, setStatus] = useState(RENT_STATUS.PAID);
  const [showPayment, setShowPayment] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isMounted = useIsMounted();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRents, setFilteredRents] = useState([]);

  const rentContext = useContext(KVRentContext);

  useEffect(() => {
    rentContext
      .loadPendingRents()
      .then(response => {
        if (isMounted.current) {
          if (response.status === RESPONSE_STATUS.SUCCESS) {
            setPendingRents(rentContext.pendingRentList);
            setFilteredRents(rentContext.pendingRentList);
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

  useEffect(() => {
    if (rentContext.pendingRentList != undefined) {
      setPendingRents(rentContext.pendingRentList);
    }
  }, [
    isModalVisible,
    showPaidRents,
    isViewDetailVisible,
    isDeleteClicked,
    showPayment,
  ]);

  const handleAdd = item => {
    setModalVisible(!isModalVisible);
    if (!isModalVisible) {
      setSelectedItem(item);
    } else {
      setSelectedItem(null);
    }
  };

  const handleItemClicked = item => {
    if (!isViewDetailVisible) {
      setSelectedItem(item);
    } else {
      setSelectedItem(null);
    }
    setIsViewDetailVisible(!isViewDetailVisible);
  };

  /*
 * method to handle search functionality for pending rents
 * updates the search query state and filters the pending rents
 * based on the provided search text.
 */
  const handleSearch = text => {
    setSearchQuery(text);
    const query = text.toLowerCase(); 
    
    const filtered = pendingRents.filter(rent => {
      const roomName = rent.roomName?.toLowerCase() || '';
      const roomNo = rent.roomNo?.toString().toLowerCase() || '';
      const tenantName = rent.tenantName?.toLowerCase() || '';
  
      
      return (
        roomName.includes(query) ||
        roomNo.includes(query) ||
        tenantName.includes(query)
      );
    });
  
    setFilteredRents(filtered);
  };

  const handleViewPaidRentsClicked = data => {
    navigation.navigate(SCREEN_NAME.VIEWALLRENT);
  };


  /*
   * method to delete record with confirmation
   */
  const handleDeleteClicked = item => {
    return Alert.alert(strings.areYouSureToDelete, '', [
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: strings.no,
      }, // The "Yes" button
      {
        text: strings.yes,
        onPress: async () => {
          setIsLoading(true);
          await rentContext
            .deleteRent(item)
            .then(response => {
              if (response && response.status === RESPONSE_STATUS.SUCCESS) {
                ToastAndroid.showWithGravity(
                  strings.rent + ' ' + strings.deletedSuccessfully,
                  ToastAndroid.SHORT,
                  ToastAndroid.TOP,
                );
                setPendingRents(rentContext.pendingRentList);
              } else {
                throw response.errorMessage;
              }
            })
            .catch(error => {
              ToastAndroid.showWithGravity(
                error.message ? error.message : JSON.stringify(error),
                ToastAndroid.SHORT,
                ToastAndroid.TOP,
              );
            });
          setDeleteClicked(!isDeleteClicked);
          setIsLoading(false);
        },
      },
    ]);
  };
  const handlePayClicked = item => {
    setSelectedItem(item);
    setShowPayment(true);
  };

  const handleRefresh = async () => {
    setHasError(false);
    //setIsLoadingData(true);
    let response = await rentContext.loadPendingRents();
    let message = '';
    if (response && response.status === RESPONSE_STATUS.SUCCESS) {
      message = strings.rentsLoadedSuccessfully;
      setPendingRents(rentContext.pendingRentList);
    } else if (response && response.status === RESPONSE_STATUS.ERROR) {
      setHasError(true);
      message = response.errorMessage;
    }
    //setIsLoadingData(false);
    //display error
    ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.TOP);
  };

  const handlePayCancelClicked = () => {
    setShowPayment(false);
  };

  /*
 * Re-filter search query or the pending rents list
 */

  useEffect(() => {
    handleSearch(searchQuery);      
  }, [searchQuery, pendingRents]);  

  return (
    <View style={styles.container}>
      <Modal isVisible={isViewDetailVisible}>
        <AddRentDetailScreen
          editMode={false}
          selectedItem={selectedItem}
          onCancelClicked={handleItemClicked}
        />
      </Modal>
      <Modal isVisible={isModalVisible}>
        <AddRentDetailScreen
          editMode={true}
          selectedItem={selectedItem}
          onCancelClicked={handleAdd}
        />
      </Modal>

      {/* <Modal isVisible={showPaidRents}>
        <ViewPaidRentsScreen
          onCancelClicked={() => {
            setShowPaidRents(false);
          }}
        />
      </Modal> */}
      {/* <Modal isVisible={showPayment}>
        <PaymentScreen
          item={selectedItem}
          onCancelClicked={handlePayCancelClicked}></PaymentScreen>
      </Modal> */}
      <View style={styles.buttonContainer}>
        <Button
          title={strings.viewAllRents}
          color={BUTTON_COLOR.ACTIVE}
          onPress={() => handleViewPaidRentsClicked(RENT_STATUS.PAID)}
        />
      </View>
        <SearchBar
           placeholder={strings.searchplaceholder}
           onChangeText={handleSearch}
           value={searchQuery}
           containerStyle={styles.searchContainer}
           inputContainerStyle={styles.searchInput}
           inputStyle={{ fontSize: FONT_CONSTANTS.FONT_SIZE_SMALL * 1.2}} 
           clearIcon={{ color: BUTTON_COLOR.CANCEL }} // Use the BUTTON_COLOR.CANCEL constant for the clear icon color
           onClear={() => setSearchQuery('')} />

      <View style={styles.insideContainer}>
        <Text style={styles.pendingRents}>{strings.pendingRents}: </Text>
        <KVRentListView
         dataSource={filteredRents}
          primaryKey={PRIMARY_KEY}
          // keyValues={KEY_VALUES}
          status={status}
          onRefresh={handleRefresh}
          onItemClicked={item => handleItemClicked(item)}
          onUpdateClicked={item => handleAdd(item)}
          onCancelClicked={handleAdd}
          onDeleteClicked={item => handleDeleteClicked(item)}
          onPayClicked={item => handlePayClicked(item)}
          emptyLabel={strings.noPendingRents}
        />
      </View>

      <FloatingAdd onClickHandler={handleAdd} />
    </View>
  );
}


const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    padding: '1%',
  },
  container: {
    flex: 1,
    backgroundColor: CONTAINER_COLOR.BACKGROUNDCOLOR,
    padding: '2%',
    width: '100%',
    height: '50%',
    marginBottom: '10%'
  },
  insideContainer: {
    flex: 1,
    backgroundColor: INSIDE_CONTAINER_COLOR.BACKGROUNDCOLOR,
    height: '20%',
  },
  pendingRents: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    padding: '1%',
  },
  searchContainer: {
    width:'103%',
    height:"3.2%",
    backgroundColor:CONTAINER_COLOR.BACKGROUNDCOLOR,
    marginLeft:'-2%',
    marginBottom: '6%',
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
