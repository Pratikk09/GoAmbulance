import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import English from './en/translation.json';
import Hindi from './hi/translation.json';
import {getLanguage, setLanguage} from '../utils/general';

const combinedLang = {
  en: {translation: English},
  hi: {translation: Hindi},
};

const initI18n = async () => {
  const language = await getLanguage();
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources: combinedLang,
    lng: language || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export const changeLanguage = async (lang: string) => {
  await i18n.changeLanguage(lang);
  await setLanguage(lang);
};

export default i18n;
