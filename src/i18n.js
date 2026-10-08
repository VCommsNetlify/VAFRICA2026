import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 1. Import all language JSON files matching their true language codes
import enTranslation from '../public/locales/en/translation.json';
import arTranslation from '../public/locales/ar/translation.json';
import idTranslation from '../public/locales/id/translation.json';
import frTranslation from '../public/locales/fr/translation.json';
import ruTranslation from '../public/locales/ru/translation.json';
import trTranslation from '../public/locales/tr/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation },
      id: { translation: idTranslation },
      fr: { translation: frTranslation },
      ru: { translation: ruTranslation },
      tr: { translation: trTranslation }
    },
    lng: 'en', // default starting language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;