import LocalizedStrings from 'react-localization';

import {DevSettings} from 'react-native';
import ENGLISH from './en';
import NEPALI from './ne';

let strings = new LocalizedStrings({
  en: ENGLISH,
  ne: NEPALI,
});

export default strings;

export const changeLanguage = languageKey => {
  strings.setLanguage(languageKey);
  //DevSettings.reload();
};
