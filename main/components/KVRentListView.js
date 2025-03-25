import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Button} from 'react-native-paper';
import KVCollapse from './KVCollapse';
import {BUTTON_COLOR, CONTAINER_COLOR, FONT_CONSTANTS, ICON_CONSTANTS} from '../constants/theme-constants';
import strings from '../localizations/screen';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function KVRentListView(props) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    props.onRefresh();
    setRefreshing(false);
  };

  return (
    <View>
      <ScrollView
        style={styles.scrollview}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        {props.dataSource && props.dataSource.length > 0 ? (
          props.dataSource.map((item, index) => (
            <TouchableOpacity
              key={item[props.primaryKey]}
              style={styles.container}
              disabled={true}>
              <View style={styles.header}>
                <Text style={styles.roomName}>
                  {item.roomName} ( {item.tenantName} )
                </Text>
                {/* Insert Detail Icon Instead of Buttons */}
                <TouchableOpacity style={styles.detailIcon} onPress={() => props.onItemClicked(item)}>
                  <Ionicons
                    name="information-outline"
                    size={ICON_CONSTANTS.ICON_SIZE_MEDIUM}
                    color={ICON_CONSTANTS.ICON_BUTTON_COLOR}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.lineStyle}></View>
              <View style={styles.details}>
                <View style={styles.rentContainer}>
                  <Text style={styles.text}>{strings.roomRent}</Text>
                  <Text style={styles.colonStyle}>:</Text>
                  <Text style={styles.textValue}>{item.roomRent}</Text>
                </View>
                <View style={styles.rentContainer}>
                  <Text style={styles.text}>{strings.previousDue}</Text>
                  <Text style={styles.colonStyle}>:</Text>
                  <Text style={styles.textValue}>{item.previousDue}</Text>
                </View>
                <View style={styles.rentContainer}>
                  <Text style={styles.text}>{strings.totalRent}</Text>
                  <Text style={styles.colonStyle}>:</Text>
                  <Text style={styles.textValue}>{item.totalRent}</Text>
                </View>
                <View style={styles.rentContainer}>
                  <Text style={styles.text}>{strings.paidRent}</Text>
                  <Text style={styles.colonStyle}>:</Text>
                  <Text style={styles.textValue}>{item.paidRent}</Text>
                </View>
                <View style={styles.rentContainer}>
                  <Text style={styles.text}>{strings.fromDate}</Text>
                  <Text style={styles.colonStyle}>:</Text>
                  <Text style={styles.textValue}>{item.dateStart.substring(0, 10)}</Text>
                </View>
                <View style={styles.rentContainer}>
                  <Text style={styles.text}>{strings.toDate}</Text>
                  <Text style={styles.colonStyle}>:</Text>
                  <Text style={styles.textValue}>{item.dateEnd.substring(0, 10)}</Text>
                </View>
              </View>
              {!props.hideButton? 
              <View style={styles.tenantContainer}>
                <KVCollapse
                  item={item}
                  handleUpdate={props.onUpdateClicked}
                  handleDeleteClicked={props.onDeleteClicked}
                  handlePayClicked={props.onPayClicked}></KVCollapse>                   
              </View>:
              <View style={styles.rentContainer}>
                <Text style={styles.text}>{strings.status}</Text>
                <Text style={styles.colonStyle}>:</Text>
                <Text style={styles.textValue}>{item.status}</Text>
              </View>
              }
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noRoom}>{props.emptyLabel}</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 4,
    //backgroundColor: 'paleturquoise',
    borderRadius: 10,
    borderWidth: 0.2,
    padding: 2,
    backgroundColor:CONTAINER_COLOR.OPTIONALWHITE,
    elevation: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 5, height: 5 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    marginBottom:5
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    padding: 0,
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    margin: 1,
  },
  details: {
    width: '100%',
  },
  viewButton: {
    fontSize: 10,
    color: 'midnightblue',
    width: '40%',
  },
  detailIcon: {
    marginLeft: 'auto',
    backgroundColor:ICON_CONSTANTS.ICON_BACKGROUND_COLOR,
    margin: '2%',
    borderRadius:100
  },
  rentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '2%',
  },
  text: {
    width: '30%',
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    color: 'midnightblue',
  },
  colonStyle: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    width: '2%',
    fontWeight: 'bold',
  },
  textValue: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    color: 'midnightblue',
    fontWeight: 'bold',
    width: '30%',
    textAlign: 'right'
  },
  dateTextValue: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM - 5,
    color: 'midnightblue',
  },
  roomName: {
    padding: 10,
    fontSize: 15,
    color: 'midnightblue',
    fontWeight: 'bold',
    width: '70%',
  },
  noRoom: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 250,
  },
  tenantContainer: {
    flex: 1,
    marginTop: '1%',
    borderRadius: 10,
    borderWidth: 0.2,
    padding: '1%',
    backgroundColor:CONTAINER_COLOR.TABCONTAINERCOLOR
    
  }
});
