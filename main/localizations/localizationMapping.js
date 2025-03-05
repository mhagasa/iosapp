import en from './en';
import ne from './ne';
import errorToStringMap from '../constants/errorConstants';
import strings from './screen';

export function getCurrentLanguage() {
  return strings.getLanguage();
}

export function getErrorMessage(errorCode) {
  const localizationMap = { en, ne };
  const localizationStrings = localizationMap[getCurrentLanguage()];
  const localizationKey = errorToStringMap[errorCode];

  return localizationStrings?.[localizationKey] || null;
}