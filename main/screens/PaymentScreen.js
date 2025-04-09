import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  ToastAndroid,
  Alert,
} from 'react-native';
import {KVMainView} from '../components/KVMainView';
import {RESPONSE_STATUS} from '../constants/app-constants';
import {BUTTON_COLOR, FONT_CONSTANTS,CONTAINER_COLOR,HEADER_COLOR} from '../constants/theme-constants';
import KVRentContext from '../contexts/KVRentContext';
import strings from '../localizations/screen';
import {Rent} from '../models/Rent';
import { translateNepaliNumber } from '../validation/translate';

export default function PaymentScreen(props) {
  const [paidRent, setPaidRent] = useState(new Rent());
  const [indicator, setIndicator] = useState(false);

  const rentContext = useContext(KVRentContext);
  /*
   * method to update initial value
   */
  useEffect(() => {
    if (props.item != undefined) {
      props.item.paidRent = '0';
      setPaidRent(props.item);
    }
  }, []);

  /*
   * method to update the key and value for state
   */
  const updateState = (key, value) => {
    setPaidRent(oldState => ({
      ...oldState,
      [key]: value,
    }));
  };

  const handlePaidRentChange = text => {
    let rent = paidRent;
    rent.paidRent = text;
    rentContext.calculatePaidRent(rent);
    setPaidRent({
      ...paidRent,
      ['paidRent']: rent.paidRent,
      ['pendingRent']: rent.pendingRent,
      ['status']: rent.status,
    });
  };

  /*
   * method to handle pay clicked
   */

  const handlePaidClicked = async () => {
    try {
      setIndicator(true);
      if (!paidRent.paidRent || paidRent.paidRent == '0') {
        throw strings.pleaseEnterRent;
      }
      //Ask to confirm the payment
      return Alert.alert(strings.areYouSureAboutPayment, '', [
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: strings.no,
          onPress: () => {
            setIndicator(false);
          },
        }, // The "Yes" button
        {
          text: strings.yes,
          onPress: async () => {
            let response = await rentContext.payRent(paidRent);
            if (response.status === RESPONSE_STATUS.SUCCESS) {
              ToastAndroid.showWithGravity(
                strings.rentPaidSuccessfully,
                ToastAndroid.SHORT,
                ToastAndroid.TOP,
              );
              setIndicator(false);
              props.onCancelClicked();
            } else {
              throw response.errorMessage;
            }
          },
        },
      ]);
    } catch (error) {
      setIndicator(false);
      ToastAndroid.showWithGravity(
        error.message ? error.message : JSON.stringify(error),
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    }
  };

  /*
   * method to handle cancel clicked
   */
  const handleCancelClicked = () => {
    props.onCancelClicked();
  };

  return (
    <View style={styles.container}>
        <ScrollView>
          <View>
            <Text style={styles.header}>{strings.rentPayment}</Text>
            <View style={styles.lineStyle} />
            <ScrollView>
              <View style={styles.roomContainer}>
                <Text style={[styles.text, styles.readonlyLabelStyle]}>
                  {strings.tenant}{' '}
                </Text>
                <Text style={[styles.text, styles.colonStyle]}>: </Text>
                <Text style={styles.readonlyValueStyle}>
                  {paidRent.tenantName}
                </Text>
              </View>

              <View style={styles.roomContainer}>
                <Text style={[styles.text, styles.readonlyLabelStyle]}>
                  {strings.roomName}{' '}
                </Text>
                <Text style={[styles.text, styles.colonStyle]}>: </Text>
                <Text style={styles.readonlyValueStyle}>
                  {paidRent.roomName}
                </Text>
              </View>
              <View style={styles.roomContainer}>
                <Text style={[styles.text, styles.readonlyLabelStyle]}>
                  {strings.electricityUnit}{' '}
                </Text>
                <Text style={[styles.text, styles.colonStyle]}>: </Text>
                <Text style={styles.readonlyValueStyle}>
                  {paidRent.electricityUnit}
                </Text>
              </View>

              <View style={styles.lineStyle} />

              <View style={styles.roomContainer}>
                <Text style={[styles.text, styles.readonlyLabelStyle]}>
                  {strings.roomRent}{' '}
                </Text>
                <Text style={[styles.text, styles.colonStyle]}>: </Text>
                <Text style={[styles.text, styles.readonlyValueStyle]}>
                  {paidRent.roomRent}
                </Text>
              </View>

              <View style={styles.roomContainer}>
                <Text style={[styles.text, styles.readonlyLabelStyle]}>
                  {strings.garbageCharge}{' '}
                </Text>
                <Text style={[styles.text, styles.colonStyle]}>: </Text>
                <Text style={[styles.text, styles.readonlyValueStyle]}>
                  {paidRent.garbageCharge}
                </Text>
              </View>

              <View style={styles.roomContainer}>
                <Text style={[styles.text, styles.readonlyLabelStyle]}>
                  {strings.electricityCharge}{' '}
                </Text>
                <Text style={[styles.text, styles.colonStyle]}>: </Text>
                <Text style={[styles.text, styles.readonlyValueStyle]}>
                  {paidRent.electricityCharge}
                </Text>
              </View>

              <View style={styles.roomContainer}>
                <Text style={[styles.text, styles.readonlyLabelStyle]}>
                  {strings.waterCharge}{' '}
                </Text>
                <Text style={[styles.text, styles.colonStyle]}>: </Text>
                <Text style={[styles.text, styles.readonlyValueStyle]}>
                  {paidRent.waterCharge}
                </Text>
              </View>

              <View style={styles.roomContainer}>
                <Text style={[styles.text, styles.readonlyLabelStyle]}>
                  {strings.previousDue}{' '}
                </Text>
                <Text style={[styles.text, styles.colonStyle]}>: </Text>
                <Text style={[styles.text, styles.readonlyValueStyle]}>
                  {paidRent.previousDue}
                </Text>
              </View>

              <View style={styles.lineStyle} />

              <View style={styles.roomContainer}>
                <Text style={[styles.text, styles.readonlyLabelStyle]}>
                  {strings.totalRent}{' '}
                </Text>
                <Text style={[styles.text, styles.colonStyle]}>: </Text>
                <Text style={[styles.text, styles.readonlyValueStyle]}>
                  {paidRent.totalRent}
                </Text>
              </View>

              <View style={styles.roomContainer}>
                <Text style={[styles.text, styles.readonlyLabelStyle]}>
                  {strings.paidRent}{' '}
                </Text>
                <Text style={[styles.text, styles.colonStyle]}>: </Text>
                <TextInput
                  style={[styles.input, styles.readonlyValueStyle]}
                  keyboardType="number-pad"
                  selectTextOnFocus
                  onChangeText={text => handlePaidRentChange(translateNepaliNumber(text))}
                  value={`${paidRent.paidRent}`}
                />
              </View>

              <View style={styles.roomContainer}>
                <Text style={[styles.text, styles.readonlyLabelStyle]}>
                  {strings.pendingRent}{' '}
                </Text>
                <Text style={[styles.text, styles.colonStyle]}>: </Text>
                <Text style={styles.text}>{paidRent.pendingRent} </Text>
              </View>
            </ScrollView>
          </View>
            
        </ScrollView>
          <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Button title={strings.paid} color={BUTTON_COLOR.PAY} onPress={handlePaidClicked} />
          </View>

              <View style={styles.button}>
                <Button title={strings.cancel} color={BUTTON_COLOR.CANCEL} onPress={handleCancelClicked} />
              </View>
          </View>
      
    </View>
  );
}

