import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const BUTTON_COLOR = {
  ACTIVE: 'cadetblue',
  CANCEL: '#a3a3a3',
  DELETE: '#fc3030',
  UPDATE: '#3b70bf',
  PAY: '#00ad51'
};

export const BUTTON_STYLE = {
  TEXT_COLOR: 'white',
};

export const HEADER_COLOR = {
  TITLE: '#fff',
  OPTIONAL_TITLE:'black'

};

export const CONTAINER_COLOR = {
  BACKGROUNDCOLOR: 'GREY',
  LIGHTGREY: '#ebe8e8',
  OPTIONALWHITE:"#fff"
};
export const INSIDE_CONTAINER_COLOR = {
  BACKGROUNDCOLOR: 'GREY',
};

export const LISTVIEW_BACKGROUND_COLOR = {
  BACKGROUNDCOLOR: 'paleturquoise',
};

export const FONT_CONSTANTS = {
  FONT_SIZE_MEDIUM: height / 55,
  FONT_SIZE_SMALL: height/55 * 0.8
};

export const ICON_CONSTANTS = {
  ICON_SIZE_SMALL: height/55 * 0.8,
  ICON_SIZE_MEDIUM: height/55 * 1.5,
  ICON_BORDER_COLOR: "gray",
  ICON_COLOR:"black",
  ICON_BUTTON_COLOR:"white",
  ICON_BACKGROUND_COLOR:"#27667B"
}

export const DIMENSIONS = {
  HEIGHT: height,
  WIDTH: width,
};
export const OTP_INPUT_BOX_COLOR = {
  HIGHLIGHTED_BODERBOTTOM_COLOR: '#FB6C6A',
  DEFAULT_BORDERBOTTOM_COLOR: '#234DB7',
  ENABLED_COLOR: '#234db7',
  DISABLED_COLOR: 'gray',
};
export const LANGUAGE_CHANGE_TOGGLE_BUTTON = {
  // size of switch button
  languageSwitchButtonSize: {
    transform: [{scaleX: 0.9}, {scaleY: 0.9}], // Adjust size
  },
  switchTrackColor: {
    false: '#FF9500', // Orange track when switch is OFF
    true: '#007AFF', // Blue track when switch is ON
  },
  thumbColorOff: '#FF9500', // Orange thumb when switch is OFF
  thumbColorOn: '#007AFF', // Blue thumb when switch is ON
};

