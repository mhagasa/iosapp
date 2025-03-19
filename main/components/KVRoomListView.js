import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Button} from 'react-native-paper';
import {BUTTON_COLOR, CONTAINER_COLOR, FONT_CONSTANTS, ICON_CONSTANTS} from '../constants/theme-constants';
import strings from '../localizations/screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import KVTenantContext from '../contexts/KVTenantContext';
import {OCCUPANCY} from '../constants/app-constants';

function KVCollapse(props) {
  const [openArrow, setOpenArrow] = useState(true);
  const [tenant, setTenant] = useState({});

  const tenantContext = useContext(KVTenantContext);

  useEffect(() => {
    if (props.item && props.item.tenantId) {
      let tenant = tenantContext.getTenantFromRoomId(props.item._id);
      if (tenant) {
        setTenant(tenant);
      }else{
        setTenant(null);
      }
    }else{
      setTenant(null);
    }
  }, [props]);

  return (
    <View style={styles.tenantContainer}>
      <View style={styles.arrowContainer}>
      <TouchableOpacity onPress={() => setOpenArrow(!openArrow)}>
          <View style={styles.tenantHeader}>
            {openArrow ? (
              <Ionicons name="caret-down" size={ICON_CONSTANTS.ICON_SIZE_SMALL} />
            ) : (
              <Ionicons name="caret-up" size={ICON_CONSTANTS.ICON_SIZE_SMALL} />
            )}
            <Text>{strings.tenantDetails}</Text>

            <View style={styles.icon}>         
              <TouchableOpacity style={styles.iconWrapper} onPress={() => props.handleAddTenant(props.item)}>
                <Ionicons
                  name="add-outline"
                  size={ICON_CONSTANTS.ICON_SIZE_SMALL*1.5}
                  style={styles.icon}
                  color={ICON_CONSTANTS.ICON_BUTTON_COLOR}
                  />
              </TouchableOpacity>

              {tenant?.tenantPhone ? (
              <>
                <TouchableOpacity style={styles.iconWrapper} onPress={() => props.handleUpdateTenant(props.item)}>
                  <Ionicons
                    name="pencil-outline"
                    size={ICON_CONSTANTS.ICON_SIZE_SMALL* 1.5}
                    style={styles.icon}
                    color={ICON_CONSTANTS.ICON_BUTTON_COLOR}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconWrapper} onPress={() => props.handleDeleteTenant(tenant)}>
                  <Ionicons
                    name="trash-outline"
                    size={ICON_CONSTANTS.ICON_SIZE_SMALL * 1.5}
                    style={styles.icon}
                    color={ICON_CONSTANTS.ICON_BUTTON_COLOR}
                    />
                </TouchableOpacity>
              </>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
        {openArrow ? (
          <View>
            <View style={styles.lineStyle}></View>
            <View style={styles.buttonContainer}>
              <View style={styles.details}>
                <View style={styles.rentContainer}>
                  <Text style={styles.textValue}>{tenant?.tenantName}</Text>
                </View>
                <View style={styles.IconContainer}>
                <Text style={styles.textValue}>{tenant?.tenantPhone}</Text>

                
               </View>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </View>
    
  );
}

export default function KVRoomListView(props) {
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
                  <Text style={styles.text}>{strings.price} :</Text>
                  <Text style={styles.textValue}>{item.price}</Text>
                </View>
                <View style={styles.rentContainer}>
                  <Text style={styles.text}>{strings.occupancy} :</Text>
                  <Text style={styles.textValue}>
                    {OCCUPANCY[item.occupancy.toUpperCase()]}
                  </Text>
                </View>
                <View style={styles.rentContainer}>
                  <Text style={styles.text}>{strings.floor} :</Text>
                  <Text style={styles.textValue}>{item.floor}</Text>
                </View>
              </View>
              <View style={styles.lineStyle}></View>
              <KVCollapse
                item={item}
                handleAddTenant={props.onAddTenantClicked}
                handleUpdateTenant={props.onUpdateTenantClicked}
                handleDeleteTenant={props.onDeleteTenantClicked}>
                </KVCollapse>
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
    marginTop: '3%',
    borderRadius: 10,
    borderWidth: 0.2,
    padding: '1%',
    backgroundColor:CONTAINER_COLOR.OPTIONALWHITE,
    elevation: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 5, height: 5 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    marginBottom:5
  },
  tenantContainer: {
    flex: 1,
    marginTop: '1%',
    borderRadius: 10,
    borderWidth: 0.2,
    padding: '1%',
    backgroundColor:CONTAINER_COLOR.TABCONTAINERCOLOR
    
  },
  tenantHeader:{
    flex: 1, 
    alignItems: 'center', 
    flexDirection: 'row', 
    padding:'1%',
    elevation: 10
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    padding: 0,
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    margin: '1%',
  },
  details: {
    width: '100%',
  },
  viewButton: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    margin: '2%',
    flex: 1,
    flexDirection:'row', 
    alignItems:'flex-end', 
  },
  addTenant: {
    fontSize: FONT_CONSTANTS.FONT_SIZE,
    color: 'midnightblue',
    alignSelf: 'center',
    margin: '1%',
    marginHorizontal: '2%'
  },
  rentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '2%',
  },
  buttonText: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_SMALL,
    color: 'midnightblue',
    textDecorationLine: 'underline',
    fontWeight: 'ultralight'
  },
  colonStyle: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    width: '1%',
    fontWeight: 'bold',
  },
  textValue: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    color: 'midnightblue',
    fontWeight: 'bold',

  },
  dateTextValue: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM - 5,
    color: 'midnightblue',
  },
  roomName: {
    padding: '2%',
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    color: 'midnightblue',
    fontWeight: 'bold',
    width: '70%',
  },
  noRoom: {
    flex: 1,
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    textAlign: 'center',
    marginVertical: '30%',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  button: {
  },
  touchableOpacityStyle: {
    width: '90%',
  },
  tenantbutton:{
    flex: 1,
    flexDirection: 'row', 
    alignItems:'flex-end', 
    justifyContent: 'flex-end',
    
  },
  detailIcon: {
    marginLeft: 'auto',
    backgroundColor:ICON_CONSTANTS.ICON_BACKGROUND_COLOR,
    margin: '2%',
    borderRadius:100
  },
  iconWrapper:{
      backgroundColor:ICON_CONSTANTS.ICON_BACKGROUND_COLOR,
      borderRadius:5,
      padding:'2%',
  },
  IconContainer: {
    flexDirection: "row", 
    marginLeft:'2%',
    marginBottom:'1%', 
  },
  icon:{
    flexDirection: "row",
    marginLeft:'auto',
    gap: '2%',
    justifyContent:'space-around',
    paddingHorizontal:'0.3%'
  }
});