/*
 * style css class
 */
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    width: '100%',
    borderColor: 'white',
    borderRadius: 5,
    padding: '5%',
    backgroundColor: CONTAINER_COLOR.OPTIONALWHITE ,
    marginBottom:"5%"
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: HEADER_COLOR.OPTIONAL_TITLE,
    margin: '2%',
  },
  text: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderBottomColor: HEADER_COLOR.OPTIONAL_TITLE,
    borderRadius: 5,
    padding: '1%',
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    minHeight: FONT_CONSTANTS.FONT_SIZE_MEDIUM + 10,
    width: '50%',
    textAlign: 'right',
  },
  header: {
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    fontWeight: 'bold',
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom: '1%',
  },
  button: {
    marginTop: '10%',
    justifyContent: 'flex-end',
    
  },
  buttonContainer: {
    marginTop:"25%",
    justifyContent: 'flex-end',
    alignContent: 'baseline',
    height: '13%',
  },
  roomContainer: {
    flexDirection: 'row',
    marginTop: '2%',
    marginBottom: '1%',
    justifyContent: 'flex-end',
  },
  readOnlyLabelStyle: {
    flex: 1,
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
    fontWeight: 'bold',
  },
  readOnlyValueStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
  },
  colonStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    fontSize: FONT_CONSTANTS.FONT_SIZE_MEDIUM,
  },
});
