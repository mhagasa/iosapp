import { DATE_SYSTEM } from "../constants/app-constants";
import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarPicker } from 'react-native-nepali-picker';

export function KVDatePicker(props) {
    // Handle Nepali date selection
    const handleNepaliDate = (selectedDate) => {
        if (props.onDateSelect && typeof props.onDateSelect === 'function') {
            props.onDateSelect(new Date(selectedDate));
        } else {
            console.warn('onDateSelect is not defined or not a function');
        }
    };

    // Handle English date selection
    const handleEnglishDate = (event, selectedDate) => {
        if (props.onDateSelect && typeof props.onDateSelect === 'function') {
            selectedDate = selectedDate.toISOString().substring(0, 10)
            props.onDateSelect(new Date(selectedDate));
        } else {
            console.warn('onDateSelect is not defined or not a function');
        }
    };

    return (
        <>
            {props.dateSystem === DATE_SYSTEM.BS ? (
                <CalendarPicker
                    onClose={() => props.onCloseClicked()}
                    onDateSelect={handleNepaliDate}
                />
            ) : (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date()}
                    mode="date"
                    onChange={handleEnglishDate}
                    display="calendar"
                />
            )}
        </>
    );
}
