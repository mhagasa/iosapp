import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {FONT_CONSTANTS, CONTAINER_COLOR} from '../constants/theme-constants';
// import {strings} from '../localizations/screen';

export default function KVListView(props) {
  const [refreshing, setRefreshing] = useState(false);
  const touchDisabled = props.disabled ? props.disabled : false;

  const handleRefresh = () => {
    setRefreshing(true);
    props.onRefresh();
    setRefreshing(false);
  };

  return (
    <View>
      <ScrollView
        style={styles.scrollview}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        {props.dataSource && props.dataSource.length > 0 ? (
          props.dataSource.map((item, index) =>
            item != null ? (
              <TouchableOpacity
                disabled={touchDisabled}
                key={item[props.primaryKey]}
                style={styles.container}
                onPress={() => props.onItemClicked(item)}>
                {Object.keys(props.keyValues).map((itemKey, indexKey) => (
                  <View key={indexKey}>
                    {itemKey.includes('sectionBreak') ? (
                      <View style={styles.lineStyle} />
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                        }}>
                        <Text style={styles.text}>
                          {props.keyValues[itemKey]}
                        </Text>
                        <Text style={styles.colonStyle}> : </Text>
                        <Text style={styles.valueText}>
                          {item[itemKey] &&
                          item[itemKey].toString().includes('00.000Z')
                            ? item[itemKey].substring(0, 10)
                            : item[itemKey]}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </TouchableOpacity>
            ) : null,
          )
        ) : (
          <Text style={styles.noRoom}>{props.emptyLabel}</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    position: 'absolute',
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    margin: '1%',
  },
  scrollview: {
    //position:'absolute',
    width: '100%',
  },
  container: {
    flex: 1,
    marginTop: '1%',
    //backgroundColor: 'paleturquoise',
    borderRadius: 5,
    borderWidth: 0.2,
    margin: '3%',
    padding: '1%',
    justifyContent: 'space-between',
    width: '95%',
    backgroundColor:CONTAINER_COLOR.OPTIONALWHITE,
    elevation: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 5, height: 5 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    marginBottom:5
  },
  text: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    color: 'midnightblue',
    fontWeight: 'bold',
    paddingLeft: '2%',
  },
  colonStyle: {
    flex: 1,
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    textAlign: 'left',
    paddingLeft: '1%',
  },
  valueText: {
    flex: 1,
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    paddingRight: '3%',
    fontStyle: 'italic',
    color: '#4f603c',
    textAlign: 'right',
  },
  noRoom: {
    flex: 1,
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM + 10,
    textAlign: 'center',
    marginVertical: '40%',
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    margin: '1%',
  },
});
